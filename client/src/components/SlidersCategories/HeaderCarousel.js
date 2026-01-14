import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Carousel from 'react-bootstrap/Carousel';
import { Container, Row, Col } from 'react-bootstrap';

function HeaderCarousel() {
  const { t } = useTranslation('headercarousel');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Imágenes para el carrusel principal (3/4)
  const mainCarouselImages = [
    '/images/banner1.jpg',
    '/images/banner2.jpg', 
    '/images/banner0.jpg',
    '/images/banner4.jpg',
    '/images/banner5.jpg',
    '/images/banner7.jpg'
  ];

  // Imágenes para el carrusel lateral (1/4)
  const sideCarouselImages = [
    '/.jpg',
    '/images/side2.jpg',
    '/images/side3.jpg',
    '/images/side4.jpg',
    '/images/side5.jpg',
    '/images/side6.jpg'
  ];

  // Textos para el carrusel principal
  const mainSlides = [
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
  ];

  // Textos para el carrusel lateral
  const sideSlides = [
    { title: 'Promo -30%', color: '#dc3545' },
    { title: 'Livraison Rapide', color: '#198754' },
    { title: 'Nouveautés', color: '#0d6efd' },
    { title: 'Collection Été', color: '#fd7e14' },
    { title: 'Accessoires', color: '#6f42c1' },
    { title: 'Soldes Flash', color: '#20c997' }
  ];

  // Sincronizar carrousels
  const handleMainSelect = (selectedIndex) => {
    setCurrentIndex(selectedIndex);
  };

  const handleSideSelect = (selectedIndex) => {
    setCurrentIndex(selectedIndex);
  };

  // Auto-play
  useEffect(() => {
    if (!isMobile) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          (prevIndex + 1) % mainCarouselImages.length
        );
      }, 4000);
      
      return () => clearInterval(interval);
    }
  }, [isMobile, mainCarouselImages.length]);

  // Versión móvil: SOLO carrusel principal
  if (isMobile) {
    return (
      <Container fluid className="px-0">
        <Carousel 
          activeIndex={currentIndex}
          onSelect={handleMainSelect}
          fade 
          interval={4000}
          indicators={true}
          controls={true}
          className="mobile-carousel"
          style={{ padding: '7px' }}
        >
          {mainCarouselImages.map((image, index) => {
            const slide = mainSlides[index] || {
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
                  <p 
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: '400',
                      color: '#f0f0f0',
                      marginBottom: '0',
                      display: 'none'
                    }}
                  >
                    {slide.description}
                  </p>
                </Carousel.Caption>
              </Carousel.Item>
            );
          })}
        </Carousel>
      </Container>
    );
  }

  // Versión desktop: DOS carrousels
  return (
    <Container fluid style={{ padding: '7px' }}>
      <Row className="g-0">
        {/* CARROUSEL PRINCIPAL - 3/4 ANCHO */}
        <Col lg={9} md={12} className="pe-1">
          <Carousel 
            activeIndex={currentIndex}
            onSelect={handleMainSelect}
            fade 
            interval={4000}
            indicators={true}
            controls={true}
            className="main-carousel"
          >
            {mainCarouselImages.map((image, index) => {
              const slide = mainSlides[index] || {
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
                      position: 'relative'
                    }}
                  >
                    <img
                      src={image}
                      alt={slide.title}  
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease',
                        borderRadius: '12px'
                      }}
                      onError={(e) => {
                        e.target.src = `https://via.placeholder.com/1200x350/8b5cf6/ffffff?text=Main+${index + 1}`;
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
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
                      textAlign: 'center',
                      animation: 'fadeIn 0.8s ease'
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
            })}
          </Carousel>
        </Col>

        {/* CARROUSEL LATERAL - 1/4 ANCHO (OCULTO EN MÓVIL) */}
        <Col lg={3} md={0} className="ps-1 d-none d-lg-block">
          <Carousel 
            activeIndex={currentIndex}
            onSelect={handleSideSelect}
            indicators={false}
            controls={false}
            className="side-carousel"
            style={{
              height: '100%'
            }}
          >
            {sideCarouselImages.map((image, index) => {
              const slide = sideSlides[index] || { title: 'Promo', color: '#8b5cf6' };
              
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
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                    onClick={() => setCurrentIndex(index)}
                  >
                    {/* Imagen de fondo SIN background color */}
                    <img
                      src={image}
                      alt={slide.title}
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
                    
                    {/* Contenido superpuesto */}
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
                      
                      {/* Indicador de slide activo */}
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
            })}
          </Carousel>
          
          {/* Miniaturas para navegación */}
          <div className="d-flex justify-content-center mt-2">
            {mainCarouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: currentIndex === index ? '#8b5cf6' : '#dee2e6',
                  margin: '0 3px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </Col>
      </Row>

      {/* Estilos CSS para animaciones */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .main-carousel .carousel-item {
            animation: fadeIn 0.8s ease;
          }
          
          .side-carousel .carousel-item {
            animation: slideUp 0.6s ease;
          }
          
          /* Responsive para móvil */
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
          
          /* Para pantallas muy pequeñas (Android pequeños) */
          @media (max-width: 480px) {
            .mobile-carousel .carousel-item div {
              height: 22vh !important;
              max-height: 130px !important;
              min-height: 90px !important;
            }
            
            .mobile-carousel .carousel-caption h3 {
              font-size: 0.8rem !important;
            }
            
            .mobile-carousel .carousel-indicators {
              display: none !important;
            }
            
            .mobile-carousel .carousel-control-prev,
            .mobile-carousel .carousel-control-next {
              display: none !important;
            }
          }
        `}
      </style>
    </Container>
  );
}

export default HeaderCarousel;