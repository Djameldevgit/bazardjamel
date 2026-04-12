// components/Video/DetailVideoPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Badge,
  Spinner,
  Alert,
  Form,
  ListGroup,
  Image,
  Dropdown
} from 'react-bootstrap';
import {
  Heart,
  HeartFill,
  Eye,
  Clock,
  Calendar,
  Share,
  Bookmark,
  BookmarkFill,
  ArrowLeft,
  ThumbsUp,
  MessageCircle,
  Send,
  Flag,
  MoreVertical
} from 'react-bootstrap-icons';
 import { getVideoById , likeVideo, addComment, getRelatedVideos } from '../../redux/actions/videoAction';
  
import { GLOBALTYPES } from '../../redux/actions/globalTypes';
import moment from 'moment';
import 'moment/locale/fr';
import VideoCard from '../../components/VideoCard';

const DetailVideoPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const { auth } = useSelector(state => state);
  const { currentVideo: video, loading, relatedVideos = [] } = useSelector(state => state.video || {});
  
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [saved, setSaved] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [showShare, setShowShare] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  
  const commentInputRef = useRef(null);
  const videoRef = useRef(null);
  
  moment.locale('fr');

  useEffect(() => {
    if (id) {
      dispatch(getVideoById(id));
      dispatch(getRelatedVideos(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (video) {
      setLiked(video.liked || false);
      setLikesCount(video.likes?.length || 0);
      setComments(video.comments || []);
    }
  }, [video]);

  // Obtener URL del embed según tipo
  const getEmbedUrl = () => {
    if (!video) return '';
    
    if (video.videoType === 'youtube' && video.videoId) {
      return `https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0`;
    }
    if (video.videoType === 'vimeo' && video.videoId) {
      return `https://player.vimeo.com/video/${video.videoId}?autoplay=1`;
    }
    return video.videoUrl;
  };

  const handleLike = async () => {
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

  const handleSave = () => {
    if (!auth.token) {
      history.push('/login');
      return;
    }
    setSaved(!saved);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: saved ? 'Video retiré des favoris' : 'Video ajouté aux favoris' }
    });
  };

  const handleShare = () => {
    setShowShare(!showShare);
    if (navigator.share) {
      navigator.share({
        title: video?.title,
        text: video?.description,
        url: `${window.location.origin}/video/${video?._id}`
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${window.location.origin}/video/${video?._id}`);
    setShowShare(false);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: 'Lien copié dans le presse-papier' }
    });
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!auth.token) {
      history.push('/login');
      return;
    }
    
    if (!commentText.trim()) return;
    
    const result = await dispatch(addComment(video._id, commentText, auth.token));
    if (result?.success) {
      setComments([result.comment, ...comments]);
      setCommentText('');
    }
  };

  const handleFollowUser = () => {
    if (!auth.token) {
      history.push('/login');
      return;
    }
    setIsFollowing(!isFollowing);
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { success: isFollowing ? 'Utilisateur unfollow' : 'Utilisateur follow' }
    });
  };

  const handleReport = () => {
    dispatch({
      type: GLOBALTYPES.ALERT,
      payload: { error: 'Signalement envoyé à l\'administration' }
    });
  };

  const handleGoBack = () => {
    history.goBack();
  };

  const handleVideoClick = (videoItem) => {
    history.push(`/video/${videoItem._id}`);
    window.scrollTo(0, 0);
  };

  if (loading || !video) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <div className="text-center">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="mt-3 text-muted">Chargement de la vidéo...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button 
        variant="outline-secondary" 
        size="sm" 
        className="mb-3"
        onClick={handleGoBack}
      >
        <ArrowLeft className="me-2" size={16} />
        Retour
      </Button>
      
      <Row>
        {/* Columna principal - Video */}
        <Col lg={8}>
          {/* Reproductor de video */}
          <Card className="border-0 shadow-sm mb-4">
            <div className="position-relative" style={{ aspectRatio: '16/9', backgroundColor: '#000' }}>
              {video.videoType === 'local' ? (
                <video
                  ref={videoRef}
                  src={video.videoUrl}
                  controls
                  autoPlay
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  poster={video.thumbnail}
                />
              ) : (
                <iframe
                  src={getEmbedUrl()}
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ width: '100%', height: '100%' }}
                />
              )}
            </div>
            
            <Card.Body>
              {/* Título y acciones */}
              <div className="d-flex justify-content-between align-items-start mb-3">
                <h3 className="h4 fw-bold mb-0">{video.title}</h3>
                <div className="d-flex gap-2">
                  <Button 
                    variant={liked ? 'danger' : 'outline-danger'} 
                    size="sm"
                    onClick={handleLike}
                    className="rounded-pill"
                  >
                    {liked ? <HeartFill size={16} className="me-1" /> : <Heart size={16} className="me-1" />}
                    {likesCount}
                  </Button>
                  <Button 
                    variant={saved ? 'warning' : 'outline-secondary'} 
                    size="sm"
                    onClick={handleSave}
                    className="rounded-pill"
                  >
                    {saved ? <BookmarkFill size={16} className="me-1" /> : <Bookmark size={16} className="me-1" />}
                  </Button>
                  <Dropdown>
                    <Dropdown.Toggle variant="outline-secondary" size="sm" className="rounded-pill">
                      <Share size={16} className="me-1" />
                      Partager
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={copyToClipboard}>
                        📋 Copier le lien
                      </Dropdown.Item>
                      <Dropdown.Item href={`https://wa.me/?text=${encodeURIComponent(video.title)} ${window.location.origin}/video/${video._id}`} target="_blank">
                        💬 WhatsApp
                      </Dropdown.Item>
                      <Dropdown.Item href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin + '/video/' + video._id)}`} target="_blank">
                        📘 Facebook
                      </Dropdown.Item>
                      <Dropdown.Item href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(video.title)}&url=${encodeURIComponent(window.location.origin + '/video/' + video._id)}`} target="_blank">
                        🐦 Twitter
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleReport}>
                        🚫 Signaler
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
              
              {/* Estadísticas */}
              <div className="d-flex gap-4 mb-3 text-muted small">
                <span><Eye size={14} className="me-1" /> {video.views || 0} vues</span>
                <span><Calendar size={14} className="me-1" /> {moment(video.createdAt).format('DD MMMM YYYY')}</span>
                {video.duration > 0 && (
                  <span><Clock size={14} className="me-1" /> {Math.floor(video.duration / 60)}:{Math.floor(video.duration % 60).toString().padStart(2, '0')} min</span>
                )}
                <Badge bg="secondary" className="rounded-pill">
                  {video.videoType === 'youtube' ? 'YouTube' : video.videoType === 'vimeo' ? 'Vimeo' : 'Vidéo originale'}
                </Badge>
              </div>
              
              {/* Descripción */}
              <Card.Text className="text-muted mb-3">
                {video.description || 'Aucune description'}
              </Card.Text>
              
              {/* Tags */}
              {video.tags && video.tags.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {video.tags.map((tag, idx) => (
                    <Badge key={idx} bg="light" text="dark" className="rounded-pill">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              {/* Información del usuario */}
              <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded-3">
                <div className="d-flex align-items-center gap-3">
                  <img
                    src={video.user?.avatar || '/default-avatar.png'}
                    alt={video.user?.username}
                    style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <h6 className="mb-0 fw-bold">{video.user?.username}</h6>
                    <small className="text-muted">Membre depuis ...</small>
                  </div>
                </div>
                <Button 
                  variant={isFollowing ? 'outline-secondary' : 'primary'}
                  size="sm"
                  onClick={handleFollowUser}
                  className="rounded-pill"
                >
                  {isFollowing ? 'Abonné' : 'S\'abonner'}
                </Button>
              </div>
            </Card.Body>
          </Card>
          
          {/* Sección de comentarios */}
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-3">
                <p size={18} className="me-2" />
                Commentaires ({comments.length})
              </h5>
              
              {/* Formulario de comentario */}
              {auth.token ? (
                <Form onSubmit={handleAddComment} className="mb-4">
                  <div className="d-flex gap-3">
                    <img
                      src={auth.user?.avatar || '/default-avatar.png'}
                      alt="Avatar"
                      style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div className="flex-grow-1">
                      <Form.Control
                        as="textarea"
                        rows={2}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Ajouter un commentaire..."
                        className="mb-2"
                      />
                      <Button type="submit" size="sm" disabled={!commentText.trim()}>
                        <Send size={14} className="me-1" />
                        Commenter
                      </Button>
                    </div>
                  </div>
                </Form>
              ) : (
                <Alert variant="info" className="text-center">
                  <Button variant="link" onClick={() => history.push('/login')}>
                    Connectez-vous
                  </Button>{' '}
                  pour laisser un commentaire
                </Alert>
              )}
              
              {/* Lista de comentarios */}
              {comments.length === 0 ? (
                <p className="text-muted text-center py-3">
                  Aucun commentaire pour le moment. Soyez le premier à commenter !
                </p>
              ) : (
                <ListGroup variant="flush">
                  {comments.map((comment, idx) => (
                    <ListGroup.Item key={idx} className="px-0">
                      <div className="d-flex gap-3">
                        <img
                          src={comment.user?.avatar || '/default-avatar.png'}
                          alt={comment.user?.username}
                          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <strong className="small">{comment.user?.username}</strong>
                            <small className="text-muted">{moment(comment.createdAt).fromNow()}</small>
                          </div>
                          <p className="mb-0 small">{comment.text}</p>
                          <div className="mt-1">
                            <Button variant="link" size="sm" className="p-0 text-muted small me-2">
                              Répondre
                            </Button>
                            <Button variant="link" size="sm" className="p-0 text-muted small">
                              Signaler
                            </Button>
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        {/* Columna lateral - Videos relacionados */}
        <Col lg={4}>
          <div className="position-sticky" style={{ top: '20px' }}>
            <h5 className="mb-3">🎬 Vidéos recommandées</h5>
            {relatedVideos.length === 0 ? (
              <p className="text-muted">Aucune vidéo recommandée</p>
            ) : (
              <div className="d-flex flex-column gap-3">
                {relatedVideos.map(relatedVideo => (
                  <div 
                    key={relatedVideo._id} 
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleVideoClick(relatedVideo)}
                  >
                    <VideoCard video={relatedVideo} showActions={false} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Col>
      </Row>
      
      <style jsx="true">{`
        .position-sticky {
          position: sticky;
          top: 20px;
        }
      `}</style>
    </Container>
  );
};

export default DetailVideoPage;