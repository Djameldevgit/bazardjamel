import React, { useRef, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const CategorySlider = ({ categories = [], onCategoryClick }) => {
  const history = useHistory();
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  
  // Agrupar categorías en pares para mostrar 2 por columna
  const groupedCategories = [];
  for (let i = 0; i < categories.length; i += 2) {
    groupedCategories.push({
      top: categories[i],
      bottom: categories[i + 1] || null
    });
  }

  useEffect(() => {
    const checkScroll = () => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        setCanScrollLeft(scrollLeft > 0);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };
    
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [groupedCategories]);

  const handleClick = (cat) => {
    if (!cat) return;
    if (onCategoryClick) {
      onCategoryClick(cat);
    } else {
      history.push(`/category/${cat.slug}`);
    }
  };

  const formatName = (name) => {
    if (!name) return "";
    const maxLength = window.innerWidth <= 767 ? 10 : 14;
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + "...";
  };

  const scrollLeft = () => {
    if (sliderRef.current && canScrollLeft) {
      sliderRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current && canScrollRight) {
      sliderRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  // Si hay más de 4 columnas (8 categorías), mostrar scroll
  const hasScroll = groupedCategories.length > 4;

  return (
    <div className="category-slider-container">
      {/* Botones solo en desktop */}
      {hasScroll && window.innerWidth > 767 && (
        <div className="slider-nav-buttons">
          <button 
            className={`nav-btn prev-btn ${!canScrollLeft ? 'disabled' : ''}`}
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            aria-label="Précédent"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <button 
            className={`nav-btn next-btn ${!canScrollRight ? 'disabled' : ''}`}
            onClick={scrollRight}
            disabled={!canScrollRight}
            aria-label="Suivant"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
      )}

      {/* Slider con UNA sola fila (scroll horizontal) */}
      <div 
        ref={sliderRef}
        className="category-slider"
        onScroll={handleScroll}
      >
        {groupedCategories.map((group, index) => (
          <div
            key={index}
            className="category-slider-item"
            style={{ animationDelay: `${index * 0.03}s` }}
          >
            {/* Categoría superior */}
            <div 
              className="icon-container"
              onClick={() => handleClick(group.top)}
            >
              {group.top.icon ? (
                <img 
                  src={group.top.icon} 
                  alt={group.top.name} 
                  className="category-icon"
                  loading="lazy"
                />
              ) : (
                <div className="icon-fallback">
                  {group.top.name?.charAt(0).toUpperCase()}
                </div>
              )}
              
              {group.top.count > 0 && (
                <span className="item-count">{group.top.count}</span>
              )}
            </div>
            
            {/* Nombre categoría superior */}
            <div 
              className="category-name"
              onClick={() => handleClick(group.top)}
            >
              {formatName(group.top.name)}
            </div>

            {/* Categoría inferior (si existe) */}
            {group.bottom && (
              <>
                <div 
                  className="icon-container"
                  onClick={() => handleClick(group.bottom)}
                  style={{ marginTop: '1rem' }}
                >
                  {group.bottom.icon ? (
                    <img 
                      src={group.bottom.icon} 
                      alt={group.bottom.name} 
                      className="category-icon"
                      loading="lazy"
                    />
                  ) : (
                    <div className="icon-fallback">
                      {group.bottom.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  {group.bottom.count > 0 && (
                    <span className="item-count">{group.bottom.count}</span>
                  )}
                </div>
                
                {/* Nombre categoría inferior */}
                <div 
                  className="category-name"
                  onClick={() => handleClick(group.bottom)}
                >
                  {formatName(group.bottom.name)}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Indicador para móvil */}
      {hasScroll && window.innerWidth <= 767 && (
        <div className="scroll-hint">
          <span>← Glisser →</span>
        </div>
      )}
    </div>
  );
};

export default CategorySlider;