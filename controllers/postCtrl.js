 
const mongoose = require('mongoose');

const Posts = require('../models/postModel')
const Comments = require('../models/commentModel')
const Users = require('../models/userModel')
const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary
cloudinary.config({
    cloud_name: 'dfjipgj2o',
    api_key: '213981915435275',
    api_secret: 'wv_IiCM9zzhdiWDNXXo8HZi7wX4'
});
class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const postCtrl = {
// controllers/postCtrl.js - AGREGAR NUEVO MÉTODO

// Obtener todas las categorías disponibles dinámicamente
createPost: async (req, res) => {
    try {
        console.log('📥 Datos recibidos en createPost:', req.body);
        
        const { 
            categorie, 
            subCategory, 
            articleType,
            title,
            description,
            price,
            wilaya,
            commune,
            address,
            condition,
            categorySpecificData = {}, // AQUÍ recibe los campos dinámicos
            images 
        } = req.body;

        // Validaciones
        if(!images || images.length === 0) {
            return res.status(400).json({msg: "Please add at least one photo."});
        }
        
        if(!categorie) {
            return res.status(400).json({msg: "Category is required."});
        }

        // Preparar datos específicos
        const specificDataMap = new Map();
        if (categorySpecificData && typeof categorySpecificData === 'object') {
            Object.entries(categorySpecificData).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    specificDataMap.set(key, value);
                }
            });
        }

        // Crear nuevo post
        const newPost = new Posts({
            categorie,
            subCategory: subCategory || '',
            articleType: articleType || '',
            title: title || '',
            description: description || '',
            price: price || 0,
            categorySpecificData: specificDataMap,
            images,
            user: req.user._id,
            location: {
                wilaya: wilaya || '',
                commune: commune || '',
                address: address || ''
            },
            condition: condition || 'occasion',
            isActive: true
        });

        await newPost.save();
        
        // Populate para respuesta
        await newPost.populate("user", "avatar username");

        res.json({
            msg: 'Post created successfully!',
            newPost: {
                ...newPost._doc,
                user: req.user
            }
        });

    } catch (err) {
        console.error('❌ Error en createPost:', err);
        return res.status(500).json({msg: err.message});
    }
},

// 📌 OBTENER POSTS (corregido)
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
        return res.status(500).json({msg: err.message});
    }
},

 
getPostsByCategory: async (req, res) => {
    try {
        const { category } = req.params;
        const { page = 1, limit = 9 } = req.query;
        const skip = (page - 1) * limit;
        
        const query = { 
            categorie: category,
            isActive: true 
        };
        
        const [posts, total] = await Promise.all([
            Posts.find(query)
                .skip(skip)
                .limit(parseInt(limit))
                .sort('-createdAt')
                .populate("user", "avatar username"),
            Posts.countDocuments(query)
        ]);
        
        res.json({
            success: true,
            posts,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            hasMore: skip + posts.length < total
        });

    } catch (err) {
        console.error('❌ Error en getPostsByCategory:', err);
        return res.status(500).json({msg: err.message});
    }
},
 




// 📌 OBTENER TODAS LAS CATEGORÍAS (nuevo)
// backend/controllers/postCtrl.js - NUEVO CONTROLADOR
getAllCategoriesPaginated: async (req, res) => {
    console.log('🔍 === getAllCategoriesPaginated START ===');
    
    try {
        const { page = 1, limit = 2 } = req.query;
        const skip = (page - 1) * limit;
        
        console.log('📊 Parámetros recibidos:', { page, limit, skip });
        
        // ========== VALIDAR MODELOS ==========
        console.log('🔍 Verificando modelos...');
        
        // Verificar que Posts exista
        if (!Posts) {
            console.error('❌ CRITICAL: Posts model is undefined');
            console.error('   Verifica la importación: const Posts = require("../models/postModel")');
            return res.status(500).json({
                success: false,
                msg: 'Erreur de configuration - Modèle Posts non trouvé',
                errorCode: 'POSTS_MODEL_UNDEFINED'
            });
        }
        
        // Verificar que Store exista (si lo usas)
        let Store;
        try {
            Store = require('../models/storeModel');
            console.log('✅ Store model loaded successfully');
        } catch (storeError) {
            console.warn('⚠️ Store model not available:', storeError.message);
            Store = null;
        }
        
        // ========== OBTENER CATEGORÍAS DE POSTS ==========
        console.log('🔍 Obteniendo categorías de posts...');
        const postCategories = await Posts.aggregate([
            { $match: { isActive: true } },
            { $group: { 
                _id: "$categorie", 
                count: { $sum: 1 },
                type: { $first: "post" }
            }},
            { $sort: { count: -1 } }
        ]);
        
        console.log(`✅ Post categories found: ${postCategories.length}`);
        
        // ========== OBTENER CATEGORÍAS DE STORES ==========
        let storeCategories = [];
        let storeCount = 0;
        
        if (Store) {
            try {
                console.log('🔍 Obteniendo categorías de stores...');
                storeCategories = await Store.aggregate([
                    { $match: { isActive: true } },
                    { $group: { 
                        _id: "$category", 
                        count: { $sum: 1 },
                        type: { $first: "store" }
                    }},
                    { $sort: { count: -1 } }
                ]);
                
                storeCount = await Store.countDocuments({ isActive: true });
                console.log(`✅ Store categories found: ${storeCategories.length}`);
                console.log(`✅ Total stores: ${storeCount}`);
            } catch (storeAggError) {
                console.warn('⚠️ Error al obtener stores:', storeAggError.message);
            }
        }
        
        // ========== COMBINAR CATEGORÍAS ==========
        console.log('🔍 Combinando categorías...');
        
        const allCategories = [];
        
        // Agregar categoría "stores" solo si hay tiendas
        if (storeCount > 0) {
            allCategories.push({
                _id: 'stores',
                name: 'stores',
                displayName: 'Boutiques',
                count: storeCount,
                type: 'store_category',
                emoji: '🏪'
            });
        }
        
        // Agregar categorías de posts
        postCategories.forEach(cat => {
            allCategories.push({
                ...cat,
                name: cat._id,
                type: 'post'
            });
        });
        
        // Agregar categorías de stores (para filtrado interno)
        if (storeCategories.length > 0) {
            storeCategories.forEach(cat => {
                allCategories.push({
                    ...cat,
                    name: cat._id,
                    type: 'store_subcategory'
                });
            });
        }
        
        console.log(`✅ Total categories combined: ${allCategories.length}`);
        
        // ========== AGREGAR EMOJIS ==========
        const categoryEmojis = {
            'stores': '🏪',
            'vehicules': '🚗',
            'immobilier': '🏠',
            'informatique': '💻',
            'vetements': '👕',
            'telephones': '📱',
            'services': '🛠️',
            'electromenager': '🔌',
            'piecesDetachees': '⚙️',
            'alimentaires': '🍎',
            'santebeaute': '💄',
            'meubles': '🛋️',
            'materiaux': '🧱',
            'loisirs': '🎮',
            'emploi': '💼',
            'sport': '⚽',
            'voyages': '✈️'
        };
        
        const categoriesWithEmojis = allCategories.map(cat => ({
            id: cat._id,
            name: cat.name,
            displayName: cat.displayName || cat.name,
            count: cat.count || 0,
            emoji: categoryEmojis[cat._id] || (cat.type === 'store_category' ? '🏪' : '📦'),
            type: cat.type || 'post'
        }));
        
        // ========== PAGINACIÓN ==========
        const totalCategories = categoriesWithEmojis.length;
        const paginatedCategories = categoriesWithEmojis.slice(skip, skip + parseInt(limit));
        
        console.log('📊 Resultado paginación:', {
            total: totalCategories,
            page: parseInt(page),
            limit: parseInt(limit),
            returned: paginatedCategories.length,
            hasMore: skip + paginatedCategories.length < totalCategories
        });
        
        console.log('✅ === getAllCategoriesPaginated SUCCESS ===');
        
        res.json({
            success: true,
            categories: paginatedCategories,
            page: parseInt(page),
            total: totalCategories,
            totalPages: Math.ceil(totalCategories / limit),
            hasMore: skip + paginatedCategories.length < totalCategories
        });

    } catch (err) {
        console.error('❌ === getAllCategoriesPaginated ERROR ===');
        console.error('❌ Error message:', err.message);
        console.error('❌ Error stack:', err.stack);
        
        // Información adicional para debug
        console.error('❌ Additional info:');
        console.error('   - Posts model:', Posts ? 'Defined' : 'Undefined');
        console.error('   - Error type:', err.name);
        
        // Respuesta de error más informativa
        return res.status(500).json({
            success: false,
            msg: 'Erreur interne du serveur lors du chargement des catégories',
            error: process.env.NODE_ENV === 'development' ? {
                message: err.message,
                stack: err.stack,
                name: err.name
            } : undefined,
            timestamp: new Date().toISOString()
        });
    }
},
 getPostsBySubcategory :async (req, res) => {
    try {
        const { category, subcategory } = req.params;
        const { page = 1, limit = 9 } = req.query;
        const skip = (page - 1) * limit;
        
        console.log(`🔍 Buscando posts: ${category}/${subcategory}, página ${page}`);
        
        const query = { 
            categorie: category,
            subCategory: subcategory,
            isActive: true 
        };
        
        const [posts, total] = await Promise.all([
            Posts.find(query)
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ isPromoted: -1, isUrgent: -1, createdAt: -1 })
                .populate("user", "avatar username"),
            Posts.countDocuments(query)
        ]);
        
        res.json({
            success: true,
            posts,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            hasMore: skip + posts.length < total
        });

    } catch (err) {
        console.error('❌ Error en getPostsBySubcategory:', err);
        return res.status(500).json({msg: err.message});
    }
},

// 📌 OBTENER SUBCATEGORÍAS DE UNA CATEGORÍA (NUEVO)
 getSubCategoriesByCategory :async (req, res) => {
    try {
        const { category } = req.params;
        
        // Buscar todas las subcategorías únicas para esta categoría
        const subcategories = await Posts.aggregate([
            { 
                $match: { 
                    categorie: category,
                    subCategory: { $exists: true, $ne: "" }
                } 
            },
            { 
                $group: { 
                    _id: "$subCategory",
                    count: { $sum: 1 }
                } 
            },
            { $sort: { count: -1 } }
        ]);
        
        res.json({
            success: true,
            subcategories: subcategories.map(sub => ({
                id: sub._id,
                name: sub._id,
                count: sub.count
            }))
        });

    } catch (err) {
        console.error('❌ Error en getSubCategoriesByCategory:', err);
        return res.status(500).json({msg: err.message});
    }
},
// backend/controllers/postCtrl.js
// backend/controllers/postCtrl.js
getPostsByImmobilierOperation: async (req, res) => {
    try {
        const { operationId } = req.params;
        const { page = 1, limit = 9 } = req.query;
        const skip = (page - 1) * limit;
        
        console.log(`🔍 Buscando posts de immobiler: operación ${operationId}`);
        
        // Buscar posts con operationType = operationId
        const query = { 
            categorie: 'immobilier',
            operationType: operationId, // ¡Nuevo campo necesario!
            isActive: true 
        };
        
        const [posts, total] = await Promise.all([
            Posts.find(query)
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ isPromoted: -1, isUrgent: -1, createdAt: -1 })
                .populate("user", "avatar username"),
            Posts.countDocuments(query)
        ]);
        
        res.json({
            success: true,
            posts,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
            hasMore: skip + posts.length < total
        });

    } catch (err) {
        console.error('❌ Error en getPostsByImmobilierOperation:', err);
        return res.status(500).json({msg: err.message});
    }
},
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
      
      // Validación mejorada
      if (!categorie || !subCategory) {
        return res.status(400).json({ 
          success: false,
          message: 'Se requiere categorie y subCategory' 
        });
      }
  
      // Importar el modelo CORRECTAMENTE
      
      
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
      const posts = await Posts.find(query)
        .populate('user', 'name avatar')
        .populate('likes', '_id name')
        .sort({ isPromoted: -1, isUrgent: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit));
      
      const total = await Posts.countDocuments(query);
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
      console.error('❌ getSimilarPosts error completo:', error);
      res.status(500).json({ 
        success: false,
        message: 'Error del servidor', 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },

 getPosts : async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 9, 
            category, 
            subcategory,  // ← NUEVO PARÁMETRO
            ...filters 
        } = req.query;
        
        const skip = (page - 1) * limit;
        
        // Construir query base
        let query = { isActive: true };
        
        // Filtrar por categoría
        if (category && category !== 'all') {
            query.categorie = category;
        }
        
        // Filtrar por subcategoría (NUEVO)
        if (subcategory && subcategory !== 'all') {
            query.subCategory = subcategory;
        }
        
        // Aplicar otros filtros del categorySpecificData
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value && key.startsWith('spec_')) {
                    const field = key.replace('spec_', '');
                    query[`categorySpecificData.${field}`] = value;
                }
            });
        }
        
        console.log('🔍 Query final:', query);
        
        // Obtener posts
        const posts = await Posts.find(query)
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ isPromoted: -1, isUrgent: -1, createdAt: -1 })
            .populate("user", "avatar username");
        
        // Contar total
        const total = await Posts.countDocuments(query);
        
        res.json({
            success: true,
            result: posts.length,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            hasMore: skip + posts.length < total,
            posts
        });

    } catch (err) {
        console.error('❌ Error en getPosts:', err);
        return res.status(500).json({msg: err.message});
    }
},


  updatePost: async (req, res) => {
    try {
      const { postData, images } = req.body;
      
      // 1. Obtener el post actual
      const oldPost = await Posts.findById(req.params.id);
      if (!oldPost) {
        return res.status(400).json({msg: "Ce post n'existe pas."});
      }
      
      // 2. Separar campos base de campos específicos
      const commonFields = [
        'categorie', 'subCategory', 'articleType',
        'title', 'description', 'price',
        'wilaya', 'commune', 'numeroTelephone',
      ];
      
      const updateData = {};
      const specificData = {};
      
      Object.keys(postData).forEach(key => {
        if (commonFields.includes(key)) {
          updateData[key] = postData[key];
        } else {
          specificData[key] = postData[key];
        }
      });
      
      // 3. Añadir categorySpecificData al updateData
      if (Object.keys(specificData).length > 0) {
        updateData.categorySpecificData = specificData;
      }
      
      // 4. Añadir imágenes
      updateData.images = images || postData.images;
      
      console.log('🔄 Datos para actualizar:', {
        updateData,
        specificDataKeys: Object.keys(specificData)
      });
      
      // 5. Actualizar en MongoDB
      const post = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        { $set: updateData },
        { new: true, runValidators: true }
      );
      
      // 6. Populate
      await post.populate('user', 'avatar username');
      
      res.json({
        msg: 'Post modifié avec succès!',
        newPost: post
      });
      
    } catch (err) {
      console.error('Error en updatePost:', err);
      return res.status(500).json({msg: err.message});
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
getUserPosts: async (req, res) => {
    try {
        const features = new APIfeatures(Posts.find({user: req.params.id}), req.query)
        .paginating()
        const posts = await features.query.sort("-createdAt")

        res.json({
            posts,
            result: posts.length
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
},
getPost: async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
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
getPostsDicover: async (req, res) => {
    try {

        const newArr = [...req.user.following, req.user._id]

        const num  = req.query.num || 9

        const posts = await Posts.aggregate([
            { $match: { user : { $nin: newArr } } },
            { $sample: { size: Number(num) } },
        ])

        return res.json({
            msg: 'Success!',
            result: posts.length,
            posts
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
},
 
savePost: async (req, res) => {
    try {
        const user = await Users.find({_id: req.user._id, saved: req.params.id})
        if(user.length > 0) return res.status(400).json({msg: "You saved this post."})

        const save = await Users.findOneAndUpdate({_id: req.user._id}, {
            $push: {saved: req.params.id}
        }, {new: true})

        if(!save) return res.status(400).json({msg: 'This user does not exist.'})

        res.json({msg: 'Saved Post!'})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
},
unSavePost: async (req, res) => {
    try {
        const save = await Users.findOneAndUpdate({_id: req.user._id}, {
            $pull: {saved: req.params.id}
        }, {new: true})

        if(!save) return res.status(400).json({msg: 'This user does not exist.'})

        res.json({msg: 'unSaved Post!'})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
},
getSavePosts: async (req, res) => {
    try {
        const features = new APIfeatures(Posts.find({
            _id: {$in: req.user.saved}
        }), req.query).paginating()

        const savePosts = await features.query.sort("-createdAt")

        res.json({
            savePosts,
            result: savePosts.length
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
},


}

module.exports = postCtrl