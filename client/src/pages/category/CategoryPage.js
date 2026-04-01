// 📂 pages/CategoryPage.jsx - VERSIÓN CORREGIDA

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { Container, Spinner, Row, Col, Button } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { Funnel } from 'react-bootstrap-icons';
import PostCard from "../../components/post-card/PostCard";
import { getCategoryPosts  } from "../../redux/actions/categoryAction";
import { getBoutiquesByCategory  } from "../../redux/actions/boutiqueAction";
import BreadcrumbNav from "../../components/BreadcrumbNav";
import SliderUnificado from "../../components/SlidersCategories/SliderUnificado";
import BoutiqueCard from "../../components/boutique/BoutiquePostCard";
import PaginationComponent from "../../components/PaginationComponent";
import CategoryCarousel from "../../components/SlidersCategories/CategoryCarousel";
import FilterDrawer from "./FilterDrawer";

const POSTS_SCROLL_LIMIT = 50;

const CategoryPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { slug, subSlug, articleSlug, page } = useParams();

  // 🔥 CORRECCIÓN: Redirigir si no hay página en la URL
  useEffect(() => {
    if (!page && !subSlug && !articleSlug) {
      console.log('🔄 Redirigiendo a /1 porque no hay página en la URL');
      history.replace(`/${slug}/1${location.search}`);
      return;
    }
    
    if (subSlug && !page) {
      console.log('🔄 Redirigiendo a /1 porque hay subcategoría pero no página');
      const newPath = articleSlug 
        ? `/${slug}/${subSlug}/${articleSlug}/1`
        : `/${slug}/${subSlug}/1`;
      history.replace(`${newPath}${location.search}`);
      return;
    }
  }, [slug, subSlug, articleSlug, page, history, location.search]);

  // 🔥 Detectar si es boutique
  const isBoutique = slug === 'boutiques';
  const { category } = useParams();
  const categoryData = useSelector(state => state.category.currentCategory);
  
  // ============ ESTADOS DE REDUX ============
  const {
    categoryInfo = {},
    posts = [],
    postsLoading = false,
    hasMorePosts = true,
    pagination: rawPagination = {},
    children: reduxChildren = []
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // 🔥 Estado para filtros con página por defecto 1
  const [filters, setFilters] = useState({
    sub: subSlug || null,
    article: articleSlug || null,
    page: page ? parseInt(page) : 1
  });

  // 🔥 ESTADO PARA FILTRO DRAWER
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [activeFilters, setActiveFilters] = useState(null);
  
  // ESTADO PARA METADATOS DE FILTROS
  const [filterMetadata, setFilterMetadata] = useState({
    wilayas: [],
    priceRange: { min: 0, max: 1000000 },
    appliedFilters: {}
  });

  // ============ CONTAR FILTROS ACTIVOS ============
  const countActiveFilters = () => {
    if (!activeFilters) return 0;
    let count = 0;
    
    if (activeFilters.wilaya && activeFilters.wilaya !== '') count++;
    if (activeFilters.commune && activeFilters.commune !== '') count++;
    if (!isBoutique) {
      if (activeFilters.minPrice && activeFilters.minPrice !== null) count++;
      if (activeFilters.maxPrice && activeFilters.maxPrice !== null) count++;
    }
    if (activeFilters.sortBy && activeFilters.sortBy !== 'recent') count++;
    
    return count;
  };

  const activeFilterCount = countActiveFilters();

  // ============ SINCRONIZAR ESTADO CON URL ============
  useEffect(() => {
    // Extraer parámetros de búsqueda de la URL
    const searchParams = new URLSearchParams(location.search);
    const wilaya = searchParams.get('wilaya') || '';
    const commune = searchParams.get('commune') || '';
    const minPrice = searchParams.get('minPrice') || null;
    const maxPrice = searchParams.get('maxPrice') || null;
    const sortBy = searchParams.get('sortBy') || 'recent';
    
    const newPage = page ? parseInt(page) : 1;
    
    console.log('🔄 Sincronizando con URL:', { 
      subSlug, 
      articleSlug, 
      page: newPage, 
      isBoutique,
      wilaya,
      commune,
      minPrice,
      maxPrice,
      sortBy
    });
    
    setFilters({
      sub: subSlug || null,
      article: articleSlug || null,
      page: newPage
    });
    
    setActiveFilters({
      wilaya,
      commune,
      minPrice: minPrice ? parseFloat(minPrice) : null,
      maxPrice: maxPrice ? parseFloat(maxPrice) : null,
      sortBy
    });
  }, [subSlug, articleSlug, page, isBoutique, location.search]);

  // ============ ACTUALIZAR URL ============
  const updateUrl = useCallback((newFilters, customActiveFilters = null) => {
    let basePath = `/${slug}`;
    
    if (newFilters.sub) {
      basePath += `/${newFilters.sub}`;
      if (!isBoutique && newFilters.article) {
        basePath += `/${newFilters.article}`;
      }
    }
    
    // Siempre añadir la página
    basePath += `/${newFilters.page || 1}`;
    
    // Usar los filtros activos pasados o los del estado
    const filtersToUse = customActiveFilters || activeFilters;
    
    // Añadir parámetros de búsqueda si hay filtros activos
    const searchParams = new URLSearchParams();
    if (filtersToUse?.wilaya && filtersToUse.wilaya !== '') {
      searchParams.set('wilaya', filtersToUse.wilaya);
    }
    if (filtersToUse?.commune && filtersToUse.commune !== '') {
      searchParams.set('commune', filtersToUse.commune);
    }
    if (!isBoutique && filtersToUse?.minPrice && filtersToUse.minPrice !== null) {
      searchParams.set('minPrice', filtersToUse.minPrice);
    }
    if (!isBoutique && filtersToUse?.maxPrice && filtersToUse.maxPrice !== null) {
      searchParams.set('maxPrice', filtersToUse.maxPrice);
    }
    if (filtersToUse?.sortBy && filtersToUse.sortBy !== 'recent') {
      searchParams.set('sortBy', filtersToUse.sortBy);
    }
    
    const finalPath = searchParams.toString() ? `${basePath}?${searchParams.toString()}` : basePath;
    
    console.log('📍 Actualizando URL:', finalPath);
    history.push(finalPath);
  }, [slug, history, isBoutique, activeFilters]);

  // ============ CARGAR DATOS ============
  const loadData = useCallback(async () => {
    if (!slug) return;
    
    try {
      if (isBoutique) {
        console.log('🔄 Cargando boutiques...', { 
          slug, 
          sub: filters.sub, 
          page: filters.page,
          activeFilters
        });
        
        // ✅ Para boutiques: NO pasar minPrice/maxPrice
        const res = await dispatch(getBoutiquesByCategory(
          slug, 
          filters.sub, 
          filters.page, 
          12,
          activeFilters?.wilaya || '',    
          activeFilters?.commune || '',   
          null,  // ✅ minPrice = null
          null,  // ✅ maxPrice = null
          activeFilters?.sortBy || 'recent'
        ));
        
        if (res?.children) {
          setAllChildren(res.children);
          
          if (filters.sub) {
            const foundSub = res.children.find((c) => c.slug === filters.sub);
            setCurrentSub(foundSub || null);
          }
        }
        
        if (res?.filterMetadata) {
          setFilterMetadata(res.filterMetadata);
        }
        
      } else {
        console.log('🔄 Cargando posts...', { 
          slug, 
          sub: filters.sub, 
          article: filters.article, 
          page: filters.page,
          activeFilters
        });
        
        const res = await dispatch(getCategoryPosts(
          slug, 
          filters.sub, 
          filters.article, 
          filters.page, 
          12,
          activeFilters?.wilaya || '',
          activeFilters?.commune || '',
          activeFilters?.minPrice || null,
          activeFilters?.maxPrice || null,
          activeFilters?.sortBy || 'recent'
        ));
        
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
        
        if (res?.filterMetadata) {
          setFilterMetadata(res.filterMetadata);
        }
      }
    } catch (err) {
      console.error('❌ Error cargando datos:', err);
      setError(err.message);
    } finally {
      setIsInitialLoad(false);
    }
  }, [slug, filters.sub, filters.article, filters.page, dispatch, isBoutique, activeFilters]);

  // ============ EFECTO PARA CARGAR DATOS ============
  useEffect(() => {
    loadData();
  }, [loadData]);

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
        path: `/${slug}/1`
      });
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
      dispatch(getBoutiquesByCategory(
        slug, 
        filters.sub, 
        nextPage, 
        12,
        activeFilters?.wilaya || '',
        activeFilters?.commune || '',
        null,  // ✅ minPrice = null
        null,  // ✅ maxPrice = null
        activeFilters?.sortBy || 'recent'
      ));
      
    } else {
      if (!hasMorePosts || postsLoading || posts.length >= POSTS_SCROLL_LIMIT) return;
      
      const nextPage = filters.page + 1;
      const newFilters = { ...filters, page: nextPage };
      
      setFilters(newFilters);
      updateUrl(newFilters);
      dispatch(getCategoryPosts(
        slug, 
        filters.sub, 
        filters.article, 
        nextPage, 
        12,
        activeFilters?.wilaya || '',
        activeFilters?.commune || '',
        activeFilters?.minPrice || null,
        activeFilters?.maxPrice || null,
        activeFilters?.sortBy || 'recent'
      ));
    }
  }, [isBoutique, hasMoreBoutiques, boutiquesLoading, hasMorePosts, postsLoading, posts.length, 
      filters, dispatch, slug, updateUrl, activeFilters]);

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
    updateUrl(newFilters);
    
    if (isBoutique) {
      dispatch(getBoutiquesByCategory(
        slug, 
        newFilters.sub, 
        1, 
        12,
        activeFilters?.wilaya || '',
        activeFilters?.commune || '',
        null,  // ✅ minPrice = null
        null,  // ✅ maxPrice = null
        activeFilters?.sortBy || 'recent'
      ));
    } else {
      dispatch(getCategoryPosts(slug, newFilters.sub, null, 1, 12,
        activeFilters?.wilaya || '',
        activeFilters?.commune || '',
        activeFilters?.minPrice || null,
        activeFilters?.maxPrice || null,
        activeFilters?.sortBy || 'recent'
      ));
    }
  }, [slug, dispatch, isBoutique, updateUrl, activeFilters]);

  // ============ CLICK EN ARTÍCULO ============
  const handleArticleClick = useCallback((article) => {
    if (isBoutique) return;
    
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
    updateUrl(newFilters);
    
    dispatch(getCategoryPosts(slug, subCategorySlug, article.slug, 1, 12,
      activeFilters?.wilaya || '',
      activeFilters?.commune || '',
      activeFilters?.minPrice || null,
      activeFilters?.maxPrice || null,
      activeFilters?.sortBy || 'recent'
    ));
    
    setCurrentArticle(article);
    if (!currentSub) {
      setCurrentSub(article);
    }
  }, [slug, currentSub, dispatch, updateUrl, isBoutique, activeFilters]);

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
      dispatch(getBoutiquesByCategory(
        slug, 
        filters.sub, 
        newPage, 
        12,
        activeFilters?.wilaya || '',
        activeFilters?.commune || '',
        null,  // ✅ minPrice = null
        null,  // ✅ maxPrice = null
        activeFilters?.sortBy || 'recent'
      ));
    } else {
      dispatch(getCategoryPosts(slug, filters.sub, filters.article, newPage, 12,
        activeFilters?.wilaya || '',
        activeFilters?.commune || '',
        activeFilters?.minPrice || null,
        activeFilters?.maxPrice || null,
        activeFilters?.sortBy || 'recent'
      ));
    }
  };

  // ============ MANEJAR APLICACIÓN DE FILTROS ============
  const handleApplyFilters = useCallback((filtersFromDrawer) => {
    console.log('🎯 Aplicando filtros desde drawer:', filtersFromDrawer);
    
    const newFilters = {
      sub: filtersFromDrawer.subCategory || null,
      article: filtersFromDrawer.article || null,
      page: 1
    };
    
    // ✅ Guardar filtros activos
    const newActiveFilters = {
      wilaya: filtersFromDrawer.wilaya || '',
      commune: filtersFromDrawer.commune || '',
      sortBy: filtersFromDrawer.sortBy || 'recent'
    };
    
    // ✅ PARA BOUTIQUES: NO incluir precio
    if (!isBoutique) {
      newActiveFilters.minPrice = filtersFromDrawer.priceMin || null;
      newActiveFilters.maxPrice = filtersFromDrawer.priceMax || null;
    }
    
    setActiveFilters(newActiveFilters);
    setFilters(newFilters);
    
    // ✅ Actualizar URL usando updateUrl con los nuevos filtros
    updateUrl(newFilters, newActiveFilters);
    
    // Cargar datos
    if (isBoutique) {
      dispatch(getBoutiquesByCategory(
        slug,
        filtersFromDrawer.subCategory || null,
        1,
        12,
        filtersFromDrawer.wilaya || '',
        filtersFromDrawer.commune || '',
        null,  // ✅ minPrice = null
        null,  // ✅ maxPrice = null
        filtersFromDrawer.sortBy || 'recent'
      ));
    } else {
      dispatch(getCategoryPosts(
        slug,
        filtersFromDrawer.subCategory || null,
        filtersFromDrawer.article || null,
        1,
        12,
        filtersFromDrawer.wilaya || '',
        filtersFromDrawer.commune || '',
        filtersFromDrawer.priceMin || null,
        filtersFromDrawer.priceMax || null,
        filtersFromDrawer.sortBy || 'recent'
      ));
    }
    
    setShowFilterDrawer(false);
  }, [slug, isBoutique, dispatch, updateUrl]);

  // ============ RENDER ============
  const isLoading = isBoutique ? boutiquesLoading : postsLoading;
  const items = isBoutique ? boutiques : posts;
  const hasMore = isBoutique ? hasMoreBoutiques : hasMorePosts;
  const paginationData = isBoutique ? boutiquePagination : rawPagination;

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

    if (isLoading && items.length === 0 && isInitialLoad) {
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
              : isBoutique 
                ? "Essayez d'autres critères de recherche"
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
          
          {/* Breadcrumb */}
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
                {!isBoutique && currentArticle && <span className="text-muted ms-2">- {currentArticle.name}</span>}
              </h4>
              {activeFilterCount > 0 && (
                <small className="text-muted">
                  {activeFilterCount} filtre{activeFilterCount > 1 ? 's' : ''} actif
                </small>
              )}
            </div>
            
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">
                {items.length} résultat{items.length > 1 ? 's' : ''}
              </span>
              
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

      {/* DRAWER DE FILTROS */}
      <FilterDrawer
        show={showFilterDrawer}
        onHide={() => setShowFilterDrawer(false)}
        onApplyFilters={handleApplyFilters}
        initialWilaya={activeFilters?.wilaya || ''}
        initialCommune={activeFilters?.commune || ''}
        isBoutique={isBoutique}
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