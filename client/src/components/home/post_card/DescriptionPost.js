// 📁 src/components/post/DescriptionPost.js
import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Container, Row, Col, Badge, Button, 
  Accordion, ListGroup, Card, Alert
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MESS_TYPES } from '../../../redux/actions/messageAction';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';

const DescriptionPost = ({ post }) => {
    const [readMore, setReadMore] = useState(false);
    const { auth, message, languageReducer } = useSelector(state => state);
    const dispatch = useDispatch();
    const history = useHistory();
    
    const lang = languageReducer.language || 'fr';
    const { t, i18n } = useTranslation(['descripcion', 'createpost']);
    const isRTL = lang === 'ar';

    useEffect(() => {
        const changeLanguage = async () => {
            if (i18n.language !== lang) {
                await i18n.changeLanguage(lang);
            }
        };
        changeLanguage();
    }, [lang, i18n]);

    // 🎯 OBTENER DATOS DEL POST Y STORE
    const getPostData = useMemo(() => {
        if (!post) return { post: {}, store: {}, user: {} };

        // 1. Combinar todos los datos del post
        const combinedData = { ...post };
        
        // Agregar datos específicos
        if (post.categorySpecificData && typeof post.categorySpecificData === 'object') {
            if (post.categorySpecificData instanceof Map) {
                post.categorySpecificData.forEach((value, key) => {
                    if (value !== undefined && value !== null && value !== '') {
                        combinedData[key] = value;
                    }
                });
            } else {
                Object.entries(post.categorySpecificData).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value !== '') {
                        combinedData[key] = value;
                    }
                });
            }
        }

        // Agregar datos específicos de inmuebles
        if (post.immobilierDetails) {
            Object.entries(post.immobilierDetails).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    combinedData[key] = value;
                }
            });
        }

        // 2. Extraer datos del store si existe
        const storeData = post.store || {};
        
        // 3. Extraer datos del usuario
        const userData = post.user || {};

        return {
            post: combinedData,
            store: storeData,
            user: userData,
            rawData: combinedData
        };
    }, [post]);

    const { post: postData, store, user, rawData } = getPostData;

    // 🏷️ GENERAR TÍTULO MEJORADO
    const generateTitleFromFields = () => {
        if (postData.title) return postData.title;
        
        const parts = [];
        
        // Marca/Modelo
        if (postData.marque || postData.brand) {
            parts.push(postData.marque || postData.brand);
        }
        if (postData.model || postData.modele) {
            parts.push(postData.model || postData.modele);
        }
        
        // Año
        if (postData.annee) {
            parts.push(`(${postData.annee})`);
        }
        
        // Categoría
        if (postData.categorie) {
            parts.push(t(`descripcion:${postData.categorie}`, postData.categorie));
        }
        
        // Ubicación
        if (postData.wilaya) {
            parts.push(postData.wilaya);
        }
        
        return parts.length > 0 ? parts.join(' • ') : t('descripcion:noTitle');
    };

    // 🎨 OBTENER EMOJI POR CAMPO
    const getEmojiForField = (fieldName, value = '') => {
        const emojiMap = {
            // Información básica
            'title': '🏷️', 'description': '📄', 'categorie': '🏷️',
            'subCategory': '🏷️', 'articleType': '🏷️',
            
            // Vehículos
            'marque': '🏭', 'modele': '🚗', 'annee': '📅',
            'kilometrage': '🛣️', 'carburant': '⛽', 'boiteVitesse': '⚙️',
            'puissance': '⚡', 'couleur': '🎨',
            
            // Inmuebles
            'superficie': '📏', 'surface': '📏', 'chambres': '🛏️',
            'sallesBain': '🚿', 'etage': '🏢', 'meuble': '🛋️',
            'jardin': '🌳', 'piscine': '🏊', 'garage': '🚗',
            
            // Electrónica
            'ram': '💾', 'stockage': '💿', 'processeur': '⚙️',
            'ecran': '🖥️', 'systemeExploitation': '💻',
            
            // Contacto
            'telephone': '📞', 'phone': '📞', 'email': '📧',
            'wilaya': '🏙️', 'commune': '🏘️', 'adresse': '📍',
            
            // Precio
            'price': '💰', 'prix': '💰', 'loyer': '💵',
            'negotiable': '🤝', 'negociable': '🤝',
            
            // Store
            'nomBoutique': '🏪', 'descriptionStore': '📝',
            'secteurActivite': '🏢', 'surfaceStore': '📏',
            'horaires': '🕒', 'adresseStore': '📍',
            
            // Usuario
            'fullname': '👤', 'username': '@', 'rating': '⭐',
            'verified': '✅', 'memberSince': '🗓️'
        };
        
        return emojiMap[fieldName] || '📋';
    };

    // 📱 COMPONENTE LÍNEA COMPACTA
    const CompactLine = ({ icon, label, value, badge = null, className = "" }) => {
        const formatValue = (val) => {
            if (!val && val !== 0) return '-';
            
            if (typeof val === 'boolean') {
                return val ? t('descripcion:yes') : t('descripcion:no');
            }
            
            if (Array.isArray(val)) {
                return val.join(', ');
            }
            
            if (typeof val === 'number') {
                // Formatear según tipo
                if (label.toLowerCase().includes('prix') || label.toLowerCase().includes('price')) {
                    return new Intl.NumberFormat('fr-FR').format(val) + ' DZD';
                }
                if (label.toLowerCase().includes('surface') || label.toLowerCase().includes('superficie')) {
                    return new Intl.NumberFormat('fr-FR').format(val) + ' m²';
                }
                if (label.toLowerCase().includes('kilometrage')) {
                    return new Intl.NumberFormat('fr-FR').format(val) + ' km';
                }
                return new Intl.NumberFormat('fr-FR').format(val);
            }
            
            return String(val);
        };

        return (
            <div className={`d-flex align-items-center py-2 ${className}`} 
                 style={{ borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ width: '32px', flexShrink: 0, fontSize: '18px' }}>
                    {icon}
                </div>
                <div style={{ flex: 1 }}>
                    <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>
                        {label}
                    </div>
                </div>
                <div className="text-end">
                    <div className="text-dark" style={{ fontSize: '0.9rem' }}>
                        {formatValue(value)}
                    </div>
                    {badge && (
                        <Badge bg={badge.color} className="ms-2" style={{ fontSize: '0.7rem' }}>
                            {badge.text}
                        </Badge>
                    )}
                </div>
            </div>
        );
    };

    // 🚗 SECCIÓN: INFORMACIÓN PRINCIPAL DEL PRODUCTO
    const renderProductInfoSection = () => {
        // Definir qué campos mostrar según categoría
        let fieldsToShow = [];
        
        switch(postData.categorie) {
            case 'vehicules':
                fieldsToShow = ['marque', 'modele', 'annee', 'kilometrage', 'carburant', 'boiteVitesse', 'puissance', 'couleur'];
                break;
            case 'immobilier':
                fieldsToShow = ['typeImmobilier', 'surface', 'chambres', 'sallesBain', 'etage', 'meuble'];
                break;
            case 'telephones':
                fieldsToShow = ['marque', 'modele', 'couleur', 'capaciteStockage', 'ram', 'systemeExploitation'];
                break;
            case 'informatique':
                fieldsToShow = ['typeProduit', 'marque', 'modele', 'processeur', 'ram', 'stockage'];
                break;
            default:
                // Campos generales para todas las categorías
                fieldsToShow = ['etat', 'reference', 'couleur', 'taille', 'capacite'];
        }
        
        // Filtrar campos que existen en los datos
        const availableFields = fieldsToShow.filter(field => 
            postData[field] !== undefined && postData[field] !== null && postData[field] !== ''
        );
        
        if (availableFields.length === 0) return null;
        
        return (
            <div className="mb-4">
                <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-primary text-white d-flex align-items-center">
                        <span className="me-2">🚗</span>
                        <span className="fw-bold">{t('descripcion:productDetails')}</span>
                    </Card.Header>
                    <Card.Body className="p-0">
                        <ListGroup variant="flush">
                            {availableFields.map((field, index) => (
                                <ListGroup.Item key={field} className="border-0">
                                    <CompactLine
                                        icon={getEmojiForField(field, postData[field])}
                                        label={t(`descripcion:${field}`, field)}
                                        value={postData[field]}
                                        className={index === availableFields.length - 1 ? 'border-0' : ''}
                                    />
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card.Body>
                </Card>
            </div>
        );
    };

    // 🏷️ SECCIÓN: PRECIO Y CONDICIONES
    const renderPriceSection = () => {
        const price = postData.price || postData.prix || postData.loyer;
        if (!price) return null;
        
        return (
            <div className="mb-4">
                <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-success text-white d-flex align-items-center">
                        <span className="me-2">💰</span>
                        <span className="fw-bold">{t('descripcion:priceInfo')}</span>
                    </Card.Header>
                    <Card.Body className="p-3">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h2 className="text-success fw-bold mb-1">
                                    {new Intl.NumberFormat('fr-FR').format(price)} DZD
                                </h2>
                                <div className="text-muted small">
                                    {postData.typeOffre === 'vente' ? 'Prix de vente' : 
                                     postData.typeOffre === 'location' ? 'Loyer mensuel' : 
                                     'Prix'}
                                </div>
                            </div>
                            
                            {(postData.negotiable || postData.echange) && (
                                <div>
                                    {postData.negotiable && (
                                        <Badge bg="warning" className="me-2">
                                            🤝 {t('descripcion:negotiable')}
                                        </Badge>
                                    )}
                                    {postData.echange && (
                                        <Badge bg="info">
                                            🔄 {t('descripcion:echangePossible')}
                                        </Badge>
                                    )}
                                </div>
                            )}
                        </div>
                        
                        {/* Campos adicionales de precio */}
                        <div className="row g-2">
                            {postData.unite && (
                                <div className="col-12 col-md-6">
                                    <CompactLine
                                        icon="📏"
                                        label={t('descripcion:unite')}
                                        value={postData.unite}
                                        className="border-0"
                                    />
                                </div>
                            )}
                            {postData.typeOffre && (
                                <div className="col-12 col-md-6">
                                    <CompactLine
                                        icon="🏷️"
                                        label={t('descripcion:typeOffre')}
                                        value={postData.typeOffre}
                                        className="border-0"
                                    />
                                </div>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        );
    };

    // 📍 SECCIÓN: UBICACIÓN Y CONTACTO
    const renderLocationContactSection = () => {
        const locationFields = ['wilaya', 'commune', 'adresse'];
        const contactFields = ['telephone', 'email', 'whatsapp'];
        
        const availableLocation = locationFields.filter(f => postData[f]);
        const availableContact = contactFields.filter(f => postData[f]);
        
        if (availableLocation.length === 0 && availableContact.length === 0) return null;
        
        return (
            <div className="mb-4">
                <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-info text-white d-flex align-items-center">
                        <span className="me-2">📍</span>
                        <span className="fw-bold">{t('descripcion:locationContact')}</span>
                    </Card.Header>
                    <Card.Body className="p-0">
                        {availableLocation.length > 0 && (
                            <div className="p-3 border-bottom">
                                <h6 className="fw-bold mb-3">📍 {t('descripcion:location')}</h6>
                                <div className="row g-2">
                                    {availableLocation.map(field => (
                                        <div key={field} className="col-12 col-md-4">
                                            <CompactLine
                                                icon={getEmojiForField(field)}
                                                label={t(`descripcion:${field}`, field)}
                                                value={postData[field]}
                                                className="border-0"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        {availableContact.length > 0 && (
                            <div className="p-3">
                                <h6 className="fw-bold mb-3">📞 {t('descripcion:contact')}</h6>
                                <div className="row g-2">
                                    {availableContact.map(field => (
                                        <div key={field} className="col-12 col-md-4">
                                            <CompactLine
                                                icon={getEmojiForField(field)}
                                                label={t(`descripcion:${field}`, field)}
                                                value={field === 'telephone' ? `+${postData[field]}` : postData[field]}
                                                badge={field === 'telephone' ? {
                                                    color: 'success',
                                                    text: t('descripcion:clickToCall')
                                                } : null}
                                                className="border-0"
                                            />
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Botones de acción */}
                                <div className="mt-3 d-flex gap-2">
                                    {postData.telephone && (
                                        <Button 
                                            variant="success" 
                                            size="sm"
                                            className="d-flex align-items-center gap-1"
                                            onClick={() => window.location.href = `tel:${postData.telephone}`}
                                        >
                                            📞 {t('descripcion:callNow')}
                                        </Button>
                                    )}
                                    {postData.whatsapp && (
                                        <Button 
                                            variant="success" 
                                            size="sm"
                                            className="d-flex align-items-center gap-1"
                                            href={`https://wa.me/${postData.whatsapp}`}
                                            target="_blank"
                                        >
                                            💬 WhatsApp
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </div>
        );
    };

    // 🏪 SECCIÓN: INFORMACIÓN DE LA BOUTIQUE/TIENDA
    const renderStoreInfoSection = () => {
        if (!store || Object.keys(store).length === 0) return null;
        
        const storeFields = [
            { key: 'nomBoutique', label: t('descripcion:storeName') },
            { key: 'description', label: t('descripcion:storeDescription') },
            { key: 'secteurActivite', label: t('descripcion:businessSector') },
            { key: 'surface', label: t('descripcion:storeSurface') },
            { key: 'horaires', label: t('descripcion:openingHours') },
            { key: 'telephone', label: t('descripcion:storePhone') },
            { key: 'email', label: t('descripcion:storeEmail') },
            { key: 'adresse', label: t('descripcion:storeAddress') }
        ];
        
        const availableFields = storeFields.filter(item => store[item.key]);
        
        if (availableFields.length === 0) return null;
        
        return (
            <div className="mb-4">
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header className="py-2">
                            <div className="d-flex align-items-center gap-2">
                                <span>🏪</span>
                                <span className="fw-bold">{t('descripcion:storeInfo')}</span>
                                <Badge bg="primary" className="ms-2">
                                    {store.nomBoutique || t('descripcion:store')}
                                </Badge>
                            </div>
                        </Accordion.Header>
                        <Accordion.Body className="p-3">
                            <div className="row g-3">
                                {availableFields.map((item, index) => (
                                    <div key={item.key} className="col-12 col-md-6">
                                        <CompactLine
                                            icon={getEmojiForField(item.key)}
                                            label={item.label}
                                            value={store[item.key]}
                                            className="border-0"
                                        />
                                    </div>
                                ))}
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        );
    };

    // 👤 SECCIÓN: INFORMACIÓN DEL VENDEDOR/USUARIO
    const renderUserInfoSection = () => {
        if (!user || Object.keys(user).length === 0) return null;
        
        return (
            <div className="mb-4">
                <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-secondary text-white d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <span className="me-2">👤</span>
                            <span className="fw-bold">{t('descripcion:sellerInfo')}</span>
                        </div>
                        {user.verified && (
                            <Badge bg="success">
                                ✅ {t('descripcion:verified')}
                            </Badge>
                        )}
                    </Card.Header>
                    <Card.Body>
                        <div className="d-flex align-items-start gap-3 mb-3">
                            {user.avatar && (
                                <img 
                                    src={user.avatar} 
                                    alt={user.fullname}
                                    className="rounded-circle"
                                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                />
                            )}
                            <div className="flex-grow-1">
                                <h5 className="fw-bold mb-1">
                                    {user.fullname || user.username}
                                </h5>
                                <div className="text-muted small mb-2">
                                    {user.username && <span>@{user.username}</span>}
                                    {user.createdAt && (
                                        <span className="ms-2 d-flex align-items-center gap-1">
                                            🗓️ Membre depuis {new Date(user.createdAt).getFullYear()}
                                        </span>
                                    )}
                                </div>
                                
                                {/* Botón de chat */}
                                {auth.user && auth.user._id !== user._id && (
                                    <Button 
                                        variant="primary" 
                                        size="sm"
                                        className="d-flex align-items-center gap-1"
                                        onClick={handleStartChat}
                                    >
                                        💬 {t('descripcion:contactSeller')}
                                    </Button>
                                )}
                            </div>
                        </div>
                        
                        {/* Estadísticas del usuario */}
                        <div className="row g-2">
                            {user.rating && (
                                <div className="col-6 col-md-4">
                                    <CompactLine
                                        icon="⭐"
                                        label={t('descripcion:rating')}
                                        value={`${user.rating.toFixed(1)}/5`}
                                        className="border-0"
                                    />
                                </div>
                            )}
                            {user.postCount !== undefined && (
                                <div className="col-6 col-md-4">
                                    <CompactLine
                                        icon="📝"
                                        label={t('descripcion:totalPosts')}
                                        value={user.postCount}
                                        className="border-0"
                                    />
                                </div>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        );
    };

    // 📄 SECCIÓN: DESCRIPCIÓN
    const renderDescriptionSection = () => {
        const description = postData.description || '';
        if (!description) return null;
        
        return (
            <div className="mb-4">
                <Card className="border-0 shadow-sm">
                    <Card.Header className="bg-dark text-white d-flex align-items-center">
                        <span className="me-2">📄</span>
                        <span className="fw-bold">{t('descripcion:description')}</span>
                    </Card.Header>
                    <Card.Body>
                        <div style={{ 
                            lineHeight: '1.6', 
                            textAlign: isRTL ? 'right' : 'left',
                            whiteSpace: 'pre-line'
                        }}>
                            {readMore ? description : `${description.substring(0, 300)}...`}
                        </div>
                        
                        {description.length > 300 && (
                            <Button 
                                variant="link" 
                                className="mt-2 p-0 text-decoration-none"
                                onClick={() => setReadMore(!readMore)}
                            >
                                {readMore ? 
                                    `👆 ${t('descripcion:seeLess')}` : 
                                    `👇 ${t('descripcion:readMore')}`
                                }
                            </Button>
                        )}
                    </Card.Body>
                </Card>
            </div>
        );
    };

    // 📊 SECCIÓN: INFORMACIÓN ADICIONAL
    const renderAdditionalInfoSection = () => {
        const additionalFields = [
            { key: 'createdAt', label: t('descripcion:publishedOn'), format: (val) => new Date(val).toLocaleDateString(lang) },
            { key: 'views', label: t('descripcion:views'), format: (val) => val.toLocaleString() },
            { key: 'likes', label: t('descripcion:likes'), format: (val) => val?.length || 0 },
            { key: 'isPromoted', label: t('descripcion:promoted'), format: (val) => val ? t('descripcion:yes') : t('descripcion:no') },
            { key: 'isUrgent', label: t('descripcion:urgent'), format: (val) => val ? t('descripcion:yes') : t('descripcion:no') },
            { key: 'isActive', label: t('descripcion:active'), format: (val) => val ? t('descripcion:yes') : t('descripcion:no') }
        ];
        
        const availableFields = additionalFields.filter(item => 
            postData[item.key] !== undefined && postData[item.key] !== null
        );
        
        if (availableFields.length === 0) return null;
        
        return (
            <Accordion className="mb-4">
                <Accordion.Item eventKey="0">
                    <Accordion.Header className="py-2">
                        <div className="d-flex align-items-center gap-2">
                            <span>📊</span>
                            <span className="fw-semibold">{t('descripcion:additionalInfo')}</span>
                        </div>
                    </Accordion.Header>
                    <Accordion.Body className="p-3">
                        <div className="row g-2">
                            {availableFields.map((item, index) => (
                                <div key={item.key} className="col-12 col-md-6">
                                    <CompactLine
                                        icon={getEmojiForField(item.key)}
                                        label={item.label}
                                        value={item.format(postData[item.key])}
                                        className="border-0"
                                    />
                                </div>
                            ))}
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        );
    };

    // 💬 MANEJAR INICIO DE CHAT
    const handleStartChat = () => {
        if (!auth.user) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: { error: t('descripcion:loginToChat') } 
            });
            return;
        }
        
        dispatch({
            type: MESS_TYPES.ADD_USER,
            payload: { 
                ...user, 
                text: '', 
                media: [],
                postTitle: generateTitleFromFields(),
                postId: post._id,
                postPrice: postData.price,
                postImage: post.images?.[0]?.url
            }
        });
        
        history.push(`/message/${user._id}`);
    };

    // 🎯 HEADER PRINCIPAL
    const renderHeader = () => {
        const title = generateTitleFromFields();
        const categoryEmoji = getEmojiForField(postData.categorie);
        
        return (
            <div className="mb-4">
                <div className="d-flex align-items-start gap-3 mb-4">
                    <div className="text-primary" style={{ fontSize: '48px', flexShrink: 0 }}>
                        {categoryEmoji}
                    </div>
                    <div className="flex-grow-1">
                        <h1 className="h2 fw-bold mb-2" style={{ lineHeight: '1.3' }}>
                            {title}
                        </h1>
                        <div className="d-flex align-items-center gap-2 flex-wrap mb-3">
                            <Badge bg="primary" className="py-1 px-2">
                                {t(`descripcion:${postData.categorie}`, postData.categorie)}
                            </Badge>
                            {postData.subCategory && (
                                <Badge bg="secondary" className="py-1 px-2">
                                    {t(`createpost:options.${postData.subCategory}`, postData.subCategory)}
                                </Badge>
                            )}
                            {postData.articleType && (
                                <Badge bg="info" className="py-1 px-2">
                                    {postData.articleType}
                                </Badge>
                            )}
                            {store?.nomBoutique && (
                                <Badge bg="warning" className="py-1 px-2">
                                    🏪 {store.nomBoutique}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <Container className="py-4" style={{ 
            direction: isRTL ? 'rtl' : 'ltr', 
            maxWidth: '1200px' 
        }}>
            {/* HEADER PRINCIPAL */}
            {renderHeader()}
            
            {/* DESCRIPCIÓN */}
            {renderDescriptionSection()}
            
            {/* INFORMACIÓN DEL PRODUCTO */}
            {renderProductInfoSection()}
            
            {/* PRECIO */}
            {renderPriceSection()}
            
            {/* UBICACIÓN Y CONTACTO */}
            {renderLocationContactSection()}
            
            {/* INFORMACIÓN DE LA TIENDA */}
            {renderStoreInfoSection()}
            
            {/* INFORMACIÓN DEL VENDEDOR */}
            {renderUserInfoSection()}
            
            {/* INFORMACIÓN ADICIONAL */}
            {renderAdditionalInfoSection()}
            
            {/* BOTONES DE ACCIÓN */}
            <div className="mt-4 pt-4 border-top">
                <Row className="g-3">
                    <Col xs={12} md={6}>
                        {postData.telephone && (
                            <Button 
                                variant="success" 
                                size="lg"
                                className="w-100 d-flex align-items-center justify-content-center gap-2 py-3"
                                onClick={() => window.location.href = `tel:${postData.telephone}`}
                            >
                                📞 {t('descripcion:callNow')}
                            </Button>
                        )}
                    </Col>
                    <Col xs={12} md={6}>
                        {auth.user && auth.user._id !== user?._id && (
                            <Button 
                                variant="primary" 
                                size="lg"
                                className="w-100 d-flex align-items-center justify-content-center gap-2 py-3"
                                onClick={handleStartChat}
                            >
                                💬 {t('descripcion:contactSeller')}
                            </Button>
                        )}
                    </Col>
                </Row>
            </div>
            
            {/* ESTILOS CSS */}
            <style jsx>{`
                .compact-line {
                    transition: background-color 0.2s;
                }
                .compact-line:hover {
                    background-color: #f8f9fa;
                }
                .badge {
                    font-size: 0.8rem;
                }
                .accordion-button:not(.collapsed) {
                    background-color: rgba(13, 110, 253, 0.1);
                }
            `}</style>
        </Container>
    );
};

export default DescriptionPost;