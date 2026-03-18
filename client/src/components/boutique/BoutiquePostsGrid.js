// components/boutique/sections/BoutiquePostsGrid.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Form, Button, Spinner, Alert, Offcanvas } from 'react-bootstrap';
import { 
  FaFilter, 
  FaThLarge, 
  FaList,
  FaTimes,
  FaSlidersH,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';
import BoutiquePostCard from './boutiquePost/BoutiquePostCard';
import { getBoutiquePosts } from '../../redux/actions/boutiquePostAction';

const BoutiquePostsGrid = ({ boutique }) => {
  const dispatch = useDispatch();
  const { products: boutiqueProducts, loadingProducts } = useSelector(state => state.boutiquePost || {});
  
  // Estados
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [filterPrice, setFilterPrice] = useState({ min: '', max: '' });
  const [filterEtat, setFilterEtat] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);

  // Validación de boutique
  useEffect(() => {
    setHasMounted(true);
    return () => setHasMounted(false);
  }, []);

  // Cargar posts cuando boutique esté disponible
  useEffect(() => {
    if (boutique?._id && hasMounted) {
      console.log('📦 Cargando posts para boutique:', boutique._id);
      dispatch(getBoutiquePosts(boutique._id, page, 12));
    }
  }, [dispatch, boutique?._id, page, hasMounted]);

  // Si boutique no está disponible, mostrar loading o null
  if (!boutique) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando información de la boutique...</p>
      </div>
    );
  }

  // Obtener posts de esta boutique con validación segura
  const boutiqueData = boutiqueProducts?.[boutique._id] || {};
  const posts = boutiqueData.products || [];
  const total = boutiqueData.total || 0;
  const hasMore = boutiqueData.hasMore || false;

  // Opciones de filtro
  const etatOptions = [
    { value: 'neuf', label: 'Neuf' },
    { value: 'comme-neuf', label: 'Comme neuf' },
    { value: 'bon-etat', label: 'Bon état' },
    { value: 'correct', label: 'Correct' }
  ];

  // Ordenar posts
  const getSortedPosts = () => {
    if (!posts.length) return [];
    
    let sorted = [...posts];
    
    switch(sortBy) {
      case 'price_asc':
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price_desc':
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'popular':
        sorted.sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'recent':
      default:
        sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
    }
    
    return sorted;
  };

  // Filtrar posts
  const getFilteredPosts = () => {
    let filtered = getSortedPosts();
    
    // Filtro por precio
    if (filterPrice.min) {
      filtered = filtered.filter(p => (p.price || 0) >= Number(filterPrice.min));
    }
    if (filterPrice.max) {
      filtered = filtered.filter(p => (p.price || 0) <= Number(filterPrice.max));
    }
    
    // Filtro por état
    if (filterEtat.length > 0) {
      filtered = filtered.filter(p => filterEtat.includes(p.etat));
    }
    
    return filtered;
  };

  const handleEtatChange = (etat) => {
    setFilterEtat(prev => 
      prev.includes(etat) 
        ? prev.filter(e => e !== etat)
        : [...prev, etat]
    );
  };

  const clearFilters = () => {
    setFilterPrice({ min: '', max: '' });
    setFilterEtat([]);
    setSortBy('recent');
  };

  const displayedPosts = getFilteredPosts();
  const activeFiltersCount = [
    filterPrice.min || filterPrice.max ? 1 : 0,
    filterEtat.length > 0 ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

  // Componente de filtros (reutilizable)
  const FiltersContent = () => (
    <div className="filters-content">
      {/* Filtro de precio */}
      <div className="filter-section mb-4">
        <h6 className="fw-bold mb-3">Prix</h6>
        <div className="d-flex gap-2">
          <Form.Control
            type="number"
            size="sm"
            value={filterPrice.min}
            onChange={(e) => setFilterPrice({...filterPrice, min: e.target.value})}
            placeholder="Min (DA)"
            className="filter-input"
          />
          <Form.Control
            type="number"
            size="sm"
            value={filterPrice.max}
            onChange={(e) => setFilterPrice({...filterPrice, max: e.target.value})}
            placeholder="Max (DA)"
            className="filter-input"
          />
        </div>
      </div>

      {/* Filtro de état */}
      <div className="filter-section mb-4">
        <h6 className="fw-bold mb-3">État</h6>
        {etatOptions.map(option => (
          <Form.Check
            key={option.value}
            type="checkbox"
            id={`etat-${option.value}`}
            label={option.label}
            checked={filterEtat.includes(option.value)}
            onChange={() => handleEtatChange(option.value)}
            className="mb-2 filter-checkbox"
          />
        ))}
      </div>

      {/* Filtro de ordenamiento */}
      <div className="filter-section mb-4">
        <h6 className="fw-bold mb-3">Trier par</h6>
        <Form.Select 
          size="sm"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="filter-select"
        >
          <option value="recent">Plus récents</option>
          <option value="price_asc">Prix croissant</option>
          <option value="price_desc">Prix décroissant</option>
          <option value="popular">Plus populaires</option>
        </Form.Select>
      </div>

      {/* Botón limpiar filtros */}
      {activeFiltersCount > 0 && (
        <Button 
          variant="link" 
          size="sm" 
          onClick={clearFilters}
          className="p-0 text-decoration-none"
          style={{ color: boutique?.couleur_theme || '#6366F1' }}
        >
          <FaTimes className="me-1" />
          Effacer les filtres ({activeFiltersCount})
        </Button>
      )}
    </div>
  );

  if (loadingProducts && posts.length === 0) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement des produits...</p>
      </div>
    );
  }

  return (
    <div className="boutique-posts-grid">
      {/* Header responsive */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h4 className="mb-1">Nos produits</h4>
          <small className="text-muted">
            {displayedPosts.length} sur {total} produit{total > 1 ? 's' : ''}
          </small>
        </div>
        
        <div className="d-flex gap-2 flex-wrap">
          {/* Botón de filtros para móvil */}
          <Button
            variant="outline-secondary"
            size="sm"
            className="d-md-none"
            onClick={() => setShowMobileFilters(true)}
          >
            <FaSlidersH className="me-1" />
            Filtres
            {activeFiltersCount > 0 && (
              <span className="ms-1 badge bg-primary rounded-pill">
                {activeFiltersCount}
              </span>
            )}
          </Button>

          {/* Botón de filtros para desktop */}
          <Button
            variant="outline-secondary"
            size="sm"
            className="d-none d-md-flex align-items-center"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FaFilter className="me-1" />
            Filtres
            {isFilterOpen ? <FaChevronUp className="ms-2" size={12} /> : <FaChevronDown className="ms-2" size={12} />}
          </Button>
          
          {/* Toggle vista grid/lista */}
          <div className="btn-group">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline-secondary'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="d-flex align-items-center"
            >
              <FaThLarge />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline-secondary'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="d-flex align-items-center"
            >
              <FaList />
            </Button>
          </div>
        </div>
      </div>

      {/* Layout principal */}
      <Row>
        {/* Sidebar de filtros para desktop */}
        {isFilterOpen && (
          <Col lg={3} className="d-none d-lg-block">
            <div className="filters-sidebar p-4 bg-light rounded-3 sticky-top" style={{ top: '90px' }}>
              <h5 className="mb-4 d-flex align-items-center">
                <FaFilter className="me-2" size={16} />
                Filtres
              </h5>
              <FiltersContent />
            </div>
          </Col>
        )}

        {/* Grid de productos */}
        <Col lg={isFilterOpen ? 9 : 12}>
          {displayedPosts.length > 0 ? (
            <>
              <Row className={viewMode === 'grid' ? 'g-4' : ''}>
                {displayedPosts.map(post => (
                  <Col 
                    key={post._id} 
                    {...(viewMode === 'grid' 
                      ? { 
                          xl: isFilterOpen ? 4 : 3,
                          lg: isFilterOpen ? 6 : 4, 
                          md: 6, 
                          sm: 6 
                        } 
                      : { xs: 12 }
                    )}
                    className="mb-4"
                  >
                    {viewMode === 'grid' ? (
                      <BoutiquePostCard post={post} boutique={boutique} />
                    ) : (
                      <div className="list-view-item border rounded-3 p-3 hover-shadow transition">
                        <Row className="align-items-center">
                          <Col md={3}>
                            <img
                              src={post.images?.[0]?.url || post.images?.[0] || '/placeholder.jpg'}
                              alt={post.title}
                              className="w-100 rounded-3"
                              style={{ height: '120px', objectFit: 'cover' }}
                            />
                          </Col>
                          <Col md={6}>
                            <h5 className="mb-2">{post.title}</h5>
                            <p className="text-muted small mb-2">
                              {post.description?.substring(0, 150)}...
                            </p>
                            <div className="d-flex gap-3 text-muted small">
                              <span>👁️ {post.views || 0}</span>
                              <span>❤️ {post.likes?.length || 0}</span>
                              <span>💬 {post.comments?.length || 0}</span>
                            </div>
                          </Col>
                          <Col md={3} className="text-md-end">
                            <h4 className="text-primary mb-3">
                              {post.price?.toLocaleString()} DA
                            </h4>
                            <Button 
                              variant="outline-primary" 
                              size="sm"
                              style={{
                                borderColor: boutique?.couleur_theme || '#6366F1',
                                color: boutique?.couleur_theme || '#6366F1'
                              }}
                              onClick={() => window.location.href = `/post/${post._id}`}
                            >
                              Voir détails
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    )}
                  </Col>
                ))}
              </Row>

              {/* Botón cargar más */}
              {hasMore && (
                <div className="text-center mt-4">
                  <Button
                    variant="outline-primary"
                    onClick={handleLoadMore}
                    disabled={loadingProducts}
                    style={{
                      borderColor: boutique?.couleur_theme || '#6366F1',
                      color: boutique?.couleur_theme || '#6366F1',
                      padding: '0.6rem 2rem',
                      borderRadius: '30px'
                    }}
                  >
                    {loadingProducts ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Chargement...
                      </>
                    ) : (
                      'Charger plus de produits'
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <Alert variant="info" className="text-center py-5 rounded-3">
              <h5>Aucun produit disponible</h5>
              <p className="mb-0">Cette boutique n'a pas encore de produits.</p>
            </Alert>
          )}
        </Col>
      </Row>

      {/* Offcanvas para filtres mobiles */}
      <Offcanvas 
        show={showMobileFilters} 
        onHide={() => setShowMobileFilters(false)}
        placement="start"
        className="mobile-filters"
        style={{ width: '300px' }}
      >
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title>
            <FaFilter className="me-2" />
            Filtres
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="p-4">
          <FiltersContent />
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

export default BoutiquePostsGrid;