import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

const SubCategorySlider = ({ 
  subcategories = [], 
  currentCategory,
  onSubcategoryClick 
}) => {
  const history = useHistory();
  const [imageErrors, setImageErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
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

  // Determinar cuántos iconos mostrar según el ancho de pantalla
  useEffect(() => {
    if (windowWidth <= 767) {
      // MÓVIL/ANDROID: 8 iconos (4x2)
      setItemsPerPage(8);
    } else if (windowWidth <= 1023) {
      // TABLET: 6 iconos (3x2)
      setItemsPerPage(6);
    } else if (windowWidth <= 1439) {
      // DESKTOP: 8 iconos (4x2)
      setItemsPerPage(8);
    } else {
      // PANTALLAS MUY GRANDES: 10 iconos (5x2)
      setItemsPerPage(10);
    }
  }, [windowWidth]);

  // Calcular columnas por fila
  const columnsPerRow = itemsPerPage / 2;

  // Crear páginas con exactamente 2 filas cada una
  const createPages = () => {
    const pages = [];
    
    for (let i = 0; i < subcategories.length; i += itemsPerPage) {
      const pageSubcategories = subcategories.slice(i, i + itemsPerPage);
      
      const row1 = pageSubcategories.slice(0, columnsPerRow);
      const row2 = pageSubcategories.slice(columnsPerRow, itemsPerPage);
      
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

  const handleClick = (subcategory) => {
    if (!subcategory) return;
    
    if (onSubcategoryClick) {
      onSubcategoryClick(subcategory);
    } else if (currentCategory?.slug) {
      history.push(`/category/${currentCategory.slug}/${subcategory.slug}`);
    }
  };

  const handleImageError = (subcatId, imageUrl) => {
    console.error(`Error cargando imagen: ${imageUrl}`);
    setImageErrors(prev => ({ ...prev, [subcatId]: true }));
  };

  // Si no hay subcategorías
  if (!subcategories || subcategories.length === 0) {
    return (
      <div className="cs-no-subcategories">
        <div className="cs-empty-icon">📂</div>
        <h3 className="cs-no-subcategories-title">Aucune sous-catégorie disponible</h3>
        <p className="cs-no-subcategories-description">
          Les sous-catégories seront bientôt ajoutées
        </p>
      </div>
    );
  }

  return (
    <div className="cs-slider-final cs-subcategory-slider">
      <div className="cs-slider-header">
        <h2 className="cs-slider-title">
          <span className="cs-category-name">{currentCategory?.name || "Catégorie"}</span>
          <span className="cs-slider-subtitle"> - Sous-catégories</span>
        </h2>
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
              {pages[currentPage].row1.map((subcat, index) => (
                <div
                  key={subcat?._id || `cs-sub-empty-${index}`}
                  className={`cs-category-item ${subcat ? '' : 'cs-empty-item'}`}
                  onClick={() => handleClick(subcat)}
                  style={{ 
                    '--cs-item-delay': index,
                    '--cs-icon-bg-color': subcat?.iconColor || '#e3f2fd'
                  }}
                >
                  {subcat ? (
                    <>
                      <div className="cs-image-container">
                        {subcat.icon && !imageErrors[subcat._id] ? (
                          <img 
                            src={subcat.icon}
                            alt={subcat.name || "Sous-catégorie"}
                            className="cs-category-image"
                            onError={() => handleImageError(subcat._id, subcat.icon)}
                          />
                        ) : (
                          <div className="cs-image-fallback">
                            {subcat.name ? subcat.name.charAt(0).toUpperCase() : "S"}
                          </div>
                        )}
                      </div>
                      
                      <div className="cs-category-name">
                        {subcat.name || "Sans nom"}
                      </div>
                      
                      {subcat.postCount > 0 && (
                        <div className="cs-product-count">
                          {subcat.postCount}
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
              {pages[currentPage].row2.map((subcat, index) => (
                <div
                  key={subcat?._id || `cs-sub-empty2-${index}`}
                  className={`cs-category-item ${subcat ? '' : 'cs-empty-item'}`}
                  onClick={() => handleClick(subcat)}
                  style={{ 
                    '--cs-item-delay': index + columnsPerRow,
                    '--cs-icon-bg-color': subcat?.iconColor || '#e3f2fd'
                  }}
                >
                  {subcat ? (
                    <>
                      <div className="cs-image-container">
                        {subcat.icon && !imageErrors[subcat._id] ? (
                          <img 
                            src={subcat.icon}
                            alt={subcat.name || "Sous-catégorie"}
                            className="cs-category-image"
                            onError={() => handleImageError(subcat._id, subcat.icon)}
                          />
                        ) : (
                          <div className="cs-image-fallback">
                            {subcat.name ? subcat.name.charAt(0).toUpperCase() : "S"}
                          </div>
                        )}
                      </div>
                      
                      <div className="cs-category-name">
                        {subcat.name || "Sans nom"}
                      </div>
                      
                      {subcat.postCount > 0 && (
                        <div className="cs-product-count">
                          {subcat.postCount}
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
      
      {/* Contador de subcategorías */}
      <div className="cs-categories-counter">
        {subcategories.length} sous-catégories • Page {currentPage + 1} sur {totalPages}
      </div>
    </div>
  );
};

export default SubCategorySlider;