// 📁 client/src/components/CreateAnnonce/DynamicFields.js
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

// COMPONENTES COMPARTIDOS (si los tienes)
import MarqueField from '../camposComun/MarqueField';
import ModeleField from '../camposComun/ModeleField';

const DynamicFields = ({ 
  mainCategory, 
  subCategory, 
  fieldName, 
  postData, 
  handleChangeInput, 
  isRTL 
}) => {
  const { t } = useTranslation();

  // 🔥 CONFIGURACIÓN ÚNICA PARA TODAS LAS CATEGORÍAS
  const ALL_FIELD_COMPONENTS = {
    // ============ CAMPOS COMPARTIDOS (todas las categorías) ============
    'title': (
      <Form.Group key="title">
        <Form.Label>📝 {t('title', 'Titre')}</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={postData.title || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_title', 'Ex: iPhone 13 Pro Max 256GB')}
          maxLength={100}
          required
        />
      </Form.Group>
    ),

    'description': (
      <Form.Group key="description">
        <Form.Label>📄 {t('description', 'Description')}</Form.Label>
        <Form.Textarea
          name="description"
          value={postData.description || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_description', 'Décrivez votre produit/service...')}
          rows={4}
          maxLength={2000}
          required
        />
      </Form.Group>
    ),

    'price': (
      <Form.Group key="price">
        <Form.Label>💰 {t('price', 'Prix')} (DZD)</Form.Label>
        <Form.Control
          type="number"
          name="price"
          value={postData.price || ''}
          onChange={handleChangeInput}
          placeholder="Ex: 150000"
          min="0"
          step="100"
          required
        />
      </Form.Group>
    ),

    'telephone': (
      <Form.Group key="telephone">
        <Form.Label>📱 {t('phone', 'Téléphone')}</Form.Label>
        <Form.Control
          type="tel"
          name="telephone"
          value={postData.telephone || ''}
          onChange={handleChangeInput}
          placeholder="Ex: 0550123456"
          pattern="[0-9]{10}"
          required
        />
      </Form.Group>
    ),

    'wilaya': (
      <Form.Group key="wilaya">
        <Form.Label>📍 {t('wilaya', 'Wilaya')}</Form.Label>
        <Form.Select
          name="wilaya"
          value={postData.wilaya || ''}
          onChange={handleChangeInput}
          required
        >
          <option value="">{t('select_wilaya', 'Sélectionnez une wilaya')}</option>
          {/* Opciones de wilayas */}
        </Form.Select>
      </Form.Group>
    ),

    'commune': (
      <Form.Group key="commune">
        <Form.Label>📍 {t('commune', 'Commune')}</Form.Label>
        <Form.Control
          type="text"
          name="commune"
          value={postData.commune || ''}
          onChange={handleChangeInput}
          placeholder={t('enter_commune', 'Ex: Sidi M\'Hamed')}
          required
        />
      </Form.Group>
    ),

    // ============ CAMPOS ESPECÍFICOS POR CATEGORÍA ============
    
    // 🔧 VEHICULES
    'marque': (
      <MarqueField
        selectedCategory={mainCategory === 'vehicules' ? 'automobiles' : mainCategory}
        selectedSubCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        name="marque"
        label="brand"
      />
    ),

    'modele': (
      <ModeleField
        selectedCategory={mainCategory === 'vehicules' ? 'automobiles' : mainCategory}
        selectedSubCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        name="modele"
        label="model"
      />
    ),

    'annee': (
      <Form.Group key="annee">
        <Form.Label>📅 {t('year', 'Année')}</Form.Label>
        <Form.Select
          name="annee"
          value={postData.annee || ''}
          onChange={handleChangeInput}
        >
          <option value="">{t('select_year', 'Sélectionnez')}</option>
          {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Form.Select>
      </Form.Group>
    ),

    'kilometrage': (
      <Form.Group key="kilometrage">
        <Form.Label>🛣️ {t('mileage', 'Kilométrage')}</Form.Label>
        <Row>
          <Col>
            <Form.Control
              type="number"
              name="kilometrage"
              value={postData.kilometrage || ''}
              onChange={handleChangeInput}
              placeholder="Ex: 75000"
              min="0"
            />
          </Col>
          <Col>
            <Form.Select
              name="kilometrageUnite"
              value={postData.kilometrageUnite || 'km'}
              onChange={handleChangeInput}
            >
              <option value="km">km</option>
              <option value="miles">Miles</option>
            </Form.Select>
          </Col>
        </Row>
      </Form.Group>
    ),

    // 🏠 IMMOBILIER
    'superficie': (
      <Form.Group key="superficie">
        <Form.Label>📐 {t('area', 'Superficie')} (m²)</Form.Label>
        <Form.Control
          type="number"
          name="superficie"
          value={postData.superficie || ''}
          onChange={handleChangeInput}
          placeholder="Ex: 120"
          min="1"
          step="0.5"
        />
      </Form.Group>
    ),

    'nombrePieces': (
      <Form.Group key="nombrePieces">
        <Form.Label>🚪 {t('rooms', 'Nombre de pièces')}</Form.Label>
        <Form.Control
          type="number"
          name="nombrePieces"
          value={postData.nombrePieces || ''}
          onChange={handleChangeInput}
          placeholder="Ex: 3"
          min="1"
        />
      </Form.Group>
    ),

    'etage': (
      <Form.Group key="etage">
        <Form.Label>🏢 {t('floor', 'Étage')}</Form.Label>
        <Form.Control
          type="number"
          name="etage"
          value={postData.etage || ''}
          onChange={handleChangeInput}
          placeholder="Ex: 2 (0 pour RDC)"
          min="0"
        />
      </Form.Group>
    ),

    // 👗 VETEMENTS
    'taille': (
      <Form.Group key="taille">
        <Form.Label>👕 {t('size', 'Taille')}</Form.Label>
        <Form.Select
          name="taille"
          value={postData.taille || ''}
          onChange={handleChangeInput}
        >
          <option value="">{t('select_size', 'Sélectionnez')}</option>
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
          <option value="autre">Autre</option>
        </Form.Select>
      </Form.Group>
    ),

    'pointure': (
      <Form.Group key="pointure">
        <Form.Label>👟 {t('shoe_size', 'Pointure')}</Form.Label>
        <Form.Control
          type="number"
          name="pointure"
          value={postData.pointure || ''}
          onChange={handleChangeInput}
          placeholder="Ex: 42"
          min="20"
          max="50"
          step="0.5"
        />
      </Form.Group>
    ),

    // 📱 TELEPHONES
    'capaciteStockage': (
      <Form.Group key="capaciteStockage">
        <Form.Label>💾 {t('storage', 'Stockage')} (GB)</Form.Label>
        <Form.Select
          name="capaciteStockage"
          value={postData.capaciteStockage || ''}
          onChange={handleChangeInput}
        >
          <option value="">{t('select_storage', 'Sélectionnez')}</option>
          <option value="32">32 GB</option>
          <option value="64">64 GB</option>
          <option value="128">128 GB</option>
          <option value="256">256 GB</option>
          <option value="512">512 GB</option>
          <option value="1024">1 TB</option>
        </Form.Select>
      </Form.Group>
    ),

    'ram': (
      <Form.Group key="ram">
        <Form.Label>⚡ {t('ram', 'RAM')} (GB)</Form.Label>
        <Form.Select
          name="ram"
          value={postData.ram || ''}
          onChange={handleChangeInput}
        >
          <option value="">{t('select_ram', 'Sélectionnez')}</option>
          <option value="2">2 GB</option>
          <option value="4">4 GB</option>
          <option value="6">6 GB</option>
          <option value="8">8 GB</option>
          <option value="12">12 GB</option>
          <option value="16">16 GB</option>
        </Form.Select>
      </Form.Group>
    ),

    // Continúa con los otros 200+ campos aquí...
    // Pero organizados en UN SOLO archivo

    // ============ CAMPOS POR DEFECTO (si no se encuentra) ============
    'default': (
      <Form.Group key="default">
        <Form.Label>{fieldName}</Form.Label>
        <Form.Control
          type="text"
          name={fieldName}
          value={postData[fieldName] || ''}
          onChange={handleChangeInput}
          placeholder={`Entrez ${fieldName}`}
        />
      </Form.Group>
    )
  };

  // 🔥 FUNCIÓN INTELIGENTE: Determina qué componente mostrar
  const getFieldComponent = () => {
    // 1. Buscar el campo específico
    if (ALL_FIELD_COMPONENTS[fieldName]) {
      return ALL_FIELD_COMPONENTS[fieldName];
    }

    // 2. Si no existe, crear dinámicamente basado en el tipo
    const fieldValue = postData[fieldName] || '';
    
    // Detectar tipo de campo por nombre
    if (fieldName.includes('date') || fieldName.includes('Date')) {
      return (
        <Form.Group key={fieldName}>
          <Form.Label>📅 {fieldName}</Form.Label>
          <Form.Control
            type="date"
            name={fieldName}
            value={fieldValue}
            onChange={handleChangeInput}
          />
        </Form.Group>
      );
    }
    
    if (fieldName.includes('quantite') || fieldName.includes('nombre') || 
        fieldName.includes('capacite') || fieldName.includes('qte')) {
      return (
        <Form.Group key={fieldName}>
          <Form.Label>🔢 {fieldName}</Form.Label>
          <Form.Control
            type="number"
            name={fieldName}
            value={fieldValue}
            onChange={handleChangeInput}
            min="0"
          />
        </Form.Group>
      );
    }
    
    if (fieldName.includes('prix') || fieldName.includes('cout') || 
        fieldName.includes('loyer') || fieldName.includes('tarif')) {
      return (
        <Form.Group key={fieldName}>
          <Form.Label>💰 {fieldName} (DZD)</Form.Label>
          <Form.Control
            type="number"
            name={fieldName}
            value={fieldValue}
            onChange={handleChangeInput}
            min="0"
            step="100"
          />
        </Form.Group>
      );
    }

    // 3. Si todo falla, usar el campo por defecto
    return ALL_FIELD_COMPONENTS['default'];
  };

  // Renderizar el campo
  return getFieldComponent();
};

export default DynamicFields;