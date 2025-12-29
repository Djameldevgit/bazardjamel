import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
const DescriptionField = ({ postData, handleChangeInput, isRTL, name = 'description', label = 'description', rows = 3 }) => {
  const { t } = useTranslation('camposcomunes');
  
  return (
    <Form.Group>
      <Form.Label>📝 {t(label)}</Form.Label>
      <Form.Control
        as="textarea"
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        rows={rows}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
    </Form.Group>
  );
};

export default DescriptionField;