import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const SliderArticle = ({ 
  articles = [], 
  currentSubcategory,
  currentArticle,
  onArticleClick 
}) => {
  const history = useHistory();
  const [imageErrors, setImageErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Detectar cambios en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determinar cuántos iconos mostrar según el ancho de pantalla
  useEffect(() => {
    if (windowWidth <= 767) {
      setItemsPerPage(8);
    } else if (windowWidth <= 1023) {
      setItemsPerPage(6);
    } else if (windowWidth <= 1439) {
      setItemsPerPage(8);
    } else {
      setItemsPerPage(10);
    }
  }, [windowWidth]);

  // Calcular columnas por fila
  const columnsPerRow = itemsPerPage / 2;

  // Crear páginas con exactamente 2 filas cada una
  const createPages = () => {
    const pages = [];
    
    for (let i = 0; i < articles.length; i += itemsPerPage) {
      const pageArticles = articles.slice(i, i + itemsPerPage);
      
      const row1 = pageArticles.slice(0, columnsPerRow);
      const row2 = pageArticles.slice(columnsPerRow, itemsPerPage);
      
      const filledRow2 = [...row2];
      while (filledRow2.length < columnsPerRow) {
        filledRow2.push(null);
      }
      
      pages.push({
        row1,
        row2: filledRow2,
        pageNumber: pages.length + 1
      });
    }
    
    return pages;
  };

  const pages = createPages();
  const totalPages = pages.length;

  // Navegación
  const goToNextPage = () => {
    setCurrentPage(prev => (prev < totalPages - 1 ? prev + 1 : 0));
  };

  const goToPrevPage = () => {
    setCurrentPage(prev => (prev > 0 ? prev - 1 : totalPages - 1));
  };

  const goToPage = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const handleClick = (article) => {
    if (!article) return;
    
    if (onArticleClick) {
      onArticleClick(article);
    } else if (currentSubcategory?.slug) {
      // Navegar a la ruta del artículo (nivel 3)
      history.push(`/category/${currentSubcategory.slug}/${article.slug}`);
    }
  };

  const handleImageError = (articleId, imageUrl) => {
    console.error(`Error cargando imagen: ${imageUrl}`);
    setImageErrors(prev => ({ ...prev, [articleId]: true }));
  };

  // Si no hay artículos
  if (!articles || articles.length === 0) {
    return (
      <div className="cs-no-articles">
        <div className="cs-empty-icon">📄</div>
        <h3 className="cs-no-articles-title">Aucun article disponible</h3>
        <p className="cs-no-articles-description">
          Les articles seront bientôt ajoutés
        </p>
      </div>
    );
  }

  return (
    <div className="cs-slider-final cs-article-slider">
      <div className="cs-slider-header">
        <h2 className="cs-slider-title">
          <span className="cs-subcategory-name">{currentSubcategory?.name || "Sous-catégorie"}</span>
          <span className="cs-slider-subtitle"> - Types d'articles</span>
        </h2>
        <div className="cs-page-indicator">
          <span className="cs-current-page">{currentPage + 1}</span>
          <span className="cs-separator">/</span>
          <span className="cs-total-pages">{totalPages}</span>
        </div>
      </div>
      
      <div className="cs-slider-container">
        {pages.length > 0 && (
          <div className="cs-slider-page cs-active">
            {/* Primera fila */}
            <div className="cs-category-row cs-first-row">
              {pages[currentPage].row1.map((article, index) => (
                <div
                  key={article?._id || `cs-art-empty-${index}`}
                  className={`cs-category-item ${article ? '' : 'cs-empty-item'} ${article && currentArticle && (article.slug === currentArticle.slug || article._id === currentArticle._id) ? 'cs-active-item' : ''}`}
                  onClick={() => handleClick(article)}
                  style={{ 
                    '--cs-item-delay': index,
                    '--cs-icon-bg-color': article?.iconColor || '#f0f4f8'
                  }}
                >
                  {article ? (
                    <>
                      <div className="cs-image-container">
                        {article.icon && !imageErrors[article._id] ? (
                          <img 
                            src={article.icon}
                            alt={article.name || "Article"}
                            className="cs-category-image"
                            onError={() => handleImageError(article._id, article.icon)}
                          />
                        ) : (
                          <div className="cs-image-fallback">
                            {article.name ? article.name.charAt(0).toUpperCase() : "A"}
                          </div>
                        )}
                      </div>
                      
                      <div className="cs-category-name">
                        {article.name || "Sans nom"}
                      </div>
                      
                      {article.postCount > 0 && (
                        <div className="cs-product-count">
                          {article.postCount}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="cs-empty-space"></div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Segunda fila */}
            <div className="cs-category-row cs-second-row">
              {pages[currentPage].row2.map((article, index) => (
                <div
                  key={article?._id || `cs-art-empty2-${index}`}
                  className={`cs-category-item ${article ? '' : 'cs-empty-item'} ${article && currentArticle && (article.slug === currentArticle.slug || article._id === currentArticle._id) ? 'cs-active-item' : ''}`}
                  onClick={() => handleClick(article)}
                  style={{ 
                    '--cs-item-delay': index + columnsPerRow,
                    '--cs-icon-bg-color': article?.iconColor || '#f0f4f8'
                  }}
                >
                  {article ? (
                    <>
                      <div className="cs-image-container">
                        {article.icon && !imageErrors[article._id] ? (
                          <img 
                            src={article.icon}
                            alt={article.name || "Article"}
                            className="cs-category-image"
                            onError={() => handleImageError(article._id, article.icon)}
                          />
                        ) : (
                          <div className="cs-image-fallback">
                            {article.name ? article.name.charAt(0).toUpperCase() : "A"}
                          </div>
                        )}
                      </div>
                      
                      <div className="cs-category-name">
                        {article.name || "Sans nom"}
                      </div>
                      
                      {article.postCount > 0 && (
                        <div className="cs-product-count">
                          {article.postCount}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="cs-empty-space"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Navegación */}
        {totalPages > 1 && (
          <div className="cs-slider-controls">
            <button 
              className="cs-nav-btn cs-prev-btn"
              onClick={goToPrevPage}
              aria-label="Página anterior"
            >
              ‹
            </button>
            
            <div className="cs-page-indicators">
              {pages.map((_, index) => (
                <button
                  key={index}
                  className={`cs-page-indicator-btn ${index === currentPage ? 'cs-active' : ''}`}
                  onClick={() => goToPage(index)}
                  aria-label={`Ir a página ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            
            <button 
              className="cs-nav-btn cs-next-btn"
              onClick={goToNextPage}
              aria-label="Página siguiente"
            >
              ›
            </button>
          </div>
        )}
      </div>
      
      {/* Contador de artículos */}
      <div className="cs-categories-counter">
        {articles.length} types d'articles • Page {currentPage + 1} sur {totalPages}
      </div>
    </div>
  );
};

export default SliderArticle;