// 📂 src/components/boutique/CreateBoutiqueWizard.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Spinner, Badge, ProgressBar, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { createBoutique, updateBoutique } from '../../redux/actions/boutiqueAction';
import { checkImage } from '../../utils/imageUpload';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

const CreateBoutiqueWizard = ({ onSuccess, isEdit = false, boutiqueData = null }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth, alert } = useSelector(state => state);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    nom_boutique: '',
    domaine_boutique: '',
    slogan_boutique: '',
    description_boutique: '',
    categories_produits: [],
    couleur_theme: '#2563eb',
    plan_boutique: '',
    duree_abonnement: '',
    proprietaire: {
      nom: '',
      email: '',
      telephone: '',
      wilaya: '',
      adresse: ''
    },
    reseaux_sociaux: {
      facebook: '',
      instagram: '',
      tiktok: '',
      whatsapp: '',
      website: ''
    },
    logo: null,
    logoPreview: '',
    logoUrl: '',
    accepte_conditions: false
  });
  
  // Opciones de categorías para react-select
  const categoryOptions = [
    { value: 'mode', label: 'Mode et vêtements' },
    { value: 'technologie', label: 'Technologie et électronique' },
    { value: 'cosmetique', label: 'Cosmétique et beauté' },
    { value: 'maison', label: 'Maison et décoration' },
    { value: 'enfants', label: 'Enfants et bébés' },
    { value: 'sport', label: 'Sport et loisirs' },
    { value: 'alimentation', label: 'Alimentation et boissons' },
    { value: 'livres', label: 'Livres et éducation' },
    { value: 'artisanat', label: 'Artisanat et fait main' },
    { value: 'autre', label: 'Autre' }
  ];
  
  // Planes disponibles
  const PLANS = [
    {
      id: 'gratuit',
      name: 'Plan Gratuit',
      credits: 0,
      storage: '100 MB',
      max_products: 10,
      features: ['Site Builder', 'Tableau de bord', 'Support basic']
    },
    {
      id: 'basique',
      name: 'Plan Basique',
      credits: 500,
      storage: '1 GB',
      max_products: 50,
      features: ['Site Builder', 'Nom de domaine', 'Support prioritaire', 'Statistiques avancées']
    },
    {
      id: 'premium',
      name: 'Plan Premium',
      credits: 1000,
      storage: '5 GB',
      max_products: 200,
      features: ['Site Builder Pro', 'Nom de domaine', 'Marketing tools', 'Support 24/7', 'API access']
    },
    {
      id: 'entreprise',
      name: 'Plan Entreprise',
      credits: 2000,
      storage: '20 GB',
      max_products: 1000,
      features: ['Site Builder Pro', 'Multi-domaines', 'Team management', 'Support dédié', 'Custom solutions']
    }
  ];
  
  // Opciones de durée d'abonnement
  const DUREES = [
    { id: '1mois', name: '1 Mois', creditsMultiplier: 1 },
    { id: '3mois', name: '3 Mois', creditsMultiplier: 2.7, discount: '10%' },
    { id: '6mois', name: '6 Mois', creditsMultiplier: 5.4, discount: '20%' },
    { id: '1an', name: '1 An', creditsMultiplier: 10.8, discount: '30%' }
  ];
  
  // Calculer crédits totaux
  const calculateTotalCredits = () => {
    const plan = PLANS.find(p => p.id === formData.plan_boutique);
    const duree = DUREES.find(d => d.id === formData.duree_abonnement);
    
    if (!plan || !duree) return 0;
    return Math.round(plan.credits * duree.creditsMultiplier);
  };
  
  // Gérer cambios en el formulario - SIMPLIFICADO
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Manejar campos anidados
    if (name.startsWith('proprietaire.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        proprietaire: {
          ...prev.proprietaire,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } 
    else if (name.startsWith('reseaux_sociaux.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        reseaux_sociaux: {
          ...prev.reseaux_sociaux,
          [field]: value
        }
      }));
    } 
    else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };
  
  // Manejar cambio de categorías (react-select)
  const handleCategoriesChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
    
    setFormData(prev => ({
      ...prev,
      categories_produits: selectedValues
    }));
  };
  
  // Manejar cambio de logo
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Verificar la imagen usando la función checkImage
    const err = checkImage(file);
    if (err) {
      setError(err);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      logo: file,
      logoPreview: URL.createObjectURL(file)
    }));
  };
  
  // Eliminar logo
  const handleRemoveLogo = () => {
    setFormData(prev => ({
      ...prev,
      logo: null,
      logoPreview: '',
      logoUrl: ''
    }));
  };
  
  // Función especial para manejar selección de plan
  const handlePlanSelect = (planId) => {
    setFormData(prev => ({
      ...prev,
      plan_boutique: planId
    }));
  };
  
  // Función especial para manejar selección de duración
  const handleDurationSelect = (durationId) => {
    setFormData(prev => ({
      ...prev,
      duree_abonnement: durationId
    }));
  };
  
  // Validar step actual - CORREGIDO
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.nom_boutique.trim() !== '' && 
               formData.domaine_boutique.trim() !== '' &&
               formData.categories_produits.length > 0;
      case 2:
        return formData.plan_boutique !== '' && 
               formData.duree_abonnement !== '';
      case 3:
        return formData.proprietaire.nom.trim() !== '' &&
               formData.proprietaire.email.trim() !== '' &&
               formData.proprietaire.telephone.trim() !== '';
      case 4:
        return formData.accepte_conditions === true;
      case 5:
        return true;
      default:
        return false;
    }
  };
  
  // Avanzar al siguiente step
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5));
      setError('');
    } else {
      let errorMessage = 'Veuillez remplir tous les champs obligatoires de cette étape';
      if (currentStep === 1) {
        if (!formData.nom_boutique.trim()) errorMessage = 'Nom de boutique requis';
        else if (!formData.domaine_boutique.trim()) errorMessage = 'Domaine requis';
        else if (!formData.categories_produits || formData.categories_produits.length === 0) errorMessage = 'Sélectionnez au moins une catégorie';
      } else if (currentStep === 2) {
        if (!formData.plan_boutique) errorMessage = 'Sélectionnez un plan';
        else if (!formData.duree_abonnement) errorMessage = 'Sélectionnez une durée d\'abonnement';
      } else if (currentStep === 3) {
        if (!formData.proprietaire.nom.trim()) errorMessage = 'Nom du propriétaire requis';
        else if (!formData.proprietaire.email.trim()) errorMessage = 'Email du propriétaire requis';
        else if (!formData.proprietaire.telephone.trim()) errorMessage = 'Téléphone du propriétaire requis';
      } else if (currentStep === 4) {
        errorMessage = 'Vous devez accepter les conditions générales';
      }
      setError(errorMessage);
    }
  };
  
  // Retroceder al step anterior
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };
  
  // Preparar datos para enviar
  const prepareSubmitData = () => {
    const submitData = {
      nom_boutique: formData.nom_boutique,
      domaine_boutique: formData.domaine_boutique,
      slogan_boutique: formData.slogan_boutique,
      description_boutique: formData.description_boutique,
      categories_produits: formData.categories_produits || [], // Asegurar que sea array
      couleur_theme: formData.couleur_theme,
      plan: formData.plan_boutique,
      duree_abonnement: formData.duree_abonnement,
      proprietaire: formData.proprietaire,
      reseaux_sociaux: formData.reseaux_sociaux,
      accepte_conditions: formData.accepte_conditions
    };
    
    return submitData;
  };
  
  // Enviar formulario
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const userData = prepareSubmitData();
      const avatar = formData.logo;
      
      // Disparar la acción de Redux
      if (isEdit && boutiqueData) {
        await dispatch(updateBoutique({ 
          boutiqueData: userData, 
          avatar, 
          auth,
          boutiqueId: boutiqueData._id 
        }));
        setSuccess('Boutique mise à jour avec succès!');
      } else {
        const result = await dispatch(createBoutique({ 
          boutiqueData: userData, 
          avatar, 
          auth 
        }));
        
        if (result) {
          setSuccess('Boutique créée avec succès!');
          
          // Redirigir después de 2 segundos
          setTimeout(() => {
            if (onSuccess) {
              onSuccess(result.boutique || result);
            } else {
              const boutiqueId = result.boutique?._id || result._id;
              if (boutiqueId) {
                history.push(`/boutique/${boutiqueId}`);
              }
            }
          }, 2000);
        }
      }
      
    } catch (err) {
      console.error('Error creating boutique:', err);
      
      if (err.message && err.message.includes('Unexpected token')) {
        setError('Erreur du serveur: Le serveur a retourné une réponse non valide.');
      } else if (err.response && err.response.status === 404) {
        setError('Erreur 404: La route API n\'existe pas.');
      } else if (err.response && err.response.status === 500) {
        setError('Erreur 500: Erreur interne du serveur.');
      } else {
        setError(err.message || 'Erreur lors de la création de la boutique');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Renderizar step actual
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1InfoBasique 
            formData={formData} 
            handleInputChange={handleInputChange}
            handleCategoriesChange={handleCategoriesChange}
            categoryOptions={categoryOptions}
          />
        );
      case 2:
        return (
          <Step2Plan 
            formData={formData}
            handlePlanSelect={handlePlanSelect}
            handleDurationSelect={handleDurationSelect}
            plans={PLANS}
            durees={DUREES}
            calculateTotalCredits={calculateTotalCredits}
          />
        );
      case 3:
        return (
          <Step3Proprietaire 
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 4:
        return (
          <Step4Conditions 
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 5:
        return (
          <Step5Logo 
            formData={formData}
            handleLogoChange={handleLogoChange}
            handleRemoveLogo={handleRemoveLogo}
          />
        );
      default:
        return null;
    }
  };
  
  // Efecto para cargar datos en modo edición
  useEffect(() => {
    if (isEdit && boutiqueData) {
      setFormData({
        nom_boutique: boutiqueData.nom_boutique || '',
        domaine_boutique: boutiqueData.domaine_boutique || '',
        slogan_boutique: boutiqueData.slogan_boutique || '',
        description_boutique: boutiqueData.description_boutique || '',
        categories_produits: boutiqueData.categories_produits || [],
        couleur_theme: boutiqueData.couleur_theme || '#2563eb',
        plan_boutique: boutiqueData.plan || '',
        duree_abonnement: boutiqueData.duree_abonnement || '',
        proprietaire: {
          nom: boutiqueData.proprietaire?.nom || '',
          email: boutiqueData.proprietaire?.email || '',
          telephone: boutiqueData.proprietaire?.telephone || '',
          wilaya: boutiqueData.proprietaire?.wilaya || '',
          adresse: boutiqueData.proprietaire?.adresse || ''
        },
        reseaux_sociaux: {
          facebook: boutiqueData.reseaux_sociaux?.facebook || '',
          instagram: boutiqueData.reseaux_sociaux?.instagram || '',
          tiktok: boutiqueData.reseaux_sociaux?.tiktok || '',
          whatsapp: boutiqueData.reseaux_sociaux?.whatsapp || '',
          website: boutiqueData.reseaux_sociaux?.website || ''
        },
        logo: null,
        logoPreview: boutiqueData.logo?.url || '',
        logoUrl: boutiqueData.logo?.url || '',
        accepte_conditions: boutiqueData.accepte_conditions || false
      });
    }
  }, [isEdit, boutiqueData]);
  
  // Efecto para manejar alertas de Redux
  useEffect(() => {
    if (alert.error) {
      setError(alert.error);
    }
    if (alert.success) {
      setSuccess(alert.success);
    }
  }, [alert]);
  
  return (
    <div className="create-boutique-wizard">
      {/* Header */}
      <div className="wizard-header mb-4">
        <h2 className="mb-2">
          {isEdit ? '✏️ Modifier votre boutique' : '🏪 Créer votre boutique'}
        </h2>
        <p className="text-muted mb-0">
          {isEdit 
            ? 'Mettez à jour les informations de votre boutique'
            : 'Créez votre boutique en ligne en quelques étapes simples'
          }
        </p>
        
        {/* Progress bar */}
        <div className="progress-container mt-4">
          <div className="d-flex justify-content-between mb-2">
            {[1, 2, 3, 4, 5].map(step => (
              <div 
                key={step} 
                className={`step-indicator ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
                onClick={() => currentStep > step && setCurrentStep(step)}
                style={{ cursor: currentStep > step ? 'pointer' : 'default' }}
              >
                <div className="step-number">{step}</div>
                <div className="step-label">
                  {step === 1 && 'Infos'}
                  {step === 2 && 'Plan'}
                  {step === 3 && 'Contact'}
                  {step === 4 && 'Conditions'}
                  {step === 5 && 'Logo'}
                </div>
              </div>
            ))}
          </div>
          <ProgressBar 
            now={(currentStep / 5) * 100} 
            variant="primary" 
            style={{ height: '6px' }}
          />
        </div>
      </div>
      
      {/* Contenido del step */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
          {renderStep()}
        </Card.Body>
      </Card>
      
      {/* Mensajes de error/success */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')}>
          <i className="fas fa-check-circle me-2"></i>
          {success}
        </Alert>
      )}
      
      {/* Navegación */}
      <div className="wizard-navigation d-flex justify-content-between">
        <div>
          {currentStep > 1 && (
            <Button variant="outline-secondary" onClick={prevStep} disabled={loading}>
              <i className="fas fa-arrow-left me-2"></i>
              Précédent
            </Button>
          )}
        </div>
        
        <div>
          {currentStep < 5 ? (
            <Button 
              variant="primary" 
              onClick={nextStep} 
              disabled={loading || !validateStep(currentStep)}
            >
              Suivant
              <i className="fas fa-arrow-right ms-2"></i>
            </Button>
          ) : (
            <Button 
              variant={isEdit ? 'warning' : 'success'} 
              onClick={handleSubmit} 
              disabled={loading || !validateStep(currentStep)}
            >
              {loading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  {isEdit ? 'Mise à jour...' : 'Création...'}
                </>
              ) : (
                <>
                  <i className={`fas ${isEdit ? 'fa-save' : 'fa-check'} me-2`}></i>
                  {isEdit ? 'Mettre à jour' : 'Créer la boutique'}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      
      {/* Estilos inline */}
      <style jsx="true">{`
        .create-boutique-wizard {
          max-width: 900px;
          margin: 0 auto;
        }
        
        .wizard-header {
          text-align: center;
        }
        
        .progress-container {
          position: relative;
        }
        
        .step-indicator {
          text-align: center;
          position: relative;
          z-index: 1;
          transition: all 0.3s ease;
        }
        
        .step-indicator.active .step-number {
          background: #0d6efd;
          color: white;
          border-color: #0d6efd;
        }
        
        .step-indicator.current .step-number {
          transform: scale(1.2);
          box-shadow: 0 0 0 4px rgba(13, 110, 253, 0.2);
        }
        
        .step-number {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #e9ecef;
          border: 2px solid #dee2e6;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 8px;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        
        .step-label {
          font-size: 0.85rem;
          color: #6c757d;
          white-space: nowrap;
        }
        
        .section-title {
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 0.5rem;
          margin-bottom: 1.5rem;
          font-weight: 600;
        }
        
        .plan-card {
          border: 2px solid #dee2e6;
          border-radius: 8px;
          padding: 1.5rem;
          height: 100%;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .plan-card:hover {
          border-color: #0d6efd;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .plan-card.selected {
          border-color: #0d6efd;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border-width: 3px;
        }
        
        .credits-display {
          font-size: 1.5rem;
          font-weight: bold;
          color: #198754;
        }
        
        .info_avatar {
          position: relative;
          width: 150px;
          height: 150px;
          margin: 0 auto;
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid #ddd;
          cursor: pointer;
        }
        
        .info_avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .info_avatar span {
          position: absolute;
          bottom: -100%;
          left: 0;
          width: 100%;
          height: 50%;
          background: rgba(255, 255, 255, 0.9);
          text-align: center;
          font-weight: 400;
          transition: 0.3s ease-in-out;
        }
        
        .info_avatar:hover span {
          bottom: 0;
        }
        
        .info_avatar span i {
          font-size: 1.2rem;
          color: #333;
          margin-top: 10px;
        }
        
        .info_avatar span p {
          margin: 0;
          font-size: 0.8rem;
          color: #333;
        }
        
        .info_avatar input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
        
        .select-categories {
          margin-bottom: 1rem;
        }
        
        .select-categories .css-1s2u09g-control {
          border-color: #ced4da;
          min-height: 38px;
        }
        
        .select-categories .css-1s2u09g-control:hover {
          border-color: #86b7fe;
        }
        
        .select-categories .css-1s2u09g-control:focus-within {
          border-color: #86b7fe;
          box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
        }
        
        .selected-categories {
          margin-top: 0.5rem;
        }
        
        .selected-categories .badge {
          margin-right: 0.25rem;
          margin-bottom: 0.25rem;
          font-size: 0.8rem;
          padding: 0.35em 0.65em;
        }
        
        @media (max-width: 768px) {
          .create-boutique-wizard {
            padding: 15px;
          }
          
          .plan-card {
            margin-bottom: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

// ============ COMPONENTES DE CADA STEP ============

// Step 1: Informations de base - CON REACT-SELECT
const Step1InfoBasique = ({ formData, handleInputChange, handleCategoriesChange, categoryOptions }) => {
  
  // Preparar valores seleccionados para react-select
  const selectedCategories = categoryOptions.filter(option => 
    formData.categories_produits && formData.categories_produits.includes(option.value)
  );
  
  return (
    <div className="step1-info-basique">
      <h4 className="section-title">Informations de base</h4>
      
      <div className="row g-3">
        <div className="col-md-6">
          <Form.Group className="mb-3">
            <Form.Label>
              Nom de la boutique <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="nom_boutique"
              value={formData.nom_boutique}
              onChange={handleInputChange}
              placeholder="Ex: Fashion Store Algérie"
              required
            />
            <Form.Text className="text-muted">
              Le nom qui apparaîtra sur votre boutique en ligne
            </Form.Text>
          </Form.Group>
        </div>
        
        <div className="col-md-6">
          <Form.Group className="mb-3">
            <Form.Label>
              Nom de domaine <span className="text-danger">*</span>
            </Form.Label>
            <div className="input-group">
              <Form.Control
                type="text"
                name="domaine_boutique"
                value={formData.domaine_boutique}
                onChange={handleInputChange}
                placeholder="monboutique"
                required
              />
              <span className="input-group-text">.monsite.dz</span>
            </div>
            <Form.Text className="text-muted">
              Votre boutique sera accessible à: https://{formData.domaine_boutique || 'exemple'}.monsite.dz
            </Form.Text>
          </Form.Group>
        </div>
        
        <div className="col-12">
          <Form.Group className="mb-3">
            <Form.Label>Slogan / Description courte</Form.Label>
            <Form.Control
              type="text"
              name="slogan_boutique"
              value={formData.slogan_boutique}
              onChange={handleInputChange}
              placeholder="Ex: Votre boutique de mode en ligne"
            />
          </Form.Group>
        </div>
        
        <div className="col-12">
          <Form.Group className="mb-3">
            <Form.Label>Description détaillée</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description_boutique"
              value={formData.description_boutique}
              onChange={handleInputChange}
              placeholder="Décrivez votre boutique, votre mission, vos valeurs..."
            />
          </Form.Group>
        </div>
        
        <div className="col-12">
          <Form.Group className="mb-3">
            <Form.Label>
              Catégories de produits <span className="text-danger">*</span>
            </Form.Label>
            <div className="select-categories">
              <Select
                options={categoryOptions}
                isMulti
                value={selectedCategories}
                onChange={handleCategoriesChange}
                placeholder="Sélectionnez vos catégories..."
                className="basic-multi-select"
                classNamePrefix="select"
                noOptionsMessage={() => "Aucune option disponible"}
              />
            </div>
            <Form.Text className="text-muted">
              Sélectionnez une ou plusieurs catégories qui correspondent à vos produits
            </Form.Text>
            
            {formData.categories_produits && formData.categories_produits.length > 0 && (
              <div className="selected-categories mt-3">
                <div className="mb-2">
                  <small className="text-success">
                    <i className="fas fa-check me-1"></i>
                    {formData.categories_produits.length} catégorie(s) sélectionnée(s)
                  </small>
                </div>
                <div className="d-flex flex-wrap">
                  {selectedCategories.map(cat => (
                    <Badge key={cat.value} bg="info" pill className="me-1 mb-1">
                      {cat.label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Form.Group>
        </div>
        
        <div className="col-md-6">
          <Form.Group className="mb-3">
            <Form.Label>Couleur du thème</Form.Label>
            <div className="d-flex align-items-center">
              <Form.Control
                type="color"
                name="couleur_theme"
                value={formData.couleur_theme}
                onChange={handleInputChange}
                className="w-25 me-3"
                style={{ minWidth: '60px' }}
              />
              <span className="text-muted">
                Personnalisez l'apparence de votre boutique
              </span>
            </div>
          </Form.Group>
        </div>
      </div>
    </div>
  );
};

// Step 2: Plan et abonnement
const Step2Plan = ({ 
  formData, 
  handlePlanSelect, 
  handleDurationSelect, 
  plans, 
  durees, 
  calculateTotalCredits 
}) => {
  const totalCredits = calculateTotalCredits();
  
  return (
    <div className="step2-plan">
      <h4 className="section-title">Choisissez votre plan</h4>
      
      <div className="row g-3 mb-4">
        {plans.map(plan => (
          <div className="col-md-6 col-lg-3" key={plan.id}>
            <div 
              className={`plan-card ${formData.plan_boutique === plan.id ? 'selected' : ''}`}
              onClick={() => handlePlanSelect(plan.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <h5 className="mb-1">{plan.name}</h5>
                  <div className="text-muted small">{plan.storage} stockage</div>
                </div>
                <Badge bg="primary">{plan.credits} crédits/mois</Badge>
              </div>
              
              <div className="plan-features">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="plan-feature-item">
                    <i className="fas fa-check text-success me-2"></i>
                    <small>{feature}</small>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-3">
                <Button
                  size="sm"
                  variant={formData.plan_boutique === plan.id ? 'primary' : 'outline-primary'}
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePlanSelect(plan.id);
                  }}
                >
                  {formData.plan_boutique === plan.id ? '✓ Sélectionné' : 'Sélectionner'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <h4 className="section-title mt-4">Durée d'abonnement</h4>
      
      <div className="row g-3 mb-4">
        {durees.map(duree => (
          <div className="col-md-6 col-lg-3" key={duree.id}>
            <div 
              className={`plan-card ${formData.duree_abonnement === duree.id ? 'selected' : ''}`}
              onClick={() => handleDurationSelect(duree.id)}
              style={{ cursor: 'pointer' }}
            >
              <h5 className="text-center mb-2">{duree.name}</h5>
              {duree.discount && (
                <Badge bg="success" className="d-block text-center mb-2">
                  Économisez {duree.discount}
                </Badge>
              )}
              <div className="text-center mt-3">
                <Button
                  size="sm"
                  variant={formData.duree_abonnement === duree.id ? 'primary' : 'outline-primary'}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDurationSelect(duree.id);
                  }}
                >
                  {formData.duree_abonnement === duree.id ? '✓ Choisi' : 'Choisir'}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Validación visual */}
      {(!formData.plan_boutique || !formData.duree_abonnement) && (
        <Alert variant="warning" className="mb-4">
          <i className="fas fa-exclamation-triangle me-2"></i>
          <strong>Attention:</strong> Vous devez sélectionner un plan ET une durée d'abonnement pour continuer.
        </Alert>
      )}
      
      {/* Résumé */}
      {formData.plan_boutique && formData.duree_abonnement && (
        <Card className="border-primary">
          <Card.Body>
            <h5 className="mb-3">
              <i className="fas fa-check-circle text-success me-2"></i>
              Récapitulatif de votre sélection
            </h5>
            <div className="row">
              <div className="col-md-6">
                <div className="mb-2">
                  <strong>Plan:</strong> {plans.find(p => p.id === formData.plan_boutique)?.name}
                </div>
                <div className="mb-2">
                  <strong>Durée:</strong> {durees.find(d => d.id === formData.duree_abonnement)?.name}
                </div>
                <div className="mb-2">
                  <strong>Produits max:</strong> {plans.find(p => p.id === formData.plan_boutique)?.max_products}
                </div>
                <div className="mb-2">
                  <strong>Stockage:</strong> {plans.find(p => p.id === formData.plan_boutique)?.storage}
                </div>
              </div>
              <div className="col-md-6">
                <div className="credits-display text-end">
                  <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#198754' }}>
                    {totalCredits} crédits
                  </div>
                  <small className="text-muted">
                    ({plans.find(p => p.id === formData.plan_boutique)?.credits} crédits × 
                    {durees.find(d => d.id === formData.duree_abonnement)?.creditsMultiplier})
                  </small>
                </div>
                <p className="text-muted text-end mb-0">
                  Ce montant sera débité de votre compte
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

// Step 3: Informations du propriétaire
const Step3Proprietaire = ({ formData, handleInputChange }) => {
  const wilayas = [
    'Alger', 'Oran', 'Constantine', 'Annaba', 'Blida', 'Tizi Ouzou',
    'Sétif', 'Batna', 'Djelfa', 'Sidi Bel Abbès', 'Biskra', 'Tébessa',
    'El Oued', 'Skikda', 'Tiaret', 'Béjaïa', 'Tlemcen', 'Ouargla',
    'Mostaganem', 'Boumerdès', 'Adrar', 'Chlef', 'Laghouat', 'Mascara'
  ];
  
  return (
    <div className="step3-proprietaire">
      <h4 className="section-title">Informations du propriétaire</h4>
      
      <Alert variant="info" className="mb-4">
        <i className="fas fa-info-circle me-2"></i>
        Ces informations seront utilisées pour la facturation et le contact administratif.
      </Alert>
      
      <div className="row g-3">
        <div className="col-md-6">
          <Form.Group className="mb-3">
            <Form.Label>
              Nom complet <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="proprietaire.nom"
              value={formData.proprietaire.nom}
              onChange={handleInputChange}
              placeholder="Nom et prénom"
              required
            />
          </Form.Group>
        </div>
        
        <div className="col-md-6">
          <Form.Group className="mb-3">
            <Form.Label>
              Email <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="email"
              name="proprietaire.email"
              value={formData.proprietaire.email}
              onChange={handleInputChange}
              placeholder="exemple@email.com"
              required
            />
          </Form.Group>
        </div>
        
        <div className="col-md-6">
          <Form.Group className="mb-3">
            <Form.Label>
              Téléphone <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="tel"
              name="proprietaire.telephone"
              value={formData.proprietaire.telephone}
              onChange={handleInputChange}
              placeholder="05 XX XX XX XX"
              required
            />
          </Form.Group>
        </div>
        
        <div className="col-md-6">
          <Form.Group className="mb-3">
            <Form.Label>Wilaya</Form.Label>
            <Form.Select
              name="proprietaire.wilaya"
              value={formData.proprietaire.wilaya}
              onChange={handleInputChange}
            >
              <option value="">Sélectionnez une wilaya</option>
              {wilayas.map(wilaya => (
                <option key={wilaya} value={wilaya}>{wilaya}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </div>
        
        <div className="col-12">
          <Form.Group className="mb-3">
            <Form.Label>Adresse complète</Form.Label>
            <Form.Control
              type="text"
              name="proprietaire.adresse"
              value={formData.proprietaire.adresse}
              onChange={handleInputChange}
              placeholder="Rue, numéro, commune"
            />
          </Form.Group>
        </div>
      </div>
      
      <h4 className="section-title mt-4">Réseaux sociaux (optionnel)</h4>
      
      <div className="row g-3">
        {['facebook', 'instagram', 'tiktok', 'whatsapp', 'website'].map(social => (
          <div className="col-md-6" key={social}>
            <Form.Group className="mb-3">
              <Form.Label>
                <i className={`fab fa-${social} me-2`}></i>
                {social.charAt(0).toUpperCase() + social.slice(1)}
              </Form.Label>
              <Form.Control
                type="url"
                name={`reseaux_sociaux.${social}`}
                value={formData.reseaux_sociaux[social]}
                onChange={handleInputChange}
                placeholder={`https://${social}.com/votreboutique`}
              />
            </Form.Group>
          </div>
        ))}
      </div>
    </div>
  );
};

// Step 4: Conditions
const Step4Conditions = ({ formData, handleInputChange }) => {
  return (
    <div className="step4-conditions">
      <h4 className="section-title">Conditions générales</h4>
      
      <Alert variant="warning" className="mb-4">
        <i className="fas fa-exclamation-triangle me-2"></i>
        Veuillez lire attentivement les conditions avant de continuer.
      </Alert>
      
      <div className="conditions-content border rounded p-3 mb-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <h6>Conditions Générales de Vente et d'Utilisation</h6>
        
        <h6>1. Acceptation des conditions</h6>
        <p>En créant une boutique sur notre plateforme, vous acceptez sans réserve les présentes conditions générales.</p>
        
        <h6>2. Responsabilités du vendeur</h6>
        <ul>
          <li>Fournir des informations exactes et à jour</li>
          <li>Respecter les lois et réglementations en vigueur</li>
          <li>Assurer la qualité des produits vendus</li>
          <li>Gérer les retours et réclamations</li>
        </ul>
        
        <h6>3. Droits et obligations de la plateforme</h6>
        <ul>
          <li>Hébergement de la boutique en ligne</li>
          <li>Maintien de la plateforme opérationnelle</li>
          <li>Support technique dans les limites du plan choisi</li>
          <li>Droit de suspendre une boutique en cas de non-respect des règles</li>
        </ul>
        
        <h6>4. Tarification et paiement</h6>
        <p>Les crédits sont débités lors de l'activation et renouvelés automatiquement à la fin de la période d'abonnement.</p>
        
        <h6>5. Propriété intellectuelle</h6>
        <p>Vous conservez les derechos sur votre contenu, mais nous accordez une licence pour l'affichage sur notre plateforme.</p>
        
        <h6>6. Résiliation</h6>
        <p>Vous pouvez résilier à tout moment, mais aucun remboursement n'est possible pour la période en cours.</p>
        
        <h6>7. Confidentialité</h6>
        <p>Vos données sont protégées conformément à notre politique de confidentialité.</p>
      </div>
      
      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          name="accepte_conditions"
          id="accepte_conditions"
          label={
            <span>
              <strong>J'accepte les conditions générales de vente et d'utilisation</strong>
              <span className="text-danger"> *</span>
            </span>
          }
          checked={formData.accepte_conditions}
          onChange={handleInputChange}
          required
        />
        <Form.Text className="text-muted">
          En cochant cette case, vous certifiez avoir lu et compris nos CGV et notre politique de confidentialité.
        </Form.Text>
      </Form.Group>
    </div>
  );
};

// Step 5: Logo
const Step5Logo = ({ formData, handleLogoChange, handleRemoveLogo }) => {
  const hasLogo = formData.logo || formData.logoPreview || formData.logoUrl;
  const logoPreview = formData.logoPreview || formData.logoUrl || '/default-logo.png';
  
  return (
    <div className="step5-logo">
      <h4 className="section-title">Logo de votre boutique</h4>
      
      <Alert variant="info" className="mb-4">
        <i className="fas fa-info-circle me-2"></i>
        Un logo professionnel augmente la crédibilité de votre boutique. Vous pouvez ajouter ou modifier le logo plus tard.
      </Alert>
      
      <div className="d-flex flex-column align-items-center mb-4">
        <div className="info_avatar mb-3">
          <img 
            src={logoPreview} 
            alt="Logo preview" 
            style={{ 
              borderRadius: '8px',
              width: '150px',
              height: '150px',
              objectFit: 'contain',
              backgroundColor: '#f8f9fa'
            }}
          />
          <span>
            <i className="fas fa-camera" />
            <p>Changer</p>
            <input 
              type="file" 
              name="logo" 
              id="logo_up"
              accept="image/*" 
              onChange={handleLogoChange} 
            />
          </span>
        </div>
        
        {hasLogo ? (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleRemoveLogo}
            className="mt-2"
          >
            <i className="fas fa-trash me-1"></i>
            Supprimer le logo
          </Button>
        ) : (
          <p className="text-muted text-center">
            Cliquez sur la zone du logo pour télécharger une image
          </p>
        )}
      </div>
      
      <Form.Group className="mb-3">
        <Form.Label>Télécharger un logo (optionnel)</Form.Label>
        <div className="input-group">
          <Form.Control
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleLogoChange}
          />
          <Button 
            variant="outline-secondary" 
            onClick={() => document.getElementById('logo_up').click()}
          >
            <i className="fas fa-folder-open me-1"></i>
            Parcourir
          </Button>
        </div>
        <Form.Text className="text-muted">
          Format recommandé: PNG ou JPG, 300x300 pixels, taille max: 2MB
        </Form.Text>
      </Form.Group>
      
      <div className="alert alert-light border mt-4">
        <h6 className="mb-2">
          <i className="fas fa-check-circle text-success me-2"></i>
          Prêt à créer votre boutique!
        </h6>
        <p className="mb-0">
          Cliquez sur "Créer la boutique" pour finaliser la création.
          Vous pourrez ajouter des produits immédiatement après.
        </p>
      </div>
    </div>
  );
};

export default CreateBoutiqueWizard;