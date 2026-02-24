
// 📂 pages/CreateAnnoncePage.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Button, Alert, Spinner, Card, Row, Col, Badge } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { createPost, updatePost } from '../redux/actions/postAction';
// Importar el componente BoutiqueCategoryDisplay
import BoutiqueCategoryDisplay from '../components/CATEGORIES/BoutiqueCategoryDisplay';

import { getCategoriesForAccordion } from '../redux/actions/categoryAction';
import CategoryAccordion from '../components/CATEGORIES/CategoryAccordion';
import DynamicFieldManager from '../components/CATEGORIES/DynamicFieldManager';
import ImagesStep from '../components/CATEGORIES/camposComun/ImagesStep';
import axios from 'axios';
import { BASE_URL } from '../utils/config';

const CreateAnnoncePage = () => {
  // ============ HOOKS ============
  const { auth, category: categoryState, socket } = useSelector((state) => state);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { i18n } = useTranslation();
  const { id: postId, boutiqueId } = useParams(); // 🔹 Detectar si hay boutiqueId en la URL
  const isBoutiqueMode = Boolean(boutiqueId || location.state?.boutiqueId); // 🔹 Modo boutique inteligente
  const isRTL = i18n.language === 'ar';
  const isEdit = location.state?.isEdit || !!postId;
  const postToEdit = location.state?.postData || null;

  // ============ ESTADOS ============
  const autoAdvanceTimeout = useRef(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [categoryData, setCategoryData] = useState({ categorie: '', articleType: '', subCategory: '' });
  const [specificData, setSpecificData] = useState({});
  const [commonData, setCommonData] = useState({});
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'info' });
  const [isLoadingEditData, setIsLoadingEditData] = useState(true);
  const [hasManuallyGoneBack, setHasManuallyGoneBack] = useState(false);

  // 📥 Cargar categorías
  useEffect(() => {
    if (categoryState.accordionCategories?.length === 0 && !categoryState.accordionLoading) {
      dispatch(getCategoriesForAccordion());
    }
  }, [dispatch, categoryState.accordionCategories, categoryState.accordionLoading]);

  // 📥 Cargar datos de edición
  useEffect(() => {
    const loadEditData = async () => {
      if (!isEdit) {
        setIsLoadingEditData(false);
        return;
      }

      setIsLoadingEditData(true);
      try {
        let postDataToLoad = postToEdit;
        if (postId && !postToEdit) {
          const res = await axios.get(`${BASE_URL}/api/posts/${postId}`);
          postDataToLoad = res.data.post;
        }

        if (postDataToLoad) {
          setCategoryData({
            categorie: postDataToLoad.categorie || '',
            subCategory: postDataToLoad.subCategory || '',
            articleType: postDataToLoad.articleType || ''
          });

          const exclude = ['categorie', 'subCategory', 'articleType', 'images', '_id', 'createdAt', 'updatedAt', 'user', 'categorySpecificData', '__v', 'likes', 'comments', 'views'];
          const common = {};
          Object.entries(postDataToLoad).forEach(([k, v]) => {
            if (!exclude.includes(k) && v !== undefined && v !== null && v !== '') common[k] = v;
          });
          setCommonData(common);
          setSpecificData(postDataToLoad.categorySpecificData || {});

          const loadedImages = (postDataToLoad.images || []).map((img, i) =>
            typeof img === 'string' ? { url: img, public_id: `existing_${i}`, isExisting: true } :
            { url: img.url, public_id: img.public_id || `existing_${i}`, isExisting: true }
          );
          setImages(loadedImages);

          setCurrentStep(2);
          setAlert({ show: true, message: "📝 Mode édition activé.", variant: "info" });
        }
      } catch (error) {
        setAlert({ show: true, message: `❌ ${error.message}`, variant: "danger" });
      } finally {
        setIsLoadingEditData(false);
      }
    };

    loadEditData();
  }, [isEdit, postId, postToEdit, location.state]);

  // ⚡ Avance automático step 2
  useEffect(() => {
    if (hasManuallyGoneBack || isEdit || currentStep !== 1) return;
    const hasCategory = categoryData.categorie && categoryData.subCategory;
    if (hasCategory) {
      autoAdvanceTimeout.current = setTimeout(() => {
        if (categoryData.categorie && categoryData.subCategory && currentStep === 1 && !hasManuallyGoneBack) {
          setCurrentStep(2);
          setAlert({ show: true, message: "✅ Catégorie sélectionnée.", variant: "success" });
        }
      }, 500);
    }
    return () => clearTimeout(autoAdvanceTimeout.current);
  }, [categoryData, currentStep, hasManuallyGoneBack, isEdit]);

  // 🎯 Cambios de input
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    if (['categorie', 'articleType', 'subCategory'].includes(name)) {
      setCategoryData(prev => {
        const newData = { ...prev, [name]: val };
        if (name === 'categorie') {
          newData.articleType = ''; newData.subCategory = ''; setSpecificData({});
          if (currentStep === 1) setHasManuallyGoneBack(false);
        } else if (name === 'articleType' || name === 'subCategory') setSpecificData({});
        return newData;
      });
    } else if (['wilaya', 'commune', 'price', 'description', 'title', 'telephone', 'phone', 'email', 'address', 'etat'].includes(name)) {
      setCommonData(prev => ({ ...prev, [name]: val }));
    } else {
      setSpecificData(prev => (val ? { ...prev, [name]: val } : Object.fromEntries(Object.entries(prev).filter(([k]) => k !== name))));
    }
  }, [currentStep]);

  const handleCategorySelect = useCallback((selected) => {
    ['categorie', 'subCategory', 'articleType'].forEach(field => {
      if (selected[field]) handleInputChange({ target: { name: field, value: selected[field] } });
    });
    setAlert({ show: true, message: `✅ "${selected.subCategory || selected.categorie}" sélectionnée`, variant: "success" });
  }, [handleInputChange]);

  const handleStepChange = (newStep) => {
    clearTimeout(autoAdvanceTimeout.current);
    if (newStep === 1) setHasManuallyGoneBack(true);
    else if (newStep > currentStep) setHasManuallyGoneBack(false);
    setCurrentStep(newStep);
  };

  const showAlertMessage = (message, variant = 'info', duration = 4000) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'info' }), duration);
  };

  // 🚀 Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) return showAlertMessage("Ajoutez des photos.", "danger");
    if (!categoryData.categorie || !categoryData.subCategory || !commonData.title || !commonData.wilaya || !commonData.commune)
      return showAlertMessage("Remplissez les champs requis.", "warning");

    setIsSubmitting(true);
    try {
      const postContent = {
        categorie: categoryData.categorie,
        subCategory: categoryData.subCategory,
        articleType: categoryData.articleType || '',
        title: commonData.title,
        description: commonData.description || '',
        price: commonData.price || 0,
        etat: commonData.etat || 'occasion',
        wilaya: commonData.wilaya,
        commune: commonData.commune,
        address: commonData.address || '',
        phone: commonData.phone || commonData.telephone || '',
        email: commonData.email || '',
        categorySpecificData: specificData
      };

      if (isEdit && postToEdit?._id) {
        await dispatch(updatePost({ postId: postToEdit._id, postData: postContent, images, auth }));
        showAlertMessage('✅ Modifié!', "success");
        setTimeout(() => history.push('/'), 1200);
      } else {
        if (isBoutiqueMode) {
          await axios.post(`${BASE_URL}/api/${boutiqueId}/posts`, { ...postContent, images }, {
            headers: { Authorization: auth.token }
          });
        } else {
          await dispatch(createPost({ postData: postContent, images, auth, socket }));
        }
        showAlertMessage('✅ Publié!', "success");
        setTimeout(() => history.push('/'), 1200);
      }
    } catch (err) {
      showAlertMessage(err.response?.data?.msg || err.message || 'Erreur de publication', "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🎨 Render pasos
  const renderCurrentStep = () => {
    if (isLoadingEditData) return <div className="text-center py-4"><Spinner animation="border" /><p>Chargement...</p></div>;
    const allPostData = { ...categoryData, ...commonData, ...specificData };

    switch (currentStep) {
      case 1:
        return (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <Card className="border-0">
        <h5 className="text-center mb-3">
          {isEdit ? '✏️ Modifier la catégorie' : '🏷️ Sélectionnez une catégorie'}
        </h5>

        {isBoutiqueMode ? (
          <BoutiqueCategoryDisplay boutiqueData={categoryData} handleChange={handleInputChange} />
        ) : (
          <CategoryAccordion 
            postData={categoryData} 
            handleChangeInput={handleInputChange} 
            onFieldChange={handleCategorySelect} 
            disabled={isSubmitting || categoryState.accordionLoading} 
          />
        )}

        {categoryData.categorie && categoryData.subCategory && (
          <div className="text-center mt-3">
            <Button variant="primary" size="sm" onClick={() => handleStepChange(2)}>
              Continuer
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
        );
      case 5:
        return (
          <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <ImagesStep images={images} setImages={setImages} isRTL={isRTL} onComplete={handleSubmit} onBack={() => handleStepChange(4)} isEdit={isEdit} isSubmitting={isSubmitting} />
          </motion.div>
        );
      default:
        return (
          <motion.div key={`step${currentStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <DynamicFieldManager mainCategory={categoryData.categorie} subCategory={categoryData.subCategory} articleType={categoryData.articleType} currentStep={currentStep} onStepChange={handleStepChange} showNavigation={false} isEdit={isEdit} postData={allPostData} handleChangeInput={handleInputChange} isRTL={isRTL} />
          </motion.div>
        );
    }
  };

  // 🖼️ UI
  const stepTitles = [
    { title: 'Catégorie', icon: '🏷️', step: 1 },
    { title: 'Détails', icon: '📝', step: 2 },
    { title: 'Spécifications', icon: '🔍', step: 3 },
    { title: 'Contact', icon: '📍', step: 4 },
    { title: 'Photos', icon: '🖼️', step: 5 }
  ];

  return (
    <Container className="py-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <AnimatePresence>
        {alert.show && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <Alert variant={alert.variant} dismissible onClose={() => setAlert({ ...alert, show: false })}>
              <div><span>{alert.message}</span></div>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="text-center mb-4">
        <h1 className="fw-bold mb-2">{isEdit ? '✏️ Modifier une annonce' : '➕ Publier une annonce'}</h1>
        {isBoutiqueMode && (
          <Alert variant="info" className="text-center mb-3 py-2">
            <i className="fas fa-store me-2"></i>
            Vous publiez ce produit dans votre <strong>boutique</strong>.
          </Alert>
        )}
      </div>

      {/* Indicador de pasos */}
      <div className="mb-4 d-flex justify-content-between align-items-center">
        {stepTitles.map((s, i) => (
          <React.Fragment key={s.step}>
            <div className="text-center flex-grow-1">
              <button className={`step-indicator ${currentStep === s.step ? 'active' : ''}`} onClick={() => handleStepChange(s.step)} disabled={isSubmitting}>
                <div className="step-icon-wrapper"><span className="step-icon">{s.icon}</span></div>
                <div className="step-label mt-1"><small>{s.title}</small></div>
              </button>
            </div>
            {i < stepTitles.length - 1 && <div className="connector-line flex-grow-1"></div>}
          </React.Fragment>
        ))}
      </div>

      <div className="border-0 shadow-sm overflow-hidden rounded">
        <AnimatePresence mode="wait">{renderCurrentStep()}</AnimatePresence>
      </div>

      <div className="mt-4 pt-3 border-top">
        <Row className="g-3">
          <Col xs={6}>
            <Button variant="outline-secondary" size="lg" onClick={() => handleStepChange(currentStep - 1)} disabled={currentStep === 1 || isSubmitting} className="w-100 py-2">
              <i className="fas fa-arrow-left me-2"></i>Retour
            </Button>
          </Col>
          <Col xs={6}>
            {currentStep < 5 ? (
              <Button variant="primary" size="lg" onClick={() => handleStepChange(currentStep + 1)} disabled={isSubmitting} className="w-100 py-2">
                Suivant <i className="fas fa-arrow-right ms-2"></i>
              </Button>
            ) : (
              <Button variant={isEdit ? "warning" : "success"} size="lg" onClick={handleSubmit} disabled={isSubmitting} className="w-100 py-2">
                {isSubmitting ? (<><Spinner size="sm" animation="border" className="me-2" />{isEdit ? 'Mise à jour...' : 'Publication...'}</>) : (<><i className={`fas ${isEdit ? 'fa-save' : 'fa-paper-plane'} me-2`}></i>{isEdit ? 'Mettre à jour' : 'Publier'}</>)}
              </Button>
            )}
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default CreateAnnoncePage;
 
