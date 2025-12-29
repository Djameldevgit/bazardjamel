import React, { useState } from 'react';
import { Card, Button, Modal, Form } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Person, GeoAlt, Phone, Whatsapp, Envelope, Messenger, Clock, ShieldCheck, Star } from 'react-bootstrap-icons';

const CardFooterDescription = ({ post, currentUser }) => {
  const { t } = useTranslation();
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');
  const [showContact, setShowContact] = useState(false);

  const {
    user = {},
    wilaya,
    commune,
    datePublication,
    contactPhone,
    contactWhatsapp,
    contactViber
  } = post;

  // Formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Determinar si mostrar teléfono completo
  const shouldShowFullPhone = currentUser?.isLoggedIn || showContact;

  // Renderizar rating del usuario
  const renderUserRating = () => {
    const rating = user.rating || 4.5;
    const reviews = user.reviews || 12;
    
    return (
      <div className="user-rating d-flex align-items-center mt-2">
        <div className="stars me-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              className={i < Math.floor(rating) ? "text-warning" : "text-muted"} 
              fill={i < rating ? "currentColor" : "none"}
            />
          ))}
        </div>
        <span className="rating-value fw-medium">{rating.toFixed(1)}</span>
        <span className="reviews-count text-muted ms-2">({reviews} avis)</span>
      </div>
    );
  };

  return (
    <div className="card-footer-description">
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-light border-0">
          <h5 className="mb-0 d-flex align-items-center">
            <Person className="me-2" />
            Contact & Coordonnées
          </h5>
        </Card.Header>
        
        <Card.Body>
          {/* Información del usuario */}
          <div className="user-info mb-4">
            <div className="d-flex align-items-start">
              <div className="user-avatar me-3">
                <div className="avatar-placeholder bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" 
                     style={{ width: '60px', height: '60px', fontSize: '1.5rem' }}>
                  {user.username?.charAt(0).toUpperCase() || 'U'}
                </div>
              </div>
              <div className="user-details flex-grow-1">
                <h6 className="user-name mb-1 fw-bold">
                  {user.username || 'Anonyme'}
                  {user.isVerified && (
                    <ShieldCheck className="ms-2 text-primary" size={18} />
                  )}
                </h6>
                {renderUserRating()}
                <div className="user-stats text-muted small mt-2">
                  <span className="me-3">
                    <Clock size={12} className="me-1" />
                    Membre depuis {user.memberSince || '2023'}
                  </span>
                  <span>
                    📋 {user.totalPosts || '0'} annonces
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="location-section mb-4">
            <h6 className="section-title mb-3 d-flex align-items-center">
              <GeoAlt className="me-2" />
              Localisation
            </h6>
            <div className="location-details">
              <div className="location-item mb-2">
                <strong>Wilaya:</strong>
                <span className="ms-2">{wilaya || 'Non spécifiée'}</span>
              </div>
              <div className="location-item">
                <strong>Commune:</strong>
                <span className="ms-2">{commune || 'Non spécifiée'}</span>
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="contact-section">
            <h6 className="section-title mb-3">Contactez le vendeur</h6>
            
            {/* Botones de contacto */}
            <div className="contact-buttons d-flex flex-wrap gap-2 mb-3">
              {/* Mensaje interno */}
              <Button 
                variant="primary" 
                className="d-flex align-items-center"
                onClick={() => setShowMessageModal(true)}
              >
                <Envelope className="me-2" />
                Message privé
              </Button>

              {/* WhatsApp */}
              {contactWhatsapp && (
                <Button 
                  variant="success" 
                  className="d-flex align-items-center"
                  href={`https://wa.me/${contactWhatsapp}`}
                  target="_blank"
                >
                  <Whatsapp className="me-2" />
                  WhatsApp
                </Button>
              )}

              {/* Mostrar teléfono */}
              {contactPhone && (
                <Button 
                  variant="outline-secondary" 
                  className="d-flex align-items-center"
                  onClick={() => setShowContact(!showContact)}
                >
                  <Phone className="me-2" />
                  {shouldShowFullPhone ? contactPhone : 'Voir le numéro'}
                </Button>
              )}
            </div>

            {/* Información de contacto revelada */}
            {showContact && contactPhone && (
              <div className="contact-details p-3 bg-light rounded mt-3">
                <div className="contact-item mb-2">
                  <strong>Téléphone:</strong>
                  <span className="ms-2 fw-bold">{contactPhone}</span>
                </div>
                {contactWhatsapp && (
                  <div className="contact-item mb-2">
                    <strong>WhatsApp:</strong>
                    <span className="ms-2 fw-bold">{contactWhatsapp}</span>
                  </div>
                )}
                {contactViber && (
                  <div className="contact-item">
                    <strong>Viber:</strong>
                    <span className="ms-2 fw-bold">{contactViber}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Información de publicación */}
          <div className="publication-info mt-4 pt-3 border-top">
            <div className="text-muted small d-flex justify-content-between">
              <span>
                <Clock size={12} className="me-1" />
                Publié le {datePublication ? formatDate(datePublication) : 'Date inconnue'}
              </span>
              <span>ID: {post.id?.substring(0, 8) || 'N/A'}</span>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Modal para enviar mensaje */}
      <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center">
            <Messenger className="me-2" />
            Message pour {user.username || 'le vendeur'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Votre message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder={`Bonjour, je suis intéressé par votre annonce "${post.titre || ''}"...`}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Form.Group>
            <div className="alert alert-info small">
              <strong>ℹ️ Information:</strong> Votre message sera envoyé directement au vendeur via le système de messagerie interne.
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMessageModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="primary" 
            onClick={() => {
              // Enviar mensaje
              console.log('Enviando mensaje:', message);
              setShowMessageModal(false);
              setMessage('');
            }}
            disabled={!message.trim()}
          >
            Envoyer le message
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Styles */}
      <style>{`
        .card-footer-description {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .user-avatar .avatar-placeholder {
          font-weight: bold;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .user-name {
          color: #2d3748;
          font-size: 1.1rem;
        }
        
        .section-title {
          color: #4a5568;
          font-size: 1rem;
          font-weight: 600;
        }
        
        .location-item, .contact-item {
          display: flex;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid #f7fafc;
        }
        
        .location-item:last-child, .contact-item:last-child {
          border-bottom: none;
        }
        
        .contact-buttons .btn {
          flex: 1;
          min-width: 140px;
          justify-content: center;
        }
        
        .stars .text-warning {
          color: #f6ad55 !important;
        }
        
        .publication-info {
          font-size: 0.85rem;
        }
        
        @media (max-width: 768px) {
          .contact-buttons .btn {
            min-width: 100%;
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default CardFooterDescription;