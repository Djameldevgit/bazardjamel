// 📁 VehiculesFields.js - VERSIÓN CON marque y modele COMO ESPECÍFICOS
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import MarqueField from '../camposComun/MarqueField';
import ModeleField from '../camposComun/ModeleField';

const VehiculesFields = ({ 
  fieldName,
  mainCategory,
  subCategory, 
  postData, 
  handleChangeInput,
  isRTL
}) => {
  const { t } = useTranslation();
  
  // 🔥 CAMPOS ESPECÍFICOS DE VEHÍCULOS (incluye marque y modele como específicos)
  const fields = {
    // ============ CAMPOS ESPECÍFICOS DE VEHÍCULOS ============
    'marque': (
      <MarqueField
        key="marque"
        mainCategory={mainCategory}
        subCategory={subCategory}
        fieldName="marque"
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'modele': (
      <ModeleField
        key="modele"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="modele"
        brandField="marque"
        isRTL={isRTL}
        t={t}
      />
    ),
  
    'annee': (
      <Form.Group key="annee" className="mb-3">
        <Form.Label>📅 {t('year', 'Année')}</Form.Label>
        <Form.Select
          name="annee"
          value={postData.annee || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_year', 'Sélectionnez l\'année')}</option>
          {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Form.Select>
      </Form.Group>
    ),
    
    'kilometrage': (
      <Form.Group key="kilometrage" className="mb-3">
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
    
    'carburant': (
      <Form.Group key="carburant" className="mb-3">
        <Form.Label>⛽ {t('fuel', 'Carburant')}</Form.Label>
        <Form.Select
          name="carburant"
          value={postData.carburant || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_fuel', 'Sélectionnez')}</option>
          <option value="essence">Essence</option>
          <option value="diesel">Diesel</option>
          <option value="electrique">Électrique</option>
          <option value="hybride">Hybride</option>
          <option value="gpl">GPL</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'boiteVitesse': (
      <Form.Group key="boiteVitesse" className="mb-3">
        <Form.Label>⚙️ {t('gearbox', 'Boîte de vitesse')}</Form.Label>
        <Form.Select
          name="boiteVitesse"
          value={postData.boiteVitesse || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_gearbox', 'Sélectionnez')}</option>
          <option value="manuelle">Manuelle</option>
          <option value="automatique">Automatique</option>
          <option value="semi-auto">Semi-automatique</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'puissance': (
      <Form.Group key="puissance" className="mb-3">
        <Form.Label>🐎 {t('power', 'Puissance')} (CV)</Form.Label>
        <Form.Control
          type="number"
          name="puissance"
          value={postData.puissance || ''}
          onChange={handleChangeInput}
          placeholder="Ex: 90"
          min="0"
        />
      </Form.Group>
    ),
    
    
    
  };
  
  // 🔥 FUNCIÓN PARA OBTENER CAMPOS POR SUBCATEGORÍA
  const getSubCategorySpecificFields = () => {
    const specificFields = {
      'automobiles': ['marque', 'modele', 'annee', 'kilometrage', 'carburant', 'boiteVitesse', 'puissance'],
      
    };
    
    return specificFields[subCategory] || [];
  };
  
  // Si se pide un campo específico
  if (fieldName) {
    const fieldComponent = fields[fieldName];
    
    if (!fieldComponent) {
      console.warn(`⚠️ Campo "${fieldName}" no encontrado en VehiculesFields`);
      return null; // Devolver null para que lo maneje el sistema común
    }
    
    return fieldComponent;
  }
  
  // Si no hay fieldName, mostrar todos los campos de la subcategoría
  const fieldsToShow = getSubCategorySpecificFields();
  
  if (fieldsToShow.length === 0) {
    return (
      <div className="alert alert-info">
        ℹ️ {t('select_subcategory', 'Sélectionnez une sous-catégorie')}
      </div>
    );
  }
  
  return (
    <>
      {fieldsToShow.map((fieldKey, index) => (
        <div key={`${fieldKey}-${index}`} className="mb-3">
          {fields[fieldKey] || (
            <div className="alert alert-warning">
              ⚠️ {t('field_not_found', 'Champ non trouvé')}: {fieldKey}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default VehiculesFields;