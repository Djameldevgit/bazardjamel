import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ChevronDown } from 'react-bootstrap-icons';

const CategoriesAndSubCategory = ({ postData, handleChangeInput }) => {
  const { t, i18n } = useTranslation(['categories', 'subcategories']);
  const isRTL = i18n.language === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);

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

  // Datos de las categorías
  const categories = [
    { id: 'immobilier', name: t('categories:immobilier', 'Immobilier') },
    { id: 'vehicules', name: t('categories:automobiles') }, 
    { id: 'telephones', name: t('categories:telephones', 'Téléphones & Accessoires') },
    { id: 'informatique', name: t('categories:informatique', 'Informatique') },
    { id: 'electromenager', name: t('categories:electromenager', 'Électroménager & Électronique') },
    { id: 'piecesDetachees', name: t('categories:piecesDetachees', 'Pieces Detachees') },
    { id: 'vetements', name: t('categories:vetements', 'Vêtements & Mode') },
    { id: 'alimentaires', name: t('categories:Alimentaires', 'Alimentaires') },
    { id: 'sante_beaute', name: t('categories:sante_beaute', 'Santé & Beauté') },
    { id: 'meubles', name: t('categories:meubles', 'Meubles & Maison') },
    { id: 'services', name: t('categories:Services', 'Services') },
    { id: 'materiaux', name: t('categories:Materiaux', 'Materiaux') },
    { id: 'loisirs', name: t('categories:loisirs', 'Loisirs & Divertissements') },
    { id: 'emploi', name: t('categories:emploi', "Offres & Demandes d'emploi") },
    { id: 'sport', name: t('categories:Sport', 'Sport') },
    { id: 'voyages', name: t('categories:Voyage', 'Voyages') }
  ];

  // SUB-CATEGORÍAS ESPECÍFICAS
  const subcategories = {
    // Vehicules
    'vehicules': [
      { id: 'automobiles', name: t('subcategories:vehicules.categories.voitures') },
      { id: 'utilitaires', name: t('subcategories:vehicules.categories.utilitaire') },
      { id: 'motos', name: t('subcategories:vehicules.categories.motos') },
    ],
    // Vetements
    'vetements': [
      { id: 'vetements_homme', name: t('subcategories:vetements.categories.vetements_homme') },
      { id: 'vetements_femme', name: t('subcategories:vetements.categories.vetements_femme') },
      { id: 'chaussures_homme', name: t('subcategories:vetements.categories.chaussures_homme') },
    ],
    // Telephones
    'telephones': [
      { id: 'smartphones', name: t('subcategories:telephones.categories.smartphones') },
      { id: 'telephones_cellulaires', name: t('subcategories:telephones.categories.telephones_cellulaires') },
      { id: 'tablettes', name: t('subcategories:telephones.categories.tablettes') },
    ],
    // Informatique
    'informatique': [
      { id: 'ordinateurs_portables', name: t('subcategories:informatique.categories.ordinateurs_portables') },
      { id: 'ordinateurs_bureau', name: t('subcategories:informatique.categories.ordinateurs_bureau') },
      { id: 'serveurs', name: t('subcategories:informatique.categories.serveurs') },
    ],
    // Electromenager
    'electromenager': [
      { id: 'televiseurs', name: t('subcategories:electromenager.categories.televiseurs') },
      { id: 'demodulateurs_box_tv', name: t('subcategories:electromenager.categories.demodulateurs_box_tv') },
      { id: 'paraboles_switch_tv', name: t('subcategories:electromenager.categories.paraboles_switch_tv') },
      { id: 'abonnements_iptv', name: t('subcategories:electromenager.categories.abonnements_iptv') },
    ],
    // Pieces Detachees
    'piecesDetachees': [
      { id: 'pieces_automobiles', name: t('subcategories:pieces_detachees.categories.pieces_automobiles') },
      { id: 'pieces_vehicules', name: t('subcategories:pieces_detachees.categories.pieces_vehicules') },
      { id: 'pieces_moto', name: t('subcategories:pieces_detachees.categories.pieces_moto') },
    ],
    // Sante Beaute
    'sante_beaute': [
      { id: 'cosmetiques_beaute', name: t('subcategories:sante_beaute.categories.cosmetiques_beaute') },
      { id: 'parfums_deodorants_femme', name: t('subcategories:sante_beaute.categories.parfums_deodorants_femme') },
      { id: 'parfums_deodorants_homme', name: t('subcategories:sante_beaute.categories.parfums_deodorants_homme') },
      { id: 'parapharmacie_sante', name: t('subcategories:sante_beaute.categories.parapharmacie_sante') }
    ],
    // Meubles
    'meubles': [
      { id: 'meubles_maison', name: t('subcategories:meubles.categories.meubles_maison') },
      { id: 'decoration', name: t('subcategories:meubles.categories.decoration') },
      { id: 'vaisselle', name: t('subcategories:meubles.categories.vaisselle') },
    ],
    // Loisirs
    'loisirs': [
      { id: 'animalerie', name: t('subcategories:loisirs.categories.animalerie') },
      { id: 'consoles_jeux_videos', name: t('subcategories:loisirs.categories.consoles_jeux_videos') },
      { id: 'livres_magazines', name: t('subcategories:loisirs.categories.livres_magazines') },
    ],
    // Sport
    'sport': [
      { id: 'football', name: t('subcategories:sport.categories.football') },
      { id: 'hand_voley_basket', name: t('subcategories:sport.categories.hand_voley_basket') },
      { id: 'sport_combat', name: t('subcategories:sport.categories.sport_combat') },
    ],
    // Alimentaires
    'alimentaires': [
      { id: 'produits_laitiers', name: t('subcategories:alimentaires.categories.produits_laitiers') },
      { id: 'fruits_secs', name: t('subcategories:alimentaires.categories.fruits_secs') },
      { id: 'graines_riz_cereales', name: t('subcategories:alimentaires.categories.graines_riz_cereales') },
    ],
    // Services
    'services': [
      { id: 'construction_travaux', name: t('subcategories:services.categories.construction_travaux') },
      { id: 'ecoles_formations', name: t('subcategories:services.categories.ecoles_formations') },
      { id: 'industrie_fabrication', name: t('subcategories:services.categories.industrie_fabrication') },
    ],
    // Materiaux
    'materiaux': [
      { id: 'materiel_professionnel', name: t('subcategories:materiaux.categories.materiel_professionnel') },
      { id: 'outillage_professionnel', name: t('subcategories:materiaux.categories.outillage_professionnel') },
      { id: 'materiaux_construction', name: t('subcategories:materiaux.categories.materiaux_construction') },
    ],
    // Voyages
    'voyages': [
      { id: 'voyage_organise', name: t('subcategories:voyages.categories.voyage_organise') },
      { id: 'location_vacances', name: t('subcategories:voyages.categories.location_vacances') },
      { id: 'hajj_omra', name: t('subcategories:voyages.categories.hajj_omra') },
    ],
    // Emploi
    'emploi': [
      { id: 'offres_emploi', name: t('subcategories:offre.property.Offresemploi') },
      { id: 'demandes_emploi', name: t('subcategories:offre.property.Demandesemploi') },
    ],
    // Immobilier - Caso especial
    'immobilier': null // Se manejará diferente
  };

  // Data de Immobilier
  const immobilierOperations = [
    { id: 'vente', name: t('subcategories:immobilier.operation.vente') },
    { id: 'location', name: t('subcategories:immobilier.operation.location') },
    { id: 'location_vacances', name: t('subcategories:immobilier.operation.location_vacances') },
  ];

  const immobilierProperties = {
    'vente': [
      { id: 'appartement', name: t('subcategories:immobilier.property.appartement') },
      { id: 'villa', name: t('subcategories:immobilier.property.villa') },
      { id: 'terrain', name: t('subcategories:immobilier.property.terrain') },
    ],
    'location': [
      { id: 'appartement', name: t('subcategories:immobilier.property.appartement') },
      { id: 'villa', name: t('subcategories:immobilier.property.villa') },
      { id: 'terrain', name: t('subcategories:immobilier.property.terrain') },
    ],
    'location_vacances': [
      { id: 'appartement', name: t('subcategories:immobilier.property.appartement') },
      { id: 'villa', name: t('subcategories:immobilier.property.villa') },
      { id: 'terrain', name: t('subcategories:immobilier.property.terrain') },
    ]
  };

  // Filtrar categorías
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Efecto para expandir automáticamente la categoría seleccionada
  useEffect(() => {
    if (postData.categorie) {
      setExpandedCategory(postData.categorie);
    }
  }, [postData.categorie]);

  // Handler para seleccionar categoría
  const handleCategorySelect = (categoryId) => {
    if (postData.categorie === categoryId) {
      // Si ya está seleccionada, limpiar todo
      handleChangeInput({
        target: { name: 'categorie', value: '' }
      });
      handleChangeInput({
        target: { name: 'subCategory', value: '' }
      });
      handleChangeInput({
        target: { name: 'articleType', value: '' }
      });
      setExpandedCategory(null);
    } else {
      // Seleccionar nueva categoría
      handleChangeInput({
        target: { name: 'categorie', value: categoryId }
      });
      handleChangeInput({
        target: { name: 'subCategory', value: '' }
      });
      handleChangeInput({
        target: { name: 'articleType', value: '' }
      });
      setExpandedCategory(categoryId);
    }
  };

  // Handler para seleccionar subcategoría
  const handleSubcategorySelect = (subcategoryId) => {
    handleChangeInput({
      target: { name: 'subCategory', value: subcategoryId }
    });
  };

  // Handler para seleccionar operación en immobilier
  const handleImmobilierOperation = (operationId) => {
    handleChangeInput({
      target: { name: 'articleType', value: operationId }
    });
  };

  // Componente de categoría individual
  const CategoryItem = ({ category }) => {
    const isSelected = postData.categorie === category.id;
    const isExpanded = expandedCategory === category.id;
    const emoji = categoryEmojis[category.id] || '📁';
    const categorySubcats = subcategories[category.id];
    const isImmobilier = category.id === 'immobilier';
    const hasSubcategories = categorySubcats || isImmobilier;

    return (
      <div className="category-column-item">
        {/* Línea de categoría */}
        <div 
          className={`category-line ${isSelected ? 'selected' : ''} ${isExpanded ? 'expanded' : ''}`}
          onClick={() => handleCategorySelect(category.id)}
          style={{
            borderLeft: `4px solid ${isSelected ? '#0d6efd' : 'transparent'}`
          }}
        >
          <div className="d-flex align-items-center justify-content-between w-100">
            <div className="d-flex align-items-center">
              <div className="category-emoji me-3" style={{ fontSize: '1.3rem' }}>
                {emoji}
              </div>
              <div className="category-info">
                <div className="category-name fw-bold" style={{ color: isSelected ? '#0d6efd' : '#212529' }}>
                  {category.name}
                </div>
                <div className="category-id text-muted" style={{ fontSize: '0.8rem' }}>
                  {category.id}
                </div>
              </div>
            </div>
            <div className="category-actions">
              {isSelected && (
                <span className="badge bg-success me-2" style={{ fontSize: '0.7rem' }}>
                  ✓
                </span>
              )}
              {hasSubcategories && (
                <span className="expand-icon">
                  {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SUB-CATEGORÍAS (solo si está expandida) */}
        {isExpanded && hasSubcategories && (
          <div className="subcategories-panel">
            {/* CASO INMOBILIARIO (especial) */}
            {isImmobilier ? (
              <div className="immobilier-subcategories">
                {/* Paso 1: Seleccionar operación */}
                {!postData.articleType ? (
                  <div className="immobilier-step">
                    <div className="step-title mb-3">
                      <h6 className="fw-bold">📋 Sélectionnez une opération</h6>
                    </div>
                    <div className="operations-list">
                      {immobilierOperations.map((operation) => (
                        <div 
                          key={operation.id}
                          className={`operation-item ${postData.articleType === operation.id ? 'selected' : ''}`}
                          onClick={() => handleImmobilierOperation(operation.id)}
                        >
                          <div className="d-flex align-items-center">
                            <div className="operation-emoji me-3" style={{ fontSize: '1.2rem' }}>
                              {operation.id === 'vente' ? '💰' : 
                               operation.id === 'location' ? '📅' : '🏖️'}
                            </div>
                            <div>
                              <div className="fw-bold">{operation.name}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Paso 2: Seleccionar tipo de propiedad */
                  <div className="immobilier-step">
                    <div className="step-title mb-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <h6 className="fw-bold">🏠 Sélectionnez un type de bien</h6>
                        <button 
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handleImmobilierOperation('')}
                        >
                          ← Changer opération
                        </button>
                      </div>
                      <small className="text-muted">
                        Opération: {immobilierOperations.find(op => op.id === postData.articleType)?.name}
                      </small>
                    </div>
                    <div className="properties-list">
                      {immobilierProperties[postData.articleType]?.map((property) => (
                        <div 
                          key={property.id}
                          className={`property-item ${postData.subCategory === property.id ? 'selected' : ''}`}
                          onClick={() => handleSubcategorySelect(property.id)}
                        >
                          <div className="d-flex align-items-center">
                            <div className="property-emoji me-3" style={{ fontSize: '1.2rem' }}>
                              {property.id === 'appartement' ? '🏢' : 
                               property.id === 'villa' ? '🏡' : '🌳'}
                            </div>
                            <div>
                              <div className="fw-bold">{property.name}</div>
                            </div>
                          </div>
                          {postData.subCategory === property.id && (
                            <span className="badge bg-success">
                              ✓ Sélectionné
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* OTRAS CATEGORÍAS (subcategorías normales) */
              <div className="regular-subcategories">
                <div className="subcategories-list">
                  {categorySubcats.map((subcat) => (
                    <div 
                      key={subcat.id} 
                      className={`subcategory-item ${postData.subCategory === subcat.id ? 'selected' : ''}`}
                      onClick={() => handleSubcategorySelect(subcat.id)}
                      style={{
                        paddingLeft: isRTL ? '0' : '2rem',
                        paddingRight: isRTL ? '2rem' : '0'
                      }}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <div className="me-2" style={{ fontSize: '0.9rem' }}>
                            •
                          </div>
                          <div className="subcategory-name">
                            {subcat.name}
                          </div>
                        </div>
                        {postData.subCategory === subcat.id && (
                          <span className="badge bg-success" style={{ fontSize: '0.7rem' }}>
                            ✓
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // Mostrar selección actual
  const renderCurrentSelection = () => {
    if (!postData.categorie) return null;

    const selectedCategory = categories.find(c => c.id === postData.categorie);
    
    return (
      <div className="current-selection">
        <div className="d-flex align-items-center justify-content-between p-3 border rounded bg-light">
          <div className="d-flex align-items-center">
            <div className="me-3" style={{ fontSize: '1.5rem' }}>
              {categoryEmojis[postData.categorie]}
            </div>
            <div>
              <div className="fw-bold">Catégorie sélectionnée</div>
              <div className="text-muted">{selectedCategory?.name}</div>
              {postData.subCategory && (
                <small className="d-block text-primary">
                  Sous-catégorie: {postData.subCategory}
                </small>
              )}
            </div>
          </div>
          <button 
            className="btn btn-sm btn-outline-secondary"
            onClick={() => {
              handleChangeInput({
                target: { name: 'categorie', value: '' }
              });
              handleChangeInput({
                target: { name: 'subCategory', value: '' }
              });
              handleChangeInput({
                target: { name: 'articleType', value: '' }
              });
              setExpandedCategory(null);
            }}
          >
            Changer
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Barra de búsqueda */}
      <div className="mb-3">
        <input
          type="text"
          placeholder="🔍 Rechercher une catégorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control form-control-sm"
          style={{ 
            padding: '0.375rem 0.75rem',
            fontSize: '0.875rem'
          }}
        />
      </div>

      {/* Contador de resultados */}
      {searchTerm && (
        <div className="mb-2 text-muted" style={{ fontSize: '0.85rem' }}>
          {filteredCategories.length} catégorie(s) trouvée(s)
        </div>
      )}

      {/* Lista de catégories */}
      <div className="categories-column">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))
        ) : (
          <div className="text-center py-4 text-muted">
            Aucune catégorie trouvée
          </div>
        )}
      </div>

      {/* Sélection actuelle */}
      {renderCurrentSelection()}

      {/* Styles CSS */}
      <style>
        {`
          .categories-column {
            display: flex;
            flex-direction: column;
            gap: 2px;
            max-height: 500px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: #adb5bd #f8f9fa;
            padding-right: 5px;
          }
          
          .categories-column::-webkit-scrollbar {
            width: 6px;
          }
          
          .categories-column::-webkit-scrollbar-track {
            background: #f8f9fa;
            border-radius: 3px;
          }
          
          .categories-column::-webkit-scrollbar-thumb {
            background-color: #adb5bd;
            border-radius: 3px;
          }
          
          .category-column-item {
            margin-bottom: 2px;
          }
          
          .category-line {
            padding: 0.75rem 1rem;
            cursor: pointer;
            background-color: white;
            transition: all 0.2s ease;
            border-bottom: 1px solid #f1f3f5;
          }
          
          .category-line:hover {
            background-color: #f8f9fa;
          }
          
          .category-line.selected {
            background-color: #f8f9ff;
            border-left-color: #0d6efd !important;
          }
          
          .category-line.expanded {
            border-bottom: none;
          }
          
          .category-info {
            flex-grow: 1;
          }
          
          .category-name {
            font-size: 0.95rem;
            line-height: 1.2;
          }
          
          .category-id {
            font-size: 0.75rem;
            margin-top: 1px;
          }
          
          .category-emoji {
            min-width: 24px;
            text-align: center;
          }
          
          .category-actions {
            display: flex;
            align-items: center;
          }
          
          .expand-icon {
            color: #6c757d;
            transition: transform 0.2s ease;
          }
          
          .subcategories-panel {
            background-color: #f8f9fa;
            border-left: 4px solid #e9ecef;
            animation: slideDown 0.2s ease-out;
          }
          
          .immobilier-subcategories {
            padding: 1rem;
          }
          
          .immobilier-step {
            margin-bottom: 1rem;
          }
          
          .step-title {
            padding-bottom: 0.5rem;
            border-bottom: 1px solid #e9ecef;
          }
          
          .operations-list, .properties-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .operation-item, .property-item {
            padding: 0.75rem 1rem;
            background: white;
            border-radius: 6px;
            cursor: pointer;
            border: 2px solid transparent;
            transition: all 0.2s ease;
          }
          
          .operation-item:hover, .property-item:hover {
            background-color: #f8f9fa;
            border-color: #dee2e6;
          }
          
          .operation-item.selected, .property-item.selected {
            border-color: #0d6efd;
            background-color: #f8f9ff;
          }
          
          .operation-emoji, .property-emoji {
            min-width: 28px;
            text-align: center;
          }
          
          .regular-subcategories {
            padding: 0.5rem 0;
          }
          
          .subcategories-list {
            padding: 0.5rem 0;
          }
          
          .subcategory-item {
            padding: 0.6rem 1rem;
            cursor: pointer;
            transition: all 0.2s ease;
            border-bottom: 1px solid #f1f3f5;
          }
          
          .subcategory-item:hover {
            background-color: #e9ecef;
          }
          
          .subcategory-item.selected {
            background-color: #e7f1ff;
            border-left: 3px solid #0d6efd;
          }
          
          .subcategory-name {
            font-size: 0.9rem;
            color: #495057;
          }
          
          .current-selection {
            margin-top: 1.5rem;
            animation: fadeIn 0.3s ease;
          }
          
          .rtl .category-line {
            border-left: none !important;
            border-right: 4px solid transparent;
          }
          
          .rtl .category-line.selected {
            border-right-color: #0d6efd !important;
          }
          
          .rtl .subcategories-panel {
            border-left: none;
            border-right: 4px solid #e9ecef;
          }
          
          .rtl .subcategory-item.selected {
            border-left: none;
            border-right: 3px solid #0d6efd;
          }
          
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
              max-height: 0;
            }
            to {
              opacity: 1;
              transform: translateY(0);
              max-height: 500px;
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default React.memo(CategoriesAndSubCategory);