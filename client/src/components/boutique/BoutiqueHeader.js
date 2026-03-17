// components/boutique/BoutiqueHeader.jsx
import React, { useEffect } from 'react';
import { Container, Row, Col, Badge, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { FaStore, FaEye, FaBoxOpen, FaStar, FaRegStar } from 'react-icons/fa';
import { incrementBoutiqueView } from '../../redux/actions/boutiqueAction';

const BoutiqueHeader = ({ boutique }) => {
  const dispatch = useDispatch();

  // 🔹 Corregido: usar state.boutique (como en tu reducer)
  const reduxBoutique = useSelector(state =>
    state.boutique.boutiques.find(b => b._id === boutique._id)
  );
  const currentBoutique = reduxBoutique || boutique;

  const {
    _id,
    nom_boutique,
    slogan_boutique,
    header_image,
    images = [],
    categorie,
    isVerified,
    stats = { vues: 0, produits: 0, notes: 0, avis: 0 },
    couleur_theme = '#2563eb'
  } = currentBoutique;

  const logoImage = images.length > 0 ? images[0] : null;

  // Incrementar vistas solo al cargar
  useEffect(() => {
    if (_id) {
      dispatch(incrementBoutiqueView(_id));
    }
  }, [_id, dispatch]);

  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating
          ? <FaStar key={i} className="text-warning" />
          : <FaRegStar key={i} className="text-secondary" />
      );
    }
    return stars;
  };

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

  const overlayStyle = header_image
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1
      }
    : {};

  return (
    <div className="boutique-header-wrapper">
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

          <Row className="mt-3">
            <Col className="text-end">
              <Button
                variant="warning"
                size="sm"
                className="ms-2"
                onClick={() => window.location.href = `/boutique/${_id}/products/new`}
                style={{
                  backgroundColor: 'rgba(255, 193, 7, 0.9)',
                  borderColor: '#ffc107',
                  color: '#000',
                  backdropFilter: 'blur(5px)'
                }}
              >
                <FaBoxOpen className="me-2" /> Nouveau produit
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      {logoImage && (
        <Container>
          <div
            className="avatar-container"
            style={{ marginTop: '-50px', position: 'relative', zIndex: 3, marginBottom: '20px' }}
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
            >
              <img
                src={logoImage.url || logoImage}
                alt={nom_boutique}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </Container>
      )}
    </div>
  );
};

export default BoutiqueHeader;