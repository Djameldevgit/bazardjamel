// redux/reducers/boutiquePostReducer.js
import { BOUTIQUE_POST_TYPES } from "../actions/boutiquePostAction";
import { GLOBALTYPES } from "../actions/globalTypes";

// 🔧 Helpers
const updatePostInArray = (arr, updatedPost) => {
  if (!arr || !Array.isArray(arr)) return [];
  return arr.map(post =>
    post._id === updatedPost._id ? updatedPost : post
  );
};

const deletePostFromArray = (arr, postId) => {
  if (!arr || !Array.isArray(arr)) return [];
  return arr.filter(post => post._id !== postId);
};

const initialState = {
  // 🏬 Productos por boutique
  products: {
    // [boutiqueId]: { posts: [], total: 0, page: 1, totalPages: 1, hasMore: false }
  },

  // 🌍 Feed global
  feed: {
    posts: [],
    page: 1,
    hasMore: true,
    total: 0
  },

  // 🔄 Estados de carga
  loading: false,
  loadingFeed: false,
  loadingProducts: false  // ← NUEVO: estado de carga específico para productos
};

const boutiquePostReducer = (state = initialState, action) => {
  switch (action.type) {

    // =========================
    // 🔄 LOADING GLOBAL
    // =========================
    case BOUTIQUE_POST_TYPES.LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case BOUTIQUE_POST_TYPES.LOADING_FEED:
      return {
        ...state,
        loadingFeed: action.payload
      };

    // 🔄 LOADING BOUTIQUE PRODUCTS
    case BOUTIQUE_POST_TYPES.LOADING_BOUTIQUE_PRODUCTS:
      return {
        ...state,
        loadingProducts: action.payload
      };

    // =========================
    // 🏬 GET POSTS POR BOUTIQUE
    // =========================
    case BOUTIQUE_POST_TYPES.GET_BOUTIQUE_POSTS:
    case 'GET_BOUTIQUE_PRODUCTS': {  // ← Compatibilidad con ambos tipos
      const { boutiqueId, posts, total, page, totalPages, hasMore } = action.payload;
      
      // Obtener los posts (pueden venir como 'posts' o 'products')
      const postsData = action.payload.posts || action.payload.products || [];
      
      const existing = state.products[boutiqueId];
      
      // Calcular hasMore si no viene en el payload
      const finalHasMore = hasMore !== undefined ? hasMore : (page < (totalPages || 1));
      
      console.log('📦 Reducer GET_BOUTIQUE_POSTS:', {
        boutiqueId,
        postsCount: postsData.length,
        total,
        page,
        totalPages,
        hasMore: finalHasMore
      });

      return {
        ...state,
        products: {
          ...state.products,
          [boutiqueId]: {
            posts: page === 1
              ? postsData
              : [...(existing?.posts || []), ...postsData],
            total: total || 0,
            page: page || 1,
            totalPages: totalPages || 1,
            hasMore: finalHasMore
          }
        }
      };
    }

    // =========================
    // ➕ CREATE POST / ADD PRODUCT
    // =========================
    case BOUTIQUE_POST_TYPES.CREATE_BOUTIQUE_POST:
    case BOUTIQUE_POST_TYPES.ADD_BOUTIQUE_PRODUCT: {
      const post = action.payload.post || action.payload;
      const boutiqueId = action.payload.boutiqueId || post?.boutique;

      if (!boutiqueId) return state;

      const currentProducts = state.products[boutiqueId];
      const currentPosts = currentProducts?.posts || [];
      const currentTotal = currentProducts?.total || 0;

      console.log('📦 Reducer ADD_PRODUCT:', {
        boutiqueId,
        postId: post._id,
        currentTotal
      });

      return {
        ...state,
        products: {
          ...state.products,
          [boutiqueId]: {
            posts: [post, ...currentPosts],
            total: currentTotal + 1,
            page: 1,
            totalPages: Math.ceil((currentTotal + 1) / 12),
            hasMore: true
          }
        },
        feed: {
          ...state.feed,
          posts: [post, ...state.feed.posts]
        }
      };
    }

    // =========================
    // ✏️ UPDATE POST / UPDATE PRODUCT
    // =========================
    case BOUTIQUE_POST_TYPES.UPDATE_BOUTIQUE_POST:
    case BOUTIQUE_POST_TYPES.UPDATE_BOUTIQUE_PRODUCT: {
      const updatedPost = action.payload.post || action.payload;
      const boutiqueId = action.payload.boutiqueId || updatedPost?.boutique;

      if (!boutiqueId) return state;

      return {
        ...state,
        products: {
          ...state.products,
          [boutiqueId]: {
            ...state.products[boutiqueId],
            posts: updatePostInArray(
              state.products[boutiqueId]?.posts || [],
              updatedPost
            )
          }
        },
        feed: {
          ...state.feed,
          posts: updatePostInArray(state.feed.posts, updatedPost)
        }
      };
    }

    // =========================
    // ❌ DELETE POST / REMOVE PRODUCT
    // =========================
    case BOUTIQUE_POST_TYPES.DELETE_BOUTIQUE_POST:
    case BOUTIQUE_POST_TYPES.REMOVE_BOUTIQUE_PRODUCT:
    case BOUTIQUE_POST_TYPES.DELETE_BOUTIQUE_PRODUCT: {
      const { postId, boutiqueId } = action.payload;
      
      if (!boutiqueId || !postId) return state;

      const currentProducts = state.products[boutiqueId];
      const currentPosts = currentProducts?.posts || [];
      const currentTotal = currentProducts?.total || 0;

      return {
        ...state,
        products: {
          ...state.products,
          [boutiqueId]: {
            ...currentProducts,
            posts: deletePostFromArray(currentPosts, postId),
            total: Math.max(currentTotal - 1, 0),
            totalPages: Math.ceil(Math.max(currentTotal - 1, 0) / 12)
          }
        },
        feed: {
          ...state.feed,
          posts: deletePostFromArray(state.feed.posts, postId)
        }
      };
    }

    // =========================
    // 🌍 FEED GLOBAL
    // =========================
    case BOUTIQUE_POST_TYPES.GET_FEED_POSTS: {
      const { posts, page, hasMore, total } = action.payload;

      return {
        ...state,
        feed: {
          posts: page === 1
            ? posts
            : [...state.feed.posts, ...posts],
          page: page || 1,
          hasMore: hasMore !== undefined ? hasMore : false,
          total: total || 0
        }
      };
    }

    // =========================
    // ⚠️ ERROR GLOBAL
    // =========================
    case GLOBALTYPES.ALERT:
      return state;

    default:
      return state;
  }
};

export default boutiquePostReducer;