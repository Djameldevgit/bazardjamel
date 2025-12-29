// 📁 src/components/CATEGORIES/FieldConfig.js

// 🔥 CONFIGURACIÓN DINÁMICA DE CAMPOS POR CATEGORÍA
export const DYNAMIC_FIELDS_CONFIG = {
  // ============ ALIMENTAIRES ============
  'alimentaires': {
    step2: ['title', 'reference', 'description'], // Campos para Step 2
    step3: ['price', 'etat', 'quantite', 'conditionnement'], // Campos para Step 3
    step4: ['telephone', 'adresse', 'livraison'] // Campos para Step 4
  },
  
  // ============ VEHICULES ============
  'vehicules': {
    step2: ['marque', 'modele', 'description', 'annee'], // Campos para Step 2
    step3: ['price', 'etat', 'kilometrage', 'carburant'], // Campos para Step 3
    step4: ['telephone', 'adresse', 'wilaya'] // Campos para Step 4
  },
  
  // ============ TELEPHONES ============
  'telephones': {
    step2: ['marque', 'modele', 'description', 'etat'], // Campos para Step 2
    step3: ['price', 'ram', 'stockage', 'garantie'], // Campos para Step 3
    step4: ['telephone', 'adresse', 'commune'] // Campos para Step 4
  },
  
  // ============ INFORMATIQUE ============
  'informatique': {
    step2: ['typeProduit', 'marque', 'modele', 'description'],
    step3: ['price', 'etat', 'ram', 'stockage'],
    step4: ['telephone', 'adresse', 'email']
  },
  
  // ============ IMMOBILIER ============
  'immobilier': {
    step2: ['typeImmobilier', 'description', 'superficie'], // Campos para Step 2
    step3: ['price', 'loyer', 'etat', 'charges'], // Campos para Step 3 (price o loyer según articleType)
    step4: ['telephone', 'adresse', 'wilaya', 'commune'] // Campos para Step 4
  },
  
  // ============ ÉLECTROMÉNAGER ============
  'electromenager': {
    step2: ['marque', 'modele', 'description', 'typeAppareil'], // Campos para Step 2
    step3: ['price', 'etat', 'garantie', 'anneeFabrication'], // Campos para Step 3
    step4: ['telephone', 'adresse', 'ville'] // Campos para Step 4
  },
  
  // ============ VÊTEMENTS ============
  'vetements': {
    step2: ['typeVetement', 'marque', 'modele', 'description'], // Campos para Step 2
    step3: ['price', 'etat', 'taille', 'couleur'], // Campos para Step 3
    step4: ['telephone', 'adresse', 'pointure'] // Campos para Step 4
  },
  
  // ============ SANTÉ & BEAUTÉ ============
  'santebeaute': {
    step2: ['typeProduit', 'marque', 'modele', 'description'], // Campos para Step 2
    step3: ['price', 'etat', 'datePeremption', 'contenance'], // Campos para Step 3
    step4: ['telephone', 'adresse', 'email'] // Campos para Step 4
  },
  
  // ============ MEUBLES ============
  'meubles': {
    step2: ['typeMeuble', 'marque', 'modele', 'description'], // Campos para Step 2
    step3: ['price', 'etat', 'materiau', 'dimensions'], // Campos para Step 3
    step4: ['telephone', 'adresse', 'ville'] // Campos para Step 4
  },
  
  // ============ LOISIRS ============
  'loisirs': {
    step2: ['typeProduit', 'marque', 'modele', 'description'], // Campos para Step 2
    step3: ['price', 'etat', 'ageCible', 'condition'], // Campos para Step 3
    step4: ['telephone', 'adresse', 'localisation'] // Campos para Step 4
  },
  
  // ============ SPORT ============
  'sport': {
    step2: ['typeEquipement', 'marque', 'modele', 'description'], // Campos para Step 2
    step3: ['price', 'etat', 'taille', 'couleur'], // Campos para Step 3
    step4: ['telephone', 'adresse', 'wilaya'] // Campos para Step 4
  },
  
  // ============ SERVICES ============
  'services': {
    step2: ['typeService', 'description', 'experience'], // Campos para Step 2
    step3: ['price', 'duree', 'garantie', 'zoneIntervention'], // Campos para Step 3
    step4: ['telephone', 'adresse', 'email', 'siteWeb'] // Campos para Step 4
  },
  
  // ============ MATÉRIAUX ============
  'materiaux': {
    step2: ['typeMateriau', 'marque', 'modele', 'description'], // Campos para Step 2
    step3: ['price', 'etat', 'quantite', 'unite'], // Campos para Step 3
    step4: ['telephone', 'adresse', 'ville'] // Campos para Step 4
  },
  
  // ============ VOYAGES ============
  'voyages': {
    step2: ['typeVoyage', 'description', 'destination'], // Campos para Step 2
    step3: ['price', 'duree', 'dateDepart', 'servicesInclus'], // Campos para Step 3
    step4: ['telephone', 'adresse', 'agence'] // Campos para Step 4
  },
  
  // ============ EMPLOI ============
  'emploi': {
    step2: ['typeContrat', 'poste', 'description', 'secteur'], // Campos para Step 2
    step3: ['salaire', 'experienceRequise', 'formation', 'avantages'], // Campos para Step 3
    step4: ['telephone', 'email', 'entreprise', 'adresse'] // Campos para Step 4
  },
  
  // ============ PIÈCES DÉTACHÉES ============
  'pieces_detachees': {
    step2: ['typePiece', 'marque', 'modele', 'description'], // Campos para Step 2
    step3: ['price', 'etat', 'compatibleAvec', 'garantie'], // Campos para Step 3
    step4: ['telephone', 'adresse', 'ville'] // Campos para Step 4
  },
  
  // ============ BOUTIQUES ============
  'boutiques': {
    step2: ['nomBoutique', 'description', 'secteurActivite'], // Campos para Step 2
    step3: ['loyer', 'surface', 'etat', 'equipements'], // Campos para Step 3
    step4: ['telephone', 'adresse', 'ville', 'horaires'] // Campos para Step 4
  }

  // ✅ AQUÍ AÑADES MÁS CATEGORÍAS CUANDO LAS NECESITES
  // 'nouvelle_categorie': {...},
};

// 🔥 FUNCIÓN SIMPLE PARA OBTENER CAMPOS
export const getFieldsForStep = (mainCategory, stepNumber) => {
  console.log('🔍 FieldConfig - Buscando campos:', { mainCategory, stepNumber });
  
  if (!mainCategory) {
    console.log('⚠️ No hay categoría seleccionada');
    return [];
  }
  
  if (!DYNAMIC_FIELDS_CONFIG[mainCategory]) {
    console.log(`❌ Categoría "${mainCategory}" no configurada en FieldConfig.js`);
    console.log(`💡 Añádela en DYNAMIC_FIELDS_CONFIG['${mainCategory}'] = {...}`);
    return [];
  }
  
  const stepKey = `step${stepNumber}`;
  const fields = DYNAMIC_FIELDS_CONFIG[mainCategory][stepKey] || [];
  
  console.log(`✅ Campos para ${mainCategory} → ${stepKey}:`, fields);
  return fields;
};

// 🔥 FUNCIÓN PARA VERIFICAR SI UNA CATEGORÍA ESTÁ CONFIGURADA
export const isCategoryConfigured = (mainCategory) => {
  return !!DYNAMIC_FIELDS_CONFIG[mainCategory];
};

// 🔥 FUNCIÓN PARA OBTENER TODAS LAS CATEGORÍAS CONFIGURADAS
export const getConfiguredCategories = () => {
  return Object.keys(DYNAMIC_FIELDS_CONFIG);
};