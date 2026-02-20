// 📂 frontend/src/components/CardBodyCarousel.jsx - VERSIÓN OPTIMIZADA
import React, { useState, useEffect } from 'react';
import { Carousel, Spinner, Modal, Button } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, HeartFill, Bookmark, BookmarkFill } from 'react-bootstrap-icons';
import { likePost, unLikePost, savePost, unSavePost } from '../../redux/actions/postAction';

const CardBodyCarousel = ({ post }) => {
  const [isLike, setIsLike] = useState(false);
  const [loadLike, setLoadLike] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveLoad, setSaveLoad] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  
  const images = post?.images || [];

  const { auth, theme = 'light' } = useSelector((state) => state);
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Estados de like y saved
  useEffect(() => {
    if (auth.user && post?.likes?.find(like => like._id === auth.user._id)) {
      setIsLike(true);
    } else {
      setIsLike(false);
    }
  }, [post?.likes, auth.user]);

  useEffect(() => {
    if (auth.user && auth.user.saved?.includes(post?._id)) {
      setSaved(true);
    } else {
      setSaved(false);
    }
  }, [auth.user, post?._id]);

  // Simular carga de imágenes
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const isMobile = windowWidth <= 768;

  const handleLike = async (e) => {
    e.stopPropagation();
    if (!auth.token) return setShowModal(true);
    if (loadLike) return;

    setLoadLike(true);
    if (isLike) {
      await dispatch(unLikePost({ post, auth }));
    } else {
      await dispatch(likePost({ post, auth }));
    }
    setLoadLike(false);
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    if (!auth.token) return setShowModal(true);
    if (saveLoad) return;

    setSaveLoad(true);
    if (saved) {
      await dispatch(unSavePost({ post, auth }));
    } else {
      await dispatch(savePost({ post, auth }));
    }
    setSaveLoad(false);
  };

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  // Altura fija según dispositivo - sin animaciones
  const getImageHeight = () => {
    if (isMobile) return '180px';
    return '220px';
  };

  // Contenedor de imagen con aspecto fijo
  const ImageContainer = ({ src, alt }) => (
    <div 
      style={{
        width: '100%',
        height: getImageHeight(),
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover', // 'cover' recorta la imagen para llenar el contenedor
          display: 'block'
        }}
        loading="lazy"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/400x300?text=Image+non+disponible';
        }}
      />
    </div>
  );

  return (
    <div className="position-relative">
      {/* Carrusel de imágenes */}
      <div onClick={() => history.push(`/post/${post._id}`)} style={{ cursor: 'pointer' }}>
        {loading ? (
          <div 
            style={{ 
              height: getImageHeight(),
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: isMobile ? '4px' : '6px'
            }}
          >
            <Spinner animation="border" variant="primary" size="sm" />
          </div>
        ) : images.length > 0 ? (
          <Carousel
            activeIndex={index}
            onSelect={handleSelect}
            indicators={images.length > 1}
            interval={null}
            controls={images.length > 1}
            touch={true}
            prevIcon={<span className="carousel-control-prev-icon" />}
            nextIcon={<span className="carousel-control-next-icon" />}
            style={{
              borderRadius: isMobile ? '4px' : '6px',
              overflow: 'hidden'
            }}
          >
            {images.map((img, idx) => (
              <Carousel.Item key={idx}>
                <ImageContainer 
                  src={img.url || img} 
                  alt={`${post.title} - ${idx + 1}`}
                />
                
                {/* Contador de imágenes (solo si hay más de 1) */}
                {images.length > 1 && (
                  <div 
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: '500',
                      zIndex: 10
                    }}
                  >
                    {idx + 1}/{images.length}
                  </div>
                )}
              </Carousel.Item>
            ))}
          </Carousel>
        ) : (
          <div 
            style={{ 
              height: getImageHeight(),
              backgroundColor: '#f5f5f5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: isMobile ? '4px' : '6px',
              color: '#999',
              fontSize: isMobile ? '13px' : '14px'
            }}
          >
            {t("noImagesAvailable")}
          </div>
        )}
      </div>

      {/* Botón de guardado - arriba derecha */}
      <button
        onClick={handleSave}
        disabled={saveLoad}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: isMobile ? '32px' : '36px',
          height: isMobile ? '32px' : '36px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: saved ? '#ffc107' : 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 15,
          padding: 0
        }}
      >
        {saveLoad ? (
          <Spinner size="sm" />
        ) : saved ? (
          <BookmarkFill size={isMobile ? 14 : 16} color="white" />
        ) : (
          <Bookmark size={isMobile ? 14 : 16} color="#666" />
        )}
      </button>

      {/* Botón de like - arriba izquierda */}
      <button
        onClick={handleLike}
        disabled={loadLike}
        style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: isMobile ? '32px' : '36px',
          height: isMobile ? '32px' : '36px',
          borderRadius: '50%',
          border: 'none',
          backgroundColor: isLike ? '#dc3545' : 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 15,
          padding: 0
        }}
      >
        {loadLike ? (
          <Spinner size="sm" />
        ) : isLike ? (
          <HeartFill size={isMobile ? 14 : 16} color="white" />
        ) : (
          <Heart size={isMobile ? 14 : 16} color="#dc3545" />
        )}
      </button>

      {/* Contador de likes (si hay) */}
      {post?.likes?.length > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '8px',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            zIndex: 15
          }}
        >
          <HeartFill size={10} color="#ff4757" />
          <span>{post.likes.length}</span>
        </div>
      )}

      {/* Modal de autenticación */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        centered
        size="sm"
      >
        <Modal.Header closeButton>
          <Modal.Title className="d-flex align-items-center gap-2">
            <Heart size={18} color="#ff4757" />
            <span style={{ fontSize: '1rem' }}>{t("title")}</span>
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          <p className="text-muted mb-3" style={{ fontSize: '0.9rem' }}>
            {t("message")}
          </p>
          
          <div className="d-flex gap-2">
            <Button
              variant="primary"
              size="sm"
              className="flex-grow-1"
              onClick={() => history.push("/login")}
            >
              {t("login")}
            </Button>
            
            <Button
              variant="success"
              size="sm"
              className="flex-grow-1"
              onClick={() => history.push("/register")}
            >
              {t("register")}
            </Button>
          </div>
        </Modal.Body>
      </Modal>

      {/* Estilos CSS simples - sin animaciones */}
      <style>{`
        .carousel-control-prev,
        .carousel-control-next {
          width: 10%;
          background: rgba(0,0,0,0.1);
        }
        
        .carousel-indicators {
          margin-bottom: 2px;
        }
        
        .carousel-indicators button {
          width: 6px;
          height: 6px;
          border-radius: 6px;
          background-color: rgba(255,255,255,0.7);
          border: none;
        }
        
        .carousel-indicators button.active {
          background-color: white;
        }
        
        button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        @media (max-width: 768px) {
          .carousel-control-prev,
          .carousel-control-next {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(CardBodyCarousel);