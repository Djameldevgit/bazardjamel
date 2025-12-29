// 📁 client/src/components/CATEGORIES/camposComun/MarqueField.js
import React, { useState, useEffect, useMemo } from 'react';
import { Form, Alert, Badge, Spinner, InputGroup, Button } from 'react-bootstrap';
import { Search, Filter, Plus } from 'react-bootstrap-icons';

// ✅ CORRECTO: ../../../data/brandsData
import { getBrandsByCategory, searchBrands } from '../../../data/brandsData';

const MarqueField = ({ 
  mainCategory,
  subCategory,
  fieldName = 'marque',
  postData, 
  handleChangeInput,
  isRTL,
  t,
  showAdvanced = true
}) => {
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);

  // DEBUG: Verificar que las funciones se importan
  console.log('🔧 MarqueField - Funciones importadas:', {
    getBrandsByCategory: typeof getBrandsByCategory,
    searchBrands: typeof searchBrands
  });

  // 🔄 Memoizar datos
  const categoryBrands = useMemo(() => {
    console.log('🔄 Calculando marcas para:', { mainCategory, subCategory });
    return getBrandsByCategory(mainCategory, subCategory);
  }, [mainCategory, subCategory]);

  // 🔄 Efecto principal
  useEffect(() => {
    console.log('🎯 MarqueField useEffect ejecutándose');
    
    if (!mainCategory) {
      console.warn('⚠️ No hay mainCategory');
      setFilteredBrands([]);
      return;
    }

    setIsLoading(true);
    
    const timer = setTimeout(() => {
      try {
        let brands = [];

        if (searchQuery.trim()) {
          console.log('🔍 Buscando marcas con query:', searchQuery);
          brands = searchBrands(searchQuery, mainCategory);
        } else {
          console.log('📋 Usando marcas de categoría:', categoryBrands.length);
          brands = categoryBrands;
        }

        // Limitar si no muestra todo
        if (!showAllBrands && brands.length > 15) {
          brands = brands.slice(0, 15);
        }

        console.log('✅ Marcas filtradas:', brands.length);
        setFilteredBrands(brands);
      } catch (error) {
        console.error('❌ Error en MarqueField:', error);
        setFilteredBrands([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [mainCategory, subCategory, searchQuery, categoryBrands, showAllBrands]);

  // Si no hay categoría
  if (!mainCategory) {
    return (
      <Alert variant="info" className="my-3">
        <strong>ℹ️ Sélectionnez une catégorie d'abord</strong>
      </Alert>
    );
  }

  return (
    <Form>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Label className="fw-bold mb-0">
          🏷️ {t?.('brand', 'Marque')}
        </Form.Label>
      
      </div>

      {/* Select principal */}
      <Form.Select
        name={fieldName}
        value={postData[fieldName] || ''}
        onChange={handleChangeInput}
        required
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <option value="">Sélectionnez une marque</option>
        
        {filteredBrands.map((brand) => (
          <option key={brand} value={brand}>{brand}</option>
        ))}
        
        <option value="autre">Autre marque...</option>
      </Form.Select>

      {/* Información */}
      <div className="mt-2">
        <small className="text-muted">
          <i className="fas fa-tags me-1"></i>
          {filteredBrands.length} marques disponibles
        </small>
      </div>
    </Form>
  );
};

export default MarqueField;