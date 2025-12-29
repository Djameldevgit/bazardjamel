import React from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const Price = ({
  postData = {},
  handleChangeInput,
  name = 'price',
  label = '💰 Precio del Producto',
  required = false,
  className = 'mb-3',
  disabled = false,
  error = null,
  theme = 'light'
}) => {
  const { t, i18n } = useTranslation('price')
  const isRTL = i18n.language === 'ar' || i18n.language === 'he'

  // Extraer valor de postData
  const value = postData?.price || ''

  // Función segura para obtener traducciones
  const getTranslation = (key, fallback) => {
    try {
      return t(key, fallback)
    } catch (error) {
      return fallback
    }
  }

  const formatPrice = (value) => {
    if (!value) return ""
    // Remover cualquier formato previo y permitir solo números y punto decimal
    const numericValue = value.replace(/[^\d.]/g, '')
    // Asegurar que solo haya un punto decimal
    const parts = numericValue.split('.')
    if (parts.length > 2) {
      return parts[0] + '.' + parts.slice(1).join('')
    }
    return numericValue
  }

  const handlePriceChange = (e) => {
    const formattedValue = formatPrice(e.target.value)
    handleChangeInput({
      target: {
        name: name,
        value: formattedValue
      }
    })
  }

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
        type="text"
        name={name}
        value={value}
        onChange={handlePriceChange}
        required={required}
        disabled={disabled}
        isInvalid={!!error}
        style={{
          ...styles.formControl,
          textAlign: isRTL ? 'right' : 'left',
          direction: isRTL ? 'rtl' : 'ltr'
        }}
        placeholder={getTranslation('price_placeholder', '0.00')}
      />
      
      {/* INFO DE EJEMPLO */}
      <div className="text-muted small mt-1" style={{
        textAlign: isRTL ? 'left' : 'right',
        direction: 'ltr'
      }}>
        {getTranslation('price_info', 'Ej: 99.99')}
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

export default Price