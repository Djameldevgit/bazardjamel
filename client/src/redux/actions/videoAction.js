// redux/actions/videoAction.js
import { getDataAPI, postDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from './globalTypes';

export const VIDEO_TYPES = {
  LOADING: 'VIDEO_LOADING',
  GET_VIDEOS: 'GET_VIDEOS',
  GET_FEATURED_VIDEOS: 'GET_FEATURED_VIDEOS',
  GET_POPULAR_VIDEOS: 'GET_POPULAR_VIDEOS',
  GET_RELATED_VIDEOS: 'GET_RELATED_VIDEOS',
  GET_VIDEO: 'GET_VIDEO',
  CREATE_VIDEO: 'CREATE_VIDEO',
  UPDATE_VIDEO: 'UPDATE_VIDEO',
  DELETE_VIDEO: 'DELETE_VIDEO',
  LIKE_VIDEO: 'LIKE_VIDEO'
};

// Obtener videos destacados
export const getFeaturedVideos = (limit = 10) => async (dispatch) => {
  try {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: true });
    
    const res = await getDataAPI(`videos/featured?limit=${limit}`);
    
    dispatch({
      type: VIDEO_TYPES.GET_FEATURED_VIDEOS,
      payload: res.data.videos
    });
  } catch (err) {
    console.error('Error getFeaturedVideos:', err);
  } finally {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: false });
  }
};

// Obtener videos populares
export const getPopularVideos = (limit = 10) => async (dispatch) => {
  try {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: true });
    
    const res = await getDataAPI(`videos/popular?limit=${limit}`);
    
    dispatch({
      type: VIDEO_TYPES.GET_POPULAR_VIDEOS,
      payload: res.data.videos
    });
  } catch (err) {
    console.error('Error getPopularVideos:', err);
  } finally {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: false });
  }
};

// ✅ AGREGAR: Obtener videos relacionados
export const getRelatedVideos = (videoId, limit = 6) => async (dispatch) => {
  try {
    const res = await getDataAPI(`videos/${videoId}/related?limit=${limit}`);
    
    dispatch({
      type: VIDEO_TYPES.GET_RELATED_VIDEOS,
      payload: res.data.videos
    });
  } catch (err) {
    console.error('Error getRelatedVideos:', err);
  }
};

// Obtener video por ID
export const getVideoById = (id) => async (dispatch) => {
  try {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: true });
    
    const res = await getDataAPI(`videos/${id}`);
    
    dispatch({
      type: VIDEO_TYPES.GET_VIDEO,
      payload: res.data.video
    });
  } catch (err) {
    console.error('Error getVideoById:', err);
  } finally {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: false });
  }
};

// Crear video
export const createVideo = (videoData, token) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    const res = await postDataAPI('videos', videoData, token);
    
    dispatch({
      type: VIDEO_TYPES.CREATE_VIDEO,
      payload: res.data.video
    });
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: 'Vidéo créée avec succès' }
    });
    
    return { success: true, video: res.data.video };
  } catch (err) {
    console.error('Error createVideo:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Erreur lors de la création' }
    });
    return { success: false, error: err.message };
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// Dar like a video
export const likeVideo = (id, token) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`videos/${id}/like`, {}, token);
    
    dispatch({
      type: VIDEO_TYPES.LIKE_VIDEO,
      payload: { id, likes: res.data.likes, liked: res.data.liked }
    });
    
    return { liked: res.data.liked, likes: res.data.likes };
  } catch (err) {
    console.error('Error likeVideo:', err);
    return { liked: false, likes: 0 };
  }
};

// ✅ AGREGAR: Agregar comentario
export const addComment = (videoId, text, token) => async (dispatch) => {
  try {
    const res = await postDataAPI(`videos/${videoId}/comment`, { text }, token);
    
    return { success: true, comment: res.data.comment };
  } catch (err) {
    console.error('Error addComment:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Erreur lors de l\'ajout du commentaire' }
    });
    return { success: false };
  }
};

// ✅ AGREGAR: Eliminar video
export const deleteVideo = (id, token) => async (dispatch) => {
  try {
    await deleteDataAPI(`videos/${id}`, token);
    
    dispatch({
      type: VIDEO_TYPES.DELETE_VIDEO,
      payload: id
    });
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: 'Vidéo supprimée' }
    });
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Erreur lors de la suppression' }
    });
  }
};

// ✅ AGREGAR: Obtener videos por categoría
export const getVideosByCategory = (categorySlug, page = 1) => async (dispatch) => {
  try {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: true });
    
    const res = await getDataAPI(`videos/category/${categorySlug}?page=${page}`);
    
    dispatch({
      type: VIDEO_TYPES.GET_VIDEOS,
      payload: {
        videos: res.data.videos,
        total: res.data.total,
        page: res.data.page,
        totalPages: res.data.totalPages
      }
    });
  } catch (err) {
    console.error('Error getVideosByCategory:', err);
  } finally {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: false });
  }
};