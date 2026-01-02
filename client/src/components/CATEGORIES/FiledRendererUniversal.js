// 📁 src/components/CATEGORIES/FieldRendererUniversal.js
import React from 'react';
import renderCommonField from './camposComun/CamposComunField';
 
  
 
// Importar el FieldRenderer EXISTENTE para campos específicos
import FieldRenderer from './FieldRenderer';

// Lista de campos comunes (debes tenerlos en camposComunField.js)
const COMMON_FIELDS = [
  'title', 'description', 'etat', 'reference',
  'price', 'unite', 'typeOffre', 'echange',
  'wilaya', 'commune', 'adresse', 'telephone', 'email',
  'images', 'quantite', 'taille', 'couleur', 'livraison'
];

const FieldRendererUniversal = ({
  fieldName,
  mainCategory,
  subCategory,
  articleType,
  postData,
  handleChangeInput,
  isRTL,
  t,
  wilayasData = [],
  communesList = [],
  selectedWilaya = null,
  onWilayaChange = null
}) => {
  
  console.log('🔍 FieldRendererUniversal - campo:', fieldName, '¿Común?', COMMON_FIELDS.includes(fieldName));
  
  // 1. Si es campo común, usar camposComunField.js
  if (COMMON_FIELDS.includes(fieldName)) {
    try {
      return renderCommonField(fieldName, {
        postData,
        handleChangeInput,
        isRTL,
        t,
        mainCategory,
        subCategory,
        wilayasData,
        communesList,
        selectedWilaya,
        onWilayaChange,
        // Configuración específica del campo
        fieldConfig: {
          name: fieldName,
          required: true, // Puedes ajustar según el campo
          // Puedes agregar más configuraciones aquí
        }
      });
    } catch (error) {
      console.error(`❌ Error en campo común ${fieldName}:`, error);
      // Fallback al FieldRenderer original
    }
  }
  
  // 2. Si NO es campo común, usar el FieldRenderer EXISTENTE
  return (
    <FieldRenderer
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
};

export default FieldRendererUniversal;