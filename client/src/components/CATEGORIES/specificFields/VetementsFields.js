// 📂 components/CATEGORIES/specificFields/VetementsField.js
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
    'Nike', 'Adidas', 'Zara', 'H&M', 'Levi\'s', 'Gucci', 'Prada', 
    'Chanel', 'Dior', 'Louis Vuitton', 'Calvin Klein', 'Tommy Hilfiger',
    'Ralph Lauren', 'Armani', 'Versace', 'Boss', 'Lacoste', 'Puma',
    'Reebok', 'New Balance', 'Under Armour', 'Decathlon', 'Autre'
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

// Couleur
const CouleurField = ({ postData, handleChangeInput }) => {
  const couleurs = [
    'Blanc', 'Noir', 'Gris', 'Bleu', 'Rouge', 'Vert', 'Jaune', 
    'Orange', 'Rose', 'Violet', 'Marron', 'Beige', 'Kaki', 'Multicolore',
    'Or', 'Argent', 'Doré', 'Bronze', 'Bleu marine', 'Bordeaux'
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
        <option value="">Sélectionner la couleur</option>
        {couleurs.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>
  );
};

// Matière
const MatiereField = ({ postData, handleChangeInput }) => {
  const matieres = [
    'Coton', 'Polyester', 'Laine', 'Soie', 'Lin', 'Cuir', 'Synthétique',
    'Nylon', 'Spandex', 'Acrylique', 'Velours', 'Denim', 'Tweed'
  ];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Matière</label>
      <select
        name="matiere"
        className="form-control"
        value={postData?.matiere || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner la matière</option>
        {matieres.map(m => (
          <option key={m} value={m}>{m}</option>
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
        <option value="">Sélectionner l'état</option>
        <option value="Neuf avec étiquette">Neuf avec étiquette</option>
        <option value="Neuf sans étiquette">Neuf sans étiquette</option>
        <option value="Très bon état">Très bon état</option>
        <option value="Bon état">Bon état</option>
        <option value="État moyen">État moyen</option>
        <option value="À rénover">À rénover</option>
      </select>
    </div>
  );
};

// ============================================
// NUEVOS CAMPOS FALTANTES
// ============================================

// Type de vêtement
const TypeVetementField = ({ postData, handleChangeInput }) => {
  const typesVetements = [
    'T-shirt', 'Chemise', 'Polo', 'Pull', 'Sweat', 'Veste', 'Manteau',
    'Pantalon', 'Jean', 'Short', 'Jupe', 'Robe', 'Combinaison',
    'Sous-vêtement', 'Pyjama', 'Sport', 'Costume', 'Blazer', 'Gilet',
    'Veste en cuir', 'Doudoune', 'Parka', 'Imperméable', 'Legging',
    'Survêtement', 'Maillot de bain', 'Cravate', 'Écharpe', 'Gants'
  ];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de vêtement</label>
      <select
        name="typeVetement"
        className="form-control"
        value={postData?.typeVetement || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner le type de vêtement</option>
        {typesVetements.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>
  );
};

// Type de chaussure
const TypeChaussureField = ({ postData, handleChangeInput }) => {
  const typesChaussures = [
    'Baskets', 'Running', 'Chaussures de ville', 'Bottines', 'Boots',
    'Sandales', 'Tongs', 'Mocassins', 'Espadrilles', 'Chaussons',
    'Chaussures de sport', 'Chaussures de randonnée'
  ];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de chaussure</label>
      <select
        name="typeChaussure"
        className="form-control"
        value={postData?.typeChaussure || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner le type</option>
        {typesChaussures.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>
  );
};

// Type de lunette
const TypeLunetteField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de lunette</label>
      <select
        name="typeLunette"
        className="form-control"
        value={postData?.typeLunette || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Lunettes de soleil">Lunettes de soleil</option>
        <option value="Lunettes de vue">Lunettes de vue</option>
        <option value="Lunettes de lecture">Lunettes de lecture</option>
        <option value="Lunettes de sécurité">Lunettes de sécurité</option>
      </select>
    </div>
  );
};

// Type de bijou
const TypeBijouField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de bijou</label>
      <select
        name="typeBijou"
        className="form-control"
        value={postData?.typeBijou || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Bague">Bague</option>
        <option value="Collier">Collier</option>
        <option value="Bracelet">Bracelet</option>
        <option value="Boucles d'oreilles">Boucles d'oreilles</option>
        <option value="Broche">Broche</option>
      </select>
    </div>
  );
};

// Type de tenue professionnelle
const TypeTenueField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de tenue</label>
      <select
        name="typeTenue"
        className="form-control"
        value={postData?.typeTenue || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Uniforme médical">Uniforme médical</option>
        <option value="Uniforme d'école">Uniforme d'école</option>
        <option value="Tenue de cuisine">Tenue de cuisine</option>
        <option value="Tenue d'usine">Tenue d'usine</option>
        <option value="Tenue de bureau">Tenue de bureau</option>
      </select>
    </div>
  );
};

// Dimensions (sacs, valises)
const DimensionsField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Dimensions</label>
      <input
        type="text"
        name="dimensions"
        className="form-control"
        placeholder="Ex: 40x30x20 cm"
        value={postData?.dimensions || ''}
        onChange={handleChangeInput}
      />
    </div>
  );
};

// ============================================
// CAMPOS PARA VÊTEMENTS
// ============================================

// Taille (vêtements)
const TailleVetementField = ({ postData, handleChangeInput }) => {
  const tailles = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL', '34', '36', '38', '40', '42', '44', '46'];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Taille</label>
      <select
        name="taille"
        className="form-control"
        value={postData?.taille || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner la taille</option>
        {tailles.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
  );
};

// Pointure (chaussures)
const PointureField = ({ postData, handleChangeInput }) => {
  const pointures = Array.from({ length: 20 }, (_, i) => (i + 35).toString());
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Pointure</label>
      <select
        name="pointure"
        className="form-control"
        value={postData?.pointure || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner la pointure</option>
        {pointures.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>
  );
};

// Genre
const GenreField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Genre</label>
      <select
        name="genre"
        className="form-control"
        value={postData?.genre || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner le genre</option>
        <option value="Homme">Homme</option>
        <option value="Femme">Femme</option>
        <option value="Mixte">Mixte</option>
        <option value="Garçon">Garçon</option>
        <option value="Fille">Fille</option>
        <option value="Bébé">Bébé</option>
      </select>
    </div>
  );
};

// Âge (pour enfants)
const AgeField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Âge</label>
      <select
        name="age"
        className="form-control"
        value={postData?.age || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner l'âge</option>
        <option value="0-3 mois">0-3 mois</option>
        <option value="3-6 mois">3-6 mois</option>
        <option value="6-9 mois">6-9 mois</option>
        <option value="9-12 mois">9-12 mois</option>
        <option value="12-18 mois">12-18 mois</option>
        <option value="18-24 mois">18-24 mois</option>
        <option value="2 ans">2 ans</option>
        <option value="3 ans">3 ans</option>
        <option value="4 ans">4 ans</option>
        <option value="5 ans">5 ans</option>
        <option value="6-8 ans">6-8 ans</option>
        <option value="9-11 ans">9-11 ans</option>
        <option value="12-14 ans">12-14 ans</option>
      </select>
    </div>
  );
};

// ============================================
// CAMPOS PARA ACCESSOIRES (Montres, Bijoux, Lunettes)
// ============================================

// Matériau (bijoux, montres)
const MateriauField = ({ postData, handleChangeInput }) => {
  const materiaux = [
    'Or', 'Or blanc', 'Or rose', 'Argent', 'Platine', 'Acier inoxydable',
    'Titane', 'Cuivre', 'Bronze', 'Laiton', 'Plaqué or', 'Argenté'
  ];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Matériau</label>
      <select
        name="materiau"
        className="form-control"
        value={postData?.materiau || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner le matériau</option>
        {materiaux.map(m => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
    </div>
  );
};

// Pierres (bijoux)
const PierresField = ({ postData, handleChangeInput }) => {
  const pierres = [
    'Diamant', 'Rubis', 'Émeraude', 'Saphir', 'Améthyste', 'Topaze',
    'Citrine', 'Grenat', 'Opale', 'Jade', 'Turquoise', 'Perle',
    'Aucune pierre'
  ];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Pierres précieuses</label>
      <select
        name="pierres"
        className="form-control"
        value={postData?.pierres || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner les pierres</option>
        {pierres.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
    </div>
  );
};

// Poids (or, bijoux)
const PoidsField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Poids</label>
      <div className="input-group">
        <input
          type="number"
          name="poids"
          className="form-control"
          placeholder="Poids"
          value={postData?.poids || ''}
          onChange={handleChangeInput}
          step="0.1"
        />
        <span className="input-group-text">grammes</span>
      </div>
    </div>
  );
};

// Carats
const CaratsField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Carats</label>
      <input
        type="number"
        name="carats"
        className="form-control"
        placeholder="Carats"
        value={postData?.carats || ''}
        onChange={handleChangeInput}
        step="0.01"
      />
    </div>
  );
};

// Type de monture (lunettes)
const MontureField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de monture</label>
      <select
        name="monture"
        className="form-control"
        value={postData?.monture || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Rectangulaire">Rectangulaire</option>
        <option value="Ronde">Ronde</option>
        <option value="Carrée">Carrée</option>
        <option value="Ovale">Ovale</option>
        <option value="Papillon">Papillon</option>
        <option value="Sans monture">Sans monture</option>
      </select>
    </div>
  );
};

// Protection (lunettes)
const ProtectionField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Protection</label>
      <select
        name="protection"
        className="form-control"
        value={postData?.protection || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="UV400">UV400</option>
        <option value="Polarisé">Polarisé</option>
        <option value="Anti-lumière bleue">Anti-lumière bleue</option>
        <option value="Photochromique">Photochromique</option>
      </select>
    </div>
  );
};

// Type de verre (lunettes)
const TypeVerreField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de verre</label>
      <select
        name="typeVerre"
        className="form-control"
        value={postData?.typeVerre || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Verre organique">Verre organique</option>
        <option value="Verre minéral">Verre minéral</option>
        <option value="Polycarbonate">Polycarbonate</option>
      </select>
    </div>
  );
};

// Mécanisme (montres)
const MecanismeField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Mécanisme</label>
      <select
        name="mecanisme"
        className="form-control"
        value={postData?.mecanisme || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Quartz">Quartz</option>
        <option value="Automatique">Automatique</option>
        <option value="Mécanique">Mécanique</option>
        <option value="Smartwatch">Smartwatch</option>
      </select>
    </div>
  );
};

// Étanchéité (montres)
const EtancheiteField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Étanchéité</label>
      <select
        name="etancheite"
        className="form-control"
        value={postData?.etancheite || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="30m">30m (pluie)</option>
        <option value="50m">50m (douche)</option>
        <option value="100m">100m (natation)</option>
        <option value="200m">200m (plongée)</option>
      </select>
    </div>
  );
};

// Type de sac
const TypeSacField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Type de sac</label>
      <select
        name="typeSac"
        className="form-control"
        value={postData?.typeSac || ''}
        onChange={handleChangeInput}
      >
        <option value="">Sélectionner</option>
        <option value="Sac à main">Sac à main</option>
        <option value="Sac à dos">Sac à dos</option>
        <option value="Valise">Valise</option>
        <option value="Portefeuille">Portefeuille</option>
        <option value="Ceinture">Ceinture</option>
        <option value="Chapeau">Chapeau</option>
        <option value="Écharpe">Écharpe</option>
      </select>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL INTELIGENTE
// ============================================

const VetementsField = (props) => {
  const { step, subCategory, articleType } = props;
  
  // Mapa de TODOS los componentes disponibles
  const customComponents = {
    // Campos comunes
    'title': <TitleField {...props} />,
    'description': <DescriptionField {...props} />,
    'marque': <MarqueField {...props} />,
    'couleur': <CouleurField {...props} />,
    'matiere': <MatiereField {...props} />,
    'etat': <EtatField {...props} />,
    'genre': <GenreField {...props} />,
    
    // Campos para vêtements
    'typeVetement': <TypeVetementField {...props} />,
    'taille': <TailleVetementField {...props} />,
    'age': <AgeField {...props} />,
    
    // Campos para chaussures
    'typeChaussure': <TypeChaussureField {...props} />,
    'pointure': <PointureField {...props} />,
    
    // Campos para bijoux & montres
    'materiau': <MateriauField {...props} />,
    'pierres': <PierresField {...props} />,
    'poids': <PoidsField {...props} />,
    'carats': <CaratsField {...props} />,
    'mecanisme': <MecanismeField {...props} />,
    'etancheite': <EtancheiteField {...props} />,
    
    // Campos para lunettes
    'typeLunette': <TypeLunetteField {...props} />,
    'monture': <MontureField {...props} />,
    'protection': <ProtectionField {...props} />,
    'typeVerre': <TypeVerreField {...props} />,
    
    // Campos para sacs
    'typeSac': <TypeSacField {...props} />,
    'dimensions': <DimensionsField {...props} />,
    
    // Otros
    'typeBijou': <TypeBijouField {...props} />,
    'typeTenue': <TypeTenueField {...props} />
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

export default VetementsField;