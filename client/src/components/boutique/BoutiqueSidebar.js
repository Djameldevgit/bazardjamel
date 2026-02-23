// components/boutique/BoutiqueSidebar.jsx
import React, { useState } from 'react';
import { 
  Card, 
  Nav, 
  Badge,
  Button,
  ProgressBar,
  ListGroup
} from 'react-bootstrap';
import { 
  FaStore, 
  FaBoxOpen, 
  FaChartLine, 
  FaStar,
  FaRegStar,
  FaUsers,
  FaCog,
  FaShareAlt,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaRegClock,
  FaShieldAlt,
  FaChevronRight,
  FaChevronDown,
  FaImage,
  FaInfoCircle,
  FaTags,
  FaTruck,
  FaCreditCard
} from 'react-icons/fa';

const BoutiqueSidebar = ({ boutique, activeTab, onTabChange }) => {
  const [expandedMenus, setExpandedMenus] = useState(['general']);
  
  const {
    nom_boutique,
    images = [], // Array de imágenes
    stats = { vues: 0, produits: 0, notes: 0, avis: 0 },
    plan = 'gratuit',
    isVerified,
    proprietaire,
    couleur_theme = '#2563eb'
  } = boutique;

  // La primera imagen del array es el logo de la boutique
  const logoImage = images && images.length > 0 ? images[0] : null;

  // Función para renderizar estrellas
  const renderStars = (rating = 0) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-warning" size={12} />);
      } else {
        stars.push(<FaRegStar key={i} className="text-secondary" size={12} />);
      }
    }
    return stars;
  };

  // Calcular porcentaje de perfil completado
  const calculateProfileCompletion = () => {
    let completed = 0;
    const total = 8; // Número total de secciones importantes
    
    if (logoImage) completed++; // Verificamos si hay logo (primera imagen)
    if (boutique.description_boutique) completed++;
    if (proprietaire?.telephone) completed++;
    if (proprietaire?.email) completed++;
    if (proprietaire?.wilaya) completed++;
    if (boutique.reseaux_sociaux && Object.values(boutique.reseaux_sociaux).some(v => v)) completed++;
    if (boutique.images?.length > 1) completed++; // Más de una imagen (hay galería)
    if (boutique.slogan_boutique) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => 
      prev.includes(menu) 
        ? prev.filter(m => m !== menu)
        : [...prev, menu]
    );
  };

  // Menús del sidebar
  const menuItems = [
    {
      key: 'general',
      icon: <FaStore />,
      title: 'Général',
      items: [
        { key: 'dashboard', label: 'Tableau de bord', icon: <FaChartLine /> },
        { key: 'info', label: 'Informations boutique', icon: <FaInfoCircle /> },
        { key: 'images', label: 'Images & galerie', icon: <FaImage /> }
      ]
    },
    {
      key: 'products',
      icon: <FaBoxOpen />,
      title: 'Produits',
      items: [
        { key: 'products-list', label: 'Tous les produits', icon: <FaTags /> },
        { key: 'add-product', label: 'Ajouter un produit', icon: <FaBoxOpen /> },
        { key: 'categories', label: 'Catégories', icon: <FaStore /> }
      ]
    },
    {
      key: 'orders',
      icon: <FaTruck />,
      title: 'Commandes',
      items: [
        { key: 'orders-list', label: 'Toutes les commandes', icon: <FaTruck /> },
        { key: 'pending-orders', label: 'Commandes en attente', icon: <FaRegClock /> },
        { key: 'completed-orders', label: 'Commandes terminées', icon: <FaShieldAlt /> }
      ]
    },
    {
      key: 'payments',
      icon: <FaCreditCard />,
      title: 'Paiements',
      items: [
        { key: 'transactions', label: 'Transactions', icon: <FaCreditCard /> },
        { key: 'subscription', label: 'Abonnement', icon: <FaRegStar /> }
      ]
    },
    {
      key: 'settings',
      icon: <FaCog />,
      title: 'Paramètres',
      items: [
        { key: 'profile', label: 'Profil', icon: <FaUsers /> },
        { key: 'social', label: 'Réseaux sociaux', icon: <FaShareAlt /> },
        { key: 'notifications', label: 'Notifications', icon: <FaEnvelope /> }
      ]
    }
  ];

  return (
    <div className="boutique-sidebar">
      {/* Perfil de la boutique con avatar redondo */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="text-center">
          {/* Avatar redondo estilo logo - usando la primera imagen del array */}
          <div 
            className="avatar-container mx-auto mb-3"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              border: `3px solid ${couleur_theme}`,
              overflow: 'hidden',
              backgroundColor: '#f8f9fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            {logoImage ? (
              <img 
                src={logoImage.url || logoImage} // Por si es un objeto con url o string directo
                alt={nom_boutique}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            ) : (
              <FaStore size={40} color={couleur_theme} />
            )}
          </div>

          <h5 className="mb-1 fw-bold">{nom_boutique}</h5>
          
          {/* Badges de estado */}
          <div className="mb-2">
            {isVerified ? (
              <Badge bg="success" className="me-1">Vérifié</Badge>
            ) : (
              <Badge bg="warning" text="dark" className="me-1">Non vérifié</Badge>
            )}
            <Badge 
              bg={plan === 'premium' ? 'primary' : plan === 'basique' ? 'info' : 'secondary'}
            >
              {plan.charAt(0).toUpperCase() + plan.slice(1)}
            </Badge>
          </div>

          {/* Rating */}
          <div className="mb-3">
            {renderStars(stats.notes)}
            <small className="text-muted ms-2">({stats.avis || 0} avis)</small>
          </div>

          {/* Barra de progreso del perfil */}
          <div className="profile-completion mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <small className="text-muted">Profil complété</small>
              <small className="fw-bold">{profileCompletion}%</small>
            </div>
            <ProgressBar 
              now={profileCompletion} 
              variant={profileCompletion === 100 ? 'success' : 'primary'}
              style={{ height: '6px' }}
            />
          </div>

          {/* Información de contacto rápida */}
          {proprietaire && (
            <div className="contact-info text-start small">
              {proprietaire.wilaya && (
                <p className="mb-1 text-muted">
                  <FaMapMarkerAlt className="me-2 text-danger" size={12} />
                  {proprietaire.wilaya}
                </p>
              )}
              {proprietaire.telephone && (
                <p className="mb-1 text-muted">
                  <FaPhone className="me-2 text-primary" size={12} />
                  {proprietaire.telephone}
                </p>
              )}
              {proprietaire.email && (
                <p className="mb-1 text-muted text-truncate">
                  <FaEnvelope className="me-2 text-danger" size={12} />
                  {proprietaire.email}
                </p>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Menú de navegación */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Nav className="flex-column">
            {menuItems.map((menu) => (
              <div key={menu.key} className="menu-section">
                {/* Título del menú */}
                <div 
                  className="menu-header d-flex align-items-center justify-content-between px-3 py-2"
                  onClick={() => toggleMenu(menu.key)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: expandedMenus.includes(menu.key) ? '#f8f9fa' : 'transparent',
                    borderLeft: expandedMenus.includes(menu.key) ? `3px solid ${couleur_theme}` : '3px solid transparent'
                  }}
                >
                  <div className="d-flex align-items-center">
                    <span className="me-2" style={{ color: couleur_theme }}>{menu.icon}</span>
                    <span className="fw-semibold">{menu.title}</span>
                  </div>
                  {expandedMenus.includes(menu.key) ? 
                    <FaChevronDown size={12} /> : 
                    <FaChevronRight size={12} />
                  }
                </div>

                {/* Submenús */}
                {expandedMenus.includes(menu.key) && (
                  <div className="submenu-list">
                    {menu.items.map((item) => (
                      <Nav.Link
                        key={item.key}
                        onClick={() => onTabChange?.(item.key)}
                        className={`d-flex align-items-center px-4 py-2 ${activeTab === item.key ? 'active' : ''}`}
                        style={{
                          color: activeTab === item.key ? couleur_theme : '#6c757d',
                          backgroundColor: activeTab === item.key ? `${couleur_theme}10` : 'transparent',
                          borderLeft: activeTab === item.key ? `2px solid ${couleur_theme}` : '2px solid transparent'
                        }}
                      >
                        <span className="me-2" style={{ fontSize: '0.9rem' }}>{item.icon}</span>
                        <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
                      </Nav.Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </Nav>
        </Card.Body>
      </Card>

      {/* Tarjeta de estadísticas rápidas */}
      <Card className="border-0 shadow-sm mt-4">
        <Card.Body>
          <h6 className="fw-bold mb-3">Statistiques rapides</h6>
          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
              <span className="text-muted">Vues totales</span>
              <span className="fw-bold">{stats.vues?.toLocaleString() || 0}</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
              <span className="text-muted">Produits</span>
              <span className="fw-bold">{stats.produits || 0}</span>
            </ListGroup.Item>
            <ListGroup.Item className="d-flex justify-content-between align-items-center px-0">
              <span className="text-muted">Note moyenne</span>
              <span className="fw-bold">{stats.notes?.toFixed(1) || 0}/5</span>
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BoutiqueSidebar;