// 📂 src/pages/boutique/BoutiquePage.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Spinner, Tabs, Tab, Image } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { FaStore, FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaInstagram, FaTiktok, FaWhatsapp, FaGlobe, FaStar, FaEye, FaShoppingCart, FaShareAlt, FaHeart } from 'react-icons/fa';

const BoutiquePage = () => {
  const { domaine } = useParams();
  const { auth } = useSelector(state => state);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [boutique, setBoutique] = useState(null);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Fetch boutique data
  useEffect(() => {
    const fetchBoutiqueData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch boutique info
        const boutiqueRes = await axios.get(`/api/boutique/domain/${domaine}`);
        setBoutique(boutiqueRes.data.boutique);
        
        // Fetch boutique products
        const productsRes = await axios.get(`/api/boutique/${boutiqueRes.data.boutique._id}/products`, {
          params: { page: currentPage, limit: 12 }
        });
        
        setProducts(productsRes.data.products || []);
        setTotalPages(productsRes.data.totalPages || 1);
        
      } catch (err) {
        console.error('Error fetching boutique:', err);
        setError(err.response?.data?.msg || 'Boutique non trouvée');
      } finally {
        setLoading(false);
      }
    };
    
    if (domaine) {
      fetchBoutiqueData();
    }
  }, [domaine, currentPage]);
  
  // Format phone number
  const formatPhone = (phone) => {
    if (!phone) return '';
    return phone.replace(/(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})/, '$1 $2 $3 $4 $5');
  };
  
  // Render status badge
  const renderStatusBadge = (status) => {
    const statusConfig = {
      'active': { variant: 'success', label: 'Active' },
      'pending': { variant: 'warning', label: 'En attente' },
      'suspended': { variant: 'danger', label: 'Suspendue' },
      'expired': { variant: 'secondary', label: 'Expirée' }
    };
    
    const config = statusConfig[status] || { variant: 'light', label: status };
    return <Badge bg={config.variant}>{config.label}</Badge>;
  };
  
  // Render social media links
  const renderSocialLinks = () => {
    if (!boutique?.reseaux_sociaux) return null;
    
    const socials = [
      { key: 'facebook', icon: <FaFacebook />, label: 'Facebook' },
      { key: 'instagram', icon: <FaInstagram />, label: 'Instagram' },
      { key: 'tiktok', icon: <FaTiktok />, label: 'TikTok' },
      { key: 'whatsapp', icon: <FaWhatsapp />, label: 'WhatsApp' },
      { key: 'website', icon: <FaGlobe />, label: 'Site web' }
    ];
    
    return (
      <div className="social-links mt-3">
        <h6 className="mb-2">
          <FaShareAlt className="me-2" />
          Réseaux sociaux
        </h6>
        <div className="d-flex flex-wrap gap-2">
          {socials.map(social => {
            const link = boutique.reseaux_sociaux[social.key];
            if (!link) return null;
            
            return (
              <a
                key={social.key}
                href={link.startsWith('http') ? link : `https://${link}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline-primary btn-sm"
              >
                {social.icon} {social.label}
              </a>
            );
          })}
        </div>
      </div>
    );
  };
  
  // Render product cards
  const renderProducts = () => {
    if (products.length === 0) {
      return (
        <div className="text-center py-5">
          <FaShoppingCart className="display-1 text-muted mb-3" />
          <h4>Aucun produit disponible</h4>
          <p className="text-muted">
            Cette boutique n'a pas encore de produits à vendre.
          </p>
        </div>
      );
    }
    
    return (
      <Row>
        {products.map(product => (
          <Col key={product._id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card className="product-card h-100">
              {product.images?.[0]?.url ? (
                <Card.Img 
                  variant="top" 
                  src={product.images[0].url} 
                  alt={product.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
              ) : (
                <div className="text-center py-5 bg-light">
                  <FaShoppingCart className="text-muted" size={50} />
                </div>
              )}
              
              <Card.Body>
                <Card.Title className="h6 mb-2">
                  {product.title?.substring(0, 50)}
                  {product.title?.length > 50 && '...'}
                </Card.Title>
                
                <Card.Text className="text-muted small mb-2">
                  {product.description?.substring(0, 80)}
                  {product.description?.length > 80 && '...'}
                </Card.Text>
                
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <span className="h5 text-primary mb-0">
                      {product.price?.toLocaleString()} DA
                    </span>
                  </div>
                  <Badge bg={product.etat === 'neuf' ? 'success' : 'warning'}>
                    {product.etat || 'Occasion'}
                  </Badge>
                </div>
              </Card.Body>
              
              <Card.Footer className="bg-white border-top-0">
                <div className="d-flex justify-content-between">
                  <small className="text-muted">
                    <FaEye className="me-1" /> {product.views || 0}
                  </small>
                  <Link 
                    to={`/post/${product._id}`}
                    className="btn btn-primary btn-sm"
                  >
                    Voir détails
                  </Link>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    );
  };
  
  // Render boutique info
  const renderBoutiqueInfo = () => {
    if (!boutique) return null;
    
    return (
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <div className="d-flex align-items-start mb-4">
            {boutique.logo?.url ? (
              <Image 
                src={boutique.logo.url} 
                roundedCircle 
                width={100}
                height={100}
                className="me-4 border"
                alt={boutique.nom_boutique}
              />
            ) : (
              <div className="logo-placeholder me-4">
                <FaStore size={40} />
              </div>
            )}
            
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h1 className="h2 mb-1">{boutique.nom_boutique}</h1>
                  <p className="text-muted mb-2">
                    {boutique.slogan_boutique}
                  </p>
                  <div className="d-flex align-items-center gap-2 mb-2">
                    {renderStatusBadge(boutique.status)}
                    <Badge bg="info">
                      {boutique.plan?.toUpperCase() || 'GRATUIT'}
                    </Badge>
                  </div>
                </div>
                
                <div className="text-end">
                  <div className="boutique-stats">
                    <div className="stat-item">
                      <div className="stat-number">{boutique.produits_count || 0}</div>
                      <small className="text-muted">Produits</small>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">{boutique.vues || 0}</div>
                      <small className="text-muted">Vues</small>
                    </div>
                    <div className="stat-item">
                      <div className="stat-number">
                        <FaStar className="text-warning" /> {boutique.note_moyenne?.toFixed(1) || '0.0'}
                      </div>
                      <small className="text-muted">Note</small>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Categories */}
              {boutique.categories_produits?.length > 0 && (
                <div className="mt-3">
                  <h6 className="mb-2">
                    <FaShoppingCart className="me-2" />
                    Catégories
                  </h6>
                  <div className="d-flex flex-wrap gap-2">
                    {boutique.categories_produits.map(cat => (
                      <Badge key={cat} bg="light" text="dark" className="px-3 py-2">
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Description */}
          {boutique.description_boutique && (
            <div className="mt-4">
              <h5 className="mb-3">À propos de cette boutique</h5>
              <p className="text-muted" style={{ whiteSpace: 'pre-line' }}>
                {boutique.description_boutique}
              </p>
            </div>
          )}
          
          {/* Contact Info */}
          <div className="row mt-4">
            <div className="col-md-6">
              <h5 className="mb-3">Informations de contact</h5>
              <ul className="list-unstyled">
                {boutique.proprietaire?.nom && (
                  <li className="mb-2">
                    <strong>Propriétaire:</strong> {boutique.proprietaire.nom}
                  </li>
                )}
                {boutique.proprietaire?.email && (
                  <li className="mb-2">
                    <FaEnvelope className="me-2 text-primary" />
                    {boutique.proprietaire.email}
                  </li>
                )}
                {boutique.proprietaire?.telephone && (
                  <li className="mb-2">
                    <FaPhone className="me-2 text-primary" />
                    {formatPhone(boutique.proprietaire.telephone)}
                  </li>
                )}
                {boutique.proprietaire?.wilaya && (
                  <li className="mb-2">
                    <FaMapMarkerAlt className="me-2 text-primary" />
                    {boutique.proprietaire.wilaya}
                    {boutique.proprietaire.adresse && `, ${boutique.proprietaire.adresse}`}
                  </li>
                )}
              </ul>
            </div>
            
            <div className="col-md-6">
              {renderSocialLinks()}
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };
  
  // Loading state
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement de la boutique...</p>
      </Container>
    );
  }
  
  // Error state
  if (error || !boutique) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h4 className="alert-heading">
            <FaStore className="me-2" />
            Boutique non trouvée
          </h4>
          <p>{error || 'Cette boutique n\'existe pas ou a été supprimée.'}</p>
          <hr />
          <div className="d-flex justify-content-between">
            <Link to="/" className="btn btn-outline-primary">
              Retour à l'accueil
            </Link>
            <Link to="/boutiques" className="btn btn-primary">
              Voir toutes les boutiques
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }
  
  // Check if boutique is active
  if (boutique.status !== 'active') {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <h4 className="alert-heading">
            <FaStore className="me-2" />
            Boutique non disponible
          </h4>
          <p>
            Cette boutique est actuellement {boutique.status}. 
            Elle sera visible une fois activée par l'administrateur.
          </p>
        </Alert>
        
        {renderBoutiqueInfo()}
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Accueil</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/boutiques">Boutiques</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {boutique.nom_boutique}
          </li>
        </ol>
      </nav>
      
      {/* Boutique Header */}
      {renderBoutiqueInfo()}
      
      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="products" title="Produits">
          <div className="mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3>
                <FaShoppingCart className="me-2" />
                Produits ({products.length})
              </h3>
              {auth.user?._id === boutique.user?._id && (
                <Link 
                  to={`/edit-boutique/${boutique._id}`}
                  className="btn btn-warning"
                >
                  <FaStore className="me-2" />
                  Gérer ma boutique
                </Link>
              )}
            </div>
            
            {renderProducts()}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                <nav aria-label="Products pagination">
                  <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      >
                        Précédent
                      </button>
                    </li>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = currentPage <= 3 
                        ? i + 1 
                        : currentPage >= totalPages - 2
                          ? totalPages - 4 + i
                          : currentPage - 2 + i;
                      
                      if (page < 1 || page > totalPages) return null;
                      
                      return (
                        <li 
                          key={page} 
                          className={`page-item ${currentPage === page ? 'active' : ''}`}
                        >
                          <button 
                            className="page-link"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        </li>
                      );
                    })}
                    
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button 
                        className="page-link"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      >
                        Suivant
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </Tab>
        
        <Tab eventKey="about" title="À propos">
          <div className="mt-4">
            <Card>
              <Card.Body>
                <h4 className="mb-4">À propos de {boutique.nom_boutique}</h4>
                
                {boutique.description_boutique ? (
                  <div className="about-content">
                    <p style={{ whiteSpace: 'pre-line' }}>
                      {boutique.description_boutique}
                    </p>
                  </div>
                ) : (
                  <Alert variant="info">
                    Cette boutique n'a pas encore fourni de description détaillée.
                  </Alert>
                )}
                
                <hr className="my-4" />
                
                <h5 className="mb-3">Informations légales</h5>
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <strong>Date de création:</strong>{' '}
                        {new Date(boutique.createdAt).toLocaleDateString('fr-FR')}
                      </li>
                      <li className="mb-2">
                        <strong>Plan:</strong>{' '}
                        <Badge bg="info">{boutique.plan?.toUpperCase()}</Badge>
                      </li>
                      <li className="mb-2">
                        <strong>Abonnement:</strong> {boutique.duree_abonnement}
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <strong>Statut:</strong> {renderStatusBadge(boutique.status)}
                      </li>
                      {boutique.date_activation && (
                        <li className="mb-2">
                          <strong>Activée le:</strong>{' '}
                          {new Date(boutique.date_activation).toLocaleDateString('fr-FR')}
                        </li>
                      )}
                      {boutique.date_expiration && (
                        <li className="mb-2">
                          <strong>Expire le:</strong>{' '}
                          {new Date(boutique.date_expiration).toLocaleDateString('fr-FR')}
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Tab>
        
        <Tab eventKey="contact" title="Contact">
          <div className="mt-4">
            <Card>
              <Card.Body>
                <h4 className="mb-4">Contactez {boutique.nom_boutique}</h4>
                
                <div className="row">
                  <div className="col-md-6 mb-4">
                    <Card className="h-100">
                      <Card.Body>
                        <h5 className="card-title">
                          <FaEnvelope className="me-2 text-primary" />
                          Envoyer un message
                        </h5>
                        <p className="text-muted">
                          Contactez directement le propriétaire de la boutique
                        </p>
                        <Button 
                          variant="primary" 
                          href={`mailto:${boutique.proprietaire?.email}`}
                        >
                          Envoyer un email
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>
                  
                  <div className="col-md-6 mb-4">
                    <Card className="h-100">
                      <Card.Body>
                        <h5 className="card-title">
                          <FaPhone className="me-2 text-primary" />
                          Appeler
                        </h5>
                        <p className="text-muted">
                          Appelez le propriétaire pour plus d'informations
                        </p>
                        <Button 
                          variant="success" 
                          href={`tel:${boutique.proprietaire?.telephone}`}
                        >
                          Appeler maintenant
                        </Button>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
                
                {/* Contact details */}
                <div className="mt-4">
                  <h5 className="mb-3">Coordonnées</h5>
                  <div className="row">
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        <li className="mb-3">
                          <strong>Nom:</strong><br />
                          {boutique.proprietaire?.nom || 'Non spécifié'}
                        </li>
                        <li className="mb-3">
                          <strong>Email:</strong><br />
                          {boutique.proprietaire?.email || 'Non spécifié'}
                        </li>
                        <li className="mb-3">
                          <strong>Téléphone:</strong><br />
                          {boutique.proprietaire?.telephone 
                            ? formatPhone(boutique.proprietaire.telephone)
                            : 'Non spécifié'
                          }
                        </li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <ul className="list-unstyled">
                        <li className="mb-3">
                          <strong>Localisation:</strong><br />
                          {boutique.proprietaire?.wilaya || 'Non spécifiée'}
                          {boutique.proprietaire?.adresse && (
                            <div className="text-muted small">
                              {boutique.proprietaire.adresse}
                            </div>
                          )}
                        </li>
                        <li className="mb-3">
                          <strong>Heures d'ouverture:</strong><br />
                          <span className="text-muted">Lun - Dim: 9h - 18h</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Tab>
      </Tabs>
      
      {/* Call to Action */}
      {auth.user?._id !== boutique.user?._id && (
        <Card className="text-center mt-5 border-primary">
          <Card.Body className="py-4">
            <h4 className="mb-3">
              <FaHeart className="text-danger me-2" />
              Aimez-vous cette boutique ?
            </h4>
            <p className="mb-4">
              Suivez cette boutique pour être informé des nouveaux produits et promotions.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Button variant="primary" size="lg">
                <FaHeart className="me-2" />
                Suivre la boutique
              </Button>
              <Button variant="outline-primary" size="lg">
                <FaShareAlt className="me-2" />
                Partager
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
      
      {/* Styles */}
      <style jsx>{`
        .logo-placeholder {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #dee2e6;
          color: #6c757d;
        }
        
        .boutique-stats {
          display: flex;
          gap: 20px;
        }
        
        .stat-item {
          text-align: center;
        }
        
        .stat-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: #0d6efd;
        }
        
        .product-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid #dee2e6;
        }
        
        .product-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        
        .about-content {
          line-height: 1.8;
          font-size: 1.1rem;
        }
        
        @media (max-width: 768px) {
          .boutique-stats {
            justify-content: center;
            margin-top: 20px;
          }
          
          .stat-item {
            flex: 1;
          }
          
          .stat-number {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </Container>
  );
};

export default BoutiquePage;