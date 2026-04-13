// components/Video/VideoComments.jsx - Versión con Redux
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getComments,
  addComment, 
  addCommentReply, 
  likeComment, 
  deleteComment,
  clearComments
} from '../../redux/actions/videoAction';
import { Heart, Reply, Trash2, Send } from 'lucide-react';
import './css/videoComment.css';

const VideoComments = ({ videoId }) => {
  const dispatch = useDispatch();
  const { auth, socket } = useSelector(state => state);
  const { 
    comments, 
    commentsTotal, 
    hasMoreComments, 
    commentsLoading 
  } = useSelector(state => state.video);
  
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [showMenu, setShowMenu] = useState(null);
  
  const commentsContainerRef = useRef(null);
  const observerRef = useRef(null);
  const lastCommentRef = useRef(null);

  // Cargar comentarios iniciales
  useEffect(() => {
    dispatch(clearComments());
    dispatch(getComments(videoId, 1));
    
    return () => {
      dispatch(clearComments());
    };
  }, [dispatch, videoId]);

  // Configurar observer para scroll infinito
  useEffect(() => {
    if (!commentsContainerRef.current || !hasMoreComments || commentsLoading) return;
    
    const options = {
      root: commentsContainerRef.current,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMoreComments && !commentsLoading) {
        const nextPage = Math.floor(comments.length / 20) + 1;
        dispatch(getComments(videoId, nextPage));
      }
    }, options);
    
    if (lastCommentRef.current) {
      observerRef.current.observe(lastCommentRef.current);
    }
    
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [comments.length, hasMoreComments, commentsLoading, dispatch, videoId]);

  // Socket.IO: Escuchar nuevos comentarios en tiempo real
  useEffect(() => {
    if (!socket) return;
    
    socket.emit('join-video-room', videoId);
    
    socket.on('new-comment', (data) => {
      if (data.videoId === videoId) {
        dispatch({ type: 'ADD_COMMENT', payload: data.comment });
      }
    });
    
    socket.on('comment-liked', (data) => {
      if (data.videoId === videoId) {
        dispatch({ 
          type: 'LIKE_COMMENT', 
          payload: { commentId: data.commentId, likes: data.likes, liked: data.liked } 
        });
      }
    });
    
    socket.on('new-reply', (data) => {
      if (data.videoId === videoId) {
        dispatch({ 
          type: 'ADD_COMMENT_REPLY', 
          payload: { commentId: data.commentId, reply: data.reply } 
        });
      }
    });
    
    socket.on('comment-deleted', (data) => {
      if (data.videoId === videoId) {
        dispatch({ type: 'DELETE_COMMENT', payload: { commentId: data.commentId } });
      }
    });
    
    return () => {
      socket.emit('leave-video-room', videoId);
      socket.off('new-comment');
      socket.off('comment-liked');
      socket.off('new-reply');
      socket.off('comment-deleted');
    };
  }, [socket, videoId, dispatch]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !auth.token) return;
    
    const result = await dispatch(addComment(videoId, newComment, auth.token));
    if (result.success) {
      setNewComment('');
      if (socket) {
        socket.emit('send-comment', { videoId, comment: result.comment });
      }
    }
  };
  
  const handleAddReply = async (commentId) => {
    if (!replyText.trim() || !auth.token) return;
    
    const result = await dispatch(addCommentReply(videoId, commentId, replyText, auth.token));
    if (result.success) {
      setReplyTo(null);
      setReplyText('');
      if (socket) {
        socket.emit('send-reply', { videoId, commentId, reply: result.reply });
      }
    }
  };
  
  const handleLikeComment = async (commentId) => {
    if (!auth.token) return;
    
    const result = await dispatch(likeComment(videoId, commentId, auth.token));
    if (result.success && socket) {
      socket.emit('like-comment', {
        videoId,
        commentId,
        userId: auth.user._id,
        liked: result.liked
      });
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!auth.token) return;
    
    const result = await dispatch(deleteComment(videoId, commentId, auth.token));
    if (result.success) {
      setShowMenu(null);
      if (socket) {
        socket.emit('delete-comment', { videoId, commentId });
      }
    }
  };

  const canModifyComment = (commentUserId) => {
    return auth.user && (
      auth.user._id === commentUserId || 
      auth.user.role === 'admin' ||
      auth.user.role === 'moderator'
    );
  };

  const formatDate = (date) => {
    const now = new Date();
    const commentDate = new Date(date);
    const diff = Math.floor((now - commentDate) / 1000);
    
    if (diff < 60) return 'ahora';
    if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
    if (diff < 604800) return `hace ${Math.floor(diff / 86400)}d`;
    return commentDate.toLocaleDateString();
  };

  return (
    <div className="video-comments-container">
      <div className="comments-header">
        <h5>{commentsTotal} Comentarios</h5>
      </div>
      
      {auth.token && (
        <div className="comment-form-wrapper">
          <form onSubmit={handleAddComment} className="comment-form">
            <img
              src={auth.user?.avatar || '/default-avatar.png'}
              alt={auth.user?.username}
              className="comment-form-avatar"
            />
            <div className="comment-form-input-wrapper">
              <textarea
                className="comment-form-input"
                placeholder="Añadir comentario..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows="1"
              />
              <button 
                type="submit" 
                className="comment-form-send"
                disabled={!newComment.trim()}
              >
                <Send size={18} />
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="comments-list" ref={commentsContainerRef}>
        {comments.length === 0 && !commentsLoading ? (
          <div className="no-comments">
            <p>No hay comentarios todavía</p>
            <span>¡Sé el primero en comentar!</span>
          </div>
        ) : (
          comments.map((comment, index) => (
            <div 
              key={comment._id} 
              className="comment-item"
              ref={index === comments.length - 1 ? lastCommentRef : null}
            >
              <img
                src={comment.user?.avatar || '/default-avatar.png'}
                alt={comment.user?.username}
                className="comment-avatar"
              />
              <div className="comment-content">
                <div className="comment-header">
                  <div className="comment-user-info">
                    <strong className="comment-username">@{comment.user?.username}</strong>
                    <span className="comment-time">{formatDate(comment.createdAt)}</span>
                    {comment.user?.isPro && <span className="pro-badge">Pro</span>}
                  </div>
                  
                  {canModifyComment(comment.user?._id) && (
                    <div className="comment-menu">
                      <button 
                        className="comment-menu-btn"
                        onClick={() => setShowMenu(showMenu === comment._id ? null : comment._id)}
                      >
                        ⋮
                      </button>
                      {showMenu === comment._id && (
                        <div className="comment-dropdown">
                          <button onClick={() => handleDeleteComment(comment._id)}>
                            <Trash2 size={14} />
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                <p className="comment-text">{comment.text}</p>
                
                <div className="comment-actions">
                  <button 
                    className={`comment-like-btn ${comment.liked ? 'liked' : ''}`}
                    onClick={() => handleLikeComment(comment._id)}
                  >
                    <Heart size={16} />
                    <span>{comment.likes?.length || 0}</span>
                  </button>
                  <button 
                    className="comment-reply-btn"
                    onClick={() => setReplyTo(replyTo === comment._id ? null : comment._id)}
                  >
                    <Reply size={16} />
                    <span>Responder</span>
                  </button>
                </div>
                
                {comment.replies && comment.replies.length > 0 && (
                  <div className="replies-list">
                    {comment.replies.map(reply => (
                      <div key={reply._id} className="reply-item">
                        <img
                          src={reply.user?.avatar || '/default-avatar.png'}
                          alt={reply.user?.username}
                          className="reply-avatar"
                        />
                        <div className="reply-content">
                          <div className="reply-header">
                            <strong className="reply-username">@{reply.user?.username}</strong>
                            <span className="reply-time">{formatDate(reply.createdAt)}</span>
                          </div>
                          <p className="reply-text">{reply.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {replyTo === comment._id && (
                  <div className="reply-form">
                    <img
                      src={auth.user?.avatar || '/default-avatar.png'}
                      alt={auth.user?.username}
                      className="reply-form-avatar"
                    />
                    <div className="reply-form-input-wrapper">
                      <textarea
                        className="reply-form-input"
                        placeholder="Escribe una respuesta..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        rows="1"
                      />
                      <button 
                        className="reply-form-send"
                        onClick={() => handleAddReply(comment._id)}
                        disabled={!replyText.trim()}
                      >
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        
        {commentsLoading && (
          <div className="loading-more">
            <div className="loading-spinner"></div>
            <span>Cargando más comentarios...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoComments;