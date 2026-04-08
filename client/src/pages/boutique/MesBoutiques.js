// 📂 pages/MesBoutiques.jsx - VERSIÓN CON TARJETAS COMPACTAS (estilo MesAnnoces)
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Spinner, Alert, Container, Row, Col, Button, Badge, Card } from 'react-bootstrap';
import { getUserBoutiques, deleteBoutique, updateBoutiqueStatus } from '../../redux/actions/boutiqueAction';
import { FaStore, FaPlus, FaBox, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import { Pencil, Plus, Eye, Filter, Trash } from 'react-bootstrap-icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

const MesBoutiques = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth } = useSelector(state => state);
  const { userBoutiques, loading } = useSelector(state => state.boutique || { userBoutiques: [], loading: false });
  const [refresh, setRefresh] = useState(false);
  const [filteredBoutiques, setFilteredBoutiques] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const boutiquesPerPage = 9;

  useEffect(() => {
    if (auth?.token) {
      dispatch(getUserBoutiques(auth));
    }
  }, [dispatch, auth, refresh]);

  useEffect(() => {
    if (userBoutiques && userBoutiques.length > 0) {
      filterBoutiquesByStatus(userBoutiques, filterStatus);
    } else {
      setFilteredBoutiques([]);
    }
  }, [userBoutiques, filterStatus]);

  const filterBoutiquesByStatus = (boutiques, status) => {
    let filtered = [];
    
    if (status === 'all') {
      filtered = [...boutiques];
    } else if (status === 'pending') {
      filtered = boutiques.filter(boutique => boutique.pendiente === true);
    }
    
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    setFilteredBoutiques(filtered);
    setPage(1);
    setHasMore(filtered.length > boutiquesPerPage);
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const handleDelete = async (boutiqueId, e) => {
    e.stopPropagation();
    if (window.confirm('Supprimer cette boutique ? Tous les produits seront également supprimés.')) {
      try {
        await dispatch(deleteBoutique({ boutiqueId, auth }));
        setRefresh(prev => !prev);
      } catch (error) {
        console.error('Error deleting boutique:', error);
      }
    }
  };

  const handleToggleStatus = async (boutiqueId, currentStatus, e) => {
    e.stopPropagation();
    try {
      await dispatch(updateBoutiqueStatus({
        boutiqueId,
        statusData: { isActive: !currentStatus },
        auth
      }));
      setRefresh(prev => !prev);
    } catch (error) {
      console.error('Error toggling status:', error);
    }
  };

  const handleBoutiqueClick = (boutiqueId) => {
    history.push(`/boutique/${boutiqueId}`);
  };

  const handleCreateBoutique = () => {
    history.push('/create-boutique');
  };

  const isBoutiquePending = (boutique) => {
    return boutique.pendiente === true;
  };

  const loadMoreBoutiques = () => {
    if (filteredBoutiques.length > page * boutiquesPerPage) {
      setPage(prev => prev + 1);
    } else {
      setHasMore(false);
    }
  };

  const displayedBoutiques = filteredBoutiques.slice(0, page * boutiquesPerPage);

  const stats = {
    total: userBoutiques?.length || 0,
    pending: userBoutiques?.filter(b => b.pendiente === true).length || 0
  };

  // Tarjeta compacta - MISMO ESTILO que MesAnnoces
  const CompactBoutiqueCard = ({ boutique }) => {
    const isPending = isBoutiquePending(boutique);
    
    // Obtener la primera imagen (logo o header)
    const getFirstImage = () => {
      if (boutique.images && boutique.images.length > 0) {
        const firstImage = boutique.images[0];
        return typeof firstImage === 'string' ? firstImage : firstImage?.url;
      }
      if (boutique.header_images && boutique.header_images.length > 0) {
        const firstImage = boutique.header_images[0];
        return typeof firstImage === 'string' ? firstImage : firstImage?.url;
      }
      return null;
    };

    const imageUrl = getFirstImage();

    return (
      <Card 
        className={`border-0 shadow-sm h-100 overflow-hidden ${isPending ? 'pending-card' : 'approved-card'}`}
        style={{ 
          borderRadius: '12px',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          cursor: 'pointer',
          backgroundColor: isPending ? '#fffbea' : '#ffffff'
        }}
        onClick={() => handleBoutiqueClick(boutique._id)}
      >
        {/* Badge flotante según estado de aprobación */}
        <div className="status-badge">
          {isPending ? (
            <Badge bg="warning" className="px-2 py-1 rounded-pill">
              ⏳ En attente
            </Badge>
          ) : (
            <Badge bg="success" className="px-2 py-1 rounded-pill">
              ✓ Vérifié
            </Badge>
          )}
        </div>
        
        {/* Badge de estado Activo/Inactivo */}
        <div className="active-badge">
          <Badge bg={boutique.isActive ? "success" : "secondary"} className="px-2 py-1 rounded-pill" style={{ fontSize: '0.7rem' }}>
            {boutique.isActive ? "Actif" : "Inactif"}
          </Badge>
        </div>
        
        <Row className="g-0">
          {/* Imagen pequeña - columna izquierda (como en MesAnnoces) */}
          <Col xs={4} md={4} className="p-2">
            <div 
              className="image-container"
              style={{
                position: 'relative',
                paddingTop: '100%',
                overflow: 'hidden',
                borderRadius: '8px',
                backgroundColor: '#f5f5f5'
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={boutique.nom_boutique || 'Boutique'}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#adb5bd'
                  }}
                >
                  <FaStore size={24} />
                </div>
              )}
            </div>
          </Col>
          
          {/* Contenido - columna derecha */}
          <Col xs={8} md={8}>
            <Card.Body className="p-3">
              {/* Nombre de la boutique */}
              <Card.Title 
                className="fw-bold mb-1"
                style={{ 
                  fontSize: '0.95rem',
                  lineHeight: '1.3',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {boutique.nom_boutique || 'Boutique sans nom'}
              </Card.Title>
              
              {/* Slogan (opcional, una línea) */}
              {boutique.slogan_boutique && (
                <p className="text-muted small mb-1" style={{ 
                  fontSize: '0.7rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {boutique.slogan_boutique}
                </p>
              )}
              
              {/* Stats en línea - compacto */}
              <div className="d-flex gap-3 mt-1 mb-1">
                <div className="d-flex align-items-center">
                  <FaBox size={10} className="text-muted me-1" />
                  <span className="small">{boutique.stats?.produits || 0}</span>
                </div>
                <div className="d-flex align-items-center">
                  <i className="fas fa-eye me-1" style={{ fontSize: '0.6rem' }}></i>
                  <span className="small">{boutique.views || 0}</span>
                </div>
              </div>
              
              {/* Fecha de creación */}
              <div className="d-flex align-items-center text-muted small">
                <i className="fas fa-calendar-alt me-1" style={{ fontSize: '0.7rem' }}></i>
                <span>{moment(boutique.createdAt).format('DD/MM/YYYY')}</span>
              </div>
            </Card.Body>
          </Col>
        </Row>
        
        {/* Botones de acción flotantes - MISMO estilo que MesAnnoces */}
        <div className="action-buttons">
          <Button
            variant="light"
            size="sm"
            className="rounded-circle p-1 shadow-sm"
            onClick={(e) => { e.stopPropagation(); handleBoutiqueClick(boutique._id); }}
            title="Voir"
            style={{ width: '28px', height: '28px', fontSize: '12px' }}
          >
            <Eye size={12} />
          </Button>
          
          <Button
            variant="light"
            size="sm"
            className="rounded-circle p-1 shadow-sm"
            onClick={(e) => { e.stopPropagation(); history.push(`/edit-boutique/${boutique._id}`); }}
            title="Modifier"
            style={{ width: '28px', height: '28px', fontSize: '12px' }}
          >
            <Pencil size={12} />
          </Button>
          
          <Button
            variant={boutique.isActive ? "warning" : "success"}
            size="sm"
            className="rounded-circle p-1 shadow-sm"
            onClick={(e) => handleToggleStatus(boutique._id, boutique.isActive, e)}
            title={boutique.isActive ? "Désactiver" : "Activer"}
            style={{ width: '28px', height: '28px', fontSize: '12px' }}
          >
            {boutique.isActive ? <FaToggleOff size={12} /> : <FaToggleOn size={12} />}
          </Button>
          
          <Button
            variant="danger"
            size="sm"
            className="rounded-circle p-1 shadow-sm"
            onClick={(e) => handleDelete(boutique._id, e)}
            title="Supprimer"
            style={{ width: '28px', height: '28px', fontSize: '12px' }}
          >
            <Trash size={12} />
          </Button>
        </div>
      </Card>
    );
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement de vos boutiques...</p>
      </Container>
    );
  }

  if (!auth?.token) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <h4>Authentification requise</h4>
          <p>Veuillez vous connecter pour voir vos boutiques.</p>
          <Button variant="primary" onClick={() => history.push('/login')}>
            Se connecter
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="mes-boutiques-page">
      <Container className="py-2">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <h1 className="h3 mb-0 d-flex align-items-center gap-2">
            <FaStore /> Mes Boutiques
            <Badge bg="secondary" className="ms-2">{stats.total}</Badge>
          </h1>
          
          <Button 
            variant="primary" 
            className="rounded-pill px-4"
            onClick={handleCreateBoutique}
          >
            <Plus className="me-1" size={15} />
            Créer une boutique
          </Button>
        </div>

        {/* Filtros */}
        <div className="filters-section mb-4">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <div className="d-flex align-items-center me-2">
              <Filter className="text-muted me-2" size={18} />
              <span className="text-muted">Filtrer:</span>
            </div>
            
            <Button
              variant={filterStatus === 'all' ? 'primary' : 'outline-secondary'}
              size="sm"
              className="rounded-pill px-3"
              onClick={() => handleFilterChange('all')}
            >
              Toutes <Badge bg="secondary" className="ms-1">{stats.total}</Badge>
            </Button>
            
            <Button
              variant={filterStatus === 'pending' ? 'warning' : 'outline-secondary'}
              size="sm"
              className="rounded-pill px-3"
              onClick={() => handleFilterChange('pending')}
            >
              En attente <Badge bg="warning" className="ms-1">{stats.pending}</Badge>
            </Button>
          </div>
        </div>

        {/* Listado de boutiques - MISMO estilo que los posts */}
        {filteredBoutiques.length > 0 ? (
          <InfiniteScroll
            dataLength={displayedBoutiques.length}
            next={loadMoreBoutiques}
            hasMore={hasMore}
            loader={
              <div className="text-center py-4">
                <Spinner animation="border" variant="primary" size="sm" />
                <p className="mt-2 text-muted small">Chargement...</p>
              </div>
            }
            endMessage={
              displayedBoutiques.length > 0 && displayedBoutiques.length >= filteredBoutiques.length && (
                <div className="text-center py-4">
                  <p className="text-muted mb-0">Vous avez vu toutes vos boutiques</p>
                </div>
              )
            }
          >
            <Row>
              {displayedBoutiques.map((boutique) => (
                <Col key={boutique._id} xs={12} md={6} lg={4} className="mb-4">
                  <CompactBoutiqueCard boutique={boutique} />
                </Col>
              ))}
            </Row>
          </InfiniteScroll>
        ) : (
          <div className="text-center py-5">
            <div className="empty-state mb-4">
              <FaStore size={60} className="text-muted" />
            </div>
            <h4 className="h5 mb-2">Aucune boutique</h4>
            <p className="text-muted mb-4">
              {filterStatus !== 'all' 
                ? 'Aucune boutique en attente de vérification'
                : 'Commencez par créer votre première boutique'}
            </p>
            <Button 
              variant="primary" 
              className="rounded-pill px-4"
              onClick={handleCreateBoutique}
            >
              <Plus className="me-2" size={18} />
              Créer une boutique
            </Button>
          </div>
        )}
      </Container>

      {/* Estilos - IDÉNTICOS a MesAnnoces */}
      <style jsx="true">{`
        .pending-card {
          border-left: 4px solid #ffc107 !important;
        }
        .approved-card {
          border-left: 4px solid #198754 !important;
        }
        .status-badge {
          position: absolute;
          top: 8px;
          left: 8px;
          z-index: 10;
        }
        .active-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          z-index: 10;
        }
        .action-buttons {
          position: absolute;
          bottom: 8px;
          right: 8px;
          display: flex;
          gap: 4px;
          z-index: 10;
        }
        .action-buttons .btn {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: white;
          border: 1px solid #e9ecef;
        }
        .action-buttons .btn:hover {
          transform: scale(1.05);
        }
        .card {
          transition: all 0.2s ease;
        }
        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.12) !important;
        }
      `}</style>
    </div>
  );
};

export default MesBoutiques;