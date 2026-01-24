import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useHistory } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
 

const CategorySlider = ({ categories = [], onCategoryClick }) => {
  const history = useHistory();
  const [imageErrors, setImageErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(0);

  // Configuración fija: 3 columnas × 2 filas = 6 categorías por página
  const CATEGORIES_PER_PAGE = 6;
  const COLUMNS_PER_ROW = 3;

  // Calcular páginas
  const totalPages = Math.ceil(categories.length / CATEGORIES_PER_PAGE);
  
  // Dividir en páginas de 2 filas
  const getPages = () => {
    const pages = [];
    for (let i = 0; i < categories.length; i += CATEGORIES_PER_PAGE) {
      const pageItems = categories.slice(i, i + CATEGORIES_PER_PAGE);
      const row1 = pageItems.slice(0, COLUMNS_PER_ROW);
      const row2 = pageItems.slice(COLUMNS_PER_ROW, CATEGORIES_PER_PAGE);
      pages.push({ row1, row2 });
    }
    return pages;
  };

  const pages = getPages();

  // Configuración del slider Slick
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    beforeChange: (current, next) => setCurrentPage(next),
    appendDots: dots => (
      <div className="slider-dots-container">
        <ul className="slider-dots">{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div className={`custom-dot ${i === currentPage ? 'active' : ''}`}></div>
    ),
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

  const handleClick = (category) => {
    if (onCategoryClick) {
      onCategoryClick(category);
    } else {
      history.push(`/category/${category.slug}`);
    }
  };

  const handleImageError = (categoryId, imageUrl) => {
    console.error(`Error cargando imagen: ${imageUrl}`);
    setImageErrors(prev => ({ ...prev, [categoryId]: true }));
  };

  // Si no hay categorías
  if (!categories || categories.length === 0) {
    return (
      <div className="no-categories">
        <div className="empty-icon">📦</div>
        <h3>Aucune catégorie disponible</h3>
        <p>Les catégories seront bientôt ajoutées</p>
      </div>
    );
  }

  return (
    <div className="category-slider-container">
      <div className="slider-header">
        <h2 className="slider-title">Catégories Principales</h2>
        <div className="page-indicator">
          <span className="current-page">{currentPage + 1}</span>
          <span className="separator">/</span>
          <span className="total-pages">{totalPages}</span>
        </div>
      </div>
      
      <div className="slider-wrapper">
        <Slider {...settings}>
          {pages.map((page, pageIndex) => (
            <div key={pageIndex} className="slider-page">
              {/* PRIMERA FILA - 3 iconos */}
              <div className="slider-row">
                {page.row1.map((cat) => (
                  <div
                    key={cat._id}
                    className="category-item"
                    onClick={() => handleClick(cat)}
                  >
                    <div className="image-container">
                      {cat.icon && !imageErrors[cat._id] ? (
                        <img 
                          src={cat.icon}
                          alt={cat.name || "Catégorie"}
                          className="category-image"
                          onError={() => handleImageError(cat._id, cat.icon)}
                          onLoad={() => console.log(`✅ ${cat.name} cargada`)}
                        />
                      ) : (
                        <div className="image-fallback">
                          {cat.name ? cat.name.charAt(0).toUpperCase() : "C"}
                        </div>
                      )}
                    </div>
                    
                    <div className="category-name">
                      {cat.name || "Sans nom"}
                    </div>
                    
                    {cat.posts && cat.posts.length > 0 && (
                      <div className="product-count">
                        {cat.posts.length}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* SEGUNDA FILA - 3 iconos (si hay) */}
              {page.row2.length > 0 && (
                <div className="slider-row second-row">
                  {page.row2.map((cat) => (
                    <div
                      key={cat._id}
                      className="category-item"
                      onClick={() => handleClick(cat)}
                    >
                      <div className="image-container">
                        {cat.icon && !imageErrors[cat._id] ? (
                          <img 
                            src={cat.icon}
                            alt={cat.name || "Catégorie"}
                            className="category-image"
                            onError={() => handleImageError(cat._id, cat.icon)}
                          />
                        ) : (
                          <div className="image-fallback">
                            {cat.name ? cat.name.charAt(0).toUpperCase() : "C"}
                          </div>
                        )}
                      </div>
                      
                      <div className="category-name">
                        {cat.name || "Sans nom"}
                      </div>
                      
                      {cat.posts && cat.posts.length > 0 && (
                        <div className="product-count">
                          {cat.posts.length}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CategorySlider;