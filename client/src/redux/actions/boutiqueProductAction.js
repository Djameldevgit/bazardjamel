// redux/actions/boutiqueProductAction.js

import { GLOBALTYPES } from './globalTypes';
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData';
import { imageUpload } from '../../utils/imageUpload';

export const BOUTIQUE_PRODUCT_TYPES = {
  DELETE_BOUTIQUE_PRODUCT: 'DELETE_BOUTIQUE_PRODUCT',
  UPDATE_BOUTIQUE_PRODUCT: 'UPDATE_BOUTIQUE_PRODUCT',
  GET_BOUTIQUE_PRODUCTS: 'GET_BOUTIQUE_PRODUCTS',
  ADD_BOUTIQUE_PRODUCT: 'ADD_BOUTIQUE_PRODUCT',
  REMOVE_BOUTIQUE_PRODUCT: 'REMOVE_BOUTIQUE_PRODUCT',
  UPDATE_BOUTIQUE_STATUS: 'UPDATE_BOUTIQUE_STATUS',
  GET_BOUTIQUE_STATS: 'GET_BOUTIQUE_STATS',
  LOADING_BOUTIQUE_PRODUCTS: 'LOADING_BOUTIQUE_PRODUCTS',
  RESET_BOUTIQUE_PRODUCTS: 'RESET_BOUTIQUE_PRODUCTS'
};

// ============ CREATE BOUTIQUE PRODUCT ============
// redux/actions/boutiqueProductAction.js

// redux/actions/boutiqueProductAction.js

// redux/actions/boutiqueProductAction.js

export const createBoutiqueProduct = ({ 
  boutiqueId, 
  productData, 
  images, 
  auth 
}) => async (dispatch) => {
  try {
    console.log('📝 createBoutiqueProduct iniciado', { 
      boutiqueId,
      hasAuth: !!auth,
      hasToken: !!auth?.token,
      tokenLength: auth?.token?.length,
      userId: auth?.user?._id
    });
    
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    if (!auth || !auth.token) {
      console.error('❌ No hay token de autenticación');
      throw new Error('Veuillez vous reconnecter');
    }

    // Subir imágenes
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

    const productToSend = {
      ...productData,
      images: finalImages,
      categorySpecificData: productData.categorySpecificData || {}
    };

    console.log('📤 Enviando petición POST con token:', auth.token.substring(0, 20) + '...');
    
    const res = await postDataAPI(`boutique/${boutiqueId}/products`, productToSend, auth.token);
    
    console.log('✅ Respuesta:', res.data);
    
    dispatch({ 
      type: BOUTIQUE_PRODUCT_TYPES.ADD_BOUTIQUE_PRODUCT,
      payload: {
        boutiqueId,
        product: res.data.product
      }
    });

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: '✅ Produit ajouté à la boutique avec succès!' }
    });

    return res.data;

  } catch (err) {
    console.error('❌ Error en createBoutiqueProduct:', err);
    console.error('❌ Status:', err.response?.status);
    console.error('❌ Detalles:', err.response?.data);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};
// ============ GET BOUTIQUE PRODUCTS ============
export const getBoutiqueProducts = (boutiqueId, filters = {}, reset = false) => async (dispatch, getState) => {
  try {
    const currentPage = reset ? 1 : (getState().boutiqueProduct.products[boutiqueId]?.page || 1);
    const page = reset ? 1 : (filters.page || currentPage);
    
    console.log('📦 getBoutiqueProducts:', { boutiqueId, filters, page, reset });
    
    dispatch({ 
      type: BOUTIQUE_PRODUCT_TYPES.LOADING_BOUTIQUE_PRODUCTS, 
      payload: true 
    });

    // Construir query string
    const params = new URLSearchParams();
    params.append('page', page);
    params.append('limit', filters.limit || 12);
    if (filters.sort) params.append('sort', filters.sort);
    if (filters.search) params.append('search', filters.search);
    if (filters.categories?.length) params.append('categories', filters.categories.join(','));
    if (filters.subCategories?.length) params.append('subCategories', filters.subCategories.join(','));
    if (filters.articleType && filters.articleType !== 'all') params.append('articleType', filters.articleType);
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.etat?.length) params.append('etat', filters.etat.join(','));
    if (filters.wilaya) params.append('wilaya', filters.wilaya);
    if (filters.dynamicFilters) params.append('dynamicFilters', JSON.stringify(filters.dynamicFilters));

    const res = await getDataAPI(`boutique/${boutiqueId}/products?${params.toString()}`);
    console.log(res.data)
    dispatch({
      type: BOUTIQUE_PRODUCT_TYPES.GET_BOUTIQUE_PRODUCTS,
      payload: {
        boutiqueId,
        products: res.data.products || [],
        total: res.data.total || 0,
        page: res.data.page || page,
        totalPages: res.data.totalPages || 1,
        hasMore: res.data.hasMore || false,
        reset: reset,
        availableFields: res.data.availableFields || [],
        fieldValues: res.data.fieldValues || {}
      }
    });
    
    return res.data;
    
  } catch (err) {
    console.error('❌ Error en getBoutiqueProducts:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  } finally {
    dispatch({ 
      type: BOUTIQUE_PRODUCT_TYPES.LOADING_BOUTIQUE_PRODUCTS, 
      payload: false 
    });
  }
};

// ============ UPDATE BOUTIQUE PRODUCT ============
export const updateBoutiqueProduct = ({ 
  boutiqueId, 
  productId, 
  productData, 
  images, 
  auth 
}) => async (dispatch) => {
  try {
    console.log('📝 updateBoutiqueProduct iniciado', { boutiqueId, productId });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    let finalImages = [];
    if (images && images.length > 0) {
      const newImages = images.filter(img => !img.isExisting && img.url?.startsWith('blob:'));
      const existingImages = images.filter(img => img.isExisting);

      if (newImages.length > 0) {
        const uploaded = await imageUpload(newImages);
        finalImages = [...existingImages, ...uploaded];
      } else {
        finalImages = existingImages;
      }
    }

    const productToSend = {
      ...productData,
      images: finalImages.length > 0 ? finalImages : productData.images
    };

    const res = await patchDataAPI(`boutique/${boutiqueId}/products/${productId}`, productToSend, auth.token);

    dispatch({ 
      type: BOUTIQUE_PRODUCT_TYPES.UPDATE_BOUTIQUE_PRODUCT,
      payload: {
        boutiqueId,
        product: res.data.product
      }
    });

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: '✅ Produit mis à jour avec succès!' }
    });

    return res.data;

  } catch (err) {
    console.error('❌ Error en updateBoutiqueProduct:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// ============ DELETE BOUTIQUE PRODUCT ============
export const deleteBoutiqueProduct = ({ 
  boutiqueId, 
  productId, 
  auth 
}) => async (dispatch) => {
  try {
    console.log('🗑️ deleteBoutiqueProduct iniciado', { boutiqueId, productId });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    await deleteDataAPI(`boutique/${boutiqueId}/products/${productId}`, auth.token);

    dispatch({ 
      type: BOUTIQUE_PRODUCT_TYPES.DELETE_BOUTIQUE_PRODUCT,
      payload: {
        boutiqueId,
        productId
      }
    });

    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: '✅ Produit supprimé avec succès!' }
    });

  } catch (err) {
    console.error('❌ Error en deleteBoutiqueProduct:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// ============ RESET BOUTIQUE PRODUCTS ============
export const resetBoutiqueProducts = (boutiqueId) => (dispatch) => {
  dispatch({
    type: BOUTIQUE_PRODUCT_TYPES.RESET_BOUTIQUE_PRODUCTS,
    payload: { boutiqueId }
  });
};