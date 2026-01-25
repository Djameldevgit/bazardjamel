// 📂 components/CATEGORIES/CategoryAccordion.jsx
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Spinner, Alert } from 'react-bootstrap';

const CategoryAccordion = ({ 
  postData = {}, 
  handleChangeInput,
  onFieldChange,
  disabled = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState({});
  const [selectedPath, setSelectedPath] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // 🔄 Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Obtener categorías
  const { categories = [], loading, error } = useSelector((state) => ({
    categories: state.category?.categories || [],
    loading: state.category?.loading || false,
    error: state.category?.error || null
  }));

  // Manejar clic
  const handleCategoryClick = (category, path = []) => {
    if (disabled || !category) return;
    
    const currentPath = [...path, category];
    
    if (category.children?.length > 0) {
      setExpandedItems(prev => ({
        ...prev,
        [category._id]: !prev[category._id]
      }));
    } else {
      handleCategorySelection(category, currentPath);
    }
  };

  // Seleccionar categoría
  const handleCategorySelection = (category, path) => {
    if (!category) return;
    
    const updates = {};
    if (path.length >= 1) updates.categorie = path[0].name;
    if (path.length >= 2) updates.subCategory = path[1].name;
    if (path.length >= 3) updates.articleType = path[2].name;
    
    Object.entries(updates).forEach(([field, value]) => {
      if (handleChangeInput) {
        handleChangeInput({ target: { name: field, value } });
      }
      if (onFieldChange) onFieldChange(field, value);
    });
    
    setSelectedPath(path);
  };

  // Renderizar categorías
  const renderCategoryItem = (item, depth = 0, path = []) => {
    if (!item || !item.name) return null;
    
    const currentPath = [...path, item];
    const isExpanded = expandedItems[item._id];
    const isSelected = selectedPath.some(p => p._id === item._id);
    const hasChildren = item.children && item.children.length > 0;

    return (
      <div key={item._id} className="category-node">
        <motion.div
          className={`category-card ${isSelected ? 'selected' : ''}`}
          style={{ marginLeft: `${depth * (isMobile ? 12 : 16)}px` }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div
            className="category-header"
            onClick={() => !disabled && handleCategoryClick(item, path)}
          >
            <div className="category-left">
              {/* EMOJI */}
              <div className="category-emoji">
                {item.emoji || (hasChildren ? '📁' : '📄')}
              </div>
              
              {/* NOMBRE */}
              <div className="category-name">
                {item.name}
                {isMobile && hasChildren && (
                  <span className="mobile-badge">{item.children.length}</span>
                )}
              </div>
            </div>
            
            <div className="category-right">
              {/* PUNTO VERDE DE CHAT - NUEVO */}
              {hasChildren && (
                <div className="chat-dot-wrapper">
                  <div className={`chat-dot ${isExpanded ? 'active' : ''}`}>
                    <div className="dot-inner"></div>
                    <div className="dot-pulse"></div>
                  </div>
                </div>
              )}
              
              {/* CHECK DE SELECCIÓN */}
              {isSelected && (
                <div className="check-indicator">
                  <span>✓</span>
                </div>
              )}
              
              {/* FLECHA */}
              {hasChildren && (
                <motion.div
                  className="expand-arrow"
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>›</span>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* SUBCATEGORÍAS */}
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              className="subcategories-wrapper"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {item.children.map(child => 
                renderCategoryItem(child, depth + 1, currentPath)
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Estados de carga
  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" />
        <p>Cargando categorías...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <i className="fas fa-exclamation-triangle me-2"></i>
        Error: {error}
      </Alert>
    );
  }

  if (categories.length === 0) {
    return (
      <Card className="text-center py-4">
        <div className="empty-icon">📭</div>
        <h5>No hay categorías</h5>
      </Card>
    );
  }

  // Filtrar categorías
  const filteredCategories = categories.filter(cat => 
    !searchTerm.trim() || 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="category-accordion">
      {/* BARRA DE BÚSQUEDA */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <i className="fas fa-search search-icon"></i>
          <input
            type="text"
            placeholder="Buscar categorías..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={disabled}
            className="search-input"
          />
        </div>
      </div>

      {/* RUTA SELECCIONADA */}
      {selectedPath.length > 0 && (
        <div className="selected-path">
          <div className="selected-label">Seleccionado:</div>
          <div className="path-items">
            {selectedPath.map((cat, index) => (
              <React.Fragment key={cat._id}>
                <div className="path-item">
                  {cat.emoji || '📄'} {cat.name}
                </div>
                {index < selectedPath.length - 1 && (
                  <span className="path-separator">→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* LISTA DE CATEGORÍAS */}
      <div className="categories-list">
        {filteredCategories.length === 0 ? (
          <div className="no-results">
            {searchTerm ? `No hay resultados para "${searchTerm}"` : 'No hay categorías'}
          </div>
        ) : (
          filteredCategories.map(cat => renderCategoryItem(cat))
        )}
      </div>

      {/* INSTRUCCIONES - SIN ERROR DE hasChildren */}
      <div className="instructions">
        <i className="fas fa-info-circle"></i>
        <span>Haz clic para expandir categorías</span>
      </div>

      {/* ESTILOS COMPLETAMENTE NUEVOS */}
      <style jsx>{`
        .category-accordion {
          width: 100%;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0,0,0,0.08);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        /* BARRA DE BÚSQUEDA */
        .search-bar {
          padding: ${isMobile ? '12px' : '16px'};
          border-bottom: 1px solid #eee;
        }

        .search-input-wrapper {
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #888;
        }

        .search-input {
          width: 100%;
          padding: ${isMobile ? '10px 10px 10px 36px' : '12px 12px 12px 40px'};
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
        }

        .search-input:focus {
          outline: none;
          border-color: #10B981;
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
        }

        /* RUTA SELECCIONADA */
        .selected-path {
          padding: ${isMobile ? '10px 16px' : '12px 20px'};
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .selected-label {
          font-size: 12px;
          color: #64748b;
          margin-bottom: 4px;
        }

        .path-items {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
        }

        .path-item {
          background: #10B981;
          color: white;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
        }

        .path-separator {
          color: #94a3b8;
          font-size: 12px;
        }

        /* LISTA DE CATEGORÍAS */
        .categories-list {
          padding: ${isMobile ? '12px' : '16px'};
          max-height: 500px;
          overflow-y: auto;
        }

        .no-results {
          text-align: center;
          padding: 32px 16px;
          color: #64748b;
        }

        /* NODO DE CATEGORÍA */
        .category-node {
          margin-bottom: 4px;
        }

        .category-card {
          background: white;
          border: 2px solid #f1f5f9;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .category-card.selected {
          border-color: #10B981;
          background: #f0fdf4;
        }

        .category-card:hover {
          border-color: #cbd5e1;
        }

        .category-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: ${isMobile ? '12px' : '16px'};
          cursor: pointer;
          user-select: none;
        }

        .category-left {
          display: flex;
          align-items: center;
          gap: 12px;
          flex: 1;
          min-width: 0;
        }

        .category-emoji {
          font-size: ${isMobile ? '20px' : '24px'};
          flex-shrink: 0;
        }

        .category-name {
          font-weight: 500;
          color: #1e293b;
          font-size: ${isMobile ? '14px' : '15px'};
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .mobile-badge {
          background: #e2e8f0;
          color: #475569;
          font-size: 10px;
          padding: 1px 6px;
          border-radius: 10px;
          margin-left: 6px;
        }

        .category-right {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* PUNTO VERDE DE CHAT - ESTILO NUEVO */
        .chat-dot-wrapper {
          position: relative;
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .chat-dot {
          position: relative;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dot-inner {
          width: 8px;
          height: 8px;
          background: #10B981;
          border-radius: 50%;
          position: relative;
          z-index: 2;
          transition: all 0.3s ease;
        }

        .chat-dot.active .dot-inner {
          background: #059669;
          transform: scale(1.2);
        }

        .dot-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          background: rgba(16, 185, 129, 0.2);
          border-radius: 50%;
          animation: pulse 2s infinite;
          z-index: 1;
        }

        .chat-dot.active .dot-pulse {
          background: rgba(5, 150, 105, 0.3);
          animation: pulse-active 1.5s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          70% { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(0.8); opacity: 0; }
        }

        @keyframes pulse-active {
          0% { transform: scale(0.9); opacity: 0.6; }
          70% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(0.9); opacity: 0; }
        }

        /* CHECK DE SELECCIÓN */
        .check-indicator {
          width: 20px;
          height: 20px;
          background: #10B981;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 12px;
          font-weight: bold;
        }

        /* FLECHA DE EXPANSIÓN */
        .expand-arrow {
          color: #64748b;
          font-size: 16px;
          transform-origin: center;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* SUBCATEGORÍAS */
        .subcategories-wrapper {
          margin-left: ${isMobile ? '20px' : '24px'};
          padding-left: ${isMobile ? '12px' : '16px'};
          border-left: 2px dashed #e2e8f0;
        }

        /* INSTRUCCIONES */
        .instructions {
          padding: 12px 16px;
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          font-size: 12px;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .instructions i {
          font-size: 14px;
        }

        /* SCROLLBAR */
        .categories-list::-webkit-scrollbar {
          width: 6px;
        }

        .categories-list::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .categories-list::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .categories-list::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* ESTADOS DE CARGA */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          gap: 12px;
        }

        .empty-icon {
          font-size: 48px;
          opacity: 0.5;
          margin-bottom: 16px;
        }

        /* RESPONSIVE */
        @media (max-width: 640px) {
          .category-emoji {
            font-size: 18px;
          }
          
          .category-name {
            font-size: 13px;
          }
          
          .chat-dot-wrapper {
            width: 20px;
            height: 20px;
          }
          
          .chat-dot {
            width: 16px;
            height: 16px;
          }
          
          .dot-inner {
            width: 6px;
            height: 6px;
          }
        }

        @media (max-width: 480px) {
          .search-bar {
            padding: 10px;
          }
          
          .search-input {
            padding: 8px 8px 8px 32px;
          }
          
          .category-header {
            padding: 10px;
          }
          
          .categories-list {
            padding: 10px;
          }
        }
      `}</style>
    </div>
  );
};

export default CategoryAccordion;