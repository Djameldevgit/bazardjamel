// components/Video/VideoPlayer.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { likeVideo, shareVideo, trackWatchTime } from '../../redux/actions/videoAction';
import { Heart, Share2, Eye, MessageCircle, TrendingUp } from 'lucide-react';

const VideoPlayer = ({ video, onLike, onShare, onComment }) => {
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  const [isLiked, setIsLiked] = useState(video.liked || false);
  const [likesCount, setLikesCount] = useState(video.likes?.length || 0);
  const [sharesCount, setSharesCount] = useState(video.shares?.length || 0);
  const [watchStartTime, setWatchStartTime] = useState(null);
  const [totalWatchTime, setTotalWatchTime] = useState(0);
  const videoRef = useRef(null);
  
  // Tracking de tiempo de visualización
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;
    
    const handlePlay = () => {
      setWatchStartTime(Date.now());
    };
    
    const handlePause = () => {
      if (watchStartTime) {
        const watchTime = (Date.now() - watchStartTime) / 1000;
        setTotalWatchTime(prev => prev + watchTime);
        setWatchStartTime(null);
        
        // Enviar tracking cada 5 segundos acumulados
        if (totalWatchTime + watchTime >= 5) {
          dispatch(trackWatchTime(video._id, totalWatchTime + watchTime, auth.token));
          setTotalWatchTime(0);
        }
      }
    };
    
    const handleTimeUpdate = () => {
      // Tracking cada 30% del video
      const progress = videoElement.currentTime / videoElement.duration;
      if (progress >= 0.3 && !videoElement.dataset.tracked30) {
        videoElement.dataset.tracked30 = true;
        // Evento de milestone
      }
    };
    
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    
    return () => {
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      if (watchStartTime) {
        const finalWatchTime = (Date.now() - watchStartTime) / 1000;
        dispatch(trackWatchTime(video._id, finalWatchTime, auth.token));
      }
    };
  }, [watchStartTime, totalWatchTime, video._id, auth.token, dispatch]);
  
  const handleLike = async () => {
    if (!auth.token) return;
    
    const result = await dispatch(likeVideo(video._id, auth.token));
    if (result) {
      setIsLiked(result.liked);
      setLikesCount(result.likes);
      if (onLike) onLike(result.liked, result.likes);
    }
  };
  
  const handleShare = async () => {
    if (!auth.token) return;
    
    // Compartir via Web Share API si está disponible
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: video.shortDescription || video.description,
          url: window.location.href
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
    
    const result = await dispatch(shareVideo(video._id, auth.token));
    if (result) {
      setSharesCount(result.shares);
      if (onShare) onShare(result.shared, result.shares);
    }
  };
  
  // Formatear números
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };
  
  return (
    <div className="video-player">
      <video
        ref={videoRef}
        src={video.videoType === 'local' ? video.videoUrl : undefined}
        controls
        className="w-100 rounded"
        poster={video.thumbnail}
        playsInline
      />
      
      {/* Información del video */}
      <div className="video-info mt-3">
        <h3>{video.title}</h3>
        <p className="text-muted">{video.description}</p>
        
        {/* Estadísticas */}
        <div className="video-stats d-flex gap-4 mb-3">
          <div className="stat-item d-flex align-items-center gap-1">
            <Eye size={18} />
            <span>{formatNumber(video.stats?.views || video.views)} vistas</span>
          </div>
          <div className="stat-item d-flex align-items-center gap-1">
            <Heart size={18} className={isLiked ? 'text-danger' : ''} />
            <span>{formatNumber(likesCount)}</span>
          </div>
          <div className="stat-item d-flex align-items-center gap-1">
            <MessageCircle size={18} />
            <span>{formatNumber(video.comments?.length || 0)} comentarios</span>
          </div>
          <div className="stat-item d-flex align-items-center gap-1">
            <Share2 size={18} />
            <span>{formatNumber(sharesCount)} compartidos</span>
          </div>
          {video.stats?.engagementScore > 0 && (
            <div className="stat-item d-flex align-items-center gap-1">
              <TrendingUp size={18} className="text-success" />
              <span>{video.stats.engagementScore.toFixed(1)}% engagement</span>
            </div>
          )}
        </div>
        
        {/* Botones de acción */}
        <div className="video-actions d-flex gap-3">
          <button
            onClick={handleLike}
            className={`btn ${isLiked ? 'btn-danger' : 'btn-outline-danger'}`}
            disabled={!auth.token}
          >
            <Heart size={18} className="me-1" />
            {isLiked ? 'Me gusta' : 'Dar like'}
          </button>
          
          <button
            onClick={handleShare}
            className="btn btn-outline-primary"
            disabled={!auth.token}
          >
            <Share2 size={18} className="me-1" />
            Compartir
          </button>
          
          <button
            onClick={onComment}
            className="btn btn-outline-secondary"
          >
            <MessageCircle size={18} className="me-1" />
            Comentar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;