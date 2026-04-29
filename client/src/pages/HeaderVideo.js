// pages/video/HeaderVideo.jsx - Versión con menú Video/Image
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { 
  House, 
  PlusCircle, 
  Chat, 
  Person,
  Compass,
  Camera,
  Image
} from 'react-bootstrap-icons';
import './HeaderVideo.css';

const HeaderVideo = () => {
  const history = useHistory();
  const location = useLocation();
  const { auth } = useSelector(state => state);
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  
  const currentUserId = auth.user?._id;
  
  useEffect(() => {
    const fetchUnreadCount = async () => {
      // Tu lógica de mensajes no leídos
    };
    fetchUnreadCount();
  }, []);
  
  const isActive = (path) => {
    if (path === '/videos') {
      return location.pathname.startsWith('/videos');
    }
    if (path === '/profile') {
      return location.pathname.includes('/userVideo/') || location.pathname === `/video/userVideo/${currentUserId}`;
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  const goToHome = () => {
    history.push('/videos/1');
  };
  
  const goToExplore = () => {
    history.push('/videos/trending');
  };
  
  const goToCreateVideo = () => {
    setShowCreateMenu(false);
    history.push('/create-video-page');
  };
  
  const goToCreateImage = () => {
    setShowCreateMenu(false);
    history.push('/create-image-page');
  };
  
  const goToMessages = () => {
    history.push('/message');
  };
  
  const goToProfile = () => {
    if (currentUserId) {
      history.push(`/video/userVideo/${currentUserId}`);
    }
  };
  
  useEffect(() => {
    const handleClickOutside = () => setShowCreateMenu(false);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);
  
  return (
    <div className="header-video-container">
      <div className="header-video-content">
        
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
        
        {/* Menu Plus avec Video et Image */}
        <div className="header-video-create-wrapper">
          <button 
            className={`header-video-item create-btn`}
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
          
          {showCreateMenu && (
            <div className="create-menu" onClick={(e) => e.stopPropagation()}>
              <div className="create-menu-item" onClick={goToCreateVideo}>
                <Camera size={20} />
                <span>Nouvelle vidéo</span>
              </div>
              <div className="create-menu-divider" />
              <div className="create-menu-item" onClick={goToCreateImage}>
                <Image size={20} />
                <span>Nouvelle image</span>
              </div>
            </div>
          )}
        </div>
        
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