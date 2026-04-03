// 📂 components/CATEGORIES/specificFields/TelephonesField.js
import React from 'react';
import Select from 'react-select';
import BaseCategoryField from './BaseCategoryField';
import MarqueModelTelephone from '../camposComun/MarqueModelTelephone';

// ============================================
// CAMPOS ESPECÍFICOS DE TELÉFONOS (STEP 2)
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

// Référence
const ReferenceField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Référence</label>
      <input
        type="text"
        name="referencia"
        className="form-control"
        placeholder="Référence"
        value={postData?.referencia || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// Copie (Grade)
const CopieField = ({ postData, handleChangeInput }) => {
  const options = [
    'Original', 'Reconditionné', 'Copie Chinois', 'Premium Copy', 
    'Clone', 'Grade A+', 'Grade A', 'Grade B', 'Grade C'
  ];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Copie / Grade</label>
      <select
        name="copie"
        className="form-control"
        value={postData?.copie || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

// Mémoire (Stockage)
const MemoireField = ({ postData, handleChangeInput }) => {
  const options = [
    '1 TO', '512 GO', '256 GO', '128 GO', '64 GO', '32 GO', 
    '16 GO', '8 GO', '4 GO', '2 GO', '1 GO', '512 MO', '256 MO'
  ];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Mémoire (Stockage)</label>
      <select
        name="memoire"
        className="form-control"
        value={postData?.memoire || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

// Couleur
const CouleurField = ({ postData, handleChangeInput }) => {
  const options = [
    'Blanc', 'Noir', 'Doré', 'Argenté', 'Bleu', 'Bleu nuit', 
    'Rouge', 'Bordeaux', 'Vert', 'Vert forêt', 'Rose', 'Rose gold', 
    'Gris', 'Gris sidéral', 'Jaune', 'Orange', 'Violet', 'Lavande', 
    'Bronze', 'Titanium', 'Autre'
  ];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Couleur</label>
      <select
        name="couleur"
        className="form-control"
        value={postData?.couleur || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

// État
const EtatTelephoneField = ({ postData, handleChangeInput }) => {
  const options = [
    'Neuf jamais utilisé', 'État neuf', 'Comme neuf', 'Reconditionné à neuf',
    'Bon état', 'État moyen', 'Écran fissuré, fonctionne bien',
    'Dysfonctionnement partiel', 'Pour pièces détachées'
  ];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">État</label>
      <select
        name="etat"
        className="form-control"
        value={postData?.etat || ''}
        onChange={handleChangeInput}
      >
        <option value="">État</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

// OS / Android
const OsField = ({ postData, handleChangeInput }) => {
  const options = [
    'IOS', 'IOS (version spécifique)', 'Android', 'Android (version spécifique)',
    'Windows Phone', 'BlackBerry OS', 'KaiOS', 'HarmonyOS', 
    'Ubuntu Touch', 'Sailfish OS', 'Autre'
  ];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">OS / Android</label>
      <select
        name="os"
        className="form-control"
        value={postData?.os || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

// Appareil photo (Megapixel)
const AppareilField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Appareil photo (MP)</label>
      <div className="input-group">
        <input
          type="number"
          name="appareil"
          className="form-control"
          placeholder="Mégapixels"
          value={postData?.appareil || ''}
          onChange={handleChangeInput}
        />
        <span className="input-group-text">MP</span>
      </div>
    </div>
  );
};

// Caméra frontale (Megapixel)
const CameraFrontalField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Caméra frontale (MP)</label>
      <div className="input-group">
        <input
          type="number"
          name="camerafrontal"
          className="form-control"
          placeholder="Mégapixels"
          value={postData?.camerafrontal || ''}
          onChange={handleChangeInput}
        />
        <span className="input-group-text">MP</span>
      </div>
    </div>
  );
};

// Taille écran
const TailleEcranField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Taille écran</label>
      <div className="input-group">
        <input
          type="text"
          name="talleecran"
          className="form-control"
          placeholder="Taille écran"
          value={postData?.talleecran || ''}
          onChange={handleChangeInput}
        />
        <span className="input-group-text">pouces</span>
      </div>
    </div>
  );
};

// RAM
const RamField = ({ postData, handleChangeInput }) => {
  const options = [
    '128 MO', '256 MO', '512 MO', '1 GO', '2 GO', '3 GO', '4 GO', 
    '6 GO', '8 GO', '12 GO', '16 GO', '24 GO', '32 GO', '64 GO', 
    '128 GO', '256 GO', '512 GO'
  ];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">RAM</label>
      <select
        name="ram"
        className="form-control"
        value={postData?.ram || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

// Connectivité (Gigas)
const ConnectiviteField = ({ postData, handleChangeInput }) => {
  const options = [
    'Sans réseau', 'Avec 2G', 'Avec 3G', 'Avec 4G', 'Avec 5G'
  ];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Connectivité</label>
      <select
        name="gigas"
        className="form-control"
        value={postData?.gigas || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

// Double puce
const DoublePuceField = ({ postData, handleChangeInput }) => {
  const options = [
    'Avec une seule puce', 'Avec double puce', 'Avec triple puce', 'Avec eSIM + SIM physique'
  ];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Double puce</label>
      <select
        name="doublepuces"
        className="form-control"
        value={postData?.doublepuces || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const TelephonesField = (props) => {
  const { step } = props;
  
  const customComponents = {
    'title': <TitleField {...props} />,
    'referencia': <ReferenceField {...props} />,
    'marque': <MarqueModelTelephone {...props} />,
    'modele': null, // Viene incluido en marque
    'copie': <CopieField {...props} />,
    'memoire': <MemoireField {...props} />,
    'couleur': <CouleurField {...props} />,
    'etat': <EtatTelephoneField {...props} />,
    'os': <OsField {...props} />,
    'appareil': <AppareilField {...props} />,
    'camerafrontal': <CameraFrontalField {...props} />,
    'talleecran': <TailleEcranField {...props} />,
    'ram': <RamField {...props} />,
    'gigas': <ConnectiviteField {...props} />,
    'doublepuces': <DoublePuceField {...props} />
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

export default TelephonesField;