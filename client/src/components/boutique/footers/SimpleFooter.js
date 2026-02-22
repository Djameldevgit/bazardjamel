import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const SimpleFooter = ({ boutique }) => {
  const year = new Date().getFullYear();
  
  return (
    <footer className="bg-light py-4 mt-5">
      <Container>
        <Row>
          <Col className="text-center">
            <p className="mb-2">
              <strong>{boutique.nom_boutique}</strong> - {boutique.slogan_boutique}
            </p>
            <p className="text-muted small mb-0">
              © {year} Tous droits réservés
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default SimpleFooter;