import * as z from 'zod';

export const MatchSchema = z.object({
    created_at: z.number(),
    updated_at: z.number(),
    i10: z.string(),
    i13: z.string(),
    i15: z.string(),
    i14: z.string(),
    i16: z.string(),
    nickname: z.string(),
    playerId: z.string(),
    i40: z.string(),
    i6: z.string(),
    i7: z.string(),
    i8: z.string(),
    i9: z.string(),
    c10: z.string(),
    c2: z.string(),
    c3: z.string(),
    c4: z.string(),
    c1: z.string(),
    i19: z.string(),
    teamId: z.string(),
    i3: z.string(),
    i4: z.string(),
    i5: z.string(),
    premade: z.boolean(),
    c5: z.string(),
    bestOf: z.string(),
    competitionId: z.string(),
    date: z.number(),
    game: z.literal('cs2'),
    gameMode: z.string(),
    i0: z.string(), // region
    i1: z.string(), // map
    i12: z.string(),
    i18: z.string(),
    i2: z.string(),
    matchId: z.string(),
    matchRound: z.string(),
    played: z.string(),
    status: z.string(),
    elo: z.string().optional(),
    elo_delta: z.string().optional(),
});
export type Match = z.infer<typeof MatchSchema>;

export const MatchesSchema = z.array(MatchSchema);
export type Matches = z.infer<typeof MatchesSchema>;
