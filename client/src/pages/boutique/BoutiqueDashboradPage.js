// 📂 src/pages/boutique/BoutiqueDashboardPage.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner, ProgressBar, Table, Dropdown, Form } from 'react-bootstrap';
import { useParams, Link, useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { 
  FaStore, FaChartLine, FaBox, FaEye, FaShoppingCart, FaUsers, 
  FaMoneyBillWave, FaCog, FaEdit, FaTrash, FaPlus, FaFilter,
  FaCalendarAlt, FaArrowUp, FaArrowDown, FaBell
} from 'react-icons/fa';
 
const BoutiqueDashboardPage = () => {
  const { id } = useParams();
  const navigate = useHistory();
  const { auth } = useSelector(state => state);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [boutique, setBoutique] = useState(null);
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [dateRange, setDateRange] = useState([new Date(), new Date()]);
  const [startDate, endDate] = dateRange;
  
  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch boutique info
        const boutiqueRes = await axios.get(`/api/boutique/${id}`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        setBoutique(boutiqueRes.data.boutique);
        
        // Fetch dashboard stats
        const statsRes = await axios.get(`/api/boutique/${id}/dashboard/stats`, {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        setStats(statsRes.data);
        
        // Fetch recent products
        const productsRes = await axios.get(`/api/boutique/${id}/products`, {
          params: { limit: 5, sort: '-createdAt' },
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        setProducts(productsRes.data.products || []);
        
        // Fetch recent orders (if any order system)
        try {
          const ordersRes = await axios.get(`/api/boutique/${id}/orders`, {
            params: { limit: 5 },
            headers: { Authorization: `Bearer ${auth.token}` }
          });
          setOrders(ordersRes.data.orders || []);
        } catch (orderErr) {
          console.log('No order system available');
        }
        
      } catch (err) {
        console.error('Error fetching dashboard:', err);
        setError(err.response?.data?.msg || 'Erreur de chargement du dashboard');
        
        // Redirect if not authorized
        if (err.response?.status === 403 || err.response?.status === 401) {
          navigate('/profile/boutiques');
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (id && auth.token) {
      fetchDashboardData();
    }
  }, [id, auth.token, navigate]);
  
  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return;
    }
    
    try {
      await axios.delete(`/api/posts/${productId}`, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      
      // Update products list
      setProducts(prev => prev.filter(p => p._id !== productId));
      
      // Update stats
      setStats(prev => ({
        ...prev,
        totalProducts: prev.totalProducts - 1
      }));
      
    } catch (err) {
      console.error('Error deleting product:', err);
      alert('Erreur lors de la suppression');
    }
  };
  
  // Handle toggle product status
  const handleToggleProductStatus = async (productId, currentStatus) => {
    try {
      await axios.put(`/api/posts/${productId}`, {
        postData: { isActive: !currentStatus }
      }, {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      
      // Update local state
      setProducts(prev => prev.map(p => 
        p._id === productId ? { ...p, isActive: !currentStatus } : p
      ));
      
    } catch (err) {
      console.error('Error toggling product status:', err);
    }
  };
  
  // Render stat card
  const renderStatCard = (title, value, icon, color, change = null) => {
    return (
      <Card className="stat-card h-100">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="text-muted mb-2">{title}</h6>
              <h3 className="mb-0">{value}</h3>
              {change && (
                <div className={`mt-2 ${change >= 0 ? 'text-success' : 'text-danger'}`}>
                  {change >= 0 ? <FaArrowUp /> : <FaArrowDown />}
                  {Math.abs(change)}% vs période précédente
                </div>
              )}
            </div>
            <div className={`icon-container bg-${color}-light`}>
              {icon}
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };
  
  // Render product table row
  const renderProductRow = (product) => {
    return (
      <tr key={product._id}>
        <td>
          <div className="d-flex align-items-center">
            {product.images?.[0]?.url ? (
              <img 
                src={product.images[0].url} 
                alt={product.title}
                width="40"
                height="40"
                className="rounded me-2"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="bg-light rounded me-2" style={{ width: 40, height: 40 }}></div>
            )}
            <div>
              <div className="fw-medium">{product.title}</div>
              <small className="text-muted">
                {new Date(product.createdAt).toLocaleDateString('fr-FR')}
              </small>
            </div>
          </div>
        </td>
        <td>
          <Badge bg={product.etat === 'neuf' ? 'success' : 'warning'}>
            {product.etat || 'Occasion'}
          </Badge>
        </td>
        <td className="fw-bold">{product.price?.toLocaleString()} DA</td>
        <td>
          <Badge bg={product.isActive ? 'success' : 'secondary'}>
            {product.isActive ? 'Actif' : 'Inactif'}
          </Badge>
        </td>
        <td>
          <div className="d-flex gap-2">
            <Link 
              to={`/post/${product._id}`}
              className="btn btn-sm btn-outline-primary"
            >
              Voir
            </Link>
            <Link 
              to={`/editer-annonce/${product._id}`}
              className="btn btn-sm btn-outline-warning"
            >
              Modifier
            </Link>
            <Button
              variant="outline-danger"
              size="sm"
              onClick={() => handleDeleteProduct(product._id)}
            >
              Supprimer
            </Button>
          </div>
        </td>
      </tr>
    );
  };
  
  // Loading state
  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement du dashboard...</p>
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
            Dashboard non disponible
          </h4>
          <p>{error || 'Boutique non trouvée'}</p>
          <hr />
          <Link to="/profile/boutiques" className="btn btn-primary">
            Retour à mes boutiques
          </Link>
        </Alert>
      </Container>
    );
  }
  
  return (
    <Container fluid className="py-4">
      {/* Header */}
      <div className="dashboard-header mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h2 mb-2">
              <FaStore className="me-2 text-primary" />
              {boutique.nom_boutique}
            </h1>
            <p className="text-muted mb-0">
              Dashboard • {boutique.domaine_boutique}.monsite.dz
            </p>
          </div>
          
          <div className="d-flex gap-2">
            <Link 
              to={`/boutique/${boutique.domaine_boutique}`}
              className="btn btn-outline-primary"
              target="_blank"
            >
              <FaEye className="me-2" />
              Voir ma boutique
            </Link>
            <Link 
              to={`/edit-boutique/${boutique._id}`}
              className="btn btn-warning"
            >
              <FaCog className="me-2" />
              Paramètres
            </Link>
          </div>
        </div>
        
        {/* Status and plan info */}
        <div className="d-flex gap-3 mt-3">
          <Badge bg="info" className="px-3 py-2">
            Plan: {boutique.plan?.toUpperCase()}
          </Badge>
          <Badge bg={boutique.status === 'active' ? 'success' : 'warning'} className="px-3 py-2">
            Statut: {boutique.status === 'active' ? 'Actif' : 'En attente'}
          </Badge>
          {boutique.date_expiration && (
            <Badge bg="secondary" className="px-3 py-2">
              <FaCalendarAlt className="me-1" />
              Expire: {new Date(boutique.date_expiration).toLocaleDateString('fr-FR')}
            </Badge>
          )}
        </div>
      </div>
      
      {/* Date Range Filter */}
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="mb-1">
                <FaFilter className="me-2" />
                Filtre par période
              </h6>
              <small className="text-muted">
                Sélectionnez une période pour analyser les performances
              </small>
            </div>
            <div className="d-flex align-items-center gap-2">
            
              <Button variant="primary">
                Appliquer
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>
      
      {/* Stats Grid */}
      <Row className="g-4 mb-4">
        <Col xs={12} md={6} lg={3}>
          {renderStatCard(
            'Produits',
            stats.totalProducts || 0,
            <FaBox className="text-primary" size={20} />,
            'primary',
            stats.productsChange || 0
          )}
        </Col>
        <Col xs={12} md={6} lg={3}>
          {renderStatCard(
            'Vues totales',
            stats.totalViews?.toLocaleString() || '0',
            <FaEye className="text-success" size={20} />,
            'success',
            stats.viewsChange || 0
          )}
        </Col>
        <Col xs={12} md={6} lg={3}>
          {renderStatCard(
            'Produits vendus',
            stats.totalSales || '0',
            <FaShoppingCart className="text-warning" size={20} />,
            'warning',
            stats.salesChange || 0
          )}
        </Col>
        <Col xs={12} md={6} lg={3}>
          {renderStatCard(
            'Chiffre d\'affaires',
            `${stats.totalRevenue?.toLocaleString() || '0'} DA`,
            <FaMoneyBillWave className="text-danger" size={20} />,
            'danger',
            stats.revenueChange || 0
          )}
        </Col>
      </Row>
      
      {/* Quick Actions */}
      <Row className="g-4 mb-4">
        <Col xs={12}>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                  <FaBell className="me-2 text-primary" />
                  Actions rapides
                </h5>
              </div>
              <Row>
                <Col xs={6} md={3}>
                  <Card className="text-center action-card">
                    <Card.Body>
                      <div className="action-icon mb-3">
                        <FaPlus size={30} className="text-primary" />
                      </div>
                      <h6>Ajouter un produit</h6>
                      <Link to="/creer-annonce" className="btn btn-primary btn-sm mt-2">
                        Créer maintenant
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={6} md={3}>
                  <Card className="text-center action-card">
                    <Card.Body>
                      <div className="action-icon mb-3">
                        <FaEdit size={30} className="text-warning" />
                      </div>
                      <h6>Modifier la boutique</h6>
                      <Link 
                        to={`/edit-boutique/${boutique._id}`}
                        className="btn btn-warning btn-sm mt-2"
                      >
                        Modifier
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={6} md={3}>
                  <Card className="text-center action-card">
                    <Card.Body>
                      <div className="action-icon mb-3">
                        <FaChartLine size={30} className="text-success" />
                      </div>
                      <h6>Statistiques détaillées</h6>
                      <Button variant="success" size="sm" className="mt-2">
                        Voir les stats
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={6} md={3}>
                  <Card className="text-center action-card">
                    <Card.Body>
                      <div className="action-icon mb-3">
                        <FaUsers size={30} className="text-info" />
                      </div>
                      <h6>Clients</h6>
                      <Button variant="info" size="sm" className="mt-2">
                        Gérer les clients
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Main Content */}
      <Row className="g-4">
        {/* Products Table */}
        <Col lg={8}>
          <Card className="h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <FaBox className="me-2" />
                Produits récents
              </h5>
              <Link to={`/boutique/${boutique._id}/products`} className="btn btn-sm btn-primary">
                Voir tous
              </Link>
            </Card.Header>
            <Card.Body>
              {products.length === 0 ? (
                <div className="text-center py-4">
                  <FaBox className="display-1 text-muted mb-3" />
                  <h5>Aucun produit</h5>
                  <p className="text-muted">
                    Commencez par ajouter des produits à votre boutique
                  </p>
                  <Link to="/creer-annonce" className="btn btn-primary">
                    <FaPlus className="me-2" />
                    Ajouter un produit
                  </Link>
                </div>
              ) : (
                <Table responsive hover>
                  <thead>
                    <tr>
                      <th>Produit</th>
                      <th>État</th>
                      <th>Prix</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(renderProductRow)}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        {/* Sidebar */}
        <Col lg={4}>
          {/* Plan Usage */}
          <Card className="mb-4">
            <Card.Header>
              <h6 className="mb-0">Utilisation du plan</h6>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small>Produits</small>
                  <small>
                    {stats.totalProducts || 0} / {boutique.plan === 'gratuit' ? 10 : 
                     boutique.plan === 'basique' ? 50 : 
                     boutique.plan === 'premium' ? 200 : 1000}
                  </small>
                </div>
                <ProgressBar 
                  variant="primary" 
                  now={(stats.totalProducts || 0) / (boutique.plan === 'gratuit' ? 10 : 
                    boutique.plan === 'basique' ? 50 : 
                    boutique.plan === 'premium' ? 200 : 1000) * 100}
                />
              </div>
              
              <div className="mb-3">
                <div className="d-flex justify-content-between mb-1">
                  <small>Stockage</small>
                  <small>75 / {boutique.plan === 'gratuit' ? '100' : 
                    boutique.plan === 'basique' ? '1' : 
                    boutique.plan === 'premium' ? '5' : '20'} GB</small>
                </div>
                <ProgressBar variant="success" now={75} />
              </div>
              
              <div className="text-center mt-3">
                <Button variant="outline-primary" size="sm">
                  Mettre à niveau le plan
                </Button>
              </div>
            </Card.Body>
          </Card>
          
          {/* Recent Activity */}
          <Card>
            <Card.Header>
              <h6 className="mb-0">Activité récente</h6>
            </Card.Header>
            <Card.Body>
              <div className="activity-timeline">
                {[
                  { type: 'view', text: 'Votre boutique a été vue 15 fois', time: 'Il y a 2 heures' },
                  { type: 'sale', text: 'Nouvelle vente: Produit #123', time: 'Il y a 4 heures' },
                  { type: 'product', text: 'Produit ajouté: iPhone 13', time: 'Il y a 1 jour' },
                  { type: 'update', text: 'Boutique mise à jour', time: 'Il y a 2 jours' }
                ].map((activity, idx) => (
                  <div key={idx} className="activity-item d-flex mb-3">
                    <div className="activity-icon me-3">
                      {activity.type === 'view' && <FaEye className="text-primary" />}
                      {activity.type === 'sale' && <FaShoppingCart className="text-success" />}
                      {activity.type === 'product' && <FaBox className="text-warning" />}
                      {activity.type === 'update' && <FaEdit className="text-info" />}
                    </div>
                    <div className="flex-grow-1">
                      <p className="mb-0">{activity.text}</p>
                      <small className="text-muted">{activity.time}</small>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
          
          {/* Quick Stats */}
          <Card className="mt-4">
            <Card.Body>
              <h6 className="mb-3">Statistiques du jour</h6>
              <Row>
                <Col xs={6}>
                  <div className="text-center p-2">
                    <div className="h4 mb-1 text-primary">{stats.todayViews || 0}</div>
                    <small className="text-muted">Vues</small>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="text-center p-2">
                    <div className="h4 mb-1 text-success">{stats.todaySales || 0}</div>
                    <small className="text-muted">Ventes</small>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="text-center p-2">
                    <div className="h4 mb-1 text-warning">{stats.todayProducts || 0}</div>
                    <small className="text-muted">Nouveaux produits</small>
                  </div>
                </Col>
                <Col xs={6}>
                  <div className="text-center p-2">
                    <div className="h4 mb-1 text-info">{stats.todayRevenue || 0} DA</div>
                    <small className="text-muted">Chiffre d'affaires</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Export Data */}
      <Card className="mt-4">
        <Card.Body className="text-center">
          <h5 className="mb-3">Exporter les données</h5>
          <p className="text-muted mb-4">
            Téléchargez vos données de vente, produits et statistiques
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Button variant="outline-primary">
              <FaChartLine className="me-2" />
              Exporter les statistiques
            </Button>
            <Button variant="outline-success">
              <FaBox className="me-2" />
              Exporter les produits
            </Button>
            <Button variant="outline-warning">
              <FaMoneyBillWave className="me-2" />
              Exporter les ventes
            </Button>
          </div>
        </Card.Body>
      </Card>
      
      {/* Styles */}
      <style jsx>{`
        .dashboard-header {
          padding: 20px;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
          border-radius: 10px;
          border: 1px solid #dee2e6;
        }
        
        .stat-card {
          transition: transform 0.3s ease;
          border: none;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .stat-card:hover {
          transform: translateY(-5px);
        }
        
        .icon-container {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .bg-primary-light {
          background: rgba(13, 110, 253, 0.1);
        }
        
        .bg-success-light {
          background: rgba(25, 135, 84, 0.1);
        }
        
        .bg-warning-light {
          background: rgba(255, 193, 7, 0.1);
        }
        
        .bg-danger-light {
          background: rgba(220, 53, 69, 0.1);
        }
        
        .action-card {
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        
        .action-card:hover {
          border-color: #0d6efd;
          transform: translateY(-3px);
        }
        
        .action-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
        }
        
        .activity-item {
          padding-bottom: 15px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .activity-item:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        
        .activity-icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #f8f9fa;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        @media (max-width: 768px) {
          .dashboard-header {
            padding: 15px;
          }
          
          .action-card {
            margin-bottom: 15px;
          }
        }
      `}</style>
    </Container>
  );
};

export default BoutiqueDashboardPage;