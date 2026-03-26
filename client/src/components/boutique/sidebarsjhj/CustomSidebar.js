import React from 'react';
import { Nav, Card, Badge, ListGroup, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CustomSidebar = ({ boutique }) => {
  const categories = boutique?.sidebar?.categories || [];
  const customContent = boutique?.sidebar?.customContent;
  
  return (
    <div className="boutique-sidebar-custom">
      {/* Logo o imagen de perfil */}
      {boutique.images?.[0] && (
        <div className="text-center mb-4">
          <Image 
            src={boutique.images[0].url}
            roundedCircle
            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
          />
          <h5 className="mt-3">{boutique.nom_boutique}</h5>
        </div>
      )}
      
      {/* Contenido personalizado HTML */}
      {customContent && (
        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body dangerouslySetInnerHTML={{ __html: customContent }} />
        </Card>
      )}
      
      {/* Categorías */}
      <Card className="mb-4 border-0 shadow-sm">
        <Card.Body>
          <h5 className="mb-3">
            <i className="fas fa-tags me-2 text-primary"></i>
            Nos catégories
          </h5>
          
          <Nav className="flex-column">
            {categories.map((cat, idx) => (
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
                {cat.count && <Badge bg="primary" pill>{cat.count}</Badge>}
              </Nav.Link>
            ))}
          </Nav>
        </Card.Body>
      </Card>
      
      {/* Réseaux sociaux */}
      {(boutique.reseaux_sociaux?.facebook || 
        boutique.reseaux_sociaux?.instagram || 
        boutique.reseaux_sociaux?.whatsapp) && (
        <Card className="border-0 shadow-sm">
          <Card.Body>
            <h5 className="mb-3">
              <i className="fas fa-share-alt me-2 text-primary"></i>
              Suivez-nous
            </h5>
            <div className="d-flex gap-2">
              {boutique.reseaux_sociaux?.facebook && (
                <a href={boutique.reseaux_sociaux.facebook} target="_blank" rel="noopener noreferrer" 
                   className="btn btn-outline-primary btn-sm">
                  <i className="fab fa-facebook-f"></i>
                </a>
              )}
              {boutique.reseaux_sociaux?.instagram && (
                <a href={boutique.reseaux_sociaux.instagram} target="_blank" rel="noopener noreferrer"
                   className="btn btn-outline-danger btn-sm">
                  <i className="fab fa-instagram"></i>
                </a>
              )}
              {boutique.reseaux_sociaux?.whatsapp && (
                <a href={`https://wa.me/${boutique.reseaux_sociaux.whatsapp}`} target="_blank" rel="noopener noreferrer"
                   className="btn btn-outline-success btn-sm">
                  <i className="fab fa-whatsapp"></i>
                </a>
              )}
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default CustomSidebar;