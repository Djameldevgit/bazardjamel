const Category = require('../models/categoryModel');
const Post = require('../models/postModel');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// 🧠 Caché simple
let cacheCategoriasPrincipales = null;
let cacheCategoriasPrincipalesEn = 0;
let cacheEstadisticas = null;
let cacheEstadisticasEn = 0;
const obtenerCategoriasPrincipales = asyncHandler(async (req, res) => {
  const incluirPosts = req.query.posts === 'true';
  const ahora = Date.now();

  // 🔹 Cache con posts (1 min)
  if (
    incluirPosts &&
    cacheCategoriasPrincipales &&
    ahora - cacheCategoriasPrincipalesEn < 60 * 1000
  ) {
    return res.json(cacheCategoriasPrincipales);
  }

  // 🔹 Cache sin posts (5 min)
  if (
    !incluirPosts &&
    cacheCategoriasPrincipales &&
    ahora - cacheCategoriasPrincipalesEn < 5 * 60 * 1000
  ) {
    return res.json(cacheCategoriasPrincipales);
  }

  // 1️⃣ Cargar categorías
  const [nivel1, nivel2, nivel3] = await Promise.all([
    Category.find({ level: 1, isActive: true })
      .select('_id name slug icon emoji order hasChildren postCount')
      .sort({ order: 1 })
      .lean(),

    Category.find({ level: 2, isActive: true })
      .select('_id name slug parent emoji order hasChildren isLeaf')
      .sort({ order: 1 })
      .lean(),

    Category.find({ level: 3, isActive: true })
      .select('_id name slug parent emoji order isLeaf')
      .sort({ order: 1 })
      .lean(),
  ]);

  // 2️⃣ Relacionar nivel 3 → nivel 2
  const nivel3PorPadre = {};
  for (let i = 0; i < nivel3.length; i++) {
    const cat = nivel3[i];
    const idPadre = String(cat.parent);

    if (!nivel3PorPadre[idPadre]) {
      nivel3PorPadre[idPadre] = [];
    }
    nivel3PorPadre[idPadre].push(cat);
  }

  for (let i = 0; i < nivel2.length; i++) {
    const subcat = nivel2[i];
    const clave = String(subcat._id);

    subcat.children = nivel3PorPadre[clave] || [];
    subcat.hasChildren = subcat.children.length > 0;
  }

  // 3️⃣ Relacionar nivel 2 → nivel 1
  const nivel2PorPadre = {};
  for (let i = 0; i < nivel2.length; i++) {
    const subcat = nivel2[i];
    const idPadre = String(subcat.parent);

    if (!nivel2PorPadre[idPadre]) {
      nivel2PorPadre[idPadre] = [];
    }
    nivel2PorPadre[idPadre].push(subcat);
  }

  for (let i = 0; i < nivel1.length; i++) {
    const cat = nivel1[i];
    const clave = String(cat._id);

    cat.children = nivel2PorPadre[clave] || [];
    cat.hasChildren = cat.children.length > 0;
  }

  // 4️⃣ Posts (misma lógica)
  if (incluirPosts) {
    const todosIds = []
      .concat(nivel1.map(c => c._id))
      .concat(nivel2.map(c => c._id))
      .concat(nivel3.map(c => c._id));

    const posts = await Post.find({
      category: { $in: todosIds },
      $or: [{ isActive: true }, { status: 'active' }],
    })
      .sort({ createdAt: -1 })
      .limit(300)
      .select('_id title price images category createdAt')
      .lean();

    const postsMap = {};

    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const key = String(post.category);

      if (!postsMap[key]) {
        postsMap[key] = [];
      }

      if (postsMap[key].length < 8) {
        postsMap[key].push(post);
      }
    }

    // nivel 3
    for (let i = 0; i < nivel3.length; i++) {
      const cat = nivel3[i];
      cat.posts = postsMap[String(cat._id)] || [];
    }

    // nivel 2
    for (let i = 0; i < nivel2.length; i++) {
      const cat = nivel2[i];
      const hijosPosts = [];

      for (let j = 0; j < cat.children.length; j++) {
        hijosPosts.push.apply(hijosPosts, cat.children[j].posts || []);
      }

      cat.posts = (postsMap[String(cat._id)] || [])
        .concat(hijosPosts)
        .slice(0, 8);
    }

    // nivel 1
    for (let i = 0; i < nivel1.length; i++) {
      const cat = nivel1[i];
      const hijosPosts = [];

      for (let j = 0; j < cat.children.length; j++) {
        hijosPosts.push.apply(hijosPosts, cat.children[j].posts || []);
      }

      cat.posts = (postsMap[String(cat._id)] || [])
        .concat(hijosPosts)
        .slice(0, 8);
    }
  }

  const respuesta = { success: true, categories: nivel1 };

  // 🧠 Guardar cache
  cacheCategoriasPrincipales = respuesta;
  cacheCategoriasPrincipalesEn = ahora;

  return res.json(respuesta);
});
 
const getPostsByCategoryIds = async (categoryIds, limitPerCategory = 8, page = 1) => {
  const skip = (page - 1) * limitPerCategory;
  const posts = await Post.find({ category: { $in: categoryIds }, status: 'active' })
  .populate('cateogry', 'categorie subCategory articleType name')
    .populate('user', 'username avatar')
    .populate('category', 'name slug level')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limitPerCategory)
    .lean();

  const total = await Post.countDocuments({ category: { $in: categoryIds }, status: 'active' });
  const hasMore = page * limitPerCategory < total;

  return { posts, total, hasMore, currentPage: page };
};
 
const mapPostsToCategories = (categories, postsMap, limit = 8) => {
  categories.forEach(cat => {
    const childrenPosts = (cat.children || []).flatMap(c => postsMap[String(c._id)] || []);
    cat.posts = [...(postsMap[String(cat._id)] || []), ...childrenPosts].slice(0, limit);

    if (cat.children && cat.children.length > 0) {
      mapPostsToCategories(cat.children, postsMap, limit); // recursivo para hijos
    }
  });
};

 
const obtenerCategoriaPorId = asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  const incluirHijos = req.query.children === 'true' || req.query.children === 'deep';
  const incluirHijosProfundo = req.query.children === 'deep';
  const incluirPosts = req.query.posts === 'true';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;

  const query = mongoose.Types.ObjectId.isValid(identifier) ? { _id: identifier } : { slug: identifier };
  const categoria = await Category.findOne(query).lean();
  if (!categoria) return res.status(404).json({ success: false, message: 'Categoría no encontrada' });

  const datosRespuesta = { ...categoria };

  // Hijos directos
  if (incluirHijos && categoria.hasChildren) {
    datosRespuesta.children = await getChildren(categoria._id);
    if (incluirHijosProfundo) {
      for (let i = 0; i < datosRespuesta.children.length; i++) {
        const ch = datosRespuesta.children[i];
        ch.hasChildren = await Category.exists({ parent: ch._id });
      }
    }
  }

  // Posts con paginación
  if (incluirPosts) {
    let todasCategoriasIds = [categoria._id];

    if (categoria.level === 1) {
      const nivel2 = await getChildren(categoria._id, 2);
      const nivel2Ids = nivel2.map(c => c._id);
      const nivel3 = await Category.find({ parent: { $in: nivel2Ids }, level: 3 }).lean();
      todasCategoriasIds = [...todasCategoriasIds, ...nivel2Ids, ...nivel3.map(c => c._id)];
    } else if (categoria.level === 2) {
      const nivel3 = await getChildren(categoria._id, 3);
      todasCategoriasIds = [...todasCategoriasIds, ...nivel3.map(c => c._id)];
    }

    const { posts, total, hasMore } = await getPostsByCategoryIds(todasCategoriasIds, limit, page);
    datosRespuesta.posts = posts;
    datosRespuesta.hasMore = hasMore;
    datosRespuesta.total = total;
    datosRespuesta.postsPagination = { currentPage: page, limit };
  }

  // Ancestros
  if (categoria.ancestors && categoria.ancestors.length > 0) {
    datosRespuesta.ancestors = await Category.find({ _id: { $in: categoria.ancestors } })
      .select('name slug level icon iconType iconColor bgColor')
      .sort({ level: 1 })
      .lean();
  }

  res.json({ success: true, category: datosRespuesta, children: datosRespuesta.children || [], posts: datosRespuesta.posts || [] });
});

 
const obtenerArbolDeCategorias = asyncHandler(async (req, res) => {
  const todas = await Category.find({ isActive: true }).sort({ order: 1 }).lean();
  const mapa = {};
  todas.forEach(cat => (mapa[String(cat._id)] = { ...cat, children: [] }));

  const raices = [];
  todas.forEach(cat => {
    if (cat.parent && mapa[String(cat.parent)]) {
      mapa[String(cat.parent)].children.push(mapa[String(cat._id)]);
    } else {
      raices.push(mapa[String(cat._id)]);
    }
  });

  res.json({ success: true, tree: raices, totalLevels: 3 });
});

 
const buscarCategorias = asyncHandler(async (req, res) => {
  const { query } = req.params;
  const limit = parseInt(req.query.limit) || 10;

  const categorias = await Category.aggregate([
    { $match: { isLeaf: true, $or: [{ name: { $regex: query, $options: 'i' } }, { slug: { $regex: query, $options: 'i' } }] } },
    { $lookup: { from: 'posts', localField: '_id', foreignField: 'category', as: 'posts' } },
    { $project: { name: 1, slug: 1, emoji: 1, level: 1, postCount: { $size: '$posts' } } },
    { $limit: limit }
  ]);

  res.json({ success: true, categories: categorias, totalResults: categorias.length });
});

// 📂 controllers/categoryController.js - ACTUALIZAR getCategoriesForAccordion
// 📂 controllers/categoryController.js - ACTUALIZAR getCategoriesForAccordion
const getCategoriesForAccordion = asyncHandler(async (req, res) => {
  try {
    console.log('🔄 Obteniendo categorías para accordion...');
    
    // Obtener TODAS las categorías con level y parent
    const categories = await Category.find({ isActive: true })
      .select('_id name slug emoji parent level icon description') // AÑADIR level
      .lean();
    
    console.log(`📊 Total categorías encontradas: ${categories.length}`);
    
    // DEBUG: Verificar que tenemos level
    console.log('🔍 Verificando niveles de categorías:');
    categories.slice(0, 5).forEach(cat => {
      console.log(`- ${cat.name}: level=${cat.level}, parent=${cat.parent}`);
    });
    
    // Crear mapa para acceso rápido
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat._id] = { ...cat, children: [] };
    });
    
    // Construir jerarquía
    const hierarchy = [];
    
    // 1. Agregar nivel 1 (sin parent)
    const level1Categories = categories.filter(cat => cat.level === 1);
    level1Categories.forEach(cat => {
      hierarchy.push(categoryMap[cat._id]);
    });
    
    // 2. Agregar nivel 2 a sus padres
    const level2Categories = categories.filter(cat => cat.level === 2);
    level2Categories.forEach(cat => {
      if (cat.parent && categoryMap[cat.parent]) {
        categoryMap[cat.parent].children.push(categoryMap[cat._id]);
      }
    });
    
    // 3. Agregar nivel 3 a sus padres
    const level3Categories = categories.filter(cat => cat.level === 3);
    level3Categories.forEach(cat => {
      if (cat.parent && categoryMap[cat.parent]) {
        // Encontrar el padre (nivel 2)
        const parentCat = categoryMap[cat.parent];
        if (parentCat) {
          parentCat.children.push(categoryMap[cat._id]);
        }
      }
    });
    
    // Verificar estructura
    console.log('📋 Estructura resultante:');
    hierarchy.forEach((cat, i) => {
      console.log(`[${i}] ${cat.name} (level: ${cat.level}) - Hijos: ${cat.children.length || 0}`);
    });
    
    res.json({ 
      success: true, 
      categories: hierarchy,
      total: hierarchy.length,
      message: `Categorías cargadas: ${hierarchy.length} principales`
    });
    
  } catch (error) {
    console.error('❌ Error en getCategoriesForAccordion:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cargar categorías',
      error: error.message
    });
  }
});

const obtenerEstadisticasDeCategorias = asyncHandler(async (req, res) => {
  const ahora = Date.now();
  if (cacheEstadisticas && ahora - cacheEstadisticasEn < 10 * 60 * 1000) return res.json(cacheEstadisticas);

  const [totalCategorias, totalPrincipales, totalSubcategorias, totalArticulos] = await Promise.all([
    Category.countDocuments(),
    Category.countDocuments({ level: 1 }),
    Category.countDocuments({ level: 2 }),
    Category.countDocuments({ level: 3 })
  ]);

  const categoriasPopulares = await Category.aggregate([
    { $match: { isLeaf: true } },
    { $lookup: { from: 'posts', localField: '_id', foreignField: 'category', as: 'posts' } },
    { $project: { name: 1, slug: 1, emoji: 1, postCount: { $size: '$posts' } } },
    { $sort: { postCount: -1 } },
    { $limit: 10 }
  ]);

  const respuesta = {
    success: true,
    stats: { totalCategorias, totalPrincipales, totalSubcategorias, totalArticulos, categoriasPopulares }
  };

  cacheEstadisticas = respuesta;
  cacheEstadisticasEn = ahora;

  res.json(respuesta);
});

module.exports = {
  obtenerCategoriasPrincipales,
  obtenerCategoriaPorId,
  obtenerArbolDeCategorias,
  buscarCategorias,
  obtenerEstadisticasDeCategorias,
  getCategoriesForAccordion


};
