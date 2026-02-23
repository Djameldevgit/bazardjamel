// BoutiquesCategoryPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const BoutiquesCategoryPage = () => {
  const { categorySlug } = useParams();
  const [boutiques, setBoutiques] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchBoutiquesByCategory();
  }, [categorySlug]);
  
  const fetchBoutiquesByCategory = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/boutiques/category/${categorySlug}`);
      const data = await res.json();
      
      setBoutiques(data.boutiques);
      setCategory(data.category);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) return <div>Chargement...</div>;
  
  return (
    <Container className="py-4">
      <h1 className="mb-4">
        <i className="fas fa-store me-2"></i>
        {category?.name || 'Boutiques'}
      </h1>
      
      {boutiques.length === 0 ? (
        <div className="text-center py-5">
          <i className="fas fa-store fa-3x text-muted mb-3"></i>
          <h4>Aucune boutique dans cette catégorie</h4>
          <p>Soyez le premier à créer une boutique dans cette catégorie!</p>
          <Button variant="primary" href="/create-boutique">
            Créer une boutique
          </Button>
        </div>
      ) : (
        <Row>
          {boutiques.map(boutique => (
            <Col md={4} lg={3} key={boutique._id} className="mb-4">
              <Card className="h-100">
                <Card.Img 
                  variant="top" 
                  src={boutique.logo?.url || '/default-store.png'}
                  style={{ height: '150px', objectFit: 'contain' }}
                />
                <Card.Body>
                  <Card.Title>{boutique.nom_boutique}</Card.Title>
                  <Card.Text className="text-muted small">
                    {boutique.description_boutique?.substring(0, 100)}...
                  </Card.Text>
                  <div className="mt-2">
                    {boutique.categories_produits.map(cat => (
                      <span key={cat} className="badge bg-secondary me-1">
                        {cat}
                      </span>
                    ))}
                  </div>
                </Card.Body>
                <Card.Footer>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    href={`/boutique/${boutique.domaine_boutique}`}
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

export default BoutiquesCategoryPage;