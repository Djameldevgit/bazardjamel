// src/pages/Home.jsx - VERSIÓN CORREGIDA (eliminar categoría Boutiques)
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getAllCategoriesWithPosts, loadMoreCategories } from '../redux/actions/categoryAction';
import { getBoutiquesForHome } from '../redux/actions/boutiqueAction';
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
import CarouselHome from '../components/carousel/CarouselHome';
import PostCard from '../components/post-card/PostCard';
import BoutiqueCard from '../components/boutique/BoutiquePostCard';
  
import { ArrowRight, ChevronLeft, ChevronRight } from 'react-bootstrap-icons';

const Home = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  
  const [page, setPage] = useState(1);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const hasLoadedRef = useRef(false);
  
  const boutiqueSliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  
  const { theme = 'light' } = useSelector(state => state.theme || {});
  
  const {
    categories = [],
    loading,
    error,
    hasMoreCategories,
    currentPage
  } = useSelector((state) => state.category || {});

  const { homeBoutiques = [] } = useSelector((state) => state.boutique || {});

  useEffect(() => {
    if (hasLoadedRef.current || loading) return;
    
    hasLoadedRef.current = true;
    
    dispatch(getAllCategoriesWithPosts(1, 2));
    dispatch(getBoutiquesForHome(10));
    
    const timer = setTimeout(() => setInitialLoadDone(true), 1500);
    return () => clearTimeout(timer);
  }, [dispatch, loading]);

  const checkScrollPosition = useCallback(() => {
    if (boutiqueSliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = boutiqueSliderRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  }, []);

  useEffect(() => {
    const slider = boutiqueSliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', checkScrollPosition);
      checkScrollPosition();
      
      return () => slider.removeEventListener('scroll', checkScrollPosition);
    }
  }, [homeBoutiques, checkScrollPosition]);

  const scrollBoutiques = (direction) => {
    if (boutiqueSliderRef.current) {
      const scrollAmount = 300;
      boutiqueSliderRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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

  const handleViewAllBoutiques = () => {
    history.push('/boutiques/1');
  };

  const handleBoutiqueClick = (boutiqueId) => {
    history.push(`/boutique/${boutiqueId}`);
  };

  // 🔥 FILTRO PRINCIPAL: Excluir la categoría "Boutiques" de las secciones normales
  const filterCategories = () => {
    return categories.filter(category => {
      const categoryName = category.name?.toLowerCase() || '';
      const categorySlug = category.slug?.toLowerCase() || '';
      
      // Excluir cualquier categoría relacionada con boutiques
      return categoryName !== 'boutique' && 
             categoryName !== 'boutiques' && 
             categorySlug !== 'boutique' && 
             categorySlug !== 'boutiques' &&
             categoryName !== 'tiendas' &&
             categorySlug !== 'tiendas';
    });
  };

  // Filtrar posts normales (por si acaso)
  const filterNormalPosts = (posts) => {
    if (!posts) return [];
    
    return posts.filter(post => {
      // Excluir si es de boutique
      if (post.isFromBoutique) return false;
      
      const categoryName = post.category?.name?.toLowerCase() || '';
      const categorySlug = post.category?.slug?.toLowerCase() || '';
      
      return categoryName !== 'boutique' && 
             categorySlug !== 'boutique' && 
             categoryName !== 'boutiques' && 
             categorySlug !== 'boutiques';
    });
  };

  // Aplicar filtros
  const filteredCategories = filterCategories();

  if (loading && categories.length === 0 && !initialLoadDone) {
    return (
      <div className={`min-vh-100 d-flex flex-column ${theme === 'dark' ? 'bg-dark' : 'bg-gradient-light'}`}>
        
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
      <div className={`min-vh-100 d-flex flex-column ${theme === 'dark' ? 'bg-dark' : ''}`}>
        
        <Container className="flex-grow-1 d-flex align-items-center justify-content-center">
          <Alert variant="danger" className="shadow-lg border-0 text-center">
            <i className="fas fa-exclamation-circle fa-3x text-danger mb-3"></i>
            <h4 className="h5 mb-2">Error de conexión</h4>
            <p className="text-muted mb-4">No pudimos cargar el contenido</p>
            <Button 
              variant="primary" 
              onClick={() => {
                hasLoadedRef.current = false;
                dispatch(getAllCategoriesWithPosts(1, 8));
                dispatch(getBoutiquesForHome(10));
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

  return (
    <div className={`min-vh-100 d-flex flex-column ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light'}`}>
      
      <CarouselHome />
      <main className="flex-grow-1">
        <section>
          <Container>
            <MainCategorySlider 
              categories={categories}  
              onCategoryClick={handleCategoryClick}  
            />
          </Container>
        </section>

        <Container className="py-1">
          {/* SECCIÓN BOUTIQUES EN SLIDER HORIZONTAL - SOLO BOUTIQUES REALES */}
          {homeBoutiques.length > 0 && (
            <section className="mb-2">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <div className="d-flex align-items-center gap-3 mb-2">
                    <div className="category-icon bg-purple bg-opacity-10 rounded-3 p-3">
                      <p className="text-purple" size={20} />
                    </div>
                    <div>
                      <h3 className="h4 fw-bold mb-0">Boutiques {homeBoutiques.length} </h3>
                     
                         
                       
                    </div>
                  </div>
                </div>
                
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-purple"
                    className="rounded-circle p-2"
                    onClick={() => scrollBoutiques('left')}
                    disabled={!showLeftArrow}
                    style={{ 
                      width: '40px', 
                      height: '40px',
                      opacity: showLeftArrow ? 1 : 0.5,
                      pointerEvents: showLeftArrow ? 'auto' : 'none'
                    }}
                  >
                    <ChevronLeft size={20} />
                  </Button>
                  
                  <Button 
                    variant="outline-purple"
                    className="rounded-circle p-2"
                    onClick={() => scrollBoutiques('right')}
                    disabled={!showRightArrow}
                    style={{ 
                      width: '40px', 
                      height: '40px',
                      opacity: showRightArrow ? 1 : 0.5,
                      pointerEvents: showRightArrow ? 'auto' : 'none'
                    }}
                  >
                    <ChevronRight size={20} />
                  </Button>
                  
                  <Button 
                    variant="outline-purple"
                    className="rounded-pill px-4 ms-2"
                    onClick={handleViewAllBoutiques}
                  >
                    Voir
                    <ArrowRight className="ms-2" size={16} />
                  </Button>
                </div>
              </div>

              {/* Slider horizontal de boutiques - SOLO BOUTIQUES REALES */}
              <div className="boutique-slider-container position-relative">
                <div 
                  className="boutique-slider d-flex gap-3 pb-3"
                  ref={boutiqueSliderRef}
                  style={{
                    overflowX: 'auto',
                    scrollBehavior: 'smooth',
                    scrollbarWidth: 'thin',
                    WebkitOverflowScrolling: 'touch'
                  }}
                >
                  {homeBoutiques.map((boutique) => (
                    <div 
                      key={boutique._id} 
                      className="boutique-slide"
                      style={{ minWidth: '280px', maxWidth: '280px' }}
                      onClick={() => handleBoutiqueClick(boutique._id)}
                    >
                      <BoutiqueCard boutique={boutique} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* SECCIONES DE CATEGORÍAS - SIN LA CATEGORÍA BOUTIQUES */}
          <InfiniteScroll
            dataLength={filteredCategories.length}
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
            {filteredCategories.map((category) => {
              // Filtrar posts normales (excluir cualquier post de boutique)
              const normalPosts = filterNormalPosts(category.posts);
              
              return (
                <section key={category._id} className="mb-5">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <div className="d-flex align-items-center gap-3 mb-2">
                        <div className="category-icon bg-primary bg-opacity-10 rounded-3 p-3">
                          <i className="fas fa-tag text-primary" style={{ fontSize: '1.5rem' }}></i>
                        </div>
                        <div>
                          <h3 className="h4 fw-bold mb-0">{category.name}</h3>
                          <p className="text-muted mb-0">
                            {normalPosts.length} productos
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

                  {normalPosts.length > 0 ? (
                    <Row>
                      {normalPosts.slice(0, 6).map((post) => (
                        <Col key={post._id} xs={6} md={4} lg={2} className="mb-4">
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
              );
            })}
          </InfiniteScroll>
        </Container>
      </main>

      <style jsx="true">{`
        .bg-purple {
          background-color: #8B5CF6;
        }
        .text-purple {
          color: #8B5CF6;
        }
        .bg-opacity-10 {
          --bs-bg-opacity: 0.1;
        }
        .btn-outline-purple {
          color: #8B5CF6;
          border-color: #8B5CF6;
        }
        .btn-outline-purple:hover {
          color: #fff;
          background-color: #8B5CF6;
          border-color: #8B5CF6;
        }
        
        .boutique-slider {
          overflow-x: auto;
          overflow-y: hidden;
          white-space: nowrap;
          cursor: grab;
          scrollbar-width: thin;
          scrollbar-color: #8B5CF6 #f0f0f0;
          padding: 5px 0;
        }
        
        .boutique-slider:active {
          cursor: grabbing;
        }
        
        .boutique-slider::-webkit-scrollbar {
          height: 6px;
        }
        
        .boutique-slider::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .boutique-slider::-webkit-scrollbar-thumb {
          background: #8B5CF6;
          border-radius: 10px;
        }
        
        .boutique-slider::-webkit-scrollbar-thumb:hover {
          background: #7C3AED;
        }
        
        .boutique-slide {
          transition: transform 0.2s;
          cursor: pointer;
        }
        
        .boutique-slide:hover {
          transform: translateY(-4px);
        }
        
        .boutique-slider-container {
          margin: 0 -5px;
        }
        
        @media (max-width: 768px) {
          .boutique-slide {
            min-width: 240px !important;
            max-width: 240px !important;
          }
          
          .boutique-slider {
            gap: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;