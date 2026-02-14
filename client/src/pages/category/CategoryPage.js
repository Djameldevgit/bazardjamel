// 📂 pages/CategoryPage.js
import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { Container, Spinner, Row, Col } from "react-bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";

import { getCategoryPosts, resetCategoryPosts } from "../../redux/actions/categoryAction";
import { getBoutiquesByCategory, resetAllBoutiques } from "../../redux/actions/boutiqueAction";
import BreadcrumbNav from "../../components/BreadcrumbNav";
import SliderUnificado from "../../components/SlidersCategories/SliderUnificado";
import PostCard from "../../components/PostCard";
import BoutiqueCard from "../../components/BoutiqueCard";
import PaginationComponent from "../../components/PaginationComponent";

const POSTS_SCROLL_LIMIT = 50;

const CategoryPage = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { slug, subSlug, articleSlug, page } = useParams();

  // Detectar si es boutique
  const isBoutique = slug === 'boutiques';

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

  // ============ ESTADO LOCAL ============
  const [allChildren, setAllChildren] = useState([]);
  const [currentSub, setCurrentSub] = useState(null);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [error, setError] = useState(null);

  const currentPage = parseInt(page) || 1;

  // ============ LOGS DE DEPURACIÓN ============
  useEffect(() => {
    console.log('🔍 CategoryPage - Estado:', {
      slug,
      isBoutique,
      subSlug,
      articleSlug,
      currentPage,
      postsCount: posts.length,
      boutiquesCount: boutiques.length,
      allChildrenCount: allChildren.length,
      categoryChildrenCount: categoryChildren.length,
      categoryPath
    });
  }, [slug, isBoutique, subSlug, articleSlug, currentPage, posts.length, boutiques.length, allChildren, categoryChildren, categoryPath]);

  // ============ REDIRECCIÓN SEGURA ============
  useEffect(() => {
    if (!slug) return;

    if (!page) {
      if (articleSlug) history.replace(`/${slug}/${subSlug}/${articleSlug}/1`);
      else if (subSlug) history.replace(`/${slug}/${subSlug}/1`);
      else history.replace(`/${slug}/1`);
      return;
    }
  }, [slug, subSlug, articleSlug, page, history]);

  // ============ CARGA INICIAL ============
  useEffect(() => {
    if (!slug || !page) return;

    // Resetear según el tipo
    if (isBoutique) {
      console.log('🔄 Resetando boutiques...');
      dispatch(resetAllBoutiques());
    } else {
      console.log('🔄 Resetando posts...');
      dispatch(resetCategoryPosts());
    }
    setAllChildren([]); // Reset local
    setCurrentSub(null);
    setCurrentArticle(null);

    const subParam = subSlug && subSlug !== 'undefined' ? subSlug : null;
    const articleParam = articleSlug && articleSlug !== 'undefined' ? articleSlug : null;

    const loadData = async () => {
      try {
        if (isBoutique) {
          // Cargar boutiques
          console.log('🔄 Cargando boutiques...', { slug, subParam, currentPage });
          const res = await dispatch(getBoutiquesByCategory(slug, subParam, currentPage, 12));
          if (res?.children) {
            console.log('✅ Hijos de boutique recibidos:', res.children.length);
            setAllChildren(res.children);
          }
        } else {
          // Cargar posts normales
          console.log('🔄 Cargando posts...', { slug, subParam, articleParam, currentPage });
          const res = await dispatch(getCategoryPosts(slug, subParam, articleParam, currentPage, 12));
          if (res?.children) {
            console.log('✅ Hijos de posts recibidos:', res.children.length);
            setAllChildren(res.children);
          }
        }
      } catch (err) {
        console.error('❌ Error cargando datos:', err);
        setError(err.message);
      }
    };

    loadData();
  }, [slug, subSlug, articleSlug, currentPage, dispatch, page, isBoutique]);

  // ============ ACTUALIZAR SUB Y ARTICLE ============
  useEffect(() => {
    if (subSlug && allChildren.length > 0) {
      const foundSub = allChildren.find((c) => c.slug === subSlug);
      setCurrentSub(foundSub || null);

      if (!isBoutique && articleSlug && foundSub?.articles) {
        const foundArticle = foundSub.articles.find((a) => a.slug === articleSlug);
        setCurrentArticle(foundArticle || null);
      } else {
        setCurrentArticle(null);
      }
    } else {
      setCurrentSub(null);
      setCurrentArticle(null);
    }
  }, [subSlug, articleSlug, allChildren, isBoutique]);

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

  // ============ CARGAR MÁS ============
  const loadMore = useCallback(() => {
    if (isBoutique) {
      if (!hasMoreBoutiques || boutiquesLoading) {
        console.log('⏸️ No más boutiques para cargar');
        return;
      }
      const nextPage = currentPage + 1;
      console.log('📦 Cargando más boutiques:', { nextPage });
      dispatch(getBoutiquesByCategory(slug, subSlug || null, nextPage, 12));
    } else {
      if (!hasMorePosts || postsLoading || posts.length >= POSTS_SCROLL_LIMIT) {
        console.log('⏸️ No más posts para cargar');
        return;
      }
      const nextPage = currentPage + 1;
      console.log('📦 Cargando más posts:', { nextPage });
      dispatch(getCategoryPosts(slug, subSlug || null, articleSlug || null, nextPage, 12));
    }
  }, [isBoutique, hasMoreBoutiques, boutiquesLoading, hasMorePosts, postsLoading, posts.length, 
      currentPage, dispatch, slug, subSlug, articleSlug]);

  // ============ CLICK EN SLIDER ============
  const handleSliderClick = useCallback((item) => {
    console.log('🖱️ Click en slider:', item);
    
    if (isBoutique) {
      // Para boutiques: solo nivel 2
      history.push(`/${slug}/${item.slug}/1`);
    } else {
      // Para posts: puede ser nivel 2 o 3
      if (!currentSub || currentSub.articles?.length === 0) {
        history.push(`/${slug}/${item.slug}/1`);
      } else {
        history.push(`/${slug}/${currentSub.slug}/${item.slug}/1`);
      }
    }
  }, [slug, currentSub, history, isBoutique]);

  // ============ DETERMINAR ITEMS DEL SLIDER =================
  const getSliderItems = () => {
    console.log('🎯 getSliderItems:', {
      isBoutique,
      allChildrenLength: allChildren.length,
      currentSub: currentSub?.name,
      hasArticles: currentSub?.articles?.length,
      categoryChildrenLength: categoryChildren.length
    });

    // Para boutiques
    if (isBoutique) {
      // Prioridad 1: hijos del estado local (de la API)
      if (allChildren.length > 0) {
        return allChildren;
      }
      // Prioridad 2: hijos de categoryInfo
      if (categoryChildren.length > 0) {
        return categoryChildren;
      }
      return [];
    }

    // Para posts normales
    // Prioridad 1: artículos de la subcategoría actual
    if (currentSub && currentSub.articles?.length > 0) {
      return currentSub.articles;
    }
    
    // Prioridad 2: hijos del estado local (de la API)
    if (allChildren.length > 0) {
      return allChildren;
    }
    
    // Prioridad 3: hijos de categoryInfo
    if (categoryChildren.length > 0) {
      return categoryChildren;
    }
    
    return [];
  };

  // ================= DETERMINAR ITEM ACTIVO =================
  const getActiveItem = () => {
    if (isBoutique) {
      return currentSub;
    }
    
    // Para posts: priorizar artículo actual, luego subcategoría
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

  // ============ ESTADO DE CARGA Y DATOS ============
  const isLoading = isBoutique ? boutiquesLoading : postsLoading;
  const items = isBoutique ? boutiques : posts;
  const hasMore = isBoutique ? hasMoreBoutiques : hasMorePosts;
  const paginationData = isBoutique ? boutiquePagination : rawPagination;

  // Log para ver qué se va a renderizar
  console.log('🎨 Renderizando contenido:', {
    isBoutique,
    isLoading,
    itemsCount: items.length,
    hasMore,
    sliderItemsCount: getSliderItems().length
  });

  // ============ RENDER DEL CONTENIDO ============
  const renderContent = () => {
    // Mostrar error si existe
    if (error) {
      return (
        <div className="text-center py-5">
          <i className="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
          <h5 className="text-danger">Error</h5>
          <p className="text-muted">{error}</p>
        </div>
      );
    }

    // Mostrar loading
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

    // Mostrar items
    if (items.length > 0) {
      return (
        <>
          <InfiniteScroll
            key={currentPage}
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

          {/* Paginación numérica */}
          {paginationData.totalPages > 1 && (
            <div className="mt-4">
              <PaginationComponent
                currentPage={paginationData.currentPage}
                totalPages={paginationData.totalPages}
                onPageChange={(newPage) => {
                  history.push(buildCategoryUrl(newPage));
                  if (isBoutique) {
                    dispatch(getBoutiquesByCategory(slug, subSlug || null, newPage, 12));
                  } else {
                    dispatch(getCategoryPosts(slug, subSlug || null, articleSlug || null, newPage, 12));
                  }
                }}
              />
            </div>
          )}
        </>
      );
    }

    // No hay resultados
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
      <main className="category-content">
        <Container className="py-4">
          {/* Breadcrumb */}
          <div className="mb-3">
            <BreadcrumbNav items={buildBreadcrumbItems()} />
          </div>

          {/* Slider de categorías */}
          {getSliderItems().length > 0 && (
            <div className="mb-4">
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