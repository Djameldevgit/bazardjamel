import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Card, Badge } from 'react-bootstrap'

const PostThumb = ({posts, result}) => {
    const { theme } = useSelector(state => state)

    if(result === 0) return (
        <div className="text-center py-5">
            <h5 className="text-muted">Aucune autre annonce</h5>
        </div>
    )

    return (
        <div className="post_thumb">
            {posts.map(post => {
                // Extraer datos del post
                const title = post.title || 'Annonce';
                const price = post.price || post.prix || post.loyer || 0;
                const categorie = post.categorie || '';
                const isVideo = post.images?.[0]?.url?.match(/video/i);
                const imageUrl = post.images?.[0]?.url || '';
                
                return (
                    <Link 
                        key={post._id} 
                        to={`/post/${post._id}`}
                        className="text-decoration-none"
                    >
                        <Card className="border-0 shadow-sm h-100" style={{ 
                            transition: 'transform 0.2s',
                            borderRadius: '8px',
                            overflow: 'hidden'
                        }}>
                            {/* Contenedor de imagen/video */}
                            <div className="post_thumb_display" style={{ 
                                position: 'relative',
                                height: '200px',
                                overflow: 'hidden'
                            }}>
                                {isVideo ? (
                                    <video 
                                        className="w-100 h-100"
                                        style={{ 
                                            objectFit: 'cover',
                                            filter: theme ? 'invert(1)' : 'invert(0)'
                                        }}
                                    >
                                        <source src={imageUrl} type="video/mp4" />
                                    </video>
                                ) : (
                                    <img 
                                        src={imageUrl} 
                                        alt={title}
                                        className="w-100 h-100"
                                        style={{ 
                                            objectFit: 'cover',
                                            filter: theme ? 'invert(1)' : 'invert(0)'
                                        }}
                                    />
                                )}
                                
                                {/* Badge de likes */}
                                {post.likes && post.likes.length > 0 && (
                                    <div className="position-absolute top-0 end-0 m-2">
                                        <Badge bg="danger" className="d-flex align-items-center gap-1">
                                            <i className="fas fa-heart" style={{ fontSize: '0.8rem' }}></i>
                                            <span>{post.likes.length}</span>
                                        </Badge>
                                    </div>
                                )}
                            </div>
                            
                            {/* FOOTER CON TÍTULO Y PRECIO */}
                            <Card.Footer className="bg-white border-0 py-1 px-1">
                                {/* Fila 1: Título */}
                                <div className="mb-1">
                                    <h6 className="fw-bold text-dark mb-0 text-truncate" style={{ 
                                        fontSize: '0.95rem',
                                        lineHeight: '1.3'
                                    }}>
                                        {title}
                                    </h6>
                                </div>
                                
                                {/* Fila 2: Precio */}
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="price-container">
                                        <div className="text-success fw-bold" style={{ fontSize: '1.1rem' }}>
                                            {new Intl.NumberFormat('fr-FR').format(price)} DA
                                        </div>
                                    </div>
                                    
                                    {/* Badge de categoría */}
                                    {categorie && (
                                        <Badge bg="secondary" className="text-uppercase" style={{ fontSize: '0.7rem' }}>
                                            {categorie.slice(0, 3)}
                                        </Badge>
                                    )}
                                </div>
                                
                                {/* Información adicional opcional */}
                                <div className="mt-1 d-flex justify-content-between">
                                    <div className="text-muted small">
                                        <i className="far fa-eye me-1"></i>
                                        {post.views || 0}
                                    </div>
                                    <div className="text-muted small">
                                        {post.createdAt && new Date(post.createdAt).toLocaleDateString('fr-FR')}
                                    </div>
                                </div>
                            </Card.Footer>
                        </Card>
                    </Link>
                )
            })}
            
            {/* Estilos */}
            <style jsx>{`
                .post_thumb {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 20px;
                    padding: 10px 0;
                }
                
                .post_thumb_display {
                    transition: transform 0.3s ease;
                }
                
                .post_thumb_display:hover {
                    transform: scale(1.02);
                }
                
                @media (max-width: 768px) {
                    .post_thumb {
                        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                        gap: 15px;
                    }
                }
                
                @media (max-width: 576px) {
                    .post_thumb {
                        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                        gap: 12px;
                    }
                    
                    .post_thumb_display {
                        height: 160px !important;
                    }
                    
                    .price-container div {
                        font-size: 1rem !important;
                    }
                }
            `}</style>
        </div>
    )
}

export default PostThumb