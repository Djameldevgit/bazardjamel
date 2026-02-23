// components/boutique/BoutiqueCard.jsx
import React, { useState } from 'react';
import { Card, Form, Badge, Dropdown, Modal, Button } from 'react-bootstrap';
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
  FaEllipsisV,
  FaEdit,
  FaTrash,
  FaArchive,
  FaFlag,
  FaStar,
  FaRegStar
} from 'react-icons/fa';
import { deleteBoutique, updateBoutiqueStatus } from '../redux/actions/boutiqueAction';
import { GLOBALTYPES } from '../redux/actions/globalTypes';

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
    if (e.target.closest('.dropdown-toggle') || e.target.closest('.dropdown-menu') || e.target.closest('.report-btn')) {
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

  // Obtener la primera imagen para el logo
  const getLogoImage = () => {
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
  
  const handleEdit = (e) => {
    e.stopPropagation();
    history.push(`/edit-boutique/${boutique._id}`, { 
      boutiqueData: boutique,
      isEdit: true 
    });
  };

  // Obtener color de fondo basado en la categoría
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
    return colorMap[category] || boutique.couleur_theme || '#6366F1';
  };

  const logoImage = getLogoImage();
  const categoryColor = getCategoryColor();
  const planName = boutique.plan === 'gratuit' ? 'Gratuit' : 
                   boutique.plan === 'basique' ? 'Basique' :
                   boutique.plan === 'premium' ? 'Premium' : 'Pro';

  // Fonction pour afficher les étoiles
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.round(rating)) {
        stars.push(<FaStar key={i} className="text-warning" size={12} />);
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
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}
      >
        {/* Background color (bientôt remplacé par image internet) */}
        <div 
          className="position-relative"
          style={{
            height: '120px',
            background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%)`,
            position: 'relative'
          }}
        >
          {/* Badges supérieurs */}
          <div className="position-absolute top-0 start-0 m-3 d-flex gap-1">
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

          <div className="position-absolute top-0 end-0 m-3">
            <Badge 
              bg={boutique.plan === 'premium' ? 'warning' : 'secondary'}
              style={{ 
                padding: '0.3rem 0.6rem',
                borderRadius: '20px',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                backgroundColor: boutique.plan === 'premium' ? 'rgba(255, 193, 7, 0.95)' : 'rgba(108, 117, 125, 0.95)',
                border: '1px solid rgba(255,255,255,0.3)'
              }}
            >
              <FaCrown size={10} className="me-1" />
              {planName}
            </Badge>
          </div>
        </div>

        {/* Logo circulaire - Élément distinctif */}
        <div className="position-relative text-center" style={{ marginTop: '-50px', marginBottom: '10px' }}>
          <div 
            className="d-inline-flex align-items-center justify-content-center"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              backgroundColor: 'white',
              border: `4px solid ${categoryColor}`,
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
              />
            ) : (
              <FaStore size={50} color={categoryColor} />
            )}
          </div>

          {/* Indicateur de statut */}
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
                transform: 'translateX(-50%)'
              }}
              title="Boutique inactive"
            />
          )}
        </div>

        <Card.Body className="d-flex flex-column pt-0 px-3 pb-3">
          {/* En-tête avec nom et menu */}
          <div className="d-flex justify-content-between align-items-start mb-2">
            <div className="flex-grow-1 text-center">
              <h6 className="fw-bold mb-1" style={{ fontSize: '1.1rem', color: categoryColor }}>
                {boutique.nom_boutique}
              </h6>
              {boutique.slogan_boutique && (
                <small className="text-muted d-block" style={{ fontStyle: 'italic', fontSize: '0.8rem' }}>
                  "{boutique.slogan_boutique}"
                </small>
              )}
            </div>
            
            {/* Dropdown d'actions */}
            {(isOwner || isAdmin) && (
              <Dropdown align="end" onClick={(e) => e.stopPropagation()}>
                <Dropdown.Toggle 
                  variant="link" 
                  className="p-0 text-dark"
                  style={{ textDecoration: 'none', boxShadow: 'none' }}
                >
                  <FaEllipsisV size={16} />
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item onClick={handleEdit}>
                    <FaEdit size={14} className="me-2" />
                    Modifier
                  </Dropdown.Item>
                  
                  {(isOwner || isAdmin) && (
                    <Dropdown.Item onClick={handleToggleActive}>
                      <FaArchive size={14} className="me-2" />
                      {boutique.isActive ? 'Désactiver' : 'Activer'}
                    </Dropdown.Item>
                  )}
                  
                  {(isOwner || isAdmin) && (
                    <Dropdown.Item 
                      onClick={() => setShowDeleteModal(true)}
                      className="text-danger"
                    >
                      <FaTrash size={14} className="me-2" />
                      Supprimer
                    </Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            )}

            {/* Bouton de signalement */}
            {!isOwner && !isAdmin && (
              <Button
                variant="link"
                className="p-0 text-muted report-btn"
                onClick={handleReport}
                style={{ textDecoration: 'none' }}
                size="sm"
              >
                <FaFlag size={16} />
              </Button>
            )}
          </div>

          {/* Catégorie */}
          <div className="text-center mb-3">
            <span 
              style={{
                backgroundColor: `${categoryColor}15`,
                color: categoryColor,
                padding: '0.25rem 1rem',
                borderRadius: '30px',
                fontSize: '0.8rem',
                fontWeight: '500',
                display: 'inline-block'
              }}
            >
              <FaTag size={12} className="me-1" />
              {boutique.categorie || 'Boutique'}
            </span>
          </div>

          {/* Informations en ligne */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-2">
            {/* Localisation */}
            {boutique.proprietaire?.wilaya && (
              <div className="d-flex align-items-center text-muted small me-2">
                <FaMapMarkerAlt size={12} className="text-danger me-1" />
                <span>{boutique.proprietaire.wilaya}</span>
              </div>
            )}

            {/* Produits */}
            <div className="d-flex align-items-center text-muted small me-2">
              <FaBoxes size={12} className="text-primary me-1" />
              <span>{boutique.stats?.produits || 0}</span>
            </div>

            {/* Vues */}
            <div className="d-flex align-items-center text-muted small">
              <FaEye size={12} className="text-info me-1" />
              <span>{boutique.stats?.vues || 0}</span>
            </div>
          </div>

          {/* Date et note */}
          <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
            <div className="d-flex align-items-center text-muted small">
              <FaClock size={12} className="me-1" />
              <span>
                {new Date(boutique.createdAt).toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
              </span>
            </div>
            
            {boutique.stats?.notes > 0 && (
              <div className="d-flex align-items-center">
                {renderStars(boutique.stats.notes)}
                <small className="text-muted ms-1">
                  ({boutique.stats.avis || 0})
                </small>
              </div>
            )}
          </div>
        </Card.Body>

        {/* Badge "Boutique" distinctif */}
        <div 
          className="position-absolute top-0 end-0 m-2"
          style={{ zIndex: 3 }}
        >
          <Badge 
            style={{
              backgroundColor: categoryColor,
              color: 'white',
              padding: '0.2rem 0.6rem',
              borderRadius: '12px',
              fontSize: '0.65rem',
              fontWeight: 'normal',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <FaStore size={8} className="me-1" />
            Boutique
          </Badge>
        </div>
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
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.12) !important;
        }
        
        .boutique-card:hover .d-inline-flex {
          transform: scale(1.05);
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

        .report-btn:hover {
          color: #dc3545 !important;
        }
      `}</style>
    </>
  );
};

export default BoutiqueCard;