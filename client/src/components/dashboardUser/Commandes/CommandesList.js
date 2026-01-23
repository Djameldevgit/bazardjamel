// src/components/DashboardUser/Commandes/CommandesList.jsx
import React, { useState } from 'react';
import { 
    Card, 
    Row, 
    Col, 
    Badge, 
    Button, 
    Table,
    Dropdown,
    Pagination,
    Form
} from 'react-bootstrap';
import { 
    Cart,
    CheckCircle,
    Clock,
    XCircle,
    Truck,
    Package,
    CreditCard,
    Message,
    Eye,
    Download,
    Printer
} from 'react-bootstrap-icons';

const CommandesList = () => {
    const [activeFilter, setActiveFilter] = useState('all');
    
    const commandes = [
        {
            id: 'CMD-2024-001',
            customer: 'Ahmed B.',
            product: 'iPhone 13 Pro Max',
            amount: '120,000 DA',
            status: 'livré',
            statusColor: 'success',
            date: '2024-01-15',
            payment: 'Payé',
            shipping: 'Livraison express'
        },
        {
            id: 'CMD-2024-002',
            customer: 'Sarah M.',
            product: 'Sac à main premium',
            amount: '45,000 DA',
            status: 'en traitement',
            statusColor: 'warning',
            date: '2024-01-14',
            payment: 'En attente',
            shipping: 'Standard'
        },
        {
            id: 'CMD-2024-003',
            customer: 'Karim L.',
            product: 'Montre intelligente',
            amount: '28,500 DA',
            status: 'annulé',
            statusColor: 'danger',
            date: '2024-01-13',
            payment: 'Remboursé',
            shipping: 'Non expédié'
        },
        {
            id: 'CMD-2024-004',
            customer: 'Fatima Z.',
            product: 'Ensemble de bijoux',
            amount: '15,750 DA',
            status: 'expédié',
            statusColor: 'info',
            date: '2024-01-12',
            payment: 'Payé',
            shipping: 'Express'
        }
    ];

    const filters = [
        { id: 'all', label: 'Toutes', count: 24 },
        { id: 'pending', label: 'En attente', count: 5 },
        { id: 'processing', label: 'En traitement', count: 3 },
        { id: 'shipped', label: 'Expédiées', count: 8 },
        { id: 'delivered', label: 'Livrées', count: 6 },
        { id: 'cancelled', label: 'Annulées', count: 2 }
    ];

    const getStatusIcon = (status) => {
        switch(status) {
            case 'livré': return <CheckCircle size={16} className="text-success" />;
            case 'en traitement': return <Clock size={16} className="text-warning" />;
            case 'annulé': return <XCircle size={16} className="text-danger" />;
            case 'expédié': return <Truck size={16} className="text-info" />;
            default: return <Package size={16} />;
        }
    };

    const stats = [
        { label: 'Commandes totales', value: '24', change: '+12%', color: 'primary' },
        { label: 'Revenus totaux', value: '289,500 DA', change: '+18%', color: 'success' },
        { label: 'Taux de conversion', value: '3.2%', change: '+0.4%', color: 'info' },
        { label: 'Panier moyen', value: '12,063 DA', change: '+5%', color: 'warning' }
    ];

    return (
        <div>
            {/* Statistiques */}
            <Row className="g-4 mb-4">
                {stats.map((stat, index) => (
                    <Col key={index} xs={6} md={3}>
                        <Card className="border-0 shadow-sm">
                            <Card.Body className="p-4">
                                <h6 className="text-muted mb-2">{stat.label}</h6>
                                <div className="d-flex justify-content-between align-items-end">
                                    <h3 className="fw-bold mb-0">{stat.value}</h3>
                                    <Badge bg={`${stat.color}-subtle`} text={stat.color}>
                                        {stat.change}
                                    </Badge>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Filtres et recherche */}
            <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h4 className="mb-1">Commandes</h4>
                            <p className="text-muted mb-0">
                                Gérez et suivez toutes vos commandes
                            </p>
                        </div>
                        <div className="d-flex gap-2">
                            <Button variant="outline-primary" className="rounded-pill">
                                <Download className="me-2" />
                                Exporter
                            </Button>
                            <Button variant="outline-primary" className="rounded-pill">
                                <Printer className="me-2" />
                                Imprimer
                            </Button>
                        </div>
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

                    {/* Barre de recherche */}
                    <Row className="g-3">
                        <Col md={4}>
                            <Form.Control placeholder="Rechercher une commande..." />
                        </Col>
                        <Col md={3}>
                            <Form.Select>
                                <option>Trier par date</option>
                                <option>Trier par montant</option>
                                <option>Trier par statut</option>
                            </Form.Select>
                        </Col>
                        <Col md={3}>
                            <Form.Control type="date" />
                        </Col>
                        <Col md={2}>
                            <Button variant="primary" className="w-100">
                                <i className="fas fa-filter me-2"></i>
                                Filtrer
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Table des commandes */}
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                    <Table hover responsive className="mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>Commande</th>
                                <th>Client</th>
                                <th>Produit</th>
                                <th>Montant</th>
                                <th>Statut</th>
                                <th>Paiement</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {commandes.map(commande => (
                                <tr key={commande.id}>
                                    <td>
                                        <div>
                                            <strong>{commande.id}</strong>
                                            <div className="small text-muted">
                                                {new Date(commande.date).toLocaleDateString('fr-FR')}
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <img 
                                                src={`https://ui-avatars.com/api/?name=${commande.customer}&background=random`}
                                                alt={commande.customer}
                                                className="rounded-circle me-2"
                                                width="32"
                                                height="32"
                                            />
                                            {commande.customer}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="text-truncate" style={{ maxWidth: '150px' }}>
                                            {commande.product}
                                        </div>
                                        <small className="text-muted">{commande.shipping}</small>
                                    </td>
                                    <td>
                                        <strong className="text-success">{commande.amount}</strong>
                                    </td>
                                    <td>
                                        <Badge bg={commande.statusColor} className="px-3 py-2">
                                            {getStatusIcon(commande.status)}
                                            <span className="ms-2">
                                                {commande.status.charAt(0).toUpperCase() + commande.status.slice(1)}
                                            </span>
                                        </Badge>
                                    </td>
                                    <td>
                                        <Badge bg={commande.payment === 'Payé' ? 'success' : 'warning'}>
                                            {commande.payment}
                                        </Badge>
                                    </td>
                                    <td>
                                        <div className="d-flex gap-2">
                                            <Button variant="outline-primary" size="sm">
                                                <Eye size={16} />
                                            </Button>
                                            <Button variant="outline-success" size="sm">
                                                <Message size={16} />
                                            </Button>
                                            <Dropdown>
                                                <Dropdown.Toggle variant="light" size="sm">
                                                    <i className="fas fa-ellipsis-v"></i>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item>
                                                        <CheckCircle size={16} className="me-2" />
                                                        Marquer comme livré
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <Truck size={16} className="me-2" />
                                                        Suivi d'expédition
                                                    </Dropdown.Item>
                                                    <Dropdown.Item>
                                                        <CreditCard size={16} className="me-2" />
                                                        Détails paiement
                                                    </Dropdown.Item>
                                                    <Dropdown.Divider />
                                                    <Dropdown.Item className="text-danger">
                                                        <XCircle size={16} className="me-2" />
                                                        Annuler la commande
                                                    </Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Pagination et résumé */}
            <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="text-muted">
                    Affichage de {commandes.length} commandes sur 24
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

export default CommandesList;