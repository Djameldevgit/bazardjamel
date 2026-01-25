import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const CategorySlider = ({ categories = [], onCategoryClick }) => {
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
    
    for (let i = 0; i < categories.length; i += itemsPerPage) {
      const pageCategories = categories.slice(i, i + itemsPerPage);
      
      const row1 = pageCategories.slice(0, columnsPerRow);
      const row2 = pageCategories.slice(columnsPerRow, itemsPerPage);
      
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

  const handleClick = (category) => {
    if (!category) return;
    
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
      <div className="cs-no-categories">
        <div className="cs-empty-icon">📦</div>
        <h3 className="cs-no-categories-title">Aucune catégorie disponible</h3>
        <p className="cs-no-categories-description">Les catégories seront bientôt ajoutées</p>
      </div>
    );
  }

  return (
    <div className="cs-slider-final">
   
      <div className="cs-slider-container">
        {pages.length > 0 && (
          <div className="cs-slider-page cs-active">
            {/* Primera fila */}
            <div className="cs-category-row cs-first-row">
              {pages[currentPage].row1.map((cat, index) => (
                <div
                  key={cat?._id || `cs-empty-${index}`}
                  className={`cs-category-item ${cat ? '' : 'cs-empty-item'}`}
                  onClick={() => handleClick(cat)}
                  style={{ 
                    '--cs-item-delay': index,
                    '--cs-icon-bg-color': cat?.iconColor || '#f8f9fa'
                  }}
                >
                  {cat ? (
                    <>
                      <div className="cs-image-container">
                        {cat.icon && !imageErrors[cat._id] ? (
                          <img 
                            src={cat.icon}
                            alt={cat.name || "Catégorie"}
                            className="cs-category-image"
                            onError={() => handleImageError(cat._id, cat.icon)}
                          />
                        ) : (
                          <div className="cs-image-fallback">
                            {cat.name ? cat.name.charAt(0).toUpperCase() : "C"}
                          </div>
                        )}
                      </div>
                      
                      <div className="cs-category-name">
                        {cat.name || "Sans nom"}
                      </div>
                      
                      {cat.posts && cat.posts.length > 0 && (
                        <div className="cs-product-count">
                          {cat.posts.length}
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
              {pages[currentPage].row2.map((cat, index) => (
                <div
                  key={cat?._id || `cs-empty2-${index}`}
                  className={`cs-category-item ${cat ? '' : 'cs-empty-item'}`}
                  onClick={() => handleClick(cat)}
                  style={{ 
                    '--cs-item-delay': index + columnsPerRow,
                    '--cs-icon-bg-color': cat?.iconColor || '#f8f9fa'
                  }}
                >
                  {cat ? (
                    <>
                      <div className="cs-image-container">
                        {cat.icon && !imageErrors[cat._id] ? (
                          <img 
                            src={cat.icon}
                            alt={cat.name || "Catégorie"}
                            className="cs-category-image"
                            onError={() => handleImageError(cat._id, cat.icon)}
                          />
                        ) : (
                          <div className="cs-image-fallback">
                            {cat.name ? cat.name.charAt(0).toUpperCase() : "C"}
                          </div>
                        )}
                      </div>
                      
                      <div className="cs-category-name">
                        {cat.name || "Sans nom"}
                      </div>
                      
                      {cat.posts && cat.posts.length > 0 && (
                        <div className="cs-product-count">
                          {cat.posts.length}
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
    
    </div>
  );
};

export default CategorySlider;