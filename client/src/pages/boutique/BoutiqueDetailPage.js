// pages/boutique/BoutiqueDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Card, Spinner, Tabs, Tab } from 'react-bootstrap';
import { getBoutique } from '../../redux/actions/boutiqueAction';
import NotFound from '../../components/NotFound';
import BoutiqueHeader from '../../components/boutique/BoutiqueHeader';
import BoutiqueSidebar from '../../components/boutique/BoutiqueSidebar';
import BoutiqueFooter from '../../components/boutique/BoutiqueFooter';
import BoutiquePostsGrid from '../../components/boutique/BoutiquePostsGrid';
import {   FaBoxOpen, FaInfoCircle } from 'react-icons/fa';
 
// Componentes existentes
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
  const { auth } = useSelector(state => state);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('produits'); // 'produits' por defecto para visitantes

  const isOwner = auth.user?._id === currentBoutique?.user;

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

  const renderOwnerContent = () => {
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
          {/* Sidebar - SOLO para el dueño */}
          {isOwner ? (
            <Col lg={3} className="mb-4">
              <BoutiqueSidebar 
                boutique={currentBoutique}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </Col>
          ) : null}

          {/* Contenido principal */}
          <Col lg={isOwner ? 9 : 12}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                {isOwner ? (
                  // Vista para el dueño
                  renderOwnerContent()
                ) : (
                  // Vista pública para visitantes
                  <div>
                    {/* Tabs para visitantes */}
                    <Tabs
                      activeKey={activeTab}
                      onSelect={(k) => setActiveTab(k)}
                      className="mb-4"
                    >
                      <Tab 
                        eventKey="produits" 
                        title={
                          <span>
                            <FaBoxOpen className="me-2" />
                            Produits ({currentBoutique.stats?.produits || 0})
                          </span>
                        }
                      >
                        <BoutiquePostsGrid boutique={currentBoutique} />
                      </Tab>
                      <Tab 
                        eventKey="infos" 
                        title={
                          <span>
                            <FaInfoCircle className="me-2" />
                            À propos
                          </span>
                        }
                      >
                        <div className="p-3">
                          <h5>Description</h5>
                          <p>{currentBoutique.description_boutique}</p>
                          
                          {currentBoutique.proprietaire && (
                            <>
                              <h5 className="mt-4">Contact</h5>
                              <p>
                                <strong>Wilaya:</strong> {currentBoutique.proprietaire.wilaya}<br />
                                <strong>Téléphone:</strong> {currentBoutique.proprietaire.telephone}<br />
                                <strong>Email:</strong> {currentBoutique.proprietaire.email}
                              </p>
                            </>
                          )}
                        </div>
                      </Tab>
                    </Tabs>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <BoutiqueFooter boutique={currentBoutique} />
    </div>
  );
};

export default BoutiqueDetailPage;