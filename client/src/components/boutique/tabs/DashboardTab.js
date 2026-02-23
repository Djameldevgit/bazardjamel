// components/boutique/tabs/DashboardTab.jsx
import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { 
  FaEye, 
  FaBoxOpen, 
  FaStar, 
  FaUsers,
  FaChartLine,
  FaShoppingCart
} from 'react-icons/fa';

const DashboardTab = ({ boutique }) => {
  const { stats = {}, nom_boutique } = boutique;

  const cards = [
    {
      title: 'Vues totales',
      value: stats.vues?.toLocaleString() || 0,
      icon: <FaEye size={24} />,
      color: '#3b82f6',
      bg: '#eef2ff'
    },
    {
      title: 'Produits',
      value: stats.produits || 0,
      icon: <FaBoxOpen size={24} />,
      color: '#10b981',
      bg: '#e6f7f0'
    },
    {
      title: 'Note moyenne',
      value: `${stats.notes?.toFixed(1) || 0}/5`,
      icon: <FaStar size={24} />,
      color: '#f59e0b',
      bg: '#fef3c7'
    },
    {
      title: 'Avis',
      value: stats.avis || 0,
      icon: <FaUsers size={24} />,
      color: '#8b5cf6',
      bg: '#f0e9ff'
    }
  ];

  return (
    <div className="dashboard-tab">
      <h4 className="mb-4">Tableau de bord - {nom_boutique}</h4>
      
      <Row className="g-4 mb-4">
        {cards.map((card, index) => (
          <Col md={3} key={index}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div 
                    className="icon-wrapper rounded-circle p-3 me-3"
                    style={{ backgroundColor: card.bg }}
                  >
                    <div style={{ color: card.color }}>
                      {card.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-0 fw-bold">{card.value}</h3>
                    <small className="text-muted">{card.title}</small>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4">
        <Col md={8}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Activité récente</h5>
              <p className="text-muted text-center py-5">
                <FaChartLine size={48} className="mb-3 text-secondary" />
                <br />
                Graphique d'activité à venir
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Dernières commandes</h5>
              <p className="text-muted text-center py-5">
                <FaShoppingCart size={48} className="mb-3 text-secondary" />
                <br />
                Aucune commande récente
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardTab;