// 📂 pages/FilterDrawer.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Offcanvas, Form, Button, Accordion, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
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
import { getFilterOptions } from '../../redux/actions/categoryAction';
import wilayasData from './wilayas.json'; // Ajusta la ruta según tu estructura

const FilterDrawer = ({ 
  show, 
  onHide, 
  onApplyFilters, 
  category,          // slug de la categoría principal
  subSlug = '',      // slug de subcategoría actual (desde URL)
  articleSlug = '',  // slug de artículo actual (desde URL)
  initialWilaya = '',
  initialCommune = '',
  initialMinPrice = null,
  initialMaxPrice = null,
  initialSortBy = 'recent'
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Obtener datos del reducer filter
  const { 
    children = [], 
    wilayas: wilayasFromBackend = [], 
    priceRange = { min: 0, max: 1000000 }, 
    loading 
  } = useSelector(state => state.filter);

  // Estado local para los filtros temporales
  const [tempFilters, setTempFilters] = useState({
    subCategory: subSlug,
    article: articleSlug,
    wilaya: initialWilaya,
    commune: initialCommune,
    priceMin: initialMinPrice !== null ? initialMinPrice : priceRange.min,
    priceMax: initialMaxPrice !== null ? initialMaxPrice : priceRange.max,
    sortBy: initialSortBy
  });

  // Estado para communes basado en JSON
  const [communesList, setCommunesList] = useState([]);

  // Cargar opciones cuando se abre el drawer
  useEffect(() => {
    if (show && category) {
      dispatch(getFilterOptions(category, subSlug, articleSlug));
    }
  }, [show, category, subSlug, articleSlug, dispatch]);

  // Actualizar precios cuando cambia el rango desde Redux
  useEffect(() => {
    setTempFilters(prev => ({
      ...prev,
      priceMin: priceRange.min,
      priceMax: priceRange.max
    }));
  }, [priceRange]);

  // Sincronizar con props iniciales
  useEffect(() => {
    setTempFilters({
      subCategory: subSlug,
      article: articleSlug,
      wilaya: initialWilaya,
      commune: initialCommune,
      priceMin: initialMinPrice !== null ? initialMinPrice : priceRange.min,
      priceMax: initialMaxPrice !== null ? initialMaxPrice : priceRange.max,
      sortBy: initialSortBy
    });
  }, [subSlug, articleSlug, initialWilaya, initialCommune, initialMinPrice, initialMaxPrice, initialSortBy, priceRange]);

  // Cargar communes cuando cambia la wilaya seleccionada
  useEffect(() => {
    if (tempFilters.wilaya) {
      // Buscar la wilaya en el JSON (ajusta según la estructura real)
      const wilaya = wilayasData.find(w => 
        w.wilaya === tempFilters.wilaya || 
        w.name === tempFilters.wilaya || 
        w.code === tempFilters.wilaya
      );
      if (wilaya) {
        // Obtener lista de communes (puede ser 'commune', 'communes', 'municipalities')
        const communes = wilaya.commune || wilaya.communes || wilaya.municipalities || [];
        setCommunesList(communes);
      } else {
        setCommunesList([]);
      }
    } else {
      setCommunesList([]);
    }
  }, [tempFilters.wilaya]);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handlers
  const handleFilterChange = (key, value) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
    if (key === 'subCategory') {
      setTempFilters(prev => ({ ...prev, article: '' }));
    }
    if (key === 'wilaya') {
      setTempFilters(prev => ({ ...prev, commune: '' })); // reset commune al cambiar wilaya
    }
  };

  const handlePriceRangeChange = (values) => {
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
    setTempFilters({
      subCategory: subSlug,
      article: articleSlug,
      wilaya: '',
      commune: '',
      priceMin: priceRange.min,
      priceMax: priceRange.max,
      sortBy: 'recent'
    });
  };

  const countActiveFilters = () => {
    let count = 0;
    if (tempFilters.subCategory && tempFilters.subCategory !== subSlug) count++;
    if (tempFilters.article && tempFilters.article !== articleSlug) count++;
    if (tempFilters.wilaya) count++;
    if (tempFilters.commune) count++;
    if (tempFilters.priceMin && tempFilters.priceMin !== priceRange.min) count++;
    if (tempFilters.priceMax && tempFilters.priceMax !== priceRange.max) count++;
    if (tempFilters.sortBy !== 'recent') count++;
    return count;
  };

  // Opciones para selects de categorías (usando slugs)
  const subCategoryOptions = useMemo(() => {
    return children.map(sub => ({
      value: sub.slug,
      label: sub.name,
      icon: sub.icon,
      emoji: sub.emoji || '📌',
      postCount: sub.postCount || 0
    }));
  }, [children]);

  const articleOptions = useMemo(() => {
    const selectedSub = children.find(sub => sub.slug === tempFilters.subCategory);
    return (selectedSub?.articles || []).map(article => ({
      value: article.slug,
      label: article.name,
      icon: article.icon,
      emoji: article.emoji || '📄'
    }));
  }, [children, tempFilters.subCategory]);

  // Opciones de ordenamiento
  const sortOptions = [
    { value: 'recent', label: 'Plus récents', icon: '🕐' },
    { value: 'price_asc', label: 'Prix croissant', icon: '💰' },
    { value: 'price_desc', label: 'Prix décroissant', icon: '💎' }
  ];

  const isMobile = windowWidth <= 768;

  // Componentes personalizados para react-select (con imágenes/emojis)
  const CustomOption = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
      <div ref={innerRef} {...innerProps} style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', cursor: 'pointer' }}>
        {data.icon ? (
          <img 
            src={data.icon} 
            alt={data.label}
            style={{ width: 24, height: 24, objectFit: 'cover', borderRadius: 4, marginRight: 8 }}
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
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {data.icon ? (
          <img 
            src={data.icon} 
            alt={data.label}
            style={{ width: 20, height: 20, objectFit: 'cover', borderRadius: 3, marginRight: 8 }}
          />
        ) : (
          <span style={{ fontSize: 16, marginRight: 8 }}>{data.emoji}</span>
        )}
        <span>{data.label}</span>
      </div>
    );
  };

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
      zIndex: 1060,
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
      padding: 0
    }),
    placeholder: (base) => ({ ...base, color: '#adb5bd' }),
    singleValue: (base) => ({ ...base, display: 'flex', alignItems: 'center' })
  };

  if (loading) {
    return (
      <Offcanvas 
        show={show} 
        onHide={onHide} 
        placement="start" 
        style={{ 
          width: isMobile ? 'calc(100% - 20px)' : '400px',
          maxWidth: '100%',
          margin: isMobile ? '10px' : '0'
        }}
      >
        <div style={styles.loadingContainer}>
          <Spinner animation="border" variant="primary" />
          <p style={styles.loadingText}>Chargement des filtres...</p>
        </div>
      </Offcanvas>
    );
  }

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="start"
      style={{
        width: isMobile ? 'calc(100% - 20px)' : '400px',
        maxWidth: '100%',
        margin: isMobile ? '10px' : '0'
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
              {category}
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
        {children.length > 0 && (
          <Accordion defaultActiveKey="0" style={styles.accordion}>
            <Accordion.Item eventKey="0" style={styles.accordionItem}>
              <Accordion.Header>
                <div style={styles.accordionTitle}>
                  <span>Catégories</span>
                  <span style={styles.countBadge}>{children.length}</span>
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
                  menuPortalTarget={document.body}
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

        {/* SECCIÓN LOCALISATION CON JSON */}
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
              <Form.Select
                value={tempFilters.wilaya}
                onChange={(e) => handleFilterChange('wilaya', e.target.value)}
                style={styles.select}
              >
                <option value="">Sélectionner une wilaya</option>
                {wilayasData.map((wilaya, index) => {
                  const wilayaValue = wilaya.wilaya || wilaya.name || wilaya.code || `Wilaya ${index + 1}`;
                  const wilayaLabel = wilaya.wilaya || wilaya.name || `Wilaya ${wilaya.code}`;
                  return (
                    <option key={index} value={wilayaValue}>
                      {wilayaLabel}
                    </option>
                  );
                })}
              </Form.Select>

              {tempFilters.wilaya && communesList.length > 0 && (
                <>
                  <Form.Label style={{...styles.label, marginTop: '16px'}}>Commune</Form.Label>
                  <Form.Select
                    value={tempFilters.commune}
                    onChange={(e) => handleFilterChange('commune', e.target.value)}
                    style={styles.select}
                  >
                    <option value="">Sélectionner une commune</option>
                    {communesList.map((commune, idx) => {
                      const communeValue = typeof commune === 'string' ? commune : (commune.name || commune.nom || commune);
                      const communeLabel = typeof commune === 'string' ? commune : (commune.name || commune.nom || commune);
                      return (
                        <option key={idx} value={communeValue}>
                          {communeLabel}
                        </option>
                      );
                    })}
                  </Form.Select>
                </>
              )}

              {tempFilters.wilaya && communesList.length === 0 && (
                <div style={styles.noCommunesMessage}>
                  <small>Aucune commune disponible pour cette wilaya</small>
                </div>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* SECCIÓN PRIX (igual) */}
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
                  min={priceRange.min}
                  max={priceRange.max}
                  step={1000}
                  value={[tempFilters.priceMin, tempFilters.priceMax]}
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
                        onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                        placeholder={priceRange.min.toString()}
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
                        onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                        placeholder={priceRange.max.toString()}
                        style={styles.priceInput}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* SECCIÓN TRI (igual) */}
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

// Estilos (mantenemos los mismos que en la versión anterior)
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
    padding: '12px 16px',
    borderBottom: '1px solid #e9ecef',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  iconCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    backgroundColor: '#f0f3ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: '#333'
  },
  badge: {
    backgroundColor: '#667eea',
    color: 'white',
    fontSize: '10px',
    fontWeight: '600',
    padding: '2px 5px',
    borderRadius: '10px',
    marginLeft: '4px'
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  urlIndicator: {
    backgroundColor: '#f8f9fa',
    padding: '4px 8px',
    borderRadius: '16px',
    border: '1px solid #e9ecef'
  },
  urlText: {
    fontSize: '11px',
    color: '#667eea',
    fontWeight: '500'
  },
  iconButton: {
    width: '28px',
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
    padding: '12px',
    backgroundColor: '#f8f9fa',
    flex: 1,
    overflowY: 'auto'
  },
  accordion: {
    marginBottom: '10px',
    borderRadius: '10px',
    overflow: 'hidden',
    border: 'none',
    boxShadow: '0 2px 6px rgba(0,0,0,0.04)'
  },
  accordionItem: {
    border: 'none',
    backgroundColor: 'white'
  },
  accordionTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontWeight: '500',
    color: '#333',
    fontSize: '14px'
  },
  accordionBody: {
    padding: '12px',
    backgroundColor: 'white',
    borderTop: '1px solid #e9ecef'
  },
  label: {
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '4px',
    color: '#495057',
    display: 'block'
  },
  select: {
    width: '100%',
    padding: '8px 10px',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
    fontSize: '13px',
    outline: 'none',
    backgroundColor: 'white'
  },
  noCommunesMessage: {
    marginTop: '8px',
    color: '#dc3545',
    fontSize: '12px',
    fontStyle: 'italic'
  },
  countBadge: {
    backgroundColor: '#e9ecef',
    color: '#666',
    fontSize: '10px',
    fontWeight: '600',
    padding: '2px 5px',
    borderRadius: '8px',
    marginLeft: '6px'
  },
  priceRangeContainer: {
    padding: '6px 0'
  },
  priceInputs: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginTop: '16px'
  },
  priceInputGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  priceLabel: {
    fontSize: '11px',
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
    left: '8px',
    fontSize: '11px',
    color: '#999'
  },
  priceInput: {
    width: '100%',
    padding: '8px 8px 8px 25px',
    borderRadius: '6px',
    border: '1px solid #e9ecef',
    fontSize: '12px',
    outline: 'none'
  },
  priceSeparator: {
    color: '#666',
    fontSize: '16px',
    marginTop: '14px'
  },
  sortOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  sortOption: {
    padding: '10px 14px',
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
    gap: '8px'
  },
  sortIcon: {
    fontSize: '15px'
  },
  sortLabel: {
    fontSize: '13px',
    color: '#333'
  },
  footer: {
    padding: '12px 16px',
    borderTop: '1px solid #e9ecef',
    backgroundColor: 'white',
    display: 'flex',
    gap: '10px'
  },
  resetButton: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    border: '1px solid #e9ecef',
    backgroundColor: 'white',
    color: '#666',
    cursor: 'pointer'
  },
  applyButton: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    border: 'none',
    backgroundColor: '#667eea',
    color: 'white',
    cursor: 'pointer'
  }
};

export default FilterDrawer;