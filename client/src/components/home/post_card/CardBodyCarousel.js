import React, { useState, useEffect } from 'react';
import Carousel from '../../Carousel';
import { likePost, unLikePost, savePost, unSavePost } from '../../../redux/actions/postAction';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
// Importar React Bootstrap Icons
import { 
  Heart, 
  HeartFill, 
  Bookmark, 
  BookmarkFill,
  Person,
  PersonPlus
} from 'react-bootstrap-icons';

const CardBodyCarousel = ({ post }) => {
    const [isLike, setIsLike] = useState(false);
    const [loadLike, setLoadLike] = useState(false);
    const [saved, setSaved] = useState(false);
    const [saveLoad, setSaveLoad] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const { languageReducer, auth, socket } = useSelector((state) => state);
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();

    // 🔍 Detectar tamaño de pantalla
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 📱 Determinar tamaño de dispositivo
    const isMobile = windowWidth <= 768;
    const isTablet = windowWidth > 768 && windowWidth <= 1024;
    const isDesktop = windowWidth > 1024;

    // ✅ Manejo seguro de likes
    useEffect(() => {
        if (auth.user && post?.likes?.find(like => like._id === auth.user._id)) {
            setIsLike(true);
        } else {
            setIsLike(false);
        }
    }, [post?.likes, auth.user]);

    // ✅ Manejo seguro de guardado
    useEffect(() => {
        if (auth.user && auth.user.saved?.includes(post?._id)) {
            setSaved(true);
        } else {
            setSaved(false);
        }
    }, [auth.user, post?._id]);

    const handleLike = async () => {
        if (!auth.token) return setShowModal(true);
        if (loadLike) return;

        setLoadLike(true);
        await dispatch(likePost({ post, auth, socket, t, languageReducer }));
        setLoadLike(false);
    };

    const handleUnLike = async () => {
        if (!auth.token) return setShowModal(true);
        if (loadLike) return;

        setLoadLike(true);
        await dispatch(unLikePost({ post, auth, socket, t, languageReducer }));
        setLoadLike(false);
    };

    const handleSavePost = async () => {
        if (!auth.token) return setShowModal(true);
        if (saveLoad) return;

        setSaveLoad(true);
        await dispatch(savePost({ post, auth }));
        setSaveLoad(false);
    };

    const handleUnSavePost = async () => {
        if (!auth.token) return setShowModal(true);
        if (saveLoad) return;

        setSaveLoad(true);
        await dispatch(unSavePost({ post, auth }));
        setSaveLoad(false);
    };

    if (!post) return null;

    const images = post.images || [];

    // 🎯 Tamaños ultra compactos para móviles
    const getIconSizes = () => {
        if (isMobile) {
            return {
                bookmarkSize: 12,
                heartSize: 11,
                counterFontSize: '10px',
                buttonSize: 22,
                containerPadding: '2px 4px',
                gap: '2px',
                marginRight: '1px',
                topMargin: '4px',
                sideMargin: '4px',
            };
        }
        if (isTablet) {
            return {
                bookmarkSize: 14,
                heartSize: 13,
                counterFontSize: '11px',
                buttonSize: 26,
                containerPadding: '3px 6px',
                gap: '3px',
                marginRight: '2px',
                topMargin: '6px',
                sideMargin: '6px',
            };
        }
        return {
            bookmarkSize: 16,
            heartSize: 14,
            counterFontSize: '12px',
            buttonSize: 30,
            containerPadding: '4px 8px',
            gap: '4px',
            marginRight: '3px',
            topMargin: '8px',
            sideMargin: '8px',
        };
    };

    const iconSizes = getIconSizes();

    return (
        <div>
            <div className="card_body">
                {images.length > 0 && (
                    <div className="carousel-container" style={{ position: 'relative' }}>
                        {/* ====== ICONO DE GUARDADO ====== */}
                        <div
                            className="bookmark-button"
                            style={{
                                position: 'absolute',
                                top: iconSizes.topMargin,
                                right: iconSizes.sideMargin,
                                zIndex: 10,
                                cursor: 'pointer',
                                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                                borderRadius: '50%',
                                width: `${iconSizes.buttonSize}px`,
                                height: `${iconSizes.buttonSize}px`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                                transition: 'all 0.2s ease',
                                border: '1px solid rgba(0,0,0,0.05)',
                                backdropFilter: isMobile ? 'none' : 'blur(4px)',
                                background: isMobile 
                                    ? 'rgba(255, 255, 255, 0.98)' 
                                    : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.98) 100%)',
                            }}
                            onClick={saved ? handleUnSavePost : handleSavePost}
                            title={saved ? t("removeFromSaved") : t("savePost")}
                        >
                            {saved ? (
                                <BookmarkFill 
                                    size={iconSizes.bookmarkSize} 
                                    color="#ff8c00" 
                                />
                            ) : (
                                <Bookmark 
                                    size={iconSizes.bookmarkSize} 
                                    color="#2c3e50"
                                />
                            )}
                        </div>

                        {/* ====== ICONO DE LIKES ====== */}
                        <div
                            className="like-container"
                            style={{
                                position: 'absolute',
                                top: iconSizes.topMargin,
                                left: iconSizes.sideMargin,
                                zIndex: 10,
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: iconSizes.gap,
                                backgroundColor: 'rgba(255, 255, 255, 0.98)',
                                borderRadius: '16px',
                                padding: iconSizes.containerPadding,
                                boxShadow: '0 1px 4px rgba(0,0,0,0.1)',
                                border: '1px solid rgba(0,0,0,0.05)',
                                backdropFilter: isMobile ? 'none' : 'blur(4px)',
                                background: isMobile 
                                    ? 'rgba(255, 255, 255, 0.98)' 
                                    : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,250,0.98) 100%)',
                            }}
                        >
                            <span
                                className="like-counter"
                                style={{
                                    fontSize: iconSizes.counterFontSize,
                                    fontWeight: '600',
                                    color: '#ff4757',
                                    textAlign: 'center',
                                    fontFamily: 'Arial, sans-serif',
                                    lineHeight: 1,
                                    marginRight: iconSizes.marginRight,
                                    padding: '0 1px',
                                    minWidth: 'auto',
                                }}
                            >
                                {post.likes?.length || 0}
                            </span>

                            <div
                                className="like-button"
                                style={{
                                    cursor: 'pointer',
                                    width: isMobile ? '20px' : '24px',
                                    height: isMobile ? '20px' : '24px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease',
                                    padding: 0,
                                    minWidth: isMobile ? '20px' : '24px',
                                    minHeight: isMobile ? '20px' : '24px',
                                }}
                                onClick={isLike ? handleUnLike : handleLike}
                                title={isLike ? t("unlike") : t("like")}
                            >
                                {isLike ? (
                                    <HeartFill 
                                        size={iconSizes.heartSize} 
                                        color="#ff4757" 
                                        className={isLike ? 'pulse-animation' : ''}
                                    />
                                ) : (
                                    <Heart 
                                        size={iconSizes.heartSize} 
                                        color="#2c3e50"
                                    />
                                )}
                            </div>
                        </div>

                        {/* ====== CARRUSEL ====== */}
                        <div className="card">
                            <div
                                className="card__image"
                                onClick={() => history.push(`/post/${post._id}`)}
                                style={{ 
                                    cursor: 'pointer',
                                    borderRadius: isMobile ? '4px' : '6px',
                                    overflow: 'hidden',
                                }}
                            >
                                <Carousel images={images} id={post._id} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* ====== MODAL ====== */}
            {showModal && (
                <div 
                    className="modal-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: isMobile ? '12px' : '16px',
                    }}
                    onClick={() => setShowModal(false)}
                >
                    <div 
                        className="modal-content"
                        style={{
                            backgroundColor: 'white',
                            padding: isMobile ? '16px' : '20px',
                            borderRadius: isMobile ? '8px' : '10px',
                            maxWidth: '350px',
                            width: '100%',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                            margin: 'auto',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h4 style={{ 
                            marginBottom: isMobile ? '10px' : '14px', 
                            color: '#333',
                            fontFamily: 'Arial, sans-serif',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: isMobile ? '16px' : '18px',
                        }}>
                            <Heart size={isMobile ? 18 : 20} color="#ff4757" />
                            {t("title", { lng: languageReducer.language })}
                        </h4>
                        
                        <p style={{ 
                            marginBottom: isMobile ? '16px' : '20px', 
                            color: '#666',
                            lineHeight: '1.4',
                            fontFamily: 'Arial, sans-serif',
                            fontSize: isMobile ? '13px' : '14px',
                        }}>
                            {t("message", { lng: languageReducer.language })}
                        </p>
                        
                        <div style={{ 
                            display: 'flex', 
                            gap: isMobile ? '6px' : '8px',
                            justifyContent: 'flex-end',
                            flexWrap: 'wrap' 
                        }}>
                            <button
                                className="modal-button"
                                style={{
                                    padding: isMobile ? '6px 12px' : '8px 16px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: isMobile ? '12px' : '13px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: isMobile ? '4px' : '6px',
                                    fontWeight: '500',
                                    fontFamily: 'Arial, sans-serif',
                                    transition: 'all 0.15s ease',
                                    flex: isMobile ? '1 1 auto' : 'none',
                                    minHeight: isMobile ? '36px' : '40px',
                                }}
                                onClick={() => history.push("/login")}
                            >
                                <Person size={isMobile ? 12 : 14} />
                                {t("login", { lng: languageReducer.language })}
                            </button>
                            
                            <button
                                className="modal-button"
                                style={{
                                    padding: isMobile ? '6px 12px' : '8px 16px',
                                    backgroundColor: '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: isMobile ? '12px' : '13px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: isMobile ? '4px' : '6px',
                                    fontWeight: '500',
                                    fontFamily: 'Arial, sans-serif',
                                    transition: 'all 0.15s ease',
                                    flex: isMobile ? '1 1 auto' : 'none',
                                    minHeight: isMobile ? '36px' : '40px',
                                }}
                                onClick={() => history.push("/register")}
                            >
                                <PersonPlus size={isMobile ? 12 : 14} />
                                {t("register", { lng: languageReducer.language })}
                            </button>
                            
                            <button
                                className="modal-button"
                                style={{
                                    padding: isMobile ? '6px 12px' : '8px 16px',
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: isMobile ? '12px' : '13px',
                                    fontWeight: '500',
                                    fontFamily: 'Arial, sans-serif',
                                    transition: 'all 0.15s ease',
                                    flex: isMobile ? '1 1 100%' : 'none',
                                    minHeight: isMobile ? '36px' : '40px',
                                }}
                                onClick={() => setShowModal(false)}
                            >
                                {t("close", { lng: languageReducer.language })}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            {/* ✅ CAMBIADO: Eliminado el atributo jsx */}
            <style>{`
                /* Animación simple */
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                
                .pulse-animation {
                    animation: pulse 0.3s ease;
                }
                
                /* Optimizar para pantallas muy pequeñas (Android) */
                @media (max-width: 360px) {
                    .bookmark-button {
                        width: 20px !important;
                        height: 20px !important;
                        top: 3px !important;
                        right: 3px !important;
                    }
                    
                    .bookmark-button svg {
                        width: 10px !important;
                        height: 10px !important;
                    }
                    
                    .like-container {
                        top: 3px !important;
                        left: 3px !important;
                        padding: 1px 3px !important;
                        gap: 1px !important;
                        border-radius: 12px !important;
                    }
                    
                    .like-button {
                        width: 18px !important;
                        height: 18px !important;
                        min-width: 18px !important;
                        min-height: 18px !important;
                    }
                    
                    .like-button svg {
                        width: 10px !important;
                        height: 10px !important;
                    }
                    
                    .like-counter {
                        font-size: 9px !important;
                        margin-right: 0px !important;
                        padding: 0 !important;
                    }
                }
                
                /* Para pantallas móviles normales */
                @media (max-width: 768px) {
                    .bookmark-button, 
                    .like-button {
                        min-height: 24px !important;
                        min-width: 24px !important;
                    }
                    
                    .modal-button {
                        min-height: 36px !important;
                    }
                }
                
                /* Efectos táctiles para móviles */
                @media (max-width: 768px) {
                    .bookmark-button:active {
                        transform: scale(0.9) !important;
                        background-color: white !important;
                    }
                    
                    .like-button:active {
                        transform: scale(0.9) !important;
                        background-color: rgba(255, 71, 87, 0.1) !important;
                    }
                    
                    .modal-button:active {
                        opacity: 0.9;
                        transform: scale(0.95);
                    }
                }
                
                /* Efectos hover solo para desktop */
                @media (min-width: 769px) {
                    .bookmark-button:hover {
                        transform: scale(1.05);
                        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    }
                    
                    .like-button:hover {
                        transform: scale(1.05);
                        background-color: rgba(255, 71, 87, 0.05);
                    }
                    
                    .modal-button:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                    }
                }
                
                /* Eliminar efectos que consumen recursos en móviles */
                @media (max-width: 768px) {
                    .bookmark-button::after,
                    .like-container::after {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
};

export default CardBodyCarousel;