import React from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const Contact = ({
  value = '',
  onChange,
  name = 'telefono',
  label = '📞 Número de Teléfono',  // Icono incluido
  required = false,
  className = 'mb-3',
  disabled = false,
  error = null,
  theme = 'light',
  defaultPhone = "0658556296"
}) => {
  const { t, i18n } = useTranslation('telefono')
  const isRTL = i18n.language === 'ar' || i18n.language === 'he'

  // Función segura para obtener traducciones
  const getTranslation = (key, fallback) => {
    try {
      return t(key, fallback)
    } catch (error) {
      return fallback
    }
  }

  const formatPhone = (value) => {
    if (!value) return defaultPhone
    // Remover todo excepto números y signo +
    return value.replace(/[^\d+]/g, '')
  }

  const handlePhoneChange = (e) => {
    const formattedValue = formatPhone(e.target.value)
    onChange({
      target: {
        name: name,
        value: formattedValue
      }
    })
  }

  const displayValue = value || defaultPhone

  // ESTILOS IDÉNTICOS A MODELO
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
  }

  return (
    <Form.Group className={className}>
      {/* EXACTAMENTE LA MISMA LÓGICA QUE MODELO: {label} directamente */}
      <Form.Label style={styles.formLabel}>
        {label} {required && '*'}
      </Form.Label>
      
      {/* INPUT con estilos idénticos */}
      <Form.Control
        type="tel"
        name={name}
        value={displayValue}
        onChange={handlePhoneChange}
        required={required}
        disabled={disabled}
        isInvalid={!!error}
        style={{
          ...styles.formControl,
          textAlign: isRTL ? 'right' : 'left',
          direction: isRTL ? 'rtl' : 'ltr'
        }}
        placeholder={getTranslation('phone_placeholder', '+1 234 567 8900')}
      />
      
      {/* INFO DE EJEMPLO */}
      <div className="text-muted small mt-1" style={{
        textAlign: isRTL ? 'left' : 'right',
        direction: 'ltr'
      }}>
        {getTranslation('phone_info', 'Ej: +212 612-345678')}
      </div>
      
      {/* FEEDBACK DE ERROR IDÉNTICO A MODELO */}
      {error && (
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  )
}

export default Contact