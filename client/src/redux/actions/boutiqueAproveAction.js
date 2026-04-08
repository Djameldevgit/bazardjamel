// 📂 redux/actions/boutiqueAproveAction.js - VERSIÓN COMPLETA ACTUALIZADA

import { GLOBALTYPES } from './globalTypes'
import { getDataAPI, putDataAPI, deleteDataAPI } from '../../utils/fetchData'

export const BOUTIQUE_APROVE_TYPES = {
  LOADING: 'LOADING_BOUTIQUES',
  GET_PENDIENTES: 'GET_BOUTIQUES_PENDIENTES',
  APROBAR: 'APROBAR_BOUTIQUE',
  RECHAZAR: 'RECHAZAR_BOUTIQUE',
  RESET: 'RESET_BOUTIQUES',
  // 🔥 NUEVOS TIPOS PARA PRODUCTOS
  GET_PRODUCTS_PENDIENTES: 'GET_PRODUCTS_PENDIENTES',
  APROBAR_PRODUCT: 'APROBAR_PRODUCT',
  RECHAZAR_PRODUCT: 'RECHAZAR_PRODUCT'
}

// ============================================
// 🔥 BOUTIQUES PENDIENTES
// ============================================

// GET BOUTIQUES PENDIENTES
export const getBoutiquesPendientes = (token, page = 1, limit = 10, filters = {}) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_APROVE_TYPES.LOADING, payload: true });
    
    let url = `boutiques/admin/pendientes?page=${page}&limit=${limit}`;
    if (filters.categorie) {
      url += `&categorie=${encodeURIComponent(filters.categorie)}`;
    }
    
    const res = await getDataAPI(url, token);
    
    dispatch({
      type: BOUTIQUE_APROVE_TYPES.GET_PENDIENTES,
      payload: {
        boutiques: res.data.boutiques || [],
        total: res.data.total || 0,
        page: res.data.page || page,
        limit: res.data.limit || limit,
        totalPages: res.data.totalPages || 1,
        hasMore: res.data.hasMore || false
      }
    });
    
    dispatch({ type: BOUTIQUE_APROVE_TYPES.LOADING, payload: false });
  } catch (err) {
    console.error('❌ Error getBoutiquesPendientes:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    dispatch({ type: BOUTIQUE_APROVE_TYPES.LOADING, payload: false });
  }
};

// APROBAR BOUTIQUE
export const aprobarBoutique = (id, token) => async (dispatch) => {
  try {
    const res = await putDataAPI(`boutiques/admin/aprobar/${id}`, {}, token);
    
    dispatch({
      type: BOUTIQUE_APROVE_TYPES.APROBAR,
      payload: { id }
    });
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.message || 'Boutique approuvée avec succès' }
    });
    
    return res.data;
  } catch (err) {
    console.error('❌ Error aprobarBoutique:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  }
};

// RECHAZAR BOUTIQUE
export const rechazarBoutique = (id, token) => async (dispatch) => {
  try {
    const res = await deleteDataAPI(`boutiques/admin/rechazar/${id}`, token);
    
    dispatch({
      type: BOUTIQUE_APROVE_TYPES.RECHAZAR,
      payload: { id }
    });
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.message || 'Boutique rejetée' }
    });
    
    return res.data;
  } catch (err) {
    console.error('❌ Error rechazarBoutique:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  }
};

// RESET BOUTIQUES
export const resetBoutiques = () => (dispatch) => {
  dispatch({ type: BOUTIQUE_APROVE_TYPES.RESET });
};

// ============================================
// 🔥 PRODUCTOS DE BOUTIQUE PENDIENTES (NUEVO)
// ============================================

// GET PRODUCTOS PENDIENTES
export const getProductsPendientes = (token, page = 1, limit = 10, filters = {}) => async (dispatch) => {
  try {
    console.log('🔥 getProductsPendientes llamado');
    dispatch({ type: BOUTIQUE_APROVE_TYPES.LOADING, payload: true });
    
    let url = `admin/boutique-products/pendientes?page=${page}&limit=${limit}`;
    if (filters.categorie) {
      url += `&categorie=${encodeURIComponent(filters.categorie)}`;
    }
    if (filters.boutiqueId) {
      url += `&boutiqueId=${filters.boutiqueId}`;
    }
    
    const res = await getDataAPI(url, token);
    
    console.log('✅ Productos pendientes recibidos:', res.data);
    
    dispatch({
      type: BOUTIQUE_APROVE_TYPES.GET_PRODUCTS_PENDIENTES,
      payload: {
        products: res.data.products || [],
        total: res.data.total || 0,
        page: res.data.page || page,
        limit: res.data.limit || limit,
        totalPages: res.data.totalPages || 1,
        hasMore: res.data.hasMore || false
      }
    });
    
    dispatch({ type: BOUTIQUE_APROVE_TYPES.LOADING, payload: false });
  } catch (err) {
    console.error('❌ Error getProductsPendientes:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    dispatch({ type: BOUTIQUE_APROVE_TYPES.LOADING, payload: false });
  }
};

// APROBAR PRODUCTO
export const aprobarProducto = (id, token) => async (dispatch) => {
  try {
    console.log('✅ aprobarProducto llamado:', id);
    
    const res = await putDataAPI(`admin/boutique-products/aprobar/${id}`, {}, token);
    
    dispatch({
      type: BOUTIQUE_APROVE_TYPES.APROBAR_PRODUCT,
      payload: { id }
    });
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.message || 'Produit approuvé avec succès' }
    });
    
    return res.data;
  } catch (err) {
    console.error('❌ Error aprobarProducto:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  }
};

// RECHAZAR PRODUCTO
export const rechazarProducto = (id, token) => async (dispatch) => {
  try {
    console.log('🗑️ rechazarProducto llamado:', id);
    
    const res = await deleteDataAPI(`admin/boutique-products/rechazar/${id}`, token);
    
    dispatch({
      type: BOUTIQUE_APROVE_TYPES.RECHAZAR_PRODUCT,
      payload: { id }
    });
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.message || 'Produit rejeté' }
    });
    
    return res.data;
  } catch (err) {
    console.error('❌ Error rechazarProducto:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  }
};