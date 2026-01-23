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
  width = 280,
  height = '100vh'
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const { auth } = useSelector(state => state);
  const { t, i18n } = useTranslation('global');
  const [darkMode, setDarkMode] = useState(false);
  
  // 🔥 SIMPLIFICADO: Solo 3 idiomas - AR, FR, EN
  const [currentLang, setCurrentLang] = useState(() => {
    const savedLang = localStorage.getItem('appLanguage') || 'fr';
    const useGoogleTranslate = localStorage.getItem('useGoogleTranslate') === 'true';
    const targetLang = localStorage.getItem('targetTranslateLang');
    
    return useGoogleTranslate && targetLang ? targetLang : savedLang;
  });

  // Detectar si está en dashboard/profile
  const isDashboardPage = location.pathname.includes('/dashboard') || 
                         location.pathname.includes('/profile') ||
                         location.pathname.startsWith('/mes-');

  // ✅ CATEGORÍAS
  const categories = [
    { name: 'Boutiques', emoji: '🏪', slug: 'boutiques', color: '#667eea' },
    { name: 'Immobilier', emoji: '🏠', slug: 'immobilier', color: '#f093fb' },
    { name: 'Automobiles & Véhicules', emoji: '🚗', slug: 'vehicules', color: '#f5576c' },
    { name: 'Pièces détachées', emoji: '🔧', slug: 'pieces-detachees', color: '#48c6ef' },
    { name: 'Téléphones & Accessoires', emoji: '📱', slug: 'telephones', color: '#6a11cb' },
    { name: 'Informatique', emoji: '💻', slug: 'informatique', color: '#37ecba' },
    { name: 'Électroménager & Électronique', emoji: '📺', slug: 'electromenager', color: '#ff9a9e' },
    { name: 'Vêtements & Mode', emoji: '👕', slug: 'vetements', color: '#a18cd1' },
    { name: 'Santé & Beauté', emoji: '💄', slug: 'sante-beaute', color: '#fbc2eb' },
    { name: 'Meubles & Maison', emoji: '🛋️', slug: 'meubles', color: '#667eea' },
    { name: 'Loisirs & Divertissements', emoji: '🎮', slug: 'loisirs', color: '#f093fb' },
    { name: 'Sport', emoji: '⚽', slug: 'sport', color: '#f5576c' },
    { name: 'Emploi', emoji: '💼', slug: 'emploi', color: '#48c6ef' },
    { name: 'Matériaux & Équipement', emoji: '🔨', slug: 'materiaux', color: '#6a11cb' },
    { name: 'Alimentaires', emoji: '🍎', slug: 'alimentaires', color: '#37ecba' },
    { name: 'Services', emoji: '👷', slug: 'services', color: '#ff9a9e' },
    { name: 'Voyages', emoji: '✈️', slug: 'voyages', color: '#a18cd1' }
  ];

  // Emojis
  const emojis = {
    home: '🏠', user: '👤', logout: '🚪', bell: '🔔', list: '📋',
    plus: '➕', dashboard: '📊', store: '🏪', categories: '📂',
    all: '📊', login: '🔑', register: '📝', question: '❓',
    mail: '✉️', shield: '🛡️', arrow: '➡️', globe: '🌍',
    sun: '☀️', moon: '🌙', fire: '🔥', chart: '📈',
    message: '💬', shopping: '🛒', megaphone: '📢', gear: '⚙️',
    verified: '✅', warning: '⚠️', star: '⭐', heart: '❤️'
  };

  // Enlaces útiles
  const usefulLinks = [
    { name: 'Créer une boutique', path: '/create-boutique', emoji: '🏪➕' },
    { name: 'Comment annoncer ?', path: '/bloginfo', emoji: emojis.question },
    { name: 'Contactez-nous', path: '/users/contactt', emoji: emojis.mail },
    { name: 'Politique de confidentialité', path: '/bloginfo', emoji: emojis.shield }
  ];

  // 🆕 Secciones del dashboard para usuarios logueados
  const dashboardSections = auth.user ? [
    { 
      title: '📊 Tableau de bord', 
      items: [
        { name: 'Vue d\'ensemble', path: '/dashboard#overview', emoji: emojis.chart, color: '#667eea' },
        { name: 'Mes Statistiques', path: '/dashboard#stats', emoji: emojis.chart, color: '#10b981' }
      ]
    },
    { 
      title: '📝 Annonces', 
      items: [
        { name: 'Mes Annonces', path: '/dashboard#annonces', emoji: emojis.list, color: '#f59e0b', badge: { text: '12', color: '#f59e0b' } },
        { name: 'Nouvelle Annonce', path: '/creer-annonce', emoji: emojis.plus, color: '#10b981' },
        { name: 'Annonces sauvegardées', path: '/dashboard#saved', emoji: emojis.heart, color: '#ef4444' }
      ]
    },
    { 
      title: '🏪 Boutique', 
      items: [
        { name: 'Ma Boutique', path: '/dashboard#boutique', emoji: emojis.store, color: '#8b5cf6', badge: { text: 'Pro', color: '#8b5cf6' } },
        { name: 'Créer Boutique', path: '/create-boutique', emoji: '🏪➕', color: '#8b5cf6' },
        { name: 'Statistiques boutique', path: '/dashboard#boutique-stats', emoji: emojis.chart, color: '#06b6d4' }
      ]
    },
    { 
      title: '📢 Publicité', 
      items: [
        { name: 'Campagnes', path: '/dashboard#publicite', emoji: emojis.megaphone, color: '#ec4899', badge: { text: '3', color: '#ec4899' } },
        { name: 'Budget publicitaire', path: '/dashboard#ad-budget', emoji: '💰', color: '#10b981' }
      ]
    },
    { 
      title: '🛒 Commandes', 
      items: [
        { name: 'Mes Commandes', path: '/dashboard#commandes', emoji: emojis.shopping, color: '#f97316', badge: { text: '5', color: '#f97316' } },
        { name: 'Transactions', path: '/dashboard#transactions', emoji: '💳', color: '#059669' },
        { name: 'Historique', path: '/dashboard#history', emoji: '📅', color: '#6b7280' }
      ]
    },
    { 
      title: '💬 Conversations', 
      items: [
        { name: 'Messages', path: '/dashboard#conversations', emoji: emojis.message, color: '#3b82f6', badge: { text: '8', color: '#3b82f6' } },
        { name: 'Support', path: '/dashboard#support', emoji: '🆘', color: '#ef4444' },
        { name: 'Notifications', path: '/dashboard#notifications', emoji: emojis.bell, color: '#f59e0b', badge: { text: '7', color: '#f59e0b' } }
      ]
    },
    { 
      title: '👤 Profil', 
      items: [
        { name: 'Informations personnelles', path: '/dashboard#profil', emoji: emojis.user, color: '#6366f1' },
        { name: 'Vérification', path: '/dashboard#verification', emoji: emojis.verified, color: '#10b981', badge: { text: '75%', color: '#10b981' } },
        { name: 'Sécurité', path: '/dashboard#security', emoji: emojis.shield, color: '#6b7280' },
        { name: 'Paramètres', path: '/dashboard#parametres', emoji: emojis.gear, color: '#4b5563' }
      ]
    }
  ] : [];

  // 🔥 FUNCIÓN SIMPLE para cambiar idioma
  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode);
    localStorage.setItem('appLanguage', langCode);
    
    // Siempre activar Google Translate para los 3 idiomas
    localStorage.setItem('useGoogleTranslate', 'true');
    localStorage.setItem('targetTranslateLang', langCode);
    
    // Configurar cookie para Google Translate
    document.cookie = `googtrans=/auto/${langCode}; path=/`;
    
    // Disparar evento
    const event = new CustomEvent('languageChanged', {
      detail: { targetLang: langCode }
    });
    document.dispatchEvent(event);
    
    // Recargar
    setTimeout(() => {
      onHide();
      window.location.reload();
    }, 300);
  };

  // Sincronizar idioma
  useEffect(() => {
    const useGoogleTranslate = localStorage.getItem('useGoogleTranslate') === 'true';
    const targetLang = localStorage.getItem('targetTranslateLang');
    
    if (useGoogleTranslate && targetLang && targetLang !== currentLang) {
      setCurrentLang(targetLang);
    }
  }, [currentLang]);

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

  // Generar rutas
  const getCategoryPath = (categorySlug) => {
    return categorySlug === 'boutiques' ? '/boutiques/1' : `/${categorySlug}/1`;
  };

  // Componente LinkItem SIMPLIFICADO
  const LinkItem = ({ emoji, name, path, onClick, color = '#667eea', badge = null, isDashboardLink = false }) => {
    const isActive = location.pathname === path || (isDashboardLink && location.pathname === '/dashboard');
    
    const handleClick = (e) => {
      if (onClick) onClick(e);
      if (path && !onClick) onHide();
    };
    
    const content = (
      <div
        onClick={handleClick}
        style={{
          padding: '10px 16px',
          margin: '2px 0',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          backgroundColor: isActive ? `${color}15` : 'transparent',
          borderLeft: isActive ? `3px solid ${color}` : 'none',
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
            fontSize: '0.95rem',
            fontWeight: '500',
            color: isActive ? color : '#333'
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
            fontWeight: '600',
            minWidth: '24px',
            textAlign: 'center'
          }}>
            {badge.text}
          </span>
        )}
      </div>
    );

    if (path && !onClick) {
      return (
        <Link to={path} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }} onClick={onHide}>
          {content}
        </Link>
      );
    }

    return <div style={{ display: 'block' }}>{content}</div>;
  };

  // Contenidos - Versión mejorada con Dashboard completo
  const renderDashboardContent = () => (
    <>
      {/* Encabezado del usuario */}
      <div style={{
        padding: '20px 16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        marginBottom: '15px',
        borderRadius: '0 0 12px 12px',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
            <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>
              {auth.user?.username || 'Utilisateur'}
            </div>
            <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
              {auth.user?.email || ''}
            </div>
            <div style={{ 
              fontSize: '0.75rem', 
              marginTop: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              <span style={{
                backgroundColor: '#10b981',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '0.7rem'
              }}>
                {emojis.verified} Vérifié
              </span>
              <span style={{
                backgroundColor: '#f59e0b',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '0.7rem'
              }}>
                {emojis.star} Pro
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Botón Dashboard principal */}
      <div style={{ marginBottom: '15px', padding: '0 16px' }}>
        <Link to="/dashboard" style={{ textDecoration: 'none' }} onClick={onHide}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #8b5cf6 100%)',
            color: 'white',
            padding: '15px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px',
                fontSize: '1.2rem'
              }}>
                {emojis.dashboard}
              </div>
              <div>
                <div style={{ fontWeight: '600', fontSize: '1rem' }}>Tableau de bord</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Accédez à toutes vos données</div>
              </div>
            </div>
            <div style={{ fontSize: '1.2rem' }}>→</div>
          </div>
        </Link>
      </div>

      {/* Secciones del Dashboard */}
      {dashboardSections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <div style={{ 
            margin: '20px 0 5px 16px', 
            fontSize: '0.85rem', 
            fontWeight: '600', 
            color: '#666',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {section.title}
          </div>
          
          {section.items.map((item, itemIndex) => (
            <LinkItem 
              key={itemIndex}
              emoji={item.emoji} 
              name={item.name} 
              path={item.path} 
              color={item.color}
              badge={item.badge}
              isDashboardLink={item.path.includes('/dashboard')}
            />
          ))}
        </div>
      ))}

      {/* Dark Mode */}
      <div style={{ margin: '25px 0 5px 16px', fontSize: '0.85rem', fontWeight: '600', color: '#666' }}>
        {emojis.gear} Préférences
      </div>
      
      <LinkItem 
        emoji={darkMode ? emojis.sun : emojis.moon} 
        name={darkMode ? 'Mode Clair' : 'Mode Sombre'} 
        onClick={toggleDarkMode}
        color={darkMode ? '#f59e0b' : '#4b5563'}
      />

      {/* Todas las categorías */}
      <div style={{ margin: '25px 0 5px 16px', fontSize: '0.85rem', fontWeight: '600', color: '#666' }}>
        {emojis.categories} Toutes les catégories
      </div>
      
      {categories.map((category, index) => (
        <LinkItem key={index} emoji={category.emoji} name={category.name} path={getCategoryPath(category.slug)} color={category.color} />
      ))}

      {/* Logout */}
      <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
        <LinkItem emoji={emojis.logout} name="Se déconnecter" onClick={handleLogout} color="#ef4444" />
      </div>
    </>
  );

  const renderLoggedInContent = () => (
    <>
      {/* Encabezado simple */}
      <div style={{
        padding: '15px 16px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        marginBottom: '15px',
        borderRadius: '0 0 10px 10px'
      }}>
        <Link to="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }} onClick={onHide}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
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
              <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                Accédez à votre tableau de bord
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Botón principal al Dashboard */}
      <LinkItem 
        emoji={emojis.dashboard} 
        name="Tableau de bord" 
        path="/dashboard" 
        color="#667eea" 
        badge={{ text: 'Nouveau', color: '#10b981' }}
      />

      {/* Acciones rápidas */}
      <div style={{ margin: '20px 0 8px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
        {emojis.fire} Actions Rapides
      </div>
      
      <LinkItem emoji={emojis.plus} name="Nouvelle Annonce" path="/creer-annonce" color="#10b981" />
      <LinkItem emoji="🏪➕" name="Créer Boutique" path="/create-boutique" color="#8b5cf6" />
      <LinkItem emoji={emojis.message} name="Mes Messages" path="/dashboard#conversations" color="#3b82f6" />
      <LinkItem emoji={emojis.bell} name="Notifications" path="/dashboard#notifications" color="#f59e0b" />

      {/* Categorías populares */}
      <div style={{ margin: '25px 0 8px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
        {emojis.categories} Catégories populaires
      </div>
      
      {categories.slice(0, 6).map((category, index) => (
        <LinkItem key={index} emoji={category.emoji} name={category.name} path={getCategoryPath(category.slug)} color={category.color} />
      ))}
      
      <LinkItem emoji={emojis.all} name="Voir toutes les catégories" path="/vehicules/1" color="#6b7280" />

      {/* Preferencias */}
      <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
        <LinkItem 
          emoji={darkMode ? emojis.sun : emojis.moon} 
          name={darkMode ? 'Mode Clair' : 'Mode Sombre'} 
          onClick={toggleDarkMode} 
          color={darkMode ? '#f59e0b' : '#4b5563'} 
        />
      </div>

      {/* Logout */}
      <div style={{ marginTop: '15px' }}>
        <LinkItem emoji={emojis.logout} name="Se déconnecter" onClick={handleLogout} color="#ef4444" />
      </div>
    </>
  );

  const renderLoggedOutContent = () => (
    <>
      {/* Dark Mode para no logueados */}
      <LinkItem 
        emoji={darkMode ? emojis.sun : emojis.moon} 
        name={darkMode ? 'Mode Clair' : 'Mode Sombre'} 
        onClick={toggleDarkMode} 
        color={darkMode ? '#f59e0b' : '#4b5563'} 
      />

      {/* Cuenta */}
      <div style={{ margin: '20px 0 5px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
        {emojis.user} Compte
      </div>
      
      <LinkItem emoji={emojis.login} name="Se connecter" path="/login" color="#10b981" />
      <LinkItem emoji={emojis.register} name="S'inscrire" path="/register" color="#667eea" />

      {/* Boutiques */}
      <div style={{ margin: '25px 0 5px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
        {emojis.store} Boutiques
      </div>
      
      <LinkItem emoji="🏪➕" name="Créer une boutique" path="/create-boutique" color="#8b5cf6" />

      {/* Categorías */}
      <div style={{ margin: '25px 0 8px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
        {emojis.categories} Catégories
      </div>
      
      {categories.slice(0, 8).map((category, index) => (
        <LinkItem key={index} emoji={category.emoji} name={category.name} path={getCategoryPath(category.slug)} color={category.color} />
      ))}
      
      <LinkItem emoji={emojis.all} name="Explorer toutes les catégories" path="/vehicules/1" color="#6b7280" />

      {/* Enlaces útiles */}
      <div style={{ margin: '25px 0 8px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
        {emojis.link} Liens utiles
      </div>
    
      {usefulLinks.map((link, index) => (
        <LinkItem key={index} emoji={link.emoji} name={link.name} path={link.path} color="#6b7280" />
      ))}
    </>
  );

  const getContent = () => {
    if (auth.user && isDashboardPage) return renderDashboardContent();
    if (auth.user) return renderLoggedInContent();
    return renderLoggedOutContent();
  };

  return (
    <Offcanvas 
      show={show} 
      onHide={onHide} 
      placement="start"
      className="drawer"
      style={{
        width: width,
        height: height,
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Encabezado del Drawer */}
      <div style={{
        padding: '15px 16px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: '#f8fafc'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ 
            fontWeight: '700', 
            fontSize: '1.1rem', 
            color: '#1f2937',
            background: 'linear-gradient(90deg, #667eea, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Menu
          </div>
          {auth.user && (
            <span style={{
              backgroundColor: '#10b981',
              color: 'white',
              fontSize: '0.7rem',
              padding: '2px 8px',
              borderRadius: '10px',
              fontWeight: '600'
            }}>
              Connecté
            </span>
          )}
        </div>
        
        {/* Selector de idioma */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
              const useGoogleTranslate = localStorage.getItem('useGoogleTranslate') === 'true';
              const isTranslateActive = useGoogleTranslate && localStorage.getItem('targetTranslateLang') === lang.code;
              
              return (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: isActive || isTranslateActive ? '#667eea' : 'transparent',
                    border: isTranslateActive ? '2px solid #28a745' : 'none',
                    color: isActive || isTranslateActive ? 'white' : '#6b7280',
                    fontWeight: '600',
                    fontSize: lang.code === 'ar' ? '1rem' : '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease'
                  }}
                  title={lang.title}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>
         
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
              fontSize: '1.2rem',
              transition: 'all 0.2s ease'
            }}
            title="Fermer"
          >
            ✕
          </button>
        </div>
      </div>
      
      {/* Contenido del Drawer */}
      <Offcanvas.Body style={{ 
        overflowY: 'auto',
        padding: '10px 0',
        scrollbarWidth: 'thin'
      }}>
        {getContent()}
        
        {/* Footer */}
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
          © {new Date().getFullYear()} MarketPlace. Tous droits réservés.
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Drawer;