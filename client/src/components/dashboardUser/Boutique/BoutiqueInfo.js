// src/components/DashboardUser/Boutique/BoutiqueInfo.jsx
import React, { useState } from 'react';
import { 
    Card, 
    Row, 
    Col, 
    Badge, 
    Button, 
    ProgressBar,
    Alert,
    Form
} from 'react-bootstrap';
import { 
    Shop,
    Star,
    StarFill,
    CheckCircle,
    XCircle,
    Clock,
    Award,
    Shield,
    GraphUp,
    People
} from 'react-bootstrap-icons';

const BoutiqueInfo = () => {
    const [hasBoutique, setHasBoutique] = useState(false);
    
    const boutiqueData = {
        name: 'Tech Store Algeria',
        description: 'Vente d\'appareils électroniques et accessoires tech',
        category: 'Électronique',
        rating: 4.7,
        reviews: 128,
        membersSince: '2023-05-15',
        status: 'active',
        level: 'Pro',
        productsCount: 45,
        ordersCount: 289,
        revenue: '1,245,000 DA',
        verification: {
            email: true,
            phone: true,
            identity: true,
            address: false
        }
    };

    const plans = [
        {
            name: 'Gratuit',
            price: 0,
            features: ['5 annonces actives', 'Support basique', 'Statistiques limitées'],
            current: true
        },
        {
            name: 'Pro',
            price: 2990,
            features: ['Annonces illimitées', 'Support prioritaire', 'Statistiques avancées', 'Badge Pro'],
            recommended: true
        },
        {
            name: 'Business',
            price: 7990,
            features: ['Tout dans Pro', 'Boutique personnalisée', 'Publicité gratuite', 'Analytics premium']
        }
    ];

    const verificationSteps = [
        { id: 'email', label: 'Email vérifié', completed: true },
        { id: 'phone', label: 'Téléphone vérifié', completed: true },
        { id: 'identity', label: 'Identité vérifiée', completed: true },
        { id: 'address', label: 'Adresse vérifiée', completed: false }
    ];

    if (!hasBoutique) {
        return (
            <Card className="border-0 shadow-sm">
                <Card.Body className="p-5 text-center">
                    <div className="mb-4">
                        <div className="bg-primary bg-opacity-10 rounded-circle p-4 d-inline-block">
                            <Shop size={48} className="text-primary" />
                        </div>
                    </div>
                    
                    <h3 className="mb-3">Créez votre boutique en ligne</h3>
                    <p className="text-muted mb-4">
                        Augmentez votre crédibilité, gérez plusieurs produits et accédez à des outils avancés avec votre propre boutique.
                    </p>
                    
                    <div className="row justify-content-center mb-4">
                        <div className="col-md-8">
                            <Row className="g-3">
                                <Col xs={6}>
                                    <div className="text-center p-3 border rounded-3">
                                        <i className="fas fa-chart-line fa-2x text-primary mb-3"></i>
                                        <h6 className="fw-bold">Statistiques détaillées</h6>
                                    </div>
                                </Col>
                                <Col xs={6}>
                                    <div className="text-center p-3 border rounded-3">
                                        <i className="fas fa-badge-check fa-2x text-success mb-3"></i>
                                        <h6 className="fw-bold">Badge vérifié</h6>
                                    </div>
                                </Col>
                                <Col xs={6}>
                                    <div className="text-center p-3 border rounded-3">
                                        <i className="fas fa-store-alt fa-2x text-warning mb-3"></i>
                                        <h6 className="fw-bold">Page boutique</h6>
                                    </div>
                                </Col>
                                <Col xs={6}>
                                    <div className="text-center p-3 border rounded-3">
                                        <i className="fas fa-headset fa-2x text-info mb-3"></i>
                                        <h6 className="fw-bold">Support prioritaire</h6>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                    
                    <div className="d-flex justify-content-center gap-3">
                        <Button 
                            variant="primary" 
                            size="lg" 
                            className="rounded-pill px-5"
                            onClick={() => setHasBoutique(true)}
                        >
                            <Shop className="me-2" />
                            Créer ma boutique
                        </Button>
                        <Button 
                            variant="outline-primary" 
                            size="lg" 
                            className="rounded-pill px-4"
                        >
                            En savoir plus
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        );
    }

    return (
        <div>
            {/* En-tête boutique */}
            <Card className="border-0 shadow-sm mb-4 overflow-hidden">
                <div className="bg-gradient-primary py-4 px-4 text-white">
                    <Row className="align-items-center">
                        <Col md={8}>
                            <div className="d-flex align-items-center">
                                <div className="bg-white rounded-3 p-3 me-4">
                                    <Shop size={32} className="text-primary" />
                                </div>
                                <div>
                                    <div className="d-flex align-items-center mb-2">
                                        <h2 className="h3 mb-0 me-3">{boutiqueData.name}</h2>
                                        <Badge bg="warning" className="px-3 py-2">
                                            <Award size={16} className="me-2" />
                                            {boutiqueData.level}
                                        </Badge>
                                    </div>
                                    <p className="mb-0 opacity-75">{boutiqueData.description}</p>
                                </div>
                            </div>
                        </Col>
                        <Col md={4} className="text-md-end mt-3 mt-md-0">
                            <Button variant="light" className="rounded-pill me-2">
                                <i className="fas fa-edit me-2"></i>
                                Modifier
                            </Button>
                            <Button variant="outline-light" className="rounded-pill">
                                <i className="fas fa-eye me-2"></i>
                                Prévisualiser
                            </Button>
                        </Col>
                    </Row>
                </div>
                
                <Card.Body className="p-4">
                    <Row className="g-4">
                        <Col md={3}>
                            <div className="text-center p-3 border rounded-3">
                                <div className="d-flex align-items-center justify-content-center mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        i < Math.floor(boutiqueData.rating) ? (
                                            <StarFill key={i} size={20} className="text-warning me-1" />
                                        ) : (
                                            <Star key={i} size={20} className="text-muted me-1" />
                                        )
                                    ))}
                                </div>
                                <h4 className="fw-bold mb-1">{boutiqueData.rating}</h4>
                                <small className="text-muted">({boutiqueData.reviews} avis)</small>
                            </div>
                        </Col>
                        
                        <Col md={3}>
                            <div className="text-center p-3 border rounded-3">
                                <h4 className="fw-bold text-success mb-1">{boutiqueData.productsCount}</h4>
                                <p className="text-muted mb-0">Produits</p>
                            </div>
                        </Col>
                        
                        <Col md={3}>
                            <div className="text-center p-3 border rounded-3">
                                <h4 className="fw-bold text-primary mb-1">{boutiqueData.ordersCount}</h4>
                                <p className="text-muted mb-0">Commandes</p>
                            </div>
                        </Col>
                        
                        <Col md={3}>
                            <div className="text-center p-3 border rounded-3">
                                <h4 className="fw-bold text-warning mb-1">{boutiqueData.revenue}</h4>
                                <p className="text-muted mb-0">Revenus totaux</p>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            <Row className="g-4">
                {/* Vérification */}
                <Col lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="mb-0">Vérification de la boutique</h5>
                                <Badge bg="success" className="px-3 py-2">
                                    <Shield size={16} className="me-2" />
                                    75% complété
                                </Badge>
                            </div>
                            
                            <ProgressBar now={75} className="mb-4" style={{ height: '8px' }} />
                            
                            <div className="mb-4">
                                {verificationSteps.map((step, index) => (
                                    <div key={step.id} className="d-flex align-items-center mb-3">
                                        {step.completed ? (
                                            <CheckCircle size={20} className="text-success me-3" />
                                        ) : (
                                            <XCircle size={20} className="text-danger me-3" />
                                        )}
                                        <div className="flex-grow-1">
                                            <h6 className="mb-0">{step.label}</h6>
                                            {!step.completed && (
                                                <small className="text-muted">
                                                    En attente de vérification
                                                </small>
                                            )}
                                        </div>
                                        {step.completed ? (
                                            <Badge bg="success" className="px-3">
                                                Terminé
                                            </Badge>
                                        ) : (
                                            <Button variant="outline-primary" size="sm">
                                                Vérifier
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            
                            <Alert variant="info" className="border-0">
                                <i className="fas fa-info-circle me-2"></i>
                                Une boutique entièrement vérifiée augmente la confiance des clients de 40%.
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Plan actuel */}
                <Col lg={6}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="mb-0">Plan actuel</h5>
                                <Badge bg="warning" className="px-3 py-2">
                                    {plans.find(p => p.current)?.name}
                                </Badge>
                            </div>
                            
                            <div className="mb-4">
                                <h2 className="fw-bold mb-2">
                                    {plans.find(p => p.current)?.price === 0 
                                        ? 'Gratuit' 
                                        : `${plans.find(p => p.current)?.price} DA/mois`
                                    }
                                </h2>
                                <p className="text-muted">
                                    Plan {plans.find(p => p.current)?.name}
                                </p>
                            </div>
                            
                            <div className="mb-4">
                                <h6 className="mb-3">Fonctionnalités incluses:</h6>
                                <ul className="list-unstyled">
                                    {plans.find(p => p.current)?.features.map((feature, idx) => (
                                        <li key={idx} className="mb-2">
                                            <CheckCircle size={16} className="text-success me-2" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            
                            <Button variant="primary" className="w-100 rounded-pill py-2">
                                <GraphUp className="me-2" />
                                Mettre à niveau le plan
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Plans disponibles */}
            <Card className="border-0 shadow-sm mt-4">
                <Card.Body className="p-4">
                    <h5 className="mb-4">Plans disponibles</h5>
                    
                    <Row className="g-4">
                        {plans.map((plan, index) => (
                            <Col key={index} md={4}>
                                <Card className={`border h-100 ${plan.recommended ? 'border-primary shadow' : ''}`}>
                                    {plan.recommended && (
                                        <div className="bg-primary text-white text-center py-2">
                                            <small className="fw-bold">RECOMMANDÉ</small>
                                        </div>
                                    )}
                                    <Card.Body className="p-4">
                                        <div className="text-center mb-4">
                                            <h4 className="fw-bold">{plan.name}</h4>
                                            <h2 className="fw-bold my-3">
                                                {plan.price === 0 
                                                    ? 'Gratuit' 
                                                    : `${plan.price} DA`
                                                }
                                                {plan.price > 0 && <small className="text-muted fs-6">/mois</small>}
                                            </h2>
                                        </div>
                                        
                                        <ul className="list-unstyled mb-4">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="mb-3">
                                                    <CheckCircle 
                                                        size={16} 
                                                        className={`me-2 ${plan.recommended ? 'text-primary' : 'text-success'}`} 
                                                    />
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                        
                                        <Button 
                                            variant={plan.recommended ? 'primary' : 'outline-primary'}
                                            className="w-100 rounded-pill"
                                        >
                                            {plan.current ? 'Plan actuel' : 'Choisir ce plan'}
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Card.Body>
            </Card>
        </div>
    );
};

export default BoutiqueInfo;