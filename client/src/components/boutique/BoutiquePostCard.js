// components/boutique/BoutiqueCard.jsx
import React, { useState } from 'react';
import { Card, Badge, Button, Modal, Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  FaStore, 
  FaCheckCircle, 
  FaMapMarkerAlt, 
  FaTag, 
  FaEye,
  FaBoxes,
  FaClock,
  FaCrown,
  FaFlag,
  FaStar,
  FaRegStar,
  FaHeart,
  FaRegHeart,
  FaShare,
  FaBookmark,
  FaRegBookmark
} from 'react-icons/fa';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

const BoutiquePostCard = ({ boutique, showActions = true }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  
  const [imageError, setImageError] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  const isOwner = auth.user?._id === boutique.user?._id || auth.user?._id === boutique.user;
  const isAdmin = auth.user?.role === 'admin';

  const handleClick = (e) => {
    // Usar clases únicas para evitar conflictos
    if (e.target.closest('.boutique-action-btn') || e.target.closest('.boutique-report-btn')) {
      return;
    }
    history.push(`/boutique/${boutique._id}`);
  };

  const handleReport = (e) => {
    e.stopPropagation();
    setShowReportModal(true);
  };

  const submitReport = (e) => {
    e.stopPropagation();
    setShowReportModal(false);
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: 'Boutique signalée. Merci de votre aide!' }
    });
  };

  const handleLike = (e) => {
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  const getLogoImage = () => {
    if (boutique.images && Array.isArray(boutique.images) && boutique.images.length > 0) {
      const firstImage = boutique.images[0];
      return firstImage.url || firstImage;
    }
    return null;
  };

  const getHeaderImage = () => {
    if (boutique.header_images && Array.isArray(boutique.header_images) && boutique.header_images.length > 0 && !imageError) {
      const firstImage = boutique.header_images[0];
      return firstImage.url || firstImage;
    }
    return null;
  };

  const getUserThemeColor = () => {
    if (boutique.couleur_theme && typeof boutique.couleur_theme === 'string') {
      return boutique.couleur_theme;
    }
    return null;
  };

  const getCategoryColor = () => {
    const category = boutique.categorie?.toLowerCase() || '';
    const colorMap = {
      'automobiles': '#FF6B6B', 'véhicules': '#FF6B6B',
      'informatique': '#4ECDC4', 'téléphonie': '#4ECDC4',
      'maison': '#FFB347', 'meubles': '#FFB347',
      'mode': '#FF8C94', 'vêtements': '#FF8C94',
      'santé': '#A8E6CF', 'beauté': '#A8E6CF',
      'immobilier': '#6C5B7B', 'alimentaire': '#FFA07A',
      'sport': '#45B7D1', 'services': '#95A5A6'
    };
    return colorMap[category] || '#6366F1';
  };

  const mainColor = getUserThemeColor() || getCategoryColor();

  const adjustColor = (color, percent) => {
    if (!color || color === '#6366F1') return color;
    try {
      const num = parseInt(color.replace('#', ''), 16);
      const amt = Math.round(2.55 * percent);
      const R = Math.min(255, Math.max(0, (num >> 16) + amt));
      const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amt));
      const B = Math.min(255, Math.max(0, (num & 0x0000FF) + amt));
      return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
    } catch {
      return color;
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const logoImage = getLogoImage();
  const headerImage = getHeaderImage();
  const hasImage = headerImage && !imageError;
  
  const planName = boutique.plan === 'gratuit' ? 'Gratuit' : 
                   boutique.plan === 'basique' ? 'Basique' :
                   boutique.plan === 'premium' ? 'Premium' : 'Pro';

  const renderStars = (rating) => {
    const stars = [];
    const roundedRating = Math.round(rating * 2) / 2;
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(roundedRating)) {
        stars.push(<FaStar key={i} className="text-warning" size={12} />);
      } else if (i === Math.ceil(roundedRating) && roundedRating % 1 !== 0) {
        stars.push(
          <div key={i} className="position-relative d-inline-block">
            <FaRegStar className="text-secondary" size={12} style={{ opacity: 0.5 }} />
            <FaStar className="text-warning position-absolute top-0 start-0" style={{ clipPath: 'inset(0 50% 0 0)' }} size={12} />
          </div>
        );
      } else {
        stars.push(<FaRegStar key={i} className="text-secondary" size={12} style={{ opacity: 0.5 }} />);
      }
    }
    return stars;
  };

  return (
    <>
      <Card 
        className={`boutique-card h-100 border-0 ${!boutique.isActive ? 'opacity-50' : ''}`}
        onClick={handleClick}
        style={{ 
          cursor: 'pointer', 
          transition: 'all 0.3s ease',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          width: '100%',
          maxWidth: '100%',
        }}
      >
        {/* ========== SECCIÓN DE FONDO ========== */}
        <div 
          className="position-relative"
          style={{
            height: '120px',
            position: 'relative',
            backgroundColor: mainColor,
            ...(hasImage && {
              backgroundImage: `url(${headerImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }),
            ...(!hasImage && {
              background: `linear-gradient(135deg, ${mainColor} 0%, ${adjustColor(mainColor, 30)} 100%)`,
            }),
          }}
        >
          {headerImage && !imageError && (
            <img 
              src={headerImage}
              alt=""
              style={{ display: 'none' }}
              onError={handleImageError}
            />
          )}
          
          {hasImage && (
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
                zIndex: 1
              }}
            />
          )}
          
          {/* Badges superiores */}
          <div className="position-absolute top-0 start-0 m-3 d-flex gap-1" style={{ zIndex: 2 }}>
            {boutique.isVerified && (
              <Badge 
                bg="success"
                style={{ 
                  padding: '0.3rem 0.6rem',
                  borderRadius: '20px',
                  fontSize: '0.7rem',
                  fontWeight: 'normal',
                  backgroundColor: 'rgba(40, 167, 69, 0.95)',
                  border: '1px solid rgba(255,255,255,0.3)'
                }}
              >
                <FaCheckCircle size={10} className="me-1" />
                Vérifié
              </Badge>
            )}
          </div>

          <div className="position-absolute top-0 end-0 m-3" style={{ zIndex: 2 }}>
            <Badge 
              bg={boutique.plan === 'premium' ? 'warning' : boutique.plan === 'basique' ? 'info' : 'secondary'}
              style={{ 
                padding: '0.3rem 0.6rem',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                backgroundColor: boutique.plan === 'premium' ? 'rgba(255, 193, 7, 0.95)' : 
                                boutique.plan === 'basique' ? 'rgba(23, 162, 184, 0.95)' : 
                                'rgba(108, 117, 125, 0.95)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              {boutique.plan === 'premium' && <FaCrown size={10} className="me-1" />}
              {planName}
            </Badge>
          </div>

          {/* Indicador de personalización */}
          <div 
            className="position-absolute bottom-0 end-0 m-2"
            style={{ zIndex: 2 }}
          >
            <Badge 
              style={{
                backgroundColor: 'rgba(0,0,0,0.6)',
                backdropFilter: 'blur(4px)',
                padding: '0.2rem 0.5rem',
                borderRadius: '12px',
                fontSize: '0.6rem',
                fontWeight: 'normal',
                color: 'white'
              }}
            >
              {hasImage ? '📷 Image' : '🎨 Couleur'}
            </Badge>
          </div>
        </div>

        {/* ========== LOGO CIRCULAR ========== */}
        <div className="position-relative text-center" style={{ marginTop: '-50px', marginBottom: '10px', zIndex: 3 }}>
          <div 
            className="d-inline-flex align-items-center justify-content-center"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: 'white',
              border: `4px solid ${mainColor}`,
              boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
              overflow: 'hidden',
              position: 'relative',
              zIndex: 2,
              transition: 'transform 0.3s ease'
            }}
          >
            {logoImage ? (
              <img 
                src={logoImage}
                alt={boutique.nom_boutique}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <FaStore size={50} color={mainColor} />
            )}
          </div>

          {!boutique.isActive && (
            <div 
              className="position-absolute"
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#6c757d',
                border: '2px solid white',
                bottom: '5px',
                left: '55%',
                transform: 'translateX(-50%)',
                zIndex: 3
              }}
              title="Boutique inactive"
            />
          )}
        </div>

        {/* ========== CONTENIDO PRINCIPAL ========== */}
        <Card.Body className="d-flex flex-column pt-0 px-3 pb-2">
          {/* Nombre y categoría */}
          <div className="text-center mb-2">
            <h6 className="fw-bold mb-1" style={{ fontSize: '1.1rem', color: mainColor }}>
              {boutique.nom_boutique}
            </h6>
            {boutique.slogan_boutique && (
              <small className="text-muted d-block" style={{ fontStyle: 'italic', fontSize: '0.75rem' }}>
                "{boutique.slogan_boutique}"
              </small>
            )}
          </div>

          <div className="text-center mb-3">
            <span 
              style={{
                backgroundColor: `${mainColor}15`,
                color: mainColor,
                padding: '0.25rem 1rem',
                borderRadius: '30px',
                fontSize: '0.75rem',
                fontWeight: '500',
                display: 'inline-block'
              }}
            >
              <FaTag size={10} className="me-1" />
              {boutique.categorie || 'Boutique'}
            </span>
          </div>
        </Card.Body>

        {/* ========== FOOTER TIPO POST - CON CLASES ÚNICAS ========== */}
        <div className="boutique-post-footer-unique">
          {/* Información de la boutique */}
          <div className="boutique-footer-info-unique">
            <div className="boutique-info-item-unique">
              <FaMapMarkerAlt size={12} className="text-danger" />
              <span className="boutique-info-text-unique">
                {boutique.proprietaire?.wilaya || 'Algérie'}
              </span>
            </div>
            
            <div className="boutique-info-item-unique">
              <FaBoxes size={12} className="text-primary" />
              <span className="boutique-info-text-unique">
                {boutique.stats?.produits || 0} produits
              </span>
            </div>
            
            <div className="boutique-info-item-unique">
              <FaEye size={12} className="text-info" />
              <span className="boutique-info-text-unique">
                {boutique.stats?.vues || 0} vues
              </span>
            </div>
            
            <div className="boutique-info-item-unique">
              <FaClock size={12} className="text-secondary" />
              <span className="boutique-info-text-unique">
                {new Date(boutique.createdAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
              </span>
            </div>
            
            {boutique.stats?.notes > 0 && (
              <div className="boutique-info-item-unique boutique-rating-unique">
                {renderStars(boutique.stats.notes)}
                <span className="boutique-info-text-unique ms-1">
                  ({boutique.stats.avis || 0})
                </span>
              </div>
            )}
          </div>
 
        </div>

        
      </Card>

      {/* Modal de signalement */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Signaler cette boutique</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Voulez-vous signaler la boutique <strong>{boutique.nom_boutique}</strong> ?</p>
          <Form.Group>
            <Form.Label>Raison du signalement</Form.Label>
            <Form.Select id="reportReason">
              <option>Contenu inapproprié</option>
              <option>Boutique frauduleuse</option>
              <option>Spam ou publicité</option>
              <option>Autre raison</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReportModal(false)}>
            Annuler
          </Button>
          <Button variant="warning" onClick={submitReport}>
            Signaler
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx="true">{`
        /* ========== ESTILOS CON CLASES ÚNICAS ========== */
        .boutique-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.12) !important;
        }
        
        .boutique-card:hover .d-inline-flex {
          transform: scale(1.05);
        }

        /* Footer único */
        .boutique-post-footer-unique {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          border-top: 1px solid #e9ecef;
          background-color: #f8f9fa;
          gap: 12px;
          flex-wrap: wrap;
        }

        .boutique-footer-info-unique {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          flex: 1;
        }

        .boutique-info-item-unique {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          color: #6c757d;
        }

        .boutique-info-item-unique.boutique-rating-unique {
          display: flex;
          align-items: center;
          gap: 2px;
        }

        .boutique-info-text-unique {
          font-size: 0.7rem;
          font-weight: 500;
        }

        .boutique-footer-actions-unique {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .boutique-action-btn-unique {
          background: none;
          border: none;
          display: flex;
          align-items: center;
          gap: 4px;
          color: #6c757d;
          padding: 4px 8px;
          border-radius: 20px;
          transition: all 0.2s ease;
          cursor: pointer;
          font-size: 0.75rem;
        }

        .boutique-action-btn-unique:hover {
          background-color: #e9ecef;
        }

        .boutique-report-btn-unique:hover {
          color: #dc3545 !important;
        }

        .boutique-share-tooltip-unique {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 8px;
          background-color: #28a745;
          color: white;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.7rem;
          white-space: nowrap;
          z-index: 10;
          animation: boutiqueFadeOutUnique 2s ease forwards;
        }

        @keyframes boutiqueFadeOutUnique {
          0% { opacity: 1; }
          70% { opacity: 1; }
          100% { opacity: 0; visibility: hidden; }
        }

        /* Responsive */
        @media (max-width: 576px) {
          .boutique-post-footer-unique {
            flex-direction: column;
            align-items: stretch;
            gap: 10px;
          }
          
          .boutique-footer-info-unique {
            justify-content: space-between;
            gap: 8px;
          }
          
          .boutique-footer-actions-unique {
            justify-content: space-around;
            border-top: 1px solid #e9ecef;
            padding-top: 8px;
          }
        }
      `}</style>
    </>
  );
};

export default BoutiquePostCard;