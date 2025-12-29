import React, { useEffect } from 'react'
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  Badge
} from 'react-bootstrap'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
 
import { FaStore, FaChartLine, FaBox, FaShoppingCart, FaUsers, FaDollarSign, FaEdit, FaEye } from 'react-icons/fa'
 
const StoreDashboard = () => {
  const { id } = useParams()
  const history = useHistory() // Cambiado de useNavigate a useHistory
  const dispatch = useDispatch()
  
  const { auth } = useSelector(state => state)
  const { currentStore, loading, error } = useSelector(state => state.store || {})

  useEffect(() => {
    if (id && auth?.token) {
      console.log('🔄 Chargement du dashboard pour la boutique ID:', id)
      dispatch(getStoreById({
        id,
        auth: {
          token: auth.token,
          user: auth.user
        }
      }))
    }
  }, [id, auth, dispatch])

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Chargement du tableau de bord...</p>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <FaStore className="me-2" />
          Impossible de charger le tableau de bord
          <div className="mt-2">
            <small>Erreur: {error}</small>
          </div>
          <Button 
            variant="outline-secondary" 
            className="ms-3 mt-2"
            onClick={() => history.push('/my-stores')} // Cambiado
          >
            Retour aux boutiques
          </Button>
        </Alert>
      </Container>
    )
  }

  if (!currentStore) {
    return (
      <Container className="mt-4">
        <Alert variant="warning">
          <FaStore className="me-2" />
          Boutique non trouvée
          <Button 
            variant="outline-primary" 
            className="ms-3"
            onClick={() => history.push('/my-stores')} // Cambiado
          >
            Voir mes boutiques
          </Button>
        </Alert>
      </Container>
    )
  }

  // Función para formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const statsCards = [
    {
      title: 'Vues Total',
      value: currentStore.stats?.totalViews || 0,
      icon: <FaChartLine className="text-primary" size={24} />,
      color: 'primary',
      description: 'Nombre total de vues'
    },
    {
      title: 'Favoris',
      value: currentStore.stats?.totalFavorites || 0,
      icon: <FaUsers className="text-success" size={24} />,
      color: 'success',
      description: 'Ajoutés aux favoris'
    },
    {
      title: 'Produits',
      value: currentStore.stats?.totalProducts || 0,
      icon: <FaBox className="text-warning" size={24} />,
      color: 'warning',
      description: 'Produits en ligne'
    },
    {
      title: 'Limite Produits',
      value: `${currentStore.stats?.totalProducts || 0}/${currentStore.planFeatures?.maxProducts || 10}`,
      icon: <FaDollarSign className="text-info" size={24} />,
      color: 'info',
      description: 'Utilisation de la limite'
    }
  ]

  // Función para calcular el porcentaje de uso
  const calculateUsage = () => {
    const used = currentStore.stats?.totalProducts || 0
    const max = currentStore.planFeatures?.maxProducts || 10
    return Math.round((used / max) * 100)
  }

  return (
    <Container fluid className="px-4 py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h2 mb-1">Tableau de bord</h1>
          <div className="d-flex align-items-center">
            <p className="text-muted mb-0 me-3">
              {currentStore.name}
            </p>
            <Badge bg={currentStore.plan === 'Premium' ? 'warning' : 
                      currentStore.plan === 'Pro' ? 'info' : 'secondary'}>
              Plan {currentStore.plan}
            </Badge>
          </div>
        </div>
        
        <div className="d-flex gap-2">
          <Link to={`/store/${currentStore._id}`}>
            <Button variant="outline-secondary">
              <FaEye className="me-2" />
              Vue boutique
            </Button>
          </Link>
          <Link to={`/store/${currentStore._id}/edit`}>
            <Button variant="primary">
              <FaEdit className="me-2" />
              Modifier
            </Button>
          </Link>
        </div>
      </div>

      {/* Barre de progression pour límite de productos */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
              <strong>Limite de produits</strong>
              <p className="text-muted small mb-0">
                {currentStore.stats?.totalProducts || 0} / {currentStore.planFeatures?.maxProducts || 10} produits utilisés
              </p>
            </div>
            <div className="text-end">
              <span className="fw-bold">{calculateUsage()}%</span>
            </div>
          </div>
          <div className="progress" style={{ height: '10px' }}>
            <div 
              className={`progress-bar bg-${calculateUsage() > 80 ? 'danger' : 'success'}`}
              role="progressbar"
              style={{ width: `${calculateUsage()}%` }}
              aria-valuenow={calculateUsage()}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          {calculateUsage() > 80 && (
            <Alert variant="warning" className="mt-3 small">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Vous approchez de la limite de votre plan. Pensez à mettre à niveau.
            </Alert>
          )}
        </Card.Body>
      </Card>

      {/* Stats Cards */}
      <Row className="mb-4">
        {statsCards.map((stat, index) => (
          <Col key={index} lg={3} md={6} className="mb-3">
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="d-flex align-items-center">
                <div className={`bg-${stat.color}-subtle rounded-circle d-flex align-items-center justify-content-center me-3`}
                     style={{ width: '60px', height: '60px' }}>
                  {stat.icon}
                </div>
                <div>
                  <h3 className="mb-0">{stat.value}</h3>
                  <p className="text-muted mb-0 small">{stat.title}</p>
                  <p className="text-muted mb-0" style={{ fontSize: '0.8rem' }}>
                    {stat.description}
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        {/* Quick Actions */}
        <Col lg={4} md={6} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <FaShoppingCart className="me-2" />
                Actions rapides
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button 
                  variant="outline-primary" 
                  className="text-start d-flex align-items-center"
                  onClick={() => history.push(`/store/${currentStore._id}/products/new`)} // Cambiado
                >
                  <FaBox className="me-2" />
                  <div>
                    <div>Ajouter un produit</div>
                    <small className="text-muted">Créer un nouveau produit</small>
                  </div>
                </Button>
                
                <Button 
                  variant="outline-success" 
                  className="text-start d-flex align-items-center"
                  onClick={() => history.push(`/store/${currentStore._id}/orders`)} // Cambiado
                >
                  <FaShoppingCart className="me-2" />
                  <div>
                    <div>Voir les commandes</div>
                    <small className="text-muted">Gérer les ventes</small>
                  </div>
                </Button>
                
                <Button 
                  variant="outline-info" 
                  className="text-start d-flex align-items-center"
                  onClick={() => history.push(`/store/${currentStore._id}/analytics`)} // Cambiado
                >
                  <FaChartLine className="me-2" />
                  <div>
                    <div>Statistiques</div>
                    <small className="text-muted">Voir les analyses détaillées</small>
                  </div>
                </Button>
                
                <Button 
                  variant="outline-warning" 
                  className="text-start d-flex align-items-center"
                  onClick={() => history.push(`/store/${currentStore._id}/settings`)} // Cambiado
                >
                  <FaEdit className="me-2" />
                  <div>
                    <div>Paramètres</div>
                    <small className="text-muted">Configurer la boutique</small>
                  </div>
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Informations de la boutique */}
        <Col lg={8} className="mb-4">
          <Card className="border-0 shadow-sm h-100">
            <Card.Header>
              <h5 className="mb-0">
                <FaStore className="me-2" />
                Informations de la boutique
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <div className="mb-4">
                    <h6 className="text-muted small text-uppercase mb-2">Nom de la boutique</h6>
                    <p className="fw-bold h5">{currentStore.name}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h6 className="text-muted small text-uppercase mb-2">Catégorie principale</h6>
                    <p className="fw-bold">{currentStore.category}</p>
                  </div>
                  
                  <div className="mb-4">
                    <h6 className="text-muted small text-uppercase mb-2">Description</h6>
                    <p className="text-muted">
                      {currentStore.description || 'Aucune description disponible.'}
                    </p>
                  </div>
                </Col>
                
                <Col md={6}>
                  <div className="mb-4">
                    <h6 className="text-muted small text-uppercase mb-2">Statut</h6>
                    <div className="d-flex gap-2">
                      <Badge bg={currentStore.isActive ? 'success' : 'danger'}>
                        {currentStore.isActive ? 'Actif' : 'Inactif'}
                      </Badge>
                      {currentStore.verified && (
                        <Badge bg="success">
                          <i className="fas fa-check-circle me-1"></i>
                          Vérifié
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h6 className="text-muted small text-uppercase mb-2">Plan actuel</h6>
                    <div>
                      <Badge bg={currentStore.plan === 'Premium' ? 'warning' : 
                                currentStore.plan === 'Pro' ? 'info' : 'secondary'}
                             className="me-2">
                        {currentStore.plan}
                      </Badge>
                      <span className="text-muted small">
                        {currentStore.planFeatures?.maxProducts || 10} produits max
                      </span>
                    </div>
                    <div className="mt-2">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => history.push(`/store/${currentStore._id}/upgrade`)} // Cambiado
                      >
                        <i className="fas fa-arrow-up me-1"></i>
                        Améliorer le plan
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h6 className="text-muted small text-uppercase mb-2">Dates</h6>
                    <div>
                      <div className="small">
                        <strong>Créée:</strong> {formatDate(currentStore.createdAt)}
                      </div>
                      <div className="small">
                        <strong>Mise à jour:</strong> {formatDate(currentStore.updatedAt)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <h6 className="text-muted small text-uppercase mb-2">ID de la boutique</h6>
                    <code className="text-muted small bg-light p-2 rounded d-block">
                      {currentStore._id}
                    </code>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Section pour les fonctionnalités du plan */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Header>
          <h5 className="mb-0">Fonctionnalités de votre plan "{currentStore.plan}"</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <div className="d-flex align-items-center mb-3">
                <div className={`rounded-circle p-2 me-3 ${currentStore.planFeatures?.canPromote ? 'bg-success-subtle' : 'bg-danger-subtle'}`}>
                  <i className={`fas ${currentStore.planFeatures?.canPromote ? 'fa-check text-success' : 'fa-times text-danger'}`}></i>
                </div>
                <div>
                  <h6 className="mb-1">Promotion des produits</h6>
                  <p className="text-muted small mb-0">
                    {currentStore.planFeatures?.canPromote ? 'Activée' : 'Non disponible'}
                  </p>
                </div>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="d-flex align-items-center mb-3">
                <div className={`rounded-circle p-2 me-3 ${currentStore.planFeatures?.analytics ? 'bg-success-subtle' : 'bg-danger-subtle'}`}>
                  <i className={`fas ${currentStore.planFeatures?.analytics ? 'fa-check text-success' : 'fa-times text-danger'}`}></i>
                </div>
                <div>
                  <h6 className="mb-1">Statistiques avancées</h6>
                  <p className="text-muted small mb-0">
                    {currentStore.planFeatures?.analytics ? 'Activées' : 'Basiques seulement'}
                  </p>
                </div>
              </div>
            </Col>
            
            <Col md={4}>
              <div className="d-flex align-items-center mb-3">
                <div className="rounded-circle bg-info-subtle p-2 me-3">
                  <FaBox className="text-info" />
                </div>
                <div>
                  <h6 className="mb-1">Limite de produits</h6>
                  <p className="text-muted small mb-0">
                    {currentStore.planFeatures?.maxProducts || 10} produits maximum
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Informations de contact si disponibles */}
      {(currentStore.phone || currentStore.email || currentStore.address?.city) && (
        <Card className="border-0 shadow-sm">
          <Card.Header>
            <h5 className="mb-0">Informations de contact</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              {currentStore.phone && (
                <Col md={4}>
                  <div className="mb-3">
                    <h6 className="text-muted small text-uppercase mb-2">Téléphone</h6>
                    <p>
                      <i className="fas fa-phone text-primary me-2"></i>
                      {currentStore.phone}
                    </p>
                  </div>
                </Col>
              )}
              
              {currentStore.email && (
                <Col md={4}>
                  <div className="mb-3">
                    <h6 className="text-muted small text-uppercase mb-2">Email</h6>
                    <p>
                      <i className="fas fa-envelope text-primary me-2"></i>
                      {currentStore.email}
                    </p>
                  </div>
                </Col>
              )}
              
              {currentStore.address?.city && (
                <Col md={4}>
                  <div className="mb-3">
                    <h6 className="text-muted small text-uppercase mb-2">Localisation</h6>
                    <p>
                      <i className="fas fa-map-marker-alt text-primary me-2"></i>
                      {currentStore.address.city}, {currentStore.address.country || 'Algérie'}
                    </p>
                  </div>
                </Col>
              )}
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  )
}

// Asegúrate de importar useHistory
import { useHistory } from 'react-router-dom'
import { getStoreById } from '../../redux/actions/storeAction'

export default StoreDashboard