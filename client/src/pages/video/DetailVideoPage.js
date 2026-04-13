// components/Video/DetailVideoPage.jsx - Versión con acciones en sidebar
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { Button, Badge, Spinner } from 'react-bootstrap';
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
  VolumeMute
} from 'react-bootstrap-icons';
import { getVideoById, likeVideo, getRelatedVideos, VIDEO_TYPES } from '../../redux/actions/videoAction';
import VideoActions from './VideoActions';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import moment from 'moment';
import 'moment/locale/fr';
import VideoComments from './VideoComments';
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
  
  const videoRef = useRef(null);
  const progressBarRef = useRef(null);
  
  moment.locale('fr');

  // ✅ Calcular si el usuario puede editar el video
  const canEdit = auth.user && video && (
    auth.user._id === video.user?._id ||
    auth.user.role === 'admin' ||
    auth.user.role === 'moderator'
  );

  // Efecto para obtener datos del video
  useEffect(() => {
    if (id) {
      dispatch(getVideoById(id));
      dispatch(getRelatedVideos(id));
    }
  }, [dispatch, id]);

  // Efecto para actualizar estados cuando cambia el video
  useEffect(() => {
    if (video) {
      setLiked(video.liked || false);
      setLikesCount(video.likes?.length || 0);
      setCommentsCount(video.comments?.length || 0);
    }
  }, [video]);

  // Socket.IO: Escuchar actualizaciones de comentarios
  useEffect(() => {
    if (!socket || !video) return;
    
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
  }, [socket, video]);

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
    if (!liked) {
      handleLike();
    }
  };

  const handleSave = () => {
    if (!auth.token) {
      history.push('/login');
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

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
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
      {/* Header estilo TikTok - simplificado */}
      <div className={`tiktok-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="d-flex justify-content-between align-items-center">
          <Button 
            variant="link" 
            className="text-white p-0"
            onClick={() => history.goBack()}
          >
            <ArrowLeft size={24} />
          </Button>
          <h6 className="text-white mb-0">Vidéos</h6>
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

        {/* ✅ Sidebar de acciones (derecha) - CON BOTÓN DE EDICIÓN */}
        <div className="tiktok-actions-sidebar">
          {/* Editar/Eliminar - Solo para dueño o admin */}
          {canEdit && (
            <div className="tiktok-action-item">
              <VideoActions 
                video={video} 
                onVideoUpdate={handleVideoUpdate}
                onVideoDelete={handleVideoDelete}
              />
              <p className="tiktok-action-count">Actions</p>
            </div>
          )}

          {/* Like */}
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

          {/* Comments */}
          <div className="tiktok-action-item">
            <button
              className="tiktok-action-btn"
              onClick={() => setShowComments(!showComments)}
            >
              <Chat size={24} />
            </button>
            <p className="tiktok-action-count">{formatNumber(commentsCount)}</p>
          </div>

          {/* Save */}
          <div className="tiktok-action-item">
            <button
              className="tiktok-action-btn"
              onClick={handleSave}
            >
              {saved ? <BookmarkFill size={24} color="#ffd700" /> : <Bookmark size={24} />}
            </button>
            <p className="tiktok-action-count">Favoris</p>
          </div>

          {/* Share */}
          <div className="tiktok-action-item">
            <button
              className="tiktok-action-btn"
              onClick={handleShare}
            >
              <Share size={24} />
            </button>
            <p className="tiktok-action-count">Partager</p>
          </div>
        </div>

        {/* Información del video */}
        <div className="tiktok-video-info">
          <div className="tiktok-user-info">
            <img
              src={video.user?.avatar || '/default-avatar.png'}
              alt={video.user?.username}
              className="tiktok-avatar"
              onClick={() => history.push(`/profile/${video.user?._id}`)}
            />
            <div className="flex-grow-1">
              <div className="d-flex align-items-center gap-2">
                <strong 
                  className="tiktok-username"
                  onClick={() => history.push(`/profile/${video.user?._id}`)}
                >
                  @{video.user?.username}
                </strong>
                {video.user?.isPro && <Badge bg="primary" size="sm">Pro</Badge>}
              </div>
              <div className="d-flex align-items-center gap-3 small opacity-75">
                <span><Eye size={12} /> {formatNumber(video.views)} vues</span>
                <span><Clock size={12} /> {moment(video.createdAt).fromNow()}</span>
              </div>
            </div>
            <button
              className={`tiktok-follow-btn ${isFollowing ? 'following' : ''}`}
              onClick={() => setIsFollowing(!isFollowing)}
            >
              {isFollowing ? 'Suivi' : 'Suivre'}
            </button>
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

      {/* Panel de comentarios */}
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
    </div>
  );
};

export default DetailVideoPage;