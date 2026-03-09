import React, { useState, useEffect, useCallback, memo } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { Container, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const CategoryCarousel = memo(() => {

  const { category } = useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mainCarouselImages, setMainCarouselImages] = useState([]);
  const [sideCarouselImages, setSideCarouselImages] = useState([]);
  const [mainSlides, setMainSlides] = useState([]);

  const CACHE_BREAK = `v=${Date.now()}`;

  // Detectar tamaño pantalla (Android incluido)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Cargar imágenes por categoría
  useEffect(() => {

    const imagesByCategory = {
     
      'automobiles-vehicules': {
        main: [
          `https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`
        ]
      },
      'pieces-detachees': {
        main: [
          `https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1619642751034-7656df90394b?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`
        ]
      },
      'telephones-accessoires': {
        main: [
          `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`
        ]
      },
      informatique: {
        main: [
          `https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`
        ]
      },
      'electromenager-electronique': {
        main: [
          `https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1593642634367-d91a135587b5?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`
        ]
      },
      'vetements-mode': {
        main: [
          `https://images.unsplash.com/photo-1520975928316-56c2d8e4d0d9?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`
        ]
      },
      'sante-beaute': {
        main: [
          `https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`
        ]
      },
      'meubles-maison': {
        main: [
          `https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1598928501493-82e4ec4b0fa0?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`
        ]
      },
      'loisirs-divertissements': {
        main: [
          `https://images.unsplash.com/photo-1511882150382-4210563a7220?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`
        ]
      },
      alimentaires: {
        main: [
          `https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`
        ]
      },
      'materiaux-equipement': {
        main: [
          `https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`
        ]
      },
      services: {
        main: [
          `https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`
        ]
      },
      voyages: {
        main: [
          `https://images.unsplash.com/photo-1500835556837-99ac94a94552?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`
        ]
      },
      immobilier: {
        main: [
          `https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`
        ],
        side: [
          `https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=600&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=600&q=80&${CACHE_BREAK}`
        ]
      },

      vehicules: {
        main: [
          `https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`
        ],
        side: [
          `https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=600&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=600&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80&${CACHE_BREAK}`
        ]
      },

      vetements: {
        main: [
          `https://images.unsplash.com/photo-1520975928316-56c2d8e4d0d9?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1495121605193-b116b5b09a6d?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`
        ],
        side: [
          `https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1475180098004-ca48cd668fe0?auto=format&fit=crop&w=600&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80&${CACHE_BREAK}`
        ]
      },

      electroniques: {
        main: [
          `https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80&${CACHE_BREAK}`
        ],
        side: [
          `https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80&${CACHE_BREAK}`,
          `https://images.unsplash.com/photo-1593642634367-d91a135587b5?auto=format&fit=crop&w=600&q=80&${CACHE_BREAK}`
        ]
      }

    };

    const selected = imagesByCategory[category] || imagesByCategory.immobilier;

    setMainCarouselImages(selected.main);
    setSideCarouselImages(selected.side);

    setMainSlides([
      { title: category?.toUpperCase() || 'Marketplace', description: 'Découvrez nos meilleures offres' },
      { title: 'Nouveautés', description: 'Les dernières tendances du marché' },
      { title: 'Promotions', description: 'Jusqu’à -50% aujourd’hui' }
    ]);

    setCurrentIndex(0);

  }, [category]);

  // Autoplay dinámico
  const goToNextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % mainCarouselImages.length);
  }, [mainCarouselImages.length]);

  useEffect(() => {
    if (mainCarouselImages.length === 0) return;
    const interval = setInterval(goToNextSlide, 4000);
    return () => clearInterval(interval);
  }, [goToNextSlide, mainCarouselImages.length]);

  if (mainCarouselImages.length === 0) return null;

  // 📱 VERSION MOVIL (ANDROID)
  if (isMobile) {
    return (
      <Container fluid style={{ padding: '5px' }}>
        <Carousel activeIndex={currentIndex} onSelect={(i)=>setCurrentIndex(i)} fade indicators controls>
          {mainCarouselImages.map((image, index) => (
            <Carousel.Item key={index}>
              <img
                src={image}
                alt={mainSlides[index]?.title}
                style={{ width: '100%', height: '164px', objectFit: 'cover', borderRadius: '10px' }}
              />
              <Carousel.Caption>
                <h6>{mainSlides[index]?.title}</h6>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    );
  }

  // 💻 VERSION DESKTOP - CON MARGEN DE 5px ENTRE CAROUSELS
  return (
    <Container fluid style={{ padding: '7px' }}>
      <Row className="g-0">
        <Col lg={9} style={{ paddingRight: '5px' }}> {/* ← MARGEN DE 5px A LA DERECHA */}
          <Carousel activeIndex={currentIndex} onSelect={(i)=>setCurrentIndex(i)} fade indicators controls>
            {mainCarouselImages.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  src={image}
                  alt={mainSlides[index]?.title}
                  style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '12px' }}
                />
                <Carousel.Caption>
                  <h3>{mainSlides[index]?.title}</h3>
                  <p>{mainSlides[index]?.description}</p>
                </Carousel.Caption>
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>

        <Col lg={3} className="d-none d-lg-block" style={{ paddingLeft: '0' }}> {/* SIN MARGEN A LA IZQUIERDA */}
          <Carousel activeIndex={currentIndex} onSelect={(i)=>setCurrentIndex(i)} indicators={false} controls={false}>
            {sideCarouselImages.map((image, index) => (
              <Carousel.Item key={index}>
                <img
                  src={image}
                  alt="side"
                  style={{ width: '100%', height: '250px', objectFit: 'cover', borderRadius: '12px' }}
                />
              </Carousel.Item>
            ))}
          </Carousel>
        </Col>
      </Row>
    </Container>
  );

});

export default CategoryCarousel;