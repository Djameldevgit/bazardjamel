// components/Video/DetailVideoPage.jsx - VERSIÓN MODIFICADA (solo agregar returnToFeed)
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Badge, Card } from 'react-bootstrap';
import {
  Heart, HeartFill, Eye, Clock, Share, Bookmark, BookmarkFill,
  ArrowLeft, MusicNote, Chat, VolumeUp, VolumeMute, CheckCircle,
  Trash, ShieldLock, CameraReels, HourglassSplit, SendCheck
} from 'react-bootstrap-icons';
import { getVideoById, likeVideo } from '../../redux/actions/videoAction';
import { aprobarVideo, eliminarVideo } from '../../redux/actions/videoApproveAction';
import VideoActions from './VideoActions';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import moment from 'moment';
import 'moment/locale/fr';
import VideoComments from './VideoCommentsSheet';
import './css/video.css';

const DetailVideoPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth, socket } = useSelector(state => state);
  const { currentVideo: video, loading } = useSelector(state => state.video || {});
  
  // Estados
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAdminInfo, setShowAdminInfo] = useState(true);
  
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  
  moment.locale('fr');

  const isAdmin = auth.user?.role === 'admin' || auth.user?.role === 'moderator';
  const isOwner = video?.user?._id === auth.user?._id;
  const isPending = video?.pendiente === true;

  // ✅ Efecto para obtener el video
  useEffect(() => {
    if (id) {
      dispatch(getVideoById(id));
    }
  }, [dispatch, id]);

  // ✅ Efecto para actualizar estados
  useEffect(() => {
    if (video && !video.pendiente) {
      setLiked(video.liked || false);
      setLikesCount(video.likes?.length || 0);
      setCommentsCount(video.comments?.length || 0);
    }
  }, [video]);

  // ✅ Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ✅ Progress tracking
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      if (videoElement.duration) {
        setProgress((videoElement.currentTime / videoElement.duration) * 100);
      }
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    return () => videoElement.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  // ============================================
  // ✅ FUNCIÓN PARA VOLVER AL FEED (NUEVA)
  // ============================================
  const returnToFeed = () => {
    const shouldReturnToFeed = sessionStorage.getItem('returnToFeed') === 'true';
    const feedPosition = sessionStorage.getItem('feedScrollPosition');
    
    if (shouldReturnToFeed) {
      sessionStorage.removeItem('returnToFeed');
      sessionStorage.removeItem('feedScrollPosition');
      
      if (feedPosition) {
        sessionStorage.setItem('tempScrollPosition', feedPosition);
      }
      
      history.push('/');
      
      setTimeout(() => {
        const savedPosition = sessionStorage.getItem('tempScrollPosition');
        if (savedPosition) {
          window.scrollTo(0, parseInt(savedPosition));
          sessionStorage.removeItem('tempScrollPosition');
        }
      }, 100);
      
      return true;
    }
    return false;
  };

  const handleLike = async () => {
    if (!auth.token) {
      history.push('/login');
      return;
    }
    if (isPending) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { error: 'Vidéo en attente de validation' } });
      return;
    }
    
    const result = await dispatch(likeVideo(video._id, auth.token, auth, socket, video));
    if (result?.liked !== undefined) {
      setLiked(result.liked);
      setLikesCount(result.likes);
    }
  };

  const handleSave = () => {
    if (!auth.token) return history.push('/login');
    if (isPending) return dispatch({ type: GLOBALTYPES.ALERT, payload: { error: 'Vidéo en attente de validation' } });
    setSaved(!saved);
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: saved ? 'Retiré des favoris' : 'Ajouté aux favoris' } });
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/video/${id}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: video?.title, url: shareUrl });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(shareUrl);
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: 'Lien copié !' } });
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleProgressClick = (e) => {
    if (videoRef.current && progressBarRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };

  // ✅ MODIFICAR handleGoBack para usar returnToFeed
  const handleGoBack = () => {
    if (returnToFeed()) return;
    if (isAdmin && isPending) history.push('/admin/posts?tab=videos');
    else history.goBack();
  };

  const handleApprove = async () => {
    if (!isAdmin) return;
    if (!window.confirm(`Approuver la vidéo "${video?.title}" ?`)) return;
    setActionLoading(true);
    const result = await dispatch(aprobarVideo(id, auth.token, auth, socket, video));
    setActionLoading(false);
    if (result?.success) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: 'Vidéo approuvée !' } });
      setTimeout(() => history.push('/admin/posts?tab=videos'), 1500);
    }
  };

  const handleDelete = async () => {
    if (!isAdmin) return;
    if (!window.confirm(`Supprimer "${video?.title}" ?`)) return;
    setActionLoading(true);
    const result = await dispatch(eliminarVideo(id, auth.token, auth, socket, video));
    setActionLoading(false);
    if (result?.success) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: 'Vidéo supprimée' } });
      setTimeout(() => history.push('/admin/posts?tab=videos'), 1500);
    }
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
    return num.toString();
  };

  // ============================================
  // ✅ PANTALLA DE CARGA
  // ============================================
  if (loading && !video) {
    return (
      <div className="tiktok-loader">
        <div className="tiktok-spinner"></div>
      </div>
    );
  }

  // ============================================
  // ✅ PANTALLA PARA VIDEO PENDIENTE
  // ============================================
  if (video && video.pendiente === true && !isAdmin) {
    return (
      <div className="pending-video-container">
        <Card className="pending-video-card">
          <div className="pending-icon-wrapper">
            <div className="pending-icon">
              <HourglassSplit size={48} color="white" />
            </div>
          </div>
          
          <h2 className="pending-title">Vidéo en cours de validation</h2>
          
          <div className="pending-divider"></div>
          
          <p className="pending-message">
            📹 Votre vidéo "{video.title}" a été envoyée aux administrateurs pour validation.
            Vous serez notifié dès qu'elle sera publiée.
          </p>
          
          <div className="pending-info-card">
            <div className="pending-info-header">
              <CameraReels size={24} color="#667eea" />
              <h5 className="pending-info-title">{video.title}</h5>
            </div>
            <div className="pending-info-details">
              <div className="pending-info-item">
                <Clock size={14} color="#a0aec0" />
                <span>Envoyé le {moment(video.createdAt).format('DD/MM/YYYY à HH:mm')}</span>
              </div>
            </div>
          </div>
          
          <div className="pending-timeline">
            <div className="timeline-step completed">
              <div className="timeline-icon">
                <SendCheck size={16} color="white" />
              </div>
              <span className="timeline-label">Envoyée</span>
            </div>
            <div className="timeline-line">
              <div className="timeline-line-progress"></div>
            </div>
            <div className="timeline-step active">
              <div className="timeline-icon">
                <HourglassSplit size={16} color="white" />
              </div>
              <span className="timeline-label">En validation</span>
            </div>
            <div className="timeline-line"></div>
            <div className="timeline-step">
              <div className="timeline-icon">
                <CheckCircle size={16} color="#718096" />
              </div>
              <span className="timeline-label">Publiée</span>
            </div>
          </div>
          
          <div className="pending-buttons">
            <Button variant="outline-secondary" onClick={() => history.push('/')}>
              Parcourir les vidéos
            </Button>
            <Button variant="primary" onClick={() => history.push('/create-video')}>
              Créer une autre vidéo
            </Button>
          </div>
          
          <p className="pending-notification">
            <BellIcon size={14} />
            Vous recevrez une notification dès que votre vidéo sera publiée
          </p>
        </Card>
      </div>
    );
  }

  // ============================================
  // ✅ VIDEO NO ENCONTRADO
  // ============================================
  if (!video && !loading) {
    return (
      <div className="pending-video-container">
        <Card className="pending-video-card">
          <h2 className="pending-title">Vidéo non trouvée</h2>
          <div className="pending-divider"></div>
          <p className="pending-message">La vidéo que vous recherchez n'existe pas ou a été supprimée.</p>
          <div className="pending-buttons">
            <Button variant="primary" onClick={() => history.push('/')}>
              Retour à l'accueil
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // ============================================
  // ✅ VIDEO APROBADO
  // ============================================
  return (
    <div className="tiktok-container">
      {/* Banner para admin con video pendiente */}
      {isAdmin && video?.pendiente === true && (
        <div className="admin-pending-banner">
          <ShieldLock className="me-2" size={16} />
          <strong>Mode Admin:</strong> Cette vidéo est en attente d'approbation.
          <Button variant="link" size="sm" className="text-white ms-3" onClick={handleGoBack}>
            ← Retour
          </Button>
        </div>
      )}
      
      {/* Header */}
      <div className={`tiktok-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="d-flex justify-content-between align-items-center">
          <Button variant="link" className="text-white p-0" onClick={handleGoBack}>
            <ArrowLeft size={24} />
          </Button>
          <h6 className="text-white mb-0">Vidéos</h6>
          <div style={{ width: 24 }}></div>
        </div>
      </div>

      {/* Contenedor principal del video */}
      <div className="tiktok-video-container">
        {/* Video Player */}
        {video?.videoType === 'local' ? (
          <video
            ref={videoRef}
            src={video.videoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="tiktok-video"
            poster={video.thumbnail}
            onClick={togglePlay}
          />
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${video?.videoId}?autoplay=1&loop=1&mute=${isMuted ? 1 : 0}&controls=0`}
            title={video?.title}
            frameBorder="0"
            allowFullScreen
            className="tiktok-video"
          />
        )}

        {/* Barra de progreso */}
        <div ref={progressBarRef} className="tiktok-progress-bar" onClick={handleProgressClick}>
          <div className="tiktok-progress" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Control de volumen */}
        <button onClick={toggleMute} className="tiktok-volume-control">
          {isMuted ? <VolumeMute size={20} /> : <VolumeUp size={20} />}
        </button>

        {/* Sidebar de acciones */}
        <div className="tiktok-actions-sidebar">
          {/* Admin actions */}
          {isAdmin && video?.pendiente === true && (
            <div className="tiktok-action-item">
              <div className="d-flex flex-column gap-2">
                <button className="tiktok-action-btn bg-success bg-opacity-25 rounded-circle p-2" onClick={handleApprove} disabled={actionLoading}>
                  <CheckCircle size={24} color="#4caf50" />
                </button>
                <button className="tiktok-action-btn bg-danger bg-opacity-25 rounded-circle p-2" onClick={handleDelete} disabled={actionLoading}>
                  <Trash size={24} color="#f44336" />
                </button>
              </div>
              <p className="tiktok-action-count">Admin</p>
            </div>
          )}

          {/* Edit actions - AHORA USA VideoActions MODIFICADO */}
          {video?.pendiente === false && auth.user && (auth.user._id === video.user?._id || isAdmin) && (
            <div className="tiktok-action-item">
              <VideoActions video={video} />
              <p className="tiktok-action-count">Actions</p>
            </div>
          )}

          {/* Like */}
          {video?.pendiente === false && (
            <div className="tiktok-action-item">
              <button className={`tiktok-action-btn ${liked ? 'tiktok-like-animation' : ''}`} onClick={handleLike}>
                {liked ? <HeartFill size={24} color="#ff4040" /> : <Heart size={24} />}
              </button>
              <p className="tiktok-action-count">{formatNumber(likesCount)}</p>
            </div>
          )}

          {/* Comments */}
          {video?.pendiente === false && (
            <div className="tiktok-action-item">
              <button className="tiktok-action-btn" onClick={() => setShowComments(!showComments)}>
                <Chat size={24} />
              </button>
              <p className="tiktok-action-count">{formatNumber(commentsCount)}</p>
            </div>
          )}

          {/* Save */}
          {video?.pendiente === false && (
            <div className="tiktok-action-item">
              <button className="tiktok-action-btn" onClick={handleSave}>
                {saved ? <BookmarkFill size={24} color="#ffd700" /> : <Bookmark size={24} />}
              </button>
              <p className="tiktok-action-count">Favoris</p>
            </div>
          )}

          {/* Share */}
          {video?.pendiente === false && (
            <div className="tiktok-action-item">
              <button className="tiktok-action-btn" onClick={handleShare}>
                <Share size={24} />
              </button>
              <p className="tiktok-action-count">Partager</p>
            </div>
          )}
        </div>

        {/* Información del video */}
        <div className="tiktok-video-info">
          <div className="tiktok-user-info">
            <img
              src={video?.user?.avatar || '/default-avatar.png'}
              alt={video?.user?.username}
              className="tiktok-avatar"
            />
            <div className="flex-grow-1">
              <strong className="tiktok-username">@{video?.user?.username}</strong>
              <div className="d-flex gap-3 small opacity-75">
                <span><Eye size={12} /> {formatNumber(video?.views)} vues</span>
                <span><Clock size={12} /> {moment(video?.createdAt).fromNow()}</span>
              </div>
            </div>
          </div>
          <h6 className="text-white mb-1">{video?.title}</h6>
          <p className="text-white opacity-75 small mb-2">{video?.description}</p>
        </div>
      </div>

      {/* Comments panel */}
      {video?.pendiente === false && (
        <div className={`tiktok-comments-panel ${showComments ? 'open' : ''}`}>
          <div className="tiktok-comments-header">
            <h6 className="tiktok-comments-title">{commentsCount} commentaires</h6>
            <button className="tiktok-close-comments" onClick={() => setShowComments(false)}>✕</button>
          </div>
          <VideoComments videoId={video?._id} comments={video?.comments || []} totalComments={commentsCount} />
        </div>
      )}
    </div>
  );
};

// Componente Bell
const BellIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

export default DetailVideoPage;