// components/Video/VideoCommentsSheet.jsx
import React, { useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import VideoComments from './VideoComments';

const VideoCommentsSheet = ({ show, onClose, videoId, video, commentsCount }) => {
  const sheetRef = useRef(null);
  const startY = useRef(0);
  const currentY = useRef(0);
  
  // Cerrar con tecla ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && show) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [show, onClose]);
  
  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [show]);
  
  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
  };
  
  const handleTouchMove = (e) => {
    const deltaY = e.touches[0].clientY - startY.current;
    if (deltaY > 0 && sheetRef.current) {
      currentY.current = deltaY;
      sheetRef.current.style.transform = `translateY(${deltaY}px)`;
    }
  };
  
  const handleTouchEnd = () => {
    if (currentY.current > 100) {
      onClose();
    }
    if (sheetRef.current) {
      sheetRef.current.style.transform = '';
      currentY.current = 0;
    }
  };
  
  if (!show) return null;
  
  return (
    <div className="comments-sheet-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1050,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end'
    }}>
      {/* Backdrop */}
      <div 
        className="comments-backdrop"
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          animation: 'fadeIn 0.2s ease'
        }}
      />
      
      {/* Bottom Sheet */}
      <div 
        ref={sheetRef}
        className="comments-sheet"
        style={{
          position: 'relative',
          background: '#121212',
          borderRadius: '20px 20px 0 0',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.3s ease',
          transform: 'translateY(0)',
          transition: 'transform 0.2s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Handle para arrastrar */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 8px' }}>
          <div style={{ width: 40, height: 4, background: '#555', borderRadius: 2 }} />
        </div>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 16px 12px',
          borderBottom: '1px solid #2a2a2a'
        }}>
          <h5 style={{ color: 'white', margin: 0 }}>{commentsCount} commentaires</h5>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              padding: 8
            }}
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Video miniaturizado que se "empuja" hacia arriba */}
        <div style={{
          padding: 16,
          borderBottom: '1px solid #2a2a2a',
          display: 'flex',
          justifyContent: 'center',
          background: '#000'
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            maxWidth: 300,
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}>
            <video
              src={video.videoUrl}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: 200,
                objectFit: 'cover'
              }}
            />
          </div>
        </div>
        
        {/* Lista de comentarios con scroll */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
          <VideoComments videoId={videoId} />
        </div>
      </div>
      
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default VideoCommentsSheet;