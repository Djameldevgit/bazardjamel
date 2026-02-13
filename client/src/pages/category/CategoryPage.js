// 📂 pages/CategoryPage.js
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { Container, Spinner, Row, Col } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

import { getCategoryPosts, resetCategoryPosts } from "../../redux/actions/categoryAction";
import BreadcrumbNav from "../../components/BreadcrumbNav";
import SliderUnificado from "../../components/SlidersCategories/SliderUnificado";
import PostCard from "../../components/PostCard";
import PaginationComponent from "../../components/PaginationComponent";

const POSTS_SCROLL_LIMIT = 50;

const CategoryPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { slug, subSlug, articleSlug, page } = useParams();

  const {
    categoryInfo = {},
    posts = [],
    postsLoading = false,
    hasMorePosts = true,
    pagination: rawPagination = {}
  } = useSelector((state) => state.category || {});

  const pagination = {
    currentPage: rawPagination?.currentPage || 1,
    totalPages: rawPagination?.totalPages || 1,
    totalPosts: rawPagination?.totalPosts || 0,
    limit: rawPagination?.limit || 12,
    hasMore: rawPagination?.hasMore ?? true
  };

  const [allChildren, setAllChildren] = useState([]);
  const [currentSub, setCurrentSub] = useState(null);
  const [currentArticle, setCurrentArticle] = useState(null);

  const currentPage = parseInt(page) || 1;

  // ================= Redirección segura a /1 =================
  useEffect(() => {
    if (!slug) return;

    if (!page) {
      if (articleSlug) history.replace(`/${slug}/${subSlug}/${articleSlug}/1`);
      else if (subSlug) history.replace(`/${slug}/${subSlug}/1`);
      else history.replace(`/${slug}/1`);
      return;
    }
  }, [slug, subSlug, articleSlug, page, history]);

  // ================= Carga inicial =================
  useEffect(() => {
    if (!slug || !page) return;

    dispatch(resetCategoryPosts());

    dispatch(getCategoryPosts(slug, subSlug || null, articleSlug || null, currentPage, 12))
      .then((res) => {
        if (res?.children) setAllChildren(res.children);
      });
  }, [slug, subSlug, articleSlug, currentPage, dispatch, page]);

  // ================= Actualizar sub y article =================
  useEffect(() => {
    if (subSlug && allChildren.length > 0) {
      const foundSub = allChildren.find((c) => c.slug === subSlug);
      setCurrentSub(foundSub || null);

      if (articleSlug && foundSub?.articles) {
        const foundArticle = foundSub.articles.find((a) => a.slug === articleSlug);
        setCurrentArticle(foundArticle || null);
      } else setCurrentArticle(null);
    } else {
      setCurrentSub(null);
      setCurrentArticle(null);
    }
  }, [subSlug, articleSlug, allChildren]);

  // ================= Breadcrumb =================
  const buildBreadcrumbItems = () => {
    const items = [{ label: "Inicio", path: "/" }];
    if (slug) items.push({ label: categoryInfo?.name || slug, path: `/${slug}/1` });
    if (currentSub) items.push({ label: currentSub.name, path: `/${slug}/${currentSub.slug}/1` });
    if (currentArticle) items.push({
      label: currentArticle.name,
      path: `/${slug}/${currentSub.slug}/${currentArticle.slug}/1`,
    });
    return items;
  };

  // ================= Cargar más posts =================
  const loadMorePosts = useCallback(() => {
    if (!hasMorePosts || postsLoading || posts.length >= POSTS_SCROLL_LIMIT) return;
    const nextPage = currentPage + 1;

    dispatch(getCategoryPosts(slug, subSlug || null, articleSlug || null, nextPage, 12));
  }, [hasMorePosts, postsLoading, posts.length, currentPage, dispatch, slug, subSlug, articleSlug]);

  // ================= Click en slider =================
  const handleSliderClick = useCallback((item) => {
    if (!currentSub || currentSub.articles?.length === 0) {
      history.push(`/${slug}/${item.slug}/1`);
    } else {
      history.push(`/${slug}/${currentSub.slug}/${item.slug}/1`);
    }
  }, [slug, currentSub, history]);

  // ================= Determinar items del slider =================
  const getSliderItems = () => {
    if (currentSub && currentSub.articles?.length > 0) return currentSub.articles;
    if (allChildren.length > 0) return allChildren;
    return [];
  };

  const getActiveItem = () => currentArticle || currentSub;

  // ================= Generar URL para paginación =================
  const buildCategoryUrl = (pageNumber) => {
    if (currentArticle) return `/${slug}/${currentSub.slug}/${currentArticle.slug}/${pageNumber}`;
    if (currentSub) return `/${slug}/${currentSub.slug}/${pageNumber}`;
    return `/${slug}/${pageNumber}`;
  };

  // ================= Render =================
  return (
    <div className="category-page">
      <main className="category-content">
        <Container className="py-3">
          {/* Breadcrumb */}
          <div className="mb-2">
            <BreadcrumbNav items={buildBreadcrumbItems()} />
          </div>

          {/* Slider */}
          {getSliderItems().length > 0 && (
            <div className="mb-4 mt-0">
              <SliderUnificado
                items={getSliderItems()}
                activeItem={getActiveItem()}
                variant="categoryPage"
                showCount={true}
                maxRows={2}
                onItemClick={handleSliderClick}
              />
            </div>
          )}

          {/* Posts */}
          <section className="posts-section">
            {postsLoading && posts.length === 0 ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Cargando productos...</p>
              </div>
            ) : posts.length > 0 ? (
              <>
                <InfiniteScroll
                  key={currentPage}
                  dataLength={posts.length}
                  hasMore={hasMorePosts && posts.length < POSTS_SCROLL_LIMIT}
                  loader={
                    <div className="text-center my-3">
                      <Spinner animation="border" size="sm" variant="primary" />
                      <p className="text-muted mt-1 small">Cargando más...</p>
                    </div>
                  }
                  next={loadMorePosts}
                  scrollThreshold={0.9}
                >
                  <Row xs={1} sm={2} md={3} lg={4} className="g-3">
                    {posts.map((post) => (
                      <Col key={post._id}>
                        <PostCard post={post} />
                      </Col>
                    ))}
                  </Row>
                </InfiniteScroll>

                {/* Paginación */}
                {pagination.totalPages > 1 && (
                  <PaginationComponent
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={(newPage) => {
                      history.push(buildCategoryUrl(newPage));
                      dispatch(getCategoryPosts(slug, subSlug || null, articleSlug || null, newPage, 12));
                    }}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-5">
                <i className="fas fa-box-open fa-3x text-light mb-3"></i>
                <h5 className="text-light">No hay productos</h5>
                <p className="text-light opacity-75">
                  {currentArticle
                    ? `No hay resultados para "${currentArticle.name}"`
                    : "Prueba con otra categoría"}
                </p>
              </div>
            )}
          </section>
        </Container>
      </main>
    </div>
  );
};

export default CategoryPage;
