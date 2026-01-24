// 📂 controllers/categoryCtrl.js
const Category = require('../models/categoryModel');
const Post = require('../models/postModel');
const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');

// 🧠 Variables de caché
let cacheCategoriasPrincipales = null;
let cacheCategoriasPrincipalesEn = 0;

let cacheEstadisticas = null;
let cacheEstadisticasEn = 0;
const obtenerCategoriasPrincipales = asyncHandler(async (req, res) => {
  const incluirPosts = req.query.posts === 'true';
  const ahora = Date.now();

  // 🔹 Caché solo para nivel 1 sin posts
  if (!incluirPosts && cacheCategoriasPrincipales && ahora - cacheCategoriasPrincipalesEn < 5 * 60 * 1000) {
    return res.json(cacheCategoriasPrincipales);
  }

  // 1️⃣ Traer categorías activas
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

  // 2️⃣ Armar relaciones padre-hijo en memoria
  const nivel3PorPadre = {};
  nivel3.forEach(cat => {
    const idPadre = String(cat.parent);
    if (!nivel3PorPadre[idPadre]) nivel3PorPadre[idPadre] = [];
    nivel3PorPadre[idPadre].push(cat);
  });

  nivel2.forEach(subcat => {
    const clave = String(subcat._id);
    subcat.children = nivel3PorPadre[clave] || [];
    subcat.hasChildren = subcat.children.length > 0;
  });

  const nivel2PorPadre = {};
  nivel2.forEach(subcat => {
    const idPadre = String(subcat.parent);
    if (!nivel2PorPadre[idPadre]) nivel2PorPadre[idPadre] = [];
    nivel2PorPadre[idPadre].push(subcat);
  });

  nivel1.forEach(cat => {
    const clave = String(cat._id);
    cat.children = nivel2PorPadre[clave] || [];
    cat.hasChildren = cat.children.length > 0;
  });

  // 3️⃣ Traer posts si se piden
  if (incluirPosts) {
    // Crear lista de todos los ids de categorías (nivel1, nivel2, nivel3)
    const todosIds = [
      ...nivel1.map(c => c._id),
      ...nivel2.map(c => c._id),
      ...nivel3.map(c => c._id),
    ];

    // 🔹 UNA SOLA CONSULTA a Post
    const posts = await Post.find({ category: { $in: todosIds }, status: 'active' })
      .select('_id title price images createdAt location category')
      .sort({ createdAt: -1 })
      .lean();

    // 🔹 Map para asignar posts a su categoría
    const postsMap = {};
    posts.forEach(post => {
      const key = String(post.category);
      if (!postsMap[key]) postsMap[key] = [];
      if (postsMap[key].length < 8) postsMap[key].push(post); // limitar a 8 por categoría
    });

    // 🔹 Asignar posts a nivel3
    nivel3.forEach(cat => {
      cat.posts = postsMap[String(cat._id)] || [];
    });

    // 🔹 Asignar posts a nivel2 sumando hijos nivel3
    nivel2.forEach(cat => {
      const hijosPosts = cat.children.flatMap(c => c.posts || []);
      cat.posts = [...(postsMap[String(cat._id)] || []), ...hijosPosts].slice(0, 8);
    });

    // 🔹 Asignar posts a nivel1 sumando hijos nivel2
    nivel1.forEach(cat => {
      const hijosPosts = cat.children.flatMap(c => c.posts || []);
      cat.posts = [...(postsMap[String(cat._id)] || []), ...hijosPosts].slice(0, 8);
    });
  }

  const respuesta = { success: true, categories: nivel1 };

  // 🔹 Guardar caché si no se piden posts
  if (!incluirPosts) {
    cacheCategoriasPrincipales = respuesta;
    cacheCategoriasPrincipalesEn = ahora;
  }

  return res.json(respuesta);
});

// 📂 controllers/categoryCtrl.js - VERSIÓN SIMPLIFICADA
// 📂 controllers/categoryCtrl.js - VERSIÓN SIMPLIFICADA
const obtenerPostsFiltradosPorCategoria = asyncHandler(async (req, res) => {
  try {
    const { category, sub, article, page = 1, limit = 12 } = req.query;
    
    console.log('=== INICIO OBTENER POSTS ===');
    console.log('Parámetros:', { category, sub, article, page, limit });

    // 1. BUSCAR CATEGORÍA PRINCIPAL (nivel 1)
    const categoriaPrincipal = await Category.findOne({ 
      slug: category, 
      level: 1 
    });
    
    if (!categoriaPrincipal) {
      return res.status(404).json({ 
        success: false, 
        message: 'Categoría principal no encontrada' 
      });
    }

    let currentCategory = categoriaPrincipal;
    let children = [];
    let postQuery = {};

    // 2. DETERMINAR NIVEL Y BUSCAR
    if (!sub && !article) {
      // NIVEL 1: Subcategorías
      console.log('📍 NIVEL 1: Buscando subcategorías');
      children = await Category.find({ 
        parent: categoriaPrincipal._id,
        level: 2 
      }).sort({ order: 1 }).lean();
      
      postQuery = {
        $or: [
          { category: categoriaPrincipal._id },
          { category: { $in: children.map(c => c._id) } }
        ],
        status: 'active'
      };
      
    } else if (sub && !article) {
      // NIVEL 2: Buscar subcategoría y luego sus artículos
      console.log('📍 NIVEL 2: Buscando subcategoría:', sub);
      
      const subcategoria = await Category.findOne({
        slug: sub,
        parent: categoriaPrincipal._id,
        level: 2
      });
      
      if (!subcategoria) {
        return res.status(404).json({ 
          success: false, 
          message: 'Subcategoría no encontrada' 
        });
      }
      
      currentCategory = subcategoria;
      
      // ⭐⭐ BUSCAR ARTÍCULOS (esto es lo crítico)
      console.log('🔍 Buscando artículos para subcategoría:', subcategoria.name);
      
      // PRIMERO: Buscar nivel 3 (artículos)
      children = await Category.find({ 
        parent: subcategoria._id,
        level: 3 
      }).sort({ order: 1 }).lean();
      
      console.log('📊 Resultado búsqueda nivel 3:', {
        encontrados: children.length,
        nombres: children.map(c => c.name)
      });
      
      // SEGUNDO: Si no hay nivel 3, buscar cualquier hijo
      if (children.length === 0) {
        console.log('⚠️ No se encontraron artículos nivel 3. Buscando cualquier hijo...');
        children = await Category.find({ 
          parent: subcategoria._id 
        }).sort({ order: 1 }).lean();
        
        console.log('📊 Hijos encontrados (cualquier nivel):', {
          encontrados: children.length,
          niveles: children.map(c => c.level),
          nombres: children.map(c => c.name)
        });
      }
      
      // TERCERO: Si aún no hay hijos, verificar si es leaf
      if (children.length === 0 && subcategoria.isLeaf) {
        console.log('ℹ️ Subcategoría marcada como leaf - no tiene hijos');
      }
      
      postQuery = {
        category: subcategoria._id,
        status: 'active'
      };
      
    } else if (sub && article) {
      // NIVEL 3: Artículo específico
      console.log('📍 NIVEL 3: Buscando artículo:', article);
      
      // Buscar subcategoría primero
      const subcategoria = await Category.findOne({
        slug: sub,
        parent: categoriaPrincipal._id,
        level: 2
      });
      
      if (!subcategoria) {
        return res.status(404).json({ 
          success: false, 
          message: 'Subcategoría no encontrada' 
        });
      }
      
      // Buscar artículo
      const articulo = await Category.findOne({
        slug: article,
        parent: subcategoria._id,
        level: 3
      });
      
      if (!articulo) {
        return res.status(404).json({ 
          success: false, 
          message: 'Artículo no encontrada' 
        });
      }
      
      currentCategory = articulo;
      
      // Para nivel 3: Mostrar TODOS los artículos de la misma subcategoría
      // (para mantener el slider funcional)
      children = await Category.find({ 
        parent: subcategoria._id,
        level: 3 
      }).sort({ order: 1 }).lean();
      
      console.log('📁 Artículos para slider:', children.map(a => a.name));
      
      postQuery = {
        category: articulo._id,
        status: 'active'
      };
    }

    // 3. DEBUG COMPLETO
    console.log('=== DEBUG COMPLETO ===');
    console.log('Categoría actual:', {
      nombre: currentCategory.name,
      nivel: currentCategory.level,
      id: currentCategory._id
    });
    console.log('Children encontrados:', {
      total: children.length,
      items: children.map(c => ({
        nombre: c.name,
        nivel: c.level,
        slug: c.slug,
        icon: c.icon ? 'Sí' : 'No'
      }))
    });
    console.log('Query para posts:', postQuery);

    // 4. OBTENER POSTS
    const skip = (page - 1) * limit;
    const posts = await Post.find(postQuery)
      .populate('user', 'name avatar')
      .populate('category', 'name slug level')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Post.countDocuments(postQuery);
    const hasMore = page * limit < total;

    // 5. RESPONSE
    const response = {
      success: true,
      categoryInfo: {
        _id: currentCategory._id,
        name: currentCategory.name,
        slug: currentCategory.slug,
        level: currentCategory.level,
        icon: currentCategory.icon || '',
        iconType: currentCategory.iconType || 'image-png',
        iconColor: currentCategory.iconColor || '#666666',
        bgColor: currentCategory.bgColor || '#FFFFFF'
      },
      children: children.map(child => ({
        _id: child._id,
        name: child.name,
        slug: child.slug,
        level: child.level,
        icon: child.icon || '',
        iconType: child.iconType || 'image-png',
        iconColor: child.iconColor || currentCategory.iconColor || '#666666',
        bgColor: child.bgColor || currentCategory.bgColor || '#FFFFFF',
        postCount: child.postCount || 0
      })),
      posts,
      total,
      hasMore,
      currentPage: parseInt(page)
    };

    console.log('✅ Response enviada:', {
      nivel: response.categoryInfo.level,
      childrenCount: response.children.length,
      postsCount: response.posts.length
    });

    return res.json(response);

  } catch (error) {
    console.error('❌ Error crítico:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error del servidor',
      error: error.message 
    });
  }
});
/**
 * GET /api/categories/:identifier
 * Obtener categoría por slug O por ID - VERSIÓN UNIFICADA CON ICONOS COMPLETOS
 */
 const obtenerCategoriaPorId = asyncHandler(async (req, res) => {
  const { identifier } = req.params;
  const incluirHijos = req.query.children === 'true' || req.query.children === 'deep';
  const incluirHijosProfundo = req.query.children === 'deep';
  const incluirPosts = req.query.posts === 'true';

  console.log('📡 obtenerCategoriaPorIdentificador:', {
    identifier,
    incluirHijos,
    incluirPosts,
    query: req.query
  });

  // 1. DETERMINAR SI ES SLUG O ID
  let query;
  const esObjectId = mongoose.Types.ObjectId.isValid(identifier);
  
  if (esObjectId) {
    query = { _id: identifier };
    console.log('🔍 Buscando por ID:', identifier);
  } else {
    query = { slug: identifier };
    console.log('🔍 Buscando por slug:', identifier);
  }

  // 2. BUSCAR CATEGORÍA - CON ICONOS COMPLETOS
  const categoria = await Category.findOne(query)
    .select('_id name slug icon emoji iconType iconColor bgColor level hasChildren isLeaf parent ancestors description order postCount createdAt updatedAt')
    .lean();
    
  if (!categoria) {
    return res.status(404).json({ 
      success: false, 
      message: `Categoría ${esObjectId ? 'con ID' : ''} "${identifier}" no encontrada`
    });
  }

  console.log('✅ Categoría encontrada:', {
    name: categoria.name,
    slug: categoria.slug,
    level: categoria.level,
    hasIcon: !!categoria.icon,
    icon: categoria.icon,
    iconType: categoria.iconType,
    iconColor: categoria.iconColor,
    bgColor: categoria.bgColor
  });

  // 3. PREPARAR DATOS DE RESPUESTA
  const datosRespuesta = { ...categoria };
  const promesas = [];

  // 4. HIJOS DIRECTOS - CON ICONOS COMPLETOS
  if (incluirHijos && categoria.hasChildren) {
    promesas.push(
      Category.find({ parent: categoria._id })
        .select('name slug emoji icon iconType iconColor bgColor level hasChildren isLeaf order postCount createdAt')
        .sort({ order: 1 })
        .lean()
    );
  }

  // 5. POSTS CON JERARQUÍA COMPLETA
  if (incluirPosts) {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    console.log('📊 Parámetros posts:', { page, limit, skip });

    // 🔹 OBTENER TODA LA JERARQUÍA DE CATEGORÍAS
    let todasCategoriasIds = [categoria._id];
    
    if (categoria.level === 1) {
      // Nivel 1: Incluir subcategorías y artículos
      const subcategorias = await Category.find({ 
        parent: categoria._id,
        level: 2 
      }).select('_id').lean();
      
      const subcategoriaIds = subcategorias.map(s => s._id);
      
      if (subcategoriaIds.length > 0) {
        const articulos = await Category.find({
          parent: { $in: subcategoriaIds },
          level: 3
        }).select('_id').lean();
        
        const articuloIds = articulos.map(a => a._id);
        todasCategoriasIds = [...todasCategoriasIds, ...subcategoriaIds, ...articuloIds];
      }
      
    } else if (categoria.level === 2) {
      // Nivel 2: Incluir artículos
      const articulos = await Category.find({
        parent: categoria._id,
        level: 3
      }).select('_id').lean();
      
      const articuloIds = articulos.map(a => a._id);
      todasCategoriasIds = [...todasCategoriasIds, ...articuloIds];
    }
    // Nivel 3: Solo la categoría actual

    console.log('🎯 Categorías para posts:', {
      totalIds: todasCategoriasIds.length,
      nivel: categoria.level
    });

    // 🔹 BUSCAR POSTS
    promesas.push(
      Post.find({ 
        category: { $in: todasCategoriasIds }, 
        status: 'active'
      })
        .select('_id title price images description location createdAt views user category')
        .populate('user', 'name avatar')
        .populate('category', 'name slug level')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      
      Post.countDocuments({ 
        category: { $in: todasCategoriasIds }, 
        status: 'active'
      })
    );
  }

  // 6. ANCESTROS - CON ICONOS COMPLETOS
  if (categoria.ancestors && categoria.ancestors.length > 0) {
    promesas.push(
      Category.find({ _id: { $in: categoria.ancestors } })
        .select('name slug level icon iconType iconColor bgColor')
        .sort({ level: 1 })
        .lean()
    );
  }

  // 7. EJECUTAR PROMESAS
  const resultados = promesas.length > 0 ? await Promise.all(promesas) : [];
  let indice = 0;

  // 8. PROCESAR HIJOS
  if (incluirHijos && categoria.hasChildren) {
    datosRespuesta.children = resultados[indice] || [];
    indice++;
    
    if (incluirHijosProfundo && datosRespuesta.children.length > 0) {
      const promesasExistencia = datosRespuesta.children.map(ch => 
        Category.exists({ parent: ch._id })
      );
      const resultadosExistencia = await Promise.all(promesasExistencia);
      datosRespuesta.children.forEach((ch, i) => {
        ch.hasChildren = !!resultadosExistencia[i];
      });
    }
  }

  // 9. PROCESAR POSTS
  if (incluirPosts) {
    const posts = resultados[indice] || [];
    const totalPosts = resultados[indice + 1] || 0;
    indice += 2;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const totalPages = Math.ceil(totalPosts / limit);
    const hasMore = page < totalPages;

    console.log('📦 Resultados posts:', {
      postsRecibidos: posts.length,
      totalPosts,
      page,
      totalPages,
      hasMore
    });

    datosRespuesta.posts = posts;
    datosRespuesta.postsPagination = {
      currentPage: page,
      totalPages,
      totalPosts,
      hasMore,
      limit
    };

    // ⭐ PARA COMPATIBILIDAD CON FRONTEND
    datosRespuesta.hasMore = hasMore;
    datosRespuesta.total = totalPosts;
  }

  // 10. PROCESAR ANCESTROS
  if (categoria.ancestors && categoria.ancestors.length > 0) {
    const ancestros = resultados.length > 0 ? resultados[resultados.length - 1] : [];
    if (Array.isArray(ancestros) && ancestros.length > 0) {
      datosRespuesta.ancestors = ancestros;
    } else {
      // Fallback con iconos
      const ancestrosDirectos = await Category.find({ 
        _id: { $in: categoria.ancestors } 
      })
        .select('name slug level icon iconType iconColor bgColor')
        .sort({ level: 1 })
        .lean();
      
      datosRespuesta.ancestors = ancestrosDirectos;
    }
  }

  // 11. PREPARAR RESPUESTA FINAL
  const respuesta = {
    success: true,
    category: datosRespuesta,
    children: datosRespuesta.children || [],
    posts: datosRespuesta.posts || [],
    hasMore: datosRespuesta.hasMore || false,
    total: datosRespuesta.total || 0
  };

  // Información básica para frontend
  respuesta.categoryInfo = {
    _id: categoria._id,
    name: categoria.name,
    slug: categoria.slug,
    level: categoria.level,
    emoji: categoria.emoji || '',
    description: categoria.description || '',
    // ✅ CAMPOS DE ICONO COMPLETOS
    icon: categoria.icon || '',
    iconType: categoria.iconType || 'image-png',
    iconColor: categoria.iconColor || '#666666',
    bgColor: categoria.bgColor || '#FFFFFF'
  };

  if (incluirPosts) {
    respuesta.pagination = datosRespuesta.postsPagination;
  }

  console.log('✅ Respuesta final:', {
    success: respuesta.success,
    categoryName: respuesta.categoryInfo.name,
    postsCount: respuesta.posts.length,
    childrenCount: respuesta.children.length,
    hasMore: respuesta.hasMore,
    // ✅ Verificar que los hijos tengan iconos
    primerHijoIcono: respuesta.children[0].icon || 'No tiene icono',
    totalHijosConIcono: respuesta.children.filter(c => c.icon).length
  });

  return res.json(respuesta);
});
/**
 * GET /api/categories/tree
 */
const obtenerArbolDeCategorias = asyncHandler(async (req, res) => {
  const todas = await Category.find({ isActive: true }).sort({ order: 1 }).lean();

  const mapa = {};
  todas.forEach(cat => (mapa[String(cat._id)] = { ...cat, children: [] }));

  const raices = [];
  todas.forEach(cat => {
    if (cat.parent) {
      const idPadre = String(cat.parent);
      if (mapa[idPadre]) {
        mapa[idPadre].children.push(mapa[String(cat._id)]);
      } else {
        raices.push(mapa[String(cat._id)]);
      }
    } else {
      raices.push(mapa[String(cat._id)]);
    }
  });

  return res.json({ success: true, tree: raices, totalLevels: 3 });
});




 
 
const obtenerMasPostsDeCategoria = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const page = parseInt(req.query.page) || 2;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;

  const categoria = await Category.findOne({ slug }).lean();
  if (!categoria) {
    return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
  }

  const [posts, totalPosts] = await Promise.all([
    Post.find({ category: categoria._id, status: 'active' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Post.countDocuments({ category: categoria._id, status: 'active' })
  ]);

  const totalPages = Math.ceil(totalPosts / limit);
  const hasMore = page < totalPages;

  return res.json({
    success: true,
    posts,
    pagination: {
      currentPage: page,
      totalPages,
      totalPosts,
      hasMore
    },
    category: {
      _id: categoria._id,
      name: categoria.name,
      slug: categoria.slug
    }
  });
});

/**
 * GET /api/categories/:slug/children
 */
const obtenerSubcategorias = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const limit = parseInt(req.query.limit) || 10;

  const categoria = await Category.findOne({ slug }).lean();
  if (!categoria)
    return res.status(404).json({ success: false, message: 'Categoría no encontrada' });

  const hijos = await Category.find({ parent: categoria._id })
    .sort({ order: 1 })
    .limit(limit)
    .select('name slug emoji level hasChildren postCount')
    .lean();

  const conteosPosts = await Promise.all(
    hijos.map(c => Post.countDocuments({ category: c._id, status: 'active' }))
  );

  hijos.forEach((c, i) => (c.postCount = conteosPosts[i] || 0));

  const totalHijos = await Category.countDocuments({ parent: categoria._id });

  return res.json({
    success: true,
    parentCategory: {
      _id: categoria._id,
      name: categoria.name,
      slug: categoria.slug,
      level: categoria.level
    },
    children: hijos,
    hasMoreChildren: totalHijos > limit
  });
});

/**
 * GET /api/categories/search/:query
 */
const buscarCategorias = asyncHandler(async (req, res) => {
  const { query } = req.params;
  const limit = parseInt(req.query.limit) || 10;

  const categorias = await Category.aggregate([
    {
      $match: {
        isLeaf: true,
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { slug: { $regex: query, $options: 'i' } }
        ]
      }
    },
    {
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: 'category',
        as: 'posts'
      }
    },
    {
      $project: {
        name: 1,
        slug: 1,
        emoji: 1,
        level: 1,
        path: 1,
        postCount: { $size: '$posts' }
      }
    },
    { $limit: limit }
  ]);

  return res.json({ success: true, categories: categorias, totalResults: categorias.length });
});

 
const obtenerEstadisticasDeCategorias = asyncHandler(async (req, res) => {
  const ahora = Date.now();
  if (cacheEstadisticas && ahora - cacheEstadisticasEn < 10 * 60 * 1000) {
    return res.json(cacheEstadisticas);
  }

  const [
    totalCategorias,
    totalPrincipales,
    totalSubcategorias,
    totalArticulos
  ] = await Promise.all([
    Category.countDocuments(),
    Category.countDocuments({ level: 1 }),
    Category.countDocuments({ level: 2 }),
    Category.countDocuments({ level: 3 })
  ]);

  const categoriasPopulares = await Category.aggregate([
    { $match: { isLeaf: true } },
    {
      $lookup: {
        from: 'posts',
        localField: '_id',
        foreignField: 'category',
        as: 'posts'
      }
    },
    {
      $project: {
        name: 1,
        slug: 1,
        emoji: 1,
        postCount: { $size: '$posts' }
      }
    },
    { $sort: { postCount: -1 } },
    { $limit: 10 }
  ]);

  const respuesta = {
    success: true,
    stats: {
      totalCategorias,
      totalPrincipales,
      totalSubcategorias,
      totalArticulos,
      categoriasPopulares
    }
  };

  cacheEstadisticas = respuesta;
  cacheEstadisticasEn = ahora;

  return res.json(respuesta);
});

module.exports = {
  obtenerCategoriasPrincipales,
  obtenerCategoriaPorId,
  obtenerCategoriaPorId,
  obtenerArbolDeCategorias,
  obtenerMasPostsDeCategoria,
  obtenerSubcategorias,
  buscarCategorias,
  obtenerEstadisticasDeCategorias,

  obtenerPostsFiltradosPorCategoria
  

};
