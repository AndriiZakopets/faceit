import * as api from './api';
import { Match } from './api/schemas';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const KANTALUPA_TEAM_ID = 'b50faab6-0a0e-4dc5-8b18-571e9e642666';
const KANTALUPA_ROSTER = [
    '94b493a4-3132-436e-9c8a-1437194c152e',
    'a7520c05-0175-429a-b5d7-ee3a358b5de2',
    '0e982314-2892-4eff-ab06-21103803e213',
    '75ce1ea9-4996-48f4-9595-76667a062d49',
    '3dd9ade4-3b35-4de3-add9-9a1f7c8e0947',
] as const;

const getFullStackMatches = async (roaster: readonly string[]) => {
    if (roaster.length !== 5) {
        return [];
    }
    const firstPlayerId = roaster[0]!;
    const playerMatches = await api.getLastNMatches(firstPlayerId, 10000);
    const fullStackMatches = playerMatches.filter((match) => {
        return roaster.every((playerId) => match.playing_players.includes(playerId));
    });
    return fullStackMatches;
};

type MatchOutcome = {
    map: string;
    isWin: boolean;
};

const getMatchesOutcomes = async (roaster: readonly string[], matches: Match[]): Promise<MatchOutcome[]> => {
    const outcomes: MatchOutcome[] = [];
    for (let i = 0; i < matches.length; i += 1) {
        process.stdout.write(`\rProcessing match ${i + 1}/${matches.length}...`);
        const match = matches[i]!;
        const matchDetails = await api.getMatchDetails(match.match_id).catch(() => null);
        if (!matchDetails || matchDetails.voting.map.pick.length !== 1) {
            continue;
        }
        const map = matchDetails.voting.map.pick[0]!;
        const isFaction1 = matchDetails.teams.faction1.roster.some((player) => roaster.includes(player.player_id));
        const isWin = isFaction1 ? matchDetails.results.winner === 'faction1' : matchDetails.results.winner === 'faction2';
        const outcome: MatchOutcome = {
            map,
            isWin,
        };
        outcomes.push(outcome);
    }
    process.stdout.write('\n');
    return outcomes;
};

type OutcomesRecord = Record<
    string,
    {
        w: number;
        l: number;
    }
>;

const getOutcomesRecord = (outcomes: MatchOutcome[]): OutcomesRecord => {
    const record: OutcomesRecord = {};
    outcomes.forEach((outcome) => {
        if (!record[outcome.map]) {
            record[outcome.map] = {
                w: 0,
                l: 0,
            };
        }
        if (outcome.isWin) {
            record[outcome.map]!.w += 1;
        } else {
            record[outcome.map]!.l += 1;
        }
    });
    return record;
};

async function main() {
    const matches = await getFullStackMatches(KANTALUPA_ROSTER);
    const outcomes = await getMatchesOutcomes(KANTALUPA_ROSTER, matches);
    const record = getOutcomesRecord(outcomes);
    console.log(
        Object.fromEntries(
            Object.entries(record).map(([map, rec]) => {
                const t = rec.w + rec.l;
                const s = `${((100 * rec.w) / t).toFixed(2)}% (${rec.w}/${t})`;
                return [map, s];
            })
        )
    );
}

main();
