import React, { useMemo } from 'react'
import { Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const Marca = ({
  postData = {},
  handleChangeInput,
  name = 'marca',
  label = '🏷️ Marca del Producto',
  required = false,
  className = 'mb-3',
  disabled = false,
  error = null,
  theme = 'light'
}) => {
  const { t, i18n } = useTranslation('marca')
  const isRTL = i18n.language === 'ar' || i18n.language === 'he'

  // Extraer valores de postData
  const value = postData?.marca || ''
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

  // 🎯 DEFINICIÓN COMPLETA DE MARCAS POR CATEGORÍA Y SUBCATEGORÍA
  const getFilteredBrands = useMemo(() => {
    if (!subCategory) return []

    let allBrands = [];

    // 👔 ROPA HOMBRE
    if (category === 'vetements_homme') {
      allBrands = [
        "Nike", "Adidas", "Puma", "Under Armour", "Reebok",
        "Levi's", "Tommy Hilfiger", "Calvin Klein", "Ralph Lauren", 
        "Lacoste", "H&M", "Zara", "Uniqlo", "Diesel", "Hugo Boss"
      ];
    }

    // 👗 ROPA MUJER
    else if (category === 'vetements_femme') {
      allBrands = [
        "Zara", "H&M", "Mango", "Bershka", "Pull&Bear",
        "Forever 21", "Calvin Klein", "Tommy Hilfiger", "Ralph Lauren",
        "Michael Kors", "Coach", "Kate Spade", "Victoria's Secret"
      ];
    }

    // 👞 CALZADO HOMBRE
    else if (category === 'chaussures_homme') {
      allBrands = [
        "Nike", "Adidas", "Puma", "Under Armour", "Reebok",
        "Converse", "Vans", "New Balance", "Skechers", "Clarks",
        "Dr. Martens", "Timberland", "Geox", "ECCO"
      ];
    }

    // 👠 CALZADO MUJER
    else if (category === 'chaussures_femme') {
      allBrands = [
        "Nike", "Adidas", "Puma", "Converse", "Vans",
        "Steve Madden", "Nine West", "Sam Edelman", "Clarks",
        "Naturalizer", "Skechers", "ECCO", "Geox"
      ];
    }

    // 👶 BEBÉS
    else if (category === 'bebe') {
      allBrands = [
        "Carter's", "Gerber", "OshKosh", "The Children's Place",
        "Gap Kids", "Old Navy", "H&M Kids", "Zara Kids"
      ];
    }

    // 👦 NIÑOS
    else if (category === 'garcons') {
      allBrands = [
        "Nike Kids", "Adidas Kids", "Puma Kids", "Levi's Kids",
        "Gap Kids", "Old Navy", "The Children's Place", "OshKosh"
      ];
    }

    // 👧 NIÑAS
    else if (category === 'filles') {
      allBrands = [
        "Nike Kids", "Adidas Kids", "Puma Kids", "Gap Kids",
        "Old Navy", "The Children's Place", "Carter's", "OshKosh"
      ];
    }

    // ⌚ RELOJES
    else if (category === 'montres') {
      allBrands = [
        "Rolex", "Omega", "Tag Heuer", "Casio", "Seiko",
        "Citizen", "Fossil", "Michael Kors", "Daniel Wellington",
        "Swatch", "Timex", "Bulova", "Tissot", "Longines"
      ];
    }

    // 👓 GAFAS
    else if (category === 'lunettes') {
      allBrands = [
        "Ray-Ban", "Oakley", "Prada", "Gucci", "Dior",
        "Chanel", "Versace", "Armani", "Tom Ford", "Burberry",
        "Persol", "Maui Jim", "Carrera", "Vogue"
      ];
    }

    // 💎 JOYERÍA
    else if (category === 'bijoux') {
      allBrands = [
        "Tiffany & Co.", "Cartier", "Pandora", "Swarovski",
        "Bulgaria", "Van Cleef & Arpels", "Harry Winston",
        "David Yurman", "Mikimoto", "Chopard", "Bvlgari"
      ];
    }

    // 👜 BOLSOS Y MALETAS
    else if (category === 'sacs_valises') {
      allBrands = [
        "Louis Vuitton", "Gucci", "Chanel", "Prada", "Hermès",
        "Dior", "Fendi", "Burberry", "Michael Kors", "Coach",
        "Kate Spade", "Longchamp", "Samsonite", "Tumi"
      ];
    }

    // 💼 ROPA PROFESIONAL
    else if (category === 'tenues_professionnelles') {
      allBrands = [
        "Dickies", "Carhartt", "Wrangler", "Lee", "Caterpillar",
        "Red Kap", "Cherokee", "Landau", "Careismatic"
      ];
    }

    // ⭐ DEFAULT - Marcas generales
    else {
      allBrands = [
        "Nike", "Adidas", "Zara", "H&M", "Puma", "Levi's", 
        "Tommy Hilfiger", "Calvin Klein", "Ralph Lauren", "Lacoste"
      ];
    }

    return allBrands;
  }, [category, subCategory]);

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

  if (!subCategory) {
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
            {isRTL ? 'اختر فئة فرعية لرؤية العلامات التجارية' : 'Selecciona una subcategoría para ver las marcas'}
          </p>
        </div>
      </Form.Group>
    )
  }

  const brands = getFilteredBrands;
  const showOtherInput = value === "otra";

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
        onChange={handleChangeInput}  // ✅ CORREGIDO
        required={required}
        disabled={disabled}
        isInvalid={!!error}
        style={{
          ...styles.formControl,
          textAlign: isRTL ? 'right' : 'left',
          direction: isRTL ? 'rtl' : 'ltr'
        }}
      >
        <option value="">{getTranslation('select_brand', 'Selecciona una marca')}</option>
        <option value="otra">{getTranslation('other_brand', 'Otra marca...')}</option>
        {brands.map(marca => (
          <option key={marca} value={marca}>
            {marca}
          </option>
        ))}
      </Form.Select>
      
      {/* 🔢 INPUT PARA OTRA MARCA */}
      {showOtherInput && (
        <Form.Control
          type="text"
          name={name}
          value={value}  // Ya es el valor correcto
          placeholder={getTranslation('write_brand', 'Escribe el nombre de la marca...')}
          onChange={handleChangeInput}  // ✅ CORREGIDO: usar handleChangeInput
          className="mt-2"
          required={required && showOtherInput}
          disabled={disabled}
          isInvalid={!!error && showOtherInput}
          style={{
            ...styles.formControl,
            textAlign: isRTL ? 'right' : 'left',
            direction: isRTL ? 'rtl' : 'ltr'
          }}
        />
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

export default Marca