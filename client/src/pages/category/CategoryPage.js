import React, { useState, useEffect, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { Container, Spinner, Row, Col, Button } from "react-bootstrap";
import PostCard from "../../components/post-card/PostCard";
import BoutiqueCard from "../../components/boutique/BoutiquePostCard";
 
import PaginationComponent from "../../components/PaginationComponent";
import InfiniteScroll from "react-infinite-scroll-component";
import { Funnel } from 'react-bootstrap-icons';
import { getCategoryPosts } from "../../redux/actions/categoryAction";
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

  const categoryData = useSelector(state => state.category.currentCategory);
  const { categoryInfo = {}, posts = [], postsLoading = false, hasMorePosts = true } = useSelector((state) => state.category || {});

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

  // CATEGORY PATH para boutiques
  const categoryPath = isBoutique
    ? filters.sub ? `${slug}/${filters.sub}` : slug
    : null;

  // Selector de boutiques por categoría
  const boutiquesByCat = useSelector(state =>
    isBoutique ? state.boutique.boutiquesByCategory[categoryPath] || {} : {}
  );

  const items = isBoutique ? boutiquesByCat.boutiques || [] : posts;
  const boutiqueChildren = boutiquesByCat.children || [];
  const boutiquePagination = boutiquesByCat;

  // Sincronizar URL con filtros
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.wilaya) params.set('wilaya', filters.wilaya);
    if (filters.commune) params.set('commune', filters.commune);
   // 🔥 SOLO añadir price si NO es boutiques
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

  // Cargar datos
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
        if (filters.sub) setCurrentSub(res.children.find(c => c.slug === filters.sub) || null);
      } else {
        const res = await dispatch(getCategoryPosts(
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
        if (filters.sub) {
          const foundSub = res.children.find(c => c.slug === filters.sub);
          setCurrentSub(foundSub || null);
          if (filters.article && foundSub?.articles) {
            setCurrentArticle(foundSub.articles.find(a => a.slug === filters.article) || null);
          } else setCurrentArticle(null);
        } else {
          setCurrentSub(null);
          setCurrentArticle(null);
        }
      }
    } catch (err) {
      console.error('❌ Error cargando datos:', err);
      setError(err.message);
    } finally {
      fetchingRef.current = false;
    }
  }, [slug, filters, dispatch, isBoutique]);

  useEffect(() => { if (slug) loadData(); }, [slug, filters, loadData]);

  const handleSliderClick = useCallback((item) => {
    setFilters({ ...filters, sub: item.slug, article: null, page: 1 });
    setCurrentSub(item);
    setCurrentArticle(null);
  }, [filters]);

  const handleArticleClick = useCallback((article) => {
    setFilters({ ...filters, sub: currentSub?.slug || article.slug, article: article.slug, page: 1 });
    setCurrentArticle(article);
  }, [filters, currentSub]);

  const handleApplyFilters = useCallback((filtersFromDrawer) => {
    setFilters({
      sub: filtersFromDrawer.subCategory || null,
      article: filtersFromDrawer.article || null,
      page: 1,
      wilaya: filtersFromDrawer.wilaya || '',
      commune: filtersFromDrawer.commune || '',
      minPrice: filtersFromDrawer.priceMin || null,
      maxPrice: filtersFromDrawer.priceMax || null,
      sortBy: filtersFromDrawer.sortBy || 'recent'
    });
  }, []);

  const handlePageChange = (newPage) => setFilters({ ...filters, page: newPage });

  const buildBreadcrumbItems = () => {
    const items = [{ label: "Inicio", path: "/" }];
    if (slug) {
      const nombreCategoria = isBoutique ? "Boutiques" : categoryInfo?.name || slug;
      items.push({ label: nombreCategoria, path: `/${slug}/1` });
    }
    if (currentSub) items.push({ label: currentSub.name, path: `/${slug}/${currentSub.slug}/1` });
    if (!isBoutique && currentArticle) items.push({ label: currentArticle.name, path: `/${slug}/${currentSub?.slug}/${currentArticle.slug}/1` });
    return items;
  };

  const getSliderItems = () => {
    if (isBoutique) return allChildren.length > 0 ? allChildren : boutiqueChildren || [];
    if (currentSub?.articles?.length > 0) return currentSub.articles;
    return allChildren.length > 0 ? allChildren : categoryInfo?.children || [];
  };

  const getActiveItem = () => isBoutique ? currentSub : currentArticle || currentSub;
  const isLoading = isBoutique ? false : postsLoading;
  const hasMore = isBoutique ? boutiquePagination?.hasMore : hasMorePosts;

  return (
    <div className="category-page">
      <CategoryCarousel categorySlug={slug} categoryName={categoryData?.name} />

      <main className="category-content">
        <Container>
          {getSliderItems().length > 0 && (
            <SliderUnificado
              items={getSliderItems()}
              activeItem={getActiveItem()}
              variant="categoryPage"
              showCount
              maxRows={2}
              onItemClick={(item) => item.level === 3 ? handleArticleClick(item) : handleSliderClick(item)}
            />
          )}

          <BreadcrumbNav items={buildBreadcrumbItems()} onItemClick={path => history.push(path)} />

          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h4>{isBoutique ? 'Boutiques' : 'Annonces'} {currentSub && `- ${currentSub.name}`} {currentArticle && `- ${currentArticle.name}`}</h4>
            </div>
            <Button variant="outline-primary" onClick={() => setShowFilterDrawer(true)}><Funnel className="me-2" /> Filtres</Button>
          </div>

          <section className="content-section">
            {error ? (
              <div className="text-center py-5 text-danger">Error: {error}</div>
            ) : isLoading && items.length === 0 ? (
              <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
            ) : items.length === 0 ? (
              <div className="text-center py-5">Aucun résultat trouvé</div>
            ) : isBoutique ? (
              <>
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                  {items.map(b => <Col key={b._id}><BoutiqueCard boutique={b} /></Col>)}
                </Row>
                <PaginationComponent
                  currentPage={filters.page}
                  totalPages={boutiquePagination?.totalPages || 1}
                  onPageChange={handlePageChange}
                />
              </>
            ) : (
              <InfiniteScroll
                dataLength={items.length}
                next={() => handlePageChange(filters.page + 1)}
                hasMore={hasMore}
                loader={<div className="text-center py-3"><Spinner animation="border" size="sm" /></div>}
                scrollThreshold={0.9}
              >
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                  {items.map((item) => <Col key={item._id}><PostCard post={item} /></Col>)}
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