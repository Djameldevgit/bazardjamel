// SubCategorySlider.jsx - VERSIÓN IDÉNTICA A CategorySlider
import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useHistory } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
 
const SubCategorySlider = ({ 
  subcategories = [], 
  currentCategory,
  onSubcategoryClick 
}) => {
  const history = useHistory();
  const [imageErrors, setImageErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    console.log('🔍 DEBUG SubCategorySlider - Props recibidas:', {
      totalSubcategories: subcategories.length,
      currentCategoryName: currentCategory?.name,
      currentCategorySlug: currentCategory?.slug,
      
      // Verificar PRIMERA subcategoría
      primeraSubcat: subcategories[0] || null,
      primeraSubcatIcon: subcategories[0]?.icon || 'NO TIENE',
      primeraSubcatName: subcategories[0]?.name || 'NO NOMBRE',
      
      // Verificar TODAS las subcategorías
      subcatsConIcono: subcategories.filter(sc => sc.icon).length,
      subcatsSinIcono: subcategories.filter(sc => !sc.icon).length,
      
      // Estructura completa de la primera
      estructuraCompletaPrimera: subcategories[0] ? {
        campos: Object.keys(subcategories[0]),
        valores: subcategories[0]
      } : 'No hay subcategorías'
    });

    // Guardar info para mostrar en UI
    setDebugInfo({
      total: subcategories.length,
      conIcono: subcategories.filter(sc => sc.icon).length,
      primeraIcon: subcategories[0]?.icon || 'No tiene',
      primeraNombre: subcategories[0]?.name || 'Sin nombre'
    });

    // Mostrar todas las subcategorías
    if (subcategories.length > 0) {
      console.log('📋 LISTA COMPLETA DE SUBCATEGORÍAS:');
      subcategories.forEach((sc, i) => {
        console.log(`${i}. ${sc.name}:`, {
          icon: sc.icon || '❌ NO',
          iconType: sc.iconType,
          iconColor: sc.iconColor,
          bgColor: sc.bgColor,
          nivel: sc.level,
          slug: sc.slug
        });
      });
    }
  }, [subcategories, currentCategory]);

  // ⭐ MISMAS CONFIGURACIONES QUE CategorySlider
  const CATEGORIES_PER_PAGE = 6; // 6 por página (3x2)
  const COLUMNS_PER_ROW = 3; // 3 columnas por fila

  // Calcular páginas
  const totalPages = Math.ceil(subcategories.length / CATEGORIES_PER_PAGE);
  
  // Dividir en páginas de 2 filas (IDÉNTICO)
  const getPages = () => {
    const pages = [];
    for (let i = 0; i < subcategories.length; i += CATEGORIES_PER_PAGE) {
      const pageItems = subcategories.slice(i, i + CATEGORIES_PER_PAGE);
      const row1 = pageItems.slice(0, COLUMNS_PER_ROW);
      const row2 = pageItems.slice(COLUMNS_PER_ROW, CATEGORIES_PER_PAGE);
      pages.push({ row1, row2 });
    }
    return pages;
  };

  const pages = getPages();

  // ⭐ CONFIGURACIÓN SLICK IDÉNTICA
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

  const handleClick = (subcategory) => {
    if (onSubcategoryClick) {
      onSubcategoryClick(subcategory);
    } else if (currentCategory?.slug) {
      history.push(`/category/${currentCategory.slug}/${subcategory.slug}`);
    }
  };

  const handleImageError = (subcatId, imageUrl) => {
    console.error(`❌ Error cargando imagen subcategoría: ${imageUrl}`);
    setImageErrors(prev => ({ ...prev, [subcatId]: true }));
  };

  // ⭐ DEBUG: Verificar datos recibidos
  useEffect(() => {
    console.log('🔍 SubCategorySlider - Datos recibidos:', {
      totalSubcategories: subcategories.length,
      currentCategory: currentCategory?.name,
      firstSubcat: subcategories[0] || {},
      // Verificar rutas de imágenes
      imagePaths: subcategories.slice(0, 3).map(sc => ({
        name: sc.name,
        icon: sc.icon,
        hasIcon: !!sc.icon
      }))
    });
  }, [subcategories, currentCategory]);

  // Si no hay subcategorías
  if (!subcategories || subcategories.length === 0) {
    return (
      <div className="no-subcategories">
        <div className="empty-icon">📂</div>
        <h3>Aucune sous-catégorie disponible</h3>
        <p>Les sous-catégories seront bientôt ajoutées</p>
      </div>
    );
  }

  return (
    <div className="category-slider-container"> {/* ⭐ MISMA CLASE */}
      <div className="slider-header">
        <h2 className="slider-title">
          Sous-catégories de <span style={{ color: '#4ECDC4' }}>{currentCategory?.name || ''}</span>
        </h2>
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
              {/* ⭐ PRIMERA FILA - 3 iconos (IDÉNTICO) */}
              <div className="slider-row">
                {page.row1.map((subcat) => (
                  <div
                    key={subcat._id || subcat.slug}
                    className="category-item" // ⭐ MISMA CLASE
                    onClick={() => handleClick(subcat)}
                  >
                    <div className="image-container">
                      {subcat.icon && !imageErrors[subcat._id] ? (
                        <img 
                          src={subcat.icon}
                          alt={subcat.name || "Sous-catégorie"}
                          className="category-image" // ⭐ MISMA CLASE
                          onError={() => handleImageError(subcat._id, subcat.icon)}
                          onLoad={() => console.log(`✅ ${subcat.name} cargada: ${subcat.icon}`)}
                        />
                      ) : (
                        <div className="image-fallback">
                          {subcat.name ? subcat.name.charAt(0).toUpperCase() : "S"}
                        </div>
                      )}
                    </div>
                    
                    <div className="category-name">
                      {subcat.name || "Sans nom"}
                    </div>
                    
                    {/* Opcional: Mostrar contador de productos si existe */}
                    {subcat.postCount > 0 && (
                      <div className="product-count">
                        {subcat.postCount}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* ⭐ SEGUNDA FILA - 3 iconos (si hay) (IDÉNTICO) */}
              {page.row2.length > 0 && (
                <div className="slider-row second-row">
                  {page.row2.map((subcat) => (
                    <div
                      key={subcat._id || subcat.slug}
                      className="category-item" // ⭐ MISMA CLASE
                      onClick={() => handleClick(subcat)}
                    >
                      <div className="image-container">
                        {subcat.icon && !imageErrors[subcat._id] ? (
                          <img 
                            src={subcat.icon}
                            alt={subcat.name || "Sous-catégorie"}
                            className="category-image" // ⭐ MISMA CLASE
                            onError={() => handleImageError(subcat._id, subcat.icon)}
                          />
                        ) : (
                          <div className="image-fallback">
                            {subcat.name ? subcat.name.charAt(0).toUpperCase() : "S"}
                          </div>
                        )}
                      </div>
                      
                      <div className="category-name">
                        {subcat.name || "Sans nom"}
                      </div>
                      
                      {subcat.postCount > 0 && (
                        <div className="product-count">
                          {subcat.postCount}
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

export default SubCategorySlider;