import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Container, Row, Col, Badge, Button, 
  Accordion, ListGroup, Card, Tab, Tabs,
  Tooltip, OverlayTrigger
} from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MESS_TYPES } from '../../../redux/actions/messageAction';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';

const DescriptionPost = ({ post }) => {
    const [readMore, setReadMore] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
    const [isTranslationsReady, setIsTranslationsReady] = useState(false);
    
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
            setIsTranslationsReady(true);
        };
        
        changeLanguage();
    }, [lang, i18n]);

    // 🔥 OBTENER TODOS LOS DATOS ORGANIZADOS POR CATEGORÍA
    const getOrganizedPostData = useMemo(() => {
        if (!post) return { categories: {}, userInfo: {} };
        
        const combinedData = { ...post };
        
        // Combinar todas las fuentes de datos
        const dataSources = [
            post.specificData,
            post.data,
            post.categorySpecificData
        ];
        
        dataSources.forEach(source => {
            if (source && typeof source === 'object') {
                Object.keys(source).forEach(key => {
                    if (source[key] !== undefined && source[key] !== null) {
                        if (combinedData[key] === undefined || combinedData[key] === null) {
                            combinedData[key] = source[key];
                        }
                    }
                });
            }
        });
        
        // 🎯 ORGANIZAR CAMPOS POR CATEGORÍA
        const categories = {
            // 🚗 INFORMACIÓN DEL VEHÍCULO/PRODUCTO
            vehicleProduct: {},
            
            // 📐 CARACTERÍSTICAS TÉCNICAS
            technical: {},
            
            // 📍 UBICACIÓN Y CONTACTO
            locationContact: {},
            
            // 🏷️ INFORMACIÓN DE VENTA
            saleInfo: {},
            
            // 👤 INFORMACIÓN DEL VENDEDOR
            sellerInfo: {},
            
            // 📊 INFORMACIÓN ADICIONAL
            additional: {}
        };
        
        // Mapeo de campos a categorías
        const fieldCategoryMap = {
            // 🚗 VEHÍCULO/PRODUCTO
            'marque': 'vehicleProduct',
            'brand': 'vehicleProduct',
            'modele': 'vehicleProduct',
            'model': 'vehicleProduct',
            'annee': 'vehicleProduct',
            'year': 'vehicleProduct',
            'etat': 'vehicleProduct',
            'condition': 'vehicleProduct',
            'couleur': 'vehicleProduct',
            'color': 'vehicleProduct',
            'taille': 'vehicleProduct',
            'size': 'vehicleProduct',
            'capacite': 'vehicleProduct',
            'capacity': 'vehicleProduct',
            'type': 'vehicleProduct',
            'typeVetement': 'vehicleProduct',
            'typeChaussure': 'vehicleProduct',
            'typeMachine': 'vehicleProduct',
            'typeAppareil': 'vehicleProduct',
            
            // 📐 TÉCNICO
            'kilometrage': 'technical',
            'mileage': 'technical',
            'carburant': 'technical',
            'fuel': 'technical',
            'boiteVitesse': 'technical',
            'gearbox': 'technical',
            'puissance': 'technical',
            'power': 'technical',
            'cylindree': 'technical',
            'engine': 'technical',
            'superficie': 'technical',
            'surface': 'technical',
            'nombrePieces': 'technical',
            'rooms': 'technical',
            'chambres': 'technical',
            'bedrooms': 'technical',
            'sallesBain': 'technical',
            'bathrooms': 'technical',
            'jardin': 'technical',
            'garden': 'technical',
            'piscine': 'technical',
            'pool': 'technical',
            'garage': 'technical',
            'parking': 'technical',
            'ascenseur': 'technical',
            'elevator': 'technical',
            'meuble': 'technical',
            'furnished': 'technical',
            'ram': 'technical',
            'processeur': 'technical',
            'processor': 'technical',
            'stockage': 'technical',
            'storage': 'technical',
            'resolution': 'technical',
            'smartTv': 'technical',
            'classeEnergetique': 'technical',
            'energyClass': 'technical',
            'vitesseEssorage': 'technical',
            'spinSpeed': 'technical',
            
            // 📍 UBICACIÓN
            'wilaya': 'locationContact',
            'commune': 'locationContact',
            'location': 'locationContact',
            'address': 'locationContact',
            'adresse': 'locationContact',
            'city': 'locationContact',
            'ville': 'locationContact',
            'telephone': 'locationContact',
            'phone': 'locationContact',
            'contactPhone': 'locationContact',
            'email': 'locationContact',
            'whatsapp': 'locationContact',
            
            // 🏷️ VENTA
            'price': 'saleInfo',
            'prix': 'saleInfo',
            'loyer': 'saleInfo',
            'rent': 'saleInfo',
            'currency': 'saleInfo',
            'negotiable': 'saleInfo',
            'negociable': 'saleInfo',
            'caution': 'saleInfo',
            'deposit': 'saleInfo',
            'chargesComprises': 'saleInfo',
            'utilitiesIncluded': 'saleInfo',
            'garantie': 'saleInfo',
            'warranty': 'saleInfo',
            'livraison': 'saleInfo',
            'delivery': 'saleInfo',
            'paiement': 'saleInfo',
            'payment': 'saleInfo',
            
            // 👤 VENDEDOR (separado para userInfo)
            // Estos campos van directamente al objeto userInfo
            
            // 📊 ADICIONAL
            'createdAt': 'additional',
            'updatedAt': 'additional',
            'views': 'additional',
            'likes': 'additional',
            'comments': 'additional',
            'isActive': 'additional',
            'isPromoted': 'additional',
            'isUrgent': 'additional'
        };
        
        // Organizar campos en categorías
        Object.keys(combinedData).forEach(key => {
            const value = combinedData[key];
            if (value === undefined || value === null || value === '') return;
            
            const category = fieldCategoryMap[key] || 'additional';
            
            if (category === 'sellerInfo') {
                // Información del vendedor va a userInfo
                if (!categories.sellerInfo[key]) {
                    categories.sellerInfo[key] = value;
                }
            } else {
                categories[category][key] = value;
            }
        });
        
        // Extraer información del usuario del post
        const userInfo = post.user ? {
            fullname: post.user.fullname,
            username: post.user.username,
            avatar: post.user.avatar,
            phone: post.user.phone,
            email: post.user.email,
            verified: post.user.verified,
            rating: post.user.rating,
            ratingCount: post.user.ratingCount,
            postCount: post.user.postCount,
            memberSince: post.user.createdAt,
            location: post.user.location,
            about: post.user.about,
            website: post.user.website,
            social: post.user.social
        } : {};
        
        return { 
            categories, 
            userInfo,
            rawData: combinedData,
            title: post.title || '',
            description: post.description || post.content || ''
        };
    }, [post]);

    const { categories, userInfo, rawData, title, description } = getOrganizedPostData;

    // 🏷️ GENERAR TÍTULO MEJORADO
    const generateTitleFromFields = () => {
        if (title) return title;
        
        const parts = [];
        
        // 1. Marca
        if (rawData.marque || rawData.brand) {
            parts.push(rawData.marque || rawData.brand);
        }
        
        // 2. Modelo
        if (rawData.model || rawData.modele) {
            parts.push(rawData.model || rawData.modele);
        }
        
        // 3. Año (para vehículos)
        if (rawData.annee) {
            parts.push(`(${rawData.annee})`);
        }
        
        // 4. Subcategoría traducida
        if (rawData.subCategory) {
            const translatedSubCat = t(`createpost:options.${rawData.subCategory}`, rawData.subCategory);
            parts.push(translatedSubCat);
        }
        
        // 5. Ubicación (solo si no hay muchos datos)
        if (parts.length < 3 && rawData.wilaya) {
            parts.push(rawData.wilaya);
        }
        
        return parts.length > 0 ? parts.join(' • ') : t('descripcion:noTitle');
    };

    // 🎨 CONFIGURACIÓN DE EMOJIS MEJORADA
    const getEmojiForField = (fieldName, value = '') => {
        const emojiConfig = {
            // 🚗 VEHÍCULO/PRODUCTO
            'marque': '🏷️', 'brand': '🏷️',
            'modele': '🚗', 'model': '🚗',
            'annee': '📅', 'year': '📅',
            'etat': '⭐', 'condition': '⭐',
            'couleur': '🎨', 'color': '🎨',
            'taille': '📐', 'size': '📐',
            'capacite': '💾', 'capacity': '💾',
            
            // 📐 TÉCNICO
            'kilometrage': '🛣️', 'mileage': '🛣️',
            'carburant': '⛽', 'fuel': '⛽',
            'boiteVitesse': '⚙️', 'gearbox': '⚙️',
            'puissance': '⚡', 'power': '⚡',
            'superficie': '📏', 'surface': '📏',
            'nombrePieces': '🏠', 'rooms': '🏠',
            'chambres': '🛏️', 'bedrooms': '🛏️',
            'sallesBain': '🚿', 'bathrooms': '🚿',
            'jardin': '🌳', 'garden': '🌳',
            'piscine': '🏊', 'pool': '🏊',
            'garage': '🚗', 'parking': '🅿️',
            'ascenseur': '🛗', 'elevator': '🛗',
            
            // 📍 UBICACIÓN
            'wilaya': '🏙️', 'commune': '🏘️',
            'location': '📍', 'address': '📍',
            'telephone': '📞', 'phone': '📞',
            'email': '📧',
            
            // 🏷️ VENTA
            'price': '💰', 'prix': '💰',
            'loyer': '💵', 'rent': '💵',
            'negotiable': '🤝', 'negociable': '🤝',
            'garantie': '🛡️', 'warranty': '🛡️',
            
            // 👤 USUARIO
            'fullname': '👤', 'username': '@',
            'rating': '⭐', 'verified': '✅',
            'memberSince': '🗓️', 'postCount': '📝',
            
            // 📊 ADICIONAL
            'createdAt': '📅', 'views': '👁️',
            'likes': '❤️', 'comments': '💬'
        };
        
        // Emojis por valor específico
        const valueEmojis = {
            'neuf': '🆕', 'occasion': '🔄',
            'essence': '⛽', 'diesel': '🛢️',
            'electrique': '🔋', 'hybride': '⚡⛽',
            'manuelle': '🔄', 'automatique': '🤖',
            'oui': '✅', 'non': '❌',
            'true': '✅', 'false': '❌'
        };
        
        return valueEmojis[value] || emojiConfig[fieldName] || '📋';
    };

    // 📱 COMPONENTE DE LÍNEA COMPACTA
    const CompactLine = ({ icon, label, value, badge = null, tooltip = '', className = "" }) => {
        const formatValue = (val) => {
            if (val === undefined || val === null || val === '') return '-';
            if (typeof val === 'boolean') return val ? t('descripcion:yes') : t('descripcion:no');
            if (Array.isArray(val)) return val.join(', ');
            if (typeof val === 'object') return Object.values(val).filter(v => v).join(', ');
            if (typeof val === 'number') {
                // Formatear números según tipo
                if (label.toLowerCase().includes('prix') || label.toLowerCase().includes('price')) {
                    return new Intl.NumberFormat('fr-FR').format(val) + ' DZD';
                }
                if (label.toLowerCase().includes('superficie') || label.toLowerCase().includes('surface')) {
                    return val + ' m²';
                }
                if (label.toLowerCase().includes('kilometrage') || label.toLowerCase().includes('mileage')) {
                    return new Intl.NumberFormat('fr-FR').format(val) + ' km';
                }
                return new Intl.NumberFormat('fr-FR').format(val);
            }
            return String(val);
        };

        const formattedValue = formatValue(value);
        const lineContent = (
            <div className={`d-flex align-items-center ${className}`} style={{ 
                minHeight: '44px',
                borderBottom: '1px solid #e5e7eb',
                padding: '8px 0'
            }}>
                {/* ICONO */}
                <div style={{ 
                    width: '32px',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                }}>
                    {icon}
                </div>
                
                {/* CONTENIDO */}
                <div style={{ 
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    minWidth: 0
                }}>
                    <div style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                        <span className="fw-semibold" style={{ 
                            fontSize: '0.9rem',
                            color: '#374151'
                        }}>
                            {label}
                        </span>
                    </div>
                    
                    <div style={{ 
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        minWidth: 0,
                        maxWidth: '60%'
                    }}>
                        <span className="text-dark" style={{ 
                            fontSize: '0.9rem',
                            textAlign: 'right',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            marginRight: badge ? '8px' : '0'
                        }}>
                            {formattedValue}
                        </span>
                        
                        {badge && (
                            <Badge bg={badge.color} style={{ 
                                fontSize: '0.65rem', 
                                padding: '2px 6px',
                                flexShrink: 0
                            }}>
                                {badge.text}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>
        );

        return tooltip ? (
            <OverlayTrigger
                placement="top"
                overlay={<Tooltip id={`tooltip-${label}`}>{tooltip}</Tooltip>}
            >
                {lineContent}
            </OverlayTrigger>
        ) : lineContent;
    };

    // 🚗 SECCIÓN: INFORMACIÓN DEL PRODUCTO/VEHÍCULO
    const renderVehicleProductSection = () => {
        const fields = categories.vehicleProduct;
        if (Object.keys(fields).length === 0) return null;

        return (
            <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                    <span className="text-primary me-2" style={{ fontSize: '24px' }}>🚗</span>
                    <h5 className="mb-0 fw-bold">{t('descripcion:productDetails')}</h5>
                </div>
                
                <Card className="border-0 shadow-sm">
                    <Card.Body className="p-3">
                        <Row className="g-0">
                            {Object.entries(fields).map(([key, value], index) => (
                                <Col key={key} xs={12} md={6}>
                                    <CompactLine
                                        icon={getEmojiForField(key, value)}
                                        label={t(`descripcion:${key}`, key)}
                                        value={value}
                                        className={index % 2 === 0 ? 'pe-md-2' : 'ps-md-2'}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Card.Body>
                </Card>
            </div>
        );
    };

    // 📐 SECCIÓN: CARACTERÍSTICAS TÉCNICAS
    const renderTechnicalSection = () => {
        const fields = categories.technical;
        if (Object.keys(fields).length === 0) return null;

        return (
            <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                    <span className="text-warning me-2" style={{ fontSize: '24px' }}>🔧</span>
                    <h5 className="mb-0 fw-bold">{t('descripcion:technicalSpecs')}</h5>
                </div>
                
                <Card className="border-0 shadow-sm">
                    <Card.Body className="p-3">
                        <Row className="g-0">
                            {Object.entries(fields).map(([key, value], index) => (
                                <Col key={key} xs={12} md={6}>
                                    <CompactLine
                                        icon={getEmojiForField(key, value)}
                                        label={t(`descripcion:${key}`, key)}
                                        value={value}
                                        className={index % 2 === 0 ? 'pe-md-2' : 'ps-md-2'}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </Card.Body>
                </Card>
            </div>
        );
    };

    // 📍 SECCIÓN: UBICACIÓN Y CONTACTO
    const renderLocationContactSection = () => {
        const fields = categories.locationContact;
        if (Object.keys(fields).length === 0) return null;

        return (
            <div className="mb-4">
                <div className="d-flex align-items-center justify-content-between mb-3">
                    <div className="d-flex align-items-center">
                        <span className="text-danger me-2" style={{ fontSize: '24px' }}>📍</span>
                        <h5 className="mb-0 fw-bold">{t('descripcion:locationContact')}</h5>
                    </div>
                    
                    {fields.telephone && (
                        <Button 
                            variant="outline-success" 
                            size="sm"
                            className="d-flex align-items-center gap-1"
                            onClick={() => window.location.href = `tel:${fields.telephone}`}
                        >
                            📞 {t('descripcion:callNow')}
                        </Button>
                    )}
                </div>
                
                <Card className="border-0 shadow-sm">
                    <Card.Body className="p-3">
                        <Row className="g-0">
                            {Object.entries(fields).map(([key, value], index) => (
                                <Col key={key} xs={12}>
                                    <CompactLine
                                        icon={getEmojiForField(key, value)}
                                        label={t(`descripcion:${key}`, key)}
                                        value={key.includes('telephone') || key.includes('phone') ? 
                                            `+${value}` : value}
                                        className="border-0"
                                    />
                                </Col>
                            ))}
                        </Row>
                        
                        {fields.location && (
                            <div className="mt-3">
                                <Button 
                                    variant="outline-primary" 
                                    size="sm"
                                    className="d-flex align-items-center gap-1"
                                    onClick={() => {
                                        const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fields.location)}`;
                                        window.open(mapsUrl, '_blank');
                                    }}
                                >
                                    🗺️ {t('descripcion:viewOnMap')}
                                </Button>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </div>
        );
    };

    // 🏷️ SECCIÓN: INFORMACIÓN DE VENTA
    const renderSaleInfoSection = () => {
        const fields = categories.saleInfo;
        if (Object.keys(fields).length === 0) return null;

        return (
            <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                    <span className="text-success me-2" style={{ fontSize: '24px' }}>💰</span>
                    <h5 className="mb-0 fw-bold">{t('descripcion:saleInfo')}</h5>
                </div>
                
                <Card className="border-0 shadow-sm">
                    <Card.Body className="p-3">
                        <Row className="g-0">
                            {Object.entries(fields).map(([key, value], index) => (
                                <Col key={key} xs={12} md={6}>
                                    <CompactLine
                                        icon={getEmojiForField(key, value)}
                                        label={t(`descripcion:${key}`, key)}
                                        value={value}
                                        badge={key === 'negotiable' && value ? {
                                            color: 'warning',
                                            text: t('descripcion:negotiable')
                                        } : null}
                                        className={index % 2 === 0 ? 'pe-md-2' : 'ps-md-2'}
                                    />
                                </Col>
                            ))}
                        </Row>
                        
                        {fields.negotiable && (
                            <div className="mt-3 text-center">
                                <Badge bg="warning" className="py-2 px-3">
                                    🤝 {t('descripcion:priceNegotiable')}
                                </Badge>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </div>
        );
    };

    // 👤 SECCIÓN COMPLETA DE INFORMACIÓN DEL USUARIO
    const renderUserInfoSection = () => {
        if (!userInfo || Object.keys(userInfo).length === 0) return null;

        return (
            <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                    <span className="text-info me-2" style={{ fontSize: '24px' }}>👤</span>
                    <h5 className="mb-0 fw-bold">{t('descripcion:sellerInfo')}</h5>
                    {userInfo.verified && (
                        <Badge bg="success" className="ms-2 py-1 px-2">
                            ✅ {t('descripcion:verifiedSeller')}
                        </Badge>
                    )}
                </div>
                
                <Card className="border-0 shadow-sm">
                    <Card.Body>
                        {/* HEADER DEL USUARIO */}
                        <div className="d-flex align-items-start gap-3 mb-3">
                            {userInfo.avatar && (
                                <div 
                                    className="rounded-circle overflow-hidden"
                                    style={{ width: '80px', height: '80px', flexShrink: 0 }}
                                >
                                    <img 
                                        src={userInfo.avatar} 
                                        alt={userInfo.fullname}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                            
                            <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <h5 className="mb-1 fw-bold">{userInfo.fullname || userInfo.username}</h5>
                                        <div className="text-muted small d-flex align-items-center gap-2">
                                            <span>@{userInfo.username}</span>
                                            {userInfo.memberSince && (
                                                <>
                                                    <span>•</span>
                                                    <span className="d-flex align-items-center gap-1">
                                                        🗓️ {new Date(userInfo.memberSince).getFullYear()}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {auth.user && auth.user._id !== post.user?._id && (
                                        <Button 
                                            variant="primary" 
                                            size="sm"
                                            className="d-flex align-items-center gap-1"
                                            onClick={handleStartChat}
                                        >
                                            💬 {t('descripcion:chat')}
                                        </Button>
                                    )}
                                </div>
                                
                                {/* RATING Y ESTADÍSTICAS */}
                                <div className="d-flex align-items-center gap-3 mb-2">
                                    {userInfo.rating && (
                                        <div className="d-flex align-items-center gap-1">
                                            <span className="text-warning fw-bold">⭐ {userInfo.rating.toFixed(1)}</span>
                                            <span className="text-muted small">
                                                ({userInfo.ratingCount || 0} {t('descripcion:ratings').toLowerCase()})
                                            </span>
                                        </div>
                                    )}
                                    
                                    {userInfo.postCount && (
                                        <div className="d-flex align-items-center gap-1">
                                            <span className="text-primary">📝</span>
                                            <span className="fw-bold">{userInfo.postCount}</span>
                                            <span className="text-muted small">{t('descripcion:posts')}</span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* ABOUT */}
                                {userInfo.about && (
                                    <div className="mt-2">
                                        <p className="mb-0 small text-muted" style={{ lineHeight: '1.4' }}>
                                            {userInfo.about}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        {/* INFORMACIÓN DE CONTACTO */}
                        <div className="border-top pt-3">
                            <h6 className="mb-2 fw-bold">{t('descripcion:contactInfo')}</h6>
                            <Row className="g-2">
                                {userInfo.phone && (
                                    <Col xs={12} md={6}>
                                        <CompactLine
                                            icon="📞"
                                            label={t('descripcion:phone')}
                                            value={userInfo.phone}
                                            badge={{
                                                color: 'success',
                                                text: t('descripcion:clickToCall')
                                            }}
                                            tooltip={t('descripcion:clickToCallTooltip')}
                                            className="border-0"
                                        />
                                    </Col>
                                )}
                                
                                {userInfo.email && (
                                    <Col xs={12} md={6}>
                                        <CompactLine
                                            icon="📧"
                                            label={t('descripcion:email')}
                                            value={userInfo.email}
                                            className="border-0"
                                        />
                                    </Col>
                                )}
                                
                                {userInfo.location && (
                                    <Col xs={12}>
                                        <CompactLine
                                            icon="📍"
                                            label={t('descripcion:userLocation')}
                                            value={userInfo.location}
                                            className="border-0"
                                        />
                                    </Col>
                                )}
                            </Row>
                            
                            {/* REDES SOCIALES */}
                            {userInfo.social && Object.keys(userInfo.social).length > 0 && (
                                <div className="mt-3">
                                    <h6 className="mb-2 fw-bold">{t('descripcion:socialNetworks')}</h6>
                                    <div className="d-flex gap-2">
                                        {userInfo.social.facebook && (
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm"
                                                className="d-flex align-items-center gap-1"
                                                href={userInfo.social.facebook}
                                                target="_blank"
                                            >
                                                👤 Facebook
                                            </Button>
                                        )}
                                        
                                        {userInfo.social.instagram && (
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                className="d-flex align-items-center gap-1"
                                                href={userInfo.social.instagram}
                                                target="_blank"
                                            >
                                                📸 Instagram
                                            </Button>
                                        )}
                                        
                                        {userInfo.website && (
                                            <Button 
                                                variant="outline-info" 
                                                size="sm"
                                                className="d-flex align-items-center gap-1"
                                                href={userInfo.website}
                                                target="_blank"
                                            >
                                                🌐 Website
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </div>
        );
    };

    // 📊 SECCIÓN: INFORMACIÓN ADICIONAL
    const renderAdditionalInfoSection = () => {
        const fields = categories.additional;
        if (Object.keys(fields).length === 0) return null;

        return (
            <Accordion className="mb-4">
                <Accordion.Item eventKey="0">
                    <Accordion.Header className="py-2">
                        <div className="d-flex align-items-center gap-2">
                            <span className="text-secondary">📊</span>
                            <span className="fw-semibold">{t('descripcion:additionalInfo')}</span>
                        </div>
                    </Accordion.Header>
                    <Accordion.Body className="p-2">
                        <ListGroup variant="flush">
                            {fields.createdAt && (
                                <ListGroup.Item className="d-flex justify-content-between align-items-center py-2">
                                    <div className="d-flex align-items-center gap-2">
                                        <span>📅</span>
                                        <span className="small">{t('descripcion:publishedOn')}</span>
                                    </div>
                                    <Badge bg="light" text="dark" className="small">
                                        {new Date(fields.createdAt).toLocaleDateString(lang)}
                                    </Badge>
                                </ListGroup.Item>
                            )}
                            
                            {fields.views && (
                                <ListGroup.Item className="d-flex justify-content-between align-items-center py-2">
                                    <div className="d-flex align-items-center gap-2">
                                        <span>👁️</span>
                                        <span className="small">{t('descripcion:views')}</span>
                                    </div>
                                    <Badge bg="info" className="small">
                                        {fields.views.toLocaleString()}
                                    </Badge>
                                </ListGroup.Item>
                            )}
                            
                            {fields.likes && Array.isArray(fields.likes) && fields.likes.length > 0 && (
                                <ListGroup.Item className="d-flex justify-content-between align-items-center py-2">
                                    <div className="d-flex align-items-center gap-2">
                                        <span>❤️</span>
                                        <span className="small">{t('descripcion:likes')}</span>
                                    </div>
                                    <Badge bg="danger" className="small">
                                        {fields.likes.length}
                                    </Badge>
                                </ListGroup.Item>
                            )}
                            
                            {fields.isPromoted && (
                                <ListGroup.Item className="d-flex align-items-center gap-2 py-2">
                                    <span className="text-warning">🚀</span>
                                    <span className="small">{t('descripcion:promotedAd')}</span>
                                </ListGroup.Item>
                            )}
                            
                            {fields.isUrgent && (
                                <ListGroup.Item className="d-flex align-items-center gap-2 py-2">
                                    <span className="text-danger">⚠️</span>
                                    <span className="small">{t('descripcion:urgentAd')}</span>
                                </ListGroup.Item>
                            )}
                        </ListGroup>
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
        
        const existingConversation = message.data?.find(item => item._id === post.user._id);
        
        dispatch({
            type: MESS_TYPES.ADD_USER,
            payload: { 
                ...post.user, 
                text: '', 
                media: [],
                postTitle: generateTitleFromFields(),
                postId: post._id,
                postPrice: rawData.price,
                postImage: post.images?.[0]?.url
            }
        });
        
        history.push(`/message/${post.user._id}`);
    };

    // 📝 SECCIÓN DE DESCRIPCIÓN
    const renderDescriptionSection = () => {
        if (!description) return null;

        return (
            <div className="mb-4">
                <div className="d-flex align-items-center mb-3">
                    <span className="text-primary me-2" style={{ fontSize: '24px' }}>📄</span>
                    <h5 className="mb-0 fw-bold">{t('descripcion:description')}</h5>
                </div>
                
                <Card className="border-0 shadow-sm">
                    <Card.Body>
                        <p className="mb-0" style={{ 
                            lineHeight: '1.6', 
                            textAlign: isRTL ? 'right' : 'left',
                            whiteSpace: 'pre-line'
                        }}>
                            {readMore ? description : `${description.substring(0, 200)}...`}
                        </p>
                        
                        {description.length > 200 && (
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

    // 🎯 HEADER PRINCIPAL
    const renderHeader = () => {
        const generatedTitle = generateTitleFromFields();
        const categoryEmoji = getEmojiForField(rawData.categorie);
        const price = rawData.price || rawData.prix;

        return (
            <div className="mb-4">
                <div className="d-flex align-items-start justify-content-between gap-3 mb-3">
                    <div className="d-flex align-items-start gap-2 flex-grow-1">
                        <div className="text-primary" style={{ fontSize: '40px' }}>
                            {categoryEmoji}
                        </div>
                        <div className="flex-grow-1">
                            <h1 className="h3 fw-bold mb-2" style={{ lineHeight: '1.3' }}>
                                {generatedTitle}
                            </h1>
                            <div className="d-flex align-items-center gap-2 flex-wrap">
                                <Badge bg="primary" className="py-1 px-2">
                                    {t(`descripcion:${rawData.categorie}`, rawData.categorie)}
                                </Badge>
                                {rawData.subCategory && (
                                    <Badge bg="secondary" className="py-1 px-2">
                                        {t(`createpost:options.${rawData.subCategory}`, rawData.subCategory)}
                                    </Badge>
                                )}
                                {rawData.articleType && (
                                    <Badge bg="info" className="py-1 px-2">
                                        {rawData.articleType}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {price && (
                        <div className="text-end">
                            <div className="h3 fw-bold text-success mb-1">
                                {new Intl.NumberFormat('fr-FR').format(price)} DZD
                            </div>
                            {rawData.negotiable && (
                                <Badge bg="warning" className="py-1 px-2">
                                    🤝 {t('descripcion:negotiable')}
                                </Badge>
                            )}
                        </div>
                    )}
                </div>
                
                {/* TABS DE NAVEGACIÓN */}
                <Tabs
                    activeKey={activeTab}
                    onSelect={(k) => setActiveTab(k)}
                    className="mb-3 border-bottom-0"
                    fill
                >
                    <Tab eventKey="details" title={
                        <span className="d-flex align-items-center gap-1">
                            🚗 {t('descripcion:details')}
                        </span>
                    } />
                    <Tab eventKey="location" title={
                        <span className="d-flex align-items-center gap-1">
                            📍 {t('descripcion:location')}
                        </span>
                    } />
                    <Tab eventKey="seller" title={
                        <span className="d-flex align-items-center gap-1">
                            👤 {t('descripcion:seller')}
                        </span>
                    } />
                </Tabs>
            </div>
        );
    };

    // 📱 CONTENIDO POR TAB
    const renderTabContent = () => {
        switch(activeTab) {
            case 'details':
                return (
                    <>
                        {renderDescriptionSection()}
                        {renderVehicleProductSection()}
                        {renderTechnicalSection()}
                        {renderSaleInfoSection()}
                        {renderAdditionalInfoSection()}
                    </>
                );
                
            case 'location':
                return renderLocationContactSection();
                
            case 'seller':
                return renderUserInfoSection();
                
            default:
                return null;
        }
    };

    if (!isTranslationsReady) {
        return (
            <Container className="py-4 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">{t('descripcion:loading')}</p>
            </Container>
        );
    }

    return (
        <Container className="py-4" style={{ 
            direction: isRTL ? 'rtl' : 'ltr', 
            maxWidth: '1000px' 
        }}>
            {/* HEADER PRINCIPAL */}
            {renderHeader()}
            
            {/* CONTENIDO POR TAB */}
            {renderTabContent()}
            
            {/* BOTONES DE ACCIÓN */}
            <div className="mt-4 pt-4 border-top">
                <div className="d-flex gap-2 justify-content-center">
                    {categories.locationContact.telephone && (
                        <Button 
                            variant="success" 
                            size="lg"
                            className="d-flex align-items-center gap-2 px-4"
                            onClick={() => window.location.href = `tel:${categories.locationContact.telephone}`}
                        >
                            📞 {t('descripcion:callNow')}
                        </Button>
                    )}
                    
                    {auth.user && auth.user._id !== post.user?._id && (
                        <Button 
                            variant="primary" 
                            size="lg"
                            className="d-flex align-items-center gap-2 px-4"
                            onClick={handleStartChat}
                        >
                            💬 {t('descripcion:startChat')}
                        </Button>
                    )}
                    
                    <Button 
                        variant="outline-secondary" 
                        size="lg"
                        className="d-flex align-items-center gap-2 px-4"
                        onClick={() => window.history.back()}
                    >
                        ↩️ {t('descripcion:goBack')}
                    </Button>
                </div>
            </div>
        </Container>
    );
};

export default DescriptionPost;