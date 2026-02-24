// 📂 redux/reducers/boutiqueReducer.js
import { BOUTIQUE_TYPES } from '../actions/boutiqueAction';

const initialState = {
  // Main boutique list
  boutiques: [],
  total: 0,
  page: 1,
  totalPages: 0,
  homeBoutiques: [],
  // 🔥 Boutiques por categoría (para el slider) - MISMO FORMATO QUE POSTS
  boutiquesByCategory: {}, // Format: { 'categorie/sub/article': { boutiques, total, page, totalPages, hasMore, categoryInfo, children } }
  
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
      
    case BOUTIQUE_TYPES.GET_BOUTIQUES_FOR_HOME:
      return {
        ...state,
        homeBoutiques: action.payload
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
    // Añadir al switch del reducer

case BOUTIQUE_TYPES.UPDATE_BOUTIQUE_PRODUCT:
  return {
    ...state,
    boutiqueProducts: {
      ...state.boutiqueProducts,
      [action.payload.boutiqueId]: {
        ...state.boutiqueProducts[action.payload.boutiqueId],
        products: state.boutiqueProducts[action.payload.boutiqueId]?.products.map(p =>
          p._id === action.payload.post._id ? action.payload.post : p
        )
      }
    }
  };

case BOUTIQUE_TYPES.DELETE_BOUTIQUE_PRODUCT:
  return {
    ...state,
    boutiqueProducts: {
      ...state.boutiqueProducts,
      [action.payload.boutiqueId]: {
        ...state.boutiqueProducts[action.payload.boutiqueId],
        products: state.boutiqueProducts[action.payload.boutiqueId]?.products.filter(
          p => p._id !== action.payload.postId
        ),
        total: (state.boutiqueProducts[action.payload.boutiqueId]?.total || 0) - 1
      }
    },
    // Actualizar también stats de la boutique si está disponible
    currentBoutique: state.currentBoutique?._id === action.payload.boutiqueId
      ? {
          ...state.currentBoutique,
          stats: {
            ...state.currentBoutique.stats,
            produits: (state.currentBoutique.stats?.produits || 0) - 1
          }
        }
      : state.currentBoutique
  };
    // ============ 🔥 GET BOUTIQUES BY CATEGORY (NUEVO) ============
    case BOUTIQUE_TYPES.GET_BOUTIQUES_BY_CATEGORY:
      const { 
        categoryPath,
        boutiques,
        total,
        page,
        totalPages,
        hasMore,
        categoryInfo,
        children
      } = action.payload;
      
      // Si es página 1, reemplazar; si no, concatenar
      const existingData = state.boutiquesByCategory[categoryPath];
      const existingBoutiques = existingData?.boutiques || [];
      
      const updatedBoutiques = page === 1 
        ? boutiques 
        : [...existingBoutiques, ...boutiques];
      
      return {
        ...state,
        boutiquesByCategory: {
          ...state.boutiquesByCategory,
          [categoryPath]: {
            boutiques: updatedBoutiques,
            total: total,
            page: page,
            totalPages: totalPages,
            hasMore: hasMore,
            categoryInfo: categoryInfo,
            children: children
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
        
        // Limpiar caché de categorías al crear nueva boutique
        boutiquesByCategory: {},
        error: null
      };
      
    case BOUTIQUE_TYPES.GET_BOUTIQUES:
      return {
        ...state,
        boutiques: action.payload.boutiques || [],
        total: action.payload.total || 0,
        page: action.payload.page || 1,
        totalPages: action.payload.totalPages || 1,
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
        userBoutiques: action.payload || [],
        error: null
      };
      
    // ============ UPDATE BOUTIQUE - VERSIÓN CORREGIDA ============
    case BOUTIQUE_TYPES.UPDATE_BOUTIQUE:
      const updatedBoutique = action.payload;
      
      // ✅ DEFINIR updatedBoutiques ANTES de usarlo
      const updatedBoutiquesList = state.boutiques.map(boutique =>
        boutique._id === updatedBoutique._id ? updatedBoutique : boutique
      );
      
      // Update in user boutiques list
      const updatedUserBoutiquesList = state.userBoutiques.map(boutique =>
        boutique._id === updatedBoutique._id ? updatedBoutique : boutique
      );
      
      // Update current boutique if it's the same
      const currentBoutiqueUpdated = state.currentBoutique?._id === updatedBoutique._id 
        ? updatedBoutique 
        : state.currentBoutique;
      
      // Update boutique by domain if it's the same
      const boutiqueByDomainUpdated = state.boutiqueByDomain?._id === updatedBoutique._id 
        ? updatedBoutique 
        : state.boutiqueByDomain;
      
      // 🔥 Actualizar también en boutiquesByCategory
      const updatedBoutiquesByCategory = {};
      Object.keys(state.boutiquesByCategory).forEach(key => {
        const categoryData = state.boutiquesByCategory[key];
        if (categoryData) {
          updatedBoutiquesByCategory[key] = {
            ...categoryData,
            boutiques: categoryData.boutiques.map(b =>
              b._id === updatedBoutique._id ? updatedBoutique : b
            )
          };
        }
      });
      
      return {
        ...state,
        boutiques: updatedBoutiquesList,
        userBoutiques: updatedUserBoutiquesList,
        currentBoutique: currentBoutiqueUpdated,
        boutiqueByDomain: boutiqueByDomainUpdated,
        boutiquesByCategory: updatedBoutiquesByCategory,
        error: null
      };
      
    // ============ DELETE BOUTIQUE - VERSIÓN CORREGIDA ============
    case BOUTIQUE_TYPES.DELETE_BOUTIQUE:
      const deletedId = action.payload;
      
      // ✅ DEFINIR deletedFromCategory ANTES de usarlo
      const deletedFromCategory = {};
      Object.keys(state.boutiquesByCategory).forEach(key => {
        const categoryData = state.boutiquesByCategory[key];
        if (categoryData) {
          const filteredBoutiques = categoryData.boutiques.filter(b => b._id !== deletedId);
          
          deletedFromCategory[key] = {
            ...categoryData,
            boutiques: filteredBoutiques,
            total: Math.max(0, categoryData.total - (categoryData.boutiques.length - filteredBoutiques.length))
          };
        }
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
        const categoryData = state.boutiquesByCategory[key];
        if (categoryData) {
          updateStatusInCategory[key] = {
            ...categoryData,
            boutiques: categoryData.boutiques.map(b =>
              b._id === id ? { ...b, statut } : b
            )
          };
        }
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
            const categoryData = state.boutiquesByCategory[key];
            if (categoryData) {
              acc[key] = {
                ...categoryData,
                boutiques: categoryData.boutiques.map(b =>
                  b._id === addBoutiqueId 
                    ? { ...b, productCount: (b.productCount || 0) + 1 }
                    : b
                )
              };
            }
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
        const filteredProducts = boutiqueProductsDataRemove.products.filter(p => p._id !== productId);
        
        return {
          ...state,
          boutiqueProducts: {
            ...state.boutiqueProducts,
            [removeBoutiqueId]: {
              ...boutiqueProductsDataRemove,
              products: filteredProducts,
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
            const categoryData = state.boutiquesByCategory[key];
            if (categoryData) {
              acc[key] = {
                ...categoryData,
                boutiques: categoryData.boutiques.map(b =>
                  b._id === removeBoutiqueId 
                    ? { ...b, productCount: Math.max(0, (b.productCount || 0) - 1) }
                    : b
                )
              };
            }
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
      
      const newBoutiquesByCategory = { ...state.boutiquesByCategory };
      delete newBoutiquesByCategory[clearCategoryPath];
      
      return {
        ...state,
        boutiquesByCategory: newBoutiquesByCategory
      };
      
    // ============ RESET CATEGORY (útil para cambio de categoría) ============
    case 'RESET_BOUTIQUE_CATEGORY':
      const { categoryPath: resetCategoryPath } = action.payload;
      
      return {
        ...state,
        boutiquesByCategory: {
          ...state.boutiquesByCategory,
          [resetCategoryPath]: {
            boutiques: [],
            total: 0,
            page: 1,
            totalPages: 1,
            hasMore: false,
            categoryInfo: null,
            children: []
          }
        },
        loadingByCategory: {
          ...state.loadingByCategory,
          [resetCategoryPath]: false
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