// 📂 components/CATEGORIES/specificFields/MateriauxField.js
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
        placeholder="Décrivez votre produit en détail..."
        value={postData?.description || ''}
        onChange={handleChangeInput}
        required
      />
      <small className="text-muted">Décrivez les caractéristiques techniques, l'état, etc.</small>
    </div>
  );
};

// ============================================
// CAMPOS ESPECÍFICOS PARA MATÉRIAUX & ÉQUIPEMENT
// ============================================

// Marque
const MarqueField = ({ postData, handleChangeInput }) => {
  const marques = [
    { value: 'Bosch', label: 'Bosch' },
    { value: 'Makita', label: 'Makita' },
    { value: 'Dewalt', label: 'Dewalt' },
    { value: 'Black+Decker', label: 'Black+Decker' },
    { value: 'Stanley', label: 'Stanley' },
    { value: 'Facom', label: 'Facom' },
    { value: 'Einhell', label: 'Einhell' },
    { value: 'Ryobi', label: 'Ryobi' },
    { value: 'Milwaukee', label: 'Milwaukee' },
    { value: 'Hilti', label: 'Hilti' },
    { value: 'Metabo', label: 'Metabo' },
    { value: 'Hitachi', label: 'Hitachi' },
    { value: 'Caterpillar', label: 'Caterpillar' },
    { value: 'JCB', label: 'JCB' },
    { value: 'John Deere', label: 'John Deere' },
    { value: 'Lafarge', label: 'Lafarge' },
    { value: 'Holcim', label: 'Holcim' },
    { value: 'Leroy Merlin', label: 'Leroy Merlin' },
    { value: 'Castorama', label: 'Castorama' },
    { value: 'Autre', label: 'Autre' }
  ];
  
  const selectedOption = marques.find(opt => opt.value === postData?.marque) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'marque', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Marque</label>
      <Select
        name="marque"
        options={marques}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la marque..."
        isClearable
      />
    </div>
  );
};

// Modèle / Référence
const ModeleField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Modèle / Référence</label>
      <input
        type="text"
        name="modele"
        className="form-control"
        placeholder="Ex: GSB 1200, DCD796, F300..."
        value={postData?.modele || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// État
const EtatField = ({ postData, handleChangeInput }) => {
  const etatOptions = [
    { value: 'Neuf (emballé)', label: '🆕 Neuf (emballé)' },
    { value: 'Neuf (sans emballage)', label: '📦 Neuf (sans emballage)' },
    { value: 'Comme neuf', label: '✨ Comme neuf' },
    { value: 'Très bon état', label: '💪 Très bon état' },
    { value: 'Bon état', label: '✅ Bon état' },
    { value: 'État moyen', label: '⚠️ État moyen' },
    { value: 'À réviser', label: '🔧 À réviser' },
    { value: 'Pour pièces', label: '⚙️ Pour pièces' }
  ];
  
  const selectedOption = etatOptions.find(opt => opt.value === postData?.etat) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'etat', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">État</label>
      <Select
        name="etat"
        options={etatOptions}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner l'état..."
        required
      />
    </div>
  );
};

// Garantie
const GarantieField = ({ postData, handleChangeInput }) => {
  const garantieOptions = [
    { value: '3 mois', label: '3 mois' },
    { value: '6 mois', label: '6 mois' },
    { value: '1 an', label: '1 an' },
    { value: '2 ans', label: '2 ans' },
    { value: '3 ans', label: '3 ans' },
    { value: 'Sans garantie', label: 'Sans garantie' }
  ];
  
  const selectedOption = garantieOptions.find(opt => opt.value === postData?.garantie) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'garantie', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Garantie</label>
      <Select
        name="garantie"
        options={garantieOptions}
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

// ============================================
// CAMPOS PARA MATÉRIEL PROFESSIONNEL
// ============================================

// Type de matériel
const TypeMaterielField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Matériel BTP', label: '🏗️ Matériel BTP' },
    { value: 'Matériel de chantier', label: '🚧 Matériel de chantier' },
    { value: 'Matériel industriel', label: '🏭 Matériel industriel' },
    { value: 'Matériel de manutention', label: '📦 Matériel de manutention' },
    { value: 'Matériel de levage', label: '🏗️ Matériel de levage' },
    { value: 'Matériel de nettoyage', label: '🧹 Matériel de nettoyage' },
    { value: 'Matériel de soudure', label: '⚡ Matériel de soudure' },
    { value: 'Matériel de menuiserie', label: '🪚 Matériel de menuiserie' },
    { value: 'Matériel de plomberie', label: '🔧 Matériel de plomberie' },
    { value: 'Matériel d\'électricité', label: '⚡ Matériel d\'électricité' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typeMateriel) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeMateriel', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de matériel</label>
      <Select
        name="typeMateriel"
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

// Puissance
const PuissanceField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Puissance</label>
      <div className="input-group">
        <input
          type="number"
          name="puissance"
          className="form-control"
          placeholder="Puissance"
          value={postData?.puissance || ''}
          onChange={handleChangeInput}
        />
        <span className="input-group-text">Watts / CV</span>
      </div>
    </div>
  );
};

// Tension / Voltage
const TensionField = ({ postData, handleChangeInput }) => {
  const tensions = [
    { value: '12V', label: '12V' },
    { value: '24V', label: '24V' },
    { value: '220V', label: '220V' },
    { value: '380V (triphasé)', label: '380V (triphasé)' },
    { value: 'Sans fil (batterie)', label: '🔋 Sans fil (batterie)' },
    { value: 'Pneumatique', label: '💨 Pneumatique' },
    { value: 'Thermique', label: '🔥 Thermique' }
  ];
  
  const selectedOption = tensions.find(opt => opt.value === postData?.tension) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'tension', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Tension / Voltage</label>
      <Select
        name="tension"
        options={tensions}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner la tension..."
        isClearable
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA OUTILLAGE PROFESSIONNEL
// ============================================

// Type d'outil
const TypeOutilField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Perceuse', label: '🔨 Perceuse' },
    { value: 'Visseuse', label: '🔧 Visseuse' },
    { value: 'Perforateur', label: '⚡ Perforateur' },
    { value: 'Scie circulaire', label: '🪚 Scie circulaire' },
    { value: 'Scie sauteuse', label: '🪚 Scie sauteuse' },
    { value: 'Meuleuse', label: '⚙️ Meuleuse' },
    { value: 'Ponceuse', label: '🔨 Ponceuse' },
    { value: 'Défonceuse', label: '🔧 Défonceuse' },
    { value: 'Rabot', label: '🪚 Rabot' },
    { value: 'Aspirateur chantier', label: '🧹 Aspirateur chantier' },
    { value: 'Nettoyeur haute pression', label: '💦 Nettoyeur haute pression' },
    { value: 'Compresseur', label: '💨 Compresseur' },
    { value: 'Pistolet à peinture', label: '🎨 Pistolet à peinture' },
    { value: 'Poste à souder', label: '⚡ Poste à souder' },
    { value: 'Multimètre', label: '📊 Multimètre' },
    { value: 'Coffret à outils', label: '🧰 Coffret à outils' },
    { value: 'Lot d\'outillage', label: '📦 Lot d\'outillage' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typeOutil) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeOutil', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type d'outil</label>
      <Select
        name="typeOutil"
        options={types}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le type d'outil..."
        isClearable
      />
    </div>
  );
};

// Diamètre / Taille
const DiametreField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Diamètre / Taille</label>
      <div className="input-group">
        <input
          type="number"
          name="diametre"
          className="form-control"
          placeholder="Diamètre"
          value={postData?.diametre || ''}
          onChange={handleChangeInput}
        />
        <span className="input-group-text">mm</span>
      </div>
    </div>
  );
};

// Nombre de vitesses
const NbVitessesField = ({ postData, handleChangeInput }) => {
  const vitesses = [
    { value: '1', label: '1 vitesse' },
    { value: '2', label: '2 vitesses' },
    { value: '3', label: '3 vitesses' },
    { value: '4', label: '4 vitesses' },
    { value: 'Variable', label: 'Variable' }
  ];
  
  const selectedOption = vitesses.find(opt => opt.value === postData?.nbVitesses) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'nbVitesses', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Nombre de vitesses</label>
      <Select
        name="nbVitesses"
        options={vitesses}
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
// CAMPOS PARA MATÉRIAUX DE CONSTRUCTION
// ============================================

// Type de matériau
const TypeMateriauConstructionField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Ciment', label: '🏗️ Ciment' },
    { value: 'Sable', label: '🏖️ Sable' },
    { value: 'Gravier', label: '🪨 Gravier' },
    { value: 'Parpaing', label: '🧱 Parpaing' },
    { value: 'Brique', label: '🧱 Brique' },
    { value: 'Carreau de plâtre', label: '🔲 Carreau de plâtre' },
    { value: 'Plâtre', label: '⚪ Plâtre' },
    { value: 'Enduit', label: '🎨 Enduit' },
    { value: 'Peinture', label: '🎨 Peinture' },
    { value: 'Carrelage', label: '🔲 Carrelage' },
    { value: 'Parquet', label: '🪵 Parquet' },
    { value: 'Stratifié', label: '📋 Stratifié' },
    { value: 'Bois', label: '🪵 Bois' },
    { value: 'Acier', label: '⚙️ Acier' },
    { value: 'Aluminium', label: '🥤 Aluminium' },
    { value: 'PVC', label: '🔵 PVC' },
    { value: 'Isolant', label: '🧣 Isolant' },
    { value: 'Tuile', label: '🏠 Tuile' },
    { value: 'Ardoise', label: '🪨 Ardoise' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typeMateriauConstruction) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeMateriauConstruction', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de matériau</label>
      <Select
        name="typeMateriauConstruction"
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

// Quantité
const QuantiteField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Quantité</label>
      <div className="input-group">
        <input
          type="number"
          name="quantite"
          className="form-control"
          placeholder="Quantité"
          value={postData?.quantite || ''}
          onChange={handleChangeInput}
        />
        <span className="input-group-text">unités</span>
      </div>
    </div>
  );
};

// Unité de mesure
const UniteMesureField = ({ postData, handleChangeInput }) => {
  const unites = [
    { value: 'mètre', label: 'mètre (m)' },
    { value: 'mètre carré', label: 'mètre carré (m²)' },
    { value: 'mètre cube', label: 'mètre cube (m³)' },
    { value: 'kilogramme', label: 'kilogramme (kg)' },
    { value: 'tonne', label: 'tonne (t)' },
    { value: 'litre', label: 'litre (L)' },
    { value: 'sac', label: 'sac' },
    { value: 'palette', label: 'palette' },
    { value: 'rouleau', label: 'rouleau' }
  ];
  
  const selectedOption = unites.find(opt => opt.value === postData?.uniteMesure) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'uniteMesure', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Unité de mesure</label>
      <Select
        name="uniteMesure"
        options={unites}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner l'unité..."
        isClearable
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA MATIÈRES PREMIÈRES
// ============================================

// Type de matière première
const TypeMatierePremiereField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Métal', label: '⚙️ Métal' },
    { value: 'Plastique', label: '🧴 Plastique' },
    { value: 'Bois', label: '🪵 Bois' },
    { value: 'Textile', label: '🧵 Textile' },
    { value: 'Cuir', label: '👞 Cuir' },
    { value: 'Caoutchouc', label: '⚫ Caoutchouc' },
    { value: 'Verre', label: '🥛 Verre' },
    { value: 'Papier', label: '📄 Papier' },
    { value: 'Carton', label: '📦 Carton' },
    { value: 'Chimique', label: '🧪 Chimique' },
    { value: 'Alimentaire', label: '🍎 Alimentaire' },
    { value: 'Pharmaceutique', label: '💊 Pharmaceutique' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typeMatierePremiere) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeMatierePremiere', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de matière première</label>
      <Select
        name="typeMatierePremiere"
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

// Pureté / Concentration
const PureteField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Pureté / Concentration</label>
      <div className="input-group">
        <input
          type="number"
          name="purete"
          className="form-control"
          placeholder="Pureté"
          value={postData?.purete || ''}
          onChange={handleChangeInput}
          step="0.1"
        />
        <span className="input-group-text">%</span>
      </div>
    </div>
  );
};

// ============================================
// CAMPOS PARA PRODUITS D'HYGIÈNE
// ============================================

// Type de produit d'hygiène
const TypeHygieneField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Désinfectant', label: '🧴 Désinfectant' },
    { value: 'Détergent', label: '🧼 Détergent' },
    { value: 'Savon liquide', label: '🧼 Savon liquide' },
    { value: 'Gel hydroalcoolique', label: '🧴 Gel hydroalcoolique' },
    { value: 'Papier toilette', label: '🧻 Papier toilette' },
    { value: 'Essuie-tout', label: '📄 Essuie-tout' },
    { value: 'Mouchoirs', label: '🤧 Mouchoirs' },
    { value: 'Produit nettoyant', label: '🧹 Produit nettoyant' },
    { value: 'Lessive', label: '🧺 Lessive' },
    { value: 'Adoucissant', label: '🌸 Adoucissant' },
    { value: 'Produit vaisselle', label: '🍽️ Produit vaisselle' },
    { value: 'Balai', label: '🧹 Balai' },
    { value: 'Serpillière', label: '🧽 Serpillière' },
    { value: 'Seau', label: '🪣 Seau' },
    { value: 'Gants ménagers', label: '🧤 Gants ménagers' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typeHygiene) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeHygiene', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de produit</label>
      <Select
        name="typeHygiene"
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

// Volume
const VolumeField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Volume</label>
      <div className="input-group">
        <input
          type="number"
          name="volume"
          className="form-control"
          placeholder="Volume"
          value={postData?.volume || ''}
          onChange={handleChangeInput}
        />
        <span className="input-group-text">litres</span>
      </div>
    </div>
  );
};

// ============================================
// CAMPOS PARA MATÉRIEL AGRICOLE
// ============================================

// Type de matériel agricole
const TypeAgricoleField = ({ postData, handleChangeInput }) => {
  const types = [
    { value: 'Tracteur', label: '🚜 Tracteur' },
    { value: 'Moissonneuse', label: '🌾 Moissonneuse' },
    { value: 'Labour', label: '🪚 Labour' },
    { value: 'Herse', label: '🔧 Herse' },
    { value: 'Semoir', label: '🌱 Semoir' },
    { value: 'Pulvérisateur', label: '💦 Pulvérisateur' },
    { value: 'Faucheuse', label: '✂️ Faucheuse' },
    { value: 'Presse à balles', label: '📦 Presse à balles' },
    { value: 'Remorque agricole', label: '🚛 Remorque agricole' },
    { value: 'Matériel d\'irrigation', label: '💧 Matériel d\'irrigation' },
    { value: 'Matériel d\'élevage', label: '🐄 Matériel d\'élevage' },
    { value: 'Outils agricoles', label: '🔧 Outils agricoles' },
    { value: 'Pièces agricoles', label: '⚙️ Pièces agricoles' }
  ];
  
  const selectedOption = types.find(opt => opt.value === postData?.typeAgricole) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeAgricole', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de matériel</label>
      <Select
        name="typeAgricole"
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

// Année (pour tracteurs)
const AnneeField = ({ postData, handleChangeInput }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => ({ value: (currentYear - i).toString(), label: (currentYear - i).toString() }));
  
  const selectedOption = years.find(opt => opt.value === postData?.annee) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'annee', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Année de fabrication</label>
      <Select
        name="annee"
        options={years}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner l'année..."
        isClearable
      />
    </div>
  );
};

// Heures de fonctionnement
const HeuresField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Heures de fonctionnement</label>
      <div className="input-group">
        <input
          type="number"
          name="heures"
          className="form-control"
          placeholder="Heures"
          value={postData?.heures || ''}
          onChange={handleChangeInput}
        />
        <span className="input-group-text">heures</span>
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const MateriauxField = (props) => {
  const { step, subCategory, articleType } = props;
  
  // Mapa de TODOS los componentes disponibles
  const customComponents = {
    // Campos comunes
    'title': <TitleField {...props} />,
    'description': <DescriptionField {...props} />,
    
    // Campos específicos para matériaux
    'marque': <MarqueField {...props} />,
    'modele': <ModeleField {...props} />,
    'etat': <EtatField {...props} />,
    'garantie': <GarantieField {...props} />,
    
    // Matériel professionnel
    'typeMateriel': <TypeMaterielField {...props} />,
    'puissance': <PuissanceField {...props} />,
    'tension': <TensionField {...props} />,
    
    // Outillage professionnel
    'typeOutil': <TypeOutilField {...props} />,
    'diametre': <DiametreField {...props} />,
    'nbVitesses': <NbVitessesField {...props} />,
    
    // Matériaux de construction
    'typeMateriauConstruction': <TypeMateriauConstructionField {...props} />,
    'quantite': <QuantiteField {...props} />,
    'uniteMesure': <UniteMesureField {...props} />,
    
    // Matières premières
    'typeMatierePremiere': <TypeMatierePremiereField {...props} />,
    'purete': <PureteField {...props} />,
    
    // Produits d'hygiène
    'typeHygiene': <TypeHygieneField {...props} />,
    'volume': <VolumeField {...props} />,
    
    // Matériel agricole
    'typeAgricole': <TypeAgricoleField {...props} />,
    'annee': <AnneeField {...props} />,
    'heures': <HeuresField {...props} />
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

export default MateriauxField;