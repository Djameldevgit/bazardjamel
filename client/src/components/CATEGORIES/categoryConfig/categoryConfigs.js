// 📁 src/components/CATEGORIES/CategoryConfig/index.js
 
import categoryVehicules from './categoryVehicules';
import categoryTelephones from './categoryTelephones';
import categoryImmobilier from './categoryImmobier';
// ... importar todas las categorías
 
// Exportar todas las configuraciones organizadas por SLUG
export const categoryConfigs = {
  // Immobilier (3 niveles con slugs)
  immobilier: categoryImmobilier,
  
  // Vehicules (ejemplo)
  vehicules: {
    name: "Véhicules",
    slug: "vehicules",
    icon: "🚗",
    emoji: "🚗",
    id: "vehicules",
    subcategories: [
      { name: "Voiture", slug: "voiture", emoji: "🚗", id: "voiture", hasSublevel: true },
      { name: "Moto", slug: "moto", emoji: "🏍️", id: "moto", hasSublevel: true },
      { name: "Camion", slug: "camion", emoji: "🚚", id: "camion", hasSublevel: false }
    ],
    propertyTypes: {
      voiture: [
        { name: "Berline", slug: "berline", emoji: "🚙", id: "berline" },
        { name: "SUV", slug: "suv", emoji: "🚙", id: "suv" },
        { name: "4x4", slug: "4x4", emoji: "🚙", id: "4x4" },
        { name: "Citadine", slug: "citadine", emoji: "🚗", id: "citadine" }
      ],
      moto: [
        { name: "Sportive", slug: "sportive", emoji: "🏍️", id: "sportive" },
        { name: "Custom", slug: "custom", emoji: "🏍️", id: "custom" },
        { name: "Scooter", slug: "scooter", emoji: "🛵", id: "scooter" }
      ]
    },
    levels: 2,
    requiresLevel2: true
  },
  
  // Telephones (solo 1 nivel)
  telephones: {
    name: "Téléphones",
    slug: "telephones",
    icon: "📱",
    emoji: "📱",
    id: "telephones",
    subcategories: [
      { name: "Smartphone", slug: "smartphone", emoji: "📱", id: "smartphone", hasSublevel: false },
      { name: "Téléphone fixe", slug: "fixe", emoji: "☎️", id: "fixe", hasSublevel: false }
    ],
    levels: 1,
    requiresLevel2: false
  }
};

// Función helper para obtener configuración por slug
export const getCategoryBySlug = (slug) => {
  return categoryConfigs[slug] || null;
};

// Obtener todos los slugs disponibles
export const getAllCategorySlugs = () => {
  return Object.keys(categoryConfigs);
};

// Obtener categoría por ID (backward compatibility)
export const getCategoryById = (id) => {
  return Object.values(categoryConfigs).find(cat => cat.id === id) || null;
};

// Exportar para backward compatibility
export const categoryHierarchy = categoryConfigs;