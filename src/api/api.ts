import { TeamSchema } from './schemas';
import { GetMatchesPayloadSchema } from './schemas';
import { requestWrapper } from './requestWrapper';

export const getTeamDetails = async (teamId: string) => {
    return requestWrapper(
        {
            url: `/teams/${teamId}`,
        },
        TeamSchema
    );
};

export const getAllMatchesOfAPlayer = async (playerId: string, limit = 100, to = Date.now()) => {
    return requestWrapper(
        {
            url: `/players/${playerId}/history`,
            params: {
                game: 'cs2',
                limit,
                to,
            },
        },
        GetMatchesPayloadSchema
    );
};
