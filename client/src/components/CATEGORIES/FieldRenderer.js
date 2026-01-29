// 📁 src/components/CATEGORIES/FieldRenderer.js - VERSIÓN SIMPLIFICADA
import React from 'react';

// 🔥 IMPORTAR SOLO LOS COMPONENTES QUE REALMENTE USAS
import ImmobiliersFields from './specificFields/ImmobiliersFields';
import VehiculesFields from './specificFields/VehiculesFields';
import VetementsFields from './specificFields/VetementsFields';
import TelephonesFields from './specificFields/TelephonesFields';
import InformatiqueFields from './specificFields/InformatiqueFields';
import MateriauxFields from './specificFields/MateriauxFields';
import ElectromenagerFields from './specificFields/ElectromenagerFields';
import PieceDetache from './specificFields/PiecesDetacheesFields';
import SanteBeauteFields from './specificFields/SanteBeauteFields';
import MuebleField from './specificFields/MeublesFields';
import LoisirsFields from './specificFields/LoisirsFields';
import SportFields from './specificFields/SportFields';
import AlimentairesFields from './specificFields/AlimentairesFields';
import ServicesFields from './specificFields/ServicesFields';
import VoyagesFields from './specificFields/VoyagesFields';
import EmploiFields from './specificFields/EmploiFields';
import BoutiquesField from './specificFields/BoutiquesField';

// 🔥 MAPA SIMPLIFICADO
const CATEGORY_COMPONENTS = {
  'immobilier': ImmobiliersFields,
  'vehicules': VehiculesFields,
  'vetements': VetementsFields,
  'telephones': TelephonesFields,
  'informatique': InformatiqueFields,
  'electromenager': ElectromenagerFields,
  'pieces_detachees': PieceDetache,
  'santebeaute': SanteBeauteFields,
  'meubles': MuebleField,
  'loisirs': LoisirsFields,
  'sport': SportFields,
  'alimentaires': AlimentairesFields,
  'services': ServicesFields,
  'materiaux': MateriauxFields,
  'voyages': VoyagesFields,
  'emploi': EmploiFields,
  'boutiques': BoutiquesField
};

// 🔥 COMPONENTE PRINCIPAL SIMPLIFICADO
const FieldRenderer = ({
  fieldName,
  mainCategory,
  subCategory,
  articleType,
  postData,
  handleChangeInput,
  isRTL,
  t,
  step // Agregar step si lo usas
}) => {
  
  // 1. Obtener el componente específico de la categoría
  const CategoryComponent = CATEGORY_COMPONENTS[mainCategory];
  
  if (!CategoryComponent) {
    console.warn(`⚠️ No hay componente para: ${mainCategory}`);
    return null;
  }

  // 2. Renderizar el componente específico con todos los parámetros
  return (
    <CategoryComponent
      fieldName={fieldName}
      mainCategory={mainCategory}
      subCategory={subCategory}
      articleType={articleType}
      postData={postData}
      handleChangeInput={handleChangeInput}
      isRTL={isRTL}
      t={t}
      step={step} // Pasar step si existe
    />
  );
};

export default FieldRenderer;