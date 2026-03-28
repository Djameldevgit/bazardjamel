// 📂 components/CATEGORIES/specificFields/TelephonesField.js
import React from 'react';
import BaseCategoryField from './BaseCategoryField';

// Importar campos específicos
import MarcaModeloField from '../camposComun/MarcaModeloField';
 
import CameraField from '../camposComun/CameraFields';

const TelephonesField = (props) => {
  const { step, mainCategory, subCategory, postData, handleChangeInput, isRTL, t } = props;
  
  // 🔥 CAMPOS ADICIONALES ESPECÍFICOS PARA TELÉFONOS
  const additionalFields = {
    // Componentes personalizados (mapeo nombre → componente)
    components: {
      'marque': (
        <MarcaModeloField
          key="marque"
          mainCategory={mainCategory}
          subCategory={subCategory}
          postData={postData}
          handleChangeInput={handleChangeInput}
          isRTL={isRTL}
          t={t}
          brandField="marque"
          modelField="modele"
        />
      ),
    
      'camera': (
        <CameraField
          key="camera"
          mainCategory={mainCategory}
          subCategory={subCategory}
          postData={postData}
          handleChangeInput={handleChangeInput}
          isRTL={isRTL}
          t={t}
        />
      )
    },
    
    // Campos adicionales por step (se AGREGAN a los de FieldConfig)
    step2: ['marque'],      // Agregar 'marque' al step2
    step3: ['capaciteStockage', 'ram', 'garantie'],  // Agregar al step3
    step4: []               // No agregar nada al step4
  };
  
  if (step) {
    return (
      <BaseCategoryField
        {...props}
        step={step}
        additionalFields={additionalFields}
      />
    );
  }
  
  return null;
};

export default TelephonesField;