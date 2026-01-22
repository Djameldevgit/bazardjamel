// 📂 redux/reducers/postReducer.js - VERSIÓN LIMPIA
import { POST_TYPES } from '../actions/postAction';
import { GLOBALTYPES } from '../actions/globalTypes';

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
  
  // Filtros (opcional, si necesitas mantener estado de filtrado)
  filters: {
    category: null,
    priceRange: null,
    location: null
  },


  // Posts similares
  similarPosts: [],
  similarPostsTotal: 0,
  similarPostsPage: 1,
  similarPostsTotalPages: 1,
  similarPostsHasMore: false,
  similarLoading: false,
  currentSimilarPostId: null,





};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    case POST_TYPES.GET_CATEGORY_POSTS:
  return {
    ...state,
    postsLoading: true,
    postsError: null
  };
  
case POST_TYPES.GET_CATEGORY_POSTS_SUCCESS:
  console.log('✅ Reducer: GET_CATEGORY_POSTS_SUCCESS', {
    postsCount: action.payload.posts.length,
    hasMore: action.payload.hasMore
  });
  
  return {
    ...state,
    postsLoading: false,
    categoryInfo: action.payload.categoryInfo || {},
    children: action.payload.children || [],
    posts: action.payload.posts || [],
    postsCurrentPage: action.payload.currentPage || 1,
    postsTotalPages: action.payload.totalPages || 1,
    hasMorePosts: action.payload.hasMore || false,
    postsError: null
  };
  
case POST_TYPES.GET_CATEGORY_POSTS_FAIL:
  return {
    ...state,
    postsLoading: false,
    postsError: action.payload,
    posts: []
  };
    // ================ LOADING STATES ================
    case POST_TYPES.LOADING_POST:
      return {
        ...state,
        loading: action.payload
      };
      
    case POST_TYPES.LOADING_SIMILAR_POSTS:
      return {
        ...state,
        similarPosts: {
          ...state.similarPosts,
          loading: action.payload
        }
      };

    // ================ CREATE POST ================
    case POST_TYPES.CREATE_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts],
        result: state.result + 1
      };

    // ================ GET POSTS (paginados) ================
    case POST_TYPES.GET_POSTS:
      return {
        ...state,
        posts: action.payload.posts || [],
        result: action.payload.total || 0,
        page: action.payload.page || 1,
        loading: false
      };

    // ================ GET SINGLE POST ================
    case POST_TYPES.GET_POST:
      return {
        ...state,
        detailPost: action.payload,
        loading: false
      };

    // ================ UPDATE POST ================
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

    // ================ DELETE POST ================
    case POST_TYPES.DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload._id),
        result: Math.max(0, state.result - 1),
        detailPost: state.detailPost?._id === action.payload._id 
          ? null 
          : state.detailPost
      };

    // ================ SIMILAR POSTS ================
    case POST_TYPES.GET_SIMILAR_POSTS:
      return {
        ...state,
        similarPosts: {
          posts: action.payload.posts || [],
          currentPostId: action.payload.currentPostId,
          page: action.payload.page || 1,
          total: action.payload.total || 0,
          loading: false
        }
      };

    case POST_TYPES.CLEAR_SIMILAR_POSTS:
      return {
        ...state,
        similarPosts: initialState.similarPosts
      };

    // ================ LIKE/UNLIKE ================
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

    // ================ SAVE/UNSAVE ================
    // Nota: Estas acciones probablemente manejan el estado en authReducer
    // pero las mantenemos por si acaso
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

    // ================ ERROR HANDLING ================
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

    // ================ RESET ================
    case POST_TYPES.RESET_POST_STATE:
      return {
        ...initialState
      };

    // ================ GLOBAL ALERTS (si afectan posts) ================
    case GLOBALTYPES.ALERT:
      // Solo procesar si es un error relacionado con posts
      if (action.payload.error && action.payload.error.includes('post')) {
        return {
          ...state,
          error: action.payload.error
        };
      }
      return state;


  // ==================== POSTS SIMILARES (de postAction) ====================
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




    // ================ DEFAULT ================
    default:
      return state;
  }
};

export default postReducer;