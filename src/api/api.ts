import { type GetTeam, GetTeamSchema } from './getTeamSchema';
import { type RawMatches, RawMatchesSchema } from './getMatchesSchema';
import { requestWrapper } from './requestWrapper';

export const getTeam = async (teamId: string): Promise<GetTeam> => {
    const url = `https://www.faceit.com/api/teams/v3/teams/${teamId}`;
    return requestWrapper(url, GetTeamSchema);
};

export const getMatchesPage = async (playerId: string, size = 100, to = Date.now()): Promise<RawMatches> => {
    const url = `https://www.faceit.com/api/stats/v1/stats/time/users/${playerId}/games/cs2?size=${size}&to=${to}`;
    return requestWrapper(url, RawMatchesSchema);
};
