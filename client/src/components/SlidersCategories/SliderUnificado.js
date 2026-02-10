import React, { useRef } from "react";

const SliderUnificado = ({
  title,
  items = [],
  activeItem,
  onItemClick,
  variant = "categoryPage", // "categoryPage", "home", o "subcategories"
  showCount = false, // Mostrar contador de posts
  maxRows = 2, // Máximo de filas (2 por defecto)
}) => {
  const sliderRef = useRef(null);
  
  if (!items || items.length === 0) return null;

  // Función para formatear el nombre (igual que CategorySlider)
  const formatName = (name) => {
    if (!name) return "";
    const words = name.split(" ");
    if (words.length <= 2) return name;
    return words.slice(0, 2).join(" ") + (words.length > 2 ? "..." : "");
  };

  // Determinar si hay scroll horizontal
  const itemsPerRow = 4; // 4 por fila en móvil
  const hasScroll = items.length > itemsPerRow * maxRows;

  // Scroll horizontal
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

  // Determinar el tipo de contenido para estilos específicos
  const getContentType = () => {
    if (variant === "categoryPage") {
      return "subcategories"; // En CategoryPage muestra subcategorías o artículos
    }
    return "categories"; // En Home muestra categorías principales
  };

  const contentType = getContentType();

  return (
    <div className={`unified-slider-container ${contentType}-slider ${variant}`}>
      
      {/* Encabezado condicional */}
      {title && variant !== "categoryPage" && (
        <div className="slider-header">
          <h3 className="slider-title">{title}</h3>
          
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
      )}

      {/* Slider con scroll horizontal */}
      <div 
        ref={sliderRef}
        className={`unified-slider ${hasScroll ? 'has-scroll' : ''}`}
        data-rows={maxRows}
        data-content={contentType}
      >
        {items.map((item, index) => {
          // Determinar si el item está activo
          const isActive = activeItem && (
            activeItem._id === item._id || 
            activeItem.slug === item.slug ||
            activeItem.name === item.name
          );

          // Contador de posts (si aplica)
          const itemCount = showCount ? (item.posts?.length || item.postCount || 0) : 0;

          return (
            <div
              key={item._id || item.slug || index}
              className={`slider-item ${isActive ? 'active' : ''}`}
              onClick={() => onItemClick(item)}
              style={{ animationDelay: `${index * 0.03}s` }}
              title={item.name} // Tooltip con nombre completo
            >
              {/* Contenedor del icono */}
              <div className="item-icon-container">
                {item.image?.url || item.icon ? (
                  <img 
                    src={item.image?.url || item.icon} 
                    alt={item.name} 
                    className="item-icon"
                    loading="lazy"
                  />
                ) : item.emoji ? (
                  <div className="emoji-icon">{item.emoji}</div>
                ) : (
                  <div className="icon-fallback">
                    {item.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                
                {/* Badge de contador */}
                {itemCount > 0 && (
                  <span className="item-count-badge">{itemCount}</span>
                )}
                
                {/* Indicador de activo */}
                {isActive && (
                  <div className="active-indicator"></div>
                )}
              </div>

              {/* Nombre del item */}
              <div className="item-name">
                {formatName(item.name)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicador de scroll (solo móvil y si hay scroll) */}
      {hasScroll && (
        <div className="scroll-indicator">
          <span className="scroll-dot active"></span>
          <span className="scroll-dot"></span>
          <span className="scroll-dot"></span>
        </div>
      )}

      {/* Información del contenido */}
      <div className="slider-info">
        <span className="info-text">
          {items.length} {contentType === 'subcategories' ? 'subcategorías' : contentType === 'categories' ? 'categorías' : 'artículos'}
        </span>
        
        {/* Indicador visual del item activo */}
        {activeItem && (
          <span className="active-item-indicator">
            <i className="fas fa-check-circle"></i>
            <span>{activeItem.name}</span>
          </span>
        )}
      </div>
    </div>
  );
};

// Props por defecto
SliderUnificado.defaultProps = {
  title: "",
  items: [],
  activeItem: null,
  onItemClick: () => {},
  variant: "categoryPage",
  showCount: false,
  maxRows: 2
};

export default SliderUnificado;