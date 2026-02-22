import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CustomFooter = ({ boutique }) => {
  const footer = boutique?.footer || {};
  
  return (
    <footer className="bg-dark text-white py-5 mt-5">
      <Container>
        <Row>
          {/* Informations de la boutique */}
          <Col md={4} className="mb-4">
            <h5>{boutique.nom_boutique}</h5>
            {boutique.description_boutique && (
              <p className="text-white-50 small">
                {boutique.description_boutique.substring(0, 150)}...
              </p>
            )}
          </Col>
          
          {/* Liens rapides */}
          <Col md={4} className="mb-4">
            <h5>Liens rapides</h5>
            <ul className="list-unstyled">
              <li><Link to={`/boutique/${boutique._id}`} className="text-white-50">Accueil</Link></li>
              <li><Link to={`/boutique/${boutique._id}/produits`} className="text-white-50">Produits</Link></li>
              <li><Link to={`/boutique/${boutique._id}/contact`} className="text-white-50">Contact</Link></li>
            </ul>
          </Col>
          
          {/* Contact */}
          <Col md={4} className="mb-4">
            <h5>Contact</h5>
            <ul className="list-unstyled text-white-50">
              {boutique.proprietaire?.telephone && (
                <li><i className="fas fa-phone me-2"></i> {boutique.proprietaire.telephone}</li>
              )}
              {boutique.proprietaire?.email && (
                <li><i className="fas fa-envelope me-2"></i> {boutique.proprietaire.email}</li>
              )}
              {boutique.proprietaire?.adresse && (
                <li><i className="fas fa-map-marker-alt me-2"></i> {boutique.proprietaire.adresse}</li>
              )}
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default CustomFooter;