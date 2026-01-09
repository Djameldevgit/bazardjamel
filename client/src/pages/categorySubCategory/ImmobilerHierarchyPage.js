// src/pages/categorySubCategory/ImmobilerHierarchyPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getPostsByImmobilierOperation } from '../../redux/actions/postAction';
import Posts from '../../components/home/Posts';
import LoadingSpinner from '../../components/extra/LoadingSpinner';

// Configuración de operaciones de inmuebles
const IMMOBILIER_OPERATIONS = [
  { id: 'vente', name: 'Vente', icon: '💰', description: 'Acheter un bien immobilier' },
  { id: 'location', name: 'Location', icon: '🏠', description: 'Louer un bien' },
  { id: 'location_vacances', name: 'Location Vacances', icon: '🌴', description: 'Location saisonnière' },
  { id: 'cherche_location', name: 'Cherche Location', icon: '🔍', description: 'Recherche location' },
  { id: 'cherche_achat', name: 'Cherche Achat', icon: '💰🔍', description: 'Recherche achat' }
];

// Tipos de propiedades
const PROPERTY_TYPES = [
  { id: 'appartement', name: 'Appartement', icon: '🏢' },
  { id: 'villa', name: 'Villa', icon: '🏡' },
  { id: 'maison', name: 'Maison', icon: '🏠' },
  { id: 'terrain', name: 'Terrain', icon: '🌳' },
  { id: 'bureau', name: 'Bureau', icon: '💼' },
  { id: 'commerce', name: 'Commerce', icon: '🏪' },
  { id: 'garage', name: 'Garage', icon: '🚗' },
  { id: 'local', name: 'Local', icon: '🏭' }
];

const ImmobilerHierarchyPage = () => {
  const { slug, page = "1" } = useParams();
  const history = useHistory();
  const dispatch = useDispatch();
  
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const { immobilierPosts, immobilierOperation } = useSelector(state => state.homePosts || {});

  useEffect(() => {
    const parseSlug = () => {
      if (!slug || slug === 'immobilier') {
        // Nivel 0: Solo categoría inmobiler
        setSelectedOperation(null);
        setSelectedProperty(null);
        return;
      }
      
      // Eliminar "immobilier-" del slug
      const operationSlug = slug.replace('immobilier-', '');
      const parts = operationSlug.split('-');
      
      if (parts.length >= 1) {
        const operation = parts[0];
        setSelectedOperation(operation);
        
        // Verificar si hay tipo de propiedad
        if (parts.length >= 2) {
          const property = parts.slice(1).join('-');
          setSelectedProperty(property);
        } else {
          setSelectedProperty(null);
        }
        
        // Cargar posts para esta operación
        setLoading(true);
        dispatch(getPostsByImmobilierOperation(operation, parseInt(page)))
          .finally(() => setLoading(false));
      }
    };
    ImmobilerHierarchyPage
    parseSlug();
  }, [slug, page, dispatch]);

  const handleOperationClick = (operationId) => {
    // Navegar a: /immobilier-vente/1
    history.push(`/immobilier-${operationId}/1`);
  };

  const handlePropertyClick = (propertyId) => {
    if (selectedOperation) {
      // Navegar a: /immobilier-vente-appartement/1
      history.push(`/immobilier-${selectedOperation}-${propertyId}/1`);
    }
  };

  const handleBackToOperations = () => {
    history.push('/immobilier/1');
  };

  const handleBackToProperties = () => {
    if (selectedOperation) {
      history.push(`/immobilier-${selectedOperation}/1`);
    }
  };

  // Obtener información de la operación seleccionada
  const getCurrentOperation = () => {
    return IMMOBILIER_OPERATIONS.find(op => op.id === selectedOperation);
  };

  // Obtener información de la propiedad seleccionada
  const getCurrentProperty = () => {
    return PROPERTY_TYPES.find(prop => prop.id === selectedProperty);
  };

  // Renderizar según el nivel
  if (!selectedOperation) {
    // 🎯 NIVEL 0: Mostrar todas las operaciones
    return (
      <div className="container py-4">
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold">🏠 Immobilier</h1>
          <p className="lead text-muted">Trouvez ou proposez des biens immobiliers</p>
        </div>

        <div className="row g-4">
          {IMMOBILIER_OPERATIONS.map(operation => (
            <div key={operation.id} className="col-md-6 col-lg-4">
              <div 
                className="card h-100 shadow-sm border-0 hover-card"
                onClick={() => handleOperationClick(operation.id)}
                style={{
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  borderRadius: '15px',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                }}
              >
                <div className="card-body text-center p-4">
                  <div className="display-1 mb-3" style={{ fontSize: '3.5rem' }}>
                    {operation.icon}
                  </div>
                  <h3 className="h4 fw-bold mb-2">{operation.name}</h3>
                  <p className="text-muted mb-0">{operation.description}</p>
                </div>
                <div className="card-footer bg-transparent border-0 text-center py-3">
                  <span className="btn btn-primary px-4">
                    Voir les annonces <i className="fas fa-arrow-right ms-2"></i>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (selectedOperation && !selectedProperty) {
    // 🎯 NIVEL 1: Mostrar tipos de propiedades para la operación seleccionada
    const currentOp = getCurrentOperation();
    
    return (
      <div className="container py-4">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <button 
                className="btn btn-link p-0 text-decoration-none"
                onClick={handleBackToOperations}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Immobilier
              </button>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {currentOp?.name || selectedOperation}
            </li>
          </ol>
        </nav>

        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold">
            {currentOp?.icon} {currentOp?.name || selectedOperation}
          </h1>
          <p className="lead text-muted">{currentOp?.description}</p>
        </div>

        {/* Filtro por tipo de propiedad */}
        <div className="card mb-5">
          <div className="card-body">
            <h2 className="h5 mb-3">Filtrer par type de bien</h2>
            <div className="d-flex flex-wrap gap-2">
              <button
                className="btn btn-outline-secondary"
                onClick={() => history.push(`/immobilier-${selectedOperation}/1`)}
              >
                <i className="fas fa-layer-group me-2"></i>
                Tous les types
              </button>
              
              {PROPERTY_TYPES.map(property => (
                <button
                  key={property.id}
                  onClick={() => handlePropertyClick(property.id)}
                  className="btn btn-outline-primary d-flex align-items-center gap-2"
                  style={{
                    borderRadius: '20px',
                    padding: '8px 16px'
                  }}
                >
                  <span className="fs-5">{property.icon}</span>
                  <span>{property.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts de esta operación */}
        <div className="mt-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="h4 mb-0">
              <i className="fas fa-home me-2"></i>
              Toutes les annonces {currentOp?.name ? `en ${currentOp.name.toLowerCase()}` : ''}
            </h2>
            <span className="badge bg-primary fs-6">
              {immobilierPosts?.length || 0} annonces
            </span>
          </div>
          
          {loading ? (
            <LoadingSpinner />
          ) : (
            <Posts 
              fromImmobilerPage={true}
              selectedCategory="immobilier"
              selectedSubcategory={selectedOperation}
              page={parseInt(page)}
            />
          )}
        </div>
      </div>
    );
  }

  // 🎯 NIVEL 2: Mostrar posts específicos de operación + propiedad
  const currentOp = getCurrentOperation();
  const currentProp = getCurrentProperty();
  
  return (
    <div className="container py-4">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <button 
              className="btn btn-link p-0 text-decoration-none"
              onClick={handleBackToOperations}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Immobilier
            </button>
          </li>
          <li className="breadcrumb-item">
            <button 
              className="btn btn-link p-0 text-decoration-none"
              onClick={handleBackToProperties}
            >
              {currentOp?.name || selectedOperation}
            </button>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {currentProp?.name || selectedProperty}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold">
          {currentOp?.icon} {currentOp?.name} - {currentProp?.icon} {currentProp?.name || selectedProperty}
        </h1>
        <p className="lead text-muted">
          {currentProp?.name ? `${currentProp.name}s` : 'Biens'} {currentOp?.description?.toLowerCase()}
        </p>
      </div>

      {/* Posts filtrados */}
      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="h4 mb-0">
            <i className="fas fa-filter me-2"></i>
            Résultats filtrés
          </h2>
          <div>
            <button 
              className="btn btn-outline-secondary me-2"
              onClick={handleBackToProperties}
            >
              <i className="fas fa-times me-2"></i>
              Retirer le filtre
            </button>
            <span className="badge bg-info fs-6">
              {immobilierPosts?.length || 0} résultats
            </span>
          </div>
        </div>
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Posts 
            fromImmobilerPage={true}
            selectedCategory="immobilier"
            selectedSubcategory={`${selectedOperation}-${selectedProperty}`}
            page={parseInt(page)}
          />
        )}
      </div>
    </div>
  );
};

// Estilos CSS
const styles = `
  .hover-card {
    transition: all 0.3s ease;
  }
  
  .hover-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
  }
  
  .breadcrumb {
    background: transparent;
    padding: 0;
  }
  
  .breadcrumb-item button {
    color: #6c757d;
  }
  
  .breadcrumb-item button:hover {
    color: #0d6efd;
  }
  
  .breadcrumb-item.active {
    color: #212529;
    font-weight: 500;
  }
`;

// Agregar estilos al documento
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default ImmobilerHierarchyPage;