import { STORE_TYPES } from '../actions/storeAction'

const initialState = {
  loading: false,
  stores: [],       // listado de todas las tiendas
  details: {}
}

const storeReducer = (state = initialState, action) => {
  switch(action.type){
    case STORE_TYPES.LOADING_STORE:
      return { ...state, loading: action.payload }

    case STORE_TYPES.CREATE_STORE:
      return { ...state, stores: [action.payload, ...state.stores] }

    case STORE_TYPES.GET_STORES:
      return { ...state, stores: action.payload }

    case STORE_TYPES.GET_STORE:
      return { ...state, store: action.payload }

    case STORE_TYPES.UPDATE_STORE:
      return {
        ...state,
        stores: state.stores.map(store => 
          store._id === action.payload._id ? action.payload : store
        )
      }

    case STORE_TYPES.DELETE_STORE:
      return { 
        ...state,
        stores: state.stores.filter(store => store._id !== action.payload)
      }

    default:
      return state
  }
}

export default storeReducer
