// src/pages/PostId.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Spinner, Alert ,Col} from 'react-bootstrap';

import PostCard from '../../components/post-card/PostCard';
import GridUserPosts from './GridUsersPosts'
import GridPostsSimilar from './GridPostsSimilar';
import { addView } from '../../redux/actions/postAction';
import { getSimilarPosts, clearSimilarPosts } from '../../redux/actions/postAction';
import { getDataAPI } from '../../utils/fetchData';

const PostId = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  // REFs para control
  const hasFetchedPostRef = useRef(false);
  const hasFetchedSimilarRef = useRef(false);
  const previousIdRef = useRef(id);

  const { posts = {}, detailPost = null, auth = {}, theme } = useSelector(state => state);
  
  const postsArray = posts.posts || [];
  const similarPosts = posts.similarPosts || posts.similarPostsArray || [];
  const similarLoading = posts.similarLoading || false;
  const detailPostData = detailPost;

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Resetear refs cuando cambia el ID
  useEffect(() => {
    if (previousIdRef.current !== id) {
      hasFetchedPostRef.current = false;
      hasFetchedSimilarRef.current = false;
      previousIdRef.current = id;
      setLoading(true);
      setPost(null);
    }
  }, [id]);

  // Fetch post principal
  useEffect(() => {
    const fetchPost = async () => {
      if (hasFetchedPostRef.current) {
        setLoading(false);
        return;
      }

      let current = null;

      if (detailPostData && detailPostData._id === id) {
        current = detailPostData;
      }
      else if (postsArray.length > 0) {
        current = postsArray.find(p => p._id === id);
      }

      if (!current) {
        try {
          const res = await getDataAPI(`post/${id}`);
          current = res.data?.post || res.data;
          
          if (current) {
            dispatch({ type: 'GET_POST', payload: current });
          }
        } catch (err) {
          console.error('❌ Error obteniendo post:', err);
          setLoading(false);
          return;
        }
      }

      if (current) {
        setPost(current);
        hasFetchedPostRef.current = true;
      }

      setLoading(false);
    };

    fetchPost();
  }, [id, detailPostData, postsArray, dispatch]);

  // Fetch posts similares
  useEffect(() => {
    if (post && !hasFetchedSimilarRef.current && post.categorie && post.subCategory) {
      hasFetchedSimilarRef.current = true;
      dispatch(getSimilarPosts(id, { limit: 6 }));
    }

    return () => {
      dispatch(clearSimilarPosts());
    };
  }, [post, id, dispatch]);

  // Registrar vista
  useEffect(() => {
    const viewed = localStorage.getItem(`viewed_${id}`);
    if (!viewed) {
      dispatch(addView(id));
      localStorage.setItem(`viewed_${id}`, true);
    }
  }, [id, dispatch]);

  // Actualizar post si cambia detailPost
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

  return (
    <Container className="post-detail-page" style={{ maxWidth: '1200px' }}>
      {/* 1. POST DETAIL PRINCIPAL */}
      <div className="mb-5">
        <PostCard post={post} />
      </div>

      {/* 2. POSTS DEL USUARIO EN HORIZONTAL */}
      {post.user && post.user._id && (
        <GridUserPosts
          userId={post.user._id}
          auth={auth}
          excludePostId={post._id}
          limit={6}
        />
      )}

      {/* 3. POSTS SIMILARES EN VERTICAL */}
      {post.categorie && post.subCategory && (

        
          <GridPostsSimilar
          similarPosts={similarPosts}
          loading={similarLoading}
          categorie={post.categorie}
          subCategory={post.subCategory}
        /> 
      )}
        
        
    </Container>
  );
};

export default PostId;