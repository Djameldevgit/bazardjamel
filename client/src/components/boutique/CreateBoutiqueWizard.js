import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Alert, Spinner, Badge, ProgressBar, Form, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createBoutique, updateBoutique } from '../../redux/actions/boutiqueAction';
import ImageUploadBoutique from './ImageUploadBoutique';

const CreateBoutiqueWizard = ({ onSuccess, isEdit = false, boutiqueData = null }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth, alert } = useSelector(state => state);

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionId] = useState('BTR-' + Date.now().toString().slice(-6));

  // 🖼️ Estado para imágenes - IGUAL QUE EN CreateAnnoncePage
  const [images, setImages] = useState([]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    // Informations
    nom_boutique: '',
    domaine_boutique: '',
    slogan_boutique: '',
    description_boutique: '',
    date_debut: new Date().toISOString().split('T')[0],

    // Choix
    categorie: '',
    duree: '1',
    offre: 'Store Basic 50',

    // Propriétaire
    proprietaire: {
      nom: auth?.user?.name || '',
      email: auth?.user?.email || '',
      telephone: auth?.user?.mobile || '',
      wilaya: '',
      adresse: ''
    },

    // Réseaux sociaux
    reseaux_sociaux: {
      facebook: '',
      instagram: '',
      tiktok: '',
      whatsapp: '',
      website: ''
    },

    // Autres
    couleur_theme: '#2563eb',

    // Calculés
    montant_initial: 0,
    mois_offerts: 0,
    montant_ttc: 0,

    // Paiement
    methode_paiement: '',
    client_nom: auth?.user?.name || '',
    client_telephone: auth?.user?.mobile || '',
    accepte_conditions: false
  });

  // Données pour les sliders
  const categories = [
    { id: 'auto', name: 'Automobiles & Véhicules', icon: 'fa-car' },
    { id: 'informatique', name: 'Informatique', icon: 'fa-laptop' },
    { id: 'meubles', name: 'Meubles & Maison', icon: 'fa-couch' },
    { id: 'materiaux', name: 'Matériaux & Equipement', icon: 'fa-tools' },
    { id: 'telephonie', name: 'Téléphonie & Accessoires', icon: 'fa-mobile-alt' },
    { id: 'pieces', name: 'Pièces détachées', icon: 'fa-car-battery' },
    { id: 'electromenager', name: 'Electroménager & Electronique', icon: 'fa-tv' },
    { id: 'vetements', name: 'Vêtements & Mode', icon: 'fa-tshirt' },
    { id: 'sante', name: 'Santé & Beauté', icon: 'fa-heartbeat' },
    { id: 'loisirs', name: 'Loisirs & Divertissement', icon: 'fa-gamepad' },
    { id: 'emploi', name: 'Offres & Demandes d\'emploi', icon: 'fa-briefcase' },
    { id: 'immobilier', name: 'Immobilier', icon: 'fa-building' },
    { id: 'services', name: 'Services', icon: 'fa-concierge-bell' },
    { id: 'voyages', name: 'Voyages', icon: 'fa-plane' },
    { id: 'alimentaire', name: 'Alimentaire', icon: 'fa-utensils' },
    { id: 'sport', name: 'Sport', icon: 'fa-futbol' }
  ];

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

  const offres = [
    {
      id: 'Store Basic 50',
      name: 'Store Basic 50',
      credits: 50,
      storage: 100,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une'],
      couleur: '#3b82f6',
      prix_mois: 5000,
      badge: 'Débutant'
    },
    {
      id: 'Store Basic 100',
      name: 'Store Basic 100',
      credits: 100,
      storage: 200,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une', 'Stats avancées'],
      couleur: '#3b82f6',
      prix_mois: 8500,
      badge: 'Populaire'
    },
    {
      id: 'Store Basic 150',
      name: 'Store Basic 150',
      credits: 150,
      storage: 300,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une', 'Stats avancées', 'Support prioritaire'],
      couleur: '#3b82f6',
      prix_mois: 12000,
      badge: 'Recommandé'
    },
    {
      id: 'Store Silver 200',
      name: 'Store Silver 200',
      credits: 200,
      storage: 400,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une', 'API Access'],
      couleur: '#6b7280',
      prix_mois: 15000,
      badge: 'Professionnel'
    },
    {
      id: 'Store Silver 300',
      name: 'Store Silver 300',
      credits: 300,
      storage: 600,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une', 'API Access', 'Marketing tools'],
      couleur: '#6b7280',
      prix_mois: 21000,
      badge: 'Professionnel+'
    },
    {
      id: 'Store Silver 500',
      name: 'Store Silver 500',
      credits: 500,
      storage: 1000,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une', 'API Access', 'Marketing tools', 'Multi-vendeurs'],
      couleur: '#6b7280',
      prix_mois: 35000,
      badge: 'Business'
    },
    {
      id: 'Store Gold 1000',
      name: 'Store Gold 1000',
      credits: 1000,
      storage: 2000,
      features: ['Tout inclus', 'Support 24/7', 'Formation', 'Certificat SSL'],
      couleur: '#f59e0b',
      prix_mois: 70000,
      badge: 'Premium'
    },
    {
      id: 'Store Gold 2000',
      name: 'Store Gold 2000',
      credits: 2000,
      storage: 4000,
      features: ['Tout inclus', 'Support 24/7', 'Formation', 'SSL', 'Nom de domaine offert'],
      couleur: '#f59e0b',
      prix_mois: 130000,
      badge: 'Enterprise'
    },
    {
      id: 'Store Gold 6000',
      name: 'Store Gold 6000',
      credits: 6000,
      storage: 12000,
      features: ['Solution complète', 'Dédié', 'Formation sur site', 'SLA 99.9%'],
      couleur: '#f59e0b',
      prix_mois: 350000,
      badge: 'Ultimate'
    }
  ];

  const methodesPaiement = [
    { value: 'ccp', label: 'CCP', icon: 'fa-credit-card', description: 'Compte de Chèque Postal' },
    { value: 'cib', label: 'CIB', icon: 'fa-university', description: 'Carte Interbancaire' },
    { value: 'edahabia', label: 'Edahabia', icon: 'fa-mobile-alt', description: 'Carte Edahabia' },
    { value: 'baridimob', label: 'BaridiMob', icon: 'fa-mobile-alt', description: 'Mobile Money' },
    { value: 'virement', label: 'Virement', icon: 'fa-exchange-alt', description: 'Virement bancaire' }
  ];

  // ============ HANDLERS POUR IMAGES - MEJORADOS ============
  // 🖼️ Handlers para imágenes - VERSIÓN CORREGIDA
const handleChangeImages = (e) => {
  const files = Array.from(e.target.files);
  
  // Filtrar archivos válidos
  const validFiles = files.filter(file => {
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max
      const isValidType = file.type.startsWith('image/');
      
      if (!isValidSize) setError('Image trop volumineuse (max 5MB)');
      if (!isValidType) setError('Format non supporté');
      
      return isValidSize && isValidType;
  });
  
  if (validFiles.length > 0) {
      // 🎯 Convertir File a objeto con blob URL
      const newImages = validFiles.map(file => ({
          url: URL.createObjectURL(file),
          name: file.name,
          file: file,
          isExisting: false
      }));
      
      setImages(prev => [...prev, ...newImages]);
      setSuccess(`${validFiles.length} image(s) ajoutée(s)`);
      setTimeout(() => setSuccess(''), 2000);
  }
};

const deleteImages = (index) => {
  // Liberar memoria de blob URLs
  if (images[index]?.url?.startsWith('blob:')) {
      URL.revokeObjectURL(images[index].url);
  }
  setImages(prev => prev.filter((_, i) => i !== index));
};

// Cleanup al desmontar
useEffect(() => {
  return () => {
      images.forEach(img => {
          if (img.url?.startsWith('blob:')) {
              URL.revokeObjectURL(img.url);
          }
      });
  };
}, []);

  

  // Handlers pour le formulaire
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Générer le domaine automatiquement
    if (name === 'nom_boutique' && !formData.domaine_boutique && !isEdit) {
      const domaine = value
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, domaine_boutique: domaine }));
    }
  };

  // Handlers pour les sélections
  const handleSelectCategorie = (categorie) => {
    setFormData(prev => ({ ...prev, categorie }));
  };

  const handleSelectDuree = (dureeId) => {
    setFormData(prev => ({ ...prev, duree: dureeId }));
    setTimeout(() => calculerMontants(), 100);
  };

  const handleSelectOffre = (offreId) => {
    setFormData(prev => ({ ...prev, offre: offreId }));
    setTimeout(() => calculerMontants(), 100);
  };

  // Calculer les montants
  const calculerMontants = () => {
    const offreSelectionnee = offres.find(o => o.id === formData.offre);
    const dureeMois = parseInt(formData.duree);

    if (!offreSelectionnee) return;

    let moisOfferts = 0;
    if (dureeMois >= 12) moisOfferts = 3;
    else if (dureeMois >= 6) moisOfferts = 1;

    const moisPayer = Math.max(1, dureeMois - moisOfferts);
    const montantInitial = offreSelectionnee.prix_mois * moisPayer;
    const taxe = montantInitial * 0.19;
    const montantTTC = montantInitial + taxe;

    setFormData(prev => ({
      ...prev,
      montant_initial: montantInitial,
      mois_offerts: moisOfferts,
      montant_ttc: montantTTC
    }));
  };

  // Validation des steps
  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.nom_boutique?.trim() !== '' &&
          formData.description_boutique?.trim() !== '' &&
          images.length > 0;
      case 2:
        return formData.categorie !== '' &&
          formData.duree !== '' &&
          formData.offre !== '';
      case 3:
        return true;
      case 4:
        return formData.methode_paiement !== '' &&
          formData.accepte_conditions === true &&
          formData.client_telephone?.trim() !== '';
      default:
        return false;
    }
  };

  // Navigation
  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 2) calculerMontants();
      setCurrentStep(prev => prev + 1);
      setError('');
    } else {
      let message = '';
      switch (currentStep) {
        case 1:
          if (!formData.nom_boutique) message = 'Nom de la boutique requis';
          else if (!formData.description_boutique) message = 'Description requise';
          else if (images.length === 0) message = 'Logo obligatoire';
          break;
        case 2:
          if (!formData.categorie) message = 'Catégorie requise';
          else if (!formData.duree) message = 'Durée requise';
          else if (!formData.offre) message = 'Pack requis';
          break;
        case 4:
          if (!formData.methode_paiement) message = 'Mode de paiement requis';
          else if (!formData.client_telephone) message = 'Téléphone requis';
          else if (!formData.accepte_conditions) message = 'Vous devez accepter les conditions';
          break;
      }
      setError(message || 'Veuillez remplir tous les champs');
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
    setError('');
  };

  // Préparer les données pour l'envoi
  // Préparer les données pour l'envoi - VERSIÓN CORREGIDA
// 📦 Préparer les données pour l'envoi - VERSIÓN CORREGIDA
// En CreateBoutiqueWizard.js - FUNCIÓN CORREGIDA
const prepareSubmitData = () => {
  const offreSelectionnee = offres.find(o => o.id === formData.offre);
  const dureeSelectionnee = durees.find(d => d.id === formData.duree);
  
  const planMapping = {
    'Store Basic 50': 'gratuit',
    'Store Basic 100': 'gratuit',
    'Store Basic 150': 'gratuit',
    'Store Silver 200': 'basique',
    'Store Silver 300': 'basique',
    'Store Silver 500': 'basique',
    'Store Gold 1000': 'premium',
    'Store Gold 2000': 'entreprise',
    'Store Gold 6000': 'entreprise'
  };

  const dureeMapping = {
    '1': '1mois', '2': '1mois', '3': '3mois', '4': '3mois',
    '5': '6mois', '6': '6mois', '7': '6mois', '8': '6mois',
    '9': '1an', '10': '1an', '11': '1an', '12': '1an'
  };

  const generateSubCategory = (categorie) => {
    if (!categorie) return '';
    return 'boutique-' + categorie
      .toLowerCase()
      .replace(/[&]/g, 'et')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // 🎯 Generar dominio ÚNICO
  const generateUniqueDomain = () => {
    const baseDomain = formData.nom_boutique
      ? formData.nom_boutique.toLowerCase()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
      : 'boutique';
    
    // Añadir timestamp para hacerlo único
    const timestamp = Date.now().toString().slice(-4);
    return `${baseDomain}-${timestamp}`;
  };

  const subCategory = generateSubCategory(formData.categorie);
  
  // Usar el dominio personalizado si existe, si no generar uno único
  const domaine_boutique = formData.domaine_boutique?.trim() 
    ? formData.domaine_boutique 
    : generateUniqueDomain();

  return {
    nom_boutique: formData.nom_boutique,
    domaine_boutique: domaine_boutique,  // ← Ahora siempre único
    slogan_boutique: formData.slogan_boutique || '',
    description_boutique: formData.description_boutique,
    date_debut: formData.date_debut,
    
    categorie: formData.categorie,
    subCategory: subCategory,
    
    plan: planMapping[formData.offre] || 'gratuit',
    duree_abonnement: dureeMapping[formData.duree] || '1mois',
    
    proprietaire: formData.proprietaire,
    reseaux_sociaux: formData.reseaux_sociaux,
    couleur_theme: formData.couleur_theme,
    
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
    
    montant_initial: formData.montant_initial,
    mois_offerts: formData.mois_offerts,
    montant_ttc: formData.montant_ttc,
    methode_paiement: formData.methode_paiement,
    transaction_id: transactionId,
    
    client_nom: formData.client_nom,
    client_telephone: formData.client_telephone
  };
};

  // 🚀 Submit - VERSIÓN MEJORADA CON IMÁGENES
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      setError('Au moins une image est requise');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Preparar datos SIN imágenes (las imágenes van aparte)
      const boutiqueData = prepareSubmitData();

      console.log('📤 Enviando boutique:', {
        nom: boutiqueData.nom_boutique,
        imagesCount: images.length,
        imagesType: images.map(img => img instanceof File ? 'File' : 'Existing')
      });

      if (isEdit && boutiqueId) {
        await dispatch(updateBoutique({
          boutiqueId,
          boutiqueData,
          images,  // ← Las imágenes van aparte
          auth
        }));
        setSuccess('Boutique mise à jour avec succès!');
      } else {
        const result = await dispatch(createBoutique({
          boutiqueData,
          images,  // ← Las imágenes van aparte
          auth
        }));

        if (result) {
          setSuccess('Boutique créée avec succès!');
          setTimeout(() => {
            if (onSuccess) {
              onSuccess(result.boutique || result);
            } else {
              const newId = result.boutique?._id || result._id;
              if (newId) history.push(`/boutique/${newId}`);
            }
          }, 2000);
        }
      }
    } catch (err) {
      console.error('❌ Erreur:', err);
      setError(err.message || 'Erreur lors de la création');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Chargement des données en mode édition
  useEffect(() => {
    if (isEdit && boutiqueData) {
      setFormData({
        nom_boutique: boutiqueData.nom_boutique || '',
        domaine_boutique: boutiqueData.domaine_boutique || '',
        slogan_boutique: boutiqueData.slogan_boutique || '',
        description_boutique: boutiqueData.description_boutique || '',
        date_debut: boutiqueData.date_debut?.split('T')[0] || new Date().toISOString().split('T')[0],
        categorie: boutiqueData.categorie || '',
        duree: boutiqueData.duree_choisie?.id || '1',
        offre: boutiqueData.offre_choisie?.id || 'Store Basic 50',
        proprietaire: {
          nom: boutiqueData.proprietaire?.nom || auth?.user?.name || '',
          email: boutiqueData.proprietaire?.email || auth?.user?.email || '',
          telephone: boutiqueData.proprietaire?.telephone || auth?.user?.mobile || '',
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
        couleur_theme: boutiqueData.couleur_theme || '#2563eb',
        montant_initial: boutiqueData.montant_initial || 0,
        mois_offerts: boutiqueData.mois_offerts || 0,
        montant_ttc: boutiqueData.montant_ttc || 0,
        methode_paiement: boutiqueData.methode_paiement || '',
        client_nom: boutiqueData.client_nom || auth?.user?.name || '',
        client_telephone: boutiqueData.client_telephone || auth?.user?.mobile || '',
        accepte_conditions: boutiqueData.accepte_conditions || false
      });

      // 🖼️ Charger les images existantes
      if (boutiqueData.images?.length > 0) {
        setImages(boutiqueData.images.map((img, idx) => ({
          url: img.url,
          public_id: img.public_id || `existing_${idx}`,
          isExisting: true
        })));
      }
    }
  }, [isEdit, boutiqueData, auth]);

  useEffect(() => {
    if (alert.error) setError(alert.error);
    if (alert.success) setSuccess(alert.success);
  }, [alert]);

  // ============ RENDER ============
  return (
    <div className="create-boutique-wizard">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="fw-bold">
          {isEdit ? '✏️ Modifier votre boutique' : '🏪 Créer votre boutique'}
        </h2>
        <p className="text-muted">
          {isEdit ? 'Mettez à jour vos informations' : 'Créez votre boutique en ligne'}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-2">
          {[
            { step: 1, label: 'Informations', icon: '📝' },
            { step: 2, label: 'Pack', icon: '💼' },
            { step: 3, label: 'Récap', icon: '📋' },
            { step: 4, label: 'Paiement', icon: '💳' }
          ].map((item, idx) => (
            <React.Fragment key={item.step}>
              <div className="text-center">
                <div
                  className={`step-circle ${currentStep >= item.step ? 'completed' : ''} ${currentStep === item.step ? 'active' : ''}`}
                  onClick={() => currentStep > item.step && setCurrentStep(item.step)}
                >
                  {currentStep > item.step ? '✓' : item.icon}
                </div>
                <small className={`step-label ${currentStep === item.step ? 'active' : ''}`}>
                  {item.label}
                </small>
              </div>
              {idx < 3 && (
                <div className={`step-connector ${currentStep > item.step ? 'completed' : ''}`} />
              )}
            </React.Fragment>
          ))}
        </div>
        <ProgressBar
          now={(currentStep / 4) * 100}
          variant="primary"
          className="mt-2"
          style={{ height: '4px' }}
        />
      </div>

      {/* Contenu */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-4">
          {currentStep === 1 && (
            <Step1Informations
              formData={formData}
              handleInputChange={handleInputChange}
              images={images}
              handleChangeImages={handleChangeImages}
              deleteImages={deleteImages}
            />
          )}

          {currentStep === 2 && (
            <Step2ChoixOffre
              formData={formData}
              categories={categories}
              durees={durees}
              offres={offres}
              handleSelectCategorie={handleSelectCategorie}
              handleSelectDuree={handleSelectDuree}
              handleSelectOffre={handleSelectOffre}
            />
          )}

          {currentStep === 3 && (
            <Step3Resume
              formData={formData}
              offres={offres}
              durees={durees}
              transactionId={transactionId}
            />
          )}

          {currentStep === 4 && (
            <Step4Paiement
              formData={formData}
              methodesPaiement={methodesPaiement}
              handleInputChange={handleInputChange}
              offres={offres}
              durees={durees}
              transactionId={transactionId}
            />
          )}
        </Card.Body>
      </Card>

      {/* Messages */}
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-3">
          <i className="fas fa-exclamation-circle me-2"></i>
          {error}
        </Alert>
      )}

      {success && (
        <Alert variant="success" dismissible onClose={() => setSuccess('')} className="mb-3">
          <i className="fas fa-check-circle me-2"></i>
          {success}
        </Alert>
      )}

      {/* Navigation */}
      <div className="d-flex justify-content-between">
        <Button
          variant="outline-secondary"
          onClick={prevStep}
          disabled={currentStep === 1 || isSubmitting}
          size="lg"
          className="px-4"
        >
          <i className="fas fa-arrow-left me-2"></i>
          Retour
        </Button>

        {currentStep < 4 ? (
          <Button
            variant="primary"
            onClick={nextStep}
            disabled={isSubmitting || !validateStep(currentStep)}
            size="lg"
            className="px-4"
          >
            Suivant
            <i className="fas fa-arrow-right ms-2"></i>
          </Button>
        ) : (
          <Button
            variant="success"
            onClick={handleSubmit}
            disabled={isSubmitting}
            size="lg"
            className="px-4"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" animation="border" className="me-2" />
                Création...
              </>
            ) : (
              <>
                <i className="fas fa-check-circle me-2"></i>
                {isEdit ? 'Mettre à jour' : 'Créer ma boutique'}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

// ============ STEP 1: INFORMATIONS ============
const Step1Informations = ({ formData, handleInputChange, images, handleChangeImages, deleteImages }) => {
  return (
    <div>
      <h5 className="mb-4">
        <i className="fas fa-store text-primary me-2"></i>
        Informations générales
      </h5>

      <Row>
        <Col md={6}>
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
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              Domaine <span className="text-danger">*</span>
            </Form.Label>
            <div className="input-group">
              <Form.Control
                type="text"
                name="domaine_boutique"
                value={formData.domaine_boutique}
                onChange={handleInputChange}
                placeholder="ma-boutique"
                required
              />
              <span className="input-group-text">.marketplace.dz</span>
            </div>
            <Form.Text className="text-muted">
              Votre boutique sera accessible à: {formData.domaine_boutique || 'ma-boutique'}.marketplace.dz
            </Form.Text>
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Slogan</Form.Label>
            <Form.Control
              type="text"
              name="slogan_boutique"
              value={formData.slogan_boutique}
              onChange={handleInputChange}
              placeholder="Ex: La mode à prix discount"
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Date de début</Form.Label>
            <Form.Control
              type="date"
              name="date_debut"
              value={formData.date_debut}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>

        <Col xs={12}>
          <Form.Group className="mb-3">
            <Form.Label>
              Description <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description_boutique"
              value={formData.description_boutique}
              onChange={handleInputChange}
              placeholder="Décrivez votre boutique, vos produits, vos services..."
              required
            />
          </Form.Group>
        </Col>

        <Col xs={12}>
          <Form.Group className="mb-3">
            <Form.Label>
              Logo <span className="text-danger">*</span>
            </Form.Label>
            <ImageUploadBoutique
              images={images}
              handleChangeImages={handleChangeImages}
              deleteImages={deleteImages}
            />
            {images.length === 0 && (
              <Form.Text className="text-danger">
                <i className="fas fa-exclamation-circle me-1"></i>
                Le logo est obligatoire
              </Form.Text>
            )}
          </Form.Group>
        </Col>
      </Row>

      <hr className="my-4" />

      <h5 className="mb-4">
        <i className="fas fa-user text-primary me-2"></i>
        Propriétaire
      </h5>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Nom complet</Form.Label>
            <Form.Control
              type="text"
              name="proprietaire.nom"
              value={formData.proprietaire.nom}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="proprietaire.email"
              value={formData.proprietaire.email}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Téléphone</Form.Label>
            <Form.Control
              type="tel"
              name="proprietaire.telephone"
              value={formData.proprietaire.telephone}
              onChange={handleInputChange}
              placeholder="05 XX XX XX XX"
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>Wilaya</Form.Label>
            <Form.Control
              type="text"
              name="proprietaire.wilaya"
              value={formData.proprietaire.wilaya}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>

        <Col xs={12}>
          <Form.Group className="mb-3">
            <Form.Label>Adresse</Form.Label>
            <Form.Control
              type="text"
              name="proprietaire.adresse"
              value={formData.proprietaire.adresse}
              onChange={handleInputChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <hr className="my-4" />

      <h5 className="mb-4">
        <i className="fas fa-share-alt text-primary me-2"></i>
        Réseaux sociaux
      </h5>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="fab fa-facebook text-primary me-1"></i> Facebook
            </Form.Label>
            <Form.Control
              type="url"
              name="reseaux_sociaux.facebook"
              value={formData.reseaux_sociaux.facebook}
              onChange={handleInputChange}
              placeholder="https://facebook.com/..."
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="fab fa-instagram text-danger me-1"></i> Instagram
            </Form.Label>
            <Form.Control
              type="url"
              name="reseaux_sociaux.instagram"
              value={formData.reseaux_sociaux.instagram}
              onChange={handleInputChange}
              placeholder="https://instagram.com/..."
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="fab fa-tiktok me-1"></i> TikTok
            </Form.Label>
            <Form.Control
              type="url"
              name="reseaux_sociaux.tiktok"
              value={formData.reseaux_sociaux.tiktok}
              onChange={handleInputChange}
              placeholder="https://tiktok.com/..."
            />
          </Form.Group>
        </Col>

        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="fab fa-whatsapp text-success me-1"></i> WhatsApp
            </Form.Label>
            <Form.Control
              type="text"
              name="reseaux_sociaux.whatsapp"
              value={formData.reseaux_sociaux.whatsapp}
              onChange={handleInputChange}
              placeholder="05 XX XX XX XX"
            />
          </Form.Group>
        </Col>

        <Col xs={12}>
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="fas fa-globe me-1"></i> Site web
            </Form.Label>
            <Form.Control
              type="url"
              name="reseaux_sociaux.website"
              value={formData.reseaux_sociaux.website}
              onChange={handleInputChange}
              placeholder="https://..."
            />
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};

// ============ STEP 2: CHOIX OFFRE ============
const Step2ChoixOffre = ({
  formData,
  categories,
  durees,
  offres,
  handleSelectCategorie,
  handleSelectDuree,
  handleSelectOffre
}) => {
  const categoriesRef = useRef(null);
  const dureesRef = useRef(null);
  const offresRef = useRef(null);

  const scroll = (ref, direction) => {
    if (ref.current) {
      const scrollAmount = 300;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div>
      {/* Catégories */}
      <div className="mb-5">
        <h6 className="mb-3">
          <i className="fas fa-tag text-primary me-2"></i>
          Catégorie <span className="text-danger">*</span>
        </h6>
        <div className="slider-container">
          <button className="slider-btn slider-btn-left" onClick={() => scroll(categoriesRef, 'left')}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="slider-scroll" ref={categoriesRef}>
            {categories.map(cat => (
              <div
                key={cat.id}
                className={`categorie-card text-center ${formData.categorie === cat.name ? 'selected' : ''}`}
                onClick={() => handleSelectCategorie(cat.name)}
              >
                <i className={`fas ${cat.icon} mb-2`} style={{ fontSize: '2rem', color: '#0d6efd' }}></i>
                <div className="small fw-bold">{cat.name}</div>
              </div>
            ))}
          </div>
          <button className="slider-btn slider-btn-right" onClick={() => scroll(categoriesRef, 'right')}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* Durées */}
      <div className="mb-5">
        <h6 className="mb-3">
          <i className="fas fa-calendar-alt text-primary me-2"></i>
          Durée <span className="text-danger">*</span>
        </h6>
        <div className="slider-container">
          <button className="slider-btn slider-btn-left" onClick={() => scroll(dureesRef, 'left')}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="slider-scroll" ref={dureesRef}>
            {durees.map(d => (
              <div
                key={d.id}
                className={`duree-card text-center ${formData.duree === d.id ? 'selected' : ''}`}
                onClick={() => handleSelectDuree(d.id)}
              >
                <i className="fas fa-clock mb-2" style={{ fontSize: '2rem', color: '#10b981' }}></i>
                <div className="fw-bold">{d.name}</div>
                {parseInt(d.id) >= 6 && (
                  <Badge bg="success" className="mt-2">
                    {parseInt(d.id) >= 12 ? '3 mois offerts' : '1 mois offert'}
                  </Badge>
                )}
              </div>
            ))}
          </div>
          <button className="slider-btn slider-btn-right" onClick={() => scroll(dureesRef, 'right')}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* Offres */}
      <div className="mb-4">
        <h6 className="mb-3">
          <i className="fas fa-gem text-primary me-2"></i>
          Pack <span className="text-danger">*</span>
        </h6>
        <div className="slider-container">
          <button className="slider-btn slider-btn-left" onClick={() => scroll(offresRef, 'left')}>
            <i className="fas fa-chevron-left"></i>
          </button>
          <div className="slider-scroll" ref={offresRef}>
            {offres.map(offre => (
              <div
                key={offre.id}
                className={`offre-card position-relative ${formData.offre === offre.id ? 'selected' : ''}`}
                onClick={() => handleSelectOffre(offre.id)}
              >
                {offre.badge && (
                  <span className="offre-badge">{offre.badge}</span>
                )}
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <h6 className="mb-0" style={{ color: offre.couleur }}>{offre.name}</h6>
                  <Badge bg={offre.couleur === '#f59e0b' ? 'warning' : 'secondary'}>
                    {offre.credits} crédits
                  </Badge>
                </div>
                <div className="mb-3">
                  <div className="text-muted small">Stockage</div>
                  <div className="h5 mb-0">{offre.storage} MB</div>
                </div>
                <div className="small">
                  {offre.features.map((f, i) => (
                    <div key={i} className="d-flex align-items-center mb-1">
                      <i className="fas fa-check text-success me-2" style={{ fontSize: '0.7rem' }}></i>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-3 pt-2 border-top">
                  <span className="fw-bold text-primary">{offre.prix_mois.toLocaleString()} DA</span>
                  <small className="text-muted d-block">/mois</small>
                </div>
              </div>
            ))}
          </div>
          <button className="slider-btn slider-btn-right" onClick={() => scroll(offresRef, 'right')}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <style jsx="true">{`
        .slider-container {
          position: relative;
          padding: 0 40px;
        }
        
        .slider-scroll {
          display: flex;
          overflow-x: auto;
          scroll-behavior: smooth;
          gap: 15px;
          padding: 10px 0;
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
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: white;
          border: 1px solid #dee2e6;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          z-index: 10;
        }
        
        .slider-btn:hover {
          background: #f8f9fa;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .slider-btn-left {
          left: 0;
        }
        
        .slider-btn-right {
          right: 0;
        }
        
        .categorie-card, .duree-card, .offre-card {
          min-width: 180px;
          padding: 15px;
          border: 2px solid #dee2e6;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
          flex-shrink: 0;
          background: white;
        }
        
        .categorie-card:hover, .duree-card:hover, .offre-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .categorie-card.selected {
          border-color: #0d6efd;
          background: rgba(13, 110, 253, 0.05);
        }
        
        .duree-card.selected {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
        }
        
        .offre-card.selected {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.05);
        }
        
        .offre-card {
          min-width: 250px;
        }
        
        .offre-badge {
          position: absolute;
          top: -10px;
          right: 10px;
          background: #f59e0b;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: bold;
        }
        
        @media (max-width: 768px) {
          .categorie-card, .duree-card {
            min-width: 140px;
          }
          
          .offre-card {
            min-width: 220px;
          }
          
          .slider-container {
            padding: 0 30px;
          }
        }
      `}</style>
    </div>
  );
};

// ============ STEP 3: RÉSUMÉ ============
const Step3Resume = ({ formData, offres, durees, transactionId }) => {
  const offreSelectionnee = offres.find(o => o.id === formData.offre);
  const dureeSelectionnee = durees.find(d => d.id === formData.duree);

  return (
    <div>
      <h5 className="mb-4">
        <i className="fas fa-file-invoice text-primary me-2"></i>
        Récapitulatif de votre commande
      </h5>

      <Card className="bg-light border-0 mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">Transaction N°</span>
            <span className="fw-bold">{transactionId}</span>
          </div>
          <div className="d-flex justify-content-between mb-2">
            <span className="text-muted">Date</span>
            <span>{new Date().toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="text-muted">Statut</span>
            <Badge bg="warning">En attente de paiement</Badge>
          </div>
        </Card.Body>
      </Card>

      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <h6 className="border-bottom pb-2 mb-3">Détails de la boutique</h6>

              <Row className="mb-2">
                <Col xs={5} className="text-muted">Nom</Col>
                <Col xs={7} className="fw-bold">{formData.nom_boutique}</Col>
              </Row>

              <Row className="mb-2">
                <Col xs={5} className="text-muted">Domaine</Col>
                <Col xs={7}>{formData.domaine_boutique}.marketplace.dz</Col>
              </Row>

              <Row className="mb-2">
                <Col xs={5} className="text-muted">Catégorie</Col>
                <Col xs={7}>{formData.categorie}</Col>
              </Row>

              <Row className="mb-2">
                <Col xs={5} className="text-muted">Pack</Col>
                <Col xs={7}>
                  {formData.offre}
                  <Badge bg="info" className="ms-2">{offreSelectionnee?.credits} crédits</Badge>
                </Col>
              </Row>

              <Row className="mb-2">
                <Col xs={5} className="text-muted">Durée</Col>
                <Col xs={7}>{dureeSelectionnee?.name}</Col>
              </Row>

              {formData.mois_offerts > 0 && (
                <Row className="mb-2">
                  <Col xs={5} className="text-muted">Offre spéciale</Col>
                  <Col xs={7}>
                    <Badge bg="success">🎁 {formData.mois_offerts} mois offert(s)</Badge>
                  </Col>
                </Row>
              )}

              <Row className="mb-2">
                <Col xs={5} className="text-muted">Propriétaire</Col>
                <Col xs={7}>{formData.proprietaire.nom || 'Non renseigné'}</Col>
              </Row>

              <Row className="mb-2">
                <Col xs={5} className="text-muted">Contact</Col>
                <Col xs={7}>{formData.proprietaire.telephone || 'Non renseigné'}</Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="bg-primary text-white border-0 sticky-top" style={{ top: '20px' }}>
            <Card.Body>
              <h6 className="text-white-50 mb-3">Total à payer</h6>
              <div className="display-5 fw-bold mb-3">
                {formData.montant_ttc.toLocaleString()} DA
              </div>

              <hr className="bg-white opacity-25" />

              <div className="small text-white-50">
                <div className="d-flex justify-content-between mb-2">
                  <span>Montant HT</span>
                  <span>{formData.montant_initial.toLocaleString()} DA</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>TVA 19%</span>
                  <span>{(formData.montant_initial * 0.19).toLocaleString()} DA</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Mois facturés</span>
                  <span>{parseInt(formData.duree) - formData.mois_offerts}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// ============ STEP 4: PAIEMENT ============
const Step4Paiement = ({ formData, methodesPaiement, handleInputChange, offres, durees, transactionId }) => {
  const offreSelectionnee = offres.find(o => o.id === formData.offre);
  const dureeSelectionnee = durees.find(d => d.id === formData.duree);

  return (
    <div className="step4-paiement">
      <h4 className="section-title mb-4">
        <i className="fas fa-credit-card me-2 text-primary"></i>
        Détail de la transaction
      </h4>

      {/* Transaction Info Card */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <div className="row mb-3">
            <div className="col-md-6">
              <div className="text-muted small">Transaction #</div>
              <div className="h5">{transactionId}</div>
            </div>
            <div className="col-md-6 text-md-end">
              <div className="text-muted small">Date</div>
              <div className="h5">{new Date().toLocaleDateString('fr-FR')}</div>
            </div>
          </div>

          {/* Table responsive */}
          <div className="table-responsive">
            <table className="table table-bordered table-hover">
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
                  <td>
                    <span className="fw-bold">Achat d'un store</span>
                    <br />
                    <small className="text-muted">{formData.offre}</small>
                  </td>
                  <td>{dureeSelectionnee?.name || '1 Mois'}</td>
                  <td>{new Date(formData.date_debut).toLocaleDateString('fr-FR')}</td>
                  <td>{formData.montant_initial?.toLocaleString('fr-FR') || 0} DA</td>
                  <td>{((formData.montant_initial || 0) * 0.19).toLocaleString('fr-FR')} DA</td>
                  <td className="fw-bold text-primary">{formData.montant_ttc?.toLocaleString('fr-FR') || 0} DA</td>
                  <td>
                    <Button variant="outline-primary" size="sm">
                      <i className="fas fa-edit"></i>
                    </Button>
                  </td>
                </tr>
              </tbody>
              <tfoot className="table-secondary">
                <tr>
                  <td colSpan="5" className="text-end fw-bold">Prix Total TTC</td>
                  <td colSpan="2" className="fw-bold">
                    <span className="montant-ttc text-primary">
                      {formData.montant_ttc?.toLocaleString('fr-FR') || 0} DA
                    </span>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Promotion badge */}
          {formData.mois_offerts > 0 && (
            <div className="mt-3">
              <Badge bg="success" className="p-2">
                <i className="fas fa-gift me-2"></i>
                {formData.mois_offerts} mois offert(s)
              </Badge>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Client Information */}
      <div className="row g-4">
        <div className="col-md-6">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-4">
                <i className="fas fa-user-circle me-2 text-primary"></i>
                Informations client
              </h5>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">Nom complet</Form.Label>
                <Form.Control
                  type="text"
                  name="client_nom"
                  value={formData.client_nom || ''}
                  onChange={handleInputChange}
                  placeholder="Entrez votre nom complet"
                  required
                  className="py-2"
                />
                <Form.Text className="text-muted">
                  Tel qu'il apparaîtra sur la facture
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-bold">Téléphone</Form.Label>
                <Form.Control
                  type="tel"
                  name="client_telephone"
                  value={formData.client_telephone || ''}
                  onChange={handleInputChange}
                  placeholder="05 XX XX XX XX"
                  required
                  className="py-2"
                />
                <Form.Text className="text-muted">
                  Pour vous contacter en cas de besoin
                </Form.Text>
              </Form.Group>

              {/* Résumé rapide */}
              <div className="bg-light p-3 rounded mt-4">
                <h6 className="mb-3">Récapitulatif</h6>
                <div className="d-flex justify-content-between mb-2">
                  <span>Pack:</span>
                  <span className="fw-bold">{formData.offre}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Durée:</span>
                  <span className="fw-bold">{dureeSelectionnee?.name}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Total TTC:</span>
                  <span className="fw-bold text-primary">
                    {formData.montant_ttc?.toLocaleString('fr-FR')} DA
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Payment Information */}
        <div className="col-md-6">
          <Card className="h-100 border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-4">
                <i className="fas fa-credit-card me-2 text-primary"></i>
                Paiement
              </h5>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">
                  Méthode de paiement <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="methode_paiement"
                  value={formData.methode_paiement || ''}
                  onChange={handleInputChange}
                  required
                  className="py-2"
                  size="lg"
                >
                  <option value="">Choisissez une méthode</option>
                  {methodesPaiement.map((methode) => (
                    <option key={methode.value} value={methode.value}>
                      {methode.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Vous recevrez les instructions après validation
                </Form.Text>
              </Form.Group>

              {/* Méthodes de paiement visuelles */}
              <div className="payment-methods-grid mb-4">
                <Row className="g-2">
                  {methodesPaiement.map((method) => (
                    <Col xs={6} key={method.value}>
                      <div
                        className={`payment-method-card p-3 text-center rounded cursor-pointer ${formData.methode_paiement === method.value ? 'selected border-primary' : 'border'}`}
                        onClick={() => handleInputChange({ target: { name: 'methode_paiement', value: method.value } })}
                        style={{
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          border: formData.methode_paiement === method.value ? '2px solid #0d6efd' : '1px solid #dee2e6',
                          backgroundColor: formData.methode_paiement === method.value ? '#f0f7ff' : 'white'
                        }}
                      >
                        <i className={`fas ${method.icon} mb-2`} style={{ fontSize: '1.5rem', color: '#0d6efd' }}></i>
                        <div className="small fw-bold">{method.label}</div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>

              {/* Conditions */}
              <Form.Group className="mb-4">
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
                  checked={formData.accepte_conditions || false}
                  onChange={handleInputChange}
                  required
                  className="py-2"
                />
                <Form.Text className="text-muted d-block mt-1">
                  En validant, vous acceptez nos conditions de vente et d'utilisation
                </Form.Text>
              </Form.Group>

              {/* Alert info */}
              <Alert variant="info" className="mt-3 mb-0">
                <div className="d-flex">
                  <i className="fas fa-info-circle me-3 mt-1" style={{ fontSize: '1.2rem' }}></i>
                  <div>
                    <strong>Important:</strong> Votre demande sera évaluée par nos administrateurs.
                    Vous recevrez une confirmation par email une fois approuvée.
                  </div>
                </div>
              </Alert>
            </Card.Body>
          </Card>
        </div>
      </div>

      <style jsx="true">{`
        .montant-ttc {
          font-size: 1.2rem;
          font-weight: bold;
        }
        
        .payment-method-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .payment-method-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
        
        .table th {
          font-weight: 600;
          font-size: 0.9rem;
        }
        
        .table td {
          vertical-align: middle;
        }
        
        .section-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #333;
        }
        
        @media (max-width: 768px) {
          .payment-method-card {
            padding: 0.75rem !important;
          }
          
          .payment-method-card i {
            font-size: 1.2rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CreateBoutiqueWizard;