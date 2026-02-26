// components/boutique/cards/BoutiquePostCard.jsx
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Modal, Button } from 'react-bootstrap';
import { deleteBoutiquePost } from '../../../redux/actions/boutiquePostAction';
 import BoutiquePostCardBody from './BoutiquePostCardBody';
 
import BoutiquePostCardFooter from './BoutiquePostCardFooter';

const BoutiquePostCard = ({ post, boutique }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Verificar permisos
  const isOwner = auth.user?._id === boutique?.user;
  const isAdmin = auth.user?.role === 'admin';
  const canModify = isOwner || isAdmin;

  const handleClick = (e) => {
    if (e.target.closest('.action-btn') || 
        e.target.closest('.share-btn') || 
        e.target.closest('.dropdown-toggle') ||
        e.target.closest('.save-btn') ||
        e.target.closest('.phone-btn') ||
        e.target.closest('.boutique-link')) {
      return;
    }
    history.push(`/post/${post._id}`);
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
        <BoutiquePostCardBody 
          post={post}
          boutique={boutique}
          canModify={canModify}
          auth={auth}
          onEdit={() => history.push(`/boutique/${boutique._id}/products/edit/${post._id}`, {
            postData: post,
            boutique: boutique,
            isEdit: true
          })}
          onDelete={() => setShowDeleteModal(true)}
        />

        <BoutiquePostCardFooter 
          boutique={boutique}
          postId={post._id}
        />
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
    </>
  );
};

export default BoutiquePostCard;