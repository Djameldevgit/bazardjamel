// redux/actions/boutiquePostAction.js
import { GLOBALTYPES } from './globalTypes';
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData';
import { imageUpload } from '../../utils/imageUpload';
export const BOUTIQUE_POST_TYPES = {
 
  DELETE_BOUTIQUE_PRODUCT:'DELETE_BOUTIQUE_PRODUCT',
  UPDATE_BOUTIQUE_PRODUCT:'UPDATE_BOUTIQUE_PRODUCT',
 
  // User specific
 
  // Products
  GET_BOUTIQUE_PRODUCTS: 'GET_BOUTIQUE_PRODUCTS',
  ADD_BOUTIQUE_PRODUCT: 'ADD_BOUTIQUE_PRODUCT',
  REMOVE_BOUTIQUE_PRODUCT: 'REMOVE_BOUTIQUE_PRODUCT',
  
  // Status
  UPDATE_BOUTIQUE_STATUS: 'UPDATE_BOUTIQUE_STATUS',
  
  // Stats
  GET_BOUTIQUE_STATS: 'GET_BOUTIQUE_STATS',
  
  LOADING_BOUTIQUE_PRODUCTS: 'LOADING_BOUTIQUE_PRODUCTS',
 
};
// ============ CREATE BOUTIQUE POST ============
export const createBoutiquePost = ({ 
  boutiqueId, 
  postData, 
  images, 
  auth 
}) => async (dispatch) => {
  try {
    console.log('📝 createBoutiquePost iniciado', { boutiqueId });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    // Subir imágenes si hay nuevas
    let finalImages = [];
    const newImages = images.filter(img => !img.isExisting && img.url?.startsWith('blob:'));
    const existingImages = images.filter(img => img.isExisting);

    if (newImages.length > 0) {
      console.log(`📤 Subiendo ${newImages.length} imagen(es)...`);
      const uploaded = await imageUpload(newImages);
      finalImages = [...existingImages, ...uploaded];
    } else {
      finalImages = existingImages;
    }

    // Preparar datos finales
    const postToSend = {
      ...postData,
      images: finalImages,
      categorySpecificData: postData.categorySpecificData || {}
    };

    const res = await postDataAPI(`boutique/${boutiqueId}/posts`, postToSend, auth.token);

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: '✅ Produit ajouté à la boutique avec succès' }
    });

    // Actualizar la lista de productos de la boutique
    dispatch({
      type: BOUTIQUE_POST_TYPES.ADD_BOUTIQUE_PRODUCT,
      payload: {
        boutiqueId,
        post: res.data.post
      }
    });

    return res.data;

  } catch (err) {
    console.error('❌ Error en createBoutiquePost:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// ============ GET BOUTIQUE POSTS ============
export const getBoutiquePosts = (boutiqueId, page = 1, limit = 12) => async (dispatch) => {
  try {
    console.log('📦 Obteniendo posts de la boutique:', { boutiqueId, page, limit });
    
    dispatch({ type: BOUTIQUE_POST_TYPES.LOADING_BOUTIQUE_PRODUCTS, payload: true });
    
    const params = { page, limit };
    const res = await getDataAPI(`boutique/${boutiqueId}/posts`, null, params);
       
        console.log('✅ Posts recibidos:', res.data);
    
    dispatch({
      type: BOUTIQUE_POST_TYPES.GET_BOUTIQUE_PRODUCTS,
      payload: {
        boutiqueId,
        products: res.data.posts || [],
        total: res.data.total || 0,
        page: res.data.page || page,
        totalPages: res.data.totalPages || 1,
        hasMore: res.data.hasMore || false
      }
    });
    
    return res.data;
    
  } catch (err) {
    console.error('❌ Error en getBoutiquePosts:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_POST_TYPES.LOADING_BOUTIQUE_PRODUCTS, payload: false });
  }
};

// ============ UPDATE BOUTIQUE POST ============
export const updateBoutiquePost = ({ 
  boutiqueId, 
  postId, 
  postData, 
  images, 
  auth 
}) => async (dispatch) => {
  try {
    console.log('📝 updateBoutiquePost iniciado', { boutiqueId, postId });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    // Subir imágenes nuevas si hay
    let finalImages = [];
    if (images && images.length > 0) {
      const newImages = images.filter(img => !img.isExisting && img.url?.startsWith('blob:'));
      const existingImages = images.filter(img => img.isExisting);

      if (newImages.length > 0) {
        console.log(`📤 Subiendo ${newImages.length} imagen(es)...`);
        const uploaded = await imageUpload(newImages);
        finalImages = [...existingImages, ...uploaded];
      } else {
        finalImages = existingImages;
      }
    }

    // Preparar datos finales
    const postToSend = {
      ...postData,
      images: finalImages.length > 0 ? finalImages : postData.images
    };

    const res = await patchDataAPI(`boutique/${boutiqueId}/posts/${postId}`, postToSend, auth.token);

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: '✅ Produit mis à jour avec succès' }
    });

    // Actualizar en el estado de boutiqueProducts
    dispatch({
      type: BOUTIQUE_POST_TYPES.UPDATE_BOUTIQUE_PRODUCT,
      payload: {
        boutiqueId,
        post: res.data.post
      }
    });

    return res.data;

  } catch (err) {
    console.error('❌ Error en updateBoutiquePost:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// ============ DELETE BOUTIQUE POST ============
export const deleteBoutiquePost = ({ 
  boutiqueId, 
  postId, 
  auth 
}) => async (dispatch) => {
  try {
    console.log('🗑️ deleteBoutiquePost iniciado', { boutiqueId, postId });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    const res = await deleteDataAPI(`boutique/${boutiqueId}/posts/${postId}`, auth.token);

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: '✅ Produit supprimé avec succès' }
    });

    // Eliminar del estado
    dispatch({
      type: BOUTIQUE_POST_TYPES.DELETE_BOUTIQUE_PRODUCT,
      payload: {
        boutiqueId,
        postId
      }
    });

    return res.data;

  } catch (err) {
    console.error('❌ Error en deleteBoutiquePost:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};