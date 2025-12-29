import React from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const TipoMoneda = ({
  postData = {},
  handleChangeInput,
  name = 'tipodemoneda',
  label = '💱 Tipo de Moneda',
  required = false,
  className = 'mb-3',
  disabled = false,
  error = null,
  theme = 'light'
}) => {
  const { t, i18n } = useTranslation('moneda')
  const isRTL = i18n.language === 'ar' || i18n.language === 'he'

  // Extraer valor de postData, con valor por defecto "USD"
  const value = postData?.tipodemoneda || 'USD'

  // Función segura para obtener traducciones
  const getTranslation = (key, fallback) => {
    try {
      return t(key, fallback)
    } catch (error) {
      return fallback
    }
  }

  const monedas = [
    { value: "USD", label: getTranslation('us_dollar', 'Dólar Americano (USD)') },
    { value: "EUR", label: getTranslation('euro', 'Euro (EUR)') },
    { value: "DZD", label: getTranslation('algerian_dinar', 'Dinar Argelino (DZD)') }
  ]

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
      
      {/* SELECT con estilos idénticos */}
      <Form.Select
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
      >
        {monedas.map(moneda => (
          <option key={moneda.value} value={moneda.value}>
            {moneda.label}
          </option>
        ))}
      </Form.Select>
      
      {/* INFO */}
      <div className="text-muted small mt-1" style={{
        textAlign: isRTL ? 'left' : 'right',
        direction: 'ltr'
      }}>
        {getTranslation('currency_info', 'Moneda para los precios')}
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

export default TipoMoneda