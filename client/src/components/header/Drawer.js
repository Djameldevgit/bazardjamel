// 📂 components/common/Drawer.js - VERSIÓN COMPLETA CON IMÁGENES PNG
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
  const [imageErrors, setImageErrors] = useState({});
  
  // 🔥 SIMPLIFICADO: Solo 3 idiomas - AR, FR, EN
  const [currentLang, setCurrentLang] = useState(() => {
    const savedLang = localStorage.getItem('appLanguage') || 'fr';
    const useGoogleTranslate = localStorage.getItem('useGoogleTranslate') === 'true';
    const targetLang = localStorage.getItem('targetTranslateLang');
    
    return useGoogleTranslate && targetLang ? targetLang : savedLang;
  });

  // Detectar si está en dashboard/profile
  const isDashboardPage = location.pathname.includes('/users/dashboard') || 
                         location.pathname.includes('/profile') ||
                         location.pathname.startsWith('/mes-');

  // ✅ CATEGORÍAS ACTUALIZADAS - Con rutas de imágenes PNG (coinciden con el seed)
 // ✅ CATEGORÍAS ACTUALIZADAS - Con rutas de imágenes PNG corregidas
const categories = [
  { name: 'Boutiques', icon: '/uploads/categories/boutiques/level1/boutiques.png', slug: 'boutiques', color: '#667eea', isStore: true },
  { name: 'Immobilier', icon: '/uploads/categories/immobilier/level1/immobilier.png', slug: 'immobilier', color: '#f093fb' },
  { name: 'Automobiles & Véhicules', icon: '/uploads/categories/vehicules/level1/vehicules.png', slug: 'vehicules', color: '#f5576c' },
  { name: 'Pièces détachées', icon: '/uploads/categories/pieces-detachees/level1/pieces-detachees.png', slug: 'pieces-detachees', color: '#48c6ef' },
  { name: 'Téléphonie & Accessoires', icon: '/uploads/categories/telephone/level1/telephone.png', slug: 'telephones', color: '#6a11cb' },
  { name: 'Informatique', icon: '/uploads/categories/informatique/level1/informatique.png', slug: 'informatique', color: '#37ecba' },
  { name: 'Électroménager & Électronique', icon: '/uploads/categories/electromenager/level1/electromenager.png', slug: 'electromenager', color: '#ff9a9e' },
  { name: 'Vêtements & Mode', icon: '/uploads/categories/vetements/level1/vetements.png', slug: 'vetements', color: '#a18cd1' },
  { name: 'Santé & Beauté', icon: '/uploads/categories/sante-beaute/level1/sante-beaute.png', slug: 'sante-beaute', color: '#fbc2eb' },
  { name: 'Meubles & Maison', icon: '/uploads/categories/meubles/level1/meubles.png', slug: 'meubles', color: '#667eea' },
  { name: 'Loisirs & Divertissements', icon: '/uploads/categories/loisirs/level1/loisirs.png', slug: 'loisirs', color: '#f093fb' },
  { name: 'Sport', icon: '/uploads/categories/sport/level1/sport.png', slug: 'sport', color: '#f5576c' },
  { name: "Offres & Demandes d'emploi", icon: '/uploads/categories/emploi/level1/emploi.png', slug: 'emploi', color: '#48c6ef' },
  { name: 'Matériaux & Équipement', icon: '/uploads/categories/materiaux/level1/materiaux.png', slug: 'materiaux', color: '#6a11cb' },
  { name: 'Alimentaires', icon: '/uploads/categories/alimentaires/level1/alimentaires.png', slug: 'alimentaires', color: '#37ecba' },
  { name: 'Services', icon: '/uploads/categories/services/level1/services.png', slug: 'services', color: '#ff9a9e' },
  { name: 'Voyages', icon: '/uploads/categories/voyages/level1/voyages.png', slug: 'voyages', color: '#a18cd1' }
];

  // Emojis (mantenemos para iconos que no son categorías)
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

  // Manejar error de imagen
  const handleImageError = (categoryId) => {
    setImageErrors(prev => ({ ...prev, [categoryId]: true }));
  };

  // 📍 FUNCIÓN PARA GENERAR RUTAS
  const getCategoryPath = (categorySlug) => {
    // Si es la categoría "Boutiques"
    if (categorySlug === 'boutiques') {
      return '/boutiques';
    }
    
    // Para otras categorías principales
    return `/${categorySlug}`;
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

  // Componente LinkItem actualizado para soportar imágenes PNG
  const LinkItem = ({ 
    emoji, 
    icon, // Nueva prop para imagen PNG
    name, 
    path, 
    onClick, 
    color = '#667eea', 
    badge = null, 
    isDashboardLink = false,
    isBackButton = false
  }) => {
    const isActive = location.pathname === path || (isDashboardLink && location.pathname.startsWith('/dashboard'));
    const hasImageError = icon && imageErrors[name];
    
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
          transition: 'all 0.2s ease'
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
          ) : icon && !hasImageError ? (
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: isActive ? color : `${color}20`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '12px',
              overflow: 'hidden'
            }}>
              <img 
                src={icon}
                alt={name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={() => handleImageError(name)}
              />
            </div>
          ) : (
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
              {emoji || (icon && hasImageError ? name.charAt(0).toUpperCase() : '📁')}
            </div>
          )}
          <span style={{
            fontSize: '0.95rem',
            fontWeight: isActive ? '600' : '500',
            color: isActive ? color : '#333',
            lineHeight: '1.4',
            wordBreak: 'break-word'
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
        path="/users/dashboard" 
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
      <LinkItem emoji={emojis.dashboard} name="Tableau de bord" path="/users/dashboard" color="#8b5cf6" />
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
          
          {/* Categorías principales (para invitados) - AHORA CON IMÁGENES PNG */}
          <div style={{ margin: '20px 0 5px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
            {emojis.categories} Catégories
          </div>
          
          {categories.map((category, index) => (
            <LinkItem 
              key={index} 
              icon={category.icon}
              emoji={category.emoji} // Fallback
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
        
        {/* Categorías principales (para usuarios autenticados) - AHORA CON IMÁGENES PNG */}
        <div style={{ margin: '20px 0 5px 16px', fontSize: '0.9rem', fontWeight: '600', color: '#555' }}>
          {emojis.categories} Catégories
        </div>
        
        {categories.map((category, index) => (
          <LinkItem 
            key={index} 
            icon={category.icon}
            emoji={category.emoji} // Fallback
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