import React from 'react'
import {
  Card,
  Form,
  Row,
  Col,
  Badge
} from 'react-bootstrap'
import { CATEGORIES } from '../../redux/constants/storeConstants'
 

const Step1Categories = ({ selectedCategories, onSelect }) => {
  const handleToggle = (category) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(c => c !== category)
      : [...selectedCategories, category]
    
    onSelect(newCategories)
  }

  return (
    <div>
      <div className="text-center mb-4">
        <h4 className="text-primary">Choisissez vos catégories</h4>
        <p className="text-muted">
          Sélectionnez une ou plusieurs catégories qui correspondent à vos produits
        </p>
      </div>

      <Row>
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategories.includes(category)
          
          return (
            <Col key={category} xs={12} sm={6} md={4} lg={3} className="mb-3">
              <Card 
                className={`h-100 cursor-pointer ${isSelected ? 'border-primary border-2' : ''}`}
                onClick={() => handleToggle(category)}
                style={{ 
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  backgroundColor: isSelected ? '#e3f2fd' : 'white'
                }}
              >
                <Card.Body className="d-flex align-items-center">
                  <Form.Check 
                    type="checkbox"
                    id={`category-${category}`}
                    checked={isSelected}
                    onChange={() => handleToggle(category)}
                    className="me-3"
                  />
                  <div>
                    <Card.Title className="mb-0 small fw-bold">
                      {category}
                    </Card.Title>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          )
        })}
      </Row>

      <div className="mt-4 text-center">
        <Badge bg="primary" className="px-3 py-2 fs-6">
          <i className="fas fa-check-circle me-2"></i>
          {selectedCategories.length} catégorie(s) sélectionnée(s)
        </Badge>
      </div>
    </div>
  )
}

export default Step1Categories