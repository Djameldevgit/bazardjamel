// redux/actions/boutiqueAction.js
import { GLOBALTYPES } from './globalTypes';
import axios from 'axios';
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData';
import { imageUpload } from '../../utils/imageUpload';
 
export const BOUTIQUE_TYPES = {
  // Basic CRUD
  CREATE_BOUTIQUE: 'CREATE_BOUTIQUE',
  GET_BOUTIQUES: 'GET_BOUTIQUES',
  GET_BOUTIQUE: 'GET_BOUTIQUE',
  UPDATE_BOUTIQUE: 'UPDATE_BOUTIQUE',
  DELETE_BOUTIQUE: 'DELETE_BOUTIQUE',
  INCREMENT_BOUTIQUE_VIEW:'INCREMENT_BOUTIQUE_VIEW',
  GET_BOUTIQUES_BY_CATEGORY: 'GET_BOUTIQUES_BY_CATEGORY',
  GET_BOUTIQUES_FOR_HOME: 'GET_BOUTIQUES_FOR_HOME',
  // User specific
  GET_USER_BOUTIQUES: 'GET_USER_BOUTIQUES',
  GET_BOUTIQUE_BY_DOMAIN: 'GET_BOUTIQUE_BY_DOMAIN',
  
 
  UPDATE_BOUTIQUE_HEADER_IMAGES: 'UPDATE_BOUTIQUE_HEADER_IMAGES',
  DELETE_BOUTIQUE_HEADER_IMAGE: 'DELETE_BOUTIQUE_HEADER_IMAGE', 




  UPDATE_BOUTIQUE_STATUS: 'UPDATE_BOUTIQUE_STATUS',
  
  // Stats
  GET_BOUTIQUE_STATS: 'GET_BOUTIQUE_STATS',
  
  // Loading states
  LOADING_BOUTIQUE: 'LOADING_BOUTIQUE',
 
  LOADING_BOUTIQUES_BY_CATEGORY: 'LOADING_BOUTIQUES_BY_CATEGORY',


  FOLLOW_BOUTIQUE: 'FOLLOW_BOUTIQUE',
  UNFOLLOW_BOUTIQUE: 'UNFOLLOW_BOUTIQUE',
  LIKE_BOUTIQUE: 'LIKE_BOUTIQUE',
  UNLIKE_BOUTIQUE: 'UNLIKE_BOUTIQUE',
  GET_BOUTIQUE_FOLLOWERS: 'GET_BOUTIQUE_FOLLOWERS',
  GET_BOUTIQUE_LIKES: 'GET_BOUTIQUE_LIKES',
  




};
// ============ CREATE BOUTIQUE ============
export const createBoutique = ({ 
  boutiqueData, 
  images, 
  auth 
}) => async (dispatch) => {
  console.time('⏱️ createBoutique action time');
  
  try {
    console.log('🟡 createBoutique action iniciada');
    dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} });
    
    let finalImages = [];
    
    // Subir imágenes nuevas a Cloudinary
    const newImages = images.filter(img => !img.isExisting && img.url?.startsWith('blob:'));
    const existingImages = images.filter(img => img.isExisting);
    
    if (newImages.length > 0) {
      console.log(`📤 Subiendo ${newImages.length} imagen(es) a Cloudinary...`);
      const uploaded = await imageUpload(newImages);
      finalImages = [...existingImages, ...uploaded];
    } else {
      finalImages = existingImages;
    }
    
    // Preparar datos finales
    const boutiqueToSend = {
      ...boutiqueData,
      images: finalImages
    };

    console.log('📦 Enviando al API:', {
      nom_boutique: boutiqueToSend.nom_boutique,
      imagesCount: boutiqueToSend.images.length
    });

    const res = await postDataAPI('boutique', boutiqueToSend, auth.token);
    
    dispatch({ 
      type: BOUTIQUE_TYPES.CREATE_BOUTIQUE, 
      payload: res.data.boutique
    });

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: res.data.message }
    });

    return res.data;

  } catch (err) {
    console.error('❌ Error:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {error: err.response?.data?.message || err.message}
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: false} });
    console.timeEnd('⏱️ createBoutique action time');
  }
};

// ============ UPDATE BOUTIQUE ============
export const updateBoutique = ({ 
  boutiqueId, 
  boutiqueData, 
  images, 
  auth 
}) => async (dispatch) => {
  console.time('⏱️ updateBoutique action time');
  
  try {
    console.log('🟡 updateBoutique action iniciada', { boutiqueId });
    dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} });
    
    let finalImages = [];
    
    // Procesar imágenes nuevas si hay
    if (images && images.length > 0) {
      const newImages = images.filter(img => !img.isExisting && img.url?.startsWith('blob:'));
      const existingImages = images.filter(img => img.isExisting);
      
      if (newImages.length > 0) {
        console.log(`📤 Subiendo ${newImages.length} imagen(es) nuevas a Cloudinary...`);
        const uploaded = await imageUpload(newImages);
        finalImages = [...existingImages, ...uploaded];
      } else {
        finalImages = existingImages;
      }
    }
    
    // Preparar datos finales
    const boutiqueToSend = {
      ...boutiqueData,
      images: finalImages.length > 0 ? finalImages : boutiqueData.images || []
    };

    console.log('📦 Enviando actualización al API:', {
      boutiqueId,
      nom_boutique: boutiqueToSend.nom_boutique,
      imagesCount: boutiqueToSend.images.length
    });

    const res = await patchDataAPI(`boutique/${boutiqueId}`, boutiqueToSend, auth.token);
    
    dispatch({ 
      type: BOUTIQUE_TYPES.UPDATE_BOUTIQUE, 
      payload: res.data.boutique || res.data
    });

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: res.data.message || 'Boutique mise à jour avec succès!' }
    });

    return res.data;

  } catch (err) {
    console.error('❌ Error en updateBoutique:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {error: err.response?.data?.message || err.message}
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: false} });
    console.timeEnd('⏱️ updateBoutique action time');
  }
};

// ============ DELETE BOUTIQUE ============
export const deleteBoutique = ({ 
  boutiqueId, 
  auth 
}) => async (dispatch) => {
  try {
    
    dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} });
    
    const res = await deleteDataAPI(`boutique/${boutiqueId}`, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.DELETE_BOUTIQUE,
      payload: boutiqueId
    });
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: res.data.message || 'Boutique supprimée avec succès' }
    });
    
    return res.data;
    
  } catch (err) {
    console.error('❌ Error en deleteBoutique:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: false} });
  }
};

// ============ GET BOUTIQUE BY ID ============
export const getBoutique = (id, auth = null) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    const res = await getDataAPI(`boutique/${id}`, auth?.token);
    
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

// ============ GET USER BOUTIQUES ============
export const getUserBoutiques = (auth) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    const res = await getDataAPI('boutique/user/me', auth.token);
    
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

// ============ GET BOUTIQUES BY CATEGORY ============
export const getBoutiquesByCategory = (
  categorySlug,
  subSlug = null,
  page = 1,
  limit = 12,
  wilaya = '',
  commune = '',
  minPrice = null,
  maxPrice = null,
  sortBy = 'recent'
) => async (dispatch) => {
  try {
    const categoryPath = subSlug ? `${categorySlug}/${subSlug}` : categorySlug;

    const params = { category: categorySlug, page, limit };
    if (subSlug && subSlug !== 'undefined' && subSlug !== 'null') params.sub = subSlug;
    if (wilaya) params.wilaya = wilaya;
    if (commune) params.commune = commune;
    if (minPrice !== null) params.minPrice = minPrice;
    if (maxPrice !== null) params.maxPrice = maxPrice;
    if (sortBy) params.sortBy = sortBy;

    const res = await getDataAPI(`boutique/filter?${new URLSearchParams(params)}`);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_BOUTIQUES_BY_CATEGORY,
      payload: {
        categoryPath,
        boutiques: res.data.boutiques || [],
        total: res.data.total || 0,
        page: res.data.page || page,
        totalPages: res.data.totalPages || 1,
        hasMore: res.data.hasMore || false,
        categoryInfo: res.data.categoryInfo || null,
        children: res.data.children || []
      }
    });

    return res.data;
  } catch (err) {
    console.error('❌ Error en getBoutiquesByCategory:', err);
    throw err;
  }
};
// ============ GET BOUTIQUES FOR HOME ============
export const getBoutiquesForHome = (limit = 6) => async (dispatch) => {
  try {
    console.log('🏪 Cargando boutiques para el home con límite:', limit);
    
    const params = { 
      category: 'boutiques', 
      page: 1, 
      limit: limit 
    };
    
    const res = await getDataAPI(`boutique/filter?${new URLSearchParams(params)}`);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_BOUTIQUES_FOR_HOME,
      payload: res.data.boutiques || []
    });
    
    return res.data.boutiques;
    
  } catch (err) {
    console.error('❌ Error cargando boutiques para home:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    return [];
  }
};

// ============ UPDATE BOUTIQUE STATUS ============
export const updateBoutiqueStatus = ({ 
  boutiqueId, 
  statusData, 
  auth 
}) => async (dispatch) => {
  try {
    console.log('🔄 updateBoutiqueStatus action iniciada', { boutiqueId, statusData });
    dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} });
    
    const res = await patchDataAPI(`boutique/${boutiqueId}/status`, statusData, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.UPDATE_BOUTIQUE_STATUS,
      payload: {
        id: boutiqueId,
        ...res.data.boutique
      }
    });
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: res.data.message || 'Statut mis à jour avec succès' }
    });
    
    return res.data;
    
  } catch (err) {
    console.error('❌ Error en updateBoutiqueStatus:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: false} });
  }
};

// ============ GET BOUTIQUE STATS ============
export const getBoutiqueStats = (boutiqueId, auth) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    const res = await getDataAPI(`boutique/${boutiqueId}/stats`, auth.token);
    
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

// ============ RESET FUNCTIONS ============
export const resetBoutiquesByCategory = (categoryPath) => ({
  type: 'CLEAR_BOUTIQUES_BY_CATEGORY',
  payload: { categoryPath }
});

export const resetAllBoutiques = () => ({
  type: 'CLEAR_BOUTIQUES'
});

 
 
export const incrementBoutiqueView = (boutiqueId) => async (dispatch) => {
  try {
    const sessionKey = `view_sent_${boutiqueId}`;
    if (sessionStorage.getItem(sessionKey)) {
      console.log('⏭️ Vista ya enviada en esta sesión');
      return;
    }
    
    console.log('📤 Llamando a API: PATCH /api/boutique/', boutiqueId, '/view');
    sessionStorage.setItem(sessionKey, Date.now());
    
    const response = await axios.patch(`/api/boutique/${boutiqueId}/view`);
    console.log('✅ Respuesta del servidor:', response.data);
    
    // Actualizar el estado con el nuevo contador
    if (response.data.views) {
      dispatch({
        type: 'UPDATE_BOUTIQUE_VIEWS',
        payload: {
          boutiqueId: boutiqueId,
          views: response.data.views
        }
      });
    }
    
    return response.data;
  } catch (err) {
    console.error('❌ Error adding view:', err.response?.data || err.message);
  }
};
export const updateBoutiqueHeaderImages = ({ boutiqueId, images, auth }) => async (dispatch) => {
  try {
    console.log('🟡 updateBoutiqueHeaderImages action iniciada');
    console.log('📦 boutiqueId:', boutiqueId);
    console.log('📦 images count:', images?.length || 0);
    console.log('📦 images[0]:', images[0]); // Ver qué tipo de datos llega
    
    if (!images || images.length === 0) {
      console.warn('⚠️ No hay imágenes para subir');
      return { success: false, error: 'No images to upload' };
    }

    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    let headerImages = [];

    // ✅ PASO 1: Subir imágenes a Cloudinary
    console.log(`📤 Subiendo ${images.length} imágenes a Cloudinary...`);
    
    // ✅ IMPORTANTE: Pasar las imágenes directamente a imageUpload
    // imageUpload espera el formato: [{ url, isExisting, name, file }, ...]
    const uploadedImages = await imageUpload(images);
    console.log('✅ Imágenes subidas desde Cloudinary:', uploadedImages);
    
    if (uploadedImages.length === 0) {
      throw new Error('No se pudieron subir las imágenes a Cloudinary');
    }
    
    // Formatear para el backend
    headerImages = uploadedImages.map(img => ({
      url: img.url,
      public_id: img.public_id,
      alt: `Header image ${Date.now()}`
    }));

    console.log('📦 Enviando al backend:', { 
      header_images: headerImages,
      boutiqueId 
    });

    // ✅ PASO 2: Enviar al backend con el nombre correcto "header_images"
    const res = await patchDataAPI(
      `boutique/${boutiqueId}/headerimages`,
      { header_images: headerImages },
      auth.token
    );

    console.log('✅ Respuesta del backend:', res.data);

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: '✅ Images téléchargées' }
    });

    // Actualizar el estado de Redux
    dispatch({
      type: 'UPDATE_BOUTIQUE_HEADER_IMAGES',
      payload: {
        boutiqueId,
        header_images: res.data.header_images || headerImages
      }
    });

    return { success: true, header_images: res.data.header_images || headerImages };

  } catch (err) {
    console.error('❌ Error en updateBoutiqueHeaderImages:', err);
    console.error('❌ Response:', err.response?.data);
    console.error('❌ Status:', err.response?.status);
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    
    return { success: false, error: err.message };
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};
// ============ ELIMINAR IMAGEN DE HEADER ============
export const deleteBoutiqueHeaderImage = ({ 
  boutiqueId, 
  imageId, 
  auth 
}) => async (dispatch) => {
  try {
    console.log('🗑️ Eliminando imagen de header:', { boutiqueId, imageId });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    const res = await deleteDataAPI(
      `boutique/${boutiqueId}/headerimages/${imageId}`, 
      auth.token
    );

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: '✅ Image supprimée avec succès' }
    });

    // Actualizar el estado
    dispatch({
      type: BOUTIQUE_TYPES.UPDATE_BOUTIQUE_HEADER_IMAGES,
      payload: {
        boutiqueId,
        header_images: res.data.header_images
      }
    });

    return { success: true };

  } catch (err) {
    console.error('❌ Error en deleteBoutiqueHeaderImage:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// Cambiar de postDataAPI a patchDataAPI
export const followBoutique = (boutiqueId, auth) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    // Cambiar postDataAPI por patchDataAPI
    const res = await patchDataAPI(`boutique/${boutiqueId}/follow`, {}, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.FOLLOW_BOUTIQUE,
      payload: {
        boutiqueId,
        following: res.data.following,
        followersCount: res.data.followersCount
      }
    });
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// ============ CHECK IF USER FOLLOWS BOUTIQUE ============
export const checkFollowBoutique = (boutiqueId, auth) => async (dispatch) => {
  try {
    const res = await getDataAPI(`boutique/${boutiqueId}/follow/check`, auth.token);
    return res.data;
  } catch (err) {
    console.error('Error checking follow:', err);
    return { following: false };
  }
};

// ============ LIKE BOUTIQUE ============
 
// ============ GET BOUTIQUE LIKES ============
 

// ============ GET BOUTIQUE FOLLOWERS ============
export const getBoutiqueFollowers = (boutiqueId, auth = null) => async (dispatch) => {
  try {
    const res = await getDataAPI(`boutique/${boutiqueId}/followers`, auth?.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_BOUTIQUE_FOLLOWERS,
      payload: {
        boutiqueId,
        followersCount: res.data.followersCount,
        userFollowing: res.data.userFollowing
      }
    });
    
    return res.data;
  } catch (err) {
    console.error('Error getting followers:', err);
    return { followersCount: 0, userFollowing: false };
  }
};

// ============ LIKE BOUTIQUE ============
export const likeBoutique = (boutiqueId, auth) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    const res = await patchDataAPI(`boutique/${boutiqueId}/like`, {}, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.LIKE_BOUTIQUE,
      payload: {
        boutiqueId,
        liked: res.data.liked,
        likesCount: res.data.likesCount
      }
    });
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// ============ GET BOUTIQUE LIKES ============
export const getBoutiqueLikes = (boutiqueId, auth = null) => async (dispatch) => {
  try {
    const res = await getDataAPI(`boutique/${boutiqueId}/likes`, auth?.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_BOUTIQUE_LIKES,
      payload: {
        boutiqueId,
        likesCount: res.data.likesCount,
        userLiked: res.data.userLiked
      }
    });
    
    return res.data;
  } catch (err) {
    console.error('Error getting likes:', err);
    return { likesCount: 0, userLiked: false };
  }
};