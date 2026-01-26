import * as api from './api';
import { Match } from './api/schemas';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const OPPONENT_ROSTER = [
    '4e788df8-ef59-4afa-a7fa-dc546e33f842', // "5hend1"
    '54f563a6-16c1-4f87-b29e-bb737446fd72', // "HeavyDomin"
    '59a8b3cb-24cf-4959-8e90-93d5819e467a', // "_Sw1M_"
    '90b060b6-cbe5-4a71-aeff-faa54efc7818', // "xN1c0x"
    '59bb3429-da27-4cde-b40b-8dd6860702ef', // "xSali"
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
    isWin: boolean;
};

const getMatchesOutcomes = async (roaster: string[], matches: Match[]): Promise<MatchOutcome[]> => {
    const outcomes: MatchOutcome[] = [];
    const { default: pThrottle } = await import('p-throttle');
    const throttle1 = pThrottle({ limit: 10, interval: 1000 })(<T>(fn: () => Promise<T>) => fn());
    const throttle2 = pThrottle({ limit: 1, interval: 2000 })(<T>(fn: () => Promise<T>) => fn());
    let processed = 0;
    await Promise.all(
        matches.map(async (match) => {
            const [matchDetails] = await Promise.all([throttle1(() => api.getMatchDetails(match.match_id).catch(() => null))]);
            process.stdout.write(`\rProcessed match ${++processed}/${matches.length}...`);
            if (!matchDetails) {
                return;
            }

            const map = matchDetails.voting.map.pick[0]!;
            const isFaction1 = matchDetails.teams.faction1.roster.some((player) => roaster.includes(player.player_id));
            const isWin = isFaction1 ? matchDetails.results.winner === 'faction1' : matchDetails.results.winner === 'faction2';
            const outcome: MatchOutcome = {
                map,
                isWin,
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
        w: number;
        t: number;
    }
>;

const getOutcomesRecord = (outcomes: MatchOutcome[]): OutcomesRecord => {
    const record: OutcomesRecord = {
        de_nuke: { w: 0, t: 0 },
        de_ancient: { w: 0, t: 0 },
        de_inferno: { w: 0, t: 0 },
        de_overpass: { w: 0, t: 0 },
        de_dust2: { w: 0, t: 0 },
        de_anubis: { w: 0, t: 0 },
        de_mirage: { w: 0, t: 0 },
    };
    outcomes.forEach((outcome) => {
        if (!record[outcome.map]) {
            return;
        }
        record[outcome.map]!.t += 1;
        if (outcome.isWin) {
            record[outcome.map]!.w += 1;
        }
    });
    return record;
};

async function main(roster: string[]) {
    const minPlayers = process.argv[2] ? parseInt(process.argv[2]!, 10) : 5;
    const matches = await getMatchesWithAtLeastNPlayers(roster, minPlayers, Date.now() - 90 * ONE_DAY);
    const outcomes = await getMatchesOutcomes(roster, matches);
    const record = getOutcomesRecord(outcomes);
    console.log(
        Object.fromEntries(
            Object.entries(record).map(([map, rec]) => {
                const s = `${((100 * rec.w) / rec.t || 0).toFixed(2)}% (${rec.w}/${rec.t})`;
                return [map, s];
            })
        )
    );
}

main(KANTALUPA_ROSTER);
