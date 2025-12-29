// pages/StoreConfirmation.js - actualizado
import React, { useEffect } from 'react'
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { resetStoreCreate } from '../../redux/actions/storeAction'
 
const StoreConfirmation = () => {
  const dispatch = useDispatch()
  
  // Usar el estado de storeCreate
  const storeCreate = useSelector(state => state.storeCreate)
  const { loading, success, store, error } = storeCreate

  useEffect(() => {
    // Resetear estado cuando se desmonte el componente
    return () => {
      dispatch(resetStoreCreate())
    }
  }, [dispatch])

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <h4 className="mt-3">Création de votre boutique en cours...</h4>
      </Container>
    )
  }

  if (error || !success) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <h4>Erreur lors de la création</h4>
          <p>{error || 'Une erreur est survenue'}</p>
          <Button as={Link} to="/create-store" variant="primary">
            Retour à la création
          </Button>
        </Alert>
      </Container>
    )
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="border-0 shadow text-center">
            <Card.Body className="p-5">
              <div className="mb-4">
                <div className="display-1 text-success mb-3">
                  <i className="fas fa-check-circle"></i>
                </div>
                <h1 className="text-primary">Félicitations! 🎉</h1>
                <p className="lead">Votre boutique a été créée avec succès</p>
              </div>

              {/* Mostrar info de la tienda creada */}
              {store && store.store && (
                <Card className="mb-4">
                  <Card.Body>
                    <h4>{store.store.name}</h4>
                    <p className="text-muted">{store.msg}</p>
                  </Card.Body>
                </Card>
              )}

              <div className="d-grid gap-3 d-md-flex justify-content-center">
                <Button 
                  as={Link} 
                  to="/dashboard"
                  variant="primary" 
                  size="lg"
                  className="px-4"
                >
                  <i className="fas fa-tachometer-alt me-2"></i>
                  Tableau de bord
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  )
}

export default StoreConfirmation