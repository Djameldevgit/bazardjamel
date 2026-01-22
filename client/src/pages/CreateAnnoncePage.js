// 📂 pages/CreateAnnoncePage.js - VERSIÓN FINAL CORREGIDA
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Container, Button, Alert, Spinner, Card, 
  Row, Col, Badge, ProgressBar 
} from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  createPost, 
  updatePost 
} from '../redux/actions/postAction';
import CategoryAccordion from '../components/CATEGORIES/CategoryAccordion';
import DynamicFieldManager from '../components/CATEGORIES/DynamicFieldManager';
import ImagesStep from '../components/CATEGORIES/camposComun/ImagesStep';
// ✅ Función para corregir campos invertidos (opcional)
const correctCategoryFields = (data) => {
  if (!data) return data;
  
  const corrected = { ...data };
  const invertedPatterns = {
    'appareils_photo': 'cameras_accessories',
    'maison_cuisine': 'electromenager',
    'jardin_bricolage': 'outils_jardinage'
  };
  
  if (corrected.subCategory && invertedPatterns[corrected.subCategory]) {
    if (!corrected.articleType || Object.values(invertedPatterns).includes(corrected.articleType)) {
      const temp = corrected.subCategory;
      corrected.subCategory = corrected.articleType || invertedPatterns[corrected.subCategory];
      corrected.articleType = temp;
    }
  }
  
  return corrected;
};

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
  
  // 🎯 ESTADOS PRINCIPALES
  const [formData, setFormData] = useState({
    categorie: '',
    articleType: '',
    subCategory: '',
  });

  const [specificData, setSpecificData] = useState({});
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ 
    show: false, 
    message: '', 
    variant: 'info' 
  });
  const [isLoadingEditData, setIsLoadingEditData] = useState(true);
  const [hasManuallyGoneBack, setHasManuallyGoneBack] = useState(false);
  const [hasShownInvertedWarning, setHasShownInvertedWarning] = useState(false);

  // 🔍 DEBUG: Monitorizar cambios
  useEffect(() => {
    console.log('🔍 DEBUG Estado actual:', {
      step: currentStep,
      categorie: formData.categorie,
      subCategory: formData.subCategory,
      articleType: formData.articleType,
      imagesCount: images.length,
      specificDataKeys: Object.keys(specificData)
    });
  }, [formData, currentStep, images, specificData]);

  // 📥 CARGAR DATOS DE EDICIÓN
  useEffect(() => {
    if (isEdit && postToEdit) {
      const correctedPostData = correctCategoryFields(postToEdit);
      
      const loadedBaseData = {
        categorie: correctedPostData.categorie || '',
        subCategory: correctedPostData.subCategory || '',
        articleType: correctedPostData.articleType || '',
      };

      const loadedSpecificData = {};

      // Cargar categorySpecificData
      if (correctedPostData.categorySpecificData) {
        if (correctedPostData.categorySpecificData instanceof Map) {
          correctedPostData.categorySpecificData.forEach((value, key) => {
            if (value !== undefined && value !== null && value !== '') {
              loadedSpecificData[key] = value;
            }
          });
        } else if (typeof correctedPostData.categorySpecificData === 'object') {
          Object.entries(correctedPostData.categorySpecificData).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
              loadedSpecificData[key] = value;
            }
          });
        }
      }

      // Campos directos
      const directFields = [
        'title', 'description', 'price', 'phone', 'telephone', 
        'email', 'wilaya', 'commune', 'address', 'etat',
        'livraison', 'echange', 'marque', 'modele', 'gross_detail', 'unite'
      ];
      
      directFields.forEach(field => {
        if (correctedPostData[field]) {
          loadedSpecificData[field] = correctedPostData[field];
        }
      });

      setFormData(loadedBaseData);
      setSpecificData(loadedSpecificData);

      if (correctedPostData.images?.length > 0) {
        const loadedImages = correctedPostData.images.map(img => ({
          url: img.url || img,
          public_id: img.public_id || '',
          isExisting: true
        }));
        setImages(loadedImages);
      }

      const hasCompleteCategory = loadedBaseData.categorie && loadedBaseData.subCategory;
      
      if (hasCompleteCategory) {
        setCurrentStep(2);
        setHasManuallyGoneBack(true);
      }
      
      setIsLoadingEditData(false);
    } else {
      setIsLoadingEditData(false);
    }
  }, [isEdit, postToEdit]);

  // ⚡ AVANCE AUTOMÁTICO AL STEP 2
  useEffect(() => {
    const currentStepWhenScheduled = currentStep;
    const hasCategory = formData.categorie;
    const hasSubCategory = formData.subCategory;
    const isCategoryComplete = hasCategory && hasSubCategory;
    
    if (hasManuallyGoneBack || isEdit || currentStepWhenScheduled !== 1) {
      if (autoAdvanceTimeout.current) {
        clearTimeout(autoAdvanceTimeout.current);
      }
      return;
    }
    
    if (isCategoryComplete) {
      if (autoAdvanceTimeout.current) {
        clearTimeout(autoAdvanceTimeout.current);
      }
      
      autoAdvanceTimeout.current = setTimeout(() => {
        const stillHasCategory = formData.categorie && formData.subCategory;
        const stillInStep1 = currentStep === 1;
        const stillNoManualBack = !hasManuallyGoneBack;
        
        if (stillHasCategory && stillInStep1 && stillNoManualBack) {
          setCurrentStep(2);
          
          setAlert({
            show: true,
            message: "✅ Catégorie sélectionnée. Complétez les détails.",
            variant: "success"
          });
        }
      }, 500);
      
      return () => {
        if (autoAdvanceTimeout.current) {
          clearTimeout(autoAdvanceTimeout.current);
        }
      };
    } else {
      if (autoAdvanceTimeout.current) {
        clearTimeout(autoAdvanceTimeout.current);
      }
    }
  }, [formData.categorie, formData.subCategory, currentStep, hasManuallyGoneBack, isEdit]);

  // 🎯 HANDLER PARA CAMBIOS DE INPUT
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    const BASE_FIELDS = ['categorie', 'subCategory', 'articleType'];
    
    if (BASE_FIELDS.includes(name)) {
      setFormData(prev => {
        const newData = { ...prev, [name]: val };
        
        if (name === 'categorie') {
          newData.subCategory = '';
          newData.articleType = '';
          setSpecificData({});
          if (currentStep === 1) {
            setHasManuallyGoneBack(false);
          }
          setHasShownInvertedWarning(false);
        } else if (name === 'articleType') {
          if (prev.articleType !== val) {
            setSpecificData({});
          }
          newData.subCategory = prev.subCategory;
        } else if (name === 'subCategory') {
          if (prev.subCategory !== val) {
            setSpecificData({});
          }
          newData.articleType = prev.articleType;
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

  // 🎯 HANDLER PARA CAMBIOS DE CATEGORÍA
  const handleCategoryChange = useCallback((e) => {
    const { name, value } = e.target;
    
    if (autoAdvanceTimeout.current) {
      clearTimeout(autoAdvanceTimeout.current);
    }
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      if (name === 'categorie') {
        newData.articleType = '';
        newData.subCategory = '';
        setSpecificData({});
        if (currentStep === 1) {
          setHasManuallyGoneBack(false);
        }
        setHasShownInvertedWarning(false);
      } else if (name === 'articleType') {
        newData.subCategory = prev.subCategory;
        if (prev.articleType !== value) {
          setSpecificData({});
        }
      } else if (name === 'subCategory') {
        newData.articleType = prev.articleType;
        if (prev.subCategory !== value) {
          setSpecificData({});
        }
      }
      
      return newData;
    });
  }, [currentStep]);

  // 🔄 FUNCIÓN PARA CAMBIAR DE PASO
  const handleStepChange = useCallback((newStep) => {
    if (autoAdvanceTimeout.current) {
      clearTimeout(autoAdvanceTimeout.current);
    }
    
    if (newStep === 1) {
      setHasManuallyGoneBack(true);
    } else if (newStep > currentStep) {
      setHasManuallyGoneBack(false);
    }
    
    setCurrentStep(newStep);
  }, [currentStep]);

  // 📢 FUNCIÓN PARA MOSTRAR ALERTAS
  const showAlertMessage = useCallback((message, variant = 'info', duration = 4000) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => {
      setAlert({ show: false, message: '', variant: 'info' });
    }, duration);
  }, []);

  // ✅ VALIDACIÓN DE PASOS
  const canProceedToNextStep = () => {
    const allData = { ...formData, ...specificData };
    
    switch(currentStep) {
      case 1:
        return allData.categorie && allData.subCategory;
      
      case 5:
        return images.length > 0;
      
      default:
        return true;
    }
  };

  // 🚀 FUNCIÓN PRINCIPAL: ENVIAR POST - VERSIÓN SIMPLIFICADA Y FUNCIONAL
  const handleSubmit = async () => {
    console.log('=== 🚀 INICIANDO handleSubmit ===');
    
    if (isSubmitting) {
      console.log('⏸️ Ya está enviando, abortando...');
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ VALIDACIONES BÁSICAS
      if (!formData.categorie || !formData.subCategory) {
        showAlertMessage("❌ Sélectionnez une catégorie et sous-catégorie", "danger");
        setIsSubmitting(false);
        return;
      }

      if (!specificData.title || specificData.title.trim() === '') {
        showAlertMessage("❌ Le titre est requis", "danger");
        setIsSubmitting(false);
        return;
      }

      if (!specificData.description || specificData.description.trim() === '') {
        showAlertMessage("❌ La description est requise", "danger");
        setIsSubmitting(false);
        return;
      }

      if (!specificData.price || parseFloat(specificData.price) <= 0) {
        showAlertMessage("❌ Un prix valide est requis", "danger");
        setIsSubmitting(false);
        return;
      }

      if (images.length === 0) {
        showAlertMessage("❌ Ajoutez au moins une image", "danger");
        setIsSubmitting(false);
        return;
      }

      console.log('✅ Validaciones pasadas');

      // ✅ PREPARAR DATOS COMO TU ACTION ESPERA
      const postDataForBackend = {
        ...formData,
        ...specificData,
        categorySpecificData: specificData // Tu action espera categorySpecificData
      };

      console.log('📦 Datos preparados:', {
        categorie: postDataForBackend.categorie,
        subCategory: postDataForBackend.subCategory,
        title: postDataForBackend.title,
        price: postDataForBackend.price
      });

      // ✅ PREPARAR IMÁGENES
      const imagesForBackend = images.map(img => ({
        url: img.url || img,
        public_id: img.public_id || '',
        isExisting: img.isExisting || false
      }));

      console.log('🖼️ Imágenes preparadas:', imagesForBackend.length);

      // ✅ CREAR ACTION DATA - ESTRUCTURA QUE TU ACTION ESPERA
      const actionData = {
        postData: postDataForBackend,  // Objeto plano con todo
        images: imagesForBackend,
        auth,  // ← ¡IMPORTANTE! Tu action original espera auth completo
        socket: socket
      };

      console.log('🔐 Datos de auth:', {
        token: auth.token ? 'PRESENTE' : 'AUSENTE',
        user: auth.user?._id
      });

      // ✅ EJECUTAR ACCIÓN DE REDUX
      let result;
      
      if (isEdit && postToEdit) {
        console.log('✏️ Ejecutando updatePost...');
        // Tu updatePost original espera (id, postData, auth, socket)
        result = await dispatch(updatePost(
          postToEdit._id,
          postDataForBackend,
          auth,
          socket
        ));
      } else {
        console.log('➕ Ejecutando createPost...');
        // Tu createPost original espera ({ postData, images, auth, socket })
        result = await dispatch(createPost(actionData));
      }

      console.log('✅ Resultado de la acción:', result);

      // ✅ VERIFICAR RESULTADO
      if (result && result.success === false) {
        console.error('❌ Action retornó error:', result.error);
        throw new Error(result.error);
      }

      // ✅ MOSTRAR ALERTA DE ÉXITO
      showAlertMessage(
        isEdit 
          ? '✅ Annonce mise à jour avec succès!' 
          : '✅ Annonce créée avec succès!',
        "success"
      );

      // ✅ REDIRIGIR DESPUÉS DE 1.5 SEGUNDOS
      setTimeout(() => {
        history.push('/');
      }, 1500);

    } catch (error) {
      console.error('❌ ERROR en handleSubmit:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
      
      let errorMessage = 'Erreur lors de la publication';
      
      if (error.message.includes('404')) {
        errorMessage = 'Serveur non disponible. Vérifiez la connexion.';
      } else if (error.message.includes('network')) {
        errorMessage = 'Problème de connexion réseau.';
      } else if (error.message.includes('token')) {
        errorMessage = 'Session expirée. Veuillez vous reconnecter.';
      } else {
        errorMessage = error.message;
      }
      
      showAlertMessage(`❌ ${errorMessage}`, "danger", 6000);
      
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🎨 RENDERIZAR BOTÓN DE EDICIÓN DE CATEGORÍA
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

  // 🎨 RENDERIZAR BOTÓN PARA VOLVER A CATEGORÍA
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
              Catégorie: <strong>{formData.categorie}</strong> → <strong>{formData.subCategory}</strong>
              {formData.articleType && <span> (<strong>{formData.articleType}</strong>)</span>}
            </small>
          </div>
        </div>
      );
    }
    return null;
  };

  // 🎨 RENDERIZAR CONTENIDO DEL PASO ACTUAL
  const renderCurrentStep = () => {
    if (isLoadingEditData) {
      return (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Chargement des données...</p>
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
                          setFormData({
                            categorie: '',
                            articleType: '',
                            subCategory: '',
                          });
                          setSpecificData({});
                          setHasManuallyGoneBack(false);
                          setHasShownInvertedWarning(false);
                          
                          if (autoAdvanceTimeout.current) {
                            clearTimeout(autoAdvanceTimeout.current);
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
                
                {/* Botón manual para avanzar */}
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

  // 📊 TITULOS DE PASOS
  const stepTitles = [
    { title: 'Catégorie', icon: '🏷️', step: 1 },
    { title: 'Détails', icon: '📝', step: 2 },
    { title: 'Spécifications', icon: '🔍', step: 3 },
    { title: 'Contact', icon: '📍', step: 4 },
    { title: 'Photos', icon: '🖼️', step: 5 }
  ];

  return (
    <Container className="py-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* ALERTA */}
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
                <span>{alert.message}</span>
              </div>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ENCABEZADO */}
      <div className="text-center mb-4">
        <h1 className="fw-bold mb-2">
          {isEdit ? '✏️ Modifier une annonce' : '➕ Publier une annonce'}
        </h1>
        
        {isEdit && currentStep > 1 && (
          <Badge bg="warning" className="px-3 py-2">
            <i className="fas fa-edit me-1"></i>
            Mode édition
          </Badge>
        )}
      </div>

      {/* INDICADOR DE PASOS */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center">
          {stepTitles.map((step, index) => (
            <React.Fragment key={step.step}>
              <div className="text-center flex-grow-1">
                <button
                  className={`step-indicator ${currentStep === step.step ? 'active' : ''}`}
                  onClick={() => handleStepChange(step.step)}
                  disabled={isSubmitting}
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

      {/* CONTENIDO DEL PASO */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="border-0 shadow-sm overflow-hidden rounded">
          <AnimatePresence mode="wait">
            {renderCurrentStep()}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* NAVEGACIÓN INFERIOR */}
      <motion.div 
        className="mt-4 pt-3 border-top"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Row className="g-3">
          <Col xs={6}>
            <Button
              variant="outline-secondary"
              size="lg"
              onClick={() => handleStepChange(currentStep - 1)}
              disabled={currentStep === 1 || isSubmitting}
              className="w-100 py-2"
            >
              <i className="fas fa-arrow-left me-2"></i>
              Retour
            </Button>
          </Col>
          
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
                variant={isEdit ? "warning" : "success"}
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-100 py-2"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" animation="border" className="me-2" />
                    {isEdit ? 'Mise à jour...' : 'Publication...'}
                  </>
                ) : (
                  <>
                    <i className={`fas ${isEdit ? 'fa-save' : 'fa-paper-plane'} me-2`}></i>
                    {isEdit ? 'Mettre à jour' : 'Publier'}
                  </>
                )}
              </Button>
            )}
          </Col>
        </Row>
      </motion.div>

      {/* ESTILOS CSS */}
      <style jsx>{`
        .step-content {
          min-height: 400px;
          padding: 20px;
        }
        
        .step-indicator {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .step-indicator.active .step-icon-wrapper {
          background: #4f46e5;
          color: white;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }
        
        .step-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          position: relative;
          transition: all 0.3s ease;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .step-icon {
          font-size: 20px;
        }
        
        .step-dot {
          position: absolute;
          bottom: -4px;
          right: -4px;
          width: 16px;
          height: 16px;
          background: #10b981;
          border-radius: 50%;
          border: 3px solid white;
        }
        
        .step-connector {
          display: flex;
          align-items: center;
          padding: 0 10px;
        }
        
        .connector-line {
          height: 3px;
          background: #e9ecef;
          width: 100%;
          transition: all 0.3s ease;
        }
        
        .connector-line.active {
          background: #4f46e5;
        }
        
        .step-label {
          font-size: 0.85rem;
          margin-top: 8px;
        }
      `}</style>
    </Container>
  );
};

export default CreateAnnoncePage;