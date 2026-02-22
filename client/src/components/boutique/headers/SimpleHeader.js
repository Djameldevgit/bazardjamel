import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

const SimpleHeader = ({ boutique }) => {
  const headerImage = boutique?.header?.media?.[0]?.url || '/images/default-banner.jpg';
  
  return (
    <div className="boutique-header-simple position-relative">
      <Image 
        src={headerImage}
        fluid
        style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
      />
      <div className="position-absolute bottom-0 start-0 w-100 p-4 text-white" 
           style={{ background: 'linear-gradient(transparent, rgba(0,0,0,0.7))' }}>
        <Container>
          <h1 className="display-4">{boutique.nom_boutique}</h1>
          {boutique.slogan_boutique && (
            <p className="lead">{boutique.slogan_boutique}</p>
          )}
        </Container>
      </div>
    </div>
  );
};

export default SimpleHeader;