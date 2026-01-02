import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import WilayaField from './WilayaField';
import CommuneField from './CommuneField';
import wilayasData from './json/wilayas.json'; // Importa tu JSON
 
const WilayaCommunesField = ({ 
  postData, 
  handleChangeInput 
}) => {
  const [selectedWilaya, setSelectedWilaya] = useState(null);
  const [communesList, setCommunesList] = useState([]);

  // Cuando se selecciona una wilaya, actualizamos las communes
  const handleWilayaChange = (wilaya) => {
    if (wilaya) {
      setSelectedWilaya(wilaya.wilaya);
      setCommunesList(wilaya.commune || []);
    } else {
      setSelectedWilaya(null);
      setCommunesList([]);
      // Limpiamos también la commune seleccionada
      handleChangeInput({
        target: { name: 'commune', value: '' }
      });
    }
  };

  // Sincronizar cuando cambia postData.wilaya desde otro lugar
  useEffect(() => {
    if (postData.wilaya && !selectedWilaya) {
      const wilaya = wilayasData.find(w => w.wilaya === postData.wilaya);
      if (wilaya) {
        setSelectedWilaya(wilaya.wilaya);
        setCommunesList(wilaya.commune || []);
      }
    }
  }, [postData.wilaya]);

  return (
    <div className="localisation-wrapper">
      <h6 className="mb-3">📍 Localisation</h6>
      
      <Row>
        <Col md={6}>
          <WilayaField
            postData={postData}
            handleChangeInput={handleChangeInput}
            name="wilaya"
            onWilayaChange={handleWilayaChange}
          />
        </Col>
        
        <Col md={6}>
          <CommuneField
            postData={postData}
            handleChangeInput={handleChangeInput}
            name="commune"
            communes={communesList}
            wilayaSelected={selectedWilaya}
          />
        </Col>
      </Row>
      
      {selectedWilaya && (
        <div className="mt-2">
          <small className="text-info">
            <strong>Wilaya sélectionnée:</strong> {selectedWilaya} 
            {postData.commune && ` • Commune: ${postData.commune}`}
          </small>
        </div>
      )}
    </div>
  );
};

export default WilayaCommunesField;