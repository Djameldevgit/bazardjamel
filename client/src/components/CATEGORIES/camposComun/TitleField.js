// components/camposComun/TitleField.js
import React from 'react';
import { Form } from 'react-bootstrap';

const TitleField = ({ 
  postData, 
  handleChangeInput, 
  name = 'title'
}) => {
  
  return (
    <Form.Group>
      <Form.Label>📝 Titre</Form.Label>
      <Form.Control
        type="text"
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        placeholder="Entrez le titre"
        required
      />
    </Form.Group>
  );
};

export default TitleField;