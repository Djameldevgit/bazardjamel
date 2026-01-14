// redux/reducers/postReducer.js
import { POST_TYPES } from '../actions/postAction';
import { POST_CATEGORY_TYPES } from '../actions/postCategoryAction'; // Importar ambos tipos
import { EditData, DeleteData } from '../actions/globalTypes';

// Combinar todos los tipos para usar en el reducer
const COMBINED_POST_TYPES = {
    ...POST_TYPES,
    ...POST_CATEGORY_TYPES
};

const initialState = {
    loading: false,
    posts: [],
    categoryPosts: {},
    subcategoryPosts: {},
    subsubcategoryPosts: {},
    categorySpecificPosts: [],
    result: 0,
    page: 1,
    total: 0,
    totalPages: 1,
    
    // Categorías
    categories: [],
    categoriesPage: 1,
    categoriesTotal: 0,
    categoriesHasMore: false,
    
    // Niveles jerárquicos actuales
    currentCategory: 'all',
    currentSubcategory: null,
    currentSubsubcategory: null,
    currentCategoryLevel: 1,
    
    // Posts similares
    similarPosts: [],
    similarPostsTotal: 0,
    similarPostsPage: 1,
    similarPostsTotalPages: 1,
    similarPostsHasMore: false,
    similarLoading: false,
    currentSimilarPostId: null,
    
    // Sub-subcategorías
    subSubcategories: {},
    
    // Jerarquía completa
    categoriesHierarchy: [],
    
    // Estados de carga
    loadingCategoryHierarchy: false,
    loadingSubSubcategories: false,
    loadingCategories: false,
    loadingSubcategories: false,
    
    error: null
};

const postReducer = (state = initialState, action) => {
    console.log('🔍 REDUCER - Acción:', action.type, 'Payload:', action.payload ? {
        type: typeof action.payload,
        tienePosts: !!action.payload.posts,
        postsLength: action.payload.posts?.length,
        category: action.payload.category,
        page: action.payload.page
    } : 'sin payload');
    
    // Usar ambos tipos combinados
    const actionType = action.type;
    
    switch (actionType) {
        // ==================== LOADING STATES (de ambos) ====================
        case COMBINED_POST_TYPES.LOADING_POST:
        case COMBINED_POST_TYPES.LOADING_CATEGORIES:
            return {
                ...state,
                loading: action.payload
            };
            
        case COMBINED_POST_TYPES.LOADING_CATEGORY_HIERARCHY:
            return {
                ...state,
                loadingCategoryHierarchy: action.payload
            };
            
        case COMBINED_POST_TYPES.LOADING_SUBSUBCATEGORIES:
            return {
                ...state,
                loadingSubSubcategories: action.payload
            };
            
        case COMBINED_POST_TYPES.LOADING_SIMILAR_POSTS:
            return {
                ...state,
                similarLoading: action.payload
            };
            
        case COMBINED_POST_TYPES.LOADING_SUBCATEGORIES:
            return {
                ...state,
                loadingSubcategories: action.payload
            };

        // ==================== GET POSTS BY CATEGORY (de postCategoryAction) ====================
        case COMBINED_POST_TYPES.GET_POSTS_BY_CATEGORY: {
            console.log('🎯 REDUCER - GET_POSTS_BY_CATEGORY - ENTRANDO:', {
                category: action.payload.category,
                postsRecibidos: action.payload.posts?.length,
                page: action.payload.page,
                total: action.payload.total
            });

            // Validar payload
            if (!action.payload || !action.payload.category) {
                console.error('❌ REDUCER - Payload inválido para GET_POSTS_BY_CATEGORY');
                return {
                    ...state,
                    loading: false
                };
            }

            const { 
                category,
                posts = [], 
                page = 1, 
                total = 0,
                totalPages = 1,
                result = 0
            } = action.payload;

            // Obtener posts existentes para esta categoría
            const existingCategoryPosts = state.categoryPosts[category] || [];
            
            // Determinar nuevos posts
            let updatedCategoryPosts;
            if (page === 1) {
                updatedCategoryPosts = posts;
            } else {
                updatedCategoryPosts = [...existingCategoryPosts, ...posts];
            }

            // Crear nuevo estado
            const newState = {
                ...state,
                categoryPosts: {
                    ...state.categoryPosts,
                    [category]: updatedCategoryPosts
                },
                posts: page === 1 ? posts : [...state.posts, ...posts],
                categorySpecificPosts: page === 1 ? posts : [...state.categorySpecificPosts, ...posts],
                
                // Actualizar metadatos
                result: result || posts.length,
                page: page,
                total: total || 0,
                totalPages: totalPages || 1,
                currentCategory: category,
                currentSubcategory: null,
                currentSubsubcategory: null,
                currentCategoryLevel: 1,
                loading: false
            };

            return newState;
        }

        // ==================== GET POSTS BY SUBCATEGORY (de postCategoryAction) ====================
        case COMBINED_POST_TYPES.GET_POSTS_BY_SUBCATEGORY: {
            const { 
                categorySlug,
                subcategorySlug,
                posts = [], 
                page = 1, 
                total = 0,
                totalPages = 1,
                result = 0
            } = action.payload;

            // Obtener posts existentes para esta subcategoría
            const existingSubcategoryPosts = state.subcategoryPosts[categorySlug]?.[subcategorySlug] || [];
            
            // Determinar nuevos posts
            let updatedSubcategoryPosts;
            if (page === 1) {
                updatedSubcategoryPosts = posts;
            } else {
                updatedSubcategoryPosts = [...existingSubcategoryPosts, ...posts];
            }

            const newState = {
                ...state,
                subcategoryPosts: {
                    ...state.subcategoryPosts,
                    [categorySlug]: {
                        ...state.subcategoryPosts[categorySlug],
                        [subcategorySlug]: updatedSubcategoryPosts
                    }
                },
                posts: page === 1 ? posts : [...state.posts, ...posts],
                result: result || posts.length,
                page: page,
                total: total || 0,
                totalPages: totalPages || 1,
                currentCategory: categorySlug,
                currentSubcategory: subcategorySlug,
                currentSubsubcategory: null,
                currentCategoryLevel: 2,
                loading: false
            };

            return newState;
        }

        // ==================== SISTEMA JERÁRQUICO COMPLETO (de postCategoryAction) ====================
        case COMBINED_POST_TYPES.GET_POSTS_BY_CATEGORY_HIERARCHY: {
            console.log('🔄 Reducer - GET_POSTS_BY_CATEGORY_HIERARCHY:', {
                level1: action.payload.level1,
                level2: action.payload.level2,
                level3: action.payload.level3,
                page: action.payload.page,
                postsCount: action.payload.posts?.length
            });

            const { 
                level1, 
                level2, 
                level3, 
                posts: hierarchyPosts = [], 
                page: hierarchyPage = 1, 
                total: hierarchyTotal = 0,
                totalPages: hierarchyTotalPages = 1,
                sublevels = [],
                categoryPath 
            } = action.payload;

            const hierarchyCurrentLevel = level3 ? 3 : level2 ? 2 : 1;
            
            // Para nivel 1 (solo categoría)
            if (!level2 && !level3) {
                if (hierarchyPage === 1) {
                    return {
                        ...state,
                        posts: hierarchyPosts,
                        categoryPosts: {
                            ...state.categoryPosts,
                            [level1]: hierarchyPosts
                        },
                        result: hierarchyPosts.length,
                        page: hierarchyPage,
                        total: hierarchyTotal,
                        totalPages: hierarchyTotalPages,
                        currentCategory: level1,
                        currentSubcategory: null,
                        currentSubsubcategory: null,
                        currentCategoryLevel: 1,
                        loading: false
                    };
                } else {
                    return {
                        ...state,
                        posts: [...state.posts, ...hierarchyPosts],
                        categoryPosts: {
                            ...state.categoryPosts,
                            [level1]: [...(state.categoryPosts[level1] || []), ...hierarchyPosts]
                        },
                        result: state.result + hierarchyPosts.length,
                        page: hierarchyPage,
                        total: hierarchyTotal,
                        totalPages: hierarchyTotalPages,
                        currentCategory: level1,
                        currentSubcategory: null,
                        currentSubsubcategory: null,
                        currentCategoryLevel: 1,
                        loading: false
                    };
                }
            }
            
            // Para nivel 2 (categoría + subcategoría)
            if (level2 && !level3) {
                if (hierarchyPage === 1) {
                    return {
                        ...state,
                        posts: hierarchyPosts,
                        subcategoryPosts: {
                            ...state.subcategoryPosts,
                            [level1]: {
                                ...state.subcategoryPosts[level1],
                                [level2]: hierarchyPosts
                            }
                        },
                        result: hierarchyPosts.length,
                        page: hierarchyPage,
                        total: hierarchyTotal,
                        totalPages: hierarchyTotalPages,
                        currentCategory: level1,
                        currentSubcategory: level2,
                        currentSubsubcategory: null,
                        currentCategoryLevel: 2,
                        loading: false
                    };
                } else {
                    const existingPosts = state.subcategoryPosts[level1]?.[level2] || [];
                    return {
                        ...state,
                        posts: [...state.posts, ...hierarchyPosts],
                        subcategoryPosts: {
                            ...state.subcategoryPosts,
                            [level1]: {
                                ...state.subcategoryPosts[level1],
                                [level2]: [...existingPosts, ...hierarchyPosts]
                            }
                        },
                        result: state.result + hierarchyPosts.length,
                        page: hierarchyPage,
                        total: hierarchyTotal,
                        totalPages: hierarchyTotalPages,
                        currentCategory: level1,
                        currentSubcategory: level2,
                        currentSubsubcategory: null,
                        currentCategoryLevel: 2,
                        loading: false
                    };
                }
            }
            
            // Para nivel 3 (categoría + subcategoría + sub-subcategoría)
            if (level1 && level2 && level3) {
                if (hierarchyPage === 1) {
                    return {
                        ...state,
                        posts: hierarchyPosts,
                        subsubcategoryPosts: {
                            ...state.subsubcategoryPosts,
                            [level1]: {
                                ...state.subsubcategoryPosts[level1],
                                [level2]: {
                                    ...(state.subsubcategoryPosts[level1]?.[level2] || {}),
                                    [level3]: hierarchyPosts
                                }
                            }
                        },
                        result: hierarchyPosts.length,
                        page: hierarchyPage,
                        total: hierarchyTotal,
                        totalPages: hierarchyTotalPages,
                        currentCategory: level1,
                        currentSubcategory: level2,
                        currentSubsubcategory: level3,
                        currentCategoryLevel: 3,
                        sublevels: sublevels,
                        categoryPath: categoryPath,
                        loading: false
                    };
                } else {
                    const existingPosts = state.subsubcategoryPosts[level1]?.[level2]?.[level3] || [];
                    return {
                        ...state,
                        posts: [...state.posts, ...hierarchyPosts],
                        subsubcategoryPosts: {
                            ...state.subsubcategoryPosts,
                            [level1]: {
                                ...state.subsubcategoryPosts[level1],
                                [level2]: {
                                    ...(state.subsubcategoryPosts[level1]?.[level2] || {}),
                                    [level3]: [...existingPosts, ...hierarchyPosts]
                                }
                            }
                        },
                        result: state.result + hierarchyPosts.length,
                        page: hierarchyPage,
                        total: hierarchyTotal,
                        totalPages: hierarchyTotalPages,
                        currentCategory: level1,
                        currentSubcategory: level2,
                        currentSubsubcategory: level3,
                        currentCategoryLevel: 3,
                        sublevels: sublevels,
                        categoryPath: categoryPath,
                        loading: false
                    };
                }
            }
            
            return state;
        }

        // ==================== SUBCATEGORÍAS (de postCategoryAction) ====================
        case COMBINED_POST_TYPES.GET_SUBCATEGORIES: {
            const { 
                categorySlug,
                subcategories = [] 
            } = action.payload;
            
            return {
                ...state,
                subSubcategories: {
                    ...state.subSubcategories,
                    [categorySlug]: subcategories
                },
                loadingSubcategories: false
            };
        }

        // ==================== SUB-SUBCATEGORÍAS (de postCategoryAction) ====================
        case COMBINED_POST_TYPES.GET_SUBSUBCATEGORIES: {
            const { 
                category: subsubCat, 
                subcategory: subsubSubCat, 
                subSubCategories: subsubCats = [] 
            } = action.payload;
            
            return {
                ...state,
                subSubcategories: {
                    ...state.subSubcategories,
                    [subsubCat]: {
                        ...state.subSubcategories[subsubCat],
                        [subsubSubCat]: subsubCats
                    }
                },
                loadingSubSubcategories: false
            };
        }

        // ==================== JERARQUÍA COMPLETA (de postCategoryAction) ====================
        case COMBINED_POST_TYPES.GET_CATEGORIES_HIERARCHY:
            return {
                ...state,
                categoriesHierarchy: action.payload || [],
                loadingCategoryHierarchy: false
            };

        // ==================== CATEGORÍAS PAGINADAS (de postCategoryAction) ====================
        case COMBINED_POST_TYPES.GET_CATEGORIES_PAGINATED: {
            const payload = action.payload || {};
            
            // Extraer categorías de diferentes formatos posibles
            let categoriesArray = [];
            
            if (Array.isArray(payload.categories)) {
                categoriesArray = payload.categories;
            } else if (Array.isArray(payload)) {
                categoriesArray = payload;
            }
            
            // Normalizar las categorías
            const normalizedCategories = categoriesArray
                .filter(cat => cat && (cat.name || cat.displayName || cat._id))
                .map(cat => ({
                    _id: cat._id || cat.id || `cat-${cat.name}`,
                    name: cat.displayName || cat.name || cat._id || 'Sin nombre',
                    displayName: cat.displayName || cat.name || 'Sin nombre',
                    slug: cat.slug || (cat.name ? cat.name.toLowerCase().replace(/\s+/g, '-') : 'sin-nombre'),
                    emoji: cat.emoji || '📁',
                    type: cat.type || 'post',
                    count: cat.count || 0,
                    categorie: cat.categorie || cat.name,
                    category: cat.category || cat.name
                }));
            
            const page = payload.page || 1;
            const total = payload.total || 0;
            const hasMore = payload.hasMore || false;
            
            if (page === 1) {
                return {
                    ...state,
                    categories: normalizedCategories,
                    categoriesPage: page,
                    categoriesTotal: total,
                    categoriesHasMore: hasMore,
                    loading: false
                };
            } else {
                return {
                    ...state,
                    categories: [...state.categories, ...normalizedCategories],
                    categoriesPage: page,
                    categoriesTotal: total,
                    categoriesHasMore: hasMore,
                    loading: false
                };
            }
        }

        // ==================== SETEAR NIVEL ACTUAL (de postCategoryAction) ====================
        case COMBINED_POST_TYPES.SET_CURRENT_CATEGORY_LEVEL:
            return {
                ...state,
                currentCategoryLevel: action.payload.level,
                currentCategory: action.payload.category || state.currentCategory,
                currentSubcategory: action.payload.subcategory || state.currentSubcategory,
                currentSubsubcategory: action.payload.subsubcategory || state.currentSubsubcategory
            };

        // ==================== LIMPIAR JERARQUÍA (de postCategoryAction) ====================
        case COMBINED_POST_TYPES.CLEAR_CATEGORY_HIERARCHY:
            return {
                ...state,
                posts: [],
                categoryPosts: {},
                subcategoryPosts: {},
                subsubcategoryPosts: {},
                result: 0,
                page: 1,
                total: 0,
                totalPages: 1,
                currentCategory: 'all',
                currentSubcategory: null,
                currentSubsubcategory: null,
                currentCategoryLevel: 1,
                loading: false
            };

        // ==================== POSTS GENERALES (de postAction) ====================
        case COMBINED_POST_TYPES.GET_POSTS:
            return {
                ...state,
                posts: action.payload.posts || [],
                result: action.payload.result || 0,
                page: action.payload.page || 1,
                total: action.payload.total || 0,
                currentCategory: 'all',
                currentCategoryLevel: 1,
                loading: false
            };

        // ==================== GET CATEGORIES (legacy - mantén por compatibilidad) ====================
        case COMBINED_POST_TYPES.GET_CATEGORIES:
            const categoriesArray = Array.isArray(action.payload)
                ? action.payload
                : (action.payload.categories || []);
            return {
                ...state,
                categories: categoriesArray,
                loading: false
            };

        // ==================== POSTS SIMILARES (de postAction) ====================
        case COMBINED_POST_TYPES.GET_SIMILAR_POSTS: {
            const { 
                posts: newSimilarPosts = [],
                page: newSimilarPage = 1,
                total: newSimilarTotal = 0,
                totalPages: newSimilarTotalPages = 1,
                hasMore: newSimilarHasMore = false,
                currentPostId: newCurrentPostId 
            } = action.payload;
            
            const safeSimilarPosts = Array.isArray(newSimilarPosts) 
                ? newSimilarPosts 
                : [];
            
            if (newSimilarPage === 1 || newCurrentPostId !== state.currentSimilarPostId) {
                return {
                    ...state,
                    similarPosts: safeSimilarPosts,
                    similarPostsTotal: newSimilarTotal,
                    similarPostsPage: newSimilarPage,
                    similarPostsTotalPages: newSimilarTotalPages,
                    similarPostsHasMore: newSimilarHasMore,
                    similarLoading: false,
                    currentSimilarPostId: newCurrentPostId,
                    error: null
                };
            }
            
            return {
                ...state,
                similarPosts: [...state.similarPosts, ...safeSimilarPosts],
                similarPostsTotal: newSimilarTotal,
                similarPostsPage: newSimilarPage,
                similarPostsTotalPages: newSimilarTotalPages,
                similarPostsHasMore: newSimilarHasMore,
                similarLoading: false,
                error: null
            };
        }

        case COMBINED_POST_TYPES.CLEAR_SIMILAR_POSTS:
            return {
                ...state,
                similarPosts: [],
                similarPostsTotal: 0,
                similarPostsPage: 1,
                similarPostsTotalPages: 1,
                similarPostsHasMore: false,
                similarLoading: false,
                currentSimilarPostId: null
            };

        // ==================== CRUD POSTS (de postAction) ====================
        case COMBINED_POST_TYPES.CREATE_POST:
            return {
                ...state,
                posts: [action.payload, ...state.posts]
            };

        case COMBINED_POST_TYPES.UPDATE_POST:
            return {
                ...state,
                posts: EditData(state.posts, action.payload._id, action.payload)
            };

        case COMBINED_POST_TYPES.DELETE_POST:
            return {
                ...state,
                posts: DeleteData(state.posts, action.payload._id)
            };

        // ==================== ERROR (de ambos) ====================
        case COMBINED_POST_TYPES.ERROR_POST:
        case COMBINED_POST_TYPES.ERROR_CATEGORY:
            console.log('❌ Reducer - ERROR:', action.payload);
            return {
                ...state,
                error: action.payload,
                loading: false,
                similarLoading: false,
                loadingCategoryHierarchy: false,
                loadingSubSubcategories: false,
                loadingCategories: false,
                loadingSubcategories: false
            };

        default:
            return state;
    }
};

export default postReducer;