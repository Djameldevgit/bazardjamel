// components/boutique/BoutiqueFooter.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { 
  FaStore, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaGlobe,
  FaFacebook, 
  FaInstagram, 
  FaTiktok, 
  FaWhatsapp,
  FaRegClock,
  FaShieldAlt,
  FaLock
} from 'react-icons/fa';

const BoutiqueFooter = ({ boutique }) => {
  const {
    nom_boutique,
    proprietaire,
    reseaux_sociaux,
    date_debut,
    plan,
    couleur_theme = '#2563eb'
  } = boutique;

  const dateDebut = date_debut ? new Date(date_debut).toLocaleDateString('fr-FR') : 'N/A';

  return (
    <footer 
      className="boutique-footer mt-5 py-4"
      style={{
        backgroundColor: '#f8f9fa',
        borderTop: `3px solid ${couleur_theme}`
      }}
    >
      <Container>
        <Row>
          {/* Columna 1: Información de la boutique */}
          <Col lg={4} md={6} className="mb-4 mb-lg-0">
            <div className="d-flex align-items-center mb-3">
              <FaStore 
                size={30} 
                style={{ color: couleur_theme }}
                className="me-2"
              />
              <h5 className="mb-0 fw-bold">{nom_boutique}</h5>
            </div>
            <p className="text-muted small mb-3">
              <FaRegClock className="me-2" />
              Membre depuis: {dateDebut}
            </p>
            <p className="text-muted small">
              <FaShieldAlt className="me-2" style={{ color: couleur_theme }} />
              Plan: <span className="fw-bold text-capitalize">{plan}</span>
            </p>
            <p className="text-muted small">
              <FaLock className="me-2" style={{ color: couleur_theme }} />
              Paiements sécurisés
            </p>
          </Col>

          {/* Columna 2: Contacto */}
          <Col lg={4} md={6} className="mb-4 mb-lg-0">
            <h6 className="fw-bold mb-3">Contact</h6>
            {proprietaire?.wilaya && (
              <p className="text-muted small mb-2">
                <FaMapMarkerAlt className="me-2 text-danger" />
                {proprietaire.wilaya}
                {proprietaire.adresse && `, ${proprietaire.adresse}`}
              </p>
            )}
            {proprietaire?.telephone && (
              <p className="text-muted small mb-2">
                <FaPhone className="me-2 text-primary" />
                <a 
                  href={`tel:${proprietaire.telephone}`}
                  className="text-decoration-none text-muted"
                >
                  {proprietaire.telephone}
                </a>
              </p>
            )}
            {proprietaire?.email && (
              <p className="text-muted small mb-2">
                <FaEnvelope className="me-2 text-danger" />
                <a 
                  href={`mailto:${proprietaire.email}`}
                  className="text-decoration-none text-muted"
                >
                  {proprietaire.email}
                </a>
              </p>
            )}
          </Col>

          {/* Columna 3: Redes Sociales */}
          <Col lg={4} md={12}>
            <h6 className="fw-bold mb-3">Suivez-nous</h6>
            <div className="social-links">
              {reseaux_sociaux?.facebook && (
                <a 
                  href={reseaux_sociaux.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline-primary btn-sm me-2 mb-2"
                >
                  <FaFacebook className="me-1" /> Facebook
                </a>
              )}
              {reseaux_sociaux?.instagram && (
                <a 
                  href={reseaux_sociaux.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline-danger btn-sm me-2 mb-2"
                >
                  <FaInstagram className="me-1" /> Instagram
                </a>
              )}
              {reseaux_sociaux?.tiktok && (
                <a 
                  href={reseaux_sociaux.tiktok} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline-dark btn-sm me-2 mb-2"
                >
                  <FaTiktok className="me-1" /> TikTok
                </a>
              )}
              {reseaux_sociaux?.whatsapp && (
                <a 
                  href={`https://wa.me/${reseaux_sociaux.whatsapp.replace(/\s/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline-success btn-sm me-2 mb-2"
                >
                  <FaWhatsapp className="me-1" /> WhatsApp
                </a>
              )}
              {reseaux_sociaux?.website && (
                <a 
                  href={reseaux_sociaux.website} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline-secondary btn-sm me-2 mb-2"
                >
                  <FaGlobe className="me-1" /> Site web
                </a>
              )}
            </div>
          </Col>
        </Row>

        {/* Copyright */}
        <hr className="my-4" />
        <Row>
          <Col className="text-center">
            <p className="text-muted small mb-0">
              © {new Date().getFullYear()} {nom_boutique}. Tous droits réservés.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default BoutiqueFooter;