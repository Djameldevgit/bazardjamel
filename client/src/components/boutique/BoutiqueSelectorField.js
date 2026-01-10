// 📂 src/components/CATEGORIES/camposComun/BoutiqueSelectorField.js
import React, { useState } from 'react';
import BoutiqueSelector from './BoutiqueSelector';

const BoutiqueSelectorField = ({
  postData,
  handleChangeInput,
  fieldName = 'boutiqueId',
  isRTL,
  t
}) => {
  const [selectedBoutiqueId, setSelectedBoutiqueId] = useState(postData[fieldName] || null);
  
  const handleSelectBoutique = (boutiqueId) => {
    setSelectedBoutiqueId(boutiqueId);
    handleChangeInput({
      target: {
        name: fieldName,
        value: boutiqueId
      }
    });
  };
  
  return (
    <div className="mb-4">
      <label className="form-label fw-bold d-flex align-items-center">
        <i className="fas fa-store me-2"></i>
        Associer à une boutique (optionnel)
      </label>
      
      <div className="alert alert-info mb-3">
        <small>
          <i className="fas fa-info-circle me-1"></i>
          Associer ce produit à l'une de vos boutiques le rendra visible dans votre boutique en ligne.
          Les acheteurs pourront voir tous vos produits au même endroit.
        </small>
      </div>
      
      <BoutiqueSelector
        selectedBoutiqueId={selectedBoutiqueId}
        onSelectBoutique={handleSelectBoutique}
        showCreateButton={true}
      />
      
      {selectedBoutiqueId && (
        <div className="mt-3 alert alert-success">
          <i className="fas fa-check-circle me-2"></i>
          Ce produit sera visible dans votre boutique
        </div>
      )}
    </div>
  );
};

export default BoutiqueSelectorField;