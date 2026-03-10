// 📂 frontend/src/components/post/DescriptionPost.jsx
import React, { useMemo, useCallback, useEffect } from 'react';
import { Card } from 'react-bootstrap';
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

    // Cargar categorías si no están disponibles
    useEffect(() => {
        if (accordionCategories.length === 0 && !accordionLoading) {
            dispatch(getCategoriesForAccordion());
        }
    }, [dispatch, accordionCategories.length, accordionLoading]);

    // 🎯 OBTENER TODOS LOS DATOS COMBINADOS (post + categorySpecificData)
    const postData = useMemo(() => {
        if (!post) return {};
        const allData = { ...post };
        if (post.categorySpecificData && typeof post.categorySpecificData === 'object') {
            Object.assign(allData, post.categorySpecificData);
        }
        return allData;
    }, [post]);

    // 🎯 FUNCIÓN PARA OBTENER LA RUTA LEGIBLE DE LA CATEGORÍA
    const getCategoryDisplay = useCallback(() => {
        const categorie = postData.categorie;
        const subCategory = postData.subCategory;
        const articleType = postData.articleType;

        if (!categorie) return null;

        // Fallback con slugs si no se encuentran nombres
        let fallbackPath = categorie;
        if (subCategory) fallbackPath += ` → ${subCategory}`;
        if (articleType && articleType !== subCategory) fallbackPath += ` → ${articleType}`;

        if (accordionCategories.length === 0) return fallbackPath; // aún no cargadas

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
                // Buscar como nivel3
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

    // 🎨 MAPA DE ICONOS POR CAMPO (completo)
    const fieldIconMap = {
        'categorie': '📂',
        'subCategory': '📁',
        'articleType': '📌',
        'price': '💰',
        'etat': '⭐',
        'views': '👁️',
        'createdAt': '📅',
        'description': '📄',
        'marque': '🚗',
        'modele': '🚘',
        'annee': '📅',
        'kilometrage': '🛣️',
        'carburant': '⛽',
        'boiteVitesse': '⚙️',
        'couleurExterieur': '🎨',
        'couleurInterieur': '🪑',
        'puissance': '⚡',
        'places': '👥',
        'portes': '🚪',
        'premiereMain': '👤',
        'garantie': '🛡️',
        'surface': '📏',
        'chambres': '🛏️',
        'sallesBain': '🚿',
        'etage': '🏢',
        'meuble': '🪑',
        'jardin': '🌳',
        'parking': '🅿️',
        'climatisation': '❄️',
        'chauffage': '🔥',
        'piscine': '🏊',
        'ascenseur': '🛗',
        'ram': '💾',
        'stockage': '💿',
        'processeur': '⚙️',
        'ecran': '🖥️',
        'camera': '📷',
        'batterie': '🔋',
        'systeme': '💻',
        'connectivite': '📶',
        'couleur': '🎨',
        'taille': '📏',
        'matiere': '🧵',
        'genre': '👤',
        'age': '🔞',
        'type': '🏷️',
        'dimensions': '📐',
        'poids': '⚖️',
        'duree': '⏱️',
        'disponibilite': '📅',
        'tarif': '💰',
        'zone': '📍',
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
        return String(value).trim().charAt(0).toUpperCase() + String(value).trim().slice(1);
    };

    const translateField = (field) => {
        const translations = {
            'categorie': 'Catégorie',
            'subCategory': 'Sous-catégorie',
            'articleType': "Type d'article",
            'price': 'Prix',
            'etat': 'État',
            'views': 'Vues',
            'createdAt': 'Publié le',
            'description': 'Description',
            'marque': 'Marque',
            'modele': 'Modèle',
            'annee': 'Année',
            'kilometrage': 'Kilométrage',
            'carburant': 'Carburant',
            'boiteVitesse': 'Boîte de vitesse',
            'couleurExterieur': 'Couleur extérieure',
            'couleurInterieur': 'Couleur intérieure',
            'puissance': 'Puissance (CV)',
            'places': 'Nombre de places',
            'portes': 'Nombre de portes',
            'premiereMain': 'Première main',
            'garantie': 'Garantie',
            'surface': 'Surface',
            'chambres': 'Chambres',
            'sallesBain': 'Salles de bain',
            'etage': 'Étage',
            'meuble': 'Meublé',
            'jardin': 'Jardin',
            'parking': 'Parking',
            'climatisation': 'Climatisation',
            'chauffage': 'Chauffage',
            'piscine': 'Piscine',
            'ascenseur': 'Ascenseur',
            'ram': 'RAM',
            'stockage': 'Stockage',
            'processeur': 'Processeur',
            'ecran': 'Écran',
            'camera': 'Caméra',
            'batterie': 'Batterie',
            'systeme': "Système d'exploitation",
            'connectivite': 'Connectivité',
            'couleur': 'Couleur',
            'taille': 'Taille',
            'matiere': 'Matière',
            'genre': 'Genre',
            'age': 'Âge',
            'type': 'Type',
            'dimensions': 'Dimensions',
            'poids': 'Poids',
            'duree': 'Durée',
            'disponibilite': 'Disponibilité',
            'tarif': 'Tarif',
            'zone': 'Zone de service'
        };
        return translations[field] || field;
    };

    // 📊 FILTRAR Y ORDENAR CAMPOS
    const getFieldsToDisplay = useMemo(() => {
        if (!postData) return [];
        const excludeFields = [
            '_id', '__v', 'user', 'categorySpecificData', 'images',
            'updatedAt', 'isActive', 'likes', 'comments',
            'boutique', 'isFromBoutique', 'category', 'title',
            'wilaya', 'commune', 'address',
            'phone', 'email', 'website'
        ];
        const baseFields = ['categorie', 'subCategory', 'articleType', 'etat', 'price', 'views', 'createdAt'];

        const fields = Object.keys(postData).filter(field => {
            if (excludeFields.includes(field)) return false;
            const value = postData[field];
            if (value === undefined || value === null || value === '') return false;
            if (Array.isArray(value) && value.length === 0) return false;
            return true;
        });

        const allFields = [...new Set([...baseFields, ...fields])];

        const priorityOrder = [
            'categorie', 'subCategory', 'articleType', 'etat', 'price',
            'marque', 'modele', 'annee', 'kilometrage', 'carburant', 'boiteVitesse', 'couleurExterieur', 'couleurInterieur', 'places', 'portes', 'premiereMain', 'garantie',
            'surface', 'chambres', 'sallesBain', 'etage', 'meuble', 'jardin', 'parking', 'climatisation', 'chauffage', 'piscine', 'ascenseur',
            'ram', 'stockage', 'processeur', 'ecran', 'camera', 'batterie', 'systeme', 'connectivite', 'couleur',
            'taille', 'matiere', 'couleur', 'marque', 'genre', 'age',
            'type', 'marque', 'matiere', 'dimensions', 'poids',
            'duree', 'disponibilite', 'tarif', 'zone',
            'views', 'createdAt'
        ];

        return allFields.sort((a, b) => {
            const ia = priorityOrder.indexOf(a);
            const ib = priorityOrder.indexOf(b);
            if (ia !== -1 && ib !== -1) return ia - ib;
            if (ia !== -1) return -1;
            if (ib !== -1) return 1;
            return a.localeCompare(b);
        });
    }, [postData]);

    const renderHeader = () => {
        const title = postData.title || 'Annonce';
        const description = postData.description;
        return (
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom py-3">
                    <h5 className="mb-0 fw-bold text-dark">
                        <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>📄</span>
                        Description de l'annonce
                    </h5>
                </Card.Header>
                <Card.Body className="p-4">
                    <h1 className="fw-bold mb-3" style={{ fontSize: '1.8rem', color: '#111827' }}>
                        {title}
                    </h1>
                    {description && (
                        <p className="text-muted mb-0" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                            {description}
                        </p>
                    )}
                </Card.Body>
            </Card>
        );
    };

    const FieldItem = ({ field }) => {
        // Ocultar subCategory y articleType si ya se muestran en la ruta de categoría
        if ((field === 'subCategory' || field === 'articleType') && postData.categorie) return null;

        let displayValue;
        let displayIcon;
        let displayLabel;

        if (field === 'categorie') {
            const categoryDisplay = getCategoryDisplay();
            if (!categoryDisplay) return null;
            displayValue = categoryDisplay;
            displayIcon = '🏷️';
            displayLabel = 'Catégorie';
        } else {
            const value = postData[field];
            displayValue = formatValue(field, value);
            if (!displayValue) return null;
            displayIcon = getFieldIcon(field);
            displayLabel = translateField(field);
        }

        return (
            <div className="p-3 border-bottom">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <div className="me-2" style={{ fontSize: '1.2rem', color: '#6c757d', width: '24px' }}>
                            {displayIcon}
                        </div>
                        <span className="text-muted me-2">{displayLabel}:</span>
                    </div>
                    <div className="d-flex align-items-center">
                        {field === 'price' ? (
                            <span className="fw-bold" style={{ color: '#dc2626' }}>
                                {displayValue}
                            </span>
                        ) : (
                            <span className="fw-bold text-dark">
                                {displayValue}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (!post) {
        return (
            <div className="text-center py-5">
                <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-3 text-muted">Chargement de l'annonce...</p>
            </div>
        );
    }

    const fieldsToDisplay = getFieldsToDisplay;

    return (
        <div className="description-post-container">
            {renderHeader()}
            {fieldsToDisplay.length > 0 && (
                <Card className="border-0 shadow-sm mb-4">
                    <Card.Header className="bg-white border-bottom py-3">
                        <h5 className="mb-0 fw-bold text-dark">
                            <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>📋</span>
                            Caractéristiques détaillées
                        </h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                        {fieldsToDisplay.map(field => (
                            <FieldItem key={field} field={field} />
                        ))}
                    </Card.Body>
                </Card>
            )}
            <div className="d-flex justify-content-center mt-4">
                <button 
                    className="btn btn-outline-secondary py-2 px-4"
                    onClick={() => history.goBack()}
                    style={{ 
                        border: '1px solid #e5e7eb',
                        backgroundColor: '#ffffff',
                        color: '#4b5563',
                        fontSize: '14px'
                    }}
                >
                    <span style={{ marginRight: '6px' }}>←</span>
                    Retour
                </button>
            </div>
        </div>
    );
};

export default DescriptionPost;