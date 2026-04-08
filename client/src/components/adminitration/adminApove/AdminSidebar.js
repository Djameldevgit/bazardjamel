// 📂 components/admin/AdminSidebar.js - VERSIÓN CORREGIDA

import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Badge, Spinner, Button } from 'react-bootstrap';
import { 
  FaStore, FaBox, FaChevronDown, FaChevronRight,
  FaClipboardList, FaHourglassHalf, FaTimes,
  FaUserCheck, FaBars
} from 'react-icons/fa';
import { getCategoriesForAccordion } from '../../../redux/actions/categoryAction';

const AdminSidebar = ({ isOpen, onToggle, onSelectCategory, selectedCategory, activeTab, refreshKey }) => {
  const dispatch = useDispatch();
  const { accordionCategories = [], loading } = useSelector(state => state.category || {});
  const { auth } = useSelector(state => state);
  const [openCategories, setOpenCategories] = useState({});
  const [pendingCounts, setPendingCounts] = useState({
    posts: {},
    boutiques: 0,
    products: 0
  });
  const [fetchingCounts, setFetchingCounts] = useState(false);
  
  // Cargar categorías
  useEffect(() => {
    if (accordionCategories.length === 0) {
      dispatch(getCategoriesForAccordion());
    }
  }, [dispatch, accordionCategories.length]);
  
  // Cargar contadores
  const fetchCounts = useCallback(async () => {
    if (!auth?.token) return;
    
    setFetchingCounts(true);
    
    try {
      const postsRes = await fetch('/api/posts/admin/pendientes/counts/all', {
        headers: { Authorization: `Bearer ${auth.token}` }
      });
      
      let postsCounts = {};
      if (postsRes.ok) {
        const postsData = await postsRes.json();
        if (postsData.success) {
          postsCounts = postsData.counts;
        }
      }
      
      let boutiquesCount = 0;
      try {
        const boutiquesRes = await fetch('/api/boutiques/admin/pendientes/count', {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        if (boutiquesRes.ok) {
          const boutiquesData = await boutiquesRes.json();
          if (boutiquesData.success) boutiquesCount = boutiquesData.count;
        }
      } catch (err) {
        console.error('Error fetching boutiques count:', err);
      }
      
      let productsCount = 0;
      try {
        const productsRes = await fetch('/api/boutiques/products/pendientes/count', {
          headers: { Authorization: `Bearer ${auth.token}` }
        });
        if (productsRes.ok) {
          const productsData = await productsRes.json();
          if (productsData.success) productsCount = productsData.count;
        }
      } catch (err) {
        console.error('Error fetching products count:', err);
      }
      
      setPendingCounts({
        posts: postsCounts,
        boutiques: boutiquesCount,
        products: productsCount
      });
      
    } catch (error) {
      console.error('Error fetching counts:', error);
    } finally {
      setFetchingCounts(false);
    }
  }, [auth?.token]);
  
  useEffect(() => {
    if (auth?.token) {
      fetchCounts();
    }
  }, [auth?.token, refreshKey, fetchCounts]);
  
  const toggleCategory = (categoryId) => {
    setOpenCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };
  
  // 🔥 FUNCIÓN CORREGIDA: Manejar clic en categoría/subcategoría
  const handleCategoryClick = (category, isSubCategory = false) => {
    console.log('🖱️ Clic en:', category.name, 'esSubCategory:', isSubCategory);
    
    if (isSubCategory) {
      // Es una subcategoría (nivel 2 o 3)
      // Buscar la categoría padre para enviar ambos filtros
      const parentCategory = accordionCategories.find(parent => 
        parent.children?.some(child => child._id === category._id)
      );
      
      onSelectCategory({
        slug: category.slug,
        name: category.name,
        categorie: parentCategory?.slug, // Categoría padre para filtrar
        subCategory: category.slug        // Subcategoría para filtrar
      }, 'posts');
    } else {
      // Es una categoría principal (nivel 1)
      onSelectCategory({
        slug: category.slug,
        name: category.name,
        categorie: category.slug,
        subCategory: null
      }, 'posts');
    }
  };
  
  const totalPending = Object.values(pendingCounts.posts).reduce((a, b) => a + b, 0) + 
                       pendingCounts.boutiques + 
                       pendingCounts.products;
  
  const sidebarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: '280px',
    backgroundColor: '#1a1a2e',
    color: '#fff',
    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.3s ease',
    zIndex: 1000,
    overflowY: 'auto',
    boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
  };
  
  if (!isOpen) {
    return (
      <Button
        variant="primary"
        size="sm"
        onClick={onToggle}
        style={{
          position: 'fixed',
          left: 10,
          top: 70,
          zIndex: 999,
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <FaBars />
      </Button>
    );
  }
  
  if (loading || fetchingCounts) {
    return (
      <div style={sidebarStyle} className="d-flex align-items-center justify-content-center">
        <Spinner animation="border" variant="light" size="sm" />
      </div>
    );
  }
  
  return (
    <div style={sidebarStyle}>
      {/* Header */}
      <div className="p-3 border-bottom border-secondary d-flex justify-content-between align-items-center">
        <div>
          <h6 className="mb-0 fw-bold">
            <FaClipboardList className="me-2" />
            Administration
          </h6>
          <small className="text-muted">Gestion des validations</small>
        </div>
        <Button variant="link" className="text-white p-0" onClick={onToggle}>
          <FaTimes />
        </Button>
      </div>
      
      <div className="p-3">
        {/* Stats résumé */}
        <div className="mb-4 p-2 rounded bg-dark bg-opacity-50">
          <div className="d-flex justify-content-between align-items-center">
            <span className="small text-muted">Total en attente</span>
            <Badge bg="danger" pill className="fs-6">
              {totalPending}
            </Badge>
          </div>
        </div>
        
        {/* Module Boutiques */}
        <div className="mb-3">
          <div
            onClick={() => onSelectCategory(null, 'boutiques')}
            className={`d-flex align-items-center justify-content-between p-2 rounded cursor-pointer transition
              ${activeTab === 'boutiques' && !selectedCategory ? 'bg-primary bg-opacity-25' : 'hover-bg-light'}`}
            style={{ cursor: 'pointer' }}
          >
            <div className="d-flex align-items-center gap-2">
              <FaStore style={{ color: '#EC4899' }} />
              <span className="small fw-semibold">Boutiques</span>
            </div>
            {pendingCounts.boutiques > 0 && (
              <Badge bg="warning" pill>{pendingCounts.boutiques}</Badge>
            )}
          </div>
        </div>
        
        {/* Module Produits Boutique */}
        <div className="mb-4">
          <div
            onClick={() => onSelectCategory(null, 'products')}
            className={`d-flex align-items-center justify-content-between p-2 rounded cursor-pointer transition
              ${activeTab === 'products' && !selectedCategory ? 'bg-primary bg-opacity-25' : 'hover-bg-light'}`}
            style={{ cursor: 'pointer' }}
          >
            <div className="d-flex align-items-center gap-2">
              <FaBox style={{ color: '#F59E0B' }} />
              <span className="small fw-semibold">Produits boutique</span>
            </div>
            {pendingCounts.products > 0 && (
              <Badge bg="warning" pill>{pendingCounts.products}</Badge>
            )}
          </div>
        </div>
        
        {/* Section Posts par catégorie */}
        <div className="mb-2">
          <div className="small text-muted mb-2 px-2">POSTS PAR CATÉGORIE</div>
          
          {accordionCategories.map(category => {
            const pendingCount = pendingCounts.posts[category.slug] || 0;
            const isExpanded = openCategories[category._id];
            const hasChildren = category.children && category.children.length > 0;
            const isActive = activeTab === 'posts' && selectedCategory?.slug === category.slug;
            
            return (
              <div key={category._id} className="mb-1">
                {/* Categoría principal */}
                <div
                  onClick={() => {
                    if (hasChildren) {
                      toggleCategory(category._id);
                    } else {
                      handleCategoryClick(category, false);
                    }
                  }}
                  className={`d-flex align-items-center justify-content-between p-2 rounded cursor-pointer transition
                    ${isActive ? 'bg-primary bg-opacity-25' : 'hover-bg-light'}`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center gap-2">
                    {hasChildren && (
                      <span className="small">
                        {isExpanded ? <FaChevronDown size={10} /> : <FaChevronRight size={10} />}
                      </span>
                    )}
                    <span style={{ fontSize: '1rem' }}>{category.emoji || '📁'}</span>
                    <span className="small">{category.name}</span>
                  </div>
                  {pendingCount > 0 && (
                    <Badge bg="warning" pill className="fw-normal">
                      {pendingCount}
                    </Badge>
                  )}
                </div>
                
                {/* Subcategorías - CORREGIDO */}
                {hasChildren && isExpanded && (
                  <div className="ms-3 mt-1">
                    {category.children.map(child => {
                      const childPending = pendingCounts.posts[child.slug] || 0;
                      const isChildActive = activeTab === 'posts' && selectedCategory?.subCategory === child.slug;
                      
                      return (
                        <div
                          key={child._id}
                          onClick={() => handleCategoryClick(child, true)}
                          className={`d-flex align-items-center justify-content-between p-1 ps-3 rounded small cursor-pointer
                            ${isChildActive ? 'bg-primary bg-opacity-25' : 'hover-bg-light'}`}
                          style={{ cursor: 'pointer', fontSize: '0.8rem' }}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <span>{child.emoji || '📄'}</span>
                            <span>{child.name}</span>
                          </div>
                          {childPending > 0 && (
                            <Badge bg="warning" pill className="fw-normal small">
                              {childPending}
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {/* Footer */}
        <div className="mt-4 pt-3 border-top border-secondary">
          <div className="small text-muted text-center">
            <FaUserCheck className="me-1" />
            {auth.user?.name || auth.user?.username || 'Admin'}
          </div>
          <div className="small text-muted text-center mt-1">
            <FaHourglassHalf className="me-1" />
            En attente: {totalPending}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .hover-bg-light:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        .cursor-pointer {
          cursor: pointer;
        }
        .transition {
          transition: all 0.2s ease;
        }
      `}</style>
    </div>
  );
};

export default AdminSidebar;