import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import Carousel from 'react-bootstrap/Carousel';
import { Container, Row, Col } from 'react-bootstrap';

const HeaderCarousel = memo(() => {
  const { t } = useTranslation('headercarousel');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileCurrentIndex, setMobileCurrentIndex] = useState(0);

  const animationFrameRef = useRef(null);
  const timeoutRef = useRef(null);
  const lastUpdateRef = useRef(0);
  const isMountedRef = useRef(true);
  const carouselPausedRef = useRef(false);

  // Detectar tamaño de pantalla
  useEffect(() => {
    let resizeTimeout;
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
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

  // Imágenes locales
  const mainCarouselImages = useRef([
    '/images/banner1.jpg',
    '/images/banner2.jpg',
    '/images/banner0.jpg',
    '/images/banner4.jpg',
    '/images/banner5.jpg',
    '/images/banner7.jpg'
  ]);

  const sideCarouselImages = useRef([
    '/images/side1.jpg',
    '/images/side2.jpg',
    '/images/side3.jpg',
    '/images/side4.jpg',
    '/images/side5.jpg',
    '/images/side6.jpg'
  ]);

  // Textos
  const mainSlides = useRef([
    { title: t('carousel.title1','Nouvelle Collection Printemps'), description: t('carousel.desc1','Découvrez les dernières tendances de la saison') },
    { title: t('carousel.title2','Soldes Exceptionnelles'), description: t('carousel.desc2','Jusqu\'à -50% sur toute la boutique') },
    { title: t('carousel.title3','Livraison Gratuite'), description: t('carousel.desc3','Partout en Algérie à partir de 3000 DZD') },
    { title: t('carousel.title4','Mode Homme & Femme'), description: t('carousel.desc4','Des styles uniques pour tous les goûts') },
    { title: t('carousel.title5','Qualité Garantie'), description: t('carousel.desc5','Des matériaux premium et une confection soignée') },
    { title: t('carousel.title6','Nouveautés Quotidiennes'), description: t('carousel.desc6','Découvrez nos nouvelles arrivées chaque jour') }
  ]);

  const sideSlides = useRef([
    { title: 'Promo -30%', color: '#dc3545' },
    { title: 'Livraison Rapide', color: '#198754' },
    { title: 'Nouveautés', color: '#0d6efd' },
    { title: 'Collection Été', color: '#fd7e14' },
    { title: 'Accessoires', color: '#6f42c1' },
    { title: 'Soldes Flash', color: '#20c997' }
  ]);

  // Auto-play
  const goToNextSlide = useCallback(() => {
    if (!isMountedRef.current || carouselPausedRef.current) return;
    
    if (isMobile) {
      setMobileCurrentIndex(prev => (prev + 1) % mainCarouselImages.current.length);
    } else {
      setCurrentIndex(prev => (prev + 1) % mainCarouselImages.current.length);
    }
    lastUpdateRef.current = Date.now();
  }, [isMobile]);

  const scheduleNextSlide = useCallback(() => {
    if (!isMountedRef.current || carouselPausedRef.current) return;
    const INTERVAL_DURATION = 4000;
    const now = Date.now();
    const timeSinceLastUpdate = now - lastUpdateRef.current;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    if (timeSinceLastUpdate >= INTERVAL_DURATION) {
      animationFrameRef.current = requestAnimationFrame(() => {
        goToNextSlide();
        scheduleNextSlide();
      });
    } else {
      const timeToWait = INTERVAL_DURATION - timeSinceLastUpdate;
      timeoutRef.current = setTimeout(scheduleNextSlide, Math.max(100, timeToWait));
    }
  }, [goToNextSlide]);

  useEffect(() => {
    isMountedRef.current = true;
    lastUpdateRef.current = Date.now();
    const initialDelay = setTimeout(scheduleNextSlide, 500);
    return () => {
      clearTimeout(initialDelay);
      isMountedRef.current = false;
    };
  }, [scheduleNextSlide]);

  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  }, []);

  // Pausa al interactuar
  const handleMouseEnter = () => {
    carouselPausedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  };
  const handleMouseLeave = () => {
    carouselPausedRef.current = false;
    lastUpdateRef.current = Date.now();
    scheduleNextSlide();
  };

  const handleMainSelect = index => {
    if (isMobile) setMobileCurrentIndex(index);
    else setCurrentIndex(index);
    lastUpdateRef.current = Date.now();
  };

  const handleSideSelect = index => {
    if (isMobile) setMobileCurrentIndex(index);
    else setCurrentIndex(index);
    lastUpdateRef.current = Date.now();
  };

  // Render desktop
  const renderMainSlide = useCallback((image, index) => {
    const slide = mainSlides.current[index] || { title: 'Tassili Fashion', description: 'Votre destination mode préférée' };
    return (
      <Carousel.Item key={index}>
        <div style={{ height:'40vh', maxHeight:'350px', minHeight:'250px', overflow:'hidden', borderRadius:'12px', position:'relative' }}>
          <img src={image} alt={slide.title} loading={index<2?"eager":"lazy"} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'12px' }} />
        </div>
        <Carousel.Caption style={{ backgroundColor:'rgba(0,0,0,0.6)', backdropFilter:'blur(4px)', borderRadius:'10px', padding:'15px 20px', bottom:'25px' }}>
          <h3 style={{ fontSize:'1.8rem', fontWeight:'700', color:'#fff' }}>{slide.title}</h3>
          <p style={{ fontSize:'1.1rem', color:'#f8f8f8' }}>{slide.description}</p>
        </Carousel.Caption>
      </Carousel.Item>
    );
  }, []);

  const renderSideSlide = useCallback((image, index) => {
    const slide = sideSlides.current[index] || { title:'Promo', color:'#8b5cf6' };
    return (
      <Carousel.Item key={index}>
        <div style={{ height:'40vh', maxHeight:'350px', minHeight:'250px', overflow:'hidden', position:'relative', borderRadius:'12px', cursor:'pointer' }} onClick={()=>handleSideSelect(index)}>
          <img src={image} alt={slide.title} loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'12px' }} />
          <div style={{ position:'absolute', top:0, left:0, right:0, bottom:0, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', background:'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.7))', borderRadius:'12px' }}>
            <div style={{ fontSize:'1.3rem', fontWeight:'700', marginBottom:'10px', color:'#fff' }}>{slide.title}</div>
            <div style={{ width:'28px', height:'28px', borderRadius:'50%', backgroundColor: currentIndex===index?'white':'rgba(255,255,255,0.3)', display:'flex', alignItems:'center', justifyContent:'center', color: currentIndex===index?slide.color:'white', marginTop:'10px' }}>{index+1}</div>
          </div>
        </div>
      </Carousel.Item>
    );
  }, [currentIndex]);

  // Versión móvil: SOLO carrusel principal
  if (isMobile) {
    return (
      <Container fluid className="px-0">
        <div className="mb-2" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <Carousel 
            activeIndex={mobileCurrentIndex} 
            onSelect={handleMainSelect} 
            fade 
            indicators 
            controls 
            interval={null}
            style={{ padding: '7px' }}
          >
            {mainCarouselImages.current.map((img, idx) => {
              const slide = mainSlides.current[idx] || { title: 'Tassili Fashion' };
              return (
                <Carousel.Item key={idx}>
                  <div style={{ height: '22vh', maxHeight: '180px', minHeight: '140px', overflow: 'hidden', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                    <img src={img} alt={slide.title} loading={idx<2?"eager":"lazy"} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'8px' }} />
                  </div>
                  <Carousel.Caption style={{ backgroundColor:'rgba(0,0,0,0.5)', backdropFilter:'blur(2px)', borderRadius:'6px', padding:'6px 10px', bottom:'10px' }}>
                    <h3 style={{ fontSize:'0.9rem', fontWeight:'600', color:'#fff' }}>{slide.title}</h3>
                  </Carousel.Caption>
                </Carousel.Item>
              );
            })}
          </Carousel>
        </div>
        {/* ⚡️ NO HAY CARRUSEL LATERAL EN MÓVIL */}
      </Container>
    );
  }

  // Versión desktop
  return (
    <Container fluid style={{ padding:'7px' }}>
      <Row className="g-0">
        {/* CARRUSEL PRINCIPAL */}
        <Col lg={9} md={12} className="pe-1">
          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Carousel 
              activeIndex={currentIndex} 
              onSelect={handleMainSelect} 
              fade 
              indicators 
              controls 
              interval={null} 
              className="main-carousel"
            >
              {mainCarouselImages.current.map((img, idx) => renderMainSlide(img, idx))}
            </Carousel>
          </div>
        </Col>

        {/* CARRUSEL LATERAL SOLO DESKTOP */}
        <Col lg={3} md={0} className="ps-1 d-none d-lg-block">
          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Carousel 
              activeIndex={currentIndex} 
              onSelect={handleSideSelect} 
              indicators={false} 
              controls={false} 
              interval={null} 
              className="side-carousel"
            >
              {sideCarouselImages.current.map((img, idx) => renderSideSlide(img, idx))}
            </Carousel>
          </div>
          {/* Miniaturas */}
          <div className="d-flex justify-content-center mt-2">
            {mainCarouselImages.current.map((_, idx) => (
              <button key={idx} onClick={()=>handleMainSelect(idx)} style={{ width:'10px', height:'10px', borderRadius:'50%', border:'none', margin:'0 3px', cursor:'pointer', backgroundColor: currentIndex===idx?'#8b5cf6':'#dee2e6', transition:'all 0.3s ease' }} aria-label={`Go to slide ${idx + 1}`} />
            ))}
          </div>
        </Col>
      </Row>
    </Container>
  );
});

HeaderCarousel.displayName = 'HeaderCarousel';
export default HeaderCarousel;
