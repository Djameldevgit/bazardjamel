// 📂 pages/CategoryPage.js
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { Container, Spinner, Row, Col } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

import { getCategoryPosts, resetCategoryPosts } from "../../redux/actions/categoryAction";
import { getBoutiquesByCategory, resetAllBoutiques } from "../../redux/actions/boutiqueAction";
import BreadcrumbNav from "../../components/BreadcrumbNav";
import SliderUnificado from "../../components/SlidersCategories/SliderUnificado";
import PostCard from "../../components/PostCard";
import BoutiqueCard from "../../components/BoutiqueCard";
import PaginationComponent from "../../components/PaginationComponent";
import CategoryCarousel from "../../components/SlidersCategories/CategoryCarousel";

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
  // Estado para posts normales
  const {
    categoryInfo = {},
    posts = [],
    postsLoading = false,
    hasMorePosts = true,
    pagination: rawPagination = {}
  } = useSelector((state) => state.category || {});

  // Obtener hijos para posts normales desde categoryInfo
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

  // ============ ESTADO LOCAL PARA FILTROS Y UI ============
  const [allChildren, setAllChildren] = useState([]);
  const [currentSub, setCurrentSub] = useState(null);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [error, setError] = useState(null);
  
  // Estado para filtros (sin recarga de página)
  const [filters, setFilters] = useState({
    sub: subSlug || null,
    article: articleSlug || null,
    page: parseInt(page) || 1
  });

  const currentPage = filters.page;

  // ============ ACTUALIZAR URL SIN RECARGAR ============
  const updateUrlWithoutReload = useCallback((newFilters) => {
    // Construir nueva URL
    let basePath = `/${slug}`;
    
    if (newFilters.sub) {
      basePath += `/${newFilters.sub}`;
      if (newFilters.article) {
        basePath += `/${newFilters.article}`;
      }
    }
    
    basePath += `/${newFilters.page}`;
    
    // Actualizar URL sin recargar el componente
    history.replace(basePath, { filters: newFilters });
  }, [slug, history]);

  // ============ LOGS DE DEPURACIÓN ============
  useEffect(() => {
    console.log('🔍 CategoryPage - Estado:', {
      slug,
      isBoutique,
      filters,
      postsCount: posts.length,
      boutiquesCount: boutiques.length,
      allChildrenCount: allChildren.length,
      categoryChildrenCount: categoryChildren.length,
      categoryPath
    });
  }, [slug, isBoutique, filters, posts.length, boutiques.length, allChildren, categoryChildren, categoryPath]);

  // ============ REDIRECCIÓN SEGURA (solo si no hay page) ============
  useEffect(() => {
    if (!slug) return;

    if (!page) {
      if (articleSlug) history.replace(`/${slug}/${subSlug}/${articleSlug}/1`);
      else if (subSlug) history.replace(`/${slug}/${subSlug}/1`);
      else history.replace(`/${slug}/1`);
      return;
    }
  }, [slug, subSlug, articleSlug, page, history]);

  // ============ CARGA INICIAL Y CUANDO CAMBIAN FILTROS ============
  useEffect(() => {
    if (!slug) return;

    const loadData = async () => {
      try {
        if (isBoutique) {
          console.log('🔄 Cargando boutiques...', { slug, sub: filters.sub, page: filters.page });
          const res = await dispatch(getBoutiquesByCategory(slug, filters.sub, filters.page, 12));
          if (res?.children) {
            console.log('✅ Hijos de boutique recibidos:', res.children.length);
            setAllChildren(res.children);
            
            // Actualizar currentSub si hay sub en filtros
            if (filters.sub) {
              const foundSub = res.children.find((c) => c.slug === filters.sub);
              setCurrentSub(foundSub || null);
            }
          }
        } else {
          console.log('🔄 Cargando posts...', { slug, sub: filters.sub, article: filters.article, page: filters.page });
          const res = await dispatch(getCategoryPosts(slug, filters.sub, filters.article, filters.page, 12));
          if (res?.children) {
            console.log('✅ Hijos de posts recibidos:', res.children.length);
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
  }, [slug, filters, dispatch, isBoutique]);

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
      items.push({ label: nombreCategoria, path: `/${slug}/1` });
    }
    
    if (currentSub) {
      items.push({ 
        label: currentSub.name, 
        path: `/${slug}/${currentSub.slug}/1` 
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

  // ============ CARGAR MÁS (INFINITE SCROLL) ============
  const loadMore = useCallback(() => {
    if (isBoutique) {
      if (!hasMoreBoutiques || boutiquesLoading) return;
      
      const nextPage = filters.page + 1;
      const newFilters = { ...filters, page: nextPage };
      
      setFilters(newFilters);
      updateUrlWithoutReload(newFilters);
      dispatch(getBoutiquesByCategory(slug, filters.sub, nextPage, 12));
      
    } else {
      if (!hasMorePosts || postsLoading || posts.length >= POSTS_SCROLL_LIMIT) return;
      
      const nextPage = filters.page + 1;
      const newFilters = { ...filters, page: nextPage };
      
      setFilters(newFilters);
      updateUrlWithoutReload(newFilters);
      dispatch(getCategoryPosts(slug, filters.sub, filters.article, nextPage, 12));
    }
  }, [isBoutique, hasMoreBoutiques, boutiquesLoading, hasMorePosts, postsLoading, posts.length, 
      filters, dispatch, slug, updateUrlWithoutReload]);

  // ============ CLICK EN SLIDER (SIN RECARGAR) ============
  const handleSliderClick = useCallback((item) => {
    console.log('🖱️ Click en slider SIN RECARGAR:', item);
    
    let newFilters;
    
    if (isBoutique) {
      // Para boutiques: solo nivel 2
      newFilters = {
        sub: item.slug,
        article: null,
        page: 1
      };
      
      setFilters(newFilters);
      updateUrlWithoutReload(newFilters);
      
      // Cargar boutiques de esta subcategoría
      dispatch(getBoutiquesByCategory(slug, item.slug, 1, 12));
      
      // Actualizar UI
      setCurrentSub(item);
      setCurrentArticle(null);
      
    } else {
      // Para posts
      if (!item.articles || item.articles.length === 0) {
        // Es subcategoría final - cargar posts
        newFilters = {
          sub: item.slug,
          article: null,
          page: 1
        };
        
        setFilters(newFilters);
        updateUrlWithoutReload(newFilters);
        
        dispatch(getCategoryPosts(slug, item.slug, null, 1, 12));
        setCurrentSub(item);
        setCurrentArticle(null);
        
      } else {
        // Es subcategoría con artículos - solo mostrar artículos en slider
        setCurrentSub(item);
        setCurrentArticle(null);
        
        // No cambiar URL ni cargar posts todavía
        // El usuario debe hacer click en un artículo para ver posts
      }
    }
  }, [slug, dispatch, isBoutique, updateUrlWithoutReload]);

  // ============ CLICK EN ARTÍCULO (NIVEL 3) ============
  const handleArticleClick = useCallback((article) => {
    console.log('🖱️ Click en artículo SIN RECARGAR:', article);
    
    if (!currentSub) return;
    
    const newFilters = {
      sub: currentSub.slug,
      article: article.slug,
      page: 1
    };
    
    setFilters(newFilters);
    updateUrlWithoutReload(newFilters);
    
    // Cargar posts filtrados por este artículo
    dispatch(getCategoryPosts(slug, currentSub.slug, article.slug, 1, 12));
    
    // Actualizar UI
    setCurrentArticle(article);
  }, [slug, currentSub, dispatch, updateUrlWithoutReload]);

  // ============ DETERMINAR ITEMS DEL SLIDER =================
  const getSliderItems = () => {
    // Para boutiques
    if (isBoutique) {
      if (allChildren.length > 0) return allChildren;
      if (categoryChildren.length > 0) return categoryChildren;
      return [];
    }

    // Para posts normales
    // Si hay subcategoría con artículos, mostrar los artículos
    if (currentSub && currentSub.articles?.length > 0) {
      return currentSub.articles;
    }
    
    // Si no, mostrar las subcategorías
    if (allChildren.length > 0) return allChildren;
    if (categoryChildren.length > 0) return categoryChildren;
    
    return [];
  };

  // ================= DETERMINAR ITEM ACTIVO =================
  const getActiveItem = () => {
    if (isBoutique) return currentSub;
    if (currentArticle) return currentArticle;
    if (currentSub) return currentSub;
    return null;
  };

  // ============ GENERAR URL PARA PAGINACIÓN ============
  const buildCategoryUrl = (pageNumber) => {
    if (isBoutique) {
      if (currentSub) return `/${slug}/${currentSub.slug}/${pageNumber}`;
      return `/${slug}/${pageNumber}`;
    } else {
      if (currentArticle) return `/${slug}/${currentSub?.slug}/${currentArticle.slug}/${pageNumber}`;
      if (currentSub) return `/${slug}/${currentSub.slug}/${pageNumber}`;
      return `/${slug}/${pageNumber}`;
    }
  };

  // ============ MANEJAR CAMBIO DE PÁGINA ============
  const handlePageChange = (newPage) => {
    const newFilters = { ...filters, page: newPage };
    
    setFilters(newFilters);
    updateUrlWithoutReload(newFilters);
    
    if (isBoutique) {
      dispatch(getBoutiquesByCategory(slug, filters.sub, newPage, 12));
    } else {
      dispatch(getCategoryPosts(slug, filters.sub, filters.article, newPage, 12));
    }
  };

  // ============ ESTADO DE CARGA Y DATOS ============
  const isLoading = isBoutique ? boutiquesLoading : postsLoading;
  const items = isBoutique ? boutiques : posts;
  const hasMore = isBoutique ? hasMoreBoutiques : hasMorePosts;
  const paginationData = isBoutique ? boutiquePagination : rawPagination;

  // ============ RENDER DEL CONTENIDO ============
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
        <Container className="py-4">
          {/* Breadcrumb */}
          <div className="mb-3">
            <BreadcrumbNav items={buildBreadcrumbItems()} />
          </div>

          {/* Slider de categorías - AHORA USA handleSliderClick y handleArticleClick */}
          {getSliderItems().length > 0 && (
            <div className="mb-4">
              <SliderUnificado
                items={getSliderItems()}
                activeItem={getActiveItem()}
                variant="categoryPage"
                showCount={true}
                maxRows={2}
                onItemClick={isBoutique || !currentSub?.articles?.length 
                  ? handleSliderClick 
                  : handleArticleClick}
              />
            </div>
          )}

          {/* Título de la sección */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">
              {isBoutique ? 'Boutiques' : 'Annonces'}
              {currentSub && <span className="text-muted ms-2">- {currentSub.name}</span>}
              {currentArticle && <span className="text-muted ms-2">- {currentArticle.name}</span>}
            </h4>
            <span className="text-muted">
              {items.length} résultat{items.length > 1 ? 's' : ''}
            </span>
          </div>

          {/* Contenido principal */}
          <section className="content-section">
            {renderContent()}
          </section>
        </Container>
      </main>
    </div>
  );
};

export default CategoryPage;