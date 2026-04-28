// redux/actions/videoAction.js - VERSIÓN CON NOTIFICACIONES
import { getDataAPI, postDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from './globalTypes';
import { createNotify } from './notifyAction'; // ✅ Importar createNotify
// redux/actions/videoAction.js

// ✅ CONSTANTES CORREGIDAS (sin duplicados)
export const VIDEO_TYPES = {
  // Loading states
// redux/actions/videoAction.js

// ✅ Asegúrate de exportar las constantes así
 
  LOADING: 'VIDEO_LOADING',
  LOADING_BY_CATEGORY: 'LOADING_BY_CATEGORY',
  GET_VIDEOS: 'GET_VIDEOS',
  GET_VIDEO: 'GET_VIDEO',
  GET_FEATURED_VIDEOS: 'GET_FEATURED_VIDEOS',
  GET_POPULAR_VIDEOS: 'GET_POPULAR_VIDEOS',
  GET_RELATED_VIDEOS: 'GET_RELATED_VIDEOS',
  GET_VIDEOS_BY_CATEGORY: 'GET_VIDEOS_BY_CATEGORY',
  GET_TRENDING_VIDEOS: 'GET_TRENDING_VIDEOS',
  TRENDING_LOADING: 'TRENDING_LOADING',
  LOAD_MORE_TRENDING: 'LOAD_MORE_TRENDING',
  CREATE_VIDEO: 'CREATE_VIDEO',
  UPDATE_VIDEO: 'UPDATE_VIDEO',
  DELETE_VIDEO: 'DELETE_VIDEO',
  LIKE_VIDEO: 'LIKE_VIDEO',
  SHARE_VIDEO: 'SHARE_VIDEO',
  UPDATE_VIDEO_STATS: 'UPDATE_VIDEO_STATS',
  UPDATE_VIDEO_ENGAGEMENT: 'UPDATE_VIDEO_ENGAGEMENT',
  INCREMENT_VIEW: 'INCREMENT_VIEW',
  COMMENTS_LOADING: 'COMMENTS_LOADING',
  GET_COMMENTS: 'GET_COMMENTS',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  LIKE_COMMENT: 'LIKE_COMMENT',
  ADD_COMMENT_REPLY: 'ADD_COMMENT_REPLY',
  EDIT_COMMENT: 'EDIT_COMMENT',
  DELETE_REPLY: 'DELETE_REPLY',
  EDIT_REPLY: 'EDIT_REPLY',
  CLEAR_COMMENTS: 'CLEAR_COMMENTS',
  MUSIC_LOADING: 'MUSIC_LOADING',
  GET_MUSIC_LIBRARY: 'GET_MUSIC_LIBRARY',
  MUSIC_ERROR: 'MUSIC_ERROR',
  GET_PENDING_VIDEO: 'GET_PENDING_VIDEO'
};

// ✅ También exporta como default si es necesario
 

// ============================================
// ACCIONES DE VIDEOS CON NOTIFICACIONES
// ============================================
export const incrementView = (videoId, token) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`videos/${videoId}/view`, {}, token);
    
    if (res.data.success) {
      // Actualizar el video en el estado global
      dispatch({
        type: VIDEO_TYPES.UPDATE_VIDEO_STATS,
        payload: {
          videoId,
          stats: { views: res.data.views }
        }
      });
      
      return { success: true, views: res.data.views };
    }
  } catch (err) {
    console.error('Error incrementando vista:', err);
    return { success: false, error: err.response?.data?.message };
  }
};
// ✅ Crear video CON NOTIFICACIÓN
// redux/actions/videoAction.js - createVideo CORREGIDO

// ✅ Crear video CON NOTIFICACIÓN a ADMINISTRADORES
// redux/actions/videoAction.js - createVideo CORREGIDO


export const createVideo = (videoData, token, auth, socket) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    const res = await postDataAPI('videos', videoData, token);
    
    dispatch({
      type: VIDEO_TYPES.CREATE_VIDEO,
      payload: res.data.video
    });
    
    const video = res.data.video;
    
    // ✅ 1. NOTIFICACIÓN AL USUARIO (que creó el video)
    const userMsg = {
      id: auth.user._id,
      text: `🎬 Votre vidéo "${video.title}" a été créée avec succès et est en attente de validation.`,
      recipients: [auth.user._id], // Enviar al propio usuario
      url: `/video/${video._id}`,
      content: video.title,
      image: video.thumbnail,
      type: 'video_pending'
    };
    
    await dispatch(createNotify({ msg: userMsg, auth, socket }));
    
    // ✅ 2. NOTIFICACIÓN A LOS ADMINISTRADORES
    // Usar "admin" como string para que el backend busque todos los admins
    const adminMsg = {
      id: auth.user._id,
      text: `🎬 Nouvelle vidéo en attente d'approbation: "${video.title}" par ${auth.user.username}`,
      recipients: ["admin"], // ✅ String "admin" para que el backend busque todos los admins
      url: `/admin/posts?tab=videos`,
      content: video.title,
      image: video.thumbnail,
      type: 'video_pending_admin'
    };
    
    await dispatch(createNotify({ msg: adminMsg, auth, socket }));
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { 
        success: '🎬 Vidéo créée avec succès! Vous serez notifié lorsqu\'elle sera validée.' 
      }
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
// ✅ Actualizar video CON NOTIFICACIÓN
export const updateVideo = (id, videoData, token, auth, socket, oldVideoData) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    const res = await patchDataAPI(`videos/${id}`, videoData, token);
    
    dispatch({
      type: VIDEO_TYPES.UPDATE_VIDEO,
      payload: res.data.video
    });
    
    // ✅ Notificar al dueño del video sobre la actualización
    const video = res.data.video;
    if (video && video.user?._id && video.user._id !== auth.user._id) {
      const msg = {
        id: auth.user._id,
        text: '✏️ Votre vidéo a été mise à jour',
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

// ✅ Eliminar video CON NOTIFICACIÓN
 
  // redux/actions/videoAction.js - AÑADIR/ CORREGIR deleteVideo para OWNER

// ✅ Eliminar video para OWNER (ruta diferente a la de admin)
export const deleteVideo = (id, token, auth, socket, videoData) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    // ✅ Usar la ruta de usuario normal, NO la de admin
    const res = await deleteDataAPI(`videos/${id}`, token);
    
    dispatch({
      type: VIDEO_TYPES.DELETE_VIDEO,
      payload: id
    });
    
    const video = res.data?.video || videoData;
    
    // ✅ Notificar al dueño (opcional, si no es el mismo)
    if (video && video.user && video.user._id && video.user._id !== auth.user._id) {
      const msg = {
        id: auth.user._id,
        text: `🗑️ Votre vidéo "${video.title || 'sans titre'}" a été supprimée`,
        recipients: [video.user._id],
        url: `/`,
        content: video.title || 'Vidéo',
        image: video.thumbnail || null,
        type: 'video_deleted'
      };
      
      if (socket) {
        socket.emit('createNotify', msg);
      }
      
      dispatch(createNotify({ msg, auth, socket }));
    }
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: 'Vidéo supprimée avec succès' }
    });
    
    return { success: true, data: res.data };
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
// ✅ Dar like a video CON NOTIFICACIÓN
export const likeVideo = (id, token, auth, socket, videoData) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`videos/${id}/like`, {}, token);
    
    dispatch({
      type: VIDEO_TYPES.LIKE_VIDEO,
      payload: { id, likes: res.data.likes, liked: res.data.liked }
    });
    
    // ✅ Notificar al dueño del video que recibió un like (solo si no es el mismo usuario)
    if (res.data.liked && videoData && videoData.user?._id && videoData.user._id !== auth.user._id) {
      const msg = {
        id: auth.user._id,
        text: `❤️ @${auth.user.username} a aimé votre vidéo`,
        recipients: [videoData.user._id],
        url: `/video/${id}`,
        content: videoData.title,
        image: videoData.thumbnail,
        type: 'video'
      };
      
      dispatch(createNotify({ msg, auth, socket }));
    }
    
    return { liked: res.data.liked, likes: res.data.likes };
  } catch (err) {
    console.error('Error likeVideo:', err);
    return { liked: false, likes: 0 };
  }
};

// ✅ Compartir video CON NOTIFICACIÓN
export const shareVideo = (id, token, auth, socket, videoData) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`videos/${id}/share`, {}, token);
    
    dispatch({
      type: VIDEO_TYPES.SHARE_VIDEO,
      payload: { id, shares: res.data.shares, shared: res.data.shared }
    });
    
    // ✅ Notificar al dueño del video que fue compartido
    if (res.data.shared && videoData && videoData.user?._id && videoData.user._id !== auth.user._id) {
      const msg = {
        id: auth.user._id,
        text: `🔄 @${auth.user.username} a partagé votre vidéo`,
        recipients: [videoData.user._id],
        url: `/video/${id}`,
        content: videoData.title,
        image: videoData.thumbnail,
        type: 'video'
      };
      
      dispatch(createNotify({ msg, auth, socket }));
    }
    
    return { shared: res.data.shared, shares: res.data.shares };
  } catch (err) {
    console.error('Error shareVideo:', err);
    return { shared: false, shares: 0 };
  }
};

 

// ✅ Dar like a comentario CON NOTIFICACIÓN
export const likeComment = (videoId, commentId, token, auth, socket, commentData, videoData) => async (dispatch) => {
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
    
    // ✅ Notificar al autor del comentario sobre el like
    if (res.data.liked && commentData && commentData.user?._id && commentData.user._id !== auth.user._id) {
      const msg = {
        id: auth.user._id,
        text: `❤️ @${auth.user.username} a aimé votre commentaire`,
        recipients: [commentData.user._id],
        url: `/video/${videoId}`,
        content: commentData.text?.substring(0, 50),
        image: videoData?.thumbnail,
        type: 'comment'
      };
      
      dispatch(createNotify({ msg, auth, socket }));
    }
    
    return { success: true, likes: res.data.likes, liked: res.data.liked };
  } catch (err) {
    console.error('Error likeComment:', err);
    return { success: false };
  }
};

// ✅ Agregar respuesta a comentario CON NOTIFICACIÓN
export const addCommentReply = (videoId, commentId, text, token, auth, socket, parentCommentData, videoData) => async (dispatch) => {
  try {
    const res = await postDataAPI(`videos/${videoId}/comments/${commentId}/reply`, { text }, token);
    
    dispatch({
      type: VIDEO_TYPES.ADD_COMMENT_REPLY,
      payload: {
        commentId,
        reply: res.data.reply
      }
    });
    
    // ✅ Notificar al autor del comentario padre sobre la respuesta
    if (parentCommentData && parentCommentData.user?._id && parentCommentData.user._id !== auth.user._id) {
      const msg = {
        id: auth.user._id,
        text: `💬 @${auth.user.username} a répondu à votre commentaire: "${text.substring(0, 50)}${text.length > 50 ? '...' : ''}"`,
        recipients: [parentCommentData.user._id],
        url: `/video/${videoId}`,
        content: videoData?.title,
        image: videoData?.thumbnail,
        type: 'comment'
      };
      
      dispatch(createNotify({ msg, auth, socket }));
    }
    
    return { success: true, reply: res.data.reply };
  } catch (err) {
    console.error('Error addCommentReply:', err);
    return { success: false };
  }
};

// ✅ Eliminar comentario
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
// ACCIONES DE VIDEOS (sin cambios)
// ============================================

export const getVideos = (categorySlug = null, subCategory = null, page = 1, limit = 12, sortBy = 'recent', searchTerm = null) => async (dispatch) => {
  try {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: true });
    
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', limit);
    if (sortBy) params.append('sortBy', sortBy);
    if (searchTerm && searchTerm.trim() !== '') params.append('searchTerm', searchTerm);
    
    if (subCategory && subCategory !== 'videos') {
      params.append('subCategory', subCategory);
    }
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

 
export const getFeaturedVideos = (limit = 10) => async (dispatch) => {
  try {
    const res = await getDataAPI(`videos/featured?limit=${limit}`);
    dispatch({ type: VIDEO_TYPES.GET_FEATURED_VIDEOS, payload: res.data.videos });
  } catch (err) {
    console.error('Error getFeaturedVideos:', err);
  }
};
// redux/actions/videoAction.js

// ✅ Obtener video por ID (maneja videos pendientes)
// redux/actions/videoAction.js - getVideoById CORREGIDO

export const getVideoById = (id) => async (dispatch) => {
  try {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: true });
    
    console.log('📹 Llamando a API - ID:', id);
    
    const res = await getDataAPI(`videos/public/${id}`);
    
    console.log('📹 Respuesta completa:', res.data);
    
    // ✅ Verificar si el video existe y tiene el campo pendiente = true
    if (res.data.video && res.data.video.pendiente === true) {
      console.log('✅ Video pendiente detectado! pendiente:', res.data.video.pendiente);
      
      // Guardar el video directamente en el estado (con su campo pendiente)
      dispatch({
        type: VIDEO_TYPES.GET_VIDEO,
        payload: res.data.video
      });
      
      // Mostrar notificación
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { 
          info: res.data.message || '📹 Votre vidéo a été envoyée pour validation.'
        }
      });
      
      dispatch({ type: VIDEO_TYPES.LOADING, payload: false });
      return { success: false, video: res.data.video };
    }
    
    // ✅ Video aprobado normal
    if (res.data.success === true && res.data.video) {
      console.log('✅ Video aprobado!');
      dispatch({
        type: VIDEO_TYPES.GET_VIDEO,
        payload: res.data.video
      });
      
      dispatch({ type: VIDEO_TYPES.LOADING, payload: false });
      return { success: true, video: res.data.video };
    }
    
    // ✅ Error
    console.log('⚠️ Error en la respuesta:', res.data);
    dispatch({ type: VIDEO_TYPES.LOADING, payload: false });
    return { success: false, error: res.data.message || 'Erreur inconnue' };
    
  } catch (err) {
    console.error('❌ Error getVideoById:', err);
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Impossible de charger la vidéo' }
    });
    
    dispatch({ type: VIDEO_TYPES.LOADING, payload: false });
    return { success: false, error: err.message };
  }
};
// ✅ Para ver videos en el panel de admin (privado)
// ✅ Esto ya está en videoAction.js
export const getVideoByIdPrivate = (id, token) => async (dispatch) => {
  try {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: true });
    const res = await getDataAPI(`videos/private/${id}`, token);
    dispatch({
      type: VIDEO_TYPES.GET_VIDEO,
      payload: res.data.video
    });
    return res.data;
  } catch (err) {
    console.error('Error getVideoByIdPrivate:', err);
    return null;
  } finally {
    dispatch({ type: VIDEO_TYPES.LOADING, payload: false });
  }
};
// ✅ Ya existe la acción
// redux/actions/videoAction.js (añadir/verificar esta función)

// ✅ Tracking tiempo de visualización
export const trackWatchTime = (id, watchTime, token) => async (dispatch) => {
  try {
    if (!token || !id || !watchTime) return;
    
    const res = await postDataAPI(`videos/${id}/watch-time`, { watchTime }, token);
    console.log(`📊 WatchTime registrado: ${watchTime}s para video ${id}`);
    return res.data;
  } catch (err) {
    console.error('❌ Error trackWatchTime:', err.response?.data?.message || err.message);
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

// redux/actions/videoAction.js

// ✅ Añadir esta acción (si no existe)
// pages/video/TrendingVideos.jsx
// En la función getTrendingVideos, la URL debe ser:

// redux/actions/videoAction.js

export const getTrendingVideos = (timeWindow = 'week', page = 1, limit = 20) => async (dispatch) => {
  try {
    dispatch({ type: VIDEO_TYPES.TRENDING_LOADING });
    
    // ✅ Usar getDataAPI como todas las demás acciones
    const res = await getDataAPI(`videos/trending?timeRange=${timeWindow}&limit=${limit * page}`);
    
    console.log('🎯 Trending videos response:', res.data);
    
    dispatch({
      type: VIDEO_TYPES.GET_TRENDING_VIDEOS,
      payload: {
        videos: res.data.videos || [],
        hasMore: (res.data.videos || []).length === limit,
        page: page,
        timeWindow: timeWindow
      }
    });
  } catch (err) {
    console.error('❌ Error loading trending videos:', err);
    
    dispatch({
      type: VIDEO_TYPES.GET_TRENDING_VIDEOS,
      payload: {
        videos: [],
        hasMore: false,
        page: 1,
        timeWindow: timeWindow
      }
    });
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || 'Error loading trending videos' }
    });
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

 

export const getUserVideoStats = (token) => async (dispatch) => {
  try {
    const res = await getDataAPI('videos/user/stats', token);
    return res.data;
  } catch (err) {
    console.error('Error getUserVideoStats:', err);
    return null;
  }
};

     
export const editReply = (videoId, commentId, replyId, text, token) => async (dispatch) => {
  try {
    const res = await patchDataAPI(`videos/${videoId}/comments/${commentId}/replies/${replyId}`, { text }, token);
    
    dispatch({
      type: VIDEO_TYPES.EDIT_REPLY,
      payload: {
        commentId,
        replyId,
        text: res.data.reply.text
      }
    });
    
    return { success: true, reply: res.data.reply };
  } catch (err) {
    console.error('Error editReply:', err);
    return { success: false };
  }
};

export const deleteReply = (videoId, commentId, replyId, token) => async (dispatch) => {
  try {
    await deleteDataAPI(`videos/${videoId}/comments/${commentId}/replies/${replyId}`, token);
    
    dispatch({
      type: VIDEO_TYPES.DELETE_REPLY,
      payload: { commentId, replyId }
    });
    
    return { success: true };
  } catch (err) {
    console.error('Error deleteReply:', err);
    return { success: false };
  }
};

// redux/actions/videoAction.js - Añadir estas funciones

// ✅ Crear comentario con soporte para replies
export const addComment = (videoId, text, token, auth, socket, videoData, replyId = null, replyUser = null) => async (dispatch) => {
  try {
      const commentData = {
          text,
          reply: replyId,
          tag: replyUser
      }
      
      const res = await postDataAPI(`videos/${videoId}/comments`, commentData, token)
      
      // Emitir evento socket
      if (socket) {
          if (replyId) {
              socket.emit('new-reply', { videoId, commentId: replyId, reply: res.data.comment })
          } else {
              socket.emit('new-comment', { videoId, comment: res.data.comment })
          }
      }
      
      return { success: true, comment: res.data.comment }
  } catch (err) {
      console.error('Error addComment:', err)
      return { success: false, error: err.response?.data?.message }
  }
}

// ✅ Editar comentario
export const updateComment = (videoId, commentId, text, token) => async (dispatch) => {
  try {
      const res = await patchDataAPI(`videos/${videoId}/comments/${commentId}`, { text }, token)
      
      dispatch({
          type: VIDEO_TYPES.EDIT_COMMENT,
          payload: { commentId, text: res.data.comment.text, edited: true }
      })
      
      return { success: true, comment: res.data.comment }
  } catch (err) {
      console.error('Error editComment:', err)
      return { success: false }
  }
}










export const unLikeComment = ({comment, post, auth}) => async (dispatch) => {

  const newComment = {...comment, likes: DeleteData(comment.likes, auth.user._id)}

  const newComments = EditData(post.comments, comment._id, newComment)

  const newPost = {...post, comments: newComments}
  
  dispatch({ type: POST_TYPES.UPDATE_POST, payload: newPost })

  try {
      await patchDataAPI(`comment/${comment._id}/unlike`, null, auth.token)
  } catch (err) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: {error: err.response.data.msg} })
  }
}

 