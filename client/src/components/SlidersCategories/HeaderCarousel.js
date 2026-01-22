import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import Carousel from 'react-bootstrap/Carousel';
import { Container, Row, Col } from 'react-bootstrap';

const HeaderCarousel = memo(() => {
  const { t } = useTranslation('headercarousel');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  
  // Refs para optimización
  const animationFrameRef = useRef(null);
  const timeoutRef = useRef(null);
  const lastUpdateRef = useRef(0);
  const isMountedRef = useRef(true);
  const carouselPausedRef = useRef(false);

  // Detectar tamaño de pantalla con debounce
  useEffect(() => {
    let resizeTimeout;
    
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
    };
    
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(checkMobile, 100);
    };
    
    checkMobile();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Imágenes para el carrusel principal (3/4)
  const mainCarouselImages = useRef([
    '/images/banner1.jpg',
    '/images/banner2.jpg', 
    '/images/banner0.jpg',
    '/images/banner4.jpg',
    '/images/banner5.jpg',
    '/images/banner7.jpg'
  ]);

  // Imágenes para el carrusel lateral (1/4)
  const sideCarouselImages = useRef([
    '/.jpg',
    '/images/side2.jpg',
    '/images/side3.jpg',
    '/images/side4.jpg',
    '/images/side5.jpg',
    '/images/side6.jpg'
  ]);

  // Textos para el carrusel principal
  const mainSlides = useRef([
    {
      title: t('carousel.title1', 'Nouvelle Collection Printemps'),
      description: t('carousel.desc1', 'Découvrez les dernières tendances de la saison')
    },
    {
      title: t('carousel.title2', 'Soldes Exceptionnelles'),
      description: t('carousel.desc2', 'Jusqu\'à -50% sur toute la boutique')
    },
    {
      title: t('carousel.title3', 'Livraison Gratuite'),
      description: t('carousel.desc3', 'Partout en Algérie à partir de 3000 DZD')
    },
    {
      title: t('carousel.title4', 'Mode Homme & Femme'),
      description: t('carousel.desc4', 'Des styles uniques pour tous les goûts')
    },
    {
      title: t('carousel.title5', 'Qualité Garantie'),
      description: t('carousel.desc5', 'Des matériaux premium et une confection soignée')
    },
    {
      title: t('carousel.title6', 'Nouveautés Quotidiennes'),
      description: t('carousel.desc6', 'Découvrez nos nouvelles arrivées chaque jour')
    }
  ]);

  // Textos para el carrusel lateral
  const sideSlides = useRef([
    { title: 'Promo -30%', color: '#dc3545' },
    { title: 'Livraison Rapide', color: '#198754' },
    { title: 'Nouveautés', color: '#0d6efd' },
    { title: 'Collection Été', color: '#fd7e14' },
    { title: 'Accessoires', color: '#6f42c1' },
    { title: 'Soldes Flash', color: '#20c997' }
  ]);

  // Memoizar función para cambiar slide
  const goToNextSlide = useCallback(() => {
    if (!isMountedRef.current || carouselPausedRef.current) return;
    
    setCurrentIndex(prev => {
      const nextIndex = (prev + 1) % mainCarouselImages.current.length;
      return nextIndex;
    });
    
    lastUpdateRef.current = Date.now();
  }, []);

  // Función optimizada para auto-play
  const scheduleNextSlide = useCallback(() => {
    if (!isMountedRef.current || isMobile || carouselPausedRef.current) return;

    const INTERVAL_DURATION = 4000; // 4 segundos
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;
    
    // Limpiar cualquier timeout/animationFrame pendiente
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    if (timeSinceLastUpdate >= INTERVAL_DURATION) {
      // Ejecutar inmediatamente si ha pasado el tiempo
      animationFrameRef.current = requestAnimationFrame(() => {
        goToNextSlide();
        scheduleNextSlide(); // Programar siguiente
      });
    } else {
      // Calcular tiempo restante y programar
      const timeToWait = INTERVAL_DURATION - timeSinceLastUpdate;
      timeoutRef.current = setTimeout(() => {
        scheduleNextSlide();
      }, Math.max(100, timeToWait)); // Mínimo 100ms
    }
  }, [isMobile, goToNextSlide]);

  // Iniciar auto-play cuando no es móvil
  useEffect(() => {
    isMountedRef.current = true;
    lastUpdateRef.current = Date.now();

    if (!isMobile) {
      // Iniciar después de un pequeño delay para permitir render inicial
      const initialDelay = setTimeout(() => {
        scheduleNextSlide();
      }, 500);

      return () => {
        clearTimeout(initialDelay);
      };
    }

    return () => {
      isMountedRef.current = false;
    };
  }, [isMobile, scheduleNextSlide]);

  // Cleanup de timers
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Sincronizar carrousels
  const handleMainSelect = useCallback((selectedIndex) => {
    if (selectedIndex !== currentIndex) {
      setCurrentIndex(selectedIndex);
      lastUpdateRef.current = Date.now();
    }
  }, [currentIndex]);

  const handleSideSelect = useCallback((selectedIndex) => {
    if (selectedIndex !== currentIndex) {
      setCurrentIndex(selectedIndex);
      lastUpdateRef.current = Date.now();
    }
  }, [currentIndex]);

  // Manejar pausa al interactuar
  const handleMouseEnter = useCallback(() => {
    carouselPausedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    carouselPausedRef.current = false;
    lastUpdateRef.current = Date.now();
    if (!isMobile) {
      scheduleNextSlide();
    }
  }, [isMobile, scheduleNextSlide]);

  // Render de slide principal optimizado
  const renderMainSlide = useCallback((image, index) => {
    const slide = mainSlides.current[index] || {
      title: t('carousel.defaultTitle', 'Tassili Fashion'),
      description: t('carousel.defaultDesc', 'Votre destination mode préférée')
    };
    
    return (
      <Carousel.Item key={index}>
        <div 
          className="d-block w-100"
          style={{
            height: '45vh',
            maxHeight: '350px',
            minHeight: '250px',
            overflow: 'hidden',
            borderRadius: '12px',
            position: 'relative',
            backgroundColor: '#f8f9fa'
          }}
        >
          <img
            src={image}
            alt={slide.title}
            loading={index < 2 ? "eager" : "lazy"}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
              borderRadius: '12px'
            }}
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/1200x350/8b5cf6/ffffff`;     }}
          />
        </div>
     
        <Carousel.Caption 
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            borderRadius: '10px',
            padding: '15px 20px',
            bottom: '25px',
            left: '10%',
            right: '10%',
            textAlign: 'center'
          }}
        >
          <h3 
            style={{
              fontSize: '1.8rem',
              fontWeight: '700',
              marginBottom: '8px',
              color: '#ffffff',
              textShadow: '2px 2px 5px rgba(0, 0, 0, 0.8)'
            }}
          >
            {slide.title}
          </h3>
          <p 
            style={{
              fontSize: '1.1rem',
              fontWeight: '400',
              color: '#f8f8f8',
              marginBottom: '0',
              textShadow: '1px 1px 3px rgba(0, 0, 0, 0.6)'
            }}
          >
            {slide.description}
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    );
  }, [t]);

  // Render de slide lateral optimizado
  const renderSideSlide = useCallback((image, index) => {
    const slide = sideSlides.current[index] || { title: 'Promo', color: '#8b5cf6' };
    
    return (
      <Carousel.Item key={index}>
        <div 
          style={{
            height: '45vh',
            maxHeight: '350px',
            minHeight: '250px',
            overflow: 'hidden',
            position: 'relative',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            cursor: 'pointer',
            border: '1px solid #e0e0e0',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
          onClick={() => handleSideSelect(index)}
        >
          <img
            src={image}
            alt={slide.title}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: '12px'
            }}
            onError={(e) => {
              e.target.src = `https://via.placeholder.com/400x350/${slide.color.replace('#', '')}/ffffff?text=${slide.title}`;
            }}
          />
          
          <div 
            style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '15px',
              color: 'white',
              textAlign: 'center',
              background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
              borderRadius: '12px'
            }}
          >
            <div 
              style={{
                fontSize: '1.3rem',
                fontWeight: '700',
                marginBottom: '10px',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
              }}
            >
              {slide.title}
            </div>
            
            <div 
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: currentIndex === index ? 'white' : 'rgba(255,255,255,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                color: currentIndex === index ? slide.color : 'white',
                marginTop: '10px',
                transition: 'all 0.3s ease'
              }}
            >
              {index + 1}
            </div>
          </div>
        </div>
      </Carousel.Item>
    );
  }, [currentIndex, handleSideSelect]);

  // Versión móvil: SOLO carrusel principal
  if (isMobile) {
    return (
      <Container fluid className="px-0">
        <div 
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseEnter}
          onTouchEnd={handleMouseLeave}
        >
          <Carousel 
            activeIndex={currentIndex}
            onSelect={handleMainSelect}
            fade
            indicators={true}
            controls={true}
            interval={null} // Deshabilitar intervalo interno
            className="mobile-carousel"
            style={{ padding: '7px' }}
          >
            {mainCarouselImages.current.map((image, index) => {
              const slide = mainSlides.current[index] || {
                title: t('carousel.defaultTitle', 'Tassili Fashion'),
                description: t('carousel.defaultDesc', 'Votre destination mode préférée')
              };
              
              return (
                <Carousel.Item key={index}>
                  <div 
                    className="d-block w-100"
                    style={{
                      height: '25vh',
                      maxHeight: '150px',
                      minHeight: '100px',
                      overflow: 'hidden',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px'
                    }}
                  >
                    <img
                      src={image}
                      alt={slide.title}
                      loading={index < 2 ? "eager" : "lazy"}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center 25%',
                        borderRadius: '8px'
                      }}
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/800x150/8b5cf6/ffffff?text=Tassili+${index + 1}`;
                      }}
                    />
                  </div>
               
                  <Carousel.Caption 
                    style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.5)',
                      backdropFilter: 'blur(2px)',
                      borderRadius: '6px',
                      padding: '8px 12px',
                      bottom: '15px',
                      left: '5%',
                      right: '5%',
                      textAlign: 'center'
                    }}
                  >
                    <h3 
                      style={{
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        marginBottom: '3px',
                        color: '#ffffff',
                        textShadow: '1px 1px 3px rgba(0, 0, 0, 0.7)'
                      }}
                    >
                      {slide.title}
                    </h3>
                  </Carousel.Caption>
                </Carousel.Item>
              );
            })}
          </Carousel>
        </div>
      </Container>
    );
  }

  // Versión desktop: DOS carrousels
  return (
    <Container fluid style={{ padding: '7px' }}>
      <Row className="g-0">
        {/* CARROUSEL PRINCIPAL - 3/4 ANCHO */}
        <Col lg={9} md={12} className="pe-1">
          <div 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Carousel 
              activeIndex={currentIndex}
              onSelect={handleMainSelect}
              fade
              indicators={true}
              controls={true}
              interval={null} // Deshabilitar intervalo interno
              className="main-carousel"
            >
              {mainCarouselImages.current.map((image, index) => renderMainSlide(image, index))}
            </Carousel>
          </div>
        </Col>

        {/* CARROUSEL LATERAL - 1/4 ANCHO */}
        <Col lg={3} md={0} className="ps-1 d-none d-lg-block">
          <div 
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Carousel 
              activeIndex={currentIndex}
              onSelect={handleSideSelect}
              indicators={false}
              controls={false}
              interval={null}
              className="side-carousel"
              style={{ height: '100%' }}
            >
              {sideCarouselImages.current.map((image, index) => renderSideSlide(image, index))}
            </Carousel>
            
            {/* Miniaturas para navegación */}
            <div className="d-flex justify-content-center mt-2">
              {mainCarouselImages.current.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleMainSelect(index)}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: currentIndex === index ? '#8b5cf6' : '#dee2e6',
                    margin: '0 3px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    outline: 'none'
                  }}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </Col>
      </Row>

      {/* Estilos CSS optimizados */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .main-carousel .carousel-item {
          animation: fadeIn 0.8s ease;
        }
        
        @media (max-width: 768px) {
          .mobile-carousel {
            margin: 0;
          }
          
          .mobile-carousel .carousel-indicators {
            bottom: 5px;
          }
          
          .mobile-carousel .carousel-indicators button {
            width: 8px;
            height: 8px;
            margin: 0 3px;
            border-radius: 50%;
          }
          
          .mobile-carousel .carousel-control-prev,
          .mobile-carousel .carousel-control-next {
            width: 30px;
            height: 30px;
            top: 50%;
            transform: translateY(-50%);
            background-color: rgba(0,0,0,0.3);
            border-radius: 50%;
          }
        }
        
        @media (max-width: 480px) {
          .mobile-carousel .carousel-item div {
            height: 22vh !important;
            max-height: 130px !important;
            min-height: 90px !important;
          }
          
          .mobile-carousel .carousel-caption h3 {
            font-size: 0.8rem !important;
          }
        }
        
        /* Optimización para rendimiento */
        .carousel-item {
          will-change: transform, opacity;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .carousel-item {
            transition: none !important;
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        }
      `}</style>
    </Container>
  );
});

HeaderCarousel.displayName = 'HeaderCarousel';

export default HeaderCarousel;