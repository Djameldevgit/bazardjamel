// seedCategoriesWithImages.js - SEED COMPLETO CON 16 CATEGORÍAS
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

const categoriesData = [
  {
    name: 'Immobilier',
    slug: 'immobilier',
    level: 1,
    icon: '/uploads/categories/immobilier/level1/immobilier.png',
    iconType: 'image-png',
    iconColor: '#4CAF50',
    bgColor: '#E8F5E9',
    order: 1,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Automobiles & Véhicules',
    slug: 'automobiles-vehicules',
    level: 1,
    icon: '/uploads/categories/automobiles/level1/automobiles.png',
    iconType: 'image-png',
    iconColor: '#9C27B0',
    bgColor: '#F3E5F5',
    order: 2,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Pièces détachées',
    slug: 'pieces-detachees',
    level: 1,
    icon: '/uploads/categories/pieces-detachees/level1/pieces-detachees.png',
    iconType: 'image-png',
    iconColor: '#795548',
    bgColor: '#EFEBE9',
    order: 3,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Téléphones & Accessoires',
    slug: 'telephones-accessoires',
    level: 1,
    icon: '/uploads/categories/telephones/level1/telephones.png',
    iconType: 'image-png',
    iconColor: '#2196F3',
    bgColor: '#E3F2FD',
    order: 4,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Informatique',
    slug: 'informatique',
    level: 1,
    icon: '/uploads/categories/informatique/level1/informatique.png',
    iconType: 'image-png',
    iconColor: '#1E88E5',
    bgColor: '#E3F2FD',
    order: 5,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Électroménager & Électronique',
    slug: 'electromenager-electronique',
    level: 1,
    icon: '/uploads/categories/electromenager/level1/electromenager.png',
    iconType: 'image-png',
    iconColor: '#FF9800',
    bgColor: '#FFF3E0',
    order: 6,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Vêtements & Mode',
    slug: 'vetements-mode',
    level: 1,
    icon: '/uploads/categories/vetements/level1/vetements.png',
    iconType: 'image-png',
    iconColor: '#F44336',
    bgColor: '#FFEBEE',
    order: 7,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Santé & Beauté',
    slug: 'sante-beaute',
    level: 1,
    icon: '/uploads/categories/sante-beaute/level1/sante-beaute.png',
    iconType: 'image-png',
    iconColor: '#E91E63',
    bgColor: '#FCE4EC',
    order: 8,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Meubles & Maison',
    slug: 'meubles-maison',
    level: 1,
    icon: '/uploads/categories/meubles/level1/meubles.png',
    iconType: 'image-png',
    iconColor: '#8D6E63',
    bgColor: '#EFEBE9',
    order: 9,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Loisirs & Divertissements',
    slug: 'loisirs-divertissements',
    level: 1,
    icon: '/uploads/categories/loisirs/level1/loisirs.png',
    iconType: 'image-png',
    iconColor: '#673AB7',
    bgColor: '#EDE7F6',
    order: 10,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Offres & Demandes d\'emploi',
    slug: 'offres-demandes-emploi',
    level: 1,
    icon: '/uploads/categories/emploi/level1/emploi.png',
    iconType: 'image-png',
    iconColor: '#009688',
    bgColor: '#E0F2F1',
    order: 11,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Sport',
    slug: 'sport',
    level: 1,
    icon: '/uploads/categories/sport/level1/sport.png',
    iconType: 'image-png',
    iconColor: '#FF5722',
    bgColor: '#FFF3E0',
    order: 12,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Alimentaires',
    slug: 'alimentaires',
    level: 1,
    icon: '/uploads/categories/alimentaires/level1/alimentaires.png',
    iconType: 'image-png',
    iconColor: '#FF9800',
    bgColor: '#FFF3E0',
    order: 13,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Matériaux & Équipement',
    slug: 'materiaux-equipement',
    level: 1,
    icon: '/uploads/categories/materiaux/level1/materiaux.png',
    iconType: 'image-png',
    iconColor: '#795548',
    bgColor: '#EFEBE9',
    order: 14,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Services',
    slug: 'services',
    level: 1,
    icon: '/uploads/categories/services/level1/services.png',
    iconType: 'image-png',
    iconColor: '#4CAF50',
    bgColor: '#E8F5E9',
    order: 15,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Voyages',
    slug: 'voyages',
    level: 1,
    icon: '/uploads/categories/voyages/level1/voyages.png',
    iconType: 'image-png',
    iconColor: '#2196F3',
    bgColor: '#E3F2FD',
    order: 16,
    isLeaf: false,
    hasChildren: true,
  }
];

// ============================================
// NIVEL 2 - SUBCATEGORÍAS (Actualizado con nuevos nombres)
// ============================================

const subcategoriesData = {
  'Immobilier': [
    { name: 'Vente', icon: '/uploads/categories/immobilier/level2/vente.png', iconType: 'image-png', iconColor: '#FFD166', order: 1, hasSublevel: true },
    { name: 'Location', icon: '/uploads/categories/immobilier/level2/location.png', iconType: 'image-png', iconColor: '#FFD166', order: 2, hasSublevel: true },
    { name: 'Location vacances', icon: '/uploads/categories/immobilier/level2/location-vacances.png', iconType: 'image-png', iconColor: '#FFD166', order: 3, hasSublevel: true },
    { name: 'Cherche location', icon: '/uploads/categories/immobilier/level2/cherche-location.png', iconType: 'image-png', iconColor: '#FFD166', order: 4, hasSublevel: true },
    { name: 'Cherche achat', icon: '/uploads/categories/immobilier/level2/cherche-achat.png', iconType: 'image-png', iconColor: '#FFD166', order: 5, hasSublevel: true }
  ],
  
  'Automobiles & Véhicules': [
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
  ],

  'Pièces détachées': [
    { name: 'Pièces automobiles', icon: '/uploads/categories/pieces-detachees/level2/pieces-automobiles.png', iconType: 'image-png', iconColor: '#795548', order: 1, hasSublevel: true },
    { name: 'Pièces moto', icon: '/uploads/categories/pieces-detachees/level2/pieces-moto.png', iconType: 'image-png', iconColor: '#795548', order: 2, hasSublevel: true },
    { name: 'Pièces bateaux', icon: '/uploads/categories/pieces-detachees/level2/pieces-bateaux.png', iconType: 'image-png', iconColor: '#795548', order: 3, hasSublevel: true },
    { name: 'Alarme & Sécurité', icon: '/uploads/categories/pieces-detachees/level2/alarme-securite.png', iconType: 'image-png', iconColor: '#795548', order: 4, hasSublevel: false },
    { name: 'Nettoyage & Entretien', icon: '/uploads/categories/pieces-detachees/level2/nettoyage-entretien.png', iconType: 'image-png', iconColor: '#795548', order: 5, hasSublevel: false },
    { name: 'Outils de diagnostics', icon: '/uploads/categories/pieces-detachees/level2/outils-diagnostics.png', iconType: 'image-png', iconColor: '#795548', order: 6, hasSublevel: false },
    { name: 'Lubrifiants', icon: '/uploads/categories/pieces-detachees/level2/lubrifiants.png', iconType: 'image-png', iconColor: '#795548', order: 7, hasSublevel: false },
    { name: 'Pièces véhicules', icon: '/uploads/categories/pieces-detachees/level2/pieces-vehicules.png', iconType: 'image-png', iconColor: '#795548', order: 8, hasSublevel: false },
    { name: 'Autres pièces', icon: '/uploads/categories/pieces-detachees/level2/autres-pieces.png', iconType: 'image-png', iconColor: '#795548', order: 9, hasSublevel: false }
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

  'Informatique': [
    { name: 'Ordinateurs portables', icon: '/uploads/categories/informatique/level2/ordinateurs-portables.png', iconType: 'image-png', iconColor: '#1E88E5', order: 1, hasSublevel: true },
    { name: 'Ordinateurs de bureau', icon: '/uploads/categories/informatique/level2/ordinateurs-bureau.png', iconType: 'image-png', iconColor: '#1E88E5', order: 2, hasSublevel: true },
    { name: 'Composants PC fixe', icon: '/uploads/categories/informatique/level2/composants-pc-fixe.png', iconType: 'image-png', iconColor: '#1E88E5', order: 3, hasSublevel: true },
    { name: 'Composants PC portable', icon: '/uploads/categories/informatique/level2/composants-pc-portable.png', iconType: 'image-png', iconColor: '#1E88E5', order: 4, hasSublevel: true },
    { name: 'Composants serveur', icon: '/uploads/categories/informatique/level2/composants-serveur.png', iconType: 'image-png', iconColor: '#1E88E5', order: 5, hasSublevel: true },
    { name: 'Imprimantes & Cartouches', icon: '/uploads/categories/informatique/level2/imprimantes-cartouches.png', iconType: 'image-png', iconColor: '#1E88E5', order: 6, hasSublevel: true },
    { name: 'Réseau & Connexion', icon: '/uploads/categories/informatique/level2/reseau-connexion.png', iconType: 'image-png', iconColor: '#1E88E5', order: 7, hasSublevel: true },
    { name: 'Stockage externe & Racks', icon: '/uploads/categories/informatique/level2/stockage-externe.png', iconType: 'image-png', iconColor: '#1E88E5', order: 8, hasSublevel: true },
    { name: 'Serveurs', icon: '/uploads/categories/informatique/level2/serveurs.png', iconType: 'image-png', iconColor: '#1E88E5', order: 9, hasSublevel: false },
    { name: 'Ecrans', icon: '/uploads/categories/informatique/level2/ecrans.png', iconType: 'image-png', iconColor: '#1E88E5', order: 10, hasSublevel: false },
    { name: 'Onduleurs & Stabilisateurs', icon: '/uploads/categories/informatique/level2/onduleurs-stabilisateurs.png', iconType: 'image-png', iconColor: '#1E88E5', order: 11, hasSublevel: false },
    { name: 'Compteuses de billets', icon: '/uploads/categories/informatique/level2/compteuses-billets.png', iconType: 'image-png', iconColor: '#1E88E5', order: 12, hasSublevel: false },
    { name: 'Claviers & Souris', icon: '/uploads/categories/informatique/level2/claviers-souris.png', iconType: 'image-png', iconColor: '#1E88E5', order: 13, hasSublevel: false },
    { name: 'Casques & Son', icon: '/uploads/categories/informatique/level2/casques-son.png', iconType: 'image-png', iconColor: '#1E88E5', order: 14, hasSublevel: false },
    { name: 'Webcam & Vidéoconférence', icon: '/uploads/categories/informatique/level2/webcam-videoconference.png', iconType: 'image-png', iconColor: '#1E88E5', order: 15, hasSublevel: false },
    { name: 'Data shows', icon: '/uploads/categories/informatique/level2/data-shows.png', iconType: 'image-png', iconColor: '#1E88E5', order: 16, hasSublevel: false },
    { name: 'Câbles & Adaptateurs', icon: '/uploads/categories/informatique/level2/cables-adaptateurs.png', iconType: 'image-png', iconColor: '#1E88E5', order: 17, hasSublevel: false },
    { name: 'Stylets & Tablettes', icon: '/uploads/categories/informatique/level2/stylers-tablettes.png', iconType: 'image-png', iconColor: '#1E88E5', order: 18, hasSublevel: false },
    { name: 'Cartables & Sacoches', icon: '/uploads/categories/informatique/level2/cartables-sacoches.png', iconType: 'image-png', iconColor: '#1E88E5', order: 19, hasSublevel: false },
    { name: 'Manettes & Simulateurs', icon: '/uploads/categories/informatique/level2/manettes-simulateurs.png', iconType: 'image-png', iconColor: '#1E88E5', order: 20, hasSublevel: false },
    { name: 'VR', icon: '/uploads/categories/informatique/level2/vr.png', iconType: 'image-png', iconColor: '#1E88E5', order: 21, hasSublevel: false },
    { name: 'Logiciels & Abonnements', icon: '/uploads/categories/informatique/level2/logiciels-abonnements.png', iconType: 'image-png', iconColor: '#1E88E5', order: 22, hasSublevel: false },
    { name: 'Bureautique', icon: '/uploads/categories/informatique/level2/bureautique.png', iconType: 'image-png', iconColor: '#1E88E5', order: 23, hasSublevel: false },
    { name: 'Autre Informatique', icon: '/uploads/categories/informatique/level2/autre-informatique.png', iconType: 'image-png', iconColor: '#1E88E5', order: 24, hasSublevel: false }
  ],

  'Électroménager & Électronique': [
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

  'Vêtements & Mode': [
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

  'Santé & Beauté': [
    { name: 'Cosmétiques & Beauté', icon: '/uploads/categories/sante-beaute/level2/cosmetiques-beaute.png', iconType: 'image-png', iconColor: '#E91E63', order: 1, hasSublevel: true },
    { name: 'Parapharmacie & Santé', icon: '/uploads/categories/sante-beaute/level2/parapharmacie-sante.png', iconType: 'image-png', iconColor: '#E91E63', order: 2, hasSublevel: true },
    { name: 'Parfums et déodorants femme', icon: '/uploads/categories/sante-beaute/level2/parfums-deodorants-femme.png', iconType: 'image-png', iconColor: '#E91E63', order: 3, hasSublevel: false },
    { name: 'Parfums et déodorants homme', icon: '/uploads/categories/sante-beaute/level2/parfums-deodorants-homme.png', iconType: 'image-png', iconColor: '#E91E63', order: 4, hasSublevel: false },
    { name: 'Accessoires beauté', icon: '/uploads/categories/sante-beaute/level2/accessoires-beaute.png', iconType: 'image-png', iconColor: '#E91E63', order: 5, hasSublevel: false },
    { name: 'Soins cheveux', icon: '/uploads/categories/sante-beaute/level2/soins-cheveux.png', iconType: 'image-png', iconColor: '#E91E63', order: 6, hasSublevel: false },
    { name: 'Autre Santé & Beauté', icon: '/uploads/categories/sante-beaute/level2/autre-sante-beaute.png', iconType: 'image-png', iconColor: '#E91E63', order: 7, hasSublevel: false }
  ],

  'Meubles & Maison': [
    { name: 'Salon', icon: '/uploads/categories/meubles/level2/salon.png', iconType: 'image-png', iconColor: '#8D6E63', order: 1, hasSublevel: false },
    { name: 'Chambres à coucher', icon: '/uploads/categories/meubles/level2/chambres-coucher.png', iconType: 'image-png', iconColor: '#8D6E63', order: 2, hasSublevel: false },
    { name: 'Tables', icon: '/uploads/categories/meubles/level2/tables.png', iconType: 'image-png', iconColor: '#8D6E63', order: 3, hasSublevel: false },
    { name: 'Armoires & Commodes', icon: '/uploads/categories/meubles/level2/armoires-commodes.png', iconType: 'image-png', iconColor: '#8D6E63', order: 4, hasSublevel: false },
    { name: 'Lits', icon: '/uploads/categories/meubles/level2/lits.png', iconType: 'image-png', iconColor: '#8D6E63', order: 5, hasSublevel: false },
    { name: 'Meubles de Cuisine', icon: '/uploads/categories/meubles/level2/meubles-cuisine.png', iconType: 'image-png', iconColor: '#8D6E63', order: 6, hasSublevel: false },
    { name: 'Bibliothèques & Etagères', icon: '/uploads/categories/meubles/level2/bibliotheques-etageres.png', iconType: 'image-png', iconColor: '#8D6E63', order: 7, hasSublevel: false },
    { name: 'Chaises & Fauteuils', icon: '/uploads/categories/meubles/level2/chaises-fauteuils.png', iconType: 'image-png', iconColor: '#8D6E63', order: 8, hasSublevel: false },
    { name: 'Dressings', icon: '/uploads/categories/meubles/level2/dressings.png', iconType: 'image-png', iconColor: '#8D6E63', order: 9, hasSublevel: false },
    { name: 'Meubles salle de bain', icon: '/uploads/categories/meubles/level2/meubles-salle-bain.png', iconType: 'image-png', iconColor: '#8D6E63', order: 10, hasSublevel: false },
    { name: 'Buffet', icon: '/uploads/categories/meubles/level2/buffet.png', iconType: 'image-png', iconColor: '#8D6E63', order: 11, hasSublevel: false },
    { name: 'Tables TV', icon: '/uploads/categories/meubles/level2/tables-tv.png', iconType: 'image-png', iconColor: '#8D6E63', order: 12, hasSublevel: false },
    { name: 'Table pliante', icon: '/uploads/categories/meubles/level2/table-pliante.png', iconType: 'image-png', iconColor: '#8D6E63', order: 13, hasSublevel: false },
    { name: 'Tables à manger', icon: '/uploads/categories/meubles/level2/tables-manger.png', iconType: 'image-png', iconColor: '#8D6E63', order: 14, hasSublevel: false },
    { name: 'Tables PC & Bureaux', icon: '/uploads/categories/meubles/level2/tables-pc-bureaux.png', iconType: 'image-png', iconColor: '#8D6E63', order: 15, hasSublevel: false },
    { name: 'Canapé', icon: '/uploads/categories/meubles/level2/canape.png', iconType: 'image-png', iconColor: '#8D6E63', order: 16, hasSublevel: false },
    { name: 'Table basse', icon: '/uploads/categories/meubles/level2/table-basse.png', iconType: 'image-png', iconColor: '#8D6E63', order: 17, hasSublevel: false },
    { name: 'Rangement et Organisation', icon: '/uploads/categories/meubles/level2/rangement-organisation.png', iconType: 'image-png', iconColor: '#8D6E63', order: 18, hasSublevel: false },
    { name: 'Accessoires de cuisine', icon: '/uploads/categories/meubles/level2/accessoires-cuisine.png', iconType: 'image-png', iconColor: '#8D6E63', order: 19, hasSublevel: false },
    { name: 'Meuble d\'entrée', icon: '/uploads/categories/meubles/level2/meuble-entree.png', iconType: 'image-png', iconColor: '#8D6E63', order: 20, hasSublevel: false },
    { name: 'Décoration', icon: '/uploads/categories/meubles/level2/decoration.png', iconType: 'image-png', iconColor: '#8D6E63', order: 21, hasSublevel: true },
    { name: 'Vaisselle', icon: '/uploads/categories/meubles/level2/vaisselle.png', iconType: 'image-png', iconColor: '#8D6E63', order: 22, hasSublevel: true },
    { name: 'Meubles de bureau', icon: '/uploads/categories/meubles/level2/meubles-bureau.png', iconType: 'image-png', iconColor: '#8D6E63', order: 23, hasSublevel: true },
    { name: 'Puériculture', icon: '/uploads/categories/meubles/level2/puericulture.png', iconType: 'image-png', iconColor: '#8D6E63', order: 24, hasSublevel: true },
    { name: 'Luminaire', icon: '/uploads/categories/meubles/level2/luminaire.png', iconType: 'image-png', iconColor: '#8D6E63', order: 25, hasSublevel: true },
    { name: 'Rideaux', icon: '/uploads/categories/meubles/level2/rideaux.png', iconType: 'image-png', iconColor: '#8D6E63', order: 26, hasSublevel: false },
    { name: 'Literie & Linge', icon: '/uploads/categories/meubles/level2/literie-linge.png', iconType: 'image-png', iconColor: '#8D6E63', order: 27, hasSublevel: false },
    { name: 'Tapis & Moquettes', icon: '/uploads/categories/meubles/level2/tapis-moquettes.png', iconType: 'image-png', iconColor: '#8D6E63', order: 28, hasSublevel: false },
    { name: 'Meubles d\'extérieur', icon: '/uploads/categories/meubles/level2/meubles-exterieur.png', iconType: 'image-png', iconColor: '#8D6E63', order: 29, hasSublevel: false },
    { name: 'Fournitures et articles scolaires', icon: '/uploads/categories/meubles/level2/fournitures-scolaires.png', iconType: 'image-png', iconColor: '#8D6E63', order: 30, hasSublevel: false },
    { name: 'Autre', icon: '/uploads/categories/meubles/level2/autre-meubles.png', iconType: 'image-png', iconColor: '#8D6E63', order: 31, hasSublevel: false }
  ],

  'Loisirs & Divertissements': [
    { name: 'Animalerie', icon: '/uploads/categories/loisirs/level2/animalerie.png', iconType: 'image-png', iconColor: '#673AB7', order: 1, hasSublevel: true },
    { name: 'Consoles et Jeux Vidéos', icon: '/uploads/categories/loisirs/level2/consoles-jeux-videos.png', iconType: 'image-png', iconColor: '#673AB7', order: 2, hasSublevel: true },
    { name: 'Livres & Magazines', icon: '/uploads/categories/loisirs/level2/livres-magazines.png', iconType: 'image-png', iconColor: '#673AB7', order: 3, hasSublevel: true },
    { name: 'Instruments de Musique', icon: '/uploads/categories/loisirs/level2/instruments-musique.png', iconType: 'image-png', iconColor: '#673AB7', order: 4, hasSublevel: true },
    { name: 'Jouets', icon: '/uploads/categories/loisirs/level2/jouets.png', iconType: 'image-png', iconColor: '#673AB7', order: 5, hasSublevel: true },
    { name: 'Chasse & Pêche', icon: '/uploads/categories/loisirs/level2/chasse-peche.png', iconType: 'image-png', iconColor: '#673AB7', order: 6, hasSublevel: true },
    { name: 'Jardinage', icon: '/uploads/categories/loisirs/level2/jardinage.png', iconType: 'image-png', iconColor: '#673AB7', order: 7, hasSublevel: true },
    { name: 'Les Jeux de loisirs', icon: '/uploads/categories/loisirs/level2/jeux-loisirs.png', iconType: 'image-png', iconColor: '#673AB7', order: 8, hasSublevel: true },
    { name: 'Barbecue & Grillades', icon: '/uploads/categories/loisirs/level2/barbecue-grillades.png', iconType: 'image-png', iconColor: '#673AB7', order: 9, hasSublevel: true },
    { name: 'Vapes & Chichas', icon: '/uploads/categories/loisirs/level2/vapes-chichas.png', iconType: 'image-png', iconColor: '#673AB7', order: 10, hasSublevel: true },
    { name: 'Produits & Accessoires d\'été', icon: '/uploads/categories/loisirs/level2/produits-accessoires-ete.png', iconType: 'image-png', iconColor: '#673AB7', order: 11, hasSublevel: true },
    { name: 'Antiquités & Collections', icon: '/uploads/categories/loisirs/level2/antiquites-collections.png', iconType: 'image-png', iconColor: '#673AB7', order: 12, hasSublevel: false },
    { name: 'Autre', icon: '/uploads/categories/loisirs/level2/autres-loisirs.png', iconType: 'image-png', iconColor: '#673AB7', order: 13, hasSublevel: false }
  ],

  'Offres & Demandes d\'emploi': [
    { name: 'Offres d\'emploi', icon: '/uploads/categories/emploi/level2/offres-emploi.png', iconType: 'image-png', iconColor: '#009688', order: 1, hasSublevel: false },
    { name: 'Demandes d\'emploi', icon: '/uploads/categories/emploi/level2/demandes-emploi.png', iconType: 'image-png', iconColor: '#009688', order: 2, hasSublevel: false },
    { name: 'Autres services emploi', icon: '/uploads/categories/emploi/level2/autres-emploi.png', iconType: 'image-png', iconColor: '#009688', order: 3, hasSublevel: false }
  ],

  'Sport': [
    { name: 'Football', icon: '/uploads/categories/sport/level2/football.png', iconType: 'image-png', iconColor: '#FF5722', order: 1, hasSublevel: true },
    { name: 'Hand/Voley/ Basket-Ball', icon: '/uploads/categories/sport/level2/hand-voley-basket.png', iconType: 'image-png', iconColor: '#FF5722', order: 2, hasSublevel: true },
    { name: 'Sport de combat', icon: '/uploads/categories/sport/level2/sport-combat.png', iconType: 'image-png', iconColor: '#FF5722', order: 3, hasSublevel: true },
    { name: 'Fitness - Musculation', icon: '/uploads/categories/sport/level2/fitness-musculation.png', iconType: 'image-png', iconColor: '#FF5722', order: 4, hasSublevel: true },
    { name: 'Natation', icon: '/uploads/categories/sport/level2/natation.png', iconType: 'image-png', iconColor: '#FF5722', order: 5, hasSublevel: true },
    { name: 'Vélos et trotinettes', icon: '/uploads/categories/sport/level2/velos-trotinettes.png', iconType: 'image-png', iconColor: '#FF5722', order: 6, hasSublevel: true },
    { name: 'Sports de raquette', icon: '/uploads/categories/sport/level2/sports-raquette.png', iconType: 'image-png', iconColor: '#FF5722', order: 7, hasSublevel: true },
    { name: 'Sport aquatiques', icon: '/uploads/categories/sport/level2/sport-aquatiques.png', iconType: 'image-png', iconColor: '#FF5722', order: 8, hasSublevel: false },
    { name: 'Équitation', icon: '/uploads/categories/sport/level2/equitation.png', iconType: 'image-png', iconColor: '#FF5722', order: 9, hasSublevel: false },
    { name: 'Pétanque', icon: '/uploads/categories/sport/level2/petanque.png', iconType: 'image-png', iconColor: '#FF5722', order: 10, hasSublevel: false },
    { name: 'Autres', icon: '/uploads/categories/sport/level2/autres-sports.png', iconType: 'image-png', iconColor: '#FF5722', order: 11, hasSublevel: false }
  ],

  'Alimentaires': [
    { name: 'Produits laitiers', icon: '/uploads/categories/alimentaires/level2/produits-laitiers.png', iconType: 'image-png', iconColor: '#FF9800', order: 1, hasSublevel: false },
    { name: 'Fruits secs', icon: '/uploads/categories/alimentaires/level2/fruits-secs.png', iconType: 'image-png', iconColor: '#FF9800', order: 2, hasSublevel: false },
    { name: 'Graines - Riz - Céréales', icon: '/uploads/categories/alimentaires/level2/graines-riz-cereales.png', iconType: 'image-png', iconColor: '#FF9800', order: 3, hasSublevel: false },
    { name: 'Sucres & Produits sucrés', icon: '/uploads/categories/alimentaires/level2/sucres-produits-sucres.png', iconType: 'image-png', iconColor: '#FF9800', order: 4, hasSublevel: false },
    { name: 'Boissons', icon: '/uploads/categories/alimentaires/level2/boissons.png', iconType: 'image-png', iconColor: '#FF9800', order: 5, hasSublevel: false },
    { name: 'Viandes & Poissons', icon: '/uploads/categories/alimentaires/level2/viandes-poissons.png', iconType: 'image-png', iconColor: '#FF9800', order: 6, hasSublevel: false },
    { name: 'Café - Thé - Infusion', icon: '/uploads/categories/alimentaires/level2/cafe-the-infusion.png', iconType: 'image-png', iconColor: '#FF9800', order: 7, hasSublevel: false },
    { name: 'Compléments alimentaires', icon: '/uploads/categories/alimentaires/level2/complements-alimentaires.png', iconType: 'image-png', iconColor: '#FF9800', order: 8, hasSublevel: false },
    { name: 'Miel & Dérivés', icon: '/uploads/categories/alimentaires/level2/miel-derives.png', iconType: 'image-png', iconColor: '#FF9800', order: 9, hasSublevel: false },
    { name: 'Fruits & Légumes', icon: '/uploads/categories/alimentaires/level2/fruits-legumes.png', iconType: 'image-png', iconColor: '#FF9800', order: 10, hasSublevel: false },
    { name: 'Blé & Farine', icon: '/uploads/categories/alimentaires/level2/ble-farine.png', iconType: 'image-png', iconColor: '#FF9800', order: 11, hasSublevel: false },
    { name: 'Bonbons & Chocolat', icon: '/uploads/categories/alimentaires/level2/bonbons-chocolat.png', iconType: 'image-png', iconColor: '#FF9800', order: 12, hasSublevel: false },
    { name: 'Boulangerie & Viennoiserie', icon: '/uploads/categories/alimentaires/level2/boulangerie-viennoiserie.png', iconType: 'image-png', iconColor: '#FF9800', order: 13, hasSublevel: false },
    { name: 'Ingrédients cuisine et pâtisserie', icon: '/uploads/categories/alimentaires/level2/ingredients-cuisine-patisserie.png', iconType: 'image-png', iconColor: '#FF9800', order: 14, hasSublevel: false },
    { name: 'Noix & Graines', icon: '/uploads/categories/alimentaires/level2/noix-graines.png', iconType: 'image-png', iconColor: '#FF9800', order: 15, hasSublevel: false },
    { name: 'Plats cuisinés', icon: '/uploads/categories/alimentaires/level2/plats-cuisines.png', iconType: 'image-png', iconColor: '#FF9800', order: 16, hasSublevel: false },
    { name: 'Sauces - Epices - Condiments', icon: '/uploads/categories/alimentaires/level2/sauces-epices-condiments.png', iconType: 'image-png', iconColor: '#FF9800', order: 17, hasSublevel: false },
    { name: 'Œufs', icon: '/uploads/categories/alimentaires/level2/oeufs.png', iconType: 'image-png', iconColor: '#FF9800', order: 18, hasSublevel: false },
    { name: 'Huiles', icon: '/uploads/categories/alimentaires/level2/huiles.png', iconType: 'image-png', iconColor: '#FF9800', order: 19, hasSublevel: false },
    { name: 'Pâtes', icon: '/uploads/categories/alimentaires/level2/pates.png', iconType: 'image-png', iconColor: '#FF9800', order: 20, hasSublevel: false },
    { name: 'Gateaux', icon: '/uploads/categories/alimentaires/level2/gateaux.png', iconType: 'image-png', iconColor: '#FF9800', order: 21, hasSublevel: false },
    { name: 'Emballage', icon: '/uploads/categories/alimentaires/level2/emballage.png', iconType: 'image-png', iconColor: '#FF9800', order: 22, hasSublevel: false },
    { name: 'Aliments pour bébé', icon: '/uploads/categories/alimentaires/level2/aliments-bebe.png', iconType: 'image-png', iconColor: '#FF9800', order: 23, hasSublevel: false },
    { name: 'Aliments diététiques', icon: '/uploads/categories/alimentaires/level2/aliments-dietetiques.png', iconType: 'image-png', iconColor: '#FF9800', order: 24, hasSublevel: false },
    { name: 'Autre Alimentaires', icon: '/uploads/categories/alimentaires/level2/autre-alimentaires.png', iconType: 'image-png', iconColor: '#FF9800', order: 25, hasSublevel: false }
  ],

  'Matériaux & Équipement': [
    { name: 'Matériel professionnel', icon: '/uploads/categories/materiaux/level2/materiel-professionnel.png', iconType: 'image-png', iconColor: '#795548', order: 1, hasSublevel: true },
    { name: 'Outillage professionnel', icon: '/uploads/categories/materiaux/level2/outillage-professionnel.png', iconType: 'image-png', iconColor: '#795548', order: 2, hasSublevel: true },
    { name: 'Matériel Agricole', icon: '/uploads/categories/materiaux/level2/materiel-agricole.png', iconType: 'image-png', iconColor: '#795548', order: 3, hasSublevel: true },
    { name: 'Materiaux de construction', icon: '/uploads/categories/materiaux/level2/materiaux-construction.png', iconType: 'image-png', iconColor: '#795548', order: 4, hasSublevel: false },
    { name: 'Matières premières', icon: '/uploads/categories/materiaux/level2/matieres-premieres.png', iconType: 'image-png', iconColor: '#795548', order: 5, hasSublevel: false },
    { name: 'Produits d\'hygiène', icon: '/uploads/categories/materiaux/level2/produits-hygiene.png', iconType: 'image-png', iconColor: '#795548', order: 6, hasSublevel: false },
    { name: 'Autre', icon: '/uploads/categories/materiaux/level2/autre-materiaux.png', iconType: 'image-png', iconColor: '#795548', order: 7, hasSublevel: false }
  ],

  'Services': [
    { name: 'Construction & Travaux', icon: '/uploads/categories/services/level2/construction-travaux.png', iconType: 'image-png', iconColor: '#4CAF50', order: 1, hasSublevel: false },
    { name: 'Ecoles & Formations', icon: '/uploads/categories/services/level2/ecoles-formations.png', iconType: 'image-png', iconColor: '#4CAF50', order: 2, hasSublevel: false },
    { name: 'Industrie & Fabrication', icon: '/uploads/categories/services/level2/industrie-fabrication.png', iconType: 'image-png', iconColor: '#4CAF50', order: 3, hasSublevel: false },
    { name: 'Transport et déménagement', icon: '/uploads/categories/services/level2/transport-demenagement.png', iconType: 'image-png', iconColor: '#4CAF50', order: 4, hasSublevel: false },
    { name: 'Décoration & Aménagement', icon: '/uploads/categories/services/level2/decoration-amenagement.png', iconType: 'image-png', iconColor: '#4CAF50', order: 5, hasSublevel: false },
    { name: 'Publicite & Communication', icon: '/uploads/categories/services/level2/publicite-communication.png', iconType: 'image-png', iconColor: '#4CAF50', order: 6, hasSublevel: false },
    { name: 'Nettoyage & Jardinage', icon: '/uploads/categories/services/level2/nettoyage-jardinage.png', iconType: 'image-png', iconColor: '#4CAF50', order: 7, hasSublevel: false },
    { name: 'Froid & Climatisation', icon: '/uploads/categories/services/level2/froid-climatisation.png', iconType: 'image-png', iconColor: '#4CAF50', order: 8, hasSublevel: false },
    { name: 'Traiteurs & Gateaux', icon: '/uploads/categories/services/level2/traiteurs-gateaux.png', iconType: 'image-png', iconColor: '#4CAF50', order: 9, hasSublevel: false },
    { name: 'Médecine & Santé', icon: '/uploads/categories/services/level2/medecine-sante.png', iconType: 'image-png', iconColor: '#4CAF50', order: 10, hasSublevel: false },
    { name: 'Réparation auto & Diagnostic', icon: '/uploads/categories/services/level2/reparation-auto-diagnostic.png', iconType: 'image-png', iconColor: '#4CAF50', order: 11, hasSublevel: false },
    { name: 'Sécurité & Alarme', icon: '/uploads/categories/services/level2/securite-alarme.png', iconType: 'image-png', iconColor: '#4CAF50', order: 12, hasSublevel: false },
    { name: 'Projets & Études', icon: '/uploads/categories/services/level2/projets-etudes.png', iconType: 'image-png', iconColor: '#4CAF50', order: 13, hasSublevel: false },
    { name: 'Bureautique & Internet', icon: '/uploads/categories/services/level2/bureautique-internet.png', iconType: 'image-png', iconColor: '#4CAF50', order: 14, hasSublevel: false },
    { name: 'Location de véhicules', icon: '/uploads/categories/services/level2/location-vehicules.png', iconType: 'image-png', iconColor: '#4CAF50', order: 15, hasSublevel: false },
    { name: 'Menuiserie & Meubles', icon: '/uploads/categories/services/level2/menuiserie-meubles.png', iconType: 'image-png', iconColor: '#4CAF50', order: 16, hasSublevel: false },
    { name: 'Impression & Edition', icon: '/uploads/categories/services/level2/impression-edition.png', iconType: 'image-png', iconColor: '#4CAF50', order: 17, hasSublevel: false },
    { name: 'Hôtellerie & Restauration & Salles', icon: '/uploads/categories/services/level2/hotellerie-restauration-salles.png', iconType: 'image-png', iconColor: '#4CAF50', order: 18, hasSublevel: false },
    { name: 'Esthétique & Beauté', icon: '/uploads/categories/services/level2/esthetique-beaute.png', iconType: 'image-png', iconColor: '#4CAF50', order: 19, hasSublevel: false },
    { name: 'Image & Son', icon: '/uploads/categories/services/level2/image-son.png', iconType: 'image-png', iconColor: '#4CAF50', order: 20, hasSublevel: false },
    { name: 'Comptabilité & Economie', icon: '/uploads/categories/services/level2/comptabilite-economie.png', iconType: 'image-png', iconColor: '#4CAF50', order: 21, hasSublevel: false },
    { name: 'Couture & Confection', icon: '/uploads/categories/services/level2/couture-confection.png', iconType: 'image-png', iconColor: '#4CAF50', order: 22, hasSublevel: false },
    { name: 'Maintenance informatique', icon: '/uploads/categories/services/level2/maintenance-informatique.png', iconType: 'image-png', iconColor: '#4CAF50', order: 23, hasSublevel: false },
    { name: 'Réparation Electromenager', icon: '/uploads/categories/services/level2/reparation-electromenager.png', iconType: 'image-png', iconColor: '#4CAF50', order: 24, hasSublevel: false },
    { name: 'Evènements & Divertissement', icon: '/uploads/categories/services/level2/evenements-divertissement.png', iconType: 'image-png', iconColor: '#4CAF50', order: 25, hasSublevel: false },
    { name: 'Paraboles & Démos', icon: '/uploads/categories/services/level2/paraboles-demos.png', iconType: 'image-png', iconColor: '#4CAF50', order: 26, hasSublevel: false },
    { name: 'Réparation Électronique', icon: '/uploads/categories/services/level2/reparation-electronique.png', iconType: 'image-png', iconColor: '#4CAF50', order: 27, hasSublevel: false },
    { name: 'Services à l\'étranger', icon: '/uploads/categories/services/level2/services-etranger.png', iconType: 'image-png', iconColor: '#4CAF50', order: 28, hasSublevel: false },
    { name: 'Flashage & Réparation des téléphones', icon: '/uploads/categories/services/level2/flashage-reparation-telephones.png', iconType: 'image-png', iconColor: '#4CAF50', order: 29, hasSublevel: false },
    { name: 'Flashage & Installation des jeux', icon: '/uploads/categories/services/level2/flashage-installation-jeux.png', iconType: 'image-png', iconColor: '#4CAF50', order: 30, hasSublevel: false },
    { name: 'Juridique', icon: '/uploads/categories/services/level2/juridique.png', iconType: 'image-png', iconColor: '#4CAF50', order: 31, hasSublevel: false },
    { name: 'Autres Services', icon: '/uploads/categories/services/level2/autres-services.png', iconType: 'image-png', iconColor: '#4CAF50', order: 32, hasSublevel: false }
  ],

  'Voyages': [
    { name: 'Voyage organisé', icon: '/uploads/categories/voyages/level2/voyage-organise.png', iconType: 'image-png', iconColor: '#2196F3', order: 1, hasSublevel: false },
    { name: 'Location vacances', icon: '/uploads/categories/voyages/level2/location-vacances.png', iconType: 'image-png', iconColor: '#2196F3', order: 2, hasSublevel: false },
    { name: 'Hajj & Omra', icon: '/uploads/categories/voyages/level2/hajj-omra.png', iconType: 'image-png', iconColor: '#2196F3', order: 3, hasSublevel: false },
    { name: 'Réservations & Visa', icon: '/uploads/categories/voyages/level2/reservations-visa.png', iconType: 'image-png', iconColor: '#2196F3', order: 4, hasSublevel: false },
    { name: 'Séjour', icon: '/uploads/categories/voyages/level2/sejour.png', iconType: 'image-png', iconColor: '#2196F3', order: 5, hasSublevel: false },
    { name: 'Croisière', icon: '/uploads/categories/voyages/level2/croisiere.png', iconType: 'image-png', iconColor: '#2196F3', order: 6, hasSublevel: false },
    { name: 'Autre voyages', icon: '/uploads/categories/voyages/level2/autre-voyages.png', iconType: 'image-png', iconColor: '#2196F3', order: 7, hasSublevel: false }
  ]
};

// ============================================
// NIVEL 3 - ARTÍCULOS (Los mismos que ya tienes)
// ============================================

// (Mantengo los artículos iguales, solo cambian las referencias de los nombres principales)
const articlesData = {
  // ... (mantén TODO el contenido de articlesData exactamente como está)
  // Solo asegúrate de que las claves coincidan con los nombres de las subcategorías
};

const seedCategories = async () => {
  try {
    console.log('🚀 INICIANDO SEED COMPLETO DE 16 CATEGORÍAS\n');
    console.log('='.repeat(80));

    // Limpiar colección existente
    console.log('🧹 Paso 1: Limpiando colección existente...');
    const result = await Category.deleteMany({});
    console.log(`   ✅ Eliminadas ${result.deletedCount} categorías anteriores\n`);

    // Insertar categorías principales (Nivel 1)
    console.log('📦 Paso 2: Insertando 16 categorías principales (Nivel 1)...');
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
      console.log(`   ✅ ${categoryData.name} → ${categoryData.slug} (Orden: ${categoryData.order})`);
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

      if (parentId && subcats && subcats.length > 0) {
        await insertChildren(parentId, mainCatName, subcats, 2);
        console.log(`      ✅ ${subcats.length} subcategorías insertadas`);
      } else {
        console.log(`   ⚠️  No se encontró parent o subcategorías para ${mainCatName}`);
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
    console.log(`   • Categorías principales (Nivel 1): ${level1} de 16`);
    console.log(`   • Subcategorías (Nivel 2): ${level2}`);
    console.log(`   • Artículos (Nivel 3): ${level3}`);
    console.log(`   • Total de categorías en BD: ${totalCategories}`);

    console.log('\n🔍 LISTA COMPLETA DE CATEGORÍAS NIVEL 1:');
    const allLevel1 = await Category.find({ level: 1 }).sort('order');
    allLevel1.forEach((cat, index) => {
      console.log(`   ${index + 1}. ${cat.name} (/${cat.slug})`);
    });

    console.log('\n⚠️  NOTA IMPORTANTE:');
    console.log('   Las dos categorías que faltaban ahora están incluidas:');
    console.log('   1. Électroménager & Électronique');
    console.log('   2. Téléphones & Accessoires');
    console.log('\n   Todas las imágenes deben colocarse en las rutas especificadas.');
    console.log('   Ej: /public/uploads/categories/electromenager/level1/electromenager.png');

    process.exit(0);

  } catch (error) {
    console.error('\n❌ ERROR CRÍTICO:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};