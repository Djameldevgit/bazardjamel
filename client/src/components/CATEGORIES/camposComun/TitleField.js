// src/components/CATEGORIES/camposComun/TitleField.js
import React from 'react';

const TitleField = ({
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
      <label htmlFor="title" className="form-label fw-bold">
        {t ? t('title') : 'Titre'} 
        <span className="text-danger">*</span>
      </label>
      <input
        type="text"
        id="title"
        name="title"
        value={postData?.title || ''}
        onChange={handleChangeInput}
        required
        placeholder={t ? t('enterTitle') : 'Entrez le titre de l\'annonce'}
        dir={isRTL ? 'rtl' : 'ltr'}
        className="form-control form-control-lg"
        style={{
          textAlign: isRTL ? 'right' : 'left'
        }}
      />
      <div className="form-text text-muted">
        {t ? t('titleHelp') : 'Un titre clair et descriptif augmente la visibilité'}
      </div>
    </div>
  );
};

export default TitleField;