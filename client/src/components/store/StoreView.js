import React, { useEffect, useState } from 'react'
import {
  Card,
  Button,
  Row,
  Col,
  Badge,
  Spinner,
  Alert,
  Container
} from 'react-bootstrap'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getStoreById } from '../../redux/actions/storeActions'
import { FaStore, FaEdit, FaTrash, FaArrowLeft, FaChartLine, FaBox, FaHeart, FaEye } from 'react-icons/fa'

const StoreView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { auth } = useSelector(state => state)
  const { currentStore, loading, error } = useSelector(state => state.store || {})
  
  const [store, setStore] = useState(null)

  useEffect(() => {
    if (id && auth?.token) {
      console.log('🔄 Cargando tienda ID:', id)
      dispatch(getStoreById({
        id,
        auth: {
          token: auth.token,
          user: auth.user
        }
      }))
    }
  }, [id, auth, dispatch])

  useEffect(() => {
    if (currentStore) {
      console.log('✅ Tienda cargada:', currentStore)
      setStore(currentStore)
    }
  }, [currentStore])

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Chargement de la boutique...</p>
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger" className="mt-4">
          <FaTrash className="me-2" />
          {error}
          <Button 
            variant="outline-secondary" 
            className="ms-3"
            onClick={() => navigate('/dashboard')}
          >
            <FaArrowLeft className="me-2" />
            Retour au tableau de bord
          </Button>
        </Alert>
      </Container>
    )
  }

  if (!store) {
    return (
      <Container>
        <Alert variant="warning" className="mt-4">
          <FaStore className="me-2" />
          Boutique non trouvée
          <Link to="/dashboard" className="ms-3">
            <Button variant="outline-primary" size="sm">
              Voir mes boutiques
            </Button>
          </Link>
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
      day: 'numeric'
    })
  }

  return (
    <Container className="py-4">
      {/* Breadcrumb y acciones */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate('/dashboard')}
            size="sm"
          >
            <FaArrowLeft className="me-2" />
            Retour
          </Button>
          <h1 className="h3 mb-0 ms-3 d-inline">Ma Boutique</h1>
        </div>
        
        <div>
          <Link to={`/store/${store._id}/edit`}>
            <Button variant="outline-primary" className="me-2">
              <FaEdit className="me-2" />
              Modifier
            </Button>
          </Link>
          <Link to={`/store/${store._id}/dashboard`}>
            <Button variant="primary">
              <FaChartLine className="me-2" />
              Tableau de bord
            </Button>
          </Link>
        </div>
      </div>

      <Row>
        {/* Columna izquierda - Información principal */}
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <div className="d-flex align-items-center mb-4">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                     style={{ width: '60px', height: '60px' }}>
                  <FaStore size={30} />
                </div>
                <div className="ms-3">
                  <h2 className="h4 mb-1">{store.name}</h2>
                  <div className="d-flex align-items-center">
                    <Badge bg={store.plan === 'Premium' ? 'warning' : 
                              store.plan === 'Pro' ? 'info' : 'secondary'}
                           className="me-2">
                      {store.plan}
                    </Badge>
                    <span className="text-muted">
                      <FaBox className="me-1" size={14} />
                      {store.planFeatures?.maxProducts || 10} produits max
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h5 className="mb-3">Description</h5>
                <p className="text-muted">
                  {store.description || 'Aucune description disponible.'}
                </p>
              </div>

              <Row>
                <Col md={6}>
                  <Card className="border-0 bg-light mb-3">
                    <Card.Body>
                      <h6 className="text-uppercase text-muted small mb-2">Catégorie</h6>
                      <p className="mb-0 fw-bold">{store.category}</p>
                    </Card.Body>
                  </Card>
                </Col>
                
                <Col md={6}>
                  <Card className="border-0 bg-light mb-3">
                    <Card.Body>
                      <h6 className="text-uppercase text-muted small mb-2">Statut</h6>
                      <div className="d-flex align-items-center">
                        <Badge bg={store.isActive ? 'success' : 'danger'} className="me-2">
                          {store.isActive ? 'Actif' : 'Inactif'}
                        </Badge>
                        {store.verified && (
                          <Badge bg="success">
                            <i className="fas fa-check-circle me-1"></i>
                            Vérifié
                          </Badge>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Estadísticas */}
              <div className="mt-4">
                <h5 className="mb-3">Statistiques</h5>
                <Row>
                  <Col md={4}>
                    <Card className="text-center border-0 shadow-sm">
                      <Card.Body>
                        <FaEye className="text-primary mb-2" size={24} />
                        <h3 className="mb-0">{store.stats?.totalViews || 0}</h3>
                        <p className="text-muted mb-0 small">Vues</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={4}>
                    <Card className="text-center border-0 shadow-sm">
                      <Card.Body>
                        <FaHeart className="text-danger mb-2" size={24} />
                        <h3 className="mb-0">{store.stats?.totalFavorites || 0}</h3>
                        <p className="text-muted mb-0 small">Favoris</p>
                      </Card.Body>
                    </Card>
                  </Col>
                  
                  <Col md={4}>
                    <Card className="text-center border-0 shadow-sm">
                      <Card.Body>
                        <FaBox className="text-success mb-2" size={24} />
                        <h3 className="mb-0">{store.stats?.totalProducts || 0}</h3>
                        <p className="text-muted mb-0 small">Produits</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Columna derecha - Información adicional */}
        <Col lg={4}>
          {/* Información del plan */}
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Détails du plan</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <h6>Plan: <strong>{store.plan}</strong></h6>
                <ul className="list-unstyled mt-3">
                  <li className="mb-2">
                    <i className="fas fa-check text-success me-2"></i>
                    {store.planFeatures?.maxProducts || 10} produits maximum
                  </li>
                  <li className="mb-2">
                    <i className={`fas ${store.planFeatures?.canPromote ? 'fa-check text-success' : 'fa-times text-danger'} me-2`}></i>
                    Promotion des produits
                  </li>
                  <li className="mb-2">
                    <i className={`fas ${store.planFeatures?.analytics ? 'fa-check text-success' : 'fa-times text-danger'} me-2`}></i>
                    Statistiques avancées
                  </li>
                </ul>
              </div>
              
              {store.credits > 0 && (
                <Alert variant="info" className="small">
                  <i className="fas fa-coins me-2"></i>
                  <strong>{store.credits} crédits</strong> disponibles
                </Alert>
              )}
              
              {store.storage > 0 && (
                <Alert variant="secondary" className="small">
                  <i className="fas fa-hdd me-2"></i>
                  <strong>{store.storage} MB</strong> de stockage
                </Alert>
              )}
              
              <Button 
                variant="outline-primary" 
                size="sm" 
                className="w-100"
                onClick={() => navigate(`/store/${store._id}/upgrade`)}
              >
                <i className="fas fa-arrow-up me-2"></i>
                Améliorer le plan
              </Button>
            </Card.Body>
          </Card>

          {/* Información de contacto */}
          <Card className="shadow-sm mb-4">
            <Card.Header>
              <h5 className="mb-0">Informations de contact</h5>
            </Card.Header>
            <Card.Body>
              {store.phone ? (
                <p>
                  <i className="fas fa-phone text-muted me-2"></i>
                  {store.phone}
                </p>
              ) : (
                <p className="text-muted small">
                  <i className="fas fa-phone me-2"></i>
                  Aucun numéro de téléphone
                </p>
              )}
              
              {store.email ? (
                <p>
                  <i className="fas fa-envelope text-muted me-2"></i>
                  {store.email}
                </p>
              ) : (
                <p className="text-muted small">
                  <i className="fas fa-envelope me-2"></i>
                  Aucun email
                </p>
              )}
              
              {store.address?.city ? (
                <p>
                  <i className="fas fa-map-marker-alt text-muted me-2"></i>
                  {store.address.city}, {store.address.country}
                </p>
              ) : (
                <p className="text-muted small">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  Aucune adresse
                </p>
              )}
              
              <Button 
                variant="outline-secondary" 
                size="sm" 
                className="w-100"
                onClick={() => navigate(`/store/${store._id}/edit`)}
              >
                <i className="fas fa-edit me-2"></i>
                Ajouter/Modifier les contacts
              </Button>
            </Card.Body>
          </Card>

          {/* Información de creación */}
          <Card className="shadow-sm">
            <Card.Header>
              <h5 className="mb-0">Informations</h5>
            </Card.Header>
            <Card.Body className="small">
              <p className="mb-2">
                <strong>Créée le:</strong><br />
                {formatDate(store.createdAt)}
              </p>
              <p className="mb-2">
                <strong>Dernière mise à jour:</strong><br />
                {formatDate(store.updatedAt)}
              </p>
              <p className="mb-0">
                <strong>ID de la boutique:</strong><br />
                <code className="text-muted">{store._id}</code>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default StoreView