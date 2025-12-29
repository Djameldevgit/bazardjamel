// configs/SelectFieldConfig.js - CONFIGURACIÓN DE SELECTS
export const SELECT_FIELD_CONFIGS = {
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
  
  /**
   * Obtiene la configuración de un campo select
   * @param {string} fieldName - Nombre del campo
   * @returns {Object|null} Configuración o null si no es select
   */
  export const getSelectFieldConfig = (fieldName) => {
    return SELECT_FIELD_CONFIGS[fieldName] || null;
  };
  
  /**
   * Verifica si un campo es de tipo select
   * @param {string} fieldName - Nombre del campo
   * @returns {boolean}
   */
  export const isSelectField = (fieldName) => {
    return !!SELECT_FIELD_CONFIGS[fieldName];
  };
  
  /**
   * Obtiene todas las opciones de un select
   * @param {string} fieldName - Nombre del campo
   * @returns {Array|null} Array de opciones o null
   */
  export const getSelectOptions = (fieldName) => {
    const config = getSelectFieldConfig(fieldName);
    return config ? config.options : null;
  };
  
  /**
   * Obtiene todos los nombres de campos select
   * @returns {string[]}
   */
  export const getAllSelectFieldNames = () => {
    return Object.keys(SELECT_FIELD_CONFIGS);
  };
  
  export default SELECT_FIELD_CONFIGS;