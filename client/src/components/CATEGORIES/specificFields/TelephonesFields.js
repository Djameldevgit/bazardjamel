// 📁 TelephonesFields.js - VERSIÓN CORREGIDA
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import MarqueField from '../camposComun/MarqueField';
import ModeleField from '../camposComun/ModeleField';
import CouleurField from '../camposComun/CouleurField';

const TelephonesFields = ({ 
  fieldName,
  mainCategory,      // ← NUEVO: recibir mainCategory
  subCategory,
  articleType,
  postData,
  handleChangeInput,
  isRTL,
 
}) => {
  const { t } = useTranslation();
  
  console.log('🔍 TelephonesFields recibió:', {
    fieldName,
    mainCategory,
    subCategory,
    'postData keys': Object.keys(postData)
  });

  // 🔥 OBJETO DE CAMPOS - ¡SIMPLE Y DIRECTO!
  const fields = {
    'marque': (
      <MarqueField
        key="marque"
        mainCategory={mainCategory}      // ← Pasar mainCategory
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
        mainCategory={mainCategory}      // ← 'telephones'
        subCategory={subCategory}        // ← 'smartphones'
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="modele"
        brandField="marque"              // ← campo donde está la marca
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'couleur': (
      <CouleurField
        key="couleur"
        mainCategory={mainCategory}          // ← IMPORTANTE
        subCategory={subCategory}            // ← IMPORTANTE
        fieldName="couleur"
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'etat': (
      <Form.Group className="mb-3">
        <Form.Label>🔧 {t('condition', 'État')}</Form.Label>
        <Form.Select
          name="etat"
          value={postData.etat || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_condition', 'Sélectionnez')}</option>
          <option value="neuf">Neuf</option>
          <option value="tres_bon">Très bon état</option>
          <option value="bon">Bon état</option>
          <option value="usage">État d'usage</option>
          <option value="reparation">À réparer</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'capaciteStockage': (
      <Form.Group className="mb-3">
        <Form.Label>💾 {t('storage', 'Stockage')} (GB)</Form.Label>
        <Form.Select
          name="capaciteStockage"
          value={postData.capaciteStockage || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
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
    
    'systemeExploitation': (
      <Form.Group className="mb-3">
        <Form.Label>🖥️ {t('os', 'Système d\'exploitation')}</Form.Label>
        <Form.Select
          name="systemeExploitation"
          value={postData.systemeExploitation || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t('select_os', 'Sélectionnez')}</option>
          <option value="ios">iOS</option>
          <option value="android">Android</option>
          <option value="windows">Windows</option>
          <option value="autres">Autres</option>
        </Form.Select>
      </Form.Group>
    ),
    
    // ... continúa con todos los demás campos SIMPLIFICADOS
    
  };

  // 🔥 FUNCIÓN PARA OBTENER CAMPOS POR SUBCATEGORÍA
  const getFieldsForSubCategory = () => {
    const subCategoryFields = {
      'smartphones': ['marque', 'modele', 'etat', 'capaciteStockage', 'couleur', 'systemeExploitation'],
      'tablettes': ['marque', 'modele', 'etat', 'capaciteStockage', 'couleur'],
      'telephones_cellulaires': ['marque', 'modele', 'etat', 'couleur'],
      'smartwatchs': ['marque', 'modele', 'etat', 'couleur'],
      // ... añade más según necesites
    };
    
    return subCategoryFields[subCategory] || [];
  };

  // 🔥 SI SE PIDE UN CAMPO ESPECÍFICO
  if (fieldName) {
    const fieldComponent = fields[fieldName];
    
    if (!fieldComponent) {
      console.warn(`⚠️ Campo "${fieldName}" no encontrado en TelephonesFields`);
      return (
        <Form.Group className="mb-3">
          <Form.Label>{fieldName}</Form.Label>
          <Form.Control
            type="text"
            name={fieldName}
            value={postData[fieldName] || ''}
            onChange={handleChangeInput}
            placeholder={`Entrez ${fieldName}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
        </Form.Group>
      );
    }
    
    return fieldComponent;
  }

  // 🔥 SI NO HAY FIELDNAME (MUESTRA TODOS LOS CAMPOS DE LA SUBCATEGORÍA)
  if (!subCategory) {
    return (
      <div className="alert alert-info">
        ℹ️ {t('select_subcategory', 'Sélectionnez une sous-catégorie')}
      </div>
    );
  }

  const fieldsToShow = getFieldsForSubCategory();
  
  if (fieldsToShow.length === 0) {
    return (
      <div className="alert alert-warning">
        ⚠️ {t('no_fields_for_subcategory', 'Aucun champ pour cette sous-catégorie')}
      </div>
    );
  }

  return (
    <>
      {fieldsToShow.map((fieldKey, index) => (
        <div key={`${fieldKey}-${index}`} className="mb-3">
          {fields[fieldKey] || (
            <div className="alert alert-danger">
              ❌ {t('missing_field', 'Champ manquant')}: {fieldKey}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default TelephonesFields;