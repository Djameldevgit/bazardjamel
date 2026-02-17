import React, { useState } from 'react';
import { Card,Form, Badge, Dropdown, Modal, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Star, 
  CheckCircle, 
  GeoAlt, 
  Tag, 
  Eye,
  BoxSeam,
  Clock,
  Shop,
  ThreeDotsVertical,
  Pencil,
  Trash,
  Archive,
  EyeFill,
  Flag
} from 'react-bootstrap-icons';
//import { deleteBoutique } from '../../redux/actions/boutiqueAction';
import { GLOBALTYPES } from '../redux/actions/globalTypes';
import { deleteBoutique, updateBoutiqueStatus } from '../redux/actions/boutiqueAction';
 
 

const BoutiqueCard = ({ boutique }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = auth.user?._id === boutique.user?._id || auth.user?._id === boutique.user;
  const isAdmin = auth.user?.role === 'admin';

  const handleClick = (e) => {
    // Evitar navegación si se hizo click en el dropdown
    if (e.target.closest('.dropdown-toggle') || e.target.closest('.dropdown-menu')) {
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
    // Logique de signalement à implémenter
    setShowReportModal(false);
    dispatch({ 
      type: GLOBALTYPES.ALERT, 
      payload: { success: 'Boutique signalée. Merci de votre aide!' }
    });
  };

  // Obtener la primera imagen
  const getMainImage = () => {
    if (boutique.images && boutique.images.length > 0) {
      const firstImage = boutique.images[0];
      return firstImage.url || firstImage;
    }
    return null;
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await dispatch(deleteBoutique({ 
        boutiqueId: boutique._id, 
        auth 
      }));
      setShowDeleteModal(false);
    } catch (error) {
      // Error ya manejado en la acción
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleToggleActive = async (e) => {
    e.stopPropagation();
    try {
      await dispatch(updateBoutiqueStatus({ 
        boutiqueId: boutique._id, 
        statusData: { isActive: !boutique.isActive },
        auth 
      }));
    } catch (error) {
      // Error ya manejado en la acción
    }
  };
  
  // En BoutiqueCard.jsx - handleEdit CORREGIDO
const handleEdit = (e) => {
  e.stopPropagation();
  // ✅ Usar pathname correcto, no como slug de categoría
  history.push(`/edit-boutique/${boutique._id}`, { 
    boutiqueData: boutique,
    isEdit: true 
  });
};

  // Obtener emoji por categoría
  const getCategoryEmoji = () => {
    const category = boutique.categorie?.toLowerCase() || '';
    const emojiMap = {
      'automobiles': '🚗', 'véhicules': '🚗', 'informatique': '💻',
      'meubles': '🪑', 'maison': '🏠', 'téléphonie': '📱',
      'électronique': '📺', 'vêtements': '👕', 'mode': '👗',
      'santé': '💊', 'beauté': '💄', 'sport': '⚽',
      'loisirs': '🎮', 'alimentaire': '🍔', 'services': '🔧',
      'immobilier': '🏢'
    };
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (category.includes(key)) return emoji;
    }
    return '🏪';
  };

  const mainImage = getMainImage();
  const categoryEmoji = getCategoryEmoji();
  const planName = boutique.plan === 'gratuit' ? 'Gratuit' : 
                   boutique.plan === 'basique' ? 'Basique' :
                   boutique.plan === 'premium' ? 'Premium' : 'Pro';

  // Badge de statut (actif/inactif)
  const StatusBadge = () => (
    <Badge 
      bg={boutique.isActive ? 'success' : 'secondary'}
      className="position-absolute bottom-0 start-0 m-2"
      style={{ 
        padding: '0.25rem 0.5rem',
        borderRadius: '20px',
        fontSize: '0.7rem'
      }}
    >
      {boutique.isActive ? '● Actif' : '○ Inactif'}
    </Badge>
  );

  return (
    <>
      <Card 
        className={`boutique-card h-100 border-0 shadow-sm ${!boutique.isActive ? 'opacity-50' : ''}`}
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
              className="image-container"
              style={{
                height: '180px',
                backgroundColor: '#f8f9fa',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <img 
                src={mainImage}
                alt={boutique.nom_boutique}
                style={{ 
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.3s ease'
                }}
                className="card-image"
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
              className="d-flex align-items-center justify-content-center"
              style={{
                height: '180px',
                background: `linear-gradient(135deg, ${boutique.couleur_theme || '#2563eb'}20, #f8f9fa)`,
                position: 'relative'
              }}
            >
              <span style={{ fontSize: '4rem' }}>
                {categoryEmoji}
              </span>
            </div>
          )}

          {/* Badges */}
          <div className="position-absolute top-0 start-0 m-2 d-flex gap-1">
            {boutique.isVerified && (
              <Badge 
                bg="success"
                style={{ 
                  padding: '0.5rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.75rem',
                  fontWeight: 'normal'
                }}
              >
                <CheckCircle size={12} className="me-1" />
                Vérifié
              </Badge>
            )}
          </div>

          <div className="position-absolute top-0 end-0 m-2 d-flex gap-1">
            <Badge 
              bg={boutique.plan === 'premium' ? 'warning' : 'secondary'}
              style={{ 
                padding: '0.5rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: 'bold'
              }}
            >
              <Shop size={12} className="me-1" />
              {planName}
            </Badge>
          </div>

          <StatusBadge />
        </div>

        <Card.Body className="d-flex flex-column p-3">
          {/* En-tête avec nom et menu d'actions */}
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="flex-grow-1">
              <h6 className="fw-bold mb-0" style={{ fontSize: '1rem' }}>
                {boutique.nom_boutique}
              </h6>
              {boutique.slogan_boutique && (
                <small className="text-muted d-block text-truncate" style={{ maxWidth: '200px' }}>
                  {boutique.slogan_boutique}
                </small>
              )}
            </div>
            
            {/* Dropdown d'actions - visible uniquement pour propriétaire ou admin */}
            {(isOwner || isAdmin) && (
              <Dropdown align="end" onClick={(e) => e.stopPropagation()}>
                <Dropdown.Toggle 
                  variant="link" 
                  className="p-0 text-dark"
                  style={{ textDecoration: 'none', boxShadow: 'none' }}
                >
                  <ThreeDotsVertical size={18} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleEdit}>
                    <Pencil size={14} className="me-2" />
                    Modifier
                  </Dropdown.Item>
                  
                  {(isOwner || isAdmin) && (
                    <Dropdown.Item onClick={handleToggleActive}>
                      <Archive size={14} className="me-2" />
                      {boutique.isActive ? 'Désactiver' : 'Activer'}
                    </Dropdown.Item>
                  )}
                  
                  {(isOwner || isAdmin) && (
                    <Dropdown.Item 
                      onClick={() => setShowDeleteModal(true)}
                      className="text-danger"
                    >
                      <Trash size={14} className="me-2" />
                      Supprimer
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            )}

            {/* Bouton de signalement pour les autres utilisateurs */}
            {!isOwner && !isAdmin && (
              <Button
                variant="link"
                className="p-0 text-muted"
                onClick={handleReport}
                style={{ textDecoration: 'none' }}
                size="sm"
              >
                <Flag size={16} />
              </Button>
            )}
          </div>

          {/* Catégorie */}
          <div className="d-flex align-items-center text-muted small mb-2">
            <Tag size={12} className="me-1 flex-shrink-0" />
            <span className="text-truncate">{boutique.categorie || 'Boutique'}</span>
          </div>

          {/* Localisation */}
          {boutique.proprietaire?.wilaya && (
            <div className="d-flex align-items-center text-muted small mb-2">
              <GeoAlt size={12} className="me-1 flex-shrink-0" />
              <span className="text-truncate">{boutique.proprietaire.wilaya}</span>
            </div>
          )}

          {/* Stats */}
          <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
            <div className="d-flex align-items-center text-muted small">
              <Eye size={12} className="me-1" />
              <span>{boutique.stats?.vues || 0}</span>
            </div>
            
            <div className="d-flex align-items-center text-muted small">
              <BoxSeam size={12} className="me-1" />
              <span>{boutique.stats?.produits || 0} produits</span>
            </div>
            
            <div className="d-flex align-items-center text-muted small">
              <Clock size={12} className="me-1" />
              <span>
                {new Date(boutique.createdAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Modal de confirmation de suppression */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirmer la suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Êtes-vous sûr de vouloir supprimer la boutique <strong>{boutique.nom_boutique}</strong> ?</p>
          <p className="text-danger small">Cette action est irréversible.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Annuler
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Suppression...' : 'Supprimer'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de signalement */}
      <Modal show={showReportModal} onHide={() => setShowReportModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Signaler cette boutique</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Voulez-vous signaler cette boutique ?</p>
          <Form.Group>
            <Form.Label>Raison du signalement</Form.Label>
            <Form.Select>
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
        .boutique-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 30px rgba(0,0,0,0.15) !important;
        }
        
        .boutique-card:hover .card-image {
          transform: scale(1.1);
        }
        
        .boutique-card {
          transition: all 0.3s ease;
        }
        
        .image-container {
          position: relative;
        }
        
        .image-container::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, rgba(0,0,0,0.1), transparent);
          pointer-events: none;
        }

        .dropdown-toggle::after {
          display: none;
        }

        .dropdown-toggle:focus {
          box-shadow: none;
        }

        .dropdown-menu {
          min-width: 180px;
          border-radius: 12px;
          box-shadow: 0 5px 20px rgba(0,0,0,0.1);
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

export default BoutiqueCard;