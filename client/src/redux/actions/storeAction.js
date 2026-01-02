import { GLOBALTYPES } from './globalTypes'
import { postDataAPI, getDataAPI, patchDataAPI, deleteDataAPI } from '../../utils/fetchData'

export const STORE_TYPES = {
  CREATE_STORE: 'CREATE_STORE',
  GET_STORES: 'GET_STORES',
  GET_STORE: 'GET_STORE',
  UPDATE_STORE: 'UPDATE_STORE',
  DELETE_STORE: 'DELETE_STORE',
  LOADING_STORE: 'LOADING_STORE'
}

// Crear tienda
export const createStore = ({ storeData, auth }) => async dispatch => {
  try {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { loading: true } })
    const res = await postDataAPI('stores', storeData, auth.token)

    dispatch({ type: STORE_TYPES.CREATE_STORE, payload: res.data.newStore })
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
  } catch (err) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } })
  }
}

// Obtener tiendas del usuario
export const getStores = (token) => async dispatch => {
  try {
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: true })
    const res = await getDataAPI('stores', token)

    dispatch({ type: STORE_TYPES.GET_STORES, payload: res.data.stores })
    dispatch({ type: STORE_TYPES.LOADING_STORE, payload: false })
  } catch (err) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } })
  }
}

// Obtener tienda individual
export const getStore = (id) => async (dispatch) => {
  try {
    const res = await getDataAPI(`store/${id}`) // sin token
    dispatch({ type: STORE_TYPES.GET_STORE, payload: res.data.store })
  } catch (err) {
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { error: err.response?.data?.msg || 'Store not found' } 
    })
  }
}
// Actualizar tienda
export const updateStore = ({ storeData, auth, id }) => async dispatch => {
  try {
    const res = await patchDataAPI(`store/${id}`, storeData, auth.token)
    dispatch({ type: STORE_TYPES.UPDATE_STORE, payload: res.data.newStore })
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: res.data.msg } })
  } catch (err) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } })
  }
}

// Eliminar tienda
export const deleteStore = ({ id, auth }) => async dispatch => {
  try {
    dispatch({ type: STORE_TYPES.DELETE_STORE, payload: id })
    await deleteDataAPI(`store/${id}`, auth.token)
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: 'Store deleted!' } })
  } catch (err) {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: err.response.data.msg } })
  }
}
