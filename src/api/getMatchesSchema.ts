import * as z from 'zod';

const StringBooleanSchema = z.enum(['1', '0']);

export const RawMatchSchema = z.object({
    created_at: z.number(),
    updated_at: z.number(),
    i10: StringBooleanSchema, // is win
    i13: z.string(),
    i15: z.string(),
    i14: z.string(),
    i16: z.string(),
    nickname: z.string(),
    playerId: z.string(),
    i40: z.string().optional(),
    i6: z.string(),
    i7: z.string(),
    i8: z.string(),
    i9: z.string(),
    c10: z.string().optional(),
    c2: z.string(),
    c3: z.string(),
    c4: z.string(),
    c1: z.string(),
    i19: z.string(),
    teamId: z.string(),
    i3: z.string(),
    i4: z.string(),
    i5: z.string(), // player's team name
    premade: z.boolean(),
    c5: z.string(), // player's won rounds number
    bestOf: z.string(),
    competitionId: z.string(),
    date: z.number(),
    game: z.literal('cs2'),
    gameMode: z.string(),
    i0: z.string(), // region
    i1: z.string(), // map
    i12: z.string(), // rounds played
    i18: z.string(), // score
    i2: z.string(),
    matchId: z.string(),
    matchRound: z.string(),
    played: StringBooleanSchema,
    status: z.string(),
    elo: z.string().optional(),
    elo_delta: z.string().optional(),
});
export type RawMatch = z.infer<typeof RawMatchSchema>;

export const RawMatchesSchema = z.array(RawMatchSchema);
export type RawMatches = z.infer<typeof RawMatchesSchema>;
