export const TERRAINS = [
  'CPH', 'Stella Artois', 'CleanPower', 'MetaSystem',
  'Delahaut', 'CBC', 'Corona', 'Zyla', 'DH Sport', 'Bertand',
]

export const BONUS_TERRAINS = ['Fast Elec', 'Majinox']

export const ROTATIONS = [
  { numero: 1, horaire: '18h30 - 18h45' },
  { numero: 2, horaire: '18h45 - 19h00' },
  { numero: 3, horaire: '19h00 - 19h15' },
  { numero: 4, horaire: '19h15 - 19h30' },
  { numero: 5, horaire: '19h30 - 19h45' },
  { numero: 6, horaire: '19h45 - 20h00' },
]

// Équipes par groupe
export const GROUPES = {
  competiteurs: 'Compétiteurs',
  intermediaires: 'Intermédiaires',
  debutants: 'Débutants',
}

// Tous les matchs officiels - Beau temps (10 terrains)
// equipe_a et equipe_b correspondent exactement aux noms dans la DB
export const MATCHES_BEAU_TEMPS = [
  // ── Rotation 1 ─────────────────────────────────────────────────────────────
  { rotation: 1, terrain: 'CPH',          groupe: 'Compétiteurs',   equipe_a: 'Poulain / Sandrina Graceffa',               equipe_b: 'Collin Mathieu / Didier Baele' },
  { rotation: 1, terrain: 'Stella Artois',groupe: 'Compétiteurs',   equipe_a: 'Jeanfi Pahaut / Sébastien Witmeur',         equipe_b: 'Dorsan du Bois / Daout Delphine' },
  { rotation: 1, terrain: 'CleanPower',   groupe: 'Compétiteurs',   equipe_a: 'Fernando / Vincent Cardyn',                 equipe_b: 'Benja Dessy / Christophe Goisse' },
  { rotation: 1, terrain: 'MetaSystem',   groupe: 'Intermédiaires', equipe_a: 'Thierry Verdoodt / Wendy',                  equipe_b: 'Xavier Carton / Magali Veronnez-Florent', repos: 'Marianne / Patrice de Walque' },
  { rotation: 1, terrain: 'Delahaut',     groupe: 'Intermédiaires', equipe_a: 'Thierry Van Eeckhout / Sophie van der Dussen', equipe_b: 'Didier Devreese / Anne de Patoul',     repos: 'Marianne / Patrice de Walque' },
  { rotation: 1, terrain: 'CBC',          groupe: 'Intermédiaires', equipe_a: 'Geoffroy Lemaigre / Nathalie Pirotte',       equipe_b: 'Hervé de Broux / Valeriane Delahaye',  repos: 'Marianne / Patrice de Walque' },
  { rotation: 1, terrain: 'Corona',       groupe: 'Débutants',      equipe_a: 'Thomas Le Berre / Floriane Vreuls',          equipe_b: 'Joueur volant / Babs Orban' },
  { rotation: 1, terrain: 'Zyla',         groupe: 'Débutants',      equipe_a: 'Oliver Aretz / Caroline Nieuwenhuys',        equipe_b: 'Marianne / Patrice de Walque' },
  { rotation: 1, terrain: 'DH Sport',     groupe: 'Débutants',      equipe_a: 'Dick Joelle / Quentin Orban',               equipe_b: 'Kathleen Bouvy / Gégé Vierin' },
  { rotation: 1, terrain: 'Bertand',      groupe: 'Débutants',      equipe_a: 'Olfa / Gaëlle Van Caster',                  equipe_b: 'Catherine Henry de Frahan / Xavier De Buijl' },
  // ── Rotation 2 ─────────────────────────────────────────────────────────────
  { rotation: 2, terrain: 'CPH',          groupe: 'Compétiteurs',   equipe_a: 'Poulain / Sandrina Graceffa',               equipe_b: 'Jeanfi Pahaut / Sébastien Witmeur' },
  { rotation: 2, terrain: 'Stella Artois',groupe: 'Compétiteurs',   equipe_a: 'Collin Mathieu / Didier Baele',             equipe_b: 'Fernando / Vincent Cardyn' },
  { rotation: 2, terrain: 'CleanPower',   groupe: 'Compétiteurs',   equipe_a: 'Dorsan du Bois / Daout Delphine',           equipe_b: 'Benja Dessy / Christophe Goisse' },
  { rotation: 2, terrain: 'MetaSystem',   groupe: 'Intermédiaires', equipe_a: 'Thierry Verdoodt / Wendy',                  equipe_b: 'Thierry Van Eeckhout / Sophie van der Dussen', repos: 'Hervé de Broux / Valeriane Delahaye' },
  { rotation: 2, terrain: 'Delahaut',     groupe: 'Intermédiaires', equipe_a: 'Xavier Carton / Magali Veronnez-Florent',   equipe_b: 'Geoffroy Lemaigre / Nathalie Pirotte',         repos: 'Hervé de Broux / Valeriane Delahaye' },
  { rotation: 2, terrain: 'CBC',          groupe: 'Intermédiaires', equipe_a: 'Didier Devreese / Anne de Patoul',          equipe_b: 'Marianne / Patrice de Walque',                  repos: 'Hervé de Broux / Valeriane Delahaye' },
  { rotation: 2, terrain: 'Corona',       groupe: 'Débutants',      equipe_a: 'Thomas Le Berre / Floriane Vreuls',         equipe_b: 'Oliver Aretz / Caroline Nieuwenhuys' },
  { rotation: 2, terrain: 'Zyla',         groupe: 'Débutants',      equipe_a: 'Joueur volant / Babs Orban',                equipe_b: 'Dick Joelle / Quentin Orban' },
  { rotation: 2, terrain: 'DH Sport',     groupe: 'Débutants',      equipe_a: 'Marianne / Patrice de Walque',              equipe_b: 'Olfa / Gaëlle Van Caster' },
  { rotation: 2, terrain: 'Bertand',      groupe: 'Débutants',      equipe_a: 'Kathleen Bouvy / Gégé Vierin',              equipe_b: 'Catherine Henry de Frahan / Xavier De Buijl' },
  // ── Rotation 3 ─────────────────────────────────────────────────────────────
  { rotation: 3, terrain: 'CPH',          groupe: 'Compétiteurs',   equipe_a: 'Poulain / Sandrina Graceffa',               equipe_b: 'Dorsan du Bois / Daout Delphine' },
  { rotation: 3, terrain: 'Stella Artois',groupe: 'Compétiteurs',   equipe_a: 'Collin Mathieu / Didier Baele',             equipe_b: 'Benja Dessy / Christophe Goisse' },
  { rotation: 3, terrain: 'CleanPower',   groupe: 'Compétiteurs',   equipe_a: 'Jeanfi Pahaut / Sébastien Witmeur',         equipe_b: 'Fernando / Vincent Cardyn' },
  { rotation: 3, terrain: 'MetaSystem',   groupe: 'Intermédiaires', equipe_a: 'Thierry Verdoodt / Wendy',                  equipe_b: 'Didier Devreese / Anne de Patoul',             repos: 'Geoffroy Lemaigre / Nathalie Pirotte' },
  { rotation: 3, terrain: 'Delahaut',     groupe: 'Intermédiaires', equipe_a: 'Xavier Carton / Magali Veronnez-Florent',   equipe_b: 'Hervé de Broux / Valeriane Delahaye',          repos: 'Geoffroy Lemaigre / Nathalie Pirotte' },
  { rotation: 3, terrain: 'CBC',          groupe: 'Intermédiaires', equipe_a: 'Thierry Van Eeckhout / Sophie van der Dussen', equipe_b: 'Marianne / Patrice de Walque',              repos: 'Geoffroy Lemaigre / Nathalie Pirotte' },
  { rotation: 3, terrain: 'Corona',       groupe: 'Débutants',      equipe_a: 'Thomas Le Berre / Floriane Vreuls',         equipe_b: 'Marianne / Patrice de Walque' },
  { rotation: 3, terrain: 'Zyla',         groupe: 'Débutants',      equipe_a: 'Joueur volant / Babs Orban',                equipe_b: 'Kathleen Bouvy / Gégé Vierin' },
  { rotation: 3, terrain: 'DH Sport',     groupe: 'Débutants',      equipe_a: 'Oliver Aretz / Caroline Nieuwenhuys',       equipe_b: 'Catherine Henry de Frahan / Xavier De Buijl' },
  { rotation: 3, terrain: 'Bertand',      groupe: 'Débutants',      equipe_a: 'Dick Joelle / Quentin Orban',               equipe_b: 'Olfa / Gaëlle Van Caster' },
  // ── Rotation 4 ─────────────────────────────────────────────────────────────
  { rotation: 4, terrain: 'CPH',          groupe: 'Compétiteurs',   equipe_a: 'Poulain / Sandrina Graceffa',               equipe_b: 'Fernando / Vincent Cardyn' },
  { rotation: 4, terrain: 'Stella Artois',groupe: 'Compétiteurs',   equipe_a: 'Collin Mathieu / Didier Baele',             equipe_b: 'Dorsan du Bois / Daout Delphine' },
  { rotation: 4, terrain: 'CleanPower',   groupe: 'Compétiteurs',   equipe_a: 'Jeanfi Pahaut / Sébastien Witmeur',         equipe_b: 'Benja Dessy / Christophe Goisse' },
  { rotation: 4, terrain: 'MetaSystem',   groupe: 'Intermédiaires', equipe_a: 'Thierry Verdoodt / Wendy',                  equipe_b: 'Geoffroy Lemaigre / Nathalie Pirotte',         repos: 'Didier Devreese / Anne de Patoul' },
  { rotation: 4, terrain: 'Delahaut',     groupe: 'Intermédiaires', equipe_a: 'Xavier Carton / Magali Veronnez-Florent',   equipe_b: 'Marianne / Patrice de Walque',                  repos: 'Didier Devreese / Anne de Patoul' },
  { rotation: 4, terrain: 'CBC',          groupe: 'Intermédiaires', equipe_a: 'Thierry Van Eeckhout / Sophie van der Dussen', equipe_b: 'Hervé de Broux / Valeriane Delahaye',      repos: 'Didier Devreese / Anne de Patoul' },
  { rotation: 4, terrain: 'Corona',       groupe: 'Débutants',      equipe_a: 'Thomas Le Berre / Floriane Vreuls',         equipe_b: 'Dick Joelle / Quentin Orban' },
  { rotation: 4, terrain: 'Zyla',         groupe: 'Débutants',      equipe_a: 'Joueur volant / Babs Orban',                equipe_b: 'Olfa / Gaëlle Van Caster' },
  { rotation: 4, terrain: 'DH Sport',     groupe: 'Débutants',      equipe_a: 'Oliver Aretz / Caroline Nieuwenhuys',       equipe_b: 'Kathleen Bouvy / Gégé Vierin' },
  { rotation: 4, terrain: 'Bertand',      groupe: 'Débutants',      equipe_a: 'Marianne / Patrice de Walque',              equipe_b: 'Catherine Henry de Frahan / Xavier De Buijl' },
  // ── Rotation 5 ─────────────────────────────────────────────────────────────
  { rotation: 5, terrain: 'CPH',          groupe: 'Compétiteurs',   equipe_a: 'Poulain / Sandrina Graceffa',               equipe_b: 'Benja Dessy / Christophe Goisse' },
  { rotation: 5, terrain: 'Stella Artois',groupe: 'Compétiteurs',   equipe_a: 'Collin Mathieu / Didier Baele',             equipe_b: 'Jeanfi Pahaut / Sébastien Witmeur' },
  { rotation: 5, terrain: 'CleanPower',   groupe: 'Compétiteurs',   equipe_a: 'Dorsan du Bois / Daout Delphine',           equipe_b: 'Fernando / Vincent Cardyn' },
  { rotation: 5, terrain: 'MetaSystem',   groupe: 'Intermédiaires', equipe_a: 'Thierry Verdoodt / Wendy',                  equipe_b: 'Hervé de Broux / Valeriane Delahaye',          repos: 'Thierry Van Eeckhout / Sophie van der Dussen' },
  { rotation: 5, terrain: 'Delahaut',     groupe: 'Intermédiaires', equipe_a: 'Xavier Carton / Magali Veronnez-Florent',   equipe_b: 'Didier Devreese / Anne de Patoul',             repos: 'Thierry Van Eeckhout / Sophie van der Dussen' },
  { rotation: 5, terrain: 'CBC',          groupe: 'Intermédiaires', equipe_a: 'Geoffroy Lemaigre / Nathalie Pirotte',       equipe_b: 'Marianne / Patrice de Walque',                  repos: 'Thierry Van Eeckhout / Sophie van der Dussen' },
  { rotation: 5, terrain: 'Corona',       groupe: 'Débutants',      equipe_a: 'Thomas Le Berre / Floriane Vreuls',         equipe_b: 'Kathleen Bouvy / Gégé Vierin' },
  { rotation: 5, terrain: 'Zyla',         groupe: 'Débutants',      equipe_a: 'Joueur volant / Babs Orban',                equipe_b: 'Catherine Henry de Frahan / Xavier De Buijl' },
  { rotation: 5, terrain: 'DH Sport',     groupe: 'Débutants',      equipe_a: 'Oliver Aretz / Caroline Nieuwenhuys',       equipe_b: 'Olfa / Gaëlle Van Caster' },
  { rotation: 5, terrain: 'Bertand',      groupe: 'Débutants',      equipe_a: 'Marianne / Patrice de Walque',              equipe_b: 'Dick Joelle / Quentin Orban' },
  // ── Rotation 6 (bonus/revanche) ────────────────────────────────────────────
  { rotation: 6, terrain: 'CPH',          groupe: 'Compétiteurs',   equipe_a: 'Poulain / Sandrina Graceffa',               equipe_b: 'Fernando / Vincent Cardyn',      repos: 'Match bonus / revanche' },
  { rotation: 6, terrain: 'Stella Artois',groupe: 'Compétiteurs',   equipe_a: 'Collin Mathieu / Didier Baele',             equipe_b: 'Benja Dessy / Christophe Goisse',repos: 'Match bonus / revanche' },
  { rotation: 6, terrain: 'CleanPower',   groupe: 'Compétiteurs',   equipe_a: 'Jeanfi Pahaut / Sébastien Witmeur',         equipe_b: 'Dorsan du Bois / Daout Delphine',repos: 'Match bonus / revanche' },
  { rotation: 6, terrain: 'MetaSystem',   groupe: 'Intermédiaires', equipe_a: 'Thierry Verdoodt / Wendy',                  equipe_b: 'Marianne / Patrice de Walque',                  repos: 'Xavier Carton / Magali Veronnez-Florent' },
  { rotation: 6, terrain: 'Delahaut',     groupe: 'Intermédiaires', equipe_a: 'Thierry Van Eeckhout / Sophie van der Dussen', equipe_b: 'Geoffroy Lemaigre / Nathalie Pirotte',      repos: 'Xavier Carton / Magali Veronnez-Florent' },
  { rotation: 6, terrain: 'CBC',          groupe: 'Intermédiaires', equipe_a: 'Didier Devreese / Anne de Patoul',          equipe_b: 'Hervé de Broux / Valeriane Delahaye',          repos: 'Xavier Carton / Magali Veronnez-Florent' },
  { rotation: 6, terrain: 'Corona',       groupe: 'Débutants',      equipe_a: 'Thomas Le Berre / Floriane Vreuls',         equipe_b: 'Olfa / Gaëlle Van Caster' },
  { rotation: 6, terrain: 'Zyla',         groupe: 'Débutants',      equipe_a: 'Joueur volant / Babs Orban',                equipe_b: 'Oliver Aretz / Caroline Nieuwenhuys' },
  { rotation: 6, terrain: 'DH Sport',     groupe: 'Débutants',      equipe_a: 'Marianne / Patrice de Walque',              equipe_b: 'Kathleen Bouvy / Gégé Vierin' },
  { rotation: 6, terrain: 'Bertand',      groupe: 'Débutants',      equipe_a: 'Dick Joelle / Quentin Orban',               equipe_b: 'Catherine Henry de Frahan / Xavier De Buijl' },
]

// Équipes par groupe pour le classement
export const EQUIPES_COMPETITEURS = [
  'Poulain / Sandrina Graceffa',
  'Collin Mathieu / Didier Baele',
  'Jeanfi Pahaut / Sébastien Witmeur',
  'Dorsan du Bois / Daout Delphine',
  'Fernando / Vincent Cardyn',
  'Benja Dessy / Christophe Goisse',
]

export const EQUIPES_INTERMEDIAIRES = [
  'Thierry Verdoodt / Wendy',
  'Xavier Carton / Magali Veronnez-Florent',
  'Thierry Van Eeckhout / Sophie van der Dussen',
  'Didier Devreese / Anne de Patoul',
  'Geoffroy Lemaigre / Nathalie Pirotte',
  'Hervé de Broux / Valeriane Delahaye',
]

export const EQUIPES_DEBUTANTS = [
  'Thomas Le Berre / Floriane Vreuls',
  'Oliver Aretz / Caroline Nieuwenhuys',
  'Joueur volant / Babs Orban',
  'Dick Joelle / Quentin Orban',
  'Kathleen Bouvy / Gégé Vierin',
  'Olfa / Gaëlle Van Caster',
  'Catherine Henry de Frahan / Xavier De Buijl',
  'Marianne / Patrice de Walque',
]
