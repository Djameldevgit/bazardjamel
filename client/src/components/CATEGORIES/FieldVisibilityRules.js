// fieldVisibilityRules.js - REGLAS CENTRALIZADAS
export const fieldVisibilityRules = {
  // Voyages
  isVoyageFieldVisible: (fieldName, subCategory, postData) => {
    if (subCategory === 'voyage_organise') {
      if (fieldName === 'destinationWilaya') return postData.destinationType === 'local';
      if (fieldName === 'destinationCountry') return postData.destinationType === 'international';
    }
    if (subCategory === 'location_vacances') {
      if (fieldName === 'communeLocation') return postData.wilayaLocation && postData.wilayaLocation !== '';
    }
    return true;
  },
  
  // Immobilier
  isImmobilierFieldVisible: (fieldName, subCategory, postData) => {
    const invalidCombinations = {
      'villa': ['etage', 'nombreEtagesImmeuble'],
      'terrain': ['etage', 'nombrePieces', 'ascenseur', 'parking', 'meuble'],
      'local': ['etage', 'nombrePieces', 'jardin', 'piscine'],
    };
    
    if (invalidCombinations[subCategory]?.includes(fieldName)) return false;
    if (fieldName === 'superficieJardin' && postData.jardin !== 'oui') return false;
    
    return true;
  },
  
  // Agrega más categorías aquí...
};

// Función principal de visibilidad
export const shouldShowField = (fieldName, mainCategory, subCategory, articleType, postData) => {
  switch(mainCategory) {
    case 'voyages':
      return fieldVisibilityRules.isVoyageFieldVisible(fieldName, subCategory, postData);
    case 'immobilier':
      return fieldVisibilityRules.isImmobilierFieldVisible(fieldName, subCategory, postData);
    // Agrega más casos...
    default:
      return true;
  }
};