import * as z from 'zod';

export const StatusSchema = z.enum(['finished']);
export type Status = z.infer<typeof StatusSchema>;

export const ScoreSchema = z.object({
    faction1: z.number(),
    faction2: z.number(),
});
export type Score = z.infer<typeof ScoreSchema>;

export const PlayerSchema = z.object({
    player_id: z.string(),
    nickname: z.string(),
    avatar: z.string(),
    skill_level: z.number(),
    game_player_id: z.string(),
    game_player_name: z.string(),
    faceit_url: z.string(),
});
export type Player = z.infer<typeof PlayerSchema>;

export const ResultsSchema = z.object({
    winner: z.string(),
    score: ScoreSchema,
});
export type Results = z.infer<typeof ResultsSchema>;

export const FactionSchema = z.object({
    team_id: z.string(),
    nickname: z.string(),
    avatar: z.string(),
    type: z.string(),
    players: z.array(PlayerSchema),
});
export type Faction = z.infer<typeof FactionSchema>;

export const TeamsSchema = z.object({
    faction2: FactionSchema,
    faction1: FactionSchema,
});
export type Teams = z.infer<typeof TeamsSchema>;

export const MatchSchema = z.object({
    match_id: z.string(),
    game_id: z.string(),
    region: z.string(),
    match_type: z.string(),
    game_mode: z.string(),
    max_players: z.number(),
    teams_size: z.number(),
    teams: TeamsSchema,
    playing_players: z.array(z.string()),
    competition_id: z.string(),
    competition_name: z.string(),
    competition_type: z.string(),
    organizer_id: z.string(),
    status: StatusSchema,
    started_at: z.number(),
    finished_at: z.number(),
    results: ResultsSchema,
    faceit_url: z.string(),
});
export type Match = z.infer<typeof MatchSchema>;

export const GetMatchesPayloadSchema = z.object({
    items: z.array(MatchSchema),
    start: z.number(),
    end: z.number(),
    from: z.number(),
    to: z.number(),
});
export type GetMatchesPayload = z.infer<typeof GetMatchesPayloadSchema>;
