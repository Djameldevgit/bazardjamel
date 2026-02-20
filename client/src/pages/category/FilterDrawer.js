// 📂 pages/FilterDrawer.js - VERSIÓN COMPLETA CORREGIDA
import React, { useState, useEffect, useCallback } from 'react';
import { Offcanvas, Form, Button, Accordion, Spinner } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { 
  Funnel, 
  XLg, 
  ArrowCounterclockwise,
  Check2,
  GeoAlt,
  CurrencyEuro,
  SortDown
} from 'react-bootstrap-icons';
import Select from 'react-select';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { getCategoryPosts } from '../../redux/actions/categoryAction';

const FilterDrawer = ({ 
  show, 
  onHide, 
  onApplyFilters 
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { slug, subSlug, articleSlug } = useParams();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Estados con valores por defecto seguros
  const [categoryChildren, setCategoryChildren] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(false);
  
  // Inicializar con estructura completa
  const [filterMetadata, setFilterMetadata] = useState({
    wilayas: [],
    priceRange: { min: 0, max: 1000000 },
    appliedFilters: {}
  });
  
  // Obtener datos de Redux
  const categoryState = useSelector((state) => state.category || {});
  const { children = [] } = categoryState;

  // ============ CARGAR HIJOS ============
  useEffect(() => {
    if (!show || !slug) return;
    
    const loadData = async () => {
      setLoadingChildren(true);
      try {
        console.log('🔄 Cargando datos para drawer:', slug);
        
        const result = await dispatch(getCategoryPosts(slug, subSlug, articleSlug, 1, 1));
        
        if (result && result.children) {
          setCategoryChildren(result.children);
        }
        
        // Asegurar que filterMetadata tenga la estructura correcta
        if (result && result.filterMetadata) {
          setFilterMetadata({
            wilayas: result.filterMetadata.wilayas || [],
            priceRange: {
              min: result.filterMetadata.priceRange?.min || 0,
              max: result.filterMetadata.priceRange?.max || 1000000
            },
            appliedFilters: result.filterMetadata.appliedFilters || {}
          });
        }
        
      } catch (error) {
        console.error('❌ Error cargando datos:', error);
      } finally {
        setLoadingChildren(false);
      }
    };
    
    loadData();
  }, [show, slug, subSlug, articleSlug, dispatch]);

  // Usar hijos de Redux si ya existen
  useEffect(() => {
    if (children && children.length > 0 && categoryChildren.length === 0) {
      setCategoryChildren(children);
    }
  }, [children]);

  // ============ ENCONTRAR IDs DESDE SLUGS ============
  const findIdsFromSlugs = useCallback(() => {
    let subId = '';
    let articleId = '';
    
    if (!categoryChildren || categoryChildren.length === 0) {
      return { subId, articleId };
    }
    
    if (subSlug) {
      const subCategory = categoryChildren.find(sub => sub.slug === subSlug);
      
      if (subCategory) {
        subId = subCategory._id;
        
        if (articleSlug && subCategory.articles) {
          const article = subCategory.articles.find(art => art.slug === articleSlug);
          if (article) {
            articleId = article._id;
          }
        }
      }
    }
    
    return { subId, articleId };
  }, [categoryChildren, subSlug, articleSlug]);

  // ============ INICIALIZAR FILTROS ============
  const getInitialFilters = () => {
    const { subId, articleId } = findIdsFromSlugs();
    
    // Acceso seguro a priceRange
    const min = filterMetadata?.priceRange?.min ?? 0;
    const max = filterMetadata?.priceRange?.max ?? 1000000;
    
    return {
      subCategory: subId || '',
      article: articleId || '',
      wilaya: '',
      commune: '',
      priceMin: min,
      priceMax: max,
      sortBy: 'recent'
    };
  };

  const [tempFilters, setTempFilters] = useState(getInitialFilters());
  
  // Inicializar priceRange de forma segura
  const [priceRange, setPriceRange] = useState([
    filterMetadata?.priceRange?.min ?? 0,
    filterMetadata?.priceRange?.max ?? 1000000
  ]);

  // Actualizar cuando cambia URL o metadata
  useEffect(() => {
    const newFilters = getInitialFilters();
    setTempFilters(newFilters);
    
    // Actualizar priceRange de forma segura
    setPriceRange([
      filterMetadata?.priceRange?.min ?? 0,
      filterMetadata?.priceRange?.max ?? 1000000
    ]);
  }, [subSlug, articleSlug, categoryChildren, filterMetadata]);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ============ HANDLERS ============
  const handleFilterChange = (key, value) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
    
    if (key === 'subCategory') {
      setTempFilters(prev => ({ ...prev, article: '' }));
    }
    
    if (key === 'wilaya') {
      setTempFilters(prev => ({ ...prev, commune: '' }));
    }
  };

  const handlePriceRangeChange = (values) => {
    setPriceRange(values);
    setTempFilters(prev => ({
      ...prev,
      priceMin: values[0],
      priceMax: values[1]
    }));
  };

  const applyFilters = () => {
    console.log('🎯 Aplicando filtros:', tempFilters);
    
    // ✅ Verificar que onApplyFilters existe
    if (onApplyFilters && typeof onApplyFilters === 'function') {
      onApplyFilters(tempFilters);
    } else {
      console.error('❌ onApplyFilters no está definida');
    }
    
    onHide(); // Cerrar el drawer
  };

  const resetFilters = () => {
    const { subId, articleId } = findIdsFromSlugs();
    
    // Valores seguros
    const min = filterMetadata?.priceRange?.min ?? 0;
    const max = filterMetadata?.priceRange?.max ?? 1000000;
    
    setTempFilters({
      subCategory: subId || '',
      article: articleId || '',
      wilaya: '',
      commune: '',
      priceMin: min,
      priceMax: max,
      sortBy: 'recent'
    });
    setPriceRange([min, max]);
  };

  const countActiveFilters = () => {
    const { subId, articleId } = findIdsFromSlugs();
    let count = 0;
    
    // Valores seguros para comparación
    const min = filterMetadata?.priceRange?.min ?? 0;
    const max = filterMetadata?.priceRange?.max ?? 1000000;
    
    if (tempFilters.subCategory && tempFilters.subCategory !== subId) count++;
    if (tempFilters.article && tempFilters.article !== articleId) count++;
    if (tempFilters.wilaya) count++;
    if (tempFilters.commune) count++;
    if (tempFilters.priceMin && Number(tempFilters.priceMin) !== min) count++;
    if (tempFilters.priceMax && Number(tempFilters.priceMax) !== max) count++;
    if (tempFilters.sortBy !== 'recent') count++;
    
    return count;
  };

  // Obtener artículos para el select de nivel 3
  const getArticlesForSelect = () => {
    if (!tempFilters.subCategory) return [];
    
    const selectedSub = categoryChildren.find(
      sub => String(sub._id) === String(tempFilters.subCategory)
    );
    
    return selectedSub?.articles || [];
  };

  const isMobile = windowWidth <= 768;

  // Opciones de ordenamiento
  const sortOptions = [
    { value: 'recent', label: 'Plus récents', icon: '🕐' },
    { value: 'price_asc', label: 'Prix croissant', icon: '💰' },
    { value: 'price_desc', label: 'Prix décroissant', icon: '💎' }
  ];

  // Estilos para react-select
  const selectStyles = {
    control: (base) => ({
      ...base,
      borderColor: '#e9ecef',
      borderRadius: '10px',
      minHeight: '42px',
      fontSize: '14px',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#667eea'
      }
    }),
    menu: (base) => ({
      ...base,
      zIndex: 1050,
      borderRadius: '10px',
      overflow: 'hidden'
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#667eea' : state.isFocused ? '#f0f3ff' : 'white',
      color: state.isSelected ? 'white' : '#333',
      fontSize: '14px',
      cursor: 'pointer',
      padding: '10px 12px'
    }),
    placeholder: (base) => ({
      ...base,
      color: '#adb5bd'
    })
  };

  if (loadingChildren) {
    return (
      <Offcanvas 
        show={show} 
        onHide={onHide} 
        placement="start" 
        style={{ 
          width: isMobile ? '100%' : '400px',
          maxWidth: '100%'
        }}
      >
        <div style={styles.loadingContainer}>
          <Spinner animation="border" variant="primary" />
          <p style={styles.loadingText}>Chargement des filtres...</p>
        </div>
      </Offcanvas>
    );
  }

  // Valores seguros para el slider
  const minPrice = filterMetadata?.priceRange?.min ?? 0;
  const maxPrice = filterMetadata?.priceRange?.max ?? 1000000;

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="start"
      style={{
        width: isMobile ? '100%' : '400px',
        maxWidth: '100%'
      }}
    >
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.iconCircle}>
            <Funnel size={18} color="#667eea" />
          </div>
          <h6 style={styles.headerTitle}>Filtres</h6>
          {countActiveFilters() > 0 && (
            <span style={styles.badge}>
              {countActiveFilters()}
            </span>
          )}
        </div>
        
        <div style={styles.headerRight}>
          <div style={styles.urlIndicator}>
            <span style={styles.urlText}>
              {slug}
              {subSlug && ` › ${subSlug}`}
              {articleSlug && ` › ${articleSlug}`}
            </span>
          </div>
          
          <button 
            onClick={resetFilters}
            style={styles.iconButton}
            title="Réinitialiser"
          >
            <ArrowCounterclockwise size={16} color="#666" />
          </button>
          
          <button 
            onClick={onHide}
            style={styles.iconButton}
            title="Fermer"
          >
            <XLg size={16} color="#666" />
          </button>
        </div>
      </div>

      <Offcanvas.Body style={styles.body}>
        {/* SECCIÓN CATEGORÍAS */}
        {categoryChildren.length > 0 && (
          <Accordion defaultActiveKey="0" style={styles.accordion}>
            <Accordion.Item eventKey="0" style={styles.accordionItem}>
              <Accordion.Header>
                <div style={styles.accordionTitle}>
                  <span>Catégories</span>
                  <span style={styles.countBadge}>{categoryChildren.length}</span>
                </div>
              </Accordion.Header>
              <Accordion.Body style={styles.accordionBody}>
                <Form.Label style={styles.label}>
                  Sous-catégorie
                </Form.Label>
                <Form.Select
                  value={tempFilters.subCategory}
                  onChange={(e) => handleFilterChange('subCategory', e.target.value)}
                  style={styles.select}
                >
                  <option value="">Toutes les sous-catégories</option>
                  {categoryChildren.map(sub => (
                    <option key={sub._id} value={sub._id}>
                      {sub.icon || '📌'} {sub.name} {sub.postCount ? `(${sub.postCount})` : ''}
                      {sub.slug === subSlug ? ' ✓' : ''}
                    </option>
                  ))}
                </Form.Select>

                {tempFilters.subCategory && getArticlesForSelect().length > 0 && (
                  <>
                    <Form.Label style={{...styles.label, marginTop: '20px'}}>
                      Article
                    </Form.Label>
                    <Form.Select
                      value={tempFilters.article}
                      onChange={(e) => handleFilterChange('article', e.target.value)}
                      style={styles.select}
                    >
                      <option value="">Tous les articles</option>
                      {getArticlesForSelect().map(article => (
                        <option key={article._id} value={article._id}>
                          {article.icon || '📄'} {article.name}
                          {article.slug === articleSlug ? ' ✓' : ''}
                        </option>
                      ))}
                    </Form.Select>
                  </>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )}

        {/* SECCIÓN LOCALISATION */}
        <Accordion defaultActiveKey="1" style={styles.accordion}>
          <Accordion.Item eventKey="1" style={styles.accordionItem}>
            <Accordion.Header>
              <div style={styles.accordionTitle}>
                <GeoAlt size={16} color="#667eea" style={{ marginRight: '8px' }} />
                <span>Localisation</span>
              </div>
            </Accordion.Header>
            <Accordion.Body style={styles.accordionBody}>
              <Form.Label style={styles.label}>Wilaya</Form.Label>
              <Select
                options={filterMetadata.wilayas || []}
                value={(filterMetadata.wilayas || []).find(w => w.value === tempFilters.wilaya)}
                onChange={(option) => handleFilterChange('wilaya', option?.value || '')}
                isClearable
                placeholder="Sélectionner une wilaya"
                styles={selectStyles}
                isDisabled={!filterMetadata.wilayas || filterMetadata.wilayas.length === 0}
              />

              {tempFilters.wilaya && (
                <>
                  <Form.Label style={{...styles.label, marginTop: '16px'}}>Commune</Form.Label>
                  <Form.Control
                    type="text"
                    value={tempFilters.commune}
                    onChange={(e) => handleFilterChange('commune', e.target.value)}
                    placeholder="Nom de la commune"
                    style={styles.input}
                  />
                </>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* SECCIÓN PRIX */}
        <Accordion defaultActiveKey="2" style={styles.accordion}>
          <Accordion.Item eventKey="2" style={styles.accordionItem}>
            <Accordion.Header>
              <div style={styles.accordionTitle}>
                <CurrencyEuro size={16} color="#667eea" style={{ marginRight: '8px' }} />
                <span>Prix</span>
              </div>
            </Accordion.Header>
            <Accordion.Body style={styles.accordionBody}>
              <div style={styles.priceRangeContainer}>
                <Slider
                  range
                  min={minPrice}
                  max={maxPrice}
                  step={1000}
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  trackStyle={[{ backgroundColor: '#667eea', height: '4px' }]}
                  handleStyle={[
                    { 
                      borderColor: '#667eea', 
                      backgroundColor: '#667eea',
                      width: '18px',
                      height: '18px',
                      marginTop: '-7px',
                      opacity: 1,
                      boxShadow: '0 2px 4px rgba(102,126,234,0.3)'
                    },
                    { 
                      borderColor: '#667eea', 
                      backgroundColor: '#667eea',
                      width: '18px',
                      height: '18px',
                      marginTop: '-7px',
                      opacity: 1,
                      boxShadow: '0 2px 4px rgba(102,126,234,0.3)'
                    }
                  ]}
                  railStyle={{ backgroundColor: '#e9ecef', height: '4px' }}
                />
                
                <div style={styles.priceInputs}>
                  <div style={styles.priceInputGroup}>
                    <span style={styles.priceLabel}>Min</span>
                    <div style={styles.priceInputWrapper}>
                      <span style={styles.priceCurrency}>DA</span>
                      <input
                        type="number"
                        value={tempFilters.priceMin}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleFilterChange('priceMin', val);
                          setPriceRange([Number(val) || minPrice, priceRange[1]]);
                        }}
                        placeholder={minPrice.toString()}
                        style={styles.priceInput}
                      />
                    </div>
                  </div>
                  
                  <div style={styles.priceSeparator}>
                    <span>−</span>
                  </div>
                  
                  <div style={styles.priceInputGroup}>
                    <span style={styles.priceLabel}>Max</span>
                    <div style={styles.priceInputWrapper}>
                      <span style={styles.priceCurrency}>DA</span>
                      <input
                        type="number"
                        value={tempFilters.priceMax}
                        onChange={(e) => {
                          const val = e.target.value;
                          handleFilterChange('priceMax', val);
                          setPriceRange([priceRange[0], Number(val) || maxPrice]);
                        }}
                        placeholder={maxPrice.toString()}
                        style={styles.priceInput}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* SECCIÓN TRI */}
        <Accordion defaultActiveKey="3" style={styles.accordion}>
          <Accordion.Item eventKey="3" style={styles.accordionItem}>
            <Accordion.Header>
              <div style={styles.accordionTitle}>
                <SortDown size={16} color="#667eea" style={{ marginRight: '8px' }} />
                <span>Trier par</span>
              </div>
            </Accordion.Header>
            <Accordion.Body style={styles.accordionBody}>
              <div style={styles.sortOptions}>
                {sortOptions.map(option => (
                  <div
                    key={option.value}
                    onClick={() => handleFilterChange('sortBy', option.value)}
                    style={{
                      ...styles.sortOption,
                      backgroundColor: tempFilters.sortBy === option.value ? '#f0f3ff' : 'white',
                      borderColor: tempFilters.sortBy === option.value ? '#667eea' : '#e9ecef'
                    }}
                  >
                    <div style={styles.sortOptionLeft}>
                      <span style={styles.sortIcon}>{option.icon}</span>
                      <span style={styles.sortLabel}>{option.label}</span>
                    </div>
                    {tempFilters.sortBy === option.value && (
                      <Check2 size={16} color="#667eea" />
                    )}
                  </div>
                ))}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Offcanvas.Body>

      {/* Footer */}
      <div style={styles.footer}>
        <Button 
          variant="outline-secondary" 
          onClick={resetFilters}
          style={styles.resetButton}
        >
          Réinitialiser
        </Button>
        <Button 
          variant="primary" 
          onClick={applyFilters}
          style={styles.applyButton}
        >
          Appliquer les filtres
        </Button>
      </div>
    </Offcanvas>
  );
};

// Estilos integrados
const styles = {
  loadingContainer: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  loadingText: {
    marginTop: '16px',
    color: '#666',
    fontSize: '14px'
  },
  header: {
    padding: '16px 20px',
    borderBottom: '1px solid #e9ecef',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  iconCircle: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#f0f3ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600',
    color: '#333'
  },
  badge: {
    backgroundColor: '#667eea',
    color: 'white',
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '12px',
    marginLeft: '4px'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  urlIndicator: {
    backgroundColor: '#f8f9fa',
    padding: '6px 10px',
    borderRadius: '20px',
    border: '1px solid #e9ecef'
  },
  urlText: {
    fontSize: '12px',
    color: '#667eea',
    fontWeight: '500'
  },
  iconButton: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  body: {
    padding: '16px',
    backgroundColor: '#f8f9fa',
    flex: 1,
    overflowY: 'auto'
  },
  accordion: {
    marginBottom: '12px',
    borderRadius: '12px',
    overflow: 'hidden',
    border: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
  },
  accordionItem: {
    border: 'none',
    backgroundColor: 'white'
  },
  accordionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '500',
    color: '#333'
  },
  accordionBody: {
    padding: '16px',
    backgroundColor: 'white',
    borderTop: '1px solid #e9ecef'
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '6px',
    color: '#495057',
    display: 'block'
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    fontSize: '14px',
    color: '#333',
    backgroundColor: 'white',
    cursor: 'pointer',
    outline: 'none'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '10px',
    border: '1px solid #e9ecef',
    fontSize: '14px',
    outline: 'none'
  },
  countBadge: {
    backgroundColor: '#e9ecef',
    color: '#666',
    fontSize: '11px',
    fontWeight: '600',
    padding: '2px 6px',
    borderRadius: '10px',
    marginLeft: '8px'
  },
  priceRangeContainer: {
    padding: '8px 0'
  },
  priceInputs: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginTop: '24px'
  },
  priceInputGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  priceLabel: {
    fontSize: '12px',
    color: '#666',
    marginLeft: '4px'
  },
  priceInputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  priceCurrency: {
    position: 'absolute',
    left: '10px',
    fontSize: '12px',
    color: '#999'
  },
  priceInput: {
    width: '100%',
    padding: '10px 10px 10px 30px',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
    fontSize: '13px',
    outline: 'none'
  },
  priceSeparator: {
    color: '#666',
    fontSize: '18px',
    marginTop: '16px'
  },
  sortOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  sortOption: {
    padding: '12px 16px',
    border: '1px solid #e9ecef',
    borderRadius: '10px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sortOptionLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  sortIcon: {
    fontSize: '16px'
  },
  sortLabel: {
    fontSize: '14px',
    color: '#333'
  },
  footer: {
    padding: '16px 20px',
    borderTop: '1px solid #e9ecef',
    backgroundColor: 'white',
    display: 'flex',
    gap: '12px'
  },
  resetButton: {
    flex: 1,
    padding: '12px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    border: '1px solid #e9ecef',
    backgroundColor: 'white',
    color: '#666',
    cursor: 'pointer'
  },
  applyButton: {
    flex: 1,
    padding: '12px',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    border: 'none',
    backgroundColor: '#667eea',
    color: 'white',
    cursor: 'pointer'
  }
};

export default FilterDrawer;