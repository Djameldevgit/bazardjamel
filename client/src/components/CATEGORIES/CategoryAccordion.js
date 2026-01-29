// 📂 components/CATEGORIES/CategoryAccordion.js
import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Accordion, Form, Badge, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ChevronDown, ChevronUp, CheckCircle, ArrowRightCircle } from 'react-bootstrap-icons';

const CategoryAccordion = ({ postData, handleChangeInput, onComplete }) => {
  const { t } = useTranslation(['categories', 'subcategories']);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMainCategory, setActiveMainCategory] = useState(null);
  const [expandedSubcategories, setExpandedSubcategories] = useState({});
  const [isMobile, setIsMobile] = useState(false);

  const [selectedItems, setSelectedItems] = useState({
    category: null,
    level1: null,
    level2: null
  });

  // 🔄 OBTENER CATEGORÍAS DESDE MONGODB
  const { categories = [], loading, error } = useSelector((state) => ({
    categories: state.category?.categories || [],
    loading: state.category?.loading || false,
    error: state.category?.error || null
  }));

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 🎯 TRANSFORMAR DATOS MONGODB A ESTRUCTURA QUE TU ACCORDION ESPERA
  const { mainCategories, categoryHierarchy } = useMemo(() => {
    const mainCats = [];
    const hierarchy = {};

    categories.forEach(cat => {
      if (cat.level === 1) {
        mainCats.push({
          id: cat.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          name: cat.name,
          emoji: cat.emoji || '🏷️'
        });

        hierarchy[cat.name.toLowerCase().replace(/[^a-z0-9]/g, '_')] = {
          levels: 2,
          level1: 'categorie',
          requiresLevel2: cat.children?.some(child => child.children?.length > 0) || false,
          categories: cat.children?.map(child => ({
            id: child.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
            name: child.name,
            emoji: child.emoji || '📁',
            hasSublevel: child.children?.length > 0
          })) || [],
          subcategories: {}
        };

        cat.children?.forEach(child => {
          if (child.children?.length > 0) {
            const catId = cat.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
            const childId = child.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
            
            hierarchy[catId].subcategories[childId] = child.children.map(grandChild => ({
              id: grandChild.name.toLowerCase().replace(/[^a-z0-9]/g, '_'),
              name: grandChild.name,
              emoji: grandChild.emoji || '📄'
            }));
          }
        });
      }
    });

    return { mainCategories: mainCats, categoryHierarchy: hierarchy };
  }, [categories]);

  // 🎯 FUNCIÓN PARA OBTENER ITEMS (compatible con tu accordion original)
  const getCategoryItems = (categoryId) => {
    const category = categoryHierarchy[categoryId];
    return category?.categories || [];
  };

  // 🎯 INICIALIZAR CON POSTDATA
  useEffect(() => {
    if (postData && postData.categorie && mainCategories.length > 0) {
      const categoryId = postData.categorie.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const subCategoryId = postData.subCategory?.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const articleTypeId = postData.articleType?.toLowerCase().replace(/[^a-z0-9]/g, '_');
      
      setSelectedItems({
        category: categoryId,
        level1: subCategoryId || null,
        level2: articleTypeId || null
      });
      
      setActiveMainCategory(categoryId);
      
      if (subCategoryId) {
        const category = categoryHierarchy[categoryId];
        const item = category?.categories?.find(cat => cat.id === subCategoryId);
        
        if (item?.hasSublevel) {
          setExpandedSubcategories({
            [`${categoryId}-${subCategoryId}`]: true
          });
        }
      }
    }
  }, [postData, mainCategories, categoryHierarchy]);

  // 🎯 HANDLERS (iguales a tu accordion original)
  const handleMainCategoryToggle = (categoryId) => {
    if (activeMainCategory === categoryId) {
      setActiveMainCategory(null);
      if (selectedItems.category === categoryId) {
        handleResetSelection();
      }
    } else {
      setActiveMainCategory(categoryId);
      if (selectedItems.category && selectedItems.category !== categoryId) {
        handleResetSelection();
      }
    }
  };

  const handleSubcategoryClick = (categoryId, level1Id, level1Item) => {
    const category = categoryHierarchy[categoryId];
    if (!category) return;

    const newSelected = {
      category: categoryId,
      level1: level1Id,
      level2: null
    };
    setSelectedItems(newSelected);

    if (!level1Item.hasSublevel) {
      handleChangeInput({ target: { name: 'categorie', value: categoryId } });
      handleChangeInput({ target: { name: 'subCategory', value: level1Id } });
      handleChangeInput({ target: { name: 'articleType', value: level1Id } });

      setTimeout(() => onComplete && onComplete(), 150);
      return;
    } else {
      const key = `${categoryId}-${level1Id}`;
      if (expandedSubcategories[key]) {
        setExpandedSubcategories(prev => ({ ...prev, [key]: false }));
      } else {
        const newExpanded = Object.keys(expandedSubcategories).reduce((acc, curr) => {
          acc[curr] = false;
          return acc;
        }, {});
        newExpanded[key] = true;
        setExpandedSubcategories(newExpanded);
      }

      handleChangeInput({ target: { name: 'articleType', value: level1Id } });
    }
  };

  const handleLevel2Select = (categoryId, level1Id, level2Id) => {
    const category = categoryHierarchy[categoryId];
    if (!category || !level1Id || !level2Id) return;

    setSelectedItems({
      category: categoryId,
      level1: level1Id,
      level2: level2Id
    });

    handleChangeInput({ target: { name: 'categorie', value: categoryId } });
    handleChangeInput({ target: { name: 'subCategory', value: level2Id } });
    handleChangeInput({ target: { name: 'articleType', value: level2Id } });

    setTimeout(() => onComplete && onComplete(), 150);
  };

  const handleResetSelection = () => {
    setSelectedItems({
      category: null,
      level1: null,
      level2: null
    });
    setExpandedSubcategories({});

    handleChangeInput({ target: { name: 'categorie', value: '' } });
    handleChangeInput({ target: { name: 'subCategory', value: '' } });
    handleChangeInput({ target: { name: 'articleType', value: '' } });
  };

  // 🎨 RENDERIZAR CONTENIDO
  const renderCategoryContent = (categoryId) => {
    const category = categoryHierarchy[categoryId];
    if (!category) return null;

    const items = getCategoryItems(categoryId);

    if (items.length === 0) {
      return (
        <div className="no-items-message p-3 text-center">
          <p className="text-muted mb-0">Aucune option disponible</p>
        </div>
      );
    }

    return (
      <div className="category-content p-2">
        <div className="subcategories-list">
          {items.map((item) => {
            const isSelected = selectedItems.category === categoryId &&
              selectedItems.level1 === item.id;
            const hasSublevel = item.hasSublevel || category.requiresLevel2;
            const isExpanded = expandedSubcategories[`${categoryId}-${item.id}`];

            return (
              <div key={item.id} className="subcategory-wrapper mb-2">
                {/* NIVEL 1 */}
                <div
                  className={`subcategory-item p-3 rounded ${isSelected ? 'selected' : ''} ${hasSublevel ? 'has-sublevel' : ''}`}
                  style={{
                    border: isSelected ? '2px solid #10B981' : '1px solid #e2e8f0',
                    backgroundColor: isSelected ? '#f0fdf4' : 'white',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    position: 'relative'
                  }}
                  onClick={() => handleSubcategoryClick(categoryId, item.id, item)}
                >
                  <div className="subcategory-content d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center" style={{ flex: 1 }}>
                      <div className="subcategory-icon me-3 position-relative">
                        <span className="item-emoji" style={{ fontSize: '24px' }}>{item.emoji}</span>
                        
                        {/* PUNTO VERDE ESTILIZADO PARA SUBNIVELES */}
                        {hasSublevel && (
                          <div className="sublevel-indicator" style={{
                            position: 'absolute',
                            top: '-5px',
                            right: '-5px',
                            width: '18px',
                            height: '18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <div className="animated-dot" style={{
                              width: '12px',
                              height: '12px',
                              backgroundColor: '#10B981',
                              borderRadius: '50%',
                              position: 'relative',
                              animation: 'pulse 2s infinite'
                            }}>
                              <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '6px',
                                height: '6px',
                                backgroundColor: '#34D399',
                                borderRadius: '50%'
                              }}></div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="subcategory-info" style={{ flex: 1 }}>
                        <div className="subcategory-name fw-medium" style={{
                          color: isSelected ? '#065f46' : '#1e293b',
                          fontSize: isMobile ? '14px' : '15px'
                        }}>
                          {item.name}
                        </div>
                        {isSelected && !hasSublevel && (
                          <div className="selection-hint mt-1">
                            <small className="text-success d-flex align-items-center">
                              <CheckCircle size={12} className="me-1" />
                              Prêt pour l'étape 2
                            </small>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="subcategory-actions d-flex align-items-center">
                      {hasSublevel ? (
                        <span className={`chevron ${isExpanded ? 'expanded' : ''} ms-2`}>
                          {isExpanded ? <ChevronUp /> : <ChevronDown />}
                        </span>
                      ) : (
                        <ChevronRight className="text-muted" />
                      )}
                    </div>
                  </div>
                </div>

                {/* NIVEL 2 */}
                {hasSublevel && isExpanded && (
                  <div className="level2-container mt-2 ms-4" style={{
                    borderLeft: '2px solid #e2e8f0',
                    paddingLeft: '16px'
                  }}>
                    <div className="level2-content bg-light rounded p-3">
                      <div className="level2-header mb-3">
                        <h6 className="level2-title mb-0" style={{
                          fontSize: '14px',
                          color: '#64748b'
                        }}>
                          Sélectionnez une option pour <strong style={{ color: '#1e293b' }}>{item.name}</strong>
                        </h6>
                      </div>

                      {(() => {
                        const level2Items = category.subcategories?.[item.id] || [];

                        if (level2Items.length === 0) {
                          return (
                            <div className="no-level2-message text-center py-2">
                              <p className="text-muted small mb-0">Aucune option disponible</p>
                            </div>
                          );
                        }

                        return (
                          <div className="level2-items">
                            {level2Items.map((level2Item) => (
                              <div
                                key={level2Item.id}
                                className={`level2-item p-3 rounded mb-2 ${selectedItems.level2 === level2Item.id ? 'selected' : ''}`}
                                style={{
                                  border: selectedItems.level2 === level2Item.id ? 
                                    '2px solid #3B82F6' : '1px solid #e2e8f0',
                                  backgroundColor: selectedItems.level2 === level2Item.id ? 
                                    '#EFF6FF' : 'white',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s'
                                }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLevel2Select(categoryId, item.id, level2Item.id);
                                }}
                              >
                                <div className="level2-item-content d-flex align-items-center">
                                  <span className="level2-emoji me-3" style={{ fontSize: '20px' }}>
                                    {level2Item.emoji}
                                  </span>
                                  <span className="level2-name" style={{
                                    color: selectedItems.level2 === level2Item.id ? 
                                      '#1e40af' : '#1e293b',
                                    fontSize: isMobile ? '14px' : '15px',
                                    flex: 1
                                  }}>
                                    {level2Item.name}
                                  </span>
                                  {selectedItems.level2 === level2Item.id && (
                                    <CheckCircle className="text-success" size={18} />
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

  // ⏳ ESTADOS DE CARGA
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-container" style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '300px'
        }}>
          <Spinner animation="border" variant="primary" />
          <p className="mt-3" style={{ color: '#64748b' }}>Chargement des catégories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        <div className="d-flex align-items-center">
          <i className="fas fa-exclamation-triangle me-2"></i>
          <div>
            <strong>Erreur:</strong> {error}
          </div>
        </div>
      </Alert>
    );
  }

  if (mainCategories.length === 0) {
    return (
      <Card className="text-center py-5 m-3">
        <div className="text-muted">
          <div className="empty-icon mb-3" style={{ fontSize: '48px', opacity: 0.5 }}>
            📦
          </div>
          <h5 className="mb-2">Aucune catégorie disponible</h5>
          <p className="mb-3">Vérifiez que le seed MongoDB a été exécuté</p>
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => window.location.reload()}
            className="d-inline-flex align-items-center"
          >
            <i className="fas fa-redo me-2"></i>
            Recharger la page
          </Button>
        </div>
      </Card>
    );
  }

  // 🔍 FILTRAR CATEGORÍAS
  const filteredCategories = mainCategories.filter(cat =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cat.emoji.includes(searchTerm)
  );

  return (
    <div className="category-accordion" style={{
      width: '100%',
      background: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {/* Barra de búsqueda */}
      <div className="search-bar" style={{
        padding: isMobile ? '16px 16px 12px' : '20px 20px 16px',
        borderBottom: '1px solid #f1f5f9'
      }}>
        <div className="search-input-wrapper position-relative">
          <div className="search-icon" style={{
            position: 'absolute',
            left: '16px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#94a3b8'
          }}>
            🔍
          </div>
          <Form.Control
            type="text"
            placeholder="Rechercher une catégorie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: isMobile ? '12px 12px 12px 44px' : '14px 14px 14px 48px',
              border: '2px solid #e2e8f0',
              borderRadius: '10px',
              fontSize: isMobile ? '14px' : '16px',
              transition: 'all 0.2s',
              backgroundColor: '#f8fafc'
            }}
            className="search-input"
          />
        </div>
        
        {searchTerm && (
          <div className="category-count mt-2 d-flex justify-content-between">
            <span className="text-muted" style={{ fontSize: '13px' }}>
              {filteredCategories.length} résultat{filteredCategories.length !== 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setSearchTerm('')}
              className="btn btn-sm btn-link p-0"
              style={{ fontSize: '13px', textDecoration: 'none' }}
            >
              Effacer
            </button>
          </div>
        )}
      </div>

      {/* Contador de categorías */}
      {!searchTerm && (
        <div className="category-count px-4 py-2" style={{
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #f1f5f9'
        }}>
          <div className="d-flex align-items-center justify-content-between">
            <span className="text-muted" style={{ fontSize: '14px' }}>
              <strong>{mainCategories.length}</strong> catégories disponibles
            </span>
            {selectedItems.category && (
              <Badge bg="success" className="d-flex align-items-center" style={{
                fontSize: '12px',
                padding: '4px 8px',
                borderRadius: '20px'
              }}>
                <CheckCircle size={10} className="me-1" />
                Sélectionné
              </Badge>
            )}
          </div>
        </div>
      )}

      {/* Lista de categorías */}
      <div className="categories-list" style={{
        padding: isMobile ? '0' : '0',
        maxHeight: '500px',
        overflowY: 'auto',
        scrollbarWidth: 'thin'
      }}>
        {filteredCategories.length === 0 ? (
          <div className="no-results py-5 text-center">
            <div className="empty-icon mb-3" style={{ fontSize: '48px', opacity: 0.3 }}>
              🔍
            </div>
            <h5 className="mb-2" style={{ color: '#64748b' }}>Aucun résultat</h5>
            <p className="text-muted" style={{ fontSize: '14px' }}>
              Aucune catégorie ne correspond à "{searchTerm}"
            </p>
          </div>
        ) : (
          <Accordion activeKey={activeMainCategory} flush>
            {filteredCategories.map((category) => {
              const categoryType = categoryHierarchy[category.id]?.requiresLevel2 ? 
                { text: 'Multi-niveaux', color: '#f59e0b' } : 
                { text: 'Simple', color: '#10B981' };

              return (
                <Accordion.Item
                  key={category.id}
                  eventKey={category.id}
                  style={{
                    border: 'none',
                    borderBottom: '1px solid #f1f5f9'
                  }}
                >
                  <Accordion.Header
                    onClick={() => handleMainCategoryToggle(category.id)}
                    style={{
                      padding: isMobile ? '16px' : '20px',
                      backgroundColor: selectedItems.category === category.id ? '#f0fdf4' : 'white'
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between w-100">
                      <div className="d-flex align-items-center">
                        <div className="category-emoji me-3" style={{ fontSize: '24px' }}>
                          {category.emoji}
                        </div>
                        <div>
                          <div className="category-name fw-medium" style={{
                            color: selectedItems.category === category.id ? '#065f46' : '#1e293b',
                            fontSize: isMobile ? '15px' : '16px'
                          }}>
                            {category.name}
                          </div>
                          <div className="category-type mt-1">
                            <span style={{
                              backgroundColor: categoryType.color + '20',
                              color: categoryType.color,
                              fontSize: '11px',
                              padding: '2px 8px',
                              borderRadius: '12px',
                              fontWeight: '500'
                            }}>
                              {categoryType.text}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="d-flex align-items-center">
                        {selectedItems.category === category.id && (
                          <div className="selected-indicator me-3">
                            <div style={{
                              width: '8px',
                              height: '8px',
                              backgroundColor: '#10B981',
                              borderRadius: '50%',
                              animation: 'pulse 2s infinite'
                            }}></div>
                          </div>
                        )}
                        <div className="expand-arrow" style={{
                          transform: activeMainCategory === category.id ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                          color: '#94a3b8'
                        }}>
                          <ChevronDown size={18} />
                        </div>
                      </div>
                    </div>
                  </Accordion.Header>
                  
                  <Accordion.Body style={{
                    padding: isMobile ? '16px' : '20px',
                    paddingTop: '8px',
                    backgroundColor: '#f8fafc'
                  }}>
                    {renderCategoryContent(category.id)}
                  </Accordion.Body>
                </Accordion.Item>
              );
            })}
          </Accordion>
        )}
      </div>

      {/* Panel de selección */}
      {selectedItems.category && (
        <div className="selection-panel" style={{
          padding: '20px',
          borderTop: '1px solid #f1f5f9',
          backgroundColor: '#ffffff'
        }}>
          <div className="selection-header mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h6 className="mb-0 fw-bold" style={{ color: '#1e293b' }}>
                <CheckCircle className="me-2" size={18} style={{ color: '#10B981' }} />
                Sélection en cours
              </h6>
              <Badge bg={selectedItems.level2 ? 'success' : selectedItems.level1 ? 'warning' : 'secondary'}
                className="px-3 py-1"
                style={{ borderRadius: '20px', fontSize: '12px' }}
              >
                {selectedItems.level2 ? 'Complet' : selectedItems.level1 ? 'En cours' : 'Début'}
              </Badge>
            </div>
            
            <div className="selection-path">
              <div className="d-flex align-items-center flex-wrap">
                {/* Nivel 1 */}
                <div className="path-step d-flex align-items-center me-3">
                  <div className="step-icon me-2" style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#10B981',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    {mainCategories.find(c => c.id === selectedItems.category)?.emoji || '📁'}
                  </div>
                  <div>
                    <div className="step-label" style={{ fontSize: '11px', color: '#64748b' }}>
                      Catégorie principale
                    </div>
                    <div className="step-value fw-medium" style={{ fontSize: '14px', color: '#1e293b' }}>
                      {mainCategories.find(c => c.id === selectedItems.category)?.name}
                    </div>
                  </div>
                </div>

                {/* Flecha */}
                {selectedItems.level1 && (
                  <>
                    <div className="path-arrow me-3" style={{ color: '#cbd5e1' }}>
                      <ChevronRight size={20} />
                    </div>

                    {/* Nivel 2 */}
                    <div className="path-step d-flex align-items-center me-3">
                      <div className="step-icon me-2" style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: selectedItems.level2 ? '#10B981' : '#3B82F6',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        {getCategoryItems(selectedItems.category)
                          .find(item => item.id === selectedItems.level1)?.emoji || '📂'}
                      </div>
                      <div>
                        <div className="step-label" style={{ fontSize: '11px', color: '#64748b' }}>
                          Sous-catégorie
                        </div>
                        <div className="step-value fw-medium" style={{ fontSize: '14px', color: '#1e293b' }}>
                          {getCategoryItems(selectedItems.category)
                            .find(item => item.id === selectedItems.level1)?.name}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Flecha */}
                {selectedItems.level2 && (
                  <>
                    <div className="path-arrow me-3" style={{ color: '#cbd5e1' }}>
                      <ChevronRight size={20} />
                    </div>

                    {/* Nivel 3 */}
                    <div className="path-step d-flex align-items-center">
                      <div className="step-icon me-2" style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#10B981',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        ✅
                      </div>
                      <div>
                        <div className="step-label" style={{ fontSize: '11px', color: '#64748b' }}>
                          Type d'article
                        </div>
                        <div className="step-value fw-medium" style={{ fontSize: '14px', color: '#1e293b' }}>
                          {categoryHierarchy[selectedItems.category]?.subcategories?.[selectedItems.level1]
                            ?.find(item => item.id === selectedItems.level2)?.name || selectedItems.level2}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleResetSelection}
            className="w-100 d-flex align-items-center justify-content-center"
            style={{
              border: '1px solid #fca5a5',
              color: '#dc2626',
              padding: '10px',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          >
            <i className="fas fa-times me-2"></i>
            Changer de catégorie
          </Button>
        </div>
      )}

      {/* Instrucciones */}
      {!selectedItems.category && (
        <div className="instructions py-3 text-center" style={{
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #f1f5f9',
          fontSize: '13px',
          color: '#64748b'
        }}>
          <div className="d-flex align-items-center justify-content-center">
            <div className="me-2">👆</div>
            <div>Sélectionnez une catégorie pour continuer</div>
          </div>
        </div>
      )}

      {/* Estilos CSS inline */}
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .subcategory-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .level2-item:hover {
          transform: translateX(4px);
        }

        .categories-list::-webkit-scrollbar {
          width: 6px;
        }

        .categories-list::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .categories-list::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .categories-list::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        .search-input:focus {
          outline: none;
          border-color: #10B981 !important;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
          background-color: white !important;
        }

        @media (max-width: 768px) {
          .category-accordion {
            border-radius: 0;
          }
          
          .selection-path {
            overflow-x: auto;
            padding-bottom: 8px;
          }
          
          .selection-path > div {
            min-width: max-content;
          }
        }

        @media (max-width: 480px) {
          .category-emoji {
            font-size: 20px !important;
          }
          
          .category-name {
            font-size: 14px !important;
          }
          
          .subcategory-item {
            padding: 12px !important;
          }
          
          .item-emoji {
            font-size: 20px !important;
          }
          
          .animated-dot {
            width: 10px !important;
            height: 10px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryAccordion;