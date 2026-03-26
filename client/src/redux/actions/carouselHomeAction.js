// frontend/src/redux/actions/carouselAction.js
import { getDataAPI, postDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData';
import { GLOBALTYPES } from './globalTypes';
import { imageUpload } from '../../utils/imageUpload';

// ============ CONSTANTES DE TIPOS ============
export const CAROUSEL_TYPES = {
  GET_CAROUSEL_IMAGES: 'GET_CAROUSEL_IMAGES',
  GET_HOME_CAROUSEL: 'GET_HOME_CAROUSEL',  // ✅ Agregado
  GET_ALL_CAROUSEL_IMAGES: 'GET_ALL_CAROUSEL_IMAGES',
  CREATE_CAROUSEL_IMAGE: 'CREATE_CAROUSEL_IMAGE',
  UPDATE_CAROUSEL_IMAGE: 'UPDATE_CAROUSEL_IMAGE',
  DELETE_CAROUSEL_IMAGE: 'DELETE_CAROUSEL_IMAGE',
  REORDER_CAROUSEL_IMAGES: 'REORDER_CAROUSEL_IMAGES',
  CAROUSEL_LOADING: 'CAROUSEL_LOADING',
  CAROUSEL_ERROR: 'CAROUSEL_ERROR'
};

// ============ OBTENER IMÁGENES ACTIVAS PARA EL HOME (PÚBLICO) ============
export const getCarouselImages = () => async (dispatch) => {
  try {
    dispatch({ type: CAROUSEL_TYPES.CAROUSEL_LOADING, payload: true });
    
    const res = await getDataAPI('carousel');
    
    dispatch({
      type: CAROUSEL_TYPES.GET_CAROUSEL_IMAGES,
      payload: res.data.data
    });
    
    return res.data;
    
  } catch (err) {
    console.error('❌ Error getCarouselImages:', err);
    dispatch({
      type: CAROUSEL_TYPES.CAROUSEL_ERROR,
      payload: err.response?.data?.message || err.message
    });
  } finally {
    dispatch({ type: CAROUSEL_TYPES.CAROUSEL_LOADING, payload: false });
  }
};

// ============ OBTENER TODAS LAS IMÁGENES (ADMIN) ============
export const getAllCarouselImages = (pageType, categoryId) => async (dispatch, getState) => {
  try {
    dispatch({ type: CAROUSEL_TYPES.CAROUSEL_LOADING, payload: true });
    
    const { auth } = getState();
    let url = 'carousel/admin/all';
    const params = [];
    if (pageType) params.push(`pageType=${pageType}`);
    if (categoryId) params.push(`categoryId=${categoryId}`);
    if (params.length) url += `?${params.join('&')}`;
    
    const res = await getDataAPI(url, auth.token);
    
    dispatch({
      type: CAROUSEL_TYPES.GET_ALL_CAROUSEL_IMAGES,
      payload: res.data.data
    });
    
    return res.data;
    
  } catch (err) {
    console.error('❌ Error getAllCarouselImages:', err);
    dispatch({
      type: CAROUSEL_TYPES.CAROUSEL_ERROR,
      payload: err.response?.data?.message || err.message
    });
  } finally {
    dispatch({ type: CAROUSEL_TYPES.CAROUSEL_LOADING, payload: false });
  }
};

// ============ CREAR NUEVA IMAGEN ============
export const createCarouselImage = (formData, auth) => async (dispatch) => {
  try {
    dispatch({ type: CAROUSEL_TYPES.CAROUSEL_LOADING, payload: true });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    // Validaciones
    if (!formData.title) {
      throw new Error('El título es requerido');
    }
    
    if (!formData.imageFile) {
      throw new Error('Debes seleccionar una imagen');
    }
    
    // Subir imagen a Cloudinary
    let imagesToUpload = [];
    
    if (formData.imageFile.isExisting) {
      imagesToUpload = [{
        url: formData.imageFile.url,
        public_id: formData.imageFile.public_id,
        isExisting: true
      }];
    } else {
      imagesToUpload = [{
        file: formData.imageFile.file,
        url: formData.imageFile.url,
        name: formData.imageFile.file?.name || 'image.jpg',
        isExisting: false
      }];
    }
    
    console.log('📤 Subiendo imagen a Cloudinary...');
    const uploadedImages = await imageUpload(imagesToUpload);
    
    if (!uploadedImages || uploadedImages.length === 0) {
      throw new Error('Error al subir la imagen');
    }
    
    const imageData = uploadedImages[0];
    console.log('✅ Imagen subida:', imageData);
    
    // Datos para el backend
    const dataToSend = {
      title: formData.title.trim(),
      description: formData.description?.trim() || '',
      link: formData.link?.trim() || '',
      linkType: formData.linkType || 'none',
      image: imageData
    };
    
    console.log('📦 Enviando al backend:', dataToSend);
    
    const res = await postDataAPI('carousel', dataToSend, auth.token);
    
    dispatch({
      type: CAROUSEL_TYPES.CREATE_CAROUSEL_IMAGE,
      payload: res.data.data
    });
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: '✅ Imagen creada exitosamente' }
    });
    
    return { success: true, data: res.data.data };
    
  } catch (err) {
    console.error('❌ Error createCarouselImage:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    return { success: false, error: err.message };
  } finally {
    dispatch({ type: CAROUSEL_TYPES.CAROUSEL_LOADING, payload: false });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// ============ ACTUALIZAR IMAGEN ============
export const updateCarouselImage = (id, formData, auth) => async (dispatch) => {
  try {
    dispatch({ type: CAROUSEL_TYPES.CAROUSEL_LOADING, payload: true });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    // Preparar datos para actualizar
    const dataToSend = {
      title: formData.title?.trim(),
      description: formData.description?.trim(),
      link: formData.link?.trim(),
      linkType: formData.linkType
    };
    
    // Limpiar campos undefined
    Object.keys(dataToSend).forEach(key => {
      if (dataToSend[key] === undefined) delete dataToSend[key];
    });
    
    // Si hay nueva imagen, subir a Cloudinary
    if (formData.imageFile && !formData.imageFile.isExisting) {
      console.log('📤 Subiendo nueva imagen...');
      const uploaded = await imageUpload([{
        file: formData.imageFile.file,
        url: formData.imageFile.url,
        name: formData.imageFile.file?.name || 'image.jpg',
        isExisting: false
      }]);
      
      if (uploaded.length > 0) {
        dataToSend.image = uploaded[0];
        console.log('✅ Nueva imagen subida:', dataToSend.image);
      }
    }
    
    console.log('📦 Actualizando en backend:', dataToSend);
    
    const res = await patchDataAPI(`carousel/${id}`, dataToSend, auth.token);
    
    dispatch({
      type: CAROUSEL_TYPES.UPDATE_CAROUSEL_IMAGE,
      payload: res.data.data
    });
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: '✅ Imagen actualizada' }
    });
    
    return { success: true, data: res.data.data };
    
  } catch (err) {
    console.error('❌ Error updateCarouselImage:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    return { success: false, error: err.message };
  } finally {
    dispatch({ type: CAROUSEL_TYPES.CAROUSEL_LOADING, payload: false });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// ============ ELIMINAR IMAGEN ============
export const deleteCarouselImage = (id, auth) => async (dispatch) => {
  try {
    dispatch({ type: CAROUSEL_TYPES.CAROUSEL_LOADING, payload: true });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    console.log('🗑️ Eliminando imagen:', id);
    
    await deleteDataAPI(`carousel/${id}`, auth.token);
    
    dispatch({
      type: CAROUSEL_TYPES.DELETE_CAROUSEL_IMAGE,
      payload: id
    });
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: '✅ Imagen eliminada' }
    });
    
    return { success: true };
    
  } catch (err) {
    console.error('❌ Error deleteCarouselImage:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    return { success: false, error: err.message };
  } finally {
    dispatch({ type: CAROUSEL_TYPES.CAROUSEL_LOADING, payload: false });
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// ============ REORDENAR IMÁGENES ============
export const reorderCarouselImages = (images, auth) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } });
    
    const dataToSend = { images };
    await patchDataAPI('carousel/reorder', dataToSend, auth.token);
    
    dispatch({
      type: CAROUSEL_TYPES.REORDER_CAROUSEL_IMAGES,
      payload: images
    });
    
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: '✅ Orden actualizado' }
    });
    
    return { success: true };
    
  } catch (err) {
    console.error('❌ Error reorderCarouselImages:', err);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: err.response?.data?.message || err.message }
    });
    return { success: false, error: err.message };
  } finally {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: false } });
  }
};

// frontend/src/redux/actions/carouselHomeAction.js
// Agrega esta función al final del archivo

// ============ OBTENER CARRUSEL PARA EL HOME ============
export const getHomeCarousel = () => async (dispatch) => {
  try {
    dispatch({ type: CAROUSEL_TYPES.CAROUSEL_LOADING, payload: true });
    
    const res = await getDataAPI('carousel/home');
    
    console.log('📸 [getHomeCarousel] Respuesta:', res.data);
    
    dispatch({
      type: CAROUSEL_TYPES.GET_HOME_CAROUSEL,
      payload: res.data.data
    });
    
    return res.data;
    
  } catch (err) {
    console.error('❌ Error getHomeCarousel:', err);
    dispatch({
      type: CAROUSEL_TYPES.CAROUSEL_ERROR,
      payload: err.response?.data?.message || err.message
    });
  } finally {
    dispatch({ type: CAROUSEL_TYPES.CAROUSEL_LOADING, payload: false });
  }
};