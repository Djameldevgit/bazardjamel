// 📂 pages/CreateBoutiqueWizard.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Alert, Spinner, Badge, ProgressBar, Form, Row, Col, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { createBoutique, updateBoutique } from '../../redux/actions/boutiqueAction';
import { checkImage } from '../../utils/imageUpload';
import CategoryAccordionMultiselect from './CategoryAccordionMultiselect';

const CreateBoutiqueWizard = ({ onSuccess, isEdit = false, boutiqueData = null }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth, alert } = useSelector(state => state);
  
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [transactionId] = useState('TRX-' + Math.floor(Math.random() * 1000000));
  
  // Estados del formulario
  const [formData, setFormData] = useState({
    // STEP 1: INFORMACIÓN DEL STORE
    nom_boutique: '',
    domaine_boutique: '',
    slogan_boutique: '',
    description_boutique: '',
    logo: null,
    logoPreview: '',
    logoUrl: '',
    date_debut: new Date().toISOString().split('T')[0],
    
    // STEP 2: CONFIGURACIÓN
    categories_produits: [],
    categorySlugs: [],
    categorie: '',
    duree: '1',
    offre: 'Store Basic 50',
    
    // STEP 3: PROPIETARIO Y CONTACTO
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
    
    // STEP 4: PAGO
    montant_initial: 0,
    mois_offerts: 0,
    montant_ttc: 0,
    methode_paiement: '',
    client_nom: auth?.user?.name || '',
    client_telephone: auth?.user?.mobile || '',
    accepte_conditions: false
  });

  // 🟢 CATEGORÍAS EXACTAS DEL SEED - BOUTIQUES
  const categoriesBoutique = [
    { id: 'boutique-vehicules', name: 'Boutique de Véhicules', emoji: '🚗', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
    { id: 'boutique-vetements', name: 'Boutique de Vêtements', emoji: '👕', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.1)' },
    { id: 'boutique-electromenager', name: "Boutique d'Électroménager", emoji: '🔌', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
    { id: 'boutique-immobilier', name: "Boutique d'Immobilier", emoji: '🏠', color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' },
    { id: 'boutique-alimentaire', name: 'Boutique Alimentaire', emoji: '🍎', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
    { id: 'boutique-emploi', name: "Boutique d'Emploi", emoji: '💼', color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
    { id: 'boutique-informatique', name: "Boutique d'Informatique", emoji: '💻', color: '#06b6d4', bg: 'rgba(6, 182, 212, 0.1)' },
    { id: 'boutique-loisirs', name: 'Boutique de Loisirs', emoji: '🎪', color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)' },
    { id: 'boutique-materiaux', name: 'Boutique de Matériaux', emoji: '🧱', color: '#78716c', bg: 'rgba(120, 113, 108, 0.1)' },
    { id: 'boutique-meubles', name: 'Boutique de Meubles', emoji: '🛋️', color: '#b45309', bg: 'rgba(180, 83, 9, 0.1)' },
    { id: 'boutique-pieces-detachees', name: 'Boutique de Pièces Détachées', emoji: '🔩', color: '#6b7280', bg: 'rgba(107, 114, 128, 0.1)' },
    { id: 'boutique-sante-beaute', name: 'Boutique de Santé & Beauté', emoji: '💄', color: '#db2777', bg: 'rgba(219, 39, 119, 0.1)' },
    { id: 'boutique-services', name: 'Boutique de Services', emoji: '🛠️', color: '#7c3aed', bg: 'rgba(124, 58, 237, 0.1)' },
    { id: 'boutique-sport', name: 'Boutique de Sport', emoji: '⚽', color: '#16a34a', bg: 'rgba(22, 163, 74, 0.1)' },
    { id: 'boutique-voyages', name: 'Boutique de Voyages', emoji: '✈️', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.1)' },
    { id: 'boutique-telephone', name: 'Boutique de Téléphone', emoji: '📱', color: '#2563eb', bg: 'rgba(37, 99, 235, 0.1)' }
  ];

  // Durées pour le slider
  const durees = [
    { id: '1', name: '1 Mois', emoji: '📅', color: '#10b981' },
    { id: '2', name: '2 Mois', emoji: '📆', color: '#10b981' },
    { id: '3', name: '3 Mois', emoji: '🗓️', color: '#10b981' },
    { id: '4', name: '4 Mois', emoji: '📅', color: '#10b981' },
    { id: '5', name: '5 Mois', emoji: '📆', color: '#10b981' },
    { id: '6', name: '6 Mois', emoji: '🎁', color: '#f59e0b' },
    { id: '7', name: '7 Mois', emoji: '📅', color: '#f59e0b' },
    { id: '8', name: '8 Mois', emoji: '📆', color: '#f59e0b' },
    { id: '9', name: '9 Mois', emoji: '🗓️', color: '#f59e0b' },
    { id: '10', name: '10 Mois', emoji: '📅', color: '#f59e0b' },
    { id: '11', name: '11 Mois', emoji: '📆', color: '#f59e0b' },
    { id: '12', name: '12 Mois', emoji: '🎁', color: '#8b5cf6' }
  ];
  
  // Offres pour le slider
  const offres = [
    {
      id: 'Store Basic 50',
      name: 'Store Basic 50',
      credits: 50,
      storage: 100,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une'],
      couleur: '#3b82f6',
      prix_mois: 5000,
      emoji: '🟢',
      badge: 'Démarrage'
    },
    {
      id: 'Store Basic 100',
      name: 'Store Basic 100',
      credits: 100,
      storage: 200,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une'],
      couleur: '#3b82f6',
      prix_mois: 8500,
      emoji: '🔵',
      badge: 'Populaire'
    },
    {
      id: 'Store Basic 150',
      name: 'Store Basic 150',
      credits: 150,
      storage: 300,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une'],
      couleur: '#3b82f6',
      prix_mois: 12000,
      emoji: '💙',
      badge: 'Pro'
    },
    {
      id: 'Store Silver 200',
      name: 'Store Silver 200',
      credits: 200,
      storage: 400,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une', 'Support prioritaire'],
      couleur: '#6b7280',
      prix_mois: 15000,
      emoji: '⚪',
      badge: 'Silver'
    },
    {
      id: 'Store Silver 300',
      name: 'Store Silver 300',
      credits: 300,
      storage: 600,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une', 'Support prioritaire'],
      couleur: '#6b7280',
      prix_mois: 21000,
      emoji: '🤍',
      badge: 'Silver+'
    },
    {
      id: 'Store Silver 500',
      name: 'Store Silver 500',
      credits: 500,
      storage: 1000,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une', 'Support prioritaire', 'Analytics'],
      couleur: '#6b7280',
      prix_mois: 35000,
      emoji: '⬜',
      badge: 'Silver Pro'
    },
    {
      id: 'Store Gold 1000',
      name: 'Store Gold 1000',
      credits: 1000,
      storage: 2000,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une', 'Support VIP', 'Analytics', 'API'],
      couleur: '#f59e0b',
      prix_mois: 70000,
      emoji: '🟡',
      badge: 'Gold'
    },
    {
      id: 'Store Gold 2000',
      name: 'Store Gold 2000',
      credits: 2000,
      storage: 4000,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une', 'Support VIP', 'Analytics', 'API', 'Multi-vendeurs'],
      couleur: '#f59e0b',
      prix_mois: 130000,
      emoji: '🌟',
      badge: 'Gold+'
    },
    {
      id: 'Store Gold 3000',
      name: 'Store Gold 3000',
      credits: 3000,
      storage: 4000,
      features: ['Site Builder', 'Nom de domaine', 'Store à la une', 'Support VIP', 'Analytics', 'API', 'Multi-vendeurs'],
      couleur: '#f59e0b',
      prix_mois: 190000,
      emoji: '💫',
      badge: 'Gold Pro'
    },
    {
      id: 'Store Gold 6000',
      name: 'Store Gold 6000',
      credits: 6000,
      storage: 12000,
      features: ['Site Builder', 'Nom de domaine', 'Support VIP', 'Analytics', 'API', 'Multi-vendeurs', 'Marketplace'],
      couleur: '#f59e0b',
      prix_mois: 350000,
      emoji: '👑',
      badge: 'Platinum'
    }
  ];
  
  // Méthodes de paiement
  const methodesPaiement = [
    { value: 'ccp', label: 'CCP - Compte de Chèque Postal', emoji: '📮', icon: 'fa-solid fa-envelope' },
    { value: 'cib', label: 'CIB - Banque', emoji: '🏦', icon: 'fa-solid fa-building-columns' },
    { value: 'carte', label: 'Carte de crédit', emoji: '💳', icon: 'fa-solid fa-credit-card' },
    { value: 'edahabia', label: 'Edahabia', emoji: '💵', icon: 'fa-solid fa-money-bill' },
    { value: 'cash', label: 'Espèces', emoji: '💰', icon: 'fa-solid fa-sack-dollar' },
    { value: 'virement', label: 'Virement bancaire', emoji: '🔄', icon: 'fa-solid fa-arrow-right-arrow-left' }
  ];

  // ============ FUNCIONES AUXILIARES ============

  const generateDomain = (nom) => {
    if (!nom) return '';
    return nom
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const mapOffreToPlan = (offreId) => {
    const offreMapping = {
      'Store Basic 50': 'gratuit',
      'Store Basic 100': 'gratuit',
      'Store Basic 150': 'gratuit',
      'Store Silver 200': 'basique',
      'Store Silver 300': 'basique',
      'Store Silver 500': 'basique',
      'Store Gold 1000': 'premium',
      'Store Gold 2000': 'premium',
      'Store Gold 3000': 'entreprise',
      'Store Gold 6000': 'entreprise'
    };
    return offreMapping[offreId] || 'gratuit';
  };

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

  const calculerMontants = () => {
    const offreSelectionnee = offres.find(o => o.id === formData.offre);
    const dureeMois = parseInt(formData.duree);
    
    if (!offreSelectionnee) return;
    
    let montantInitial = offreSelectionnee.prix_mois * dureeMois;
    let moisOfferts = 0;
    
    if (dureeMois >= 6) moisOfferts = 1;
    if (dureeMois >= 12) moisOfferts = 3;
    
    const moisPayer = Math.max(1, dureeMois - moisOfferts);
    montantInitial = offreSelectionnee.prix_mois * moisPayer;
    const taxe = montantInitial * 0.19;
    const montantTTC = montantInitial + taxe;
    
    setFormData(prev => ({
      ...prev,
      montant_initial: montantInitial,
      mois_offerts: moisOfferts,
      montant_ttc: montantTTC
    }));
  };

  // ============ HANDLERS ============

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

  const handleProductCategoriesChange = (categories) => {
    const allSlugs = [];
    categories.forEach(cat => {
      allSlugs.push(cat.level1);
      if (cat.level2) allSlugs.push(cat.level2);
      if (cat.level3) allSlugs.push(cat.level3);
    });
    
    const uniqueSlugs = [...new Set(allSlugs)];
    
    setFormData(prev => ({
      ...prev,
      categories_produits: categories,
      categorySlugs: uniqueSlugs
    }));
  };

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

  const handleRemoveLogo = () => {
    setFormData(prev => ({
      ...prev,
      logo: null,
      logoPreview: '',
      logoUrl: ''
    }));
  };

  const handleSelectCategorieBoutique = (categorie) => {
    setFormData(prev => ({ 
      ...prev, 
      categorie 
    }));
  };

  const handleSelectDuree = (dureeId) => {
    setFormData(prev => ({ 
      ...prev, 
      duree: dureeId,
      duree_abonnement: mapDureeToAbonnement(dureeId)
    }));
  };

  const handleSelectOffre = (offreId) => {
    setFormData(prev => ({ 
      ...prev, 
      offre: offreId,
      plan: mapOffreToPlan(offreId)
    }));
  };

  // ============ VALIDACIÓN ============

  const validateStep = (step) => {
    switch (step) {
      case 1:
        return formData.nom_boutique.trim() !== '' && 
               formData.description_boutique.trim() !== '' &&
               formData.date_debut !== '';
      
      case 2:
        return formData.categories_produits.length > 0 && 
               formData.categorie !== '' &&
               formData.duree !== '' &&
               formData.offre !== '';
      
      case 3:
        return true;
      
      case 4:
        return formData.methode_paiement !== '' && 
               formData.accepte_conditions === true;
      
      default:
        return false;
    }
  };

  // ============ NAVEGACIÓN ============

  const nextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 2) {
        calculerMontants();
      }
      setCurrentStep(prev => Math.min(prev + 1, 4));
      setError('');
    } else {
      let errorMessage = 'Veuillez remplir tous les champs obligatoires';
      
      if (currentStep === 1) {
        if (!formData.nom_boutique.trim()) errorMessage = 'Nom du store requis';
        else if (!formData.description_boutique.trim()) errorMessage = 'Description requise';
        else if (!formData.date_debut) errorMessage = 'Date de début requise';
      } else if (currentStep === 2) {
        if (formData.categories_produits.length === 0) errorMessage = 'Sélectionnez au moins une catégorie de produits';
        else if (!formData.categorie) errorMessage = 'Sélectionnez le type de votre boutique';
        else if (!formData.duree) errorMessage = 'Sélectionnez une durée';
        else if (!formData.offre) errorMessage = 'Sélectionnez une offre';
      } else if (currentStep === 4) {
        if (!formData.methode_paiement) errorMessage = 'Sélectionnez une méthode de paiement';
        else errorMessage = 'Vous devez accepter les conditions';
      }
      
      setError(errorMessage);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  // ============ PREPARAR DATOS PARA ENVÍO ============

  const prepareSubmitData = () => {
    const domaine_boutique = formData.domaine_boutique || generateDomain(formData.nom_boutique);
    
    const cleanEmoji = (emoji) => {
      if (!emoji) return '📦';
      return String(emoji).replace(/[�]/g, '📦');
    };
    
    const categories_produits = formData.categories_produits.map(cat => ({
      level1: cat.level1 || '',
      level1Name: cat.level1Name || '',
      level1Emoji: cleanEmoji(cat.level1Emoji),
      level2: cat.level2 || null,
      level2Name: cat.level2Name || null,
      level2Emoji: cat.level2Emoji ? cleanEmoji(cat.level2Emoji) : null,
      level3: cat.level3 || null,
      level3Name: cat.level3Name || null,
      level3Emoji: cat.level3Emoji ? cleanEmoji(cat.level3Emoji) : null,
      fullPath: cat.fullPath || '',
      displayPath: cat.displayPath || '',
      level: cat.level || 1
    }));
    
    const allSlugs = [];
    formData.categories_produits.forEach(cat => {
      allSlugs.push(cat.level1);
      if (cat.level2) allSlugs.push(cat.level2);
      if (cat.level3) allSlugs.push(cat.level3);
    });
    
    const submitData = {
      nom_boutique: formData.nom_boutique,
      domaine_boutique: domaine_boutique,
      slogan_boutique: formData.slogan_boutique || '',
      description_boutique: formData.description_boutique,
      date_debut: formData.date_debut,
      categories_produits: categories_produits,
      categorySlugs: [...new Set(allSlugs)],
      categories_produits_slugs: categories_produits.map(cat => cat.fullPath),
      categorie_boutique: formData.categorie,
      duree: formData.duree,
      offre: formData.offre,
      plan: formData.plan,
      duree_abonnement: formData.duree_abonnement,
      proprietaire: {
        nom: formData.proprietaire.nom || auth?.user?.name || '',
        email: formData.proprietaire.email || auth?.user?.email || '',
        telephone: formData.proprietaire.telephone || auth?.user?.mobile || '',
        wilaya: formData.proprietaire.wilaya || '',
        adresse: formData.proprietaire.adresse || ''
      },
      reseaux_sociaux: formData.reseaux_sociaux || {},
      couleur_theme: formData.couleur_theme || '#2563eb',
      montant_initial: formData.montant_initial || 0,
      mois_offerts: formData.mois_offerts || 0,
      montant_ttc: formData.montant_ttc || 0,
      methode_paiement: formData.methode_paiement || '',
      client_nom: formData.client_nom || auth?.user?.name || '',
      client_telephone: formData.client_telephone || auth?.user?.mobile || '',
      accepte_conditions: true,
      statut: 'en_attente',
      user: auth?.user?._id
    };
    
    return submitData;
  };

  // ============ SUBMIT ============

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    
    try {
      setLoading(true);
      setError('');
      
      const boutiqueData = prepareSubmitData();
      const avatar = formData.logo;
      
      if (isEdit && boutiqueData._id) {
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
          setSuccess('✅ Votre demande de création a été soumise avec succès! Elle sera évaluée par nos administrateurs.');
          
          setTimeout(() => {
            if (onSuccess) {
              onSuccess(result.boutique || result);
            } else {
              history.push('/boutiques/mes-boutiques');
            }
          }, 3000);
        }
      }
      
    } catch (err) {
      console.error('❌ Erreur:', err);
      setError(err.message || 'Erreur lors de la création de la boutique');
    } finally {
      setLoading(false);
    }
  };

  // ============ EFECTOS ============

  useEffect(() => {
    if (isEdit && boutiqueData) {
      setFormData({
        nom_boutique: boutiqueData.nom_boutique || '',
        description_boutique: boutiqueData.description_boutique || '',
        domaine_boutique: boutiqueData.domaine_boutique || '',
        slogan_boutique: boutiqueData.slogan_boutique || '',
        date_debut: boutiqueData.date_debut || new Date().toISOString().split('T')[0],
        categories_produits: boutiqueData.categories_produits || [],
        categorySlugs: boutiqueData.categorySlugs || [],
        categorie: boutiqueData.categorie_boutique || boutiqueData.categorie || '',
        duree: boutiqueData.duree || '1',
        offre: boutiqueData.offre || 'Store Basic 50',
        logo: null,
        logoPreview: boutiqueData.logo?.url || '',
        logoUrl: boutiqueData.logo?.url || '',
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
    }
  }, [isEdit, boutiqueData, auth]);

  useEffect(() => {
    if (formData.nom_boutique && !formData.domaine_boutique && !isEdit) {
      const domaine = generateDomain(formData.nom_boutique);
      setFormData(prev => ({
        ...prev,
        domaine_boutique: domaine
      }));
    }
  }, [formData.nom_boutique, isEdit]);

  useEffect(() => {
    if (alert.error) setError(alert.error);
    if (alert.success) setSuccess(alert.success);
  }, [alert]);

  // ============ RENDER ============

  return (
    <Container fluid className="px-0">
      <div className="create-boutique-wizard">
        {/* Header con gradiente */}
        <div className="wizard-header mb-5 text-center position-relative py-4 px-3 rounded-4 bg-gradient-primary">
          <div className="position-relative z-index-1">
            <div className="d-inline-flex align-items-center justify-content-center bg-white rounded-circle p-3 mb-3 shadow-lg" style={{ width: '80px', height: '80px' }}>
              <i className={`fas ${isEdit ? 'fa-store-alt' : 'fa-store'} text-primary`} style={{ fontSize: '2.5rem' }}></i>
            </div>
            <h1 className="display-6 fw-bold text-white mb-2 text-shadow">
              {isEdit ? '✏️ Modifier votre store' : '🏪 Créer votre store professionnel'}
            </h1>
            <p className="text-white-75 mb-0 fs-5 opacity-90">
              {isEdit 
                ? 'Mettez à jour les informations de votre store en toute simplicité'
                : 'Rejoignez notre marketplace et commencez à vendre vos produits dès aujourd\'hui'
              }
            </p>
          </div>
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-gradient-overlay rounded-4"></div>
        </div>
        
        {/* Progress bar amélioré */}
        <div className="progress-container mb-5 px-3">
          <div className="d-flex justify-content-between position-relative mb-3">
            {[1, 2, 3, 4].map(step => (
              <div 
                key={step} 
                className={`step-indicator text-center position-relative ${currentStep >= step ? 'active' : ''} ${currentStep === step ? 'current' : ''}`}
                onClick={() => currentStep > step && setCurrentStep(step)}
                style={{ cursor: currentStep > step ? 'pointer' : 'default', zIndex: 2 }}
              >
                <div className={`step-number d-flex align-items-center justify-content-center mx-auto mb-2 fw-bold transition-all
                  ${currentStep >= step ? 'bg-primary text-white border-primary' : 'bg-light text-secondary border-secondary'}`}>
                  {currentStep > step ? <i className="fas fa-check"></i> : step}
                </div>
                <div className={`step-label fw-medium small ${currentStep >= step ? 'text-primary' : 'text-secondary'}`}>
                  {step === 1 && 'Informations'}
                  {step === 2 && 'Configuration'}
                  {step === 3 && 'Propriétaire'}
                  {step === 4 && 'Paiement'}
                </div>
              </div>
            ))}
            
            {/* Ligne de progression */}
            <div className="progress-line position-absolute top-0 start-0 w-100" style={{ top: '20px', zIndex: 1 }}>
              <div className="progress" style={{ height: '4px', background: '#e9ecef' }}>
                <div 
                  className="progress-bar bg-primary" 
                  style={{ width: `${((currentStep - 1) / 3) * 100}%`, transition: 'width 0.3s ease' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Contenu principal avec animation */}
        <div className="step-content mb-4">
          <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
            <Card.Body className="p-5">
              <div className="step-transition">
                {currentStep === 1 && (
                  <Step1Informations 
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleLogoChange={handleLogoChange}
                    handleRemoveLogo={handleRemoveLogo}
                  />
                )}
                
                {currentStep === 2 && (
                  <Step2Configuration
                    formData={formData}
                    categoriesBoutique={categoriesBoutique}
                    durees={durees}
                    offres={offres}
                    handleSelectCategorieBoutique={handleSelectCategorieBoutique}
                    handleSelectDuree={handleSelectDuree}
                    handleSelectOffre={handleSelectOffre}
                    handleProductCategoriesChange={handleProductCategoriesChange}
                  />
                )}
                
                {currentStep === 3 && (
                  <Step3Proprietaire
                    formData={formData}
                    handleInputChange={handleInputChange}
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
              </div>
            </Card.Body>
          </Card>
        </div>
        
        {/* Messages d'alerte */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError('')} className="mb-4 mx-3 shadow-sm rounded-3 border-0">
            <div className="d-flex align-items-center">
              <div className="bg-danger bg-opacity-10 rounded-circle p-2 me-3">
                <i className="fas fa-exclamation-circle text-danger fs-5"></i>
              </div>
              <div className="fw-medium">{error}</div>
            </div>
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" dismissible onClose={() => setSuccess('')} className="mb-4 mx-3 shadow-sm rounded-3 border-0">
            <div className="d-flex align-items-center">
              <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                <i className="fas fa-check-circle text-success fs-5"></i>
              </div>
              <div className="fw-medium">{success}</div>
            </div>
          </Alert>
        )}
        
        {/* Navigation buttons améliorés */}
        <div className="wizard-navigation d-flex justify-content-between align-items-center px-3 mt-4">
          <div>
            {currentStep > 1 && (
              <Button 
                variant="outline-secondary" 
                onClick={prevStep} 
                disabled={loading}
                size="lg"
                className="px-5 py-3 rounded-pill fw-medium shadow-sm hover-scale"
              >
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
                size="lg"
                className="px-5 py-3 rounded-pill fw-medium shadow-sm hover-scale"
              >
                Suivant
                <i className="fas fa-arrow-right ms-2"></i>
              </Button>
            ) : (
              <Button 
                variant={isEdit ? 'warning' : 'success'} 
                onClick={handleSubmit} 
                disabled={loading || !validateStep(currentStep)}
                size="lg"
                className={`px-5 py-3 rounded-pill fw-medium shadow-sm hover-scale ${isEdit ? 'bg-gradient-warning' : 'bg-gradient-success'}`}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    {isEdit ? 'Mise à jour...' : 'Soumission...'}
                  </>
                ) : (
                  <>
                    <i className={`fas me-2 ${isEdit ? 'fa-save' : 'fa-paper-plane'}`}></i>
                    {isEdit ? 'Mettre à jour' : 'Soumettre ma demande'}
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
        
        {/* Footer amélioré */}
        <div className="mt-5 pt-4 px-3 border-top">
          <div className="row g-4">
            <div className="col-md-6">
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                  <i className="fas fa-user-circle text-primary fs-4"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1 fw-medium">Propriétaire</h6>
                  <p className="mb-1 fw-bold">{auth?.user?.name || 'Non connecté'}</p>
                  <p className="mb-0 text-muted small">{auth?.user?.email}</p>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="d-flex align-items-center justify-content-md-end">
                <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
                  <i className="fas fa-headset text-info fs-4"></i>
                </div>
                <div>
                  <h6 className="text-muted mb-1 fw-medium">Support client</h6>
                  <p className="mb-1">
                    <i className="fas fa-envelope me-2 text-muted"></i>
                    <span className="fw-medium">support@marketplace.dz</span>
                  </p>
                  <p className="mb-0">
                    <i className="fas fa-phone me-2 text-muted"></i>
                    <span className="fw-medium">+213 (0) 123 456 789</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ STYLES AMÉLIORÉS ============ */}
      <style jsx="true">{`
        .create-boutique-wizard {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .bg-gradient-success {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        }
        
        .bg-gradient-warning {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
        }
        
        .bg-gradient-overlay {
          background: linear-gradient(135deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%);
        }
        
        .text-white-75 {
          color: rgba(255, 255, 255, 0.85);
        }
        
        .text-shadow {
          text-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .opacity-90 {
          opacity: 0.9;
        }
        
        .z-index-1 {
          z-index: 1;
        }
        
        .step-indicator {
          flex: 1;
          max-width: 120px;
        }
        
        .step-number {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 3px solid;
          font-size: 1.2rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .step-indicator.active .step-number {
          transform: scale(1.1);
          box-shadow: 0 0 0 6px rgba(102, 126, 234, 0.15);
        }
        
        .step-indicator.current .step-number {
          transform: scale(1.15);
          box-shadow: 0 0 0 8px rgba(102, 126, 234, 0.2);
        }
        
        .step-label {
          font-size: 0.85rem;
          transition: color 0.3s ease;
        }
        
        .progress-line {
          top: 24px !important;
        }
        
        .step-transition {
          animation: fadeSlideIn 0.4s ease forwards;
        }
        
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .hover-scale {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-scale:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15) !important;
        }
        
        .hover-scale:active {
          transform: translateY(0);
        }
        
        /* Styles pour les cards de slider */
        .categorie-card {
          min-width: 200px;
          padding: 20px 16px;
          border: 2px solid #e9ecef;
          border-radius: 16px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
          background: white;
          position: relative;
          overflow: hidden;
        }
        
        .categorie-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .categorie-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.1);
          border-color: transparent;
        }
        
        .categorie-card:hover::before {
          opacity: 1;
        }
        
        .categorie-card.selected {
          border-color: #667eea;
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
          border-width: 2px;
        }
        
        .categorie-card.selected::before {
          opacity: 1;
        }
        
        .duree-card {
          min-width: 140px;
          padding: 16px;
          border: 2px solid #e9ecef;
          border-radius: 16px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
          background: white;
        }
        
        .duree-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(16, 185, 129, 0.15);
          border-color: #10b981;
        }
        
        .duree-card.selected {
          border-color: #10b981;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%);
        }
        
        .offre-card {
          min-width: 280px;
          padding: 24px;
          border: 2px solid #e9ecef;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
          background: white;
          position: relative;
          overflow: hidden;
        }
        
        .offre-card::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, transparent 50%, rgba(102, 126, 234, 0.1) 50%);
          border-radius: 0 0 0 80px;
        }
        
        .offre-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 30px rgba(0,0,0,0.12);
          border-color: transparent;
        }
        
        .offre-card.selected {
          border-width: 2px;
          box-shadow: 0 12px 24px rgba(102, 126, 234, 0.2);
        }
        
        .badge-offre {
          position: absolute;
          top: 16px;
          right: 16px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: white;
          box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
        }
        
        .info_avatar {
          position: relative;
          width: 160px;
          height: 160px;
          margin: 0 auto;
          border-radius: 20px;
          overflow: hidden;
          border: 3px dashed #dee2e6;
          cursor: pointer;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        }
        
        .info_avatar:hover {
          border-color: #667eea;
          transform: scale(1.02);
          box-shadow: 0 12px 24px rgba(102, 126, 234, 0.2);
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
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.95), rgba(118, 75, 162, 0.95));
          color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          backdrop-filter: blur(4px);
        }
        
        .info_avatar:hover span {
          bottom: 0;
        }
        
        .slider-container {
          position: relative;
          padding: 0 50px;
        }
        
        .slider-scroll {
          display: flex;
          overflow-x: auto;
          scroll-behavior: smooth;
          gap: 16px;
          padding: 12px 0;
          scrollbar-width: thin;
          scrollbar-color: #667eea #e9ecef;
        }
        
        .slider-scroll::-webkit-scrollbar {
          height: 8px;
        }
        
        .slider-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .slider-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 10px;
        }
        
        .slider-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: white;
          border: 2px solid #e9ecef;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
          color: #667eea;
        }
        
        .slider-btn:hover {
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-color: transparent;
          color: white;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
        }
        
        .slider-btn-left {
          left: -15px;
        }
        
        .slider-btn-right {
          right: -15px;
        }
        
        @media (max-width: 768px) {
          .create-boutique-wizard {
            padding: 10px;
          }
          
          .step-number {
            width: 40px;
            height: 40px;
            font-size: 1rem;
          }
          
          .step-label {
            font-size: 0.7rem;
          }
          
          .categorie-card {
            min-width: 160px;
          }
          
          .duree-card {
            min-width: 120px;
          }
          
          .offre-card {
            min-width: 260px;
          }
          
          .slider-container {
            padding: 0 35px;
          }
          
          .slider-btn {
            width: 36px;
            height: 36px;
          }
        }
      `}</style>
    </Container>
  );
};

// ============ STEP 1: INFORMATIONS DU STORE ============
const Step1Informations = ({ formData, handleInputChange, handleLogoChange, handleRemoveLogo }) => {
  const hasLogo = formData.logo || formData.logoPreview || formData.logoUrl;
  const logoPreview = formData.logoPreview || formData.logoUrl || '/img/default-store-logo.png';
  
  return (
    <div className="step1-informations">
      <div className="d-flex align-items-center mb-5">
        <div className="bg-gradient-primary rounded-3 p-3 me-3 shadow-sm">
          <i className="fas fa-store text-white" style={{ fontSize: '2rem' }}></i>
        </div>
        <div>
          <h3 className="mb-1 fw-bold">Informations du store</h3>
          <p className="text-muted mb-0 fs-6">
            Remplissez les informations de base de votre boutique
          </p>
        </div>
      </div>
      
      <Row className="g-4">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-dark">
              <i className="fas fa-calendar-alt me-2 text-primary"></i>
              Date de début <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="date"
              name="date_debut"
              value={formData.date_debut}
              onChange={handleInputChange}
              required
              className="py-3 border-2 bg-light rounded-3"
            />
            <Form.Text className="text-muted">
              Date à laquelle votre store commencera son activité
            </Form.Text>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-dark">
              <i className="fas fa-store-alt me-2 text-primary"></i>
              Nom du store <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="nom_boutique"
              value={formData.nom_boutique}
              onChange={handleInputChange}
              placeholder="Ex: Fashion Store Algérie"
              required
              className="py-3 border-2 bg-light rounded-3"
            />
            <Form.Text className="text-muted">
              Le nom commercial de votre boutique
            </Form.Text>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-dark">
              <i className="fas fa-globe me-2 text-primary"></i>
              Domaine <span className="text-danger">*</span>
            </Form.Label>
            <div className="input-group">
              <Form.Control
                type="text"
                name="domaine_boutique"
                value={formData.domaine_boutique}
                onChange={handleInputChange}
                placeholder="monstore"
                required
                className="py-3 border-2 bg-light rounded-start-3"
              />
              <span className="input-group-text bg-primary text-white border-2 border-primary px-4 fw-medium">
                .marketplace.dz
              </span>
            </div>
            <Form.Text className="text-muted">
              Votre store sera accessible à: <strong className="text-primary">{formData.domaine_boutique || 'monstore'}.marketplace.dz</strong>
            </Form.Text>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-dark">
              <i className="fas fa-quote-right me-2 text-primary"></i>
              Slogan
            </Form.Label>
            <Form.Control
              type="text"
              name="slogan_boutique"
              value={formData.slogan_boutique}
              onChange={handleInputChange}
              placeholder="Ex: La mode à prix discount"
              className="py-3 border-2 bg-light rounded-3"
            />
          </Form.Group>
        </Col>
        
        <Col xs={12}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-dark">
              <i className="fas fa-align-left me-2 text-primary"></i>
              Description détaillée <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              name="description_boutique"
              value={formData.description_boutique}
              onChange={handleInputChange}
              placeholder="Décrivez votre store, vos produits, vos services, votre histoire..."
              required
              className="py-3 border-2 bg-light rounded-3"
            />
            <Form.Text className="text-muted">
              Cette description sera visible sur la page principale de votre store
            </Form.Text>
          </Form.Group>
        </Col>
        
        <Col xs={12}>
          <div className="d-flex flex-column align-items-center py-4">
            <h6 className="fw-semibold mb-4 text-dark">
              <i className="fas fa-image me-2 text-primary"></i>
              Logo du store
            </h6>
            
            <div className="info_avatar mb-3 shadow-sm">
              <img 
                src={logoPreview} 
                alt="Logo preview" 
              />
              <span>
                <i className="fas fa-camera fs-4 mb-2" />
                <p className="mb-0 fw-medium">Changer logo</p>
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
                size="lg"
                onClick={handleRemoveLogo}
                className="mt-3 px-5 py-2 rounded-pill fw-medium hover-scale"
              >
                <i className="fas fa-trash me-2"></i>
                Supprimer le logo
              </Button>
            ) : (
              <div className="text-center mt-3">
                <p className="text-muted mb-1">
                  <i className="fas fa-info-circle me-1"></i>
                  Format recommandé: 500x500px, JPG ou PNG
                </p>
                <Badge bg="light" text="dark" className="px-3 py-2 mt-2 rounded-pill">
                  <i className="fas fa-upload me-1"></i>
                  Max 2 Mo
                </Badge>
              </div>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

// ============ STEP 2: CONFIGURATION ============
const Step2Configuration = ({ 
  formData, 
  categoriesBoutique, 
  durees, 
  offres, 
  handleSelectCategorieBoutique, 
  handleSelectDuree, 
  handleSelectOffre,
  handleProductCategoriesChange 
}) => {
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
    <div className="step2-configuration">
      <div className="d-flex align-items-center mb-5">
        <div className="bg-gradient-success rounded-3 p-3 me-3 shadow-sm">
          <i className="fas fa-cogs text-white" style={{ fontSize: '2rem' }}></i>
        </div>
        <div>
          <h3 className="mb-1 fw-bold">Configuration du store</h3>
          <p className="text-muted mb-0 fs-6">
            Configurez les produits et l'offre de votre boutique
          </p>
        </div>
      </div>
      
      {/* SECTION 1: CATÉGORIES DE PRODUITS */}
      <div className="mb-5">
        <h5 className="fw-bold mb-4 d-flex align-items-center">
          <span className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" 
                style={{ width: '36px', height: '36px', fontSize: '18px' }}>
            1
          </span>
          <i className="fas fa-tags text-primary me-2 fs-4"></i>
          <span>Catégories de produits que vous vendez</span>
          <span className="text-danger ms-2 fs-6">*</span>
        </h5>
        
        <div className="ps-5">
          <CategoryAccordionMultiselect
            selectedCategories={formData.categories_produits || []}
            onCategoriesChange={handleProductCategoriesChange}
            maxSelections={30}
            showSearch={true}
          />
          
          {formData.categories_produits?.length > 0 && (
            <div className="mt-4">
              <Badge bg="success" className="p-3 rounded-pill fs-6 shadow-sm">
                <i className="fas fa-check-circle me-2"></i>
                {formData.categories_produits.length} catégorie(s) sélectionnée(s)
              </Badge>
            </div>
          )}
        </div>
      </div>

      <hr className="my-5 opacity-25" />

      {/* SECTION 2: TYPE DE BOUTIQUE */}
      <div className="mb-5">
        <h5 className="fw-bold mb-4 d-flex align-items-center">
          <span className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" 
                style={{ width: '36px', height: '36px', fontSize: '18px' }}>
            2
          </span>
          <i className="fas fa-store text-primary me-2 fs-4"></i>
          <span>Type de boutique</span>
          <span className="text-danger ms-2 fs-6">*</span>
        </h5>
        
        <p className="text-muted mb-4 ps-5">
          Choisissez la catégorie principale qui correspond à votre activité
        </p>
        
        <div className="slider-container ps-5">
          <button className="slider-btn slider-btn-left shadow-sm" onClick={() => scrollSlider('categories', 'left')}>
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <div className="slider-scroll" ref={sliderRefs.categories}>
            {categoriesBoutique.map((categorie) => (
              <div
                key={categorie.id}
                className={`categorie-card ${formData.categorie === categorie.name ? 'selected' : ''}`}
                onClick={() => handleSelectCategorieBoutique(categorie.name)}
                style={{ borderColor: formData.categorie === categorie.name ? categorie.color : '#e9ecef' }}
              >
                <div className="fs-1 mb-3">{categorie.emoji}</div>
                <div className="fw-bold mb-1">{categorie.name}</div>
                <small className="text-muted">{categorie.id.split('-').pop()}</small>
              </div>
            ))}
          </div>
          
          <button className="slider-btn slider-btn-right shadow-sm" onClick={() => scrollSlider('categories', 'right')}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        
        {formData.categorie && (
          <div className="mt-4 text-center ps-5">
            <Badge 
              bg="primary" 
              className="p-3 rounded-pill fs-6 shadow-sm"
              style={{ 
                background: categoriesBoutique.find(c => c.name === formData.categorie)?.color || '#0d6efd',
                border: 'none'
              }}
            >
              <i className="fas fa-check me-2"></i>
              {formData.categorie}
            </Badge>
          </div>
        )}
      </div>

      {/* SECTION 3: DURÉE */}
      <div className="mb-5">
        <h5 className="fw-bold mb-4 d-flex align-items-center">
          <span className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" 
                style={{ width: '36px', height: '36px', fontSize: '18px' }}>
            3
          </span>
          <i className="fas fa-calendar-alt text-success me-2 fs-4"></i>
          <span>Durée d'abonnement</span>
          <span className="text-danger ms-2 fs-6">*</span>
        </h5>
        
        <div className="slider-container ps-5">
          <button className="slider-btn slider-btn-left shadow-sm" onClick={() => scrollSlider('durees', 'left')}>
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <div className="slider-scroll" ref={sliderRefs.durees}>
            {durees.map((duree) => (
              <div
                key={duree.id}
                className={`duree-card ${formData.duree === duree.id ? 'selected' : ''}`}
                onClick={() => handleSelectDuree(duree.id)}
                style={{ borderColor: formData.duree === duree.id ? duree.color : '#e9ecef' }}
              >
                <div className="fs-1 mb-2">{duree.emoji}</div>
                <div className="fw-bold fs-5 mb-1">{duree.name}</div>
                {parseInt(duree.id) >= 6 && (
                  <Badge bg="warning" text="dark" className="mt-2 px-3 py-1 rounded-pill">
                    🎁 {parseInt(duree.id) >= 12 ? '3 mois offerts' : '1 mois offert'}
                  </Badge>
                )}
              </div>
            ))}
          </div>
          
          <button className="slider-btn slider-btn-right shadow-sm" onClick={() => scrollSlider('durees', 'right')}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* SECTION 4: OFFRE */}
      <div className="mb-4">
        <h5 className="fw-bold mb-4 d-flex align-items-center">
          <span className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center me-3" 
                style={{ width: '36px', height: '36px', fontSize: '18px' }}>
            4
          </span>
          <i className="fas fa-gem text-warning me-2 fs-4"></i>
          <span>Choisir une offre</span>
          <span className="text-danger ms-2 fs-6">*</span>
        </h5>
        
        <div className="slider-container ps-5">
          <button className="slider-btn slider-btn-left shadow-sm" onClick={() => scrollSlider('offres', 'left')}>
            <i className="fas fa-chevron-left"></i>
          </button>
          
          <div className="slider-scroll" ref={sliderRefs.offres}>
            {offres.map((offre) => (
              <div
                key={offre.id}
                className={`offre-card ${formData.offre === offre.id ? 'selected' : ''}`}
                onClick={() => handleSelectOffre(offre.id)}
                style={{ 
                  borderColor: formData.offre === offre.id ? offre.couleur : '#e9ecef',
                  boxShadow: formData.offre === offre.id ? `0 8px 20px ${offre.couleur}20` : 'none'
                }}
              >
                {offre.badge && (
                  <span className="badge-offre">{offre.badge}</span>
                )}
                
                <div className="d-flex align-items-center mb-4">
                  <div className="fs-1 me-3">{offre.emoji}</div>
                  <div>
                    <h5 className="mb-1 fw-bold" style={{ color: offre.couleur }}>{offre.name}</h5>
                    <Badge 
                      bg={offre.couleur === '#f59e0b' ? 'warning' : offre.couleur === '#6b7280' ? 'secondary' : 'primary'}
                      className="px-3 py-2 rounded-pill"
                    >
                      {offre.credits} crédits
                    </Badge>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-muted small mb-1">Stockage inclus</div>
                  <div className="h3 mb-0 fw-bold">{offre.storage} MB</div>
                </div>
                
                <div className="plan-features mb-4">
                  {offre.features.map((feature, idx) => (
                    <div key={idx} className="d-flex align-items-center mb-2">
                      <i className="fas fa-check-circle text-success me-2"></i>
                      <small className="fw-medium">{feature}</small>
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-4 pt-3 border-top">
                  <span className="text-muted small text-uppercase">À partir de</span>
                  <div className="h3 mb-0 fw-bold text-primary">
                    {offre.prix_mois.toLocaleString('fr-FR')} DA
                    <small className="fw-normal text-muted fs-6 ms-1">/mois</small>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button className="slider-btn slider-btn-right shadow-sm" onClick={() => scrollSlider('offres', 'right')}>
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      {/* Badges promotionnels */}
      <div className="row g-4 mt-5 ps-5">
        <div className="col-md-4">
          <div className="bg-gradient-soft-primary rounded-4 p-4 text-center h-100 shadow-sm">
            <div className="fs-1 mb-3">🎁</div>
            <h6 className="fw-bold mb-2">1 mois offert</h6>
            <p className="text-muted small mb-0">Pour tout abonnement de 6 mois</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-gradient-soft-success rounded-4 p-4 text-center h-100 shadow-sm">
            <div className="fs-1 mb-3">🎁🎁</div>
            <h6 className="fw-bold mb-2">3 mois offerts</h6>
            <p className="text-muted small mb-0">Pour tout abonnement de 12 mois</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="bg-gradient-soft-warning rounded-4 p-4 text-center h-100 shadow-sm">
            <div className="fs-1 mb-3">🌐</div>
            <h6 className="fw-bold mb-2">Nom de domaine offert</h6>
            <p className="text-muted small mb-0">À partir de 3 mois d'abonnement</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============ STEP 3: PROPRIÉTAIRE & CONTACT ============
const Step3Proprietaire = ({ formData, handleInputChange }) => {
  return (
    <div className="step3-proprietaire">
      <div className="d-flex align-items-center mb-5">
        <div className="bg-gradient-info rounded-3 p-3 me-3 shadow-sm">
          <i className="fas fa-user-tie text-white" style={{ fontSize: '2rem' }}></i>
        </div>
        <div>
          <h3 className="mb-1 fw-bold">Propriétaire & Contact</h3>
          <p className="text-muted mb-0 fs-6">
            Informations du propriétaire et moyens de contact
          </p>
        </div>
      </div>
      
      <Row className="g-4">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-dark">
              <i className="fas fa-user me-2 text-info"></i>
              Nom complet
            </Form.Label>
            <Form.Control
              type="text"
              name="proprietaire.nom"
              value={formData.proprietaire.nom}
              onChange={handleInputChange}
              placeholder="Votre nom complet"
              className="py-3 border-2 bg-light rounded-3"
            />
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-dark">
              <i className="fas fa-envelope me-2 text-info"></i>
              Email
            </Form.Label>
            <Form.Control
              type="email"
              name="proprietaire.email"
              value={formData.proprietaire.email}
              onChange={handleInputChange}
              placeholder="contact@votre-store.com"
              className="py-3 border-2 bg-light rounded-3"
            />
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-dark">
              <i className="fas fa-phone me-2 text-info"></i>
              Téléphone
            </Form.Label>
            <Form.Control
              type="tel"
              name="proprietaire.telephone"
              value={formData.proprietaire.telephone}
              onChange={handleInputChange}
              placeholder="05 XX XX XX XX"
              className="py-3 border-2 bg-light rounded-3"
            />
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-dark">
              <i className="fas fa-map-marker-alt me-2 text-info"></i>
              Wilaya
            </Form.Label>
            <Form.Control
              type="text"
              name="proprietaire.wilaya"
              value={formData.proprietaire.wilaya}
              onChange={handleInputChange}
              placeholder="Alger, Oran, Constantine..."
              className="py-3 border-2 bg-light rounded-3"
            />
          </Form.Group>
        </Col>
        
        <Col xs={12}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold text-dark">
              <i className="fas fa-address-card me-2 text-info"></i>
              Adresse complète
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="proprietaire.adresse"
              value={formData.proprietaire.adresse}
              onChange={handleInputChange}
              placeholder="Adresse physique de votre boutique"
              className="py-3 border-2 bg-light rounded-3"
            />
          </Form.Group>
        </Col>
      </Row>

      <h5 className="fw-bold mt-5 mb-4 d-flex align-items-center">
        <i className="fas fa-share-alt text-info me-2 fs-4"></i>
        <span>Réseaux sociaux</span>
      </h5>
      
      <Row className="g-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label className="small fw-semibold">
              <i className="fab fa-facebook text-primary me-1"></i> Facebook
            </Form.Label>
            <Form.Control
              type="url"
              name="reseaux_sociaux.facebook"
              value={formData.reseaux_sociaux.facebook}
              onChange={handleInputChange}
              placeholder="https://facebook.com/..."
              className="py-2 border-2 bg-light rounded-3"
            />
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group>
            <Form.Label className="small fw-semibold">
              <i className="fab fa-instagram text-danger me-1"></i> Instagram
            </Form.Label>
            <Form.Control
              type="url"
              name="reseaux_sociaux.instagram"
              value={formData.reseaux_sociaux.instagram}
              onChange={handleInputChange}
              placeholder="https://instagram.com/..."
              className="py-2 border-2 bg-light rounded-3"
            />
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group>
            <Form.Label className="small fw-semibold">
              <i className="fab fa-tiktok me-1"></i> TikTok
            </Form.Label>
            <Form.Control
              type="url"
              name="reseaux_sociaux.tiktok"
              value={formData.reseaux_sociaux.tiktok}
              onChange={handleInputChange}
              placeholder="https://tiktok.com/@..."
              className="py-2 border-2 bg-light rounded-3"
            />
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group>
            <Form.Label className="small fw-semibold">
              <i className="fab fa-whatsapp text-success me-1"></i> WhatsApp
            </Form.Label>
            <Form.Control
              type="text"
              name="reseaux_sociaux.whatsapp"
              value={formData.reseaux_sociaux.whatsapp}
              onChange={handleInputChange}
              placeholder="+213 XX XXX XXX"
              className="py-2 border-2 bg-light rounded-3"
            />
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group>
            <Form.Label className="small fw-semibold">
              <i className="fas fa-globe me-1"></i> Site web
            </Form.Label>
            <Form.Control
              type="url"
              name="reseaux_sociaux.website"
              value={formData.reseaux_sociaux.website}
              onChange={handleInputChange}
              placeholder="https://www.votresite.com"
              className="py-2 border-2 bg-light rounded-3"
            />
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group>
            <Form.Label className="small fw-semibold">
              <i className="fas fa-palette me-1"></i> Couleur thème
            </Form.Label>
            <div className="d-flex">
              <Form.Control
                type="color"
                name="couleur_theme"
                value={formData.couleur_theme}
                onChange={handleInputChange}
                className="w-25 border-2 rounded-start-3"
                style={{ height: '45px' }}
              />
              <Form.Control
                type="text"
                value={formData.couleur_theme}
                readOnly
                className="ms-2 flex-grow-1 bg-light border-2 rounded-3"
              />
            </div>
          </Form.Group>
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
      <div className="d-flex align-items-center mb-5">
        <div className="bg-gradient-warning rounded-3 p-3 me-3 shadow-sm">
          <i className="fas fa-credit-card text-white" style={{ fontSize: '2rem' }}></i>
        </div>
        <div>
          <h3 className="mb-1 fw-bold">Paiement</h3>
          <p className="text-muted mb-0 fs-6">
            Finalisez votre commande et choisissez votre mode de paiement
          </p>
        </div>
      </div>
      
      <Row className="g-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm rounded-4 mb-4">
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center">
                <i className="fas fa-receipt text-primary me-2 fs-4"></i>
                Détails de la transaction
              </h5>
              
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="bg-light">
                    <tr>
                      <th className="py-3">Désignation</th>
                      <th className="py-3">Durée</th>
                      <th className="py-3 text-end">Montant HT</th>
                      <th className="py-3 text-end">TVA (19%)</th>
                      <th className="py-3 text-end">Montant TTC</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <div className="fw-bold">{formData.offre}</div>
                        <small className="text-muted">{formData.categorie}</small>
                      </td>
                      <td>{dureeSelectionnee?.name || '1 Mois'}</td>
                      <td className="text-end">{formData.montant_initial.toLocaleString('fr-FR')} DA</td>
                      <td className="text-end">{(formData.montant_initial * 0.19).toLocaleString('fr-FR')} DA</td>
                      <td className="text-end fw-bold text-success fs-5">
                        {formData.montant_ttc.toLocaleString('fr-FR')} DA
                      </td>
                    </tr>
                  </tbody>
                  <tfoot className="bg-light">
                    <tr>
                      <td colSpan="4" className="text-end fw-bold py-3">TOTAL TTC</td>
                      <td className="text-end fw-bold text-success fs-4 py-3">
                        {formData.montant_ttc.toLocaleString('fr-FR')} DA
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              {formData.mois_offerts > 0 && (
                <Alert variant="success" className="mt-4 rounded-3 border-0">
                  <div className="d-flex align-items-center">
                    <div className="bg-success bg-opacity-10 rounded-circle p-2 me-3">
                      <i className="fas fa-gift text-success fs-4"></i>
                    </div>
                    <div>
                      <h6 className="alert-heading fw-bold mb-1">🎁 Félicitations!</h6>
                      <p className="mb-0">
                        Vous bénéficiez de <strong>{formData.mois_offerts} mois offert(s)</strong> sur votre abonnement!
                      </p>
                    </div>
                  </div>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="border-0 shadow-sm rounded-4 mb-4 sticky-top" style={{ top: '20px' }}>
            <Card.Body className="p-4">
              <h5 className="fw-bold mb-4 d-flex align-items-center">
                <i className="fas fa-credit-card text-primary me-2 fs-4"></i>
                Paiement
              </h5>
              
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">
                  Méthode de paiement <span className="text-danger">*</span>
                </Form.Label>
                <Form.Select
                  name="methode_paiement"
                  value={formData.methode_paiement}
                  onChange={handleInputChange}
                  className="py-3 border-2 bg-light rounded-3"
                  size="lg"
                  required
                >
                  <option value="">Sélectionnez une méthode</option>
                  {methodesPaiement.map((methode) => (
                    <option key={methode.value} value={methode.value}>
                      {methode.emoji} {methode.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              <hr className="my-4" />
              
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">
                  <i className="fas fa-user me-2"></i>
                  Nom du client
                </Form.Label>
                <Form.Control
                  type="text"
                  name="client_nom"
                  value={formData.client_nom}
                  onChange={handleInputChange}
                  placeholder="Votre nom"
                  className="py-3 border-2 bg-light rounded-3"
                />
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Label className="fw-semibold">
                  <i className="fas fa-phone me-2"></i>
                  Téléphone
                </Form.Label>
                <Form.Control
                  type="tel"
                  name="client_telephone"
                  value={formData.client_telephone}
                  onChange={handleInputChange}
                  placeholder="05 XX XX XX XX"
                  className="py-3 border-2 bg-light rounded-3"
                />
              </Form.Group>
              
              <Form.Group className="mb-4">
                <Form.Check
                  type="checkbox"
                  name="accepte_conditions"
                  id="accepte_conditions"
                  className="fs-6"
                  label={
                    <span className="fw-medium">
                      J'accepte les <a href="/conditions" target="_blank" className="text-primary text-decoration-none fw-bold">conditions générales</a>
                      <span className="text-danger ms-1">*</span>
                    </span>
                  }
                  checked={formData.accepte_conditions}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Alert variant="info" className="mt-4 rounded-4 border-0">
        <div className="d-flex">
          <div className="bg-info bg-opacity-10 rounded-circle p-3 me-3">
            <i className="fas fa-info-circle text-info fs-3"></i>
          </div>
          <div>
            <h6 className="alert-heading fw-bold mb-2">Important</h6>
            <p className="mb-2">
              Votre demande sera évaluée par nos administrateurs dans un délai de 24-48h. 
              Vous recevrez un email de confirmation dès que votre store sera approuvé.
            </p>
            {!formData.accepte_conditions && (
              <div className="bg-warning bg-opacity-10 p-3 rounded-3 mt-2">
                <i className="fas fa-exclamation-triangle text-warning me-2"></i>
                <span className="fw-medium">Veuillez accepter les conditions générales pour continuer</span>
              </div>
            )}
          </div>
        </div>
      </Alert>
      
      <div className="bg-light p-4 rounded-4 mt-4 d-flex justify-content-between align-items-center">
        <div>
          <span className="text-muted me-2">Transaction #:</span>
          <span className="fw-bold font-monospace bg-white px-4 py-2 rounded-3 shadow-sm">
            {transactionId}
          </span>
        </div>
        <div>
          <span className="text-muted me-2">Date:</span>
          <span className="fw-bold">
            {new Date().toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CreateBoutiqueWizard;