// 📁 src/components/CATEGORIES/FieldRenderer.js
import React from 'react';
import { Form } from 'react-bootstrap';

// 🔥 IMPORTAR CORRECTAMENTE TODOS LOS COMPONENTES
// Verifica que los nombres de archivo coincidan
import ImmobilierFields from './specificFields/ImmobiliersFields';
import VehiculesFields from './specificFields/VehiculesFields';
import VetementsFields from './specificFields/VetementsFields';
import TelephonesFields from './specificFields/TelephonesFields';
import InformatiqueFields from './specificFields/InformatiqueFields';
import MateriauxFields from './specificFields/MateriauxFields';
import ElectromenagerFields from './specificFields/ElectromenagerFields';
import PiecesDetacheesFields from './specificFields/PiecesDetacheesFields';
import SanteBeauteFields from './specificFields/SanteBeauteFields';
import MeublesFields from './specificFields/MeublesFields';
import LoisirsFields from './specificFields/LoisirsFields';
import SportFields from './specificFields/SportFields';
import AlimentairesFields from './specificFields/AlimentairesFields';
import ServicesFields from './specificFields/ServicesFields';
import VoyagesFields from './specificFields/VoyagesFields';
import EmploiFields from './specificFields/EmploiFields';

// 🔥 MAPA DE CATEGORÍA → COMPONENTE
const CATEGORY_COMPONENTS = {
  'immobilier': ImmobilierFields,
  'vehicules': VehiculesFields,
  'vetements': VetementsFields,
  'telephones': TelephonesFields,
  'informatique': InformatiqueFields,
  'electromenager': ElectromenagerFields,
  'pieces_detachees': PiecesDetacheesFields,
  'santebeaute': SanteBeauteFields,
  'meubles': MeublesFields,
  'loisirs': LoisirsFields,
  'sport': SportFields,
  'alimentaires': AlimentairesFields,
  'services': ServicesFields,
  'materiaux': MateriauxFields,
  'voyages': VoyagesFields,
  'emploi': EmploiFields
};

// 🔥 CAMPOS COMPARTIDOS - USANDO REACT-BOOTSTRAP
const SHARED_FIELDS = {
  'title': {
    render: ({ postData, handleChangeInput, isRTL, t }) => (
      <Form.Group className="mb-3">
        <Form.Label>📝 {t?.('title') || 'Titre'}</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={postData.title || ''}
          onChange={handleChangeInput}
          placeholder="Ex: iPhone 13 Pro Max"
          required
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    )
  },
  'description': {
    render: ({ postData, handleChangeInput, isRTL, t }) => (
      <Form.Group className="mb-3">
        <Form.Label>📄 {t?.('description') || 'Description'}</Form.Label>
        <Form.Control
          as="textarea"
          name="description"
          value={postData.description || ''}
          onChange={handleChangeInput}
          rows={4}
          placeholder="Décrivez votre produit/service..."
          required
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    )
  },
  'price': {
    render: ({ postData, handleChangeInput, isRTL, t }) => (
      <Form.Group className="mb-3">
        <Form.Label>💰 {t?.('price') || 'Prix'} (DZD)</Form.Label>
        <Form.Control
          type="number"
          name="price"
          value={postData.price || ''}
          onChange={handleChangeInput}
          placeholder="Ex: 150000"
          min="0"
          step="100"
          required
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    )
  },
  'telephone': {
    render: ({ postData, handleChangeInput, isRTL, t }) => (
      <Form.Group className="mb-3">
        <Form.Label>📱 {t?.('phone') || 'Téléphone'}</Form.Label>
        <Form.Control
          type="tel"
          name="telephone"
          value={postData.telephone || ''}
          onChange={handleChangeInput}
          placeholder="0550123456"
          pattern="[0-9]{10}"
          required
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    )
  },
  'wilaya': {
    render: ({ postData, handleChangeInput, isRTL, t }) => (
      <Form.Group className="mb-3">
        <Form.Label>📍 {t?.('wilaya') || 'Wilaya'}</Form.Label>
        <Form.Select
          name="wilaya"
          value={postData.wilaya || ''}
          onChange={handleChangeInput}
          required
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          <option value="">{t?.('select_wilaya') || 'Sélectionnez une wilaya'}</option>
          <option value="alger">Alger</option>
          <option value="oran">Oran</option>
          <option value="constantine">Constantine</option>
          {/* Agrega más wilayas aquí */}
        </Form.Select>
      </Form.Group>
    )
  },
  'commune': {
    render: ({ postData, handleChangeInput, isRTL, t }) => (
      <Form.Group className="mb-3">
        <Form.Label>📍 {t?.('commune') || 'Commune'}</Form.Label>
        <Form.Control
          type="text"
          name="commune"
          value={postData.commune || ''}
          onChange={handleChangeInput}
          placeholder="Ex: Sidi M'Hamed"
          required
          dir={isRTL ? 'rtl' : 'ltr'}
        />
      </Form.Group>
    )
  }
};

// 🔥 COMPONENTE DE FALLBACK (si algo falla)
const FallbackComponent = ({ fieldName, postData, handleChangeInput, isRTL }) => (
  <Form.Group className="mb-3">
    <Form.Label>⚠️ {fieldName}</Form.Label>
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

// 🔥 COMPONENTE PRINCIPAL - CORREGIDO
const FieldRenderer = ({
  fieldName,
  mainCategory,     // ← UNICAMENTE UNA VEZ
  subCategory,
  articleType,
  postData,
  handleChangeInput,
  isRTL,
  t
}) => {
  console.log('🔍 FieldRenderer recibió:', {
    fieldName,
    mainCategory,
    subCategory,
    articleType,
    'postData keys': Object.keys(postData).slice(0, 5)
  });

  // 1. Si es campo compartido, usarlo directamente
  if (SHARED_FIELDS[fieldName]) {
    console.log(`✅ Campo compartido: ${fieldName}`);
    const { render } = SHARED_FIELDS[fieldName];
    return render({ postData, handleChangeInput, isRTL, t });
  }

  // 2. Obtener el componente específico de la categoría
  const CategoryComponent = CATEGORY_COMPONENTS[mainCategory];
  
  if (!CategoryComponent) {
    console.warn(`❌ No hay componente para la categoría: ${mainCategory}`);
    console.log('📋 Componentes disponibles:', Object.keys(CATEGORY_COMPONENTS));
    
    return (
      <FallbackComponent
        fieldName={fieldName}
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
      />
    );
  }

  console.log(`✅ Usando componente: ${mainCategory}`);

  // 3. Renderizar el campo específico
  try {
    return (
      <CategoryComponent
      fieldName={fieldName}
      mainCategory={mainCategory}      // ← Debe pasar 'vehicules'
      subCategory={subCategory}        // ← Debe pasar 'automobiles'
      articleType={articleType}
      postData={postData}
      handleChangeInput={handleChangeInput}
      isRTL={isRTL}
      t={t}
    />
    );
  } catch (error) {
    console.error(`❌ Error en FieldRenderer para ${fieldName}:`, error);
    
    return (
      <div className="alert alert-danger">
        <strong>Erreur:</strong> Impossible de charger le champ "{fieldName}"
        <br />
        <small>{error.message}</small>
      </div>
    );
  }
};

// 🔥 DEBUG: Verificar que los componentes se carguen correctamente
console.log('📦 FieldRenderer - Importaciones verificadas:');
Object.entries(CATEGORY_COMPONENTS).forEach(([category, Component]) => {
  if (!Component) {
    console.error(`❌ FALTA: ${category}`);
  }
});

export default FieldRenderer;