// components/CATEGORIES/specificFields/AlimentairesField.js
import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

// Importar campos comunes según tu solicitud
import TitleField from '../camposComun/TitleField';
import ReferenceField from '../camposComun/ReferenceField';
import DescriptionField from '../camposComun/DescriptionField';
import PriceField from '../camposComun/PriceField';
import EtatField from '../camposComun/EtatField';
import QuantiteField from '../camposComun/QuantiteField';
import Livraison from '../camposComun/LivraisonFileld'; // Componente importado

const AlimentairesField = ({ 
  fieldName,
  mainCategory,
  subCategory, 
  postData, 
  handleChangeInput,
  isRTL
 }) => {
  const { t } = useTranslation();
  
  const getSubCategorySpecificFields = () => {
    const specificFields = {
      'fruits_legumes': {
        'title': 'title',
        'reference': 'reference',
        'description': 'description',
        'price': 'price',
        'etat': 'etat',
        'quantite': 'quantite',
        'typeProduit': 'typeProduit',
        'origine': 'origine',
        'saison': 'saison'
      },
      'viandes_poissons': {
        'title': 'title',
        'reference': 'reference',
        'description': 'description',
        'price': 'price',
        'etat': 'etat',
        'quantite': 'quantite',
        'typeViande': 'typeViande',
        'decoupe': 'decoupe',
        'conservation': 'conservation'
      },
      'produits_laitiers': {
        'title': 'title',
        'reference': 'reference',
        'description': 'description',
        'price': 'price',
        'etat': 'etat',
        'quantite': 'quantite',
        'typeLaitier': 'typeLaitier',
        'matiereGrasse': 'matiereGrasse',
        'peremption': 'peremption'
      },
      'boissons': {
        'title': 'title',
        'reference': 'reference',
        'description': 'description',
        'price': 'price',
        'etat': 'etat',
        'quantite': 'quantite',
        'typeBoisson': 'typeBoisson',
        'contenance': 'contenance',
        'alcool': 'alcool'
      },
      'epicerie': {
        'title': 'title',
        'reference': 'reference',
        'description': 'description',
        'price': 'price',
        'etat': 'etat',
        'quantite': 'quantite',
        'categorieEpicerie': 'categorieEpicerie',
        'conditionnement': 'conditionnement',
        'poids': 'poids'
      },
      'boulangerie_patisserie': {
        'title': 'title',
        'reference': 'reference',
        'description': 'description',
        'price': 'price',
        'etat': 'etat',
        'quantite': 'quantite',
        'typeBoulangerie': 'typeBoulangerie',
        'fabrication': 'fabrication',
        'ingredients': 'ingredients'
      },
      'conserves': {
        'title': 'title',
        'reference': 'reference',
        'description': 'description',
        'price': 'price',
        'etat': 'etat',
        'quantite': 'quantite',
        'typeConserve': 'typeConserve',
        'dlc': 'dlc',
        'contenu': 'contenu'
      },
      'surgeles': {
        'title': 'title',
        'reference': 'reference',
        'description': 'description',
        'price': 'price',
        'etat': 'etat',
        'quantite': 'quantite',
        'typeSurgeles': 'typeSurgeles',
        'conservationTemperature': 'conservationTemperature',
        'origine': 'origine'
      },
      'bio': {
        'title': 'title',
        'reference': 'reference',
        'description': 'description',
        'price': 'price',
        'etat': 'etat',
        'quantite': 'quantite',
        'certificationBio': 'certificationBio',
        'origine': 'origine',
        'producteur': 'producteur'
      },
      'restauration': {
        'title': 'title',
        'reference': 'reference',
        'description': 'description',
        'price': 'price',
        'etat': 'etat',
        'quantite': 'quantite',
        'typePlat': 'typePlat',
        'personnes': 'personnes',
        'livraison': 'livraison'
      }
    };
    
    return specificFields[subCategory] || {};
  };
  
  const fields = {
    'title': (
      <TitleField
        key="title"
        mainCategory={mainCategory}
        subCategory={subCategory}
        fieldName="title"
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
      />
    ),
    
    'reference': (
      <ReferenceField
        key="reference"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="reference"
        isRTL={isRTL}
        t={t}
      />
    ),

    'description': (
      <DescriptionField
        key="description"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="description"
        isRTL={isRTL}
        t={t}
      />
    ),

    'price': (
      <PriceField
        key="price"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="price"
        isRTL={isRTL}
        t={t}
      />
    ),

    'etat': (
      <EtatField
        key="etat"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="etat"
        isRTL={isRTL}
        t={t}
      />
    ),

    'quantite': (
      <QuantiteField
        key="quantite"
        mainCategory={mainCategory}
        subCategory={subCategory}
        postData={postData}
        handleChangeInput={handleChangeInput}
        fieldName="quantite"
        isRTL={isRTL}
        t={t}
      />
    ),
    
    // Campos específicos
     
  
  
    
    'livraison': (
      <Livraison
        key="livraison"
        mainCategory={mainCategory}
        subCategory={subCategory}
        fieldName="livraison"
        postData={postData}
        handleChangeInput={handleChangeInput}
        isRTL={isRTL}
        t={t}
      />
    )
  };
  
  const subCategoryFields = getSubCategorySpecificFields();
  
  if (fieldName) {
    return fields[fieldName] || null;
  }
  
  if (subCategory && subCategoryFields) {
    return (
      <>
        {Object.keys(subCategoryFields).map(key => (
          <div key={key} className="mb-3">
            {fields[subCategoryFields[key]]}
          </div>
        ))}
      </>
    );
  }
  
  return null;
};

export default AlimentairesField;