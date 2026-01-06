import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Spinner, Alert, Card, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getSimilarPosts, clearSimilarPosts } from '../redux/actions/postAction';
import PostCard from '../components/PostCard';
import UserPosts from '../components/UserPosts';
import { getDataAPI } from '../utils/fetchData';

const PostId = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // REFs para control
  const hasFetchedSimilarRef = useRef(false);
  const hasFetchedPostRef = useRef(false);

  // Acceso a reducers
  const {
    homePosts = {},
    detailPost = null,
    auth = {},
    theme
  } = useSelector(state => state);

  // Extraer valores
  const postsArray = homePosts.posts || [];
  const similarPosts = homePosts.similarPosts || [];
  const similarLoading = homePosts.similarLoading || false;
  const detailPostData = detailPost;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (hasFetchedPostRef.current) {
        setLoading(false);
        return;
      }

      let current = null;

      // Buscar en detailPost
      if (detailPostData && detailPostData._id === id) {
        current = detailPostData;
      }
      // Buscar en posts array
      else if (postsArray.length > 0) {
        current = postsArray.find(p => p._id === id);
      }

      // Obtener de API si no está
      if (!current) {
        try {
          const res = await getDataAPI(`post/${id}`);
          current = res.data.post || res.data;
          dispatch({ type: 'GET_POST', payload: current });
        } catch (err) {
          console.error('Error:', err);
          setLoading(false);
          return;
        }
      }

      if (current) {
        setPost(current);
        hasFetchedPostRef.current = true;

        // Buscar similares solo una vez
        if (current.categorie && current.subCategory && !hasFetchedSimilarRef.current) {
          hasFetchedSimilarRef.current = true;
          dispatch(getSimilarPosts(id));
        } else {
          dispatch(clearSimilarPosts());
        }
      }

      setLoading(false);
    };

    fetchPost();

    return () => {
      hasFetchedPostRef.current = false;
      hasFetchedSimilarRef.current = false;
      dispatch(clearSimilarPosts());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (detailPostData && detailPostData._id === id && !hasFetchedPostRef.current) {
      setPost(detailPostData);
      hasFetchedPostRef.current = true;
      setLoading(false);
    }
  }, [detailPostData, id]);

  // 🎯 COMPONENTE POSTS SIMILARES CON ESTILOS DE PostThumb
  const SimilarPostThumb = ({ posts }) => {
    if (!posts || posts.length === 0) return null;

    return (
      <div className="similar-posts-thumb">
        {posts.map(post => {
          // Extraer datos del post similar
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
                <div className="similar-post-thumb-display" style={{ 
                  position: 'relative',
                  height: '180px',
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
                  ) : imageUrl ? (
                    <img 
                      src={imageUrl} 
                      alt={title}
                      className="w-100 h-100"
                      style={{ 
                        objectFit: 'cover',
                        filter: theme ? 'invert(1)' : 'invert(0)'
                      }}
                    />
                  ) : (
                    <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                      <span style={{ fontSize: '2rem' }}>📷</span>
                    </div>
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
                <Card.Footer className="bg-white border-0 py-2 px-3">
                  {/* Fila 1: Título */}
                  <div className="mb-1">
                    <h6 className="fw-bold text-dark mb-0 text-truncate" style={{ 
                      fontSize: '0.9rem',
                      lineHeight: '1.3',
                      minHeight: '2.2rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {title}
                    </h6>
                  </div>
                  
                  {/* Fila 2: Precio */}
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="price-container">
                      <div className="text-success fw-bold" style={{ fontSize: '1rem' }}>
                        {new Intl.NumberFormat('fr-FR').format(price)} DA
                      </div>
                    </div>
                    
                    {/* Badge de categoría */}
                    {categorie && (
                      <Badge bg="secondary" className="text-uppercase" style={{ fontSize: '0.65rem' }}>
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
          );
        })}
      </div>
    );
  };

  // Loading
  if (loading) {
    return (
      <Container className="text-center my-5 py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Chargement de la publication...</p>
      </Container>
    );
  }

  // No post found
  if (!post) {
    return (
      <Container className="text-center my-5 py-5">
        <Alert variant="warning">
          <Alert.Heading>Publication non trouvée</Alert.Heading>
          <p>La publication que vous recherchez n'existe pas ou a été supprimée.</p>
        </Alert>
      </Container>
    );
  }

  // Filtrar posts similares excluyendo el actual
  const filteredSimilarPosts = similarPosts.filter(item => item._id !== post._id);

  return (
    <Container className="post-detail-page" style={{ maxWidth: '1200px' }}>
      {/* 1. POST DETAIL PRINCIPAL */}
      <div className="mb-4">
        <PostCard post={post} />
      </div>

      {/* 2. POSTS DEL USUARIO */}
      {post.user && post.user._id && (
        <div className="mb-5">
          {/* Encabezado */}
          <div className="mb-4">
            <h5 className="fw-bold" style={{ fontSize: '1.4rem', color: '#2c3e50' }}>
              👤 Autres publications du vendeur
            </h5>
          </div>
          
          <UserPosts
            userId={post.user._id}
            auth={auth}
            limit={6}
            excludePostId={post._id}
            showTitle={false}
            gridView={true}
          />
        </div>
      )}

      {/* 3. POSTS SIMILARES CON ESTILOS DE PostThumb */}
      {post.categorie && post.subCategory && (
        <div className="mb-5">
          {/* Encabezado */}
          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0" style={{ fontSize: '1.4rem', color: '#2c3e50' }}>
                🔍 Publications similaires
              </h5>
              {filteredSimilarPosts.length > 0 && !similarLoading && (
                <Badge bg="info" className="px-3 py-2">
                  {filteredSimilarPosts.length} résultat{filteredSimilarPosts.length > 1 ? 's' : ''}
                </Badge>
              )}
            </div>
            <p className="text-muted mb-4">
              Découvrez d'autres annonces similaires dans la même catégorie
            </p>
          </div>

          {/* Loading state */}
          {similarLoading ? (
            <div className="text-center py-5" style={{
              background: '#f8f9fa',
              borderRadius: '10px'
            }}>
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Recherche de publications similaires...</p>
            </div>
          ) : filteredSimilarPosts.length === 0 ? (
            <Alert variant="light" className="text-center py-4" style={{
              background: '#f8f9fa',
              border: '1px dashed #dee2e6',
              borderRadius: '10px'
            }}>
              <div className="mb-2" style={{ fontSize: '2rem' }}>🔍</div>
              <p className="mb-0 text-muted">Aucune publication similaire trouvée</p>
            </Alert>
          ) : (
            /* Grid con los mismos estilos que PostThumb */
            <SimilarPostThumb posts={filteredSimilarPosts} />
          )}
        </div>
      )}

      {/* ESTILOS CSS - IGUALES QUE POSTTHUMB */}
      <style jsx>{`
        .post-detail-page {
          background: #ffffff;
          padding-top: 20px;
        }
        
        .similar-posts-thumb {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          padding: 10px 0;
        }
        
        .similar-post-thumb-display {
          transition: transform 0.3s ease;
        }
        
        .similar-post-thumb-display:hover {
          transform: scale(1.02);
        }
        
        /* Hover effect para las cards */
        .card {
          transition: all 0.3s ease;
        }
        
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 16px rgba(0,0,0,0.1) !important;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .similar-posts-thumb {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 15px;
          }
          
          .post-detail-page {
            padding-left: 10px;
            padding-right: 10px;
          }
          
          h5 {
            font-size: 1.2rem !important;
          }
          
          .similar-post-thumb-display {
            height: 160px !important;
          }
        }
        
        @media (max-width: 576px) {
          .similar-posts-thumb {
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 12px;
          }
          
          .similar-post-thumb-display {
            height: 140px !important;
          }
          
          .price-container div {
            font-size: 0.9rem !important;
          }
          
          .card-footer {
            padding: 8px 12px !important;
          }
        }
        
        /* Animación sutil */
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .similar-posts-thumb > a {
          animation: fadeIn 0.4s ease forwards;
          animation-delay: calc(var(--index, 0) * 0.05s);
        }
        
        /* Estilos específicos para dark theme */
        :global(.dark) .card {
          background-color: #2d3748;
          border-color: #4a5568;
        }
        
        :global(.dark) .card-footer {
          background-color: #2d3748;
          border-top: 1px solid #4a5568;
        }
        
        :global(.dark) .text-dark {
          color: #e2e8f0 !important;
        }
        
        :global(.dark) .text-muted {
          color: #a0aec0 !important;
        }
      `}</style>
    </Container>
  );
};

export default PostId;