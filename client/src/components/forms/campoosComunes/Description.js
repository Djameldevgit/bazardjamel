import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Description = ({
  postData = {},
  handleChangeInput,
  name = 'description',
  label = '📝 Descripción',
  required = false,
  className = 'mb-3',
  disabled = false,
  error = null,
  theme = 'light',
  rows = 4,
  maxLength = 500
}) => {
  const { t, i18n } = useTranslation('des');
  const isRTL = i18n.language === 'ar';
  
  // Extraer valor de postData
  const value = postData?.description || '';
  const charCount = value?.length || 0;

  // ESTILOS IDÉNTICOS A MODELO
  const styles = {
    formControl: {
      border: `1px solid ${theme === 'dark' ? '#4a5568' : '#cbd5e0'}`,
      backgroundColor: theme === 'dark' ? '#2d3748' : '#ffffff',
      padding: '10px 12px',
      borderRadius: '8px',
      color: theme === 'dark' ? 'white' : '#2d3748',
      width: '100%',
      fontSize: '14px',
      minHeight: `${rows * 24}px`,
      resize: 'vertical'
    },
    formLabel: {
      fontWeight: '600',
      marginBottom: '6px',
      display: 'block',
      color: theme === 'dark' ? '#e2e8f0' : '#2d3748'
    }
  };

  return (
    <Form.Group className={className}>
      {/* EXACTAMENTE LA MISMA LÓGICA QUE MODELO: {label} directamente */}
      <Form.Label style={styles.formLabel}>
        {label} {required && '*'}
      </Form.Label>
      
      {/* TEXTAREA con estilos idénticos */}
      <Form.Control
        as="textarea"
        name={name}
        value={value}
        onChange={handleChangeInput}
        required={required}
        disabled={disabled}
        isInvalid={!!error}
        style={{
          ...styles.formControl,
          textAlign: isRTL ? 'right' : 'left',
          direction: isRTL ? 'rtl' : 'ltr'
        }}
        placeholder={t('description.placeholder', 'Describe tu producto...')}
        rows={rows}
        maxLength={maxLength}
      />
      
      {/* CONTADOR DE CARACTERES */}
      <div className="text-muted small mt-1" style={{
        textAlign: isRTL ? 'left' : 'right',
        direction: 'ltr'
      }}>
        {charCount}/{maxLength}
      </div>
      
      {/* FEEDBACK DE ERROR IDÉNTICO A MODELO */}
      {error && (
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default Description;