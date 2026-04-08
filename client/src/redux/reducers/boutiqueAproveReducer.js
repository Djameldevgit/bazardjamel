// redux/reducers/boutiqueAproveReducer.js - VERSIÓN COMPLETA ACTUALIZADA

import { BOUTIQUE_APROVE_TYPES } from "../actions/boutiqueAproveAction";

const initialState = {
  // Boutiques
  boutiques: [],
  total: 0,
  page: 1,
  totalPages: 1,
  hasMore: false,
  
  // Productos (nuevo)
  products: [],
  totalProducts: 0,
  pageProducts: 1,
  totalPagesProducts: 1,
  hasMoreProducts: false,
  
  loading: false,
  error: null
};

const boutiqueAproveReducer = (state = initialState, action) => {
  switch (action.type) {
    case BOUTIQUE_APROVE_TYPES.LOADING:
      return { ...state, loading: action.payload };
    
    // ============ BOUTIQUES ============
    case BOUTIQUE_APROVE_TYPES.GET_PENDIENTES:
      return {
        ...state,
        boutiques: action.payload.boutiques || [],
        total: action.payload.total || 0,
        page: action.payload.page || 1,
        totalPages: action.payload.totalPages || 1,
        hasMore: action.payload.hasMore || false,
        loading: false
      };
    
    case BOUTIQUE_APROVE_TYPES.APROBAR:
      return {
        ...state,
        boutiques: state.boutiques.filter(b => b._id !== action.payload.id),
        total: Math.max(0, state.total - 1)
      };
    
    case BOUTIQUE_APROVE_TYPES.RECHAZAR:
      return {
        ...state,
        boutiques: state.boutiques.filter(b => b._id !== action.payload.id),
        total: Math.max(0, state.total - 1)
      };
    
    // ============ PRODUCTOS ============
    case BOUTIQUE_APROVE_TYPES.GET_PRODUCTS_PENDIENTES:
      return {
        ...state,
        products: action.payload.products || [],
        totalProducts: action.payload.total || 0,
        pageProducts: action.payload.page || 1,
        totalPagesProducts: action.payload.totalPages || 1,
        hasMoreProducts: action.payload.hasMore || false,
        loading: false
      };
    
    case BOUTIQUE_APROVE_TYPES.APROBAR_PRODUCT:
      return {
        ...state,
        products: state.products.filter(p => p._id !== action.payload.id),
        totalProducts: Math.max(0, state.totalProducts - 1)
      };
    
    case BOUTIQUE_APROVE_TYPES.RECHAZAR_PRODUCT:
      return {
        ...state,
        products: state.products.filter(p => p._id !== action.payload.id),
        totalProducts: Math.max(0, state.totalProducts - 1)
      };
    
    case BOUTIQUE_APROVE_TYPES.RESET:
      return initialState;
    
    default:
      return state;
  }
};

export default boutiqueAproveReducer;