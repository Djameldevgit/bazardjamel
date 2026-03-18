// components/boutique/BoutiqueHeader.jsx
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Badge, Button, Dropdown, Image } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaStore, FaEye, FaBoxOpen, FaStar, FaRegStar, 
  FaPlus, FaImages, FaTags, FaFileAlt,
  FaCheckCircle, FaShare, FaHeart, FaRegHeart,
  FaFacebook, FaTwitter, FaWhatsapp, FaLink
} from 'react-icons/fa';
import { incrementBoutiqueView } from '../../redux/actions/boutiqueAction';

const BoutiqueHeader = ({ boutique }) => {
  const dispatch = useDispatch();
  const [isFollowing, setIsFollowing] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  // Obtener datos actualizados de Redux
  const reduxBoutique = useSelector(state =>
    state.boutique.boutiques.find(b => b._id === boutique._id)
  );
  const currentBoutique = reduxBoutique || boutique;

  const {
    _id,
    nom_boutique,
    slogan_boutique,
    description_boutique,
    header_image,
    images = [],
    categorie,
    isVerified,
    stats = { vues: 0, produits: 0, notes: 0, avis: 0 },
    couleur_theme = '#2563eb',
    createdAt
  } = currentBoutique;

  const logoImage = images.length > 0 ? images[0] : null;

  // Incrementar vistas
  useEffect(() => {
    if (_id) {
      dispatch(incrementBoutiqueView(_id));
    }
  }, [_id, dispatch]);

  // Renderizar estrellas
  const renderStars = (rating = 0) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-warning" size={14} />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className="position-relative d-inline-block">
            <FaRegStar className="text-secondary" size={14} />
            <FaStar className="text-warning position-absolute top-0 start-0" style={{ clipPath: 'inset(0 50% 0 0)' }} size={14} />
          </div>
        );
      } else {
        stars.push(<FaRegStar key={i} className="text-secondary" size={14} />);
      }
    }
    return stars;
  };

  // Compartir en redes sociales
  const shareUrl = window.location.href;
  const shareTitle = `Découvrez ${nom_boutique} sur notre marketplace`;

  const handleShare = (platform) => {
    let url = '';
    switch(platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        setShowShareTooltip(true);
        setTimeout(() => setShowShareTooltip(false), 2000);
        return;
      default:
        return;
    }
    window.open(url, '_blank', 'width=600,height=400');
  };

  const headerStyle = {
    backgroundImage: header_image ? `url(${header_image})` : `linear-gradient(135deg, ${couleur_theme} 0%, ${adjustColor(couleur_theme, 30)} 100%)`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    minHeight: header_image ? '300px' : '200px',
    display: 'flex',
    alignItems: 'flex-end',
    paddingBottom: '40px'
  };

  const overlayStyle = header_image
    ? {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)',
        zIndex: 1
      }
    : {};

  // Función para aclarar/oscurecer color
  function adjustColor(color, percent) {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return `#${(0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1)}`;
  }

  return (
    <div className="boutique-header-wrapper">
      {/* Header con imagen de fondo */}
      <div style={headerStyle}>
        <div style={overlayStyle}></div>
        
        {/* Logo en la esquina superior izquierda (como estaba antes) */}
        {logoImage && (
          <div
            className="logo-corner"
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              zIndex: 10,
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              border: `4px solid ${couleur_theme}`,
              overflow: 'hidden',
              backgroundColor: 'white',
              boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
              transition: 'transform 0.3s ease',
              cursor: 'pointer'
            }}
          >
            <img
              src={logoImage.url || logoImage}
              alt={nom_boutique}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        )}

        {/* Botones de acción superiores */}
        <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 3 }}>
          <div className="d-flex gap-2">
            <Button
              variant="light"
              size="sm"
              className="rounded-pill shadow-sm"
              onClick={() => setIsFollowing(!isFollowing)}
              style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.9)' }}
            >
              {isFollowing ? (
                <>
                  <FaHeart className="text-danger me-2" /> Suivi
                </>
              ) : (
                <>
                  <FaRegHeart className="me-2" /> Suivre
                </>
              )}
            </Button>

            <Dropdown align="end">
              <Dropdown.Toggle
                variant="light"
                size="sm"
                className="rounded-pill shadow-sm"
                style={{ backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255,255,255,0.9)' }}
              >
                <FaShare className="me-2" /> Partager
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleShare('facebook')}>
                  <FaFacebook className="text-primary me-2" /> Facebook
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleShare('twitter')}>
                  <FaTwitter className="text-info me-2" /> Twitter
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleShare('whatsapp')}>
                  <FaWhatsapp className="text-success me-2" /> WhatsApp
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleShare('copy')}>
                  <FaLink className="me-2" /> Copier le lien
                  {showShareTooltip && (
                    <Badge bg="success" className="ms-2">Copié!</Badge>
                  )}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        <Container style={{ position: 'relative', zIndex: 2 }}>
          <Row className="align-items-end">
            <Col xs={12} md={8} className="text-white">
              <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3 mb-2">
                <h1 className="fw-bold mb-0" style={{ fontSize: 'clamp(1.5rem, 5vw, 3rem)' }}>
                  {nom_boutique}
                </h1>
                {isVerified && (
                  <Badge bg="success" className="rounded-pill px-2 px-md-3 py-1 py-md-2">
                    <FaCheckCircle className="me-1" size={12} /> 
                    <span className="d-none d-sm-inline">Boutique vérifiée</span>
                    <span className="d-sm-none">Vérifiée</span>
                  </Badge>
                )}
              </div>
              
              {slogan_boutique && (
                <p className="mb-2" style={{ fontSize: 'clamp(1rem, 4vw, 1.3rem)', opacity: 0.95 }}>
                  {slogan_boutique}
                </p>
              )}
              
              {description_boutique && (
                <p className="mb-3 d-none d-md-block" style={{ opacity: 0.9, maxWidth: '600px' }}>
                  {description_boutique.substring(0, 150)}
                  {description_boutique.length > 150 && '...'}
                </p>
              )}

              <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3 mb-3">
                <Badge bg="light" text="dark" className="rounded-pill px-3 py-2">
                  <FaStore className="me-1" size={12} /> 
                  <span className="d-none d-sm-inline">{categorie}</span>
                  <span className="d-sm-none">{categorie?.substring(0, 10)}...</span>
                </Badge>
                
                <div className="d-flex align-items-center">
                  {renderStars(stats.notes)}
                  <small className="ms-2 d-none d-sm-inline">
                    ({stats.avis} avis)
                  </small>
                  <small className="ms-1 d-sm-none">
                    {stats.notes?.toFixed(1)}
                  </small>
                </div>

                <div className="d-flex d-md-none gap-3 ms-auto">
                  <div className="text-center">
                    <small className="d-block fw-bold">{stats.vues?.toLocaleString() || 0}</small>
                    <small>vues</small>
                  </div>
                  <div className="text-center">
                    <small className="d-block fw-bold">{stats.produits || 0}</small>
                    <small>prod.</small>
                  </div>
                </div>
              </div>
            </Col>

            <Col md={4} className="d-none d-md-block">
              <div className="stats-card bg-white bg-opacity-10 backdrop-blur rounded-4 p-3 text-white">
                <Row className="g-2">
                  <Col xs={4} className="text-center">
                    <div className="stats-icon mb-1">
                      <FaEye size={20} />
                    </div>
                    <div className="stats-value fw-bold">
                      {stats.vues?.toLocaleString() || 0}
                    </div>
                    <div className="stats-label small">Vues</div>
                  </Col>
                  
                  <Col xs={4} className="text-center">
                    <div className="stats-icon mb-1">
                      <FaBoxOpen size={20} />
                    </div>
                    <div className="stats-value fw-bold">
                      {stats.produits || 0}
                    </div>
                    <div className="stats-label small">Produits</div>
                  </Col>
                  
                  <Col xs={4} className="text-center">
                    <div className="stats-icon mb-1">
                      <FaStar size={20} />
                    </div>
                    <div className="stats-value fw-bold">
                      {stats.notes?.toFixed(1) || 0}
                    </div>
                    <div className="stats-label small">Note</div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Barra de acciones inferior */}
      <div 
        className="action-bar py-2 py-md-3"
        style={{ 
          backgroundColor: 'white',
          borderBottom: '1px solid #e9ecef',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col xs={12} md={4} className="mb-2 mb-md-0">
              <div className="d-flex align-items-center gap-2">
                <div>
                  <h6 className="mb-0 fw-bold">{nom_boutique}</h6>
                  <small className="text-muted">
                    Membre depuis {new Date(createdAt).toLocaleDateString()}
                  </small>
                </div>
              </div>
            </Col>

            <Col xs={12} md={8}>
              <div className="d-flex flex-column flex-sm-row justify-content-end gap-2">
                <Dropdown>
                  <Dropdown.Toggle
                    variant="primary"
                    size="sm"
                    className="rounded-pill px-3 px-md-4 w-100 w-sm-auto"
                    style={{
                      backgroundColor: couleur_theme,
                      borderColor: couleur_theme
                    }}
                  >
                    <FaPlus className="me-2" /> Publier
                  </Dropdown.Toggle>

                  <Dropdown.Menu className="shadow-lg border-0 py-2">
                    <Dropdown.Header className="text-muted small fw-bold">
                      <FaBoxOpen className="me-2" /> Nouvelle annonce
                    </Dropdown.Header>
                    <Dropdown.Divider />
                    
                    <Dropdown.Item 
                      href={`/boutique/${_id}/products/new`}
                      className="py-2"
                    >
                      <FaFileAlt className="text-primary me-3" />
                      <div>
                        <div className="fw-bold">Produit standard</div>
                        <small className="text-muted d-none d-md-inline">Pour un article classique</small>
                      </div>
                    </Dropdown.Item>
                    
                    <Dropdown.Item 
                      href={`/boutique/${_id}/products/new?type=promo`}
                      className="py-2"
                    >
                      <FaTags className="text-success me-3" />
                      <div>
                        <div className="fw-bold">Promotion</div>
                        <small className="text-muted d-none d-md-inline">Mettez en avant une offre</small>
                      </div>
                    </Dropdown.Item>
                    
                    <Dropdown.Item 
                      href={`/boutique/${_id}/gallery/new`}
                      className="py-2"
                    >
                      <FaImages className="text-warning me-3" />
                      <div>
                        <div className="fw-bold">Album photo</div>
                        <small className="text-muted d-none d-md-inline">Créez une galerie</small>
                      </div>
                    </Dropdown.Item>

                    <Dropdown.Divider />
                    
                    <Dropdown.Item 
                      href={`/boutique/${_id}/dashboard`}
                      className="text-center text-primary"
                    >
                      Gérer ma boutique →
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>

                <Button
                  variant="outline-primary"
                  size="sm"
                  className="rounded-pill px-3 px-md-4 w-100 w-sm-auto"
                  href={`/boutique/${_id}/products`}
                  style={{
                    borderColor: couleur_theme,
                    color: couleur_theme
                  }}
                >
                  Voir tous les produits
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <style jsx="true">{`
        .backdrop-blur {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        
        .stats-card {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          transition: transform 0.3s ease;
        }
        
        .stats-card:hover {
          transform: translateY(-5px);
        }
        
        .logo-corner {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .logo-corner:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(0,0,0,0.3);
        }
        
        .dropdown-item {
          transition: background-color 0.2s ease;
        }
        
        .dropdown-item:hover {
          background-color: #f8f9fa;
        }
        
        @media (max-width: 768px) {
          .logo-corner {
            width: 60px;
            height: 60px;
            top: 15px;
            left: 15px;
          }
          
          .action-bar .btn {
            font-size: 0.9rem;
            padding: 0.4rem 1rem;
          }
          
          .dropdown-item div small {
            display: none;
          }
        }
        
        @media (max-width: 576px) {
          .logo-corner {
            width: 50px;
            height: 50px;
            top: 10px;
            left: 10px;
          }
          
          .action-bar .d-flex {
            flex-direction: column;
          }
          
          .action-bar .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default BoutiqueHeader;