// src/components/SlidersCategories/CategorySection.jsx - VERSIÓN CORREGIDA
import React from 'react';
import { Row, Col, Button, Alert } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

// ⭐ SI NO TIENES PostCard, usa este componente básico:
const DefaultPostCard = ({ post, onClick }) => {
  const defaultImage = 'https://via.placeholder.com/300x200/cccccc/666666?text=No+Image';
  
  return (
    <Col xs={12} sm={6} md={4} lg={3} className="mb-4">
      <div 
        className="card h-100 shadow-sm border-0 cursor-pointer"
        onClick={() => onClick(post._id)}
        style={{ cursor: 'pointer' }}
      >
        <div className="position-relative" style={{ height: '150px', overflow: 'hidden' }}>
          <img
            src={post.images && post.images[0] ? post.images[0] : defaultImage}
            alt={post.title}
            className="img-fluid w-100 h-100"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className="card-body d-flex flex-column">
          <h6 className="card-title mb-2 text-truncate">{post.title || 'Sin título'}</h6>
          <p className="card-text small text-muted flex-grow-1">
            {post.description ? 
              (post.description.length > 60 ? `${post.description.substring(0, 60)}...` : post.description) 
              : 'Sin descripción'}
          </p>
          <div className="d-flex justify-content-between align-items-center mt-auto">
            <span className="fw-bold text-primary">
              ${post.price ? parseFloat(post.price).toFixed(2) : '0.00'}
            </span>
            <Button 
              variant="outline-primary" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onClick(post._id);
              }}
            >
              Ver
            </Button>
          </div>
        </div>
      </div>
    </Col>
  );
};

const CategorySection = ({ 
  category, 
  onViewMore, 
  onPostClick,
  postCardComponent: PostCard = DefaultPostCard 
}) => {
  const history = useHistory();
  
  // Si no hay categoría, no renderizar
  if (!category) return null;
  
  // Verificar si hay posts
  const hasPosts = category.posts && category.posts.length > 0;
  
  // Manejar clic en post (si no se pasa prop, redirige por defecto)
  const handlePostClick = (postId) => {
    if (onPostClick) {
      onPostClick(postId);
    } else {
      history.push(`/post/${postId}`);
    }
  };

  return (
    <section className="mb-5">
      {/* Encabezado de la categoría */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
        <div>
          <h3 className="h4 mb-1">
            {category.icon && <span className="me-2">{category.icon}</span>}
            {category.name || 'Categoría sin nombre'}
          </h3>
          <p className="text-muted small mb-0">
            {hasPosts ? `${category.posts.length} productos disponibles` : 'No hay productos aún'}
          </p>
        </div>
        
        {hasPosts && onViewMore && (
          <Button 
            variant="outline-primary" 
            size="sm"
            onClick={() => onViewMore(category.slug || category._id)}
          >
            Ver todos →
          </Button>
        )}
      </div>
      
      {/* Grid de posts */}
      {hasPosts ? (
        <Row>
          {category.posts.map((post) => (
            <PostCard 
              key={post._id} 
              post={post} 
              onClick={handlePostClick}
            />
          ))}
        </Row>
      ) : (
        <Alert variant="info" className="text-center">
          <p className="mb-2">No hay productos en esta categoría</p>
          <Button 
            variant="primary" 
            size="sm"
            onClick={() => history.push('/create-post')}
          >
            Sé el primero en publicar
          </Button>
        </Alert>
      )}
      
      {/* Separador */}
      <hr className="my-4" />
    </section>
  );
};

export default CategorySection;