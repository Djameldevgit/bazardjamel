import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Tab, Nav } from 'react-bootstrap';

const BoutiquePage = () => {
  const { domaine } = useParams();
  const [boutique, setBoutique] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchBoutiqueData();
  }, [domaine]);
  
  const fetchBoutiqueData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/boutique/domaine/${domaine}`);
      const data = await res.json();
      
      setBoutique(data.boutique);
      setProducts(data.produits || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div>Chargement...</div>;
  if (!boutique) return <div>Boutique non trouvée</div>;
  
  return (
    <Container className="py-4">
      {/* Header de la boutique */}
      <Row className="mb-4">
        <Col md={3}>
          <Card>
            <Card.Img 
              variant="top" 
              src={boutique.logo?.url || '/default-store.png'}
              style={{ height: '200px', objectFit: 'contain' }}
            />
          </Card>
        </Col>
        <Col md={9}>
          <h1>{boutique.nom_boutique}</h1>
          <p className="lead">{boutique.slogan_boutique}</p>
          <p>{boutique.description_boutique}</p>
          
          <div className="mt-3">
            <Button variant="primary" className="me-2">
              <i className="fas fa-shopping-cart me-1"></i> Voir les produits
            </Button>
            <Button variant="outline-secondary">
              <i className="fas fa-heart me-1"></i> Suivre
            </Button>
          </div>
        </Col>
      </Row>
      
      {/* Navigation tabs */}
      <Tab.Container defaultActiveKey="products">
        <Nav variant="tabs" className="mb-3">
          <Nav.Item>
            <Nav.Link eventKey="products">Produits ({products.length})</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="about">À propos</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="contact">Contact</Nav.Link>
          </Nav.Item>
        </Nav>
        
        <Tab.Content>
          <Tab.Pane eventKey="products">
            <Row>
              {products.map(product => (
                <Col md={3} key={product._id} className="mb-3">
                  {/* Card de producto */}
                  <Card>
                    <Card.Img variant="top" src={product.images?.[0]?.url} />
                    <Card.Body>
                      <Card.Title>{product.title}</Card.Title>
                      <Card.Text>{product.price} DA</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tab.Pane>
          
          <Tab.Pane eventKey="about">
            <Card>
              <Card.Body>
                <h4>À propos de {boutique.nom_boutique}</h4>
                <p>{boutique.description_boutique}</p>
                
                <h5 className="mt-4">Informations du propriétaire</h5>
                <p><strong>Nom:</strong> {boutique.proprietaire.nom}</p>
                <p><strong>Téléphone:</strong> {boutique.proprietaire.telephone}</p>
                <p><strong>Email:</strong> {boutique.proprietaire.email}</p>
                
                <h5 className="mt-4">Réseaux sociaux</h5>
                <div>
                  {boutique.reseaux_sociaux.facebook && (
                    <a href={boutique.reseaux_sociaux.facebook} className="me-3">
                      <i className="fab fa-facebook fa-2x text-primary"></i>
                    </a>
                  )}
                  {boutique.reseaux_sociaux.instagram && (
                    <a href={boutique.reseaux_sociaux.instagram} className="me-3">
                      <i className="fab fa-instagram fa-2x text-danger"></i>
                    </a>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Tab.Pane>
          
          <Tab.Pane eventKey="contact">
            <Card>
              <Card.Body>
                <h4>Contacter {boutique.nom_boutique}</h4>
                <form>
                  <div className="mb-3">
                    <label className="form-label">Votre nom</label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Votre email</label>
                    <input type="email" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Message</label>
                    <textarea className="form-control" rows="4"></textarea>
                  </div>
                  <Button variant="primary">Envoyer le message</Button>
                </form>
              </Card.Body>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
  );
};

export default BoutiquePage;