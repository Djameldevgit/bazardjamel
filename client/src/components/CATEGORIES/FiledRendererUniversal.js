// 📁 src/components/CATEGORIES/FieldRendererUniversal.js
import React from 'react';

// 🔥 IMPORTAR TODOS LOS COMPONENTES ESPECÍFICOS
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
 

// 🔥 MAPA DE CATEGORÍA → COMPONENTE
const CATEGORY_COMPONENTS = {
  'immobilier': ImmobiliersFields,
  'vehicules': VehiculesFields,
  'vetements': VetementsFields,
  'telephones': TelephonesFields,
  'informatique': InformatiqueFields,
  'electromenager': ElectromenagerFields,
  'pieces_detachees': PieceDetacheFields,
  'santebeaute': SanteBeauteFields,
  'meubles': MuebleField,
  'loisirs': LoisirsFields,
  'sport': SportFields,
  'alimentaires': AlimentairesFields,
  'services': ServicesField,
  'materiaux': MateriauxFields,
  'voyages': VoyagesFields,
  'emploi': EmploiFields,
   
};

// 🔥 COMPONENTES DE CAMPOS COMUNES (para reutilizar)
import TitleField from './camposComun/TitleField';
import DescriptionField from './camposComun/DescriptionField';
import PriceField from './camposComun/PriceField';
import TelephoneField from './camposComun/TelephoneField';
import WilayaField from './camposComun/WilayaField';
import CommuneField from './camposComun/CommuneField';
import EtatField from './camposComun/EtatField';
import ReferenceField from './camposComun/ReferenceField';

// 🔥 MAPA DE CAMPOS COMUNES
const COMMON_FIELD_COMPONENTS = {
  'title': TitleField,
  'description': DescriptionField,
  'price': PriceField,
  'telephone': TelephoneField,
  'wilaya': WilayaField,
  'commune': CommuneField,
  'etat': EtatField,
  'reference': ReferenceField
  // Agrega más campos comunes aquí
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
  console.log('🔍 FieldRendererUniversal recibió:', {
    fieldName,
    mainCategory,
    subCategory,
    articleType
  });

  // 1. Primero verificar si es un campo común
  if (COMMON_FIELD_COMPONENTS[fieldName]) {
    console.log(`✅ Campo común: ${fieldName}`);
    const CommonFieldComponent = COMMON_FIELD_COMPONENTS[fieldName];
    
    return (
      <CommonFieldComponent
        fieldName={fieldName}
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
      />
    );
  }

  // 2. Buscar componente específico de categoría
  const CategoryComponent = CATEGORY_COMPONENTS[mainCategory];
  
  if (!CategoryComponent) {
    console.error(`❌ No hay componente para la categoría: ${mainCategory}`);
    console.log('📋 Componentes disponibles:', Object.keys(CATEGORY_COMPONENTS));
    
    return (
      <div className="alert alert-danger">
        <strong>Erreur:</strong> Catégorie "{mainCategory}" non configurée
      </div>
    );
  }

  // 3. Renderizar campo específico de la categoría
  try {
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
      />
    );
  } catch (error) {
    console.error(`❌ Error en FieldRendererUniversal para ${fieldName}:`, error);
    
    return (
      <div className="alert alert-warning">
        <strong>Avertissement:</strong> Champ "{fieldName}" non disponible
        <br />
        <small>Ajoutez-le dans {mainCategory}Fields.js</small>
      </div>
    );
  }
};

export default FieldRendererUniversal;