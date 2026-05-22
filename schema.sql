-- ============================================================
-- Tournoi Padel — Schéma base de données
-- À exécuter dans la console SQL de Neon
-- ============================================================

CREATE TABLE IF NOT EXISTS matches (
  id          SERIAL PRIMARY KEY,
  rotation    INTEGER NOT NULL,
  horaire     TEXT NOT NULL,
  groupe      TEXT NOT NULL,
  terrain     TEXT NOT NULL,
  equipe_a    TEXT NOT NULL,
  equipe_b    TEXT NOT NULL,
  score_a     INTEGER,
  score_b     INTEGER,
  repos       TEXT,
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS terrain_codes (
  terrain     TEXT PRIMARY KEY,
  code        TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL
);

-- ── Codes par terrain (modifiables via admin) ──────────────────────────────
INSERT INTO terrain_codes (terrain, code) VALUES
  ('CPH',          '1001'),
  ('Stella Artois','1002'),
  ('CleanPower',   '1003'),
  ('MetaSystem',   '1004'),
  ('Delahaut',     '1005'),
  ('CBC',          '1006'),
  ('Corona',       '1007'),
  ('Zyla',         '1008'),
  ('DH Sport',     '1009'),
  ('Bertand',      '1010')
ON CONFLICT (terrain) DO NOTHING;

-- ── Settings par défaut ────────────────────────────────────────────────────
INSERT INTO settings (key, value) VALUES
  ('joueur_volant', 'Joueur volant')
ON CONFLICT (key) DO NOTHING;

-- ── Matchs beau temps — Rotation 1 (18h30-18h45) ─────────────────────────
INSERT INTO matches (rotation, horaire, groupe, terrain, equipe_a, equipe_b, repos) VALUES
(1,'18h30 - 18h45','Compétiteurs',  'CPH',          'Poulain / Sandrina Graceffa',               'Collin Mathieu / Didier Baele',               NULL),
(1,'18h30 - 18h45','Compétiteurs',  'Stella Artois', 'Jeanfi Pahaut / Sébastien Witmeur',         'Dorsan du Bois / Daout Delphine',             NULL),
(1,'18h30 - 18h45','Compétiteurs',  'CleanPower',    'Fernando / Vincent Cardyn',                 'Benja Dessy / Christophe Goisse',             NULL),
(1,'18h30 - 18h45','Intermédiaires','MetaSystem',    'Thierry Verdoodt / Wendy',                  'Xavier Carton / Magali Veronnez-Florent',     'Repos: Marianne / Patrice de Walque'),
(1,'18h30 - 18h45','Intermédiaires','Delahaut',      'Thierry Van Eeckhout / Sophie van der Dussen','Didier Devreese / Anne de Patoul',          'Repos: Marianne / Patrice de Walque'),
(1,'18h30 - 18h45','Intermédiaires','CBC',           'Geoffroy Lemaigre / Nathalie Pirotte',       'Hervé de Broux / Valeriane Delahaye',        'Repos: Marianne / Patrice de Walque'),
(1,'18h30 - 18h45','Débutants',     'Corona',        'Thomas Le Berre / Floriane Vreuls',          'Joueur volant / Babs Orban',                  NULL),
(1,'18h30 - 18h45','Débutants',     'Zyla',          'Oliver Aretz / Caroline Nieuwenhuys',        'Marianne / Patrice de Walque',                NULL),
(1,'18h30 - 18h45','Débutants',     'DH Sport',      'Dick Joelle / Quentin Orban',                'Kathleen Bouvy / Gégé Vierin',                NULL),
(1,'18h30 - 18h45','Débutants',     'Bertand',       'Olfa / Gaëlle Van Caster',                   'Catherine Henry de Frahan / Xavier De Buijl', NULL);

-- ── Rotation 2 (18h45-19h00) ──────────────────────────────────────────────
INSERT INTO matches (rotation, horaire, groupe, terrain, equipe_a, equipe_b, repos) VALUES
(2,'18h45 - 19h00','Compétiteurs',  'CPH',          'Poulain / Sandrina Graceffa',               'Jeanfi Pahaut / Sébastien Witmeur',           NULL),
(2,'18h45 - 19h00','Compétiteurs',  'Stella Artois', 'Collin Mathieu / Didier Baele',             'Fernando / Vincent Cardyn',                   NULL),
(2,'18h45 - 19h00','Compétiteurs',  'CleanPower',    'Dorsan du Bois / Daout Delphine',           'Benja Dessy / Christophe Goisse',             NULL),
(2,'18h45 - 19h00','Intermédiaires','MetaSystem',    'Thierry Verdoodt / Wendy',                  'Thierry Van Eeckhout / Sophie van der Dussen','Repos: Hervé de Broux / Valeriane Delahaye'),
(2,'18h45 - 19h00','Intermédiaires','Delahaut',      'Xavier Carton / Magali Veronnez-Florent',   'Geoffroy Lemaigre / Nathalie Pirotte',        'Repos: Hervé de Broux / Valeriane Delahaye'),
(2,'18h45 - 19h00','Intermédiaires','CBC',           'Didier Devreese / Anne de Patoul',          'Marianne / Patrice de Walque',                'Repos: Hervé de Broux / Valeriane Delahaye'),
(2,'18h45 - 19h00','Débutants',     'Corona',        'Thomas Le Berre / Floriane Vreuls',          'Oliver Aretz / Caroline Nieuwenhuys',          NULL),
(2,'18h45 - 19h00','Débutants',     'Zyla',          'Joueur volant / Babs Orban',                 'Dick Joelle / Quentin Orban',                 NULL),
(2,'18h45 - 19h00','Débutants',     'DH Sport',      'Marianne / Patrice de Walque',               'Olfa / Gaëlle Van Caster',                    NULL),
(2,'18h45 - 19h00','Débutants',     'Bertand',       'Kathleen Bouvy / Gégé Vierin',               'Catherine Henry de Frahan / Xavier De Buijl', NULL);

-- ── Rotation 3 (19h00-19h15) ──────────────────────────────────────────────
INSERT INTO matches (rotation, horaire, groupe, terrain, equipe_a, equipe_b, repos) VALUES
(3,'19h00 - 19h15','Compétiteurs',  'CPH',          'Poulain / Sandrina Graceffa',               'Dorsan du Bois / Daout Delphine',             NULL),
(3,'19h00 - 19h15','Compétiteurs',  'Stella Artois', 'Collin Mathieu / Didier Baele',             'Benja Dessy / Christophe Goisse',             NULL),
(3,'19h00 - 19h15','Compétiteurs',  'CleanPower',    'Jeanfi Pahaut / Sébastien Witmeur',         'Fernando / Vincent Cardyn',                   NULL),
(3,'19h00 - 19h15','Intermédiaires','MetaSystem',    'Thierry Verdoodt / Wendy',                  'Didier Devreese / Anne de Patoul',            'Repos: Geoffroy Lemaigre / Nathalie Pirotte'),
(3,'19h00 - 19h15','Intermédiaires','Delahaut',      'Xavier Carton / Magali Veronnez-Florent',   'Hervé de Broux / Valeriane Delahaye',         'Repos: Geoffroy Lemaigre / Nathalie Pirotte'),
(3,'19h00 - 19h15','Intermédiaires','CBC',           'Thierry Van Eeckhout / Sophie van der Dussen','Marianne / Patrice de Walque',              'Repos: Geoffroy Lemaigre / Nathalie Pirotte'),
(3,'19h00 - 19h15','Débutants',     'Corona',        'Thomas Le Berre / Floriane Vreuls',          'Marianne / Patrice de Walque',                NULL),
(3,'19h00 - 19h15','Débutants',     'Zyla',          'Joueur volant / Babs Orban',                 'Kathleen Bouvy / Gégé Vierin',                NULL),
(3,'19h00 - 19h15','Débutants',     'DH Sport',      'Oliver Aretz / Caroline Nieuwenhuys',        'Catherine Henry de Frahan / Xavier De Buijl', NULL),
(3,'19h00 - 19h15','Débutants',     'Bertand',       'Dick Joelle / Quentin Orban',                'Olfa / Gaëlle Van Caster',                    NULL);

-- ── Rotation 4 (19h15-19h30) ──────────────────────────────────────────────
INSERT INTO matches (rotation, horaire, groupe, terrain, equipe_a, equipe_b, repos) VALUES
(4,'19h15 - 19h30','Compétiteurs',  'CPH',          'Poulain / Sandrina Graceffa',               'Fernando / Vincent Cardyn',                   NULL),
(4,'19h15 - 19h30','Compétiteurs',  'Stella Artois', 'Collin Mathieu / Didier Baele',             'Dorsan du Bois / Daout Delphine',             NULL),
(4,'19h15 - 19h30','Compétiteurs',  'CleanPower',    'Jeanfi Pahaut / Sébastien Witmeur',         'Benja Dessy / Christophe Goisse',             NULL),
(4,'19h15 - 19h30','Intermédiaires','MetaSystem',    'Thierry Verdoodt / Wendy',                  'Geoffroy Lemaigre / Nathalie Pirotte',        'Repos: Didier Devreese / Anne de Patoul'),
(4,'19h15 - 19h30','Intermédiaires','Delahaut',      'Xavier Carton / Magali Veronnez-Florent',   'Marianne / Patrice de Walque',                'Repos: Didier Devreese / Anne de Patoul'),
(4,'19h15 - 19h30','Intermédiaires','CBC',           'Thierry Van Eeckhout / Sophie van der Dussen','Hervé de Broux / Valeriane Delahaye',       'Repos: Didier Devreese / Anne de Patoul'),
(4,'19h15 - 19h30','Débutants',     'Corona',        'Thomas Le Berre / Floriane Vreuls',          'Dick Joelle / Quentin Orban',                 NULL),
(4,'19h15 - 19h30','Débutants',     'Zyla',          'Joueur volant / Babs Orban',                 'Olfa / Gaëlle Van Caster',                    NULL),
(4,'19h15 - 19h30','Débutants',     'DH Sport',      'Oliver Aretz / Caroline Nieuwenhuys',        'Kathleen Bouvy / Gégé Vierin',                NULL),
(4,'19h15 - 19h30','Débutants',     'Bertand',       'Marianne / Patrice de Walque',               'Catherine Henry de Frahan / Xavier De Buijl', NULL);

-- ── Rotation 5 (19h30-19h45) ──────────────────────────────────────────────
INSERT INTO matches (rotation, horaire, groupe, terrain, equipe_a, equipe_b, repos) VALUES
(5,'19h30 - 19h45','Compétiteurs',  'CPH',          'Poulain / Sandrina Graceffa',               'Benja Dessy / Christophe Goisse',             NULL),
(5,'19h30 - 19h45','Compétiteurs',  'Stella Artois', 'Collin Mathieu / Didier Baele',             'Jeanfi Pahaut / Sébastien Witmeur',           NULL),
(5,'19h30 - 19h45','Compétiteurs',  'CleanPower',    'Dorsan du Bois / Daout Delphine',           'Fernando / Vincent Cardyn',                   NULL),
(5,'19h30 - 19h45','Intermédiaires','MetaSystem',    'Thierry Verdoodt / Wendy',                  'Hervé de Broux / Valeriane Delahaye',         'Repos: Thierry Van Eeckhout / Sophie van der Dussen'),
(5,'19h30 - 19h45','Intermédiaires','Delahaut',      'Xavier Carton / Magali Veronnez-Florent',   'Didier Devreese / Anne de Patoul',            'Repos: Thierry Van Eeckhout / Sophie van der Dussen'),
(5,'19h30 - 19h45','Intermédiaires','CBC',           'Geoffroy Lemaigre / Nathalie Pirotte',       'Marianne / Patrice de Walque',                'Repos: Thierry Van Eeckhout / Sophie van der Dussen'),
(5,'19h30 - 19h45','Débutants',     'Corona',        'Thomas Le Berre / Floriane Vreuls',          'Kathleen Bouvy / Gégé Vierin',                NULL),
(5,'19h30 - 19h45','Débutants',     'Zyla',          'Joueur volant / Babs Orban',                 'Catherine Henry de Frahan / Xavier De Buijl', NULL),
(5,'19h30 - 19h45','Débutants',     'DH Sport',      'Oliver Aretz / Caroline Nieuwenhuys',        'Olfa / Gaëlle Van Caster',                    NULL),
(5,'19h30 - 19h45','Débutants',     'Bertand',       'Marianne / Patrice de Walque',               'Dick Joelle / Quentin Orban',                 NULL);

-- ── Rotation 6 (19h45-20h00) ──────────────────────────────────────────────
INSERT INTO matches (rotation, horaire, groupe, terrain, equipe_a, equipe_b, repos) VALUES
(6,'19h45 - 20h00','Compétiteurs',  'CPH',          'Poulain / Sandrina Graceffa',               'Fernando / Vincent Cardyn',                   'Match bonus / revanche'),
(6,'19h45 - 20h00','Compétiteurs',  'Stella Artois', 'Collin Mathieu / Didier Baele',             'Benja Dessy / Christophe Goisse',             'Match bonus / revanche'),
(6,'19h45 - 20h00','Compétiteurs',  'CleanPower',    'Jeanfi Pahaut / Sébastien Witmeur',         'Dorsan du Bois / Daout Delphine',             'Match bonus / revanche'),
(6,'19h45 - 20h00','Intermédiaires','MetaSystem',    'Thierry Verdoodt / Wendy',                  'Marianne / Patrice de Walque',                'Repos: Xavier Carton / Magali Veronnez-Florent'),
(6,'19h45 - 20h00','Intermédiaires','Delahaut',      'Thierry Van Eeckhout / Sophie van der Dussen','Geoffroy Lemaigre / Nathalie Pirotte',      'Repos: Xavier Carton / Magali Veronnez-Florent'),
(6,'19h45 - 20h00','Intermédiaires','CBC',           'Didier Devreese / Anne de Patoul',          'Hervé de Broux / Valeriane Delahaye',         'Repos: Xavier Carton / Magali Veronnez-Florent'),
(6,'19h45 - 20h00','Débutants',     'Corona',        'Thomas Le Berre / Floriane Vreuls',          'Olfa / Gaëlle Van Caster',                    NULL),
(6,'19h45 - 20h00','Débutants',     'Zyla',          'Joueur volant / Babs Orban',                 'Oliver Aretz / Caroline Nieuwenhuys',          NULL),
(6,'19h45 - 20h00','Débutants',     'DH Sport',      'Marianne / Patrice de Walque',               'Kathleen Bouvy / Gégé Vierin',                NULL),
(6,'19h45 - 20h00','Débutants',     'Bertand',       'Dick Joelle / Quentin Orban',                'Catherine Henry de Frahan / Xavier De Buijl', NULL);
