import * as api from './api';
import fs from 'node:fs';

async function main() {
    // const matches = await api.getLastNMatches('75ce1ea9-4996-48f4-9595-76667a062d49', 500);
    // fs.writeFileSync('result.json', JSON.stringify(matches, null, 2));
    // const match = matches[0]!;
    const matches = await api.getLastNMatches('75ce1ea9-4996-48f4-9595-76667a062d49', 500);
    console.log(matches.length);
}

main();
