// 📁 client/src/components/CATEGORIES/camposComun/ModeleField.js
import React, { useState, useEffect, useMemo } from 'react';
import { Form, Alert, Badge, Spinner } from 'react-bootstrap';
import FormCheckLabel from 'react-bootstrap/esm/FormCheckLabel';

// ✅ CORRECTO: ../../../data/modelsData
import { getModelsByBrand, smartModelSearch } from '../../../data/modelsData';

const ModeleField = ({ 
  mainCategory,
  subCategory,
  postData,
  handleChangeInput,
  fieldName = 'modele',
  brandField = 'marque',
  isRTL,
  t
}) => {
  const [filteredModels, setFilteredModels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const selectedBrand = postData[brandField];

  // DEBUG
  console.log('🔧 ModeleField - Props:', {
    selectedBrand,
    mainCategory,
    functions: {
      getModelsByBrand: typeof getModelsByBrand,
      smartModelSearch: typeof smartModelSearch
    }
  });

  // 🔄 Efecto para cargar modelos
  useEffect(() => {
    console.log('🔄 ModeleField useEffect para marca:', selectedBrand);
    
    if (!selectedBrand || selectedBrand === 'autre') {
      setFilteredModels([]);
      return;
    }

    setIsLoading(true);

    const timer = setTimeout(() => {
      try {
        console.log('📦 Obteniendo modelos para:', selectedBrand);
        const models = getModelsByBrand(selectedBrand, mainCategory);
        console.log('✅ Modelos obtenidos:', models.length);
        setFilteredModels(models);
      } catch (error) {
        console.error('❌ Error en ModeleField:', error);
        setFilteredModels([]);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedBrand, mainCategory]);

  // Render condicional
  if (!selectedBrand) {
    return (
      <Alert variant="warning" className="my-3">
        <strong>ℹ️ Sélectionnez d'abord une marque</strong>
      </Alert>
    );
  }

  if (selectedBrand === 'autre') {
    return (
      <Form.Group className="mb-4">
        <Form.Label>🛠️ Modèle (Marque personnalisée)</Form.Label>
        <Form.Control
          type="text"
          name={fieldName}
          value={postData[fieldName] || ''}
          onChange={handleChangeInput}
          placeholder="Entrez le modèle"
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    );
  }

  return (
    <FormCheckLabel>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Label className="fw-bold mb-0">
          🛠️ Modèle
          
        </Form.Label>
      </div>

      <Form.Select
        name={fieldName}
        value={postData[fieldName] || ''}
        onChange={handleChangeInput}
        dir={isRTL ? 'rtl' : 'ltr'}
        disabled={isLoading}
      >
        <option value="">
          {isLoading ? 'Chargement...' : 'Sélectionnez un modèle'}
        </option>

        {filteredModels.map(model => (
          <option key={model} value={model}>{model}</option>
        ))}

        <option value="autre">Autre modèle...</option>
      </Form.Select>

      <div className="mt-2">
        <small className="text-muted">
          <i className="fas fa-list me-1"></i>
          {filteredModels.length} modèles disponibles pour {selectedBrand}
        </small>
      </div>
    </FormCheckLabel>
  );
};

export default ModeleField;