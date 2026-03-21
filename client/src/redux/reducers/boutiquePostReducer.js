import { BOUTIQUE_POST_TYPES } from "../actions/boutiquePostAction";
import { GLOBALTYPES } from "../actions/globalTypes";

// 🔧 Helpers
const updatePostInArray = (arr, updatedPost) => {
  return arr.map(post =>
    post._id === updatedPost._id ? updatedPost : post
  );
};

const deletePostFromArray = (arr, postId) => {
  return arr.filter(post => post._id !== postId);
};

const initialState = {
  // 🏬 Productos por boutique
  products: {
    // [boutiqueId]: { posts: [], total: 0, page: 1 }
  },

  // 🌍 Feed global (mezcla inteligente)
  feed: {
    posts: [],
    page: 1,
    hasMore: true
  },

  // 🔄 Estados de carga
  loading: false,
  loadingFeed: false
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

    // =========================
    // 🏬 GET POSTS POR BOUTIQUE
    // =========================
    case BOUTIQUE_POST_TYPES.GET_BOUTIQUE_POSTS: {
      const { boutiqueId, posts, total, page } = action.payload;

      const existing = state.products[boutiqueId];

      return {
        ...state,
        products: {
          ...state.products,
          [boutiqueId]: {
            posts: page === 1
              ? posts
              : [...(existing?.posts || []), ...posts],
            total,
            page
          }
        }
      };
    }

    // =========================
    // ➕ CREATE POST
    // =========================
    case BOUTIQUE_POST_TYPES.CREATE_BOUTIQUE_POST: {
      const post = action.payload;
      const boutiqueId = post.boutique;

      return {
        ...state,
        products: {
          ...state.products,
          [boutiqueId]: {
            posts: [post, ...(state.products[boutiqueId]?.posts || [])],
            total: (state.products[boutiqueId]?.total || 0) + 1,
            page: 1
          }
        },
        feed: {
          ...state.feed,
          posts: [post, ...state.feed.posts]
        }
      };
    }

    // =========================
    // ✏️ UPDATE POST
    // =========================
    case BOUTIQUE_POST_TYPES.UPDATE_BOUTIQUE_POST: {
      const updatedPost = action.payload;
      const boutiqueId = updatedPost.boutique;

      return {
        ...state,

        // 🏬 update boutique
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

        // 🌍 update feed
        feed: {
          ...state.feed,
          posts: updatePostInArray(state.feed.posts, updatedPost)
        }
      };
    }

    // =========================
    // ❌ DELETE POST
    // =========================
    case BOUTIQUE_POST_TYPES.DELETE_BOUTIQUE_POST: {
      const { postId, boutiqueId } = action.payload;

      return {
        ...state,

        // 🏬 boutique
        products: {
          ...state.products,
          [boutiqueId]: {
            ...state.products[boutiqueId],
            posts: deletePostFromArray(
              state.products[boutiqueId]?.posts || [],
              postId
            ),
            total: Math.max(
              (state.products[boutiqueId]?.total || 1) - 1,
              0
            )
          }
        },

        // 🌍 feed
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
      const { posts, page, hasMore } = action.payload;

      return {
        ...state,
        feed: {
          posts: page === 1
            ? posts
            : [...state.feed.posts, ...posts],
          page,
          hasMore
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