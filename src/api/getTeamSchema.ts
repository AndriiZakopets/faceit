import * as z from 'zod';

export const Cs2Schema = z.object({
    skill_level: z.number(),
});
export type Cs2 = z.infer<typeof Cs2Schema>;

export const GamesSchema = z.object({
    cs2: Cs2Schema,
});
export type Games = z.infer<typeof GamesSchema>;

export const MemberSchema = z.object({
    id: z.string(),
    country: z.string(),
    nickname: z.string(),
    avatar: z.string(),
    games: GamesSchema,
    tags: z.array(z.string()),
});
export type Member = z.infer<typeof MemberSchema>;

export const PayloadSchema = z.object({
    id: z.string(),
    name: z.string(),
    nickname: z.string(),
    game: z.string(),
    leader: z.string(),
    team_type: z.string(),
    entity_type: z.string(),
    description: z.string(),
    members_ids: z.array(z.string()),
    pending_members_ids: z.array(z.any()),
    officers: z.array(z.string()),
    members: z.array(MemberSchema),
    pending_members: z.array(z.any()),
    created_at: z.coerce.date(),
    updated_at: z.coerce.date(),
    created_by: z.string(),
    updated_by: z.string(),
    website: z.string(),
    facebook: z.string(),
    twitter: z.string(),
    youtube: z.string(),
    avatar: z.string(),
    cover: z.string(),
    status: z.string(),
    is_full: z.boolean(),
    country: z.string(),
});
export type Payload = z.infer<typeof PayloadSchema>;

export const GetTeamSchema = z.object({
    payload: PayloadSchema,
});
export type GetTeam = z.infer<typeof GetTeamSchema>;
