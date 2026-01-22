// actions/categoryAction.js - VERSIÓN CORREGIDA
import * as types from '../constants/categoryConstants';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// ✅ 1. ACCIÓN PARA HOME: Obtener categorías principales
export const getAllCategoriesWithPosts = (page = 1, limit = 8) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_ALL_CATEGORIES_WITH_POSTS });
    
    console.log('📡 Llamando a /api/categories/main?posts=true...');

    // ⭐ CRÍTICO: Agregar posts=true en los parámetros
    const { data } = await axios.get(API_URL + '/api/categories/main', {
      params: { 
        page: page, 
        limit: limit,
        posts: true  // ⭐ ESTE PARÁMETRO ES ESENCIAL
      }
    });

    // ⭐ DEBUG DETALLADO (sintaxis compatible)
    console.log('✅ Datos recibidos:');
    console.log({
      success: data.success,
      categoriesCount: data.categories ? data.categories.length : 0,
      primeraCategoria: data.categories && data.categories[0] ? data.categories[0].name : null,
      postsEnPrimera: data.categories && data.categories[0] && data.categories[0].posts ? 
                     data.categories[0].posts.length : 0,
      estructuraPosts: data.categories && data.categories[0] && data.categories[0].posts ? 
                      data.categories[0].posts[0] : null
    });

    // ⭐ VERIFICAR SI HAY POSTS
    const categoriesWithPosts = data.categories || [];
    
    categoriesWithPosts.forEach(function(cat, index) {
      console.log('📦 Categoría ' + (index + 1) + ': ' + cat.name);
      console.log({
        tienePosts: !!(cat.posts),
        postsCount: cat.posts ? cat.posts.length : 0,
        esArray: Array.isArray(cat.posts)
      });
    });

    dispatch({
      type: types.GET_ALL_CATEGORIES_WITH_POSTS_SUCCESS,
      payload: {
        categories: categoriesWithPosts,
        currentPage: page,
        hasMore: data.pagination && data.pagination.hasNextPage ? data.pagination.hasNextPage : false,
        totalPages: data.pagination && data.pagination.totalPages ? data.pagination.totalPages : 1
      }
    });

    return data;

  } catch (error) {
    console.error('❌ Error en getAllCategoriesWithPosts:');
    console.log({
      message: error.message,
      response: error.response ? error.response.data : null,
      url: error.config ? error.config.url : null,
      params: error.config ? error.config.params : null
    });

    const errorMessage = error.response && error.response.data && error.response.data.message 
                       ? error.response.data.message 
                       : error.message || 'Error al obtener categorías principales';

    dispatch({
      type: types.GET_ALL_CATEGORIES_WITH_POSTS_FAIL,
      payload: errorMessage
    });

    return { 
      success: false, 
      categories: [], 
      pagination: { hasNextPage: false } 
    };
  }
};

// ✅ 2. ACCIÓN PARA CATEGORÍA ESPECÍFICA CON POSTS - CORREGIDA COMPLETAMENTE
export const getCategoryPosts = (categorySlug, subSlug = null, articleSlug = null, page = 1, limit = 12) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_CATEGORY_POSTS });

    const params = { page, limit };
    if (categorySlug) params.category = categorySlug;
    if (subSlug) params.sub = subSlug;
    if (articleSlug) params.article = articleSlug;

    console.log('📡 Action getCategoryPosts - Llamando API:', params);
    
    const { data } = await axios.get(`${API_URL}/api/posts/filter`, { params });

    // ⭐ DEBUG COMPLETO DE LA RESPUESTA
    console.log('✅ Action getCategoryPosts - Respuesta COMPLETA del backend:', {
      success: data.success,
      postsCount: data.posts ? data.posts.length : 0,
      hasMoreRoot: data.hasMore,                    // hasMore en root
      hasMorePagination: data.pagination?.hasMore,  // hasMore en pagination
      totalRoot: data.total,                        // total en root
      totalPagination: data.pagination?.totalPosts, // total en pagination
      categoryInfo: data.category,
      childrenCount: data.children ? data.children.length : 0,
      pagination: data.pagination,
      // Muestra los primeros 3 posts para verificar
      samplePosts: data.posts ? data.posts.slice(0, 3) : []
    });

    // ⭐ CORRECCIÓN CRÍTICA: Determinar hasMore correctamente
    let hasMoreValue = false;
    let totalPagesValue = 1;
    let totalPostsValue = 0;

    // 1. Prioridad: hasMore en root
    if (data.hasMore !== undefined) {
      hasMoreValue = data.hasMore;
    }
    // 2. Alternativa: hasMore en pagination
    else if (data.pagination?.hasMore !== undefined) {
      hasMoreValue = data.pagination.hasMore;
    }
    // 3. Alternativa: calcular de totalPages
    else if (data.pagination?.totalPages !== undefined) {
      hasMoreValue = page < data.pagination.totalPages;
      totalPagesValue = data.pagination.totalPages;
    }

    // Determinar totalPosts
    if (data.total !== undefined) {
      totalPostsValue = data.total;
    } else if (data.pagination?.totalPosts !== undefined) {
      totalPostsValue = data.pagination.totalPosts;
    }

    // ⭐ Actualizar estado activo
    if (categorySlug) {
      dispatch({ type: types.SET_ACTIVE_CATEGORY, payload: categorySlug });
    }
    if (subSlug) {
      dispatch({ type: types.SET_ACTIVE_SUBCATEGORY, payload: subSlug });
    }
    if (articleSlug) {
      dispatch({ type: types.SET_ACTIVE_ARTICLE, payload: articleSlug });
    }

    // ⭐ Payload corregido - Mapeo exacto
    const payload = {
      categoryInfo: data.category || {},
      children: data.children || [],
      posts: data.posts || [],
      currentPage: page,
      hasMore: hasMoreValue,
      totalPages: data.pagination?.totalPages || totalPagesValue,
      totalPosts: totalPostsValue
    };

    console.log('📤 Action getCategoryPosts - Payload a enviar al reducer:', {
      postsCount: payload.posts.length,
      hasMore: payload.hasMore,
      currentPage: payload.currentPage,
      totalPosts: payload.totalPosts
    });

    dispatch({
      type: types.GET_CATEGORY_POSTS_SUCCESS,
      payload: payload
    });

    return data;

  } catch (error) {
    console.error('❌ Action getCategoryPosts - Error:', {
      message: error.message,
      response: error.response ? error.response.data : null,
      config: error.config ? {
        url: error.config.url,
        params: error.config.params
      } : null
    });
    
    const errorMessage = error.response && error.response.data ? 
      error.response.data.message : 
      `Error al obtener posts para ${categorySlug}`;

    dispatch({
      type: types.GET_CATEGORY_POSTS_FAIL,
      payload: errorMessage
    });

    throw error;
  }
};

// ✅ 4. ACCIÓN PARA SCROLL INFINITO EN CATEGORY PAGE - CORREGIDA
export const loadMorePosts = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const { 
      activeCategory, 
      activeSubcategory, 
      activeArticle,
      postsCurrentPage = 0,  // ⭐ CAMBIAR a 0 por defecto
      posts = []
    } = state.category || {};

    const nextPage = postsCurrentPage + 1;

    console.log('📡 Action loadMorePosts - Cargando página:', {
      nextPage: nextPage,
      activeCategory: activeCategory,
      postsActuales: posts.length
    });

    dispatch({ type: types.LOAD_MORE_POSTS });

    const params = { page: nextPage, limit: 12 };
    if (activeCategory) params.category = activeCategory;
    if (activeSubcategory) params.sub = activeSubcategory;
    if (activeArticle) params.article = activeArticle;

    const { data } = await axios.get(`${API_URL}/api/posts/filter`, { params });

    console.log('✅ Action loadMorePosts - Respuesta:', {
      postsNuevos: data.posts ? data.posts.length : 0,
      hasMore: data.hasMore,
      nextPage: nextPage
    });

    // ⭐ CORRECCIÓN: Determinar hasMore igual que arriba
    let hasMoreValue = false;
    if (data.hasMore !== undefined) {
      hasMoreValue = data.hasMore;
    } else if (data.pagination?.hasMore !== undefined) {
      hasMoreValue = data.pagination.hasMore;
    } else if (data.pagination?.totalPages !== undefined) {
      hasMoreValue = nextPage < data.pagination.totalPages;
    }

    dispatch({
      type: types.GET_CATEGORY_POSTS_SUCCESS,
      payload: {
        categoryInfo: data.category || {},
        children: data.children || [],
        posts: [...posts, ...(data.posts || [])], // ⭐ Concatenar posts
        currentPage: nextPage,
        hasMore: hasMoreValue,
        totalPages: data.pagination?.totalPages || 1,
        totalPosts: data.total || data.pagination?.totalPosts || 0
      }
    });

    return data;

  } catch (error) {
    console.error('❌ Error cargando más posts:', error);
    
    // ⭐ IMPORTANTE: Despachar error específico
    dispatch({
      type: types.GET_CATEGORY_POSTS_FAIL,
      payload: error.response?.data?.message || 'Error al cargar más posts'
    });
    
    throw error;
  }
};
 

// ✅ 3. ACCIÓN PARA SCROLL INFINITO EN HOME
export const loadMoreCategories = (nextPage) => async (dispatch, getState) => {
  try {
    const state = getState();
    const currentPage = state.category?.currentPage || 1;
    const pageToLoad = nextPage || currentPage + 1;

    dispatch({ type: types.LOAD_MORE_CATEGORIES });

    const { data } = await axios.get(`${API_URL}/api/categories/main`, {
      params: { page: pageToLoad, limit: 8 }
    });

    const currentCategories = state.category?.categories || [];

    dispatch({
      type: types.GET_ALL_CATEGORIES_WITH_POSTS_SUCCESS,
      payload: {
        categories: [...currentCategories, ...(data.categories || data)],
        currentPage: pageToLoad,
        hasMore: data.pagination?.hasNextPage || false,
        totalPages: data.pagination?.totalPages || 1
      }
    });

    return data;

  } catch (error) {
    console.error('Error cargando más categorías:', error);
    throw error;
  }
};

// ✅ 4. ACCIÓN PARA SCROLL INFINITO EN CATEGORY PAGE - CORREGIDA
 
 
// ✅ 2. AGREGAR ACCIÓN PARA ÁRBOL DE CATEGORÍAS (si la necesitas)
export const getCategoryTree = () => async (dispatch) => {
  try {
    dispatch({ type: types.LOADING, payload: true });
    dispatch({ type: types.GET_CATEGORY_TREE });

    const { data } = await axios.get(`${API_URL}/api/categories/tree`);

    console.log('✅ Category tree data:', data);

    dispatch({
      type: types.GET_CATEGORY_TREE_SUCCESS,
      payload: data.tree || data
    });

    dispatch({ type: types.LOADING, payload: false });
    return data;

  } catch (error) {
    console.error('❌ Error en getCategoryTree:', {
      message: error.message,
      response: error.response?.data,
      url: `${API_URL}/api/categories/tree`
    });

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

// ✅ 3. ACCIÓN PARA CATEGORÍA ESPECÍFICA CON POSTS
 

// ... (las otras acciones se mantienen igual)

// ✅ 3. ACCIÓN PARA SCROLL INFINITO EN HOME (más categorías)
 
// ✅ 5. ACCIONES PARA NAVEGACIÓN ENTRE NIVELES
export const setActiveCategory = (categorySlug) => (dispatch) => {
  dispatch({ 
    type: types.SET_ACTIVE_CATEGORY, 
    payload: categorySlug 
  });
  // Resetear subniveles
  dispatch({ type: types.SET_ACTIVE_SUBCATEGORY, payload: null });
  dispatch({ type: types.SET_ACTIVE_ARTICLE, payload: null });
};

export const setActiveSubcategory = (subSlug) => (dispatch) => {
  dispatch({ 
    type: types.SET_ACTIVE_SUBCATEGORY, 
    payload: subSlug 
  });
  // Resetear artículo
  dispatch({ type: types.SET_ACTIVE_ARTICLE, payload: null });
};

export const setActiveArticle = (articleSlug) => (dispatch) => {
  dispatch({ 
    type: types.SET_ACTIVE_ARTICLE, 
    payload: articleSlug 
  });
};

// ✅ 6. ACCIÓN PARA LIMPIAR ERRORES
export const clearCategoryErrors = () => (dispatch) => {
  dispatch({ type: types.CLEAR_ERRORS });
};

// ✅ 7. ACCIÓN PARA RESETEAR ESTADO DE CATEGORÍA
export const resetCategoryState = () => (dispatch) => {
  dispatch({ type: types.SET_ACTIVE_CATEGORY, payload: null });
  dispatch({ type: types.SET_ACTIVE_SUBCATEGORY, payload: null });
  dispatch({ type: types.SET_ACTIVE_ARTICLE, payload: null });
  // También puedes despachar un tipo específico de reset si lo necesitas
};