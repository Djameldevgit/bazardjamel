import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { Container, Spinner, Row, Col, Button, Badge } from "react-bootstrap";
import PostCard from "../../components/post-card/PostCard";
import BoutiqueCard from "../../components/boutique/BoutiquePostCard";
import InfiniteScroll from "react-infinite-scroll-component";
import { Funnel } from 'react-bootstrap-icons';
import { getCategoryPosts } from "../../redux/actions/categoryAction";
import { filterPosts, loadMoreFilteredPosts } from "../../redux/actions/postAction";
import { getBoutiquesByCategory } from "../../redux/actions/boutiqueAction";
import BreadcrumbNav from "../../components/BreadcrumbNav";
import SliderUnificado from "../../components/SlidersCategories/SliderUnificado";
import CategoryCarousel from "../../components/SlidersCategories/CategoryCarousel";
import FilterDrawer from "./FilterDrawer";

const CategoryPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { slug, subSlug, articleSlug, page } = useParams();

  const queryParams = new URLSearchParams(location.search);
  const urlWilaya = queryParams.get('wilaya') || '';
  const urlCommune = queryParams.get('commune') || '';
  const urlMinPrice = queryParams.get('minPrice') ? Number(queryParams.get('minPrice')) : null;
  const urlMaxPrice = queryParams.get('maxPrice') ? Number(queryParams.get('maxPrice')) : null;
  const urlSortBy = queryParams.get('sortBy') || 'recent';

  const isBoutique = slug === 'boutiques';

  // ============ REDUX STATE ============
  const {
    categoryInfo = {},
    posts = [],
    postsLoading = false,
    hasMorePosts = true,
    postsCurrentPage = 1,
    children: categoryChildren = []
  } = useSelector((state) => state.category || {});
  
  const {
    posts: filteredPosts = [],
    postsLoading: filteredLoading = false,
    hasMorePosts: hasMoreFiltered = true,
    categoryInfo: filteredCategoryInfo = {},
    children: filteredChildren = []
  } = useSelector((state) => state.post || {});
  
  const boutiquesByCat = useSelector(state =>
    isBoutique ? state.boutique.boutiquesByCategory[`${slug}/${subSlug || ''}`] || {} : {}
  );

  // ============ LOCAL STATE ============
  const [filters, setFilters] = useState({
    sub: subSlug || null,
    article: articleSlug || null,
    page: parseInt(page) || 1,
    wilaya: urlWilaya,
    commune: urlCommune,
    minPrice: urlMinPrice,
    maxPrice: urlMaxPrice,
    sortBy: urlSortBy
  });

  const [allChildren, setAllChildren] = useState([]);
  const [currentSub, setCurrentSub] = useState(null);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [error, setError] = useState(null);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const fetchingRef = useRef(false);

  // 🔥 DETECTAR SI HAY FILTROS ACTIVOS
  const hasActiveFilters = useMemo(() => {
    return !!(
      filters.wilaya ||
      filters.commune ||
      filters.minPrice ||
      filters.maxPrice ||
      (filters.sortBy && filters.sortBy !== 'recent')
    );
  }, [filters.wilaya, filters.commune, filters.minPrice, filters.maxPrice, filters.sortBy]);

  // 🔥 SELECCIONAR DATOS SEGÚN SI HAY FILTROS Y SI ES BOUTIQUE
  const displayData = useMemo(() => {
    if (isBoutique) {
      return {
        items: boutiquesByCat.boutiques || [],
        loading: false,
        hasMore: boutiquesByCat.hasMore || false,
        categoryInfo: { name: "Boutiques", slug: "boutiques" },
        children: allChildren.length > 0 ? allChildren : (boutiquesByCat.children || [])
      };
    }
    
    if (hasActiveFilters) {
      return {
        items: filteredPosts,
        loading: filteredLoading,
        hasMore: hasMoreFiltered,
        categoryInfo: filteredCategoryInfo,
        children: filteredChildren.length > 0 ? filteredChildren : allChildren
      };
    }
    
    return {
      items: posts,
      loading: postsLoading,
      hasMore: hasMorePosts,
      categoryInfo: categoryInfo,
      children: categoryChildren.length > 0 ? categoryChildren : allChildren
    };
  }, [
    isBoutique, hasActiveFilters,
    boutiquesByCat, allChildren,
    filteredPosts, filteredLoading, hasMoreFiltered, filteredCategoryInfo, filteredChildren,
    posts, postsLoading, hasMorePosts, categoryInfo, categoryChildren
  ]);

  // 🔥 ACTUALIZAR currentSub CUANDO CAMBIAN LOS CHILDREN O EL FILTRO
  useEffect(() => {
    if (filters.sub && displayData.children.length > 0) {
      const foundSub = displayData.children.find(c => c.slug === filters.sub);
      if (foundSub) {
        setCurrentSub(foundSub);
      } else {
        setCurrentSub(null);
      }
    } else {
      setCurrentSub(null);
    }
  }, [filters.sub, displayData.children]);

  // 🔥 ACTUALIZAR currentArticle CUANDO CAMBIA EL FILTRO
  useEffect(() => {
    if (filters.article && currentSub?.articles) {
      const foundArticle = currentSub.articles.find(a => a.slug === filters.article);
      setCurrentArticle(foundArticle || null);
    } else {
      setCurrentArticle(null);
    }
  }, [filters.article, currentSub]);

  // ============ CARGAR DATOS ============
  const loadData = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      if (isBoutique) {
        const res = await dispatch(getBoutiquesByCategory(
          slug,
          filters.sub,
          filters.page,
          12,
          filters.wilaya,
          filters.commune,
          filters.minPrice,
          filters.maxPrice,
          filters.sortBy
        ));
        if (res?.children) setAllChildren(res.children);
      } else {
        if (hasActiveFilters) {
          console.log('📡 Usando filterPosts con filtros:', {
            slug,
            sub: filters.sub,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            wilaya: filters.wilaya,
            sortBy: filters.sortBy,
            page: filters.page
          });
          
          const res = await dispatch(filterPosts(
            slug,
            filters.sub,
            filters.article,
            filters.page,
            12,
            filters.wilaya,
            filters.commune,
            filters.minPrice,
            filters.maxPrice,
            filters.sortBy
          ));
          
          if (res?.children) setAllChildren(res.children);
        } else {
          console.log('📡 Usando getCategoryPosts sin filtros:', { 
            slug, 
            sub: filters.sub, 
            page: filters.page 
          });
          
          const res = await dispatch(getCategoryPosts(
            slug,
            filters.sub,
            filters.article,
            filters.page,
            12
          ));
          
          if (res?.children) setAllChildren(res.children);
        }
      }
    } catch (err) {
      console.error('❌ Error cargando datos:', err);
      setError(err.message);
    } finally {
      fetchingRef.current = false;
    }
  }, [slug, filters, dispatch, isBoutique, hasActiveFilters]);

  // ============ SCROLL INFINITO ============
  const handleLoadMore = useCallback(() => {
    if (displayData.loading) return;
    
    if (isBoutique) {
      if (boutiquesByCat.hasMore) {
        const nextPage = (boutiquesByCat.page || 1) + 1;
        setFilters(prev => ({ ...prev, page: nextPage }));
      }
    } else {
      if (displayData.hasMore) {
        if (hasActiveFilters) {
          dispatch(loadMoreFilteredPosts());
        } else {
          const nextPage = postsCurrentPage + 1;
          setFilters(prev => ({ ...prev, page: nextPage }));
        }
      }
    }
  }, [displayData.loading, displayData.hasMore, isBoutique, boutiquesByCat, hasActiveFilters, dispatch, postsCurrentPage]);

  // ============ HANDLER DEL SLIDER ============
  const handleSliderClick = useCallback((item) => {
    // 🔥 ACTUALIZAR FILTROS CORRECTAMENTE
    if (item.level === 2) {
      // Es subcategoría
      setFilters({
        ...filters,
        sub: item.slug,
        article: null,
        page: 1,
        wilaya: '',
        commune: '',
        minPrice: null,
        maxPrice: null,
        sortBy: 'recent'
      });
      setCurrentSub(item);
      setCurrentArticle(null);
    } else if (item.level === 3) {
      // Es artículo
      setFilters({
        ...filters,
        sub: currentSub?.slug || item.slug,
        article: item.slug,
        page: 1,
        wilaya: '',
        commune: '',
        minPrice: null,
        maxPrice: null,
        sortBy: 'recent'
      });
      setCurrentArticle(item);
    }
  }, [filters, currentSub]);

  // ============ HANDLER DEL DRAWER ============
  const handleApplyFilters = useCallback((filtersFromDrawer) => {
    console.log('🎯 Aplicando filtros desde drawer:', filtersFromDrawer);
    setFilters({
      sub: filtersFromDrawer.subCategory || null,
      article: filtersFromDrawer.article || null,
      page: 1,
      wilaya: filtersFromDrawer.wilaya || '',
      commune: filtersFromDrawer.commune || '',
      minPrice: filtersFromDrawer.minPrice || null,
      maxPrice: filtersFromDrawer.maxPrice || null,
      sortBy: filtersFromDrawer.sortBy || 'recent'
    });
  }, []);

  // ============ EFECTOS ============
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.wilaya) params.set('wilaya', filters.wilaya);
    if (filters.commune) params.set('commune', filters.commune);
    if (slug !== 'boutiques') {
      if (filters.minPrice) params.set('minPrice', filters.minPrice);
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    }
    if (filters.sortBy && filters.sortBy !== 'recent') params.set('sortBy', filters.sortBy);

    let path = `/${slug}`;
    if (filters.sub) path += `/${filters.sub}`;
    if (filters.article) path += `/${filters.article}`;
    path += `/${filters.page}`;

    history.replace({ pathname: path, search: params.toString() });
  }, [filters, slug, history]);

  useEffect(() => { if (slug) loadData(); }, [slug, filters, loadData]);

  // ============ BREADCRUMB ============
  const buildBreadcrumbItems = () => {
    const items = [{ label: "Inicio", path: "/" }];
    if (slug) {
      const nombreCategoria = isBoutique ? "Boutiques" : (displayData.categoryInfo?.name || slug);
      items.push({ label: nombreCategoria, path: `/${slug}/1` });
    }
    if (currentSub) items.push({ label: currentSub.name, path: `/${slug}/${currentSub.slug}/1` });
    if (!isBoutique && currentArticle) items.push({ label: currentArticle.name, path: `/${slug}/${currentSub?.slug}/${currentArticle.slug}/1` });
    return items;
  };

  // ============ SLIDER ITEMS ============
  const getSliderItems = () => {
    if (isBoutique) {
      return displayData.children;
    }
    if (currentSub?.articles?.length > 0) {
      return currentSub.articles;
    }
    return displayData.children;
  };

  const getActiveItem = () => isBoutique ? currentSub : currentArticle || currentSub;

  // ============ RENDER ============
  return (
    <div className="category-page">
      <CategoryCarousel categorySlug={slug} categoryName={displayData.categoryInfo?.name} />

      <main className="category-content">
        <Container>
          {/* SLIDER DE CATEGORÍAS */}
          {getSliderItems().length > 0 && (
            <SliderUnificado
              items={getSliderItems()}
              activeItem={getActiveItem()}
              variant="categoryPage"
              showCount
              maxRows={2}
              onItemClick={handleSliderClick}
            />
          )}

          <BreadcrumbNav items={buildBreadcrumbItems()} onItemClick={path => history.push(path)} />

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4>
                {isBoutique ? 'Boutiques' : 'Annonces'} 
                {currentSub && ` - ${currentSub.name}`} 
                {currentArticle && ` - ${currentArticle.name}`}
                {hasActiveFilters && !isBoutique && (
                  <Badge bg="info" className="ms-2">Filtré</Badge>
                )}
              </h4>
            </div>
            <Button variant="outline-primary" onClick={() => setShowFilterDrawer(true)}>
              <Funnel className="me-2" /> Filtres
            </Button>
          </div>

          <section className="content-section">
            {error ? (
              <div className="text-center py-5 text-danger">Error: {error}</div>
            ) : displayData.loading && displayData.items.length === 0 ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3 text-muted">Chargement...</p>
              </div>
            ) : displayData.items.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-search fa-3x text-muted mb-3"></i>
                <h5 className="text-muted">Aucun résultat trouvé</h5>
                <p className="text-muted small">Essayez de modifier vos filtres</p>
              </div>
            ) : (
              <InfiniteScroll
                dataLength={displayData.items.length}
                next={handleLoadMore}
                hasMore={displayData.hasMore}
                loader={
                  <div className="text-center py-4">
                    <Spinner animation="border" size="sm" variant="primary" />
                    <p className="mt-2 text-muted small">Chargement...</p>
                  </div>
                }
                endMessage={
                  <div className="text-center py-4">
                    <i className="fas fa-check-circle text-success me-2"></i>
                    <span className="text-muted">Vous avez tout vu !</span>
                  </div>
                }
                scrollThreshold={0.9}
              >
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                  {displayData.items.map((item) => (
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
            )}
          </section>
        </Container>
      </main>

      <FilterDrawer
        show={showFilterDrawer}
        onHide={() => setShowFilterDrawer(false)}
        category={slug}
        subSlug={filters.sub}
        articleSlug={filters.article}
        initialWilaya={filters.wilaya}
        initialCommune={filters.commune}
        initialMinPrice={filters.minPrice}
        initialMaxPrice={filters.maxPrice}
        initialSortBy={filters.sortBy}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
};

export default CategoryPage;