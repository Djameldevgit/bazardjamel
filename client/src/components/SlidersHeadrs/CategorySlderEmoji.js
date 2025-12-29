import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Categorías con emojis
const categoriesData = [
  { id: 1, name: 'Boutiques', slug: 'boutiques', emoji: '🏪', color: '#667eea' },
  { id: 2, name: 'Immobilier', slug: 'immobilier', emoji: '🏠', color: '#f093fb' },
  { id: 3, name: 'Automobiles & Véhicules', slug: 'vehicules', emoji: '🚗', color: '#f5576c' },
  { id: 4, name: 'Pièces détachées', slug: 'pieces-detachees', emoji: '🔧', color: '#48c6ef' },
  { id: 5, name: 'Téléphones & Accessoires', slug: 'telephones', emoji: '📱', color: '#6a11cb' },
  { id: 6, name: 'Informatique', slug: 'informatique', emoji: '💻', color: '#37ecba' },
  { id: 7, name: 'Électroménager & Électronique', slug: 'electromenager', emoji: '📺', color: '#ff9a9e' },
  { id: 8, name: 'Vêtements & Mode', slug: 'vetements', emoji: '👕', color: '#a18cd1' },
  { id: 9, name: 'Santé & Beauté', slug: 'sante-beaute', emoji: '💄', color: '#fbc2eb' },
  { id: 10, name: 'Meubles & Maison', slug: 'meubles', emoji: '🛋️', color: '#667eea' },
  { id: 11, name: 'Loisirs & Divertissements', slug: 'loisirs', emoji: '🎮', color: '#f093fb' },
  { id: 12, name: 'Sport', slug: 'sport', emoji: '⚽', color: '#f5576c' },
  { id: 13, name: 'Emploi', slug: 'emploi', emoji: '💼', color: '#48c6ef' },
  { id: 14, name: 'Matériaux & Équipement', slug: 'materiaux', emoji: '🏗️', color: '#6a11cb' },
  { id: 15, name: 'Alimentaires', slug: 'alimentaires', emoji: '🍎', color: '#37ecba' },
  { id: 16, name: 'Voyages', slug: 'voyages', emoji: '✈️', color: '#ff9a9e' },
  { id: 17, name: 'Services', slug: 'services', emoji: '🔔', color: '#a18cd1' },
];

 

 
 
 const CategorySlderEmoji = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const rowsContainerRef = useRef(null);

  // Calcular distribución en dos filas (50% en cada fila)
  const halfIndex = Math.ceil(categoriesData.length / 2);
  const firstRow = categoriesData.slice(0, halfIndex);
  const secondRow = categoriesData.slice(halfIndex);

  // Configuración responsive
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Reset scroll position en mobile
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

  // Renderizar fila de emojis
  const renderEmojiRow = (row, rowIndex) => {
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
              maxWidth: '110px'
            }}
          >
            {/* EMOJI GRANDE - SIN FONDO, SIN CONTENEDOR EXTRA */}
         {/* EMOJI GRANDE - SIN FONDO */}
<div
  style={{
    fontSize: isMobile ? '5rem' : '6rem', // MÁS GRANDE: 5rem móvil, 6rem desktop
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    height: isMobile ? '90px' : '110px',
    marginBottom: '6px'
  }}
>
  {category.emoji}
</div>

            {/* Nombre abreviado */}
            <div style={{
              textAlign: 'center',
              width: '100%'
            }}>
              <span style={{
                fontSize: isMobile ? '0.7rem' : '0.75rem',
                fontWeight: '600',
                color: '#333',
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                padding: '0 2px',
                lineHeight: '1.1'
              }}>
                {category.name.length > 15 ? `${category.name.substring(0, 13)}...` : category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="category-grid-container">
      {/* Card contenedor CON MÁRGENES REDUCIDOS */}
      <div style={{
        position: 'relative',
        maxWidth: '1400px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.06)',
        marginTop: '0',
        marginBottom: '0'
      }}>
        {/* Contenido con scroll horizontal en mobile */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            display: 'block',
            padding: isMobile ? '8px 0' : '10px 0',
            overflowX: isMobile ? 'auto' : 'visible',
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            position: 'relative'
          }}
        >
          {/* Contenedor de filas */}
          <div ref={rowsContainerRef} style={{
            position: 'relative'
          }}>
            {/* Primera fila */}
            {renderEmojiRow(firstRow, 0)}

            {/* Segunda fila */}
            {renderEmojiRow(secondRow, 1)}
          </div>
        </div>

        {/* Botones de scroll solo en mobile */}
        {isMobile && (
          <>
            {/* Botón izquierdo */}
            {canScrollLeft && (
              <button
                onClick={scrollLeft}
                style={{
                  position: 'absolute',
                  left: '6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 20,
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white'
                }}
              >
                <FaChevronLeft size={16} color="white" />
              </button>
            )}

            {/* Botón derecho */}
            {canScrollRight && (
              <button
                onClick={scrollRight}
                style={{
                  position: 'absolute',
                  right: '6px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 20,
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white'
                }}
              >
                <FaChevronRight size={16} color="white" />
              </button>
            )}

            {/* Indicadores de scroll (dots) */}
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

        {/* Footer minimalista */}
        <div style={{
          padding: isMobile ? '6px 12px' : '8px 20px',
          borderTop: '1px solid rgba(0,0,0,0.04)',
          background: 'rgba(248, 249, 250, 0.4)',
          textAlign: 'center',
          display: 'none'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: isMobile ? '0.75rem' : '0.85rem',
            color: '#666',
            fontWeight: '500'
          }}>
           
          </div>
        </div>
      </div>

      {/* Estilos CSS simplificados */}
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
        
        /* EMOJIS MÁS GRANDES PARA DESKTOP */
        @media (min-width: 768px) {
          .category-grid-container a {
            flex: 1 !important;
            min-width: 0 !important;
          }
          
          .category-grid-container a > div:first-child {
            font-size: 5.5rem !important;
            height: 100px !important;
          }
        }
        
        /* EMOJIS EXTRA GRANDES PARA PANTALLAS GRANDES */
        @media (min-width: 1200px) {
          .category-grid-container a > div:first-child {
            font-size: 6rem !important;
            height: 110px !important;
          }
        }
        
        /* Optimización para pantallas pequeñas */
        @media (max-width: 380px) {
          .category-grid-container a {
            width: 75px !important;
          }
          
          .category-grid-container a > div:first-child {
            font-size: 3.5rem !important;
            height: 70px !important;
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
        
        /* Gradientes en los bordes del scroll (solo mobile) */
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
 }
 
 export default CategorySlderEmoji