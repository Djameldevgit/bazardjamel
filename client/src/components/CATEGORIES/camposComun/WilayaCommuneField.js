import React, { useState, useEffect } from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const WilayaCommuneField = ({ postData, handleChangeInput, isRTL, t }) => {
  // Ejemplo de datos de wilayas y communes (en producción vendría de API)
  const [communes, setCommunes] = useState([]);
  
  const wilayas = [
    { code: '16', name: 'Alger' },
    { code: '31', name: 'Oran' },
    { code: '25', name: 'Constantine' },
    { code: '19', name: 'Sétif' },
    // ... agregar más
  ];
  
  useEffect(() => {
    // Cuando cambia la wilaya, cargar sus communes
    if (postData.wilaya) {
      // Simulación: en producción sería una llamada API
      const communesByWilaya = {
        '16': ['Alger-Centre', 'Hussein Dey', 'Sidi M\'hamed'],
        '31': ['Oran', 'Es-Senia', 'Bir El Djir'],
        '25': ['Constantine', 'El Khroub', 'Ain Smara'],
      };
      
      setCommunes(communesByWilaya[postData.wilaya] || []);
    }
  }, [postData.wilaya]);
  
  return (
    <>
      <Row>
        <Col md={6}>
          <Form.Group>
            <Form.Label>📍 {t('wilaya', 'Wilaya')}</Form.Label>
            <Form.Select
              name="wilaya"
              value={postData.wilaya || ''}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="">{t('select_wilaya', 'Sélectionnez une wilaya')}</option>
              {wilayas.map(wilaya => (
                <option key={wilaya.code} value={wilaya.code}>
                  {wilaya.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group>
            <Form.Label>🏘️ {t('commune', 'Commune')}</Form.Label>
            <Form.Select
              name="commune"
              value={postData.commune || ''}
              onChange={handleChangeInput}
              dir={isRTL ? 'rtl' : 'ltr'}
              disabled={!postData.wilaya}
            >
              <option value="">{t('select_commune', 'Sélectionnez une commune')}</option>
              {communes.map(commune => (
                <option key={commune} value={commune}>
                  {commune}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};

export default WilayaCommuneField;