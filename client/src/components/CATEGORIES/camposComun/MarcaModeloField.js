// 📁 client/src/components/CATEGORIES/camposComun/MarcaModeloField.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Form, Alert, Badge, Spinner, Row, Col, Button } from 'react-bootstrap';
import { Search, Filter, Plus, ChevronDown, ChevronUp } from 'react-bootstrap-icons';
import telefonosData from './telefonos.json';

// 📊 Configuración de categorías que usan marca/modelo
const CATEGORIES_WITH_BRAND_MODEL = [
  'vehicules', 'telephones', 'informatique', 'electromenager', 
  'vetements', 'loisirs', 'sport', 'piecesDetachees'
];

const MarcaModeloField = ({ 
  mainCategory,
  subCategory,
  postData,
  handleChangeInput,
  isRTL,
  t,
  brandField = 'marque',
  modelField = 'modele',
  showAdvanced = true,
  required = false
}) => {
  // Estados
  const [selectedBrand, setSelectedBrand] = useState(postData[brandField] || '');
  const [selectedModel, setSelectedModel] = useState(postData[modelField] || '');
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [filteredModels, setFilteredModels] = useState([]);
  const [searchBrandQuery, setSearchBrandQuery] = useState('');
  const [searchModelQuery, setSearchModelQuery] = useState('');
  const [isLoadingBrands, setIsLoadingBrands] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllModels, setShowAllModels] = useState(false);
  const [customBrand, setCustomBrand] = useState('');
  const [customModel, setCustomModel] = useState('');

  // 📦 Obtener todas las marcas del JSON
  const allBrands = useMemo(() => {
    if (!telefonosData || !Array.isArray(telefonosData)) return [];
    return telefonosData.map(item => item.marca).sort();
  }, []);

  // 🔍 Filtrar marcas según búsqueda
  useEffect(() => {
    if (!allBrands.length) return;

    setIsLoadingBrands(true);
    
    const timer = setTimeout(() => {
      let brands = [...allBrands];
      
      if (searchBrandQuery.trim()) {
        const query = searchBrandQuery.toLowerCase();
        brands = brands.filter(brand => 
          brand.toLowerCase().includes(query)
        );
      }
      
      if (!showAllBrands && brands.length > 20) {
        brands = brands.slice(0, 20);
      }
      
      setFilteredBrands(brands);
      setIsLoadingBrands(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [allBrands, searchBrandQuery, showAllBrands]);

  // 📦 Obtener modelos según marca seleccionada
  useEffect(() => {
    if (!selectedBrand || selectedBrand === 'autre') {
      setFilteredModels([]);
      setSelectedModel('');
      return;
    }

    setIsLoadingModels(true);
    
    const timer = setTimeout(() => {
      const brandData = telefonosData.find(item => item.marca === selectedBrand);
      let models = brandData?.modelo || [];
      
      if (searchModelQuery.trim()) {
        const query = searchModelQuery.toLowerCase();
        models = models.filter(model => 
          model.toLowerCase().includes(query)
        );
      }
      
      if (!showAllModels && models.length > 20) {
        models = models.slice(0, 20);
      }
      
      setFilteredModels(models);
      setIsLoadingModels(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [selectedBrand, searchModelQuery, showAllModels]);

  // 🎯 Manejar cambio de marca
  const handleBrandChange = useCallback((e) => {
    const value = e.target.value;
    setSelectedBrand(value);
    
    if (value === 'autre') {
      // Si selecciona "otra", mostrar input personalizado
      setCustomBrand('');
      handleChangeInput({ target: { name: brandField, value: 'autre' } });
      handleChangeInput({ target: { name: modelField, value: '' } });
      setSelectedModel('');
    } else {
      handleChangeInput({ target: { name: brandField, value } });
      setSelectedModel('');
      handleChangeInput({ target: { name: modelField, value: '' } });
    }
  }, [brandField, modelField, handleChangeInput]);

  // 🎯 Manejar cambio de modelo
  const handleModelChange = useCallback((e) => {
    const value = e.target.value;
    setSelectedModel(value);
    
    if (value === 'autre') {
      setCustomModel('');
      handleChangeInput({ target: { name: modelField, value: 'autre' } });
    } else {
      handleChangeInput({ target: { name: modelField, value } });
    }
  }, [modelField, handleChangeInput]);

  // 🎯 Manejar marca personalizada
  const handleCustomBrandChange = useCallback((e) => {
    const value = e.target.value;
    setCustomBrand(value);
    handleChangeInput({ target: { name: brandField, value } });
  }, [brandField, handleChangeInput]);

  // 🎯 Manejar modelo personalizado
  const handleCustomModelChange = useCallback((e) => {
    const value = e.target.value;
    setCustomModel(value);
    handleChangeInput({ target: { name: modelField, value } });
  }, [modelField, handleChangeInput]);

  // Si la categoría no usa marca/modelo
  if (!CATEGORIES_WITH_BRAND_MODEL.includes(mainCategory)) {
    return null;
  }

  // Si no hay datos de teléfonos
  if (!telefonosData || !Array.isArray(telefonosData)) {
    console.warn('⚠️ No se pudo cargar telefonos.json');
    return (
      <div className="mb-3">
        <Form.Label className="fw-bold">
          {t?.('brand', 'Marque')}
        </Form.Label>
        <Form.Control
          type="text"
          name={brandField}
          value={postData[brandField] || ''}
          onChange={handleChangeInput}
          placeholder={t?.('enterBrand', 'Entrez la marque')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        <Form.Label className="fw-bold mt-2">
          {t?.('model', 'Modèle')}
        </Form.Label>
        <Form.Control
          type="text"
          name={modelField}
          value={postData[modelField] || ''}
          onChange={handleChangeInput}
          placeholder={t?.('enterModel', 'Entrez le modèle')}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </div>
    );
  }

  return (
    <div className="marca-modelo-field">
      <Row>
        {/* Columna Marca */}
        <Col md={6} className="mb-3">
          <Form.Group>
            <Form.Label className="fw-bold">
              🏷️ {t?.('brand', 'Marque')}
              {required && <span className="text-danger ms-1">*</span>}
            </Form.Label>

            {selectedBrand === 'autre' ? (
              // Input personalizado para marca
              <Form.Control
                type="text"
                value={customBrand}
                onChange={handleCustomBrandChange}
                placeholder={t?.('enterCustomBrand', 'Entrez votre marque')}
                dir={isRTL ? 'rtl' : 'ltr'}
                autoFocus
              />
            ) : (
              <>
                {/* Buscador de marcas */}
                {showAdvanced && (
                  <div className="position-relative mb-2">
                    <Form.Control
                      type="text"
                      placeholder={t?.('searchBrand', 'Rechercher une marque...')}
                      value={searchBrandQuery}
                      onChange={(e) => setSearchBrandQuery(e.target.value)}
                      className="ps-4"
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                    <Search className="position-absolute top-50 translate-middle-y ms-2 text-muted" size={16} />
                  </div>
                )}

                {/* Selector de marcas */}
                <Form.Select
                  value={selectedBrand}
                  onChange={handleBrandChange}
                  required={required}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  disabled={isLoadingBrands}
                >
                  <option value="">{t?.('selectBrand', 'Sélectionnez une marque')}</option>
                  {filteredBrands.map((brand) => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                  <option value="autre">➕ {t?.('otherBrand', 'Autre marque...')}</option>
                </Form.Select>

                {/* Info de marcas */}
                <div className="mt-2 d-flex justify-content-between align-items-center">
                  <small className="text-muted">
                    <i className="fas fa-tags me-1"></i>
                    {filteredBrands.length} marques disponibles
                  </small>
                  
                  {filteredBrands.length > 20 && (
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 text-decoration-none"
                      onClick={() => setShowAllBrands(!showAllBrands)}
                    >
                      {showAllBrands ? (
                        <><ChevronUp size={12} /> Voir moins</>
                      ) : (
                        <><ChevronDown size={12} /> Voir plus</>
                      )}
                    </Button>
                  )}
                </div>

                {isLoadingBrands && (
                  <div className="text-center mt-2">
                    <Spinner animation="border" size="sm" />
                    <small className="ms-2 text-muted">Chargement...</small>
                  </div>
                )}
              </>
            )}
          </Form.Group>
        </Col>

        {/* Columna Modelo */}
        <Col md={6} className="mb-3">
          <Form.Group>
            <Form.Label className="fw-bold">
              🛠️ {t?.('model', 'Modèle')}
            </Form.Label>

            {selectedBrand === 'autre' || selectedModel === 'autre' ? (
              // Input personalizado para modelo
              <Form.Control
                type="text"
                value={customModel}
                onChange={handleCustomModelChange}
                placeholder={t?.('enterCustomModel', 'Entrez votre modèle')}
                dir={isRTL ? 'rtl' : 'ltr'}
                autoFocus={selectedModel === 'autre'}
              />
            ) : !selectedBrand ? (
              <Alert variant="warning" className="mb-0 py-2">
                <small>ℹ️ {t?.('selectBrandFirst', 'Sélectionnez d\'abord une marque')}</small>
              </Alert>
            ) : (
              <>
                {/* Buscador de modelos */}
                {showAdvanced && filteredModels.length > 10 && (
                  <div className="position-relative mb-2">
                    <Form.Control
                      type="text"
                      placeholder={t?.('searchModel', 'Rechercher un modèle...')}
                      value={searchModelQuery}
                      onChange={(e) => setSearchModelQuery(e.target.value)}
                      className="ps-4"
                      dir={isRTL ? 'rtl' : 'ltr'}
                    />
                    <Search className="position-absolute top-50 translate-middle-y ms-2 text-muted" size={16} />
                  </div>
                )}

                {/* Selector de modelos */}
                <Form.Select
                  value={selectedModel}
                  onChange={handleModelChange}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  disabled={isLoadingModels || !selectedBrand}
                >
                  <option value="">
                    {isLoadingModels 
                      ? 'Chargement...' 
                      : t?.('selectModel', 'Sélectionnez un modèle')
                    }
                  </option>
                  
                  {filteredModels.map((model) => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                  
                  <option value="autre">➕ {t?.('otherModel', 'Autre modèle...')}</option>
                </Form.Select>

                {/* Info de modelos */}
                {filteredModels.length > 0 && (
                  <div className="mt-2 d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      <i className="fas fa-list me-1"></i>
                      {filteredModels.length} modèles disponibles pour {selectedBrand}
                    </small>
                    
                    {filteredModels.length > 20 && (
                      <Button
                        variant="link"
                        size="sm"
                        className="p-0 text-decoration-none"
                        onClick={() => setShowAllModels(!showAllModels)}
                      >
                        {showAllModels ? (
                          <><ChevronUp size={12} /> Voir moins</>
                        ) : (
                          <><ChevronDown size={12} /> Voir plus</>
                        )}
                      </Button>
                    )}
                  </div>
                )}

                {isLoadingModels && (
                  <div className="text-center mt-2">
                    <Spinner animation="border" size="sm" />
                    <small className="ms-2 text-muted">Chargement des modèles...</small>
                  </div>
                )}

                {!isLoadingModels && filteredModels.length === 0 && selectedBrand && selectedBrand !== 'autre' && (
                  <Alert variant="info" className="mt-2 py-1 mb-0">
                    <small>
                      <i className="fas fa-info-circle me-1"></i>
                      Aucun modèle trouvé. Vous pouvez ajouter un modèle personnalisé.
                    </small>
                  </Alert>
                )}
              </>
            )}
          </Form.Group>
        </Col>
      </Row>

      {/* Badges de información */}
      {selectedBrand && selectedBrand !== 'autre' && selectedModel && selectedModel !== 'autre' && (
        <div className="mt-2">
          <Badge bg="success" className="me-2">
            ✅ {selectedBrand} {selectedModel}
          </Badge>
          <small className="text-muted">
            <i className="fas fa-check-circle me-1"></i>
            Configuration complète
          </small>
        </div>
      )}

      <style jsx>{`
        .marca-modelo-field {
          width: 100%;
        }
        .position-relative {
          position: relative;
        }
        .ps-4 {
          padding-left: 2rem;
        }
        [dir="rtl"] .ps-4 {
          padding-left: 0.75rem;
          padding-right: 2rem;
        }
      `}</style>
    </div>
  );
};

export default MarcaModeloField;