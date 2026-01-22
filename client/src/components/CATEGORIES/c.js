// scripts/seedAllCategories.js
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/Category');

// TODAS tus categorías en UN SOLO objeto
const COMPLETE_CATEGORIES = [
  // ============ CATEGORÍA 1: Immobilier ============
  {
    main: {
      name: "Immobilier",
      slug: "immobilier",
      emoji: "🏡",
      level: 1,
      order: 1
    },
    children: [
      {
        name: "Vente",
        slug: "vente",
        emoji: "💰",
        level: 2,
        order: 1,
        articles: [
          { name: "Villa", emoji: "🏡" },
          { name: "Appartement", emoji: "🏢" },
          { name: "Studio", emoji: "🛋️" },
          { name: "Terrain", emoji: "🌳" },
          { name: "Bureau", emoji: "💼" }
        ]
      },
      {
        name: "Location",
        slug: "location",
        emoji: "🏠",
        level: 2,
        order: 2,
        articles: [
          { name: "Appartement", emoji: "🏢" },
          { name: "Maison", emoji: "🏠" },
          { name: "Villa", emoji: "🏡" },
          { name: "Chambre", emoji: "🛏️" }
        ]
      },
      {
        name: "Échange",
        slug: "echange",
        emoji: "🔄",
        level: 2,
        order: 3,
        isLeaf: true  // No tiene artículos adicionales
      }
    ]
  },
  
  // ============ CATEGORÍA 2: Téléphones & Tablettes ============
  {
    main: {
      name: "Téléphones & Tablettes",
      slug: "telephones-tablettes",
      emoji: "📱",
      level: 1,
      order: 2
    },
    children: [
      // Items sin nivel extra
      {
        name: "Smartphones",
        slug: "smartphones",
        emoji: "📱",
        level: 2,
        order: 1,
        isLeaf: true  // Nivel final
      },
      {
        name: "Tablettes",
        slug: "tablettes",
        emoji: "💻",
        level: 2,
        order: 2,
        isLeaf: true
      },
      // Items con nivel extra
      {
        name: "Protection & Antichoc",
        slug: "protection-antichoc",
        emoji: "🛡️",
        level: 2,
        order: 3,
        articles: [
          { name: "Protections d'écran", emoji: "🖥️" },
          { name: "Coques & Antichoc", emoji: "📱" },
          { name: "Films de protection", emoji: "📋" }
        ]
      },
      {
        name: "Écouteurs & Son",
        slug: "ecouteurs-son",
        emoji: "🎵",
        level: 2,
        order: 4,
        articles: [
          { name: "Écouteurs filaires", emoji: "🎧" },
          { name: "Écouteurs Bluetooth", emoji: "🔵" },
          { name: "Casques audio", emoji: "🎧" }
        ]
      }
    ]
  },
  
  // ============ CATEGORÍA 3: Véhicules ============
  {
    main: {
      name: "Véhicules",
      slug: "vehicules",
      emoji: "🚗",
      level: 1,
      order: 3
    },
    children: [
      {
        name: "Voitures",
        slug: "voitures",
        emoji: "🚙",
        level: 2,
        order: 1,
        articles: [
          { name: "Berline", emoji: "🚘" },
          { name: "SUV", emoji: "🚙" },
          { name: "4x4", emoji: "🚜" },
          { name: "Utilitaire", emoji: "🚐" }
        ]
      },
      {
        name: "Motos",
        slug: "motos",
        emoji: "🏍️",
        level: 2,
        order: 2,
        articles: [
          { name: "Scooter", emoji: "🛵" },
          { name: "Roadster", emoji: "🏍️" },
          { name: "Custom", emoji: "🤠" },
          { name: "Sportive", emoji: "⚡" }
        ]
      },
      {
        name: "Camions",
        slug: "camions",
        emoji: "🚚",
        level: 2,
        order: 3,
        isLeaf: true
      }
    ]
  },
  
  // ============ CATEGORÍA 4: Vêtements ============
  {
    main: {
      name: "Vêtements",
      slug: "vetements",
      emoji: "👕",
      level: 1,
      order: 4
    },
    children: [
      {
        name: "Homme",
        slug: "homme",
        emoji: "👨",
        level: 2,
        order: 1,
        isLeaf: true
      },
      {
        name: "Femme",
        slug: "femme",
        emoji: "👩",
        level: 2,
        order: 2,
        isLeaf: true
      },
      {
        name: "Enfant",
        slug: "enfant",
        emoji: "🧒",
        level: 2,
        order: 3,
        isLeaf: true
      }
    ]
  }
  // ============ AGREGAR CATEGORÍAS 5-15 AQUÍ ============
];

async function seedAllCategories() {
  try {
    // 1. Conectar
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB conectado');
    
    // 2. Limpiar (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await Category.deleteMany({});
      console.log('🧹 Colección limpiada');
    }
    
    // 3. Contadores
    let totalInserted = 0;
    const categoryMap = new Map(); // Para guardar relaciones
    
    // 4. Insertar cada categoría principal y sus hijos
    for (const categoryGroup of COMPLETE_CATEGORIES) {
      console.log(`\n📦 Procesando: ${categoryGroup.main.name}`);
      
      // Insertar categoría principal
      const mainCat = new Category({
        name: categoryGroup.main.name,
        slug: categoryGroup.main.slug,
        emoji: categoryGroup.main.emoji,
        level: 1,
        parent: null,
        ancestors: [],
        path: categoryGroup.main.slug,
        order: categoryGroup.main.order,
        hasChildren: categoryGroup.children.length > 0,
        isLeaf: false
      });
      
      const savedMain = await mainCat.save();
      categoryMap.set(categoryGroup.main.slug, savedMain._id);
      totalInserted++;
      
      // Insertar subcategorías (nivel 2)
      for (const child of categoryGroup.children) {
        const childSlug = `${categoryGroup.main.slug}-${child.slug}`;
        const childPath = `${categoryGroup.main.slug}/${child.slug}`;
        
        const childCat = new Category({
          name: child.name,
          slug: childSlug,
          emoji: child.emoji,
          level: 2,
          parent: savedMain._id,
          ancestors: [savedMain._id],
          path: childPath,
          order: child.order,
          hasChildren: child.articles && child.articles.length > 0,
          isLeaf: child.isLeaf || false
        });
        
        const savedChild = await childCat.save();
        categoryMap.set(childSlug, savedChild._id);
        totalInserted++;
        
        // Insertar artículos (nivel 3) si existen
        if (child.articles && !child.isLeaf) {
          for (const article of child.articles) {
            const articleSlug = `${childSlug}-${article.name.toLowerCase().replace(/\s+/g, '-')}`;
            const articlePath = `${childPath}/${article.name.toLowerCase().replace(/\s+/g, '-')}`;
            
            const articleCat = new Category({
              name: article.name,
              slug: articleSlug,
              emoji: article.emoji,
              level: 3,
              parent: savedChild._id,
              ancestors: [savedMain._id, savedChild._id],
              path: articlePath,
              order: 1,
              hasChildren: false,
              isLeaf: true
            });
            
            await articleCat.save();
            categoryMap.set(articleSlug, articleCat._id);
            totalInserted++;
          }
        }
      }
    }
    
    // 5. Mostrar resumen
    console.log('\n🎉 ¡SEED COMPLETADO!');
    console.log('=' .repeat(40));
    console.log(`📊 TOTAL INSERTADOS: ${totalInserted}`);
    console.log(`🏠 Nivel 1 (Principal): ${await Category.countDocuments({ level: 1 })}`);
    console.log(`📂 Nivel 2 (Subcategoría): ${await Category.countDocuments({ level: 2 })}`);
    console.log(`📝 Nivel 3 (Artículo): ${await Category.countDocuments({ level: 3 })}`);
    console.log(`🍃 Hojas (Nivel final): ${await Category.countDocuments({ isLeaf: true })}`);
    
    // 6. Mostrar ejemplos de rutas
    console.log('\n🔗 Ejemplos de rutas creadas:');
    const examples = await Category.find({ level: 3 }).limit(3);
    examples.forEach(cat => {
      console.log(`• ${cat.path}`);
    });
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

// Ejecutar
if (require.main === module) {
  seedAllCategories();
}

module.exports = { COMPLETE_CATEGORIES, seedAllCategories };