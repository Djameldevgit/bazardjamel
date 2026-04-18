// redux/actions/videoApproveAction.js
import { getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from './globalTypes';

export const VIDEO_APPROVE_TYPES = {
  LOADING: 'VIDEO_APPROVE_LOADING',
  GET_VIDEOS_PENDIENTES: 'GET_VIDEOS_PENDIENTES',
  APROBAR_VIDEO: 'APROBAR_VIDEO',
  ELIMINAR_VIDEO: 'ELIMINAR_VIDEO',
  UPDATE_PAGINATION: 'UPDATE_VIDEO_PAGINATION'
};

// Obtener videos pendientes
export const getVideosPendientes = (token, page = 1, limit = 10) => async (dispatch) => {
  try {
    dispatch({ type: VIDEO_APPROVE_TYPES.LOADING, payload: true });
    
    const res = await getDataAPI(`admin/videos/pendientes?page=${page}&limit=${limit}`, token);
    
    dispatch({
      type: VIDEO_APPROVE_TYPES.GET_VIDEOS_PENDIENTES,
      payload: {
        videos: res.data.videos,
        total: res.data.total,
        page: res.data.page,
        totalPages: res.data.totalPages
      }
    });
    
    return res.data;
  } catch (err) {
    console.error('Error getVideosPendientes:', err);
    return null;
  } finally {
    dispatch({ type: VIDEO_APPROVE_TYPES.LOADING, payload: false });
  }
};

// Aprobar video (cambiar pendiente a false)
export const aprobarVideo = (videoId, token) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`admin/videos/${videoId}/approve`, {}, token);
    
    dispatch({
      type: VIDEO_APPROVE_TYPES.APROBAR_VIDEO,
      payload: videoId
    });
    
    return { success: true };
  } catch (err) {
    console.error('Error aprobarVideo:', err);
    return { success: false, error: err.response?.data?.message };
  }
};

// Eliminar video (rechazar)
export const eliminarVideo = (videoId, token) => async (dispatch) => {
  try {
    await deleteDataAPI(`admin/videos/${videoId}`, token);
    
    dispatch({
      type: VIDEO_APPROVE_TYPES.ELIMINAR_VIDEO,
      payload: videoId
    });
    
    return { success: true };
  } catch (err) {
    console.error('Error eliminarVideo:', err);
    return { success: false, error: err.response?.data?.message };
  }
};

// Actualizar paginación
export const updateVideoPagination = (page) => ({
  type: VIDEO_APPROVE_TYPES.UPDATE_PAGINATION,
  payload: page
});