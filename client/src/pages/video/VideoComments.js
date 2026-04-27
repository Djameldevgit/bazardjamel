// components/Video/VideoComments.jsx - VERSIÓN ALTERNATIVA (CONSERVA LA ESTRUCTURA ORIGINAL)

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getComments,
  clearComments
} from '../../redux/actions/videoAction';
 
//import CommentDisplay from '../comments/CommentDisplay';
//import InputComment from '../comments/InputComment';
import CommentDisplay from './comments/CommentDisplay';
import InputComment from './comments/InputComment';
import './VideoCommentsModern.css';
  
const VideoComments = ({ videoId, videoData, onClose }) => {
  const dispatch = useDispatch();
  const { auth, socket } = useSelector(state => state);
  const { comments, commentsTotal, hasMoreComments, commentsLoading } = useSelector(state => state.video);
  
  const [showReplyInput, setShowReplyInput] = useState(null);
  const [replyComments, setReplyComments] = useState([]);
  const [showComments, setShowComments] = useState([]);
  const [next, setNext] = useState(5);
  
  const commentsContainerRef = useRef(null);
  const observerRef = useRef(null);
  const lastCommentRef = useRef(null);

  // Cargar comentarios
  useEffect(() => {
    dispatch(clearComments());
    dispatch(getComments(videoId, 1));
    
    return () => {
      dispatch(clearComments());
    };
  }, [dispatch, videoId]);

  // Filtrar comentarios principales y respuestas
  useEffect(() => {
    if (!comments.length) return;
    
    const mainComments = comments.filter(cm => !cm.reply);
    const replies = comments.filter(cm => cm.reply);
    
    setShowComments(mainComments.slice(0, next));
    setReplyComments(replies);
  }, [comments, next]);

  // Intersection Observer para infinite scroll
  useEffect(() => {
    if (!commentsContainerRef.current || !hasMoreComments || commentsLoading) return;
    
    const options = { root: commentsContainerRef.current, rootMargin: '100px', threshold: 0.1 };
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMoreComments && !commentsLoading) {
        const nextPage = Math.floor(comments.length / 20) + 1;
        dispatch(getComments(videoId, nextPage));
      }
    }, options);
    
    if (lastCommentRef.current) {
      observerRef.current.observe(lastCommentRef.current);
    }
    
    return () => observerRef.current?.disconnect();
  }, [comments.length, hasMoreComments, commentsLoading, dispatch, videoId]);

  // Socket events
  useEffect(() => {
    if (!socket) return;
    
    socket.emit('join-video-room', videoId);
    
    const handlers = {
      'new-comment': (data) => {
        if (data.videoId === videoId && data.comment) {
          dispatch({ type: 'ADD_COMMENT', payload: { comment: data.comment, videoId } });
        }
      },
      'comment-liked': (data) => {
        if (data.videoId === videoId) {
          dispatch({ type: 'LIKE_COMMENT', payload: { commentId: data.commentId, likes: data.likes, liked: data.liked } });
        }
      },
      'new-reply': (data) => {
        if (data.videoId === videoId) {
          dispatch({ type: 'ADD_COMMENT_REPLY', payload: { commentId: data.commentId, reply: data.reply } });
        }
      },
      'comment-deleted': (data) => {
        if (data.videoId === videoId) {
          dispatch({ type: 'DELETE_COMMENT', payload: { commentId: data.commentId } });
        }
      }
    };
    
    Object.entries(handlers).forEach(([event, handler]) => socket.on(event, handler));
    
    return () => {
      socket.emit('leave-video-room', videoId);
      Object.keys(handlers).forEach(event => socket.off(event));
    };
  }, [socket, videoId, dispatch]);

  const handleLoadMore = () => {
    setNext(prev => prev + 10);
  };

  const handleHideComments = () => {
    setNext(5);
  };

  // Crear objeto video para los componentes hijos
  const video = videoData || { _id: videoId, comments: comments };

  return (
    <div className="video-comments-container">
      {/* Header con drag handle (si es modal) */}
      {onClose && (
        <div className="comments-header">
          <div className="header-drag-handle">
            <div className="drag-bar" />
          </div>
          <h3>
            <span className="comments-count">{commentsTotal}</span>
            {commentsTotal === 1 ? ' Commentaire' : ' Commentaires'}
          </h3>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
      )}

      {/* Header simplificado (si está embebido) */}
      {!onClose && (
        <div className="comments-header">
          <h5>{commentsTotal} {commentsTotal === 1 ? 'commentaire' : 'commentaires'}</h5>
        </div>
      )}
      
      {/* Input para nuevo comentario principal */}
      {auth.token && (
        <div className="comment-input-section">
          <InputComment 
            video={video}
            onReply={null}
            setOnReply={null}
          />
        </div>
      )}
      
      {/* Lista de comentarios */}
      <div className="comments-list-scrollable" ref={commentsContainerRef}>
        {showComments.length === 0 && !commentsLoading ? (
          <div className="no-comments">
            <div className="no-comments-icon">💬</div>
            <p>Aucun commentaire pour le moment</p>
            <span>Soyez le premier à commenter !</span>
          </div>
        ) : (
          <>
            {showComments.map((comment, index) => (
              <CommentDisplay
                key={comment._id || index}
                comment={comment}
                video={video}
                replyCm={replyComments.filter(item => item.reply === comment._id)}
              />
            ))}
            
            {/* Botones de ver más / ocultar */}
            {comments.length - showComments.length > 0 && (
              <div 
                className="load-more-comments"
                onClick={handleLoadMore}
              >
                Voir plus de commentaires ({comments.length - showComments.length})
              </div>
            )}
            
            {comments.length > 5 && showComments.length === comments.length && (
              <div 
                className="hide-comments"
                onClick={handleHideComments}
              >
                Masquer les commentaires
              </div>
            )}
          </>
        )}
        
        {/* Loading indicator */}
        {commentsLoading && (
          <div className="loading-more">
            <div className="loading-spinner"></div>
            <span>Chargement...</span>
          </div>
        )}
        
        {/* Elemento para observer de infinite scroll */}
        <div ref={lastCommentRef} style={{ height: '1px' }} />
      </div>
    </div>
  );
};

export default VideoComments;