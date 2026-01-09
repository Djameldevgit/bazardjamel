import React, { useEffect } from 'react';

const GoogleTranslateManager = () => {
  useEffect(() => {
    // Eliminar barra de Google Translate
    const removeGoogleBanner = () => {
      document.querySelector('.goog-te-banner-frame')?.remove();
      document.querySelector('.skiptranslate')?.remove();
      document.body.style.top = '0';
    };

    const handleLanguageChange = (event) => {
      const targetLang = event.detail?.targetLang;
      if (!targetLang) return;
      
      const isArabic = targetLang === 'ar';
      document.documentElement.dir = isArabic ? 'rtl' : 'ltr';
      
      // Forzar LTR en navbar2 y drawer
      if (isArabic) {
        setTimeout(() => {
          document.querySelector('.navbar2')?.style.setProperty('direction', 'ltr', 'important');
          document.querySelector('.drawer')?.style.setProperty('direction', 'ltr', 'important');
        }, 50);
      }
      
      localStorage.setItem('targetTranslateLang', targetLang);
      setTimeout(removeGoogleBanner, 100);
    };

    // Inicial
    if (localStorage.getItem('targetTranslateLang') === 'ar') {
      document.documentElement.dir = 'rtl';
      setTimeout(() => {
        document.querySelector('.navbar2')?.style.setProperty('direction', 'ltr', 'important');
        document.querySelector('.drawer')?.style.setProperty('direction', 'ltr', 'important');
        removeGoogleBanner();
      }, 300);
    }

    document.addEventListener('languageChanged', handleLanguageChange);
    
    // Observador para eliminar barra si aparece
    const observer = new MutationObserver(removeGoogleBanner);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('languageChanged', handleLanguageChange);
      observer.disconnect();
    };
  }, []);

  return null;
};

export default GoogleTranslateManager;