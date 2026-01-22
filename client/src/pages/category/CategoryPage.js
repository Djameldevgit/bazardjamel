// src/pages/CategoryPage.jsx - VERSIÓN CORREGIDA SIN resetCategoryPosts
import React, { useEffect, useCallback, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { 
  getCategoryPosts, 
  loadMorePosts,
  setActiveCategory,
  setActiveSubcategory,
  setActiveArticle,
  resetCategoryState  // ⭐ USA resetCategoryState que YA tienes
} from '../../redux/actions/categoryAction';
import { 
  Container, 
  Row, 
  Col, 
  Spinner, 
  Alert,
  Button
} from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import Header from '../../components/SlidersCategories/HeaderCarousel';
import BreadcrumbNav from '../../components/BreadcrumbNav';
import SubCategorySlider from '../../components/SlidersCategories/SubcategorySlider';
import ArticleSlider from '../../components/SlidersCategories/ArticleSlider';
import PostCard from '../../components/PostCard';

const CategoryPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { slug, subSlug, articleSlug } = useParams();
  
  // Refs para control
  const initialLoadRef = useRef(false);
  const isFetchingRef = useRef(false);
  const prevParamsRef = useRef({ slug: null, subSlug: null, articleSlug: null });

  // ⭐ SELECTOR CORREGIDO - Sincronizado con reducer actualizado
  const {
    activeCategory,
    activeSubcategory,
    activeArticle,
    categoryInfo,
    children,
    posts,
    postsLoading,
    postsError,
    hasMorePosts,
    postsCurrentPage,
    postsTotalPages
  } = useSelector((state) => {
    const catState = state.category || {};
    
    console.log('🔍 CategoryPage - Selector State:', {
      posts: catState.posts?.length || 0,
      postsLoading: catState.postsLoading,
      postsError: catState.postsError,
      hasMorePosts: catState.hasMorePosts,
      postsCurrentPage: catState.postsCurrentPage,
      postsTotalPages: catState.postsTotalPages,
      categoryInfo: catState.categoryInfo?.name,
      children: catState.children?.length || 0
    });
    
    return {
      activeCategory: catState.activeCategory,
      activeSubcategory: catState.activeSubcategory,
      activeArticle: catState.activeArticle,
      categoryInfo: catState.categoryInfo || {},
      children: catState.children || [],
      posts: catState.posts || [],
      postsLoading: catState.postsLoading || false,
      postsError: catState.postsError || null,
      hasMorePosts: catState.hasMorePosts || false,
      postsCurrentPage: catState.postsCurrentPage || 0,
      postsTotalPages: catState.postsTotalPages || 0
    };
  });

  const currentLevel = articleSlug ? 3 : subSlug ? 2 : 1;

  // ⭐ DEBUG MEJORADO
  useEffect(() => {
    console.log('📊 CategoryPage - Estado actual:', {
      params: { slug, subSlug, articleSlug },
      nivel: currentLevel,
      postsCount: posts.length,
      postsLoading,
      postsError,
      hasMorePosts,
      postsCurrentPage,
      postsTotalPages,
      categoryName: categoryInfo.name || 'Sin nombre',
      childrenCount: children.length,
      isFetching: isFetchingRef.current
    });
    
    // ⭐ Mostrar primeros 3 posts para debug
    if (posts.length > 0 && process.env.NODE_ENV === 'development') {
      console.log('📦 Primeros 3 posts:', posts.slice(0, 3));
    }
  }, [slug, subSlug, articleSlug, posts, postsLoading, postsError, hasMorePosts]);

  // ⭐ Carga inicial CORREGIDA - SIN resetCategoryPosts
  useEffect(() => {
    if (!slug) return;

    const currentParams = { slug, subSlug, articleSlug };
    const prevParams = prevParamsRef.current;
    
    // Verificar si los parámetros cambiaron
    const paramsChanged = 
      slug !== prevParams.slug || 
      subSlug !== prevParams.subSlug || 
      articleSlug !== prevParams.articleSlug;

    // ⭐ CRÍTICO: Si cambian parámetros, resetear estado
    if (paramsChanged) {
      console.log('🔄 Parámetros cambiaron:', {
        anterior: prevParams,
        nuevo: currentParams
      });
      
      // ⭐ OPCIÓN 1: Usar resetCategoryState (más agresivo)
      // dispatch(resetCategoryState());
      
      // ⭐ OPCIÓN 2: Usar setActiveCategory que YA limpia posts
      // (setActiveCategory limpia posts en el reducer según vimos antes)
      dispatch(setActiveCategory(slug));
      if (subSlug) dispatch(setActiveSubcategory(subSlug));
      if (articleSlug) dispatch(setActiveArticle(articleSlug));
      
      initialLoadRef.current = false;
      isFetchingRef.current = false;
    }

    // Si es la primera carga o cambiaron parámetros, cargar posts
    if ((!initialLoadRef.current || paramsChanged) && !postsLoading && !isFetchingRef.current) {
      console.log('🔄 CategoryPage: Iniciando carga de posts', currentParams);
      
      initialLoadRef.current = true;
      isFetchingRef.current = true;
      
      // ⭐ CARGAR POSTS - Página 1
      dispatch(getCategoryPosts(slug, subSlug, articleSlug, 1, 12))
        .then((data) => {
          console.log('✅ Posts cargados exitosamente:', {
            posts: data.posts?.length || 0,
            hasMore: data.hasMore,
            total: data.total
          });
        })
        .catch((error) => {
          console.error('❌ Error al cargar posts:', error);
          initialLoadRef.current = false; // Permitir reintento
        })
        .finally(() => {
          isFetchingRef.current = false;
        });
      
      prevParamsRef.current = currentParams;
    }
  }, [dispatch, slug, subSlug, articleSlug, postsLoading]);

  // ⭐ Manejar scroll infinito - COMPLETAMENTE CORREGIDO
  const fetchMorePosts = useCallback(() => {
    // ⭐ CONDICIONES MÁS ESTRICTAS
    const puedeCargarMas = (
      hasMorePosts && 
      !postsLoading && 
      !isFetchingRef.current && 
      slug && 
      postsCurrentPage >= 0
    );
    
    if (puedeCargarMas) {
      console.log('📜 CategoryPage: Cargando más posts...', {
        paginaActual: postsCurrentPage,
        siguientePagina: postsCurrentPage + 1,
        postsActuales: posts.length,
        tieneMas: hasMorePosts
      });
      
      isFetchingRef.current = true;
      
      dispatch(loadMorePosts())
        .then((data) => {
          console.log('✅ Posts adicionales cargados:', {
            nuevosPosts: data.posts?.length || 0,
            totalAhora: posts.length + (data.posts?.length || 0),
            sigueTeniendoMas: data.hasMore
          });
        })
        .catch((error) => {
          console.error('❌ Error al cargar más posts:', error);
        })
        .finally(() => {
          isFetchingRef.current = false;
        });
    } else {
      console.log('⏹️ No se puede cargar más posts:', {
        hasMorePosts,
        postsLoading,
        isFetching: isFetchingRef.current,
        slug,
        postsCurrentPage
      });
    }
  }, [dispatch, hasMorePosts, postsLoading, slug, postsCurrentPage, posts.length]);

  // ⭐ Mostrar loading inicial MEJORADO
  const showInitialLoading = postsLoading && posts.length === 0 && !postsError;

  if (showInitialLoading) {
    return (
      <div className="min-vh-100 d-flex flex-column">
        <Header />
        <Container className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <Spinner animation="border" variant="primary" size="lg" />
            <p className="mt-3">Cargando productos de {slug}...</p>
            <p className="text-muted small">
              Buscando productos en esta categoría y sus subcategorías
            </p>
          </div>
        </Container>
      </div>
    );
  }

  // ⭐ Mostrar error MEJORADO
  if (postsError && posts.length === 0) {
    return (
      <div className="min-vh-100 d-flex flex-column">
        <Header />
        <Container className="flex-grow-1 d-flex align-items-center justify-content-center">
          <Alert variant="danger" className="text-center" style={{ maxWidth: '500px' }}>
            <div className="mb-3">
              <span style={{ fontSize: '48px' }}>⚠️</span>
            </div>
            <h4 className="alert-heading">Error al cargar productos</h4>
            <p>{postsError}</p>
            <div className="d-flex gap-2 justify-content-center">
              <Button 
                variant="outline-danger" 
                onClick={() => {
                  initialLoadRef.current = false;
                  dispatch(getCategoryPosts(slug, subSlug, articleSlug, 1, 12));
                }}
              >
                <i className="fas fa-redo me-2"></i>
                Reintentar
              </Button>
              <Button 
                variant="outline-secondary"
                onClick={() => history.push('/')}
              >
                <i className="fas fa-home me-2"></i>
                Volver al inicio
              </Button>
            </div>
          </Alert>
        </Container>
      </div>
    );
  }

  const handleSubcategoryClick = (subSlug) => {
    if (currentLevel === 1) {
      console.log('👉 Navegando a subcategoría:', subSlug);
      history.push(`/category/${slug}/${subSlug}`);
    }
  };

  const handleArticleClick = (articleSlug) => {
    if (currentLevel === 2) {
      console.log('👉 Navegando a artículo:', articleSlug);
      history.push(`/category/${slug}/${subSlug}/${articleSlug}`);
    }
  };

  const buildBreadcrumbItems = () => {
    const items = [{ label: 'Inicio', path: '/' }];
    
    if (slug) {
      items.push({ 
        label: categoryInfo.name || slug, 
        path: `/category/${slug}` 
      });
    }
    
    if (subSlug && currentLevel >= 2) {
      items.push({ 
        label: subSlug, 
        path: `/category/${slug}/${subSlug}` 
      });
    }
    
    if (articleSlug && currentLevel === 3) {
      items.push({ 
        label: articleSlug, 
        path: `/category/${slug}/${subSlug}/${articleSlug}` 
      });
    }
    
    return items;
  };

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      
      <main className="flex-grow-1">
        <Container className="py-4">
          {/* Breadcrumb */}
          <BreadcrumbNav items={buildBreadcrumbItems()} />
          
          {/* Título de la categoría */}
          <Row className="mb-4">
            <Col>
              <h1 className="h2 mb-2">
                {categoryInfo.name || slug}
                {categoryInfo.emoji && (
                  <span className="ms-2">{categoryInfo.emoji}</span>
                )}
              </h1>
              {categoryInfo.description && (
                <p className="text-muted">{categoryInfo.description}</p>
              )}
            </Col>
          </Row>

          {/* Slider dinámico según nivel */}
          {currentLevel === 1 && children.length > 0 && (
            <section className="mb-5">
              <h3 className="h5 mb-3">Subcategorías</h3>
              <SubCategorySlider 
                subcategories={children}
                onSubcategoryClick={handleSubcategoryClick}
              />
            </section>
          )}

          {currentLevel === 2 && children.length > 0 && (
            <section className="mb-5">
              <h3 className="h5 mb-3">Artículos</h3>
              <ArticleSlider 
                articles={children}
                onArticleClick={handleArticleClick}
              />
            </section>
          )}

          {/* Posts */}
          <section>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h4 mb-0">
                {posts.length > 0 ? `Productos (${posts.length})` : 'Productos'}
              </h2>
              {posts.length > 0 && (
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => history.push('/create-post')}
                >
                  <i className="fas fa-plus me-1"></i>
                  Crear producto
                </Button>
              )}
            </div>

            {posts.length > 0 ? (
              <InfiniteScroll
                dataLength={posts.length}
                next={fetchMorePosts}
                hasMore={hasMorePosts}
                loader={
                  postsLoading ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" variant="primary" size="sm" />
                      <span className="ms-2 text-muted">Cargando más productos...</span>
                    </div>
                  ) : null
                }
                endMessage={
                  !hasMorePosts && posts.length > 0 ? (
                    <div className="text-center py-4">
                      <div className="mb-2">
                        <span style={{ fontSize: '32px' }}>🎉</span>
                      </div>
                      <p className="text-muted mb-0">
                        ¡Has visto todos los {posts.length} productos!
                      </p>
                      <small className="text-muted">
                        Página {postsCurrentPage + 1} de {Math.max(postsTotalPages, 1)}
                      </small>
                    </div>
                  ) : null
                }
                scrollThreshold={0.8}
                style={{ overflow: 'hidden' }}
              >
                <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                  {posts.map((post, index) => (
                    <Col key={post._id || `post-${index}`}>
                      <PostCard 
                        post={post}
                        onClick={() => {
                          console.log('🖱️ Click en post:', post._id);
                          history.push(`/post/${post._id}`);
                        }}
                      />
                    </Col>
                  ))}
                </Row>
              </InfiniteScroll>
            ) : (
              <div className="text-center py-5">
                <div className="mb-4">
                  <span style={{ fontSize: '64px' }}>📭</span>
                </div>
                <h3 className="h4 mb-3">No hay productos en esta categoría</h3>
                <p className="text-muted mb-4" style={{ maxWidth: '500px', margin: '0 auto' }}>
                  La categoría <strong>"{categoryInfo.name || slug}"</strong> no tiene productos publicados.
                  {children.length > 0 ? ' Prueba explorando las subcategorías:' : ''}
                </p>
                
                {currentLevel === 1 && children.length > 0 && (
                  <div className="mb-4">
                    <p className="mb-3">Explora estas subcategorías:</p>
                    <div className="d-flex flex-wrap justify-content-center gap-2">
                      {children.slice(0, 6).map((child) => (
                        <Button
                          key={child._id}
                          variant="outline-primary"
                          onClick={() => handleSubcategoryClick(child.slug)}
                          className="d-flex align-items-center"
                        >
                          {child.emoji && <span className="me-2">{child.emoji}</span>}
                          {child.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                  <Button 
                    variant="primary"
                    onClick={() => history.push('/create-post')}
                    className="px-4"
                  >
                    <i className="fas fa-plus me-2"></i>
                    Crear un producto aquí
                  </Button>
                  <Button 
                    variant="outline-secondary"
                    onClick={() => history.push('/')}
                  >
                    <i className="fas fa-home me-2"></i>
                    Volver al inicio
                  </Button>
                </div>
              </div>
            )}

            {/* ⭐ DEBUG PARA DESARROLLO */}
            {process.env.NODE_ENV === 'development' && (
              <Row className="mt-4">
                <Col className="text-center">
                  <div className="card border-info">
                    <div className="card-body py-2">
                      <small className="text-info">
                        <strong>DEBUG:</strong> Página {postsCurrentPage + 1} | 
                        Total: {posts.length} | 
                        HasMore: {hasMorePosts ? 'Sí' : 'No'} | 
                        Loading: {postsLoading ? 'Sí' : 'No'} |
                        Error: {postsError ? 'Sí' : 'No'}
                      </small>
                      <div className="mt-1">
                        <Button
                          variant="outline-info"
                          size="sm"
                          onClick={fetchMorePosts}
                          disabled={!hasMorePosts || postsLoading}
                        >
                          {postsLoading ? 'Cargando...' : 'Forzar carga más'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            )}
          </section>
        </Container>
      </main>
    </div>
  );
};

export default CategoryPage;