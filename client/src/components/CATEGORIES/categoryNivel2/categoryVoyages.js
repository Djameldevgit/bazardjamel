// 📂 components/CATEGORIES/categoryNivel/categoryVoyages.js

const categoryVoyages = {
    // ⭐ MISMA ESTRUCTURA QUE SERVICES Y ALIMENTAIRES
    levels: 2,
    level1: 'categorie',
    level2: 'subCategory',
    requiresLevel2: false, // Todas son directas
    
    // ✈️ CATEGORÍAS PRINCIPALES (Nivel 1) - TODAS DIRECTAS
    categories: [
      { id: 'voyage_organise', name: 'Voyage organisé', emoji: '✈️', hasSublevel: false },
      { id: 'location_vacances', name: 'Location vacances', emoji: '🏠', hasSublevel: false },
      { id: 'hajj_omra', name: 'Hajj & Omra', emoji: '🕋', hasSublevel: false },
      { id: 'reservations_visa', name: 'Réservations & Visa', emoji: '🛂', hasSublevel: false },
      { id: 'sejour', name: 'Séjour', emoji: '🏨', hasSublevel: false },
      { id: 'croisiere', name: 'Croisière', emoji: '🚢', hasSublevel: false },
      { id: 'autre_voyages', name: 'Autre voyages', emoji: '🧳', hasSublevel: false }
    ],
    
    // ✈️ SUBCATEGORÍAS - Vacío (igual que services y alimentaires)
    subcategories: {},
    
    // ⭐ Para compatibilidad
    properties: {}
  };
  
  export default categoryVoyages;