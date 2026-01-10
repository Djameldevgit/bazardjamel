// 📂 src/pages/boutique/UserBoutiquesPage.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, Modal, Form, Tab, Tabs } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { 
 
  FaStore, FaPlus, FaEdit, FaTrash, FaEye, FaChartLine, 
  FaCog, FaShoppingCart, FaCalendarAlt, FaExclamationTriangle,
  FaCheckCircle, FaTimesCircle, FaFilter, FaSearch
} from 'react-icons/fa';

const UserBoutiquesPage = () => {
  const history = useHistory();
  const { auth } = useSelector(state => state);
  
  const [loading, setLoading] = useState(true);
  const [boutiques, setBoutiques] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [boutiqueToDelete, setBoutiqueToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  
  // Fetch user boutiques
  useEffect(() => {
    const fetchUserBoutiques = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/user/boutiques', {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        setBoutiques(response.data.boutiques || []);
      } catch (err) {
        console.error('Error fetching boutiques:', err);
        setError('Erreur lors du chargement de vos boutiques');
      } finally {
        setLoading(false);
      }
    };
    
    if (auth.token) {
      fetchUserBoutiques();
    }
  }, [auth.token]);
  
  // Filter boutiques
  const filteredBoutiques = boutiques.filter(boutique => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      boutique.nom_boutique.toLowerCase().includes(searchTerm.toLowerCase()) ||
      boutique.domaine_boutique.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || boutique.status === statusFilter;
    
    // Tab filter
    const matchesTab = activeTab === 'all' || 
      (activeTab === 'active' && boutique.status === 'active') ||
      (activeTab === 'pending' && boutique.status === 'pending') ||
      (activeTab === 'expired' && (boutique.status === 'expired' || boutique.status === 'cancelled'));
    
    return matchesSearch && matchesStatus && matchesTab;
  });
  
  // Handle delete boutique
  const handleDeleteBoutique = async () => {
    try {
      await axios.delete(`/api/boutique/${boutiqueToDelete._id}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      
      // Remove from state
      setBoutiques(prev => prev.filter(b => b._id !== boutiqueToDelete._id));
      
      // Close modal
      setShowDeleteModal(false);
      setBoutiqueToDelete(null);
      
    } catch (err) {
      console.error('Error deleting boutique:', err);
      alert('Erreur lors de la suppression de la boutique');
    }
  };
  
  // Handle change boutique status
  const handleChangeStatus = async (boutiqueId, newStatus) => {
    try {
      await axios.put(`/api/boutique/${boutiqueId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      
      // Update local state
      setBoutiques(prev => prev.map(b => 
        b._id === boutiqueId ? { ...b, status: newStatus } : b
      ));
      
    } catch (err) {
      console.error('Error changing status:', err);
      alert('Erreur lors du changement de statut');
    }
  };
  
  // Render status badge
  const renderStatusBadge = (status) => {
    const statusConfig = {
      'active': { variant: 'success', icon: <FaCheckCircle />, label: 'Active' },
      'pending': { variant: 'warning', icon: <FaExclamationTriangle />, label: 'En attente' },
      'suspended': { variant: 'danger', icon: <FaTimesCircle />, label: 'Suspendue' },
      'expired': { variant: 'secondary', icon: <FaCalendarAlt />, label: 'Expirée' },
      'cancelled': { variant: 'dark', icon: <FaTimesCircle />, label: 'Annulée' }
    };
    
    const config = statusConfig[status] || { variant: 'light', label: status };
    
    return (
      <Badge bg={config.variant} className="d-flex align-items-center gap-1">
        {config.icon} {config.label}
      </Badge>
    );
  };
  
  // Render plan badge
  const renderPlanBadge = (plan) => {
    const planColors = {
      'gratuit': 'secondary',
      'basique': 'info',
      'premium': 'primary',
      'entreprise': 'success'
    };
    
    return (
      <Badge bg={planColors[plan] || 'light'} text="dark">
        {plan?.toUpperCase() || 'GRATUIT'}
      </Badge>
    );
  };
  
  // Render boutique card
  const renderBoutiqueCard = (boutique) => {
    const isExpired = boutique.status === 'expired' || boutique.status === 'cancelled';
    const isPending = boutique.status === 'pending';
    
    return (
      <Col key={boutique._id} xs={12} md={6} lg={4} className="mb-4">
        <Card className={`boutique-card h-100 ${isExpired ? 'border-secondary' : ''}`}>
          {/* Card Header */}
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              {boutique.logo?.url ? (
                <img 
                  src={boutique.logo.url} 
                  alt={boutique.nom_boutique}
                  width="40"
                  height="40"
                  className="rounded-circle me-2"
                  style={{ objectFit: 'cover' }}
                />
              ) : (
                <div className="logo-placeholder me-2">
                  <FaStore />
                </div>
              )}
              <div>
                <h6 className="mb-0">{boutique.nom_boutique}</h6>
                <small className="text-muted">{boutique.domaine_boutique}.monsite.dz</small>
              </div>
            </div>
            {renderStatusBadge(boutique.status)}
          </Card.Header>
          
          {/* Card Body */}
          <Card.Body>
            <div className="mb-3">
              <p className="text-muted mb-2">
                {boutique.slogan_boutique || 'Aucun slogan défini'}
              </p>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {renderPlanBadge(boutique.plan)}
                <Badge bg="light" text="dark">
                  {boutique.duree_abonnement || '1 mois'}
                </Badge>
              </div>
            </div>
            
            {/* Stats */}
            <div className="boutique-stats mb-4">
              <Row>
                <Col xs={4} className="text-center">
                  <div className="stat-number">{boutique.produits_count || 0}</div>
                  <small className="text-muted">Produits</small>
                </Col>
                <Col xs={4} className="text-center">
                  <div className="stat-number">{boutique.vues || 0}</div>
                  <small className="text-muted">Vues</small>
                </Col>
                <Col xs={4} className="text-center">
                  <div className="stat-number">
                    {boutique.note_moyenne?.toFixed(1) || '0.0'}
                  </div>
                  <small className="text-muted">Note</small>
                </Col>
              </Row>
            </div>
            
            {/* Dates */}
            {boutique.date_expiration && (
              <div className="alert alert-light border small mb-0">
                <FaCalendarAlt className="me-2" />
                Expire le: {new Date(boutique.date_expiration).toLocaleDateString('fr-FR')}
              </div>
            )}
          </Card.Body>
          
          {/* Card Footer */}
          <Card.Footer className="bg-white">
            <div className="d-flex justify-content-between">
              <div className="d-flex gap-2">
                <Link 
                  to={`/boutique/${boutique.domaine_boutique}`}
                  className="btn btn-sm btn-outline-primary"
                  target="_blank"
                >
                  <FaEye />
                </Link>
                <Link 
                  to={`/boutique/${boutique._id}/dashboard`}
                  className="btn btn-sm btn-outline-success"
                >
                  <FaChartLine />
                </Link>
              </div>
              
              <div className="d-flex gap-2">
                {boutique.status === 'pending' && auth.user?.role === 'admin' && (
                  <Button
                    variant="outline-success"
                    size="sm"
                    onClick={() => handleChangeStatus(boutique._id, 'active')}
                  >
                    Activer
                  </Button>
                )}
                
                <Link 
                  to={`/edit-boutique/${boutique._id}`}
                  className="btn btn-sm btn-warning"
                >
                  <FaEdit />
                </Link>
                
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => {
                    setBoutiqueToDelete(boutique);
                    setShowDeleteModal(true);
                  }}
                >
                  <FaTrash />
                </Button>
              </div>
            </div>
          </Card.Footer>
        </Card>
      </Col>
    );
  };
  
  // Render empty state
  const renderEmptyState = () => {
    return (
      <Col xs={12}>
        <Card className="text-center py-5">
          <Card.Body>
            <FaStore className="display-1 text-muted mb-3" />
            <h3>Aucune boutique trouvée</h3>
            <p className="text-muted mb-4">
              {filteredBoutiques.length === 0 && boutiques.length > 0
                ? 'Aucune boutique ne correspond à vos filtres'
                : 'Créez votre première boutique pour vendre vos produits en ligne'
              }
            </p>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => history('/create-boutique')}
            >
              <FaPlus className="me-2" />
              Créer une boutique
            </Button>
          </Card.Body>
        </Card>
      </Col>
    );
  };
  
  // Loading state
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement de vos boutiques...</p>
      </Container>
    );
  }
  
  return (
    <Container className="py-4">
      {/* Header */}
      <div className="page-header mb-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 className="h2 mb-2">
              <FaStore className="me-2 text-primary" />
              Mes boutiques
            </h1>
            <p className="text-muted mb-0">
              Gérez toutes vos boutiques en ligne au même endroit
            </p>
          </div>
          <Button 
            variant="primary"
            onClick={() => history('/create-boutique')}
          >
            <FaPlus className="me-2" />
            Nouvelle boutique
          </Button>
        </div>
        
        {/* Stats Summary */}
        <Row className="g-3 mb-4">
          <Col xs={6} md={3}>
            <Card className="stat-summary-card">
              <Card.Body className="text-center">
                <div className="h4 mb-0 text-primary">{boutiques.length}</div>
                <small className="text-muted">Total boutiques</small>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className="stat-summary-card">
              <Card.Body className="text-center">
                <div className="h4 mb-0 text-success">
                  {boutiques.filter(b => b.status === 'active').length}
                </div>
                <small className="text-muted">Actives</small>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className="stat-summary-card">
              <Card.Body className="text-center">
                <div className="h4 mb-0 text-warning">
                  {boutiques.filter(b => b.status === 'pending').length}
                </div>
                <small className="text-muted">En attente</small>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={6} md={3}>
            <Card className="stat-summary-card">
              <Card.Body className="text-center">
                <div className="h4 mb-0 text-danger">
                  {boutiques.filter(b => b.status === 'expired' || b.status === 'cancelled').length}
                </div>
                <small className="text-muted">Expirées</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
      
      {/* Error message */}
      {error && (
        <Alert variant="danger" className="mb-4">
          <FaExclamationTriangle className="me-2" />
          {error}
        </Alert>
      )}
      
      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6}>
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <Form.Control
                  type="text"
                  placeholder="Rechercher une boutique..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </Col>
            <Col md={6}>
              <div className="d-flex gap-2">
                <Form.Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="flex-grow-1"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actives</option>
                  <option value="pending">En attente</option>
                  <option value="expired">Expirées</option>
                  <option value="cancelled">Annulées</option>
                  <option value="suspended">Suspendues</option>
                </Form.Select>
                <Button variant="outline-secondary">
                  <FaFilter className="me-2" />
                  Filtres
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="all" title="Toutes">
          <div className="tab-content">
            {filteredBoutiques.length === 0 ? renderEmptyState() : (
              <Row>
                {filteredBoutiques.map(renderBoutiqueCard)}
              </Row>
            )}
          </div>
        </Tab>
        <Tab eventKey="active" title="Actives">
          <div className="tab-content">
            {boutiques.filter(b => b.status === 'active').length === 0 ? (
              <Alert variant="info" className="text-center">
                <FaStore className="me-2" />
                Vous n'avez pas de boutiques actives
              </Alert>
            ) : (
              <Row>
                {boutiques
                  .filter(b => b.status === 'active')
                  .map(renderBoutiqueCard)}
              </Row>
            )}
          </div>
        </Tab>
        <Tab eventKey="pending" title="En attente">
          <div className="tab-content">
            {boutiques.filter(b => b.status === 'pending').length === 0 ? (
              <Alert variant="info" className="text-center">
                <FaCheckCircle className="me-2" />
                Aucune boutique en attente d'activation
              </Alert>
            ) : (
              <Row>
                {boutiques
                  .filter(b => b.status === 'pending')
                  .map(renderBoutiqueCard)}
              </Row>
            )}
          </div>
        </Tab>
        <Tab eventKey="expired" title="Expirées">
          <div className="tab-content">
            {boutiques.filter(b => b.status === 'expired' || b.status === 'cancelled').length === 0 ? (
              <Alert variant="info" className="text-center">
                <FaCalendarAlt className="me-2" />
                Aucune boutique expirée ou annulée
              </Alert>
            ) : (
              <Row>
                {boutiques
                  .filter(b => b.status === 'expired' || b.status === 'cancelled')
                  .map(renderBoutiqueCard)}
              </Row>
            )}
          </div>
        </Tab>
      </Tabs>
      
      {/* Create CTA */}
      {boutiques.length === 0 && (
        <Card className="text-center border-primary mt-5">
          <Card.Body className="py-5">
            <FaStore className="display-1 text-primary mb-4" />
            <h2 className="mb-3">Créez votre première boutique</h2>
            <p className="text-muted mb-4">
              Vendez vos produits en ligne avec une boutique professionnelle en quelques minutes.
              Aucune connaissance technique requise.
            </p>
            <div className="d-flex justify-content-center gap-3">
              <Button 
                variant="primary" 
                size="lg"
                onClick={() => history('/create-boutique')}
              >
                <FaPlus className="me-2" />
                Créer une boutique
              </Button>
              <Button 
                variant="outline-primary" 
                size="lg"
                onClick={() => window.open('/boutiques', '_blank')}
              >
                <FaEye className="me-2" />
                Voir des exemples
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaExclamationTriangle className="text-danger me-2" />
            Confirmer la suppression
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Êtes-vous sûr de vouloir supprimer la boutique <strong>{boutiqueToDelete?.nom_boutique}</strong> ?</p>
          <Alert variant="danger">
            <strong>Attention:</strong> Cette action est irréversible. Tous les produits associés seront également supprimés.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDeleteBoutique}>
            <FaTrash className="me-2" />
            Supprimer définitivement
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Styles */}
      <style jsx>{`
        .page-header {
          padding: 30px;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border-radius: 10px;
        }
        
        .stat-summary-card {
          border: none;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          transition: transform 0.3s ease;
        }
        
        .stat-summary-card:hover {
          transform: translateY(-3px);
        }
        
        .boutique-card {
          transition: all 0.3s ease;
          border: 1px solid #dee2e6;
        }
        
        .boutique-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
        }
        
        .logo-placeholder {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c757d;
        }
        
        .boutique-stats {
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
        }
        
        .stat-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: #0d6efd;
        }
        
        .tab-content {
          padding: 20px 0;
        }
        
        @media (max-width: 768px) {
          .page-header {
            padding: 20px;
          }
          
          .boutique-card {
            margin-bottom: 20px;
          }
        }
      `}</style>
    </Container>
  );
};

export default UserBoutiquesPage;