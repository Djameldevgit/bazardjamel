import React from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const TemporadaDeUso = ({
  postData = {},
  handleChangeInput,
  name = 'temporada',
  label = '🌦️ Temporada de Uso',
  required = false,
  className = 'mb-3',
  disabled = false,
  error = null,
  theme = 'light'
}) => {
  const { t, i18n } = useTranslation('temporadauso')
  const isRTL = i18n.language === 'ar' || i18n.language === 'he'

  const value = postData?.temporada || ''

  // Función segura para obtener traducciones
  const getTranslation = (key, fallback) => {
    try {
      return t(key, fallback)
    } catch (error) {
      return fallback
    }
  }

  const opcionesTemporada = [
    { value: "spring", label: getTranslation('spring', 'Primavera') },
    { value: "summer", label: getTranslation('summer', 'Verano') },
    { value: "autumn", label: getTranslation('autumn', 'Otoño') },
    { value: "winter", label: getTranslation('winter', 'Invierno') },
    { value: "all_year", label: getTranslation('all_year', 'Todo el año') }
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
      {/* EXACTAMENTE LA MISMA LÓGICA QUE MODELO */}
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
        <option value="">{getTranslation('select_season', 'Selecciona temporada')}</option>
        {opcionesTemporada.map(opcion => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </Form.Select>
      
      {/* INFO */}
      <div className="text-muted small mt-1" style={{
        textAlign: isRTL ? 'left' : 'right',
        direction: 'ltr'
      }}>
        {getTranslation('season_info', 'Indica la temporada de uso principal')}
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

export default TemporadaDeUso