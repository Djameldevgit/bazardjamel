// pages/video/userVideo/[userId].js
import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFilm,
  faBookmark,
  faHeart,
  faArrowLeft,
  faUserPlus,
  faCheck,
  faEnvelope,
  faShare,
  faEllipsisH,
  faCamera,
  faSpinner,
  faUserCircle,
  faPlay,
  faComment
} from '@fortawesome/free-solid-svg-icons';

// Importar acciones
import {
  getUserProfile,
  getUserVideos,
  getSavedVideos,
  getLikedVideos,
  setActiveTab,
  toggleFollow,
  clearUserVideoState
} from '../../../redux/actions/userVideoAction';

// Importar componentes
import LoadMoreBtn from '../../../components/LoadMoreBtn';

// Estilos CSS
import './UserVideoPage.css';

// ============================================
// COMPONENTE DE LOADING INTERNO
// ============================================
const LoadingSpinner = () => (
  <div className="user-video-loading">
    <div className="loading-spinner">
      <FontAwesomeIcon icon={faSpinner} spin />
    </div>
    <p>Chargement...</p>
  </div>
);

// ============================================
// COMPONENTE AVATAR CON FALLBACK
// ============================================
const AvatarWithFallback = ({ src, alt, className, username }) => {
  const [imgError, setImgError] = useState(false);
  
  if (imgError || !src) {
    const colors = ['#fe2c55', '#ff9800', '#4caf50', '#2196f3', '#9c27b0'];
    const colorIndex = username ? username.length % colors.length : 0;
    const bgColor = colors[colorIndex];
    
    return (
      <div 
        className={className} 
        style={{ 
          background: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px',
          fontWeight: 'bold'
        }}
      >
        {username ? username[0].toUpperCase() : <FontAwesomeIcon icon={faUserCircle} />}
      </div>
    );
  }
  
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setImgError(true)}
    />
  );
};

// ============================================
// COMPONENTE MINI VIDEO CARD
// ============================================
const MiniVideoCard = ({ video, onClick }) => {
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="uv-mini-video-card" onClick={() => onClick(video._id)}>
      <div className="uv-mini-thumbnail-container">
        <img 
          src={video.thumbnail || video.videoUrl?.replace(/\.mp4$/, '.jpg') || 'https://via.placeholder.com/200x355?text=No+Image'} 
          alt={video.title}
          className="uv-mini-thumbnail"
          loading="lazy"
        />
        <div className="uv-mini-overlay">
          <div className="uv-mini-stats">
            <span><FontAwesomeIcon icon={faPlay} /> {formatNumber(video.views)}</span>
            <span><FontAwesomeIcon icon={faHeart} /> {formatNumber(video.likes?.length || 0)}</span>
            <span><FontAwesomeIcon icon={faComment} /> {formatNumber(video.comments?.length || 0)}</span>
          </div>
        </div>
      </div>
      <p className="uv-mini-title">{video.title?.substring(0, 40)}</p>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
const UserVideoPage = () => {
  const { userId } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  const { auth, userVideo } = useSelector(state => state);
  const { profile, videos, savedVideos, likedVideos, activeTab, loading } = userVideo;
  
  const [userVideosPage, setUserVideosPage] = useState(1);
  const [savedVideosPage, setSavedVideosPage] = useState(1);
  const [likedVideosPage, setLikedVideosPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  
  const isOwnProfile = auth.user?._id === userId;
  
  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      if (auth.token) {
        await dispatch(getUserProfile(userId, auth.token));
        await dispatch(getUserVideos(userId, 1, auth.token, isOwnProfile));
      }
    };
    
    loadInitialData();
    
    return () => {
      dispatch(clearUserVideoState());
    };
  }, [userId, auth.token, isOwnProfile, dispatch]);
  
  // Cambiar tab
  const handleTabChange = useCallback(async (tab) => {
    dispatch(setActiveTab(tab));
    
    if (tab === 'saved' && savedVideos.length === 0 && auth.token) {
      await dispatch(getSavedVideos(userId, 1, auth.token));
    } else if (tab === 'liked' && likedVideos.length === 0 && auth.token) {
      await dispatch(getLikedVideos(userId, 1, auth.token));
    }
  }, [userId, auth.token, savedVideos.length, likedVideos.length, dispatch]);
  
  // Cargar más videos
  const loadMoreVideos = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    
    const nextPage = userVideosPage + 1;
    await dispatch(getUserVideos(userId, nextPage, auth.token, isOwnProfile));
    setUserVideosPage(nextPage);
    setLoadingMore(false);
  }, [userVideosPage, userId, auth.token, isOwnProfile, loadingMore, dispatch]);
  
  const loadMoreSaved = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    
    const nextPage = savedVideosPage + 1;
    await dispatch(getSavedVideos(userId, nextPage, auth.token));
    setSavedVideosPage(nextPage);
    setLoadingMore(false);
  }, [savedVideosPage, userId, auth.token, loadingMore, dispatch]);
  
  const loadMoreLiked = useCallback(async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    
    const nextPage = likedVideosPage + 1;
    await dispatch(getLikedVideos(userId, nextPage, auth.token));
    setLikedVideosPage(nextPage);
    setLoadingMore(false);
  }, [likedVideosPage, userId, auth.token, loadingMore, dispatch]);
  
  // Seguir usuario
  const handleFollow = useCallback(async () => {
    if (!auth.token) {
      history.push('/login');
      return;
    }
    await dispatch(toggleFollow(userId, auth.token));
  }, [userId, auth.token, history, dispatch]);
  
  // Ir a mensajes
  const handleMessage = useCallback(() => {
    history.push(`/message/${userId}`);
  }, [userId, history]);
  
  // Compartir perfil
  const handleShareProfile = useCallback(() => {
    const url = `${window.location.origin}/video/userVideo/${userId}`;
    if (navigator.share) {
      navigator.share({
        title: `Perfil de ${profile?.username}`,
        url: url
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
    }
  }, [profile?.username, userId]);
  
  // ✅ FUNCIÓN CORREGIDA - Navega al feed vertical del usuario
  const handleVideoClick = (videoId) => {
    // Guardar posición actual para volver después
    sessionStorage.setItem('returnToProfile', 'true');
    sessionStorage.setItem('profileScrollPosition', window.scrollY.toString());
    // Navegar al feed vertical del usuario con el video específico
    history.push(`/video/userFeed/${userId}?startVideo=${videoId}`);
  };
  // En UserVideoPage.js - La función debe ser así:
 
  // Formatear números
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };
  
  // Obtener videos según tab activo
  const getCurrentVideos = () => {
    switch(activeTab) {
      case 'saved': return savedVideos;
      case 'liked': return likedVideos;
      default: return videos;
    }
  };
  
  const getCurrentHasMore = () => {
    switch(activeTab) {
      case 'saved': return userVideo.savedVideosHasMore;
      case 'liked': return userVideo.likedVideosHasMore;
      default: return userVideo.userVideosHasMore;
    }
  };
  
  const getCurrentTotal = () => {
    switch(activeTab) {
      case 'saved': return userVideo.savedVideosTotal;
      case 'liked': return userVideo.likedVideosTotal;
      default: return userVideo.userVideosTotal;
    }
  };
  
  const loadMoreFunction = () => {
    if (activeTab === 'saved') loadMoreSaved();
    else if (activeTab === 'liked') loadMoreLiked();
    else loadMoreVideos();
  };
  
  if (loading && !profile) {
    return <LoadingSpinner />;
  }
  
  if (!profile) {
    return (
      <div className="user-video-error">
        <h2>Utilisateur non trouvé</h2>
        <button onClick={() => history.push('/')}>Retour à l'accueil</button>
      </div>
    );
  }
  
  return (
    <div className="user-video-page">
      {/* Header */}
      <div className="uv-header">
        <button className="uv-back-btn" onClick={() => history.push('/')}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1 className="uv-header-title">Profil</h1>
        <button className="uv-share-btn" onClick={handleShareProfile}>
          <FontAwesomeIcon icon={faShare} />
        </button>
      </div>
      
      {/* Avatar con fallback */}
      <div className="uv-avatar-container">
        <AvatarWithFallback
          src={profile.avatar}
          alt={profile.username}
          username={profile.username}
          className="uv-avatar"
        />
        {isOwnProfile && (
          <button className="uv-edit-avatar-btn">
            <FontAwesomeIcon icon={faCamera} />
          </button>
        )}
      </div>
      
      {/* Username */}
      <h2 className="uv-username">@{profile.username}</h2>
      
      {/* Bio */}
      {profile.bio && <p className="uv-bio">{profile.bio}</p>}
      
      {/* Estadísticas - 3 columnas centradas */}
      <div className="uv-stats-row">
        <div className="uv-stat">
          <div className="uv-stat-number">
            {formatNumber(profile.videoStats?.totalVideos || 0)}
          </div>
          <div className="uv-stat-label">Vidéos</div>
        </div>
        
        <div className="uv-stat">
          <div className="uv-stat-number">
            {formatNumber(profile.followersCount || 0)}
          </div>
          <div className="uv-stat-label">Abonnés</div>
        </div>
        
        <div className="uv-stat">
          <div className="uv-stat-number">
            {formatNumber(profile.followingCount || 0)}
          </div>
          <div className="uv-stat-label">Abonnements</div>
        </div>
      </div>
      
      {/* Botones Seguir y Mensaje */}
      {!isOwnProfile && (
        <div className="uv-action-buttons">
          <button
            className={`uv-follow-btn ${profile.isFollowing ? 'following' : ''}`}
            onClick={handleFollow}
          >
            <FontAwesomeIcon icon={profile.isFollowing ? faCheck : faUserPlus} />
            <span>{profile.isFollowing ? 'Suivi' : 'Suivre'}</span>
          </button>
          
          <button className="uv-message-btn" onClick={handleMessage}>
            <FontAwesomeIcon icon={faEnvelope} />
            <span>Message</span>
          </button>
          
          <button className="uv-more-btn">
            <FontAwesomeIcon icon={faEllipsisH} />
          </button>
        </div>
      )}
      
      {/* Separador */}
      <div className="uv-separator" />
      
      {/* Tabs - Estilo TikTok */}
      <div className="uv-tabs">
        <button
          className={`uv-tab ${activeTab === 'videos' ? 'active' : ''}`}
          onClick={() => handleTabChange('videos')}
        >
          <FontAwesomeIcon icon={faFilm} />
          <span>Vidéos</span>
          {getCurrentTotal() > 0 && <span className="uv-tab-count">{formatNumber(getCurrentTotal())}</span>}
        </button>
        
        <button
          className={`uv-tab ${activeTab === 'saved' ? 'active' : ''}`}
          onClick={() => handleTabChange('saved')}
        >
          <FontAwesomeIcon icon={faBookmark} />
          <span>Favoris</span>
          {userVideo.savedVideosTotal > 0 && <span className="uv-tab-count">{formatNumber(userVideo.savedVideosTotal)}</span>}
        </button>
        
        <button
          className={`uv-tab ${activeTab === 'liked' ? 'active' : ''}`}
          onClick={() => handleTabChange('liked')}
        >
          <FontAwesomeIcon icon={faHeart} />
          <span>J'aime</span>
          {userVideo.likedVideosTotal > 0 && <span className="uv-tab-count">{formatNumber(userVideo.likedVideosTotal)}</span>}
        </button>
      </div>
      
      {/* Grid de videos */}
      <div className="uv-videos-grid">
        {getCurrentVideos().map(video => (
          <MiniVideoCard 
            key={video._id} 
            video={video} 
            onClick={handleVideoClick}
          />
        ))}
      </div>
      
      {/* Empty state */}
      {getCurrentVideos().length === 0 && !loading && (
        <div className="uv-empty-state">
          <div className="uv-empty-icon-container">
            <FontAwesomeIcon icon={activeTab === 'videos' ? faFilm : (activeTab === 'saved' ? faBookmark : faHeart)} className="uv-empty-icon" />
          </div>
          <h3 className="uv-empty-title">
            {activeTab === 'videos' ? 'Aucune vidéo' : (activeTab === 'saved' ? 'Aucun favori' : 'Aucun "j\'aime"')}
          </h3>
          <p className="uv-empty-description">
            {activeTab === 'videos' && isOwnProfile 
              ? 'Commencez à partager vos premières vidéos !' 
              : activeTab === 'videos' 
                ? 'Cet utilisateur n\'a pas encore publié de vidéos.'
                : activeTab === 'saved'
                  ? 'Les vidéos que vous sauvegardez apparaîtront ici.'
                  : 'Les vidéos que vous aimez apparaîtront ici.'}
          </p>
          {activeTab === 'videos' && isOwnProfile && (
            <button
              className="uv-upload-btn"
              onClick={() => history.push('/upload-video')}
            >
              <FontAwesomeIcon icon={faCamera} />
              Publier une vidéo
            </button>
          )}
        </div>
      )}
      
      {/* Load more */}
      {getCurrentHasMore() && getCurrentVideos().length > 0 && (
        <LoadMoreBtn
          loading={loadingMore}
          loadMore={loadMoreFunction}
        />
      )}
    </div>
  );
};

export default UserVideoPage;