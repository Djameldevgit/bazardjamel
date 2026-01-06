// 📁 src/components/post/DescriptionPost.js - VERSIÓN OPTIMIZADA
import React from 'react';
import { Container, Row, Col, Badge, Button, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MESS_TYPES } from '../../../redux/actions/messageAction';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';

const DescriptionPost = ({ post }) => {
    const { auth } = useSelector(state => state);
    const dispatch = useDispatch();
    const history = useHistory();
    
    // 🎯 OBTENER TODOS LOS DATOS (comunes + específicos)
    const getAllPostData = () => {
        if (!post) return {};
        
        const allData = {};
        
        // 1. Campos comunes directos del post
        const commonFields = [
            'title', 'description', 'price', 'categorie', 'subCategory',
            'articleType', 'condition', 'wilaya', 'commune', 'address'
        ];
        
        commonFields.forEach(field => {
            if (post[field] !== undefined && post[field] !== null && post[field] !== '') {
                allData[field] = post[field];
            }
        });
        
        // 2. Campos específicos de categorySpecificData
        if (post.categorySpecificData) {
            let specificData = {};
            
            if (post.categorySpecificData instanceof Map) {
                post.categorySpecificData.forEach((value, key) => {
                    if (value !== undefined && value !== null && value !== '') {
                        specificData[key] = value;
                    }
                });
            } else if (typeof post.categorySpecificData === 'object') {
                Object.entries(post.categorySpecificData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        specificData[key] = value;
                    }
                });
            }
            
            // Combinar con campos comunes
            Object.assign(allData, specificData);
        }
        
        return allData;
    };
    
    const postData = getAllPostData();
    const user = post?.user || {};

    // 🎨 EMOJIS PARA TODOS LOS CAMPOS
    const getFieldEmoji = (field) => {
        const emojiMap = {
            // Campos comunes
            'title': '🏷️', 'description': '📄', 'categorie': '🏷️', 
            'subCategory': '🏷️', 'articleType': '🏷️', 'condition': '⭐',
            'price': '💰', 'wilaya': '🏙️', 'commune': '🏘️', 'address': '📍',
            
            // Vehículos
            'marque': '🚗', 'modele': '🚘', 'annee': '📅', 'kilometrage': '🛣️',
            'carburant': '⛽', 'boiteVitesse': '⚙️', 'couleur': '🎨', 'puissance': '⚡',
            'portes': '🚪', 'sieges': '💺', 'cylindree': '⚙️',
            
            // Inmuebles
            'surface': '📏', 'chambres': '🛏️', 'sallesBain': '🚿', 'etage': '🏢',
            'meuble': '🛋️', 'jardin': '🌳', 'piscine': '🏊', 'garage': '🚗',
            'parking': '🅿️', 'ascenseur': '🔼', 'balcon': '🌆', 'terrasse': '🏞️',
            
            // Teléfonos/Informática
            'ram': '💾', 'stockage': '💿', 'processeur': '⚙️', 'ecran': '🖥️',
            'systemeExploitation': '💻', 'camera': '📷', 'batterie': '🔋', 'reseau': '📡',
            'capacite': '💾', 'taille': '📏', 'poids': '⚖️',
            
            // Electroménager
            'typeAppareil': '🔌', 'classeEnergetique': '⚡', 'consommation': '💡',
            
            // Alimentación
            'typeProduit': '🥫', 'origine': '🌍', 'saison': '🌞', 'dlc': '📅',
            'ingredients': '🥗', 'conservation': '❄️', 'poids': '⚖️', 'conditionnement': '📦',
            
            // Servicios
            'typeService': '🛠️', 'duree': '⏱️', 'experience': '🎓', 'disponibilite': '📅',
            'zone': '🗺️', 'tarif': '💰',
            
            // Materiales
            'typeMateriau': '🧱', 'quantite': '📦', 'dimensions': '📐',
            
            // Empleo
            'salaire': '💰', 'typeContrat': '📝', 'experienceRequise': '🎓',
            'competences': '💼', 'avantages': '🎁',
            
            // Viajes
            'destination': '✈️', 'duree': '⏱️', 'transport': '🚗', 'hotel': '🏨',
            
            // Condiciones generales
            'unite': '📏', 'typeOffre': '🏷️', 'echange': '🔄', 'livraison': '🚚',
            'grossdetail': '📦', 'negotiable': '🤝', 'garantie': '🛡️', 'reference': '🔢',
            
            // Por defecto
            'default': '📋'
        };
        
        return emojiMap[field] || emojiMap.default;
    };
    
    // 📝 FORMATO DE VALORES (MEJORADO)
    const formatValue = (field, value) => {
        if (value === undefined || value === null || value === '') return '-';
        
        // Booleanos
        if (typeof value === 'boolean') {
            return value ? '✅ Oui' : '❌ Non';
        }
        
        // Arrays
        if (Array.isArray(value)) {
            return value.join(', ');
        }
        
        // Números con formato
        if (typeof value === 'number') {
            // Precios
            if (['price', 'prix', 'loyer', 'salaire', 'tarif'].includes(field)) {
                return new Intl.NumberFormat('fr-FR').format(value) + ' DA';
            }
            // Medidas
            if (['surface', 'superficie', 'taille', 'longueur', 'largeur'].includes(field)) {
                return new Intl.NumberFormat('fr-FR').format(value) + ' m²';
            }
            if (['kilometrage', 'km', 'distance'].includes(field)) {
                return new Intl.NumberFormat('fr-FR').format(value) + ' km';
            }
            if (['poids', 'weight', 'masse'].includes(field)) {
                return new Intl.NumberFormat('fr-FR').format(value) + ' kg';
            }
            // Cantidades
            if (['quantite', 'quantity', 'nombre', 'number', 'annee'].includes(field)) {
                return new Intl.NumberFormat('fr-FR').format(value);
            }
            return new Intl.NumberFormat('fr-FR').format(value);
        }
        
        // Strings con valores especiales
        const stringValue = String(value).trim().toLowerCase();
        
        const specialValues = {
            // Tipos de oferta
            'vente': '🛒 Vente',
            'location': '🏠 Location', 
            'echange': '🔄 Échange',
            'don': '🎁 Don',
            'cherche': '🔍 Recherche',
            
            // Estados
            'neuf': '✨ Neuf',
            'occasion': '🔄 Occasion',
            'comme neuf': '✨ Comme neuf',
            'reconditionne': '🔄 Reconditionné',
            
            // Tipo de venta
            'gross': '📦 En gros',
            'detail': '🛍️ Au détail',
            'both': '📦 Gros & détail',
            
            // Booleanos
            'true': '✅ Oui',
            'false': '❌ Non',
            'oui': '✅ Oui', 
            'non': '❌ Non',
            
            // Combustibles
            'diesel': '⛽ Diesel',
            'essence': '⛽ Essence', 
            'electrique': '⚡ Électrique',
            'hybride': '🔋 Hybride',
            
            // Transmisión
            'manuel': '⚙️ Manuel',
            'automatique': '⚙️ Automatique',
            
            // Mobiliario
            'meuble': '🛋️ Meublé',
            'non meuble': '🛋️ Non meublé'
        };
        
        if (specialValues[stringValue]) {
            return specialValues[stringValue];
        }
        
        // Capitalizar primera letra
        return String(value).charAt(0).toUpperCase() + String(value).slice(1);
    };
    
    // 🏷️ TRADUCIR NOMBRES DE CAMPOS
    const translateField = (field) => {
        const translations = {
            // Campos comunes
            'title': 'Titre',
            'description': 'Description',
            'categorie': 'Catégorie',
            'subCategory': 'Sous-catégorie',
            'articleType': 'Type d\'article',
            'condition': 'État',
            'price': 'Prix',
            'wilaya': 'Wilaya',
            'commune': 'Commune',
            'address': 'Adresse',
            
            // Vehículos
            'marque': 'Marque',
            'modele': 'Modèle',
            'annee': 'Année',
            'kilometrage': 'Kilométrage',
            'carburant': 'Carburant',
            'boiteVitesse': 'Boîte vitesse',
            'couleur': 'Couleur',
            'puissance': 'Puissance',
            'portes': 'Portes',
            'sieges': 'Sièges',
            
            // Inmuebles
            'surface': 'Surface',
            'chambres': 'Chambres',
            'sallesBain': 'Salles de bain',
            'etage': 'Étage',
            'meuble': 'Meublé',
            'jardin': 'Jardin',
            'piscine': 'Piscine',
            'garage': 'Garage',
            
            // Teléfonos
            'ram': 'RAM',
            'stockage': 'Stockage',
            'processeur': 'Processeur',
            'ecran': 'Écran',
            'systemeExploitation': 'Système',
            'camera': 'Caméra',
            'batterie': 'Batterie',
            
            // Condiciones
            'unite': 'Unité',
            'typeOffre': 'Type offre',
            'echange': 'Échange',
            'livraison': 'Livraison',
            'grossdetail': 'Type vente',
            'negotiable': 'Négociable',
            'garantie': 'Garantie',
            'reference': 'Référence'
        };
        
        return translations[field] || 
               field.replace(/([A-Z])/g, ' $1')
                    .toLowerCase()
                    .replace(/^./, str => str.toUpperCase());
    };
    
    // 📊 ORDENAR CAMPOS INTELIGENTEMENTE
    const getOrderedFields = () => {
        const fields = Object.keys(postData);
        
        // Orden de importancia
        const priorityOrder = [
            // Información esencial
            'title', 'description', 'categorie', 'subCategory', 'articleType',
            
            // Precio y condiciones
            'price', 'condition', 'typeOffre', 'echange', 'livraison', 
            'grossdetail', 'negotiable', 'garantie', 'reference',
            
            // Características principales (depende de categoría)
            'marque', 'modele', 'annee', 'kilometrage', 'surface', 'chambres',
            'ram', 'stockage', 'processeur', 'typeProduit', 'typeService',
            
            // Especificaciones
            'carburant', 'boiteVitesse', 'couleur', 'sallesBain', 'meuble',
            'ecran', 'systemeExploitation', 'camera', 'batterie',
            
            // Ubicación (al final)
            'wilaya', 'commune', 'address'
        ];
        
        const priorityFields = [];
        const otherFields = [];
        
        fields.forEach(field => {
            if (priorityOrder.includes(field)) {
                priorityFields.push(field);
            } else {
                otherFields.push(field);
            }
        });
        
        // Ordenar prioridades
        priorityFields.sort((a, b) => priorityOrder.indexOf(a) - priorityOrder.indexOf(b));
        // Otros alfabéticamente
        otherFields.sort();
        
        return [...priorityFields, ...otherFields];
    };
    
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
    
    // 🎨 COMPONENTE CAMPO-VALOR (OPTIMIZADO PARA MOBILE)
    const FieldRow = ({ field }) => {
        const value = postData[field];
        const emoji = getFieldEmoji(field);
        const formattedValue = formatValue(field, value);
        const label = translateField(field);
        
        return (
            <div className="field-row d-flex align-items-center justify-content-between p-3 border-bottom">
                {/* Lado izquierdo: Emoji + Label */}
                <div className="field-left d-flex align-items-center gap-2" style={{ flex: 1, minWidth: 0 }}>
                    <span className="field-emoji" style={{ 
                        fontSize: '1.3rem',
                        flexShrink: 0,
                        width: '32px',
                        textAlign: 'center'
                    }}>
                        {emoji}
                    </span>
                    <span className="field-label text-truncate fw-semibold" style={{ 
                        fontSize: '0.95rem',
                        color: '#4a5568'
                    }}>
                        {label}
                    </span>
                </div>
                
                {/* Separador para móvil */}
                <span className="mobile-separator mx-2 d-none d-sm-block" style={{ color: '#cbd5e0' }}>
                    :
                </span>
                
                {/* Lado derecho: Valor */}
                <div className="field-right text-truncate" style={{ 
                    flex: 1,
                    textAlign: 'right',
                    minWidth: 0
                }}>
                    <span className="field-value fw-bold" style={{ 
                        fontSize: '1rem',
                        color: '#2d3748',
                        lineHeight: '1.3'
                    }}>
                        {formattedValue}
                    </span>
                </div>
            </div>
        );
    };
    
    // 🏷️ RENDERIZAR HEADER
    const renderHeader = () => {
        const title = postData.title || 'Annonce';
        const price = postData.price;
        const categorie = postData.categorie;
        const subCategory = postData.subCategory;
        const condition = postData.condition;
        
        return (
            <div className="mb-4">
                <div className="d-flex flex-column gap-3">
                    {/* Título y categorías */}
                    <div className="d-flex align-items-start gap-3">
                        <div className="category-emoji" style={{ 
                            fontSize: '2.8rem',
                            lineHeight: '1',
                            flexShrink: 0
                        }}>
                            {getFieldEmoji(categorie || 'default')}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <h1 className="fw-bold mb-2" style={{ 
                                fontSize: '1.5rem', 
                                lineHeight: '1.3',
                                color: '#1a202c',
                                wordBreak: 'break-word'
                            }}>
                                {title}
                            </h1>
                            <div className="d-flex flex-wrap gap-1">
                                {categorie && (
                                    <Badge bg="primary" className="px-2 py-1" style={{ fontSize: '0.8rem' }}>
                                        {categorie.charAt(0).toUpperCase() + categorie.slice(1)}
                                    </Badge>
                                )}
                                {subCategory && (
                                    <Badge bg="secondary" className="px-2 py-1" style={{ fontSize: '0.8rem' }}>
                                        {subCategory}
                                    </Badge>
                                )}
                                {condition && (
                                    <Badge bg="info" className="px-2 py-1" style={{ fontSize: '0.8rem' }}>
                                        {formatValue('condition', condition).replace(/^[✅❌✨🔄]\s*/, '')}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Precio */}
                    {price && (
                        <div className="price-container">
                            <div className="d-inline-flex align-items-center gap-2 bg-success text-white px-3 py-2 rounded-2">
                                <span style={{ fontSize: '1.2rem' }}>💰</span>
                                <div>
                                    <div className="small text-white-50">PRIX</div>
                                    <div className="fw-bold" style={{ fontSize: '1.5rem' }}>
                                        {formatValue('price', price)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };
    
    // 📱 BOTONES DE ACCIÓN
    const renderActionButtons = () => {
        const telephone = postData.telephone || postData.phone;
        
        return (
            <div className="mt-4 pt-3 border-top">
                <Row className="g-2">
                    {telephone && (
                        <Col xs={6}>
                            <Button 
                                variant="success" 
                                size="md"
                                className="w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                                style={{ fontSize: '0.9rem', borderRadius: '8px' }}
                                onClick={() => window.location.href = `tel:${telephone}`}
                            >
                                <span>📞</span>
                                <span className="d-none d-sm-inline">Appeler</span>
                            </Button>
                        </Col>
                    )}
                    
                    <Col xs={telephone ? 6 : 12}>
                        {auth.user && user?._id && auth.user._id !== user._id && (
                            <Button 
                                variant="primary" 
                                size="md"
                                className="w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                                style={{ fontSize: '0.9rem', borderRadius: '8px' }}
                                onClick={handleContact}
                            >
                                <span>💬</span>
                                <span className="d-none d-sm-inline">Contacter</span>
                            </Button>
                        )}
                    </Col>
                </Row>
            </div>
        );
    };
    
    // ✅ VERIFICACIONES
    if (!post) {
        return (
            <Container className="py-4 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-3 text-muted">Chargement de l'annonce...</p>
            </Container>
        );
    }
    
    const orderedFields = getOrderedFields();
    
    if (orderedFields.length === 0) {
        return (
            <Container className="py-4">
                <div className="alert alert-info text-center py-3 rounded-2">
                    <div className="fs-4 mb-2">📄</div>
                    <h6 className="mb-1">Aucune information disponible</h6>
                    <p className="mb-0 small text-muted">Cette annonce ne contient pas de détails.</p>
                </div>
            </Container>
        );
    }
    
    return (
        <Container className="py-3" style={{ maxWidth: '900px' }}>
            {/* HEADER */}
            {renderHeader()}
            
            {/* LISTA DE CAMPOS */}
            <Card className="border-0 shadow-sm rounded-2 overflow-hidden mb-3">
                <Card.Body className="p-0">
                    {orderedFields.map(field => (
                        <FieldRow key={field} field={field} />
                    ))}
                </Card.Body>
            </Card>
            
            {/* BOTONES */}
            {renderActionButtons()}
            
            {/* ESTILOS PARA MOBILE */}
            <style jsx>{`
                .field-row {
                    min-height: 56px;
                    transition: background-color 0.2s;
                }
                
                .field-row:hover {
                    background-color: #f8fafc;
                }
                
                .border-bottom {
                    border-color: #e2e8f0 !important;
                }
                
                .border-bottom:last-child {
                    border-bottom: none !important;
                }
                
                /* MOBILE OPTIMIZATIONS */
                @media (max-width: 576px) {
                    .field-row {
                        padding: 12px 16px !important;
                        min-height: 52px;
                    }
                    
                    .field-emoji {
                        font-size: 1.2rem !important;
                        width: 28px !important;
                    }
                    
                    .field-label {
                        font-size: 0.9rem !important;
                    }
                    
                    .field-value {
                        font-size: 0.95rem !important;
                    }
                    
                    .mobile-separator {
                        display: inline-block !important;
                        margin: 0 6px !important;
                    }
                }
                
                @media (min-width: 577px) and (max-width: 768px) {
                    .mobile-separator {
                        display: inline-block !important;
                    }
                }
                
                @media (min-width: 769px) {
                    .mobile-separator {
                        display: none !important;
                    }
                }
            `}</style>
        </Container>
    );
};

export default DescriptionPost;