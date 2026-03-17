// node updateCategories.js
require('dotenv').config();
var mongoose = require('mongoose');
var Category = require('./models/categoryModel');
var path = require('path');

// Cargar el objeto de categorías desde client/categoriesData2.js
var categoriesDataPath = path.join(__dirname, 'client', 'categoriesData2.js');
var rawData = require(categoriesDataPath);

console.log('📦 Datos cargados. Claves:', Object.keys(rawData));

// Transformar el objeto al array que necesita el script
var categoriesData = [];
var order = 0;

for (var categoryKey in rawData) {
  var category = rawData[categoryKey];
  
  // Crear categoría nivel 1
  var level1 = {
    name: categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1),
    slug: categoryKey,
    level: 1,
    order: order++,
    children: []
  };

  // Procesar level2 si existe
  if (category.level2 && Array.isArray(category.level2)) {
    for (var i = 0; i < category.level2.length; i++) {
      var level2File = category.level2[i];
      var level2Slug = level2File.replace('.png', '');
      var level2Item = {
        name: level2Slug.replace(/-/g, ' ').replace(/\b\w/g, function(l) { return l.toUpperCase(); }),
        slug: level2Slug,
        level: 2,
        order: 0,
        children: []
      };

      // Procesar level3 si existe para esta subcategoría
      if (category.level3 && category.level3[level2Slug]) {
        var level3Files = category.level3[level2Slug];
        for (var j = 0; j < level3Files.length; j++) {
          var level3File = level3Files[j];
          var level3Slug = level3File.replace('.png', '');
          level2Item.children.push({
            name: level3Slug.replace(/-/g, ' ').replace(/\b\w/g, function(l) { return l.toUpperCase(); }),
            slug: level3Slug,
            level: 3,
            order: 0,
            children: []
          });
        }
      }

      level1.children.push(level2Item);
    }
  }

  categoriesData.push(level1);
}

console.log('✅ Transformación completada. Total categorías nivel 1:', categoriesData.length);

if (categoriesData.length === 0) {
  console.error('❌ No se generaron categorías. Revisa la estructura de categoriesData2.js');
  process.exit(1);
}

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, '❌ Error de conexión a MongoDB:'));
db.once('open', function() {
  console.log('✅ Conectado a MongoDB');
  updateCategories();
});

var CLOUD_NAME = 'dfjipgj2o';
var BASE_URL = 'https://res.cloudinary.com/' + CLOUD_NAME + '/image/upload/categories';

function generateIconUrl(categorySlug, parentSlug, grandParentSlug) {
  var path = '';
  if (grandParentSlug) {
    path = grandParentSlug + '/' + parentSlug + '/' + categorySlug + '.png';
  } else if (parentSlug) {
    path = parentSlug + '/' + categorySlug + '.png';
  } else {
    path = categorySlug + '/' + categorySlug + '.png';
  }
  return BASE_URL + '/' + path;
}

async function updateCategories() {
  console.log('🔄 Iniciando actualización de categorías (sin perder IDs)...\n');
  var created = 0;
  var updated = 0;

  async function processCategory(catData, parent, grandParent) {
    var name = catData.name;
    var slug = catData.slug;
    var level = catData.level;
    var order = catData.order;
    var children = catData.children || [];

    // Buscar por slug y nivel
    var existing = await Category.findOne({ slug: slug, level: level }).lean();

    var updateData = {
      name: name,
      slug: slug,
      level: level,
      order: order,
      parent: parent ? parent._id : null,
      icon: generateIconUrl(slug, parent ? parent.slug : null, grandParent ? grandParent.slug : null),
      isLeaf: !children || children.length === 0
    };

    if (existing) {
      await Category.updateOne({ _id: existing._id }, { $set: updateData });
      updated++;
      console.log('🔄 Actualizada: ' + name + ' (/' + slug + ') - ID: ' + existing._id);
    } else {
      var newCat = new Category(updateData);
      await newCat.save();
      created++;
      console.log('✅ Creada: ' + name + ' (/' + slug + ') - Nuevo ID: ' + newCat._id);
    }

    var current = await Category.findOne({ slug: slug, level: level });

    if (children && children.length > 0) {
      for (var i = 0; i < children.length; i++) {
        var childData = children[i];
        if (level === 1) {
          await processCategory(childData, current, null);
        } else if (level === 2) {
          await processCategory(childData, current, parent);
        }
      }
    }
  }

  for (var j = 0; j < categoriesData.length; j++) {
    console.log('Procesando nivel 1:', categoriesData[j].slug);
    await processCategory(categoriesData[j], null, null);
  }

  console.log('\n📊 RESUMEN:');
  console.log('   • Creadas: ' + created);
  console.log('   • Actualizadas: ' + updated);
  console.log('   • Totales: ' + (created + updated) + ' categorías procesadas');
  console.log('✅ Actualización completada sin eliminar IDs existentes.');
  process.exit(0);
}