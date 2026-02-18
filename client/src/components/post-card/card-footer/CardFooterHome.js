// 📂 frontend/src/components/card-footer/CardFooterHome.jsx - VERSIÓN OPTIMIZADA
import React, { useState } from 'react';
import { Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Telephone, 
  ChatDots,
  Clock
} from 'react-bootstrap-icons';

const CardFooterHome = ({ post }) => {
  const { auth } = useSelector(state => state);
  const { t } = useTranslation();
  const history = useHistory();

  // Handlers de acciones
  const handleCall = (e) => {
    e.stopPropagation();
    if (!auth.token) return history.push('/login');
    if (post.user?.phone) {
      window.location.href = `tel:${post.user.phone}`;
    }
  };

  const handleChat = (e) => {
    e.stopPropagation();
    if (!auth.token) return history.push('/login');
    history.push(`/messages/${post.user?._id}`, { post });
  };

  // Formatear precio
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  };

  // Calcular tiempo relativo
 

  return (
    <div style={styles.container}>
      {/* Fila 1: Título y precio en la misma línea */}
      <div style={styles.titleRow}>
        <div style={styles.titleContainer}>
          <span style={styles.title}>
            {post.title}
          </span>
        </div>
        <div style={styles.priceContainer}>
          <span style={styles.price}>
            {formatPrice(post.price)}
          </span>
          {post.negotiable && (
            <Badge 
              bg="info" 
              style={styles.negotiableBadge}
            >
              {t('negotiable')}
            </Badge>
          )}
        </div>
      </div>

      {/* Fila 2: Tiempo e iconos de acción */}
      <div style={styles.actionRow}>
        {/* Tiempo de publicación */}
       

        {/* Iconos de acción */}
        <div style={styles.iconsContainer}>
          {/* Teléfono */}
          <button
            onClick={handleCall}
            style={styles.iconButton}
            title={t('call')}
          >
            <Telephone size={16} color="#28a745" />
          </button>

          {/* Chat */}
          <button
            onClick={handleChat}
            style={styles.iconButton}
            title={t('chat')}
          >
            <ChatDots size={16} color="#0dcaf0" />
          </button>

          {/* Comentarios */}
          <div style={styles.commentContainer}>
            <i className="far fa-comment" style={{ color: '#666', fontSize: '15px' }}></i>
            <span style={styles.commentCount}>
              {post.comments?.length || 0}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Estilos en objeto para evitar CSS-in-JS y mejorar rendimiento
const styles = {
  container: {
    padding: '10px 12px 12px 12px',
    borderTop: '1px solid #f0f0f0',
    backgroundColor: 'white'
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
    gap: '8px'
  },
  titleContainer: {
    flex: '1',
    minWidth: 0 // Para que el texto se truncate correctamente
  },
  title: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: '1.4',
    wordBreak: 'break-word'
  },
  priceContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    flexShrink: 0
  },
  price: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#dc3545', // Rojo
    whiteSpace: 'nowrap'
  },
  negotiableBadge: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '12px',
    backgroundColor: '#17a2b8',
    color: 'white',
    fontWeight: 'normal'
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  timeContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  timeText: {
    fontSize: '11px',
    color: '#666'
  },
  iconsContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  iconButton: {
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  commentContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  commentCount: {
    fontSize: '12px',
    color: '#666',
    fontWeight: '500'
  }
};

// Versión móvil con media queries (se aplican automáticamente)
const mobileStyles = `
  @media (max-width: 768px) {
    .card-footer-home-title {
      font-size: 13px !important;
    }
    .card-footer-home-price {
      font-size: 15px !important;
    }
    .card-footer-home-icon-button {
      padding: 6px !important;
    }
  }
`;

// Añadir estilos globales
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = mobileStyles;
  document.head.appendChild(style);
}

export default React.memo(CardFooterHome);