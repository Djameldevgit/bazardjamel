// components/CATEGORIES/MultiStepFormManager.js - VERSIÓN CON FIELDSTEPMAPPER
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Componentes
import Categories from './Categories';
import SubCategories from './Subcategories';
import DynamicFieldManager from './DynamicFieldManager';
import ImageUploadField from './FormFields/ImageUploadField';
import WilayaCommunesField from './FormFields/WilayaCommunesField';
import NumeroTelephoneField from './FormFields/NumeroTelephoneField';

// 🔥 NUEVO: Importar FieldStepMapper
import { getCompleteStepConfig } from './FieldStepMapper';

const MultiStepFormManager = ({
  formData,
  handleInputChange,
  specificData,
  setSpecificData,
  images,
  handleChangeImages,
  deleteImages,
  isRTL,
  isEdit,
  onStepChange,
  onComplete
}) => {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isValidStep, setIsValidStep] = useState(false);
  const [stepConfig, setStepConfig] = useState(null);

  // 🔥 Animaciones (igual que antes)
  const slideVariants = { /* ... igual que antes ... */ };

  // 🔥 OBTENER CONFIGURACIÓN DE PASOS
  useEffect(() => {
    if (formData.categorie && formData.subCategory) {
      const config = getCompleteStepConfig(
        formData.categorie,
        formData.subCategory,
        formData.articleType
      );
      setStepConfig(config);
    }
  }, [formData.categorie, formData.subCategory, formData.articleType]);

  // 🔥 VALIDAR PASO ACTUAL
  useEffect(() => {
    if (!stepConfig) return;
    
    let valid = false;
    const currentConfig = stepConfig[`step${currentStep}`];
    
    switch(currentStep) {
      case 1: // Categorías
        valid = formData.categorie && formData.subCategory;
        if (formData.categorie === 'immobilier') {
          valid = valid && !!formData.articleType;
        }
        break;
        
      case 2: // Descripción
        const descriptionFields = currentConfig?.fields || [];
        valid = descriptionFields.every(field => {
          const value = specificData[field] || formData[field];
          return value !== undefined && value !== null && value !== '';
        });
        break;
        
      case 3: // Precio
        const priceFields = stepConfig.step3?.fields || [];
        valid = priceFields.every(field => {
          const value = specificData[field];
          return value !== undefined && value !== null && !isNaN(parseFloat(value));
        });
        break;
        
      case 4: // Contacto
        valid = formData.wilaya && formData.commune && formData.telefono;
        break;
        
      case 5: // Imágenes
        valid = images.length >= 1 && images.length <= 10;
        break;
    }
    
    setIsValidStep(valid);
    if (onStepChange) onStepChange(currentStep, valid);
  }, [currentStep, formData, specificData, images, stepConfig]);

  // 🔥 NAVEGACIÓN (igual que antes)
  const goToStep = (step) => { /* ... */ };
  const nextStep = () => { /* ... */ };
  const prevStep = () => { /* ... */ };

  // 🔥 RENDERIZAR PASO ACTUAL
  const renderCurrentStep = () => {
    if (!stepConfig) return null;
    
    switch(currentStep) {
      case 1:
        return (
          <div className="step-container">
            <h4 className="step-title">🏷️ {t('steps.categories', 'Catégories et Sous-catégories')}</h4>
            <Categories
              postData={formData}
              handleChangeInput={handleInputChange}
            />
            
            {formData.categorie && (
              <div className="mt-4">
                <SubCategories
                  postData={formData}
                  handleChangeInput={handleInputChange}
                />
              </div>
            )}
            
            {/* Para immobilier: articleType selector */}
            {formData.categorie === 'immobilier' && (
              <div className="mt-4 p-3 border rounded bg-light">
                <label className="form-label">
                  📝 {t('labels.operation_type', 'Type d\'opération')}
                </label>
                <select
                  className="form-select"
                  name="articleType"
                  value={formData.articleType || ''}
                  onChange={handleInputChange}
                >
                  <option value="">{t('select.choose_operation', 'Choisir...')}</option>
                  <option value="vente">{t('operation.sale', 'Vente')}</option>
                  <option value="location">{t('operation.rental', 'Location')}</option>
                  <option value="echange">{t('operation.exchange', 'Échange')}</option>
                </select>
              </div>
            )}
          </div>
        );

      case 2:
        return (
          <div className="step-container">
            <h4 className="step-title">📝 {t('steps.description', 'Description du produit')}</h4>
            <DynamicFieldManager
              mainCategory={formData.categorie}
              subCategory={formData.subCategory}
              articleType={formData.articleType}
              postData={{ ...formData, ...specificData }}
              handleChangeInput={(e) => {
                setSpecificData(prev => ({
                  ...prev,
                  [e.target.name]: e.target.value
                }));
              }}
              stepFilter="description" // 🔥 SOLO campos de descripción
              isRTL={isRTL}
            />
          </div>
        );

      case 3:
        return (
          <div className="step-container">
            <h4 className="step-title">💰 {t('steps.price', 'Prix et Conditions')}</h4>
            <DynamicFieldManager
              mainCategory={formData.categorie}
              subCategory={formData.subCategory}
              articleType={formData.articleType}
              postData={{ ...formData, ...specificData }}
              handleChangeInput={(e) => {
                setSpecificData(prev => ({
                  ...prev,
                  [e.target.name]: e.target.value
                }));
              }}
              stepFilter="price" // 🔥 SOLO campos de precio
              isRTL={isRTL}
            />
          </div>
        );

      case 4:
        return (
          <div className="step-container">
            <h4 className="step-title">📍 {t('steps.contact', 'Localisation et Contact')}</h4>
            
            {/* Campos base de contacto (siempre visibles) */}
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <WilayaCommunesField
                  postData={formData}
                  handleChangeInput={handleInputChange}
                  isRTL={isRTL}
                />
              </div>
              <div className="col-md-6">
                <NumeroTelephoneField
                  postData={formData}
                  handleChangeInput={(value) => {
                    handleInputChange({
                      target: { name: 'telefono', value }
                    });
                  }}
                  isRTL={isRTL}
                />
              </div>
            </div>
            
            {/* Otros campos de contacto desde FieldConfig */}
            <DynamicFieldManager
              mainCategory={formData.categorie}
              subCategory={formData.subCategory}
              articleType={formData.articleType}
              postData={{ ...formData, ...specificData }}
              handleChangeInput={(e) => {
                setSpecificData(prev => ({
                  ...prev,
                  [e.target.name]: e.target.value
                }));
              }}
              stepFilter="contact" // 🔥 SOLO campos de contacto
              isRTL={isRTL}
            />
          </div>
        );

      case 5:
        return (
          <div className="step-container">
            <h4 className="step-title">🖼️ {t('steps.images', 'Images du produit')}</h4>
            <ImageUploadField
              images={images}
              handleChangeImages={handleChangeImages}
              deleteImages={deleteImages}
              isRTL={isRTL}
              maxImages={10}
            />
            
            <div className="mt-4 text-center">
              <button
                type="button"
                className="btn btn-success btn-lg px-5"
                onClick={onComplete}
                disabled={!isValidStep}
              >
                🚀 {isEdit ? t('buttons.update') : t('buttons.publish')}
              </button>
            </div>
          </div>
        );
    }
  };

  // 🔥 RENDER PRINCIPAL (igual que antes)
  return (
    <div className="multi-step-form-manager">
      {/* Barra de progreso */}
      <div className="progress-steps">
        {[1, 2, 3, 4, 5].map(step => (
          <button
            key={step}
            className={`step-indicator ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
            onClick={() => goToStep(step)}
            disabled={step > currentStep}
          >
            <div className="step-number">{step}</div>
            <div className="step-label">
              {step === 1 && t('steps.categories_short', 'Catégories')}
              {step === 2 && t('steps.description_short', 'Description')}
              {step === 3 && t('steps.price_short', 'Prix')}
              {step === 4 && t('steps.contact_short', 'Contact')}
              {step === 5 && t('steps.images_short', 'Images')}
            </div>
          </button>
        ))}
      </div>
      
      {/* Contenido animado */}
      <div className="step-content-container">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={`step-${currentStep}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            className="step-content"
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Botones de navegación */}
      <div className="step-navigation">
        {currentStep > 1 && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={prevStep}
          >
            ← {t('buttons.back', 'Retour')}
          </button>
        )}
        
        {currentStep < 5 ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={nextStep}
            disabled={!isValidStep}
          >
            {t('buttons.next', 'Suivant')} →
          </button>
        ) : null}
      </div>
      
      {/* CSS (igual que antes) */}
      <style jsx>{`...`}</style>
    </div>
  );
};

export default MultiStepFormManager;