import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { logout } from '../../redux/actions/authAction';
import { useTranslation } from 'react-i18next';
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
  const history = useHistory(); // Mantenemos useHistory
  const { auth } = useSelector(state => state);
  const { languageReducer } = useSelector(state => state);
  const { t, i18n } = useTranslation('global');
  const [darkMode, setDarkMode] = useState(false);
  const [currentLang, setCurrentLang] = useState(languageReducer.language || 'fr');

  // Detectar si está en dashboard/profile
  const isDashboardPage = location.pathname.includes('/users/dashboardpage') || 
                         location.pathname.includes('/profile') ||
                         location.pathname.startsWith('/mes-');

  // Categorías completas con emojis
  const categories = [
    { name: 'Boutiques', emoji: '🏪', slug: 'boutiques', color: '#667eea' },
    { name: 'Immobilier', emoji: '🏠', slug: 'immobilier', color: '#f093fb' },
    { name: 'Automobiles & Véhicules', emoji: '🚗', slug: 'vehicules', color: '#f5576c' },
    { name: 'Pièces détachées', emoji: '🔧', slug: 'piecesDetachees', color: '#48c6ef' },
    { name: 'Téléphones & Accessoires', emoji: '📱', slug: 'telephones', color: '#6a11cb' },
    { name: 'Informatique', emoji: '💻', slug: 'informatique', color: '#37ecba' },
    { name: 'Électroménager & Électronique', emoji: '📺', slug: 'electromenager', color: '#ff9a9e' },
    { name: 'Vêtements & Mode', emoji: '👕', slug: 'vetements', color: '#a18cd1' },
    { name: 'Santé & Beauté', emoji: '💄', slug: 'santebeaute', color: '#fbc2eb' },
    { name: 'Meubles & Maison', emoji: '🛋️', slug: 'meubles', color: '#667eea' },
    { name: 'Loisirs & Divertissements', emoji: '🎮', slug: 'loisirs', color: '#f093fb' },
    { name: 'Sport', emoji: '⚽', slug: 'sport', color: '#f5576c' },
    { name: 'Emploi', emoji: '💼', slug: 'emploi', color: '#48c6ef' },
    { name: 'Matériaux & Équipement', emoji: '🔨', slug: 'materiaux', color: '#6a11cb' },
    { name: 'Alimentaires', emoji: '🍎', slug: 'alimentaires', color: '#37ecba' },
    { name: 'Services', emoji: '👷', slug: 'services', color: '#ff9a9e' },
    { name: 'Voyages', emoji: '✈️', slug: 'voyages', color: '#a18cd1' },
    { name: 'Artisanat', emoji: '🎨', slug: 'artisanat', color: '#667eea' },
    { name: 'Publicité', emoji: '📢', slug: 'publicite', color: '#f093fb' },
  ];

  // Emojis para otras secciones
  const emojis = {
    home: '🏠',
    user: '👤',
    settings: '⚙️',
    logout: '🚪',
    bell: '🔔',
    cart: '🛒',
    list: '📋',
    plus: '➕',
    dashboard: '📊',
    orders: '📦',
    tickets: '🎫',
    plane: '✈️',
    megaphone: '📢',
    card: '💳',
    dollar: '💵',
    sun: '☀️',
    moon: '🌙',
    login: '🔑',
    register: '📝',
    question: '❓',
    mail: '✉️',
    shield: '🛡️',
    document: '📄',
    tag: '🏷️',
    check: '✅',
    arrow: '➡️',
    store: '🏪',
    globe: '🌍',
    briefcase: '💼',
    chart: '📈',
    heart: '❤️',
    star: '⭐',
    fire: '🔥',
    clock: '⏰',
    lock: '🔒',
    unlock: '🔓',
    menu: '☰'
  };

  // Enlaces útiles - MODIFICADO: "Créer une boutique" ahora redirige al formulario
  const usefulLinks = [
    { 
      name: 'Créer une boutique', 
      path: '/creer-boutique', 
      emoji: '🏪➕',
      isStoreForm: true
    },
    { 
      name: 'Acheter une boutique', 
      path: '/acheter-boutique', 
      emoji: '🏪🛒',
      isStoreForm: true
    },
    { name: 'Comment annoncer ?', path: '/comment-annoncer', emoji: emojis.question },
    { name: 'Contactez-nous', path: '/contact', emoji: emojis.mail },
    { name: 'Politique de confidentialité', path: '/politique-confidentialite', emoji: emojis.shield },
    { name: 'Conditions d\'utilisation', path: '/conditions-utilisation', emoji: emojis.document },
    { name: 'Conditions de vente et paiement', path: '/conditions-vente', emoji: emojis.tag },
  ];

  // Manejar cambio de idioma
  const handleLanguageChange = (lang) => {
    setCurrentLang(lang);
    i18n.changeLanguage(lang);
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
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle('dark-mode', newDarkMode);
  };

  // Función para manejar clic en "Créer/Acheter une boutique"
  const handleStoreFormClick = (e, path) => {
    e.preventDefault();
    onHide();
    
    // Redirigir al formulario de creación de boutique
    history.push('/creer-boutique', {
      fromDrawer: true,
      actionType: path.includes('acheter') ? 'buy' : 'create'
    });
  };

  // Componente LinkItem mejorado
  const LinkItem = ({ 
    emoji, 
    name, 
    path, 
    onClick, 
    color = '#667eea', 
    isSection = false, 
    external = false,
    isStoreForm = false,
    badge = null
  }) => {
    const isActive = location.pathname === path;
    
    const handleClick = (e) => {
      if (isStoreForm && path) {
        handleStoreFormClick(e, path);
        return;
      }
      
      if (onClick) {
        onClick(e);
      }
      
      if (!external && path && !onClick) {
        onHide();
      }
    };
    
    const content = (
      <div
        style={{
          padding: isSection ? '12px 16px' : '10px 16px',
          margin: '2px 0',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          backgroundColor: isActive ? `${color}15` : 'transparent',
          borderLeft: isActive ? `3px solid ${color}` : 'none',
          position: 'relative'
        }}
        onClick={handleClick}
        onMouseEnter={(e) => {
          if (!isSection && !isActive) e.currentTarget.style.backgroundColor = `${color}10`;
        }}
        onMouseLeave={(e) => {
          if (!isSection) e.currentTarget.style.backgroundColor = isActive ? `${color}15` : 'transparent';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          {emoji && (
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: isActive ? color : `${color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              fontSize: '1.2rem'
            }}>
              {emoji}
            </div>
          )}
          <span style={{
            fontSize: isSection ? '0.9rem' : '0.95rem',
            fontWeight: isSection ? '600' : '500',
            color: isActive ? color : (isSection ? '#555' : '#333')
          }}>
            {name}
          </span>
        </div>
        
        {badge && (
          <span style={{
            backgroundColor: badge.color || '#667eea',
            color: 'white',
            fontSize: '0.7rem',
            padding: '2px 8px',
            borderRadius: '12px',
            fontWeight: '600'
          }}>
            {badge.text}
          </span>
        )}
        
        {isStoreForm && (
          <span style={{ 
            color: '#999', 
            fontSize: '1rem',
            marginLeft: '8px'
          }}>
            {emojis.arrow}
          </span>
        )}
      </div>
    );

    if (external) {
      return (
        <a 
          href={path} 
          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }} 
          target="_blank" 
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }

    if (path && !onClick && !isStoreForm) {
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
      <div style={{ display: 'block' }}>
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
        marginBottom: '15px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', opacity: 0.1, fontSize: '100px' }}>
          {emojis.check}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', position: 'relative', zIndex: 1 }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '12px',
            border: '2px solid rgba(255,255,255,0.3)',
            fontSize: '1.5rem'
          }}>
            {emojis.user}
          </div>
          <div>
            <div style={{ fontWeight: '600', fontSize: '1.1rem', display: 'flex', alignItems: 'center' }}>
              {auth.user?.username || 'Usuario'}
              {auth.user?.verified && (
                <span style={{ marginLeft: '8px', color: '#4ade80' }}>{emojis.check}</span>
              )}
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
              {auth.user?.email || ''}
            </div>
          </div>
        </div>
      </div>

      {/* Dark Mode */}
      <LinkItem 
        emoji={darkMode ? emojis.sun : emojis.moon} 
        name="Dark Mode" 
        onClick={toggleDarkMode}
        color={darkMode ? '#f59e0b' : '#4b5563'}
      />

      {/* Sección: Mon compte */}
      <div style={{ margin: '20px 0 5px 16px', fontSize: '0.85rem', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>
        {emojis.user} Mon compte
      </div>
      
      <LinkItem emoji={emojis.dashboard} name="Tableau de bord" path="/users/dashboardpage" />
      <LinkItem emoji={emojis.user} name="Paramètres du profil" path="/profile" />
      <LinkItem emoji={emojis.bell} name="Notifications" path="/notifications" badge={{ text: '3', color: '#ef4444' }} />

      {/* Sección: Annonces */}
      <div style={{ margin: '25px 0 5px 16px', fontSize: '0.85rem', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>
        {emojis.list} Annonces
      </div>
      
      <LinkItem emoji={emojis.list} name="Mes Annonces" path="/mes-annonces" />
      <LinkItem 
        emoji={emojis.plus} 
        name="Ajouter Annonce" 
        path="/creer-annonce" 
        color="#10b981"
        badge={{ text: 'Nouveau', color: '#10b981' }}
      />

      {/* Sección: Boutiques */}
      <div style={{ margin: '25px 0 5px 16px', fontSize: '0.85rem', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>
        {emojis.store} Boutiques
      </div>
      
      <LinkItem 
        emoji="🏪➕" 
        name="Créer une boutique" 
        path="/creer-boutique"
        isStoreForm={true}
        color="#8b5cf6"
      />
      <LinkItem 
        emoji="🏪🛒" 
        name="Acheter une boutique" 
        path="/acheter-boutique"
        isStoreForm={true}
        color="#8b5cf6"
      />

      {/* Sección: Commandes */}
      <div style={{ margin: '25px 0 5px 16px', fontSize: '0.85rem', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>
        {emojis.cart} Commandes
      </div>
      
      <LinkItem emoji={emojis.cart} name="Mes Commandes" path="/mes-commandes" />
      <LinkItem emoji={emojis.tickets} name="Mes Tickets de livraison" path="/tickets-livraison" />

      {/* Sección: Voyage */}
      <div style={{ margin: '25px 0 5px 16px', fontSize: '0.85rem', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>
        {emojis.plane} Voyage
      </div>
      
      <LinkItem emoji={emojis.plane} name="Mes Demandes de Devis" path="/demandes-devis" />

      {/* Sección: Publicité */}
      <div style={{ margin: '25px 0 5px 16px', fontSize: '0.85rem', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>
        {emojis.megaphone} Publicité
      </div>
      
      <LinkItem emoji={emojis.megaphone} name="Achat Publicité" path="/achat-publicite" />
      <LinkItem emoji={emojis.chart} name="Statistiques" path="/statistiques" />

      {/* Sección: Transactions */}
      <div style={{ margin: '25px 0 5px 16px', fontSize: '0.85rem', fontWeight: '600', color: '#666', textTransform: 'uppercase' }}>
        {emojis.card} Transactions
      </div>
      
      <LinkItem emoji={emojis.card} name="Transactions" path="/transactions" />
      <LinkItem emoji={emojis.dollar} name="Portefeuille" path="/portefeuille" />

      {/* Logout */}
      <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
        <LinkItem 
          emoji={emojis.logout} 
          name="Se déconnecter" 
          onClick={handleLogout}
          color="#ef4444"
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
        borderRadius: '0 0 10px 10px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-30px', opacity: 0.1, fontSize: '80px' }}>
          {emojis.user}
        </div>
        
        <Link to="/users/dashboardpage" style={{ textDecoration: 'none', color: 'inherit' }} onClick={onHide}>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              border: '2px solid rgba(255,255,255,0.3)',
              fontSize: '1.2rem'
            }}>
              {emojis.user}
            </div>
            <div>
              <div style={{ fontWeight: '600', fontSize: '1rem' }}>
                Bonjour, {auth.user?.username}
              </div>
              <div style={{ fontSize: '0.8rem', opacity: 0.9, display: 'flex', alignItems: 'center' }}>
                Accédez à votre espace
                <span style={{ marginLeft: '5px' }}>{emojis.arrow}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Acceso rápido al dashboard */}
      <LinkItem 
        emoji={emojis.dashboard} 
        name="Mon Tableau de bord" 
        path="/users/dashboardpage"
        color="#667eea"
      />

      {/* Quick Actions */}
      <div style={{ margin: '20px 0 8px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555', textTransform: 'uppercase' }}>
        {emojis.fire} Actions Rapides
      </div>
      
      <LinkItem 
        emoji={emojis.plus} 
        name="Nouvelle Annonce" 
        path="/creer-annonce"
        color="#10b981"
      />
      <LinkItem 
        emoji="🏪➕" 
        name="Créer Boutique" 
        path="/creer-boutique"
        isStoreForm={true}
        color="#8b5cf6"
      />

      {/* Categorías */}
      <div style={{ margin: '25px 0 8px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555', textTransform: 'uppercase' }}>
        {emojis.list} Catégories
      </div>
      
      {categories.map((category, index) => (
        <LinkItem 
          key={index}
          emoji={category.emoji} 
          name={category.name} 
          path={`/category/${category.slug}`}
          color={category.color}
        />
      ))}

      {/* Dark Mode */}
      <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
        <LinkItem 
          emoji={darkMode ? emojis.sun : emojis.moon} 
          name="Mode sombre" 
          onClick={toggleDarkMode}
          color={darkMode ? '#f59e0b' : '#4b5563'}
        />
      </div>
    </>
  );

  // CONTENIDO 3: Usuario no conectado
  const renderLoggedOutContent = () => (
    <>
      {/* Dark Mode */}
      <LinkItem 
        emoji={darkMode ? emojis.sun : emojis.moon} 
        name="Mode sombre" 
        onClick={toggleDarkMode}
        color={darkMode ? '#f59e0b' : '#4b5563'}
      />

      {/* Compte */}
      <div style={{ margin: '20px 0 5px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555', textTransform: 'uppercase' }}>
        {emojis.user} Compte
      </div>
      
      <LinkItem 
        emoji={emojis.login} 
        name="Se connecter" 
        path="/login" 
        color="#10b981"
        badge={{ text: 'Entrer', color: '#10b981' }}
      />
      <LinkItem 
        emoji={emojis.register} 
        name="S'inscrire" 
        path="/register" 
        color="#667eea"
        badge={{ text: 'Nouveau', color: '#667eea' }}
      />

      {/* Boutiques - Solo para usuarios no logueados */}
      <div style={{ margin: '25px 0 5px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555', textTransform: 'uppercase' }}>
        {emojis.store} Boutiques
      </div>
      
      <LinkItem 
        emoji="🏪➕" 
        name="Créer une boutique" 
        path="/creer-boutique"
        isStoreForm={true}
        color="#8b5cf6"
        badge={{ text: 'Pro', color: '#8b5cf6' }}
      />
      <LinkItem 
        emoji="🏪🛒" 
        name="Acheter une boutique" 
        path="/acheter-boutique"
        isStoreForm={true}
        color="#8b5cf6"
      />

      {/* Catégories */}
      <div style={{ margin: '25px 0 8px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555', textTransform: 'uppercase' }}>
        {emojis.list} Catégories
      </div>
      
      {categories.slice(0, 8).map((category, index) => (
        <LinkItem 
          key={index}
          emoji={category.emoji} 
          name={category.name} 
          path={`/category/${category.slug}`}
          color={category.color}
        />
      ))}
      
      <LinkItem 
        emoji={emojis.arrow} 
        name="Voir toutes les catégories" 
        path="/categories"
        color="#6b7280"
      />

      {/* Liens utiles */}
      <div style={{ margin: '25px 0 8px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555', textTransform: 'uppercase' }}>
        {emojis.link} Liens utiles
      </div>
    
      {usefulLinks.slice(2).map((link, index) => (
        <LinkItem 
          key={index}
          emoji={link.emoji} 
          name={link.name} 
          path={link.path}
          color="#6b7280"
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
  

  return (
    <Offcanvas 
      show={show} 
      onHide={onHide} 
      placement="start"
      style={{
        width: width,
        height: height,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* HEADER PERSONALIZADO */}
      <div style={{
        padding: '15px 16px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'linear-gradient(90deg, #f8fafc 0%, #ffffff 100%)'
      }}>
        {/* Título */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px' 
        }}>
        
         
          <div style={{ 
            fontWeight: '700', 
            fontSize: '1.1rem', 
            color: '#1f2937',
            background: 'linear-gradient(90deg, #667eea, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            
          </div>
        </div>
        
        {/* Contenedor de botones: Idiomas + Cerrar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Botones de idioma */}
          <div style={{ 
            display: 'flex', 
            gap: '6px', 
            marginRight: '10px',
            background: '#f3f4f6',
            padding: '4px',
            borderRadius: '10px'
          }}>
            {[
              { code: 'ar', label: 'ع', title: 'العربية' },
              { code: 'fr', label: 'FR', title: 'Français' },
              { code: 'en', label: 'EN', title: 'English' }
            ].map((lang) => {
              const isActive = currentLang === lang.code;
              
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: isActive ? '#667eea' : 'transparent',
                    border: 'none',
                    color: isActive ? 'white' : '#6b7280',
                    fontWeight: '600',
                    fontSize: lang.code === 'ar' ? '1rem' : '0.8rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#e5e7eb';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                  title={lang.title}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>
         
          {/* Botón de cerrar */}
          <button
            onClick={onHide}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: '#f3f4f6',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
              fontSize: '1.2rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#e5e7eb';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f3f4f6';
              e.currentTarget.style.color = '#6b7280';
            }}
            title="Fermer"
          >
            ✕
          </button>
        </div>
      </div>
      
      <Offcanvas.Body style={{ 
        overflowY: 'auto',
        padding: '10px 0',
        scrollbarWidth: 'thin',
        scrollbarColor: '#cbd5e1 transparent'
      }}>
        {getContent()}
        
        {/* Footer del drawer */}
        <div style={{
          marginTop: '30px',
          padding: '15px 16px',
          borderTop: '1px solid #e5e7eb',
          fontSize: '0.75rem',
          color: '#9ca3af',
          textAlign: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', marginBottom: '5px' }}>
            <span>{emojis.shield}</span>
            <span>Plateforme sécurisée</span>
          </div>
          © {new Date().getFullYear()} MarketPlace. Tous droits réservés Djamel/B.
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Drawer;