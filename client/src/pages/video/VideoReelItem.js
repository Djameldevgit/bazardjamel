// components/Video/VideoReelItem.jsx - CON FLECHAS DE NAVEGACIÓN
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHeart, faComment, faBookmark, faShare,
  faVolumeHigh, faVolumeXmark, faEye, faClock,
  faMusic, faXmark, faArrowLeft, faEllipsisVertical,
  faPen, faTrash, faFlag, faBan, faCheckCircle,
  faUserSlash, faExclamationTriangle, faExternalLinkAlt,
  faChevronUp, faChevronDown  // ← NUEVAS FLECHAS
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

/* ─── Design tokens ─────────────────────────────────────── */
const T = {
  accent:       '#ff3b5c',
  accentFollow: '#ff3b5c',
  white:        '#ffffff',
  glass:        'rgba(255,255,255,0.10)',
  glassBorder:  'rgba(255,255,255,0.18)',
  overlay:      'rgba(0,0,0,0.55)',
  textPrimary:  'rgba(255,255,255,0.95)',
  textMuted:    'rgba(255,255,255,0.55)',
  textDim:      'rgba(255,255,255,0.35)',
  adminBg:      'rgba(255,152,0,0.14)',
  adminBorder:  'rgba(255,152,0,0.40)',
  adminColor:   '#ff9800',
  approveBg:    'rgba(76,175,80,0.15)',
  approveBorder:'rgba(76,175,80,0.40)',
  approveColor: '#4caf50',
  rejectBg:     'rgba(244,67,54,0.15)',
  rejectBorder: 'rgba(244,67,54,0.40)',
  rejectColor:  '#f44336',
  menuBg:       '#161616',
  menuBorder:   'rgba(255,255,255,0.10)',
  radius:       '14px',
  radiusSm:     '10px',
  radiusXs:     '8px',
};

/* ─── Helpers ────────────────────────────────────────────── */
const iconBtn = (extra = {}) => ({
  background: T.glass,
  border: `0.5px solid ${T.glassBorder}`,
  borderRadius: '50%',
  width: 34,
  height: 34,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: T.white,
  transition: 'background 0.18s ease, transform 0.12s ease',
  ...extra,
});

const actionBtn = () => ({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  width: 44,
  height: 44,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  transition: 'background 0.18s ease, transform 0.1s ease',
  color: T.white,
});

// ✅ Botón de navegación pequeño
const navBtn = () => ({
  background: T.glass,
  border: `0.5px solid ${T.glassBorder}`,
  borderRadius: '50%',
  width: 36,
  height: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  color: T.white,
  transition: 'background 0.18s ease, transform 0.12s ease',
});

/* ════════════════════════════════════════════════════════════
   COMPONENT
   ════════════════════════════════════════════════════════════ */
const VideoReelItem = ({ 
  video, 
  isActive = false, 
  onVisibilityChange, 
  onVideoDeleted,
  onNextVideo,      // ← NUEVA PROPS para navegar al siguiente video
  onPreviousVideo,  // ← NUEVA PROPS para navegar al video anterior
  hasNext = false,  // ← NUEVA PROPS: indica si hay siguiente video
  hasPrev = false   // ← NUEVA PROPS: indica si hay video anterior
}) => {
  const dispatch = useDispatch();
  const history  = useHistory();
  const { auth, socket } = useSelector(state => state);
  const videoRef  = useRef(null);
  const drawerRef = useRef(null);

  const [liked,         setLiked]         = useState(video.liked || false);
  const [likesCount,    setLikesCount]    = useState(video.likes?.length || 0);
  const [saved,         setSaved]         = useState(false);
  const [commentsCount, setCommentsCount] = useState(video.comments?.length || 0);
  const [showComments,  setShowComments]  = useState(false);
  const [isMuted,       setIsMuted]       = useState(false);
  const [isPlaying,     setIsPlaying]     = useState(false);
  const [progress,      setProgress]      = useState(0);
  const [isFollowing,   setIsFollowing]   = useState(false);
  const [showMenu,      setShowMenu]      = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [dragOffset,    setDragOffset]    = useState(0);
  const [isDragging,    setIsDragging]    = useState(false);
  const [startY,        setStartY]        = useState(0);

  const isAdmin  = auth.user?.role === 'admin' || auth.user?.role === 'moderator';
  const isOwner  = auth.user?._id === video.user?._id;
  const isPending = video?.pendiente === true;

  // ✅ Detectar si es pantalla grande (PC)
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth > 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  moment.locale('fr');

  /* ── Playback ─────────────────────────────────────────── */
  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive && !showComments) {
      videoRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(() => {});
      onVisibilityChange?.(true);
    } else if (!isActive && !showComments) {
      videoRef.current.pause();
      setIsPlaying(false);
      onVisibilityChange?.(false);
    }
  }, [isActive, showComments, onVisibilityChange]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onTime = () => el.duration && setProgress((el.currentTime / el.duration) * 100);
    el.addEventListener('timeupdate', onTime);
    return () => el.removeEventListener('timeupdate', onTime);
  }, []);

  /* ── Socket ───────────────────────────────────────────── */
  useEffect(() => {
    if (!socket || !video || isPending) return;
    socket.emit('join-video-room', video._id);
    socket.on('new-comment',      d => d.videoId === video._id && setCommentsCount(p => p + 1));
    socket.on('comment-deleted',  d => d.videoId === video._id && setCommentsCount(p => Math.max(0, p - 1)));
    return () => {
      socket.emit('leave-video-room', video._id);
      socket.off('new-comment');
      socket.off('comment-deleted');
    };
  }, [socket, video, isPending]);

  /* ── Drag ─────────────────────────────────────────────── */
  const handleDragStart = e => {
    e.stopPropagation();
    setStartY(e.touches ? e.touches[0].clientY : e.clientY);
    setIsDragging(true);
    setDragOffset(0);
  };
  
  const handleDragMove = e => {
    if (!isDragging) return;
    e.preventDefault();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const delta = Math.min(Math.max(clientY - startY, 0), window.innerHeight * 0.6);
    setDragOffset(delta);
    if (drawerRef.current) drawerRef.current.style.transform = `translateY(${delta}px)`;
  };
  
  const handleDragEnd = () => {
    setIsDragging(false);
    if (dragOffset > window.innerHeight * 0.25) {
      handleCloseComments();
    } else {
      if (drawerRef.current) drawerRef.current.style.transform = '';
      setDragOffset(0);
    }
  };

  const getVideoScale = () => !showComments ? 1 : 0.7 + 0.3 * Math.min(dragOffset / (window.innerHeight * 0.6), 1);
  const getVideoTranslateY = () => !showComments ? 0 : -15 * (1 - Math.min(dragOffset / (window.innerHeight * 0.6), 1));

  /* ── Actions ──────────────────────────────────────────── */
  const guardPending = () => {
    if (!isPending) return false;
    dispatch({ type: GLOBALTYPES.ALERT, payload: { error: "Ce vidéo est en attente d'approbation" } });
    return true;
  };

  const handleLike = async () => {
    if (!auth.token) { history.push('/login'); return; }
    if (guardPending()) return;
    const res = await dispatch(likeVideo(video._id, auth.token, auth, socket, video));
    if (res?.liked !== undefined) {
      setLiked(res.liked);
      setLikesCount(res.likes);
      if (res.liked) createHeartEffect();
    }
  };

  const createHeartEffect = () => {
    const h = document.createElement('div');
    h.className = 'vr-floating-heart';
    h.textContent = '❤️';
    document.body.appendChild(h);
    setTimeout(() => h.remove(), 800);
  };

  const handleDoubleClick = e => { e.stopPropagation(); if (!liked && !isPending) handleLike(); };
  
  const handleSave = () => {
    if (!auth.token) { history.push('/login'); return; }
    if (guardPending()) return;
    setSaved(s => !s);
    dispatch({ type: GLOBALTYPES.ALERT, payload: { success: saved ? 'Retiré des favoris' : 'Ajouté aux favoris' } });
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/video/${video?._id}`;
    if (navigator.share) {
      try { await navigator.share({ title: video?.title, text: video?.description, url }); } catch {}
    } else {
      navigator.clipboard.writeText(url);
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: 'Lien copié !' } });
    }
    await dispatch(shareVideo(video._id, auth.token, auth, socket, video));
  };

  const toggleMute = e => { e.stopPropagation(); if (videoRef.current) { videoRef.current.muted = !isMuted; setIsMuted(m => !m); } };
  const togglePlay = e => { e.stopPropagation(); if (videoRef.current) { isPlaying ? videoRef.current.pause() : videoRef.current.play(); setIsPlaying(p => !p); } };
  
  const handleProgressClick = e => {
    e.stopPropagation();
    if (videoRef.current?.duration) {
      const r = e.currentTarget.getBoundingClientRect();
      videoRef.current.currentTime = ((e.clientX - r.left) / r.width) * videoRef.current.duration;
    }
  };

  const handleOpenComments = () => { setShowComments(true); setDragOffset(0); };
  const handleCloseComments = () => { setShowComments(false); setDragOffset(0); if (drawerRef.current) drawerRef.current.style.transform = ''; };
  const handleGoBack = () => history.goBack();

  const handleViewDetails = () => {
    sessionStorage.setItem('returnToFeed', 'true');
    sessionStorage.setItem('feedScrollPosition', window.scrollY.toString());
    history.push(`/video/${video._id}`);
  };

  // ✅ Navegación con teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' && hasPrev && onPreviousVideo) {
        e.preventDefault();
        onPreviousVideo();
      } else if (e.key === 'ArrowDown' && hasNext && onNextVideo) {
        e.preventDefault();
        onNextVideo();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrev, hasNext, onPreviousVideo, onNextVideo]);

  /* ── Menu actions ─────────────────────────────────────── */
  const menuAction = fn => () => { setShowMenu(false); fn(); };

  const handleEdit = menuAction(() => {
    sessionStorage.setItem('returnToFeed', 'true');
    sessionStorage.setItem('feedScrollPosition', window.scrollY.toString());
    history.push(`/edit-video/${video._id}`);
  });

  const handleDeleteVideo = menuAction(async () => {
    if (!window.confirm('Supprimer cette vidéo ? Cette action est irréversible.')) return;
    setActionLoading(true);
    const res = await dispatch(deleteVideo(video._id, auth.token, auth, socket, video));
    setActionLoading(false);
    if (res?.success) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: 'Vidéo supprimée' } });
      onVideoDeleted?.(video._id);
    }
  });

  const handleApproveVideo = menuAction(async () => {
    if (!window.confirm(`Approuver "${video.title}" ?`)) return;
    setActionLoading(true);
    const res = await dispatch(aprobarVideo(video._id, auth.token, auth, socket, video));
    setActionLoading(false);
    if (res?.success) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: 'Vidéo approuvée !' } });
      onVideoDeleted?.(video._id);
    }
  });

  const handleRejectVideo = menuAction(async () => {
    if (!window.confirm(`Rejeter "${video.title}" ?`)) return;
    setActionLoading(true);
    const res = await dispatch(eliminarVideo(video._id, auth.token, auth, socket, video));
    setActionLoading(false);
    if (res?.success) {
      dispatch({ type: GLOBALTYPES.ALERT, payload: { success: 'Vidéo rejetée' } });
      onVideoDeleted?.(video._id);
    }
  });

  const handleReportVideo = menuAction(() => dispatch({ type: GLOBALTYPES.ALERT, payload: { info: 'Fonctionnalité de signalement disponible prochainement.' } }));
  const handleBlockUser = menuAction(() => dispatch({ type: GLOBALTYPES.ALERT, payload: { info: `@${video.user?.username} bloqué.` } }));
  const handleNotInterested = menuAction(() => {
    dispatch({ type: GLOBALTYPES.ALERT, payload: { info: 'Merci pour votre retour !' } });
    onVideoDeleted?.(video._id);
  });

  const formatNumber = n => {
    if (!n) return '0';
    if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + 'M';
    if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K';
    return n.toString();
  };

  const videoScale = getVideoScale();
  const videoTranslateY = getVideoTranslateY();

  /* ════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════ */
  return (
    <div style={{
      height: '100vh',
      scrollSnapAlign: 'start',
      position: 'relative',
      backgroundColor: '#000',
      overflow: 'hidden',
    }}>

      {/* ── HEADER ─────────────────────────────────────────── */}
      <div style={{
        position: 'absolute', top: 44, left: 0, right: 0, zIndex: 30,
        padding: '0 14px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        pointerEvents: 'none',
      }}>
        <button
          onClick={handleGoBack}
          style={{ ...iconBtn(), pointerEvents: 'auto' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
          onMouseLeave={e => e.currentTarget.style.background = T.glass}
        >
          <FontAwesomeIcon icon={faArrowLeft} style={{ fontSize: 14 }} />
        </button>

        <div style={{ display: 'flex', gap: 8, pointerEvents: 'auto' }}>
          {(isOwner || isAdmin) && !showComments && (
            <button
              onClick={handleViewDetails}
              title="Voir les détails"
              style={iconBtn()}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = T.glass}
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} style={{ fontSize: 12 }} />
            </button>
          )}

          {!showComments && (
            <Dropdown show={showMenu} onToggle={setShowMenu} align="end">
              <Dropdown.Toggle
                as="button"
                style={iconBtn({ border: 'none' })}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
                onMouseLeave={e => e.currentTarget.style.background = T.glass}
              >
                <FontAwesomeIcon icon={faEllipsisVertical} style={{ fontSize: 15 }} />
              </Dropdown.Toggle>

              <Dropdown.Menu style={{
                background: T.menuBg,
                border: `0.5px solid ${T.menuBorder}`,
                borderRadius: T.radius,
                minWidth: 210,
                padding: '6px 0',
                boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
              }}>
                {isAdmin && isPending && <>
                  <Dropdown.Item onClick={handleApproveVideo}
                    style={{ color: T.approveColor, padding: '10px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FontAwesomeIcon icon={faCheckCircle} style={{ width: 14 }} />
                    Approuver la vidéo
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleRejectVideo}
                    style={{ color: T.rejectColor, padding: '10px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FontAwesomeIcon icon={faBan} style={{ width: 14 }} />
                    Rejeter la vidéo
                  </Dropdown.Item>
                  <Dropdown.Divider style={{ borderColor: T.menuBorder, margin: '4px 0' }} />
                </>}

                {(isOwner || isAdmin) && !isPending && <>
                  <Dropdown.Item onClick={handleEdit}
                    style={{ color: T.textPrimary, padding: '10px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FontAwesomeIcon icon={faPen} style={{ width: 14, color: T.textMuted }} />
                    Modifier
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleDeleteVideo}
                    style={{ color: T.rejectColor, padding: '10px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FontAwesomeIcon icon={faTrash} style={{ width: 14 }} />
                    Supprimer
                  </Dropdown.Item>
                  <Dropdown.Divider style={{ borderColor: T.menuBorder, margin: '4px 0' }} />
                </>}

                {isAdmin && !isPending && <>
                  <Dropdown.Item onClick={handleDeleteVideo}
                    style={{ color: T.rejectColor, padding: '10px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FontAwesomeIcon icon={faTrash} style={{ width: 14 }} />
                    Supprimer (Admin)
                  </Dropdown.Item>
                  <Dropdown.Divider style={{ borderColor: T.menuBorder, margin: '4px 0' }} />
                </>}

                {!isOwner && !isAdmin && !isPending && <>
                  <Dropdown.Item onClick={handleReportVideo}
                    style={{ color: '#ff9800', padding: '10px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FontAwesomeIcon icon={faFlag} style={{ width: 14 }} />
                    Signaler la vidéo
                  </Dropdown.Item>
                  <Dropdown.Item onClick={handleBlockUser}
                    style={{ color: T.rejectColor, padding: '10px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FontAwesomeIcon icon={faUserSlash} style={{ width: 14 }} />
                    Bloquer @{video.user?.username}
                  </Dropdown.Item>
                </>}

                {!isPending && <>
                  <Dropdown.Divider style={{ borderColor: T.menuBorder, margin: '4px 0' }} />
                  <Dropdown.Item onClick={handleNotInterested}
                    style={{ color: T.textMuted, padding: '10px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <FontAwesomeIcon icon={faExclamationTriangle} style={{ width: 14 }} />
                    Pas intéressé(e)
                  </Dropdown.Item>
                </>}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      </div>

      {/* ── ADMIN BANNER ───────────────────────────────────── */}
      {isPending && isAdmin && (
        <div style={{
          position: 'absolute', top: 90, left: 14, right: 14, zIndex: 30,
          background: T.adminBg,
          border: `0.5px solid ${T.adminBorder}`,
          borderRadius: T.radiusXs,
          padding: '7px 12px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.adminColor, flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: T.adminColor, fontWeight: 600, letterSpacing: 0.3 }}>
            Mode Admin · Vidéo en attente d'approbation
          </span>
        </div>
      )}

      {/* ── VIDEO WRAPPER ──────────────────────────────────── */}
      <div
        style={{
          position: 'relative', width: '100%', height: '100%',
          transform: showComments
            ? `scale(${videoScale}) translateY(${videoTranslateY}%)`
            : 'scale(1) translateY(0)',
          transformOrigin: 'top center',
          transition: isDragging ? 'none' : 'transform 0.32s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
          cursor: 'pointer',
        }}
        onDoubleClick={handleDoubleClick}
      >
        <video
          ref={videoRef}
          src={video.videoUrl}
          loop muted={isMuted} playsInline
          onClick={togglePlay}
          poster={video.thumbnail}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />

        {/* Gradient overlay */}
        {!showComments && (
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 25%, transparent 55%, rgba(0,0,0,0.80) 100%)',
          }} />
        )}

        {/* ── PROGRESS BAR ─────────────────────────────────── */}
        {!showComments && (
          <div
            onClick={handleProgressClick}
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
              background: 'rgba(255,255,255,0.20)', cursor: 'pointer', zIndex: 20,
            }}
          >
            <div style={{
              width: `${progress}%`, height: '100%',
              background: T.accent,
              borderRadius: '0 2px 2px 0',
              transition: 'width 0.1s linear',
            }} />
          </div>
        )}

        {/* ── ACTION SIDEBAR + FLECHAS DE NAVEGACIÓN ───────────────────────────────── */}
        {!showComments && (
          <div style={{
            position: 'absolute', right: 12, bottom: 100,
            display: 'flex', flexDirection: 'column', gap: 4, zIndex: 20,
          }}>
            {/* Botones existentes */}
            {[
              { id: 'like', icon: liked ? faHeart : faHeartRegular, color: liked ? T.accent : T.white, label: formatNumber(likesCount), onClick: handleLike },
              { id: 'comments', icon: faCommentRegular, color: T.white, label: formatNumber(commentsCount), onClick: handleOpenComments },
              { id: 'save', icon: saved ? faBookmark : faBookmarkRegular, color: saved ? '#ffd700' : T.white, label: 'Favoris', onClick: handleSave },
              { id: 'share', icon: faShare, color: T.white, label: 'Partager', onClick: handleShare },
            ].map(({ id, icon, color, label, onClick }) => (
              <div key={id} style={{ textAlign: 'center', marginBottom: 8 }}>
                <button
                  onClick={onClick}
                  style={actionBtn()}
                  onMouseEnter={e => e.currentTarget.style.background = T.glass}
                  onMouseLeave={e => e.currentTarget.style.background = 'none'}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.88)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <FontAwesomeIcon
                    icon={icon}
                    style={{ fontSize: 22, color, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))' }}
                  />
                </button>
                <p style={{ fontSize: 11, margin: '2px 0 0', color: T.textMuted, fontWeight: 500 }}>{label}</p>
              </div>
            ))}

            {/* ✅ SEPARADOR (solo en pantallas grandes) */}
            {isLargeScreen && (hasPrev || hasNext) && (
              <div style={{
                width: '40px',
                height: '1px',
                background: 'rgba(255,255,255,0.2)',
                margin: '8px auto',
              }} />
            )}

            {/* ✅ FLECHA ARRIBA (solo en pantallas grandes y si hay video anterior) */}
            {isLargeScreen && hasPrev && onPreviousVideo && (
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <button
                  onClick={onPreviousVideo}
                  style={navBtn()}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = T.glass}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                  title="Vidéo précédente"
                >
                  <FontAwesomeIcon icon={faChevronUp} style={{ fontSize: 16 }} />
                </button>
                <p style={{ fontSize: 10, margin: '2px 0 0', color: T.textMuted }}>Précédent</p>
              </div>
            )}

            {/* ✅ FLECHA ABAJO (solo en pantallas grandes y si hay video siguiente) */}
            {isLargeScreen && hasNext && onNextVideo && (
              <div style={{ textAlign: 'center', marginBottom: 8 }}>
                <button
                  onClick={onNextVideo}
                  style={navBtn()}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
                  onMouseLeave={e => e.currentTarget.style.background = T.glass}
                  onMouseDown={e => e.currentTarget.style.transform = 'scale(0.92)'}
                  onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                  title="Vidéo suivante"
                >
                  <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: 16 }} />
                </button>
                <p style={{ fontSize: 10, margin: '2px 0 0', color: T.textMuted }}>Suivant</p>
              </div>
            )}
          </div>
        )}

        {/* ── VOLUME CONTROL ───────────────────────────────── */}
        {!showComments && (
          <button
            onClick={toggleMute}
            style={{
              ...iconBtn({ width: 32, height: 32 }),
              position: 'absolute', bottom: 56, right: 14, zIndex: 20,
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = T.glass}
          >
            <FontAwesomeIcon
              icon={isMuted ? faVolumeXmark : faVolumeHigh}
              style={{ fontSize: 12 }}
            />
          </button>
        )}

        {/* ── VIDEO INFO ───────────────────────────────────── */}
        {!showComments && (
          <div style={{
            position: 'absolute', left: 14, right: 68, bottom: 20, zIndex: 20,
          }}>
            {isPending && isAdmin && (
              <span style={{
                display: 'inline-block', marginBottom: 8,
                background: T.adminBg, border: `0.5px solid ${T.adminBorder}`,
                color: T.adminColor, fontSize: 10, fontWeight: 700,
                padding: '3px 8px', borderRadius: 6, letterSpacing: 0.4,
              }}>
                ⏳ En attente
              </span>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <img
                src={video.user?.avatar || '/default-avatar.png'}
                alt={video.user?.username}
                onClick={() => history.push(`/profile/${video.user?._id}`)}
                style={{
                  width: 40, height: 40, borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.9)',
                  cursor: 'pointer', objectFit: 'cover', flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 14, fontWeight: 600, color: T.textPrimary,
                  cursor: 'pointer', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                }}>
                  @{video.user?.username}
                </div>
                <div style={{ display: 'flex', gap: 8, fontSize: 10, color: T.textMuted, marginTop: 1 }}>
                  <span><FontAwesomeIcon icon={faEye} style={{ fontSize: 9, marginRight: 3 }} />{formatNumber(video.views)}</span>
                  <span><FontAwesomeIcon icon={faClock} style={{ fontSize: 9, marginRight: 3 }} />{moment(video.createdAt).fromNow()}</span>
                </div>
              </div>
              {!isPending && (
                <button
                  onClick={() => setIsFollowing(f => !f)}
                  style={{
                    background: isFollowing ? 'rgba(255,255,255,0.12)' : T.accentFollow,
                    border: isFollowing ? `0.5px solid rgba(255,255,255,0.3)` : 'none',
                    color: T.white,
                    padding: '5px 14px',
                    borderRadius: 20,
                    fontSize: 12, fontWeight: 600,
                    cursor: 'pointer',
                    flexShrink: 0,
                    transition: 'background 0.18s ease',
                  }}
                >
                  {isFollowing ? 'Suivi ✓' : 'Suivre'}
                </button>
              )}
            </div>

            <p style={{ fontSize: 13, fontWeight: 600, margin: '0 0 3px', color: T.textPrimary, lineHeight: 1.4 }}>
              {video.title}
            </p>
            {video.description && (
              <p style={{
                fontSize: 12, margin: '0 0 5px', color: T.textMuted, lineHeight: 1.4,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
              }}>
                {video.description}
              </p>
            )}
            {video.tags?.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: T.textDim }}>
                <FontAwesomeIcon icon={faMusic} style={{ fontSize: 9 }} />
                <span>{video.tags.slice(0, 2).join(' · ')}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── COMMENTS DRAWER ────────────────────────────────── */}
      {showComments && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        }}>
          <div onClick={handleCloseComments} style={{ position: 'absolute', inset: 0, background: 'transparent' }} />

          <div
            ref={drawerRef}
            onTouchStart={handleDragStart} onTouchMove={handleDragMove} onTouchEnd={handleDragEnd}
            onMouseDown={handleDragStart} onMouseMove={handleDragMove} onMouseUp={handleDragEnd} onMouseLeave={handleDragEnd}
            style={{
              position: 'relative', zIndex: 1001,
              background: '#111',
              borderRadius: '20px 20px 0 0',
              height: 'calc(56vh + 40px)',
              display: 'flex', flexDirection: 'column',
              border: `0.5px solid rgba(255,255,255,0.10)`,
              transition: isDragging ? 'none' : 'transform 0.32s cubic-bezier(0.2, 0.9, 0.4, 1.1)',
              cursor: 'grab',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 6px' }}>
              <div style={{ width: 36, height: 4, background: 'rgba(255,255,255,0.20)', borderRadius: 4 }} />
            </div>

            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '0 16px 12px',
              borderBottom: `0.5px solid rgba(255,255,255,0.08)`,
            }}>
              <h5 style={{ color: T.textPrimary, margin: 0, fontSize: 15, fontWeight: 600 }}>
                {commentsCount} commentaire{commentsCount !== 1 ? 's' : ''}
              </h5>
              <button
                onClick={handleCloseComments}
                style={{
                  ...iconBtn({ width: 30, height: 30 }),
                  border: 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.background = T.glass}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <FontAwesomeIcon icon={faXmark} style={{ fontSize: 14 }} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
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
        .vr-floating-heart {
          position: fixed;
          left: 50%; top: 50%;
          transform: translate(-50%, -50%);
          font-size: 72px;
          animation: vr-floatUp 0.7s ease-out forwards;
          pointer-events: none;
          z-index: 9999;
        }
        @keyframes vr-floatUp {
          0%   { opacity: 1; transform: translate(-50%, -50%) scale(0.4); }
          100% { opacity: 0; transform: translate(-50%, -160%) scale(1.6); }
        }
        .dropdown-item:hover,
        .dropdown-item:focus {
          background: rgba(255,255,255,0.07) !important;
          color: inherit !important;
        }
      `}</style>
    </div>
  );
};

export default VideoReelItem;