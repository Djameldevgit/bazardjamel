// postReducer.js - VERSIÓN CORREGIDA (ELIMINAR DUPLICADOS)

import { POST_TYPES } from '../actions/postAction';
import { GLOBALTYPES } from '../actions/globalTypes';
import { DeleteData } from '../actions/globalTypes';

const initialState = {
  loading: false,
  posts: [],
  result: 0,
  page: 1,
  detailPost: null,
  error: null,
  filters: {
    categoryId: null,
    subcategory: null,
    article: null,
    priceRange: null,
    location: null
  },
  
  // ✅ UNIFICADO: solo similarPostsArray
  similarPostsArray: [],
  similarPostsTotal: 0,
  similarPostsPage: 1,
  similarPostsTotalPages: 1,
  similarPostsHasMore: false,
  similarLoading: false,
  currentSimilarPostId: null,

  // PAGINACIÓN CATEGORÍAS
  postsLoading: false,
  loadingMorePosts: false,
  postsError: null,
  hasMorePosts: true,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalPosts: 0,
    limit: 12
  },
};

const postReducer = (state = initialState, action) => {
  switch (action.type) {
    // ========== CATEGORY POSTS PAGINADOS ==========
    case POST_TYPES.GET_CATEGORY_POSTS:
      return {
        ...state,
        postsLoading: true,
        loadingMorePosts: false,
        postsError: null
      };

    case POST_TYPES.GET_CATEGORY_POSTS_SUCCESS: {
      const payloadPagination = action.payload.pagination || {};
      const currentPage = payloadPagination.currentPage || 1;
      const newPosts = action.payload.posts || [];
      const postsActualizados = currentPage === 1 ? newPosts : [...state.posts, ...newPosts];

      return {
        ...state,
        postsLoading: false,
        loadingMorePosts: false,
        posts: postsActualizados,
        hasMorePosts: payloadPagination.hasMore ?? false,
        postsError: null,
        pagination: {
          currentPage,
          totalPages: payloadPagination.totalPages || 1,
          totalPosts: payloadPagination.totalPosts || 0,
          limit: payloadPagination.limit || 12
        }
      };
    }

    case POST_TYPES.GET_CATEGORY_POSTS_FAIL:
      return { ...state, postsLoading: false, loadingMorePosts: false, postsError: action.payload };

    case POST_TYPES.LOADING_MORE_POSTS:
      return { ...state, loadingMorePosts: true, postsError: null };

    case POST_TYPES.LOAD_MORE_POSTS_SUCCESS: {
      const payloadPagination = action.payload.pagination || {};
      return {
        ...state,
        loadingMorePosts: false,
        posts: [...state.posts, ...(action.payload.posts || [])],
        hasMorePosts: payloadPagination.hasMore ?? false,
        pagination: {
          currentPage: payloadPagination.currentPage || state.pagination.currentPage,
          totalPages: payloadPagination.totalPages || state.pagination.totalPages,
          totalPosts: payloadPagination.totalPosts || state.pagination.totalPosts,
          limit: payloadPagination.limit || state.pagination.limit
        }
      };
    }

    case POST_TYPES.LOAD_MORE_POSTS_FAIL:
      return { ...state, loadingMorePosts: false, postsError: action.payload };

    case POST_TYPES.RESET_CATEGORY_POSTS:
      return {
        ...state,
        posts: [],
        postsLoading: false,
        loadingMorePosts: false,
        hasMorePosts: true,
        postsError: null,
        pagination: { ...initialState.pagination }
      };

    // ========== POSTS GENERALES ==========
    case POST_TYPES.LOADING_POST:
      return { ...state, loading: action.payload };

    case POST_TYPES.CREATE_POST:
      return { ...state, posts: [action.payload, ...state.posts], result: state.result + 1 };

    case POST_TYPES.GET_POSTS:
      return {
        ...state,
        posts: action.payload.posts || [],
        result: action.payload.total || 0,
        page: action.payload.page || 1,
        loading: false
      };

    case POST_TYPES.GET_POST:
      return { ...state, detailPost: action.payload, loading: false };

    case POST_TYPES.GET_POST_BY_ID:
      return { ...state, postToEdit: action.payload };

    case POST_TYPES.UPDATE_POST:
      return {
        ...state,
        posts: state.posts.map(post => post._id === action.payload._id ? action.payload : post),
        detailPost: state.detailPost?._id === action.payload._id ? action.payload : state.detailPost
      };

    case POST_TYPES.DELETE_POST:
      return { ...state, posts: DeleteData(state.posts, action.payload._id) };

    case POST_TYPES.SET_POST_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
        posts: [],
        page: 1,
        result: 0,
        pagination: { ...initialState.pagination }
      };

    // ========== POSTS SIMILARES (ÚNICO CASO) ==========
    case POST_TYPES.LOADING_SIMILAR_POSTS:
      console.log('⏳ REDUCER LOADING_SIMILAR_POSTS:', action.payload);
      return {
        ...state,
        similarLoading: action.payload
      };

    case POST_TYPES.GET_SIMILAR_POSTS:
      console.log('🔥 REDUCER GET_SIMILAR_POSTS - payload completo:', action.payload);
      
      const { 
        posts: newSimilarPosts = [],
        page: newPage = 1,
        total: newTotal = 0,
        totalPages: newTotalPages = 1,
        hasMore: newHasMore = false,
        currentPostId: newCurrentPostId 
      } = action.payload;
      
      // Validar que sea un array
      const safeSimilarPosts = Array.isArray(newSimilarPosts) ? newSimilarPosts : [];
      
      console.log('📊 Similar posts procesados:', {
        safeLength: safeSimilarPosts.length,
        guardandoEn: 'similarPostsArray'
      });
      
      // Si es página 1 o es un post diferente, reemplazar
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
          error: null
        };
      }
      
      // Agregar más posts (paginación)
      return {
        ...state,
        similarPostsArray: [...state.similarPostsArray, ...safeSimilarPosts],  // ✅ Agregamos a similarPostsArray
        similarPostsTotal: newTotal,
        similarPostsPage: newPage,
        similarPostsTotalPages: newTotalPages,
        similarPostsHasMore: newHasMore,
        similarLoading: false,
        error: null
      };

    case POST_TYPES.CLEAR_SIMILAR_POSTS:
      return {
        ...state,
        similarPostsArray: [],  // ✅ Limpiamos similarPostsArray
        similarPostsTotal: 0,
        similarPostsPage: 1,
        similarPostsTotalPages: 1,
        similarPostsHasMore: false,
        similarLoading: false,
        currentSimilarPostId: null
      };

    // ========== LIKES & SAVES ==========
    case POST_TYPES.LIKE_POST:
    case POST_TYPES.UNLIKE_POST:
      return {
        ...state,
        posts: state.posts.map(post => post._id === action.payload._id ? action.payload : post),
        detailPost: state.detailPost?._id === action.payload._id ? action.payload : state.detailPost
      };

    case POST_TYPES.SAVE_POST:
      return {
        ...state,
        posts: state.posts.map(post => post._id === action.payload.postId ? { ...post, saved: [...(post.saved || []), action.payload.userId] } : post)
      };

    case POST_TYPES.UNSAVE_POST:
      return {
        ...state,
        posts: state.posts.map(post => post._id === action.payload.postId ? { ...post, saved: (post.saved || []).filter(id => id !== action.payload.userId) } : post)
      };

    // ========== ERRORES ==========
    case POST_TYPES.ERROR_POST:
      return { ...state, error: action.payload, loading: false, similarLoading: false };

    case POST_TYPES.CLEAR_POST_ERROR:
      return { ...state, error: null };

    case POST_TYPES.RESET_POST_STATE:
      return { ...initialState };

    case GLOBALTYPES.ALERT:
      if (action.payload.error && action.payload.error.includes('post')) {
        return { ...state, error: action.payload.error };
      }
      return state;

    default:
      return state;
  }
};

export default postReducer;