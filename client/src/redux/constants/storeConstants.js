// redux/constants/storeConstants.js
export const STORE_TYPES = {
    // Acciones básicas
    CREATE_STORE: 'CREATE_STORE',
    GET_STORES: 'GET_STORES',
    GET_STORE: 'GET_STORE',
    GET_STORE_PRODUCTS: 'GET_STORE_PRODUCTS',
    UPDATE_STORE: 'UPDATE_STORE',
    DELETE_STORE: 'DELETE_STORE',
    CONTACT_STORE: 'CONTACT_STORE',
    TOGGLE_FAVORITE_STORE: 'TOGGLE_FAVORITE_STORE',
    
    // Estados
    LOADING_STORE: 'LOADING_STORE',
    ERROR_STORE: 'ERROR_STORE',
    CLEAR_STORE: 'CLEAR_STORE',
    
    // Acciones específicas
    GET_MY_STORE: 'GET_MY_STORE',
    TOGGLE_ACTIVE: 'TOGGLE_ACTIVE',
    GET_MY_STATS: 'GET_MY_STATS',
    CHANGE_PLAN: 'CHANGE_PLAN',
    
    // Aliases para compatibilidad
    SET_STORE_LOADING: 'SET_STORE_LOADING',
    STORE_ERROR: 'STORE_ERROR'
  }
  
  // Constantes para planes de tienda
  export const STORE_PLANS = {
    BASIC_50: {
      id: 'basic_50',
      name: 'Store Basic 50',
      credits: 50,
      storage: 100,
      price: 50,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing'],
      type: 'Free'
    },
    BASIC_100: {
      id: 'basic_100',
      name: 'Store Basic 100',
      credits: 100,
      storage: 200,
      price: 100,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing'],
      type: 'Free'
    },
    // ... agregar todos los planes que tienes
  }
  
  export const CATEGORIES = [
    'Automobiles & Véhicules',
    'Informatique',
    'Meubles & Maison',
    'Matériaux & Equipement',
    'Téléphonie & Accessoires',
    'Pièces détachées',
    'Electroménager & Electronique',
    'Vêtements & Mode',
    'Santé & Beauté',
    'Loisirs & Divertissements',
    "Offres & Demandes d'emploi",
    'Immobilier',
    'Services',
    'Voyages',
    'Alimentaire',
    'Sport'
  ]