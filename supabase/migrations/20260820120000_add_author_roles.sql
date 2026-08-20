-- Migration: 20260820120000_add_author_roles.sql
-- Add match_scorer (Live scoring) and squad_coordinator (Squad & Players) author roles

INSERT INTO admin_roles (id, name, description, permissions)
VALUES
  (
    'match_scorer',
    'Matchday Live Scorer',
    'Permitted to update live match scores, match minutes, events, and match results.',
    '{
      " tabs\: [\overview\, \fixtures\],
 \collections\: {
 \matches\: {\create\: false, \read\: true, \update\: true, \delete\: false},
 \matches_results\: {\create\: false, \read\: true, \update\: true, \delete\: false},
 \venues\: {\create\: false, \read\: true, \update\: false, \delete\: false},
 \teams\: {\create\: false, \read\: true, \update\: false, \delete\: false},
 \opponents\: {\create\: false, \read\: true, \update\: false, \delete\: false}
 },
 \pages_builder\: false,
 \ai_assistant\: false,
 \media_upload\: false,
 \fanzone_pii\: false
 }'::jsonb
 ),
 (
 'squad_coordinator',
 'Squad & Player Coordinator',
 'Permitted to manage player rosters, profiles, stats, appearances, and team associations.',
 '{
 \tabs\: [\overview\, \teams\],
 \collections\: {
 \players\: {\create\: true, \read\: true, \update\: true, \delete\: true},
 \teams\: {\create\: false, \read\: true, \update\: true, \delete\: false},
 \opponents\: {\create\: false, \read\: true, \update\: false, \delete\: false},
 \venues\: {\create\: false, \read\: true, \update\: false, \delete\: false}
 },
 \pages_builder\: false,
 \ai_assistant\: false,
 \media_upload\: true,
 \fanzone_pii\: false
 }'::jsonb
 )
ON CONFLICT (id) DO UPDATE
SET
 name = EXCLUDED.name,
 description = EXCLUDED.description,
 permissions = EXCLUDED.permissions,
 updated_at = NOW();
