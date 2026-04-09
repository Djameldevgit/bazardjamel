// redux/actions/boutiqueProductAction.js - VERSIÓN ACTUALIZADA CON NUEVAS RUTAS

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
  RESET_BOUTIQUE_PRODUCTS: 'RESET_BOUTIQUE_PRODUCTS',
  GET_USER_PRODUCTS: 'GET_USER_PRODUCTS' , // 🔥 NUEVO

  GET_BOUTIQUE_PRODUCT_DETAIL: 'GET_BOUTIQUE_PRODUCT_DETAIL', // 🔥 NUEVO
  CLEAR_BOUTIQUE_PRODUCT_DETAIL: 'CLEAR_BOUTIQUE_PRODUCT_DETAIL', // 🔥 NUEVO
  GET_SAME_BOUTIQUE_PRODUCTS: 'GET_SAME_BOUTIQUE_PRODUCTS',
  GET_SIMILAR_PRODUCTS: 'GET_SIMILAR_PRODUCTS'

};

// ============ CREATE BOUTIQUE PRODUCT ============
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
      userId: auth?.user?._id
    });
    
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });

    if (!auth || !auth.token) {
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

    console.log('📤 Enviando petición POST...');
    
    // 🔥 RUTA ACTUALIZADA
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
    if (filters.minPrice) params.append('minPrice', filters.minPrice);
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
    if (filters.etat) params.append('etat', filters.etat);
    if (filters.wilaya) params.append('wilaya', filters.wilaya);

    // 🔥 RUTA ACTUALIZADA
    const res = await getDataAPI(`boutique/${boutiqueId}/products?${params.toString()}`);
    
    dispatch({
      type: BOUTIQUE_PRODUCT_TYPES.GET_BOUTIQUE_PRODUCTS,
      payload: {
        boutiqueId,
        products: res.data.products || [],
        total: res.data.total || 0,
        page: res.data.page || page,
        totalPages: res.data.totalPages || 1,
        hasMore: res.data.hasMore || false,
        reset: reset
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

// ============ GET USER PRODUCTS (para MesProductsBoutiques) ============
export const getUserProducts = (auth) => async (dispatch) => {
  try {
    console.log('📦 getUserProducts iniciado');
    
    dispatch({ type: BOUTIQUE_PRODUCT_TYPES.LOADING_BOUTIQUE_PRODUCTS, payload: true });

    if (!auth || !auth.token) {
      throw new Error('Veuillez vous reconnecter');
    }

    // 🔥 NUEVA RUTA: /api/user/products
    const res = await getDataAPI('user/products', auth.token);
    
    console.log('✅ getUserProducts respuesta:', res.data);
    
    dispatch({
      type: BOUTIQUE_PRODUCT_TYPES.GET_USER_PRODUCTS,
      payload: {
        products: res.data.products || [],
        total: res.data.total || 0
      }
    });
    
    return res.data;
    
  } catch (err) {
    console.error('❌ Error en getUserProducts:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_PRODUCT_TYPES.LOADING_BOUTIQUE_PRODUCTS, payload: false });
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

    // 🔥 RUTA ACTUALIZADA
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

    // 🔥 RUTA ACTUALIZADA
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
// 📂 redux/actions/boutiqueProductAction.js - CORREGIR

export const getBoutiqueProductById = (productId) => async (dispatch) => {
  try {
    console.log('📦 getBoutiqueProductById para ID:', productId);
    
    dispatch({ type: BOUTIQUE_PRODUCT_TYPES.LOADING_BOUTIQUE_PRODUCTS, payload: true });

    const res = await getDataAPI(`product/${productId}`);
    
    console.log('✅ Producto recibido:', res.data);
    console.log('📦 Imágenes del producto:', res.data.product?.images);
    
    // 🔥 NORMALIZAR LAS IMÁGENES ANTES DE GUARDAR EN EL REDUCER
    const normalizedProduct = {
      ...res.data.product,
      images: normalizeImages(res.data.product?.images)
    };
    
    console.log('📦 Imágenes normalizadas:', normalizedProduct.images);
    
    dispatch({
      type: BOUTIQUE_PRODUCT_TYPES.GET_BOUTIQUE_PRODUCT_DETAIL,
      payload: normalizedProduct
    });
    
    return res.data;
    
  } catch (err) {
    console.error('❌ Error en getBoutiqueProductById:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    throw err;
  } finally {
    dispatch({ type: BOUTIQUE_PRODUCT_TYPES.LOADING_BOUTIQUE_PRODUCTS, payload: false });
  }
};

// 🔥 FUNCIÓN AUXILIAR PARA NORMALIZAR IMÁGENES
const normalizeImages = (images) => {
  if (!images || !Array.isArray(images)) return [];
  
  return images.map(img => {
    // Si es string, devolver string
    if (typeof img === 'string') return img;
    
    // Si es objeto con url, devolver url
    if (typeof img === 'object' && img.url) return img.url;
    
    // Si es objeto con otra estructura, intentar encontrar la URL
    if (typeof img === 'object') {
      return img.image || img.src || img.secure_url || null;
    }
    
    return null;
  }).filter(url => url);
};
// ============ CLEAR PRODUCT DETAIL ============
export const clearBoutiqueProductDetail = () => (dispatch) => {
  dispatch({ type: BOUTIQUE_PRODUCT_TYPES.CLEAR_BOUTIQUE_PRODUCT_DETAIL });
};
// ============ RESET BOUTIQUE PRODUCTS ============
export const resetBoutiqueProducts = (boutiqueId) => (dispatch) => {
  dispatch({
    type: BOUTIQUE_PRODUCT_TYPES.RESET_BOUTIQUE_PRODUCTS,
    payload: { boutiqueId }
  });
};

 
// ============ GET PRODUCTS FROM SAME BOUTIQUE ============
// En boutiqueProductAction.js - Agregar normalización a todas las funciones que traen productos

 

// Similar para getProductsFromSameBoutique
export const getProductsFromSameBoutique = (productId, limit = 6) => async (dispatch) => {
  try {
    console.log('📦 getProductsFromSameBoutique para:', productId);
    
    const res = await getDataAPI(`product/${productId}/same-boutique?limit=${limit}`);
    
    // 🔥 NORMALIZAR LAS IMÁGENES
    const normalizedProducts = (res.data.products || []).map(product => ({
      ...product,
      images: normalizeImages(product.images)
    }));
    
    dispatch({
      type: BOUTIQUE_PRODUCT_TYPES.GET_SAME_BOUTIQUE_PRODUCTS,
      payload: normalizedProducts
    });
    
    return { ...res.data, products: normalizedProducts };
    
  } catch (err) {
    console.error('❌ Error en getProductsFromSameBoutique:', err);
    return { products: [] };
  }
};

// Similar para getSimilarProducts
export const getSimilarProducts = (productId, limit = 6) => async (dispatch) => {
  try {
    console.log('📦 getSimilarProducts para:', productId);
    
    const res = await getDataAPI(`product/${productId}/similar?limit=${limit}`);
    
    // 🔥 NORMALIZAR LAS IMÁGENES
    const normalizedProducts = (res.data.products || []).map(product => ({
      ...product,
      images: normalizeImages(product.images)
    }));
    
    dispatch({
      type: BOUTIQUE_PRODUCT_TYPES.GET_SIMILAR_PRODUCTS,
      payload: normalizedProducts
    });
    
    return { ...res.data, products: normalizedProducts };
    
  } catch (err) {
    console.error('❌ Error en getSimilarProducts:', err);
    return { products: [] };
  }
};
// ============ GET SIMILAR PRODUCTS ============
 