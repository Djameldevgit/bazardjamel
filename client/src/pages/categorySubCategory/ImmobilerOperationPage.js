import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, Link, useLocation } from 'react-router-dom';
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
import Posts from '../../components/home/Posts';
import { getPostsByImmobilierOperation, getSubCategoriesByCategory } from '../../redux/actions/postAction';
import LoadIcon from '../../images/loading.gif';
import DynamicCategorySlider from '../../components/SlidersHeadrs/DynamicCategorySlider';

const ImmobilerOperationPage = () => {
    const dispatch = useDispatch();
    const { operationId } = useParams(); // Solo operationId, NO categoryName
    const location = useLocation();
    const { homePosts } = useSelector(state => state);
    
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const scrollContainerRef = useRef(null);
    const [currentOperation, setCurrentOperation] = useState(null);

    // 📌 DEBUG
    useEffect(() => {
        console.log('🔍 ImmobilerOperationPage Mounted:', {
            operationId,
            location: location.pathname,
            immobilierPosts: homePosts.immobilierPosts?.length,
            immobilierTotal: homePosts.immobilierTotal
        });
    }, [operationId, location, homePosts]);

    // 📌 Mapear nombres de operaciones
    const operationNames = {
        'vente': { 
            name: 'Vente', 
            emoji: '💰', 
            description: 'Biens à vendre',
            color: '#37ecba'
        },
        'location': { 
            name: 'Location', 
            emoji: '🏠', 
            description: 'Biens en location',
            color: '#667eea'
        },
        'location_vacances': { 
            name: 'Location Vacances', 
            emoji: '🌴', 
            description: 'Location saisonnière',
            color: '#f5576c'
        },
        'cherche_location': { 
            name: 'Cherche Location', 
            emoji: '🔍', 
            description: 'Recherche location',
            color: '#6a11cb'
        },
        'cherche_achat': { 
            name: 'Cherche Achat', 
            emoji: '🏡', 
            description: 'Recherche achat',
            color: '#ff9a9e'
        }
    };

    // 📌 Obtener información de la operación
    useEffect(() => {
        if (operationId && operationNames[operationId]) {
            setCurrentOperation(operationNames[operationId]);
        }
    }, [operationId]);

    // 📌 Cargar posts de la operación
    useEffect(() => {
        const loadOperationPosts = async () => {
            if (!operationId) return;
            
            setLoading(true);
            console.log(`📂 ImmobilerOperationPage - Loading posts for operation: ${operationId}`);
            
            try {
                await dispatch(getPostsByImmobilierOperation(operationId, 1, { limit }));
                setPage(2);
            } catch (error) {
                console.error('❌ ImmobilerOperationPage - Error loading posts:', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadOperationPosts();
    }, [dispatch, operationId, limit]);

    // 📌 Cargar más posts
    const loadMorePosts = async () => {
        console.log(`📥 Loading more posts, page ${page}`);
        try {
            await dispatch(getPostsByImmobilierOperation(operationId, page, { limit }));
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
    const totalLoaded = homePosts.immobilierPosts?.length || 0;
    const totalPosts = homePosts.immobilierTotal || 0;
    const hasMore = homePosts.immobilierHasMore || false;
    
    // 📌 Calcular progreso de carga
    const progressPercentage = totalPosts > 0 
        ? Math.min((totalLoaded / totalPosts) * 100, 100)
        : 0;

    if (!operationId) {
        return (
            <Container className="text-center py-5">
                <h4>Opération non spécifiée</h4>
                <Link to="/category/immobilier" className="btn btn-primary">
                    Retour à Immobilier
                </Link>
            </Container>
        );
    }
    
    return (
        <Container className="immobiler-operation-page py-4">
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
                        <Link to="/category/immobilier">
                            Immobilier
                        </Link>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        {currentOperation?.name || operationId}
                        {totalPosts > 0 && (
                            <Badge bg="secondary" className="ms-2">
                                {totalPosts} annonces
                            </Badge>
                        )}
                    </li>
                </ol>
            </nav>
            
            {/* SLIDER DE IMMOBILIER (mostrará SliderImmobilerProperties) */}
            <div className="mb-5">
                <DynamicCategorySlider categoryName="immobilier" />
            </div>
            
            {/* ENCABEZADO DE LA OPERACIÓN */}
            <Row className="mb-4 align-items-center">
                <Col>
                    <div className="d-flex align-items-center">
                        <div 
                            className="rounded-circle d-flex align-items-center justify-content-center me-3"
                            style={{ 
                                width: '60px', 
                                height: '60px',
                                background: currentOperation?.color 
                                    ? `linear-gradient(135deg, ${currentOperation.color}15 0%, ${currentOperation.color}10 100%)`
                                    : 'linear-gradient(135deg, #667eea15 0%, #764ba210 100%)',
                                border: `2px solid ${currentOperation?.color || '#667eea'}30`
                            }}
                        >
                            <span style={{ fontSize: '2rem' }}>
                                {currentOperation?.emoji || '🏠'}
                            </span>
                        </div>
                        <div>
                            <h2 className="mb-0">
                                {currentOperation?.name || operationId}
                            </h2>
                            <p className="text-muted mb-0">
                                {currentOperation?.description || 'Annonces immobilières'}
                            </p>
                            <p className="text-muted mb-0 small">
                                {totalLoaded} de {totalPosts} annonces chargées
                            </p>
                        </div>
                    </div>
                </Col>
                <Col xs="auto">
                    <div className="d-flex gap-2">
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip>Déplacer vers la gauche</Tooltip>}
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
                            overlay={<Tooltip>Déplacer vers la droite</Tooltip>}
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
            
            {/* BARRA DE PROGRESO */}
            {totalPosts > 0 && (
                <ProgressBar 
                    now={progressPercentage} 
                    className="mb-3" 
                    label={`${Math.round(progressPercentage)}% chargé`}
                    variant="primary"
                    animated
                />
            )}
            
            {/* POSTS EN FILA HORIZONTAL CON SCROLL */}
            {loading ? (
                <Row className="justify-content-center py-5">
                    <Col xs="auto" className="text-center">
                        <img src={LoadIcon} alt="loading" />
                        <p className="mt-2">Chargement des annonces {currentOperation?.name || operationId}...</p>
                    </Col>
                </Row>
            ) : totalLoaded === 0 ? (
                <Row className="justify-content-center py-5">
                    <Col xs="auto" className="text-center">
                        <div className="mb-4">
                            <span style={{ fontSize: '4rem', opacity: 0.5 }}>🏠</span>
                        </div>
                        <h4 className="text-muted">Aucune annonce disponible</h4>
                        <p className="text-muted">
                            Il n'y a pas d'annonces pour "{currentOperation?.name || operationId}" pour le moment.
                        </p>
                        <div className="mt-4">
                            <Link to="/category/immobilier" className="btn btn-primary me-2">
                                <i className="fas fa-arrow-left me-2"></i>
                                Retour à Immobilier
                            </Link>
                            <Link to="/" className="btn btn-outline-secondary">
                                <i className="fas fa-home me-2"></i>
                                Retour à l'accueil
                            </Link>
                        </div>
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
                           selectedCategory="immobilier"
                           selectedSubcategory={operationId}
                           fromImmobilerPage={true} // 🆕 IMPORTANTE
                           displayMode="horizontal"
                            />
                        </div>
                    </div>
                    
                    {/* TODOS LOS ANUNCIOS EN GRID */}
                    <div className="mt-5 pt-4 border-top">
                        <h4 className="mb-3">
                            <i className="fas fa-th-large me-2"></i>
                            Toutes les annonces {currentOperation?.name || operationId}
                        </h4>
                        <Row xs={1} sm={2} md={3} lg={4} className="g-3">
                            <Posts 
                                selectedCategory="immobilier"
                                selectedSubcategory={operationId}
                                fromImmobilerPage={true}
                                displayMode="grid"
                            />
                        </Row>
                    </div>
                    
                    {/* PAGINACIÓN */}
                    {hasMore && (
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
                                        Chargement...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-plus-circle me-2"></i>
                                        Charger plus d'annonces ({totalPosts - totalLoaded} restantes)
                                    </>
                                )}
                            </Button>
                            <p className="text-muted mt-2">
                                Page {page - 1} • {totalLoaded} de {totalPosts} annonces
                            </p>
                        </motion.div>
                    )}
                    
                    {/* VOLVER A IMMOBILIER */}
                    <Row className="justify-content-center mt-5">
                        <Col xs="auto">
                            <Link to="/category/immobilier" className="btn btn-outline-secondary">
                                <i className="fas fa-arrow-left me-2"></i>
                                Retour à Immobilier
                            </Link>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default ImmobilerOperationPage;