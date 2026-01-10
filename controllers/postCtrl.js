const mongoose = require('mongoose');
const Posts = require('../models/postModel');
const Comments = require('../models/commentModel');
const Users = require('../models/userModel');
const Boutique = require('../models/boutiqueModel'); // <-- NUEVO: Modelo Boutique
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
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 9;
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

const postCtrl = {
    // 📌 CREAR POST (actualizado con soporte para boutiques)
    createPost: async (req, res) => {
        try {
            console.log('📥 Datos recibidos en createPost:', req.body);
            
            const { 
                categorie, 
                subCategory, 
                articleType,
               // title,
                description,
                price,
                wilaya,
                commune,
                address,
                condition,
                boutiqueId, // <-- NUEVO: ID de la boutique (opcional)
                categorySpecificData = {},
                images 
            } = req.body;

            // Validaciones
            if(!images || images.length === 0) {
                return res.status(400).json({msg: "Please add at least one photo."});
            }
            
            if(!categorie) {
                return res.status(400).json({msg: "Category is required."});
            }

            // 🔥 VALIDAR BOUTIQUE SI SE PROPORCIONA
            let boutiqueRef = null;
            if (boutiqueId) {
                try {
                    const boutique = await Boutique.findOne({
                        _id: boutiqueId,
                        user: req.user._id, // Solo puede usar sus propias boutiques
                        status: 'active',
                        isActive: true
                    });
                    
                    if (boutique) {
                        boutiqueRef = boutique._id;
                        console.log(`✅ Post asociado a boutique: ${boutique.nom_boutique}`);
                    } else {
                        console.log(`⚠️ Boutique no encontrada o no activa: ${boutiqueId}`);
                    }
                } catch (boutiqueErr) {
                    console.error('❌ Error al buscar boutique:', boutiqueErr);
                    // Continuar sin boutique si hay error
                }
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
               // title: title || '',
                description: description || '',
                price: price || 0,
                boutique: boutiqueRef, // <-- REFERENCIA A BOUTIQUE
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
            
            // 🔥 ACTUALIZAR CONTADOR DE BOUTIQUE SI TIENE
            if (boutiqueRef) {
                try {
                    await Boutique.findByIdAndUpdate(boutiqueRef, {
                        $inc: { produits_count: 1 }
                    });
                    console.log(`✅ Contador de boutique ${boutiqueRef} incrementado`);
                } catch (updateErr) {
                    console.error('❌ Error al actualizar contador de boutique:', updateErr);
                    // No fallar el post por esto
                }
            }
            
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

    // 📌 OBTENER POSTS (actualizado con filtro de boutique)
    getPosts: async (req, res) => {
        try {
            const { 
                page = 1, 
                limit = 9, 
                category, 
                subcategory,
                boutiqueId // <-- NUEVO: Filtrar por boutique
            } = req.query;
            
            const skip = (page - 1) * limit;
            
            // Construir query
            let query = { isActive: true };
            
            // Filtrar por categoría
            if (category && category !== 'all') {
                query.categorie = category;
            }
            
            // Filtrar por subcategoría
            if (subcategory && subcategory !== 'all') {
                query.subCategory = subcategory;
            }
            
            // 🔥 FILTRAR POR BOUTIQUE
            if (boutiqueId && boutiqueId !== 'all') {
                // Verificar que la boutique exista y esté activa
                const boutique = await Boutique.findOne({
                    _id: boutiqueId,
                    isActive: true
                });
                
                if (boutique) {
                    query.boutique = boutiqueId;
                } else {
                    return res.status(404).json({
                        success: false,
                        msg: 'Boutique non trouvée ou inactive'
                    });
                }
            }
            
            // Obtener posts
            const posts = await Posts.find(query)
                .skip(skip)
                .limit(parseInt(limit))
                .sort({ isPromoted: -1, isUrgent: -1, createdAt: -1 })
                .populate("user", "avatar username")
                .populate("boutique", "nom_boutique logo"); // <-- Populate de boutique
            
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

    // 📌 OBTENER POSTS POR CATEGORÍA
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
                    .populate("user", "avatar username")
                    .populate("boutique", "nom_boutique logo"), // <-- Populate de boutique
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

    // 📌 OBTENER TODAS LAS CATEGORÍAS PAGINADAS
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
                return res.status(500).json({
                    success: false,
                    msg: 'Erreur de configuration - Modèle Posts non trouvé',
                    errorCode: 'POSTS_MODEL_UNDEFINED'
                });
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
            
            // ========== OBTENER CONTADOR DE BOUTIQUES ==========
            let boutiqueCount = 0;
            try {
                boutiqueCount = await Boutique.countDocuments({ 
                    status: 'active',
                    isActive: true 
                });
                console.log(`✅ Total boutiques activas: ${boutiqueCount}`);
            } catch (boutiqueErr) {
                console.warn('⚠️ Error al contar boutiques:', boutiqueErr.message);
            }
            
            // ========== COMBINAR CATEGORÍAS ==========
            console.log('🔍 Combinando categorías...');
            
            const allCategories = [];
            
            // Agregar categoría "boutiques" solo si hay boutiques
            if (boutiqueCount > 0) {
                allCategories.push({
                    _id: 'boutiques',
                    name: 'boutiques',
                    displayName: 'Boutiques',
                    count: boutiqueCount,
                    type: 'boutique_category',
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
            
            console.log(`✅ Total categories combined: ${allCategories.length}`);
            
            // ========== AGREGAR EMOJIS ==========
            const categoryEmojis = {
                'boutiques': '🏪',
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
                emoji: categoryEmojis[cat._id] || (cat.type === 'boutique_category' ? '🏪' : '📦'),
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

    // 📌 OBTENER POSTS POR SUBCATEGORÍA
    getPostsBySubcategory: async (req, res) => {
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
                    .populate("user", "avatar username")
                    .populate("boutique", "nom_boutique logo"), // <-- Populate de boutique
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

    // 📌 OBTENER SUBCATEGORÍAS DE UNA CATEGORÍA
    getSubCategoriesByCategory: async (req, res) => {
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

    // 📌 OBTENER POSTS POR OPERACIÓN DE INMOBILIARIO
    getPostsByImmobilierOperation: async (req, res) => {
        try {
            const { operationId } = req.params;
            const { page = 1, limit = 9 } = req.query;
            const skip = (page - 1) * limit;
            
            console.log(`🔍 Buscando posts de immobiler: operación ${operationId}`);
            
            // Buscar posts con operationType = operationId
            const query = { 
                categorie: 'immobilier',
                operationType: operationId,
                isActive: true 
            };
            
            const [posts, total] = await Promise.all([
                Posts.find(query)
                    .skip(skip)
                    .limit(parseInt(limit))
                    .sort({ isPromoted: -1, isUrgent: -1, createdAt: -1 })
                    .populate("user", "avatar username")
                    .populate("boutique", "nom_boutique logo"), // <-- Populate de boutique
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

    // 📌 OBTENER POSTS SIMILARES
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
            const posts = await Posts.find(query)
                .populate('user', 'name avatar')
                .populate('boutique', 'nom_boutique logo') // <-- Populate de boutique
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

    // 📌 ACTUALIZAR POST
    updatePost: async (req, res) => {
        try {
            const { postData, images, boutiqueId } = req.body; // <-- NUEVO: boutiqueId en update
            
            // 1. Obtener el post actual
            const oldPost = await Posts.findById(req.params.id);
            if (!oldPost) {
                return res.status(400).json({msg: "Ce post n'existe pas."});
            }
            
            // 🔥 VALIDAR Y ACTUALIZAR BOUTIQUE SI SE PROPORCIONA
            let boutiqueRef = oldPost.boutique;
            if (boutiqueId !== undefined) {
                if (boutiqueId === null || boutiqueId === '') {
                    // Quitar referencia a boutique
                    boutiqueRef = null;
                    console.log('🗑️ Eliminando referencia a boutique del post');
                } else {
                    // Validar nueva boutique
                    const boutique = await Boutique.findOne({
                        _id: boutiqueId,
                        user: req.user._id,
                        status: 'active',
                        isActive: true
                    });
                    
                    if (boutique) {
                        boutiqueRef = boutique._id;
                        console.log(`✅ Post actualizado a boutique: ${boutique.nom_boutique}`);
                    } else {
                        console.log(`⚠️ Boutique no válida: ${boutiqueId}`);
                    }
                }
            }
            
            // 2. Separar campos base de campos específicos
            const commonFields = [
                'categorie', 'subCategory', 'articleType',
                  'description', 'price',
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
            
            // 3. Agregar boutique al update
            updateData.boutique = boutiqueRef;
            
            // 4. Añadir categorySpecificData al updateData
            if (Object.keys(specificData).length > 0) {
                updateData.categorySpecificData = specificData;
            }
            
            // 5. Añadir imágenes
            updateData.images = images || postData.images;
            
            console.log('🔄 Datos para actualizar:', {
                updateData,
                boutiqueRef,
                specificDataKeys: Object.keys(specificData)
            });
            
            // 6. Actualizar en MongoDB
            const post = await Posts.findOneAndUpdate(
                { _id: req.params.id },
                { $set: updateData },
                { new: true, runValidators: true }
            );
            
            // 7. ACTUALIZAR CONTADORES DE BOUTIQUE SI CAMBIÓ
            if (oldPost.boutique && oldPost.boutique.toString() !== boutiqueRef.toString()) {
                try {
                    // Decrementar contador de boutique anterior
                    await Boutique.findByIdAndUpdate(oldPost.boutique, {
                        $inc: { produits_count: -1 }
                    });
                    console.log(`✅ Contador decrementado para boutique anterior: ${oldPost.boutique}`);
                    
                    // Incrementar contador de nueva boutique
                    if (boutiqueRef) {
                        await Boutique.findByIdAndUpdate(boutiqueRef, {
                            $inc: { produits_count: 1 }
                        });
                        console.log(`✅ Contador incrementado para nueva boutique: ${boutiqueRef}`);
                    }
                } catch (counterErr) {
                    console.error('❌ Error al actualizar contadores de boutique:', counterErr);
                }
            }
            
            // 8. Populate
            await post.populate('user', 'avatar username');
            await post.populate('boutique', 'nom_boutique logo');
            
            res.json({
                msg: 'Post modifié avec succès!',
                newPost: post
            });
            
        } catch (err) {
            console.error('Error en updatePost:', err);
            return res.status(500).json({msg: err.message});
        }
    },

    // 📌 ELIMINAR POST
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

            // 2. DECREMENTAR CONTADOR DE BOUTIQUE SI TIENE
            if (post.boutique) {
                try {
                    await Boutique.findByIdAndUpdate(post.boutique, {
                        $inc: { produits_count: -1 }
                    });
                    console.log(`✅ Contador de boutique ${post.boutique} decrementado`);
                } catch (boutiqueErr) {
                    console.error('❌ Error al actualizar contador de boutique:', boutiqueErr);
                }
            }

            // 3. BORRAR TODAS LAS IMÁGENES DEL POST DE CLOUDINARY
            if (post.images && post.images.length > 0) {
                for (const image of post.images) {
                    if (image.public_id) {
                        try {
                            await cloudinary.uploader.destroy(image.public_id);
                            console.log('✅ Imagen borrada de Cloudinary:', image.public_id);
                        } catch (cloudinaryErr) {
                            console.error('❌ Error borrando imagen de Cloudinary:', image.public_id, cloudinaryErr);
                        }
                    }
                }
            }

            // 4. GUARDAR IDs DE COMMENTS Y LIKES ANTES DE ELIMINAR
            const commentsToDelete = post.comments || [];
            const likesToCleanup = post.likes || [];

            // 5. ELIMINAR EL POST DE MONGODB
            await Posts.findByIdAndDelete(postId);

            // 6. LIMPIAR DATOS RELACIONADOS
            if (commentsToDelete.length > 0) {
                await Comments.deleteMany({_id: {$in: commentsToDelete}});
            }

            // 7. OPCIONAL: Limpiar likes de usuarios
            if (likesToCleanup.length > 0) {
                await Users.updateMany(
                    {_id: {$in: likesToCleanup}},
                    {$pull: {likes: postId}}
                );
            }

            // 8. OPCIONAL: Eliminar de posts guardados
            await Users.updateMany(
                {saved: postId},
                {$pull: {saved: postId}}
            );

            res.json({
                msg: 'Post deleted successfully!',
                deletedPostId: postId,
                deletedImagesCount: post.images ? post.images.length : 0,
                boutiqueUpdated: !!post.boutique
            });

        } catch (err) {
            console.error('Error in deletePost:', err);
            return res.status(500).json({msg: err.message});
        }
    },

    // 📌 OBTENER POSTS DE USUARIO
    getUserPosts: async (req, res) => {
        try {
            const features = new APIfeatures(
                Posts.find({user: req.params.id})
                    .populate('boutique', 'nom_boutique logo'), // <-- Populate de boutique
                req.query
            ).paginating();
            
            const posts = await features.query.sort("-createdAt");

            res.json({
                posts,
                result: posts.length
            });

        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },

    // 📌 OBTENER POST POR ID
   /* getPost: async (req, res) => {
        try {
            const post = await Posts.findById(req.params.id)
                .populate("user likes", "avatar username")
                .populate("boutique", "nom_boutique logo description_boutique") // <-- Populate de boutique
                .populate({
                    path: "comments",
                    populate: {
                        path: "user likes",
                        select: "-password"
                    }
                });

            if(!post) return res.status(400).json({msg: 'This post does not exist.'});

            // 🔥 INCREMENTAR VISTAS SI ES BOUTIQUE
            if (post.boutique) {
                try {
                    await Boutique.findByIdAndUpdate(post.boutique._id, {
                        $inc: { vues: 1 }
                    });
                } catch (boutiqueErr) {
                    console.error('Error al incrementar vistas de boutique:', boutiqueErr);
                }
            }

            res.json({
                post
            });

        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },
*/

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





    // 📌 OBTENER POSTS DESCUBRIR
    getPostsDicover: async (req, res) => {
        try {
            const newArr = [...req.user.following, req.user._id];
            const num = req.query.num || 9;

            const posts = await Posts.aggregate([
                { $match: { user: { $nin: newArr } } },
                { $sample: { size: Number(num) } },
            ]);

            // Populate boutique después del aggregate
            await Posts.populate(posts, {
                path: 'boutique',
                select: 'nom_boutique logo'
            });

            return res.json({
                msg: 'Success!',
                result: posts.length,
                posts
            });

        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },

    // 📌 GUARDAR POST
    savePost: async (req, res) => {
        try {
            const user = await Users.find({_id: req.user._id, saved: req.params.id});
            if(user.length > 0) return res.status(400).json({msg: "You saved this post."});

            const save = await Users.findOneAndUpdate({_id: req.user._id}, {
                $push: {saved: req.params.id}
            }, {new: true});

            if(!save) return res.status(400).json({msg: 'This user does not exist.'});

            res.json({msg: 'Saved Post!'});

        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },

    // 📌 QUITAR POST GUARDADO
    unSavePost: async (req, res) => {
        try {
            const save = await Users.findOneAndUpdate({_id: req.user._id}, {
                $pull: {saved: req.params.id}
            }, {new: true});

            if(!save) return res.status(400).json({msg: 'This user does not exist.'});

            res.json({msg: 'unSaved Post!'});

        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },

    // 📌 OBTENER POSTS GUARDADOS
    getSavePosts: async (req, res) => {
        try {
            const features = new APIfeatures(
                Posts.find({
                    _id: {$in: req.user.saved}
                }).populate('boutique', 'nom_boutique logo'), // <-- Populate de boutique
                req.query
            ).paginating();

            const savePosts = await features.query.sort("-createdAt");

            res.json({
                savePosts,
                result: savePosts.length
            });

        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },

    // 🔥 NUEVO: OBTENER POSTS DE UNA BOUTIQUE ESPECÍFICA
    getPostsByBoutique: async (req, res) => {
        try {
            const { boutiqueId } = req.params;
            const { page = 1, limit = 12 } = req.query;
            const skip = (page - 1) * limit;
            
            // Verificar que la boutique existe
            const boutique = await Boutique.findOne({
                _id: boutiqueId,
                isActive: true
            });
            
            if (!boutique) {
                return res.status(404).json({
                    success: false,
                    msg: 'Boutique non trouvée'
                });
            }
            
            // Obtener posts de la boutique
            const posts = await Posts.find({
                boutique: boutiqueId,
                isActive: true
            })
            .populate('user', 'avatar username')
            .sort({ isPromoted: -1, isUrgent: -1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));
            
            const total = await Posts.countDocuments({
                boutique: boutiqueId,
                isActive: true
            });
            
            res.json({
                success: true,
                boutique: {
                    _id: boutique._id,
                    nom_boutique: boutique.nom_boutique,
                    logo: boutique.logo,
                    description_boutique: boutique.description_boutique
                },
                posts,
                total,
                page: parseInt(page),
                totalPages: Math.ceil(total / limit),
                hasMore: skip + posts.length < total
            });
            
        } catch (err) {
            console.error('❌ Error en getPostsByBoutique:', err);
            return res.status(500).json({ msg: err.message });
        }
    },

    // 🔥 NUEVO: OBTENER BOUTIQUES ACTIVAS DEL USUARIO
    getUserBoutiques: async (req, res) => {
        try {
            const userId = req.user._id;
            
            const boutiques = await Boutique.find({
                user: userId,
                isActive: true
            })
            .sort({ createdAt: -1 });
            
            res.json({
                success: true,
                boutiques,
                count: boutiques.length
            });
            
        } catch (err) {
            console.error('❌ Error en getUserBoutiques:', err);
            return res.status(500).json({ msg: err.message });
        }
    }
};

module.exports = postCtrl;