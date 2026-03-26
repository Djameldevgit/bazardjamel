// src/pages/boutique/CreateBoutiqueProductPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Button, Alert, Spinner, Form } from 'react-bootstrap';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStore, FaArrowLeft, FaMapMarkerAlt, FaPhone, FaEnvelope, FaEdit } from 'react-icons/fa';

import { getBoutique } from '../../redux/actions/boutiqueAction';
import { createBoutiqueProduct, updateBoutiqueProduct } from '../../redux/actions/boutiqueProductAction';
import { getCategoryTree } from '../../redux/actions/categoryAction';

import BoutiqueCategoryDisplay from '../../components/CATEGORIES/BoutiqueCategoryDisplay';
import ImagesStep from './ImagesStep';

const CreateBoutiqueProductPage = () => {
  const { boutiqueId, productId } = useParams();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  
  // 🔥 FORMA CORRECTA Y SIMPLE
  const auth = useSelector(state => state.auth);
  const { currentBoutique, loading } = useSelector(state => state.boutique || {});
  const { categoryTree, loading: categoryLoading } = useSelector(state => state.category || {});

  const isEdit = location.state?.isEdit === true || !!productId;
  const productToEdit = location.state?.productData || location.state?.postData || null;

  // Estados del formulario
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    etat: 'neuf',
    wilaya: '',
    commune: '',
    address: '',
    phone: '',
    email: '',
    categorie: '',
    subCategory: '',
    articleType: ''
  });
  const [specificData, setSpecificData] = useState({});
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'info' });
  const [dynamicFields, setDynamicFields] = useState([]);
  const [articleTypes, setArticleTypes] = useState([]);

  // Log para depuración
  useEffect(() => {
    console.log('📝 CreateBoutiqueProductPage - Debug:', {
      isEdit,
      productId,
      boutiqueId,
      hasProductToEdit: !!productToEdit,
      hasAuth: !!auth,
      hasToken: !!auth?.token,
      userId: auth?.user?._id,
      locationState: location.state
    });
  }, [isEdit, productId, boutiqueId, productToEdit, auth, location]);

  // Cargar datos
  useEffect(() => {
    if (boutiqueId) {
      console.log('🔄 Cargando boutique:', boutiqueId);
      dispatch(getBoutique(boutiqueId));
    }
    console.log('🔄 Cargando árbol de categorías');
    dispatch(getCategoryTree());
  }, [dispatch, boutiqueId]);

  // Cargar datos del producto en modo edición
  useEffect(() => {
    if (isEdit && productToEdit) {
      console.log('✅ Cargando producto para edición:', productToEdit);
      
      setFormData({
        title: productToEdit.title || '',
        description: productToEdit.description || '',
        price: productToEdit.price || '',
        etat: productToEdit.etat || 'neuf',
        wilaya: productToEdit.wilaya || '',
        commune: productToEdit.commune || '',
        address: productToEdit.address || '',
        phone: productToEdit.phone || '',
        email: productToEdit.email || '',
        categorie: productToEdit.categorie || '',
        subCategory: productToEdit.subCategory || '',
        articleType: productToEdit.articleType || ''
      });

      setSpecificData(productToEdit.categorySpecificData || {});

      if (productToEdit.images && productToEdit.images.length > 0) {
        const existingImages = productToEdit.images.map((img, index) => ({
          url: img.url || img,
          public_id: img.public_id || `existing_${index}`,
          isExisting: true
        }));
        setImages(existingImages);
      }

      setCurrentStep(2);
    }
  }, [isEdit, productToEdit]);

  // Precargar datos de la boutique para creación
  useEffect(() => {
    if (currentBoutique && !isEdit && !formData.categorie) {
      console.log('🏪 Precargando datos de la boutique:', currentBoutique);
      setFormData(prev => ({
        ...prev,
        categorie: currentBoutique.categorie || '',
        subCategory: currentBoutique.subCategory || '',
        articleType: currentBoutique.articleType || '',
        wilaya: currentBoutique.proprietaire?.wilaya || '',
        commune: currentBoutique.proprietaire?.commune || '',
        address: currentBoutique.proprietaire?.adresse || '',
        phone: currentBoutique.proprietaire?.telephone || '',
        email: currentBoutique.proprietaire?.email || ''
      }));
    }
  }, [currentBoutique, isEdit]);

  // Función para campos dinámicos
  const loadDynamicFieldsForArticle = (articleSlug) => {
    if (!categoryTree || categoryTree.length === 0) return;

    const findArticleFields = (categories) => {
      for (let cat of categories) {
        if (cat.children) {
          for (let sub of cat.children) {
            if (sub.children) {
              for (let article of sub.children) {
                if (article.slug === articleSlug || article.name === articleSlug) {
                  return article.fields || [];
                }
              }
            }
          }
        }
      }
      return [];
    };

    const fields = findArticleFields(categoryTree);
    console.log('📋 Campos dinámicos cargados:', fields);
    setDynamicFields(fields);
  };

  useEffect(() => {
    if (formData.articleType) {
      loadDynamicFieldsForArticle(formData.articleType);
    }
  }, [formData.articleType, categoryTree]);

  // Obtener tipos de artículo
  useEffect(() => {
    if (formData.subCategory && categoryTree) {
      const findArticleTypes = () => {
        for (let cat of categoryTree) {
          if (cat.children) {
            for (let sub of cat.children) {
              if (sub.slug === formData.subCategory || sub.name === formData.subCategory) {
                return sub.children?.map(child => ({
                  value: child.slug,
                  label: child.name,
                  icon: child.icon
                })) || [];
              }
            }
          }
        }
        return [];
      };
      
      const types = findArticleTypes();
      console.log('🏷️ Tipos de artículo disponibles:', types);
      setArticleTypes(types);
    }
  }, [formData.subCategory, categoryTree]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSpecificFieldChange = (e) => {
    const { name, value } = e.target;
    setSpecificData(prev => ({ ...prev, [name]: value }));
  };

  const handleStepChange = (newStep) => {
    setCurrentStep(newStep);
    window.scrollTo(0, 0);
  };

  const showAlertMessage = (message, variant = 'info') => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ show: false, message: '', variant: 'info' }), 4000);
  };

  const validateStep = () => {
    switch(currentStep) {
      case 1:
        return formData.categorie && formData.subCategory;
      case 2:
        return formData.title && formData.description;
      case 3:
        return true;
      case 4:
        return formData.wilaya && formData.commune && formData.phone;
      case 5:
        return images.length > 0;
      default:
        return true;
    }
  };

  // 🔥 HANDLE SUBMIT SIMPLIFICADO
  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🚀 handleSubmit ejecutado');
    console.log('🔑 Auth disponible:', !!auth?.token);
    console.log('👤 User ID:', auth?.user?._id);
    
    // Verificar autenticación
    if (!auth || !auth.token) {
      console.error('❌ No hay token de autenticación');
      showAlertMessage('Veuillez vous reconnecter pour ajouter/modifier un produit', 'danger');
      return;
    }
    
    if (!validateStep()) {
      return showAlertMessage("Veuillez remplir tous les champs requis.", "warning");
    }

    setIsSubmitting(true);

    try {
      const productContent = {
        ...formData,
        categorySpecificData: specificData
      };

      console.log('📦 Enviando producto...', productContent);

      if (isEdit && productId) {
        console.log('📝 Mise à jour du produit:', productId);
        await dispatch(updateBoutiqueProduct({
          boutiqueId,
          productId: productId,
          productData: productContent,
          images,
          auth  // 🔥 PASAR AUTH DIRECTAMENTE
        }));
        showAlertMessage("✅ Produit mis à jour avec succès!", "success");
      } else {
        console.log('➕ Création d\'un nouveau produit');
        const result = await dispatch(createBoutiqueProduct({
          boutiqueId,
          productData: productContent,
          images,
          auth  // 🔥 PASAR AUTH DIRECTAMENTE
        }));
        console.log('✅ Producto creado exitosamente:', result);
        showAlertMessage("✅ Produit ajouté à la boutique avec succès!", "success");
      }
      
      setTimeout(() => {
        console.log('⏳ Redirigiendo a:', `/boutique/${boutiqueId}`);
        history.push(`/boutique/${boutiqueId}`);
      }, 1500);

    } catch (err) {
      console.error('❌ Error en submit:', err);
      console.error('❌ Detalles:', err.response?.data);
      showAlertMessage(err.response?.data?.message || err.message || "Erreur lors de l'opération", "danger");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h5 className="text-center mb-4">Catégorie du produit</h5>
            
            <BoutiqueCategoryDisplay 
              categoryData={{
                categorie: formData.categorie,
                subCategory: formData.subCategory,
                articleType: formData.articleType
              }}
              boutiqueInfo={currentBoutique}
            />

            {articleTypes.length > 0 && (
              <Form.Group className="mt-4">
                <Form.Label>Type d'article</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {articleTypes.map(type => (
                    <Button
                      key={type.value}
                      variant={formData.articleType === type.value ? "primary" : "outline-primary"}
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, articleType: type.value }))}
                    >
                      {type.icon && <span className="me-1">{type.icon}</span>}
                      {type.label}
                    </Button>
                  ))}
                </div>
              </Form.Group>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h5 className="text-center mb-4">Détails du produit</h5>
            
            <Form.Group className="mb-3">
              <Form.Label>Titre *</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description *</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Prix (DA)</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>État</Form.Label>
              <Form.Select name="etat" value={formData.etat} onChange={handleInputChange}>
                <option value="neuf">Neuf</option>
                <option value="comme-neuf">Comme neuf</option>
                <option value="bon-etat">Bon état</option>
                <option value="correct">Correct</option>
              </Form.Select>
            </Form.Group>
          </motion.div>
        );

      case 3:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h5 className="text-center mb-4">Caractéristiques spécifiques</h5>
            
            {dynamicFields.length > 0 ? (
              dynamicFields.map((field, index) => (
                <Form.Group key={index} className="mb-3">
                  <Form.Label>{field.label}</Form.Label>
                  {field.type === 'select' ? (
                    <Form.Select
                      name={field.name}
                      value={specificData[field.name] || ''}
                      onChange={handleSpecificFieldChange}
                    >
                      <option value="">Sélectionnez...</option>
                      {field.options?.map((opt, i) => (
                        <option key={i} value={opt}>{opt}</option>
                      ))}
                    </Form.Select>
                  ) : field.type === 'textarea' ? (
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name={field.name}
                      value={specificData[field.name] || ''}
                      onChange={handleSpecificFieldChange}
                    />
                  ) : (
                    <Form.Control
                      type={field.type || 'text'}
                      name={field.name}
                      value={specificData[field.name] || ''}
                      onChange={handleSpecificFieldChange}
                    />
                  )}
                </Form.Group>
              ))
            ) : (
              <p className="text-muted text-center py-4">
                Aucune caractéristique spécifique pour cette catégorie
              </p>
            )}
          </motion.div>
        );

      case 4:
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <h5 className="text-center mb-4">Contact et localisation</h5>
            
            <Form.Group className="mb-3">
              <Form.Label><FaMapMarkerAlt className="me-2 text-danger" />Wilaya *</Form.Label>
              <Form.Control type="text" name="wilaya" value={formData.wilaya} onChange={handleInputChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Commune *</Form.Label>
              <Form.Control type="text" name="commune" value={formData.commune} onChange={handleInputChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Adresse complète</Form.Label>
              <Form.Control type="text" name="address" value={formData.address} onChange={handleInputChange} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><FaPhone className="me-2 text-primary" />Téléphone *</Form.Label>
              <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label><FaEnvelope className="me-2 text-danger" />Email</Form.Label>
              <Form.Control type="email" name="email" value={formData.email} onChange={handleInputChange} />
            </Form.Group>
          </motion.div>
        );

      case 5:
        return (
          <ImagesStep
            images={images}
            setImages={setImages}
            onComplete={handleSubmit}
            onBack={() => handleStepChange(4)}
            isEdit={isEdit}
            isSubmitting={isSubmitting}
          />
        );

      default:
        return null;
    }
  };

  if (loading || categoryLoading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement...</p>
      </Container>
    );
  }

  if (!currentBoutique && !loading) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Boutique non trouvée</Alert.Heading>
          <p>La boutique que vous recherchez n'existe pas.</p>
          <Button variant="danger" onClick={() => history.goBack()}>Retour</Button>
        </Alert>
      </Container>
    );
  }

  const isStepValid = validateStep();

  return (
    <Container className="py-4" style={{ maxWidth: '800px' }}>
      <div className="d-flex align-items-center mb-4">
        <Button variant="link" className="p-0 me-3 text-dark" onClick={() => history.goBack()}>
          <FaArrowLeft size={20} />
        </Button>
        <div>
          <h4 className="mb-1 fw-bold">
            {isEdit ? <><FaEdit className="me-2 text-primary" />Modifier le produit</> : 'Ajouter un produit'}
          </h4>
          <div className="d-flex align-items-center text-muted">
            <FaStore className="me-1" />
            <span>{currentBoutique?.nom_boutique || 'Boutique'}</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {alert.show && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="mb-4">
            <Alert variant={alert.variant} dismissible onClose={() => setAlert({...alert, show: false})}>
              {alert.message}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mb-4">
        <div className="d-flex justify-content-between">
          {[1,2,3,4,5].map(step => (
            <div key={step} style={{ width: '18%', height: '4px', backgroundColor: currentStep >= step ? '#6366F1' : '#e9ecef', borderRadius: '2px' }} />
          ))}
        </div>
        <div className="d-flex justify-content-between mt-2 small text-muted">
          <span>Catégorie</span><span>Détails</span><span>Caract.</span><span>Contact</span><span>Photos</span>
        </div>
      </div>

      <Card className="border-0 shadow-sm">
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">{renderStepContent()}</AnimatePresence>
          </Form>
        </Card.Body>
      </Card>

      <div className="mt-4">
        <Row>
          <Col xs={6}>
            <Button 
              variant="outline-secondary" 
              size="lg" 
              onClick={() => handleStepChange(currentStep - 1)} 
              disabled={currentStep === 1 || isSubmitting} 
              className="w-100"
            >
              ← Retour
            </Button>
          </Col>
          <Col xs={6}>
            {currentStep < 5 ? (
              <Button 
                variant="primary" 
                size="lg" 
                onClick={() => handleStepChange(currentStep + 1)} 
                disabled={!isStepValid || isSubmitting} 
                className="w-100"
              >
                Suivant →
              </Button>
            ) : (
              <Button 
                variant={isEdit ? "warning" : "success"} 
                size="lg" 
                onClick={handleSubmit} 
                disabled={!isStepValid || isSubmitting || images.length === 0} 
                className="w-100"
              >
                {isSubmitting ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    {isEdit ? 'Mise à jour...' : 'Publication...'}
                  </>
                ) : (
                  isEdit ? 'Mettre à jour' : 'Publier dans la boutique'
                )}
              </Button>
            )}
          </Col>
        </Row>
      </div>
    </Container>
  );
};

export default CreateBoutiqueProductPage;