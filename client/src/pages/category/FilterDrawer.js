// 📂 pages/FilterDrawer.js - VERSIÓN CORREGIDA
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  
  // Estados
  const [categoryChildren, setCategoryChildren] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  
  const [filterMetadata, setFilterMetadata] = useState({
    wilayas: [],
    priceRange: { min: 0, max: 1000000 },
    appliedFilters: {}
  });
  
  // Obtener datos de Redux
  const categoryState = useSelector((state) => state.category || {});
  const { children = [] } = categoryState;

  // Manejador de error de imagen
  const handleImageError = (itemId) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  // ============ CARGAR HIJOS ============
  useEffect(() => {
    if (!show || !slug) return;
    
    const loadData = async () => {
      setLoadingChildren(true);
      try {
        const result = await dispatch(getCategoryPosts(slug, subSlug, articleSlug, 1, 1));
        
        if (result && result.children) {
          setCategoryChildren(result.children);
        }
        
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
          if (article) articleId = article._id;
        }
      }
    }
    return { subId, articleId };
  }, [categoryChildren, subSlug, articleSlug]);

  // ============ INICIALIZAR FILTROS ============
  const getInitialFilters = () => {
    const { subId, articleId } = findIdsFromSlugs();
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
  const [priceRange, setPriceRange] = useState([
    filterMetadata?.priceRange?.min ?? 0,
    filterMetadata?.priceRange?.max ?? 1000000
  ]);

  // Actualizar cuando cambia URL o metadata
  useEffect(() => {
    const newFilters = getInitialFilters();
    setTempFilters(newFilters);
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
    if (key === 'subCategory') setTempFilters(prev => ({ ...prev, article: '' }));
    if (key === 'wilaya') setTempFilters(prev => ({ ...prev, commune: '' }));
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
    if (onApplyFilters && typeof onApplyFilters === 'function') {
      onApplyFilters(tempFilters);
    }
    onHide();
  };

  const resetFilters = () => {
    const { subId, articleId } = findIdsFromSlugs();
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
    const min = filterMetadata?.priceRange?.min ?? 0;
    const max = filterMetadata?.priceRange?.max ?? 1000000;
    let count = 0;
    if (tempFilters.subCategory && tempFilters.subCategory !== subId) count++;
    if (tempFilters.article && tempFilters.article !== articleId) count++;
    if (tempFilters.wilaya) count++;
    if (tempFilters.commune) count++;
    if (tempFilters.priceMin && Number(tempFilters.priceMin) !== min) count++;
    if (tempFilters.priceMax && Number(tempFilters.priceMax) !== max) count++;
    if (tempFilters.sortBy !== 'recent') count++;
    return count;
  };

  // ============ OPCIONES PARA SELECTS CON IMÁGENES ============
  const subCategoryOptions = useMemo(() => {
    return categoryChildren.map(sub => ({
      value: sub._id,
      label: sub.name,
      icon: sub.icon,
      emoji: sub.emoji || '📌',
      postCount: sub.postCount || 0
    }));
  }, [categoryChildren]);

  const articleOptions = useMemo(() => {
    if (!tempFilters.subCategory) return [];
    const selectedSub = categoryChildren.find(sub => String(sub._id) === String(tempFilters.subCategory));
    return (selectedSub?.articles || []).map(article => ({
      value: article._id,
      label: article.name,
      icon: article.icon,
      emoji: article.emoji || '📄'
    }));
  }, [categoryChildren, tempFilters.subCategory]);

  // Componentes personalizados para react-select
  const CustomOption = (props) => {
    const { data, innerRef, innerProps } = props;
    const hasError = imageErrors[data.value];
    return (
      <div ref={innerRef} {...innerProps} style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', cursor: 'pointer' }}>
        {data.icon && !hasError ? (
          <img 
            src={data.icon} 
            alt={data.label}
            style={{ width: 24, height: 24, objectFit: 'cover', borderRadius: 4, marginRight: 8 }}
            onError={() => handleImageError(data.value)}
          />
        ) : (
          <span style={{ fontSize: 20, marginRight: 8 }}>{data.emoji}</span>
        )}
        <span>{data.label}</span>
        {data.postCount ? <span style={{ marginLeft: 'auto', color: '#666', fontSize: 12 }}>({data.postCount})</span> : null}
      </div>
    );
  };

  const CustomSingleValue = (props) => {
    const { data } = props;
    const hasError = imageErrors[data.value];
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {data.icon && !hasError ? (
          <img 
            src={data.icon} 
            alt={data.label}
            style={{ width: 20, height: 20, objectFit: 'cover', borderRadius: 3, marginRight: 8 }}
            onError={() => handleImageError(data.value)}
          />
        ) : (
          <span style={{ fontSize: 16, marginRight: 8 }}>{data.emoji}</span>
        )}
        <span>{data.label}</span>
      </div>
    );
  };

  // Estilos para react-select (corregidos)
  const selectStyles = {
    control: (base) => ({
      ...base,
      borderColor: '#e9ecef',
      borderRadius: '10px',
      minHeight: '42px',
      fontSize: '14px',
      boxShadow: 'none',
      '&:hover': { borderColor: '#667eea' }
    }),
    menu: (base) => ({
      ...base,
      zIndex: 1060, // Aumentado para que esté por encima del Offcanvas
      borderRadius: '10px',
      overflow: 'hidden'
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 1060
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? '#667eea' : state.isFocused ? '#f0f3ff' : 'white',
      color: state.isSelected ? 'white' : '#333',
      fontSize: '14px',
      cursor: 'pointer',
      padding: 0 // Importante: el padding lo manejamos en CustomOption
    }),
    placeholder: (base) => ({ ...base, color: '#adb5bd' }),
    singleValue: (base) => ({ ...base, display: 'flex', alignItems: 'center' })
  };

  const isMobile = windowWidth <= 768;

  // Opciones de ordenamiento
  const sortOptions = [
    { value: 'recent', label: 'Plus récents', icon: '🕐' },
    { value: 'price_asc', label: 'Prix croissant', icon: '💰' },
    { value: 'price_desc', label: 'Prix décroissant', icon: '💎' }
  ];

  if (loadingChildren) {
    return (
      <Offcanvas 
        show={show} 
        onHide={onHide} 
        placement="start" 
        style={{ 
          width: isMobile ? 'calc(100% - 20px)' : '400px', // 10px de margen a cada lado
          maxWidth: '100%',
          margin: isMobile ? '10px' : '0' // Margen en móvil
        }}
      >
        <div style={styles.loadingContainer}>
          <Spinner animation="border" variant="primary" />
          <p style={styles.loadingText}>Chargement des filtres...</p>
        </div>
      </Offcanvas>
    );
  }

  const minPrice = filterMetadata?.priceRange?.min ?? 0;
  const maxPrice = filterMetadata?.priceRange?.max ?? 1000000;

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="start"
      style={{
        width: isMobile ? 'calc(100% - 20px)' : '400px',
        maxWidth: '100%',
        margin: isMobile ? '10px' : '0' // Margen en móvil
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
            <span style={styles.badge}>{countActiveFilters()}</span>
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
          
          <button onClick={resetFilters} style={styles.iconButton} title="Réinitialiser">
            <ArrowCounterclockwise size={16} color="#666" />
          </button>
          
          <button onClick={onHide} style={styles.iconButton} title="Fermer">
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
                <Form.Label style={styles.label}>Sous-catégorie</Form.Label>
                <Select
                  options={subCategoryOptions}
                  value={subCategoryOptions.find(opt => opt.value === tempFilters.subCategory) || null}
                  onChange={(option) => handleFilterChange('subCategory', option?.value || '')}
                  isClearable
                  placeholder="Toutes les sous-catégories"
                  styles={selectStyles}
                  components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                  menuPortalTarget={document.body} // Para que el menú no se recorte
                  menuShouldBlockScroll={true}
                />

                {tempFilters.subCategory && articleOptions.length > 0 && (
                  <>
                    <Form.Label style={{...styles.label, marginTop: '20px'}}>Article</Form.Label>
                    <Select
                      options={articleOptions}
                      value={articleOptions.find(opt => opt.value === tempFilters.article) || null}
                      onChange={(option) => handleFilterChange('article', option?.value || '')}
                      isClearable
                      placeholder="Tous les articles"
                      styles={selectStyles}
                      components={{ Option: CustomOption, SingleValue: CustomSingleValue }}
                      menuPortalTarget={document.body}
                      menuShouldBlockScroll={true}
                    />
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
                menuPortalTarget={document.body}
                menuShouldBlockScroll={true}
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
                    { borderColor: '#667eea', backgroundColor: '#667eea', width: '18px', height: '18px', marginTop: '-7px', opacity: 1, boxShadow: '0 2px 4px rgba(102,126,234,0.3)' },
                    { borderColor: '#667eea', backgroundColor: '#667eea', width: '18px', height: '18px', marginTop: '-7px', opacity: 1, boxShadow: '0 2px 4px rgba(102,126,234,0.3)' }
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
        <Button variant="outline-secondary" onClick={resetFilters} style={styles.resetButton}>
          Réinitialiser
        </Button>
        <Button variant="primary" onClick={applyFilters} style={styles.applyButton}>
          Appliquer les filtres
        </Button>
      </div>
    </Offcanvas>
  );
};

// Estilos integrados (sin cambios)
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
      padding: '12px 16px', // Reducido de 16px 20px
      borderBottom: '1px solid #e9ecef',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: 'white'
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px' // Reducido de 10px
    },
    iconCircle: {
      width: '28px', // Reducido de 32px
      height: '28px',
      borderRadius: '6px',
      backgroundColor: '#f0f3ff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    headerTitle: {
      margin: 0,
      fontSize: '15px', // Reducido de 16px
      fontWeight: '600',
      color: '#333'
    },
    badge: {
      backgroundColor: '#667eea',
      color: 'white',
      fontSize: '10px', // Reducido de 11px
      fontWeight: '600',
      padding: '2px 5px', // Reducido
      borderRadius: '10px',
      marginLeft: '4px'
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px' // Reducido de 8px
    },
    urlIndicator: {
      backgroundColor: '#f8f9fa',
      padding: '4px 8px', // Reducido de 6px 10px
      borderRadius: '16px',
      border: '1px solid #e9ecef'
    },
    urlText: {
      fontSize: '11px', // Reducido de 12px
      color: '#667eea',
      fontWeight: '500'
    },
    iconButton: {
      width: '28px', // Reducido de 32px
      height: '28px',
      borderRadius: '6px',
      border: '1px solid #e9ecef',
      backgroundColor: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    body: {
      padding: '12px', // Reducido de 16px
      backgroundColor: '#f8f9fa',
      flex: 1,
      overflowY: 'auto'
    },
    accordion: {
      marginBottom: '10px', // Reducido de 12px
      borderRadius: '10px',
      overflow: 'hidden',
      border: 'none',
      boxShadow: '0 2px 6px rgba(0,0,0,0.04)' // Sombra más ligera
    },
    accordionItem: {
      border: 'none',
      backgroundColor: 'white'
    },
    accordionTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px', // Reducido de 8px
      fontWeight: '500',
      color: '#333',
      fontSize: '14px' // Añadido
    },
    accordionBody: {
      padding: '12px', // Reducido de 16px
      backgroundColor: 'white',
      borderTop: '1px solid #e9ecef'
    },
    label: {
      fontSize: '12px', // Reducido de 13px
      fontWeight: '500',
      marginBottom: '4px', // Reducido de 6px
      color: '#495057',
      display: 'block'
    },
    input: {
      width: '100%',
      padding: '8px 10px', // Reducido de 10px 12px
      borderRadius: '8px',
      border: '1px solid #e9ecef',
      fontSize: '13px', // Reducido de 14px
      outline: 'none'
    },
    countBadge: {
      backgroundColor: '#e9ecef',
      color: '#666',
      fontSize: '10px', // Reducido de 11px
      fontWeight: '600',
      padding: '2px 5px', // Reducido
      borderRadius: '8px',
      marginLeft: '6px' // Reducido de 8px
    },
    priceRangeContainer: {
      padding: '6px 0' // Reducido de 8px
    },
    priceInputs: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px', // Reducido de 12px
      marginTop: '16px' // Reducido de 24px
    },
    priceInputGroup: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '2px' // Reducido de 4px
    },
    priceLabel: {
      fontSize: '11px', // Reducido de 12px
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
      left: '8px', // Reducido de 10px
      fontSize: '11px', // Reducido de 12px
      color: '#999'
    },
    priceInput: {
      width: '100%',
      padding: '8px 8px 8px 25px', // Ajustado
      borderRadius: '6px', // Reducido de 8px
      border: '1px solid #e9ecef',
      fontSize: '12px', // Reducido de 13px
      outline: 'none'
    },
    priceSeparator: {
      color: '#666',
      fontSize: '16px', // Reducido de 18px
      marginTop: '14px' // Reducido de 16px
    },
    sortOptions: {
      display: 'flex',
      flexDirection: 'column',
      gap: '6px' // Reducido de 8px
    },
    sortOption: {
      padding: '10px 14px', // Reducido de 12px 16px
      border: '1px solid #e9ecef',
      borderRadius: '8px',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    sortOptionLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px' // Reducido de 10px
    },
    sortIcon: {
      fontSize: '15px' // Reducido de 16px
    },
    sortLabel: {
      fontSize: '13px', // Reducido de 14px
      color: '#333'
    },
    footer: {
      padding: '12px 16px', // Reducido de 16px 20px
      borderTop: '1px solid #e9ecef',
      backgroundColor: 'white',
      display: 'flex',
      gap: '10px' // Reducido de 12px
    },
    resetButton: {
      flex: 1,
      padding: '10px', // Reducido de 12px
      borderRadius: '8px',
      fontSize: '13px', // Reducido de 14px
      fontWeight: '500',
      border: '1px solid #e9ecef',
      backgroundColor: 'white',
      color: '#666',
      cursor: 'pointer'
    },
    applyButton: {
      flex: 1,
      padding: '10px', // Reducido de 12px
      borderRadius: '8px',
      fontSize: '13px', // Reducido de 14px
      fontWeight: '500',
      border: 'none',
      backgroundColor: '#667eea',
      color: 'white',
      cursor: 'pointer'
    }
  };

export default FilterDrawer;