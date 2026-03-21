import React, { useState, useEffect, useMemo } from 'react';
import { Offcanvas, Form, Button, Accordion } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { getFilterOptions } from '../../redux/actions/categoryAction';
import wilayasData from './wilayas.json';

const FilterDrawer = ({ 
  show, 
  onHide, 
  onApplyFilters, 
  category,
  subSlug = '',
  articleSlug = '',
  initialWilaya = '',
  initialCommune = '',
  initialMinPrice = null,
  initialMaxPrice = null,
  initialSortBy = 'recent'
}) => {

  const dispatch = useDispatch();
  const isBoutique = category === 'boutiques';
  const isServices = category === 'services';
  const isEmploi = category === 'emploi';
  const isVoyages = category === 'voyages';

  // Campos específicos por categoría
  const getCategoryFields = () => {
    // Categorías que NO tienen precio
    const noPriceCategories = ['boutiques', 'services', 'emploi', 'voyages', 'immobilier'];
    
    // Categorías que tienen campos especiales
    const specialFields = {
      'immobilier': ['type_immobilier', 'surface', 'pieces', 'etage'],
      'emploi': ['type_contrat', 'secteur', 'experience', 'salaire'],
      'vehicules': ['marque', 'modele', 'annee', 'kilometrage', 'carburant'],
      'voyages': ['type_voyage', 'destination', 'duree', 'hebergement'],
      'services': ['type_service', 'disponibilite', 'tarif_horaire']
    };

    return {
      hasPrice: !noPriceCategories.includes(category),
      specialFields: specialFields[category] || []
    };
  };

  const categoryFields = getCategoryFields();

  const { children = [], priceRange = { min: 0, max: 1000000 } } = useSelector(state => state.filter);

  const [tempFilters, setTempFilters] = useState({
    subCategory: subSlug,
    article: articleSlug,
    wilaya: initialWilaya,
    commune: initialCommune,
    priceMin: initialMinPrice || priceRange.min,
    priceMax: initialMaxPrice || priceRange.max,
    sortBy: initialSortBy,
    // Campos especiales
    type_immobilier: '',
    surface_min: '',
    surface_max: '',
    pieces: '',
    type_contrat: '',
    secteur: '',
    experience: '',
    salaire_min: '',
    salaire_max: '',
    marque: '',
    modele: '',
    annee_min: '',
    annee_max: '',
    kilometrage_max: '',
    carburant: '',
    type_voyage: '',
    destination: '',
    duree: '',
    type_service: '',
    tarif_horaire_min: '',
    tarif_horaire_max: ''
  });

  const [communesList, setCommunesList] = useState([]);

  useEffect(() => {
    if (show && category) {
      dispatch(getFilterOptions(category, subSlug, articleSlug));
    }
  }, [show, category, subSlug, articleSlug, dispatch]);

  useEffect(() => {
    if (tempFilters.wilaya) {
      const wilaya = wilayasData.find(w => 
        w.wilaya === tempFilters.wilaya || 
        w.name === tempFilters.wilaya
      );

      setCommunesList(wilaya?.commune || wilaya?.communes || []);
    } else {
      setCommunesList([]);
    }
  }, [tempFilters.wilaya]);

  const handleChange = (key, value) => {
    setTempFilters(prev => ({ ...prev, [key]: value }));

    if (key === 'wilaya') {
      setTempFilters(prev => ({ ...prev, commune: '' }));
    }

    if (key === 'subCategory') {
      setTempFilters(prev => ({ ...prev, article: '' }));
    }
  };

  const applyFilters = () => {
    // Limpiar filtros según categoría
    let finalFilters = { ...tempFilters };

    if (!categoryFields.hasPrice) {
      finalFilters.priceMin = null;
      finalFilters.priceMax = null;
    }

    // Eliminar campos vacíos
    Object.keys(finalFilters).forEach(key => {
      if (finalFilters[key] === '' || finalFilters[key] === null) {
        delete finalFilters[key];
      }
    });

    onApplyFilters(finalFilters);
    onHide();
  };

  const resetFilters = () => {
    setTempFilters({
      subCategory: subSlug,
      article: articleSlug,
      wilaya: '',
      commune: '',
      priceMin: priceRange.min,
      priceMax: priceRange.max,
      sortBy: 'recent'
    });
  };

  const subCategoryOptions = useMemo(() => {
    return children.map(c => ({
      value: c.slug,
      label: c.name
    }));
  }, [children]);

  // Opciones para selects dinámicos
  const contractOptions = [
    { value: 'cdi', label: 'CDI' },
    { value: 'cdd', label: 'CDD' },
    { value: 'interim', label: 'Intérim' },
    { value: 'stage', label: 'Stage' },
    { value: 'freelance', label: 'Freelance' }
  ];

  const sectorOptions = [
    { value: 'informatique', label: 'Informatique' },
    { value: 'commerce', label: 'Commerce' },
    { value: 'industrie', label: 'Industrie' },
    { value: 'service', label: 'Service' },
    { value: 'batiment', label: 'Bâtiment' }
  ];

  const fuelOptions = [
    { value: 'essence', label: 'Essence' },
    { value: 'diesel', label: 'Diesel' },
    { value: 'electrique', label: 'Électrique' },
    { value: 'hybride', label: 'Hybride' }
  ];

  const propertyTypeOptions = [
    { value: 'appartement', label: 'Appartement' },
    { value: 'villa', label: 'Villa' },
    { value: 'terrain', label: 'Terrain' },
    { value: 'local', label: 'Local commercial' }
  ];

  const travelTypeOptions = [
    { value: 'sejour', label: 'Séjour' },
    { value: 'circuit', label: 'Circuit' },
    { value: 'croisiere', label: 'Croisière' },
    { value: 'hajj', label: 'Hajj & Omra' }
  ];

  return (
    <Offcanvas
      show={show}
      onHide={onHide}
      style={{
        width: '320px',
        maxWidth: '90%',
        borderLeft: '1px solid #eee',
        boxShadow: '-2px 0 10px rgba(0,0,0,0.05)'
      }}
    >
      {/* HEADER */}
      <Offcanvas.Header closeButton>
        <Offcanvas.Title style={{ fontSize: '16px', fontWeight: 600 }}>
          Filtres {isBoutique ? 'Boutiques' : ''}
        </Offcanvas.Title>
      </Offcanvas.Header>

      {/* BODY */}
      <Offcanvas.Body style={{ padding: '14px', paddingBottom: '80px' }}>

        {/* SUBCATEGORY - Siempre visible si hay hijos */}
        {children.length > 0 && (
          <Accordion defaultActiveKey="0" flush>
            <Accordion.Item eventKey="0">
              <Accordion.Header>Catégorie</Accordion.Header>
              <Accordion.Body>
                <Select
                  options={subCategoryOptions}
                  value={subCategoryOptions.find(opt => opt.value === tempFilters.subCategory) || null}
                  onChange={(opt) => handleChange('subCategory', opt?.value || '')}
                  isClearable
                  placeholder="Toutes les catégories"
                  styles={{
                    control: (base) => ({ ...base, fontSize: '13px' })
                  }}
                />
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )}

        {/* LOCATION - Siempre visible */}
        <Accordion defaultActiveKey="1" className="mt-2" flush>
          <Accordion.Item eventKey="1">
            <Accordion.Header>Localisation</Accordion.Header>
            <Accordion.Body>
              <Form.Select
                value={tempFilters.wilaya}
                onChange={(e) => handleChange('wilaya', e.target.value)}
                style={{ fontSize: '13px', marginBottom: '8px' }}
              >
                <option value="">Toutes les wilayas</option>
                {wilayasData.map((w, i) => (
                  <option key={i} value={w.wilaya || w.name}>
                    {w.wilaya || w.name}
                  </option>
                ))}
              </Form.Select>

              {communesList.length > 0 && (
                <Form.Select
                  value={tempFilters.commune}
                  onChange={(e) => handleChange('commune', e.target.value)}
                  style={{ fontSize: '13px' }}
                >
                  <option value="">Toutes les communes</option>
                  {communesList.map((c, i) => (
                    <option key={i} value={c}>
                      {c}
                    </option>
                  ))}
                </Form.Select>
              )}
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* PRIX - Solo para categorías que tienen precio */}
        {categoryFields.hasPrice && (
          <Accordion defaultActiveKey="2" className="mt-2" flush>
            <Accordion.Item eventKey="2">
              <Accordion.Header>Prix</Accordion.Header>
              <Accordion.Body>
                <div style={{ padding: '10px 0' }}>
                  <Slider
                    range
                    min={priceRange.min}
                    max={priceRange.max}
                    value={[tempFilters.priceMin, tempFilters.priceMax]}
                    onChange={(val) => {
                      setTempFilters(prev => ({
                        ...prev,
                        priceMin: val[0],
                        priceMax: val[1]
                      }));
                    }}
                    trackStyle={[{ backgroundColor: '#007bff' }]}
                    handleStyle={[
                      { borderColor: '#007bff' },
                      { borderColor: '#007bff' }
                    ]}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '12px' }}>
                    <span>{tempFilters.priceMin?.toLocaleString()} DA</span>
                    <span>{tempFilters.priceMax?.toLocaleString()} DA</span>
                  </div>
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )}

        {/* CAMPOS ESPECÍFICOS PARA INMOBILIARIO */}
        {category === 'immobilier' && (
          <Accordion defaultActiveKey="3" className="mt-2" flush>
            <Accordion.Item eventKey="3">
              <Accordion.Header>Détails immobilier</Accordion.Header>
              <Accordion.Body>
                <Form.Select
                  value={tempFilters.type_immobilier}
                  onChange={(e) => handleChange('type_immobilier', e.target.value)}
                  style={{ fontSize: '13px', marginBottom: '8px' }}
                >
                  <option value="">Type de bien</option>
                  {propertyTypeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Form.Select>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <Form.Control
                    type="number"
                    placeholder="Surface min (m²)"
                    value={tempFilters.surface_min}
                    onChange={(e) => handleChange('surface_min', e.target.value)}
                    size="sm"
                  />
                  <Form.Control
                    type="number"
                    placeholder="Surface max"
                    value={tempFilters.surface_max}
                    onChange={(e) => handleChange('surface_max', e.target.value)}
                    size="sm"
                  />
                </div>

                <Form.Select
                  value={tempFilters.pieces}
                  onChange={(e) => handleChange('pieces', e.target.value)}
                  style={{ fontSize: '13px' }}
                >
                  <option value="">Nombre de pièces</option>
                  <option value="1">Studio</option>
                  <option value="2">F2</option>
                  <option value="3">F3</option>
                  <option value="4">F4</option>
                  <option value="5">F5+</option>
                </Form.Select>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )}

        {/* CAMPOS ESPECÍFICOS PARA EMPLOI */}
        {category === 'emploi' && (
          <Accordion defaultActiveKey="3" className="mt-2" flush>
            <Accordion.Item eventKey="3">
              <Accordion.Header>Détails emploi</Accordion.Header>
              <Accordion.Body>
                <Form.Select
                  value={tempFilters.type_contrat}
                  onChange={(e) => handleChange('type_contrat', e.target.value)}
                  style={{ fontSize: '13px', marginBottom: '8px' }}
                >
                  <option value="">Type de contrat</option>
                  {contractOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Form.Select>

                <Form.Select
                  value={tempFilters.secteur}
                  onChange={(e) => handleChange('secteur', e.target.value)}
                  style={{ fontSize: '13px', marginBottom: '8px' }}
                >
                  <option value="">Secteur d'activité</option>
                  {sectorOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Form.Select>

                <Form.Select
                  value={tempFilters.experience}
                  onChange={(e) => handleChange('experience', e.target.value)}
                  style={{ fontSize: '13px', marginBottom: '8px' }}
                >
                  <option value="">Expérience</option>
                  <option value="debutant">Débutant</option>
                  <option value="1-3">1-3 ans</option>
                  <option value="3-5">3-5 ans</option>
                  <option value="5+">5+ ans</option>
                </Form.Select>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <Form.Control
                    type="number"
                    placeholder="Salaire min"
                    value={tempFilters.salaire_min}
                    onChange={(e) => handleChange('salaire_min', e.target.value)}
                    size="sm"
                  />
                  <Form.Control
                    type="number"
                    placeholder="Salaire max"
                    value={tempFilters.salaire_max}
                    onChange={(e) => handleChange('salaire_max', e.target.value)}
                    size="sm"
                  />
                </div>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )}

        {/* CAMPOS ESPECÍFICOS PARA VEHICULES */}
        {category === 'vehicules' && (
          <Accordion defaultActiveKey="3" className="mt-2" flush>
            <Accordion.Item eventKey="3">
              <Accordion.Header>Détails véhicule</Accordion.Header>
              <Accordion.Body>
                <Form.Control
                  type="text"
                  placeholder="Marque"
                  value={tempFilters.marque}
                  onChange={(e) => handleChange('marque', e.target.value)}
                  size="sm"
                  className="mb-2"
                />

                <Form.Control
                  type="text"
                  placeholder="Modèle"
                  value={tempFilters.modele}
                  onChange={(e) => handleChange('modele', e.target.value)}
                  size="sm"
                  className="mb-2"
                />

                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <Form.Control
                    type="number"
                    placeholder="Année min"
                    value={tempFilters.annee_min}
                    onChange={(e) => handleChange('annee_min', e.target.value)}
                    size="sm"
                  />
                  <Form.Control
                    type="number"
                    placeholder="Année max"
                    value={tempFilters.annee_max}
                    onChange={(e) => handleChange('annee_max', e.target.value)}
                    size="sm"
                  />
                </div>

                <Form.Control
                  type="number"
                  placeholder="Kilométrage max (km)"
                  value={tempFilters.kilometrage_max}
                  onChange={(e) => handleChange('kilometrage_max', e.target.value)}
                  size="sm"
                  className="mb-2"
                />

                <Form.Select
                  value={tempFilters.carburant}
                  onChange={(e) => handleChange('carburant', e.target.value)}
                  style={{ fontSize: '13px' }}
                >
                  <option value="">Carburant</option>
                  {fuelOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Form.Select>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )}

        {/* CAMPOS ESPECÍFICOS PARA VOYAGES */}
        {category === 'voyages' && (
          <Accordion defaultActiveKey="3" className="mt-2" flush>
            <Accordion.Item eventKey="3">
              <Accordion.Header>Détails voyage</Accordion.Header>
              <Accordion.Body>
                <Form.Select
                  value={tempFilters.type_voyage}
                  onChange={(e) => handleChange('type_voyage', e.target.value)}
                  style={{ fontSize: '13px', marginBottom: '8px' }}
                >
                  <option value="">Type de voyage</option>
                  {travelTypeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Form.Select>

                <Form.Control
                  type="text"
                  placeholder="Destination"
                  value={tempFilters.destination}
                  onChange={(e) => handleChange('destination', e.target.value)}
                  size="sm"
                  className="mb-2"
                />

                <Form.Select
                  value={tempFilters.duree}
                  onChange={(e) => handleChange('duree', e.target.value)}
                  style={{ fontSize: '13px' }}
                >
                  <option value="">Durée</option>
                  <option value="weekend">Week-end</option>
                  <option value="semaine">1 semaine</option>
                  <option value="2semaines">2 semaines</option>
                  <option value="mois">1 mois</option>
                </Form.Select>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )}

        {/* SORT BY - Siempre visible */}
        <Accordion defaultActiveKey="last" className="mt-2" flush>
          <Accordion.Item eventKey="last">
            <Accordion.Header>Trier par</Accordion.Header>
            <Accordion.Body>
              <Form.Select
                value={tempFilters.sortBy}
                onChange={(e) => handleChange('sortBy', e.target.value)}
                style={{ fontSize: '13px' }}
              >
                <option value="recent">Plus récents</option>
                <option value="price_asc">Prix croissant</option>
                <option value="price_desc">Prix décroissant</option>
                {category === 'emploi' && (
                  <>
                    <option value="salaire_asc">Salaire croissant</option>
                    <option value="salaire_desc">Salaire décroissant</option>
                  </>
                )}
                {category === 'vehicules' && (
                  <>
                    <option value="annee_desc">Année (récent→ancien)</option>
                    <option value="annee_asc">Année (ancien→récent)</option>
                    <option value="kilometrage_asc">Kilométrage croissant</option>
                  </>
                )}
                {category === 'immobilier' && (
                  <>
                    <option value="surface_desc">Surface (grand→petit)</option>
                    <option value="surface_asc">Surface (petit→grand)</option>
                    <option value="pieces_desc">Pièces (plus→moins)</option>
                  </>
                )}
              </Form.Select>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* BOTONES */}
        <div style={{
          position: 'sticky',
          bottom: '0',
          left: '0',
          right: '0',
          backgroundColor: 'white',
          padding: '15px 0',
          marginTop: '20px',
          borderTop: '1px solid #eee',
          display: 'flex',
          gap: '10px'
        }}>
          <Button 
            variant="outline-secondary" 
            onClick={resetFilters} 
            size="sm" 
            style={{ flex: 1 }}
          >
            Réinitialiser
          </Button>

          <Button 
            variant="primary" 
            onClick={applyFilters} 
            size="sm" 
            style={{ flex: 1 }}
          >
            Appliquer
          </Button>
        </div>

      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default FilterDrawer;