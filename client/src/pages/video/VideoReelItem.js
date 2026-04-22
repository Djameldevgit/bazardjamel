// components/Video/VideoReelItem.jsx - CON MENÚ DE TRES PUNTOS Y SIN CAPA OSCURA EXTRA
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Badge, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart,
  faComment,
  faBookmark,
  faShare,
  faVolumeHigh,
  faVolumeXmark,
  faEye,
  faClock,
  faMusic,
  faChevronDown,
  faXmark,
  faArrowLeft,
  faEllipsisVertical,
  faPen,
  faTrash,
  faFlag,
  faBan,
  faCheckCircle,
  faUserCheck,
  faUserSlash,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';
import {
  faHeart as faHeartRegular,
  faBookmark as faBookmarkRegular,
  faComment as faCommentRegular
} from '@fortawesome/free-regular-svg-icons';
import { likeVideo, shareVideo, deleteVideo } from '../../redux/actions/videoAction';
import { aprobarVideo, eliminarVideo } from '../../redux/actions/videoApproveAction';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import VideoComments from './VideoComments';
import moment from 'moment';
import 'moment/locale/fr';

const VideoReelItem = ({ video, isActive = false, onVisibilityChange, onVideoDeleted }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth, socket } = useSelector(state => state);
  const videoRef = useRef(null);
  const drawerRef = useRef(null);
  
  // Estados del video
  const [liked, setLiked] = useState(video.liked || false);
  const [likesCount, setLikesCount] = useState(video.likes?.length || 0);
  const [saved, setSaved] = useState(false);
  const [commentsCount, setCommentsCount] = useState(video.comments?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Estados para el arrastre interactivo
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  
  const isAdmin = auth.user?.role === 'admin' || auth.user?.role === 'moderator';
  const isOwner = auth.user?._id === video.user?._id;
  const isPending = video?.pendiente === true;
  
  moment.locale('fr');
  
  // Control de reproducción según visibilidad
  useEffect(() => {
    if (!videoRef.current) return;
    
    if (isActive && !showComments) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.log('Auto-play bloqueado:', e));
      onVisibilityChange?.(true);
    } else if (!isActive && !showComments) {
      videoRef.current.pause();
      setIsPlaying(false);
      onVisibilityChange?.(false);
    }
  }, [isActive, showComments, onVisibilityChange]);
  
  // Tracking de progreso
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
  
  // Socket.IO para comentarios
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
  
  // Manejar el inicio del arrastre
  const handleDragStart = (e) => {
    e.stopPropagation();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setStartY(clientY);
    setIsDragging(true);
    setDragOffset(0);
  };
  
  // Manejar el arrastre
  const handleDragMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    let delta = clientY - startY;
    
    if (delta < 0) delta = 0;
    const maxDrag = window.innerHeight * 0.6;
    const newOffset = Math.min(delta, maxDrag);
    setDragOffset(newOffset);
    
    if (drawerRef.current) {
      drawerRef.current.style.transform = `translateY(${newOffset}px)`;
    }
  };
  
  // Manejar el fin del arrastre
  const handleDragEnd = () => {
    setIsDragging(false);
    const threshold = window.innerHeight * 0.25;
    
    if (dragOffset > threshold) {
      handleCloseComments();
    } else {
      if (drawerRef.current) {
        drawerRef.current.style.transform = '';
      }
      setDragOffset(0);
    }
  };
  
  // Calcular el tamaño del video basado en el arrastre
  const getVideoScale = () => {
    if (!showComments) return 1;
    if (!isDragging && dragOffset === 0) return 0.7;
    
    const maxDrag = window.innerHeight * 0.6;
    const progressDrag = Math.min(dragOffset / maxDrag, 1);
    return 0.7 + (0.3 * progressDrag);
  };
  
  const getVideoTranslateY = () => {
    if (!showComments) return 0;
    if (!isDragging && dragOffset === 0) return -15;
    
    const maxDrag = window.innerHeight * 0.6;
    const progressDrag = Math.min(dragOffset / maxDrag, 1);
    return -15 * (1 - progressDrag);
  };
  
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
    
    const result = await dispatch(likeVideo(video._id, auth.token, auth, socket, video));
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
    heart.className = 'floating-heart';
    heart.innerHTML = '❤️';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
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
    
    await dispatch(shareVideo(video._id, auth.token, auth, socket, video));
  };
  
  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };
  
  const togglePlay = (e) => {
    e.stopPropagation();
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
    e.stopPropagation();
    if (videoRef.current && videoRef.current.duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * videoRef.current.duration;
    }
  };
  
  const handleOpenComments = () => {
    setShowComments(true);
    setDragOffset(0);
  };
  
  const handleCloseComments = () => {
    setShowComments(false);
    setDragOffset(0);
    if (drawerRef.current) {
      drawerRef.current.style.transform = '';
    }
  };
  
  const handleGoBack = () => {
    history.goBack();
  };
  
  // ============================================
  // ACCIONES DEL MENÚ DE TRES PUNTOS
  // ============================================
  
  // Editar video
  const handleEdit = () => {
    setShowMenu(false);
    history.push(`/edit-video/${video._id}`);
  };
  
  // Eliminar video (para owner o admin)
  const handleDeleteVideo = async () => {
    setShowMenu(false);
    if (!window.confirm('Supprimer cette vidéo ? Cette action est irréversible.')) return;
    
    setActionLoading(true);
    const result = await dispatch(deleteVideo(video._id, auth.token, auth, socket, video));
    setActionLoading(false);
    
    if (result?.success) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: 'Vidéo supprimée avec succès' }
      });
      if (onVideoDeleted) onVideoDeleted(video._id);
    }
  };
  
  // Aprobar video (solo admin)
  const handleApproveVideo = async () => {
    setShowMenu(false);
    if (!window.confirm(`Approuver la vidéo "${video.title}" ?`)) return;
    
    setActionLoading(true);
    const result = await dispatch(aprobarVideo(video._id, auth.token, auth, socket, video));
    setActionLoading(false);
    
    if (result?.success) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: 'Vidéo approuvée !' }
      });
      if (onVideoDeleted) onVideoDeleted(video._id);
    }
  };
  
  // Rechazar/eliminar video (solo admin)
  const handleRejectVideo = async () => {
    setShowMenu(false);
    if (!window.confirm(`Rejeter la vidéo "${video.title}" ?`)) return;
    
    setActionLoading(true);
    const result = await dispatch(eliminarVideo(video._id, auth.token, auth, socket, video));
    setActionLoading(false);
    
    if (result?.success) {
      dispatch({
        type: GLOBALTYPES.ALERT,
        payload: { success: 'Vidéo rejetée' }
      });
      if (onVideoDeleted) onVideoDeleted(video._id);
    }
  };
  
  // Denunciar video (para usuarios normales)
  const handleReportVideo = () => {
    setShowMenu(false);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { 
        info: 'Fonctionnalité de signalement disponible prochainement. Pour signaler cette vidéo, contactez le support.' 
      }
    });
  };
  
  // Bloquear usuario
  const handleBlockUser = () => {
    setShowMenu(false);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { 
        info: `L'utilisateur @${video.user?.username} a été bloqué.` 
      }
    });
  };
  
  // No me interesa
  const handleNotInterested = () => {
    setShowMenu(false);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { 
        info: 'Nous prendrons en compte votre retour pour améliorer vos recommandations.' 
      }
    });
    if (onVideoDeleted) onVideoDeleted(video._id);
  };
  
  const formatNumber = (num) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };
  
  const videoScale = getVideoScale();
  const videoTranslateY = getVideoTranslateY();
  
  return (
    <div className="video-reel-container" style={{
      height: '100vh',
      scrollSnapAlign: 'start',
      position: 'relative',
      backgroundColor: '#000',
      overflow: 'hidden'
    }}>
      {/* Header con botón de regreso y menú de tres puntos - SIN CAPA OSCURA EXTRA */}
      <div className="reel-header" style={{
        position: 'absolute',
        top: '80px',
        left: 0,
        right: 0,
        zIndex: 30,
        padding: '16px',
        background: 'transparent',  // ← Eliminado el gradiente oscuro
        pointerEvents: 'none',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Botón de regreso (flecha izquierda) */}
        <Button 
          variant="link" 
          className="text-white p-0"
          onClick={handleGoBack}
          style={{ 
            textDecoration: 'none', 
            pointerEvents: 'auto',
            background: 'transparent',  // ← Sin fondo
            border: 'none'
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} size="lg" />
        </Button>
        
        {/* ============================================ */}
        {/* BOTÓN DE TRES PUNTOS (⋮) - SIN CAPA OSCURA */}
        {/* ============================================ */}
        {!showComments && (
          <Dropdown show={showMenu} onToggle={setShowMenu} align="end">
            <Dropdown.Toggle 
              variant="link" 
              className="text-white p-0"
              style={{ 
                pointerEvents: 'auto',
                textDecoration: 'none',
                background: 'transparent',  // ← Eliminado el fondo oscuro
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <FontAwesomeIcon icon={faEllipsisVertical} size="lg" />
            </Dropdown.Toggle>
            
            <Dropdown.Menu 
              align="end"
              style={{
                background: '#1a1a1a',
                border: '1px solid #333',
                borderRadius: '12px',
                minWidth: '200px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
              }}
            >
              {/* Opciones para ADMIN */}
              {isAdmin && isPending && (
                <>
                  <Dropdown.Item 
                    onClick={handleApproveVideo}
                    style={{ color: '#4caf50', padding: '10px 16px' }}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} className="me-2" />
                    Approuver la vidéo
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={handleRejectVideo}
                    style={{ color: '#f44336', padding: '10px 16px' }}
                  >
                    <FontAwesomeIcon icon={faBan} className="me-2" />
                    Rejeter la vidéo
                  </Dropdown.Item>
                  <Dropdown.Divider style={{ borderColor: '#333' }} />
                </>
              )}
              
              {/* Opciones para OWNER o ADMIN */}
              {(isOwner || isAdmin) && !isPending && (
                <>
                  <Dropdown.Item 
                    onClick={handleEdit}
                    style={{ color: '#fff', padding: '10px 16px' }}
                  >
                    <FontAwesomeIcon icon={faPen} className="me-2" />
                    Modifier
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={handleDeleteVideo}
                    style={{ color: '#f44336', padding: '10px 16px' }}
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-2" />
                    Supprimer
                  </Dropdown.Item>
                  <Dropdown.Divider style={{ borderColor: '#333' }} />
                </>
              )}
              
              {/* Opciones para ADMIN en videos aprobados */}
              {isAdmin && !isPending && (
                <>
                  <Dropdown.Item 
                    onClick={handleDeleteVideo}
                    style={{ color: '#f44336', padding: '10px 16px' }}
                  >
                    <FontAwesomeIcon icon={faTrash} className="me-2" />
                    Supprimer (Admin)
                  </Dropdown.Item>
                  <Dropdown.Divider style={{ borderColor: '#333' }} />
                </>
              )}
              
              {/* Opciones para USUARIOS NORMALES */}
              {!isOwner && !isAdmin && !isPending && (
                <>
                  <Dropdown.Item 
                    onClick={handleReportVideo}
                    style={{ color: '#ff9800', padding: '10px 16px' }}
                  >
                    <FontAwesomeIcon icon={faFlag} className="me-2" />
                    Signaler la vidéo
                  </Dropdown.Item>
                  <Dropdown.Item 
                    onClick={handleBlockUser}
                    style={{ color: '#f44336', padding: '10px 16px' }}
                  >
                    <FontAwesomeIcon icon={faUserSlash} className="me-2" />
                    Bloquer @{video.user?.username}
                  </Dropdown.Item>
                </>
              )}
              
              {/* Opción "No me interesa" para todos los usuarios */}
              {!isPending && (
                <>
                  <Dropdown.Divider style={{ borderColor: '#333' }} />
                  <Dropdown.Item 
                    onClick={handleNotInterested}
                    style={{ color: '#888', padding: '10px 16px' }}
                  >
                    <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
                    Pas intéressé(e)
                  </Dropdown.Item>
                </>
              )}
            </Dropdown.Menu>
          </Dropdown>
        )}
      </div>
      
      {/* Banner de advertencia para admin */}
      {isPending && isAdmin && (
        <div className="admin-pending-banner" style={{
          position: 'absolute',
          top: 60,
          left: 0,
          right: 0,
          zIndex: 30,
          backgroundColor: '#ff9800',
          color: '#fff',
          padding: '8px 12px',
          textAlign: 'center',
          fontSize: '12px'
        }}>
          <strong>Mode Admin:</strong> Vidéo en attente d'approbation
        </div>
      )}
      
      {/* ============================================ */}
      {/* EL VIDEO */}
      {/* ============================================ */}
      <div 
        className="video-main-wrapper"
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          transform: showComments 
            ? `scale(${videoScale}) translateY(${videoTranslateY}%)`
            : 'scale(1) translateY(0)',
          transformOrigin: 'top center',
          transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
          cursor: 'pointer'
        }}
        onDoubleClick={handleDoubleClick}
      >
        <video
          ref={videoRef}
          src={video.videoUrl}
          loop
          muted={isMuted}
          playsInline
          className="reel-video"
          onClick={togglePlay}
          poster={video.thumbnail}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }}
        />
        
        {/* Barra de progreso */}
        {!showComments && (
          <div 
            className="progress-bar"
            onClick={handleProgressClick}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'rgba(255,255,255,0.3)',
              cursor: 'pointer',
              zIndex: 20
            }}
          >
            <div 
              className="progress-fill"
              style={{
                width: `${progress}%`,
                height: '100%',
                background: '#ff4040',
                transition: 'width 0.1s linear'
              }}
            />
          </div>
        )}
        
        {/* ============================================ */}
        {/* SIDEBAR DE ACCIONES */}
        {/* ============================================ */}
        {!showComments && (
          <div className="actions-sidebar" style={{
            position: 'absolute',
            right: 12,
            bottom: 120,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            zIndex: 20
          }}>
            {/* Like */}
            <div className="action-item" style={{ textAlign: 'center' }}>
              <button
                onClick={handleLike}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FontAwesomeIcon 
                  icon={liked ? faHeart : faHeartRegular} 
                  size="xl" 
                  color={liked ? '#ff4040' : 'white'} 
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                />
              </button>
              <p style={{ fontSize: 11, marginTop: 4, color: 'white' }}>{formatNumber(likesCount)}</p>
            </div>
            
            {/* Comments */}
            <div className="action-item" style={{ textAlign: 'center' }}>
              <button
                onClick={handleOpenComments}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FontAwesomeIcon 
                  icon={faCommentRegular} 
                  size="xl" 
                  color="white" 
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                />
              </button>
              <p style={{ fontSize: 11, marginTop: 4, color: 'white' }}>{formatNumber(commentsCount)}</p>
            </div>
            
            {/* Save */}
            <div className="action-item" style={{ textAlign: 'center' }}>
              <button
                onClick={handleSave}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FontAwesomeIcon 
                  icon={saved ? faBookmark : faBookmarkRegular} 
                  size="xl" 
                  color={saved ? '#ffd700' : 'white'} 
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                />
              </button>
              <p style={{ fontSize: 11, marginTop: 4, color: 'white' }}>Favoris</p>
            </div>
            
            {/* Share */}
            <div className="action-item" style={{ textAlign: 'center' }}>
              <button
                onClick={handleShare}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FontAwesomeIcon 
                  icon={faShare} 
                  size="xl" 
                  color="white" 
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                />
              </button>
              <p style={{ fontSize: 11, marginTop: 4, color: 'white' }}>Partager</p>
            </div>
          </div>
        )}
        
        {/* ============================================ */}
        {/* CONTROL DE VOLUMEN */}
        {/* ============================================ */}
        {!showComments && (
          <button
            onClick={toggleMute}
            className="volume-control"
            style={{
              position: 'absolute',
              bottom: 30,
              right: 16,
              background: 'rgba(0,0,0,0.5)',
              border: 'none',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              cursor: 'pointer',
              zIndex: 20,
              backdropFilter: 'blur(4px)',
              transition: 'all 0.2s ease'
            }}
          >
            <FontAwesomeIcon 
              icon={isMuted ? faVolumeXmark : faVolumeHigh} 
              size="sm" 
            />
          </button>
        )}
        
        {/* ============================================ */}
        {/* INFORMACIÓN DEL VIDEO */}
        {/* ============================================ */}
        {!showComments && (
          <div className="video-info" style={{
            position: 'absolute',
            left: 16,
            bottom: 100,
            color: 'white',
            zIndex: 20,
            maxWidth: '60%'
          }}>
            {isPending && isAdmin && (
              <Badge bg="warning" className="mb-2" style={{ display: 'inline-block' }}>
                ⏳ En attente
              </Badge>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <img
                src={video.user?.avatar || '/default-avatar.png'}
                alt={video.user?.username}
                onClick={() => history.push(`/profile/${video.user?._id}`)}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  border: '2px solid white',
                  cursor: 'pointer'
                }}
              />
              <div>
                <strong style={{ cursor: 'pointer', fontSize: 15 }}>@{video.user?.username}</strong>
                <div style={{ display: 'flex', gap: 8, fontSize: 11, opacity: 0.8 }}>
                  <span><FontAwesomeIcon icon={faEye} size="xs" /> {formatNumber(video.views)}</span>
                  <span><FontAwesomeIcon icon={faClock} size="xs" /> {moment(video.createdAt).fromNow()}</span>
                </div>
              </div>
              {!isPending && (
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  style={{
                    background: '#ff4040',
                    border: 'none',
                    color: 'white',
                    padding: '5px 14px',
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {isFollowing ? 'Suivi' : 'Suivre'}
                </button>
              )}
            </div>
            
            <h6 style={{ fontSize: 13, margin: 0 }}>{video.title}</h6>
            <p style={{ fontSize: 12, marginBottom: 4, opacity: 0.8 }}>{video.description}</p>
            
            {video.tags && video.tags.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, opacity: 0.8 }}>
                <FontAwesomeIcon icon={faMusic} size="xs" />
                <span>{video.tags.slice(0, 2).join(' • ')}</span>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* ============================================ */}
      {/* MODAL DE COMENTARIOS */}
      {/* ============================================ */}
      {showComments && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          pointerEvents: 'auto'
        }}>
          <div 
            onClick={handleCloseComments}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'transparent',
              pointerEvents: 'auto'
            }}
          />
          
          <div 
            ref={drawerRef}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            style={{
              position: 'relative',
              background: '#121212',
              borderRadius: '20px 20px 0 0',
              height: 'calc(55vh + 40px)',
              display: 'flex',
              flexDirection: 'column',
              transform: dragOffset > 0 ? `translateY(${dragOffset}px)` : 'translateY(0)',
              transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
              cursor: 'grab',
              zIndex: 1001
            }}
          >
            <div 
              className="drawer-handle" 
              style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                padding: '12px 0 8px',
                cursor: 'grab'
              }}
            >
              <div style={{ width: 40, height: 4, background: '#555', borderRadius: 2 }} />
            </div>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 16px 12px',
              borderBottom: '1px solid #2a2a2a'
            }}>
              <h5 style={{ color: 'white', margin: 0, fontSize: 16 }}>{commentsCount} commentaires</h5>
              <button 
                onClick={handleCloseComments}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: 8,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <FontAwesomeIcon icon={faXmark} size="lg" />
              </button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
              <VideoComments 
                videoId={video._id}
                comments={video.comments || []}
                totalComments={commentsCount}
              />
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        .floating-heart {
          position: fixed;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          font-size: 64px;
          animation: floatUp 0.6s ease-out forwards;
          pointer-events: none;
          z-index: 1000;
        }
        
        @keyframes floatUp {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.5);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -150%) scale(1.5);
          }
        }
        
        .dropdown-menu {
          background: #1a1a1a !important;
        }
        
        .dropdown-item:hover {
          background: #2a2a2a !important;
        }
        
        .drawer-handle:active,
        .comments-drawer:active {
          cursor: grabbing;
        }
        
        @media (max-width: 768px) {
          .comments-drawer {
            height: 60vh;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoReelItem;