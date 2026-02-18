// 📂 frontend/src/components/card-footer/CardFooterCategory.jsx - VERSIÓN OPTIMIZADA CON MOMENT
import React from 'react';
import { Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import 'moment/locale/fr'; // Importar locale francés
import { 
  Telephone, 
  ChatDots,
  GeoAlt,
  Clock
} from 'react-bootstrap-icons';

// Configurar moment en francés
moment.locale('fr');

const CardFooterCategory = ({ post }) => {
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

  const handleComment = (e) => {
    e.stopPropagation();
    history.push(`/post/${post._id}#comments`);
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

  // Obtener tiempo relativo con moment
  const getRelativeTime = (date) => {
    return moment(date).fromNow(); // "il y a 2 heures", "il y a 3 jours", etc.
  };

  // Obtener ubicación
  const getLocation = () => {
    const wilaya = post.wilaya || post.location?.wilaya || 'Alger';
    const commune = post.commune || post.location?.commune;
    return commune ? `${wilaya}, ${commune}` : wilaya;
  };

  return (
    <div style={styles.container}>
      {/* Fila 1: Título y precio */}
      <div style={styles.titleRow}>
        <span style={styles.title}>
          {post.title}
        </span>
        <span style={styles.price}>
          {formatPrice(post.price)}
        </span>
      </div>

      {/* Fila 2: Badges */}
      <div style={styles.badgesRow}>
        {post.negotiable && (
          <Badge bg="info" style={styles.badge}>
            {t('negotiable')}
          </Badge>
        )}
        {post.urgent && (
          <Badge bg="danger" style={styles.badge}>
            🔥 {t('urgent')}
          </Badge>
        )}
        {post.featured && (
          <Badge bg="warning" style={{...styles.badge, ...styles.featuredBadge}}>
            ⭐ {t('featured')}
          </Badge>
        )}
      </div>

      {/* Fila 3: Ubicación */}
      <div style={styles.locationRow}>
        <GeoAlt size={14} color="#666" />
        <span style={styles.locationText}>
          {getLocation()}
        </span>
      </div>

      {/* Fila 4: Tiempo de publicación con moment */}
      <div style={styles.timeRow}>
        <Clock size={14} color="#666" />
        <span style={styles.timeText}>
          Publié {getRelativeTime(post.createdAt)}
        </span>
      </div>

      {/* Fila 5: Iconos de acción */}
      <div style={styles.actionRow}>
        {/* Teléfono */}
        <button
          onClick={handleCall}
          style={styles.iconButton}
          title={t('call')}
        >
          <Telephone size={18} color="#28a745" />
        </button>

        {/* Chat */}
        <button
          onClick={handleChat}
          style={styles.iconButton}
          title={t('chat')}
        >
          <ChatDots size={18} color="#0dcaf0" />
        </button>

        {/* Comentarios */}
        <div style={styles.commentContainer}>
          <i className="far fa-comment" style={{ color: '#666', fontSize: '16px' }}></i>
          <span style={styles.commentCount}>
            {post.comments?.length || 0}
          </span>
        </div>
      </div>
    </div>
  );
};

// Estilos en objeto
const styles = {
  container: {
    padding: '12px',
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
  title: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#333',
    flex: 1,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: '1.4'
  },
  price: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#dc3545',
    whiteSpace: 'nowrap'
  },
  badgesRow: {
    display: 'flex',
    gap: '6px',
    marginBottom: '8px',
    flexWrap: 'wrap'
  },
  badge: {
    fontSize: '11px',
    padding: '3px 8px',
    borderRadius: '12px',
    fontWeight: 'normal'
  },
  featuredBadge: {
    backgroundColor: '#ffc107',
    color: '#333'
  },
  locationRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '6px'
  },
  locationText: {
    fontSize: '13px',
    color: '#666'
  },
  timeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '12px'
  },
  timeText: {
    fontSize: '13px',
    color: '#666',
    fontStyle: 'italic'
  },
  actionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    paddingTop: '8px',
    borderTop: '1px solid #f0f0f0'
  },
  iconButton: {
    background: 'none',
    border: 'none',
    padding: '6px',
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
    fontSize: '13px',
    color: '#666',
    fontWeight: '500'
  }
};

// Estilos responsive
const responsiveStyles = `
  @media (max-width: 768px) {
    .card-footer-category-title {
      font-size: 14px !important;
    }
    .card-footer-category-price {
      font-size: 16px !important;
    }
    .card-footer-category-location,
    .card-footer-category-time {
      font-size: 12px !important;
    }
    .card-footer-category-icon-button {
      padding: 8px !important;
    }
  }
`;

// Añadir estilos globales
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = responsiveStyles;
  document.head.appendChild(style);
}

export default React.memo(CardFooterCategory);