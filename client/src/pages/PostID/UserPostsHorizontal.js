// 📂 frontend/src/components/UserPostsHorizontal.jsx

import React, { useState, useEffect,useRef,useCallback } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';
import PostCard from '../../components/post-card/PostCard';
 
import { getDataAPI } from '../../utils/fetchData';
 
 

const UserPostsHorizontal = ({ userId,   excludePostId, limit = 6 }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const hasFetchedRef = useRef(false);

  const fetchUserPosts = useCallback(async () => {
    if (!userId || hasFetchedRef.current) return;

    try {
      setLoading(true);
      // Usar endpoint público para obtener posts del usuario
      const res = await getDataAPI(`posts/public/user_posts/${userId}?limit=${limit + 1}`);
      
      let userPosts = res.data?.posts || [];
      
      // Excluir el post actual
      if (excludePostId) {
        userPosts = userPosts.filter(post => post._id !== excludePostId);
      }
      
      // Limitar a limit posts
      setPosts(userPosts.slice(0, limit));
      hasFetchedRef.current = true;
    } catch (err) {
      console.error('❌ Error cargando posts del usuario:', err);
      setError(err.response?.data?.msg || 'Error al cargar publicaciones');
    } finally {
      setLoading(false);
    }
  }, [userId, excludePostId, limit]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  if (loading && !hasFetchedRef.current) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" variant="primary" size="sm" />
        <p className="text-muted small mt-2">Chargement des publications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4">
        <p className="text-danger small">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted small">Aucune autre publication</p>
      </div>
    );
  }

  return (
    <div className="user-posts-horizontal">
      <Row className="flex-nowrap" style={{ overflowX: 'auto', flexWrap: 'nowrap', gap: '1rem', margin: 0 }}>
        {posts.map(post => (
          <Col key={post._id} style={{ flex: '0 0 auto', width: '280px', padding: 0 }}>
            <PostCard post={post} />
          </Col>
        ))}
      </Row>

      <style>{`
        .user-posts-horizontal {
          width: 100%;
        }
        .user-posts-horizontal .flex-nowrap {
          overflow-x: auto;
          scrollbar-width: thin;
          -webkit-overflow-scrolling: touch;
        }
        .user-posts-horizontal .flex-nowrap::-webkit-scrollbar {
          height: 8px;
        }
        .user-posts-horizontal .flex-nowrap::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .user-posts-horizontal .flex-nowrap::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 10px;
        }
        .user-posts-horizontal .flex-nowrap::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </div>
  );
};

export default UserPostsHorizontal;