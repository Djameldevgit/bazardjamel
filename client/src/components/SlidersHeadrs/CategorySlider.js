import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Mapeo de categorías a nombres de archivos
const categoriesData = [
  { id: 1, name: 'Boutiques', slug: 'boutiques', icon: 'boutiques.png', color: '#667eea' },
  { id: 2, name: 'Immobilier', slug: 'immobilier', icon: 'immobilier.png', color: '#f093fb' },
  { id: 3, name: 'Automobiles & Véhicules', slug: 'vehicules', icon: 'vehicules.png', color: '#f5576c' },
  { id: 4, name: 'Pièces détachées', slug: 'pieces-detachees', icon: 'pieces-detachees.png', color: '#48c6ef' },
  { id: 5, name: 'Téléphones & Accessoires', slug: 'telephones', icon: 'telephones.png', color: '#6a11cb' },
  { id: 6, name: 'Informatique', slug: 'informatique', icon: 'informatique.png', color: '#37ecba' },
  { id: 7, name: 'Électroménager & Électronique', slug: 'electromenager', icon: 'electromenager.png', color: '#ff9a9e' },
  { id: 8, name: 'Vêtements & Mode', slug: 'vetements', icon: 'vetements.png', color: '#a18cd1' },
  { id: 9, name: 'Santé & Beauté', slug: 'sante-beaute', icon: 'sante-beaute.png', color: '#fbc2eb' },
  { id: 10, name: 'Meubles & Maison', slug: 'meubles', icon: 'meubles.png', color: '#667eea' },
  { id: 11, name: 'Loisirs & Divertissements', slug: 'loisirs', icon: 'loisirs.png', color: '#f093fb' },
  { id: 12, name: 'Sport', slug: 'sport', icon: 'sport.png', color: '#f5576c' },
  { id: 13, name: 'Emploi', slug: 'emploi', icon: 'emploi.png', color: '#48c6ef' },
  { id: 14, name: 'Matériaux & Équipement', slug: 'materiaux', icon: 'materiaux.png', color: '#6a11cb' },
  { id: 15, name: 'Alimentaires', slug: 'alimentaires', icon: 'alimentaires.png', color: '#37ecba' },
  { id: 16, name: 'Voyages', slug: 'voyages', icon: 'voyages.png', color: '#ff9a9e' },
  { id: 17, name: 'Services', slug: 'services', icon: 'services.png', color: '#a18cd1' },
];

const CategorySlider = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const rowsContainerRef = useRef(null);

  // Calcular distribución en dos filas
  const halfIndex = Math.ceil(categoriesData.length / 2);
  const firstRow = categoriesData.slice(0, halfIndex);
  const secondRow = categoriesData.slice(halfIndex);

  // Función para obtener la ruta del icono
  const getIconPath = (iconName) => {
    return `/icons/${iconName}`;
  };

  // Configuración responsive
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      if (mobile && scrollRef.current) {
        scrollRef.current.scrollLeft = 0;
        setScrollPosition(0);
        updateScrollButtons();
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Actualizar estado de botones de scroll
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
    if (scrollRef.current) {
      setScrollPosition(scrollRef.current.scrollLeft);
      updateScrollButtons();
    }
  };

  // Renderizar fila de iconos
  const renderIconRow = (row, rowIndex) => {
    return (
      <div 
        style={{
          display: 'flex',
          justifyContent: isMobile ? 'flex-start' : 'space-around',
          gap: isMobile ? '12px' : '5px',
          padding: isMobile ? '6px 12px' : '8px 5px',
          flexShrink: 0,
          minWidth: isMobile ? 'min-content' : 'auto',
          width: '100%'
        }}
      >
        {row.map((category) => (
          <Link
            key={`${category.id}-${rowIndex}`}
            to={`/category/${category.slug}`}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flexShrink: 0,
              width: isMobile ? '80px' : '95px',
              flex: '1 1 0%',
              minWidth: '70px',
              maxWidth: '110px',
              padding: '4px 2px',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* CONTENEDOR DE ICONO CON FONDO CIRCULAR */}
            <div
              style={{
                width: isMobile ? '70px' : '85px',
                height: isMobile ? '70px' : '85px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '8px',
                overflow: 'hidden',
                border: `3px solid ${category.color}20`, // Color con transparencia
                background: `linear-gradient(135deg, ${category.color}15, ${category.color}08)`,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                padding: '8px'
              }}
              className="icon-container"
            >
              {/* ICONO REALISTA */}
              <img
                src={getIconPath(category.icon)}
                alt={category.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
                  transition: 'transform 0.3s ease'
                }}
                onLoad={(e) => {
                  // Ajuste automático si la imagen se carga
                  e.target.style.opacity = '1';
                }}
                onError={(e) => {
                  // Fallback si la imagen no carga
                  console.error(`Error loading icon: ${category.icon}`);
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<span style="font-size: 2rem; color: ${category.color}">${category.name.charAt(0)}</span>`;
                }}
              />
            </div>

            {/* Nombre de categoría */}
            <div style={{
              textAlign: 'center',
              width: '100%',
              padding: '0 2px'
            }}>
              <span style={{
                fontSize: isMobile ? '0.75rem' : '0.8rem',
                fontWeight: '600',
                color: '#333',
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                lineHeight: '1.2'
              }}>
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="category-grid-container">
      {/* Card contenedor */}
      <div style={{
        position: 'relative',
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.08)',
        marginTop: '0',
        marginBottom: '0'
      }}>
        {/* Contenido con scroll horizontal */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            display: 'block',
            padding: isMobile ? '12px 0' : '16px 0',
            overflowX: isMobile ? 'auto' : 'visible',
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}
        >
          {/* Contenedor de filas */}
          <div ref={rowsContainerRef}>
            {/* Primera fila */}
            {renderIconRow(firstRow, 0)}
            {/* Segunda fila */}
            {renderIconRow(secondRow, 1)}
          </div>
        </div>

        {/* Botones de scroll solo en mobile */}
        {isMobile && (
          <>
            {canScrollLeft && (
              <button
                onClick={scrollLeft}
                style={{
                  position: 'absolute',
                  left: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 20,
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#667eea',
                  backdropFilter: 'blur(4px)',
                  transition: 'all 0.2s ease'
                }}
              >
                <FaChevronLeft size={18} />
              </button>
            )}

            {canScrollRight && (
              <button
                onClick={scrollRight}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 20,
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid rgba(0,0,0,0.1)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#667eea',
                  backdropFilter: 'blur(4px)',
                  transition: 'all 0.2s ease'
                }}
              >
                <FaChevronRight size={18} />
              </button>
            )}
          </>
        )}

        {/* Estilos CSS */}
        <style>{`
          .category-grid-container ::-webkit-scrollbar {
            display: none;
          }
          
          .category-grid-container * {
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
          }
          
          .icon-container:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(0,0,0,0.12);
          }
          
          .icon-container:hover img {
            transform: scale(1.1);
          }
          
          /* Optimización para diferentes tamaños */
          @media (max-width: 767px) {
            .category-grid-container a {
              width: 75px !important;
            }
            
            .icon-container {
              width: 65px !important;
              height: 65px !important;
            }
          }
          
          @media (min-width: 768px) {
            .category-grid-container a {
              flex: 1 !important;
            }
            
            .icon-container {
              width: 90px !important;
              height: 90px !important;
            }
          }
          
          @media (min-width: 1200px) {
            .icon-container {
              width: 100px !important;
              height: 100px !important;
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default CategorySlider;