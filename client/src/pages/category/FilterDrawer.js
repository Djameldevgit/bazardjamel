// 📂 components/FilterDrawer.js

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

  // Campos específicos por categoría
  const getCategoryFields = () => {
    const noPriceCategories = ['boutiques', 'services', 'emploi', 'voyages', 'immobilier'];
    return {
      hasPrice: !noPriceCategories.includes(category)
    };
  };

  const categoryFields = getCategoryFields();

  // 🔥 Obtener datos del reducer de filtros
  const { children = [], priceRange = { min: 0, max: 1000000 }, wilayas = [] } = useSelector(state => state.filter || {});

  const [tempFilters, setTempFilters] = useState({
    subCategory: subSlug,
    article: articleSlug,
    wilaya: initialWilaya,
    commune: initialCommune,
    priceMin: initialMinPrice !== null ? initialMinPrice : priceRange.min,
    priceMax: initialMaxPrice !== null ? initialMaxPrice : priceRange.max,
    sortBy: initialSortBy
  });

  const [communesList, setCommunesList] = useState([]);

  // Cargar opciones de filtro cuando se abre el drawer
  useEffect(() => {
    if (show && category) {
      console.log('🔍 FilterDrawer - Cargando opciones para:', { category, subSlug, articleSlug });
      dispatch(getFilterOptions(category, subSlug, articleSlug));
    }
  }, [show, category, subSlug, articleSlug, dispatch]);

  // Actualizar comunas cuando cambia la wilaya
  useEffect(() => {
    if (tempFilters.wilaya) {
      const wilayaData = wilayasData.find(w => 
        w.wilaya === tempFilters.wilaya || 
        w.name === tempFilters.wilaya
      );
      setCommunesList(wilayaData?.commune || wilayaData?.communes || []);
    } else {
      setCommunesList([]);
    }
  }, [tempFilters.wilaya]);

  // Actualizar precios cuando cambia priceRange del reducer
  useEffect(() => {
    if (priceRange && (initialMinPrice === null || initialMaxPrice === null)) {
      setTempFilters(prev => ({
        ...prev,
        priceMin: initialMinPrice !== null ? initialMinPrice : priceRange.min,
        priceMax: initialMaxPrice !== null ? initialMaxPrice : priceRange.max
      }));
    }
  }, [priceRange, initialMinPrice, initialMaxPrice]);

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
    let finalFilters = {
      subCategory: tempFilters.subCategory,
      article: tempFilters.article,
      wilaya: tempFilters.wilaya || null,
      commune: tempFilters.commune || null,
      sortBy: tempFilters.sortBy
    };
    
    if (categoryFields.hasPrice) {
      finalFilters.minPrice = tempFilters.priceMin;
      finalFilters.maxPrice = tempFilters.priceMax;
    }
    
    Object.keys(finalFilters).forEach(key => {
      if (finalFilters[key] === '' || finalFilters[key] === null || finalFilters[key] === undefined) {
        delete finalFilters[key];
      }
    });
    
    console.log('🎯 Aplicando filtros:', finalFilters);
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

  // Opciones para el select de subcategorías
  const subCategoryOptions = useMemo(() => {
    if (!children || !Array.isArray(children)) return [];
    return children.map(c => ({
      value: c.slug,
      label: c.name
    }));
  }, [children]);

  // Opciones para wilayas (usar las que vienen del backend o fallback a wilayasData)
  const wilayaOptions = useMemo(() => {
    if (wilayas && wilayas.length > 0) {
      return wilayas.map(w => ({ value: w.value || w, label: w.label || w }));
    }
    // Fallback a wilayasData
    return wilayasData.map(w => ({ value: w.wilaya || w.name, label: w.wilaya || w.name }));
  }, [wilayas]);

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
      <Offcanvas.Header closeButton>
        <Offcanvas.Title style={{ fontSize: '16px', fontWeight: 600 }}>
          Filtres {isBoutique ? 'Boutiques' : ''}
        </Offcanvas.Title>
      </Offcanvas.Header>

      <Offcanvas.Body style={{ padding: '14px', paddingBottom: '80px' }}>

        {/* SUBCATEGORY */}
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

        {/* LOCATION */}
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
                {wilayaOptions.map((w, i) => (
                  <option key={i} value={w.value}>
                    {w.label}
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

        {/* PRIX */}
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

        {/* SORT BY */}
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