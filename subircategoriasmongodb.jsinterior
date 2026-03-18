//  node subircategoriasmongodb.js
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

// Configuración de Cloudinary
const CLOUD_NAME = 'dfjipgj2o';
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/categories`; // Sin versión

// Función para generar URL según el nivel y los slugs de los padres
const generateIconUrl = (categorySlug, parentSlug = null, grandParentSlug = null) => {
  let path = '';
  if (grandParentSlug) {
    // Nivel 3: categoría/ subcategoría/ archivo.png
    path = `${grandParentSlug}/${parentSlug}/${categorySlug}.png`;
  } else if (parentSlug) {
    // Nivel 2: categoría/ archivo.png
    path = `${parentSlug}/${categorySlug}.png`;
  } else {
    // Nivel 1: categoría/ archivo.png
    path = `${categorySlug}/${categorySlug}.png`;
  }
  return `${BASE_URL}/${path}`;
};


// 🎯 ESTRUCTURA PERFECTA CON ICONOS PNG PARA TODOS LOS NIVELES - ACTUALIZADO CON URLs DE CLOUDINARY
const categoriesData = [
  // ==================== 1. VEHICULES ====================
  {
    name: 'Vehicules',
    slug: 'vehicules',
    level: 1,
    icon: generateIconUrl('vehicules'),
    order: 3,
    children: [
      { name: 'Voitures', slug: 'voitures', level: 2, icon: generateIconUrl('voitures', 'vehicules'), order: 1, children: [] },
      { name: 'Utilitaire', slug: 'utilitaire', level: 2, icon: generateIconUrl('utilitaire', 'vehicules'), order: 2, children: [] },
      { name: 'Motos & Scooters', slug: 'motos-scooters', level: 2, icon: generateIconUrl('motos-scooters', 'vehicules'), order: 3, children: [] },
      { name: 'Quads', slug: 'quads', level: 2, icon: generateIconUrl('quads', 'vehicules'), order: 4, children: [] },
      { name: 'Fourgon', slug: 'fourgon', level: 2, icon: generateIconUrl('fourgon', 'vehicules'), order: 5, children: [] },
      { name: 'Camion', slug: 'camion', level: 2, icon: generateIconUrl('camion', 'vehicules'), order: 6, children: [] },
      { name: 'Bus', slug: 'bus', level: 2, icon: generateIconUrl('bus', 'vehicules'), order: 7, children: [] },
      { name: 'Engin', slug: 'engin', level: 2, icon: generateIconUrl('engin', 'vehicules'), order: 8, children: [] },
      { name: 'Tracteurs', slug: 'tracteurs', level: 2, icon: generateIconUrl('tracteurs', 'vehicules'), order: 9, children: [] },
      { name: 'Remorques', slug: 'remorques', level: 2, icon: generateIconUrl('remorques', 'vehicules'), order: 10, children: [] },
      { name: 'Bateaux & Barques', slug: 'bateaux-barques', level: 2, icon: generateIconUrl('bateaux-barques', 'vehicules'), order: 11, children: [] }
    ]
  },

  // ==================== 2. VETEMENTS ====================
  {
    name: 'Vetements',
    slug: 'vetements',
    level: 1,
    icon: generateIconUrl('vetements'),
    order: 8,
    children: [
      {
        name: 'Vêtements Homme',
        slug: 'vetements-homme',
        level: 2,
        icon: generateIconUrl('vetements-homme', 'vetements'),
        order: 1,
        children: [
          { name: 'Hauts & Chemises', slug: 'hauts-chemises', level: 3, icon: generateIconUrl('hauts-chemises', 'vetements-homme', 'vetements'), children: [] },
          { name: 'Jeans & Pantalons', slug: 'jeans-pantalons', level: 3, icon: generateIconUrl('jeans-pantalons', 'vetements-homme', 'vetements'), children: [] },
          { name: 'Shorts & Pantacourts', slug: 'shorts-pantacourts', level: 3, icon: generateIconUrl('shorts-pantacourts', 'vetements-homme', 'vetements'), children: [] },
          { name: 'Vestes & Gilets', slug: 'vestes-gilets', level: 3, icon: generateIconUrl('vestes-gilets', 'vetements-homme', 'vetements'), children: [] },
          { name: 'Costumes & Blazers', slug: 'costumes-blazers', level: 3, icon: generateIconUrl('costumes-blazers', 'vetements-homme', 'vetements'), children: [] },
          { name: 'Survetements', slug: 'survetements', level: 3, icon: generateIconUrl('survetements', 'vetements-homme', 'vetements'), children: [] },
          { name: 'Kamiss', slug: 'kamiss', level: 3, icon: generateIconUrl('kamiss', 'vetements-homme', 'vetements'), children: [] },
          { name: 'Sous vêtements', slug: 'sous-vetements', level: 3, icon: generateIconUrl('sous-vetements', 'vetements-homme', 'vetements'), children: [] },
          { name: 'Pyjamas', slug: 'pyjamas', level: 3, icon: generateIconUrl('pyjamas', 'vetements-homme', 'vetements'), children: [] },
          { name: 'Maillots de bain', slug: 'maillots-bain', level: 3, icon: generateIconUrl('maillots-bain', 'vetements-homme', 'vetements'), children: [] },
          { name: 'Casquettes & Chapeaux', slug: 'casquettes-chapeaux', level: 3, icon: generateIconUrl('casquettes-chapeaux', 'vetements-homme', 'vetements'), children: [] },
          { name: 'Chaussettes', slug: 'chaussettes', level: 3, icon: generateIconUrl('chaussettes', 'vetements-homme', 'vetements'), children: [] },
          { name: 'Ceintures', slug: 'ceintures', level: 3, icon: generateIconUrl('ceintures', 'vetements-homme', 'vetements'), children: [] },
          { name: 'Gants', slug: 'gants', level: 3, icon: generateIconUrl('gants', 'vetements-homme', 'vetements'), children: [] },
          { name: 'Cravates', slug: 'cravates', level: 3, icon: generateIconUrl('cravates', 'vetements-homme', 'vetements'), children: [] },
          { name: 'Autre', slug: 'autre-homme', level: 3, icon: generateIconUrl('autre-homme', 'vetements-homme', 'vetements'), children: [] }
        ]
      },
      {
        name: 'Vêtements Femme',
        slug: 'vetements-femme',
        level: 2,
        icon: generateIconUrl('vetements-femme', 'vetements'),
        order: 2,
        children: [
          { name: 'Hauts & Chemises', slug: 'hauts-chemises-femme', level: 3, icon: generateIconUrl('hauts-chemises-femme', 'vetements-femme', 'vetements'), children: [] },
          { name: 'Jeans & Pantalons', slug: 'jeans-pantalons-femme', level: 3, icon: generateIconUrl('jeans-pantalons-femme', 'vetements-femme', 'vetements'), children: [] },
          { name: 'Shorts & Pantacourts', slug: 'shorts-pantacourts-femme', level: 3, icon: generateIconUrl('shorts-pantacourts-femme', 'vetements-femme', 'vetements'), children: [] },
          { name: 'Vestes & Gilets', slug: 'vestes-gilets-femme', level: 3, icon: generateIconUrl('vestes-gilets-femme', 'vetements-femme', 'vetements'), children: [] },
          { name: 'Ensembles', slug: 'ensembles', level: 3, icon: generateIconUrl('ensembles', 'vetements-femme', 'vetements'), children: [] },
          { name: 'Abayas & Hijabs', slug: 'abayas-hijabs', level: 3, icon: generateIconUrl('abayas-hijabs', 'vetements-femme', 'vetements'), children: [] },
          { name: 'Mariages & Fêtes', slug: 'mariages-fetes', level: 3, icon: generateIconUrl('mariages-fetes', 'vetements-femme', 'vetements'), children: [] },
          { name: 'Maternité', slug: 'maternite', level: 3, icon: generateIconUrl('maternite', 'vetements-femme', 'vetements'), children: [] },
          { name: 'Robes', slug: 'robes', level: 3, icon: generateIconUrl('robes', 'vetements-femme', 'vetements'), children: [] },
          { name: 'Jupes', slug: 'jupes', level: 3, icon: generateIconUrl('jupes', 'vetements-femme', 'vetements'), children: [] },
          { name: 'Joggings & Survetements', slug: 'joggings-survetements-femme', level: 3, icon: generateIconUrl('joggings-survetements-femme', 'vetements-femme', 'vetements'), children: [] },
          { name: 'Leggings', slug: 'leggings', level: 3, icon: generateIconUrl('leggings', 'vetements-femme', 'vetements'), children: [] },
          { name: 'Sous-vêtements & Lingerie', slug: 'sous-vetements-lingerie', level: 3, icon: generateIconUrl('sous-vetements-lingerie', 'vetements-femme', 'vetements'), children: [] },
          { name: 'Pyjamas', slug: 'pyjamas-femme', level: 3, icon: generateIconUrl('pyjamas-femme', 'vetements-femme', 'vetements'), children: [] },
          { name: 'Peignoirs', slug: 'peignoirs', level: 3, icon: generateIconUrl('peignoirs', 'vetements-femme', 'vetements'), children: [] },
          { name: 'Maillots de bain', slug: 'maillots-bain-femme', level: 3, icon: generateIconUrl('maillots-bain-femme', 'vetements-femme', 'vetements'), children: [] },
          { name: 'Casquettes & Chapeaux', slug: 'casquettes-chapeaux-femme', level: 3, icon: generateIconUrl('casquettes-chapeaux-femme', 'vetements-femme', 'vetements'), children: [] },
          { name: 'Chaussettes & Collants', slug: 'chaussettes-collants', level: 3, icon: generateIconUrl('chaussettes-collants', 'vetements-femme', 'vetements'), children: [] },
          { name: 'Foulards & Echarpes', slug: 'foulards-echarpes', level: 3, icon: generateIconUrl('foulards-echarpes', 'vetements-femme', 'vetements'), children: [] },
          { name: 'Ceintures', slug: 'ceintures-femme', level: 3, icon: generateIconUrl('ceintures-femme', 'vetements-femme', 'vetements'), children: [] },
          { name: 'Gants', slug: 'gants-femme', level: 3, icon: generateIconUrl('gants-femme', 'vetements-femme', 'vetements'), children: [] },
          { name: 'Autre', slug: 'autre-femme', level: 3, icon: generateIconUrl('autre-femme', 'vetements-femme', 'vetements'), children: [] }
        ]
      },
      {
        name: 'Chaussures Homme',
        slug: 'chaussures-homme',
        level: 2,
        icon: generateIconUrl('chaussures-homme', 'vetements'),
        order: 3,
        children: [
          { name: 'Basquettes', slug: 'basquettes', level: 3, icon: generateIconUrl('basquettes', 'chaussures-homme', 'vetements'), children: [] },
          { name: 'Bottes', slug: 'bottes', level: 3, icon: generateIconUrl('bottes', 'chaussures-homme', 'vetements'), children: [] },
          { name: 'Classiques', slug: 'classiques', level: 3, icon: generateIconUrl('classiques', 'chaussures-homme', 'vetements'), children: [] },
          { name: 'Mocassins', slug: 'mocassins', level: 3, icon: generateIconUrl('mocassins', 'chaussures-homme', 'vetements'), children: [] },
          { name: 'Sandales', slug: 'sandales', level: 3, icon: generateIconUrl('sandales', 'chaussures-homme', 'vetements'), children: [] },
          { name: 'Tangues & Pantoufles', slug: 'tangues-pantoufles', level: 3, icon: generateIconUrl('tangues-pantoufles', 'chaussures-homme', 'vetements'), children: [] },
          { name: 'Autre', slug: 'autre-chaussures-homme', level: 3, icon: generateIconUrl('autre-chaussures-homme', 'chaussures-homme', 'vetements'), children: [] }
        ]
      },
      {
        name: 'Chaussures Femme',
        slug: 'chaussures-femme',
        level: 2,
        icon: generateIconUrl('chaussures-femme', 'vetements'),
        order: 4,
        children: [
          { name: 'Basquettes', slug: 'basquettes-femme', level: 3, icon: generateIconUrl('basquettes-femme', 'chaussures-femme', 'vetements'), children: [] },
          { name: 'Sandales', slug: 'sandales-femme', level: 3, icon: generateIconUrl('sandales-femme', 'chaussures-femme', 'vetements'), children: [] },
          { name: 'Bottes', slug: 'bottes-femme', level: 3, icon: generateIconUrl('bottes-femme', 'chaussures-femme', 'vetements'), children: [] },
          { name: 'Escarpins', slug: 'escarpins', level: 3, icon: generateIconUrl('escarpins', 'chaussures-femme', 'vetements'), children: [] },
          { name: 'Ballerines', slug: 'ballerines', level: 3, icon: generateIconUrl('ballerines', 'chaussures-femme', 'vetements'), children: [] },
          { name: 'Tangues & Pantoufles', slug: 'tangues-pantoufles-femme', level: 3, icon: generateIconUrl('tangues-pantoufles-femme', 'chaussures-femme', 'vetements'), children: [] },
          { name: 'Autre', slug: 'autre-chaussures-femme', level: 3, icon: generateIconUrl('autre-chaussures-femme', 'chaussures-femme', 'vetements'), children: [] }
        ]
      },
      {
        name: 'Garçons',
        slug: 'garcons',
        level: 2,
        icon: generateIconUrl('garcons', 'vetements'),
        order: 5,
        children: [
          { name: 'Chaussures', slug: 'chaussures-garcons', level: 3, icon: generateIconUrl('chaussures-garcons', 'garcons', 'vetements'), children: [] },
          { name: 'Hauts & Chemises', slug: 'hauts-chemises-garcons', level: 3, icon: generateIconUrl('hauts-chemises-garcons', 'garcons', 'vetements'), children: [] },
          { name: 'Pantalons & Shorts', slug: 'pantalons-shorts-garcons', level: 3, icon: generateIconUrl('pantalons-shorts-garcons', 'garcons', 'vetements'), children: [] },
          { name: 'Vestes & Gilets', slug: 'vestes-gilets-garcons', level: 3, icon: generateIconUrl('vestes-gilets-garcons', 'garcons', 'vetements'), children: [] },
          { name: 'Costumes', slug: 'costumes-garcons', level: 3, icon: generateIconUrl('costumes-garcons', 'garcons', 'vetements'), children: [] },
          { name: 'Survetements & Joggings', slug: 'survetements-joggings-garcons', level: 3, icon: generateIconUrl('survetements-joggings-garcons', 'garcons', 'vetements'), children: [] },
          { name: 'Pyjamas', slug: 'pyjamas-garcons', level: 3, icon: generateIconUrl('pyjamas-garcons', 'garcons', 'vetements'), children: [] },
          { name: 'Sous-vêtements', slug: 'sous-vetements-garcons', level: 3, icon: generateIconUrl('sous-vetements-garcons', 'garcons', 'vetements'), children: [] },
          { name: 'Maillots de bain', slug: 'maillots-bain-garcons', level: 3, icon: generateIconUrl('maillots-bain-garcons', 'garcons', 'vetements'), children: [] },
          { name: 'Kamiss', slug: 'kamiss-garcons', level: 3, icon: generateIconUrl('kamiss-garcons', 'garcons', 'vetements'), children: [] },
          { name: 'Casquettes & Chapeaux', slug: 'casquettes-chapeaux-garcons', level: 3, icon: generateIconUrl('casquettes-chapeaux-garcons', 'garcons', 'vetements'), children: [] },
          { name: 'Autre', slug: 'autre-garcons', level: 3, icon: generateIconUrl('autre-garcons', 'garcons', 'vetements'), children: [] }
        ]
      },
      {
        name: 'Filles',
        slug: 'filles',
        level: 2,
        icon: generateIconUrl('filles', 'vetements'),
        order: 6,
        children: [
          { name: 'Chaussures', slug: 'chaussures-filles', level: 3, icon: generateIconUrl('chaussures-filles', 'filles', 'vetements'), children: [] },
          { name: 'Hauts & Chemises', slug: 'hauts-chemises-filles', level: 3, icon: generateIconUrl('hauts-chemises-filles', 'filles', 'vetements'), children: [] },
          { name: 'Pantalons & Shorts', slug: 'pantalons-shorts-filles', level: 3, icon: generateIconUrl('pantalons-shorts-filles', 'filles', 'vetements'), children: [] },
          { name: 'Vestes & Gilets', slug: 'vestes-gilets-filles', level: 3, icon: generateIconUrl('vestes-gilets-filles', 'filles', 'vetements'), children: [] },
          { name: 'Robes', slug: 'robes-filles', level: 3, icon: generateIconUrl('robes-filles', 'filles', 'vetements'), children: [] },
          { name: 'Jupes', slug: 'jupes-filles', level: 3, icon: generateIconUrl('jupes-filles', 'filles', 'vetements'), children: [] },
          { name: 'Ensembles', slug: 'ensembles-filles', level: 3, icon: generateIconUrl('ensembles-filles', 'filles', 'vetements'), children: [] },
          { name: 'Joggings & Survetements', slug: 'joggings-survetements-filles', level: 3, icon: generateIconUrl('joggings-survetements-filles', 'filles', 'vetements'), children: [] },
          { name: 'Pyjamas', slug: 'pyjamas-filles', level: 3, icon: generateIconUrl('pyjamas-filles', 'filles', 'vetements'), children: [] },
          { name: 'Sous-vêtements', slug: 'sous-vetements-filles', level: 3, icon: generateIconUrl('sous-vetements-filles', 'filles', 'vetements'), children: [] },
          { name: 'Leggings & Collants', slug: 'leggings-collants', level: 3, icon: generateIconUrl('leggings-collants', 'filles', 'vetements'), children: [] },
          { name: 'Maillots de bain', slug: 'maillots-bain-filles', level: 3, icon: generateIconUrl('maillots-bain-filles', 'filles', 'vetements'), children: [] },
          { name: 'Casquettes & Chapeaux', slug: 'casquettes-chapeaux-filles', level: 3, icon: generateIconUrl('casquettes-chapeaux-filles', 'filles', 'vetements'), children: [] },
          { name: 'Autre', slug: 'autre-filles', level: 3, icon: generateIconUrl('autre-filles', 'filles', 'vetements'), children: [] }
        ]
      },
      {
        name: 'Bébé',
        slug: 'bebe',
        level: 2,
        icon: generateIconUrl('bebe', 'vetements'),
        order: 7,
        children: [
          { name: 'Vêtements', slug: 'vetements-bebe', level: 3, icon: generateIconUrl('vetements-bebe', 'bebe', 'vetements'), children: [] },
          { name: 'Chaussures', slug: 'chaussures-bebe', level: 3, icon: generateIconUrl('chaussures-bebe', 'bebe', 'vetements'), children: [] },
          { name: 'Accessoires', slug: 'accessoires-bebe', level: 3, icon: generateIconUrl('accessoires-bebe', 'bebe', 'vetements'), children: [] }
        ]
      },
      {
        name: 'Sacs & Valises',
        slug: 'sacs-valises',
        level: 2,
        icon: generateIconUrl('sacs-valises', 'vetements'),
        order: 8,
        children: [
          { name: 'Pochettes & Portefeuilles', slug: 'pochettes-portefeuilles', level: 3, icon: generateIconUrl('pochettes-portefeuilles', 'sacs-valises', 'vetements'), children: [] },
          { name: 'Sacs à main', slug: 'sacs-main', level: 3, icon: generateIconUrl('sacs-main', 'sacs-valises', 'vetements'), children: [] },
          { name: 'Sacs à dos', slug: 'sacs-dos', level: 3, icon: generateIconUrl('sacs-dos', 'sacs-valises', 'vetements'), children: [] },
          { name: 'Sacs professionnels', slug: 'sacs-professionnels', level: 3, icon: generateIconUrl('sacs-professionnels', 'sacs-valises', 'vetements'), children: [] },
          { name: 'Valises', slug: 'valises', level: 3, icon: generateIconUrl('valises', 'sacs-valises', 'vetements'), children: [] },
          { name: 'Cabas de sport', slug: 'cabas-sport', level: 3, icon: generateIconUrl('cabas-sport', 'sacs-valises', 'vetements'), children: [] },
          { name: 'Autre', slug: 'autre-sacs', level: 3, icon: generateIconUrl('autre-sacs', 'sacs-valises', 'vetements'), children: [] }
        ]
      },
      {
        name: 'Montres',
        slug: 'montres',
        level: 2,
        icon: generateIconUrl('montres', 'vetements'),
        order: 9,
        children: [
          { name: 'Hommes', slug: 'montres-hommes', level: 3, icon: generateIconUrl('montres-hommes', 'montres', 'vetements'), children: [] },
          { name: 'Femmes', slug: 'montres-femmes', level: 3, icon: generateIconUrl('montres-femmes', 'montres', 'vetements'), children: [] }
        ]
      },
      {
        name: 'Lunettes',
        slug: 'lunettes',
        level: 2,
        icon: generateIconUrl('lunettes', 'vetements'),
        order: 10,
        children: [
          { name: 'Lunettes de vue hommes', slug: 'lunettes-vue-hommes', level: 3, icon: generateIconUrl('lunettes-vue-hommes', 'lunettes', 'vetements'), children: [] },
          { name: 'Lunettes de vue femmes', slug: 'lunettes-vue-femmes', level: 3, icon: generateIconUrl('lunettes-vue-femmes', 'lunettes', 'vetements'), children: [] },
          { name: 'Lunettes de soleil hommes', slug: 'lunettes-soleil-hommes', level: 3, icon: generateIconUrl('lunettes-soleil-hommes', 'lunettes', 'vetements'), children: [] },
          { name: 'Lunettes de soleil femmes', slug: 'lunettes-soleil-femmes', level: 3, icon: generateIconUrl('lunettes-soleil-femmes', 'lunettes', 'vetements'), children: [] },
          { name: 'Lunettes de vue enfants', slug: 'lunettes-vue-enfants', level: 3, icon: generateIconUrl('lunettes-vue-enfants', 'lunettes', 'vetements'), children: [] },
          { name: 'Lunettes de soleil enfants', slug: 'lunettes-soleil-enfants', level: 3, icon: generateIconUrl('lunettes-soleil-enfants', 'lunettes', 'vetements'), children: [] },
          { name: 'Accessoires', slug: 'accessoires-lunettes', level: 3, icon: generateIconUrl('accessoires-lunettes', 'lunettes', 'vetements'), children: [] }
        ]
      },
      {
        name: 'Bijoux',
        slug: 'bijoux',
        level: 2,
        icon: generateIconUrl('bijoux', 'vetements'),
        order: 11,
        children: [
          { name: 'Parures', slug: 'parures', level: 3, icon: generateIconUrl('parures', 'bijoux', 'vetements'), children: [] },
          { name: 'Colliers & Pendentifs', slug: 'colliers-pendentifs', level: 3, icon: generateIconUrl('colliers-pendentifs', 'bijoux', 'vetements'), children: [] },
          { name: 'Bracelets', slug: 'bracelets', level: 3, icon: generateIconUrl('bracelets', 'bijoux', 'vetements'), children: [] },
          { name: 'Bagues', slug: 'bagues', level: 3, icon: generateIconUrl('bagues', 'bijoux', 'vetements'), children: [] },
          { name: 'Boucles', slug: 'boucles', level: 3, icon: generateIconUrl('boucles', 'bijoux', 'vetements'), children: [] },
          { name: 'Chevillières', slug: 'chevilleres', level: 3, icon: generateIconUrl('chevilleres', 'bijoux', 'vetements'), children: [] },
          { name: 'Piercings', slug: 'piercings', level: 3, icon: generateIconUrl('piercings', 'bijoux', 'vetements'), children: [] },
          { name: 'Accessoires cheveux', slug: 'accessoires-cheveux', level: 3, icon: generateIconUrl('accessoires-cheveux', 'bijoux', 'vetements'), children: [] },
          { name: 'Broches', slug: 'broches', level: 3, icon: generateIconUrl('broches', 'bijoux', 'vetements'), children: [] },
          { name: 'Autre', slug: 'autre-bijoux', level: 3, icon: generateIconUrl('autre-bijoux', 'bijoux', 'vetements'), children: [] }
        ]
      },
      {
        name: 'Tenues professionnelles',
        slug: 'tenues-professionnelles',
        level: 2,
        icon: generateIconUrl('tenues-professionnelles', 'vetements'),
        order: 12,
        children: []
      }
    ]
  },

  // ==================== 3. ELECTROMENAGER ====================
  {
    name: 'Electromenager',
    slug: 'electromenager',
    level: 1,
    icon: generateIconUrl('electromenager'),
    order: 7,
    children: [
      { name: 'Téléviseurs', slug: 'televiseurs', level: 2, icon: generateIconUrl('televiseurs', 'electromenager'), order: 1, children: [] },
      { name: 'Démodulateurs & Box TV', slug: 'demodulateurs-box-tv', level: 2, icon: generateIconUrl('demodulateurs-box-tv', 'electromenager'), order: 2, children: [] },
      { name: 'Paraboles & Switch TV', slug: 'paraboles-switch-tv', level: 2, icon: generateIconUrl('paraboles-switch-tv', 'electromenager'), order: 3, children: [] },
      { name: 'Abonnements IPTV', slug: 'abonnements-iptv', level: 2, icon: generateIconUrl('abonnements-iptv', 'electromenager'), order: 4, children: [] },
      { name: 'Caméras & Accessories', slug: 'cameras-accessories', level: 2, icon: generateIconUrl('cameras-accessories', 'electromenager'), order: 5, children: [] },
      { name: 'Audio', slug: 'audio', level: 2, icon: generateIconUrl('audio', 'electromenager'), order: 6, children: [] },
      { name: 'Aspirateurs & Nettoyeurs', slug: 'aspirateurs-nettoyeurs', level: 2, icon: generateIconUrl('aspirateurs-nettoyeurs', 'electromenager'), order: 7, children: [] },
      { name: 'Repassage', slug: 'repassage', level: 2, icon: generateIconUrl('repassage', 'electromenager'), order: 8, children: [] },
      { name: 'Beauté & Hygiène', slug: 'beaute-hygiene', level: 2, icon: generateIconUrl('beaute-hygiene', 'electromenager'), order: 9, children: [] },
      { name: 'Machines à coudre', slug: 'machines-coudre', level: 2, icon: generateIconUrl('machines-coudre', 'electromenager'), order: 10, children: [] },
      { name: 'Télécommandes', slug: 'telecommandes', level: 2, icon: generateIconUrl('telecommandes', 'electromenager'), order: 11, children: [] },
      { name: 'Sécurité & GPS', slug: 'securite-gps', level: 2, icon: generateIconUrl('securite-gps', 'electromenager'), order: 12, children: [] },
      { name: 'Composants électroniques', slug: 'composants-electroniques', level: 2, icon: generateIconUrl('composants-electroniques', 'electromenager'), order: 13, children: [] },
      { name: 'Pièces de rechange', slug: 'pieces-rechange', level: 2, icon: generateIconUrl('pieces-rechange', 'electromenager'), order: 14, children: [] },
      { name: 'Autre Électroménager', slug: 'autre-electromenager', level: 2, icon: generateIconUrl('autre-electromenager', 'electromenager'), order: 15, children: [] },
      {
        name: 'Réfrigérateurs & Congélateurs',
        slug: 'refrigerateurs-congelateurs',
        level: 2,
        icon: generateIconUrl('refrigerateurs-congelateurs', 'electromenager'),
        order: 16,
        children: [
          { name: 'Réfrigérateur', slug: 'refrigerateur', level: 3, icon: generateIconUrl('refrigerateur', 'refrigerateurs-congelateurs', 'electromenager'), children: [] },
          { name: 'Congélateur', slug: 'congelateur', level: 3, icon: generateIconUrl('congelateur', 'refrigerateurs-congelateurs', 'electromenager'), children: [] },
          { name: 'Réfrigérateur-Congélateur', slug: 'refrigerateur-congelateur', level: 3, icon: generateIconUrl('refrigerateur-congelateur', 'refrigerateurs-congelateurs', 'electromenager'), children: [] },
          { name: 'Cave à vin', slug: 'cave-vin', level: 3, icon: generateIconUrl('cave-vin', 'refrigerateurs-congelateurs', 'electromenager'), children: [] }
        ]
      },
      {
        name: 'Machines à laver',
        slug: 'machines-laver',
        level: 2,
        icon: generateIconUrl('machines-laver', 'electromenager'),
        order: 17,
        children: [
          { name: 'Lave-linge', slug: 'lave-linge', level: 3, icon: generateIconUrl('lave-linge', 'machines-laver', 'electromenager'), children: [] },
          { name: 'Sèche-linge', slug: 'seche-linge', level: 3, icon: generateIconUrl('seche-linge', 'machines-laver', 'electromenager'), children: [] },
          { name: 'Lave-linge/Sèche-linge', slug: 'lave-linge-seche-linge', level: 3, icon: generateIconUrl('lave-linge-seche-linge', 'machines-laver', 'electromenager'), children: [] },
          { name: 'Lave-linge avec essorage', slug: 'lave-linge-essorage', level: 3, icon: generateIconUrl('lave-linge-essorage', 'machines-laver', 'electromenager'), children: [] }
        ]
      },
      {
        name: 'Lave-vaisselles',
        slug: 'lave-vaisselles',
        level: 2,
        icon: generateIconUrl('lave-vaisselles', 'electromenager'),
        order: 18,
        children: [
          { name: 'Lave-vaisselle encastrable', slug: 'lave-vaisselle-encastrable', level: 3, icon: generateIconUrl('lave-vaisselle-encastrable', 'lave-vaisselles', 'electromenager'), children: [] },
          { name: 'Lave-vaisselle pose libre', slug: 'lave-vaisselle-poselibre', level: 3, icon: generateIconUrl('lave-vaisselle-poselibre', 'lave-vaisselles', 'electromenager'), children: [] },
          { name: 'Lave-vaisselle compact', slug: 'lave-vaisselle-compact', level: 3, icon: generateIconUrl('lave-vaisselle-compact', 'lave-vaisselles', 'electromenager'), children: [] }
        ]
      },
      {
        name: 'Fours & Cuisson',
        slug: 'fours-cuisson',
        level: 2,
        icon: generateIconUrl('fours-cuisson', 'electromenager'),
        order: 19,
        children: [
          { name: 'Four électrique', slug: 'four-electrique', level: 3, icon: generateIconUrl('four-electrique', 'fours-cuisson', 'electromenager'), children: [] },
          { name: 'Four à gaz', slug: 'four-gaz', level: 3, icon: generateIconUrl('four-gaz', 'fours-cuisson', 'electromenager'), children: [] },
          { name: 'Four micro-ondes', slug: 'four-micro-ondes', level: 3, icon: generateIconUrl('four-micro-ondes', 'fours-cuisson', 'electromenager'), children: [] },
          { name: 'Plaque de cuisson', slug: 'plaque-cuisson', level: 3, icon: generateIconUrl('plaque-cuisson', 'fours-cuisson', 'electromenager'), children: [] },
          { name: 'Cuisinière', slug: 'cuisiniere', level: 3, icon: generateIconUrl('cuisiniere', 'fours-cuisson', 'electromenager'), children: [] }
        ]
      },
      {
        name: 'Chauffage & Climatisation',
        slug: 'chauffage-climatisation',
        level: 2,
        icon: generateIconUrl('chauffage-climatisation', 'electromenager'),
        order: 20,
        children: [
          { name: 'Climatiseur', slug: 'climatiseur', level: 3, icon: generateIconUrl('climatiseur', 'chauffage-climatisation', 'electromenager'), children: [] },
          { name: 'Ventilateur', slug: 'ventilateur', level: 3, icon: generateIconUrl('ventilateur', 'chauffage-climatisation', 'electromenager'), children: [] },
          { name: 'Radiateur', slug: 'radiateur', level: 3, icon: generateIconUrl('radiateur', 'chauffage-climatisation', 'electromenager'), children: [] },
          { name: 'Chauffe-eau', slug: 'chauffe-eau', level: 3, icon: generateIconUrl('chauffe-eau', 'chauffage-climatisation', 'electromenager'), children: [] },
          { name: 'Pompe à chaleur', slug: 'pompe-chaleur', level: 3, icon: generateIconUrl('pompe-chaleur', 'chauffage-climatisation', 'electromenager'), children: [] }
        ]
      },
      {
        name: 'Appareils de cuisine',
        slug: 'appareils-cuisine',
        level: 2,
        icon: generateIconUrl('appareils-cuisine', 'electromenager'),
        order: 21,
        children: [
          { name: 'Robot de cuisine', slug: 'robot-cuisine', level: 3, icon: generateIconUrl('robot-cuisine', 'appareils-cuisine', 'electromenager'), children: [] },
          { name: 'Mixeur', slug: 'mixeur', level: 3, icon: generateIconUrl('mixeur', 'appareils-cuisine', 'electromenager'), children: [] },
          { name: 'Bouilloire', slug: 'bouilloire', level: 3, icon: generateIconUrl('bouilloire', 'appareils-cuisine', 'electromenager'), children: [] },
          { name: 'Cafetière', slug: 'cafetiere', level: 3, icon: generateIconUrl('cafetiere', 'appareils-cuisine', 'electromenager'), children: [] },
          { name: 'Grille-pain', slug: 'grille-pain', level: 3, icon: generateIconUrl('grille-pain', 'appareils-cuisine', 'electromenager'), children: [] }
        ]
      }
    ]
  },

  // ==================== 4. IMMOBILIER ====================
  {
    name: 'Immobilier',
    slug: 'immobilier',
    level: 1,
    icon: generateIconUrl('immobilier'),
    order: 2,
    children: [
      {
        name: 'Vente',
        slug: 'vente',
        level: 2,
        icon: generateIconUrl('vente', 'immobilier'),
        order: 1,
        children: [
          { name: 'Appartement', slug: 'appartement', level: 3, icon: generateIconUrl('appartement', 'vente', 'immobilier'), children: [] },
          { name: 'Local', slug: 'local', level: 3, icon: generateIconUrl('local', 'vente', 'immobilier'), children: [] },
          { name: 'Villa', slug: 'villa', level: 3, icon: generateIconUrl('villa', 'vente', 'immobilier'), children: [] },
          { name: 'Terrain', slug: 'terrain', level: 3, icon: generateIconUrl('terrain', 'vente', 'immobilier'), children: [] },
          { name: 'Terrain Agricole', slug: 'terrain-agricole', level: 3, icon: generateIconUrl('terrain-agricole', 'vente', 'immobilier'), children: [] },
          { name: 'Immeuble', slug: 'immeuble', level: 3, icon: generateIconUrl('immeuble', 'vente', 'immobilier'), children: [] },
          { name: 'Bungalow', slug: 'bungalow', level: 3, icon: generateIconUrl('bungalow', 'vente', 'immobilier'), children: [] },
          { name: 'Hangar - Usine', slug: 'hangar-usine', level: 3, icon: generateIconUrl('hangar-usine', 'vente', 'immobilier'), children: [] },
          { name: 'Autre', slug: 'autre-vente', level: 3, icon: generateIconUrl('autre-vente', 'vente', 'immobilier'), children: [] }
        ]
      },
      {
        name: 'Location',
        slug: 'location',
        level: 2,
        icon: generateIconUrl('location', 'immobilier'),
        order: 2,
        children: [
          { name: 'Appartement', slug: 'appartement-location', level: 3, icon: generateIconUrl('appartement-location', 'location', 'immobilier'), children: [] },
          { name: 'Local', slug: 'local-location', level: 3, icon: generateIconUrl('local-location', 'location', 'immobilier'), children: [] },
          { name: 'Villa', slug: 'villa-location', level: 3, icon: generateIconUrl('villa-location', 'location', 'immobilier'), children: [] },
          { name: 'Immeuble', slug: 'immeuble-location', level: 3, icon: generateIconUrl('immeuble-location', 'location', 'immobilier'), children: [] },
          { name: 'Bungalow', slug: 'bungalow-location', level: 3, icon: generateIconUrl('bungalow-location', 'location', 'immobilier'), children: [] },
          { name: 'Autre', slug: 'autre-location', level: 3, icon: generateIconUrl('autre-location', 'location', 'immobilier'), children: [] }
        ]
      },
      {
        name: 'Location vacances',
        slug: 'location-vacances',
        level: 2,
        icon: generateIconUrl('location-vacances', 'immobilier'),
        order: 3,
        children: [
          { name: 'Appartement', slug: 'appartement-vacances', level: 3, icon: generateIconUrl('appartement-vacances', 'location-vacances', 'immobilier'), children: [] },
          { name: 'Villa', slug: 'villa-vacances', level: 3, icon: generateIconUrl('villa-vacances', 'location-vacances', 'immobilier'), children: [] },
          { name: 'Bungalow', slug: 'bungalow-vacances', level: 3, icon: generateIconUrl('bungalow-vacances', 'location-vacances', 'immobilier'), children: [] },
          { name: 'Autre', slug: 'autre-vacances', level: 3, icon: generateIconUrl('autre-vacances', 'location-vacances', 'immobilier'), children: [] }
        ]
      },
      {
        name: 'Cherche location',
        slug: 'cherche-location',
        level: 2,
        icon: generateIconUrl('cherche-location', 'immobilier'),
        order: 4,
        children: [
          { name: 'Appartement', slug: 'appartement-cherche-location', level: 3, icon: generateIconUrl('appartement-cherche-location', 'cherche-location', 'immobilier'), children: [] },
          { name: 'Local', slug: 'local-cherche-location', level: 3, icon: generateIconUrl('local-cherche-location', 'cherche-location', 'immobilier'), children: [] },
          { name: 'Villa', slug: 'villa-cherche-location', level: 3, icon: generateIconUrl('villa-cherche-location', 'cherche-location', 'immobilier'), children: [] },
          { name: 'Immeuble', slug: 'immeuble-cherche-location', level: 3, icon: generateIconUrl('immeuble-cherche-location', 'cherche-location', 'immobilier'), children: [] },
          { name: 'Bungalow', slug: 'bungalow-cherche-location', level: 3, icon: generateIconUrl('bungalow-cherche-location', 'cherche-location', 'immobilier'), children: [] },
          { name: 'Autre', slug: 'autre-cherche-location', level: 3, icon: generateIconUrl('autre-cherche-location', 'cherche-location', 'immobilier'), children: [] }
        ]
      },
      {
        name: 'Cherche achat',
        slug: 'cherche-achat',
        level: 2,
        icon: generateIconUrl('cherche-achat', 'immobilier'),
        order: 5,
        children: [
          { name: 'Appartement', slug: 'appartement-cherche-achat', level: 3, icon: generateIconUrl('appartement-cherche-achat', 'cherche-achat', 'immobilier'), children: [] },
          { name: 'Local', slug: 'local-cherche-achat', level: 3, icon: generateIconUrl('local-cherche-achat', 'cherche-achat', 'immobilier'), children: [] },
          { name: 'Villa', slug: 'villa-cherche-achat', level: 3, icon: generateIconUrl('villa-cherche-achat', 'cherche-achat', 'immobilier'), children: [] },
          { name: 'Terrain', slug: 'terrain-cherche-achat', level: 3, icon: generateIconUrl('terrain-cherche-achat', 'cherche-achat', 'immobilier'), children: [] },
          { name: 'Terrain Agricole', slug: 'terrain-agricole-cherche-achat', level: 3, icon: generateIconUrl('terrain-agricole-cherche-achat', 'cherche-achat', 'immobilier'), children: [] },
          { name: 'Immeuble', slug: 'immeuble-cherche-achat', level: 3, icon: generateIconUrl('immeuble-cherche-achat', 'cherche-achat', 'immobilier'), children: [] },
          { name: 'Bungalow', slug: 'bungalow-cherche-achat', level: 3, icon: generateIconUrl('bungalow-cherche-achat', 'cherche-achat', 'immobilier'), children: [] },
          { name: 'Hangar - Usine', slug: 'hangar-usine-cherche-achat', level: 3, icon: generateIconUrl('hangar-usine-cherche-achat', 'cherche-achat', 'immobilier'), children: [] },
          { name: 'Autre', slug: 'autre-cherche-achat', level: 3, icon: generateIconUrl('autre-cherche-achat', 'cherche-achat', 'immobilier'), children: [] }
        ]
      }
    ]
  },

  // ==================== 5. ALIMENTAIRES ====================
  {
    name: 'Alimentaires',
    slug: 'alimentaires',
    level: 1,
    icon: generateIconUrl('alimentaires'),
    order: 15,
    children: [
      { name: 'Produits laitiers', slug: 'produits-laitiers', level: 2, icon: generateIconUrl('produits-laitiers', 'alimentaires'), order: 1, children: [] },
      { name: 'Fruits secs', slug: 'fruits-secs', level: 2, icon: generateIconUrl('fruits-secs', 'alimentaires'), order: 2, children: [] },
      { name: 'Graines - Riz - Céréales', slug: 'graines-riz-cereales', level: 2, icon: generateIconUrl('graines-riz-cereales', 'alimentaires'), order: 3, children: [] },
      { name: 'Sucres & Produits sucrés', slug: 'sucres-produits-sucres', level: 2, icon: generateIconUrl('sucres-produits-sucres', 'alimentaires'), order: 4, children: [] },
      { name: 'Boissons', slug: 'boissons', level: 2, icon: generateIconUrl('boissons', 'alimentaires'), order: 5, children: [] },
      { name: 'Viandes & Poissons', slug: 'viandes-poissons', level: 2, icon: generateIconUrl('viandes-poissons', 'alimentaires'), order: 6, children: [] },
      { name: 'Café - Thé - Infusion', slug: 'cafe-the-infusion', level: 2, icon: generateIconUrl('cafe-the-infusion', 'alimentaires'), order: 7, children: [] },
      { name: 'Compléments alimentaires', slug: 'complements-alimentaires', level: 2, icon: generateIconUrl('complements-alimentaires', 'alimentaires'), order: 8, children: [] },
      { name: 'Miel & Dérivés', slug: 'miel-derives', level: 2, icon: generateIconUrl('miel-derives', 'alimentaires'), order: 9, children: [] },
      { name: 'Fruits & Légumes', slug: 'fruits-legumes', level: 2, icon: generateIconUrl('fruits-legumes', 'alimentaires'), order: 10, children: [] },
      { name: 'Blé & Farine', slug: 'ble-farine', level: 2, icon: generateIconUrl('ble-farine', 'alimentaires'), order: 11, children: [] },
      { name: 'Bonbons & Chocolat', slug: 'bonbons-chocolat', level: 2, icon: generateIconUrl('bonbons-chocolat', 'alimentaires'), order: 12, children: [] },
      { name: 'Boulangerie & Viennoiserie', slug: 'boulangerie-viennoiserie', level: 2, icon: generateIconUrl('boulangerie-viennoiserie', 'alimentaires'), order: 13, children: [] },
      { name: 'Ingrédients cuisine et pâtisserie', slug: 'ingredients-cuisine-patisserie', level: 2, icon: generateIconUrl('ingredients-cuisine-patisserie', 'alimentaires'), order: 14, children: [] },
      { name: 'Noix & Graines', slug: 'noix-graines', level: 2, icon: generateIconUrl('noix-graines', 'alimentaires'), order: 15, children: [] },
      { name: 'Plats cuisinés', slug: 'plats-cuisines', level: 2, icon: generateIconUrl('plats-cuisines', 'alimentaires'), order: 16, children: [] },
      { name: 'Sauces - Epices - Condiments', slug: 'sauces-epices-condiments', level: 2, icon: generateIconUrl('sauces-epices-condiments', 'alimentaires'), order: 17, children: [] },
      { name: 'Œufs', slug: 'oeufs', level: 2, icon: generateIconUrl('oeufs', 'alimentaires'), order: 18, children: [] },
      { name: 'Huiles', slug: 'huiles', level: 2, icon: generateIconUrl('huiles', 'alimentaires'), order: 19, children: [] },
      { name: 'Pâtes', slug: 'pates', level: 2, icon: generateIconUrl('pates', 'alimentaires'), order: 20, children: [] },
      { name: 'Gateaux', slug: 'gateaux', level: 2, icon: generateIconUrl('gateaux', 'alimentaires'), order: 21, children: [] },
      { name: 'Emballage', slug: 'emballage', level: 2, icon: generateIconUrl('emballage', 'alimentaires'), order: 22, children: [] },
      { name: 'Aliments pour bébé', slug: 'aliments-bebe', level: 2, icon: generateIconUrl('aliments-bebe', 'alimentaires'), order: 23, children: [] },
      { name: 'Aliments diététiques', slug: 'aliments-dietetiques', level: 2, icon: generateIconUrl('aliments-dietetiques', 'alimentaires'), order: 24, children: [] },
      { name: 'Autre Alimentaires', slug: 'autre-alimentaires', level: 2, icon: generateIconUrl('autre-alimentaires', 'alimentaires'), order: 25, children: [] }
    ]
  },

  // ==================== 6. EMPLOI ====================
  {
    name: 'Emploi',
    slug: 'emploi',
    level: 1,
    icon: generateIconUrl('emploi'),
    order: 13,
    children: [
      { name: 'Offres d\'emploi', slug: 'offres-emploi', level: 2, icon: generateIconUrl('offres-emploi', 'emploi'), order: 1, children: [] },
      { name: 'Demandes d\'emploi', slug: 'demandes-emploi', level: 2, icon: generateIconUrl('demandes-emploi', 'emploi'), order: 2, children: [] },
      { name: 'Autres services emploi', slug: 'autres-services-emploi', level: 2, icon: generateIconUrl('autres-services-emploi', 'emploi'), order: 3, children: [] }
    ]
  },

  // ==================== 7. INFORMATIQUE ====================
  {
    name: 'Informatique',
    slug: 'informatique',
    level: 1,
    icon: generateIconUrl('informatique'),
    order: 5,
    children: [
      {
        name: 'Ordinateurs portables',
        slug: 'ordinateurs-portables',
        level: 2,
        icon: generateIconUrl('ordinateurs-portables', 'informatique'),
        order: 1,
        children: [
          { name: 'Pc Portable', slug: 'pc-portable', level: 3, icon: generateIconUrl('pc-portable', 'ordinateurs-portables', 'informatique'), children: [] },
          { name: 'Macbooks', slug: 'macbooks', level: 3, icon: generateIconUrl('macbooks', 'ordinateurs-portables', 'informatique'), children: [] }
        ]
      },
      {
        name: 'Ordinateurs de bureau',
        slug: 'ordinateurs-bureau',
        level: 2,
        icon: generateIconUrl('ordinateurs-bureau', 'informatique'),
        order: 2,
        children: [
          { name: 'Pc de bureau', slug: 'pc-bureau', level: 3, icon: generateIconUrl('pc-bureau', 'ordinateurs-bureau', 'informatique'), children: [] },
          { name: 'Unités centrales', slug: 'unites-centrales', level: 3, icon: generateIconUrl('unites-centrales', 'ordinateurs-bureau', 'informatique'), children: [] },
          { name: 'All In One', slug: 'all-in-one', level: 3, icon: generateIconUrl('all-in-one', 'ordinateurs-bureau', 'informatique'), children: [] }
        ]
      },
      {
        name: 'Composants PC fixe',
        slug: 'composants-pc-fixe',
        level: 2,
        icon: generateIconUrl('composants-pc-fixe', 'informatique'),
        order: 3,
        children: [
          { name: 'Cartes mère', slug: 'cartes-mere', level: 3, icon: generateIconUrl('cartes-mere', 'composants-pc-fixe', 'informatique'), children: [] },
          { name: 'Processeurs', slug: 'processeurs', level: 3, icon: generateIconUrl('processeurs', 'composants-pc-fixe', 'informatique'), children: [] },
          { name: 'RAM', slug: 'ram', level: 3, icon: generateIconUrl('ram', 'composants-pc-fixe', 'informatique'), children: [] },
          { name: 'Disques dur', slug: 'disques-dur', level: 3, icon: generateIconUrl('disques-dur', 'composants-pc-fixe', 'informatique'), children: [] },
          { name: 'Cartes graphique', slug: 'cartes-graphique', level: 3, icon: generateIconUrl('cartes-graphique', 'composants-pc-fixe', 'informatique'), children: [] },
          { name: 'Alimentations & Boitiers', slug: 'alimentations-boitiers', level: 3, icon: generateIconUrl('alimentations-boitiers', 'composants-pc-fixe', 'informatique'), children: [] },
          { name: 'Refroidissement', slug: 'refroidissement', level: 3, icon: generateIconUrl('refroidissement', 'composants-pc-fixe', 'informatique'), children: [] },
          { name: 'Lecteurs & Graveurs CD', slug: 'lecteurs-graveurs-cd', level: 3, icon: generateIconUrl('lecteurs-graveurs-cd', 'composants-pc-fixe', 'informatique'), children: [] },
          { name: 'Autres', slug: 'autres-composants-fixe', level: 3, icon: generateIconUrl('autres-composants-fixe', 'composants-pc-fixe', 'informatique'), children: [] }
        ]
      },
      {
        name: 'Composants PC portable',
        slug: 'composants-pc-portable',
        level: 2,
        icon: generateIconUrl('composants-pc-portable', 'informatique'),
        order: 4,
        children: [
          { name: 'Chargeurs', slug: 'chargeurs', level: 3, icon: generateIconUrl('chargeurs', 'composants-pc-portable', 'informatique'), children: [] },
          { name: 'Batteries', slug: 'batteries', level: 3, icon: generateIconUrl('batteries', 'composants-pc-portable', 'informatique'), children: [] },
          { name: 'Ecrans', slug: 'ecrans-portable', level: 3, icon: generateIconUrl('ecrans-portable', 'composants-pc-portable', 'informatique'), children: [] },
          { name: 'Claviers & Touchpads', slug: 'claviers-touchpads', level: 3, icon: generateIconUrl('claviers-touchpads', 'composants-pc-portable', 'informatique'), children: [] },
          { name: 'Disques Dur', slug: 'disques-dur-portable', level: 3, icon: generateIconUrl('disques-dur-portable', 'composants-pc-portable', 'informatique'), children: [] },
          { name: 'RAM', slug: 'ram-portable', level: 3, icon: generateIconUrl('ram-portable', 'composants-pc-portable', 'informatique'), children: [] },
          { name: 'Refroidissement', slug: 'refroidissement-portable', level: 3, icon: generateIconUrl('refroidissement-portable', 'composants-pc-portable', 'informatique'), children: [] },
          { name: 'Cartes mère', slug: 'cartes-mere-portable', level: 3, icon: generateIconUrl('cartes-mere-portable', 'composants-pc-portable', 'informatique'), children: [] },
          { name: 'Processeurs', slug: 'processeurs-portable', level: 3, icon: generateIconUrl('processeurs-portable', 'composants-pc-portable', 'informatique'), children: [] },
          { name: 'Cartes graphique', slug: 'cartes-graphique-portable', level: 3, icon: generateIconUrl('cartes-graphique-portable', 'composants-pc-portable', 'informatique'), children: [] },
          { name: 'Lecteurs & Graveurs', slug: 'lecteurs-graveurs-portable', level: 3, icon: generateIconUrl('lecteurs-graveurs-portable', 'composants-pc-portable', 'informatique'), children: [] },
          { name: 'Baffles & Webcams', slug: 'baffles-webcams', level: 3, icon: generateIconUrl('baffles-webcams', 'composants-pc-portable', 'informatique'), children: [] },
          { name: 'Autres', slug: 'autres-composants-portable', level: 3, icon: generateIconUrl('autres-composants-portable', 'composants-pc-portable', 'informatique'), children: [] }
        ]
      },
      {
        name: 'Composants serveur',
        slug: 'composants-serveur',
        level: 2,
        icon: generateIconUrl('composants-serveur', 'informatique'),
        order: 5,
        children: [
          { name: 'Cartes mère', slug: 'cartes-mere-serveur', level: 3, icon: generateIconUrl('cartes-mere-serveur', 'composants-serveur', 'informatique'), children: [] },
          { name: 'Processeurs', slug: 'processeurs-serveur', level: 3, icon: generateIconUrl('processeurs-serveur', 'composants-serveur', 'informatique'), children: [] },
          { name: 'RAM', slug: 'ram-serveur', level: 3, icon: generateIconUrl('ram-serveur', 'composants-serveur', 'informatique'), children: [] },
          { name: 'Disques dur', slug: 'disques-dur-serveur', level: 3, icon: generateIconUrl('disques-dur-serveur', 'composants-serveur', 'informatique'), children: [] },
          { name: 'Cartes réseau', slug: 'cartes-reseau-serveur', level: 3, icon: generateIconUrl('cartes-reseau-serveur', 'composants-serveur', 'informatique'), children: [] },
          { name: 'Alimentations', slug: 'alimentations-serveur', level: 3, icon: generateIconUrl('alimentations-serveur', 'composants-serveur', 'informatique'), children: [] },
          { name: 'Refroidissement', slug: 'refroidissement-serveur', level: 3, icon: generateIconUrl('refroidissement-serveur', 'composants-serveur', 'informatique'), children: [] },
          { name: 'Cartes graphique', slug: 'cartes-graphique-serveur', level: 3, icon: generateIconUrl('cartes-graphique-serveur', 'composants-serveur', 'informatique'), children: [] },
          { name: 'Autres', slug: 'autres-composants-serveur', level: 3, icon: generateIconUrl('autres-composants-serveur', 'composants-serveur', 'informatique'), children: [] }
        ]
      },
      {
        name: 'Imprimantes & Cartouches',
        slug: 'imprimantes-cartouches',
        level: 2,
        icon: generateIconUrl('imprimantes-cartouches', 'informatique'),
        order: 6,
        children: [
          { name: 'Imprimantes jet d\'encre', slug: 'imprimantes-jet-encre', level: 3, icon: generateIconUrl('imprimantes-jet-encre', 'imprimantes-cartouches', 'informatique'), children: [] },
          { name: 'Imprimantes Laser', slug: 'imprimantes-laser', level: 3, icon: generateIconUrl('imprimantes-laser', 'imprimantes-cartouches', 'informatique'), children: [] },
          { name: 'Imprimantes matricielles', slug: 'imprimantes-matricielles', level: 3, icon: generateIconUrl('imprimantes-matricielles', 'imprimantes-cartouches', 'informatique'), children: [] },
          { name: 'Codes à barre & Etiqueteuses', slug: 'codes-barre-etiqueteuses', level: 3, icon: generateIconUrl('codes-barre-etiqueteuses', 'imprimantes-cartouches', 'informatique'), children: [] },
          { name: 'Imprimantes photo & badges', slug: 'imprimantes-photo-badges', level: 3, icon: generateIconUrl('imprimantes-photo-badges', 'imprimantes-cartouches', 'informatique'), children: [] },
          { name: 'Photocopieuses professionnelles', slug: 'photocopieuses-professionnelles', level: 3, icon: generateIconUrl('photocopieuses-professionnelles', 'imprimantes-cartouches', 'informatique'), children: [] },
          { name: 'Imprimantes 3D', slug: 'imprimantes-3d', level: 3, icon: generateIconUrl('imprimantes-3d', 'imprimantes-cartouches', 'informatique'), children: [] },
          { name: 'Cartouches & Toners', slug: 'cartouches-toners', level: 3, icon: generateIconUrl('cartouches-toners', 'imprimantes-cartouches', 'informatique'), children: [] },
          { name: 'Autre', slug: 'autre-imprimantes', level: 3, icon: generateIconUrl('autre-imprimantes', 'imprimantes-cartouches', 'informatique'), children: [] }
        ]
      },
      {
        name: 'Réseau & Connexion',
        slug: 'reseau-connexion',
        level: 2,
        icon: generateIconUrl('reseau-connexion', 'informatique'),
        order: 7,
        children: [
          { name: 'Modems & Routeurs', slug: 'modems-routeurs', level: 3, icon: generateIconUrl('modems-routeurs', 'reseau-connexion', 'informatique'), children: [] },
          { name: 'Switchs', slug: 'switchs', level: 3, icon: generateIconUrl('switchs', 'reseau-connexion', 'informatique'), children: [] },
          { name: 'Point d\'accès wifi', slug: 'point-acces-wifi', level: 3, icon: generateIconUrl('point-acces-wifi', 'reseau-connexion', 'informatique'), children: [] },
          { name: 'Répéteur Wi-Fi', slug: 'repeater-wifi', level: 3, icon: generateIconUrl('repeater-wifi', 'reseau-connexion', 'informatique'), children: [] },
          { name: 'Cartes réseau', slug: 'cartes-reseau', level: 3, icon: generateIconUrl('cartes-reseau', 'reseau-connexion', 'informatique'), children: [] },
          { name: 'Autre', slug: 'autre-reseau', level: 3, icon: generateIconUrl('autre-reseau', 'reseau-connexion', 'informatique'), children: [] }
        ]
      },
      {
        name: 'Stockage externe & Racks',
        slug: 'stockage-externe-racks',
        level: 2,
        icon: generateIconUrl('stockage-externe-racks', 'informatique'),
        order: 8,
        children: [
          { name: 'Disques durs', slug: 'disques-durs', level: 3, icon: generateIconUrl('disques-durs', 'stockage-externe-racks', 'informatique'), children: [] },
          { name: 'Flash disque', slug: 'flash-disque', level: 3, icon: generateIconUrl('flash-disque', 'stockage-externe-racks', 'informatique'), children: [] },
          { name: 'Carte mémoire', slug: 'carte-memoire', level: 3, icon: generateIconUrl('carte-memoire', 'stockage-externe-racks', 'informatique'), children: [] },
          { name: 'Rack', slug: 'rack', level: 3, icon: generateIconUrl('rack', 'stockage-externe-racks', 'informatique'), children: [] }
        ]
      },
      { name: 'Serveurs', slug: 'serveurs', level: 2, icon: generateIconUrl('serveurs', 'informatique'), order: 9, children: [] },
      { name: 'Ecrans', slug: 'ecrans', level: 2, icon: generateIconUrl('ecrans', 'informatique'), order: 10, children: [] },
      { name: 'Onduleurs & Stabilisateurs', slug: 'onduleurs-stabilisateurs', level: 2, icon: generateIconUrl('onduleurs-stabilisateurs', 'informatique'), order: 11, children: [] },
      { name: 'Compteuses de billets', slug: 'compteuses-billets', level: 2, icon: generateIconUrl('compteuses-billets', 'informatique'), order: 12, children: [] },
      { name: 'Claviers & Souris', slug: 'claviers-souris', level: 2, icon: generateIconUrl('claviers-souris', 'informatique'), order: 13, children: [] },
      { name: 'Casques & Son', slug: 'casques-son', level: 2, icon: generateIconUrl('casques-son', 'informatique'), order: 14, children: [] },
      { name: 'Webcam & Vidéoconférence', slug: 'webcam-videoconference', level: 2, icon: generateIconUrl('webcam-videoconference', 'informatique'), order: 15, children: [] },
      { name: 'Data shows', slug: 'data-shows', level: 2, icon: generateIconUrl('data-shows', 'informatique'), order: 16, children: [] },
      { name: 'Câbles & Adaptateurs', slug: 'cables-adaptateurs', level: 2, icon: generateIconUrl('cables-adaptateurs', 'informatique'), order: 17, children: [] },
      { name: 'Stylets & Tablettes', slug: 'stylers-tablettes', level: 2, icon: generateIconUrl('stylers-tablettes', 'informatique'), order: 18, children: [] },
      { name: 'Cartables & Sacoches', slug: 'cartables-sacoches', level: 2, icon: generateIconUrl('cartables-sacoches', 'informatique'), order: 19, children: [] },
      { name: 'Manettes & Simulateurs', slug: 'manettes-simulateurs', level: 2, icon: generateIconUrl('manettes-simulateurs', 'informatique'), order: 20, children: [] },
      { name: 'VR', slug: 'vr', level: 2, icon: generateIconUrl('vr', 'informatique'), order: 21, children: [] },
      { name: 'Logiciels & Abonnements', slug: 'logiciels-abonnements', level: 2, icon: generateIconUrl('logiciels-abonnements', 'informatique'), order: 22, children: [] },
      { name: 'Bureautique', slug: 'bureautique', level: 2, icon: generateIconUrl('bureautique', 'informatique'), order: 23, children: [] },
      { name: 'Autre Informatique', slug: 'autre-informatique', level: 2, icon: generateIconUrl('autre-informatique', 'informatique'), order: 24, children: [] }
    ]
  },

  // ==================== 8. LOISIRS ====================
  {
    name: 'Loisirs & Divertissements',
    slug: 'loisirs',
    level: 1,
    icon: generateIconUrl('loisirs'),
    order: 11,
    children: [
      {
        name: 'Animalerie',
        slug: 'animalerie',
        level: 2,
        icon: generateIconUrl('animalerie', 'loisirs'),
        order: 1,
        children: [
          { name: 'Produits de soin animal', slug: 'produits-soin-animal', level: 3, icon: generateIconUrl('produits-soin-animal', 'animalerie', 'loisirs'), children: [] },
          { name: 'Chien', slug: 'chien', level: 3, icon: generateIconUrl('chien', 'animalerie', 'loisirs'), children: [] },
          { name: 'Oiseau', slug: 'oiseau', level: 3, icon: generateIconUrl('oiseau', 'animalerie', 'loisirs'), children: [] },
          { name: 'Animaux de ferme', slug: 'animaux-ferme', level: 3, icon: generateIconUrl('animaux-ferme', 'animalerie', 'loisirs'), children: [] },
          { name: 'Chat', slug: 'chat', level: 3, icon: generateIconUrl('chat', 'animalerie', 'loisirs'), children: [] },
          { name: 'Cheval', slug: 'cheval', level: 3, icon: generateIconUrl('cheval', 'animalerie', 'loisirs'), children: [] },
          { name: 'Poisson', slug: 'poisson', level: 3, icon: generateIconUrl('poisson', 'animalerie', 'loisirs'), children: [] },
          { name: 'Accessoire pour animaux', slug: 'accessoire-animaux', level: 3, icon: generateIconUrl('accessoire-animaux', 'animalerie', 'loisirs'), children: [] },
          { name: 'Nourriture pour animaux', slug: 'nourriture-animaux', level: 3, icon: generateIconUrl('nourriture-animaux', 'animalerie', 'loisirs'), children: [] },
          { name: 'Autres Animaux', slug: 'autres-animaux', level: 3, icon: generateIconUrl('autres-animaux', 'animalerie', 'loisirs'), children: [] }
        ]
      },
      {
        name: 'Consoles et Jeux Vidéos',
        slug: 'consoles-jeux-videos',
        level: 2,
        icon: generateIconUrl('consoles-jeux-videos', 'loisirs'),
        order: 2,
        children: [
          { name: 'Consoles', slug: 'consoles', level: 3, icon: generateIconUrl('consoles', 'consoles-jeux-videos', 'loisirs'), children: [] },
          { name: 'Jeux videos', slug: 'jeux-videos', level: 3, icon: generateIconUrl('jeux-videos', 'consoles-jeux-videos', 'loisirs'), children: [] },
          { name: 'Accessoires', slug: 'accessoires-consoles', level: 3, icon: generateIconUrl('accessoires-consoles', 'consoles-jeux-videos', 'loisirs'), children: [] }
        ]
      },
      {
        name: 'Livres & Magazines',
        slug: 'livres-magazines',
        level: 2,
        icon: generateIconUrl('livres-magazines', 'loisirs'),
        order: 3,
        children: [
          { name: 'Littérature et philosophie', slug: 'litterature-philosophie', level: 3, icon: generateIconUrl('litterature-philosophie', 'livres-magazines', 'loisirs'), children: [] },
          { name: 'Romans', slug: 'romans', level: 3, icon: generateIconUrl('romans', 'livres-magazines', 'loisirs'), children: [] },
          { name: 'Scolaire & Parascolaire', slug: 'scolaire-parascolaire', level: 3, icon: generateIconUrl('scolaire-parascolaire', 'livres-magazines', 'loisirs'), children: [] },
          { name: 'Sciences, techniques et medecine', slug: 'sciences-techniques-medecine', level: 3, icon: generateIconUrl('sciences-techniques-medecine', 'livres-magazines', 'loisirs'), children: [] },
          { name: 'Traduction', slug: 'traduction', level: 3, icon: generateIconUrl('traduction', 'livres-magazines', 'loisirs'), children: [] },
          { name: 'Religion et Spiritualités', slug: 'religion-spiritualites', level: 3, icon: generateIconUrl('religion-spiritualites', 'livres-magazines', 'loisirs'), children: [] },
          { name: 'Historique', slug: 'historique', level: 3, icon: generateIconUrl('historique', 'livres-magazines', 'loisirs'), children: [] },
          { name: 'Cuisine', slug: 'cuisine-livres', level: 3, icon: generateIconUrl('cuisine-livres', 'livres-magazines', 'loisirs'), children: [] },
          { name: 'Essais et documents', slug: 'essais-documents', level: 3, icon: generateIconUrl('essais-documents', 'livres-magazines', 'loisirs'), children: [] },
          { name: 'Fiction', slug: 'fiction', level: 3, icon: generateIconUrl('fiction', 'livres-magazines', 'loisirs'), children: [] },
          { name: 'Enfants', slug: 'enfants-livres', level: 3, icon: generateIconUrl('enfants-livres', 'livres-magazines', 'loisirs'), children: [] },
          { name: 'Mangas et bande dessinée', slug: 'mangas-bande-dessinee', level: 3, icon: generateIconUrl('mangas-bande-dessinee', 'livres-magazines', 'loisirs'), children: [] }
        ]
      },
      {
        name: 'Instruments de Musique',
        slug: 'instruments-musique',
        level: 2,
        icon: generateIconUrl('instruments-musique', 'loisirs'),
        order: 4,
        children: [
          { name: 'Instruments électriques', slug: 'instruments-electriques', level: 3, icon: generateIconUrl('instruments-electriques', 'instruments-musique', 'loisirs'), children: [] },
          { name: 'Instruments à percussion', slug: 'instruments-percussion', level: 3, icon: generateIconUrl('instruments-percussion', 'instruments-musique', 'loisirs'), children: [] },
          { name: 'Instruments a vent', slug: 'instruments-vent', level: 3, icon: generateIconUrl('instruments-vent', 'instruments-musique', 'loisirs'), children: [] },
          { name: 'Instruments à cordes', slug: 'instruments-cordes', level: 3, icon: generateIconUrl('instruments-cordes', 'instruments-musique', 'loisirs'), children: [] },
          { name: 'Autre', slug: 'autre-instruments', level: 3, icon: generateIconUrl('autre-instruments', 'instruments-musique', 'loisirs'), children: [] }
        ]
      },
      {
        name: 'Jouets',
        slug: 'jouets',
        level: 2,
        icon: generateIconUrl('jouets', 'loisirs'),
        order: 5,
        children: [
          { name: 'Jeux d\'éveil', slug: 'jeux-eveil', level: 3, icon: generateIconUrl('jeux-eveil', 'jouets', 'loisirs'), children: [] },
          { name: 'Poupées - Peluches', slug: 'poupees-peluches', level: 3, icon: generateIconUrl('poupees-peluches', 'jouets', 'loisirs'), children: [] },
          { name: 'Personnages - Déguisements', slug: 'personnages-deguisements', level: 3, icon: generateIconUrl('personnages-deguisements', 'jouets', 'loisirs'), children: [] },
          { name: 'Jeux éducatifs - Puzzle', slug: 'jeux-educatifs-puzzle', level: 3, icon: generateIconUrl('jeux-educatifs-puzzle', 'jouets', 'loisirs'), children: [] },
          { name: 'Véhicules et Circuits', slug: 'vehicules-circuits', level: 3, icon: generateIconUrl('vehicules-circuits', 'jouets', 'loisirs'), children: [] },
          { name: 'Jeux électroniques', slug: 'jeux-electroniques', level: 3, icon: generateIconUrl('jeux-electroniques', 'jouets', 'loisirs'), children: [] },
          { name: 'Construction et Outils', slug: 'construction-outils', level: 3, icon: generateIconUrl('construction-outils', 'jouets', 'loisirs'), children: [] },
          { name: 'Jeux de plein air', slug: 'jeux-plein-air', level: 3, icon: generateIconUrl('jeux-plein-air', 'jouets', 'loisirs'), children: [] },
          { name: 'Animaux', slug: 'animaux-jouets', level: 3, icon: generateIconUrl('animaux-jouets', 'jouets', 'loisirs'), children: [] }
        ]
      },
      {
        name: 'Chasse & Pêche',
        slug: 'chasse-peche',
        level: 2,
        icon: generateIconUrl('chasse-peche', 'loisirs'),
        order: 6,
        children: [
          { name: 'Canne à pêche', slug: 'canne-peche', level: 3, icon: generateIconUrl('canne-peche', 'chasse-peche', 'loisirs'), children: [] },
          { name: 'Moulinets', slug: 'moulinets', level: 3, icon: generateIconUrl('moulinets', 'chasse-peche', 'loisirs'), children: [] },
          { name: 'Sondeurs-GPS', slug: 'sondeurs-gps', level: 3, icon: generateIconUrl('sondeurs-gps', 'chasse-peche', 'loisirs'), children: [] },
          { name: 'Vêtements', slug: 'vetements-chasse-peche', level: 3, icon: generateIconUrl('vetements-chasse-peche', 'chasse-peche', 'loisirs'), children: [] },
          { name: 'Accessoires de pêche', slug: 'accessoires-peche', level: 3, icon: generateIconUrl('accessoires-peche', 'chasse-peche', 'loisirs'), children: [] },
          { name: 'Matériel plongée', slug: 'materiel-plongee', level: 3, icon: generateIconUrl('materiel-plongee', 'chasse-peche', 'loisirs'), children: [] },
          { name: 'Equipements de chasse', slug: 'equipements-chasse', level: 3, icon: generateIconUrl('equipements-chasse', 'chasse-peche', 'loisirs'), children: [] }
        ]
      },
      {
        name: 'Jardinage',
        slug: 'jardinage',
        level: 2,
        icon: generateIconUrl('jardinage', 'loisirs'),
        order: 7,
        children: [
          { name: 'Mobilier de jardin', slug: 'mobilier-jardin', level: 3, icon: generateIconUrl('mobilier-jardin', 'jardinage', 'loisirs'), children: [] },
          { name: 'Semence', slug: 'semence', level: 3, icon: generateIconUrl('semence', 'jardinage', 'loisirs'), children: [] },
          { name: 'Outillage-Arrosage du jardin', slug: 'outillage-arrosage', level: 3, icon: generateIconUrl('outillage-arrosage', 'jardinage', 'loisirs'), children: [] },
          { name: 'Plantes et fleurs', slug: 'plantes-fleurs', level: 3, icon: generateIconUrl('plantes-fleurs', 'jardinage', 'loisirs'), children: [] },
          { name: 'Équipements Et Matériels', slug: 'equipements-materiels-jardin', level: 3, icon: generateIconUrl('equipements-materiels-jardin', 'jardinage', 'loisirs'), children: [] },
          { name: 'Insecticide', slug: 'insecticide', level: 3, icon: generateIconUrl('insecticide', 'jardinage', 'loisirs'), children: [] },
          { name: 'Décoration', slug: 'decoration-jardin', level: 3, icon: generateIconUrl('decoration-jardin', 'jardinage', 'loisirs'), children: [] },
          { name: 'Livres D\'Agriculture Et De Jardinage', slug: 'livres-agriculture-jardin', level: 3, icon: generateIconUrl('livres-agriculture-jardin', 'jardinage', 'loisirs'), children: [] }
        ]
      },
      {
        name: 'Les Jeux de loisirs',
        slug: 'jeux-loisirs',
        level: 2,
        icon: generateIconUrl('jeux-loisirs', 'loisirs'),
        order: 8,
        children: [
          { name: 'Babyfoot', slug: 'babyfoot', level: 3, icon: generateIconUrl('babyfoot', 'jeux-loisirs', 'loisirs'), children: [] },
          { name: 'Billiard', slug: 'billiard', level: 3, icon: generateIconUrl('billiard', 'jeux-loisirs', 'loisirs'), children: [] },
          { name: 'Ping pong', slug: 'ping-pong', level: 3, icon: generateIconUrl('ping-pong', 'jeux-loisirs', 'loisirs'), children: [] },
          { name: 'Échecs', slug: 'echecs', level: 3, icon: generateIconUrl('echecs', 'jeux-loisirs', 'loisirs'), children: [] },
          { name: 'Jeux De Société', slug: 'jeux-societe', level: 3, icon: generateIconUrl('jeux-societe', 'jeux-loisirs', 'loisirs'), children: [] },
          { name: 'Autres Jeux De Loisirs', slug: 'autres-jeux-loisirs', level: 3, icon: generateIconUrl('autres-jeux-loisirs', 'jeux-loisirs', 'loisirs'), children: [] }
        ]
      },
      {
        name: 'Barbecue & Grillades',
        slug: 'barbecue-grillades',
        level: 2,
        icon: generateIconUrl('barbecue-grillades', 'loisirs'),
        order: 9,
        children: [
          { name: 'Barbecue', slug: 'barbecue', level: 3, icon: generateIconUrl('barbecue', 'barbecue-grillades', 'loisirs'), children: [] },
          { name: 'Charbon', slug: 'charbon', level: 3, icon: generateIconUrl('charbon', 'barbecue-grillades', 'loisirs'), children: [] },
          { name: 'Accessoires', slug: 'accessoires-barbecue', level: 3, icon: generateIconUrl('accessoires-barbecue', 'barbecue-grillades', 'loisirs'), children: [] }
        ]
      },
      {
        name: 'Vapes & Chichas',
        slug: 'vapes-chichas',
        level: 2,
        icon: generateIconUrl('vapes-chichas', 'loisirs'),
        order: 10,
        children: [
          { name: 'Vapes & Cigarettes électroniques', slug: 'vapes-cigarettes-electroniques', level: 3, icon: generateIconUrl('vapes-cigarettes-electroniques', 'vapes-chichas', 'loisirs'), children: [] },
          { name: 'Chichas', slug: 'chichas', level: 3, icon: generateIconUrl('chichas', 'vapes-chichas', 'loisirs'), children: [] },
          { name: 'Consommables', slug: 'consommables', level: 3, icon: generateIconUrl('consommables', 'vapes-chichas', 'loisirs'), children: [] },
          { name: 'Accessoires', slug: 'accessoires-chichas', level: 3, icon: generateIconUrl('accessoires-chichas', 'vapes-chichas', 'loisirs'), children: [] }
        ]
      },
      {
        name: 'Produits & Accessoires d\'été',
        slug: 'produits-accessoires-ete',
        level: 2,
        icon: generateIconUrl('produits-accessoires-ete', 'loisirs'),
        order: 11,
        children: [
          { name: 'Piscines', slug: 'piscines', level: 3, icon: generateIconUrl('piscines', 'produits-accessoires-ete', 'loisirs'), children: [] },
          { name: 'Matelas gonflables', slug: 'matelas-gonflables', level: 3, icon: generateIconUrl('matelas-gonflables', 'produits-accessoires-ete', 'loisirs'), children: [] },
          { name: 'Parasols', slug: 'parasols', level: 3, icon: generateIconUrl('parasols', 'produits-accessoires-ete', 'loisirs'), children: [] },
          { name: 'Transats & Chaises pliables', slug: 'transats-chaises-pliables', level: 3, icon: generateIconUrl('transats-chaises-pliables', 'produits-accessoires-ete', 'loisirs'), children: [] },
          { name: 'Tables', slug: 'tables-ete', level: 3, icon: generateIconUrl('tables-ete', 'produits-accessoires-ete', 'loisirs'), children: [] },
          { name: 'Autres', slug: 'autres-ete', level: 3, icon: generateIconUrl('autres-ete', 'produits-accessoires-ete', 'loisirs'), children: [] }
        ]
      },
      { name: 'Antiquités & Collections', slug: 'antiquites-collections', level: 2, icon: generateIconUrl('antiquites-collections', 'loisirs'), order: 12, children: [] },
      { name: 'Autre', slug: 'autre-loisirs', level: 2, icon: generateIconUrl('autre-loisirs', 'loisirs'), order: 13, children: [] }
    ]
  },

  // ==================== 9. MATERIAUX ====================
  {
    name: 'Matériaux & Équipement',
    slug: 'materiaux',
    level: 1,
    icon: generateIconUrl('materiaux'),
    order: 14,
    children: [
      {
        name: 'Matériel professionnel',
        slug: 'materiel-professionnel',
        level: 2,
        icon: generateIconUrl('materiel-professionnel', 'materiaux'),
        order: 1,
        children: [
          { name: 'Industrie & Fabrication', slug: 'industrie-fabrication', level: 3, icon: generateIconUrl('industrie-fabrication', 'materiel-professionnel', 'materiaux'), children: [] },
          { name: 'Alimentaire et Restauration', slug: 'alimentaire-restauration', level: 3, icon: generateIconUrl('alimentaire-restauration', 'materiel-professionnel', 'materiaux'), children: [] },
          { name: 'Medical', slug: 'medical', level: 3, icon: generateIconUrl('medical', 'materiel-professionnel', 'materiaux'), children: [] },
          { name: 'Batiment & Construction', slug: 'batiment-construction', level: 3, icon: generateIconUrl('batiment-construction', 'materiel-professionnel', 'materiaux'), children: [] },
          { name: 'Matériel électrique', slug: 'materiel-electrique', level: 3, icon: generateIconUrl('materiel-electrique', 'materiel-professionnel', 'materiaux'), children: [] },
          { name: 'Ateliers', slug: 'ateliers', level: 3, icon: generateIconUrl('ateliers', 'materiel-professionnel', 'materiaux'), children: [] },
          { name: 'Stockage et magasinage', slug: 'stockage-magasinage', level: 3, icon: generateIconUrl('stockage-magasinage', 'materiel-professionnel', 'materiaux'), children: [] },
          { name: 'Équipement de protection', slug: 'equipement-protection', level: 3, icon: generateIconUrl('equipement-protection', 'materiel-professionnel', 'materiaux'), children: [] },
          { name: 'Agriculture', slug: 'agriculture', level: 3, icon: generateIconUrl('agriculture', 'materiel-professionnel', 'materiaux'), children: [] },
          { name: 'Réparation & Diagnostic', slug: 'reparation-diagnostic', level: 3, icon: generateIconUrl('reparation-diagnostic', 'materiel-professionnel', 'materiaux'), children: [] },
          { name: 'Commerce de détail', slug: 'commerce-detail', level: 3, icon: generateIconUrl('commerce-detail', 'materiel-professionnel', 'materiaux'), children: [] },
          { name: 'Coiffure et cosmétologie', slug: 'coiffure-cosmetologie', level: 3, icon: generateIconUrl('coiffure-cosmetologie', 'materiel-professionnel', 'materiaux'), children: [] },
          { name: 'Autres matériels pro', slug: 'autres-materiel-pro', level: 3, icon: generateIconUrl('autres-materiel-pro', 'materiel-professionnel', 'materiaux'), children: [] }
        ]
      },
      {
        name: 'Outillage professionnel',
        slug: 'outillage-professionnel',
        level: 2,
        icon: generateIconUrl('outillage-professionnel', 'materiaux'),
        order: 2,
        children: [
          { name: 'Perceuse', slug: 'perceuse', level: 3, icon: generateIconUrl('perceuse', 'outillage-professionnel', 'materiaux'), children: [] },
          { name: 'Meuleuse', slug: 'meuleuse', level: 3, icon: generateIconUrl('meuleuse', 'outillage-professionnel', 'materiaux'), children: [] },
          { name: 'Outillage à main', slug: 'outillage-main', level: 3, icon: generateIconUrl('outillage-main', 'outillage-professionnel', 'materiaux'), children: [] },
          { name: 'Scie', slug: 'scie', level: 3, icon: generateIconUrl('scie', 'outillage-professionnel', 'materiaux'), children: [] },
          { name: 'Autres', slug: 'autres-outillage', level: 3, icon: generateIconUrl('autres-outillage', 'outillage-professionnel', 'materiaux'), children: [] }
        ]
      },
      {
        name: 'Matériel Agricole',
        slug: 'materiel-agricole',
        level: 2,
        icon: generateIconUrl('materiel-agricole', 'materiaux'),
        order: 3,
        children: [
          { name: 'Equipement agricole', slug: 'equipement-agricole', level: 3, icon: generateIconUrl('equipement-agricole', 'materiel-agricole', 'materiaux'), children: [] },
          { name: 'Arbres', slug: 'arbres', level: 3, icon: generateIconUrl('arbres', 'materiel-agricole', 'materiaux'), children: [] },
          { name: 'Terrain Agricole', slug: 'terrain-agricole-materiaux', level: 3, icon: generateIconUrl('terrain-agricole-materiaux', 'materiel-agricole', 'materiaux'), children: [] },
          { name: 'Autre', slug: 'autre-agricole', level: 3, icon: generateIconUrl('autre-agricole', 'materiel-agricole', 'materiaux'), children: [] }
        ]
      },
      { name: 'Materiaux de construction', slug: 'materiaux-construction', level: 2, icon: generateIconUrl('materiaux-construction', 'materiaux'), order: 4, children: [] },
      { name: 'Matières premières', slug: 'matieres-premieres', level: 2, icon: generateIconUrl('matieres-premieres', 'materiaux'), order: 5, children: [] },
      { name: 'Produits d\'hygiène', slug: 'produits-hygiene', level: 2, icon: generateIconUrl('produits-hygiene', 'materiaux'), order: 6, children: [] },
      { name: 'Autre', slug: 'autre-materiaux', level: 2, icon: generateIconUrl('autre-materiaux', 'materiaux'), order: 7, children: [] }
    ]
  },

  // ==================== 10. MEUBLES ====================
  {
    name: 'Meubles & Maison',
    slug: 'meubles',
    level: 1,
    icon: generateIconUrl('meubles'),
    order: 10,
    children: [
      { name: 'Salon', slug: 'salon', level: 2, icon: generateIconUrl('salon', 'meubles'), order: 1, children: [] },
      { name: 'Chambres à coucher', slug: 'chambres-coucher', level: 2, icon: generateIconUrl('chambres-coucher', 'meubles'), order: 2, children: [] },
      { name: 'Tables', slug: 'tables', level: 2, icon: generateIconUrl('tables', 'meubles'), order: 3, children: [] },
      { name: 'Armoires & Commodes', slug: 'armoires-commodes', level: 2, icon: generateIconUrl('armoires-commodes', 'meubles'), order: 4, children: [] },
      { name: 'Lits', slug: 'lits', level: 2, icon: generateIconUrl('lits', 'meubles'), order: 5, children: [] },
      { name: 'Meubles de Cuisine', slug: 'meubles-cuisine', level: 2, icon: generateIconUrl('meubles-cuisine', 'meubles'), order: 6, children: [] },
      { name: 'Bibliothèques & Etagères', slug: 'bibliotheques-etageres', level: 2, icon: generateIconUrl('bibliotheques-etageres', 'meubles'), order: 7, children: [] },
      { name: 'Chaises & Fauteuils', slug: 'chaises-fauteuils', level: 2, icon: generateIconUrl('chaises-fauteuils', 'meubles'), order: 8, children: [] },
      { name: 'Dressings', slug: 'dressings', level: 2, icon: generateIconUrl('dressings', 'meubles'), order: 9, children: [] },
      { name: 'Meubles salle de bain', slug: 'meubles-salle-bain', level: 2, icon: generateIconUrl('meubles-salle-bain', 'meubles'), order: 10, children: [] },
      { name: 'Buffet', slug: 'buffet', level: 2, icon: generateIconUrl('buffet', 'meubles'), order: 11, children: [] },
      { name: 'Tables TV', slug: 'tables-tv', level: 2, icon: generateIconUrl('tables-tv', 'meubles'), order: 12, children: [] },
      { name: 'Table pliante', slug: 'table-pliante', level: 2, icon: generateIconUrl('table-pliante', 'meubles'), order: 13, children: [] },
      { name: 'Tables à manger', slug: 'tables-manger', level: 2, icon: generateIconUrl('tables-manger', 'meubles'), order: 14, children: [] },
      { name: 'Tables PC & Bureaux', slug: 'tables-pc-bureaux', level: 2, icon: generateIconUrl('tables-pc-bureaux', 'meubles'), order: 15, children: [] },
      { name: 'Canapé', slug: 'canape', level: 2, icon: generateIconUrl('canape', 'meubles'), order: 16, children: [] },
      { name: 'Table basse', slug: 'table-basse', level: 2, icon: generateIconUrl('table-basse', 'meubles'), order: 17, children: [] },
      { name: 'Rangement et Organisation', slug: 'rangement-organisation', level: 2, icon: generateIconUrl('rangement-organisation', 'meubles'), order: 18, children: [] },
      { name: 'Accessoires de cuisine', slug: 'accessoires-cuisine', level: 2, icon: generateIconUrl('accessoires-cuisine', 'meubles'), order: 19, children: [] },
      { name: 'Meuble d\'entrée', slug: 'meuble-entree', level: 2, icon: generateIconUrl('meuble-entree', 'meubles'), order: 20, children: [] },
      {
        name: 'Décoration',
        slug: 'decoration',
        level: 2,
        icon: generateIconUrl('decoration', 'meubles'),
        order: 21,
        children: [
          { name: 'Peinture et calligraphie', slug: 'peinture-calligraphie', level: 3, icon: generateIconUrl('peinture-calligraphie', 'decoration', 'meubles'), children: [] },
          { name: 'Décoration de cuisine', slug: 'decoration-cuisine', level: 3, icon: generateIconUrl('decoration-cuisine', 'decoration', 'meubles'), children: [] },
          { name: 'Coussins & Housses', slug: 'coussins-housses', level: 3, icon: generateIconUrl('coussins-housses', 'decoration', 'meubles'), children: [] },
          { name: 'Déco de Bain', slug: 'deco-bain', level: 3, icon: generateIconUrl('deco-bain', 'decoration', 'meubles'), children: [] },
          { name: 'Art et Revêtement Mural', slug: 'art-revetement-mural', level: 3, icon: generateIconUrl('art-revetement-mural', 'decoration', 'meubles'), children: [] },
          { name: 'Figurines et miniatures', slug: 'figurines-miniatures', level: 3, icon: generateIconUrl('figurines-miniatures', 'decoration', 'meubles'), children: [] },
          { name: 'Cadres', slug: 'cadres', level: 3, icon: generateIconUrl('cadres', 'decoration', 'meubles'), children: [] },
          { name: 'Horloges', slug: 'horloges', level: 3, icon: generateIconUrl('horloges', 'decoration', 'meubles'), children: [] },
          { name: 'Autres décoration', slug: 'autres-decoration', level: 3, icon: generateIconUrl('autres-decoration', 'decoration', 'meubles'), children: [] }
        ]
      },
      {
        name: 'Vaisselle',
        slug: 'vaisselle',
        level: 2,
        icon: generateIconUrl('vaisselle', 'meubles'),
        order: 22,
        children: [
          { name: 'Pôeles, Casseroles et Marmites', slug: 'poeles-casseroles-marmites', level: 3, icon: generateIconUrl('poeles-casseroles-marmites', 'vaisselle', 'meubles'), children: [] },
          { name: 'Cocottes', slug: 'cocottes', level: 3, icon: generateIconUrl('cocottes', 'vaisselle', 'meubles'), children: [] },
          { name: 'Plats à four et Plateaux', slug: 'plats-four-plateaux', level: 3, icon: generateIconUrl('plats-four-plateaux', 'vaisselle', 'meubles'), children: [] },
          { name: 'Assiettes et Bols', slug: 'assiettes-bols', level: 3, icon: generateIconUrl('assiettes-bols', 'vaisselle', 'meubles'), children: [] },
          { name: 'Couverts et ustensiles de cuisine', slug: 'couverts-ustensiles', level: 3, icon: generateIconUrl('couverts-ustensiles', 'vaisselle', 'meubles'), children: [] },
          { name: 'Services à Boissons', slug: 'services-boissons', level: 3, icon: generateIconUrl('services-boissons', 'vaisselle', 'meubles'), children: [] },
          { name: 'Boites et bocaux', slug: 'boites-bocaux', level: 3, icon: generateIconUrl('boites-bocaux', 'vaisselle', 'meubles'), children: [] },
          { name: 'Accessoires de pâtisserie', slug: 'accessoires-patisserie', level: 3, icon: generateIconUrl('accessoires-patisserie', 'vaisselle', 'meubles'), children: [] },
          { name: 'Vaisselles Artisanales', slug: 'vaisselles-artisanales', level: 3, icon: generateIconUrl('vaisselles-artisanales', 'vaisselle', 'meubles'), children: [] },
          { name: 'Gadget de cuisine', slug: 'gadget-cuisine', level: 3, icon: generateIconUrl('gadget-cuisine', 'vaisselle', 'meubles'), children: [] },
          { name: 'Vaisselle enfants', slug: 'vaisselle-enfants', level: 3, icon: generateIconUrl('vaisselle-enfants', 'vaisselle', 'meubles'), children: [] }
        ]
      },
      {
        name: 'Meubles de bureau',
        slug: 'meubles-bureau',
        level: 2,
        icon: generateIconUrl('meubles-bureau', 'meubles'),
        order: 23,
        children: [
          { name: 'Bureaux & Caissons', slug: 'bureaux-caissons', level: 3, icon: generateIconUrl('bureaux-caissons', 'meubles-bureau', 'meubles'), children: [] },
          { name: 'Chaises', slug: 'chaises-bureau', level: 3, icon: generateIconUrl('chaises-bureau', 'meubles-bureau', 'meubles'), children: [] },
          { name: 'Armoires & Rangements', slug: 'armoires-rangements-bureau', level: 3, icon: generateIconUrl('armoires-rangements-bureau', 'meubles-bureau', 'meubles'), children: [] },
          { name: 'Accessoires de bureaux', slug: 'accessoires-bureaux', level: 3, icon: generateIconUrl('accessoires-bureaux', 'meubles-bureau', 'meubles'), children: [] },
          { name: 'Tables de réunion', slug: 'tables-reunion', level: 3, icon: generateIconUrl('tables-reunion', 'meubles-bureau', 'meubles'), children: [] }
        ]
      },
      {
        name: 'Puériculture',
        slug: 'puericulture',
        level: 2,
        icon: generateIconUrl('puericulture', 'meubles'),
        order: 24,
        children: [
          { name: 'Poussette', slug: 'poussette', level: 3, icon: generateIconUrl('poussette', 'puericulture', 'meubles'), children: [] },
          { name: 'Siège Auto', slug: 'siege-auto', level: 3, icon: generateIconUrl('siege-auto', 'puericulture', 'meubles'), children: [] },
          { name: 'Meubles bébé', slug: 'meubles-bebe', level: 3, icon: generateIconUrl('meubles-bebe', 'puericulture', 'meubles'), children: [] },
          { name: 'Lit bébé', slug: 'lit-bebe', level: 3, icon: generateIconUrl('lit-bebe', 'puericulture', 'meubles'), children: [] },
          { name: 'Chaise bébé', slug: 'chaise-bebe', level: 3, icon: generateIconUrl('chaise-bebe', 'puericulture', 'meubles'), children: [] },
          { name: 'Autres', slug: 'autres-puericulture', level: 3, icon: generateIconUrl('autres-puericulture', 'puericulture', 'meubles'), children: [] }
        ]
      },
      {
        name: 'Luminaire',
        slug: 'luminaire',
        level: 2,
        icon: generateIconUrl('luminaire', 'meubles'),
        order: 25,
        children: [
          { name: 'Lustre', slug: 'lustre', level: 3, icon: generateIconUrl('lustre', 'luminaire', 'meubles'), children: [] },
          { name: 'Lampadaire', slug: 'lampadaire', level: 3, icon: generateIconUrl('lampadaire', 'luminaire', 'meubles'), children: [] },
          { name: 'Éclairage extérieur', slug: 'eclairage-exterieur', level: 3, icon: generateIconUrl('eclairage-exterieur', 'luminaire', 'meubles'), children: [] },
          { name: 'Autres', slug: 'autres-luminaire', level: 3, icon: generateIconUrl('autres-luminaire', 'luminaire', 'meubles'), children: [] }
        ]
      },
      { name: 'Rideaux', slug: 'rideaux', level: 2, icon: generateIconUrl('rideaux', 'meubles'), order: 26, children: [] },
      { name: 'Literie & Linge', slug: 'literie-linge', level: 2, icon: generateIconUrl('literie-linge', 'meubles'), order: 27, children: [] },
      { name: 'Tapis & Moquettes', slug: 'tapis-moquettes', level: 2, icon: generateIconUrl('tapis-moquettes', 'meubles'), order: 28, children: [] },
      { name: 'Meubles d\'extérieur', slug: 'meubles-exterieur', level: 2, icon: generateIconUrl('meubles-exterieur', 'meubles'), order: 29, children: [] },
      { name: 'Fournitures et articles scolaires', slug: 'fournitures-scolaires', level: 2, icon: generateIconUrl('fournitures-scolaires', 'meubles'), order: 30, children: [] },
      { name: 'Autre', slug: 'autre-meubles', level: 2, icon: generateIconUrl('autre-meubles', 'meubles'), order: 31, children: [] }
    ]
  },

  // ==================== 11. PIECES DETACHEES ====================
  {
    name: 'Pieces Detachees',
    slug: 'pieces-detachees',
    level: 1,
    icon: generateIconUrl('pieces-detachees'),
    order: 6,
    children: [
      {
        name: 'Pièces automobiles',
        slug: 'pieces-automobiles',
        level: 2,
        icon: generateIconUrl('pieces-automobiles', 'pieces-detachees'),
        order: 1,
        children: [
          { name: 'Moteur & Transmission', slug: 'moteur-transmission', level: 3, icon: generateIconUrl('moteur-transmission', 'pieces-automobiles', 'pieces-detachees'), children: [] },
          { name: 'Suspension & Direction', slug: 'suspension-direction', level: 3, icon: generateIconUrl('suspension-direction', 'pieces-automobiles', 'pieces-detachees'), children: [] },
          { name: 'Pièces intérieur', slug: 'pieces-interieur', level: 3, icon: generateIconUrl('pieces-interieur', 'pieces-automobiles', 'pieces-detachees'), children: [] },
          { name: 'Carrosserie', slug: 'carrosserie', level: 3, icon: generateIconUrl('carrosserie', 'pieces-automobiles', 'pieces-detachees'), children: [] },
          { name: 'Optiques & Éclairage', slug: 'optiques-eclairage', level: 3, icon: generateIconUrl('optiques-eclairage', 'pieces-automobiles', 'pieces-detachees'), children: [] },
          { name: 'Vitres & pare-brise', slug: 'vitres-pare-brise', level: 3, icon: generateIconUrl('vitres-pare-brise', 'pieces-automobiles', 'pieces-detachees'), children: [] },
          { name: 'Pneus & Jantes', slug: 'pneus-jantes', level: 3, icon: generateIconUrl('pneus-jantes', 'pieces-automobiles', 'pieces-detachees'), children: [] },
          { name: 'Housses & Tapis', slug: 'housses-tapis', level: 3, icon: generateIconUrl('housses-tapis', 'pieces-automobiles', 'pieces-detachees'), children: [] },
          { name: 'Batteries', slug: 'batteries-auto', level: 3, icon: generateIconUrl('batteries-auto', 'pieces-automobiles', 'pieces-detachees'), children: [] },
          { name: 'Sono & Multimédia', slug: 'sono-multimedia', level: 3, icon: generateIconUrl('sono-multimedia', 'pieces-automobiles', 'pieces-detachees'), children: [] },
          { name: 'Sièges auto', slug: 'sieges-auto', level: 3, icon: generateIconUrl('sieges-auto', 'pieces-automobiles', 'pieces-detachees'), children: [] },
          { name: 'Autres pièces auto', slug: 'autres-pieces-auto', level: 3, icon: generateIconUrl('autres-pieces-auto', 'pieces-automobiles', 'pieces-detachees'), children: [] }
        ]
      },
      {
        name: 'Pièces moto',
        slug: 'pieces-moto',
        level: 2,
        icon: generateIconUrl('pieces-moto', 'pieces-detachees'),
        order: 2,
        children: [
          { name: 'Casques & Protections', slug: 'casques-protections', level: 3, icon: generateIconUrl('casques-protections', 'pieces-moto', 'pieces-detachees'), children: [] },
          { name: 'Pneus & Jantes', slug: 'pneus-jantes-moto', level: 3, icon: generateIconUrl('pneus-jantes-moto', 'pieces-moto', 'pieces-detachees'), children: [] },
          { name: 'Optiques & Éclairage', slug: 'optiques-eclairage-moto', level: 3, icon: generateIconUrl('optiques-eclairage-moto', 'pieces-moto', 'pieces-detachees'), children: [] },
          { name: 'Accessoires', slug: 'accessoires-moto', level: 3, icon: generateIconUrl('accessoires-moto', 'pieces-moto', 'pieces-detachees'), children: [] },
          { name: 'Autres pièces moto', slug: 'autres-pieces-moto', level: 3, icon: generateIconUrl('autres-pieces-moto', 'pieces-moto', 'pieces-detachees'), children: [] }
        ]
      },
      {
        name: 'Pièces bateaux',
        slug: 'pieces-bateaux',
        level: 2,
        icon: generateIconUrl('pieces-bateaux', 'pieces-detachees'),
        order: 3,
        children: [
          { name: 'Moteurs', slug: 'moteurs-bateau', level: 3, icon: generateIconUrl('moteurs-bateau', 'pieces-bateaux', 'pieces-detachees'), children: [] },
          { name: 'Pièces', slug: 'pieces-bateau', level: 3, icon: generateIconUrl('pieces-bateau', 'pieces-bateaux', 'pieces-detachees'), children: [] },
          { name: 'Accessoires', slug: 'accessoires-bateau', level: 3, icon: generateIconUrl('accessoires-bateau', 'pieces-bateaux', 'pieces-detachees'), children: [] },
          { name: 'Autres pièces bateaux', slug: 'autres-pieces-bateaux', level: 3, icon: generateIconUrl('autres-pieces-bateaux', 'pieces-bateaux', 'pieces-detachees'), children: [] }
        ]
      },
      { name: 'Alarme & Sécurité', slug: 'alarme-securite', level: 2, icon: generateIconUrl('alarme-securite', 'pieces-detachees'), order: 4, children: [] },
      { name: 'Nettoyage & Entretien', slug: 'nettoyage-entretien', level: 2, icon: generateIconUrl('nettoyage-entretien', 'pieces-detachees'), order: 5, children: [] },
      { name: 'Outils de diagnostics', slug: 'outils-diagnostics', level: 2, icon: generateIconUrl('outils-diagnostics', 'pieces-detachees'), order: 6, children: [] },
      { name: 'Lubrifiants', slug: 'lubrifiants', level: 2, icon: generateIconUrl('lubrifiants', 'pieces-detachees'), order: 7, children: [] },
      { name: 'Pièces véhicules', slug: 'pieces-vehicules', level: 2, icon: generateIconUrl('pieces-vehicules', 'pieces-detachees'), order: 8, children: [] },
      { name: 'Autres pièces', slug: 'autres-pieces', level: 2, icon: generateIconUrl('autres-pieces', 'pieces-detachees'), order: 9, children: [] }
    ]
  },

  // ==================== 12. SANTE & BEAUTE ====================
  {
    name: 'Santé & Beauté',
    slug: 'sante-beaute',
    level: 1,
    icon: generateIconUrl('sante-beaute'),
    order: 9,
    children: [
      {
        name: 'Cosmétiques & Beauté',
        slug: 'cosmetiques-beaute',
        level: 2,
        icon: generateIconUrl('cosmetiques-beaute', 'sante-beaute'),
        order: 1,
        children: [
          { name: 'Soins du corps', slug: 'soins-corps', level: 3, icon: generateIconUrl('soins-corps', 'cosmetiques-beaute', 'sante-beaute'), children: [] },
          { name: 'Savons & Gels douche', slug: 'savons-gels-douche', level: 3, icon: generateIconUrl('savons-gels-douche', 'cosmetiques-beaute', 'sante-beaute'), children: [] },
          { name: 'Soins visage', slug: 'soins-visage', level: 3, icon: generateIconUrl('soins-visage', 'cosmetiques-beaute', 'sante-beaute'), children: [] },
          { name: 'Maquillage', slug: 'maquillage', level: 3, icon: generateIconUrl('maquillage', 'cosmetiques-beaute', 'sante-beaute'), children: [] },
          { name: 'Produits Solaires & Bronzage', slug: 'produits-solaires-bronzage', level: 3, icon: generateIconUrl('produits-solaires-bronzage', 'cosmetiques-beaute', 'sante-beaute'), children: [] },
          { name: 'Instruments & Outils de beauté', slug: 'instruments-outils-beaute', level: 3, icon: generateIconUrl('instruments-outils-beaute', 'cosmetiques-beaute', 'sante-beaute'), children: [] },
          { name: 'Manucure et pedicure', slug: 'manucure-pedicure', level: 3, icon: generateIconUrl('manucure-pedicure', 'cosmetiques-beaute', 'sante-beaute'), children: [] },
          { name: 'Rasage et Épilation', slug: 'rasage-epilation', level: 3, icon: generateIconUrl('rasage-epilation', 'cosmetiques-beaute', 'sante-beaute'), children: [] },
          { name: 'Hygiène', slug: 'hygiene', level: 3, icon: generateIconUrl('hygiene', 'cosmetiques-beaute', 'sante-beaute'), children: [] },
          { name: 'Coiffure', slug: 'coiffure', level: 3, icon: generateIconUrl('coiffure', 'cosmetiques-beaute', 'sante-beaute'), children: [] },
          { name: 'Soins bébé', slug: 'soins-bebe', level: 3, icon: generateIconUrl('soins-bebe', 'cosmetiques-beaute', 'sante-beaute'), children: [] },
          { name: 'Autres produits', slug: 'autres-produits-beaute', level: 3, icon: generateIconUrl('autres-produits-beaute', 'cosmetiques-beaute', 'sante-beaute'), children: [] }
        ]
      },
      {
        name: 'Parapharmacie & Santé',
        slug: 'parapharmacie-sante',
        level: 2,
        icon: generateIconUrl('parapharmacie-sante', 'sante-beaute'),
        order: 2,
        children: [
          { name: 'Dispositifs médicaux', slug: 'dispositifs-medicaux', level: 3, icon: generateIconUrl('dispositifs-medicaux', 'parapharmacie-sante', 'sante-beaute'), children: [] },
          { name: 'Complément Alimentaire', slug: 'complement-alimentaire', level: 3, icon: generateIconUrl('complement-alimentaire', 'parapharmacie-sante', 'sante-beaute'), children: [] },
          { name: 'Matériel Médical', slug: 'materiel-medical', level: 3, icon: generateIconUrl('materiel-medical', 'parapharmacie-sante', 'sante-beaute'), children: [] },
          { name: 'Aliments Diététiques', slug: 'aliments-dietetiques-sante', level: 3, icon: generateIconUrl('aliments-dietetiques-sante', 'parapharmacie-sante', 'sante-beaute'), children: [] }
        ]
      },
      { name: 'Parfums et déodorants femme', slug: 'parfums-deodorants-femme', level: 2, icon: generateIconUrl('parfums-deodorants-femme', 'sante-beaute'), order: 3, children: [] },
      { name: 'Parfums et déodorants homme', slug: 'parfums-deodorants-homme', level: 2, icon: generateIconUrl('parfums-deodorants-homme', 'sante-beaute'), order: 4, children: [] },
      { name: 'Accessoires beauté', slug: 'accessoires-beaute', level: 2, icon: generateIconUrl('accessoires-beaute', 'sante-beaute'), order: 5, children: [] },
      { name: 'Soins cheveux', slug: 'soins-cheveux', level: 2, icon: generateIconUrl('soins-cheveux', 'sante-beaute'), order: 6, children: [] },
      { name: 'Autre Santé & Beauté', slug: 'autre-sante-beaute', level: 2, icon: generateIconUrl('autre-sante-beaute', 'sante-beaute'), order: 7, children: [] }
    ]
  },

  // ==================== 13. SERVICES ====================
  {
    name: 'Services',
    slug: 'services',
    level: 1,
    icon: generateIconUrl('services'),
    order: 16,
    children: [
      { name: 'Construction & Travaux', slug: 'construction-travaux', level: 2, icon: generateIconUrl('construction-travaux', 'services'), order: 1, children: [] },
      { name: 'Ecoles & Formations', slug: 'ecoles-formations', level: 2, icon: generateIconUrl('ecoles-formations', 'services'), order: 2, children: [] },
      { name: 'Industrie & Fabrication', slug: 'industrie-fabrication-services', level: 2, icon: generateIconUrl('industrie-fabrication-services', 'services'), order: 3, children: [] },
      { name: 'Transport et déménagement', slug: 'transport-demenagement', level: 2, icon: generateIconUrl('transport-demenagement', 'services'), order: 4, children: [] },
      { name: 'Décoration & Aménagement', slug: 'decoration-amenagement', level: 2, icon: generateIconUrl('decoration-amenagement', 'services'), order: 5, children: [] },
      { name: 'Publicite & Communication', slug: 'publicite-communication', level: 2, icon: generateIconUrl('publicite-communication', 'services'), order: 6, children: [] },
      { name: 'Nettoyage & Jardinage', slug: 'nettoyage-jardinage', level: 2, icon: generateIconUrl('nettoyage-jardinage', 'services'), order: 7, children: [] },
      { name: 'Froid & Climatisation', slug: 'froid-climatisation', level: 2, icon: generateIconUrl('froid-climatisation', 'services'), order: 8, children: [] },
      { name: 'Traiteurs & Gateaux', slug: 'traiteurs-gateaux', level: 2, icon: generateIconUrl('traiteurs-gateaux', 'services'), order: 9, children: [] },
      { name: 'Médecine & Santé', slug: 'medecine-sante', level: 2, icon: generateIconUrl('medecine-sante', 'services'), order: 10, children: [] },
      { name: 'Réparation auto & Diagnostic', slug: 'reparation-auto-diagnostic', level: 2, icon: generateIconUrl('reparation-auto-diagnostic', 'services'), order: 11, children: [] },
      { name: 'Sécurité & Alarme', slug: 'securite-alarme', level: 2, icon: generateIconUrl('securite-alarme', 'services'), order: 12, children: [] },
      { name: 'Projets & Études', slug: 'projets-etudes', level: 2, icon: generateIconUrl('projets-etudes', 'services'), order: 13, children: [] },
      { name: 'Bureautique & Internet', slug: 'bureautique-internet', level: 2, icon: generateIconUrl('bureautique-internet', 'services'), order: 14, children: [] },
      { name: 'Location de véhicules', slug: 'location-vehicules', level: 2, icon: generateIconUrl('location-vehicules', 'services'), order: 15, children: [] },
      { name: 'Menuiserie & Meubles', slug: 'menuiserie-meubles', level: 2, icon: generateIconUrl('menuiserie-meubles', 'services'), order: 16, children: [] },
      { name: 'Impression & Edition', slug: 'impression-edition', level: 2, icon: generateIconUrl('impression-edition', 'services'), order: 17, children: [] },
      { name: 'Hôtellerie & Restauration & Salles', slug: 'hotellerie-restauration-salles', level: 2, icon: generateIconUrl('hotellerie-restauration-salles', 'services'), order: 18, children: [] },
      { name: 'Esthétique & Beauté', slug: 'esthetique-beaute', level: 2, icon: generateIconUrl('esthetique-beaute', 'services'), order: 19, children: [] },
      { name: 'Image & Son', slug: 'image-son', level: 2, icon: generateIconUrl('image-son', 'services'), order: 20, children: [] },
      { name: 'Comptabilité & Economie', slug: 'comptabilite-economie', level: 2, icon: generateIconUrl('comptabilite-economie', 'services'), order: 21, children: [] },
      { name: 'Couture & Confection', slug: 'couture-confection', level: 2, icon: generateIconUrl('couture-confection', 'services'), order: 22, children: [] },
      { name: 'Maintenance informatique', slug: 'maintenance-informatique', level: 2, icon: generateIconUrl('maintenance-informatique', 'services'), order: 23, children: [] },
      { name: 'Réparation Electromenager', slug: 'reparation-electromenager', level: 2, icon: generateIconUrl('reparation-electromenager', 'services'), order: 24, children: [] },
      { name: 'Evènements & Divertissement', slug: 'evenements-divertissement', level: 2, icon: generateIconUrl('evenements-divertissement', 'services'), order: 25, children: [] },
      { name: 'Paraboles & Démos', slug: 'paraboles-demos', level: 2, icon: generateIconUrl('paraboles-demos', 'services'), order: 26, children: [] },
      { name: 'Réparation Électronique', slug: 'reparation-electronique', level: 2, icon: generateIconUrl('reparation-electronique', 'services'), order: 27, children: [] },
      { name: 'Services à l\'étranger', slug: 'services-etranger', level: 2, icon: generateIconUrl('services-etranger', 'services'), order: 28, children: [] },
      { name: 'Flashage & Réparation des téléphones', slug: 'flashage-reparation-telephones', level: 2, icon: generateIconUrl('flashage-reparation-telephones', 'services'), order: 29, children: [] },
      { name: 'Flashage & Installation des jeux', slug: 'flashage-installation-jeux', level: 2, icon: generateIconUrl('flashage-installation-jeux', 'services'), order: 30, children: [] },
      { name: 'Juridique', slug: 'juridique', level: 2, icon: generateIconUrl('juridique', 'services'), order: 31, children: [] },
      { name: 'Autres Services', slug: 'autres-services', level: 2, icon: generateIconUrl('autres-services', 'services'), order: 32, children: [] }
    ]
  },

  // ==================== 14. SPORT ====================
  {
    name: 'Sport',
    slug: 'sport',
    level: 1,
    icon: generateIconUrl('sport'),
    order: 12,
    children: [
      {
        name: 'Football',
        slug: 'football',
        level: 2,
        icon: generateIconUrl('football', 'sport'),
        order: 1,
        children: [
          { name: 'Ballons et Buts', slug: 'ballons-buts', level: 3, icon: generateIconUrl('ballons-buts', 'football', 'sport'), children: [] },
          { name: 'Équipements et accessoires', slug: 'equipements-accessoires-foot', level: 3, icon: generateIconUrl('equipements-accessoires-foot', 'football', 'sport'), children: [] },
          { name: 'Chaussures de Football', slug: 'chaussures-football', level: 3, icon: generateIconUrl('chaussures-football', 'football', 'sport'), children: [] },
          { name: 'Vêtements de football', slug: 'vetements-football', level: 3, icon: generateIconUrl('vetements-football', 'football', 'sport'), children: [] }
        ]
      },
      {
        name: 'Hand/Voley/ Basket-Ball',
        slug: 'hand-voley-basket',
        level: 2,
        icon: generateIconUrl('hand-voley-basket', 'sport'),
        order: 2,
        children: [
          { name: 'Équipements et accessoires', slug: 'equipements-accessoires-basket', level: 3, icon: generateIconUrl('equipements-accessoires-basket', 'hand-voley-basket', 'sport'), children: [] },
          { name: 'Ballons Buts et Filets', slug: 'ballons-buts-filets', level: 3, icon: generateIconUrl('ballons-buts-filets', 'hand-voley-basket', 'sport'), children: [] },
          { name: 'Chaussures', slug: 'chaussures-basket', level: 3, icon: generateIconUrl('chaussures-basket', 'hand-voley-basket', 'sport'), children: [] },
          { name: 'Vêtements', slug: 'vetements-basket', level: 3, icon: generateIconUrl('vetements-basket', 'hand-voley-basket', 'sport'), children: [] }
        ]
      },
      {
        name: 'Sport de combat',
        slug: 'sport-combat',
        level: 2,
        icon: generateIconUrl('sport-combat', 'sport'),
        order: 3,
        children: [
          { name: 'Tenue', slug: 'tenue-combat', level: 3, icon: generateIconUrl('tenue-combat', 'sport-combat', 'sport'), children: [] },
          { name: 'Gants et casques', slug: 'gants-casques', level: 3, icon: generateIconUrl('gants-casques', 'sport-combat', 'sport'), children: [] },
          { name: 'Autres accessoires', slug: 'autres-accessoires-combat', level: 3, icon: generateIconUrl('autres-accessoires-combat', 'sport-combat', 'sport'), children: [] }
        ]
      },
      {
        name: 'Fitness - Musculation',
        slug: 'fitness-musculation',
        level: 2,
        icon: generateIconUrl('fitness-musculation', 'sport'),
        order: 4,
        children: [
          { name: 'Bancs et presses de musculation', slug: 'bancs-presses', level: 3, icon: generateIconUrl('bancs-presses', 'fitness-musculation', 'sport'), children: [] },
          { name: 'Poids et haltères', slug: 'poids-halteres', level: 3, icon: generateIconUrl('poids-halteres', 'fitness-musculation', 'sport'), children: [] },
          { name: 'Tapis roulants', slug: 'tapis-roulants', level: 3, icon: generateIconUrl('tapis-roulants', 'fitness-musculation', 'sport'), children: [] },
          { name: 'Vélos et rameurs', slug: 'velos-rameurs', level: 3, icon: generateIconUrl('velos-rameurs', 'fitness-musculation', 'sport'), children: [] },
          { name: 'Autres équipements', slug: 'autres-equipements-fitness', level: 3, icon: generateIconUrl('autres-equipements-fitness', 'fitness-musculation', 'sport'), children: [] }
        ]
      },
      {
        name: 'Natation',
        slug: 'natation',
        level: 2,
        icon: generateIconUrl('natation', 'sport'),
        order: 5,
        children: [
          { name: 'Lunettes', slug: 'lunettes-natation', level: 3, icon: generateIconUrl('lunettes-natation', 'natation', 'sport'), children: [] },
          { name: 'Bonnets', slug: 'bonnets', level: 3, icon: generateIconUrl('bonnets', 'natation', 'sport'), children: [] },
          { name: 'Palmes', slug: 'palmes', level: 3, icon: generateIconUrl('palmes', 'natation', 'sport'), children: [] },
          { name: 'Planches et flotteurs', slug: 'planches-flotteurs', level: 3, icon: generateIconUrl('planches-flotteurs', 'natation', 'sport'), children: [] },
          { name: 'Maillots et combinaisons', slug: 'maillots-combinaisons', level: 3, icon: generateIconUrl('maillots-combinaisons', 'natation', 'sport'), children: [] },
          { name: 'Autres accessoires', slug: 'autres-accessoires-natation', level: 3, icon: generateIconUrl('autres-accessoires-natation', 'natation', 'sport'), children: [] }
        ]
      },
      {
        name: 'Vélos et trotinettes',
        slug: 'velos-trotinettes',
        level: 2,
        icon: generateIconUrl('velos-trotinettes', 'sport'),
        order: 6,
        children: [
          { name: 'Vêtements et chaussures', slug: 'vetements-chaussures-velo', level: 3, icon: generateIconUrl('vetements-chaussures-velo', 'velos-trotinettes', 'sport'), children: [] },
          { name: 'Vélos', slug: 'velos', level: 3, icon: generateIconUrl('velos', 'velos-trotinettes', 'sport'), children: [] },
          { name: 'Trotinettes', slug: 'trotinettes', level: 3, icon: generateIconUrl('trotinettes', 'velos-trotinettes', 'sport'), children: [] },
          { name: 'Équipements et accessoires', slug: 'equipements-accessoires-velo', level: 3, icon: generateIconUrl('equipements-accessoires-velo', 'velos-trotinettes', 'sport'), children: [] }
        ]
      },
      {
        name: 'Sports de raquette',
        slug: 'sports-raquette',
        level: 2,
        icon: generateIconUrl('sports-raquette', 'sport'),
        order: 7,
        children: [
          { name: 'Tennis', slug: 'tennis', level: 3, icon: generateIconUrl('tennis', 'sports-raquette', 'sport'), children: [] },
          { name: 'Tennis de table', slug: 'tennis-table', level: 3, icon: generateIconUrl('tennis-table', 'sports-raquette', 'sport'), children: [] },
          { name: 'Autre', slug: 'autre-raquette', level: 3, icon: generateIconUrl('autre-raquette', 'sports-raquette', 'sport'), children: [] }
        ]
      },
      { name: 'Sport aquatiques', slug: 'sport-aquatiques', level: 2, icon: generateIconUrl('sport-aquatiques', 'sport'), order: 8, children: [] },
      { name: 'Équitation', slug: 'equitation', level: 2, icon: generateIconUrl('equitation', 'sport'), order: 9, children: [] },
      { name: 'Pétanque', slug: 'petanque', level: 2, icon: generateIconUrl('petanque', 'sport'), order: 10, children: [] },
      { name: 'Autres', slug: 'autres-sports', level: 2, icon: generateIconUrl('autres-sports', 'sport'), order: 11, children: [] }
    ]
  },

  // ==================== 15. VOYAGES ====================
  {
    name: 'Voyages',
    slug: 'voyages',
    level: 1,
    icon: generateIconUrl('voyages'),
    order: 15,
    children: [
      { name: 'Voyage organisé', slug: 'voyage-organise', level: 2, icon: generateIconUrl('voyage-organise', 'voyages'), order: 1, children: [] },
      { name: 'Location vacances', slug: 'location-vacances-voyages', level: 2, icon: generateIconUrl('location-vacances-voyages', 'voyages'), order: 2, children: [] },
      { name: 'Hajj & Omra', slug: 'hajj-omra', level: 2, icon: generateIconUrl('hajj-omra', 'voyages'), order: 3, children: [] },
      { name: 'Réservations & Visa', slug: 'reservations-visa', level: 2, icon: generateIconUrl('reservations-visa', 'voyages'), order: 4, children: [] },
      { name: 'Séjour', slug: 'sejour', level: 2, icon: generateIconUrl('sejour', 'voyages'), order: 5, children: [] },
      { name: 'Croisière', slug: 'croisiere', level: 2, icon: generateIconUrl('croisiere', 'voyages'), order: 6, children: [] },
      { name: 'Autre voyages', slug: 'autre-voyages', level: 2, icon: generateIconUrl('autre-voyages', 'voyages'), order: 7, children: [] }
    ]
  },

  // ==================== 16. BOUTIQUES ====================
  {
    name: 'Boutiques',
    slug: 'boutiques',
    level: 1,
    icon: generateIconUrl('boutiques'),
    order: 0,
    children: [
      { name: 'Agences immobilières', slug: 'agences-immobilieres', level: 2, icon: generateIconUrl('agences-immobilieres', 'boutiques'), order: 1, children: [] },
      { name: 'Promotions immobilières', slug: 'promotions-immobilieres', level: 2, icon: generateIconUrl('promotions-immobilieres', 'boutiques'), order: 2, children: [] },
      { name: 'Showroom automobiles', slug: 'showroom-automobiles', level: 2, icon: generateIconUrl('showroom-automobiles', 'boutiques'), order: 3, children: [] },
      { name: 'Showroom moto', slug: 'showroom-moto', level: 2, icon: generateIconUrl('showroom-moto', 'boutiques'), order: 4, children: [] },
      { name: 'Camions & Engins', slug: 'camions-engins', level: 2, icon: generateIconUrl('camions-engins', 'boutiques'), order: 5, children: [] },
      { name: 'Pièces & Accessoires Véhicules', slug: 'pieces-accessoires-vehicules', level: 2, icon: generateIconUrl('pieces-accessoires-vehicules', 'boutiques'), order: 6, children: [] },
      { name: 'Location de voitures', slug: 'location-voitures', level: 2, icon: generateIconUrl('location-voitures', 'boutiques'), order: 7, children: [] },
      { name: 'Réparation & Services Véhicules', slug: 'reparation-services-vehicules', level: 2, icon: generateIconUrl('reparation-services-vehicules', 'boutiques'), order: 8, children: [] },
      { name: 'Téléphones & Accessoires', slug: 'telephones-accessoires', level: 2, icon: generateIconUrl('telephones-accessoires', 'boutiques'), order: 9, children: [] },
      { name: 'Magasin d\'informatique', slug: 'magasin-informatique', level: 2, icon: generateIconUrl('magasin-informatique', 'boutiques'), order: 10, children: [] },
      { name: 'Magasin d\'électroménager', slug: 'magasin-electromenager', level: 2, icon: generateIconUrl('magasin-electromenager', 'boutiques'), order: 11, children: [] },
      { name: 'Equipements de sécurité', slug: 'equipements-securite', level: 2, icon: generateIconUrl('equipements-securite', 'boutiques'), order: 12, children: [] },
      { name: 'Audiovisuel', slug: 'audiovisuel', level: 2, icon: generateIconUrl('audiovisuel', 'boutiques'), order: 13, children: [] },
      { name: 'Electronique', slug: 'electronique', level: 2, icon: generateIconUrl('electronique', 'boutiques'), order: 14, children: [] },
      { name: 'Vêtements & Accessoires de mode', slug: 'vetements-accessoires-mode', level: 2, icon: generateIconUrl('vetements-accessoires-mode', 'boutiques'), order: 15, children: [] },
      { name: 'Cosmétiques & Beauté', slug: 'cosmetiques-et-beaute', level: 2, icon: generateIconUrl('cosmetiques-et-beaute', 'boutiques'), order: 16, children: [] },
      { name: 'Maison & Meubles', slug: 'maison-meubles', level: 2, icon: generateIconUrl('maison-meubles', 'boutiques'), order: 17, children: [] },
      { name: 'Meubles de bureau', slug: 'meubles-et-bureau', level: 2, icon: generateIconUrl('meubles-et-bureau', 'boutiques'), order: 18, children: [] },
      { name: 'Vaisselles', slug: 'vaisselles', level: 2, icon: generateIconUrl('vaisselles', 'boutiques'), order: 19, children: [] },
      { name: 'Puéricultures & Jouets', slug: 'puericultures-jouets', level: 2, icon: generateIconUrl('puericultures-jouets', 'boutiques'), order: 20, children: [] },
      { name: 'Jardinage', slug: 'jardinages', level: 2, icon: generateIconUrl('jardinages', 'boutiques'), order: 21, children: [] },
      { name: 'Fournitures & Articles scolaires', slug: 'fournitures-articles-scolaires', level: 2, icon: generateIconUrl('fournitures-articles-scolaires', 'boutiques'), order: 22, children: [] },
      { name: 'Articles de sport', slug: 'articles-sport', level: 2, icon: generateIconUrl('articles-sport', 'boutiques'), order: 23, children: [] },
      { name: 'Consoles & Jeux vidéo', slug: 'consoles-jeux-video', level: 2, icon: generateIconUrl('consoles-jeux-video', 'boutiques'), order: 24, children: [] },
      { name: 'Librairie & Papeterie', slug: 'librairie-papeterie', level: 2, icon: generateIconUrl('librairie-papeterie', 'boutiques'), order: 25, children: [] },
      { name: 'Instruments de musique', slug: 'instruments-et-musique', level: 2, icon: generateIconUrl('instruments-et-musique', 'boutiques'), order: 26, children: [] },
      { name: 'Chasse & Pêche', slug: 'chasse-et-peche', level: 2, icon: generateIconUrl('chasse-et-peche', 'boutiques'), order: 27, children: [] },
      { name: 'Outillages & Quincaillerie', slug: 'outillages-quincaillerie', level: 2, icon: generateIconUrl('outillages-quincaillerie', 'boutiques'), order: 28, children: [] },
      { name: 'Matériaux de construction', slug: 'materiaux-et-construction', level: 2, icon: generateIconUrl('materiaux-et-construction', 'boutiques'), order: 29, children: [] },
      { name: 'Matériel professionnel', slug: 'materiel-et-professionnel', level: 2, icon: generateIconUrl('materiel-et-professionnel', 'boutiques'), order: 30, children: [] },
      { name: 'Matières premières', slug: 'matieres-et-premieres', level: 2, icon: generateIconUrl('matieres-et-premieres', 'boutiques'), order: 31, children: [] },
      { name: 'Agences de voyages', slug: 'agences-voyages', level: 2, icon: generateIconUrl('agences-voyages', 'boutiques'), order: 32, children: [] },
      { name: 'Animalerie', slug: 'animaleries', level: 2, icon: generateIconUrl('animaleries', 'boutiques'), order: 33, children: [] },
      { name: 'Alimentaire', slug: 'alimentaire', level: 2, icon: generateIconUrl('alimentaire', 'boutiques'), order: 34, children: [] },
      { name: 'Transport & Déménagement', slug: 'transport-et-demenagement', level: 2, icon: generateIconUrl('transport-et-demenagement', 'boutiques'), order: 35, children: [] },
      { name: 'Travaux de Construction & d\'Aménagement', slug: 'travaux-construction-amenagement', level: 2, icon: generateIconUrl('travaux-construction-amenagement', 'boutiques'), order: 36, children: [] },
      { name: 'Ecoles & Formations', slug: 'ecoles-et-formations', level: 2, icon: generateIconUrl('ecoles-et-formations', 'boutiques'), order: 37, children: [] },
      { name: 'Publicité & Communication', slug: 'publicite-et-communication', level: 2, icon: generateIconUrl('publicite-et-communication', 'boutiques'), order: 38, children: [] },
      { name: 'Service de Nettoyage & Entretien', slug: 'service-nettoyage-entretien', level: 2, icon: generateIconUrl('service-nettoyage-entretien', 'boutiques'), order: 39, children: [] },
      { name: 'Froid & Climatisation', slug: 'froid-et-climatisation', level: 2, icon: generateIconUrl('froid-et-climatisation', 'boutiques'), order: 40, children: [] },
      { name: 'Traiteur & Gateaux', slug: 'traiteur-gateaux', level: 2, icon: generateIconUrl('traiteur-gateaux', 'boutiques'), order: 41, children: [] },
      { name: 'Hôtels', slug: 'hotels', level: 2, icon: generateIconUrl('hotels', 'boutiques'), order: 42, children: [] },
      { name: 'Restaurants & Salles des fêtes', slug: 'restaurants-salles-fetes', level: 2, icon: generateIconUrl('restaurants-salles-fetes', 'boutiques'), order: 43, children: [] },
      { name: 'Services de santé', slug: 'services-sante', level: 2, icon: generateIconUrl('services-sante', 'boutiques'), order: 44, children: [] },
      { name: 'Etudes & Consulting', slug: 'etudes-consulting', level: 2, icon: generateIconUrl('etudes-consulting', 'boutiques'), order: 45, children: [] },
      { name: 'Logiciel & Web services', slug: 'logiciel-web-services', level: 2, icon: generateIconUrl('logiciel-web-services', 'boutiques'), order: 46, children: [] },
      { name: 'Esthétique & Bien être', slug: 'esthetique-bien-etre', level: 2, icon: generateIconUrl('esthetique-bien-etre', 'boutiques'), order: 47, children: [] },
      { name: 'Comptabilité & Finance', slug: 'comptabilite-finance', level: 2, icon: generateIconUrl('comptabilite-finance', 'boutiques'), order: 48, children: [] },
      { name: 'Couture & Confection', slug: 'couture-et-confection', level: 2, icon: generateIconUrl('couture-et-confection', 'boutiques'), order: 49, children: [] },
      { name: 'Réparation Electronique & Electroménager', slug: 'reparation-electronique-electromenager', level: 2, icon: generateIconUrl('reparation-electronique-electromenager', 'boutiques'), order: 50, children: [] }
    ]
  },

  // ==================== 17. TÉLÉPHONE ====================
  {
    name: 'Téléphone',
    slug: 'telephone',
    level: 1,
    icon: generateIconUrl('telephone'),
    order: 4,
    children: [
      { name: 'Smartphones', slug: 'smartphones', level: 2, icon: generateIconUrl('smartphones', 'telephone'), order: 1, children: [] },
      { name: 'Téléphones cellulaires', slug: 'telephones-cellulaires', level: 2, icon: generateIconUrl('telephones-cellulaires', 'telephone'), order: 2, children: [] },
      { name: 'Tablettes', slug: 'tablettes', level: 2, icon: generateIconUrl('tablettes', 'telephone'), order: 3, children: [] },
      { name: 'Fixes & Fax', slug: 'fixes-fax', level: 2, icon: generateIconUrl('fixes-fax', 'telephone'), order: 4, children: [] },
      { name: 'Smartwatchs', slug: 'smartwatchs', level: 2, icon: generateIconUrl('smartwatchs', 'telephone'), order: 5, children: [] },
      { name: 'Pièces de rechange', slug: 'pieces-rechange-telephone', level: 2, icon: generateIconUrl('pieces-rechange-telephone', 'telephone'), order: 7, children: [] },
      { name: 'Offres & Abonnements', slug: 'offres-abonnements', level: 2, icon: generateIconUrl('offres-abonnements', 'telephone'), order: 8, children: [] },
      {
        name: 'Accessoires',
        slug: 'accessoires-telephone',
        level: 2,
        icon: generateIconUrl('accessoires-telephone', 'telephone'),
        order: 6,
        children: [
          { name: 'Étuis', slug: 'etuis', level: 3, icon: generateIconUrl('etuis', 'accessoires-telephone', 'telephone'), children: [] },
          { name: 'Films de protection', slug: 'films-protection', level: 3, icon: generateIconUrl('films-protection', 'accessoires-telephone', 'telephone'), children: [] },
          { name: 'Protections d\'écran', slug: 'protections-ecran', level: 3, icon: generateIconUrl('protections-ecran', 'accessoires-telephone', 'telephone'), children: [] },
          { name: 'Coques & Antichoc', slug: 'coques-antichoc', level: 3, icon: generateIconUrl('coques-antichoc', 'accessoires-telephone', 'telephone'), children: [] },
          { name: 'Protections de caméra', slug: 'protections-camera', level: 3, icon: generateIconUrl('protections-camera', 'accessoires-telephone', 'telephone'), children: [] }
        ]
      },
      {
        name: 'Protection & Antichoc',
        slug: 'protection-antichoc',
        level: 2,
        icon: generateIconUrl('protection-antichoc', 'telephone'),
        order: 9,
        children: [
          { name: 'Protections d\'écran renforcées', slug: 'protections-ecran-renforcees', level: 3, icon: generateIconUrl('protections-ecran-renforcees', 'protection-antichoc', 'telephone'), children: [] },
          { name: 'Coques antichoc', slug: 'coques-antichoc-pro', level: 3, icon: generateIconUrl('coques-antichoc-pro', 'protection-antichoc', 'telephone'), children: [] },
          { name: 'Films de protection', slug: 'films-protection-antichoc', level: 3, icon: generateIconUrl('films-protection-antichoc', 'protection-antichoc', 'telephone'), children: [] },
          { name: 'Étuis renforcés', slug: 'etuis-renforces', level: 3, icon: generateIconUrl('etuis-renforces', 'protection-antichoc', 'telephone'), children: [] },
          { name: 'Protections de caméra', slug: 'protections-camera-antichoc', level: 3, icon: generateIconUrl('protections-camera-antichoc', 'protection-antichoc', 'telephone'), children: [] }
        ]
      },
      {
        name: 'Ecouteurs & Son',
        slug: 'ecouteurs-son',
        level: 2,
        icon: generateIconUrl('ecouteurs-son', 'telephone'),
        order: 10,
        children: [
          { name: 'Écouteurs filaires', slug: 'ecouteurs-filaires', level: 3, icon: generateIconUrl('ecouteurs-filaires', 'ecouteurs-son', 'telephone'), children: [] },
          { name: 'Écouteurs Bluetooth', slug: 'ecouteurs-bluetooth', level: 3, icon: generateIconUrl('ecouteurs-bluetooth', 'ecouteurs-son', 'telephone'), children: [] },
          { name: 'Casques audio', slug: 'casques-audio', level: 3, icon: generateIconUrl('casques-audio', 'ecouteurs-son', 'telephone'), children: [] },
          { name: 'Hauts-parleurs portables', slug: 'hauts-parleurs-portables', level: 3, icon: generateIconUrl('hauts-parleurs-portables', 'ecouteurs-son', 'telephone'), children: [] },
          { name: 'Adaptateurs audio', slug: 'adaptateurs-audio', level: 3, icon: generateIconUrl('adaptateurs-audio', 'ecouteurs-son', 'telephone'), children: [] }
        ]
      },
      {
        name: 'Chargeurs & Câbles',
        slug: 'chargeurs-cables',
        level: 2,
        icon: generateIconUrl('chargeurs-cables', 'telephone'),
        order: 11,
        children: [
          { name: 'Chargeurs mural', slug: 'chargeurs-mural', level: 3, icon: generateIconUrl('chargeurs-mural', 'chargeurs-cables', 'telephone'), children: [] },
          { name: 'Chargeurs voiture', slug: 'chargeurs-voiture', level: 3, icon: generateIconUrl('chargeurs-voiture', 'chargeurs-cables', 'telephone'), children: [] },
          { name: 'Chargeurs sans fil', slug: 'chargeurs-sans-fil', level: 3, icon: generateIconUrl('chargeurs-sans-fil', 'chargeurs-cables', 'telephone'), children: [] },
          { name: 'Câbles USB', slug: 'cables-usb', level: 3, icon: generateIconUrl('cables-usb', 'chargeurs-cables', 'telephone'), children: [] },
          { name: 'Câbles Lightning', slug: 'cables-lightning', level: 3, icon: generateIconUrl('cables-lightning', 'chargeurs-cables', 'telephone'), children: [] },
          { name: 'Câbles Type-C', slug: 'cables-type-c', level: 3, icon: generateIconUrl('cables-type-c', 'chargeurs-cables', 'telephone'), children: [] },
          { name: 'Hubs chargeurs', slug: 'hubs-chargeurs', level: 3, icon: generateIconUrl('hubs-chargeurs', 'chargeurs-cables', 'telephone'), children: [] }
        ]
      },
      {
        name: 'Supports & Stabilisateurs',
        slug: 'supports-stabilisateurs',
        level: 2,
        icon: generateIconUrl('supports-stabilisateurs', 'telephone'),
        order: 12,
        children: [
          { name: 'Supports téléphone', slug: 'supports-telephone', level: 3, icon: generateIconUrl('supports-telephone', 'supports-stabilisateurs', 'telephone'), children: [] },
          { name: 'Stabilisateurs', slug: 'stabilisateurs', level: 3, icon: generateIconUrl('stabilisateurs', 'supports-stabilisateurs', 'telephone'), children: [] },
          { name: 'Barres de selfies', slug: 'barres-selfies', level: 3, icon: generateIconUrl('barres-selfies', 'supports-stabilisateurs', 'telephone'), children: [] },
          { name: 'Pieds pour téléphone', slug: 'pieds-telephone', level: 3, icon: generateIconUrl('pieds-telephone', 'supports-stabilisateurs', 'telephone'), children: [] },
          { name: 'Ventouses voiture', slug: 'ventouses-voiture', level: 3, icon: generateIconUrl('ventouses-voiture', 'supports-stabilisateurs', 'telephone'), children: [] }
        ]
      },
      {
        name: 'Manettes',
        slug: 'manettes-telephone',
        level: 2,
        icon: generateIconUrl('manettes-telephone', 'telephone'),
        order: 13,
        children: [
          { name: 'Manettes Bluetooth', slug: 'manettes-bluetooth', level: 3, icon: generateIconUrl('manettes-bluetooth', 'manettes-telephone', 'telephone'), children: [] },
          { name: 'Manettes filaires', slug: 'manettes-filaires', level: 3, icon: generateIconUrl('manettes-filaires', 'manettes-telephone', 'telephone'), children: [] },
          { name: 'Manettes pour téléphone', slug: 'manettes-pour-telephone', level: 3, icon: generateIconUrl('manettes-pour-telephone', 'manettes-telephone', 'telephone'), children: [] },
          { name: 'Manettes pour tablette', slug: 'manettes-pour-tablette', level: 3, icon: generateIconUrl('manettes-pour-tablette', 'manettes-telephone', 'telephone'), children: [] },
          { name: 'Accessoires pour manettes', slug: 'accessoires-manettes', level: 3, icon: generateIconUrl('accessoires-manettes', 'manettes-telephone', 'telephone'), children: [] }
        ]
      },
      {
        name: 'VR',
        slug: 'vr-telephone',
        level: 2,
        icon: generateIconUrl('vr-telephone', 'telephone'),
        order: 14,
        children: [
          { name: 'Casques VR', slug: 'casques-vr', level: 3, icon: generateIconUrl('casques-vr', 'vr-telephone', 'telephone'), children: [] },
          { name: 'Lunettes VR', slug: 'lunettes-vr', level: 3, icon: generateIconUrl('lunettes-vr', 'vr-telephone', 'telephone'), children: [] },
          { name: 'Accessoires VR', slug: 'accessoires-vr', level: 3, icon: generateIconUrl('accessoires-vr', 'vr-telephone', 'telephone'), children: [] },
          { name: 'Contrôleurs VR', slug: 'controleurs-vr', level: 3, icon: generateIconUrl('controleurs-vr', 'vr-telephone', 'telephone'), children: [] },
          { name: 'Jeux VR', slug: 'jeux-vr', level: 3, icon: generateIconUrl('jeux-vr', 'vr-telephone', 'telephone'), children: [] }
        ]
      },
      {
        name: 'Power banks',
        slug: 'power-banks',
        level: 2,
        icon: generateIconUrl('power-banks', 'telephone'),
        order: 15,
        children: [
          { name: 'Power bank 10,000mAh', slug: 'power-bank-10000mah', level: 3, icon: generateIconUrl('power-bank-10000mah', 'power-banks', 'telephone'), children: [] },
          { name: 'Power bank 20,000mAh', slug: 'power-bank-20000mah', level: 3, icon: generateIconUrl('power-bank-20000mah', 'power-banks', 'telephone'), children: [] },
          { name: 'Power bank solaire', slug: 'power-bank-solaire', level: 3, icon: generateIconUrl('power-bank-solaire', 'power-banks', 'telephone'), children: [] },
          { name: 'Power bank charge rapide', slug: 'power-bank-rapide', level: 3, icon: generateIconUrl('power-bank-rapide', 'power-banks', 'telephone'), children: [] },
          { name: 'Power bank compact', slug: 'power-bank-compact', level: 3, icon: generateIconUrl('power-bank-compact', 'power-banks', 'telephone'), children: [] }
        ]
      },
      {
        name: 'Stylets',
        slug: 'stylets',
        level: 2,
        icon: generateIconUrl('stylets', 'telephone'),
        order: 16,
        children: [
          { name: 'Stylets actifs', slug: 'stylets-actifs', level: 3, icon: generateIconUrl('stylets-actifs', 'stylets', 'telephone'), children: [] },
          { name: 'Stylets passifs', slug: 'stylets-passifs', level: 3, icon: generateIconUrl('stylets-passifs', 'stylets', 'telephone'), children: [] },
          { name: 'Stylets Bluetooth', slug: 'stylets-bluetooth', level: 3, icon: generateIconUrl('stylets-bluetooth', 'stylets', 'telephone'), children: [] },
          { name: 'Stylets pour tablette', slug: 'stylets-tablette', level: 3, icon: generateIconUrl('stylets-tablette', 'stylets', 'telephone'), children: [] },
          { name: 'Recharges pour stylet', slug: 'recharges-stylet', level: 3, icon: generateIconUrl('recharges-stylet', 'stylets', 'telephone'), children: [] }
        ]
      },
      {
        name: 'Cartes Mémoire',
        slug: 'cartes-memoire',
        level: 2,
        icon: generateIconUrl('cartes-memoire', 'telephone'),
        order: 17,
        children: [
          { name: 'Cartes SD', slug: 'cartes-sd', level: 3, icon: generateIconUrl('cartes-sd', 'cartes-memoire', 'telephone'), children: [] },
          { name: 'Cartes Micro SD', slug: 'cartes-micro-sd', level: 3, icon: generateIconUrl('cartes-micro-sd', 'cartes-memoire', 'telephone'), children: [] },
          { name: 'Cartes SDHC', slug: 'cartes-sdhc', level: 3, icon: generateIconUrl('cartes-sdhc', 'cartes-memoire', 'telephone'), children: [] },
          { name: 'Cartes SDXC', slug: 'cartes-sdxc', level: 3, icon: generateIconUrl('cartes-sdxc', 'cartes-memoire', 'telephone'), children: [] },
          { name: 'Adaptateurs de carte', slug: 'adaptateurs-carte', level: 3, icon: generateIconUrl('adaptateurs-carte', 'cartes-memoire', 'telephone'), children: [] },
          { name: 'Lecteurs de carte', slug: 'lecteurs-carte', level: 3, icon: generateIconUrl('lecteurs-carte', 'cartes-memoire', 'telephone'), children: [] }
        ]
      }
    ]
  }
];

const seedCategories = async () => {
  try {
    // Eliminar categorías existentes
    await Category.deleteMany({});
    console.log('🗑️  Categorías eliminadas');

    // Función recursiva para crear categorías
    const createCategory = async (categoryData, parentId = null) => {
      const { children, ...categoryFields } = categoryData;
      const category = new Category({
        ...categoryFields,
        parent: parentId,
        // Añadir campo isLeaf si no tiene hijos
        isLeaf: !children || children.length === 0
      });

      await category.save();
      console.log(`✅ ${'  '.repeat(categoryData.level - 1)}${categoryData.name} (/${categoryData.slug}) - Icon: ${categoryData.icon}`);

      if (children && children.length > 0) {
        for (const childData of children) {
          await createCategory(childData, category._id);
        }
      }
    };

    // Crear categorías
    console.log('🌱 Iniciando seed con iconos PNG para todas las categorías...');
    for (const categoryData of categoriesData) {
      await createCategory(categoryData);
    }

    console.log('\n🎉 SEED COMPLETADO CON ÉXITO');
    console.log('📊 Resumen:');
    console.log(`   • ${categoriesData.length} categorías principales`);

    let totalLevel2 = 0;
    let totalLevel3 = 0;

    categoriesData.forEach(cat => {
      totalLevel2 += cat.children.length;
      cat.children.forEach(child => {
        totalLevel3 += child.children ? child.children.length : 0;
      });
    });

    console.log(`   • ${totalLevel2} subcategorías (nivel 2)`);
    console.log(`   • ${totalLevel3} artículos/tipos (nivel 3)`);
    console.log(`   • Total: ${categoriesData.length + totalLevel2 + totalLevel3} items`);
    console.log('\n🔗 URLs de ejemplo:');
    console.log('   • /category/immobilier/vente/appartement');
    console.log('   • /category/vehicules/motos-scooters');
    console.log('   • /category/telephone/smartphones');
    console.log('   • /category/telephone/chargeurs-cables/cables-type-c');
    console.log('\n✨ TODAS las categorías tienen iconos PNG de Cloudinary');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error en el seed:', error);
    process.exit(1);
  }
};