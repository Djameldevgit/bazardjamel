// 📂 components/CATEGORIES/FieldConfig.js

export const DYNAMIC_FIELDS_CONFIG = {
  // ==================== 1. VEHICULES ====================
  'vehicules': {
    step2: [  'description', 'etat', 'reference'],
    step3: ['price', 'typeOffre', 'echange'],
    step4: ['wilaya', 'commune', 'telephone', 'email'],
    step5: ['images'],
    subCategories: {
      // Level 2: Tipos de vehículos
      'voitures': {
        step2: [  'marque', 'modele', 'annee', 'couleur', 'kilometrage', 'carburant', 'boiteVitesse'],
        step3: ['options', 'puissance'],
        step4: []
      },
      'utilitaire': {
        step2: ['marque', 'modele', 'annee', 'couleur', 'kilometrage', 'carburant', 'chargeUtile'],
        step3: ['options'],
        step4: []
      },
      'motos-scooters': {
        step2: ['marque', 'modele', 'annee', 'couleur', 'kilometrage', 'carburant', 'cylindree'],
        step3: ['options'],
        step4: []
      },
      'quads': {
        step2: ['marque', 'modele', 'annee', 'couleur', 'kilometrage', 'carburant'],
        step3: ['options'],
        step4: []
      },
      'fourgon': {
        step2: ['marque', 'modele', 'annee', 'couleur', 'kilometrage', 'carburant', 'volume'],
        step3: ['options'],
        step4: []
      },
      'camion': {
        step2: ['marque', 'modele', 'annee', 'couleur', 'kilometrage', 'carburant', 'poids'],
        step3: ['options'],
        step4: []
      },
      'bus': {
        step2: ['marque', 'modele', 'annee', 'couleur', 'kilometrage', 'carburant', 'places'],
        step3: ['options'],
        step4: []
      },
      'engin': {
        step2: ['marque', 'modele', 'annee', 'couleur', 'heures', 'typeEngin'],
        step3: ['options'],
        step4: []
      },
      'tracteurs': {
        step2: ['marque', 'modele', 'annee', 'couleur', 'heures', 'puissance'],
        step3: ['options'],
        step4: []
      },
      'remorques': {
        step2: ['marque', 'modele', 'annee', 'longueur', 'charge'],
        step3: ['options'],
        step4: []
      },
      'bateaux-barques': {
        step2: ['marque', 'modele', 'annee', 'longueur', 'moteur'],
        step3: ['options'],
        step4: []
      }
    }
  },

  // ==================== 2. VETEMENTS ====================
  'vetements': {
    step2: ['title', 'description', 'etat', 'reference'],
    step3: ['price', 'typeOffre', 'echange'],
    step4: ['wilaya', 'commune', 'telephone'],
    step5: ['images'],
    subCategories: {
      // Level 2: Categorías principales de ropa
      'vetements-homme': {
        step2: ['marque', 'taille', 'couleur', 'matiere'],
        step3: [],
        step4: [],
        articleTypes: {
          // Level 3: Tipos específicos de ropa hombre
          'hauts-chemises': { step2: ['typeCoupe', 'col'] },
          'jeans-pantalons': { step2: ['coupe', 'longueur'] },
          'costumes-blazers': { step2: ['coupe', 'tailleVeste', 'taillePantalon'] },
          'survetements': { step2: ['ensemble', 'taille'] },
          'kamiss': { step2: ['tissu', 'longueur'] },
          'sous-vetements': { step2: ['type', 'lot'] }
        }
      },
      'vetements-femme': {
        step2: ['marque', 'taille', 'couleur', 'matiere'],
        step3: [],
        step4: [],
        articleTypes: {
          'robes': { step2: ['longueur', 'coupe'] },
          'abayas-hijabs': { step2: ['tissu', 'style'] },
          'jupes': { step2: ['longueur', 'coupe'] }
        }
      },
      'chaussures-homme': {
        step2: ['marque', 'pointure', 'couleur', 'matiere'],
        step3: [],
        step4: []
      },
      'chaussures-femme': {
        step2: ['marque', 'pointure', 'couleur', 'hauteurTalon'],
        step3: [],
        step4: []
      },
      'garcons': {
        step2: ['marque', 'taille', 'age', 'couleur'],
        step3: [],
        step4: []
      },
      'filles': {
        step2: ['marque', 'taille', 'age', 'couleur'],
        step3: [],
        step4: []
      },
      'bebe': {
        step2: ['marque', 'taille', 'ageMois', 'couleur'],
        step3: [],
        step4: []
      },
      'sacs-valises': {
        step2: ['marque', 'type', 'couleur', 'matiere'],
        step3: [],
        step4: []
      },
      'montres': {
        step2: ['marque', 'type', 'couleur', 'materiauBracelet'],
        step3: [],
        step4: []
      },
      'lunettes': {
        step2: ['marque', 'type', 'couleur', 'protection'],
        step3: [],
        step4: []
      },
      'bijoux': {
        step2: ['marque', 'type', 'materiau', 'pierres'],
        step3: [],
        step4: []
      }
    }
  },

  // ==================== 3. ELECTROMENAGER ====================
  'electromenager': {
    step2: ['title', 'description', 'etat', 'reference'],
    step3: ['price', 'typeOffre', 'echange'],
    step4: ['wilaya', 'commune', 'telephone'],
    step5: ['images'],
    subCategories: {
      'refrigerateurs-congelateurs': {
        step2: ['marque', 'modele', 'capacite', 'classeEnergetique'],
        step3: ['garantie'],
        step4: []
      },
      'machines-laver': {
        step2: ['marque', 'modele', 'capacite', 'classeEnergetique'],
        step3: ['garantie', 'programmes'],
        step4: []
      },
      'lave-vaisselles': {
        step2: ['marque', 'modele', 'capacite', 'classeEnergetique'],
        step3: ['garantie'],
        step4: []
      },
      'fours-cuisson': {
        step2: ['marque', 'modele', 'typeFour', 'capacite'],
        step3: ['garantie'],
        step4: []
      },
      'chauffage-climatisation': {
        step2: ['marque', 'modele', 'puissance', 'typeClimatisation'],
        step3: ['garantie'],
        step4: []
      },
      'televiseurs': {
        step2: ['marque', 'modele', 'taille', 'resolution', 'smartTV'],
        step3: ['garantie'],
        step4: []
      },
      'aspirateurs-nettoyeurs': {
        step2: ['marque', 'modele', 'puissance', 'typeAspirateur'],
        step3: ['garantie'],
        step4: []
      },
      'repassage': {
        step2: ['marque', 'modele', 'puissance', 'typeRepassage'],
        step3: ['garantie'],
        step4: []
      },
      'beaute-hygiene': {
        step2: ['marque', 'modele', 'typeAppareil'],
        step3: ['garantie'],
        step4: []
      }
    }
  },

  // ==================== 4. IMMOBILIER ====================
  'immobilier': {
    step2: ['title', 'description', 'etat', 'reference'],
    step3: ['price', 'typeOffre', 'echange'],
    step4: ['wilaya', 'commune', 'telephone', 'email', 'quartier'],
    step5: ['images'],
    subCategories: {
      'vente': {
        step2: [],
        step3: [],
        step4: [],
        articleTypes: {
          'appartement': { step2: ['surface', 'chambres', 'sallesBain', 'etage', 'ascenseur'] },
          'villa': { step2: ['surface', 'chambres', 'sallesBain', 'jardin', 'piscine'] },
          'terrain': { step2: ['surface', 'typeTerrain', 'viabilise'] },  // ← Sin etage, sin chambres
          'local': { step2: ['surface', 'typeLocal', 'vitrine'] },
          'immeuble': { step2: ['surface', 'etages', 'appartements'] },
          'bungalow': { step2: ['surface', 'chambres'] },
          'terrain-agricole': { step2: ['surface', 'typeCulture', 'irrigation'] }
        }
      },
      'location': {
        step2: [],
        step3: ['loyer', 'charges'],
        step4: [],
        articleTypes: {
          'appartement-location': { step2: ['surface', 'chambres', 'sallesBain', 'etage', 'meuble'] },
          'villa-location': { step2: ['surface', 'chambres', 'sallesBain', 'jardin', 'meuble'] },
          'local-location': { step2: ['surface', 'typeLocal'] }
        }
      },
      'location-vacances': {
        step2: [],
        step3: ['prixNuit', 'disponibilite'],
        step4: [],
        articleTypes: {
          'appartement-vacances': { step2: ['surface', 'chambres', 'equipements'] },
          'villa-vacances': { step2: ['surface', 'chambres', 'piscine', 'jardin'] }
        }
      }
    }
  },

  // ==================== 5. ALIMENTAIRES ====================
  'alimentaires': {
    step2: ['title', 'description', 'reference'],
    step3: ['price', 'typeOffre', 'unite', 'quantite'],
    step4: ['wilaya', 'commune', 'telephone'],
    step5: ['images'],
    subCategories: {
      'fruits-legumes': {
        step2: ['typeProduit', 'origine', 'saison'],
        step3: ['prixKg', 'quantite'],
        step4: []
      },
      'produits-laitiers': {
        step2: ['typeProduit', 'marque', 'datePeremption'],
        step3: ['quantite'],
        step4: []
      },
      'viandes-poissons': {
        step2: ['typeViande', 'origine', 'poids'],
        step3: ['prixKg', 'quantite'],
        step4: []
      },
      'boissons': {
        step2: ['typeBoisson', 'marque', 'contenance'],
        step3: ['quantite'],
        step4: []
      }
    }
  },

  // ==================== 6. INFORMATIQUE ====================
  'informatique': {
    step2: ['title', 'description', 'etat', 'reference'],
    step3: ['price', 'typeOffre', 'echange'],
    step4: ['wilaya', 'commune', 'telephone'],
    step5: ['images'],
    subCategories: {
      'ordinateurs-portables': {
        step2: ['marque', 'modele', 'processeur', 'ram', 'stockage', 'tailleEcran'],
        step3: ['garantie'],
        step4: []
      },
      'ordinateurs-bureau': {
        step2: ['marque', 'modele', 'processeur', 'ram', 'stockage'],
        step3: ['garantie'],
        step4: []
      },
      'composants-pc-fixe': {
        step2: ['marque', 'modele', 'typeComposant', 'specifications'],
        step3: ['garantie'],
        step4: []
      }
    }
  },

  // ==================== 7. LOISIRS ====================
  'loisirs': {
    step2: ['title', 'description', 'etat', 'reference'],
    step3: ['price', 'typeOffre', 'echange'],
    step4: ['wilaya', 'commune', 'telephone'],
    step5: ['images'],
    subCategories: {
      'consoles-jeux-videos': {
        step2: ['marque', 'modele', 'typeConsole', 'jeuxInclus'],
        step3: [],
        step4: []
      },
      'instruments-musique': {
        step2: ['marque', 'modele', 'typeInstrument', 'materiau'],
        step3: [],
        step4: []
      },
      'livres-magazines': {
        step2: ['titre', 'auteur', 'editeur', 'genre', 'langue'],
        step3: [],
        step4: []
      },
      'jouets': {
        step2: ['marque', 'typeJouet', 'ageRecommandé', 'materiau'],
        step3: [],
        step4: []
      }
    }
  },

  // ==================== 8. MATERIAUX ====================
  'materiaux': {
    step2: ['title', 'description', 'etat', 'reference'],
    step3: ['price', 'typeOffre', 'unite', 'quantite'],
    step4: ['wilaya', 'commune', 'telephone'],
    step5: ['images'],
    subCategories: {
      'materiaux-construction': {
        step2: ['typeMateriau', 'dimensions', 'resistance'],
        step3: ['quantite'],
        step4: []
      },
      'outillage-professionnel': {
        step2: ['marque', 'typeOutil', 'puissance'],
        step3: ['garantie'],
        step4: []
      }
    }
  },

  // ==================== 9. MEUBLES ====================
  'meubles': {
    step2: ['title', 'description', 'etat', 'reference'],
    step3: ['price', 'typeOffre', 'echange'],
    step4: ['wilaya', 'commune', 'telephone'],
    step5: ['images'],
    subCategories: {
      'salon': {
        step2: ['typeMeuble', 'matiere', 'dimensions', 'couleur'],
        step3: [],
        step4: []
      },
      'chambres-coucher': {
        step2: ['typeMeuble', 'matiere', 'dimensions'],
        step3: [],
        step4: []
      },
      'bureau': {
        step2: ['typeMeuble', 'matiere', 'dimensions', 'ergonomie'],
        step3: [],
        step4: []
      }
    }
  },

  // ==================== 10. SPORT ====================
  'sport': {
    step2: ['title', 'description', 'etat', 'reference'],
    step3: ['price', 'typeOffre', 'echange'],
    step4: ['wilaya', 'commune', 'telephone'],
    step5: ['images'],
    subCategories: {
      'football': {
        step2: ['marque', 'typeEquipement', 'taille', 'couleur'],
        step3: [],
        step4: []
      },
      'fitness-musculation': {
        step2: ['marque', 'typeEquipement', 'poids', 'dimensions'],
        step3: [],
        step4: []
      },
      'velos-trotinettes': {
        step2: ['marque', 'modele', 'tailleRoue', 'vitesses', 'couleur'],
        step3: [],
        step4: []
      }
    }
  },

  // ==================== 11. TELEPHONE ====================
  'telephone': {
    step2: ['title', 'description', 'etat', 'reference'],
    step3: ['price', 'typeOffre', 'echange'],
    step4: ['wilaya', 'commune', 'telephone'],
    step5: ['images'],
    subCategories: {
      'smartphones': {
        step2: ['marque', 'modele', 'couleur', 'capaciteStockage', 'ram'],
        step3: ['garantie', 'camera'],
        step4: []
      },
      'tablettes': {
        step2: ['marque', 'modele', 'couleur', 'capaciteStockage', 'tailleEcran'],
        step3: ['garantie'],
        step4: []
      },
      'accessoires-telephone': {
        step2: ['typeAccessoire', 'marque', 'modele', 'couleur'],
        step3: ['quantite'],
        step4: []
      }
    }
  },

  // ==================== 12. SERVICES ====================
  'services': {
    step2: ['title', 'description', 'reference'],
    step3: ['price', 'typeOffre'],
    step4: ['wilaya', 'commune', 'telephone', 'email'],
    step5: ['images'],
    subCategories: {
      'construction-travaux': {
        step2: ['typeTravaux', 'surface', 'duree'],
        step3: [],
        step4: []
      },
      'reparation-auto-diagnostic': {
        step2: ['typeReparation', 'marque', 'probleme'],
        step3: ['delai'],
        step4: []
      }
    }
  },

  // ==================== 13. SANTE & BEAUTE ====================
  'santebeaute': {
    step2: ['title', 'description', 'etat', 'reference'],
    step3: ['price', 'typeOffre', 'quantite'],
    step4: ['wilaya', 'commune', 'telephone'],
    step5: ['images'],
    subCategories: {
      'cosmetiques-beaute': {
        step2: ['marque', 'typeCosmetique', 'typePeau'],
        step3: ['quantite'],
        step4: []
      },
      'parfums-deodorants': {
        step2: ['marque', 'typeParfum', 'familleOlfactive'],
        step3: ['quantite'],
        step4: []
      }
    }
  },

  // ==================== 14. EMPLOI ====================
  'emploi': {
    step2: ['title', 'description', 'reference'],
    step3: ['salaire', 'typeContrat'],
    step4: ['wilaya', 'commune', 'telephone', 'email'],
    step5: ['images'],
    subCategories: {
      'offres-emploi': {
        step2: ['poste', 'secteur', 'experienceRequise', 'competences'],
        step3: ['avantages', 'teletravail'],
        step4: ['nomSociete']
      },
      'demandes-emploi': {
        step2: ['posteRecherche', 'secteur', 'experience', 'competences'],
        step3: ['salaireSouhaite', 'mobilite'],
        step4: []
      }
    }
  },

  // ==================== 15. VOYAGES ====================
  'voyages': {
    step2: ['title', 'description', 'reference'],
    step3: ['price', 'typeOffre'],
    step4: ['wilaya', 'commune', 'telephone', 'email'],
    step5: ['images'],
    subCategories: {
      'voyage-organise': {
        step2: ['destination', 'duree', 'transport', 'hotel'],
        step3: ['inclusions'],
        step4: []
      },
      'hajj-omra': {
        step2: ['typePelerinage', 'duree', 'transport', 'hotel'],
        step3: ['guide'],
        step4: []
      }
    }
  },

  // ==================== 16. PIECES DETACHEES ====================
  'pieces-detachees': {
    step2: ['title', 'description', 'etat', 'reference'],
    step3: ['price', 'typeOffre', 'echange'],
    step4: ['wilaya', 'commune', 'telephone'],
    step5: ['images'],
    subCategories: {
      'pieces-automobiles': {
        step2: ['marque', 'modele', 'typePiece', 'compatibilite'],
        step3: ['garantie'],
        step4: []
      },
      'pieces-moto': {
        step2: ['marque', 'modele', 'typePiece', 'compatibilite'],
        step3: ['garantie'],
        step4: []
      }
    }
  },

  // ==================== 17. BOUTIQUES ====================
  'boutiques': {
    step2: ['title', 'description', 'reference'],
    step3: ['price', 'typeOffre'],
    step4: ['wilaya', 'commune', 'telephone', 'email'],
    step5: ['images'],
    subCategories: {
      'agences-immobilieres': {
        step2: ['nomAgence', 'specialite', 'experience'],
        step3: [],
        step4: []
      },
      'showroom-automobiles': {
        step2: ['nomShowroom', 'marques', 'services'],
        step3: [],
        step4: []
      },
      'magasin-electromenager': {
        step2: ['nomMagasin', 'marques', 'garantie'],
        step3: [],
        step4: []
      }
    }
  }
};

// ============ FUNCIONES UTILITARIAS ACTUALIZADAS ============

/**
 * Obtener campos para una categoría considerando nivel 2 y nivel 3
 * @param {string} mainCategory - Categoría principal (vehicules, vetements, etc.)
 * @param {string} subCategory - Subcategoría (level2)
 * @param {string} articleType - Artículo (level3)
 * @param {number} step - Step actual (2, 3, 4)
 */
export const getFieldsForCategory = (mainCategory, subCategory = null, step = null, articleType = null) => {
  if (!mainCategory || !DYNAMIC_FIELDS_CONFIG[mainCategory]) {
    console.warn(`⚠️ Categoría no configurada: ${mainCategory}`);
    return step ? [] : { step2: [], step3: [], step4: [], step5: [] };
  }

  const config = DYNAMIC_FIELDS_CONFIG[mainCategory];
  
  // Nivel 1: Configuración base de la categoría
  let activeConfig = { ...config };
  
  // Nivel 2: Buscar en subCategories
  if (subCategory && config.subCategories?.[subCategory]) {
    activeConfig = { ...activeConfig, ...config.subCategories[subCategory] };
    
    // Nivel 3: Buscar en articleTypes
    if (articleType && activeConfig.articleTypes?.[articleType]) {
      activeConfig = { ...activeConfig, ...activeConfig.articleTypes[articleType] };
    }
  }

  if (step) {
    const stepKey = `step${step}`;
    // Combinar campos base + campos del nivel actual
    const baseFields = config[stepKey] || [];
    const levelFields = activeConfig[stepKey] || [];
    
    // Unir y eliminar duplicados
    const allFields = [...new Set([...baseFields, ...levelFields])];
    
    console.log(`📋 [${mainCategory}/${subCategory}/${articleType}] Step ${step}:`, allFields);
    return allFields;
  }

  return {
    step2: [...(config.step2 || []), ...(activeConfig.step2 || [])],
    step3: [...(config.step3 || []), ...(activeConfig.step3 || [])],
    step4: [...(config.step4 || []), ...(activeConfig.step4 || [])],
    step5: config.step5 || []
  };
};

export const isCategoryConfigured = (mainCategory, subCategory = null) => {
  if (!DYNAMIC_FIELDS_CONFIG[mainCategory]) return false;
  if (subCategory) {
    return !!DYNAMIC_FIELDS_CONFIG[mainCategory].subCategories?.[subCategory];
  }
  return true;
};

export const getSubCategories = (mainCategory) => {
  return DYNAMIC_FIELDS_CONFIG[mainCategory]?.subCategories 
    ? Object.keys(DYNAMIC_FIELDS_CONFIG[mainCategory].subCategories)
    : [];
};

export const getArticleTypes = (mainCategory, subCategory) => {
  return DYNAMIC_FIELDS_CONFIG[mainCategory]?.subCategories?.[subCategory]?.articleTypes
    ? Object.keys(DYNAMIC_FIELDS_CONFIG[mainCategory].subCategories[subCategory].articleTypes)
    : [];
};