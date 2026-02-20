// 📂 frontend/src/components/card-footer/CardFooterHome.jsx - VERSIÓN CLÁSICA CON ICONOS DISTINTOS
import React from 'react';
import { Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FaPhone, 
  FaWeixin,
  FaRegCommentDots
} from 'react-icons/fa';

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

  return (
    <div style={styles.container}>
      {/* FILA 1: Título */}
      <div style={styles.titleRow}>
        <span style={styles.title}>
          {post.title}
        </span>
      </div>

      {/* FILA 2: Precio */}
      <div style={styles.priceRow}>
        <span style={styles.price}>
          {formatPrice(post.price)}
        </span>
        {post.negotiable && (
          <Badge style={styles.negotiableBadge}>
            {t('negotiable')}
          </Badge>
        )}
      </div>

      {/* FILA 3: Iconos clásicos MUY separados */}
      <div style={styles.iconsRow}>
        {/* Téléphone */}
        <button onClick={handleCall} style={styles.iconButton} title={t('call')}>
          <FaPhone size={20} color="#333" />
        </button>

        {/* Chat - Icono diferente */}
        <button onClick={handleChat} style={styles.iconButton} title={t('chat')}>
          <FaWeixin size={22} color="#333" />
        </button>

        {/* Commentaires - Icono diferente */}
        <div style={styles.commentWrapper}>
          <FaRegCommentDots size={20} color="#333" />
          {post.comments?.length > 0 && (
            <span style={styles.commentCount}>{post.comments.length}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Estilos con separación MÁXIMA
const styles = {
  container: {
    padding: '2px 0px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#ffffff'
  },
  titleRow: {
    marginBottom: '4px'
  },
  title: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a1a1a',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    lineHeight: '1.4',
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
  },
  priceRow: {
    display: 'flex',
    alignItems: 'center',
    
    fontWeight: '400',
   
  },
  price: {
    fontSize: '13px',
    fontWeight: '400',
    color: '#dc2626',
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
  },
  negotiableBadge: {
    fontSize: '10px',
    padding: '2px 6px',
    borderRadius: '4px',
    backgroundColor: '#f3f4f6',
    color: '#4b5563',
    fontWeight: '400',
    border: '1px solid #e5e7eb'
  },
  iconsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between', // ← SEPARACIÓN MÁXIMA
    padding: '2px 0',
    width: '100%'
  },
  iconButton: {
    background: 'none',
    border: 'none',
    padding: '8px', // Más área de clic
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#4b5563',
    flex: '0 0 auto' // No se estiran
  },
  commentWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px',
    position: 'relative'
  },
  commentCount: {
    fontSize: '13px',
    fontWeight: '400',
    color: '#6b7280',
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif'
  }
};

// Media queries para móvil
const globalStyles = `
  @media (max-width: 480px) {
    .icon-button {
      padding: 3px !important;
    }
    .icon-button svg {
      width: 18px !important;
      height: 18px !important;
    }
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = globalStyles;
  document.head.appendChild(style);
}

export default React.memo(CardFooterHome);