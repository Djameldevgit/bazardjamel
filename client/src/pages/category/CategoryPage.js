// src/pages/CategoryPage.jsx - VERSIÓN CORREGIDA
import React, { useEffect, useCallback, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { 
  getCategoryPosts, 
  loadMorePosts,
  resetCategoryState
} from '../../redux/actions/categoryAction';
import { 
  Container, 
  Row, 
  Col, 
  Spinner, 
  Alert,
  Button,
  Badge
} from 'react-bootstrap';
import InfiniteScroll from 'react-infinite-scroll-component';
import Header from '../../components/SlidersCategories/HeaderCarousel';
import BreadcrumbNav from '../../components/BreadcrumbNav';
import SubCategorySlider from '../../components/SlidersCategories/SubCategoriesSlider';
import ArticleSlider from '../../components/SlidersCategories/ArticleSlider';
import PostCard from '../../components/PostCard';

const CategoryPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { slug, subSlug, articleSlug } = useParams();
  
  // Refs para control
  const initialLoadRef = useRef(false);
  const isFetchingRef = useRef(false);
  const prevParamsRef = useRef({ slug: null, subSlug: null, articleSlug: null });
  
  // Estado local
  const [currentArticle, setCurrentArticle] = useState(null);
  const [childrenToShow, setChildrenToShow] = useState([]);

  // Selector
  const {
    categoryInfo,
    children,  // ⚠️ Esto es lo que viene del backend
    posts,
    postsLoading,
    postsError,
    hasMorePosts
  } = useSelector((state) => state.category || {});

  // Determinar nivel actual
  const currentLevel = articleSlug ? 3 : subSlug ? 2 : 1;

  // ⭐⭐ LÓGICA CRÍTICA: Filtrar children según nivel
  useEffect(() => {
    console.log('🔍 PROCESANDO CHILDREN DEL BACKEND:', {
      nivelActual: currentLevel,
      slug,
      subSlug,
      articleSlug,
      totalChildrenRecibidos: children?.length || 0,
      childrenEjemplo: children?.slice(0, 3)
    });

    // Si no hay children, no hacer nada
    if (!children || children.length === 0) {
      setChildrenToShow([]);
      setCurrentArticle(null);
      return;
    }

    // Verificar estructura de los children
    const primerChild = children[0];
    console.log('🔬 ESTRUCTURA DEL PRIMER CHILD:', {
      nombre: primerChild.name,
      slug: primerChild.slug,
      level: primerChild.level,
      parent: primerChild.parent,
      // Mostrar todas las propiedades
      propiedades: Object.keys(primerChild)
    });

    // ⭐⭐ ESTRATEGIA INTELIGENTE:
    // 1. Si los children tienen propiedad 'level', filtrar por ella
    // 2. Si no tienen 'level', usar lógica basada en slugs

    if (primerChild.level !== undefined) {
      // CASO 1: Los children tienen propiedad 'level'
      console.log('🎯 Children tienen propiedad level');
      
      if (currentLevel === 1) {
        // Nivel 1: Mostrar children con level = 2 (subcategorías)
        const subcategories = children.filter(child => child.level === 2);
        console.log('📋 Subcategorías (nivel 2):', subcategories.map(s => s.name));
        setChildrenToShow(subcategories);
      } 
      else if (currentLevel === 2) {
        // Nivel 2: Mostrar children con level = 3 (artículos)
        const articles = children.filter(child => child.level === 3);
        console.log('📋 Artículos (nivel 3):', articles.map(a => a.name));
        setChildrenToShow(articles);
        
        // Detectar si el backend está devolviendo datos incorrectos
        if (articles.length === 0 && children.some(c => c.level === 2)) {
          console.warn('⚠️ BACKEND DEVUELVE SUB CATEGORÍAS EN VEZ DE ARTÍCULOS');
          // Mostrar mensaje de error o intentar corregir
        }
      }
      else if (currentLevel === 3) {
        // Nivel 3: Mostrar children con level = 3 (artículos), marcando el activo
        const articles = children.filter(child => child.level === 3);
        setChildrenToShow(articles);
        
        // Marcar artículo actual
        if (articleSlug) {
          const foundArticle = articles.find(article => article.slug === articleSlug);
          setCurrentArticle(foundArticle || null);
        }
      }
    } else {
      // CASO 2: Los children NO tienen propiedad 'level'
     
      // Aquí necesitamos una lógica diferente basada en tu estructura de datos
      // Por ejemplo, podrías tener una propiedad 'type' o analizar la profundidad
      
      // ESTRATEGIA TEMPORAL: Mostrar todos los children y dejar que el backend filtre
      setChildrenToShow(children);
      
      if (currentLevel === 3 && articleSlug) {
        const foundArticle = children.find(child => child.slug === articleSlug);
        setCurrentArticle(foundArticle || null);
      }
    }

  }, [currentLevel, children, slug, subSlug, articleSlug]);

  // ⭐⭐ Carga inicial de posts
  useEffect(() => {
    if (!slug) return;

    const currentParams = { slug, subSlug, articleSlug };
    const prevParams = prevParamsRef.current;
    
    const paramsChanged = 
      slug !== prevParams.slug || 
      subSlug !== prevParams.subSlug || 
      articleSlug !== prevParams.articleSlug;

    if (paramsChanged) {
      console.log('🔄 Cambio de URL, recargando datos...');
      dispatch(resetCategoryState());
      initialLoadRef.current = false;
      isFetchingRef.current = false;
    }

    if ((!initialLoadRef.current || paramsChanged) && !postsLoading && !isFetchingRef.current) {
      console.log('📡 Llamando a getCategoryPosts con:', {
        slug,
        subSlug,
        articleSlug,
        nivel: currentLevel
      });
      
      initialLoadRef.current = true;
      isFetchingRef.current = true;
      
      // ⭐⭐ IMPORTANTE: El backend debe filtrar los children según los slugs
      dispatch(getCategoryPosts(slug, subSlug, articleSlug, 1, 12))
        .then((response) => {
          console.log('✅ Respuesta del backend:', {
            categoryInfo: response.categoryInfo,
            childrenRecibidos: response.children?.length || 0,
            primerChild: response.children?.[0]
          });
        })
        .catch((error) => {
          console.error('❌ Error:', error);
        })
        .finally(() => {
          isFetchingRef.current = false;
        });
      
      prevParamsRef.current = currentParams;
    }
  }, [dispatch, slug, subSlug, articleSlug, postsLoading, currentLevel]);

  // ⭐⭐ DEPURACIÓN: Ver qué acción se está ejecutando
  useEffect(() => {
    console.log('📊 ESTADO ACTUAL:', {
      nivel: currentLevel,
      url: location.pathname,
      childrenToShow: childrenToShow.length,
      childrenToShowNombres: childrenToShow.map(c => c.name),
      childrenOriginales: children?.length || 0,
      childrenOriginalesNombres: children?.map(c => c.name)
    });
  }, [currentLevel, location.pathname, childrenToShow, children]);

  // Handlers
  const handleSubcategoryClick = (subcategory) => {
    console.log('👉 Navegando a subcategoría:', subcategory.name);
    history.push(`/category/${slug}/${subcategory.slug}`);
  };

  const handleArticleClick = (article) => {
    console.log('👉 Navegando a artículo:', article.name);
    history.push(`/category/${slug}/${subSlug}/${article.slug}`);
  };

  // Determinar qué slider mostrar
  const shouldShowSubcategorySlider = currentLevel === 1 && childrenToShow.length > 0;
  const shouldShowArticleSlider = (currentLevel === 2 || currentLevel === 3) && childrenToShow.length > 0;

  // Resto del componente (igual que antes)...
  const getPageTitle = () => {
    if (currentLevel === 1) {
      return categoryInfo?.name || slug;
    } else if (currentLevel === 2) {
      const subcategory = children?.find(c => c.slug === subSlug);
      return subcategory?.name || subSlug?.replace(/-/g, ' ') || '';
    } else if (currentLevel === 3) {
      return currentArticle?.name || articleSlug?.replace(/-/g, ' ') || '';
    }
    return '';
  };

  const buildBreadcrumbItems = () => {
    const items = [{ label: 'Inicio', path: '/' }];
    
    if (slug) {
      items.push({ 
        label: categoryInfo?.name || slug, 
        path: `/category/${slug}` 
      });
    }
    
    if (subSlug && currentLevel >= 2) {
      const subcategory = children?.find(c => c.slug === subSlug);
      items.push({ 
        label: subcategory?.name || subSlug.replace(/-/g, ' '), 
        path: `/category/${slug}/${subSlug}` 
      });
    }
    
    if (articleSlug && currentLevel === 3) {
      items.push({ 
        label: currentArticle?.name || articleSlug.replace(/-/g, ' '), 
        path: `/category/${slug}/${subSlug}/${articleSlug}` 
      });
    }
    
    return items;
  };

  // Loading inicial
  if (postsLoading && (!posts || posts.length === 0) && !postsError) {
    return (
      <div className="min-vh-100 d-flex flex-column">
        <Header />
        <Container className="flex-grow-1 d-flex align-items-center justify-content-center">
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Cargando productos...</p>
            <small className="text-muted d-block mt-2">
              Nivel: {currentLevel} | Slug: {slug} {subSlug && `| Sub: ${subSlug}`}
            </small>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      
      <main className="flex-grow-1">
        <Container className="py-4">
          {/* Breadcrumb */}
          <BreadcrumbNav items={buildBreadcrumbItems()} />
          
          {/* Título principal */}
          <Row className="mb-4">
            <Col>
              <h1 className="h2 mb-2">
                {getPageTitle()}
                <Badge bg={currentLevel === 1 ? 'primary' : currentLevel === 2 ? 'success' : 'info'} className="ms-2">
                  Nivel {currentLevel}
                </Badge>
                {currentArticle && (
                  <Badge bg="warning" className="ms-2">
                    Filtrado por: {currentArticle.name}
                  </Badge>
                )}
              </h1>
             
              
              {/* Info de filtro activo */}
              {currentLevel === 3 && currentArticle && (
                <Alert variant="success" className="mt-3 py-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <i className="fas fa-filter me-2"></i>
                      <strong>Filtro activo:</strong> {currentArticle.name}
                    </div>
                    <Button 
                      variant="outline-success" 
                      size="sm"
                      onClick={() => history.push(`/category/${slug}/${subSlug}`)}
                    >
                      <i className="fas fa-times me-1"></i>
                      Ver todos
                    </Button>
                  </div>
                </Alert>
              )}
            </Col>
          </Row>

          {/* ⭐⭐ SUBCATEGORY SLIDER */}
          {shouldShowSubcategorySlider && (
            <section className="mb-5">
             
              <SubCategorySlider 
                subcategories={childrenToShow}
                currentCategory={categoryInfo}
                onSubcategoryClick={handleSubcategoryClick}
              />
            </section>
          )}

          {/* ⭐⭐ ARTICLE SLIDER */}
          {shouldShowArticleSlider && (
            <section className="mb-5">
              <h3 className="h5 mb-3">
                {currentLevel === 2 ? 'Artículos disponibles' : 'Cambiar artículo'}
              </h3>
              <ArticleSlider 
                articles={childrenToShow}
                currentCategory={categoryInfo}
                currentSubcategory={{ 
                  slug: subSlug, 
                  name: children?.find(c => c.slug === subSlug)?.name || subSlug?.replace(/-/g, ' ') 
                }}
                currentArticle={currentArticle}
                onArticleClick={handleArticleClick}
              />
            </section>
          )}

          {/* Sección de Posts */}
          <section>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="h4 mb-0">
                {posts && posts.length > 0 ? `Productos (${posts.length})` : 'Productos'}
                {currentArticle && (
                  <span className="text-muted ms-2">
                    · Filtrado por: {currentArticle.name}
                  </span>
                )}
              </h2>
              <Button 
                variant="outline-primary" 
                size="sm"
                onClick={() => history.push('/create-post')}
              >
                <i className="fas fa-plus me-1"></i>
                Publicar producto
              </Button>
            </div>

            {/* Posts list */}
            {posts && posts.length > 0 ? (
              <InfiniteScroll
                dataLength={posts.length}
               
                hasMore={hasMorePosts}
                loader={
                  postsLoading && (
                    <div className="text-center py-3">
                      <Spinner animation="border" size="sm" />
                    </div>
                  )
                }
              >
                <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                  {posts.map((post) => (
                    <Col key={post._id}>
                      <PostCard 
                        post={post}
                        onClick={() => history.push(`/post/${post._id}`)}
                      />
                    </Col>
                  ))}
                </Row>
              </InfiniteScroll>
            ) : (
              <div className="text-center py-5">
                <div className="mb-3" style={{ fontSize: '3rem' }}>
                  📭
                </div>
                <h3 className="h4 mb-2">No hay productos</h3>
                <p className="text-muted mb-4">
                  {currentArticle 
                    ? `No se encontraron productos de ${currentArticle.name}`
                    : 'Esta categoría aún no tiene productos'
                  }
                </p>
              </div>
            )}
          </section>

          {/* ⭐⭐ DEBUG DETALLADO */}
          <div className="mt-4 p-3 border rounded bg-light">
          
            
            <div className="row">
            
              
              <div className="col-md-4">
                <p><strong>Primeros 3 Children:</strong></p>
                <ul className="list-unstyled small">
                  {childrenToShow.slice(0, 3).map((child, i) => (
                    <li key={i} className="mb-1">
                      <code>{child.name}</code> 
                      {child.level && <span className="ms-2 badge bg-secondary">Lvl: {child.level}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
};

export default CategoryPage;