// actions/categoryAction.js - VERSIÓN CORREGIDA
import * as types from '../constants/categoryConstants';
import axios from 'axios';

 
import { BASE_URL } from '../../utils/config'
 
export const resetCategoryPosts = () => (dispatch) => {
  dispatch({ type: "CATEGORY_RESET_POSTS" });
};
 
export const getAllCategoriesWithPosts = (page = 1, limit = 2) => async (dispatch) => {
  try {
    dispatch({ type: 'LOADING_HOME', payload: true });
    dispatch({ type: 'GET_ALL_CATEGORIES_WITH_POSTS' });
    
    const { data } = await axios.get(`${BASE_URL}/api/categories/main`, {
      params: { page, limit, posts: true }
    });
    
    
    console.log(data);
    
    dispatch({
      type: 'GET_ALL_CATEGORIES_WITH_POSTS_SUCCESS',
      payload: {
        categories: data.categories || [],
        currentPage: page,
        hasMore: data.categories?.length >= limit
      }
    });
    
    return { success: true, categories: data.categories };
    
  } catch (error) {
    console.error('❌ Error en getAllCategoriesWithPosts:', error);
    dispatch({
      type: 'GET_ALL_CATEGORIES_WITH_POSTS_FAIL',
      payload: error.response?.data?.message || error.message
    });
    return { success: false };
  }
};
 

 
// 🔥 NUEVA ACCIÓN: Para obtener categorías jerárquicas (para accordion)
export const getCategoriesForAccordion = () => async (dispatch) => {
  try {
    dispatch({ type: 'LOADING_CATEGORIES_ACCORDION', payload: true });
    
    console.log('📡 Obteniendo categorías para accordion...');
    
    // IMPORTANTE: Este endpoint debe devolver la estructura jerárquica completa
    // Si no existe, debes crearlo en tu backend
    const { data } = await axios.get(`${BASE_URL}/api/categories/accordion`);
    
    console.log('✅ Categorías para accordion recibidas:', {
      count: data.categories?.length || 0,
      estructura: data.categories?.[0]
    });
    
    dispatch({
      type: 'GET_CATEGORIES_FOR_ACCORDION_SUCCESS',
      payload: data.categories || []
    });
    
    return { success: true, categories: data.categories };
    
  } catch (error) {
    console.error('❌ Error en getCategoriesForAccordion:', error);
    
    // Si el endpoint no existe, podrías usar el endpoint existente
    // pero necesitas transformar los datos
    if (error.response?.status === 404) {
      console.log('⚠️ Endpoint /accordion no existe, usando alternativa...');
      
      try {
        // Intentar con el endpoint existente y transformar datos
        const { data } = await axios.get(`${BASE_URL}/api/categories/main`, {
          params: { page: 1, limit: 100, hierarchical: true }
        });
        
        if (data.categories) {
          dispatch({
            type: 'GET_CATEGORIES_FOR_ACCORDION_SUCCESS',
            payload: data.categories
          });
          return { success: true, categories: data.categories };
        }
      } catch (fallbackError) {
        console.error('❌ Error en fallback:', fallbackError);
      }
    }
    
    dispatch({
      type: 'GET_CATEGORIES_FOR_ACCORDION_FAIL',
      payload: error.response?.data?.message || error.message
    });
    
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
}

// 📂 actions/postAction.js - Action para Posts Recientes
export const getRecentPosts = (page = 1, limit = 12) => async (dispatch) => {
  try {
    dispatch({ type: POST_TYPES.GET_RECENT_POSTS });
    
    const { data } = await axios.get(`${BASE_URL}/api/posts/recent`, {
      params: { page, limit }
    });
    
    console.log('📦 Posts recientes recibidos:', data.recentPosts?.length || 0);
    
    dispatch({
      type: POST_TYPES.GET_RECENT_POSTS_SUCCESS,
      payload: {
        posts: data.recentPosts || [],
        page,
        hasMore: (data.recentPosts?.length || 0) >= limit,
        total: data.total || data.recentPosts?.length || 0
      }
    });
    
    return { success: true, posts: data.recentPosts };
    
  } catch (error) {
    console.error('❌ Error en getRecentPosts:', error);
    dispatch({
      type: POST_TYPES.GET_RECENT_POSTS_FAIL,
      payload: error.response?.data?.message || error.message
    });
    return { success: false };
  }
};
// ✅ 2. ACCIÓN PARA CATEGORÍA ESPECÍFICA CON POSTS - CORREGIDA COMPLETAMENTE
// ✅ ACCIÓN COMPLETA Y CORREGIDA PARA CATEGORYPAGE
// src/redux/actions/categoryAction.js - VERSIÓN ACTUALIZADA
export const getCategoryPosts = (categorySlug, subSlug = null, articleSlug = null, page = 1, limit = 12) => async (dispatch) => {
  try {
    dispatch({ type: types.GET_CATEGORY_POSTS });

   
    // ⭐ DECISIÓN CRÍTICA: ¿Qué necesitamos obtener?
    let endpoint = '';
    let params = {};
    
    // ⭐⭐ CAMBIO IMPORTANTE: USAR SIEMPRE EL ENDPOINT filterPosts
    // Este endpoint ahora devuelve todo: categoría, hijos (children) y posts
    endpoint = `${BASE_URL}/api/posts/filter`;
    params = { 
      category: categorySlug,
      page: page,
      limit: limit
    };
    
    // Añadir sub y article si existen
    if (subSlug) params.sub = subSlug;
    if (articleSlug) params.article = articleSlug;
    
    const { data } = await axios.get(endpoint, { params });
 

    // ⭐ SI HAY HIJOS, MOSTRAR TODOS CON SUS ICONOS
    const childrenList = data.children || [];
    if (childrenList.length > 0) {
     
      childrenList.forEach((child, i) => {
        console.log(`${i}. ${child.name || 'Sin nombre'} (Nivel ${child.level}):`, {
          icon: child.icon || '❌ NO TIENE',
          iconType: child.iconType || 'NO',
          iconColor: child.iconColor || 'NO',
          bgColor: child.bgColor || 'NO',
          slug: child.slug,
          hasChildren: child.hasChildren,
          isLeaf: child.isLeaf
        });
      });
      
      // Contar cuántos tienen icono
      const conIcono = childrenList.filter(c => c.icon).length;
      const sinIcono = childrenList.filter(c => !c.icon).length;
      console.log(`📊 ESTADÍSTICAS ICONOS: ${conIcono} con icono | ${sinIcono} sin icono`);
    }

    // ⭐ DETERMINAR HAS_MORE CORRECTAMENTE
    let hasMoreValue = false;
    let totalPagesValue = 1;
    let totalPostsValue = 0;

    // El controlador filterPosts devuelve hasMore directamente
    if (data.hasMore !== undefined) {
      hasMoreValue = data.hasMore;
    } else if (data.totalPages !== undefined) {
      // Si tiene totalPages, calcular hasMore
      hasMoreValue = page < data.totalPages;
      totalPagesValue = data.totalPages;
    }

    // Total de posts
    if (data.total !== undefined) {
      totalPostsValue = data.total;
    }

    console.log('📊 PAGINACIÓN CALCULADA:', {
      page,
      hasMoreValue,
      totalPagesValue,
      totalPostsValue
    });

    // ⭐ ACTUALIZAR ESTADO ACTIVO (siempre se ejecuta)
    if (categorySlug) {
      dispatch({ type: types.SET_ACTIVE_CATEGORY, payload: categorySlug });
    }
    if (subSlug) {
      dispatch({ type: types.SET_ACTIVE_SUBCATEGORY, payload: subSlug });
    }
    if (articleSlug) {
      dispatch({ type: types.SET_ACTIVE_ARTICLE, payload: articleSlug });
    }

    // ⭐ PREPARAR PAYLOAD - UNIFICAR ESTRUCTURA
    const payload = {
      // La categoría viene en categoryInfo
      categoryInfo: data.categoryInfo || {},
      
      // Los hijos vienen en children
      children: data.children || [],
      
      // Posts
      posts: data.posts || [],
      
      // Paginación
      currentPage: page,
      hasMore: hasMoreValue,
      totalPages: data.totalPages || totalPagesValue,
      totalPosts: totalPostsValue,
      
      // Para compatibilidad
      total: totalPostsValue
    };

    console.log('📤 Action getCategoryPosts - PAYLOAD FINAL:', {
      categoryName: payload.categoryInfo.name,
      categoryLevel: payload.categoryInfo.level,
      childrenCount: payload.children.length,
      childrenLevels: payload.children.map(c => c.level),
      postsCount: payload.posts.length,
      hasMore: payload.hasMore,
      currentPage: payload.currentPage,
      totalPosts: payload.totalPosts
    });

    // ⭐ DESPACHAR AL REDUCER
    // Para la primera página, reemplazamos todo
    // Para páginas siguientes, el reducer debe concatenar posts (ver reducer)
    dispatch({
      type: types.GET_CATEGORY_POSTS_SUCCESS,
      payload: payload
    });

    return {
      success: true,
      ...payload,
      // Mantener compatibilidad
      category: payload.categoryInfo,
      pagination: {
        hasMore: payload.hasMore,
        totalPages: payload.totalPages,
        totalPosts: payload.totalPosts,
        currentPage: payload.currentPage
      }
    };

  } catch (error) {
    console.error('❌ Action getCategoryPosts - ERROR COMPLETO:', {
      message: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
        url: error.response.config?.url,
        params: error.response.config?.params
      } : null,
      config: error.config ? {
        url: error.config.url,
        params: error.config.params,
        method: error.config.method
      } : null
    });
    
    const errorMessage = error.response?.data?.message || 
                        error.message || 
                        `Error al obtener datos para ${categorySlug}`;

    dispatch({
      type: types.GET_CATEGORY_POSTS_FAIL,
      payload: errorMessage
    });

    // Retornar estructura vacía pero consistente
    return {
      success: false,
      categoryInfo: {},
      children: [],
      posts: [],
      hasMore: false,
      total: 0
    };
  }
};

// ⭐⭐ ACCIÓN PARA CARGAR MÁS POSTS (scroll infinito)
 
// ✅ ACCIÓN ADICIONAL: SOLO OBTENER CATEGORÍA CON HIJOS (para cuando no se necesitan posts)
 
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

    const { data } = await axios.get(`${BASE_URL}/api/posts/filter`, { params });

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

    const { data } = await axios.get(`${BASE_URL}/api/categories/main`, {
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

    const { data } = await axios.get(`${BASE_URL}/api/categories/tree`);

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
      url: `${BASE_URL}/api/categories/tree`
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