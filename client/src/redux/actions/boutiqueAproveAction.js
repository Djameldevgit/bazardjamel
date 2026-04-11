// 📂 redux/actions/boutiqueAproveAction.js - VERSIÓN CORREGIDA

import { GLOBALTYPES } from './globalTypes'
import { getDataAPI, putDataAPI, deleteDataAPI, patchDataAPI } from '../../utils/fetchData' // 🔥 AÑADIR patchDataAPI

// 🔥 CORREGIDO: Nombre consistente (con doble P)
export const BOUTIQUE_APPROVE_TYPES = {
  LOADING: 'LOADING_BOUTIQUES',
  LOADING_BOUTIQUES: 'LOADING_BOUTIQUES',
  GET_BOUTIQUES_PENDIENTES: 'GET_BOUTIQUES_PENDIENTES',
  GET_PRODUCTS_PENDIENTES: 'GET_PRODUCTS_PENDIENTES',
  APROBAR_PRODUCT: 'APROBAR_PRODUCT',
  RECHAZAR_PRODUCT: 'RECHAZAR_PRODUCT',
  APPROVE_BOUTIQUE: 'APPROVE_BOUTIQUE',
  REJECT_BOUTIQUE: 'REJECT_BOUTIQUE',
  ACTIVATE_PAID_BOUTIQUE: 'ACTIVATE_PAID_BOUTIQUE',
  RESET: 'RESET_BOUTIQUES',
}

// ============================================
// RESET BOUTIQUES
// ============================================
export const resetBoutiques = () => (dispatch) => {
  dispatch({ type: BOUTIQUE_APPROVE_TYPES.RESET });
};

// ============================================
// 🔥 PRODUCTOS DE BOUTIQUE PENDIENTES
// ============================================

// GET PRODUCTOS PENDIENTES
export const getProductsPendientes = (token, page = 1, limit = 10, filters = {}) => async (dispatch) => {
  try {
    console.log('🔥 getProductsPendientes llamado');
    dispatch({ type: BOUTIQUE_APPROVE_TYPES.LOADING, payload: true });

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
      type: BOUTIQUE_APPROVE_TYPES.GET_PRODUCTS_PENDIENTES,
      payload: {
        products: res.data.products || [],
        total: res.data.total || 0,
        page: res.data.page || page,
        limit: res.data.limit || limit,
        totalPages: res.data.totalPages || 1,
        hasMore: res.data.hasMore || false
      }
    });

    dispatch({ type: BOUTIQUE_APPROVE_TYPES.LOADING, payload: false });
  } catch (err) {
    console.error('❌ Error getProductsPendientes:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    dispatch({ type: BOUTIQUE_APPROVE_TYPES.LOADING, payload: false });
  }
};

// APROBAR PRODUCTO
export const aprobarProducto = (id, token) => async (dispatch) => {
  try {
    console.log('✅ aprobarProducto llamado:', id);

    const res = await putDataAPI(`admin/boutique-products/aprobar/${id}`, {}, token);

    dispatch({
      type: BOUTIQUE_APPROVE_TYPES.APROBAR_PRODUCT,
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
      type: BOUTIQUE_APPROVE_TYPES.RECHAZAR_PRODUCT,
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

// ============================================
// 🔥 BOUTIQUES PENDIENTES (CORREGIDO)
// ============================================
export const getBoutiquesPendientes = (token, page = 1, limit = 10) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_APPROVE_TYPES.LOADING_BOUTIQUES, payload: true });

    const res = await getDataAPI(`admin/boutiques/pendientes?page=${page}&limit=${limit}`, token);

    console.log('✅ Boutiques pendientes recibidas:', res.data);

    dispatch({
      type: BOUTIQUE_APPROVE_TYPES.GET_BOUTIQUES_PENDIENTES,
      payload: {
        boutiques: res.data.boutiques || [],
        total: res.data.total || 0,
        page: res.data.page || page,
        totalPages: res.data.totalPages || 1
      }
    });

    return res.data;

  } catch (err) {
    console.error('❌ Error en getBoutiquesPendientes:', err);
    return { success: false, error: err.message };
  } finally {
    dispatch({ type: BOUTIQUE_APPROVE_TYPES.LOADING_BOUTIQUES, payload: false });
  }
};

// ============================================
// APROBAR BOUTIQUE (QUITA PENDIENTE)
// ============================================
export const aprobarBoutique = (boutiqueId, token) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`admin/boutiques/aprobar/${boutiqueId}`, {}, token);

    dispatch({
      type: BOUTIQUE_APPROVE_TYPES.APPROVE_BOUTIQUE,
      payload: boutiqueId
    });

    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.message || 'Boutique approuvée avec succès' }
    });

    return { success: true, data: res.data };

  } catch (err) {
    console.error('❌ Error en aprobarBoutique:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    return { success: false, error: err.message };
  }
};

// ============================================
// ACTIVAR BOUTIQUE DE PAGO (DESPUÉS DE PAGO)
// ============================================
export const activatePaidBoutique = (boutiqueId, token) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`admin/boutiques/activar-pago/${boutiqueId}`, {}, token);

    dispatch({
      type: BOUTIQUE_APPROVE_TYPES.ACTIVATE_PAID_BOUTIQUE,
      payload: boutiqueId
    });

    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.message || 'Boutique activée avec succès après paiement' }
    });

    return { success: true, data: res.data };

  } catch (err) {
    console.error('❌ Error en activatePaidBoutique:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    return { success: false, error: err.message };
  }
};

// ============================================
// RECHAZAR BOUTIQUE
// ============================================
export const rechazarBoutique = (boutiqueId, token) => async (dispatch) => {
  try {
    const res = await deleteDataAPI(`admin/boutiques/rechazar/${boutiqueId}`, token);

    dispatch({
      type: BOUTIQUE_APPROVE_TYPES.REJECT_BOUTIQUE,
      payload: boutiqueId
    });

    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.message || 'Boutique rejetée avec succès' }
    });

    return { success: true, data: res.data };

  } catch (err) {
    console.error('❌ Error en rechazarBoutique:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    return { success: false, error: err.message };
  }
};