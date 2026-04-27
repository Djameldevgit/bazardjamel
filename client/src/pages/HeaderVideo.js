// pages/video/HeaderVideo.jsx - Versión con React Bootstrap
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { 
  House, 
  PlusCircle, 
  Chat, 
  Person 
} from 'react-bootstrap-icons';
import './HeaderVideo.css';

const HeaderVideo = () => {
  const history = useHistory();
  const location = useLocation();
  const { auth } = useSelector(state => state);
  
  const currentUserId = auth.user?._id;
  
  // Verificar si la ruta está activa
  const isActive = (path) => {
    if (path === '/videos') {
      return location.pathname.startsWith('/videos');
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  // Navegar a home (feed general)
  const goToHome = () => {
    history.push('/videos/1');
  };
  
  // Navegar a crear video
  const goToCreateVideo = () => {
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
  
  return (
    <div className="header-video-container">
      <div className="header-video-content">
        {/* Home */}
        <button 
          className={`header-video-item ${isActive('/videos') ? 'active' : ''}`}
          onClick={goToHome}
          title="Accueil"
        >
          <div className="header-video-icon">
            <House size={24} />
          </div>
          <span className="header-video-label">Accueil</span>
        </button>
        
        {/* Plus / Créer vidéo */}
        <button 
          className={`header-video-item ${isActive('/create-video-page') ? 'active' : ''}`}
          onClick={goToCreateVideo}
          title="Créer"
        >
          <div className="header-video-icon">
            <PlusCircle size={24} />
          </div>
          <span className="header-video-label">Créer</span>
        </button>
        
        {/* Messages */}
        <button 
          className={`header-video-item ${isActive('/message') ? 'active' : ''}`}
          onClick={goToMessages}
          title="Messages"
        >
          <div className="header-video-icon">
            <Chat size={24} />
          </div>
          <span className="header-video-label">Messages</span>
        </button>
        
        {/* Profile */}
        <button 
          className={`header-video-item ${isActive(`/video/userVideo/${currentUserId}`) ? 'active' : ''}`}
          onClick={goToProfile}
          title="Profil"
        >
          <div className="header-video-icon">
            {auth.user?.avatar ? (
              <img 
                src={auth.user.avatar} 
                alt="avatar" 
                className="header-video-avatar"
              />
            ) : (
              <Person size={24} />
            )}
          </div>
          <span className="header-video-label">Profil</span>
        </button>
      </div>
    </div>
  );
};

export default HeaderVideo;