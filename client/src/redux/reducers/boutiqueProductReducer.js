// redux/reducers/boutiqueProductReducer.js

import { BOUTIQUE_PRODUCT_TYPES } from "../actions/boutiqueProductAction";
import { GLOBALTYPES } from "../actions/globalTypes";

// Estado inicial
const getInitialBoutiqueState = () => ({
  products: [],
  total: 0,
  page: 1,
  totalPages: 1,
  hasMore: true,
  loading: false,
  error: null,
  filters: {},
  availableFields: [],
  fieldValues: {}
});

const initialState = {
  products: {},
  feed: {
    products: [],
    page: 1,
    total: 0,
    totalPages: 1,
    hasMore: true,
    loading: false,
    error: null
  },
  loading: false,
  loadingFeed: false,
  loadingProducts: false,
  error: null,
  stats: {},
  lastCreatedProduct: null,
  lastFilters: {}
};

// 🔥 LOG al cargar el reducer
console.log('✅ [REDUCER] boutiqueProductReducer INITIALIZED');

const boutiqueProductReducer = (state = initialState, action) => {
  // 🔥 LOG para verificar cada acción
  console.log('🔄 [REDUCER] boutiqueProductReducer - Action:', action.type);
  
  switch (action.type) {
    
    case BOUTIQUE_PRODUCT_TYPES.LOADING_BOUTIQUE_PRODUCTS:
      console.log('📦 [REDUCER] LOADING_BOUTIQUE_PRODUCTS:', action.payload);
      return {
        ...state,
        loadingProducts: action.payload
      };

    case BOUTIQUE_PRODUCT_TYPES.GET_BOUTIQUE_PRODUCTS: {
      const { 
        boutiqueId, 
        products = [], 
        total, 
        page, 
        totalPages, 
        hasMore, 
        reset = false,
        filters = null,
        availableFields = [],
        fieldValues = {}
      } = action.payload;
      
      console.log('📦 [REDUCER] GET_BOUTIQUE_PRODUCTS:', {
        boutiqueId,
        productsCount: products.length,
        total,
        page,
        reset
      });
      
      if (!boutiqueId) {
        console.warn('⚠️ [REDUCER] boutiqueId missing');
        return state;
      }
      
      const existing = state.products[boutiqueId] || getInitialBoutiqueState();
      const existingProducts = existing.products || [];
      
      const shouldReset = reset || page === 1;
      let newProducts;
      if (shouldReset) {
        newProducts = [...products];
      } else {
        newProducts = [...existingProducts, ...products];
      }
      
      const newState = {
        ...state,
        products: {
          ...state.products,
          [boutiqueId]: {
            products: newProducts,
            total: total || 0,
            page: page || 1,
            totalPages: totalPages || 1,
            hasMore: hasMore !== undefined ? hasMore : (page < totalPages),
            loading: false,
            error: null,
            filters: filters || existing.filters || {},
            availableFields: availableFields,
            fieldValues: fieldValues
          }
        },
        lastFilters: {
          ...state.lastFilters,
          [boutiqueId]: filters || state.lastFilters[boutiqueId] || {}
        },
        error: null
      };
      
      console.log('✅ [REDUCER] Estado actualizado para boutique:', boutiqueId, {
        productsCount: newState.products[boutiqueId].products.length,
        total: newState.products[boutiqueId].total
      });
      
      return newState;
    }

    case BOUTIQUE_PRODUCT_TYPES.ADD_BOUTIQUE_PRODUCT: {
      const product = action.payload.product || action.payload;
      const boutiqueId = action.payload.boutiqueId || product?.boutique;
      
      console.log('📦 [REDUCER] ADD_BOUTIQUE_PRODUCT:', {
        boutiqueId,
        productId: product?._id,
        productTitle: product?.title
      });
      
      if (!boutiqueId || !product) return state;
      
      const currentProducts = state.products[boutiqueId] || getInitialBoutiqueState();
      const currentProductsList = currentProducts.products || [];
      
      const exists = currentProductsList.some(p => p._id === product._id);
      if (exists) return state;
      
      const newProducts = [product, ...currentProductsList];
      const newTotal = (currentProducts.total || 0) + 1;
      
      return {
        ...state,
        products: {
          ...state.products,
          [boutiqueId]: {
            ...currentProducts,
            products: newProducts,
            total: newTotal,
            hasMore: true
          }
        },
        feed: {
          ...state.feed,
          products: [product, ...state.feed.products],
          total: (state.feed.total || 0) + 1
        },
        lastCreatedProduct: product
      };
    }

    case BOUTIQUE_PRODUCT_TYPES.RESET_BOUTIQUE_PRODUCTS: {
      const { boutiqueId } = action.payload;
      console.log('🔄 [REDUCER] RESET_BOUTIQUE_PRODUCTS:', { boutiqueId });
      if (!boutiqueId) return state;
      
      return {
        ...state,
        products: {
          ...state.products,
          [boutiqueId]: getInitialBoutiqueState()
        }
      };
    }

    default:
      return state;
  }
};

export default boutiqueProductReducer;