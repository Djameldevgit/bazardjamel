import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Badge, Button, Spinner, Image, Tab, Nav, ListGroup } from 'react-bootstrap';
import { getBoutique } from '../../redux/actions/boutiqueAction';
import NotFound from '../../components/NotFound';
import { FaStore, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, 
         FaFacebook, FaInstagram, FaTiktok, FaWhatsapp, 
         FaStar, FaRegStar, FaEye, FaBoxOpen } from 'react-icons/fa';

const BoutiqueDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentBoutique, loading } = useSelector(state => state.boutique);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (id) {
      dispatch(getBoutique(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentBoutique?.images?.length > 0) {
      setActiveImage(0);
    }
  }, [currentBoutique]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement de la boutique...</p>
      </Container>
    );
  }

  if (!currentBoutique) return <NotFound />;

  const {
    nom_boutique,
    slogan_boutique,
    description_boutique,
    images,
    categorie,
    subCategory,
    proprietaire,
    reseaux_sociaux,
    couleur_theme = '#2563eb',
    stats = { vues: 0, produits: 0, notes: 0, avis: 0 },
    isVerified,
    date_debut,
    plan,
    duree_abonnement
  } = currentBoutique;

  // Formatear fecha
  const dateDebut = date_debut ? new Date(date_debut).toLocaleDateString('fr-FR') : 'N/A';

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

  return (
    <div className="boutique-detail-page" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      {/* Header con color de tema */}
      <div 
        className="boutique-header py-4 mb-4" 
        style={{ 
          backgroundColor: couleur_theme,
          color: 'white'
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h1 className="display-5 fw-bold mb-2">{nom_boutique}</h1>
              {slogan_boutique && <p className="lead mb-0">{slogan_boutique}</p>}
              <div className="mt-3">
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
            <Col md={4} className="text-md-end mt-3 mt-md-0">
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

      <Container>
        <Row>
          {/* Columna izquierda - Imágenes */}
          <Col lg={6} className="mb-4">
            <Card className="border-0 shadow-sm">
              <Card.Body>
                {/* Imagen principal */}
                {images && images.length > 0 ? (
                  <>
                    <div className="main-image-container mb-3 text-center">
                      <Image 
                        src={images[activeImage]?.url || images[activeImage]} 
                        alt={nom_boutique}
                        fluid
                        style={{ 
                          maxHeight: '400px', 
                          objectFit: 'contain',
                          borderRadius: '10px'
                        }}
                      />
                    </div>
                    
                    {/* Miniaturas */}
                    {images.length > 1 && (
                      <Row className="g-2">
                        {images.map((img, index) => (
                          <Col xs={3} key={index}>
                            <div 
                              className={`thumbnail ${activeImage === index ? 'active' : ''}`}
                              onClick={() => setActiveImage(index)}
                              style={{ 
                                cursor: 'pointer',
                                border: activeImage === index ? `3px solid ${couleur_theme}` : '3px solid transparent',
                                borderRadius: '8px',
                                overflow: 'hidden'
                              }}
                            >
                              <Image 
                                src={img.url || img} 
                                alt={`${nom_boutique} ${index + 1}`}
                                thumbnail 
                                style={{ height: '80px', width: '100%', objectFit: 'cover' }}
                              />
                            </div>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </>
                ) : (
                  <div className="text-center py-5 bg-light rounded">
                    <FaStore size={64} className="text-secondary mb-3" />
                    <p>Aucune image disponible</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Columna derecha - Información */}
          <Col lg={6}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h4 className="mb-3">À propos de la boutique</h4>
                <p className="text-muted">{description_boutique || 'Aucune description disponible.'}</p>

                <hr />

                <Row className="mb-3">
                  <Col sm={4} className="text-muted">Plan</Col>
                  <Col sm={8}>
                    <Badge bg="info">{plan || 'Gratuit'}</Badge>
                    {duree_abonnement && (
                      <Badge bg="secondary" className="ms-2">{duree_abonnement}</Badge>
                    )}
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col sm={4} className="text-muted">Membre depuis</Col>
                  <Col sm={8}>{dateDebut}</Col>
                </Row>

                <hr />

                {/* Propriétaire */}
                {proprietaire && (
                  <>
                    <h5 className="mb-3">Propriétaire</h5>
                    <ListGroup variant="flush" className="mb-4">
                      {proprietaire.nom && (
                        <ListGroup.Item className="px-0">
                          <strong>Nom:</strong> {proprietaire.nom}
                        </ListGroup.Item>
                      )}
                      {proprietaire.telephone && (
                        <ListGroup.Item className="px-0">
                          <strong>Téléphone:</strong> {proprietaire.telephone}
                        </ListGroup.Item>
                      )}
                      {proprietaire.email && (
                        <ListGroup.Item className="px-0">
                          <strong>Email:</strong> {proprietaire.email}
                        </ListGroup.Item>
                      )}
                      {proprietaire.wilaya && (
                        <ListGroup.Item className="px-0">
                          <FaMapMarkerAlt className="text-danger me-2" />
                          {proprietaire.wilaya}{proprietaire.adresse ? `, ${proprietaire.adresse}` : ''}
                        </ListGroup.Item>
                      )}
                    </ListGroup>
                  </>
                )}

                {/* Réseaux sociaux */}
                {reseaux_sociaux && Object.values(reseaux_sociaux).some(v => v) && (
                  <>
                    <h5 className="mb-3">Réseaux sociaux</h5>
                    <div className="social-links mb-4">
                      {reseaux_sociaux.facebook && (
                        <Button 
                          as="a" 
                          href={reseaux_sociaux.facebook} 
                          target="_blank"
                          variant="outline-primary" 
                          size="sm"
                          className="me-2 mb-2"
                        >
                          <FaFacebook className="me-1" /> Facebook
                        </Button>
                      )}
                      {reseaux_sociaux.instagram && (
                        <Button 
                          as="a" 
                          href={reseaux_sociaux.instagram} 
                          target="_blank"
                          variant="outline-danger" 
                          size="sm"
                          className="me-2 mb-2"
                        >
                          <FaInstagram className="me-1" /> Instagram
                        </Button>
                      )}
                      {reseaux_sociaux.tiktok && (
                        <Button 
                          as="a" 
                          href={reseaux_sociaux.tiktok} 
                          target="_blank"
                          variant="outline-dark" 
                          size="sm"
                          className="me-2 mb-2"
                        >
                          <FaTiktok className="me-1" /> TikTok
                        </Button>
                      )}
                      {reseaux_sociaux.whatsapp && (
                        <Button 
                          as="a" 
                          href={`https://wa.me/${reseaux_sociaux.whatsapp.replace(/\s/g, '')}`} 
                          target="_blank"
                          variant="outline-success" 
                          size="sm"
                          className="me-2 mb-2"
                        >
                          <FaWhatsapp className="me-1" /> WhatsApp
                        </Button>
                      )}
                      {reseaux_sociaux.website && (
                        <Button 
                          as="a" 
                          href={reseaux_sociaux.website} 
                          target="_blank"
                          variant="outline-secondary" 
                          size="sm"
                          className="me-2 mb-2"
                        >
                          <FaGlobe className="me-1" /> Site web
                        </Button>
                      )}
                    </div>
                  </>
                )}

                {/* Boutons d'action */}
                <div className="d-grid gap-2 mt-4">
                  <Button 
                    variant="primary" 
                    size="lg"
                    style={{ backgroundColor: couleur_theme, borderColor: couleur_theme }}
                  >
                    <FaPhone className="me-2" />
                    Contacter la boutique
                  </Button>
                  <Button variant="outline-secondary">
                    Voir tous les produits ({stats.produits || 0})
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style jsx="true">{`
        .thumbnail.active {
          transform: scale(1.05);
          transition: all 0.2s;
        }
        .thumbnail:hover {
          opacity: 0.8;
        }
        .stats-display {
          font-size: 0.9rem;
        }
      `}</style>
    </div>
  );
};

export default BoutiqueDetailPage;