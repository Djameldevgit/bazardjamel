// seedCategories.js - VERSIÓN CORREGIDA Y COMPLETA
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/categoryModel'); // Ajusta la ruta según tu estructura

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'Error de conexión:'));
db.once('open', async () => {
  console.log('✅ Conectado a MongoDB');
  await seedCategories();
});

// Función para crear slug ÚNICO
const createUniqueSlug = (text, existingSlugs = new Set()) => {
  let baseSlug = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  let slug = baseSlug;
  let counter = 1;
  
  // Si el slug ya existe, agregar número
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  existingSlugs.add(slug);
  return slug;
};

// Datos de categorías PRINCIPALES (nivel 1)
const categoriesData = [
  {
    name: 'Électroménager',
    slug: 'electromenager',
    level: 1,
    emoji: '🔌',
    order: 1,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Téléphones & Accessoires',
    slug: 'telephones-accessoires',
    level: 1,
    emoji: '📱',
    order: 2,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Immobilier',
    slug: 'immobilier',
    level: 1,
    emoji: '🏠',
    order: 3,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Informatique',
    slug: 'informatique',
    level: 1,
    emoji: '💻',
    order: 4,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Véhicules',
    slug: 'vehicules',
    level: 1,
    emoji: '🚗',
    order: 5,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Mode & Accessoires',
    slug: 'mode-accessoires',
    level: 1,
    emoji: '👕',
    order: 6,
    isLeaf: false,
    hasChildren: true,
  }
];

// Subcategorías de Électroménager (nivel 2)
const electromenagerSubcategories = [
  { name: 'Téléviseurs', emoji: '📺', order: 1 },
  { name: 'Démodulateurs & Box TV', emoji: '📦', order: 2 },
  { name: 'Paraboles & Switch TV', emoji: '🛰️', order: 3 },
  { name: 'Abonnements IPTV', emoji: '📡', order: 4 },
  { name: 'Caméras & Accessories', emoji: '📹', order: 5 },
  { name: 'Audio', emoji: '🔊', order: 6 },
  { name: 'Aspirateurs & Nettoyeurs', emoji: '🧹', order: 7 },
  { name: 'Repassage', emoji: '👔', order: 8 },
  { name: 'Beauté & Hygiène', emoji: '💄', order: 9 },
  { name: 'Machines à coudre', emoji: '🧵', order: 10 },
  { name: 'Télécommandes', emoji: '🎮', order: 11 },
  { name: 'Sécurité & GPS', emoji: '🚨', order: 12 },
  { name: 'Composants électroniques', emoji: '⚙️', order: 13 },
  { name: 'Pièces de rechange Électroménager', emoji: '🔧', order: 14 }, // NOMBRE ÚNICO
  { name: 'Autre Électroménager', emoji: '🔌', order: 15 },
  { name: 'Réfrigérateurs & Congélateurs', emoji: '❄️', order: 16 },
  { name: 'Machines à laver', emoji: '🧺', order: 17 },
  { name: 'Lave-vaisselles', emoji: '🍽️', order: 18 },
  { name: 'Fours & Cuisson', emoji: '🔥', order: 19 },
  { name: 'Chauffage & Climatisation', emoji: '🌡️', order: 20 },
  { name: 'Appareils de cuisine', emoji: '🍳', order: 21 }
];

// Sub-subcategorías para Électroménager (nivel 3)
const electromenagerLevel3 = {
  'Réfrigérateurs & Congélateurs': [
    { name: 'Réfrigérateur', emoji: '🧊', order: 1 },
    { name: 'Congélateur', emoji: '❄️', order: 2 },
    { name: 'Réfrigérateur-Congélateur', emoji: '🧊❄️', order: 3 },
    { name: 'Cave à vin', emoji: '🍷', order: 4 }
  ],
  'Machines à laver': [
    { name: 'Lave-linge', emoji: '👚', order: 1 },
    { name: 'Sèche-linge', emoji: '🌞', order: 2 },
    { name: 'Lave-linge/Sèche-linge', emoji: '👚🌞', order: 3 },
    { name: 'Lave-linge avec essorage', emoji: '🌀', order: 4 }
  ],
  'Lave-vaisselles': [
    { name: 'Lave-vaisselle encastrable', emoji: '📦', order: 1 },
    { name: 'Lave-vaisselle pose libre', emoji: '🍽️', order: 2 },
    { name: 'Lave-vaisselle compact', emoji: '📦', order: 3 }
  ],
  'Fours & Cuisson': [
    { name: 'Four électrique', emoji: '⚡', order: 1 },
    { name: 'Four à gaz', emoji: '🔥', order: 2 },
    { name: 'Four micro-ondes', emoji: '🌀', order: 3 },
    { name: 'Plaque de cuisson', emoji: '🍳', order: 4 },
    { name: 'Cuisinière', emoji: '👩‍🍳', order: 5 }
  ],
  'Chauffage & Climatisation': [
    { name: 'Climatiseur', emoji: '❄️', order: 1 },
    { name: 'Ventilateur', emoji: '💨', order: 2 },
    { name: 'Radiateur', emoji: '🔥', order: 3 },
    { name: 'Chauffe-eau', emoji: '🚿', order: 4 },
    { name: 'Pompe à chaleur', emoji: '🌡️', order: 5 }
  ],
  'Appareils de cuisine': [
    { name: 'Robot de cuisine', emoji: '🍲', order: 1 },
    { name: 'Mixeur', emoji: '🥤', order: 2 },
    { name: 'Bouilloire', emoji: '♨️', order: 3 },
    { name: 'Cafetière', emoji: '☕', order: 4 },
    { name: 'Grille-pain', emoji: '🍞', order: 5 }
  ]
};

// Subcategorías de Téléphones & Accessoires (nivel 2)
const telephonesSubcategories = [
  { name: 'Smartphones', emoji: '📱', order: 1 },
  { name: 'Téléphones cellulaires', emoji: '📞', order: 2 },
  { name: 'Tablettes', emoji: '💻', order: 3 },
  { name: 'Fixes & Fax', emoji: '☎️', order: 4 },
  { name: 'Smartwatchs', emoji: '⌚', order: 5 },
  { name: 'Accessoires Téléphones', emoji: '🎧', order: 6 }, // NOMBRE ÚNICO
  { name: 'Pièces de rechange Téléphones', emoji: '🔧', order: 7 }, // NOMBRE ÚNICO
  { name: 'Offres & Abonnements', emoji: '📶', order: 8 },
  { name: 'Protection & Antichoc', emoji: '🛡️', order: 9 },
  { name: 'Ecouteurs & Son', emoji: '🎵', order: 10 },
  { name: 'Chargeurs & Câbles', emoji: '🔌', order: 11 },
  { name: 'Supports & Stabilisateurs', emoji: '📐', order: 12 },
  { name: 'Manettes', emoji: '🎮', order: 13 },
  { name: 'VR', emoji: '👓', order: 14 },
  { name: 'Power banks', emoji: '🔋', order: 15 },
  { name: 'Stylets', emoji: '✏️', order: 16 },
  { name: 'Cartes Mémoire', emoji: '💾', order: 17 }
];

// Sub-subcategorías para Téléphones (nivel 3)
const telephonesLevel3 = {
  'Protection & Antichoc': [
    { name: 'Protections d\'écran', emoji: '🖥️', order: 1 },
    { name: 'Coques & Antichoc', emoji: '📱', order: 2 },
    { name: 'Films de protection', emoji: '📋', order: 3 },
    { name: 'Étuis', emoji: '🎁', order: 4 },
    { name: 'Protections de caméra', emoji: '📸', order: 5 }
  ],
  'Ecouteurs & Son': [
    { name: 'Écouteurs filaires', emoji: '🎧', order: 1 },
    { name: 'Écouteurs Bluetooth', emoji: '🔵', order: 2 },
    { name: 'Casques audio', emoji: '🎧', order: 3 },
    { name: 'Hauts-parleurs portables', emoji: '🔊', order: 4 },
    { name: 'Adaptateurs audio', emoji: '🎛️', order: 5 }
  ],
  'Chargeurs & Câbles': [
    { name: 'Chargeurs mural', emoji: '🔌', order: 1 },
    { name: 'Chargeurs voiture', emoji: '🚗', order: 2 },
    { name: 'Chargeurs sans fil', emoji: '⚡', order: 3 },
    { name: 'Câbles USB', emoji: '🔌', order: 4 },
    { name: 'Câbles Lightning', emoji: '⚡', order: 5 },
    { name: 'Câbles Type-C', emoji: '🔌', order: 6 },
    { name: 'Hubs chargeurs', emoji: '🔗', order: 7 }
  ],
  'Supports & Stabilisateurs': [
    { name: 'Supports', emoji: '📱', order: 1 },
    { name: 'Stabilisateurs', emoji: '🤳', order: 2 },
    { name: 'Barres de selfies', emoji: '📸', order: 3 },
    { name: 'Pieds pour téléphone', emoji: '📐', order: 4 },
    { name: 'Ventouses voiture', emoji: '🚗', order: 5 }
  ],
  'Manettes': [
    { name: 'Manettes Bluetooth', emoji: '🎮', order: 1 },
    { name: 'Manettes filaires', emoji: '🎮', order: 2 },
    { name: 'Manettes pour téléphone', emoji: '📱', order: 3 },
    { name: 'Manettes pour tablette', emoji: '💻', order: 4 },
    { name: 'Accessoires pour manettes', emoji: '🔧', order: 5 }
  ],
  'VR': [
    { name: 'Casques VR', emoji: '👓', order: 1 },
    { name: 'Lunettes VR', emoji: '🕶️', order: 2 },
    { name: 'Accessoires VR', emoji: '🔧', order: 3 },
    { name: 'Contrôleurs VR', emoji: '🎮', order: 4 },
    { name: 'Jeux VR', emoji: '🎮', order: 5 }
  ],
  'Power banks': [
    { name: 'Power bank 10,000mAh', emoji: '🔋', order: 1 },
    { name: 'Power bank 20,000mAh', emoji: '🔋', order: 2 },
    { name: 'Power bank solaire', emoji: '☀️', order: 3 },
    { name: 'Power bank charge rapide', emoji: '⚡', order: 4 },
    { name: 'Power bank compact', emoji: '📱', order: 5 }
  ],
  'Stylets': [
    { name: 'Stylets actifs', emoji: '✏️', order: 1 },
    { name: 'Stylets passifs', emoji: '✏️', order: 2 },
    { name: 'Stylets Bluetooth', emoji: '🔵', order: 3 },
    { name: 'Stylets pour tablette', emoji: '💻', order: 4 },
    { name: 'Recharges pour stylet', emoji: '🔋', order: 5 }
  ],
  'Cartes Mémoire': [
    { name: 'Cartes SD', emoji: '💾', order: 1 },
    { name: 'Cartes Micro SD', emoji: '💾', order: 2 },
    { name: 'Cartes SDHC', emoji: '💾', order: 3 },
    { name: 'Cartes SDXC', emoji: '💾', order: 4 },
    { name: 'Adaptateurs de carte', emoji: '🔌', order: 5 },
    { name: 'Lecteurs de carte', emoji: '📖', order: 6 }
  ]
};

// Subcategorías de Immobilier (nivel 2)
const immobilierSubcategories = [
  { name: 'Vente', emoji: '💰', order: 1 },
  { name: 'Location', emoji: '🔑', order: 2 },
  { name: 'Location vacances', emoji: '🏖️', order: 3 },
  { name: 'Cherche location', emoji: '🔍', order: 4 },
  { name: 'Cherche achat', emoji: '🔍', order: 5 }
];

// Sub-subcategorías para Immobilier (nivel 3)
const immobilierLevel3 = {
  'Vente': [
    { name: 'Appartement', emoji: '🏢', order: 1 },
    { name: 'Local', emoji: '🏪', order: 2 },
    { name: 'Villa', emoji: '🏡', order: 3 },
    { name: 'Terrain', emoji: '⛰️', order: 4 },
    { name: 'Terrain Agricole', emoji: '🌾', order: 5 },
    { name: 'Immeuble', emoji: '🏢', order: 6 },
    { name: 'Bungalow', emoji: '🏝️', order: 7 },
    { name: 'Hangar - Usine', emoji: '🏭', order: 8 },
    { name: 'Autre Immobilier', emoji: '🏠', order: 9 } // NOMBRE ÚNICO
  ],
  'Location': [
    { name: 'Appartement', emoji: '🏢', order: 1 },
    { name: 'Local', emoji: '🏪', order: 2 },
    { name: 'Villa', emoji: '🏡', order: 3 },
    { name: 'Immeuble', emoji: '🏢', order: 4 },
    { name: 'Bungalow', emoji: '🏝️', order: 5 },
    { name: 'Autre Location', emoji: '🏠', order: 6 } // NOMBRE ÚNICO
  ],
  'Location vacances': [
    { name: 'Appartement', emoji: '🏢', order: 1 },
    { name: 'Villa', emoji: '🏡', order: 2 },
    { name: 'Bungalow', emoji: '🏝️', order: 3 },
    { name: 'Autre Location Vacances', emoji: '🏠', order: 4 } // NOMBRE ÚNICO
  ],
  'Cherche location': [
    { name: 'Appartement', emoji: '🏢', order: 1 },
    { name: 'Local', emoji: '🏪', order: 2 },
    { name: 'Villa', emoji: '🏡', order: 3 },
    { name: 'Immeuble', emoji: '🏢', order: 4 },
    { name: 'Bungalow', emoji: '🏝️', order: 5 },
    { name: 'Autre Cherche Location', emoji: '🏠', order: 6 } // NOMBRE ÚNICO
  ],
  'Cherche achat': [
    { name: 'Appartement', emoji: '🏢', order: 1 },
    { name: 'Local', emoji: '🏪', order: 2 },
    { name: 'Villa', emoji: '🏡', order: 3 },
    { name: 'Terrain', emoji: '⛰️', order: 4 },
    { name: 'Terrain Agricole', emoji: '🌾', order: 5 },
    { name: 'Immeuble', emoji: '🏢', order: 6 },
    { name: 'Bungalow', emoji: '🏝️', order: 7 },
    { name: 'Hangar - Usine', emoji: '🏭', order: 8 },
    { name: 'Autre Cherche Achat', emoji: '🏠', order: 9 } // NOMBRE ÚNICO
  ]
};

// Subcategorías de Informatique (nivel 2)
const informatiqueSubcategories = [
  { name: 'Ordinateurs portables', emoji: '💻', order: 1, hasChildren: true },
  { name: 'Ordinateurs de bureau', emoji: '🖥️', order: 2, hasChildren: true },
  { name: 'Composants PC fixe', emoji: '⚙️', order: 3, hasChildren: true },
  { name: 'Composants PC portable', emoji: '🔧', order: 4, hasChildren: true },
  { name: 'Composants serveur', emoji: '🖧', order: 5, hasChildren: true },
  { name: 'Imprimantes & Cartouches', emoji: '🖨️', order: 6, hasChildren: true },
  { name: 'Réseau & Connexion', emoji: '📶', order: 7, hasChildren: true },
  { name: 'Stockage externe & Racks', emoji: '💾', order: 8, hasChildren: true },
  { name: 'Serveurs Informatique', emoji: '🖧', order: 9, hasChildren: false }, // NOMBRE ÚNICO
  { name: 'Ecrans Informatique', emoji: '🖥️', order: 10, hasChildren: false }, // NOMBRE ÚNICO
  { name: 'Onduleurs & Stabilisateurs', emoji: '⚡', order: 11, hasChildren: false },
  { name: 'Compteuses de billets', emoji: '💰', order: 12, hasChildren: false },
  { name: 'Claviers & Souris', emoji: '⌨️', order: 13, hasChildren: false },
  { name: 'Casques & Son Informatique', emoji: '🎧', order: 14, hasChildren: false }, // NOMBRE ÚNICO
  { name: 'Webcam & Vidéoconférence', emoji: '📹', order: 15, hasChildren: false },
  { name: 'Data shows', emoji: '📊', order: 16, hasChildren: false },
  { name: 'Câbles & Adaptateurs Informatique', emoji: '🔌', order: 17, hasChildren: false }, // NOMBRE ÚNICO
  { name: 'Stylets & Tablettes Informatique', emoji: '✏️', order: 18, hasChildren: false }, // NOMBRE ÚNICO
  { name: 'Cartables & Sacoches', emoji: '🎒', order: 19, hasChildren: false },
  { name: 'Manettes & Simulateurs', emoji: '🎮', order: 20, hasChildren: false },
  { name: 'VR Informatique', emoji: '🥽', order: 21, hasChildren: false }, // NOMBRE ÚNICO
  { name: 'Logiciels & Abonnements', emoji: '📀', order: 22, hasChildren: false },
  { name: 'Bureautique', emoji: '📎', order: 23, hasChildren: false },
  { name: 'Autre Informatique', emoji: '💡', order: 24, hasChildren: false } // NOMBRE ÚNICO
];

// Sub-subcategorías para Informatique (nivel 3)
const informatiqueLevel3 = {
  'Ordinateurs portables': [
    { name: 'Pc Portable', emoji: '💻', order: 1 },
    { name: 'Macbooks', emoji: '🍎', order: 2 }
  ],
  'Ordinateurs de bureau': [
    { name: 'Pc de bureau', emoji: '🖥️', order: 1 },
    { name: 'Unités centrales', emoji: '🖥️', order: 2 },
    { name: 'All In One', emoji: '🖥️', order: 3 }
  ],
  'Composants PC fixe': [
    { name: 'Cartes mère', emoji: '🔌', order: 1 },
    { name: 'Processeurs', emoji: '⚡', order: 2 },
    { name: 'RAM Informatique', emoji: '💾', order: 3 }, // NOMBRE ÚNICO
    { name: 'Disques dur PC fixe', emoji: '💿', order: 4 }, // NOMBRE ÚNICO
    { name: 'Cartes graphique PC fixe', emoji: '🎮', order: 5 }, // NOMBRE ÚNICO
    { name: 'Alimentations & Boitiers', emoji: '🔋', order: 6 },
    { name: 'Refroidissement PC fixe', emoji: '❄️', order: 7 }, // NOMBRE ÚNICO
    { name: 'Lecteurs & Graveurs CD', emoji: '📀', order: 8 },
    { name: 'Autres composants fixe', emoji: '🔧', order: 9 } // NOMBRE ÚNICO
  ],
  'Composants PC portable': [
    { name: 'Chargeurs PC portable', emoji: '🔌', order: 1 }, // NOMBRE ÚNICO
    { name: 'Batteries PC portable', emoji: '🔋', order: 2 }, // NOMBRE ÚNICO
    { name: 'Ecrans PC portable', emoji: '🖥️', order: 3 }, // NOMBRE ÚNICO
    { name: 'Claviers & Touchpads', emoji: '⌨️', order: 4 },
    { name: 'Disques Dur PC portable', emoji: '💿', order: 5 }, // NOMBRE ÚNICO
    { name: 'RAM PC portable', emoji: '💾', order: 6 }, // NOMBRE ÚNICO
    { name: 'Refroidissement PC portable', emoji: '❄️', order: 7 }, // NOMBRE ÚNICO
    { name: 'Cartes mère PC portable', emoji: '🔌', order: 8 }, // NOMBRE ÚNICO
    { name: 'Processeurs PC portable', emoji: '⚡', order: 9 }, // NOMBRE ÚNICO
    { name: 'Cartes graphique PC portable', emoji: '🎮', order: 10 }, // NOMBRE ÚNICO
    { name: 'Lecteurs & Graveurs PC portable', emoji: '📀', order: 11 }, // NOMBRE ÚNICO
    { name: 'Baffles & Webcams PC', emoji: '🎤', order: 12 }, // NOMBRE ÚNICO
    { name: 'Autres composants portable', emoji: '🔧', order: 13 } // NOMBRE ÚNICO
  ],
  'Composants serveur': [
    { name: 'Cartes mère serveur', emoji: '🔌', order: 1 }, // NOMBRE ÚNICO
    { name: 'Processeurs serveur', emoji: '⚡', order: 2 }, // NOMBRE ÚNICO
    { name: 'RAM serveur', emoji: '💾', order: 3 }, // NOMBRE ÚNICO
    { name: 'Disques dur serveur', emoji: '💿', order: 4 }, // NOMBRE ÚNICO
    { name: 'Cartes réseau serveur', emoji: '📶', order: 5 }, // NOMBRE ÚNICO
    { name: 'Alimentations serveur', emoji: '🔋', order: 6 }, // NOMBRE ÚNICO
    { name: 'Refroidissement serveur', emoji: '❄️', order: 7 }, // NOMBRE ÚNICO
    { name: 'Cartes graphique serveur', emoji: '🎮', order: 8 }, // NOMBRE ÚNICO
    { name: 'Autres composants serveur', emoji: '🔧', order: 9 } // NOMBRE ÚNICO
  ],
  'Imprimantes & Cartouches': [
    { name: 'Imprimantes jet d\'encre', emoji: '🖨️', order: 1 },
    { name: 'Imprimantes Laser', emoji: '🖨️', order: 2 },
    { name: 'Imprimantes matricielles', emoji: '🖨️', order: 3 },
    { name: 'Codes à barre & Etiqueteuses', emoji: '🏷️', order: 4 },
    { name: 'Imprimantes photo & badges', emoji: '🖼️', order: 5 },
    { name: 'Photocopieuses professionnelles', emoji: '📠', order: 6 },
    { name: 'Imprimantes 3D', emoji: '🖨️', order: 7 },
    { name: 'Cartouches & Toners', emoji: '🎨', order: 8 },
    { name: 'Autre imprimantes', emoji: '🖨️', order: 9 } // NOMBRE ÚNICO
  ],
  'Réseau & Connexion': [
    { name: 'Modems & Routeurs', emoji: '📡', order: 1 },
    { name: 'Switchs', emoji: '🔀', order: 2 },
    { name: 'Point d\'accès wifi', emoji: '📶', order: 3 },
    { name: 'Répéteur Wi-Fi', emoji: '📶', order: 4 },
    { name: 'Cartes réseau informatique', emoji: '📡', order: 5 }, // NOMBRE ÚNICO
    { name: 'Autre réseau', emoji: '📶', order: 6 } // NOMBRE ÚNICO
  ],
  'Stockage externe & Racks': [
    { name: 'Disques durs externes', emoji: '💿', order: 1 },
    { name: 'Flash disque', emoji: '💾', order: 2 },
    { name: 'Carte mémoire informatique', emoji: '📋', order: 3 }, // NOMBRE ÚNICO
    { name: 'Rack informatique', emoji: '🗄️', order: 4 } // NOMBRE ÚNICO
  ]
};

// Subcategorías de Véhicules (nivel 2)
const vehiculesSubcategories = [
  { name: 'Voitures', emoji: '🚗', order: 1 },
  { name: 'Utilitaire', emoji: '🚐', order: 2 },
  { name: 'Motos & Scooters', emoji: '🏍️', order: 3 },
  { name: 'Quads', emoji: '🚜', order: 4 },
  { name: 'Fourgon', emoji: '🚚', order: 5 },
  { name: 'Camion', emoji: '🚛', order: 6 },
  { name: 'Bus', emoji: '🚌', order: 7 },
  { name: 'Engin', emoji: '🚜', order: 8 },
  { name: 'Tracteurs', emoji: '🚜', order: 9 },
  { name: 'Remorques', emoji: '🚛', order: 10 },
  { name: 'Bateaux & Barques', emoji: '🛥️', order: 11 }
];

// Sub-subcategorías para Véhicules (nivel 3 - vacío)
const vehiculesLevel3 = {};

// Subcategorías de Mode & Accessoires (nivel 2)
const modeSubcategories = [
  { name: 'Vêtements Homme', emoji: '👔', order: 1 },
  { name: 'Vêtements Femme', emoji: '👗', order: 2 },
  { name: 'Vêtements Enfant', emoji: '👶', order: 3 },
  { name: 'Chaussures Mode', emoji: '👟', order: 4 }, // NOMBRE ÚNICO
  { name: 'Sacs & Accessoires Mode', emoji: '👜', order: 5 }, // NOMBRE ÚNICO
  { name: 'Montres & Bijoux', emoji: '⌚', order: 6 },
  { name: 'Lunettes Mode', emoji: '👓', order: 7 }, // NOMBRE ÚNICO
  { name: 'Sous-vêtements Mode', emoji: '👙', order: 8 }, // NOMBRE ÚNICO
  { name: 'Vêtements de sport', emoji: '🎽', order: 9 },
  { name: 'Maillots de bain', emoji: '🩱', order: 10 },
  { name: 'Accessoires mode', emoji: '🧣', order: 11 },
  { name: 'Vêtements occasion', emoji: '🎩', order: 12 }
];

// Sub-subcategorías para Mode & Accessoires (nivel 3)
const modeLevel3 = {
  'Vêtements Homme': [
    { name: 'Chemises Homme', emoji: '👔', order: 1 }, // NOMBRE ÚNICO
    { name: 'Pantalons Homme', emoji: '👖', order: 2 }, // NOMBRE ÚNICO
    { name: 'T-shirts Homme', emoji: '👕', order: 3 }, // NOMBRE ÚNICO
    { name: 'Costumes Homme', emoji: '🤵', order: 4 }, // NOMBRE ÚNICO
    { name: 'Vestes Homme', emoji: '🧥', order: 5 }, // NOMBRE ÚNICO
    { name: 'Sous-vêtements Homme', emoji: '🩲', order: 6 }, // NOMBRE ÚNICO
    { name: 'Sportswear Homme', emoji: '🎽', order: 7 } // NOMBRE ÚNICO
  ],
  'Vêtements Femme': [
    { name: 'Robes Femme', emoji: '👗', order: 1 }, // NOMBRE ÚNICO
    { name: 'Jupes Femme', emoji: '🩳', order: 2 }, // NOMBRE ÚNICO
    { name: 'Hauts Femme', emoji: '👚', order: 3 }, // NOMBRE ÚNICO
    { name: 'Pantalons Femme', emoji: '👖', order: 4 }, // NOMBRE ÚNICO
    { name: 'Manteaux Femme', emoji: '🧥', order: 5 }, // NOMBRE ÚNICO
    { name: 'Sous-vêtements Femme', emoji: '👙', order: 6 }, // NOMBRE ÚNICO
    { name: 'Sportswear Femme', emoji: '🎽', order: 7 } // NOMBRE ÚNICO
  ],
  'Chaussures Mode': [
    { name: 'Chaussures Homme Mode', emoji: '👞', order: 1 }, // NOMBRE ÚNICO
    { name: 'Chaussures Femme Mode', emoji: '👠', order: 2 }, // NOMBRE ÚNICO
    { name: 'Chaussures Enfant Mode', emoji: '👟', order: 3 }, // NOMBRE ÚNICO
    { name: 'Chaussures de sport Mode', emoji: '🏃', order: 4 }, // NOMBRE ÚNICO
    { name: 'Sandales Mode', emoji: '👡', order: 5 }, // NOMBRE ÚNICO
    { name: 'Bottes Mode', emoji: '👢', order: 6 } // NOMBRE ÚNICO
  ],
  'Sacs & Accessoires Mode': [
    { name: 'Sacs à main Mode', emoji: '👜', order: 1 }, // NOMBRE ÚNICO
    { name: 'Sacs à dos Mode', emoji: '🎒', order: 2 }, // NOMBRE ÚNICO
    { name: 'Valises Mode', emoji: '🧳', order: 3 }, // NOMBRE ÚNICO
    { name: 'Portefeuilles Mode', emoji: '💼', order: 4 }, // NOMBRE ÚNICO
    { name: 'Ceintures Mode', emoji: '⛓️', order: 5 } // NOMBRE ÚNICO
  ],
  'Montres & Bijoux': [
    { name: 'Montres Mode', emoji: '⌚', order: 1 }, // NOMBRE ÚNICO
    { name: 'Bagues Mode', emoji: '💍', order: 2 }, // NOMBRE ÚNICO
    { name: 'Colliers Mode', emoji: '📿', order: 3 }, // NOMBRE ÚNICO
    { name: 'Bracelets Mode', emoji: '📿', order: 4 }, // NOMBRE ÚNICO
    { name: 'Boucles d\'oreilles Mode', emoji: '👂', order: 5 } // NOMBRE ÚNICO
  ]
};

// Función principal para insertar categorías
const seedCategories = async () => {
  try {
    console.log('🚀 Iniciando proceso de inserción de categorías...\n');
    
    // Limpiar colección existente
    console.log('🧹 Paso 1: Limpiando colección existente...');
    const result = await Category.deleteMany({});
    console.log(`   ✅ Eliminadas ${result.deletedCount} categorías anteriores\n`);
    
    // Insertar categorías principales (level 1)
    console.log('📦 Paso 2: Insertando categorías principales...');
    const mainCategories = {};
    const allSlugs = new Set();
    
    for (const categoryData of categoriesData) {
      allSlugs.add(categoryData.slug);
      const category = new Category({
        ...categoryData,
        path: `/${categoryData.slug}`
      });
      
      const savedCategory = await category.save();
      mainCategories[categoryData.name] = savedCategory._id;
      console.log(`   ✅ ${categoryData.emoji} ${categoryData.name}`);
    }

    // Función para insertar subcategorías
    const insertSubcategories = async (parentId, subcategories, level2Data, parentName, level = 2) => {
      const parentCategory = await Category.findById(parentId);
      const childIds = [];
      
      for (const subcat of subcategories) {
        const slug = createUniqueSlug(subcat.name, allSlugs);
        
        // Determinar si tiene hijos
        const hasChildren = !!level2Data[subcat.name];
        
        const subcategory = new Category({
          name: subcat.name,
          slug: slug,
          level: level,
          parent: parentId,
          ancestors: [parentId],
          path: `${parentCategory.path}/${slug}`,
          emoji: subcat.emoji,
          order: subcat.order || 0,
          isLeaf: !hasChildren,
          hasChildren: hasChildren
        });
        
        const savedSubcategory = await subcategory.save();
        childIds.push(savedSubcategory._id);
        
        // Insertar nivel 3 si existe
        if (level2Data[subcat.name]) {
          await insertSubcategories(
            savedSubcategory._id,
            level2Data[subcat.name],
            {},
            subcat.name,
            3
          );
        }
      }
      
      // Actualizar parent
      parentCategory.hasChildren = childIds.length > 0;
      await parentCategory.save();
    };

    // Insertar TODAS las categorías
    console.log('\n📁 Paso 3: Insertando subcategorías...\n');
    
    console.log('   🔌 Insertando Électroménager...');
    await insertSubcategories(mainCategories['Électroménager'], electromenagerSubcategories, electromenagerLevel3, 'Électroménager');
    
    console.log('   📱 Insertando Téléphones & Accessoires...');
    await insertSubcategories(mainCategories['Téléphones & Accessoires'], telephonesSubcategories, telephonesLevel3, 'Téléphones & Accessoires');
    
    console.log('   🏠 Insertando Immobilier...');
    await insertSubcategories(mainCategories['Immobilier'], immobilierSubcategories, immobilierLevel3, 'Immobilier');
    
    console.log('   💻 Insertando Informatique...');
    await insertSubcategories(mainCategories['Informatique'], informatiqueSubcategories, informatiqueLevel3, 'Informatique');
    
    console.log('   🚗 Insertando Véhicules...');
    await insertSubcategories(mainCategories['Véhicules'], vehiculesSubcategories, vehiculesLevel3, 'Véhicules');
    
    console.log('   👕 Insertando Mode & Accessoires...');
    await insertSubcategories(mainCategories['Mode & Accessoires'], modeSubcategories, modeLevel3, 'Mode & Accessoires');

    // Mostrar resumen
    console.log('\n🎉 ¡PROCESO COMPLETADO EXITOSAMENTE!');
    console.log('=====================================');
    
    const totalCategories = await Category.countDocuments();
    const level1 = await Category.countDocuments({ level: 1 });
    const level2 = await Category.countDocuments({ level: 2 });
    const level3 = await Category.countDocuments({ level: 3 });
    
    console.log(`📊 Estadísticas:`);
    console.log(`   • Categorías principales: ${level1}`);
    console.log(`   • Subcategorías (nivel 2): ${level2}`);
    console.log(`   • Sub-subcategorías (nivel 3): ${level3}`);
    console.log(`   • Total de categorías: ${totalCategories}`);
    
    console.log('\n✅ Todas las categorías han sido insertadas sin errores de duplicados.');
    console.log('🚀 Tu marketplace está listo para usar.');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ ERROR CRÍTICO:', error.message);
    console.error('Detalles:', error);
    console.log('\n💡 Si el error es de duplicado, ejecuta primero:');
    console.log('   node cleanup.js');
    process.exit(1);
  }
};

// Ejecutar el script
// Nota: No llamar seedCategories() aquí, ya se llama en db.once('open')