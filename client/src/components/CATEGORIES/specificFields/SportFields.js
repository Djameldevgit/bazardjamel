// src/components/CATEGORIES/specificFields/AlimentairesField.js
import React from 'react';
import BaseCategoryField from './BaseCategoryField';

// Campos específicos para alimentaires (si los hay)
 
import ModeleField from '../camposComun/ModeleField';
import MarqueModelVehicule from '../camposComun/MarqueModelVehicule';

const SportFields= (props) => {
  // Campos adicionales específicos para alimentaires
  const additionalFields = {
    // Componentes personalizados
    components: {
      'marque': (
        <MarqueModelVehicule
          key="marque"
          mainCategory={props.mainCategory}
          subCategory={props.subCategory}
          fieldName="marque"
          postData={props.postData}
          handleChangeInput={props.handleChangeInput}
          isRTL={props.isRTL}
          t={props.t}
        />
      ),
      'modele': (
        <ModeleField
          key="modele"
          mainCategory={props.mainCategory}
          subCategory={props.subCategory}
          fieldName="modele"
          postData={props.postData}
          handleChangeInput={props.handleChangeInput}
          isRTL={props.isRTL}
          t={props.t}
        />
      )
    },
    
    // Campos adicionales por step (opcional)
    step2: ['marque', 'modele'],
    
    // Campos personalizados con prefijo "custom:"
    customComponents: {
      // Para campos muy específicos
    }
  };
  
  return (
    <BaseCategoryField
      {...props}
      additionalFields={additionalFields}
    />
  );
};
 

 
export default SportFields;