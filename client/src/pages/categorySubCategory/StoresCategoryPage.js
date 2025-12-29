// StoresCategoryPage.js - Página específica para stores
import React, { useState, useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { FaStore, FaEye, FaHeart, FaShoppingBag, FaMapMarkerAlt } from 'react-icons/fa';

const StoresCategoryPage = () => {
    const { categoryName } = useParams();
    const history = useHistory();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(parseInt(queryParams.get('page')) || 1);
    const [pages, setPages] = useState(1);
    
    useEffect(() => {
        fetchStores();
    }, [categoryName, page]);
    
    const fetchStores = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Usar el endpoint específico para stores
            const url = categoryName && categoryName !== 'stores' 
            ? `/api/stores/public/category/${categoryName}?page=${page}&limit=12`
            : `/api/stores/public/all?page=${page}&limit=12`;
          
          console.log('🔄 Fetching stores from:', url);
          
          const response = await fetch(url);
          const data = await response.json();
          
          if (data.success) {
            setStores(data.stores || []);
            setTotal(data.total || 0);
            setPages(data.pages || 1);
            console.log(`✅ Found ${data.total} stores`);
          } else {
            setError(data.msg || 'Error al cargar las boutiques');
          }
        } catch (err) {
            setError('Error de conexión al servidor');
            console.error('❌ Error fetching stores:', err);
        } finally {
            setLoading(false);
        }
    };
    
    const handleStoreClick = (storeId) => {
        history.push(`/store/${storeId}`);
    };
    
    if (loading) {
        return (
            <Container className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Chargement des boutiques...</p>
            </Container>
        );
    }
    
    if (error) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">
                    <FaStore className="me-2" />
                    {error}
                </Alert>
            </Container>
        );
    }
    
    if (stores.length === 0) {
        return (
            <Container className="py-5">
                <Card className="text-center shadow-sm border-0">
                    <Card.Body className="py-5">
                        <FaStore size={64} className="text-muted mb-4" />
                        <h4 className="mb-3">Aucune boutique trouvée</h4>
                        <p className="text-muted mb-4">
                            {categoryName && categoryName !== 'stores' 
                                ? `Aucune boutique dans la catégorie "${categoryName}"`
                                : 'Aucune boutique disponible pour le moment.'
                            }
                        </p>
                        <Button 
                            variant="primary"
                            onClick={() => history.push('/stores')}
                        >
                            Voir toutes les boutiques
                        </Button>
                    </Card.Body>
                </Card>
            </Container>
        );
    }
    
    return (
        <Container fluid="lg" className="py-4">
            {/* Header */}
            <div className="mb-5">
                <h1 className="display-5 fw-bold mb-3">
                    <FaStore className="me-3 text-primary" />
                    {categoryName && categoryName !== 'stores' 
                        ? `Boutiques - ${categoryName}`
                        : 'Toutes les Boutiques'
                    }
                </h1>
                <div className="d-flex justify-content-between align-items-center">
                    <p className="lead text-muted mb-0">
                        Découvrez les meilleures boutiques professionnelles
                    </p>
                    <Badge bg="primary" className="fs-6 px-3 py-2">
                        {total} {total === 1 ? 'boutique' : 'boutiques'}
                    </Badge>
                </div>
            </div>
            
            {/* Stores Grid */}
            <Row className="g-4">
                {stores.map(store => (
                    <Col key={store._id} lg={4} md={6}>
                        <Card 
                            className="h-100 shadow-sm border-0 hover-lift cursor-pointer"
                            onClick={() => handleStoreClick(store._id)}
                        >
                            <Card.Body>
                                <div className="d-flex align-items-start mb-3">
                                    {store.storeInfo?.logoUrl ? (
                                        <img 
                                            src={store.storeInfo.logoUrl} 
                                            alt={store.title}
                                            className="rounded-circle me-3"
                                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                                             style={{ width: '60px', height: '60px' }}>
                                            <FaStore size={24} />
                                        </div>
                                    )}
                                    <div className="flex-grow-1">
                                        <h5 className="mb-1">{store.title}</h5>
                                        <div className="d-flex align-items-center mb-2">
                                            <Badge bg={store.storeInfo?.plan === 'Premium' ? 'warning' : 
                                                      store.storeInfo?.plan === 'Pro' ? 'info' : 'secondary'}
                                                   className="me-2">
                                                {store.storeInfo?.plan || 'Free'}
                                            </Badge>
                                            <span className="text-muted small">
                                                {store.storeInfo?.category || 'Général'}
                                            </span>
                                        </div>
                                        {store.user?.name && (
                                            <p className="text-muted small mb-0">
                                                <i className="fas fa-user me-1"></i>
                                                {store.user.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                
                                <p className="text-muted small mb-4">
                                    {store.description?.substring(0, 120) || 'Boutique professionnelle.'}
                                    {store.description?.length > 120 ? '...' : ''}
                                </p>
                                
                                {/* Stats */}
                                <div className="d-flex justify-content-between small text-muted mb-3">
                                    <div className="d-flex align-items-center">
                                        <FaEye className="me-1" />
                                        <span>{store.storeInfo?.stats?.totalViews || 0}</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <FaHeart className="me-1 text-danger" />
                                        <span>{store.storeInfo?.stats?.totalFavorites || 0}</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <FaShoppingBag className="me-1" />
                                        <span>{store.storeInfo?.stats?.totalProducts || 0} produits</span>
                                    </div>
                                </div>
                                
                                {/* Location */}
                                {store.location && store.location !== 'Non spécifié' && (
                                    <div className="d-flex align-items-center mt-3 pt-3 border-top">
                                        <FaMapMarkerAlt className="me-2 text-muted" />
                                        <span className="small text-muted">
                                            {store.location}
                                        </span>
                                    </div>
                                )}
                            </Card.Body>
                            
                            <Card.Footer className="bg-transparent border-top-0 pt-0">
                                <div className="d-flex justify-content-between align-items-center">
                                    <small className="text-muted">
                                        Créée le {new Date(store.createdAt).toLocaleDateString('fr-FR')}
                                    </small>
                                    <Button 
                                        variant="outline-primary" 
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStoreClick(store._id);
                                        }}
                                    >
                                        Visiter
                                    </Button>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Col>
                ))}
            </Row>
            
            {/* Pagination */}
            {pages > 1 && (
                <div className="d-flex justify-content-center mt-5">
                    <nav>
                        <ul className="pagination">
                            <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => setPage(page - 1)}
                                    disabled={page === 1}
                                >
                                    Précédent
                                </button>
                            </li>
                            
                            {[...Array(Math.min(5, pages))].map((_, idx) => {
                                const pageNum = Math.max(1, Math.min(pages - 4, page - 2)) + idx;
                                if (pageNum > pages) return null;
                                
                                return (
                                    <li key={pageNum} className={`page-item ${pageNum === page ? 'active' : ''}`}>
                                        <button 
                                            className="page-link"
                                            onClick={() => setPage(pageNum)}
                                        >
                                            {pageNum}
                                        </button>
                                    </li>
                                );
                            })}
                            
                            <li className={`page-item ${page === pages ? 'disabled' : ''}`}>
                                <button 
                                    className="page-link" 
                                    onClick={() => setPage(page + 1)}
                                    disabled={page === pages}
                                >
                                    Suivant
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </Container>
    );
};

export default StoresCategoryPage;