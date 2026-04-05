// 📂 components/CATEGORIES/specificFields/ServicesFields.js
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
        Description du service <span className="text-danger">*</span>
      </label>
      <textarea
        name="description"
        className="form-control"
        rows="5"
        placeholder="Décrivez votre service en détail..."
        value={postData?.description || ''}
        onChange={handleChangeInput}
        required
      />
      <small className="text-muted">Décrivez les prestations, les délais, la zone d'intervention, etc.</small>
    </div>
  );
};

// ============================================
// CAMPOS ESPECÍFICOS PARA SERVICES
// ============================================

// Type de service
const TypeServiceField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Construction', label: '🏗️ Construction' },
    { value: 'Rénovation', label: '🔨 Rénovation' },
    { value: 'Plomberie', label: '🚰 Plomberie' },
    { value: 'Électricité', label: '⚡ Électricité' },
    { value: 'Peinture', label: '🎨 Peinture' },
    { value: 'Carrelage', label: '🔲 Carrelage' },
    { value: 'Menuiserie', label: '🪚 Menuiserie' },
    { value: 'Jardinage', label: '🌿 Jardinage' },
    { value: 'Nettoyage', label: '🧹 Nettoyage' },
    { value: 'Cours particulier', label: '📚 Cours particulier' },
    { value: 'Traiteur', label: '🍽️ Traiteur' },
    { value: 'Photographie', label: '📷 Photographie' },
    { value: 'Informatique', label: '💻 Informatique' },
    { value: 'Autre', label: '📦 Autre' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typeService) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeService', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de service</label>
      <Select
        name="typeService"
        options={types}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le type de service..."
        required
      />
    </div>
  );
};

// Zone d'intervention
const ZoneInterventionField = ({ postData, handleChangeInput }) => {
  const zones = [
    { value: 'Alger Centre', label: '📍 Alger Centre' },
    { value: 'Alger Est', label: '📍 Alger Est' },
    { value: 'Alger Ouest', label: '📍 Alger Ouest' },
    { value: 'Toute l\'Algérie', label: '🇩🇿 Toute l\'Algérie' },
    { value: 'Régionale', label: '📍 Régionale' },
    { value: 'Locale', label: '📍 Locale' },
    { value: 'À domicile', label: '🏠 À domicile' },
    { value: 'En ligne', label: '💻 En ligne' }
  ];
  
  const selectedOption = zones.find(opt => opt.value === postData?.zoneIntervention) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'zoneIntervention', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Zone d'intervention</label>
      <Select
        name="zoneIntervention"
        options={zones}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la zone d'intervention..."
        isClearable
      />
    </div>
  );
};

// Durée du service
const DureeServiceField = ({ postData, handleChangeInput }) => {
  const durees = [
    { value: '1 heure', label: '1 heure' },
    { value: '2 heures', label: '2 heures' },
    { value: '3 heures', label: '3 heures' },
    { value: '4 heures', label: '4 heures' },
    { value: '1 journée', label: '1 journée' },
    { value: '2-3 jours', label: '2-3 jours' },
    { value: '1 semaine', label: '1 semaine' },
    { value: '2 semaines', label: '2 semaines' },
    { value: '1 mois', label: '1 mois' },
    { value: 'À discuter', label: '📅 À discuter' }
  ];
  
  const selectedOption = durees.find(opt => opt.value === postData?.dureeService) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'dureeService', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Durée du service</label>
      <Select
        name="dureeService"
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

// Disponibilité
const DisponibiliteServiceField = ({ postData, handleChangeInput }) => {
  const disponibilites = [
    { value: 'Immédiate', label: '⚡ Immédiate' },
    { value: '24h-48h', label: '📅 24h-48h' },
    { value: '1 semaine', label: '📅 1 semaine' },
    { value: '2 semaines', label: '📅 2 semaines' },
    { value: 'Sur rendez-vous', label: '📅 Sur rendez-vous' },
    { value: 'À discuter', label: '💬 À discuter' }
  ];
  
  const selectedOption = disponibilites.find(opt => opt.value === postData?.disponibiliteService) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'disponibiliteService', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Disponibilité</label>
      <Select
        name="disponibiliteService"
        options={disponibilites}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la disponibilité..."
        isClearable
      />
    </div>
  );
};

// Expérience (années)
const ExperienceField = ({ postData, handleChangeInput }) => {
  const experiences = [
    { value: 'Moins de 1 an', label: 'Moins de 1 an' },
    { value: '1-3 ans', label: '1-3 ans' },
    { value: '3-5 ans', label: '3-5 ans' },
    { value: '5-10 ans', label: '5-10 ans' },
    { value: 'Plus de 10 ans', label: 'Plus de 10 ans' }
  ];
  
  const selectedOption = experiences.find(opt => opt.value === postData?.experience) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'experience', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Expérience</label>
      <Select
        name="experience"
        options={experiences}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner l'expérience..."
        isClearable
      />
    </div>
  );
};

// Diplômes / Certifications
const DiplomesField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Diplômes / Certifications</label>
      <textarea
        name="diplomes"
        className="form-control"
        rows="2"
        placeholder="Listez vos diplômes et certifications..."
        value={postData?.diplomes || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Matériel utilisé
const MaterielUtiliseField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Matériel utilisé</label>
      <input
        type="text"
        name="materielUtilise"
        className="form-control"
        placeholder="Ex: Outillage professionnel, Matériel de marque..."
        value={postData?.materielUtilise || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Garantie du service
const GarantieServiceField = ({ postData, handleChangeInput }) => {
  const garanties = [
    { value: 'Aucune garantie', label: '❌ Aucune garantie' },
    { value: '1 mois', label: '✅ 1 mois' },
    { value: '3 mois', label: '✅ 3 mois' },
    { value: '6 mois', label: '✅ 6 mois' },
    { value: '1 an', label: '✅ 1 an' },
    { value: 'Satisfait ou remboursé', label: '🔄 Satisfait ou remboursé' }
  ];
  
  const selectedOption = garanties.find(opt => opt.value === postData?.garantieService) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'garantieService', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Garantie du service</label>
      <Select
        name="garantieService"
        options={garanties}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la garantie..."
        isClearable
      />
    </div>
  );
};

// Références / Portfolio
const ReferencesField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Références / Portfolio</label>
      <textarea
        name="references"
        className="form-control"
        rows="2"
        placeholder="Décrivez vos réalisations, projets précédents..."
        value={postData?.references || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Langues parlées
const LanguesField = ({ postData, handleChangeInput }) => {
  const langues = [
    { value: 'Arabe', label: '🇩🇿 Arabe' },
    { value: 'Français', label: '🇫🇷 Français' },
    { value: 'Anglais', label: '🇬🇧 Anglais' },
    { value: 'Espagnol', label: '🇪🇸 Espagnol' },
    { value: 'Allemand', label: '🇩🇪 Allemand' },
    { value: 'Italien', label: '🇮🇹 Italien' },
    { value: 'Turc', label: '🇹🇷 Turc' }
  ];
  
  const selectedValues = postData?.langues || [];
  const selectedOptions = langues.filter(opt => selectedValues.includes(opt.value));
  
  const handleChange = (selected) => {
    const values = selected ? selected.map(opt => opt.value) : [];
    handleChangeInput({
      target: { name: 'langues', value: values }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Langues parlées</label>
      <Select
        isMulti
        name="langues"
        options={langues}
        value={selectedOptions}
        onChange={handleChange}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Sélectionner les langues..."
      />
      <small className="text-muted">Vous pouvez sélectionner plusieurs langues</small>
    </div>
  );
};

// Horaires
const HorairesField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Horaires</label>
      <input
        type="text"
        name="horaires"
        className="form-control"
        placeholder="Ex: 9h-18h, Flexible, Sur rendez-vous..."
        value={postData?.horaires || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Moyens de paiement acceptés
const MoyensPaiementField = ({ postData, handleChangeInput }) => {
  const moyens = [
    { value: 'Espèces', label: '💰 Espèces' },
    { value: 'Virement bancaire', label: '🏦 Virement bancaire' },
    { value: 'CPL', label: '📱 CPL' },
    { value: 'Chèque', label: '📝 Chèque' },
    { value: 'Carte bancaire', label: '💳 Carte bancaire' },
    { value: 'PayPal', label: '🌐 PayPal' }
  ];
  
  const selectedValues = postData?.moyensPaiement || [];
  const selectedOptions = moyens.filter(opt => selectedValues.includes(opt.value));
  
  const handleChange = (selected) => {
    const values = selected ? selected.map(opt => opt.value) : [];
    handleChangeInput({
      target: { name: 'moyensPaiement', value: values }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Moyens de paiement acceptés</label>
      <Select
        isMulti
        name="moyensPaiement"
        options={moyens}
        value={selectedOptions}
        onChange={handleChange}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Sélectionner les moyens de paiement..."
      />
    </div>
  );
};

// Tarif (prix du service)
const TarifField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Tarif</label>
      <div className="input-group">
        <input
          type="number"
          name="tarif"
          className="form-control"
          placeholder="Tarif"
          value={postData?.tarif || ''}
          onChange={handleChangeInput}
        />
        <select
          name="uniteTarif"
          className="form-select"
          value={postData?.uniteTarif || 'prestation'}
          onChange={handleChangeInput}
          style={{ width: '120px' }}
        >
          <option value="prestation">/ prestation</option>
          <option value="heure">/ heure</option>
          <option value="jour">/ jour</option>
          <option value="mois">/ mois</option>
          <option value="m2">/ m²</option>
          <option value="personne">/ personne</option>
        </select>
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const ServicesFields = (props) => {
  const { step, subCategory, articleType } = props;
  
  // Mapa de TODOS los componentes disponibles
  const customComponents = {
    // Campos comunes
    'title': <TitleField {...props} />,
    'description': <DescriptionField {...props} />,
    
    // Campos específicos para servicios
    'typeService': <TypeServiceField {...props} />,
    'zoneIntervention': <ZoneInterventionField {...props} />,
    'dureeService': <DureeServiceField {...props} />,
    'disponibiliteService': <DisponibiliteServiceField {...props} />,
    'experience': <ExperienceField {...props} />,
    'diplomes': <DiplomesField {...props} />,
    'materielUtilise': <MaterielUtiliseField {...props} />,
    'garantieService': <GarantieServiceField {...props} />,
    'references': <ReferencesField {...props} />,
    'langues': <LanguesField {...props} />,
    'horaires': <HorairesField {...props} />,
    'moyensPaiement': <MoyensPaiementField {...props} />,
    'tarif': <TarifField {...props} />
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

export default ServicesFields;