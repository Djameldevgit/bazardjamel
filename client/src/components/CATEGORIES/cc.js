import React, { useState, useEffect } from 'react';
import { Accordion, Card, Button, Form, Row, Col, Badge } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const CategoryAccordion = ({ postData, handleChangeInput }) => {
  const { t, i18n } = useTranslation(['categories', 'subcategories']);
  const isRTL = i18n.language === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [activeKey, setActiveKey] = useState(null);
  const [localPostData, setLocalPostData] = useState(postData);

  // 🔄 Sincronizar con cambios externos
  useEffect(() => {
    console.log('🔄 Accordion recibió postData:', postData);
    setLocalPostData(postData);
    
    // Expandir automáticamente si hay categoría seleccionada
    if (postData.categorie && !activeKey) {
      setActiveKey(postData.categorie);
    }
  }, [postData]);

  // Mapeo de categorías a emojis
  const categoryEmojis = {
    'immobilier': '🏠',
    'vehicules': '🚗',
    'telephones': '📱',
    'informatique': '💻',
    'electromenager': '🔌',
    'piecesDetachees': '⚙️',
    'vetements': '👕',
    'alimentaires': '🍎',
    'sante_beaute': '💄',
    'meubles': '🛋️',
    'services': '🛠️',
    'materiaux': '🧱',
    'loisirs': '🎮',
    'emploi': '💼',
    'sport': '⚽',
    'voyages': '✈️'
  };

  // Datos de categorías principales
  const categories = [
    { id: 'immobilier', name: t('immobilier', { ns: 'categories' }) },
    { id: 'vehicules', name: t('automobiles', { ns: 'categories' }) },
    { id: 'telephones', name: t('telephones', { ns: 'categories' }) },
    { id: 'informatique', name: t('informatique', { ns: 'categories' }) },
    { id: 'electromenager', name: t('electromenager', { ns: 'categories' }) },
    { id: 'piecesDetachees', name: t('piecesDetachees', { ns: 'categories' }) },
    { id: 'vetements', name: t('vetements', { ns: 'categories' }) },
    { id: 'alimentaires', name: t('Alimentaires', { ns: 'categories' }) },
    { id: 'sante_beaute', name: t('sante_beaute', { ns: 'categories' }) },
    { id: 'meubles', name: t('meubles', { ns: 'categories' }) },
    { id: 'services', name: t('Services', { ns: 'categories' }) },
    { id: 'materiaux', name: t('Materiaux', { ns: 'categories' }) },
    { id: 'loisirs', name: t('loisirs', { ns: 'categories' }) },
    { id: 'emploi', name: t('emploi', { ns: 'categories' }) },
    { id: 'sport', name: t('Sport', { ns: 'categories' }) },
    { id: 'voyages', name: t('Voyage', { ns: 'categories' }) }
  ];

  // Datos de subcategorías (completos)
  const subcategoriesData = {
    vehicules: [
      { id: 'automobiles', name: t('vehicules.categories.voitures', { ns: 'subcategories' }) },
      { id: 'utilitaires', name: t('vehicules.categories.utilitaire', { ns: 'subcategories' }) },
      { id: 'motos', name: t('vehicules.categories.motos', { ns: 'subcategories' }) },
    ],
    vetements: [
      { id: 'vetements_homme', name: t('vetements.categories.vetements_homme', { ns: 'subcategories' }) },
      { id: 'vetements_femme', name: t('vetements.categories.vetements_femme', { ns: 'subcategories' }) },
      { id: 'chaussures_homme', name: t('vetements.categories.chaussures_homme', { ns: 'subcategories' }) },
    ],
    telephones: [
      { id: 'smartphones', name: t('telephones.categories.smartphones', { ns: 'subcategories' }) },
      { id: 'telephones_cellulaires', name: t('telephones.categories.telephones_cellulaires', { ns: 'subcategories' }) },
      { id: 'tablettes', name: t('telephones.categories.tablettes', { ns: 'subcategories' }) },
    ],
    informatique: [
      { id: 'ordinateurs_portables', name: t('informatique.categories.ordinateurs_portables', { ns: 'subcategories' }) },
      { id: 'ordinateurs_bureau', name: t('informatique.categories.ordinateurs_bureau', { ns: 'subcategories' }) },
      { id: 'serveurs', name: t('informatique.categories.serveurs', { ns: 'subcategories' }) },
    ],
    electromenager: [
      { id: 'televiseurs', name: t('electromenager.categories.televiseurs', { ns: 'subcategories' }) },
      { id: 'demodulateurs_box_tv', name: t('electromenager.categories.demodulateurs_box_tv', { ns: 'subcategories' }) },
      { id: 'paraboles_switch_tv', name: t('electromenager.categories.paraboles_switch_tv', { ns: 'subcategories' }) },
    ],
    piecesDetachees: [
      { id: 'pieces_automobiles', name: t('pieces_detachees.categories.pieces_automobiles', { ns: 'subcategories' }) },
      { id: 'pieces_vehicules', name: t('pieces_detachees.categories.pieces_vehicules', { ns: 'subcategories' }) },
      { id: 'pieces_moto', name: t('pieces_detachees.categories.pieces_moto', { ns: 'subcategories' }) },
    ],
    sante_beaute: [
      { id: 'cosmetiques_beaute', name: t('sante_beaute.categories.cosmetiques_beaute', { ns: 'subcategories' }) },
      { id: 'parfums_deodorants_femme', name: t('sante_beaute.categories.parfums_deodorants_femme', { ns: 'subcategories' }) },
      { id: 'parfums_deodorants_homme', name: t('sante_beaute.categories.parfums_deodorants_homme', { ns: 'subcategories' }) },
      { id: 'parapharmacie_sante', name: t('sante_beaute.categories.parapharmacie_sante', { ns: 'subcategories' }) },
    ],
    meubles: [
      { id: 'meubles_maison', name: t('meubles.categories.meubles_maison', { ns: 'subcategories' }) },
      { id: 'decoration', name: t('meubles.categories.decoration', { ns: 'subcategories' }) },
      { id: 'vaisselle', name: t('meubles.categories.vaisselle', { ns: 'subcategories' }) },
    ],
    loisirs: [
      { id: 'animalerie', name: t('loisirs.categories.animalerie', { ns: 'subcategories' }) },
      { id: 'consoles_jeux_videos', name: t('loisirs.categories.consoles_jeux_videos', { ns: 'subcategories' }) },
      { id: 'livres_magazines', name: t('loisirs.categories.livres_magazines', { ns: 'subcategories' }) },
    ],
    sport: [
      { id: 'football', name: t('sport.categories.football', { ns: 'subcategories' }) },
      { id: 'hand_voley_basket', name: t('sport.categories.hand_voley_basket', { ns: 'subcategories' }) },
    ],
    alimentaires: [
      { id: 'fruits_secs', name: t('alimentaires.categories.fruits_secs', { ns: 'subcategories' }) },
      { id: 'graines_riz_cereales', name: t('alimentaires.categories.graines_riz_cereales', { ns: 'subcategories' }) },
      { id: 'aliments_dietetiques', name: t('alimentaires.categories.aliments_dietetiques', { ns: 'subcategories' }) },
    ],
    services: [
      { id: 'construction_travaux', name: t('services.categories.construction_travaux', { ns: 'subcategories' }) },
      { id: 'ecoles_formations', name: t('services.categories.ecoles_formations', { ns: 'subcategories' }) },
    ],
    materiaux: [
      { id: 'materiel_professionnel', name: t('materiaux.categories.materiel_professionnel', { ns: 'subcategories' }) },
      { id: 'outillage_professionnel', name: t('materiaux.categories.outillage_professionnel', { ns: 'subcategories' }) },
      { id: 'materiaux_construction', name: t('materiaux.categories.materiaux_construction', { ns: 'subcategories' }) },
    ],
    voyages: [
      { id: 'voyage_organise', name: t('voyages.categories.voyage_organise', { ns: 'subcategories' }) },
      { id: 'location_vacances', name: t('voyages.categories.location_vacances', { ns: 'subcategories' }) },
      { id: 'hajj_omra', name: t('voyages.categories.hajj_omra', { ns: 'subcategories' }) },
    ],
    emploi: [
      { id: 'offres_emploi', name: t('offre.property.Offresemploi', { ns: 'subcategories' }) },
      { id: 'demandes_emploi', name: t('offre.property.Demandesemploi', { ns: 'subcategories' }) },
    ]
  };

  // Datos especiales para Immobilier
  const immobilierOperations = [
    { id: 'vente', name: t('immobilier.operation.vente', { ns: 'subcategories' }) },
    { id: 'location', name: t('immobilier.operation.location', { ns: 'subcategories' }) },
    { id: 'location_vacances', name: t('immobilier.operation.location_vacances', { ns: 'subcategories' }) },
  ];

  const immobilierProperties = [
    { id: 'appartement', name: t('immobilier.property.appartement', { ns: 'subcategories' }) },
    { id: 'villa', name: t('immobilier.property.villa', { ns: 'subcategories' }) },
    { id: 'terrain', name: t('immobilier.property.terrain', { ns: 'subcategories' }) },
    { id: 'local', name: t('immobilier.property.local', { ns: 'subcategories' }) },
  ];

  // Filtrar categorías basadas en búsqueda
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🎯 FUNCIONES HANDLER CORREGIDAS
  const handleCategorySelect = (categoryId) => {
    console.log('🎯 Seleccionando categoría:', categoryId);
    
    // Notificar al padre
    handleChangeInput({
      target: { name: 'categorie', value: categoryId }
    });
    
    // Para Immobilier, limpiar articleType y subCategory
    if (categoryId === 'immobilier') {
      handleChangeInput({
        target: { name: 'articleType', value: '' }
      });
      handleChangeInput({
        target: { name: 'subCategory', value: '' }
      });
    } else {
      // Para otras categorías, limpiar subCategory
      handleChangeInput({
        target: { name: 'subCategory', value: '' }
      });
    }
    
    setActiveKey(categoryId);
  };

  const handleSubcategorySelect = (subcategoryId) => {
    console.log('🎯 Seleccionando subcategoría:', subcategoryId);
    handleChangeInput({
      target: { name: 'subCategory', value: subcategoryId }
    });
  };

  const handleOperationSelect = (operationId) => {
    console.log('🏠 Seleccionando operación Immobilier:', operationId);
    handleChangeInput({
      target: { name: 'articleType', value: operationId }
    });
    
    // Limpiar propiedad si se cambia operación
    if (localPostData.subCategory) {
      handleChangeInput({
        target: { name: 'subCategory', value: '' }
      });
    }
  };

  const handlePropertySelect = (propertyId) => {
    console.log('🏠 Seleccionando propiedad Immobilier:', propertyId);
    handleChangeInput({
      target: { name: 'subCategory', value: propertyId }
    });
  };

  // Renderizar contenido especial para Immobilier
  const renderImmobilierContent = () => (
    <div className="mt-2">
      {/* Tipo de Operación */}
      <div className="mb-3">
        <div className={`fw-bold mb-1 ${isRTL ? 'text-end' : ''}`} style={{ fontSize: '0.85rem' }}>
          📋 {t('type_operation', { ns: 'subcategories' })}
        </div>
        <Form.Select
          value={localPostData.articleType || ''}
          onChange={(e) => handleOperationSelect(e.target.value)}
          className="form-select-sm"
          dir={isRTL ? 'rtl' : 'ltr'}
          size="sm"
          style={{ fontSize: '0.85rem', padding: '0.25rem 0.5rem' }}
        >
          <option value="">
            {t('select_operation', { ns: 'subcategories', defaultValue: 'Sélectionnez une opération...' })}
          </option>
          {immobilierOperations.map((operation) => (
            <option key={operation.id} value={operation.id}>
              {operation.name}
            </option>
          ))}
        </Form.Select>
      </div>

      {/* Tipo de Propiedad (solo si hay operación seleccionada) */}
      {localPostData.articleType && (
        <div className="mb-3">
          <div className={`fw-bold mb-1 ${isRTL ? 'text-end' : ''}`} style={{ fontSize: '0.85rem' }}>
            🏠 {t('type_property', { ns: 'subcategories' })}
          </div>
          <Form.Select
            value={localPostData.subCategory || ''}
            onChange={(e) => handlePropertySelect(e.target.value)}
            className="form-select-sm"
            dir={isRTL ? 'rtl' : 'ltr'}
            size="sm"
            style={{ fontSize: '0.85rem', padding: '0.25rem 0.5rem' }}
          >
            <option value="">
              {t('select_property', { ns: 'subcategories', defaultValue: 'Sélectionnez un type de bien...' })}
            </option>
            {immobilierProperties.map((property) => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </Form.Select>
        </div>
      )}

      {/* Estado actual de Immobilier */}
      {(localPostData.articleType || localPostData.subCategory) && (
        <div className="alert alert-light border p-2 mt-2" style={{ fontSize: '0.8rem' }}>
          <small>
            <strong>📊 État Immobilier:</strong>
            {localPostData.articleType && (
              <div className="text-success">
                📋 <strong>Opération:</strong> {
                  immobilierOperations.find(op => op.id === localPostData.articleType)?.name
                }
              </div>
            )}
            {localPostData.subCategory && (
              <div className="text-primary">
                🏠 <strong>Type de bien:</strong> {
                  immobilierProperties.find(prop => prop.id === localPostData.subCategory)?.name
                }
              </div>
            )}
          </small>
        </div>
      )}
    </div>
  );

  // Renderizar contenido para otras categorías
  const renderRegularSubcategories = (categoryId) => {
    const subcategories = subcategoriesData[categoryId] || [];
    
    if (subcategories.length === 0) return null;

    return (
      <div className="mt-2">
        <div className={`fw-bold mb-1 ${isRTL ? 'text-end' : ''}`} style={{ fontSize: '0.85rem' }}>
          📂 {getCategoryTitle(categoryId)}
        </div>
        <Form.Select
          value={localPostData.subCategory || ''}
          onChange={(e) => handleSubcategorySelect(e.target.value)}
          className="form-select-sm"
          dir={isRTL ? 'rtl' : 'ltr'}
          size="sm"
          style={{ fontSize: '0.85rem', padding: '0.25rem 0.5rem' }}
        >
          <option value="">
            {t('select_subcategory_option', { ns: 'subcategories', defaultValue: 'Sélectionnez une sous-catégorie...' })}
          </option>
          {subcategories.map((subcat) => (
            <option key={subcat.id} value={subcat.id}>
              {subcat.name}
            </option>
          ))}
        </Form.Select>
      </div>
    );
  };

  // Títulos para categorías
  const getCategoryTitle = (categoryId) => {
    const titles = {
      'vehicules': t('type_vehicle', { ns: 'subcategories' }),
      'vetements': t('type_clothing', { ns: 'subcategories' }),
      'telephones': t('type_phone', { ns: 'subcategories' }),
      'informatique': t('type_computer', { ns: 'subcategories' }),
      'electromenager': t('type_appliance', { ns: 'subcategories' }),
      'piecesDetachees': t('type_pieces_detachees', { ns: 'subcategories' }),
      'sante_beaute': t('type_sante_beautee', { ns: 'subcategories' }),
      'meubles': t('type_meubles', { ns: 'subcategories' }),
      'loisirs': t('type_loisirs', { ns: 'subcategories' }),
      'emploi': t('type_emploi', { ns: 'subcategories' }),
      'sport': t('type_sport', { ns: 'subcategories' }),
      'alimentaires': t('type_alimentaires', { ns: 'subcategories' }),
      'materiaux': t('type_materiaux', { ns: 'subcategories' }),
      'services': t('type_services', { ns: 'subcategories' }),
      'voyages': t('type_voyages', { ns: 'subcategories' })
    };
    
    return titles[categoryId] || t('select_subcategory', { ns: 'subcategories' });
  };

  // Badge para mostrar selección actual
  const getSelectionBadge = (categoryId) => {
    if (localPostData.categorie !== categoryId) return null;
    
    if (categoryId === 'immobilier') {
      const operation = localPostData.articleType 
        ? immobilierOperations.find(op => op.id === localPostData.articleType)?.name 
        : null;
      const property = localPostData.subCategory 
        ? immobilierProperties.find(prop => prop.id === localPostData.subCategory)?.name 
        : null;
      
      return (
        <div className="d-flex gap-1" style={{ fontSize: '0.7rem' }}>
          {operation && (
            <Badge bg="primary" className="px-1 py-0">
              {operation.substring(0, 10)}...
            </Badge>
          )}
          {property && (
            <Badge bg="success" className="px-1 py-0">
              {property.substring(0, 10)}...
            </Badge>
          )}
        </div>
      );
    } else {
      return localPostData.subCategory ? (
        <Badge bg="secondary" className="ms-1 px-1 py-0" style={{ fontSize: '0.7rem' }}>
          {subcategoriesData[categoryId]?.find(sc => sc.id === localPostData.subCategory)?.name?.substring(0, 12)}...
        </Badge>
      ) : null;
    }
  };

  return (
    <div className={`category-accordion ${isRTL ? 'rtl' : ''}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Barra de búsqueda */}
      <div className="mb-3">
        <Form.Control
          type="text"
          placeholder={t('search_category', { ns: 'categories', defaultValue: 'Rechercher une catégorie...' })}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control-sm"
          dir={isRTL ? 'rtl' : 'ltr'}
          size="sm"
          style={{ fontSize: '0.85rem', padding: '0.25rem 0.5rem' }}
        />
      </div>

      {/* Accordion */}
      <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
        {filteredCategories.map((category) => (
          <Accordion.Item 
            key={category.id} 
            eventKey={category.id}
            className="border mb-1"
            style={{ 
              borderRadius: '4px',
              borderColor: localPostData.categorie === category.id ? '#0d6efd' : '#dee2e6'
            }}
          >
            <Accordion.Header 
              onClick={() => handleCategorySelect(category.id)}
              className="py-1 px-2"
              style={{ 
                cursor: 'pointer',
                backgroundColor: localPostData.categorie === category.id ? '#e7f1ff' : 'white',
                fontSize: '0.85rem'
              }}
            >
              <div className="d-flex align-items-center w-100">
                <span className="me-2" style={{ fontSize: '1rem' }}>
                  {categoryEmojis[category.id]}
                </span>
                <span className="flex-grow-1">
                  {category.name}
                </span>
                {getSelectionBadge(category.id)}
              </div>
            </Accordion.Header>
            
            <Accordion.Body className="p-2" style={{ fontSize: '0.85rem' }}>
              {localPostData.categorie === category.id && (
                <>
                  {category.id === 'immobilier' ? (
                    renderImmobilierContent()
                  ) : (
                    renderRegularSubcategories(category.id)
                  )}
                </>
              )}
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>

      {/* Estado de selección */}
      {localPostData.categorie && (
        <div className="mt-3 p-2 border rounded" style={{ 
          backgroundColor: '#f8f9fa',
          fontSize: '0.85rem'
        }}>
          <small>
            <strong>🎯 Sélection actuelle:</strong>
            <div className="mt-1 d-flex flex-wrap gap-2">
              <span>
                📁 <strong>Catégorie:</strong> {categories.find(c => c.id === localPostData.categorie)?.name}
              </span>
              
              {localPostData.categorie === 'immobilier' && localPostData.articleType && (
                <span>
                  📋 <strong>Opération:</strong> <span className="text-primary">
                    {immobilierOperations.find(op => op.id === localPostData.articleType)?.name}
                  </span>
                </span>
              )}
              
              {localPostData.subCategory && (
                <span>
                  📂 <strong>Sous-catégorie:</strong> <span className="text-success">
                    {localPostData.categorie === 'immobilier'
                      ? immobilierProperties.find(p => p.id === localPostData.subCategory)?.name
                      : subcategoriesData[localPostData.categorie]?.find(sc => sc.id === localPostData.subCategory)?.name}
                  </span>
                </span>
              )}
            </div>
          </small>
        </div>
      )}

      <style>{`
        .category-accordion {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
        }
        
        .category-accordion .accordion-button {
          padding: 0.25rem 0.5rem !important;
          font-size: 0.85rem !important;
          min-height: 32px;
        }
        
        .category-accordion .accordion-button:not(.collapsed) {
          background-color: transparent;
          color: inherit;
          box-shadow: none;
        }
        
        .category-accordion .accordion-button::after {
          background-size: 0.8rem;
          width: 0.8rem;
          height: 0.8rem;
        }
        
        .category-accordion .accordion-body {
          padding: 0.5rem !important;
          font-size: 0.85rem;
          border-top: 1px solid rgba(0,0,0,0.1);
        }
        
        .category-accordion .form-select-sm {
          padding: 0.2rem 0.5rem;
          font-size: 0.85rem;
          border-radius: 3px;
          height: 30px;
        }
        
        .category-accordion .form-control-sm {
          font-size: 0.85rem;
          padding: 0.2rem 0.5rem;
          height: 30px;
        }
        
        .rtl .accordion-button::after {
          margin-left: 0;
          margin-right: auto;
          transform: rotate(180deg);
        }
        
        .rtl .accordion-button:not(.collapsed)::after {
          transform: rotate(90deg);
        }
        
        .badge {
          font-size: 0.65rem !important;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default React.memo(CategoryAccordion);