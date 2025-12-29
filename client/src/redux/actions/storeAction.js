// redux/actions/storeActions.js
import { STORE_TYPES } from '../constants/storeConstants'
import { getDataAPI, postDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData'
import { GLOBALTYPES } from './globalTypes'

// Obtener todas las tiendas (para listar como categoría)
export const getStores = (page = 1, limit = 20, filters = {}) => async (dispatch) => {
  try {
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: true })
    
    let url = `/stores?page=${page}&limit=${limit}`
    
    // Agregar filtros a la URL
    if (filters.category) url += `&category=${filters.category}`
    if (filters.city) url += `&city=${filters.city}`
    if (filters.search) url += `&search=${filters.search}`
    if (filters.verified !== undefined) url += `&verified=${filters.verified}`
    
    const res = await getDataAPI(url)
    
    dispatch({
      type: STORE_TYPES.GET_STORES,
      payload: {
        stores: res.stores || res.data?.stores || res,
        currentPage: res.currentPage || page,
        totalPages: res.totalPages || 1,
        totalStores: res.totalStores || res.total || (res.stores ? res.stores.length : res.length)
      }
    })
    
    return res
  } catch (err) {
    dispatch({
      type: STORE_TYPES.ERROR_STORE,
      payload: err.msg || err.response?.data?.msg || err.message || 'Erreur lors du chargement des boutiques'
    })
    throw err
  } finally {
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: false })
  }
}

// Obtener tienda por ID
export const getStoreById = (id) => async (dispatch) => {
  try {
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: true })
    
    const res = await getDataAPI(`${id}`)
    
    dispatch({
      type: STORE_TYPES.GET_STORE,
      payload: res.store || res.data?.store || res
    })
    
    return res
  } catch (err) {
    dispatch({
      type: STORE_TYPES.ERROR_STORE,
      payload: err.msg || err.response?.data?.msg || err.message || 'Erreur lors du chargement de la boutique'
    })
    throw err
  } finally {
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: false })
  }
}

// Obtener productos de una tienda
export const getStoreProducts = (storeId, page = 1, limit = 12) => async (dispatch) => {
  try {
    const res = await getDataAPI(`/products/store/${storeId}?page=${page}&limit=${limit}`)
    
    dispatch({
      type: STORE_TYPES.GET_STORE_PRODUCTS,
      payload: {
        storeId,
        products: res.products || res.data?.products || res,
        pagination: res.pagination || res.data?.pagination || {
          page: 1,
          totalPages: 1,
          total: res.length || 0
        }
      }
    })
    
    return res
  } catch (err) {
    throw err
  }
}

// Crear nueva tienda
// redux/actions/storeAction.js - CORREGIDA
export const createStore = (storeData, token) => async (dispatch) => {
  console.log('🎯 === ACTION createStore ===')
  console.log('📦 Store data:', storeData)
  console.log('🔑 Token:', token ? `✅ (${token.substring(0, 20)}...)` : '❌ No token')
  
  try {
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: true })
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
    
    console.log('📤 Envoi POST à /stores...')
    
    const res = await postDataAPI('/stores', storeData, token)
    
    console.log('✅ Réponse du serveur:', res)
    
    // 🔥 Asegurar que siempre retorne algo estructurado
    const result = {
      success: true,
      store: res.store || res.data?.store || res,
      msg: res.msg || res.data?.msg || 'Boutique créée avec succès!',
      data: res
    }
    
    dispatch({
      type: STORE_TYPES.CREATE_STORE,
      payload: result.store
    })
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        success: result.msg,
        loading: false
      }
    })
    
    console.log('🎉 Action terminée, retour:', result)
    return result
    
  } catch (err) {
    console.error('❌ Erreur dans createStore action:')
    console.error('Error object:', err)
    console.error('Error response:', err.response?.data)
    
    const errorMsg = err.msg || err.response?.data?.msg || err.message || 'Erreur lors de la création de la boutique'
    
    // 🔥 IMPORTANTE: Retornar un objeto de error estructurado
    const errorResult = {
      success: false,
      error: errorMsg,
      code: err.response?.status || 500,
      data: err.response?.data
    }
    
    dispatch({
      type: STORE_TYPES.ERROR_STORE,
      payload: errorMsg
    })
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        error: errorMsg,
        loading: false
      }
    })
    
    console.log('⚠️ Action échouée, retour erreur:', errorResult)
    
    // 🔥 NO hacer throw, retornar el objeto de error
    return errorResult
    
  } finally {
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: false })
  }
}
// Actualizar tienda
export const updateStore = (id, storeData, token) => async (dispatch) => {
  try {
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: true })
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
    
    const res = await patchDataAPI(`/stores/${id}`, storeData, token)
    
    dispatch({
      type: STORE_TYPES.UPDATE_STORE,
      payload: res.store || res.data?.store || res
    })
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        success: res.msg || res.data?.msg || 'Boutique mise à jour avec succès!',
        loading: false
      }
    })
    
    return res
  } catch (err) {
    dispatch({
      type: STORE_TYPES.ERROR_STORE,
      payload: err.msg || err.response?.data?.msg || err.message || 'Erreur lors de la mise à jour de la boutique'
    })
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        error: err.response?.data?.msg || err.message || 'Erreur lors de la mise à jour',
        loading: false
      }
    })
    
    throw err
  } finally {
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: false })
  }
}

// Eliminar tienda
export const deleteStore = (id, token) => async (dispatch) => {
  try {
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: true })
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
    
    const res = await deleteDataAPI(`/stores/${id}`, token)
    
    dispatch({
      type: STORE_TYPES.DELETE_STORE,
      payload: id
    })
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        success: res.msg || res.data?.msg || 'Boutique supprimée avec succès!',
        loading: false
      }
    })
    
    return { success: true }
  } catch (err) {
    dispatch({
      type: STORE_TYPES.ERROR_STORE,
      payload: err.msg || err.response?.data?.msg || err.message || 'Erreur lors de la suppression de la boutique'
    })
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        error: err.response?.data?.msg || err.message || 'Erreur lors de la suppression',
        loading: false
      }
    })
    
    throw err
  } finally {
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: false })
  }
}

// Contactar tienda
export const contactStore = (storeId, message, token) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
    
    const res = await postDataAPI(`/stores/${storeId}/contact`, { message }, token)
    
    dispatch({
      type: STORE_TYPES.CONTACT_STORE,
      payload: { storeId, messageId: res.messageId }
    })
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        success: res.msg || 'Message envoyé avec succès!',
        loading: false
      }
    })
    
    return res
  } catch (err) {
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        error: err.response?.data?.msg || err.message || 'Erreur lors de l\'envoi du message',
        loading: false
      }
    })
    
    throw err
  }
}

// Agregar/Quitar de favoritos
export const toggleFavoriteStore = (storeId, token) => async (dispatch) => {
  try {
    const res = await postDataAPI(`/stores/${storeId}/favorite`, {}, token)
    
    dispatch({
      type: STORE_TYPES.TOGGLE_FAVORITE_STORE,
      payload: { storeId, isFavorite: res.isFavorite }
    })
    
    return res
  } catch (err) {
    throw err
  }
}

// Limpiar estado de tienda
export const clearStore = () => (dispatch) => {
  dispatch({ type: STORE_TYPES.CLEAR_STORE })
}

// Acción para buscar tiendas
export const searchStores = (query, filters = {}) => async (dispatch) => {
  try {
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: true })
    
    let url = `/stores/search?q=${encodeURIComponent(query)}`
    
    // Agregar filtros
    if (filters.category) url += `&category=${filters.category}`
    if (filters.city) url += `&city=${filters.city}`
    if (filters.minRating) url += `&minRating=${filters.minRating}`
    if (filters.verified !== undefined) url += `&verified=${filters.verified}`
    
    const res = await getDataAPI(url)
    
    dispatch({
      type: STORE_TYPES.GET_STORES,
      payload: {
        stores: res.stores || res.data?.stores || res,
        currentPage: 1,
        totalPages: res.totalPages || 1,
        totalStores: res.totalStores || res.total || (res.stores ? res.stores.length : res.length)
      }
    })
    
    return res
  } catch (err) {
    dispatch({
      type: STORE_TYPES.ERROR_STORE,
      payload: err.msg || err.response?.data?.msg || err.message || 'Erreur lors de la recherche'
    })
    throw err
  } finally {
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: false })
  }
}

// Obtener tiendas del usuario
export const getUserStores = (userId, token) => async (dispatch) => {
  try {
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: true })
    
    const res = await getDataAPI(`/stores/user/${userId || 'me'}`, token)
    
    dispatch({
      type: STORE_TYPES.GET_STORES,
      payload: {
        stores: res.stores || res.data?.stores || res,
        currentPage: 1,
        totalPages: 1,
        totalStores: res.totalStores || res.total || (res.stores ? res.stores.length : res.length)
      }
    })
    
    return res
  } catch (err) {
    dispatch({
      type: STORE_TYPES.ERROR_STORE,
      payload: err.msg || err.response?.data?.msg || err.message || 'Erreur lors du chargement de vos boutiques'
    })
    throw err
  } finally {
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: false })
  }
}

// Obtener mi tienda (si soy vendedor)
export const getMyStore = (token) => async (dispatch) => {
  try {
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: true })
    
    const res = await getDataAPI('/stores/my-store', token)
    
    dispatch({
      type: STORE_TYPES.GET_MY_STORE,
      payload: res.store || res.data?.store || res
    })
    
    return res
  } catch (err) {
    dispatch({
      type: STORE_TYPES.ERROR_STORE,
      payload: err.msg || err.response?.data?.msg || err.message || 'Erreur lors du chargement de votre boutique'
    })
    throw err
  } finally {
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: false })
  }
}

// Activar/Desactivar tienda
export const toggleStoreActive = (storeId, token) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
    
    const res = await patchDataAPI(`/stores/toggle-active/${storeId}`, {}, token)
    
    dispatch({
      type: STORE_TYPES.TOGGLE_ACTIVE,
      payload: res.store || res.data?.store || res
    })
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        success: res.msg || res.data?.msg || 'Visibilité actualisée',
        loading: false
      }
    })
    
    return res
  } catch (err) {
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        error: err.response?.data?.msg || err.message || 'Erreur lors du changement de visibilité',
        loading: false
      }
    })
    
    throw err
  }
}

// Cambiar plan
export const changePlan = (storeId, plan, token) => async (dispatch) => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
    
    const res = await patchDataAPI(`/stores/change-plan/${storeId}`, { plan }, token)
    
    dispatch({
      type: STORE_TYPES.CHANGE_PLAN,
      payload: res.store || res.data?.store || res
    })
    
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        success: res.msg || res.data?.msg || 'Plan changé avec succès!',
        loading: false
      }
    })
    
    return res
  } catch (err) {
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { 
        error: err.response?.data?.msg || err.message || 'Erreur lors du changement de plan',
        loading: false
      }
    })
    
    throw err
  }
}

// Obtener estadísticas de mi tienda
export const getMyStats = (token) => async (dispatch) => {
  try {
    const res = await getDataAPI('/stores/my-stats', token)
    
    dispatch({
      type: STORE_TYPES.GET_MY_STATS,
      payload: res.stats || res.data?.stats || res
    })
    
    return res
  } catch (err) {
    throw err
  }
}

// Función wrapper para compatibilidad
export const createStoreLegacy = (storeData, auth) => async (dispatch) => {
  return dispatch(createStore(storeData, auth.token))
}

export const resetStoreCreate = () => (dispatch) => {
  dispatch({
    type: STORE_TYPES.CREATE_STORE,
    payload: null
  })
}