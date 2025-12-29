// FieldRenderer.js - VERSIÓN FINAL SIN ERRORES
import React from 'react';
import { Form } from 'react-bootstrap';

const FieldRenderer = ({ 
  fieldName = '', 
  postData = {}, 
  handleChangeInput = () => {}, 
  mainCategory = '', 
  subCategory = '', 
  articleType = '', 
  isRTL = false 
}) => {
  
  // 1️⃣ CONFIGURACIÓN BÁSICA - SOLO STRINGS
  const getFieldConfig = () => {
    if (!fieldName) {
      return {
        type: 'text',
        label: 'Champ',
        placeholder: 'Entrez la valeur'
      };
    }
    
    // 📌 CONFIGURACIÓN SIMPLE - SOLO STRINGS
    const fieldConfigs = {
      // ========== PRECIOS ==========
      'prix': { type: 'number', label: 'Prix', placeholder: 'Prix en DA', suffix: 'DA' },
      'loyer': { type: 'number', label: 'Loyer', placeholder: 'Loyer mensuel', suffix: 'DA/mois' },
      'prix_nuit': { type: 'number', label: 'Prix par nuit', placeholder: 'Prix par nuit', suffix: 'DA/nuit' },
      'prix_semaine': { type: 'number', label: 'Prix par semaine', placeholder: 'Prix par semaine', suffix: 'DA/semaine' },
      'caution': { type: 'number', label: 'Caution', placeholder: 'Montant caution', suffix: 'DA' },
      'salaire': { type: 'number', label: 'Salaire', placeholder: 'Salaire mensuel', suffix: 'DA/mois' },
      
      // ========== INMOBILIARIA ==========
      'superficie': { type: 'number', label: 'Superficie', placeholder: 'm²', suffix: 'm²' },
      'chambres': { type: 'number', label: 'Chambres', placeholder: 'Nombre de chambres' },
      'salle_de_bain': { type: 'number', label: 'Salles de bain', placeholder: 'Nombre' },
      'etage': { type: 'number', label: 'Étage', placeholder: 'Numéro d\'étage' },
      'etages': { type: 'number', label: 'Nombre d\'étages', placeholder: 'Nombre total' },
      
      // ========== VEHÍCULOS ==========
      'marque': { type: 'text', label: 'Marque', placeholder: 'Marque du véhicule' },
      'modele': { type: 'text', label: 'Modèle', placeholder: 'Modèle du véhicule' },
      'annee': { type: 'number', label: 'Année', placeholder: 'Année de fabrication' },
      'kilometrage': { type: 'number', label: 'Kilométrage', placeholder: 'km', suffix: 'km' },
      'cylindree': { type: 'number', label: 'Cylindrée', placeholder: 'cm³', suffix: 'cm³' },
      'puissance': { type: 'number', label: 'Puissance', placeholder: 'CV', suffix: 'CV' },
      'portes': { type: 'number', label: 'Portes', placeholder: 'Nombre de portes' },
      
      // ========== TECNOLOGÍA ==========
      'capacite_stockage': { type: 'text', label: 'Capacité stockage', placeholder: 'Ex: 128GB' },
      'ram': { type: 'text', label: 'RAM', placeholder: 'Ex: 8GB' },
      'processeur': { type: 'text', label: 'Processeur', placeholder: 'Ex: Intel i7' },
      'carte_graphique': { type: 'text', label: 'Carte graphique', placeholder: 'Ex: NVIDIA GTX' },
      'taille_ecran': { type: 'text', label: 'Taille écran', placeholder: 'Ex: 15.6"' },
      
      // ========== ROPA ==========
      'taille': { type: 'text', label: 'Taille', placeholder: 'Ex: M, L, XL' },
      'pointure': { type: 'number', label: 'Pointure', placeholder: 'Ex: 42' },
      'couleur': { type: 'text', label: 'Couleur', placeholder: 'Couleur' },
      'matiere': { type: 'text', label: 'Matière', placeholder: 'Ex: Coton, Cuir' },
      
      // ========== UBICACIÓN ==========
      'wilaya': { type: 'text', label: 'Wilaya', placeholder: 'Wilaya' },
      'commune': { type: 'text', label: 'Commune', placeholder: 'Commune' },
      'adresse': { type: 'text', label: 'Adresse', placeholder: 'Adresse complète' },
      'address': { type: 'text', label: 'Adresse', placeholder: 'Adresse complète' },
      'phone': { type: 'tel', label: 'Téléphone', placeholder: 'Numéro de téléphone' },
      'email': { type: 'email', label: 'Email', placeholder: 'adresse@email.com' },
      
      // ========== DESCRIPCIÓN ==========
      'description': { type: 'textarea', label: 'Description', placeholder: 'Décrivez votre annonce...' },
      
      // ========== OTROS ==========
      'quantite': { type: 'number', label: 'Quantité', placeholder: 'Quantité' },
      'poids': { type: 'number', label: 'Poids', placeholder: 'Poids en kg', suffix: 'kg' },
      'volume': { type: 'number', label: 'Volume', placeholder: 'Volume en L', suffix: 'L' },
      'duree': { type: 'number', label: 'Durée', placeholder: 'Durée en jours', suffix: 'jours' },
      'age': { type: 'number', label: 'Âge', placeholder: 'Âge en années' },
      
      // ========== TEXTOS LARGOS ==========
      'equipements': { type: 'textarea', label: 'Équipements', placeholder: 'Liste des équipements' },
      'accessoires': { type: 'textarea', label: 'Accessoires', placeholder: 'Accessoires inclus' },
      'competences': { type: 'textarea', label: 'Compétences', placeholder: 'Liste des compétences' },
      'avantages': { type: 'textarea', label: 'Avantages', placeholder: 'Avantages' }
    };
    
    // 📌 CONFIGURACIÓN PARA SELECTS - LISTAS DE OPCIONES
    const selectConfigs = {
      // ========== INMOBILIARIA ==========
      'meuble': { 
        type: 'select', 
        label: 'Meublé', 
        options: ['', 'Oui', 'Non', 'Partiellement'] 
      },
      'ascenseur': { 
        type: 'select', 
        label: 'Ascenseur', 
        options: ['', 'Oui', 'Non'] 
      },
      'parking': { 
        type: 'select', 
        label: 'Parking', 
        options: ['', 'Oui', 'Non', 'Privé', 'Commun'] 
      },
      'jardin': { 
        type: 'select', 
        label: 'Jardin', 
        options: ['', 'Oui', 'Non'] 
      },
      'piscine': { 
        type: 'select', 
        label: 'Piscine', 
        options: ['', 'Oui', 'Non'] 
      },
      'type_terrain': { 
        type: 'select', 
        label: 'Type terrain', 
        options: ['', 'Constructible', 'Agricole', 'Industriel'] 
      },
      'type_local': { 
        type: 'select', 
        label: 'Type local', 
        options: ['', 'Commercial', 'Bureau', 'Entrepôt'] 
      },
      'viabilise': { 
        type: 'select', 
        label: 'Viabilisé', 
        options: ['', 'Oui', 'Non', 'Partiellement'] 
      },
      
      // ========== VEHÍCULOS ==========
      'carburant': { 
        type: 'select', 
        label: 'Carburant', 
        options: ['', 'Essence', 'Diesel', 'Électrique', 'Hybride', 'GPL'] 
      },
      'boite': { 
        type: 'select', 
        label: 'Boîte', 
        options: ['', 'Manuelle', 'Automatique'] 
      },
      'type_moto': { 
        type: 'select', 
        label: 'Type moto', 
        options: ['', 'Sportive', 'Roadster', 'Custom', 'Trail', 'Scooter'] 
      },
      
      // ========== TECNOLOGÍA ==========
      'etat': { 
        type: 'select', 
        label: 'État', 
        options: ['', 'Neuf', 'Comme neuf', 'Bon état', 'État moyen', 'À réparer'] 
      },
      'garantie': { 
        type: 'select', 
        label: 'Garantie', 
        options: ['', 'Oui', 'Non', '3 mois', '6 mois', '1 an'] 
      },
      
      // ========== ROPA ==========
      'type_vetement': { 
        type: 'select', 
        label: 'Type vêtement', 
        options: ['', 'T-Shirt', 'Chemise', 'Pantalon', 'Jean', 'Veste', 'Robe', 'Jupe'] 
      },
      'type_chaussure': { 
        type: 'select', 
        label: 'Type chaussure', 
        options: ['', 'Baskets', 'Chaussure ville', 'Sandale', 'Botte', 'Escarpin'] 
      },
      'saison': { 
        type: 'select', 
        label: 'Saison', 
        options: ['', 'Été', 'Hiver', 'Printemps', 'Automne', 'Toutes saisons'] 
      },
      'talon': { 
        type: 'select', 
        label: 'Talon', 
        options: ['', 'Plat', 'Bas', 'Moyen', 'Haut'] 
      },
      
      // ========== GENERALES ==========
      'negociable': { 
        type: 'select', 
        label: 'Négociable', 
        options: ['', 'Oui', 'Non'] 
      },
      'type_contrat': { 
        type: 'select', 
        label: 'Type contrat', 
        options: ['', 'CDI', 'CDD', 'Intérim', 'Stage', 'Freelance'] 
      },
      'type_animal': { 
        type: 'select', 
        label: 'Type animal', 
        options: ['', 'Chien', 'Chat', 'Oiseau', 'Rongeur', 'Poisson'] 
      },
      'sexe': { 
        type: 'select', 
        label: 'Sexe', 
        options: ['', 'Mâle', 'Femelle'] 
      },
      'vaccin': { 
        type: 'select', 
        label: 'Vacciné', 
        options: ['', 'Oui', 'Non', 'Partiellement'] 
      }
    };
    
    // 1. Buscar primero en selects
    if (selectConfigs[fieldName]) {
      return selectConfigs[fieldName];
    }
    
    // 2. Buscar en campos regulares
    if (fieldConfigs[fieldName]) {
      return fieldConfigs[fieldName];
    }
    
    // 3. Si no se encuentra, crear configuración básica
    let fieldType = 'text';
    if (fieldName.includes('prix') || fieldName.includes('loyer') || 
        fieldName.includes('salaire') || fieldName.includes('tarif') ||
        fieldName.includes('nombre') || fieldName.includes('quantite') ||
        fieldName.includes('capacite') || fieldName.includes('poids') ||
        fieldName.includes('volume') || fieldName.includes('duree') ||
        fieldName.includes('age') || fieldName.includes('annee')) {
      fieldType = 'number';
    } else if (fieldName.includes('description') || 
               fieldName.includes('equipements') || 
               fieldName.includes('accessoires') ||
               fieldName.includes('competences') ||
               fieldName.includes('avantages')) {
      fieldType = 'textarea';
    } else if (fieldName.includes('email')) {
      fieldType = 'email';
    } else if (fieldName.includes('phone') || fieldName.includes('telephone')) {
      fieldType = 'tel';
    } else if (fieldName.includes('date')) {
      fieldType = 'date';
    }
    
    return {
      type: fieldType,
      label: fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      placeholder: `Entrez ${fieldName.replace(/_/g, ' ')}`
    };
  };
  
  // 2️⃣ OBTENER CONFIGURACIÓN
  const fieldConfig = getFieldConfig();
  const value = postData[fieldName] || '';
  
  // 3️⃣ FUNCIÓN PARA RENDERIZAR SELECT
  const renderSelect = () => {
    // Asegurar que options sea un array
    const options = fieldConfig.options || [];
    
    return (
      <Form.Select
        name={fieldName}
        value={value}
        onChange={handleChangeInput}
        dir={isRTL ? 'rtl' : 'ltr'}
        className="form-control"
      >
        {options.map((option, index) => {
          // Si la opción es string vacío, mostrar placeholder
          if (option === '') {
            return <option key={index} value="">-- Sélectionnez --</option>;
          }
          // Si la opción es string normal, usarla como value y label
          return (
            <option key={index} value={option.toLowerCase().replace(/ /g, '_')}>
              {option}
            </option>
          );
        })}
      </Form.Select>
    );
  };
  
  // 4️⃣ FUNCIÓN PARA RENDERIZAR TEXTAREA
  const renderTextarea = () => (
    <Form.Control
      as="textarea"
      name={fieldName}
      value={value}
      onChange={handleChangeInput}
      placeholder={fieldConfig.placeholder}
      rows={fieldConfig.rows || 3}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="form-control"
    />
  );
  
  // 5️⃣ FUNCIÓN PARA RENDERIZAR NUMBER CON SUFIJO
  const renderNumberWithSuffix = () => (
    <div className="position-relative">
      <Form.Control
        type="number"
        name={fieldName}
        value={value}
        onChange={handleChangeInput}
        placeholder={fieldConfig.placeholder}
        dir={isRTL ? 'rtl' : 'ltr'}
        className="form-control"
        min={fieldConfig.min || 0}
        required={fieldConfig.required}
      />
      {fieldConfig.suffix && (
        <div className="position-absolute top-50 end-0 translate-middle-y me-2">
          <small className="text-muted">{fieldConfig.suffix}</small>
        </div>
      )}
    </div>
  );
  
  // 6️⃣ FUNCIÓN PARA RENDERIZAR CAMPOS REGULARES
  const renderRegularField = () => (
    <Form.Control
      type={fieldConfig.type || 'text'}
      name={fieldName}
      value={value}
      onChange={handleChangeInput}
      placeholder={fieldConfig.placeholder}
      dir={isRTL ? 'rtl' : 'ltr'}
      className="form-control"
      min={fieldConfig.min}
      max={fieldConfig.max}
      required={fieldConfig.required}
    />
  );
  
  // 7️⃣ RENDERIZAR COMPONENTE
  return (
    <div className="field-renderer mb-3">
      <Form.Group>
        {/* ETIQUETA */}
        <Form.Label className="fw-bold mb-1">
          {fieldConfig.label}
          {fieldConfig.required && <span className="text-danger ms-1">*</span>}
        </Form.Label>
        
        {/* SELECT */}
        {fieldConfig.type === 'select' ? renderSelect() : 
         /* TEXTAREA */
         fieldConfig.type === 'textarea' ? renderTextarea() :
         /* NUMBER CON SUFIJO */
         fieldConfig.type === 'number' && fieldConfig.suffix ? renderNumberWithSuffix() :
         /* OTROS CAMPOS */
         renderRegularField()}
        
        {/* TEXTO DE AYUDA */}
        {fieldConfig.suffix && fieldConfig.type === 'number' && (
          <Form.Text className="text-muted d-block mt-1">
            <small>
              <i className="fas fa-info-circle me-1"></i>
              {fieldConfig.suffix}
            </small>
          </Form.Text>
        )}
        
        {fieldConfig.type === 'select' && (
          <Form.Text className="text-muted d-block mt-1">
            <small>
              <i className="fas fa-chevron-down me-1"></i>
              Sélectionnez une option
            </small>
          </Form.Text>
        )}
      </Form.Group>
    </div>
  );
};

export default FieldRenderer;