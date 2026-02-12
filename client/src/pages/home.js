// src/pages/Home.jsx - VERSIÓN CORREGIDA
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
  Col
} from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import MainCategorySlider from '../components/SlidersCategories/CategorySlider';
import Header from '../components/SlidersCategories/HeaderCarousel';
import PostCard from '../components/PostCard'; // ✅ IMPORTAR PostCard
import { ArrowRight } from 'react-bootstrap-icons';

const Home = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  
  const [page, setPage] = useState(1);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
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
    
    hasLoadedRef.current = true;
    dispatch(getAllCategoriesWithPosts(1, 2));
    
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

  const handleCategoryClick = (slugOrObject, categoryNameParam) => {
    let slug, categoryName;
    
    if (typeof slugOrObject === 'object' && slugOrObject !== null) {
      slug = slugOrObject.slug;
      categoryName = slugOrObject.name || 'Categoría';
    } else if (typeof slugOrObject === 'string') {
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
    
    history.push(`/${slug}`);
  };

  const handleViewMore = (slug, categoryName) => {
    history.push(`/${slug}`, { fromHome: true, categoryName });
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
        <section>
          <Container>
            <MainCategorySlider 
              categories={categories}  
              onCategoryClick={handleCategoryClick}  
            />
          </Container>
        </section>

        {/* Secciones de categorías */}
        <Container className="">
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
            {categories.map((category) => (
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
                  <Row className='' >
                    {category.posts.slice(0, 6).map((post) => (
                      <Col key={post._id} xs={6} md={4} lg={2} className="mb-4">
                        {/* ✅ USAR PostCard EN LUGAR DE CARD DIRECTA */}
                        <PostCard post={post} />
                      </Col>
                    ))}
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
      </main>
    </div>
  );
};

export default Home;