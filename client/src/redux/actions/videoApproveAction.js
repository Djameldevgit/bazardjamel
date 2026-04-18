// redux/actions/videoApproveAction.js - VERSIÓN CON NOTIFICACIONES
import { getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from './globalTypes';
import { createNotify } from './notifyAction'; // ✅ Importar createNotify

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

// ✅ Aprobar video CON NOTIFICACIÓN
export const aprobarVideo = (videoId, token, auth, socket, videoData) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`admin/videos/${videoId}/approve`, {}, token);
    
    dispatch({
      type: VIDEO_APPROVE_TYPES.APROBAR_VIDEO,
      payload: videoId
    });
    
    // ✅ Notificar al dueño del video que fue aprobado
    const video = res.data.video || videoData;
    if (video && video.user?._id) {
      const msg = {
        id: auth.user._id,
        text: '✅ Votre vidéo a été approuvée et est maintenant visible',
        recipients: [video.user._id],
        url: `/video/${video._id}`,
        content: video.title,
        image: video.thumbnail,
        type: 'video'
      };
      
      dispatch(createNotify({ msg, auth, socket }));
    }
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data?.message || 'Vidéo approuvée avec succès' }
    });
    
    return { success: true, data: res.data };
  } catch (err) {
    console.error('Error aprobarVideo:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Erreur lors de l\'approbation' }
    });
    return { success: false, error: err.response?.data?.message };
  }
};

// ✅ Eliminar video (rechazar) CON NOTIFICACIÓN
export const eliminarVideo = (videoId, token, auth, socket, videoData) => async (dispatch) => {
  try {
    const res = await deleteDataAPI(`admin/videos/${videoId}`, token);
    
    dispatch({
      type: VIDEO_APPROVE_TYPES.ELIMINAR_VIDEO,
      payload: videoId
    });
    
    // ✅ Notificar al dueño del video que fue rechazado
    const video = res.data?.video || videoData;
    if (video && video.user?._id) {
      const msg = {
        id: auth.user._id,
        text: '❌ Votre vidéo a été rejetée par l\'administrateur',
        recipients: [video.user._id],
        url: `/video/${video._id}`,
        content: video.title,
        image: video.thumbnail,
        type: 'video'
      };
      
      dispatch(createNotify({ msg, auth, socket }));
    }
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: res.data?.message || 'Vidéo supprimée avec succès' }
    });
    
    return { success: true, data: res.data };
  } catch (err) {
    console.error('Error eliminarVideo:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Erreur lors de la suppression' }
    });
    return { success: false, error: err.response?.data?.message };
  }
};

// Actualizar paginación
export const updateVideoPagination = (page) => ({
  type: VIDEO_APPROVE_TYPES.UPDATE_PAGINATION,
  payload: page
});