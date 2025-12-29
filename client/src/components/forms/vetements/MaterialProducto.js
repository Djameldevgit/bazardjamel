import React, { useMemo } from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const MaterialProducto = ({
  postData = {},
  handleChangeInput,
  name = 'material',
  label = '🧵 Material del Producto',
  required = false,
  className = 'mb-3',
  disabled = false,
  error = null,
  theme = 'light'
}) => {
  const { t, i18n } = useTranslation('material')
  const isRTL = i18n.language === 'ar' || i18n.language === 'he'

  // Extraer valores de postData
  const value = postData?.material || ''
  const category = postData?.category || ''
  const subCategory = postData?.subCategory || ''

  // Función segura para obtener traducciones
  const getTranslation = (key, fallback) => {
    try {
      return t(key, fallback)
    } catch (error) {
      return fallback
    }
  }

  // 🎯 DEFINICIÓN COMPLETA DE MATERIALES POR CATEGORÍA Y SUBCATEGORÍA
  const getFilteredMaterials = useMemo(() => {
    if (!subCategory) return []

    let allMaterials = [];

    // 👔 ROPA HOMBRE
    if (category === 'vetements_homme') {
      allMaterials = [
        { value: "cotton", label: getTranslation('cotton', 'Algodón') },
        { value: "polyester", label: getTranslation('polyester', 'Poliéster') },
        { value: "wool", label: getTranslation('wool', 'Lana') },
        { value: "silk", label: getTranslation('silk', 'Seda') },
        { value: "leather", label: getTranslation('leather', 'Cuero') },
        { value: "denim", label: getTranslation('denim', 'Denim/Jeans') },
        { value: "linen", label: getTranslation('linen', 'Lino') },
        { value: "spandex", label: getTranslation('spandex', 'Spandex/Elastano') },
        { value: "nylon", label: getTranslation('nylon', 'Nailon') },
        { value: "suede", label: getTranslation('suede', 'Gamusa') },
        { value: "corduroy", label: getTranslation('corduroy', 'Pana') },
        { value: "gabardine", label: getTranslation('gabardine', 'Gabardina') }
      ];
    }

    // 👗 ROPA MUJER
    else if (category === 'vetements_femme') {
      allMaterials = [
        { value: "cotton", label: getTranslation('cotton', 'Algodón') },
        { value: "polyester", label: getTranslation('polyester', 'Poliéster') },
        { value: "silk", label: getTranslation('silk', 'Seda') },
        { value: "wool", label: getTranslation('wool', 'Lana') },
        { value: "linen", label: getTranslation('linen', 'Lino') },
        { value: "denim", label: getTranslation('denim', 'Denim/Jeans') },
        { value: "leather", label: getTranslation('leather', 'Cuero') },
        { value: "suede", label: getTranslation('suede', 'Gamusa') },
        { value: "spandex", label: getTranslation('spandex', 'Spandex/Elastano') },
        { value: "nylon", label: getTranslation('nylon', 'Nailon') }
      ];
    }

    // 👞 CALZADO HOMBRE
    else if (category === 'chaussures_homme') {
      allMaterials = [
        { value: "leather", label: getTranslation('leather', 'Cuero') },
        { value: "suede", label: getTranslation('suede', 'Gamusa') },
        { value: "rubber", label: getTranslation('rubber', 'Goma/Caucho') },
        { value: "plastic", label: getTranslation('plastic', 'Plástico') },
        { value: "canvas", label: getTranslation('canvas', 'Lona') },
        { value: "nylon", label: getTranslation('nylon', 'Nailon') },
        { value: "mesh", label: getTranslation('mesh', 'Malla') }
      ];
    }

    // 👠 CALZADO MUJER
    else if (category === 'chaussures_femme') {
      allMaterials = [
        { value: "leather", label: getTranslation('leather', 'Cuero') },
        { value: "suede", label: getTranslation('suede', 'Gamusa') },
        { value: "silk", label: getTranslation('silk', 'Seda') },
        { value: "satin", label: getTranslation('satin', 'Raso') },
        { value: "rubber", label: getTranslation('rubber', 'Goma/Caucho') },
        { value: "plastic", label: getTranslation('plastic', 'Plástico') },
        { value: "nylon", label: getTranslation('nylon', 'Nailon') }
      ];
    }

    // ⌚ RELOJES
    else if (category === 'montres') {
      allMaterials = [
        { value: "stainless_steel", label: getTranslation('stainless_steel', 'Acero Inoxidable') },
        { value: "gold", label: getTranslation('gold', 'Oro') },
        { value: "rose_gold", label: getTranslation('rose_gold', 'Oro Rosa') },
        { value: "white_gold", label: getTranslation('white_gold', 'Oro Blanco') },
        { value: "titanium", label: getTranslation('titanium', 'Titanio') },
        { value: "ceramic", label: getTranslation('ceramic', 'Cerámica') },
        { value: "plastic", label: getTranslation('plastic', 'Plástico') },
        { value: "rubber", label: getTranslation('rubber', 'Goma/Caucho') },
        { value: "leather", label: getTranslation('leather', 'Cuero') },
        { value: "sapphire_crystal", label: getTranslation('sapphire_crystal', 'Cristal de Zafiro') },
        { value: "mineral_glass", label: getTranslation('mineral_glass', 'Cristal Mineral') },
        { value: "crystal", label: getTranslation('crystal', 'Cristal') }
      ];
    }

    // 👓 GAFAS
    else if (category === 'lunettes') {
      allMaterials = [
        { value: "acetate", label: getTranslation('acetate', 'Acetato') },
        { value: "plastic", label: getTranslation('plastic', 'Plástico') },
        { value: "metal", label: getTranslation('metal', 'Metal') },
        { value: "titanium", label: getTranslation('titanium', 'Titanio') },
        { value: "stainless_steel", label: getTranslation('stainless_steel', 'Acero Inoxidable') },
        { value: "wood", label: getTranslation('wood', 'Madera') },
        { value: "resin", label: getTranslation('resin', 'Resina') },
        { value: "crystal", label: getTranslation('crystal', 'Cristal') }
      ];
    }

    // 💎 JOYERÍA
    else if (category === 'bijoux') {
      allMaterials = [
        { value: "gold", label: getTranslation('gold', 'Oro') },
        { value: "silver", label: getTranslation('silver', 'Plata') },
        { value: "platinum", label: getTranslation('platinum', 'Platino') },
        { value: "rose_gold", label: getTranslation('rose_gold', 'Oro Rosa') },
        { value: "white_gold", label: getTranslation('white_gold', 'Oro Blanco') },
        { value: "stainless_steel", label: getTranslation('stainless_steel', 'Acero Inoxidable') },
        { value: "titanium", label: getTranslation('titanium', 'Titanio') },
        { value: "diamond", label: getTranslation('diamond', 'Diamante') },
        { value: "precious_stones", label: getTranslation('precious_stones', 'Piedras Preciosas') },
        { value: "pearl", label: getTranslation('pearl', 'Perla') },
        { value: "crystal", label: getTranslation('crystal', 'Cristal') },
        { value: "ceramic", label: getTranslation('ceramic', 'Cerámica') }
      ];
    }

    // 👜 BOLSOS Y MALETAS
    else if (category === 'sacs_valises') {
      allMaterials = [
        { value: "leather", label: getTranslation('leather', 'Cuero') },
        { value: "suede", label: getTranslation('suede', 'Gamusa') },
        { value: "canvas", label: getTranslation('canvas', 'Lona') },
        { value: "nylon", label: getTranslation('nylon', 'Nailon') },
        { value: "polyester", label: getTranslation('polyester', 'Poliéster') },
        { value: "plastic", label: getTranslation('plastic', 'Plástico') },
        { value: "straw", label: getTranslation('straw', 'Paja') }
      ];
    }

    // ⭐ DEFAULT - Materiales textiles generales
    else {
      allMaterials = [
        { value: "cotton", label: getTranslation('cotton', 'Algodón') },
        { value: "polyester", label: getTranslation('polyester', 'Poliéster') },
        { value: "wool", label: getTranslation('wool', 'Lana') },
        { value: "silk", label: getTranslation('silk', 'Seda') },
        { value: "leather", label: getTranslation('leather', 'Cuero') },
        { value: "denim", label: getTranslation('denim', 'Denim/Jeans') }
      ];
    }

    return allMaterials;
  }, [category, subCategory, t]);

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

  const filteredMaterials = getFilteredMaterials;

  return (
    <Form.Group className={className}>
      {/* EXACTAMENTE LA MISMA LÓGICA QUE MODELO: {label} directamente */}
      <Form.Label style={styles.formLabel}>
        {label} {required && '*'}
      </Form.Label>
      
      {/* SELECT con estilos idénticos o mensaje */}
      {!subCategory ? (
        <div className="text-center py-2 text-muted" style={{
          border: `1px solid ${theme === 'dark' ? '#4a5568' : '#cbd5e0'}`,
          backgroundColor: theme === 'dark' ? '#2d3748' : '#ffffff',
          padding: '10px 12px',
          borderRadius: '8px',
          color: theme === 'dark' ? '#a0aec0' : '#718096',
          fontSize: '14px'
        }}>
          <p className="mb-0">
            {isRTL ? 'اختر فئة فرعية لرؤية المواد' : 'Selecciona una subcategoría para ver los materiales'}
          </p>
        </div>
      ) : (
        <>
          <Form.Select
            name={name}
            value={value}
            onChange={handleChangeInput}  // ✅ CORREGIDO: usar handleChangeInput
            required={required}
            disabled={disabled}
            isInvalid={!!error}
            style={{
              ...styles.formControl,
              textAlign: isRTL ? 'right' : 'left',
              direction: isRTL ? 'rtl' : 'ltr'
            }}
          >
            <option value="">{getTranslation('select_material', 'Selecciona material')}</option>
            {filteredMaterials.map(opcion => (
              <option key={opcion.value} value={opcion.value}>
                {opcion.label}
              </option>
            ))}
          </Form.Select>
          
          {/* FEEDBACK DE ERROR IDÉNTICO A MODELO */}
          {error && (
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          )}
        </>
      )}
    </Form.Group>
  )
}

export default MaterialProducto