// controllers/postCategoryCtrl.js
const mongoose = require('mongoose');
const Posts = require('../models/postModel');

const postCategoryCtrl = {
    // ========== OBTENER TODAS LAS CATEGORÍAS PAGINADAS ==========
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

    // ========== OBTENER POSTS POR CATEGORÍA ==========
    getPostsByCategory: async (req, res) => {
        try {
            const { category } = req.params;
            const { page = 1, limit = 12 } = req.query;
            const skip = (page - 1) * limit;
            
            const query = { 
                categorie: category,
                isActive: true 
            };
            
            const [posts, total] = await Promise.all([
                Posts.find(query)
                    .sort({ isPromoted: -1, isUrgent: -1, createdAt: -1 })
                    .skip(skip)
                    .limit(parseInt(limit))
                    .populate('user', 'username avatar'),
                Posts.countDocuments(query)
            ]);
            
            // Obtener subcategorías para esta categoría
            const subcategories = await Posts.aggregate([
                { $match: { 
                    categorie: category,
                    subCategory: { $exists: true, $ne: "" },
                    isActive: true 
                }},
                { $group: { 
                    _id: "$subCategory",
                    count: { $sum: 1 }
                }},
                { $sort: { count: -1 } }
            ]);

            res.json({
                success: true,
                posts,
                total,
                pages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                hasMore: skip + posts.length < total,
                category: {
                    name: category,
                    subcategories: subcategories.map(sub => ({
                        name: sub._id,
                        slug: sub._id.toLowerCase().replace(/\s+/g, '-'),
                        count: sub.count
                    }))
                }
            });

        } catch (err) {
            console.error('❌ Error en getPostsByCategory:', err);
            return res.status(500).json({msg: err.message});
        }
    },

    // ========== OBTENER POSTS POR SUBCATEGORÍA ==========
    getPostsBySubcategory: async (req, res) => {
        try {
            const { category, subcategory } = req.params;
            const { page = 1, limit = 12 } = req.query;
            const skip = (page - 1) * limit;
            
            const query = { 
                categorie: category,
                subCategory: subcategory,
                isActive: true 
            };
            
            const [posts, total] = await Promise.all([
                Posts.find(query)
                    .sort({ isPromoted: -1, isUrgent: -1, createdAt: -1 })
                    .skip(skip)
                    .limit(parseInt(limit))
                    .populate('user', 'username avatar'),
                Posts.countDocuments(query)
            ]);

            res.json({
                success: true,
                posts,
                total,
                pages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                hasMore: skip + posts.length < total,
                category: category,
                subcategory: subcategory
            });

        } catch (err) {
            console.error('❌ Error en getPostsBySubcategory:', err);
            return res.status(500).json({msg: err.message});
        }
    },

    // ========== OBTENER SUBCATEGORÍAS DE UNA CATEGORÍA ==========
    getSubCategoriesByCategory: async (req, res) => {
        try {
            const { category } = req.params;
            
            // Obtener subcategorías únicas con conteo
            const subcategories = await Posts.aggregate([
                { $match: { 
                    categorie: category,
                    subCategory: { $exists: true, $ne: "" },
                    isActive: true 
                }},
                { $group: { 
                    _id: "$subCategory",
                    count: { $sum: 1 }
                }},
                { $sort: { count: -1 } }
            ]);

            res.json({
                success: true,
                category,
                subcategories: subcategories.map(sub => ({
                    name: sub._id,
                    slug: sub._id.toLowerCase().replace(/\s+/g, '-'),
                    count: sub.count
                })),
                total: subcategories.length
            });

        } catch (err) {
            console.error('❌ Error en getSubCategoriesByCategory:', err);
            return res.status(500).json({msg: err.message});
        }
    },

    // ========== OBTENER JERARQUÍA DE CATEGORÍAS ==========
    getCategoriesHierarchy: async (req, res) => {
        try {
            // Obtener todas las combinaciones categorie + subCategory
            const categories = await Posts.aggregate([
                { $match: { isActive: true } },
                { $group: {
                    _id: {
                        categorie: "$categorie",
                        subCategory: "$subCategory"
                    },
                    count: { $sum: 1 }
                }},
                { $sort: { '_id.categorie': 1, '_id.subCategory': 1 } }
            ]);

            // Organizar en estructura jerárquica
            const hierarchy = {};
            
            categories.forEach(item => {
                const categorie = item._id.categorie;
                const subCategory = item._id.subCategory;
                
                if (!hierarchy[categorie]) {
                    hierarchy[categorie] = {
                        name: categorie,
                        count: 0,
                        children: {}
                    };
                }
                
                hierarchy[categorie].count += item.count;
                
                if (subCategory && subCategory !== '') {
                    if (!hierarchy[categorie].children[subCategory]) {
                        hierarchy[categorie].children[subCategory] = {
                            name: subCategory,
                            count: 0
                        };
                    }
                    
                    hierarchy[categorie].children[subCategory].count += item.count;
                }
            });

            // Convertir a arrays
            const result = Object.values(hierarchy).map(cat => ({
                name: cat.name,
                slug: cat.name.toLowerCase().replace(/\s+/g, '-'),
                count: cat.count,
                children: Object.values(cat.children).map(sub => ({
                    name: sub.name,
                    slug: sub.name.toLowerCase().replace(/\s+/g, '-'),
                    count: sub.count
                }))
            }));

            res.json({
                success: true,
                hierarchy: result,
                totalCategories: result.length
            });

        } catch (err) {
            console.error('❌ Error en getCategoriesHierarchy:', err);
            return res.status(500).json({msg: err.message});
        }
    },

    // ========== OBTENER POSTS POR JERARQUÍA ==========
    getPostsByCategoryHierarchy: async (req, res) => {
        try {
            const { level1, level2, level3 } = req.params;
            const { page = 1, limit = 12 } = req.query;
            const skip = (page - 1) * limit;

            let query = { isActive: true };
            let currentLevel = 1;
            
            // Construir query según los niveles
            if (level1) {
                query.categorie = level1;
                currentLevel = 1;
            }
            
            if (level2) {
                query.subCategory = level2;
                currentLevel = 2;
            }
            
            // Nota: level3 no se usa directamente ya que solo tenemos categorie y subCategory
            // Si necesitas un tercer nivel, podría ser articleType o un campo en categorySpecificData

            const [posts, total] = await Promise.all([
                Posts.find(query)
                    .sort({ isPromoted: -1, isUrgent: -1, createdAt: -1 })
                    .skip(skip)
                    .limit(parseInt(limit))
                    .populate('user', 'username avatar'),
                Posts.countDocuments(query)
            ]);

            // Obtener subniveles disponibles
            let sublevels = [];
            
            if (currentLevel === 1 && level1) {
                // Si estamos en nivel 1, obtener todas las subcategorías únicas
                sublevels = await Posts.distinct('subCategory', {
                    categorie: level1,
                    isActive: true,
                    subCategory: { $exists: true, $ne: "" }
                });
            }

            res.json({
                success: true,
                posts,
                total,
                pages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                currentLevel,
                hasMore: skip + posts.length < total,
                sublevels: sublevels.map(name => ({
                    name,
                    slug: name.toLowerCase().replace(/\s+/g, '-'),
                    count: 0 // Podrías agregar conteo aquí si lo necesitas
                }))
            });

        } catch (err) {
            console.error('❌ Error en getPostsByCategoryHierarchy:', err);
            return res.status(500).json({msg: err.message});
        }
    },

    // ========== OBTENER POSTS POR OPERACIÓN DE INMOBILIARIA ==========
    getPostsByImmobilierOperation: async (req, res) => {
        try {
            const { operationId } = req.params;
            const { page = 1, limit = 12 } = req.query;
            const skip = (page - 1) * limit;
            
            // Buscar posts de inmobiliaria con operationType en categorySpecificData
            const query = { 
                categorie: 'immobilier',
                'categorySpecificData.operationType': operationId,
                isActive: true 
            };
            
            const [posts, total] = await Promise.all([
                Posts.find(query)
                    .skip(skip)
                    .limit(parseInt(limit))
                    .sort({ isPromoted: -1, isUrgent: -1, createdAt: -1 })
                    .populate('user', 'username avatar'),
                Posts.countDocuments(query)
            ]);
            
            res.json({
                success: true,
                posts,
                total,
                page: parseInt(page),
                totalPages: Math.ceil(total / limit),
                hasMore: skip + posts.length < total,
                operationType: operationId
            });

        } catch (err) {
            console.error('❌ Error en getPostsByImmobilierOperation:', err);
            return res.status(500).json({msg: err.message});
        }
    },

    // ========== OBTENER SUB-SUBCATEGORÍAS (Para compatibilidad) ==========
    getSubSubCategories: async (req, res) => {
        try {
            const { category, subcategory } = req.params;
            
            // Como solo tenemos 2 niveles, esto podría devolver articleType u otros campos específicos
            // Dependiendo de tu estructura, puedes adaptarlo
            const subSubCategories = await Posts.distinct('articleType', {
                categorie: category,
                subCategory: subcategory,
                isActive: true,
                articleType: { $exists: true, $ne: "" }
            });

            res.json({
                success: true,
                category,
                subcategory,
                subSubCategories: subSubCategories.map(type => ({
                    name: type,
                    slug: type.toLowerCase().replace(/\s+/g, '-')
                })),
                total: subSubCategories.length
            });

        } catch (err) {
            console.error('❌ Error en getSubSubCategories:', err);
            return res.status(500).json({msg: err.message});
        }
    }
};

module.exports = postCategoryCtrl;