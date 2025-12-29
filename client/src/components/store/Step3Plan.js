import React from 'react'
import {
  Row,
  Col,
  Alert,
  Badge
} from 'react-bootstrap'
import { STORE_PLANS } from '../../redux/constants/storeConstants'
import PlanCard from './PlanCard'

const Step3Plan = ({ selectedPlan, onSelect, duration }) => {
  const plans = Object.values(STORE_PLANS)
  
  const calculateBonus = (plan) => {
    let bonusMonths = 0
    let bonusText = ''
    
    if (duration >= 6 && duration < 12) {
      bonusMonths = 1
      bonusText = '1 mois offert'
    } else if (duration === 12) {
      bonusMonths = 3
      bonusText = '3 mois offerts'
    }
    
    const totalMonths = duration + bonusMonths
    const pricePerMonth = plan.price
    const totalPrice = plan.price * duration
    
    return {
      bonusMonths,
      bonusText,
      totalMonths,
      pricePerMonth,
      totalPrice,
      hasDomain: duration >= 3
    }
  }

  return (
    <div>
      <div className="text-center mb-4">
        <h4 className="text-primary">Choisissez votre offre</h4>
        <p className="text-muted">
          Sélectionnez le plan qui correspond le mieux à vos besoins
        </p>
      </div>

      <Row className="g-4">
        {plans.map((plan) => {
          const bonus = calculateBonus(plan)
          
          return (
            <Col key={plan.id} xs={12} md={6} lg={4} xl={3}>
              <PlanCard
                plan={plan}
                selected={selectedPlan?.id === plan.id}
                onSelect={() => onSelect(plan)}
                bonus={bonus}
                duration={duration}
              />
            </Col>
          )
        })}
      </Row>

      {selectedPlan && (
        <Alert variant="success" className="mt-4">
          <div className="d-flex align-items-center mb-3">
            <i className="fas fa-check-circle fa-2x text-success me-3"></i>
            <h4 className="mb-0">Offre sélectionnée: {selectedPlan.name}</h4>
          </div>
          
          <Row>
            <Col md={3}>
              <div className="mb-2">
                <strong>Crédits:</strong>
                <div className="text-muted">{selectedPlan.credits}</div>
              </div>
            </Col>
            <Col md={3}>
              <div className="mb-2">
                <strong>Stockage:</strong>
                <div className="text-muted">{selectedPlan.storage} produits</div>
              </div>
            </Col>
            <Col md={3}>
              <div className="mb-2">
                <strong>Durée:</strong>
                <div className="text-muted">{duration} mois</div>
              </div>
            </Col>
            <Col md={3}>
              <div className="mb-2">
                <strong>Prix/mois:</strong>
                <div className="text-muted">{selectedPlan.price} crédits</div>
              </div>
            </Col>
          </Row>

          <div className="mt-3">
            {calculateBonus(selectedPlan).bonusText && (
              <Badge bg="warning" className="me-2 mb-2 px-3 py-2">
                <i className="fas fa-gift me-1"></i>
                {calculateBonus(selectedPlan).bonusText}
              </Badge>
            )}
            
            {calculateBonus(selectedPlan).hasDomain && (
              <Badge bg="info" className="me-2 mb-2 px-3 py-2">
                <i className="fas fa-globe me-1"></i>
                Nom de domaine offert
              </Badge>
            )}
          </div>

          <div className="mt-3 pt-3 border-top">
            <h3 className="text-primary mb-0">
              Total: {selectedPlan.price * duration} crédits
            </h3>
            <small className="text-muted">
              Paiement unique pour {duration} mois
            </small>
          </div>
        </Alert>
      )}
    </div>
  )
}

export default Step3Plan