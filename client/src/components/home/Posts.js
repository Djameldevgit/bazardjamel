// components/home/Posts.js - VERSIÓN COMPLETA CON IMMOBILIER
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import PostCard from '../PostCard';

const Posts = ({ 
    selectedCategory, 
    selectedSubcategory,
    fromCategoryPage = false,
    fromSubcategoryPage = false,
    fromImmobilerPage = false, // 🆕 NUEVO: Para páginas de immobiler
    displayMode = 'grid'
}) => {
    const location = useLocation();
    const { homePosts } = useSelector(state => state);
    
    console.log('🔍 Posts - Parámetros recibidos:', {
        selectedCategory,
        selectedSubcategory,
        fromCategoryPage,
        fromSubcategoryPage,
        fromImmobilerPage, // 🆕
        path: location.pathname,
        // Posts normales
        postsInState: homePosts.posts?.length,
        currentCategory: homePosts.category,
        currentSubcategory: homePosts.subcategory,
        // Posts de immobiler
        immobilierPosts: homePosts.immobilierPosts?.length,
        immobilierOperation: homePosts.immobilierOperation,
        immobilierTotal: homePosts.immobilierTotal
    });
    
    // 📌 LÓGICA MEJORADA DE FILTRADO CON IMMOBILIER
    const displayPosts = useMemo(() => {
        let postsToShow = [];
        
        // 🏠 CASO 1: Página de IMMOBILIER (nivel 1: operaciones como vente, location)
        if (fromImmobilerPage) {
            console.log('🏠 ImmobilerPage - Mostrando posts de immobiler:', {
                operation: selectedSubcategory, // operationId llega como selectedSubcategory
                postsInImmobilier: homePosts.immobilierPosts?.length,
                operationInState: homePosts.immobilierOperation
            });
            
            // Usar posts específicos de immobiler
            if (homePosts.immobilierPosts && homePosts.immobilierPosts.length > 0) {
                postsToShow = homePosts.immobilierPosts;
                
                // 🆕 Filtrar por propertyType si estamos en nivel 2
                if (selectedSubcategory && location.pathname.includes('/immobilier/')) {
                    const pathParts = location.pathname.split('/').filter(p => p);
                    if (pathParts.length === 4 && pathParts[1] === 'immobilier') {
                        // Es /immobilier/vente/villa (nivel 2)
                        const propertyId = pathParts[3];
                        console.log(`🏠 Nivel 2 de immobiler - Filtrando por propiedad: ${propertyId}`);
                        
                        postsToShow = postsToShow.filter(post => 
                            post.propertyType === propertyId || 
                            post.subCategory?.includes(propertyId) ||
                            post.title?.toLowerCase().includes(propertyId.toLowerCase())
                        );
                    }
                }
            } else {
                // Si no hay posts de immobiler, intentar usar posts normales filtrados
                console.log('⚠️ No hay posts en immobilierPosts, intentando filtrar desde posts normales');
                if (homePosts.posts && homePosts.posts.length > 0) {
                    postsToShow = homePosts.posts.filter(post => 
                        post.categorie === 'immobilier'
                    );
                    
                    // Filtrar por operación si se especifica
                    if (selectedSubcategory) {
                        postsToShow = postsToShow.filter(post => {
                            // Buscar operationId en varios campos posibles
                            return post.operationType === selectedSubcategory ||
                                   post.subCategory === selectedSubcategory ||
                                   post.title?.toLowerCase().includes(selectedSubcategory.toLowerCase());
                        });
                    }
                }
            }
        }
        
        // 📂 CASO 2: Página de SUBCATEGORÍA normal
        else if (fromSubcategoryPage || (selectedSubcategory && selectedCategory)) {
            console.log('📂 SubcategoryPage - Filtrando por subcategoría:', {
                category: selectedCategory,
                subcategory: selectedSubcategory
            });
            
            // Opción A: Usar posts del estado que ya deberían estar filtrados
            if (homePosts.posts && homePosts.posts.length > 0) {
                postsToShow = homePosts.posts.filter(post => {
                    const matchesCategory = !selectedCategory || post.categorie === selectedCategory;
                    const matchesSubcategory = !selectedSubcategory || post.subCategory === selectedSubcategory;
                    return matchesCategory && matchesSubcategory;
                });
                
                console.log(`✅ Filtrados ${postsToShow.length} posts de ${homePosts.posts.length}`);
            }
            // Opción B: Filtrar desde categorySpecificPosts
            else if (homePosts.categorySpecificPosts && homePosts.categorySpecificPosts.length > 0) {
                postsToShow = homePosts.categorySpecificPosts.filter(post => 
                    post.subCategory === selectedSubcategory
                );
                console.log(`✅ Desde categorySpecificPosts: ${postsToShow.length}`);
            }
        }
        
        // 🏘️ CASO 3: Página de CATEGORÍA específica (incluyendo /category/immobilier)
        else if (fromCategoryPage || location.pathname.startsWith('/category/')) {
            console.log('📂 CategoryPage - Usando categorySpecificPosts');
            postsToShow = homePosts.categorySpecificPosts || [];
            
            // Si es immobiler y no hay categorySpecificPosts, buscar manualmente
            if (selectedCategory === 'immobilier' && postsToShow.length === 0 && homePosts.posts) {
                postsToShow = homePosts.posts.filter(post => 
                    post.categorie === 'immobilier'
                );
            }
        }
        
        // 🏠 CASO 4: Home con categoría "all"
        else if (selectedCategory === 'all') {
            console.log('🏠 Home - Mostrando TODOS los posts');
            postsToShow = homePosts.posts || [];
        }
        
        // 🏠 CASO 5: Home con categoría específica (filtro en Home)
        else if (homePosts.categoryPosts && homePosts.categoryPosts[selectedCategory]) {
            console.log(`🏠 Home - Filtrado para ${selectedCategory}`);
            postsToShow = homePosts.categoryPosts[selectedCategory] || [];
        }
        
        // 🔍 CASO 6: Filtro adicional por categoría (si solo hay categoría)
        else if (selectedCategory && !selectedSubcategory) {
            console.log(`🔍 Filtrando solo por categoría: ${selectedCategory}`);
            if (homePosts.posts && homePosts.posts.length > 0) {
                postsToShow = homePosts.posts.filter(post => 
                    post.categorie === selectedCategory
                );
            }
        }
        
        console.log(`📊 Posts a mostrar: ${postsToShow.length}`);
        
        // 🆕 DEPURACIÓN: Mostrar detalles de los posts
        if (postsToShow.length > 0) {
            console.log('🔍 Primeros 2 posts para verificar:', postsToShow.slice(0, 2).map(post => ({
                id: post._id,
                categorie: post.categorie,
                subCategory: post.subCategory,
                operationType: post.operationType,
                propertyType: post.propertyType,
                title: post.title?.substring(0, 30)
            })));
        }
        
        return postsToShow;
        
    }, [
        homePosts, 
        selectedCategory, 
        selectedSubcategory, 
        fromCategoryPage, 
        fromSubcategoryPage, 
        fromImmobilerPage, 
        location.pathname
    ]);
    
    // 📌 DETERMINAR EL MENSAJE DE "NO HAY POSTS" SEGÚN EL CONTEXTO
    const getEmptyMessage = () => {
        if (fromImmobilerPage && selectedSubcategory) {
            // Para immobiler con operación específica
            const operationNames = {
                'vente': 'Vente',
                'location': 'Location',
                'location_vacances': 'Location Vacances',
                'cherche_location': 'Cherche Location',
                'cherche_achat': 'Cherche Achat'
            };
            
            const operationName = operationNames[selectedSubcategory] || selectedSubcategory;
            return `Aucune annonce disponible pour "${operationName}"`;
        }
        
        if (fromImmobilerPage) {
            return 'Aucune annonce immobilière disponible';
        }
        
        if (selectedSubcategory) {
            return `No hay anuncios en "${selectedSubcategory}"`;
        }
        
        if (selectedCategory && selectedCategory !== 'all') {
            return `No hay anuncios en "${selectedCategory}"`;
        }
        
        return 'No hay anuncios publicados aún';
    };
    
    // 📌 DETERMINAR EL EMOJI PARA EL ESTADO VACÍO
    const getEmptyEmoji = () => {
        if (fromImmobilerPage) return '🏠';
        if (selectedSubcategory) return '🔍';
        if (selectedCategory === 'immobilier') return '🏘️';
        return '📭';
    };
    
    // 📌 ESTILOS DIFERENTES SEGÚN MODO DE VISUALIZACIÓN
    const renderPosts = () => {
        if (displayMode === 'horizontal') {
            return (
                <div style={{ 
                    display: 'inline-flex', 
                    gap: '20px', 
                    padding: '0 10px',
                    flexWrap: 'nowrap'
                }}>
                    {displayPosts.map(post => (
                        <div key={post._id} style={{ minWidth: '280px' }}>
                            <PostCard post={post} />
                        </div>
                    ))}
                </div>
            );
        }
        
        // Modo grid (por defecto)
        return (
            <div className="post_thumb">
                {displayPosts.map(post => (
                    <div key={post._id} className="post_thumb_display">
                        <PostCard post={post} />
                    </div>
                ))}
            </div>
        );
    };
    
    // 📌 MENSAJES DE ESTADO VACÍO MEJORADOS
    if (!displayPosts || displayPosts.length === 0) {
        return (
            <div className="text-center py-5">
                <div className="display-1 mb-3" style={{ opacity: 0.5 }}>
                    {getEmptyEmoji()}
                </div>
                <h4 className="text-muted mb-3">
                    {getEmptyMessage()}
                </h4>
                
                {/* Mensajes contextuales adicionales */}
                {selectedSubcategory && selectedCategory && !fromImmobilerPage && (
                    <p className="text-muted mb-4">
                        Prueba a buscar en toda la categoría "{selectedCategory}"
                    </p>
                )}
                
                {fromImmobilerPage && selectedSubcategory && (
                    <p className="text-muted mb-4">
                        Vous pouvez essayer d'autres types d'opérations immobilières
                    </p>
                )}
                
                {/* Botones de acción */}
                <div className="mt-4">
                    {fromImmobilerPage ? (
                        <a 
                            href="/category/immobilier" 
                            className="btn btn-primary me-2"
                        >
                            <i className="fas fa-arrow-left me-2"></i>
                            Retour à Immobilier
                        </a>
                    ) : selectedCategory && selectedCategory !== 'all' ? (
                        <a 
                            href="/" 
                            className="btn btn-primary me-2"
                        >
                            <i className="fas fa-home me-2"></i>
                            Ver todas las categorías
                        </a>
                    ) : null}
                    
                    <a href="/" className="btn btn-outline-secondary">
                        <i className="fas fa-home me-2"></i>
                        Retour à l'accueil
                    </a>
                </div>
            </div>
        );
    }
    
    return renderPosts();
};

export default Posts;