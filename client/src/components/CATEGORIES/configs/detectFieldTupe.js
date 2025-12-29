// configs/FieldTypeDetector.js - DETECTOR AUTOMÁTICO DE TIPOS
/**
 * Detecta el tipo de campo automáticamente basado en su nombre
 * @param {string} fieldName - Nombre del campo
 * @returns {Object} Configuración detectada
 */
 export const detectFieldType = (fieldName) => {
    // Convertir a minúsculas para comparación
    const lowerFieldName = fieldName.toLowerCase();
    
    // Detectar números
    if (isNumberField(lowerFieldName)) {
      return {
        type: 'number',
        label: formatLabel(fieldName),
        placeholder: `Entrez ${fieldName.replace(/_/g, ' ')}`,
        min: getMinValue(lowerFieldName),
        suffix: getSuffix(lowerFieldName)
      };
    }
    
    // Detectar textareas
    if (isTextareaField(lowerFieldName)) {
      return {
        type: 'textarea',
        label: formatLabel(fieldName),
        placeholder: `Décrivez ${fieldName.replace(/_/g, ' ')}...`,
        rows: 3
      };
    }
    
    // Detectar email
    if (isEmailField(lowerFieldName)) {
      return {
        type: 'email',
        label: formatLabel(fieldName),
        placeholder: 'adresse@email.com'
      };
    }
    
    // Detectar teléfono
    if (isPhoneField(lowerFieldName)) {
      return {
        type: 'tel',
        label: formatLabel(fieldName),
        placeholder: 'Numéro de téléphone'
      };
    }
    
    // Detectar fecha
    if (isDateField(lowerFieldName)) {
      return {
        type: 'date',
        label: formatLabel(fieldName),
        placeholder: 'JJ/MM/AAAA'
      };
    }
    
    // Por defecto, campo de texto
    return {
      type: 'text',
      label: formatLabel(fieldName),
      placeholder: `Entrez ${fieldName.replace(/_/g, ' ')}`
    };
  };
  
  /**
   * Verifica si un campo debe ser numérico
   */
  const isNumberField = (fieldName) => {
    const numberKeywords = [
      'prix', 'loyer', 'salaire', 'tarif', 'cout', 'montant',
      'nombre', 'quantite', 'nombre_de', 'nb_',
      'capacite', 'taille', 'volume', 'poids',
      'age', 'annee', 'année',
      'duree', 'temps', 'periode',
      'etage', 'etages', 'chambres', 'pieces',
      'kilometrage', 'km', 'cylindree', 'puissance',
      'pointure', 'taille_num'
    ];
    
    return numberKeywords.some(keyword => fieldName.includes(keyword));
  };
  
  /**
   * Verifica si un campo debe ser textarea
   */
  const isTextareaField = (fieldName) => {
    const textareaKeywords = [
      'description', 'desc',
      'equipements', 'equipement',
      'accessoires', 'accessoire',
      'competences', 'competence',
      'avantages', 'avantage',
      'details', 'détail',
      'caracteristiques', 'caracteristique',
      'note', 'remarque', 'commentaire',
      'historique', 'experience'
    ];
    
    return textareaKeywords.some(keyword => fieldName.includes(keyword));
  };
  
  /**
   * Verifica si un campo debe ser email
   */
  const isEmailField = (fieldName) => {
    return fieldName.includes('email') || fieldName.includes('mail');
  };
  
  /**
   * Verifica si un campo debe ser teléfono
   */
  const isPhoneField = (fieldName) => {
    return fieldName.includes('phone') || 
           fieldName.includes('telephone') || 
           fieldName.includes('tel') ||
           fieldName.includes('mobile');
  };
  
  /**
   * Verifica si un campo debe ser fecha
   */
  const isDateField = (fieldName) => {
    return fieldName.includes('date') || 
           fieldName.includes('jour') ||
           fieldName.includes('annonce');
  };
  
  /**
   * Obtiene el valor mínimo para campos numéricos
   */
  const getMinValue = (fieldName) => {
    if (fieldName.includes('age') || fieldName.includes('annee')) {
      return 0;
    }
    if (fieldName.includes('prix') || fieldName.includes('loyer') || fieldName.includes('salaire')) {
      return 1;
    }
    return 0;
  };
  
  /**
   * Obtiene el sufijo para campos numéricos
   */
  const getSuffix = (fieldName) => {
    if (fieldName.includes('prix') || fieldName.includes('loyer') || fieldName.includes('salaire')) {
      return 'DA';
    }
    if (fieldName.includes('superficie') || fieldName.includes('surface')) {
      return 'm²';
    }
    if (fieldName.includes('kilometrage') || fieldName.includes('km')) {
      return 'km';
    }
    if (fieldName.includes('cylindree')) {
      return 'cm³';
    }
    if (fieldName.includes('puissance')) {
      return 'CV';
    }
    if (fieldName.includes('poids')) {
      return 'kg';
    }
    if (fieldName.includes('volume')) {
      return 'L';
    }
    if (fieldName.includes('duree')) {
      return 'jours';
    }
    return null;
  };
  
  /**
   * Formatea el label del campo
   */
  const formatLabel = (fieldName) => {
    // Reemplazar guiones bajos y capitalizar
    return fieldName
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };
  
  export default detectFieldType;