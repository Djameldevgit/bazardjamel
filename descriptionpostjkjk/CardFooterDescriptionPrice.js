import React, { useState } from 'react';
import { Button, Badge } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

  
const CardFooterDescriptionPrice = (post) => {
    const history = useHistory();
    const [showPhone, setShowPhone] = useState(false);
    
    // Función para generar título combinado según categoría
    const generateCombinedTitle = () => {
      const { categorie, subCategory, articleType, pieces, marque, modele, annee } = post;
      
      switch(categorie) {
        case 'immobilier':
          const operation = articleType === 'vente' ? 'Vente' : 
                           articleType === 'location' ? 'Location' : 'Location vacances';
          const typeBien = subCategory === 'appartement' ? 'Appartement' :
                          subCategory === 'villa' ? 'Villa' :
                          subCategory === 'terrain' ? 'Terrain' : 'Local';
          
          if (subCategory === 'terrain') {
            return `${operation} ${typeBien}`;
          }
          
          return `${operation} ${typeBien} ${pieces ? `F${pieces}` : ''}`;
  
        case 'vehicules':
          const typeVehicule = subCategory === 'automobiles' ? 'Voiture' :
                              subCategory === 'utilitaires' ? 'Utilitaire' : 'Moto';
          return `${typeVehicule} ${marque || ''} ${modele || ''}`;
  
        case 'telephones':
          const typePhone = subCategory === 'smartphones' ? 'Smartphone' :
                           subCategory === 'telephones_cellulaires' ? 'Téléphone' : 'Tablette';
          return `${typePhone} ${marque || ''}`;
  
        case 'informatique':
          const typeInfo = subCategory === 'ordinateurs_portables' ? 'PC Portable' :
                          subCategory === 'ordinateurs_bureau' ? 'PC Bureau' : 'Serveur';
          return `${typeInfo} ${marque || ''}`;
  
        case 'vetements':
          const typeVetement = subCategory === 'vetements_homme' ? 'Vêtement Homme' :
                              subCategory === 'vetements_femme' ? 'Vêtement Femme' : 'Chaussures';
          return `${typeVetement} ${marque ? marque : ''}`;
  
        default:
          // Para otras categorías
          if (marque && modele) {
            return `${marque} ${modele}`;
          } else if (post.titre) {
            return post.titre.length > 30 ? `${post.titre.substring(0, 30)}...` : post.titre;
          } else {
            return 'Annonce';
          }
      }
    };
  
    // Formatear precio
    const formatPrice = (price) => {
      if (!price) return 'Prix non spécifié';
      
      if (price >= 1000000) {
        return `${(price / 1000000).toFixed(1)}M DZD`;
      } else if (price >= 1000) {
        return `${(price / 1000).toFixed(0)}K DZD`;
      }
      return `${price} DZD`;
    };
  
    // Manejar clic en teléfono
    const handlePhoneClick = () => {
      if (!showPhone && post.user?.phone) {
        setShowPhone(true);
        // Opcional: copiar al portapapeles
        navigator.clipboard.writeText(post.user.phone).then(() => {
          console.log('Numéro copié:', post.user.phone);
        });
      }
    };
  
    // Manejar clic en comentarios
    const handleCommentsClick = () => {
        history.push(`/post/${post.id}`);
      // O si quieres ir directamente a la sección de comentarios
      // navigate(`/post/${post.id}#comments`);
    };
  
    // Manejar clic en el título para ir al detalle
    const handleTitleClick = () => {
        history.push(`/post/${post.id}`);
    };
  
    return (
      <div className="card-footer-price">
        {/* FILA 1: Título combinado */}
        <div 
          className="title-row mb-2"
          onClick={handleTitleClick}
          style={{ cursor: 'pointer' }}
        >
          <h6 className="title mb-0 fw-bold text-truncate">
            {generateCombinedTitle()}
          </h6>
          <div className="location-info small text-muted mt-1">
            {post.wilaya && (
              <span className="me-2">📍 {post.wilaya}</span>
            )}
            {post.commune && (
              <span>• {post.commune}</span>
            )}
          </div>
        </div>
  
        {/* FILA 2: Precio */}
        <div className="price-row mb-2">
          <div className="price-container d-flex align-items-center justify-content-between">
            <div className="price-display">
              <span className="price-label text-muted small me-2">Prix:</span>
              <span className="price-value fw-bold text-primary" style={{ fontSize: '1.3rem' }}>
                {formatPrice(post.price)}
              </span>
              {post.negociable && (
                <Badge bg="light" text="dark" className="ms-2">Négociable</Badge>
              )}
            </div>
            
            {/* Badges de estado */}
            <div className="price-badges">
              {post.isUrgent && (
                <Badge bg="danger" className="me-1">🚨</Badge>
              )}
              {post.isPromoted && (
                <Badge bg="warning" text="dark" className="me-1">⭐</Badge>
              )}
              {post.etat === 'neuf' && (
                <Badge bg="success">Neuf</Badge>
              )}
            </div>
          </div>
        </div>
  
        {/* FILA 3: Iconos de acción */}
        <div className="actions-row">
          <div className="d-flex justify-content-between align-items-center">
            {/* Icono de teléfono a la izquierda */}
            <Button 
              variant="outline-success" 
              size="sm"
              className="phone-button d-flex align-items-center"
              onClick={handlePhoneClick}
              disabled={!post.user?.phone}
            >
              <span className="me-1">📞</span>
              {showPhone && post.user?.phone ? (
                <span className="phone-number fw-bold">{post.user.phone}</span>
              ) : (
                <span>Appeler</span>
              )}
            </Button>
  
            {/* Espacio central para stats o info adicional */}
            <div className="post-stats text-center">
              <div className="stats-inner">
                <span className="views-count me-2">👁️ {post.views || 0}</span>
                <span className="comments-count">💬 {post.comments || 0}</span>
              </div>
            </div>
  
            {/* Icono de comentarios a la derecha */}
            <Button 
              variant="outline-primary" 
              size="sm"
              className="comments-button d-flex align-items-center"
              onClick={handleCommentsClick}
            >
              <span className="me-1">💬</span>
              <span>Commenter</span>
            </Button>
          </div>
        </div>
  
        {/* Estilos */}
        <style>{`
          .card-footer-price {
            padding: 1rem;
            background: linear-gradient(to bottom, #ffffff, #f8f9fa);
            border-top: 1px solid #e9ecef;
            border-radius: 0 0 8px 8px;
            animation: slideUp 0.3s ease;
          }
          
          .title-row:hover {
            background-color: #f8f9ff;
            border-radius: 6px;
            padding: 0.5rem;
            margin: -0.5rem;
            transition: all 0.2s ease;
          }
          
          .title {
            color: #2d3748;
            font-size: 1rem;
            line-height: 1.4;
          }
          
          .location-info {
            font-size: 0.8rem;
          }
          
          .price-container {
            padding: 0.5rem 0;
          }
          
          .price-value {
            color: #10b981;
          }
          
          .price-badges .badge {
            font-size: 0.7rem;
            padding: 0.25rem 0.5rem;
          }
          
          .actions-row {
            padding-top: 0.75rem;
            border-top: 1px dashed #dee2e6;
          }
          
          .phone-button, .comments-button {
            border-radius: 20px;
            padding: 0.375rem 1rem;
            font-size: 0.85rem;
            min-width: 110px;
            justify-content: center;
            transition: all 0.2s ease;
          }
          
          .phone-button:hover {
            background-color: #d1fae5;
            border-color: #10b981;
            transform: translateY(-1px);
          }
          
          .comments-button:hover {
            background-color: #dbeafe;
            border-color: #3b82f6;
            transform: translateY(-1px);
          }
          
          .post-stats {
            color: #6c757d;
            font-size: 0.85rem;
          }
          
          .stats-inner {
            background-color: #f8f9fa;
            padding: 0.25rem 0.75rem;
            border-radius: 15px;
            border: 1px solid #e9ecef;
          }
          
          .phone-number {
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
          }
          
          /* Animaciones */
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          /* Responsive */
          @media (max-width: 768px) {
            .card-footer-price {
              padding: 0.75rem;
            }
            
            .title {
              font-size: 0.95rem;
            }
            
            .price-value {
              font-size: 1.1rem;
            }
            
            .phone-button, .comments-button {
              min-width: 95px;
              padding: 0.25rem 0.75rem;
              font-size: 0.8rem;
            }
            
            .stats-inner {
              padding: 0.2rem 0.5rem;
              font-size: 0.8rem;
            }
          }
          
          /* Efecto de pulso para teléfono cuando se muestra */
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          .phone-button.showing-phone {
            animation: pulse 0.5s ease;
            background-color: #10b981 !important;
            color: white !important;
          }
        `}</style>
      </div>
    );
  };
 
export default CardFooterDescriptionPrice

