// 📂 redux/reducers/categoryReducer.js

import * as types from '../constants/categoryConstants';

const initialState = {

  sliderCategories: [],
  sliderLoading: false,
  sliderError: null,


  // ==================== PARA HOME ====================
  categories: [],
  loading: false,
  error: null,
  currentPage: 1,
  hasMoreCategories: true,
  totalCategories: 0,
  totalPages: 1,
  
  // ==================== PARA CATEGORY PAGE ====================
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
  postsTotal: 0,
  
  // ==================== PARA CATEGORY ACCORDION ====================
  accordionCategories: [],
  accordionLoading: false,
  accordionError: null,
  
  // ==================== PARA FILTROS ====================
  filterOptions: null
};

export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.GET_SLIDER_CATEGORIES:
      return { ...state, sliderLoading: true, sliderError: null };
      
    case types.GET_SLIDER_CATEGORIES_SUCCESS:
      console.log('🎠 Reducer slider - categorías:', action.payload?.length || 0);
      return {
        ...state,
        sliderCategories: action.payload || [],
        sliderLoading: false,
        sliderError: null
      };
      
    case types.GET_SLIDER_CATEGORIES_FAIL:
      return {
        ...state,
        sliderLoading: false,
        sliderError: action.payload
      };
    
    case types.LOADING:
      return { ...state, loading: action.payload };
      
    case types.LOADING_HOME:
      return { ...state, loading: action.payload };
      
    case types.GET_ALL_CATEGORIES_WITH_POSTS:
      return { ...state, loading: true, error: null };
      
    case types.GET_ALL_CATEGORIES_WITH_POSTS_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: action.payload.categories || [],
        currentPage: action.payload.currentPage || 1,
        hasMoreCategories: action.payload.hasMoreCategories || false,
        totalCategories: action.payload.totalCategories || 0,
        totalPages: action.payload.totalPages || 1,
        error: null
      };
      
    case types.GET_ALL_CATEGORIES_WITH_POSTS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
        categories: []
      };
      
    case types.LOAD_MORE_CATEGORIES:
      return { ...state, loading: true };
      
    // ==================== ACCORDION ====================
    case types.LOADING_CATEGORIES_ACCORDION:
      return { ...state, accordionLoading: action.payload };
      
    case types.GET_CATEGORIES_FOR_ACCORDION_SUCCESS:
      return {
        ...state,
        accordionCategories: action.payload || [],
        accordionLoading: false,
        accordionError: null
      };
      
    case types.GET_CATEGORIES_FOR_ACCORDION_FAIL:
      return {
        ...state,
        accordionLoading: false,
        accordionError: action.payload
      };
      
    // ==================== CATEGORY PAGE ====================
    case types.GET_CATEGORY_POSTS:
      return { ...state, postsLoading: true, postsError: null };
      
    case types.GET_CATEGORY_POSTS_SUCCESS:
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
      
    case types.GET_CATEGORY_POSTS_FAIL:
      return {
        ...state,
        postsLoading: false,
        postsError: action.payload
      };
      
    case types.LOAD_MORE_POSTS:
      return { ...state, postsLoading: true };
      
    // ==================== CATEGORY TREE ====================
    case types.GET_CATEGORY_TREE:
      return { ...state, loading: true };
      
    case types.GET_CATEGORY_TREE_SUCCESS:
      return {
        ...state,
        loading: false,
        categoryTree: action.payload
      };
      
    case types.GET_CATEGORY_TREE_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    // ==================== NAVEGACIÓN ====================
    case types.SET_ACTIVE_CATEGORY:
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
      
    case types.SET_ACTIVE_SUBCATEGORY:
      return {
        ...state,
        activeSubcategory: action.payload,
        activeArticle: null
      };
      
    case types.SET_ACTIVE_ARTICLE:
      return {
        ...state,
        activeArticle: action.payload,
        posts: [],
        postsCurrentPage: 1,
        hasMorePosts: false,
        postsLoading: false,
        postsError: null
      };
      
    // ==================== FILTROS ====================
    case types.GET_FILTER_OPTIONS:
      return { ...state, loading: true };
      
    case types.GET_FILTER_OPTIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        filterOptions: action.payload
      };
      
    case types.GET_FILTER_OPTIONS_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    // ==================== LIMPIEZA ====================
    case types.RESET_CATEGORY_STATE:
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
      
    case types.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        postsError: null,
        accordionError: null
      };
      
    case types.CATEGORY_RESET_POSTS:
      return {
        ...state,
        posts: [],
        hasMorePosts: true,
        postsLoading: false,
      };
      
    default:
      return state;
  }
};

export default categoryReducer;