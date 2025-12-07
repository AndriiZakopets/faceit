import * as api from './api';
import type { Match } from './schemas';

export const getLastNMatches = async (playerId: string, n: number): Promise<Match[]> => {
    let matches: Match[] = [];
    let to = Date.now();
    const limit = 100;

    while (true) {
        const payload = await api.getAllMatchesOfAPlayer(playerId, limit, to);
        const pageMatches = payload.items;
        matches = matches.concat(payload.items);
        if (pageMatches.length < limit || matches.length >= n) {
            break;
        }
        const lastMatch = matches.at(-1)!;
        to = Math.floor(lastMatch.started_at / 1000 - 1) * 1000;
    }

    return matches.slice(0, n);
};
