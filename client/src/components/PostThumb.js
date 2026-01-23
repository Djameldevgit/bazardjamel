import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Badge } from 'react-bootstrap';
import { 
  Heart, 
  HeartFill, 
  Bookmark, 
  BookmarkFill,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  Tag,
  Image as ImageIcon
} from 'react-bootstrap-icons';
import { likePost, unLikePost, savePost, unSavePost } from '../redux/actions/postAction';
import ImageWithFallback from './ImageWithFallback';

const PostThumb = ({ posts, result }) => {
    const { theme, auth } = useSelector(state => state);
    const dispatch = useDispatch();
    
    const [hoveredPost, setHoveredPost] = useState(null);
    const [likedPosts, setLikedPosts] = useState({});
    const [savedPosts, setSavedPosts] = useState({});
    const [carouselIndexes, setCarouselIndexes] = useState({});
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

    // ✅ Inicializar likes y guardados
    useEffect(() => {
        if (!Array.isArray(posts)) return;

        const initialLikes = {};
        const initialSaved = {};
        const initialCarousel = {};
        
        posts.forEach(post => {
            if (!post || !post._id) return;
            
            // Inicializar likes
            if (post.likes?.some(like => like._id === auth.user?._id)) {
                initialLikes[post._id] = true;
            }
            
            // Inicializar guardados
            if (auth.user?.saved?.includes(post._id)) {
                initialSaved[post._id] = true;
            }
            
            // Inicializar índice del carrusel
            initialCarousel[post._id] = 0;
        });
        
        setLikedPosts(initialLikes);
        setSavedPosts(initialSaved);
        setCarouselIndexes(initialCarousel);
    }, [posts, auth.user]);

    // 🎯 Formatear precio
    const formatPrice = (price) => {
        if (!price && price !== 0) return 'Prix non disponible';
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price) + ' DA';
    };

    // 🖼️ Obtener imágenes del post
    const getPostImages = (post) => {
        if (!post) return [];
        
        // Diferentes formatos de imágenes que puede tener el post
        if (Array.isArray(post.images) && post.images.length > 0) {
            return post.images.map(img => {
                if (typeof img === 'string') return img;
                if (img?.url) return img.url;
                if (img?.secure_url) return img.secure_url;
                return null;
            }).filter(Boolean);
        }
        
        // Si hay una sola imagen en post.image
        if (post.image) {
            if (typeof post.image === 'string') return [post.image];
            if (post.image.url) return [post.image.url];
        }
        
        return [];
    };

    // 🎯 Obtener primera imagen válida
    const getFirstImage = (post) => {
        const images = getPostImages(post);
        return images.length > 0 ? images[0] : null;
    };

    // ❤️ Manejar like
    const handleLike = async (post, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!auth.token || !post) return;
        
        const postId = post._id;
        const wasLiked = likedPosts[postId];
        
        // Optimistic update
        setLikedPosts(prev => ({
            ...prev,
            [postId]: !wasLiked
        }));
        
        try {
            if (wasLiked) {
                await dispatch(unLikePost({ 
                    post, 
                    auth, 
                    socket: null, 
                    t: (key) => key,
                    languageReducer: { language: 'fr' }
                }));
            } else {
                await dispatch(likePost({ 
                    post, 
                    auth, 
                    socket: null, 
                    t: (key) => key,
                    languageReducer: { language: 'fr' }
                }));
            }
        } catch (error) {
            // Revertir si hay error
            setLikedPosts(prev => ({
                ...prev,
                [postId]: wasLiked
            }));
        }
    };

    // 💾 Manejar guardar
    const handleSave = async (post, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (!auth.token || !post) return;
        
        const postId = post._id;
        const wasSaved = savedPosts[postId];
        
        // Optimistic update
        setSavedPosts(prev => ({
            ...prev,
            [postId]: !wasSaved
        }));
        
        try {
            if (wasSaved) {
                await dispatch(unSavePost({ post, auth }));
            } else {
                await dispatch(savePost({ post, auth }));
            }
        } catch (error) {
            // Revertir si hay error
            setSavedPosts(prev => ({
                ...prev,
                [postId]: wasSaved
            }));
        }
    };

    // 🎠 Navegar carrusel
    const handleCarouselPrev = (postId, images, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        setCarouselIndexes(prev => {
            const currentIndex = prev[postId] || 0;
            const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
            
            return {
                ...prev,
                [postId]: newIndex
            };
        });
    };

    const handleCarouselNext = (postId, images, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        setCarouselIndexes(prev => {
            const currentIndex = prev[postId] || 0;
            const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
            
            return {
                ...prev,
                [postId]: newIndex
            };
        });
    };

    // 🎯 Tamaños de iconos según dispositivo
    const getIconSizes = () => {
        if (isMobile) {
            return {
                heartSize: 14,
                bookmarkSize: 12,
                badgeFontSize: '9px',
                iconButtonSize: 28,
                counterFontSize: '10px',
                chevronSize: 14
            };
        }
        return {
            heartSize: 18,
            bookmarkSize: 16,
            badgeFontSize: '11px',
            iconButtonSize: 36,
            counterFontSize: '12px',
            chevronSize: 18
        };
    };

    const iconSizes = getIconSizes();

    // 🔍 Debug: Ver qué datos llegan
    useEffect(() => {
        console.log('🔍 PostThumb recibió:', {
            postsCount: posts?.length || 0,
            posts: posts?.slice(0, 2).map(p => ({
                id: p._id,
                title: p.title,
                imagesCount: getPostImages(p).length,
                firstImage: getFirstImage(p),
                imagesArray: p.images
            }))
        });
    }, [posts]);

    if (!Array.isArray(posts) || posts.length === 0) {
        return (
            <div className="text-center py-5">
                <ImageIcon size={48} className="text-muted mb-3" />
                <p className="text-muted">Aucune publication à afficher</p>
            </div>
        );
    }

    return (
        <div className="post_thumb">
            {posts.map((post, index) => {
                if (!post || !post._id) return null;
                
                const images = getPostImages(post);
                const currentImageIndex = carouselIndexes[post._id] || 0;
                const hasMultipleImages = images.length > 1;
                const isHovered = hoveredPost === post._id;
                const currentImage = images[currentImageIndex];
                
                console.log(`📸 Post ${index}:`, {
                    id: post._id,
                    imagesCount: images.length,
                    currentImage,
                    hasMultipleImages
                });
                
                return (
                    <div 
                        key={post._id || index}
                        className="post-thumb-card-wrapper"
                        onMouseEnter={() => setHoveredPost(post._id)}
                        onMouseLeave={() => setHoveredPost(null)}
                    >
                        <Link 
                            to={`/post/${post._id}`}
                            className="text-decoration-none d-block h-100"
                        >
                            <Card className="border-0 shadow-sm h-100 overflow-hidden" style={{ 
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                borderRadius: '12px',
                                transform: isHovered ? 'translateY(-4px)' : 'none',
                                boxShadow: isHovered ? '0 10px 25px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.05)'
                            }}>
                                {/* ====== CONTENEDOR DE IMAGEN ====== */}
                                <div 
                                    className="post_thumb_display position-relative" 
                                    style={{ 
                                        height: isMobile ? '180px' : '220px',
                                        overflow: 'hidden',
                                        backgroundColor: '#f8f9fa'
                                    }}
                                >
                                    {/* Imagen principal */}
                                    {currentImage ? (
                                        <>
                                            <ImageWithFallback
                                                src={currentImage}
                                                alt={post.title || 'Image du post'}
                                                className="w-100 h-100"
                                                style={{ 
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.5s ease',
                                                    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                                                    filter: theme === 'dark' ? 'invert(1)' : 'invert(0)'
                                                }}
                                                fallbackSrc={`https://via.placeholder.com/300x200/6c757d/ffffff?text=${post.category?.name?.charAt(0) || 'P'}`}
                                            />
                                            
                                            {/* Overlay en hover */}
                                            {isHovered && (
                                                <div 
                                                    className="position-absolute top-0 start-0 w-100 h-100"
                                                    style={{
                                                        background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.3))',
                                                        zIndex: 1
                                                    }}
                                                />
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-light">
                                            <ImageIcon size={48} className="text-muted mb-3" />
                                            <p className="text-muted small mb-0">Pas d'image</p>
                                        </div>
                                    )}
                                    
                                    {/* ====== BOTONES DE CARRUSEL ====== */}
                                    {hasMultipleImages && (
                                        <>
                                            <button
                                                className="position-absolute top-50 start-0 translate-middle-y btn btn-sm btn-light rounded-circle shadow-sm border-0"
                                                style={{
                                                    width: iconSizes.iconButtonSize,
                                                    height: iconSizes.iconButtonSize,
                                                    marginLeft: '8px',
                                                    zIndex: 3,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    opacity: isHovered ? 1 : 0,
                                                    transition: 'opacity 0.2s ease'
                                                }}
                                                onClick={(e) => handleCarouselPrev(post._id, images, e)}
                                                onMouseEnter={(e) => e.stopPropagation()}
                                            >
                                                <ChevronLeft size={iconSizes.chevronSize} />
                                            </button>
                                            
                                            <button
                                                className="position-absolute top-50 end-0 translate-middle-y btn btn-sm btn-light rounded-circle shadow-sm border-0"
                                                style={{
                                                    width: iconSizes.iconButtonSize,
                                                    height: iconSizes.iconButtonSize,
                                                    marginRight: '8px',
                                                    zIndex: 3,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    opacity: isHovered ? 1 : 0,
                                                    transition: 'opacity 0.2s ease'
                                                }}
                                                onClick={(e) => handleCarouselNext(post._id, images, e)}
                                                onMouseEnter={(e) => e.stopPropagation()}
                                            >
                                                <ChevronRight size={iconSizes.chevronSize} />
                                            </button>
                                            
                                            {/* Indicadores del carrusel */}
                                            <div 
                                                className="position-absolute bottom-0 start-50 translate-middle-x d-flex gap-1 mb-2"
                                                style={{ zIndex: 3 }}
                                            >
                                                {images.map((_, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="rounded-circle"
                                                        style={{
                                                            width: '6px',
                                                            height: '6px',
                                                            backgroundColor: idx === currentImageIndex 
                                                                ? 'white' 
                                                                : 'rgba(255,255,255,0.5)',
                                                            transition: 'all 0.2s ease'
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                            
                                            {/* Contador de imágenes */}
                                            <div 
                                                className="position-absolute top-0 end-0 m-2"
                                                style={{ zIndex: 2 }}
                                            >
                                                <Badge 
                                                    bg="dark" 
                                                    className="bg-dark bg-opacity-75 px-2 py-1"
                                                    style={{ fontSize: iconSizes.badgeFontSize }}
                                                >
                                                    {currentImageIndex + 1}/{images.length}
                                                </Badge>
                                            </div>
                                        </>
                                    )}
                                    
                                    {/* ====== ICONO DE GUARDAR ====== */}
                                    <button
                                        className="position-absolute top-0 end-0 m-2 btn btn-sm rounded-circle shadow-sm border-0"
                                        style={{
                                            width: iconSizes.iconButtonSize,
                                            height: iconSizes.iconButtonSize,
                                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                            zIndex: 3,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onClick={(e) => handleSave(post, e)}
                                        onMouseEnter={(e) => e.stopPropagation()}
                                        title={savedPosts[post._id] ? "Retirer des sauvegardés" : "Sauvegarder"}
                                    >
                                        {savedPosts[post._id] ? (
                                            <BookmarkFill size={iconSizes.bookmarkSize} className="text-warning" />
                                        ) : (
                                            <Bookmark size={iconSizes.bookmarkSize} className="text-dark" />
                                        )}
                                    </button>
                                    
                                    {/* ====== CONTADOR DE LIKES ====== */}
                                    <div 
                                        className="position-absolute bottom-0 start-0 m-2 d-flex align-items-center gap-1"
                                        style={{ zIndex: 2 }}
                                    >
                                        <button
                                            className="btn btn-sm rounded-circle shadow-sm border-0 p-0 d-flex align-items-center justify-content-center"
                                            style={{
                                                width: iconSizes.iconButtonSize,
                                                height: iconSizes.iconButtonSize,
                                                backgroundColor: 'rgba(255, 255, 255, 0.95)'
                                            }}
                                            onClick={(e) => handleLike(post, e)}
                                            onMouseEnter={(e) => e.stopPropagation()}
                                            title={likedPosts[post._id] ? "Je n'aime plus" : "J'aime"}
                                        >
                                            {likedPosts[post._id] ? (
                                                <HeartFill size={iconSizes.heartSize} className="text-danger" />
                                            ) : (
                                                <Heart size={iconSizes.heartSize} className="text-dark" />
                                            )}
                                        </button>
                                        
                                        {post.likes?.length > 0 && (
                                            <Badge 
                                                bg="danger" 
                                                className="px-2 py-1"
                                                style={{ 
                                                    fontSize: iconSizes.counterFontSize,
                                                    backdropFilter: 'blur(4px)',
                                                    backgroundColor: 'rgba(220, 53, 69, 0.9)'
                                                }}
                                            >
                                                {post.likes.length}
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                                
                                {/* ====== FOOTER CON INFORMACIÓN ====== */}
                                <Card.Body className="p-3 d-flex flex-column">
                                    {/* Título */}
                                    <h6 
                                        className="fw-bold text-dark mb-2 text-truncate"
                                        style={{ 
                                            fontSize: isMobile ? '0.9rem' : '1rem',
                                            lineHeight: '1.3',
                                            minHeight: isMobile ? '2.6rem' : '3rem'
                                        }}
                                        title={post.title}
                                    >
                                        {post.title || 'Sans titre'}
                                    </h6>
                                    
                                    {/* Precio y categoría */}
                                    <div className="mt-auto">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <div className="text-success fw-bold" style={{ 
                                                fontSize: isMobile ? '1rem' : '1.2rem' 
                                            }}>
                                                {formatPrice(post.price)}
                                            </div>
                                            
                                            {post.category?.name && (
                                                <Badge 
                                                    bg="secondary" 
                                                    className="text-uppercase px-2 py-1"
                                                    style={{ fontSize: iconSizes.badgeFontSize }}
                                                >
                                                    {post.category.name.slice(0, 3)}
                                                </Badge>
                                            )}
                                        </div>
                                        
                                        {/* Información adicional */}
                                        <div className="d-flex justify-content-between align-items-center text-muted small">
                                            <div className="d-flex align-items-center gap-1">
                                                <Eye size={10} />
                                                <span>{post.views || 0}</span>
                                            </div>
                                            
                                            <div className="d-flex align-items-center gap-1">
                                                <Clock size={10} />
                                                <span>
                                                    {post.createdAt && new Date(post.createdAt).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'short'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Link>
                    </div>
                );
            })}
            
            {/* Estilos CSS */}
            <style jsx>{`
                .post_thumb {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 24px;
                    padding: 16px 0;
                }
                
                .post-thumb-card-wrapper {
                    transition: all 0.3s ease;
                }
                
                @media (max-width: 1200px) {
                    .post_thumb {
                        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                        gap: 20px;
                    }
                }
                
                @media (max-width: 768px) {
                    .post_thumb {
                        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                        gap: 16px;
                    }
                }
                
                @media (max-width: 576px) {
                    .post_thumb {
                        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                        gap: 12px;
                    }
                }
                
                /* Animación para el botón de like */
                @keyframes pulse {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); }
                }
                
                button:active {
                    animation: pulse 0.2s;
                }
                
                /* Efectos hover solo para desktop */
                @media (min-width: 769px) {
                    .post-thumb-card-wrapper:hover .post_thumb_display button {
                        opacity: 1 !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default PostThumb;