// seedCategoriesWithImages.js - IMÁGENES PNG PARA 3 NIVELES
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/categoryModel');

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

// Crear slug único
const createUniqueSlug = (text, existingSlugs = new Set()) => {
  let baseSlug = text.toLowerCase().normalize('NFD')
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
    name: 'Électroménager',
    slug: 'electromenager',
    level: 1,
    icon: '/uploads/categories/level1/electromenager.png', // Imagen real para categoría
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
    icon: '/uploads/categories/level1/smartphone.png', // Imagen real
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
    icon: '/uploads/categories/level1/house.png', // Imagen real
    iconType: 'image-png',
    iconColor: '#FFD166',
    bgColor: '#FFF9E6',
    order: 3,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Informatique',
    slug: 'informatique',
    level: 1,
    icon: '/uploads/categories/level1/computer.png', // Imagen real
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
    icon: '/uploads/categories/level1/car.png', // Imagen real
    iconType: 'image-png',
    iconColor: '#118AB2',
    bgColor: '#E6F4FF',
    order: 5,
    isLeaf: false,
    hasChildren: true,
  },
  {
    name: 'Mode & Accessoires',
    slug: 'mode-accessoires',
    level: 1,
    icon: '/uploads/categories/level1/fashion.png', // Imagen real
    iconType: 'image-png',
    iconColor: '#EF476F',
    bgColor: '#FFE6EC',
    order: 6,
    isLeaf: false,
    hasChildren: true,
  }
];

// ============================================
// NIVEL 2 - SUBCATEGORÍAS (Con imágenes propias)
// ============================================
const electromenagerSubcategories = [
  { 
    name: 'Téléviseurs', 
    icon: '/uploads/categories/level2/tv.png', // Imagen específica para subcategoría
    iconType: 'image-png',
    iconColor: '#FF6B6B',
    order: 1 
  },
  { 
    name: 'Démodulateurs & Box TV', 
    icon: '/uploads/categories/level2/tv-box.png', 
    iconType: 'image-png',
    iconColor: '#FF6B6B',
    order: 2 
  },
  { 
    name: 'Paraboles & Switch TV', 
    icon: '/uploads/categories/level2/satellite.png', 
    iconType: 'image-png',
    iconColor: '#FF6B6B',
    order: 3 
  },
  { 
    name: 'Audio', 
    icon: '/uploads/categories/level2/audio.png', 
    iconType: 'image-png',
    iconColor: '#FF6B6B',
    order: 4 
  },
  { 
    name: 'Aspirateurs & Nettoyeurs', 
    icon: '/uploads/categories/level2/vacuum.png', 
    iconType: 'image-png',
    iconColor: '#FF6B6B',
    order: 5 
  },
  { 
    name: 'Réfrigérateurs & Congélateurs', 
    icon: '/uploads/categories/level2/fridge.png', 
    iconType: 'image-png',
    iconColor: '#FF6B6B',
    order: 6 
  },
  { 
    name: 'Machines à laver', 
    icon: '/uploads/categories/level2/washing-machine.png', 
    iconType: 'image-png',
    iconColor: '#FF6B6B',
    order: 7 
  }
];

const telephonesSubcategories = [
  { 
    name: 'Smartphones', 
    icon: '/uploads/categories/level2/smartphone.png', 
    iconType: 'image-png',
    iconColor: '#4ECDC4',
    order: 1 
  },
  { 
    name: 'Tablettes', 
    icon: '/uploads/categories/level2/tablet.png', 
    iconType: 'image-png',
    iconColor: '#4ECDC4',
    order: 2 
  },
  { 
    name: 'Accessoires Téléphones', 
    icon: '/uploads/categories/level2/phone-accessories.png', 
    iconType: 'image-png',
    iconColor: '#4ECDC4',
    order: 3 
  },
  { 
    name: 'Chargeurs & Câbles', 
    icon: '/uploads/categories/level2/charger.png', 
    iconType: 'image-png',
    iconColor: '#4ECDC4',
    order: 4 
  }
];

const immobilierSubcategories = [
  { 
    name: 'Vente', 
    icon: '/uploads/categories/level2/sell.png', 
    iconType: 'image-png',
    iconColor: '#FFD166',
    order: 1 
  },
  { 
    name: 'Location', 
    icon: '/uploads/categories/level2/rent.png', 
    iconType: 'image-png',
    iconColor: '#FFD166',
    order: 2 
  },
  { 
    name: 'Location vacances', 
    icon: '/uploads/categories/level2/vacation-rental.png', 
    iconType: 'image-png',
    iconColor: '#FFD166',
    order: 3 
  }
];

const informatiqueSubcategories = [
  { 
    name: 'Ordinateurs portables', 
    icon: '/uploads/categories/level2/laptop.png', 
    iconType: 'image-png',
    iconColor: '#06D6A0',
    order: 1 
  },
  { 
    name: 'Ordinateurs de bureau', 
    icon: '/uploads/categories/level2/desktop.png', 
    iconType: 'image-png',
    iconColor: '#06D6A0',
    order: 2 
  },
  { 
    name: 'Imprimantes & Cartouches', 
    icon: '/uploads/categories/level2/printer.png', 
    iconType: 'image-png',
    iconColor: '#06D6A0',
    order: 3 
  }
];

const vehiculesSubcategories = [
  { 
    name: 'Voitures', 
    icon: '/uploads/categories/level2/car.png', 
    iconType: 'image-png',
    iconColor: '#118AB2',
    order: 1 
  },
  { 
    name: 'Motos & Scooters', 
    icon: '/uploads/categories/level2/motorcycle.png', 
    iconType: 'image-png',
    iconColor: '#118AB2',
    order: 2 
  },
  { 
    name: 'Bateaux & Barques', 
    icon: '/uploads/categories/level2/boat.png', 
    iconType: 'image-png',
    iconColor: '#118AB2',
    order: 3 
  }
];

const modeSubcategories = [
  { 
    name: 'Vêtements Homme', 
    icon: '/uploads/categories/level2/mens-clothing.png', 
    iconType: 'image-png',
    iconColor: '#EF476F',
    order: 1 
  },
  { 
    name: 'Vêtements Femme', 
    icon: '/uploads/categories/level2/womens-clothing.png', 
    iconType: 'image-png',
    iconColor: '#EF476F',
    order: 2 
  },
  { 
    name: 'Chaussures Mode', 
    icon: '/uploads/categories/level2/shoes.png', 
    iconType: 'image-png',
    iconColor: '#EF476F',
    order: 3 
  },
  { 
    name: 'Sacs & Accessoires', 
    icon: '/uploads/categories/level2/bag.png', 
    iconType: 'image-png',
    iconColor: '#EF476F',
    order: 4 
  }
];

// ============================================
// NIVEL 3 - ARTÍCULOS (Con imágenes propias)
// ============================================
const electromenagerLevel3 = {
  'Téléviseurs': [
    { 
      name: 'TV LED', 
      icon: '/uploads/categories/level3/tv-led.png', 
      iconType: 'image-png',
      order: 1 
    },
    { 
      name: 'TV OLED', 
      icon: '/uploads/categories/level3/tv-oled.png', 
      iconType: 'image-png',
      order: 2 
    },
    { 
      name: 'TV 4K', 
      icon: '/uploads/categories/level3/tv-4k.png', 
      iconType: 'image-png',
      order: 3 
    }
  ],
  'Réfrigérateurs & Congélateurs': [
    { 
      name: 'Réfrigérateur', 
      icon: '/uploads/categories/level3/refrigerator.png', 
      iconType: 'image-png',
      order: 1 
    },
    { 
      name: 'Congélateur', 
      icon: '/uploads/categories/level3/freezer.png', 
      iconType: 'image-png',
      order: 2 
    },
    { 
      name: 'Réfrigérateur-Congélateur', 
      icon: '/uploads/categories/level3/fridge-freezer.png', 
      iconType: 'image-png',
      order: 3 
    }
  ],
  'Machines à laver': [
    { 
      name: 'Lave-linge', 
      icon: '/uploads/categories/level3/washing-machine.png', 
      iconType: 'image-png',
      order: 1 
    },
    { 
      name: 'Sèche-linge', 
      icon: '/uploads/categories/level3/dryer.png', 
      iconType: 'image-png',
      order: 2 
    }
  ]
};

const telephonesLevel3 = {
  'Smartphones': [
    { 
      name: 'iPhone', 
      icon: '/uploads/categories/level3/iphone.png', 
      iconType: 'image-png',
      order: 1 
    },
    { 
      name: 'Samsung Galaxy', 
      icon: '/uploads/categories/level3/samsung.png', 
      iconType: 'image-png',
      order: 2 
    },
    { 
      name: 'Xiaomi', 
      icon: '/uploads/categories/level3/xiaomi.png', 
      iconType: 'image-png',
      order: 3 
    }
  ],
  'Accessoires Téléphones': [
    { 
      name: 'Écouteurs Bluetooth', 
      icon: '/uploads/categories/level3/bluetooth-earbuds.png', 
      iconType: 'image-png',
      order: 1 
    },
    { 
      name: 'Power Bank', 
      icon: '/uploads/categories/level3/power-bank.png', 
      iconType: 'image-png',
      order: 2 
    },
    { 
      name: 'Coques', 
      icon: '/uploads/categories/level3/phone-case.png', 
      iconType: 'image-png',
      order: 3 
    }
  ]
};

const immobilierLevel3 = {
  'Vente': [
    { 
      name: 'Appartement', 
      icon: '/uploads/categories/level3/apartment.png', 
      iconType: 'image-png',
      order: 1 
    },
    { 
      name: 'Villa', 
      icon: '/uploads/categories/level3/villa.png', 
      iconType: 'image-png',
      order: 2 
    },
    { 
      name: 'Terrain', 
      icon: '/uploads/categories/level3/land.png', 
      iconType: 'image-png',
      order: 3 
    }
  ],
  'Location': [
    { 
      name: 'Studio', 
      icon: '/uploads/categories/level3/studio.png', 
      iconType: 'image-png',
      order: 1 
    },
    { 
      name: 'Appartement', 
      icon: '/uploads/categories/level3/apartment-rent.png', 
      iconType: 'image-png',
      order: 2 
    }
  ]
};

// ============================================
// FUNCIÓN PRINCIPAL
// ============================================
const seedCategories = async () => {
  try {
    console.log('🚀 Iniciando inserción de categorías con imágenes PNG...\n');
    
    // Limpiar colección
    console.log('🧹 Paso 1: Limpiando colección existente...');
    const result = await Category.deleteMany({});
    console.log(`   ✅ Eliminadas ${result.deletedCount} categorías anteriores\n`);
    
    // Insertar categorías principales
    console.log('📦 Paso 2: Insertando categorías principales (Nivel 1)...');
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
      console.log(`   📸 ${categoryData.icon} → ${categoryData.name}`);
    }

    // Función para insertar subcategorías
    const insertSubcategories = async (parentId, subcategories, level3Data, parentName, level = 2) => {
      const parentCategory = await Category.findById(parentId);
      const childIds = [];
      
      for (const subcat of subcategories) {
        const slug = createUniqueSlug(subcat.name, allSlugs);
        const hasChildren = !!level3Data[subcat.name];
        
        const subcategory = new Category({
          name: subcat.name,
          slug: slug,
          level: level,
          parent: parentId,
          ancestors: [parentId],
          path: `${parentCategory.path}/${slug}`,
          icon: subcat.icon,
          iconType: subcat.iconType || 'image-png',
          iconColor: subcat.iconColor || '#666666',
          bgColor: subcat.bgColor || parentCategory.bgColor,
          order: subcat.order || 0,
          isLeaf: !hasChildren,
          hasChildren: hasChildren
        });
        
        const savedSubcategory = await subcategory.save();
        childIds.push(savedSubcategory._id);
        
        // Insertar nivel 3 si existe
        if (level3Data[subcat.name]) {
          console.log(`      📁 Insertando artículos para: ${subcat.name}`);
          await insertSubcategories(
            savedSubcategory._id,
            level3Data[subcat.name],
            {},
            subcat.name,
            3
          );
        }
      }
      
      parentCategory.hasChildren = childIds.length > 0;
      await parentCategory.save();
      return childIds;
    };

    // Insertar TODAS las categorías
    console.log('\n📁 Paso 3: Insertando subcategorías y artículos...\n');
    
    console.log('   🔌 Insertando Électroménager...');
    await insertSubcategories(mainCategories['Électroménager'], electromenagerSubcategories, electromenagerLevel3, 'Électroménager');
    
    console.log('   📱 Insertando Téléphones & Accessoires...');
    await insertSubcategories(mainCategories['Téléphones & Accessoires'], telephonesSubcategories, telephonesLevel3, 'Téléphones & Accessoires');
    
    console.log('   🏠 Insertando Immobilier...');
    await insertSubcategories(mainCategories['Immobilier'], immobilierSubcategories, immobilierLevel3, 'Immobilier');
    
    console.log('   💻 Insertando Informatique...');
    await insertSubcategories(mainCategories['Informatique'], informatiqueSubcategories, {}, 'Informatique');
    
    console.log('   🚗 Insertando Véhicules...');
    await insertSubcategories(mainCategories['Véhicules'], vehiculesSubcategories, {}, 'Véhicules');
    
    console.log('   👕 Insertando Mode & Accessoires...');
    await insertSubcategories(mainCategories['Mode & Accessoires'], modeSubcategories, {}, 'Mode & Accessoires');

    // Mostrar resumen
    console.log('\n🎉 ¡PROCESO COMPLETADO EXITOSAMENTE!');
    console.log('=====================================\n');
    
    const totalCategories = await Category.countDocuments();
    const level1 = await Category.countDocuments({ level: 1 });
    const level2 = await Category.countDocuments({ level: 2 });
    const level3 = await Category.countDocuments({ level: 3 });
    
    console.log('📊 ESTADÍSTICAS FINALES:');
    console.log('   • Categorías principales (Nivel 1):', level1);
    console.log('   • Subcategorías (Nivel 2):', level2);
    console.log('   • Artículos (Nivel 3):', level3);
    console.log('   • Total de categorías:', totalCategories);
    
    console.log('\n📁 ESTRUCTURA DE IMÁGENES REQUERIDA:');
    console.log('   public/uploads/categories/');
    console.log('   ├── level1/      # 6 imágenes principales');
    console.log('   ├── level2/      # ~20 imágenes subcategorías');
    console.log('   └── level3/      # ~15 imágenes artículos');
    
    console.log('\n✅ Todas las categorías insertadas con rutas de imágenes PNG.');
    console.log('🔄 Para cambiar imágenes: simplemente reemplaza los archivos PNG.');
    console.log('🔥 Para probar: crea imágenes placeholder o usa las tuyas propias.');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ ERROR CRÍTICO:', error.message);
    console.error('Detalles:', error);
    process.exit(1);
  }
};

// Ejecutar el script
// Nota: No llamar seedCategories() aquí, ya se llama en db.once('open')