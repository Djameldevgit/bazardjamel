// src/components/DashboardUser/Overview/StatsCards.jsx
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { 
    Eye, 
    Heart, 
    Chat, 
    CreditCard, 
    GraphUpArrow,
    CheckCircle,
    Clock,
    XCircle
} from 'react-bootstrap-icons';

const StatsCards = () => {
    const stats = [
        {
            title: 'Vues totales',
            value: '1,245',
            change: '+12%',
            icon: <Eye size={24} />,
            color: 'primary',
            progress: 75
        },
        {
            title: 'Likes reçus',
            value: '89',
            change: '+8%',
            icon: <Heart size={24} />,
            color: 'danger',
            progress: 60
        },
        {
            title: 'Messages',
            value: '24',
            change: '+3',
            icon: <Chat size={24} />,
            color: 'info',
            progress: 40
        },
        {
            title: 'Revenus',
            value: '45,200 DA',
            change: '+18%',
            icon: <CreditCard size={24} />,
            color: 'success',
            progress: 85
        }
    ];

    const annonceStats = [
        {
            status: 'Publié',
            count: 8,
            icon: <CheckCircle className="text-success" />,
            color: 'success'
        },
        {
            status: 'En attente',
            count: 3,
            icon: <Clock className="text-warning" />,
            color: 'warning'
        },
        {
            status: 'Rejeté',
            count: 1,
            icon: <XCircle className="text-danger" />,
            color: 'danger'
        }
    ];

    return (
        <div>
            {/* Cartes principales */}
            <Row className="g-4 mb-4">
                {stats.map((stat, index) => (
                    <Col key={index} xs={12} sm={6} lg={3}>
                        <Card className="border-0 shadow-sm h-100">
                            <Card.Body className="p-4">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div>
                                        <h6 className="text-muted mb-2">{stat.title}</h6>
                                        <h3 className="fw-bold mb-0">{stat.value}</h3>
                                    </div>
                                    <div className={`bg-${stat.color}-subtle p-3 rounded-3`}>
                                        <span className={`text-${stat.color}`}>
                                            {stat.icon}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="d-flex align-items-center">
                                    <span className={`badge bg-${stat.color}-subtle text-${stat.color} me-2`}>
                                        <GraphUpArrow size={12} className="me-1" />
                                        {stat.change}
                                    </span>
                                    <small className="text-muted">ce mois</small>
                                </div>
                                
                                {/* Barre de progression */}
                                <div className="mt-3">
                                    <div className="progress" style={{ height: '6px' }}>
                                        <div 
                                            className={`progress-bar bg-${stat.color}`}
                                            style={{ width: `${stat.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Stats des annonces */}
            <Row className="g-4">
                <Col xs={12} lg={8}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="mb-0">Statistiques des annonces</h5>
                                <button className="btn btn-sm btn-outline-primary">
                                    Voir tout
                                </button>
                            </div>
                            
                            <Row>
                                {annonceStats.map((stat, index) => (
                                    <Col key={index} xs={4}>
                                        <div className="text-center py-3">
                                            <div className={`bg-${stat.color}-subtle rounded-3 p-3 d-inline-block mb-2`}>
                                                {stat.icon}
                                            </div>
                                            <h3 className="fw-bold mb-1">{stat.count}</h3>
                                            <p className="text-muted mb-0">{stat.status}</p>
                                        </div>
                                    </Col>
                                ))}
                            </Row>
                            
                            <div className="mt-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-muted">Performance globale</span>
                                    <span className="fw-bold">78%</span>
                                </div>
                                <div className="progress" style={{ height: '8px' }}>
                                    <div 
                                        className="progress-bar bg-success" 
                                        style={{ width: '78%' }}
                                    ></div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col xs={12} lg={4}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="p-4">
                            <h5 className="mb-4">Niveau d'activité</h5>
                            
                            <div className="text-center mb-4">
                                <div className="position-relative d-inline-block">
                                    <div 
                                        className="rounded-circle bg-primary bg-opacity-10 p-4"
                                        style={{ width: '120px', height: '120px' }}
                                    >
                                        <div className="position-absolute top-50 start-50 translate-middle">
                                            <h2 className="fw-bold mb-0">7.8</h2>
                                            <small className="text-muted">/10</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="text-center">
                                <h6 className="mb-2">Actif</h6>
                                <p className="text-muted small mb-0">
                                    Votre activité est bonne. Continuez comme ça !
                                </p>
                            </div>
                            
                            <div className="mt-4">
                                <button className="btn btn-primary w-100 rounded-pill">
                                    Améliorer mon score
                                </button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default StatsCards;