// 📁 src/components/post/DescriptionPost.js
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Badge, Button, Card } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MESS_TYPES } from '../../../redux/actions/messageAction';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';

const DescriptionPost = ({ post }) => {
    const [readMore, setReadMore] = useState(false);
    const { auth, languageReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const history = useHistory();
    
    const lang = languageReducer.language || 'fr';
    const { t, i18n } = useTranslation();
    const isRTL = lang === 'ar';

    useEffect(() => {
        if (i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }
    }, [lang, i18n]);

    // 🎯 OBTENER Y COMBINAR TODOS LOS DATOS DEL POST
    const getPostData = useMemo(() => {
        if (!post) return { post: {}, user: {} };

        // 1. Crear objeto combinado con todos los datos
        const combinedData = { ...post };
        
        // 2. Combinar categorySpecificData (puede ser Map o Object)
        if (post.categorySpecificData) {
            try {
                if (post.categorySpecificData instanceof Map) {
                    post.categorySpecificData.forEach((value, key) => {
                        if (value !== undefined && value !== null && value !== '') {
                            combinedData[key] = value;
                        }
                    });
                } else if (typeof post.categorySpecificData === 'object') {
                    Object.entries(post.categorySpecificData).forEach(([key, value]) => {
                        if (value !== undefined && value !== null && value !== '') {
                            combinedData[key] = value;
                        }
                    });
                }
            } catch (err) {
                console.warn('Error combinando categorySpecificData:', err);
            }
        }

        // 3. Combinar otros campos específicos
        const detailFields = ['immobilierDetails', 'vehiculeDetails', 'phoneDetails', 'computerDetails'];
        detailFields.forEach(field => {
            if (post[field] && typeof post[field] === 'object') {
                Object.entries(post[field]).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        combinedData[key] = value;
                    }
                });
            }
        });

        // 4. Agregar campos directos del post (si no existen ya)
        const directFields = [
            'title', 'description', 'categorie', 'subCategory', 'articleType',
            'price', 'loyer', 'prix', 'telephone', 'phone', 'email',
            'wilaya', 'commune', 'adresse', 'etat', 'reference',
            'marque', 'modele', 'model', 'brand', 'annee', 'year',
            'kilometrage', 'km', 'carburant', 'boiteVitesse', 'puissance',
            'couleur', 'color', 'superficie', 'surface', 'chambres',
            'sallesBain', 'etage', 'meuble', 'jardin', 'piscine', 'garage',
            'ram', 'stockage', 'storage', 'processeur', 'ecran', 'screen',
            'systemeExploitation', 'os', 'capacite', 'capacity', 'taille', 'size',
            'unite', 'typeOffre', 'echange', 'grossdetail', 'negotiable', 'negociable',
            'livraison', 'delivery', 'certification', 'origine', 'saison',
            'typeProduit', 'typeService', 'typeMateriau', 'typePiece',
            'conditionnement', 'poids', 'weight', 'dlc', 'peremption',
            'conservation', 'ingredients', 'certificationBio', 'producteur',
            'typePlat', 'personnes', 'typeViande', 'decoupe', 'typeLaitier',
            'matiereGrasse', 'typeBoisson', 'contenance', 'alcool',
            'categorieEpicerie', 'typeBoulangerie', 'fabrication',
            'typeConserve', 'contenu', 'typeSurgeles', 'conservationTemperature'
        ];

        directFields.forEach(field => {
            const value = post[field];
            if (value !== undefined && value !== null && value !== '') {
                if (!combinedData[field]) {
                    combinedData[field] = value;
                }
            }
        });

        return {
            post: combinedData,
            user: post.user || {}
        };
    }, [post]);

    const { post: postData, user } = getPostData;

    // 🏷️ GENERAR TÍTULO AUTOMÁTICO
    const generateTitle = () => {
        if (postData.title) return postData.title;
        
        const parts = [];
        
        // Marca/Modelo
        if (postData.marque || postData.brand) {
            parts.push(postData.marque || postData.brand);
        }
        if (postData.modele || postData.model) {
            parts.push(postData.modele || postData.model);
        }
        
        // Año
        if (postData.annee || postData.year) {
            parts.push(`(${postData.annee || postData.year})`);
        }
        
        // Categoría
        if (postData.categorie) {
            parts.push(postData.categorie.charAt(0).toUpperCase() + postData.categorie.slice(1));
        }
        
        return parts.length > 0 ? parts.join(' • ') : 'Annonce sans titre';
    };

    // 🎨 OBTENER EMOJI PARA CAMPO
    const getFieldEmoji = (fieldName) => {
        const emojiMap = {
            // Información básica
            'title': '🏷️', 'description': '📄', 'categorie': '🏷️',
            'subCategory': '🏷️', 'articleType': '🏷️',
            
            // Vehículos
            'marque': '🏭', 'brand': '🏭', 'modele': '🚗', 'model': '🚗',
            'annee': '📅', 'year': '📅', 'kilometrage': '🛣️', 'km': '🛣️',
            'carburant': '⛽', 'boiteVitesse': '⚙️', 'puissance': '⚡',
            'couleur': '🎨', 'color': '🎨',
            
            // Inmuebles
            'superficie': '📏', 'surface': '📏', 'chambres': '🛏️',
            'sallesBain': '🚿', 'etage': '🏢', 'meuble': '🛋️',
            'jardin': '🌳', 'piscine': '🏊', 'garage': '🚗',
            
            // Electrónica/Informática
            'ram': '💾', 'stockage': '💿', 'storage': '💿',
            'processeur': '⚙️', 'ecran': '🖥️', 'screen': '🖥️',
            'systemeExploitation': '💻', 'os': '💻',
            
            // Alimentación
            'typeProduit': '🥫', 'origine': '🌍', 'saison': '🌞',
            'conditionnement': '📦', 'poids': '⚖️', 'weight': '⚖️',
            'dlc': '📅', 'peremption': '⏰', 'conservation': '❄️',
            'ingredients': '🥗', 'certificationBio': '🌱', 'producteur': '👨‍🌾',
            'typePlat': '🍽️', 'personnes': '👥', 'typeViande': '🥩',
            'decoupe': '🔪', 'typeLaitier': '🧀', 'matiereGrasse': '🧈',
            'typeBoisson': '🥤', 'contenance': '🧴', 'alcool': '🍷',
            'categorieEpicerie': '🛒', 'typeBoulangerie': '🥐',
            'fabrication': '👨‍🍳', 'typeConserve': '🥫', 'contenu': '📦',
            'typeSurgeles': '❄️', 'conservationTemperature': '🌡️',
            
            // General
            'etat': '⭐', 'reference': '🔢', 'capacite': '💾', 'capacity': '💾',
            'taille': '📏', 'size': '📏',
            
            // Precio y condiciones
            'price': '💰', 'prix': '💰', 'loyer': '💵',
            'unite': '📏', 'typeOffre': '🏷️', 'echange': '🔄',
            'grossdetail': '📦', 'negotiable': '🤝', 'negociable': '🤝',
            'livraison': '🚚', 'delivery': '🚚',
            
            // Contacto y ubicación
            'telephone': '📞', 'phone': '📞', 'email': '📧',
            'wilaya': '🏙️', 'commune': '🏘️', 'adresse': '📍',
            
            // Otros
            'certification': '📜', 'typeService': '🛠️',
            'typeMateriau': '🧱', 'typePiece': '🔩'
        };
        
        return emojiMap[fieldName] || '📋';
    };

    // 📝 FORMATO DE VALORES
    const formatValue = (field, value) => {
        if (value === undefined || value === null || value === '') return '-';
        
        // Booleanos
        if (typeof value === 'boolean') {
            return value ? 'Oui' : 'Non';
        }
        
        // Arrays
        if (Array.isArray(value)) {
            return value.join(', ');
        }
        
        // Números con formato
        if (typeof value === 'number') {
            // Precio
            if (field.includes('price') || field.includes('prix') || field.includes('loyer')) {
                return new Intl.NumberFormat('fr-FR').format(value) + ' DZD';
            }
            // Superficie
            if (field.includes('surface') || field.includes('superficie')) {
                return new Intl.NumberFormat('fr-FR').format(value) + ' m²';
            }
            // Kilometrage
            if (field.includes('kilometrage') || field.includes('km')) {
                return new Intl.NumberFormat('fr-FR').format(value) + ' km';
            }
            // Año
            if (field.includes('annee') || field.includes('year')) {
                return value.toString();
            }
            return new Intl.NumberFormat('fr-FR').format(value);
        }
        
        // Valores específicos
        if (field === 'grossdetail') {
            if (value === 'gross') return 'En gros';
            if (value === 'detail') return 'Au détail';
            if (value === 'both') return 'Gros et détail';
        }
        
        if (field === 'typeOffre') {
            if (value === 'vente') return 'Vente';
            if (value === 'location') return 'Location';
            if (value === 'echange') return 'Échange';
        }
        
        if (field === 'livraison' || field === 'delivery') {
            if (value === true || value === 'true') return 'Livraison possible';
            if (value === false || value === 'false') return 'Sans livraison';
        }
        
        if (field === 'echange') {
            if (value === true || value === 'true') return 'Échange possible';
            if (value === false || value === 'false') return 'Pas d\'échange';
        }
        
        if (field === 'negotiable' || field === 'negociable') {
            if (value === true || value === 'true') return 'Négociable';
            if (value === false || value === 'false') return 'Prix fixe';
        }
        
        // String normal
        return String(value).charAt(0).toUpperCase() + String(value).slice(1);
    };

    // 📱 COMPONENTE LÍNEA SIMPLE
    const FieldLine = ({ field, value }) => {
        const fieldLabels = {
            // Traducciones de campos comunes
            'title': 'Titre',
            'description': 'Description',
            'categorie': 'Catégorie',
            'subCategory': 'Sous-catégorie',
            'articleType': 'Type d\'article',
            'price': 'Prix',
            'prix': 'Prix',
            'loyer': 'Loyer',
            'etat': 'État',
            'reference': 'Référence',
            'marque': 'Marque',
            'brand': 'Marque',
            'modele': 'Modèle',
            'model': 'Modèle',
            'annee': 'Année',
            'year': 'Année',
            'kilometrage': 'Kilométrage',
            'km': 'Kilométrage',
            'carburant': 'Carburant',
            'boiteVitesse': 'Boîte de vitesse',
            'puissance': 'Puissance',
            'couleur': 'Couleur',
            'color': 'Couleur',
            'superficie': 'Superficie',
            'surface': 'Surface',
            'chambres': 'Chambres',
            'sallesBain': 'Salles de bain',
            'etage': 'Étage',
            'meuble': 'Meublé',
            'jardin': 'Jardin',
            'piscine': 'Piscine',
            'garage': 'Garage',
            'ram': 'RAM',
            'stockage': 'Stockage',
            'storage': 'Stockage',
            'processeur': 'Processeur',
            'ecran': 'Écran',
            'screen': 'Écran',
            'systemeExploitation': 'Système d\'exploitation',
            'os': 'Système d\'exploitation',
            'capacite': 'Capacité',
            'capacity': 'Capacité',
            'taille': 'Taille',
            'size': 'Taille',
            'unite': 'Unité',
            'typeOffre': 'Type d\'offre',
            'echange': 'Échange',
            'grossdetail': 'Vente en',
            'negotiable': 'Négociable',
            'negociable': 'Négociable',
            'livraison': 'Livraison',
            'delivery': 'Livraison',
            'telephone': 'Téléphone',
            'phone': 'Téléphone',
            'email': 'Email',
            'wilaya': 'Wilaya',
            'commune': 'Commune',
            'adresse': 'Adresse',
            'certification': 'Certification',
            'origine': 'Origine',
            'saison': 'Saison',
            'typeProduit': 'Type de produit',
            'typeService': 'Type de service',
            'typeMateriau': 'Type de matériau',
            'typePiece': 'Type de pièce',
            'conditionnement': 'Conditionnement',
            'poids': 'Poids',
            'weight': 'Poids',
            'dlc': 'Date limite de consommation',
            'peremption': 'Péremption',
            'conservation': 'Conservation',
            'ingredients': 'Ingrédients',
            'certificationBio': 'Certification bio',
            'producteur': 'Producteur',
            'typePlat': 'Type de plat',
            'personnes': 'Personnes',
            'typeViande': 'Type de viande',
            'decoupe': 'Découpe',
            'typeLaitier': 'Type laitier',
            'matiereGrasse': 'Matière grasse',
            'typeBoisson': 'Type de boisson',
            'contenance': 'Contenance',
            'alcool': 'Alcool',
            'categorieEpicerie': 'Catégorie épicerie',
            'typeBoulangerie': 'Type boulangerie',
            'fabrication': 'Fabrication',
            'typeConserve': 'Type de conserve',
            'contenu': 'Contenu',
            'typeSurgeles': 'Type surgelés',
            'conservationTemperature': 'Température de conservation'
        };

        const label = fieldLabels[field] || field.replace(/([A-Z])/g, ' $1').toLowerCase().replace(/^./, str => str.toUpperCase());
        const emoji = getFieldEmoji(field);
        const formattedValue = formatValue(field, value);

        return (
            <div className="d-flex align-items-center py-2 border-bottom">
                <div className="me-3" style={{ fontSize: '1.2rem', width: '30px' }}>
                    {emoji}
                </div>
                <div style={{ flex: 1 }}>
                    <div className="fw-bold" style={{ fontSize: '0.95rem' }}>
                        {label}
                    </div>
                </div>
                <div className="text-end">
                    <div className="fw-semibold text-dark" style={{ fontSize: '0.95rem' }}>
                        {formattedValue}
                    </div>
                </div>
            </div>
        );
    };

    // 🚗 OBTENER CAMPOS DISPONIBLES
    const getAvailableFields = () => {
        if (!postData || typeof postData !== 'object') return [];
        
        return Object.keys(postData).filter(key => 
            key !== '_id' && 
            key !== 'user' && 
            key !== 'store' && 
            key !== 'images' && 
            key !== 'likes' && 
            key !== 'comments' && 
            key !== 'createdAt' && 
            key !== 'updatedAt' &&
            key !== 'views' &&
            key !== 'isPromoted' &&
            key !== 'isUrgent' &&
            key !== 'isActive' &&
            key !== '__v' &&
            postData[key] !== undefined &&
            postData[key] !== null &&
            postData[key] !== ''
        );
    };

    // 📊 GRUPAR CAMPOS POR CATEGORÍA (VERSIÓN CORREGIDA)
    const getGroupedFields = () => {
        const availableFields = getAvailableFields();
        if (availableFields.length === 0) return {};

        // Definir grupos de campos
        const fieldGroups = {
            informaciónPrincipal: ['title', 'description', 'categorie', 'subCategory', 'articleType'],
            precioCondiciones: ['price', 'prix', 'loyer', 'unite', 'typeOffre', 'grossdetail', 'negotiable', 'negociable', 'echange', 'livraison', 'delivery'],
            características: ['etat', 'reference', 'marque', 'brand', 'modele', 'model', 'annee', 'year', 'kilometrage', 'km', 'carburant', 'boiteVitesse', 'puissance', 'couleur', 'color', 'superficie', 'surface', 'chambres', 'sallesBain', 'etage', 'meuble', 'jardin', 'piscine', 'garage'],
            especificaciones: ['ram', 'stockage', 'storage', 'processeur', 'ecran', 'screen', 'systemeExploitation', 'os', 'capacite', 'capacity', 'taille', 'size'],
            alimentación: ['typeProduit', 'origine', 'saison', 'conditionnement', 'poids', 'weight', 'dlc', 'peremption', 'conservation', 'ingredients', 'certificationBio', 'producteur', 'typePlat', 'personnes', 'typeViande', 'decoupe', 'typeLaitier', 'matiereGrasse', 'typeBoisson', 'contenance', 'alcool', 'categorieEpicerie', 'typeBoulangerie', 'fabrication', 'typeConserve', 'contenu', 'typeSurgeles', 'conservationTemperature'],
            contacto: ['telephone', 'phone', 'email', 'wilaya', 'commune', 'adresse']
        };

        // Agrupar campos
        const grouped = {
            informaciónPrincipal: [],
            precioCondiciones: [],
            características: [],
            especificaciones: [],
            alimentación: [],
            contacto: [],
            otros: []
        };

        availableFields.forEach(field => {
            let added = false;
            
            for (const [groupName, groupFields] of Object.entries(fieldGroups)) {
                if (groupFields.includes(field)) {
                    grouped[groupName].push(field);
                    added = true;
                    break;
                }
            }
            
            if (!added) {
                grouped.otros.push(field);
            }
        });

        // Filtrar grupos vacíos
        Object.keys(grouped).forEach(group => {
            if (grouped[group].length === 0) {
                delete grouped[group];
            }
        });

        return grouped;
    };

    // 📋 RENDERIZAR GRUPOS DE CAMPOS (VERSIÓN CORREGIDA)
    const renderFieldGroups = () => {
        const groupedFields = getGroupedFields();
        if (!groupedFields || Object.keys(groupedFields).length === 0) {
            return (
                <div className="alert alert-info">
                    Aucune information détaillée disponible pour cette annonce.
                </div>
            );
        }

        const groupTitles = {
            'informaciónPrincipal': '📋 Informations principales',
            'precioCondiciones': '💰 Prix et conditions',
            'características': '🚗 Caractéristiques',
            'especificaciones': '💻 Spécifications techniques',
            'alimentación': '🥫 Détails alimentaires',
            'contacto': '📍 Contact et localisation',
            'otros': '📌 Autres informations'
        };

        const order = ['informaciónPrincipal', 'precioCondiciones', 'características', 'especificaciones', 'alimentación', 'contacto', 'otros'];
        
        return order
            .filter(group => groupedFields[group] && groupedFields[group].length > 0)
            .map((group, index) => (
                <div key={group} className="mb-4">
                    <h3 className="fw-bold mb-3" style={{ fontSize: '1.3rem', color: '#2c3e50' }}>
                        {groupTitles[group]}
                    </h3>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-0">
                            {groupedFields[group].map(field => (
                                <div key={field} className="px-3">
                                    <FieldLine field={field} value={postData[field]} />
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </div>
            ));
    };

    // 💬 MANEJAR CONTACTO
    const handleContact = () => {
        if (!auth.user) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: { error: 'Veuillez vous connecter pour contacter le vendeur' } 
            });
            return;
        }
        
        if (!user || !user._id) return;
        
        if (auth.user._id === user._id) return;
        
        dispatch({
            type: MESS_TYPES.ADD_USER,
            payload: { 
                ...user, 
                text: '', 
                media: [],
                postTitle: generateTitle(),
                postId: post._id,
                postPrice: postData.price,
                postImage: post.images?.[0]?.url
            }
        });
        
        history.push(`/message/${user._id}`);
    };

    // 🏷️ RENDERIZAR HEADER
    const renderHeader = () => {
        const title = generateTitle();
        
        return (
            <div className="mb-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                    <div style={{ fontSize: '2.5rem' }}>
                        {getFieldEmoji(postData.categorie || 'default')}
                    </div>
                    <div>
                        <h1 className="fw-bold mb-1" style={{ fontSize: '1.8rem', lineHeight: '1.3' }}>
                            {title}
                        </h1>
                        {postData.categorie && (
                            <div className="d-flex gap-2">
                                <Badge bg="primary" className="px-3 py-1" style={{ fontSize: '0.9rem' }}>
                                    {postData.categorie.charAt(0).toUpperCase() + postData.categorie.slice(1)}
                                </Badge>
                                {postData.subCategory && (
                                    <Badge bg="secondary" className="px-3 py-1" style={{ fontSize: '0.9rem' }}>
                                        {postData.subCategory}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // ✅ VERIFICAR SI HAY DATOS
    if (!post || !postData || Object.keys(postData).length === 0) {
        return (
            <Container className="py-4">
                <div className="alert alert-warning">
                    Aucune donnée disponible pour cette annonce.
                </div>
            </Container>
        );
    }

    return (
        <Container className="py-4" style={{ 
            direction: isRTL ? 'rtl' : 'ltr', 
            maxWidth: '1000px' 
        }}>
            {/* HEADER */}
            {renderHeader()}
            
            {/* TODOS LOS CAMPOS */}
            {renderFieldGroups()}
            
            {/* BOTONES DE ACCIÓN */}
            <div className="mt-4 pt-3 border-top">
                <Row className="g-3">
                    {postData.telephone && (
                        <Col xs={12} md={6}>
                            <Button 
                                variant="success" 
                                size="lg"
                                className="w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                                style={{ fontSize: '1rem' }}
                                onClick={() => window.location.href = `tel:${postData.telephone}`}
                            >
                                <span>📞</span>
                                <span>Appeler maintenant</span>
                            </Button>
                        </Col>
                    )}
                    
                    <Col xs={12} md={postData.telephone ? 6 : 12}>
                        {auth.user && user && user._id && auth.user._id !== user._id && (
                            <Button 
                                variant="primary" 
                                size="lg"
                                className="w-100 d-flex align-items-center justify-content-center gap-2 py-2"
                                style={{ fontSize: '1rem' }}
                                onClick={handleContact}
                            >
                                <span>💬</span>
                                <span>Contacter le vendeur</span>
                            </Button>
                        )}
                    </Col>
                </Row>
            </div>
            
            {/* ESTILOS */}
            <style jsx>{`
                .border-bottom:last-child {
                    border-bottom: none !important;
                }
                .shadow-sm {
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
                }
            `}</style>
        </Container>
    );
};

export default DescriptionPost;