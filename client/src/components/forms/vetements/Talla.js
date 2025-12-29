import React from 'react';
import { Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const Talla = ({ 
  postData, 
  tallaData, 
  onTallaChange,
  label = '📏 Tallas Disponibles',  // Icono incluido
  required = false,
  className = 'mb-3',
  disabled = false,
  error = null,
  theme = 'light'
}) => {
  const { t, i18n } = useTranslation('talla');
  const isRTL = i18n.language === 'ar';

  // ✅ Tallas disponibles (simplificado)
  const availableSizes = {
    ropahombre: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    ropamujer: ['XS', 'S', 'M', 'L', 'XL'],
    zapatoshombre: ['39', '40', '41', '42', '43', '44'],
    zapatosmujer: ['35', '36', '37', '38', '39', '40'],
    bebes: ['0-3M', '3-6M', '6-9M', '9-12M', '12-18M'],
    garcons: ['2-3A', '4-5A', '6-7A', '8-9A', '10-11A'],
    filles: ['2-3A', '4-5A', '6-7A', '8-9A', '10-11A'],
    reloj: ['38mm', '40mm', '42mm', '44mm'],
    gafas: ['Pequeño', 'Mediano', 'Grande'],
    bijoux: ['16cm', '17cm', '18cm', '19cm'],
    sacvalise: ['Pequeño', 'Mediano', 'Grande'],
    TennueProfesionelle: ['S', 'M', 'L', 'XL']
  };

  // ✅ Obtener tallas según subcategoría
  const getSizes = () => {
    const subCat = postData?.subCategory;
    return availableSizes[subCat] || ['Único Tamaño'];
  };

  // ✅ Manejar cambio de checkbox
  const handleCheckboxChange = (size) => {
    if (!onTallaChange) {
      console.error('❌ onTallaChange no disponible');
      return;
    }
    
    const isSelected = Array.isArray(tallaData) && tallaData.includes(size);
    onTallaChange(size, !isSelected);
  };

  // ✅ Verificar si está seleccionado
  const isSelected = (size) => {
    return Array.isArray(tallaData) && tallaData.includes(size);
  };

  // ESTILOS IDÉNTICOS A MODELO (solo para el exterior)
  const styles = {
    formLabel: {
      fontWeight: '600',
      marginBottom: '6px',
      display: 'block',
      color: theme === 'dark' ? '#e2e8f0' : '#2d3748'
    }
  };

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
            {isRTL ? 'اختر فئة فرعية لرؤية المقاسات' : 'Selecciona una subcategoría para ver las tallas'}
          </p>
        </div>
      </Form.Group>
    );
  }

  const sizes = getSizes();
  const selectedCount = Array.isArray(tallaData) ? tallaData.length : 0;

  return (
    <Form.Group className={className}>
      {/* EXACTAMENTE LA MISMA LÓGICA QUE MODELO: {label} directamente */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <Form.Label style={styles.formLabel} className="mb-0">
          {label} {required && '*'}
        </Form.Label>
        {selectedCount > 0 && (
          <small className="text-muted">
            {selectedCount} {t('selected', 'seleccionadas')}
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
          {sizes.map((size) => (
            <Form.Check
              key={size}
              type="checkbox"
              id={`talla-${size}`}
              label={size}
              checked={isSelected(size)}
              onChange={() => handleCheckboxChange(size)}
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
        {t('size_info', 'Selecciona las tallas disponibles')}
      </div>
      
      {/* FEEDBACK DE ERROR IDÉNTICO A MODELO */}
      {error && (
        <Form.Control.Feedback type="invalid">
          {error}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
};

export default React.memo(Talla);