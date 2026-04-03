// 📂 components/CATEGORIES/specificFields/MateriauxField.js
import React from 'react';
import BaseCategoryField from './BaseCategoryField';

// ============================================
// CAMPOS ESPECÍFICOS DE MATÉRIAUX & ÉQUIPEMENT (STEP 2)
// ============================================

// Marque
const MarqueField = ({ postData, handleChangeInput }) => {
  const marques = [
    'Bosch', 'Makita', 'Dewalt', 'Black+Decker', 'Stanley', 'Facom',
    'Mac Allister', 'Einhell', 'Ryobi', 'Milwaukee', 'Hilti', 'Metabo',
    'Hitachi', 'Ferm', 'Parkside', 'Lidl', 'Aldi', 'Caterpillar',
    'JCB', 'Kubota', 'John Deere', 'New Holland', 'Claas', 'Massey Ferguson',
    'Lafarge', 'Holcim', 'Vicat', 'Ciments Calcia', 'Point P',
    'Leroy Merlin', 'Castorama', 'Brico Dépôt', 'Autre'
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
        <option value="Neuf (emballé)">Neuf (emballé)</option>
        <option value="Neuf (sans emballage)">Neuf (sans emballage)</option>
        <option value="Comme neuf">Comme neuf</option>
        <option value="Très bon état">Très bon état</option>
        <option value="Bon état">Bon état</option>
        <option value="État moyen">État moyen</option>
        <option value="À réviser">À réviser</option>
        <option value="Pour pièces">Pour pièces</option>
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
// CAMPOS PARA MATÉRIEL PROFESSIONNEL
// ============================================

// Type de matériel
const TypeMaterielField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de matériel</label>
      <select
        name="type_materiel"
        className="form-control"
        value={postData?.type_materiel || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Matériel BTP">Matériel BTP</option>
        <option value="Matériel de chantier">Matériel de chantier</option>
        <option value="Matériel industriel">Matériel industriel</option>
        <option value="Matériel de manutention">Matériel de manutention</option>
        <option value="Matériel de levage">Matériel de levage</option>
        <option value="Matériel de nettoyage">Matériel de nettoyage</option>
        <option value="Matériel de soudure">Matériel de soudure</option>
        <option value="Matériel de menuiserie">Matériel de menuiserie</option>
        <option value="Matériel de plomberie">Matériel de plomberie</option>
        <option value="Matériel d'électricité">Matériel d'électricité</option>
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
        <span className="input-group-text">Watts / CV</span>
      </div>
    </div>
  );
};

// Tension / Voltage
const TensionField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Tension / Voltage</label>
      <select
        name="tension"
        className="form-control"
        value={postData?.tension || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="12V">12V</option>
        <option value="24V">24V</option>
        <option value="220V">220V</option>
        <option value="380V">380V (triphasé)</option>
        <option value="Sans fil (batterie)">Sans fil (batterie)</option>
        <option value="Pneumatique">Pneumatique</option>
        <option value="Thermique">Thermique</option>
      </select>
    </div>
  );
};

// ============================================
// CAMPOS POUR OUTILLAGE PROFESSIONNEL
// ============================================

// Type d'outil
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
        <option value="Perceuse">Perceuse</option>
        <option value="Visseuse">Visseuse</option>
        <option value="Perforateur">Perforateur</option>
        <option value="Scie circulaire">Scie circulaire</option>
        <option value="Scie sauteuse">Scie sauteuse</option>
        <option value="Meuleuse">Meuleuse</option>
        <option value="Ponceuse">Ponceuse</option>
        <option value="Défonceuse">Défonceuse</option>
        <option value="Rabot">Rabot</option>
        <option value="Aspirateur chantier">Aspirateur chantier</option>
        <option value="Nettoyeur haute pression">Nettoyeur haute pression</option>
        <option value="Compresseur">Compresseur</option>
        <option value="Pistolet à peinture">Pistolet à peinture</option>
        <option value="Poste à souder">Poste à souder</option>
        <option value="Multimètre">Multimètre</option>
        <option value="Coffret à outils">Coffret à outils</option>
        <option value="Lot d'outillage">Lot d'outillage</option>
      </select>
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
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Nombre de vitesses</label>
      <select
        name="nb_vitesses"
        className="form-control"
        value={postData?.nb_vitesses || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="1">1 vitesse</option>
        <option value="2">2 vitesses</option>
        <option value="3">3 vitesses</option>
        <option value="4">4 vitesses</option>
        <option value="Variable">Variable</option>
      </select>
    </div>
  );
};

// ============================================
// CAMPOS POUR MATÉRIAUX DE CONSTRUCTION
// ============================================

// Type de matériau
const TypeMateriauConstructionField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de matériau</label>
      <select
        name="type_materiau_construction"
        className="form-control"
        value={postData?.type_materiau_construction || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Ciment">Ciment</option>
        <option value="Sable">Sable</option>
        <option value="Gravier">Gravier</option>
        <option value="Parpaing">Parpaing</option>
        <option value="Brique">Brique</option>
        <option value="Carreau de plâtre">Carreau de plâtre</option>
        <option value="Plâtre">Plâtre</option>
        <option value="Enduit">Enduit</option>
        <option value="Peinture">Peinture</option>
        <option value="Carrelage">Carrelage</option>
        <option value="Parquet">Parquet</option>
        <option value="Stratifié">Stratifié</option>
        <option value="Bois">Bois</option>
        <option value="Acier">Acier</option>
        <option value="Aluminium">Aluminium</option>
        <option value="PVC">PVC</option>
        <option value="Isolant">Isolant</option>
        <option value="Tuile">Tuile</option>
        <option value="Ardoise">Ardoise</option>
      </select>
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
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Unité de mesure</label>
      <select
        name="unite_mesure"
        className="form-control"
        value={postData?.unite_mesure || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="mètre">mètre (m)</option>
        <option value="mètre carré">mètre carré (m²)</option>
        <option value="mètre cube">mètre cube (m³)</option>
        <option value="kilogramme">kilogramme (kg)</option>
        <option value="tonne">tonne (t)</option>
        <option value="litre">litre (L)</option>
        <option value="sac">sac</option>
        <option value="palette">palette</option>
        <option value="rouleau">rouleau</option>
      </select>
    </div>
  );
};

// ============================================
// CAMPOS POUR MATIÈRES PREMIÈRES
// ============================================

// Type de matière première
const TypeMatierePremiereField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de matière première</label>
      <select
        name="type_matiere_premiere"
        className="form-control"
        value={postData?.type_matiere_premiere || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Métal">Métal</option>
        <option value="Plastique">Plastique</option>
        <option value="Bois">Bois</option>
        <option value="Textile">Textile</option>
        <option value="Cuir">Cuir</option>
        <option value="Caoutchouc">Caoutchouc</option>
        <option value="Verre">Verre</option>
        <option value="Papier">Papier</option>
        <option value="Carton">Carton</option>
        <option value="Chimique">Chimique</option>
        <option value="Alimentaire">Alimentaire</option>
        <option value="Pharmaceutique">Pharmaceutique</option>
      </select>
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
// CAMPOS POUR PRODUITS D'HYGIÈNE
// ============================================

// Type de produit d'hygiène
const TypeHygièneField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de produit</label>
      <select
        name="type_hygiene"
        className="form-control"
        value={postData?.type_hygiene || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Désinfectant">Désinfectant</option>
        <option value="Détergent">Détergent</option>
        <option value="Savon liquide">Savon liquide</option>
        <option value="Gel hydroalcoolique">Gel hydroalcoolique</option>
        <option value="Papier toilette">Papier toilette</option>
        <option value="Essuie-tout">Essuie-tout</option>
        <option value="Mouchoirs">Mouchoirs</option>
        <option value="Produit nettoyant">Produit nettoyant</option>
        <option value="Lessive">Lessive</option>
        <option value="Adoucissant">Adoucissant</option>
        <option value="Produit vaisselle">Produit vaisselle</option>
        <option value="Balai">Balai</option>
        <option value="Serpillière">Serpillière</option>
        <option value="Seau">Seau</option>
        <option value="Gants ménagers">Gants ménagers</option>
      </select>
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
// CAMPOS POUR MATÉRIEL AGRICOLE
// ============================================

// Type de matériel agricole
const TypeAgricoleField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de matériel</label>
      <select
        name="type_agricole"
        className="form-control"
        value={postData?.type_agricole || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Tracteur">Tracteur</option>
        <option value="Moissonneuse">Moissonneuse</option>
        <option value="Labour">Labour</option>
        <option value="Herse">Herse</option>
        <option value="Semoir">Semoir</option>
        <option value="Pulvérisateur">Pulvérisateur</option>
        <option value="Faucheuse">Faucheuse</option>
        <option value="Presse à balles">Presse à balles</option>
        <option value="Remorque agricole">Remorque agricole</option>
        <option value="Matériel d'irrigation">Matériel d'irrigation</option>
        <option value="Matériel d'élevage">Matériel d'élevage</option>
        <option value="Outils agricoles">Outils agricoles</option>
        <option value="Pièces agricoles">Pièces agricoles</option>
      </select>
    </div>
  );
};

// Année (pour tracteurs)
const AnneeField = ({ postData, handleChangeInput }) => {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Année de fabrication</label>
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
  const { step } = props;
  
  const customComponents = {
    // Campos comunes
    'marque': <MarqueField {...props} />,
    'modele': <ModeleField {...props} />,
    'etat': <EtatField {...props} />,
    'garantie': <GarantieField {...props} />,
    
    // Matériel professionnel
    'type_materiel': <TypeMaterielField {...props} />,
    'puissance': <PuissanceField {...props} />,
    'tension': <TensionField {...props} />,
    
    // Outillage professionnel
    'type_outil': <TypeOutilField {...props} />,
    'diametre': <DiametreField {...props} />,
    'nb_vitesses': <NbVitessesField {...props} />,
    
    // Matériaux de construction
    'type_materiau_construction': <TypeMateriauConstructionField {...props} />,
    'quantite': <QuantiteField {...props} />,
    'unite_mesure': <UniteMesureField {...props} />,
    
    // Matières premières
    'type_matiere_premiere': <TypeMatierePremiereField {...props} />,
    'purete': <PureteField {...props} />,
    
    // Produits d'hygiène
    'type_hygiene': <TypeHygièneField {...props} />,
    'volume': <VolumeField {...props} />,
    
    // Matériel agricole
    'type_agricole': <TypeAgricoleField {...props} />,
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