// 📁 src/components/CATEGORIES/FieldConfig.js

// 🔥 CONFIGURACIÓN DINÁMICA DE CAMPOS POR CATEGORÍA
export const DYNAMIC_FIELDS_CONFIG = {
  // ============ ALIMENTAIRES ============
  'alimentaires': {step2: ['title','description','etat','reference','typeAliment','conditionnement','datePeremption'],step3: ['price','unite','typeOffre','echange','quantite','uniteMesure'],step4: ['wilaya','commune','adresse','telephone','email'],step5: ['images']},
  
  // ============ VEHICULES ============
  'vehicules': {
    step2: [ 'title','description','etat','reference','marque','modele','annee','kilometrage','carburant','boiteVitesse'],
    step3: ['price','unite','typeOffre','echange','puissance','couleur','options'],
    step4: ['wilaya','commune','adresse','telephone','email'],
    step5: ['images']
  },
  // ============ TELEPHONES ============
  'telephones': {step2: ['description','etat','reference','marque','modele','couleur','garantie','accessoires'],step3: ['price','unite','typeOffre','echange','capaciteStockage','ram','systemeExploitation','reseau','camera','batterie'],step4: ['wilaya','commune','adresse','telephone','email'],step5: ['images'],subCategories:{'smartphones':{step2:['title','description','etat','reference','marque','modele','couleur','garantie','accessoires'],step3:['price','unite','typeOffre','echange','capaciteStockage','ram','systemeExploitation','reseau','camera','batterie','ecran'],step4:['wilaya','commune','adresse','telephone','email'],step5:['images']},'tablettes':{step2:['title','description','etat','reference','marque','modele','couleur','tailleEcran'],step3:['price','unite','typeOffre','echange','capaciteStockage','ram','systemeExploitation','batterie'],step4:['wilaya','commune','adresse','telephone','email'],step5:['images']},'telephones_cellulaires':{step2:['title','description','etat','reference','marque','modele','couleur'],step3:['price','unite','typeOffre','echange','reseau','batterie'],step4:['wilaya','commune','adresse','telephone','email'],step5:['images']},'smartwatchs':{step2:['title','description','etat','reference','marque','modele','couleur'],step3:['price','unite','typeOffre','echange','systemeExploitation','batterie','taille'],step4:['wilaya','commune','adresse','telephone','email'],step5:['images']},'accessoires_telephones':{step2:['title','description','etat','reference','marque','modele','couleur'],step3:['price','unite','typeOffre','echange','typeAccessoire','quantite'],step4:['wilaya','commune','adresse','telephone','email'],step5:['images']},'telephones_fixes':{step2:['title','description','etat','reference','marque','modele','couleur'],step3:['price','unite','typeOffre','echange','typeFix'],step4:['wilaya','commune','adresse','telephone','email'],step5:['images']}}},
  
  // ============ INFORMATIQUE ============
  'informatique': {step2: ['title','description','etat','reference','typeProduit','marque','modele','processeur','carteGraphique'],step3: ['price','unite','typeOffre','echange','ram','stockage','systemeExploitation','garantie'],step4: ['wilaya','commune','adresse','telephone','email'],step5: ['images']},
  
  // ============ IMMOBILIER ============
  'immobilier': {step2: ['title','description','etat','reference','typeImmobilier','operationType','surface','chambres','sallesBain'],step3: ['price','unite','typeOffre','echange','loyer','charges','etage','meuble'],step4: ['wilaya','commune','adresse','telephone','email','quartier','proximiteTransport','parking'],step5: ['images']},
  
  // ============ ÉLECTROMÉNAGER ============
  'electromenager': {step2: ['title','description','etat','reference','marque','modele','typeAppareil','classeEnergetique'],step3: ['price','unite','typeOffre','echange','anneeFabrication','garantie','consommation'],step4: ['wilaya','commune','adresse','telephone','email'],step5: ['images']},
  
  // ============ VÊTEMENTS ============
  'vetements': {step2: ['title','description','etat','reference','typeVetement','marque','modele','matiere','sexe'],step3: ['price','unite','typeOffre','echange','pointure','couleur','saison'],step4: ['wilaya','commune','adresse','telephone','email'],step5: ['images']},
  
  // ============ SANTÉ & BEAUTÉ ============
  'santebeaute': {step2: ['title','description','etat','reference','typeProduit','marque','modele','datePeremption'],step3: ['price','unite','typeOffre','echange','contenance','typePeau','composition'],step4: ['wilaya','commune','adresse','telephone','email'],step5: ['images']},
  
  // ============ MEUBLES ============
  'meubles': {step2: ['title','description','etat','reference','typeMeuble','marque','modele','materiau','style'],step3: ['price','unite','typeOffre','echange','dimensions','couleur','etatGeneral'],step4: ['wilaya','commune','adresse','telephone','email'],step5: ['images']},
  
  // ============ LOISIRS ============
  'loisirs': {step2: ['title','description','etat','reference','typeProduit','marque','modele','ageCible'],step3: ['price','unite','typeOffre','echange','piecesIncluses','etatComplet','accessoires'],step4: ['wilaya','commune','adresse','telephone','email'],step5: ['images']},
  
  // ============ SPORT ============
  'sport': {step2: ['title','description','etat','reference','typeEquipement','marque','modele','niveau'],step3: ['price','unite','typeOffre','echange','taille','couleur','materiau'],step4: ['wilaya','commune','adresse','telephone','email'],step5: ['images']},
  
  // ============ SERVICES ============
  'services': {step2: ['title','description','etat','reference','typeService','descriptionDetaillee','experience'],step3: ['price','unite','typeOffre','echange','duree','zoneIntervention','disponibilite'],step4: ['wilaya','commune','adresse','telephone','email'],step5: ['images']},
  
  // ============ MATÉRIAUX ============
  'materiaux': {step2: ['title','description','etat','reference','typeMateriau','marque','modele','qualite'],step3: ['price','unite','typeOffre','echange','quantite','uniteMesure','conditionnement'],step4: ['wilaya','commune','adresse','telephone','email'],step5: ['images']},
  
  // ============ VOYAGES ============
  'voyages': {step2: ['title','description','etat','reference','typeVoyage','destination','duree'],step3: ['price','unite','typeOffre','echange','dateDepart','servicesInclus','transport'],step4: ['wilaya','commune','adresse','telephone','email'],step5: ['images']},
  
  // ============ EMPLOI ============
  'emploi': {step2: ['title','description','etat','reference','typeContrat','poste','secteur','niveauExperience'],step3: ['price','unite','typeOffre','echange','salaire','avantages','formationRequise'],step4: ['wilaya','commune','adresse','telephone','email'],step5: ['images']},
  
  // ============ PIÈCES DÉTACHÉES ============
  'pieces_detachees': {step2: ['title','description','etat','reference','typePiece','marque','modele','compatibleAvec'],step3: ['price','unite','typeOffre','echange','etatDetaille','garantie','referenceOEM'],step4: ['wilaya','commune','adresse','telephone','email'],step5: ['images']},
  
  // ============ BOUTIQUES ============
  'boutiques': {step2: ['title','description','etat','reference','nomBoutique','secteurActivite','surface'],step3: ['price','unite','typeOffre','echange','loyer','charges','bail'],step4: ['wilaya','commune','adresse','telephone','email','horaires','equipements','clientele'],step5: ['images']}
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