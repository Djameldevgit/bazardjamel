// components/boutique/BoutiqueHeader.jsx
import React from 'react';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { FaStore, FaEye, FaBoxOpen, FaStar, FaRegStar } from 'react-icons/fa';

const BoutiqueHeader = ({ boutique }) => {
  const {
    nom_boutique,
    slogan_boutique,
    header_image,
    images = [], // Array de imágenes
    categorie,
    isVerified,
    stats = { vues: 0, produits: 0, notes: 0, avis: 0 },
    couleur_theme = '#2563eb'
  } = boutique;

  // La primera imagen del array es el logo
  const logoImage = images && images.length > 0 ? images[0] : null;

  // Función para renderizar estrellas
  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-warning" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-secondary" />);
      }
    }
    return stars;
  };

  // Estilo para el header con imagen de fondo o color de tema
  const headerStyle = {
    backgroundImage: header_image ? `url(${header_image})` : 'none',
    backgroundColor: !header_image ? couleur_theme : 'transparent',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    minHeight: '250px',
    display: 'flex',
    alignItems: 'flex-end',
    paddingBottom: '60px'
  };

  // Overlay oscuro si hay imagen de fondo
  const overlayStyle = header_image ? {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1
  } : {};

  return (
    <div className="boutique-header-wrapper">
      {/* Header con imagen de fondo */}
      <div style={headerStyle}>
        {header_image && <div style={overlayStyle}></div>}
        
        <Container style={{ position: 'relative', zIndex: 2 }}>
          <Row className="align-items-end">
            <Col md={8} className="text-white">
              <h1 className="display-5 fw-bold mb-2">{nom_boutique}</h1>
              {slogan_boutique && <p className="lead mb-3">{slogan_boutique}</p>}
              <div className="mb-3">
                <Badge bg="light" text="dark" className="me-2">
                  <FaStore className="me-1" /> {categorie}
                </Badge>
                {isVerified && (
                  <Badge bg="success">
                    <i className="fas fa-check-circle me-1"></i> Vérifié
                  </Badge>
                )}
              </div>
            </Col>
            <Col md={4} className="text-md-end text-white">
              <div className="stats-display">
                <span className="me-3">
                  <FaEye className="me-1" /> {stats.vues || 0}
                </span>
                <span className="me-3">
                  <FaBoxOpen className="me-1" /> {stats.produits || 0} produits
                </span>
                <span>
                  {renderStars(stats.notes)}
                  <small className="ms-2">({stats.avis || 0} avis)</small>
                </span>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Avatar posicionado en el medio - usando la primera imagen */}
      {logoImage && (
        <Container>
          <div 
            className="avatar-container"
            style={{
              marginTop: '-50px',
              position: 'relative',
              zIndex: 3,
              marginBottom: '20px'
            }}
          >
            <div 
              className="avatar-wrapper"
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: `4px solid ${couleur_theme}`,
                overflow: 'hidden',
                backgroundColor: 'white',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = `0 8px 25px ${couleur_theme}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
              }}
            >
              <img 
                src={logoImage.url || logoImage}
                alt={nom_boutique}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>
        </Container>
      )}
    </div>
  );
};

export default BoutiqueHeader;