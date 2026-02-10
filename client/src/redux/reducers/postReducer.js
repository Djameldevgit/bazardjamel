// 📂 redux/reducers/postReducer.js - VERSIÓN COMPLETA CORREGIDA
import { POST_TYPES } from '../actions/postAction';
import { GLOBALTYPES } from '../actions/globalTypes';
import { DeleteData } from '../actions/globalTypes';

const initialState = {
  // Estados básicos
  loading: false,
  posts: [],          // Posts generales
  result: 0,          // Total de posts
  page: 1,            // Página actual

  // Post específico
  detailPost: null,

  // Posts similares
  similarPosts: {
    posts: [],
    currentPostId: null,
    page: 1,
    total: 0,
    loading: false
  },

  // Errores
  error: null,

  // Filtros
  filters: {
    categoryId: null,
    subcategory: null,
    article: null,
    priceRange: null,
    location: null
  },

  // Posts similares (alternativa)
  similarPostsArray: [],
  similarPostsTotal: 0,
  similarPostsPage: 1,
  similarPostsTotalPages: 1,
  similarPostsHasMore: false,
  similarLoading: false,
  currentSimilarPostId: null,

  // 🎯 NUEVOS ESTADOS PARA PAGINACIÓN DE CATEGORÍAS
  postsLoading: false,
  loadingMorePosts: false,
  postsError: null,
  hasMorePosts: true,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    limit: 12
  }
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    // ================ CATEGORY POSTS PAGINADOS ================
    case POST_TYPES.GET_CATEGORY_POSTS:
      return {
        ...state,
        postsLoading: true,
        loadingMorePosts: false,
        postsError: null
      };

    case POST_TYPES.GET_CATEGORY_POSTS_SUCCESS:
      console.log('✅ GET_CATEGORY_POSTS_SUCCESS:', {
        pagina: action.payload.pagination?.currentPage || 1,
        postsRecibidos: action.payload.posts?.length || 0,
        postsActuales: state.posts.length,
        tieneMas: action.payload.pagination?.hasMore || false
      });

      // 🎯 LÓGICA DE ACUMULACIÓN
      const currentPage = action.payload.pagination?.currentPage || 1;
      const newPosts = action.payload.posts || [];
      
      let postsActualizados;
      
      if (currentPage === 1) {
        // Página 1: Reemplazar
        postsActualizados = newPosts;
        console.log('📄 Página 1: Reemplazando posts');
      } else {
        // Página > 1: Acumular
        postsActualizados = [...state.posts, ...newPosts];
        console.log(`📄 Página ${currentPage}: Acumulando ${newPosts.length} posts`);
      }

      return {
        ...state,
        postsLoading: false,
        loadingMorePosts: false,
        posts: postsActualizados,
        hasMorePosts: action.payload.pagination?.hasMore || false,
        postsError: null,
        pagination: {
          currentPage: currentPage,
          totalPages: action.payload.pagination?.totalPages || 1,
          totalPosts: action.payload.pagination?.totalPosts || 0,
          limit: action.payload.pagination?.limit || 12
        }
      };

    case POST_TYPES.GET_CATEGORY_POSTS_FAIL:
      return {
        ...state,
        postsLoading: false,
        loadingMorePosts: false,
        postsError: action.payload
      };

    // 🎯 NUEVO: ESTADOS PARA "CARGAR MÁS" (SCROLL INFINITO)
    case POST_TYPES.LOADING_MORE_POSTS:
      return {
        ...state,
        loadingMorePosts: true,
        postsError: null
      };

    case POST_TYPES.LOAD_MORE_POSTS_SUCCESS:
      console.log('✅ LOAD_MORE_POSTS_SUCCESS:', {
        pagina: action.payload.pagination?.currentPage || 1,
        postsNuevos: action.payload.posts?.length || 0,
        postsTotales: state.posts.length + (action.payload.posts?.length || 0),
        tieneMas: action.payload.pagination?.hasMore || false
      });

      return {
        ...state,
        loadingMorePosts: false,
        // 🎯 SIEMPRE acumular posts
        posts: [...state.posts, ...(action.payload.posts || [])],
        hasMorePosts: action.payload.pagination?.hasMore || false,
        pagination: {
          currentPage: action.payload.pagination?.currentPage || 1,
          totalPages: action.payload.pagination?.totalPages || 1,
          totalPosts: action.payload.pagination?.totalPosts || 0,
          limit: action.payload.pagination?.limit || 12
        }
      };

    case POST_TYPES.LOAD_MORE_POSTS_FAIL:
      return {
        ...state,
        loadingMorePosts: false,
        postsError: action.payload
      };

    // ================ RESET ================
    case POST_TYPES.RESET_CATEGORY_POSTS:
      return {
        ...state,
        posts: [],
        postsLoading: false,
        loadingMorePosts: false,
        hasMorePosts: true,
        postsError: null,
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalPosts: 0,
          limit: 12
        }
      };

    // ================ POSTS GENERALES ================
    case POST_TYPES.LOADING_POST:
      return {
        ...state,
        loading: action.payload
      };

    case POST_TYPES.CREATE_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        result: state.result + 1
      };

    case POST_TYPES.GET_POSTS:
      return {
        ...state,
        posts: action.payload.posts || [],
        result: action.payload.total || 0,
        page: action.payload.page || 1,
        loading: false
      };

    // ================ POST ESPECÍFICO ================
    case POST_TYPES.GET_POST:
      return {
        ...state,
        detailPost: action.payload,
        loading: false
      };

    case POST_TYPES.GET_POST_BY_ID:
      return {
        ...state,
        postToEdit: action.payload
      };

    // ================ ACTUALIZAR POST ================
    case POST_TYPES.UPDATE_POST:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === action.payload._id ? action.payload : post
        ),
        detailPost: state.detailPost?._id === action.payload._id
          ? action.payload
          : state.detailPost
      };

    case POST_TYPES.DELETE_POST:
      return {
        ...state,
        posts: DeleteData(state.posts, action.payload._id)
      };

    // ================ FILTROS ================
    case POST_TYPES.SET_POST_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload
        },
        posts: [],
        page: 1,
        result: 0
      };

    // ================ POSTS SIMILARES ================
    case POST_TYPES.LOADING_SIMILAR_POSTS:
      return {
        ...state,
        similarPosts: {
          ...state.similarPosts,
          loading: action.payload
        }
      };

    case POST_TYPES.GET_SIMILAR_POSTS: {
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
          similarPostsArray: safeSimilarPosts,
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
        similarPostsArray: [...state.similarPostsArray, ...safeSimilarPosts],
        similarPostsTotal: newSimilarTotal,
        similarPostsPage: newSimilarPage,
        similarPostsTotalPages: newSimilarTotalPages,
        similarPostsHasMore: newSimilarHasMore,
        similarLoading: false,
        error: null
      };
    }

    case POST_TYPES.CLEAR_SIMILAR_POSTS:
      return {
        ...state,
        similarPostsArray: [],
        similarPostsTotal: 0,
        similarPostsPage: 1,
        similarPostsTotalPages: 1,
        similarPostsHasMore: false,
        similarLoading: false,
        currentSimilarPostId: null
      };

    // ================ LIKES ================
    case POST_TYPES.LIKE_POST:
    case POST_TYPES.UNLIKE_POST:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === action.payload._id ? action.payload : post
        ),
        detailPost: state.detailPost?._id === action.payload._id
          ? action.payload
          : state.detailPost
      };

    // ================ SAVES ================
    case POST_TYPES.SAVE_POST:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === action.payload.postId
            ? { ...post, saved: [...(post.saved || []), action.payload.userId] }
            : post
        )
      };

    case POST_TYPES.UNSAVE_POST:
      return {
        ...state,
        posts: state.posts.map(post =>
          post._id === action.payload.postId
            ? {
              ...post,
              saved: (post.saved || []).filter(id => id !== action.payload.userId)
            }
            : post
        )
      };

    // ================ ERRORES ================
    case POST_TYPES.ERROR_POST:
      return {
        ...state,
        error: action.payload,
        loading: false,
        similarPosts: {
          ...state.similarPosts,
          loading: false
        }
      };

    case POST_TYPES.CLEAR_POST_ERROR:
      return {
        ...state,
        error: null
      };

    // ================ RESET COMPLETO ================
    case POST_TYPES.RESET_POST_STATE:
      return {
        ...initialState
      };

    // ================ ALERTAS GLOBALES ================
    case GLOBALTYPES.ALERT:
      if (action.payload.error && action.payload.error.includes('post')) {
        return {
          ...state,
          error: action.payload.error
        };
      }
      return state;

    // ================ DEFAULT ================
    default:
      return state;
  }
};

export default postReducer;