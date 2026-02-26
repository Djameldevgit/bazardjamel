// components/boutique/cards/boutiquePostCard/BoutiquePostCardBody.jsx
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Button, OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap';
import { 
  FaEye, 
  FaHeart, 
  FaRegHeart,
  FaComment, 
  FaMapMarkerAlt, 
  FaStore,
  FaCheckCircle,
  FaBookmark,
  FaRegBookmark,
  FaFlag,
  FaEllipsisV,
  FaEdit,
  FaTrash
} from 'react-icons/fa';
import { likePost, unLikePost } from '../../../redux/actions/postAction';

const BoutiquePostCardBody = ({ post, boutique, canModify, auth, onEdit, onDelete }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  
  const [isLiking, setIsLiking] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const isLiked = post.likes?.some(id => id === auth.user?._id);
  const likesCount = post.likes?.length || 0;
  const commentsCount = post.comments?.length || 0;

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

  const handleSave = (e) => {
    e.stopPropagation();
    if (!auth.token) {
      history.push('/login');
      return;
    }
    setIsSaved(!isSaved);
  };

  const handleReport = (e) => {
    e.stopPropagation();
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

  return (
    <>
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

        {/* Iconos superiores (Like y Save) */}
        <div className="position-absolute top-0 end-0 m-3 d-flex gap-2" style={{ zIndex: 3 }}>
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>{isLiked ? 'Ne plus aimer' : 'Aimer'}</Tooltip>}
          >
            <Button
              variant="light"
              size="sm"
              className="action-icon-btn rounded-circle"
              onClick={handleLike}
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
              {isLiked ? (
                <FaHeart size={16} className="text-danger" />
              ) : (
                <FaRegHeart size={16} />
              )}
            </Button>
          </OverlayTrigger>

          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip>{isSaved ? 'Retirer des favoris' : 'Sauvegarder'}</Tooltip>}
          >
            <Button
              variant="light"
              size="sm"
              className="action-icon-btn save-btn rounded-circle"
              onClick={handleSave}
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
              {isSaved ? (
                <FaBookmark size={16} className="text-primary" />
              ) : (
                <FaRegBookmark size={16} />
              )}
            </Button>
          </OverlayTrigger>
        </div>

        {/* Badge de prix */}
        <Badge
          className="position-absolute top-0 start-0 m-3 price-badge"
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

        {/* Badge "Nouveau" si récent */}
        {new Date(post.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
          <Badge
            bg="success"
            className="position-absolute bottom-0 end-0 m-3"
            style={{
              padding: '0.3rem 0.8rem',
              borderRadius: '20px',
              fontSize: '0.7rem',
              zIndex: 2
            }}
          >
            Nouveau
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
                <Dropdown.Item onClick={onEdit}>
                  <FaEdit className="me-2 text-primary" />
                  Modifier
                </Dropdown.Item>
                <Dropdown.Item onClick={onDelete} className="text-danger">
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

      {/* Info Section */}
      <div className="p-3">
        {/* Información de la boutique */}
        <div className="d-flex align-items-center mb-2">
          <div 
            className="boutique-avatar rounded-circle me-2 d-flex align-items-center justify-content-center"
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: boutique?.couleur_theme || '#6366F1',
              color: 'white',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {boutique?.nom_boutique?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-grow-1">
            <div className="d-flex align-items-center">
              <span className="fw-semibold small">{boutique?.nom_boutique}</span>
              {boutique?.isVerified && (
                <FaCheckCircle className="text-success ms-1" size={12} />
              )}
            </div>
            <div className="d-flex align-items-center text-muted small">
              <FaMapMarkerAlt className="text-danger me-1" size={8} />
              <span>{boutique?.wilaya || 'Algérie'}</span>
            </div>
          </div>
        </div>

        {/* Titre du produit */}
        <h6 className="fw-bold mb-2 product-title" style={{ fontSize: '1rem' }}>
          {post.title}
        </h6>

        {/* Stats row */}
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex align-items-center text-muted">
            <FaEye className="me-1" size={12} />
            <small>{post.views || 0}</small>
          </div>
          <div className="d-flex align-items-center text-muted">
            <FaHeart className="me-1 text-danger" size={12} />
            <small>{likesCount}</small>
          </div>
          <div className="d-flex align-items-center text-muted">
            <FaComment className="me-1" size={12} />
            <small>{commentsCount}</small>
          </div>
          <div className="d-flex align-items-center text-muted ms-auto small">
            {getTimeAgo(post.createdAt)}
          </div>
        </div>
      </div>
    </>
  );
};

export default BoutiquePostCardBody;