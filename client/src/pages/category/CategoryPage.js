// 📂 pages/CategoryPage.js
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { Container, Spinner, Row, Col } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

import { getCategoryPosts, resetCategoryPosts } from "../../redux/actions/categoryAction";
import BreadcrumbNav from "../../components/BreadcrumbNav";
import CategorySlider from "../../components/SlidersCategories/CategorySlider";
import SliderUnificado from "../../components/SlidersCategories/SliderUnificado";
import PostCard from "../../components/PostCard";
import Header from "../../components/SlidersCategories/HeaderCarousel";

const CategoryPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { slug, subSlug, articleSlug } = useParams();

  const { categoryInfo, children, posts, postsLoading, postsError, hasMorePosts } =
    useSelector((state) => state.category || {});

  const [allChildren, setAllChildren] = useState([]);
  const [currentSub, setCurrentSub] = useState(null);
  const [currentArticle, setCurrentArticle] = useState(null);

  const currentLevel = articleSlug ? 3 : subSlug ? 2 : 1;

  // ================= Carga inicial y reset =================
  useEffect(() => {
    if (!slug) return;

    dispatch(resetCategoryPosts());

    dispatch(getCategoryPosts(slug, subSlug || null, articleSlug || null, 1, 12, { noCache: true }))
      .then((res) => {
        if (res && res.children) setAllChildren(res.children);
      });
  }, [slug, subSlug, articleSlug, dispatch]);

  // ================= Actualizar sub y article al cambiar URL =================
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
    if (slug) items.push({ label: categoryInfo?.name || slug, path: `/category/${slug}` });
    if (currentSub) items.push({ label: currentSub.name, path: `/category/${slug}/${currentSub.slug}` });
    if (currentArticle)
      items.push({
        label: currentArticle.name,
        path: `/category/${slug}/${currentSub.slug}/${currentArticle.slug}`,
      });
    return items;
  };

  // ================= Render =================
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      <main className="flex-grow-1">
        <Container className="py-4">
          {/* BreadcrumbNav solo */}
          <BreadcrumbNav items={buildBreadcrumbItems()} />

          {/* Slider categoría nivel 1 */}
          {categoryInfo && (
            <CategorySlider
              categories={[categoryInfo]}
              onCategoryClick={() => history.push(`/category/${slug}`)}
            />
          )}

          {/* Slider unificado subcategorías / artículos */}
          {allChildren.length > 0 && (
            <SliderUnificado
              items={
                currentSub && currentSub.articles?.length > 0
                  ? currentSub.articles
                  : allChildren
              }
              activeItem={currentArticle || currentSub}
              onItemClick={(item) => {
                if (!currentSub || currentSub.articles?.length === 0) {
                  // Click en subcategoría
                  history.push(`/category/${slug}/${item.slug}`);
                } else {
                  // Click en artículo
                  history.push(`/category/${slug}/${currentSub.slug}/${item.slug}`);
                }
              }}
            />
          )}

          {/* Posts */}
          <section className="mt-3">
            {postsLoading && (!posts || posts.length === 0) && !postsError ? (
              <div className="d-flex justify-content-center py-5">
                <Spinner animation="border" />
              </div>
            ) : posts && posts.length > 0 ? (
              <InfiniteScroll
                dataLength={posts.length}
                hasMore={hasMorePosts}
                loader={<Spinner animation="border" size="sm" className="d-block mx-auto my-3" />}
                next={() =>
                  dispatch(
                    getCategoryPosts(
                      slug,
                      subSlug || null,
                      articleSlug || null,
                      Math.floor(posts.length / 12) + 1,
                      12
                    )
                  )
                }
              >
                <Row xs={1} md={2} lg={3} xl={4} className="g-4">
                  {posts.map((post) => (
                    <Col key={post._id}>
                      <PostCard post={post} />
                    </Col>
                  ))}
                </Row>
              </InfiniteScroll>
            ) : (
              <div className="text-center py-5">
                {currentArticle
                  ? `No hay resultados para "${currentArticle.name}"`
                  : "No hay productos disponibles"}
              </div>
            )}
          </section>
        </Container>
      </main>
    </div>
  );
};

export default CategoryPage;
