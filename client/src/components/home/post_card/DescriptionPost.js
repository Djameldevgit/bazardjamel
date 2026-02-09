// 📁 src/components/post/DescriptionPost.js - ACTUALIZADO PARA TU MODELO
import React, { useMemo } from 'react';
import { Container, Row, Col, Badge, Button, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MESS_TYPES } from '../../../redux/actions/messageAction';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';

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
            // Para facilitar el acceso en la UI
            Object.assign(allData, post.categorySpecificData);
        }
        
        return allData;
    }, [post]);
    
    const user = post?.user || {};
    
    // 🎨 EMOJIS PARA TODOS LOS CAMPOS (optimizado)
    const getFieldEmoji = (field, value) => {
        // Mapa de emojis por campo
        const fieldEmojiMap = {
            // Campos del modelo
            'title': '🏷️',
            'description': '📄',
            'categorie': '🏷️',
            'subCategory': '🏷️',
            'articleType': '🏷️',
            'category': '📂',
            'price': '💰',
            'etat': '⭐',
            'wilaya': '🏙️',
            'commune': '🏘️',
            'address': '📍',
            'phone': '📱',
            'email': '📧',
            'views': '👁️',
            'isActive': '✅',
            'createdAt': '📅',
            'updatedAt': '🔄',
            
            // Campos comunes en categorySpecificData
            'marque': '🚗', 'modele': '🚘', 'annee': '📅',
            'kilometrage': '🛣️', 'carburant': '⛽', 'boiteVitesse': '⚙️',
            'surface': '📏', 'chambres': '🛏️', 'sallesBain': '🚿',
            'ram': '💾', 'stockage': '💿', 'processeur': '⚙️',
            'ecran': '🖥️', 'camera': '📷', 'batterie': '🔋',
            
            // Por defecto según valor
            'default': '📋'
        };
        
        // Emojis especiales según valor (para etat/condition)
        if (field === 'etat' || field === 'condition') {
            const val = String(value).toLowerCase();
            if (val.includes('neuf') || val === 'new') return '✨';
            if (val.includes('occasion') || val === 'used') return '🔄';
        }
        
        return fieldEmojiMap[field] || fieldEmojiMap.default;
    };
    
    // 📝 FORMATO DE VALORES (optimizado para tu modelo)
    const formatValue = (field, value) => {
        if (value === undefined || value === null || value === '') {
            return 'Non spécifié';
        }
        
        // Booleanos
        if (typeof value === 'boolean') {
            return value ? '✅ Oui' : '❌ Non';
        }
        
        // Fechas
        if (field === 'createdAt' || field === 'updatedAt') {
            return new Date(value).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
        
        // Números
        if (typeof value === 'number') {
            // Precio
            if (field === 'price') {
                return new Intl.NumberFormat('fr-FR').format(value) + ' DA';
            }
            // Vistas
            if (field === 'views') {
                return new Intl.NumberFormat('fr-FR').format(value) + ' vues';
            }
            // Kilometraje
            if (field === 'kilometrage') {
                return new Intl.NumberFormat('fr-FR').format(value) + ' km';
            }
            // Superficie
            if (field === 'surface') {
                return new Intl.NumberFormat('fr-FR').format(value) + ' m²';
            }
            // Año
            if (field === 'annee') {
                return value;
            }
            return new Intl.NumberFormat('fr-FR').format(value);
        }
        
        // Arrays (imágenes)
        if (Array.isArray(value) && field === 'images') {
            return `${value.length} image${value.length > 1 ? 's' : ''}`;
        }
        
        // Strings con valores especiales
        const stringValue = String(value).trim().toLowerCase();
        
        const specialValues = {
            // Estados del producto
            'neuf': '✨ Neuf',
            'occasion': '🔄 Occasion',
            'comme neuf': '✨ Comme neuf',
            'reconditionne': '🔄 Reconditionné',
            
            // Booleanos en texto
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
            'semi-automatique': '⚙️ Semi-automatique',
            
            // Estado de actividad
            'active': '✅ Active',
            'inactive': '❌ Inactive'
        };
        
        if (specialValues[stringValue]) {
            return specialValues[stringValue];
        }
        
        // Capitalizar primera letra para strings normales
        return String(value).charAt(0).toUpperCase() + String(value).slice(1);
    };
    
    // 🏷️ TRADUCIR NOMBRES DE CAMPOS
    const translateField = (field) => {
        const translations = {
            // Campos del modelo
            'title': 'Titre',
            'description': 'Description',
            'categorie': 'Catégorie',
            'subCategory': 'Sous-catégorie',
            'articleType': 'Type d\'article',
            'category': 'Catégorie (ID)',
            'price': 'Prix',
            'etat': 'État',
            'wilaya': 'Wilaya',
            'commune': 'Commune',
            'address': 'Adresse',
            'phone': 'Téléphone',
            'email': 'Email',
            'views': 'Vues',
            'isActive': 'Active',
            'createdAt': 'Date de publication',
            'updatedAt': 'Dernière mise à jour',
            'images': 'Images',
            
            // Campos comunes
            'marque': 'Marque',
            'modele': 'Modèle',
            'annee': 'Année',
            'kilometrage': 'Kilométrage',
            'carburant': 'Carburant',
            'boiteVitesse': 'Boîte vitesse',
            'couleur': 'Couleur',
            'surface': 'Surface',
            'chambres': 'Chambres',
            'sallesBain': 'Salles de bain',
            'etage': 'Étage',
            'meuble': 'Meublé',
            'ram': 'RAM',
            'stockage': 'Stockage',
            'processeur': 'Processeur',
            'ecran': 'Écran',
            'systeme': 'Système',
            'camera': 'Caméra',
            'batterie': 'Batterie'
        };
        
        return translations[field] || field;
    };
    
    // 📊 ORDEN DE CAMPOS (prioridad según importancia)
    const orderedFields = useMemo(() => {
        if (!postData) return [];
        
        const fields = Object.keys(postData).filter(field => {
            // Excluir campos internos o vacíos
            const value = postData[field];
            const excludeFields = ['_id', '__v', 'user', 'categorySpecificData'];
            
            if (excludeFields.includes(field)) return false;
            if (value === undefined || value === null || value === '') return false;
            if (field === 'images' && Array.isArray(value) && value.length === 0) return false;
            
            return true;
        });
        
        // Orden de prioridad
        const priorityOrder = [
            // Información esencial
            'title', 'description', 'categorie', 'subCategory', 'articleType',
            
            // Precio y estado
            'price', 'etat',
            
            // Características principales
            'marque', 'modele', 'annee', 'kilometrage', 'surface', 'chambres',
            'ram', 'stockage', 'processeur',
            
            // Especificaciones
            'carburant', 'boiteVitesse', 'couleur', 'sallesBain', 'meuble',
            'ecran', 'camera', 'batterie',
            
            // Contacto
            'phone', 'email',
            
            // Ubicación
            'wilaya', 'commune', 'address',
            
            // Metadatos
            'views', 'createdAt'
        ];
        
        return fields.sort((a, b) => {
            const indexA = priorityOrder.indexOf(a);
            const indexB = priorityOrder.indexOf(b);
            
            // Si ambos están en la lista de prioridad
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            // Si solo A está en la lista
            if (indexA !== -1) return -1;
            // Si solo B está en la lista
            if (indexB !== -1) return 1;
            // Si ninguno está, orden alfabético
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
    
    // 📱 COMPONENTE CAMPO-VALOR
    const FieldRow = ({ field }) => {
        const value = postData[field];
        const emoji = getFieldEmoji(field, value);
        const formattedValue = formatValue(field, value);
        const label = translateField(field);
        
        // No mostrar si no hay valor significativo
        if (formattedValue === 'Non spécifié') return null;
        
        return (
            <div className="field-row d-flex align-items-center p-3 border-bottom">
                <div className="field-label d-flex align-items-center gap-2" style={{ flex: 1 }}>
                    <span className="field-emoji" style={{ fontSize: '1.2rem', minWidth: '32px' }}>
                        {emoji}
                    </span>
                    <span className="fw-medium text-muted" style={{ fontSize: '0.9rem' }}>
                        {label}:
                    </span>
                </div>
                <div className="field-value text-end" style={{ flex: 1 }}>
                    <span className="fw-bold" style={{ color: '#1a202c' }}>
                        {formattedValue}
                    </span>
                </div>
            </div>
        );
    };
    
    // 🏷️ HEADER DE LA PUBLICACIÓN
    const renderHeader = () => {
        const title = postData.title || 'Annonce';
        const price = postData.price;
        const categorie = postData.categorie;
        const subCategory = postData.subCategory;
        const etat = postData.etat;
        
        return (
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-start gap-3">
                    <div style={{ flex: 1 }}>
                        <h1 className="fw-bold mb-2" style={{ 
                            fontSize: '1.5rem', 
                            color: '#1a202c',
                            lineHeight: '1.3'
                        }}>
                            {title}
                        </h1>
                        <div className="d-flex flex-wrap gap-2 align-items-center">
                            {categorie && (
                                <Badge bg="primary" className="px-2 py-1">
                                    {categorie}
                                </Badge>
                            )}
                            {subCategory && (
                                <Badge bg="secondary" className="px-2 py-1">
                                    {subCategory}
                                </Badge>
                            )}
                            {etat && (
                                <Badge bg="info" className="px-2 py-1">
                                    {formatValue('etat', etat)}
                                </Badge>
                            )}
                        </div>
                    </div>
                    
                    {price > 0 && (
                        <div className="text-end">
                            <div className="text-muted small">Prix</div>
                            <div className="fw-bold fs-4 text-success">
                                {formatValue('price', price)}
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Descripción */}
                {postData.description && (
                    <div className="mt-3 p-3 bg-light rounded">
                        <p className="mb-0" style={{ lineHeight: '1.6' }}>
                            {postData.description}
                        </p>
                    </div>
                )}
            </div>
        );
    };
    
    // ✅ VALIDACIONES
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
    
    if (orderedFields.length === 0) {
        return (
            <Container className="py-4">
                <div className="alert alert-info">
                    <h6 className="mb-0">Aucune information disponible</h6>
                </div>
            </Container>
        );
    }
    
    return (
        <Container className="py-3">
            {/* HEADER */}
            {renderHeader()}
            
            {/* DETALLES */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Header className="bg-white border-0 py-3">
                    <h5 className="mb-0 fw-bold">📋 Détails de l'annonce</h5>
                </Card.Header>
                <Card.Body className="p-0">
                    {orderedFields
                        .filter(field => !['title', 'description', 'price', 'etat'].includes(field))
                        .map(field => (
                            <FieldRow key={field} field={field} />
                        ))}
                </Card.Body>
            </Card>
            
            {/* BOTONES DE ACCIÓN */}
            <div className="d-flex gap-3">
                {postData.phone && (
                    <Button 
                        variant="success" 
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
                        className="flex-grow-1 d-flex align-items-center justify-content-center gap-2"
                        onClick={handleContact}
                    >
                        <span>💬</span>
                        <span>Contacter</span>
                    </Button>
                )}
            </div>
            
            {/* ESTILOS */}
            <style jsx>{`
                .field-row {
                    min-height: 60px;
                    transition: background-color 0.2s;
                }
                
                .field-row:hover {
                    background-color: #f8f9fa;
                }
                
                .border-bottom {
                    border-color: #e9ecef !important;
                }
                
                .border-bottom:last-child {
                    border-bottom: none !important;
                }
                
                @media (max-width: 768px) {
                    .field-row {
                        flex-direction: column;
                        align-items: flex-start !important;
                        gap: 8px;
                    }
                    
                    .field-value {
                        text-align: left !important;
                        width: 100%;
                    }
                }
            `}</style>
        </Container>
    );
};

export default DescriptionPost;