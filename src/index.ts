import * as api from './api';

async function main() {
    const stats = await api.getMatchStatisctics('1-03a157f8-41b8-412e-bbc2-a66ccf2e1580');

    console.log(JSON.stringify(stats, null, 2));
}

main();
