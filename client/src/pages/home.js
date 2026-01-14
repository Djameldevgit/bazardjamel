import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Container, Form, InputGroup } from 'react-bootstrap';
import { getCategories, getPostsByCategory } from '../redux/actions/postCategoryAction';
import LoadIcon from '../images/loading.gif';
import HeaderCarousel from '../components/SlidersCategories/HeaderCarousel';
import PostCard from '../components/PostCard';
import CategorySlider from '../components/SlidersCategories/CategorySlider';

const Home = () => {
    const dispatch = useDispatch();
    
    // ✅ ACCESO CORRECTO AL ESTADO
    const homePosts = useSelector(state => state.homePosts || {});
    const postState = useSelector(state => state.post || {});
    
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState(null);
    
    const lastCategoryRef = useRef();

    // 📌 Cargar categorías iniciales
    useEffect(() => {
        const loadInitialCategories = async () => {
            try {
                console.log('🏠 Home - Cargando categorías iniciales...');
                setLoading(true);
                
                const result = await dispatch(getCategories(1, 2));
                
                if (result && result.categories && result.categories.length > 0) {
                    console.log('✅ Categorías cargadas:', result.categories.length);
                } else {
                    console.warn('⚠️ No se recibieron categorías');
                }
                
            } catch (error) {
                console.error('❌ Error cargando categorías:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        
        loadInitialCategories();
    }, [dispatch]);

    // 📌 Cargar posts para cada categoría visible
    useEffect(() => {
        if (!loading && homePosts.categories && homePosts.categories.length > 0) {
            console.log('📥 Cargando posts para', homePosts.categories.length, 'categorías');
            
            homePosts.categories.forEach(async (category, index) => {
                // Esperar para no sobrecargar
                await new Promise(resolve => setTimeout(resolve, index * 300));
                
                if (category.name) {
                    try {
                        console.log(`📡 Cargando posts para: ${category.name}`);
                        await dispatch(getPostsByCategory(category.name, 1, { limit: 8 }));
                    } catch (error) {
                        console.error(`❌ Error cargando posts para ${category.name}:`, error);
                    }
                }
            });
        }
    }, [loading, homePosts.categories, dispatch]);

    // 📌 Función segura para obtener posts de categoría
    const getPostsForCategory = useCallback((categoryName) => {
        if (!categoryName) return [];
        
        // 1. Buscar en categoryPosts de homePosts
        if (homePosts.categoryPosts && homePosts.categoryPosts[categoryName]) {
            return homePosts.categoryPosts[categoryName];
        }
        
        // 2. Buscar en categoryPosts de postState
        if (postState.categoryPosts && postState.categoryPosts[categoryName]) {
            return postState.categoryPosts[categoryName];
        }
        
        // 3. Buscar en posts de homePosts
        if (homePosts.posts && Array.isArray(homePosts.posts)) {
            return homePosts.posts.filter(p => p.categorie === categoryName);
        }
        
        return [];
    }, [homePosts, postState]);

    // 📌 Función para cargar más categorías
    const loadMoreCategories = useCallback(async () => {
        if (loadingMore || !homePosts.categoriesHasMore) return;
        
        setLoadingMore(true);
        try {
            const nextPage = (homePosts.categoriesPage || 0) + 1;
            console.log(`📥 Cargando página ${nextPage} de categorías...`);
            
            await dispatch(getCategories(nextPage, 2));
        } catch (error) {
            console.error('Error cargando más categorías:', error);
        } finally {
            setLoadingMore(false);
        }
    }, [dispatch, loadingMore, homePosts.categoriesHasMore, homePosts.categoriesPage]);

    // 📌 Observer para scroll infinito
    useEffect(() => {
        if (loading || loadingMore || !homePosts.categoriesHasMore) return;
        
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && homePosts.categoriesHasMore) {
                    loadMoreCategories();
                }
            },
            { threshold: 0.5 }
        );
        
        const currentRef = lastCategoryRef.current;
        if (currentRef) {
            observer.observe(currentRef);
        }
        
        return () => {
            if (currentRef) {
                observer.unobserve(currentRef);
            }
        };
    }, [loading, loadingMore, homePosts.categoriesHasMore, loadMoreCategories]);

    // 📌 Filtrar categorías por búsqueda
    const filteredCategories = homePosts.categories
        ?.filter(cat => {
            if (!cat || !cat.name) {
                console.warn('⚠️ Categoría inválida ignorada:', cat);
                return false;
            }
            
            const catName = String(cat.name).toLowerCase();
            const query = String(searchQuery).toLowerCase();
            
            return catName.includes(query);
        }) || [];

    // 📌 DEBUG: Ver estado
    useEffect(() => {
        console.log('🔍 DEBUG ESTADO HOME:', {
            homePosts: {
                categoriesCount: homePosts.categories?.length || 0,
                categoriesNames: homePosts.categories?.map(c => c.name),
                categoriesPage: homePosts.categoriesPage,
                categoriesHasMore: homePosts.categoriesHasMore,
                categoryPostsKeys: homePosts.categoryPosts ? Object.keys(homePosts.categoryPosts) : []
            },
            postState: {
                categoryPostsKeys: postState.categoryPosts ? Object.keys(postState.categoryPosts) : []
            }
        });
    }, [homePosts, postState]);

    return (
        <div className="marketplace-home">
            <HeaderCarousel/>
            <CategorySlider/>
            
            {/* BARRA DE BÚSQUEDA */}
            <Container className='mb-3'>
                <Row className="justify-content-center">
                    <Col md={6} lg={5}>
                        <InputGroup className="shadow-sm">
                            <InputGroup.Text className="bg-white border-end-0">
                                <i className="fas fa-search text-muted"></i>
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Rechercher catégories..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="border-start-0"
                            />
                        </InputGroup>
                    </Col>
                </Row>
            </Container>

            {/* CONTENIDO PRINCIPAL */}
            <Container>
                {loading ? (
                    <Row className="justify-content-center py-5">
                        <Col xs="auto" className="text-center">
                            <img src={LoadIcon} alt="loading" />
                            <p className="mt-2 text-muted">Chargement des catégories...</p>
                        </Col>
                    </Row>
                ) : error ? (
                    <Row className="justify-content-center py-5">
                        <Col md={6} className="text-center">
                            <div className="alert alert-danger">
                                <i className="fas fa-exclamation-triangle me-2"></i>
                                {error}
                            </div>
                        </Col>
                    </Row>
                ) : filteredCategories.length === 0 ? (
                    <Row className="justify-content-center py-5">
                        <Col md={6} className="text-center">
                            <div className="alert alert-warning">
                                <i className="fas fa-info-circle me-2"></i>
                                Aucune catégorie disponible pour le moment
                            </div>
                        </Col>
                    </Row>
                ) : (
                    <div className="categories-container">
                        {filteredCategories.map((category, index) => {
                            if (!category.name) return null;
                            
                            const postsForCategory = getPostsForCategory(category.name);
                            const isLastCategory = index === filteredCategories.length - 1;
                            
                            return (
                                <div 
                                    key={category._id || `cat-${index}`}
                                    ref={isLastCategory ? lastCategoryRef : null}
                                    className="category-section mb-5"
                                >
                                    {/* HEADER DE CATÉGORIE */}
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div className="d-flex align-items-center">
                                            <div className="category-icon me-3" style={{
                                                width: '50px',
                                                height: '50px',
                                                backgroundColor: '#f8f9fa',
                                                borderRadius: '50%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '24px'
                                            }}>
                                                {category.emoji || '📁'}
                                            </div>
                                            <div>
                                                <h2 className="h4 fw-bold mb-1 text-capitalize">
                                                    {category.displayName || category.name}
                                                </h2>
                                                <small className="text-muted">
                                                    {category.count || postsForCategory.length} annonces
                                                </small>
                                            </div>
                                        </div>
                                        
                                        <Link 
                                            to={`/category/${category.slug || category.name.toLowerCase()}/1`}
                                            className="btn btn-outline-primary btn-sm"
                                        >
                                            Voir tout
                                        </Link>
                                    </div>

                                    {/* POSTS DE LA CATÉGORÍA */}
                                    {postsForCategory.length > 0 ? (
                                        <Row>
                                            {postsForCategory.slice(0, 8).map(post => (
                                                <Col key={post._id} md={3} sm={6} className="mb-4">
                                                    <PostCard post={post} />
                                                </Col>
                                            ))}
                                        </Row>
                                    ) : (
                                        <div className="text-center py-4">
                                            <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                            <span className="text-muted">
                                                Chargement des annonces pour {category.name}...
                                            </span>
                                        </div>
                                    )}
                                    
                                    {index < filteredCategories.length - 1 && <hr className="my-5" />}
                                </div>
                            );
                        })}
                        
                        {/* LOADING MORE */}
                        {loadingMore && (
                            <div className="text-center py-4">
                                <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                <span>Chargement de plus de catégories...</span>
                            </div>
                        )}
                        
                        {/* NO MORE CATEGORIES */}
                        {!homePosts.categoriesHasMore && filteredCategories.length > 0 && (
                            <div className="text-center py-4">
                                <div className="alert alert-light">
                                    <i className="fas fa-check-circle text-success me-2"></i>
                                    Toutes les catégories sont chargées
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Container>
        </div>
    );
};

export default Home;