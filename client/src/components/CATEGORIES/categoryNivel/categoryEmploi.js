// 📂 components/CATEGORIES/categoryNivel/categoryEmploi.js

const categoryEmploi = {
    // ⭐ MISMA ESTRUCTURA QUE SERVICES, ALIMENTAIRES, VOYAGES
    levels: 2,
    level1: 'categorie',
    level2: 'subCategory',
    requiresLevel2: false, // Todas son directas
    
    // 💼 CATEGORÍAS PRINCIPALES (Nivel 1) - TODAS DIRECTAS
    categories: [
      { id: 'offres_emploi', name: 'Offres d\'emploi', emoji: '💼', hasSublevel: false },
      { id: 'demandes_emploi', name: 'Demandes d\'emploi', emoji: '📋', hasSublevel: false },
      { id: 'autres_emploi', name: 'Autres services emploi', emoji: '👔', hasSublevel: false }
    ],
    
    // 💼 SUBCATEGORÍAS - Vacío
    subcategories: {},
    
    // ⭐ Para compatibilidad
    properties: {}
  };
  
  export default categoryEmploi;