// node scripts/update-categories.js
// Actualización específica para la categoría Boutiques

require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/categoryModel');

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, '❌ Error de conexión:'));
db.once('open', async () => {
  console.log('✅ Conectado a MongoDB');
  await runUpdates();
});

// Helper: Actualizar el path y ancestors de una categoría
async function updateCategoryPath(category) {
  if (!category.parent) {
    category.ancestors = [];
    category.path = category.slug;
  } else {
    const parent = await Category.findById(category.parent);
    if (parent) {
      category.ancestors = [...parent.ancestors, parent._id];
      category.path = `${parent.path}/${category.slug}`;
    }
  }
  return category;
}

// Helper: Reconstruir paths de todos los descendientes
async function rebuildDescendantsPaths(category) {
  const descendants = await Category.find({ ancestors: category._id });
  for (const descendant of descendants) {
    await updateCategoryPath(descendant);
    await descendant.save();
  }
  if (descendants.length > 0) {
    console.log(`   • Reconstruidos paths de ${descendants.length} descendientes`);
  }
}

// Helper: Actualizar hasChildren basado en hijos existentes
async function updateHasChildrenFlag(categoryId) {
  const childrenCount = await Category.countDocuments({ parent: categoryId });
  await Category.findByIdAndUpdate(categoryId, { hasChildren: childrenCount > 0 });
}

// Helper: Encontrar categoría por slug
async function findCategoryBySlug(slug) {
  return await Category.findOne({ slug });
}

// Helper: Encontrar categoría por nombre y padre
async function findCategoryByNameAndParent(name, parentId = null) {
  return await Category.findOne({
    name: { $regex: new RegExp(`^${name}$`, 'i') },
    parent: parentId
  });
}

// ==================== OPERACIONES ====================

async function addCategory(categoryData) {
  try {
    let parentId = null;
    let parent = null;
    if (categoryData.parentSlug) {
      parent = await findCategoryBySlug(categoryData.parentSlug);
      if (!parent) {
        console.log(`❌ No se encontró el padre: ${categoryData.parentSlug}`);
        return false;
      }
      parentId = parent._id;
    }

    const existing = await findCategoryByNameAndParent(categoryData.name, parentId);
    if (existing) {
      console.log(`⚠️ La categoría "${categoryData.name}" ya existe, omitiendo...`);
      return false;
    }

    const category = new Category({
      name: categoryData.name,
      slug: categoryData.slug,
      level: parent ? parent.level + 1 : 1,
      parent: parentId,
      icon: categoryData.icon,
      iconType: categoryData.iconType || 'image-png',
      order: categoryData.order || 0,
      hasChildren: false,
      isLeaf: !categoryData.children || categoryData.children.length === 0,
      isActive: true,
      postCount: 0
    });

    await updateCategoryPath(category);
    await category.save();
    console.log(`✅ Categoría agregada: ${categoryData.name}`);
    console.log(`   • Slug: ${category.slug}`);
    console.log(`   • Path: ${category.path}`);

    if (parentId) {
      await updateHasChildrenFlag(parentId);
      console.log(`   • Padre "${parent.name}" actualizado`);
    }

    if (categoryData.children && categoryData.children.length > 0) {
      for (const childData of categoryData.children) {
        await addCategory({ ...childData, parentSlug: category.slug });
      }
    }
    return true;
  } catch (error) {
    console.error(`❌ Error al agregar "${categoryData.name}":`, error.message);
    return false;
  }
}

async function updateCategory(findSlug, updates) {
  try {
    const category = await findCategoryBySlug(findSlug);
    if (!category) {
      console.log(`❌ No se encontró la categoría: ${findSlug}`);
      return false;
    }
    const oldValues = { name: category.name, slug: category.slug, icon: category.icon, order: category.order, isActive: category.isActive };
    Object.keys(updates).forEach(key => { if (key !== 'children') category[key] = updates[key]; });
    if (updates.slug && updates.slug !== oldValues.slug) {
      await updateCategoryPath(category);
      await rebuildDescendantsPaths(category);
    }
    await category.save();
    console.log(`✅ Categoría actualizada: ${findSlug} → ${category.name}`);
    return true;
  } catch (error) {
    console.error(`❌ Error al actualizar ${findSlug}:`, error.message);
    return false;
  }
}

async function disableCategory(slug) {
  try {
    const category = await findCategoryBySlug(slug);
    if (!category) return false;
    category.isActive = false;
    await category.save();
    console.log(`⛔ Categoría deshabilitada: ${slug}`);
    return true;
  } catch (error) {
    console.error(`❌ Error al deshabilitar ${slug}:`, error.message);
    return false;
  }
}

async function activateCategory(slug) {
  try {
    const category = await findCategoryBySlug(slug);
    if (!category) return false;
    category.isActive = true;
    await category.save();
    console.log(`✅ Categoría activada: ${slug}`);
    return true;
  } catch (error) {
    console.error(`❌ Error al activar ${slug}:`, error.message);
    return false;
  }
}

async function deleteCategory(slug) {
  try {
    const category = await findCategoryBySlug(slug);
    if (!category) return false;
    const descendants = await Category.find({ ancestors: category._id });
    const allIds = [category._id, ...descendants.map(d => d._id)];
    const result = await Category.deleteMany({ _id: { $in: allIds } });
    console.log(`🗑️ Eliminada: ${slug} (${result.deletedCount} registros)`);
    if (category.parent) await updateHasChildrenFlag(category.parent);
    return true;
  } catch (error) {
    console.error(`❌ Error al eliminar ${slug}:`, error.message);
    return false;
  }
}

async function reorderCategories(parentSlug = null, orderedSlugs) {
  try {
    let parentId = null;
    let parent = null;
    if (parentSlug) {
      parent = await findCategoryBySlug(parentSlug);
      if (!parent) return false;
      parentId = parent._id;
    }
    const query = parentId ? { parent: parentId } : { parent: null, level: 1 };
    const categories = await Category.find(query);
    for (let i = 0; i < orderedSlugs.length; i++) {
      const category = categories.find(c => c.slug === orderedSlugs[i]);
      if (category) {
        category.order = i;
        await category.save();
      }
    }
    console.log(`✅ Reordenado ${parentSlug || 'categorías principales'} (${orderedSlugs.length} elementos)`);
    return true;
  } catch (error) {
    console.error(`❌ Error al reordenar:`, error.message);
    return false;
  }
}

async function moveCategory(slug, newParentSlug = null) {
  try {
    const category = await findCategoryBySlug(slug);
    if (!category) return false;
    const oldParent = category.parent;
    let newParent = null;
    let newParentId = null;
    if (newParentSlug) {
      newParent = await findCategoryBySlug(newParentSlug);
      if (!newParent) return false;
      newParentId = newParent._id;
      if (newParentId.equals(category._id)) return false;
      const isDescendant = await Category.findOne({ _id: newParentId, ancestors: category._id });
      if (isDescendant) return false;
    }
    category.level = newParent ? newParent.level + 1 : 1;
    category.parent = newParentId;
    await updateCategoryPath(category);
    await category.save();
    await rebuildDescendantsPaths(category);
    if (oldParent) await updateHasChildrenFlag(oldParent);
    if (newParentId) await updateHasChildrenFlag(newParentId);
    console.log(`🔄 Categoría movida: ${slug}`);
    return true;
  } catch (error) {
    console.error(`❌ Error al mover ${slug}:`, error.message);
    return false;
  }
}

// ==================== CONFIGURACIÓN PARA BOUTIQUES ====================

const updates = {
  addCategories: [
    // Agregar subcategoría "Art" dentro de Boutiques (si no existe)
    {
      name: 'Art',
      slug: 'art',
      parentSlug: 'boutiques',  // categoría padre
      icon: '/categories/boutiques/art.png',
      iconType: 'image-png',
      order: 51,   // Al final, después de las 50 existentes
      children: []
    }
  ],
  updateCategories: [
    // Si necesitas actualizar alguna subcategoría existente, ponla aquí
  ],
  reorderCategoriesList: [
    // Reordenar las subcategorías de Boutiques para mantener el orden y que "Art" quede al final
    {
      parentSlug: 'boutiques',
      orderedSlugs: [
        'agences-immobilieres', 'promotions-immobilieres', 'showroom-automobiles', 'showroom-moto', 'camions-engins',
        'pieces-accessoires-vehicules', 'location-voitures', 'reparation-services-vehicules', 'telephones-accessoires',
        'magasin-informatique', 'magasin-electromenager', 'equipements-securite', 'audiovisuel', 'electronique',
        'vetements-accessoires-mode', 'cosmetiques-et-beaute', 'maison-meubles', 'meubles-et-bureau', 'vaisselles',
        'puericultures-jouets', 'jardinages', 'fournitures-articles-scolaires', 'articles-sport', 'consoles-jeux-video',
        'librairie-papeterie', 'instruments-et-musique', 'chasse-et-peche', 'outillages-quincaillerie', 'materiaux-et-construction',
        'materiel-et-professionnel', 'matieres-et-premieres', 'agences-voyages', 'animaleries', 'alimentaire',
        'transport-et-demenagement', 'travaux-construction-amenagement', 'ecoles-et-formations', 'publicite-et-communication',
        'service-nettoyage-entretien', 'froid-et-climatisation', 'traiteur-gateaux', 'hotels', 'restaurants-salles-fetes',
        'services-sante', 'etudes-consulting', 'logiciel-web-services', 'esthetique-bien-etre', 'comptabilite-finance',
        'couture-et-confection', 'reparation-electronique-electromenager',
        'art'   // ← Aseguramos que Art vaya al final
      ]
    }
  ],
  disableCategories: [],
  activateCategories: [
    { slug: 'boutiques' }  // Activar la categoría principal por si acaso
  ],
  deleteCategories: [],
  moveCategories: []
};

// ==================== EJECUCIÓN ====================

async function runUpdates() {
  try {
    console.log('🔄 Iniciando actualizaciones para Boutiques...\n');

    // Estadísticas iniciales
    const total = await Category.countDocuments();
    const level1 = await Category.countDocuments({ level: 1 });
    const level2 = await Category.countDocuments({ level: 2 });
    console.log(`📊 Inicial: Total=${total}, N1=${level1}, N2=${level2}\n`);

    // 1. Activar categoría Boutiques
    if (updates.activateCategories.length) {
      console.log('✅ Activando categorías...');
      for (const cat of updates.activateCategories) await activateCategory(cat.slug);
      console.log();
    }

    // 2. Agregar subcategoría Art
    if (updates.addCategories.length) {
      console.log('➕ Agregando subcategorías...');
      for (const cat of updates.addCategories) await addCategory(cat);
      console.log();
    }

    // 3. Reordenar subcategorías de Boutiques
    if (updates.reorderCategoriesList.length) {
      console.log('🔄 Reordenando subcategorías de Boutiques...');
      for (const reorder of updates.reorderCategoriesList) await reorderCategories(reorder.parentSlug, reorder.orderedSlugs);
      console.log();
    }

    // Mostrar estadísticas finales
    const finalTotal = await Category.countDocuments();
    const finalActive = await Category.countDocuments({ isActive: true });
    const finalLevel1 = await Category.countDocuments({ level: 1 });
    const finalLevel2 = await Category.countDocuments({ level: 2 });
    console.log('✨ Actualización completada');
    console.log(`📊 Final: Total=${finalTotal}, N1=${finalLevel1}, N2=${finalLevel2}, Activas=${finalActive}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}