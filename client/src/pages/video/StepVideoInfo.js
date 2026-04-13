// components/Video/StepVideoInfo.jsx - Versión ultra segura
import React, { useState } from 'react';
import { Form, Row, Col, Badge } from 'react-bootstrap';

const StepVideoInfo = ({ wizardData, updateData }) => {
  const [tagInput, setTagInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(wizardData.categorySlug || '');
  
  // Categorías
  const videoCategories = [
    { name: 'Véhicules', slug: 'videos-vehicules', icon: '🚗' },
    { name: 'Immobilier', slug: 'videos-immobilier', icon: '🏠' },
    { name: 'Téléphones', slug: 'videos-telephones', icon: '📱' },
    { name: 'Informatique', slug: 'videos-informatique', icon: '💻' },
    { name: 'Électroménager', slug: 'videos-electromenager', icon: '🔌' },
    { name: 'Mode & Vêtements', slug: 'videos-mode-vetements', icon: '👕' },
    { name: 'Maison & Jardin', slug: 'videos-maison-jardin', icon: '🏡' },
    { name: 'Sport & Loisirs', slug: 'videos-sport-loisirs', icon: '⚽' },
    { name: 'Alimentaires', slug: 'videos-alimentaires', icon: '🍔' },
    { name: 'Meubles', slug: 'videos-meubles', icon: '🛋️' },
    { name: 'Pièces Détachées', slug: 'videos-pieces-detachees', icon: '🔧' },
    { name: 'Santé & Beauté', slug: 'videos-sante-beaute', icon: '💄' }
  ];
  
  // Función para seleccionar categoría
  const selectCategory = (slug) => {
    setSelectedCategory(slug);
    updateData({ categorySlug: slug });
  };
  
  // Función para agregar tag
  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const currentTags = wizardData.tags || [];
      if (!currentTags.includes(tagInput.trim())) {
        updateData({ tags: [...currentTags, tagInput.trim()] });
      }
      setTagInput('');
    }
  };
  
  // Función para eliminar tag
  const removeTag = (tagToRemove) => {
    const currentTags = wizardData.tags || [];
    updateData({ tags: currentTags.filter(tag => tag !== tagToRemove) });
  };
  
  return (
    <div style={{ padding: '20px' }}>
      <h5 style={{ marginBottom: '20px' }}>Informations de la vidéo</h5>
      
      {/* Título */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Titre *
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="Titre accrocheur pour votre vidéo"
          value={wizardData.title || ''}
          onChange={(e) => updateData({ title: e.target.value })}
          maxLength={100}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
        />
        <small className="text-muted">{(wizardData.title || '').length}/100 caractères</small>
      </div>
      
      {/* Description */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Description
        </label>
        <textarea
          className="form-control"
          rows="4"
          placeholder="Décrivez votre vidéo (optionnel)"
          value={wizardData.description || ''}
          onChange={(e) => updateData({ description: e.target.value })}
          maxLength={2000}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
        />
        <small className="text-muted">{(wizardData.description || '').length}/2000 caractères</small>
      </div>
      
      {/* Catégorie */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Catégorie *
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '10px' }}>
          {videoCategories.map(cat => (
            <div
              key={cat.slug}
              onClick={() => selectCategory(cat.slug)}
              style={{
                padding: '12px',
                border: selectedCategory === cat.slug ? '2px solid #ff4040' : '1px solid #ddd',
                borderRadius: '8px',
                textAlign: 'center',
                cursor: 'pointer',
                background: selectedCategory === cat.slug ? 'rgba(255, 64, 64, 0.05)' : 'white',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '24px' }}>{cat.icon}</div>
              <div style={{ fontSize: '12px', marginTop: '4px' }}>{cat.name}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Tags */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
          Tags
        </label>
        <input
          type="text"
          className="form-control"
          placeholder="Appuyez sur Entrée pour ajouter un tag"
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={addTag}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
        />
        
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '10px' }}>
          {(wizardData.tags || []).map((tag, index) => (
            <span
              key={index}
              onClick={() => removeTag(tag)}
              style={{
                background: '#6c757d',
                color: 'white',
                padding: '5px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px'
              }}
            >
              #{tag} ✕
            </span>
          ))}
        </div>
        <small className="text-muted">Ajoutez des tags pour mieux référencer votre vidéo</small>
      </div>
    </div>
  );
};

export default StepVideoInfo;