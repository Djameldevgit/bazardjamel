// 📂 src/redux/reducers/boutiqueReducer.js
import { BOUTIQUE_TYPES } from '../actions/boutiqueAction';

const initialState = {
  // Main boutique list
  boutiques: [],
  total: 0,
  page: 1,
  totalPages: 0,
  
  // Current boutique details
  currentBoutique: null,
  boutiqueByDomain: null,
  
  // User's boutiques
  userBoutiques: [],
  
  // Boutique products
  boutiqueProducts: {}, // Format: { [boutiqueId]: { products: [], total, page, totalPages } }
  
  // Boutique statistics
  boutiqueStats: {}, // Format: { [boutiqueId]: stats }
  
  // Loading states
  loading: false,
  loadingProducts: false,
  
  // Errors
  error: null
};

const boutiqueReducer = (state = initialState, action) => {
  switch (action.type) {
    // ============ LOADING STATES ============
    case BOUTIQUE_TYPES.LOADING_BOUTIQUE:
      return {
        ...state,
        loading: action.payload
      };
      
    case BOUTIQUE_TYPES.LOADING_BOUTIQUE_PRODUCTS:
      return {
        ...state,
        loadingProducts: action.payload
      };
    
    // ============ CRUD OPERATIONS ============
    case BOUTIQUE_TYPES.CREATE_BOUTIQUE:
      return {
        ...state,
        boutiques: [action.payload.boutique, ...state.boutiques],
        userBoutiques: [action.payload.boutique, ...state.userBoutiques],
        total: state.total + 1
      };
      
    case BOUTIQUE_TYPES.GET_BOUTIQUES:
      return {
        ...state,
        boutiques: action.payload.boutiques,
        total: action.payload.total,
        page: action.payload.page,
        totalPages: action.payload.totalPages,
        error: null
      };
      
    case BOUTIQUE_TYPES.GET_BOUTIQUE:
      return {
        ...state,
        currentBoutique: action.payload,
        error: null
      };
      
    case BOUTIQUE_TYPES.GET_BOUTIQUE_BY_DOMAIN:
      return {
        ...state,
        boutiqueByDomain: action.payload.boutique,
        error: null
      };
      
    case BOUTIQUE_TYPES.GET_USER_BOUTIQUES:
      return {
        ...state,
        userBoutiques: action.payload,
        error: null
      };
      
    case BOUTIQUE_TYPES.UPDATE_BOUTIQUE:
      const updatedBoutique = action.payload;
      
      // Update in boutiques list
      const updatedBoutiques = state.boutiques.map(boutique =>
        boutique._id === updatedBoutique._id ? updatedBoutique : boutique
      );
      
      // Update in user boutiques list
      const updatedUserBoutiques = state.userBoutiques.map(boutique =>
        boutique._id === updatedBoutique._id ? updatedBoutique : boutique
      );
      
      // Update current boutique if it's the same
      const currentBoutique = state.currentBoutique?._id === updatedBoutique._id 
        ? updatedBoutique 
        : state.currentBoutique;
      
      // Update boutique by domain if it's the same
      const boutiqueByDomain = state.boutiqueByDomain?._id === updatedBoutique._id 
        ? updatedBoutique 
        : state.boutiqueByDomain;
      
      return {
        ...state,
        boutiques: updatedBoutiques,
        userBoutiques: updatedUserBoutiques,
        currentBoutique,
        boutiqueByDomain,
        error: null
      };
      
    case BOUTIQUE_TYPES.DELETE_BOUTIQUE:
      const deletedId = action.payload;
      
      return {
        ...state,
        boutiques: state.boutiques.filter(boutique => boutique._id !== deletedId),
        userBoutiques: state.userBoutiques.filter(boutique => boutique._id !== deletedId),
        currentBoutique: state.currentBoutique?._id === deletedId ? null : state.currentBoutique,
        boutiqueByDomain: state.boutiqueByDomain?._id === deletedId ? null : state.boutiqueByDomain,
        total: state.total - 1,
        error: null
      };
      
    // ============ STATUS MANAGEMENT ============
    case BOUTIQUE_TYPES.UPDATE_BOUTIQUE_STATUS:
      const { id, status } = action.payload;
      
      // Update status in all boutique lists
      const updateStatusInList = (list) =>
        list.map(boutique =>
          boutique._id === id ? { ...boutique, status } : boutique
        );
      
      return {
        ...state,
        boutiques: updateStatusInList(state.boutiques),
        userBoutiques: updateStatusInList(state.userBoutiques),
        currentBoutique: state.currentBoutique?._id === id 
          ? { ...state.currentBoutique, status } 
          : state.currentBoutique,
        boutiqueByDomain: state.boutiqueByDomain?._id === id 
          ? { ...state.boutiqueByDomain, status } 
          : state.boutiqueByDomain,
        error: null
      };
      
    // ============ PRODUCTS MANAGEMENT ============
    case BOUTIQUE_TYPES.GET_BOUTIQUE_PRODUCTS:
      const { boutiqueId, products, total, page, totalPages } = action.payload;
      
      return {
        ...state,
        boutiqueProducts: {
          ...state.boutiqueProducts,
          [boutiqueId]: {
            products,
            total,
            page,
            totalPages
          }
        },
        error: null
      };
      
    case BOUTIQUE_TYPES.ADD_BOUTIQUE_PRODUCT:
      const { boutiqueId: addBoutiqueId, product } = action.payload;
      
      // Add product to boutique products list
      const boutiqueProductsData = state.boutiqueProducts[addBoutiqueId];
      if (boutiqueProductsData) {
        return {
          ...state,
          boutiqueProducts: {
            ...state.boutiqueProducts,
            [addBoutiqueId]: {
              ...boutiqueProductsData,
              products: [product, ...boutiqueProductsData.products],
              total: boutiqueProductsData.total + 1
            }
          },
          // Update boutique's product count
          boutiques: state.boutiques.map(b =>
            b._id === addBoutiqueId 
              ? { ...b, produits_count: (b.produits_count || 0) + 1 }
              : b
          ),
          userBoutiques: state.userBoutiques.map(b =>
            b._id === addBoutiqueId 
              ? { ...b, produits_count: (b.produits_count || 0) + 1 }
              : b
          ),
          error: null
        };
      }
      return state;
      
    case BOUTIQUE_TYPES.REMOVE_BOUTIQUE_PRODUCT:
      const { boutiqueId: removeBoutiqueId, productId } = action.payload;
      
      // Remove product from boutique products list
      const boutiqueProductsDataRemove = state.boutiqueProducts[removeBoutiqueId];
      if (boutiqueProductsDataRemove) {
        return {
          ...state,
          boutiqueProducts: {
            ...state.boutiqueProducts,
            [removeBoutiqueId]: {
              ...boutiqueProductsDataRemove,
              products: boutiqueProductsDataRemove.products.filter(p => p._id !== productId),
              total: boutiqueProductsDataRemove.total - 1
            }
          },
          // Update boutique's product count
          boutiques: state.boutiques.map(b =>
            b._id === removeBoutiqueId 
              ? { ...b, produits_count: Math.max(0, (b.produits_count || 0) - 1) }
              : b
          ),
          userBoutiques: state.userBoutiques.map(b =>
            b._id === removeBoutiqueId 
              ? { ...b, produits_count: Math.max(0, (b.produits_count || 0) - 1) }
              : b
          ),
          error: null
        };
      }
      return state;
      
    // ============ STATISTICS ============
    case BOUTIQUE_TYPES.GET_BOUTIQUE_STATS:
      const { boutiqueId: statsBoutiqueId, stats } = action.payload;
      
      return {
        ...state,
        boutiqueStats: {
          ...state.boutiqueStats,
          [statsBoutiqueId]: stats
        },
        error: null
      };
      
    // ============ CLEAR OPERATIONS ============
    case 'CLEAR_BOUTIQUES':
      return {
        ...initialState
      };
      
    case 'CLEAR_CURRENT_BOUTIQUE':
      return {
        ...state,
        currentBoutique: null,
        boutiqueByDomain: null
      };
      
    case 'CLEAR_BOUTIQUE_PRODUCTS':
      const { boutiqueId: clearBoutiqueId } = action.payload;
      
      return {
        ...state,
        boutiqueProducts: {
          ...state.boutiqueProducts,
          [clearBoutiqueId]: {
            products: [],
            total: 0,
            page: 1,
            totalPages: 0
          }
        }
      };
      
    // ============ ERROR HANDLING ============
    case 'BOUTIQUE_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
        loadingProducts: false
      };
      
    default:
      return state;
  }
};

export default boutiqueReducer;