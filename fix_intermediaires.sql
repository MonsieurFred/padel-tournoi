-- ============================================================
-- Correction planning Intermédiaires
-- Coller dans Neon SQL Editor et cliquer Run
-- ============================================================

-- Supprime tous les matchs Intermédiaires et les réinsère proprement
DELETE FROM matches WHERE groupe = 'Intermédiaires';

INSERT INTO matches (rotation, horaire, groupe, terrain, equipe_a, equipe_b, repos) VALUES
-- R1
(1,'18h30 - 18h45','Intermédiaires','MetaSystem','Thierry Verdoodt / Wendy',                         'Xavier Carton / Magali Veronnez-Florent',      NULL),
(1,'18h30 - 18h45','Intermédiaires','Delahaut',  'Thierry Van Eeckhout / Sophie van der Dussen',     'Hervé de Broux / Valeriane Delahaye',          NULL),
(1,'18h30 - 18h45','Intermédiaires','CBC',        'Didier Devreese / Anne de Patoul',                 'Geoffroy Lemaigre / Nathalie Pirotte',         NULL),
-- R2
(2,'18h45 - 19h00','Intermédiaires','MetaSystem','Thierry Verdoodt / Wendy',                         'Thierry Van Eeckhout / Sophie van der Dussen', NULL),
(2,'18h45 - 19h00','Intermédiaires','Delahaut',  'Didier Devreese / Anne de Patoul',                 'Xavier Carton / Magali Veronnez-Florent',      NULL),
(2,'18h45 - 19h00','Intermédiaires','CBC',        'Geoffroy Lemaigre / Nathalie Pirotte',             'Hervé de Broux / Valeriane Delahaye',          NULL),
-- R3
(3,'19h00 - 19h15','Intermédiaires','MetaSystem','Thierry Verdoodt / Wendy',                         'Didier Devreese / Anne de Patoul',             NULL),
(3,'19h00 - 19h15','Intermédiaires','Delahaut',  'Geoffroy Lemaigre / Nathalie Pirotte',             'Thierry Van Eeckhout / Sophie van der Dussen', NULL),
(3,'19h00 - 19h15','Intermédiaires','CBC',        'Hervé de Broux / Valeriane Delahaye',              'Xavier Carton / Magali Veronnez-Florent',      NULL),
-- R4
(4,'19h15 - 19h30','Intermédiaires','MetaSystem','Thierry Verdoodt / Wendy',                         'Geoffroy Lemaigre / Nathalie Pirotte',         NULL),
(4,'19h15 - 19h30','Intermédiaires','Delahaut',  'Hervé de Broux / Valeriane Delahaye',              'Didier Devreese / Anne de Patoul',             NULL),
(4,'19h15 - 19h30','Intermédiaires','CBC',        'Xavier Carton / Magali Veronnez-Florent',          'Thierry Van Eeckhout / Sophie van der Dussen', NULL),
-- R5
(5,'19h30 - 19h45','Intermédiaires','MetaSystem','Thierry Verdoodt / Wendy',                         'Hervé de Broux / Valeriane Delahaye',          NULL),
(5,'19h30 - 19h45','Intermédiaires','Delahaut',  'Xavier Carton / Magali Veronnez-Florent',          'Geoffroy Lemaigre / Nathalie Pirotte',         NULL),
(5,'19h30 - 19h45','Intermédiaires','CBC',        'Thierry Van Eeckhout / Sophie van der Dussen',     'Didier Devreese / Anne de Patoul',             NULL),
-- R6 bonus/rematches
(6,'19h45 - 20h00','Intermédiaires','MetaSystem','Thierry Verdoodt / Wendy',                         'Didier Devreese / Anne de Patoul',             'Match bonus / revanche'),
(6,'19h45 - 20h00','Intermédiaires','Delahaut',  'Xavier Carton / Magali Veronnez-Florent',          'Hervé de Broux / Valeriane Delahaye',          'Match bonus / revanche'),
(6,'19h45 - 20h00','Intermédiaires','CBC',        'Thierry Van Eeckhout / Sophie van der Dussen',     'Geoffroy Lemaigre / Nathalie Pirotte',         'Match bonus / revanche');
