// src/components/DashboardUser/Profil/InfoPersonnelle.jsx
import React, { useState } from 'react';
import { 
    Card, 
    Row, 
    Col, 
    Badge, 
    Button, 
    Form,
    Alert,
    ProgressBar
} from 'react-bootstrap';
import { 
    Person,
    Envelope,
    Telephone,
    GeoAlt,
    Calendar,
    ShieldCheck,
    XCircle,
    CheckCircle,
    Edit,
    Save,
    Camera
} from 'react-bootstrap-icons';

const InfoPersonnelle = () => {
    const [editing, setEditing] = useState(false);
    const [userData, setUserData] = useState({
        name: 'Ahmed Benali',
        email: 'ahmed.benali@email.com',
        phone: '+213 555 123 456',
        address: '123 Rue Didouche Mourad, Alger',
        birthDate: '1990-05-15',
        bio: 'Vendeur professionnel spécialisé en électronique et gadgets tech. Fiabilité et qualité garanties.'
    });

    const [verification, setVerification] = useState({
        email: { verified: true, date: '2023-10-15' },
        phone: { verified: true, date: '2023-10-16' },
        identity: { verified: false, date: null },
        address: { verified: false, date: null }
    });

    const verificationSteps = [
        { id: 'email', label: 'Email vérifié', completed: verification.email.verified, required: true },
        { id: 'phone', label: 'Téléphone vérifié', completed: verification.phone.verified, required: true },
        { id: 'identity', label: 'Identité vérifiée', completed: verification.identity.verified, required: false },
        { id: 'address', label: 'Adresse vérifiée', completed: verification.address.verified, required: false }
    ];

    const completedSteps = verificationSteps.filter(step => step.completed).length;
    const verificationProgress = (completedSteps / verificationSteps.length) * 100;

    const handleSave = () => {
        // Ici, tu ajouterais la logique pour sauvegarder dans l'API
        setEditing(false);
    };

    const verifyStep = (stepId) => {
        // Ici, tu ajouterais la logique pour lancer la vérification
        setVerification(prev => ({
            ...prev,
            [stepId]: { ...prev[stepId], verified: true, date: new Date().toISOString().split('T')[0] }
        }));
    };

    return (
        <div>
            {/* En-tête du profil */}
            <Card className="border-0 shadow-sm mb-4 overflow-hidden">
                <div className="bg-gradient-primary py-4 px-4 text-white">
                    <Row className="align-items-center">
                        <Col md={8}>
                            <div className="d-flex align-items-center">
                                <div className="position-relative me-4">
                                    <img 
                                        src="https://ui-avatars.com/api/?name=Ahmed+Benali&background=007bff&color=fff&size=100"
                                        alt="Avatar"
                                        className="rounded-circle border border-4 border-white"
                                        style={{ width: '100px', height: '100px' }}
                                    />
                                    <Button 
                                        variant="light" 
                                        size="sm"
                                        className="position-absolute bottom-0 end-0 rounded-circle"
                                        style={{ width: '32px', height: '32px' }}
                                    >
                                        <Camera size={14} />
                                    </Button>
                                </div>
                                <div>
                                    <h2 className="h3 mb-2">{userData.name}</h2>
                                    <div className="d-flex align-items-center gap-3">
                                        <Badge bg="success" className="px-3 py-2">
                                            <ShieldCheck size={16} className="me-2" />
                                            Compte Standard
                                        </Badge>
                                        <Badge bg="warning" className="px-3 py-2">
                                            <i className="fas fa-star me-2"></i>
                                            Évaluation: 4.7/5
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col md={4} className="text-md-end mt-3 mt-md-0">
                            <Button 
                                variant={editing ? 'success' : 'light'}
                                className="rounded-pill px-4"
                                onClick={editing ? handleSave : () => setEditing(true)}
                            >
                                {editing ? (
                                    <>
                                        <Save className="me-2" />
                                        Sauvegarder
                                    </>
                                ) : (
                                    <>
                                        <Edit className="me-2" />
                                        Modifier le profil
                                    </>
                                )}
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Card>

            <Row className="g-4">
                {/* Informations personnelles */}
                <Col lg={8}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <h5 className="mb-0">Informations personnelles</h5>
                                <Badge bg="primary" className="px-3 py-2">
                                    {verificationProgress.toFixed(0)}% vérifié
                                </Badge>
                            </div>

                            {verificationProgress < 100 && (
                                <Alert variant="warning" className="mb-4">
                                    <div className="d-flex align-items-center">
                                        <ShieldCheck size={24} className="me-3" />
                                        <div>
                                            <h6 className="alert-heading mb-1">Vérification incomplète</h6>
                                            <p className="mb-0">
                                                Complétez la vérification de votre compte pour débloquer toutes les fonctionnalités.
                                            </p>
                                        </div>
                                    </div>
                                </Alert>
                            )}

                            <ProgressBar now={verificationProgress} className="mb-4" style={{ height: '8px' }} />

                            <Form>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small text-muted">
                                                <Person size={14} className="me-2" />
                                                Nom complet
                                            </Form.Label>
                                            <Form.Control 
                                                value={userData.name}
                                                onChange={(e) => setUserData({...userData, name: e.target.value})}
                                                disabled={!editing}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small text-muted">
                                                <Envelope size={14} className="me-2" />
                                                Adresse email
                                            </Form.Label>
                                            <InputGroup>
                                                <Form.Control 
                                                    value={userData.email}
                                                    disabled
                                                />
                                                <Badge bg={verification.email.verified ? 'success' : 'danger'} className="ms-2">
                                                    {verification.email.verified ? 'Vérifié' : 'Non vérifié'}
                                                </Badge>
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small text-muted">
                                                <Telephone size={14} className="me-2" />
                                                Téléphone
                                            </Form.Label>
                                            <InputGroup>
                                                <Form.Control 
                                                    value={userData.phone}
                                                    onChange={(e) => setUserData({...userData, phone: e.target.value})}
                                                    disabled={!editing}
                                                />
                                                <Badge bg={verification.phone.verified ? 'success' : 'danger'} className="ms-2">
                                                    {verification.phone.verified ? 'Vérifié' : 'Non vérifié'}
                                                </Badge>
                                            </InputGroup>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small text-muted">
                                                <Calendar size={14} className="me-2" />
                                                Date de naissance
                                            </Form.Label>
                                            <Form.Control 
                                                type="date"
                                                value={userData.birthDate}
                                                onChange={(e) => setUserData({...userData, birthDate: e.target.value})}
                                                disabled={!editing}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small text-muted">
                                                <GeoAlt size={14} className="me-2" />
                                                Adresse
                                            </Form.Label>
                                            <Form.Control 
                                                value={userData.address}
                                                onChange={(e) => setUserData({...userData, address: e.target.value})}
                                                disabled={!editing}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col md={12}>
                                        <Form.Group className="mb-3">
                                            <Form.Label className="small text-muted">
                                                Bio / Description
                                            </Form.Label>
                                            <Form.Control 
                                                as="textarea" 
                                                rows={3}
                                                value={userData.bio}
                                                onChange={(e) => setUserData({...userData, bio: e.target.value})}
                                                disabled={!editing}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                            </Form>

                            {editing && (
                                <div className="d-flex justify-content-end gap-3 mt-4">
                                    <Button 
                                        variant="outline-secondary"
                                        onClick={() => setEditing(false)}
                                    >
                                        Annuler
                                    </Button>
                                    <Button 
                                        variant="primary"
                                        onClick={handleSave}
                                    >
                                        <Save className="me-2" />
                                        Sauvegarder les modifications
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                {/* Vérification */}
                <Col lg={4}>
                    <Card className="border-0 shadow-sm h-100">
                        <Card.Body className="p-4">
                            <h5 className="mb-4">Vérification du compte</h5>
                            
                            <div className="mb-4">
                                {verificationSteps.map((step, index) => (
                                    <div key={step.id} className="d-flex align-items-center mb-3">
                                        <div className={`rounded-circle p-2 me-3 ${step.completed ? 'bg-success' : 'bg-light'}`}>
                                            {step.completed ? (
                                                <CheckCircle size={20} className="text-white" />
                                            ) : (
                                                <XCircle size={20} className="text-muted" />
                                            )}
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="mb-0">{step.label}</h6>
                                            {step.completed && verification[step.id]?.date && (
                                                <small className="text-muted">
                                                    Vérifié le {new Date(verification[step.id].date).toLocaleDateString('fr-FR')}
                                                </small>
                                            )}
                                        </div>
                                        {!step.completed && (
                                            <Button 
                                                variant="outline-primary" 
                                                size="sm"
                                                onClick={() => verifyStep(step.id)}
                                            >
                                                Vérifier
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <Alert variant="info" className="border-0">
                                <h6 className="alert-heading">Pourquoi vérifier ?</h6>
                                <ul className="mb-0 small">
                                    <li>Augmente la confiance des clients</li>
                                    <li>Débloque les fonctionnalités premium</li>
                                    <li>Accès à des outils avancés</li>
                                    <li>Meilleur classement dans les recherches</li>
                                </ul>
                            </Alert>

                            {/* Statut de vérification */}
                            <div className="mt-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="text-muted">Niveau de vérification</span>
                                    <span className="fw-bold">{completedSteps}/{verificationSteps.length}</span>
                                </div>
                                <ProgressBar 
                                    now={verificationProgress} 
                                    variant={verificationProgress === 100 ? 'success' : 'warning'}
                                    className="mb-3"
                                />
                                
                                {verificationProgress === 100 ? (
                                    <Alert variant="success" className="text-center">
                                        <CheckCircle size={20} className="me-2" />
                                        Compte entièrement vérifié
                                    </Alert>
                                ) : (
                                    <Button variant="primary" className="w-100">
                                        Compléter la vérification
                                    </Button>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Statistiques du compte */}
            <Row className="g-4 mt-4">
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center p-4">
                            <div className="bg-primary bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                                <i className="fas fa-store fa-2x text-primary"></i>
                            </div>
                            <h3 className="fw-bold mb-1">12</h3>
                            <p className="text-muted mb-0">Annonces actives</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center p-4">
                            <div className="bg-success bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                                <i className="fas fa-shopping-cart fa-2x text-success"></i>
                            </div>
                            <h3 className="fw-bold mb-1">45</h3>
                            <p className="text-muted mb-0">Commandes totales</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center p-4">
                            <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                                <i className="fas fa-star fa-2x text-warning"></i>
                            </div>
                            <h3 className="fw-bold mb-1">4.7</h3>
                            <p className="text-muted mb-0">Évaluation moyenne</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="border-0 shadow-sm">
                        <Card.Body className="text-center p-4">
                            <div className="bg-info bg-opacity-10 rounded-circle p-3 d-inline-block mb-3">
                                <i className="fas fa-calendar-alt fa-2x text-info"></i>
                            </div>
                            <h3 className="fw-bold mb-1">8 mois</h3>
                            <p className="text-muted mb-0">Membre depuis</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default InfoPersonnelle;