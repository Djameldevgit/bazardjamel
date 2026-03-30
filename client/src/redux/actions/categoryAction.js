// 📂 redux/actions/categoryAction.js - VERSIÓN CORREGIDA

import * as types from '../constants/categoryConstants';
import axios from 'axios';
import { BASE_URL } from '../../utils/config';
// 📂 redux/actions/categoryAction.js

// 📂 redux/actions/categoryAction.js

export const getCategoryPosts = (
  categorySlug, 
  subSlug = null, 
  articleSlug = null, 
  page = 1, 
  limit = 12,
  wilaya = null,
  commune = null,
  minPrice = null,
  maxPrice = null,
  sortBy = 'recent'
) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_CATEGORY_POSTS });
    
    let slug = categorySlug;
    if (subSlug) slug = subSlug;
    if (articleSlug) slug = articleSlug;
    
    console.log(`📡 getCategoryPosts - Endpoint: /api/categories/posts/${slug}?page=${page}&limit=${limit}`);
    
    const { data } = await axios.get(`${BASE_URL}/api/categories/posts/${slug}`, {
      params: {
        page,
        limit,
        sub: subSlug,
        article: articleSlug,
        wilaya,
        commune,
        minPrice,
        maxPrice,
        sortBy
      }
    });
    
    console.log(`✅ Posts recibidos: ${data.posts?.length || 0}, total: ${data.total || 0}, página: ${data.page || page}`);
    
    const payload = {
      categoryInfo: data.categoryInfo || {},
      children: data.children || [],
      posts: data.posts || [],
      currentPage: data.page || page,  // ← Asegurar que viene del backend
      hasMore: data.hasMore || false,
      totalPages: data.totalPages || 1,
      totalPosts: data.total || 0
    };
    
    dispatch({
      type: types.GET_CATEGORY_POSTS_SUCCESS,
      payload: payload
    });
    
    return payload;
    
  } catch (error) {
    console.error('❌ Error en getCategoryPosts:', error);
    dispatch({
      type: types.GET_CATEGORY_POSTS_FAIL,
      payload: error.response?.data?.message || error.message
    });
    return { success: false, posts: [] };
  }
};
// 📂 redux/actions/categoryAction.js
/*
export const getCategoryPosts = (
  categorySlug, 
  subSlug = null, 
  articleSlug = null, 
  page = 1, 
  limit = 12
) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_CATEGORY_POSTS });
    
    // 🔥 USAR EL NUEVO ENDPOINT
    let slug = categorySlug;
    if (subSlug) slug = subSlug;
    if (articleSlug) slug = articleSlug;
    
    console.log(`📡 getCategoryPosts - Endpoint: /api/categories/posts/${slug}?page=${page}&limit=${limit}`);
    
    const { data } = await axios.get(`${BASE_URL}/api/categories/posts/${slug}`, {
      params: { page, limit }
    });
    
    console.log(`✅ Posts recibidos: ${data.posts?.length || 0}, total: ${data.pagination?.totalPosts || 0}`);
    
    dispatch({
      type: types.GET_CATEGORY_POSTS_SUCCESS,
      payload: {
        categoryInfo: data.category || {},
        children: data.children || [],
        posts: data.posts || [],
        currentPage: data.pagination?.currentPage || page,
        hasMore: data.pagination?.hasMore || false,
        totalPages: data.pagination?.totalPages || 1,
        totalPosts: data.pagination?.totalPosts || 0
      }
    });
    
    return { success: true, ...data };
    
  } catch (error) {
    console.error('❌ Error en getCategoryPosts:', error);
    dispatch({
      type: types.GET_CATEGORY_POSTS_FAIL,
      payload: error.response?.data?.message || error.message
    });
    return { success: false };
  }
};

export const loadMorePosts = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const { 
      activeCategory, 
      activeSubcategory, 
      activeArticle,
      postsCurrentPage = 0,
      posts = []
    } = state.category || {};

    const nextPage = postsCurrentPage + 1;
    
    let slug = activeCategory;
    if (activeSubcategory) slug = activeSubcategory;
    if (activeArticle) slug = activeArticle;
    
    if (!slug) {
      console.error('❌ No hay categoría activa');
      return;
    }
    
    console.log(`📡 loadMorePosts - Cargando página ${nextPage} para ${slug}`);
    
    dispatch({ type: types.LOAD_MORE_POSTS });
    
    const { data } = await axios.get(`${BASE_URL}/api/categories/posts/${slug}`, {
      params: { page: nextPage, limit: 12 }
    });
    
    const newPosts = data.posts || [];
    const hasMore = data.pagination?.hasMore || false;
    
    dispatch({
      type: types.GET_CATEGORY_POSTS_SUCCESS,
      payload: {
        categoryInfo: state.category.categoryInfo,
        children: state.category.children,
        posts: [...posts, ...newPosts],
        currentPage: nextPage,
        hasMore: hasMore,
        totalPages: data.pagination?.totalPages || 1,
        totalPosts: data.pagination?.totalPosts || state.category.postsTotal
      }
    });
    
  } catch (error) {
    console.error('❌ Error cargando más posts:', error);
    dispatch({
      type: types.GET_CATEGORY_POSTS_FAIL,
      payload: error.response?.data?.message || 'Error al cargar más posts'
    });
  }
};*/
export const resetCategoryPosts = () => (dispatch) => {
  dispatch({ type: types.CATEGORY_RESET_POSTS });
};
export const getSliderCategories = () => async (dispatch) => {
  try {
    dispatch({ type: types.GET_SLIDER_CATEGORIES });
    
    const { data } = await axios.get(`${BASE_URL}/api/categories/slider`);
    
    console.log('🎠 Categorías para slider:', data.categories?.length || 0);
    
    dispatch({
      type: types.GET_SLIDER_CATEGORIES_SUCCESS,
      payload: data.categories || []
    });
    
    return { success: true, categories: data.categories };
    
  } catch (error) {
    console.error('❌ Error en getSliderCategories:', error);
    dispatch({
      type: types.GET_SLIDER_CATEGORIES_FAIL,
      payload: error.response?.data?.message || error.message
    });
    return { success: false };
  }
};
// ==================== ACCIÓN PARA HOME CON PAGINACIÓN ====================
export const getAllCategoriesWithPosts = (page = 1, limit = 2) => async (dispatch) => {
  try {
    dispatch({ type: types.LOADING_HOME, payload: true });
    dispatch({ type: types.GET_ALL_CATEGORIES_WITH_POSTS });
    
    const { data } = await axios.get(`${BASE_URL}/api/categories/main`, {
      params: { 
        page, 
        limit, 
        posts: true 
      }
    });
    
    console.log('📊 Response Home:', {
      page,
      categoriesCount: data.categories?.length || 0,
      pagination: data.pagination,
      postsPerCategory: data.categories?.[0]?.posts?.length || 0
    });
    
    dispatch({
      type: types.GET_ALL_CATEGORIES_WITH_POSTS_SUCCESS,
      payload: {
        categories: data.categories || [],
        currentPage: data.pagination?.currentPage || page,
        hasMoreCategories: data.pagination?.hasMore || false,
        totalCategories: data.pagination?.totalCategories || 0,
        totalPages: data.pagination?.totalPages || 1
      }
    });
    
    dispatch({ type: types.LOADING_HOME, payload: false });
    
    return { 
      success: true, 
      categories: data.categories,
      pagination: data.pagination 
    };
    
  } catch (error) {
    console.error('❌ Error en getAllCategoriesWithPosts:', error);
    dispatch({
      type: types.GET_ALL_CATEGORIES_WITH_POSTS_FAIL,
      payload: error.response?.data?.message || error.message
    });
    dispatch({ type: types.LOADING_HOME, payload: false });
    return { success: false };
  }
};

// ==================== ACCIÓN PARA SCROLL INFINITO EN HOME ====================
export const loadMoreCategories = (nextPage) => async (dispatch, getState) => {
  try {
    const state = getState();
    const currentPage = state.category?.currentPage || 1;
    const pageToLoad = nextPage || currentPage + 1;

    dispatch({ type: types.LOAD_MORE_CATEGORIES });

    const { data } = await axios.get(`${BASE_URL}/api/categories/main`, {
      params: { page: pageToLoad, limit: 2, posts: true }
    });

    const currentCategories = state.category?.categories || [];

    dispatch({
      type: types.GET_ALL_CATEGORIES_WITH_POSTS_SUCCESS,
      payload: {
        categories: [...currentCategories, ...(data.categories || [])],
        currentPage: data.pagination?.currentPage || pageToLoad,
        hasMoreCategories: data.pagination?.hasMore || false,
        totalPages: data.pagination?.totalPages || 1,
        totalCategories: data.pagination?.totalCategories || 0
      }
    });

    return data;

  } catch (error) {
    console.error('Error cargando más categorías:', error);
    throw error;
  }
};

// ==================== ACCIÓN PARA ACCORDION ====================
export const getCategoriesForAccordion = () => async (dispatch) => {
  try {
    dispatch({ type: types.LOADING_CATEGORIES_ACCORDION, payload: true });
    
    console.log('📡 Obteniendo categorías para accordion...');
    
    const { data } = await axios.get(`${BASE_URL}/api/categories/accordion`);
    
    console.log('✅ Categorías para accordion recibidas:', {
      count: data.categories?.length || 0
    });
    
    dispatch({
      type: types.GET_CATEGORIES_FOR_ACCORDION_SUCCESS,
      payload: data.categories || []
    });
    
    dispatch({ type: types.LOADING_CATEGORIES_ACCORDION, payload: false });
    
    return { success: true, categories: data.categories };
    
  } catch (error) {
    console.error('❌ Error en getCategoriesForAccordion:', error);
    
    // Fallback si el endpoint no existe
    if (error.response?.status === 404) {
      console.log('⚠️ Endpoint /accordion no existe, usando alternativa...');
      
      try {
        const { data } = await axios.get(`${BASE_URL}/api/categories/main`, {
          params: { page: 1, limit: 100, hierarchical: true }
        });
        
        if (data.categories) {
          dispatch({
            type: types.GET_CATEGORIES_FOR_ACCORDION_SUCCESS,
            payload: data.categories
          });
          dispatch({ type: types.LOADING_CATEGORIES_ACCORDION, payload: false });
          return { success: true, categories: data.categories };
        }
      } catch (fallbackError) {
        console.error('❌ Error en fallback:', fallbackError);
      }
    }
    
    dispatch({
      type: types.GET_CATEGORIES_FOR_ACCORDION_FAIL,
      payload: error.response?.data?.message || error.message
    });
    dispatch({ type: types.LOADING_CATEGORIES_ACCORDION, payload: false });
    
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

  
 
// ==================== ACCIÓN PARA CARGAR MÁS POSTS (SCROLL INFINITO) ====================
 
// ==================== ACCIÓN PARA ÁRBOL DE CATEGORÍAS ====================
export const getCategoryTree = () => async (dispatch) => {
  try {
    dispatch({ type: types.LOADING, payload: true });
    dispatch({ type: types.GET_CATEGORY_TREE });

    const { data } = await axios.get(`${BASE_URL}/api/categories/tree`);

    console.log('✅ Category tree data:', data);

    dispatch({
      type: types.GET_CATEGORY_TREE_SUCCESS,
      payload: data.tree || data
    });

    dispatch({ type: types.LOADING, payload: false });
    return data;

  } catch (error) {
    console.error('❌ Error en getCategoryTree:', error);

    const errorMessage = error.response?.data?.message || 
                       'Error al obtener árbol de categorías';

    dispatch({
      type: types.GET_CATEGORY_TREE_FAIL,
      payload: errorMessage
    });

    dispatch({ type: types.LOADING, payload: false });
    throw error;
  }
};

// ==================== ACCIÓN PARA FILTROS ====================
// 📂 redux/actions/categoryAction.js

export const getFilterOptions = (categorySlug, subSlug = null, articleSlug = null) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_FILTER_OPTIONS });

    const params = { category: categorySlug };
    if (subSlug) params.sub = subSlug;
    if (articleSlug) params.article = articleSlug;

    // 🔥 CORREGIDO: Usar la ruta correcta /api/posts/filters/options
    const { data } = await axios.get(`${BASE_URL}/api/posts/filters/options`, { params });

    console.log('✅ getFilterOptions - Respuesta:', {
      childrenCount: data.children?.length || 0,
      wilayasCount: data.wilayas?.length || 0,
      priceRange: data.priceRange
    });

    dispatch({
      type: types.GET_FILTER_OPTIONS_SUCCESS,
      payload: {
        categoryInfo: data.categoryInfo,
        children: data.children || [],
        wilayas: data.wilayas || [],
        priceRange: data.priceRange || { min: 0, max: 1000000 }
      }
    });

    return data;
  } catch (error) {
    console.error('❌ Error en getFilterOptions:', error);
    dispatch({
      type: types.GET_FILTER_OPTIONS_FAIL,
      payload: error.response?.data?.message || error.message
    });
    throw error;
  }
};
// ==================== ACCIONES PARA NAVEGACIÓN ====================
export const setActiveCategory = (categorySlug) => (dispatch) => {
  dispatch({ 
    type: types.SET_ACTIVE_CATEGORY, 
    payload: categorySlug 
  });
  dispatch({ type: types.SET_ACTIVE_SUBCATEGORY, payload: null });
  dispatch({ type: types.SET_ACTIVE_ARTICLE, payload: null });
};

export const setActiveSubcategory = (subSlug) => (dispatch) => {
  dispatch({ 
    type: types.SET_ACTIVE_SUBCATEGORY, 
    payload: subSlug 
  });
  dispatch({ type: types.SET_ACTIVE_ARTICLE, payload: null });
};

export const setActiveArticle = (articleSlug) => (dispatch) => {
  dispatch({ 
    type: types.SET_ACTIVE_ARTICLE, 
    payload: articleSlug 
  });
};

// ==================== ACCIONES PARA LIMPIEZA ====================
export const clearCategoryErrors = () => (dispatch) => {
  dispatch({ type: types.CLEAR_ERRORS });
};

export const resetCategoryState = () => (dispatch) => {
  dispatch({ type: types.SET_ACTIVE_CATEGORY, payload: null });
  dispatch({ type: types.SET_ACTIVE_SUBCATEGORY, payload: null });
  dispatch({ type: types.SET_ACTIVE_ARTICLE, payload: null });
  dispatch({ type: types.RESET_CATEGORY_STATE });
};