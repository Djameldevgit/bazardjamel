// 📂 components/CATEGORIES/specificFields/VoyagesFields.js
import React from 'react';
import Select from 'react-select';
import BaseCategoryField from './BaseCategoryField';

// ============================================
// CAMPOS COMUNES PARA TODAS LAS CATEGORÍAS
// ============================================

// Titre
const TitleField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Titre</label>
      <input
        type="text"
        name="title"
        className="form-control"
        placeholder="Titre de l'annonce"
        value={postData?.title || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Description
const DescriptionField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">
        Description <span className="text-danger">*</span>
      </label>
      <textarea
        name="description"
        className="form-control"
        rows="4"
        placeholder="Décrivez votre offre de voyage en détail..."
        value={postData?.description || ''}
        onChange={handleChangeInput}
        required
      />
      <small className="text-muted">Décrivez le programme, les prestations incluses, etc.</small>
    </div>
  );
};

// ============================================
// CAMPOS ESPECÍFICOS PARA VOYAGES
// ============================================

// Destination
const DestinationField = ({ postData, handleChangeInput }) => {
  const destinations = [
    { value: 'Paris', label: '🇫🇷 Paris' },
    { value: 'Istanbul', label: '🇹🇷 Istanbul' },
    { value: 'Dubaï', label: '🇦🇪 Dubaï' },
    { value: 'Makkah', label: '🇸🇦 Makkah' },
    { value: 'Madinah', label: '🇸🇦 Madinah' },
    { value: 'Barcelone', label: '🇪🇸 Barcelone' },
    { value: 'Rome', label: '🇮🇹 Rome' },
    { value: 'Londres', label: '🇬🇧 Londres' },
    { value: 'New York', label: '🇺🇸 New York' },
    { value: 'Bangkok', label: '🇹🇭 Bangkok' },
    { value: 'Marrakech', label: '🇲🇦 Marrakech' },
    { value: 'Tunis', label: '🇹🇳 Tunis' },
    { value: 'Alger', label: '🇩🇿 Alger' },
    { value: 'Autre', label: '🌍 Autre destination' }
  ];
  
  const selectedOption = destinations.find(opt => opt.value === postData?.destination) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'destination', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Destination</label>
      <Select
        name="destination"
        options={destinations}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la destination..."
        isClearable
      />
    </div>
  );
};

// Durée
const DureeField = ({ postData, handleChangeInput }) => {
  const durees = [
    { value: '1 jour', label: '1 jour' },
    { value: '2 jours', label: '2 jours' },
    { value: '3 jours', label: '3 jours' },
    { value: '4 jours', label: '4 jours' },
    { value: '5 jours', label: '5 jours' },
    { value: '6 jours', label: '6 jours' },
    { value: '7 jours (1 semaine)', label: '7 jours (1 semaine)' },
    { value: '10 jours', label: '10 jours' },
    { value: '14 jours (2 semaines)', label: '14 jours (2 semaines)' },
    { value: '21 jours (3 semaines)', label: '21 jours (3 semaines)' },
    { value: '1 mois', label: '1 mois' }
  ];
  
  const selectedOption = durees.find(opt => opt.value === postData?.duree) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'duree', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Durée</label>
      <Select
        name="duree"
        options={durees}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la durée..."
        isClearable
      />
    </div>
  );
};

// Date départ
const DateDepartField = ({ postData, handleChangeInput }) => {
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Date de départ</label>
      <input
        type="date"
        name="dateDepart"
        className="form-control"
        min={today}
        value={postData?.dateDepart || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Date retour
const DateRetourField = ({ postData, handleChangeInput }) => {
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Date de retour</label>
      <input
        type="date"
        name="dateRetour"
        className="form-control"
        min={today}
        value={postData?.dateRetour || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Nombre de personnes
const NombrePersonnesField = ({ postData, handleChangeInput }) => {
  const personnes = [
    { value: '1', label: '1 personne' },
    { value: '2', label: '2 personnes' },
    { value: '3', label: '3 personnes' },
    { value: '4', label: '4 personnes' },
    { value: '5', label: '5 personnes' },
    { value: '6', label: '6 personnes' },
    { value: '7+', label: '7 personnes ou plus' }
  ];
  
  const selectedOption = personnes.find(opt => opt.value === postData?.nombrePersonnes) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'nombrePersonnes', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Nombre de personnes</label>
      <Select
        name="nombrePersonnes"
        options={personnes}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le nombre..."
        isClearable
      />
    </div>
  );
};

// Transport
const TransportField = ({ postData, handleChangeInput }) => {
  const transports = [
    { value: 'Avion', label: '✈️ Avion' },
    { value: 'Bus', label: '🚌 Bus' },
    { value: 'Train', label: '🚂 Train' },
    { value: 'Voiture', label: '🚗 Voiture' },
    { value: 'Bateau', label: '⛴️ Bateau' },
    { value: 'Mixte', label: '🔄 Mixte' }
  ];
  
  const selectedOption = transports.find(opt => opt.value === postData?.transport) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'transport', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Transport</label>
      <Select
        name="transport"
        options={transports}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le transport..."
        isClearable
      />
    </div>
  );
};

// Hébergement
const HebergementField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Hébergement</label>
      <input
        type="text"
        name="hebergement"
        className="form-control"
        placeholder="Ex: Hôtel 4*, Riad, Appartement..."
        value={postData?.hebergement || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Activités incluses
const ActivitesInclusesField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Activités incluses</label>
      <textarea
        name="activitesIncluses"
        className="form-control"
        rows="3"
        placeholder="Visites guidées, excursions, repas..."
        value={postData?.activitesIncluses || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA LOCATION VACANCES
// ============================================

// Type d'hébergement
const TypeHebergementField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Appartement', label: '🏢 Appartement' },
    { value: 'Villa', label: '🏡 Villa' },
    { value: 'Maison', label: '🏠 Maison' },
    { value: 'Studio', label: '🏠 Studio' },
    { value: 'Riad', label: '🕌 Riad' },
    { value: 'Chalet', label: '🏔️ Chalet' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typeHebergement) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeHebergement', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type d'hébergement</label>
      <Select
        name="typeHebergement"
        options={types}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le type..."
        isClearable
      />
    </div>
  );
};

// Capacité
const CapaciteField = ({ postData, handleChangeInput }) => {
  const capacites = [
    { value: '1', label: '1 personne' },
    { value: '2', label: '2 personnes' },
    { value: '3', label: '3 personnes' },
    { value: '4', label: '4 personnes' },
    { value: '5', label: '5 personnes' },
    { value: '6', label: '6 personnes' },
    { value: '7', label: '7 personnes' },
    { value: '8+', label: '8 personnes ou plus' }
  ];
  
  const selectedOption = capacites.find(opt => opt.value === postData?.capacite) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'capacite', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Capacité (personnes)</label>
      <Select
        name="capacite"
        options={capacites}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la capacité..."
        isClearable
      />
    </div>
  );
};

// Équipements
const EquipementsField = ({ postData, handleChangeInput }) => {
  const equipementsList = [
    { value: 'WiFi', label: '📶 WiFi' },
    { value: 'Piscine', label: '🏊 Piscine' },
    { value: 'Climatisation', label: '❄️ Climatisation' },
    { value: 'Parking', label: '🅿️ Parking' },
    { value: 'Cuisine équipée', label: '🍳 Cuisine équipée' },
    { value: 'Lave-linge', label: '🧺 Lave-linge' },
    { value: 'Télévision', label: '📺 Télévision' },
    { value: 'Balcon', label: '🏠 Balcon' },
    { value: 'Jardin', label: '🌳 Jardin' },
    { value: 'Terrasse', label: '🏠 Terrasse' }
  ];
  
  const selectedValues = postData?.equipements || [];
  const selectedOptions = equipementsList.filter(opt => selectedValues.includes(opt.value));
  
  const handleChange = (selected) => {
    const values = selected ? selected.map(opt => opt.value) : [];
    handleChangeInput({
      target: { name: 'equipements', value: values }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Équipements</label>
      <Select
        isMulti
        name="equipements"
        options={equipementsList}
        value={selectedOptions}
        onChange={handleChange}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Sélectionner les équipements..."
      />
      <small className="text-muted">Vous pouvez sélectionner plusieurs équipements</small>
    </div>
  );
};

// Proximité
const ProximiteField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Proximité</label>
      <input
        type="text"
        name="proximite"
        className="form-control"
        placeholder="Ex: Centre ville 5min, Plage 200m..."
        value={postData?.proximite || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// ============================================
// CAMPOS POUR HAJJ & OMRA
// ============================================

// Type de pèlerinage
const TypePelerinageField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Hajj', label: '🕋 Hajj' },
    { value: 'Omra', label: '🕋 Omra' },
    { value: 'Hajj + Omra', label: '🕋 Hajj + Omra' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typePelerinage) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typePelerinage', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de pèlerinage</label>
      <Select
        name="typePelerinage"
        options={types}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le type..."
        isClearable
      />
    </div>
  );
};

// Groupe
const GroupeField = ({ postData, handleChangeInput }) => {
  const groupes = [
    { value: 'Individuel', label: '👤 Individuel' },
    { value: 'Famille', label: '👨‍👩‍👧‍👦 Famille' },
    { value: 'Groupe organisé', label: '👥 Groupe organisé' }
  ];
  
  const selectedOption = groupes.find(opt => opt.value === postData?.groupe) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'groupe', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Groupe</label>
      <Select
        name="groupe"
        options={groupes}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le type de groupe..."
        isClearable
      />
    </div>
  );
};

// Hôtel Makkah
const HotelMakkahField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Hôtel à Makkah</label>
      <input
        type="text"
        name="hotelMakkah"
        className="form-control"
        placeholder="Nom et catégorie"
        value={postData?.hotelMakkah || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Hôtel Madinah
const HotelMadinahField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Hôtel à Madinah</label>
      <input
        type="text"
        name="hotelMadinah"
        className="form-control"
        placeholder="Nom et catégorie"
        value={postData?.hotelMadinah || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Vols inclus
const VolsField = ({ postData, handleChangeInput }) => {
  const options = [
    { value: 'Aller-retour inclus', label: '✈️ Aller-retour inclus' },
    { value: 'Vols non inclus', label: '❌ Vols non inclus' },
    { value: 'Optionnel', label: '🔘 Optionnel' }
  ];
  
  const selectedOption = options.find(opt => opt.value === postData?.vols) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'vols', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Vols inclus</label>
      <Select
        name="vols"
        options={options}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner..."
        isClearable
      />
    </div>
  );
};

// ============================================
// CAMPOS POUR SÉJOUR
// ============================================

// Type de séjour
const TypeSejourField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Détente', label: '🧘 Détente' },
    { value: 'Découverte', label: '🗺️ Découverte' },
    { value: 'Aventure', label: '⛰️ Aventure' },
    { value: 'Culturel', label: '🏛️ Culturel' },
    { value: 'Balnéaire', label: '🏖️ Balnéaire' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typeSejour) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeSejour', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de séjour</label>
      <Select
        name="typeSejour"
        options={types}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le type..."
        isClearable
      />
    </div>
  );
};

// Catégorie hôtel
const CategorieHotelField = ({ postData, handleChangeInput }) => {
  const categories = [
    { value: '2 étoiles', label: '⭐⭐ 2 étoiles' },
    { value: '3 étoiles', label: '⭐⭐⭐ 3 étoiles' },
    { value: '4 étoiles', label: '⭐⭐⭐⭐ 4 étoiles' },
    { value: '5 étoiles', label: '⭐⭐⭐⭐⭐ 5 étoiles' },
    { value: 'Luxe', label: '👑 Luxe' }
  ];
  
  const selectedOption = categories.find(opt => opt.value === postData?.categorieHotel) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'categorieHotel', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Catégorie d'hôtel</label>
      <Select
        name="categorieHotel"
        options={categories}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la catégorie..."
        isClearable
      />
    </div>
  );
};

// ============================================
// CAMPOS POUR CROISIÈRE
// ============================================

// Nom bateau
const NomBateauField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Nom du bateau</label>
      <input
        type="text"
        name="nomBateau"
        className="form-control"
        placeholder="Nom de la croisière"
        value={postData?.nomBateau || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Type de cabine
const CabineField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Intérieure', label: '🚪 Intérieure' },
    { value: 'Extérieure', label: '🪟 Extérieure' },
    { value: 'Avec balcon', label: '🏠 Avec balcon' },
    { value: 'Suite', label: '👑 Suite' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.cabine) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'cabine', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de cabine</label>
      <Select
        name="cabine"
        options={types}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le type de cabine..."
        isClearable
      />
    </div>
  );
};

// ============================================
// CAMPOS POUR RÉSERVATIONS & VISA
// ============================================

// Compagnie/Agence
const CompagnieField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Compagnie/Agence</label>
      <input
        type="text"
        name="compagnie"
        className="form-control"
        placeholder="Nom de la compagnie ou agence"
        value={postData?.compagnie || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Type de voyage
const TypeVoyageField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Voyage d\'affaires', label: '💼 Voyage d\'affaires' },
    { value: 'Touristique', label: '🏖️ Touristique' },
    { value: 'Familial', label: '👨‍👩‍👧‍👦 Familial' },
    { value: 'Romantique', label: '💕 Romantique' },
    { value: 'Gastronomique', label: '🍽️ Gastronomique' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typeVoyage) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeVoyage', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de voyage</label>
      <Select
        name="typeVoyage"
        options={types}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le type de voyage..."
        isClearable
      />
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const VoyagesFields = (props) => {
  const { step, subCategory, articleType } = props;
  
  // Mapa de TODOS los componentes disponibles
  const customComponents = {
    // Campos comunes
    'title': <TitleField {...props} />,
    'description': <DescriptionField {...props} />,
    
    // Campos comunes para todos los viajes
    'destination': <DestinationField {...props} />,
    'duree': <DureeField {...props} />,
    'dateDepart': <DateDepartField {...props} />,
    'dateRetour': <DateRetourField {...props} />,
    'nombrePersonnes': <NombrePersonnesField {...props} />,
    'transport': <TransportField {...props} />,
    'hebergement': <HebergementField {...props} />,
    'activitesIncluses': <ActivitesInclusesField {...props} />,
    
    // Location vacances
    'typeHebergement': <TypeHebergementField {...props} />,
    'capacite': <CapaciteField {...props} />,
    'equipements': <EquipementsField {...props} />,
    'proximite': <ProximiteField {...props} />,
    
    // Hajj & Omra
    'typePelerinage': <TypePelerinageField {...props} />,
    'groupe': <GroupeField {...props} />,
    'hotelMakkah': <HotelMakkahField {...props} />,
    'hotelMadinah': <HotelMadinahField {...props} />,
    'vols': <VolsField {...props} />,
    
    // Séjour
    'typeSejour': <TypeSejourField {...props} />,
    'categorieHotel': <CategorieHotelField {...props} />,
    
    // Croisière
    'nomBateau': <NomBateauField {...props} />,
    'cabine': <CabineField {...props} />,
    
    // Réservations & Visa
    'compagnie': <CompagnieField {...props} />,
    'typeVoyage': <TypeVoyageField {...props} />
  };
  
  const additionalFields = {
    components: customComponents,
  };
  
  if (step) {
    return (
      <BaseCategoryField
        {...props}
        step={step}
        additionalFields={additionalFields}
      />
    );
  }
  
  return null;
};

export default VoyagesFields;