import React from 'react';
import { Card, Container, Row, Col, Alert, Badge, Button, Spinner } from 'react-bootstrap';
import CardTitleDescription from './CardTitleDescription';
import CardBodyDescription from './CardBodyDescription';
import CardFooterDescription from './CardFooterDescription';
import PostCard from '../postcards/PostCard';

const DescriptionPost = ({ 
  post, 
  currentUser, 
  onContact, 
  onReport, 
  similarPosts = [],
  loadingSimilar = false,
  onLoadMoreSimilar
}) => {
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
    views = 0,
    saves = 0,
    contacts = 0,
    createdAt
  } = post;

  // Formatear fecha de creación
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

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
          <Card className="shadow-sm border-0 overflow-hidden">
            {/* Carousel de imágenes */}
            {images.length > 0 && (
              <div className="post-images position-relative">
                <div 
                  className="main-image-container"
                  style={{
                    height: '400px',
                    backgroundColor: '#f8f9fa',
                    backgroundImage: `url(${images[0]?.url || images[0]})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Badge contador de fotos */}
                  {images.length > 1 && (
                    <Badge 
                      bg="dark" 
                      className="position-absolute bottom-0 end-0 m-3 opacity-75"
                    >
                      📷 {images.length} photos
                    </Badge>
                  )}
                  
                  {/* Badge de categoría */}
                  <Badge 
                    bg="primary" 
                    className="position-absolute top-0 start-0 m-3"
                  >
                    {categorie}
                  </Badge>
                </div>
              </div>
            )}

            <Card.Body className="p-4">
              {/* Título dinámico */}
              <CardTitleDescription post={post} />
              
              {/* Fecha de publicación */}
              <div className="text-muted small mb-3">
                <span className="me-2">📅</span>
                Publié le {formatDate(createdAt)}
                {post.updatedAt && post.updatedAt !== createdAt && (
                  <span className="ms-2">
                    • Mise à jour: {formatDate(post.updatedAt)}
                  </span>
                )}
              </div>

              {/* Estadísticas */}
              <div className="post-stats d-flex gap-3 mt-3 mb-4 pb-3 border-bottom">
                <div className="stat-item text-center">
                  <div className="stat-icon">👁️</div>
                  <div className="stat-value fw-medium">{views}</div>
                  <div className="stat-label text-muted small">vues</div>
                </div>
                <div className="stat-item text-center">
                  <div className="stat-icon">💾</div>
                  <div className="stat-value fw-medium">{saves}</div>
                  <div className="stat-label text-muted small">sauvegardes</div>
                </div>
                <div className="stat-item text-center">
                  <div className="stat-icon">📞</div>
                  <div className="stat-value fw-medium">{contacts}</div>
                  <div className="stat-label text-muted small">contacts</div>
                </div>
                <div className="stat-item text-center">
                  <div className="stat-icon">❤️</div>
                  <div className="stat-value fw-medium">{post.likes?.length || 0}</div>
                  <div className="stat-label text-muted small">favoris</div>
                </div>
              </div>

              {/* Cuerpo con campos específicos */}
              <CardBodyDescription post={post} />
            </Card.Body>
          </Card>

          {/* Botones de acción */}
          <div className="action-buttons mt-3 d-flex flex-wrap gap-2">
            <Button 
              variant="outline-primary" 
              className="d-flex align-items-center flex-grow-1"
              onClick={() => onContact && onContact('whatsapp')}
            >
              <span className="me-2">💬</span>
              Contacter
            </Button>
            <Button 
              variant="outline-secondary" 
              className="d-flex align-items-center flex-grow-1"
              onClick={() => {
                // Función para guardar/unsave
                console.log('Sauvegarder', post._id);
              }}
            >
              <span className="me-2">💾</span>
              Sauvegarder
            </Button>
            <Button 
              variant="outline-danger" 
              className="d-flex align-items-center flex-grow-1"
              onClick={() => onReport && onReport(post._id)}
            >
              <span className="me-2">🚩</span>
              Signaler
            </Button>
            <Button 
              variant="outline-info" 
              className="d-flex align-items-center flex-grow-1"
              onClick={() => window.print()}
            >
              <span className="me-2">🖨️</span>
              Imprimer
            </Button>
          </div>
        </Col>

        {/* Columna lateral - Solo info de contacto */}
        <Col lg={4}>
          <CardFooterDescription post={post} currentUser={currentUser} />
        </Col>
      </Row>

      {/* SECCIÓN DE ANUNCIOS SIMILARES - Debajo de todo */}
      <div className="similar-posts-section mt-5">
        {/* Encabezado */}
        <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
          <div>
            <h4 className="mb-0">
              <span className="me-2">📌</span>
              Annonces similaires
              {similarPosts.length > 0 && (
                <Badge bg="primary" className="ms-2">
                  {similarPosts.length}
                </Badge>
              )}
            </h4>
            <p className="text-muted small mb-0 mt-1">
              Autres annonces de la catégorie <strong>{categorie}</strong>
            </p>
          </div>
          
          {similarPosts.length > 0 && (
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={onLoadMoreSimilar}
            >
              Voir plus
            </Button>
          )}
        </div>

        {/* Loading state */}
        {loadingSimilar && (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">
              Recherche d'annonces similaires...
            </p>
          </div>
        )}

        {/* Grid de posts similares */}
        {!loadingSimilar && similarPosts.length > 0 && (
          <>
            <Row xs={1} md={2} lg={3} className="g-4">
              {similarPosts.map((similarPost) => (
                <Col key={similarPost._id || similarPost.id}>
                  <PostCard post={similarPost} />
                </Col>
              ))}
            </Row>
            
            {/* Botón ver más */}
            <div className="text-center mt-4 pt-3 border-top">
  <Button 
    variant="primary" 
    onClick={onLoadMoreSimilar}  // ← Esta prop ahora viene de DetailPostCard
    disabled={loadingSimilar}
    className="px-4"
  >
    {loadingSimilar ? 'Chargement...' : 'Voir plus d\'annonces similaires →'}
  </Button>
  
  {/* Botón explorar categoría */}
  <Button 
    variant="outline-secondary" 
    onClick={onExploreCategory}  // ← Nueva prop
    className="ms-3"
  >
    Explorer toute la catégorie
  </Button>
</div>
          </>
        )}

        {/* Estado vacío */}
        {!loadingSimilar && similarPosts.length === 0 && (
          <Card className="border-0 shadow-sm">
            <Card.Header className="bg-light border-0">
              <h5 className="mb-0 d-flex align-items-center">
                <span className="me-2">📌</span>
                Annonces similaires
              </h5>
            </Card.Header>
            <Card.Body className="text-center py-5">
              <div className="mb-3" style={{ fontSize: '3rem' }}>
                🔍
              </div>
              <h6 className="text-muted mb-3">
                Aucune annonce similaire pour le moment
              </h6>
              <p className="text-muted small mb-4">
                Nous n'avons pas trouvé d'annonces similaires dans la catégorie 
                <strong className="ms-1">"{categorie}"</strong>.
              </p>
              <Button 
                variant="primary" 
                href={`/category/${categorie}`}
                className="mt-2"
              >
                Explorer la catégorie {categorie}
              </Button>
            </Card.Body>
          </Card>
        )}
      </div>

      {/* Estilos globales */}
      <style>{`
        .description-post {
          animation: fadeIn 0.3s ease;
        }
        
        .post-images .main-image-container {
          transition: transform 0.3s ease;
        }
        
        .post-images:hover .main-image-container {
          transform: scale(1.01);
        }
        
        .post-stats {
          font-size: 0.9rem;
        }
        
        .stat-item {
          padding: 0.75rem;
          background-color: #f8f9fa;
          border-radius: 8px;
          border: 1px solid #e9ecef;
          min-width: 80px;
          transition: all 0.2s ease;
        }
        
        .stat-item:hover {
          background-color: #e9ecef;
          transform: translateY(-2px);
        }
        
        .stat-icon {
          font-size: 1.2rem;
          margin-bottom: 0.25rem;
        }
        
        .stat-value {
          font-size: 1.1rem;
          color: #2d3748;
        }
        
        .action-buttons .btn {
          min-width: 140px;
          justify-content: center;
        }
        
        .similar-posts-section {
          animation: slideUp 0.5s ease;
        }
        
        .similar-posts-section h4 {
          color: #2d3748;
          font-weight: 600;
        }
        
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(10px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        /* Responsive */
        @media (max-width: 992px) {
          .main-image-container {
            height: 350px !important;
          }
        }
        
        @media (max-width: 768px) {
          .main-image-container {
            height: 300px !important;
          }
          
          .action-buttons {
            flex-direction: column;
          }
          
          .action-buttons .btn {
            width: 100%;
            margin-bottom: 0.5rem;
          }
          
          .post-stats {
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .stat-item {
            min-width: 70px;
            padding: 0.5rem;
          }
        }
        
        @media (max-width: 576px) {
          .main-image-container {
            height: 250px !important;
          }
          
          .similar-posts-section .row {
            margin: 0 -5px;
          }
        }
      `}</style>
    </Container>
  );
};

export default DescriptionPost;