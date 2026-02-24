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
  const [expandedMenus, setExpandedMenus] = useState(['general']);

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

  // Log para verificar que el ID existe
  console.log('✅ BoutiqueSidebar montado - ID:', _id);

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
  const handleCreateProduct = () => {
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
    // Menú de navegación
<Card className="border-0 shadow-sm mb-4">
  <Card.Body className="p-2">
    <Nav className="flex-column">
      {menuItems.map(menu => (
        <div key={menu.key} className="mb-1">
          {/* Encabezado del menú - DEBE SER CLICKEABLE */}
          <div
            className="menu-header d-flex justify-content-between align-items-center px-3 py-2 rounded"
            onClick={() => {
              console.log('📌 Click en menú:', menu.key);
              toggleMenu(menu.key);
            }}
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

          {/* Submenús expandidos - SE MUESTRA SI expandedMenus INCLUYE menu.key */}
          {expandedMenus.includes(menu.key) && (
            <div className="submenu-list mt-1">
              {/* Botón para crear producto - SOLO EN PRODUCTOS Y SI ES PROPIETARIO */}
              {menu.key === 'products' && isOwner && (
                <div className="px-3 mb-2">
                  <Button
                    variant="primary"
                    size="sm"
                    className="w-100 d-flex align-items-center justify-content-center"
                    onClick={(e) => {
                      e.stopPropagation(); // Evitar que el click llegue al menú
                      console.log('🖱️ Click en Nouveau produit');
                      handleCreateProduct();
                    }}
                    style={{
                      backgroundColor: couleur_theme,
                      borderColor: couleur_theme,
                      padding: '0.5rem'
                    }}
                  >
                    <FaPlusCircle className="me-2" />
                    Nouveau produit  primero button
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
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabChange?.(item.key);
                  }}
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

      {/* Menú de navegación */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body className="p-2">
          <Nav className="flex-column">
            {menuItems.map(menu => (
              <div key={menu.key} className="mb-1">
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

                {expandedMenus.includes(menu.key) && (
                  <div className="submenu-list mt-1">
                    {/* Botón para crear producto - SOLO EN PRODUCTOS Y SI ES PROPIETARIO */}
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
                       />
                        
                          Nouveau produit segundo button
                      

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

                    {menu.items.map(item => (
                      <Nav.Link
                        key={item.key}
                        onClick={() => onTabChange?.(item.key)}
                        className={`d-flex align-items-center px-4 py-2 rounded ${activeTab === item.key ? 'active' : ''
                          }`}
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