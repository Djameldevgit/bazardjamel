// 📁 src/components/CATEGORIES/specificFields/VehiculesFields.js
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

// Importar campos comunes que necesites
import MarqueField from '../camposComun/MarqueField';
import ModeleField from '../camposComun/ModeleField';
import CouleurField from '../camposComun/CouleurField';

const VehiculesFields = ({ 
  fieldName,
  mainCategory,
  subCategory, 
  postData, 
  handleChangeInput,
  isRTL,
  t
}) => {
  
  // 🔥 DEFINIR TODOS LOS CAMPOS MANUALMENTE
  const fields = {
    'marque': (
      <MarqueField
        key="marque"
        mainCategory="vehicules"
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
        mainCategory="vehicules"
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
        <Form.Label>📅 {t?.('year') || 'Année'}</Form.Label>
        <Form.Select
          name="annee"
          value={postData.annee || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">Sélectionnez l'année</option>
          {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </Form.Select>
      </Form.Group>
    ),
    
    'kilometrage': (
      <Form.Group key="kilometrage" className="mb-3">
        <Form.Label>🛣️ {t?.('mileage') || 'Kilométrage'}</Form.Label>
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
        <Form.Label>⛽ {t?.('fuel') || 'Carburant'}</Form.Label>
        <Form.Select
          name="carburant"
          value={postData.carburant || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">Sélectionnez</option>
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
        <Form.Label>⚙️ {t?.('gearbox') || 'Boîte de vitesse'}</Form.Label>
        <Form.Select
          name="boiteVitesse"
          value={postData.boiteVitesse || ''}
          onChange={handleChangeInput}
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">Sélectionnez</option>
          <option value="manuelle">Manuelle</option>
          <option value="automatique">Automatique</option>
          <option value="semi-auto">Semi-automatique</option>
        </Form.Select>
      </Form.Group>
    ),
    
    'couleur': (
      <CouleurField
        key="couleur"
        fieldName="couleur"
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'puissance': (
      <Form.Group key="puissance" className="mb-3">
        <Form.Label>🐎 {t?.('power') || 'Puissance'} (CV)</Form.Label>
        <Form.Control
          type="number"
          name="puissance"
          value={postData.puissance || ''}
          onChange={handleChangeInput}
          placeholder="Ex: 90"
          min="0"
        />
      </Form.Group>
    )
  };
  
  // 🔥 CAMPOS POR SUBCATEGORÍA
  const getSubCategoryFields = () => {
    const config = {
      'automobiles': ['marque', 'modele', 'annee', 'kilometrage', 'carburant', 'boiteVitesse', 'puissance', 'couleur'],
      'motos': ['marque', 'modele', 'annee', 'kilometrage', 'typeMoto', 'puissance', 'couleur'],
      'camions': ['marque', 'modele', 'annee', 'kilometrage', 'typeCamion', 'capacite', 'couleur'],
      // Agrega más subcategorías
    };
    
    return config[subCategory] || [];
  };
  
  // Si se pide un campo específico
  if (fieldName) {
    const fieldComponent = fields[fieldName];
    
    if (!fieldComponent) {
      console.warn(`⚠️ Campo "${fieldName}" no configurado en VehiculesFields.js`);
      return (
        <div className="alert alert-warning">
          Champ "{fieldName}" non disponible. Ajoutez-le dans VehiculesFields.js
        </div>
      );
    }
    
    return fieldComponent;
  }
  
  // Si no se especifica fieldName, mostrar todos los campos de la subcategoría
  const fieldsToShow = getSubCategoryFields();
  
  return (
    <>
      {fieldsToShow.map((fieldKey, index) => (
        <div key={index}>
          {fields[fieldKey] || (
            <div className="alert alert-warning">
              ⚠️ Champ "{fieldKey}" non configuré
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default VehiculesFields;