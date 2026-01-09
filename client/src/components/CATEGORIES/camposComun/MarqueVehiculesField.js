// src/components/CATEGORIES/camposComun/MarqueVehiculesField.js
import React from 'react';

const MarqueVehiculesField = ({
  mainCategory,
  subCategory,
  fieldName,
  postData,
  handleChangeInput,
  isRTL,
  t,
  ...props
}) => {
  
  return (
    <div className="form-field mb-3">
      <label htmlFor="marqueVehicules" className="form-label fw-bold">
        {t ? t('marque') : 'Marque'} 
        <span className="text-danger">*</span>
      </label>
      <input
        type="text"
        id="marqueVehicules"
        name="marqueVehicules"
        value={postData?.marqueVehicules || ''}
        onChange={handleChangeInput}
        required
        placeholder={t ? t('enterMarque') : 'Entrez la marque du véhicule'}
        dir={isRTL ? 'rtl' : 'ltr'}
        className="form-control form-control-lg"
        style={{
          textAlign: isRTL ? 'right' : 'left'
        }}
        maxLength="50"
      />
      <div className="form-text text-muted">
        {t ? t('marqueHelp') : 'Ex: Honda, Yamaha, Renault, etc.'}
      </div>
    </div>
  );
};

export default MarqueVehiculesField;