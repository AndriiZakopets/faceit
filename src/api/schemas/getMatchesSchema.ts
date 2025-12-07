import * as z from 'zod';

const StatusSchema = z.enum(['finished']);
type Status = z.infer<typeof StatusSchema>;

const ScoreSchema = z.object({
    faction1: z.number(),
    faction2: z.number(),
});
type Score = z.infer<typeof ScoreSchema>;

const PlayerSchema = z.object({
    player_id: z.string(),
    nickname: z.string(),
    avatar: z.string(),
    skill_level: z.number(),
    game_player_id: z.string(),
    game_player_name: z.string(),
    faceit_url: z.string(),
});
type Player = z.infer<typeof PlayerSchema>;

const ResultsSchema = z.object({
    winner: z.string(),
    score: ScoreSchema,
});
type Results = z.infer<typeof ResultsSchema>;

const FactionSchema = z.object({
    team_id: z.string(),
    nickname: z.string(),
    avatar: z.string(),
    type: z.string(),
    players: z.array(PlayerSchema),
});
type Faction = z.infer<typeof FactionSchema>;

const TeamsSchema = z.object({
    faction2: FactionSchema,
    faction1: FactionSchema,
});
type Teams = z.infer<typeof TeamsSchema>;

const MatchSchema = z.object({
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
type GetMatchesPayload = z.infer<typeof GetMatchesPayloadSchema>;
