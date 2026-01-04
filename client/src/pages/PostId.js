import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
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
    <Container fluid className="p-0">
      {/* 1. POST DETAIL (ocupa todo el ancho) */}
      <div className="mb-4">
        <PostCard post={post} />
      </div>

      {/* 2. POSTS DEL USUARIO */}
      {post.user && post.user._id && auth.user && (
        <div className="mb-1">
          {/* Título en francés */}
          <h4 className="mb-2 px-1">Publications du vendeur</h4>
          
          {/* Grid 2 en 2 sin márgenes/padding extras */}
          <Row className=""> {/* g-0 elimina todos los gaps */}
            <UserPosts 
              userId={post.user._id}
              auth={auth}
              limit={6}
              excludePostId={post._id}
              showTitle={false}
              gridView={true} // Nueva prop para vista grid
            />
          </Row>
        </div>
      )}

      {/* 3. POSTS SIMILARES */}
      {post.categorie && post.subCategory && (
        <div className="mb-4">
          {/* Título en francés */}
          <h4 className="mb-3 px-3">Publications similaires</h4>
          
          {/* Loading state */}
          {similarLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Recherche de publications similaires...</p>
            </div>
          ) : filteredSimilarPosts.length === 0 ? (
            <Alert variant="info" className="mx-3">
              Aucune publication similaire trouvée
            </Alert>
          ) : (
            /* Grid 2 en 2 sin márgenes/padding extras */
            <Row className="g-0"> {/* g-0 elimina todos los gaps */}
              {filteredSimilarPosts.map(item => (
                <Col 
                  key={item._id} 
                  xs={6}      // 2 columnas en móvil
                  sm={6}      // 2 columnas en tablet
                  md={6}      // 2 columnas en desktop
                  lg={6}      // 2 columnas en desktop grande
                  className="p-0 border-0" // Sin padding ni bordes
                >
                  <PostCard 
                    post={item} 
                    compact={true} // Versión compacta para 2 en fila
                    noMargin={true} // Sin márgenes
                  />
                </Col>
              ))}
            </Row>
          )}
        </div>
      )}
    </Container>
  );
};

export default PostId;