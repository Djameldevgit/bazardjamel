import React from 'react';
import { Form } from 'react-bootstrap';

const Title = ({
  postData = {},
  handleChangeInput,
  name = 'title',
  label = '📄 Título',
  required = false,
  className = 'mb-3',
  disabled = false,
  error = null,
  theme = 'light'
}) => {
  // Extraer valor de postData igual que TemporadaDeUso
  const value = postData?.title || '';

  // Estilos según tema - IDÉNTICOS A MODELO
  const styles = {
    formControl: {
      border: `1px solid ${theme === 'dark' ? '#4a5568' : '#cbd5e0'}`,
      backgroundColor: theme === 'dark' ? '#2d3748' : '#ffffff',
      padding: '10px 12px',
      borderRadius: '8px',
      color: theme === 'dark' ? 'white' : '#2d3748',
      width: '100%',
      fontSize: '14px'
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
      {/* Misma lógica que TemporadaDeUso: renderiza label directamente */}
      <Form.Label style={styles.formLabel}>
        {label} {required && '*'}
      </Form.Label>
      <Form.Control
        type="text"
        name={name}
        value={value}  // Usar value extraído de postData
        onChange={handleChangeInput}  // Usar handleChangeInput directamente
        required={required}
        disabled={disabled}
        isInvalid={!!error}
        style={styles.formControl}
        placeholder="Título del producto..."
        maxLength={100}
      />
      
      {/* Contador de caracteres */}
      <div className="text-muted small mt-1" style={{
        textAlign: 'right',
        direction: 'ltr'
      }}>
        {(value?.length || 0)}/100
      </div>
      
      {/* Mismo feedback de error que TemporadaDeUso */}
      {error && (
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default Title;