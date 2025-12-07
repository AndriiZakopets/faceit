import * as z from 'zod';

const FactionScoreSchema = z.object({
    score: z.number(),
});

const ScoreSchema = z.object({
    faction2: z.number(),
    faction1: z.number(),
});

const RosterSchema = z.object({
    player_id: z.string(),
    nickname: z.string(),
    avatar: z.string(),
    membership: z.string(),
    game_player_id: z.string(),
    game_player_name: z.string(),
    game_skill_level: z.number(),
    anticheat_required: z.boolean(),
});

const RangeSchema = z.object({
    min: z.number(),
    max: z.number(),
});

const EntitySchema = z.object({
    image_lg: z.string(),
    image_sm: z.string(),
    name: z.string(),
    class_name: z.string(),
    game_location_id: z.string().optional(),
    guid: z.string(),
    game_map_id: z.string().optional(),
});

const FactionsSchema = z.object({
    faction1: FactionScoreSchema,
    faction2: FactionScoreSchema,
});

const ResultsSchema = z.object({
    winner: z.string(),
    score: ScoreSchema,
});

const SkillLevelSchema = z.object({
    average: z.number(),
    range: RangeSchema,
});

const LocationSchema = z.object({
    entities: z.array(EntitySchema),
    pick: z.array(z.string()),
});

const DetailedResultSchema = z.object({
    asc_score: z.boolean(),
    winner: z.string(),
    factions: FactionsSchema,
});

const StatsSchema = z.object({
    winProbability: z.number(),
    skillLevel: SkillLevelSchema,
    rating: z.number(),
});

const VotingSchema = z.object({
    voted_entity_types: z.array(z.string()),
    location: LocationSchema,
    map: LocationSchema,
});

const TeamsFaction1Schema = z.object({
    faction_id: z.string(),
    leader: z.string(),
    avatar: z.string(),
    roster: z.array(RosterSchema),
    stats: StatsSchema,
    substituted: z.boolean(),
    name: z.string(),
    type: z.string(),
});

const TeamsSchema = z.object({
    faction1: TeamsFaction1Schema,
    faction2: TeamsFaction1Schema,
});

export const MatchDetailsSchema = z.object({
    match_id: z.string(),
    version: z.number(),
    game: z.string(),
    region: z.string(),
    competition_id: z.string(),
    competition_type: z.string(),
    competition_name: z.string(),
    organizer_id: z.string(),
    teams: TeamsSchema,
    voting: VotingSchema,
    calculate_elo: z.boolean(),
    configured_at: z.number(),
    started_at: z.number(),
    finished_at: z.number(),
    demo_url: z.array(z.string()),
    chat_room_id: z.string(),
    best_of: z.number(),
    results: ResultsSchema,
    detailed_results: z.array(DetailedResultSchema),
    status: z.string(),
    faceit_url: z.string(),
});
type MatchDetails = z.infer<typeof MatchDetailsSchema>;
