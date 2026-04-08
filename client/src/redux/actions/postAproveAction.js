// 📂 redux/actions/postAproveAction.js

import { GLOBALTYPES } from './globalTypes'
import { getDataAPI, patchDataAPI } from '../../utils/fetchData'
import { createNotify } from './notifyAction'

export const POST_TYPES_APROVE = {
  LOADING_POST: 'LOADING_POST',
  APROVAR_POST_PENDIENTE: 'APROVAR_POST_PENDIENTE',
  GET_POSTS_PENDIENTES: 'GET_POSTS_PENDIENTES',
  LOAD_MORE_PENDIENTES: 'LOAD_MORE_PENDIENTES',
  RESET_PENDIENTES: 'RESET_PENDIENTES'
}

export const aprovarPostPendiente = ({ post, estado, auth, socket }) => async (dispatch) => {
  try {
    dispatch({ type: POST_TYPES_APROVE.LOADING_POST, payload: true });

    const res = await patchDataAPI(`post/${post._id}/aprobar`, { estado }, auth.token);
    
    dispatch({
      type: POST_TYPES_APROVE.APROVAR_POST_PENDIENTE,
      payload: res.data,
    });

    const notifyMsg = {
      id: auth.user._id,
      text: 'approvedyourpost',
      textNs: 'notify', 
      recipients: [post.user._id],
      url: `/post/${post._id}`,
      image: post.images[0]?.url
    }

    dispatch(createNotify({msg: notifyMsg, auth, socket}))

    dispatch({ type: POST_TYPES_APROVE.LOADING_POST, payload: false });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } });

  } catch (error) {
    console.error("Error en aprobarPostPendiente:", error);
    
    const errorMessage = error.response?.data?.msg || 
                        error.message || 
                        "Error inesperado";
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: errorMessage },
    });
  }
};

// 🔥 GET POSTS PENDIENTES CON PAGINACIÓN
// 📂 redux/actions/postAproveAction.js - MODIFICAR getPostsPendientes

// 🔥 GET POSTS PENDIENTES CON PAGINACIÓN Y FILTROS
export const getPostsPendientes = (token, page = 1, limit = 10, filters = {}) => async (dispatch) => {
  try {
    dispatch({ type: POST_TYPES_APROVE.LOADING_POST, payload: true });
    
    // Construir URL con filtros
    let url = `posts/admin/pendientes?page=${page}&limit=${limit}`;
    if (filters.categorie) {
      url += `&categorie=${encodeURIComponent(filters.categorie)}`;
    }
    if (filters.subCategory) {
      url += `&subCategory=${encodeURIComponent(filters.subCategory)}`;
    }
    
    const res = await getDataAPI(url, token);

    dispatch({
      type: POST_TYPES_APROVE.GET_POSTS_PENDIENTES,
      payload: {
        posts: res.data.posts,
        total: res.data.total,
        page: res.data.page,
        limit: res.data.limit,
        totalPages: res.data.totalPages,
        hasMore: res.data.hasMore,
        filters: res.data.filters || {}
      }
    });

    dispatch({ type: POST_TYPES_APROVE.LOADING_POST, payload: false });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || err.message }
    });
    dispatch({ type: POST_TYPES_APROVE.LOADING_POST, payload: false });
  }
};

// 🔥 RESET FILTERS
export const resetPostsFilters = () => (dispatch) => {
  dispatch({ type: POST_TYPES_APROVE.RESET_FILTERS });
};
// 🔥 CARGAR MÁS POSTS (INFINITE SCROLL)
export const loadMorePendientes = (token, page, limit = 10) => async (dispatch) => {
  try {
    dispatch({ type: POST_TYPES_APROVE.LOADING_POST, payload: true });
    
    const res = await getDataAPI(`posts/admin/pendientes?page=${page}&limit=${limit}`, token);

    dispatch({
      type: POST_TYPES_APROVE.LOAD_MORE_PENDIENTES,
      payload: {
        posts: res.data.posts,
        page: res.data.page,
        hasMore: res.data.hasMore
      }
    });

    dispatch({ type: POST_TYPES_APROVE.LOADING_POST, payload: false });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.msg || err.message }
    });
    dispatch({ type: POST_TYPES_APROVE.LOADING_POST, payload: false });
  }
};

// 🔥 RESETEAR ESTADO
export const resetPendientes = () => (dispatch) => {
  dispatch({ type: POST_TYPES_APROVE.RESET_PENDIENTES });
};