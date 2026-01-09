// src/components/CATEGORIES/camposComun/ModeleVehiculesField.js
import React from 'react';

const ModeleVehiculesField = ({
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
      <label htmlFor="modeleVehicules" className="form-label fw-bold">
        {t ? t('modele') : 'Modèle'} 
        <span className="text-danger">*</span>
      </label>
      <input
        type="text"
        id="modeleVehicules"
        name="modeleVehicules"
        value={postData?.modeleVehicules || ''}
        onChange={handleChangeInput}
        required
        placeholder={t ? t('enterModele') : 'Entrez le modèle du véhicule'}
        dir={isRTL ? 'rtl' : 'ltr'}
        className="form-control form-control-lg"
        style={{
          textAlign: isRTL ? 'right' : 'left'
        }}
        maxLength="50"
      />
      <div className="form-text text-muted">
        {t ? t('modeleHelp') : 'Ex: CBR 600, Master, FH16, etc.'}
      </div>
    </div>
  );
};

export default ModeleVehiculesField;