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

-- Weapon-level breakdown belongs to one capture, one row per weapon
create table if not exists weapon_stats (
  id uuid primary key default gen_random_uuid(),
  capture_id uuid not null references stat_captures(id) on delete cascade,
  weapon_name text not null,
  time_used_seconds integer,
  damage numeric,
  accuracy numeric
);

create index if not exists idx_captures_player on stat_captures(player_id);
create index if not exists idx_weapon_stats_capture on weapon_stats(capture_id);
