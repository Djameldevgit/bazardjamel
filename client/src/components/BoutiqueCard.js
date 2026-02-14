// 📂 components/BoutiqueCard.jsx
import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { Star, CheckCircle, GeoAlt, Tag } from 'react-bootstrap-icons'; // ✅ Corregido

const BoutiqueCard = ({ boutique }) => {
  const history = useHistory();

  const handleClick = () => {
    history.push(`/boutique/${boutique._id}`);
  };

  // Obtener emoji de la primera categoría
  const getCategoryEmoji = () => {
    if (boutique.categories_produits && boutique.categories_produits.length > 0) {
      return boutique.categories_produits[0].level1Emoji || '🏪';
    }
    return '🏪';
  };

  // Obtener nombre de la categoría principal
  const getCategoryName = () => {
    if (boutique.categories_produits && boutique.categories_produits.length > 0) {
      return boutique.categories_produits[0].level1Name;
    }
    return boutique.categorie || 'Boutique';
  };

  // Determinar el estado de la boutique
  const getBoutiqueStatus = () => {
    if (boutique.isVerified) return { text: '✓ Vérifiée', variant: 'success' };
    return { text: '⏳ En attente', variant: 'warning' };
  };

  return (
    <Card 
      className="boutique-card h-100 border-0 shadow-sm hover-lift"
      onClick={handleClick}
      style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
    >
      <div className="position-relative">
        {/* Logo o emoji */}
        <div 
          className="d-flex align-items-center justify-content-center"
          style={{
            height: '160px',
            background: `linear-gradient(135deg, ${boutique.couleur_theme || '#2563eb'}20, #f8f9fa)`,
            borderTopLeftRadius: '0.375rem',
            borderTopRightRadius: '0.375rem'
          }}
        >
          {boutique.avatar?.url ? (  // ✅ Cambiado de 'logo' a 'avatar'
            <img 
              src={boutique.avatar.url} 
              alt={boutique.nom_boutique}
              style={{ 
                width: '100px', 
                height: '100px', 
                objectFit: 'contain',
                borderRadius: '12px'
              }}
            />
          ) : (
            <span style={{ fontSize: '4rem' }}>
              {getCategoryEmoji()}
            </span>
          )}
        </div>

        {/* Badge de estado */}
        <Badge 
          bg={getBoutiqueStatus().variant}
          className="position-absolute top-0 end-0 m-2"
          pill
        >
          {getBoutiqueStatus().text}
        </Badge>
      </div>

      <Card.Body className="d-flex flex-column">
        <div className="d-flex align-items-center mb-2">
          <h6 className="fw-bold mb-0 text-truncate" style={{ maxWidth: 'calc(100% - 24px)' }}>
            {boutique.nom_boutique}
          </h6>
          {boutique.isVerified && (
            <CheckCircle className="text-success ms-1" size={16} />
          )}
        </div>

        {boutique.slogan_boutique && (
          <p className="small text-muted text-truncate mb-2">
            {boutique.slogan_boutique}
          </p>
        )}

        <div className="d-flex align-items-center text-muted small mb-2">
          <Tag size={14} className="me-1" />
          <span className="text-truncate">{getCategoryName()}</span>
        </div>

        {boutique.proprietaire?.wilaya && (
          <div className="d-flex align-items-center text-muted small">
            <GeoAlt size={14} className="me-1" />
            <span className="text-truncate">{boutique.proprietaire.wilaya}</span>
          </div>
        )}

        {/* Categorías como badges */}
        {boutique.categories_produits && boutique.categories_produits.length > 0 && (
          <div className="mt-2 d-flex flex-wrap gap-1">
            {boutique.categories_produits.slice(0, 2).map((cat, idx) => (
              <Badge 
                key={idx}
                bg="light" 
                text="dark" 
                className="small"
                style={{ fontSize: '0.7rem' }}
              >
                {cat.level1Emoji} {cat.level2Name || cat.level1Name}
              </Badge>
            ))}
            {boutique.categories_produits.length > 2 && (
              <Badge bg="light" text="dark" className="small">
                +{boutique.categories_produits.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Rating simulado */}
        <div className="mt-2 d-flex align-items-center">
          <div className="d-flex text-warning me-2">
            {[...Array(4)].map((_, i) => (
              <Star key={i} size={12} fill="currentColor" />
            ))}
            <Star size={12} className="text-secondary" />
          </div>
          <span className="small text-muted">
            ({boutique.stats?.avis || 0})
          </span>
        </div>
      </Card.Body>

      <style jsx="true">{`
        .boutique-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        .boutique-card {
          transition: all 0.3s ease;
        }
      `}</style>
    </Card>
  );
};

export default BoutiqueCard;