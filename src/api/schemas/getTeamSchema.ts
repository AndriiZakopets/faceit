import * as z from 'zod';

const MemberSchema = z.object({
    user_id: z.string(),
    nickname: z.string(),
    avatar: z.string(),
    country: z.string(),
    memberships: z.array(z.string()).optional(),
    faceit_url: z.string(),
});
type Member = z.infer<typeof MemberSchema>;

export const TeamSchema = z.object({
    team_id: z.string(),
    nickname: z.string(),
    name: z.string(),
    avatar: z.string(),
    game: z.string(),
    team_type: z.string(),
    members: z.array(MemberSchema),
    leader: z.string(),
    chat_room_id: z.string(),
    faceit_url: z.string(),
});
type Team = z.infer<typeof TeamSchema>;
