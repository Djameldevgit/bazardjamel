// 📂 pages/CreateAnnoncePage.js - VERSIÓN FINAL CORREGIDA
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Button, Alert, Spinner, Card, Row, Col, Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { createPost, updatePost } from '../redux/actions/postAction';
import CategoryAccordion from '../components/CATEGORIES/CategoryAccordion';
import DynamicFieldManager from '../components/CATEGORIES/DynamicFieldManager';
import ImagesStep from '../components/CATEGORIES/camposComun/ImagesStep';

const CreateAnnoncePage = () => {
  const { auth } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { i18n } = useTranslation();
  
  const isRTL = i18n.language === 'ar';
  const isEdit = location.state?.isEdit || false;
  const postToEdit = location.state?.postData || null;

  const autoAdvanceTimeout = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  // 🎯 ESTADOS SEPARADOS
  const [categoryData, setCategoryData] = useState({
    categorie: '',
    articleType: '',
    subCategory: ''
  });

  // 🎯 Campos específicos de cada categoría
  const [specificData, setSpecificData] = useState({});

  // 🎯 Campos comunes que siempre están presentes
  const [commonData, setCommonData] = useState({
    wilaya: '',
    commune: '',
    price: '',
    description: ''
  });

  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'info' });
  const [isLoadingEditData, setIsLoadingEditData] = useState(true);
  const [hasManuallyGoneBack, setHasManuallyGoneBack] = useState(false);

  // 🔍 COMBINAR TODOS LOS DATOS PARA DynamicFieldManager
  const getAllPostData = useCallback(() => ({
    ...categoryData,
    ...commonData,
    ...specificData
  }), [categoryData, commonData, specificData]);

  // 📥 CARGAR DATOS DE EDICIÓN - SEPARADOS
  useEffect(() => {
    if (isEdit && postToEdit) {
      console.log('📥 Cargando datos de edición:', postToEdit);
      
      // 1. Cargar datos de categoría
      const loadedCategoryData = {
        categorie: postToEdit.categorie || '',
        subCategory: postToEdit.subCategory || '',
        articleType: postToEdit.articleType || ''
      };
      
      // 2. Cargar datos comunes
      const loadedCommonData = {
        wilaya: postToEdit.wilaya || '',
        commune: postToEdit.commune || '',
        price: postToEdit.price || '',
        description: postToEdit.description || ''
      };
      
      // 3. Cargar datos específicos (excluyendo campos comunes y de categoría)
      const loadedSpecificData = {};
      
      // Extraer de categorySpecificData
      if (postToEdit.categorySpecificData) {
        if (typeof postToEdit.categorySpecificData === 'object') {
          Object.entries(postToEdit.categorySpecificData).forEach(([key, value]) => {
            // Solo cargar si no es campo común ni de categoría
            if (value !== undefined && value !== null && value !== '' && 
                !['wilaya', 'commune', 'price', 'description', 'categorie', 'subCategory', 'articleType'].includes(key)) {
              loadedSpecificData[key] = value;
            }
          });
        }
      }
      
      // También revisar campos directos que no sean comunes
      const excludeFields = [
        'categorie', 'subCategory', 'articleType', 
        'wilaya', 'commune', 'price', 'description',
        'images', '_id', 'createdAt', 'updatedAt', 'user',
        'categorySpecificData', 'location'
      ];
      
      Object.entries(postToEdit).forEach(([key, value]) => {
        if (!excludeFields.includes(key) && value !== undefined && value !== null && value !== '') {
          loadedSpecificData[key] = value;
        }
      });
      
      // 4. Cargar imágenes
      if (postToEdit.images?.length > 0) {
        const loadedImages = postToEdit.images.map(img => ({
          url: img.url || img,
          public_id: img.public_id || '',
          isExisting: true
        }));
        setImages(loadedImages);
      }

      // Actualizar estados
      setCategoryData(loadedCategoryData);
      setCommonData(loadedCommonData);
      setSpecificData(loadedSpecificData);

      // Si tiene categoría completa, ir al paso 2
      if (loadedCategoryData.categorie && loadedCategoryData.subCategory) {
        setCurrentStep(2);
        setHasManuallyGoneBack(true);
      }
      
      setIsLoadingEditData(false);
      console.log('✅ Datos cargados separados:', {
        category: loadedCategoryData,
        common: loadedCommonData,
        specific: loadedSpecificData
      });
    } else {
      setIsLoadingEditData(false);
    }
  }, [isEdit, postToEdit]);

  // ⚡ AVANCE AUTOMÁTICO AL STEP 2
  useEffect(() => {
    if (hasManuallyGoneBack || isEdit || currentStep !== 1) {
      if (autoAdvanceTimeout.current) {
        clearTimeout(autoAdvanceTimeout.current);
      }
      return;
    }
    
    const hasCategory = categoryData.categorie && categoryData.subCategory;
    
    if (hasCategory) {
      if (autoAdvanceTimeout.current) {
        clearTimeout(autoAdvanceTimeout.current);
      }
      
      autoAdvanceTimeout.current = setTimeout(() => {
        const stillHasCategory = categoryData.categorie && categoryData.subCategory;
        
        if (stillHasCategory && currentStep === 1 && !hasManuallyGoneBack) {
          setCurrentStep(2);
          setAlert({
            show: true,
            message: "✅ Catégorie sélectionnée. Complétez les détails.",
            variant: "success"
          });
        }
      }, 500);
    }
    
    return () => {
      if (autoAdvanceTimeout.current) {
        clearTimeout(autoAdvanceTimeout.current);
      }
    };
  }, [categoryData.categorie, categoryData.subCategory, currentStep, hasManuallyGoneBack, isEdit]);

  // 🎯 HANDLER ÚNICO PARA CAMBIOS DE INPUT
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    console.log('📝 Cambio en campo:', name, '=', val);

    // 1. Campos de categoría
    const CATEGORY_FIELDS = ['categorie', 'articleType', 'subCategory'];
    if (CATEGORY_FIELDS.includes(name)) {
      setCategoryData(prev => {
        const newData = { ...prev, [name]: val };
        
        // Resetear si cambia la categoría principal
        if (name === 'categorie') {
          newData.articleType = '';
          newData.subCategory = '';
          setSpecificData({}); // Resetear datos específicos
          if (currentStep === 1) {
            setHasManuallyGoneBack(false);
          }
        } else if (name === 'articleType' && prev.articleType !== val) {
          setSpecificData({}); // Resetear datos específicos
        } else if (name === 'subCategory' && prev.subCategory !== val) {
          setSpecificData({}); // Resetear datos específicos
        }
        
        return newData;
      });
    }
    // 2. Campos comunes
    else if (['wilaya', 'commune', 'price', 'description'].includes(name)) {
      setCommonData(prev => ({
        ...prev,
        [name]: val
      }));
    }
    // 3. Campos específicos
    else {
      setSpecificData(prev => {
        if (val === '' || val === undefined || val === null) {
          const { [name]: removed, ...rest } = prev;
          return rest;
        }
        return { ...prev, [name]: val };
      });
    }
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

  // ✅ VALIDACIÓN DE PASOS - CORREGIDA
  const canProceedToNextStep = () => {
    const allData = getAllPostData();
    
    console.log(`🔍 Validación paso ${currentStep}:`, {
      wilaya: allData.wilaya,
      commune: allData.commune,
      title: allData.title,
      description: allData.description,
      price: allData.price
    });
    
    switch(currentStep) {
      case 1:
        return categoryData.categorie && categoryData.subCategory;
      case 2:
        // Validar título y descripción
        return allData.title && allData.title.trim() !== '' && 
               allData.description && allData.description.trim() !== '';
      case 3:
        // Validar precio
        return allData.price && allData.price.toString().trim() !== '';
      case 4:
        // ✅ SOLO wilaya y commune son obligatorios
        const hasWilaya = allData.wilaya && allData.wilaya.toString().trim() !== '';
        const hasCommune = allData.commune && allData.commune.toString().trim() !== '';
        console.log(`✅ Validación paso 4: wilaya=${hasWilaya}, commune=${hasCommune}`);
        return hasWilaya && hasCommune;
      case 5:
        return images.length > 0;
      default:
        return true;
    }
  };

  // 🚀 FUNCIÓN PARA ENVIAR EL FORMULARIO
// 📂 pages/CreateAnnoncePage.js - VERSIÓN FINAL COINCIDENTE
// En handleSubmit, ajustar la estructura de datos:

const handleSubmit = async () => {
  if (isSubmitting) return;
  
  setIsSubmitting(true);
  
  try {
    // Validaciones básicas (según el modelo)
    if (!categoryData.categorie || !categoryData.subCategory) {
      showAlertMessage("❌ Sélectionnez une catégorie et sous-catégorie", "danger");
      setIsSubmitting(false);
      return;
    }
    
    const allData = getAllPostData();
    
    if (!allData.title) {
      showAlertMessage("❌ Le titre est requis", "danger");
      setIsSubmitting(false);
      return;
    }
    
    if (!allData.description) {
      showAlertMessage("❌ La description est requise", "danger");
      setIsSubmitting(false);
      return;
    }
    
    if (!allData.price || parseFloat(allData.price) <= 0) {
      showAlertMessage("❌ Un prix valide est requis", "danger");
      setIsSubmitting(false);
      return;
    }
    
    if (!allData.wilaya || !allData.commune) {
      showAlertMessage("❌ La wilaya et la commune sont requises", "danger");
      setIsSubmitting(false);
      return;
    }
    
    if (images.length === 0) {
      showAlertMessage("❌ Ajoutez au moins une image", "danger");
      setIsSubmitting(false);
      return;
    }
    
    // 🔥 ESTRUCTURA QUE ESPERA EL BACKEND
    const postDataForBackend = {
      // 1. Campos de categoría
      categorie: categoryData.categorie,
      subCategory: categoryData.subCategory,
      articleType: categoryData.articleType || '',
      
      // 2. Campos comunes obligatorios
      title: allData.title || '',
      description: allData.description || '',
      price: parseFloat(allData.price) || 0,
      etat: allData.etat || 'occasion',
      
      // 3. Campos de contacto (opcionales)
      phone: allData.telephone || allData.phone || '',
      email: allData.email || '',
      
      // 4. Campos de ubicación obligatorios
      wilaya: allData.wilaya || '',
      commune: allData.commune || '',
      address: allData.address || '',
      
      // 5. Campos específicos de categoría
      categorySpecificData: {}
    };
    
    console.log('📤 Datos preparados para backend:', postDataForBackend);
    
    // 🔥 Separar campos que van en categorySpecificData
    // Campos que NO van en categorySpecificData (van en el nivel principal)
    const mainFields = [
      'categorie', 'subCategory', 'articleType',
      'title', 'description', 'price', 'etat',
      'phone', 'email', 'wilaya', 'commune', 'address',
      'telephone' // también en nivel principal como 'phone'
    ];
    
    // Agregar campos específicos a categorySpecificData
    Object.keys(specificData).forEach(key => {
      if (!mainFields.includes(key) && 
          specificData[key] !== undefined && 
          specificData[key] !== null && 
          specificData[key] !== '') {
        postDataForBackend.categorySpecificData[key] = specificData[key];
      }
    });
    
    // 🔥 También agregar algunos campos de commonData a categorySpecificData si son específicos
    // Por ejemplo, si hay campos en commonData que son específicos de categoría
    const specificCommonFields = ['marque', 'modele', 'annee', 'kilometrage', 'couleur'];
    specificCommonFields.forEach(field => {
      if (commonData[field] && commonData[field] !== '') {
        postDataForBackend.categorySpecificData[field] = commonData[field];
      }
    });
    
    console.log('📦 categorySpecificData:', postDataForBackend.categorySpecificData);
    
    // Preparar imágenes
    const imagesForBackend = images.map((img, index) => ({
      url: img.url || img,
      public_id: img.public_id || '',
      isMain: index === 0,
      isExisting: img.isExisting || false
    }));
    
    // Ejecutar acción
    let result;
    
    if (isEdit && postToEdit) {
      result = await dispatch(updatePost(
        postToEdit._id,
        postDataForBackend,
        auth
      ));
    } else {
      result = await dispatch(createPost({
        postData: postDataForBackend,
        images: imagesForBackend,
        auth
      }));
    }
    
    if (result && result.success === false) {
      throw new Error(result.error);
    }
    
    showAlertMessage(
      isEdit 
        ? '✅ Annonce mise à jour avec succès!' 
        : '✅ Annonce créée avec succès!',
      "success"
    );
    
    setTimeout(() => {
      history.push('/');
    }, 1500);
    
  } catch (error) {
    console.error('❌ Error:', error);
    
    // Manejar errores específicos del backend
    let errorMessage = 'Erreur lors de la publication';
    
    if (error.response && error.response.data) {
      const backendError = error.response.data;
      if (backendError.error) {
        errorMessage = backendError.error;
      } else if (backendError.message) {
        errorMessage = backendError.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    showAlertMessage(`❌ ${errorMessage}`, "danger", 6000);
  } finally {
    setIsSubmitting(false);
  }
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

    const allPostData = getAllPostData();

    switch(currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="step-content"
          >
            <Card className="border-0">
              <Card.Body>
                <h5 className="text-center mb-3">
                  {isEdit ? '✏️ Modifier la catégorie' : '🏷️ Sélectionnez une catégorie'}
                </h5>
                
                {/* Mostrar categoría actual si existe */}
                {(categoryData.categorie && categoryData.subCategory) && (
                  <div className={`alert ${hasManuallyGoneBack ? 'alert-info' : 'alert-success'} py-2 mb-3`}>
                    <div className="d-flex align-items-center justify-content-between">
                      <div>
                        <i className={`fas fa-${hasManuallyGoneBack ? 'info-circle' : 'check-circle'} me-2`}></i>
                        <small>
                          <strong>{categoryData.categorie}</strong>
                          {categoryData.subCategory && <span> → {categoryData.subCategory}</span>}
                          {categoryData.articleType && <span> ({categoryData.articleType})</span>}
                        </small>
                      </div>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => {
                          setCategoryData({
                            categorie: '',
                            articleType: '',
                            subCategory: ''
                          });
                          setSpecificData({});
                          setCommonData({
                            wilaya: '',
                            commune: '',
                            price: '',
                            description: ''
                          });
                          setHasManuallyGoneBack(false);
                        }}
                      >
                        <i className="fas fa-sync-alt me-1"></i>
                        Changer
                      </Button>
                    </div>
                  </div>
                )}
                
                <CategoryAccordion
                  postData={categoryData}
                  handleChangeInput={handleInputChange}
                />
                
                {/* Botón manual para avanzar */}
                {categoryData.categorie && categoryData.subCategory && hasManuallyGoneBack && (
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
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="step-content"
          >
            {/* Botón para volver a categoría en modo edición */}
            {isEdit && currentStep > 1 && (
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
              </div>
            )}
            
            <DynamicFieldManager
              mainCategory={categoryData.categorie}
              subCategory={categoryData.subCategory}
              articleType={categoryData.articleType}
              currentStep={currentStep}
              onStepChange={handleStepChange}
              showNavigation={false}
              isEdit={isEdit}
              postData={allPostData}
              handleChangeInput={handleInputChange}
              isRTL={isRTL}
            />
          </motion.div>
        );
        
      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="step-content"
          >
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
      <div className="border-0 shadow-sm overflow-hidden rounded">
        <AnimatePresence mode="wait">
          {renderCurrentStep()}
        </AnimatePresence>
      </div>

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
                onClick={() => {
                  if (canProceedToNextStep()) {
                    handleStepChange(currentStep + 1);
                  } else {
                    // Mostrar mensaje específico según el paso
                    let message = '';
                    switch(currentStep) {
                      case 1: message = "Sélectionnez une catégorie et sous-catégorie"; break;
                      case 2: message = "Complétez le titre et la description"; break;
                      case 3: message = "Indiquez un prix valide"; break;
                      case 4: message = "Renseignez la wilaya et la commune"; break;
                    }
                    showAlertMessage(`❌ ${message}`, "warning", 3000);
                  }
                }}
                disabled={isSubmitting}
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
        
        {/* Mensaje de validación específico para paso 4 */}
        {currentStep === 4 && !canProceedToNextStep() && (
          <div className="alert alert-warning mt-3 mb-0 py-2">
            <i className="fas fa-exclamation-circle me-2"></i>
            <small>Veuillez remplir la wilaya et la commune pour continuer.</small>
          </div>
        )}
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