// seedCategoriesWithImages.js - SEED COMPLETO CON 5 CATEGORÍAS REALES
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/categoryModel');

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, '❌ Error de conexión a MongoDB:'));
db.once('open', async () => {
  console.log('✅ Conectado a MongoDB exitosamente');
  await seedCategories();
});

// Crear slug único
const createUniqueSlug = (text, existingSlugs = new Set()) => {
  let baseSlug = text.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  
  let slug = baseSlug;
  let counter = 1;
  
  while (existingSlugs.has(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  existingSlugs.add(slug);
  return slug;
};

// ============================================
// NIVEL 1 - CATEGORÍAS PRINCIPALES
// ============================================

const categoriesData = [
  {
    name: 'Vêtements',
    slug: 'vetements',
    level: 1,
    icon: '/uploads/categories/vetements/level1/vetements.png',
    iconType: 'image-png',
    iconColor: '#FF6B6B',
    bgColor: '#FFE5E5',
    order: 1,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Téléphones & Accessoires',
    slug: 'telephones-accessoires',
    level: 1,
    icon: '/uploads/categories/telephones/level1/telephones.png',
    iconType: 'image-png',
    iconColor: '#4ECDC4',
    bgColor: '#E0F7F6',
    order: 2,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Immobilier',
    slug: 'immobilier',
    level: 1,
    icon: '/uploads/categories/immobilier/level1/immobilier.png',
    iconType: 'image-png',
    iconColor: '#FFD166',
    bgColor: '#FFF9E6',
    order: 3,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Électroménager',
    slug: 'electromenager',
    level: 1,
    icon: '/uploads/categories/electromenager/level1/electromenager.png',
    iconType: 'image-png',
    iconColor: '#06D6A0',
    bgColor: '#E6FFF9',
    order: 4,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Véhicules',
    slug: 'vehicules',
    level: 1,
    icon: '/uploads/categories/vehicules/level1/vehicules.png',
    iconType: 'image-png',
    iconColor: '#118AB2',
    bgColor: '#E6F4FF',
    order: 5,
    isLeaf: false,
    hasChildren: true,
  }
];

// ============================================
// NIVEL 2 - TODAS LAS SUBCATEGORÍAS
// ============================================

const subcategoriesData = {
  'Vêtements': [
    { name: 'Vêtements Homme', icon: '/uploads/categories/vetements/level2/vetements-homme.png', iconType: 'image-png', iconColor: '#FF6B6B', order: 1, hasSublevel: true },
    { name: 'Vêtements Femme', icon: '/uploads/categories/vetements/level2/vetements-femme.png', iconType: 'image-png', iconColor: '#FF6B6B', order: 2, hasSublevel: true },
    { name: 'Chaussures Homme', icon: '/uploads/categories/vetements/level2/chaussures-homme.png', iconType: 'image-png', iconColor: '#FF6B6B', order: 3, hasSublevel: true },
    { name: 'Chaussures Femme', icon: '/uploads/categories/vetements/level2/chaussures-femme.png', iconType: 'image-png', iconColor: '#FF6B6B', order: 4, hasSublevel: true },
    { name: 'Garçons', icon: '/uploads/categories/vetements/level2/garcons.png', iconType: 'image-png', iconColor: '#FF6B6B', order: 5, hasSublevel: true },
    { name: 'Filles', icon: '/uploads/categories/vetements/level2/filles.png', iconType: 'image-png', iconColor: '#FF6B6B', order: 6, hasSublevel: true },
    { name: 'Bébé', icon: '/uploads/categories/vetements/level2/bebe.png', iconType: 'image-png', iconColor: '#FF6B6B', order: 7, hasSublevel: true },
    { name: 'Tenues professionnelles', icon: '/uploads/categories/vetements/level2/tenues-professionnelles.png', iconType: 'image-png', iconColor: '#FF6B6B', order: 8, hasSublevel: false },
    { name: 'Sacs & Valises', icon: '/uploads/categories/vetements/level2/sacs-valises.png', iconType: 'image-png', iconColor: '#FF6B6B', order: 9, hasSublevel: true },
    { name: 'Montres', icon: '/uploads/categories/vetements/level2/montres.png', iconType: 'image-png', iconColor: '#FF6B6B', order: 10, hasSublevel: true },
    { name: 'Lunettes', icon: '/uploads/categories/vetements/level2/lunettes.png', iconType: 'image-png', iconColor: '#FF6B6B', order: 11, hasSublevel: true },
    { name: 'Bijoux', icon: '/uploads/categories/vetements/level2/bijoux.png', iconType: 'image-png', iconColor: '#FF6B6B', order: 12, hasSublevel: true }
  ],
  'Téléphones & Accessoires': [
    { name: 'Smartphones', icon: '/uploads/categories/telephones/level2/smartphones.png', iconType: 'image-png', iconColor: '#4ECDC4', order: 1, hasSublevel: false },
    { name: 'Téléphones cellulaires', icon: '/uploads/categories/telephones/level2/telephones-cellulaires.png', iconType: 'image-png', iconColor: '#4ECDC4', order: 2, hasSublevel: false },
    { name: 'Tablettes', icon: '/uploads/categories/telephones/level2/tablettes.png', iconType: 'image-png', iconColor: '#4ECDC4', order: 3, hasSublevel: false },
    { name: 'Fixes & Fax', icon: '/uploads/categories/telephones/level2/fixes-fax.png', iconType: 'image-png', iconColor: '#4ECDC4', order: 4, hasSublevel: false },
    { name: 'Smartwatchs', icon: '/uploads/categories/telephones/level2/smartwatchs.png', iconType: 'image-png', iconColor: '#4ECDC4', order: 5, hasSublevel: false },
    { name: 'Accessoires', icon: '/uploads/categories/telephones/level2/accessoires.png', iconType: 'image-png', iconColor: '#4ECDC4', order: 6, hasSublevel: false },
    { name: 'Pièces de rechange', icon: '/uploads/categories/telephones/level2/pieces-rechange.png', iconType: 'image-png', iconColor: '#4ECDC4', order: 7, hasSublevel: false },
    { name: 'Offres & Abonnements', icon: '/uploads/categories/telephones/level2/offres-abonnements.png', iconType: 'image-png', iconColor: '#4ECDC4', order: 8, hasSublevel: false },
    { name: 'Protection & Antichoc', icon: '/uploads/categories/telephones/level2/protection-antichoc.png', iconType: 'image-png', iconColor: '#4ECDC4', order: 9, hasSublevel: true },
    { name: 'Ecouteurs & Son', icon: '/uploads/categories/telephones/level2/ecouteurs-son.png', iconType: 'image-png', iconColor: '#4ECDC4', order: 10, hasSublevel: true },
    { name: 'Chargeurs & Câbles', icon: '/uploads/categories/telephones/level2/chargeurs-cables.png', iconType: 'image-png', iconColor: '#4ECDC4', order: 11, hasSublevel: true },
    { name: 'Supports & Stabilisateurs', icon: '/uploads/categories/telephones/level2/supports-stabilisateurs.png', iconType: 'image-png', iconColor: '#4ECDC4', order: 12, hasSublevel: true },
    { name: 'Manettes', icon: '/uploads/categories/telephones/level2/manettes.png', iconType: 'image-png', iconColor: '#4ECDC4', order: 13, hasSublevel: true },
    { name: 'VR', icon: '/uploads/categories/telephones/level2/vr.png', iconType: 'image-png', iconColor: '#4ECDC4', order: 14, hasSublevel: true },
    { name: 'Power banks', icon: '/uploads/categories/telephones/level2/power-banks.png', iconType: 'image-png', iconColor: '#4ECDC4', order: 15, hasSublevel: true },
    { name: 'Stylets', icon: '/uploads/categories/telephones/level2/stylets.png', iconType: 'image-png', iconColor: '#4ECDC4', order: 16, hasSublevel: true },
    { name: 'Cartes Mémoire', icon: '/uploads/categories/telephones/level2/cartes-memoire.png', iconType: 'image-png', iconColor: '#4ECDC4', order: 17, hasSublevel: true },
    { name: 'Accessoires Divers', icon: '/uploads/categories/telephones/level2/accessoires-divers.png', iconType: 'image-png', iconColor: '#4ECDC4', order: 18, hasSublevel: false }
  ],
  'Immobilier': [
    { name: 'Vente', icon: '/uploads/categories/immobilier/level2/vente.png', iconType: 'image-png', iconColor: '#FFD166', order: 1, hasSublevel: true },
    { name: 'Location', icon: '/uploads/categories/immobilier/level2/location.png', iconType: 'image-png', iconColor: '#FFD166', order: 2, hasSublevel: true },
    { name: 'Location vacances', icon: '/uploads/categories/immobilier/level2/location-vacances.png', iconType: 'image-png', iconColor: '#FFD166', order: 3, hasSublevel: true },
    { name: 'Cherche location', icon: '/uploads/categories/immobilier/level2/cherche-location.png', iconType: 'image-png', iconColor: '#FFD166', order: 4, hasSublevel: true },
    { name: 'Cherche achat', icon: '/uploads/categories/immobilier/level2/cherche-achat.png', iconType: 'image-png', iconColor: '#FFD166', order: 5, hasSublevel: true }
  ],
  'Électroménager': [
    { name: 'Téléviseurs', icon: '/uploads/categories/electromenager/level2/televiseurs.png', iconType: 'image-png', iconColor: '#06D6A0', order: 1, hasSublevel: false },
    { name: 'Démodulateurs & Box TV', icon: '/uploads/categories/electromenager/level2/demodulateurs-box-tv.png', iconType: 'image-png', iconColor: '#06D6A0', order: 2, hasSublevel: false },
    { name: 'Paraboles & Switch TV', icon: '/uploads/categories/electromenager/level2/paraboles-switch-tv.png', iconType: 'image-png', iconColor: '#06D6A0', order: 3, hasSublevel: false },
    { name: 'Abonnements IPTV', icon: '/uploads/categories/electromenager/level2/abonnements-iptv.png', iconType: 'image-png', iconColor: '#06D6A0', order: 4, hasSublevel: false },
    { name: 'Caméras & Accessories', icon: '/uploads/categories/electromenager/level2/cameras-accessories.png', iconType: 'image-png', iconColor: '#06D6A0', order: 5, hasSublevel: false },
    { name: 'Audio', icon: '/uploads/categories/electromenager/level2/audio.png', iconType: 'image-png', iconColor: '#06D6A0', order: 6, hasSublevel: false },
    { name: 'Aspirateurs & Nettoyeurs', icon: '/uploads/categories/electromenager/level2/aspirateurs-nettoyeurs.png', iconType: 'image-png', iconColor: '#06D6A0', order: 7, hasSublevel: false },
    { name: 'Repassage', icon: '/uploads/categories/electromenager/level2/repassage.png', iconType: 'image-png', iconColor: '#06D6A0', order: 8, hasSublevel: false },
    { name: 'Beauté & Hygiène', icon: '/uploads/categories/electromenager/level2/beaute-hygiene.png', iconType: 'image-png', iconColor: '#06D6A0', order: 9, hasSublevel: false },
    { name: 'Machines à coudre', icon: '/uploads/categories/electromenager/level2/machines-coudre.png', iconType: 'image-png', iconColor: '#06D6A0', order: 10, hasSublevel: false },
    { name: 'Télécommandes', icon: '/uploads/categories/electromenager/level2/telecommandes.png', iconType: 'image-png', iconColor: '#06D6A0', order: 11, hasSublevel: false },
    { name: 'Sécurité & GPS', icon: '/uploads/categories/electromenager/level2/securite-gps.png', iconType: 'image-png', iconColor: '#06D6A0', order: 12, hasSublevel: false },
    { name: 'Composants électroniques', icon: '/uploads/categories/electromenager/level2/composants-electroniques.png', iconType: 'image-png', iconColor: '#06D6A0', order: 13, hasSublevel: false },
    { name: 'Pièces de rechange', icon: '/uploads/categories/electromenager/level2/pieces-rechange.png', iconType: 'image-png', iconColor: '#06D6A0', order: 14, hasSublevel: false },
    { name: 'Autre Électroménager', icon: '/uploads/categories/electromenager/level2/autre-electromenager.png', iconType: 'image-png', iconColor: '#06D6A0', order: 15, hasSublevel: false },
    { name: 'Réfrigérateurs & Congélateurs', icon: '/uploads/categories/electromenager/level2/refrigerateurs-congelateurs.png', iconType: 'image-png', iconColor: '#06D6A0', order: 16, hasSublevel: true },
    { name: 'Machines à laver', icon: '/uploads/categories/electromenager/level2/machines-a-laver.png', iconType: 'image-png', iconColor: '#06D6A0', order: 17, hasSublevel: true },
    { name: 'Lave-vaisselles', icon: '/uploads/categories/electromenager/level2/lave-vaisselles.png', iconType: 'image-png', iconColor: '#06D6A0', order: 18, hasSublevel: true },
    { name: 'Fours & Cuisson', icon: '/uploads/categories/electromenager/level2/fours-cuisson.png', iconType: 'image-png', iconColor: '#06D6A0', order: 19, hasSublevel: true },
    { name: 'Chauffage & Climatisation', icon: '/uploads/categories/electromenager/level2/chauffage-climatisation.png', iconType: 'image-png', iconColor: '#06D6A0', order: 20, hasSublevel: true },
    { name: 'Appareils de cuisine', icon: '/uploads/categories/electromenager/level2/appareils-cuisine.png', iconType: 'image-png', iconColor: '#06D6A0', order: 21, hasSublevel: true }
  ],
  'Véhicules': [
    { name: 'Voitures', icon: '/uploads/categories/vehicules/level2/voitures.png', iconType: 'image-png', iconColor: '#118AB2', order: 1, hasSublevel: false },
    { name: 'Utilitaire', icon: '/uploads/categories/vehicules/level2/utilitaire.png', iconType: 'image-png', iconColor: '#118AB2', order: 2, hasSublevel: false },
    { name: 'Motos & Scooters', icon: '/uploads/categories/vehicules/level2/motos-scooters.png', iconType: 'image-png', iconColor: '#118AB2', order: 3, hasSublevel: false },
    { name: 'Quads', icon: '/uploads/categories/vehicules/level2/quads.png', iconType: 'image-png', iconColor: '#118AB2', order: 4, hasSublevel: false },
    { name: 'Fourgon', icon: '/uploads/categories/vehicules/level2/fourgon.png', iconType: 'image-png', iconColor: '#118AB2', order: 5, hasSublevel: false },
    { name: 'Camion', icon: '/uploads/categories/vehicules/level2/camion.png', iconType: 'image-png', iconColor: '#118AB2', order: 6, hasSublevel: false },
    { name: 'Bus', icon: '/uploads/categories/vehicules/level2/bus.png', iconType: 'image-png', iconColor: '#118AB2', order: 7, hasSublevel: false },
    { name: 'Engin', icon: '/uploads/categories/vehicules/level2/engin.png', iconType: 'image-png', iconColor: '#118AB2', order: 8, hasSublevel: false },
    { name: 'Tracteurs', icon: '/uploads/categories/vehicules/level2/tracteurs.png', iconType: 'image-png', iconColor: '#118AB2', order: 9, hasSublevel: false },
    { name: 'Remorques', icon: '/uploads/categories/vehicules/level2/remorques.png', iconType: 'image-png', iconColor: '#118AB2', order: 10, hasSublevel: false },
    { name: 'Bateaux & Barques', icon: '/uploads/categories/vehicules/level2/bateaux-barques.png', iconType: 'image-png', iconColor: '#118AB2', order: 11, hasSublevel: false }
  ]
};

// ============================================
// NIVEL 3 - TODOS LOS ARTÍCULOS (COMPLETOS)
// ============================================

const articlesData = {
  // VÊTEMENTS
  'Vêtements Homme': [
    { name: 'Hauts & Chemises', icon: '/uploads/categories/vetements/level3/hauts-chemises-homme.png', iconType: 'image-png', order: 1 },
    { name: 'Jeans & Pantalons', icon: '/uploads/categories/vetements/level3/jeans-pantalons-homme.png', iconType: 'image-png', order: 2 },
    { name: 'Shorts & Pantacourts', icon: '/uploads/categories/vetements/level3/shorts-pantacourts-homme.png', iconType: 'image-png', order: 3 },
    { name: 'Vestes & Gilets', icon: '/uploads/categories/vetements/level3/vestes-gilets-homme.png', iconType: 'image-png', order: 4 },
    { name: 'Costumes & Blazers', icon: '/uploads/categories/vetements/level3/costumes-blazers-homme.png', iconType: 'image-png', order: 5 },
    { name: 'Survetements', icon: '/uploads/categories/vetements/level3/survetements-homme.png', iconType: 'image-png', order: 6 },
    { name: 'Kamiss', icon: '/uploads/categories/vetements/level3/kamiss-homme.png', iconType: 'image-png', order: 7 },
    { name: 'Sous vêtements', icon: '/uploads/categories/vetements/level3/sous-vetements-homme.png', iconType: 'image-png', order: 8 },
    { name: 'Pyjamas', icon: '/uploads/categories/vetements/level3/pyjamas-homme.png', iconType: 'image-png', order: 9 },
    { name: 'Maillots de bain', icon: '/uploads/categories/vetements/level3/maillots-bain-homme.png', iconType: 'image-png', order: 10 },
    { name: 'Casquettes & Chapeaux', icon: '/uploads/categories/vetements/level3/casquettes-chapeaux-homme.png', iconType: 'image-png', order: 11 },
    { name: 'Chaussettes', icon: '/uploads/categories/vetements/level3/chaussettes-homme.png', iconType: 'image-png', order: 12 },
    { name: 'Ceintures', icon: '/uploads/categories/vetements/level3/ceintures-homme.png', iconType: 'image-png', order: 13 },
    { name: 'Gants', icon: '/uploads/categories/vetements/level3/gants-homme.png', iconType: 'image-png', order: 14 },
    { name: 'Cravates', icon: '/uploads/categories/vetements/level3/cravates-homme.png', iconType: 'image-png', order: 15 },
    { name: 'Autre', icon: '/uploads/categories/vetements/level3/autre-vetements-homme.png', iconType: 'image-png', order: 16 }
  ],
  'Vêtements Femme': [
    { name: 'Hauts & Chemises', icon: '/uploads/categories/vetements/level3/hauts-chemises-femme.png', iconType: 'image-png', order: 1 },
    { name: 'Jeans & Pantalons', icon: '/uploads/categories/vetements/level3/jeans-pantalons-femme.png', iconType: 'image-png', order: 2 },
    { name: 'Shorts & Pantacourts', icon: '/uploads/categories/vetements/level3/shorts-pantacourts-femme.png', iconType: 'image-png', order: 3 },
    { name: 'Vestes & Gilets', icon: '/uploads/categories/vetements/level3/vestes-gilets-femme.png', iconType: 'image-png', order: 4 },
    { name: 'Ensembles', icon: '/uploads/categories/vetements/level3/ensembles-femme.png', iconType: 'image-png', order: 5 },
    { name: 'Abayas & Hijabs', icon: '/uploads/categories/vetements/level3/abayas-hijabs-femme.png', iconType: 'image-png', order: 6 },
    { name: 'Mariages & Fêtes', icon: '/uploads/categories/vetements/level3/mariages-fetes-femme.png', iconType: 'image-png', order: 7 },
    { name: 'Maternité', icon: '/uploads/categories/vetements/level3/maternite-femme.png', iconType: 'image-png', order: 8 },
    { name: 'Robes', icon: '/uploads/categories/vetements/level3/robes-femme.png', iconType: 'image-png', order: 9 },
    { name: 'Jupes', icon: '/uploads/categories/vetements/level3/jupes-femme.png', iconType: 'image-png', order: 10 },
    { name: 'Joggings & Survetements', icon: '/uploads/categories/vetements/level3/joggings-survetements-femme.png', iconType: 'image-png', order: 11 },
    { name: 'Leggings', icon: '/uploads/categories/vetements/level3/leggings-femme.png', iconType: 'image-png', order: 12 },
    { name: 'Sous-vêtements & Lingerie', icon: '/uploads/categories/vetements/level3/sous-vetements-lingerie-femme.png', iconType: 'image-png', order: 13 },
    { name: 'Pyjamas', icon: '/uploads/categories/vetements/level3/pyjamas-femme.png', iconType: 'image-png', order: 14 },
    { name: 'Peignoirs', icon: '/uploads/categories/vetements/level3/peignoirs-femme.png', iconType: 'image-png', order: 15 },
    { name: 'Maillots de bain', icon: '/uploads/categories/vetements/level3/maillots-bain-femme.png', iconType: 'image-png', order: 16 },
    { name: 'Casquettes & Chapeaux', icon: '/uploads/categories/vetements/level3/casquettes-chapeaux-femme.png', iconType: 'image-png', order: 17 },
    { name: 'Chaussettes & Collants', icon: '/uploads/categories/vetements/level3/chaussettes-collants-femme.png', iconType: 'image-png', order: 18 },
    { name: 'Foulards & Echarpes', icon: '/uploads/categories/vetements/level3/foulards-echarpes-femme.png', iconType: 'image-png', order: 19 },
    { name: 'Ceintures', icon: '/uploads/categories/vetements/level3/ceintures-femme.png', iconType: 'image-png', order: 20 },
    { name: 'Gants', icon: '/uploads/categories/vetements/level3/gants-femme.png', iconType: 'image-png', order: 21 },
    { name: 'Autre', icon: '/uploads/categories/vetements/level3/autre-vetements-femme.png', iconType: 'image-png', order: 22 }
  ],
  'Chaussures Homme': [
    { name: 'Basquettes', icon: '/uploads/categories/vetements/level3/basquettes-homme.png', iconType: 'image-png', order: 1 },
    { name: 'Bottes', icon: '/uploads/categories/vetements/level3/bottes-homme.png', iconType: 'image-png', order: 2 },
    { name: 'Classiques', icon: '/uploads/categories/vetements/level3/classiques-homme.png', iconType: 'image-png', order: 3 },
    { name: 'Mocassins', icon: '/uploads/categories/vetements/level3/mocassins-homme.png', iconType: 'image-png', order: 4 },
    { name: 'Sandales', icon: '/uploads/categories/vetements/level3/sandales-homme.png', iconType: 'image-png', order: 5 },
    { name: 'Tangues & Pantoufles', icon: '/uploads/categories/vetements/level3/tangues-pantoufles-homme.png', iconType: 'image-png', order: 6 },
    { name: 'Autre', icon: '/uploads/categories/vetements/level3/autre-chaussures-homme.png', iconType: 'image-png', order: 7 }
  ],
  'Chaussures Femme': [
    { name: 'Basquettes', icon: '/uploads/categories/vetements/level3/basquettes-femme.png', iconType: 'image-png', order: 1 },
    { name: 'Sandales', icon: '/uploads/categories/vetements/level3/sandales-femme.png', iconType: 'image-png', order: 2 },
    { name: 'Bottes', icon: '/uploads/categories/vetements/level3/bottes-femme.png', iconType: 'image-png', order: 3 },
    { name: 'Escarpins', icon: '/uploads/categories/vetements/level3/escarpins-femme.png', iconType: 'image-png', order: 4 },
    { name: 'Ballerines', icon: '/uploads/categories/vetements/level3/ballerines-femme.png', iconType: 'image-png', order: 5 },
    { name: 'Tangues & Pantoufles', icon: '/uploads/categories/vetements/level3/tangues-pantoufles-femme.png', iconType: 'image-png', order: 6 },
    { name: 'Autre', icon: '/uploads/categories/vetements/level3/autre-chaussures-femme.png', iconType: 'image-png', order: 7 }
  ],
  'Garçons': [
    { name: 'Chaussures', icon: '/uploads/categories/vetements/level3/chaussures-garcons.png', iconType: 'image-png', order: 1 },
    { name: 'Hauts & Chemises', icon: '/uploads/categories/vetements/level3/hauts-chemises-garcons.png', iconType: 'image-png', order: 2 },
    { name: 'Pantalons & Shorts', icon: '/uploads/categories/vetements/level3/pantalons-shorts-garcons.png', iconType: 'image-png', order: 3 },
    { name: 'Vestes & Gilets', icon: '/uploads/categories/vetements/level3/vestes-gilets-garcons.png', iconType: 'image-png', order: 4 },
    { name: 'Costumes', icon: '/uploads/categories/vetements/level3/costumes-garcons.png', iconType: 'image-png', order: 5 },
    { name: 'Survetements & Joggings', icon: '/uploads/categories/vetements/level3/survetements-joggings-garcons.png', iconType: 'image-png', order: 6 },
    { name: 'Pyjamas', icon: '/uploads/categories/vetements/level3/pyjamas-garcons.png', iconType: 'image-png', order: 7 },
    { name: 'Sous-vêtements', icon: '/uploads/categories/vetements/level3/sous-vetements-garcons.png', iconType: 'image-png', order: 8 },
    { name: 'Maillots de bain', icon: '/uploads/categories/vetements/level3/maillots-bain-garcons.png', iconType: 'image-png', order: 9 },
    { name: 'Kamiss', icon: '/uploads/categories/vetements/level3/kamiss-garcons.png', iconType: 'image-png', order: 10 },
    { name: 'Casquettes & Chapeaux', icon: '/uploads/categories/vetements/level3/casquettes-chapeaux-garcons.png', iconType: 'image-png', order: 11 },
    { name: 'Autre', icon: '/uploads/categories/vetements/level3/autre-garcons.png', iconType: 'image-png', order: 12 }
  ],
  'Filles': [
    { name: 'Chaussures', icon: '/uploads/categories/vetements/level3/chaussures-filles.png', iconType: 'image-png', order: 1 },
    { name: 'Hauts & Chemises', icon: '/uploads/categories/vetements/level3/hauts-chemises-filles.png', iconType: 'image-png', order: 2 },
    { name: 'Pantalons & Shorts', icon: '/uploads/categories/vetements/level3/pantalons-shorts-filles.png', iconType: 'image-png', order: 3 },
    { name: 'Vestes & Gilets', icon: '/uploads/categories/vetements/level3/vestes-gilets-filles.png', iconType: 'image-png', order: 4 },
    { name: 'Robes', icon: '/uploads/categories/vetements/level3/robes-filles.png', iconType: 'image-png', order: 5 },
    { name: 'Jupes', icon: '/uploads/categories/vetements/level3/jupes-filles.png', iconType: 'image-png', order: 6 },
    { name: 'Ensembles', icon: '/uploads/categories/vetements/level3/ensembles-filles.png', iconType: 'image-png', order: 7 },
    { name: 'Joggings & Survetements', icon: '/uploads/categories/vetements/level3/joggings-survetements-filles.png', iconType: 'image-png', order: 8 },
    { name: 'Pyjamas', icon: '/uploads/categories/vetements/level3/pyjamas-filles.png', iconType: 'image-png', order: 9 },
    { name: 'Sous-vêtements', icon: '/uploads/categories/vetements/level3/sous-vetements-filles.png', iconType: 'image-png', order: 10 },
    { name: 'Leggings & Collants', icon: '/uploads/categories/vetements/level3/leggings-collants-filles.png', iconType: 'image-png', order: 11 },
    { name: 'Maillots de bain', icon: '/uploads/categories/vetements/level3/maillots-bain-filles.png', iconType: 'image-png', order: 12 },
    { name: 'Casquettes & Chapeaux', icon: '/uploads/categories/vetements/level3/casquettes-chapeaux-filles.png', iconType: 'image-png', order: 13 },
    { name: 'Autre', icon: '/uploads/categories/vetements/level3/autre-filles.png', iconType: 'image-png', order: 14 }
  ],
  'Bébé': [
    { name: 'Vêtements', icon: '/uploads/categories/vetements/level3/vetements-bebe.png', iconType: 'image-png', order: 1 },
    { name: 'Chaussures', icon: '/uploads/categories/vetements/level3/chaussures-bebe.png', iconType: 'image-png', order: 2 },
    { name: 'Accessoires', icon: '/uploads/categories/vetements/level3/accessoires-bebe.png', iconType: 'image-png', order: 3 }
  ],
  'Sacs & Valises': [
    { name: 'Pochettes & Portefeuilles', icon: '/uploads/categories/vetements/level3/pochettes-portefeuilles.png', iconType: 'image-png', order: 1 },
    { name: 'Sacs à main', icon: '/uploads/categories/vetements/level3/sacs-main.png', iconType: 'image-png', order: 2 },
    { name: 'Sacs à dos', icon: '/uploads/categories/vetements/level3/sacs-dos.png', iconType: 'image-png', order: 3 },
    { name: 'Sacs professionnels', icon: '/uploads/categories/vetements/level3/sacs-professionnels.png', iconType: 'image-png', order: 4 },
    { name: 'Valises', icon: '/uploads/categories/vetements/level3/valises.png', iconType: 'image-png', order: 5 },
    { name: 'Cabas de sport', icon: '/uploads/categories/vetements/level3/cabas-sport.png', iconType: 'image-png', order: 6 },
    { name: 'Autre', icon: '/uploads/categories/vetements/level3/autre-sacs.png', iconType: 'image-png', order: 7 }
  ],
  'Montres': [
    { name: 'Hommes', icon: '/uploads/categories/vetements/level3/montres-hommes.png', iconType: 'image-png', order: 1 },
    { name: 'Femmes', icon: '/uploads/categories/vetements/level3/montres-femmes.png', iconType: 'image-png', order: 2 }
  ],
  'Lunettes': [
    { name: 'Lunettes de vue hommes', icon: '/uploads/categories/vetements/level3/lunettes-vue-hommes.png', iconType: 'image-png', order: 1 },
    { name: 'Lunettes de vue femmes', icon: '/uploads/categories/vetements/level3/lunettes-vue-femmes.png', iconType: 'image-png', order: 2 },
    { name: 'Lunettes de soleil hommes', icon: '/uploads/categories/vetements/level3/lunettes-soleil-hommes.png', iconType: 'image-png', order: 3 },
    { name: 'Lunettes de soleil femmes', icon: '/uploads/categories/vetements/level3/lunettes-soleil-femmes.png', iconType: 'image-png', order: 4 },
    { name: 'Lunettes de vue enfants', icon: '/uploads/categories/vetements/level3/lunettes-vue-enfants.png', iconType: 'image-png', order: 5 },
    { name: 'Lunettes de soleil enfants', icon: '/uploads/categories/vetements/level3/lunettes-soleil-enfants.png', iconType: 'image-png', order: 6 },
    { name: 'Accessoires', icon: '/uploads/categories/vetements/level3/accessoires-lunettes.png', iconType: 'image-png', order: 7 }
  ],
  'Bijoux': [
    { name: 'Parures', icon: '/uploads/categories/vetements/level3/parures.png', iconType: 'image-png', order: 1 },
    { name: 'Colliers & Pendentifs', icon: '/uploads/categories/vetements/level3/colliers-pendentifs.png', iconType: 'image-png', order: 2 },
    { name: 'Bracelets', icon: '/uploads/categories/vetements/level3/bracelets.png', iconType: 'image-png', order: 3 },
    { name: 'Bagues', icon: '/uploads/categories/vetements/level3/bagues.png', iconType: 'image-png', order: 4 },
    { name: 'Boucles', icon: '/uploads/categories/vetements/level3/boucles.png', iconType: 'image-png', order: 5 },
    { name: 'Chevillières', icon: '/uploads/categories/vetements/level3/chevilleres.png', iconType: 'image-png', order: 6 },
    { name: 'Piercings', icon: '/uploads/categories/vetements/level3/piercings.png', iconType: 'image-png', order: 7 },
    { name: 'Accessoires cheveux', icon: '/uploads/categories/vetements/level3/accessoires-cheveux.png', iconType: 'image-png', order: 8 },
    { name: 'Broches', icon: '/uploads/categories/vetements/level3/broches.png', iconType: 'image-png', order: 9 },
    { name: 'Autre', icon: '/uploads/categories/vetements/level3/autre-bijoux.png', iconType: 'image-png', order: 10 }
  ],

  // TÉLÉPHONES
  'Protection & Antichoc': [
    { name: 'Protections d\'écran', icon: '/uploads/categories/telephones/level3/protections-ecran.png', iconType: 'image-png', order: 1 },
    { name: 'Coques & Antichoc', icon: '/uploads/categories/telephones/level3/coques-antichoc.png', iconType: 'image-png', order: 2 },
    { name: 'Films de protection', icon: '/uploads/categories/telephones/level3/films-protection.png', iconType: 'image-png', order: 3 },
    { name: 'Étuis', icon: '/uploads/categories/telephones/level3/etuis.png', iconType: 'image-png', order: 4 },
    { name: 'Protections de caméra', icon: '/uploads/categories/telephones/level3/protections-camera.png', iconType: 'image-png', order: 5 }
  ],
  'Ecouteurs & Son': [
    { name: 'Écouteurs filaires', icon: '/uploads/categories/telephones/level3/ecouteurs-filaires.png', iconType: 'image-png', order: 1 },
    { name: 'Écouteurs Bluetooth', icon: '/uploads/categories/telephones/level3/ecouteurs-bluetooth.png', iconType: 'image-png', order: 2 },
    { name: 'Casques audio', icon: '/uploads/categories/telephones/level3/casques-audio.png', iconType: 'image-png', order: 3 },
    { name: 'Hauts-parleurs portables', icon: '/uploads/categories/telephones/level3/hauts-parleurs-portables.png', iconType: 'image-png', order: 4 },
    { name: 'Adaptateurs audio', icon: '/uploads/categories/telephones/level3/adaptateurs-audio.png', iconType: 'image-png', order: 5 }
  ],
  'Chargeurs & Câbles': [
    { name: 'Chargeurs mural', icon: '/uploads/categories/telephones/level3/chargeurs-mur.png', iconType: 'image-png', order: 1 },
    { name: 'Chargeurs voiture', icon: '/uploads/categories/telephones/level3/chargeurs-voiture.png', iconType: 'image-png', order: 2 },
    { name: 'Chargeurs sans fil', icon: '/uploads/categories/telephones/level3/chargeurs-sans-fil.png', iconType: 'image-png', order: 3 },
    { name: 'Câbles USB', icon: '/uploads/categories/telephones/level3/cables-usb.png', iconType: 'image-png', order: 4 },
    { name: 'Câbles Lightning', icon: '/uploads/categories/telephones/level3/cables-lightning.png', iconType: 'image-png', order: 5 },
    { name: 'Câbles Type-C', icon: '/uploads/categories/telephones/level3/cables-type-c.png', iconType: 'image-png', order: 6 },
    { name: 'Hubs chargeurs', icon: '/uploads/categories/telephones/level3/hubs-chargeurs.png', iconType: 'image-png', order: 7 }
  ],
  'Supports & Stabilisateurs': [
    { name: 'Supports', icon: '/uploads/categories/telephones/level3/supports.png', iconType: 'image-png', order: 1 },
    { name: 'Stabilisateurs', icon: '/uploads/categories/telephones/level3/stabilisateurs.png', iconType: 'image-png', order: 2 },
    { name: 'Barres de selfies', icon: '/uploads/categories/telephones/level3/barres-selfies.png', iconType: 'image-png', order: 3 },
    { name: 'Pieds pour téléphone', icon: '/uploads/categories/telephones/level3/pieds-telephone.png', iconType: 'image-png', order: 4 },
    { name: 'Ventouses voiture', icon: '/uploads/categories/telephones/level3/ventouses-voiture.png', iconType: 'image-png', order: 5 }
  ],
  'Manettes': [
    { name: 'Manettes Bluetooth', icon: '/uploads/categories/telephones/level3/manettes-bluetooth.png', iconType: 'image-png', order: 1 },
    { name: 'Manettes filaires', icon: '/uploads/categories/telephones/level3/manettes-filaires.png', iconType: 'image-png', order: 2 },
    { name: 'Manettes pour téléphone', icon: '/uploads/categories/telephones/level3/manettes-telephone.png', iconType: 'image-png', order: 3 },
    { name: 'Manettes pour tablette', icon: '/uploads/categories/telephones/level3/manettes-tablette.png', iconType: 'image-png', order: 4 },
    { name: 'Accessoires pour manettes', icon: '/uploads/categories/telephones/level3/accessoires-manettes.png', iconType: 'image-png', order: 5 }
  ],
  'VR': [
    { name: 'Casques VR', icon: '/uploads/categories/telephones/level3/casques-vr.png', iconType: 'image-png', order: 1 },
    { name: 'Lunettes VR', icon: '/uploads/categories/telephones/level3/lunettes-vr.png', iconType: 'image-png', order: 2 },
    { name: 'Accessoires VR', icon: '/uploads/categories/telephones/level3/accessoires-vr.png', iconType: 'image-png', order: 3 },
    { name: 'Contrôleurs VR', icon: '/uploads/categories/telephones/level3/controleurs-vr.png', iconType: 'image-png', order: 4 },
    { name: 'Jeux VR', icon: '/uploads/categories/telephones/level3/jeux-vr.png', iconType: 'image-png', order: 5 }
  ],
  'Power banks': [
    { name: 'Power bank 10,000mAh', icon: '/uploads/categories/telephones/level3/power-bank-10000mah.png', iconType: 'image-png', order: 1 },
    { name: 'Power bank 20,000mAh', icon: '/uploads/categories/telephones/level3/power-bank-20000mah.png', iconType: 'image-png', order: 2 },
    { name: 'Power bank solaire', icon: '/uploads/categories/telephones/level3/power-bank-solaire.png', iconType: 'image-png', order: 3 },
    { name: 'Power bank charge rapide', icon: '/uploads/categories/telephones/level3/power-bank-rapide.png', iconType: 'image-png', order: 4 },
    { name: 'Power bank compact', icon: '/uploads/categories/telephones/level3/power-bank-compact.png', iconType: 'image-png', order: 5 }
  ],
  'Stylets': [
    { name: 'Stylets actifs', icon: '/uploads/categories/telephones/level3/stylets-actifs.png', iconType: 'image-png', order: 1 },
    { name: 'Stylets passifs', icon: '/uploads/categories/telephones/level3/stylets-passifs.png', iconType: 'image-png', order: 2 },
    { name: 'Stylets Bluetooth', icon: '/uploads/categories/telephones/level3/stylets-bluetooth.png', iconType: 'image-png', order: 3 },
    { name: 'Stylets pour tablette', icon: '/uploads/categories/telephones/level3/stylets-tablette.png', iconType: 'image-png', order: 4 },
    { name: 'Recharges pour stylet', icon: '/uploads/categories/telephones/level3/recharges-stylet.png', iconType: 'image-png', order: 5 }
  ],
  'Cartes Mémoire': [
    { name: 'Cartes SD', icon: '/uploads/categories/telephones/level3/sd-cards.png', iconType: 'image-png', order: 1 },
    { name: 'Cartes Micro SD', icon: '/uploads/categories/telephones/level3/micro-sd-cards.png', iconType: 'image-png', order: 2 },
    { name: 'Cartes SDHC', icon: '/uploads/categories/telephones/level3/sdhc-cards.png', iconType: 'image-png', order: 3 },
    { name: 'Cartes SDXC', icon: '/uploads/categories/telephones/level3/sdxc-cards.png', iconType: 'image-png', order: 4 },
    { name: 'Adaptateurs de carte', icon: '/uploads/categories/telephones/level3/adaptateurs-carte.png', iconType: 'image-png', order: 5 },
    { name: 'Lecteurs de carte', icon: '/uploads/categories/telephones/level3/lecteurs-carte.png', iconType: 'image-png', order: 6 }
  ],

  // IMMOBILIER
  'Vente': [
    { name: 'Appartement', icon: '/uploads/categories/immobilier/level3/appartement.png', iconType: 'image-png', order: 1 },
    { name: 'Local', icon: '/uploads/categories/immobilier/level3/local.png', iconType: 'image-png', order: 2 },
    { name: 'Villa', icon: '/uploads/categories/immobilier/level3/villa.png', iconType: 'image-png', order: 3 },
    { name: 'Terrain', icon: '/uploads/categories/immobilier/level3/terrain.png', iconType: 'image-png', order: 4 },
    { name: 'Terrain Agricole', icon: '/uploads/categories/immobilier/level3/terrain-agricole.png', iconType: 'image-png', order: 5 },
    { name: 'Immeuble', icon: '/uploads/categories/immobilier/level3/immeuble.png', iconType: 'image-png', order: 6 },
    { name: 'Bungalow', icon: '/uploads/categories/immobilier/level3/bungalow.png', iconType: 'image-png', order: 7 },
    { name: 'Hangar - Usine', icon: '/uploads/categories/immobilier/level3/hangar-usine.png', iconType: 'image-png', order: 8 },
    { name: 'Autre', icon: '/uploads/categories/immobilier/level3/autre.png', iconType: 'image-png', order: 9 }
  ],
  'Location': [
    { name: 'Appartement', icon: '/uploads/categories/immobilier/level3/appartement-location.png', iconType: 'image-png', order: 1 },
    { name: 'Local', icon: '/uploads/categories/immobilier/level3/local-location.png', iconType: 'image-png', order: 2 },
    { name: 'Villa', icon: '/uploads/categories/immobilier/level3/villa-location.png', iconType: 'image-png', order: 3 },
    { name: 'Immeuble', icon: '/uploads/categories/immobilier/level3/immeuble-location.png', iconType: 'image-png', order: 4 },
    { name: 'Bungalow', icon: '/uploads/categories/immobilier/level3/bungalow-location.png', iconType: 'image-png', order: 5 },
    { name: 'Autre', icon: '/uploads/categories/immobilier/level3/autre-location.png', iconType: 'image-png', order: 6 }
  ],
  'Location vacances': [
    { name: 'Appartement', icon: '/uploads/categories/immobilier/level3/appartement-vacances.png', iconType: 'image-png', order: 1 },
    { name: 'Villa', icon: '/uploads/categories/immobilier/level3/villa-vacances.png', iconType: 'image-png', order: 2 },
    { name: 'Bungalow', icon: '/uploads/categories/immobilier/level3/bungalow-vacances.png', iconType: 'image-png', order: 3 },
    { name: 'Autre', icon: '/uploads/categories/immobilier/level3/autre-vacances.png', iconType: 'image-png', order: 4 }
  ],
  'Cherche location': [
    { name: 'Appartement', icon: '/uploads/categories/immobilier/level3/appartement-cherche-location.png', iconType: 'image-png', order: 1 },
    { name: 'Local', icon: '/uploads/categories/immobilier/level3/local-cherche-location.png', iconType: 'image-png', order: 2 },
    { name: 'Villa', icon: '/uploads/categories/immobilier/level3/villa-cherche-location.png', iconType: 'image-png', order: 3 },
    { name: 'Immeuble', icon: '/uploads/categories/immobilier/level3/immeuble-cherche-location.png', iconType: 'image-png', order: 4 },
    { name: 'Bungalow', icon: '/uploads/categories/immobilier/level3/bungalow-cherche-location.png', iconType: 'image-png', order: 5 },
    { name: 'Autre', icon: '/uploads/categories/immobilier/level3/autre-cherche-location.png', iconType: 'image-png', order: 6 }
  ],
  'Cherche achat': [
    { name: 'Appartement', icon: '/uploads/categories/immobilier/level3/appartement-cherche-achat.png', iconType: 'image-png', order: 1 },
    { name: 'Local', icon: '/uploads/categories/immobilier/level3/local-cherche-achat.png', iconType: 'image-png', order: 2 },
    { name: 'Villa', icon: '/uploads/categories/immobilier/level3/villa-cherche-achat.png', iconType: 'image-png', order: 3 },
    { name: 'Terrain', icon: '/uploads/categories/immobilier/level3/terrain-cherche-achat.png', iconType: 'image-png', order: 4 },
    { name: 'Terrain Agricole', icon: '/uploads/categories/immobilier/level3/terrain-agricole-cherche-achat.png', iconType: 'image-png', order: 5 },
    { name: 'Immeuble', icon: '/uploads/categories/immobilier/level3/immeuble-cherche-achat.png', iconType: 'image-png', order: 6 },
    { name: 'Bungalow', icon: '/uploads/categories/immobilier/level3/bungalow-cherche-achat.png', iconType: 'image-png', order: 7 },
    { name: 'Hangar - Usine', icon: '/uploads/categories/immobilier/level3/hangar-usine-cherche-achat.png', iconType: 'image-png', order: 8 },
    { name: 'Autre', icon: '/uploads/categories/immobilier/level3/autre-cherche-achat.png', iconType: 'image-png', order: 9 }
  ],

  // ÉLECTROMÉNAGER
  'Réfrigérateurs & Congélateurs': [
    { name: 'Réfrigérateur', icon: '/uploads/categories/electromenager/level3/refrigerateur.png', iconType: 'image-png', order: 1 },
    { name: 'Congélateur', icon: '/uploads/categories/electromenager/level3/congelateur.png', iconType: 'image-png', order: 2 },
    { name: 'Réfrigérateur-Congélateur', icon: '/uploads/categories/electromenager/level3/refrigerateur-congelateur.png', iconType: 'image-png', order: 3 },
    { name: 'Cave à vin', icon: '/uploads/categories/electromenager/level3/cave-vin.png', iconType: 'image-png', order: 4 }
  ],
  'Machines à laver': [
    { name: 'Lave-linge', icon: '/uploads/categories/electromenager/level3/lave-linge.png', iconType: 'image-png', order: 1 },
    { name: 'Sèche-linge', icon: '/uploads/categories/electromenager/level3/seche-linge.png', iconType: 'image-png', order: 2 },
    { name: 'Lave-linge/Sèche-linge', icon: '/uploads/categories/electromenager/level3/lave-linge-seche-linge.png', iconType: 'image-png', order: 3 },
    { name: 'Lave-linge avec essorage', icon: '/uploads/categories/electromenager/level3/lave-linge-essorage.png', iconType: 'image-png', order: 4 }
  ],
  'Lave-vaisselles': [
    { name: 'Lave-vaisselle encastrable', icon: '/uploads/categories/electromenager/level3/lave-vaisselle-encastrable.png', iconType: 'image-png', order: 1 },
    { name: 'Lave-vaisselle pose libre', icon: '/uploads/categories/electromenager/level3/lave-vaisselle-pose-libre.png', iconType: 'image-png', order: 2 },
    { name: 'Lave-vaisselle compact', icon: '/uploads/categories/electromenager/level3/lave-vaisselle-compact.png', iconType: 'image-png', order: 3 }
  ],
  'Fours & Cuisson': [
    { name: 'Four électrique', icon: '/uploads/categories/electromenager/level3/four-electrique.png', iconType: 'image-png', order: 1 },
    { name: 'Four à gaz', icon: '/uploads/categories/electromenager/level3/four-gaz.png', iconType: 'image-png', order: 2 },
    { name: 'Four micro-ondes', icon: '/uploads/categories/electromenager/level3/four-micro-ondes.png', iconType: 'image-png', order: 3 },
    { name: 'Plaque de cuisson', icon: '/uploads/categories/electromenager/level3/plaque-cuisson.png', iconType: 'image-png', order: 4 },
    { name: 'Cuisinière', icon: '/uploads/categories/electromenager/level3/cuisiniere.png', iconType: 'image-png', order: 5 }
  ],
  'Chauffage & Climatisation': [
    { name: 'Climatiseur', icon: '/uploads/categories/electromenager/level3/climatiseur.png', iconType: 'image-png', order: 1 },
    { name: 'Ventilateur', icon: '/uploads/categories/electromenager/level3/ventilateur.png', iconType: 'image-png', order: 2 },
    { name: 'Radiateur', icon: '/uploads/categories/electromenager/level3/radiateur.png', iconType: 'image-png', order: 3 },
    { name: 'Chauffe-eau', icon: '/uploads/categories/electromenager/level3/chauffe-eau.png', iconType: 'image-png', order: 4 },
    { name: 'Pompe à chaleur', icon: '/uploads/categories/electromenager/level3/pompe-chaleur.png', iconType: 'image-png', order: 5 }
  ],
  'Appareils de cuisine': [
    { name: 'Robot de cuisine', icon: '/uploads/categories/electromenager/level3/robot-cuisine.png', iconType: 'image-png', order: 1 },
    { name: 'Mixeur', icon: '/uploads/categories/electromenager/level3/mixeur.png', iconType: 'image-png', order: 2 },
    { name: 'Bouilloire', icon: '/uploads/categories/electromenager/level3/bouilloire.png', iconType: 'image-png', order: 3 },
    { name: 'Cafetière', icon: '/uploads/categories/electromenager/level3/cafetiere.png', iconType: 'image-png', order: 4 },
    { name: 'Grille-pain', icon: '/uploads/categories/electromenager/level3/grille-pain.png', iconType: 'image-png', order: 5 }
  ]
};

// ============================================
// FUNCIÓN PRINCIPAL DE SEEDING (SIN CAMBIOS)
// ============================================
const seedCategories = async () => {
  try {
    console.log('🚀 INICIANDO SEED COMPLETO DE 5 CATEGORÍAS REALES\n');
    console.log('='.repeat(80));
    
    // Limpiar colección existente
    console.log('🧹 Paso 1: Limpiando colección existente...');
    const result = await Category.deleteMany({});
    console.log(`   ✅ Eliminadas ${result.deletedCount} categorías anteriores\n`);
    
    // Insertar categorías principales (Nivel 1)
    console.log('📦 Paso 2: Insertando categorías principales (Nivel 1)...');
    const mainCategories = {};
    const allSlugs = new Set();
    
    for (const categoryData of categoriesData) {
      allSlugs.add(categoryData.slug);
      const category = new Category({
        ...categoryData,
        path: `/${categoryData.slug}`,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const savedCategory = await category.save();
      mainCategories[categoryData.name] = savedCategory._id;
      console.log(`   ✅ ${categoryData.name} → ${categoryData.slug} (${categoryData.icon})`);
    }

    // Función recursiva para insertar hijos
    const insertChildren = async (parentId, parentName, childrenData, level, parentPath = '') => {
      const parentCategory = await Category.findById(parentId);
      const childIds = [];
      
      for (const child of childrenData) {
        const slug = createUniqueSlug(child.name, allSlugs);
        const childPath = `${parentCategory.path}/${slug}`;
        
        // Verificar si tiene hijos (artículos) según el nivel
        const hasMoreChildren = level === 2 && child.hasSublevel;
        
        const childCategory = new Category({
          name: child.name,
          slug: slug,
          level: level,
          parent: parentId,
          ancestors: [...parentCategory.ancestors, parentId],
          path: childPath,
          icon: child.icon,
          iconType: child.iconType || 'image-png',
          iconColor: child.iconColor || parentCategory.iconColor,
          bgColor: child.bgColor || parentCategory.bgColor,
          order: child.order || 0,
          isLeaf: !hasMoreChildren,
          hasChildren: !!hasMoreChildren,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        
        const savedChild = await childCategory.save();
        childIds.push(savedChild._id);
        
        // Insertar nivel 3 si existe
        if (hasMoreChildren && articlesData[child.name]) {
          console.log(`      📁 Insertando ${articlesData[child.name].length} artículos para: ${child.name}`);
          await insertChildren(savedChild._id, child.name, articlesData[child.name], 3, childPath);
        }
      }
      
      // Actualizar parent si tiene hijos
      if (childIds.length > 0) {
        parentCategory.hasChildren = true;
        await parentCategory.save();
      }
      
      return childIds;
    };

    // Insertar TODAS las categorías jerárquicas
    console.log('\n📁 Paso 3: Insertando subcategorías y artículos...\n');
    
    for (const [mainCatName, subcats] of Object.entries(subcategoriesData)) {
      console.log(`   🔌 ${mainCatName}:`);
      const parentId = mainCategories[mainCatName];
      
      if (parentId && subcats.length > 0) {
        await insertChildren(parentId, mainCatName, subcats, 2);
      } else {
        console.log(`   ⚠️  No se encontró parent para ${mainCatName}`);
      }
    }

    // Mostrar resumen final
    console.log('\n' + '='.repeat(80));
    console.log('🎉 ¡SEED COMPLETADO EXITOSAMENTE!');
    console.log('='.repeat(80) + '\n');
    
    const totalCategories = await Category.countDocuments();
    const level1 = await Category.countDocuments({ level: 1 });
    const level2 = await Category.countDocuments({ level: 2 });
    const level3 = await Category.countDocuments({ level: 3 });
    
    console.log('📊 ESTADÍSTICAS FINALES:');
    console.log('   • Categorías principales (Nivel 1):', level1);
    console.log('   • Subcategorías (Nivel 2):', level2);
    console.log('   • Artículos (Nivel 3):', level3);
    console.log('   • Total de categorías en BD:', totalCategories);
    
    console.log('\n📁 ESTRUCTURA COMPLETA DE CARPETAS PARA IMÁGENES:');
    console.log('public/uploads/categories/');
    console.log('├── vetements/');
    console.log('│   ├── level1/ (1 imagen)');
    console.log('│   ├── level2/ (12 imágenes)');
    console.log('│   └── level3/ (141 imágenes)');
    console.log('├── telephones/');
    console.log('│   ├── level1/ (1 imagen)');
    console.log('│   ├── level2/ (18 imágenes)');
    console.log('│   └── level3/ (46 imágenes)');
    console.log('├── immobilier/');
    console.log('│   ├── level1/ (1 imagen)');
    console.log('│   ├── level2/ (5 imágenes)');
    console.log('│   └── level3/ (34 imágenes)');
    console.log('├── electromenager/');
    console.log('│   ├── level1/ (1 imagen)');
    console.log('│   ├── level2/ (21 imágenes)');
    console.log('│   └── level3/ (25 imágenes)');
    console.log('└── vehicules/');
    console.log('    ├── level1/ (1 imagen)');
    console.log('    └── level2/ (11 imágenes) // No tiene level3');
    
    console.log('\n📋 TOTAL DE IMÁGENES REQUERIDAS:');
    console.log('   • Nivel 1: 5 imágenes principales');
    console.log('   • Nivel 2: 67 imágenes de subcategorías');
    console.log('   • Nivel 3: 246 imágenes de artículos');
    console.log('   • Total: 318 imágenes PNG');
    
    console.log('\n🎯 EJEMPLO DE JERARQUÍA CREADA:');
    console.log('   Vêtements');
    console.log('   └── Vêtements Homme');
    console.log('       ├── Hauts & Chemises');
    console.log('       ├── Jeans & Pantalons');
    console.log('       └── ... (16 artículos)');
    console.log('   Immobilier');
    console.log('   └── Vente');
    console.log('       ├── Appartement');
    console.log('       ├── Villa');
    console.log('       └── ... (9 artículos)');
    
    console.log('\n📍 URLs generadas para ejemplo:');
    console.log('   • /category/vetements');
    console.log('   • /category/vetements/vetements-homme');
    console.log('   • /category/vetements/vetements-homme/hauts-chemises');
    console.log('   • /category/immobilier/vente');
    console.log('   • /category/immobilier/vente/appartement');
    
    // Mostrar algunos ejemplos
    console.log('\n🔍 EJEMPLOS DE ARTÍCULOS NIVEL 3 INSERTADOS:');
    const level3Samples = await Category.find({ level: 3 })
      .sort({ name: 1 })
      .limit(5)
      .select('name slug icon path');
    
    level3Samples.forEach(article => {
      console.log(`   • ${article.name} → ${article.icon}`);
    });
    
    console.log('\n✅ Nota: Las imágenes pueden ser placeholders durante desarrollo.');
    console.log('🔥 Para producción, reemplaza con imágenes reales en las rutas especificadas.');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ ERROR CRÍTICO:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

// Ejecutar el seed
// Nota: No necesitas llamar seedCategories() aquí ya que se ejecuta en db.once('open')