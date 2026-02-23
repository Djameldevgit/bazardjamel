// pages/BoutiqueDetailPage.jsx (versión con sidebar)
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Spinner, Image } from 'react-bootstrap';
import { getBoutique } from '../../redux/actions/boutiqueAction';
import NotFound from '../../components/NotFound';
import BoutiqueHeader from '../../components/boutique/BoutiqueHeader';
import BoutiqueSidebar from '../../components/boutique/BoutiqueSidebar';
import BoutiqueFooter from '../../components/boutique/BoutiqueFooter';
import { FaStore } from 'react-icons/fa';

// Componentes de contenido para cada pestaña
import DashboardTab from '../../components/boutique/tabs/DashboardTab';
import InfoTab from '../../components/boutique/tabs/InfoTab';
import ImagesTab from '../../components/boutique/tabs/ImagesTab';
import ProductsListTab from '../../components/boutique/tabs/ProductsListTab';
import AddProductTab from '../../components/boutique/tabs/AddProductTab';
import CategoriesTab from '../../components/boutique/tabs/CategoriesTab';
import OrdersTab from '../../components/boutique/tabs/OrdersTab';
import TransactionsTab from '../../components/boutique/tabs/TransactionsTab';
import SettingsTab from '../../components/boutique/tabs/SettingsTab';

const BoutiqueDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentBoutique, loading } = useSelector(state => state.boutique);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (id) {
      dispatch(getBoutique(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (currentBoutique?.images?.length > 0) {
      setActiveImage(0);
    }
  }, [currentBoutique]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Chargement de la boutique...</p>
      </Container>
    );
  }

  if (!currentBoutique) return <NotFound />;

  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return <DashboardTab boutique={currentBoutique} />;
      case 'info':
        return <InfoTab boutique={currentBoutique} />;
      case 'images':
        return <ImagesTab 
          boutique={currentBoutique} 
          activeImage={activeImage}
          setActiveImage={setActiveImage}
        />;
      case 'products-list':
        return <ProductsListTab boutique={currentBoutique} />;
      case 'add-product':
        return <AddProductTab boutique={currentBoutique} />;
      case 'categories':
        return <CategoriesTab boutique={currentBoutique} />;
      case 'orders-list':
      case 'pending-orders':
      case 'completed-orders':
        return <OrdersTab boutique={currentBoutique} type={activeTab} />;
      case 'transactions':
      case 'subscription':
        return <TransactionsTab boutique={currentBoutique} type={activeTab} />;
      case 'profile':
      case 'social':
      case 'notifications':
        return <SettingsTab boutique={currentBoutique} type={activeTab} />;
      default:
        return <DashboardTab boutique={currentBoutique} />;
    }
  };

  return (
    <div className="boutique-detail-page" style={{ backgroundColor: '#f8f9fa' }}>
      
      <BoutiqueHeader boutique={currentBoutique} />

      <Container className="mt-4">
        <Row>
          {/* Sidebar - Columna izquierda */}
          <Col lg={3} className="mb-4">
            <BoutiqueSidebar 
              boutique={currentBoutique}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </Col>

          {/* Contenido principal - Columna derecha */}
          <Col lg={9}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                {renderTabContent()}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <BoutiqueFooter boutique={currentBoutique} />

      <style jsx="true">{`
        .boutique-sidebar .menu-header:hover {
          background-color: #f8f9fa;
        }
        .boutique-sidebar .nav-link:hover {
          background-color: #f8f9fa;
          color: ${currentBoutique.couleur_theme} !important;
        }
      `}</style>
    </div>
  );
};

export default BoutiqueDetailPage;