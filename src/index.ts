import * as api from './api';

async function main() {
    const stats = await api.getMatchStatistics('1-a9a276c4-0d23-4e0f-9ee3-eff7a630daf9:');

    console.log(JSON.stringify(stats, null, 2));
}

main();
