import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Subcategorías de vehículos - Mismo formato que las categorías principales
const vehiculesData = [
  { id: 1, name: 'Voitures', slug: 'automobiles', icon: 'automobile.png', color: '#667eea' },
  { id: 2, name: 'Utilitaires', slug: 'utilitaires', icon: 'utilitaire.png', color: '#f093fb' },
  { id: 3, name: 'Motos', slug: 'motos', icon: 'moto.png', color: '#f5576c' },
  { id: 4, name: 'Quads', slug: 'quads', icon: 'quad.png', color: '#48c6ef' },
  { id: 5, name: 'Fourgons', slug: 'fourgons', icon: 'fourgon.png', color: '#6a11cb' },
  { id: 6, name: 'Camions', slug: 'camions', icon: 'camion.png', color: '#37ecba' },
  { id: 7, name: 'Bus', slug: 'bus', icon: 'bus.png', color: '#ff9a9e' },
  { id: 8, name: 'Engins', slug: 'engins', icon: 'engin.png', color: '#a18cd1' },
  { id: 9, name: 'Tracteurs', slug: 'tracteurs', icon: 'tracteur.png', color: '#fbc2eb' },
  { id: 10, name: 'Remorques', slug: 'remorques', icon: 'remorque.png', color: '#667eea' },
  { id: 11, name: 'Bateaux', slug: 'bateaux', icon: 'bateau.png', color: '#f093fb' }
];

const SliderVehicule = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const rowsContainerRef = useRef(null);

  // Calcular distribución en dos filas (50% en cada fila) - EXACTO como el principal
  const halfIndex = Math.ceil(vehiculesData.length / 2);
  const firstRow = vehiculesData.slice(0, halfIndex);
  const secondRow = vehiculesData.slice(halfIndex);

  // Función para obtener la ruta del icono
  const getIconPath = (iconName) => {
    return `/icons/vehicules/${iconName}`;
  };

  // Configuración responsive - EXACTO como el principal
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

  // Scroll functions para mobile
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

  // Renderizar fila de iconos - ESTILOS IDÉNTICOS al componente principal
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
            to={`/category/vehicules/${category.slug}`}
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
            {/* CONTENEDOR DE ICONO CON FONDO CIRCULAR - IDÉNTICO */}
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
                border: `3px solid ${category.color}20`,
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
                  e.target.style.opacity = '1';
                }}
                onError={(e) => {
                  console.error(`Error loading icon: ${category.icon}`);
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `<span style="font-size: 2rem; color: ${category.color}">${category.name.charAt(0)}</span>`;
                }}
              />
            </div>

            {/* Nombre de categoría - IDÉNTICO */}
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
      {/* Card contenedor - EXACTAMENTE IGUAL */}
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
        {/* Contenido con scroll horizontal - EXACTO */}
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

        {/* Botones de scroll solo en mobile - EXACTAMENTE IGUAL */}
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

            {/* Indicadores de scroll (dots) - EXACTO */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '6px',
              padding: '4px 0 8px 0',
              position: 'relative',
              zIndex: 10
            }}>
              {[0, 1].map((dot, index) => {
                const isActive = index === Math.floor(scrollPosition / 300);
                return (
                  <div
                    key={index}
                    style={{
                      width: isActive ? '8px' : '6px',
                      height: isActive ? '8px' : '6px',
                      borderRadius: '50%',
                      background: isActive 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                        : '#e0e0e0',
                      transition: 'all 0.3s ease'
                    }}
                  />
                );
              })}
            </div>
          </>
        )}

        {/* Footer minimalista - EXACTO (pero ajustado para vehículos) */}
        <div style={{
          padding: isMobile ? '6px 12px' : '8px 20px',
          borderTop: '1px solid rgba(0,0,0,0.04)',
          background: 'rgba(248, 249, 250, 0.4)',
          textAlign: 'center',
          display: 'none' // Ocultado como en el principal, o puedes mostrar si quieres
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: isMobile ? '0.75rem' : '0.85rem',
            color: '#666',
            fontWeight: '500'
          }}>
            {/* Contenido opcional */}
          </div>
        </div>
      </div>

      {/* Estilos CSS COPIADOS EXACTAMENTE del componente principal */}
      <style>{`
        /* Ocultar scrollbar pero mantener funcionalidad */
        .category-grid-container ::-webkit-scrollbar {
          display: none;
        }
        
        /* Prevenir zoom en doble tap */
        .category-grid-container * {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Mejorar rendimiento */
        .category-grid-container {
          contain: content;
        }
        
        /* Efectos hover - EXACTAMENTE IGUAL */
        .icon-container:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(0,0,0,0.12);
        }
        
        .icon-container:hover img {
          transform: scale(1.1);
        }
        
        /* EMOJIS MÁS GRANDES PARA DESKTOP - AJUSTADO PARA ICONOS */
        @media (min-width: 768px) {
          .category-grid-container a {
            flex: 1 !important;
            min-width: 0 !important;
          }
          
          .icon-container {
            width: 85px !important;
            height: 85px !important;
          }
        }
        
        /* ICONOS EXTRA GRANDES PARA PANTALLAS GRANDES */
        @media (min-width: 1200px) {
          .icon-container {
            width: 95px !important;
            height: 95px !important;
          }
        }
        
        /* Optimización para pantallas pequeñas */
        @media (max-width: 380px) {
          .category-grid-container a {
            width: 75px !important;
          }
          
          .icon-container {
            width: 65px !important;
            height: 65px !important;
          }
          
          /* Botones más pequeños en pantallas muy pequeñas */
          .category-grid-container button {
            width: 28px !important;
            height: 28px !important;
          }
          
          .category-grid-container button svg {
            width: 14px !important;
            height: 14px !important;
          }
        }
        
        /* Gradientes en los bordes del scroll (solo mobile) - EXACTO */
        @media (max-width: 767px) {
          .category-grid-container > div > div:first-child::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 20px;
            height: 100%;
            background: linear-gradient(to right, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%);
            pointer-events: none;
            z-index: 15;
          }
          
          .category-grid-container > div > div:first-child::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 20px;
            height: 100%;
            background: linear-gradient(to left, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%);
            pointer-events: none;
            z-index: 15;
          }
        }
      `}</style>
    </div>
  );
};

export default SliderVehicule;