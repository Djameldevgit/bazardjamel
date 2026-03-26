// components/boutique/sections/BoutiqueProductsGrid.jsx

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Form, Button, Spinner, Offcanvas, Badge, Accordion } from 'react-bootstrap';
import { 
  FaFilter, FaThLarge, FaList, FaTimes, FaSlidersH, FaChevronDown, FaChevronUp,
  FaBoxOpen, FaStore, FaBuilding, FaCar, FaTshirt, FaTv, FaMobile, FaCouch,
  FaUtensils, FaTools, FaSearch, FaTag, FaCheck, FaMapMarkerAlt, FaMoneyBillWave, FaStar
} from 'react-icons/fa';

import BoutiqueProductCard from './BoutiqueProductCard';
import { getBoutiqueProducts, resetBoutiqueProducts } from '../../redux/actions/boutiqueProductAction';

const getCategoryIcon = (categorySlug) => {
  const icons = {
    'agences-immobilieres': FaBuilding,
    'promotions-immobilieres': FaBuilding,
    'showroom-automobiles': FaCar,
    'showroom-moto': FaCar,
    'vetements-accessoires-mode': FaTshirt,
    'magasin-electromenager': FaTv,
    'telephones-accessoires': FaMobile,
    'maison-meubles': FaCouch,
    'restaurants-salles-fetes': FaUtensils,
    'outillages-quincaillerie': FaTools
  };
  return icons[categorySlug] || FaStore;
};

const BoutiqueProductsGrid = ({ boutique }) => {
  const dispatch = useDispatch();
  
  // 🔥 LOG 1: Verificar boutique recibida
  console.log('🏪 [GRID] Boutique recibida:', {
    id: boutique?._id,
    nom: boutique?.nom_boutique,
    stats: boutique?.stats
  });
  
  // 🔥 CORREGIDO: Usar state.boutiqueProduct
  const { products: boutiqueProducts, loadingProducts } = useSelector(state => {
    console.log('📦 [GRID] Estado Redux boutiqueProduct:', state.boutiqueProduct);
    return state.boutiqueProduct || {};
  });
  
  const { categories: allCategories = [] } = useSelector(state => state.categories || {});
  
  // 🔥 LOG 2: Verificar datos de la boutique en Redux
  useEffect(() => {
    console.log('📦 [GRID] boutiqueProducts completo:', boutiqueProducts);
    if (boutique?._id) {
      console.log('📦 [GRID] Datos para boutique:', boutique._id, boutiqueProducts?.[boutique._id]);
    }
  }, [boutiqueProducts, boutique]);
  
  // Estados UI
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  
  // FILTROS
  const [filters, setFilters] = useState({
    search: '',
    categories: [],
    subCategories: [],
    articleType: 'all',
    minPrice: '',
    maxPrice: '',
    etat: [],
    wilaya: ''
  });
  const [dynamicFilters, setDynamicFilters] = useState({});
  
  const loaderRef = useRef(null);
  const filtersRef = useRef({ ...filters, dynamicFilters });
  const sortByRef = useRef(sortBy);
  
  useEffect(() => {
    filtersRef.current = { ...filters, dynamicFilters };
  }, [filters, dynamicFilters]);
  
  useEffect(() => {
    sortByRef.current = sortBy;
  }, [sortBy]);
  
  // 🔥 CORREGIDO: Leer "products" del estado
  const boutiqueData = boutiqueProducts?.[boutique?._id] || {};
  const products = boutiqueData.products || [];  // 👈 DEBE SER "products"
  const total = boutiqueData.total || 0;
  const hasMore = boutiqueData.hasMore !== undefined ? boutiqueData.hasMore : true;
  const currentPage = boutiqueData.page || 1;
  
  // 🔥 LOG 3: Verificar datos extraídos
  console.log('🎯 [GRID] Datos extraídos:', {
    boutiqueData,
    productsLength: products.length,
    total,
    hasMore,
    currentPage
  });
  
  const availableDynamicFields = boutiqueData.availableFields || [];
  const dynamicFieldValues = boutiqueData.fieldValues || {};
  
  // Detectar categoría de la boutique
  const boutiqueCategory = useMemo(() => {
    if (!boutique?.categorie) return null;
    let category = allCategories.find(cat => cat.slug === boutique.categorie);
    if (!category) category = allCategories.find(cat => cat._id === boutique.categorie);
    if (!category) {
      category = {
        _id: boutique.categorie,
        slug: boutique.categorie,
        name: boutique.categorieName || boutique.categorie,
        icon: boutique.categorieIcon || 'fa-store',
        parent: null
      };
    }
    return category;
  }, [boutique?.categorie, allCategories]);
  
  // Obtener subcategorías disponibles
  const availableSubCategories = useMemo(() => {
    if (!boutiqueCategory) return [];
    return allCategories.filter(cat => {
      const parentId = cat.parentId || cat.parent;
      const categoryId = boutiqueCategory._id || boutiqueCategory.slug;
      return parentId === categoryId;
    });
  }, [boutiqueCategory, allCategories]);
  
  // Tipos de artículo disponibles
  const availableArticleTypes = useMemo(() => {
    if (boutique?.articleType && boutique.articleType !== 'mixed') {
      const typeMap = {
        'product': { value: 'product', label: '📦 Produit physique' },
        'service': { value: 'service', label: '⚙️ Service' },
        'digital': { value: 'digital', label: '💻 Produit digital' }
      };
      return [typeMap[boutique.articleType]].filter(Boolean);
    }
    return [
      { value: 'product', label: '📦 Produit physique' },
      { value: 'service', label: '⚙️ Service' },
      { value: 'digital', label: '💻 Produit digital' }
    ];
  }, [boutique?.articleType]);
  
  // Preseleccionar categoría
  useEffect(() => {
    if (boutiqueCategory && filters.categories.length === 0) {
      setFilters(prev => ({
        ...prev,
        categories: [boutiqueCategory.slug || boutiqueCategory._id]
      }));
    }
  }, [boutiqueCategory]);
  
  // Cargar productos
  const loadProducts = useCallback(async (pageNum, reset = false) => {
    if (!boutique?._id) return;
    if (isFetching && !reset) return;
    
    setIsFetching(true);
    
    try {
      const allFilters = {
        ...filtersRef.current,
        sort: sortByRef.current,
        page: pageNum,
        limit: 12
      };
      
      console.log(`📦 [GRID] Cargando página ${pageNum} - Reset: ${reset}`, allFilters);
      
      await dispatch(getBoutiqueProducts(boutique._id, allFilters, reset));
    } catch (error) {
      console.error('❌ Error loading products:', error);
    } finally {
      setIsFetching(false);
    }
  }, [dispatch, boutique?._id, isFetching]);
  
  // Cargar productos iniciales
  useEffect(() => {
    if (!boutique?._id) return;
    
    const filtersString = JSON.stringify({ ...filters, dynamicFilters });
    const prevFiltersString = localStorage.getItem(`filters_${boutique._id}`);
    const filtersReallyChanged = filtersString !== prevFiltersString;
    
    if (filtersReallyChanged || !initialLoadDone) {
      console.log('🔄 [GRID] Filtros cambiados o carga inicial, reiniciando...');
      localStorage.setItem(`filters_${boutique._id}`, filtersString);
      dispatch(resetBoutiqueProducts(boutique._id));
      setInitialLoadDone(true);
      loadProducts(1, true);
    }
  }, [boutique?._id, filters, dynamicFilters, initialLoadDone, dispatch, loadProducts]);
  
  // Scroll infinito
  useEffect(() => {
    if (!loaderRef.current || !hasMore || loadingProducts || isFetching) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingProducts && !isFetching) {
          const nextPage = currentPage + 1;
          console.log('📜 [GRID] Scroll infinito: cargando página', nextPage);
          loadProducts(nextPage, false);
        }
      },
      { root: null, rootMargin: '200px', threshold: 0.1 }
    );
    
    observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loaderRef.current, hasMore, loadingProducts, isFetching, currentPage, loadProducts]);
  
  // Handlers de filtros (simplificados)
  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      switch(filterType) {
        case 'categories':
          return { ...prev, categories: prev.categories.includes(value) ? prev.categories.filter(c => c !== value) : [...prev.categories, value], subCategories: [] };
        case 'subCategories':
          return { ...prev, subCategories: prev.subCategories.includes(value) ? prev.subCategories.filter(s => s !== value) : [...prev.subCategories, value] };
        case 'articleType':
          return { ...prev, articleType: value };
        case 'price':
          return { ...prev, ...value };
        case 'etat':
          return { ...prev, etat: prev.etat.includes(value) ? prev.etat.filter(e => e !== value) : [...prev.etat, value] };
        case 'search':
          return { ...prev, search: value };
        case 'wilaya':
          return { ...prev, wilaya: value };
        default:
          return prev;
      }
    });
  };
  
  const handleDynamicFilterChange = (fieldName, value) => {
    setDynamicFilters(prev => {
      const currentValues = prev[fieldName] || [];
      const newValues = currentValues.includes(value) ? currentValues.filter(v => v !== value) : [...currentValues, value];
      return { ...prev, [fieldName]: newValues.length > 0 ? newValues : undefined };
    });
  };
  
  const clearFilters = () => {
    setFilters({
      search: '',
      categories: boutiqueCategory ? [boutiqueCategory.slug || boutiqueCategory._id] : [],
      subCategories: [],
      articleType: 'all',
      minPrice: '',
      maxPrice: '',
      etat: [],
      wilaya: ''
    });
    setDynamicFilters({});
  };
  
  const activeFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categories.length > (boutiqueCategory ? 1 : 0)) count++;
    if (filters.subCategories.length > 0) count++;
    if (filters.articleType !== 'all') count++;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.etat.length > 0) count++;
    if (filters.wilaya) count++;
    Object.values(dynamicFilters).forEach(values => { if (values?.length > 0) count++; });
    return count;
  };
  
  const etatOptions = [
    { value: 'neuf', label: 'Neuf' },
    { value: 'comme-neuf', label: 'Comme neuf' },
    { value: 'bon-etat', label: 'Bon état' },
    { value: 'correct', label: 'Correct' }
  ];
  
  const wilayas = [
    'Adrar', 'Chlef', 'Laghouat', 'Oum El Bouaghi', 'Batna', 'Béjaïa', 'Biskra', 'Béchar',
    'Blida', 'Bouira', 'Tamanrasset', 'Tébessa', 'Tlemcen', 'Tiaret', 'Tizi Ouzou', 'Alger',
    'Djelfa', 'Jijel', 'Sétif', 'Saïda', 'Skikda', 'Sidi Bel Abbès', 'Annaba', 'Guelma',
    'Constantine', 'Médéa', 'Mostaganem', 'M\'Sila', 'Mascara', 'Ouargla', 'Oran', 'El Bayadh',
    'Illizi', 'Bordj Bou Arréridj', 'Boumerdès', 'El Tarf', 'Tindouf', 'Tissemsilt', 'El Oued',
    'Khenchela', 'Souk Ahras', 'Tipaza', 'Mila', 'Aïn Defla', 'Naâma', 'Aïn Témouchent',
    'Ghardaïa', 'Relizane'
  ];
  
  // Componente de filtros (simplificado)
  const FiltersContent = () => {
    const CategoryIcon = boutiqueCategory ? getCategoryIcon(boutiqueCategory.slug) : FaStore;
    
    return (
      <div className="filters-content">
        <div className="filter-section mb-4">
          <Form.Control
            type="text"
            placeholder={`🔍 Rechercher dans ${boutique?.nom_boutique || 'la boutique'}...`}
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="border rounded-pill py-2 px-3"
          />
        </div>
        
        {boutiqueCategory && (
          <div className="filter-section mb-4">
            <h6 className="fw-bold mb-3"><FaStore className="me-2" size={14} />Catégorie</h6>
            <div className="p-3 rounded-3" style={{ backgroundColor: `${boutique?.couleur_theme || '#6366F1'}10`, borderLeft: `3px solid ${boutique?.couleur_theme || '#6366F1'}` }}>
              <div className="d-flex align-items-center">
                <div className="me-3 d-flex align-items-center justify-content-center" style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: boutique?.couleur_theme || '#6366F1', color: 'white' }}>
                  <CategoryIcon size={24} />
                </div>
                <div><strong className="d-block">{boutiqueCategory.name}</strong></div>
              </div>
            </div>
          </div>
        )}
        
        {/* ... resto de filtros (subcategorías, tipo artículo, etc.) ... */}
        
        {activeFiltersCount() > 0 && (
          <Button variant="link" onClick={clearFilters} className="p-0 text-decoration-none mt-2" style={{ color: boutique?.couleur_theme || '#6366F1' }}>
            <FaTimes className="me-1" />Effacer tous les filtres ({activeFiltersCount()})
          </Button>
        )}
      </div>
    );
  };
  
  if (!boutique) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement de la boutique...</p>
      </div>
    );
  }
  
  if (loadingProducts && products.length === 0 && !initialLoadDone) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement des produits...</p>
      </div>
    );
  }
  
  // 🔥 LOG FINAL antes de renderizar
  console.log('🎨 [GRID] Renderizando con:', {
    productsCount: products.length,
    total,
    hasMore
  });
  
  return (
    <div className="boutique-products-grid">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
        <h4 className="mb-1 d-flex align-items-center flex-wrap gap-2">
  <span>Nos produits</span>
  {boutiqueCategory && (
    <span 
      className="badge d-inline-flex align-items-center gap-2" 
      style={{
        backgroundColor: `${boutique?.couleur_theme || '#6366F1'}15`,
        color: boutique?.couleur_theme || '#6366F1',
        fontSize: '14px', 
        padding: '6px 12px',
        border: `1px solid ${boutique?.couleur_theme || '#6366F1'}30`
      }}
    >
      {(() => {
        const Icon = getCategoryIcon(boutiqueCategory.slug);
        return <Icon size={12} className="me-1" />;
      })()}
      {boutiqueCategory.name}
    </span>
  )}
</h4>
          <small className="text-muted">{products.length} sur {total} produit{total > 1 ? 's' : ''}</small>
        </div>
        
        <div className="d-flex gap-2 flex-wrap justify-content-between justify-content-md-end">
          <Button variant="outline-secondary" size="sm" className="d-md-none order-2" onClick={() => setShowMobileFilters(true)} style={{ borderRadius: '30px' }}>
            <FaSlidersH className="me-1" />Filtres{activeFiltersCount() > 0 && <Badge bg="primary" className="ms-1 rounded-pill">{activeFiltersCount()}</Badge>}
          </Button>
          
          <div className="btn-group order-1">
            <Button variant={viewMode === 'grid' ? 'primary' : 'outline-secondary'} size="sm" onClick={() => setViewMode('grid')} style={viewMode === 'grid' ? { backgroundColor: boutique?.couleur_theme, borderColor: boutique?.couleur_theme } : {}}><FaThLarge /></Button>
            <Button variant={viewMode === 'list' ? 'primary' : 'outline-secondary'} size="sm" onClick={() => setViewMode('list')} style={viewMode === 'list' ? { backgroundColor: boutique?.couleur_theme, borderColor: boutique?.couleur_theme } : {}}><FaList /></Button>
          </div>
          
          <Form.Select size="sm" value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={{ width: 'auto', minWidth: '150px' }}>
            <option value="recent">📅 Plus récents</option>
            <option value="price_asc">💰 Prix croissant</option>
            <option value="price_desc">💰 Prix décroissant</option>
            <option value="popular">⭐ Plus populaires</option>
            <option value="score">🏆 Meilleur score</option>
          </Form.Select>
          
          <Button variant="outline-secondary" size="sm" className="d-none d-md-flex align-items-center" onClick={() => setIsFilterOpen(!isFilterOpen)}>
            <FaFilter className="me-1" />Filtres{activeFiltersCount() > 0 && <Badge bg="primary" className="ms-1">{activeFiltersCount()}</Badge>}{isFilterOpen ? <FaChevronUp className="ms-2" size={12} /> : <FaChevronDown className="ms-2" size={12} />}
          </Button>
        </div>
      </div>
      
      <Row>
        {isFilterOpen && (
          <Col lg={3} className="d-none d-lg-block">
            <div className="filters-sidebar p-4 bg-light rounded-3 sticky-top" style={{ top: '90px' }}>
              <h5 className="mb-4 d-flex align-items-center"><FaFilter className="me-2" size={16} />Filtres{activeFiltersCount() > 0 && <Badge bg="primary" className="ms-2">{activeFiltersCount()}</Badge>}</h5>
              <FiltersContent />
            </div>
          </Col>
        )}
        
        <Col lg={isFilterOpen ? 9 : 12}>
          {products.length > 0 ? (
            <>
              <Row className={viewMode === 'grid' ? 'g-4' : ''}>
                {products.map(product => (
                  <Col key={product._id} {...(viewMode === 'grid' ? { xl: isFilterOpen ? 4 : 3, lg: isFilterOpen ? 6 : 4, md: 6, sm: 6, xs: 12 } : { xs: 12 })} className="mb-4">
                    <BoutiqueProductCard post={product} boutique={boutique} />
                  </Col>
                ))}
              </Row>
              
              {hasMore && (
                <div ref={loaderRef} className="text-center py-4">
                  {(loadingProducts || isFetching) ? <><Spinner animation="border" size="sm" className="me-2" /><span className="text-muted">Chargement...</span></> : <span className="text-muted small">↓ Scroll pour charger plus</span>}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-5">
              <FaBoxOpen size={48} className="text-muted mb-3" />
              <h5 className="text-muted">Aucun produit disponible</h5>
              <p className="text-muted">{activeFiltersCount() > 0 ? 'Aucun produit ne correspond à vos filtres.' : `Cette boutique n'a pas encore de produits.`}</p>
              {activeFiltersCount() > 0 && <Button variant="link" onClick={clearFilters}>Effacer tous les filtres</Button>}
            </div>
          )}
        </Col>
      </Row>
      
      <Offcanvas show={showMobileFilters} onHide={() => setShowMobileFilters(false)} placement="start" style={{ width: '320px' }}>
        <Offcanvas.Header closeButton className="border-bottom"><Offcanvas.Title><FaFilter className="me-2" />Filtres{activeFiltersCount() > 0 && <Badge bg="primary" className="ms-2">{activeFiltersCount()}</Badge>}</Offcanvas.Title></Offcanvas.Header>
        <Offcanvas.Body><FiltersContent /></Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default BoutiqueProductsGrid;