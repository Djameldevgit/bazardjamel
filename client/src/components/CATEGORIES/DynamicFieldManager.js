// 📁 src/components/CATEGORIES/DynamicFieldManager.js
import React, { useEffect, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { getFieldsForCategory } from './FieldConfig';
import FieldRendererUniversal from './FiledRendererUniversal';
import { categoryHierarchy } from './index'; // Importar la jerarquía

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
  const [categoryInfo, setCategoryInfo] = useState({});
  const [loadingFields, setLoadingFields] = useState(false);

  // 🔍 OBTENER INFORMACIÓN DE LA CATEGORÍA DESDE LA JERARQUÍA
  useEffect(() => {
    if (mainCategory) {
      const hierarchy = categoryHierarchy[mainCategory];
      if (hierarchy) {
        let info = {
          levels: hierarchy.levels,
          level1: hierarchy.level1,
          level2: hierarchy.level2,
          name: mainCategory
        };

        console.log(`📊 Información de categoría ${mainCategory}:`, {
          levels: hierarchy.levels,
          level1: hierarchy.level1,
          requiresLevel2: hierarchy.requiresLevel2
        });

        // Para categorías de 2 niveles, obtener nombres específicos
        if (hierarchy.levels === 2) {
          console.log(`🔄 Procesando categoría de 2 niveles: ${mainCategory}`);
          console.log(`📌 articleType: ${articleType}, subCategory: ${subCategory}`);

          if (hierarchy.level1 === 'operation' && articleType) {
            const operation = hierarchy.operations?.find(op => op.id === articleType);
            info.level1Name = operation?.name || articleType;
            console.log(`✅ Nivel 1 (operation) encontrado: ${info.level1Name}`);
          } else if (articleType) {
            // Para vetements, electromenager, etc.
            const category = hierarchy.categories?.find(cat => cat.id === articleType);
            info.level1Name = category?.name || articleType;
            console.log(`✅ Nivel 1 (category) encontrado: ${info.level1Name}`);
          }

          if (subCategory) {
            let propertyName = '';
            if (hierarchy.level2 === 'property' && hierarchy.properties?.[articleType]) {
              const property = hierarchy.properties[articleType]?.find(p => p.id === subCategory);
              propertyName = property?.name || subCategory;
              console.log(`✅ Nivel 2 (property) encontrado: ${propertyName}`);
            } else if (hierarchy.subcategories?.[articleType]) {
              const subcat = hierarchy.subcategories[articleType]?.find(s => s.id === subCategory);
              propertyName = subcat?.name || subCategory;
              console.log(`✅ Nivel 2 (subcategory) encontrado: ${propertyName}`);
            }
            info.level2Name = propertyName;
          }
        } else if (hierarchy.levels === 1 && subCategory) {
          // Para categorías de 1 nivel (vehicules, telephones, etc.)
          const subcatItem = hierarchy.subcategories?.find(sc => sc.id === subCategory);
          info.level1Name = subcatItem?.name || subCategory;
          console.log(`✅ Categoría simple - Subcategoría: ${info.level1Name}`);
        }

        setCategoryInfo(info);
      } else {
        console.warn(`⚠️ No se encontró jerarquía para categoría: ${mainCategory}`);
      }
    }
  }, [mainCategory, subCategory, articleType]);

  // 🔥 OBTENER CAMPOS SEGÚN CATEGORÍA Y NIVELES
  useEffect(() => {
    console.log('🔄 DynamicFieldManager - Actualizando campos:', {
      mainCategory,
      subCategory,
      articleType,
      currentStep,
      categoryInfo,
      isEdit
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
        const hierarchy = categoryHierarchy[mainCategory];

        // 🔍 DETERMINAR QUÉ COMPONENTE CARGAR BASADO EN LA JERARQUÍA
        let componentToLoad = null;

        if (hierarchy) {
          if (hierarchy.levels === 1) {
            // 📌 CATEGORÍAS DE 1 NIVEL (vehicules, telephones, etc.)
            componentToLoad = getComponentForSimpleCategory(mainCategory);
            console.log('📦 Categoría simple:', { mainCategory, componentToLoad });
          } else if (hierarchy.levels === 2) {
            // 📌 CATEGORÍAS DE 2 NIVELES (immobilier, electromenager, vetements, etc.)
            componentToLoad = getComponentForHierarchicalCategory(mainCategory, articleType, subCategory);
            console.log('🏗️ Categoría jerárquica:', {
              mainCategory,
              articleType,
              subCategory,
              componentToLoad
            });
          }
        } else {
          console.warn(`⚠️ No se encontró jerarquía para: ${mainCategory}`);
        }

        // 🎯 OBTENER CAMPOS ESPECÍFICOS
        if (componentToLoad || mainCategory) {
          // Pasar todos los parámetros necesarios
          fields = getFieldsForCategory(
            mainCategory,
            subCategory,
            currentStep,
            articleType // IMPORTANTE: Para categorías de 2 niveles
          );

          console.log(`📋 Campos obtenidos para ${mainCategory}:`, fields);
        } else {
          console.warn('⚠️ No se pudo determinar el componente para:', {
            mainCategory,
            articleType,
            subCategory
          });

          // Campos por defecto para evitar "Configuration en cours"
          fields = getDefaultFieldsForCategory(mainCategory, currentStep);
        }

        // 🔥 FILTRAR CAMPOS VÁLIDOS
        const validFields = fields.filter(field =>
          field &&
          typeof field === 'string' &&
          field.trim() !== '' &&
          !field.startsWith('!')
        );

        console.log(`✅ Step ${currentStep}: ${validFields.length} campos válidos para ${mainCategory}`);

        // 📌 MANEJO ESPECIAL PARA VETEMENTS
        if (mainCategory === 'vetements' && validFields.length === 0) {
          console.log('🔄 Vetements sin campos específicos, usando configuración por defecto');
          const defaultVetementsFields = getVetementsDefaultFields(currentStep, subCategory);
          setVisibleFields(defaultVetementsFields);
        } else {
          setVisibleFields(validFields);
        }

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

  }, [mainCategory, subCategory, articleType, currentStep, isEdit, categoryInfo]);

  // 🎯 FUNCIONES PARA DETERMINAR COMPONENTES (CORREGIDAS)
  const getComponentForSimpleCategory = (category) => {
    // VETEMENTS NO DEBE ESTAR AQUÍ porque es categoría de 2 niveles
    const componentMap = {
      'immobiliers': 'ImmobiliersFields',
      'vehicules': 'VehiculesFields',
      'piecesDetachees': 'PiecesDetacheesFields',
      'telephones': 'TelephonesFields',
      'informatiques': 'InformatiquesFields', // ← REMOVIDO DE AQUÍ
     
      'electromenagers': 'ElectromenagersFields', // ← REMOVIDO DE AQUÍ
      'vetements': 'VetementsFields', // ← REMOVIDO DE AQUÍ
      'santebeaute': 'SanteBeauteFields',
      'meubles': 'MeublesFields',
      'loisirs': 'LoisirsFields',
    
      'sport': 'SportFields',
      'alimentaires': 'AlimentairesFields',
      'services': 'ServicesFields',
      'materiaux': 'MateriauxFields',
      'voyages': 'VoyagesFields',
   
      'emploi': 'EmploiFields',
      'boutiques': 'BoutiquesFields'

    };
    return componentMap[category] || null;
  };

  const getComponentForHierarchicalCategory = (category, level1, level2) => {
    // VETEMENTS SÍ DEBE ESTAR AQUÍ porque es categoría de 2 niveles
    const componentMap = {
      'immobilier': 'ImmobiliersFields',
      'vehicules': 'VehiculesFields',
      'electromenager': 'ElectromenagerFields',
      'vetements': 'VetementsFields', // ← CORRECTO
      'informatique': 'InformatiqueFields',
      'piecesDetachees': 'PiecesDetacheesFields',
      'santebeaute': 'SanteBeauteFields',
      'meubles': 'MeublesFields',
      'materiaux': 'MateriauxFields',
      'alimentaires': 'AlimentairesFields',
      'services': 'ServicesFields',
      'sport': 'SportFields',
      'voyage': 'VoyagesFields',
      'boutiques': 'BoutiquesField',
    };
    return componentMap[category] || null;
  };

  // 🎯 CAMPOS POR DEFECTO PARA VETEMENTS
  const getVetementsDefaultFields = (step, subCategory) => {
    console.log(`🎯 Obteniendo campos por defecto para vetements step ${step}, sub: ${subCategory}`);

    const vetementsFields = {
      2: ['title', 'description', 'marque', 'etat', 'taille', 'couleur'],
      3: ['price', 'unite', 'livraison'],
      4: ['telephone', 'email', 'wilaya', 'echange']
    };

    // Campos específicos por tipo de subcategoría
    if (subCategory) {
      const isChaussures = subCategory.includes('chaussures');
      const isAccessoire = ['sacs_valises', 'montres', 'lunettes', 'bijoux'].includes(subCategory);

      if (isChaussures) {
        vetementsFields[2] = ['title', 'description', 'marque', 'etat', 'pointure', 'couleur'];
      } else if (isAccessoire) {
        vetementsFields[2] = ['title', 'description', 'marque', 'etat', 'couleur', 'materiau'];
      }
    }

    return vetementsFields[step] || [];
  };

  // 🎯 CAMPOS POR DEFECTO GENERALES
  const getDefaultFieldsForCategory = (category, step) => {
    const defaultFields = {
      2: ['title', 'description'],
      3: ['price'],
      4: ['telephone', 'wilaya']
    };
    return defaultFields[step] || [];
  };

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

            {/* 📊 INFORMACIÓN DETALLADA DE LA CATEGORÍA */}
            <div className="category-details mt-3">
              <div className="row">
                <div className="col-12">
                  <div className="d-flex align-items-center mb-3">
                    <div className="category-icon me-3" style={{ fontSize: '2.5rem' }}>
                      {getCategoryEmoji(mainCategory)}
                    </div>
                    <div>
                      <h6 className="mb-1 fw-bold">{getCategoryDisplayName(mainCategory)}</h6>
                      <small className="text-muted">
                        {categoryInfo.levels === 1 ? 'Catégorie simple' :
                          categoryInfo.levels === 2 ? 'Catégorie avec sous-catégories' :
                            'Catégorie'}
                      </small>
                    </div>
                  </div>
                </div>

                {/* PARA CATEGORÍAS DE 2 NIVELES */}
                {categoryInfo.levels === 2 && (
                  <>
                    {categoryInfo.level1Name && (
                      <div className="col-md-6 mb-2">
                        <div className="card border-0 bg-light">
                          <div className="card-body py-2">
                            <small className="text-muted d-block">
                              {categoryInfo.level1 === 'operation' ? 'Opération' :
                                mainCategory === 'vetements' ? 'Type' : 'Catégorie'}
                            </small>
                            <div className="fw-medium">{categoryInfo.level1Name}</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {categoryInfo.level2Name && (
                      <div className="col-md-6 mb-2">
                        <div className="card border-0 bg-light">
                          <div className="card-body py-2">
                            <small className="text-muted d-block">
                              {categoryInfo.level2 === 'property' ? 'Type de bien' :
                                mainCategory === 'vetements' ? 'Article' : 'Sous-catégorie'}
                            </small>
                            <div className="fw-medium">{categoryInfo.level2Name}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* PARA CATEGORÍAS DE 1 NIVEL */}
                {categoryInfo.levels === 1 && subCategory && (
                  <div className="col-12">
                    <div className="card border-0 bg-light">
                      <div className="card-body py-2">
                        <small className="text-muted d-block">Sous-catégorie</small>
                        <div className="fw-medium">
                          {categoryHierarchy[mainCategory]?.subcategories?.find(
                            sc => sc.id === subCategory
                          )?.name || subCategory}
                        </div>
                      </div>
                    </div>
                  </div>
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
            {/* Componente de imágenes aquí */}
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
                <p className="small mb-0">Configuration pour {getCategoryDisplayName(mainCategory)}</p>
              </div>
            </div>
          </div>
        ) : renderedFields.length === 0 ? (
          <div className="alert alert-warning mb-0">
            <h5><i className="fas fa-exclamation-triangle me-2"></i> Configuration en cours</h5>
            <p className="mb-2">
              {!mainCategory
                ? 'Sélectionnez d\'abord une catégorie à l\'étape 1'
                : `Aucun champ configuré pour ${getCategoryDisplayName(mainCategory)}`
              }
            </p>
            {mainCategory === 'vetements' && (
              <div className="mt-2">
                <small className="text-muted">
                  <i className="fas fa-info-circle me-1"></i>
                  Pour résoudre ce problème, vérifiez la configuration dans FieldConfig.js
                </small>
              </div>
            )}
          </div>
        ) : (
          <div className="row g-3">
            {/* INFO BAR PARA CATEGORÍAS JERÁRQUICAS */}
            {(categoryInfo.levels === 2 || mainCategory === 'vetements') && renderedFields.length > 0 && (
              <div className="col-12">
                <div className="category-path-card mb-3">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center flex-wrap">
                      <span className="path-step">
                        <span className="path-emoji">{getCategoryEmoji(mainCategory)}</span>
                        <span className="path-name">{getCategoryDisplayName(mainCategory)}</span>
                      </span>

                      {categoryInfo.level1Name && (
                        <>
                          <span className="path-arrow mx-2">
                            <i className="fas fa-arrow-right text-muted"></i>
                          </span>
                          <span className="path-step">
                            <span className="path-name">{categoryInfo.level1Name}</span>
                          </span>
                        </>
                      )}

                      {categoryInfo.level2Name && (
                        <>
                          <span className="path-arrow mx-2">
                            <i className="fas fa-arrow-right text-muted"></i>
                          </span>
                          <span className="path-step">
                            <span className="path-name">{categoryInfo.level2Name}</span>
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
                      {renderedFields.length} champ(s) configuré(s) •
                      {mainCategory === 'vetements' && ' 👕 Vêtements & Mode'}
                    </small>
                  </div>
                </div>
              </div>
            )}

            {/* CAMPOS RENDERIZADOS */}
            {renderedFields}

            {/* COMPONENTE ESPECÍFICO VETEMENTS */}
            {mainCategory === 'vetements' && renderedFields.length > 0 && (
              <div className="col-12">
                <div className="alert alert-light border">
                  <h6 className="mb-2">
                    <i className="fas fa-tshirt me-2"></i>
                    Champs spécifiques aux vêtements
                  </h6>
                  <p className="small mb-0 text-muted">
                    Les champs comme taille, pointure, couleur seront affichés ici
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // 🎯 FUNCIONES HELPER (mantener igual)
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
      'boutiques': '✈️'
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

  // 📏 CALCULAR ALTURA MÍNIMA
  const getMinHeight = () => {
    if (currentStep === 1 || currentStep === 5) return 'auto';
    if (renderedFields.length === 0) return '150px';

    const baseHeight = 80;
    const perFieldHeight = renderedFields.length <= 2 ? 120 : 90;
    return `${baseHeight + (renderedFields.length * perFieldHeight)}px`;
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
                    {getCategoryEmoji(mainCategory)} {getCategoryDisplayName(mainCategory)}
                  </span>

                  {categoryInfo.levels === 2 && categoryInfo.level1Name && (
                    <>
                      <i className="fas fa-chevron-right text-muted mx-1 mb-1"></i>
                      <span className="category-badge me-2 mb-1">{categoryInfo.level1Name}</span>
                    </>
                  )}

                  {subCategory && categoryInfo.level2Name && (
                    <>
                      <i className="fas fa-chevron-right text-muted mx-1 mb-1"></i>
                      <span className="category-badge mb-1">{categoryInfo.level2Name}</span>
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
        minHeight: getMinHeight(),
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
                } else {
                  console.log('📤 Publicar/Actualizar anuncio');
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
                  {isEdit ? 'Mettre à jour' : 'Publier'}
                  <i className="fas fa-paper-plane ms-2"></i>
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

      {/* ESTILOS MEJORADOS */}
      <style jsx>{`
        .dynamic-field-manager {
          background: white;
          padding: 25px;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          min-height: ${renderedFields.length === 0 && currentStep > 1 ? '250px' : 'auto'};
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
        
        .category-details .card {
          transition: all 0.2s ease;
        }
        
        .category-details .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 3px 8px rgba(0,0,0,0.1);
        }
        
        .field-wrapper {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border: 1px solid #dee2e6;
          margin-bottom: 15px;
          transition: all 0.2s ease;
          min-height: ${renderedFields.length <= 2 ? '120px' : '90px'};
          height: 100%;
        }
        
        .field-wrapper:hover {
          border-color: #0d6efd;
          box-shadow: 0 2px 5px rgba(13, 110, 253, 0.1);
          background: #fff;
        }
        
        .progress {
          background: #e9ecef;
        }
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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
          
          .path-emoji {
            font-size: 1rem;
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