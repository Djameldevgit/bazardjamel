// 📂 src/components/boutique/BoutiqueSelector.js
import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Badge, Spinner, Alert, Form } from 'react-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';

const BoutiqueSelector = ({ 
  selectedBoutiqueId, 
  onSelectBoutique, 
  showCreateButton = true,
  disabled = false 
}) => {
  const { auth } = useSelector(state => state);
  const [boutiques, setBoutiques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedForDetails, setSelectedForDetails] = useState(null);
  
  // Cargar boutiques del usuario
  useEffect(() => {
    const fetchUserBoutiques = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/user/boutiques', {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        setBoutiques(response.data.boutiques || []);
      } catch (err) {
        console.error('Error fetching boutiques:', err);
        setError('Erreur lors du chargement de vos boutiques');
      } finally {
        setLoading(false);
      }
    };
    
    if (auth.token) {
      fetchUserBoutiques();
    }
  }, [auth.token]);
  
  // Redirigir a creación de boutique
  const handleCreateBoutique = () => {
    window.location.href = '/create-boutique';
  };
  
  // Ver detalles de una boutique
  const handleViewDetails = (boutique) => {
    setSelectedForDetails(boutique);
  };
  
  // Renderizar badge de status
  const renderStatusBadge = (status) => {
    const statusConfig = {
      'active': { variant: 'success', label: 'Active' },
      'pending': { variant: 'warning', label: 'En attente' },
      'suspended': { variant: 'danger', label: 'Suspendue' },
      'expired': { variant: 'secondary', label: 'Expirée' }
    };
    
    const config = statusConfig[status] || { variant: 'light', label: status };
    
    return (
      <Badge bg={config.variant} className="ms-2">
        {config.label}
      </Badge>
    );
  };
  
  // Renderizar lista de boutiques
  const renderBoutiquesList = () => {
    if (loading) {
      return (
        <div className="text-center py-4">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2 text-muted">Chargement de vos boutiques...</p>
        </div>
      );
    }
    
    if (error) {
      return (
        <Alert variant="danger">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      );
    }
    
    if (boutiques.length === 0) {
      return (
        <div className="text-center py-4">
          <i className="fas fa-store fa-3x text-muted mb-3"></i>
          <h5>Vous n'avez pas encore de boutique</h5>
          <p className="text-muted mb-3">
            Créez votre première boutique pour vendre vos produits en ligne
          </p>
          {showCreateButton && (
            <Button variant="primary" onClick={handleCreateBoutique}>
              <i className="fas fa-plus me-2"></i>
              Créer une boutique
            </Button>
          )}
        </div>
      );
    }
    
    return (
      <div className="boutiques-grid">
        {boutiques.map(boutique => (
          <Card 
            key={boutique._id} 
            className={`boutique-card ${selectedBoutiqueId === boutique._id ? 'selected' : ''}`}
            onClick={() => !disabled && onSelectBoutique(boutique._id)}
            style={{ cursor: disabled ? 'default' : 'pointer' }}
          >
            <Card.Body>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center">
                  {boutique.logo?.url ? (
                    <img 
                      src={boutique.logo.url} 
                      alt={boutique.nom_boutique}
                      className="boutique-logo me-2"
                    />
                  ) : (
                    <div className="boutique-logo-placeholder me-2">
                      <i className="fas fa-store"></i>
                    </div>
                  )}
                  <div>
                    <h6 className="mb-0">{boutique.nom_boutique}</h6>
                    <small className="text-muted">
                      {boutique.domaine_boutique}.monsite.dz
                    </small>
                  </div>
                </div>
                {renderStatusBadge(boutique.status)}
              </div>
              
              <div className="boutique-stats d-flex justify-content-between mb-3">
                <div className="text-center">
                  <div className="stat-number">{boutique.produits_count || 0}</div>
                  <small className="text-muted">Produits</small>
                </div>
                <div className="text-center">
                  <div className="stat-number">{boutique.vues || 0}</div>
                  <small className="text-muted">Vues</small>
                </div>
                <div className="text-center">
                  <div className="stat-number">{boutique.plan || 'Gratuit'}</div>
                  <small className="text-muted">Plan</small>
                </div>
              </div>
              
              <div className="d-flex justify-content-between">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewDetails(boutique);
                  }}
                >
                  <i className="fas fa-eye me-1"></i>
                  Détails
                </Button>
                
                <Button
                  variant={selectedBoutiqueId === boutique._id ? "primary" : "outline-primary"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBoutique(boutique._id);
                  }}
                  disabled={disabled || boutique.status !== 'active'}
                >
                  {selectedBoutiqueId === boutique._id ? (
                    <>
                      <i className="fas fa-check me-1"></i>
                      Sélectionnée
                    </>
                  ) : (
                    'Sélectionner'
                  )}
                </Button>
              </div>
              
              {boutique.status !== 'active' && (
                <Alert variant="warning" className="mt-2 mb-0 py-1">
                  <small>
                    <i className="fas fa-exclamation-triangle me-1"></i>
                    Cette boutique n'est pas active
                  </small>
                </Alert>
              )}
            </Card.Body>
          </Card>
        ))}
      </div>
    );
  };
  
  return (
    <div className="boutique-selector">
      <div className="selector-header mb-3">
        <h6 className="mb-1">
          <i className="fas fa-store me-2"></i>
          Associer à une boutique
        </h6>
        <small className="text-muted">
          {disabled 
            ? 'Option désactivée pour cette catégorie'
            : 'Optionnel - Votre produit apparaîtra dans votre boutique'
          }
        </small>
      </div>
      
      {renderBoutiquesList()}
      
      {/* Modal de détails */}
      <Modal show={!!selectedForDetails} onHide={() => setSelectedForDetails(null)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="fas fa-store me-2"></i>
            {selectedForDetails?.nom_boutique}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedForDetails && (
            <div>
              <div className="row mb-4">
                <div className="col-md-4">
                  {selectedForDetails.logo?.url ? (
                    <img 
                      src={selectedForDetails.logo.url} 
                      alt={selectedForDetails.nom_boutique}
                      className="img-fluid rounded"
                    />
                  ) : (
                    <div className="text-center py-4 bg-light rounded">
                      <i className="fas fa-store fa-3x text-muted"></i>
                    </div>
                  )}
                </div>
                <div className="col-md-8">
                  <h5>{selectedForDetails.nom_boutique}</h5>
                  <p className="text-muted">{selectedForDetails.slogan_boutique}</p>
                  
                  <div className="row mb-3">
                    <div className="col-6">
                      <strong>Domaine:</strong><br />
                      <span className="text-muted">
                        {selectedForDetails.domaine_boutique}.monsite.dz
                      </span>
                    </div>
                    <div className="col-6">
                      <strong>Status:</strong><br />
                      {renderStatusBadge(selectedForDetails.status)}
                    </div>
                  </div>
                  
                  <div className="row">
                    <div className="col-6">
                      <strong>Plan:</strong><br />
                      <span className="text-muted">{selectedForDetails.plan}</span>
                    </div>
                    <div className="col-6">
                      <strong>Abonnement:</strong><br />
                      <span className="text-muted">{selectedForDetails.duree_abonnement}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <hr />
              
              <h6>Description</h6>
              <p className="text-muted">{selectedForDetails.description_boutique}</p>
              
              <h6>Catégories</h6>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {selectedForDetails.categories_produits?.map(cat => (
                  <Badge key={cat} bg="light" text="dark">
                    {cat}
                  </Badge>
                ))}
              </div>
              
              <h6>Contact</h6>
              <div className="row">
                <div className="col-md-6">
                  <strong>Email:</strong><br />
                  <span className="text-muted">{selectedForDetails.proprietaire?.email}</span>
                </div>
                <div className="col-md-6">
                  <strong>Téléphone:</strong><br />
                  <span className="text-muted">{selectedForDetails.proprietaire?.telephone}</span>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedForDetails(null)}>
            Fermer
          </Button>
          <Button 
            variant="primary"
            onClick={() => {
              if (selectedForDetails?.status === 'active') {
                onSelectBoutique(selectedForDetails._id);
                setSelectedForDetails(null);
              }
            }}
            disabled={selectedForDetails?.status !== 'active'}
          >
            Sélectionner cette boutique
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Estilos */}
      <style jsx>{`
        .boutique-selector {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #dee2e6;
        }
        
        .boutiques-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 15px;
          max-height: 400px;
          overflow-y: auto;
          padding: 5px;
        }
        
        .boutique-card {
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }
        
        .boutique-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        
        .boutique-card.selected {
          border-color: #0d6efd;
          background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        }
        
        .boutique-logo {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          object-fit: cover;
        }
        
        .boutique-logo-placeholder {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: #e9ecef;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6c757d;
        }
        
        .boutique-stats {
          padding: 10px 0;
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
        }
        
        .stat-number {
          font-weight: bold;
          font-size: 1.2rem;
          color: #0d6efd;
        }
        
        .selector-header {
          padding-bottom: 10px;
          border-bottom: 1px solid #dee2e6;
        }
        
        @media (max-width: 768px) {
          .boutiques-grid {
            grid-template-columns: 1fr;
          }
          
          .boutique-selector {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default BoutiqueSelector;