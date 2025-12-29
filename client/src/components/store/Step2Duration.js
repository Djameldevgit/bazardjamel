// components/store/Step2Duration.js
import React from 'react'
import {
  Card,
  Row,
  Col,
  Badge,
  Alert
} from 'react-bootstrap'
// Si la importación falla, definimos localmente
// import { DURATION_OPTIONS } from '../../redux/constants/storeConstants'

// Definir localmente si no se encuentra en constants
const DURATION_OPTIONS = [
  { value: 1, label: '1 Mois' },
  { value: 2, label: '2 Mois' },
  { value: 3, label: '3 Mois' },
  { value: 4, label: '4 Mois' },
  { value: 5, label: '5 Mois' },
  { value: 6, label: '6 Mois' },
  { value: 7, label: '7 Mois' },
  { value: 8, label: '8 Mois' },
  { value: 9, label: '9 Mois' },
  { value: 10, label: '10 Mois' },
  { value: 11, label: '11 Mois' },
  { value: 12, label: '12 Mois' }
]

const Step2Duration = ({ selectedDuration, onSelect }) => {
  const getBonusText = (duration) => {
    if (duration >= 6 && duration < 12) return '1 mois offert'
    if (duration === 12) return '3 mois offerts'
    if (duration >= 3) return 'Nom de domaine offert'
    return null
  }

  return (
    <div>
      <div className="text-center mb-4">
        <h4 className="text-primary">Choisissez la durée</h4>
        <p className="text-muted">
          Plus la durée est longue, plus vous économisez avec nos offres spéciales!
        </p>
      </div>

      <Row className="g-3">
        {DURATION_OPTIONS.map((option) => {
          const isSelected = selectedDuration === option.value
          const bonusText = getBonusText(option.value)
          
          return (
            <Col key={option.value} xs={12} sm={6} md={4} lg={3}>
              <Card 
                className={`h-100 cursor-pointer text-center ${isSelected ? 'border-primary border-2 shadow' : ''}`}
                onClick={() => onSelect(option.value)}
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  backgroundColor: isSelected ? '#e3f2fd' : 'white'
                }}
              >
                <Card.Body className="py-4">
                  <div className={`mb-3 ${isSelected ? 'text-primary' : 'text-dark'}`}>
                    <h3 className="fw-bold mb-0">{option.value}</h3>
                    <small className="text-uppercase">Mois</small>
                  </div>
                  
                  <h5 className="mb-3">{option.label}</h5>
                  
                  {bonusText && (
                    <Badge 
                      bg={isSelected ? "success" : "warning"} 
                      className="px-3 py-2 mb-2"
                    >
                      <i className="fas fa-gift me-1"></i>
                      {bonusText}
                    </Badge>
                  )}
                  
                  {isSelected && (
                    <div className="mt-3">
                      <i className="fas fa-check-circle fa-2x text-success"></i>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>

      <Alert variant="info" className="mt-4">
        <div className="d-flex">
          <i className="fas fa-lightbulb me-3 fs-4"></i>
          <div>
            <strong>Conseil:</strong>
            {selectedDuration >= 6 && selectedDuration < 12 ? 
              ' Vous bénéficiez de 1 mois gratuit!' :
            selectedDuration === 12 ? 
              ' Vous bénéficiez de 3 mois gratuits!' :
            selectedDuration >= 3 ? 
              ' Vous obtenez un nom de domaine gratuit!' :
              ' Choisissez 3 mois ou plus pour un nom de domaine gratuit!'
            }
          </div>
        </div>
      </Alert>
    </div>
  )
}

export default Step2Duration