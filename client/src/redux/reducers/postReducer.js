// redux/reducers/postReducer.js - VERSIÓN COMPLETA Y ACTUALIZADA
import { POST_TYPES } from '../actions/postAction';
import { EditData, DeleteData } from '../actions/globalTypes'
const initialState = {
    loading: false,
    posts: [],
    categoryPosts: {},
    categorySpecificPosts: [],
    result: 0,
    page: 1,
    total: 0,
    totalPages: 1,
    categories: [],
 
    // ✅ NUEVOS ESTADOS PARA POSTS SIMILARES
    similarPosts: [],
    similarPostsTotal: 0,
    similarPostsPage: 1,
    similarPostsTotalPages: 1,
    similarPostsHasMore: false,
    similarLoading: false,
    currentSimilarPostId: null,
    // Estados para categorías paginadas
    categoriesPage: 1,
    categoriesTotal: 0,
    categoriesHasMore: false,

    currentCategory: 'all',
    error: null,
    category: null,
    subcategory: null, // <-- AÑADIR ESTE CAMPO
    categories: [],
    categoryPosts: {}, // Posts por categoría
    // ... otros campo
};

const postReducer = (state = initialState, action) => {
    switch (action.type) {
        case POST_TYPES.LOADING_POST:
            return {
                ...state,
                loading: action.payload
            };
        // ==================== POSTS POR CATEGORÍA ====================
        case POST_TYPES.GET_POSTS_BY_CATEGORY:
            console.log('🔄 Reducer - GET_POSTS_BY_CATEGORY:', {
                category: action.payload.category,
                postsCount: action.payload.posts?.length,
                page: action.payload.page
            });

            const { category, posts, page, result, total, totalPages } = action.payload;

            if (category === 'all') {
                return {
                    ...state,
                    posts: page === 1 ? posts : [...state.posts, ...posts],
                    result: result || posts.length,
                    page,
                    total: total || 0,
                    totalPages: totalPages || 1,
                    currentCategory: 'all',
                    loading: false
                };
            }

            const existingCategoryPosts = state.categoryPosts[category] || [];

            let updatedCategorySpecificPosts = [];
            if (page === 1) {
                updatedCategorySpecificPosts = posts;
            } else {
                updatedCategorySpecificPosts = [...state.categorySpecificPosts, ...posts];
            }

            let updatedCategoryPosts;
            if (page === 1) {
                updatedCategoryPosts = posts;
            } else {
                updatedCategoryPosts = [...existingCategoryPosts, ...posts];
            }

            return {
                ...state,
                categoryPosts: {
                    ...state.categoryPosts,
                    [category]: updatedCategoryPosts
                },
                categorySpecificPosts: updatedCategorySpecificPosts,
                result: result || posts.length,
                page,
                total: total || 0,
                totalPages: totalPages || 1,
                currentCategory: category,
                loading: false
            };

        // ==================== POSTS GENERALES (HOME) ====================
        case POST_TYPES.GET_POSTS:
            console.log('🏠 Reducer - GET_POSTS (para Home)');
            return {
                ...state,
                posts: action.payload.posts || [],
                result: action.payload.result || 0,
                page: action.payload.page || 1,
                total: action.payload.total || 0,
                currentCategory: 'all',
                loading: false
            };

        // ==================== CATEGORÍAS ====================
        case POST_TYPES.GET_CATEGORIES:
            console.log('📂 Reducer - GET_CATEGORIES:', {
                payloadType: typeof action.payload,
                isArray: Array.isArray(action.payload),
                length: action.payload?.length
            });

            // Asegurar que siempre sea un array
            const categoriesArray = Array.isArray(action.payload)
                ? action.payload
                : (action.payload.categories || []);

            return {
                ...state,
                categories: categoriesArray,
                loading: false
            };

        case POST_TYPES.GET_CATEGORIES_PAGINATED:
            console.log('🔄 Reducer - GET_CATEGORIES_PAGINATED - Payload:', {
                payload: action.payload,
                payloadType: typeof action.payload,
                isArray: Array.isArray(action.payload),
                hasCategories: 'categories' in action.payload,
                categoriesType: typeof action.payload?.categories,
                categoriesIsArray: Array.isArray(action.payload?.categories)
            });

            // Asegurar que categories sea un array
            const categoriesData = action.payload?.categories;
            let safeCategories = [];

            if (Array.isArray(categoriesData)) {
                safeCategories = categoriesData;
            } else if (categoriesData && typeof categoriesData === 'object') {
                // Si es un objeto, convertirlo a array
                safeCategories = Object.values(categoriesData);
            } else if (Array.isArray(action.payload)) {
                // Si el payload completo es el array
                safeCategories = action.payload;
            }

            console.log('📊 Categories seguro:', {
                safeCategoriesLength: safeCategories.length,
                firstItem: safeCategories[0]
            });

            if (action.payload?.page === 1) {
                return {
                    ...state,
                    categories: safeCategories,
                    categoriesPage: action.payload.page || 1,
                    categoriesTotal: action.payload.total || 0,
                    categoriesHasMore: action.payload.hasMore || false,
                    loading: false
                };
            } else {
                return {
                    ...state,
                    categories: [...state.categories, ...safeCategories],
                    categoriesPage: action.payload.page || state.categoriesPage + 1,
                    categoriesTotal: action.payload.total || state.categoriesTotal,
                    categoriesHasMore: action.payload.hasMore || false,
                    loading: false
                };
            }

        // ==================== POSTS SIMILARES ====================
        case POST_TYPES.GET_SIMILAR_POSTS:
            console.log('🔄 Reducer - GET_SIMILAR_POSTS - Payload recibido:', {
                postsLength: action.payload.posts?.length,
                page: action.payload.page,
                currentPostId: action.payload.currentPostId,
                payloadCompleto: action.payload
            });
            
            const { 
                posts: newSimilarPosts = [],
                page: newPage = 1,
                total: newTotal = 0,
                totalPages: newTotalPages = 1,
                hasMore: newHasMore = false,
                currentPostId: newCurrentPostId 
            } = action.payload;
            
            // Validar que newSimilarPosts sea un array
            const safeSimilarPosts = Array.isArray(newSimilarPosts) 
                ? newSimilarPosts 
                : [];
            
            console.log('📊 Similar posts procesados:', {
                safeLength: safeSimilarPosts.length,
                firstPost: safeSimilarPosts[0]
            });
            
            // Si es página 1 o es un post diferente, reemplazar completamente
            if (newPage === 1 || newCurrentPostId !== state.currentSimilarPostId) {
                return {
                    ...state,
                    similarPosts: safeSimilarPosts,
                    similarPostsTotal: newTotal,
                    similarPostsPage: newPage,
                    similarPostsTotalPages: newTotalPages,
                    similarPostsHasMore: newHasMore,
                    similarLoading: false,
                    currentSimilarPostId: newCurrentPostId,
                    error: null  // Limpiar errores previos
                };
            }
            
            // Si es la misma página del mismo post, agregar (paginación)
            return {
                ...state,
                similarPosts: [...state.similarPosts, ...safeSimilarPosts],
                similarPostsTotal: newTotal,
                similarPostsPage: newPage,
                similarPostsTotalPages: newTotalPages,
                similarPostsHasMore: newHasMore,
                similarLoading: false,
                error: null
            };
        case POST_TYPES.LOADING_SIMILAR_POSTS:
          
            return {
                ...state,
                similarLoading: action.payload
            };

        case POST_TYPES.CLEAR_SIMILAR_POSTS:
          
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
            case POST_TYPES.CREATE_POST:
                return {
                    ...state,
                    posts: [action.payload, ...state.posts]
                };
        case POST_TYPES.UPDATE_POST:
            return {
                ...state,
                posts: EditData(state.posts, action.payload._id, action.payload)
            };
        case POST_TYPES.DELETE_POST:
            return {
                ...state,
                posts: DeleteData(state.posts, action.payload._id)
            };
        // ==================== LOADING Y ERROR ====================
        case POST_TYPES.LOADING_POST:
            console.log('⏳ Reducer - LOADING_POST:', action.payload);
            return {
                ...state,
                loading: action.payload
            };

        case POST_TYPES.ERROR_POST:
            console.log('❌ Reducer - ERROR_POST:', action.payload);
            return {
                ...state,
                error: action.payload,
                loading: false,
                similarLoading: false
            };
        // En redux/reducers/postReducer.js
        case POST_TYPES.GET_SUBCATEGORY_POSTS:
            return {
                ...state,
                posts: action.payload.page === 1
                    ? action.payload.posts
                    : [...state.posts, ...action.payload.posts],
                category: action.payload.category,
                subcategory: action.payload.subcategory,
                page: action.payload.page,
                total: action.payload.total
            };




        case POST_TYPES.GET_CATEGORIES_PAGINATED:
            const existingCategories = state.categories || [];
            const newCategories = action.payload.categories || [];

            // Evitar duplicados
            const uniqueCategories = [...existingCategories];
            newCategories.forEach(newCat => {
                if (!uniqueCategories.find(cat => cat.name === newCat.name)) {
                    uniqueCategories.push(newCat);
                }
            });

            return {
                ...state,
                categories: uniqueCategories,
                categoriesPage: action.payload.page,
                categoriesTotal: action.payload.total,
                categoriesHasMore: action.payload.hasMore
            };

      // redux/reducers/postReducer.js - AGREGAR ESTOS CASOS:

      case POST_TYPES.GET_SUBCATEGORY_POSTS:
        console.log('🔄 Reducer - GET_SUBCATEGORY_POSTS:', {
            category: action.payload.category,
            subcategory: action.payload.subcategory,
            postsCount: action.payload.posts?.length,
            page: action.payload.page
        });
        
        return {
            ...state,
            posts: action.payload.page === 1
                ? action.payload.posts
                : [...state.posts, ...action.payload.posts],
            category: action.payload.category,
            subcategory: action.payload.subcategory,
            page: action.payload.page,
            total: action.payload.total || 0,
            result: action.payload.total || action.payload.posts?.length || 0,
            loading: false
        };
        
        
    case POST_TYPES.GET_IMMOBILIER_POSTS:
        console.log('🏠 Reducer - GET_IMMOBILIER_POSTS:', {
            operation: action.payload.operation,
            propertyType: action.payload.propertyType,
            postsCount: action.payload.posts?.length,
            page: action.payload.page,
            total: action.payload.total
        });

        const {
            operation,
            propertyType,
            posts: immoPosts,
            page: immoPage,
            total: immoTotal
        } = action.payload;

        // Si es página 1 o cambio de operación/propiedad, reemplazar
        if (immoPage === 1 || 
            operation !== state.immobilierOperation || 
            propertyType !== state.immobilierPropertyType) {
            
            return {
                ...state,
                immobilierPosts: immoPosts || [],
                immobilierOperation: operation,
                immobilierPropertyType: propertyType || null,
                immobilierPage: immoPage,
                immobilierTotal: immoTotal || 0,
                immobilierHasMore: (immoPosts?.length || 0) >= 12,
                result: immoTotal || immoPosts?.length || 0,
                loading: false
            };
        }


case POST_TYPES.CLEAR_IMMOBILIER_POSTS:
    return {
        ...state,
        immobilierPosts: [],
        immobilierOperation: null,
        immobilierPropertyType: null,
        immobilierPage: 1,
        immobilierTotal: 0,
        immobilierHasMore: false
    };

        default:
            return state;
    }
};

export default postReducer;