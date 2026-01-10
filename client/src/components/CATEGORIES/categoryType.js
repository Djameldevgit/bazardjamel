// Tipos de categorías y helpers para crear items

// Tipos de niveles
export const CATEGORY_LEVELS = {
    SINGLE: 1,      // 1 nivel (como véhicules)
    MULTI: 2,       // 2 niveles obligatorios (como immobilier)
    MIXED: 3        // Niveles mixtos (como electromenager)
  };
  
  // Helper para crear categorías
  export const createCategory = (id, name, emoji, type = CATEGORY_LEVELS.SINGLE) => ({
    id,
    name,
    emoji,
    type
  });
  
  // Helper para crear items
  export const createItem = (id, name, emoji, hasSublevel = false) => ({
    id,
    name,
    emoji,
    hasSublevel
  });
  
  // Helper para crear subcategorías
  export const createSubcategory = (id, name, emoji) => ({
    id,
    name,
    emoji
  });
  
  // Template para categorías
  export const CATEGORY_TEMPLATE = {
    levels: 1,
    level1: 'subCategory',
    level2: 'detail',
    requiresLevel2: false
  };