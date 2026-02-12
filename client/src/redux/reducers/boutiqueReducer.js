// 📂 src/redux/reducers/boutiqueReducer.js - VERSIÓN CORREGIDA
import { BOUTIQUE_TYPES } from '../actions/boutiqueAction';

const initialState = {
  // Main boutique list
  boutiques: [],
  total: 0,
  page: 1,
  totalPages: 0,
  
  // 🔥 Boutiques por categoría (para el slider)
  boutiquesByCategory: {}, // Format: { 'categorie/sub/article': { boutiques, total, page, totalPages, hasMore } }
  
  // Current boutique details
  currentBoutique: null,
  boutiqueByDomain: null,
  
  // User's boutiques
  userBoutiques: [],
  
  // Boutique products
  boutiqueProducts: {}, // Format: { [boutiqueId]: { products, total, page, totalPages } }
  
  // Boutique statistics
  boutiqueStats: {}, // Format: { [boutiqueId]: stats }
  
  // Loading states
  loading: false,
  loadingProducts: false,
  loadingByCategory: {}, // Format: { 'categorie/sub/article': boolean }
  
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
      
    // 🔥 Loading state por categoría
    case BOUTIQUE_TYPES.LOADING_BOUTIQUES_BY_CATEGORY:
      return {
        ...state,
        loadingByCategory: {
          ...state.loadingByCategory,
          [action.payload.category]: action.payload.loading
        }
      };
    
    // ============ 🔥 GET BOUTIQUES BY CATEGORY ============
    case BOUTIQUE_TYPES.GET_BOUTIQUES_BY_CATEGORY:
      // ✅ CORREGIDO: Usar nombres diferentes para evitar conflicto
      const { 
        categoryPath: catPath, 
        boutiques, 
        total, 
        page, 
        totalPages, 
        hasMore 
      } = action.payload;
      
      return {
        ...state,
        boutiquesByCategory: {
          ...state.boutiquesByCategory,
          [catPath]: {
            boutiques,
            total,
            page,
            totalPages,
            hasMore
          }
        },
        error: null
      };
    
    // ============ CRUD OPERATIONS ============
    case BOUTIQUE_TYPES.CREATE_BOUTIQUE:
      const newBoutique = action.payload;
      
      return {
        ...state,
        boutiques: [newBoutique, ...state.boutiques],
        userBoutiques: [newBoutique, ...state.userBoutiques],
        total: state.total + 1,
        
        // 🔥 Limpiar caché de categorías al crear nueva boutique
        boutiquesByCategory: {},
        error: null
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
        boutiqueByDomain: action.payload,
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
      
      // 🔥 Actualizar también en boutiquesByCategory
      const updatedBoutiquesByCategory = {};
      Object.keys(state.boutiquesByCategory).forEach(key => {
        updatedBoutiquesByCategory[key] = {
          ...state.boutiquesByCategory[key],
          boutiques: state.boutiquesByCategory[key].boutiques.map(b =>
            b._id === updatedBoutique._id ? updatedBoutique : b
          )
        };
      });
      
      return {
        ...state,
        boutiques: updatedBoutiques,
        userBoutiques: updatedUserBoutiques,
        currentBoutique,
        boutiqueByDomain,
        boutiquesByCategory: updatedBoutiquesByCategory,
        error: null
      };
      
    case BOUTIQUE_TYPES.DELETE_BOUTIQUE:
      const deletedId = action.payload;
      
      // 🔥 Eliminar de boutiquesByCategory
      const deletedFromCategory = {};
      Object.keys(state.boutiquesByCategory).forEach(key => {
        deletedFromCategory[key] = {
          ...state.boutiquesByCategory[key],
          boutiques: state.boutiquesByCategory[key].boutiques.filter(b => b._id !== deletedId),
          total: Math.max(0, state.boutiquesByCategory[key].total - 1)
        };
      });
      
      return {
        ...state,
        boutiques: state.boutiques.filter(b => b._id !== deletedId),
        userBoutiques: state.userBoutiques.filter(b => b._id !== deletedId),
        currentBoutique: state.currentBoutique?._id === deletedId ? null : state.currentBoutique,
        boutiqueByDomain: state.boutiqueByDomain?._id === deletedId ? null : state.boutiqueByDomain,
        boutiquesByCategory: deletedFromCategory,
        total: Math.max(0, state.total - 1),
        error: null
      };
      
    // ============ STATUS MANAGEMENT ============
    case BOUTIQUE_TYPES.UPDATE_BOUTIQUE_STATUS:
      const { id, statut } = action.payload;
      
      // Update status in all boutique lists
      const updateStatusInList = (list) =>
        list.map(boutique =>
          boutique._id === id ? { ...boutique, statut } : boutique
        );
      
      // 🔥 Actualizar en boutiquesByCategory
      const updateStatusInCategory = {};
      Object.keys(state.boutiquesByCategory).forEach(key => {
        updateStatusInCategory[key] = {
          ...state.boutiquesByCategory[key],
          boutiques: state.boutiquesByCategory[key].boutiques.map(b =>
            b._id === id ? { ...b, statut } : b
          )
        };
      });
      
      return {
        ...state,
        boutiques: updateStatusInList(state.boutiques),
        userBoutiques: updateStatusInList(state.userBoutiques),
        boutiquesByCategory: updateStatusInCategory,
        currentBoutique: state.currentBoutique?._id === id 
          ? { ...state.currentBoutique, statut } 
          : state.currentBoutique,
        boutiqueByDomain: state.boutiqueByDomain?._id === id 
          ? { ...state.boutiqueByDomain, statut } 
          : state.boutiqueByDomain,
        error: null
      };
      
    // ============ PRODUCTS MANAGEMENT ============
    case BOUTIQUE_TYPES.GET_BOUTIQUE_PRODUCTS:
      const { 
        boutiqueId, 
        products, 
        total: productsTotal, 
        page: productsPage, 
        totalPages: productsTotalPages 
      } = action.payload;
      
      return {
        ...state,
        boutiqueProducts: {
          ...state.boutiqueProducts,
          [boutiqueId]: {
            products: products || [],
            total: productsTotal || 0,
            page: productsPage || 1,
            totalPages: productsTotalPages || 1
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
          // Update boutique's product count in all lists
          boutiques: state.boutiques.map(b =>
            b._id === addBoutiqueId 
              ? { ...b, productCount: (b.productCount || 0) + 1 }
              : b
          ),
          userBoutiques: state.userBoutiques.map(b =>
            b._id === addBoutiqueId 
              ? { ...b, productCount: (b.productCount || 0) + 1 }
              : b
          ),
          // 🔥 Actualizar en boutiquesByCategory
          boutiquesByCategory: Object.keys(state.boutiquesByCategory).reduce((acc, key) => {
            acc[key] = {
              ...state.boutiquesByCategory[key],
              boutiques: state.boutiquesByCategory[key].boutiques.map(b =>
                b._id === addBoutiqueId 
                  ? { ...b, productCount: (b.productCount || 0) + 1 }
                  : b
              )
            };
            return acc;
          }, {}),
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
              total: Math.max(0, boutiqueProductsDataRemove.total - 1)
            }
          },
          // Update boutique's product count in all lists
          boutiques: state.boutiques.map(b =>
            b._id === removeBoutiqueId 
              ? { ...b, productCount: Math.max(0, (b.productCount || 0) - 1) }
              : b
          ),
          userBoutiques: state.userBoutiques.map(b =>
            b._id === removeBoutiqueId 
              ? { ...b, productCount: Math.max(0, (b.productCount || 0) - 1) }
              : b
          ),
          // 🔥 Actualizar en boutiquesByCategory
          boutiquesByCategory: Object.keys(state.boutiquesByCategory).reduce((acc, key) => {
            acc[key] = {
              ...state.boutiquesByCategory[key],
              boutiques: state.boutiquesByCategory[key].boutiques.map(b =>
                b._id === removeBoutiqueId 
                  ? { ...b, productCount: Math.max(0, (b.productCount || 0) - 1) }
                  : b
              )
            };
            return acc;
          }, {}),
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
      
    case 'CLEAR_BOUTIQUES_BY_CATEGORY':
      const { categoryPath: clearCategoryPath } = action.payload;
      
      return {
        ...state,
        boutiquesByCategory: {
          ...state.boutiquesByCategory,
          [clearCategoryPath]: {
            boutiques: [],
            total: 0,
            page: 1,
            totalPages: 1,
            hasMore: false
          }
        }
      };
      
    // ============ ERROR HANDLING ============
    case 'BOUTIQUE_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
        loadingProducts: false,
        loadingByCategory: {}
      };
      
    default:
      return state;
  }
};

export default boutiqueReducer;