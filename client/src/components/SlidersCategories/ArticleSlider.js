// src/components/SlidersCategories/ArticleSlider.jsx
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ArticleSlider = ({ 
  articles = [], 
  currentCategory,
  currentSubcategory,
  currentArticle,
  onArticleClick 
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [imageErrors, setImageErrors] = useState({});

  useEffect(() => {
    console.log('🔍 ArticleSlider - Datos recibidos:', {
      totalArticulos: articles.length,
      categoria: currentCategory?.name,
      subcategoria: currentSubcategory?.name,
      articuloActivo: currentArticle?.name,
      primerosArticulos: articles.slice(0, 3).map(a => a.name)
    });
  }, [articles, currentCategory, currentSubcategory, currentArticle]);

  // Configuración del slider
  const ARTICLES_PER_PAGE = 6;
  const totalPages = Math.ceil(articles.length / ARTICLES_PER_PAGE);
  
  const getPages = () => {
    const pages = [];
    for (let i = 0; i < articles.length; i += ARTICLES_PER_PAGE) {
      pages.push(articles.slice(i, i + ARTICLES_PER_PAGE));
    }
    return pages;
  };

  const pages = getPages();

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    beforeChange: (current, next) => setCurrentPage(next),
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true
        }
      }
    ]
  };

  const handleClick = (article) => {
    console.log('🖱️ Clic en artículo:', article.name);
    if (onArticleClick) {
      onArticleClick(article);
    }
  };

  const handleImageError = (articleId) => {
    setImageErrors(prev => ({ ...prev, [articleId]: true }));
  };

  if (!articles || articles.length === 0) {
    return null;
  }

  return (
    <div className="article-slider-container mb-5">
      <div className="slider-header mb-4">
        <h3 className="h5 mb-2">
          {currentSubcategory?.name 
            ? `Artículos de ${currentSubcategory.name}`
            : 'Artículos disponibles'
          }
        </h3>
        <p className="text-muted small mb-0">
          Haz clic para filtrar por artículo específico
        </p>
      </div>
      
      <div className="slider-wrapper">
        <Slider {...settings}>
          {pages.map((pageArticles, pageIndex) => (
            <div key={pageIndex} className="article-slider-page">
              <div className="row g-3">
                {pageArticles.map((article) => {
                  const isActive = currentArticle?.slug === article.slug;
                  
                  return (
                    <div 
                      key={article._id || article.slug} 
                      className="col-4 col-md-3 col-lg-2"
                    >
                      <div 
                        className={`article-item text-center p-2 rounded ${isActive ? 'active' : ''}`}
                        onClick={() => handleClick(article)}
                        style={{
                          cursor: 'pointer',
                          border: isActive ? '2px solid #007bff' : '1px solid #ddd',
                          backgroundColor: isActive ? '#f0f8ff' : '#fff',
                          transition: 'all 0.2s'
                        }}
                      >
                        {/* Icono */}
                        <div className="article-icon mb-2">
                          {article.icon && !imageErrors[article._id] ? (
                            <img 
                              src={article.icon} 
                              alt={article.name}
                              className="img-fluid"
                              style={{ 
                                width: '40px', 
                                height: '40px',
                                objectFit: 'contain'
                              }}
                              onError={() => handleImageError(article._id)}
                            />
                          ) : (
                            <div 
                              className="icon-placeholder rounded-circle mx-auto"
                              style={{
                                width: '40px',
                                height: '40px',
                                backgroundColor: isActive ? '#007bff' : '#6c757d',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '16px'
                              }}
                            >
                              {article.name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                          )}
                        </div>
                        
                        {/* Nombre */}
                        <div className="article-name">
                          <div className="small" style={{
                            fontWeight: isActive ? 'bold' : 'normal',
                            color: isActive ? '#007bff' : '#495057',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {article.name}
                          </div>
                          
                          {/* Indicador de activo */}
                          {isActive && (
                            <div className="active-indicator mt-1">
                              <span className="badge bg-primary" style={{ fontSize: '9px' }}>
                                ACTIVO
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </Slider>
      </div>
      
      {/* Indicador de página */}
      {totalPages > 1 && (
        <div className="text-center mt-3">
          <small className="text-muted">
            Página {currentPage + 1} de {totalPages}
          </small>
        </div>
      )}
    </div>
  );
};

export default ArticleSlider;