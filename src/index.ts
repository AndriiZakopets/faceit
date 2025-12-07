import * as api from './api';
import fs from 'node:fs';

const KANTALUPA_TEAM_ID = 'b50faab6-0a0e-4dc5-8b18-571e9e642666';

async function main() {
    const team = await api.getTeamDetails(KANTALUPA_TEAM_ID);
    const matches = await api.getLastNMatches(team.leader, 1);
    const mostRecentMatch = matches[0];
    if (!mostRecentMatch) return;
    const result = await api.getMatchDetails(mostRecentMatch.match_id);
    fs.writeFileSync('result.json', JSON.stringify(result, null, 2));
    console.log(result);
}

main();
