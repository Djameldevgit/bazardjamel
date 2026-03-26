import React, { useState } from 'react';
import { Carousel, Container } from 'react-bootstrap';

const CarouselHeader = ({ boutique }) => {
  const [index, setIndex] = useState(0);
  
  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  
  const mediaItems = boutique?.header?.media || [
    { url: '/images/default-banner.jpg', title: 'Bienvenue' }
  ];
  
  return (
    <div className="boutique-header-carousel position-relative">
      <Carousel 
        activeIndex={index} 
        onSelect={handleSelect}
        interval={boutique.header?.settings?.interval || 5000}
        pause="hover"
      >
        {mediaItems.map((item, idx) => (
          <Carousel.Item key={idx}>
            <img
              className="d-block w-100"
              src={item.url}
              alt={item.title || `Slide ${idx + 1}`}
              style={{ maxHeight: '400px', objectFit: 'cover' }}
            />
            {item.title && (
              <Carousel.Caption>
                <h3>{item.title}</h3>
                {item.link && <a href={item.link} className="btn btn-primary">Voir plus</a>}
              </Carousel.Caption>
            )}
          </Carousel.Item>
        ))}
      </Carousel>
      
      {/* Info overlay */}
      <div className="position-absolute bottom-0 start-0 w-100 p-4 text-white" 
           style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.5))', zIndex: 10 }}>
        <Container>
          <h2>{boutique.nom_boutique}</h2>
          {boutique.slogan_boutique && <p>{boutique.slogan_boutique}</p>}
        </Container>
      </div>
    </div>
  );
};

export default CarouselHeader;