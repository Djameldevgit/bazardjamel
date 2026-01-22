// src/pages/Home.jsx - CORRECCIÓN DE SELECTORES
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getAllCategoriesWithPosts, loadMoreCategories } from '../redux/actions/categoryAction';
import { 
  Container, 
  Spinner, 
  Alert,
  Button
} from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import CategorySection from '../components/SlidersCategories/CategorySection';
import MainCategorySlider from '../components/SlidersCategories/CategorySlider';
import Header from '../components/SlidersCategories/HeaderCarousel';

const Home = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  
  const [page, setPage] = useState(1);
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const hasLoadedRef = useRef(false);
  
  // ⭐ SELECTOR CORRECTO - Acceder directamente a state.category
  const {
    categories = [],
    loading,
    error,
    hasMoreCategories,
    currentPage
  } = useSelector((state) => {
    // Debug completo del estado
    console.log('🏠 Home - Estado completo de Redux:', state.category);
    
    const catState = state.category || {};
    
    // Verificar estructura de cada categoría
    if (catState.categories && catState.categories.length > 0) {
      console.log(`📊 Home: ${catState.categories.length} categorías encontradas`);
      
      catState.categories.forEach((cat, index) => {
        console.log(`📁 Categoría ${index + 1}: "${cat.name}"`, {
          id: cat._id,
          slug: cat.slug,
          postsPropiedad: 'posts' in cat,
          postsValor: cat.posts,
          esArray: Array.isArray(cat.posts),
          cantidadPosts: cat.posts ? cat.posts.length : 0,
          primerPost: cat.posts && cat.posts[0] ? {
            id: cat.posts[0]._id,
            title: cat.posts[0].title,
            price: cat.posts[0].price
          } : null
        });
      });
    } else {
      console.log('⚠️ Home: No hay categorías en el estado');
    }
    
    return {
      categories: catState.categories || [],
      loading: catState.loading || false,
      error: catState.error || null,
      hasMoreCategories: catState.hasMoreCategories || true,
      currentPage: catState.currentPage || 1
    };
  });

  // ⭐ Cargar categorías SOLO UNA VEZ
  useEffect(() => {
    if (hasLoadedRef.current || loading) {
      return;
    }
    
    console.log('🏠 Home: Disparando acción getAllCategoriesWithPosts...');
    hasLoadedRef.current = true;
    
    // ⭐ Asegúrate de pasar el parámetro posts=true
    dispatch(getAllCategoriesWithPosts(1, 8));
    
    const timer = setTimeout(() => {
      setInitialLoadDone(true);
      console.log('✅ Home: Timer de carga inicial completado');
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [dispatch, loading]);

  // ⭐ Debug adicional cuando cambian las categorías
  useEffect(() => {
    if (initialLoadDone && categories.length > 0) {
      console.log('🔍 Home - Análisis final de datos:');
      
      let totalPostsEnTodasCategorias = 0;
      let categoriasConPosts = 0;
      
      categories.forEach((cat, index) => {
        const tienePosts = cat.posts && Array.isArray(cat.posts) && cat.posts.length > 0;
        const cantidadPosts = cat.posts ? cat.posts.length : 0;
        
        totalPostsEnTodasCategorias += cantidadPosts;
        if (tienePosts) categoriasConPosts++;
        
        console.log(`${index + 1}. ${cat.name}:`, {
          tienePosts,
          cantidadPosts,
          tipoDePosts: typeof cat.posts
        });
      });
      
      console.log(`📈 Resumen: ${categoriasConPosts}/${categories.length} categorías tienen posts`);
      console.log(`📈 Total de posts en home: ${totalPostsEnTodasCategorias}`);
      
      // Si no hay posts, hacer una prueba directa
      if (totalPostsEnTodasCategorias === 0) {
        console.log('⚠️ ALERTA: No hay posts en NINGUNA categoría');
        console.log('Prueba endpoint manualmente: /api/categories/main?posts=true&limit=2');
      }
    }
  }, [categories, initialLoadDone]);

  // Manejar scroll infinito
  const fetchMoreData = useCallback(() => {
    if (hasMoreCategories && !loading && initialLoadDone) {
      const nextPage = currentPage + 1;
      console.log(`📥 Home: Cargando página ${nextPage}...`);
      setPage(nextPage);
      dispatch(loadMoreCategories(nextPage));
    }
  }, [dispatch, hasMoreCategories, loading, currentPage, initialLoadDone]);

  const handleCategoryClick = (slug) => {
    console.log(`🔗 Home: Click en categoría ${slug}`);
    history.push(`/category/${slug}`);
  };

  const handleViewMore = (slug) => {
    console.log(`🔗 Home: Ver más de categoría ${slug}`);
    history.push(`/category/${slug}`);
  };

  const handlePostClick = (postId) => {
    console.log(`🔗 Home: Click en post ${postId}`);
    history.push(`/post/${postId}`);
  };

  // Render condicional
  const showLoading = loading && categories.length === 0 && !initialLoadDone;
  const showError = error && categories.length === 0 && initialLoadDone;
  const showEmptyState = !loading && categories.length === 0 && initialLoadDone;

  if (showLoading) {
    return (
      <div className="min-vh-100 d-flex flex-column">
        <Header />
        <Container className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3">Cargando marketplace...</p>
          </div>
        </Container>
      </div>
    );
  }

  if (showError) {
    return (
      <div className="min-vh-100 d-flex flex-column">
        <Header />
        <Container className="flex-grow-1 d-flex align-items-center justify-content-center">
          <Alert variant="danger" className="text-center">
            <h4>Error al cargar contenido</h4>
            <p>{error}</p>
            <Button 
              variant="outline-danger" 
              onClick={() => {
                hasLoadedRef.current = false;
                dispatch(getAllCategoriesWithPosts(1, 8));
              }}
            >
              Reintentar
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  if (showEmptyState) {
    return (
      <div className="min-vh-100 d-flex flex-column">
        <Header />
        <Container className="flex-grow-1 d-flex align-items-center justify-content-center">
          <Alert variant="info" className="text-center">
            <h4>No hay contenido disponible</h4>
            <p>No se encontraron categorías con productos.</p>
            <Button 
              variant="primary"
              onClick={() => {
                hasLoadedRef.current = false;
                dispatch(getAllCategoriesWithPosts(1, 8));
              }}
            >
              Buscar contenido
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  console.log('🎨 Home: Renderizando interfaz...');

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      
      <main className="flex-grow-1">
        {/* Slider principal */}
        <section className="py-4 bg-light">
          <Container>
            <h2 className="h4 mb-3">Explora nuestras categorías</h2>
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
              <div className="text-center py-3">
                <Spinner animation="border" size="sm" />
                <span className="ms-2">Cargando más categorías...</span>
              </div>
            }
            endMessage={
              <p className="text-center text-muted py-3">
                ¡Has visto todas las categorías!
              </p>
            }
            scrollThreshold={0.8}
          >
            {categories.map((category) => (
              <CategorySection
                key={category._id || category.slug}
                category={category}
                onViewMore={() => handleViewMore(category.slug)}
                onPostClick={handlePostClick}
              />
            ))}
          </InfiniteScroll>

          {/* Mensaje si categorías vacías */}
          {initialLoadDone && categories.length === 0 && (
            <div className="text-center py-5">
              <Alert variant="warning">
                <i className="fas fa-exclamation-triangle me-2"></i>
                No hay categorías disponibles
              </Alert>
            </div>
          )}

          {/* Botón para cargar más */}
          {hasMoreCategories && categories.length > 0 && (
            <div className="text-center mt-4">
              <Button
                variant="outline-primary"
                onClick={fetchMoreData}
                disabled={loading}
                className="px-4"
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Cargando...
                  </>
                ) : (
                  'Ver más categorías'
                )}
              </Button>
            </div>
          )}
        </Container>
      </main>
    </div>
  );
};

export default Home;