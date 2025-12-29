// redux/reducers/storeReducer.js
import { STORE_TYPES } from '../constants/storeConstants'

const initialState = {
  stores: [],
  store: null,
  myStore: null,
  myStats: null,
  storeProducts: {
    products: [],
    pagination: {
      page: 1,
      totalPages: 0,
      total: 0
    }
  },
  loading: false,
  favoriteLoading: false,
  error: null,
  pagination: {
    page: 1,
    totalPages: 0,
    total: 0
  }
}

const storeReducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_TYPES.LOADING_STORE:
      return {
        ...state,
        loading: action.payload
      }

    case STORE_TYPES.GET_STORES:
      return {
        ...state,
        stores: action.payload.stores,
        pagination: {
          page: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          total: action.payload.totalStores
        },
        loading: false,
        error: null
      }

    case STORE_TYPES.GET_STORE:
      return {
        ...state,
        store: action.payload,
        loading: false,
        error: null
      }

    case STORE_TYPES.GET_MY_STORE:
      return {
        ...state,
        myStore: action.payload,
        loading: false,
        error: null
      }

    case STORE_TYPES.GET_MY_STATS:
      return {
        ...state,
        myStats: action.payload,
        loading: false
      }

    case STORE_TYPES.GET_STORE_PRODUCTS:
      return {
        ...state,
        storeProducts: {
          products: action.payload.products,
          pagination: action.payload.pagination
        }
      }

    case STORE_TYPES.CREATE_STORE:
      return {
        ...state,
        stores: [action.payload, ...state.stores],
        store: action.payload,
        myStore: action.payload,
        loading: false,
        error: null
      }

    case STORE_TYPES.UPDATE_STORE:
      return {
        ...state,
        stores: state.stores.map(store =>
          store._id === action.payload._id ? action.payload : store
        ),
        store: state.store && state.store._id === action.payload._id ? action.payload : state.store,
        myStore: state.myStore && state.myStore._id === action.payload._id ? action.payload : state.myStore,
        loading: false,
        error: null
      }

    case STORE_TYPES.TOGGLE_ACTIVE:
      return {
        ...state,
        stores: state.stores.map(store =>
          store._id === action.payload._id ? action.payload : store
        ),
        store: state.store && state.store._id === action.payload._id ? action.payload : state.store,
        myStore: state.myStore && state.myStore._id === action.payload._id ? action.payload : state.myStore
      }

    case STORE_TYPES.CHANGE_PLAN:
      return {
        ...state,
        stores: state.stores.map(store =>
          store._id === action.payload._id ? action.payload : store
        ),
        store: state.store && state.store._id === action.payload._id ? action.payload : state.store,
        myStore: state.myStore && state.myStore._id === action.payload._id ? action.payload : state.myStore
      }

    case STORE_TYPES.DELETE_STORE:
      return {
        ...state,
        stores: state.stores.filter(store => store._id !== action.payload),
        store: state.store && state.store._id === action.payload ? null : state.store,
        myStore: state.myStore && state.myStore._id === action.payload ? null : state.myStore,
        loading: false,
        error: null
      }

    case STORE_TYPES.CONTACT_STORE:
      // No cambia el estado, solo registro
      return {
        ...state,
        loading: false
      }

    case STORE_TYPES.TOGGLE_FAVORITE_STORE:
      return {
        ...state,
        favoriteLoading: false,
        stores: state.stores.map(store =>
          store._id === action.payload.storeId
            ? {
                ...store,
                isFavorite: action.payload.isFavorite,
                favoritesCount: action.payload.isFavorite
                  ? (store.favoritesCount || 0) + 1
                  : Math.max(0, (store.favoritesCount || 0) - 1)
              }
            : store
        ),
        store: state.store && state.store._id === action.payload.storeId
          ? {
              ...state.store,
              isFavorite: action.payload.isFavorite,
              favoritesCount: action.payload.isFavorite
                ? (state.store.favoritesCount || 0) + 1
                : Math.max(0, (state.store.favoritesCount || 0) - 1)
            }
          : state.store
      }

    case STORE_TYPES.ERROR_STORE:
      return {
        ...state,
        loading: false,
        favoriteLoading: false,
        error: action.payload
      }

    case STORE_TYPES.CLEAR_STORE:
      return {
        ...state,
        store: null,
        myStore: null,
        storeProducts: {
          products: [],
          pagination: {
            page: 1,
            totalPages: 0,
            total: 0
          }
        },
        error: null
      }

    default:
      return state
  }
}

export default storeReducer