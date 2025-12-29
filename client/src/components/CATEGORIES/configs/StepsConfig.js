// StepsConfig.js - CONFIGURACIÓN DE PASOS SEPARADA
// Copia todo el objeto STEP_CONFIG aquí desde tu código actual

export const STEP_CONFIG = {
    // ==================== IMMOBILIER ====================
    immobilier: {
      vente: {
        appartement: {
          step1: ['superficie', 'chambres', 'salle_de_bain', 'etage', 'ascenseur'],
          step2: ['description', 'meuble', 'parking', 'jardin', 'piscine'],
          step3: ['prix', 'negociable'],
          step4: ['wilaya', 'commune', 'adresse', 'phone'],
          step5: []
        },
        // ... resto igual que tu código
      },
      // ... resto igual
    },
    // ... resto igual que tu código actual
  };
  
  // 🔥 CONFIGURACIÓN POR DEFECTO (si no encuentra la categoría específica)
  export const DEFAULT_CONFIG = {
    step1: ['description'],
    step2: ['prix', 'etat'],
    step3: ['wilaya', 'commune'],
    step4: ['phone', 'email'],
    step5: []
  };
  
  export default STEP_CONFIG;