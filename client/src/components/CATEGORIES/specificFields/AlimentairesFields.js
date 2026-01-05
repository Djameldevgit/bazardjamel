// components/CATEGORIES/specificFields/AlimentairesField.js
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

// Importar campos comunes
import TitleField from '../camposComun/TitleField';
import ReferenceField from '../camposComun/ReferenceField';
import DescriptionField from '../camposComun/DescriptionField';
import PriceField from '../camposComun/PriceField';
import EtatField from '../camposComun/EtatField';
 
import Livraison from '../camposComun/LivraisonFileld';
import WilayaField from '../camposComun/WilayaField';
import CommuneField from '../camposComun/CommuneField';
import TelephoneField from '../camposComun/PhoneField';
import EmailField from '../camposComun/EmailField';
 

// Importar campos específicos para alimentaires si existen
// Si no existen, crea estos componentes o usa campos genéricos
import UniteField from '../camposComun/UniteField';
import TypeOffreField from '../camposComun/TypeOffreField';
import EchangeField from '../camposComun/EchangeField';
import GrossDetailField from '../camposComun/GrossDetailField';

const AlimentairesField = ({ 
  fieldName,
  mainCategory,
  subCategory, 
  postData, 
  handleChangeInput,
  isRTL,
  step
 }) => {
  const { t } = useTranslation();
  
  // Definir qué campos corresponden a cada step según tu estructura
  const getStepFields = () => {
    const steps = {
      step2: ['title', 'description', 'reference', 'livraison'],
      step3: ['price', 'unite', 'typeOffre', 'echange', 'grossdetail'],
      step4: ['wilaya',   'telephone', 'email'],
      step5: ['images']
    };
    
    return steps[step] || [];
  };
  
  // Mapeo de todos los campos disponibles
  const fields = {
    // Step 2 fields
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
      <Livraison
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
    
    // Step 3 fields
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
    
    // Step 4 fields
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
    
    'commune': (
      <CommuneField
        key="commune"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="commune"
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
    
 
   
  };
  
  // Si se pasa un step específico, mostrar solo los campos de ese step
  if (step) {
    const stepFields = getStepFields();
    
    return (
      <>
        {stepFields.map((fieldKey, index) => (
          <div key={fieldKey} className="mb-3">
            {fields[fieldKey] || (
              <div className="alert alert-warning">
                {t('Campo no disponible:')} {fieldKey}
              </div>
            )}
          </div>
        ))}
      </>
    );
  }
  
  // Si se pasa un fieldName específico, mostrar solo ese campo
  if (fieldName) {
    return fields[fieldName] || null;
  }
  
  // Si no se especifica step ni fieldName, mostrar todos los campos
  // (compatible con el comportamiento anterior)
  return (
    <>
      {/* Step 2 */}
      <div className="step-section mb-4">
        <h5 className="border-bottom pb-2 mb-3">Información básica</h5>
        {fields['title']}
        {fields['description']}
        {fields['reference']}
        {fields['livraison']}
      </div>
      
      {/* Step 3 */}
      <div className="step-section mb-4">
        <h5 className="border-bottom pb-2 mb-3">Precio y oferta</h5>
        {fields['price']}
        {fields['unite']}
        {fields['typeOffre']}
        {fields['echange']}
        {fields['grossdetail']}
      </div>
      
      {/* Step 4 */}
      <div className="step-section mb-4">
        <h5 className="border-bottom pb-2 mb-3">Ubicación y contacto</h5>
        {fields['wilaya']}
        {fields['commune']}
        {fields['telephone']}
        {fields['email']}
      </div>
      
      {/* Step 5 */}
      <div className="step-section mb-4">
        <h5 className="border-bottom pb-2 mb-3">Imágenes</h5>
        {fields['images']}
      </div>
    </>
  );
};

export default AlimentairesField;