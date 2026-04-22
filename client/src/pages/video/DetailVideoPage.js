// components/Video/DetailVideoPage.jsx - Versión completa con soporte para admin
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Badge, Spinner, Alert, Card, Row, Col } from 'react-bootstrap';
import {
  Heart,
  HeartFill,
  Eye,
  Clock,
  Share,
  Bookmark,
  BookmarkFill,
  ArrowLeft,
  MusicNote,
  Chat,
  VolumeUp,
  VolumeMute,
  CheckCircle,
  Trash,
  ShieldLock,
  Person,
  Calendar,
  Tag,
  Film,
  GeoAlt,
  Envelope,
  Telephone,
  GraphUp,
  People,
  ChatDots,
  ShareFill
} from 'react-bootstrap-icons';
import { getVideoById, likeVideo, getRelatedVideos, VIDEO_TYPES } from '../../redux/actions/videoAction';
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
  const { currentVideo: video, loading, relatedVideos = [] } = useSelector(state => state.video || {});
  
  // Estados del video
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAdminInfo, setShowAdminInfo] = useState(true);
  
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  
  moment.locale('fr');

  // ✅ Verificar si el usuario es admin
  const isAdmin = auth.user?.role === 'admin' || auth.user?.role === 'moderator';
  
  // ✅ Verificar si el video está pendiente
  const isPending = video?.pendiente === true;
  
  // ✅ Verificar si el usuario puede editar el video
  const canEdit = auth.user && video && (
    auth.user._id === video.user?._id ||
    isAdmin
  );

  // Efecto para obtener datos del video
  useEffect(() => {
    if (id) {
      dispatch(getVideoById(id));
      if (!isPending) {
        dispatch(getRelatedVideos(id));
      }
    }
  }, [dispatch, id, isPending]);

  // Efecto para actualizar estados cuando cambia el video
  useEffect(() => {
    if (video) {
      setLiked(video.liked || false);
      setLikesCount(video.likes?.length || 0);
      setCommentsCount(video.comments?.length || 0);
    }
  }, [video]);

  // Socket.IO: Escuchar actualizaciones de comentarios (solo si video aprobado)
  useEffect(() => {
    if (!socket || !video || isPending) return;
    
    socket.emit('join-video-room', video._id);
    
    socket.on('new-comment', (data) => {
      if (data.videoId === video._id) {
        setCommentsCount(prev => prev + 1);
      }
    });
    
    socket.on('comment-deleted', (data) => {
      if (data.videoId === video._id) {
        setCommentsCount(prev => Math.max(0, prev - 1));
      }
    });
    
    return () => {
      socket.emit('leave-video-room', video._id);
      socket.off('new-comment');
      socket.off('comment-deleted');
    };
  }, [socket, video, isPending]);

  // Tracking de scroll para header
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tracking de progreso del video
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      if (videoElement.duration) {
        const currentProgress = (videoElement.currentTime / videoElement.duration) * 100;
        setProgress(currentProgress);
      }
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    return () => videoElement.removeEventListener('timeupdate', handleTimeUpdate);
  }, []);

  const handleLike = async () => {
    if (!auth.token) {
      history.push('/login');
      return;
    }
    
    if (isPending) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: 'Ce vidéo est en attente d\'approbation' }
      });
      return;
    }
    
    const result = await dispatch(likeVideo(video._id, auth.token));
    if (result?.liked !== undefined) {
      setLiked(result.liked);
      setLikesCount(result.likes);
      
      if (result.liked) {
        createHeartEffect();
      }
    }
  };

  const createHeartEffect = () => {
    const heart = document.createElement('div');
    heart.className = 'tiktok-heart-burst';
    heart.innerHTML = '❤️';
    heart.style.left = '50%';
    heart.style.top = '50%';
    heart.style.position = 'fixed';
    heart.style.fontSize = '48px';
    heart.style.transform = 'translate(-50%, -50%)';
    heart.style.zIndex = '1000';
    heart.style.pointerEvents = 'none';
    document.body.appendChild(heart);
    
    setTimeout(() => {
      heart.remove();
    }, 500);
  };

  const handleDoubleClick = (e) => {
    e.stopPropagation();
    if (!liked && !isPending) {
      handleLike();
    }
  };

  const handleSave = () => {
    if (!auth.token) {
      history.push('/login');
      return;
    }
    
    if (isPending) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { error: 'Ce vidéo est en attente d\'approbation' }
      });
      return;
    }
    
    setSaved(!saved);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: saved ? 'Retiré des favoris' : 'Ajouté aux favoris' }
    });
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/video/${video?._id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: video?.title,
          text: video?.description,
          url: shareUrl
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: 'Lien copié dans le presse-papier !' }
      });
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
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
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

  const handleVideoUpdate = (updatedVideo) => {
    dispatch({ type: VIDEO_TYPES.GET_VIDEO, payload: updatedVideo });
  };
  
  const handleVideoDelete = () => {
    history.push('/videos/1');
  };

  // ========== FUNCIÓN DE REGRESO INTELIGENTE ==========
  const handleGoBack = () => {
    if (isAdmin && isPending) {
      history.push('/admin/posts?tab=videos');
    } else {
      history.goBack();
    }
  };

  // ========== ACCIONES DE ADMIN ==========
  const showAdminMessage = (text, type) => {
    // Usar el alert global en lugar de estado local
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { [type]: text }
    });
  };

  const handleApprove = async () => {
    if (!isAdmin) return;
    if (!window.confirm(`Approuver la vidéo "${video?.title}" ? Elle sera visible sur le site.`)) return;
    
    setActionLoading(true);
    const result = await dispatch(aprobarVideo(video._id, auth.token));
    setActionLoading(false);
    
    if (result?.success) {
      showAdminMessage('Vidéo approuvée avec succès', 'success');
      setTimeout(() => {
        history.push('/admin/posts?tab=videos');
      }, 1500);
    } else {
      showAdminMessage(result?.error || 'Erreur lors de l\'approbation', 'error');
    }
  };
  
  const handleDelete = async () => {
    if (!isAdmin) return;
    if (!window.confirm(`Supprimer définitivement la vidéo "${video?.title}" ? Cette action est irréversible.`)) return;
    
    setActionLoading(true);
    const result = await dispatch(eliminarVideo(video._id, auth.token));
    setActionLoading(false);
    
    if (result?.success) {
      showAdminMessage('Vidéo supprimée', 'warning');
      setTimeout(() => {
        history.push('/admin/posts?tab=videos');
      }, 1500);
    } else {
      showAdminMessage(result?.error || 'Erreur lors de la suppression', 'error');
    }
  };

  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDuration = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading || !video) {
    return (
      <div className="tiktok-loader">
        <div className="tiktok-spinner"></div>
      </div>
    );
  }

  return (
    <div className="tiktok-container">
      {/* Banner de advertencia para admin si video pendiente */}
      {isPending && isAdmin && (
        <div className="admin-pending-banner" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2000,
          backgroundColor: '#ff9800',
          color: '#fff',
          padding: '12px',
          textAlign: 'center',
          fontSize: '14px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}>
          <ShieldLock className="me-2" size={16} />
          <strong>Mode Admin:</strong> Cette vidéo est en attente d'approbation. Elle n'est pas visible par les utilisateurs.
          <Button 
            variant="link" 
            size="sm" 
            className="text-white ms-3"
            onClick={handleGoBack}
            style={{ textDecoration: 'underline' }}
          >
            ← Retour à la liste
          </Button>
        </div>
      )}
      
      {/* Header estilo TikTok con botón de regreso inteligente */}
      <div className={`tiktok-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="d-flex justify-content-between align-items-center">
          <Button 
            variant="link" 
            className="text-white p-0"
            onClick={handleGoBack}
          >
            <ArrowLeft size={24} />
          </Button>
          <h6 className="text-white mb-0">
            {isPending && isAdmin ? '🔒 Prévisualisation Admin' : 'Vidéos'}
          </h6>
          <div style={{ width: 24 }}></div>
        </div>
      </div>

      {/* Contenedor principal del video */}
      <div 
        className="tiktok-video-container"
        onDoubleClick={handleDoubleClick}
      >
        {/* Video Player */}
        {video.videoType === 'local' ? (
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
            src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&loop=1&mute=${isMuted ? 1 : 0}&controls=0`}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="tiktok-video"
          />
        )}

        {/* Barra de progreso */}
        <div 
          ref={progressBarRef}
          className="tiktok-progress-bar"
          onClick={handleProgressClick}
        >
          <div className="tiktok-progress" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Control de volumen */}
        <button
          onClick={toggleMute}
          className="tiktok-volume-control"
        >
          {isMuted ? <VolumeMute size={20} /> : <VolumeUp size={20} />}
        </button>

        {/* ✅ Sidebar de acciones (derecha) */}
        <div className="tiktok-actions-sidebar">
          {/* Acciones de admin (aprobar/eliminar) - solo para admin con video pendiente */}
          {isAdmin && isPending && (
            <div className="tiktok-action-item">
              <div className="d-flex flex-column gap-2">
                <button
                  className="tiktok-action-btn bg-success bg-opacity-25 rounded-circle p-2"
                  onClick={handleApprove}
                  disabled={actionLoading}
                  style={{ border: 'none', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Approuver la vidéo"
                >
                  <CheckCircle size={24} color="#4caf50" />
                </button>
                <button
                  className="tiktok-action-btn bg-danger bg-opacity-25 rounded-circle p-2"
                  onClick={handleDelete}
                  disabled={actionLoading}
                  style={{ border: 'none', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  title="Supprimer définitivement"
                >
                  <Trash size={24} color="#f44336" />
                </button>
              </div>
              <p className="tiktok-action-count">Admin</p>
            </div>
          )}

          {/* Editar/Eliminar - Solo para dueño del video */}
          {canEdit && !isPending && (
            <div className="tiktok-action-item">
              <VideoActions 
                video={video} 
                onVideoUpdate={handleVideoUpdate}
                onVideoDelete={handleVideoDelete}
              />
              <p className="tiktok-action-count">Actions</p>
            </div>
          )}

          {/* Like - solo si video aprobado */}
          {!isPending && (
            <div className="tiktok-action-item">
              <button
                id="like-animation"
                className={`tiktok-action-btn ${liked ? 'tiktok-like-animation' : ''}`}
                onClick={handleLike}
              >
                {liked ? <HeartFill size={24} color="#ff4040" /> : <Heart size={24} />}
              </button>
              <p className="tiktok-action-count">{formatNumber(likesCount)}</p>
            </div>
          )}

          {/* Comments - solo si video aprobado */}
          {!isPending && (
            <div className="tiktok-action-item">
              <button
                className="tiktok-action-btn"
                onClick={() => setShowComments(!showComments)}
              >
                <Chat size={24} />
              </button>
              <p className="tiktok-action-count">{formatNumber(commentsCount)}</p>
            </div>
          )}

          {/* Save - solo si video aprobado */}
          {!isPending && (
            <div className="tiktok-action-item">
              <button
                className="tiktok-action-btn"
                onClick={handleSave}
              >
                {saved ? <BookmarkFill size={24} color="#ffd700" /> : <Bookmark size={24} />}
              </button>
              <p className="tiktok-action-count">Favoris</p>
            </div>
          )}

          {/* Share - solo si video aprobado */}
          {!isPending && (
            <div className="tiktok-action-item">
              <button
                className="tiktok-action-btn"
                onClick={handleShare}
              >
                <Share size={24} />
              </button>
              <p className="tiktok-action-count">Partager</p>
            </div>
          )}
        </div>

        {/* Información del video */}
        <div className="tiktok-video-info">
          {/* Badge de estado para admin */}
          {isPending && isAdmin && (
            <Badge bg="warning" className="mb-2" style={{ display: 'inline-block' }}>
              ⏳ En attente d'approbation
            </Badge>
          )}
          
          <div className="tiktok-user-info">
            <img
              src={video.user?.avatar || '/default-avatar.png'}
              alt={video.user?.username}
              className="tiktok-avatar"
              onClick={() => history.push(`/profile/${video.user?._id}`)}
              style={{ cursor: 'pointer' }}
            />
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-2">
                <strong 
                  className="tiktok-username"
                  onClick={() => history.push(`/profile/${video.user?._id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  @{video.user?.username}
                </strong>
                {video.user?.isPro && <Badge bg="primary" size="sm">Pro</Badge>}
                {isAdmin && video.user?.role === 'admin' && <Badge bg="danger" size="sm">Admin</Badge>}
              </div>
              <div className="d-flex align-items-center gap-3 small opacity-75">
                <span><Eye size={12} /> {formatNumber(video.views)} vues</span>
                <span><Clock size={12} /> {moment(video.createdAt).fromNow()}</span>
              </div>
            </div>
            {!isPending && (
              <button
                className={`tiktok-follow-btn ${isFollowing ? 'following' : ''}`}
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? 'Suivi' : 'Suivre'}
              </button>
            )}
          </div>

          <h6 className="text-white mb-1">{video.title}</h6>
          <p className="text-white opacity-75 small mb-2">{video.description}</p>

          {video.tags && video.tags.length > 0 && (
            <div className="d-flex align-items-center gap-2 small opacity-75">
              <MusicNote size={14} />
              <span>Son original - {video.tags.slice(0, 2).join(' • ')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Panel de comentarios - solo si video aprobado */}
      {!isPending && (
        <div className={`tiktok-comments-panel ${showComments ? 'open' : ''}`}>
          <div className="tiktok-comments-header">
            <h6 className="tiktok-comments-title">{commentsCount} commentaires</h6>
            <button
              className="tiktok-close-comments"
              onClick={() => setShowComments(false)}
            >
              ✕
            </button>
          </div>
          
          <VideoComments 
            videoId={video._id}
            comments={video.comments || []}
            totalComments={commentsCount}
          />
        </div>
      )}

      {/* Panel de información para admin (desplegable) */}
      {isAdmin && isPending && showAdminInfo && (
        <div className="admin-info-panel" style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
          maxWidth: '320px',
          backgroundColor: '#1a1a2e',
          borderRadius: '12px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
          overflow: 'hidden'
        }}>
          <div className="d-flex justify-content-between align-items-center p-3" style={{ backgroundColor: '#16213e', borderBottom: '1px solid #0f3460' }}>
            <strong className="text-white"><ShieldLock size={14} className="me-2" />Infos Admin</strong>
            <Button variant="link" size="sm" className="text-white p-0" onClick={() => setShowAdminInfo(false)}>
              ✕
            </Button>
          </div>
          <div className="p-3" style={{ fontSize: '12px' }}>
            <div className="mb-2">
              <Person size={12} className="me-2 text-info" />
              <strong>ID:</strong> <span className="text-muted">{video._id}</span>
            </div>
            <div className="mb-2">
              <Film size={12} className="me-2 text-info" />
              <strong>Type:</strong> <span className="text-muted">{video.videoType}</span>
            </div>
            <div className="mb-2">
              <Clock size={12} className="me-2 text-info" />
              <strong>Durée:</strong> <span className="text-muted">{formatDuration(video.duration)}</span>
            </div>
            <div className="mb-2">
              <Calendar size={12} className="me-2 text-info" />
              <strong>Créé le:</strong> <span className="text-muted">{moment(video.createdAt).format('DD/MM/YYYY HH:mm')}</span>
            </div>
            <div className="mb-2">
              <Tag size={12} className="me-2 text-info" />
              <strong>Catégorie:</strong> <span className="text-muted">{video.category}</span>
            </div>
            <div className="mb-2">
              <GraphUp size={12} className="me-2 text-info" />
              <strong>Engagement:</strong> <span className="text-muted">{video.engagementScore?.toFixed(1) || 0}%</span>
            </div>
            <hr className="my-2" style={{ borderColor: '#0f3460' }} />
            <div className="mb-2">
              <Person size={12} className="me-2 text-warning" />
              <strong>User ID:</strong> <span className="text-muted">{video.user?._id}</span>
            </div>
            <div className="mb-2">
              <Envelope size={12} className="me-2 text-warning" />
              <strong>Email:</strong> <span className="text-muted">{video.user?.email || 'N/A'}</span>
            </div>
            <div className="mb-2">
              <Telephone size={12} className="me-2 text-warning" />
              <strong>Téléphone:</strong> <span className="text-muted">{video.user?.phone || 'N/A'}</span>
            </div>
            <hr className="my-2" style={{ borderColor: '#0f3460' }} />
            <div className="d-flex justify-content-between">
              <div><People size={12} className="me-1" /> {formatNumber(video.uniqueViews?.length || 0)}</div>
              <div><Heart size={12} className="me-1" /> {formatNumber(video.likes?.length || 0)}</div>
              <div><ChatDots size={12} className="me-1" /> {formatNumber(video.comments?.length || 0)}</div>
              <div><ShareFill size={12} className="me-1" /> {formatNumber(video.shares?.length || 0)}</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Botón para mostrar panel admin si estaba cerrado */}
      {isAdmin && isPending && !showAdminInfo && (
        <button
          onClick={() => setShowAdminInfo(true)}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000,
            backgroundColor: '#16213e',
            border: 'none',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}
          title="Afficher infos admin"
        >
          <ShieldLock size={24} color="#ff9800" />
        </button>
      )}
    </div>
  );
};

export default DetailVideoPage;