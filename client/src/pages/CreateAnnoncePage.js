import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Button, Alert, Spinner, ProgressBar, Card, Row, Col } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';

// 🔷 REDUX
import { createPost, updatePost } from '../redux/actions/postAction';

// 🔷 COMPONENTES
import CategoryAccordion from '../components/CATEGORIES/CategoryAccordion';
import DynamicFieldManager from '../components/CATEGORIES/DynamicFieldManager';
import ImagesStep from '../components/CATEGORIES/camposComun/ImagesStep';

const CreateAnnoncePage = () => {
  // 🔷 REDUX Y HOOKS
  const { auth, socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  
  const isRTL = i18n.language === 'ar';
  const isEdit = location.state?.isEdit || false;
  const postToEdit = location.state?.postData || null;

  // 🔷 REF PARA CONTROLAR AVANCE AUTOMÁTICO (SOLO CREACIÓN)
  const autoAdvanceBlocked = useRef(false);
  const autoAdvanceTimeout = useRef(null);

  // 🔷 ESTADOS DEL FORMULARIO
  const [currentStep, setCurrentStep] = useState(1); // Por defecto Step 1
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

  // 🔷 CARGAR DATOS DE EDICIÓN CON LÓGICA MEJORADA
  useEffect(() => {
    if (isEdit && postToEdit) {
      console.log('✏️ Chargement des données d\'édition...');
      
      // 1. CARGAR CAMPOS BASE
      const loadedBaseData = {
        categorie: postToEdit.categorie || '',
        subCategory: postToEdit.subCategory || '',
        articleType: postToEdit.articleType || '',
      };

      // 2. CARGAR CAMPOS DINÁMICOS
      const loadedSpecificData = {};

      // Procesar categorySpecificData
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

      // También cargar campos directos del post
      const directFields = ['description', 'price', 'loyer', 'marque', 'modele', 'superficie', 'phone', 'wilaya', 'commune'];
      directFields.forEach(field => {
        if (postToEdit[field]) {
          loadedSpecificData[field] = postToEdit[field];
        }
      });

      setFormData(loadedBaseData);
      setSpecificData(loadedSpecificData);

      // 3. CARGAR IMÁGENES
      if (postToEdit.images?.length > 0) {
        const loadedImages = postToEdit.images.map(img => ({
          url: img.url || img,
          public_id: img.public_id || '',
          isExisting: true
        }));
        setImages(loadedImages);
      }

      // 🔥 NUEVO: SI ES EDICIÓN, IR DIRECTAMENTE AL STEP 2
      const hasCompleteCategory = loadedBaseData.categorie && loadedBaseData.subCategory;
      const hasArticleTypeIfImmobilier = loadedBaseData.categorie !== 'immobilier' || loadedBaseData.articleType;
      
      if (hasCompleteCategory && hasArticleTypeIfImmobilier) {
        console.log('✅ Données chargées - Aller directement au Step 2');
        // Ir directamente al Step 2 sin delay
        setCurrentStep(2);
      } else {
        console.log('⚠️ Catégorie incomplète - Rester au Step 1');
        setCurrentStep(1);
      }
      
      setIsLoadingEditData(false);
      
    } else {
      // Modo création
      setIsLoadingEditData(false);
    }
  }, [isEdit, postToEdit]);

  // 🔷 AVANCE AUTOMÁTICO AL STEP 2 (SOLO PARA CREACIÓN)
  useEffect(() => {
    if (isEdit) return; // ❌ NO aplicar en modo édition
    
    const hasCategory = formData.categorie;
    const hasSubCategory = formData.subCategory;
    const hasArticleTypeIfImmobilier = formData.categorie !== 'immobilier' || formData.articleType;
    
    const isCategoryComplete = hasCategory && hasSubCategory && hasArticleTypeIfImmobilier;
    
    if (isCategoryComplete && currentStep === 1 && !autoAdvanceBlocked.current) {
      console.log('🚀 Avance automatique (Création)');
      
      if (autoAdvanceTimeout.current) {
        clearTimeout(autoAdvanceTimeout.current);
      }
      
      autoAdvanceTimeout.current = setTimeout(() => {
        setCurrentStep(2);
        
        setAlert({
          show: true,
          message: "✅ Catégorie sélectionnée. Passons aux détails!",
          variant: "success"
        });
      }, 600);
      
      return () => {
        if (autoAdvanceTimeout.current) {
          clearTimeout(autoAdvanceTimeout.current);
        }
      };
    }
  }, [formData.categorie, formData.subCategory, formData.articleType, currentStep, isEdit]);

  // 🔷 HANDLER PARA TODOS LOS CAMPOS
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
          setCurrentStep(1);
          setSpecificData({});
          
          autoAdvanceBlocked.current = false;
        }
        
        if (name === 'articleType') {
          newData.subCategory = '';
          setSpecificData({});
          autoAdvanceBlocked.current = false;
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
  }, []);

  // 🔷 HANDLER ESPECÍFICO PARA CATEGORÍAS
  const handleCategoryChange = useCallback((e) => {
    handleInputChange(e);
  }, [handleInputChange]);

  // 🔷 FUNCIÓN SIMPLE PARA CAMBIAR DE PASO
  const handleStepChange = useCallback((newStep) => {
    console.log(`📝 Étape: ${currentStep} → ${newStep}`);
    
    // Si el usuario retrocede manualmente, bloquear avance auto
    if (currentStep === 1 && newStep > 1) {
      autoAdvanceBlocked.current = true;
    }
    
    setCurrentStep(newStep);
  }, [currentStep]);

  // 🔷 MOSTRAR ALERTA
  const showAlertMessage = useCallback((message, variant = 'info') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'info' }), 5000);
  }, []);

  // 🔷 VALIDACIÓN SIMPLIFICADA
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

  // 🔷 HANDLE SUBMIT FINAL
  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!formData.categorie || !formData.subCategory) {
      showAlertMessage("Veuillez sélectionner une catégorie et une sous-catégorie.", "danger");
      setIsSubmitting(false);
      return;
    }

    if (images.length === 0) {
      showAlertMessage("Veuillez ajouter au moins une image.", "danger");
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

      setTimeout(() => history.push('/'), 1500);

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

  // 🔷 RENDERIZAR PASO ACTUAL
  const renderCurrentStep = () => {
    if (isLoadingEditData) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Chargement des données d'édition...</p>
        </div>
      );
    }

    const commonProps = {
      postData: { ...formData, ...specificData },
      handleChangeInput: handleInputChange,
      isRTL
    };

    const stepVariants = {
      enter: { opacity: 0, y: 20 },
      center: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 }
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
            <div className="step-header mb-4">
              <h2 className="fw-bold">🏷️ Sélectionnez la catégorie</h2>
              <p className="text-muted">
                {isEdit 
                  ? 'Modifiez la catégorie si nécessaire'
                  : 'Choisissez la catégorie pour votre annonce'
                }
              </p>
            </div>
            
            <Card className="p-4 shadow-sm border-0">
              <CategoryAccordion
                postData={formData}
                handleChangeInput={handleCategoryChange}
              />
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
            <ImagesStep
              images={images}
              setImages={setImages}
              isRTL={isRTL}
              onComplete={handleSubmit}
              onBack={() => handleStepChange(4)}
            />
          </motion.div>
        );
        
      default:
        return null;
    }
  };

  // 🔷 TÍTULOS DE PASOS SIMPLIFICADOS
  const stepTitles = [
    { title: 'Catégorie', icon: '🏷️', step: 1 },
    { title: 'Détails', icon: '📝', step: 2 },
    { title: 'Spécifications', icon: '🔍', step: 3 },
    { title: 'Prix & Contact', icon: '💰', step: 4 },
    { title: 'Photos', icon: '🖼️', step: 5 }
  ];

  // 🔷 CALCULAR PORCENTAJE DE COMPLETADO
  const calculateCompletion = () => {
    const allData = { ...formData, ...specificData };
    let completedFields = 0;
    let totalFields = 0;
    
    const baseFields = ['categorie', 'subCategory'];
    totalFields += baseFields.length;
    completedFields += baseFields.filter(field => allData[field]).length;
    
    if (allData.categorie === 'immobilier') {
      totalFields += 1;
      completedFields += allData.articleType ? 1 : 0;
    }
    
    const importantFields = ['price', 'loyer', 'phone', 'marque', 'modele', 'superficie'];
    totalFields += 3;
    const completedImportant = importantFields.filter(field => allData[field]).length;
    completedFields += Math.min(completedImportant, 3);
    
    totalFields += 1;
    completedFields += images.length > 0 ? 1 : 0;
    
    return Math.min(Math.round((completedFields / totalFields) * 100), 100);
  };

  const completionPercentage = calculateCompletion();

  return (
    <Container className="py-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ALERTA */}
      <AnimatePresence>
        {alert.show && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Alert 
              variant={alert.variant} 
              dismissible 
              onClose={() => setAlert({ ...alert, show: false })}
              className="mb-4 shadow-sm"
            >
              <div className="d-flex align-items-center">
                <i className={`fas fa-${alert.variant === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2`}></i>
                <span>{alert.message}</span>
              </div>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CABECERA SIMPLIFICADA */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
         
          
          {/* BANNER MINIMAL SOLO EN EDICIÓN */}
          {isEdit && currentStep > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-3"
            >
              <div className="badge bg-info fs-6  px-3">
                <i className="fas fa-edit me"></i>
                Mode édition
              </div>
            </motion.div>
          )}
         
        </motion.div>
      </div>

      {/* INDICADOR DE PROGRESO */}
      <div className="mb-1">
        <div className="d-none d-md-flex justify-content-between align-items-center mb-4 position-relative">
          {stepTitles.map((step, index) => (
            <React.Fragment key={step.step}>
              <div className="text-center position-relative z-2" style={{ flex: 1 }}>
                <motion.button
                  className={`step-indicator-btn ${currentStep === step.step ? 'active' : ''}`}
                  onClick={() => handleStepChange(step.step)}
                  disabled={!canProceedToNextStep() && currentStep < step.step}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`step-circle ${currentStep >= step.step ? 'current' : ''}`}>
                    <span className="step-icon">{step.icon}</span>
                    <span className="step-number">{step.step}</span>
                  </div>
                  <div className="step-title mt-2">
                    <small className="fw-semibold">{step.title}</small>
                  </div>
                </motion.button>
              </div>
              
              {index < stepTitles.length - 1 && (
                <div className="step-connector">
                  <div className={`connector-line ${currentStep > step.step ? 'completed' : ''}`}></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
 
      </div>

      {/* CONTENIDO DEL PASO ACTUAL */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="border-0 shadow-lg overflow-hidden">
          <Card.Body className="p-4">
            <AnimatePresence mode="wait">
              {renderCurrentStep()}
            </AnimatePresence>
          </Card.Body>
        </Card>
      </motion.div>

      {/* BOTONES DE NAVEGACIÓN - SIMPLES Y CLAROS */}
      <motion.div 
        className="mt-4 pt-3 border-top"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Row className="g-3">
          {/* Botón Précédent */}
          <Col xs={6}>
            <Button
              variant="outline-secondary"
              size="lg"
              onClick={() => handleStepChange(currentStep - 1)}
              disabled={currentStep === 1 || isSubmitting}
              className="w-100 py-2"
            >
              <i className="fas fa-arrow-left me-2"></i>
              Précédent
            </Button>
          </Col>
          
          {/* Botón Suivant/Publier */}
          <Col xs={6}>
            {currentStep < 5 ? (
              <Button
                variant="primary"
                size="lg"
                onClick={() => handleStepChange(currentStep + 1)}
                disabled={!canProceedToNextStep() || isSubmitting}
                className="w-100 py-2"
              >
                Suivant
                <i className="fas fa-arrow-right ms-2"></i>
              </Button>
            ) : (
              <Button
                variant="success"
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-100 py-2"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    Publication...
                  </>
                ) : (
                  <>
                    <i className="fas fa-rocket me-2"></i>
                    {isEdit ? 'Mettre à jour' : 'Publier'}
                  </>
                )}
              </Button>
            )}
          </Col>
        </Row>
      </motion.div>

      {/* INDICADOR SI NO SE PUEDE AVANZAR */}
      {!canProceedToNextStep() && currentStep < 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3"
        >
          <Alert variant="warning" className="py-2">
            <div className="d-flex align-items-center">
              <i className="fas fa-info-circle me-2"></i>
              <small>
                {currentStep === 1 
                  ? 'Sélectionnez une catégorie pour continuer.'
                  : 'Complétez les champs pour continuer.'
                }
              </small>
            </div>
          </Alert>
        </motion.div>
      )}

      {/* ESTILOS CSS SIMPLIFICADOS */}
      <style jsx>{`
        .gradient-text {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .step-content {
          min-height: 400px;
        }
        
        .step-circle {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #f8f9fa;
          border: 3px solid white;
          box-shadow: 0 3px 10px rgba(0,0,0,0.1);
        }
        
        .step-indicator-btn.active .step-circle {
          background: #4f46e5;
          transform: scale(1.05);
        }
        
        .step-number {
          background: #10b981;
          width: 20px;
          height: 20px;
          font-size: 11px;
        }
        
        .progress-section {
          background: #f8f9fa;
          padding: 7px;
          border-radius: 10px;
        }
        
        @media (max-width: 768px) {
          .step-circle {
            width: 50px;
            height: 50px;
          }
          
          .step-icon {
            font-size: 16px;
          }
          
          h1.display-5 {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </Container>
  );
};

export default CreateAnnoncePage;