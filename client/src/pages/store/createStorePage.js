import React from 'react'
import { Container, Row, Col, Card, Alert } from 'react-bootstrap'
import StoreWizard from '../../components/store/StoreWizard'
 
const CreateStorePage = () => {
  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col lg={10}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body className="text-center py-4">
              <h1 className="text-primary mb-3">
                <i className="fas fa-store me-2"></i>
                Acheter un store
              </h1>
              <p className="text-muted mb-0">
                Créez votre boutique en ligne en 3 étapes simples
              </p>
            </Card.Body>
          </Card>

          <StoreWizard />
        </Col>
      </Row>
    </Container>
  )
}

export default CreateStorePage