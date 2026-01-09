const categoryTelephones = {
    levels: 2,
    level1: 'categorie',
    level2: 'subcategory',
    requiresLevel2: false,
    
    categories: [
      // SIN NIVEL EXTRA
      { id: 'smartphones', name: 'Smartphones', emoji: '📱', hasSublevel: false },
      { id: 'telephones_cellulaires', name: 'Téléphones cellulaires', emoji: '📞', hasSublevel: false },
      { id: 'tablettes', name: 'Tablettes', emoji: '💻', hasSublevel: false },
      { id: 'fixes_fax', name: 'Fixes & Fax', emoji: '☎️', hasSublevel: false },
      { id: 'smartwatchs', name: 'Smartwatchs', emoji: '⌚', hasSublevel: false },
      { id: 'accessoires', name: 'Accessoires', emoji: '🎧', hasSublevel: false },
      { id: 'pieces_rechange', name: 'Pièces de rechange', emoji: '🔧', hasSublevel: false },
      { id: 'offres_abonnements', name: 'Offres & Abonnements', emoji: '📶', hasSublevel: false },
      
      // CON NIVEL EXTRA
      { id: 'protection_antichoc', name: 'Protection & Antichoc', emoji: '🛡️', hasSublevel: true },
      { id: 'ecouteurs_son', name: 'Ecouteurs & Son', emoji: '🎵', hasSublevel: true },
      { id: 'chargeurs_cables', name: 'Chargeurs & Câbles', emoji: '🔌', hasSublevel: true },
      { id: 'supports_stabilisateurs', name: 'Supports & Stabilisateurs', emoji: '📐', hasSublevel: true },
      { id: 'manettes', name: 'Manettes', emoji: '🎮', hasSublevel: true },
      { id: 'vr', name: 'VR', emoji: '👓', hasSublevel: true },
      { id: 'power_banks', name: 'Power banks', emoji: '🔋', hasSublevel: true },
      { id: 'stylets', name: 'Stylets', emoji: '✏️', hasSublevel: true },
      { id: 'cartes_memoire', name: 'Cartes Mémoire', emoji: '💾', hasSublevel: true }
    ],
    
    subcategories: {
      protection_antichoc: [
        { id: 'protections_ecran', name: 'Protections d\'écran', emoji: '🖥️' },
        { id: 'coques_antichoc', name: 'Coques & Antichoc', emoji: '📱' },
        { id: 'films_protection', name: 'Films de protection', emoji: '📋' },
        { id: 'etuis', name: 'Étuis', emoji: '🎁' },
        { id: 'protections_camera', name: 'Protections de caméra', emoji: '📸' }
      ],
      
      ecouteurs_son: [
        { id: 'ecouteurs_filaires', name: 'Écouteurs filaires', emoji: '🎧' },
        { id: 'ecouteurs_bluetooth', name: 'Écouteurs Bluetooth', emoji: '🔵' },
        { id: 'casques_audio', name: 'Casques audio', emoji: '🎧' },
        { id: 'hauts_parleurs_portables', name: 'Hauts-parleurs portables', emoji: '🔊' },
        { id: 'adaptateurs_audio', name: 'Adaptateurs audio', emoji: '🎛️' }
      ],
      
      chargeurs_cables: [
        { id: 'chargeurs_mur', name: 'Chargeurs mural', emoji: '🔌' },
        { id: 'chargeurs_voiture', name: 'Chargeurs voiture', emoji: '🚗' },
        { id: 'chargeurs_sans_fil', name: 'Chargeurs sans fil', emoji: '⚡' },
        { id: 'cables_usb', name: 'Câbles USB', emoji: '🔌' },
        { id: 'cables_lightning', name: 'Câbles Lightning', emoji: '⚡' },
        { id: 'cables_type_c', name: 'Câbles Type-C', emoji: '🔌' },
        { id: 'hubs_chargeurs', name: 'Hubs chargeurs', emoji: '🔗' }
      ],
      
      supports_stabilisateurs: [
        { id: 'supports', name: 'Supports', emoji: '📱' },
        { id: 'stabilisateurs', name: 'Stabilisateurs', emoji: '🤳' },
        { id: 'barres_selfies', name: 'Barres de selfies', emoji: '📸' },
        { id: 'pieds_telephone', name: 'Pieds pour téléphone', emoji: '📐' },
        { id: 'ventouses_voiture', name: 'Ventouses voiture', emoji: '🚗' }
      ],
      
      manettes: [
        { id: 'manettes_bluetooth', name: 'Manettes Bluetooth', emoji: '🎮' },
        { id: 'manettes_filaires', name: 'Manettes filaires', emoji: '🎮' },
        { id: 'manettes_telephone', name: 'Manettes pour téléphone', emoji: '📱' },
        { id: 'manettes_tablette', name: 'Manettes pour tablette', emoji: '💻' },
        { id: 'accessoires_manettes', name: 'Accessoires pour manettes', emoji: '🔧' }
      ],
      
      vr: [
        { id: 'casques_vr', name: 'Casques VR', emoji: '👓' },
        { id: 'lunettes_vr', name: 'Lunettes VR', emoji: '🕶️' },
        { id: 'accessoires_vr', name: 'Accessoires VR', emoji: '🔧' },
        { id: 'controleurs_vr', name: 'Contrôleurs VR', emoji: '🎮' },
        { id: 'jeux_vr', name: 'Jeux VR', emoji: '🎮' }
      ],
      
      power_banks: [
        { id: 'power_bank_10000mah', name: 'Power bank 10,000mAh', emoji: '🔋' },
        { id: 'power_bank_20000mah', name: 'Power bank 20,000mAh', emoji: '🔋' },
        { id: 'power_bank_solaire', name: 'Power bank solaire', emoji: '☀️' },
        { id: 'power_bank_rapide', name: 'Power bank charge rapide', emoji: '⚡' },
        { id: 'power_bank_compact', name: 'Power bank compact', emoji: '📱' }
      ],
      
      stylets: [
        { id: 'stylets_actifs', name: 'Stylets actifs', emoji: '✏️' },
        { id: 'stylets_passifs', name: 'Stylets passifs', emoji: '✏️' },
        { id: 'stylets_bluetooth', name: 'Stylets Bluetooth', emoji: '🔵' },
        { id: 'stylets_tablette', name: 'Stylets pour tablette', emoji: '💻' },
        { id: 'recharges_stylet', name: 'Recharges pour stylet', emoji: '🔋' }
      ],
      
      cartes_memoire: [
        { id: 'sd_cards', name: 'Cartes SD', emoji: '💾' },
        { id: 'micro_sd_cards', name: 'Cartes Micro SD', emoji: '💾' },
        { id: 'sdhc_cards', name: 'Cartes SDHC', emoji: '💾' },
        { id: 'sdxc_cards', name: 'Cartes SDXC', emoji: '💾' },
        { id: 'adaptateurs_carte', name: 'Adaptateurs de carte', emoji: '🔌' },
        { id: 'lecteurs_carte', name: 'Lecteurs de carte', emoji: '📖' }
      ]
    }
  };
  
  export default categoryTelephones;