import React from 'react';
import { Nav, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const SimpleSidebar = ({ boutique }) => {
  const categories = boutique?.sidebar?.categories || [
    { name: 'Tous les produits', slug: 'all', count: 24 },
    { name: 'Nouveautés', slug: 'new', count: 5 },
    { name: 'Promotions', slug: 'promo', count: 8 }
  ];
  
  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <h5 className="mb-3">
          <i className="fas fa-store me-2 text-primary"></i>
          Catégories
        </h5>
        
        <Nav className="flex-column">
          {categories.slice(0, boutique.features?.maxCategories || 5).map((cat, idx) => (
            <Nav.Link 
              key={idx}
              as={Link}
              to={`/boutique/${boutique._id}/categorie/${cat.slug}`}
              className="d-flex justify-content-between align-items-center px-0 py-2"
            >
              <span>
                {cat.icon && <i className={`${cat.icon} me-2`}></i>}
                {cat.name}
              </span>
              {cat.count && <Badge bg="secondary" pill>{cat.count}</Badge>}
            </Nav.Link>
          ))}
        </Nav>
        
        {/* Información de contacto básica */}
        <hr />
        <div className="small">
          <p className="mb-1">
            <i className="fas fa-phone me-2 text-primary"></i>
            {boutique.proprietaire?.telephone || 'Non renseigné'}
          </p>
          <p className="mb-0">
            <i className="fas fa-envelope me-2 text-primary"></i>
            {boutique.proprietaire?.email || 'Non renseigné'}
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SimpleSidebar;