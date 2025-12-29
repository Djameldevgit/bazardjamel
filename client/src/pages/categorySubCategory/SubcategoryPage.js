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
import {     getPostsBySubcategory  } from '../../redux/actions/postAction';

import LoadIcon from '../../images/loading.gif';
import DynamicCategorySlider from '../../components/SlidersHeadrs/DynamicCategorySlider';

const SubcategoryPage = () => {
    const dispatch = useDispatch();
    const { categoryName, subcategoryId } = useParams();
    const location = useLocation();
    const { homePosts } = useSelector(state => state);
    
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [limit] = useState(12);
    const scrollContainerRef = useRef(null);
    const [currentSubcategory, setCurrentSubcategory] = useState(null);
    const [subcategories, setSubcategories] = useState([]);
    const [isImmobilierRoute, setIsImmobilierRoute] = useState(false);
    const [operationId, setOperationId] = useState(null);

    // 📌 DEBUG: Verificar qué parámetros recibimos
    useEffect(() => {
        console.log('🔍 SubcategoryPage Params:', {
            categoryName,
            subcategoryId,
            pathname: location.pathname,
            isImmobilier: location.pathname.includes('/immobilier/')
        });
    }, [categoryName, subcategoryId, location.pathname]);

    // 📌 Determinar si es una ruta de immobiler
    useEffect(() => {
        if (location.pathname.includes('/immobilier/')) {
            setIsImmobilierRoute(true);
            
            // Extraer operationId para rutas de immobiler
            const pathParts = location.pathname.split('/').filter(p => p);
            if (pathParts.length >= 2) {
                // Si es /immobilier/vente, operationId = "vente"
                // Si es /immobilier/vente/villa, operationId = "vente", subcategoryId = "villa"
                if (pathParts[0] === 'immobilier') {
                    setOperationId(pathParts[1]);
                }
            }
        }
    }, [location.pathname]);

    // 📌 Obtener subcategorías de la categoría principal (solo para categorías normales)
    useEffect(() => {
        const loadSubcategories = async () => {
            // Si es immobiler, no necesitamos cargar subcategorías de esta manera
            if (isImmobilierRoute) return;
            
            if (!categoryName) return;
            
            try {
                // Verificar si existe la acción getSubCategoriesByCategory
                if (typeof getSubCategoriesByCategory === 'function') {
                    const result = await dispatch(getSubCategoriesByCategory(categoryName));
                    if (result?.success && result.subcategories) {
                        setSubcategories(result.subcategories);
                        
                        // Encontrar la subcategoría actual
                        const found = result.subcategories.find(sub => sub.id === subcategoryId);
                        setCurrentSubcategory(found);
                    }
                }
            } catch (error) {
                console.error('Error loading subcategories:', error);
            }
        };
        
        loadSubcategories();
    }, [dispatch, categoryName, subcategoryId, isImmobilierRoute]);

    // 📌 Cargar posts de la subcategoría
    useEffect(() => {
        const loadSubcategoryPosts = async () => {
            setLoading(true);
            
            try {
                if (isImmobilierRoute && operationId) {
                    console.log(`📂 SubcategoryPage - Loading IMMOBILIER posts for: ${operationId}/${subcategoryId || 'all'}`);
                    
                    // Para immobiler, necesitas una acción especial
                    // Por ahora, usar getPostsBySubcategory con los parámetros apropiados
                    const result = await dispatch(getPostsBySubcategory('immobilier', operationId, 1, { limit }));
                    
                    // Si hay subcategoryId (nivel 2), filtrar más
                    if (subcategoryId && result?.posts) {
                        // Filtrar posts por propiedad (villa, appartement, etc.)
                        const filteredPosts = result.posts.filter(post => 
                            post.propertyType === subcategoryId || post.subCategory === subcategoryId
                        );
                        // Aquí deberías actualizar el estado con los posts filtrados
                        console.log(`Filtrados ${filteredPosts.length} posts para propiedad: ${subcategoryId}`);
                    }
                    
                    setPage(2);
                } else {
                    // Para categorías normales
                    if (!categoryName || !subcategoryId) return;
                    
                    console.log(`📂 SubcategoryPage - Loading posts for: ${categoryName}/${subcategoryId}`);
                    
                    const result = await dispatch(getPostsBySubcategory(categoryName, subcategoryId, 1, { limit }));
                    
                    console.log('📊 Resultado de getPostsBySubcategory:', {
                        success: result?.success,
                        postsCount: result?.posts?.length,
                        total: result?.total
                    });
                    
                    setPage(2);
                }
            } catch (error) {
                console.error('❌ SubcategoryPage - Error loading posts:', error);
            } finally {
                setLoading(false);
            }
        };
        
        loadSubcategoryPosts();
    }, [dispatch, categoryName, subcategoryId, isImmobilierRoute, operationId, limit]);

    // 📌 Cargar más posts
    const loadMorePosts = async () => {
        console.log(`📥 Loading more posts, page ${page}`);
        try {
            if (isImmobilierRoute && operationId) {
                await dispatch(getPostsBySubcategory('immobilier', operationId, page, { limit }));
            } else {
                await dispatch(getPostsBySubcategory(categoryName, subcategoryId, page, { limit }));
            }
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

    // 📌 Determinar el título de la página
    const getPageTitle = () => {
        if (isImmobilierRoute) {
            if (operationId && subcategoryId) {
                // Nivel 2: /immobilier/vente/villa
                const propertyNames = {
                    'villa': 'Villas',
                    'appartement': 'Appartements',
                    'terrain': 'Terrains',
                    'local': 'Locaux',
                    'immeuble': 'Immeubles',
                    'bungalow': 'Bungalows',
                    'studio': 'Studios',
                    'duplex': 'Duplex',
                    'triplex': 'Triplex'
                };
                
                const operationNames = {
                    'vente': 'à vendre',
                    'location': 'en location',
                    'location_vacances': 'en location vacances',
                    'cherche_location': 'recherche location',
                    'cherche_achat': 'recherche achat'
                };
                
                return `${propertyNames[subcategoryId] || subcategoryId} ${operationNames[operationId] || operationId}`;
            } else if (operationId) {
                // Nivel 1: /immobilier/vente
                const operationNames = {
                    'vente': 'Biens à vendre',
                    'location': 'Biens en location',
                    'location_vacances': 'Location vacances',
                    'cherche_location': 'Recherche location',
                    'cherche_achat': 'Recherche achat'
                };
                return operationNames[operationId] || operationId;
            }
        }
        
        return currentSubcategory?.name || subcategoryId || 'Subcategoría';
    };

    // 📌 Determinar el enlace para volver
    const getBackLink = () => {
        if (isImmobilierRoute) {
            if (subcategoryId) {
                // Si estamos en nivel 2 (/immobilier/vente/villa), volver a nivel 1 (/immobilier/vente)
                return `/immobilier/${operationId}`;
            } else {
                // Si estamos en nivel 1 (/immobilier/vente), volver a categoría immobiler
                return `/category/immobilier`;
            }
        }
        
        // Para categorías normales, volver a la categoría
        return `/category/${categoryName}`;
    };

    // 📌 Determinar el texto del breadcrumb
    const getBreadcrumbText = () => {
        if (isImmobilierRoute) {
            return 'Immobilier';
        }
        return categoryName;
    };

    // 📌 Contar posts totales cargados
    const totalLoaded = homePosts.posts?.length || 0;
    const totalPosts = currentSubcategory?.count || homePosts.total || 0;
    const hasMore = totalLoaded < totalPosts;
    
    // 📌 Calcular progreso de carga
    const progressPercentage = totalPosts > 0 
        ? Math.min((totalLoaded / totalPosts) * 100, 100)
        : 0;

    if ((!categoryName && !isImmobilierRoute) || (!subcategoryId && !operationId && !isImmobilierRoute)) {
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
                        <Link to={isImmobilierRoute ? "/category/immobilier" : `/category/${categoryName}`}>
                            {getBreadcrumbText()}
                        </Link>
                    </li>
                    {isImmobilierRoute && operationId && (
                        <li className="breadcrumb-item">
                            <Link to={`/immobilier/${operationId}`}>
                                {operationId === 'vente' ? 'Vente' : 
                                 operationId === 'location' ? 'Location' : 
                                 operationId === 'location_vacances' ? 'Location vacances' :
                                 operationId === 'cherche_location' ? 'Cherche location' :
                                 operationId === 'cherche_achat' ? 'Cherche achat' : operationId}
                            </Link>
                        </li>
                    )}
                    <li className="breadcrumb-item active" aria-current="page">
                        {getPageTitle()}
                        {currentSubcategory?.count && (
                            <Badge bg="secondary" className="ms-2">
                                {currentSubcategory.count} anuncios
                            </Badge>
                        )}
                    </li>
                </ol>
            </nav>
            
            {/* SLIDER DE LA CATEGORÍA PRINCIPAL */}
            <div className="mb-5">
                <DynamicCategorySlider categoryName={isImmobilierRoute ? 'immobilier' : categoryName} />
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
                                background: 'linear-gradient(135deg, #667eea15 0%, #764ba210 100%)',
                                border: '2px solid #667eea30'
                            }}
                        >
                            <span style={{ fontSize: '2rem' }}>
                                {isImmobilierRoute ? '🏠' : '📁'}
                            </span>
                        </div>
                        <div>
                            <h2 className="mb-0">
                                {getPageTitle()}
                            </h2>
                            <p className="text-muted mb-0">
                                {totalLoaded} de {totalPosts} anuncios cargados
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
            
            {/* BARRA DE PROGRESO */}
            {totalPosts > 0 && (
                <ProgressBar 
                    now={progressPercentage} 
                    className="mb-3" 
                    label={`${Math.round(progressPercentage)}% cargado`}
                    variant="primary"
                    animated
                />
            )}
            
            {/* POSTS EN FILA HORIZONTAL CON SCROLL */}
            {loading ? (
                <Row className="justify-content-center py-5">
                    <Col xs="auto" className="text-center">
                        <img src={LoadIcon} alt="loading" />
                        <p className="mt-2">Cargando anuncios de {getPageTitle()}...</p>
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
                                selectedCategory={isImmobilierRoute ? 'immobilier' : categoryName}
                                selectedSubcategory={isImmobilierRoute ? operationId : subcategoryId}
                                fromSubcategoryPage={true}
                                displayMode="horizontal"
                            />
                        </div>
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
                                        Cargando...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-plus-circle me-2"></i>
                                        Cargar más anuncios ({totalPosts - totalLoaded} restantes)
                                    </>
                                )}
                            </Button>
                            <p className="text-muted mt-2">
                                Página {page - 1} • {totalLoaded} de {totalPosts} anuncios
                            </p>
                        </motion.div>
                    )}
                    
                    {/* VOLVER */}
                    <Row className="justify-content-center mt-5">
                        <Col xs="auto">
                            <Link to={getBackLink()} className="btn btn-outline-secondary">
                                <i className="fas fa-arrow-left me-2"></i>
                                Volver a {isImmobilierRoute ? 
                                    (operationId ? (subcategoryId ? getBreadcrumbText() : 'Immobilier') : 'Inicio') 
                                    : categoryName}
                            </Link>
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default SubcategoryPage;