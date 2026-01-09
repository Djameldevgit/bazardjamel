// 📂 components/CATEGORIES/categoryNivel/categoryLoisirs.js

const categoryLoisirs = {
    levels: 2,
    level1: 'categorie',
    level2: 'subcategory',
    requiresLevel2: false, // Mixto
    
    categories: [
      // 🐾 CON NIVEL 2
      { id: 'animalerie', name: 'Animalerie', emoji: '🐾', hasSublevel: true },
      { id: 'consoles_jeux_videos', name: 'Consoles et Jeux Vidéos', emoji: '🎮', hasSublevel: true },
      { id: 'livres_magazines', name: 'Livres & Magazines', emoji: '📚', hasSublevel: true },
      { id: 'instruments_musique', name: 'Instruments de Musique', emoji: '🎵', hasSublevel: true },
      { id: 'jouets', name: 'Jouets', emoji: '🧸', hasSublevel: true },
      { id: 'chasse_peche', name: 'Chasse & Pêche', emoji: '🎣', hasSublevel: true },
      { id: 'jardinage', name: 'Jardinage', emoji: '🌱', hasSublevel: true },
      { id: 'jeux_loisirs', name: 'Les Jeux de loisirs', emoji: '♟️', hasSublevel: true },
      { id: 'barbecue_grillades', name: 'Barbecue & Grillades', emoji: '🍖', hasSublevel: true },
      { id: 'vapes_chichas', name: 'Vapes & Chichas', emoji: '💨', hasSublevel: true },
      { id: 'produits_accessoires_ete', name: 'Produits & Accessoires d\'été', emoji: '🏖️', hasSublevel: true },
      
      // 📜 SIN NIVEL 2 (DIRECTAS)
      { id: 'antiquites_collections', name: 'Antiquités & Collections', emoji: '🏺', hasSublevel: false },
      { id: 'autres_loisirs', name: 'Autre', emoji: '🎪', hasSublevel: false }
    ],
    
    subcategories: {
      // 🐾 ANIMALERIE
      animalerie: [
        { id: 'produits_soin_animal', name: 'Produits de soin animal', emoji: '💊' },
        { id: 'chien', name: 'Chien', emoji: '🐕' },
        { id: 'oiseau', name: 'Oiseau', emoji: '🐦' },
        { id: 'animaux_ferme', name: 'Animaux de ferme', emoji: '🐄' },
        { id: 'chat', name: 'Chat', emoji: '🐈' },
        { id: 'cheval', name: 'Cheval', emoji: '🐎' },
        { id: 'poisson', name: 'Poisson', emoji: '🐟' },
        { id: 'accessoire_animaux', name: 'Accessoire pour animaux', emoji: '🛁' },
        { id: 'nourriture_animaux', name: 'Nourriture pour animaux', emoji: '🍖' },
        { id: 'autres_animaux', name: 'Autres Animaux', emoji: '🐾' }
      ],
      
      // 🎮 CONSOLES ET JEUX VIDÉOS
      consoles_jeux_videos: [
        { id: 'consoles', name: 'Consoles', emoji: '🕹️' },
        { id: 'jeux_videos', name: 'Jeux videos', emoji: '🎮' },
        { id: 'accessoires_jeux', name: 'Accessoires', emoji: '🎧' }
      ],
      
      // 📚 LIVRES & MAGAZINES
      livres_magazines: [
        { id: 'litterature_philosophie', name: 'Littérature et philosophie', emoji: '📖' },
        { id: 'romans', name: 'Romans', emoji: '📚' },
        { id: 'scolaire_parascolaire', name: 'Scolaire & Parascolaire', emoji: '🎒' },
        { id: 'sciences_techniques_medecine', name: 'Sciences, techniques et medecine', emoji: '🔬' },
        { id: 'traduction', name: 'Traduction', emoji: '🌐' },
        { id: 'religion_spiritualites', name: 'Religion et Spiritualités', emoji: '🙏' },
        { id: 'historique', name: 'Historique', emoji: '🏛️' },
        { id: 'cuisine', name: 'Cuisine', emoji: '🍳' },
        { id: 'essais_documents', name: 'Essais et documents', emoji: '📄' },
        { id: 'fiction', name: 'Fiction', emoji: '📚' },
        { id: 'enfants', name: 'Enfants', emoji: '👶' },
        { id: 'mangas_bande_dessinee', name: 'Mangas et bande dessinée', emoji: '🇯🇵' }
      ],
      
      // 🎵 INSTRUMENTS DE MUSIQUE
      instruments_musique: [
        { id: 'instruments_electriques', name: 'Instruments électriques', emoji: '🎸' },
        { id: 'instruments_percussion', name: 'Instruments à percussion : les idiophones', emoji: '🥁' },
        { id: 'instruments_vent', name: 'Instruments a vent', emoji: '🎺' },
        { id: 'instruments_cordes', name: 'Instruments à cordes', emoji: '🎻' },
        { id: 'autre_instruments', name: 'Autre', emoji: '🎵' }
      ],
      
      // 🧸 JOUETS
      jouets: [
        { id: 'jeux_eveil', name: 'Jeux d\'éveil', emoji: '🧠' },
        { id: 'poupees_peluches', name: 'Poupées - Peluches', emoji: '🧸' },
        { id: 'personnages_deguisements', name: 'Personnages - Déguisements', emoji: '🦸' },
        { id: 'jeux_educatifs_puzzle', name: 'Jeux éducatifs - Puzzle', emoji: '🧩' },
        { id: 'vehicules_circuits', name: 'Véhicules et Circuits', emoji: '🚗' },
        { id: 'jeux_electroniques', name: 'Jeux électroniques', emoji: '🕹️' },
        { id: 'construction_outils', name: 'Construction et Outils', emoji: '🧱' },
        { id: 'jeux_plein_air', name: 'Jeux de plein air', emoji: '⚽' },
        { id: 'animaux_jouets', name: 'Animaux', emoji: '🐻' }
      ],
      
      // 🎣 CHASSE & PÊCHE
      chasse_peche: [
        { id: 'canne_peche', name: 'Canne à pêche', emoji: '🎣' },
        { id: 'moulinets', name: 'Moulinets', emoji: '🎣' },
        { id: 'sondeurs_gps', name: 'Sondeurs-GPS', emoji: '📡' },
        { id: 'vetements_chasse_peche', name: 'Vêtements', emoji: '🧥' },
        { id: 'accessoires_peche', name: 'Accessoires de pêche', emoji: '🎒' },
        { id: 'materiel_plongee', name: 'Matériel plongée', emoji: '🤿' },
        { id: 'equipements_chasse', name: 'Equipements de chasse', emoji: '🔫' }
      ],
      
      // 🌱 JARDINAGE
      jardinage: [
        { id: 'mobilier_jardin', name: 'Mobilier de jardin', emoji: '🪑' },
        { id: 'semence', name: 'Semence', emoji: '🌱' },
        { id: 'outillage_arrosage', name: 'Outillage-Arrosage du jardin', emoji: '🚿' },
        { id: 'plantes_fleurs', name: 'Plantes et fleurs', emoji: '🌺' },
        { id: 'equipements_materiels_jardin', name: 'Équipements Et Matériels', emoji: '🛠️' },
        { id: 'insecticide', name: 'Insecticide', emoji: '🐛' },
        { id: 'decoration_jardin', name: 'Décoration', emoji: '🎍' },
        { id: 'livres_agriculture_jardin', name: 'Livres D\'Agriculture Et De Jardinage', emoji: '📚' }
      ],
      
      // ♟️ LES JEUX DE LOISIRS
      jeux_loisirs: [
        { id: 'babyfoot', name: 'Babyfoot', emoji: '⚽' },
        { id: 'billiard', name: 'Billiard', emoji: '🎱' },
        { id: 'ping_pong', name: 'Ping pong', emoji: '🏓' },
        { id: 'echecs', name: 'Échecs', emoji: '♟️' },
        { id: 'jeux_societe', name: 'Jeux De Société', emoji: '🎲' },
        { id: 'autres_jeux_loisirs', name: 'Autres Jeux De Loisirs', emoji: '🎯' }
      ],
      
      // 🍖 BARBECUE & GRILLADES
      barbecue_grillades: [
        { id: 'barbecue', name: 'Barbecue', emoji: '🔥' },
        { id: 'charbon', name: 'Charbon', emoji: '⚫' },
        { id: 'accessoires_barbecue', name: 'Accessoires', emoji: '🍴' }
      ],
      
      // 💨 VAPES & CHICHAS
      vapes_chichas: [
        { id: 'vapes_cigarettes_electroniques', name: 'Vapes & Cigarettes électroniques', emoji: '🚬' },
        { id: 'chichas', name: 'Chichas', emoji: '💨' },
        { id: 'consommables', name: 'Consommables', emoji: '🫙' },
        { id: 'accessoires_vapes', name: 'Accessoires', emoji: '🔧' }
      ],
      
      // 🏖️ PRODUITS & ACCESSOIRES D'ÉTÉ
      produits_accessoires_ete: [
        { id: 'piscines', name: 'Piscines', emoji: '🏊' },
        { id: 'matelas_gonflables', name: 'Matelas gonflables', emoji: '🛏️' },
        { id: 'parasols', name: 'Parasols', emoji: '⛱️' },
        { id: 'transats_chaises_pliables', name: 'Transats & Chaises pliables', emoji: '🪑' },
        { id: 'tables_ete', name: 'Tables', emoji: '🪑' },
        { id: 'autres_accessoires_ete', name: 'Autres', emoji: '☀️' }
      ]
    }
  };
  
  export default categoryLoisirs;