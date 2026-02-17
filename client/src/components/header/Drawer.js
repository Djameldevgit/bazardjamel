// 📂 components/common/Drawer.js - VERSIÓN COMPLETA CORREGIDA
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

  // ✅ CATEGORÍAS ACTUALIZADAS - Coinciden con el seed (SIN subcategorías de boutique)
  const categories = [
    { name: 'Boutiques', emoji: '🏪', slug: 'boutiques', color: '#667eea', isStore: true },
    { name: 'Immobilier', emoji: '🏠', slug: 'immobilier', color: '#f093fb' },
    { name: 'Automobiles & Véhicules', emoji: '🚗', slug: 'vehicules', color: '#f5576c' },
    { name: 'Pièces détachées', emoji: '🔧', slug: 'pieces-detachees', color: '#48c6ef' },
    { name: 'Téléphonie & Accessoires', emoji: '📱', slug: 'telephones', color: '#6a11cb' },
    { name: 'Informatique', emoji: '💻', slug: 'informatique', color: '#37ecba' },
    { name: 'Électroménager & Électronique', emoji: '📺', slug: 'electromenager', color: '#ff9a9e' },
    { name: 'Vêtements & Mode', emoji: '👕', slug: 'vetements', color: '#a18cd1' },
    { name: 'Santé & Beauté', emoji: '💄', slug: 'sante-beaute', color: '#fbc2eb' },
    { name: 'Meubles & Maison', emoji: '🛋️', slug: 'meubles', color: '#667eea' },
    { name: 'Loisirs & Divertissements', emoji: '🎮', slug: 'loisirs', color: '#f093fb' },
    { name: 'Sport', emoji: '⚽', slug: 'sport', color: '#f5576c' },
    { name: 'Offres & Demandes d\'emploi', emoji: '💼', slug: 'emploi', color: '#48c6ef' },
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
    verified: '✅', warning: '⚠️', star: '⭐', heart: '❤️',
    annonce: '📢', commande: '📦', voyage: '✈️', pub: '🎯',
    transaction: '💰', credit: '💳'
  };

  // 📍 FUNCIÓN PARA GENERAR RUTAS
  const getCategoryPath = (categorySlug) => {
    // Si es la categoría "Boutiques"
    if (categorySlug === 'boutiques') {
      return '/boutiques';
    }
    
    // Para otras categorías principales
    return `/category/${categorySlug}`;
  };

  // Manejar clic en categoría
  const handleCategoryClick = (category) => {
    onHide();
    history.push(getCategoryPath(category.slug));
  };

  // 🔥 FUNCIÓN SIMPLE para cambiar idioma
  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode);
    localStorage.setItem('appLanguage', langCode);
    
    localStorage.setItem('useGoogleTranslate', 'true');
    localStorage.setItem('targetTranslateLang', langCode);
    
    document.cookie = `googtrans=/auto/${langCode}; path=/`;
    
    const event = new CustomEvent('languageChanged', {
      detail: { targetLang: langCode }
    });
    document.dispatchEvent(event);
    
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

  // Componente LinkItem
  const LinkItem = ({ 
    emoji, 
    name, 
    path, 
    onClick, 
    color = '#667eea', 
    badge = null, 
    isDashboardLink = false,
    isBackButton = false
  }) => {
    const isActive = location.pathname === path || (isDashboardLink && location.pathname.startsWith('/dashboard'));
    
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
          borderLeft: isActive ? `3px solid ${color}` : 'none'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          {isBackButton ? (
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#f3f4f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              fontSize: '1.2rem',
              color: '#6b7280'
            }}>
              ←
            </div>
          ) : emoji && (
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
            fontWeight: isActive ? '600' : '500',
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

  // 🎯 CONTENIDO PARA USUARIO SIN AUTENTICAR
  const renderGuestContent = () => (
    <>
      {/* Modo oscuro/claro */}
      <LinkItem 
        emoji={darkMode ? emojis.sun : emojis.moon} 
        name={darkMode ? 'Mode Clair' : 'Mode Sombre'} 
        onClick={toggleDarkMode} 
        color={darkMode ? '#f59e0b' : '#4b5563'} 
      />

      {/* Sección Cuenta */}
      <div style={{ margin: '20px 0 5px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
        {emojis.user} Compte
      </div>
      
      <LinkItem emoji={emojis.login} name="Se connecter" path="/login" color="#10b981" />
      <LinkItem emoji={emojis.register} name="S'inscrire" path="/register" color="#667eea" />
    </>
  );

  // 🎯 CONTENIDO PARA USUARIO AUTENTICADO (VISTA NORMAL)
  const renderLoggedInContent = () => (
    <>
      {/* Modo oscuro/claro */}
      <LinkItem 
        emoji={darkMode ? emojis.sun : emojis.moon} 
        name={darkMode ? 'Mode Clair' : 'Mode Sombre'} 
        onClick={toggleDarkMode} 
        color={darkMode ? '#f59e0b' : '#4b5563'} 
      />

      {/* Enlace rápido al dashboard */}
      <LinkItem 
        emoji={emojis.dashboard} 
        name="Mon Tableau de bord" 
        path="/dashboard" 
        color="#8b5cf6" 
        isDashboardLink={true}
      />
    </>
  );

  // 🎯 CONTENIDO PARA DASHBOARD (VISTA PRIVADA)
  const renderDashboardContent = () => (
    <>
      {/* En-tête du dashboard */}
      <div style={{
        padding: '16px',
        margin: '0 16px 10px 16px',
        background: 'linear-gradient(135deg, #667eea 0%, #8b5cf6 100%)',
        borderRadius: '12px',
        color: 'white'
      }}>
        <div style={{ fontSize: '1.2rem', marginBottom: '5px' }}>{emojis.dashboard}</div>
        <div style={{ fontWeight: '700', fontSize: '1rem' }}>Mon Espace</div>
        <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{auth.user?.name || auth.user?.username}</div>
      </div>

      {/* Mon compte */}
      <div style={{ margin: '15px 0 5px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
        {emojis.user} Mon compte
      </div>
      <LinkItem emoji={emojis.dashboard} name="Tableau de bord" path="/dashboard" color="#8b5cf6" />
      <LinkItem emoji="⚙️" name="Paramètres du profil" path="/profile/settings" color="#6b7280" />
      <LinkItem emoji={emojis.logout} name="Se déconnecter" onClick={handleLogout} color="#ef4444" />

      {/* Annonces */}
      <div style={{ margin: '20px 0 5px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
        {emojis.annonce} Annonces
      </div>
      <LinkItem emoji="📋" name="Mes Annonces" path="/mes-annonces" color="#3b82f6" />
      <LinkItem emoji={emojis.plus} name="Ajouter Annonce" path="/creer-annonce" color="#10b981" />

      {/* Commandes */}
      <div style={{ margin: '20px 0 5px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
        {emojis.commande} Commandes
      </div>
      <LinkItem emoji="📦" name="Mes Commandes" path="/mes-commandes" color="#f59e0b" />
      <LinkItem emoji="🧾" name="Mes Tickets de livraison" path="/mes-tickets" color="#ec4899" />

      {/* Voyage */}
      <div style={{ margin: '20px 0 5px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
        {emojis.voyage} Voyage
      </div>
      <LinkItem emoji="📋" name="Mes Demandes de Devis" path="/mes-devis" color="#06b6d4" />

      {/* Publicité */}
      <div style={{ margin: '20px 0 5px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
        {emojis.pub} Publicité
      </div>
      <LinkItem emoji="🏪" name="Achat Store" path="/create-boutique" color="#8b5cf6" />
      <LinkItem emoji="📢" name="Achat Publicité" path="/acheter-publicite" color="#f97316" />

      {/* Transactions */}
      <div style={{ margin: '20px 0 5px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
        {emojis.transaction} Transactions
      </div>
      <LinkItem emoji={emojis.credit} name="Mes Crédits" path="/mes-credits" color="#10b981" />
      <LinkItem emoji="📊" name="Historique" path="/historique-transactions" color="#6b7280" />
    </>
  );

  // Renderizar contenido principal del drawer
  const renderMainContent = () => {
    // Si está en dashboard o páginas de perfil
    if (isDashboardPage && auth.user) {
      return renderDashboardContent();
    }
    
    // Si no está autenticado
    if (!auth.user) {
      return (
        <>
          {renderGuestContent()}
          
          {/* Categorías principales (para invitados) */}
          <div style={{ margin: '20px 0 5px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
            📂 Catégories
          </div>
          
          {categories.map((category, index) => (
            <LinkItem 
              key={index} 
              emoji={category.emoji} 
              name={category.name} 
              onClick={() => handleCategoryClick(category)} 
              color={category.color} 
            />
          ))}
        </>
      );
    }
    
    // Usuario autenticado en vista normal
    return (
      <>
        {renderLoggedInContent()}
        
        {/* Categorías principales (para usuarios autenticados) */}
        <div style={{ margin: '20px 0 5px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
          📂 Catégories
        </div>
        
        {categories.map((category, index) => (
          <LinkItem 
            key={index} 
            emoji={category.emoji} 
            name={category.name} 
            onClick={() => handleCategoryClick(category)} 
            color={category.color} 
          />
        ))}
      </>
    );
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
              {auth.user.name || auth.user.username}
            </span>
          )}
        </div>
        
        {/* Selector de idioma y botón cerrar */}
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
        {renderMainContent()}
        
        {/* Enlaces útiles (siempre visibles) */}
        <div style={{ margin: '30px 0 15px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
          🔗 Liens utiles
        </div>
        
        <LinkItem emoji="❓" name="Comment annoncer ?" path="/bloginfo" color="#6b7280" />
        <LinkItem emoji="✉️" name="Contactez-nous" path="/users/contactt" color="#6b7280" />
        <LinkItem emoji="🛡️" name="Politique de confidentialité" path="/bloginfo" color="#6b7280" />
        
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