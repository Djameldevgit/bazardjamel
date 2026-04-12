// components/Video/VideoCard.jsx
import React, { useState } from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { PlayFill, Heart, HeartFill, Eye, Clock, Share, Bookmark, BookmarkFill } from 'react-bootstrap-icons';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { likeVideo } from '../redux/actions/videoAction';
import moment from 'moment';
import 'moment/locale/fr';

const VideoCard = ({ video, showActions = true, onVideoClick }) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { auth } = useSelector(state => state);
  const [liked, setLiked] = useState(video?.liked || false);
  const [likesCount, setLikesCount] = useState(video?.likes?.length || 0);
  const [saved, setSaved] = useState(false);
  const [showShare, setShowShare] = useState(false);

  moment.locale('fr');

  // Determinar tipo de video y obtener thumbnail
  const getThumbnail = () => {
    if (video.videoType === 'youtube' && video.videoId) {
      return `https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg`;
    }
    if (video.thumbnail) {
      return video.thumbnail;
    }
    return '/video-placeholder.jpg';
  };

  const handlePlay = () => {
    if (onVideoClick) {
      onVideoClick(video);
    } else {
      history.push(`/video/${video._id}`);
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!auth.token) {
      history.push('/login');
      return;
    }
    
    const result = await dispatch(likeVideo(video._id, auth.token));
    if (result?.liked !== undefined) {
      setLiked(result.liked);
      setLikesCount(result.likes);
    }
  };

  const handleSave = (e) => {
    e.stopPropagation();
    setSaved(!saved);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    setShowShare(!showShare);
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description,
        url: `${window.location.origin}/video/${video._id}`
      });
    }
  };

  const copyToClipboard = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/video/${video._id}`);
    setShowShare(false);
  };

  // Formatear duración
  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="video-card h-100 border-0 shadow-sm" style={{ cursor: 'pointer' }} onClick={handlePlay}>
      {/* Thumbnail con overlay de play */}
      <div className="position-relative" style={{ aspectRatio: '16/9', overflow: 'hidden', borderRadius: '12px 12px 0 0' }}>
        <img
          src={getThumbnail()}
          alt={video.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          className="video-thumbnail"
          onError={(e) => {
            e.target.src = '/video-placeholder.jpg';
          }}
        />
        
        {/* Overlay de play */}
        <div className="play-overlay d-flex align-items-center justify-content-center">
          <div className="play-button">
            <PlayFill size={48} className="text-white" />
          </div>
        </div>
        
        {/* Duración */}
        {video.duration > 0 && (
          <Badge bg="dark" className="position-absolute bottom-0 end-0 m-2 opacity-75">
            <Clock size={12} className="me-1" />
            {formatDuration(video.duration)}
          </Badge>
        )}
        
        {/* Badge de tipo */}
        <Badge bg="primary" className="position-absolute top-0 start-0 m-2">
          {video.videoType === 'youtube' ? 'YouTube' : video.videoType === 'vimeo' ? 'Vimeo' : 'Vidéo'}
        </Badge>
      </div>
      
      <Card.Body>
        <Card.Title className="fs-6 fw-bold mb-2" style={{ lineHeight: '1.4' }}>
          {video.title}
        </Card.Title>
        
        <Card.Text className="small text-muted mb-2" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {video.description}
        </Card.Text>
        
        {/* Información del usuario */}
        <div className="d-flex align-items-center gap-2 mb-2">
          <img
            src={video.user?.avatar || '/default-avatar.png'}
            alt={video.user?.username}
            style={{ width: 24, height: 24, borderRadius: '50%' }}
          />
          <small className="text-muted">{video.user?.username}</small>
          <small className="text-muted">•</small>
          <small className="text-muted">{moment(video.createdAt).fromNow()}</small>
        </div>
        
        {/* Estadísticas y acciones */}
        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="d-flex gap-3">
            <span className="small text-muted">
              <Eye size={14} className="me-1" /> {video.views || 0}
            </span>
            <span className="small text-muted" onClick={handleLike} style={{ cursor: 'pointer' }}>
              {liked ? <HeartFill size={14} className="me-1 text-danger" /> : <Heart size={14} className="me-1" />}
              {likesCount}
            </span>
          </div>
          
          {showActions && (
            <div className="d-flex gap-2">
              <Button variant="link" size="sm" className="p-0 text-muted" onClick={handleSave}>
                {saved ? <BookmarkFill size={16} /> : <Bookmark size={16} />}
              </Button>
              <Button variant="link" size="sm" className="p-0 text-muted" onClick={handleShare}>
                <Share size={16} />
              </Button>
            </div>
          )}
        </div>
      </Card.Body>
      
      {/* Dropdown de compartir */}
      {showShare && (
        <div className="position-absolute bg-white border rounded shadow-sm p-2" style={{ bottom: '60px', right: '10px', zIndex: 10 }}>
          <div className="d-flex gap-2">
            <Button size="sm" variant="outline-primary" onClick={copyToClipboard}>
              Copier le lien
            </Button>
            <Button size="sm" variant="outline-success" href={`https://wa.me/?text=${encodeURIComponent(video.title)} ${window.location.origin}/video/${video._id}`} target="_blank">
              WhatsApp
            </Button>
          </div>
        </div>
      )}
      
      <style jsx="true">{`
        .video-card:hover .video-thumbnail {
          transform: scale(1.05);
        }
        .play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.3);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .video-card:hover .play-overlay {
          opacity: 1;
        }
        .play-button {
          width: 60px;
          height: 60px;
          background: rgba(0,0,0,0.7);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }
        .video-card:hover .play-button {
          transform: scale(1.1);
        }
      `}</style>
    </Card>
  );
};

export default VideoCard; // ✅ Exportación por defecto