-- LinkCard D1 schema.
--
-- The whole Profile object (colors, links, skills, projects, services...)
-- is stored as one JSON blob in `data`. This is a deliberate simplification
-- over the fully-normalized schema in the original plan (separate tables
-- per links/projects/skills/services): a card is always read and written
-- as one whole document by this app, so one row per card is simpler and
-- has no joins to get wrong. `username` and `is_public` are pulled out as
-- real columns because they're the two things queried directly.

CREATE TABLE IF NOT EXISTS profiles (
  username TEXT PRIMARY KEY,
  owner_token TEXT NOT NULL,
  is_public INTEGER NOT NULL DEFAULT 0,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS analytics_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  event_type TEXT NOT NULL,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_analytics_username ON analytics_events (username);
