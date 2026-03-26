// frontend/src/components/carousel/CarouselHome.jsx
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import Carousel from 'react-bootstrap/Carousel';
import { Container, Row, Col, Dropdown, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { FaEllipsisV, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { getHomeCarousel, deleteCarouselImage } from '../../redux/actions/carouselHomeAction';

const CarouselHome = memo(() => {
  const { t } = useTranslation('CarouselHome');
  const dispatch = useDispatch();
  const history = useHistory();
  
  // Estado de Redux para imágenes dinámicas
  const { homeImages, loading } = useSelector(state => state.carousel);
  const authState = useSelector(state => state.auth);
  
  // 🔥 DEBUG: Ver qué hay en authState
  console.log('🔐 [CarouselHome] authState completo:', authState);
  console.log('🔐 [CarouselHome] authState.user:', authState?.user);
  console.log('🔐 [CarouselHome] authState?.user?.role:', authState?.user?.role);
  console.log('🔐 [CarouselHome] authState?.role:', authState?.role);
  
  // 🔥 CORREGIDO: Extraer auth de diferentes formas posibles
  const auth = authState?.auth || authState;
  const token = auth?.token || authState?.token;
  const user = auth?.user || authState?.user;
  
  // 🔥 CORREGIDO: Verificar rol en diferentes lugares
  const isAdmin = user?.role === 'admin' || authState?.user?.role === 'admin' || authState?.role === 'admin';
  
  console.log('🔐 [CarouselHome] user extraído:', user);
  console.log('🔐 [CarouselHome] isAdmin:', isAdmin);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileCurrentIndex, setMobileCurrentIndex] = useState(0);
  
  // ===== URLs DIRECTAS DE CLOUDINARY (ORIGINALES - FALLBACK) =====
  const defaultMainImages = [
    "https://res.cloudinary.com/dfjipgj2o/image/upload/v1773265475/automobile_sxuh2c.png",
    "https://res.cloudinary.com/dfjipgj2o/image/upload/v1773265553/immobiler_ukz4xk.png",
    "https://res.cloudinary.com/dfjipgj2o/image/upload/v1773122713/caoumiajj2_isoynj.jpg"
  ];

  const sideImages = [
    "https://res.cloudinary.com/dfjipgj2o/image/upload/v1773122901/carousjhjhj_rdunbx.png",
    "https://res.cloudinary.com/dfjipgj2o/image/upload/v1773122893/carousjhjhj2_ra5znt.png",
    "https://res.cloudinary.com/dfjipgj2o/image/upload/v1773122901/carousjhjhj_rdunbx.png"
  ];

  // Usar imágenes dinámicas si existen, sino usar las default
  const mainImages = homeImages && homeImages.length > 0 
    ? homeImages.map(img => img.image?.url) 
    : defaultMainImages;

  const [images] = useState({
    main: mainImages,
    side: sideImages
  });

  // Refs para el auto-play
  const animationFrameRef = useRef(null);
  const timeoutRef = useRef(null);
  const lastUpdateRef = useRef(0);
  const isMountedRef = useRef(true);
  const carouselPausedRef = useRef(false);

  // Textos del carrusel principal (dinámicos o fallback)
  const getMainSlideTitle = useCallback((index) => {
    if (homeImages && homeImages[index] && homeImages[index].title) {
      return homeImages[index].title;
    }
    const titles = [
      'Nouvelle Collection Printemps',
      'Soldes Exceptionnelles',
      'Livraison Gratuite',
      'Mode Homme & Femme',
      'Qualité Garantie',
      'Nouveautés Quotidiennes'
    ];
    return titles[index] || 'Tassili Fashion';
  }, [homeImages]);

  const getMainSlideDescription = useCallback((index) => {
    if (homeImages && homeImages[index] && homeImages[index].description) {
      return homeImages[index].description;
    }
    const descriptions = [
      'Découvrez les dernières tendances de la saison',
      'Jusqu\'à -50% sur toute la boutique',
      'Partout en Algérie à partir de 3000 DZD',
      'Des styles uniques pour tous les goûts',
      'Des matériaux premium et une confection soignée',
      'Découvrez nos nouvelles arrivées chaque jour'
    ];
    return descriptions[index] || 'Votre destination mode préférée';
  }, [homeImages]);

  // Textos del carrusel lateral
  const sideSlides = useRef([
    { title: 'Promo -30%', color: '#dc3545' },
    { title: 'Livraison Rapide', color: '#198754' },
    { title: 'Nouveautés', color: '#0d6efd' },
    { title: 'Collection Été', color: '#fd7e14' },
    { title: 'Accessoires', color: '#6f42c1' },
    { title: 'Soldes Flash', color: '#20c997' }
  ]);

  // Cargar imágenes dinámicas
  useEffect(() => {
    console.log('📡 [CarouselHome] Cargando carrusel...');
    dispatch(getHomeCarousel());
  }, [dispatch]);

  // Detectar tamaño de pantalla para responsive
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

  // Función para avanzar al siguiente slide
  const goToNextSlide = useCallback(() => {
    if (!isMountedRef.current || carouselPausedRef.current || images.main.length === 0) return;
    
    if (isMobile) {
      setMobileCurrentIndex(prev => (prev + 1) % images.main.length);
    } else {
      setCurrentIndex(prev => (prev + 1) % images.main.length);
    }
    lastUpdateRef.current = Date.now();
  }, [isMobile, images.main.length]);

  // Programar el siguiente slide
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

  // Iniciar auto-play
  useEffect(() => {
    isMountedRef.current = true;
    lastUpdateRef.current = Date.now();
    const initialDelay = setTimeout(scheduleNextSlide, 500);
    return () => {
      clearTimeout(initialDelay);
      isMountedRef.current = false;
    };
  }, [scheduleNextSlide]);

  // Limpiar timeouts al desmontar
  useEffect(() => () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  }, []);

  // Pausar al pasar el mouse
  const handleMouseEnter = useCallback(() => {
    carouselPausedRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
  }, []);

  const handleMouseLeave = useCallback(() => {
    carouselPausedRef.current = false;
    lastUpdateRef.current = Date.now();
    scheduleNextSlide();
  }, [scheduleNextSlide]);

  // Manejadores de selección
  const handleMainSelect = useCallback((index) => {
    if (isMobile) setMobileCurrentIndex(index);
    else setCurrentIndex(index);
    lastUpdateRef.current = Date.now();
  }, [isMobile]);

  const handleSideSelect = useCallback((index) => {
    if (isMobile) setMobileCurrentIndex(index);
    else setCurrentIndex(index);
    lastUpdateRef.current = Date.now();
  }, [isMobile]);

  // 🔥 Manejar edición
  const handleEdit = useCallback((slideId, e) => {
    e.stopPropagation();
    console.log('✏️ Editando imagen:', slideId);
    if (slideId) {
      history.push(`/admin/carousel/edit/${slideId}`);
    }
  }, [history]);

  // 🔥 Manejar eliminación
  const handleDelete = useCallback(async (slideId, publicId, e) => {
    e.stopPropagation();
    if (!slideId) return;
    if (!window.confirm('¿Eliminar esta imagen del carrusel?')) return;
    if (!token) return alert('Error de autenticación');
    
    const result = await dispatch(deleteCarouselImage(slideId, { token, user }));
    if (result?.success) {
      dispatch(getHomeCarousel());
      alert('✅ Imagen eliminada');
    }
  }, [token, user, dispatch]);

  // 🔥 Manejar crear nueva imagen
  const handleCreate = useCallback(() => {
    history.push('/admin/carousel/create');
  }, [history]);

  // Renderizar slide principal (CON BOTÓN DE ADMIN)
  const renderMainSlide = useCallback((image, index) => {
    const title = getMainSlideTitle(index);
    const description = getMainSlideDescription(index);
    
    // Obtener el ID de la imagen dinámica si existe
    const dynamicImage = homeImages && homeImages[index];
    const slideId = dynamicImage?._id;
    const publicId = dynamicImage?.image?.public_id;
    
    console.log(`📸 Slide ${index}: isAdmin=${isAdmin}, slideId=${slideId}`);
    
    return (
      <Carousel.Item key={index}>
        <div style={{ 
          height: '40vh', 
          maxHeight: '350px', 
          minHeight: '250px', 
          overflow: 'hidden', 
          borderRadius: '12px', 
          position: 'relative' 
        }}>
          <img 
            src={image} 
            alt={title} 
            loading={index < 2 ? "eager" : "lazy"} 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover', 
              borderRadius: '12px' 
            }} 
          />
          
          {/* 🔥 BOTÓN DE TRES PUNTOS PARA ADMIN - SIEMPRE VISIBLE PARA ADMIN */}
          {isAdmin && (
            <div 
              className="position-absolute top-0 end-0 m-2"
              style={{ zIndex: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Dropdown>
                <Dropdown.Toggle 
                  variant="dark"
                  size="sm"
                  style={{ 
                    backgroundColor: 'rgba(0,0,0,0.7)',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 12px'
                  }}
                >
                  <FaEllipsisV size={14} color="white" />
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  {slideId ? (
                    <>
                      <Dropdown.Item onClick={(e) => handleEdit(slideId, e)}>
                        <FaEdit className="me-2 text-primary" size={14} />
                        Editar
                      </Dropdown.Item>
                      <Dropdown.Item 
                        onClick={(e) => handleDelete(slideId, publicId, e)}
                        className="text-danger"
                      >
                        <FaTrash className="me-2" size={14} />
                        Eliminar
                      </Dropdown.Item>
                    </>
                  ) : (
                    <Dropdown.Item onClick={handleCreate}>
                      <FaPlus className="me-2 text-success" size={14} />
                      Agregar imagen
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}
        </div>
        <Carousel.Caption style={{ 
          backgroundColor: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(2px)',
          borderRadius: '10px', 
          padding: '15px 20px', 
          bottom: '25px' 
        }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: '700', color: '#fff' }}>{title}</h3>
          <p style={{ fontSize: '1.1rem', color: '#f8f8f8' }}>{description}</p>
        </Carousel.Caption>
      </Carousel.Item>
    );
  }, [isAdmin, homeImages, getMainSlideTitle, getMainSlideDescription, handleEdit, handleDelete, handleCreate]);

  // Renderizar slide lateral (EXACTAMENTE IGUAL AL ORIGINAL)
  const renderSideSlide = useCallback((image, index) => {
    const slide = sideSlides.current[index] || { title: 'Promo', color: '#8b5cf6' };
    
    return (
      <Carousel.Item key={index}>
        <div style={{ 
          height: '40vh', 
          maxHeight: '350px', 
          minHeight: '250px', 
          overflow: 'hidden', 
          position: 'relative', 
          borderRadius: '12px', 
          cursor: 'pointer' 
        }} onClick={() => handleSideSelect(index)}>
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
          />
          <div style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            right: 0, 
            bottom: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            borderRadius: '12px' 
          }}>
            <div style={{ 
              fontSize: '1.3rem', 
              fontWeight: '700', 
              marginBottom: '10px', 
              color: '#fff',
              textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
            }}>{slide.title}</div>
            <div style={{ 
              width: '28px', 
              height: '28px', 
              borderRadius: '50%', 
              backgroundColor: currentIndex === index ? 'white' : 'rgba(0,0,0,0.5)',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: currentIndex === index ? slide.color : 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>{index + 1}</div>
          </div>
        </div>
      </Carousel.Item>
    );
  }, [currentIndex, handleSideSelect]);

  // Estado de carga
  if (loading && !homeImages) {
    return (
      <Container fluid style={{ padding: '5px', backgroundColor: '#9E9B9B' }}>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando carousel...</span>
          </div>
        </div>
      </Container>
    );
  }

  // Versión móvil (solo carrusel principal)
  if (isMobile) {
    return (
      <Container fluid style={{ padding: '10px 5px 5px 5px', backgroundColor: '#CACECF' }}>
        <Row className="g-0">
          <Col xs={12}>
            <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <Carousel 
                activeIndex={mobileCurrentIndex} 
                onSelect={handleMainSelect} 
                fade 
                indicators 
                controls 
                interval={null}
              >
                {images.main.map((img, idx) => {
                  const title = getMainSlideTitle(idx);
                  const dynamicImage = homeImages && homeImages[idx];
                  const slideId = dynamicImage?._id;
                  const publicId = dynamicImage?.image?.public_id;
                  
                  return (
                    <Carousel.Item key={idx}>
                      <div style={{ 
                        height: '22vh', 
                        maxHeight: '180px', 
                        minHeight: '140px', 
                        overflow: 'hidden', 
                        backgroundColor: '#f8f9fa', 
                        borderRadius: '8px',
                        position: 'relative'
                      }}>
                        <img 
                          src={img} 
                          alt={title} 
                          loading={idx < 2 ? "eager" : "lazy"} 
                          style={{ 
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover', 
                            borderRadius: '8px' 
                          }} 
                        />
                        {/* Botón en móvil */}
                        {isAdmin && (
                          <div 
                            className="position-absolute top-0 end-0 m-1"
                            style={{ zIndex: 20 }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Dropdown>
                              <Dropdown.Toggle 
                                variant="dark"
                                size="sm"
                                style={{ 
                                  backgroundColor: 'rgba(0,0,0,0.7)',
                                  border: 'none',
                                  borderRadius: '6px',
                                  padding: '4px 8px'
                                }}
                              >
                                <FaEllipsisV size={12} color="white" />
                              </Dropdown.Toggle>
                              <Dropdown.Menu align="end">
                                {slideId ? (
                                  <>
                                    <Dropdown.Item onClick={(e) => handleEdit(slideId, e)}>
                                      <FaEdit className="me-2 text-primary" size={12} />
                                      Editar
                                    </Dropdown.Item>
                                    <Dropdown.Item 
                                      onClick={(e) => handleDelete(slideId, publicId, e)}
                                      className="text-danger"
                                    >
                                      <FaTrash className="me-2" size={12} />
                                      Eliminar
                                    </Dropdown.Item>
                                  </>
                                ) : (
                                  <Dropdown.Item onClick={handleCreate}>
                                    <FaPlus className="me-2 text-success" size={12} />
                                    Agregar
                                  </Dropdown.Item>
                                )}
                              </Dropdown.Menu>
                            </Dropdown>
                          </div>
                        )}
                      </div>
                      <Carousel.Caption style={{ 
                        backgroundColor: 'rgba(0,0,0,0.3)', 
                        backdropFilter: 'blur(2px)', 
                        borderRadius: '6px', 
                        padding: '6px 10px', 
                        bottom: '10px' 
                      }}>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: '600', color: '#fff' }}>{title}</h3>
                      </Carousel.Caption>
                    </Carousel.Item>
                  );
                })}
              </Carousel>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  // Versión desktop (carrusel principal + lateral)
  return (
    <Container fluid style={{ padding: '10px 5px 5px 5px', backgroundColor: '#CACECF' }}>
      <Row className="g-0">
        {/* CARRUSEL PRINCIPAL */}
        <Col lg={9} md={12} style={{ paddingRight: '5px' }}>
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
              {images.main.map((img, idx) => renderMainSlide(img, idx))}
            </Carousel>
          </div>
        </Col>

        {/* CARRUSEL LATERAL */}
        <Col lg={3} md={0} className="d-none d-lg-block" style={{ paddingLeft: 0 }}>
          <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <Carousel 
              activeIndex={currentIndex} 
              onSelect={handleSideSelect} 
              indicators={false} 
              controls={false} 
              interval={null} 
              className="side-carousel"
            >
              {images.side.map((img, idx) => renderSideSlide(img, idx))}
            </Carousel>
          </div>
        </Col>
      </Row>
    </Container>
  );
});

CarouselHome.displayName = 'CarouselHome';
export default CarouselHome;