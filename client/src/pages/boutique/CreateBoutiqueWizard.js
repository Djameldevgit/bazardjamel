import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Alert, Spinner, Badge, ProgressBar, Form, Row, Col, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { ChromePicker } from 'react-color'; // 👈 Instalar: npm install react-color
import ImageUploadBoutique from '../../components/boutique/ImageUploadBoutique';
import { createBoutique, updateBoutique } from '../../redux/actions/boutiqueAction';

const CreateBoutiqueWizard = ({ onSuccess, isEdit = false, boutiqueData = null }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth, alert } = useSelector(state => state);

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transactionId] = useState('BTR-' + Date.now().toString().slice(-6));
  const [showColorPicker, setShowColorPicker] = useState(false);

  // 🎨 Paleta de colores predefinidos
  const colorPalette = [
    '#2563eb', // Azul
    '#dc2626', // Rojo
    '#16a34a', // Verde
    '#9333ea', // Morado
    '#f59e0b', // Naranja
    '#ec4899', // Rosa
    '#06b6d4', // Cian
    '#6b7280', // Gris
    '#8b5cf6', // Violeta
    '#10b981', // Esmeralda
  ];

  // 🖼️ Estado para imágenes
  const [images, setImages] = useState([]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    // Informations
    _id: null, // Para edición
    nom_boutique: '',
    domaine_boutique: '',
    slogan_boutique: '',
    description_boutique: '',
    date_debut: new Date().toISOString().split('T')[0],

    // Choix
    categorie: '',
    duree: '1',
    offre: 'Store Basic 50',

    // ✅ Propietario (objeto completo)
    proprietaire: {
      nom: auth?.user?.name || '',
      email: auth?.user?.email || '',
      telephone: auth?.user?.mobile || '',
      wilaya: '',
      adresse: ''
    },

    // ✅ Usuario (referencia al ID del usuario autenticado)
    user: auth?.user?._id || null,

    // Réseaux sociaux
    reseaux_sociaux: {
      facebook: '',
      instagram: '',
      tiktok: '',
      whatsapp: '',
      website: ''
    },

    // 🎨 Couleur du thème (con paleta)
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

  // ============ HANDLERS POUR IMAGES ============
  const handleChangeImages = (e) => {
    const files = Array.from(e.target.files);
    
    const validFiles = files.filter(file => {
      const isValidSize = file.size <= 5 * 1024 * 1024;
      const isValidType = file.type.startsWith('image/');
      
      if (!isValidSize) setError('Image trop volumineuse (max 5MB)');
      if (!isValidType) setError('Format non supporté');
      
      return isValidSize && isValidType;
    });
    
    if (validFiles.length > 0) {
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

  // Handlers para el formulario
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

  // 🎨 Manejar cambio de color
  const handleColorChange = (color) => {
    setFormData(prev => ({ ...prev, couleur_theme: color.hex }));
  };

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

  // Preparar les données pour l'envoi - ✅ VERSIÓN CORREGIDA CON USER
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

    const generateUniqueDomain = () => {
      const baseDomain = formData.nom_boutique
        ? formData.nom_boutique.toLowerCase()
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '')
        : 'boutique';
      
      const timestamp = Date.now().toString().slice(-4);
      return `${baseDomain}-${timestamp}`;
    };

    const subCategory = generateSubCategory(formData.categorie);
    const domaine_boutique = formData.domaine_boutique?.trim() 
      ? formData.domaine_boutique 
      : generateUniqueDomain();

    // ✅ Asegurar que user es solo el ID (string)
    const userId = typeof formData.user === 'object' 
      ? formData.user._id 
      : formData.user || auth?.user?._id;

    return {
      // Campos principales
      nom_boutique: formData.nom_boutique,
      domaine_boutique: domaine_boutique,
      slogan_boutique: formData.slogan_boutique || '',
      description_boutique: formData.description_boutique,
      date_debut: formData.date_debut,
      
      // ✅ USER - solo el ID
      user: userId,
      
      // Categorías
      categorie: formData.categorie,
      subCategory: subCategory,
      
      // Plan
      plan: planMapping[formData.offre] || 'gratuit',
      duree_abonnement: dureeMapping[formData.duree] || '1mois',
      
      // ✅ Propriétaire (objeto completo)
      proprietaire: {
        nom: formData.proprietaire.nom || auth?.user?.name || '',
        email: formData.proprietaire.email || auth?.user?.email || '',
        telephone: formData.proprietaire.telephone || auth?.user?.mobile || '',
        wilaya: formData.proprietaire.wilaya || '',
        adresse: formData.proprietaire.adresse || ''
      },
      
      // Réseaux sociaux
      reseaux_sociaux: formData.reseaux_sociaux,
      
      // 🎨 Couleur du thème
      couleur_theme: formData.couleur_theme,
      
      // Offre choisie
      offre_choisie: offreSelectionnee ? {
        id: offreSelectionnee.id,
        nom: offreSelectionnee.name,
        credits: offreSelectionnee.credits,
        storage: offreSelectionnee.storage,
        prix_mois: offreSelectionnee.prix_mois
      } : null,
      
      // Durée choisie
      duree_choisie: dureeSelectionnee ? {
        id: dureeSelectionnee.id,
        nom: dureeSelectionnee.name
      } : null,
      
      // Paiement
      montant_initial: formData.montant_initial,
      mois_offerts: formData.mois_offerts,
      montant_ttc: formData.montant_ttc,
      methode_paiement: formData.methode_paiement,
      transaction_id: transactionId,
      
      client_nom: formData.client_nom,
      client_telephone: formData.client_telephone
    };
  };

  // 🚀 Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 handleSubmit iniciado');

    if (images.length === 0) {
      setError('Au moins une image est requise');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const submitData = prepareSubmitData();
      console.log('📦 submitData preparado:', submitData);

      if (isEdit) {
        const boutiqueId = formData._id || formData.id;
        
        if (!boutiqueId) {
          throw new Error('ID de boutique non trouvé pour la modification');
        }

        await dispatch(updateBoutique({
          boutiqueId,
          boutiqueData: submitData,
          images,
          auth
        }));
        
        setSuccess('Boutique mise à jour avec succès!');
        
        setTimeout(() => {
          if (onSuccess) {
            onSuccess({ ...submitData, _id: boutiqueId });
          } else {
            history.push(`/boutique/${boutiqueId}`);
          }
        }, 2000);
        
      } else {
        const result = await dispatch(createBoutique({
          boutiqueData: submitData,
          images,
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
    console.log('🎯 Wizard useEffect - isEdit:', isEdit, 'boutiqueData:', boutiqueData);
    
    if (isEdit && boutiqueData) {
      const newFormData = {
        _id: boutiqueData._id || boutiqueData.id,
        id: boutiqueData._id || boutiqueData.id,
        nom_boutique: boutiqueData.nom_boutique || '',
        domaine_boutique: boutiqueData.domaine_boutique || '',
        slogan_boutique: boutiqueData.slogan_boutique || '',
        description_boutique: boutiqueData.description_boutique || '',
        date_debut: boutiqueData.date_debut?.split('T')[0] || new Date().toISOString().split('T')[0],
        categorie: boutiqueData.categorie || '',
        duree: boutiqueData.duree_choisie?.id || boutiqueData.duree || '1',
        offre: boutiqueData.offre_choisie?.id || boutiqueData.offre || 'Store Basic 50',
        
        // ✅ Propriétaire
        proprietaire: {
          nom: boutiqueData.proprietaire?.nom || auth?.user?.name || '',
          email: boutiqueData.proprietaire?.email || auth?.user?.email || '',
          telephone: boutiqueData.proprietaire?.telephone || auth?.user?.mobile || '',
          wilaya: boutiqueData.proprietaire?.wilaya || '',
          adresse: boutiqueData.proprietaire?.adresse || ''
        },
        
        // ✅ User
        user: boutiqueData.user?._id || boutiqueData.user || auth?.user?._id,
        
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
      };
      
      console.log('📝 Nuevo formData creado:', newFormData);
      setFormData(newFormData);

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
              colorPalette={colorPalette}
              handleColorChange={handleColorChange}
              showColorPicker={showColorPicker}
              setShowColorPicker={setShowColorPicker}
            />
          )}

          {currentStep === 2 && (
            <Step2ChoixOffre
              formData={formData}
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

// ============ STEP 1: INFORMATIONS (CON COLOR PICKER) ============
const Step1Informations = ({ 
  formData, 
  handleInputChange, 
  images, 
  handleChangeImages, 
  deleteImages,
  colorPalette,
  handleColorChange,
  showColorPicker,
  setShowColorPicker 
}) => {
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

        {/* 🎨 Sélecteur de couleur du thème */}
        <Col xs={12}>
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="fas fa-palette me-2 text-primary"></i>
              Couleur du thème
            </Form.Label>
            
            {/* Palette de couleurs pré-définies */}
            <div className="color-palette mb-2">
              {colorPalette.map((color, index) => (
                <OverlayTrigger
                  key={index}
                  placement="top"
                  overlay={<Tooltip>Choisir cette couleur</Tooltip>}
                >
                  <div
                    className="color-swatch"
                    style={{
                      backgroundColor: color,
                      width: '35px',
                      height: '35px',
                      borderRadius: '50%',
                      display: 'inline-block',
                      margin: '0 5px 5px 0',
                      cursor: 'pointer',
                      border: formData.couleur_theme === color ? '3px solid #000' : '1px solid #ddd',
                      boxShadow: formData.couleur_theme === color ? '0 0 0 2px white, 0 0 0 4px #0d6efd' : 'none'
                    }}
                    onClick={() => handleColorChange({ hex: color })}
                  />
                </OverlayTrigger>
              ))}
            </div>

            {/* Selector de color personalizado */}
            <div className="d-flex align-items-center">
              <div
                className="current-color-preview me-3"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  backgroundColor: formData.couleur_theme,
                  border: '2px solid #ddd',
                  cursor: 'pointer'
                }}
                onClick={() => setShowColorPicker(!showColorPicker)}
              />
              <Form.Control
                type="text"
                value={formData.couleur_theme}
                onChange={(e) => handleColorChange({ hex: e.target.value })}
                placeholder="#2563eb"
                style={{ width: '120px' }}
              />
              <Button
                variant="outline-primary"
                size="sm"
                className="ms-2"
                onClick={() => setShowColorPicker(!showColorPicker)}
              >
                <i className="fas fa-paint-brush me-1"></i>
                Personnaliser
              </Button>
            </div>

            {/* Color Picker (ChromePicker) */}
            {showColorPicker && (
              <div className="color-picker-popover mt-2">
                <div className="color-picker-cover" onClick={() => setShowColorPicker(false)} />
                <ChromePicker
                  color={formData.couleur_theme}
                  onChange={handleColorChange}
                />
              </div>
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

      <style jsx="true">{`
        .color-palette {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
        }
        
        .color-swatch {
          transition: transform 0.2s ease;
        }
        
        .color-swatch:hover {
          transform: scale(1.1);
        }
        
        .color-picker-popover {
          position: relative;
          z-index: 100;
        }
        
        .color-picker-cover {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
        }
        
        .current-color-preview {
          transition: transform 0.2s ease;
        }
        
        .current-color-preview:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

// ============ STEP 2: CHOIX OFFRE (sin cambios) ============
const Step2ChoixOffre = ({
  formData,
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
      const scrollAmount = 400;
      ref.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const categories = [
    { id: 'agences-immobilieres', name: 'Agences immobilières', icon: 'fa-building', level: 2 },
    { id: 'promotions-immobilieres', name: 'Promotions immobilières', icon: 'fa-city', level: 2 },
    { id: 'showroom-automobiles', name: 'Showroom automobiles', icon: 'fa-car', level: 2 },
    { id: 'showroom-moto', name: 'Showroom moto', icon: 'fa-motorcycle', level: 2 },
    { id: 'camions-engins', name: 'Camions & Engins', icon: 'fa-truck', level: 2 },
    { id: 'pieces-accessoires-vehicules', name: 'Pièces & Accessoires Véhicules', icon: 'fa-car-battery', level: 2 },
    { id: 'location-voitures', name: 'Location de voitures', icon: 'fa-car-side', level: 2 },
    { id: 'reparation-services-vehicules', name: 'Réparation & Services Véhicules', icon: 'fa-wrench', level: 2 },
    { id: 'telephones-accessoires', name: 'Téléphones & Accessoires', icon: 'fa-mobile-alt', level: 2 },
    { id: 'magasin-informatique', name: "Magasin d'informatique", icon: 'fa-laptop', level: 2 },
    { id: 'magasin-electromenager', name: "Magasin d'électroménager", icon: 'fa-tv', level: 2 },
    { id: 'equipements-securite', name: 'Equipements de sécurité', icon: 'fa-shield-alt', level: 2 },
    { id: 'audiovisuel', name: 'Audiovisuel', icon: 'fa-video', level: 2 },
    { id: 'electronique', name: 'Electronique', icon: 'fa-microchip', level: 2 },
    { id: 'consoles-jeux-video', name: 'Consoles & Jeux vidéo', icon: 'fa-gamepad', level: 2 },
    { id: 'reparation-electronique-electromenager', name: 'Réparation Electronique & Electroménager', icon: 'fa-tools', level: 2 },
    { id: 'vetements-accessoires-mode', name: 'Vêtements & Accessoires de mode', icon: 'fa-tshirt', level: 2 },
    { id: 'cosmetiques-et-beaute', name: 'Cosmétiques & Beauté', icon: 'fa-spa', level: 2 },
    { id: 'esthetique-bien-etre', name: 'Esthétique & Bien être', icon: 'fa-hand-sparkles', level: 2 },
    { id: 'couture-et-confection', name: 'Couture & Confection', icon: 'fa-tshirt', level: 2 },
    { id: 'maison-meubles', name: 'Maison & Meubles', icon: 'fa-couch', level: 2 },
    { id: 'meubles-et-bureau', name: 'Meubles de bureau', icon: 'fa-chair-office', level: 2 },
    { id: 'vaisselles', name: 'Vaisselles', icon: 'fa-utensils', level: 2 },
    { id: 'jardinages', name: 'Jardinage', icon: 'fa-seedling', level: 2 },
    { id: 'puericultures-jouets', name: 'Puéricultures & Jouets', icon: 'fa-baby', level: 2 },
    { id: 'fournitures-articles-scolaires', name: 'Fournitures & Articles scolaires', icon: 'fa-pencil-alt', level: 2 },
    { id: 'librairie-papeterie', name: 'Librairie & Papeterie', icon: 'fa-book', level: 2 },
    { id: 'articles-sport', name: 'Articles de sport', icon: 'fa-futbol', level: 2 },
    { id: 'instruments-et-musique', name: 'Instruments de musique', icon: 'fa-guitar', level: 2 },
    { id: 'chasse-et-peche', name: 'Chasse & Pêche', icon: 'fa-fish', level: 2 },
    { id: 'outillages-quincaillerie', name: 'Outillages & Quincaillerie', icon: 'fa-tools', level: 2 },
    { id: 'materiaux-et-construction', name: 'Matériaux de construction', icon: 'fa-hard-hat', level: 2 },
    { id: 'materiel-et-professionnel', name: 'Matériel professionnel', icon: 'fa-briefcase', level: 2 },
    { id: 'travaux-construction-amenagement', name: "Travaux de Construction & d'Aménagement", icon: 'fa-hard-hat', level: 2 },
    { id: 'matieres-et-premieres', name: 'Matières premières', icon: 'fa-industry', level: 2 },
    { id: 'agences-voyages', name: 'Agences de voyages', icon: 'fa-plane', level: 2 },
    { id: 'hotels', name: 'Hôtels', icon: 'fa-hotel', level: 2 },
    { id: 'restaurants-salles-fetes', name: 'Restaurants & Salles des fêtes', icon: 'fa-utensils', level: 2 },
    { id: 'traiteur-gateaux', name: 'Traiteur & Gateaux', icon: 'fa-birthday-cake', level: 2 },
    { id: 'transport-et-demenagement', name: 'Transport & Déménagement', icon: 'fa-truck-moving', level: 2 },
    { id: 'service-nettoyage-entretien', name: 'Service de Nettoyage & Entretien', icon: 'fa-broom', level: 2 },
    { id: 'froid-et-climatisation', name: 'Froid & Climatisation', icon: 'fa-snowflake', level: 2 },
    { id: 'services-sante', name: 'Services de santé', icon: 'fa-heartbeat', level: 2 },
    { id: 'etudes-consulting', name: 'Etudes & Consulting', icon: 'fa-chart-line', level: 2 },
    { id: 'logiciel-web-services', name: 'Logiciel & Web services', icon: 'fa-code', level: 2 },
    { id: 'comptabilite-finance', name: 'Comptabilité & Finance', icon: 'fa-calculator', level: 2 },
    { id: 'publicite-et-communication', name: 'Publicité & Communication', icon: 'fa-bullhorn', level: 2 },
    { id: 'ecoles-et-formations', name: 'Ecoles & Formations', icon: 'fa-graduation-cap', level: 2 },
    { id: 'animaleries', name: 'Animalerie', icon: 'fa-dog', level: 2 },
    { id: 'alimentaire', name: 'Alimentaire', icon: 'fa-apple-alt', level: 2 }
  ];

  const sortedCategories = [...categories].sort((a, b) => a.name.localeCompare(b.name, 'fr'));

  const middleIndex = Math.ceil(sortedCategories.length / 2);
  const firstRowCategories = sortedCategories.slice(0, middleIndex);
  const secondRowCategories = sortedCategories.slice(middleIndex);

  return (
    <div>
      <div className="mb-4">
        <div className="d-flex align-items-center mb-2">
          <i className="fas fa-tag text-primary me-2"></i>
          <h6 className="mb-0" style={{ fontSize: '0.95rem' }}>
            Activité de votre boutique <span className="text-danger">*</span>
          </h6>
          <Badge bg="primary" className="ms-2 rounded-pill" style={{ fontSize: '0.7rem' }}>
            {sortedCategories.length}
          </Badge>
        </div>
        
        <div className="categories-dual-row-container position-relative">
          <button 
            className="slider-btn slider-btn-left" 
            onClick={() => scroll(categoriesRef, 'left')}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <div className="categories-dual-row" ref={categoriesRef}>
            <div className="categories-row">
              {firstRowCategories.map(cat => (
                <div
                  key={`row1-${cat.id}`}
                  className={`categorie-card text-center ${formData.categorie === cat.name ? 'selected' : ''}`}
                  onClick={() => handleSelectCategorie(cat.name)}
                  title={cat.name}
                >
                  <div className="categorie-icon-wrapper">
                    <i className={`fas ${cat.icon}`}></i>
                  </div>
                  <div className="categorie-name">{cat.name}</div>
                </div>
              ))}
            </div>
            
            <div className="categories-row">
              {secondRowCategories.map(cat => (
                <div
                  key={`row2-${cat.id}`}
                  className={`categorie-card text-center ${formData.categorie === cat.name ? 'selected' : ''}`}
                  onClick={() => handleSelectCategorie(cat.name)}
                  title={cat.name}
                >
                  <div className="categorie-icon-wrapper">
                    <i className={`fas ${cat.icon}`}></i>
                  </div>
                  <div className="categorie-name">{cat.name}</div>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            className="slider-btn slider-btn-right" 
            onClick={() => scroll(categoriesRef, 'right')}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h6 className="mb-2" style={{ fontSize: '0.95rem' }}>
          <i className="fas fa-calendar-alt text-primary me-2"></i>
          Durée d'abonnement <span className="text-danger">*</span>
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
                <i className="fas fa-clock mb-1" style={{ fontSize: '1.5rem', color: '#10b981' }}></i>
                <div className="fw-bold small">{d.name}</div>
                {parseInt(d.id) >= 6 && (
                  <Badge bg="success" className="mt-1" style={{ fontSize: '0.6rem' }}>
                    {parseInt(d.id) >= 12 ? '3 mois' : '1 mois'}
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

      <div className="mb-3">
        <h6 className="mb-2" style={{ fontSize: '0.95rem' }}>
          <i className="fas fa-gem text-primary me-2"></i>
          Pack d'hébergement <span className="text-danger">*</span>
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
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="mb-0" style={{ color: offre.couleur, fontSize: '0.9rem' }}>{offre.name}</h6>
                  <Badge bg={offre.couleur === '#f59e0b' ? 'warning' : 'secondary'} style={{ fontSize: '0.6rem' }}>
                    {offre.credits}
                  </Badge>
                </div>
                <div className="mb-2">
                  <div className="text-muted small" style={{ fontSize: '0.7rem' }}>Stockage</div>
                  <div className="fw-bold" style={{ fontSize: '0.9rem' }}>{offre.storage} MB</div>
                </div>
                <div className="small" style={{ fontSize: '0.7rem' }}>
                  {offre.features.slice(0, 2).map((f, i) => (
                    <div key={i} className="d-flex align-items-center mb-1">
                      <i className="fas fa-check text-success me-1" style={{ fontSize: '0.6rem' }}></i>
                      <span className="text-truncate" style={{ maxWidth: '140px' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-2 pt-1 border-top">
                  <span className="fw-bold text-primary" style={{ fontSize: '0.9rem' }}>{offre.prix_mois.toLocaleString()} DA</span>
                  <small className="text-muted d-block" style={{ fontSize: '0.6rem' }}>/mois</small>
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
        .categories-dual-row-container {
          position: relative;
          padding: 0 35px;
          margin: 10px 0 5px;
        }
        
        .categories-dual-row {
          display: flex;
          flex-direction: column;
          overflow-x: auto;
          scroll-behavior: smooth;
          padding: 5px 0;
          scrollbar-width: thin;
          scrollbar-color: #0d6efd #e9ecef;
          max-height: 170px;
          border-radius: 6px;
        }
        
        .categories-dual-row::-webkit-scrollbar {
          height: 6px;
        }
        
        .categories-dual-row::-webkit-scrollbar-track {
          background: #e9ecef;
          border-radius: 3px;
        }
        
        .categories-dual-row::-webkit-scrollbar-thumb {
          background: #0d6efd;
          border-radius: 3px;
          border: 1px solid #e9ecef;
        }
        
        .categories-row {
          display: flex;
          gap: 8px;
          padding: 5px 3px;
          min-width: max-content;
        }
        
        .categorie-card {
          min-width: 130px;
          padding: 8px 6px;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          background: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        
        .categorie-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(13, 110, 253, 0.1);
          border-color: #0d6efd;
        }
        
        .categorie-card.selected {
          border-color: #0d6efd;
          background: #f0f7ff;
        }
        
        .categorie-icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .categorie-card.selected .categorie-icon-wrapper {
          background: #0d6efd;
        }
        
        .categorie-icon-wrapper i {
          font-size: 1.2rem;
          color: #0d6efd;
        }
        
        .categorie-card.selected .categorie-icon-wrapper i {
          color: white;
        }
        
        .categorie-name {
          font-size: 0.7rem;
          font-weight: 600;
          text-align: center;
          line-height: 1.2;
          max-width: 120px;
          color: #2c3e50;
        }
        
        .categorie-card.selected .categorie-name {
          color: #0d6efd;
        }
        
        .slider-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: white;
          border: 1px solid #dee2e6;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 10;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          font-size: 0.8rem;
        }
        
        .slider-btn:hover {
          background: #f8f9fa;
          box-shadow: 0 3px 8px rgba(0,0,0,0.15);
        }
        
        .slider-btn-left {
          left: 0;
        }
        
        .slider-btn-right {
          right: 0;
        }
        
        .slider-container {
          position: relative;
          padding: 0 30px;
        }
        
        .slider-scroll {
          display: flex;
          overflow-x: auto;
          scroll-behavior: smooth;
          gap: 8px;
          padding: 5px 0;
          scrollbar-width: thin;
        }
        
        .slider-scroll::-webkit-scrollbar {
          height: 4px;
        }
        
        .slider-scroll::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 2px;
        }
        
        .duree-card {
          min-width: 90px;
          padding: 8px 5px;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
          background: white;
        }
        
        .duree-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        
        .duree-card.selected {
          border-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
        }
        
        .offre-card {
          min-width: 160px;
          padding: 8px;
          border: 1px solid #dee2e6;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
          background: white;
          position: relative;
        }
        
        .offre-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .offre-card.selected {
          border-color: #f59e0b;
          background: rgba(245, 158, 11, 0.05);
        }
        
        .offre-badge {
          position: absolute;
          top: -6px;
          right: 6px;
          background: #f59e0b;
          color: white;
          padding: 2px 6px;
          border-radius: 10px;
          font-size: 0.55rem;
          font-weight: bold;
        }
        
        @media (max-width: 768px) {
          .categories-dual-row-container {
            padding: 0 28px;
          }
          
          .categorie-card {
            min-width: 100px;
          }
          
          .categorie-name {
            font-size: 0.65rem;
            max-width: 90px;
          }
          
          .duree-card {
            min-width: 75px;
          }
          
          .offre-card {
            min-width: 140px;
          }
        }
      `}</style>
    </div>
  );
};

// ============ STEP 3: RÉSUMÉ (sin cambios) ============
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

              {/* 🎨 Afficher la couleur choisie */}
              <Row className="mb-2">
                <Col xs={5} className="text-muted">Couleur du thème</Col>
                <Col xs={7}>
                  <div className="d-flex align-items-center">
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        backgroundColor: formData.couleur_theme,
                        borderRadius: '4px',
                        marginRight: '8px',
                        border: '1px solid #ddd'
                      }}
                    />
                    {formData.couleur_theme}
                  </div>
                </Col>
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

// ============ STEP 4: PAIEMENT (sin cambios) ============
const Step4Paiement = ({ formData, methodesPaiement, handleInputChange, offres, durees, transactionId }) => {
  const offreSelectionnee = offres.find(o => o.id === formData.offre);
  const dureeSelectionnee = durees.find(d => d.id === formData.duree);

  return (
    <div className="step4-paiement">
      <h4 className="section-title mb-4">
        <i className="fas fa-credit-card me-2 text-primary"></i>
        Détail de la transaction
      </h4>

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