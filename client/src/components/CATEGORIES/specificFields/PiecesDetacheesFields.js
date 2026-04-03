// 📂 components/CATEGORIES/specificFields/PiecesDetacheesField.js
import React from 'react';
import BaseCategoryField from './BaseCategoryField';

// ============================================
// CAMPOS ESPECÍFICOS DE PIÈCES DÉTACHÉES (STEP 2)
// ============================================

// Marque
const MarqueField = ({ postData, handleChangeInput }) => {
  const marques = [
    'Renault', 'Peugeot', 'Citroën', 'Volkswagen', 'BMW', 'Mercedes',
    'Audi', 'Toyota', 'Hyundai', 'Kia', 'Ford', 'Fiat', 'Dacia',
    'Nissan', 'Honda', 'Mazda', 'Mitsubishi', 'Suzuki', 'Volvo',
    'Porsche', 'Jaguar', 'Land Rover', 'Mini', 'Smart', 'Opel',
    'Seat', 'Skoda', 'Alfa Romeo', 'Ferrari', 'Lamborghini',
    'Yamaha', 'Kawasaki', 'Suzuki Moto', 'Honda Moto', 'BMW Moto',
    'Ducati', 'Aprilia', 'KTM', 'Harley Davidson', 'Autre'
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
        placeholder="Ex: Clio 3, 308, Série 3, C4..."
        value={postData?.modele || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Année
const AnneeField = ({ postData, handleChangeInput }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Année du véhicule</label>
      <select
        name="annee"
        className="form-control"
        value={postData?.annee || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner l'année</option>
        {years.map(year => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>
    </div>
  );
};

// Type de pièce
const TypePieceField = ({ postData, handleChangeInput }) => {
  const typesPiece = [
    'Moteur', 'Boîte de vitesse', 'Embrayage', 'Freins', 'Amortisseurs',
    'Alternateur', 'Démarreur', 'Batterie', 'Pneu', 'Jante',
    'Pare-chocs', 'Rétroviseur', 'Phares', 'Feux arrière',
    'Calandre', 'Capot', 'Porte', 'Vitre', 'Siège', 'Volant',
    'Tableau de bord', 'Climatisation', 'Radiateur', 'Échappement',
    'Filtre à huile', 'Filtre à air', 'Courroie de distribution',
    'Pompe à eau', 'Injecteur', 'Piston', 'Segment', 'Joint de culasse',
    'Kit de distribution', 'Cardan', 'Rotule', 'Biellette de direction',
    'Capteur', 'Calculateur', 'Sonde lambda', 'Autre'
  ];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de pièce</label>
      <select
        name="type_piece"
        className="form-control"
        value={postData?.type_piece || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner le type</option>
        {typesPiece.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
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
        <option value="Neuf">Neuf</option>
        <option value="Neuf (emballé)">Neuf (emballé)</option>
        <option value="Comme neuf">Comme neuf</option>
        <option value="Très bon état">Très bon état</option>
        <option value="Bon état">Bon état</option>
        <option value="État moyen">État moyen</option>
        <option value="Reconditionné">Reconditionné</option>
        <option value="Pour réparation">Pour réparation</option>
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
        placeholder="Ex: 1 mois, 6 mois, 1 an..."
        value={postData?.garantie || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Numéro OEM / Référence
const ReferenceOEMField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Référence OEM</label>
      <input
        type="text"
        name="reference_oem"
        className="form-control"
        placeholder="Ex: 8200123456, 7700101234..."
        value={postData?.reference_oem || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Compatibilité
const CompatibiliteField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Compatibilité</label>
      <textarea
        name="compatibilite"
        className="form-control"
        rows="2"
        placeholder="Ex: Compatible avec Renault Clio 3 1.5 dCi 2008-2012"
        value={postData?.compatibilite || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Kilométrage (pour pièces d'occasion)
const KilometrageField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Kilométrage (si occasion)</label>
      <div className="input-group">
        <input
          type="number"
          name="kilometrage"
          className="form-control"
          placeholder="Kilométrage"
          value={postData?.kilometrage || ''}
          onChange={handleChangeInput}
        />
        <span className="input-group-text">km</span>
      </div>
    </div>
  );
};

// Position (pour pièces)
const PositionField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Position</label>
      <select
        name="position"
        className="form-control"
        value={postData?.position || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Avant droit">Avant droit</option>
        <option value="Avant gauche">Avant gauche</option>
        <option value="Arrière droit">Arrière droit</option>
        <option value="Arrière gauche">Arrière gauche</option>
        <option value="Avant">Avant</option>
        <option value="Arrière">Arrière</option>
        <option value="Intérieur">Intérieur</option>
        <option value="Extérieur">Extérieur</option>
      </select>
    </div>
  );
};

// Type de moteur (pour pièces moteur)
const TypeMoteurField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de moteur</label>
      <select
        name="type_moteur"
        className="form-control"
        value={postData?.type_moteur || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Essence">Essence</option>
        <option value="Diesel">Diesel</option>
        <option value="GPL">GPL</option>
        <option value="Électrique">Électrique</option>
        <option value="Hybride">Hybride</option>
      </select>
    </div>
  );
};

// Quantité
const QuantiteField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Quantité disponible</label>
      <input
        type="number"
        name="quantite"
        className="form-control"
        placeholder="Quantité"
        value={postData?.quantite || ''}
        onChange={handleChangeInput}
        min="1"
      />
    </div>
  );
};

// Type de lubrifiant
const TypeLubrifiantField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de lubrifiant</label>
      <select
        name="type_lubrifiant"
        className="form-control"
        value={postData?.type_lubrifiant || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Huile moteur">Huile moteur</option>
        <option value="Huile boîte">Huile boîte</option>
        <option value="Liquide frein">Liquide frein</option>
        <option value="Liquide refroidissement">Liquide refroidissement</option>
        <option value="Liquide lave-glace">Liquide lave-glace</option>
        <option value="Graisse">Graisse</option>
        <option value="Additif">Additif</option>
      </select>
    </div>
  );
};

// Viscosité (huile)
const ViscositeField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Viscosité</label>
      <select
        name="viscosite"
        className="form-control"
        value={postData?.viscosite || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="5W30">5W30</option>
        <option value="5W40">5W40</option>
        <option value="10W40">10W40</option>
        <option value="10W50">10W50</option>
        <option value="15W40">15W40</option>
        <option value="20W50">20W50</option>
        <option value="0W20">0W20</option>
        <option value="0W30">0W30</option>
      </select>
    </div>
  );
};

// Type d'outil diagnostic
const TypeOutilField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type d'outil</label>
      <select
        name="type_outil"
        className="form-control"
        value={postData?.type_outil || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Valise diagnostic">Valise diagnostic</option>
        <option value="Lecteur OBD2">Lecteur OBD2</option>
        <option value="Multimètre">Multimètre</option>
        <option value="Testeur batterie">Testeur batterie</option>
        <option value="Testeur compression">Testeur compression</option>
        <option value="Pont élévateur">Pont élévateur</option>
        <option value="Chasse-pneu">Chasse-pneu</option>
      </select>
    </div>
  );
};

// Type d'alarme
const TypeAlarmeField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type d'alarme</label>
      <select
        name="type_alarme"
        className="form-control"
        value={postData?.type_alarme || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Alarme volumétrique">Alarme volumétrique</option>
        <option value="Alarme périmétrique">Alarme périmétrique</option>
        <option value="Alarme avec GPS">Alarme avec GPS</option>
        <option value="Système main libre">Système main libre</option>
        <option value="Kit mains libres">Kit mains libres</option>
        <option value="Antidémarrage">Antidémarrage</option>
        <option value="Traceur GPS">Traceur GPS</option>
      </select>
    </div>
  );
};

// Type de produit nettoyage
const TypeNettoyageField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de produit</label>
      <select
        name="type_nettoyage"
        className="form-control"
        value={postData?.type_nettoyage || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Shampoing auto">Shampoing auto</option>
        <option value="Cire">Cire</option>
        <option value="Nettoyant vitres">Nettoyant vitres</option>
        <option value="Nettoyant jantes">Nettoyant jantes</option>
        <option value="Nettoyant cuir">Nettoyant cuir</option>
        <option value="Décapant">Décapant</option>
        <option value="Polish">Polish</option>
        <option value="Chiffon microfibre">Chiffon microfibre</option>
        <option value="Brosse">Brosse</option>
        <option value="Nettoyeur haute pression">Nettoyeur haute pression</option>
        <option value="Aspirateur auto">Aspirateur auto</option>
      </select>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const PiecesDetacheesField = (props) => {
  const { step } = props;
  
  const customComponents = {
    // Campos comunes
    'marque': <MarqueField {...props} />,
    'modele': <ModeleField {...props} />,
    'annee': <AnneeField {...props} />,
    'type_piece': <TypePieceField {...props} />,
    'etat': <EtatField {...props} />,
    'garantie': <GarantieField {...props} />,
    'reference_oem': <ReferenceOEMField {...props} />,
    'compatibilite': <CompatibiliteField {...props} />,
    'kilometrage': <KilometrageField {...props} />,
    'position': <PositionField {...props} />,
    'type_moteur': <TypeMoteurField {...props} />,
    'quantite': <QuantiteField {...props} />,
    
    // Lubrifiants
    'type_lubrifiant': <TypeLubrifiantField {...props} />,
    'viscosite': <ViscositeField {...props} />,
    
    // Outils diagnostics
    'type_outil': <TypeOutilField {...props} />,
    
    // Alarme & Sécurité
    'type_alarme': <TypeAlarmeField {...props} />,
    
    // Nettoyage & Entretien
    'type_nettoyage': <TypeNettoyageField {...props} />
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

export default PiecesDetacheesField;