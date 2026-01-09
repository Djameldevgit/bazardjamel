// SliderImmobilerProperties.js actualizado
import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const colorMap = {
  primary: '#667eea',
  secondary: '#48c6ef',
  success: '#37ecba',
  warning: '#f5576c',
  info: '#6a11cb',
  dark: '#2d3748',
  danger: '#ff9a9e'
};

// Tipos de propiedades (segundo nivel)
const propertiesData = [
  { id: 'appartement', name: 'Appartement', emoji: '🏢', color: 'primary' },
  { id: 'villa', name: 'Villa', emoji: '🏘️', color: 'success' },
  { id: 'terrain', name: 'Terrain', emoji: '📐', color: 'warning' },
  { id: 'local', name: 'Local', emoji: '🏪', color: 'info' },
  { id: 'immeuble', name: 'Immeuble', emoji: '🏬', color: 'dark' },
  { id: 'bungalow', name: 'Bungalow', emoji: '🏕️', color: 'secondary' },
  { id: 'terrain_agricole', name: 'Terrain Agricole', emoji: '🚜', color: 'success' },
  { id: 'studio', name: 'Studio', emoji: '📐', color: 'warning' },
  { id: 'duplex', name: 'Duplex', emoji: '🏠', color: 'primary' },
  { id: 'triplex', name: 'Triplex', emoji: '🏘️', color: 'info' }
];

const SliderImmobilerProperties = () => {
  const { operationId } = useParams(); // Obtener la operación desde la URL
  const [isMobile, setIsMobile] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

  // Mapear nombres de operaciones
  const operationNames = {
    vente: 'Vente',
    location: 'Location',
    location_vacances: 'Location Vacances',
    cherche_location: 'Cherche Location',
    cherche_achat: 'Cherche Achat'
  };

  const currentOperation = operationNames[operationId] || 'Immobilier';

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

  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

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

  const handleScroll = () => {
    if (scrollRef.current) {
      setScrollPosition(scrollRef.current.scrollLeft);
      updateScrollButtons();
    }
  };

  const renderProperties = () => {
    const itemsPerView = isMobile ? 4 : 6;
    const visibleProperties = propertiesData.slice(0, itemsPerView * 2);

    return visibleProperties.map((property) => {
      const colorHex = colorMap[property.color] || colorMap.primary;
      
      return (
        <Link
          key={property.id}
          // Ruta de dos niveles: /category/immobilier/vente/villa
          to={`/immobilier-${operationId}-${property.id}/1`} 
          style={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flexShrink: 0,
            width: isMobile ? '95px' : '115px'
          }}
        >
          <div
            style={{
              width: isMobile ? '70px' : '85px',
              height: isMobile ? '70px' : '85px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colorHex}20 0%, ${colorHex}15 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${colorHex}30`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              marginBottom: '8px'
            }}
          >
            <span style={{ fontSize: isMobile ? '1.8rem' : '2.2rem' }}>
              {property.emoji}
            </span>
          </div>

          <div style={{ textAlign: 'center' }}>
            <span style={{
              fontSize: isMobile ? '0.75rem' : '0.85rem',
              fontWeight: '600',
              color: '#333',
              display: 'block'
            }}>
              {property.name}
            </span>
          </div>
        </Link>
      );
    });
  };

  return (
    <div ref={containerRef} className="immobiler-properties-container">
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
          padding: isMobile ? '15px 12px 10px' : '20px 20px 15px',
          borderBottom: '1px solid rgba(0,0,0,0.04)',
          background: 'linear-gradient(135deg, #667eea10 0%, #764ba210 100%)'
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
            <span style={{ fontSize: '1.2em' }}>🏘️</span>
            Type de bien pour {currentOperation}
          </h3>
          <p style={{
            margin: '4px 0 0 0',
            fontSize: isMobile ? '0.75rem' : '0.85rem',
            color: '#666'
          }}>
            Choisissez le type de propriété
          </p>
        </div>

        {/* Properties slider */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            display: 'flex',
            justifyContent: isMobile ? 'flex-start' : 'center',
            padding: isMobile ? '15px 10px' : '20px 15px',
            overflowX: isMobile ? 'auto' : 'visible',
            overflowY: 'hidden',
            scrollBehavior: 'smooth',
            WebkitOverflowScrolling: 'touch',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            gap: isMobile ? '10px' : '20px'
          }}
        >
          {renderProperties()}
        </div>

        {/* Scroll buttons for mobile */}
        {isMobile && (
          <>
            {canScrollLeft && (
              <button onClick={scrollLeft} style={scrollButtonStyle('left')}>
                <FaChevronLeft size={16} color="white" />
              </button>
            )}
            {canScrollRight && (
              <button onClick={scrollRight} style={scrollButtonStyle('right')}>
                <FaChevronRight size={16} color="white" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const scrollButtonStyle = (position) => ({
  position: 'absolute',
  [position]: '8px',
  top: '50%',
  transform: 'translateY(-50%)',
  zIndex: 20,
  width: '32px',
  height: '32px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  border: 'none',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: 'white'
});

export default SliderImmobilerProperties;