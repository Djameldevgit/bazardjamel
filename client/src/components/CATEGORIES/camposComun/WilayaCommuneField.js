// components/CATEGORIES/camposComun/WilayaCommunesField.js
import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import wilayasData from './json/wilayas.json';

const WilayaCommunesField = ({ 
  postData, 
  handleChangeInput,
  fieldName = "wilaya" // Por compatibilidad
}) => {
  const [communes, setCommunes] = useState([]);
  const [selectedWilaya, setSelectedWilaya] = useState(postData.wilaya || '');

  // Manejar cambio de wilaya
  const handleWilayaChange = (e) => {
    const wilayaName = e.target.value;
    
    // Actualizar estado local
    setSelectedWilaya(wilayaName);
    
    // Ejecutar el cambio en el formulario principal
    handleChangeInput(e);
    
    // Buscar y establecer las comunas para esta wilaya
    if (wilayaName) {
      const foundWilaya = wilayasData.find(w => w.wilaya === wilayaName);
      const newCommunes = foundWilaya ? foundWilaya.commune || [] : [];
      setCommunes(newCommunes);
      
      // Limpiar commune automáticamente cuando cambia la wilaya
      handleChangeInput({
        target: { name: 'commune', value: '' }
      });
    } else {
      setCommunes([]);
    }
  };

  // Sincronizar cuando postData.wilaya cambia externamente
  useEffect(() => {
    if (postData.wilaya && postData.wilaya !== selectedWilaya) {
      setSelectedWilaya(postData.wilaya);
      
      const foundWilaya = wilayasData.find(w => w.wilaya === postData.wilaya);
      if (foundWilaya) {
        setCommunes(foundWilaya.commune || []);
      }
    }
  }, [postData.wilaya]);

  return (
    <div className="wilaya-commune-field">
      <Row>
        {/* Campo Wilaya */}
        <Col md={6}>
          <Form.Group>
            <Form.Label>📍 Wilaya</Form.Label>
            <Form.Select
              name="wilaya"
              value={selectedWilaya}
              onChange={handleWilayaChange}
              required
            >
              <option value="">Sélectionner une wilaya</option>
              {wilayasData.map((wilaya, index) => (
                <option key={index} value={wilaya.wilaya}>
                  {wilaya.wilaya}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        
        {/* Campo Commune - Solo se habilita cuando hay wilaya seleccionada */}
        <Col md={6}>
          <Form.Group>
            <Form.Label>🏙️ Commune</Form.Label>
            <Form.Select
              name="commune"
              value={postData.commune || ''}
              onChange={handleChangeInput}
              disabled={!selectedWilaya || communes.length === 0}
              required={!!selectedWilaya}
            >
              <option value="">
                {!selectedWilaya 
                  ? 'Choisir d\'abord une wilaya' 
                  : communes.length === 0
                    ? 'Aucune commune disponible'
                    : 'Sélectionner une commune'
                }
              </option>
              {communes.map((commune, index) => (
                <option key={index} value={commune}>
                  {commune}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      
      {/* Información de ayuda */}
      <div className="mt-2">
        <small className="text-muted">
          {selectedWilaya && (
            <>
              <span className="text-info">
                <strong>{selectedWilaya}</strong>
                {postData.commune && ` • ${postData.commune}`}
              </span>
              <span className="ms-2">
                ({communes.length} communes disponibles)
              </span>
            </>
          )}
        </small>
      </div>
    </div>
  );
};

export default WilayaCommunesField;