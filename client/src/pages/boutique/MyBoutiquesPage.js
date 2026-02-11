import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MyBoutiquesPage = () => {
  const [boutiques, setBoutiques] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchMyBoutiques();
  }, []);
  
  const fetchMyBoutiques = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/boutiques', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      setBoutiques(data.boutiques || []);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { variant: 'warning', label: 'En attente' },
      'active': { variant: 'success', label: 'Active' },
      'suspended': { variant: 'danger', label: 'Suspendue' },
      'expired': { variant: 'secondary', label: 'Expirée' }
    };
    
    const config = statusConfig[status] || { variant: 'light', label: status };
    return <Badge bg={config.variant}>{config.label}</Badge>;
  };
  
  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>
          <i className="fas fa-store me-2"></i>
          Mes Boutiques
        </h1>
        <Button variant="primary" as={Link} to="/create-boutique">
          <i className="fas fa-plus me-1"></i> Créer une nouvelle boutique
        </Button>
      </div>
      
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      ) : boutiques.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <i className="fas fa-store fa-4x text-muted mb-3"></i>
            <h4>Vous n'avez pas encore de boutique</h4>
            <p className="text-muted">
              Créez votre première boutique et commencez à vendre vos produits en ligne
            </p>
            <Button variant="primary" as={Link} to="/create-boutique" size="lg">
              Créer ma première boutique
            </Button>
          </Card.Body>
        </Card>
      ) : (
        <Row>
          <Col md={8}>
            <Card>
              <Card.Body>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>Nom</th>
                      <th>Domaine</th>
                      <th>Statut</th>
                      <th>Produits</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boutiques.map(boutique => (
                      <tr key={boutique._id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img 
                              src={boutique.logo?.url || '/default-store.png'}
                              alt={boutique.nom_boutique}
                              style={{ width: '30px', height: '30px', borderRadius: '4px', marginRight: '10px' }}
                            />
                            <span>{boutique.nom_boutique}</span>
                          </div>
                        </td>
                        <td>{boutique.domaine_boutique}.monsite.dz</td>
                        <td>{getStatusBadge(boutique.status)}</td>
                        <td>{boutique.produits_count || 0}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline-primary"
                              as={Link}
                              to={`/boutique/${boutique.domaine_boutique}`}
                            >
                              <i className="fas fa-eye"></i>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline-success"
                              as={Link}
                              to={`/manage-boutique/${boutique._id}`}
                            >
                              <i className="fas fa-cog"></i>
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline-warning"
                              as={Link}
                              to={`/edit-boutique/${boutique._id}`}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={4}>
            <Card className="mb-3">
              <Card.Body>
                <h5>Statistiques</h5>
                <div className="d-flex justify-content-between mb-2">
                  <span>Boutiques actives:</span>
                  <strong>
                    {boutiques.filter(b => b.status === 'active').length}
                  </strong>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Boutiques en attente:</span>
                  <strong>
                    {boutiques.filter(b => b.status === 'pending').length}
                  </strong>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Total produits:</span>
                  <strong>
                    {boutiques.reduce((total, b) => total + (b.produits_count || 0), 0)}
                  </strong>
                </div>
              </Card.Body>
            </Card>
            
            <Card>
              <Card.Body>
                <h5>Actions rapides</h5>
                <div className="d-grid gap-2">
                  <Button variant="primary" as={Link} to="/create-boutique">
                    <i className="fas fa-plus me-1"></i> Créer une boutique
                  </Button>
                  <Button variant="outline-primary" as={Link} to="/dashboard">
                    <i className="fas fa-tachometer-alt me-1"></i> Tableau de bord
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default MyBoutiquesPage;