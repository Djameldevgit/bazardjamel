import React from 'react'
import {
  Card,
  Button,
  ListGroup,
  Badge
} from 'react-bootstrap'

const PlanCard = ({ plan, selected, onSelect, bonus, duration }) => {
  const getPlanColor = (planName) => {
    if (planName.includes('Basic')) return 'secondary'
    if (planName.includes('Silver')) return 'light'
    if (planName.includes('Gold')) return 'warning'
    return 'primary'
  }

  const planColor = getPlanColor(plan.name)

  return (
    <Card 
      className={`h-100 border-0 shadow-sm ${selected ? 'border-primary border-2' : ''}`}
      style={{
        transition: 'transform 0.3s',
        transform: selected ? 'scale(1.02)' : 'scale(1)'
      }}
    >
      {/* Plan Header */}
      <Card.Header 
        className={`bg-${planColor} text-white py-3 border-0`}
        style={{ 
          backgroundColor: planColor === 'light' ? '#e9ecef' : undefined,
          color: planColor === 'light' ? '#212529' : undefined
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0 fw-bold">{plan.name}</h5>
          {selected && (
            <span className="badge bg-success">
              <i className="fas fa-check me-1"></i>
              Sélectionné
            </span>
          )}
        </div>
      </Card.Header>

      <Card.Body className="p-0">
        {/* Price */}
        <div className="text-center py-4 bg-light">
          <h2 className="text-primary fw-bold mb-0">
            {plan.price * duration} crédits
          </h2>
          <small className="text-muted">{duration} mois</small>
        </div>

        {/* Features */}
        <ListGroup variant="flush">
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span>Crédits</span>
            <Badge bg="primary" className="px-3 py-2">
              {plan.credits}
            </Badge>
          </ListGroup.Item>
          
          <ListGroup.Item className="d-flex justify-content-between align-items-center">
            <span>Stockage</span>
            <Badge bg="info" className="px-3 py-2">
              {plan.storage}
            </Badge>
          </ListGroup.Item>

          {plan.features.map((feature, index) => (
            <ListGroup.Item key={index}>
              <i className="fas fa-check text-success me-2"></i>
              {feature}
            </ListGroup.Item>
          ))}
        </ListGroup>

        {/* Bonuses */}
        <div className="p-3">
          {bonus.bonusText && (
            <div className="mb-2">
              <Badge bg="success" className="w-100 py-2">
                <i className="fas fa-gift me-2"></i>
                {bonus.bonusText}
              </Badge>
            </div>
          )}
          
          {bonus.hasDomain && (
            <div>
              <Badge bg="info" className="w-100 py-2">
                <i className="fas fa-globe me-2"></i>
                Nom de domaine offert
              </Badge>
            </div>
          )}
        </div>
      </Card.Body>

      <Card.Footer className="border-0 bg-white pt-0">
        <Button
          variant={selected ? "success" : "primary"}
          className={`w-100 py-2 ${selected ? '' : 'btn-' + planColor}`}
          onClick={onSelect}
          size="lg"
        >
          {selected ? (
            <>
              <i className="fas fa-check-circle me-2"></i>
              Sélectionné
            </>
          ) : (
            <>
              <i className="fas fa-shopping-cart me-2"></i>
              Choisir cette offre
            </>
          )}
        </Button>
      </Card.Footer>
    </Card>
  )
}

export default PlanCard