import React from 'react';
import { Form } from 'react-bootstrap';

const WilayaField = ({ 
  postData, 
  handleChangeInput, 
  name = 'wilaya',
  onWilayaChange = null,
  wilayasData = [] // Recibir como prop
}) => {
  
  const handleChange = (e) => {
    handleChangeInput(e);
    
    // Si hay función callback, la ejecutamos con la wilaya seleccionada
    if (onWilayaChange && e.target.value) {
      const selectedWilaya = wilayasData.find(w => w.wilaya === e.target.value);
      console.log('🔍 Wilaya encontrada:', selectedWilaya);
      onWilayaChange(selectedWilaya);
    } else if (onWilayaChange && !e.target.value) {
      onWilayaChange(null);
    }
  };

  return (
    <Form.Group>
      <Form.Label>📍 Wilaya</Form.Label>
      <Form.Control
        as="select"
        name={name}
        value={postData[name] || ''}
        onChange={handleChange}
        required
      >
        <option value="">-- Sélectionnez une wilaya --</option>
        {wilayasData.map((wilaya, index) => (
          <option key={`${wilaya.wilaya}-${index}`} value={wilaya.wilaya}>
            {wilaya.wilaya}
          </option>
        ))}
      </Form.Control>
    </Form.Group>
  );
};

export default WilayaField;