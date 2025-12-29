// pages/CategoryPage.js - NUEVO COMPONENTE
import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory, Link } from 'react-router-dom';
import Posts from '../components/home/Posts';
import { getPostsByCategory, getCategories } from '../redux/actions/postAction';
import LoadIcon from '../images/loading.gif';
import { motion } from 'framer-motion';

const CategoryPage = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { categoryName } = useParams(); // Obtener categoría de la URL
    
    const { homePosts, auth } = useSelector(state => state);
    
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    
    // 📌 Obtener información de la categoría actual
    const currentCategory = homePosts.categories?.find(
        cat => cat.name.toLowerCase() === categoryName.toLowerCase()
    );
    
    // 📌 Cargar categorías al inicio
    useEffect(() => {
        dispatch(getCategories());
    }, [dispatch]);
    
    // 📌 Cargar posts de la categoría cuando cambia la URL
    useEffect(() => {
        const loadCategoryPosts = async () => {
            if (!categoryName) return;
            
            setLoading(true);
            console.log(`📂 Loading posts for category: ${categoryName}`);
            
            try {
                // Resetear posts y cargar página 1
                await dispatch(getPostsByCategory(categoryName, 1, true));
                setPage(2); // Preparar para siguiente página
                setHasMore(true);
            } catch (error) {
                console.error('Error loading category posts:', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadCategoryPosts();
    }, [dispatch, categoryName]);
    
    // 📌 Función para cargar más posts (paginación)
    const loadMorePosts = useCallback(async () => {
        if (!hasMore || loading) return;
        
        console.log(`📥 Loading more posts for ${categoryName}, page ${page}`);
        
        try {
            const result = await dispatch(getPostsByCategory(categoryName, page));
            
            // Si no hay más posts, desactivar carga
            if (!result || result.length === 0) {
                setHasMore(false);
            } else {
                setPage(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error loading more posts:', error);
            setHasMore(false);
        }
    }, [dispatch, categoryName, page, hasMore, loading]);
    
    // 📌 Manejar scroll infinito
    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
                loadMorePosts();
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMorePosts]);
    
    // 📌 Si no hay categoría, redirigir a home
    if (!categoryName) {
        history.push('/');
        return null;
    }
    
    return (
        <div className="category-page container-fluid py-4">
            {/* CABECERA DE CATEGORÍA */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="category-header mb-4"
            >
                <div className="d-flex align-items-center mb-3">
                    <Link to="/" className="btn btn-outline-secondary btn-sm me-3">
                        <i className="fas fa-arrow-left me-1"></i>
                        Volver
                    </Link>
                    
                    <div className="d-flex align-items-center">
                        <div className="category-icon display-4 me-3">
                            {currentCategory?.emoji || '📁'}
                        </div>
                        <div>
                            <h1 className="mb-0">{currentCategory?.name || categoryName}</h1>
                            <p className="text-muted mb-0">
                                {currentCategory?.count || 0} anuncios disponibles
                            </p>
                        </div>
                    </div>
                    
                    <div className="ms-auto">
                        <div className="btn-group">
                            <button className="btn btn-outline-primary">
                                <i className="fas fa-filter me-1"></i>
                                Filtrar
                            </button>
                            <button className="btn btn-outline-primary">
                                <i className="fas fa-sort-amount-down me-1"></i>
                                Ordenar
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* BREADCRUMB */}
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/">
                                <i className="fas fa-home me-1"></i>
                                Inicio
                            </Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            {currentCategory?.name || categoryName}
                        </li>
                    </ol>
                </nav>
            </motion.div>
            
            {/* CONTENIDO PRINCIPAL */}
            <div className="row">
                {/* SIDEBAR (opcional) */}
                <div className="col-lg-3 d-none d-lg-block">
                    <div className="sticky-top" style={{ top: '20px' }}>
                        <div className="card mb-3">
                            <div className="card-header">
                                <h6 className="mb-0">Categorías relacionadas</h6>
                            </div>
                            <div className="list-group list-group-flush">
                                {homePosts.categories
                                    ?.filter(cat => 
                                        cat.name !== categoryName && 
                                        cat.name.toLowerCase().includes(categoryName.toLowerCase())
                                    )
                                    .slice(0, 5)
                                    .map(cat => (
                                        <Link
                                            key={cat.name}
                                            to={`/category/${cat.name}`}
                                            className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                        >
                                            <span>
                                                <span className="me-2">{cat.emoji}</span>
                                                {cat.name}
                                            </span>
                                            <span className="badge bg-primary rounded-pill">
                                                {cat.count}
                                            </span>
                                        </Link>
                                    ))}
                            </div>
                        </div>
                        
                        <div className="card">
                            <div className="card-header">
                                <h6 className="mb-0">Consejos</h6>
                            </div>
                            <div className="card-body">
                                <ul className="list-unstyled">
                                    <li className="mb-2">
                                        <small className="text-muted">
                                            <i className="fas fa-check-circle text-success me-1"></i>
                                            Verifica la información del vendedor
                                        </small>
                                    </li>
                                    <li className="mb-2">
                                        <small className="text-muted">
                                            <i className="fas fa-check-circle text-success me-1"></i>
                                            Revisa las fotos detalladamente
                                        </small>
                                    </li>
                                    <li>
                                        <small className="text-muted">
                                            <i className="fas fa-check-circle text-success me-1"></i>
                                            Negocia en un lugar seguro
                                        </small>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* POSTS */}
                <div className="col-lg-9">
                    {loading ? (
                        <div className="text-center py-5">
                            <img src={LoadIcon} alt="loading" className="d-block mx-auto" />
                            <p className="mt-2">Cargando anuncios de {categoryName}...</p>
                        </div>
                    ) : (
                        <>
                      
<Posts 
    selectedCategory={categoryName}
    showCategoryFilter={false}
    fromCategoryPage={true} // <-- AÑADIR ESTE PROP
/>
                            {/* LOAD MORE BUTTON */}
                            {hasMore && homePosts.posts?.length > 0 && (
                                <div className="text-center mt-4">
                                    <button
                                        className="btn btn-outline-primary"
                                        onClick={loadMorePosts}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                                Cargando...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-plus me-2"></i>
                                                Cargar más anuncios
                                            </>
                                        )}
                                    </button>
                                </div>
                            )}
                            
                            {/* NO POSTS MESSAGE */}
                            {homePosts.posts?.length === 0 && !loading && (
                                <motion.div 
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-5"
                                >
                                    <div className="display-1 mb-3">📭</div>
                                    <h4>No hay anuncios en esta categoría</h4>
                                    <p className="text-muted mb-4">
                                        Sé el primero en publicar en {categoryName}
                                    </p>
                                    <Link to="/create" className="btn btn-primary">
                                        <i className="fas fa-plus me-2"></i>
                                        Crear anuncio
                                    </Link>
                                </motion.div>
                            )}
                        </>
                    )}
                </div>
            </div>
            
            {/* ESTILOS */}
            <style jsx>{`
                .category-page {
                    min-height: calc(100vh - 76px);
                }
                
                .category-header {
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    padding: 30px;
                    border-radius: 16px;
                    margin-top: 20px;
                }
                
                .category-icon {
                    font-size: 3.5rem;
                }
                
                .breadcrumb {
                    background: transparent;
                    padding: 0;
                    margin-bottom: 0;
                }
                
                .card {
                    border: none;
                    border-radius: 12px;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                }
                
                .list-group-item {
                    border: none;
                    padding: 12px 15px;
                }
                
                @media (max-width: 768px) {
                    .category-header {
                        padding: 20px;
                    }
                    
                    .category-icon {
                        font-size: 2.5rem;
                    }
                    
                    h1 {
                        font-size: 1.8rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default CategoryPage;