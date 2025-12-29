// BrandsConfig.js - CONFIGURACIÓN CENTRALIZADA DE MARCAS
export const ALL_BRANDS_BY_CATEGORY = {
    // ============ 🏠 IMMOBILIER ============
    'immobilier': {
      'appartements': ['Cosider', 'Groupe Hasnaoui', 'Eurl Bâtiment', 'Immobiliaire', 'Particulier', 'Promoteur local'],
      'villas': ['Cosider', 'Groupe Hasnaoui', 'Architecte privé', 'Particulier', 'Promotion immobilière'],
      'terrains': ['Domaine public', 'Particulier', 'Société foncière', 'Héritage'],
      'locaux_commerciaux': ['Promoteur commercial', 'Société immobilière', 'Particulier'],
      'bureaux': ['Promoteur bureautique', 'Société immobilière', 'Particulier'],
      'garages_parkings': ['Promoteur', 'Copropriété', 'Particulier'],
      'fermes': ['Agriculteur', 'Héritage', 'Société agricole'],
      'default': ['Cosider', 'Groupe Hasnaoui', 'Eurl Bâtiment', 'Immobiliaire', 'Particulier']
    },
    
    // ============ 🚗 AUTOMOBILES & VÉHICULES ============
    'vehicules': {
      'automobiles': [
        'Toyota', 'Renault', 'Peugeot', 'Mercedes-Benz', 'BMW', 'Audi', 'Volkswagen',
        'Fiat', 'Hyundai', 'Kia', 'Chevrolet', 'Dacia', 'Citroën', 'Ford', 'Opel',
        'Nissan', 'Mitsubishi', 'Seat', 'Skoda', 'Suzuki', 'Honda', 'Mazda'
      ],
      // ... resto de las categorías igual que tu archivo
    }
    // ... resto de las categorías principales
  };
  
  /**
   * Obtiene las marcas para una categoría y subcategoría específicas
   * @param {string} category - Categoría principal
   * @param {string} subCategory - Subcategoría
   * @returns {string[]} Array de marcas
   */
  export const getBrandsForCategory = (category, subCategory) => {
    if (!ALL_BRANDS_BY_CATEGORY[category]) {
      return getDefaultBrands();
    }
    
    const categoryBrands = ALL_BRANDS_BY_CATEGORY[category];
    
    // Si existe la subcategoría específica
    if (categoryBrands[subCategory]) {
      return categoryBrands[subCategory];
    }
    
    // Si no, usar default
    return categoryBrands.default || getDefaultBrands();
  };
  
  /**
   * Obtiene todas las categorías que tienen marcas
   * @returns {string[]}
   */
  export const getBrandCategories = () => {
    return Object.keys(ALL_BRANDS_BY_CATEGORY);
  };
  
  /**
   * Obtiene todas las subcategorías de una categoría
   * @param {string} category - Categoría principal
   * @returns {string[]}
   */
  export const getSubCategoriesWithBrands = (category) => {
    if (!ALL_BRANDS_BY_CATEGORY[category]) {
      return [];
    }
    
    const subCats = Object.keys(ALL_BRANDS_BY_CATEGORY[category]);
    // Filtrar 'default' si no se quiere incluir
    return subCats.filter(sub => sub !== 'default');
  };
  
  /**
   * Marcas por defecto
   */
  const getDefaultBrands = () => {
    return ['Particulier', 'Autre', 'Non spécifié'];
  };
  
  export default ALL_BRANDS_BY_CATEGORY;