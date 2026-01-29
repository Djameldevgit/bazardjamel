// 📂 components/CATEGORIES/specificFields/VehiculesFields.js
import React from 'react';
import BaseCategoryField from './BaseCategoryField'; // ✅ Importar el base

const VehiculesFields = ({
  fieldName,
  mainCategory,
  subCategory,
  articleType,
  postData,
  handleChangeInput,
  isRTL,
  t
}) => {
  
  // 1. Primero, dejar que BaseCategoryField maneje los campos comunes
  const commonField = BaseCategoryField({
    fieldName,
    mainCategory,
    subCategory,
    postData,
    handleChangeInput,
    isRTL,
    t
  });
  
  if (commonField) {
    return commonField; // ✅ Si es campo común, usar BaseCategoryField
  }
  
  // 2. Solo manejar campos ESPECÍFICOS de vehículos
  switch(fieldName) {
    case 'marque':
      return (
        <div className="mb-3">
          <label className="form-label">Marque du véhicule *</label>
          <select
            className="form-select"
            name="marque"
            value={postData.marque || ''}
            onChange={handleChangeInput}
            required
          >
            <option value="">Sélectionnez une marque</option>
            <option value="Toyota">Toyota</option>
            <option value="Renault">Renault</option>
            {/* ... otras marques */}
          </select>
        </div>
      );
    
    case 'modele':
      return (
        <div className="mb-3">
          <label className="form-label">Modèle *</label>
          <input
            type="text"
            className="form-control"
            name="modele"
            value={postData.modele || ''}
            onChange={handleChangeInput}
            placeholder="Ex: Corolla, Clio, etc."
            required
          />
        </div>
      );
    
    // ... otros campos específicos de vehículos
    
    default:
      return (
        <div className="alert alert-warning">
          <small>
            <i className="fas fa-exclamation-triangle me-2"></i>
            Champ non géré: <strong>{fieldName}</strong>
          </small>
        </div>
      );
  }
};

export default VehiculesFields;