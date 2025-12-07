import * as api from './api';
import { type Matches } from './getMatchesSchema';

export const getLastNMatches = async (playerId: string, n: number): Promise<Matches> => {
    let matches: Matches = [];
    let page = 0;
    const size = 100;

    while (true) {
        const pageMatches = await api.getMatchesPage(playerId, page, size);
        matches = matches.concat(pageMatches);
        if (pageMatches.length < size || matches.length >= n) {
            break;
        }
        page += 1;
    }

    return matches.slice(0, n);
};
