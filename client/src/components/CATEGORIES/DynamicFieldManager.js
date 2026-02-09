// 📂 components/CATEGORIES/DynamicFieldManager.js - VERSIÓN COMPLETA SIN DEPENDENCIAS LOCALES
import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getFieldsForCategory } from './FieldConfig';
import FieldRendererUniversal from './FiledRendererUniversal';

// Función para formatear un string a ID (igual que en CategoryAccordion)
const formatToId = (str) => str.toLowerCase().replace(/[^a-z0-9]/g, '_');

// Función para formatear un ID a nombre para mostrar
const formatDisplayName = (id) => {
  if (!id) return '';
  return id
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// Emojis por defecto para categorías principales
const getDefaultEmoji = (categoryId) => {
  const emojis = {
    'immobilier': '🏠',
    'vehicules': '🚗',
    'telephones': '📱',
    'informatique': '💻',
    'electromenager': '🔌',
    'piecesDetachees': '⚙️',
    'vetements': '👕',
    'alimentaires': '🍎',
    'santebeaute': '💄',
    'meubles': '🛋️',
    'services': '🛠️',
    'materiaux': '🧱',
    'loisirs': '🎮',
    'emploi': '💼',
    'sport': '⚽',
    'voyages': '✈️',
    'boutiques': '🏪'
  };
  return emojis[categoryId] || '📁';
};

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
  isEdit = false
}) => {
  const { t } = useTranslation();
  const [visibleFields, setVisibleFields] = useState([]);
  const [categoryInfo, setCategoryInfo] = useState({
    categoryName: '',
    categoryEmoji: '',
    articleTypeName: '',
    articleTypeEmoji: '',
    subCategoryName: '',
    subCategoryEmoji: ''
  });
  const [loadingFields, setLoadingFields] = useState(false);
  
  // Obtener categorías de Redux (MongoDB)
  const { categories: mongoCategories = [] } = useSelector((state) => ({
    categories: state.category?.categories || []
  }));

  // Efecto para actualizar la información de la categoría desde MongoDB
  useEffect(() => {
    if (mainCategory) {
      // Si no hay categorías de MongoDB, usar los valores por defecto
      if (mongoCategories.length === 0) {
        setCategoryInfo({
          categoryName: formatDisplayName(mainCategory),
          categoryEmoji: getDefaultEmoji(mainCategory),
          articleTypeName: articleType ? formatDisplayName(articleType) : '',
          articleTypeEmoji: articleType ? getDefaultEmoji(articleType) : '',
          subCategoryName: subCategory ? formatDisplayName(subCategory) : '',
          subCategoryEmoji: subCategory ? getDefaultEmoji(subCategory) : ''
        });
        return;
      }

      // 1. Encontrar la categoría principal (nivel 1)
      const mainCat = mongoCategories.find(cat => 
        cat.level === 1 && 
        formatToId(cat.name) === mainCategory
      );

      if (mainCat) {
        let newCategoryInfo = {
          categoryName: mainCat.name,
          categoryEmoji: mainCat.emoji || getDefaultEmoji(mainCategory),
          articleTypeName: '',
          articleTypeEmoji: '',
          subCategoryName: '',
          subCategoryEmoji: ''
        };

        // Función para buscar un nodo por ID en los hijos de mainCat
        const findNodeInHierarchy = (targetId) => {
          // Buscar en nivel 2
          for (const child of mainCat.children || []) {
            if (formatToId(child.name) === targetId) {
              return child;
            }
            // Buscar en nivel 3
            for (const grandChild of child.children || []) {
              if (formatToId(grandChild.name) === targetId) {
                return grandChild;
              }
            }
          }
          return null;
        };

        // 2. Buscar articleType
        if (articleType) {
          const articleTypeNode = findNodeInHierarchy(articleType);
          if (articleTypeNode) {
            newCategoryInfo.articleTypeName = articleTypeNode.name;
            newCategoryInfo.articleTypeEmoji = articleTypeNode.emoji || getDefaultEmoji(articleType);
          } else {
            newCategoryInfo.articleTypeName = formatDisplayName(articleType);
            newCategoryInfo.articleTypeEmoji = getDefaultEmoji(articleType);
          }
        }

        // 3. Buscar subCategory
        if (subCategory) {
          const subCategoryNode = findNodeInHierarchy(subCategory);
          if (subCategoryNode) {
            newCategoryInfo.subCategoryName = subCategoryNode.name;
            newCategoryInfo.subCategoryEmoji = subCategoryNode.emoji || getDefaultEmoji(subCategory);
          } else {
            newCategoryInfo.subCategoryName = formatDisplayName(subCategory);
            newCategoryInfo.subCategoryEmoji = getDefaultEmoji(subCategory);
          }
        }

        console.log('📊 Información de categoría desde MongoDB:', newCategoryInfo);
        setCategoryInfo(newCategoryInfo);
      } else {
        // Si no encontramos la categoría principal, usar los valores por defecto
        setCategoryInfo({
          categoryName: formatDisplayName(mainCategory),
          categoryEmoji: getDefaultEmoji(mainCategory),
          articleTypeName: articleType ? formatDisplayName(articleType) : '',
          articleTypeEmoji: articleType ? getDefaultEmoji(articleType) : '',
          subCategoryName: subCategory ? formatDisplayName(subCategory) : '',
          subCategoryEmoji: subCategory ? getDefaultEmoji(subCategory) : ''
        });
      }
    } else {
      // Si no hay mainCategory, resetear la info
      setCategoryInfo({
        categoryName: '',
        categoryEmoji: '',
        articleTypeName: '',
        articleTypeEmoji: '',
        subCategoryName: '',
        subCategoryEmoji: ''
      });
    }
  }, [mainCategory, subCategory, articleType, mongoCategories]);

  // 🔥 OBTENER CAMPOS SEGÚN CATEGORÍA (FieldConfig local)

  useEffect(() => {
    console.log('🔄 DynamicFieldManager - Actualizando con:', {
      mainCategory,
      subCategory,
      articleType,
      currentStep,
      postDataKeys: postData ? Object.keys(postData) : []
    });
  
    setLoadingFields(true);
  
    // STEP 1: Solo información
    if (currentStep === 1) {
      setVisibleFields([]);
      setLoadingFields(false);
      return;
    }
  
    // STEPS 2-4: Campos dinámicos
    if (currentStep >= 2 && currentStep <= 4 && mainCategory) {
      const fields = getFieldsForCategory(mainCategory, subCategory, currentStep, articleType);
      
      // 🎯 EN MODO EDICIÓN: Mostrar TODOS los campos configurados
      const validFields = fields.filter(field => {
        if (!field || typeof field !== 'string' || field.trim() === '' || field.startsWith('!')) {
          return false;
        }
        return true;
      });
  
      // 🎯 LOG DE VALORES DISPONIBLES EN POSTDATA
      console.log(`📋 Step ${currentStep}: ${validFields.length} campos`, validFields);
      
      validFields.forEach(field => {
        const value = postData[field];
        if (value !== undefined && value !== null && value !== '') {
          console.log(`   ✅ ${field}:`, value);
        } else {
          console.log(`   ❌ ${field}: NO TIENE VALOR en postData`);
        }
      });
  
      setVisibleFields(validFields);
      setLoadingFields(false);
      return;
    }
  
    // STEP 5: Imágenes
    if (currentStep === 5) {
      setVisibleFields(['images']);
      setLoadingFields(false);
      return;
    }
  
    setVisibleFields([]);
    setLoadingFields(false);
  }, [mainCategory, subCategory, articleType, currentStep, postData]);

  // 🔥 MEMOIZAR CAMPOS RENDERIZADOS
  const renderedFields = useMemo(() => {
    console.log(`🎨 Renderizando ${visibleFields.length} campos para ${mainCategory}`);

    return visibleFields
      .map((fieldName, index) => {
        const renderedField = (
          <FieldRendererUniversal
            key={`${fieldName}-${index}-${mainCategory}-${subCategory}`}
            fieldName={fieldName}
            postData={postData}
            handleChangeInput={handleChangeInput}
            mainCategory={mainCategory}
            subCategory={subCategory}
            articleType={articleType}
            categoryInfo={categoryInfo}
            isRTL={isRTL}
            t={t}
          />
        );

        if (!renderedField) {
          console.warn(`⚠️ Campo ${fieldName} retornó null`);
          return null;
        }

        return (
          <div
            key={`${fieldName}-${index}-wrapper`}
            className={`col-12 ${visibleFields.length <= 2 ? 'col-md-12' : 'col-md-6'}`}
          >
            <div className="field-wrapper" style={{ height: '100%' }}>
              {renderedField}
            </div>
          </div>
        );
      })
      .filter(Boolean);
  }, [visibleFields, mainCategory, subCategory, articleType, categoryInfo, postData, handleChangeInput, isRTL, t]);

  // 🎨 RENDERIZAR CONTENIDO DEL STEP - ACTUALIZADO PARA USAR categoryInfo
  const renderStepContent = () => {
    // STEP 1: Información de categoría seleccionada
    if (currentStep === 1) {
      return (
        <div className="step-content">
          <div className={`alert ${isEdit ? 'alert-warning' : 'alert-success'}`}>
          {isEdit && currentStep > 1 && (
        <div className="alert alert-info mb-3 py-2">
          <div className="d-flex align-items-center">
            <i className="fas fa-edit me-2"></i>
            <div>
              <small className="fw-bold">Mode édition activé</small>
              <small className="d-block text-muted">
                {Object.keys(postData).filter(k => postData[k]).length} valeur(s) chargée(s)
              </small>
            </div>
          </div>
        </div>
      )}
            <div className="category-details mt-3">
              <div className="row">
                <div className="col-12">
                  <div className="d-flex align-items-center mb-3">
                    <div className="category-icon me-3" style={{ fontSize: '2.5rem' }}>
                      {categoryInfo.categoryEmoji}
                    </div>
                    <div>
                      <h6 className="mb-1 fw-bold">{categoryInfo.categoryName || 'Sélectionnez une catégorie'}</h6>
                      <small className="text-muted">
                        {mainCategory ? 'Catégorie principale' : 'Sélectionnez une catégorie'}
                      </small>
                    </div>
                  </div>
                </div>

                {/* INFORMACIÓN DE NIVELES */}
                {mainCategory && (
                  <>
                    {/* articleType */}
                    {categoryInfo.articleTypeName && (
                      <div className="col-md-6 mb-2">
                        <div className="card border-0 bg-light">
                          <div className="card-body py-2">
                            <small className="text-muted d-block">
                              Type d'article
                            </small>
                            <div className="fw-medium">
                              <span className="me-2">{categoryInfo.articleTypeEmoji}</span>
                              {categoryInfo.articleTypeName}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* subCategory */}
                    {categoryInfo.subCategoryName && (
                      <div className="col-md-6 mb-2">
                        <div className="card border-0 bg-light">
                          <div className="card-body py-2">
                            <small className="text-muted d-block">
                              Sous-catégorie
                            </small>
                            <div className="fw-medium">
                              <span className="me-2">{categoryInfo.subCategoryEmoji}</span>
                              {categoryInfo.subCategoryName}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              <p className="mt-3 mb-0">
                {isEdit
                  ? 'Vous pouvez modifier la catégorie si nécessaire.'
                  : 'Passez à l\'étape suivante pour ajouter les détails.'
                }
              </p>
            </div>
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
            <p>Téléchargez les images de votre annonce (minimum 1, maximum 10)</p>
          </div>
        </div>
      );
    }

    // STEPS 2, 3, 4: Campos dinámicos
    return (
      <div className="step-content">
        {loadingFields ? (
          <div className="alert alert-info mb-0">
            <div className="d-flex align-items-center">
              <div className="spinner-border spinner-border-sm me-2" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <div>
                <h6 className="mb-1">Chargement des champs...</h6>
                <p className="small mb-0">Configuration pour {categoryInfo.categoryName}</p>
              </div>
            </div>
          </div>
        ) : renderedFields.length === 0 ? (
          <div className="alert alert-warning mb-0">
            <h5><i className="fas fa-exclamation-triangle me-2"></i> Configuration en cours</h5>
            <p className="mb-2">
              {!mainCategory
                ? 'Sélectionnez d\'abord une catégorie à l\'étape 1'
                : `Aucun champ configuré pour ${categoryInfo.categoryName}`
              }
            </p>
          </div>
        ) : (
          <div className="row g-3">
            {/* BARRA DE INFORMACIÓN DE CATEGORÍA */}
            {mainCategory && (
              <div className="col-12">
                <div className="category-path-card mb-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-wrap">
                      <span className="path-step">
                        <span className="path-emoji">{categoryInfo.categoryEmoji}</span>
                        <span className="path-name">{categoryInfo.categoryName}</span>
                      </span>

                      {categoryInfo.articleTypeName && (
                        <>
                          <span className="path-arrow mx-2">
                            <i className="fas fa-arrow-right text-muted"></i>
                          </span>
                          <span className="path-step">
                            <span className="path-emoji">{categoryInfo.articleTypeEmoji}</span>
                            <span className="path-name">{categoryInfo.articleTypeName}</span>
                          </span>
                        </>
                      )}

                      {categoryInfo.subCategoryName && (
                        <>
                          <span className="path-arrow mx-2">
                            <i className="fas fa-arrow-right text-muted"></i>
                          </span>
                          <span className="path-step">
                            <span className="path-emoji">{categoryInfo.subCategoryEmoji}</span>
                            <span className="path-name">{categoryInfo.subCategoryName}</span>
                          </span>
                        </>
                      )}
                    </div>

                    {isEdit && (
                      <button
                        className="btn btn-sm btn-outline-warning"
                        onClick={() => onStepChange && onStepChange(1)}
                        title="Modifier la catégorie"
                      >
                        <i className="fas fa-edit me-1"></i> Changer
                      </button>
                    )}
                  </div>

                  <div className="mt-2">
                    <small className="text-muted">
                      <i className="fas fa-cog me-1"></i>
                      {renderedFields.length} champ(s) configuré(s)
                    </small>
                  </div>
                </div>
              </div>
            )}

            {/* CAMPOS RENDERIZADOS */}
            {renderedFields}
          </div>
        )}
      </div>
    );
  };

  // ✅ VALIDAR SI SE PUEDE CONTINUAR
  const canContinue = () => {
    if (currentStep === 1 || currentStep === 5) return true;

    const requiredFieldsByStep = {
      2: ['title', 'description'],
      3: ['price'],
      4: ['telephone', 'wilaya']
    };

    const currentRequired = requiredFieldsByStep[currentStep] || [];
    const filteredRequired = currentRequired.filter(field =>
      visibleFields.includes(field)
    );

    return filteredRequired.every(field => {
      const value = postData[field] || '';
      return value.toString().trim() !== '';
    });
  };

  // 🚫 VERIFICAR SI FALTA CATEGORÍA
  if (currentStep > 1 && !mainCategory) {
    return (
      <div className="text-center py-4">
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
              {currentStep === 1 && (isEdit ? '✏️ Catégorie' : '✅ Catégorie')}
              {currentStep === 2 && '📝 Détails'}
              {currentStep === 3 && '💰 Prix'}
              {currentStep === 4 && '📍 Contact'}
              {currentStep === 5 && '🖼️ Images'}
            </h4>
            <small className="text-muted">
              {mainCategory && (
                <div className="d-flex align-items-center flex-wrap">
                  <span className="category-badge me-2 mb-1">
                    {categoryInfo.categoryEmoji} {categoryInfo.categoryName}
                  </span>

                  {categoryInfo.articleTypeName && (
                    <>
                      <i className="fas fa-chevron-right text-muted mx-1 mb-1"></i>
                      <span className="category-badge me-2 mb-1">
                        {categoryInfo.articleTypeEmoji} {categoryInfo.articleTypeName}
                      </span>
                    </>
                  )}

                  {categoryInfo.subCategoryName && (
                    <>
                      <i className="fas fa-chevron-right text-muted mx-1 mb-1"></i>
                      <span className="category-badge mb-1">
                        {categoryInfo.subCategoryEmoji} {categoryInfo.subCategoryName}
                      </span>
                    </>
                  )}

                  {isEdit && currentStep > 1 && (
                    <button
                      className="btn btn-sm btn-outline-warning ms-2 py-0 mb-1"
                      onClick={() => onStepChange && onStepChange(1)}
                      style={{ fontSize: '0.75rem' }}
                    >
                      <i className="fas fa-edit me-1"></i> modifier
                    </button>
                  )}
                </div>
              )}
            </small>
          </div>
          <span className={`badge ${isEdit ? 'bg-warning' : 'bg-primary'}`}>
            {isEdit ? '✏️' : ''} Étape {currentStep}/5
          </span>
        </div>

        {/* BARRA DE PROGRESO */}
        <div className="progress mt-3" style={{ height: '5px' }}>
          <div
            className={`progress-bar ${isEdit ? 'bg-warning' : 'bg-primary'}`}
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* CONTENIDO */}
      <div style={{
        minHeight: visibleFields.length === 0 && currentStep > 1 ? '150px' : 'auto',
        transition: 'min-height 0.3s ease',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {renderStepContent()}
      </div>

      {/* NAVEGACIÓN */}
      {showNavigation && (
        <div className="step-navigation mt-4 pt-3 border-top">
          <div className="d-flex justify-content-between">
            {/* BOTÓN PRÉCÉDENT */}
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

            {/* BOTÓN SUIVANT/PUBLIER */}
            <button
              className={`btn ${isEdit ? 'btn-warning' : 'btn-primary'}`}
              onClick={() => {
                if (currentStep < 5) {
                  onStepChange && onStepChange(currentStep + 1);
                }
              }}
              disabled={!canContinue()}
            >
              {currentStep < 5 ? (
                <>
                  {isEdit ? 'Continuer' : 'Suivant'}
                  <i className="fas fa-arrow-right ms-2"></i>
                </>
              ) : (
                <>
                  Continuer
                  <i className="fas fa-arrow-right ms-2"></i>
                </>
              )}
            </button>
          </div>

          {/* MENSAJE DE VALIDACIÓN */}
          {!canContinue() && currentStep !== 5 && (
            <div className="alert alert-warning mt-3 py-2 mb-0">
              <small>
                <i className="fas fa-exclamation-circle me-1"></i>
                {currentStep === 2 && 'Complétez le titre et la description'}
                {currentStep === 3 && 'Indiquez un prix'}
                {currentStep === 4 && 'Renseignez le téléphone et la wilaya'}
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
          min-height: ${visibleFields.length === 0 && currentStep > 1 ? '250px' : 'auto'};
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        
        .step-header {
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
          flex-shrink: 0;
        }
        
        .category-badge {
          background: #f8f9fa;
          padding: 2px 8px;
          border-radius: 4px;
          border: 1px solid #dee2e6;
          font-size: 0.85rem;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }
        
        .category-path-card {
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #dee2e6;
        }
        
        .path-step {
          display: inline-flex;
          align-items: center;
          background: white;
          padding: 5px 12px;
          border-radius: 6px;
          border: 1px solid #dee2e6;
          margin-bottom: 5px;
        }
        
        .path-emoji {
          margin-right: 8px;
          font-size: 1.2rem;
        }
        
        .path-name {
          font-weight: 500;
          font-size: 0.9rem;
        }
        
        .path-arrow {
          color: #6c757d;
        }
        
        .field-wrapper {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #dee2e6;
          margin-bottom: 15px;
          transition: all 0.2s ease;
          min-height: 90px;
          height: 100%;
        }
        
        .field-wrapper:hover {
          border-color: #0d6efd;
          box-shadow: 0 2px 5px rgba(13, 110, 253, 0.1);
          background: #fff;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .step-content {
          animation: fadeIn 0.3s ease;
        }
        
        @media (max-width: 768px) {
          .dynamic-field-manager {
            padding: 15px;
          }
          
          .category-path-card {
            padding: 10px;
          }
          
          .path-step {
            padding: 3px 8px;
            font-size: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
};

// PROPIEDADES POR DEFECTO
DynamicFieldManager.defaultProps = {
  currentStep: 1,
  showNavigation: true,
  isEdit: false,
  mainCategory: null,
  subCategory: null,
  articleType: null,
  postData: {},
  handleChangeInput: () => { },
  isRTL: false,
  onStepChange: () => { }
};

export default DynamicFieldManager;