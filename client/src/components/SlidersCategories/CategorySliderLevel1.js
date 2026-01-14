// components/category/CategorySliderLevel1.js
import React from 'react';
import { Link } from 'react-router-dom';

const CategorySliderLevel1 = ({ categorySlug, subcategories }) => {
  // Función para construir URL según estructura Ouedkniss
  const buildUrl = (subcategory) => {
    // Ejemplo: /pieces_detachees-pieces_automobiles/1
    return `/${categorySlug}-${subcategory.id}/1`;
  };
  
  return (
    <div className="category-slider-level1 mb-4">
      <h3 className="mb-3">Toutes les catégories</h3>
      <div className="d-flex flex-wrap gap-3">
        {subcategories.map((subcategory) => (
          <Link
            key={subcategory.id}
            to={buildUrl(subcategory)}
            className="category-card-level1"
            style={{
              textDecoration: 'none',
              color: 'inherit',
              flex: '0 0 auto',
              width: '120px',
              textAlign: 'center'
            }}
          >
            <div className="icon-container">
              <span style={{ fontSize: '2.5rem' }}>{subcategory.emoji}</span>
            </div>
            <div className="category-name mt-2">
              <small style={{ fontSize: '0.8rem', fontWeight: '500' }}>
                {subcategory.name}
              </small>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategorySliderLevel1;