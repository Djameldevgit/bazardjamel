// 📂 components/CATEGORIES/specificFields/ElectromenagerField.js
import React from 'react';
import BaseCategoryField from './BaseCategoryField';

// ============================================
// CAMPOS ESPECÍFICOS DE ÉLECTROMÉNAGER (STEP 2)
// ============================================

// Marque
const MarqueField = ({ postData, handleChangeInput }) => {
  const marques = [
    'Samsung', 'LG', 'Sony', 'Panasonic', 'Philips', 'Toshiba', 'Hisense',
    'TCL', 'Xiaomi', 'Apple', 'Beko', 'Whirlpool', 'Bosch', 'Siemens',
    'Electrolux', 'Brandt', 'Candy', 'Indesit', 'Miele', 'Rowenta',
    'Tefal', 'Krups', 'Moulinex', 'Delonghi', 'Philips', 'Braun',
    'Dyson', 'Vorwerk', 'Midea', 'Haier', 'Autre'
  ];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Marque</label>
      <select
        name="marque"
        className="form-control"
        value={postData?.marque || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner la marque</option>
        {marques.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>
  );
};

// Modèle
const ModeleField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Modèle</label>
      <input
        type="text"
        name="modele"
        className="form-control"
        placeholder="Ex: UE55CU8000, F4J5TM0W..."
        value={postData?.modele || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// État
const EtatField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">État</label>
      <select
        name="etat"
        className="form-control"
        value={postData?.etat || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Neuf jamais utilisé">Neuf jamais utilisé</option>
        <option value="État neuf">État neuf</option>
        <option value="Comme neuf">Comme neuf</option>
        <option value="Très bon état">Très bon état</option>
        <option value="Bon état">Bon état</option>
        <option value="État moyen">État moyen</option>
        <option value="À réviser">À réviser</option>
        <option value="Pour pièces détachées">Pour pièces détachées</option>
      </select>
    </div>
  );
};

// Garantie
const GarantieField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Garantie</label>
      <input
        type="text"
        name="garantie"
        className="form-control"
        placeholder="Ex: 6 mois, 1 an, 2 ans..."
        value={postData?.garantie || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA TV & MULTIMÉDIA
// ============================================

// Taille écran (TV)
const TailleEcranTVField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Taille écran</label>
      <div className="input-group">
        <input
          type="number"
          name="taille_ecran"
          className="form-control"
          placeholder="Taille"
          value={postData?.taille_ecran || ''}
          onChange={handleChangeInput}
        />
        <span className="input-group-text">pouces</span>
      </div>
    </div>
  );
};

// Résolution (TV)
const ResolutionField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Résolution</label>
      <select
        name="resolution"
        className="form-control"
        value={postData?.resolution || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="HD Ready">HD Ready (720p)</option>
        <option value="Full HD">Full HD (1080p)</option>
        <option value="4K Ultra HD">4K Ultra HD</option>
        <option value="8K Ultra HD">8K Ultra HD</option>
      </select>
    </div>
  );
};

// Smart TV
const SmartTVField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Smart TV</label>
      <select
        name="smart_tv"
        className="form-control"
        value={postData?.smart_tv || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="oui">Oui</option>
        <option value="non">Non</option>
      </select>
    </div>
  );
};

// Type de TV (OLED, QLED, etc.)
const TypeTVField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type d'écran</label>
      <select
        name="type_tv"
        className="form-control"
        value={postData?.type_tv || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="LED">LED</option>
        <option value="OLED">OLED</option>
        <option value="QLED">QLED</option>
        <option value="Neo QLED">Neo QLED</option>
        <option value="Plasma">Plasma</option>
        <option value="LCD">LCD</option>
      </select>
    </div>
  );
};

// ============================================
// CAMPOS POUR RÉFRIGÉRATEURS & CONGÉLATEURS
// ============================================

// Capacité
const CapaciteField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Capacité</label>
      <div className="input-group">
        <input
          type="number"
          name="capacite"
          className="form-control"
          placeholder="Capacité"
          value={postData?.capacite || ''}
          onChange={handleChangeInput}
        />
        <span className="input-group-text">litres</span>
      </div>
    </div>
  );
};

// Classe énergétique
const ClasseEnergetiqueField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Classe énergétique</label>
      <select
        name="classe_energetique"
        className="form-control"
        value={postData?.classe_energetique || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="A+++">A+++</option>
        <option value="A++">A++</option>
        <option value="A+">A+</option>
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
      </select>
    </div>
  );
};

// Type de réfrigérateur
const TypeRefrigerateurField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type</label>
      <select
        name="type_refrigerateur"
        className="form-control"
        value={postData?.type_refrigerateur || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Congélateur">Congélateur</option>
        <option value="Réfrigérateur">Réfrigérateur</option>
        <option value="Réfrigérateur congélateur">Réfrigérateur congélateur</option>
        <option value="Réfrigérateur américain">Réfrigérateur américain</option>
        <option value="Mini réfrigérateur">Mini réfrigérateur</option>
        <option value="Cave à vin">Cave à vin</option>
      </select>
    </div>
  );
};

// ============================================
// CAMPOS POUR MACHINES À LAVER & LAVE-VAISSELLE
// ============================================

// Capacité (kg)
const CapaciteKgField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Capacité</label>
      <div className="input-group">
        <input
          type="number"
          name="capacite_kg"
          className="form-control"
          placeholder="Capacité"
          value={postData?.capacite_kg || ''}
          onChange={handleChangeInput}
          step="0.5"
        />
        <span className="input-group-text">kg</span>
      </div>
    </div>
  );
};

// Vitesse d'essorage
const VitesseEssorageField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Vitesse d'essorage</label>
      <div className="input-group">
        <input
          type="number"
          name="vitesse_essorage"
          className="form-control"
          placeholder="Vitesse"
          value={postData?.vitesse_essorage || ''}
          onChange={handleChangeInput}
        />
        <span className="input-group-text">tr/min</span>
      </div>
    </div>
  );
};

// Type de machine
const TypeMachineField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type</label>
      <select
        name="type_machine"
        className="form-control"
        value={postData?.type_machine || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Lavage frontal">Lavage frontal</option>
        <option value="Lavage par le haut">Lavage par le haut</option>
        <option value="Séchant intégré">Séchant intégré</option>
        <option value="Lave-linge séchant">Lave-linge séchant</option>
      </select>
    </div>
  );
};

// ============================================
// CAMPOS POUR FOURS & CUISSON
// ============================================

// Type de four
const TypeFourField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de four</label>
      <select
        name="type_four"
        className="form-control"
        value={postData?.type_four || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Gaz">Gaz</option>
        <option value="Électrique">Électrique</option>
        <option value="Micro-ondes">Micro-ondes</option>
        <option value="Four combiné">Four combiné</option>
        <option value="Friteuse sans huile">Friteuse sans huile</option>
        <option value="Four à pizza">Four à pizza</option>
      </select>
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
        <span className="input-group-text">Watts</span>
      </div>
    </div>
  );
};

// ============================================
// CAMPOS POUR AUDIO & ACCESSOIRES
// ============================================

// Type d'audio
const TypeAudioField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type d'appareil</label>
      <select
        name="type_audio"
        className="form-control"
        value={postData?.type_audio || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Casque audio">Casque audio</option>
        <option value="Écouteurs">Écouteurs</option>
        <option value="Enceinte Bluetooth">Enceinte Bluetooth</option>
        <option value="Barre de son">Barre de son</option>
        <option value="Home Cinéma">Home Cinéma</option>
        <option value="Amplificateur">Amplificateur</option>
        <option value="Chaîne Hi-Fi">Chaîne Hi-Fi</option>
      </select>
    </div>
  );
};

// ============================================
// CAMPOS POUR IPTV & PARABOLES
// ============================================

// Type d'abonnement IPTV
const TypeAbonnementField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type d'abonnement</label>
      <select
        name="type_abonnement"
        className="form-control"
        value={postData?.type_abonnement || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Mensuel">Mensuel</option>
        <option value="Trimestriel">Trimestriel</option>
        <option value="Semestriel">Semestriel</option>
        <option value="Annuel">Annuel</option>
        <option value="À vie">À vie</option>
      </select>
    </div>
  );
};

// Durée d'abonnement
const DureeAbonnementField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Durée d'abonnement</label>
      <input
        type="text"
        name="duree_abonnement"
        className="form-control"
        placeholder="Ex: 6 mois, 1 an, 2 ans..."
        value={postData?.duree_abonnement || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const ElectromenagerField = (props) => {
  const { step } = props;
  
  const customComponents = {
    // Campos comunes
    'marque': <MarqueField {...props} />,
    'modele': <ModeleField {...props} />,
    'etat': <EtatField {...props} />,
    'garantie': <GarantieField {...props} />,
    
    // TV & Multimédia
    'taille_ecran': <TailleEcranTVField {...props} />,
    'resolution': <ResolutionField {...props} />,
    'smart_tv': <SmartTVField {...props} />,
    'type_tv': <TypeTVField {...props} />,
    
    // Réfrigérateurs
    'capacite': <CapaciteField {...props} />,
    'classe_energetique': <ClasseEnergetiqueField {...props} />,
    'type_refrigerateur': <TypeRefrigerateurField {...props} />,
    
    // Machines à laver
    'capacite_kg': <CapaciteKgField {...props} />,
    'vitesse_essorage': <VitesseEssorageField {...props} />,
    'type_machine': <TypeMachineField {...props} />,
    
    // Fours
    'type_four': <TypeFourField {...props} />,
    'puissance': <PuissanceField {...props} />,
    
    // Audio
    'type_audio': <TypeAudioField {...props} />,
    
    // IPTV
    'type_abonnement': <TypeAbonnementField {...props} />,
    'duree_abonnement': <DureeAbonnementField {...props} />
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

export default ElectromenagerField;