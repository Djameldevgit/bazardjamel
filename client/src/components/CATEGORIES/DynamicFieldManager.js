// 📁 src/components/CATEGORIES/DynamicFieldManager.js
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getFieldsForStep } from './FieldConfig';
import FieldRendererUniversal from './FiledRendererUniversal';

const DynamicFieldManager = ({ 
  mainCategory, 
  subCategory, 
  articleType,
  postData, 
  handleChangeInput,
  isRTL,
  currentStep = 1,
  onStepChange,
  showNavigation = true,
  isEdit = false // 🔥 NUEVO: Recibir si es modo edición
}) => {
  const { t } = useTranslation();
  const [visibleFields, setVisibleFields] = useState([]);
  
  // 🔥 OBTENER CAMPOS SEGÚN STEP ACTUAL
  useEffect(() => {
    console.log('🔄 Actualizando campos para step:', currentStep, 'Edit:', isEdit);
    
    let fields = [];
    
    // STEP 1: Solo mostrar en modo creación o si está permitido cambiar categoría en edición
    if (currentStep === 1) {
      // En modo edición, mostrar solo si estamos cambiando categoría
      if (isEdit) {
        // En edición, step 1 se maneja en CreateAnnoncePage
        fields = [];
        console.log('✅ Step 1 (Edit): Mostrar selector de categoría en el componente padre');
      } else {
        fields = [];
        console.log('✅ Step 1 (Création): Sin campos (ya se seleccionó categoría)');
      }
    }
    
    // STEP 2, 3, 4: DINÁMICOS (de FieldConfig)
    else if (currentStep >= 2 && currentStep <= 4) {
      if (mainCategory) {
        fields = getFieldsForStep(mainCategory, currentStep);
        console.log(`✅ Step ${currentStep}: ${fields.length} campos para ${mainCategory}`);
      } else {
        console.log('⚠️ No hay categoría seleccionada para mostrar campos');
      }
    }
    
    // STEP 5: FIJO (imágenes)
    else if (currentStep === 5) {
      fields = [];
      console.log('✅ Step 5: Imágenes (campo especial)');
    }
    
    setVisibleFields(fields || []);
    
  }, [mainCategory, currentStep, isEdit]);
  
  // 🔥 RENDERIZAR CONTENIDO DEL STEP
  const renderStepContent = () => {
    // 🔥 EN MODO EDICIÓN, PERMITIR VER STEP 1 COMO SELECTOR DE CATEGORÍA
    if (currentStep === 1 && isEdit) {
      return (
        <div className="step-content">
          <div className="alert alert-warning">
            <h5><i className="fas fa-edit me-2"></i> Modification de catégorie</h5>
            <p className="mb-3">
              Vous pouvez modifier la catégorie de cette annonce.<br/>
              <strong>Attention:</strong> Changer la catégorie réinitialisera certains champs spécifiques.
            </p>
            <div className="category-info">
              <p className="mb-2">
                <strong>Catégorie actuelle:</strong> {mainCategory || 'Non définie'}<br/>
                <strong>Sous-catégorie actuelle:</strong> {subCategory || 'Non définie'}<br/>
                {articleType && <><strong>Type actuel:</strong> {articleType}</>}
              </p>
            </div>
            <div className="mt-3">
              <small className="text-muted">
                <i className="fas fa-info-circle me-1"></i>
                Retournez à l'étape principale pour sélectionner une nouvelle catégorie
              </small>
            </div>
          </div>
        </div>
      );
    }
    
    // STEP 1 normal (solo creación)
    if (currentStep === 1 && !isEdit) {
      return (
        <div className="step-content">
          <div className="alert alert-success">
            <h5><i className="fas fa-check-circle me-2"></i> Catégorie sélectionnée</h5>
            <p>
              <strong>Catégorie:</strong> {mainCategory || 'Non sélectionnée'}<br/>
              <strong>Sous-catégorie:</strong> {subCategory || 'Non sélectionnée'}<br/>
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
            <h5><i className="fas fa-exclamation-triangle me-2"></i> Information manquante</h5>
            <p>
              {!mainCategory 
                ? 'Sélectionnez d\'abord une catégorie à l\'étape 1'
                : `Configuration des champs en cours pour ${mainCategory} → étape ${currentStep}`
              }
            </p>
            {isEdit && (
              <div className="mt-2">
                <button 
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => onStepChange && onStepChange(1)}
                >
                  <i className="fas fa-edit me-1"></i> Modifier la catégorie
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="row g-3">
            {/* 🔥 AGREGAR BOTÓN PARA MODIFICAR CATEGORÍA EN MODO EDICIÓN */}
            {isEdit && currentStep === 2 && (
              <div className="col-12">
                <div className="alert alert-light border d-flex justify-content-between align-items-center">
                  <div>
                    <small>
                      <strong>Catégorie:</strong> {mainCategory} • {subCategory}
                      {articleType && ` • ${articleType}`}
                    </small>
                  </div>
                  <button 
                    className="btn btn-sm btn-outline-warning"
                    onClick={() => onStepChange && onStepChange(1)}
                    title="Modifier la catégorie"
                  >
                    <i className="fas fa-exchange-alt me-1"></i> Changer
                  </button>
                </div>
              </div>
            )}
            
            {visibleFields.map((fieldName, index) => (
              <div key={index} className="col-12 col-md-6">
                <div className="field-wrapper">
                  <FieldRendererUniversal
                    fieldName={fieldName}
                    postData={postData}
                    handleChangeInput={handleChangeInput}
                    mainCategory={mainCategory}
                    subCategory={subCategory}
                    articleType={articleType}
                    isRTL={isRTL}
                    t={t}
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
    // Step 1: Siempre puede continuar
    if (currentStep === 1) return true;
    
    // Step 5: Verificar imágenes (esto lo hará tu componente de imágenes)
    if (currentStep === 5) return true;
    
    // Steps 2, 3, 4: Verificar campos requeridos
    const requiredFields = {
      2: ['title', 'description'].filter(f => visibleFields.includes(f)),
      3: ['price'].filter(f => visibleFields.includes(f)),
      4: ['telephone', 'wilaya'].filter(f => visibleFields.includes(f))
    };
    
    const currentRequired = requiredFields[currentStep] || [];
    
    return currentRequired.every(field => {
      const value = postData[field] || '';
      return value.toString().trim() !== '';
    });
  };
  
  // 🔥 LÓGICA MEJORADA PARA MOSTRAR MENSAJE DE CATEGORÍA FALTANTE
  if (currentStep > 1 && !mainCategory) {
    return (
      <div className="text-center py-5">
        <div className="alert alert-warning">
          <i className="fas fa-hand-point-up fa-2x mb-3"></i>
          <h5>Sélectionnez d'abord une catégorie</h5>
          <p className="mb-3">
            {isEdit 
              ? 'Cette annonce n\'a pas de catégorie définie.'
              : 'Retournez à l\'étape 1 pour choisir une catégorie'
            }
          </p>
          <button 
            className="btn btn-primary"
            onClick={() => onStepChange && onStepChange(1)}
          >
            <i className="fas fa-arrow-left me-2"></i>
            {isEdit ? 'Définir une catégorie' : 'Retour à l\'étape 1'}
          </button>
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
              {currentStep === 1 && (isEdit ? '✏️ Modification catégorie' : '✅ Catégorie sélectionnée')}
              {currentStep === 2 && '📝 Détails du produit'}
              {currentStep === 3 && '💰 Prix et conditions'}
              {currentStep === 4 && '📍 Contact et localisation'}
              {currentStep === 5 && '🖼️ Images'}
            </h4>
            <small className="text-muted">
              {mainCategory && (
                <>
                  Catégorie: <strong>{mainCategory}</strong> → <strong>{subCategory}</strong>
                  {articleType && ` • Type: ${articleType}`}
                  {isEdit && currentStep > 1 && (
                    <button 
                      className="btn btn-sm btn-outline-warning ms-2 py-0"
                      onClick={() => onStepChange && onStepChange(1)}
                      style={{ fontSize: '0.75rem' }}
                    >
                      <i className="fas fa-edit me-1"></i> modifier
                    </button>
                  )}
                </>
              )}
            </small>
          </div>
          <span className={`badge ${isEdit ? 'bg-warning' : 'bg-primary'}`}>
            {isEdit ? '✏️ Étape' : 'Étape'} {currentStep}/5
          </span>
        </div>
        
        {/* Barra de progreso */}
        <div className="progress mt-3" style={{ height: '5px' }}>
          <div 
            className={`progress-bar ${isEdit ? 'bg-warning' : ''}`}
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
            {/* Botón Précédent */}
            <div>
              {currentStep > 1 ? (
                <button 
                  className="btn btn-outline-secondary"
                  onClick={() => onStepChange && onStepChange(currentStep - 1)}
                >
                  <i className="fas fa-arrow-left me-2"></i> Précédent
                </button>
              ) : (
                isEdit && (
                  <button 
                    className="btn btn-outline-warning"
                    onClick={() => onStepChange && onStepChange(currentStep - 1)}
                  >
                    <i className="fas fa-edit me-2"></i> Modifier catégorie
                  </button>
                )
              )}
            </div>
            
            {/* Botón Suivant/Publier */}
            <button 
              className={`btn ${isEdit ? 'btn-warning' : 'btn-primary'}`}
              onClick={() => onStepChange && onStepChange(currentStep + 1)}
              disabled={!canContinue()}
            >
              {currentStep < 5 ? (
                <>
                  {isEdit ? 'Continuer modification' : 'Suivant'} 
                  <i className="fas fa-arrow-right ms-2"></i>
                </>
              ) : (
                <>
                  {isEdit ? 'Mettre à jour' : 'Publier'} 
                  <i className="fas fa-paper-plane ms-2"></i>
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
                {isEdit && currentStep === 2 && (
                  <span className="ms-2">
                    <button 
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => onStepChange && onStepChange(1)}
                    >
                      <i className="fas fa-exchange-alt me-1"></i> Changer catégorie
                    </button>
                  </span>
                )}
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
          transition: all 0.2s ease;
        }
        
        .field-wrapper:hover {
          border-color: #0d6efd;
          box-shadow: 0 2px 5px rgba(13, 110, 253, 0.1);
        }
        
        .progress {
          background: #e9ecef;
        }
        
        .progress-bar {
          transition: width 0.3s ease;
        }
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        
        .category-info {
          background: #fff3cd;
          border: 1px solid #ffeaa7;
          border-radius: 5px;
          padding: 10px;
          margin: 10px 0;
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