// 📂 components/CATEGORIES/categoryNivel/categoryVehicules.js

const categoryVehicules = {
  // ✅ ESTRUCTURA CLARA Y CONSISTENTE
  levels: 2,
  level1: 'articleType',        // Nivel 1 siempre es articleType
  level2: 'subCategory',        // Nivel 2 siempre es subCategory
  requiresLevel2: false,
  
  // 🚗 TIPOS DE ARTÍCULOS (Nivel 1 - articleType)
  articleTypes: [
    // === articleType SIN SUBCATEGORÍAS (directo a subCategory = mismo id) ===
    { 
      id: 'voitures', 
      name: 'Voitures', 
      emoji: '🚗', 
      hasSublevel: false
    },
    { 
      id: 'utilitaire', 
      name: 'Utilitaire', 
      emoji: '🚐', 
      hasSublevel: false  
    },
    { 
      id: 'fourgon', 
      name: 'Fourgon', 
      emoji: '🚚', 
      hasSublevel: false 
    },
    { 
      id: 'camion', 
      name: 'Camion', 
      emoji: '🚛', 
      hasSublevel: false 
    },
    { 
      id: 'bus', 
      name: 'Bus', 
      emoji: '🚌', 
      hasSublevel: false 
    },
    { 
      id: 'tracteurs', 
      name: 'Tracteurs', 
      emoji: '🚜', 
      hasSublevel: false 
    },
    { 
      id: 'remorques', 
      name: 'Remorques', 
      emoji: '🚛', 
      hasSublevel: false 
    },

    // === articleType CON SUBCATEGORÍAS (necesita selección de subCategory) ===
    { 
      id: 'motos_scooters', 
      name: 'Motos & Scooters', 
      emoji: '🏍️', 
      hasSublevel: true 
    },
    { 
      id: 'quads', 
      name: 'Quads', 
      emoji: '🚜', 
      hasSublevel: true 
    },
    { 
      id: 'engin', 
      name: 'Engin', 
      emoji: '🚜', 
      hasSublevel: true 
    },
    { 
      id: 'bateaux_barques', 
      name: 'Bateaux & Barques', 
      emoji: '🛥️', 
      hasSublevel: true
    },
    { 
      id: 'pieces_vehicules', 
      name: 'Pièces & Accessoires', 
      emoji: '🔧', 
      hasSublevel: true 
    }
  ],
  
  // 🚗 SUBCATEGORÍAS POR CADA articleType (solo para los que tienen hasSublevel: true)
  subcategories: {
    // === SUBCATEGORÍAS DE "Motos & Scooters" ===
    'motos_scooters': [
      { id: 'motos', name: 'Motos', emoji: '🏍️' },
      { id: 'scooters', name: 'Scooters', emoji: '🛵' },
      { id: 'motos_cross', name: 'Motos Cross', emoji: '🏁' },
      { id: 'scooters_electriques', name: 'Scooters électriques', emoji: '⚡' },
      { id: 'accessoires_motos', name: 'Accessoires motos', emoji: '🛡️' }
    ],

    // === SUBCATEGORÍAS DE "Quads" ===
    'quads': [
      { id: 'quads_enfants', name: 'Quads enfants', emoji: '👶' },
      { id: 'quads_adultes', name: 'Quads adultes', emoji: '👨' },
      { id: 'quads_utilitaire', name: 'Quads utilitaire', emoji: '🛠️' },
      { id: 'quads_sport', name: 'Quads sport', emoji: '🏁' }
    ],

    // === SUBCATEGORÍAS DE "Engin" ===
    'engin': [
      { id: 'engins_chantier', name: 'Engins de chantier', emoji: '🏗️' },
      { id: 'engins_agricoles', name: 'Engins agricoles', emoji: '🌾' },
      { id: 'nacelles_elevatrices', name: 'Nacelles & Élévatrices', emoji: '📐' },
      { id: 'compacteurs', name: 'Compacteurs', emoji: '🛣️' },
      { id: 'grues', name: 'Grues', emoji: '🏗️' }
    ],

    // === SUBCATEGORÍAS DE "Bateaux & Barques" ===
    'bateaux_barques': [
      { id: 'jet_ski', name: 'Jet-ski', emoji: '💨' },
      { id: 'bateaux_rigide', name: 'Bateaux rigide', emoji: '🛥️' },
      { id: 'bateaux_pneumatique', name: 'Bateaux pneumatique', emoji: '🛶' },
      { id: 'barques', name: 'Barques', emoji: '🚤' },
      { id: 'voiliers', name: 'Voiliers', emoji: '⛵' },
      { id: 'catamarans', name: 'Catamarans', emoji: '🛥️' },
      { id: 'yachts', name: 'Yachts', emoji: '🛳️' },
      { id: 'moteurs_bateaux', name: 'Moteurs bateaux', emoji: '⚙️' },
      { id: 'accessoires_bateaux', name: 'Accessoires bateaux', emoji: '🎣' }
    ],

    // === SUBCATEGORÍAS DE "Pièces & Accessoires" ===
    'pieces_vehicules': [
      { id: 'pieces_voitures', name: 'Pièces voitures', emoji: '🚗' },
      { id: 'pieces_motos', name: 'Pièces motos', emoji: '🏍️' },
      { id: 'pneus_jantes', name: 'Pneus & Jantes', emoji: '🛞' },
      { id: 'batteries', name: 'Batteries', emoji: '🔋' },
      { id: 'systeme_echappement', name: 'Système échappement', emoji: '💨' },
      { id: 'systeme_freins', name: 'Système freins', emoji: '🛑' },
      { id: 'systeme_suspension', name: 'Système suspension', emoji: '🌀' },
      { id: 'moteurs_boites_vitesse', name: 'Moteurs & Boîtes vitesse', emoji: '⚙️' },
      { id: 'carrosserie', name: 'Carrosserie', emoji: '🚘' },
      { id: 'interieur_vehicule', name: 'Intérieur véhicule', emoji: '💺' },
      { id: 'electronique_vehicule', name: 'Électronique véhicule', emoji: '📱' },
      { id: 'accessoires_interieur', name: 'Accessoires intérieur', emoji: '🎵' },
      { id: 'accessoires_exterieur', name: 'Accessoires extérieur', emoji: '🔧' }
    ]
  }
};

export default categoryVehicules;