// redux/reducers/categoryReducer.js - VERSIÓN SIMPLIFICADA
const initialState = {
  categories: [],
  loading: false,
  error: null,
  currentPage: 1,
  hasMoreCategories: true,
  
  activeCategory: null,
  activeSubcategory: null,
  activeArticle: null,
  categoryInfo: {},
  children: [],
  posts: [],
  postsLoading: false,
  postsError: null,
  postsCurrentPage: 1,
  hasMorePosts: false,
  postsTotal: 0
};

export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    // Home
    case 'LOADING':
      return { ...state, loading: action.payload };
      
    case 'GET_ALL_CATEGORIES_WITH_POSTS':
      return { ...state, loading: true, error: null };
      
    case 'GET_ALL_CATEGORIES_WITH_POSTS_SUCCESS':
      return {
        ...state,
        loading: false,
        categories: action.payload.categories || [],
        currentPage: action.payload.currentPage || 1,
        hasMoreCategories: action.payload.hasMore || false,
        error: null
      };
      
    case 'GET_ALL_CATEGORIES_WITH_POSTS_FAIL':
      return {
        ...state,
        loading: false,
        error: action.payload,
        categories: []
      };
      
    // Category Page
    case 'GET_CATEGORY_POSTS':
      return { ...state, postsLoading: true, postsError: null };
      
    case 'GET_CATEGORY_POSTS_SUCCESS':
      const isFirstPage = (action.payload.currentPage || 1) === 1;
      
      return {
        ...state,
        postsLoading: false,
        postsError: null,
        categoryInfo: isFirstPage 
          ? (action.payload.categoryInfo || {}) 
          : state.categoryInfo,
        children: isFirstPage 
          ? (action.payload.children || []) 
          : state.children,
        posts: isFirstPage 
          ? (action.payload.posts || []) 
          : [...state.posts, ...(action.payload.posts || [])],
        postsCurrentPage: action.payload.currentPage || 1,
        hasMorePosts: action.payload.hasMore || false,
        postsTotal: action.payload.totalPosts || action.payload.total || 0
      };
      
    case 'GET_CATEGORY_POSTS_FAIL':
      return {
        ...state,
        postsLoading: false,
        postsError: action.payload
      };
      
    case 'LOAD_MORE_POSTS':
      return { ...state, postsLoading: true };
      
    // Navegación
    case 'SET_ACTIVE_CATEGORY':
      return {
        ...state,
        activeCategory: action.payload,
        activeSubcategory: null,
        activeArticle: null,
        categoryInfo: {},
        children: [],
        posts: [],
        postsCurrentPage: 1,
        hasMorePosts: false,
        postsLoading: false,
        postsError: null
      };
      
    case 'SET_ACTIVE_SUBCATEGORY':
      return {
        ...state,
        activeSubcategory: action.payload,
        activeArticle: null,
        posts: [],
        postsCurrentPage: 1,
        hasMorePosts: false,
        postsLoading: false,
        postsError: null
      };
      
    case 'SET_ACTIVE_ARTICLE':
      return {
        ...state,
        activeArticle: action.payload,
        posts: [],
        postsCurrentPage: 1,
        hasMorePosts: false,
        postsLoading: false,
        postsError: null
      };
      
    case 'RESET_CATEGORY_STATE':
      return {
        ...state,
        categoryInfo: {},
        children: [],
        posts: [],
        postsCurrentPage: 1,
        hasMorePosts: false,
        postsLoading: false,
        postsError: null
      };
      
    case 'CLEAR_ERRORS':
      return {
        ...state,
        error: null,
        postsError: null
      };
      
    default:
      return state;
  }
};

export default categoryReducer;