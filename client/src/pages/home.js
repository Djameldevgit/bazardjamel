import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Row, Col, Container, Form, InputGroup } from 'react-bootstrap';
import { getCategories, getPostsByCategory } from '../redux/actions/postAction';
import LoadIcon from '../images/loading.gif';
import HeaderCarousel from '../components/SlidersHeadrs/HeaderCarousel';
import CategorySlider from '../components/SlidersHeadrs/CategorySlider';
import PostCard from '../components/PostCard';

const Home = () => {
    const dispatch = useDispatch();
    const { homePosts } = useSelector(state => state);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    
    const lastCategoryRef = useRef();

    // 📌 Cargar PRIMERAS 2 categorías al inicio
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                console.log('🏠 Home - Cargando primeras 2 categorías...');
                await dispatch(getCategories(1, 2));
                setLoading(false);
            } catch (error) {
                console.error('Error loading categories:', error);
                setLoading(false);
            }
        };
        
        loadInitialData();
    }, [dispatch]);

    // 📌 Cargar 6 posts para cada categoría cargada
    useEffect(() => {
        if (!loading && homePosts.categories && homePosts.categories.length > 0) {
            console.log('📥 Cargando posts para categorías visibles...');
            
            homePosts.categories.forEach(async (category, index) => {
                // Solo cargar si no tiene posts ya
                if (!homePosts.categoryPosts?.[category.name]) {
                    setTimeout(async () => {
                        try {
                            await dispatch(getPostsByCategory(category.name, 1, { limit: 8 }));
                        } catch (error) {
                            console.error(`Error loading posts for ${category.name}:`, error);
                        }
                    }, index * 300);
                }
            });
        }
    }, [loading, homePosts.categories, dispatch]);

    // 📌 Función para cargar MÁS categorías (scroll infinito)
    const loadMoreCategories = useCallback(async () => {
        if (loadingMore || !homePosts.categoriesHasMore) return;
        
        setLoadingMore(true);
        try {
            const nextPage = (homePosts.categoriesPage || 0) + 1;
            console.log(`📥 Cargando página ${nextPage} de categorías...`);
            
            await dispatch(getCategories(nextPage, 2));
        } catch (error) {
            console.error('Error loading more categories:', error);
        } finally {
            setLoadingMore(false);
        }
    }, [dispatch, loadingMore, homePosts.categoriesHasMore, homePosts.categoriesPage]);

    // 📌 Observer para scroll infinito
    useEffect(() => {
        if (loading || !homePosts.categoriesHasMore) return;
        
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && homePosts.categoriesHasMore) {
                    loadMoreCategories();
                }
            },
            { threshold: 0.5 }
        );
        
        if (lastCategoryRef.current) {
            observer.observe(lastCategoryRef.current);
        }
        
        return () => {
            if (lastCategoryRef.current) {
                observer.unobserve(lastCategoryRef.current);
            }
        };
    }, [loading, homePosts.categories, homePosts.categoriesHasMore, loadMoreCategories]);

    // 📌 Filtrar categorías por búsqueda
    const filteredCategories = homePosts.categories
        ?.filter(cat => 
            cat.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) || [];

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
                                placeholder="Rechercher categoríes..."
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
                            <p className="mt-2 text-muted">Telecharge categoríes...</p>
                        </Col>
                    </Row>
                ) : (
                    <div className="categories-container">
                        {/* LISTA DE CATEGORÍAS CON PAGINACIÓN */}
                        {filteredCategories.map((category, index) => {
                            const postsForCategory = homePosts.categoryPosts?.[category.name] || [];
                            const isLastCategory = index === filteredCategories.length - 1;
                            
                            return (
                                <div 
                                    key={category.name}
                                    ref={isLastCategory ? lastCategoryRef : null}
                                    className="category-section mb-5"
                                >
                                    {/* HEADER DE CATEGORÍA */}
                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                        <div className="d-flex align-items-center">
                                            <div 
                                                className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                                                style={{ 
                                                    width: '50px', 
                                                    height: '50px',
                                                    flexShrink: 0 
                                                }}
                                            >
                                                <span style={{ fontSize: '1.5rem' }}>
                                                    {category.emoji || '📁'}
                                                </span>
                                            </div>
                                            <div>
                                                <h2 className="h4 fw-bold mb-1 text-capitalize">
                                                    {category.name}
                                                </h2>
                                                <small className="text-muted">
                                                    {category.count} annonces disponibles
                                                </small>
                                            </div>
                                        </div>
                                        
                                        <Link 
                                            to={`/category/${category.name}`}
                                            className="btn btn-outline-primary btn-sm px-3"
                                        >
                                            voir toutes
                                            <i className="fas fa-arrow-right ms-2"></i>
                                        </Link>
                                    </div>

                                    {/* POSTS POR CATEGORÍA CON CLASE post_thumb */}
                                    {postsForCategory.length > 0 ? (
                                        <div className="post_thumb">
                                            {postsForCategory.slice(0, 8).map((post) => (
                                                <div key={post._id} className="post_thumb_display">
                                                    <PostCard post={post} />
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <Row className="py-4">
                                            <Col className="text-center">
                                                <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                                <span className="text-muted">Telecharge annonces de {category.name}...</span>
                                            </Col>
                                        </Row>
                                    )}
                                    
                                    {/* SEPARADOR */}
                                    {index < filteredCategories.length - 1 && (
                                        <hr className="my-5" />
                                    )}
                                </div>
                            );
                        })}
                        
                        {/* LOADING MORE INDICATOR */}
                        {loadingMore && (
                            <Row className="justify-content-center py-4">
                                <Col xs="auto" className="text-center">
                                    <div className="spinner-border spinner-border-sm text-primary me-2"></div>
                                    <span className="text-muted">Telecharge plus categoríes...</span>
                                </Col>
                            </Row>
                        )}
                        
                        {/* NO MORE CATEGORIES MESSAGE */}
                        {!homePosts.categoriesHasMore && filteredCategories.length > 0 && (
                            <Row className="justify-content-center py-5">
                                <Col md={6} className="text-center">
                                    <div className="alert alert-light border p-3">
                                        <i className="fas fa-check-circle text-success me-2"></i>
                                        <span className="text-muted">
                                            Vous avez vue toutes les categoríes disponible
                                        </span>
                                    </div>
                                </Col>
                            </Row>
                        )}
                    </div>
                )}
            </Container>
        </div>
    );
};

export default Home;