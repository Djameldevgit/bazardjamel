import React, { useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { 
  FaHome, FaUser, FaList, FaPlus, FaShoppingCart, 
  FaTicketAlt, FaPlane, FaStore, FaBullhorn, 
  FaCreditCard, FaCog, FaChartLine, FaBell,
  FaBox, FaShippingFast, FaFileInvoiceDollar, FaChevronDown
} from 'react-icons/fa';

const DashboardNavbar = () => {
  const location = useLocation();
  const history = useHistory();
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Opciones principales del navbar
  const mainItems = [
    { 
      icon: FaHome, 
      label: 'Tableau de bord', 
      path: '/users/dashboardpage',
      color: '#667eea'
    },
    { 
      icon: FaUser, 
      label: 'Mon Profil', 
      path: '/profile',
      color: '#f093fb'
    },
    { 
      icon: FaChartLine, 
      label: 'Statistiques', 
      path: '/statistiques',
      color: '#37ecba'
    },
  ];

  // Menús desplegables
  const dropdownMenus = [
    {
      id: 'annonces',
      label: 'Annonces',
      icon: FaList,
      color: '#48c6ef',
      items: [
        { label: 'Mes Annonces', path: '/mes-annonces', icon: FaList },
        { label: 'Ajouter Annonce', path: '/creer-annonce', icon: FaPlus, color: '#28a745' },
        { label: 'Annonces Favorites', path: '/favoris', icon: FaBell },
      ]
    },
    {
      id: 'commandes',
      label: 'Commandes',
      icon: FaShoppingCart,
      color: '#f5576c',
      items: [
        { label: 'Mes Commandes', path: '/mes-commandes', icon: FaShoppingCart },
        { label: 'Tickets Livraison', path: '/tickets-livraison', icon: FaTicketAlt },
        { label: 'Historique', path: '/historique-commandes', icon: FaFileInvoiceDollar },
      ]
    },
    {
      id: 'services',
      label: 'Services',
      icon: FaPlane,
      color: '#ff9a9e',
      items: [
        { label: 'Demandes Devis', path: '/demandes-devis', icon: FaPlane },
        { label: 'Mes Voyages', path: '/mes-voyages', icon: FaShippingFast },
      ]
    },
    {
      id: 'publicite',
      label: 'Publicité',
      icon: FaBullhorn,
      color: '#a18cd1',
      items: [
        { label: 'Achat Store', path: '/achat-store', icon: FaStore },
        { label: 'Achat Publicité', path: '/achat-publicite', icon: FaBullhorn },
        { label: 'Campagnes', path: '/campagnes', icon: FaChartLine },
      ]
    },
    {
      id: 'finances',
      label: 'Finances',
      icon: FaCreditCard,
      color: '#667eea',
      items: [
        { label: 'Transactions', path: '/transactions', icon: FaCreditCard },
        { label: 'Factures', path: '/factures', icon: FaFileInvoiceDollar },
        { label: 'Portefeuille', path: '/portefeuille' },
      ]
    }
  ];

  const toggleDropdown = (menuId) => {
    setActiveDropdown(activeDropdown === menuId ? null : menuId);
  };

  const closeDropdowns = () => {
    setActiveDropdown(null);
  };

  const handleNavigation = (path) => {
    history.push(path);
    closeDropdowns();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={styles.navbar} onMouseLeave={closeDropdowns}>
      <div style={styles.navContainer}>
        {/* Items principales */}
        <div style={styles.mainItems}>
          {mainItems.map((item, index) => (
            <button
              key={index}
              onClick={() => handleNavigation(item.path)}
              style={{
                ...styles.navButton,
                backgroundColor: isActive(item.path) ? `${item.color}15` : 'transparent',
                borderBottom: isActive(item.path) ? `3px solid ${item.color}` : '3px solid transparent'
              }}
            >
              <item.icon style={{ 
                ...styles.navIcon, 
                color: isActive(item.path) ? item.color : '#6c757d' 
              }} />
              <span style={styles.navLabel}>{item.label}</span>
            </button>
          ))}
        </div>

        {/* Dropdowns */}
        <div style={styles.dropdowns}>
          {dropdownMenus.map((menu) => (
            <div 
              key={menu.id} 
              style={styles.dropdownWrapper}
              onMouseEnter={() => setActiveDropdown(menu.id)}
            >
              <button
                onClick={() => toggleDropdown(menu.id)}
                style={{
                  ...styles.dropdownButton,
                  backgroundColor: activeDropdown === menu.id ? `${menu.color}15` : 'transparent',
                  borderBottom: activeDropdown === menu.id ? `3px solid ${menu.color}` : '3px solid transparent'
                }}
              >
                <menu.icon style={{ 
                  ...styles.dropdownIcon, 
                  color: activeDropdown === menu.id ? menu.color : '#6c757d' 
                }} />
                <span style={styles.dropdownLabel}>{menu.label}</span>
                <FaChevronDown style={{
                  ...styles.chevron,
                  transform: activeDropdown === menu.id ? 'rotate(180deg)' : 'rotate(0deg)'
                }} />
              </button>

              {/* Dropdown menu */}
              {activeDropdown === menu.id && (
                <div style={styles.dropdownMenu}>
                  {menu.items.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavigation(item.path)}
                      style={styles.dropdownMenuItem}
                    >
                      {item.icon && <item.icon style={{ 
                        ...styles.dropdownItemIcon, 
                        color: item.color || menu.color 
                      }} />}
                      <span style={styles.dropdownItemLabel}>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Configuración */}
        <div style={styles.settingsSection}>
          <button
            onClick={() => handleNavigation('/parametres')}
            style={{
              ...styles.settingsButton,
              backgroundColor: isActive('/parametres') ? '#6c757d15' : 'transparent'
            }}
          >
            <FaCog style={{ 
              color: isActive('/parametres') ? '#6c757d' : '#adb5bd' 
            }} />
          </button>
          <button
            onClick={() => handleNavigation('/notifications')}
            style={styles.notificationButton}
          >
            <FaBell />
            <span style={styles.notificationBadge}>3</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    position: 'sticky',
    top: '0',
    zIndex: 1000,
    display: { xs: 'none', md: 'block' } // Solo visible en desktop
  },
  navContainer: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '60px'
  },
  mainItems: {
    display: 'flex',
    gap: '5px'
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0 16px',
    height: '60px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333'
  },
  navIcon: {
    fontSize: '16px',
    transition: 'color 0.2s ease'
  },
  navLabel: {
    whiteSpace: 'nowrap'
  },
  dropdowns: {
    display: 'flex',
    gap: '5px',
    flex: 1,
    justifyContent: 'center'
  },
  dropdownWrapper: {
    position: 'relative'
  },
  dropdownButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '0 16px',
    height: '60px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
    whiteSpace: 'nowrap'
  },
  dropdownIcon: {
    fontSize: '16px',
    transition: 'color 0.2s ease'
  },
  dropdownLabel: {
    
  },
  chevron: {
    fontSize: '12px',
    transition: 'transform 0.3s ease',
    marginLeft: '4px'
  },
  dropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: '0',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '0 0 10px 10px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    minWidth: '200px',
    zIndex: 1001,
    overflow: 'hidden'
  },
  dropdownMenuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 16px',
    width: '100%',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
    fontSize: '14px',
    color: '#333',
    textAlign: 'left'
  },
  dropdownItemIcon: {
    fontSize: '14px',
    flexShrink: 0
  },
  dropdownItemLabel: {
    flex: 1
  },
  settingsSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  settingsButton: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease'
  },
  notificationButton: {
    position: 'relative',
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    color: '#6c757d'
  },
  notificationBadge: {
    position: 'absolute',
    top: '-5px',
    right: '-5px',
    backgroundColor: '#f5576c',
    color: 'white',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold'
  }
};

export default DashboardNavbar;