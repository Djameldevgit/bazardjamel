import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BoutiquesListPage = () => {
  const [boutiques, setBoutiques] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchBoutiques();
    fetchCategories();
  }, [selectedCategory]);
  
  const fetchBoutiques = async () => {
    try {
      setLoading(true);
      let url = '/api/boutiques?status=active';
      if (selectedCategory) {
        url += `&category=${selectedCategory}`;
      }
      
      const res = await fetch(url);
      const data = await res.json();
      setBoutiques(data.boutiques || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories/boutiques');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Error:', err);
    }
  };
  
  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="fas fa-store me-2"></i>
          Nos Boutiques
        </h1>
        <Button variant="primary" as={Link} to="/create-boutique">
          <i className="fas fa-plus me-1"></i> Créer une boutique
        </Button>
      </div>
      
      {/* Filtros */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group>
                <Form.Label>Filtrer par catégorie</Form.Label>
                <Form.Select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Lista de boutiques */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : boutiques.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-store fa-3x text-muted mb-3"></i>
          <h4>Aucune boutique trouvée</h4>
          <p>Soyez le premier à créer une boutique!</p>
          <Button variant="primary" as={Link} to="/create-boutique">
            Créer une boutique
          </Button>
        </div>
      ) : (
        <Row>
          {boutiques.map(boutique => (
            <Col md={4} lg={3} key={boutique._id} className="mb-4">
              <Card className="h-100 boutique-card">
                <Card.Img 
                  variant="top" 
                  src={boutique.logo?.url || '/default-store.png'}
                  style={{ height: '150px', objectFit: 'contain' }}
                />
                <Card.Body>
                  <Card.Title className="text-truncate">
                    {boutique.nom_boutique}
                  </Card.Title>
                  <Card.Text className="text-muted small">
                    {boutique.slogan_boutique || 
                     boutique.description_boutique?.substring(0, 80)}
                    {boutique.description_boutique?.length > 80 && '...'}
                  </Card.Text>
                  
                  <div className="mb-2">
                    {boutique.categories_produits?.slice(0, 2).map((cat, idx) => (
                      <span key={idx} className="badge bg-light text-dark me-1">
                        {cat}
                      </span>
                    ))}
                  </div>
                </Card.Body>
                <Card.Footer className="bg-white border-top-0">
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    as={Link}
                    to={`/boutique/${boutique.domaine_boutique}`}
                    className="w-100"
                  >
                    Visiter la boutique
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default BoutiquesListPage;