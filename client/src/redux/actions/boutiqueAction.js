// redux/actions/boutiqueAction.js
import { GLOBALTYPES } from './globalTypes';
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData';
import { imageUpload } from '../../utils/imageUpload';
 
export const BOUTIQUE_TYPES = {
  // Basic CRUD
  CREATE_BOUTIQUE: 'CREATE_BOUTIQUE',
  GET_BOUTIQUES: 'GET_BOUTIQUES',
  GET_BOUTIQUE: 'GET_BOUTIQUE',
  UPDATE_BOUTIQUE: 'UPDATE_BOUTIQUE',
  DELETE_BOUTIQUE: 'DELETE_BOUTIQUE',
 
  GET_BOUTIQUES_BY_CATEGORY: 'GET_BOUTIQUES_BY_CATEGORY',
  GET_BOUTIQUES_FOR_HOME: 'GET_BOUTIQUES_FOR_HOME',
  // User specific
  GET_USER_BOUTIQUES: 'GET_USER_BOUTIQUES',
  GET_BOUTIQUE_BY_DOMAIN: 'GET_BOUTIQUE_BY_DOMAIN',
  
  // Products
  
  
  // Status
  UPDATE_BOUTIQUE_STATUS: 'UPDATE_BOUTIQUE_STATUS',
  
  // Stats
  GET_BOUTIQUE_STATS: 'GET_BOUTIQUE_STATS',
  
  // Loading states
  LOADING_BOUTIQUE: 'LOADING_BOUTIQUE',
 
  LOADING_BOUTIQUES_BY_CATEGORY: 'LOADING_BOUTIQUES_BY_CATEGORY'
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
    console.log('🗑️ deleteBoutique action iniciada', { boutiqueId });
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
export const getBoutiquesByCategory = (categorySlug, subSlug = null, page = 1, limit = 12) => async (dispatch) => {
  try {
    const categoryPath = subSlug ? `${categorySlug}/${subSlug}` : categorySlug;
    
    console.log('🔍 Cargando boutiques por categoría:', {
      category: categorySlug,
      sub: subSlug,
      page,
      limit,
      categoryPath
    });

    dispatch({ 
      type: BOUTIQUE_TYPES.LOADING_BOUTIQUES_BY_CATEGORY, 
      payload: { category: categoryPath, loading: true }
    });

    const params = { 
      category: categorySlug, 
      page, 
      limit 
    };
    if (subSlug && subSlug !== 'undefined' && subSlug !== 'null') {
      params.sub = subSlug;
    }

    const res = await getDataAPI(`boutique/filter?${new URLSearchParams(params)}`);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_BOUTIQUES_BY_CATEGORY,
      payload: {
        categoryPath: categoryPath,
        boutiques: res.data.boutiques || [],
        total: res.data.total || 0,
        page: res.data.page || page,
        totalPages: res.data.totalPages || 1,
        hasMore: res.data.hasMore || false,
        categoryInfo: res.data.categoryInfo || null,
        children: res.data.children || []
      }
    });

    return {
      boutiques: res.data.boutiques || [],
      total: res.data.total || 0,
      hasMore: res.data.hasMore || false,
      categoryInfo: res.data.categoryInfo || null,
      children: res.data.children || []
    };

  } catch (err) {
    console.error('❌ Error en getBoutiquesByCategory:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  } finally {
    const categoryPath = subSlug ? `${categorySlug}/${subSlug}` : categorySlug;
    dispatch({ 
      type: BOUTIQUE_TYPES.LOADING_BOUTIQUES_BY_CATEGORY, 
      payload: { category: categoryPath, loading: false }
    });
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