import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaStore, FaArrowRight } from 'react-icons/fa';

// Componente principal
const SliderStores = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [storeCategories, setStoreCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  
  // Datos de categorías de stores (puedes obtenerlos de API después)
  const defaultStoreCategories = [
    { id: 'alimentaire', name: 'Alimentaire', emoji: '🍎', color: 'success' },
    { id: 'vetements', name: 'Vêtements', emoji: '👕', color: 'warning' },
    { id: 'electronique', name: 'Électronique', emoji: '📱', color: 'primary' },
    { id: 'immobilier', name: 'Immobilier', emoji: '🏠', color: 'info' },
    { id: 'automobiles', name: 'Automobiles', emoji: '🚗', color: 'secondary' },
    { id: 'services', name: 'Services', emoji: '🔧', color: 'dark' },
    { id: 'informatique', name: 'Informatique', emoji: '💻', color: 'primary' },
    { id: 'mobiliers', name: 'Mobiliers', emoji: '🛋️', color: 'success' },
    { id: 'loisirs', name: 'Loisirs', emoji: '🎮', color: 'danger' },
    { id: 'sport', name: 'Sport', emoji: '⚽', color: 'warning' },
    { id: 'voyages', name: 'Voyages', emoji: '✈️', color: 'info' }
  ];

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
    
    // Cargar categorías
    setStoreCategories(defaultStoreCategories);
    setLoading(false);
    
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
    if (scrollRef.current) {
      setScrollPosition(scrollRef.current.scrollLeft);
      updateScrollButtons();
    }
  };

  // Mapa de colores
  const colorMap = {
    primary: '#667eea',
    secondary: '#48c6ef',
    success: '#37ecba',
    warning: '#f5576c',
    info: '#6a11cb',
    dark: '#2d3748',
    danger: '#ff9a9e'
  };

  if (loading) {
    return (
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        padding: '40px 20px',
        textAlign: 'center'
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="mt-3">Chargement des boutiques...</p>
      </div>
    );
  }

  const itemsPerRow = isMobile ? 4 : 6;
  const firstRow = storeCategories.slice(0, itemsPerRow);
  const secondRow = storeCategories.slice(itemsPerRow, itemsPerRow * 2);

  return (
    <div ref={containerRef} className="stores-slider-container">
      {/* Card contenedor */}
      <div style={{
        position: 'relative',
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.06)'
      }}>
        {/* Header */}
        <div style={{
          padding: isMobile ? '15px 12px 5px' : '20px 20px 10px',
          borderBottom: '1px solid rgba(0,0,0,0.04)',
          background: 'linear-gradient(135deg, #ff9a0010 0%, #ff9a0020 100%)'
        }}>
          <h3 style={{
            margin: 0,
            fontSize: isMobile ? '1.1rem' : '1.3rem',
            fontWeight: '700',
            color: '#2d3748',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <FaStore color="#ff9a00" />
            {isMobile ? 'Boutiques' : 'Boutiques par catégorie'}
          </h3>
          <p style={{
            margin: '4px 0 0 0',
            fontSize: isMobile ? '0.75rem' : '0.85rem',
            color: '#666'
          }}>
            Découvrez nos boutiques professionnelles
          </p>
        </div>

        {/* Contenido con scroll */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            display: 'block',
            padding: isMobile ? '12px 0' : '20px 0',
            overflowX: isMobile ? 'auto' : 'visible',
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none'
          }}
        >
          {/* Primera fila */}
          <div style={{
            display: 'flex',
            justifyContent: isMobile ? 'flex-start' : 'center',
            gap: isMobile ? '8px' : '15px',
            padding: isMobile ? '10px 8px' : '15px 20px',
            flexShrink: 0
          }}>
            {firstRow.map((category) => {
              const colorHex = colorMap[category.color] || colorMap.primary;
              
              return (
                <Link
                  key={category.id}
                  to={`/stores/category/${category.name}`}
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flexShrink: 0,
                    width: isMobile ? '85px' : '110px'
                  }}
                >
                  <div
                    style={{
                      width: isMobile ? '70px' : '85px',
                      height: isMobile ? '70px' : '85px',
                      borderRadius: '50%',
                      background: `linear-gradient(135deg, ${colorHex}15 0%, ${colorHex}10 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `2px solid ${colorHex}30`,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      marginBottom: '8px'
                    }}
                  >
                    <span style={{ fontSize: isMobile ? '2rem' : '2.3rem' }}>
                      {category.emoji}
                    </span>
                  </div>
                  
                  <div style={{ textAlign: 'center', width: '100%' }}>
                    <span style={{
                      fontSize: isMobile ? '0.75rem' : '0.85rem',
                      fontWeight: '600',
                      color: '#333'
                    }}>
                      {category.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Segunda fila (si hay suficientes categorías) */}
          {secondRow.length > 0 && (
            <div style={{
              display: 'flex',
              justifyContent: isMobile ? 'flex-start' : 'center',
              gap: isMobile ? '8px' : '15px',
              padding: isMobile ? '10px 8px' : '15px 20px',
              flexShrink: 0
            }}>
              {secondRow.map((category) => {
                const colorHex = colorMap[category.color] || colorMap.primary;
                
                return (
                  <Link
                    key={category.id}
                    to={`/stores/category/${category.name}`}
                    style={{
                      textDecoration: 'none',
                      color: 'inherit',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      flexShrink: 0,
                      width: isMobile ? '85px' : '110px'
                    }}
                  >
                    <div
                      style={{
                        width: isMobile ? '70px' : '85px',
                        height: isMobile ? '70px' : '85px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${colorHex}15 0%, ${colorHex}10 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px solid ${colorHex}30`,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        marginBottom: '8px'
                      }}
                    >
                      <span style={{ fontSize: isMobile ? '2rem' : '2.3rem' }}>
                        {category.emoji}
                      </span>
                    </div>
                    
                    <div style={{ textAlign: 'center', width: '100%' }}>
                      <span style={{
                        fontSize: isMobile ? '0.75rem' : '0.85rem',
                        fontWeight: '600',
                        color: '#333'
                      }}>
                        {category.name}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Botones de scroll para mobile */}
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
                  background: 'linear-gradient(135deg, #ff9a00 0%, #ff6a00 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(255, 154, 0, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white'
                }}
              >
                <FaChevronLeft size={18} color="white" />
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
                  background: 'linear-gradient(135deg, #ff9a00 0%, #ff6a00 100%)',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(255, 154, 0, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white'
                }}
              >
                <FaChevronRight size={18} color="white" />
              </button>
            )}
          </>
        )}

        {/* Footer */}
        <div style={{
          padding: isMobile ? '8px 12px' : '10px 20px',
          borderTop: '1px solid rgba(0,0,0,0.04)',
          background: 'rgba(248, 249, 250, 0.4)',
          textAlign: 'center'
        }}>
          <Link 
            to="/stores"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: isMobile ? '0.75rem' : '0.85rem',
              color: '#ff9a00',
              fontWeight: '600',
              textDecoration: 'none',
              padding: '6px 14px',
              borderRadius: '20px',
              background: 'rgba(255, 154, 0, 0.1)'
            }}
          >
            <FaStore size={14} />
            Voir toutes les boutiques
            <FaArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Estilos CSS */}
      <style>{`
        .stores-slider-container ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

// ⚠️ ESTA LÍNEA ES CRÍTICA - NO OLVIDES EXPORTAR DEFAULT ⚠️
export default SliderStores;