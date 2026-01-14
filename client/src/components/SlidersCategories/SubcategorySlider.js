// src/components/SlidersHeadrs/SubcategorySlider.js - VERSIÓN CORREGIDA
import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const SubcategorySlider = ({ categoryName, subcategories }) => {
  const { subcategorySlug } = useParams();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollRef = useRef(null);

  // Configuración responsive
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Actualizar botones de scroll
  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  // Scroll functions
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  // Manejar scroll
  const handleScroll = () => {
    updateScrollButtons();
  };

  // Verificar si una subcategoría está activa
  const isActive = (slugToCheck) => {
    if (!slugToCheck) return false;
    
    // Si estamos en la página principal de categoría (sin subcategoría seleccionada)
    if (!subcategorySlug && slugToCheck === 'all') {
      return true;
    }
    
    return subcategorySlug === slugToCheck;
  };

  // Obtener enlace para subcategoría
  const getSubcategoryLink = (slug) => {
    if (slug === 'all') {
      return `/${categoryName}/1`;
    }
    return `/${categoryName}/${slug}/1`;
  };

  // Obtener nombre para mostrar
  const getDisplayName = (subcategory) => {
    if (subcategory.slug === 'all') {
      return 'Tous';
    }
    
    return subcategory.name || subcategory.slug;
  };

  if (!subcategories || subcategories.length === 0) {
    return null;
  }

  // Agregar "Tous" al inicio
  const allSubcategories = [
    { slug: 'all', name: 'Tous' },
    ...subcategories
  ];

  return (
    <div className="subcategory-slider-container mb-4">
      <div style={{
        position: 'relative',
        background: 'white',
        borderRadius: '15px',
        padding: '15px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #e9ecef'
      }}>
        {/* Scroll container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            display: 'flex',
            overflowX: 'auto',
            scrollBehavior: 'smooth',
            gap: '10px',
            padding: '5px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {allSubcategories.map((subcategory, index) => {
            const active = isActive(subcategory.slug);
            
            return (
              <Link
                key={`${subcategory.slug}-${index}`}
                to={getSubcategoryLink(subcategory.slug)}
                style={{
                  textDecoration: 'none',
                  flexShrink: 0
                }}
              >
                <div style={{
                  padding: '10px 20px',
                  borderRadius: '25px',
                  background: active ? '#4361ee' : '#f8f9fa',
                  color: active ? 'white' : '#495057',
                  border: `1px solid ${active ? '#4361ee' : '#dee2e6'}`,
                  fontWeight: '500',
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = '#e9ecef';
                    e.currentTarget.style.borderColor = '#adb5bd';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = '#f8f9fa';
                    e.currentTarget.style.borderColor = '#dee2e6';
                  }
                }}
                >
                  {getDisplayName(subcategory)}
                  {subcategory.count && subcategory.count > 0 && (
                    <span style={{
                      marginLeft: '6px',
                      fontSize: '0.8em',
                      opacity: active ? 0.9 : 0.7
                    }}>
                      ({subcategory.count})
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        {/* Botones de scroll solo en mobile */}
        {isMobile && allSubcategories.length > 4 && (
          <>
            {canScrollLeft && (
              <button
                onClick={scrollLeft}
                style={{
                  position: 'absolute',
                  left: '5px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 20,
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#4361ee'
                }}
              >
                <FaChevronLeft size={14} />
              </button>
            )}

            {canScrollRight && (
              <button
                onClick={scrollRight}
                style={{
                  position: 'absolute',
                  right: '5px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 20,
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#4361ee'
                }}
              >
                <FaChevronRight size={14} />
              </button>
            )}
          </>
        )}

        <style jsx>{`
          .subcategory-slider-container ::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </div>
  );
};

export default SubcategorySlider;