// 📂 frontend/src/components/post/DescriptionPost.jsx
import React, { useMemo } from 'react';
import { Card, Badge } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/fr';

moment.locale('fr');

const DescriptionPost = ({ post }) => {
    const { auth } = useSelector(state => state);
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

    // 🎨 MAPA DE ICONOS POR CAMPO
    const fieldIconMap = {
        // Campos base
        'categorie': '📂',
        'subCategory': '📁',
        'articleType': '📌',
        'price': '💰',
        'etat': '⭐',
        'views': '👁️',
        'createdAt': '📅',
        'description': '📄',
        
        // Automobile
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
        'piscine': '🏊',
        'ascenseur': '🛗',
        
        // Électronique
        'ram': '💾',
        'stockage': '💿',
        'processeur': '⚙️',
        'ecran': '🖥️',
        'camera': '📷',
        'batterie': '🔋',
        'systeme': '💻',
        'connectivite': '📶',
        'couleur': '🎨',
        
        // Mode
        'taille': '📏',
        'matiere': '🧵',
        'couleur': '🎨',
        'marque': '👔',
        'genre': '👤',
        'age': '🔞',
        
        // Maison & Jardin
        'type': '🏷️',
        'marque': '🏷️',
        'matiere': '🧱',
        'dimensions': '📐',
        'poids': '⚖️',
        
        // Services
        'duree': '⏱️',
        'disponibilite': '📅',
        'tarif': '💰',
        'zone': '📍',
        
        'default': '📋'
    };

    // 🎯 OBTENER ICONO SEGÚN CAMPO
    const getFieldIcon = (field) => {
        return fieldIconMap[field] || fieldIconMap.default;
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
            if (field === 'views') {
                return new Intl.NumberFormat('fr-DZ').format(value);
            }
            return new Intl.NumberFormat('fr-DZ').format(value);
        }
        
        // Fechas
        if (field === 'createdAt' || field === 'updatedAt') {
            return moment(value).format('DD/MM/YYYY');
        }
        
        // Strings
        const stringValue = String(value).trim();
        return stringValue.charAt(0).toUpperCase() + stringValue.slice(1);
    };

    // 🏷️ TRADUCIR NOMBRES DE CAMPOS
    const translateField = (field) => {
        const translations = {
            // Campos base
            'categorie': 'Catégorie',
            'subCategory': 'Sous-catégorie',
            'articleType': "Type d'article",
            'price': 'Prix',
            'etat': 'État',
            'views': 'Vues',
            'createdAt': 'Publié le',
            'description': 'Description',
            
            // Automobile
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
            'piscine': 'Piscine',
            'ascenseur': 'Ascenseur',
            
            // Électronique
            'ram': 'RAM',
            'stockage': 'Stockage',
            'processeur': 'Processeur',
            'ecran': 'Écran',
            'camera': 'Caméra',
            'batterie': 'Batterie',
            'systeme': "Système d'exploitation",
            'connectivite': 'Connectivité',
            'couleur': 'Couleur',
            
            // Mode
            'taille': 'Taille',
            'matiere': 'Matière',
            'couleur': 'Couleur',
            'marque': 'Marque',
            'genre': 'Genre',
            'age': 'Âge',
            
            // Maison & Jardin
            'type': 'Type',
            'marque': 'Marque',
            'matiere': 'Matière',
            'dimensions': 'Dimensions',
            'poids': 'Poids',
            
            // Services
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
        
        // Campos a excluir
        const excludeFields = [
            '_id', '__v', 'user', 'categorySpecificData', 'images',
            'updatedAt', 'isActive', 'likes', 'comments',
            'boutique', 'isFromBoutique', 'category', 'title',
            'wilaya', 'commune', 'address',
            'phone', 'email', 'website'
        ];
        
        // Campos base que siempre queremos mostrar
        const baseFields = ['categorie', 'subCategory', 'articleType', 'etat', 'price', 'views', 'createdAt'];
        
        // Obtener todos los campos disponibles
        const fields = Object.keys(postData).filter(field => {
            // Excluir campos internos
            if (excludeFields.includes(field)) return false;
            
            const value = postData[field];
            
            // Excluir valores vacíos
            if (value === undefined || value === null || value === '') return false;
            
            // Excluir arrays vacíos
            if (Array.isArray(value) && value.length === 0) return false;
            
            return true;
        });
        
        // Combinar campos base con otros campos
        const allFields = [...new Set([...baseFields, ...fields])];
        
        // Orden de prioridad
        const priorityOrder = [
            'categorie', 'subCategory', 'articleType', 'etat', 'price',
            // Auto
            'marque', 'modele', 'annee', 'kilometrage', 'carburant', 'boiteVitesse', 'couleurExterieur', 'couleurInterieur', 'places', 'portes', 'premiereMain', 'garantie',
            // Immobilier
            'surface', 'chambres', 'sallesBain', 'etage', 'meuble', 'jardin', 'parking', 'climatisation', 'chauffage', 'piscine', 'ascenseur',
            // Électronique
            'ram', 'stockage', 'processeur', 'ecran', 'camera', 'batterie', 'systeme', 'connectivite', 'couleur',
            // Mode
            'taille', 'matiere', 'couleur', 'marque', 'genre', 'age',
            // Maison & Jardin
            'type', 'marque', 'matiere', 'dimensions', 'poids',
            // Services
            'duree', 'disponibilite', 'tarif', 'zone',
            'views', 'createdAt'
        ];
        
        return allFields.sort((a, b) => {
            const indexA = priorityOrder.indexOf(a);
            const indexB = priorityOrder.indexOf(b);
            
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.localeCompare(b);
        });
    }, [postData]);

    // 🏷️ RENDER HEADER (Título y descripción)
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

    // ✅ RENDER CAMPO (estilo exacto como UserInfo)
    const FieldItem = ({ field }) => {
        const value = postData[field];
        const formattedValue = formatValue(field, value);
        
        if (!formattedValue) return null;
        
        const icon = getFieldIcon(field);
        const label = translateField(field);
        
        return (
            <div className="p-3 border-bottom">
                <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                        <div className="me-2" style={{ fontSize: '1.2rem', color: '#6c757d', width: '24px' }}>
                            {icon}
                        </div>
                        <span className="text-muted me-2">{label}:</span>
                    </div>
                    <div className="d-flex align-items-center">
                        {field === 'price' ? (
                            <span className="fw-bold" style={{ color: '#dc2626' }}>
                                {formattedValue}
                            </span>
                        ) : (
                            <span className="fw-bold text-dark">
                                {formattedValue}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // ✅ VALIDACIONES
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
            {/* HEADER */}
            {renderHeader()}
            
            {/* DÉTAILS SPÉCIFIQUES */}
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
            
            {/* BOTÓN RETOUR */}
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