import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/actions/authAction';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Avatar from '../Avatar';
import Card from 'react-bootstrap/Card';
import {
  FaPlusCircle,
  FaStore,
  FaTools,
  FaShieldAlt,
  FaUsers,
  FaUserCog,
  FaSignOutAlt,
  FaInfoCircle,
  FaSignInAlt,
  FaUserPlus,
  FaShareAlt,
  FaGlobe,
  FaLanguage,
  FaRobot,
  FaBars,
  FaPlus,
  FaSearch,
  FaBell,
  FaUserCircle,
  FaDownload
} from 'react-icons/fa';

import { Navbar, Container, NavDropdown, Badge } from 'react-bootstrap';
import VerifyModal from '../authAndVerify/VerifyModal';
import DesactivateModal from '../authAndVerify/DesactivateModal';
import MultiCheckboxModal from './MultiCheckboxModal.';
import ShareAppModal from '../shareAppModal';
import Drawer from './Drawer';

const Navbar2 = () => {
  const { auth, cart, notify, settings } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { languageReducer } = useSelector(state => state);
  const { t, i18n } = useTranslation('navbar2');
  const lang = languageReducer.language || 'es';

  // 🔥 NUEVO: Estado para el dropdown de idiomas
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [useGoogleTranslate, setUseGoogleTranslate] = useState(false);

  // Estados PWA
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [showInstallButton, setShowInstallButton] = useState(false);

  // Estados del componente
  const [showShareModal, setShowShareModal] = useState(false);
  const [userRole, setUserRole] = useState(auth.user?.role);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showDeactivatedModal, setShowDeactivatedModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  const [showFeaturesModal, setShowFeaturesModal] = useState(false);

  const notifyDropdownRef = useRef(null);
  const [showDrawer, setShowDrawer] = useState(false);

  // Configuración de idiomas
  const languages = [
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'auto', name: 'Traducción automática', flag: '🤖' }
  ];

  // Funciones para manejar el drawer
  const handleDrawerOpen = () => setShowDrawer(true);
  const handleDrawerClose = () => setShowDrawer(false);

  // 🔥 DETECCIÓN MEJORADA DE TAMAÑO DE PANTALLA
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 700);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 🔥 INICIALIZAR ESTADO DE IDIOMA
  useEffect(() => {
    // Verificar si hay traducción activa
    const translateActive = localStorage.getItem('useGoogleTranslate') === 'true';
    const savedLang = localStorage.getItem('appLanguage') || 'es';
    
    setSelectedLanguage(savedLang);
    setUseGoogleTranslate(translateActive);

    // Detectar idioma del navegador
    const browserLang = navigator.language.split('-')[0];
    if (!savedLang && languages.some(l => l.code === browserLang)) {
      setSelectedLanguage(browserLang);
    }

    // 🔥 OCULTAR LA BARRA DE GOOGLE TRANSLATE SI EXISTE
    setTimeout(hideGoogleTranslateBanner, 1000);
  }, []);

  // 🔥 EFECTO PARA OCULTAR LA BARRA PERO MANTENER LA TRADUCCIÓN
  useEffect(() => {
    // Observar el DOM para detectar cuando Google inserta su barra
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          // Esperar un momento para que Google cargue completamente
          setTimeout(hideGoogleTranslateBanner, 300);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  // 🔥 FUNCIÓN PARA OCULTAR SOLO LA BARRA VISIBLE (NO LA TRADUCCIÓN)
  const hideGoogleTranslateBanner = () => {
    // Solo ocultar elementos VISIBLES de la barra, no la funcionalidad
    const visibleBanners = [
      '.goog-te-banner-frame',
      '.VIpgJd-ZVi9od-ORHb-OEVmcd', // Barra superior
      '.VIpgJd-ZVi9od-l4eHX-hSRGPd' // Contenedor de la barra
    ];

    visibleBanners.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        // Solo ocultar visualmente, no remover del DOM
        el.style.display = 'none';
        el.style.visibility = 'hidden';
        el.style.opacity = '0';
        el.style.height = '0';
        el.style.overflow = 'hidden';
      });
    });

    // También verificar iframes visibles
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
      if (iframe.src && iframe.src.includes('translate.google') && 
          iframe.offsetHeight > 50) { // Solo iframes grandes (la barra)
        iframe.style.display = 'none';
        iframe.style.visibility = 'hidden';
      }
    });

    // Restaurar posición del body si Google la movió
    if (document.body.style.top && document.body.style.top !== '0px') {
      document.body.style.top = '0px';
    }
  };

  // Detección PWA
  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsPWAInstalled(true);
    }

    const handleInstallAvailable = () => setShowInstallButton(true);
    const handleInstalled = () => {
      setIsPWAInstalled(true);
      setShowInstallButton(false);
    };

    window.addEventListener('pwaInstallAvailable', handleInstallAvailable);
    window.addEventListener('pwaInstalled', handleInstalled);

    return () => {
      window.removeEventListener('pwaInstallAvailable', handleInstallAvailable);
      window.removeEventListener('pwaInstalled', handleInstalled);
    };
  }, []);

  // Forzar mostrar en desarrollo
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const timer = setTimeout(() => {
        if (!showInstallButton && !isPWAInstalled) {
          setShowInstallButton(true);
        }
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showInstallButton, isPWAInstalled]);

  // Efectos de idioma y usuario
  useEffect(() => {
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

  useEffect(() => {
    if (auth.user?.role && auth.user.role !== userRole) {
      setUserRole(auth.user.role);
    }
  }, [auth.user?.role, userRole]);

  // 🔥 HANDLER PARA CAMBIO DE IDIOMA (MANTIENE TRADUCCIÓN)
  const handleLanguageChange = (langCode) => {
    setSelectedLanguage(langCode);
    localStorage.setItem('appLanguage', langCode);
    
    if (langCode === 'auto' || ['en', 'fr', 'ar'].includes(langCode)) {
      // Activar Google Translate (la traducción funcionará)
      setUseGoogleTranslate(true);
      localStorage.setItem('useGoogleTranslate', 'true');
      localStorage.setItem('targetTranslateLang', langCode === 'auto' ? 'auto' : langCode);
      
      // 🔥 FORZAR LA TRADUCCIÓN PERO OCULTAR LA BARRA
      activateTranslationWithHiddenBanner(langCode);
      
    } else if (langCode === 'es') {
      // Desactivar Google Translate
      disableGoogleTranslation();
    }
  };

  // 🔥 ACTIVAR TRADUCCIÓN PERO OCULTANDO LA BARRA
  const activateTranslationWithHiddenBanner = (langCode) => {
    // Configurar cookie para Google Translate (ESTO ACTIVA LA TRADUCCIÓN)
    const domain = window.location.hostname;
    const cookieValue = langCode === 'auto' ? '/auto/auto' : `/es/${langCode}`;
    
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${domain}`;
    document.cookie = `googtrans=${cookieValue}; path=/`;
    
    // Crear elemento DIV oculto para que Google Translate funcione
    // Esto es necesario para que Google Translate tenga donde inyectar su código
    if (!document.getElementById('google_translate_container')) {
      const div = document.createElement('div');
      div.id = 'google_translate_container';
      div.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 1px;
        height: 1px;
        overflow: hidden;
        opacity: 0;
        pointer-events: none;
      `;
      document.body.appendChild(div);
    }
    
    // Cargar Google Translate API si no está cargada
    if (!window.google || !window.google.translate) {
      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      
      window.googleTranslateElementInit = () => {
        if (window.google && window.google.translate) {
          // Inicializar Google Translate en el contenedor oculto
          new window.google.translate.TranslateElement({
            pageLanguage: 'es',
            includedLanguages: 'en,fr,ar',
            layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false // 🔥 IMPORTANTE: No mostrar automáticamente
          }, 'google_translate_container');
          
          // Esperar y ocultar cualquier barra que aparezca
          setTimeout(hideGoogleTranslateBanner, 500);
        }
      };
      
      document.head.appendChild(script);
    } else {
      // Si ya está cargado, solo ocultar la barra
      setTimeout(hideGoogleTranslateBanner, 500);
    }
    
    // Recargar la página para aplicar traducción completa
    setTimeout(() => {
      window.location.reload();
    }, 800);
  };

  // 🔥 DESACTIVAR TRADUCCIÓN
  const disableGoogleTranslation = () => {
    setUseGoogleTranslate(false);
    localStorage.removeItem('useGoogleTranslate');
    localStorage.removeItem('targetTranslateLang');
    
    // Limpiar cookies de Google Translate
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.' + window.location.hostname;
    
    // No remover el contenedor, solo limpiar cookies
    // Esto permite que la página se recargue en español
    
    // Recargar para ver contenido original
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  // Handlers
  const handleLogout = () => {
    dispatch(logout());
  };

  // Verificación PWA mejorada
  useEffect(() => {
    const checkPWAInstallation = () => {
      const isInstalled =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone ||
        localStorage.getItem('pwaInstalled') === 'true';

      setIsPWAInstalled(isInstalled);
      return isInstalled;
    };

    const installed = checkPWAInstallation();

    if (!installed) {
      const handleInstallAvailable = () => setShowInstallButton(true);
      const handleInstalled = () => {
        setIsPWAInstalled(true);
        setShowInstallButton(false);
      };

      window.addEventListener('pwaInstallAvailable', handleInstallAvailable);
      window.addEventListener('pwaInstalled', handleInstalled);

      const installCheckInterval = setInterval(() => {
        if (checkPWAInstallation()) {
          clearInterval(installCheckInterval);
        } else if (window.deferredPrompt && !showInstallButton) {
          setShowInstallButton(true);
        }
      }, 2000);

      return () => {
        window.removeEventListener('pwaInstallAvailable', handleInstallAvailable);
        window.removeEventListener('pwaInstalled', handleInstalled);
        clearInterval(installCheckInterval);
      };
    }
  }, [showInstallButton]);

  // Manejador de instalación PWA
  const handleInstallPWA = async () => {
    try {
      if (window.installPWA) {
        const installed = await window.installPWA();
        if (installed) {
          setShowInstallButton(false);
          setIsPWAInstalled(true);
        }
      } else {
        window.open('/?install-pwa=true', '_blank');
      }
    } catch (error) {
      console.error('Error instalando PWA:', error);
    }
  };

  // Verificación de settings
  if (!settings || Object.keys(settings).length === 0) {
    return (
      <nav className="navbar navbar-light bg-light" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1030 }}>
        <span className="navbar-brand">{t('loading')}</span>
      </nav>
    );
  }

  const totalItems = (cart?.items && Array.isArray(cart.items))
    ? cart.items.reduce((acc, item) => acc + (item?.quantity || 0), 0)
    : 0;

  const unreadNotifications = notify.data.filter(n => !n.isRead).length;

  // 🔥 COMPONENTE DE ITEM DE IDIOMA
  const LanguageItem = ({ lang, onSelect, isSelected, isTranslateActive }) => (
    <div
      onClick={() => onSelect(lang.code)}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: isMobile ? '8px 12px' : '10px 16px',
        margin: isMobile ? '2px 4px' : '4px 8px',
        borderRadius: '8px',
        background: isSelected 
          ? (settings.style ? 'rgba(102, 126, 234, 0.2)' : 'rgba(102, 126, 234, 0.1)')
          : 'transparent',
        color: settings.style ? '#fff' : '#333',
        transition: 'all 0.2s ease',
        width: 'calc(100% - 16px)',
        boxSizing: 'border-box',
        fontSize: isMobile ? '0.9rem' : '1rem',
        cursor: 'pointer'
      }}
      className="custom-menu-item"
    >
      <span style={{ fontSize: isMobile ? '1.1rem' : '1.2rem', marginRight: '12px', flexShrink: 0 }}>
        {lang.flag}
      </span>
      <span style={{ flex: 1, textAlign: 'left' }}>{lang.name}</span>
      
      {lang.code === 'auto' && (
        <FaRobot size={14} style={{ marginLeft: '8px', color: '#28a745', flexShrink: 0 }} />
      )}
      
      {isSelected && (
        <span style={{ 
          marginLeft: '8px', 
          color: '#667eea', 
          fontWeight: 'bold',
          flexShrink: 0
        }}>
          {isTranslateActive && lang.code !== 'es' ? '🌐' : '✓'}
        </span>
      )}
    </div>
  );

  // MenuItem component
  const MenuItem = ({ icon: Icon, iconColor, to, onClick, children, danger = false }) => (
    <NavDropdown.Item
      as={to ? Link : 'button'}
      to={to}
      onClick={onClick}
      className={`custom-menu-item ${danger ? 'text-danger' : ''}`}
      style={{
        padding: '12px 16px',
        transition: 'all 0.2s ease',
        borderRadius: '8px',
        margin: '4px 8px',
        display: 'flex',
        alignItems: 'center',
        fontWeight: '500',
        width: 'calc(100% - 16px)',
        boxSizing: 'border-box',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }}
    >
      <Icon className="me-2" style={{ color: iconColor, fontSize: '1rem', flexShrink: 0 }} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{children}</span>
    </NavDropdown.Item>
  );

  return (
    <>
      {/* 🔥 NAVBAR FIJO ARRIBA DE TODO */}
      <Navbar
        fixed="top"
        expand="lg"
        style={{
          zIndex: 1030,
          background: settings.style
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
          padding: isMobile ? '6px 0' : '8px 0',
          boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
          minHeight: isMobile ? '56px' : '64px'
        }}
        className={settings.style ? "navbar-dark" : "navbar-light"}
      >
        <Container
          fluid
          className="align-items-center justify-content-between"
          style={{
            padding: isMobile ? '0 12px' : '0 20px',
            maxWidth: '100%'
          }}
        >
          {/* Logo y Brand */}
          <div className="d-flex align-items-center" style={{ minWidth: 0, flex: '0 1 auto' }}>
            <Link
              to="/"
              onDoubleClick={(e) => {
                e.preventDefault();
                window.location.reload();
              }}
              className="btn p-0"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: isMobile ? '32px' : '40px',
                height: isMobile ? '32px' : '40px',
                marginRight: isMobile ? '6px' : '10px',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                overflow: 'hidden',
                flexShrink: 0
              }}
              title="Click para ir al inicio - Doble click para recargar"
            >
              <img
                src="/images/logo.png"
                alt="Logo"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  borderRadius: '6px'
                }}
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </Link>

            {!isMobile && (
              <Link
                to="/"
                onDoubleClick={(e) => {
                  e.preventDefault();
                  window.location.reload();
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Click para ir al inicio - Doble click para recargar"
              >
                <Navbar.Brand
                  className="py-0 mb-0"
                  style={{
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%'
                  }}
                >
                  <Card.Title
                    className="mb-0"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      letterSpacing: '0.3px',
                      margin: 0,
                      padding: 0,
                      lineHeight: '1.2',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {t('appName')}
                  </Card.Title>
                </Navbar.Brand>
              </Link>
            )}
          </div>

          {/* Iconos de acción */}
          <div
            className="d-flex align-items-center"
            style={{
              gap: isMobile ? '6px' : '10px',
              flexShrink: 0,
              marginLeft: 'auto'
            }}
          >
            {/* Búsqueda */}
            <Link
              to="/search"
              className="icon-button"
              style={{
                width: isMobile ? '38px' : '42px',
                height: isMobile ? '38px' : '42px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.3s ease',
                backgroundColor: settings.style ? 'rgba(255,255,255,0.1)' : 'rgba(102, 126, 234, 0.1)',
                textDecoration: 'none'
              }}
            >
              <FaSearch
                size={isMobile ? 16 : 18}
                style={{ color: '#667eea' }}
                title={t('search')}
              />
            </Link>

            {/* Botón Instalar PWA */}
            {showInstallButton && !isPWAInstalled && (
              <button
                className="icon-button"
                onClick={handleInstallPWA}
                style={{
                  width: isMobile ? '38px' : '42px',
                  height: isMobile ? '38px' : '42px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: settings.style ? 'rgba(255,255,255,0.1)' : 'rgba(40, 167, 69, 0.1)',
                  border: '2px solid #28a745',
                  transition: 'all 0.3s ease',
                  animation: 'pulse 2s infinite',
                  cursor: 'pointer'
                }}
                title={t('installPWA')}
              >
                <FaDownload
                  size={isMobile ? 16 : 18}
                  style={{ color: '#28a745' }}
                />
              </button>
            )}

            {/* Botón Agregar Post */}
            {(userRole === "Super-utilisateur" || userRole === "admin") && (
              <Link
                to="/creer-annonce"
                className="icon-button"
                style={{
                  width: isMobile ? '38px' : '42px',
                  height: isMobile ? '38px' : '42px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
                  textDecoration: 'none'
                }}
                title={t('addPost')}
              >
                <FaPlus
                  size={isMobile ? 14 : 16}
                  style={{ color: 'white' }}
                />
              </Link>
            )}

            {/* Notificaciones */}
            {auth.user && (
              <div
                className="position-relative icon-button"
                ref={notifyDropdownRef}
                style={{
                  width: isMobile ? '38px' : '42px',
                  height: isMobile ? '38px' : '42px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: settings.style ? 'rgba(255,255,255,0.1)' : 'rgba(102, 126, 234, 0.1)',
                  transition: 'all 0.3s ease'
                }}
              >
                <Link to={'/notify'} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FaBell
                    size={isMobile ? 18 : 20}
                    style={{ color: unreadNotifications > 0 ? '#f5576c' : '#667eea' }}
                  />
                </Link>

                {unreadNotifications > 0 && (
                  <Badge
                    pill
                    style={{
                      fontSize: isMobile ? '0.6rem' : '0.65rem',
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      padding: isMobile ? '3px 6px' : '4px 7px',
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                      border: '2px solid white',
                      boxShadow: '0 2px 8px rgba(245, 87, 108, 0.4)',
                      minWidth: isMobile ? '18px' : '20px',
                      height: isMobile ? '18px' : '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {unreadNotifications > 9 ? '9+' : unreadNotifications}
                  </Badge>
                )}
              </div>
            )}

            {/* 🔥 DROPDOWN DE USUARIO CON SELECTOR DE IDIOMAS INTEGRADO */}
            <NavDropdown
              align="end"
              title={
                <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                  {auth.user ? (
                    <div
                      style={{
                        width: isMobile ? '38px' : '42px',
                        height: isMobile ? '38px' : '42px',
                        borderRadius: '10px',
                        padding: '2px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Avatar
                        src={auth.user.avatar}
                        size="medium-avatar"
                        style={{
                          borderRadius: '8px',
                          objectFit: 'cover',
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        width: isMobile ? '38px' : '42px',
                        height: isMobile ? '38px' : '42px',
                        borderRadius: '10px',
                        backgroundColor: settings.style ? 'rgba(255,255,255,0.1)' : 'rgba(102, 126, 234, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <FaUserCircle size={isMobile ? 22 : 26} style={{ color: '#667eea' }} />
                    </div>
                  )}
                  
                  {/* 🔥 INDICADOR DE IDIOMA ACTIVO */}
                  {useGoogleTranslate && (
                    <div style={{
                      position: 'absolute',
                      top: '-3px',
                      right: '-3px',
                      background: '#28a745',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      border: '2px solid white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <FaLanguage size={6} color="white" />
                    </div>
                  )}
                </div>
              }
              id="nav-user-dropdown"
              className="custom-dropdown"
            >
              <div className="dropdown-scroll-wrapper">
                {auth.user ? (
                  <>
                    {/* Header del usuario */}
                    <div className="user-header">
                      <div className="d-flex align-items-center gap-3">
                        <div className="user-avatar-wrapper">
                          <Avatar src={auth.user.avatar} size="medium-avatar" />
                        </div>
                        <div className="flex-grow-1">
                          <div className="fw-bold text-white user-name">
                            {auth.user.username}
                          </div>
                          <div className="user-role-badge">
                            {userRole === 'admin' ? `👑 ${t('admin')}` :
                              userRole === 'Moderateur' ? `🛡️ ${t('moderator')}` :
                                userRole === 'Super-utilisateur' ? `⭐ ${t('superUser')}` :
                                  `👤 ${t('user')}`}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 🔥 SECCIÓN DE IDIOMAS DENTRO DEL DROPDOWN */}
                    <div className="px-3 pt-2 pb-1">
                      <div className="d-flex align-items-center mb-2">
                        <FaLanguage className="me-2" size={16} style={{ color: '#667eea' }} />
                        <span className="small fw-bold" style={{ color: settings.style ? '#a0aec0' : '#6c757d' }}>
                          {useGoogleTranslate ? '🌐 Traducción activa' : 'Idioma'}
                        </span>
                      </div>
                      
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {languages.map((lang) => (
                          <LanguageItem
                            key={lang.code}
                            lang={lang}
                            onSelect={handleLanguageChange}
                            isSelected={selectedLanguage === lang.code}
                            isTranslateActive={useGoogleTranslate}
                          />
                        ))}
                      </div>
                    </div>

                    <NavDropdown.Divider />

                    <MenuItem icon={FaUserCircle} iconColor="#667eea" to={`/profile/${auth.user._id}`}>
                      {t('profile')}
                    </MenuItem>

                    <MenuItem icon={FaInfoCircle} iconColor="#6c757d" to="/infoaplicacionn">
                      {t('appInfo')}
                    </MenuItem>

                    <MenuItem icon={FaTools} iconColor="#6c757d" to="/users/roles">
                      {t('roles')}
                    </MenuItem>

                    <MenuItem icon={FaShareAlt} iconColor="#ffc107" onClick={() => setShowShareModal(true)}>
                      {t('shareApp')}
                    </MenuItem>

                    {/* Panel de Admin */}
                    {userRole === "admin" && (
                      <>
                        <NavDropdown.Divider />
                        <div className="admin-panel-header">
                          <FaShieldAlt className="me-2" size={16} />
                          {t('adminPanel')}
                        </div>

                        {/* Sección de Tiendas */}
                        <div className="stores-section mb-3">
                          <div className="d-flex align-items-center mb-2">
                            <FaStore className="me-2 text-warning" size={14} />
                            <span className="text-muted small fw-bold">MES BOUTIQUES</span>
                          </div>
                          
                          {/* Crear nueva tienda */}
                          <MenuItem 
                            icon={FaPlusCircle} 
                            iconColor="#28a745"
                            to="/store/create-store"
                            className="mb-2 create-store-item"
                          >
                            <div className="d-flex align-items-center justify-content-between">
                              <span>Créer une boutique</span>
                              <Badge pill bg="success" className="ms-2">
                                <FaPlus size={10} />
                              </Badge>
                            </div>
                          </MenuItem>
                          
                          {/* Ver todas las tiendas */}
                          <MenuItem icon={FaUserCircle} iconColor="#667eea" to={`/store/${auth.user._id}`}>
                            <div className="d-flex align-items-center justify-content-between"></div>
                          </MenuItem>
                        </div>

                        <MenuItem icon={FaUsers} iconColor="#28a745" to="/users">
                          {t('users')}
                        </MenuItem>

                        <MenuItem icon={FaUserCog} iconColor="#667eea" to="/usersactionn">
                          {t('userActions')}
                        </MenuItem>
                      </>
                    )}

                    <NavDropdown.Divider />

                    <MenuItem
                      icon={FaSignOutAlt}
                      iconColor="#dc3545"
                      onClick={handleLogout}
                      danger
                    >
                      <span className="fw-bold">{t('logout')}</span>
                    </MenuItem>
                  </>
                ) : (
                  <>
                    {/* 🔥 SECCIÓN DE IDIOMAS PARA USUARIOS NO LOGUEADOS */}
                    <div className="px-3 pt-3 pb-2">
                      <div className="d-flex align-items-center mb-2">
                        <FaLanguage className="me-2" size={16} style={{ color: '#667eea' }} />
                        <span className="small fw-bold" style={{ color: settings.style ? '#a0aec0' : '#6c757d' }}>
                          {useGoogleTranslate ? '🌐 Traducción activa' : 'Idioma'}
                        </span>
                      </div>
                      
                      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {languages.map((lang) => (
                          <LanguageItem
                            key={lang.code}
                            lang={lang}
                            onSelect={handleLanguageChange}
                            isSelected={selectedLanguage === lang.code}
                            isTranslateActive={useGoogleTranslate}
                          />
                        ))}
                      </div>
                    </div>

                    <NavDropdown.Divider />

                    <MenuItem icon={FaSignInAlt} iconColor="#28a745" to="/login">
                      {t('login')}
                    </MenuItem>

                    <MenuItem icon={FaUserPlus} iconColor="#667eea" to="/register">
                      {t('register')}
                    </MenuItem>
                    <MenuItem icon={FaInfoCircle} iconColor="#6c757d" to="/infoaplicacionn">
                      {t('appInfo')}
                    </MenuItem>

                    <MenuItem icon={FaShareAlt} iconColor="#ffc107" onClick={() => setShowShareModal(true)}>
                      {t('shareApp')}
                    </MenuItem>
                  </>
                )}
              </div>
            </NavDropdown>

            <button
              onClick={handleDrawerOpen}
              className="icon-button"
              style={{
                width: isMobile ? '38px' : '42px',
                height: isMobile ? '38px' : '42px',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: settings.style ? 'rgba(255,255,255,0.1)' : 'rgba(102, 126, 234, 0.1)',
                border: 'none',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                marginLeft: isMobile ? '4px'  : '6px'
              }}
              title={t('menu') || "Menú"}
            >
              <FaBars
                size={isMobile ? 18 : 20}
                style={{
                  color: settings.style ? '#ffffff' : '#667eea'
                }}
              />
            </button>
          </div>
        </Container>
      </Navbar>

      {/* 🔥 ESPACIO PARA COMPENSAR EL NAVBAR FIJO */}
      <div style={{
        height: isMobile ? '56px' : '64px',
        minHeight: isMobile ? '56px' : '64px'
      }} />

      {/* 🔥 ESTILOS PARA OCULTAR SOLO LA BARRA DE GOOGLE Y CORREGIR DROPDOWN */}
      <style>{`
        /* Ocultar solo la barra visible de Google Translate */
        .goog-te-banner-frame,
        .VIpgJd-ZVi9od-ORHb-OEVmcd,
        .VIpgJd-ZVi9od-l4eHX-hSRGPd,
        .skiptranslate {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          height: 0 !important;
          overflow: hidden !important;
        }

        /* Mantener la funcionalidad de traducción pero oculta */
        .goog-te-menu-frame {
          /* Mantenerlo funcionando pero fuera de pantalla */
          position: absolute !important;
          top: -9999px !important;
          left: -9999px !important;
          width: 1px !important;
          height: 1px !important;
          overflow: hidden !important;
        }

        /* Prevenir que el body se mueva */
        body {
          top: 0 !important;
          position: static !important;
        }

        /* Ocultar el botón flotante de Google si aparece */
        .VIpgJd-ZVi9od-aZ2wEe-OiiCO,
        .VIpgJd-ZVi9od-aZ2wEe {
          display: none !important;
        }

        /* 🔥 CORRECCIÓN CRÍTICA PARA DROPDOWN DE IDIOMAS EN MÓVILES */
        @media (max-width: 700px) {
          #language-dropdown + .dropdown-menu {
            position: fixed !important;
            right: 50% !important;
            left: 50% !important;
            transform: translateX(50%) !important;
            top: 60px !important;
            margin-top: 0 !important;
            min-width: 280px !important;
            max-width: calc(100vw - 40px) !important;
            width: auto !important;
            z-index: 9999 !important;
          }
        }

        @media (max-width: 400px) {
          #language-dropdown + .dropdown-menu {
            min-width: 250px !important;
            max-width: calc(100vw - 20px) !important;
            right: 50% !important;
            left: 50% !important;
            transform: translateX(50%) !important;
          }
        }

        /* Animación PWA */
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        /* Iconos interactivos */
        .icon-button {
          cursor: pointer;
          transition: all 0.3s ease;
          -webkit-tap-highlight-color: transparent;
        }

        .icon-button:hover,
        .icon-button:active {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(102, 126, 234, 0.25) !important;
        }

        /* Items del menú */
        .custom-menu-item {
          color: ${settings.style ? '#ffffff' : '#333333'} !important;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        .custom-menu-item:hover,
        .custom-menu-item:active {
          background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%) !important;
          transform: translateX(4px);
        }

        .custom-menu-item.text-danger:hover,
        .custom-menu-item.text-danger:active {
          background: linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(245, 87, 108, 0.1) 100%) !important;
        }

        /* Dropdown scroll */
        .dropdown-scroll-wrapper {
          max-height: 70vh;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 8px 0;
          width: 100%;
          -webkit-overflow-scrolling: touch;
        }

        .dropdown-scroll-wrapper::-webkit-scrollbar {
          width: 4px;
        }

        .dropdown-scroll-wrapper::-webkit-scrollbar-track {
          background: ${settings.style ? 'rgba(255,255,255,0.05)' : '#f1f1f1'};
          border-radius: 10px;
        }

        .dropdown-scroll-wrapper::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 10px;
        }

        /* Header del usuario */
        .user-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 16px;
          margin: 0 0 8px 0;
          border-radius: 12px 12px 0 0;
        }

        .user-avatar-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 3px solid white;
          padding: 2px;
          background: white;
          flex-shrink: 0;
        }

        .user-name {
          font-size: 1rem;
          word-break: break-word;
        }

        .user-role-badge {
          font-size: 0.8rem;
          background-color: rgba(255,255,255,0.2);
          padding: 4px 10px;
          border-radius: 20px;
          display: inline-block;
          margin-top: 4px;
          color: white;
          font-weight: 600;
        }

        /* Admin panel header */
        .admin-panel-header {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
          padding: 10px 16px;
          margin: 4px 12px 8px 12px;
          border-radius: 8px;
          color: white;
          font-weight: 700;
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.25);
        }

        /* Dropdown posicionamiento */
        #nav-user-dropdown + .dropdown-menu {
          position: absolute !important;
          right: 0 !important;
          left: auto !important;
          top: 100% !important;
          margin-top: 8px !important;
          width: 290px !important;
          min-width: 290px !important;
          max-width: 290px !important;
          transform: none !important;
          border: none !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
          background: ${settings.style ? '#2d3748' : '#ffffff'} !important;
          padding: 0 !important;
          overflow: hidden !important;
        }

        /* Estilos para el dropdown de idiomas */
        #language-dropdown + .dropdown-menu {
          position: absolute !important;
          right: 0 !important;
          left: auto !important;
          top: 100% !important;
          margin-top: 8px !important;
          min-width: 220px !important;
          transform: none !important;
          border: none !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
          background: ${settings.style ? '#2d3748' : '#ffffff'} !important;
          padding: 8px 0 !important;
          overflow: hidden !important;
        }

        /* Divider */
        .dropdown-divider {
          border-color: ${settings.style ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} !important;
          margin: 8px 12px !important;
        }

        /* Optimización para móviles */
        @media (max-width: 700px) {
          #nav-user-dropdown + .dropdown-menu {
            right: 8px !important;
            width: 280px !important;
            min-width: 280px !important;
            max-width: 280px !important;
          }

          #language-dropdown + .dropdown-menu {
            right: 8px !important;
            min-width: 200px !important;
          }

          .user-header {
            padding: 14px;
          }

          .user-avatar-wrapper {
            width: 45px;
            height: 45px;
          }

          .user-name {
            font-size: 0.95rem;
          }

          .user-role-badge {
            font-size: 0.75rem;
            padding: 3px 8px;
          }

          .custom-menu-item {
            padding: 10px 14px !important;
            margin: 3px 6px !important;
            width: calc(100% - 12px) !important;
          }

          .admin-panel-header {
            padding: 8px 14px;
            margin: 4px 10px 6px 10px;
            font-size: 0.8rem;
          }
        }

        /* Fix para touch en móviles */
        @media (hover: none) and (pointer: coarse) {
          .icon-button:hover {
            transform: none;
          }

          .icon-button:active {
            transform: scale(0.95);
            opacity: 0.8;
          }

          .custom-menu-item:hover {
            transform: none;
          }

          .custom-menu-item:active {
            background: linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%) !important;
          }
        }

        /* Prevenir zoom en doble tap */
        * {
          touch-action: manipulation;
        }
      `}</style>

      {/* Modales */}
      <VerifyModal
        show={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
      />

      <DesactivateModal
        show={showDeactivatedModal}
        onClose={() => setShowDeactivatedModal(false)}
      />

      <MultiCheckboxModal
        show={showFeaturesModal}
        onClose={() => setShowFeaturesModal(false)}
      />

      <ShareAppModal
        show={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
      <Drawer
        show={showDrawer}
        onHide={handleDrawerClose}
        position="start"
        title={t('menu') || "Menú"}
      />
    </>
  );
};

export default Navbar2;