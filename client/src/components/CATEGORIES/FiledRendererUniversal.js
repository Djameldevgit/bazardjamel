// 📁 src/components/CATEGORIES/FieldRendererUniversal.js
import React from 'react';

// 🔥 IMPORTAR TODOS LOS COMPONENTES ESPECÍFICOS DE CATEGORÍA

 
import ImmobiliersFields from './specificFields/ImmobiliersFields';
 
import VetementsFields from './specificFields/VetementsFields';
import TelephonesFields from './specificFields/TelephonesFields';
import InformatiqueFields from './specificFields/InformatiqueFields';
import MateriauxFields from './specificFields/MateriauxFields';
import ElectromenagerFields from './specificFields/ElectromenagerFields';
import PieceDetacheFields from './specificFields/PiecesDetacheesFields';
import SanteBeauteFields from './specificFields/SanteBeauteFields';
import MuebleField from './specificFields/MeublesFields';
import LoisirsFields from './specificFields/LoisirsFields';
import SportFields from './specificFields/SportFields';
import AlimentairesFields from './specificFields/AlimentairesFields';
import ServicesField from './specificFields/ServicesFields';
import VoyagesFields from './specificFields/VoyagesFields';
import EmploiFields from './specificFields/EmploiFields';
import BoutiqueSelector from '../boutique/BoutiqueSelectorField';
import VehiculesFields from './specificFields/VehiculesFields';
 
 
// 🔥 MAPA DE CATEGORÍA → COMPONENTE
const CATEGORY_COMPONENTS = {
  'immobilier': ImmobiliersFields,
  'vehicules': VehiculesFields,
  'vetements': VetementsFields,
  'telephones': TelephonesFields,
  'informatique': InformatiqueFields,
  'electromenager': ElectromenagerFields,
  'piecesDetachees': PieceDetacheFields,
  'santebeaute': SanteBeauteFields,
  'meubles': MuebleField,
  'loisirs': LoisirsFields,
  'sport': SportFields,
  'alimentaires': AlimentairesFields,
  'services': ServicesField,
  'materiaux': MateriauxFields,
  'voyages': VoyagesFields,
  'emploi': EmploiFields,
  'boutiques': BoutiqueSelector

};


const FieldRendererUniversal = ({
  fieldName,
  mainCategory,
  subCategory,
  articleType,
  postData,
  handleChangeInput,
  isRTL,
  t
}) => {
  console.log('🎯 FieldRendererUniversal:', { fieldName, mainCategory, subCategory });
  
  // 1. PRIMERO intentar con BaseCategoryField (campos comunes)
  try {
    const baseField = BaseCategoryField({
      fieldName,
      mainCategory,
      subCategory,
      postData,
      handleChangeInput,
      isRTL,
      t
    });
    
    if (baseField) {
      console.log('✅ BaseCategoryField maneja:', fieldName);
      return baseField;
    }
  } catch (error) {
    console.log('⚠️ BaseCategoryField no pudo manejar:', fieldName, error);
  }
  
  // 2. SI NO ES CAMPO COMÚN, buscar componente específico
  const CategoryComponent = CATEGORY_COMPONENTS[mainCategory];
  
  if (!CategoryComponent) {
    console.error(`❌ No hay componente para: ${mainCategory}`);
    
    // Usar FieldFallback como último recurso
    return (
      <FieldFallback
        fieldName={fieldName}
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
      />
    );
  }
  
  // 3. Usar el componente específico de la categoría
  try {
    const specificField = CategoryComponent({
      fieldName,
      mainCategory,
      subCategory,
      articleType,
      postData,
      handleChangeInput,
      isRTL,
      t
    });
    
    if (specificField) {
      console.log('✅ Componente específico maneja:', fieldName);
      return specificField;
    }
    
    // 4. Si el componente específico no maneja este campo, usar FieldFallback
    console.log(`🔄 ${mainCategory} no maneja ${fieldName}, usando FieldFallback`);
    
    return (
      <FieldFallback
        fieldName={fieldName}
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
      />
    );
    
  } catch (error) {
    console.error(`❌ Error en ${mainCategory}:`, error);
    
    return (
      <FieldFallback
        fieldName={fieldName}
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
      />
    );
  }
};

export default FieldRendererUniversal;