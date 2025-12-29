import React from 'react';
import { Card, Container, Row, Col, Alert } from 'react-bootstrap';
import CardTitleDescription from './CardTitleDescription';
import CardBodyDescription from './CardBodyDescription';
import CardFooterDescription from './CardFooterDescription';

const DescriptionPost = ({ post, currentUser, onContact, onReport }) => {
  // Verificar si el post tiene datos
  if (!post) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          <Alert.Heading>Annonce non disponible</Alert.Heading>
          <p>Cette annonce a été supprimée ou n'existe pas.</p>
        </Alert>
      </Container>
    );
  }

  const {
    images = [],
    categorie,
    isPromoted,
    isUrgent,
    views = 0
  } = post;

  return (
    <Container className="description-post py-4">
      {/* Alertas de estado */}
      <Row className="mb-3">
        <Col>
          {isUrgent && (
            <Alert variant="danger" className="d-flex align-items-center mb-2">
              <span className="me-2">🚨</span>
              <span className="fw-bold">URGENT</span>
              <span className="ms-2">- Cette annonce nécessite une attention immédiate</span>
            </Alert>
          )}
          
          {isPromoted && (
            <Alert variant="info" className="d-flex align-items-center mb-2">
              <span className="me-2">⭐</span>
              <span className="fw-bold">ANNONCE PROMUE</span>
              <span className="ms-2">- Plus de visibilité</span>
            </Alert>
          )}
        </Col>
      </Row>

      <Row>
        {/* Columna principal - Contenido del post */}
        <Col lg={8} className="mb-4">
          <Card className="shadow-sm border-0">
            {/* Carousel de imágenes (si hay) */}
            {images.length > 0 && (
              <div className="post-images">
                {/* Aquí iría tu carousel de imágenes */}
                <div className="main-image-container" style={{
                  height: '400px',
                  backgroundColor: '#f8f9fa',
                  backgroundImage: `url(${images[0]})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '8px 8px 0 0'
                }}>
                  {images.length > 1 && (
                    <div className="image-counter">
                      <span className="badge bg-dark bg-opacity-75 p-2">
                        📷 {images.length} photos
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <Card.Body className="p-4">
              {/* Título dinámico */}
              <CardTitleDescription post={post} />
              
              {/* Estadísticas */}
              <div className="post-stats d-flex gap-3 mt-3 mb-4 pb-3 border-bottom">
                <div className="stat-item">
                  <span className="stat-icon me-1">👁️</span>
                  <span className="stat-value fw-medium">{views}</span>
                  <span className="stat-label text-muted ms-1">vues</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon me-1">💾</span>
                  <span className="stat-value fw-medium">{post.saves || 0}</span>
                  <span className="stat-label text-muted ms-1">sauvegardes</span>
                </div>
                <div className="stat-item">
                  <span className="stat-icon me-1">📞</span>
                  <span className="stat-value fw-medium">{post.contacts || 0}</span>
                  <span className="stat-label text-muted ms-1">contacts</span>
                </div>
              </div>

              {/* Cuerpo con campos específicos */}
              <CardBodyDescription post={post} />
            </Card.Body>
          </Card>

          {/* Botones de acción */}
          <div className="action-buttons mt-3 d-flex gap-2">
            <button 
              className="btn btn-outline-primary d-flex align-items-center"
              onClick={() => onContact && onContact('whatsapp')}
            >
              <span className="me-2">💬</span>
              Contacter
            </button>
            <button 
              className="btn btn-outline-secondary d-flex align-items-center"
              onClick={() => {
                // Función para guardar/unsave
              }}
            >
              <span className="me-2">💾</span>
              Sauvegarder
            </button>
            <button 
              className="btn btn-outline-danger d-flex align-items-center"
              onClick={() => onReport && onReport(post.id)}
            >
              <span className="me-2">🚩</span>
              Signaler
            </button>
            <button 
              className="btn btn-outline-info d-flex align-items-center"
              onClick={() => window.print()}
            >
              <span className="me-2">🖨️</span>
              Imprimer
            </button>
          </div>
        </Col>

        {/* Columna lateral - Info de contacto */}
        <Col lg={4}>
          <CardFooterDescription post={post} currentUser={currentUser} />
          
          {/* Anuncios similares (opcional) */}
          <Card className="mt-4 border-0 shadow-sm">
            <Card.Header className="bg-light border-0">
              <h6 className="mb-0">📌 Annonces similaires</h6>
            </Card.Header>
            <Card.Body>
              <p className="text-muted small">
                Les annonces similaires apparaîtront ici.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Estilos globales */}
      <style>{`
        .description-post {
          animation: fadeIn 0.3s ease;
        }
        
        .post-images .main-image-container {
          position: relative;
        }
        
        .post-images .image-counter {
          position: absolute;
          bottom: 15px;
          right: 15px;
        }
        
        .post-stats {
          font-size: 0.9rem;
        }
        
        .stat-item {
          padding: 0.5rem 1rem;
          background-color: #f8f9fa;
          border-radius: 6px;
          border: 1px solid #e9ecef;
        }
        
        .action-buttons .btn {
          flex: 1;
          justify-content: center;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 768px) {
          .action-buttons {
            flex-direction: column;
          }
          
          .action-buttons .btn {
            width: 100%;
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </Container>
  );
};

export default DescriptionPost;