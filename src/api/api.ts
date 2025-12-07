import { type GetTeam, GetTeamSchema } from './getTeamSchema';
import { type Matches, MatchesSchema } from './getMatchesSchema';
import { requestWrapper } from './requestWrapper';

export const getTeam = async (teamId: string): Promise<GetTeam> => {
    return requestWrapper(`https://www.faceit.com/api/teams/v3/teams/${teamId}`, GetTeamSchema);
};

export const getMatchesPage = async (playerId: string, page = 0, size = 200): Promise<Matches> => {
    return requestWrapper(`https://www.faceit.com/api/stats/v1/stats/time/users/${playerId}/games/cs2?page=${page}&size=${size}`, MatchesSchema);
};
