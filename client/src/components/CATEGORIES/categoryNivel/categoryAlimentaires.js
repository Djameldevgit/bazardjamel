// 📂 components/CATEGORIES/categoryNivel/categoryAlimentaires.js

const categoryAlimentaires = {
    // ⭐ MISMA ESTRUCTURA QUE SERVICES Y VEHICULES
    levels: 2,
    level1: 'categorie',
    level2: 'subcategory',
    requiresLevel2: false, // Todas son directas
    
    // 🍎 CATEGORÍAS PRINCIPALES (Nivel 1) - TODAS DIRECTAS
    categories: [
      { id: 'produits_laitiers', name: 'Produits laitiers', emoji: '🥛', hasSublevel: false },
      { id: 'fruits_secs', name: 'Fruits secs', emoji: '🍇', hasSublevel: false },
      { id: 'graines_riz_cereales', name: 'Graines - Riz - Céréales', emoji: '🌾', hasSublevel: false },
      { id: 'sucres_produits_sucres', name: 'Sucres & Produits sucrés', emoji: '🍬', hasSublevel: false },
      { id: 'boissons', name: 'Boissons', emoji: '🥤', hasSublevel: false },
      { id: 'viandes_poissons', name: 'Viandes & Poissons', emoji: '🍖', hasSublevel: false },
      { id: 'cafe_the_infusion', name: 'Café - Thé - Infusion', emoji: '☕', hasSublevel: false },
      { id: 'complements_alimentaires', name: 'Compléments alimentaires', emoji: '💊', hasSublevel: false },
      { id: 'miel_derives', name: 'Miel & Dérivés', emoji: '🍯', hasSublevel: false },
      { id: 'fruits_legumes', name: 'Fruits & Légumes', emoji: '🥦', hasSublevel: false },
      { id: 'ble_farine', name: 'Blé & Farine', emoji: '🌾', hasSublevel: false },
      { id: 'bonbons_chocolat', name: 'Bonbons & Chocolat', emoji: '🍫', hasSublevel: false },
      { id: 'boulangerie_viennoiserie', name: 'Boulangerie & Viennoiserie', emoji: '🥐', hasSublevel: false },
      { id: 'ingredients_cuisine_patisserie', name: 'Ingrédients cuisine et pâtisserie', emoji: '🧂', hasSublevel: false },
      { id: 'noix_graines', name: 'Noix & Graines', emoji: '🥜', hasSublevel: false },
      { id: 'plats_cuisines', name: 'Plats cuisinés', emoji: '🍲', hasSublevel: false },
      { id: 'sauces_epices_condiments', name: 'Sauces - Epices - Condiments', emoji: '🌶️', hasSublevel: false },
      { id: 'oeufs', name: 'Œufs', emoji: '🥚', hasSublevel: false },
      { id: 'huiles', name: 'Huiles', emoji: '🫒', hasSublevel: false },
      { id: 'pates', name: 'Pâtes', emoji: '🍝', hasSublevel: false },
      { id: 'gateaux', name: 'Gateaux', emoji: '🎂', hasSublevel: false },
      { id: 'emballage', name: 'Emballage', emoji: '📦', hasSublevel: false },
      { id: 'aliments_bebe', name: 'Aliments pour bébé', emoji: '👶', hasSublevel: false },
      { id: 'aliments_dietetiques', name: 'Aliments diététiques', emoji: '🥗', hasSublevel: false },
      { id: 'autre_alimentaires', name: 'Autre Alimentaires', emoji: '🍎', hasSublevel: false }
    ],
    
    // 🍎 SUBCATEGORÍAS - Vacío (igual que vehicules y services)
    subcategories: {},
    
    // ⭐ Para compatibilidad
    properties: {}
  };
  
  export default categoryAlimentaires;