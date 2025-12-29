import React from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const SubCategoryTelephone = ({
  postData = {},
  handleChangeInput,
  name = 'subCategory',
  label = '📱 Subcategoría Principal',
  required = false,
  className = 'mb-3',
  disabled = false,
  error = null,
  theme = 'light',
  categoryName = 'category',
  fixedCategory = 'telephones'
}) => {
  const { t, i18n } = useTranslation(['category', 'common'])
  const isRTL = i18n.language === 'ar'

  const value = postData?.[name] || ''

  // 🔧 MANEJADOR DE CAMBIO - Misma lógica que SubCategoryVetements
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
      <Form.Label style={styles.formLabel}>
        {label} {required && '*'}
      </Form.Label>
      
      {/* CATEGORÍA PRINCIPAL - OCULTA */}
      <input 
        type="hidden" 
        name={categoryName} 
        value={fixedCategory} 
      />

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
        
        {/* 📱 TELÉFONOS */}
        <optgroup label={t('category:phones', 'Teléfonos')}>
          <option value="Smartphones">
            {t('category:smartphones', 'Smartphones')}
          </option>
          <option value="Telephones">
            {t('category:cell_phones', 'Téléphones cellulaires')}
          </option>
          <option value="FixFax">
            {t('category:landline_fax', 'Fixes & Fax')}
          </option>
        </optgroup>
        
        {/* 💻 TABLETAS */}
        <optgroup label={t('category:tablets', 'Tabletas')}>
          <option value="Tablettes">
            {t('category:tablets', 'Tablettes')}
          </option>
        </optgroup>
        
        {/* ⌚ SMARTWATCHES */}
        <optgroup label={t('category:smartwatches', 'Smartwatches')}>
          <option value="Smartwatchs">
            {t('category:smartwatches', 'Smartwatchs')}
          </option>
        </optgroup>
        
        {/* 🎧 AUDIO */}
        <optgroup label={t('category:audio', 'Audio')}>
          <option value="EcouteursSon">
            {t('category:headphones', 'Casques & Écouteurs')}
          </option>
          <option value="Baffle">
            {t('category:speakers', 'Baffle & Enceintes')}
          </option>
        </optgroup>
        
        {/* 🔌 CARGA Y ENERGÍA */}
        <optgroup label={t('category:charging', 'Carga & Energía')}>
          <option value="ChargeursCables">
            {t('category:chargers_cables', 'Chargeurs & Câbles')}
          </option>
          <option value="Powerbanks">
            {t('category:power_banks', 'Power Banks')}
          </option>
          <option value="StationChargement">
            {t('category:charging_stations', 'Stations de charge')}
          </option>
        </optgroup>
        
        {/* 🛡️ PROTECCIÓN */}
        <optgroup label={t('category:protection', 'Protection')}>
          <option value="ProtectionAntichoc">
            {t('category:protection', 'Protection & Antichoc')}
          </option>
          <option value="Coques">
            {t('category:covers', 'Coques & Étuis')}
          </option>
          <option value="ProtectionEcran">
            {t('category:screen_protectors', 'Protections d\'écran')}
          </option>
        </optgroup>
        
        {/* 🎮 GAMING Y ACCESORIOS */}
        <optgroup label={t('category:gaming_accessories', 'Gaming & Accesorios')}>
          <option value="Manettes">
            {t('category:gamepads', 'Manettes & Contrôleurs')}
          </option>
          <option value="VR">
            {t('category:vr', 'Réalité Virtuelle')}
          </option>
          <option value="SupportsStabilisateurs">
            {t('category:holders_stabilizers', 'Supports & Stabilisateurs')}
          </option>
        </optgroup>
        
        {/* 💾 ALMACENAMIENTO */}
        <optgroup label={t('category:storage', 'Almacenamiento')}>
          <option value="CartesMemoire">
            {t('category:memory_cards', 'Cartes Mémoire')}
          </option>
        </optgroup>
        
        {/* ✏️ ACCESORIOS */}
        <optgroup label={t('category:accessories', 'Accesorios')}>
          <option value="Stylets">
            {t('category:styli', 'Stylets & Stylets')}
          </option>
          <option value="Accessoires">
            {t('category:general_accessories', 'Accessoires divers')}
          </option>
        </optgroup>
      </Form.Select>
      
      <div className="text-muted small mt-1" style={{
        textAlign: isRTL ? 'left' : 'right',
        direction: 'ltr'
      }}>
        {t('category:subcategory_info', 'Selecciona una opción')}
      </div>
      
      {error && (
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  )
}

export default SubCategoryTelephone