// 📂 components/CATEGORIES/CategoryAccordion.js
import React, { useState, useEffect, useMemo } from 'react';
import { Accordion, Form, Badge, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ChevronDown, ChevronUp, CheckCircle, ArrowRightCircle } from 'react-bootstrap-icons';
import { useSelector, useDispatch } from 'react-redux';
import { getCategoriesForAccordion } from '../../redux/actions/categoryAction';

const CategoryAccordion = ({ postData = {}, handleChangeInput, onComplete }) => {
  const { t } = useTranslation(['categories', 'subcategories']);
  
  const dispatch = useDispatch();
  const { 
    accordionCategories = [],
    accordionLoading = false,
    accordionError = null 
  } = useSelector((state) => ({
    accordionCategories: state.category?.accordionCategories || [],
    accordionLoading: state.category?.accordionLoading || false,
    accordionError: state.category?.accordionError || null
  }));

  // Estados locales
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMainCategory, setActiveMainCategory] = useState(null);
  const [expandedSubcategories, setExpandedSubcategories] = useState({});
  const [selectedItems, setSelectedItems] = useState({
    category: null,
    level1: null,
    level2: null
  });
  const [isInitialized, setIsInitialized] = useState(false);

  // 🔄 DEBUG
  useEffect(() => {
    console.log('=== CATEGORYACCORDION DEBUG ===');
    console.log('📥 Props recibidos:', postData);
    console.log('🎯 selectedItems actual:', selectedItems);
  }, [postData, selectedItems]);

  // 🔄 CARGAR CATEGORÍAS
  useEffect(() => {
    if (accordionCategories.length === 0 && !accordionLoading) {
      dispatch(getCategoriesForAccordion());
    }
  }, [dispatch, accordionCategories.length, accordionLoading]);

  // 🎯 TRANSFORMACIÓN SIMPLIFICADA
  const categoryHierarchy = useMemo(() => {
    if (!accordionCategories || accordionCategories.length === 0) return {};

    const hierarchy = {};

    accordionCategories.forEach(mainCat => {
      const hasChildren = mainCat.children && mainCat.children.length > 0;
      const hasDeepChildren = hasChildren && mainCat.children.some(child => 
        child.children && child.children.length > 0
      );

      hierarchy[mainCat.slug] = {
        name: mainCat.name,
        emoji: mainCat.emoji || '📦',
        levels: hasDeepChildren ? 2 : 1,
        level1: 'type',
        requiresLevel2: hasDeepChildren,
        
        // Nivel 2
        subcategories: hasChildren ? mainCat.children.map(child => ({
          id: child.slug,
          name: child.name,
          emoji: child.emoji || '📄',
          hasSublevel: child.children && child.children.length > 0
        })) : [],
        
        // Nivel 3
        subcategories2: {},
        properties: {}
      };

      // Nivel 3
      if (hasDeepChildren) {
        const level3Map = {};
        mainCat.children.forEach(child => {
          if (child.children) {
            level3Map[child.slug] = child.children.map(grandChild => ({
              id: grandChild.slug,
              name: grandChild.name,
              emoji: grandChild.emoji || '📋'
            }));
          }
        });

        hierarchy[mainCat.slug].subcategories2 = level3Map;
        hierarchy[mainCat.slug].properties = level3Map;
      }
    });

    return hierarchy;
  }, [accordionCategories]);

  // 🎨 CATEGORÍAS PRINCIPALES
  const categories = useMemo(() => {
    if (!accordionCategories || accordionCategories.length === 0) return [];
    return accordionCategories.map(cat => ({
      id: cat.slug,
      name: cat.name,
      emoji: cat.emoji || '📦'
    }));
  }, [accordionCategories]);

  // 🎯 FUNCIONES PARA OBTENER ITEMS
  const getCategoryItems = (categoryId) => {
    const category = categoryHierarchy[categoryId];
    return category?.subcategories || [];
  };

  const getLevel2Items = (categoryId, level1Id) => {
    const category = categoryHierarchy[categoryId];
    return category?.subcategories2?.[level1Id] || category?.properties?.[level1Id] || [];
  };

  // 🔄 INICIALIZAR CON POSTDATA
  useEffect(() => {
    if (!isInitialized && !accordionLoading && categories.length > 0 && categoryHierarchy) {
      const { categorie, subCategory, articleType } = postData;
      
      if (categorie || subCategory) {
        // Buscar categoría principal
        let mainCategory = categories.find(cat => cat.id === categorie || cat.name === categorie);
        
        if (mainCategory) {
          setActiveMainCategory(mainCategory.id);
          
          const categoryData = categoryHierarchy[mainCategory.id];
          if (categoryData) {
            const level1Items = getCategoryItems(mainCategory.id);
            
            // Buscar subcategoría
            let level1Item = null;
            if (subCategory) {
              level1Item = level1Items.find(item => 
                item.id === subCategory || item.name === subCategory
              );
            }
            
            if (level1Item) {
              const newSelected = {
                category: mainCategory.id,
                level1: level1Item.id,
                level2: null
              };
              
              // Buscar artículo específico
              if (articleType && level1Item.hasSublevel) {
                const level2Items = getLevel2Items(mainCategory.id, level1Item.id);
                const level2Item = level2Items.find(item => 
                  item.id === articleType || item.name === articleType
                );
                
                if (level2Item) {
                  newSelected.level2 = level2Item.id;
                  setExpandedSubcategories({
                    [`${mainCategory.id}-${level1Item.id}`]: true
                  });
                }
              }
              
              setSelectedItems(newSelected);
            }
          }
        }
      }
      
      setIsInitialized(true);
    }
  }, [accordionLoading, categories, categoryHierarchy, postData, isInitialized]);

  // 🎯 HANDLERS ACTUALIZADOS PARA CONECTAR CON COMPONENTES
  const handleMainCategoryToggle = (categoryId) => {
    if (activeMainCategory === categoryId) {
      setActiveMainCategory(null);
    } else {
      setActiveMainCategory(categoryId);
    }
  };

  const handleSubcategoryClick = (categoryId, level1Id, level1Item) => {
    const category = categoryHierarchy[categoryId];
    if (!category) return;

    // Actualizar selección
    const newSelected = {
      category: categoryId,
      level1: level1Id,
      level2: null
    };
    setSelectedItems(newSelected);

    // 🎯 CRÍTICO: Para categorías SIN subniveles (2 niveles totales)
    if (!level1Item.hasSublevel) {
      console.log('✅ Selección de 2 niveles completada');
      console.log('🎯 Datos a enviar:', {
        categorie: categoryId,          // Ej: "vetements"
        subCategory: level1Id,         // Ej: "vetements-homme"
        articleType: level1Id          // Mismo que subCategory
      });
      
      // 🔄 CONEXIÓN CON COMPONENTES: Enviar datos para DynamicFieldManager
      handleChangeInput({ target: { name: 'categorie', value: categoryId } });
      handleChangeInput({ target: { name: 'subCategory', value: level1Id } });
      handleChangeInput({ target: { name: 'articleType', value: level1Id } });

      // Llamar a onComplete para avanzar al siguiente paso
      setTimeout(() => onComplete && onComplete(), 150);
      return;
    }

    // 🎯 Para categorías CON subniveles (3 niveles)
    const key = `${categoryId}-${level1Id}`;
    setExpandedSubcategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));

    // Solo actualizar articleType temporalmente
    handleChangeInput({ target: { name: 'articleType', value: level1Id } });
  };

  const handleLevel2Select = (categoryId, level1Id, level2Id) => {
    const category = categoryHierarchy[categoryId];
    if (!category || !level1Id || !level2Id) return;

    // Obtener nombres
    const level1Items = getCategoryItems(categoryId);
    const level1Item = level1Items.find(item => item.id === level1Id);
    const level1Name = level1Item?.name || level1Id;
    
    const level2Items = getLevel2Items(categoryId, level1Id);
    const level2Item = level2Items.find(item => item.id === level2Id);
    const level2Name = level2Item?.name || level2Id;

    console.log('✅ Selección de 3 niveles completada');
    console.log('🎯 Datos a enviar:', {
      categorie: categoryId,          // Ej: "vetements"
      subCategory: level2Name,        // Ej: "Hauts & Chemises" (NOMBRE del nivel 3)
      articleType: level2Id,          // Ej: "vetements-hauts-chemises-homme" (SLUG del nivel 3)
      level1Name: level1Name          // Para referencia
    });

    // Actualizar estado
    setSelectedItems({
      category: categoryId,
      level1: level1Id,
      level2: level2Id
    });

    // 🔄 CONEXIÓN CON COMPONENTES: Enviar datos CORRECTOS
    // DynamicFieldManager usa subCategory (NOMBRE) para cargar componentes
    handleChangeInput({ target: { name: 'categorie', value: categoryId } });
    handleChangeInput({ target: { name: 'subCategory', value: level2Name } }); // ← NOMBRE del nivel 3
    handleChangeInput({ target: { name: 'articleType', value: level2Id } });   // ← SLUG del nivel 3

    // Llamar a onComplete para avanzar
    setTimeout(() => onComplete && onComplete(), 150);
  };

  const handleResetSelection = () => {
    setSelectedItems({ category: null, level1: null, level2: null });
    setExpandedSubcategories({});
    setActiveMainCategory(null);

    handleChangeInput({ target: { name: 'categorie', value: '' } });
    handleChangeInput({ target: { name: 'subCategory', value: '' } });
    handleChangeInput({ target: { name: 'articleType', value: '' } });
  };

  // 🎨 RENDERIZAR CONTENIDO
  const renderCategoryContent = (categoryId) => {
    const category = categoryHierarchy[categoryId];
    if (!category) return <div className="text-center p-3 text-muted">Données non disponibles</div>;

    const items = getCategoryItems(categoryId);
    if (items.length === 0) return <div className="text-center p-3 text-muted">Aucune option disponible</div>;

    return (
      <div className="category-content">
        <div className="subcategories-list">
          {items.map((item) => {
            const isSelected = selectedItems.category === categoryId &&
              selectedItems.level1 === item.id;
            const hasSublevel = item.hasSublevel;
            const isExpanded = expandedSubcategories[`${categoryId}-${item.id}`];

            return (
              <div key={item.id} className="subcategory-wrapper">
                {/* NIVEL 2 */}
                <div
                  className={`subcategory-item ${isSelected ? 'selected' : ''} ${hasSublevel ? 'has-sublevel' : ''}`}
                  onClick={() => handleSubcategoryClick(categoryId, item.id, item)}
                >
                  <div className="subcategory-content">
                    <div className="subcategory-icon">
                      <span className="item-emoji">{item.emoji}</span>
                      {hasSublevel && (
                        <span className="sublevel-indicator">
                          <ArrowRightCircle size={14} />
                        </span>
                      )}
                    </div>

                    <div className="subcategory-info">
                      <div className="subcategory-name">{item.name}</div>
                      {isSelected && !hasSublevel && (
                        <div className="selection-hint">
                          <small className="text-success">
                            <CheckCircle size={12} className="me-1" />
                            Prêt pour l'étape 2
                          </small>
                        </div>
                      )}
                    </div>

                    <div className="subcategory-actions">
                      {hasSublevel ? (
                        <span className={`chevron ${isExpanded ? 'expanded' : ''}`}>
                          {isExpanded ? <ChevronUp /> : <ChevronDown />}
                        </span>
                      ) : (
                        <ChevronRight className="text-muted" />
                      )}
                    </div>
                  </div>

                  {hasSublevel && (
                    <div className="subcategory-badge">
                      <Badge bg="warning" className="badge-sm">
                        + options
                      </Badge>
                    </div>
                  )}
                </div>

                {/* NIVEL 3 */}
                {hasSublevel && isExpanded && (
                  <div className="level2-container">
                    <div className="level2-content">
                      <div className="level2-header">
                        <h6 className="level2-title">
                          Sélectionnez une option pour <strong>{item.name}</strong>
                        </h6>
                      </div>

                      {(() => {
                        const level2Items = getLevel2Items(categoryId, item.id);
                        if (level2Items.length === 0) {
                          return (
                            <div className="no-level2-message">
                              <p className="text-muted small">Aucune option disponible</p>
                            </div>
                          );
                        }

                        return (
                          <div className="level2-items">
                            {level2Items.map((level2Item) => (
                              <div
                                key={level2Item.id}
                                className={`level2-item ${selectedItems.level2 === level2Item.id ? 'selected' : ''}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLevel2Select(categoryId, item.id, level2Item.id);
                                }}
                              >
                                <div className="level2-item-content">
                                  <span className="level2-emoji">{level2Item.emoji}</span>
                                  <span className="level2-name">{level2Item.name}</span>
                                  {selectedItems.level2 === level2Item.id && (
                                    <CheckCircle className="text-success ms-auto" size={16} />
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 🎨 RENDERIZAR PANEL DE SELECCIÓN
  const renderSelectionPanel = () => {
    if (!selectedItems.category) return null;

    const category = categoryHierarchy[selectedItems.category];
    if (!category) return null;

    const items = getCategoryItems(selectedItems.category);
    const getLevel1Name = () => {
      const item = items.find(item => item.id === selectedItems.level1);
      return item?.name || '';
    };

    const getLevel2Name = () => {
      if (!selectedItems.level2) return '';
      const level2Items = getLevel2Items(selectedItems.category, selectedItems.level1);
      const item = level2Items.find(item => item.id === selectedItems.level2);
      return item?.name || '';
    };

    const categoryName = categories.find(c => c.id === selectedItems.category)?.name;

    return (
      <Card className="selection-panel mt-4">
        <Card.Header className="selection-header">
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <CheckCircle className="text-success me-2" size={18} />
              <strong>Sélection en cours</strong>
            </div>
            <Badge bg={selectedItems.level2 ? 'success' : selectedItems.level1 ? 'warning' : 'secondary'}>
              {selectedItems.level2 ? 'Complet' : selectedItems.level1 ? 'En cours' : 'Début'}
            </Badge>
          </div>
        </Card.Header>

        <Card.Body>
          <div className="selection-path">
            <div className="path-step active">
              <div className="step-icon">
                {categories.find(c => c.id === selectedItems.category)?.emoji}
              </div>
              <div className="step-info">
                <div className="step-label">Catégorie</div>
                <div className="step-value">{categoryName}</div>
              </div>
            </div>

            {selectedItems.level1 && (
              <>
                <div className="path-arrow">→</div>
                <div className={`path-step ${selectedItems.level2 ? 'active' : 'current'}`}>
                  <div className="step-icon">
                    {items.find(item => item.id === selectedItems.level1)?.emoji}
                  </div>
                  <div className="step-info">
                    <div className="step-label">
                      {category.levels === 1 ? 'Sous-catégorie' : 'Type'}
                    </div>
                    <div className="step-value">{getLevel1Name()}</div>
                  </div>
                </div>
              </>
            )}

            {selectedItems.level2 && (
              <>
                <div className="path-arrow">→</div>
                <div className="path-step active final">
                  <div className="step-icon">
                    {getLevel2Name() ? '✅' : '📋'}
                  </div>
                  <div className="step-info">
                    <div className="step-label">Sous-catégorie</div>
                    <div className="step-value">{getLevel2Name()}</div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="completion-status mt-3">
            {selectedItems.level2 ? (
              <div className="alert alert-success py-2 mb-0">
                <div className="d-flex align-items-center">
                  <CheckCircle className="me-2" size={20} />
                  <div>
                    <strong>Sélection complète!</strong>
                    <div className="small">Prêt pour l'étape 2</div>
                  </div>
                </div>
              </div>
            ) : selectedItems.level1 ? (
              <div className="alert alert-warning py-2 mb-0">
                <div className="d-flex align-items-center">
                  <ChevronDown className="me-2" />
                  <div>
                    <strong>Sélectionnez une option ci-dessus</strong>
                    <div className="small">Cliquez sur une option pour continuer</div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleResetSelection}
            className="w-100 mt-3"
          >
            <i className="fas fa-times me-2"></i>
            Changer de catégorie
          </Button>
        </Card.Body>
      </Card>
    );
  };

  // 🔍 FILTRAR CATEGORÍAS
  const filteredCategories = categories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.emoji.includes(searchTerm)
  );

  // 🆕 MOSTRAR ESTADOS DE CARGA
  if (accordionLoading && categories.length === 0) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Chargement des catégories...</p>
        <small className="text-muted">Depuis le backend</small>
      </div>
    );
  }

  if (accordionError) {
    return (
      <Alert variant="danger" className="border-0">
        <div className="d-flex align-items-start">
          <i className="fas fa-exclamation-triangle me-2 mt-1"></i>
          <div>
            <strong>Erreur de chargement</strong>
            <p className="mb-2">{accordionError}</p>
            <Button 
              size="sm" 
              variant="outline-primary"
              onClick={() => dispatch(getCategoriesForAccordion())}
            >
              <i className="fas fa-redo me-1"></i>
              Réessayer
            </Button>
          </div>
        </div>
      </Alert>
    );
  }

  if (categories.length === 0 && !accordionLoading) {
    return (
      <Card className="text-center py-4 border-0 shadow-sm">
        <div className="empty-icon mb-3">📭</div>
        <h5 className="mb-2">Aucune catégorie disponible</h5>
        <p className="text-muted mb-3">Les catégories n'ont pas pu être chargées</p>
        <div className="d-flex gap-2 justify-content-center">
          <Button 
            variant="primary"
            onClick={() => dispatch(getCategoriesForAccordion())}
          >
            <i className="fas fa-sync-alt me-1"></i> Charger les catégories
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="nested-category-accordion">
      {/* Barra de búsqueda */}
      <div className="search-container mb-4">
        <Form.Control
          type="text"
          placeholder="🔍 Rechercher une catégorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Contador de categorías */}
      <div className="category-count mb-3 text-muted small">
        <span className="badge bg-primary rounded-pill">{filteredCategories.length}</span> catégories sur {categories.length}
      </div>

      {/* Accordion principal */}
      <Accordion activeKey={activeMainCategory} className="main-accordion">
        {filteredCategories.map((category) => (
          <Accordion.Item
            key={category.id}
            eventKey={category.id}
            className="main-category-item"
          >
            <Accordion.Header
              onClick={() => handleMainCategoryToggle(category.id)}
              className="main-category-header"
            >
              <div className="main-category-content">
                <div className="category-main-info">
                  <span className="category-emoji">{category.emoji}</span>
                  <span className="category-name">{category.name}</span>
                </div>

                <div className="category-status">
                  {selectedItems.category === category.id && (
                    <Badge bg="success" className="selected-badge me-2">
                      <CheckCircle size={12} /> Sélectionné
                    </Badge>
                  )}
                  <span className="expand-icon">
                    {activeMainCategory === category.id ? <ChevronUp /> : <ChevronDown />}
                  </span>
                </div>
              </div>
            </Accordion.Header>

            <Accordion.Body className="main-category-body">
              {renderCategoryContent(category.id)}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      {/* Panel de selección */}
      {renderSelectionPanel()}

      <style jsx>{`
        .nested-category-accordion {
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
        }
        
        /* Barra de búsqueda */
        .search-container {
          position: relative;
        }
        
        .search-input {
          padding: 12px 15px 12px 45px;
          border-radius: 8px;
          border: 2px solid #e9ecef;
          font-size: 1rem;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='%236c757d' viewBox='0 0 16 16'%3E%3Cpath d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: 15px center;
          background-size: 20px;
          transition: all 0.2s ease;
        }
        
        .search-input:focus {
          border-color: #0d6efd;
          box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
          background-position: 15px center;
        }
        
        /* Accordion principal */
        .main-accordion {
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .main-category-item {
          border: none;
          border-bottom: 1px solid #e9ecef;
          border-radius: 0 !important;
        }
        
        .main-category-item:last-child {
          border-bottom: none;
        }
        
        .main-category-header {
          padding: 20px;
          background: white;
          transition: all 0.2s ease;
        }
        
        .main-category-header:hover {
          background: #f8f9fa;
        }
        
        .main-category-header .accordion-button {
          padding: 0;
          background: transparent;
          box-shadow: none !important;
          color: inherit;
        }
        
        .main-category-header .accordion-button:not(.collapsed) {
          background: transparent;
          color: inherit;
        }
        
        .main-category-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }
        
        .category-main-info {
          display: flex;
          align-items: center;
          gap: 15px;
          flex-grow: 1;
        }
        
        .category-emoji {
          font-size: 1.8rem;
          min-width: 40px;
        }
        
        .category-name {
          font-size: 1.1rem;
          font-weight: 600;
          color: #212529;
        }
        
        .category-type-badge .badge {
          font-size: 0.75rem;
          padding: 4px 8px;
          font-weight: 500;
        }
        
        .category-status {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .selected-badge {
          font-size: 0.8rem;
          padding: 4px 8px;
        }
        
        .expand-icon {
          color: #6c757d;
          transition: transform 0.3s ease;
        }
        
        .main-category-body {
          padding: 0;
          background: #f8f9fa;
          border-top: 1px solid #e9ecef;
        }
        
        /* Contenido de categoría */
        .category-content {
          padding: 20px;
        }
        
        .subcategories-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .subcategory-wrapper {
          background: white;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e9ecef;
          transition: all 0.2s ease;
        }
        
        .subcategory-wrapper:hover {
          border-color: #0d6efd;
          box-shadow: 0 2px 8px rgba(13, 110, 253, 0.1);
        }
        
        .subcategory-item {
          padding: 15px;
          cursor: pointer;
          position: relative;
          transition: all 0.2s ease;
        }
        
        .subcategory-item:hover {
          background: #f8f9fa;
        }
        
        .subcategory-item.selected {
          background: linear-gradient(135deg, rgba(13, 110, 253, 0.05), rgba(13, 110, 253, 0.1));
          border-left: 4px solid #0d6efd;
        }
        
        .subcategory-item.has-sublevel {
          border-left: 4px solid #ffc107;
        }
        
        .subcategory-content {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        
        .subcategory-icon {
          position: relative;
          min-width: 50px;
        }
        
        .item-emoji {
          font-size: 1.8rem;
        }
        
        .sublevel-indicator {
          position: absolute;
          top: -5px;
          right: -5px;
          background: #ffc107;
          color: white;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.7rem;
          border: 2px solid white;
        }
        
        .subcategory-info {
          flex-grow: 1;
        }
        
        .subcategory-name {
          font-weight: 500;
          font-size: 0.95rem;
          color: #212529;
        }
        
        .selection-hint {
          margin-top: 5px;
        }
        
        .subcategory-actions {
          color: #6c757d;
        }
        
        .chevron {
          transition: transform 0.3s ease;
        }
        
        .chevron.expanded {
          transform: rotate(180deg);
        }
        
        .subcategory-badge {
          position: absolute;
          top: 10px;
          right: 15px;
        }
        
        .badge-sm {
          font-size: 0.7rem;
          padding: 2px 6px;
        }
        
        /* Nivel 2 - Contenido expandido */
        .level2-container {
          background: #f1f3f4;
          border-top: 1px solid #dee2e6;
          animation: slideDown 0.3s ease;
        }
        
        .level2-content {
          padding: 20px;
        }
        
        .level2-header {
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px dashed #dee2e6;
        }
        
        .level2-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #495057;
          margin: 0;
        }
        
        .level2-items {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .level2-item {
          padding: 12px 15px;
          background: white;
          border-radius: 6px;
          border: 1px solid #e9ecef;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .level2-item:hover {
          border-color: #0d6efd;
          transform: translateX(5px);
        }
        
        .level2-item.selected {
          background: linear-gradient(135deg, rgba(25, 135, 84, 0.05), rgba(25, 135, 84, 0.1));
          border-color: #198754;
        }
        
        .level2-item-content {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .level2-emoji {
          font-size: 1.3rem;
          min-width: 30px;
        }
        
        .level2-name {
          font-size: 0.9rem;
          font-weight: 500;
          flex-grow: 1;
        }
        
        /* Panel de selección */
        .selection-panel {
          border: 2px solid #0d6efd;
          animation: fadeIn 0.5s ease;
        }
        
        .selection-header {
          background: linear-gradient(135deg, #0d6efd, #6610f2);
          color: white;
          border: none;
        }
        
        .selection-path {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .path-step {
          display: flex;
          align-items: center;
          padding: 10px 15px;
          background: white;
          border-radius: 6px;
          border: 1px solid #dee2e6;
          min-width: 180px;
        }
        
        .path-step.active {
          border-color: #0d6efd;
          background: #e3f2fd;
        }
        
        .path-step.current {
          border-color: #ffc107;
          background: #fff3cd;
        }
        
        .path-step.final {
          border-color: #198754;
          background: #d1e7dd;
        }
        
        .step-icon {
          font-size: 1.5rem;
          margin-right: 10px;
          min-width: 30px;
        }
        
        .step-label {
          font-size: 0.75rem;
          color: #6c757d;
          margin-bottom: 2px;
        }
        
        .step-value {
          font-size: 0.9rem;
          font-weight: 500;
          color: #212529;
        }
        
        .path-arrow {
          color: #6c757d;
          font-weight: bold;
        }
        
        /* Animaciones */
        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            max-height: 500px;
            transform: translateY(0);
          }
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
        
        /* Responsive */
        @media (max-width: 768px) {
          .main-category-content {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
          
          .category-main-info {
            width: 100%;
            justify-content: space-between;
          }
          
          .category-status {
            width: 100%;
            justify-content: space-between;
          }
          
          .selection-path {
            flex-direction: column;
            align-items: stretch;
          }
          
          .path-step {
            min-width: 100%;
          }
          
          .path-arrow {
            transform: rotate(90deg);
            align-self: center;
          }
          
          .subcategory-content {
            gap: 10px;
          }
          
          .item-emoji {
            font-size: 1.5rem;
          }
        }
        
        @media (max-width: 576px) {
          .main-category-header {
            padding: 15px;
          }
          
          .category-content {
            padding: 15px;
          }
          
          .subcategory-item {
            padding: 12px;
          }
          
          .level2-content {
            padding: 15px;
          }
          
          .category-emoji {
            font-size: 1.5rem;
            min-width: 35px;
          }
          
          .category-name {
            font-size: 1rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryAccordion;