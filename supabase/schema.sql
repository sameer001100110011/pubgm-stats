-- Dropcard v1 schema
-- Game-agnostic by design: every table carries a `game` field so future
-- adapters (PUBG PC, Fortnite, Hypixel, etc.) plug into the same shape
-- instead of needing new tables per game.

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  game text not null,                 -- e.g. 'pubg_mobile'
  ign text not null,                  -- in-game name at time of capture
  external_id text,                   -- game's own player/UID if known
  created_at timestamptz not null default now(),
  unique (game, ign)
);

create table if not exists stat_captures (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  game text not null,
  mode text,                          -- solo / duo / squad, if applicable
  tier text,                          -- rank tier at time of capture
  kd numeric,
  wins integer,
  matches integer,
  headshot_rate numeric,
  raw_ocr_text text,                  -- unparsed OCR output, kept for debugging/reparsing
  captured_at timestamptz not null default now()
);

create index if not exists idx_captures_player on stat_captures(player_id);

-- Weapon-level breakdown, from the Firearm Combat Power screen (one screen
-- per weapon in-game, so these are captured independently over time, not
-- nested under a single stat_captures row - a player might capture 3 weapons
-- today and 4 more next week).
create table if not exists weapon_stats (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete cascade,
  game text not null,
  weapon_name text not null,
  combat_power integer,
  damage numeric,
  eliminations integer,
  accuracy numeric,
  headshot_rate numeric,
  raw_ocr_text text,
  captured_at timestamptz not null default now(),
  -- a player can recapture the same weapon later to update it, but we keep
  -- history rather than overwrite, so trend-over-time stays possible
  unique (player_id, weapon_name, captured_at)
);

create index if not exists idx_weapon_stats_player on weapon_stats(player_id);
