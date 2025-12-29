// 📁 src/components/CATEGORIES/DynamicFieldManager.js
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FieldRenderer from './FieldRenderer';
import { getFieldsForStep } from './FieldConfig';

const DynamicFieldManager = ({ 
  mainCategory, 
  subCategory, 
  articleType,
  postData, 
  handleChangeInput,
  isRTL,
  currentStep = 1,
  onStepChange,
  showNavigation = true
}) => {
  const { t } = useTranslation();
  const [visibleFields, setVisibleFields] = useState([]);
  
  // 🔥 OBTENER CAMPOS SEGÚN STEP ACTUAL
  useEffect(() => {
    console.log('🔄 Actualizando campos para step:', currentStep);
    
    let fields = [];
    
    // STEP 1: FIJO (categoría ya seleccionada, no muestra campos aquí)
    if (currentStep === 1) {
      fields = [];
      console.log('✅ Step 1: Sin campos (ya se seleccionó categoría)');
    }
    
    // STEP 2, 3, 4: DINÁMICOS (de FieldConfig)
    else if (currentStep >= 2 && currentStep <= 4) {
      if (mainCategory) {
        fields = getFieldsForStep(mainCategory, currentStep);
      } else {
        console.log('⚠️ No hay categoría seleccionada');
      }
    }
    
    // STEP 5: FIJO (imágenes)
    else if (currentStep === 5) {
      fields = [];
      console.log('✅ Step 5: Imágenes (campo especial)');
    }
    
    setVisibleFields(fields || []);
    
  }, [mainCategory, currentStep]);
  
  // 🔥 RENDERIZAR CONTENIDO DEL STEP
  const renderStepContent = () => {
    // STEP 1: Información de categoría seleccionada
    if (currentStep === 1) {
      return (
        <div className="step-content">
          <div className="alert alert-success">
            <h5><i className="fas fa-check-circle me-2"></i> Catégorie sélectionnée</h5>
            <p>
              <strong>Catégorie:</strong> {mainCategory}<br/>
              <strong>Sous-catégorie:</strong> {subCategory}<br/>
              {articleType && <><strong>Type:</strong> {articleType}</>}
            </p>
            <p className="mb-0">Passez à l'étape suivante pour ajouter les détails.</p>
          </div>
        </div>
      );
    }
    
    // STEP 5: Imágenes
    if (currentStep === 5) {
      return (
        <div className="step-content">
          <div className="alert alert-info">
            <h5><i className="fas fa-images me-2"></i> Étape 5: Images</h5>
            <p>Téléchargez les images de votre annonce (obligatoire)</p>
            {/* Aquí irá tu componente de imágenes */}
          </div>
        </div>
      );
    }
    
    // STEPS 2, 3, 4: Campos dinámicos
    return (
      <div className="step-content">
        {visibleFields.length === 0 ? (
          <div className="alert alert-warning">
            <h5><i className="fas fa-exclamation-triangle me-2"></i> Configuration manquante</h5>
            <p>
              {!mainCategory 
                ? 'Sélectionnez d\'abord une catégorie à l\'étape 1'
                : `Aucun champ configuré pour ${mainCategory} → étape ${currentStep}`
              }
            </p>
            <p className="mb-0">
              Ajoutez la configuration dans <code>FieldConfig.js</code>
            </p>
          </div>
        ) : (
          <div className="row g-3">
            {visibleFields.map((fieldName, index) => (
              <div key={index} className="col-12 col-md-6">
                <div className="field-wrapper">
                  <FieldRenderer
                    fieldName={fieldName}
                    postData={postData}
                    handleChangeInput={handleChangeInput}
                    mainCategory={mainCategory}
                    subCategory={subCategory}
                    articleType={articleType}
                    isRTL={isRTL}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  // 🔥 VALIDAR SI SE PUEDE CONTINUAR
  const canContinue = () => {
    // Step 1 siempre puede continuar (ya se seleccionó categoría)
    if (currentStep === 1) return true;
    
    // Step 5: Verificar imágenes (esto lo hará tu componente de imágenes)
    if (currentStep === 5) return true;
    
    // Steps 2, 3, 4: Verificar campos requeridos
    const requiredFields = {
      2: ['title', 'description'].filter(f => visibleFields.includes(f)),
      3: ['price'].filter(f => visibleFields.includes(f)),
      4: ['telephone'].filter(f => visibleFields.includes(f))
    };
    
    const currentRequired = requiredFields[currentStep] || [];
    
    return currentRequired.every(field => {
      const value = postData[field] || '';
      return value.toString().trim() !== '';
    });
  };
  
  // Si no hay categoría seleccionada (excepto step 1)
  if (!mainCategory && currentStep > 1) {
    return (
      <div className="text-center py-5">
        <div className="alert alert-warning">
          <i className="fas fa-hand-point-up fa-2x mb-3"></i>
          <h5>Sélectionnez d'abord une catégorie</h5>
          <p className="mb-0">Retournez à l'étape 1 pour choisir une catégorie</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="dynamic-field-manager">
      {/* CABECERA */}
      <div className="step-header mb-4">
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <h4 className="mb-1">
              {currentStep === 1 && '✅ Catégorie sélectionnée'}
              {currentStep === 2 && '📝 Détails du produit'}
              {currentStep === 3 && '💰 Prix et conditions'}
              {currentStep === 4 && '📍 Contact et localisation'}
              {currentStep === 5 && '🖼️ Images'}
            </h4>
            <small className="text-muted">
              {mainCategory && `Catégorie: ${mainCategory} → ${subCategory}`}
            </small>
          </div>
          <span className="badge bg-primary">Étape {currentStep}/5</span>
        </div>
        
        {/* Barra de progreso */}
        <div className="progress mt-3" style={{ height: '5px' }}>
          <div 
            className="progress-bar" 
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </div>
      
      {/* CONTENIDO */}
      {renderStepContent()}
      
      {/* NAVEGACIÓN */}
      {showNavigation && (
        <div className="step-navigation mt-4 pt-3 border-top">
          <div className="d-flex justify-content-between">
            {currentStep > 1 ? (
              <button 
                className="btn btn-outline-secondary"
                onClick={() => onStepChange && onStepChange(currentStep - 1)}
              >
                <i className="fas fa-arrow-left me-2"></i> Précédent
              </button>
            ) : (
              <div></div> // Espacio vacío
            )}
            
            <button 
              className="btn btn-primary"
              onClick={() => onStepChange && onStepChange(currentStep + 1)}
              disabled={!canContinue()}
            >
              {currentStep < 5 ? (
                <>
                  Suivant <i className="fas fa-arrow-right ms-2"></i>
                </>
              ) : (
                <>
                  Publier <i className="fas fa-paper-plane ms-2"></i>
                </>
              )}
            </button>
          </div>
          
          {/* Mensaje si no se puede continuar */}
          {!canContinue() && currentStep !== 5 && (
            <div className="alert alert-warning mt-3 py-2">
              <small>
                <i className="fas fa-exclamation-circle me-1"></i>
                Complétez les champs obligatoires avant de continuer
              </small>
            </div>
          )}
        </div>
      )}
      
      {/* ESTILOS */}
      <style jsx>{`
        .dynamic-field-manager {
          background: white;
          padding: 25px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .step-header {
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }
        
        .step-content {
          min-height: 300px;
        }
        
        .field-wrapper {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #dee2e6;
          margin-bottom: 15px;
        }
        
        .field-wrapper:hover {
          border-color: #0d6efd;
          box-shadow: 0 2px 5px rgba(13, 110, 253, 0.1);
        }
        
        .progress {
          background: #e9ecef;
        }
        
        .progress-bar {
          background: linear-gradient(90deg, #0d6efd, #0dcaf0);
          transition: width 0.3s ease;
        }
        
        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .dynamic-field-manager {
            padding: 15px;
          }
          
          .field-wrapper {
            padding: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default DynamicFieldManager;