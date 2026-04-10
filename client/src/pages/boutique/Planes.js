// 📂 src/components/boutique/Planes.jsx - VERSIÓN COMPLETA CON BOTÓN DE CONFIRMACIÓN
import React, { useState, useEffect } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { FaCheck, FaGift, FaClock } from 'react-icons/fa';

// ============================================
// CATEGORÍAS PRINCIPALES (Nivel 1)
// ============================================
const CATEGORIES = [
  { id: 'immobilier', name: 'Immobilier', icon: '🏠', color: '#dc2626' },
  { id: 'vehicules', name: 'Véhicules', icon: '🚗', color: '#2563eb' },
  { id: 'electromenager', name: 'Électroménager', icon: '📺', color: '#16a34a' },
  { id: 'vetements', name: 'Vêtements & Mode', icon: '👕', color: '#ec4899' },
  { id: 'alimentaire', name: 'Alimentaire', icon: '🍔', color: '#f59e0b' },
  { id: 'beaute', name: 'Beauté & Bien-être', icon: '💄', color: '#9333ea' },
  { id: 'sport', name: 'Sport & Loisirs', icon: '⚽', color: '#06b6d4' },
  { id: 'services', name: 'Services', icon: '🔧', color: '#6b7280' },
  { id: 'informatique', name: 'Informatique', icon: '💻', color: '#3b82f6' },
  { id: 'maison', name: 'Maison & Jardin', icon: '🏡', color: '#10b981' },
  { id: 'sante', name: 'Santé', icon: '💊', color: '#ef4444' },
  { id: 'animaux', name: 'Animaux', icon: '🐕', color: '#f97316' }
];

// ============================================
// ACTIVIDADES POR CATEGORÍA (Nivel 2)
// ============================================
const ACTIVITIES_BY_CATEGORY = {
  immobilier: [
    { id: 'agences-immobilieres', name: 'Agences immobilières', icon: '🏢', description: 'Vente, location, gestion immobilière' },
    { id: 'promotions-immobilieres', name: 'Promotions immobilières', icon: '🏗️', description: 'Promoteurs, programmes neufs' },
    { id: 'syndics-copropriete', name: 'Syndics de copropriété', icon: '📋', description: 'Gestion de copropriétés' },
    { id: 'diagnostiqueurs', name: 'Diagnostiqueurs', icon: '🔍', description: 'Diagnostics immobiliers' }
  ],
  vehicules: [
    { id: 'showroom-automobiles', name: 'Showroom automobiles', icon: '🚘', description: 'Vente de voitures neuves et d\'occasion' },
    { id: 'showroom-moto', name: 'Showroom moto', icon: '🏍️', description: 'Motos, scooters, quads' },
    { id: 'pieces-accessoires', name: 'Pièces & Accessoires', icon: '🔧', description: 'Pièces détachées, accessoires auto' },
    { id: 'location-vehicules', name: 'Location de véhicules', icon: '🚙', description: 'Location courte et longue durée' },
    { id: 'reparation-vehicules', name: 'Réparation & Services', icon: '🔩', description: 'Garages, entretien, carrosserie' }
  ],
  electromenager: [
    { id: 'magasin-electromenager', name: 'Magasin d\'électroménager', icon: '📱', description: 'Électroménager, multimédia' },
    { id: 'reparation-electro', name: 'Réparation électroménager', icon: '🛠️', description: 'SAV, réparation' },
    { id: 'climatisation', name: 'Climatisation & Froid', icon: '❄️', description: 'Installation, entretien' }
  ],
  vetements: [
    { id: 'pret-a-porter', name: 'Prêt-à-porter', icon: '👗', description: 'Vêtements homme, femme, enfant' },
    { id: 'accessoires-mode', name: 'Accessoires de mode', icon: '👜', description: 'Sacs, chaussures, bijoux' },
    { id: 'couture-confection', name: 'Couture & Confection', icon: '🧵', description: 'Tailleur, retouches, création' },
    { id: 'luxe', name: 'Marques de luxe', icon: '💎', description: 'Produits haut de gamme' }
  ],
  alimentaire: [
    { id: 'epicerie-fine', name: 'Épicerie fine', icon: '🍷', description: 'Produits gourmets, terroir' },
    { id: 'boucherie-charcuterie', name: 'Boucherie & Charcuterie', icon: '🥩', description: 'Viandes, charcuteries' },
    { id: 'boulangerie-patisserie', name: 'Boulangerie & Pâtisserie', icon: '🥖', description: 'Pain, pâtisseries, viennoiseries' },
    { id: 'traiteur', name: 'Traiteur', icon: '🍽️', description: 'Repas, buffets, événements' },
    { id: 'produits-bio', name: 'Produits bio', icon: '🌿', description: 'Alimentation biologique' }
  ],
  beaute: [
    { id: 'cosmetiques', name: 'Cosmétiques', icon: '💄', description: 'Maquillage, soins' },
    { id: 'parfumerie', name: 'Parfumerie', icon: '🌸', description: 'Parfums, eaux de toilette' },
    { id: 'institut-beaute', name: 'Institut de beauté', icon: '💆', description: 'Soins esthétiques, spa' },
    { id: 'coiffure', name: 'Coiffure & Barbier', icon: '✂️', description: 'Salon de coiffure' }
  ],
  sport: [
    { id: 'articles-sport', name: 'Articles de sport', icon: '⚽', description: 'Équipements, vêtements sport' },
    { id: 'salle-sport', name: 'Salle de sport', icon: '💪', description: 'Fitness, musculation' },
    { id: 'outdoor', name: 'Outdoor & Randonnée', icon: '🏔️', description: 'Camping, randonnée' }
  ],
  services: [
    { id: 'nettoyage', name: 'Nettoyage & Entretien', icon: '🧹', description: 'Ménage, nettoyage professionnel' },
    { id: 'informatique-services', name: 'Services informatiques', icon: '💻', description: 'Dépannage, développement' },
    { id: 'conseil', name: 'Conseil & Formation', icon: '📚', description: 'Coaching, consulting' }
  ],
  informatique: [
    { id: 'magasin-informatique', name: 'Magasin informatique', icon: '💻', description: 'Ordinateurs, composants' },
    { id: 'reparation-informatique', name: 'Réparation informatique', icon: '🔧', description: 'SAV, dépannage' },
    { id: 'telephonie', name: 'Téléphonie', icon: '📱', description: 'Smartphones, accessoires' }
  ],
  maison: [
    { id: 'meubles', name: 'Meubles & Décoration', icon: '🛋️', description: 'Mobilier, décoration' },
    { id: 'jardinage', name: 'Jardinage', icon: '🌱', description: 'Plantes, outils de jardin' },
    { id: 'bricolage', name: 'Bricolage & Outillage', icon: '🔨', description: 'Outils, matériaux' }
  ],
  sante: [
    { id: 'pharmacie', name: 'Pharmacie', icon: '💊', description: 'Médicaments, parapharmacie' },
    { id: 'opticien', name: 'Opticien', icon: '👓', description: 'Lunettes, lentilles' }
  ],
  animaux: [
    { id: 'animalerie', name: 'Animalerie', icon: '🐕', description: 'Aliments, accessoires animaux' },
    { id: 'toilettage', name: 'Toilettage', icon: '✂️', description: 'Toilettage pour animaux' }
  ]
};

// ============================================
// PLANS DISPONIBLES
// ============================================
const PLANS = [
  {
    id: 'gratuit',
    name: 'Gratuit',
    price: 0,
    period: '5 jours',
    icon: '🎁',
    color: '#6c757d',
    features: [
      'Boutique de base',
      'Jusqu\'à 20 produits',
      'Stockage 100 MB',
      'Support par email'
    ],
    badge: 'Démarrage'
  },
  {
    id: 'basique',
    name: 'Basique',
    price: 3000,
    period: 'mois',
    icon: '⭐',
    color: '#0d6efd',
    features: [
      'Boutique professionnelle',
      'Jusqu\'à 100 produits',
      'Stockage 500 MB',
      'Support prioritaire',
      'Statistiques avancées',
      'Nom de domaine personnalisé'
    ],
    badge: 'Populaire'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 15000,
    period: 'mois',
    icon: '💎',
    color: '#f59e0b',
    features: [
      'Boutique illimitée',
      'Produits illimités',
      'Stockage 2 GB',
      'Support 24/7',
      'Marketing tools',
      'API Access',
      'Certificat SSL offert'
    ],
    badge: 'Recommandé'
  },
  {
    id: 'entreprise',
    name: 'Entreprise',
    price: 35000,
    period: 'mois',
    icon: '🏢',
    color: '#198754',
    features: [
      'Solution complète',
      'Multi-vendeurs',
      'Stockage 10 GB',
      'Support dédié',
      'Formation incluse',
      'SLA 99.9%',
      'Compte manager'
    ],
    badge: 'Ultimate'
  }
];

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const Planes = ({ onSelect, initialData = {} }) => {
  const [selectedCategory, setSelectedCategory] = useState(initialData.categorie || '');
  const [selectedActivity, setSelectedActivity] = useState(initialData.subCategory || '');
  const [selectedPlan, setSelectedPlan] = useState(initialData.plan || 'gratuit');
  const [selectedDuration, setSelectedDuration] = useState(initialData.duree || '1');
  const [isFreePlan, setIsFreePlan] = useState(true);
  
  const freeDurations = [
    { id: '1', name: '1 jour', days: 1 },
    { id: '2', name: '2 jours', days: 2 },
    { id: '3', name: '3 jours', days: 3 },
    { id: '4', name: '4 jours', days: 4 },
    { id: '5', name: '5 jours', days: 5 }
  ];
  
  const paidDurations = [
    { id: '1', name: '1 mois', months: 1, bonus: null },
    { id: '3', name: '3 mois', months: 3, bonus: null },
    { id: '6', name: '6 mois', months: 6, bonus: '1 mois offert' },
    { id: '12', name: '12 mois', months: 12, bonus: '3 mois offerts' }
  ];
  
  useEffect(() => {
    setIsFreePlan(selectedPlan === 'gratuit');
    if (selectedPlan === 'gratuit') {
      if (!freeDurations.find(d => d.id === selectedDuration)) {
        setSelectedDuration('1');
      }
    } else {
      if (!paidDurations.find(d => d.id === selectedDuration)) {
        setSelectedDuration('1');
      }
    }
  }, [selectedPlan]);
  
  const availableActivities = selectedCategory ? ACTIVITIES_BY_CATEGORY[selectedCategory] || [] : [];
  const isComplete = selectedCategory && selectedActivity && selectedPlan && selectedDuration;
  
  const getSelectionData = () => {
    const selectedPlanData = PLANS.find(p => p.id === selectedPlan);
    const durationData = isFreePlan 
      ? freeDurations.find(d => d.id === selectedDuration)
      : paidDurations.find(d => d.id === selectedDuration);
    
    return {
      categorie: selectedCategory,
      subCategory: selectedActivity,
      plan: selectedPlan,
      planData: selectedPlanData,
      duree: selectedDuration,
      dureeData: durationData,
      montant: isFreePlan ? 0 : (selectedPlanData?.price || 0) * (durationData?.months || 1),
      isFree: isFreePlan
    };
  };
  
  const handleConfirm = () => {
    console.log('🔵 Botón clickeado - handleConfirm');
    console.log('🔵 onSelect existe?', !!onSelect);
    console.log('🔵 Tipo de onSelect:', typeof onSelect);
    
    if (!onSelect) {
      console.error('❌ onSelect es undefined o null');
      return;
    }
    
    if (typeof onSelect !== 'function') {
      console.error('❌ onSelect no es una función');
      return;
    }
    
    if (!isComplete) {
      console.warn('⚠️ Selección incompleta');
      return;
    }
    
    const data = getSelectionData();
    console.log('✅ Llamando a onSelect con:', data);
    onSelect(data);
  };
  
  return (
    <div className="planes-container">
      {/* Étape 1: Catégorie */}
      <div className="mb-4">
        <h6 className="mb-3">
          <Badge bg="primary" className="rounded-pill me-2">1</Badge>
          Catégorie d'activité
        </h6>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
          {CATEGORIES.map(cat => (
            <div
              key={cat.id}
              onClick={() => { setSelectedCategory(cat.id); setSelectedActivity(''); }}
              style={{
                padding: '10px',
                textAlign: 'center',
                border: `2px solid ${selectedCategory === cat.id ? cat.color : '#e9ecef'}`,
                borderRadius: '10px',
                cursor: 'pointer',
                backgroundColor: selectedCategory === cat.id ? '#f0f7ff' : 'white'
              }}
            >
              <div style={{ fontSize: '1.8rem' }}>{cat.icon}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>{cat.name}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Étape 2: Activité */}
      {selectedCategory && (
        <div className="mb-4">
          <h6 className="mb-3">
            <Badge bg="primary" className="rounded-pill me-2">2</Badge>
            Activité spécifique
          </h6>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {availableActivities.map(activity => (
              <div
                key={activity.id}
                onClick={() => setSelectedActivity(activity.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px',
                  border: `1px solid ${selectedActivity === activity.id ? '#0d6efd' : '#e9ecef'}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  backgroundColor: selectedActivity === activity.id ? '#f0f7ff' : 'white'
                }}
              >
                <div style={{ fontSize: '1.8rem', marginRight: '15px' }}>{activity.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{activity.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>{activity.description}</div>
                </div>
                {selectedActivity === activity.id && <FaCheck style={{ color: '#0d6efd' }} />}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Étape 3: Plan */}
      {selectedActivity && (
        <div className="mb-4">
          <h6 className="mb-3">
            <Badge bg="primary" className="rounded-pill me-2">3</Badge>
            Choisissez votre formule
          </h6>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
            {PLANS.map(plan => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                style={{
                  position: 'relative',
                  padding: '15px',
                  border: `2px solid ${selectedPlan === plan.id ? '#0d6efd' : '#e9ecef'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: selectedPlan === plan.id ? '#f0f7ff' : 'white'
                }}
              >
                {plan.badge && (
                  <span style={{ position: 'absolute', top: '-10px', right: '10px', backgroundColor: plan.color, color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '0.7rem' }}>
                    {plan.badge}
                  </span>
                )}
                <div style={{ fontSize: '2rem', textAlign: 'center' }}>{plan.icon}</div>
                <div style={{ fontWeight: 'bold', textAlign: 'center' }}>{plan.name}</div>
                <div style={{ textAlign: 'center', margin: '10px 0' }}>
                  {plan.price === 0 ? (
                    <span style={{ color: '#198754', fontWeight: 'bold' }}>GRATUIT</span>
                  ) : (
                    <span><span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0d6efd' }}>{plan.price.toLocaleString()} DA</span> <span style={{ fontSize: '0.7rem' }}>/{plan.period}</span></span>
                  )}
                </div>
                <ul style={{ fontSize: '0.7rem', paddingLeft: '20px', margin: 0 }}>
                  {plan.features.slice(0, 3).map((f, i) => (
                    <li key={i}><FaCheck className="text-success me-1" size={10} /> {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Étape 4: Durée */}
      {selectedPlan && (
        <div className="mb-4">
          <h6 className="mb-3">
            <Badge bg="primary" className="rounded-pill me-2">4</Badge>
            Durée d'abonnement
          </h6>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {(isFreePlan ? freeDurations : paidDurations).map(duration => (
              <div
                key={duration.id}
                onClick={() => setSelectedDuration(duration.id)}
                style={{
                  flex: 1,
                  minWidth: '90px',
                  padding: '12px',
                  textAlign: 'center',
                  border: `2px solid ${selectedDuration === duration.id ? '#0d6efd' : '#e9ecef'}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  backgroundColor: selectedDuration === duration.id ? '#f0f7ff' : 'white'
                }}
              >
                <FaClock style={{ color: '#6c757d' }} />
                <div style={{ fontWeight: 600 }}>{duration.name}</div>
                {duration.bonus && <Badge bg="success" className="mt-1" style={{ fontSize: '0.65rem' }}><FaGift className="me-1" size={10} /> {duration.bonus}</Badge>}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Résumé et bouton de confirmation */}
      {isComplete && (
        <div className="mt-4">
          <div style={{ padding: '15px', backgroundColor: '#e9ecef', borderRadius: '10px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <Badge bg="info" className="me-2">{CATEGORIES.find(c => c.id === selectedCategory)?.name}</Badge>
                <Badge bg="secondary" className="me-2">{availableActivities.find(a => a.id === selectedActivity)?.name}</Badge>
                <Badge bg={PLANS.find(p => p.id === selectedPlan)?.color} style={{ backgroundColor: PLANS.find(p => p.id === selectedPlan)?.color }}>
                  {PLANS.find(p => p.id === selectedPlan)?.name}
                </Badge>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>Total à payer</div>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#0d6efd' }}>
                  {isFreePlan ? 'Gratuit' : `${((PLANS.find(p => p.id === selectedPlan)?.price || 0) * (paidDurations.find(d => d.id === selectedDuration)?.months || 1)).toLocaleString()} DA`}
                </div>
              </div>
            </div>
          </div>
          
          <Button variant="success" size="lg" className="w-100 py-2 fw-bold" onClick={handleConfirm}>
            <FaCheck className="me-2" /> Confirmer ma sélection
          </Button>
          <p className="text-muted text-center mt-2 small">Vous pourrez modifier ces informations plus tard</p>
        </div>
      )}
    </div>
  );
};

export default Planes;