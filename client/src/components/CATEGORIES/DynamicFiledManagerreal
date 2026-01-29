// 📂 components/CATEGORIES/DynamicFieldManager.js
import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getFieldsForCategory } from './FieldConfig';
import FieldRendererUniversal from './FiledRendererUniversal';
import { categoryHierarchy } from './index';

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
    articleTypeName: '',
    subCategoryName: ''
  });
  const [loadingFields, setLoadingFields] = useState(false);

  // 🔍 OBTENER INFORMACIÓN DE CATEGORÍA CON NOMBRES AMIGABLES
  useEffect(() => {
    if (mainCategory) {
      const hierarchy = categoryHierarchy[mainCategory];
      if (hierarchy) {
        let newCategoryInfo = {
          categoryName: getCategoryDisplayName(mainCategory),
          articleTypeName: '',
          subCategoryName: ''
        };

        // OBTENER NOMBRE DEL articleType
        if (articleType && hierarchy.levels === 2) {
          // Para categorías de 2 niveles (electromenager, vetements)
          const articleTypeItem = hierarchy.articleTypes?.find(
            item => item.id === articleType
          ) || hierarchy.categories?.find(item => item.id === articleType);
          
          if (articleTypeItem) {
            newCategoryInfo.articleTypeName = articleTypeItem.name;
          }
        } else if (articleType && hierarchy.levels === 1) {
          // Para categorías de 1 nivel (vehicules, telephones)
          const subcatItem = hierarchy.subcategories?.find(
            item => item.id === articleType
          );
          if (subcatItem) {
            newCategoryInfo.articleTypeName = subcatItem.name;
          }
        }

        // OBTENER NOMBRE DEL subCategory
        if (subCategory) {
          if (hierarchy.levels === 2 && articleType) {
            // Buscar en subcategories del articleType
            const subCategories = hierarchy.subcategories?.[articleType] || [];
            const subCatItem = subCategories.find(item => item.id === subCategory);
            if (subCatItem) {
              newCategoryInfo.subCategoryName = subCatItem.name;
            }
          } else if (hierarchy.levels === 1) {
            // Para categorías de 1 nivel
            const subcatItem = hierarchy.subcategories?.find(
              item => item.id === subCategory
            );
            if (subcatItem) {
              newCategoryInfo.subCategoryName = subcatItem.name;
            }
          }
          
          // Si no encontramos el nombre, usar el ID
          if (!newCategoryInfo.subCategoryName && subCategory) {
            newCategoryInfo.subCategoryName = formatDisplayName(subCategory);
          }
        }

        // Si articleTypeName sigue vacío, usar el ID formateado
        if (!newCategoryInfo.articleTypeName && articleType) {
          newCategoryInfo.articleTypeName = formatDisplayName(articleType);
        }

        setCategoryInfo(newCategoryInfo);

        console.log('📊 Información de categoría actualizada:', {
          mainCategory,
          articleType,
          subCategory,
          categoryInfo: newCategoryInfo
        });
      }
    }
  }, [mainCategory, articleType, subCategory]);

  // 🔥 OBTENER CAMPOS SEGÚN CATEGORÍA Y NIVELES
  useEffect(() => {
    console.log('🔄 DynamicFieldManager - Actualizando campos:', {
      mainCategory,
      subCategory,
      articleType,
      currentStep,
      categoryInfo
    });

    setLoadingFields(true);
    let fields = [];

    // STEP 1: Información de categoría seleccionada
    if (currentStep === 1) {
      fields = [];
      console.log('✅ Step 1: Mostrando información de categoría');
      setVisibleFields(fields);
      setLoadingFields(false);
      return;
    }

    // STEP 2, 3, 4: CAMPOS DINÁMICOS
    else if (currentStep >= 2 && currentStep <= 4) {
      if (mainCategory) {
        // Obtener campos específicos para la categoría
        fields = getFieldsForCategory(
          mainCategory,
          subCategory,
          currentStep,
          articleType
        );

        console.log(`📋 Campos obtenidos para ${mainCategory}:`, fields);

        // 🔥 FILTRAR CAMPOS VÁLIDOS
        const validFields = fields.filter(field =>
          field &&
          typeof field === 'string' &&
          field.trim() !== '' &&
          !field.startsWith('!')
        );

        console.log(`✅ Step ${currentStep}: ${validFields.length} campos válidos`);
        setVisibleFields(validFields);
        setLoadingFields(false);
        return;
      } else {
        console.log('⚠️ No hay categoría seleccionada');
        setVisibleFields([]);
        setLoadingFields(false);
        return;
      }
    }

    // STEP 5: IMÁGENES
    else if (currentStep === 5) {
      fields = ['images'];
      console.log('✅ Step 5: Campos de imágenes');
    }

    setVisibleFields(fields || []);
    setLoadingFields(false);
  }, [mainCategory, subCategory, articleType, currentStep, categoryInfo]);

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

  // 🎨 RENDERIZAR CONTENIDO DEL STEP
  const renderStepContent = () => {
    // STEP 1: Información de categoría
    if (currentStep === 1) {
      return (
        <div className="step-content">
          <div className={`alert ${isEdit ? 'alert-warning' : 'alert-success'}`}>
            <h5>
              <i className={`fas ${isEdit ? 'fa-edit' : 'fa-check-circle'} me-2`}></i>
              {isEdit ? 'Modification de catégorie' : 'Catégorie sélectionnée'}
            </h5>

            <div className="category-details mt-3">
              <div className="row">
                <div className="col-12">
                  <div className="d-flex align-items-center mb-3">
                    <div className="category-icon me-3" style={{ fontSize: '2.5rem' }}>
                      {getCategoryEmoji(mainCategory)}
                    </div>
                    <div>
                      <h6 className="mb-1 fw-bold">{categoryInfo.categoryName || getCategoryDisplayName(mainCategory)}</h6>
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
                              <span className="me-2">{getEmojiForType(articleType)}</span>
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
                              <span className="me-2">{getEmojiForSubCategory(subCategory)}</span>
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
                        <span className="path-emoji">{getCategoryEmoji(mainCategory)}</span>
                        <span className="path-name">{categoryInfo.categoryName}</span>
                      </span>

                      {categoryInfo.articleTypeName && (
                        <>
                          <span className="path-arrow mx-2">
                            <i className="fas fa-arrow-right text-muted"></i>
                          </span>
                          <span className="path-step">
                            <span className="path-emoji">{getEmojiForType(articleType)}</span>
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
                            <span className="path-emoji">{getEmojiForSubCategory(subCategory)}</span>
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

  // 🎯 FUNCIONES HELPER
  const getCategoryEmoji = (category) => {
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
    return emojis[category] || '📁';
  };

  const getCategoryDisplayName = (category) => {
    const names = {
      'immobilier': 'Immobilier',
      'vehicules': 'Véhicules',
      'telephones': 'Téléphones',
      'informatique': 'Informatique',
      'electromenager': 'Électroménager',
      'piecesDetachees': 'Pièces Détachées',
      'vetements': 'Vêtements & Mode',
      'alimentaires': 'Alimentaires',
      'santebeaute': 'Santé & Beauté',
      'meubles': 'Meubles',
      'services': 'Services',
      'materiaux': 'Matériaux',
      'loisirs': 'Loisirs',
      'emploi': 'Emploi',
      'sport': 'Sport',
      'voyages': 'Voyages',
      'boutiques': 'Boutiques'
    };
    return names[category] || category;
  };

  const formatDisplayName = (id) => {
    if (!id) return '';
    return id
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getEmojiForType = (typeId) => {
    // Emojis comunes para articleTypes
    const emojis = {
      'cameras_accessories': '📹',
      'audio': '🔊',
      'machines_laver': '🧺',
      'refrigerateurs_congelateurs': '❄️',
      'televiseurs': '📺',
      'fours_cuisson': '🔥',
      'chauffage_climatisation': '🌡️',
      'appareils_cuisine': '🍳'
    };
    return emojis[typeId] || '📋';
  };

  const getEmojiForSubCategory = (subCatId) => {
    // Emojis comunes para subCategories
    const emojis = {
      'appareils_photo': '📷',
      'cameras_video': '🎥',
      'ecouteurs_baffles': '🎧',
      'home_cinema': '🎬',
      'lave_linge': '👚',
      'seche_linge': '🌞',
      'refrigerateur': '🧊',
      'congelateur': '❄️'
    };
    return emojis[subCatId] || '📦';
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
                    {getCategoryEmoji(mainCategory)} {categoryInfo.categoryName}
                  </span>

                  {categoryInfo.articleTypeName && (
                    <>
                      <i className="fas fa-chevron-right text-muted mx-1 mb-1"></i>
                      <span className="category-badge me-2 mb-1">
                        {getEmojiForType(articleType)} {categoryInfo.articleTypeName}
                      </span>
                    </>
                  )}

                  {categoryInfo.subCategoryName && (
                    <>
                      <i className="fas fa-chevron-right text-muted mx-1 mb-1"></i>
                      <span className="category-badge mb-1">
                        {getEmojiForSubCategory(subCategory)} {categoryInfo.subCategoryName}
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