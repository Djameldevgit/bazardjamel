// 📂 components/CATEGORIES/specificFields/AlimentairesField.js
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
        placeholder="Décrivez votre produit alimentaire..."
        value={postData?.description || ''}
        onChange={handleChangeInput}
        required
      />
      <small className="text-muted">Décrivez les caractéristiques, la composition, etc.</small>
    </div>
  );
};

// ============================================
// CAMPOS ESPECÍFICOS PARA ALIMENTAIRES
// ============================================

// Type de produit
const TypeProduitField = ({ postData, handleChangeInput }) => {
  const typeProduits = [
    { value: 'Produits laitiers', label: '🥛 Produits laitiers' },
    { value: 'Fruits secs', label: '🍇 Fruits secs' },
    { value: 'Graines - Riz - Céréales', label: '🌾 Graines - Riz - Céréales' },
    { value: 'Sucres & Produits sucrés', label: '🍯 Sucres & Produits sucrés' },
    { value: 'Boissons', label: '🥤 Boissons' },
    { value: 'Viandes & Poissons', label: '🍖 Viandes & Poissons' },
    { value: 'Café - Thé - Infusion', label: '☕ Café - Thé - Infusion' },
    { value: 'Compléments alimentaires', label: '💊 Compléments alimentaires' },
    { value: 'Miel & Dérivés', label: '🍯 Miel & Dérivés' },
    { value: 'Fruits & Légumes', label: '🍎 Fruits & Légumes' },
    { value: 'Blé & Farine', label: '🌾 Blé & Farine' },
    { value: 'Bonbons & Chocolat', label: '🍬 Bonbons & Chocolat' },
    { value: 'Boulangerie & Viennoiserie', label: '🥖 Boulangerie & Viennoiserie' },
    { value: 'Ingrédients cuisine', label: '🍳 Ingrédients cuisine' },
    { value: 'Noix & Graines', label: '🥜 Noix & Graines' },
    { value: 'Plats cuisinés', label: '🍲 Plats cuisinés' },
    { value: 'Sauces - Epices - Condiments', label: '🌶️ Sauces - Epices - Condiments' },
    { value: 'Œufs', label: '🥚 Œufs' },
    { value: 'Huiles', label: '🫒 Huiles' },
    { value: 'Pâtes', label: '🍝 Pâtes' },
    { value: 'Gateaux', label: '🍰 Gateaux' },
    { value: 'Emballage', label: '📦 Emballage' },
    { value: 'Aliments pour bébé', label: '👶 Aliments pour bébé' },
    { value: 'Aliments diététiques', label: '🥗 Aliments diététiques' },
    { value: 'Autre', label: '📦 Autre' }
  ];
  
  const selectedOption = typeProduits.find(opt => opt.value === postData?.typeProduit) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'typeProduit', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">
        Type de produit <span className="text-danger">*</span>
      </label>
      <Select
        name="typeProduit"
        options={typeProduits}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le type de produit..."
        required
      />
    </div>
  );
};

// Marque (opcional para alimentaires)
const MarqueField = ({ postData, handleChangeInput }) => {
  const marques = [
    { value: 'Danone', label: 'Danone' },
    { value: 'Lactel', label: 'Lactel' },
    { value: 'Candia', label: 'Candia' },
    { value: 'Nestlé', label: 'Nestlé' },
    { value: 'Coca-Cola', label: 'Coca-Cola' },
    { value: 'Pepsi', label: 'Pepsi' },
    { value: 'Oasis', label: 'Oasis' },
    { value: 'Tropicana', label: 'Tropicana' },
    { value: 'Milka', label: 'Milka' },
    { value: 'Lindt', label: 'Lindt' },
    { value: 'Ferrero', label: 'Ferrero' },
    { value: 'Kellogg\'s', label: 'Kellogg\'s' },
    { value: 'Nutella', label: 'Nutella' },
    { value: 'Findus', label: 'Findus' },
    { value: 'Maggi', label: 'Maggi' },
    { value: 'Knorr', label: 'Knorr' },
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
        placeholder="Sélectionner la marque (optionnel)"
        isClearable
      />
      <small className="text-muted">Optionnel - Sélectionnez une marque si disponible</small>
    </div>
  );
};

// Date de péremption
const DatePeremptionField = ({ postData, handleChangeInput }) => {
  // Calculer la date minimale (aujourd'hui)
  const today = new Date().toISOString().split('T')[0];
  // Calculer la date maximale (1 an après)
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() + 1);
  const maxDateStr = maxDate.toISOString().split('T')[0];
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">
        Date de péremption <span className="text-danger">*</span>
      </label>
      <input
        type="date"
        name="datePeremption"
        className="form-control"
        min={today}
        max={maxDateStr}
        value={postData?.datePeremption || ''}
        onChange={handleChangeInput}
        required
      />
      <small className="text-muted">La date de péremption doit être valide</small>
    </div>
  );
};

// Conditionnement
const ConditionnementField = ({ postData, handleChangeInput }) => {
  const conditionnements = [
    { value: 'Unité', label: 'Unité (1 pièce)' },
    { value: 'Lot de 2', label: 'Lot de 2' },
    { value: 'Lot de 3', label: 'Lot de 3' },
    { value: 'Lot de 4', label: 'Lot de 4' },
    { value: 'Lot de 5', label: 'Lot de 5' },
    { value: 'Lot de 6', label: 'Lot de 6' },
    { value: 'Lot de 10', label: 'Lot de 10' },
    { value: 'Pack familial', label: 'Pack familial' },
    { value: 'Sachet', label: 'Sachet' },
    { value: 'Boîte', label: 'Boîte' },
    { value: 'Carton', label: 'Carton' },
    { value: 'Bidon', label: 'Bidon' },
    { value: 'Bouteille', label: 'Bouteille' },
    { value: 'Pot', label: 'Pot' },
    { value: 'Barquette', label: 'Barquette' }
  ];
  
  const selectedOption = conditionnements.find(opt => opt.value === postData?.conditionnement) || null;
  
  const handleChange = (selected) => {
    handleChangeInput({
      target: { name: 'conditionnement', value: selected?.value || '' }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">
        Conditionnement <span className="text-danger">*</span>
      </label>
      <Select
        name="conditionnement"
        options={conditionnements}
        value={selectedOption}
        onChange={handleChange}
        className="basic-single-select"
        classNamePrefix="select"
        placeholder="Sélectionner le conditionnement..."
        required
      />
      <small className="text-muted">Comment est conditionné le produit</small>
    </div>
  );
};

// Poids / Quantité
const PoidsQuantiteField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Poids / Quantité</label>
      <div className="input-group">
        <input
          type="number"
          name="poidsQuantite"
          className="form-control"
          placeholder="Quantité"
          value={postData?.poidsQuantite || ''}
          onChange={handleChangeInput}
          step="0.1"
        />
        <select
          name="unitePoids"
          className="form-select"
          value={postData?.unitePoids || 'kg'}
          onChange={handleChangeInput}
          style={{ width: '100px' }}
        >
          <option value="g">grammes (g)</option>
          <option value="kg">kilogrammes (kg)</option>
          <option value="ml">millilitres (ml)</option>
          <option value="l">litres (L)</option>
          <option value="piece">pièce(s)</option>
        </select>
      </div>
      <small className="text-muted">Exemple: 500g, 1kg, 2L, etc.</small>
    </div>
  );
};

// Composition / Ingrédients
const CompositionField = ({ postData, handleChangeInput }) => {
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Composition / Ingrédients</label>
      <textarea
        name="composition"
        className="form-control"
        rows="3"
        placeholder="Liste des ingrédients, composition..."
        value={postData?.composition || ''}
        onChange={handleChangeInput}
      />
      <small className="text-muted">Indiquez les ingrédients principaux</small>
    </div>
  );
};

// Certifications
const CertificationsField = ({ postData, handleChangeInput }) => {
  const certifications = [
    { value: 'Bio', label: '🌿 Bio' },
    { value: 'Halal', label: '🕌 Halal' },
    { value: 'Sans gluten', label: '🚫 Sans gluten' },
    { value: 'Vegan', label: '🌱 Vegan' },
    { value: 'Végétarien', label: '🥬 Végétarien' },
    { value: 'Sans lactose', label: '🥛 Sans lactose' },
    { value: 'Label Rouge', label: '🔴 Label Rouge' },
    { value: 'IGP', label: '🏷️ IGP' },
    { value: 'AOP', label: '🏷️ AOP' }
  ];
  
  const selectedValues = postData?.certifications || [];
  const selectedOptions = certifications.filter(opt => selectedValues.includes(opt.value));
  
  const handleChange = (selected) => {
    const values = selected ? selected.map(opt => opt.value) : [];
    handleChangeInput({
      target: { name: 'certifications', value: values }
    });
  };
  
  return (
    <div className="mb-3">
      <label className="form-label fw-bold">Certifications</label>
      <Select
        isMulti
        name="certifications"
        options={certifications}
        value={selectedOptions}
        onChange={handleChange}
        className="basic-multi-select"
        classNamePrefix="select"
        placeholder="Sélectionner les certifications..."
      />
      <small className="text-muted">Certifications et labels du produit</small>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const AlimentairesFields = (props) => {
  const { step, subCategory, articleType } = props;
  
  // Mapa de TODOS los componentes disponibles
  const customComponents = {
    // Campos comunes
    'title': <TitleField {...props} />,
    'description': <DescriptionField {...props} />,
    
    // Campos específicos para alimentaires
    'typeProduit': <TypeProduitField {...props} />,
    'marque': <MarqueField {...props} />,
    'datePeremption': <DatePeremptionField {...props} />,
    'conditionnement': <ConditionnementField {...props} />,
    'poidsQuantite': <PoidsQuantiteField {...props} />,
    'composition': <CompositionField {...props} />,
    'certifications': <CertificationsField {...props} />
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

export default AlimentairesFields;