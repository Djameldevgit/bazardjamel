// 📂 components/CATEGORIES/categoryFieldMapping.js

/**
 * 🎯 MAPEO UNIFICADO PARA TODAS LAS CATEGORÍAS
 * Define QUÉ campo de BD corresponde a CADA nivel visual
 */

 export const CATEGORY_FIELD_MAPPING = {
    // ========== CONFIGURACIÓN POR DEFECTO ==========
    DEFAULT: {
      // 🏷️ CÓMO SE MUESTRA AL USUARIO
      displayNames: {
        level1: 'Sous-catégorie',
        level2: 'Type d\'article'
      },
      
      // 🗂️ QUÉ CAMPOS DE BD USAR
      databaseFields: {
        level1: 'subCategory',    // Nivel 1 va al campo 'subCategory' en BD
        level2: 'articleType'     // Nivel 2 va al campo 'articleType' en BD
      },
      
      // 📂 QUÉ PROPIEDADES BUSCAR EN CADA CATEGORÍA
      categoryProperties: {
        level1: 'subCategories',  // Busca 'subCategories' en el objeto categoría
        level2: 'articleTypes'    // Busca 'articleTypes' en el objeto categoría
      }
    },
    
    // ========== EXCEPCIONES ESPECÍFICAS ==========
    // Solo si alguna categoría es DIFERENTE
    vehicules: {
      // Por ejemplo, si vehículos usa nombres diferentes
      databaseFields: {
        level1: 'subCategory',
        level2: 'articleType'
      },
      categoryProperties: {
        level1: 'articleTypes',   // ⚠️ Vehículos usa 'articleTypes' para nivel 1
        level2: 'subcategories'   // ⚠️ Vehículos usa 'subcategories' para nivel 2
      }
    }
  };
  
  /**
   * 🛠️ Obtener configuración para una categoría
   */
  export const getCategoryMapping = (categoryId) => {
    return CATEGORY_FIELD_MAPPING[categoryId] || CATEGORY_FIELD_MAPPING.DEFAULT;
  };