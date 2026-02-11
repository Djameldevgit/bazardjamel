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

  // ✅ CATEGORÍAS ACTUALIZADAS - Coinciden con el seed
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

  // ✅ SUBCATEGORÍAS DE BOUTIQUES (para mostrar cuando se selecciona "Boutiques")
  const boutiqueSubcategories = [
    { name: 'Mode & Vêtements', emoji: '👗', slug: 'boutiques-mode-vetements', color: '#ec4899' },
    { name: 'Électronique & Technologie', emoji: '📱', slug: 'boutiques-electronique-technologie', color: '#3b82f6' },
    { name: 'Maison & Décorations', emoji: '🏠', slug: 'boutiques-maison-decorations', color: '#f59e0b' },
    { name: 'Cosmétique & Beauté', emoji: '💄', slug: 'boutiques-cosmetique-beaute', color: '#ef4444' },
    { name: 'Sport & Loisirs', emoji: '⚽', slug: 'boutiques-sport-loisirs', color: '#10b981' },
    { name: 'Alimentation & Boissons', emoji: '🍎', slug: 'boutiques-alimentation-boissons', color: '#8b5cf6' },
    { name: 'Santé & Bien-être', emoji: '💊', slug: 'boutiques-sante-bien-etre', color: '#06b6d4' },
    { name: 'Jouets & Enfants', emoji: '🧸', slug: 'boutiques-jouets-enfants', color: '#f97316' },
    { name: 'Automobiles & Accessoires', emoji: '🚗', slug: 'boutiques-automobiles-accessoires', color: '#6366f1' },
    { name: 'Artisanat & Fait main', emoji: '🎨', slug: 'boutiques-artisanat-fait-main', color: '#ec4899' },
    { name: 'Services & Prestations', emoji: '🔧', slug: 'boutiques-services-prestations', color: '#6b7280' },
    { name: 'Autre', emoji: '📦', slug: 'boutiques-autre', color: '#9ca3af' }
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

  // Estado para manejar subcategorías de boutiques
  const [showBoutiqueCategories, setShowBoutiqueCategories] = useState(false);
  const [activeMainCategory, setActiveMainCategory] = useState(null);

  // 📍 FUNCIÓN CORREGIDA PARA GENERAR RUTAS
  const getCategoryPath = (categorySlug, isBoutiqueSubcategory = false) => {
    // Si es una subcategoría de boutiques
    if (isBoutiqueSubcategory) {
      return `/boutiques/category/${categorySlug}`;
    }
    
    // Si es la categoría principal "Boutiques"
    if (categorySlug === 'boutiques') {
      return '/boutiques';
    }
    
    // Para otras categorías principales
    return `/category/${categorySlug}`;
  };

  // Manejar clic en categoría principal
  const handleMainCategoryClick = (category) => {
    if (category.slug === 'boutiques') {
      // Si ya está mostrando subcategorías, navegar a la página principal
      if (showBoutiqueCategories && activeMainCategory === 'boutiques') {
        setShowBoutiqueCategories(false);
        setActiveMainCategory(null);
        onHide();
        history.push('/boutiques');
      } else {
        // Mostrar subcategorías de boutiques
        setShowBoutiqueCategories(true);
        setActiveMainCategory('boutiques');
      }
    } else {
      // Navegar directamente a la categoría
      setShowBoutiqueCategories(false);
      setActiveMainCategory(null);
      onHide();
      history.push(getCategoryPath(category.slug));
    }
  };

  // Manejar clic en subcategoría de boutiques
  const handleBoutiqueSubcategoryClick = (subcategory) => {
    setShowBoutiqueCategories(false);
    setActiveMainCategory(null);
    onHide();
    history.push(getCategoryPath(subcategory.slug, true));
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

  // Componente LinkItem ACTUALIZADO
  const LinkItem = ({ 
    emoji, 
    name, 
    path, 
    onClick, 
    color = '#667eea', 
    badge = null, 
    isDashboardLink = false,
    isBackButton = false,
    isSubcategory = false
  }) => {
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
          marginLeft: isSubcategory ? '20px' : '0'
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
            fontSize: isSubcategory ? '0.9rem' : '0.95rem',
            fontWeight: isSubcategory ? '400' : '500',
            color: isActive ? color : (isSubcategory ? '#555' : '#333')
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

  // Renderizar contenido de subcategorías de boutiques
  const renderBoutiqueCategoriesContent = () => (
    <>
      {/* Botón para volver atrás */}
      <LinkItem 
        name="Retour aux catégories" 
        onClick={() => {
          setShowBoutiqueCategories(false);
          setActiveMainCategory(null);
        }}
        isBackButton={true}
        color="#6b7280"
      />
      
      {/* Título */}
      <div style={{ 
        margin: '20px 0 5px 16px', 
        fontSize: '0.9rem', 
        fontWeight: '600', 
        color: '#555',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        🏪 Choisir une catégorie de boutique
      </div>
      
      {/* Subcategorías de boutiques */}
      {boutiqueSubcategories.map((subcategory, index) => (
        <LinkItem 
          key={index}
          emoji={subcategory.emoji} 
          name={subcategory.name} 
          onClick={() => handleBoutiqueSubcategoryClick(subcategory)}
          color={subcategory.color}
          isSubcategory={true}
        />
      ))}
      
      {/* Ver todas las boutiques */}
      <div style={{ marginTop: '20px', padding: '0 16px' }}>
        <Link to="/boutiques" style={{ textDecoration: 'none' }} onClick={onHide}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #8b5cf6 100%)',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            fontWeight: '600',
            fontSize: '0.9rem',
            textAlign: 'center',
            transition: 'all 0.3s ease'
          }}>
            <i className="fas fa-store"></i>
            Voir toutes les boutiques
          </div>
        </Link>
      </div>
    </>
  );

  // Renderizar contenido principal (categorías normales)
  const renderMainCategoriesContent = () => (
    <>
      {/* Categorías principales */}
      <div style={{ margin: '15px 0 8px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
        📂 Toutes les catégories
      </div>
      
      {categories.map((category, index) => (
        <LinkItem 
          key={index} 
          emoji={category.emoji} 
          name={category.name} 
          onClick={() => handleMainCategoryClick(category)} 
          color={category.color} 
        />
      ))}
      
      {/* Separador */}
      <div style={{ margin: '25px 0', borderTop: '1px solid #e5e7eb' }}></div>
    </>
  );

  // Renderizar contenido basado en estado de autenticación
  const renderUserContent = () => {
    if (!auth.user) {
      // Usuario no logueado
      return (
        <>
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
        </>
      );
    } else if (isDashboardPage) {
      // Usuario en dashboard
      return renderDashboardContent();
    } else {
      // Usuario logueado normal
      return null;
    }
  };

  // Contenido del drawer principal
  const renderMainContent = () => (
    <>
      {renderUserContent()}
      
      {/* Boutiques destacadas */}
      <div style={{ margin: '25px 0 5px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
        🏪 Boutiques
      </div>
      
      <LinkItem emoji="🏪➕" name="Créer une boutique" path="/create-boutique" color="#8b5cf6" />
      <LinkItem emoji="📊" name="Voir toutes les boutiques" path="/boutiques" color="#667eea" />
      
      {/* Categorías */}
      {showBoutiqueCategories ? renderBoutiqueCategoriesContent() : renderMainCategoriesContent()}
      
      {/* Enlaces útiles */}
      <div style={{ margin: '20px 0 8px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
        🔗 Liens utiles
      </div>
      
      <LinkItem emoji="❓" name="Comment annoncer ?" path="/bloginfo" color="#6b7280" />
      <LinkItem emoji="✉️" name="Contactez-nous" path="/users/contactt" color="#6b7280" />
      <LinkItem emoji="🛡️" name="Politique de confidentialité" path="/bloginfo" color="#6b7280" />
      
      {/* Logout si está logueado */}
      {auth.user && (
        <div style={{ marginTop: '25px', paddingTop: '15px', borderTop: '1px solid #e5e7eb' }}>
          <LinkItem emoji={emojis.logout} name="Se déconnecter" onClick={handleLogout} color="#ef4444" />
        </div>
      )}
    </>
  );

  return (
    <Offcanvas 
      show={show} 
      onHide={() => {
        setShowBoutiqueCategories(false);
        setActiveMainCategory(null);
        onHide();
      }}
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
          {showBoutiqueCategories ? (
            <button
              onClick={() => {
                setShowBoutiqueCategories(false);
                setActiveMainCategory(null);
              }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.2rem',
                cursor: 'pointer',
                padding: '5px',
                borderRadius: '5px',
                color: '#6b7280'
              }}
            >
              ←
            </button>
          ) : null}
          <div style={{ 
            fontWeight: '700', 
            fontSize: '1.1rem', 
            color: '#1f2937',
            background: 'linear-gradient(90deg, #667eea, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {showBoutiqueCategories ? 'Boutiques' : 'Menu'}
          </div>
          {auth.user && !showBoutiqueCategories && (
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
        
        {/* Selector de idioma y botón cerrar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!showBoutiqueCategories && (
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
          )}
         
          <button
            onClick={() => {
              setShowBoutiqueCategories(false);
              setActiveMainCategory(null);
              onHide();
            }}
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

// Funciones auxiliares (renderDashboardContent, renderLoggedInContent)
// ... mantén las mismas funciones que ya tienes ...

export default Drawer;