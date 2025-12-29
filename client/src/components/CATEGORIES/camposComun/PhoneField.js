import React from 'react';
import { Form } from 'react-bootstrap';

const PhoneField = ({ postData, handleChangeInput, isRTL, name = 'contactPhone', label = 'contact_phone' }) => {
  const { t } = useTranslation('camposcomunes');
  
  return (
    <Form.Group>
      <Form.Label>📞 {t(label)}</Form.Label>
      <Form.Control
        type="tel"
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        placeholder={t('telephone')}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
    </Form.Group>
  );
};
export default PhoneField;
  