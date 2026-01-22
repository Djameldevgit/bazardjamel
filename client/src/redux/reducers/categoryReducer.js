// redux/reducers/categoryReducer.js - VERSIÓN CORREGIDA
import * as types from '../constants/categoryConstants';

const initialState = {
  // Para Home.jsx
  categories: [],
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  hasMoreCategories: true,
  
  // Para CategoryPage.jsx
  activeCategory: null,
  activeSubcategory: null,
  activeArticle: null,
  categoryInfo: {},
  children: [],
  posts: [],
  postsLoading: false,
  postsError: null,
  postsCurrentPage: 0,  // ⭐ CAMBIADO: De 1 a 0 (la primera página es 0)
  postsTotalPages: 0,   // ⭐ CAMBIADO: De 1 a 0 (inicial)
  hasMorePosts: false   // ⭐ CAMBIADO: De true a false (inicial)
};

// REDUCER PRINCIPAL
export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    
    // ============ HOME ============
    case types.LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case types.GET_ALL_CATEGORIES_WITH_POSTS:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case types.GET_ALL_CATEGORIES_WITH_POSTS_SUCCESS:
      console.log('✅ Reducer: GET_ALL_CATEGORIES_WITH_POSTS_SUCCESS', {
        categoriesCount: action.payload.categories ? action.payload.categories.length : 0,
        primeraCategoria: action.payload.categories && action.payload.categories[0] ? 
          { 
            name: action.payload.categories[0].name, 
            postsCount: action.payload.categories[0].posts ? action.payload.categories[0].posts.length : 0
          } : null
      });
      
      return {
        ...state,
        loading: false,
        categories: action.payload.categories || [],
        currentPage: action.payload.currentPage || 1,
        totalPages: action.payload.totalPages || 1,
        hasMoreCategories: action.payload.hasMore || false,
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
      return {
        ...state,
        loading: true
      };
    
    // ============ CATEGORY PAGE ============
    case types.GET_CATEGORY_POSTS:
      console.log('⏳ Reducer: GET_CATEGORY_POSTS - Iniciando carga');
      return {
        ...state,
        postsLoading: true,
        postsError: null,
        // ⭐ OPCIONAL: Limpiar posts anteriores al empezar nueva carga
        // posts: action.payload.reset ? [] : state.posts
      };
      
    case types.GET_CATEGORY_POSTS_SUCCESS:
      console.log('✅ Reducer: GET_CATEGORY_POSTS_SUCCESS - Datos:', {
        postsRecibidos: action.payload.posts ? action.payload.posts.length : 0,
        hasMorePayload: action.payload.hasMore,
        currentPagePayload: action.payload.currentPage,
        totalPagesPayload: action.payload.totalPages,
        totalPostsPayload: action.payload.totalPosts,
        categoria: action.payload.categoryInfo?.name || 'Sin nombre'
      });
      
      // ⭐ CORRECCIÓN CRÍTICA: postsCurrentPage debe ser 0 para primera página
      const nuevaPagina = action.payload.currentPage !== undefined ? 
                         action.payload.currentPage : 
                         (state.postsCurrentPage + 1);
      
      // ⭐ CORRECCIÓN: hasMorePosts debe usar action.payload.hasMore directamente
      const nuevoHasMore = action.payload.hasMore !== undefined ? 
                          action.payload.hasMore : 
                          false;
      
      // ⭐ Si es página 1 (o 0), reemplazar posts, sino concatenar
      let nuevosPosts = [];
      if (nuevaPagina <= 1) {
        // Primera página: reemplazar
        nuevosPosts = action.payload.posts || [];
        console.log('🔄 Primera página - Reemplazando posts:', nuevosPosts.length);
      } else {
        // Página siguiente: concatenar
        nuevosPosts = [...state.posts, ...(action.payload.posts || [])];
        console.log('➕ Página siguiente - Concatenando posts:', {
          anteriores: state.posts.length,
          nuevos: action.payload.posts?.length || 0,
          total: nuevosPosts.length
        });
      }
      
      return {
        ...state,
        postsLoading: false,
        categoryInfo: action.payload.categoryInfo || {},
        children: action.payload.children || [],
        posts: nuevosPosts,
        postsCurrentPage: nuevaPagina,
        postsTotalPages: action.payload.totalPages || 0,
        hasMorePosts: nuevoHasMore,  // ⭐ USAR action.payload.hasMore directamente
        postsError: null
      };
      
    case types.GET_CATEGORY_POSTS_FAIL:
      console.log('❌ Reducer: GET_CATEGORY_POSTS_FAIL', action.payload);
      return {
        ...state,
        postsLoading: false,
        postsError: action.payload,
        // ⭐ Mantener posts existentes si hay error
        posts: state.posts
      };
    
    case types.LOAD_MORE_POSTS:
      console.log('⏳ Reducer: LOAD_MORE_POSTS');
      return {
        ...state,
        postsLoading: true
      };
    
    // ============ NAVEGACIÓN ENTRE NIVELES ============
    case types.SET_ACTIVE_CATEGORY:
      console.log('📍 Reducer: SET_ACTIVE_CATEGORY', action.payload);
      return {
        ...state,
        activeCategory: action.payload,
        activeSubcategory: null,
        activeArticle: null,
        categoryInfo: {},  // ⭐ Limpiar info
        children: [],      // ⭐ Limpiar hijos
        posts: [],         // ⭐ Limpiar posts
        postsCurrentPage: 0,  // ⭐ Resetear a 0
        postsTotalPages: 0,   // ⭐ Resetear
        hasMorePosts: true,   // ⭐ Resetear a true para nueva carga
        postsLoading: false,
        postsError: null
      };
      
    case types.SET_ACTIVE_SUBCATEGORY:
      console.log('📍 Reducer: SET_ACTIVE_SUBCATEGORY', action.payload);
      return {
        ...state,
        activeSubcategory: action.payload,
        activeArticle: null,
        // ⭐ Mantener categoryInfo si es la misma categoría
        // ⭐ Pero limpiar posts
        posts: [],
        postsCurrentPage: 0,
        postsTotalPages: 0,
        hasMorePosts: true,
        postsLoading: false,
        postsError: null
      };
      
    case types.SET_ACTIVE_ARTICLE:
      console.log('📍 Reducer: SET_ACTIVE_ARTICLE', action.payload);
      return {
        ...state,
        activeArticle: action.payload,
        // ⭐ Limpiar posts al cambiar artículo
        posts: [],
        postsCurrentPage: 0,
        postsTotalPages: 0,
        hasMorePosts: true,
        postsLoading: false,
        postsError: null
      };
    
    // ============ LIMPIAR ERRORES ============
    case types.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        postsError: null
      };
    
    // ⭐ NUEVA ACCIÓN: RESET POSTS (opcional)
    case 'RESET_CATEGORY_POSTS':
      console.log('🔄 Reducer: RESET_CATEGORY_POSTS');
      return {
        ...state,
        posts: [],
        postsCurrentPage: 0,
        postsTotalPages: 0,
        hasMorePosts: true,
        postsLoading: false,
        postsError: null
      };
    
    default:
      return state;
  }
};

export default categoryReducer;