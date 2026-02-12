import { GLOBALTYPES } from './globalTypes';
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData';
import { imageUpload } from '../../utils/imageUpload';

export const BOUTIQUE_TYPES = {
  // Basic CRUD operations
  CREATE_BOUTIQUE: 'CREATE_BOUTIQUE',
  GET_BOUTIQUES: 'GET_BOUTIQUES',
  GET_BOUTIQUE: 'GET_BOUTIQUE',
  UPDATE_BOUTIQUE: 'UPDATE_BOUTIQUE',
  DELETE_BOUTIQUE: 'DELETE_BOUTIQUE',
  
  // 🔥 NUEVO: Para búsqueda por categoría (mismo formato que posts)
  GET_BOUTIQUES_BY_CATEGORY: 'GET_BOUTIQUES_BY_CATEGORY',
  
  // User specific
  GET_USER_BOUTIQUES: 'GET_USER_BOUTIQUES',
  GET_BOUTIQUE_BY_DOMAIN: 'GET_BOUTIQUE_BY_DOMAIN',
  
  // Products
  GET_BOUTIQUE_PRODUCTS: 'GET_BOUTIQUE_PRODUCTS',
  ADD_BOUTIQUE_PRODUCT: 'ADD_BOUTIQUE_PRODUCT',
  REMOVE_BOUTIQUE_PRODUCT: 'REMOVE_BOUTIQUE_PRODUCT',
  
  // Status management
  UPDATE_BOUTIQUE_STATUS: 'UPDATE_BOUTIQUE_STATUS',
  
  // Stats
  GET_BOUTIQUE_STATS: 'GET_BOUTIQUE_STATS',
  
  // Loading states
  LOADING_BOUTIQUE: 'LOADING_BOUTIQUE',
  LOADING_BOUTIQUE_PRODUCTS: 'LOADING_BOUTIQUE_PRODUCTS',
  
  // 🔥 NUEVO: Para paginación de boutiques por categoría
  LOADING_BOUTIQUES_BY_CATEGORY: 'LOADING_BOUTIQUES_BY_CATEGORY'
};

// ============ CORE CRUD OPERATIONS ============

export const createBoutique = ({ boutiqueData, avatar, auth }) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    console.log('📤 Enviando creación de boutique:', {
      boutiqueData,
      hasAvatar: !!avatar,
      user: auth.user?._id
    });
    
    let media;
    if (avatar) {
      console.log('📷 Subiendo avatar...');
      media = await imageUpload([avatar]);
      console.log('✅ Avatar subido:', media);
    }
    
    // 🔥 CORREGIDO: Usar 'statut' no 'status'
    const finalData = {
      ...boutiqueData,
      user: auth.user?._id,
      logo: media ? media[0] : null,
      statut: 'en_attente' // Campo correcto
    };
    
    console.log('📦 Datos finales a enviar:', {
      nom_boutique: finalData.nom_boutique,
      domaine_boutique: finalData.domaine_boutique,
      plan: finalData.plan,
      categories_count: finalData.categories_produits?.length || 0,
      statut: finalData.statut
    });
    
    const res = await postDataAPI('boutique', finalData, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.CREATE_BOUTIQUE,
      payload: res.data.boutique || res.data
    });
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        success: res.data.msg || 'Boutique créée avec succès'
      } 
    });
    
    return res.data;
    
  } catch (err) {
    console.error('❌ Error en createBoutique action:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || err.message || 'Erreur lors de la création de la boutique'
      }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: false });
  }
};

export const updateBoutique = (id, boutiqueData, auth) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    let dataToSend = boutiqueData;
    
    // Si es FormData, convertirlo para patch
    if (boutiqueData instanceof FormData) {
      dataToSend = {};
      for (let [key, value] of boutiqueData.entries()) {
        dataToSend[key] = value;
      }
    }
    
    const res = await patchDataAPI(`boutique/${id}`, dataToSend, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.UPDATE_BOUTIQUE,
      payload: res.data.boutique || res.data
    });
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        success: res.data.msg || 'Boutique mise à jour avec succès'
      } 
    });
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || err.message
      }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: false });
  }
};

// ============ 🔥 NUEVO: GET BOUTIQUES BY CATEGORY (PARA EL SLIDER) ============
export const getBoutiquesByCategory = ({ 
  category, 
  sub = '', 
  article = '', 
  page = 1, 
  limit = 12,
  auth = null 
}) => async (dispatch) => {
  try {
    const loadingType = category 
      ? `${category}_${sub || ''}_${article || ''}` 
      : 'all';
      
    dispatch({ 
      type: BOUTIQUE_TYPES.LOADING_BOUTIQUES_BY_CATEGORY, 
      payload: { category: loadingType, loading: true } 
    });
    
    // Construir query string
    let query = `page=${page}&limit=${limit}`;
    if (category) query += `&category=${category}`;
    if (sub) query += `&sub=${sub}`;
    if (article) query += `&article=${article}`;
    
    console.log(`🔍 Buscando boutiques por categoría: ${category}/${sub}/${article}`, { page, limit });
    
    const res = await getDataAPI(`boutique/category?${query}`, auth?.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_BOUTIQUES_BY_CATEGORY,
      payload: {
        categoryPath: `${category}/${sub}/${article}`.replace(/\/+$/, ''),
        boutiques: res.data.boutiques || [],
        total: res.data.total || 0,
        page: res.data.page || 1,
        totalPages: res.data.totalPages || 1,
        hasMore: res.data.hasMore || false
      }
    });
    
    return res.data;
    
  } catch (err) {
    console.error('❌ Error en getBoutiquesByCategory:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || 'Erreur lors du chargement des boutiques'
      }
    });
    throw err;
  } finally {
    const loadingType = category 
      ? `${category}_${sub || ''}_${article || ''}` 
      : 'all';
      
    dispatch({ 
      type: BOUTIQUE_TYPES.LOADING_BOUTIQUES_BY_CATEGORY, 
      payload: { category: loadingType, loading: false } 
    });
  }
};

// ============ GET BOUTIQUES (GENERAL) ============

export const getBoutiques = (query = '', auth = null) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    let endpoint = 'boutique';
    if (query) endpoint += `?${query}`;
    
    const res = await getDataAPI(endpoint, auth?.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_BOUTIQUES,
      payload: {
        boutiques: res.data.boutiques || res.data,
        total: res.data.total || 0,
        page: res.data.page || 1,
        totalPages: res.data.totalPages || 1
      }
    });
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || 'Erreur lors du chargement des boutiques'
      }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: false });
  }
};

export const getBoutique = (id, auth = null) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    const res = await getDataAPI(`boutique/${id}`, auth?.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_BOUTIQUE,
      payload: res.data.boutique || res.data
    });
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || 'Boutique non trouvée'
      }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: false });
  }
};

export const getBoutiqueByDomain = (domain) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    const res = await getDataAPI(`boutique/domain/${domain}`);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_BOUTIQUE_BY_DOMAIN,
      payload: res.data.boutique || res.data
    });
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || 'Boutique non trouvée'
      }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: false });
  }
};

export const getUserBoutiques = (auth) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    const res = await getDataAPI('boutique/user/me', auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_USER_BOUTIQUES,
      payload: res.data.boutiques || res.data
    });
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || 'Erreur lors du chargement de vos boutiques'
      }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: false });
  }
};

export const deleteBoutique = (id, auth) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    const res = await deleteDataAPI(`boutique/${id}`, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.DELETE_BOUTIQUE,
      payload: id
    });
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        success: res.data.msg || 'Boutique supprimée avec succès'
      } 
    });
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || err.message
      }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: false });
  }
};

// ============ STATUS MANAGEMENT ============

export const updateBoutiqueStatus = (id, statut, auth) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    const res = await patchDataAPI(`boutique/${id}/status`, { statut }, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.UPDATE_BOUTIQUE_STATUS,
      payload: {
        id,
        statut: res.data.boutique?.statut || res.data.statut
      }
    });
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        success: res.data.msg || 'Statut mis à jour'
      } 
    });
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || err.message
      }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: false });
  }
};

// ============ PRODUCTS MANAGEMENT ============

export const getBoutiqueProducts = (boutiqueId, query = '', auth = null) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE_PRODUCTS, payload: true });
    
    let endpoint = `boutique/${boutiqueId}/products`;
    if (query) endpoint += `?${query}`;
    
    const res = await getDataAPI(endpoint, auth?.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_BOUTIQUE_PRODUCTS,
      payload: {
        boutiqueId,
        products: res.data.produits || res.data.products || [],
        total: res.data.total || 0,
        page: res.data.page || 1,
        totalPages: res.data.totalPages || 1
      }
    });
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || 'Erreur lors du chargement des produits'
      }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE_PRODUCTS, payload: false });
  }
};

export const addBoutiqueProduct = (boutiqueId, productId, auth) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE_PRODUCTS, payload: true });
    
    const res = await postDataAPI(`boutique/${boutiqueId}/products`, { productId }, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.ADD_BOUTIQUE_PRODUCT,
      payload: {
        boutiqueId,
        product: res.data.product || res.data
      }
    });
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        success: res.data.msg || 'Produit ajouté avec succès'
      } 
    });
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || err.message
      }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE_PRODUCTS, payload: false });
  }
};

export const removeBoutiqueProduct = (boutiqueId, productId, auth) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE_PRODUCTS, payload: true });
    
    const res = await deleteDataAPI(`boutique/${boutiqueId}/products/${productId}`, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.REMOVE_BOUTIQUE_PRODUCT,
      payload: {
        boutiqueId,
        productId
      }
    });
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        success: res.data.msg || 'Produit retiré avec succès'
      } 
    });
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || err.message
      }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE_PRODUCTS, payload: false });
  }
};

// ============ STATISTICS ============

export const getBoutiqueStats = (boutiqueId, auth) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    const res = await getDataAPI(`boutique/${boutiqueId}/stats`, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_BOUTIQUE_STATS,
      payload: {
        boutiqueId,
        stats: res.data.stats || res.data
      }
    });
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || 'Erreur lors du chargement des statistiques'
      }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: false });
  }
};

// ============ CLEAR OPERATIONS ============

export const clearBoutiques = () => ({
  type: BOUTIQUE_TYPES.GET_BOUTIQUES,
  payload: {
    boutiques: [],
    total: 0,
    page: 1,
    totalPages: 0
  }
});

export const clearCurrentBoutique = () => ({
  type: BOUTIQUE_TYPES.GET_BOUTIQUE,
  payload: null
});

export const clearBoutiqueProducts = (boutiqueId) => ({
  type: BOUTIQUE_TYPES.GET_BOUTIQUE_PRODUCTS,
  payload: {
    boutiqueId,
    products: [],
    total: 0,
    page: 1,
    totalPages: 0
  }
});

// 🔥 NUEVO: Limpiar boutiques por categoría
export const clearBoutiquesByCategory = (categoryPath) => ({
  type: BOUTIQUE_TYPES.GET_BOUTIQUES_BY_CATEGORY,
  payload: {
    categoryPath,
    boutiques: [],
    total: 0,
    page: 1,
    totalPages: 1,
    hasMore: false
  }
});