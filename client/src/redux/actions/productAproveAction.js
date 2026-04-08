// 📂 redux/actions/productAproveAction.js
import { GLOBALTYPES } from './globalTypes'
import { getDataAPI, putDataAPI, deleteDataAPI } from '../../utils/fetchData'

export const PRODUCT_APROVE_TYPES = {
  LOADING: 'LOADING_PRODUCTS',
  GET_PENDIENTES: 'GET_PRODUCTS_PENDIENTES',
  APROBAR: 'APROBAR_PRODUCT',
  RECHAZAR: 'RECHAZAR_PRODUCT',
  RESET: 'RESET_PRODUCTS'
}

// 🔥 GET PRODUCTOS PENDIENTES
export const getProductsPendientes = (token, page = 1, limit = 10, filters = {}) => async (dispatch) => {
  try {
    dispatch({ type: PRODUCT_APROVE_TYPES.LOADING, payload: true });
    
    let url = `boutiques/products/pendientes?page=${page}&limit=${limit}`;
    if (filters.boutiqueId) {
      url += `&boutiqueId=${encodeURIComponent(filters.boutiqueId)}`;
    }
    if (filters.categorie) {
      url += `&categorie=${encodeURIComponent(filters.categorie)}`;
    }
    
    const res = await getDataAPI(url, token);
    
    dispatch({
      type: PRODUCT_APROVE_TYPES.GET_PENDIENTES,
      payload: {
        products: res.data.products,
        total: res.data.total,
        page: res.data.page,
        limit: res.data.limit,
        totalPages: res.data.totalPages,
        hasMore: res.data.hasMore
      }
    });
    
    dispatch({ type: PRODUCT_APROVE_TYPES.LOADING, payload: false });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    dispatch({ type: PRODUCT_APROVE_TYPES.LOADING, payload: false });
  }
};

// 🔥 APROBAR PRODUCTO
export const aprobarProducto = (id, token) => async (dispatch) => {
  try {
    const res = await putDataAPI(`boutiques/products/aprobar/${id}`, {}, token);
    
    dispatch({
      type: PRODUCT_APROVE_TYPES.APROBAR,
      payload: { id }
    });
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.message }
    });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
  }
};

// 🔥 RECHAZAR PRODUCTO
export const rechazarProducto = (id, token) => async (dispatch) => {
  try {
    const res = await deleteDataAPI(`boutiques/products/rechazar/${id}`, token);
    
    dispatch({
      type: PRODUCT_APROVE_TYPES.RECHAZAR,
      payload: { id }
    });
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data.message }
    });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
  }
};

// 🔥 RESET
export const resetProducts = () => (dispatch) => {
  dispatch({ type: PRODUCT_APROVE_TYPES.RESET });
};