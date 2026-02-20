// 📂 frontend/src/components/FilterDrawer.jsx - VERSIÓN CORREGIDA (IZQUIERDA)
import React, { useState, useEffect } from 'react';
import { Offcanvas, Form, Button, Accordion, Spinner } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { 
  Funnel, 
  XLg, 
  ArrowCounterclockwise,
  Check2
} from 'react-bootstrap-icons';
import Select from 'react-select';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const FilterDrawer = ({ 
  show, 
  onHide, 
  category,
  currentSub,
  currentArticle,
  onApplyFilters 
}) => {
  const { t } = useTranslation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  // Obtener datos de la categoría desde Redux
  const { categoryInfo = {} } = useSelector((state) => state.category || {});
  
  // Estados del filtro
  const [filters, setFilters] = useState({
    subCategory: currentSub?._id || '',
    article: currentArticle?._id || '',
    wilaya: '',
    commune: '',
    priceMin: '',
    priceMax: '',
    sortBy: 'recent'
  });

  const [tempFilters, setTempFilters] = useState(filters);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [wilayas, setWilayas] = useState([]);
  const [loadingWilayas, setLoadingWilayas] = useState(false);

  // Actualizar tempFilters cuando cambien currentSub o currentArticle
  useEffect(() => {
    setTempFilters(prev => ({
      ...prev,
      subCategory: currentSub?._id || '',
      article: currentArticle?._id || ''
    }));
  }, [currentSub, currentArticle]);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ============ CARGAR WILAYAS ============
  useEffect(() => {
    const loadWilayas = async () => {
      setLoadingWilayas(true);
      try {
        // Intentar cargar desde API si existe
        // const response = await fetch('/api/wilayas');
        // const data = await response.json();
        
        // Datos de wilayas de Argelia
        const wilayasList = [
          { value: 'Adrar', label: 'Adrar' },
          { value: 'Chlef', label: 'Chlef' },
          { value: 'Laghouat', label: 'Laghouat' },
          { value: 'Oum El Bouaghi', label: 'Oum El Bouaghi' },
          { value: 'Batna', label: 'Batna' },
          { value: 'Béjaïa', label: 'Béjaïa' },
          { value: 'Biskra', label: 'Biskra' },
          { value: 'Béchar', label: 'Béchar' },
          { value: 'Blida', label: 'Blida' },
          { value: 'Bouira', label: 'Bouira' },
          { value: 'Tamanrasset', label: 'Tamanrasset' },
          { value: 'Tébessa', label: 'Tébessa' },
          { value: 'Tlemcen', label: 'Tlemcen' },
          { value: 'Tiaret', label: 'Tiaret' },
          { value: 'Tizi Ouzou', label: 'Tizi Ouzou' },
          { value: 'Alger', label: 'Alger' },
          { value: 'Djelfa', label: 'Djelfa' },
          { value: 'Jijel', label: 'Jijel' },
          { value: 'Sétif', label: 'Sétif' },
          { value: 'Saïda', label: 'Saïda' },
          { value: 'Skikda', label: 'Skikda' },
          { value: 'Sidi Bel Abbès', label: 'Sidi Bel Abbès' },
          { value: 'Annaba', label: 'Annaba' },
          { value: 'Guelma', label: 'Guelma' },
          { value: 'Constantine', label: 'Constantine' },
          { value: 'Médéa', label: 'Médéa' },
          { value: 'Mostaganem', label: 'Mostaganem' },
          { value: 'M\'Sila', label: 'M\'Sila' },
          { value: 'Mascara', label: 'Mascara' },
          { value: 'Ouargla', label: 'Ouargla' },
          { value: 'Oran', label: 'Oran' },
          { value: 'El Bayadh', label: 'El Bayadh' },
          { value: 'Illizi', label: 'Illizi' },
          { value: 'Bordj Bou Arréridj', label: 'Bordj Bou Arréridj' },
          { value: 'Boumerdès', label: 'Boumerdès' },
          { value: 'El Tarf', label: 'El Tarf' },
          { value: 'Tindouf', label: 'Tindouf' },
          { value: 'Tissemsilt', label: 'Tissemsilt' },
          { value: 'El Oued', label: 'El Oued' },
          { value: 'Khenchela', label: 'Khenchela' },
          { value: 'Souk Ahras', label: 'Souk Ahras' },
          { value: 'Tipaza', label: 'Tipaza' },
          { value: 'Mila', label: 'Mila' },
          { value: 'Aïn Defla', label: 'Aïn Defla' },
          { value: 'Naâma', label: 'Naâma' },
          { value: 'Aïn Témouchent', label: 'Aïn Témouchent' },
          { value: 'Ghardaïa', label: 'Ghardaïa' },
          { value: 'Relizane', label: 'Relizane' }
        ];
        setWilayas(wilayasList);
      } catch (error) {
        console.error('Error loading wilayas:', error);
      } finally {
        setLoadingWilayas(false);
      }
    };

    loadWilayas();
  }, []);

  const isMobile = windowWidth <= 768;

  // Opciones de ordenamiento
  const sortOptions = [
    { value: 'recent', label: 'Plus récents' },
    { value: 'price_asc', label: 'Prix croissant' },
    { value: 'price_desc', label: 'Prix décroissant' }
  ];

  // Manejar cambios en filtros
  const handleFilterChange = (key, value) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));
    
    // Si cambia subCategory, resetear article
    if (key === 'subCategory') {
      setTempFilters(prev => ({ ...prev, article: '' }));
    }
    
    // Si cambia wilaya, resetear commune
    if (key === 'wilaya') {
      setTempFilters(prev => ({ ...prev, commune: '' }));
    }
  };

  // Manejar cambio de rango de precio
  const handlePriceRangeChange = (values) => {
    setPriceRange(values);
    setTempFilters(prev => ({
      ...prev,
      priceMin: values[0],
      priceMax: values[1]
    }));
  };

  // Aplicar filtros
  const applyFilters = () => {
    console.log('🎯 Aplicando filtros:', tempFilters);
    onApplyFilters(tempFilters);
    onHide();
  };

  // Resetear filtros
  const resetFilters = () => {
    setTempFilters({
      subCategory: '',
      article: '',
      wilaya: '',
      commune: '',
      priceMin: '',
      priceMax: '',
      sortBy: 'recent'
    });
    setPriceRange([0, 1000000]);
  };

  // Contar filtros activos
  const countActiveFilters = () => {
    let count = 0;
    if (tempFilters.subCategory) count++;
    if (tempFilters.article) count++;
    if (tempFilters.wilaya) count++;
    if (tempFilters.commune) count++;
    if (tempFilters.priceMin || tempFilters.priceMax) count++;
    if (tempFilters.sortBy !== 'recent') count++;
    return count;
  };

  // Obtener subcategorías (children)
  const getSubCategories = () => {
    if (!categoryInfo || !categoryInfo.children) {
      console.log('❌ No hay children en categoryInfo');
      return [];
    }
    console.log('✅ Subcategorías encontradas:', categoryInfo.children.length);
    return categoryInfo.children;
  };

  // Obtener artículos de la subcategoría seleccionada
  const getArticles = () => {
    if (!tempFilters.subCategory) return [];
    
    const selectedSub = categoryInfo.children?.find(
      sub => String(sub._id) === String(tempFilters.subCategory)
    );
    
    console.log('📚 Artículos para subcategoría:', selectedSub?.articles?.length || 0);
    return selectedSub?.articles || [];
  };

  const subCategories = getSubCategories();

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      placement="start" // 👈 CAMBIADO A IZQUIERDA
      style={{
        width: isMobile ? '100%' : '400px',
        maxWidth: '100%'
      }}
    >
      {/* Header del drawer */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <Funnel size={20} color="#667eea" />
          <h6 style={styles.headerTitle}>Filtres</h6>
          {countActiveFilters() > 0 && (
            <span style={styles.badge}>
              {countActiveFilters()}
            </span>
          )}
        </div>
        <div style={styles.headerRight}>
          <button 
            onClick={resetFilters}
            style={styles.resetButton}
            title="Réinitialiser"
          >
            <ArrowCounterclockwise size={16} />
          </button>
          <button 
            onClick={onHide}
            style={styles.closeButton}
          >
            <XLg size={16} />
          </button>
        </div>
      </div>

      <Offcanvas.Body style={styles.body}>
        {/* ============ SUBCATEGORÍAS ============ */}
        {subCategories.length > 0 && (
          <Accordion defaultActiveKey="0" style={styles.accordion}>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Sous-catégories</Accordion.Header>
              <Accordion.Body>
                <Form.Select
                  value={tempFilters.subCategory}
                  onChange={(e) => handleFilterChange('subCategory', e.target.value)}
                  style={styles.select}
                >
                  <option value="">Toutes les sous-catégories</option>
                  {subCategories.map(sub => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name} {sub.postCount ? `(${sub.postCount})` : ''}
                    </option>
                  ))}
                </Form.Select>

                {/* Artículos (si hay subcategoría seleccionada) */}
                {tempFilters.subCategory && getArticles().length > 0 && (
                  <>
                    <Form.Label style={{...styles.label, marginTop: '15px'}}>
                      Articles
                    </Form.Label>
                    <Form.Select
                      value={tempFilters.article}
                      onChange={(e) => handleFilterChange('article', e.target.value)}
                      style={styles.select}
                    >
                      <option value="">Tous les articles</option>
                      {getArticles().map(article => (
                        <option key={article._id} value={article._id}>
                          {article.name}
                        </option>
                      ))}
                    </Form.Select>
                  </>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )}

        {/* ============ LOCALISATION ============ */}
        <Accordion defaultActiveKey="1" style={styles.accordion}>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Localisation</Accordion.Header>
            <Accordion.Body>
              <Form.Label style={styles.label}>Wilaya</Form.Label>
              {loadingWilayas ? (
                <div style={{ textAlign: 'center', padding: '10px' }}>
                  <Spinner animation="border" size="sm" />
                </div>
              ) : (
                <Select
                  key={wilayas.length} // Forzar re-render cuando cambien las wilayas
                  options={wilayas}
                  value={wilayas.find(w => w.value === tempFilters.wilaya)}
                  onChange={(option) => handleFilterChange('wilaya', option?.value || '')}
                  isClearable
                  placeholder="Sélectionner une wilaya"
                  styles={selectStyles}
                  isDisabled={wilayas.length === 0}
                />
              )}

              {tempFilters.wilaya && (
                <>
                  <Form.Label style={{...styles.label, marginTop: '15px'}}>Commune</Form.Label>
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

        {/* ============ PRIX ============ */}
        <Accordion defaultActiveKey="2" style={styles.accordion}>
          <Accordion.Item eventKey="2">
            <Accordion.Header>Prix</Accordion.Header>
            <Accordion.Body>
              <div style={styles.priceRangeContainer}>
                <Slider
                  range
                  min={0}
                  max={1000000}
                  step={1000}
                  value={priceRange}
                  onChange={handlePriceRangeChange}
                  trackStyle={[{ backgroundColor: '#667eea' }]}
                  handleStyle={[
                    { borderColor: '#667eea', backgroundColor: '#667eea' },
                    { borderColor: '#667eea', backgroundColor: '#667eea' }
                  ]}
                />
                <div style={styles.priceInputs}>
                  <div style={styles.priceInputGroup}>
                    <span style={styles.priceLabel}>Min</span>
                    <input
                      type="number"
                      value={tempFilters.priceMin}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleFilterChange('priceMin', val);
                        setPriceRange([Number(val) || 0, priceRange[1]]);
                      }}
                      placeholder="0"
                      style={styles.priceInput}
                    />
                  </div>
                  <span style={styles.priceSeparator}>-</span>
                  <div style={styles.priceInputGroup}>
                    <span style={styles.priceLabel}>Max</span>
                    <input
                      type="number"
                      value={tempFilters.priceMax}
                      onChange={(e) => {
                        const val = e.target.value;
                        handleFilterChange('priceMax', val);
                        setPriceRange([priceRange[0], Number(val) || 1000000]);
                      }}
                      placeholder="1 000 000"
                      style={styles.priceInput}
                    />
                  </div>
                </div>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* ============ TRI ============ */}
        <Accordion defaultActiveKey="3" style={styles.accordion}>
          <Accordion.Item eventKey="3">
            <Accordion.Header>Trier par</Accordion.Header>
            <Accordion.Body>
              {sortOptions.map(option => (
                <div
                  key={option.value}
                  onClick={() => handleFilterChange('sortBy', option.value)}
                  style={{
                    ...styles.sortOption,
                    backgroundColor: tempFilters.sortBy === option.value ? '#f0f3ff' : 'transparent',
                    borderColor: tempFilters.sortBy === option.value ? '#667eea' : '#e9ecef'
                  }}
                >
                  <span>{option.label}</span>
                  {tempFilters.sortBy === option.value && (
                    <Check2 size={16} color="#667eea" />
                  )}
                </div>
              ))}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Offcanvas.Body>

      {/* Footer con botones */}
      <div style={styles.footer}>
        <Button
          variant="outline-secondary"
          onClick={resetFilters}
          style={styles.footerButton}
        >
          Réinitialiser
        </Button>
        <Button
          variant="primary"
          onClick={applyFilters}
          style={{...styles.footerButton, ...styles.applyButton}}
        >
          Appliquer les filtres
        </Button>
      </div>
    </Offcanvas>
  );
};

// Styles para react-select
const selectStyles = {
  control: (base) => ({
    ...base,
    borderColor: '#e9ecef',
    borderRadius: '8px',
    minHeight: '38px',
    fontSize: '14px',
    '&:hover': {
      borderColor: '#667eea'
    }
  }),
  menu: (base) => ({
    ...base,
    zIndex: 1050
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#667eea' : state.isFocused ? '#f0f3ff' : 'white',
    color: state.isSelected ? 'white' : '#333',
    fontSize: '14px',
    cursor: 'pointer'
  })
};

const styles = {
  header: {
    padding: '16px',
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
  headerTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: '600'
  },
  badge: {
    backgroundColor: '#667eea',
    color: 'white',
    fontSize: '12px',
    fontWeight: '600',
    padding: '2px 8px',
    borderRadius: '12px',
    marginLeft: '4px'
  },
  headerRight: {
    display: 'flex',
    gap: '8px'
  },
  resetButton: {
    background: 'none',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666'
  },
  closeButton: {
    background: 'none',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    padding: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666'
  },
  body: {
    padding: '16px',
    backgroundColor: '#f8f9fa',
    flex: 1,
    overflowY: 'auto'
  },
  accordion: {
    marginBottom: '16px',
    borderRadius: '10px',
    overflow: 'hidden',
    border: '1px solid #e9ecef'
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
    fontSize: '14px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    marginBottom: '5px',
    color: '#555'
  },
  priceRangeContainer: {
    padding: '10px 0'
  },
  priceInputs: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginTop: '20px'
  },
  priceInputGroup: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '5px'
  },
  priceLabel: {
    fontSize: '13px',
    color: '#666'
  },
  priceInput: {
    flex: 1,
    padding: '6px 8px',
    borderRadius: '6px',
    border: '1px solid #e9ecef',
    fontSize: '13px'
  },
  priceSeparator: {
    color: '#666',
    fontSize: '14px'
  },
  sortOption: {
    padding: '10px 12px',
    border: '1px solid #e9ecef',
    borderRadius: '8px',
    marginBottom: '8px',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px'
  },
  footer: {
    padding: '16px',
    borderTop: '1px solid #e9ecef',
    backgroundColor: 'white',
    display: 'flex',
    gap: '12px'
  },
  footerButton: {
    flex: 1,
    padding: '10px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500'
  },
  applyButton: {
    backgroundColor: '#667eea',
    border: 'none'
  }
};

export default FilterDrawer;