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
  
  // 🔥 Para búsqueda por categoría
  GET_BOUTIQUES_BY_CATEGORY: 'GET_BOUTIQUES_BY_CATEGORY',
  GET_BOUTIQUES_FOR_HOME: 'GET_BOUTIQUES_FOR_HOME',
  // User specific
  GET_USER_BOUTIQUES: 'GET_USER_BOUTIQUES',
  GET_BOUTIQUE_BY_DOMAIN: 'GET_BOUTIQUE_BY_DOMAIN',
  
  // Products
  GET_BOUTIQUE_PRODUCTS: 'GET_BOUTIQUE_PRODUCTS',
  ADD_BOUTIQUE_PRODUCT: 'ADD_BOUTIQUE_PRODUCT',
  REMOVE_BOUTIQUE_PRODUCT: 'REMOVE_BOUTIQUE_PRODUCT',
  
  // Status
  UPDATE_BOUTIQUE_STATUS: 'UPDATE_BOUTIQUE_STATUS',
  
  // Stats
  GET_BOUTIQUE_STATS: 'GET_BOUTIQUE_STATS',
  
  // Loading states
  LOADING_BOUTIQUE: 'LOADING_BOUTIQUE',
  LOADING_BOUTIQUE_PRODUCTS: 'LOADING_BOUTIQUE_PRODUCTS',
  LOADING_BOUTIQUES_BY_CATEGORY: 'LOADING_BOUTIQUES_BY_CATEGORY'
};

// ============ 🔥 GET BOUTIQUES BY CATEGORY (PARA EL SLIDER) ============
export const getBoutiquesByCategory = (categorySlug, subSlug = null, page = 1, limit = 12) => async (dispatch) => {
  try {
    // Crear clave única para esta categoría/subcategoría
    const categoryPath = subSlug ? `${categorySlug}/${subSlug}` : categorySlug;
    
    console.log('🔍 Cargando boutiques por categoría:', {
      category: categorySlug,
      sub: subSlug,
      page,
      limit,
      categoryPath
    });

    // Set loading state
    dispatch({ 
      type: BOUTIQUE_TYPES.LOADING_BOUTIQUES_BY_CATEGORY, 
      payload: { category: categoryPath, loading: true }
    });

    // Construir parámetros
    const params = { 
      category: categorySlug, 
      page, 
      limit 
    };
    if (subSlug && subSlug !== 'undefined' && subSlug !== 'null') {
      params.sub = subSlug;
    }

    // Llamar a la API
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
    
    // Usar GLOBALTYPES para errores ya que no tenemos tipo específico
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
// redux/actions/boutiqueAction.js

// ============ GET BOUTIQUES FOR HOME (NUEVA) ============
export const getBoutiquesForHome = (limit = 6) => async (dispatch) => {
  try {
    console.log('🏪 Cargando boutiques para el home con límite:', limit);
    
    // ✅ CORREGIDO: Usar category='boutiques' fijo
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
// ============ RESET BOUTIQUES BY CATEGORY ============
export const resetBoutiquesByCategory = (categoryPath) => ({
  type: 'CLEAR_BOUTIQUES_BY_CATEGORY',  // Usamos string directo para este caso
  payload: { categoryPath }
});

// ============ RESET ALL BOUTIQUES ============
export const resetAllBoutiques = () => ({
  type: 'CLEAR_BOUTIQUES'  // Usamos string directo para este caso
});

// ============ CREATE BOUTIQUE ============
export const createBoutique = ({ 
  boutiqueData, 
  avatar, 
  auth 
}) => async (dispatch) => {
  console.time('⏱️ createBoutique action time');
  let media = [];
  
  try {
    console.log('🟡 createBoutique action iniciada');
    dispatch({ type: GLOBALTYPES.ALERT, payload: {loading: true} });
    
    // Verificar si hay avatar para subir
    if (avatar) {
      console.log(`📤 Subiendo avatar...`);
      console.time('🖼️ Avatar upload time');
      
      const avatarArray = avatar ? [avatar] : [];
      media = await imageUpload(avatarArray);
      
      console.timeEnd('🖼️ Avatar upload time');
      console.log('✅ Avatar subido:', media.length ? media[0] : null);
    }

    // Preparar datos finales para enviar
    const boutiqueToSend = {
      ...boutiqueData,
      avatar: media.length > 0 ? media[0] : null
    };

    console.log('📦 Datos a enviar al API:', {
      nom_boutique: boutiqueToSend.nom_boutique,
      categorie: boutiqueToSend.categorie,
      hasAvatar: !!boutiqueToSend.avatar
    });

    // Enviar al API
    const res = await postDataAPI('boutique', boutiqueToSend, auth.token);
    
    console.log('✅ Respuesta del API:', res.data);

    dispatch({ 
      type: BOUTIQUE_TYPES.CREATE_BOUTIQUE, 
      payload: res.data.boutique || res.data
    });

    dispatch({ type: GLOBALTYPES.ALERT, payload: {
      success: res.data.message || 'Boutique créée avec succès!'
    }});

    return res.data;

  } catch (err) {
    console.error('❌ Error en createBoutique action:', err);
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
export const updateBoutique = (id, boutiqueData, auth) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    let dataToSend = boutiqueData;
    
    if (boutiqueData instanceof FormData) {
      dataToSend = {};
      for (let [key, value] of boutiqueData.entries()) {
        dataToSend[key] = value;
      }
    }
    
    const res = await patchDataAPI(`boutique/${id}`, dataToSend, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.UPDATE_BOUTIQUE,
      payload: res.data.boutique || res.data
    });
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        success: res.data.msg || 'Boutique mise à jour avec succès'
      } 
    });
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || err.message
      }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: false });
  }
};

// ============ GET BOUTIQUES (GENERAL) ============
export const getBoutiques = (query = '', auth = null) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    let endpoint = 'boutique';
    if (query) endpoint += `?${query}`;
    
    const res = await getDataAPI(endpoint, auth?.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_BOUTIQUES,
      payload: {
        boutiques: res.data.boutiques || res.data,
        total: res.data.total || 0,
        page: res.data.page || 1,
        totalPages: res.data.totalPages || 1
      }
    });
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || 'Erreur lors du chargement des boutiques'
      }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: false });
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

// ============ GET BOUTIQUE BY DOMAIN ============
export const getBoutiqueByDomain = (domain) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    const res = await getDataAPI(`boutique/domain/${domain}`);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_BOUTIQUE_BY_DOMAIN,
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

// ============ DELETE BOUTIQUE ============
export const deleteBoutique = (id, auth) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    const res = await deleteDataAPI(`boutique/${id}`, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.DELETE_BOUTIQUE,
      payload: id
    });
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        success: res.data.msg || 'Boutique supprimée avec succès'
      } 
    });
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || err.message
      }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: false });
  }
};

// ============ UPDATE BOUTIQUE STATUS ============
export const updateBoutiqueStatus = (id, statut, auth) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: true });
    
    const res = await patchDataAPI(`boutique/${id}/status`, { statut }, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.UPDATE_BOUTIQUE_STATUS,
      payload: {
        id,
        statut: res.data.boutique?.statut || res.data.statut
      }
    });
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        success: res.data.msg || 'Statut mis à jour'
      } 
    });
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || err.message
      }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE, payload: false });
  }
};

// ============ PRODUCTS MANAGEMENT ============
export const getBoutiqueProducts = (boutiqueId, query = '', auth = null) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE_PRODUCTS, payload: true });
    
    let endpoint = `boutique/${boutiqueId}/products`;
    if (query) endpoint += `?${query}`;
    
    const res = await getDataAPI(endpoint, auth?.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.GET_BOUTIQUE_PRODUCTS,
      payload: {
        boutiqueId,
        products: res.data.produits || res.data.products || [],
        total: res.data.total || 0,
        page: res.data.page || 1,
        totalPages: res.data.totalPages || 1
      }
    });
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || 'Erreur lors du chargement des produits'
      }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE_PRODUCTS, payload: false });
  }
};

export const addBoutiqueProduct = (boutiqueId, productId, auth) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE_PRODUCTS, payload: true });
    
    const res = await postDataAPI(`boutique/${boutiqueId}/products`, { productId }, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.ADD_BOUTIQUE_PRODUCT,
      payload: {
        boutiqueId,
        product: res.data.product || res.data
      }
    });
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        success: res.data.msg || 'Produit ajouté avec succès'
      } 
    });
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || err.message
      }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE_PRODUCTS, payload: false });
  }
};

export const removeBoutiqueProduct = (boutiqueId, productId, auth) => async (dispatch) => {
  try {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE_PRODUCTS, payload: true });
    
    const res = await deleteDataAPI(`boutique/${boutiqueId}/products/${productId}`, auth.token);
    
    dispatch({
      type: BOUTIQUE_TYPES.REMOVE_BOUTIQUE_PRODUCT,
      payload: {
        boutiqueId,
        productId
      }
    });
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        success: res.data.msg || 'Produit retiré avec succès'
      } 
    });
    
    return res.data;
    
  } catch (err) {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: {
        error: err.response?.data?.msg || err.message
      }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_TYPES.LOADING_BOUTIQUE_PRODUCTS, payload: false });
  }
};

// ============ STATISTICS ============
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