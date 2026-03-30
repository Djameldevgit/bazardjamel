// 📂 components/CATEGORIES/specificFields/VehiculesField.js
import React from 'react';
import BaseCategoryField from './BaseCategoryField';

// Importar campos específicos
import MarcaModeloField from '../camposComun/MarqueModelVehicule';

const PiecesDetacheesFields= (props) => {
  const { step, mainCategory, subCategory, postData, handleChangeInput, isRTL, t } = props;
  
  console.log(`🚗 VehiculesField - Step: ${step}, SubCategory: ${subCategory}`);
  
  // 🔥 CAMPOS ADICIONALES ESPECÍFICOS PARA VEHÍCULOS
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
    
    // Campos adicionales por step
    step2: ['marque'],  // 'marque' se añade al step2
    step3: [],          // No añadir nada al step3
    step4: []           // No añadir nada al step4
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

 

 

export default PiecesDetacheesFields;