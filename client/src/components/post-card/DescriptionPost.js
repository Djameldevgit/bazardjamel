// 📂 frontend/src/components/post/DescriptionPost.jsx

import React, { useMemo, useCallback, useEffect, useState } from 'react';
import { Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/fr';
import { getCategoriesForAccordion } from '../../redux/actions/categoryAction';
 

moment.locale('fr');

const DescriptionPost = ({ post }) => {
    const dispatch = useDispatch();
    const { accordionCategories = [], accordionLoading } = useSelector(state => state.category || {});
    const history = useHistory();
    
    const [mainImage, setMainImage] = useState('');
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    useEffect(() => {
        if (accordionCategories.length === 0 && !accordionLoading) {
            dispatch(getCategoriesForAccordion());
        }
    }, [dispatch, accordionCategories.length, accordionLoading]);

    const postData = useMemo(() => {
        if (!post) return {};
        const allData = { ...post };
        if (post.categorySpecificData && typeof post.categorySpecificData === 'object') {
            Object.assign(allData, post.categorySpecificData);
        }
        return allData;
    }, [post]);

    useEffect(() => {
        if (post?.images && post.images.length > 0) {
            const firstImage = post.images[0];
            const imageUrl = typeof firstImage === 'string' ? firstImage : firstImage?.url;
            if (imageUrl) {
                setMainImage(imageUrl);
                setSelectedImageIndex(0);
            }
        }
    }, [post]);

    const handleThumbnailClick = useCallback((imageUrl, index) => {
        setIsImageLoaded(false);
        setMainImage(imageUrl);
        setSelectedImageIndex(index);
    }, []);

    const handlePrevImage = useCallback(() => {
        if (post?.images && post.images.length > 0) {
            const newIndex = selectedImageIndex === 0 ? post.images.length - 1 : selectedImageIndex - 1;
            const imageUrl = typeof post.images[newIndex] === 'string' ? post.images[newIndex] : post.images[newIndex]?.url;
            if (imageUrl) {
                setIsImageLoaded(false);
                setMainImage(imageUrl);
                setSelectedImageIndex(newIndex);
            }
        }
    }, [post, selectedImageIndex]);

    const handleNextImage = useCallback(() => {
        if (post?.images && post.images.length > 0) {
            const newIndex = selectedImageIndex === post.images.length - 1 ? 0 : selectedImageIndex + 1;
            const imageUrl = typeof post.images[newIndex] === 'string' ? post.images[newIndex] : post.images[newIndex]?.url;
            if (imageUrl) {
                setIsImageLoaded(false);
                setMainImage(imageUrl);
                setSelectedImageIndex(newIndex);
            }
        }
    }, [post, selectedImageIndex]);

    const getCategoryDisplay = useCallback(() => {
        const categorie = postData.categorie;
        const subCategory = postData.subCategory;
        const articleType = postData.articleType;

        if (!categorie) return null;

        let fallbackPath = categorie;
        if (subCategory) fallbackPath += ` → ${subCategory}`;
        if (articleType && articleType !== subCategory) fallbackPath += ` → ${articleType}`;

        if (accordionCategories.length === 0) return fallbackPath;

        const mainCat = accordionCategories.find(c => c.slug === categorie || c.name === categorie);
        if (!mainCat) return fallbackPath;

        let path = mainCat.name;

        if (subCategory) {
            const level1 = mainCat.children?.find(c => c.slug === subCategory || c.name === subCategory);
            if (level1) {
                path += ` → ${level1.name}`;
                if (articleType && articleType !== subCategory) {
                    const level2 = level1.children?.find(c => c.slug === articleType || c.name === articleType);
                    path += ` → ${level2 ? level2.name : articleType}`;
                }
            } else {
                for (const l1 of mainCat.children || []) {
                    const l2 = l1.children?.find(c => c.slug === subCategory || c.name === subCategory);
                    if (l2) {
                        path += ` → ${l1.name} → ${l2.name}`;
                        break;
                    }
                }
            }
        } else if (articleType) {
            for (const l1 of mainCat.children || []) {
                const l2 = l1.children?.find(c => c.slug === articleType || c.name === articleType);
                if (l2) {
                    path += ` → ${l1.name} → ${l2.name}`;
                    break;
                }
            }
        }
        return path;
    }, [postData, accordionCategories]);

    const fieldIconMap = {
        'price': '💰',
        'etat': '⭐',
        'views': '👁️',
        'createdAt': '📅',
        'marque': '🚗',
        'modele': '🚘',
        'annee': '📅',
        'kilometrage': '🛣️',
        'carburant': '⛽',
        'boiteVitesse': '⚙️',
        'couleur': '🎨',
        'surface': '📏',
        'chambres': '🛏️',
        'pieces': '🏠',
        'sallesBain': '🚿',
        'etage': '🏢',
        'meuble': '🪑',
        'jardin': '🌳',
        'parking': '🅿️',
        'climatisation': '❄️',
        'chauffage': '🔥',
        'piscine': '🏊',
        'ascenseur': '🛗',
        'quartier': '📍',
        'operationType': '📝',
        'typeImmobilier': '🏠',
        'ram': '💾',
        'stockage': '💿',
        'processeur': '⚙️',
        'ecran': '🖥️',
        'camera': '📷',
        'batterie': '🔋',
        'capaciteStockage': '💾',
        'taille': '📏',
        'matiere': '🧵',
        'genre': '👤',
        'default': '📋'
    };

    const getFieldIcon = (field) => fieldIconMap[field] || fieldIconMap.default;

    const formatValue = (field, value) => {
        if (value === undefined || value === null || value === '') return null;
        if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
        if (typeof value === 'number') {
            if (field === 'price') return new Intl.NumberFormat('fr-DZ').format(value) + ' DA';
            if (field === 'kilometrage') return new Intl.NumberFormat('fr-DZ').format(value) + ' km';
            if (field === 'surface') return new Intl.NumberFormat('fr-DZ').format(value) + ' m²';
            if (field === 'views') return new Intl.NumberFormat('fr-DZ').format(value);
            return new Intl.NumberFormat('fr-DZ').format(value);
        }
        if (field === 'createdAt' || field === 'updatedAt') return moment(value).format('DD/MM/YYYY');
        if (Array.isArray(value)) {
            if (value.length === 0) return null;
            return value.join(', ');
        }
        return String(value).trim().charAt(0).toUpperCase() + String(value).trim().slice(1);
    };

    const translateField = (field) => {
        const translations = {
            'price': 'Prix',
            'etat': 'État',
            'views': 'Vues',
            'createdAt': 'Publié le',
            'marque': 'Marque',
            'modele': 'Modèle',
            'annee': 'Année',
            'kilometrage': 'Kilométrage',
            'carburant': 'Carburant',
            'boiteVitesse': 'Boîte de vitesse',
            'couleur': 'Couleur',
            'surface': 'Surface',
            'chambres': 'Chambres',
            'pieces': 'Pièces',
            'sallesBain': 'Salles de bain',
            'etage': 'Étage',
            'meuble': 'Meublé',
            'jardin': 'Jardin',
            'parking': 'Parking',
            'climatisation': 'Climatisation',
            'chauffage': 'Chauffage',
            'piscine': 'Piscine',
            'ascenseur': 'Ascenseur',
            'quartier': 'Quartier',
            'operationType': "Type d'opération",
            'typeImmobilier': 'Type de bien',
            'ram': 'RAM',
            'stockage': 'Stockage',
            'processeur': 'Processeur',
            'ecran': 'Écran',
            'camera': 'Caméra',
            'batterie': 'Batterie',
            'capaciteStockage': 'Capacité',
            'taille': 'Taille',
            'matiere': 'Matière',
            'genre': 'Genre'
        };
        return translations[field] || field;
    };

    const getFieldsToDisplay = useMemo(() => {
        if (!postData) return [];
        
        const excludeFields = [
            '_id', '__v', 'user', 'categorySpecificData', 'images',
            'updatedAt', 'isActive', 'likes', 'comments',
            'boutique', 'isFromBoutique', 'category', 'title',
            'description', 'wilaya', 'commune', 'address',
            'phone', 'email', 'website', 'slug', 'score',
            'lastInteractionAt', 'categorie', 'subCategory', 'articleType',
            'price', 'etat', 'views', 'createdAt'
        ];
        
        const fields = Object.keys(postData).filter(field => {
            if (excludeFields.includes(field)) return false;
            const value = postData[field];
            if (value === undefined || value === null || value === '') return false;
            if (Array.isArray(value) && value.length === 0) return false;
            return true;
        });

        const priorityOrder = [
            'marque', 'modele', 'annee', 'kilometrage', 'carburant', 'boiteVitesse', 'couleur',
            'operationType', 'typeImmobilier', 'pieces', 'surface', 'chambres', 'sallesBain',
            'etage', 'meuble', 'jardin', 'parking', 'climatisation', 'chauffage', 'piscine', 'ascenseur', 'quartier',
            'processeur', 'ram', 'stockage', 'ecran', 'camera', 'batterie', 'capaciteStockage',
            'taille', 'matiere', 'genre'
        ];

        return fields.sort((a, b) => {
            const ia = priorityOrder.indexOf(a);
            const ib = priorityOrder.indexOf(b);
            if (ia !== -1 && ib !== -1) return ia - ib;
            if (ia !== -1) return -1;
            if (ib !== -1) return 1;
            return a.localeCompare(b);
        });
    }, [postData]);

    const sellerInfo = useMemo(() => {
        if (!post) return null;
        return {
            name: post.user?.username || post.user?.name || 'Annonceur',
            avatar: post.user?.avatar,
            phone: post.phone || postData.telephone,
            email: post.email,
            wilaya: post.wilaya,
            commune: post.commune,
            address: post.address
        };
    }, [post, postData]);

    const fieldsToDisplay = getFieldsToDisplay;
    const hasImages = post?.images && post.images.length > 0;
    const imagesList = post?.images || [];

    return (
        <div className="description-post">
            <div className="description-post-inner">
                {/* FILA SUPERIOR - IMAGENES + INFO PRINCIPAL */}
                <div className="top-section">
                    {/* COLUMNA IZQUIERDA - GALERÍA DE IMÁGENES */}
                    <div className="gallery-column">
                        <div className="image-gallery">
                            {hasImages ? (
                                <>
                                    <div className="main-image-container">
                                        <button 
                                            className="nav-arrow prev-arrow" 
                                            onClick={handlePrevImage}
                                            aria-label="Image précédente"
                                        >
                                            <i className="fas fa-chevron-left"></i>
                                        </button>
                                        <div className="main-image-wrapper">
                                            <img 
                                                src={mainImage} 
                                                alt={post.title || 'Image principale'}
                                                className={`main-image ${isImageLoaded ? 'loaded' : 'loading'}`}
                                                onLoad={() => setIsImageLoaded(true)}
                                            />
                                            {!isImageLoaded && (
                                                <div className="image-loader">
                                                    <div className="spinner-border text-primary"></div>
                                                </div>
                                            )}
                                        </div>
                                        <button 
                                            className="nav-arrow next-arrow" 
                                            onClick={handleNextImage}
                                            aria-label="Image suivante"
                                        >
                                            <i className="fas fa-chevron-right"></i>
                                        </button>
                                        <div className="image-counter">
                                            {selectedImageIndex + 1} / {imagesList.length}
                                        </div>
                                    </div>
                                    <div className="thumbnail-container">
                                        {imagesList.map((img, index) => {
                                            const imageUrl = typeof img === 'string' ? img : img?.url;
                                            return (
                                                <div 
                                                    key={index}
                                                    className={`thumbnail ${selectedImageIndex === index ? 'active' : ''}`}
                                                    onClick={() => handleThumbnailClick(imageUrl, index)}
                                                >
                                                    <img 
                                                        src={imageUrl} 
                                                        alt={`Image ${index + 1}`}
                                                        loading="lazy"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            ) : (
                                <div className="no-image-placeholder">
                                    <i className="fas fa-image"></i>
                                    <p>Aucune image disponible</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* COLUMNA DERECHA - INFORMACIÓN PRINCIPAL (Estilo UserInfo) */}
                    <div className="info-column">
                        <div className="card-header">
                            <h5>
                                <i className="fas fa-info-circle me-2"></i>
                                Détails de l'annonce
                            </h5>
                        </div>
                        <div className="card-body">
                            {/* Título */}
                            <div className="info-row">
                                <div className="info-row-content">
                                    <div className="info-label">
                                        <span className="info-icon"><i className="fas fa-heading"></i></span>
                                        <span className="info-label-text">Titre:</span>
                                    </div>
                                    <div className="info-value">{postData.title || 'Annonce'}</div>
                                </div>
                            </div>
                            
                            {/* Precio */}
                            {postData.price !== undefined && postData.price !== null && (
                                <div className="info-row">
                                    <div className="info-row-content">
                                        <div className="info-label">
                                            <span className="info-icon"><i className="fas fa-tag"></i></span>
                                            <span className="info-label-text">Prix:</span>
                                        </div>
                                        <div className="info-value price-value">
                                            {new Intl.NumberFormat('fr-DZ').format(postData.price)} DA
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Estado */}
                            {postData.etat && (
                                <div className="info-row">
                                    <div className="info-row-content">
                                        <div className="info-label">
                                            <span className="info-icon"><i className="fas fa-star"></i></span>
                                            <span className="info-label-text">État:</span>
                                        </div>
                                        <div className="info-value">
                                            <Badge className="condition-badge">
                                                {postData.etat === 'neuf' ? 'Neuf' : 
                                                 postData.etat === 'excellent' ? 'Excellent état' :
                                                 postData.etat === 'bon' ? 'Bon état' :
                                                 postData.etat === 'occasion' ? 'Occasion' : postData.etat}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Categoría */}
                            <div className="info-row">
                                <div className="info-row-content">
                                    <div className="info-label">
                                        <span className="info-icon"><i className="fas fa-folder-open"></i></span>
                                        <span className="info-label-text">Catégorie:</span>
                                    </div>
                                    <div className="info-value">{getCategoryDisplay() || postData.categorie}</div>
                                </div>
                            </div>
                            
                            {/* Vendedor */}
                            <div className="info-row">
                                <div className="info-row-content">
                                    <div className="info-label">
                                        <span className="info-icon"><i className="fas fa-user"></i></span>
                                        <span className="info-label-text">Vendeur:</span>
                                    </div>
                                    <div className="info-value">{sellerInfo?.name || 'Annonceur'}</div>
                                </div>
                            </div>
                            
                            {/* Ubicación del vendedor */}
                            {sellerInfo?.wilaya && (
                                <div className="info-row">
                                    <div className="info-row-content">
                                        <div className="info-label">
                                            <span className="info-icon"><i className="fas fa-map-marker-alt"></i></span>
                                            <span className="info-label-text">Localisation:</span>
                                        </div>
                                        <div className="info-value">
                                            {sellerInfo.wilaya}{sellerInfo.commune ? `, ${sellerInfo.commune}` : ''}
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Teléfono */}
                            {sellerInfo?.phone && (
                                <div className="info-row">
                                    <div className="info-row-content">
                                        <div className="info-label">
                                            <span className="info-icon"><i className="fas fa-phone"></i></span>
                                            <span className="info-label-text">Téléphone:</span>
                                        </div>
                                        <div className="info-value">
                                            <a href={`tel:${sellerInfo.phone}`} className="text-decoration-none text-dark">
                                                {sellerInfo.phone}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Email */}
                            {sellerInfo?.email && (
                                <div className="info-row">
                                    <div className="info-row-content">
                                        <div className="info-label">
                                            <span className="info-icon"><i className="fas fa-envelope"></i></span>
                                            <span className="info-label-text">Email:</span>
                                        </div>
                                        <div className="info-value">
                                            <a href={`mailto:${sellerInfo.email}`} className="text-decoration-none text-dark">
                                                {sellerInfo.email}
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* Vistas */}
                            <div className="info-row">
                                <div className="info-row-content">
                                    <div className="info-label">
                                        <span className="info-icon"><i className="fas fa-eye"></i></span>
                                        <span className="info-label-text">Vues:</span>
                                    </div>
                                    <div className="info-value">{postData.views || 0}</div>
                                </div>
                            </div>
                            
                            {/* Fecha */}
                            <div className="info-row">
                                <div className="info-row-content">
                                    <div className="info-label">
                                        <span className="info-icon"><i className="fas fa-calendar-alt"></i></span>
                                        <span className="info-label-text">Publié le:</span>
                                    </div>
                                    <div className="info-value">{moment(post.createdAt).format('DD/MM/YYYY')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FILA INFERIOR - ESPECIFICACIONES COMPLETAS Y DESCRIPCIÓN */}
                <div className="bottom-section">
                    {/* Especificaciones completas */}
                    {fieldsToDisplay.length > 0 && (
                        <div className="specifications-section">
                            <div className="section-header">
                                <h5>
                                    <i className="fas fa-list-ul"></i>
                                    Caractéristiques détaillées
                                </h5>
                            </div>
                            <div className="section-body">
                                {fieldsToDisplay.map(field => {
                                    const value = formatValue(field, postData[field]);
                                    if (!value) return null;
                                    return (
                                        <div key={field} className="spec-item">
                                            <div className="spec-content">
                                                <div className="spec-label">
                                                    <span className="spec-icon">{getFieldIcon(field)}</span>
                                                    <span className="spec-label-text">{translateField(field)}</span>
                                                </div>
                                                <div className="spec-value">{value}</div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Ubicación */}
                    {(postData.wilaya || postData.commune || postData.address) && (
                        <div className="location-section">
                            <div className="section-header">
                                <h5>
                                    <i className="fas fa-map-marker-alt"></i>
                                    Localisation
                                </h5>
                            </div>
                            <div className="section-body">
                                {postData.wilaya && (
                                    <div className="location-item">
                                        <div className="location-content-inner">
                                            <div className="location-label">
                                                <i className="fas fa-map-pin"></i>
                                                <strong>Wilaya:</strong>
                                            </div>
                                            <div className="location-value">{postData.wilaya}</div>
                                        </div>
                                    </div>
                                )}
                                {postData.commune && (
                                    <div className="location-item">
                                        <div className="location-content-inner">
                                            <div className="location-label">
                                                <i className="fas fa-building"></i>
                                                <strong>Commune:</strong>
                                            </div>
                                            <div className="location-value">{postData.commune}</div>
                                        </div>
                                    </div>
                                )}
                                {postData.address && (
                                    <div className="location-item">
                                        <div className="location-content-inner">
                                            <div className="location-label">
                                                <i className="fas fa-home"></i>
                                                <strong>Adresse:</strong>
                                            </div>
                                            <div className="location-value">{postData.address}</div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Descripción (al final) */}
                    {postData.description && (
                        <div className="description-section">
                            <div className="section-header">
                                <h5>
                                    <i className="fas fa-align-left"></i>
                                    Description
                                </h5>
                            </div>
                            <div className="section-body">
                                <div className="description-content">
                                    <p>{postData.description}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Botón de retorno */}
                    <div className="back-button-container">
                        <button 
                            className="back-button"
                            onClick={() => history.goBack()}
                        >
                            <i className="fas fa-arrow-left"></i> Retour aux annonces
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DescriptionPost;