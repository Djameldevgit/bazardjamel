import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { useLocation, useHistory } from 'react-router-dom';
import CardBodyDescription from '../descriptionpost/CardBodyDescription';
import CardFooterDescriptionPrice from '../descriptionpost/CardFooterDescriptionPrice';
import CardFooterPrice from '../descriptionpost/CardFooterPrice';
import CardTitleDescription from '../descriptionpost/CardTitleDescription';
 
 
import CardBodyCarousel from '../home/post_card/CardBodyCarousel';

const PostCard = ({ post }) => {
  const location = useLocation();
  const history = useHistory();
  
  // Lógica para determinar qué mostrar
  const isHomePage = location.pathname === '/';
  const isDetailPage = location.pathname.includes('/post/');
  
  // Función para ir a detalles del post
  const handleViewDetails = () => {
    history.push(`/post/${post.id}`);
  };
  
  // Función para vista previa de título en home
  const getTitlePreview = () => {
    const { categorie, subCategory, marque, modele, titre } = post;
    
    if (titre && titre.length > 40) {
      return `${titre.substring(0, 40)}...`;
    }
    
    // Si no hay título, crear uno basado en categoría
    if (marque && modele) {
      return `${marque} ${modele}`;
    }
    
    return titre || 'Annonce';
  };

  // Función para vista previa de descripción
  const getDescriptionPreview = () => {
    if (!post.description) return '';
    return post.description.length > 100 
      ? `${post.description.substring(0, 100)}...` 
      : post.description;
  };

  return (
    <Card className="post-card shadow-sm border-0 mb-4 overflow-hidden">
      {/* Título completo - SOLO en página de detalles */}
      {isDetailPage && (
        <div className="card-title-detail p-3 border-bottom bg-light">
          <CardTitleDescription post={post} />
        </div>
      )}

      {/* En home y listados: Título simplificado */}
      {!isDetailPage && (
        <div 
          className="card-title-preview p-3 border-bottom bg-white cursor-pointer"
          onClick={handleViewDetails}
          style={{ cursor: 'pointer' }}
        >
          <h6 className="fw-bold mb-2 text-truncate" style={{ fontSize: '1rem' }}>
            {getTitlePreview()}
          </h6>
          
          <div className="d-flex justify-content-between align-items-center">
            <div className="location-info">
              {post.wilaya && (
                <Badge bg="light" text="dark" className="me-2">
                  📍 {post.wilaya}
                </Badge>
              )}
              {post.commune && (
                <small className="text-muted">• {post.commune}</small>
              )}
            </div>
            
            <div className="post-meta">
              {post.datePublication && (
                <small className="text-muted me-2">
                  {new Date(post.datePublication).toLocaleDateString('fr-FR')}
                </small>
              )}
              <small className="text-muted me-2">👁️ {post.views || 0}</small>
              <small className="text-muted">💬 {post.comments || 0}</small>
            </div>
          </div>
        </div>
      )}

      {/* Carousel - Siempre visible */}
      <CardBodyCarousel post={post} />

      {/* Cuerpo con detalles - OCULTO en home, visible en detalles y otras páginas */}
      {!isHomePage && (
        <div className="card-body-detail">
          <CardBodyDescription post={post} />
        </div>
      )}

      {/* En home, mostrar solo vista previa de descripción */}
      {isHomePage && post.description && (
        <div className="description-preview p-3 border-bottom bg-light">
          <p className="text-muted mb-2 small">
            {getDescriptionPreview()}
          </p>
          <button 
            className="btn btn-link p-0 text-decoration-none small"
            onClick={handleViewDetails}
          >
            Voir plus de détails →
          </button>
        </div>
      )}

      {/* Footer condicional */}
      {isHomePage ? (
        <CardFooterPrice post={post} />
      ) : isDetailPage ? (
        <CardFooterDescriptionPrice post={post} />
      ) : (
        <div className="simple-footer p-3 border-top bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <Badge bg="light" text="dark" className="me-2">
                📍 {post.wilaya || 'N/A'}
              </Badge>
              {post.commune && (
                <small className="text-muted">• {post.commune}</small>
              )}
            </div>
            
            <div className="d-flex align-items-center">
              {post.prix && (
                <span className="fw-bold text-success me-2">
                  {new Intl.NumberFormat('fr-FR').format(post.prix)} DA
                </span>
              )}
              <button 
                className="btn btn-outline-primary btn-sm"
                onClick={handleViewDetails}
              >
                Voir
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default React.memo(PostCard);