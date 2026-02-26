// components/boutique/BoutiqueSidebar.jsx
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Nav, Badge, ProgressBar, ListGroup, Button } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import {
  FaStore, FaBoxOpen, FaChartLine, FaStar, FaRegStar, FaUsers, FaCog, FaShareAlt,
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaRegClock, FaShieldAlt, FaChevronRight,
  FaChevronDown, FaImage, FaInfoCircle, FaTags, FaTruck, FaCreditCard, FaPlusCircle,
  FaCheckCircle, FaExclamationCircle, FaGlobe, FaWhatsapp, FaFacebook, FaInstagram,
  FaTiktok, FaEye, FaBoxes, FaCalendarAlt, FaUserTie
} from 'react-icons/fa';

const BoutiqueSidebar = ({ boutique, activeTab, onTabChange }) => {
  const history = useHistory();
  const { auth } = useSelector(state => state);
  
  // IMPORTANTE: Incluir 'products' en el estado inicial para que el menú esté expandido
  const [expandedMenus, setExpandedMenus] = useState(['general', 'products']);

  // IMPORTANTE: Incluir _id en la desestructuración
  const {
    _id, // ID de la boutique
    nom_boutique,
    images = [],
    stats = { vues: 0, produits: 0, notes: 0, avis: 0 },
    plan = 'gratuit',
    isVerified,
    proprietaire,
    user, // ID del usuario propietario
    couleur_theme = '#6366F1',
    reseaux_sociaux = {},
    createdAt,
    description_boutique,
    slogan_boutique
  } = boutique;

  // Logs para depuración
  console.log('✅ BoutiqueSidebar montado - ID:', _id);
  console.log('👤 auth.user?._id:', auth.user?._id);
  console.log('🏪 boutique.user:', user);
  console.log('🔐 isOwner:', auth.user?._id === user);
  console.log('📋 expandedMenus:', expandedMenus);

  const logoImage = images.length > 0 ? images[0] : null;
  const isOwner = auth.user?._id === user;

  // Función para renderizar estrellas
  const renderStars = (rating = 0) => {
    return Array.from({ length: 5 }).map((_, i) =>
      i < Math.round(rating)
        ? <FaStar key={i} className="text-warning" size={12} />
        : <FaRegStar key={i} className="text-secondary" size={12} style={{ opacity: 0.5 }} />
    );
  };

  // Calcular porcentaje del perfil
  const calculateProfileCompletion = () => {
    let completed = 0;
    const total = 8;
    if (logoImage) completed++;
    if (description_boutique) completed++;
    if (proprietaire?.telephone) completed++;
    if (proprietaire?.email) completed++;
    if (proprietaire?.wilaya) completed++;
    if (Object.values(reseaux_sociaux).some(v => v)) completed++;
    if (images?.length > 1) completed++;
    if (slogan_boutique) completed++;
    return Math.round((completed / total) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  // Obtener límite de productos según plan
  const getProductLimit = () => {
    const limits = {
      'gratuit': 10,
      'basique': 50,
      'premium': 200,
      'entreprise': 1000
    };
    return limits[plan] || 10;
  };

  const productLimit = getProductLimit();
  const productUsage = stats.produits || 0;
  const productPercentage = Math.min((productUsage / productLimit) * 100, 100);

  // Función para navegar a creación de producto
  const handleCreateProduct = (e) => {
    if (e) e.stopPropagation();
    if (!_id) {
      console.error('❌ Error: ID de boutique no disponible');
      return;
    }
    
    const url = `/boutique/${_id}/products/new`;
    console.log('🔗 Navegando a:', url);
    history.push(url);
  };

  const toggleMenu = (menu) => {
    setExpandedMenus(prev =>
      prev.includes(menu)
        ? prev.filter(m => m !== menu)
        : [...prev, menu]
    );
  };

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
      {/* Tarjeta de perfil */}
      <Card className="border-0 shadow-sm mb-4 overflow-hidden">
        <div
          className="profile-header p-4 text-center position-relative"
          style={{
            background: `linear-gradient(135deg, ${couleur_theme} 0%, ${couleur_theme}dd 100%)`,
            borderBottom: '1px solid rgba(255,255,255,0.1)'
          }}
        >
          <div
            className="avatar-container mx-auto mb-2"
            style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              border: '4px solid white',
              overflow: 'hidden',
              backgroundColor: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            {logoImage ? (
              <img
                src={logoImage.url || logoImage}
                alt={nom_boutique}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <FaStore size={50} color={couleur_theme} />
            )}
          </div>

          <h5 className="text-white mb-1 fw-bold">{nom_boutique}</h5>
          {slogan_boutique && (
            <p className="text-white-50 small mb-2">{slogan_boutique}</p>
          )}

          <div className="d-flex justify-content-center gap-1">
            {isVerified ? (
              <Badge bg="success" className="px-2 py-1 rounded-pill">
                <FaCheckCircle className="me-1" size={10} />
                Vérifié
              </Badge>
            ) : (
              <Badge bg="warning" text="dark" className="px-2 py-1 rounded-pill">
                <FaExclamationCircle className="me-1" size={10} />
                Non vérifié
              </Badge>
            )}
            <Badge
              bg={plan === 'premium' ? 'warning' : plan === 'basique' ? 'info' : 'secondary'}
              className="px-2 py-1 rounded-pill"
            >
              <FaStore className="me-1" size={10} />
              {plan.charAt(0).toUpperCase() + plan.slice(1)}
            </Badge>
          </div>
        </div>

        <Card.Body className="p-3">
          <div className="d-flex justify-content-center align-items-center mb-3">
            <div className="me-2">
              {renderStars(stats.notes)}
            </div>
            <small className="text-muted">
              ({stats.avis || 0} avis)
            </small>
          </div>

          <div className="profile-completion mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <small className="text-muted">
                <FaCheckCircle className="me-1 text-success" size={10} />
                Profil complété
              </small>
              <small className="fw-bold">{profileCompletion}%</small>
            </div>
            <ProgressBar
              now={profileCompletion}
              variant={profileCompletion === 100 ? 'success' : 'primary'}
              style={{ height: '6px', borderRadius: '3px' }}
            />
          </div>

          {proprietaire && (
            <div className="contact-info bg-light p-2 rounded mb-3">
              {proprietaire.wilaya && (
                <div className="d-flex align-items-center text-muted small mb-1">
                  <FaMapMarkerAlt className="text-danger me-2 flex-shrink-0" size={12} />
                  <span className="text-truncate">{proprietaire.wilaya}</span>
                </div>
              )}
              {proprietaire.telephone && (
                <div className="d-flex align-items-center text-muted small mb-1">
                  <FaPhone className="text-primary me-2 flex-shrink-0" size={12} />
                  <span className="text-truncate">{proprietaire.telephone}</span>
                </div>
              )}
              {proprietaire.email && (
                <div className="d-flex align-items-center text-muted small">
                  <FaEnvelope className="text-danger me-2 flex-shrink-0" size={12} />
                  <span className="text-truncate">{proprietaire.email}</span>
                </div>
              )}
            </div>
          )}

          <div className="quick-stats-grid mb-3">
            <div className="stat-item">
              <FaEye className="stat-icon text-info" />
              <span className="stat-label">Vues</span>
              <span className="stat-value">{stats.vues?.toLocaleString() || 0}</span>
            </div>
            <div className="stat-item">
              <FaBoxes className="stat-icon text-primary" />
              <span className="stat-label">Produits</span>
              <span className="stat-value">{stats.produits || 0}</span>
            </div>
            <div className="stat-item">
              <FaStar className="stat-icon text-warning" />
              <span className="stat-label">Note</span>
              <span className="stat-value">{stats.notes?.toFixed(1) || 0}</span>
            </div>
            <div className="stat-item">
              <FaCalendarAlt className="stat-icon text-secondary" />
              <span className="stat-label">Depuis</span>
              <span className="stat-value">
                {createdAt ? new Date(createdAt).getFullYear() : 'N/A'}
              </span>
            </div>
          </div>

          {Object.values(reseaux_sociaux).some(v => v) && (
            <div className="social-mini d-flex justify-content-center gap-2 mb-2">
              {reseaux_sociaux.facebook && <FaFacebook className="text-primary" size={16} />}
              {reseaux_sociaux.instagram && <FaInstagram className="text-danger" size={16} />}
              {reseaux_sociaux.tiktok && <FaTiktok className="text-dark" size={16} />}
              {reseaux_sociaux.whatsapp && <FaWhatsapp className="text-success" size={16} />}
              {reseaux_sociaux.website && <FaGlobe className="text-secondary" size={16} />}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Menú de navegación - CORREGIDO Y SIMPLIFICADO */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-2">
          <Nav className="flex-column">
            {menuItems.map(menu => (
              <div key={menu.key} className="mb-1">
                {/* Encabezado del menú */}
                <div
                  className="menu-header d-flex justify-content-between align-items-center px-3 py-2 rounded"
                  onClick={() => toggleMenu(menu.key)}
                  style={{
                    cursor: 'pointer',
                    backgroundColor: expandedMenus.includes(menu.key) ? '#f8f9fa' : 'transparent',
                    color: expandedMenus.includes(menu.key) ? couleur_theme : '#6c757d',
                    transition: 'all 0.2s'
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

                {/* Submenús expandidos */}
                {expandedMenus.includes(menu.key) && (
                  <div className="submenu-list mt-1">
                    {/* BOTÓN DE CREAR PRODUCTO - AHORA SIEMPRE VISIBLE PARA DUEÑO */}
                    {menu.key === 'products' && isOwner && (
                      <div className="px-3 mb-2">
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-100 d-flex align-items-center justify-content-center"
                          onClick={handleCreateProduct}
                          style={{
                            backgroundColor: couleur_theme,
                            borderColor: couleur_theme,
                            padding: '0.5rem'
                          }}
                        >
                          <FaPlusCircle className="me-2" />
                          Nouveau produit
                        </Button>

                        <div className="mt-2">
                          <div className="d-flex justify-content-between small">
                            <span className="text-muted">Utilisation</span>
                            <span className={productUsage >= productLimit ? 'text-danger fw-bold' : 'text-success'}>
                              {productUsage}/{productLimit}
                            </span>
                          </div>
                          <ProgressBar
                            now={productPercentage}
                            variant={productUsage >= productLimit ? 'danger' : 'success'}
                            style={{ height: '4px' }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Items del menú */}
                    {menu.items.map(item => (
                      <Nav.Link
                        key={item.key}
                        onClick={() => onTabChange?.(item.key)}
                        className={`d-flex align-items-center px-4 py-2 rounded ${activeTab === item.key ? 'active' : ''}`}
                        style={{
                          color: activeTab === item.key ? couleur_theme : '#6c757d',
                          backgroundColor: activeTab === item.key ? `${couleur_theme}10` : 'transparent',
                          borderLeft: activeTab === item.key ? `3px solid ${couleur_theme}` : '3px solid transparent',
                          fontSize: '0.9rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        <span className="me-2" style={{ fontSize: '0.9rem' }}>{item.icon}</span>
                        {item.label}
                      </Nav.Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </Nav>
        </Card.Body>
      </Card>

      {/* Tarjeta de estadísticas */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <h6 className="fw-bold mb-3 d-flex align-items-center">
            <FaChartLine className="me-2" style={{ color: couleur_theme }} />
            Statistiques détaillées
          </h6>

          <ListGroup variant="flush">
            <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 border-0 bg-transparent">
              <span className="text-muted small">
                <FaEye className="me-2 text-info" size={12} />
                Vues totales
              </span>
              <span className="fw-bold">{stats.vues?.toLocaleString() || 0}</span>
            </ListGroup.Item>

            <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 border-0 bg-transparent">
              <span className="text-muted small">
                <FaBoxes className="me-2 text-primary" size={12} />
                Produits
              </span>
              <span className="fw-bold">{stats.produits || 0}</span>
            </ListGroup.Item>

            <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 border-0 bg-transparent">
              <span className="text-muted small">
                <FaStar className="me-2 text-warning" size={12} />
                Note moyenne
              </span>
              <span className="fw-bold">{stats.notes?.toFixed(1) || 0}/5</span>
            </ListGroup.Item>

            <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 border-0 bg-transparent">
              <span className="text-muted small">
                <FaUserTie className="me-2 text-success" size={12} />
                Avis
              </span>
              <span className="fw-bold">{stats.avis || 0}</span>
            </ListGroup.Item>
          </ListGroup>

          <div className="mt-3 pt-2 border-top">
            <small className="text-muted d-flex align-items-center">
              <FaStore className="me-1" size={10} />
              Plan {plan.charAt(0).toUpperCase() + plan.slice(1)}
              {plan === 'premium' && ' 👑'}
            </small>
          </div>
        </Card.Body>
      </Card>

      <style jsx="true">{`
        .quick-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          background-color: #f8f9fa;
          border-radius: 10px;
          padding: 10px;
        }
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        
        .stat-icon {
          font-size: 14px;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 0.6rem;
          color: #6c757d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .stat-value {
          font-size: 0.8rem;
          font-weight: 600;
          color: #212529;
        }
        
        .menu-header:hover {
          background-color: #f8f9fa;
        }
        
        .profile-header {
          position: relative;
          overflow: hidden;
        }
        
        .profile-header::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2) 0%, transparent 70%);
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default BoutiqueSidebar;