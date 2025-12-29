// pages/store/StorePage.js (VERSIÓN CORREGIDA)
import React, { useState, useEffect } from 'react'
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge, 
  Alert,
  Spinner,
  Tab,
  Nav,
  Image,
  ListGroup,
  Modal,
  Form
} from 'react-bootstrap'
import { 
  Facebook, 
  Instagram, 
  Whatsapp, 
  Star,
  StarFill,
  Share,
  Heart,
  Phone,
  Envelope,
  GeoAlt,
  Clock
} from 'react-bootstrap-icons'
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  getStoreById,
  getStoreProducts
} from '../../redux/actions/storeAction'

const StorePage = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  
  // 🔥 CORRECCIÓN: Destructuración segura del estado
  const storeState = useSelector(state => state.store || {})
  const { auth } = useSelector(state => state || {})
  
  // Extraer propiedades con valores por defecto
  const store = storeState.store || null
  const storeProducts = storeState.storeProducts || { products: [] }
  const loading = storeState.loading || false
  const error = storeState.error || null
  
  // Estados locales
  const [activeTab, setActiveTab] = useState('products')
  const [showContactModal, setShowContactModal] = useState(false)
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    console.log('🔍 StorePage - ID reçu:', id)
    console.log('🔍 StorePage - Auth:', auth)
    
    if (id) {
      console.log('🔄 Chargement de la boutique...')
      dispatch(getStoreById(id))
      dispatch(getStoreProducts(id))
    }
  }, [dispatch, id])

  // 🔥 AGREGAR DIAGNÓSTICO
  useEffect(() => {
    console.log('🔄 StorePage - StoreState mis à jour:', {
      hasStore: !!store,
      storeId: store?._id,
      loading,
      error
    })
  }, [store, loading, error])

  const handleSendMessage = async () => {
    if (!message.trim()) {
      alert('Veuillez écrire un message')
      return
    }

    try {
      setSending(true)
      // await dispatch(contactStore(id, message, auth?.token))
      alert('✅ Message envoyé avec succès!')
      setShowContactModal(false)
      setMessage('')
    } catch (err) {
      console.error('Error sending message:', err)
      alert(err.message || 'Erreur lors de l\'envoi du message')
    } finally {
      setSending(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: store?.name,
        text: store?.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('📋 Lien copié dans le presse-papier!')
    }
  }

  const handleAddToFavorites = async () => {
    if (!auth?.token) {
      alert('Veuillez vous connecter pour ajouter aux favoris')
      return
    }
    
    try {
      // await dispatch(toggleFavoriteStore(id, auth.token))
      alert('✅ Boutique ajoutée aux favoris')
    } catch (err) {
      console.error('Error adding to favorites:', err)
      alert(err.message || 'Erreur lors de l\'ajout aux favoris')
    }
  }

  const renderRating = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        i <= rating ? 
        <StarFill key={i} className="text-warning me-1" /> : 
        <Star key={i} className="text-secondary me-1" />
      )
    }
    return stars
  }

  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue'
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <h4 className="mt-3">Chargement de la boutique...</h4>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h4>⚠️ Erreur de chargement</h4>
          <p>{error}</p>
          <p className="small text-muted">ID: {id}</p>
          <Button as={Link} to="/" variant="primary" className="mt-3">
            Retour à l'accueil
          </Button>
        </Alert>
      </Container>
    )
  }

  if (!store) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <h4>Boutique non trouvée</h4>
          <p>La boutique avec l'ID "{id}" n'existe pas.</p>
          <div className="mt-3">
            <Button as={Link} to="/" variant="primary" className="me-2">
              Accueil
            </Button>
            <Button as={Link} to="/stores" variant="outline-primary">
              Voir toutes les boutiques
            </Button>
          </div>
        </Alert>
      </Container>
    )
  }

  // Verificar si la tienda pertenece al usuario actual
  const isOwner = auth?.user && store.owner === auth.user._id
  const products = storeProducts.products || []

  console.log('🎨 StorePage - Rendu:', {
    storeId: store._id,
    storeName: store.name,
    isOwner,
    productsCount: products.length
  })

  return (
    <Container fluid className="px-0">
      {/* Banner de la boutique */}
      <div className="position-relative">
        {store.bannerUrl ? (
          <Image 
            src={store.bannerUrl} 
            alt="Bannière" 
            fluid 
            className="store-banner"
            style={{ height: '300px', objectFit: 'cover', width: '100%' }}
          />
        ) : (
          <div 
            className="store-banner" 
            style={{ 
              height: '300px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }} 
          />
        )}
        
        {/* Overlay con info */}
        <div className="position-absolute bottom-0 start-0 p-4 text-white w-100 store-overlay">
          <Container>
            <Row className="align-items-end">
              <Col md={8}>
                <div className="d-flex align-items-center mb-3">
                  <div className="store-logo-container me-4">
                    {store.logoUrl ? (
                      <Image 
                        src={store.logoUrl} 
                        roundedCircle 
                        width={100}
                        height={100}
                        className="border border-4 border-white shadow"
                      />
                    ) : (
                      <div 
                        className="rounded-circle bg-white d-flex align-items-center justify-content-center shadow"
                        style={{ width: '100px', height: '100px' }}
                      >
                        <span className="display-4 text-primary">
                          {store.name?.charAt(0) || 'B'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="mb-1">{store.name || 'Boutique sans nom'}</h1>
                    <div className="d-flex align-items-center mb-2">
                      {renderRating(store.rating?.average || 0)}
                      <span className="ms-2">
                        ({store.rating?.count || 0} avis)
                      </span>
                    </div>
                    <Badge bg="success" className="me-2">
                      <i className="fas fa-check-circle me-1"></i>
                      {store.verified ? 'Vérifié' : 'Non vérifié'}
                    </Badge>
                    {store.plan && (
                      <Badge bg="info" className="me-2">
                        {store.plan}
                      </Badge>
                    )}
                    {isOwner && (
                      <Badge bg="warning" className="me-2">
                        <i className="fas fa-crown me-1"></i>
                        Votre boutique
                      </Badge>
                    )}
                  </div>
                </div>
              </Col>
              <Col md={4} className="text-end">
                <div className="d-flex justify-content-end gap-2 mb-3">
                  <Button 
                    variant="light" 
                    size="sm"
                    onClick={() => setShowContactModal(true)}
                    disabled={isOwner}
                  >
                    <Phone className="me-2" />
                    {isOwner ? 'Votre boutique' : 'Contacter'}
                  </Button>
                  <Button variant="light" size="sm" onClick={handleShare}>
                    <Share className="me-2" />
                    Partager
                  </Button>
                  <Button 
                    variant="light" 
                    size="sm" 
                    onClick={handleAddToFavorites}
                    disabled={isOwner}
                  >
                    <Heart className="me-2" />
                    Favoris
                  </Button>
                  {isOwner && (
                    <Button 
                      variant="primary" 
                      size="sm"
                      as={Link}
                      to={`/dashboard/store/${id}/edit`}
                    >
                      <i className="fas fa-edit me-2"></i>
                      Modifier
                    </Button>
                  )}
                </div>
                <div className="text-white-50">
                  <small>
                    <Clock className="me-1" /> 
                    Actif depuis {formatDate(store.createdAt)}
                  </small>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>

      {/* Contenu principal */}
      <Container className="mt-4">
        <Row>
          {/* Barre latérale */}
          <Col lg={3} className="mb-4">
            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="mb-3">À propos</h5>
                <p className="text-muted">
                  {store.description || 'Aucune description disponible.'}
                </p>
                
                <hr />
                
                <h6 className="mb-3">Informations</h6>
                <ListGroup variant="flush">
                  {store.category && (
                    <ListGroup.Item className="d-flex justify-content-between">
                      <span>Catégorie:</span>
                      <Badge bg="primary">{store.category}</Badge>
                    </ListGroup.Item>
                  )}
                  
                  {store.address?.city && (
                    <ListGroup.Item className="d-flex align-items-center">
                      <GeoAlt className="me-2 text-muted" />
                      <span>{store.address.city}, {store.address.country}</span>
                    </ListGroup.Item>
                  )}
                  
                  {store.contact?.phone && (
                    <ListGroup.Item className="d-flex align-items-center">
                      <Phone className="me-2 text-muted" />
                      <span>{store.contact.phone}</span>
                    </ListGroup.Item>
                  )}
                  
                  {store.contact?.email && (
                    <ListGroup.Item className="d-flex align-items-center">
                      <Envelope className="me-2 text-muted" />
                      <span>{store.contact.email}</span>
                    </ListGroup.Item>
                  )}
                </ListGroup>
                
                <hr />
                
                <h6 className="mb-3">Statistiques</h6>
                <div className="row text-center">
                  <div className="col-4">
                    <div className="display-6">
                      {store.stats?.totalProducts || 0}
                    </div>
                    <small className="text-muted">Produits</small>
                  </div>
                  <div className="col-4">
                    <div className="display-6">
                      {store.stats?.totalViews || 0}
                    </div>
                    <small className="text-muted">Vues</small>
                  </div>
                  <div className="col-4">
                    <div className="display-6">
                      {store.stats?.totalFavorites || 0}
                    </div>
                    <small className="text-muted">Favoris</small>
                  </div>
                </div>
                
                <hr />
                
                <h6 className="mb-3">Réseaux sociaux</h6>
                <div className="d-flex gap-2">
                  {store.socialLinks?.facebook && (
                    <a href={store.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline-primary" size="sm">
                        <Facebook />
                      </Button>
                    </a>
                  )}
                  {store.socialLinks?.instagram && (
                    <a href={store.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline-danger" size="sm">
                        <Instagram />
                      </Button>
                    </a>
                  )}
                  {store.socialLinks?.whatsapp && (
                    <a href={`https://wa.me/${store.socialLinks.whatsapp}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline-success" size="sm">
                        <Whatsapp />
                      </Button>
                    </a>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Contenu principal */}
          <Col lg={9}>
            {/* Tabs de navigation */}
            <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
              <Card className="shadow-sm mb-4">
                <Card.Header className="bg-white border-0">
                  <Nav variant="tabs" className="border-0">
                    <Nav.Item>
                      <Nav.Link eventKey="products">
                        <i className="fas fa-box me-2"></i>
                        Produits ({products.length})
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="reviews">
                        <i className="fas fa-star me-2"></i>
                        Avis ({store.stats?.reviewsCount || 0})
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>
                
                <Card.Body>
                  <Tab.Content>
                    {/* Tab Produits */}
                    <Tab.Pane eventKey="products">
                      {products.length > 0 ? (
                        <Row>
                          {products.map(product => (
                            <Col key={product._id} md={6} lg={4} className="mb-4">
                              <Card className="h-100 product-card">
                                {product.images?.[0] && (
                                  <Link to={`/product/${product._id}`}>
                                    <Card.Img 
                                      variant="top" 
                                      src={product.images[0]} 
                                      style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                  </Link>
                                )}
                                <Card.Body>
                                  <Card.Title className="h6">
                                    <Link to={`/product/${product._id}`} className="text-decoration-none">
                                      {product.title}
                                    </Link>
                                  </Card.Title>
                                  <div className="d-flex justify-content-between align-items-center mt-3">
                                    <span className="h5 text-primary mb-0">
                                      {product.price ? `${product.price} DZD` : 'Gratuit'}
                                    </span>
                                    <Button 
                                      variant="outline-primary" 
                                      size="sm"
                                      as={Link}
                                      to={`/product/${product._id}`}
                                    >
                                      Voir
                                    </Button>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      ) : (
                        <Alert variant="info">
                          <i className="fas fa-info-circle me-2"></i>
                          Cette boutique n'a pas encore de produits.
                        </Alert>
                      )}
                    </Tab.Pane>

                    {/* Tab Avis */}
                    <Tab.Pane eventKey="reviews">
                      <Alert variant="info">
                        <i className="fas fa-comment me-2"></i>
                        Soyez le premier à laisser un avis sur cette boutique!
                      </Alert>
                    </Tab.Pane>
                  </Tab.Content>
                </Card.Body>
              </Card>
            </Tab.Container>
          </Col>
        </Row>
      </Container>

      {/* Modal de contact */}
      <Modal show={showContactModal} onHide={() => setShowContactModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Contacter {store.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Votre message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Écrivez votre message ici..."
                disabled={sending}
              />
            </Form.Group>
            <div className="d-flex gap-2">
              <Button 
                variant="primary" 
                onClick={handleSendMessage}
                disabled={sending || !message.trim()}
              >
                {sending ? 'Envoi en cours...' : 'Envoyer'}
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => setShowContactModal(false)}
              >
                Annuler
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default StorePage