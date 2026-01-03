// src/pages/DynamicPage.js - VERSIÓN CORREGIDA
import React from 'react';
import { useParams, useHistory } from 'react-router-dom';

// Importar componentes
import CategoryPage from './categorySubCategory/CategoryPage';
import SubcategoryPage from './categorySubCategory/SubcategoryPage';
import ImmobilerHierarchyPage from './categorySubCategory/ImmobilerHierarchyPage'; // ✅ AHORA EXISTE
import PostId from './PostId';
import StoreList from './store/StoreList';
 

const DynamicPage = () => {
  const { slug, page = "1" } = useParams();
  const history = useHistory();
  
  // 🛑 Validación básica
  if (!slug) {
    history.push('/');
    return null;
  }
  
  // 🎯 DETECTAR TIPO DE RUTA
  
  // 1. LISTADO DE TIENDAS
  if (slug === 'boutiques') {
    return <StoreList page={parseInt(page)} />;
  }
  
  // 2. TIENDA INDIVIDUAL
  if (slug.startsWith('boutique-')) {
    const boutiqueSlug = slug.replace('boutique-', '');
    
    // Si tu StoreDetail acepta slug, úsalo
    // Si no, puedes crear un componente intermedio
    return (
      <div className="container py-5 text-center">
        <h3>Fonctionnalité boutique en développement</h3>
        <p>Slug de la boutique: {boutiqueSlug}</p>
        <button 
          onClick={() => history.push('/boutiques/1')}
          className="btn btn-primary"
        >
          Voir toutes les boutiques
        </button>
      </div>
    );
  }
  
  // 3. ANUNCIO INDIVIDUAL
  if (slug.startsWith('annonce-')) {
    const annonceId = slug.replace('annonce-', '').split('-')[0];
    return <PostId id={annonceId} />;
  }
  
  // 4. INMUEBLES (caso especial)
  if (slug === 'immobilier' || slug.startsWith('immobilier-')) {
    return <ImmobilerHierarchyPage />;
  }
  
  // 5. CATEGORÍAS NORMALES
  const parts = slug.split('-');
  
  if (parts.length === 1) {
    // 📂 CATEGORÍA PRINCIPAL
    return <CategoryPage categoryName={parts[0]} page={page} />;
  } else {
    // 📂 SUBCATEGORÍA
    return (
      <SubcategoryPage 
        categoryName={parts[0]} 
        subcategoryId={parts.slice(1).join('-')} 
        page={page}
      />
    );
  }
};

export default DynamicPage;