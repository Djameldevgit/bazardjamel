import { BOUTIQUE_POST_TYPES } from '../actions/boutiquePostAction';

const initialState = {
  products: {}, // Aquí se guardarán los posts por boutiqueId (USAR SOLO ESTE)
  loadingProducts: false,
  error: null
};

const boutiquePostReducer = (state = initialState, action) => {
  switch (action.type) {
    // ============ LOADING STATES ============
    case BOUTIQUE_POST_TYPES.LOADING_BOUTIQUE_PRODUCTS:
      return {
        ...state,
        loadingProducts: action.payload
      };
    
    // ============ UPDATE BOUTIQUE PRODUCT ============
    case BOUTIQUE_POST_TYPES.UPDATE_BOUTIQUE_PRODUCT:
      const boutiqueData = state.products[action.payload.boutiqueId];
      
      return {
        ...state,
        products: {
          ...state.products,
          [action.payload.boutiqueId]: {
            ...boutiqueData,
            products: boutiqueData?.products.map(p =>
              p._id === action.payload.post._id ? action.payload.post : p
            ) || []
          }
        }
      };

    // ============ DELETE BOUTIQUE PRODUCT ============
    case BOUTIQUE_POST_TYPES.DELETE_BOUTIQUE_PRODUCT:
      const boutiqueId = action.payload.boutiqueId;
      const postId = action.payload.postId;
      const boutiqueProductsData = state.products[boutiqueId];
      const currentProducts = boutiqueProductsData?.products || [];
      const currentTotal = boutiqueProductsData?.total || 0;
      
      const filteredProducts = currentProducts.filter(p => p._id !== postId);
      const newTotal = Math.max(0, currentTotal - 1);
      
      console.log('🗑️ DELETE_BOUTIQUE_PRODUCT - Post Reducer:', {
        boutiqueId,
        postId,
        oldTotal: currentTotal,
        newTotal,
        oldProductsCount: currentProducts.length,
        newProductsCount: filteredProducts.length
      });

      return {
        ...state,
        products: {
          ...state.products,
          [boutiqueId]: {
            ...boutiqueProductsData,
            products: filteredProducts,
            total: newTotal,
            hasMore: boutiqueProductsData?.hasMore || false,
            page: boutiqueProductsData?.page || 1,
            totalPages: boutiqueProductsData?.totalPages || 1
          }
        }
      };

    // ============ GET BOUTIQUE PRODUCTS ============
    case BOUTIQUE_POST_TYPES.GET_BOUTIQUE_PRODUCTS:
      return {
        ...state,
        products: {
          ...state.products,
          [action.payload.boutiqueId]: {
            products: action.payload.products,
            total: action.payload.total,
            page: action.payload.page,
            totalPages: action.payload.totalPages,
            hasMore: action.payload.hasMore
          }
        },
        loadingProducts: false
      };
      
    // ============ ADD BOUTIQUE PRODUCT ============
    case BOUTIQUE_POST_TYPES.ADD_BOUTIQUE_PRODUCT:
      const { boutiqueId: addBoutiqueId, product } = action.payload;
      const addBoutiqueProductsData = state.products[addBoutiqueId];
      
      return {
        ...state,
        products: {
          ...state.products,
          [addBoutiqueId]: {
            ...addBoutiqueProductsData,
            products: addBoutiqueProductsData 
              ? [product, ...addBoutiqueProductsData.products]
              : [product],
            total: addBoutiqueProductsData 
              ? (addBoutiqueProductsData.total || 0) + 1
              : 1
          }
        },
        error: null
      };
      
    case BOUTIQUE_POST_TYPES.REMOVE_BOUTIQUE_PRODUCT:
      const { boutiqueId: removeBoutiqueId, productId } = action.payload;
      const removeBoutiqueProductsData = state.products[removeBoutiqueId];
      
      if (removeBoutiqueProductsData) {
        const filteredProducts = removeBoutiqueProductsData.products.filter(p => p._id !== productId);
        
        return {
          ...state,
          products: {
            ...state.products,
            [removeBoutiqueId]: {
              ...removeBoutiqueProductsData,
              products: filteredProducts,
              total: Math.max(0, (removeBoutiqueProductsData.total || 0) - 1)
            }
          },
          error: null
        };
      }
      return state;
      
    // ============ CLEAR PRODUCTS ============
    case 'CLEAR_BOUTIQUE_PRODUCTS':
      const { boutiqueId: clearBoutiqueId } = action.payload;
      
      return {
        ...state,
        products: {
          ...state.products,
          [clearBoutiqueId]: {
            products: [],
            total: 0,
            page: 1,
            totalPages: 0,
            hasMore: false
          }
        }
      };
    
    // ============ ERROR HANDLING ============
    case 'BOUTIQUE_POST_ERROR':
      return {
        ...state,
        error: action.payload,
        loadingProducts: false
      };
    
    default:
      return state;
  }
};

export default boutiquePostReducer;