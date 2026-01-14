import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Button, Alert, Spinner, Card, Row, Col } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { createPost, updatePost } from '../redux/actions/postAction';
import CategoryAccordion from '../components/CATEGORIES/CategoryAccordion';
import DynamicFieldManager from '../components/CATEGORIES/DynamicFieldManager';
import ImagesStep from '../components/CATEGORIES/camposComun/ImagesStep';

const CreateAnnoncePage = () => {
  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  
  const isRTL = i18n.language === 'ar';
  const isEdit = location.state?.isEdit || false;
  const postToEdit = location.state?.postData || null;

  const autoAdvanceTimeout = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    categorie: '',
    articleType: '',
    subCategory: '',
  });

  const [specificData, setSpecificData] = useState({});
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'info' });
  const [isLoadingEditData, setIsLoadingEditData] = useState(true);
  const [hasManuallyGoneBack, setHasManuallyGoneBack] = useState(false);

  // 🔷 CLEANUP EFFECT - Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (autoAdvanceTimeout.current) {
        clearTimeout(autoAdvanceTimeout.current);
        autoAdvanceTimeout.current = null;
      }
    };
  }, []);

  // 🔷 CHARGEMENT DES DONNÉES ÉDITION
  useEffect(() => {
    if (isEdit && postToEdit) {
      console.log('📥 Chargement données édition...');
      
      const loadedBaseData = {
        categorie: postToEdit.categorie || '',
        subCategory: postToEdit.subCategory || '',
        articleType: postToEdit.articleType || '',
      };

      const loadedSpecificData = {};

      if (postToEdit.categorySpecificData) {
        try {
          if (postToEdit.categorySpecificData instanceof Map) {
            postToEdit.categorySpecificData.forEach((value, key) => {
              if (value !== undefined && value !== null && value !== '') {
                loadedSpecificData[key] = value;
              }
            });
          } else if (typeof postToEdit.categorySpecificData === 'object') {
            Object.entries(postToEdit.categorySpecificData).forEach(([key, value]) => {
              if (value !== undefined && value !== null && value !== '') {
                loadedSpecificData[key] = value;
              }
            });
          }
        } catch (err) {
          console.warn('⚠️ Erreur:', err);
        }
      }

      const directFields = ['description', 'price', 'loyer', 'marque', 'modele', 'superficie', 'phone', 'wilaya', 'commune'];
      directFields.forEach(field => {
        if (postToEdit[field]) {
          loadedSpecificData[field] = postToEdit[field];
        }
      });

      setFormData(loadedBaseData);
      setSpecificData(loadedSpecificData);

      if (postToEdit.images?.length > 0) {
        const loadedImages = postToEdit.images.map(img => ({
          url: img.url || img,
          public_id: img.public_id || '',
          isExisting: true
        }));
        setImages(loadedImages);
      }

      const hasCompleteCategory = loadedBaseData.categorie && loadedBaseData.subCategory;
      const hasArticleTypeIfImmobilier = loadedBaseData.categorie !== 'immobilier' || loadedBaseData.articleType;
      
      if (hasCompleteCategory && hasArticleTypeIfImmobilier) {
        setCurrentStep(2);
        setHasManuallyGoneBack(true); // En modo edición, no auto-avanzar
      }
      
      setIsLoadingEditData(false);
      
    } else {
      setIsLoadingEditData(false);
    }
  }, [isEdit, postToEdit]);

  // 🔷 AVANCE AUTOMÁTICO AL STEP 2 - VERSIÓN CORREGIDA
  useEffect(() => {
    // Guardar referencia del step actual para el closure
    const currentStepWhenScheduled = currentStep;
    
    // Vérifier si la catégorie est complète
    const hasCategory = formData.categorie;
    const hasSubCategory = formData.subCategory;
    const hasArticleTypeIfImmobilier = formData.categorie !== 'immobilier' || formData.articleType;
    
    const isCategoryComplete = hasCategory && hasSubCategory && hasArticleTypeIfImmobilier;
    
    // 🔥 NO auto-avanzar si:
    // 1. El usuario ya volvió manualmente
    // 2. Estamos en modo edición
    // 3. No estamos en step 1
    if (hasManuallyGoneBack || isEdit || currentStepWhenScheduled !== 1) {
      if (autoAdvanceTimeout.current) {
        clearTimeout(autoAdvanceTimeout.current);
        autoAdvanceTimeout.current = null;
      }
      return;
    }
    
    // 🔥 AVANCE AUTO QUAND LA CATÉGORIE EST COMPLÈTE
    if (isCategoryComplete) {
      console.log('🚀 Programando avance automático hacia Step 2');
      
      // Limpiar timeout anterior si existe
      if (autoAdvanceTimeout.current) {
        clearTimeout(autoAdvanceTimeout.current);
        autoAdvanceTimeout.current = null;
      }
      
      // Programar nuevo timeout con verificación
      autoAdvanceTimeout.current = setTimeout(() => {
        // 🔥 VERIFICACIÓN CRÍTICA: ¿Seguimos en las condiciones para avanzar?
        const stillHasCategory = formData.categorie && formData.subCategory;
        const stillHasArticleType = formData.categorie !== 'immobilier' || formData.articleType;
        const stillInStep1 = currentStep === 1;
        const stillNoManualBack = !hasManuallyGoneBack;
        
        if (stillHasCategory && stillHasArticleType && stillInStep1 && stillNoManualBack) {
          console.log('✅ Ejecutando avance automático a Step 2');
          setCurrentStep(2);
          
          setAlert({
            show: true,
            message: "✅ Catégorie sélectionnée. Complétez les détails.",
            variant: "success"
          });
        } else {
          console.log('⏹️ No se ejecuta auto-avance:', {
            stillHasCategory,
            stillHasArticleType,
            stillInStep1,
            stillNoManualBack
          });
        }
      }, 500);
      
      return () => {
        if (autoAdvanceTimeout.current) {
          clearTimeout(autoAdvanceTimeout.current);
          autoAdvanceTimeout.current = null;
        }
      };
    } else {
      // Si la categoría no está completa, limpiar timeout
      if (autoAdvanceTimeout.current) {
        clearTimeout(autoAdvanceTimeout.current);
        autoAdvanceTimeout.current = null;
      }
    }
  }, [formData.categorie, formData.subCategory, formData.articleType, currentStep, hasManuallyGoneBack, isEdit]);

  // 🔷 HANDLER POUR TOUS LES CHAMPS
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    const BASE_FIELDS = ['categorie', 'subCategory', 'articleType'];
    
    if (BASE_FIELDS.includes(name)) {
      setFormData(prev => {
        const newData = { ...prev, [name]: val };
        
        if (name === 'categorie') {
          newData.articleType = '';
          newData.subCategory = '';
          setSpecificData({});
          // Cuando se cambia categoría, resetear el flag de vuelta manual
          if (currentStep === 1) {
            setHasManuallyGoneBack(false);
          }
        }
        
        if (name === 'articleType') {
          newData.subCategory = '';
          setSpecificData({});
        }
        
        return newData;
      });
    } else {
      setSpecificData(prev => {
        if (val === '' || val === undefined || val === null) {
          const { [name]: removed, ...rest } = prev;
          return rest;
        }
        return { ...prev, [name]: val };
      });
    }
  }, [currentStep]);

  const handleCategoryChange = useCallback((e) => {
    const { name, value } = e.target;
    
    // Limpiar timeout si estamos cambiando categoría
    if (autoAdvanceTimeout.current) {
      clearTimeout(autoAdvanceTimeout.current);
      autoAdvanceTimeout.current = null;
    }
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      if (name === 'categorie') {
        newData.articleType = '';
        newData.subCategory = '';
        setSpecificData({});
        // Resetear flag cuando se cambia categoría
        if (currentStep === 1) {
          setHasManuallyGoneBack(false);
        }
      }
      
      if (name === 'articleType') {
        newData.subCategory = '';
        setSpecificData({});
      }
      
      return newData;
    });
  }, [currentStep]);

  // 🔷 FONCTION POUR CHANGER D'ÉTAPE - COMPLETAMENTE CORREGIDA
  const handleStepChange = useCallback((newStep) => {
    console.log(`📝 Cambiando paso: ${currentStep} → ${newStep}`);
    
    // 🔥 SIEMPRE limpiar timeout cuando cambiamos de paso
    if (autoAdvanceTimeout.current) {
      console.log('⏹️ Limpiando timeout de auto-avance');
      clearTimeout(autoAdvanceTimeout.current);
      autoAdvanceTimeout.current = null;
    }
    
    // 🔥 Actualizar flag de vuelta manual
    if (newStep === 1) {
      console.log('🔄 Usuario volviendo manualmente a categorías');
      setHasManuallyGoneBack(true);
    } else if (newStep > currentStep) {
      // Si avanzamos, resetear el flag
      setHasManuallyGoneBack(false);
    }
    
    setCurrentStep(newStep);
  }, [currentStep]);

  // 🔷 AFFICHER ALERTE
  const showAlertMessage = useCallback((message, variant = 'info') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'info' }), 4000);
  }, []);

  // 🔷 VALIDATION
  const canProceedToNextStep = () => {
    const allData = { ...formData, ...specificData };
    
    switch(currentStep) {
      case 1:
        const hasCategory = allData.categorie && allData.subCategory;
        const hasArticleType = allData.categorie !== 'immobilier' || allData.articleType;
        return hasCategory && hasArticleType;
      
      case 5:
        return images.length > 0;
      
      default:
        return true;
    }
  };

  // 🔷 BOUTON POUR REVENIR À LA CATÉGORIE EN ÉDITION
  const renderCategoryEditButton = () => {
    if (currentStep > 1 && isEdit) {
      return (
        <div className="text-center mb-3">
          <Button
            variant="outline-warning"
            size="sm"
            onClick={() => handleStepChange(1)}
            className="px-3"
          >
            <i className="fas fa-edit me-1"></i>
            Modifier la catégorie
          </Button>
          <div className="mt-1">
            <small className="text-muted">
              Catégorie actuelle: <strong>{formData.categorie}</strong> → <strong>{formData.subCategory}</strong>
              {formData.articleType && <span> (<strong>{formData.articleType}</strong>)</span>}
            </small>
          </div>
        </div>
      );
    }
    return null;
  };

  // 🔷 BOUTON POUR REVENIR À LA CATÉGORIE (NON ÉDITION)
  const renderBackToCategoryButton = () => {
    if (currentStep > 1 && !isEdit && !hasManuallyGoneBack) {
      return (
        <div className="text-center mb-3">
          <Button
            variant="outline-info"
            size="sm"
            onClick={() => {
              setHasManuallyGoneBack(true);
              handleStepChange(1);
            }}
            className="px-3"
          >
            <i className="fas fa-undo me-1"></i>
            Changer de catégorie
          </Button>
          <div className="mt-1">
            <small className="text-muted">
              Catégorie: {formData.categorie} → {formData.subCategory}
            </small>
          </div>
        </div>
      );
    }
    return null;
  };

  // 🔷 SOUMETTRE ANNONCE
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!formData.categorie || !formData.subCategory) {
      showAlertMessage("Sélectionnez une catégorie et sous-catégorie", "danger");
      setIsSubmitting(false);
      return;
    }

    if (images.length === 0) {
      showAlertMessage("Ajoutez au moins une image", "danger");
      setIsSubmitting(false);
      return;
    }

    try {
      const postDataForBackend = {
        ...formData,
        ...specificData
      };

      const imagesForBackend = images.map(img => ({
        url: img.url,
        public_id: img.public_id || '',
        isExisting: img.isExisting || false
      }));

      const actionData = {
        postData: postDataForBackend,
        images: imagesForBackend,
        auth
      };

      if (isEdit && postToEdit) {
        actionData.id = postToEdit._id;
      } else if (!isEdit && socket) {
        actionData.socket = socket;
      }

      const action = isEdit ? updatePost : createPost;
      await dispatch(action(actionData));

      showAlertMessage(
        isEdit ? '✅ Annonce mise à jour!' : '✅ Annonce créée!',
        "success"
      );

      setTimeout(() => history.push('/'), 1200);

    } catch (error) {
      console.error('❌ Erreur:', error);
      showAlertMessage(
        `❌ ${error.response?.data?.msg || error.message || 'Erreur'}`,
        "danger"
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    formData, specificData, images, auth, isEdit, postToEdit, 
    socket, dispatch, history, isSubmitting, showAlertMessage
  ]);

  // 🔷 RENDU ÉTAPE ACTUELLE
  const renderCurrentStep = () => {
    if (isLoadingEditData) {
      return (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Chargement...</p>
        </div>
      );
    }

    const commonProps = {
      postData: { ...formData, ...specificData },
      handleChangeInput: handleInputChange,
      isRTL
    };

    const stepVariants = {
      enter: { opacity: 0, x: 20 },
      center: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 }
    };

    switch(currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="step-content"
          >
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-3">
                <h5 className="text-center mb-3">
                  {isEdit ? '✏️ Modifier la catégorie' : '🏷️ Sélectionnez une catégorie'}
                </h5>
                
                {/* Info de categoría actual */}
                {((formData.categorie && formData.subCategory) || hasManuallyGoneBack) && (
                  <div className={`alert ${hasManuallyGoneBack ? 'alert-info' : 'alert-success'} py-2 mb-3`}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <i className={`fas fa-${hasManuallyGoneBack ? 'info-circle' : 'check-circle'} me-2`}></i>
                        <small>
                          {formData.categorie && <strong>{formData.categorie}</strong>}
                          {formData.subCategory && <span> → {formData.subCategory}</span>}
                          {formData.articleType && <span> ({formData.articleType})</span>}
                        </small>
                      </div>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => {
                          // Resetear para elegir nueva categoría
                          setFormData({
                            categorie: '',
                            articleType: '',
                            subCategory: '',
                          });
                          setSpecificData({});
                          setHasManuallyGoneBack(false);
                          
                          if (autoAdvanceTimeout.current) {
                            clearTimeout(autoAdvanceTimeout.current);
                            autoAdvanceTimeout.current = null;
                          }
                        }}
                      >
                        <i className="fas fa-sync-alt me-1"></i>
                        Changer
                      </Button>
                    </div>
                  </div>
                )}
                
                <CategoryAccordion
                  postData={formData}
                  handleChangeInput={handleCategoryChange}
                />
                
                {/* Mensaje de auto-avance */}
                {formData.categorie && formData.subCategory && !isEdit && !hasManuallyGoneBack && (
                  <motion.div 
                    className="mt-3 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="spinner-border spinner-border-sm text-primary me-2" role="status">
                        <span className="visually-hidden">Chargement...</span>
                      </div>
                      <small className="text-primary me-2">
                        Avance automatique en 0.5s...
                      </small>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 text-decoration-none"
                        onClick={() => {
                          if (autoAdvanceTimeout.current) {
                            clearTimeout(autoAdvanceTimeout.current);
                          }
                          handleStepChange(2);
                        }}
                      >
                        Avancer maintenant
                      </Button>
                    </div>
                  </motion.div>
                )}
                
                {/* Botón manual para avanzar si ya volvió */}
                {formData.categorie && formData.subCategory && hasManuallyGoneBack && (
                  <div className="text-center mt-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStepChange(2)}
                    >
                      <i className="fas fa-arrow-right me-1"></i>
                      Continuer avec cette catégorie
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </motion.div>
        );
        
      case 2:
      case 3:
      case 4:
        return (
          <motion.div
            key={`step${currentStep}`}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="step-content"
          >
            {renderCategoryEditButton()}
            {renderBackToCategoryButton()}
            
            <DynamicFieldManager
              mainCategory={formData.categorie}
              subCategory={formData.subCategory}
              articleType={formData.articleType}
              currentStep={currentStep}
              onStepChange={handleStepChange}
              showNavigation={false}
              isEdit={isEdit}
              {...commonProps}
            />
          </motion.div>
        );
        
      case 5:
        return (
          <motion.div
            key="step5"
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="step-content"
          >
            {renderCategoryEditButton()}
            {renderBackToCategoryButton()}
            
            <ImagesStep
              images={images}
              setImages={setImages}
              isRTL={isRTL}
              onComplete={handleSubmit}
              onBack={() => handleStepChange(4)}
              isEdit={isEdit}
            />
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  // 🔷 TITRES ÉTAPES
  const stepTitles = [
    { title: 'Catégorie', icon: '🏷️', step: 1 },
    { title: 'Détails', icon: '📝', step: 2 },
    { title: 'Spécifications', icon: '🔍', step: 3 },
    { title: 'Contact', icon: '📍', step: 4 },
    { title: 'Photos', icon: '🖼️', step: 5 }
  ];

  // 🔷 VÉRIFIER SI ON PEUT ALLER À UNE ÉTAPE
  const canGoToStep = (step) => {
    // Toujours permettre d'aller au step 1
    if (step === 1) return true;
    
    // Para steps 2-5, permitir si:
    // 1. Es el paso actual o anterior (ya visitado)
    // 2. Es el siguiente paso (si la categoría está completa)
    if (step <= currentStep) {
      return true;
    }
    
    if (step === currentStep + 1) {
      return canProceedToNextStep();
    }
    
    return false;
  };

  return (
    <Container className="py-2" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ALERTE */}
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert 
              variant={alert.variant} 
              dismissible 
              onClose={() => setAlert({ ...alert, show: false })}
              className="mb-3 py-2"
            >
              <div className="d-flex align-items-center">
                <i className={`fas fa-${alert.variant === 'success' ? 'check' : 'exclamation-triangle'} me-2`}></i>
                <span className="small">{alert.message}</span>
              </div>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EN-TÊTE */}
      <div className="text-center mb-3">
        <h1 className="fw-bold mb-1" style={{ fontSize: '1.5rem' }}>
          {isEdit ? '✏️ Modifier une annonce' : '➕ Publier une annonce'}
        </h1>
        
        {isEdit && currentStep > 1 && (
          <span className="badge bg-warning text-dark px-2 py-1">
            <i className="fas fa-edit me-1"></i>
            Mode édition
          </span>
        )}
      </div>

      {/* INDICATEUR ÉTAPES */}
      <div className="mb-3">
        <div className="d-flex justify-content-between align-items-center">
          {stepTitles.map((step, index) => (
            <React.Fragment key={step.step}>
              <div className="text-center flex-grow-1">
                <button
                  className={`step-indicator ${currentStep === step.step ? 'active' : ''}`}
                  onClick={() => {
                    if (canGoToStep(step.step)) {
                      handleStepChange(step.step);
                    }
                  }}
                  disabled={!canGoToStep(step.step)}
                  title={!canGoToStep(step.step) ? "Completez l'étape précédente" : ""}
                >
                  <div className="step-icon-wrapper">
                    <span className="step-icon">{step.icon}</span>
                    {currentStep >= step.step && (
                      <span className="step-dot"></span>
                    )}
                  </div>
                  <div className="step-label mt-1">
                    <small className={`fw-medium ${currentStep === step.step ? 'text-primary' : 'text-muted'}`}>
                      {step.title}
                    </small>
                  </div>
                </button>
              </div>
              
              {index < stepTitles.length - 1 && (
                <div className="step-connector flex-grow-1">
                  <div className={`connector-line ${currentStep > step.step ? 'active' : ''}`}></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* CONTENU ÉTAPE */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="border-0 shadow-sm overflow-hidden">
          <AnimatePresence mode="wait">
            {renderCurrentStep()}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* NAVIGATION */}
      <motion.div 
        className="mt-3 pt-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Row className="g-2">
          <Col xs={6}>
            <Button
              variant="outline-secondary"
              size="md"
              onClick={() => handleStepChange(currentStep - 1)}
              disabled={currentStep === 1 || isSubmitting}
              className="w-100"
            >
              <i className="fas fa-arrow-left me-1"></i>
              Retour
            </Button>
          </Col>
          
          <Col xs={6}>
            {currentStep < 5 ? (
              <Button
                variant="primary"
                size="md"
                onClick={() => handleStepChange(currentStep + 1)}
                disabled={!canProceedToNextStep() || isSubmitting}
                className="w-100"
              >
                Suivant
                <i className="fas fa-arrow-right ms-1"></i>
              </Button>
            ) : (
              <Button
                variant={isEdit ? "warning" : "success"}
                size="md"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-100"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-1" />
                    {isEdit ? 'Mise à jour...' : 'Publication...'}
                  </>
                ) : (
                  <>
                    <i className={`fas ${isEdit ? 'fa-save' : 'fa-rocket'} me-1`}></i>
                    {isEdit ? 'Mettre à jour' : 'Publier'}
                  </>
                )}
              </Button>
            )}
          </Col>
        </Row>
      </motion.div>

      {/* INFORMATIONS */}
      <div className="mt-2 text-center">
        <small className="text-muted d-block">
          <i className="fas fa-clock me-1"></i>
          Annonce valable 6 mois
        </small>
        <small className="text-muted">
          <i className="fas fa-shield-alt me-1"></i>
          Sécurisée et vérifiée
        </small>
      </div>

      {/* STYLES */}
      <style jsx>{`
        .step-content {
          min-height: 350px;
        }
        
        .step-indicator {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.2s ease;
          opacity: 1;
        }
        
        .step-indicator:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .step-indicator.active .step-icon-wrapper {
          background: #4f46e5;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 4px 8px rgba(79, 70, 229, 0.2);
        }
        
        .step-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          position: relative;
          transition: all 0.2s ease;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .step-icon {
          font-size: 16px;
        }
        
        .step-dot {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          background: #10b981;
          border-radius: 50%;
          border: 2px solid white;
        }
        
        .step-connector {
          display: flex;
          align-items: center;
          padding: 0 5px;
        }
        
        .connector-line {
          height: 2px;
          background: #e9ecef;
          width: 100%;
          transition: all 0.3s ease;
        }
        
        .connector-line.active {
          background: #4f46e5;
        }
        
        .step-label {
          font-size: 0.75rem;
        }
        
        @media (max-width: 576px) {
          .step-icon-wrapper {
            width: 36px;
            height: 36px;
          }
          
          .step-icon {
            font-size: 14px;
          }
          
          h1 {
            font-size: 1.3rem !important;
          }
        }
      `}</style>
    </Container>
  );
};

export default CreateAnnoncePage;