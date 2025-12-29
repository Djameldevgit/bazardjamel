// StoreDashboard.js - Página de dashboard de tienda
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { Container, Row, Col, Card, Button, Badge, Alert, Spinner } from 'react-bootstrap'
import { FaStore, FaEye, FaToggleOn, FaToggleOff, FaEdit, FaChartLine } from 'react-icons/fa'
import { getMyStore , toggleStoreActive} from '../../redux/actions/storeAction'
 
//import { getMyStore} from '../../redux/actions/storeAction'
 
const StoreDashboard = () => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { store, auth } = useSelector(state => state)
  const { myStore, loading, error } = store
  
  const [localStore, setLocalStore] = useState(null)
  
  useEffect(() => {
    if (auth.token) {
      dispatch(getMyStore())
    }
  }, [dispatch, auth.token])
  
  useEffect(() => {
    if (myStore) {
      setLocalStore(myStore)
    }
  }, [myStore])
  
  const handleToggleActive = async () => {
    if (!localStore) return
    
    try {
      await dispatch(toggleStoreActive(localStore._id))
      // Actualizar estado local
      setLocalStore({
        ...localStore,
        isActive: !localStore.isActive
      })
    } catch (err) {
      console.error('Error:', err)
    }
  }
  
  if (loading && !localStore) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Cargando tu tienda...</p>
      </Container>
    )
  }
  
  if (error && !localStore) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h4>Error al cargar la tienda</h4>
          <p>{error}</p>
          <Button variant="primary" onClick={() => dispatch(getMyStore())}>
            Reintentar
          </Button>
        </Alert>
      </Container>
    )
  }
  
  if (!localStore) {
    return (
      <Container className="py-5">
        <Card className="text-center shadow-sm border-0">
          <Card.Body className="py-5">
            <FaStore size={64} className="text-muted mb-4" />
            <h3 className="mb-3">No tienes una tienda creada</h3>
            <p className="text-muted mb-4">
              Crea tu tienda para comenzar a vender productos
            </p>
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => history.push('/create-store')}
            >
              <FaStore className="me-2" />
              Crear Mi Tienda
            </Button>
          </Card.Body>
        </Card>
      </Container>
    )
  }
  
  return (
    <Container fluid="lg" className="py-4">
      {/* Header */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h1 className="display-5 fw-bold">
              <FaStore className="me-3 text-primary" />
              {localStore.name}
            </h1>
            <div className="d-flex align-items-center gap-3 mt-2">
              <Badge bg={localStore.plan === 'Premium' ? 'warning' : 
                        localStore.plan === 'Pro' ? 'info' : 'secondary'}>
                Plan {localStore.plan}
              </Badge>
              <Badge bg="secondary">{localStore.category}</Badge>
              <Button 
                variant={localStore.isActive ? "success" : "secondary"}
                size="sm"
                onClick={handleToggleActive}
                className="d-flex align-items-center gap-1"
              >
                {localStore.isActive ? (
                  <>
                    <FaToggleOn /> Activa
                  </>
                ) : (
                  <>
                    <FaToggleOff /> Inactiva
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="d-flex gap-2">
            <Button 
              variant="outline-primary"
              onClick={() => history.push(`/store/${localStore._id}`)}
            >
              <FaEye className="me-2" />
              Ver Pública
            </Button>
            <Button 
              variant="primary"
              onClick={() => history.push(`/store/${localStore._id}/edit`)}
            >
              <FaEdit className="me-2" />
              Editar
            </Button>
          </div>
        </div>
      </div>
      
      {/* Stats */}
      <Row className="g-4 mb-5">
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 h-100">
            <Card.Body>
              <FaEye size={32} className="text-primary mb-3" />
              <h2 className="fw-bold">{localStore.stats?.totalViews || 0}</h2>
              <p className="text-muted mb-0">Vistas</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 h-100">
            <Card.Body>
              <FaChartLine size={32} className="text-success mb-3" />
              <h2 className="fw-bold">{localStore.stats?.totalProducts || 0}</h2>
              <p className="text-muted mb-0">Productos</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 h-100">
            <Card.Body>
              <FaStore size={32} className="text-warning mb-3" />
              <h2 className="fw-bold">{localStore.credits || 0}</h2>
              <p className="text-muted mb-0">Créditos</p>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="text-center shadow-sm border-0 h-100">
            <Card.Body>
              <Badge bg="info" className="p-3 mb-3" style={{ fontSize: '2rem' }}>
                {localStore.plan.charAt(0)}
              </Badge>
              <h4 className="fw-bold">{localStore.plan}</h4>
              <p className="text-muted mb-0">Plan Actual</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Store Info */}
      <Card className="shadow-sm border-0">
        <Card.Body>
          <h4 className="mb-4">Información de la Tienda</h4>
          
          <Row>
            <Col md={6}>
              <div className="mb-3">
                <h6>Descripción</h6>
                <p className="text-muted">
                  {localStore.description || 'Sin descripción'}
                </p>
              </div>
              
              <div className="mb-3">
                <h6>Estado Actual</h6>
                <p className={localStore.isActive ? 'text-success' : 'text-danger'}>
                  {localStore.isActive 
                    ? '✅ Tu tienda es visible públicamente' 
                    : '❌ Tu tienda no es visible públicamente'}
                </p>
                <p className="small text-muted">
                  {localStore.isActive 
                    ? 'Los usuarios pueden ver y visitar tu tienda' 
                    : 'Solo tú puedes ver tu tienda'}
                </p>
              </div>
            </Col>
            
            <Col md={6}>
              <div className="mb-3">
                <h6>Fecha de Creación</h6>
                <p className="text-muted">
                  {new Date(localStore.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
              
              <div className="mb-3">
                <h6>Enlace Público</h6>
                <div className="input-group">
                  <input 
                    type="text" 
                    className="form-control" 
                    readOnly 
                    value={`${window.location.origin}/store/${localStore._id}`}
                  />
                  <Button 
                    variant="outline-secondary"
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/store/${localStore._id}`)}
                  >
                    Copiar
                  </Button>
                </div>
              </div>
            </Col>
          </Row>
          
          {/* Action Buttons */}
          <div className="d-flex gap-3 mt-4 pt-4 border-top">
            <Button 
              variant={localStore.isActive ? "warning" : "success"}
              onClick={handleToggleActive}
              className="d-flex align-items-center gap-2"
            >
              {localStore.isActive ? <FaToggleOff /> : <FaToggleOn />}
              {localStore.isActive ? 'Desactivar Tienda' : 'Activar Tienda'}
            </Button>
            
            <Button 
              variant="outline-primary"
              onClick={() => history.push('/creer-annonce')}
            >
              Agregar Producto
            </Button>
            
            <Button 
              variant="outline-info"
              onClick={() => history.push('/achat-store')}
            >
              Mejorar Plan
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default StoreDashboard