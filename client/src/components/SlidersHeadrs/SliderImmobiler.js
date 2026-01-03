// src/components/slidersHeaders/SliderImmobiler.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Mapa de colores para cada categoría
const colorMap = {
  primary: '#667eea',
  secondary: '#48c6ef',
  success: '#37ecba',
  warning: '#f5576c',
  info: '#6a11cb',
  dark: '#2d3748',
  danger: '#ff9a9e'
};

// Subcategorías de immobilier organizadas por tipo
const immobilierData = [
  // ============ OPERACIONES (Nivel 1) ============
  { 
    id: 'vente', 
    name: 'Vente', 
    emoji: '💰', 
    color: 'success',
    type: 'operation',
    description: 'Acheter un bien'
  },
  { 
    id: 'location', 
    name: 'Location', 
    emoji: '🏠', 
    color: 'primary',
    type: 'operation',
    description: 'Louer un bien'
  },
  { 
    id: 'location_vacances', 
    name: 'Location Vacances', 
    emoji: '🌴', 
    color: 'warning',
    type: 'operation',
    description: 'Location saisonnière'
  },
  { 
    id: 'cherche_location', 
    name: 'Cherche Location', 
    emoji: '🔍', 
    color: 'info',
    type: 'operation',
    description: 'Recherche location'
  },
  { 
    id: 'cherche_achat', 
    name: 'Cherche Achat', 
    emoji: '🏡', 
    color: 'danger',
    type: 'operation',
    description: 'Recherche achat'
  },
  
  // ============ PROPRIETÉS (Nivel 2) ============
  { 
    id: 'appartement', 
    name: 'Appartement', 
    emoji: '🏢', 
    color: 'primary',
    type: 'property',
    description: 'Appartements'
  },
  { 
    id: 'villa', 
    name: 'Villa', 
    emoji: '🏘️', 
    color: 'success',
    type: 'property',
    description: 'Villas'
  },
  { 
    id: 'maison', 
    name: 'Maison', 
    emoji: '🏠', 
    color: 'warning',
    type: 'property',
    description: 'Maisons'
  },
  { 
    id: 'terrain', 
    name: 'Terrain', 
    emoji: '📐', 
    color: 'info',
    type: 'property',
    description: 'Terrains'
  },
  { 
    id: 'local', 
    name: 'Local', 
    emoji: '🏪', 
    color: 'secondary',
    type: 'property',
    description: 'Locaux commerciaux'
  },
  { 
    id: 'immeuble', 
    name: 'Immeuble', 
    emoji: '🏬', 
    color: 'dark',
    type: 'property',
    description: 'Immeubles'
  },
  { 
    id: 'bureau', 
    name: 'Bureau', 
    emoji: '💼', 
    color: 'info',
    type: 'property',
    description: 'Bureaux'
  },
  { 
    id: 'commerce', 
    name: 'Commerce', 
    emoji: '🏬', 
    color: 'warning',
    type: 'property',
    description: 'Commerces'
  },
  { 
    id: 'garage', 
    name: 'Garage', 
    emoji: '🚗', 
    color: 'dark',
    type: 'property',
    description: 'Garages'
  }
];

const SliderImmobiler = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeTab, setActiveTab] = useState('operations'); // 'operations' o 'properties'
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  // Filtrar datos según pestaña activa
  const operations = immobilierData.filter(item => item.type === 'operation');
  const properties = immobilierData.filter(item => item.type === 'property');
  
  // Datos actuales según pestaña
  const currentData = activeTab === 'operations' ? operations : properties;

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
  }, [activeTab]);

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

  // Generar URL según tipo de elemento
  const generateUrl = (item) => {
    if (item.type === 'operation') {
      // Para operaciones: /immobilier-vente/1
      return `/immobilier-${item.id}/1`;
    } else {
      // Para propiedades: mostrar en la página principal de inmuebles
      // O podrías crear una página específica
      return `/immobilier/1#${item.id}`;
    }
  };

  // Renderizar un ítem del slider
  const renderItem = (item, index) => {
    const colorHex = colorMap[item.color] || colorMap.primary;
    
    return (
      <div
        key={`${item.id}-${index}`}
        style={{
          flexShrink: 0,
          width: isMobile ? '110px' : '130px',
          margin: isMobile ? '0 4px' : '0 8px'
        }}
      >
        <Link
          to={generateUrl(item)}
          style={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          {/* Círculo del emoji */}
          <div
            style={{
              width: isMobile ? '85px' : '100px',
              height: isMobile ? '85px' : '100px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colorHex}15 0%, ${colorHex}10 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${colorHex}30`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              marginBottom: '10px',
              transition: 'all 0.3s ease',
              overflow: 'hidden',
              position: 'relative'
            }}
            className="immobilier-item"
          >
            {/* Efecto de hover (solo desktop) */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(135deg, ${colorHex}20 0%, transparent 100%)`,
                opacity: 0,
                transition: 'opacity 0.3s ease'
              }}
              className="hover-overlay"
            />
            
            <span 
              style={{ 
                fontSize: isMobile ? '2.5rem' : '3rem',
                lineHeight: 1,
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                position: 'relative',
                zIndex: 2
              }}
            >
              {item.emoji}
            </span>
          </div>

          {/* Nombre y descripción */}
          <div style={{
            textAlign: 'center',
            width: '100%'
          }}>
            <h4 style={{
              fontSize: isMobile ? '0.9rem' : '1rem',
              fontWeight: '700',
              color: '#2d3748',
              marginBottom: '4px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {item.name}
            </h4>
            
            <p style={{
              fontSize: isMobile ? '0.75rem' : '0.8rem',
              color: '#718096',
              margin: 0,
              lineHeight: '1.2',
              height: '2.4em',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical'
            }}>
              {item.description}
            </p>
          </div>
        </Link>
      </div>
    );
  };

  return (
    <div ref={containerRef} className="immobilier-slider-container">
      {/* Card contenedor */}
      <div style={{
        position: 'relative',
        maxWidth: '1200px',
        margin: '0 auto',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.08)'
      }}>
        {/* Header con pestañas */}
        <div style={{
          padding: isMobile ? '16px 16px 12px' : '20px 24px 16px',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2 style={{
                fontSize: isMobile ? '1.25rem' : '1.5rem',
                fontWeight: '700',
                color: '#2d3748',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <span style={{ fontSize: '1.3em' }}>🏠</span>
                Immobilier
              </h2>
              <p style={{
                fontSize: isMobile ? '0.85rem' : '0.9rem',
                color: '#718096',
                margin: '4px 0 0 0'
              }}>
                Trouvez le bien idéal pour vous
              </p>
            </div>
            
            <Link 
              to="/immobilier/1"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: isMobile ? '0.8rem' : '0.9rem',
                color: '#667eea',
                fontWeight: '600',
                textDecoration: 'none',
                padding: '8px 16px',
                borderRadius: '12px',
                background: 'rgba(102, 126, 234, 0.1)',
                transition: 'all 0.2s ease'
              }}
              className="see-all-btn"
            >
              Voir tout
              <FaChevronRight size={12} />
            </Link>
          </div>

          {/* Pestañas */}
          <div style={{
            display: 'flex',
            gap: '8px',
            marginTop: '12px'
          }}>
            <button
              onClick={() => {
                setActiveTab('operations');
                if (scrollRef.current) {
                  scrollRef.current.scrollLeft = 0;
                  setScrollPosition(0);
                }
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'operations' 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                  : 'rgba(102, 126, 234, 0.1)',
                color: activeTab === 'operations' ? 'white' : '#667eea',
                fontWeight: '600',
                fontSize: isMobile ? '0.8rem' : '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>📋</span>
              Opérations
              {activeTab === 'operations' && (
                <span style={{
                  fontSize: '0.7rem',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  marginLeft: '4px'
                }}>
                  {operations.length}
                </span>
              )}
            </button>

            <button
              onClick={() => {
                setActiveTab('properties');
                if (scrollRef.current) {
                  scrollRef.current.scrollLeft = 0;
                  setScrollPosition(0);
                }
              }}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'properties' 
                  ? 'linear-gradient(135deg, #37ecba 0%, #11998e 100%)' 
                  : 'rgba(55, 236, 186, 0.1)',
                color: activeTab === 'properties' ? 'white' : '#11998e',
                fontWeight: '600',
                fontSize: isMobile ? '0.8rem' : '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>🏘️</span>
              Types de biens
              {activeTab === 'properties' && (
                <span style={{
                  fontSize: '0.7rem',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '2px 6px',
                  borderRadius: '10px',
                  marginLeft: '4px'
                }}>
                  {properties.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Slider horizontal */}
        <div style={{
          position: 'relative',
          padding: isMobile ? '20px 0' : '24px 0'
        }}>
          {/* Contenedor con scroll */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            style={{
              display: 'flex',
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              padding: isMobile ? '0 12px' : '0 24px',
              alignItems: 'flex-start'
            }}
          >
            {currentData.map((item, index) => renderItem(item, index))}
            
            {/* Espacio al final para mejor scroll */}
            <div style={{ minWidth: isMobile ? '12px' : '24px' }} />
          </div>

          {/* Botones de navegación */}
          {isMobile && (
            <>
              {canScrollLeft && (
                <button
                  onClick={scrollLeft}
                  style={{
                    position: 'absolute',
                    left: '4px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 20,
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white',
                    transition: 'all 0.2s ease'
                  }}
                  className="scroll-btn"
                >
                  <FaChevronLeft size={20} />
                </button>
              )}

              {canScrollRight && (
                <button
                  onClick={scrollRight}
                  style={{
                    position: 'absolute',
                    right: '4px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    zIndex: 20,
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'white',
                    transition: 'all 0.2s ease'
                  }}
                  className="scroll-btn"
                >
                  <FaChevronRight size={20} />
                </button>
              )}
            </>
          )}

          {/* Indicadores de scroll (solo mobile) */}
          {isMobile && currentData.length > 4 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '6px',
              marginTop: '16px',
              paddingBottom: '8px'
            }}>
              {[0, 1, 2].map((dot, index) => {
                const isActive = index === Math.floor(scrollPosition / 300);
                return (
                  <div
                    key={index}
                    style={{
                      width: isActive ? '10px' : '6px',
                      height: '6px',
                      borderRadius: '3px',
                      background: isActive 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                        : '#e2e8f0',
                      transition: 'all 0.3s ease',
                      opacity: isActive ? 1 : 0.6
                    }}
                  />
                );
              })}
            </div>
          )}
        </div>

        {/* Footer informativo */}
        <div style={{
          padding: isMobile ? '12px 16px' : '16px 24px',
          borderTop: '1px solid rgba(0,0,0,0.04)',
          background: 'rgba(248, 250, 252, 0.6)',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: isMobile ? '0.75rem' : '0.85rem',
            color: '#718096',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span style={{ fontSize: '1.1em' }}>💡</span>
            {activeTab === 'operations' 
              ? 'Choisissez une opération pour voir les annonces correspondantes' 
              : 'Découvrez les différents types de biens immobiliers disponibles'}
          </p>
        </div>
      </div>

      {/* Estilos CSS */}
      <style>{`
        .immobilier-slider-container ::-webkit-scrollbar {
          display: none;
        }
        
        /* Efectos hover para desktop */
        @media (min-width: 768px) {
          .immobilier-item:hover {
            transform: translateY(-5px) scale(1.05);
            box-shadow: 0 8px 24px rgba(0,0,0,0.15) !important;
          }
          
          .immobilier-item:hover .hover-overlay {
            opacity: 1;
          }
          
          .see-all-btn:hover {
            background: rgba(102, 126, 234, 0.2) !important;
            transform: translateX(3px);
          }
          
          .scroll-btn:hover {
            transform: translateY(-50%) scale(1.1);
            box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5) !important;
          }
        }
        
        /* Efectos para mobile */
        @media (max-width: 767px) {
          .immobilier-slider-container a:active .immobilier-item {
            transform: scale(0.95);
            transition: transform 0.1s ease;
          }
          
          .scroll-btn:active {
            transform: translateY(-50%) scale(0.95);
          }
        }
        
        /* Mejoras de rendimiento */
        .immobilier-slider-container * {
          touch-action: manipulation;
          -webkit-tap-highlight-color: transparent;
        }
        
        /* Optimizaciones responsive */
        @media (max-width: 380px) {
          .immobilier-slider-container h4 {
            font-size: 0.85rem !important;
          }
          
          .immobilier-slider-container p {
            font-size: 0.7rem !important;
          }
        }
        
        @media (min-width: 1200px) {
          .immobilier-item {
            width: 150px !important;
          }
          
          .immobilier-item > div:first-child {
            width: 120px !important;
            height: 120px !important;
          }
          
          .immobilier-item span {
            font-size: 3.5rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SliderImmobiler;