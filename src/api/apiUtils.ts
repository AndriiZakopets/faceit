import * as api from './api';
import { type RawMatches } from './getMatchesSchema';

export const getLastNMatches = async (playerId: string, n: number): Promise<RawMatches> => {
    let matches: RawMatches = [];
    let to = Date.now();
    const size = 100;

    while (true) {
        const pageMatches = await api.getMatchesPage(playerId, size, to);
        matches = matches.concat(pageMatches);
        if (pageMatches.length < size || matches.length >= n) {
            break;
        }
        const lastMatch = matches.at(-1)!;
        to = Math.floor(lastMatch.created_at / 1000 - 1) * 1000;
    }

    return matches.slice(0, n);
};
