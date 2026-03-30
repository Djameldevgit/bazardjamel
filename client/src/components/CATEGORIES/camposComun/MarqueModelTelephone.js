// components/CATEGORIES/camposComun/MarqueModelTelephone.js
import React, { useState, useEffect } from 'react';
import telefonosData from './json/telefonos.json';

const MarqueModelTelephone = ({
  mainCategory,
  subCategory,
  postData,
  handleChangeInput,
  fieldName,
  isRTL,
  t,
  ...props
}) => {
  const [selectedMarque, setSelectedMarque] = useState(postData?.marque || "");
  const [modelos, setModelos] = useState([]);

  useEffect(() => {
    if (selectedMarque && telefonosData) {
      const marcaEncontrada = telefonosData.find((marca) => 
        marca.marca === selectedMarque
      );
      
      let modelosList = [];
      
      if (marcaEncontrada) {
        // Usando la propiedad "modelo" como en tu JSON
        if (marcaEncontrada.modelo && Array.isArray(marcaEncontrada.modelo)) {
          modelosList = marcaEncontrada.modelo;
        }
      }
      
      setModelos(modelosList);
      
      if (!postData?.modelo && modelosList.length > 0) {
        handleChangeInput({
          target: {
            name: 'modelo',
            value: modelosList[0]
          }
        });
      }
    } else {
      setModelos([]);
    }
  }, [selectedMarque, telefonosData, postData?.modelo, handleChangeInput]);

  const handleMarqueChange = (e) => {
    const value = e.target.value;
    setSelectedMarque(value);
    
    handleChangeInput({
      target: {
        name: 'marque',
        value: value
      }
    });
    
    if (postData?.modelo) {
      handleChangeInput({
        target: {
          name: 'modelo',
          value: ''
        }
      });
    }
  };

  const handleModeloChange = (e) => {
    handleChangeInput({
      target: {
        name: 'modelo',
        value: e.target.value
      }
    });
  };

  return (
    <div className="form-field mb-3">
      <label className="form-label fw-bold">
        {t ? t('phoneInfo') : 'Información del Teléfono'} 
        <span className="text-danger">*</span>
      </label>
      
      {/* Marca */}
      <div className="mb-3">
        <label htmlFor="marque" className="form-label">
          {t ? t('brand') : 'Marca'}
        </label>
        <select
          id="marque"
          name="marque"
          value={selectedMarque}
          onChange={handleMarqueChange}
          required
          dir={isRTL ? 'rtl' : 'ltr'}
          className="form-select form-select-lg"
        >
          <option value="">{t ? t('selectBrand') : 'Sélectionnez une marque'}</option>
          {telefonosData && telefonosData.map((marca, index) => (
            <option key={index} value={marca.marca}>
              {marca.marca}
            </option>
          ))}
        </select>
      </div>
      
      {/* Modelo */}
      {selectedMarque && modelos.length > 0 && (
        <div className="mb-3">
          <label htmlFor="modelo" className="form-label">
            {t ? t('model') : 'Modelo'}
          </label>
          <select
            id="modelo"
            name="modelo"
            value={postData?.modelo || ''}
            onChange={handleModeloChange}
            required
            dir={isRTL ? 'rtl' : 'ltr'}
            className="form-select form-select-lg"
          >
            <option value="">{t ? t('selectModel') : 'Sélectionnez un modèle'}</option>
            {modelos.map((modelo, index) => (
              <option key={index} value={modelo}>
                {modelo}
              </option>
            ))}
          </select>
        </div>
      )}
      
      {selectedMarque && modelos.length === 0 && (
        <div className="alert alert-warning mt-2">
          <small>
            <i className="fas fa-exclamation-triangle me-1"></i>
            {t ? t('noModelsAvailable') : 'Aucun modèle disponible pour cette marque'}
          </small>
        </div>
      )}
      
      <div className="form-text text-muted">
        {t ? t('phoneHelp') : 'Sélectionnez la marque et le modèle de votre téléphone'}
      </div>
    </div>
  );
};

export default MarqueModelTelephone;