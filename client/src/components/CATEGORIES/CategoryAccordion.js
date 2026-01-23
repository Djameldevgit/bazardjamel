// 📂 components/CATEGORIES/CategoryAccordion.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux'; // ⭐ Solo useSelector, NO dispatch
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  Spinner, 
  Alert, 
  Badge, 
  InputGroup, 
  FormControl,
  Button 
} from 'react-bootstrap';

const CategoryAccordion = ({ 
  postData = {}, 
  handleChangeInput,
  onFieldChange,
  disabled = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState({});
  const [selectedPath, setSelectedPath] = useState([]);
  
  // ⭐ Solo obtener datos, NO cargarlos
  const { 
    categories = [], 
    loading, 
    error 
  } = useSelector((state) => ({
    categories: state.category?.categories || [],
    loading: state.category?.loading || false,
    error: state.category?.error || null
  }));

  // ⭐ DEBUG: Ver qué recibimos
  useEffect(() => {
    if (categories.length > 0 && !loading) {
      console.log('🎯 CategoryAccordion recibió:', categories.length, 'categorías');
      console.log('📋 Ejemplo de categoría:', {
        name: categories[0]?.name,
        level: categories[0]?.level,
        hasChildren: categories[0]?.hasChildren,
        childrenCount: categories[0]?.children?.length || 0,
        firstChild: categories[0]?.children?.[0] && {
          name: categories[0].children[0].name,
          level: categories[0].children[0].level,
          hasChildren: categories[0].children[0].hasChildren,
          childrenCount: categories[0].children[0].children?.length || 0
        }
      });
    }
  }, [categories, loading]);

  // Sincronizar con formulario
  useEffect(() => {
    if (postData.categorie && categories.length > 0) {
      console.log('🔄 Sincronizando con:', postData.categorie);
      
      const findCategory = (items, target, path = []) => {
        for (const item of items) {
          if (!item) continue;
          
          const currentPath = [...path, item];
          
          const matches = 
            item.slug?.includes(target) ||
            item.name?.toLowerCase() === target.toLowerCase();
          
          if (matches) {
            console.log('✅ Encontrado:', item.name);
            setSelectedPath(currentPath);
            return true;
          }
          
          if (item.children && item.children.length > 0) {
            const found = findCategory(item.children, target, currentPath);
            if (found) return true;
          }
        }
        return false;
      };
      
      findCategory(categories, postData.categorie);
    }
  }, [postData.categorie, categories]);

  // Manejar clic - VERSIÓN SIMPLE
  const handleCategoryClick = (category, path = []) => {
    if (disabled || !category) return;
    
    console.log('🖱️ Click en:', category.name, {
      hasChildren: category.children?.length > 0,
      childrenCount: category.children?.length || 0
    });
    
    const currentPath = [...path, category];
    
    // Si tiene hijos, expandir/colapsar
    if (category.children && category.children.length > 0) {
      setExpandedItems(prev => ({
        ...prev,
        [category._id]: !prev[category._id]
      }));
    } else {
      // Si no tiene hijos, seleccionar
      handleCategorySelection(category, currentPath);
    }
  };

  // Seleccionar categoría
  const handleCategorySelection = (category, path) => {
    if (!category) return;
    
    console.log('🎯 Seleccionando:', {
      name: category.name,
      pathLength: path.length,
      pathNames: path.map(p => p.name).join(' > ')
    });
    
    const updates = {};
    
    // Solo actualizar los campos necesarios
    if (path.length >= 1) {
      const mainCat = path[0];
      updates.categorie = mainCat.slug?.split('-')[0] || mainCat.name;
    }
    
    if (path.length >= 2) {
      const subCat = path[1];
      updates.subCategory = subCat.slug?.split('-').pop() || subCat.name;
    }
    
    if (path.length >= 3) {
      const articleCat = path[2];
      updates.articleType = articleCat.slug?.split('-').pop() || articleCat.name;
    }
    
    // Aplicar al formulario
    Object.entries(updates).forEach(([field, value]) => {
      if (handleChangeInput) {
        handleChangeInput({
          target: { name: field, value }
        });
      }
      
      if (onFieldChange) onFieldChange(field, value);
    });
    
    setSelectedPath(path);
  };

  // Renderizar categorías
  const renderCategories = (items, depth = 0, path = []) => {
    if (!items || items.length === 0) {
      return <div className="text-center py-3 text-muted">No hay elementos</div>;
    }

    return items.map((item) => {
      if (!item || !item.name) return null;
      
      const currentPath = [...path, item];
      const isExpanded = expandedItems[item._id];
      const isSelected = selectedPath.some(p => p._id === item._id);
      const hasChildren = item.children && item.children.length > 0;
      
      return (
        <div key={item._id || item.name} className="category-item-wrapper">
          <motion.div
            className="category-item"
            style={{
              marginLeft: `${depth * 20}px`,
              marginBottom: '6px',
              borderRadius: '8px',
              overflow: 'hidden'
            }}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
          >
            <div
              className="category-content"
              style={{
                padding: '12px 16px',
                backgroundColor: isSelected ? '#e3f2fd' : (depth === 0 ? '#f8f9fa' : '#ffffff'),
                borderLeft: `4px solid ${isSelected ? '#1976d2' : (hasChildren ? '#6c757d' : '#4caf50')}`,
                cursor: disabled ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: `1px solid ${isSelected ? '#1976d2' : '#e0e0e0'}`
              }}
              onClick={() => !disabled && handleCategoryClick(item, path)}
            >
              <div className="d-flex align-items-center flex-grow-1">
                {/* Icono */}
                <span className="me-3" style={{ fontSize: '20px' }}>
                  {item.emoji || (hasChildren ? '📁' : '📄')}
                </span>
                
                {/* Nombre */}
                <span className="fw-medium">{item.name}</span>
                
                {/* Badge */}
                <div className="ms-2">
                  {isSelected ? (
                    <Badge bg="success" className="px-2 py-1">
                      Selected
                    </Badge>
                  ) : hasChildren ? (
                    <Badge bg="secondary" className="px-2 py-1">
                      {item.children.length} items
                    </Badge>
                  ) : (
                    <Badge bg="info" className="px-2 py-1">
                      Select
                    </Badge>
                  )}
                </div>
              </div>
              
              {/* Flecha si tiene hijos */}
              {hasChildren && (
                <motion.span
                  animate={{ rotate: isExpanded ? 90 : 0 }}
                  style={{ fontSize: '14px', color: '#6c757d' }}
                >
                  ▶
                </motion.span>
              )}
            </div>
          </motion.div>
          
          {/* Renderizar hijos si está expandido */}
          <AnimatePresence>
            {hasChildren && isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ overflow: 'hidden' }}
              >
                {renderCategories(item.children, depth + 1, currentPath)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    });
  };

  // Estados
  if (loading && categories.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <Card.Body className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Cargando categorías...</p>
        </Card.Body>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-0 shadow-sm">
        <Card.Body className="py-4">
          <Alert variant="danger">
            <i className="fas fa-exclamation-triangle me-2"></i>
            Error: {error}
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  if (!loading && categories.length === 0) {
    return (
      <Card className="border-0 shadow-sm">
        <Card.Body className="text-center py-5">
          <div className="mb-3">
            <span style={{ fontSize: '48px' }}>📭</span>
          </div>
          <h5>No hay categorías</h5>
          <p className="text-muted">
            Ve a la página principal primero para cargar las categorías.
          </p>
        </Card.Body>
      </Card>
    );
  }

  // Filtrar por búsqueda
  const filteredCategories = categories.filter(cat => 
    !searchTerm.trim() || 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card  >
      
        <div className="p-1 border-bottom">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Card.Title className="mb-0 fs-5">
              <i className="fas fa-tags me-2"></i>
              Seleccionar categoría
            </Card.Title>
            <Badge bg="light" text="dark">
              {categories.length} total
            </Badge>
          </div>
          
          <InputGroup>
            <InputGroup.Text>
              <i className="fas fa-search"></i>
            </InputGroup.Text>
            <FormControl
              placeholder="Buscar categorías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={disabled}
            />
          </InputGroup>
        </div>

        {/* Ruta seleccionada */}
        {selectedPath.length > 0 && (
          <div className="p-1 border-bottom bg-light">
            <div className="d-flex align-items-center">
              <span className="me-1">📍</span>
              <div>
                <small className="text-muted">Seleccionado:</small>
                <div className="d-flex align-items-center flex-wrap mt-1">
                  {selectedPath.map((cat, index) => (
                    <React.Fragment key={cat._id || index}>
                      <Badge bg="primary" className="me-1 mb-1">
                        {cat.emoji || '📄'} {cat.name}
                      </Badge>
                      {index < selectedPath.length - 1 && (
                        <span className="mx-1 text-muted">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Lista de categorías */}
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {filteredCategories.length === 0 ? (
            <div className="text-center py-4">
              <span className="text-muted">
                {searchTerm ? `No hay resultados para "${searchTerm}"` : 'No hay categorías'}
              </span>
            </div>
          ) : (
            renderCategories(filteredCategories)
          )}
        </div>

        {/* Instrucciones */}
        <div className="p-3 border-top bg-light">
          <small className="text-muted">
            <i className="fas fa-info-circle me-1"></i>
            Haz clic en las categorías para expandir y seleccionar
          </small>
        </div>
      
    </Card>
  );
};

export default CategoryAccordion;