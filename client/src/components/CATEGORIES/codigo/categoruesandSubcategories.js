import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ChevronDown } from 'react-bootstrap-icons';

const CategoriesAndSubCategory = ({ postData, handleChangeInput }) => {
  const { t, i18n } = useTranslation(['categories', 'subcategories']);
  const isRTL = i18n.language === 'ar';
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [selectedOperation, setSelectedOperation] = useState(null);

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
    { id: 'santebeaute', name: t('categories:sante_beaute', 'Santé & Beauté') },
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
    'santebeaute': [
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
      setSelectedOperation(null);
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
      setSelectedOperation(null);
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
    setSelectedOperation(operationId);
    handleChangeInput({
      target: { name: 'articleType', value: operationId }
    });
    handleChangeInput({
      target: { name: 'subCategory', value: '' }
    });
  };

  // Handler para volver a seleccionar operación en immobilier
  const handleBackToOperations = () => {
    setSelectedOperation(null);
    handleChangeInput({
      target: { name: 'articleType', value: '' }
    });
    handleChangeInput({
      target: { name: 'subCategory', value: '' }
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
      <div className="category-accordion-item">
        {/* CABECERA DE CATEGORÍA */}
        <div 
          className={`category-header ${isSelected ? 'selected' : ''}`}
          onClick={() => handleCategorySelect(category.id)}
        >
          <div className="d-flex align-items-center justify-content-between w-100">
            <div className="d-flex align-items-center">
              <div className="category-emoji">
                {emoji}
              </div>
              <div className="category-info ms-3">
                <div className="category-title">
                  {category.name}
                </div>
                <div className="category-subtitle">
                  {category.id}
                </div>
              </div>
            </div>
            <div className="category-actions">
              {isSelected && (
                <span className="selected-badge">
                  ✓
                </span>
              )}
              {hasSubcategories && (
                <span className="expand-icon">
                  {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* CONTENIDO EXPANDIBLE */}
        {isExpanded && hasSubcategories && (
          <div className="category-content">
            {/* CASO INMOBILIARIO (especial con dos niveles) */}
            {isImmobilier ? (
              <div className="immobilier-levels">
                {/* NIVEL 1: Operaciones */}
                <div className={`level-section ${!selectedOperation ? 'active' : ''}`}>
                  <div className="level-header">
                    <h6 className="level-title">
                      <span className="level-icon">📋</span>
                      Sélectionnez une opération
                    </h6>
                    <p className="level-description">
                      Choisissez le type de transaction immobilière
                    </p>
                  </div>
                  <div className="level-items">
                    {immobilierOperations.map((operation) => (
                      <div 
                        key={operation.id}
                        className={`level-item ${postData.articleType === operation.id ? 'selected' : ''}`}
                        onClick={() => handleImmobilierOperation(operation.id)}
                      >
                        <div className="d-flex align-items-center">
                          <div className="item-emoji">
                            {operation.id === 'vente' ? '💰' : 
                             operation.id === 'location' ? '📅' : '🏖️'}
                          </div>
                          <div className="item-info">
                            <div className="item-title">{operation.name}</div>
                            <div className="item-subtitle">
                              {operation.id === 'vente' ? 'Achat/Vente de biens' :
                               operation.id === 'location' ? 'Location à long terme' :
                               'Location saisonnière'}
                            </div>
                          </div>
                        </div>
                        {postData.articleType === operation.id && (
                          <div className="item-check">✓</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* NIVEL 2: Propiedades (solo si hay operación seleccionada) */}
                {selectedOperation && (
                  <div className="level-section active">
                    <div className="level-header">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <h6 className="level-title">
                            <span className="level-icon">🏠</span>
                            Sélectionnez un type de bien
                          </h6>
                          <p className="level-description">
                            Opération: <span className="fw-bold">
                              {immobilierOperations.find(op => op.id === selectedOperation)?.name}
                            </span>
                          </p>
                        </div>
                        <button 
                          className="btn-back"
                          onClick={handleBackToOperations}
                        >
                          ← Changer
                        </button>
                      </div>
                    </div>
                    <div className="level-items">
                      {immobilierProperties[selectedOperation]?.map((property) => (
                        <div 
                          key={property.id}
                          className={`level-item ${postData.subCategory === property.id ? 'selected' : ''}`}
                          onClick={() => handleSubcategorySelect(property.id)}
                        >
                          <div className="d-flex align-items-center">
                            <div className="item-emoji">
                              {property.id === 'appartement' ? '🏢' : 
                               property.id === 'villa' ? '🏡' : '🌳'}
                            </div>
                            <div className="item-info">
                              <div className="item-title">{property.name}</div>
                              <div className="item-subtitle">
                                {property.id === 'appartement' ? 'Appartements et studios' :
                                 property.id === 'villa' ? 'Maisons et villas' :
                                 'Terrains et parcelles'}
                              </div>
                            </div>
                          </div>
                          {postData.subCategory === property.id && (
                            <div className="item-check">✓</div>
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
                <div className="subcategories-header">
                  <h6 className="subcategories-title">
                    <span className="me-2">📂</span>
                    Sous-catégories
                  </h6>
                  <p className="subcategories-description">
                    Choisissez une sous-catégorie
                  </p>
                </div>
                <div className="subcategories-list">
                  {categorySubcats.map((subcat) => (
                    <div 
                      key={subcat.id} 
                      className={`subcategory-item ${postData.subCategory === subcat.id ? 'selected' : ''}`}
                      onClick={() => handleSubcategorySelect(subcat.id)}
                    >
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                          <div className="subcategory-emoji me-3">
                            •
                          </div>
                          <div className="subcategory-info">
                            <div className="subcategory-name">{subcat.name}</div>
                            <div className="subcategory-id">{subcat.id}</div>
                          </div>
                        </div>
                        {postData.subCategory === subcat.id && (
                          <span className="subcategory-check">
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
    const selectedSubcategory = postData.subCategory ? 
      (selectedOperation ? 
        immobilierProperties[selectedOperation]?.find(p => p.id === postData.subCategory)?.name :
        subcategories[postData.categorie]?.find(s => s.id === postData.subCategory)?.name
      ) : null;

    return (
      <div className="current-selection">
        <div className="selection-card">
          <div className="selection-header">
            <h5 className="selection-title">
              <span className="me-2">✅</span>
              Sélection actuelle
            </h5>
          </div>
          <div className="selection-body">
            <div className="selection-item">
              <div className="selection-label">Catégorie:</div>
              <div className="selection-value">
                <span className="selection-emoji">{categoryEmojis[postData.categorie]}</span>
                {selectedCategory?.name}
              </div>
            </div>
            
            {postData.articleType && (
              <div className="selection-item">
                <div className="selection-label">Opération:</div>
                <div className="selection-value">
                  <span className="selection-emoji">
                    {postData.articleType === 'vente' ? '💰' : 
                     postData.articleType === 'location' ? '📅' : '🏖️'}
                  </span>
                  {immobilierOperations.find(op => op.id === postData.articleType)?.name}
                </div>
              </div>
            )}
            
            {postData.subCategory && (
              <div className="selection-item">
                <div className="selection-label">Sous-catégorie:</div>
                <div className="selection-value">
                  <span className="selection-emoji">
                    {postData.subCategory === 'appartement' ? '🏢' : 
                     postData.subCategory === 'villa' ? '🏡' : 
                     postData.subCategory === 'terrain' ? '🌳' : '•'}
                  </span>
                  {selectedSubcategory}
                </div>
              </div>
            )}
          </div>
          <div className="selection-footer">
            <button 
              className="btn-change"
              onClick={() => {
                handleChangeInput({ target: { name: 'categorie', value: '' } });
                handleChangeInput({ target: { name: 'subCategory', value: '' } });
                handleChangeInput({ target: { name: 'articleType', value: '' } });
                setExpandedCategory(null);
                setSelectedOperation(null);
              }}
            >
              Changer de catégorie
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`categories-accordion ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Barra de búsqueda */}
      <div className="search-container mb-4">
        <input
          type="text"
          placeholder="🔍 Rechercher une catégorie..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Contador de resultados */}
      {searchTerm && (
        <div className="results-count mb-3">
          <span className="results-number">{filteredCategories.length}</span>
          <span className="results-text"> catégorie(s) trouvée(s)</span>
        </div>
      )}

      {/* Accordion de catégories */}
      <div className="categories-accordion-list">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))
        ) : (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <div className="no-results-title">Aucune catégorie trouvée</div>
            <div className="no-results-text">
              Essayez avec d'autres termes de recherche
            </div>
          </div>
        )}
      </div>

      {/* Sélection actuelle */}
      {renderCurrentSelection()}

      {/* Styles CSS actualizados */}
      <style>
        {`
          .categories-accordion {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          }
          
          /* Barra de búsqueda */
          .search-container {
            position: relative;
          }
          
          .search-input {
            width: 100%;
            padding: 0.875rem 1rem 0.875rem 2.75rem;
            font-size: 1rem;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            background-color: white;
            transition: all 0.2s ease;
          }
          
          .search-input:focus {
            outline: none;
            border-color: #0d6efd;
            box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.1);
          }
          
          .search-input::placeholder {
            color: #6c757d;
          }
          
          /* Contador de resultados */
          .results-count {
            padding: 0.5rem 1rem;
            background-color: #f8f9fa;
            border-radius: 6px;
            font-size: 0.95rem;
          }
          
          .results-number {
            font-weight: bold;
            color: #0d6efd;
          }
          
          .results-text {
            color: #6c757d;
          }
          
          /* Lista de categorías */
          .categories-accordion-list {
            display: flex;
            flex-direction: column;
            gap: 4px;
            max-height: 600px;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: #adb5bd #f8f9fa;
            padding-right: 8px;
          }
          
          .categories-accordion-list::-webkit-scrollbar {
            width: 8px;
          }
          
          .categories-accordion-list::-webkit-scrollbar-track {
            background: #f8f9fa;
            border-radius: 4px;
          }
          
          .categories-accordion-list::-webkit-scrollbar-thumb {
            background-color: #adb5bd;
            border-radius: 4px;
          }
          
          /* Ítem del accordion */
          .category-accordion-item {
            margin-bottom: 4px;
            border-radius: 8px;
            overflow: hidden;
            background-color: white;
            border: 1px solid #e9ecef;
            transition: all 0.2s ease;
          }
          
          .category-accordion-item:hover {
            border-color: #dee2e6;
          }
          
          /* Cabecera de categoría */
          .category-header {
            padding: 1rem 1.25rem;
            cursor: pointer;
            background-color: white;
            transition: all 0.2s ease;
            border-bottom: 1px solid transparent;
          }
          
          .category-header:hover {
            background-color: #f8f9fa;
          }
          
          .category-header.selected {
            background-color: #f8f9ff;
            border-left: 4px solid #0d6efd;
          }
          
          .category-emoji {
            font-size: 1.5rem;
            min-width: 40px;
            text-align: center;
          }
          
          .category-info {
            flex-grow: 1;
          }
          
          .category-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #212529;
            line-height: 1.3;
          }
          
          .category-subtitle {
            font-size: 0.875rem;
            color: #6c757d;
            margin-top: 2px;
          }
          
          .category-actions {
            display: flex;
            align-items: center;
            gap: 8px;
          }
          
          .selected-badge {
            background-color: #198754;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.875rem;
          }
          
          .expand-icon {
            color: #6c757d;
            transition: transform 0.2s ease;
          }
          
          /* Contenido expandible */
          .category-content {
            background-color: #f8f9fa;
            border-top: 1px solid #e9ecef;
            animation: slideDown 0.3s ease-out;
          }
          
          /* Niveles para immobilier */
          .immobilier-levels {
            padding: 1.5rem;
          }
          
          .level-section {
            margin-bottom: 1.5rem;
          }
          
          .level-section.active {
            display: block;
          }
          
          .level-header {
            margin-bottom: 1rem;
          }
          
          .level-title {
            font-size: 1rem;
            font-weight: 600;
            color: #212529;
            margin-bottom: 0.25rem;
            display: flex;
            align-items: center;
          }
          
          .level-icon {
            margin-right: 0.5rem;
            font-size: 1.2rem;
          }
          
          .level-description {
            font-size: 0.9rem;
            color: #6c757d;
            margin-bottom: 0;
          }
          
          .level-items {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .level-item {
            padding: 1rem;
            background-color: white;
            border-radius: 6px;
            border: 2px solid transparent;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .level-item:hover {
            border-color: #dee2e6;
            transform: translateY(-1px);
          }
          
          .level-item.selected {
            border-color: #0d6efd;
            background-color: #f8f9ff;
          }
          
          .item-emoji {
            font-size: 1.4rem;
            min-width: 40px;
            text-align: center;
          }
          
          .item-info {
            flex-grow: 1;
          }
          
          .item-title {
            font-size: 1rem;
            font-weight: 500;
            color: #212529;
          }
          
          .item-subtitle {
            font-size: 0.85rem;
            color: #6c757d;
            margin-top: 2px;
          }
          
          .item-check {
            color: #198754;
            font-weight: bold;
            font-size: 1.2rem;
          }
          
          .btn-back {
            background: none;
            border: none;
            color: #6c757d;
            font-size: 0.875rem;
            cursor: pointer;
            padding: 0.25rem 0.5rem;
            border-radius: 4px;
            transition: all 0.2s ease;
          }
          
          .btn-back:hover {
            color: #0d6efd;
            background-color: #f8f9fa;
          }
          
          /* Subcategorías regulares */
          .regular-subcategories {
            padding: 1.5rem;
          }
          
          .subcategories-header {
            margin-bottom: 1rem;
          }
          
          .subcategories-title {
            font-size: 1rem;
            font-weight: 600;
            color: #212529;
            margin-bottom: 0.25rem;
          }
          
          .subcategories-description {
            font-size: 0.9rem;
            color: #6c757d;
            margin-bottom: 0;
          }
          
          .subcategories-list {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .subcategory-item {
            padding: 0.875rem 1rem;
            background-color: white;
            border-radius: 6px;
            border-left: 3px solid transparent;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .subcategory-item:hover {
            background-color: #f8f9fa;
          }
          
          .subcategory-item.selected {
            border-left-color: #0d6efd;
            background-color: #f8f9ff;
          }
          
          .subcategory-emoji {
            font-size: 1.2rem;
            color: #6c757d;
          }
          
          .subcategory-info {
            flex-grow: 1;
          }
          
          .subcategory-name {
            font-size: 0.95rem;
            font-weight: 500;
            color: #212529;
          }
          
          .subcategory-id {
            font-size: 0.8rem;
            color: #6c757d;
            margin-top: 1px;
          }
          
          .subcategory-check {
            color: #198754;
            font-weight: bold;
            font-size: 1.1rem;
          }
          
          /* No results */
          .no-results {
            text-align: center;
            padding: 3rem 1rem;
          }
          
          .no-results-icon {
            font-size: 2.5rem;
            margin-bottom: 1rem;
            opacity: 0.5;
          }
          
          .no-results-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #6c757d;
            margin-bottom: 0.5rem;
          }
          
          .no-results-text {
            font-size: 0.9rem;
            color: #adb5bd;
          }
          
          /* Selección actual */
          .current-selection {
            margin-top: 2rem;
            animation: fadeIn 0.3s ease;
          }
          
          .selection-card {
            background: linear-gradient(135deg, #f8f9ff 0%, #f1f5ff 100%);
            border-radius: 10px;
            border: 1px solid #e0e7ff;
            overflow: hidden;
          }
          
          .selection-header {
            padding: 1rem 1.5rem;
            background-color: rgba(13, 110, 253, 0.05);
            border-bottom: 1px solid #e0e7ff;
          }
          
          .selection-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #0d6efd;
            margin: 0;
            display: flex;
            align-items: center;
          }
          
          .selection-body {
            padding: 1.5rem;
          }
          
          .selection-item {
            margin-bottom: 1rem;
            display: flex;
            align-items: flex-start;
          }
          
          .selection-item:last-child {
            margin-bottom: 0;
          }
          
          .selection-label {
            font-size: 0.9rem;
            color: #6c757d;
            min-width: 120px;
            font-weight: 500;
          }
          
          .selection-value {
            font-size: 1rem;
            font-weight: 500;
            color: #212529;
            display: flex;
            align-items: center;
            flex-grow: 1;
          }
          
          .selection-emoji {
            margin-right: 0.5rem;
            font-size: 1.2rem;
          }
          
          .selection-footer {
            padding: 1rem 1.5rem;
            background-color: white;
            border-top: 1px solid #e9ecef;
            text-align: center;
          }
          
          .btn-change {
            background-color: white;
            color: #0d6efd;
            border: 1px solid #0d6efd;
            padding: 0.5rem 1.5rem;
            border-radius: 6px;
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .btn-change:hover {
            background-color: #0d6efd;
            color: white;
          }
          
          /* Animations */
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
              max-height: 0;
            }
            to {
              opacity: 1;
              transform: translateY(0);
              max-height: 1000px;
            }
          }
          
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          /* RTL Support */
          .rtl .category-header.selected {
            border-left: none;
            border-right: 4px solid #0d6efd;
          }
          
          .rtl .subcategory-item.selected {
            border-left: none;
            border-right: 3px solid #0d6efd;
          }
          
          .rtl .selection-emoji {
            margin-right: 0;
            margin-left: 0.5rem;
          }
          
          .rtl .item-emoji,
          .rtl .category-emoji,
          .rtl .subcategory-emoji {
            margin-right: 0;
            margin-left: 0.5rem;
          }
        `}
      </style>
    </div>
  );
};

export default React.memo(CategoriesAndSubCategory);