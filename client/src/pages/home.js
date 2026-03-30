// src/pages/Home.jsx - VERSIÓN CORREGIDA

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { 
  getAllCategoriesWithPosts, 
  loadMoreCategories,
  getSliderCategories  // ← IMPORTAR LA NUEVA ACCIÓN
} from '../redux/actions/categoryAction';
import { getBoutiquesForHome } from '../redux/actions/boutiqueAction';
import { 
  Container, 
  Spinner, 
  Alert,
  Button,
  Row,
  Col,
  Badge
} from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import MainCategorySlider from '../components/SlidersCategories/CategorySlider';
import CarouselHome from '../components/carousel/CarouselHome';
import PostCard from '../components/post-card/PostCard';
import BoutiquePostCard from '../components/boutique/BoutiquePostCard';
import { ArrowRight, ChevronLeft, ChevronRight } from 'react-bootstrap-icons';

const Home = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const hasLoadedRef = useRef(false);
  const boutiqueSliderRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [scrollLogs, setScrollLogs] = useState([]);
  
  const { theme = 'light' } = useSelector(state => state.theme || {});
  
  // 🆕 SEPARAR: Slider (todas las categorías) y Scroll (categorías con posts)
  const {
    sliderCategories = [],      // Para el slider (todas las categorías)
    sliderLoading = false
  } = useSelector((state) => state.category || {});
  
  const {
    categories = [],            // Para scroll infinito (con posts)
    loading,
    error,
    hasMoreCategories,
    currentPage,
    totalPages
  } = useSelector((state) => state.category || {});

  const { homeBoutiques = [] } = useSelector((state) => state.boutique || {});

  // Función para agregar logs
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const newLog = { 
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp, 
      message, 
      type 
    };
    setScrollLogs(prev => [newLog, ...prev].slice(0, 20));
    console.log(`[${timestamp}] ${message}`);
  };

  // 🔥 CARGA INICIAL: Separada en dos partes
  useEffect(() => {
    if (hasLoadedRef.current) return;
    
    hasLoadedRef.current = true;
    
    addLog('🚀 INICIO - Cargando...', 'success');
    
    // 1. Cargar slider (TODAS las categorías de una vez)
    dispatch(getSliderCategories());
    
    // 2. Cargar primeras 2 categorías con posts (para scroll infinito)
    dispatch(getAllCategoriesWithPosts(1, 2));
    dispatch(getBoutiquesForHome(10));
    
    // Timeout de respaldo
    const timer = setTimeout(() => {
      if (!dataLoaded && !loading) {
        addLog('⚠️ Timeout: Forzando carga completada', 'warning');
        setInitialLoadDone(true);
        setDataLoaded(true);
      }
    }, 5000);
    
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Monitorear slider
  useEffect(() => {
    if (sliderCategories.length > 0) {
      addLog(`🎠 SLIDER: ${sliderCategories.length} categorías cargadas`, 'success');
      // 🔥 LOG PARA VER QUÉ CATEGORÍAS LLEGAN AL SLIDER
      sliderCategories.forEach(cat => {
        console.log(`   🎠 Slider - ${cat.name} (${cat.slug})`);
      });
    }
  }, [sliderCategories]);

  // Monitorear cuando los datos del scroll están listos
  useEffect(() => {
    if (categories.length > 0 && !loading && !dataLoaded) {
      setDataLoaded(true);
      setInitialLoadDone(true);
      addLog(`✅ DATOS SCROLL LISTOS: ${categories.length} categorías cargadas (página ${currentPage}/${totalPages})`, 'success');
      
      // 🔥 LOG DE POSTS PARA DEPURACIÓN
      categories.forEach(cat => {
        const postCount = cat.posts?.length || 0;
        addLog(`   📦 ${cat.name}: ${postCount} posts`, postCount > 0 ? 'success' : 'warning');
      });
    }
  }, [categories, loading, dataLoaded, currentPage, totalPages]);

  // Verificar scroll de boutiques
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
      boutiqueSliderRef.current.scrollBy({
        left: direction === 'left' ? -300 : 300,
        behavior: 'smooth'
      });
    }
  };

  // Scroll infinito
  const fetchMoreData = useCallback(() => {
    if (hasMoreCategories && !loading && dataLoaded) {
      const nextPage = currentPage + 1;
      addLog(`📡 SCROLL ACTIVADO! Cargando página ${nextPage}`, 'warning');
      dispatch(loadMoreCategories());
    }
  }, [dispatch, hasMoreCategories, loading, currentPage, dataLoaded, addLog]);

  // Navegación
  const handleCategoryClick = (slugOrObject, categoryNameParam) => {
    let slug, categoryName;
    if (typeof slugOrObject === 'object') {
      slug = slugOrObject.slug;
      categoryName = slugOrObject.name || 'Categoría';
    } else {
      slug = slugOrObject;
      categoryName = categoryNameParam || 'Categoría';
    }
    if (slug) {
      addLog(`🔗 Navegando a: ${categoryName}`, 'info');
      history.push(`/${slug}`);
    }
  };

  const handleViewMore = (slug, categoryName) => {
    addLog(`🔍 Ver más: ${categoryName}`, 'info');
    history.push(`/${slug}`, { fromHome: true, categoryName });
  };

  const handleViewAllBoutiques = () => {
    addLog(`🏪 Ver todas las boutiques`, 'info');
    history.push('/boutiques/1');
  };

  const handleBoutiqueClick = (boutiqueId) => {
    addLog(`🏪 Click boutique: ${boutiqueId}`, 'info');
    history.push(`/boutique/${boutiqueId}`);
  };

  // Filtrar posts
  const filterNormalPosts = (posts) => {
    if (!posts) return [];
    return posts.filter(post => !post.isFromBoutique);
  };

  // 🔥 FILTRAR CATEGORÍAS PARA EL SCROLL (excluir boutiques)
  const filteredScrollCategories = categories.filter(category => {
    const categoryName = category.name?.toLowerCase() || '';
    const categorySlug = category.slug?.toLowerCase() || '';
    return categoryName !== 'boutique' && 
           categoryName !== 'boutiques' && 
           categorySlug !== 'boutique' && 
           categorySlug !== 'boutiques';
  });

  // Loading inicial
  if ((sliderLoading || loading) && categories.length === 0 && !dataLoaded) {
    return (
      <div className={`min-vh-100 d-flex flex-column ${theme === 'dark' ? 'bg-dark' : 'bg-light'}`}>
        <Container className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3 text-muted">Cargando experiencias únicas...</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className={`min-vh-100 d-flex flex-column ${theme === 'dark' ? 'bg-dark text-light' : 'bg-light'}`}>
      
      {/* PANEL DE LOGS */}
      {process.env.NODE_ENV === 'development' && (
        <div className="position-fixed bottom-0 end-0 m-3" style={{ zIndex: 9999, maxWidth: '400px' }}>
          <div className="card shadow-lg border-0" style={{ backgroundColor: 'rgba(0,0,0,0.9)' }}>
            <div className="card-header bg-dark text-white py-2 px-3">
              <div className="d-flex justify-content-between align-items-center">
                <small className="fw-bold">📡 SCROLL LOGS</small>
                <Button variant="link" size="sm" className="text-white p-0" onClick={() => setScrollLogs([])}>
                  <i className="fas fa-trash-alt"></i>
                </Button>
              </div>
            </div>
            <div className="card-body p-2" style={{ maxHeight: '250px', overflowY: 'auto', fontSize: '10px', fontFamily: 'monospace' }}>
              {scrollLogs.map(log => (
                <div key={log.id} className="mb-1 pb-1 border-bottom border-secondary" style={{ color: log.type === 'success' ? '#28a745' : log.type === 'warning' ? '#ffc107' : log.type === 'danger' ? '#dc3545' : '#17a2b8' }}>
                  <small className="text-muted">{log.timestamp}</small>
                  <div className="small">{log.message}</div>
                </div>
              ))}
            </div>
            <div className="card-footer bg-dark text-white py-1 px-3">
              <div className="d-flex justify-content-between small">
                <span>Slider: {sliderCategories.length}</span>
                <span>Scroll: {filteredScrollCategories.length}</span>
                <span>Pág: {currentPage}/{totalPages}</span>
                <Badge bg={hasMoreCategories ? 'success' : 'secondary'}>{hasMoreCategories ? '✅ Más' : '⛔ Fin'}</Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      <CarouselHome />
      
      <main className="flex-grow-1">
        {/* 🔥 SLIDER - TODAS LAS CATEGORÍAS DE UNA VEZ */}
        <section>
          <Container>
            <MainCategorySlider 
              categories={sliderCategories}  // ← USAR sliderCategories, NO categories
              onCategoryClick={handleCategoryClick}  
            />
          </Container>
        </section>

        <Container className="py-1">
          {/* SECCIÓN BOUTIQUES */}
          {homeBoutiques.length > 0 && (
            <section className="mb-2">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <div>
                  <h5 className="h4 fw-bold mb-0">Boutiques {homeBoutiques.length}</h5>
                </div>
                <div className="d-flex gap-2">
                  <Button variant="outline-purple" className="rounded-circle p-2" onClick={() => scrollBoutiques('left')} disabled={!showLeftArrow} style={{ width: '40px', height: '40px' }}>
                    <ChevronLeft size={20} />
                  </Button>
                  <Button variant="outline-purple" className="rounded-circle p-2" onClick={() => scrollBoutiques('right')} disabled={!showRightArrow} style={{ width: '40px', height: '40px' }}>
                    <ChevronRight size={20} />
                  </Button>
                  <Button variant="outline-purple" className="rounded-pill px-4 ms-2" onClick={handleViewAllBoutiques}>
                    Voir <ArrowRight className="ms-2" size={16} />
                  </Button>
                </div>
              </div>
              <div className="boutique-slider-container position-relative">
                <div className="boutique-slider d-flex gap-3 pb-3" ref={boutiqueSliderRef} style={{ overflowX: 'auto', scrollBehavior: 'smooth', scrollbarWidth: 'thin' }}>
                  {homeBoutiques.map((boutique) => (
                    <div key={boutique._id} className="boutique-slide" style={{ minWidth: '280px', maxWidth: '280px' }} onClick={() => handleBoutiqueClick(boutique._id)}>
                      <BoutiquePostCard boutique={boutique} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* 🔥 SCROLL INFINITO - SECCIONES CON POSTS */}
          <InfiniteScroll
            dataLength={filteredScrollCategories.length}
            next={fetchMoreData}
            hasMore={hasMoreCategories && dataLoaded}
            loader={
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Cargando más categorías...</p>
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
            {filteredScrollCategories.map((category) => {
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
                          <p className="text-muted mb-0">{normalPosts.length} productos</p>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline-primary" className="rounded-pill px-4" onClick={() => handleViewMore(category.slug, category.name)}>
                      Ver todos <ArrowRight className="ms-2" size={16} />
                    </Button>
                  </div>

                  {normalPosts.length > 0 ? (
                    <Row>
                      {normalPosts.slice(0, 6).map((post) => (
                        <Col key={post._id} xs={6} md={4} lg={2} className="mb-2">
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
        .bg-purple { background-color: #8B5CF6; }
        .text-purple { color: #8B5CF6; }
        .btn-outline-purple { color: #8B5CF6; border-color: #8B5CF6; }
        .btn-outline-purple:hover { color: #fff; background-color: #8B5CF6; border-color: #8B5CF6; }
        .boutique-slider { overflow-x: auto; overflow-y: hidden; white-space: nowrap; cursor: grab; scrollbar-width: thin; padding: 5px 0; }
        .boutique-slider:active { cursor: grabbing; }
        .boutique-slider::-webkit-scrollbar { height: 6px; }
        .boutique-slider::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .boutique-slider::-webkit-scrollbar-thumb { background: #8B5CF6; border-radius: 10px; }
        .boutique-slide { transition: transform 0.2s; cursor: pointer; }
        .boutique-slide:hover { transform: translateY(-4px); }
        @media (max-width: 768px) { .boutique-slide { min-width: 240px !important; max-width: 240px !important; } }
      `}</style>
    </div>
  );
};

export default Home;