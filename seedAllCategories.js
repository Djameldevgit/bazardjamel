// scripts/seedAllCategories.js
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/categoryModel');
 
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
          { name: "Appartement", emoji: "🏢" },
          { name: "Local", emoji: "🏪" },
          { name: "Villa", emoji: "🏡" },
          { name: "Terrain", emoji: "⛰️" },
          { name: "Terrain Agricole", emoji: "🌾" },
          { name: "Immeuble", emoji: "🏢" },
          { name: "Bungalow", emoji: "🏝️" },
          { name: "Hangar - Usine", emoji: "🏭" },
          { name: "Autre", emoji: "🏠" }
        ]
      },
      {
        name: "Location",
        slug: "location",
        emoji: "🔑",
        level: 2,
        order: 2,
        articles: [
          { name: "Appartement", emoji: "🏢" },
          { name: "Local", emoji: "🏪" },
          { name: "Villa", emoji: "🏡" },
          { name: "Immeuble", emoji: "🏢" },
          { name: "Bungalow", emoji: "🏝️" },
          { name: "Autre", emoji: "🏠" }
        ]
      },
      {
        name: "Location vacances",
        slug: "location_vacances",
        emoji: "🏖️",
        level: 2,
        order: 3,
        articles: [
          { name: "Appartement", emoji: "🏢" },
          { name: "Villa", emoji: "🏡" },
          { name: "Bungalow", emoji: "🏝️" },
          { name: "Autre", emoji: "🏠" }
        ]
      },
      {
        name: "Cherche location",
        slug: "cherche_location",
        emoji: "🔍",
        level: 2,
        order: 4,
        articles: [
          { name: "Appartement", emoji: "🏢" },
          { name: "Local", emoji: "🏪" },
          { name: "Villa", emoji: "🏡" },
          { name: "Immeuble", emoji: "🏢" },
          { name: "Bungalow", emoji: "🏝️" },
          { name: "Autre", emoji: "🏠" }
        ]
      },
      {
        name: "Cherche achat",
        slug: "cherche_achat",
        emoji: "🔍",
        level: 2,
        order: 5,
        articles: [
          { name: "Appartement", emoji: "🏢" },
          { name: "Local", emoji: "🏪" },
          { name: "Villa", emoji: "🏡" },
          { name: "Terrain", emoji: "⛰️" },
          { name: "Terrain Agricole", emoji: "🌾" },
          { name: "Immeuble", emoji: "🏢" },
          { name: "Bungalow", emoji: "🏝️" },
          { name: "Hangar - Usine", emoji: "🏭" },
          { name: "Autre", emoji: "🏠" }
        ]
      }
    ]
  },
  
  // ============ CATEGORÍA 2: Véhicules ============
  {
    main: {
      name: "Véhicules",
      slug: "vehicules",
      emoji: "🚗",
      level: 1,
      order: 2
    },
    children: [
      // CATEGORÍAS SIN NIVEL 3 (isLeaf: true)
      {
        name: "Voitures",
        slug: "voitures",
        emoji: "🚗",
        level: 2,
        order: 1,
        isLeaf: true
      },
      {
        name: "Utilitaire",
        slug: "utilitaire",
        emoji: "🚐",
        level: 2,
        order: 2,
        isLeaf: true
      },
      {
        name: "Fourgon",
        slug: "fourgon",
        emoji: "🚚",
        level: 2,
        order: 3,
        isLeaf: true
      },
      {
        name: "Camion",
        slug: "camion",
        emoji: "🚛",
        level: 2,
        order: 4,
        isLeaf: true
      },
      {
        name: "Bus",
        slug: "bus",
        emoji: "🚌",
        level: 2,
        order: 5,
        isLeaf: true
      },
      {
        name: "Tracteurs",
        slug: "tracteurs",
        emoji: "🚜",
        level: 2,
        order: 6,
        isLeaf: true
      },
      {
        name: "Remorques",
        slug: "remorques",
        emoji: "🚛",
        level: 2,
        order: 7,
        isLeaf: true
      },
      
      // CATEGORÍAS CON NIVEL 3 (con articles)
      {
        name: "Motos & Scooters",
        slug: "motos_scooters",
        emoji: "🏍️",
        level: 2,
        order: 8,
        articles: [
          { name: "Motos", emoji: "🏍️" },
          { name: "Scooters", emoji: "🛵" },
          { name: "Motos Cross", emoji: "🏁" },
          { name: "Scooters électriques", emoji: "⚡" },
          { name: "Accessoires motos", emoji: "🛡️" }
        ]
      },
      {
        name: "Quads",
        slug: "quads",
        emoji: "🚜",
        level: 2,
        order: 9,
        articles: [
          { name: "Quads enfants", emoji: "👶" },
          { name: "Quads adultes", emoji: "👨" },
          { name: "Quads utilitaire", emoji: "🛠️" },
          { name: "Quads sport", emoji: "🏁" }
        ]
      },
      {
        name: "Engin",
        slug: "engin",
        emoji: "🚜",
        level: 2,
        order: 10,
        articles: [
          { name: "Engins de chantier", emoji: "🏗️" },
          { name: "Engins agricoles", emoji: "🌾" },
          { name: "Nacelles & Élévatrices", emoji: "📐" },
          { name: "Compacteurs", emoji: "🛣️" },
          { name: "Grues", emoji: "🏗️" }
        ]
      },
      {
        name: "Bateaux & Barques",
        slug: "bateaux_barques",
        emoji: "🛥️",
        level: 2,
        order: 11,
        articles: [
          { name: "Jet-ski", emoji: "💨" },
          { name: "Bateaux rigide", emoji: "🛥️" },
          { name: "Bateaux pneumatique", emoji: "🛶" },
          { name: "Barques", emoji: "🚤" },
          { name: "Voiliers", emoji: "⛵" },
          { name: "Catamarans", emoji: "🛥️" },
          { name: "Yachts", emoji: "🛳️" },
          { name: "Moteurs bateaux", emoji: "⚙️" },
          { name: "Accessoires bateaux", emoji: "🎣" }
        ]
      },
      {
        name: "Pièces & Accessoires",
        slug: "pieces_vehicules",
        emoji: "🔧",
        level: 2,
        order: 12,
        articles: [
          { name: "Pièces voitures", emoji: "🚗" },
          { name: "Pièces motos", emoji: "🏍️" },
          { name: "Pneus & Jantes", emoji: "🛞" },
          { name: "Batteries", emoji: "🔋" },
          { name: "Système échappement", emoji: "💨" },
          { name: "Système freins", emoji: "🛑" },
          { name: "Système suspension", emoji: "🌀" },
          { name: "Moteurs & Boîtes vitesse", emoji: "⚙️" },
          { name: "Carrosserie", emoji: "🚘" },
          { name: "Intérieur véhicule", emoji: "💺" },
          { name: "Électronique véhicule", emoji: "📱" },
          { name: "Accessoires intérieur", emoji: "🎵" },
          { name: "Accessoires extérieur", emoji: "🔧" }
        ]
      }
    ]
  },
  
  // ============ CATEGORÍA 3: Électroménager ============
  {
    main: {
      name: "Électroménager",
      slug: "electromenager",
      emoji: "🔌",
      level: 1,
      order: 3
    },
    children: [
      // SUBCATEGORÍAS SIN ARTICLES (nivel final)
      {
        name: "Démodulateurs & Box TV",
        slug: "demodulateurs_box_tv",
        emoji: "📦",
        level: 2,
        order: 2,
        isLeaf: true
      },
      {
        name: "Paraboles & Switch TV",
        slug: "paraboles_switch_tv",
        emoji: "📡",
        level: 2,
        order: 3,
        isLeaf: true
      },
      {
        name: "Abonnements IPTV",
        slug: "abonnements_iptv",
        emoji: "🛰️",
        level: 2,
        order: 4,
        isLeaf: true
      },
      {
        name: "Caméras & Accessoires",
        slug: "cameras_accessoires",
        emoji: "📷",
        level: 2,
        order: 5,
        isLeaf: true
      },
      {
        name: "Audio",
        slug: "audio",
        emoji: "🎧",
        level: 2,
        order: 6,
        isLeaf: true
      },
      {
        name: "Repassage",
        slug: "repassage",
        emoji: "🧺",
        level: 2,
        order: 13,
        isLeaf: true
      },
      {
        name: "Machines à coudre",
        slug: "machines_a_coudre",
        emoji: "🧵",
        level: 2,
        order: 16,
        isLeaf: true
      },
      {
        name: "Télécommandes",
        slug: "telecommandes",
        emoji: "🎮",
        level: 2,
        order: 17,
        isLeaf: true
      },
      {
        name: "Sécurité & GPS",
        slug: "securite_gps",
        emoji: "📍",
        level: 2,
        order: 18,
        isLeaf: true
      },
      {
        name: "Composants électroniques",
        slug: "composants_electroniques",
        emoji: "💾",
        level: 2,
        order: 19,
        isLeaf: true
      },
      {
        name: "Pièces de rechange",
        slug: "pieces_rechange",
        emoji: "🔧",
        level: 2,
        order: 20,
        isLeaf: true
      },
      {
        name: "Autre",
        slug: "autre",
        emoji: "⚙️",
        level: 2,
        order: 21,
        isLeaf: true
      },
      
      // SUBCATEGORÍAS CON ARTICLES (nivel 3)
      {
        name: "Téléviseurs",
        slug: "televiseurs",
        emoji: "📺",
        level: 2,
        order: 1,
        articles: [
          { name: "Téléviseur LED", emoji: "💡" },
          { name: "Smart TV", emoji: "🧠" },
          { name: "Téléviseur OLED", emoji: "🌈" },
          { name: "Téléviseur 4K", emoji: "📺" }
        ]
      },
      {
        name: "Réfrigérateurs & Congélateurs",
        slug: "refrigerateurs_congelateurs",
        emoji: "🧊",
        level: 2,
        order: 7,
        articles: [
          { name: "Réfrigérateur classique", emoji: "🧊" },
          { name: "Réfrigérateur américain", emoji: "🇺🇸" },
          { name: "Réfrigérateur combiné", emoji: "🥶" },
          { name: "Congélateur coffre", emoji: "📦" },
          { name: "Congélateur vertical", emoji: "⬆️" }
        ]
      },
      {
        name: "Machines à laver",
        slug: "machines_a_laver",
        emoji: "👕",
        level: 2,
        order: 8,
        articles: [
          { name: "Lave-linge frontal", emoji: "👚" },
          { name: "Lave-linge top", emoji: "👕" },
          { name: "Lave-linge séchant", emoji: "👖" }
        ]
      },
      {
        name: "Lave-vaisselles",
        slug: "lave_vaisselles",
        emoji: "🍽️",
        level: 2,
        order: 9,
        articles: [
          { name: "Lave-vaisselle compact", emoji: "🍽️" },
          { name: "Lave-vaisselle intégrable", emoji: "🧩" },
          { name: "Grande capacité", emoji: "📏" }
        ]
      },
      {
        name: "Fours & Cuisson",
        slug: "fours_cuisson",
        emoji: "🍳",
        level: 2,
        order: 10,
        articles: [
          { name: "Four électrique", emoji: "🔥" },
          { name: "Four à gaz", emoji: "🍕" },
          { name: "Plaque de cuisson", emoji: "🥘" },
          { name: "Cuisinière", emoji: "🍳" }
        ]
      },
      {
        name: "Chauffage & Climatisation",
        slug: "chauffage_climatisation",
        emoji: "❄️",
        level: 2,
        order: 11,
        articles: [
          { name: "Climatiseur split", emoji: "❄️" },
          { name: "Climatiseur mobile", emoji: "🌀" },
          { name: "Chauffage à gaz", emoji: "🔥" },
          { name: "Chauffage électrique", emoji: "⚡" }
        ]
      },
      {
        name: "Appareils de cuisine",
        slug: "appareils_de_cuisine",
        emoji: "☕",
        level: 2,
        order: 12,
        articles: [
          { name: "Machine à café", emoji: "☕" },
          { name: "Mixeur / Blender", emoji: "🥤" },
          { name: "Grille-pain", emoji: "🍞" },
          { name: "Micro-ondes", emoji: "🌊" },
          { name: "Robot de cuisine", emoji: "🥄" }
        ]
      },
      {
        name: "Aspirateurs & Nettoyeurs",
        slug: "aspirateurs_nettoyeurs",
        emoji: "🧹",
        level: 2,
        order: 14,
        articles: [
          { name: "Aspirateur traîneau", emoji: "🧹" },
          { name: "Aspirateur balai", emoji: "🧹" },
          { name: "Aspirateur robot", emoji: "🤖" },
          { name: "Nettoyeur vapeur", emoji: "💨" }
        ]
      },
      {
        name: "Beauté & Hygiène",
        slug: "beaute_hygiene",
        emoji: "💇‍♀️",
        level: 2,
        order: 15,
        articles: [
          { name: "Sèche-cheveux", emoji: "💇‍♀️" },
          { name: "Tondeuse", emoji: "✂️" },
          { name: "Fer à lisser", emoji: "🔥" },
          { name: "Épilateur", emoji: "🧴" }
        ]
      }
    ]
  }
];

async function seedAllCategories() {
  try {
    // 1. Conectar
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace');
    console.log('✅ MongoDB conectado');
    
    // 2. Limpiar (solo en desarrollo)
    if (process.env.NODE_ENV === 'development') {
      await Category.deleteMany({});
      console.log('🧹 Colección limpiada');
    }
    
    // 3. Contadores
    let totalInserted = 0;
    const categoryMap = new Map();
    
    // 4. Insertar cada categoría principal y sus hijos
    for (const categoryGroup of COMPLETE_CATEGORIES) {
      console.log(`\n📦 Procesando: ${categoryGroup.main.name} ${categoryGroup.main.emoji}`);
      
      // Insertar categoría principal (nivel 1)
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
      console.log(`   ✅ ${categoryGroup.main.name} (nivel 1)`);
      
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
          isLeaf: child.isLeaf || false,
          config: child.config || {}
        });
        
        const savedChild = await childCat.save();
        categoryMap.set(childSlug, savedChild._id);
        totalInserted++;
        console.log(`   ├── ${child.name} (nivel 2)`);
        
        // Insertar artículos (nivel 3) si existen
        if (child.articles && !child.isLeaf) {
          for (const article of child.articles) {
            const articleSlug = `${childSlug}-${article.name.toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^\w\-]/g, '')}`;
            
            const articlePath = `${childPath}/${article.name.toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^\w\-]/g, '')}`;
            
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
              isLeaf: true,
              config: article.config || {}
            });
            
            await articleCat.save();
            categoryMap.set(articleSlug, articleCat._id);
            totalInserted++;
            console.log(`   │   ├── ${article.name} (nivel 3)`);
          }
        }
      }
    }
    
    // 5. Actualizar hasChildren en padres
    console.log('\n🔄 Actualizando relaciones...');
    const allCategories = await Category.find({});
    
    for (const cat of allCategories) {
      const childCount = await Category.countDocuments({ parent: cat._id });
      if (cat.hasChildren !== (childCount > 0)) {
        cat.hasChildren = childCount > 0;
        await cat.save();
      }
    }
    
    // 6. Mostrar resumen
    console.log('\n🎉 ¡SEED COMPLETADO!');
    console.log('='.repeat(40));
    console.log(`📊 TOTAL INSERTADOS: ${totalInserted}`);
    console.log(`🏠 Nivel 1 (Principal): ${await Category.countDocuments({ level: 1 })}`);
    console.log(`📂 Nivel 2 (Subcategoría): ${await Category.countDocuments({ level: 2 })}`);
    console.log(`📝 Nivel 3 (Artículo): ${await Category.countDocuments({ level: 3 })}`);
    console.log(`🍃 Hojas (Nivel final): ${await Category.countDocuments({ isLeaf: true })}`);
    
    // 7. Mostrar ejemplos de rutas
    console.log('\n🔗 Ejemplos de rutas creadas:');
    const examples = await Category.find({ level: 3 }).limit(5);
    examples.forEach(cat => {
      console.log(`• ${cat.path}`);
    });
    
    // 8. Verificar estructura
    console.log('\n🔍 Verificación de estructura:');
    const mainCategories = await Category.find({ level: 1 }).sort({ order: 1 });
    console.log('\n📋 Categorías principales:');
    mainCategories.forEach(cat => {
      console.log(`• ${cat.emoji} ${cat.name} (${cat.slug})`);
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