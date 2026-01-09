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

// PRIMER NIVEL: Operaciones de immobiliaria
const operationsData = [
  { id: 'vente', name: 'Vente', emoji: '💰', color: 'success', description: 'Biens à vendre' },
  { id: 'location', name: 'Location', emoji: '🏠', color: 'primary', description: 'Biens en location' },
  { id: 'location_vacances', name: 'Location Vacances', emoji: '🌴', color: 'warning', description: 'Location saisonnière' },
  { id: 'cherche_location', name: 'Cherche Location', emoji: '🔍', color: 'info', description: 'Recherche location' },
  { id: 'cherche_achat', name: 'Cherche Achat', emoji: '🏡', color: 'danger', description: 'Recherche achat' }
];

const SliderImmobilerOperations = () => {
  const { categoryName } = useParams(); // Ahora recibimos categoryName desde CategoryPage
  const [isMobile, setIsMobile] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const containerRef = useRef(null);
  const scrollRef = useRef(null);

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

  const renderOperations = () => {
    return operationsData.map((operation) => {
      const colorHex = colorMap[operation.color] || colorMap.primary;
      
      return (
        <Link
          key={operation.id}
          // CORRECTO: Ruta para el primer nivel: /category/immobilier/vente
          to={`/immobilier-${operation.id}/1`} // En lugar de /category/immobilier/vente
      
          style={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flexShrink: 0,
            width: isMobile ? '100px' : '120px'
          }}
        >
          <div
            style={{
              width: isMobile ? '75px' : '90px',
              height: isMobile ? '75px' : '90px',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${colorHex}20 0%, ${colorHex}15 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${colorHex}30`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              marginBottom: '10px'
            }}
          >
            <span style={{ fontSize: isMobile ? '2rem' : '2.5rem' }}>
              {operation.emoji}
            </span>
          </div>

          <div style={{ textAlign: 'center' }}>
            <span style={{
              fontSize: isMobile ? '0.8rem' : '0.9rem',
              fontWeight: '600',
              color: '#333',
              display: 'block'
            }}>
              {operation.name}
            </span>
            <span style={{
              fontSize: isMobile ? '0.7rem' : '0.75rem',
              color: '#666',
              display: 'block',
              marginTop: '2px'
            }}>
              {operation.description}
            </span>
          </div>
        </Link>
      );
    });
  };

  return (
    <div ref={containerRef} className="immobiler-operations-container">
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
            <span style={{ fontSize: '1.2em' }}>🏠</span>
            Type de transaction immobilière
          </h3>
          <p style={{
            margin: '4px 0 0 0',
            fontSize: isMobile ? '0.75rem' : '0.85rem',
            color: '#666'
          }}>
            Choisissez le type d'opération immobilière
          </p>
        </div>

        {/* Operations slider */}
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
            gap: isMobile ? '15px' : '25px'
          }}
        >
          {renderOperations()}
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

export default SliderImmobilerOperations;