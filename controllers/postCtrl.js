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
  // controllers/postController.js
  createPost :async (req, res) => {
    try {
      const {
        categorie,
        subCategory,
        articleType,
        // Campos comunes
        title,
        description,
        price,
        etat = 'occasion',
        phone,
        email,
        // Campos específicos
        ...otherFields
      } = req.body;
  
      console.log('📥 Datos recibidos del frontend:', req.body);
  
      // Validaciones básicas
      if (!categorie || !subCategory) {
        return res.status(400).json({
          success: false,
          error: "Catégorie et sous-catégorie sont requises"
        });
      }
  
      // Crear el objeto del post
      const newPost = {
        categorie,
        subCategory,
        articleType: articleType || '',
        
        // Campos comunes
        title: title || '',
        description: description || '',
        price: parseFloat(price) || 0,
        etat: etat || 'occasion',
        phone: phone || '',
        email: email || '',
        
        // Campos de ubicación
        wilaya: req.body.wilaya || '',
        commune: req.body.commune || '',
        address: req.body.address || '',
        
        // User info
        user: req.user.id,
        
        // Campos específicos
        categorySpecificData: {}
      };
  
      // Extraer categorySpecificData si viene separado
      if (req.body.categorySpecificData) {
        newPost.categorySpecificData = req.body.categorySpecificData;
      } else {
        // Si no viene categorySpecificData, extraer campos que no son del post principal
        const postFields = [
          'categorie', 'subCategory', 'articleType',
          'title', 'description', 'price', 'etat',
          'phone', 'email', 'wilaya', 'commune', 'address',
          'user', 'images'
        ];
        
        Object.keys(req.body).forEach(key => {
          if (!postFields.includes(key) && req.body[key] !== undefined) {
            newPost.categorySpecificData[key] = req.body[key];
          }
        });
      }
  
      console.log('📝 Post a guardar:', newPost);
  
      // Guardar en la base de datos
      const post = await Post.create(newPost);
      
      // Guardar imágenes si existen
      if (req.body.images && req.body.images.length > 0) {
        // Lógica para guardar imágenes
      }
  
      res.status(201).json({
        success: true,
        data: post
      });
  
    } catch (error) {
      console.error('❌ Error en createPost:', error);
      res.status(500).json({
        success: false,
        error: error.message || "Erreur lors de la création du post"
      });
    }
  },
  updatePost: async (req, res) => {
    try {
      const { id } = req.params;
      
      console.log('📝 Actualizando post ID:', id);
      console.log('📥 Nuevos datos:', req.body);
      
      // Buscar el post existente
      let post = await Post.findById(id);
      
      if (!post) {
        return res.status(404).json({
          success: false,
          error: "Post non trouvé"
        });
      }
      
      // Verificar que el usuario sea el propietario
      if (post.user.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: "Non autorisé à modifier ce post"
        });
      }
      
      // Extraer datos para actualizar
      const updateData = { ...req.body };
      
      // Manejar categorySpecificData
      if (req.body.categorySpecificData) {
        // Si viene un Map o un objeto, convertirlo a Map
        if (req.body.categorySpecificData instanceof Map) {
          updateData.categorySpecificData = req.body.categorySpecificData;
        } else if (typeof req.body.categorySpecificData === 'object') {
          const map = new Map();
          Object.entries(req.body.categorySpecificData).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
              map.set(key, value);
            }
          });
          updateData.categorySpecificData = map;
        }
      }
      
      // Convertir price a número si existe
      if (updateData.price) {
        updateData.price = parseFloat(updateData.price);
      }
      
      // Actualizar el post
      post = await Post.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );
      
      res.status(200).json({
        success: true,
        data: post
      });
      
    } catch (error) {
      console.error('❌ Error en updatePost:', error);
      res.status(500).json({
        success: false,
        error: error.message || "Erreur lors de la mise à jour du post"
      });
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

      const { category: categoryParam, sub } = req.query;

      if (!categoryParam) {
        return res.json({
          success: true,
          posts: [],
          total: 0,
          page,
          hasMore: false,
          message: 'Se requiere categoría'
        });
      }

      // 🔹 1️⃣ Obtener la categoría principal
      let categoryDoc = await Category.findOne({ slug: categoryParam }).lean();
      if (!categoryDoc && mongoose.Types.ObjectId.isValid(categoryParam)) {
        categoryDoc = await Category.findById(categoryParam).lean();
      }
      if (!categoryDoc) {
        return res.json({
          success: true,
          posts: [],
          total: 0,
          page,
          hasMore: false,
          message: 'Categoría no encontrada'
        });
      }

      // 🔹 2️⃣ Función helper para obtener IDs de hijos recursivamente
      const getChildCategories = async (catId) => {
        const children = await Category.find({ parent: catId, isActive: true })
          .select('_id level name slug emoji icon iconType iconColor bgColor hasChildren isLeaf order')
          .sort({ order: 1 })
          .lean();

        let allIds = children.map(c => c._id);

        for (const child of children) {
          const subIds = await getChildCategories(child._id);
          allIds = [...allIds, ...subIds];
        }

        return allIds;
      };

      // 🔹 3️⃣ Determinar categorías a filtrar según nivel
      let children = [];
      let allCategoryIds = [categoryDoc._id];

      if (categoryDoc.level === 1 && sub) {
        // Buscar subcategoría específica si existe
        const subDoc = await Category.findOne({ slug: sub, parent: categoryDoc._id, level: 2, isActive: true }).lean();
        if (subDoc) {
          const articleIds = await getChildCategories(subDoc._id);
          children = await Category.find({ parent: subDoc._id, level: 3, isActive: true })
            .select('_id name slug level emoji icon iconType iconColor bgColor hasChildren isLeaf order')
            .sort({ order: 1 })
            .lean();
          allCategoryIds = [subDoc._id, ...articleIds];
        } else {
          // fallback: todas las subcategorías
          children = await Category.find({ parent: categoryDoc._id, level: 2, isActive: true })
            .select('_id name slug level emoji icon iconType iconColor bgColor hasChildren isLeaf order')
            .sort({ order: 1 })
            .lean();
          allCategoryIds = [categoryDoc._id, ...children.map(c => c._id)];
        }
      } else {
        // 🔹 CASO: Nivel 2 o 3
        const childIds = await getChildCategories(categoryDoc._id);
      
        children = await Category.find({ parent: categoryDoc._id, isActive: true })
          .select('_id name slug level emoji icon iconType iconColor bgColor hasChildren isLeaf order')
          .sort({ order: 1 })
          .lean();
      
        allCategoryIds = [categoryDoc._id, ...childIds];
      
        // 🧩 Fallback: si no existen artículos hijos, devolvemos un "artículo genérico"
        if (children.length === 0 && categoryDoc.level === 2) {
          console.log(`⚠️ Sin artículos nivel 3 para ${categoryDoc.name}, creando placeholder`);
          children = [{
            _id: categoryDoc._id,
            name: `Todos los ${categoryDoc.name}`,
            slug: categoryDoc.slug,
            level: 3,
            emoji: categoryDoc.emoji || '',
            icon: categoryDoc.icon || '',
            iconType: categoryDoc.iconType || 'image-png',
            iconColor: categoryDoc.iconColor || '#666666',
            bgColor: categoryDoc.bgColor || '#FFFFFF',
            isLeaf: true,
            hasChildren: false
          }];
        }
      }
      // 🔹 4️⃣ Consultar posts activos
      const filter = { category: { $in: allCategoryIds }, status: 'active' };

      const [posts, total] = await Promise.all([
        Post.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .select('_id title price images createdAt location user category description')
          .populate('user', 'name avatar')
          .populate('category', 'name slug icon level')
          .lean(),
        Post.countDocuments(filter)
      ]);

      const hasMore = page * limit < total;
      const totalPages = Math.ceil(total / limit);

      // 🔹 5️⃣ Respuesta final
      return res.json({
        success: true,
        posts,
        total,
        page,
        limit,
        hasMore,
        totalPages,
        categoryInfo: {
          _id: categoryDoc._id,
          name: categoryDoc.name,
          slug: categoryDoc.slug,
          level: categoryDoc.level,
          emoji: categoryDoc.emoji || '',
          description: categoryDoc.description || '',
          icon: categoryDoc.icon || '',
          iconType: categoryDoc.iconType || 'image-png',
          iconColor: categoryDoc.iconColor || '#666666',
          bgColor: categoryDoc.bgColor || '#FFFFFF'
        },
        children: children.map(c => ({
          _id: c._id,
          name: c.name,
          slug: c.slug,
          level: c.level,
          emoji: c.emoji || '',
          hasChildren: c.hasChildren || false,
          isLeaf: c.isLeaf || false,
          icon: c.icon || '',
          iconType: c.iconType || 'image-png',
          iconColor: c.iconColor || categoryDoc.iconColor || '#666666',
          bgColor: c.bgColor || categoryDoc.bgColor || '#FFFFFF'
        }))
      });

    } catch (error) {
      console.error('❌ Error en filterPosts optimizado:', error);
      res.status(500).json({ success: false, message: 'Error al filtrar posts', error: error.message });
    }


  },
  getPosts: async (req, res) => {
    try {
        const { page = 1, limit = 9, category } = req.query;
        const skip = (page - 1) * limit;

        // Construir query
        let query = { isActive: true };

        // Si hay categoría, filtrar
        if (category && category !== 'all') {
            query.categorie = category;
        }

        // Obtener posts
        const posts = await Posts.find(query)
            .skip(skip)
            .limit(parseInt(limit))
            .sort('-createdAt')
            .populate("user", "avatar username");

        // Contar total
        const total = await Posts.countDocuments(query);

        res.json({
            msg: 'Success!',
            result: posts.length,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            posts
        });

    } catch (err) {
        console.error('❌ Error en getPosts:', err);
        return res.status(500).json({ msg: err.message });
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