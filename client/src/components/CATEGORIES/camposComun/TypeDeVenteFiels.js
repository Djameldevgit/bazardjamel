import React from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const TypeDeVenteField = ({
  postData = {},
  handleChangeInput,
  name = 'tipoventa',
  label = '🏷️ Tipo de Venta',
  required = false,
  className = 'mb-3',
  disabled = false,
  error = null,
  theme = 'light'
}) => {
  const { t } = useTranslation('camposcomunes');
  const isRTL = i18n.language === 'ar' || i18n.language === 'he'

  // Extraer valor de postData
  const value = postData?.tipoventa || ''

  // Función segura para obtener traducciones
  const getTranslation = (key, fallback) => {
    try {
      return t(key, fallback)
    } catch (error) {
      return fallback
    }
  }

  const tiposVenta = [
    { 
      value: "retail", 
      label: t('retail', 'Vente al Detalle'),
      description: t('retail_description', 'Vente de produits individuels')
    },
    { 
      value: "wholesale", 
      label: t('wholesale', 'Vente al por Mayor'),
      description: t('wholesale_description', 'Vente en grandes quantités')
    },
    { 
      value: "both", 
      label: t('both', 'Vente Detalle y Mayor'),
      description: t('both_description', 'Disponible para ambos tipos')
    }
  ];
  
  // Y en el option del select:
  <option value="">{t('select_sale_type', 'Selecciona el tipo de venta')}</option>

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
        <option value="">{getTranslation('select_sale_type', 'Selecciona el tipo de venta')}</option>
        {tiposVenta.map(tipo => (
          <option key={tipo.value} value={tipo.value}>
            {tipo.label}
          </option>
        ))}
      </Form.Select>
      
      {/* INFO DE DESCRIPCIÓN */}
      {value && (
        <div className="text-muted small mt-1" style={{
          textAlign: isRTL ? 'right' : 'left',
          direction: isRTL ? 'rtl' : 'ltr'
        }}>
          {tiposVenta.find(tipo => tipo.value === value)?.description}
        </div>
      )}
      
      {/* FEEDBACK DE ERROR IDÉNTICO A MODELO */}
      {error && (
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  )
}

export default TypeDeVenteField