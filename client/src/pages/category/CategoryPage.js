// 📂 pages/CategoryPage.js - VERSIÓN COMPLETA CON FILTRO
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { Container, Spinner, Row, Col, Button } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { Funnel } from 'react-bootstrap-icons';
import PostCard from "../../components/post-card/PostCard";
import { getCategoryPosts, resetCategoryPosts } from "../../redux/actions/categoryAction";
import { getBoutiquesByCategory, resetAllBoutiques } from "../../redux/actions/boutiqueAction";
import BreadcrumbNav from "../../components/BreadcrumbNav";
import SliderUnificado from "../../components/SlidersCategories/SliderUnificado";
import BoutiqueCard from "../../components/BoutiqueCard";
import PaginationComponent from "../../components/PaginationComponent";
import CategoryCarousel from "../../components/SlidersCategories/CategoryCarousel";
import FilterDrawer from "./FilterDrawer";

const POSTS_SCROLL_LIMIT = 50;

const CategoryPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { slug, subSlug, articleSlug, page } = useParams();

  // Detectar si es boutique
  const isBoutique = slug === 'boutiques';
  const { category } = useParams();
  const categoryData = useSelector(state => state.category.currentCategory);
  
  // ============ ESTADOS DE REDUX ============
  const {
    categoryInfo = {},
    posts = [],
    postsLoading = false,
    hasMorePosts = true,
    pagination: rawPagination = {}
  } = useSelector((state) => state.category || {});

  const categoryChildren = categoryInfo?.children || [];

  // Estado para boutiques
  const categoryPath = isBoutique && subSlug 
    ? `boutiques/${subSlug}` 
    : isBoutique 
      ? 'boutiques' 
      : null;

  const boutiqueCategoryData = useSelector((state) => 
    categoryPath ? state.boutique?.boutiquesByCategory[categoryPath] : null
  );

  const boutiques = boutiqueCategoryData?.boutiques || [];
  const boutiquesLoading = useSelector((state) => 
    categoryPath ? state.boutique?.loadingByCategory[categoryPath] : false
  );
  const hasMoreBoutiques = boutiqueCategoryData?.hasMore || false;
  const boutiquePagination = {
    currentPage: boutiqueCategoryData?.page || 1,
    totalPages: boutiqueCategoryData?.totalPages || 1,
    totalPosts: boutiqueCategoryData?.total || 0,
    limit: 12,
    hasMore: boutiqueCategoryData?.hasMore || false
  };

  // ============ ESTADO LOCAL ============
  const [allChildren, setAllChildren] = useState([]);
  const [currentSub, setCurrentSub] = useState(null);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [error, setError] = useState(null);
  
  // Estado para filtros - INICIALIZAR desde URL
  const [filters, setFilters] = useState({
    sub: subSlug || null,
    article: articleSlug || null,
    page: parseInt(page) || 1
  });

  // ============ ESTADO PARA FILTRO DRAWER ============
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [activeFilters, setActiveFilters] = useState(null);

  // ============ SINCRONIZAR ESTADO CON URL ============
  useEffect(() => {
    console.log('🔄 Sincronizando con URL:', { subSlug, articleSlug, page });
    setFilters({
      sub: subSlug || null,
      article: articleSlug || null,
      page: parseInt(page) || 1
    });
  }, [subSlug, articleSlug, page]);

  // ============ ACTUALIZAR URL (CON REEMPLAZO) ============
  const updateUrl = useCallback((newFilters) => {
    // Construir nueva URL
    let basePath = `/${slug}`;
    
    if (newFilters.sub) {
      basePath += `/${newFilters.sub}`;
      if (newFilters.article) {
        basePath += `/${newFilters.article}`;
      }
    }
    
    basePath += `/${newFilters.page}`;
    
    console.log('📍 Actualizando URL:', basePath);
    
    // Usar push para que el botón "atrás" del navegador funcione
    history.push(basePath);
  }, [slug, history]);

  // ============ LOGS ============
  useEffect(() => {
    console.log('🔍 CategoryPage - Estado:', {
      slug,
      isBoutique,
      filters,
      postsCount: posts.length,
      currentSub: currentSub?.name,
      currentArticle: currentArticle?.name,
      url: location.pathname
    });
  }, [slug, isBoutique, filters, posts.length, currentSub, currentArticle, location.pathname]);

  // ============ CARGA INICIAL ============
  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      try {
        if (isBoutique) {
          console.log('🔄 Cargando boutiques...', { slug, sub: filters.sub, page: filters.page });
          const res = await dispatch(getBoutiquesByCategory(slug, filters.sub, filters.page, 12));
          if (res?.children) {
            setAllChildren(res.children);
            
            if (filters.sub) {
              const foundSub = res.children.find((c) => c.slug === filters.sub);
              setCurrentSub(foundSub || null);
            }
          }
        } else {
          console.log('🔄 Cargando posts...', { slug, sub: filters.sub, article: filters.article, page: filters.page });
          const res = await dispatch(getCategoryPosts(slug, filters.sub, filters.article, filters.page, 12));
          if (res?.children) {
            setAllChildren(res.children);
            
            if (filters.sub) {
              const foundSub = res.children.find((c) => c.slug === filters.sub);
              setCurrentSub(foundSub || null);
              
              if (filters.article && foundSub?.articles) {
                const foundArticle = foundSub.articles.find((a) => a.slug === filters.article);
                setCurrentArticle(foundArticle || null);
              } else {
                setCurrentArticle(null);
              }
            } else {
              setCurrentSub(null);
              setCurrentArticle(null);
            }
          }
        }
      } catch (err) {
        console.error('❌ Error cargando datos:', err);
        setError(err.message);
      }
    };

    loadData();
  }, [slug, filters.sub, filters.article, filters.page, dispatch, isBoutique]);

  // ============ BREADCRUMB ============
  const buildBreadcrumbItems = () => {
    const items = [{ label: "Inicio", path: "/" }];
    
    if (slug) {
      let nombreCategoria = slug;
      if (isBoutique) {
        nombreCategoria = "Boutiques";
      } else if (categoryInfo?.name) {
        nombreCategoria = categoryInfo.name;
      }
      items.push({ 
        label: nombreCategoria, 
        path: `/${slug}/1`  // ← IMPORTANTE: incluir /1
      });
    }
    
    if (currentSub) {
      items.push({ 
        label: currentSub.name, 
        path: `/${slug}/${currentSub.slug}/1`  // ← IMPORTANTE: incluir /1
      });
    }
    
    if (!isBoutique && currentArticle) {
      items.push({
        label: currentArticle.name,
        path: `/${slug}/${currentSub?.slug}/${currentArticle.slug}/1`,
      });
    }
    
    return items;
  };

  // ============ MANEJAR CLICK EN BREADCRUMB ============
  const handleBreadcrumbClick = (path) => {
    console.log('🍞 Breadcrumb click:', path);
    history.push(path);
  };

  // ============ CARGAR MÁS ============
  const loadMore = useCallback(() => {
    if (isBoutique) {
      if (!hasMoreBoutiques || boutiquesLoading) return;
      
      const nextPage = filters.page + 1;
      const newFilters = { ...filters, page: nextPage };
      
      setFilters(newFilters);
      updateUrl(newFilters);
      dispatch(getBoutiquesByCategory(slug, filters.sub, nextPage, 12));
      
    } else {
      if (!hasMorePosts || postsLoading || posts.length >= POSTS_SCROLL_LIMIT) return;
      
      const nextPage = filters.page + 1;
      const newFilters = { ...filters, page: nextPage };
      
      setFilters(newFilters);
      updateUrl(newFilters);
      dispatch(getCategoryPosts(slug, filters.sub, filters.article, nextPage, 12));
    }
  }, [isBoutique, hasMoreBoutiques, boutiquesLoading, hasMorePosts, postsLoading, posts.length, 
      filters, dispatch, slug, updateUrl]);

  // ============ CLICK EN SLIDER ============
  const handleSliderClick = useCallback((item) => {
    console.log('🖱️ Click en slider:', item);
    
    let newFilters;
    
    if (isBoutique) {
      newFilters = {
        sub: item.slug,
        article: null,
        page: 1
      };
      
      setCurrentSub(item);
      setCurrentArticle(null);
      
    } else {
      // Determinar si es subcategoría (nivel 2) o artículo (nivel 3)
      const isSubCategory = item.level === 2;
      
      newFilters = {
        sub: item.slug,
        article: null,
        page: 1
      };
      
      if (isSubCategory) {
        setCurrentSub(item);
        setCurrentArticle(null);
      } else {
        setCurrentArticle(item);
        setCurrentSub(null);
      }
    }
    
    console.log('🎯 Nuevos filtros:', newFilters);
    
    setFilters(newFilters);
    updateUrl(newFilters);  // ← AHORA USA UPDATEURL CON PUSH
    
    if (isBoutique) {
      dispatch(getBoutiquesByCategory(slug, newFilters.sub, 1, 12));
    } else {
      dispatch(getCategoryPosts(slug, newFilters.sub, null, 1, 12));
    }
  }, [slug, dispatch, isBoutique, updateUrl]);

  // ============ CLICK EN ARTÍCULO ============
  const handleArticleClick = useCallback((article) => {
    console.log('🖱️ Click en artículo:', article);
    
    let subCategorySlug = currentSub?.slug;
    
    if (!subCategorySlug) {
      subCategorySlug = article.slug;
    }
    
    const newFilters = {
      sub: subCategorySlug,
      article: article.slug,
      page: 1
    };
    
    console.log('🎯 Nuevos filtros (artículo):', newFilters);
    
    setFilters(newFilters);
    updateUrl(newFilters);  // ← AHORA USA UPDATEURL CON PUSH
    
    dispatch(getCategoryPosts(slug, subCategorySlug, article.slug, 1, 12));
    
    setCurrentArticle(article);
    if (!currentSub) {
      setCurrentSub(article);
    }
  }, [slug, currentSub, dispatch, updateUrl]);

  // ============ DETERMINAR ITEMS DEL SLIDER ============
  const getSliderItems = () => {
    if (isBoutique) {
      if (allChildren.length > 0) return allChildren;
      if (categoryChildren.length > 0) return categoryChildren;
      return [];
    }

    if (currentSub && currentSub.articles?.length > 0) {
      return currentSub.articles;
    }
    
    if (allChildren.length > 0) return allChildren;
    if (categoryChildren.length > 0) return categoryChildren;
    
    return [];
  };

  // ============ DETERMINAR ITEM ACTIVO ============
  const getActiveItem = () => {
    if (isBoutique) return currentSub;
    if (currentArticle) return currentArticle;
    if (currentSub) return currentSub;
    return null;
  };

  // ============ MANEJAR CAMBIO DE PÁGINA ============
  const handlePageChange = (newPage) => {
    const newFilters = { ...filters, page: newPage };
    
    setFilters(newFilters);
    updateUrl(newFilters);
    
    if (isBoutique) {
      dispatch(getBoutiquesByCategory(slug, filters.sub, newPage, 12));
    } else {
      dispatch(getCategoryPosts(slug, filters.sub, filters.article, newPage, 12));
    }
  };

  // ============ MANEJAR APLICACIÓN DE FILTROS ============
  const handleApplyFilters = (filters) => {
    console.log('🎯 Aplicando filtros:', filters);
    setActiveFilters(filters);
    
    // Aquí puedes despachar una acción para cargar posts con filtros
    // Por ahora, solo guardamos los filtros
  };

  // ============ CONTAR FILTROS ACTIVOS ============
  const countActiveFilters = () => {
    if (!activeFilters) return 0;
    return Object.keys(activeFilters).filter(key => 
      activeFilters[key] && 
      activeFilters[key] !== '' && 
      activeFilters[key] !== 'recent'
    ).length;
  };

  // ============ RENDER ============
  const isLoading = isBoutique ? boutiquesLoading : postsLoading;
  const items = isBoutique ? boutiques : posts;
  const hasMore = isBoutique ? hasMoreBoutiques : hasMorePosts;
  const paginationData = isBoutique ? boutiquePagination : rawPagination;
  const activeFilterCount = countActiveFilters();

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center py-5">
          <i className="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
          <h5 className="text-danger">Error</h5>
          <p className="text-muted">{error}</p>
        </div>
      );
    }

    if (isLoading && items.length === 0) {
      return (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3 text-muted">
            {isBoutique ? 'Chargement des boutiques...' : 'Chargement des annonces...'}
          </p>
        </div>
      );
    }

    if (items.length > 0) {
      return (
        <>
          <InfiniteScroll
            key={filters.page}
            dataLength={items.length}
            hasMore={hasMore && (!isBoutique ? items.length < POSTS_SCROLL_LIMIT : true)}
            loader={
              <div className="text-center py-4">
                <Spinner animation="border" size="sm" variant="primary" />
                <p className="text-muted small mt-2">Chargement supplémentaire...</p>
              </div>
            }
            next={loadMore}
            scrollThreshold={0.9}
          >
            <Row xs={1} sm={2} md={3} lg={4} className="g-4">
              {items.map((item) => (
                <Col key={item._id}>
                  {isBoutique ? (
                    <BoutiqueCard boutique={item} />
                  ) : (
                    <PostCard post={item} />
                  )}
                </Col>
              ))}
            </Row>
          </InfiniteScroll>

          {paginationData.totalPages > 1 && (
            <div className="mt-4">
              <PaginationComponent
                currentPage={paginationData.currentPage}
                totalPages={paginationData.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      );
    }

    return (
      <div className="text-center py-5">
        <div className="mb-4">
          <i className={`fas fa-${isBoutique ? 'store' : 'box-open'} fa-4x text-secondary`}></i>
        </div>
        <h4 className="text-secondary mb-3">
          {isBoutique ? 'Aucune boutique trouvée' : 'Aucune annonce trouvée'}
        </h4>
        <p className="text-muted">
          {currentArticle
            ? `Aucun résultat pour "${currentArticle.name}"`
            : currentSub
              ? `Aucune ${isBoutique ? 'boutique' : 'annonce'} dans cette catégorie`
              : "Essayez une autre catégorie"}
        </p>
      </div>
    );
  };

  return (
    <div className="category-page">
      <CategoryCarousel
        categorySlug={category} 
        categoryName={categoryData?.name} 
      />

      <main className="category-content">
        <Container className=" ">
          {/* Slider de categorías */}
          {getSliderItems().length > 0 && (
            <div className="mb-4">
              <SliderUnificado
                items={getSliderItems()}
                activeItem={getActiveItem()}
                variant="categoryPage"
                showCount={true}
                maxRows={2}
                onItemClick={(item) => {
                  if (isBoutique) {
                    handleSliderClick(item);
                  } else if (item.level === 3) {
                    handleArticleClick(item);
                  } else {
                    handleSliderClick(item);
                  }
                }}
              />
            </div>
          )}
          
          {/* Breadcrumb con manejador de clicks */}
          <div className="mb-3">
            <BreadcrumbNav 
              items={buildBreadcrumbItems()} 
              onItemClick={handleBreadcrumbClick}
            />
          </div>
          
          {/* Título de la sección con botón de filtro */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="mb-0">
                {isBoutique ? 'Boutiques' : 'Annonces'}
                {currentSub && <span className="text-muted ms-2">- {currentSub.name}</span>}
                {currentArticle && <span className="text-muted ms-2">- {currentArticle.name}</span>}
              </h4>
              {activeFilterCount > 0 && (
                <small className="text-muted">
                  {activeFilterCount} filtre{activeFilterCount > 1 ? 's' : ''} actif
                  {activeFilterCount > 1 ? 's' : ''}
                </small>
              )}
            </div>
            
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">
                {items.length} résultat{items.length > 1 ? 's' : ''}
              </span>
              
              {/* Botón de filtro */}
              <Button
                variant={activeFilterCount > 0 ? "primary" : "outline-primary"}
                size="sm"
                onClick={() => setShowFilterDrawer(true)}
                className="d-flex align-items-center gap-2 rounded-pill"
                style={{
                  borderColor: '#667eea',
                  ...(activeFilterCount === 0 && { color: '#667eea' })
                }}
              >
                <Funnel size={16} />
                Filtres
                {activeFilterCount > 0 && (
                  <span style={{
                    backgroundColor: 'white',
                    color: '#667eea',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    fontSize: '11px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '4px'
                  }}>
                    {activeFilterCount}
                  </span>
                )}
              </Button>
            </div>
          </div>

          {/* Contenido principal */}
          <section className="content-section">
            {renderContent()}
          </section>
        </Container>
      </main>

      {/* Drawer de filtros */}
      <FilterDrawer
        show={showFilterDrawer}
        onHide={() => setShowFilterDrawer(false)}
        category={slug}
        currentSub={currentSub}
        currentArticle={currentArticle}
        onApplyFilters={handleApplyFilters}
      />

      {/* Estilos adicionales */}
      <style>{`
        .btn-outline-primary {
          border-color: #667eea;
          color: #667eea;
        }
        
        .btn-outline-primary:hover {
          background-color: #667eea;
          border-color: #667eea;
          color: white;
        }
        
        .btn-outline-primary:active {
          background-color: #5a67d8 !important;
          border-color: #5a67d8 !important;
        }
        
        .btn-primary {
          background-color: #667eea;
          border-color: #667eea;
        }
        
        .btn-primary:hover {
          background-color: #5a67d8;
          border-color: #5a67d8;
        }
      `}</style>
    </div>
  );
};

export default CategoryPage;