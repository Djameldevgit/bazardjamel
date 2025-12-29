import React from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const SubCategoryVetements = ({
  postData = {},
  handleChangeInput,
  name = 'subCategory',
  label = '👕 Subcategoría Principal',
  required = false,
  className = 'mb-3',
  disabled = false,
  error = null,
  theme = 'light',
  categoryName = 'category',
  fixedCategory = 'vetements'
}) => {
  const { t, i18n } = useTranslation(['category', 'common'])
  const isRTL = i18n.language === 'ar'

  const value = postData?.subCategory || ''

  // 🔧 MANEJADOR DE CAMBIO
  const handleSubCategoryChange = (e) => {
    handleChangeInput(e)
    
    // También actualiza la categoría fija
    handleChangeInput({
      target: {
        name: categoryName,
        value: fixedCategory
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
      {/* EXACTAMENTE LA MISMA LÓGICA QUE MODELO */}
      <Form.Label style={styles.formLabel}>
        {label} {required && '*'}
      </Form.Label>
      
      {/* CATEGORÍA PRINCIPAL - OCULTA */}
      <input 
        type="hidden" 
        name={categoryName} 
        value={fixedCategory} 
      />

      {/* SELECT con estilos idénticos */}
      <Form.Select
        name={name}
        value={value}
        onChange={handleSubCategoryChange}
        required={required}
        disabled={disabled}
        isInvalid={!!error}
        style={{
          ...styles.formControl,
          textAlign: isRTL ? 'right' : 'left',
          direction: isRTL ? 'rtl' : 'ltr'
        }}
      >
        <option value="">
          {t('category:choose_subcategory', 'Selecciona una subcategoría')}
        </option>
        
        {/* 👕 ROPA */}
        <optgroup label={t('category:clothing', 'Ropa')}>
          <option value="ropahombre">
            {t('category:mens_clothing', 'Ropa Hombre')}
          </option>
          <option value="ropamujer">
            {t('category:womens_clothing', 'Ropa Mujer')}
          </option>
        </optgroup>
        
        {/* 👟 CALZADO */}
        <optgroup label={t('category:footwear', 'Calzado')}>
          <option value="zapatoshombre">
            {t('category:mens_shoes', 'Calzado Hombre')}
          </option>
          <option value="zapatosmujer">
            {t('category:womens_shoes', 'Calzado Mujer')}
          </option>
        </optgroup>
        
        {/* 💎 ACCESORIOS */}
        <optgroup label={t('category:accessories', 'Accesorios')}>
          <option value="reloj">
            {t('category:watches', 'Relojes')}
          </option>
          <option value="gafas">
            {t('category:glasses', 'Gafas')}
          </option>
          <option value="bijoux">
            {t('category:jewelry', 'Joyería')}
          </option>
          <option value="sacvalise">
            {t('category:bags_luggage', 'Bolsos y Maletas')}
          </option>
        </optgroup>
        
        {/* 👶 INFANTIL */}
        <optgroup label={t('category:children_clothing', 'Ropa Infantil')}>
          <option value="garcons">
            {t('category:boys_clothing', 'Ropa Niños')}
          </option>
          <option value="filles">
            {t('category:girls_clothing', 'Ropa Niñas')}
          </option>
          <option value="bebes">
            {t('category:baby_clothing', 'Ropa Bebé')}
          </option>
        </optgroup>
        
        {/* 💼 PROFESIONAL */}
        <optgroup label={t('category:professional', 'Profesional')}>
          <option value="TennueProfesionelle">
            {t('category:professional_clothing', 'Ropa Profesional')}
          </option>
        </optgroup>
      </Form.Select>
      
      {/* INFO */}
      <div className="text-muted small mt-1" style={{
        textAlign: isRTL ? 'left' : 'right',
        direction: 'ltr'
      }}>
        {t('category:subcategory_info', 'Selecciona una opción')}
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

export default SubCategoryVetements