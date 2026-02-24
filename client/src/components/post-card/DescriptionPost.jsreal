// 📁 src/components/post/DescriptionPost.js - VERSIÓN MEJORADA
import React, { useMemo } from 'react';
import { Container, Row, Col, Badge, Button, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MESS_TYPES } from '../../redux/actions/messageAction';
import { GLOBALTYPES } from '../../redux/actions/globalTypes';

const DescriptionPost = ({ post }) => {
    const { auth } = useSelector(state => state);
    const dispatch = useDispatch();
    const history = useHistory();
    
    // 🎯 OBTENER TODOS LOS DATOS COMBINADOS (post + categorySpecificData)
    const postData = useMemo(() => {
        if (!post) return {};
        
        const allData = { ...post };
        
        // Si existe categorySpecificData, combinarlo al nivel principal
        if (post.categorySpecificData && typeof post.categorySpecificData === 'object') {
            Object.assign(allData, post.categorySpecificData);
        }
        
        return allData;
    }, [post]);
    
    const user = post?.user || {};
    
    // 🎨 MAPA DE EMOJIS POR CATEGORÍA Y CAMPO
    const fieldEmojiMap = {
        // Campos base
        'title': '🏷️',
        'description': '📄',
        'categorie': '📂',
        'subCategory': '📁',
        'articleType': '📌',
        'price': '💰',
        'etat': '⭐',
        'wilaya': '🏙️',
        'commune': '🏘️',
        'address': '📍',
        'phone': '📱',
        'email': '📧',
        'views': '👁️',
        
        // Automobile
        'marque': '🚗',
        'modele': '🚘',
        'annee': '📅',
        'kilometrage': '🛣️',
        'carburant': '⛽',
        'boiteVitesse': '⚙️',
        'couleur': '🎨',
        'puissance': '⚡',
        'places': '👥',
        'portes': '🚪',
        
        // Immobilier
        'surface': '📏',
        'chambres': '🛏️',
        'sallesBain': '🚿',
        'etage': '🏢',
        'meuble': '🪑',
        'jardin': '🌳',
        'parking': '🅿️',
        'climatisation': '❄️',
        'chauffage': '🔥',
        
        // Électronique
        'ram': '💾',
        'stockage': '💿',
        'processeur': '⚙️',
        'ecran': '🖥️',
        'camera': '📷',
        'batterie': '🔋',
        'systeme': '💻',
        'connectivite': '📶',
        'garantie': '🛡️',
        
        // Mode
        'taille': '📏',
        'matiere': '🧵',
        'couleur': '🎨',
        'marque': '👔',
        'genre': '👤',
        'age': '🔞',
        
        // Sport
        'type': '⚽',
        'marque': '🏷️',
        'etat': '⭐',
        'taille': '📏',
        
        // Services
        'duree': '⏱️',
        'disponibilite': '📅',
        'tarif': '💰',
        'zone': '📍',
        
        'default': '📋'
    };
    
    // 🎯 OBTENER EMOJI SEGÚN CATEGORÍA Y CAMPO
    const getFieldEmoji = (field, value, category) => {
        // Prioridad: mapa por campo
        if (fieldEmojiMap[field]) return fieldEmojiMap[field];
        
        // Emojis especiales según valor
        if (field === 'etat' || field === 'condition') {
            const val = String(value).toLowerCase();
            if (val.includes('neuf') || val === 'new') return '✨';
            if (val.includes('occasion') || val === 'used') return '🔄';
        }
        
        return fieldEmojiMap.default;
    };
    
    // 📝 FORMATO DE VALORES
    const formatValue = (field, value) => {
        if (value === undefined || value === null || value === '') {
            return null;
        }
        
        // Booleanos
        if (typeof value === 'boolean') {
            return value ? 'Oui' : 'Non';
        }
        
        // Números
        if (typeof value === 'number') {
            if (field === 'price') {
                return new Intl.NumberFormat('fr-DZ').format(value) + ' DA';
            }
            if (field === 'kilometrage') {
                return new Intl.NumberFormat('fr-DZ').format(value) + ' km';
            }
            if (field === 'surface') {
                return new Intl.NumberFormat('fr-DZ').format(value) + ' m²';
            }
            if (field === 'chambres' || field === 'sallesBain' || field === 'places' || field === 'portes') {
                return value;
            }
            if (field === 'annee') {
                return value;
            }
            return new Intl.NumberFormat('fr-DZ').format(value);
        }
        
        // Strings
        const stringValue = String(value).trim();
        
        // Capitalizar primera letra
        return stringValue.charAt(0).toUpperCase() + stringValue.slice(1);
    };
    
    // 🏷️ TRADUCIR NOMBRES DE CAMPOS
    const translateField = (field) => {
        const translations = {
            // Campos base
            'title': 'Titre',
            'description': 'Description',
            'categorie': 'Catégorie',
            'subCategory': 'Sous-catégorie',
            'articleType': 'Type',
            'price': 'Prix',
            'etat': 'État',
            'wilaya': 'Wilaya',
            'commune': 'Commune',
            'address': 'Adresse',
            'phone': 'Téléphone',
            'email': 'Email',
            'views': 'Vues',
            
            // Automobile
            'marque': 'Marque',
            'modele': 'Modèle',
            'annee': 'Année',
            'kilometrage': 'Kilométrage',
            'carburant': 'Carburant',
            'boiteVitesse': 'Boîte de vitesse',
            'couleur': 'Couleur',
            'puissance': 'Puissance',
            'places': 'Places',
            'portes': 'Portes',
            
            // Immobilier
            'surface': 'Surface',
            'chambres': 'Chambres',
            'sallesBain': 'Salles de bain',
            'etage': 'Étage',
            'meuble': 'Meublé',
            'jardin': 'Jardin',
            'parking': 'Parking',
            'climatisation': 'Climatisation',
            'chauffage': 'Chauffage',
            
            // Électronique
            'ram': 'RAM',
            'stockage': 'Stockage',
            'processeur': 'Processeur',
            'ecran': 'Écran',
            'camera': 'Caméra',
            'batterie': 'Batterie',
            'systeme': 'Système',
            'connectivite': 'Connectivité',
            'garantie': 'Garantie',
            
            // Mode
            'taille': 'Taille',
            'matiere': 'Matière',
            'couleur': 'Couleur',
            'marque': 'Marque',
            'genre': 'Genre',
            'age': 'Âge',
            
            // Sport
            'type': 'Type',
            'marque': 'Marque',
            'taille': 'Taille',
            
            // Services
            'duree': 'Durée',
            'disponibilite': 'Disponibilité',
            'tarif': 'Tarif',
            'zone': 'Zone'
        };
        
        return translations[field] || field;
    };
    
    // 📊 FILTRAR Y ORDENAR CAMPOS
    const getFieldsToDisplay = useMemo(() => {
        if (!postData) return [];
        
        // Campos a excluir
        const excludeFields = [
            '_id', '__v', 'user', 'categorySpecificData', 'images',
            'createdAt', 'updatedAt', 'isActive'
        ];
        
        // Campos que van en el header
        const headerFields = ['title', 'description', 'price', 'etat', 'categorie', 'subCategory', 'articleType'];
        
        // Obtener todos los campos disponibles
        const fields = Object.keys(postData).filter(field => {
            // Excluir campos internos
            if (excludeFields.includes(field)) return false;
            
            // Excluir header fields
            if (headerFields.includes(field)) return false;
            
            const value = postData[field];
            
            // Excluir valores vacíos
            if (value === undefined || value === null || value === '') return false;
            
            // Excluir arrays vacíos
            if (Array.isArray(value) && value.length === 0) return false;
            
            return true;
        });
        
        // Orden de prioridad por categoría
        const priorityOrder = [
            // Auto
            'marque', 'modele', 'annee', 'kilometrage', 'carburant', 'boiteVitesse', 'couleur', 'places', 'portes',
            // Immobilier
            'surface', 'chambres', 'sallesBain', 'etage', 'meuble', 'jardin', 'parking', 'climatisation', 'chauffage',
            // Électronique
            'ram', 'stockage', 'processeur', 'ecran', 'camera', 'batterie', 'systeme', 'connectivite', 'garantie',
            // Mode
            'taille', 'matiere', 'couleur', 'marque', 'genre', 'age',
            // Sport
            'type', 'marque', 'taille',
            // Services
            'duree', 'disponibilite', 'tarif', 'zone',
            // Contact
            'phone', 'email', 'wilaya', 'commune', 'address'
        ];
        
        return fields.sort((a, b) => {
            const indexA = priorityOrder.indexOf(a);
            const indexB = priorityOrder.indexOf(b);
            
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.localeCompare(b);
        });
    }, [postData]);
    
    // 💬 MANEJAR CONTACTO
    const handleContact = () => {
        if (!auth.user) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: { error: 'Connectez-vous pour contacter le vendeur' } 
            });
            return;
        }
        
        if (!user?._id || auth.user._id === user._id) return;
        
        dispatch({
            type: MESS_TYPES.ADD_USER,
            payload: { 
                ...user, 
                text: '', 
                media: [],
                postTitle: postData.title || 'Annonce',
                postId: post._id,
                postPrice: postData.price,
                postImage: post.images?.[0]?.url
            }
        });
        
        history.push(`/message/${user._id}`);
    };
    
    // 🏷️ RENDER HEADER
    const renderHeader = () => {
        const title = postData.title || 'Annonce';
        const price = postData.price;
        const categorie = postData.categorie;
        const subCategory = postData.subCategory;
        const articleType = postData.articleType;
        const etat = postData.etat;
        
        return (
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3">
                        <div className="flex-grow-1">
                            <h1 className="fw-bold mb-2" style={{ fontSize: '1.8rem' }}>
                                {title}
                            </h1>
                            
                            <div className="d-flex flex-wrap gap-2 mb-3">
                                {categorie && (
                                    <Badge bg="primary" className="px-3 py-2">
                                        {categorie}
                                    </Badge>
                                )}
                                {subCategory && (
                                    <Badge bg="secondary" className="px-3 py-2">
                                        {subCategory}
                                    </Badge>
                                )}
                                {articleType && (
                                    <Badge bg="info" className="px-3 py-2">
                                        {articleType}
                                    </Badge>
                                )}
                                {etat && (
                                    <Badge bg="success" className="px-3 py-2">
                                        {formatValue('etat', etat)}
                                    </Badge>
                                )}
                            </div>
                            
                            {postData.description && (
                                <p className="text-muted mb-0" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
                                    {postData.description}
                                </p>
                            )}
                        </div>
                        
                        {price > 0 && (
                            <div className="text-start text-md-end">
                                <div className="text-muted small mb-1">Prix</div>
                                <div className="fw-bold text-success" style={{ fontSize: '2rem' }}>
                                    {formatValue('price', price)}
                                </div>
                            </div>
                        )}
                    </div>
                </Card.Body>
            </Card>
        );
    };
    
    // 🎯 RENDER CAMPO (en formato horizontal)
    const FieldItem = ({ field }) => {
        const value = postData[field];
        const formattedValue = formatValue(field, value);
        
        if (!formattedValue) return null;
        
        const emoji = getFieldEmoji(field, value, postData.categorie);
        const label = translateField(field);
        
        return (
            <div className="field-item d-flex align-items-center p-3 border-bottom">
                <div className="d-flex align-items-center" style={{ minWidth: '150px' }}>
                    <span className="field-emoji me-2" style={{ fontSize: '1.2rem' }}>
                        {emoji}
                    </span>
                    <span className="fw-medium text-muted">
                        {label}:
                    </span>
                </div>
                <div className="field-value ms-3">
                    <span className="fw-bold">
                        {formattedValue}
                    </span>
                </div>
            </div>
        );
    };
    
    // ✅ VALIDACIONES
    if (!post) {
        return (
            <Container className="py-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-3 text-muted">Chargement de l'annonce...</p>
            </Container>
        );
    }
    
    const fieldsToDisplay = getFieldsToDisplay;
    
    return (
        <Container className="py-4">
            {/* HEADER */}
            {renderHeader()}
            
            {/* DÉTAILS SPÉCIFIQUES */}
            {fieldsToDisplay.length > 0 && (
                <Card className="border-0 shadow-sm mb-4">
                    <Card.Header className="bg-white border-0 py-3">
                        <h5 className="mb-0 fw-bold">📋 Caractéristiques détaillées</h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                        {fieldsToDisplay.map(field => (
                            <FieldItem key={field} field={field} />
                        ))}
                    </Card.Body>
                </Card>
            )}
            
           
            {/* BOUTONS D'ACTION */}
            <div className="d-flex flex-column flex-sm-row gap-3 mt-4">
                {postData.phone && (
                    <Button 
                        variant="success" 
                        size="lg"
                        className="flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                        onClick={() => window.location.href = `tel:${postData.phone}`}
                    >
                        <span>📞</span>
                        <span>Appeler</span>
                    </Button>
                )}
                
                {auth.user && user?._id && auth.user._id !== user._id && (
                    <Button 
                        variant="primary" 
                        size="lg"
                        className="flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                        onClick={handleContact}
                    >
                        <span>💬</span>
                        <span>Contacter le vendeur</span>
                    </Button>
                )}
                
                <Button 
                    variant="outline-secondary" 
                    size="lg"
                    className="flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                    onClick={() => window.history.back()}
                >
                    <span>←</span>
                    <span>Retour</span>
                </Button>
            </div>
            
            {/* ESTILOS */}
            <style jsx="true">{`
                .field-item {
                    min-height: 60px;
                    transition: background-color 0.2s;
                }
                
                .field-item:hover {
                    background-color: #f8f9fa;
                }
                
                .border-bottom {
                    border-color: #e9ecef !important;
                }
                
                .field-value {
                    flex: 1;
                }
                
                @media (max-width: 576px) {
                    .field-item {
                        flex-direction: column;
                        align-items: flex-start !important;
                        gap: 8px;
                        padding: 15px !important;
                    }
                    
                    .field-item > div:first-child {
                        min-width: 100%;
                    }
                    
                    .field-value {
                        margin-left: 0 !important;
                        width: 100%;
                    }
                }
            `}</style>
        </Container>
    );
};

export default DescriptionPost;