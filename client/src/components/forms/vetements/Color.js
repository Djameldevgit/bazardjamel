import React, { useMemo } from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const Color = ({ 
  postData = {}, 
  colorData, 
  onColorChange, 
  handleArrayChange,
  label = '🎨 Colores Disponibles',  // Icono incluido
  required = false,
  className = 'mb-3',
  disabled = false,
  error = null,
  theme = 'light'
}) => {
  const { t, i18n } = useTranslation('color')
  const isRTL = i18n.language === 'ar' || i18n.language === 'he'

  // ✅ USAR colorData EN LUGAR DE postData?.color
  const currentColors = useMemo(() => {
    if (!colorData) return [];
    if (Array.isArray(colorData)) return colorData;
    if (typeof colorData === 'string') {
      return colorData.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  }, [colorData]);

  // Función segura para obtener traducciones
  const getTranslation = (key, fallback) => {
    try {
      return t(key, fallback)
    } catch (error) {
      return fallback
    }
  }

  // 🎯 DEFINICIÓN SIMPLIFICADA DE COLORES - CON TUS CATEGORÍAS REALES
  const getFilteredColors = useMemo(() => {
    if (!postData?.subCategory) return [];

    const subCategory = postData.subCategory || '';
    
    // Mapeo de colores por subcategoría
    const colorGroups = {
      // 👔 ROPA HOMBRE
      'ropahombre': [
        { value: "black", label: getTranslation('black', 'Negro') },
        { value: "white", label: getTranslation('white', 'Blanco') },
        { value: "blue", label: getTranslation('blue', 'Azul') },
        { value: "gray", label: getTranslation('gray', 'Gris') },
        { value: "brown", label: getTranslation('brown', 'Marrón') },
        { value: "green", label: getTranslation('green', 'Verde') },
        { value: "red", label: getTranslation('red', 'Rojo') },
        { value: "beige", label: getTranslation('beige', 'Beige') }
      ],
      
      // 👗 ROPA MUJER
      'ropamujer': [
        { value: "black", label: getTranslation('black', 'Negro') },
        { value: "white", label: getTranslation('white', 'Blanco') },
        { value: "pink", label: getTranslation('pink', 'Rosa') },
        { value: "purple", label: getTranslation('purple', 'Morado') },
        { value: "blue", label: getTranslation('blue', 'Azul') },
        { value: "red", label: getTranslation('red', 'Rojo') },
        { value: "green", label: getTranslation('green', 'Verde') },
        { value: "yellow", label: getTranslation('yellow', 'Amarillo') }
      ],
      
      // 👞👠 CALZADO
      'zapatoshombre': [
        { value: "black", label: getTranslation('black', 'Negro') },
        { value: "brown", label: getTranslation('brown', 'Marrón') },
        { value: "blue", label: getTranslation('blue', 'Azul') },
        { value: "white", label: getTranslation('white', 'Blanco') },
        { value: "gray", label: getTranslation('gray', 'Gris') }
      ],
      
      'zapatosmujer': [
        { value: "black", label: getTranslation('black', 'Negro') },
        { value: "white", label: getTranslation('white', 'Blanco') },
        { value: "red", label: getTranslation('red', 'Rojo') },
        { value: "pink", label: getTranslation('pink', 'Rosa') },
        { value: "gold", label: getTranslation('gold', 'Dorado') }
      ],
      
      // 👶 BEBÉS
      'bebes': [
        { value: "white", label: getTranslation('white', 'Blanco') },
        { value: "blue", label: getTranslation('blue', 'Azul') },
        { value: "pink", label: getTranslation('pink', 'Rosa') },
        { value: "yellow", label: getTranslation('yellow', 'Amarillo') },
        { value: "green", label: getTranslation('green', 'Verde') }
      ],
      
      // 👦👧 NIÑOS/NIÑAS
      'garcons': [
        { value: "blue", label: getTranslation('blue', 'Azul') },
        { value: "green", label: getTranslation('green', 'Verde') },
        { value: "red", label: getTranslation('red', 'Rojo') },
        { value: "black", label: getTranslation('black', 'Negro') },
        { value: "gray", label: getTranslation('gray', 'Gris') }
      ],
      
      'filles': [
        { value: "pink", label: getTranslation('pink', 'Rosa') },
        { value: "purple", label: getTranslation('purple', 'Morado') },
        { value: "white", label: getTranslation('white', 'Blanco') },
        { value: "yellow", label: getTranslation('yellow', 'Amarillo') },
        { value: "blue", label: getTranslation('blue', 'Azul') }
      ],
      
      // ⌚ RELOJES
      'reloj': [
        { value: "silver", label: getTranslation('silver', 'Plata') },
        { value: "gold", label: getTranslation('gold', 'Oro') },
        { value: "rose_gold", label: getTranslation('rose_gold', 'Oro Rosa') },
        { value: "black", label: getTranslation('black', 'Negro') },
        { value: "brown", label: getTranslation('brown', 'Marrón') }
      ],
      
      // 👓 GAFAS
      'gafas': [
        { value: "black", label: getTranslation('black', 'Negro') },
        { value: "brown", label: getTranslation('brown', 'Marrón') },
        { value: "tortoise", label: getTranslation('tortoise', 'Carey') },
        { value: "silver", label: getTranslation('silver', 'Plata') },
        { value: "transparent", label: getTranslation('transparent', 'Transparente') }
      ],
      
      // 💎 JOYERÍA
      'bijoux': [
        { value: "gold", label: getTranslation('gold', 'Oro') },
        { value: "silver", label: getTranslation('silver', 'Plata') },
        { value: "rose_gold", label: getTranslation('rose_gold', 'Oro Rosa') },
        { value: "white", label: getTranslation('white', 'Blanco') },
        { value: "crystal", label: getTranslation('crystal', 'Cristal') }
      ],
      
      // 👜 BOLSOS
      'sacvalise': [
        { value: "black", label: getTranslation('black', 'Negro') },
        { value: "brown", label: getTranslation('brown', 'Marrón') },
        { value: "blue", label: getTranslation('blue', 'Azul') },
        { value: "red", label: getTranslation('red', 'Rojo') },
        { value: "green", label: getTranslation('green', 'Verde') }
      ],
      
      // 💼 PROFESIONAL
      'TennueProfesionelle': [
        { value: "black", label: getTranslation('black', 'Negro') },
        { value: "blue", label: getTranslation('blue', 'Azul') },
        { value: "gray", label: getTranslation('gray', 'Gris') },
        { value: "white", label: getTranslation('white', 'Blanco') },
        { value: "brown", label: getTranslation('brown', 'Marrón') }
      ]
    };

    // Buscar por subcategoría exacta
    if (colorGroups[subCategory]) {
      return colorGroups[subCategory];
    }
    
    // Colores por defecto
    return [
      { value: "black", label: getTranslation('black', 'Negro') },
      { value: "white", label: getTranslation('white', 'Blanco') },
      { value: "blue", label: getTranslation('blue', 'Azul') },
      { value: "red", label: getTranslation('red', 'Rojo') },
      { value: "green", label: getTranslation('green', 'Verde') },
      { value: "yellow", label: getTranslation('yellow', 'Amarillo') },
      { value: "pink", label: getTranslation('pink', 'Rosa') },
      { value: "purple", label: getTranslation('purple', 'Morado') },
      { value: "gray", label: getTranslation('gray', 'Gris') },
      { value: "brown", label: getTranslation('brown', 'Marrón') }
    ];
  }, [postData?.subCategory, t]);

  // ✅ MANEJADOR CORREGIDO - PRIORIDAD A onColorChange
  const handleColorToggle = (colorValue) => {
    // 1. Usar onColorChange si está disponible
    if (onColorChange) {
      const isCurrentlySelected = currentColors.includes(colorValue);
      onColorChange(colorValue, !isCurrentlySelected);
      return;
    }
    
    // 2. Usar handleArrayChange como alternativa
    if (handleArrayChange) {
      const isCurrentlySelected = currentColors.includes(colorValue);
      handleArrayChange('color', colorValue, !isCurrentlySelected);
      return;
    }
  }

  // ✅ Verificar si un color está seleccionado
  const isColorSelected = (colorValue) => {
    return currentColors.includes(colorValue);
  }

  // ✅ Contar colores seleccionados
  const getSelectedCount = () => {
    return currentColors.length;
  }

  // ESTILOS IDÉNTICOS A MODELO (solo para el exterior)
  const styles = {
    formLabel: {
      fontWeight: '600',
      marginBottom: '6px',
      display: 'block',
      color: theme === 'dark' ? '#e2e8f0' : '#2d3748'
    }
  }

  if (!postData?.subCategory) {
    return (
      <Form.Group className={className}>
        <Form.Label style={styles.formLabel}>
          {label} {required && '*'}
        </Form.Label>
        <div className="text-center py-2 text-muted" style={{
          border: `1px solid ${theme === 'dark' ? '#4a5568' : '#cbd5e0'}`,
          backgroundColor: theme === 'dark' ? '#2d3748' : '#ffffff',
          padding: '10px 12px',
          borderRadius: '8px',
          color: theme === 'dark' ? '#a0aec0' : '#718096',
          fontSize: '14px'
        }}>
          <p className="mb-0">
            {isRTL ? 'اختر فئة فرعية لرؤية الألوان' : 'Selecciona una subcategoría para ver los colores'}
          </p>
        </div>
      </Form.Group>
    )
  }

  const selectedCount = getSelectedCount();

  return (
    <Form.Group className={className}>
      {/* EXACTAMENTE LA MISMA LÓGICA QUE MODELO: {label} directamente */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <Form.Label style={styles.formLabel} className="mb-0">
          {label} {required && '*'}
        </Form.Label>
        {selectedCount > 0 && (
          <small className="text-muted">
            {selectedCount} {getTranslation('selected', 'seleccionados')}
          </small>
        )}
      </div>
      
      {/* CONTENEDOR EXTERIOR CON ESTILOS DE MODELO */}
      <div style={{
        border: `1px solid ${theme === 'dark' ? '#4a5568' : '#cbd5e0'}`,
        backgroundColor: theme === 'dark' ? '#2d3748' : '#ffffff',
        padding: '10px 12px',
        borderRadius: '8px',
        minHeight: '48px'
      }}>
        {/* 📝 CHECKBOXES SIMPLES (TUS CHECKBOXES ORIGINALES SIN MODIFICAR) */}
        <div className="d-flex flex-wrap gap-2">
          {getFilteredColors.map((color) => (
            <Form.Check
              key={color.value}
              type="checkbox"
              id={`color-${color.value}`}
              name="color"
              value={color.value}
              checked={isColorSelected(color.value)}
              onChange={() => handleColorToggle(color.value)}
              label={color.label}
              style={{
                marginRight: isRTL ? '0' : '1rem',
                marginLeft: isRTL ? '1rem' : '0'
              }}
            />
          ))}
        </div>
      </div>
      
      {/* INFO */}
      <div className="text-muted small mt-1" style={{
        textAlign: isRTL ? 'left' : 'right',
        direction: 'ltr'
      }}>
        {getTranslation('color_info', 'Selecciona los colores disponibles')}
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

export default React.memo(Color)