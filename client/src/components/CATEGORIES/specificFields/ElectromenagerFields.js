// 📂 components/CATEGORIES/specificFields/ElectromenagerField.js
import React from 'react';
import BaseCategoryField from './BaseCategoryField';

// Importar campo específico
import MarcaModeloField from '../camposComun/MarcaModeloField';

const ElectromenagerField = (props) => {
  const { step, mainCategory, subCategory, postData, handleChangeInput, isRTL, t } = props;
  
  console.log(`🔌 ElectromenagerField - Step: ${step}`);
  
  // 🔥 CAMPOS ADICIONALES ESPECÍFICOS
  const additionalFields = {
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
      )
    },
    
    // Agregar 'marque' al step2
    step2: ['marque'],
    step3: [],
    step4: []
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

export default ElectromenagerField;