// scripts/seedCompleteCategories.js
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/categoryModel');

// ============ TODAS LAS 6 CATEGORÍAS ============

const ALL_CATEGORIES = [
  // 1. IMMOBILIER (3 niveles: main > operation > property)
  {
    id: 'immobilier',
    name: 'Immobilier',
    emoji: '🏡',
    config: {
      levels: 3,
      level1: 'operation',
      level2: 'property',
      requiresLevel2: true,
      displayName: 'operation',
      accordionLevels: 3
    },
    level1Items: [
      { id: 'vente', name: 'Vente', emoji: '💰', hasSublevel: true },
      { id: 'location', name: 'Location', emoji: '🔑', hasSublevel: true },
      { id: 'location_vacances', name: 'Location vacances', emoji: '🏖️', hasSublevel: true },
      { id: 'cherche_location', name: 'Cherche location', emoji: '🔍', hasSublevel: true },
      { id: 'cherche_achat', name: 'Cherche achat', emoji: '🔍', hasSublevel: true }
    ],
    level2Items: {
      vente: [
        { id: 'appartement', name: 'Appartement', emoji: '🏢' },
        { id: 'local', name: 'Local', emoji: '🏪' },
        { id: 'villa', name: 'Villa', emoji: '🏡' },
        { id: 'terrain', name: 'Terrain', emoji: '⛰️' },
        { id: 'terrain_agricole', name: 'Terrain Agricole', emoji: '🌾' },
        { id: 'immeuble', name: 'Immeuble', emoji: '🏢' },
        { id: 'bungalow', name: 'Bungalow', emoji: '🏝️' },
        { id: 'hangar_usine', name: 'Hangar - Usine', emoji: '🏭' },
        { id: 'autre', name: 'Autre', emoji: '🏠' }
      ],
      location: [
        { id: 'appartement', name: 'Appartement', emoji: '🏢' },
        { id: 'local', name: 'Local', emoji: '🏪' },
        { id: 'villa', name: 'Villa', emoji: '🏡' },
        { id: 'immeuble', name: 'Immeuble', emoji: '🏢' },
        { id: 'bungalow', name: 'Bungalow', emoji: '🏝️' },
        { id: 'autre', name: 'Autre', emoji: '🏠' }
      ],
      location_vacances: [
        { id: 'appartement', name: 'Appartement', emoji: '🏢' },
        { id: 'villa', name: 'Villa', emoji: '🏡' },
        { id: 'bungalow', name: 'Bungalow', emoji: '🏝️' },
        { id: 'autre', name: 'Autre', emoji: '🏠' }
      ],
      cherche_location: [
        { id: 'appartement', name: 'Appartement', emoji: '🏢' },
        { id: 'local', name: 'Local', emoji: '🏪' },
        { id: 'villa', name: 'Villa', emoji: '🏡' },
        { id: 'immeuble', name: 'Immeuble', emoji: '🏢' },
        { id: 'bungalow', name: 'Bungalow', emoji: '🏝️' },
        { id: 'autre', name: 'Autre', emoji: '🏠' }
      ],
      cherche_achat: [
        { id: 'appartement', name: 'Appartement', emoji: '🏢' },
        { id: 'local', name: 'Local', emoji: '🏪' },
        { id: 'villa', name: 'Villa', emoji: '🏡' },
        { id: 'terrain', name: 'Terrain', emoji: '⛰️' },
        { id: 'terrain_agricole', name: 'Terrain Agricole', emoji: '🌾' },
        { id: 'immeuble', name: 'Immeuble', emoji: '🏢' },
        { id: 'bungalow', name: 'Bungalow', emoji: '🏝️' },
        { id: 'hangar_usine', name: 'Hangar - Usine', emoji: '🏭' },
        { id: 'autre', name: 'Autre', emoji: '🏠' }
      ]
    }
  },

  // 2. VÉHICULES (2 niveles: main > category)
  {
    id: 'vehicules',
    name: 'Véhicules',
    emoji: '🚗',
    config: {
      levels: 2,
      level1: 'categorie',
      level2: null,
      requiresLevel2: false,
      displayName: 'categorie',
      accordionLevels: 2
    },
    level1Items: [
      { id: 'voitures', name: 'Voitures', emoji: '🚗', hasSublevel: false },
      { id: 'utilitaire', name: 'Utilitaire', emoji: '🚐', hasSublevel: false },
      { id: 'motos_scooters', name: 'Motos & Scooters', emoji: '🏍️', hasSublevel: false },
      { id: 'quads', name: 'Quads', emoji: '🚜', hasSublevel: false },
      { id: 'fourgon', name: 'Fourgon', emoji: '🚚', hasSublevel: false },
      { id: 'camion', name: 'Camion', emoji: '🚛', hasSublevel: false },
      { id: 'bus', name: 'Bus', emoji: '🚌', hasSublevel: false },
      { id: 'engin', name: 'Engin', emoji: '🚜', hasSublevel: false },
      { id: 'tracteurs', name: 'Tracteurs', emoji: '🚜', hasSublevel: false },
      { id: 'remorques', name: 'Remorques', emoji: '🚛', hasSublevel: false },
      { id: 'bateaux_barques', name: 'Bateaux & Barques', emoji: '🛥️', hasSublevel: false }
    ],
    level2Items: {}
  },

  // 3. TÉLÉPHONES (2 o 3 niveles dependiendo)
  {
    id: 'telephones',
    name: 'Téléphones',
    emoji: '📱',
    config: {
      levels: 'mixed',
      level1: 'categorie',
      level2: 'subCategory',
      requiresLevel2: false,
      displayName: 'categorie',
      accordionLevels: 3
    },
    level1Items: [
      { id: 'smartphones', name: 'Smartphones', emoji: '📱', hasSublevel: false },
      { id: 'telephones_cellulaires', name: 'Téléphones cellulaires', emoji: '📞', hasSublevel: false },
      { id: 'tablettes', name: 'Tablettes', emoji: '💻', hasSublevel: false },
      { id: 'fixes_fax', name: 'Fixes & Fax', emoji: '☎️', hasSublevel: false },
      { id: 'smartwatchs', name: 'Smartwatchs', emoji: '⌚', hasSublevel: false },
      { id: 'accessoires', name: 'Accessoires', emoji: '🎧', hasSublevel: false },
      { id: 'pieces_rechange', name: 'Pièces de rechange', emoji: '🔧', hasSublevel: false },
      { id: 'offres_abonnements', name: 'Offres & Abonnements', emoji: '📶', hasSublevel: false },
      { id: 'protection_antichoc', name: 'Protection & Antichoc', emoji: '🛡️', hasSublevel: true },
      { id: 'ecouteurs_son', name: 'Ecouteurs & Son', emoji: '🎵', hasSublevel: true },
      { id: 'chargeurs_cables', name: 'Chargeurs & Câbles', emoji: '🔌', hasSublevel: true },
      { id: 'supports_stabilisateurs', name: 'Supports & Stabilisateurs', emoji: '📐', hasSublevel: true },
      { id: 'manettes', name: 'Manettes', emoji: '🎮', hasSublevel: true },
      { id: 'vr', name: 'VR', emoji: '👓', hasSublevel: true },
      { id: 'power_banks', name: 'Power banks', emoji: '🔋', hasSublevel: true },
      { id: 'stylets', name: 'Stylets', emoji: '✏️', hasSublevel: true },
      { id: 'cartes_memoire', name: 'Cartes Mémoire', emoji: '💾', hasSublevel: true }
    ],
    level2Items: {
      protection_antichoc: [
        { id: 'protections_ecran', name: 'Protections d\'écran', emoji: '🖥️' },
        { id: 'coques_antichoc', name: 'Coques & Antichoc', emoji: '📱' },
        { id: 'films_protection', name: 'Films de protection', emoji: '📋' },
        { id: 'etuis', name: 'Étuis', emoji: '🎁' },
        { id: 'protections_camera', name: 'Protections de caméra', emoji: '📸' }
      ],
      ecouteurs_son: [
        { id: 'ecouteurs_filaires', name: 'Écouteurs filaires', emoji: '🎧' },
        { id: 'ecouteurs_bluetooth', name: 'Écouteurs Bluetooth', emoji: '🔵' },
        { id: 'casques_audio', name: 'Casques audio', emoji: '🎧' },
        { id: 'hauts_parleurs_portables', name: 'Hauts-parleurs portables', emoji: '🔊' },
        { id: 'adaptateurs_audio', name: 'Adaptateurs audio', emoji: '🎛️' }
      ],
      chargeurs_cables: [
        { id: 'chargeurs_mur', name: 'Chargeurs mural', emoji: '🔌' },
        { id: 'chargeurs_voiture', name: 'Chargeurs voiture', emoji: '🚗' },
        { id: 'chargeurs_sans_fil', name: 'Chargeurs sans fil', emoji: '⚡' },
        { id: 'cables_usb', name: 'Câbles USB', emoji: '🔌' },
        { id: 'cables_lightning', name: 'Câbles Lightning', emoji: '⚡' },
        { id: 'cables_type_c', name: 'Câbles Type-C', emoji: '🔌' },
        { id: 'hubs_chargeurs', name: 'Hubs chargeurs', emoji: '🔗' }
      ],
      supports_stabilisateurs: [
        { id: 'supports', name: 'Supports', emoji: '📱' },
        { id: 'stabilisateurs', name: 'Stabilisateurs', emoji: '🤳' },
        { id: 'barres_selfies', name: 'Barres de selfies', emoji: '📸' },
        { id: 'pieds_telephone', name: 'Pieds pour téléphone', emoji: '📐' },
        { id: 'ventouses_voiture', name: 'Ventouses voiture', emoji: '🚗' }
      ],
      manettes: [
        { id: 'manettes_bluetooth', name: 'Manettes Bluetooth', emoji: '🎮' },
        { id: 'manettes_filaires', name: 'Manettes filaires', emoji: '🎮' },
        { id: 'manettes_telephone', name: 'Manettes pour téléphone', emoji: '📱' },
        { id: 'manettes_tablette', name: 'Manettes pour tablette', emoji: '💻' },
        { id: 'accessoires_manettes', name: 'Accessoires pour manettes', emoji: '🔧' }
      ],
      vr: [
        { id: 'casques_vr', name: 'Casques VR', emoji: '👓' },
        { id: 'lunettes_vr', name: 'Lunettes VR', emoji: '🕶️' },
        { id: 'accessoires_vr', name: 'Accessoires VR', emoji: '🔧' },
        { id: 'controleurs_vr', name: 'Contrôleurs VR', emoji: '🎮' },
        { id: 'jeux_vr', name: 'Jeux VR', emoji: '🎮' }
      ],
      power_banks: [
        { id: 'power_bank_10000mah', name: 'Power bank 10,000mAh', emoji: '🔋' },
        { id: 'power_bank_20000mah', name: 'Power bank 20,000mAh', emoji: '🔋' },
        { id: 'power_bank_solaire', name: 'Power bank solaire', emoji: '☀️' },
        { id: 'power_bank_rapide', name: 'Power bank charge rapide', emoji: '⚡' },
        { id: 'power_bank_compact', name: 'Power bank compact', emoji: '📱' }
      ],
      stylets: [
        { id: 'stylets_actifs', name: 'Stylets actifs', emoji: '✏️' },
        { id: 'stylets_passifs', name: 'Stylets passifs', emoji: '✏️' },
        { id: 'stylets_bluetooth', name: 'Stylets Bluetooth', emoji: '🔵' },
        { id: 'stylets_tablette', name: 'Stylets pour tablette', emoji: '💻' },
        { id: 'recharges_stylet', name: 'Recharges pour stylet', emoji: '🔋' }
      ],
      cartes_memoire: [
        { id: 'sd_cards', name: 'Cartes SD', emoji: '💾' },
        { id: 'micro_sd_cards', name: 'Cartes Micro SD', emoji: '💾' },
        { id: 'sdhc_cards', name: 'Cartes SDHC', emoji: '💾' },
        { id: 'sdxc_cards', name: 'Cartes SDXC', emoji: '💾' },
        { id: 'adaptateurs_carte', name: 'Adaptateurs de carte', emoji: '🔌' },
        { id: 'lecteurs_carte', name: 'Lecteurs de carte', emoji: '📖' }
      ]
    }
  },

  // 4. ÉLECTROMÉNAGER (2 o 3 niveles dependiendo)
  {
    id: 'electromenager',
    name: 'Électroménager',
    emoji: '🔌',
    config: {
      levels: 'mixed',
      level1: 'categorie',
      level2: 'subCategory',
      requiresLevel2: false,
      displayName: 'categorie',
      accordionLevels: 3
    },
    level1Items: [
      { id: 'televiseurs', name: 'Téléviseurs', emoji: '📺', hasSublevel: false },
      { id: 'demodulateurs_box_tv', name: 'Démodulateurs & Box TV', emoji: '📦', hasSublevel: false },
      { id: 'paraboles_switch_tv', name: 'Paraboles & Switch TV', emoji: '🛰️', hasSublevel: false },
      { id: 'abonnements_iptv', name: 'Abonnements IPTV', emoji: '📡', hasSublevel: false },
      { id: 'cameras_accessories', name: 'Caméras & Accessories', emoji: '📹', hasSublevel: false },
      { id: 'audio', name: 'Audio', emoji: '🔊', hasSublevel: false },
      { id: 'aspirateurs_nettoyeurs', name: 'Aspirateurs & Nettoyeurs', emoji: '🧹', hasSublevel: false },
      { id: 'repassage', name: 'Repassage', emoji: '👔', hasSublevel: false },
      { id: 'beaute_hygiene', name: 'Beauté & Hygiène', emoji: '💄', hasSublevel: false },
      { id: 'machines_coudre', name: 'Machines à coudre', emoji: '🧵', hasSublevel: false },
      { id: 'telecommandes', name: 'Télécommandes', emoji: '🎮', hasSublevel: false },
      { id: 'securite_gps', name: 'Sécurité & GPS', emoji: '🚨', hasSublevel: false },
      { id: 'composants_electroniques', name: 'Composants électroniques', emoji: '⚙️', hasSublevel: false },
      { id: 'pieces_rechange', name: 'Pièces de rechange', emoji: '🔧', hasSublevel: false },
      { id: 'autre_electromenager', name: 'Autre Électroménager', emoji: '🔌', hasSublevel: false },
      { id: 'refrigerateurs_congelateurs', name: 'Réfrigérateurs & Congélateurs', emoji: '❄️', hasSublevel: true },
      { id: 'machines_laver', name: 'Machines à laver', emoji: '🧺', hasSublevel: true },
      { id: 'lave_vaisselles', name: 'Lave-vaisselles', emoji: '🍽️', hasSublevel: true },
      { id: 'fours_cuisson', name: 'Fours & Cuisson', emoji: '🔥', hasSublevel: true },
      { id: 'chauffage_climatisation', name: 'Chauffage & Climatisation', emoji: '🌡️', hasSublevel: true },
      { id: 'appareils_cuisine', name: 'Appareils de cuisine', emoji: '🍳', hasSublevel: true }
    ],
    level2Items: {
      refrigerateurs_congelateurs: [
        { id: 'refrigerateur', name: 'Réfrigérateur', emoji: '🧊' },
        { id: 'congelateur', name: 'Congélateur', emoji: '❄️' },
        { id: 'refrigerateur_congelateur', name: 'Réfrigérateur-Congélateur', emoji: '🧊❄️' },
        { id: 'cave_vin', name: 'Cave à vin', emoji: '🍷' }
      ],
      machines_laver: [
        { id: 'lave_linge', name: 'Lave-linge', emoji: '👚' },
        { id: 'seche_linge', name: 'Sèche-linge', emoji: '🌞' },
        { id: 'lave_linge_seche_linge', name: 'Lave-linge/Sèche-linge', emoji: '👚🌞' },
        { id: 'lave_linge_essorage', name: 'Lave-linge avec essorage', emoji: '🌀' }
      ],
      lave_vaisselles: [
        { id: 'lave_vaisselle_encastrable', name: 'Lave-vaisselle encastrable', emoji: '📦' },
        { id: 'lave_vaisselle_poselibre', name: 'Lave-vaisselle pose libre', emoji: '🍽️' },
        { id: 'lave_vaisselle_compact', name: 'Lave-vaisselle compact', emoji: '📦' }
      ],
      fours_cuisson: [
        { id: 'four_electrique', name: 'Four électrique', emoji: '⚡' },
        { id: 'four_gaz', name: 'Four à gaz', emoji: '🔥' },
        { id: 'four_micro_ondes', name: 'Four micro-ondes', emoji: '🌀' },
        { id: 'plaque_cuisson', name: 'Plaque de cuisson', emoji: '🍳' },
        { id: 'cuisiniere', name: 'Cuisinière', emoji: '👩‍🍳' }
      ],
      chauffage_climatisation: [
        { id: 'climatiseur', name: 'Climatiseur', emoji: '❄️' },
        { id: 'ventilateur', name: 'Ventilateur', emoji: '💨' },
        { id: 'radiateur', name: 'Radiateur', emoji: '🔥' },
        { id: 'chauffe_eau', name: 'Chauffe-eau', emoji: '🚿' },
        { id: 'pompe_chaleur', name: 'Pompe à chaleur', emoji: '🌡️' }
      ],
      appareils_cuisine: [
        { id: 'robot_cuisine', name: 'Robot de cuisine', emoji: '🍲' },
        { id: 'mixeur', name: 'Mixeur', emoji: '🥤' },
        { id: 'bouilloire', name: 'Bouilloire', emoji: '♨️' },
        { id: 'cafetiere', name: 'Cafetière', emoji: '☕' },
        { id: 'grille_pain', name: 'Grille-pain', emoji: '🍞' }
      ]
    }
  },

  // 5. VÊTEMENTS
  {
    id: 'vetements',
    name: 'Vêtements',
    emoji: '👕',
    config: {
      levels: 3,
      level1: 'categorie',
      level2: 'subCategory',
      requiresLevel2: false,
      displayName: 'categorie',
      accordionLevels: 3
    },
    level1Items: [
      { id: 'hommes', name: 'Hommes', emoji: '👨', hasSublevel: true },
      { id: 'femmes', name: 'Femmes', emoji: '👩', hasSublevel: true },
      { id: 'enfants', name: 'Enfants', emoji: '👶', hasSublevel: true },
      { id: 'accessoires_mode', name: 'Accessoires mode', emoji: '👜', hasSublevel: true }
    ],
    level2Items: {
      hommes: [
        { id: 'chemises', name: 'Chemises', emoji: '👔' },
        { id: 'pantalons', name: 'Pantalons', emoji: '👖' },
        { id: 'tshirts', name: 'T-shirts', emoji: '👕' },
        { id: 'costumes', name: 'Costumes', emoji: '🤵' },
        { id: 'chaussures', name: 'Chaussures', emoji: '👞' }
      ],
      femmes: [
        { id: 'robes', name: 'Robes', emoji: '👗' },
        { id: 'jupes', name: 'Jupes', emoji: '👚' },
        { id: 'blouses', name: 'Blouses', emoji: '👚' },
        { id: 'chaussures_femmes', name: 'Chaussures', emoji: '👠' },
        { id: 'sacs', name: 'Sacs', emoji: '👜' }
      ],
      enfants: [
        { id: 'bebes', name: 'Bébés', emoji: '🍼' },
        { id: 'filles', name: 'Filles', emoji: '👧' },
        { id: 'garcons', name: 'Garçons', emoji: '👦' },
        { id: 'chaussures_enfants', name: 'Chaussures enfants', emoji: '👟' }
      ],
      accessoires_mode: [
        { id: 'sacs_accessoires', name: 'Sacs', emoji: '👜' },
        { id: 'ceintures', name: 'Ceintures', emoji: '⛓️' },
        { id: 'bijoux', name: 'Bijoux', emoji: '💎' },
        { id: 'montres', name: 'Montres', emoji: '⌚' },
        { id: 'lunettes', name: 'Lunettes', emoji: '👓' }
      ]
    }
  },

  // 6. VOYAGE
  {
    id: 'voyage',
    name: 'Voyage',
    emoji: '✈️',
    config: {
      levels: 3,
      level1: 'type',
      level2: 'service',
      requiresLevel2: false,
      displayName: 'type',
      accordionLevels: 3
    },
    level1Items: [
      { id: 'billets_avion', name: 'Billets d\'avion', emoji: '🎫', hasSublevel: false },
      { id: 'hotels', name: 'Hôtels', emoji: '🏨', hasSublevel: true },
      { id: 'location_voiture', name: 'Location de voiture', emoji: '🚗', hasSublevel: false },
      { id: 'circuits', name: 'Circuits', emoji: '🗺️', hasSublevel: true },
      { id: 'croisieres', name: 'Croisières', emoji: '🛳️', hasSublevel: false },
      { id: 'assurance_voyage', name: 'Assurance voyage', emoji: '🛡️', hasSublevel: false }
    ],
    level2Items: {
      hotels: [
        { id: 'hotel_etoile', name: 'Hôtel 5 étoiles', emoji: '⭐' },
        { id: 'hotel_affaire', name: 'Hôtel d\'affaires', emoji: '💼' },
        { id: 'auberge', name: 'Auberge', emoji: '🏡' },
        { id: 'appart_hotel', name: 'Appart\'hôtel', emoji: '🏢' },
        { id: 'villa_location', name: 'Villa en location', emoji: '🏖️' }
      ],
      circuits: [
        { id: 'circuit_europe', name: 'Circuit Europe', emoji: '🇪🇺' },
        { id: 'circuit_asie', name: 'Circuit Asie', emoji: '🌏' },
        { id: 'circuit_afrique', name: 'Circuit Afrique', emoji: '🌍' },
        { id: 'circuit_amerique', name: 'Circuit Amérique', emoji: '🌎' },
        { id: 'circuit_australie', name: 'Circuit Australie', emoji: '🦘' }
      ]
    }
  }
];

// ============ FUNCIÓN PRINCIPAL CORREGIDA ============

async function seedCompleteCategories() {
  try {
    // 1. Conectar a MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB conectado');

    // 2. Primero, verificar el modelo para ver qué valores de 'level' acepta
    console.log('🔍 Verificando esquema de Category...');
    const CategorySchema = Category.schema;
    const levelPath = CategorySchema.path('level');
    
    // Mostrar información sobre la validación de 'level'
    if (levelPath && levelPath.enumValues) {
      console.log(`   ✅ El campo 'level' acepta estos valores: ${levelPath.enumValues.join(', ')}`);
      console.log(`   📝 Usando niveles: 1, 2, 3 en lugar de 0, 1, 2`);
    } else {
      console.log('   ⚠️ No se encontró validación enum para el campo level');
      console.log('   📝 Usando niveles: 1, 2, 3');
    }

    // 3. Limpiar colección existente (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await Category.deleteMany({});
      console.log('🧹 Colección de categorías limpiada');
    }

    // 4. Variables para estadísticas
    const stats = {
      level1: 0,  // Nivel principal (antes 0, ahora 1)
      level2: 0,  // Subcategorías (antes 1, ahora 2)
      level3: 0,  // Artículos finales (antes 2, ahora 3)
      total: 0,
      byCategory: {}
    };

    // 5. Procesar cada categoría principal (nivel 1)
    for (const [index, categoryData] of ALL_CATEGORIES.entries()) {
      console.log(`\n📦 [${index + 1}/6] Procesando: ${categoryData.name} ${categoryData.emoji}`);
      
      stats.byCategory[categoryData.id] = {
        level1: 0,
        level2: 0,
        level3: 0,
        total: 0
      };

      // Crear categoría principal (nivel 1)
      const mainCategory = new Category({
        name: categoryData.name,
        slug: categoryData.id,
        emoji: categoryData.emoji,
        level: 1, // CAMBIADO: De 0 a 1
        order: index + 1,
        parent: null,
        ancestors: [],
        path: categoryData.id,
        config: {
          ...categoryData.config,
          isMainCategory: true
        },
        hasChildren: categoryData.level1Items.length > 0,
        isLeaf: false,
        displayInAccordion: true,
        accordionConfig: {
          showChildren: true,
          maxLevels: categoryData.config.accordionLevels || 2,
          expandable: true,
          isMainCategory: true,
          defaultExpanded: false
        }
      });

      const savedMain = await mainCategory.save();
      stats.level1++;
      stats.total++;
      stats.byCategory[categoryData.id].level1++;
      stats.byCategory[categoryData.id].total++;
      console.log(`   ✅ ${categoryData.name} (nivel 1)`);

      // 6. Procesar items de nivel 2
      for (const [itemIndex, level2Item] of categoryData.level1Items.entries()) {
        const level2Slug = `${categoryData.id}-${level2Item.id}`;
        const level2Path = `${categoryData.id}/${level2Item.id}`;
        
        const level2Category = new Category({
          name: level2Item.name,
          slug: level2Slug,
          emoji: level2Item.emoji,
          level: 2, // CAMBIADO: De 1 a 2
          order: itemIndex + 1,
          parent: savedMain._id,
          ancestors: [savedMain._id],
          path: level2Path,
          config: {
            ...categoryData.config,
            hasSublevel: level2Item.hasSublevel,
            isIntermediate: true
          },
          hasChildren: level2Item.hasSublevel,
          isLeaf: !level2Item.hasSublevel,
          displayInAccordion: true,
          accordionConfig: {
            showChildren: level2Item.hasSublevel,
            parentId: savedMain._id,
            level: 2,
            expandable: level2Item.hasSublevel,
            defaultExpanded: false
          }
        });

        const savedLevel2 = await level2Category.save();
        stats.level2++;
        stats.total++;
        stats.byCategory[categoryData.id].level2++;
        stats.byCategory[categoryData.id].total++;
        console.log(`   ├── ${level2Item.name} (nivel 2)`);

        // 7. Procesar items de nivel 3 si existen
        if (level2Item.hasSublevel && categoryData.level2Items[level2Item.id]) {
          const level3Items = categoryData.level2Items[level2Item.id];
          
          for (const [subIndex, level3Item] of level3Items.entries()) {
            const level3Slug = `${level2Slug}-${level3Item.id}`;
            const level3Path = `${level2Path}/${level3Item.id}`;
            
            const level3Category = new Category({
              name: level3Item.name,
              slug: level3Slug,
              emoji: level3Item.emoji,
              level: 3, // CAMBIADO: De 2 a 3
              order: subIndex + 1,
              parent: savedLevel2._id,
              ancestors: [savedMain._id, savedLevel2._id],
              path: level3Path,
              config: {
                ...categoryData.config,
                isFinalLevel: true,
                isLeaf: true
              },
              hasChildren: false,
              isLeaf: true,
              displayInAccordion: true,
              accordionConfig: {
                showChildren: false,
                parentId: savedLevel2._id,
                level: 3,
                isLastLevel: true,
                expandable: false,
                selectable: true
              }
            });

            await level3Category.save();
            stats.level3++;
            stats.total++;
            stats.byCategory[categoryData.id].level3++;
            stats.byCategory[categoryData.id].total++;
            console.log(`   │   ├── ${level3Item.name} (nivel 3)`);
          }
        }
      }
    }

    // 8. Mostrar resumen detallado
    console.log('\n🎉 ¡SEED COMPLETADO!');
    console.log('='.repeat(60));
    console.log('📊 ESTADÍSTICAS GENERALES:');
    console.log(`   • Nivel 1 (Categorías principales): ${stats.level1}`);
    console.log(`   • Nivel 2 (Subcategorías): ${stats.level2}`);
    console.log(`   • Nivel 3 (Artículos finales): ${stats.level3}`);
    console.log(`   • TOTAL: ${stats.total} categorías insertadas`);
    
    console.log('\n📋 ESTADÍSTICAS POR CATEGORÍA:');
    for (const [catId, catStats] of Object.entries(stats.byCategory)) {
      const category = ALL_CATEGORIES.find(c => c.id === catId);
      console.log(`   • ${category.emoji} ${category.name}:`);
      console.log(`       Nivel 1: ${catStats.level1}`);
      console.log(`       Nivel 2: ${catStats.level2}`);
      console.log(`       Nivel 3: ${catStats.level3}`);
      console.log(`       Total: ${catStats.total}`);
    }

    // 9. Mostrar estructura jerárquica
    console.log('\n🌳 ESTRUCTURA JERÁRQUICA:');
    const mainCats = await Category.find({ level: 1 }).sort({ order: 1 });
    for (const mainCat of mainCats) {
      const children = await Category.find({ parent: mainCat._id }).sort({ order: 1 });
      console.log(`\n   ${mainCat.emoji} ${mainCat.name} (${mainCat.slug})`);
      
      for (const child of children) {
        const grandchildren = await Category.find({ parent: child._id });
        if (grandchildren.length > 0) {
          console.log(`     ├── ${child.emoji} ${child.name}`);
          grandchildren.forEach(grandchild => {
            console.log(`     │   ├── ${grandchild.emoji} ${grandchild.name}`);
          });
        } else {
          console.log(`     ├── ${child.emoji} ${child.name} (final)`);
        }
      }
    }

    // 10. Verificar que Immobilier tiene estructura correcta
    console.log('\n🔍 VERIFICANDO IMMOBILIER:');
    const immobilier = await Category.findOne({ slug: 'immobilier' });
    if (immobilier) {
      const operations = await Category.find({ parent: immobilier._id }).sort({ order: 1 });
      console.log(`   ${immobilier.emoji} ${immobilier.name} tiene ${operations.length} operaciones:`);
      for (const op of operations) {
        const properties = await Category.find({ parent: op._id });
        console.log(`     • ${op.emoji} ${op.name}: ${properties.length} propiedades`);
      }
    }

    // 11. Cerrar conexión
    console.log('\n🔌 Conexión a MongoDB cerrada');
    await mongoose.connection.close();
    process.exit(0);

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    if (error.errors && error.errors.level) {
      console.error('   ⚠️ Problema con el campo "level". Verifica el esquema:');
      console.error('   📝 Asegúrate de que el modelo Category permita valores 1, 2, 3 para level');
    }
    process.exit(1);
  }
}

// ============ EJECUCIÓN ============

if (require.main === module) {
  seedCompleteCategories();
}

module.exports = { ALL_CATEGORIES, seedCompleteCategories };