// configs/BasicFieldConfig.js - CAMPOS BÁSICOS (text, number, textarea)
export const BASIC_FIELD_CONFIGS = {
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
  
  /**
   * Obtiene la configuración de un campo básico
   * @param {string} fieldName - Nombre del campo
   * @returns {Object|null} Configuración o null si no existe
   */
  export const getBasicFieldConfig = (fieldName) => {
    return BASIC_FIELD_CONFIGS[fieldName] || null;
  };
  
  /**
   * Verifica si un campo es básico
   * @param {string} fieldName - Nombre del campo
   * @returns {boolean}
   */
  export const isBasicField = (fieldName) => {
    return !!BASIC_FIELD_CONFIGS[fieldName];
  };
  
  /**
   * Obtiene todos los nombres de campos básicos
   * @returns {string[]}
   */
  export const getAllBasicFieldNames = () => {
    return Object.keys(BASIC_FIELD_CONFIGS);
  };
  
  export default BASIC_FIELD_CONFIGS;