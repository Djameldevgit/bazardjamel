// components/boutique/tabs/OrdersTab.jsx
import React, { useState } from 'react';
import { Table, Card, Badge, Button, Form, InputGroup, Row, Col, Modal } from 'react-bootstrap';
import { FaSearch, FaEye, FaPrint, FaFilePdf, FaCheck, FaTimes, FaTruck, FaMoneyBill } from 'react-icons/fa';

const OrdersTab = ({ boutique, type = 'orders-list' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Datos de ejemplo
  const orders = [
    {
      id: 'ORD-001',
      customer: 'Ahmed Benali',
      date: '2024-01-15',
      total: 12500,
      status: 'pending',
      payment: 'pending',
      items: [
        { name: 'Smartphone Samsung', quantity: 1, price: 8500 },
        { name: 'Coque de protection', quantity: 2, price: 2000 }
      ],
      shipping: {
        address: '15 Rue Didouche Mourad',
        city: 'Alger',
        wilaya: 'Alger',
        phone: '0555123456'
      }
    },
    {
      id: 'ORD-002',
      customer: 'Fatima Zohra',
      date: '2024-01-14',
      total: 3500,
      status: 'confirmed',
      payment: 'paid',
      items: [
        { name: 'Robe été', quantity: 1, price: 3500 }
      ],
      shipping: {
        address: '3 Boulevard Mohamed V',
        city: 'Oran',
        wilaya: 'Oran',
        phone: '0661234567'
      }
    },
    {
      id: 'ORD-003',
      customer: 'Karim Hadj',
      date: '2024-01-13',
      total: 8900,
      status: 'shipped',
      payment: 'paid',
      items: [
        { name: 'Ordinateur portable', quantity: 1, price: 8900 }
      ],
      shipping: {
        address: '8 Rue de la Liberté',
        city: 'Constantine',
        wilaya: 'Constantine',
        phone: '0777345678'
      }
    },
    {
      id: 'ORD-004',
      customer: 'Samira Bensalem',
      date: '2024-01-12',
      total: 2300,
      status: 'delivered',
      payment: 'paid',
      items: [
        { name: 'Sac à main', quantity: 1, price: 2300 }
      ],
      shipping: {
        address: '12 Avenue de l\'ALN',
        city: 'Blida',
        wilaya: 'Blida',
        phone: '0555987654'
      }
    },
    {
      id: 'ORD-005',
      customer: 'Mohamed Cherif',
      date: '2024-01-11',
      total: 6700,
      status: 'cancelled',
      payment: 'refunded',
      items: [
        { name: 'Montre connectée', quantity: 1, price: 6700 }
      ],
      shipping: {
        address: '6 Rue des Frères',
        city: 'Sétif',
        wilaya: 'Sétif',
        phone: '0666123456'
      }
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      'pending': { bg: 'warning', text: 'En attente', icon: <FaTimes /> },
      'confirmed': { bg: 'info', text: 'Confirmée', icon: <FaCheck /> },
      'shipped': { bg: 'primary', text: 'Expédiée', icon: <FaTruck /> },
      'delivered': { bg: 'success', text: 'Livrée', icon: <FaCheck /> },
      'cancelled': { bg: 'danger', text: 'Annulée', icon: <FaTimes /> }
    };
    const config = statusConfig[status] || { bg: 'secondary', text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getPaymentBadge = (payment) => {
    const paymentConfig = {
      'pending': { bg: 'warning', text: 'En attente' },
      'paid': { bg: 'success', text: 'Payée' },
      'refunded': { bg: 'info', text: 'Remboursée' },
      'failed': { bg: 'danger', text: 'Échouée' }
    };
    const config = paymentConfig[payment] || { bg: 'secondary', text: payment };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const filteredOrders = orders.filter(order => 
    (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     order.customer.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === 'all' || order.status === statusFilter)
  );

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const updateOrderStatus = (orderId, newStatus) => {
    console.log('Actualizar estado:', orderId, newStatus);
    // Aquí iría la lógica para actualizar el estado
  };

  // Estadísticas
  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    revenue: orders.reduce((acc, o) => acc + o.total, 0)
  };

  return (
    <div className="orders-tab">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Gestion des commandes</h4>
        <Button variant="outline-primary">
          <FaFilePdf className="me-2" /> Exporter PDF
        </Button>
      </div>

      {/* Statistiques */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body>
              <h6>Total commandes</h6>
              <h3>{stats.total}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-success text-white">
            <Card.Body>
              <h6>Chiffre d'affaires</h6>
              <h3>{stats.revenue.toLocaleString()} DA</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-warning text-white">
            <Card.Body>
              <h6>En attente</h6>
              <h3>{stats.pending}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="border-0 shadow-sm bg-info text-white">
            <Card.Body>
              <h6>Livrées</h6>
              <h3>{stats.delivered}</h3>
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
                  placeholder="Rechercher par ID ou client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Control
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </Col>
            <Col md={1}>
              <Button variant="secondary" className="w-100">
                Filtrer
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tableau des commandes */}
      <Card className="border-0 shadow-sm">
        <Card.Body>
          <Table responsive hover>
            <thead className="bg-light">
              <tr>
                <th>ID Commande</th>
                <th>Client</th>
                <th>Date</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Paiement</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td><strong>{order.id}</strong></td>
                  <td>{order.customer}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td><strong>{order.total.toLocaleString()} DA</strong></td>
                  <td>{getStatusBadge(order.status)}</td>
                  <td>{getPaymentBadge(order.payment)}</td>
                  <td>
                    <Button 
                      variant="link" 
                      size="sm" 
                      className="text-info p-0 me-2"
                      onClick={() => handleViewOrder(order)}
                    >
                      <FaEye />
                    </Button>
                    <Button variant="link" size="sm" className="text-primary p-0 me-2">
                      <FaPrint />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Modal de détails de commande */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails de la commande {selectedOrder?.id}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              <Row className="mb-4">
                <Col md={6}>
                  <h6>Informations client</h6>
                  <p className="mb-1"><strong>Nom:</strong> {selectedOrder.customer}</p>
                  <p className="mb-1"><strong>Téléphone:</strong> {selectedOrder.shipping.phone}</p>
                </Col>
                <Col md={6}>
                  <h6>Adresse de livraison</h6>
                  <p className="mb-1">{selectedOrder.shipping.address}</p>
                  <p className="mb-1">{selectedOrder.shipping.city}, {selectedOrder.shipping.wilaya}</p>
                </Col>
              </Row>

              <h6>Produits commandés</h6>
              <Table size="sm" className="mb-4">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price.toLocaleString()} DA</td>
                      <td>{(item.price * item.quantity).toLocaleString()} DA</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} className="text-end"><strong>Total:</strong></td>
                    <td><strong>{selectedOrder.total.toLocaleString()} DA</strong></td>
                  </tr>
                </tfoot>
              </Table>

              <h6>Mise à jour du statut</h6>
              <Row>
                <Col md={4}>
                  <Button 
                    variant="outline-warning" 
                    size="sm" 
                    className="me-2 mb-2 w-100"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'pending')}
                  >
                    En attente
                  </Button>
                </Col>
                <Col md={4}>
                  <Button 
                    variant="outline-info" 
                    size="sm" 
                    className="me-2 mb-2 w-100"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'confirmed')}
                  >
                    Confirmer
                  </Button>
                </Col>
                <Col md={4}>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="me-2 mb-2 w-100"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                  >
                    Expédier
                  </Button>
                </Col>
                <Col md={4}>
                  <Button 
                    variant="outline-success" 
                    size="sm" 
                    className="me-2 mb-2 w-100"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                  >
                    Livrer
                  </Button>
                </Col>
                <Col md={4}>
                  <Button 
                    variant="outline-danger" 
                    size="sm" 
                    className="me-2 mb-2 w-100"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                  >
                    Annuler
                  </Button>
                </Col>
              </Row>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Fermer
          </Button>
          <Button variant="primary">
            <FaPrint className="me-2" /> Imprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrdersTab;