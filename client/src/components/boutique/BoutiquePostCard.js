// components/boutique/cards/BoutiquePostCard.jsx
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Badge, Button, OverlayTrigger, Tooltip, Dropdown, Modal } from 'react-bootstrap';
import { 
  FaEye, 
  FaHeart, 
  FaRegHeart,
  FaComment, 
  FaMapMarkerAlt, 
  FaStore,
  FaShare,
  FaClock,
  FaCheckCircle,
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaFlag
} from 'react-icons/fa';
import { likePost, unLikePost } from '../../redux/actions/postAction';
import { deleteBoutiquePost } from '../../redux/actions/boutiqueAction';

const BoutiquePostCard = ({ post, boutique }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  
  const [isLiking, setIsLiking] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Verificar permisos
  const isOwner = auth.user?._id === boutique?.user;
  const isAdmin = auth.user?.role === 'admin';
  const canModify = isOwner || isAdmin;

  const isLiked = post.likes?.some(id => id === auth.user?._id);
  const likesCount = post.likes?.length || 0;
  const commentsCount = post.comments?.length || 0;

  const handleClick = (e) => {
    // Evitar navegación si se hizo click en botones de acción
    if (e.target.closest('.action-btn') || e.target.closest('.share-btn') || e.target.closest('.dropdown-toggle')) {
      return;
    }
    history.push(`/post/${post._id}`);
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!auth.token) {
      history.push('/login');
      return;
    }
    
    setIsLiking(true);
    try {
      if (isLiked) {
        await dispatch(unLikePost({ postId: post._id, auth }));
      } else {
        await dispatch(likePost({ postId: post._id, auth }));
      }
    } catch (error) {
      console.error('Error al dar like:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/post/${post._id}`;
    
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.description,
        url: url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    history.push(`/boutique/${boutique._id}/products/edit/${post._id}`, {
      postData: post,
      boutique: boutique,
      isEdit: true
    });
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteBoutiquePost({
        boutiqueId: boutique._id,
        postId: post._id,
        auth
      }));
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error al eliminar:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReport = (e) => {
    e.stopPropagation();
    // Lógica para reportar
    console.log('Reportar post:', post._id);
  };

  const getMainImage = () => {
    if (post.images && post.images.length > 0) {
      return post.images[0].url || post.images[0];
    }
    return null;
  };

  const formatPrice = (price) => {
    if (!price) return 'Prix sur demande';
    return `${price.toLocaleString()} DA`;
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffTime = Math.abs(now - postDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return "Hier";
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    return postDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  const mainImage = getMainImage();
  const timeAgo = getTimeAgo(post.createdAt);

  return (
    <>
      <Card 
        className="boutique-post-card h-100 border-0 shadow-sm"
        onClick={handleClick}
        style={{ 
          cursor: 'pointer', 
          transition: 'all 0.3s ease',
          borderRadius: '16px',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        {/* Image Section */}
        <div className="position-relative">
          {mainImage ? (
            <div
              style={{
                height: '200px',
                backgroundColor: '#f8f9fa',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <img
                src={mainImage}
                alt={post.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease'
                }}
                className="post-image"
              />
              
              {/* Gradient Overlay */}
              <div
                className="position-absolute bottom-0 start-0 w-100"
                style={{
                  height: '50%',
                  background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)'
                }}
              />
            </div>
          ) : (
            <div
              style={{
                height: '200px',
                background: `linear-gradient(135deg, ${boutique?.couleur_theme || '#6366F1'}20, #f8f9fa)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FaStore size={60} color={boutique?.couleur_theme || '#6366F1'} opacity="0.5" />
            </div>
          )}

          {/* Badge de prix */}
          <Badge
            className="position-absolute top-0 end-0 m-3 price-badge"
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '30px',
              fontSize: '1rem',
              fontWeight: 'bold',
              backgroundColor: boutique?.couleur_theme || '#6366F1',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
              zIndex: 2
            }}
          >
            {formatPrice(post.price)}
          </Badge>

          {/* Badge de état */}
          {post.etat && (
            <Badge
              bg="light"
              text="dark"
              className="position-absolute bottom-0 start-0 m-3"
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: '20px',
                fontSize: '0.8rem',
                backgroundColor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(5px)',
                border: '1px solid rgba(0,0,0,0.1)',
                zIndex: 2
              }}
            >
              {post.etat === 'neuf' ? 'Neuf' : 
               post.etat === 'comme-neuf' ? 'Comme neuf' :
               post.etat === 'bon-etat' ? 'Bon état' : 'Correct'}
            </Badge>
          )}

          {/* Dropdown de acciones para dueño/admin */}
          {canModify && (
            <div className="position-absolute top-0 start-0 m-3" style={{ zIndex: 3 }}>
              <Dropdown align="start">
                <Dropdown.Toggle
                  variant="light"
                  size="sm"
                  className="dropdown-toggle-custom rounded-circle"
                  style={{
                    width: '36px',
                    height: '36px',
                    padding: '0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255,255,255,0.9)',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <FaEllipsisV size={14} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleEdit}>
                    <FaEdit className="me-2 text-primary" />
                    Modifier
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleDelete} className="text-danger">
                    <FaTrash className="me-2" />
                    Supprimer
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          )}

          {/* Botón de reportar para otros usuarios */}
          {!canModify && auth.user && (
            <div className="position-absolute top-0 start-0 m-3" style={{ zIndex: 3 }}>
              <Button
                variant="light"
                size="sm"
                className="rounded-circle"
                onClick={handleReport}
                style={{
                  width: '36px',
                  height: '36px',
                  padding: '0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255,255,255,0.9)',
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                <FaFlag size={14} color="#dc3545" />
              </Button>
            </div>
          )}
        </div>

        <Card.Body className="p-3">
          {/* Titre et boutique */}
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div style={{ flex: 1 }}>
              <h6 className="fw-bold mb-1" style={{ fontSize: '1.1rem', lineHeight: '1.4' }}>
                {post.title}
              </h6>
              <div className="d-flex align-items-center text-muted small">
                <FaStore className="me-1" size={10} />
                <span className="text-truncate" style={{ maxWidth: '150px' }}>
                  {boutique?.nom_boutique}
                </span>
                {boutique?.isVerified && (
                  <FaCheckCircle className="text-success ms-1" size={10} />
                )}
              </div>
            </div>
          </div>

          {/* Description courte */}
          {post.description && (
            <p className="text-muted small mb-2" style={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              height: '2.8rem',
              fontSize: '0.85rem'
            }}>
              {post.description}
            </p>
          )}

          {/* Localisation */}
          {post.wilaya && (
            <div className="d-flex align-items-center text-muted small mb-2">
              <FaMapMarkerAlt className="text-danger me-1 flex-shrink-0" size={10} />
              <span className="text-truncate">
                {post.wilaya}{post.commune ? `, ${post.commune}` : ''}
              </span>
            </div>
          )}

          {/* Métriques sociales */}
          <div className="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
            <div className="d-flex align-items-center gap-3">
              {/* Likes */}
              <div 
                className={`d-flex align-items-center action-btn ${isLiked ? 'text-danger' : 'text-muted'}`}
                style={{ cursor: auth.token ? 'pointer' : 'default' }}
                onClick={handleLike}
              >
                {isLiked ? (
                  <FaHeart className="me-1" size={14} />
                ) : (
                  <FaRegHeart className="me-1" size={14} />
                )}
                <small>{likesCount}</small>
              </div>

              {/* Comments */}
              <div className="d-flex align-items-center text-muted">
                <FaComment className="me-1" size={14} />
                <small>{commentsCount}</small>
              </div>

              {/* Views */}
              <div className="d-flex align-items-center text-muted">
                <FaEye className="me-1" size={14} />
                <small>{post.views || 0}</small>
              </div>
            </div>

            {/* Time */}
            <div className="d-flex align-items-center text-muted small">
              <FaClock className="me-1" size={10} />
              <span>{timeAgo}</span>
            </div>
          </div>
        </Card.Body>

        {/* Bouton de partage */}
        <div className="position-absolute top-0 end-0 m-3" style={{ zIndex: 2 }}>
          <OverlayTrigger
            placement="bottom"
            show={showShareTooltip}
            overlay={<Tooltip id="share-tooltip">Lien copié !</Tooltip>}
          >
            <Button
              variant="light"
              size="sm"
              className="share-btn rounded-circle"
              onClick={handleShare}
              style={{
                width: '36px',
                height: '36px',
                padding: '0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(255,255,255,0.9)',
                border: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <FaShare size={14} />
            </Button>
          </OverlayTrigger>
        </div>

        {/* Badge "Nouveau" si récent */}
        {new Date(post.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
          <Badge
            bg="success"
            className="position-absolute top-0 start-0 m-3"
            style={{
              padding: '0.3rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.7rem',
              marginLeft: canModify ? '90px' : '50px',
              zIndex: 2
            }}
          >
            Nouveau
          </Badge>
        )}
      </Card>

      {/* Modal de confirmación para eliminar */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Êtes-vous sûr de vouloir supprimer le produit <strong>"{post.title}"</strong> ?</p>
          <p className="text-danger small">Cette action est irréversible.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="danger" 
            onClick={confirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx="true">{`
        .boutique-post-card {
          transition: all 0.3s ease;
        }
        
        .boutique-post-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 30px rgba(0,0,0,0.15) !important;
        }
        
        .boutique-post-card:hover .post-image {
          transform: scale(1.1);
        }
        
        .price-badge {
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
          }
          50% {
            box-shadow: 0 8px 20px rgba(99, 102, 241, 0.5);
          }
          100% {
            box-shadow: 0 4px 10px rgba(99, 102, 241, 0.3);
          }
        }
        
        .action-btn {
          transition: all 0.2s ease;
          padding: 4px 8px;
          border-radius: 20px;
        }
        
        .action-btn:hover {
          background-color: rgba(0,0,0,0.05);
        }
        
        .share-btn {
          transition: all 0.2s ease;
        }
        
        .share-btn:hover {
          background-color: white !important;
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }

        .dropdown-toggle-custom::after {
          display: none;
        }

        .dropdown-toggle-custom:hover {
          background-color: white !important;
          transform: scale(1.1);
        }

        .dropdown-menu {
          min-width: 160px;
          border-radius: 12px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.15);
          border: none;
          padding: 0.5rem 0;
        }

        .dropdown-item {
          padding: 0.6rem 1rem;
          font-size: 0.9rem;
        }

        .dropdown-item:hover {
          background-color: #f8f9fa;
        }

        .dropdown-item.text-danger:hover {
          background-color: #dc3545;
          color: white !important;
        }
      `}</style>
    </>
  );
};

export default BoutiquePostCard;