import React from 'react';
import { Form } from 'react-bootstrap';

const CommuneField = ({ 
  postData, 
  handleChangeInput, 
  name = 'commune',
  communes = [], // Recibe las communes como prop
  wilayaSelected = null // Para mostrar información
}) => {
  
  // Si no hay wilaya seleccionada, deshabilitamos el campo
  const isDisabled = !wilayaSelected || communes.length === 0;

  return (
    <Form.Group>
      <Form.Label>
        🏘️ Commune 
        {wilayaSelected && (
          <small className="text-muted ml-2">
            (Wilaya: {wilayaSelected})
          </small>
        )}
      </Form.Label>
      
      <Form.Control
        as="select"
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        disabled={isDisabled}
        required={!isDisabled}
      >
        <option value="">
          {isDisabled 
            ? "-- Sélectionnez d'abord une wilaya --" 
            : "-- Sélectionnez une commune --"
          }
        </option>
        
        {communes.map((commune) => (
          <option key={commune} value={commune}>
            {commune}
          </option>
        ))}
      </Form.Control>
      
      {isDisabled && (
        <Form.Text className="text-warning">
          Veuillez sélectionner une wilaya d'abord
        </Form.Text>
      )}
    </Form.Group>
  );
};

export default CommuneField;