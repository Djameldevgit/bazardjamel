// 📂 src/redux/actions/boutiqueAction.js
import { GLOBALTYPES } from './globalTypes';
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData';

// Types
export const BOUTIQUE_TYPES = {
  // Basic CRUD operations
  CREATE_BOUTIQUE: 'CREATE_BOUTIQUE',
  GET_BOUTIQUES: 'GET_BOUTIQUES',
  GET_BOUTIQUE: 'GET_BOUTIQUE',
  UPDATE_BOUTIQUE: 'UPDATE_BOUTIQUE',
  DELETE_BOUTIQUE: 'DELETE_BOUTIQUE',
  
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
  LOADING_BOUTIQUE_PRODUCTS: 'LOADING_BOUTIQUE_PRODUCTS'
};

// Action creators
export const createBoutique = (boutiqueData, token) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    let res;
    if (boutiqueData instanceof FormData) {
      // Convertir FormData a objeto para postDataAPI
      const data = {};
      for (let [key, value] of boutiqueData.entries()) {
        data[key] = value;
      }
      res = await postDataAPI('boutique', data, token);
    } else {
      res = await postDataAPI('boutique', boutiqueData, token);
    }
    
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

export const updateBoutique = (id, boutiqueData, token) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    let res;
    if (boutiqueData instanceof FormData) {
      // Convertir FormData a objeto para patchDataAPI
      const data = {};
      for (let [key, value] of boutiqueData.entries()) {
        data[key] = value;
      }
      res = await patchDataAPI(`boutique/${id}`, data, token);
    } else {
      res = await patchDataAPI(`boutique/${id}`, boutiqueData, token);
    }
    
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

export const getBoutiques = (query = '', token) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    let endpoint = 'boutique';
    if (query) endpoint += `?${query}`;
    
    const res = await getDataAPI(endpoint, token);
    
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

export const getBoutique = (id, token) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    const res = await getDataAPI(`boutique/${id}`, token);
    
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

export const getUserBoutiques = (token) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    const res = await getDataAPI('user/boutiques', token);
    
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

export const deleteBoutique = (id, token) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    const res = await deleteDataAPI(`boutique/${id}`, token);
    
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

export const updateBoutiqueStatus = (id, status, token) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    const res = await patchDataAPI(`boutique/${id}/status`, { status }, token);
    
    dispatch({
      type: BOUTIQUE_TYPES.UPDATE_BOUTIQUE_STATUS,
      payload: {
        id,
        status: res.data.boutique?.status || res.data.status
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

export const getBoutiqueProducts = (boutiqueId, query = '', token) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE_PRODUCTS, payload: true });
    
    let endpoint = `boutique/${boutiqueId}/products`;
    if (query) endpoint += `?${query}`;
    
    const res = await getDataAPI(endpoint, token);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_BOUTIQUE_PRODUCTS,
      payload: {
        boutiqueId,
        products: res.data.products || res.data,
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

export const addBoutiqueProduct = (boutiqueId, productId, token) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE_PRODUCTS, payload: true });
    
    const res = await patchDataAPI(`boutique/${boutiqueId}/add-product`, { productId }, token);
    
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

export const removeBoutiqueProduct = (boutiqueId, productId, token) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE_PRODUCTS, payload: true });
    
    const res = await patchDataAPI(`boutique/${boutiqueId}/remove-product`, { productId }, token);
    
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

export const getBoutiqueStats = (boutiqueId, token) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    const res = await getDataAPI(`boutique/${boutiqueId}/stats`, token);
    
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

// Clear boutique data (for logout or cleanup)
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