import * as z from 'zod';

export const MatchStatisticsSchema = z.any();
export type MatchStatistics = z.infer<typeof MatchStatisticsSchema>;
