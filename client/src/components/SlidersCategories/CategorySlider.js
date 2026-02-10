import React, { useRef, useEffect } from "react";
import { useHistory } from "react-router-dom";

const CategorySlider = ({ categories = [], onCategoryClick }) => {
  const history = useHistory();
  const sliderRef = useRef(null);
  const itemsPerRow = 4; // 4 iconos por fila = 8 total (2 filas)

  const handleClick = (cat) => {
    if (!cat) return;
    if (onCategoryClick) {
      onCategoryClick(cat);
    } else {
      history.push(`/category/${cat.slug}`);
    }
  };

  // Función para formatear el nombre (inicial + resto)
  const formatName = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    if (words.length <= 2) return name;
    return words.slice(0, 2).join(" ") + (words.length > 2 ? "..." : "");
  };

  // Scroll horizontal suave
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  // Detectar si hay scroll disponible
  const hasScroll = categories.length > itemsPerRow * 2;

  return (
    <div className="category-slider-container">
      {/* Encabezado */}
      <div className="slider-header">
     
        {hasScroll && (
          <div className="slider-nav-buttons">
            <button className="nav-btn prev-btn" onClick={scrollLeft} aria-label="Anterior">
              <i className="fas fa-chevron-left"></i>
            </button>
            <button className="nav-btn next-btn" onClick={scrollRight} aria-label="Siguiente">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        )}
      </div>

      {/* Contenedor del slider con scroll horizontal */}
      <div 
        ref={sliderRef} 
        className={`category-slider ${hasScroll ? 'has-scroll' : ''}`}
        style={{ 
          '--items-per-row': itemsPerRow,
          '--total-items': categories.length
        }}
      >
        {categories.map((cat, index) => (
          <div
            key={cat._id || index}
            className="category-slider-item"
            onClick={() => handleClick(cat)}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Contenedor del icono */}
            <div className="icon-container">
              {cat.icon ? (
                <img 
                  src={cat.icon} 
                  alt={cat.name} 
                  className="category-icon"
                  loading="lazy"
                />
              ) : (
                <div className="icon-fallback">
                  {cat.name?.charAt(0).toUpperCase()}
                </div>
              )}
              
              {/* Badge de contador (si hay posts) */}
              {cat.posts && cat.posts.length > 0 && (
                <span className="item-count">{cat.posts.length}</span>
              )}
            </div>

            {/* Nombre de la categoría */}
            <div className="category-name">
              {formatName(cat.name)}
            </div>
          </div>
        ))}
      </div>

      {/* Indicador de scroll (solo en móvil) */}
      {hasScroll && (
        <div className="scroll-indicator">
          <span className="scroll-dot active"></span>
          <span className="scroll-dot"></span>
          <span className="scroll-dot"></span>
        </div>
      )}

      {/* Contador de categorías */}
      {categories.length > 0 && (
        <div className="categories-counter">
          <span className="counter-text">
            {categories.length} {categories.length === 1 ? 'categoría' : 'categorías'}
          </span>
        </div>
      )}
    </div>
  );
};

export default CategorySlider;