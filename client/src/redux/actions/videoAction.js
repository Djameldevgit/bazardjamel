// redux/actions/videoAction.js - VERSIÓN UNIFICADA

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
  LIKE_VIDEO: 'LIKE_VIDEO',
  SHARE_VIDEO: 'SHARE_VIDEO',
  // Tipos para comentarios
  COMMENTS_LOADING: 'COMMENTS_LOADING',
  GET_COMMENTS: 'GET_COMMENTS',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  LIKE_COMMENT: 'LIKE_COMMENT',
  ADD_COMMENT_REPLY: 'ADD_COMMENT_REPLY',
  CLEAR_COMMENTS: 'CLEAR_COMMENTS',

  MUSIC_LOADING: 'MUSIC_LOADING',
  GET_MUSIC_LIBRARY: 'GET_MUSIC_LIBRARY',
  MUSIC_ERROR: 'MUSIC_ERROR',


};

// ============================================
// ACCIONES DE MÚSICA
// ============================================

 
const getMusicLibrary = async (req, res) => {
  try {
    const { q = 'background', limit = 20 } = req.query;
    const perPage = Math.min(parseInt(limit), 50);

    const response = await axios.get(PIXABAY_API_URL, {
      params: {
        key: PIXABAY_API_KEY,
        q: `${q} music`,
        per_page: perPage,
        editors_choice: true,
        safesearch: true,
      },
    });

    const hits = response.data.hits.map(video => ({
      id: video.id,
      title: video.tags.split(',')[0],
      tags: video.tags,
      user: video.user,
      duration: video.duration,
      audio: video.videos.tiny.url || video.videos.small.url || '',
      thumbnail: video.previewURL,
      genre: 'Pop',
    })).filter(item => item.audio);

    res.json({ success: true, hits });
  } catch (error) {
    console.error('Error fetching music:', error.message);
    res.status(500).json({ success: false, error: 'No se pudo cargar la música' });
  }
};

 
export const getVideos = (categorySlug = null, subCategory = null, page = 1, limit = 12, sortBy = 'recent', searchTerm = null) => async (dispatch) => {
  try {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: true });
    
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (sortBy) params.append('sortBy', sortBy);
    if (searchTerm && searchTerm.trim() !== '') params.append('searchTerm', searchTerm);
    
    // Si hay subCategory, usarla (prioridad)
    if (subCategory && subCategory !== 'videos') {
      params.append('subCategory', subCategory);
    }
    // Si no hay subCategory pero hay categorySlug
    else if (categorySlug && categorySlug !== 'videos') {
      params.append('category', categorySlug);
    }
    
    console.log('🎬 getVideos llamado:', {
      categorySlug,
      subCategory,
      page,
      sortBy,
      searchTerm,
      url: `videos/filter?${params.toString()}`
    });
    
    const res = await getDataAPI(`videos/filter?${params.toString()}`);
    
    dispatch({
      type: VIDEO_TYPES.GET_VIDEOS,
      payload: {
        videos: res.data.videos || [],
        total: res.data.total || 0,
        page: res.data.page || page,
        totalPages: res.data.totalPages || 1,
        hasMore: res.data.hasMore || false,
        children: res.data.children || []
      }
    });
    
    return res.data;
    
  } catch (err) {
    console.error('Error getVideos:', err);
    return { success: false, videos: [] };
  } finally {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: false });
  }
};

// ✅ Obtener video por ID
export const getVideoById = (id) => async (dispatch) => {
  try {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: true });
    
    const res = await getDataAPI(`videos/${id}`);
    
    dispatch({
      type: VIDEO_TYPES.GET_VIDEO,
      payload: res.data.video
    });
    
    return res.data;
  } catch (err) {
    console.error('Error getVideoById:', err);
    return null;
  } finally {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: false });
  }
};

// ✅ Crear video
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

// ✅ Actualizar video
export const updateVideo = (id, videoData, token) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    const res = await patchDataAPI(`videos/${id}`, videoData, token);
    
    dispatch({
      type: VIDEO_TYPES.UPDATE_VIDEO,
      payload: res.data.video
    });
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: 'Vidéo mise à jour avec succès' }
    });
    
    return { success: true, video: res.data.video };
  } catch (err) {
    console.error('Error updateVideo:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Erreur lors de la mise à jour' }
    });
    return { success: false, error: err.message };
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// ✅ Eliminar video
export const deleteVideo = (id, token) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    await deleteDataAPI(`videos/${id}`, token);
    
    dispatch({
      type: VIDEO_TYPES.DELETE_VIDEO,
      payload: id
    });
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: 'Vidéo supprimée avec succès' }
    });
    
    return { success: true };
  } catch (err) {
    console.error('Error deleteVideo:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Erreur lors de la suppression' }
    });
    return { success: false, error: err.message };
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// ✅ Dar like a video
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

// ✅ Compartir video
export const shareVideo = (id, token) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`videos/${id}/share`, {}, token);
    
    dispatch({
      type: VIDEO_TYPES.SHARE_VIDEO,
      payload: { id, shares: res.data.shares, shared: res.data.shared }
    });
    
    return { shared: res.data.shared, shares: res.data.shares };
  } catch (err) {
    console.error('Error shareVideo:', err);
    return { shared: false, shares: 0 };
  }
};

// ============================================
// ACCIONES PARA HOME (destacados, populares, tendencia)
// ============================================

export const getFeaturedVideos = (limit = 10) => async (dispatch) => {
  try {
    const res = await getDataAPI(`videos/featured?limit=${limit}`);
    dispatch({ type: VIDEO_TYPES.GET_FEATURED_VIDEOS, payload: res.data.videos });
  } catch (err) {
    console.error('Error getFeaturedVideos:', err);
  }
};

export const getPopularVideos = (limit = 10) => async (dispatch) => {
  try {
    const res = await getDataAPI(`videos/popular?limit=${limit}`);
    dispatch({ type: VIDEO_TYPES.GET_POPULAR_VIDEOS, payload: res.data.videos });
  } catch (err) {
    console.error('Error getPopularVideos:', err);
  }
};

export const getTrendingVideos = (limit = 10, timeRange = 'week') => async (dispatch) => {
  try {
    const res = await getDataAPI(`videos/trending?limit=${limit}&timeRange=${timeRange}`);
    dispatch({ type: VIDEO_TYPES.GET_TRENDING_VIDEOS, payload: res.data.videos });
  } catch (err) {
    console.error('Error getTrendingVideos:', err);
  }
};

export const getRelatedVideos = (videoId, limit = 6) => async (dispatch) => {
  try {
    const res = await getDataAPI(`videos/${videoId}/related?limit=${limit}`);
    dispatch({ type: VIDEO_TYPES.GET_RELATED_VIDEOS, payload: res.data.videos });
  } catch (err) {
    console.error('Error getRelatedVideos:', err);
  }
};

// ============================================
// ACCIONES DE COMENTARIOS
// ============================================

export const clearComments = () => ({
  type: VIDEO_TYPES.CLEAR_COMMENTS
});

export const getComments = (videoId, page = 1, limit = 20) => async (dispatch) => {
  try {
    dispatch({ type: VIDEO_TYPES.COMMENTS_LOADING, payload: true });
    
    const res = await getDataAPI(`videos/${videoId}/comments?page=${page}&limit=${limit}`);
    
    dispatch({
      type: VIDEO_TYPES.GET_COMMENTS,
      payload: {
        comments: res.data.comments,
        total: res.data.total,
        page: parseInt(page),
        hasMore: res.data.hasMore
      }
    });
    
    return { success: true, hasMore: res.data.hasMore };
  } catch (err) {
    console.error('Error getComments:', err);
    return { success: false, hasMore: false };
  } finally {
    dispatch({ type: VIDEO_TYPES.COMMENTS_LOADING, payload: false });
  }
};

export const addComment = (videoId, text, token) => async (dispatch) => {
  try {
    const res = await postDataAPI(`videos/${videoId}/comments`, { text }, token);
    
    dispatch({
      type: VIDEO_TYPES.ADD_COMMENT,
      payload: res.data.comment
    });
    
    return { success: true, comment: res.data.comment };
  } catch (err) {
    console.error('Error addComment:', err);
    return { success: false };
  }
};

export const likeComment = (videoId, commentId, token) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`videos/${videoId}/comments/${commentId}/like`, {}, token);
    
    dispatch({
      type: VIDEO_TYPES.LIKE_COMMENT,
      payload: {
        commentId,
        likes: res.data.likes,
        liked: res.data.liked
      }
    });
    
    return { success: true, likes: res.data.likes, liked: res.data.liked };
  } catch (err) {
    console.error('Error likeComment:', err);
    return { success: false };
  }
};

export const addCommentReply = (videoId, commentId, text, token) => async (dispatch) => {
  try {
    const res = await postDataAPI(`videos/${videoId}/comments/${commentId}/reply`, { text }, token);
    
    dispatch({
      type: VIDEO_TYPES.ADD_COMMENT_REPLY,
      payload: {
        commentId,
        reply: res.data.reply
      }
    });
    
    return { success: true, reply: res.data.reply };
  } catch (err) {
    console.error('Error addCommentReply:', err);
    return { success: false };
  }
};

export const deleteComment = (videoId, commentId, token) => async (dispatch) => {
  try {
    await deleteDataAPI(`videos/${videoId}/comments/${commentId}`, token);
    
    dispatch({
      type: VIDEO_TYPES.DELETE_COMMENT,
      payload: { commentId }
    });
    
    return { success: true };
  } catch (err) {
    console.error('Error deleteComment:', err);
    return { success: false };
  }
};

// ============================================
// ACCIONES DE ESTADÍSTICAS
// ============================================

export const trackWatchTime = (id, watchTime, token) => async (dispatch) => {
  try {
    await postDataAPI(`videos/${id}/watch-time`, { watchTime }, token);
  } catch (err) {
    console.error('Error trackWatchTime:', err);
  }
};

export const getUserVideoStats = (token) => async (dispatch) => {
  try {
    const res = await getDataAPI('videos/user/stats', token);
    return res.data;
  } catch (err) {
    console.error('Error getUserVideoStats:', err);
    return null;
  }
};
