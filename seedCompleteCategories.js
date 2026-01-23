require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/categoryModel'); // Ajusta la ruta según tu estructura

// ============================================
// DATOS DE LAS CATEGORÍAS (COMBINADAS)
// ============================================
const categoriesData = [
  // Tus categorías originales de Immobilier
  {
    name: 'Immobilier',
    slug: 'immobilier',
    emoji: '🏠',
    level: 1,
    hasChildren: true,
    isLeaf: false,
    children: [
      {
        name: 'Vente',
        slug: 'vente',
        emoji: '💰',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Appartement', slug: 'appartement-vente', emoji: '🏢', level: 3, isLeaf: true },
          { name: 'Local', slug: 'local-vente', emoji: '🏪', level: 3, isLeaf: true },
          { name: 'Villa', slug: 'villa-vente', emoji: '🏡', level: 3, isLeaf: true },
          { name: 'Terrain', slug: 'terrain-vente', emoji: '⛰️', level: 3, isLeaf: true },
          { name: 'Terrain Agricole', slug: 'terrain_agricole-vente', emoji: '🌾', level: 3, isLeaf: true },
          { name: 'Immeuble', slug: 'immeuble-vente', emoji: '🏢', level: 3, isLeaf: true },
          { name: 'Bungalow', slug: 'bungalow-vente', emoji: '🏝️', level: 3, isLeaf: true },
          { name: 'Hangar - Usine', slug: 'hangar_usine-vente', emoji: '🏭', level: 3, isLeaf: true },
          { name: 'Autre', slug: 'autre-vente', emoji: '🏠', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Location',
        slug: 'location',
        emoji: '🔑',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Appartement', slug: 'appartement-location', emoji: '🏢', level: 3, isLeaf: true },
          { name: 'Local', slug: 'local-location', emoji: '🏪', level: 3, isLeaf: true },
          { name: 'Villa', slug: 'villa-location', emoji: '🏡', level: 3, isLeaf: true },
          { name: 'Immeuble', slug: 'immeuble-location', emoji: '🏢', level: 3, isLeaf: true },
          { name: 'Bungalow', slug: 'bungalow-location', emoji: '🏝️', level: 3, isLeaf: true },
          { name: 'Autre', slug: 'autre-location', emoji: '🏠', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Location vacances',
        slug: 'location_vacances',
        emoji: '🏖️',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Appartement', slug: 'appartement-location_vacances', emoji: '🏢', level: 3, isLeaf: true },
          { name: 'Villa', slug: 'villa-location_vacances', emoji: '🏡', level: 3, isLeaf: true },
          { name: 'Bungalow', slug: 'bungalow-location_vacances', emoji: '🏝️', level: 3, isLeaf: true },
          { name: 'Autre', slug: 'autre-location_vacances', emoji: '🏠', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Cherche location',
        slug: 'cherche_location',
        emoji: '🔍',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Appartement', slug: 'appartement-cherche_location', emoji: '🏢', level: 3, isLeaf: true },
          { name: 'Local', slug: 'local-cherche_location', emoji: '🏪', level: 3, isLeaf: true },
          { name: 'Villa', slug: 'villa-cherche_location', emoji: '🏡', level: 3, isLeaf: true },
          { name: 'Immeuble', slug: 'immeuble-cherche_location', emoji: '🏢', level: 3, isLeaf: true },
          { name: 'Bungalow', slug: 'bungalow-cherche_location', emoji: '🏝️', level: 3, isLeaf: true },
          { name: 'Autre', slug: 'autre-cherche_location', emoji: '🏠', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Cherche achat',
        slug: 'cherche_achat',
        emoji: '🔍',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Appartement', slug: 'appartement-cherche_achat', emoji: '🏢', level: 3, isLeaf: true },
          { name: 'Local', slug: 'local-cherche_achat', emoji: '🏪', level: 3, isLeaf: true },
          { name: 'Villa', slug: 'villa-cherche_achat', emoji: '🏡', level: 3, isLeaf: true },
          { name: 'Terrain', slug: 'terrain-cherche_achat', emoji: '⛰️', level: 3, isLeaf: true },
          { name: 'Terrain Agricole', slug: 'terrain_agricole-cherche_achat', emoji: '🌾', level: 3, isLeaf: true },
          { name: 'Immeuble', slug: 'immeuble-cherche_achat', emoji: '🏢', level: 3, isLeaf: true },
          { name: 'Bungalow', slug: 'bungalow-cherche_achat', emoji: '🏝️', level: 3, isLeaf: true },
          { name: 'Hangar - Usine', slug: 'hangar_usine-cherche_achat', emoji: '🏭', level: 3, isLeaf: true },
          { name: 'Autre', slug: 'autre-cherche_achat', emoji: '🏠', level: 3, isLeaf: true }
        ]
      }
    ]
  },
  
  // Tus categorías originales de Électroménager
  {
    name: 'Électroménager',
    slug: 'electromenager',
    emoji: '🔌',
    level: 1,
    hasChildren: true,
    isLeaf: false,
    children: [
      { name: 'Téléviseurs', slug: 'televiseurs', emoji: '📺', level: 2, hasChildren: false, isLeaf: true },
      { name: 'Démodulateurs & Box TV', slug: 'demodulateurs_box_tv', emoji: '📦', level: 2, hasChildren: false, isLeaf: true },
      { name: 'Paraboles & Switch TV', slug: 'paraboles_switch_tv', emoji: '🛰️', level: 2, hasChildren: false, isLeaf: true },
      { name: 'Abonnements IPTV', slug: 'abonnements_iptv', emoji: '📡', level: 2, hasChildren: false, isLeaf: true },
      { name: 'Caméras & Accessories', slug: 'cameras_accessories', emoji: '📹', level: 2, hasChildren: false, isLeaf: true },
      { name: 'Audio', slug: 'audio', emoji: '🔊', level: 2, hasChildren: false, isLeaf: true },
      { name: 'Aspirateurs & Nettoyeurs', slug: 'aspirateurs_nettoyeurs', emoji: '🧹', level: 2, hasChildren: false, isLeaf: true },
      { name: 'Repassage', slug: 'repassage', emoji: '👔', level: 2, hasChildren: false, isLeaf: true },
      { name: 'Beauté & Hygiène', slug: 'beaute_hygiene', emoji: '💄', level: 2, hasChildren: false, isLeaf: true },
      { name: 'Machines à coudre', slug: 'machines_coudre', emoji: '🧵', level: 2, hasChildren: false, isLeaf: true },
      { name: 'Télécommandes', slug: 'telecommandes', emoji: '🎮', level: 2, hasChildren: false, isLeaf: true },
      { name: 'Sécurité & GPS', slug: 'securite_gps', emoji: '🚨', level: 2, hasChildren: false, isLeaf: true },
      { name: 'Composants électroniques', slug: 'composants_electroniques', emoji: '⚙️', level: 2, hasChildren: false, isLeaf: true },
      { name: 'Pièces de rechange', slug: 'pieces_rechange', emoji: '🔧', level: 2, hasChildren: false, isLeaf: true },
      { name: 'Autre Électroménager', slug: 'autre_electromenager', emoji: '🔌', level: 2, hasChildren: false, isLeaf: true },
      {
        name: 'Réfrigérateurs & Congélateurs',
        slug: 'refrigerateurs_congelateurs',
        emoji: '❄️',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Réfrigérateur', slug: 'refrigerateur', emoji: '🧊', level: 3, isLeaf: true },
          { name: 'Congélateur', slug: 'congelateur', emoji: '❄️', level: 3, isLeaf: true },
          { name: 'Réfrigérateur-Congélateur', slug: 'refrigerateur_congelateur', emoji: '🧊❄️', level: 3, isLeaf: true },
          { name: 'Cave à vin', slug: 'cave_vin', emoji: '🍷', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Machines à laver',
        slug: 'machines_laver',
        emoji: '🧺',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Lave-linge', slug: 'lave_linge', emoji: '👚', level: 3, isLeaf: true },
          { name: 'Sèche-linge', slug: 'seche_linge', emoji: '🌞', level: 3, isLeaf: true },
          { name: 'Lave-linge/Sèche-linge', slug: 'lave_linge_seche_linge', emoji: '👚🌞', level: 3, isLeaf: true },
          { name: 'Lave-linge avec essorage', slug: 'lave_linge_essorage', emoji: '🌀', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Lave-vaisselles',
        slug: 'lave_vaisselles',
        emoji: '🍽️',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Lave-vaisselle encastrable', slug: 'lave_vaisselle_encastrable', emoji: '📦', level: 3, isLeaf: true },
          { name: 'Lave-vaisselle pose libre', slug: 'lave_vaisselle_poselibre', emoji: '🍽️', level: 3, isLeaf: true },
          { name: 'Lave-vaisselle compact', slug: 'lave_vaisselle_compact', emoji: '📦', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Fours & Cuisson',
        slug: 'fours_cuisson',
        emoji: '🔥',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Four électrique', slug: 'four_electrique', emoji: '⚡', level: 3, isLeaf: true },
          { name: 'Four à gaz', slug: 'four_gaz', emoji: '🔥', level: 3, isLeaf: true },
          { name: 'Four micro-ondes', slug: 'four_micro_ondes', emoji: '🌀', level: 3, isLeaf: true },
          { name: 'Plaque de cuisson', slug: 'plaque_cuisson', emoji: '🍳', level: 3, isLeaf: true },
          { name: 'Cuisinière', slug: 'cuisiniere', emoji: '👩‍🍳', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Chauffage & Climatisation',
        slug: 'chauffage_climatisation',
        emoji: '🌡️',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Climatiseur', slug: 'climatiseur', emoji: '❄️', level: 3, isLeaf: true },
          { name: 'Ventilateur', slug: 'ventilateur', emoji: '💨', level: 3, isLeaf: true },
          { name: 'Radiateur', slug: 'radiateur', emoji: '🔥', level: 3, isLeaf: true },
          { name: 'Chauffe-eau', slug: 'chauffe_eau', emoji: '🚿', level: 3, isLeaf: true },
          { name: 'Pompe à chaleur', slug: 'pompe_chaleur', emoji: '🌡️', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Appareils de cuisine',
        slug: 'appareils_cuisine',
        emoji: '🍳',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Robot de cuisine', slug: 'robot_cuisine', emoji: '🍲', level: 3, isLeaf: true },
          { name: 'Mixeur', slug: 'mixeur', emoji: '🥤', level: 3, isLeaf: true },
          { name: 'Bouilloire', slug: 'bouilloire', emoji: '♨️', level: 3, isLeaf: true },
          { name: 'Cafetière', slug: 'cafetiere', emoji: '☕', level: 3, isLeaf: true },
          { name: 'Grille-pain', slug: 'grille_pain', emoji: '🍞', level: 3, isLeaf: true }
        ]
      }
    ]
  },
  
  // Tus categorías originales de Vêtements
  {
    name: 'Vêtements',
    slug: 'vetements',
    emoji: '👕',
    level: 1,
    hasChildren: true,
    isLeaf: false,
    children: [
      {
        name: 'Vêtements Homme',
        slug: 'vetements_homme',
        emoji: '👨',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Hauts & Chemises', slug: 'hauts_chemises_homme', emoji: '👕', level: 3, isLeaf: true },
          { name: 'Jeans & Pantalons', slug: 'jeans_pantalons_homme', emoji: '👖', level: 3, isLeaf: true },
          { name: 'Shorts & Pantacourts', slug: 'shorts_pantacourts_homme', emoji: '🩳', level: 3, isLeaf: true },
          { name: 'Vestes & Gilets', slug: 'vestes_gilets_homme', emoji: '🧥', level: 3, isLeaf: true },
          { name: 'Costumes & Blazers', slug: 'costumes_blazers_homme', emoji: '🤵', level: 3, isLeaf: true },
          { name: 'Survetements', slug: 'survetements_homme', emoji: '🏃‍♂️', level: 3, isLeaf: true },
          { name: 'Kamiss', slug: 'kamiss_homme', emoji: '🕌', level: 3, isLeaf: true },
          { name: 'Sous vêtements', slug: 'sous_vetements_homme', emoji: '🩲', level: 3, isLeaf: true },
          { name: 'Pyjamas', slug: 'pyjamas_homme', emoji: '😴', level: 3, isLeaf: true },
          { name: 'Maillots de bain', slug: 'maillots_bain_homme', emoji: '🏊‍♂️', level: 3, isLeaf: true },
          { name: 'Casquettes & Chapeaux', slug: 'casquettes_chapeaux_homme', emoji: '🧢', level: 3, isLeaf: true },
          { name: 'Chaussettes', slug: 'chaussettes_homme', emoji: '🧦', level: 3, isLeaf: true },
          { name: 'Ceintures', slug: 'ceintures_homme', emoji: '⛓️', level: 3, isLeaf: true },
          { name: 'Gants', slug: 'gants_homme', emoji: '🧤', level: 3, isLeaf: true },
          { name: 'Cravates', slug: 'cravates_homme', emoji: '👔', level: 3, isLeaf: true },
          { name: 'Autre', slug: 'autre_vetements_homme', emoji: '👚', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Vêtements Femme',
        slug: 'vetements_femme',
        emoji: '👩',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Hauts & Chemises', slug: 'hauts_chemises_femme', emoji: '👚', level: 3, isLeaf: true },
          { name: 'Jeans & Pantalons', slug: 'jeans_pantalons_femme', emoji: '👖', level: 3, isLeaf: true },
          { name: 'Shorts & Pantacourts', slug: 'shorts_pantacourts_femme', emoji: '🩳', level: 3, isLeaf: true },
          { name: 'Vestes & Gilets', slug: 'vestes_gilets_femme', emoji: '🧥', level: 3, isLeaf: true },
          { name: 'Ensembles', slug: 'ensembles_femme', emoji: '👗', level: 3, isLeaf: true },
          { name: 'Abayas & Hijabs', slug: 'abayas_hijabs_femme', emoji: '🧕', level: 3, isLeaf: true },
          { name: 'Mariages & Fêtes', slug: 'mariages_fetes_femme', emoji: '💃', level: 3, isLeaf: true },
          { name: 'Maternité', slug: 'maternite_femme', emoji: '🤰', level: 3, isLeaf: true },
          { name: 'Robes', slug: 'robes_femme', emoji: '👗', level: 3, isLeaf: true },
          { name: 'Jupes', slug: 'jupes_femme', emoji: '🩳', level: 3, isLeaf: true },
          { name: 'Joggings & Survetements', slug: 'joggings_survetements_femme', emoji: '🏃‍♀️', level: 3, isLeaf: true },
          { name: 'Leggings', slug: 'leggings_femme', emoji: '🦵', level: 3, isLeaf: true },
          { name: 'Sous-vêtements & Lingerie', slug: 'sous_vetements_lingerie_femme', emoji: '👙', level: 3, isLeaf: true },
          { name: 'Pyjamas', slug: 'pyjamas_femme', emoji: '😴', level: 3, isLeaf: true },
          { name: 'Peignoirs', slug: 'peignoirs_femme', emoji: '🛀', level: 3, isLeaf: true },
          { name: 'Maillots de bain', slug: 'maillots_bain_femme', emoji: '🏊‍♀️', level: 3, isLeaf: true },
          { name: 'Casquettes & Chapeaux', slug: 'casquettes_chapeaux_femme', emoji: '🧢', level: 3, isLeaf: true },
          { name: 'Chaussettes & Collants', slug: 'chaussettes_collants_femme', emoji: '🧦', level: 3, isLeaf: true },
          { name: 'Foulards & Echarpes', slug: 'foulards_echarpes_femme', emoji: '🧣', level: 3, isLeaf: true },
          { name: 'Ceintures', slug: 'ceintures_femme', emoji: '⛓️', level: 3, isLeaf: true },
          { name: 'Gants', slug: 'gants_femme', emoji: '🧤', level: 3, isLeaf: true },
          { name: 'Autre', slug: 'autre_vetements_femme', emoji: '👚', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Chaussures Homme',
        slug: 'chaussures_homme',
        emoji: '👞',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Basquettes', slug: 'basquettes_homme', emoji: '👟', level: 3, isLeaf: true },
          { name: 'Bottes', slug: 'bottes_homme', emoji: '🥾', level: 3, isLeaf: true },
          { name: 'Classiques', slug: 'classiques_homme', emoji: '👞', level: 3, isLeaf: true },
          { name: 'Mocassins', slug: 'mocassins_homme', emoji: '👞', level: 3, isLeaf: true },
          { name: 'Sandales', slug: 'sandales_homme', emoji: '🩴', level: 3, isLeaf: true },
          { name: 'Tangues & Pantoufles', slug: 'tangues_pantoufles_homme', emoji: '🩴', level: 3, isLeaf: true },
          { name: 'Autre', slug: 'autre_chaussures_homme', emoji: '👞', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Chaussures Femme',
        slug: 'chaussures_femme',
        emoji: '👠',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Basquettes', slug: 'basquettes_femme', emoji: '👟', level: 3, isLeaf: true },
          { name: 'Sandales', slug: 'sandales_femme', emoji: '🩴', level: 3, isLeaf: true },
          { name: 'Bottes', slug: 'bottes_femme', emoji: '🥾', level: 3, isLeaf: true },
          { name: 'Escarpins', slug: 'escarpins_femme', emoji: '👠', level: 3, isLeaf: true },
          { name: 'Ballerines', slug: 'ballerines_femme', emoji: '🩰', level: 3, isLeaf: true },
          { name: 'Tangues & Pantoufles', slug: 'tangues_pantoufles_femme', emoji: '🩴', level: 3, isLeaf: true },
          { name: 'Autre', slug: 'autre_chaussures_femme', emoji: '👠', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Garçons',
        slug: 'garcons',
        emoji: '👦',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Chaussures', slug: 'chaussures_garcons', emoji: '👟', level: 3, isLeaf: true },
          { name: 'Hauts & Chemises', slug: 'hauts_chemises_garcons', emoji: '👕', level: 3, isLeaf: true },
          { name: 'Pantalons & Shorts', slug: 'pantalons_shorts_garcons', emoji: '👖', level: 3, isLeaf: true },
          { name: 'Vestes & Gilets', slug: 'vestes_gilets_garcons', emoji: '🧥', level: 3, isLeaf: true },
          { name: 'Costumes', slug: 'costumes_garcons', emoji: '🤵', level: 3, isLeaf: true },
          { name: 'Survetements & Joggings', slug: 'survetements_joggings_garcons', emoji: '🏃‍♂️', level: 3, isLeaf: true },
          { name: 'Pyjamas', slug: 'pyjamas_garcons', emoji: '😴', level: 3, isLeaf: true },
          { name: 'Sous-vêtements', slug: 'sous_vetements_garcons', emoji: '🩲', level: 3, isLeaf: true },
          { name: 'Maillots de bain', slug: 'maillots_bain_garcons', emoji: '🏊‍♂️', level: 3, isLeaf: true },
          { name: 'Kamiss', slug: 'kamiss_garcons', emoji: '🕌', level: 3, isLeaf: true },
          { name: 'Casquettes & Chapeaux', slug: 'casquettes_chapeaux_garcons', emoji: '🧢', level: 3, isLeaf: true },
          { name: 'Autre', slug: 'autre_garcons', emoji: '👦', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Filles',
        slug: 'filles',
        emoji: '👧',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Chaussures', slug: 'chaussures_filles', emoji: '👟', level: 3, isLeaf: true },
          { name: 'Hauts & Chemises', slug: 'hauts_chemises_filles', emoji: '👚', level: 3, isLeaf: true },
          { name: 'Pantalons & Shorts', slug: 'pantalons_shorts_filles', emoji: '👖', level: 3, isLeaf: true },
          { name: 'Vestes & Gilets', slug: 'vestes_gilets_filles', emoji: '🧥', level: 3, isLeaf: true },
          { name: 'Robes', slug: 'robes_filles', emoji: '👗', level: 3, isLeaf: true },
          { name: 'Jupes', slug: 'jupes_filles', emoji: '🩳', level: 3, isLeaf: true },
          { name: 'Ensembles', slug: 'ensembles_filles', emoji: '👗', level: 3, isLeaf: true },
          { name: 'Joggings & Survetements', slug: 'joggings_survetements_filles', emoji: '🏃‍♀️', level: 3, isLeaf: true },
          { name: 'Pyjamas', slug: 'pyjamas_filles', emoji: '😴', level: 3, isLeaf: true },
          { name: 'Sous-vêtements', slug: 'sous_vetements_filles', emoji: '👙', level: 3, isLeaf: true },
          { name: 'Leggings & Collants', slug: 'leggings_collants_filles', emoji: '🦵', level: 3, isLeaf: true },
          { name: 'Maillots de bain', slug: 'maillots_bain_filles', emoji: '🏊‍♀️', level: 3, isLeaf: true },
          { name: 'Casquettes & Chapeaux', slug: 'casquettes_chapeaux_filles', emoji: '🧢', level: 3, isLeaf: true },
          { name: 'Autre', slug: 'autre_filles', emoji: '👧', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Bébé',
        slug: 'bebe',
        emoji: '👶',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Vêtements', slug: 'vetements_bebe', emoji: '👕', level: 3, isLeaf: true },
          { name: 'Chaussures', slug: 'chaussures_bebe', emoji: '👟', level: 3, isLeaf: true },
          { name: 'Accessoires', slug: 'accessoires_bebe', emoji: '🧸', level: 3, isLeaf: true }
        ]
      },
      { name: 'Tenues professionnelles', slug: 'tenues_professionnelles', emoji: '👔', level: 2, hasChildren: false, isLeaf: true },
      {
        name: 'Sacs & Valises',
        slug: 'sacs_valises',
        emoji: '👜',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Pochettes & Portefeuilles', slug: 'pochettes_portefeuilles', emoji: '💼', level: 3, isLeaf: true },
          { name: 'Sacs à main', slug: 'sacs_main', emoji: '👜', level: 3, isLeaf: true },
          { name: 'Sacs à dos', slug: 'sacs_dos', emoji: '🎒', level: 3, isLeaf: true },
          { name: 'Sacs professionnels', slug: 'sacs_professionnels', emoji: '💼', level: 3, isLeaf: true },
          { name: 'Valises', slug: 'valises', emoji: '🧳', level: 3, isLeaf: true },
          { name: 'Cabas de sport', slug: 'cabas_sport', emoji: '🏸', level: 3, isLeaf: true },
          { name: 'Autre', slug: 'autre_sacs', emoji: '👜', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Montres',
        slug: 'montres',
        emoji: '⌚',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Hommes', slug: 'montres_hommes', emoji: '⌚', level: 3, isLeaf: true },
          { name: 'Femmes', slug: 'montres_femmes', emoji: '⌚', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Lunettes',
        slug: 'lunettes',
        emoji: '👓',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Lunettes de vue hommes', slug: 'lunettes_vue_hommes', emoji: '👓', level: 3, isLeaf: true },
          { name: 'Lunettes de vue femmes', slug: 'lunettes_vue_femmes', emoji: '👓', level: 3, isLeaf: true },
          { name: 'Lunettes de soleil hommes', slug: 'lunettes_soleil_hommes', emoji: '🕶️', level: 3, isLeaf: true },
          { name: 'Lunettes de soleil femmes', slug: 'lunettes_soleil_femmes', emoji: '🕶️', level: 3, isLeaf: true },
          { name: 'Lunettes de vue enfants', slug: 'lunettes_vue_enfants', emoji: '👓', level: 3, isLeaf: true },
          { name: 'Lunettes de soleil enfants', slug: 'lunettes_soleil_enfants', emoji: '🕶️', level: 3, isLeaf: true },
          { name: 'Accessoires', slug: 'accessoires_lunettes', emoji: '🧰', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Bijoux',
        slug: 'bijoux',
        emoji: '💍',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Parures', slug: 'parures', emoji: '👑', level: 3, isLeaf: true },
          { name: 'Colliers & Pendentifs', slug: 'colliers_pendentifs', emoji: '📿', level: 3, isLeaf: true },
          { name: 'Bracelets', slug: 'bracelets', emoji: '📿', level: 3, isLeaf: true },
          { name: 'Bagues', slug: 'bagues', emoji: '💍', level: 3, isLeaf: true },
          { name: 'Boucles', slug: 'boucles', emoji: '👂', level: 3, isLeaf: true },
          { name: 'Chevillières', slug: 'chevilleres', emoji: '🦵', level: 3, isLeaf: true },
          { name: 'Piercings', slug: 'piercings', emoji: '👃', level: 3, isLeaf: true },
          { name: 'Accessoires cheveux', slug: 'accessoires_cheveux', emoji: '💇‍♀️', level: 3, isLeaf: true },
          { name: 'Broches', slug: 'broches', emoji: '🧷', level: 3, isLeaf: true },
          { name: 'Autre', slug: 'autre_bijoux', emoji: '💎', level: 3, isLeaf: true }
        ]
      }
    ]
  },
  
  // ============================================
  // NUEVAS CATEGORÍAS
  // ============================================
  
  // CATEGORÍA VÉHICULES
  {
    name: 'Véhicules',
    slug: 'vehicules',
    emoji: '🚗',
    level: 1,
    hasChildren: true,
    isLeaf: false,
    children: [
      { name: 'Voitures', slug: 'voitures', emoji: '🚗', level: 2, isLeaf: true },
      { name: 'Utilitaire', slug: 'utilitaire', emoji: '🚐', level: 2, isLeaf: true },
      { name: 'Motos & Scooters', slug: 'motos_scooters', emoji: '🏍️', level: 2, isLeaf: true },
      { name: 'Quads', slug: 'quads', emoji: '🚜', level: 2, isLeaf: true },
      { name: 'Fourgon', slug: 'fourgon', emoji: '🚚', level: 2, isLeaf: true },
      { name: 'Camion', slug: 'camion', emoji: '🚛', level: 2, isLeaf: true },
      { name: 'Bus', slug: 'bus', emoji: '🚌', level: 2, isLeaf: true },
      { name: 'Engin', slug: 'engin', emoji: '🚜', level: 2, isLeaf: true },
      { name: 'Tracteurs', slug: 'tracteurs', emoji: '🚜', level: 2, isLeaf: true },
      { name: 'Remorques', slug: 'remorques', emoji: '🚛', level: 2, isLeaf: true },
      { name: 'Bateaux & Barques', slug: 'bateaux_barques', emoji: '🛥️', level: 2, isLeaf: true }
    ]
  },
  
  // CATEGORÍA TÉLÉPHONES
  {
    name: 'Téléphones & Communications',
    slug: 'telephones',
    emoji: '📱',
    level: 1,
    hasChildren: true,
    isLeaf: false,
    children: [
      // CATEGORÍAS NIVEL 2 SIN SUB-NIVEL
      { name: 'Smartphones', slug: 'smartphones', emoji: '📱', level: 2, isLeaf: true },
      { name: 'Téléphones cellulaires', slug: 'telephones_cellulaires', emoji: '📞', level: 2, isLeaf: true },
      { name: 'Tablettes', slug: 'tablettes', emoji: '💻', level: 2, isLeaf: true },
      { name: 'Fixes & Fax', slug: 'fixes_fax', emoji: '☎️', level: 2, isLeaf: true },
      { name: 'Smartwatchs', slug: 'smartwatchs', emoji: '⌚', level: 2, isLeaf: true },
      { name: 'Accessoires', slug: 'accessoires', emoji: '🎧', level: 2, isLeaf: true },
      { name: 'Pièces de rechange', slug: 'pieces_rechange', emoji: '🔧', level: 2, isLeaf: true },
      { name: 'Offres & Abonnements', slug: 'offres_abonnements', emoji: '📶', level: 2, isLeaf: true },
      
      // CATEGORÍAS NIVEL 2 CON SUB-NIVEL
      {
        name: 'Protection & Antichoc',
        slug: 'protection_antichoc',
        emoji: '🛡️',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Protections d\'écran', slug: 'protections_ecran', emoji: '🖥️', level: 3, isLeaf: true },
          { name: 'Coques & Antichoc', slug: 'coques_antichoc', emoji: '📱', level: 3, isLeaf: true },
          { name: 'Films de protection', slug: 'films_protection', emoji: '📋', level: 3, isLeaf: true },
          { name: 'Étuis', slug: 'etuis', emoji: '🎁', level: 3, isLeaf: true },
          { name: 'Protections de caméra', slug: 'protections_camera', emoji: '📸', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Ecouteurs & Son',
        slug: 'ecouteurs_son',
        emoji: '🎵',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Écouteurs filaires', slug: 'ecouteurs_filaires', emoji: '🎧', level: 3, isLeaf: true },
          { name: 'Écouteurs Bluetooth', slug: 'ecouteurs_bluetooth', emoji: '🔵', level: 3, isLeaf: true },
          { name: 'Casques audio', slug: 'casques_audio', emoji: '🎧', level: 3, isLeaf: true },
          { name: 'Hauts-parleurs portables', slug: 'hauts_parleurs_portables', emoji: '🔊', level: 3, isLeaf: true },
          { name: 'Adaptateurs audio', slug: 'adaptateurs_audio', emoji: '🎛️', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Chargeurs & Câbles',
        slug: 'chargeurs_cables',
        emoji: '🔌',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Chargeurs mural', slug: 'chargeurs_mur', emoji: '🔌', level: 3, isLeaf: true },
          { name: 'Chargeurs voiture', slug: 'chargeurs_voiture', emoji: '🚗', level: 3, isLeaf: true },
          { name: 'Chargeurs sans fil', slug: 'chargeurs_sans_fil', emoji: '⚡', level: 3, isLeaf: true },
          { name: 'Câbles USB', slug: 'cables_usb', emoji: '🔌', level: 3, isLeaf: true },
          { name: 'Câbles Lightning', slug: 'cables_lightning', emoji: '⚡', level: 3, isLeaf: true },
          { name: 'Câbles Type-C', slug: 'cables_type_c', emoji: '🔌', level: 3, isLeaf: true },
          { name: 'Hubs chargeurs', slug: 'hubs_chargeurs', emoji: '🔗', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Supports & Stabilisateurs',
        slug: 'supports_stabilisateurs',
        emoji: '📐',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Supports', slug: 'supports', emoji: '📱', level: 3, isLeaf: true },
          { name: 'Stabilisateurs', slug: 'stabilisateurs', emoji: '🤳', level: 3, isLeaf: true },
          { name: 'Barres de selfies', slug: 'barres_selfies', emoji: '📸', level: 3, isLeaf: true },
          { name: 'Pieds pour téléphone', slug: 'pieds_telephone', emoji: '📐', level: 3, isLeaf: true },
          { name: 'Ventouses voiture', slug: 'ventouses_voiture', emoji: '🚗', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Manettes',
        slug: 'manettes',
        emoji: '🎮',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Manettes Bluetooth', slug: 'manettes_bluetooth', emoji: '🎮', level: 3, isLeaf: true },
          { name: 'Manettes filaires', slug: 'manettes_filaires', emoji: '🎮', level: 3, isLeaf: true },
          { name: 'Manettes pour téléphone', slug: 'manettes_telephone', emoji: '📱', level: 3, isLeaf: true },
          { name: 'Manettes pour tablette', slug: 'manettes_tablette', emoji: '💻', level: 3, isLeaf: true },
          { name: 'Accessoires pour manettes', slug: 'accessoires_manettes', emoji: '🔧', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'VR',
        slug: 'vr',
        emoji: '👓',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Casques VR', slug: 'casques_vr', emoji: '👓', level: 3, isLeaf: true },
          { name: 'Lunettes VR', slug: 'lunettes_vr', emoji: '🕶️', level: 3, isLeaf: true },
          { name: 'Accessoires VR', slug: 'accessoires_vr', emoji: '🔧', level: 3, isLeaf: true },
          { name: 'Contrôleurs VR', slug: 'controleurs_vr', emoji: '🎮', level: 3, isLeaf: true },
          { name: 'Jeux VR', slug: 'jeux_vr', emoji: '🎮', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Power banks',
        slug: 'power_banks',
        emoji: '🔋',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Power bank 10,000mAh', slug: 'power_bank_10000mah', emoji: '🔋', level: 3, isLeaf: true },
          { name: 'Power bank 20,000mAh', slug: 'power_bank_20000mah', emoji: '🔋', level: 3, isLeaf: true },
          { name: 'Power bank solaire', slug: 'power_bank_solaire', emoji: '☀️', level: 3, isLeaf: true },
          { name: 'Power bank charge rapide', slug: 'power_bank_rapide', emoji: '⚡', level: 3, isLeaf: true },
          { name: 'Power bank compact', slug: 'power_bank_compact', emoji: '📱', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Stylets',
        slug: 'stylets',
        emoji: '✏️',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Stylets actifs', slug: 'stylets_actifs', emoji: '✏️', level: 3, isLeaf: true },
          { name: 'Stylets passifs', slug: 'stylets_passifs', emoji: '✏️', level: 3, isLeaf: true },
          { name: 'Stylets Bluetooth', slug: 'stylets_bluetooth', emoji: '🔵', level: 3, isLeaf: true },
          { name: 'Stylets pour tablette', slug: 'stylets_tablette', emoji: '💻', level: 3, isLeaf: true },
          { name: 'Recharges pour stylet', slug: 'recharges_stylet', emoji: '🔋', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Cartes Mémoire',
        slug: 'cartes_memoire',
        emoji: '💾',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Cartes SD', slug: 'sd_cards', emoji: '💾', level: 3, isLeaf: true },
          { name: 'Cartes Micro SD', slug: 'micro_sd_cards', emoji: '💾', level: 3, isLeaf: true },
          { name: 'Cartes SDHC', slug: 'sdhc_cards', emoji: '💾', level: 3, isLeaf: true },
          { name: 'Cartes SDXC', slug: 'sdxc_cards', emoji: '💾', level: 3, isLeaf: true },
          { name: 'Adaptateurs de carte', slug: 'adaptateurs_carte', emoji: '🔌', level: 3, isLeaf: true },
          { name: 'Lecteurs de carte', slug: 'lecteurs_carte', emoji: '📖', level: 3, isLeaf: true }
        ]
      }
    ]
  },
  
  // CATEGORÍA INFORMATIQUE
  {
    name: 'Informatique',
    slug: 'informatique',
    emoji: '💻',
    level: 1,
    hasChildren: true,
    isLeaf: false,
    children: [
      // CATEGORÍAS NIVEL 2 SIN SUB-NIVEL
      { name: 'Serveurs', slug: 'serveurs', emoji: '🖧', level: 2, isLeaf: true },
      { name: 'Ecrans', slug: 'ecrans', emoji: '🖥️', level: 2, isLeaf: true },
      { name: 'Onduleurs & Stabilisateurs', slug: 'onduleurs_stabilisateurs', emoji: '⚡', level: 2, isLeaf: true },
      { name: 'Compteuses de billets', slug: 'compteuses_billets', emoji: '💰', level: 2, isLeaf: true },
      { name: 'Claviers & Souris', slug: 'claviers_souris', emoji: '⌨️', level: 2, isLeaf: true },
      { name: 'Casques & Son', slug: 'casques_son', emoji: '🎧', level: 2, isLeaf: true },
      { name: 'Webcam & Vidéoconférence', slug: 'webcam_videoconference', emoji: '📹', level: 2, isLeaf: true },
      { name: 'Data shows', slug: 'data_shows', emoji: '📊', level: 2, isLeaf: true },
      { name: 'Câbles & Adaptateurs', slug: 'cables_adaptateurs', emoji: '🔌', level: 2, isLeaf: true },
      { name: 'Stylets & Tablettes', slug: 'stylers_tablettes', emoji: '✏️', level: 2, isLeaf: true },
      { name: 'Cartables & Sacoches', slug: 'cartables_sacoches', emoji: '🎒', level: 2, isLeaf: true },
      { name: 'Manettes & Simulateurs', slug: 'manettes_simulateurs', emoji: '🎮', level: 2, isLeaf: true },
      { name: 'VR', slug: 'vr', emoji: '🥽', level: 2, isLeaf: true },
      { name: 'Logiciels & Abonnements', slug: 'logiciels_abonnements', emoji: '📀', level: 2, isLeaf: true },
      { name: 'Bureautique', slug: 'bureautique', emoji: '📎', level: 2, isLeaf: true },
      { name: 'Autre Informatique', slug: 'autre_informatique', emoji: '💡', level: 2, isLeaf: true },
      
      // CATEGORÍAS NIVEL 2 CON SUB-NIVEL
      {
        name: 'Ordinateurs portables',
        slug: 'ordinateurs_portables',
        emoji: '💻',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Pc Portable', slug: 'pc_portable', emoji: '💻', level: 3, isLeaf: true },
          { name: 'Macbooks', slug: 'macbooks', emoji: '🍎', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Ordinateurs de bureau',
        slug: 'ordinateurs_bureau',
        emoji: '🖥️',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Pc de bureau', slug: 'pc_bureau', emoji: '🖥️', level: 3, isLeaf: true },
          { name: 'Unités centrales', slug: 'unites_centrales', emoji: '🖥️', level: 3, isLeaf: true },
          { name: 'All In One', slug: 'all_in_one', emoji: '🖥️', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Composants PC fixe',
        slug: 'composants_pc_fixe',
        emoji: '⚙️',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Cartes mère', slug: 'cartes_mere', emoji: '🔌', level: 3, isLeaf: true },
          { name: 'Processeurs', slug: 'processeurs', emoji: '⚡', level: 3, isLeaf: true },
          { name: 'RAM', slug: 'ram', emoji: '💾', level: 3, isLeaf: true },
          { name: 'Disques dur', slug: 'disques_dur', emoji: '💿', level: 3, isLeaf: true },
          { name: 'Cartes graphique', slug: 'cartes_graphique', emoji: '🎮', level: 3, isLeaf: true },
          { name: 'Alimentations & Boitiers', slug: 'alimentations_boitiers', emoji: '🔋', level: 3, isLeaf: true },
          { name: 'Refroidissement', slug: 'refroidissement', emoji: '❄️', level: 3, isLeaf: true },
          { name: 'Lecteurs & Graveurs CD', slug: 'lecteurs_graveurs_cd', emoji: '📀', level: 3, isLeaf: true },
          { name: 'Autres', slug: 'autres_composants_fixe', emoji: '🔧', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Composants PC portable',
        slug: 'composants_pc_portable',
        emoji: '🔧',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Chargeurs', slug: 'chargeurs', emoji: '🔌', level: 3, isLeaf: true },
          { name: 'Batteries', slug: 'batteries', emoji: '🔋', level: 3, isLeaf: true },
          { name: 'Ecrans', slug: 'ecrans_portable', emoji: '🖥️', level: 3, isLeaf: true },
          { name: 'Claviers & Touchpads', slug: 'claviers_touchpads', emoji: '⌨️', level: 3, isLeaf: true },
          { name: 'Disques Dur', slug: 'disques_dur_portable', emoji: '💿', level: 3, isLeaf: true },
          { name: 'RAM', slug: 'ram_portable', emoji: '💾', level: 3, isLeaf: true },
          { name: 'Refroidissement', slug: 'refroidissement_portable', emoji: '❄️', level: 3, isLeaf: true },
          { name: 'Cartes mère', slug: 'cartes_mere_portable', emoji: '🔌', level: 3, isLeaf: true },
          { name: 'Processeurs', slug: 'processeurs_portable', emoji: '⚡', level: 3, isLeaf: true },
          { name: 'Cartes graphique', slug: 'cartes_graphique_portable', emoji: '🎮', level: 3, isLeaf: true },
          { name: 'Lecteurs & Graveurs', slug: 'lecteurs_graveurs_portable', emoji: '📀', level: 3, isLeaf: true },
          { name: 'Baffles & Webcams', slug: 'baffles_webcams', emoji: '🎤', level: 3, isLeaf: true },
          { name: 'Autres', slug: 'autres_composants_portable', emoji: '🔧', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Composants serveur',
        slug: 'composants_serveur',
        emoji: '🖧',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Cartes mère', slug: 'cartes_mere_serveur', emoji: '🔌', level: 3, isLeaf: true },
          { name: 'Processeurs', slug: 'processeurs_serveur', emoji: '⚡', level: 3, isLeaf: true },
          { name: 'RAM', slug: 'ram_serveur', emoji: '💾', level: 3, isLeaf: true },
          { name: 'Disques dur', slug: 'disques_dur_serveur', emoji: '💿', level: 3, isLeaf: true },
          { name: 'Cartes réseau', slug: 'cartes_reseau', emoji: '📶', level: 3, isLeaf: true },
          { name: 'Alimentations', slug: 'alimentations_serveur', emoji: '🔋', level: 3, isLeaf: true },
          { name: 'Refroidissement', slug: 'refroidissement_serveur', emoji: '❄️', level: 3, isLeaf: true },
          { name: 'Cartes graphique', slug: 'cartes_graphique_serveur', emoji: '🎮', level: 3, isLeaf: true },
          { name: 'Autres', slug: 'autres_composants_serveur', emoji: '🔧', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Imprimantes & Cartouches',
        slug: 'imprimantes_cartouches',
        emoji: '🖨️',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Imprimantes jet d\'encre', slug: 'imprimantes_jet_encre', emoji: '🖨️', level: 3, isLeaf: true },
          { name: 'Imprimantes Laser', slug: 'imprimantes_laser', emoji: '🖨️', level: 3, isLeaf: true },
          { name: 'Imprimantes matricielles', slug: 'imprimantes_matricielles', emoji: '🖨️', level: 3, isLeaf: true },
          { name: 'Codes à barre & Etiqueteuses', slug: 'codes_barre_etiqueteuses', emoji: '🏷️', level: 3, isLeaf: true },
          { name: 'Imprimantes photo & badges', slug: 'imprimantes_photo_badges', emoji: '🖼️', level: 3, isLeaf: true },
          { name: 'Photocopieuses professionnelles', slug: 'photocopieuses_professionnelles', emoji: '📠', level: 3, isLeaf: true },
          { name: 'Imprimantes 3D', slug: 'imprimantes_3d', emoji: '🖨️', level: 3, isLeaf: true },
          { name: 'Cartouches & Toners', slug: 'cartouches_toners', emoji: '🎨', level: 3, isLeaf: true },
          { name: 'Autre', slug: 'autre_imprimantes', emoji: '🖨️', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Réseau & Connexion',
        slug: 'reseau_connexion',
        emoji: '📶',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Modems & Routeurs', slug: 'modems_routeurs', emoji: '📡', level: 3, isLeaf: true },
          { name: 'Switchs', slug: 'switchs', emoji: '🔀', level: 3, isLeaf: true },
          { name: 'Point d\'accès wifi', slug: 'point_acces_wifi', emoji: '📶', level: 3, isLeaf: true },
          { name: 'Répéteur Wi-Fi', slug: 'repeater_wifi', emoji: '📶', level: 3, isLeaf: true },
          { name: 'Cartes réseau', slug: 'cartes_reseau_connexion', emoji: '📡', level: 3, isLeaf: true },
          { name: 'Autre', slug: 'autre_reseau', emoji: '📶', level: 3, isLeaf: true }
        ]
      },
      {
        name: 'Stockage externe & Racks',
        slug: 'stockage_externe',
        emoji: '💾',
        level: 2,
        hasChildren: true,
        isLeaf: false,
        children: [
          { name: 'Disques durs', slug: 'disques_durs_externes', emoji: '💿', level: 3, isLeaf: true },
          { name: 'Flash disque', slug: 'flash_disque', emoji: '💾', level: 3, isLeaf: true },
          { name: 'Carte mémoire', slug: 'carte_memoire', emoji: '📋', level: 3, isLeaf: true },
          { name: 'Rack', slug: 'rack', emoji: '🗄️', level: 3, isLeaf: true }
        ]
      }
    ]
  }
];

// Función principal
async function seedDatabase() {
  try {
    // Conectar a MongoDB
    console.log('🔗 Conectando a MongoDB...');
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace';
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conectado a MongoDB');

    // Limpiar colección existente
    console.log('🧹 Limpiando colección existente...');
    await Category.deleteMany({});
    console.log('✅ Colección limpiada');

    let totalCategories = 0;
    let orderCounter = 0;

    // Función recursiva para crear categorías
    async function createCategory(catData, parentId = null, ancestors = []) {
      const path = parentId ? 
        `${ancestors.map(a => a.slug).join('/')}/${catData.slug}` : 
        catData.slug;
      
      const category = new Category({
        name: catData.name,
        slug: catData.slug,
        emoji: catData.emoji,
        level: catData.level,
        parent: parentId,
        ancestors: ancestors.map(a => a._id),
        path: path,
        order: orderCounter++,
        hasChildren: catData.hasChildren || (catData.children && catData.children.length > 0),
        isLeaf: catData.isLeaf || false,
        isActive: true,
        postCount: 0
      });

      const savedCategory = await category.save();
      totalCategories++;

      // Espacios para indentación según el nivel
      const indent = '  '.repeat(catData.level - 1);
      console.log(`${indent}✅ ${catData.emoji} ${catData.name}`);

      // Si tiene hijos, crearlos recursivamente
      if (catData.children && catData.children.length > 0) {
        const newAncestors = [...ancestors, savedCategory];
        for (const child of catData.children) {
          await createCategory(child, savedCategory._id, newAncestors);
        }
      }

      return savedCategory;
    }

    // Crear todas las categorías
    console.log('\n🌱 Sembrando categorías...\n');
    
    for (const categoryData of categoriesData) {
      await createCategory(categoryData);
    }

    console.log('\n🎉 ¡Base de datos poblada exitosamente!');
    console.log(`📊 Total de categorías creadas: ${totalCategories}`);

    // Desconectar
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack trace:', error.stack);
    if (error.code === 'ENOTFOUND') {
      console.error('⚠️  No se puede conectar a MongoDB. Verifica:');
      console.error('   1. Que MongoDB esté instalado y corriendo');
      console.error('   2. Que la URL de conexión sea correcta');
      console.error('   3. Ejecuta: mongod (en otra terminal)');
    }
    process.exit(1);
  }
}

// Si el archivo se ejecuta directamente
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, categoriesData };