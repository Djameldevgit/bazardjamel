// 📂 frontend/src/components/SimilarPostsVertical.jsx

import React, { useEffect, useState,useRef } from 'react';
import { Row, Col, Spinner, Alert, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import PostCard from '../../components/post-card/PostCard';
 
import { getSimilarPosts, clearSimilarPosts } from '../../redux/actions/postAction';

 

const SimilarPostsVertical = ({ postId, categorie, subCategory }) => {
  const dispatch = useDispatch();
  const { posts } = useSelector(state => state);
  
  const similarPosts = posts.similarPosts || [];
  const similarLoading = posts.similarLoading || false;
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // ✅ Solo ejecutar una vez cuando el componente se monta y hay categoría
    if (categorie && subCategory && !hasFetchedRef.current && postId) {
      console.log('🔍 Buscando posts similares para:', { categorie, subCategory });
      hasFetchedRef.current = true;
      dispatch(getSimilarPosts(postId, { limit: 6 }));
    }

    // ✅ Cleanup al desmontar
    return () => {
      dispatch(clearSimilarPosts());
      hasFetchedRef.current = false;
    };
  }, [postId, categorie, subCategory, dispatch]); // ✅ Dependencias correctas

  if (similarLoading) {
    return (
      <div className="text-center py-5" style={{ background: '#f8f9fa', borderRadius: '10px' }}>
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Recherche de publications similaires...</p>
      </div>
    );
  }

  if (similarPosts.length === 0 && !similarLoading) {
    return (
      <Alert variant="light" className="text-center py-4" style={{ background: '#f8f9fa', border: '1px dashed #dee2e6', borderRadius: '10px' }}>
        <div className="mb-2" style={{ fontSize: '2rem' }}>🔍</div>
        <p className="mb-0 text-muted">Aucune publication similaire trouvée</p>
      </Alert>
    );
  }

  return (
    <div className="similar-posts-vertical">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0" style={{ fontSize: '1.4rem', color: '#2c3e50' }}>
          🔍 Publications similaires
        </h5>
        <Badge bg="info" className="px-3 py-2">
          {similarPosts.length} résultat{similarPosts.length > 1 ? 's' : ''}
        </Badge>
      </div>
      <p className="text-muted mb-4">
        Découvrez d'autres annonces similaires dans la même catégorie
      </p>

      <Row xs={1} sm={2} md={3} lg={3} className="g-4">
        {similarPosts.map(post => (
          <Col key={post._id}>
            <PostCard post={post} />
          </Col>
        ))}
      </Row>

      <style>{`
        .similar-posts-vertical {
          width: 100%;
        }
      `}</style>
    </div>
  );
};

export default SimilarPostsVertical;