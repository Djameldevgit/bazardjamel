// 📂 pages/MesProductsBoutiques.jsx - VERSIÓN CORREGIDA SIN useParams

import React, { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Spinner, Alert, Container, Row, Col, Button, Badge, Card, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Pencil, Plus, Eye, Filter, Trash } from 'react-bootstrap-icons';
import { FaStore, FaBoxOpen, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import 'moment/locale/fr';

// 🔥 ACCIONES CORRECTAS
import { getUserProducts, deleteBoutiqueProduct } from '../../redux/actions/boutiqueProductAction';
import { getUserBoutiques } from '../../redux/actions/boutiqueAction';

moment.locale('fr');

const MesProductsBoutiques = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  
  const { auth } = useSelector(state => state);
  const { userBoutiques, loading: loadingBoutiques } = useSelector(state => state.boutique || { userBoutiques: [], loading: false });
  
  // 🔥 USAR EL REDUCER CORRECTO
  const { userProducts, loadingProducts } = useSelector(state => state.boutiqueProduct || { 
    userProducts: { products: [], total: 0 }, 
    loadingProducts: false 
  });
  
  const productsList = userProducts?.products || [];
  
  const [refresh, setRefresh] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBoutique, setFilterBoutique] = useState('all');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const productsPerPage = 9;

  // Cargar boutiques del usuario
  useEffect(() => {
    if (auth?.token) {
      console.log('🔄 Cargando boutiques del usuario...');
      dispatch(getUserBoutiques(auth));
    }
  }, [dispatch, auth, refresh]);

  // 🔥 Cargar productos del usuario
  useEffect(() => {
    if (auth?.token) {
      console.log('🔄 Cargando productos del usuario...');
      dispatch(getUserProducts(auth))
        .then((res) => {
          console.log('✅ Productos cargados:', res?.products?.length || 0);
        })
        .catch((err) => {
          console.error('❌ Error cargando productos:', err);
        });
    }
  }, [dispatch, auth, refresh]);

  // Filtrar productos
  useEffect(() => {
    if (productsList && productsList.length > 0) {
      console.log('📊 Filtrando productos. Total:', productsList.length);
      filterProducts(productsList, filterStatus, filterBoutique);
    } else {
      console.log('📊 No hay productos para filtrar');
      setFilteredProducts([]);
    }
  }, [productsList, filterStatus, filterBoutique]);

  const filterProducts = (products, status, boutiqueId) => {
    let filtered = [...products];
    
    if (status === 'pending') {
      filtered = filtered.filter(product => product.pendiente === true);
    }
    
    if (boutiqueId !== 'all') {
      filtered = filtered.filter(product => 
        product.boutique?._id === boutiqueId || 
        product.boutiqueId === boutiqueId
      );
    }
    
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    console.log('📊 Productos después de filtrar:', filtered.length);
    setFilteredProducts(filtered);
    setPage(1);
    setHasMore(filtered.length > productsPerPage);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const handleBoutiqueFilterChange = (boutiqueId) => {
    setFilterBoutique(boutiqueId);
  };

  // 🔥 Eliminar producto
  const handleDeleteProduct = async (product, e) => {
    e.stopPropagation();
    const boutiqueId = product.boutique?._id || product.boutiqueId;
    
    if (window.confirm('Supprimer ce produit ?')) {
      try {
        await dispatch(deleteBoutiqueProduct({ 
          boutiqueId, 
          productId: product._id, 
          auth 
        }));
        setRefresh(prev => !prev);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleViewProduct = (productId) => {
    history.push(`/product/${productId}`);
  };

  const handleEditProduct = (product, e) => {
    e.stopPropagation();
    const boutiqueId = product.boutique?._id || product.boutiqueId;
    history.push(`/edit-boutique-product/${boutiqueId}/${product._id}`);
  };

  const handleCreateProduct = () => {
    if (userBoutiques && userBoutiques.length > 0) {
      // Si tiene boutiques, mostrar selector o ir a la primera
      if (userBoutiques.length === 1) {
        history.push(`/create-boutique-product/${userBoutiques[0]._id}`);
      } else {
        // TODO: Mostrar modal para seleccionar boutique
        history.push(`/create-boutique-product/${userBoutiques[0]._id}`);
      }
    } else {
      alert('Veuillez créer une boutique d\'abord');
      history.push('/create-boutique');
    }
  };

  const isProductPending = (product) => {
    return product.pendiente === true;
  };

  const loadMoreProducts = () => {
    if (filteredProducts.length > page * productsPerPage) {
      setPage(prev => prev + 1);
    } else {
      setHasMore(false);
    }
  };

  const displayedProducts = filteredProducts.slice(0, page * productsPerPage);

  const stats = {
    total: productsList?.length || 0,
    pending: productsList?.filter(p => p.pendiente === true).length || 0,
    approved: productsList?.filter(p => p.pendiente === false).length || 0,
  };

  const CompactProductCard = ({ product }) => {
    const isPending = isProductPending(product);
    const boutiqueName = product.boutique?.nom_boutique || 'Boutique';
    const themeColor = product.boutique?.couleur_theme || '#6366F1';
    
    const getFirstImage = () => {
      if (product.images && product.images.length > 0) {
        const firstImage = product.images[0];
        return typeof firstImage === 'string' ? firstImage : firstImage?.url;
      }
      return null;
    };

    const imageUrl = getFirstImage();

    return (
      <Card 
        className={`border-0 shadow-sm h-100 overflow-hidden ${isPending ? 'pending-card' : 'approved-card'}`}
        style={{ 
          borderRadius: '12px',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          cursor: 'pointer',
          backgroundColor: isPending ? '#fffbea' : '#ffffff'
        }}
        onClick={() => handleViewProduct(product._id)}
      >
        <div className="status-badge">
          {isPending ? (
            <Badge bg="warning" className="px-2 py-1 rounded-pill">
              ⏳ En attente
            </Badge>
          ) : (
            <Badge bg="success" className="px-2 py-1 rounded-pill">
              ✓ Vérifié
            </Badge>
          )}
        </div>
        
        <div className="boutique-badge">
          <Badge style={{ backgroundColor: themeColor, fontSize: '0.65rem' }} className="px-2 py-1 rounded-pill">
            <FaStore size={8} className="me-1" /> {boutiqueName}
          </Badge>
        </div>
        
        <Row className="g-0">
          <Col xs={4} md={4} className="p-2">
            <div className="image-container" style={{ position: 'relative', paddingTop: '100%', overflow: 'hidden', borderRadius: '8px', backgroundColor: '#f5f5f5' }}>
              {imageUrl ? (
                <img src={imageUrl} alt={product.title} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#adb5bd' }}>
                  <FaBoxOpen size={24} />
                </div>
              )}
            </div>
          </Col>
          
          <Col xs={8} md={8}>
            <Card.Body className="p-3">
              <Card.Title className="fw-bold mb-1" style={{ fontSize: '0.95rem', lineHeight: '1.3', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {product.title || 'Produit sans titre'}
              </Card.Title>
              
              {product.price && (
                <div className="fw-bold mb-1" style={{ fontSize: '0.85rem', color: themeColor }}>
                  {product.price.toLocaleString()} DA
                </div>
              )}
              
              <div className="d-flex align-items-center text-muted small">
                <i className="fas fa-calendar-alt me-1" style={{ fontSize: '0.7rem' }}></i>
                <span>{moment(product.createdAt).format('DD/MM/YYYY')}</span>
              </div>
            </Card.Body>
          </Col>
        </Row>
        
        <div className="action-buttons">
          <Button variant="light" size="sm" className="rounded-circle p-1 shadow-sm" onClick={(e) => { e.stopPropagation(); handleViewProduct(product._id); }} title="Voir" style={{ width: '28px', height: '28px', fontSize: '12px' }}>
            <Eye size={12} />
          </Button>
          
          <Button variant="light" size="sm" className="rounded-circle p-1 shadow-sm" onClick={(e) => handleEditProduct(product, e)} title="Modifier" style={{ width: '28px', height: '28px', fontSize: '12px' }}>
            <Pencil size={12} />
          </Button>
          
          <Button variant="danger" size="sm" className="rounded-circle p-1 shadow-sm" onClick={(e) => handleDeleteProduct(product, e)} title="Supprimer" style={{ width: '28px', height: '28px', fontSize: '12px' }}>
            <Trash size={12} />
          </Button>
        </div>
      </Card>
    );
  };

  // Estados de carga
  if ((loadingProducts || loadingBoutiques) && productsList.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement de vos produits...</p>
      </Container>
    );
  }

  if (!auth?.token) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <h4>Authentification requise</h4>
          <p>Veuillez vous connecter pour voir vos produits.</p>
          <Button variant="primary" onClick={() => history.push('/login')}>
            Se connecter
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="mes-products-boutiques-page">
      <Container className="py-2">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h1 className="h3 mb-0 d-flex align-items-center gap-2">
            <FaBoxOpen /> Mes Produits
            <Badge bg="secondary" className="ms-2">{stats.total}</Badge>
          </h1>
          
          <Button variant="primary" className="rounded-pill px-4" onClick={handleCreateProduct} disabled={!userBoutiques || userBoutiques.length === 0}>
            <Plus className="me-1" size={15} />
            Ajouter un produit
          </Button>
        </div>

        <div className="filters-section mb-4">
          <div className="d-flex align-items-center gap-3 flex-wrap">
            <div className="d-flex align-items-center gap-2">
              <Filter className="text-muted" size={18} />
              <span className="text-muted">Filtrer:</span>
            </div>
            
            <Button variant={filterStatus === 'all' ? 'primary' : 'outline-secondary'} size="sm" className="rounded-pill px-3" onClick={() => handleFilterChange('all')}>
              Tous <Badge bg="secondary" className="ms-1">{stats.total}</Badge>
            </Button>
            
            <Button variant={filterStatus === 'pending' ? 'warning' : 'outline-secondary'} size="sm" className="rounded-pill px-3" onClick={() => handleFilterChange('pending')}>
              En attente <Badge bg="warning" className="ms-1">{stats.pending}</Badge>
            </Button>

            {userBoutiques && userBoutiques.length > 1 && (
              <Form.Select size="sm" value={filterBoutique} onChange={(e) => handleBoutiqueFilterChange(e.target.value)} style={{ width: 'auto', minWidth: '180px' }}>
                <option value="all">Toutes les boutiques</option>
                {userBoutiques.map(b => (
                  <option key={b._id} value={b._id}>{b.nom_boutique}</option>
                ))}
              </Form.Select>
            )}
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <InfiniteScroll
            dataLength={displayedProducts.length}
            next={loadMoreProducts}
            hasMore={hasMore}
            loader={
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" size="sm" />
                <p className="mt-2 text-muted small">Chargement...</p>
              </div>
            }
            endMessage={
              displayedProducts.length > 0 && displayedProducts.length >= filteredProducts.length && (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">Vous avez vu tous vos produits</p>
                </div>
              )
            }
          >
            <Row>
              {displayedProducts.map((product) => (
                <Col key={product._id} xs={12} md={6} lg={4} className="mb-4">
                  <CompactProductCard product={product} />
                </Col>
              ))}
            </Row>
          </InfiniteScroll>
        ) : (
          <div className="text-center py-5">
            <div className="empty-state mb-4">
              <FaBoxOpen size={60} className="text-muted" />
            </div>
            <h4 className="h5 mb-2">Aucun produit</h4>
            <p className="text-muted mb-4">
              {filterStatus !== 'all' 
                ? 'Aucun produit en attente de vérification'
                : !userBoutiques || userBoutiques.length === 0
                  ? 'Commencez par créer une boutique'
                  : 'Commencez par ajouter des produits à vos boutiques'}
            </p>
            {!userBoutiques || userBoutiques.length === 0 ? (
              <Button variant="primary" className="rounded-pill px-4" onClick={() => history.push('/create-boutique')}>
                <Plus className="me-2" size={18} />
                Créer une boutique
              </Button>
            ) : (
              <Button variant="primary" className="rounded-pill px-4" onClick={handleCreateProduct}>
                <Plus className="me-2" size={18} />
                Ajouter un produit
              </Button>
            )}
          </div>
        )}
      </Container>

      <style jsx="true">{`
        .pending-card { border-left: 4px solid #ffc107 !important; }
        .approved-card { border-left: 4px solid #198754 !important; }
        .status-badge { position: absolute; top: 8px; left: 8px; z-index: 10; }
        .boutique-badge { position: absolute; top: 8px; right: 8px; z-index: 10; }
        .action-buttons { position: absolute; bottom: 8px; right: 8px; display: flex; gap: 4px; z-index: 10; }
        .action-buttons .btn { width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; background-color: white; border: 1px solid #e9ecef; }
        .action-buttons .btn:hover { transform: scale(1.05); }
        .card { transition: all 0.2s ease; }
        .card:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.12) !important; }
      `}</style>
    </div>
  );
};

export default MesProductsBoutiques;