// components/UserPosts/UserPosts.js
import React, { useState, useEffect } from 'react';
import PostThumb from './PostThumb';
import LoadIcon from '../images/loading.gif';
import LoadMoreBtn from './LoadMoreBtn';
import { getDataAPI } from '../utils/fetchData';
import { useSelector } from 'react-redux';
 

const UserPosts = ({ 
    userId, 
    
    limit = 6, 
    showTitle = true,
    excludePostId = null // Para excluir el post actual en detail
}) => {
    
    const { auth } = useSelector(state => state)
    const [posts, setPosts] = useState([]);
    const [result, setResult] = useState(0);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    // Cargar posts iniciales
    useEffect(() => {
        const fetchUserPosts = async () => {
            setLoading(true);
            try {
                const res = await getDataAPI(
                    `user_posts/${userId}?limit=${limit}&page=1`,
                    auth.token
                );
                
                // Filtrar el post actual si se proporciona excludePostId
                let filteredPosts = res.data.posts || [];
                if (excludePostId) {
                    filteredPosts = filteredPosts.filter(post => post._id !== excludePostId);
                }
                
                setPosts(filteredPosts);
                setResult(res.data.result || 0);
                setPage(2); // Siguiente página
                setHasMore(res.data.hasMore || false);
            } catch (err) {
                console.error('Error cargando posts del usuario:', err);
            } finally {
                setLoading(false);
            }
        };

        if (userId && auth.token) {
            fetchUserPosts();
        }
    }, [userId, auth.token, limit, excludePostId]);

    // Cargar más posts
    const handleLoadMore = async () => {
        if (!hasMore || loading) return;
        
        setLoading(true);
        try {
            const res = await getDataAPI(
                `user_posts/${userId}?limit=${limit}&page=${page}`,
                auth.token
            );
            
            // Filtrar el post actual si se proporciona excludePostId
            let newPosts = res.data.posts || [];
            if (excludePostId) {
                newPosts = newPosts.filter(post => post._id !== excludePostId);
            }
            
            setPosts(prev => [...prev, ...newPosts]);
            setResult(res.data.result || 0);
            setPage(prev => prev + 1);
            setHasMore(res.data.hasMore || false);
        } catch (err) {
            console.error('Error cargando más posts:', err);
        } finally {
            setLoading(false);
        }
    };

    if (!userId) {
        return <div className="user-posts-empty">Usuario no especificado</div>;
    }

    return (
        <div className="user-posts-container">
            {showTitle && posts.length > 0 && (
                <div className="user-posts-header">
                    <h4 className="user-posts-title">
                        <span className="material-icons">grid_view</span>
                        Más publicaciones de este vendedor
                    </h4>
                    <span className="user-posts-count">{result} publicaciones</span>
                </div>
            )}

            {loading && page === 1 ? (
                <div className="user-posts-loading">
                    <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
                    <p>Cargando publicaciones...</p>
                </div>
            ) : posts.length === 0 ? (
                <div className="user-posts-empty">
                    <span className="material-icons">inventory_2</span>
                    <p>No hay más publicaciones de este usuario</p>
                </div>
            ) : (
                <>
                    <div  >
                        <PostThumb posts={posts} result={result} />
                    </div>

                    {hasMore && (
                        <div className="user-posts-load-more">
                            <LoadMoreBtn 
                                result={result} 
                                page={page}
                                load={loading} 
                                handleLoadMore={handleLoadMore} 
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default UserPosts;