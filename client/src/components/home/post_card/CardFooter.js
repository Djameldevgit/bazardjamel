import React from 'react';
import { Card, ListGroup } from 'react-bootstrap';
import { FaComment, FaPhone } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MESS_TYPES } from '../../../redux/actions/messageAction';
import { GLOBALTYPES } from '../../../redux/actions/globalTypes';

const CardFooter = ({ post }) => {
    const { auth, message } = useSelector(state => state);
    const dispatch = useDispatch();
    const history = useHistory();

    // 🔥 COMBINAR DATOS DEL POST
    const getAllPostData = () => {
        if (!post) return {};
        
        const combinedData = { ...post };
        
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
        
        return combinedData;
    };

    const postData = getAllPostData();

    // 🏷️ GENERAR TÍTULO COMBINADO (FILA 1)
    const generateCombinedTitle = () => {
        // Elementos para construir el título
        const titleParts = [];

        // 1. Marca/Modelo (si existe)
        if (postData.brand || postData.marque) {
            titleParts.push(postData.brand || postData.marque);
        }

        // 2. Modelo (si existe)
        if (postData.model || postData.modele) {
            titleParts.push(postData.model || postData.modele);
        }

        // 3. Año (para vehículos)
        if (postData.annee) {
            titleParts.push(`(${postData.annee})`);
        }

        // 4. Tipo de propiedad (para inmuebles)
        if (postData.articleType && postData.subCategory) {
            const articleTypeMap = {
                'vente': 'Vente',
                'location': 'Location',
                'location_vacances': 'Location vacances'
            };
            
            const subCategoryMap = {
                'appartement': 'Appartement',
                'villa': 'Villa',
                'maison': 'Maison',
                'terrain': 'Terrain',
                'local': 'Local',
                'ferme': 'Ferme'
            };
            
            const type = articleTypeMap[postData.articleType] || postData.articleType;
            const category = subCategoryMap[postData.subCategory] || postData.subCategory;
            
            if (type && category) {
                titleParts.push(`${type} ${category}`);
            }
        }

        // 5. Tamaño/Talle (para ropa)
        if (postData.size || postData.taille) {
            titleParts.push(`Taille ${postData.size || postData.taille}`);
        }

        // 6. Estado/condición
        if (postData.etat || postData.condition) {
            const etatMap = {
                'neuf': 'Neuf',
                'occasion': 'Occasion',
                'tres_bon_etat': 'Très bon état',
                'bon_etat': 'Bon état',
                'etat_moyen': 'État moyen'
            };
            
            const etat = etatMap[postData.etat || postData.condition];
            if (etat) titleParts.push(etat);
        }

        // 7. Ubicación (wilaya)
        if (postData.wilaya) {
            titleParts.push(`à ${postData.wilaya}`);
        }

        // Si no hay partes, usar el título por defecto
        if (titleParts.length === 0) {
            return postData.title || 'Article sans titre';
        }

        // Combinar todas las partes
        return titleParts.join(' • ');
    };

    // 💰 FORMATO DE PRECIO (FILA 2)
    const formatPrice = () => {
        const price = postData.price || postData.prix || postData.loyer;
        if (!price && price !== 0) return null;

        const formattedPrice = new Intl.NumberFormat('fr-FR').format(price);
        const currency = postData.currency || 'DA';
        
        return `${formattedPrice} ${currency}`;
    };

    // 📞 FUNCIÓN DE LLAMADA
    const handleCallOwner = () => {
        const phoneNumber = postData.telefono || postData.contactPhone || 
                           postData.numeroTelephone || post.user?.phone;
        
        if (!phoneNumber) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: { error: 'Numéro de téléphone non disponible' } 
            });
            return;
        }
        
        window.location.href = `tel:${phoneNumber}`;
    };

    // 💬 FUNCIÓN DE CHAT
    const handleChatWithOwner = () => {
        if (!auth.user) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: { error: 'Veuillez vous connecter pour démarrer une conversation' } 
            });
            return;
        }

        if (!post.user || !post.user._id) {
            dispatch({ 
                type: GLOBALTYPES.ALERT, 
                payload: { error: 'Impossible de contacter ce vendeur' } 
            });
            return;
        }

        try {
            const existingConversation = message.data?.find(item => item._id === post.user._id);
            
            if (existingConversation) {
                history.push(`/message/${post.user._id}`);
                return;
            }

            dispatch({
                type: MESS_TYPES.ADD_USER,
                payload: { 
                    ...post.user, 
                    text: '', 
                    media: [],
                    postTitle: postData.title || 'Article',
                    postId: post._id
                }
            });

            history.push(`/message/${post.user._id}`);

        } catch (error) {
            console.error('Erreur lors du démarrage de la conversation:', error);
            dispatch({
                type: GLOBALTYPES.ALERT,
                payload: { error: 'Erreur lors du démarrage de la conversation' }
            });
        }
    };

    // 🔍 VERIFICAR DISPONIBILIDAD
    const canMakeCall = postData.telefono || postData.contactPhone || 
                      postData.numeroTelephone || post.user?.phone;
    const canChat = auth.user && post.user && post.user._id;

    return (
        <Card.Footer className="border-0 p-0 bg-white">
            <ListGroup variant="flush">
                
                {/* FILA 1: TÍTULO COMBINADO */}
                <ListGroup.Item className="border-0 px-1 py-1">
                    <h6 
                        className="mb-0 fw-bold text-truncate"
                        style={{ 
                            fontSize: '14px',
                            lineHeight: '1.3',
                            color: '#1f2937'
                        }}
                        title={generateCombinedTitle()}
                    >
                        {generateCombinedTitle()}
                    </h6>
                </ListGroup.Item>

                {/* FILA 2: PRECIO */}
                <ListGroup.Item className="border-0 px-1 py-1">
                    {formatPrice() ? (
                        <div className="d-flex justify-content-between align-items-center">
                            <span 
                                className="fw-bold"
                                style={{ 
                                    fontSize: '16px', 
                                    color: '#dc3545'
                                }}
                            >
                                {formatPrice()}
                            </span>
                            
                            {/* Indicador de negociable */}
                            {postData.negotiable && (
                                <span 
                                    className="badge bg-warning text-dark"
                                    style={{ fontSize: '10px', padding: '2px 5px' }}
                                >
                                    Négociable
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className="text-muted small">Prix non spécifié</div>
                    )}
                </ListGroup.Item>

                {/* FILA 3: ICONOS DE LLAMADA Y CHAT */}
                <ListGroup.Item className="border-0 px-1 py-1">
                    <div className="d-flex justify-content-between align-items-center">
                        {/* ICONO DE LLAMADA */}
                        <div
                            className={`d-flex align-items-center gap-1 ${
                                canMakeCall ? 'text-primary' : 'text-muted'
                            }`}
                            style={{
                                cursor: canMakeCall ? 'pointer' : 'not-allowed',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={canMakeCall ? handleCallOwner : undefined}
                            title={canMakeCall ? 'Appeler le vendeur' : 'Numéro non disponible'}
                            onMouseEnter={(e) => {
                                if (canMakeCall) {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (canMakeCall) {
                                    e.currentTarget.style.transform = 'scale(1)';
                                }
                            }}
                        >
                            <FaPhone size={14} />
                            <span style={{ fontSize: '12px' }}>Appeler</span>
                        </div>

                        {/* ICONO DE CHAT */}
                        <div
                            className={`d-flex align-items-center gap-1 ${
                                canChat ? 'text-success' : 'text-muted'
                            }`}
                            style={{
                                cursor: canChat ? 'pointer' : 'not-allowed',
                                transition: 'all 0.2s ease'
                            }}
                            onClick={canChat ? handleChatWithOwner : undefined}
                            title={canChat ? 'Envoyer un message' : 'Connectez-vous pour chatter'}
                            onMouseEnter={(e) => {
                                if (canChat) {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (canChat) {
                                    e.currentTarget.style.transform = 'scale(1)';
                                }
                            }}
                        >
                            <FaComment size={14} />
                            <span style={{ fontSize: '12px' }}>Chat</span>
                        </div>
                    </div>
                </ListGroup.Item>
            </ListGroup>
        </Card.Footer>
    );
};

export default CardFooter;