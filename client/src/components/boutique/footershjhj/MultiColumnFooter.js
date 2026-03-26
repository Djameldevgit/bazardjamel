import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const MultiColumnFooter = ({ boutique }) => {
  const footer = boutique?.footer || {};
  const columns = footer.columns || [
    {
      title: 'À propos',
      links: [
        { text: 'Notre histoire', url: '/about' },
        { text: 'Nos valeurs', url: '/values' },
        { text: 'Carrières', url: '/careers' }
      ]
    },
    {
      title: 'Services',
      links: [
        { text: 'Support', url: '/support' },
        { text: 'FAQ', url: '/faq' },
        { text: 'Conditions', url: '/terms' }
      ]
    },
    {
      title: 'Contact',
      links: [
        { text: 'Email', url: 'mailto:contact@boutique.com' },
        { text: 'Téléphone', url: 'tel:+213555555555' },
        { text: 'WhatsApp', url: 'https://wa.me/213555555555' }
      ]
    }
  ];
  
  return (
    <footer className="bg-dark text-white py-5 mt-5">
      <Container>
        <Row>
          {columns.map((column, idx) => (
            <Col key={idx} md={4} className="mb-4">
              <h5>{column.title}</h5>
              <ul className="list-unstyled">
                {column.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <Link to={link.url} className="text-white-50">
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </Col>
          ))}
        </Row>
        
        {/* Barre sociale */}
        {footer.social && Object.values(footer.social).some(Boolean) && (
          <Row className="mt-4 pt-4 border-top border-secondary">
            <Col className="text-center">
              <div className="d-flex justify-content-center gap-3">
                {footer.social.facebook && (
                  <a href={footer.social.facebook} target="_blank" rel="noopener noreferrer"
                     className="text-white-50">
                    <i className="fab fa-facebook-f fa-lg"></i>
                  </a>
                )}
                {footer.social.instagram && (
                  <a href={footer.social.instagram} target="_blank" rel="noopener noreferrer"
                     className="text-white-50">
                    <i className="fab fa-instagram fa-lg"></i>
                  </a>
                )}
                {footer.social.twitter && (
                  <a href={footer.social.twitter} target="_blank" rel="noopener noreferrer"
                     className="text-white-50">
                    <i className="fab fa-twitter fa-lg"></i>
                  </a>
                )}
                {footer.social.youtube && (
                  <a href={footer.social.youtube} target="_blank" rel="noopener noreferrer"
                     className="text-white-50">
                    <i className="fab fa-youtube fa-lg"></i>
                  </a>
                )}
              </div>
            </Col>
          </Row>
        )}
        
        {/* Copyright */}
        <Row className="mt-4">
          <Col className="text-center text-white-50 small">
            © {new Date().getFullYear()} {boutique.nom_boutique}. {footer.copyright || 'Tous droits réservés.'}
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default MultiColumnFooter;