import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
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
    auth = {}
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

  // 🎯 COMPONENTE MINIMALISTA PARA POSTS SIMILARES (MANTENIENDO TUS ESTILOS)
  const SimilarPostCard = ({ post: similarPost }) => {
    if (!similarPost) return null;

    // Obtener la primera imagen
    const firstImage = similarPost.images && similarPost.images.length > 0
      ? similarPost.images[0]
      : null;

    // Formatear precio
    const formatPrice = (price) => {
      if (!price) return '';
      return new Intl.NumberFormat('fr-FR').format(price) + ' DZD';
    };

    // Obtener título corto (max 40 chars)
    const getShortTitle = (title) => {
      if (!title) return 'Sans titre';
      return title.length > 40 ? title.substring(0, 40) + '...' : title;
    };

    return (
      <Link
        to={`/post/${similarPost._id}`}
        className="similar-post-card text-decoration-none"
        style={{ display: 'block' }}
      >
        <div className="card h-100 border-0 shadow-sm hover-lift">
          {/* IMAGEN */}
          <div className="similar-post-image" style={{
            height: '120px',
            overflow: 'hidden',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px'
          }}>
            {firstImage ? (
              <img
                src={firstImage.url || firstImage}
                alt={similarPost.title || 'Produit'}
                className="w-100 h-100"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <div className="w-100 h-100 d-flex align-items-center justify-content-center bg-light">
                <span style={{ fontSize: '2rem' }}>📷</span>
              </div>
            )}
          </div>

          {/* CONTENIDO MINIMALISTA */}
          <div className="card-body p-2">
            {/* TÍTULO (solo esto) */}
            <div className="similar-post-title mb-1">
              <div className="fw-semibold text-dark" style={{
                fontSize: '0.85rem',
                lineHeight: '1.3',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: '2.2rem'
              }}>
                {getShortTitle(similarPost.title)}
              </div>
            </div>

            {/* PRECIO */}
            {similarPost.price && (
              <div className="similar-post-price">
                <span className="fw-bold text-primary" style={{ fontSize: '0.9rem' }}>
                  {formatPrice(similarPost.price)}
                </span>
              </div>
            )}

            {/* BADGE DE CATEGORÍA (opcional) */}
            {similarPost.categorie && (
              <div className="mt-1">
                <span className="badge bg-light text-dark border" style={{
                  fontSize: '0.65rem',
                  padding: '0.2rem 0.4rem'
                }}>
                  {similarPost.categorie}
                </span>
              </div>
            )}
          </div>
        </div>
      </Link>
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
      {/* 1. POST DETAIL PRINCIPAL (COMPLETO) */}
      <div className="mb-1">
        <PostCard post={post} />
      </div>

      {/* 2. POSTS DEL USUARIO - USANDO EL COMPONENTE UserPosts */}
      {post.user && post.user._id && (
        <div  >
          {/* Encabezado */}
          
            <h5 className="fw-bold mb-1" style={{ fontSize: '1.4rem', color: '#2c3e50' }}>
              👤 Autres publications du vendeur
            </h5>



         

 
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

      {/* 3. POSTS SIMILARES - VERSIÓN MINIMALISTA (MANTENIENDO TUS ESTILOS) */}
      {post.categorie && post.subCategory && (
        <div className="mb-2">
          {/* Encabezado */}
          <div className="mb-4 px-1">
            <h5 className="fw-bold mb-2" style={{ fontSize: '1.4rem', color: '#2c3e50' }}>
              🔍 Publications similaires
            </h5>
          
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
            /* Grid minimalista - SOLO IMAGEN + TÍTULO + PRECIO */
            <Row className="g-3">
              {filteredSimilarPosts.map(item => (
                <Col
                  key={item._id}
                  xs={6}      // 2 columnas en móvil
                  sm={4}      // 3 columnas en tablet
                  md={3}      // 4 columnas en desktop
                  lg={2}      // 6 columnas en desktop grande
                  className="d-flex"
                >
                  <SimilarPostCard post={item} />
                </Col>
              ))}
            </Row>
          )}
        </div>
      )}

      {/* ESTILOS CSS MEJORADOS */}
      <style jsx>{`
        .post-detail-page {
          background: #ffffff;
        }
        
        .hover-lift {
          transition: all 0.3s ease;
          border-radius: 8px;
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 12px rgba(0,0,0,0.1) !important;
        }
        
        .similar-post-card .card {
          border: 1px solid #e9ecef;
          transition: all 0.2s ease;
        }
        
        .similar-post-card:hover .card {
          border-color: #4f46e5;
        }
        
        .similar-post-image {
          position: relative;
        }
        
        .similar-post-image::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.1), transparent);
          pointer-events: none;
          border-radius: 8px 8px 0 0;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .post-detail-page {
            padding-left: 10px;
            padding-right: 10px;
          }
          
          h3 {
            font-size: 1.2rem !important;
          }
          
          .similar-post-image {
            height: 100px !important;
          }
        }
        
        @media (max-width: 576px) {
          .similar-post-image {
            height: 90px !important;
          }
          
          .similar-post-title div {
            font-size: 0.8rem !important;
          }
          
          .similar-post-price span {
            font-size: 0.85rem !important;
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
        
        .similar-post-card {
          animation: fadeIn 0.4s ease forwards;
        }
        
        /* Separación visual */
        .mb-5:last-child {
          margin-bottom: 2rem !important;
        }
      `}</style>
    </Container>
  );
};

export default PostId;