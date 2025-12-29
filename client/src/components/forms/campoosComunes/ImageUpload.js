import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ImageUpload = ({ 
  images = [], 
  handleChangeImages, 
  deleteImages, 
  theme = 'light',
  label = '🖼️ Imágenes del Producto',  // Icono incluido
  required = false,
  className = 'mb-3',
  disabled = false,
  error = null
}) => {
  const { t, i18n } = useTranslation(["categories"]);
  const isRTL = i18n.language === 'ar';

  const imageShow = (src, index) => (
    <div className="position-relative">
      <img
        src={src}
        alt={t('preview', 'Vista previa')}
        style={{
          width: '100px',
          height: '100px',
          objectFit: 'cover',  // Cambiado de 'contain' a 'cover'
          borderRadius: '8px',
          border: `1px solid ${theme === 'dark' ? '#4a5568' : '#cbd5e0'}`
        }}
      />
    </div>
  );

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
      
      {/* CONTENEDOR EXTERIOR CON ESTILOS DE MODELO */}
      <div style={{
        ...styles.formControl,
        minHeight: '200px',
        padding: images.length > 0 ? '15px' : '20px'
      }}>
        {/* 📝 PREVIEW DE IMÁGENES */}
        {images.length > 0 && (
          <div className="mb-3">
            <div className="d-flex flex-wrap gap-3">
              {images.map((img, index) => {
                // Obtener la URL de la imagen
                let imageSrc = '';
                if (img.camera) {
                  imageSrc = img.camera;
                } else if (img.url) {
                  imageSrc = img.url;
                } else if (img instanceof File || img instanceof Blob) {
                  imageSrc = URL.createObjectURL(img);
                }

                return (
                  <div 
                    key={index} 
                    className="position-relative"
                    style={{
                      width: '100px',
                      height: '100px'
                    }}
                  >
                    <img
                      src={imageSrc}
                      alt={t('preview', 'Vista previa')}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',  // Esto hace que la imagen cubra todo el espacio
                        borderRadius: '6px',
                        border: `1px solid ${theme === 'dark' ? '#4a5568' : '#cbd5e0'}`
                      }}
                    />
                    <button
                      type="button"
                      className="position-absolute top-0 end-0 bg-danger text-white border-0 rounded-circle"
                      onClick={() => deleteImages && deleteImages(index)}
                      style={{
                        width: '24px',
                        height: '24px',
                        fontSize: '14px',
                        lineHeight: '1',
                        transform: 'translate(30%, -30%)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      ×
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="text-muted small mt-2" style={{
              textAlign: isRTL ? 'right' : 'left'
            }}>
              {images.length} {t('images_selected', 'imágenes seleccionadas')}
            </div>
          </div>
        )}
        
        {/* 📝 ÁREA DE UPLOAD */}
        <div className="text-center p-3" style={{
          border: `2px dashed ${theme === 'dark' ? '#4a5568' : '#cbd5e0'}`,
          borderRadius: '8px',
          backgroundColor: theme === 'dark' ? '#1a202c' : '#f7fafc',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1
        }}>
          <label
            htmlFor="image-upload"
            style={{
              display: 'block',
              cursor: disabled ? 'not-allowed' : 'pointer',
              color: theme === 'dark' ? '#63b3ed' : '#3182ce',
              fontWeight: '500'
            }}
          >
            {t('upload_images', 'Subir imágenes')}
          </label>
          <Form.Control
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleChangeImages}
            disabled={disabled}
            style={{ display: 'none' }}
          />
          <div className="text-muted small mt-2">
            {t('upload_info', 'Selecciona imágenes del producto')}
          </div>
        </div>
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

export default ImageUpload;