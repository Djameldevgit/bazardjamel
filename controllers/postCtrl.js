// 📂 controllers/postController.js
const Post = require('../models/postModel');
const Category = require('../models/categoryModel');
const User = require('../models/userModel');
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
const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary
cloudinary.config({
    cloud_name: 'dfjipgj2o',
    api_key: '213981915435275',
    api_secret: 'wv_IiCM9zzhdiWDNXXo8HZi7wX4'
});
const postCtrl = {
 // 📂 controllers/postController.js
// 📂 controllers/postCtrl.js
 createPost : async (req, res) => {
  try {
    const userId = req.user._id;
    
    // 1. Validación mínima
    const { categorie, subCategory, title, wilaya, commune, images } = req.body;
    if (!categorie || !subCategory || !title || !wilaya || !commune || !images) {
      return res.status(400).json({ msg: "Champs requis manquants" });
    }

    // 2. Buscar categoría rápidamente
    const category = await Category.findOne({ 
      $or: [
        { slug: categorie },
        { slug: subCategory }
      ],
      isActive: true 
    }).select('_id').lean();

    if (!category) {
      return res.status(404).json({ msg: "Catégorie non trouvée" });
    }

    // 3. Crear post directamente
    const postData = {
      user: userId,
      categorie: categorie.trim(),
      subCategory: subCategory.trim(),
      articleType: (req.body.articleType || '').trim(),
      category: category._id,
      title: title.trim(),
      description: (req.body.description || '').trim(),
      price: parseFloat(req.body.price) || 0,
      etat: req.body.etat || 'occasion',
      wilaya: wilaya.toString().trim(),
      commune: commune.toString().trim(),
      phone: (req.body.phone || '').trim(),
      email: (req.body.email || '').trim().toLowerCase(),
      address: (req.body.address || '').trim(),
      images: images,
      categorySpecificData: req.body.categorySpecificData || {}
    };

    const newPost = new Post(postData);
    await newPost.save();

    // 4. Actualizar contador (en segundo plano)
    Category.findByIdAndUpdate(category._id, { 
      $inc: { postCount: 1 } 
    }).catch(() => {});

    // 5. Respuesta rápida
    res.status(201).json({
      success: true,
      newPost: {
        _id: newPost._id,
        title: newPost.title,
        images: newPost.images,
        user: {
          _id: req.user._id,
          username: req.user.username,
          avatar: req.user.avatar
        }
      }
    });

  } catch (err) {
    console.error('❌ createPost error:', err.message);
    res.status(500).json({ msg: "Erreur serveur" });
  }
},
   
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
        const subDoc = await Category.findOne({
          slug: sub,
          parent: categoryDoc._id,
          level: 2,
          isActive: true
        }).lean();

        if (subDoc) {
          const articleIds = await getChildCategories(subDoc._id);
          children = await Category.find({
            parent: subDoc._id,
            level: 3,
            isActive: true
          })
            .select('_id name slug level emoji icon iconType iconColor bgColor hasChildren isLeaf order')
            .sort({ order: 1 })
            .lean();
          allCategoryIds = [subDoc._id, ...articleIds];
        } else {
          // fallback: todas las subcategorías
          children = await Category.find({
            parent: categoryDoc._id,
            level: 2,
            isActive: true
          })
            .select('_id name slug level emoji icon iconType iconColor bgColor hasChildren isLeaf order')
            .sort({ order: 1 })
            .lean();
          allCategoryIds = [categoryDoc._id, ...children.map(c => c._id)];
        }
      } else {
        // 🔹 CASO: Nivel 2 o 3
        const childIds = await getChildCategories(categoryDoc._id);

        children = await Category.find({
          parent: categoryDoc._id,
          isActive: true
        })
          .select('_id name slug level emoji icon iconType iconColor bgColor hasChildren isLeaf order')
          .sort({ order: 1 })
          .lean();

        allCategoryIds = [categoryDoc._id, ...childIds];
      }

      // 🔹 4️⃣ Consultar posts activos
      const filter = {
        category: { $in: allCategoryIds },
        isActive: true,
        status: 'active'
      };

      const [posts, total] = await Promise.all([
        Post.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .select('_id title price images createdAt wilaya commune user description etat views')
          .populate('user', 'username avatar')
          .populate('categoryRef', 'name slug icon level')
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
      res.status(500).json({
        success: false,
        message: 'Error al filtrar posts',
        error: error.message
      });
    }
  },

  /**
   * 📄 OBTENER TODOS LOS POSTS (PAGINADOS)
   */
  getPosts: async (req, res) => {
    try {
      const { page = 1, limit = 9, category } = req.query;
      const skip = (page - 1) * limit;

      // Construir query
      let query = { isActive: true, status: 'active' };

      // Si hay categoría, filtrar
      if (category && category !== 'all') {
        query.categorie = category;
      }

      // Obtener posts
      const posts = await Post.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort('-createdAt')
        .populate("user", "username avatar")
        .populate("categoryRef", "name slug");

      // Contar total
      const total = await Post.countDocuments(query);

      res.json({
        success: true,
        result: posts.length,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        posts
      });

    } catch (err) {
      console.error('❌ Error en getPosts:', err);
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  },
 // 📂 controllers/postController.js

// 📂 controllers/postCtrl.js
 updatePost : async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    
    // 🎯 Recibir TODO del body (igual que createPost)
    const { 
      categorie, subCategory, articleType, title, description,
      price, etat, wilaya, commune, address, phone, email,
      images, ...categorySpecificData  // ← Campos dinámicos
    } = req.body;

    // 🎯 Buscar el post existente
    const post = await Post.findOne({ _id: id, user: userId });
    if (!post) {
      return res.status(404).json({ msg: "Annonce non trouvée" });
    }

    // 🎯 Si cambia la categoría, buscar la nueva
    let categoryId = post.category;
    if (categorie && categorie !== post.categorie) {
      const category = await Category.findOne({ 
        $or: [{ slug: categorie }, { slug: subCategory }],
        isActive: true 
      }).select('_id').lean();

      if (!category) {
        return res.status(404).json({ msg: "Nouvelle catégorie non trouvée" });
      }
      categoryId = category._id;
    }

    // 🎯 Actualizar TODOS los campos (igual que createPost pero con update)
    const updatedData = {
      categorie: categorie || post.categorie,
      subCategory: subCategory || post.subCategory,
      articleType: articleType || post.articleType,
      category: categoryId,
      title: (title || post.title).trim(),
      description: (description || post.description).trim(),
      price: price ? parseFloat(price) : post.price,
      etat: etat || post.etat,
      wilaya: (wilaya || post.wilaya).toString().trim(),
      commune: (commune || post.commune).toString().trim(),
      address: (address || post.address).trim(),
      phone: (phone || post.phone).trim(),
      email: (email || post.email).trim().toLowerCase(),
      images: images || post.images,
      categorySpecificData: categorySpecificData || post.categorySpecificData
    };

    // 🎯 Actualizar el post (misma simplicidad)
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      updatedData,
      { new: true }
    ).populate('user', 'username avatar email');

    res.json({
      msg: 'Annonce modifiée!',
      updatedPost: {
        ...updatedPost._doc,
        user: req.user
      }
    });

  } catch (err) {
    console.error('UpdatePost error:', err.message);
    res.status(500).json({ msg: err.message });
  }
},
  // 📂 controllers/postCtrl.js
   
  getPostById : async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
        .populate('category', 'name slug level parent'); // 👈 aquí está la clave
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      res.json({ success: true, post });
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ error: error.message });
    }
  },
  

  
  getPost: async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        .populate("user likes", "avatar username")
        .populate({
            path: "comments",
            populate: {
                path: "user likes",
                select: "-password"
            }
        })

        if(!post) return res.status(400).json({msg: 'This post does not exist.'})

        res.json({
            post
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
},

  /**
   * 🔎 OBTENER POST POR ID (Alternativa)
   */
 

  /**
   * 👤 POSTS POR USUARIO
   */
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
      const userExists = await User.findById(id).select('_id username');
      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Query para posts del usuario
      const query = {
        user: new mongoose.Types.ObjectId(id),
        isActive: true
      };

      // Ejecutar búsqueda y conteo en paralelo
      const [posts, total] = await Promise.all([
        Post.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('user', 'username avatar')
          .populate('categoryRef', 'name slug emoji')
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
          username: userExists.username
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

  deletePost: async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        // 1. VERIFICAR SI EL USUARIO ES EL DUEÑO O ADMIN
        const post = await Posts.findById(postId);
        
        if (!post) {
            return res.status(404).json({msg: 'Post not found'});
        }

        if (post.user.toString() !== userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({msg: 'Not authorized to delete this post'});
        }

        console.log('🗑️ Eliminando post y sus imágenes:', post.images);

        // 2. BORRAR TODAS LAS IMÁGENES DEL POST DE CLOUDINARY
        if (post.images && post.images.length > 0) {
            for (const image of post.images) {
                if (image.public_id) {
                    try {
                        await cloudinary.uploader.destroy(image.public_id);
                        console.log('✅ Imagen borrada de Cloudinary:', image.public_id);
                    } catch (cloudinaryErr) {
                        console.error('❌ Error borrando imagen de Cloudinary:', image.public_id, cloudinaryErr);
                        // Continuar aunque falle una imagen
                    }
                }
            }
        }

        // 3. GUARDAR IDs DE COMMENTS Y LIKES ANTES DE ELIMINAR
        const commentsToDelete = post.comments || [];
        const likesToCleanup = post.likes || [];

        // 4. ELIMINAR EL POST DE MONGODB
        await Posts.findByIdAndDelete(postId);

        // 5. LIMPIAR DATOS RELACIONADOS
        if (commentsToDelete.length > 0) {
            await Comments.deleteMany({_id: {$in: commentsToDelete}});
        }

        // 6. OPCIONAL: Limpiar likes de usuarios
        if (likesToCleanup.length > 0) {
            await Users.updateMany(
                {_id: {$in: likesToCleanup}},
                {$pull: {likes: postId}}
            );
        }

        // 7. OPCIONAL: Eliminar de posts guardados
        await Users.updateMany(
            {saved: postId},
            {$pull: {saved: postId}}
        );

        res.json({
            msg: 'Post deleted successfully!',
            deletedPostId: postId,
            deletedImagesCount: post.images ? post.images.length : 0
        });

    } catch (err) {
        console.error('Error in deletePost:', err);
        return res.status(500).json({msg: err.message});
    }
},
  getFeaturedPosts: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 6;
      const posts = await Post.find({
        isActive: true,
        isPromoted: true
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('user', 'username avatar')
        .populate('categoryRef', 'name slug emoji')
        .lean();

      res.json({
        success: true,
        featuredPosts: posts
      });
    } catch (error) {
      console.error('Error en getFeaturedPosts:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener destacados',
        error: error.message
      });
    }
  },

  /**
   * 📅 POSTS RECIENTES
   */
  getRecentPosts: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const posts = await Post.find({
        isActive: true
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('title images price etat createdAt wilaya commune')
        .populate('user', 'username avatar')
        .populate('categoryRef', 'name slug emoji')
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
        message: 'Error al obtener posts recientes',
        error: error.message
      });
    }
  },

  /**
   * 🔍 BUSCAR POSTS
   */
  searchPosts: async (req, res) => {
    try {
      const { query } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const skip = (page - 1) * limit;

      const searchQuery = {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { categorie: { $regex: query, $options: 'i' } },
          { subCategory: { $regex: query, $options: 'i' } }
        ],
        isActive: true,
        status: 'active'
      };

      const [posts, total] = await Promise.all([
        Post.find(searchQuery)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .populate('user', 'username avatar')
          .populate('categoryRef', 'name slug')
          .lean(),
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
        },
        query
      });
    } catch (error) {
      console.error('Error en searchPosts:', error);
      res.status(500).json({
        success: false,
        message: 'Error en búsqueda',
        error: error.message
      });
    }
  },

  /**
   * 🛒 MARCAR COMO VENDIDO
   */
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
        {
          $set: {
            status: 'sold',
            soldAt: new Date()
          }
        },
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
        message: 'Error al marcar como vendido',
        error: error.message
      });
    }
  },

  /**
   * 🔍 POSTS SIMILARES
   */
/*  getSimilarPosts: async (req, res) => {
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
        isActive: true,
        status: 'active'
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
        .populate('user', 'username avatar')
        .populate('categoryRef', 'name slug')
        .sort({ isPromoted: -1, createdAt: -1 })
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
*/
  /**
   * 🩺 HEALTH CHECK
   */
  healthCheck: async (req, res) => {
    try {
      // Verificar conexión a MongoDB
      const dbStatus = mongoose.connection.readyState;
      const dbStatusText =
        dbStatus === 0 ? 'disconnected' :
          dbStatus === 1 ? 'connected' :
            dbStatus === 2 ? 'connecting' :
              dbStatus === 3 ? 'disconnecting' : 'unknown';

      res.json({
        success: true,
        message: 'API de posts funcionando correctamente',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
          status: dbStatusText,
          connected: dbStatus === 1
        },
        environment: process.env.NODE_ENV || 'development'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error en health check',
        error: error.message
      });
    }
  }
};

module.exports = postCtrl;