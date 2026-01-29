const Category = require('../models/categoryModel');
const Post = require('../models/postModel');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// 🧠 Caché simple
let cacheCategoriasPrincipales = null;
let cacheCategoriasPrincipalesEn = 0;
let cacheEstadisticas = null;
let cacheEstadisticasEn = 0;

/**
 * Helper: Obtener hijos de una categoría
 */
const getChildren = async (parentId, nivel = null, limit = 0) => {
  const query = { parent: parentId };
  if (nivel) query.level = nivel;
  const children = await Category.find(query)
    .sort({ order: 1 })
    .limit(limit)
    .lean();

  return children;
};

/**
 * Helper: Obtener posts de múltiples categorías
 */
const getPostsByCategoryIds = async (categoryIds, limitPerCategory = 8, page = 1) => {
  const skip = (page - 1) * limitPerCategory;
  const posts = await Post.find({ category: { $in: categoryIds }, status: 'active' })
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

/**
 * Helper: Asignar posts a categorías según nivel
 */
const mapPostsToCategories = (categories, postsMap, limit = 8) => {
  categories.forEach(cat => {
    const childrenPosts = (cat.children || []).flatMap(c => postsMap[String(c._id)] || []);
    cat.posts = [...(postsMap[String(cat._id)] || []), ...childrenPosts].slice(0, limit);

    if (cat.children && cat.children.length > 0) {
      mapPostsToCategories(cat.children, postsMap, limit); // recursivo para hijos
    }
  });
};

/**
 * GET /api/categories/principales
 * Obtener categorías nivel 1 + hijos + posts opcionales
 */
const obtenerCategoriasPrincipales = asyncHandler(async (req, res) => {
  const incluirPosts = req.query.posts === 'true';
  const ahora = Date.now();

  if (!incluirPosts && cacheCategoriasPrincipales && ahora - cacheCategoriasPrincipalesEn < 5 * 60 * 1000) {
    return res.json(cacheCategoriasPrincipales);
  }

  // 1️⃣ Traer todas las categorías activas
  const [nivel1, nivel2, nivel3] = await Promise.all([
    Category.find({ level: 1, isActive: true }).sort({ order: 1 }).lean(),
    Category.find({ level: 2, isActive: true }).sort({ order: 1 }).lean(),
    Category.find({ level: 3, isActive: true }).sort({ order: 1 }).lean(),
  ]);

  // 2️⃣ Armar relaciones padre-hijo
  const nivel3PorPadre = {};
  nivel3.forEach(cat => {
    const idPadre = String(cat.parent);
    if (!nivel3PorPadre[idPadre]) nivel3PorPadre[idPadre] = [];
    nivel3PorPadre[idPadre].push(cat);
  });

  nivel2.forEach(subcat => {
    subcat.children = nivel3PorPadre[String(subcat._id)] || [];
    subcat.hasChildren = subcat.children.length > 0;
  });

  const nivel2PorPadre = {};
  nivel2.forEach(subcat => {
    const idPadre = String(subcat.parent);
    if (!nivel2PorPadre[idPadre]) nivel2PorPadre[idPadre] = [];
    nivel2PorPadre[idPadre].push(subcat);
  });

  nivel1.forEach(cat => {
    cat.children = nivel2PorPadre[String(cat._id)] || [];
    cat.hasChildren = cat.children.length > 0;
  });

  // 3️⃣ Obtener posts si se requiere
  if (incluirPosts) {
    const todosIds = [...nivel1, ...nivel2, ...nivel3].map(c => c._id);
    const posts = await Post.find({ category: { $in: todosIds }, status: 'active' })
      .sort({ createdAt: -1 })
      .lean();

    const postsMap = {};
    posts.forEach(post => {
      const key = String(post.category);
      if (!postsMap[key]) postsMap[key] = [];
      if (postsMap[key].length < 8) postsMap[key].push(post);
    });

    mapPostsToCategories(nivel1, postsMap, 8);
  }

  const respuesta = { success: true, categories: nivel1 };

  if (!incluirPosts) {
    cacheCategoriasPrincipales = respuesta;
    cacheCategoriasPrincipalesEn = ahora;
  }

  res.json(respuesta);
});

/**
 * GET /api/categories/:identifier
 * Obtener categoría por slug o ID + hijos + posts + ancestros
 */
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

/**
 * GET /api/categories/tree
 * Obtener árbol completo de categorías (nivel 1-3)
 */
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

/**
 * GET /api/categories/search/:query
 */
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

/**
 * GET /api/categories/stats
 */
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
};
