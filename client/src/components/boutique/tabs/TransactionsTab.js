// components/boutique/tabs/TransactionsTab.jsx
import React, { useState } from 'react';
import { Table, Card, Badge, Button, Form, InputGroup, Row, Col, ProgressBar } from 'react-bootstrap';
import { 
  FaSearch, 
  FaFileInvoice, 
  FaDownload, 
  FaCreditCard, 
  FaMoneyBillWave,
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock
} from 'react-icons/fa';

const TransactionsTab = ({ boutique, type = 'transactions' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState('month');

  // Datos de ejemplo para transacciones
  const transactions = [
    {
      id: 'TXN-001',
      date: '2024-01-15',
      description: 'Paiement abonnement Premium',
      amount: 5000,
      status: 'completed',
      method: 'credit_card',
      reference: 'REF123456'
    },
    {
      id: 'TXN-002',
      date: '2024-01-10',
      description: 'Commission vente #ORD-001',
      amount: 1250,
      status: 'completed',
      method: 'wallet',
      reference: 'REF789012'
    },
    {
      id: 'TXN-003',
      date: '2024-01-05',
      description: 'Retrait fonds',
      amount: -15000,
      status: 'pending',
      method: 'bank_transfer',
      reference: 'REF345678'
    },
    {
      id: 'TXN-004',
      date: '2023-12-28',
      description: 'Paiement abonnement Basique',
      amount: 2500,
      status: 'completed',
      method: 'credit_card',
      reference: 'REF901234'
    },
    {
      id: 'TXN-005',
      date: '2023-12-20',
      description: 'Commission ventes',
      amount: 3450,
      status: 'failed',
      method: 'wallet',
      reference: 'REF567890'
    }
  ];

  // Datos de suscripción
  const subscription = {
    plan: boutique.plan || 'gratuit',
    startDate: boutique.date_debut || '2024-01-01',
    endDate: boutique.date_fin || '2024-02-01',
    amount: 5000,
    status: 'active',
    autoRenew: true,
    features: [
      { name: 'Nombre de produits', limit: 50, used: 23 },
      { name: 'Stockage (MB)', limit: 1000, used: 450 },
      { name: 'Crédits SMS', limit: 100, used: 35 }
    ]
  };

  const getStatusBadge = (status) => {
    const config = {
      'completed': { bg: 'success', text: 'Complété', icon: <FaCheckCircle /> },
      'pending': { bg: 'warning', text: 'En attente', icon: <FaClock /> },
      'failed': { bg: 'danger', text: 'Échoué', icon: <FaTimesCircle /> }
    };
    const item = config[status] || { bg: 'secondary', text: status };
    return <Badge bg={item.bg}>{item.icon} {item.text}</Badge>;
  };

  const getMethodIcon = (method) => {
    switch(method) {
      case 'credit_card':
        return <FaCreditCard className="text-primary" />;
      case 'wallet':
        return <FaMoneyBillWave className="text-success" />;
      case 'bank_transfer':
        return <FaMoneyBillWave className="text-info" />;
      default:
        return <FaMoneyBillWave />;
    }
  };

  const filteredTransactions = transactions.filter(t => 
    t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculer les totaux
  const totals = transactions.reduce((acc, t) => {
    if (t.status === 'completed') {
      if (t.amount > 0) {
        acc.income += t.amount;
      } else {
        acc.expenses += Math.abs(t.amount);
      }
    }
    return acc;
  }, { income: 0, expenses: 0 });

  const balance = totals.income - totals.expenses;

  return (
    <div className="transactions-tab">
      <h4 className="mb-4">
        {type === 'transactions' ? 'Transactions' : 'Abonnement'}
      </h4>

      {type === 'subscription' ? (
        // Vue abonnement
        <>
          <Row className="mb-4">
            <Col md={4}>
              <Card className="border-0 shadow-sm bg-primary text-white">
                <Card.Body>
                  <h6>Plan actuel</h6>
                  <h3 className="text-capitalize">{subscription.plan}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm bg-success text-white">
                <Card.Body>
                  <h6>Statut</h6>
                  <h3 className="text-capitalize">{subscription.status}</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm bg-info text-white">
                <Card.Body>
                  <h6>Montant</h6>
                  <h3>{subscription.amount.toLocaleString()} DA/mois</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <h5 className="mb-4">Détails de l'abonnement</h5>
              <Row>
                <Col md={6}>
                  <p><strong>Date de début:</strong> {new Date(subscription.startDate).toLocaleDateString()}</p>
                  <p><strong>Date de fin:</strong> {new Date(subscription.endDate).toLocaleDateString()}</p>
                  <p><strong>Renouvellement automatique:</strong> {subscription.autoRenew ? 'Oui' : 'Non'}</p>
                </Col>
                <Col md={6}>
                  <Form.Check 
                    type="switch"
                    label="Renouvellement automatique"
                    checked={subscription.autoRenew}
                    onChange={() => {}}
                    className="mb-3"
                  />
                  <Button variant="outline-primary" size="sm">
                    Changer de plan
                  </Button>{' '}
                  <Button variant="outline-danger" size="sm">
                    Résilier
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-4">Utilisation des ressources</h5>
              {subscription.features.map((feature, index) => (
                <div key={index} className="mb-3">
                  <div className="d-flex justify-content-between mb-1">
                    <span>{feature.name}</span>
                    <span>{feature.used} / {feature.limit}</span>
                  </div>
                  <ProgressBar 
                    now={(feature.used / feature.limit) * 100} 
                    variant={feature.used / feature.limit > 0.8 ? 'warning' : 'success'}
                  />
                </div>
              ))}
            </Card.Body>
          </Card>
        </>
      ) : (
        // Vue transactions
        <>
          {/* Résumé financier */}
          <Row className="mb-4 g-3">
            <Col md={4}>
              <Card className="border-0 shadow-sm bg-success text-white">
                <Card.Body>
                  <h6>Revenus</h6>
                  <h3>{totals.income.toLocaleString()} DA</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm bg-danger text-white">
                <Card.Body>
                  <h6>Dépenses</h6>
                  <h3>{totals.expenses.toLocaleString()} DA</h3>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="border-0 shadow-sm bg-primary text-white">
                <Card.Body>
                  <h6>Solde</h6>
                  <h3>{balance.toLocaleString()} DA</h3>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Filtres */}
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body>
              <Row>
                <Col md={5}>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaSearch />
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Rechercher une transaction..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <Form.Select 
                    value={periodFilter}
                    onChange={(e) => setPeriodFilter(e.target.value)}
                  >
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois</option>
                    <option value="quarter">Ce trimestre</option>
                    <option value="year">Cette année</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="date"
                    placeholder="Date début"
                  />
                </Col>
                <Col md={2}>
                  <Form.Control
                    type="date"
                    placeholder="Date fin"
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Liste des transactions */}
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Table responsive hover>
                <thead className="bg-light">
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Montant</th>
                    <th>Méthode</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map(transaction => (
                    <tr key={transaction.id}>
                      <td><strong>{transaction.id}</strong></td>
                      <td>{new Date(transaction.date).toLocaleDateString()}</td>
                      <td>{transaction.description}</td>
                      <td className={transaction.amount > 0 ? 'text-success' : 'text-danger'}>
                        <strong>
                          {transaction.amount > 0 ? '+' : ''}
                          {transaction.amount.toLocaleString()} DA
                        </strong>
                      </td>
                      <td>
                        {getMethodIcon(transaction.method)} {' '}
                        {transaction.method === 'credit_card' ? 'Carte' : 
                         transaction.method === 'wallet' ? 'Portefeuille' : 'Virement'}
                      </td>
                      <td>{getStatusBadge(transaction.status)}</td>
                      <td>
                        <Button variant="link" size="sm" className="text-primary p-0 me-2">
                          <FaFileInvoice />
                        </Button>
                        <Button variant="link" size="sm" className="text-success p-0">
                          <FaDownload />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </>
      )}
    </div>
  );
};

export default TransactionsTab;