// components/GoogleTranslateManager.js - Versión simplificada
import React, { useState, useEffect } from 'react';
import { Dropdown, Button } from 'react-bootstrap';
import { Translate, Check, Globe } from 'react-bootstrap-icons';

const GoogleTranslateManager = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentLang, setCurrentLang] = useState('fr');
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // Idiomas soportados
  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
    { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' }
  ];

  // Cargar script de Google Translate de manera más segura
  useEffect(() => {
    // Evitar cargar múltiples veces
    if (document.querySelector('#google-translate-script')) {
      setScriptLoaded(true);
      return;
    }

    // Crear elemento oculto
    let translateElement = document.getElementById('google_translate_element');
    if (!translateElement) {
      translateElement = document.createElement('div');
      translateElement.id = 'google_translate_element';
      translateElement.style.display = 'none';
      document.body.appendChild(translateElement);
    }

    // Función de callback
    window.googleTranslateElementInit = () => {
      try {
        new window.google.translate.TranslateElement({
          pageLanguage: 'fr',
          includedLanguages: languages.map(l => l.code).join(','),
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false
        }, 'google_translate_element');
        
        setScriptLoaded(true);
        
        // Recuperar idioma guardado
        const savedLang = localStorage.getItem('selectedLang');
        if (savedLang && savedLang !== 'fr') {
          setTimeout(() => translatePage(savedLang), 1000);
        }
      } catch (error) {
        console.error('Error inicializando Google Translate:', error);
        setScriptLoaded(true); // Marcar como cargado para no bloquear UI
      }
    };

    // Cargar script
    const script = document.createElement('script');
    script.id = 'google-translate-script';
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    script.onerror = () => {
      console.error('Error cargando Google Translate');
      setScriptLoaded(true);
    };
    document.head.appendChild(script);

    return () => {
      // Limpiar
      if (window.googleTranslateElementInit) {
        window.googleTranslateElementInit = null;
      }
    };
  }, []);

  // Función para traducir la página
  const translatePage = (targetLang) => {
    setIsTranslating(true);
    
    try {
      const selectElement = document.querySelector('.goog-te-combo');
      
      if (selectElement) {
        selectElement.value = targetLang;
        selectElement.dispatchEvent(new Event('change'));
        
        setTimeout(() => {
          setIsTranslating(false);
          setCurrentLang(targetLang);
          localStorage.setItem('selectedLang', targetLang);
          
          // Para árabe, ajustar dirección
          if (targetLang === 'ar') {
            document.documentElement.setAttribute('dir', 'rtl');
          } else {
            document.documentElement.setAttribute('dir', 'ltr');
          }
        }, 1000);
      } else {
        // Si el selector no está disponible, intentar de nuevo
        setTimeout(() => translatePage(targetLang), 500);
      }
    } catch (error) {
      console.error('Error traduciendo:', error);
      setIsTranslating(false);
    }
  };

  // Resetear traducción
  const resetTranslation = () => {
    translatePage('fr');
  };

  // Ocultar elementos no deseados de Google Translate
  useEffect(() => {
    const hideGoogleElements = () => {
      const elements = document.querySelectorAll('.goog-te-banner-frame, .goog-te-menu-frame, .goog-te-gadget');
      elements.forEach(el => {
        if (el) el.style.display = 'none';
      });
      
      // Remover estilos que causan problemas
      const style = document.getElementById('goog-gt-tt');
      if (style) style.remove();
    };
    
    const interval = setInterval(hideGoogleElements, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Botón flotante de traducción */}
      <div className="translate-float-btn">
        <Dropdown align="end">
          <Dropdown.Toggle 
            variant="light" 
            className="rounded-circle shadow-lg d-flex align-items-center justify-content-center"
            style={{ 
              width: '56px', 
              height: '56px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              color: 'white'
            }}
            disabled={isTranslating}
          >
            {isTranslating ? (
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Traduction...</span>
              </div>
            ) : (
              <Translate size={24} />
            )}
          </Dropdown.Toggle>

          <Dropdown.Menu align="end" className="translate-menu shadow-lg" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Dropdown.Header className="d-flex align-items-center">
              <Globe className="me-2" size={16} />
              <span>Traduire la page</span>
              {currentLang !== 'fr' && (
                <span className="ms-2 badge bg-success">Traduit</span>
              )}
            </Dropdown.Header>
            <Dropdown.Divider />
            
            {languages.map(lang => (
              <Dropdown.Item 
                key={lang.code}
                onClick={() => translatePage(lang.code)}
                active={currentLang === lang.code}
                className="d-flex align-items-center justify-content-between"
              >
                <span>
                  <span className="me-2">{lang.flag}</span>
                  {lang.name}
                </span>
                {currentLang === lang.code && <Check size={14} className="text-success" />}
              </Dropdown.Item>
            ))}
            
            <Dropdown.Divider />
            <Dropdown.Item 
              onClick={resetTranslation}
              className="text-danger"
              disabled={currentLang === 'fr'}
            >
              <span>🔄 Afficher l'original (Français)</span>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Estilos CSS */}
      <style jsx="true">{`
        .translate-float-btn {
          position: fixed;
          bottom: 80px;
          right: 20px;
          z-index: 9999;
        }
        
        .translate-float-btn .btn {
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        
        .translate-float-btn .btn:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.5);
        }
        
        .translate-menu {
          border-radius: 12px !important;
          border: none !important;
          box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
          min-width: 220px !important;
        }
        
        .translate-menu .dropdown-item {
          padding: 10px 16px;
          transition: all 0.2s ease;
        }
        
        .translate-menu .dropdown-item:hover {
          background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
          transform: translateX(4px);
        }
        
        .translate-menu .dropdown-item.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        /* Ocultar elementos de Google Translate */
        .goog-te-gadget {
          display: none !important;
        }
        
        .goog-te-banner-frame {
          display: none !important;
        }
        
        .goog-te-menu-frame {
          display: none !important;
        }
        
        body {
          top: 0px !important;
        }
        
        @media (max-width: 768px) {
          .translate-float-btn {
            bottom: 70px;
            right: 15px;
          }
          
          .translate-float-btn .btn {
            width: 48px;
            height: 48px;
          }
        }
      `}</style>
    </>
  );
};

export default GoogleTranslateManager;