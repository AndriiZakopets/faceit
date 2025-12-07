import * as api from './api';
import fs from 'node:fs';

async function main() {
    const result = await api.getTeamDetails('b50faab6-0a0e-4dc5-8b18-571e9e642666');
    fs.writeFileSync('result.json', JSON.stringify(result, null, 2));
    console.log(result.team_id);
}

main();
