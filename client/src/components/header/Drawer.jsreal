import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { logout } from '../../redux/actions/authAction';
import { useTranslation } from 'react-i18next';
import { 
  FaHome, FaUser, FaCog, FaSignOutAlt, FaBell, FaShoppingCart,
  FaCar, FaTools, FaMobileAlt, FaLaptop, FaTv, FaTshirt, FaHeart,
  FaCouch, FaGamepad, FaFutbol, FaBriefcase, FaIndustry, FaUtensils,
  FaPlane, FaPaintBrush, FaStore, FaMoon, FaSun, FaSignInAlt, FaUserPlus,
  FaBullhorn, FaCreditCard, FaTicketAlt, FaShippingFast, FaFileAlt,
  FaQuestionCircle, FaEnvelope, FaShieldAlt, FaFileContract, FaTag,
  FaPlus, FaList, FaBox, FaExchangeAlt, FaPalette, FaAd,
  FaWrench, FaBuilding, FaTruck, FaHeadset, FaMedkit, FaFutbol as FaSoccerBall,
  FaGraduationCap, FaHardHat, FaCarrot, FaHandsHelping, FaGlobeAmericas,
  FaTimes
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Drawer = ({ 
  show, 
  onHide, 
  title = "Menú",
  width = 280,
  height = '100vh'
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const { auth } = useSelector(state => state);
  const { languageReducer } = useSelector(state => state);
  const { t, i18n } = useTranslation('global');
  const [darkMode, setDarkMode] = useState(false);
  const [currentLang, setCurrentLang] = useState(languageReducer.language || 'fr');

  // Detectar si está en dashboard/profile
  const isDashboardPage = location.pathname.includes('/users/dashboardpage') || 
                         location.pathname.includes('/profile') ||
                         location.pathname.startsWith('/mes-');

  // Categorías completas con iconos únicos
  const categories = [
    { name: 'Boutiques', icon: FaStore, slug: 'boutiques', color: '#667eea' },
    { name: 'Immobilier', icon: FaBuilding, slug: 'immobilier', color: '#f093fb' },
    { name: 'Automobiles & Véhicules', icon: FaCar, slug: 'vehicules', color: '#f5576c' },
    { name: 'Pièces détachées', icon: FaWrench, slug: 'piecesDetachees', color: '#48c6ef' },
    { name: 'Téléphones & Accessoires', icon: FaMobileAlt, slug: 'telephones', color: '#6a11cb' },
    { name: 'Informatique', icon: FaLaptop, slug: 'informatique', color: '#37ecba' },
    { name: 'Électroménager & Électronique', icon: FaTv, slug: 'electromenager', color: '#ff9a9e' },
    { name: 'Vêtements & Mode', icon: FaTshirt, slug: 'vetements', color: '#a18cd1' },
    { name: 'Santé & Beauté', icon: FaMedkit, slug: 'santebeaute', color: '#fbc2eb' },
    { name: 'Meubles & Maison', icon: FaCouch, slug: 'meubles', color: '#667eea' },
    { name: 'Loisirs & Divertissements', icon: FaGamepad, slug: 'loisirs', color: '#f093fb' },
    { name: 'Sport', icon: FaSoccerBall, slug: 'sport', color: '#f5576c' },
    { name: 'Emploi', icon: FaGraduationCap, slug: 'emploi', color: '#48c6ef' },
    { name: 'Matériaux & Équipement', icon: FaHardHat, slug: 'materiaux', color: '#6a11cb' },
    { name: 'Alimentaires', icon: FaCarrot, slug: 'alimentaires', color: '#37ecba' },
    { name: 'Services', icon: FaHandsHelping, slug: 'services', color: '#ff9a9e' },
    { name: 'Voyages', icon: FaGlobeAmericas, slug: 'voyages', color: '#a18cd1' },
    { name: 'Artisanat', icon: FaPalette, slug: 'artisanat', color: '#667eea' },
    { name: 'Publicité', icon: FaBullhorn, slug: 'publicite', color: '#f093fb' },
  ];

  // Enlaces útiles para usuarios no conectados
  const usefulLinks = [
    { name: 'Créez une boutique', path: '/creer-boutique', icon: FaStore },
    { name: 'Comment annoncer ?', path: '/comment-annoncer', icon: FaQuestionCircle },
    { name: 'Contactez-nous', path: '/contact', icon: FaEnvelope },
    { name: 'Politique de confidentialité', path: '/politique-confidentialite', icon: FaShieldAlt },
    { name: 'Conditions d\'utilisation', path: '/conditions-utilisation', icon: FaFileContract },
    { name: 'Conditions de vente et paiement', path: '/conditions-vente', icon: FaTag },
  ];

  // Manejar cambio de idioma
  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
    // Aquí podrías dispatch una acción para guardar en Redux si es necesario
    // dispatch(setLanguage(lang));
  };

  // Efecto para sincronizar idioma con Redux
  useEffect(() => {
    if (languageReducer.language && languageReducer.language !== currentLang) {
      setCurrentLang(languageReducer.language);
      i18n.changeLanguage(languageReducer.language);
    }
  }, [languageReducer.language, currentLang, i18n]);

  // Manejar logout
  const handleLogout = () => {
    dispatch(logout());
    onHide();
    history.push('/');
  };

  // Alternar dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  // Componente LinkItem mejorado
  const LinkItem = ({ icon: Icon, name, path, onClick, color = '#667eea', isSection = false, external = false }) => {
    const isActive = location.pathname === path;
    
    const content = (
      <div
        style={{
          padding: isSection ? '12px 16px' : '10px 16px',
          margin: '2px 0',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          backgroundColor: isActive ? `${color}15` : 'transparent',
          borderLeft: isActive ? `3px solid ${color}` : 'none'
        }}
        onClick={onClick}
        onMouseEnter={(e) => {
          if (!isSection && !isActive) e.currentTarget.style.backgroundColor = `${color}10`;
        }}
        onMouseLeave={(e) => {
          if (!isSection) e.currentTarget.style.backgroundColor = isActive ? `${color}15` : 'transparent';
        }}
      >
        {Icon && <Icon style={{ color: isActive ? color : (isSection ? '#555' : '#6c757d'), marginRight: '12px', fontSize: '1.1rem' }} />}
        <span style={{
          fontSize: isSection ? '0.9rem' : '0.95rem',
          fontWeight: isSection ? '600' : '500',
          color: isActive ? color : (isSection ? '#555' : '#333')
        }}>
          {name}
        </span>
      </div>
    );

    if (external) {
      return (
        <a 
          href={path} 
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={onHide}
        >
          {content}
        </a>
      );
    }

    if (path && !onClick) {
      return (
        <Link 
          to={path} 
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }} 
          onClick={onHide}
        >
          {content}
        </Link>
      );
    }

    return (
      <div style={{ display: 'block' }} onClick={onClick}>
        {content}
      </div>
    );
  };

  // CONTENIDO 1: Dashboard del usuario
  const renderDashboardContent = () => (
    <>
      {/* Header del usuario */}
      <div style={{
        padding: '20px 16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        marginBottom: '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px'
          }}>
            <FaUser size={24} />
          </div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
              {auth.user?.username || 'Usuario'}
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
              {auth.user?.email || ''}
            </div>
          </div>
        </div>
      </div>

      {/* Dark Mode */}
      <LinkItem 
        icon={darkMode ? FaSun : FaMoon} 
        name="Dark Mode" 
        onClick={toggleDarkMode}
        color={darkMode ? '#ffc107' : '#6c757d'}
      />

      {/* Sección: Mon compte */}
      <div style={{ margin: '15px 0 5px 16px', fontSize: '0.85rem', fontWeight: '600', color: '#666' }}>
        Mon compte
      </div>
      
      <LinkItem icon={FaHome} name="Tableau de bord" path="/users/dashboardpage" />
      <LinkItem icon={FaUser} name="Paramètres du profil" path="/profile" />

      {/* Sección: Annonces */}
      <div style={{ margin: '20px 0 5px 16px', fontSize: '0.85rem', fontWeight: '600', color: '#666' }}>
        Annonces
      </div>
      
      <LinkItem icon={FaList} name="Mes Annonces" path="/mes-annonces" />
      <LinkItem icon={FaPlus} name="Ajouter Annonce" path="/creer-annonce" color="#28a745" />

      {/* Sección: Commandes */}
      <div style={{ margin: '20px 0 5px 16px', fontSize: '0.85rem', fontWeight: '600', color: '#666' }}>
        Commandes
      </div>
      
      <LinkItem icon={FaShoppingCart} name="Mes Commandes" path="/mes-commandes" />
      <LinkItem icon={FaTicketAlt} name="Mes Tickets de livraison" path="/tickets-livraison" />

      {/* Sección: Voyage */}
      <div style={{ margin: '20px 0 5px 16px', fontSize: '0.85rem', fontWeight: '600', color: '#666' }}>
        Voyage
      </div>
      
      <LinkItem icon={FaPlane} name="Mes Demandes de Devis" path="/demandes-devis" />

      {/* Sección: Publicité */}
      <div style={{ margin: '20px 0 5px 16px', fontSize: '0.85rem', fontWeight: '600', color: '#666' }}>
        Publicité
      </div>
      
      <LinkItem icon={FaStore} name="Achat Store" path="/achat-store" />
      <LinkItem icon={FaBullhorn} name="Achat Publicité" path="/achat-publicite" />

      {/* Sección: Transactions */}
      <div style={{ margin: '20px 0 5px 16px', fontSize: '0.85rem', fontWeight: '600', color: '#666' }}>
        Transactions
      </div>
      
      <LinkItem icon={FaCreditCard} name="Transactions" path="/transactions" />

      {/* Logout */}
      <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
        <LinkItem 
          icon={FaSignOutAlt} 
          name="Se déconnecter" 
          onClick={handleLogout}
          color="#dc3545"
        />
      </div>
    </>
  );

  // CONTENIDO 2: Usuario conectado (pero no en dashboard)
  const renderLoggedInContent = () => (
    <>
      {/* Header del usuario */}
      <div style={{
        padding: '15px 16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        marginBottom: '15px',
        borderRadius: '0 0 10px 10px'
      }}>
        <Link to="/users/dashboardpage" style={{ textDecoration: 'none', color: 'inherit' }} onClick={onHide}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px'
            }}>
              <FaUser size={20} />
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '1rem' }}>
                Bonjour, {auth.user?.username}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                Accédez à votre espace
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Acceso rápido al dashboard */}
      <LinkItem 
        icon={FaHome} 
        name="Mon Tableau de bord" 
        path="/users/dashboardpage"
        color="#667eea"
      />

      {/* Categorías */}
      <div style={{ margin: '20px 0 8px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
        Catégories
      </div>
      
      {categories.map((category, index) => (
        <LinkItem 
          key={index}
          icon={category.icon} 
          name={category.name} 
          path={`/category/${category.slug}`}
          color={category.color}
        />
      ))}

      {/* Dark Mode */}
      <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #eee' }}>
        <LinkItem 
          icon={darkMode ? FaSun : FaMoon} 
          name="Mode sombre" 
          onClick={toggleDarkMode}
          color={darkMode ? '#ffc107' : '#6c757d'}
        />
      </div>
    </>
  );

  // CONTENIDO 3: Usuario no conectado
  const renderLoggedOutContent = () => (
    <>
      {/* Dark Mode */}
      <LinkItem 
        icon={darkMode ? FaSun : FaMoon} 
        name="Mode sombre" 
        onClick={toggleDarkMode}
        color={darkMode ? '#ffc107' : '#6c757d'}
      />

      {/* Compte */}
      <div style={{ margin: '15px 0 5px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
        Compte
      </div>
      
      <LinkItem icon={FaSignInAlt} name="Se connecter" path="/login" color="#28a745" />
      <LinkItem icon={FaUserPlus} name="S'inscrire" path="/register" color="#667eea" />

      {/* Catégories */}
      <div style={{ margin: '20px 0 8px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
        Catégories
      </div>
      
      {categories.map((category, index) => (
        <LinkItem 
          key={index}
          icon={category.icon} 
          name={category.name} 
          path={`/category/${category.slug}`}
          color={category.color}
        />
      ))}

      {/* Liens utiles */}
      <div style={{ margin: '20px 0 8px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
        Liens utiles
      </div>
    
      {usefulLinks.map((link, index) => (
        <LinkItem 
          key={index}
          icon={link.icon} 
          name={link.name} 
          path={link.path}
          color="#6c757d"
        />
      ))}
    </>
  );

  // Determinar qué contenido mostrar
  const getContent = () => {
    if (auth.user && isDashboardPage) {
      return renderDashboardContent();
    } else if (auth.user) {
      return renderLoggedInContent();
    } else {
      return renderLoggedOutContent();
    }
  };

  // Determinar título dinámico
  const getTitle = () => {
    if (auth.user && isDashboardPage) {
      return 'Mon Espace';
    } else if (auth.user) {
      return 'Menu';
    } else {
      return 'Menu';
    }
  };

  return (
    <Offcanvas 
      show={show} 
      onHide={onHide} 
      placement="start"
      style={{
        width: width,
        height: height
      }}
    >
      {/* HEADER PERSONALIZADO CON BOTONES DE IDIOMA */}
      <div style={{
        padding: '15px 16px',
        borderBottom: '1px solid #eee',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Título */}
        <div style={{ fontWeight: '600', fontSize: '1.1rem', color: '#333' }}>
          {getTitle()}
        </div>
        
        {/* Contenedor de botones: Idiomas + Cerrar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Botones de idioma */}
          <div style={{ display: 'flex', gap: '6px', marginRight: '10px' }}>
            {/* Árabe (AR) */}
            <button
              onClick={() => handleLanguageChange('ar')}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: currentLang === 'ar' ? '#667eea' : '#f0f0f0',
                border: 'none',
                color: currentLang === 'ar' ? 'white' : '#666',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (currentLang !== 'ar') {
                  e.currentTarget.style.background = '#e0e0e0';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentLang !== 'ar') {
                  e.currentTarget.style.background = '#f0f0f0';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
              title="العربية"
            >
              AR
            </button>
            
            {/* Francés (FR) */}
            <button
              onClick={() => handleLanguageChange('fr')}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: currentLang === 'fr' ? '#667eea' : '#f0f0f0',
                border: 'none',
                color: currentLang === 'fr' ? 'white' : '#666',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (currentLang !== 'fr') {
                  e.currentTarget.style.background = '#e0e0e0';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentLang !== 'fr') {
                  e.currentTarget.style.background = '#f0f0f0';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
              title="Français"
            >
              FR
            </button>
            
            {/* Inglés (EN) */}
            <button
              onClick={() => handleLanguageChange('en')}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: currentLang === 'en' ? '#667eea' : '#f0f0f0',
                border: 'none',
                color: currentLang === 'en' ? 'white' : '#666',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (currentLang !== 'en') {
                  e.currentTarget.style.background = '#e0e0e0';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (currentLang !== 'en') {
                  e.currentTarget.style.background = '#f0f0f0';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
              title="English"
            >
              EN
            </button>
          </div>
         
          {/* Botón de cerrar */}
          <button
            onClick={onHide}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'transparent',
              border: '1px solid #e0e0e0',
              color: '#666',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f8f9fa';
              e.currentTarget.style.borderColor = '#667eea';
              e.currentTarget.style.color = '#667eea';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = '#e0e0e0';
              e.currentTarget.style.color = '#666';
            }}
            title="Fermer"
          >
            <FaTimes size={16} />
          </button>
        </div>
      </div>
      
      <Offcanvas.Body style={{ 
        overflowY: 'auto',
        padding: '10px 0'
      }}>
        {getContent()}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Drawer;