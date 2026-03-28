// 📂 components/CATEGORIES/FieldConfig.js

export const DYNAMIC_FIELDS_CONFIG = {
  // ============ VEHÍCULOS ============
  'vehicules': {
    step2: ['title', 'description', 'etat', 'reference'],  // ✅ Solo campos BASE
    step3: ['price', 'typeOffre', 'echange'],              // ✅ Solo campos BASE
    step4: ['wilaya', 'commune', 'telephone', 'email'],    // ✅ Solo campos BASE
    step5: ['images'],
    subCategories: {
      'automobiles': { step2: [], step3: [], step4: [] },
      'motos': { step2: [], step3: [], step4: [] },
      'utilitaires': { step2: [], step3: [], step4: [] },
      'camions': { step2: [], step3: [], step4: [] }
    }
  },

  // ============ IMMOBILIER ============
  'immobilier': {
    step2: ['title', 'description', 'etat', 'reference'],  // ✅ Solo campos BASE
    step3: ['price', 'typeOffre', 'echange'],              // ✅ Solo campos BASE
    step4: ['wilaya', 'commune', 'telephone', 'email'],    // ✅ Solo campos BASE
    step5: ['images'],
    subCategories: {
      'appartement': { step2: [], step3: [], step4: [] },
      'villa': { step2: [], step3: [], step4: [] },
      'terrain': { step2: [], step3: [], step4: [] },
      'local_commercial': { step2: [], step3: [], step4: [] }
    }
  },

  // ============ TELÉPHONES ============
  'telephones': {
    step2: ['title', 'description', 'etat', 'reference'],  // ✅ Solo campos BASE
    step3: ['price', 'typeOffre', 'echange'],              // ✅ Solo campos BASE
    step4: ['wilaya', 'commune', 'telephone'],             // ✅ Solo campos BASE
    step5: ['images'],
    subCategories: {
      'smartphones': { step2: [], step3: [], step4: [] },
      'tablettes': { step2: [], step3: [], step4: [] },
      'accessoires': { step2: [], step3: [], step4: [] }
    }
  },

  // ============ VÊTEMENTS ============
  'vetements': {
    step2: ['title', 'description', 'etat', 'reference'],  // ✅ Solo campos BASE
    step3: ['price', 'typeOffre', 'echange'],              // ✅ Solo campos BASE
    step4: ['wilaya', 'commune', 'telephone'],             // ✅ Solo campos BASE
    step5: ['images'],
    subCategories: {
      'vetements_homme': { step2: [], step3: [], step4: [] },
      'vetements_femme': { step2: [], step3: [], step4: [] },
      'chaussures_homme': { step2: [], step3: [], step4: [] },
      'chaussures_femme': { step2: [], step3: [], step4: [] },
      'enfants': { step2: [], step3: [], step4: [] }
    }
  },

  // ============ ÉLECTROMÉNAGER ============
  'electromenager': {
    step2: ['title', 'description', 'etat', 'reference'],  // ✅ CAMPOS BASE
    step3: ['price', 'typeOffre', 'echange'],              // ✅ CAMPOS BASE
    step4: ['wilaya', 'commune', 'telephone'],             // ✅ CAMPOS BASE
    step5: ['images'],
    subCategories: {
      'refrigerateurs': { step2: [], step3: [], step4: [] },
      'machines_a_laver': { step2: [], step3: [], step4: [] },
      'televiseur': { step2: [], step3: [], step4: [] },
      'four_micro_ondes': { step2: [], step3: [], step4: [] },
      'climatiseurs': { step2: [], step3: [], step4: [] },
      'aspirateurs': { step2: [], step3: [], step4: [] }
    }
  },
  // ============ INFORMATIQUE ============
  'informatique': {
    step2: ['title', 'description', 'etat', 'reference'],  // ✅ Solo campos BASE
    step3: ['price', 'typeOffre', 'echange'],              // ✅ Solo campos BASE
    step4: ['wilaya', 'commune', 'telephone'],             // ✅ Solo campos BASE
    step5: ['images'],
    subCategories: {
      'ordinateurs_portables': { step2: [], step3: [], step4: [] },
      'ordinateurs_bureau': { step2: [], step3: [], step4: [] },
      'imprimantes': { step2: [], step3: [], step4: [] }
    }
  },

  // ============ LOISIRS ============
  'loisirs': {
    step2: ['title', 'description', 'etat', 'reference'],  // ✅ Solo campos BASE
    step3: ['price', 'typeOffre', 'echange'],              // ✅ Solo campos BASE
    step4: ['wilaya', 'commune', 'telephone'],             // ✅ Solo campos BASE
    step5: ['images'],
    subCategories: {
      'jeux_video': { step2: [], step3: [], step4: [] },
      'instruments_musique': { step2: [], step3: [], step4: [] },
      'livres': { step2: [], step3: [], step4: [] },
      'jouets': { step2: [], step3: [], step4: [] },
      'bricolage': { step2: [], step3: [], step4: [] }
    }
  },

  // ============ ALIMENTAIRES ============
  'alimentaires': {
    step2: ['title', 'description', 'reference'],         // ✅ Solo campos BASE (sin etat)
    step3: ['price', 'typeOffre', 'unite', 'quantite'],   // ✅ Solo campos BASE
    step4: ['wilaya', 'commune', 'telephone'],            // ✅ Solo campos BASE
    step5: ['images'],
    subCategories: {
      'fruits_legumes': { step2: [], step3: [], step4: [] },
      'produits_laitiers': { step2: [], step3: [], step4: [] },
      'viandes_poissons': { step2: [], step3: [], step4: [] },
      'boissons': { step2: [], step3: [], step4: [] },
      'patisserie': { step2: [], step3: [], step4: [] }
    }
  },

  // ============ SERVICES ============
  'services': {
    step2: ['title', 'description', 'reference'],         // ✅ Solo campos BASE
    step3: ['price', 'typeOffre'],                        // ✅ Solo campos BASE
    step4: ['wilaya', 'commune', 'telephone', 'email'],   // ✅ Solo campos BASE
    step5: ['images'],
    subCategories: {
      'construction': { step2: [], step3: [], step4: [] },
      'formation': { step2: [], step3: [], step4: [] },
      'transport': { step2: [], step3: [], step4: [] },
      'menage': { step2: [], step3: [], step4: [] },
      'reparation': { step2: [], step3: [], step4: [] }
    }
  },

  // ============ SANTÉ & BEAUTÉ ============
  'santebeaute': {
    step2: ['title', 'description', 'etat', 'reference'], // ✅ Solo campos BASE
    step3: ['price', 'typeOffre', 'quantite'],            // ✅ Solo campos BASE
    step4: ['wilaya', 'commune', 'telephone'],            // ✅ Solo campos BASE
    step5: ['images'],
    subCategories: {
      'cosmetiques': { step2: [], step3: [], step4: [] },
      'parfums': { step2: [], step3: [], step4: [] },
      'soins': { step2: [], step3: [], step4: [] }
    }
  },

  // ============ MEUBLES ============
  'meubles': {
    step2: ['title', 'description', 'etat', 'reference'], // ✅ Solo campos BASE
    step3: ['price', 'typeOffre', 'echange'],             // ✅ Solo campos BASE
    step4: ['wilaya', 'commune', 'telephone'],            // ✅ Solo campos BASE
    step5: ['images'],
    subCategories: {
      'salon': { step2: [], step3: [], step4: [] },
      'chambre': { step2: [], step3: [], step4: [] },
      'cuisine': { step2: [], step3: [], step4: [] },
      'bureau': { step2: [], step3: [], step4: [] }
    }
  },

  // ============ MATÉRIAUX ============
  'materiaux': {
    step2: ['title', 'description', 'etat', 'reference'], // ✅ Solo campos BASE
    step3: ['price', 'typeOffre', 'unite', 'quantite'],   // ✅ Solo campos BASE
    step4: ['wilaya', 'commune', 'telephone'],            // ✅ Solo campos BASE
    step5: ['images'],
    subCategories: {
      'construction': { step2: [], step3: [], step4: [] },
      'bois': { step2: [], step3: [], step4: [] },
      'metal': { step2: [], step3: [], step4: [] }
    }
  },

  // ============ SPORT ============
  'sport': {
    step2: ['title', 'description', 'etat', 'reference'], // ✅ Solo campos BASE
    step3: ['price', 'typeOffre', 'echange'],             // ✅ Solo campos BASE
    step4: ['wilaya', 'commune', 'telephone'],            // ✅ Solo campos BASE
    step5: ['images'],
    subCategories: {
      'football': { step2: [], step3: [], step4: [] },
      'fitness': { step2: [], step3: [], step4: [] },
      'velo': { step2: [], step3: [], step4: [] }
    }
  },

  // ============ VOYAGES ============
  'voyages': {
    step2: ['title', 'description', 'reference'],         // ✅ Solo campos BASE
    step3: ['price', 'typeOffre'],                        // ✅ Solo campos BASE
    step4: ['wilaya', 'commune', 'telephone', 'email'],   // ✅ Solo campos BASE
    step5: ['images'],
    subCategories: {
      'sejour': { step2: [], step3: [], step4: [] },
      'hajj_omra': { step2: [], step3: [], step4: [] },
      'visa': { step2: [], step3: [], step4: [] }
    }
  },

  // ============ EMPLOI ============
  'emploi': {
    step2: ['title', 'description', 'reference'],         // ✅ Solo campos BASE
    step3: ['salaire', 'typeContrat'],                    // ✅ Solo campos BASE
    step4: ['wilaya', 'commune', 'telephone', 'email'],   // ✅ Solo campos BASE
    step5: ['images'],
    subCategories: {
      'offres': { step2: [], step3: [], step4: [] },
      'demandes': { step2: [], step3: [], step4: [] }
    }
  },

  // ============ PIÈCES DÉTACHÉES ============
  'piecesDetachees': {
    step2: ['title', 'description', 'etat', 'reference'], // ✅ Solo campos BASE
    step3: ['price', 'typeOffre', 'echange'],             // ✅ Solo campos BASE
    step4: ['wilaya', 'commune', 'telephone'],            // ✅ Solo campos BASE
    step5: ['images'],
    subCategories: {
      'automobiles': { step2: [], step3: [], step4: [] },
      'moto': { step2: [], step3: [], step4: [] }
    }
  }
};

// ============ FUNCIONES UTILITARIAS ============

/**
 * Obtener campos para una categoría y step específico
 */
export const getFieldsForCategory = (mainCategory, subCategory = null, step = null) => {
  if (!mainCategory || !DYNAMIC_FIELDS_CONFIG[mainCategory]) {
    console.warn(`⚠️ Categoría no configurada: ${mainCategory}`);
    return step ? [] : { step2: [], step3: [], step4: [], step5: [] };
  }

  const config = DYNAMIC_FIELDS_CONFIG[mainCategory];
  
  // Prioridad: subcategoría > categoría principal
  let activeConfig = config;
  if (subCategory && config.subCategories?.[subCategory]) {
    activeConfig = config.subCategories[subCategory];
  }

  if (step) {
    const fields = activeConfig[`step${step}`] || config[`step${step}`] || [];
    return fields;
  }

  return {
    step2: activeConfig.step2 || config.step2 || [],
    step3: activeConfig.step3 || config.step3 || [],
    step4: activeConfig.step4 || config.step4 || [],
    step5: activeConfig.step5 || config.step5 || []
  };
};

/**
 * Verificar si categoría/subcategoría tiene configuración
 */
export const isCategoryConfigured = (mainCategory, subCategory = null) => {
  if (!DYNAMIC_FIELDS_CONFIG[mainCategory]) return false;
  if (subCategory) {
    return !!DYNAMIC_FIELDS_CONFIG[mainCategory].subCategories?.[subCategory];
  }
  return true;
};

/**
 * Obtener subcategorías disponibles
 */
export const getSubCategories = (mainCategory) => {
  return DYNAMIC_FIELDS_CONFIG[mainCategory]?.subCategories 
    ? Object.keys(DYNAMIC_FIELDS_CONFIG[mainCategory].subCategories)
    : [];
};