import React from 'react';
import BaseCategoryField from './BaseCategoryField';

// ============================================
// CAMPOS ESPECÍFICOS DE INMOBILIARIO (STEP 2)
// ============================================

// Désignation - Requerido
const DesignationField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">
        Désignation <span className="text-danger">*</span>
      </label>
      <input
        type="text"
        name="designation"
        className="form-control"
        placeholder="Ex: Magnifique appartement F3"
        value={postData?.designation || ''}
        onChange={handleChangeInput}
        required
      />
    </div>
  );
};

// Description du bien - Requerido
const DescriptionBienField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">
        Description du bien <span className="text-danger">*</span>
      </label>
      <textarea
        name="descriptionBien"
        className="form-control"
        rows="4"
        placeholder="Décrivez votre bien en détail..."
        value={postData?.descriptionBien || ''}
        onChange={handleChangeInput}
        required
      />
    </div>
  );
};

// Superficie - Requerido
const SuperficieField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">
        Superficie <span className="text-danger">*</span>
      </label>
      <div className="input-group">
        <input 
          type="number"
          name="superficie"
          className="form-control"
          placeholder="Superficie"
          value={postData?.superficie || ''}
          onChange={handleChangeInput}
          required
        />
        <span className="input-group-text">m²</span>
      </div>
    </div>
  );
};

// Étage
const EtageField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Étage</label>
      <input
        type="number"
        name="etage"
        className="form-control"
        placeholder="Numéro d'étage"
        value={postData?.etage || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Nombre de pièces
const PiecesField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Nombre de pièces</label>
      <select
        name="pieces"
        className="form-control"
        value={postData?.pieces || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="1">1 pièce</option>
        <option value="2">2 pièces</option>
        <option value="3">3 pièces</option>
        <option value="4">4 pièces</option>
        <option value="5">5 pièces</option>
        <option value="6">6+ pièces</option>
      </select>
    </div>
  );
};

// Nombre de chambres
const ChambresField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Nombre de chambres</label>
      <select
        name="chambres"
        className="form-control"
        value={postData?.chambres || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="1">1 chambre</option>
        <option value="2">2 chambres</option>
        <option value="3">3 chambres</option>
        <option value="4">4 chambres</option>
        <option value="5">5+ chambres</option>
      </select>
    </div>
  );
};

// Salles de bain
const SallesBainField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Salles de bain</label>
      <select
        name="sallesBain"
        className="form-control"
        value={postData?.sallesBain || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4+</option>
      </select>
    </div>
  );
};

// Jardin
const JardinField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Jardin</label>
      <select
        name="jardin"
        className="form-control"
        value={postData?.jardin || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="oui">Oui</option>
        <option value="non">Non</option>
      </select>
    </div>
  );
};

// Piscine
const PiscineField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Piscine</label>
      <select
        name="piscine"
        className="form-control"
        value={postData?.piscine || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="oui">Oui</option>
        <option value="non">Non</option>
      </select>
    </div>
  );
};

// Spécifications (MULTISELECT)
const SpecsImmobilierField = ({ postData, handleChangeInput }) => {
  const optionsList = [
    'Meublé', 'Non meublé', 'Ascenseur', 'Parking', 'Jardin', 
    'Balcon', 'Terrasse', 'Cave', 'Garde', 'Interphone', 
    'Vidéosurveillance', 'Chauffage central', 'Climatisation', 
    'Piscine', 'Salle de sport', 'Cuisine équipée', 'Double vitrage'
  ];
  
  const handleOptionChange = (e) => {
    const selected = Array.from(e.target.selectedOptions, option => option.value);
    handleChangeInput({
      target: { name: 'specs', value: selected }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Spécifications</label>
      <select
        name="specs"
        multiple
        className="form-control"
        value={postData?.specs || []}
        onChange={handleOptionChange}
        style={{ height: '150px' }}
      >
        {optionsList.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <small className="text-muted">Maintenez Ctrl pour sélectionner plusieurs options</small>
    </div>
  );
};

// Transaction - Requerido
const TransactionField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">
        Transaction <span className="text-danger">*</span>
      </label>
      <select
        name="transaction"
        className="form-control"
        value={postData?.transaction || ''}
        onChange={handleChangeInput}
        required
      >
        <option value="">Sélectionner</option>
        <option value="Vente">Vente</option>
        <option value="Location">Location</option>
        <option value="Location vacances">Location vacances</option>
      </select>
    </div>
  );
};

// Type de vente - Requerido
const TypeVenteField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">
        Type de vente <span className="text-danger">*</span>
      </label>
      <select
        name="typeVente"
        className="form-control"
        value={postData?.typeVente || ''}
        onChange={handleChangeInput}
        required
      >
        <option value="">Sélectionner</option>
        <option value="Particulier">Particulier</option>
        <option value="Professionnel">Professionnel</option>
        <option value="Agence">Agence immobilière</option>
        <option value="Promoteur">Promoteur</option>
      </select>
    </div>
  );
};

// Papiers
const PapiersImmobilierField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Papiers</label>
      <select
        name="papiers"
        className="form-control"
        value={postData?.papiers || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Titre de propriété">Titre de propriété</option>
        <option value="Acte de vente">Acte de vente</option>
        <option value="Permis de construire">Permis de construire</option>
        <option value="Diagnostic technique">Diagnostic technique</option>
        <option value="Aucun">Aucun</option>
      </select>
    </div>
  );
};

// Conditions de paiement
const ConditionsPaiementField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Conditions de paiement</label>
      <select
        name="conditionsPaiement"
        className="form-control"
        value={postData?.conditionsPaiement || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Comptant">Comptant</option>
        <option value="Crédit">Crédit</option>
        <option value="Crédit bancaire">Crédit bancaire</option>
        <option value="Crédit vendeur">Crédit vendeur</option>
        <option value="Échange">Échange</option>
      </select>
    </div>
  );
};

// Description Extra
const DescriptionExtraField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Description complémentaire</label>
      <textarea
        name="descriptionExtra"
        className="form-control"
        rows="3"
        placeholder="Informations complémentaires..."
        value={postData?.descriptionExtra || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Adresse du bien - Requerido
const AdresseBienField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">
        Adresse du bien <span className="text-danger">*</span>
      </label>
      <input
        type="text"
        name="adresse"
        className="form-control"
        placeholder="Ex: 123 Rue Mohamed V, Alger"
        value={postData?.adresse || ''}
        onChange={handleChangeInput}
        required
      />
    </div>
  );
};

// Quartier
const QuartierField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Quartier</label>
      <input
        type="text"
        name="quartier"
        className="form-control"
        placeholder="Ex: Hydra, El Biar, Sidi Yahia..."
        value={postData?.quartier || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Type de terrain
const TypeTerrainField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de terrain</label>
      <select
        name="typeTerrain"
        className="form-control"
        value={postData?.typeTerrain || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Constructible">Constructible</option>
        <option value="Non constructible">Non constructible</option>
        <option value="Agricole">Agricole</option>
      </select>
    </div>
  );
};

// Viabilisé
const ViabiliseField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Viabilisé</label>
      <select
        name="viabilise"
        className="form-control"
        value={postData?.viabilise || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="oui">Oui</option>
        <option value="non">Non</option>
      </select>
    </div>
  );
};

// Vitrine
const VitrineField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Vitrine</label>
      <select
        name="vitrine"
        className="form-control"
        value={postData?.vitrine || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="oui">Oui</option>
        <option value="non">Non</option>
      </select>
    </div>
  );
};

// Hauteur sous plafond
const HauteurField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Hauteur sous plafond</label>
      <div className="input-group">
        <input
          type="number"
          name="hauteur"
          className="form-control"
          placeholder="Hauteur"
          value={postData?.hauteur || ''}
          onChange={handleChangeInput}
          step="0.1"
        />
        <span className="input-group-text">m</span>
      </div>
    </div>
  );
};

// Nombre d'appartements
const NbAppartementsField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Nombre d'appartements</label>
      <input
        type="number"
        name="nbAppartements"
        className="form-control"
        placeholder="Nombre d'appartements"
        value={postData?.nbAppartements || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Nombre d'étages
const NbEtagesField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Nombre d'étages</label>
      <input
        type="number"
        name="nbEtages"
        className="form-control"
        placeholder="Nombre d'étages"
        value={postData?.nbEtages || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL (MISMA ESTRUCTURA QUE VEHICULES)
// ============================================

const ImmobiliersFields = (props) => {
  const { step } = props;
  
  // Mapeo de campos específicos (SOLO los que son únicos de inmobiliario)
  const customComponents = {
    'designation': <DesignationField {...props} />,
    'descriptionBien': <DescriptionBienField {...props} />,
    'superficie': <SuperficieField {...props} />,
    'etage': <EtageField {...props} />,
    'pieces': <PiecesField {...props} />,
    'chambres': <ChambresField {...props} />,
    'sallesBain': <SallesBainField {...props} />,
    'jardin': <JardinField {...props} />,
    'piscine': <PiscineField {...props} />,
    'specs': <SpecsImmobilierField {...props} />,
    'transaction': <TransactionField {...props} />,
    'typeVente': <TypeVenteField {...props} />,
    'papiers': <PapiersImmobilierField {...props} />,
    'conditionsPaiement': <ConditionsPaiementField {...props} />,
    'descriptionExtra': <DescriptionExtraField {...props} />,
    'adresse': <AdresseBienField {...props} />,
    'quartier': <QuartierField {...props} />,
    'typeTerrain': <TypeTerrainField {...props} />,
    'viabilise': <ViabiliseField {...props} />,
    'vitrine': <VitrineField {...props} />,
    'hauteur': <HauteurField {...props} />,
    'nbAppartements': <NbAppartementsField {...props} />,
    'nbEtages': <NbEtagesField {...props} />
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

export default ImmobiliersFields;