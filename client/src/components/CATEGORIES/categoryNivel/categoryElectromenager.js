  const categoryElectromenager = {
 
    levels: 2,
    level1: 'categorie',
    level2: 'subcategory',
    requiresLevel2: false,
    
    categories: [
      // SIN NIVEL EXTRA
      { id: 'televiseurs', name: 'Téléviseurs', emoji: '📺', hasSublevel: false },
      { id: 'demodulateurs_box_tv', name: 'Démodulateurs & Box TV', emoji: '📦', hasSublevel: false },
      { id: 'paraboles_switch_tv', name: 'Paraboles & Switch TV', emoji: '🛰️', hasSublevel: false },
      { id: 'abonnements_iptv', name: 'Abonnements IPTV', emoji: '📡', hasSublevel: false },
      { id: 'cameras_accessories', name: 'Caméras & Accessories', emoji: '📹', hasSublevel: false },
      { id: 'audio', name: 'Audio', emoji: '🔊', hasSublevel: false },
      { id: 'aspirateurs_nettoyeurs', name: 'Aspirateurs & Nettoyeurs', emoji: '🧹', hasSublevel: false },
      { id: 'repassage', name: 'Repassage', emoji: '👔', hasSublevel: false },
      { id: 'beaute_hygiene', name: 'Beauté & Hygiène', emoji: '💄', hasSublevel: false },
      { id: 'machines_coudre', name: 'Machines à coudre', emoji: '🧵', hasSublevel: false },
      { id: 'telecommandes', name: 'Télécommandes', emoji: '🎮', hasSublevel: false },
      { id: 'securite_gps', name: 'Sécurité & GPS', emoji: '🚨', hasSublevel: false },
      { id: 'composants_electroniques', name: 'Composants électroniques', emoji: '⚙️', hasSublevel: false },
      { id: 'pieces_rechange', name: 'Pièces de rechange', emoji: '🔧', hasSublevel: false },
      { id: 'autre_electromenager', name: 'Autre Électroménager', emoji: '🔌', hasSublevel: false },
      
      // CON NIVEL EXTRA
      { id: 'refrigerateurs_congelateurs', name: 'Réfrigérateurs & Congélateurs', emoji: '❄️', hasSublevel: true },
      { id: 'machines_laver', name: 'Machines à laver', emoji: '🧺', hasSublevel: true },
      { id: 'lave_vaisselles', name: 'Lave-vaisselles', emoji: '🍽️', hasSublevel: true },
      { id: 'fours_cuisson', name: 'Fours & Cuisson', emoji: '🔥', hasSublevel: true },
      { id: 'chauffage_climatisation', name: 'Chauffage & Climatisation', emoji: '🌡️', hasSublevel: true },
      { id: 'appareils_cuisine', name: 'Appareils de cuisine', emoji: '🍳', hasSublevel: true }
    ],
    
    subcategories: {
      refrigerateurs_congelateurs: [
        { id: 'refrigerateur', name: 'Réfrigérateur', emoji: '🧊' },
        { id: 'congelateur', name: 'Congélateur', emoji: '❄️' },
        { id: 'refrigerateur_congelateur', name: 'Réfrigérateur-Congélateur', emoji: '🧊❄️' },
        { id: 'cave_vin', name: 'Cave à vin', emoji: '🍷' }
      ],
      machines_laver: [
        { id: 'lave_linge', name: 'Lave-linge', emoji: '👚' },
        { id: 'seche_linge', name: 'Sèche-linge', emoji: '🌞' },
        { id: 'lave_linge_seche_linge', name: 'Lave-linge/Sèche-linge', emoji: '👚🌞' },
        { id: 'lave_linge_essorage', name: 'Lave-linge avec essorage', emoji: '🌀' }
      ],
      lave_vaisselles: [
        { id: 'lave_vaisselle_encastrable', name: 'Lave-vaisselle encastrable', emoji: '📦' },
        { id: 'lave_vaisselle_poselibre', name: 'Lave-vaisselle pose libre', emoji: '🍽️' },
        { id: 'lave_vaisselle_compact', name: 'Lave-vaisselle compact', emoji: '📦' }
      ],
      fours_cuisson: [
        { id: 'four_electrique', name: 'Four électrique', emoji: '⚡' },
        { id: 'four_gaz', name: 'Four à gaz', emoji: '🔥' },
        { id: 'four_micro_ondes', name: 'Four micro-ondes', emoji: '🌀' },
        { id: 'plaque_cuisson', name: 'Plaque de cuisson', emoji: '🍳' },
        { id: 'cuisiniere', name: 'Cuisinière', emoji: '👩‍🍳' }
      ],
      chauffage_climatisation: [
        { id: 'climatiseur', name: 'Climatiseur', emoji: '❄️' },
        { id: 'ventilateur', name: 'Ventilateur', emoji: '💨' },
        { id: 'radiateur', name: 'Radiateur', emoji: '🔥' },
        { id: 'chauffe_eau', name: 'Chauffe-eau', emoji: '🚿' },
        { id: 'pompe_chaleur', name: 'Pompe à chaleur', emoji: '🌡️' }
      ],
      appareils_cuisine: [
        { id: 'robot_cuisine', name: 'Robot de cuisine', emoji: '🍲' },
        { id: 'mixeur', name: 'Mixeur', emoji: '🥤' },
        { id: 'bouilloire', name: 'Bouilloire', emoji: '♨️' },
        { id: 'cafetiere', name: 'Cafetière', emoji: '☕' },
        { id: 'grille_pain', name: 'Grille-pain', emoji: '🍞' }
      ]
    }
  };
  export default categoryElectromenager