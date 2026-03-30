// components/CATEGORIES/camposComun/MarqueModelVehicule.js
import React, { useState, useEffect } from 'react';
import vehiculesData from './json/vehicules.json';

const MarqueModelVehicule = ({
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
    if (selectedMarque && vehiculesData) {
      const marcaEncontrada = vehiculesData.find((marca) => 
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
  }, [selectedMarque, vehiculesData, postData?.modelo, handleChangeInput]);

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
        {t ? t('vehicleInfo') : 'Información del Vehículo'} 
        <span className="text-danger">*</span>
      </label>
      
      {/* Marca */}
      <div className="mb-3">
        <label htmlFor="marqueVehicule" className="form-label">
          {t ? t('brand') : 'Marca'}
        </label>
        <select
          id="marqueVehicule"
          name="marque"
          value={selectedMarque}
          onChange={handleMarqueChange}
          required
          dir={isRTL ? 'rtl' : 'ltr'}
          className="form-select form-select-lg"
        >
          <option value="">{t ? t('selectBrand') : 'Sélectionnez une marque'}</option>
          {vehiculesData && vehiculesData.map((marca, index) => (
            <option key={index} value={marca.marca}>
              {marca.marca}
            </option>
          ))}
        </select>
      </div>
      
      {/* Modelo */}
      {selectedMarque && modelos.length > 0 && (
        <div className="mb-3">
          <label htmlFor="modeloVehicule" className="form-label">
            {t ? t('model') : 'Modelo'}
          </label>
          <select
            id="modeloVehicule"
            name="modelo"
            value={postData?.modelo || ''}
            onChange={handleModeloChange}
            required
            dir={isRTL ? 'rtl' : 'ltr'}
            className="form-select form-select-lg"
          >
            <option value="">{t ? t('selectModel') : 'Sélectionnez un modèle'}</option>
            {modelos.map((modelo, index) => {
              // Manejar si el modelo es string o array anidado
              if (typeof modelo === 'string') {
                return (
                  <option key={index} value={modelo}>
                    {modelo}
                  </option>
                );
              } else if (Array.isArray(modelo)) {
                // Si es un array anidado, mostrar el primer elemento
                return (
                  <option key={index} value={modelo[0]}>
                    {modelo[0]}
                  </option>
                );
              }
              return null;
            })}
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
        {t ? t('vehicleHelp') : 'Sélectionnez la marque et le modèle de votre véhicule'}
      </div>
    </div>
  );
};

export default MarqueModelVehicule;