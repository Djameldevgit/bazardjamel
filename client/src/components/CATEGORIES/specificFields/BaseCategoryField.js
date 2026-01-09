// src/components/CATEGORIES/specificFields/BaseCategoryField.js
import React from 'react';
import { useTranslation } from 'react-i18next';

// Importar TODOS los campos comunes
import TitleField from '../camposComun/TitleField';
import DescriptionField from '../camposComun/DescriptionField';
import ReferenceField from '../camposComun/ReferenceField';
import LivraisonField from '../camposComun/LivraisonFileld';
import PriceField from '../camposComun/PriceField';
import UniteField from '../camposComun/UniteField';
import TypeOffreField from '../camposComun/TypeOffreField';
import EchangeField from '../camposComun/EchangeField';
import GrossDetailField from '../camposComun/GrossDetailField';
import WilayaField from '../camposComun/WilayaCommuneField';
 
import TelephoneField from '../camposComun/PhoneField';
import EmailField from '../camposComun/EmailField';
import EtatField from '../camposComun/EtatField';

// Importar configuración
import { getFieldsForCategory } from '../FieldConfig';

const BaseCategoryField = ({ 
  fieldName,
  mainCategory,
  subCategory, 
  postData, 
  handleChangeInput,
  isRTL,
  step,
  // Prop para campos adicionales específicos
  additionalFields = {},
  // Prop para sobrescribir campos base
  overrideFields = {}
}) => {
  const { t } = useTranslation();
  
  // 1. Obtener configuración de campos desde FieldConfig
  const categoryConfig = getFieldsForCategory(mainCategory, subCategory);
  
  // 2. Combinar campos base + específicos + sobrescritos
  const getStepFields = (stepName) => {
    const baseStepFields = categoryConfig[stepName] || [];
    const additionalStepFields = additionalFields[stepName] || [];
    const overrideStepFields = overrideFields[stepName] || [];
    
    // Combinar, dando prioridad a los campos sobrescritos
    return [...baseStepFields, ...additionalStepFields].filter(field => 
      !overrideStepFields.includes(`!${field}`) // Exclusión con "!"
    ).concat(overrideStepFields.filter(f => !f.startsWith('!')));
  };
  
  // 3. Mapeo de TODOS los componentes de campo
  const fieldComponents = {
    // === CAMPOS BASE (COMUNES A TODAS) ===
    'title': (
      <TitleField
        key="title"
        mainCategory={mainCategory}
        subCategory={subCategory}
        fieldName="title"
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'description': (
      <DescriptionField
        key="description"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="description"
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'reference': (
      <ReferenceField
        key="reference"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="reference"
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'livraison': (
      <LivraisonField
        key="livraison"
        mainCategory={mainCategory}
        subCategory={subCategory}
        fieldName="livraison"
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'price': (
      <PriceField
        key="price"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="price"
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'unite': (
      <UniteField
        key="unite"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="unite"
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'typeOffre': (
      <TypeOffreField
        key="typeOffre"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="typeOffre"
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'echange': (
      <EchangeField
        key="echange"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="echange"
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'grossdetail': (
      <GrossDetailField
        key="grossdetail"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="grossdetail"
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'wilaya': (
      <WilayaField
        key="wilaya"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="wilaya"
        isRTL={isRTL}
        t={t}
      />
    ),
    
 
    
    'telephone': (
      <TelephoneField
        key="telephone"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="telephone"
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'email': (
      <EmailField
        key="email"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="email"
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'etat': (
      <EtatField
        key="etat"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="etat"
        isRTL={isRTL}
        t={t}
      />
    ),
    
    // Puedes agregar más campos base aquí...
    
    // === CAMPOS ESPECÍFICOS (se añaden en los componentes hijos) ===
    ...additionalFields.components // Componentes específicos inyectados
  };
  
  // 4. Lógica de renderizado
  const renderStep = (stepName) => {
    const stepFields = getStepFields(stepName);
    
    return stepFields.map((fieldKey) => {
      if (fieldKey.startsWith('custom:')) {
        // Campo personalizado inyectado
        const customKey = fieldKey.replace('custom:', '');
        return additionalFields.customComponents?.[customKey] || null;
      }
      
      return fieldComponents[fieldKey] || (
        <div key={fieldKey} className="alert alert-warning mt-2">
          {t('components.fieldNotAvailable', { field: fieldKey })}
        </div>
      );
    });
  };
  
  // 5. Renderizar según el modo
  if (step) {
    // Modo: mostrar solo un step específico
    return <div className="step-fields">{renderStep(step)}</div>;
  }
  
  if (fieldName) {
    // Modo: mostrar solo un campo específico
    return fieldComponents[fieldName] || null;
  }
  
  // Modo: mostrar todos los steps (para compatibilidad)
  const allSteps = ['step2', 'step3', 'step4', 'step5'];
  
  return (
    <div className="all-steps">
      {allSteps.map((stepName) => (
        <div key={stepName} className={`step-section mb-4 ${stepName}`}>
          <h5 className="border-bottom pb-2 mb-3">
            {t(`steps.${stepName}`)}
          </h5>
          <div className="step-content">
            {renderStep(stepName)}
          </div>
        </div>
      ))}
    </div>
  );
};

// Propiedades por defecto
BaseCategoryField.defaultProps = {
  additionalFields: {},
  overrideFields: {}
};

export default BaseCategoryField;