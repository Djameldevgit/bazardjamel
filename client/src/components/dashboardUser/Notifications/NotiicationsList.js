// src/components/DashboardUser/Notifications/NotificationsList.jsx
import React, { useState } from 'react';
import { 
    Card, 
    Row, 
    Col, 
    Badge, 
    Button, 
    Form,
    Dropdown,
    ListGroup
} from 'react-bootstrap';
import { 
    Bell,
    Check,
    Trash,
    Settings,
    Eye,
    Star,
    Heart,
    Message,
    Cart,
    CreditCard,
    ShieldCheck,
    Megaphone
} from 'react-bootstrap-icons';

const NotificationsList = () => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'like',
            title: 'Nouveau like',
            message: 'Ahmed a aimé votre annonce "iPhone 13 Pro Max"',
            timestamp: 'Il y a 5 minutes',
            read: false,
            important: true
        },
        {
            id: 2,
            type: 'message',
            title: 'Nouveau message',
            message: 'Sarah vous a envoyé un message concernant votre annonce',
            timestamp: 'Il y a 30 minutes',
            read: false,
            important: true
        },
        {
            id: 3,
            type: 'order',
            title: 'Nouvelle commande',
            message: 'Votre produit "Montre intelligente" a été commandé',
            timestamp: 'Il y a 2 heures',
            read: true,
            important: true
        },
        {
            id: 4,
            type: 'system',
            title: 'Mise à jour système',
            message: 'Nouvelle fonctionnalité disponible : statistiques avancées',
            timestamp: 'Il y a 1 jour',
            read: true,
            important: false
        }
    ]);

    const notificationTypes = [
        { id: 'all', label: 'Toutes', icon: Bell, color: 'primary' },
        { id: 'important', label: 'Importantes', icon: Star, color: 'warning' },
        { id: 'unread', label: 'Non lues', icon: Eye, color: 'danger' },
        { id: 'system', label: 'Système', icon: Settings, color: 'info' }
    ];

    const getIconByType = (type) => {
        switch(type) {
            case 'like': return <Heart size={20} className="text-danger" />;
            case 'message': return <Message size={20} className="text-info" />;
            case 'order': return <Cart size={20} className="text-success" />;
            case 'system': return <Settings size={20} className="text-primary" />;
            default: return <Bell size={20} />;
        }
    };

    const markAsRead = (id) => {
        setNotifications(notifications.map(notif => 
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(notif => ({ ...notif, read: true })));
    };

    const deleteNotification = (id) => {
        setNotifications(notifications.filter(notif => notif.id !== id));
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div>
            {/* En-tête */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="mb-1">Notifications</h4>
                            <p className="text-muted mb-0">
                                Restez informé de toutes vos activités
                            </p>
                        </div>
                        <div className="d-flex gap-2">
                            <Button 
                                variant="outline-primary" 
                                className="rounded-pill"
                                onClick={markAllAsRead}
                            >
                                <Check className="me-2" />
                                Tout marquer comme lu
                            </Button>
                            <Dropdown>
                                <Dropdown.Toggle variant="light" className="rounded-pill">
                                    <Settings className="me-2" />
                                    Paramètres
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item>Types de notifications</Dropdown.Item>
                                    <Dropdown.Item>Fréquence des alertes</Dropdown.Item>
                                    <Dropdown.Item>Notifications par email</Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item className="text-danger">
                                        Désactiver toutes les notifications
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>

                    {/* Compteurs */}
                    <Row className="g-3 mb-4">
                        {notificationTypes.map(type => {
                            const Icon = type.icon;
                            const count = type.id === 'all' ? notifications.length :
                                         type.id === 'important' ? notifications.filter(n => n.important).length :
                                         type.id === 'unread' ? unreadCount :
                                         notifications.filter(n => n.type === type.id).length;

                            return (
                                <Col key={type.id} xs={6} md={3}>
                                    <Card className="border">
                                        <Card.Body className="p-3 text-center">
                                            <div className={`bg-${type.color}-subtle rounded-circle p-3 d-inline-block mb-3`}>
                                                <Icon size={24} className={`text-${type.color}`} />
                                            </div>
                                            <h3 className="fw-bold mb-1">{count}</h3>
                                            <p className="text-muted mb-0">{type.label}</p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </Card.Body>
            </Card>

            {/* Liste des notifications */}
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <ListGroup variant="flush">
                        {notifications.map(notification => (
                            <ListGroup.Item 
                                key={notification.id}
                                className={`p-4 border-bottom ${!notification.read ? 'bg-light' : ''}`}
                            >
                                <div className="d-flex align-items-start">
                                    {/* Icône */}
                                    <div className="flex-shrink-0 me-3">
                                        <div className={`rounded-circle p-3 ${notification.important ? 'bg-warning bg-opacity-10' : 'bg-light'}`}>
                                            {getIconByType(notification.type)}
                                        </div>
                                    </div>

                                    {/* Contenu */}
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-start mb-2">
                                            <div>
                                                <h6 className="fw-bold mb-1">
                                                    {notification.title}
                                                    {!notification.read && (
                                                        <Badge bg="primary" pill className="ms-2">
                                                            Nouveau
                                                        </Badge>
                                                    )}
                                                    {notification.important && (
                                                        <Badge bg="warning" pill className="ms-2">
                                                            Important
                                                        </Badge>
                                                    )}
                                                </h6>
                                                <p className="mb-0">{notification.message}</p>
                                            </div>
                                            <small className="text-muted">{notification.timestamp}</small>
                                        </div>

                                        {/* Actions */}
                                        <div className="d-flex gap-2 mt-3">
                                            {!notification.read && (
                                                <Button 
                                                    variant="outline-success" 
                                                    size="sm"
                                                    onClick={() => markAsRead(notification.id)}
                                                >
                                                    <Check size={14} className="me-2" />
                                                    Marquer comme lu
                                                </Button>
                                            )}
                                            <Button 
                                                variant="outline-danger" 
                                                size="sm"
                                                onClick={() => deleteNotification(notification.id)}
                                            >
                                                <Trash size={14} className="me-2" />
                                                Supprimer
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>

                    {/* Message si vide */}
                    {notifications.length === 0 && (
                        <div className="text-center py-5">
                            <div className="mb-4">
                                <Bell size={64} className="text-muted opacity-50" />
                            </div>
                            <h5 className="mb-3">Aucune notification</h5>
                            <p className="text-muted mb-4">
                                Vous n'avez pas de nouvelles notifications pour le moment.
                            </p>
                        </div>
                    )}
                </Card.Body>
            </Card>

            {/* Préférences */}
            <Card className="border-0 shadow-sm mt-4">
                <Card.Body className="p-4">
                    <h5 className="mb-4">Préférences de notification</h5>
                    
                    <Row>
                        <Col md={6}>
                            <div className="mb-4">
                                <h6 className="mb-3">Types de notifications</h6>
                                {['Nouvelles commandes', 'Messages des clients', 'Likes et interactions', 'Mises à jour système'].map((type, idx) => (
                                    <Form.Check 
                                        key={idx}
                                        type="switch"
                                        id={`switch-${idx}`}
                                        label={type}
                                        defaultChecked={true}
                                        className="mb-3"
                                    />
                                ))}
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="mb-4">
                                <h6 className="mb-3">Fréquence des alertes</h6>
                                <Form.Select className="mb-3">
                                    <option>En temps réel</option>
                                    <option>Résumé quotidien</option>
                                    <option>Résumé hebdomadaire</option>
                                </Form.Select>
                                
                                <h6 className="mb-3">Notifications par email</h6>
                                <Form.Check 
                                    type="switch"
                                    id="email-notifications"
                                    label="Recevoir les notifications par email"
                                    defaultChecked={true}
                                />
                            </div>
                        </Col>
                    </Row>

                    <div className="d-flex justify-content-between">
                        <Button variant="outline-secondary">
                            Réinitialiser
                        </Button>
                        <Button variant="primary">
                            Sauvegarder les préférences
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </div>
    );
};

export default NotificationsList;