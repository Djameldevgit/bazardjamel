import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Alert, Spinner, Badge, ProgressBar, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createBoutique, updateBoutique } from '../../redux/actions/boutiqueAction';
import { checkImage } from '../../utils/imageUpload';

const CreateBoutiqueWizard = ({ onSuccess, isEdit = false, boutiqueData = null }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth, alert } = useSelector(state => state);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transactionId, setTransactionId] = useState('623279');
  // ELIMINA ESTA LÍNEA: const domaine_boutique = formData.domaine_boutique || generateDomain(formData.nom_boutique);
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    // Step 1 - Campos del backend original
    nom_boutique: '',
    domaine_boutique: '',
    slogan_boutique: '',
    description_boutique: '',
    logo: null,
    logoPreview: '',
    logoUrl: '',
    
    // Step 2 - Nuevos campos adaptados
    categories_produits: [],
    proprietaire: {
      nom: auth?.user?.name || '',
      email: auth?.user?.email || '',
      telephone: auth?.user?.mobile || '',
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
    couleur_theme: '#2563eb',
    plan: 'gratuit',
    duree_abonnement: '1mois',
    
    // Nuevos campos para sliders
    categorie: '',
    duree: '1',
    offre: 'Store Basic 50',
    
    // Campos calculados
    montant_initial: 0,
    mois_offerts: 0,
    montant_ttc: 0,
    
    // Step 4
    methode_paiement: '',
    client_nom: auth?.user?.name || '',
    client_telephone: auth?.user?.mobile || '',
    
    accepte_conditions: false
  });
  
  
  // Catégories pour le slider
  const categories = [
    'Automobiles & Véhicules',
    'Informatique',
    'Meubles & Maison',
    'Matériaux & Equipement',
    'Téléphonie & Accessoires',
    'Pièces détachées',
    'Electroménager & Electronique',
    'Vêtements & Mode',
    'Santé & Beauté',
    'Loisirs & Divertissement',
    'Offres & Demandes d\'emploi',
    'Immobilier',
    'Services',
    'Voyages',
    'Alimentaire',
    'Sport'
  ];
  
  // Durées pour le slider
  const durees = [
    { id: '1', name: '1 Mois' },
    { id: '2', name: '2 Mois' },
    { id: '3', name: '3 Mois' },
    { id: '4', name: '4 Mois' },
    { id: '5', name: '5 Mois' },
    { id: '6', name: '6 Mois' },
    { id: '7', name: '7 Mois' },
    { id: '8', name: '8 Mois' },
    { id: '9', name: '9 Mois' },
    { id: '10', name: '10 Mois' },
    { id: '11', name: '11 Mois' },
    { id: '12', name: '12 Mois' }
  ];
  
  // Offres pour le slider
  const offres = [
    {
      id: 'Store Basic 50',
      name: 'Store Basic 50',
      credits: 50,
      storage: 100,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing'],
      couleur: '#3b82f6',
      prix_mois: 5000
    },
    {
      id: 'Store Basic 100',
      name: 'Store Basic 100',
      credits: 100,
      storage: 200,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing'],
      couleur: '#3b82f6',
      prix_mois: 8500
    },
    {
      id: 'Store Basic 150',
      name: 'Store Basic 150',
      credits: 150,
      storage: 300,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing'],
      couleur: '#3b82f6',
      prix_mois: 12000
    },
    {
      id: 'Store Silver 200',
      name: 'Store Silver 200',
      credits: 200,
      storage: 400,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing'],
      couleur: '#6b7280',
      prix_mois: 15000
    },
    {
      id: 'Store Silver 300',
      name: 'Store Silver 300',
      credits: 300,
      storage: 600,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing'],
      couleur: '#6b7280',
      prix_mois: 21000
    },
    {
      id: 'Store Silver 500',
      name: 'Store Silver 500',
      credits: 500,
      storage: 1000,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing'],
      couleur: '#6b7280',
      prix_mois: 35000
    },
    {
      id: 'Store Silver 750',
      name: 'Store Silver 750',
      credits: 750,
      storage: 1500,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing'],
      couleur: '#6b7280',
      prix_mois: 50000
    },
    {
      id: 'Store Gold 1000',
      name: 'Store Gold 1000',
      credits: 1000,
      storage: 2000,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing'],
      couleur: '#f59e0b',
      prix_mois: 70000
    },
    {
      id: 'Store Gold 1500',
      name: 'Store Gold 1500',
      credits: 1500,
      storage: 3000,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing'],
      couleur: '#f59e0b',
      prix_mois: 100000
    },
    {
      id: 'Store Gold 2000',
      name: 'Store Gold 2000',
      credits: 2000,
      storage: 4000,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing'],
      couleur: '#f59e0b',
      prix_mois: 130000
    },
    {
      id: 'Store Gold 3000',
      name: 'Store Gold 3000',
      credits: 3000,
      storage: 4000,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing'],
      couleur: '#f59e0b',
      prix_mois: 190000
    },
    {
      id: 'Store Gold 6000',
      name: 'Store Gold 6000',
      credits: 6000,
      storage: 12000,
      features: ['Site Builder', 'Nom de domaine'],
      couleur: '#f59e0b',
      prix_mois: 350000
    }
  ];
  
  // Méthodes de paiement
  const methodesPaiement = [
    { value: 'ccp', label: 'CCP (Compte de Chèque Postal)' },
    { value: 'cib', label: 'CIB - Banque' },
    { value: 'carte', label: 'Carte de crédit' },
    { value: 'edahabia', label: 'Edahabia' },
    { value: 'cash', label: 'Espèces' },
    { value: 'virement', label: 'Virement bancaire' }
  ];
  
  // Mapear oferta del slider al plan del backend
  const mapOffreToPlan = (offreId) => {
    const offreMapping = {
      'Store Basic 50': 'gratuit',
      'Store Basic 100': 'gratuit',
      'Store Basic 150': 'gratuit',
      'Store Silver 200': 'basique',
      'Store Silver 300': 'basique',
      'Store Silver 500': 'basique',
      'Store Silver 750': 'premium',
      'Store Gold 1000': 'premium',
      'Store Gold 1500': 'premium',
      'Store Gold 2000': 'entreprise',
      'Store Gold 3000': 'entreprise',
      'Store Gold 6000': 'entreprise'
    };
    return offreMapping[offreId] || 'gratuit';
  };
  
  // Mapear duración del slider a duración del backend
  const mapDureeToAbonnement = (dureeId) => {
    const dureeMapping = {
      '1': '1mois',
      '2': '1mois',
      '3': '3mois',
      '4': '3mois',
      '5': '6mois',
      '6': '6mois',
      '7': '6mois',
      '8': '6mois',
      '9': '1an',
      '10': '1an',
      '11': '1an',
      '12': '1an'
    };
    return dureeMapping[dureeId] || '1mois';
  };
  
  // Calculer les montants
  const calculerMontants = () => {
    const offreSelectionnee = offres.find(o => o.id === formData.offre);
    const dureeMois = parseInt(formData.duree);
    
    if (!offreSelectionnee) return;
    
    let montantInitial = offreSelectionnee.prix_mois * dureeMois;
    let moisOfferts = 0;
    
    // Calculer mois offerts selon les règles
    if (dureeMois >= 6) {
      moisOfferts = 1;
    }
    if (dureeMois >= 12) {
      moisOfferts = 3;
    }
    
    // Appliquer les mois offerts
    const moisPayer = Math.max(1, dureeMois - moisOfferts);
    montantInitial = offreSelectionnee.prix_mois * moisPayer;
    
    // Calculer taxe 19%
    const taxe = montantInitial * 0.19;
    const montantTTC = montantInitial + taxe;
    
    setFormData(prev => ({
      ...prev,
      montant_initial: montantInitial,
      mois_offerts: moisOfferts,
      montant_ttc: montantTTC
    }));
  };
  
  // Gérer cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('proprietaire.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        proprietaire: {
          ...prev.proprietaire,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (name.startsWith('reseaux_sociaux.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        reseaux_sociaux: {
          ...prev.reseaux_sociaux,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };
  
  // Manejar cambio de logo (MISMO CÓDIGO DEL ORIGINAL)
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
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
  
  // Sélectionner catégorie
  const handleSelectCategorie = (categorie) => {
    setFormData(prev => ({ 
      ...prev, 
      categorie,
      categories_produits: [categorie] // Mapear al array del backend
    }));
  };
  
  // Sélectionner durée
  const handleSelectDuree = (dureeId) => {
    setFormData(prev => ({ 
      ...prev, 
      duree: dureeId,
      duree_abonnement: mapDureeToAbonnement(dureeId) // Mapear al formato del backend
    }));
  };
  
  // Sélectionner offre
  const handleSelectOffre = (offreId) => {
    setFormData(prev => ({ 
      ...prev, 
      offre: offreId,
      plan: mapOffreToPlan(offreId) // Mapear al formato del backend
    }));
  };
  
  // Generar dominio automático basado en el nombre
  const generateDomain = (nom) => {
    if (!nom) return '';
    return nom
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };
  
  // Validar step actual
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.nom_boutique.trim() !== '' && 
               formData.description_boutique.trim() !== '';
      case 2:
        return formData.categorie !== '' && 
               formData.duree !== '' &&
               formData.offre !== '';
      case 3:
        return true; // Step 3 es solo visualización
      case 4:
        return formData.methode_paiement !== '' && 
               formData.accepte_conditions === true;
      default:
        return false;
    }
  };
  
  // Avanzar al siguiente step
  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 2) {
        calculerMontants();
      }
      setCurrentStep(prev => Math.min(prev + 1, 4));
      setError('');
    } else {
      let errorMessage = 'Veuillez remplir tous les champs obligatoires de cette étape';
      if (currentStep === 1) {
        if (!formData.nom_boutique.trim()) errorMessage = 'Nom du store requis';
        else if (!formData.description_boutique.trim()) errorMessage = 'Description du store requise';
      } else if (currentStep === 2) {
        if (!formData.categorie) errorMessage = 'Sélectionnez une catégorie';
        else if (!formData.duree) errorMessage = 'Sélectionnez une durée';
        else if (!formData.offre) errorMessage = 'Sélectionnez une offre';
      } else if (currentStep === 4) {
        if (!formData.methode_paiement) errorMessage = 'Sélectionnez une méthode de paiement';
        else errorMessage = 'Vous devez accepter les conditions';
      }
      setError(errorMessage);
    }
  };
  
  // Retroceder al step anterior
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };
  
 
 // En CreateBoutiqueWizard.js, actualiza prepareSubmitData:

// En CreateBoutiqueWizard.js, actualiza prepareSubmitData:

// En CreateBoutiqueWizard.js, actualiza prepareSubmitData:

// En CreateBoutiqueWizard.js - prepareSubmitData

const prepareSubmitData = () => {
  // Generar dominio automático si no existe
  const domaine_boutique = formData.domaine_boutique || generateDomain(formData.nom_boutique);
  
  // Encontrar la oferta y duración seleccionadas
  const offreSelectionnee = offres.find(o => o.id === formData.offre);
  const dureeSelectionnee = durees.find(d => d.id === formData.duree);
  
  // IMPORTANTE: NO incluimos avatar aquí, se maneja en la acción
  const submitData = {
    // Campos requeridos
    nom_boutique: formData.nom_boutique || '',
    domaine_boutique: domaine_boutique || '',
    slogan_boutique: formData.slogan_boutique || '',
    description_boutique: formData.description_boutique || '',
    date_debut: formData.date_debut || new Date().toISOString().split('T')[0],
    
    // 🗂️ CATEGORÍAS
    categorie: formData.categorie || '',
    subCategory: formData.categorie ? `boutique-${formData.categorie.toLowerCase()
      .replace(/[&]/g, 'et')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')}` : '',
    articleType: '',
    
    // Plan y duración
    plan: mapOffreToPlan(formData.offre),
    duree_abonnement: mapDureeToAbonnement(formData.duree),
    
    // Categorías de productos
    categories_produits: formData.categories_produits || 
                         (formData.categorie ? [formData.categorie] : []),
    
    // Información del propietario
    proprietaire: {
      nom: formData.proprietaire?.nom || auth.user?.name || '',
      email: formData.proprietaire?.email || auth.user?.email || '',
      telephone: formData.proprietaire?.telephone || auth.user?.mobile || '',
      wilaya: formData.proprietaire?.wilaya || '',
      adresse: formData.proprietaire?.adresse || ''
    },
    
    // Redes sociales
    reseaux_sociaux: {
      facebook: formData.reseaux_sociaux?.facebook || '',
      instagram: formData.reseaux_sociaux?.instagram || '',
      tiktok: formData.reseaux_sociaux?.tiktok || '',
      whatsapp: formData.reseaux_sociaux?.whatsapp || '',
      website: formData.reseaux_sociaux?.website || ''
    },
    
    // Estilo
    couleur_theme: formData.couleur_theme || '#2563eb',
    
    // Metadatos del wizard
    offre_choisie: offreSelectionnee ? {
      id: offreSelectionnee.id,
      nom: offreSelectionnee.name,
      credits: offreSelectionnee.credits,
      storage: offreSelectionnee.storage,
      prix_mois: offreSelectionnee.prix_mois
    } : null,
    
    duree_choisie: dureeSelectionnee ? {
      id: dureeSelectionnee.id,
      nom: dureeSelectionnee.name
    } : null,
    
    montant_initial: formData.montant_initial || 0,
    mois_offerts: formData.mois_offerts || 0,
    montant_ttc: formData.montant_ttc || 0,
    methode_paiement: formData.methode_paiement || '',
  };
  
  console.log('✅ Datos preparados para enviar (sin avatar):', {
    nom_boutique: submitData.nom_boutique,
    categorie: submitData.categorie,
    plan: submitData.plan
  });
  
  return submitData;
};
  // En handleSubmit() del wizard:
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const boutiqueData = prepareSubmitData();
      const avatar = formData.logo;
      
      console.log('📤 Enviando al backend:', {
        boutiqueData: {
          nom_boutique: boutiqueData.nom_boutique,
          domaine_boutique: boutiqueData.domaine_boutique,
          plan: boutiqueData.plan
        },
        hasAvatar: !!avatar
      });
      
      // Mostrar datos del proprietaire
      console.log('👤 Proprietaire data:', boutiqueData.proprietaire);
      
      if (isEdit && boutiqueData) {
        await dispatch(updateBoutique({ 
          boutiqueData, 
          avatar, 
          auth,
          boutiqueId: boutiqueData._id 
        }));
        setSuccess('Boutique mise à jour avec succès!');
      } else {
        const result = await dispatch(createBoutique({ 
          boutiqueData, 
          avatar, 
          auth 
        }));
        
        if (result) {
          setSuccess('Votre demande de création de store a été soumise avec succès! Elle sera évaluée par nos administrateurs.');
          
          setTimeout(() => {
            if (onSuccess) {
              onSuccess(result.boutique || result);
            } else {
              const boutiqueId = result.boutique?._id || result._id;
              if (boutiqueId) {
                history.push(`/boutique/${boutiqueId}`);
              }
            }
          }, 3000);
        }
      }
      
    } catch (err) {
      console.error('❌ Error creating boutique:', err);
      setError(err.message || 'Erreur lors de la création de la boutique');
    } finally {
      setLoading(false);
    }
  };
  
  // Efecto para cargar datos en modo edición
  useEffect(() => {
    if (isEdit && boutiqueData) {
      setFormData({
        nom_boutique: boutiqueData.nom_boutique || '',
        description_boutique: boutiqueData.description_boutique || '',
        domaine_boutique: boutiqueData.domaine_boutique || '',
        slogan_boutique: boutiqueData.slogan_boutique || '',
        date_debut: boutiqueData.date_debut || new Date().toISOString().split('T')[0],
        categorie: boutiqueData.categorie || '',
        duree: boutiqueData.duree || '1',
        offre: boutiqueData.offre || 'Store Basic 50',
        logo: null,
        logoPreview: boutiqueData.logo?.url || '',
        logoUrl: boutiqueData.logo?.url || '',
        categories_produits: boutiqueData.categories_produits || [],
        proprietaire: boutiqueData.proprietaire || {
          nom: auth?.user?.name || '',
          email: auth?.user?.email || '',
          telephone: auth?.user?.mobile || '',
          wilaya: '',
          adresse: ''
        },
        reseaux_sociaux: boutiqueData.reseaux_sociaux || {
          facebook: '',
          instagram: '',
          tiktok: '',
          whatsapp: '',
          website: ''
        },
        couleur_theme: boutiqueData.couleur_theme || '#2563eb',
        plan: boutiqueData.plan || 'gratuit',
        duree_abonnement: boutiqueData.duree_abonnement || '1mois',
        montant_initial: boutiqueData.montant_initial || 0,
        mois_offerts: boutiqueData.mois_offerts || 0,
        montant_ttc: boutiqueData.montant_ttc || 0,
        methode_paiement: boutiqueData.methode_paiement || '',
        client_nom: boutiqueData.client_nom || auth?.user?.name || '',
        client_telephone: boutiqueData.client_telephone || auth?.user?.mobile || '',
        accepte_conditions: boutiqueData.accepte_conditions || false
      });
    } else {
      // Para creación, establecer dominio automático cuando cambia el nombre
      if (formData.nom_boutique && !formData.domaine_boutique) {
        const domaine = generateDomain(formData.nom_boutique);
        setFormData(prev => ({
          ...prev,
          domaine_boutique: domaine
        }));
      }
    }
  }, [isEdit, boutiqueData, auth, formData.nom_boutique]);
  
  // Efecto para manejar alertas de Redux
  useEffect(() => {
    if (alert.error) {
      setError(alert.error);
    }
    if (alert.success) {
      setSuccess(alert.success);
    }
  }, [alert]);
  
  // Renderizar step actual - CORREGIDO
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Informations formData={formData} handleInputChange={handleInputChange} handleLogoChange={handleLogoChange} handleRemoveLogo={handleRemoveLogo} />;
      case 2:
        return <Step2ChoixOffre formData={formData} categories={categories} durees={durees} offres={offres} handleSelectCategorie={handleSelectCategorie} handleSelectDuree={handleSelectDuree} handleSelectOffre={handleSelectOffre} />;
      case 3:
        return <Step3Transaction formData={formData} transactionId={transactionId} offres={offres} durees={durees} />;
      case 4:
        return <Step4DetailTransaction 
          formData={formData} 
          methodesPaiement={methodesPaiement} 
          handleInputChange={handleInputChange} 
          offres={offres} 
          durees={durees}
          transactionId={transactionId}
        />;
      default:
        return null;
    }
  };
  
  return (
    <div className="create-boutique-wizard">
      {/* Header */}
      <div className="wizard-header mb-4">
        <h2 className="mb-2">
          {isEdit ? '✏️ Modifier votre store' : '🏪 Créer votre store'}
        </h2>
        <p className="text-muted mb-0">
          {isEdit 
            ? 'Mettez à jour les informations de votre store'
            : 'Créez votre store en ligne en quelques étapes simples'
          }
        </p>
        
        {/* Progress bar */}
        <div className="progress-container mt-4">
          <div className="d-flex justify-content-between mb-2">
            {[1, 2, 3, 4].map(step => (
              <div 
                key={step} 
                className={`step-indicator ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
                onClick={() => currentStep > step && setCurrentStep(step)}
                style={{ cursor: currentStep > step ? 'pointer' : 'default' }}
              >
                <div className="step-number">{step}</div>
                <div className="step-label">
                  {step === 1 && 'Informations'}
                  {step === 2 && 'Offre'}
                  {step === 3 && 'Transaction'}
                  {step === 4 && 'Paiement'}
                </div>
              </div>
            ))}
          </div>
          <ProgressBar 
            now={(currentStep / 4) * 100} 
            variant="primary" 
            style={{ height: '6px' }}
          />
        </div>
      </div>
      
      {/* Contenido del step */}
      <Card className="border-0 shadow-sm mb-4">
       
          {renderStep()}
        
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
          {currentStep < 4 ? (
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
                  {isEdit ? 'Mise à jour...' : 'Soumettre...'}
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane me-2"></i>
                  {isEdit ? 'Mettre à jour' : 'Soumettre la demande'}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
      
      {/* Footer avec détails utilisateur */}
      <div className="mt-4 pt-4 border-top">
        <div className="row">
          <div className="col-md-6">
            <h6 className="text-muted mb-2">
              <i className="fas fa-user-circle me-2"></i>
              Informations du propriétaire
            </h6>
            <p className="mb-1"><strong>Nom:</strong> {auth?.user?.name || 'Non spécifié'}</p>
            <p className="mb-1"><strong>Email:</strong> {auth?.user?.email || 'Non spécifié'}</p>
            <p className="mb-0"><strong>Téléphone:</strong> {auth?.user?.mobile || 'Non spécifié'}</p>
          </div>
          <div className="col-md-6 text-md-end">
            <h6 className="text-muted mb-2">
              <i className="fas fa-info-circle me-2"></i>
              Support
            </h6>
            <p className="mb-1">
              <i className="fas fa-phone me-1"></i>
              +213 XXX XX XX XX
            </p>
            <p className="mb-0">
              <i className="fas fa-envelope me-1"></i>
              support@marketplace.dz
            </p>
          </div>
        </div>
      </div>
      
      {/* Estilos inline */}
      <style jsx="true">{`
        .create-boutique-wizard {
          max-width: 1000px;
          margin: 0 auto;
        }
        
        .wizard-header {
          text-align: center;
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
        
        .slider-container {
          position: relative;
          padding: 0 5px;
        }
        
        .slider-scroll {
          display: flex;
          overflow-x: auto;
          scroll-behavior: smooth;
          gap: 10px;
          padding: 7px 0;
          scrollbar-width: thin;
        }
        
        .slider-scroll::-webkit-scrollbar {
          height: 6px;
        }
        
        .slider-scroll::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 3px;
        }
        
        .slider-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: white;
          border: 1px solid #dee2e6;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .slider-btn:hover {
          background: #f8f9fa;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .slider-btn-left {
          left: 0;
        }
        
        .slider-btn-right {
          right: 0;
        }
        
        .categorie-card {
          min-width: 150px;
          padding: 10px;
          border: 2px solid #dee2e6;
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
        
        .categorie-card:hover {
          border-color: #0d6efd;
          transform: translateY(-2px);
        }
        
        .categorie-card.selected {
          border-color: #0d6efd;
          background-color: rgba(13, 110, 253, 0.05);
          font-weight: bold;
        }
        
        .duree-card {
          min-width: 100px;
          padding: 10px;
          border: 2px solid #dee2e6;
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
        
        .duree-card:hover {
          border-color: #10b981;
          transform: translateY(-2px);
        }
        
        .duree-card.selected {
          border-color: #10b981;
          background-color: rgba(16, 185, 129, 0.05);
          font-weight: bold;
        }
        
        .offre-card {
          min-width: 220px;
          padding: 14px;
          border: 2px solid #dee2e6;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
        
        .offre-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .offre-card.selected {
          border-width: 3px;
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
        
        .montant-ttc {
          font-size: 1.8rem;
          font-weight: bold;
          color: #198754;
        }
        
        @media (max-width: 768px) {
          .create-boutique-wizard {
            padding: 15px;
          }
          
          .slider-container {
            padding: 0 20px;
          }
          
          .offre-card {
            min-width: 280px;
          }
        }
      `}</style>
    </div>
  );
};

// ============ COMPONENTES DE CADA STEP ============

// Step 1: Informations du store - ACTUALIZADO
const Step1Informations = ({ formData, handleInputChange, handleLogoChange, handleRemoveLogo }) => {
  const hasLogo = formData.logo || formData.logoPreview || formData.logoUrl;
  const logoPreview = formData.logoPreview || formData.logoUrl || '/default-logo.png';
  
  return (
    <div className="step1-informations">
      <div className="d-flex align-items-center mb-3">
        <div className="bg-primary rounded p-2 me-3">
          <i className="fas fa-store text-white" style={{ fontSize: '1.5rem' }}></i>
        </div>
        <div>
          <h4 className="mb-0">Informations du store</h4>
          <p className="text-muted mb-0">Remplir les informations nécessaires</p>
        </div>
      </div>
      
      <div className="row g-3">
        <div className="col-md-6">
          <Form.Group className="mb-3">
            <Form.Label>
              Commence le <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="date"
              name="date_debut"
              value={formData.date_debut}
              onChange={handleInputChange}
              required
            />
            <Form.Text className="text-muted">
              Date de début d'activité de votre store
            </Form.Text>
          </Form.Group>
        </div>
        
        <div className="col-md-6">
          <Form.Group className="mb-3">
            <Form.Label>
              Nom du store <span className="text-danger">*</span>
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
              Le nom qui apparaîtra sur votre store
            </Form.Text>
          </Form.Group>
        </div>
        
        <div className="col-md-6">
          <Form.Group className="mb-3">
            <Form.Label>
              Domaine du store <span className="text-danger">*</span>
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
              Votre store sera accessible à: {formData.domaine_boutique || 'exemple'}.monsite.dz
            </Form.Text>
          </Form.Group>
        </div>
        
        <div className="col-md-6">
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
            <Form.Label>
              Description détaillée <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description_boutique"
              value={formData.description_boutique}
              onChange={handleInputChange}
              placeholder="Décrivez votre store, vos produits, vos services..."
              required
            />
            <Form.Text className="text-muted">
              Cette description sera visible par vos clients
            </Form.Text>
          </Form.Group>
        </div>
        
        <div className="col-12">
          <div className="d-flex flex-column align-items-center mb-4">
            <h6 className="mb-3">Logo du store</h6>
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
        </div>
        
        <div className="col-md-6">
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="fab fa-facebook me-2 text-primary"></i>
              Facebook (optionnel)
            </Form.Label>
            <Form.Control
              type="url"
              name="reseaux_sociaux.facebook"
              value={formData.reseaux_sociaux.facebook}
              onChange={handleInputChange}
              placeholder="https://facebook.com/votrestore"
            />
          </Form.Group>
        </div>
        
        <div className="col-md-6">
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="fab fa-instagram me-2 text-danger"></i>
              Instagram (optionnel)
            </Form.Label>
            <Form.Control
              type="url"
              name="reseaux_sociaux.instagram"
              value={formData.reseaux_sociaux.instagram}
              onChange={handleInputChange}
              placeholder="https://instagram.com/votrestore"
            />
          </Form.Group>
        </div>
      </div>
    </div>
  );
};

// Step 2: Choix de l'offre con sliders horizontales
const Step2ChoixOffre = ({ formData, categories, durees, offres, handleSelectCategorie, handleSelectDuree, handleSelectOffre }) => {
  const sliderRefs = {
    categories: useRef(null),
    durees: useRef(null),
    offres: useRef(null)
  };

  const scrollSlider = (sliderName, direction) => {
    const slider = sliderRefs[sliderName].current;
    if (slider) {
      const scrollAmount = 300;
      slider.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="step2-choix-offre">
      <h4 className="section-title">Choix de l'offre</h4>
      
      {/* Slider Catégories */}
      <div className="mb-5">
        <h5 className="mb-3">Choisir catégories</h5>
        <div className="slider-container">
          <button className="slider-btn slider-btn-left" onClick={() => scrollSlider('categories', 'left')}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="slider-scroll" ref={sliderRefs.categories}>
            {categories.map((categorie, index) => (
              <div
                key={index}
                className={`categorie-card ${formData.categorie === categorie ? 'selected' : ''}`}
                onClick={() => handleSelectCategorie(categorie)}
              >
                <i className="fas fa-tag mb-2" style={{ fontSize: '1.5rem', color: '#0d6efd' }}></i>
                <div>{categorie}</div>
              </div>
            ))}
          </div>
          <button className="slider-btn slider-btn-right" onClick={() => scrollSlider('categories', 'right')}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        {formData.categorie && (
          <div className="mt-2 text-center">
            <Badge bg="primary" pill>
              <i className="fas fa-check me-1"></i>
              Sélectionné: {formData.categorie}
            </Badge>
          </div>
        )}
      </div>
      
      {/* Slider Durées */}
      <div className="mb-5">
        <h5 className="mb-3">Choisir une durée</h5>
        <div className="slider-container">
          <button className="slider-btn slider-btn-left" onClick={() => scrollSlider('durees', 'left')}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="slider-scroll" ref={sliderRefs.durees}>
            {durees.map((duree) => (
              <div
                key={duree.id}
                className={`duree-card ${formData.duree === duree.id ? 'selected' : ''}`}
                onClick={() => handleSelectDuree(duree.id)}
              >
                <i className="fas fa-calendar-alt mb-2" style={{ fontSize: '1.5rem', color: '#10b981' }}></i>
                <div>{duree.name}</div>
              </div>
            ))}
          </div>
          <button className="slider-btn slider-btn-right" onClick={() => scrollSlider('durees', 'right')}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        {formData.duree && (
          <div className="mt-2 text-center">
            <Badge bg="success" pill>
              <i className="fas fa-check me-1"></i>
              Sélectionné: {durees.find(d => d.id === formData.duree)?.name}
            </Badge>
          </div>
        )}
      </div>
      
      {/* Slider Offres */}
      <div className="mb-4">
        <h5 className="mb-3">Choisir une offre</h5>
        <div className="slider-container">
          <button className="slider-btn slider-btn-left" onClick={() => scrollSlider('offres', 'left')}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="slider-scroll" ref={sliderRefs.offres}>
            {offres.map((offre) => (
              <div
                key={offre.id}
                className={`offre-card ${formData.offre === offre.id ? 'selected' : ''}`}
                onClick={() => handleSelectOffre(offre.id)}
                style={{ borderColor: formData.offre === offre.id ? offre.couleur : '#dee2e6' }}
              >
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h5 className="mb-0" style={{ color: offre.couleur }}>{offre.name}</h5>
                  <Badge bg={offre.couleur === '#f59e0b' ? 'warning' : offre.couleur === '#6b7280' ? 'secondary' : 'primary'}>
                    {offre.credits} crédits
                  </Badge>
                </div>
                
                <div className="mb-3">
                  <div className="text-muted small">Limite de stockage</div>
                  <div className="h4 mb-0">{offre.storage} MB</div>
                </div>
                
                <div className="plan-features">
                  {offre.features.map((feature, idx) => (
                    <div key={idx} className="d-flex align-items-center mb-1">
                      <i className="fas fa-check text-success me-2" style={{ fontSize: '0.8rem' }}></i>
                      <small>{feature}</small>
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-3">
                  <Button
                    size="sm"
                    variant={formData.offre === offre.id ? 'primary' : 'outline-primary'}
                    style={{ 
                      backgroundColor: formData.offre === offre.id ? offre.couleur : '',
                      borderColor: offre.couleur
                    }}
                  >
                    {formData.offre === offre.id ? '✓ Sélectionné' : 'Sélectionner'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <button className="slider-btn slider-btn-right" onClick={() => scrollSlider('offres', 'right')}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
      
      {/* Badges promotionnels */}
      <div className="row g-2 mb-4">
        <div className="col-md-4">
          <div className="border rounded p-3 text-center">
            <h6 className="text-primary mb-1">1 mois offert(s)</h6>
            <small className="text-muted">A partir de 6 mois</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="border rounded p-3 text-center">
            <h6 className="text-success mb-1">3 mois offert(s)</h6>
            <small className="text-muted">A partir de 12 mois</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="border rounded p-3 text-center">
            <h6 className="text-warning mb-1">Nom de domaine</h6>
            <small className="text-muted">A partir de 3 mois</small>
          </div>
        </div>
      </div>
    </div>
  );
};

// Step 3: Résumé de la transaction
const Step3Transaction = ({ formData, transactionId, offres, durees }) => {
  const offreSelectionnee = offres.find(o => o.id === formData.offre);
  const dureeSelectionnee = durees.find(d => d.id === formData.duree);
  
  return (
    <div className="step3-transaction">
      <div className="d-flex align-items-center mb-4">
        <div className="bg-success rounded p-2 me-3">
          <i className="fas fa-receipt text-white" style={{ fontSize: '1.5rem' }}></i>
        </div>
        <div>
          <h4 className="mb-0">Transaction</h4>
          <p className="text-muted mb-0">Résumé de la transaction</p>
        </div>
      </div>
      
      <div className="row">
        <div className="col-md-8">
          <Card className="border-success mb-4">
            <Card.Body>
              <h5 className="mb-3">Détails de la commande</h5>
              
              <div className="row mb-3">
                <div className="col-6">
                  <div className="text-muted small">Choix de l'offre</div>
                  <div className="fw-bold">{formData.offre}</div>
                </div>
                <div className="col-6">
                  <div className="text-muted small">Catégorie</div>
                  <div className="fw-bold">{formData.categorie || 'Non sélectionné'}</div>
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-6">
                  <div className="text-muted small">Durée du store</div>
                  <div className="fw-bold">{dureeSelectionnee?.name || '1 Mois'}</div>
                </div>
                <div className="col-6">
                  <div className="text-muted small">Commence le</div>
                  <div className="fw-bold">{new Date(formData.date_debut).toLocaleDateString('fr-FR')}</div>
                </div>
              </div>
              
              <div className="row mb-3">
                <div className="col-6">
                  <div className="text-muted small">Logo du store</div>
                  <div className="fw-bold">
                    {(formData.logo || formData.logoPreview || formData.logoUrl) ? '✓ Défini' : 'Non défini'}
                  </div>
                </div>
                <div className="col-6">
                  <div className="text-muted small">Nom du store</div>
                  <div className="fw-bold">{formData.nom_boutique || 'Non défini'}</div>
                </div>
              </div>
              
              <div className="mb-3">
                <div className="text-muted small">Description du store</div>
                <div className="fw-bold">
                  {formData.description_boutique 
                    ? (formData.description_boutique.length > 50 
                      ? formData.description_boutique.substring(0, 50) + '...' 
                      : formData.description_boutique)
                    : 'Non définie'}
                </div>
              </div>
              
              <hr />
              
              <div className="row">
                <div className="col-6">
                  <div className="text-muted">Montant initial :</div>
                  <div className="h5 text-primary">{formData.montant_initial.toLocaleString('fr-FR')} DA</div>
                </div>
                <div className="col-6 text-end">
                  {formData.mois_offerts > 0 && (
                    <Badge bg="success" className="mb-2">
                      {formData.mois_offerts} mois offert(s)
                    </Badge>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
        
        <div className="col-md-4">
          <Card className="border-primary">
            <Card.Body>
              <h5 className="mb-3">Récapitulatif</h5>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <span>Crédits:</span>
                  <span>{offreSelectionnee?.credits || 0}</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Stockage:</span>
                  <span>{offreSelectionnee?.storage || 0} MB</span>
                </div>
                <div className="d-flex justify-content-between mb-1">
                  <span>Durée:</span>
                  <span>{dureeSelectionnee?.name || '1 Mois'}</span>
                </div>
                {formData.mois_offerts > 0 && (
                  <div className="d-flex justify-content-between mb-1 text-success">
                    <span>Mois offerts:</span>
                    <span>-{formData.mois_offerts} mois</span>
                  </div>
                )}
              </div>
              
              <hr />
              
              <div className="text-center">
                <div className="text-muted small">Prix Total TTC</div>
                <div className="montant-ttc">{formData.montant_ttc.toLocaleString('fr-FR')} DA</div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Step 4: Détail de la transaction
const Step4DetailTransaction = ({ formData, methodesPaiement, handleInputChange, offres, durees, transactionId }) => {
  const offreSelectionnee = offres.find(o => o.id === formData.offre);
  const dureeSelectionnee = durees.find(d => d.id === formData.duree);
  
  return (
    <div className="step4-detail-transaction">
      <h4 className="section-title">Détail de la transaction</h4>
      
      <Card className="mb-4">
        <Card.Body>
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="text-muted small">Transaction #</div>
              <div className="h5">{transactionId}</div>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="text-muted small">Date</div>
              <div className="h5">{new Date().toLocaleString('fr-FR')}</div>
            </div>
          </div>
          
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead className="table-light">
                <tr>
                  <th>Désignation</th>
                  <th>Durée</th>
                  <th>Commence le</th>
                  <th>Montant HT</th>
                  <th>Taxe 19%</th>
                  <th>Montant TTC</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Achat d'un store {formData.offre}</td>
                  <td>{dureeSelectionnee?.name || '1 Mois'}</td>
                  <td>{new Date(formData.date_debut).toLocaleDateString('fr-FR')}</td>
                  <td>{formData.montant_initial.toLocaleString('fr-FR')} DA</td>
                  <td>{(formData.montant_initial * 0.19).toLocaleString('fr-FR')} DA</td>
                  <td>{formData.montant_ttc.toLocaleString('fr-FR')} DA</td>
                  <td>
                    <Button variant="outline-primary" size="sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </td>
                </tr>
              </tbody>
              <tfoot className="table-secondary">
                <tr>
                  <td colSpan="5" className="text-end fw-bold">Prix Total</td>
                  <td colSpan="2" className="fw-bold">
                    <div className="montant-ttc">{formData.montant_ttc.toLocaleString('fr-FR')} DA</div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </Card.Body>
      </Card>
      
      <div className="row">
        <div className="col-md-6">
          <Card>
            <Card.Body>
              <h5 className="mb-3">Informations</h5>
              
              <Form.Group className="mb-3">
                <Form.Label>Nom du client</Form.Label>
                <Form.Control
                  type="text"
                  name="client_nom"
                  value={formData.client_nom}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Téléphone</Form.Label>
                <Form.Control
                  type="tel"
                  name="client_telephone"
                  value={formData.client_telephone}
                  onChange={handleInputChange}
                  placeholder="05 XX XX XX XX"
                  required
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </div>
        
        <div className="col-md-6">
          <Card>
            <Card.Body>
              <h5 className="mb-3">Paiement</h5>
              
              <Form.Group className="mb-3">
                <Form.Label>
                  Méthode de paiement <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="methode_paiement"
                  value={formData.methode_paiement}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Sélectionnez une méthode</option>
                  {methodesPaiement.map((methode) => (
                    <option key={methode.value} value={methode.value}>
                      {methode.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Sélectionnez votre méthode de paiement préférée
                </Form.Text>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  name="accepte_conditions"
                  id="accepte_conditions"
                  label={
                    <span>
                      <strong>J'accepte les conditions générales</strong>
                      <span className="text-danger"> *</span>
                    </span>
                  }
                  checked={formData.accepte_conditions}
                  onChange={handleInputChange}
                  required
                />
                <Form.Text className="text-muted">
                  En cochant cette case, vous acceptez nos conditions générales de vente
                </Form.Text>
              </Form.Group>
              
              <Alert variant="info" className="mt-3">
                <i className="fas fa-info-circle me-2"></i>
                <strong>Important:</strong> Votre demande sera évaluée par nos administrateurs. 
                Vous recevrez une confirmation par email une fois approuvée.
              </Alert>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateBoutiqueWizard;