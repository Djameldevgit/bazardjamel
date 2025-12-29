import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Row, 
    Col, 
    Container,
    Button,
    Badge,
    ProgressBar,
    OverlayTrigger,
    Tooltip
} from 'react-bootstrap';
import Posts from '../components/home/Posts';
import { getCategories, getPostsBySubcategory  } from '../redux/actions/postAction';
import LoadIcon from '../images/loading.gif';
import DynamicCategorySlider from '../components/SlidersHeadrs/DynamicCategorySlider';
  
// Base de datos de subcategorías por categoría principal
const subcategoriesDatabase = {
  'electromenager': [
    { id: 'televiseurs', name: 'Téléviseurs', emoji: '📺', color: 'primary' },
    { id: 'demodulateurs_box_tv', name: 'Démodulateurs & Box TV', emoji: '📦', color: 'secondary' },
    // ... todas las subcategorías de electromenager
  ],
  'vehicules': [
    { id: 'automobiles', name: 'Voitures', emoji: '🚗', color: 'primary' },
    { id: 'motos', name: 'Motos', emoji: '🏍️', color: 'success' },
    // ... todas las subcategorías de vehicules
  ],
  // ... agregar todas las categorías principales
};

const SubcategoryPage = () => {
    const dispatch = useDispatch();
    const { categoryName, subcategoryId } = useParams();
    const { homePosts } = useSelector(state => state);
    
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const scrollContainerRef = useRef(null);
    const [currentSubcategory, setCurrentSubcategory] = useState(null);

    // 📌 Encontrar información de la subcategoría actual
    useEffect(() => {
        if (categoryName && subcategoryId) {
            const categoryData = subcategoriesDatabase[categoryName];
            if (categoryData) {
                const found = categoryData.find(sub => sub.id === subcategoryId);
                setCurrentSubcategory(found);
            }
        }
    }, [categoryName, subcategoryId]);

    // 📌 Cargar posts de la subcategoría
    useEffect(() => {
        const loadSubcategoryPosts = async () => {
            if (!categoryName || !subcategoryId) return;
            
            setLoading(true);
            console.log(`📂 SubcategoryPage - Loading posts for: ${categoryName}/${subcategoryId}`);
            
            try {
                await dispatch(getPostsBySubcategory(categoryName, subcategoryId, 1, { limit }));
                setPage(2);
            } catch (error) {
                console.error('❌ SubcategoryPage - Error loading posts:', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadSubcategoryPosts();
    }, [dispatch, categoryName, subcategoryId, limit]);

    // 📌 Cargar más posts
    const loadMorePosts = async () => {
        console.log(`📥 Loading more posts, page ${page}`);
        try {
            await dispatch(getPostsBySubcategory(categoryName, subcategoryId, page, { limit }));
            setPage(prev => prev + 1);
        } catch (error) {
            console.error('Error loading more posts:', error);
        }
    };

    // 📌 Función para hacer scroll horizontal
    const scrollHorizontal = (direction) => {
        if (scrollContainerRef.current) {
            const scrollAmount = 350;
            const container = scrollContainerRef.current;
            
            if (direction === 'left') {
                container.scrollLeft -= scrollAmount;
            } else {
                container.scrollLeft += scrollAmount;
            }
        }
    };

    // 📌 Contar posts totales cargados
    const totalLoaded = homePosts.posts?.length || 0;
    
    if (!categoryName || !subcategoryId) {
        return (
            <Container className="text-center py-5">
                <h4>Subcategoría no especificada</h4>
                <Link to="/" className="btn btn-primary">
                    Volver al inicio
                </Link>
            </Container>
        );
    }
    
    return (
        <Container className="subcategory-posts-page py-4">
            {/* BREADCRUMB */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <Link to="/">
                            <i className="fas fa-home me-1"></i>
                            Inicio
                        </Link>
                    </li>
                    <li className="breadcrumb-item">
                        <Link to={`/category/${categoryName}`}>
                            {categoryName}
                        </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        {currentSubcategory?.name || subcategoryId}
                    </li>
                </ol>
            </nav>
            
            {/* SLIDER DE LA CATEGORÍA PRINCIPAL */}
            <div className="mb-5">
                <DynamicCategorySlider categoryName={categoryName} />
            </div>
            
            {/* ENCABEZADO DE SUBCATEGORÍA */}
            <Row className="mb-4 align-items-center">
                <Col>
                    <div className="d-flex align-items-center">
                        <div 
                            className="rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{ 
                                width: '60px', 
                                height: '60px',
                                background: currentSubcategory?.color ? 
                                    `linear-gradient(135deg, ${currentSubcategory.color}15 0%, ${currentSubcategory.color}10 100%)` : 
                                    'linear-gradient(135deg, #667eea15 0%, #764ba210 100%)',
                                border: `2px solid ${currentSubcategory?.color || '#667eea'}30`
                            }}
                        >
                            <span style={{ fontSize: '2rem' }}>
                                {currentSubcategory?.emoji || '📁'}
                            </span>
                        </div>
                        <div>
                            <h2 className="mb-0">
                                {currentSubcategory?.name || subcategoryId}
                            </h2>
                            <p className="text-muted mb-0">
                                {totalLoaded} anuncios disponibles
                            </p>
                        </div>
                    </div>
                </Col>
                <Col xs="auto">
                    <div className="d-flex gap-2">
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Desplazar izquierda</Tooltip>}
                        >
                            <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => scrollHorizontal('left')}
                                className="rounded-circle"
                            >
                                <i className="fas fa-chevron-left"></i>
                            </Button>
                        </OverlayTrigger>
                        
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Desplazar derecha</Tooltip>}
                        >
                            <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => scrollHorizontal('right')}
                                className="rounded-circle"
                            >
                                <i className="fas fa-chevron-right"></i>
                            </Button>
                        </OverlayTrigger>
                    </div>
                </Col>
            </Row>
            
            {/* POSTS EN FILA HORIZONTAL CON SCROLL */}
            {loading ? (
                <Row className="justify-content-center py-5">
                    <Col xs="auto" className="text-center">
                        <img src={LoadIcon} alt="loading" />
                        <p className="mt-2">Cargando anuncios de {currentSubcategory?.name || subcategoryId}...</p>
                    </Col>
                </Row>
            ) : (
                <>
                    {/* CONTENEDOR CON SCROLL HORIZONTAL */}
                    <div 
                        ref={scrollContainerRef}
                        style={{
                            overflowX: 'auto',
                            overflowY: 'hidden',
                            whiteSpace: 'nowrap',
                            padding: '15px 0',
                            marginBottom: '30px',
                            scrollBehavior: 'smooth',
                            msOverflowStyle: 'none',
                            scrollbarWidth: 'none'
                        }}
                        className="mb-4"
                    >
                        <div style={{ display: 'inline-flex', gap: '20px', padding: '0 10px' }}>
                            <Posts 
                                selectedCategory={categoryName}
                                selectedSubcategory={subcategoryId}
                                fromSubcategoryPage={true}
                                displayMode="horizontal"
                            />
                        </div>
                    </div>
                    
                    {/* TODOS LOS ANUNCIOS EN GRID */}
                    <div className="mt-5 pt-4 border-top">
                        <h4 className="mb-3">
                            <i className="fas fa-th-large me-2"></i>
                            Todos los anuncios de {currentSubcategory?.name || subcategoryId}
                        </h4>
                        <Row xs={1} sm={2} md={3} lg={4} className="g-3">
                            <Posts 
                                selectedCategory={categoryName}
                                selectedSubcategory={subcategoryId}
                                fromSubcategoryPage={true}
                                displayMode="grid"
                            />
                        </Row>
                    </div>
                    
                    {/* PAGINACIÓN */}
                    {totalLoaded > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center mt-5 pt-4 border-top"
                        >
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={loadMorePosts}
                                disabled={loading}
                                className="px-5"
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2"></span>
                                        Cargando...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-plus-circle me-2"></i>
                                        Cargar más anuncios
                                    </>
                                )}
                            </Button>
                            <p className="text-muted mt-2">
                                Página {page - 1} • {totalLoaded} anuncios cargados
                            </p>
                        </motion.div>
                    )}
                    
                    {/* VOLVER A CATEGORÍA */}
                    <Row className="justify-content-center mt-5">
                        <Col xs="auto">
                            <Link to={`/category/${categoryName}`} className="btn btn-outline-secondary">
                                <i className="fas fa-arrow-left me-2"></i>
                                Volver a {categoryName}
                            </Link>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default SubcategoryPage;