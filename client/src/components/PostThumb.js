// 📂 frontend/src/components/PostThumb.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Heart, 
  HeartFill, 
  Bookmark, 
  BookmarkFill,
  ChevronLeft,
  ChevronRight,
  Eye,
  Clock,
  Image as ImageIcon,
  GeoAlt,
  PersonCircle
} from 'react-bootstrap-icons';
import { likePost, unLikePost, savePost, unSavePost } from '../redux/actions/postAction';
import ImageWithFallback from './ImageWithFallback';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

const PostThumb = ({ posts, result }) => {
    const { auth } = useSelector(state => state);
    const dispatch = useDispatch();
    
    const [hoveredPost, setHoveredPost] = useState(null);
    const [likedPosts, setLikedPosts] = useState({});
    const [savedPosts, setSavedPosts] = useState({});
    const [carouselIndexes, setCarouselIndexes] = useState({});
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Detectar tamaño de pantalla
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isMobile = windowWidth <= 768;

    // Inicializar likes y guardados
    useEffect(() => {
        if (!Array.isArray(posts)) return;

        const initialLikes = {};
        const initialSaved = {};
        const initialCarousel = {};
        
        posts.forEach(post => {
            if (!post || !post._id) return;
            
            if (post.likes?.some(like => like._id === auth.user?._id)) {
                initialLikes[post._id] = true;
            }
            
            if (auth.user?.saved?.includes(post._id)) {
                initialSaved[post._id] = true;
            }
            
            initialCarousel[post._id] = 0;
        });
        
        setLikedPosts(initialLikes);
        setSavedPosts(initialSaved);
        setCarouselIndexes(initialCarousel);
    }, [posts, auth.user]);

    // Formatear precio (solo número + DA)
    const formatPrice = (price) => {
        if (!price && price !== 0) return null;
        return `${price?.toLocaleString()} DA`;
    };

    // Obtener imágenes del post
    const getPostImages = (post) => {
        if (!post) return [];
        
        if (Array.isArray(post.images) && post.images.length > 0) {
            return post.images.map(img => {
                if (typeof img === 'string') return img;
                if (img?.url) return img.url;
                if (img?.secure_url) return img.secure_url;
                return null;
            }).filter(Boolean);
        }
        
        if (post.image) {
            if (typeof post.image === 'string') return [post.image];
            if (post.image.url) return [post.image.url];
        }
        
        return [];
    };

    // Obtener título
    const getDisplayTitle = (post) => {
        if (post.title) return post.title;
        if (post.subCategory && post.articleType) {
            return `${post.subCategory} ${post.articleType}`;
        }
        return post.subCategory || post.articleType || 'Annonce';
    };

    // Obtener ubicación
    const getLocation = (post) => {
        const wilaya = post.wilaya || post.location?.wilaya;
        const commune = post.commune || post.location?.commune;
        if (!wilaya && !commune) return null;
        return `${wilaya || ''} ${commune ? `- ${commune}` : ''}`;
    };

    // Handlers
    const handleLike = async (post, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!auth.token || !post) return;
        
        const postId = post._id;
        const wasLiked = likedPosts[postId];
        
        setLikedPosts(prev => ({ ...prev, [postId]: !wasLiked }));
        
        try {
            if (wasLiked) {
                await dispatch(unLikePost({ post, auth }));
            } else {
                await dispatch(likePost({ post, auth }));
            }
        } catch (error) {
            setLikedPosts(prev => ({ ...prev, [postId]: wasLiked }));
        }
    };

    const handleSave = async (post, e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!auth.token || !post) return;
        
        const postId = post._id;
        const wasSaved = savedPosts[postId];
        
        setSavedPosts(prev => ({ ...prev, [postId]: !wasSaved }));
        
        try {
            if (wasSaved) {
                await dispatch(unSavePost({ post, auth }));
            } else {
                await dispatch(savePost({ post, auth }));
            }
        } catch (error) {
            setSavedPosts(prev => ({ ...prev, [postId]: wasSaved }));
        }
    };

    const handleCarouselPrev = (postId, images, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        setCarouselIndexes(prev => {
            const currentIndex = prev[postId] || 0;
            const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
            return { ...prev, [postId]: newIndex };
        });
    };

    const handleCarouselNext = (postId, images, e) => {
        e.preventDefault();
        e.stopPropagation();
        
        setCarouselIndexes(prev => {
            const currentIndex = prev[postId] || 0;
            const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
            return { ...prev, [postId]: newIndex };
        });
    };

    if (!Array.isArray(posts) || posts.length === 0) {
        return (
            <div className="text-center py-5">
                <ImageIcon size={48} color="#9ca3af" className="mb-3" />
                <p style={{ color: '#6b7280' }}>Aucune publication à afficher</p>
            </div>
        );
    }

    return (
        <div className="post-thumb-grid">
            {posts.map((post) => {
                if (!post || !post._id) return null;
                
                const images = getPostImages(post);
                const currentImageIndex = carouselIndexes[post._id] || 0;
                const hasMultipleImages = images.length > 1;
                const currentImage = images[currentImageIndex];
                const isHovered = hoveredPost === post._id;
                
                return (
                    <div 
                        key={post._id}
                        className="post-thumb-wrapper"
                        onMouseEnter={() => setHoveredPost(post._id)}
                        onMouseLeave={() => setHoveredPost(null)}
                    >
                        <Link 
                            to={`/post/${post._id}`}
                            className="post-thumb-link"
                        >
                            <div className="post-thumb-card">
                                {/* ====== CONTENEDOR DE IMAGEN ====== */}
                                <div className="post-thumb-image-container">
                                    {currentImage ? (
                                        <>
                                            <ImageWithFallback
                                                src={currentImage}
                                                alt={getDisplayTitle(post)}
                                                className="post-thumb-image"
                                                fallbackSrc={`https://via.placeholder.com/300x200/e5e7eb/9ca3af?text=Image`}
                                            />
                                            
                                            {/* Controles del carrusel (solo en hover) */}
                                            {hasMultipleImages && isHovered && (
                                                <>
                                                    <button
                                                        className="post-thumb-carousel-btn post-thumb-carousel-prev"
                                                        onClick={(e) => handleCarouselPrev(post._id, images, e)}
                                                    >
                                                        <ChevronLeft size={isMobile ? 14 : 16} color="#4b5563" />
                                                    </button>
                                                    
                                                    <button
                                                        className="post-thumb-carousel-btn post-thumb-carousel-next"
                                                        onClick={(e) => handleCarouselNext(post._id, images, e)}
                                                    >
                                                        <ChevronRight size={isMobile ? 14 : 16} color="#4b5563" />
                                                    </button>
                                                </>
                                            )}
                                            
                                            {/* Contador de imágenes */}
                                            {hasMultipleImages && (
                                                <div className="post-thumb-image-counter">
                                                    {currentImageIndex + 1}/{images.length}
                                                </div>
                                            )}
                                            
                                            {/* Botón de guardar */}
                                            <button
                                                className="post-thumb-save-btn"
                                                onClick={(e) => handleSave(post, e)}
                                                style={{
                                                    backgroundColor: savedPosts[post._id] ? '#e5e7eb' : '#ffffff'
                                                }}
                                            >
                                                {savedPosts[post._id] ? (
                                                    <BookmarkFill size={isMobile ? 12 : 14} color="#4b5563" />
                                                ) : (
                                                    <Bookmark size={isMobile ? 12 : 14} color="#6b7280" />
                                                )}
                                            </button>
                                            
                                            {/* Botón de like */}
                                            <button
                                                className="post-thumb-like-btn"
                                                onClick={(e) => handleLike(post, e)}
                                                style={{
                                                    backgroundColor: likedPosts[post._id] ? '#fee2e2' : '#ffffff'
                                                }}
                                            >
                                                {likedPosts[post._id] ? (
                                                    <HeartFill size={isMobile ? 12 : 14} color="#dc2626" />
                                                ) : (
                                                    <Heart size={isMobile ? 12 : 14} color="#6b7280" />
                                                )}
                                            </button>
                                            
                                            {/* Contador de likes */}
                                            {post.likes?.length > 0 && (
                                                <div className="post-thumb-likes-counter">
                                                    <HeartFill size={8} color="#dc2626" />
                                                    <span>{post.likes.length}</span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="post-thumb-no-image">
                                            <ImageIcon size={32} color="#9ca3af" />
                                            <span>Pas d'image</span>
                                        </div>
                                    )}
                                </div>

                                {/* ====== FOOTER DEL POST (estilo minimalista) ====== */}
                                <div className="post-thumb-footer">
                                    {/* FILA 1: Título */}
                                    <div className="post-thumb-row">
                                        <span className="post-thumb-title">
                                            {getDisplayTitle(post)}
                                        </span>
                                    </div>

                                    {/* FILA 2: Precio (solo en rojo) */}
                                    {formatPrice(post.price) && (
                                        <div className="post-thumb-row">
                                            <span className="post-thumb-price">
                                                {formatPrice(post.price)}
                                            </span>
                                        </div>
                                    )}

                                    {/* FILA 3: Ubicación */}
                                    {getLocation(post) && (
                                        <div className="post-thumb-row">
                                            <span className="post-thumb-location">
                                                <GeoAlt size={10} color="#9ca3af" className="me-1" />
                                                {getLocation(post)}
                                            </span>
                                        </div>
                                    )}

                                    {/* FILA 4: Fecha y vistas */}
                                    <div className="post-thumb-row d-flex justify-content-between">
                                        <span className="post-thumb-date">
                                            <Clock size={10} color="#9ca3af" className="me-1" />
                                            {moment(post.createdAt).fromNow()}
                                        </span>
                                        <span className="post-thumb-views">
                                            <Eye size={10} color="#9ca3af" className="me-1" />
                                            {post.views || 0}
                                        </span>
                                    </div>

                                    {/* FILA 5: Vendedor */}
                                    <div className="post-thumb-seller">
                                        {post.user?.avatar ? (
                                            <img 
                                                src={post.user.avatar} 
                                                alt={post.user?.name || 'Vendeur'}
                                                className="post-thumb-seller-avatar"
                                            />
                                        ) : (
                                            <PersonCircle size={16} color="#9ca3af" />
                                        )}
                                        <span className="post-thumb-seller-name">
                                            {post.user?.name || 'Vendeur'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                );
            })}

            {/* Estilos CSS simplificados */}
            <style jsx="true">{`
                .post-thumb-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 20px;
                    padding: 16px 0;
                }
                
                .post-thumb-wrapper {
                    width: 100%;
                }
                
                .post-thumb-link {
                    text-decoration: none;
                    display: block;
                    height: 100%;
                }
                
                .post-thumb-card {
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    overflow: hidden;
                    background-color: #ffffff;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                }
                
                /* Contenedor de imagen */
                .post-thumb-image-container {
                    position: relative;
                    height: ${isMobile ? '180px' : '200px'};
                    background-color: #f9fafb;
                    overflow: hidden;
                }
                
                .post-thumb-image {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                
                .post-thumb-no-image {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    color: #9ca3af;
                    font-size: 12px;
                    gap: 8px;
                }
                
                /* Botones de carrusel */
                .post-thumb-carousel-btn {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    width: ${isMobile ? '28px' : '32px'};
                    height: ${isMobile ? '28px' : '32px'};
                    border: 1px solid #e5e7eb;
                    border-radius: 50%;
                    background-color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 5;
                }
                
                .post-thumb-carousel-prev {
                    left: 8px;
                }
                
                .post-thumb-carousel-next {
                    right: 8px;
                }
                
                /* Contador de imágenes */
                .post-thumb-image-counter {
                    position: absolute;
                    bottom: 8px;
                    right: 8px;
                    background-color: rgba(0,0,0,0.5);
                    color: #ffffff;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: ${isMobile ? '10px' : '11px'};
                    z-index: 4;
                }
                
                /* Botones de acción */
                .post-thumb-save-btn,
                .post-thumb-like-btn {
                    position: absolute;
                    width: ${isMobile ? '30px' : '32px'};
                    height: ${isMobile ? '30px' : '32px'};
                    border: 1px solid #e5e7eb;
                    border-radius: 50%;
                    background-color: #ffffff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    z-index: 5;
                }
                
                .post-thumb-save-btn {
                    top: 8px;
                    right: 8px;
                }
                
                .post-thumb-like-btn {
                    top: 8px;
                    left: 8px;
                }
                
                .post-thumb-likes-counter {
                    position: absolute;
                    bottom: 8px;
                    left: 8px;
                    background-color: rgba(0,0,0,0.5);
                    color: #ffffff;
                    padding: 2px 8px;
                    border-radius: 12px;
                    font-size: ${isMobile ? '10px' : '11px'};
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    z-index: 4;
                }
                
                /* Footer */
                .post-thumb-footer {
                    padding: 12px;
                    background-color: #ffffff;
                    flex: 1;
                }
                
                .post-thumb-row {
                    margin: 2px 0;
                    line-height: 1.4;
                }
                
                .post-thumb-title {
                    font-size: ${isMobile ? '14px' : '15px'};
                    font-weight: 600;
                    color: #111827;
                    display: block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                
                .post-thumb-price {
                    font-size: ${isMobile ? '13px' : '14px'};
                    font-weight: 600;
                    color: #dc2626; /* Solo el precio en rojo */
                }
                
                .post-thumb-location {
                    font-size: ${isMobile ? '11px' : '12px'};
                    color: #6b7280;
                    display: flex;
                    align-items: center;
                }
                
                .post-thumb-date,
                .post-thumb-views {
                    font-size: ${isMobile ? '10px' : '11px'};
                    color: #9ca3af;
                    display: flex;
                    align-items: center;
                }
                
                .post-thumb-seller {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    margin-top: 8px;
                    padding-top: 8px;
                    border-top: 1px solid #f3f4f6;
                }
                
                .post-thumb-seller-avatar {
                    width: ${isMobile ? '20px' : '22px'};
                    height: ${isMobile ? '20px' : '22px'};
                    border-radius: 50%;
                    object-fit: cover;
                }
                
                .post-thumb-seller-name {
                    font-size: ${isMobile ? '11px' : '12px'};
                    font-weight: 500;
                    color: #4b5563;
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .post-thumb-grid {
                        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
                        gap: 12px;
                    }
                }
                
                @media (max-width: 480px) {
                    .post-thumb-grid {
                        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                        gap: 8px;
                    }
                    
                    .post-thumb-footer {
                        padding: 8px;
                    }
                }
            `}</style>
        </div>
    );
};

export default PostThumb;