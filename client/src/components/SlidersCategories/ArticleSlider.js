// src/components/SlidersCategories/ArticleSlider.jsx
import React, { useState, useEffect } from "react";

const ArticleSlider = ({ 
  articles = [], 
  currentCategory,
  currentSubcategory,
  currentArticle,
  onArticleClick 
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [imageErrors, setImageErrors] = useState({});
  const [itemsPerPage, setItemsPerPage] = useState(6); // 6 por defecto (3x2)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Detectar cambios en el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Determinar cuántos artículos mostrar según el ancho de pantalla
  useEffect(() => {
    if (windowWidth <= 767) {
      // MÓVIL/ANDROID: 8 artículos (4x2)
      setItemsPerPage(8);
    } else if (windowWidth <= 1023) {
      // TABLET: 6 artículos (3x2)
      setItemsPerPage(6);
    } else if (windowWidth <= 1439) {
      // DESKTOP: 8 artículos (4x2)
      setItemsPerPage(8);
    } else {
      // PANTALLAS MUY GRANDES: 10 artículos (5x2)
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
    
    console.log('🖱️ Clic en artículo:', article.name);
    if (onArticleClick) {
      onArticleClick(article);
    }
  };

  const handleImageError = (articleId) => {
    setImageErrors(prev => ({ ...prev, [articleId]: true }));
  };

  // Si no hay artículos, no mostrar nada (como en el original)
  if (!articles || articles.length === 0) {
    return null;
  }

  // Verificar si un artículo está activo
  const isArticleActive = (article) => {
    return currentArticle?.slug === article.slug;
  };

  return (
    <div className="cs-slider-final cs-article-slider">
      <div className="cs-slider-header">
        <div>
          <h2 className="cs-slider-title">
            <span className="cs-category-name">{currentSubcategory?.name || "Artículos"}</span>
            <span className="cs-slider-subtitle"> - Tipos</span>
          </h2>
          <p className="cs-slider-description">
            Selecciona un tipo de artículo específico
          </p>
        </div>
        <div className="cs-page-indicator">
          <span className="cs-current-page">{currentPage + 1}</span>
          <span className="cs-separator">/</span>
          <span className="cs-total-pages">{totalPages}</span>
        </div>
      </div>
      
      <div className="cs-slider-container">
        {/* Página actual */}
        {pages.length > 0 && (
          <div className="cs-slider-page cs-active">
            {/* Primera fila */}
            <div className="cs-category-row cs-first-row">
              {pages[currentPage].row1.map((article, index) => {
                const isActive = article ? isArticleActive(article) : false;
                
                return (
                  <div
                    key={article?._id || `cs-art-empty-${index}`}
                    className={`cs-category-item ${article ? '' : 'cs-empty-item'} ${isActive ? 'cs-active-item' : ''}`}
                    onClick={() => handleClick(article)}
                    style={{ 
                      '--cs-item-delay': index,
                      '--cs-icon-bg-color': isActive ? '#4ECDC4' : (article?.iconColor || '#f0f0f0')
                    }}
                  >
                    {article ? (
                      <>
                        <div className="cs-image-container">
                          {article.icon && !imageErrors[article._id] ? (
                            <img 
                              src={article.icon}
                              alt={article.name || "Artículo"}
                              className="cs-category-image"
                              onError={() => handleImageError(article._id)}
                            />
                          ) : (
                            <div className="cs-image-fallback">
                              {article.name ? article.name.charAt(0).toUpperCase() : "A"}
                            </div>
                          )}
                          
                          {/* Indicador de activo */}
                          {isActive && (
                            <div className="cs-active-badge">
                              <span className="cs-active-dot"></span>
                            </div>
                          )}
                        </div>
                        
                        <div className="cs-category-name">
                          {article.name || "Sin nombre"}
                        </div>
                        
                        {/* Contador de posts si existe */}
                        {article.postCount > 0 && (
                          <div className="cs-product-count">
                            {article.postCount}
                          </div>
                        )}
                        
                        {/* Indicador de selección */}
                        {isActive && (
                          <div className="cs-selected-indicator">
                            <i className="fas fa-check-circle"></i>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="cs-empty-space"></div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Segunda fila */}
            <div className="cs-category-row cs-second-row">
              {pages[currentPage].row2.map((article, index) => {
                const isActive = article ? isArticleActive(article) : false;
                
                return (
                  <div
                    key={article?._id || `cs-art-empty2-${index}`}
                    className={`cs-category-item ${article ? '' : 'cs-empty-item'} ${isActive ? 'cs-active-item' : ''}`}
                    onClick={() => handleClick(article)}
                    style={{ 
                      '--cs-item-delay': index + columnsPerRow,
                      '--cs-icon-bg-color': isActive ? '#4ECDC4' : (article?.iconColor || '#f0f0f0')
                    }}
                  >
                    {article ? (
                      <>
                        <div className="cs-image-container">
                          {article.icon && !imageErrors[article._id] ? (
                            <img 
                              src={article.icon}
                              alt={article.name || "Artículo"}
                              className="cs-category-image"
                              onError={() => handleImageError(article._id)}
                            />
                          ) : (
                            <div className="cs-image-fallback">
                              {article.name ? article.name.charAt(0).toUpperCase() : "A"}
                            </div>
                          )}
                          
                          {/* Indicador de activo */}
                          {isActive && (
                            <div className="cs-active-badge">
                              <span className="cs-active-dot"></span>
                            </div>
                          )}
                        </div>
                        
                        <div className="cs-category-name">
                          {article.name || "Sin nombre"}
                        </div>
                        
                        {article.postCount > 0 && (
                          <div className="cs-product-count">
                            {article.postCount}
                          </div>
                        )}
                        
                        {isActive && (
                          <div className="cs-selected-indicator">
                            <i className="fas fa-check-circle"></i>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="cs-empty-space"></div>
                    )}
                  </div>
                );
              })}
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
        {articles.length} tipos de artículos • Página {currentPage + 1} de {totalPages}
      </div>
      
      {/* Información de ruta */}
      {currentArticle && (
        <div className="cs-article-info">
          <div className="cs-article-selected">
            <span className="cs-info-label">Artículo seleccionado:</span>
            <span className="cs-article-name-badge">
              <i className="fas fa-check-circle me-2"></i>
              {currentArticle.name}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleSlider;