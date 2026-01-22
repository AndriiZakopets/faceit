import { GetMatchesPayloadSchema, MatchDetailsSchema, TeamSchema } from './schemas';
import { requestWrapper } from './requestWrapper';
import { MatchStatisticsSchema } from './schemas/getMatchStatistics';

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

export const getMatchDetails = async (matchId: string) => {
    return requestWrapper(
        {
            url: `/matches/${matchId}`,
        },
        MatchDetailsSchema
    );
};

export const getMatchStatistics = async (matchId: string) => {
    return requestWrapper(
        {
            url: `https://www.faceit.com/api/statistics/v1/cs2/matches/${matchId}/match-rounds/1/scoreboard?statsType=2`,
        },
        MatchStatisticsSchema,
        false
    );
};
