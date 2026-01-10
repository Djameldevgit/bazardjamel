// 📂 components/CATEGORIES/categoryNivel/categorySport.js

const categorySport = {
    levels: 2,
    level1: 'categorie',
    level2: 'subCategory',
    requiresLevel2: false, // Mixto
    
    categories: [
      // ⚽ CON NIVEL 2
      { id: 'football', name: 'Football', emoji: '⚽', hasSublevel: true },
      { id: 'hand_voley_basket', name: 'Hand/Voley/ Basket-Ball', emoji: '🏀', hasSublevel: true },
      { id: 'sport_combat', name: 'Sport de combat', emoji: '🥊', hasSublevel: true },
      { id: 'fitness_musculation', name: 'Fitness - Musculation', emoji: '💪', hasSublevel: true },
      { id: 'natation', name: 'Natation', emoji: '🏊', hasSublevel: true },
      { id: 'velos_trotinettes', name: 'Vélos et trotinettes', emoji: '🚲', hasSublevel: true },
      { id: 'sports_raquette', name: 'Sports de raquette', emoji: '🎾', hasSublevel: true },
      
      // 🏊‍♂️ SIN NIVEL 2 (DIRECTAS)
      { id: 'sport_aquatiques', name: 'Sport aquatiques', emoji: '🤿', hasSublevel: false },
      { id: 'equitation', name: 'Équitation', emoji: '🐎', hasSublevel: false },
      { id: 'petanque', name: 'Pétanque', emoji: '🎯', hasSublevel: false },
      { id: 'autres_sports', name: 'Autres', emoji: '🏅', hasSublevel: false }
    ],
    
    subcategories: {
      // ⚽ FOOTBALL
      football: [
        { id: 'ballons_buts', name: 'Ballons et Buts', emoji: '⚽' },
        { id: 'equipements_accessoires_foot', name: 'Équipements et accessoires', emoji: '🛡️' },
        { id: 'chaussures_football', name: 'Chaussures de Football', emoji: '👟' },
        { id: 'vetements_football', name: 'Vêtements de football', emoji: '👕' }
      ],
      
      // 🏀 HAND/VOLEY/BASKET-BALL
      hand_voley_basket: [
        { id: 'equipements_accessoires_basket', name: 'Équipements et accessoires', emoji: '🏀' },
        { id: 'ballons_buts_filets', name: 'Ballons Buts et Filets', emoji: '🏐' },
        { id: 'chaussures_basket', name: 'Chaussures', emoji: '👟' },
        { id: 'vetements_basket', name: 'Vêtements', emoji: '👕' }
      ],
      
      // 🥊 SPORT DE COMBAT
      sport_combat: [
        { id: 'tenue_combat', name: 'Tenue', emoji: '🥋' },
        { id: 'gants_casques', name: 'Gants et casques', emoji: '🥊' },
        { id: 'autres_accessoires_combat', name: 'Autres accessoires', emoji: '🧤' }
      ],
      
      // 💪 FITNESS - MUSCULATION
      fitness_musculation: [
        { id: 'bancs_presses', name: 'Bancs et presses de musculation', emoji: '🏋️' },
        { id: 'poids_halteres', name: 'Poids et haltères', emoji: '🏋️‍♂️' },
        { id: 'tapis_roulants', name: 'Tapis roulants', emoji: '🏃' },
        { id: 'velos_rameurs', name: 'Vélos et rameurs', emoji: '🚴' },
        { id: 'autres_equipements_fitness', name: 'Autres équipements', emoji: '💪' }
      ],
      
      // 🏊 NATATION
      natation: [
        { id: 'lunettes_natation', name: 'Lunettes', emoji: '🥽' },
        { id: 'bonnets', name: 'Bonnets', emoji: '🧢' },
        { id: 'palmes', name: 'Palmes', emoji: '🐠' },
        { id: 'planches_flotteurs', name: 'Planches et flotteurs', emoji: '🛟' },
        { id: 'maillots_combinaisons', name: 'Maillots et combinaisons', emoji: '🩱' },
        { id: 'autres_accessoires_natation', name: 'Autres accessoires', emoji: '🏊' }
      ],
      
      // 🚲 VÉLOS ET TROTINETTES
      velos_trotinettes: [
        { id: 'vetements_chaussures_velo', name: 'Vêtements et chaussures', emoji: '👕' },
        { id: 'velos', name: 'Vélos', emoji: '🚲' },
        { id: 'trotinettes', name: 'Trotinettes', emoji: '🛴' },
        { id: 'equipements_accessoires_velo', name: 'Équipements et accessoires', emoji: '🔧' }
      ],
      
      // 🎾 SPORTS DE RAQUETTE
      sports_raquette: [
        { id: 'tennis', name: 'Tennis', emoji: '🎾' },
        { id: 'tennis_table', name: 'Tennis de table', emoji: '🏓' },
        { id: 'autre_raquette', name: 'Autre', emoji: '🎯' }
      ]
    }
  };
  
  export default categorySport;