// src/pages/categorySubCategory/ImmobilerPage.js - NUEVO ARCHIVO
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { 
    getPostsByImmobilierOperation,
    getPostsByImmobilierProperty 
} from '../../redux/actions/postAction';
import Posts from '../../components/home/Posts';

// Configuración de operaciones y propiedades de inmuebles
const IMMOBILIER_CONFIG = {
    operations: [
        { id: 'vente', name: 'Vente', icon: '💰' },
        { id: 'location', name: 'Location', icon: '🏠' },
        { id: 'location_vacances', name: 'Location Vacances', icon: '🌴' },
        { id: 'cherche_location', name: 'Cherche Location', icon: '🔍' },
        { id: 'cherche_achat', name: 'Cherche Achat', icon: '💰🔍' }
    ],
    properties: [
        { id: 'appartement', name: 'Appartement', icon: '🏢' },
        { id: 'villa', name: 'Villa', icon: '🏡' },
        { id: 'maison', name: 'Maison', icon: '🏠' },
        { id: 'terrain', name: 'Terrain', icon: '🌳' },
        { id: 'bureau', name: 'Bureau', icon: '💼' },
        { id: 'commerce', name: 'Commerce', icon: '🏪' }
    ]
};

const ImmobilerPage = () => {
    const { slug, page = "1" } = useParams();
    const dispatch = useDispatch();
    const history = useHistory();
    
    const [selectedOperation, setSelectedOperation] = useState(null);
    const [selectedProperty, setSelectedProperty] = useState(null);
    
    const { immobilierPosts, loading } = useSelector(state => state.homePosts || {});
    
    // Parsear el slug para determinar nivel
    useEffect(() => {
        if (!slug) return;
        
        const parts = slug.split('-');
        console.log('🏠 Immobiler slug parts:', parts);
        
        if (parts.length === 1 && parts[0] === 'immobilier') {
            // Nivel 0: Solo categoría (mostrar operaciones)
            setSelectedOperation(null);
            setSelectedProperty(null);
        } 
        else if (parts.length === 2 && parts[0] === 'immobilier') {
            // Nivel 1: Operación (ej: immobilier-vente)
            const operation = parts[1];
            setSelectedOperation(operation);
            setSelectedProperty(null);
            
            // Cargar posts para esta operación
            dispatch(getPostsByImmobilierOperation(operation, parseInt(page)));
        }
        else if (parts.length >= 3 && parts[0] === 'immobilier') {
            // Nivel 2: Operación + Propiedad (ej: immobilier-vente-appartement)
            const operation = parts[1];
            const property = parts.slice(2).join('-'); // Puede ser "appartement" o "appartement-modern"
            
            setSelectedOperation(operation);
            setSelectedProperty(property);
            
            // Cargar posts para esta operación + propiedad
            dispatch(getPostsByImmobilierOperation(operation, parseInt(page), property));
        }
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
    
    // Determinar qué mostrar
    if (!selectedOperation) {
        // 🎯 Nivel 0: Mostrar operaciones disponibles
        return (
            <div className="container py-4">
                <h1 className="display-5 fw-bold mb-4">🏠 Immobilier</h1>
                
                <div className="row mb-5">
                    <div className="col-12">
                        <h2 className="h4 mb-3">Choisissez une opération</h2>
                        <div className="row g-3">
                            {IMMOBILIER_CONFIG.operations.map(op => (
                                <div key={op.id} className="col-md-4 col-lg-3">
                                    <div 
                                        className="card h-100 shadow-sm border-0 cursor-pointer"
                                        onClick={() => handleOperationClick(op.id)}
                                        style={{
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <div className="card-body text-center">
                                            <div className="display-4 mb-3">{op.icon}</div>
                                            <h5 className="card-title">{op.name}</h5>
                                            <p className="text-muted small">Voir les annonces</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (selectedOperation && !selectedProperty) {
        // 🎯 Nivel 1: Mostrar propiedades disponibles para esta operación
        const currentOp = IMMOBILIER_CONFIG.operations.find(op => op.id === selectedOperation);
        
        return (
            <div className="container py-4">
                {/* Breadcrumb */}
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <a 
                                href="/immobilier/1"
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleBackToOperations();
                                }}
                            >
                                Immobilier
                            </a>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            {currentOp?.name || selectedOperation}
                        </li>
                    </ol>
                </nav>
                
                <h1 className="display-5 fw-bold mb-4">
                    {currentOp?.icon} {currentOp?.name || selectedOperation}
                </h1>
                
                {/* Propiedades */}
                <div className="row mb-5">
                    <div className="col-12">
                        <h2 className="h4 mb-3">Type de bien</h2>
                        <div className="d-flex flex-wrap gap-2">
                            {IMMOBILIER_CONFIG.properties.map(prop => (
                                <button
                                    key={prop.id}
                                    onClick={() => handlePropertyClick(prop.id)}
                                    className="btn btn-outline-primary d-flex align-items-center gap-2"
                                    style={{
                                        borderRadius: '20px',
                                        padding: '10px 20px'
                                    }}
                                >
                                    <span>{prop.icon}</span>
                                    <span>{prop.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Posts de esta operación (todas las propiedades) */}
                <div className="row">
                    <div className="col-12">
                        <h3 className="h5 mb-3">Toutes les annonces</h3>
                        <Posts 
                            fromImmobilerPage={true}
                            selectedCategory="immobilier"
                            selectedSubcategory={selectedOperation}
                        />
                    </div>
                </div>
            </div>
        );
    }
    
    // 🎯 Nivel 2: Mostrar posts específicos de operación + propiedad
    const currentOp = IMMOBILIER_CONFIG.operations.find(op => op.id === selectedOperation);
    const currentProp = IMMOBILIER_CONFIG.properties.find(prop => prop.id === selectedProperty);
    
    return (
        <div className="container py-4">
            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item">
                        <a 
                            href="/immobilier/1"
                            onClick={(e) => {
                                e.preventDefault();
                                handleBackToOperations();
                            }}
                        >
                            Immobilier
                        </a>
                    </li>
                    <li className="breadcrumb-item">
                        <a 
                            href={`/immobilier-${selectedOperation}/1`}
                            onClick={(e) => {
                                e.preventDefault();
                                history.push(`/immobilier-${selectedOperation}/1`);
                            }}
                        >
                            {currentOp?.name || selectedOperation}
                        </a>
                    </li>
                    <li className="breadcrumb-item active" aria-current="page">
                        {currentProp?.name || selectedProperty}
                    </li>
                </ol>
            </nav>
            
            <h1 className="display-5 fw-bold mb-4">
                {currentOp?.icon} {currentOp?.name} - {currentProp?.icon} {currentProp?.name}
            </h1>
            
            {/* Posts filtrados por operación + propiedad */}
            <div className="row">
                <div className="col-12">
                    <Posts 
                        fromImmobilerPage={true}
                        selectedCategory="immobilier"
                        selectedSubcategory={`${selectedOperation}-${selectedProperty}`}
                    />
                </div>
            </div>
        </div>
    );
};

export default ImmobilerPage;