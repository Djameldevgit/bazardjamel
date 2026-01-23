// src/components/DashboardUser/Annonces/AnnoncesList.jsx
import React, { useState } from 'react';
import { 
    Card, 
    Row, 
    Col, 
    Badge, 
    Button, 
    Dropdown, 
    Table,
    Pagination
} from 'react-bootstrap';
import { 
    Eye, 
    Heart, 
    Chat, 
    Pencil, 
    Trash, 
    Clock,
    CheckCircle,
    XCircle,
    ThreeDotsVertical,
    Plus
} from 'react-bootstrap-icons';

const AnnoncesList = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    
    // Données de ejemplo
    const annonces = [
        {
            id: 1,
            title: 'iPhone 13 Pro Max 256GB',
            price: '120,000 DA',
            status: 'publié',
            statusColor: 'success',
            views: 245,
            likes: 34,
            messages: 12,
            date: '2024-01-15',
            image: 'https://via.placeholder.com/100x100/007bff/ffffff?text=IP'
        },
        {
            id: 2,
            title: 'Appartement F3 centre ville',
            price: '45,000,000 DA',
            status: 'en attente',
            statusColor: 'warning',
            views: 89,
            likes: 12,
            messages: 3,
            date: '2024-01-14',
            image: 'https://via.placeholder.com/100x100/28a745/ffffff?text=AP'
        },
        {
            id: 3,
            title: 'Voiture Renault Clio 2020',
            price: '2,800,000 DA',
            status: 'rejeté',
            statusColor: 'danger',
            views: 156,
            likes: 23,
            messages: 8,
            date: '2024-01-13',
            image: 'https://via.placeholder.com/100x100/dc3545/ffffff?text=VO'
        },
        {
            id: 4,
            title: 'Service de plomberie',
            price: 'À discuter',
            status: 'publié',
            statusColor: 'success',
            views: 78,
            likes: 9,
            messages: 5,
            date: '2024-01-12',
            image: 'https://via.placeholder.com/100x100/ffc107/ffffff?text=SE'
        }
    ];

    const filters = [
        { id: 'all', label: 'Toutes', count: 12 },
        { id: 'published', label: 'Publiées', count: 8 },
        { id: 'pending', label: 'En attente', count: 3 },
        { id: 'rejected', label: 'Rejetées', count: 1 },
        { id: 'expired', label: 'Expirées', count: 0 }
    ];

    const getStatusIcon = (status) => {
        switch(status) {
            case 'publié': return <CheckCircle size={16} className="text-success" />;
            case 'en attente': return <Clock size={16} className="text-warning" />;
            case 'rejeté': return <XCircle size={16} className="text-danger" />;
            default: return <Clock size={16} />;
        }
    };

    return (
        <div>
            {/* En-tête avec filtres */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="mb-1">Mes Annonces</h4>
                            <p className="text-muted mb-0">
                                Gérez et suivez toutes vos publications
                            </p>
                        </div>
                        <Button variant="primary" className="rounded-pill px-4">
                            <Plus size={18} className="me-2" />
                            Publier une annonce
                        </Button>
                    </div>

                    {/* Filtres */}
                    <div className="d-flex flex-wrap gap-2 mb-4">
                        {filters.map(filter => (
                            <button
                                key={filter.id}
                                className={`btn ${activeFilter === filter.id ? 'btn-primary' : 'btn-outline-primary'} rounded-pill px-3`}
                                onClick={() => setActiveFilter(filter.id)}
                            >
                                {filter.label}
                                {filter.count > 0 && (
                                    <Badge bg={activeFilter === filter.id ? 'light' : 'primary'} className="ms-2">
                                        {filter.count}
                                    </Badge>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Barre de recherche et actions */}
                    <div className="row g-3 mb-4">
                        <div className="col-md-6">
                            <div className="input-group">
                                <span className="input-group-text bg-light border-end-0">
                                    <i className="fas fa-search"></i>
                                </span>
                                <input 
                                    type="text" 
                                    className="form-control border-start-0"
                                    placeholder="Rechercher une annonce..."
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <select className="form-select">
                                <option>Trier par date</option>
                                <option>Trier par prix</option>
                                <option>Trier par vues</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <Button variant="outline-secondary" className="w-100">
                                <i className="fas fa-filter me-2"></i>
                                Plus de filtres
                            </Button>
                        </div>
                    </div>
                </Card.Body>
            </Card>

            {/* Liste des annonces */}
            <Row className="g-4">
                {annonces.map(annonce => (
                    <Col key={annonce.id} xs={12} lg={6} xl={4}>
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Body className="p-0">
                                {/* En-tête de la carte */}
                                <div className="p-3 border-bottom">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <img 
                                                src={annonce.image}
                                                alt={annonce.title}
                                                className="rounded-3 me-3"
                                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                            />
                                            <div>
                                                <h6 className="mb-1 fw-bold">{annonce.title}</h6>
                                                <div className="d-flex align-items-center">
                                                    <Badge bg={annonce.statusColor} className="me-2">
                                                        {getStatusIcon(annonce.status)}
                                                        <span className="ms-1">{annonce.status}</span>
                                                    </Badge>
                                                    <small className="text-muted">
                                                        {new Date(annonce.date).toLocaleDateString('fr-FR')}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <Dropdown>
                                            <Dropdown.Toggle variant="light" className="border-0 p-1">
                                                <ThreeDotsVertical />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item>
                                                    <Pencil size={16} className="me-2" />
                                                    Modifier
                                                </Dropdown.Item>
                                                <Dropdown.Item>
                                                    <Eye size={16} className="me-2" />
                                                    Prévisualiser
                                                </Dropdown.Item>
                                                <Dropdown.Item className="text-danger">
                                                    <Trash size={16} className="me-2" />
                                                    Supprimer
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>

                                {/* Contenu */}
                                <div className="p-3">
                                    <div className="mb-3">
                                        <h4 className="text-success fw-bold">{annonce.price}</h4>
                                    </div>
                                    
                                    {/* Statistiques */}
                                    <div className="d-flex justify-content-between mb-3">
                                        <div className="text-center">
                                            <div className="d-flex align-items-center justify-content-center mb-1">
                                                <Eye size={16} className="text-primary me-1" />
                                                <span className="fw-bold">{annonce.views}</span>
                                            </div>
                                            <small className="text-muted">Vues</small>
                                        </div>
                                        <div className="text-center">
                                            <div className="d-flex align-items-center justify-content-center mb-1">
                                                <Heart size={16} className="text-danger me-1" />
                                                <span className="fw-bold">{annonce.likes}</span>
                                            </div>
                                            <small className="text-muted">Likes</small>
                                        </div>
                                        <div className="text-center">
                                            <div className="d-flex align-items-center justify-content-center mb-1">
                                                <Chat size={16} className="text-info me-1" />
                                                <span className="fw-bold">{annonce.messages}</span>
                                            </div>
                                            <small className="text-muted">Messages</small>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="d-grid gap-2">
                                        {annonce.status === 'publié' ? (
                                            <>
                                                <Button variant="outline-primary" size="sm">
                                                    <i className="fas fa-sync me-2"></i>
                                                    Renouveler
                                                </Button>
                                                <Button variant="outline-success" size="sm">
                                                    <i className="fas fa-chart-line me-2"></i>
                                                    Promouvoir
                                                </Button>
                                            </>
                                        ) : annonce.status === 'en attente' ? (
                                            <Button variant="outline-warning" size="sm">
                                                <Clock className="me-2" />
                                                En attente d'approbation
                                            </Button>
                                        ) : (
                                            <Button variant="outline-danger" size="sm">
                                                <XCircle className="me-2" />
                                                Corriger et republier
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="text-muted">
                    Affichage de 4 annonces sur 12
                </div>
                <Pagination>
                    <Pagination.Prev />
                    <Pagination.Item active>{1}</Pagination.Item>
                    <Pagination.Item>{2}</Pagination.Item>
                    <Pagination.Item>{3}</Pagination.Item>
                    <Pagination.Next />
                </Pagination>
            </div>
        </div>
    );
};

export default AnnoncesList;