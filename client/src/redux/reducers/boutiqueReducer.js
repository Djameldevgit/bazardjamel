 
import { BOUTIQUE_TYPES } from '../actions/boutiqueAction';
const initialState = {
  // Main boutique list
  boutiques: [],
  total: 0,
  page: 1,
  totalPages: 0,
  homeBoutiques: [],
  // 🔥 Boutiques por categoría (para el slider)
  boutiquesByCategory: {}, // Format: { 'categorie/sub/article': { boutiques, total, page, totalPages, hasMore, categoryInfo, children } }
  
  // Current boutique details
  currentBoutique: null,
  boutiqueByDomain: null,
  
  // User's boutiques
  userBoutiques: [],
  
  // Boutique statistics
  boutiqueStats: {}, // Format: { [boutiqueId]: stats }
  
  // Loading states
  loading: false,
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
      
    case BOUTIQUE_TYPES.LOADING_BOUTIQUES_BY_CATEGORY:
      return {
        ...state,
        loadingByCategory: {
          ...state.loadingByCategory,
          [action.payload.category]: action.payload.loading
        }
      };
    
    // ============ GET BOUTIQUES BY CATEGORY ============
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
      
      const existingData = state.boutiquesByCategory[categoryPath];
      const existingBoutiques = existingData?.boutiques || [];
      
      const updatedBoutiquesCat = page === 1 
        ? boutiques 
        : [...existingBoutiques, ...boutiques];
      
      return {
        ...state,
        boutiquesByCategory: {
          ...state.boutiquesByCategory,
          [categoryPath]: {
            boutiques: updatedBoutiquesCat,
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
        homeBoutiques: [newBoutique, ...state.homeBoutiques],
        total: state.total + 1,
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
      
    // ============ UPDATE BOUTIQUE ============
    case BOUTIQUE_TYPES.UPDATE_BOUTIQUE:
      const updatedBoutique = action.payload;
      
      const updatedBoutiquesList = state.boutiques.map(boutique =>
        boutique._id === updatedBoutique._id ? updatedBoutique : boutique
      );
      
      const updatedUserBoutiquesList = state.userBoutiques.map(boutique =>
        boutique._id === updatedBoutique._id ? updatedBoutique : boutique
      );
      
      const updatedHomeBoutiquesList = state.homeBoutiques.map(boutique =>
        boutique._id === updatedBoutique._id ? updatedBoutique : boutique
      );
      
      const currentBoutiqueUpdated = state.currentBoutique?._id === updatedBoutique._id 
        ? updatedBoutique 
        : state.currentBoutique;
      
      const boutiqueByDomainUpdated = state.boutiqueByDomain?._id === updatedBoutique._id 
        ? updatedBoutique 
        : state.boutiqueByDomain;
      
      const updatedBoutiquesByCategoryUpdate = {};
      Object.keys(state.boutiquesByCategory).forEach(key => {
        const categoryData = state.boutiquesByCategory[key];
        if (categoryData) {
          updatedBoutiquesByCategoryUpdate[key] = {
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
        homeBoutiques: updatedHomeBoutiquesList,
        currentBoutique: currentBoutiqueUpdated,
        boutiqueByDomain: boutiqueByDomainUpdated,
        boutiquesByCategory: updatedBoutiquesByCategoryUpdate,
        error: null
      };
      
    // ============ DELETE BOUTIQUE ============
    case BOUTIQUE_TYPES.DELETE_BOUTIQUE:
      const deletedId = action.payload;
      
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
        homeBoutiques: state.homeBoutiques.filter(b => b._id !== deletedId),
        currentBoutique: state.currentBoutique?._id === deletedId ? null : state.currentBoutique,
        boutiqueByDomain: state.boutiqueByDomain?._id === deletedId ? null : state.boutiqueByDomain,
        boutiquesByCategory: deletedFromCategory,
        total: Math.max(0, state.total - 1),
        error: null
      };
      
    // ============ STATUS MANAGEMENT ============
    case BOUTIQUE_TYPES.UPDATE_BOUTIQUE_STATUS:
      const { id, status, isActive } = action.payload;
      const newStatus = status !== undefined ? status : isActive;
      
      const updateStatusInList = (list) =>
        list.map(boutique =>
          boutique._id === id ? { ...boutique, isActive: newStatus } : boutique
        );
      
      const updateStatusInCategory = {};
      Object.keys(state.boutiquesByCategory).forEach(key => {
        const categoryData = state.boutiquesByCategory[key];
        if (categoryData) {
          updateStatusInCategory[key] = {
            ...categoryData,
            boutiques: categoryData.boutiques.map(b =>
              b._id === id ? { ...b, isActive: newStatus } : b
            )
          };
        }
      });
      
      return {
        ...state,
        boutiques: updateStatusInList(state.boutiques),
        userBoutiques: updateStatusInList(state.userBoutiques),
        homeBoutiques: updateStatusInList(state.homeBoutiques),
        boutiquesByCategory: updateStatusInCategory,
        currentBoutique: state.currentBoutique?._id === id 
          ? { ...state.currentBoutique, isActive: newStatus } 
          : state.currentBoutique,
        boutiqueByDomain: state.boutiqueByDomain?._id === id 
          ? { ...state.boutiqueByDomain, isActive: newStatus } 
          : state.boutiqueByDomain,
        error: null
      };
      
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
      
    case 'CLEAR_BOUTIQUES_BY_CATEGORY':
      const { categoryPath: clearCategoryPath } = action.payload;
      
      const newBoutiquesByCategory = { ...state.boutiquesByCategory };
      delete newBoutiquesByCategory[clearCategoryPath];
      
      return {
        ...state,
        boutiquesByCategory: newBoutiquesByCategory
      };
      
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
        loadingByCategory: {}
      };
      
    default:
      return state;
  }
};

export default boutiqueReducer;