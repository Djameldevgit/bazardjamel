// src/pages/Home.jsx - VERSIÓN OPTIMIZADA Y CORREGIDA
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getAllCategoriesWithPosts, loadMoreCategories } from '../redux/actions/categoryAction';
import { 
  Container, 
  Spinner, 
  Alert,
  Button,
  Row,
  Col,
  Card
} from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
// ✅ ELIMINADO: CategorySection no se usa
import MainCategorySlider from '../components/SlidersCategories/CategorySlider';
import Header from '../components/SlidersCategories/HeaderCarousel';
import { 
  ArrowRight, 
  ChevronRight,
  Star,
  StarFill,
  Heart,
  HeartFill,
  Eye,
  Clock
} from 'react-bootstrap-icons';

const Home = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  
  const [page, setPage] = useState(1);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const hasLoadedRef = useRef(false);
  
  const { theme = 'light' } = useSelector(state => state.theme || {});
  
  const {
    categories = [],
    loading,
    error,
    hasMoreCategories,
    currentPage
  } = useSelector((state) => state.category || {});

  useEffect(() => {
    if (hasLoadedRef.current || loading) return;
    
    console.log('🏠 Home: Disparando acción getAllCategoriesWithPosts...');
    hasLoadedRef.current = true;
    dispatch(getAllCategoriesWithPosts(1, 8));
    
    const timer = setTimeout(() => setInitialLoadDone(true), 1500);
    return () => clearTimeout(timer);
  }, [dispatch, loading]);

  const fetchMoreData = useCallback(() => {
    if (hasMoreCategories && !loading && initialLoadDone) {
      const nextPage = currentPage + 1;
      setPage(nextPage);
      dispatch(loadMoreCategories(nextPage));
    }
  }, [dispatch, hasMoreCategories, loading, currentPage, initialLoadDone]);

  // ✅ CORREGIDO: Maneja objeto completo O parámetros separados
  const handleCategoryClick = (slugOrObject, categoryNameParam) => {
    let slug, categoryName;
    
    if (typeof slugOrObject === 'object' && slugOrObject !== null) {
      // Es objeto completo desde CategorySlider
      slug = slugOrObject.slug;
      categoryName = slugOrObject.name || 'Categoría';
    } else if (typeof slugOrObject === 'string') {
      // Es string slug (compatibilidad)
      slug = slugOrObject;
      categoryName = categoryNameParam || 'Categoría';
    } else {
      console.error('❌ Parámetro inválido:', slugOrObject);
      return;
    }
    
    if (!slug) {
      console.error('❌ Slug vacío');
      return;
    }
    
    console.log(`🔗 Navegando a: ${categoryName} (/${slug})`);
    history.push(`/category/${slug}`);
  };

  const handleViewMore = (slug, categoryName) => {
    console.log(`🔗 Ver más de: ${categoryName}`);
    history.push(`/category/${slug}`, { fromHome: true, categoryName });
  };

  const handlePostClick = (postId, postTitle) => {
    console.log(`🔗 Click en post: ${postTitle}`);
    history.push(`/post/${postId}`, { fromHome: true, postTitle });
  };

  const getCategoryPlaceholder = (categorySlug) => {
    const placeholders = {
      'immobilier': '🏠', 'vehicules': '🚗', 'electronique': '📱',
      'mode': '👕', 'maison': '🛋️', 'loisirs': '🎮',
      'emploi': '💼', 'services': '🛠️', 'animaux': '🐶',
      'alimentation': '🍎'
    };
    return placeholders[categorySlug] || '📦';
  };

  const formatPrice = (price) => {
    if (!price && price !== 0) return 'Precio no disponible';
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  const calculateDiscount = (originalPrice, salePrice) => {
    if (!originalPrice || !salePrice || salePrice >= originalPrice) return null;
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  };

  // Render condicional
  if (loading && categories.length === 0 && !initialLoadDone) {
    return (
      <div className="min-vh-100 d-flex flex-column bg-gradient-light">
        <Header />
        <Container className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3 text-muted">Cargando experiencias únicas...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (error && categories.length === 0 && initialLoadDone) {
    return (
      <div className="min-vh-100 d-flex flex-column">
        <Header />
        <Container className="flex-grow-1 d-flex align-items-center justify-content-center">
          <Alert variant="danger" className="shadow-lg border-0 text-center">
            <i className="fas fa-exclamation-circle fa-3x text-danger mb-3"></i>
            <h4 className="h5 mb-2">Error de conexión</h4>
            <p className="text-muted mb-4">No pudimos cargar el contenido</p>
            <Button 
              variant="gradient-primary" 
              onClick={() => {
                hasLoadedRef.current = false;
                dispatch(getAllCategoriesWithPosts(1, 8));
              }}
              className="rounded-pill px-4"
            >
              <i className="fas fa-redo me-2"></i>
              Reintentar
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  if (!loading && categories.length === 0 && initialLoadDone) {
    return (
      <div className="min-vh-100 d-flex flex-column">
        <Header />
        <Container className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <i className="fas fa-search fa-4x text-muted mb-4"></i>
            <h4 className="h5 mb-2">Marketplace vacío</h4>
            <p className="text-muted mb-4">Aún no hay productos publicados</p>
            <Button variant="outline-primary" className="rounded-pill px-4">
              <i className="fas fa-plus me-2"></i>
              Publicar primer producto
            </Button>
          </div>
        </Container>
      </div>
    );
  }

  

  return (
    <div className={`min-vh-100 d-flex flex-column ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light'}`}>
      <Header />
      
      <main className="flex-grow-1">
      
       
        <section  >
          <Container>
          
         
            <MainCategorySlider 
              categories={categories}  
              onCategoryClick={handleCategoryClick}  
            />
          </Container>
        </section>

        {/* Secciones de categorías */}
        <Container className="py-5">
          <InfiniteScroll
            dataLength={categories.length}
            next={fetchMoreData}
            hasMore={hasMoreCategories}
            loader={
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Buscando más tesoros...</p>
              </div>
            }
            endMessage={
              <div className="text-center py-5">
                <i className="fas fa-flag-checkered fa-2x text-success mb-3"></i>
                <h4 className="h5 mb-2">¡Llegaste al final!</h4>
                <p className="text-muted">Has explorado todas nuestras categorías</p>
              </div>
            }
            scrollThreshold={0.9}
          >
            {categories.map((category, index) => (
              <section key={category._id} className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div>
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <div className="category-icon bg-primary bg-opacity-10 rounded-3 p-3">
                        <i className="fas fa-tag text-primary"></i>
                      </div>
                      <div>
                        <h3 className="h4 fw-bold mb-0">{category.name}</h3>
                        <p className="text-muted mb-0">
                          {category.posts?.length || 0} productos
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Button 
                    variant="outline-primary"
                    className="rounded-pill px-4"
                    onClick={() => handleViewMore(category.slug, category.name)}
                  >
                    Ver todos
                    <ArrowRight className="ms-2" size={16} />
                  </Button>
                </div>

                {category.posts && category.posts.length > 0 ? (
                  <Row>
                    {category.posts.slice(0, 6).map((post) => {
                      const discount = calculateDiscount(post.originalPrice, post.price);
                      
                      return (
                        <Col key={post._id} xs={6} md={4} lg={2} className="mb-4">
                          <Card 
                            className="h-100 border-0 shadow-sm hover-lift"
                            onMouseEnter={() => setHoveredCard(post._id)}
                            onMouseLeave={() => setHoveredCard(null)}
                            onClick={() => handlePostClick(post._id, post.title)}
                            style={{ cursor: 'pointer' }}
                          >
                            <div className="position-relative overflow-hidden" style={{ paddingTop: '75%' }}>
                              {post.images && post.images[0] ? (
                                <>
                                  <Card.Img
                                    variant="top"
                                    src={post.images[0]}
                                    alt={post.title}
                                    className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = `https://via.placeholder.com/300x225/6c757d/ffffff?text=${getCategoryPlaceholder(category.slug)}`;
                                    }}
                                  />
                                  {discount && (
                                    <div className="position-absolute top-0 start-0 m-2">
                                      <span className="badge bg-danger rounded-pill px-2 py-1">
                                        -{discount}%
                                      </span>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <div className="position-absolute top-0 start-0 w-100 h-100 bg-light d-flex align-items-center justify-content-center">
                                  <div className="display-4 text-muted mb-2">
                                    {getCategoryPlaceholder(category.slug)}
                                  </div>
                                </div>
                              )}
                            </div>

                            <Card.Body className="d-flex flex-column p-3">
                              <Card.Title className="h6 mb-2 text-truncate">
                                {post.title}
                              </Card.Title>
                              
                              <div className="mt-auto">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                  <div>
                                    <span className="h5 fw-bold text-primary mb-0">
                                      {formatPrice(post.price)}
                                    </span>
                                    {post.originalPrice && discount && (
                                      <small className="text-decoration-line-through text-muted d-block">
                                        {formatPrice(post.originalPrice)}
                                      </small>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                ) : (
                  <Alert variant="info" className="text-center">
                    <i className="fas fa-info-circle me-2"></i>
                    Aún no hay productos en esta categoría
                  </Alert>
                )}
              </section>
            ))}
          </InfiniteScroll>
        </Container>

        <section className="py-5 bg-gradient-primary text-white position-relative overflow-hidden">
          <div className="position-absolute top-0 start-0 w-100 h-100 bg-pattern"></div>
          <Container className="position-relative z-1">
            <Row className="align-items-center">
              <Col lg={6} className="mb-4 mb-lg-0">
                <h1 className="display-4 fw-bold mb-3">Descubre lo extraordinario</h1>
                <p className="lead mb-4 opacity-75">
                  Miles de productos únicos esperándote. Desde lo esencial hasta lo exclusivo.
                </p>
                <div className="d-flex gap-3">
                  <Button 
                    variant="light" 
                    size="lg"
                    className="rounded-pill px-4 fw-semibold"
                    onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}
                  >
                    <i className="fas fa-rocket me-2"></i>
                    Explorar ahora
                  </Button>
                  <Button variant="outline-light" size="lg" className="rounded-pill px-4">
                    <i className="fas fa-question-circle me-2"></i>
                    Cómo funciona
                  </Button>
                </div>
              </Col>
              <Col lg={6}>
                <div className="hero-image-placeholder rounded-4 overflow-hidden shadow-lg">
                  <div className="bg-dark bg-opacity-25 p-5 text-center">
                    <i className="fas fa-store fa-5x mb-3 opacity-50"></i>
                    <p className="mb-0">Tu mercado digital</p>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </section>





      </main>

      <style jsx>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .hover-lift {
          transition: all 0.3s ease;
        }
        
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default Home;