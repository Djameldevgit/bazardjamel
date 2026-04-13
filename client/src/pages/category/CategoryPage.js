// 📂 pages/CategoryPage.jsx - VERSIÓN COMPLETA CORREGIDA

import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { Container, Spinner, Row, Col, Button, Nav } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { Funnel, CameraVideo, Shop, Grid } from 'react-bootstrap-icons';
import PostCard from "../../components/post-card/PostCard";
import VideoCard from "../../components/VideoCard";
import { getCategoryPosts } from "../../redux/actions/categoryAction";
import { getBoutiquesByCategory } from "../../redux/actions/boutiqueAction";
import { getVideos } from "../../redux/actions/videoAction";
import BreadcrumbNav from "../../components/BreadcrumbNav";
import SliderUnificado from "../../components/SlidersCategories/SliderUnificado";
import BoutiqueCard from "../../components/boutique/BoutiquePostCard";
import PaginationComponent from "../../components/PaginationComponent";
import CategoryCarousel from "../../components/SlidersCategories/CategoryCarousel";
import FilterDrawer from "./FilterDrawer";

const POSTS_SCROLL_LIMIT = 50;

// Tipos de contenido
const CONTENT_TYPES = {
  POSTS: 'posts',
  BOUTIQUES: 'boutiques',
  VIDEOS: 'videos'
};

const CategoryPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { slug, subSlug, articleSlug, page } = useParams();

  // Estado para el tipo de contenido activo
  const [activeContentType, setActiveContentType] = useState(CONTENT_TYPES.POSTS);

  // Redirigir si no hay página en la URL
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

  // Detectar tipo de página
  const isBoutique = slug === 'boutiques';
  const isVideo = slug === 'videos';
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

  // Estado para VIDEOS
  const videosState = useSelector((state) => state.video);
  const videos = videosState.videos || [];
  const videosLoading = videosState.loading || false;
  const hasMoreVideos = videosState.hasMore || false;
  const videoPagination = {
    currentPage: videosState.page || 1,
    totalPages: videosState.totalPages || 1,
    totalPosts: videosState.total || 0,
    limit: 12,
    hasMore: videosState.hasMore || false
  };

  // ============ ESTADO LOCAL ============
  const [allChildren, setAllChildren] = useState([]);
  const [currentSub, setCurrentSub] = useState(null);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Estado para filtros
  const [filters, setFilters] = useState({
    sub: subSlug || null,
    article: articleSlug || null,
    page: page ? parseInt(page) : 1
  });

  // Estado para filtro drawer
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [activeFilters, setActiveFilters] = useState(null);
  
  // Estado para metadatos de filtros
  const [filterMetadata, setFilterMetadata] = useState({
    wilayas: [],
    priceRange: { min: 0, max: 1000000 },
    appliedFilters: {}
  });

  // Contar filtros activos
  const countActiveFilters = () => {
    if (!activeFilters) return 0;
    let count = 0;
    
    if (activeFilters.wilaya && activeFilters.wilaya !== '') count++;
    if (activeFilters.commune && activeFilters.commune !== '') count++;
    if (!isBoutique && !isVideo) {
      if (activeFilters.minPrice && activeFilters.minPrice !== null) count++;
      if (activeFilters.maxPrice && activeFilters.maxPrice !== null) count++;
    }
    if (activeFilters.sortBy && activeFilters.sortBy !== 'recent') count++;
    if (activeFilters.searchTerm && activeFilters.searchTerm !== '') count++;
    
    return count;
  };

  const activeFilterCount = countActiveFilters();

  // Sincronizar estado con URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const wilaya = searchParams.get('wilaya') || '';
    const commune = searchParams.get('commune') || '';
    const minPrice = searchParams.get('minPrice') || null;
    const maxPrice = searchParams.get('maxPrice') || null;
    const sortBy = searchParams.get('sortBy') || 'recent';
    const searchTerm = searchParams.get('searchTerm') || '';
    
    const newPage = page ? parseInt(page) : 1;
    
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
      sortBy,
      searchTerm
    });
  }, [subSlug, articleSlug, page, location.search]);

  // Actualizar URL
  const updateUrl = useCallback((newFilters, customActiveFilters = null) => {
    let basePath = `/${slug}`;
    
    if (newFilters.sub) {
      basePath += `/${newFilters.sub}`;
      if (!isBoutique && !isVideo && newFilters.article) {
        basePath += `/${newFilters.article}`;
      }
    }
    
    basePath += `/${newFilters.page || 1}`;
    
    const filtersToUse = customActiveFilters || activeFilters;
    
    const searchParams = new URLSearchParams();
    if (filtersToUse?.searchTerm && filtersToUse.searchTerm !== '') {
      searchParams.set('searchTerm', filtersToUse.searchTerm);
    }
    if (filtersToUse?.wilaya && filtersToUse.wilaya !== '') {
      searchParams.set('wilaya', filtersToUse.wilaya);
    }
    if (filtersToUse?.commune && filtersToUse.commune !== '') {
      searchParams.set('commune', filtersToUse.commune);
    }
    if (!isBoutique && !isVideo && filtersToUse?.minPrice && filtersToUse.minPrice !== null) {
      searchParams.set('minPrice', filtersToUse.minPrice);
    }
    if (!isBoutique && !isVideo && filtersToUse?.maxPrice && filtersToUse.maxPrice !== null) {
      searchParams.set('maxPrice', filtersToUse.maxPrice);
    }
    if (filtersToUse?.sortBy && filtersToUse.sortBy !== 'recent') {
      searchParams.set('sortBy', filtersToUse.sortBy);
    }
    
    const finalPath = searchParams.toString() ? `${basePath}?${searchParams.toString()}` : basePath;
    history.push(finalPath);
  }, [slug, history, isBoutique, isVideo, activeFilters]);

  // Cargar datos
  const loadData = useCallback(async () => {
    if (!slug) return;
    
    try {
      if (isBoutique) {
        console.log('🔄 Cargando boutiques...');
        const res = await dispatch(getBoutiquesByCategory(
          slug, 
          filters.sub, 
          filters.page, 
          12,
          activeFilters?.wilaya || '',    
          activeFilters?.commune || '',   
          null, null,
          activeFilters?.sortBy || 'recent'
        ));
        
        if (res?.children) setAllChildren(res.children);
        if (res?.filterMetadata) setFilterMetadata(res.filterMetadata);
        
      } else if (isVideo) {
        console.log('🎬 Cargando videos...');
        console.log('  - slug:', slug);
        console.log('  - filters.sub:', filters.sub);
        console.log('  - filters.page:', filters.page);
        console.log('  - sortBy:', activeFilters?.sortBy || 'recent');
        console.log('  - searchTerm:', activeFilters?.searchTerm);
        
        const res = await dispatch(getVideos(
          slug,
          filters.sub,
          filters.page,
          12,
          activeFilters?.sortBy || 'recent',
          activeFilters?.searchTerm || null
        ));
        
        console.log('🎬 Respuesta getVideos:', res);
        console.log('🎬 Videos obtenidos:', res?.videos?.length || 0);
        
        if (res?.children && res.children.length > 0) {
          setAllChildren(res.children);
        }
        
      } else {
        console.log('🔄 Cargando posts...');
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
        
        if (res?.filterMetadata) setFilterMetadata(res.filterMetadata);
      }
    } catch (err) {
      console.error('❌ Error cargando datos:', err);
      setError(err.message);
    } finally {
      setIsInitialLoad(false);
    }
  }, [slug, filters.sub, filters.article, filters.page, dispatch, isBoutique, isVideo, activeFilters]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Breadcrumb
  const buildBreadcrumbItems = () => {
    const items = [{ label: "Inicio", path: "/" }];
    
    if (slug) {
      let nombreCategoria = slug;
      if (isBoutique) nombreCategoria = "Boutiques";
      else if (isVideo) nombreCategoria = "Vidéos";
      else if (categoryInfo?.name) nombreCategoria = categoryInfo.name;
      
      items.push({ label: nombreCategoria, path: `/${slug}/1` });
    }
    
    if (currentSub) {
      items.push({ label: currentSub.name, path: `/${slug}/${currentSub.slug}/1` });
    }
    
    if (!isBoutique && !isVideo && currentArticle) {
      items.push({
        label: currentArticle.name,
        path: `/${slug}/${currentSub?.slug}/${currentArticle.slug}/1`,
      });
    }
    
    return items;
  };

  const handleBreadcrumbClick = (path) => history.push(path);

  // Cargar más
  const loadMore = useCallback(() => {
    if (isBoutique) {
      if (!hasMoreBoutiques || boutiquesLoading) return;
      const nextPage = filters.page + 1;
      const newFilters = { ...filters, page: nextPage };
      setFilters(newFilters);
      updateUrl(newFilters);
      dispatch(getBoutiquesByCategory(slug, filters.sub, nextPage, 12,
        activeFilters?.wilaya || '', activeFilters?.commune || '',
        null, null, activeFilters?.sortBy || 'recent'));
        
    } else if (isVideo) {
      if (!hasMoreVideos || videosLoading) return;
      const nextPage = filters.page + 1;
      const newFilters = { ...filters, page: nextPage };
      setFilters(newFilters);
      updateUrl(newFilters);
      dispatch(getVideos(slug, filters.sub, nextPage, 12,
        activeFilters?.sortBy || 'recent', activeFilters?.searchTerm || null));
        
    } else {
      if (!hasMorePosts || postsLoading || posts.length >= POSTS_SCROLL_LIMIT) return;
      const nextPage = filters.page + 1;
      const newFilters = { ...filters, page: nextPage };
      setFilters(newFilters);
      updateUrl(newFilters);
      dispatch(getCategoryPosts(slug, filters.sub, filters.article, nextPage, 12,
        activeFilters?.wilaya || '', activeFilters?.commune || '',
        activeFilters?.minPrice || null, activeFilters?.maxPrice || null,
        activeFilters?.sortBy || 'recent'));
    }
  }, [isBoutique, isVideo, hasMoreBoutiques, boutiquesLoading, hasMoreVideos, videosLoading,
      hasMorePosts, postsLoading, posts.length, filters, dispatch, slug, updateUrl, activeFilters]);

  // Click en slider
  const handleSliderClick = useCallback((item) => {
    let newFilters = { sub: item.slug, article: null, page: 1 };
    
    if (!isBoutique && !isVideo) {
      const isSubCategory = item.level === 2;
      if (isSubCategory) setCurrentSub(item);
      else setCurrentArticle(item);
    } else {
      setCurrentSub(item);
    }
    
    setFilters(newFilters);
    updateUrl(newFilters);
    
    if (isBoutique) {
      dispatch(getBoutiquesByCategory(slug, newFilters.sub, 1, 12,
        activeFilters?.wilaya || '', activeFilters?.commune || '',
        null, null, activeFilters?.sortBy || 'recent'));
    } else if (isVideo) {
      dispatch(getVideos(slug, newFilters.sub, 1, 12,
        activeFilters?.sortBy || 'recent', activeFilters?.searchTerm || null));
    } else {
      dispatch(getCategoryPosts(slug, newFilters.sub, null, 1, 12,
        activeFilters?.wilaya || '', activeFilters?.commune || '',
        activeFilters?.minPrice || null, activeFilters?.maxPrice || null,
        activeFilters?.sortBy || 'recent'));
    }
  }, [slug, dispatch, isBoutique, isVideo, updateUrl, activeFilters]);

  // Determinar items del slider
  const getSliderItems = () => {
    if (currentSub && currentSub.articles?.length > 0 && !isBoutique && !isVideo) {
      return currentSub.articles;
    }
    if (allChildren.length > 0) return allChildren;
    if (categoryChildren.length > 0) return categoryChildren;
    return [];
  };

  const getActiveItem = () => {
    if (isBoutique || isVideo) return currentSub;
    if (currentArticle) return currentArticle;
    if (currentSub) return currentSub;
    return null;
  };

  // Manejar página
  const handlePageChange = (newPage) => {
    const newFilters = { ...filters, page: newPage };
    setFilters(newFilters);
    updateUrl(newFilters);
    
    if (isBoutique) {
      dispatch(getBoutiquesByCategory(slug, filters.sub, newPage, 12,
        activeFilters?.wilaya || '', activeFilters?.commune || '',
        null, null, activeFilters?.sortBy || 'recent'));
    } else if (isVideo) {
      dispatch(getVideos(slug, filters.sub, newPage, 12,
        activeFilters?.sortBy || 'recent', activeFilters?.searchTerm || null));
    } else {
      dispatch(getCategoryPosts(slug, filters.sub, filters.article, newPage, 12,
        activeFilters?.wilaya || '', activeFilters?.commune || '',
        activeFilters?.minPrice || null, activeFilters?.maxPrice || null,
        activeFilters?.sortBy || 'recent'));
    }
  };

  // Aplicar filtros
  const handleApplyFilters = useCallback((filtersFromDrawer) => {
    const newFilters = {
      sub: filtersFromDrawer.subCategory || null,
      article: filtersFromDrawer.article || null,
      page: 1
    };
    
    const newActiveFilters = {
      wilaya: filtersFromDrawer.wilaya || '',
      commune: filtersFromDrawer.commune || '',
      sortBy: filtersFromDrawer.sortBy || 'recent',
      searchTerm: filtersFromDrawer.searchTerm || ''
    };
    
    if (!isBoutique && !isVideo) {
      newActiveFilters.minPrice = filtersFromDrawer.priceMin || null;
      newActiveFilters.maxPrice = filtersFromDrawer.priceMax || null;
    }
    
    setActiveFilters(newActiveFilters);
    setFilters(newFilters);
    updateUrl(newFilters, newActiveFilters);
    
    if (isBoutique) {
      dispatch(getBoutiquesByCategory(slug, newFilters.sub, 1, 12,
        newActiveFilters.wilaya, newActiveFilters.commune,
        null, null, newActiveFilters.sortBy));
    } else if (isVideo) {
      dispatch(getVideos(slug, newFilters.sub, 1, 12,
        newActiveFilters.sortBy, newActiveFilters.searchTerm));
    } else {
      dispatch(getCategoryPosts(slug, newFilters.sub, newFilters.article, 1, 12,
        newActiveFilters.wilaya, newActiveFilters.commune,
        newActiveFilters.minPrice, newActiveFilters.maxPrice,
        newActiveFilters.sortBy));
    }
    
    setShowFilterDrawer(false);
  }, [slug, isBoutique, isVideo, dispatch, updateUrl]);

  // Render contenido
  const isLoading = isBoutique ? boutiquesLoading : (isVideo ? videosLoading : postsLoading);
  const items = isBoutique ? boutiques : (isVideo ? videos : posts);
  const hasMore = isBoutique ? hasMoreBoutiques : (isVideo ? hasMoreVideos : hasMorePosts);
  const paginationData = isBoutique ? boutiquePagination : (isVideo ? videoPagination : rawPagination);

  const renderContent = () => {
    if (error) {
      return (
        <div className="text-center py-5">
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
            {isBoutique ? 'Chargement des boutiques...' : 
             isVideo ? 'Chargement des vidéos...' : 'Chargement des annonces...'}
          </p>
        </div>
      );
    }

    if (items.length > 0) {
      return (
        <>
          <InfiniteScroll
            dataLength={items.length}
            hasMore={hasMore}
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
                  ) : isVideo ? (
                    <VideoCard video={item} />
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
        <h4 className="text-secondary mb-3">
          {isBoutique ? 'Aucune boutique trouvée' : 
           isVideo ? 'Aucune vidéo trouvée' : 'Aucune annonce trouvée'}
        </h4>
        <p className="text-muted">
          {currentSub
            ? `Aucun résultat dans "${currentSub.name}"`
            : isBoutique ? "Essayez d'autres critères" :
              isVideo ? "Essayez une autre catégorie de vidéos" :
              "Essayez une autre catégorie"}
        </p>
      </div>
    );
  };

  return (
    <div className="category-page">
      <CategoryCarousel categorySlug={category} categoryName={categoryData?.name} />

      <main className="category-content">
        <Container>
          {/* Tabs para cambiar entre tipos de contenido (solo para categorías normales) */}
          {!isBoutique && !isVideo && (
            <div className="mb-4">
              <Nav variant="tabs" activeKey={activeContentType} onSelect={(k) => setActiveContentType(k)}>
                <Nav.Item>
                  <Nav.Link eventKey={CONTENT_TYPES.POSTS}>
                    <Grid className="me-1" size={16} /> Annonces
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey={CONTENT_TYPES.BOUTIQUES}>
                    <Shop className="me-1" size={16} /> Boutiques
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey={CONTENT_TYPES.VIDEOS}>
                    <CameraVideo className="me-1" size={16} /> Vidéos
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </div>
          )}

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
                  if (isBoutique || isVideo) {
                    handleSliderClick(item);
                  } else if (item.level === 3) {
                    handleSliderClick(item);
                  } else {
                    handleSliderClick(item);
                  }
                }}
              />
            </div>
          )}
          
          {/* Breadcrumb */}
          <div className="mb-3">
            <BreadcrumbNav items={buildBreadcrumbItems()} onItemClick={handleBreadcrumbClick} />
          </div>
          
          {/* Título y filtros */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4 className="mb-0">
                {isBoutique ? 'Boutiques' : (isVideo ? 'Vidéos' : 'Annonces')}
                {currentSub && <span className="text-muted ms-2">- {currentSub.name}</span>}
              </h4>
              {activeFilterCount > 0 && (
                <small className="text-muted">
                  {activeFilterCount} filtre{activeFilterCount > 1 ? 's' : ''} actif
                </small>
              )}
            </div>
            
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">{items.length} résultat{items.length > 1 ? 's' : ''}</span>
              
              <Button
                variant={activeFilterCount > 0 ? "primary" : "outline-primary"}
                size="sm"
                onClick={() => setShowFilterDrawer(true)}
                className="d-flex align-items-center gap-2 rounded-pill"
              >
                <Funnel size={16} />
                Filtres
                {activeFilterCount > 0 && (
                  <span className="filter-badge">{activeFilterCount}</span>
                )}
              </Button>
            </div>
          </div>

          {/* Contenido principal */}
          <section className="content-section">
            {activeContentType === CONTENT_TYPES.POSTS && !isBoutique && !isVideo && renderContent()}
            {activeContentType === CONTENT_TYPES.BOUTIQUES && !isBoutique && !isVideo && (
              <CategoryPage slug="boutiques" {...props} />
            )}
            {activeContentType === CONTENT_TYPES.VIDEOS && !isBoutique && !isVideo && (
              <CategoryPage slug="videos" {...props} />
            )}
            {(isBoutique || isVideo) && renderContent()}
          </section>
        </Container>
      </main>

      <FilterDrawer
        show={showFilterDrawer}
        onHide={() => setShowFilterDrawer(false)}
        onApplyFilters={handleApplyFilters}
        initialWilaya={activeFilters?.wilaya || ''}
        initialCommune={activeFilters?.commune || ''}
        initialSearchTerm={activeFilters?.searchTerm || ''}
        initialSortBy={activeFilters?.sortBy || 'recent'}
        isBoutique={isBoutique}
        isVideo={isVideo}
      />

      <style>{`
        .filter-badge {
          background-color: white;
          color: #667eea;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 11px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: 4px;
        }
        
        .nav-tabs .nav-link {
          color: #666;
          border: none;
          padding: 10px 20px;
          font-weight: 500;
        }
        
        .nav-tabs .nav-link:hover {
          color: #667eea;
          border: none;
        }
        
        .nav-tabs .nav-link.active {
          color: #667eea;
          border-bottom: 2px solid #667eea;
          background: transparent;
        }
      `}</style>
    </div>
  );
};

export default CategoryPage;