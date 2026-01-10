// 📁 src/components/CATEGORIES/FieldRendererUniversal.js
import React from 'react';

// 🔥 IMPORTAR TODOS LOS COMPONENTES ESPECÍFICOS DE CATEGORÍA

 
import ImmobiliersFields from './specificFields/ImmobiliersFields';
import VehiculesFields from './specificFields/VehiculesFields';
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
  console.log('🔍 FieldRendererUniversal:', {
    fieldName,
    mainCategory,
    subCategory
  });

  // 1. Validar parámetros
  if (!fieldName || !mainCategory) {
    console.warn('⚠️ Parámetros inválidos para FieldRendererUniversal');
    return null; // ⚠️ IMPORTANTE: Retornar null, no un div vacío
  }

  // 2. Buscar componente de categoría
  const CategoryComponent = CATEGORY_COMPONENTS[mainCategory];
  
  if (!CategoryComponent) {
    console.error(`❌ No hay componente para la categoría: ${mainCategory}`);
    return null; // ⚠️ Retornar null, no alerta
  }

  // 3. Renderizar el componente de categoría - ÉL manejará el campo específico
  try {
    return (
      <CategoryComponent
        fieldName={fieldName} // Pasar el fieldName específico
        mainCategory={mainCategory}
        subCategory={subCategory}
        articleType={articleType}
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
      />
    );
  } catch (error) {
    console.error(`❌ Error en FieldRendererUniversal:`, error);
    return null; // ⚠️ Retornar null en caso de error
  }
};

// Propiedades por defecto
FieldRendererUniversal.defaultProps = {
  fieldName: '',
  mainCategory: null,
  subCategory: null,
  articleType: null,
  postData: {},
  handleChangeInput: () => {},
  isRTL: false,
  t: null
};

export default FieldRendererUniversal;