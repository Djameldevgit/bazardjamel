// pages/video/HeaderVideo.jsx - Versión mejorada estilo TikTok
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { 
  House, 
  PlusCircle, 
  Chat, 
  Person,
  Compass,
  Heart
} from 'react-bootstrap-icons';
import './HeaderVideo.css';

const HeaderVideo = () => {
  const history = useHistory();
  const location = useLocation();
  const { auth } = useSelector(state => state);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  
  const currentUserId = auth.user?._id;
  
  // Simular mensajes no leídos (ajusta según tu lógica)
  useEffect(() => {
    // Aquí puedes conectar con tu socket o API para obtener mensajes no leídos
    const fetchUnreadCount = async () => {
      // Ejemplo: setUnreadMessages(count);
    };
    fetchUnreadCount();
  }, []);
  
  // Verificar si la ruta está activa
  const isActive = (path) => {
    if (path === '/videos') {
      return location.pathname.startsWith('/videos');
    }
    if (path === '/profile') {
      return location.pathname.includes('/userVideo/') || location.pathname === `/video/userVideo/${currentUserId}`;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  // Navegar a home (feed general)
  const goToHome = () => {
    history.push('/videos/1');
  };
  
  // Navegar a trending/explore
  const goToExplore = () => {
    history.push('/videos/trending');
  };
  
  // Navegar a crear video
  const goToCreateVideo = () => {
    setShowCreateMenu(false);
    history.push('/create-video-page');
  };
  
  // Navegar a mensajes
  const goToMessages = () => {
    history.push('/message');
  };
  
  // Navegar a perfil del usuario
  const goToProfile = () => {
    if (currentUserId) {
      history.push(`/video/userVideo/${currentUserId}`);
    }
  };
  
  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = () => setShowCreateMenu(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  return (
    <div className="header-video-container">
      <div className="header-video-content">
        
        {/* Home / Accueil */}
        <button 
          className={`header-video-item ${isActive('/videos') ? 'active' : ''}`}
          onClick={goToHome}
          title="Accueil"
        >
          <div className="header-video-icon-wrapper">
            <House size={24} />
            {isActive('/videos') && <div className="active-indicator" />}
          </div>
          <span className="header-video-label">Accueil</span>
        </button>
        
        {/* Explore / Découvrir (nuevo) */}
        <button 
          className={`header-video-item ${isActive('/videos/trending') ? 'active' : ''}`}
          onClick={goToExplore}
          title="Découvrir"
        >
          <div className="header-video-icon-wrapper">
            <Compass size={24} />
          </div>
          <span className="header-video-label">Discover</span>
        </button>
        
        {/* Plus / Créer vidéo con menú */}
        <div className="header-video-create-wrapper">
          <button 
            className={`header-video-item create-btn ${isActive('/create-video-page') ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setShowCreateMenu(!showCreateMenu);
            }}
            title="Créer"
          >
            <div className="header-video-icon-wrapper">
              <PlusCircle size={28} />
            </div>
            <span className="header-video-label">Créer</span>
          </button>
          
          {/* Menú desplegable para crear */}
          {showCreateMenu && (
            <div className="create-menu" onClick={(e) => e.stopPropagation()}>
              <div className="create-menu-item" onClick={goToCreateVideo}>
                <PlusCircle size={20} />
                <span>Nouvelle vidéo</span>
              </div>
              <div className="create-menu-divider" />
              <div className="create-menu-item" onClick={() => history.push('/upload')}>
                <House size={20} />
                <span>Upload depuis galerie</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Messages con badge de notificaciones */}
        <button 
          className={`header-video-item ${isActive('/message') ? 'active' : ''}`}
          onClick={goToMessages}
          title="Messages"
        >
          <div className="header-video-icon-wrapper">
            <Chat size={24} />
            {unreadMessages > 0 && (
              <span className="notification-badge">{unreadMessages > 99 ? '99+' : unreadMessages}</span>
            )}
          </div>
          <span className="header-video-label">Messages</span>
        </button>
        
        {/* Profile con avatar mejorado */}
        <button 
          className={`header-video-item ${isActive('/profile') ? 'active' : ''}`}
          onClick={goToProfile}
          title="Profil"
        >
          <div className="header-video-icon-wrapper">
            {auth.user?.avatar ? (
              <img 
                src={auth.user.avatar} 
                alt="avatar" 
                className="header-video-avatar"
              />
            ) : (
              <Person size={24} />
            )}
            {isActive('/profile') && <div className="active-indicator" />}
          </div>
          <span className="header-video-label">Profil</span>
        </button>
      </div>
    </div>
  );
};

export default HeaderVideo;