// src/components/DashboardUser/Conversations/ChatList.jsx
import React, { useState } from 'react';
import { 
    Card, 
    Row, 
    Col, 
    Badge, 
    Button, 
    Form,
    InputGroup,
    Tab,
    Nav
} from 'react-bootstrap';
import { 
    Chat,
    Search,
    Filter,
    Plus,
    CheckCircle,
    Clock,
    Star,
    StarFill,
    Pin,
    PersonCircle,
    Check2Circle
} from 'react-bootstrap-icons';

const ChatList = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const conversations = [
        {
            id: 1,
            user: {
                name: 'Ahmed B.',
                avatar: 'AB',
                verified: true,
                online: true
            },
            lastMessage: 'Bonjour, est-ce que le produit est encore disponible ?',
            timestamp: '10:24',
            unread: 3,
            pinned: true,
            category: 'achat'
        },
        {
            id: 2,
            user: {
                name: 'Sarah M.',
                avatar: 'SM',
                verified: true,
                online: false
            },
            lastMessage: 'Je suis intéressé par votre annonce, pouvez-vous m\'envoyer plus de photos ?',
            timestamp: 'Hier',
            unread: 0,
            pinned: false,
            category: 'information'
        },
        {
            id: 3,
            user: {
                name: 'Support Technique',
                avatar: 'ST',
                verified: true,
                online: true
            },
            lastMessage: 'Votre problème a été résolu. N\'hésitez pas à nous recontacter si besoin.',
            timestamp: '09:15',
            unread: 0,
            pinned: true,
            category: 'support'
        },
        {
            id: 4,
            user: {
                name: 'Karim L.',
                avatar: 'KL',
                verified: false,
                online: false
            },
            lastMessage: 'Acceptez-vous la livraison à Oran ?',
            timestamp: '15 Jan',
            unread: 1,
            pinned: false,
            category: 'livraison'
        }
    ];

    const tabs = [
        { id: 'all', label: 'Toutes', count: 12 },
        { id: 'unread', label: 'Non lues', count: 3 },
        { id: 'pinned', label: 'Épinglées', count: 2 },
        { id: 'support', label: 'Support', count: 1 }
    ];

    const categories = [
        { id: 'achat', label: 'Achat', color: 'success', count: 5 },
        { id: 'information', label: 'Information', color: 'info', count: 3 },
        { id: 'livraison', label: 'Livraison', color: 'warning', count: 2 },
        { id: 'support', label: 'Support', color: 'danger', count: 1 },
        { id: 'autre', label: 'Autre', color: 'secondary', count: 1 }
    ];

    const filteredConversations = conversations.filter(conv => {
        if (activeTab === 'unread' && conv.unread === 0) return false;
        if (activeTab === 'pinned' && !conv.pinned) return false;
        if (activeTab === 'support' && conv.category !== 'support') return false;
        if (searchQuery && !conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    return (
        <div>
            <Row className="g-4">
                {/* Liste des conversations */}
                <Col lg={4}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="p-0">
                            {/* En-tête */}
                            <div className="p-4 border-bottom">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="mb-0">Messages</h4>
                                    <Badge bg="primary" className="px-3 py-2">
                                        <Chat size={16} className="me-2" />
                                        12 conversations
                                    </Badge>
                                </div>

                                {/* Recherche */}
                                <InputGroup className="mb-3">
                                    <InputGroup.Text className="bg-light border-end-0">
                                        <Search />
                                    </InputGroup.Text>
                                    <Form.Control
                                        placeholder="Rechercher une conversation..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="border-start-0"
                                    />
                                    <Button variant="outline-secondary">
                                        <Filter />
                                    </Button>
                                </InputGroup>

                                {/* Tabs */}
                                <Nav variant="pills" className="flex-nowrap mb-3">
                                    {tabs.map(tab => (
                                        <Nav.Item key={tab.id} className="flex-grow-1">
                                            <Nav.Link
                                                active={activeTab === tab.id}
                                                onClick={() => setActiveTab(tab.id)}
                                                className="text-center py-2"
                                            >
                                                {tab.label}
                                                {tab.count > 0 && (
                                                    <Badge pill bg="light" text="dark" className="ms-1">
                                                        {tab.count}
                                                    </Badge>
                                                )}
                                            </Nav.Link>
                                        </Nav.Item>
                                    ))}
                                </Nav>
                            </div>

                            {/* Catégories */}
                            <div className="p-3 border-bottom bg-light">
                                <div className="d-flex flex-wrap gap-2">
                                    {categories.map(cat => (
                                        <Badge 
                                            key={cat.id}
                                            bg={`${cat.color}-subtle`}
                                            text={cat.color}
                                            className="px-3 py-2 rounded-pill"
                                            style={{ cursor: 'pointer' }}
                                        >
                                            {cat.label}
                                            <span className="ms-1">{cat.count}</span>
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Liste des conversations */}
                            <div className="messages-list" style={{ height: '500px', overflowY: 'auto' }}>
                                {filteredConversations.map(conv => (
                                    <div 
                                        key={conv.id}
                                        className={`p-3 border-bottom hover-bg ${conv.unread > 0 ? 'bg-light' : ''}`}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="d-flex">
                                            {/* Avatar */}
                                            <div className="position-relative me-3">
                                                <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center"
                                                    style={{ width: '50px', height: '50px' }}>
                                                    <span className="text-white fw-bold">{conv.user.avatar}</span>
                                                </div>
                                                {conv.user.online && (
                                                    <div className="position-absolute bottom-0 end-0 bg-success rounded-circle border border-white"
                                                        style={{ width: '12px', height: '12px' }}></div>
                                                )}
                                            </div>

                                            {/* Contenu */}
                                            <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between align-items-start mb-1">
                                                    <div className="d-flex align-items-center">
                                                        <h6 className="fw-bold mb-0 me-2">{conv.user.name}</h6>
                                                        {conv.user.verified && (
                                                            <CheckCircle size={14} className="text-success" />
                                                        )}
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <small className="text-muted me-2">{conv.timestamp}</small>
                                                        {conv.pinned && (
                                                            <Pin size={12} className="text-warning" />
                                                        )}
                                                    </div>
                                                </div>

                                                <p className="text-muted small mb-2 text-truncate">
                                                    {conv.lastMessage}
                                                </p>

                                                <div className="d-flex justify-content-between align-items-center">
                                                    <Badge bg="secondary" className="px-2 py-1">
                                                        {conv.category}
                                                    </Badge>
                                                    {conv.unread > 0 && (
                                                        <Badge bg="primary" pill>
                                                            {conv.unread}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Bouton nouveau message */}
                            <div className="p-3 border-top">
                                <Button variant="primary" className="w-100 rounded-pill py-2">
                                    <Plus size={18} className="me-2" />
                                    Nouveau message
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Fenêtre de chat (placeholder) */}
                <Col lg={8}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="p-0 d-flex flex-column">
                            {/* En-tête du chat */}
                            <div className="p-4 border-bottom">
                                <div className="d-flex align-items-center">
                                    <div className="bg-primary rounded-circle p-2 me-3">
                                        <PersonCircle size={32} className="text-white" />
                                    </div>
                                    <div>
                                        <h5 className="mb-1">Sélectionnez une conversation</h5>
                                        <p className="text-muted mb-0">
                                            Cliquez sur une conversation pour commencer à discuter
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Zone de message vide */}
                            <div className="flex-grow-1 d-flex flex-column align-items-center justify-content-center p-5">
                                <div className="mb-4">
                                    <Chat size={64} className="text-muted opacity-50" />
                                </div>
                                <h4 className="mb-3">Aucune conversation sélectionnée</h4>
                                <p className="text-muted text-center mb-4">
                                    Sélectionnez une conversation dans la liste pour afficher les messages
                                    ou commencez une nouvelle conversation.
                                </p>
                                <Button variant="outline-primary" className="rounded-pill px-4">
                                    <Plus className="me-2" />
                                    Démarrer une nouvelle conversation
                                </Button>
                            </div>

                            {/* Zone de saisie (désactivée) */}
                            <div className="p-3 border-top bg-light">
                                <InputGroup>
                                    <Form.Control 
                                        placeholder="Sélectionnez d'abord une conversation..." 
                                        disabled
                                    />
                                    <Button variant="primary" disabled>
                                        Envoyer
                                    </Button>
                                </InputGroup>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Statistiques */}
            <Row className="g-4 mt-4">
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center">
                                <div className="bg-success bg-opacity-10 rounded-3 p-3 me-3">
                                    <Check2Circle size={24} className="text-success" />
                                </div>
                                <div>
                                    <h3 className="fw-bold mb-1">89%</h3>
                                    <p className="text-muted mb-0">Taux de réponse</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center">
                                <div className="bg-warning bg-opacity-10 rounded-3 p-3 me-3">
                                    <Clock size={24} className="text-warning" />
                                </div>
                                <div>
                                    <h3 className="fw-bold mb-1">15 min</h3>
                                    <p className="text-muted mb-0">Temps moyen de réponse</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="p-4">
                            <div className="d-flex align-items-center">
                                <div className="bg-info bg-opacity-10 rounded-3 p-3 me-3">
                                    <Star size={24} className="text-info" />
                                </div>
                                <div>
                                    <h3 className="fw-bold mb-1">4.7</h3>
                                    <p className="text-muted mb-0">Satisfaction client</p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ChatList;