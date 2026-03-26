// components/boutique/sections/components/FilterDrawer.jsx
import React from 'react';
import { Offcanvas, Drawer, Form, Button, Accordion, Badge } from 'react-bootstrap';
import { FaTimes, FaSearch, FaFilter } from 'react-icons/fa';

const FilterDrawer = ({ 
  show, 
  onHide, 
  isMobile, 
  isDesktop,
  filters,
  onFilterChange,
  categories,
  subCategories,
  articleTypes,
  activeFiltersCount,
  onClearFilters,
  boutiqueTheme 
}) => {
  
  const FilterContent = () => (
    <div className="filter-content">
      {/* Búsqueda */}
      <div className="mb-4">
        <Form.Control
          type="text"
          placeholder="Rechercher un produit..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
          className="border-0 bg-light"
          style={{ borderRadius: '30px', padding: '12px 20px' }}
        />
      </div>

      <Accordion defaultActiveKey={['0', '1', '2', '3']} alwaysOpen>
        {/* Categorías */}
        <Accordion.Item eventKey="0">
          <Accordion.Header>Catégories</Accordion.Header>
          <Accordion.Body>
            <div className="d-flex flex-column gap-2">
              {categories?.map(cat => (
                <Form.Check
                  key={cat._id}
                  type="checkbox"
                  id={`cat-${cat._id}`}
                  label={`${cat.name} (${cat.count || 0})`}
                  checked={filters.categories.includes(cat._id)}
                  onChange={() => onFilterChange('categories', cat._id)}
                  className="filter-checkbox"
                />
              ))}
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* Subcategorías (dinámicas según categoría seleccionada) */}
        {subCategories?.length > 0 && (
          <Accordion.Item eventKey="1">
            <Accordion.Header>Sous-catégories</Accordion.Header>
            <Accordion.Body>
              <div className="d-flex flex-column gap-2">
                {subCategories.map(sub => (
                  <Form.Check
                    key={sub._id}
                    type="checkbox"
                    id={`sub-${sub._id}`}
                    label={`${sub.name} (${sub.count || 0})`}
                    checked={filters.subCategories.includes(sub._id)}
                    onChange={() => onFilterChange('subCategories', sub._id)}
                    disabled={filters.categories.length === 0}
                    className="filter-checkbox"
                  />
                ))}
              </div>
            </Accordion.Body>
          </Accordion.Item>
        )}

        {/* Tipo de artículo */}
        <Accordion.Item eventKey="2">
          <Accordion.Header>Type d'article</Accordion.Header>
          <Accordion.Body>
            <div className="d-flex flex-column gap-2">
              {articleTypes?.map(type => (
                <Form.Check
                  key={type.value}
                  type="radio"
                  name="articleType"
                  id={`type-${type.value}`}
                  label={type.label}
                  checked={filters.articleType === type.value}
                  onChange={() => onFilterChange('articleType', type.value)}
                  className="filter-radio"
                />
              ))}
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* Precio */}
        <Accordion.Item eventKey="3">
          <Accordion.Header>Prix</Accordion.Header>
          <Accordion.Body>
            <div className="d-flex gap-2">
              <Form.Control
                type="number"
                placeholder="Min (DA)"
                value={filters.price.min}
                onChange={(e) => onFilterChange('price', { ...filters.price, min: e.target.value })}
              />
              <Form.Control
                type="number"
                placeholder="Max (DA)"
                value={filters.price.max}
                onChange={(e) => onFilterChange('price', { ...filters.price, max: e.target.value })}
              />
            </div>
          </Accordion.Body>
        </Accordion.Item>

        {/* Estado */}
        <Accordion.Item eventKey="4">
          <Accordion.Header>État</Accordion.Header>
          <Accordion.Body>
            <div className="d-flex flex-column gap-2">
              {['neuf', 'comme-neuf', 'bon-etat', 'correct'].map(etat => (
                <Form.Check
                  key={etat}
                  type="checkbox"
                  id={`etat-${etat}`}
                  label={etat === 'comme-neuf' ? 'Comme neuf' : 
                         etat === 'bon-etat' ? 'Bon état' : 
                         etat === 'correct' ? 'Correct' : 'Neuf'}
                  checked={filters.etat.includes(etat)}
                  onChange={() => onFilterChange('etat', etat)}
                  className="filter-checkbox"
                />
              ))}
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>

      {/* Botones de acción */}
      <div className="mt-4 d-flex gap-2">
        <Button 
          variant="outline-secondary" 
          onClick={onClearFilters}
          className="flex-grow-1"
        >
          <FaTimes className="me-2" />
          Effacer tous
        </Button>
        <Button 
          variant="primary" 
          onClick={onHide}
          className="flex-grow-1"
          style={{ backgroundColor: boutiqueTheme, borderColor: boutiqueTheme }}
        >
          <FaSearch className="me-2" />
          Voir {activeFiltersCount} résultat{activeFiltersCount > 1 ? 's' : ''}
        </Button>
      </div>
    </div>
  );

  // Para desktop: usar Drawer (sidebar)
  if (isDesktop) {
    return (
      <div className={`filter-drawer-desktop ${show ? 'open' : ''}`}>
        <div className="filter-drawer-header d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5 className="mb-0">
            <FaFilter className="me-2" />
            Filtres
            {activeFiltersCount > 0 && (
              <Badge bg="primary" className="ms-2">{activeFiltersCount}</Badge>
            )}
          </h5>
          <Button variant="link" onClick={onHide} className="text-dark">
            <FaTimes />
          </Button>
        </div>
        <div className="filter-drawer-body p-3">
          <FilterContent />
        </div>
      </div>
    );
  }

  // Para móvil y tablet: usar Offcanvas
  return (
    <Offcanvas 
      show={show} 
      onHide={onHide}
      placement="left"
      className="filter-drawer-mobile"
      style={{ width: isMobile ? '85%' : '400px' }}
    >
      <Offcanvas.Header closeButton className="border-bottom">
        <Offcanvas.Title>
          <FaFilter className="me-2" />
          Filtres
          {activeFiltersCount > 0 && (
            <Badge bg="primary" className="ms-2">{activeFiltersCount}</Badge>
          )}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body className="p-3">
        <FilterContent />
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default FilterDrawer;