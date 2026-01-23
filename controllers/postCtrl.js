// 📂 controllers/postCtrl.js - VERSIÓN CORREGIDA
const Post = require('../models/postModel');
const Category = require('../models/categoryModel');
const User = require('../models/userModel'); // Cambiado de Users a User
const Boutique = require('../models/boutiqueModel');
const mongoose = require('mongoose');

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  paginating() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

const postCtrl = {
  // =====================================================
  // 🧩 CREAR NUEVO POST
  // =====================================================
  createPost: async (req, res) => {
    try {
      const {
        title,
        description,
        price,
        categorie,
        subCategory,
        articleType,
        phone,
        email,
        wilaya,
        commune,
        address,
        etat = 'occasion',
        livraison = false,
        echange = false,
        marque = '',
        modele = '',
        gross_detail = '',
        unite = '',
        categorySpecificData = {},
        boutiqueData = {},
        images = []
      } = req.body;

      if (!title || !description || !price) {
        return res.status(400).json({ success: false, message: 'Título, descripción y precio son requeridos' });
      }

      if (!categorie || !subCategory) {
        return res.status(400).json({ success: false, message: 'Categoría y subcategoría son requeridas' });
      }

      // 🔍 Buscar la categoría final
      let finalCategory =
        (articleType && await Category.findOne({ slug: articleType, level: 3, isActive: true })) ||
        (await Category.findOne({ slug: subCategory, level: 2, isActive: true })) ||
        (await Category.findOne({ slug: categorie, level: 1, isActive: true }));

      if (!finalCategory) {
        return res.status(404).json({ success: false, message: 'Categoría no encontrada' });
      }

      if (!req.user || !req.user._id) {
        return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
      }

      const postData = {
        title: title.trim(),
        description: description.trim(),
        price: parseFloat(price) || 0,
        category: finalCategory._id,
        user: req.user._id,
        images: Array.isArray(images) ? images.map(img => img.url || img) : [],
        status: 'active',
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };

      // Agregar atributos
      const attributes = {
        etat, livraison, echange, marque, modele, gross_detail, unite,
        phone, email, wilaya, commune, address
      };
      Object.assign(attributes, categorySpecificData, boutiqueData);
      postData.attributes = attributes;

      const newPost = new Post(postData);
      const created = await newPost.save();

      await Category.findByIdAndUpdate(finalCategory._id, {
        $inc: { postCount: 1 },
        lastPostDate: new Date()
      });

      res.status(201).json({
        success: true,
        message: 'Post creado exitosamente',
        post: created
      });
    } catch (error) {
      console.error('Error en createPost:', error);
      res.status(500).json({ success: false, message: 'Error al crear post', error: error.message });
    }
  },

  // =====================================================
  // 🔍 FILTRAR POSTS
  // =====================================================
  filterPosts: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const skip = (page - 1) * limit;

      const { category, sub, article } = req.query;

      if (!category) {
        return res.json({ success: true, posts: [], total: 0, page, hasMore: false, message: 'Se requiere categoría' });
      }

      // 1️⃣ Buscar categoría principal
      let categoryDoc = await Category.findOne({ slug: category }).lean();
      if (!categoryDoc && mongoose.Types.ObjectId.isValid(category)) {
        categoryDoc = await Category.findById(category).lean();
      }
      if (!categoryDoc) return res.json({ success: true, posts: [], total: 0, page, hasMore: false, message: 'Categoría no encontrada' });

      // 2️⃣ Obtener todos los IDs de categorías hijos
      let todasCategoriasIds = [categoryDoc._id];
      let children = [];

      if (categoryDoc.level === 1) {
        // Traer todas subcategorías y artículos
        const niveles2y3 = await Category.find({
          $or: [
            { parent: categoryDoc._id, level: 2, isActive: true },
            { ancestors: categoryDoc._id, level: 3, isActive: true }
          ]
        }).select('_id name slug parent level emoji hasChildren isLeaf').lean();

        const nivel2 = niveles2y3.filter(c => c.level === 2);
        const nivel3 = niveles2y3.filter(c => c.level === 3);

        // Filtrar por sub si viene
        if (sub) {
          const subcatEspecifica = nivel2.find(s => s.slug === sub);
          if (subcatEspecifica) {
            children = [subcatEspecifica];
            todasCategoriasIds = [subcatEspecifica._id, ...nivel3.filter(a => String(a.parent) === String(subcatEspecifica._id)).map(a => a._id)];
          } else {
            children = nivel2;
            todasCategoriasIds = [categoryDoc._id, ...nivel2.map(s => s._id), ...nivel3.map(a => a._id)];
          }
        } else {
          children = nivel2;
          todasCategoriasIds = [categoryDoc._id, ...nivel2.map(s => s._id), ...nivel3.map(a => a._id)];
        }

      } else if (categoryDoc.level === 2) {
        // Nivel 2: traer artículos hijos
        const articulos = await Category.find({ parent: categoryDoc._id, level: 3, isActive: true })
          .select('_id name slug level emoji hasChildren isLeaf').lean();
        children = articulos;
        todasCategoriasIds = [categoryDoc._id, ...articulos.map(a => a._id)];
      }
      // Nivel 3: solo la categoría actual

      // 3️⃣ Buscar posts
      const filter = { category: { $in: todasCategoriasIds }, status: 'active' };
      const [posts, total] = await Promise.all([
        Post.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .select('_id title price images createdAt location user category')
          .populate('user', 'name avatar')
          .populate('category', 'name slug icon level')
          .lean(),
        Post.countDocuments(filter)
      ]);

      const hasMore = page * limit < total;

      return res.json({
        success: true,
        posts,
        total,
        page,
        limit,
        hasMore,
        totalPages: Math.ceil(total / limit),
        category: {
          _id: categoryDoc._id,
          name: categoryDoc.name,
          slug: categoryDoc.slug,
          level: categoryDoc.level,
          emoji: categoryDoc.emoji || '',
          description: categoryDoc.description || ''
        },
        children: children.map(c => ({
          _id: c._id,
          name: c.name,
          slug: c.slug,
          level: c.level,
          emoji: c.emoji || '',
          hasChildren: c.hasChildren || false
        }))
      });

    } catch (error) {
      console.error('❌ Error en filterPosts:', error);
      res.status(500).json({ success: false, message: 'Error al filtrar posts', error: error.message });
    }
  },

  // =====================================================
  // 📄 OBTENER POSTS PAGINADOS
  // =====================================================
  getPosts: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 12,
        category,
        subCategory,
        article,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        minPrice,
        maxPrice,
        location,
        search
      } = req.query;

      const skip = (page - 1) * limit;
      const query = { status: 'active' };
      const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

      // Filtros
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
      }

      if (location) {
        query['attributes.wilaya'] = { $regex: location, $options: 'i' };
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      // Filtro categoría
      if (category) {
        const regex = new RegExp(category, 'i');
        const foundCategory = await Category.findOne({ slug: regex });
        if (foundCategory) query.category = foundCategory._id;
      }

      const [posts, total] = await Promise.all([
        Post.find(query)
          .populate('category', 'name slug emoji path')
          .populate('user', 'name username avatar')
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .lean(),
        Post.countDocuments(query)
      ]);

      res.json({
        success: true,
        posts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalPosts: total,
          hasMore: page * limit < total
        }
      });
    } catch (error) {
      console.error('Error en getPosts:', error);
      res.status(500).json({ success: false, message: 'Error al obtener posts', error: error.message });
    }
  },

  // =====================================================
  // 🔍 OBTENER POST DETALLADO
  // =====================================================
  getPost: async (req, res) => {
    try {
      const { id } = req.params;

      const post = await Post.findById(id)
        .populate('user', 'avatar username')
        .populate({
          path: 'comments',
          populate: { path: 'user likes', select: '-password' }
        });

      if (!post)
        return res.status(404).json({ success: false, message: 'El post no existe' });

      res.json({ success: true, post });
    } catch (error) {
      console.error('Error en getPost:', error);
      res.status(500).json({ success: false, message: 'Error al obtener post', error: error.message });
    }
  },

  // =====================================================
  // 🔎 OBTENER POST POR ID
  // =====================================================
  getPostById: async (req, res) => {
    try {
      const { id } = req.params;
      if (!mongoose.Types.ObjectId.isValid(id))
        return res.status(400).json({ success: false, message: 'ID inválido' });

      const post = await Post.findById(id)
        .populate('category', 'name slug emoji path level')
        .populate('user', 'name username avatar phone email')
        .lean();

      if (!post)
        return res.status(404).json({ success: false, message: 'Post no encontrado' });

      await Post.findByIdAndUpdate(id, { $inc: { views: 1 } });

      const related = await Post.find({
        category: post.category._id,
        _id: { $ne: post._id },
        status: 'active'
      })
        .sort({ createdAt: -1 })
        .limit(6)
        .select('title images price attributes createdAt')
        .lean();

      res.json({ success: true, post: { ...post, relatedPosts: related } });
    } catch (error) {
      console.error('Error en getPostById:', error);
      res.status(500).json({ success: false, message: 'Error al obtener post', error: error.message });
    }
  },

  // =====================================================
  // 👤 POSTS POR USUARIO (VERSIÓN ÚNICA CORREGIDA)
  // =====================================================
  getUserPosts: async (req, res) => {
    try {
      const { id } = req.params; // El ID del usuario
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;
      const skip = (page - 1) * limit;

      console.log(`🔍 Buscando posts del usuario ID: ${id}`);
      console.log(`📄 Página: ${page}, Límite: ${limit}`);

      // Validar ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario inválido'
        });
      }

      // Verificar si el usuario existe
      const userExists = await User.findById(id).select('_id name');
      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Query para posts del usuario
      const query = {
        user: new mongoose.Types.ObjectId(id),
        status: 'active' // Solo posts activos
      };

      // Ejecutar búsqueda y conteo en paralelo
      const [posts, total] = await Promise.all([
        Post.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('user', 'name username avatar')
          .populate('category', 'name slug emoji')
          .populate('boutique', 'nom_boutique logo')
          .lean(),
        Post.countDocuments(query)
      ]);

      // Calcular paginación
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      console.log(`✅ Encontrados ${posts.length} posts de ${total} totales`);

      res.json({
        success: true,
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          totalPosts: total,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? page + 1 : null,
          prevPage: hasPrevPage ? page - 1 : null
        },
        user: {
          _id: userExists._id,
          name: userExists.name
        }
      });

    } catch (error) {
      console.error('❌ Error en getUserPosts:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener posts del usuario',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  // =====================================================
  // ✏️ ACTUALIZAR POST
  // =====================================================
  updatePost: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ success: false, message: 'Post no encontrado' });

      if (req.user && post.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'No autorizado' });
      }

      updates.updatedAt = new Date();
      if (updates.status === 'active' && post.status !== 'active') {
        updates.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      )
        .populate('category', 'name slug emoji')
        .populate('user', 'name username');

      res.json({ success: true, message: 'Post actualizado', post: updatedPost });
    } catch (error) {
      console.error('Error en updatePost:', error);
      res.status(500).json({ success: false, message: 'Error al actualizar post', error: error.message });
    }
  },

  // =====================================================
  // 🗑️ ELIMINAR POST (SOFT DELETE)
  // =====================================================
  deletePost: async (req, res) => {
    try {
      const { id } = req.params;
      const post = await Post.findById(id);
      if (!post) return res.status(404).json({ success: false, message: 'Post no encontrado' });

      if (req.user && post.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'No autorizado' });
      }

      const deleted = await Post.findByIdAndUpdate(
        id,
        { status: 'deleted', deletedAt: new Date() },
        { new: true }
      );

      await Category.findByIdAndUpdate(post.category, { $inc: { postCount: -1 } });

      res.json({ success: true, message: 'Post eliminado', post: deleted });
    } catch (error) {
      console.error('Error en deletePost:', error);
      res.status(500).json({ success: false, message: 'Error al eliminar post', error: error.message });
    }
  },

  // =====================================================
  // 🔥 POSTS DESTACADOS
  // =====================================================
  getFeaturedPosts: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 6;
      const posts = await Post.find({ status: 'active', featured: true })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('category', 'name slug emoji')
        .lean();
      res.json({ success: true, featuredPosts: posts });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error al obtener destacados', error: error.message });
    }
  },

  // =====================================================
  // 📅 POSTS RECIENTES
  // =====================================================
  getRecentPosts: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const posts = await Post.find({ status: 'active' })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('title images price category attributes createdAt')
        .populate('category', 'name slug emoji')
        .lean();
      res.json({
        success: true,
        recentPosts: posts,
        total: posts.length
      });
    } catch (error) {
      console.error('Error en getRecentPosts:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener posts recientes'
      });
    }
  },

  // =====================================================
  // 🔍 BUSCAR POSTS
  // =====================================================
  searchPosts: async (req, res) => {
    try {
      const { query } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const skip = (page - 1) * limit;

      const searchQuery = {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } }
        ],
        status: 'active'
      };

      const [posts, total] = await Promise.all([
        Post.find(searchQuery).skip(skip).limit(limit).sort({ createdAt: -1 }).lean(),
        Post.countDocuments(searchQuery)
      ]);

      res.json({
        success: true,
        posts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalPosts: total,
          hasMore: page * limit < total
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error en búsqueda', error: error.message });
    }
  },

  // =====================================================
  // 🛒 MARCAR COMO VENDIDO
  // =====================================================
  markAsSold: async (req, res) => {
    try {
      const { id } = req.params;

      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post no encontrado'
        });
      }

      // Verificar propiedad
      if (req.user && post.user && req.user._id && post.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'No autorizado'
        });
      }

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { $set: { status: 'sold', soldAt: new Date() } },
        { new: true }
      );

      res.json({
        success: true,
        message: 'Post marcado como vendido',
        post: updatedPost
      });

    } catch (error) {
      console.error('Error en markAsSold:', error);
      res.status(500).json({
        success: false,
        message: 'Error al marcar como vendido'
      });
    }
  },

  // =====================================================
  // ❤️ LIKE POST
  // =====================================================
  likePost: async (req, res) => {
    try {
      const post = await Post.find({ _id: req.params.id, likes: req.user._id });
      if (post.length > 0) return res.status(400).json({ msg: "Ya te gusta este post." });

      const like = await Post.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { likes: req.user._id } },
        { new: true }
      );

      if (!like) return res.status(400).json({ msg: 'Este post no existe.' });

      res.json({ msg: '¡Post likeado!' });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // =====================================================
  // ❤️ UNLIKE POST
  // =====================================================
  unLikePost: async (req, res) => {
    try {
      const like = await Post.findOneAndUpdate(
        { _id: req.params.id },
        { $pull: { likes: req.user._id } },
        { new: true }
      );

      if (!like) return res.status(400).json({ msg: 'Este post no existe.' });

      res.json({ msg: '¡Post unliked!' });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // =====================================================
  // 💾 GUARDAR POST
  // =====================================================
  savePost: async (req, res) => {
    try {
      const user = await User.find({ _id: req.user._id, saved: req.params.id });
      if (user.length > 0) return res.status(400).json({ msg: "Ya guardaste este post." });

      const save = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { saved: req.params.id } },
        { new: true }
      );

      if (!save) return res.status(400).json({ msg: 'Este usuario no existe.' });

      res.json({ msg: '¡Post guardado!' });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // =====================================================
  // 💾 QUITAR POST GUARDADO
  // =====================================================
  unSavePost: async (req, res) => {
    try {
      const save = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $pull: { saved: req.params.id } },
        { new: true }
      );

      if (!save) return res.status(400).json({ msg: 'Este usuario no existe.' });

      res.json({ msg: '¡Post eliminado de guardados!' });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // =====================================================
  // 📌 POSTS GUARDADOS
  // =====================================================
  getSavePosts: async (req, res) => {
    try {
      const features = new APIfeatures(
        Post.find({ _id: { $in: req.user.saved } }),
        req.query
      ).paginating();

      const savePosts = await features.query.sort("-createdAt");

      res.json({
        savePosts,
        result: savePosts.length
      });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // =====================================================
  // 🔍 POSTS SIMILARES
  // =====================================================
  getSimilarPosts: async (req, res) => {
    try {
      console.log('📥 getSimilarPosts recibió:', req.query);

      const {
        categorie,
        subCategory,
        excludeId,
        limit = 6,
        page = 1
      } = req.query;

      // Validación
      if (!categorie || !subCategory) {
        return res.status(400).json({
          success: false,
          message: 'Se requiere categorie y subCategory'
        });
      }

      // Construir query
      let query = {
        categorie: categorie.trim(),
        subCategory: subCategory.trim(),
        isActive: true
      };

      // Excluir post actual
      if (excludeId && mongoose.Types.ObjectId.isValid(excludeId)) {
        query._id = { $ne: new mongoose.Types.ObjectId(excludeId) };
      }

      console.log('🔍 Query de búsqueda:', query);

      // Paginación
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Buscar posts
      const posts = await Post.find(query)
        .populate('user', 'name avatar')
        .populate('likes', '_id name')
        .sort({ isPromoted: -1, isUrgent: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));

      const total = await Post.countDocuments(query);
      const totalPages = Math.ceil(total / parseInt(limit));
      const hasMore = page < totalPages;

      console.log(`✅ Encontrados ${posts.length} posts de ${total}`);

      res.json({
        success: true,
        posts,
        total,
        page: parseInt(page),
        totalPages,
        hasMore
      });

    } catch (error) {
      console.error('❌ getSimilarPosts error:', error);
      res.status(500).json({
        success: false,
        message: 'Error del servidor',
        error: error.message
      });
    }
  },

  // =====================================================
  // 🩺 HEALTH CHECK
  // =====================================================
  healthCheck: async (req, res) => {
    try {
      res.json({
        success: true,
        message: 'API de posts funcionando correctamente',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error en health check'
      });
    }
  }
};

module.exports = postCtrl;