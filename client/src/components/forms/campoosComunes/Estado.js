import React from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const Estado = ({
   
    postData = {},        // ✅
    handleChangeInput,    // ✅

    name = 'etat',
    label = '🏷️ Estado del Producto',  // Icono incluido
    required = false,
    className = 'mb-3',
    disabled = false,
    error = null,
    theme = 'light'
}) => {
    const { t, i18n } = useTranslation('etat')
    const isRTL = i18n.language === 'ar' || i18n.language === 'he'
    const value = postData?.etat|| '';
 
    const getTranslation = (key, fallback) => {
        try {
            return t(key, fallback)
        } catch (error) {
            return fallback
        }
    }

    const opcionesEstado = [
        {
            value: "new",
            label: getTranslation('new', 'Nuevo'),
            description: getTranslation('new_description', 'Producto sin usar')
        },
        {
            value: "used",
            label: getTranslation('used', 'Usado'),
            description: getTranslation('used_description', 'Producto usado')
        },
        {
            value: "like_new",
            label: getTranslation('like_new', 'Como nuevo'),
            description: getTranslation('like_new_description', 'Casi sin uso')
        },
        {
            value: "refurbished",
            label: getTranslation('refurbished', 'Reacondicionado'),
            description: getTranslation('refurbished_description', 'Restaurado por profesional')
        }
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
                        // ✅ Pasar el objeto completo
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
                <option value="">{getTranslation('select_condition', 'Selecciona el estado')}</option>
                {opcionesEstado.map(opcion => (
                    <option key={opcion.value} value={opcion.value}>
                        {opcion.label}
                    </option>
                ))}
            </Form.Select>

            {/* INFO DE DESCRIPCIÓN */}
            {value && (
                <div className="text-muted small mt-1" style={{
                    textAlign: isRTL ? 'right' : 'left',
                    direction: isRTL ? 'rtl' : 'ltr'
                }}>
                    {opcionesEstado.find(op => op.value === value)?.description}
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

export default Estado