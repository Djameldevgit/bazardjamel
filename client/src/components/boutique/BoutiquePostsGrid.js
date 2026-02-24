// components/boutique/sections/BoutiquePostsGrid.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Form, Button, Spinner, Alert } from 'react-bootstrap';
import { FaFilter, FaSort, FaThLarge, FaList } from 'react-icons/fa';
import BoutiquePostCard from './BoutiquePostCard';
import { getBoutiquePosts } from '../../redux/actions/boutiqueAction';

const BoutiquePostsGrid = ({ boutique }) => {
  const dispatch = useDispatch();
  const { boutiqueProducts, loadingProducts } = useSelector(state => state.boutique);
  
  const [viewMode, setViewMode] = useState('grid'); // 'grid' o 'list'
  const [sortBy, setSortBy] = useState('recent');
  const [filterPrice, setFilterPrice] = useState({ min: '', max: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  // Obtener posts de esta boutique
  const boutiqueData = boutiqueProducts?.[boutique._id] || {};
  const posts = boutiqueData.products || [];
  const total = boutiqueData.total || 0;
  const hasMore = boutiqueData.hasMore || false;

  useEffect(() => {
    if (boutique._id) {
      dispatch(getBoutiquePosts(boutique._id, page, 12));
    }
  }, [dispatch, boutique._id, page]);

  // Ordenar posts
  const getSortedPosts = () => {
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

  // Filtrar posts por precio
  const getFilteredPosts = () => {
    let filtered = getSortedPosts();
    
    if (filterPrice.min) {
      filtered = filtered.filter(p => (p.price || 0) >= Number(filterPrice.min));
    }
    if (filterPrice.max) {
      filtered = filtered.filter(p => (p.price || 0) <= Number(filterPrice.max));
    }
    
    return filtered;
  };

  const displayedPosts = getFilteredPosts();

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
  };

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
      {/* Header con título y contador */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">Nos produits</h4>
          <small className="text-muted">
            {total} produit{total > 1 ? 's' : ''} disponible{total > 1 ? 's' : ''}
          </small>
        </div>
        
        <div className="d-flex gap-2">
          {/* Botón de filtros */}
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <FaFilter className="me-1" />
            Filtres
          </Button>
          
          {/* Selector de ordenamiento */}
          <Form.Select 
            size="sm"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="recent">Plus récents</option>
            <option value="price_asc">Prix croissant</option>
            <option value="price_desc">Prix décroissant</option>
            <option value="popular">Plus populaires</option>
          </Form.Select>
          
          {/* Toggle vista grid/lista */}
          <div className="btn-group" size="sm">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'outline-secondary'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <FaThLarge />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'outline-secondary'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <FaList />
            </Button>
          </div>
        </div>
      </div>

      {/* Panel de filtros */}
      {showFilters && (
        <div className="filters-panel bg-light p-3 rounded mb-4">
          <Row>
            <Col md={6}>
              <label className="small text-muted">Prix minimum (DA)</label>
              <Form.Control
                type="number"
                size="sm"
                value={filterPrice.min}
                onChange={(e) => setFilterPrice({...filterPrice, min: e.target.value})}
                placeholder="0"
              />
            </Col>
            <Col md={6}>
              <label className="small text-muted">Prix maximum (DA)</label>
              <Form.Control
                type="number"
                size="sm"
                value={filterPrice.max}
                onChange={(e) => setFilterPrice({...filterPrice, max: e.target.value})}
                placeholder="100000"
              />
            </Col>
          </Row>
        </div>
      )}

      {/* Grid/Lista de productos */}
      {displayedPosts.length > 0 ? (
        <>
          <Row className={viewMode === 'grid' ? 'g-4' : ''}>
            {displayedPosts.map(post => (
              <Col 
                key={post._id} 
                {...(viewMode === 'grid' ? { md: 4, sm: 6 } : { xs: 12 })}
                className="mb-4"
              >
                {viewMode === 'grid' ? (
                  <BoutiquePostCard post={post} boutique={boutique} />
                ) : (
                  // Vista de lista (podemos crear un componente aparte si es necesario)
                  <div className="list-view-item border rounded p-3">
                    <Row>
                      <Col md={3}>
                        <img
                          src={post.images?.[0]?.url || post.images?.[0] || '/placeholder.jpg'}
                          alt={post.title}
                          style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                      </Col>
                      <Col md={9}>
                        <h5>{post.title}</h5>
                        <p className="text-muted small">{post.description?.substring(0, 100)}...</p>
                        <div className="d-flex justify-content-between">
                          <strong>{post.price?.toLocaleString()} DA</strong>
                          <Button size="sm" variant="outline-primary">Voir</Button>
                        </div>
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
        <Alert variant="info" className="text-center py-5">
          <h5>Aucun produit disponible</h5>
          <p className="mb-0">Cette boutique n'a pas encore de produits.</p>
        </Alert>
      )}
    </div>
  );
};

export default BoutiquePostsGrid;