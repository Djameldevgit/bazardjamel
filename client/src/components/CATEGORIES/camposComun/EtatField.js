import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const EtatField = ({ 
  postData, 
  handleChangeInput, 
  isRTL, 
  name = 'etat', 
  label = 'etat',
  options = null // Permite personalizar opciones
}) => {
  const { t } = useTranslation('camposcomunes');
  
  // Opciones por defecto (estado general del producto)
  const defaultOptions = [
    { value: 'new', label: 'neuf' },
    { value: 'like_new', label: 'comme_neuf' },
    { value: 'good', label: 'bon_etat' },
    { value: 'used', label: 'utilise' },
    { value: 'refurbished', label: 'reconditionne' },
    { value: 'defective', label: 'defectueux' }
  ];
  
  const displayOptions = options || defaultOptions;

  return (
    <Form.Group>
      <Form.Label>🏷️ {t(label)}</Form.Label>
      <Form.Select
        name={name}
        value={postData[name] || ''}
        onChange={handleChangeInput}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <option value="">{t('select_etat', 'Sélectionnez l\'état')}</option>
        {displayOptions.map(option => (
          <option key={option.value} value={option.value}>
            {t(option.label, option.label)}
          </option>
        ))}
      </Form.Select>
    </Form.Group>
  );
};

export default EtatField;