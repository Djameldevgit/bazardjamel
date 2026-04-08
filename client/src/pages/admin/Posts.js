// 📂 pages/admin/Posts.js - VERSIÓN CORREGIDA
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';
import { Container, Button, Alert } from 'react-bootstrap';
import { FaBars, FaSync } from 'react-icons/fa';

// Importar componentes hijos
import AdminSidebar from '../../components/adminitration/adminApove/AdminSidebar';
import PostsTable from '../../components/adminitration/adminApove/PostsTable';
import BoutiquesTable from '../../components/adminitration/adminApove/BoutiquesTable';
import ProductsTable from '../../components/adminitration/adminApove/ProductsTable';


const Posts = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const { auth } = useSelector(state => state);
  
  // Estado del sidebar
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts', 'boutiques', 'products'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Leer parámetros de la URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    const category = params.get('category');
    const subcategory = params.get('subcategory');
    
    if (tab && ['posts', 'boutiques', 'products'].includes(tab)) {
      setActiveTab(tab);
    }
    
    if (category) {
      setSelectedCategory({ slug: category, name: category, subcategory });
    } else {
      setSelectedCategory(null);
    }
  }, [location.search]);
  
  // Actualizar URL cuando cambia la selección
  const updateUrl = (tab, category, subcategory) => {
    const params = new URLSearchParams();
    if (tab) params.set('tab', tab);
    if (category) params.set('category', category);
    if (subcategory) params.set('subcategory', subcategory);
    
    const newUrl = `/admin/posts${params.toString() ? `?${params.toString()}` : ''}`;
    history.replace(newUrl);
  };
  
  const handleSelectCategory = (category, tab = 'posts') => {
    setActiveTab(tab);
    setSelectedCategory(category);
    updateUrl(tab, category?.slug, category?.subcategory);
  };
  
  const handleSelectTab = (tab) => {
    setActiveTab(tab);
    setSelectedCategory(null);
    updateUrl(tab, null, null);
  };
  
  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };
  
  // Verificar permisos de admin
  const isAdmin = auth.user?.role === 'admin' || auth.user?.role === 'moderator';
  
  if (!isAdmin) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <h5>⛔ Accès non autorisé</h5>
          <p>Vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
          <Button variant="outline-danger" onClick={() => history.push('/')}>
            Retour à l'accueil
          </Button>
        </Alert>
      </Container>
    );
  }
  
  return (
    <div className="min-vh-100 bg-light" style={{ display: 'flex' }}>
      {/* Sidebar Drawer */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onSelectCategory={handleSelectCategory}
        selectedCategory={selectedCategory}
        activeTab={activeTab}
        refreshKey={refreshKey}
      />
      
      {/* Contenido principal */}
      <div style={{
        flex: 1,
        marginLeft: sidebarOpen ? '280px' : '0',
        transition: 'margin-left 0.3s ease',
        width: '100%'
      }}>
        {/* Header móvil */}
        <div className="bg-white border-bottom p-3 d-flex d-md-none align-items-center">
          <Button
            variant="light"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="me-2"
          >
            <FaBars />
          </Button>
          <h5 className="mb-0 fw-bold">Administration</h5>
        </div>
        
        <div className="p-3 p-md-4">
          {/* Barra superior */}
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h4 className="fw-bold mb-0">
                {activeTab === 'posts' && '📋 Gestion des Posts'}
                {activeTab === 'boutiques' && '🏪 Gestion des Boutiques'}
                {activeTab === 'products' && '📦 Gestion des Produits'}
              </h4>
              <p className="text-muted small mb-0">
                {selectedCategory ? `Filtré par: ${selectedCategory.name}` : 'Tous les éléments en attente de validation'}
              </p>
            </div>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleRefresh}
              className="d-flex align-items-center gap-2"
            >
              <FaSync className={loading ? 'fa-spin' : ''} />
              Actualiser
            </Button>
          </div>
          
          {/* Tabs de navegación */}
          <div className="mb-4 border-bottom">
            <nav className="nav nav-tabs border-0">
              <button
                className={`nav-link ${activeTab === 'posts' ? 'active fw-semibold text-primary' : 'text-dark'}`}
                onClick={() => handleSelectTab('posts')}
                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
              >
                📋 Posts
              </button>
              <button
                className={`nav-link ${activeTab === 'boutiques' ? 'active fw-semibold text-primary' : 'text-dark'}`}
                onClick={() => handleSelectTab('boutiques')}
                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
              >
                🏪 Boutiques
              </button>
              <button
                className={`nav-link ${activeTab === 'products' ? 'active fw-semibold text-primary' : 'text-dark'}`}
                onClick={() => handleSelectTab('products')}
                style={{ border: 'none', background: 'none', cursor: 'pointer' }}
              >
                📦 Produits boutique
              </button>
            </nav>
          </div>
          
          {/* Contenido según tab activo */}
          {activeTab === 'posts' && (
            <PostsTable
              key={`posts-${refreshKey}-${selectedCategory?.slug}`}
              selectedCategory={selectedCategory}
              onLoadingChange={setLoading}
            />
          )}
          
          {activeTab === 'boutiques' && (
            <BoutiquesTable
              key={`boutiques-${refreshKey}`}
              onLoadingChange={setLoading}
            />
          )}
          
          {activeTab === 'products' && (
            <ProductsTable
              key={`products-${refreshKey}-${selectedCategory?.slug}`}
              selectedCategory={selectedCategory}
              onLoadingChange={setLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Posts;