  const categoryImmobilier = {
    levels: 2,
    level1: 'operation',
    level2: 'property',
    requiresLevel2: true,
    
    operations: [
      { id: 'vente', name: 'Vente', emoji: '💰', hasSublevel: true },
      { id: 'location', name: 'Location', emoji: '🔑', hasSublevel: true },
      { id: 'location_vacances', name: 'Location vacances', emoji: '🏖️', hasSublevel: true },
      { id: 'cherche_location', name: 'Cherche location', emoji: '🔍', hasSublevel: true },
      { id: 'cherche_achat', name: 'Cherche achat', emoji: '🔍', hasSublevel: true }
    ],
    
    properties: {
      vente: [
        { id: 'appartement', name: 'Appartement', emoji: '🏢' },
        { id: 'local', name: 'Local', emoji: '🏪' },
        { id: 'villa', name: 'Villa', emoji: '🏡' },
        { id: 'terrain', name: 'Terrain', emoji: '⛰️' },
        { id: 'terrain_agricole', name: 'Terrain Agricole', emoji: '🌾' },
        { id: 'immeuble', name: 'Immeuble', emoji: '🏢' },
        { id: 'bungalow', name: 'Bungalow', emoji: '🏝️' },
        { id: 'hangar_usine', name: 'Hangar - Usine', emoji: '🏭' },
        { id: 'autre', name: 'Autre', emoji: '🏠' }
      ],
      location: [
        { id: 'appartement', name: 'Appartement', emoji: '🏢' },
        { id: 'local', name: 'Local', emoji: '🏪' },
        { id: 'villa', name: 'Villa', emoji: '🏡' },
        { id: 'immeuble', name: 'Immeuble', emoji: '🏢' },
        { id: 'bungalow', name: 'Bungalow', emoji: '🏝️' },
        { id: 'autre', name: 'Autre', emoji: '🏠' }
      ],
      location_vacances: [
        { id: 'appartement', name: 'Appartement', emoji: '🏢' },
        { id: 'villa', name: 'Villa', emoji: '🏡' },
        { id: 'bungalow', name: 'Bungalow', emoji: '🏝️' },
        { id: 'autre', name: 'Autre', emoji: '🏠' }
      ],
      cherche_location: [
        { id: 'appartement', name: 'Appartement', emoji: '🏢' },
        { id: 'local', name: 'Local', emoji: '🏪' },
        { id: 'villa', name: 'Villa', emoji: '🏡' },
        { id: 'immeuble', name: 'Immeuble', emoji: '🏢' },
        { id: 'bungalow', name: 'Bungalow', emoji: '🏝️' },
        { id: 'autre', name: 'Autre', emoji: '🏠' }
      ],
      cherche_achat: [
        { id: 'appartement', name: 'Appartement', emoji: '🏢' },
        { id: 'local', name: 'Local', emoji: '🏪' },
        { id: 'villa', name: 'Villa', emoji: '🏡' },
        { id: 'terrain', name: 'Terrain', emoji: '⛰️' },
        { id: 'terrain_agricole', name: 'Terrain Agricole', emoji: '🌾' },
        { id: 'immeuble', name: 'Immeuble', emoji: '🏢' },
        { id: 'bungalow', name: 'Bungalow', emoji: '🏝️' },
        { id: 'hangar_usine', name: 'Hangar - Usine', emoji: '🏭' },
        { id: 'autre', name: 'Autre', emoji: '🏠' }
      ]
    }
  };
  export default categoryImmobilier 