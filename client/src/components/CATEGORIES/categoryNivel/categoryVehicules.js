// 📂 components/CATEGORIES/categoryNivel/categoryVehicules.js

const categoryVehicules = {
  // ⭐ MISMA ESTRUCTURA QUE VETEMENTS
  levels: 2,
  level1: 'categorie',          // Igual que vetements
  level2: 'subCategory',        // Igual que vetements
  requiresLevel2: false,        // ⭐ DIFERENCIA CLAVE: NO requiere nivel 2
  
  // 🚗 CATEGORÍAS PRINCIPALES (Nivel 1)
  categories: [
    { 
      id: 'voitures', 
      name: 'Voitures', 
      emoji: '🚗', 
      hasSublevel: false  // ⭐ IMPORTANTE: false = se conecta directamente
    },
    { 
      id: 'utilitaire', 
      name: 'Utilitaire', 
      emoji: '🚐', 
      hasSublevel: false  // Directo a componentes
    },
    { 
      id: 'motos_scooters', 
      name: 'Motos & Scooters', 
      emoji: '🏍️', 
      hasSublevel: false 
    },
    { 
      id: 'quads', 
      name: 'Quads', 
      emoji: '🚜', 
      hasSublevel: false 
    },
    { 
      id: 'fourgon', 
      name: 'Fourgon', 
      emoji: '🚚', 
      hasSublevel: false 
    },
    { 
      id: 'camion', 
      name: 'Camion', 
      emoji: '🚛', 
      hasSublevel: false 
    },
    { 
      id: 'bus', 
      name: 'Bus', 
      emoji: '🚌', 
      hasSublevel: false 
    },
    { 
      id: 'engin', 
      name: 'Engin', 
      emoji: '🚜', 
      hasSublevel: false 
    },
    { 
      id: 'tracteurs', 
      name: 'Tracteurs', 
      emoji: '🚜', 
      hasSublevel: false 
    },
    { 
      id: 'remorques', 
      name: 'Remorques', 
      emoji: '🚛', 
      hasSublevel: false 
    },
    { 
      id: 'bateaux_barques', 
      name: 'Bateaux & Barques', 
      emoji: '🛥️', 
      hasSublevel: false 
    }
  ],
  
  // 🚗 SUBCATEGORÍAS - Vacío porque todas son directas
  // (pero mantenemos la estructura para compatibilidad)
  subcategories: {
    // No necesitamos subcategorías reales
  }
};

export default categoryVehicules;