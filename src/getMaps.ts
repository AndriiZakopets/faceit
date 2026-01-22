import * as api from './api';
import { Match } from './api/schemas';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const OPPONENT_ROSTER = [
    // '29785d40-223a-41fe-8c04-f0d7413004d3', // "SRYKKK"
    '13463809-6431-418d-9d4e-87716f9b3c30', // "Bla1se_"
    // 'fbab250f-0bbf-4514-a20a-ba15c89a24b5', // "IsweeZHD"
    '2d2c0d15-16ee-4673-b95d-88fb86592d62', // "Skur0"
    'd92b9e2e-f2c4-458b-bd01-b85217f7ea3e', // "ManS-"
    '8f180385-bd39-4ea6-89f3-c524b423ea96', // "DaftSystem"
    '2f3255f9-7140-4558-b452-1ae3ae7e18b8', // "Tartiflexxx_"
];
const KANTALUPA_ROSTER = [
    '94b493a4-3132-436e-9c8a-1437194c152e',
    'a7520c05-0175-429a-b5d7-ee3a358b5de2',
    '0e982314-2892-4eff-ab06-21103803e213',
    '75ce1ea9-4996-48f4-9595-76667a062d49',
    '3dd9ade4-3b35-4de3-add9-9a1f7c8e0947',
];
const ONE_DAY = 24 * 60 * 60 * 1000;

const getMatchesWithAtLeastNPlayers = async (roaster: string[], minPlayers: number, minDate?: number) => {
    if (roaster.length < 5) {
        throw new Error('Roster must have at least 5 players');
    }
    if (minPlayers > roaster.length) {
        throw new Error('minPlayers cannot be greater than roster size');
    }
    const requiredPlayersCountToFetch = 1 + roaster.length - minPlayers;
    let matches: Match[] = [];
    let totalMatches = 0;
    for (let i = 0; i < requiredPlayersCountToFetch; i += 1) {
        const playerId = roaster[i]!;
        process.stdout.write(`\rFetching matches for player ${i + 1}/${requiredPlayersCountToFetch}...`);
        const playerMatches = await api.getLastNMatches(playerId, 10000, minDate);
        totalMatches += playerMatches.length;
        const filteredMatches = playerMatches.filter((match) => {
            const playingPlayersInRoster = match.playing_players.filter((playerId) => roaster.includes(playerId));
            if (playingPlayersInRoster.length < minPlayers) return false;
            if (minDate && match.finished_at * 1000 < minDate) return false;
            return true;
        });
        const newMatches = filteredMatches.filter((match) => !matches.some((m) => m.match_id === match.match_id));
        matches = matches.concat(newMatches);
        await sleep(1000);
    }
    process.stdout.write(`\rFetched a total of ${totalMatches} matches with at least ${minPlayers} players from the roster.\n`);
    return matches;
};

type MatchOutcome = {
    map: string;
    rws: number;
};

const getMatchesOutcomes = async (roaster: string[], matches: Match[]): Promise<MatchOutcome[]> => {
    const outcomes: MatchOutcome[] = [];
    const { default: pThrottle } = await import('p-throttle');
    const throttle1 = pThrottle({ limit: 10, interval: 1000 })(<T>(fn: () => Promise<T>) => fn());
    const throttle2 = pThrottle({ limit: 1, interval: 2000 })(<T>(fn: () => Promise<T>) => fn());
    let processed = 0;
    await Promise.all(
        matches.map(async (match) => {
            const [matchDetails, matchStats] = await Promise.all([
                throttle1(() => api.getMatchDetails(match.match_id).catch(() => null)),
                throttle2(() =>
                    api.getMatchStatistics(match.match_id).catch((e) => {
                        // console.log(`\nFailed to fetch stats for match ${match.match_id}: ${e.message}`);
                        return null;
                    })
                ),
            ]);
            process.stdout.write(`\rProcessed match ${++processed}/${matches.length}...`);

            if (!matchDetails || !matchStats || matchDetails.voting.map.pick.length !== 1) {
                return;
            }

            const playersStats = matchStats.payload.cs2.teams.flatMap((team) => team.players || []);
            const stats = {
                count: 0,
                rws: 0,
            };
            const playersRws = playersStats.forEach((player) => {
                if (!roaster.includes(player.player_id)) {
                    return;
                }

                stats.count += 1;
                const playerRws = player.total.rws || 0;
                stats.rws += playerRws / 100;
            });

            const remainingRws = 1 - stats.rws;
            const remainingPlayers = 10 - stats.count;
            const avgRwsPerRemainingPlayer = remainingRws / remainingPlayers;
            const missingPlayers = 5 - stats.count;
            const rws = stats.rws + missingPlayers * avgRwsPerRemainingPlayer;

            const map = matchDetails.voting.map.pick[0]!;
            // const isFaction1 = matchDetails.teams.faction1.roster.some((player) => roaster.includes(player.player_id));
            // const isWin = isFaction1 ? matchDetails.results.winner === 'faction1' : matchDetails.results.winner === 'faction2';
            const outcome: MatchOutcome = {
                map,
                rws,
            };
            outcomes.push(outcome);
        })
    );
    process.stdout.write('\n');
    return outcomes;
};

type OutcomesRecord = Record<
    string,
    {
        i: number;
        t: number;
    }
>;

const getOutcomesRecord = (outcomes: MatchOutcome[]): OutcomesRecord => {
    const record: OutcomesRecord = {
        de_nuke: { i: 0, t: 0 },
        de_ancient: { i: 0, t: 0 },
        de_inferno: { i: 0, t: 0 },
        de_overpass: { i: 0, t: 0 },
        de_dust2: { i: 0, t: 0 },
        de_anubis: { i: 0, t: 0 },
        de_mirage: { i: 0, t: 0 },
    };
    outcomes.forEach((outcome) => {
        if (!record[outcome.map]) {
            return;
        }
        record[outcome.map]!.t += 1;
        record[outcome.map]!.i += outcome.rws;
    });
    return record;
};

async function main(roster: string[]) {
    const minPlayers = process.argv[2] ? parseInt(process.argv[2]!, 10) : 5;
    const matches = await getMatchesWithAtLeastNPlayers(roster, minPlayers, Date.now() - 300 * ONE_DAY);
    const outcomes = await getMatchesOutcomes(roster, matches);
    const record = getOutcomesRecord(outcomes);
    console.log(
        Object.fromEntries(
            Object.entries(record).map(([map, rec]) => {
                const s = `${((100 * rec.i) / rec.t || 0).toFixed(2)}% / ${rec.t}`;
                return [map, s];
            })
        )
    );
}

main(KANTALUPA_ROSTER);
