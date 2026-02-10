// 📂 pages/CategoryPage.js - VERSIÓN SIMPLIFICADA
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { Container, Spinner, Row, Col } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

import { getCategoryPosts, resetCategoryPosts } from "../../redux/actions/categoryAction";
import BreadcrumbNav from "../../components/BreadcrumbNav";
import SliderUnificado from "../../components/SlidersCategories/SliderUnificado";
import PostCard from "../../components/PostCard";

const CategoryPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { slug, subSlug, articleSlug } = useParams();

  const { 
    categoryInfo, 
    children, 
    posts, 
    postsLoading, 
    postsError, 
    hasMorePosts,
    pagination 
  } = useSelector((state) => state.category || {});

  const [allChildren, setAllChildren] = useState([]);
  const [currentSub, setCurrentSub] = useState(null);
  const [currentArticle, setCurrentArticle] = useState(null);
  
  const currentPage = pagination?.currentPage || 1;

  // ================= Carga inicial =================
  useEffect(() => {
    if (!slug) return;

    dispatch(resetCategoryPosts());

    dispatch(getCategoryPosts(slug, subSlug || null, articleSlug || null, 1, 12))
      .then((res) => {
        if (res && res.children) setAllChildren(res.children);
      });
  }, [slug, subSlug, articleSlug, dispatch]);

  // ================= Actualizar sub y article =================
  useEffect(() => {
    if (subSlug && allChildren.length > 0) {
      const foundSub = allChildren.find((c) => c.slug === subSlug);
      setCurrentSub(foundSub || null);

      if (articleSlug && foundSub?.articles) {
        const foundArticle = foundSub.articles.find((a) => a.slug === articleSlug);
        setCurrentArticle(foundArticle || null);
      } else {
        setCurrentArticle(null);
      }
    } else {
      setCurrentSub(null);
      setCurrentArticle(null);
    }
  }, [subSlug, articleSlug, allChildren]);

  const buildBreadcrumbItems = () => {
    const items = [{ label: "Inicio", path: "/" }];
    if (slug) items.push({ 
      label: categoryInfo?.name || slug, 
      path: `/category/${slug}` 
    });
    if (currentSub) items.push({ 
      label: currentSub.name, 
      path: `/category/${slug}/${currentSub.slug}` 
    });
    if (currentArticle) items.push({
      label: currentArticle.name,
      path: `/category/${slug}/${currentSub.slug}/${currentArticle.slug}`,
    });
    return items;
  };

  // ================= Cargar más posts =================
  const loadMorePosts = useCallback(() => {
    if (!hasMorePosts || postsLoading) return;
    
    const nextPage = currentPage + 1;
    
    dispatch(
      getCategoryPosts(
        slug,
        subSlug || null,
        articleSlug || null,
        nextPage,
        12
      )
    );
  }, [hasMorePosts, postsLoading, currentPage, dispatch, slug, subSlug, articleSlug]);

  // ================= Click en slider =================
  const handleSliderClick = useCallback((item) => {
    if (!currentSub || currentSub.articles?.length === 0) {
      // Click en subcategoría
      history.push(`/category/${slug}/${item.slug}`);
    } else {
      // Click en artículo
      history.push(`/category/${slug}/${currentSub.slug}/${item.slug}`);
    }
  }, [slug, currentSub, history]);

  // ================= Determinar items del slider =================
  const getSliderItems = () => {
    if (currentSub && currentSub.articles?.length > 0) {
      return currentSub.articles; // Artículos nivel 3
    } else if (allChildren.length > 0) {
      return allChildren; // Subcategorías nivel 2
    }
    return [];
  };

  const getActiveItem = () => currentArticle || currentSub;

  // ================= Render =================
  return (
    <div className="category-page">
      <main className="category-content">
        <Container className="py-3">
          
          {/* 🎯 BREADCRUMB NAV - SIN MARGEN ABAJO */}
          <div className="mb-2">
            <BreadcrumbNav items={buildBreadcrumbItems()} />
          </div>

          {/* 🎯 SLIDER UNIFICADO - PEGADO AL BREADCRUMB */}
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

          {/* 🎯 POSTS - DIRECTO DESPUÉS */}
          <section className="posts-section">
            {postsLoading && (!posts || posts.length === 0) && !postsError ? (
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Cargando productos...</p>
              </div>
            ) : posts && posts.length > 0 ? (
              <InfiniteScroll
                dataLength={posts.length}
                hasMore={hasMorePosts}
                loader={
                  <div className="text-center my-3">
                    <Spinner animation="border" size="sm" variant="primary" />
                    <p className="text-muted mt-1 small">Cargando más...</p>
                  </div>
                }
                next={loadMorePosts}
                endMessage={
                  !postsLoading && posts.length > 0 && (
                    <div className="text-center py-3">
                      <p className="text-muted small">
                        Mostrando {posts.length} productos
                      </p>
                    </div>
                  )
                }
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