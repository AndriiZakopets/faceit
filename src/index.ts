import * as api from './api';
import fs from 'node:fs';

const KANTALUPA_TEAM_ID = 'b50faab6-0a0e-4dc5-8b18-571e9e642666';
const KANTALUPA_ROSTER = [
    '94b493a4-3132-436e-9c8a-1437194c152e',
    'a7520c05-0175-429a-b5d7-ee3a358b5de2',
    '0e982314-2892-4eff-ab06-21103803e213',
    '75ce1ea9-4996-48f4-9595-76667a062d49',
    '3dd9ade4-3b35-4de3-add9-9a1f7c8e0947',
] as const;

const getFullStackMatches = async () => {
    const randomPlayerId = KANTALUPA_ROSTER[0];
    const playerMatches = await api.getLastNMatches(randomPlayerId, 10000);
    const fullStackMatches = playerMatches.filter((match) => {
        return KANTALUPA_ROSTER.every((playerId) => match.playing_players.includes(playerId));
    });
    console.log(playerMatches.length, fullStackMatches.length);
    return fullStackMatches;
};

async function main() {
    const result = await getFullStackMatches();
    fs.writeFileSync(
        'data/fullStackMatches.json',
        JSON.stringify(
            result.map((e) => e.match_id),
            null,
            2
        )
    );
    // console.log(result);
}

main();
