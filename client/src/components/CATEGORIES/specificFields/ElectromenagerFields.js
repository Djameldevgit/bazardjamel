// 📂 components/CATEGORIES/specificFields/ElectromenagerField.js
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
      <label className="form-label fw-bold">Description</label>
      <textarea
        name="description"
        className="form-control"
        rows="4"
        placeholder="Décrivez votre article..."
        value={postData?.description || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Marque
const MarqueField = ({ postData, handleChangeInput }) => {
  const marques = [
    'Samsung', 'LG', 'Sony', 'Panasonic', 'Philips', 'Toshiba', 'Hisense',
    'TCL', 'Xiaomi', 'Apple', 'Beko', 'Whirlpool', 'Bosch', 'Siemens',
    'Electrolux', 'Brandt', 'Candy', 'Indesit', 'Miele', 'Rowenta',
    'Tefal', 'Krups', 'Moulinex', 'Delonghi', 'Braun', 'Dyson',
    'Vorwerk', 'Midea', 'Haier', 'Autre'
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
        <option value="">Sélectionner l'état</option>
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
const TailleEcranField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Taille d'écran</label>
      <div className="input-group">
        <input
          type="number"
          name="tailleEcran"
          className="form-control"
          placeholder="Taille"
          value={postData?.tailleEcran || ''}
          onChange={handleChangeInput}
        />
        <span className="input-group-text">pouces</span>
      </div>
    </div>
  );
};

// Résolution
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
const SmartTvField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Smart TV</label>
      <select
        name="smartTv"
        className="form-control"
        value={postData?.smartTv || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="oui">Oui</option>
        <option value="non">Non</option>
      </select>
    </div>
  );
};

// Type de TV
const TypeTvField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type d'écran</label>
      <select
        name="typeTv"
        className="form-control"
        value={postData?.typeTv || ''}
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

// Capacité (litres)
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
        name="classeEnergetique"
        className="form-control"
        value={postData?.classeEnergetique || ''}
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
        name="typeRefrigerateur"
        className="form-control"
        value={postData?.typeRefrigerateur || ''}
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
          name="capaciteKg"
          className="form-control"
          placeholder="Capacité"
          value={postData?.capaciteKg || ''}
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
          name="vitesseEssorage"
          className="form-control"
          placeholder="Vitesse"
          value={postData?.vitesseEssorage || ''}
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
        name="typeMachine"
        className="form-control"
        value={postData?.typeMachine || ''}
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
        name="typeFour"
        className="form-control"
        value={postData?.typeFour || ''}
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
// CAMPOS POUR AUDIO
// ============================================

// Type d'audio
const TypeAudioField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type d'appareil</label>
      <select
        name="typeAudio"
        className="form-control"
        value={postData?.typeAudio || ''}
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
// CAMPOS ADICIONALES FALTANTES
// ============================================

// Type d'appareil (pour appareils cuisine)
const TypeAppareilField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type d'appareil</label>
      <select
        name="typeAppareil"
        className="form-control"
        value={postData?.typeAppareil || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Robot de cuisine">Robot de cuisine</option>
        <option value="Mixeur">Mixeur</option>
        <option value="Blender">Blender</option>
        <option value="Extracteur de jus">Extracteur de jus</option>
        <option value="Grille-pain">Grille-pain</option>
        <option value="Bouilloire">Bouilloire</option>
        <option value="Cafetière">Cafetière</option>
      </select>
    </div>
  );
};

// Type d'aspirateur
const TypeAspirateurField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type d'aspirateur</label>
      <select
        name="typeAspirateur"
        className="form-control"
        value={postData?.typeAspirateur || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Traîneau">Traîneau</option>
        <option value="Balai">Balai</option>
        <option value="Robot">Robot</option>
        <option value="Centralisé">Centralisé</option>
        <option value="À main">À main</option>
      </select>
    </div>
  );
};

// Type de fer à repasser
const TypeFerField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de fer</label>
      <select
        name="typeFer"
        className="form-control"
        value={postData?.typeFer || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Fer à repasser classique">Fer à repasser classique</option>
        <option value="Fer vapeur">Fer vapeur</option>
        <option value="Centrale vapeur">Centrale vapeur</option>
        <option value="Défroisseur vapeur">Défroisseur vapeur</option>
      </select>
    </div>
  );
};

// Compatibilité (télécommandes)
const CompatibiliteField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Compatibilité</label>
      <input
        type="text"
        name="compatibilite"
        className="form-control"
        placeholder="Ex: Samsung TV, Universal, etc."
        value={postData?.compatibilite || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Type (sécurité/GPS)
const TypeSecuriteField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type</label>
      <select
        name="type"
        className="form-control"
        value={postData?.type || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Caméra de surveillance">Caméra de surveillance</option>
        <option value="Kit alarme">Kit alarme</option>
        <option value="Détecteur de mouvement">Détecteur de mouvement</option>
        <option value="GPS voiture">GPS voiture</option>
        <option value="GPS moto">GPS moto</option>
        <option value="Traceur GPS">Traceur GPS</option>
      </select>
    </div>
  );
};

// Type de machine à coudre
const TypeMachineCoudreField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de machine</label>
      <select
        name="typeMachine"
        className="form-control"
        value={postData?.typeMachine || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Mécanique">Mécanique</option>
        <option value="Électronique">Électronique</option>
        <option value="Informatique">Informatique</option>
        <option value="Surjeteuse">Surjeteuse</option>
        <option value="Recouvreuse">Recouvreuse</option>
      </select>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL INTELIGENTE
// ============================================

const ElectromenagerField = (props) => {
  const { step, subCategory, articleType } = props;
  
  // Mapa de TODOS los componentes disponibles
  const customComponents = {
    // Campos comunes
    'title': <TitleField {...props} />,
    'description': <DescriptionField {...props} />,
    'marque': <MarqueField {...props} />,
    'modele': <ModeleField {...props} />,
    'etat': <EtatField {...props} />,
    'garantie': <GarantieField {...props} />,
    
    // TV & Multimédia
    'tailleEcran': <TailleEcranField {...props} />,
    'resolution': <ResolutionField {...props} />,
    'smartTv': <SmartTvField {...props} />,
    'typeTv': <TypeTvField {...props} />,
    
    // Réfrigérateurs
    'capacite': <CapaciteField {...props} />,
    'classeEnergetique': <ClasseEnergetiqueField {...props} />,
    'typeRefrigerateur': <TypeRefrigerateurField {...props} />,
    
    // Machines à laver
    'capaciteKg': <CapaciteKgField {...props} />,
    'vitesseEssorage': <VitesseEssorageField {...props} />,
    'typeMachine': <TypeMachineField {...props} />,
    
    // Fours
    'typeFour': <TypeFourField {...props} />,
    'puissance': <PuissanceField {...props} />,
    
    // Audio
    'typeAudio': <TypeAudioField {...props} />,
    
    // Appareils cuisine
    'typeAppareil': <TypeAppareilField {...props} />,
    
    // Aspirateurs
    'typeAspirateur': <TypeAspirateurField {...props} />,
    
    // Repassage
    'typeFer': <TypeFerField {...props} />,
    
    // Télécommandes
    'compatibilite': <CompatibiliteField {...props} />,
    
    // Sécurité/GPS
    'type': <TypeSecuriteField {...props} />
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