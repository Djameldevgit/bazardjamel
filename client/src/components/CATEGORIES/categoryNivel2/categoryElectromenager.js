// 📁 categoryElectromenager.js — Version complète inspirée de OuedKniss
const categoryElectromenager = {
  levels: 2,
  level1: 'articleType',      // Tipo de producto (nivel 2)
  level2: 'subCategory',      // Variante o submodelo
  requiresLevel2: true,

  // 🧩 TIPOS DE PRODUCTOS PRINCIPALES (articleType)
  articleTypes: [
    { id: 'televiseurs', name: 'Téléviseurs', emoji: '📺', hasSublevel: true },
    { id: 'demodulateurs_box_tv', name: 'Démodulateurs & Box TV', emoji: '📦', hasSublevel: false },
    { id: 'paraboles_switch_tv', name: 'Paraboles & Switch TV', emoji: '📡', hasSublevel: false },
    { id: 'abonnements_iptv', name: 'Abonnements IPTV', emoji: '🛰️', hasSublevel: false },
    { id: 'cameras_accessoires', name: 'Caméras & Accessoires', emoji: '📷', hasSublevel: false },
    { id: 'audio', name: 'Audio', emoji: '🎧', hasSublevel: false },
    { id: 'refrigerateurs_congelateurs', name: 'Réfrigérateurs & Congélateurs', emoji: '🧊', hasSublevel: true },
    { id: 'machines_a_laver', name: 'Machines à laver', emoji: '👕', hasSublevel: true },
    { id: 'lave_vaisselles', name: 'Lave-vaisselles', emoji: '🍽️', hasSublevel: true },
    { id: 'fours_cuisson', name: 'Fours & Cuisson', emoji: '🍳', hasSublevel: true },
    { id: 'chauffage_climatisation', name: 'Chauffage & Climatisation', emoji: '❄️', hasSublevel: true },
    { id: 'appareils_de_cuisine', name: 'Appareils de cuisine', emoji: '☕', hasSublevel: true },
    { id: 'aspirateurs_nettoyeurs', name: 'Aspirateurs & Nettoyeurs', emoji: '🧹', hasSublevel: true },
    { id: 'repassage', name: 'Repassage', emoji: '🧺', hasSublevel: false },
    { id: 'beaute_hygiene', name: 'Beauté & Hygiène', emoji: '💇‍♀️', hasSublevel: true },
    { id: 'machines_a_coudre', name: 'Machines à coudre', emoji: '🧵', hasSublevel: false },
    { id: 'telecommandes', name: 'Télécommandes', emoji: '🎮', hasSublevel: false },
    { id: 'securite_gps', name: 'Sécurité & GPS', emoji: '📍', hasSublevel: false },
    { id: 'composants_electroniques', name: 'Composants électroniques', emoji: '💾', hasSublevel: false },
    { id: 'pieces_rechange', name: 'Pièces de rechange', emoji: '🔧', hasSublevel: false },
    { id: 'autre', name: 'Autre', emoji: '⚙️', hasSublevel: false },
  ],

  // 🧱 SUBCATEGORÍAS (solo donde aplica)
  subcategories: {
    // 📺 Téléviseurs
    'televiseurs': [
      { id: 'tv_led', name: 'Téléviseur LED', emoji: '💡' },
      { id: 'tv_smart', name: 'Smart TV', emoji: '🧠' },
      { id: 'tv_oled', name: 'Téléviseur OLED', emoji: '🌈' },
      { id: 'tv_4k', name: 'Téléviseur 4K', emoji: '📺' },
    ],

    // 🧊 Réfrigérateurs & Congélateurs
    'refrigerateurs_congelateurs': [
      { id: 'refrigerateur_classique', name: 'Réfrigérateur classique', emoji: '🧊' },
      { id: 'refrigerateur_americain', name: 'Réfrigérateur américain', emoji: '🇺🇸' },
      { id: 'refrigerateur_combine', name: 'Réfrigérateur combiné', emoji: '🥶' },
      { id: 'congelateur_coffre', name: 'Congélateur coffre', emoji: '📦' },
      { id: 'congelateur_vertical', name: 'Congélateur vertical', emoji: '⬆️' },
    ],

    // 👕 Machines à laver
    'machines_a_laver': [
      { id: 'lave_linge_frontal', name: 'Lave-linge frontal', emoji: '👚' },
      { id: 'lave_linge_top', name: 'Lave-linge top', emoji: '👕' },
      { id: 'lave_linge_sechant', name: 'Lave-linge séchant', emoji: '👖' },
    ],

    // 🍽️ Lave-vaisselles
    'lave_vaisselles': [
      { id: 'compact', name: 'Lave-vaisselle compact', emoji: '🍽️' },
      { id: 'integrable', name: 'Lave-vaisselle intégrable', emoji: '🧩' },
      { id: 'grande_capacite', name: 'Grande capacité', emoji: '📏' },
    ],

    // 🍳 Fours & Cuisson
    'fours_cuisson': [
      { id: 'four_electrique', name: 'Four électrique', emoji: '🔥' },
      { id: 'four_gaz', name: 'Four à gaz', emoji: '🍕' },
      { id: 'plaque_cuisson', name: 'Plaque de cuisson', emoji: '🥘' },
      { id: 'cuisiniere', name: 'Cuisinière', emoji: '🍳' },
    ],

    // ❄️ Chauffage & Climatisation
    'chauffage_climatisation': [
      { id: 'climatiseur_split', name: 'Climatiseur split', emoji: '❄️' },
      { id: 'climatiseur_mobile', name: 'Climatiseur mobile', emoji: '🌀' },
      { id: 'chauffage_gaz', name: 'Chauffage à gaz', emoji: '🔥' },
      { id: 'chauffage_electrique', name: 'Chauffage électrique', emoji: '⚡' },
    ],

    // ☕ Appareils de cuisine
    'appareils_de_cuisine': [
      { id: 'machine_cafe', name: 'Machine à café', emoji: '☕' },
      { id: 'mixeur', name: 'Mixeur / Blender', emoji: '🥤' },
      { id: 'grille_pain', name: 'Grille-pain', emoji: '🍞' },
      { id: 'micro_ondes', name: 'Micro-ondes', emoji: '🌊' },
      { id: 'robot_cuisine', name: 'Robot de cuisine', emoji: '🥄' },
    ],

    // 🧹 Aspirateurs & Nettoyeurs
    'aspirateurs_nettoyeurs': [
      { id: 'aspirateur_traineau', name: 'Aspirateur traîneau', emoji: '🧹' },
      { id: 'aspirateur_balai', name: 'Aspirateur balai', emoji: '🧹' },
      { id: 'aspirateur_robot', name: 'Aspirateur robot', emoji: '🤖' },
      { id: 'nettoyeur_vapeur', name: 'Nettoyeur vapeur', emoji: '💨' },
    ],

    // 💇‍♀️ Beauté & Hygiène
    'beaute_hygiene': [
      { id: 'seche_cheveux', name: 'Sèche-cheveux', emoji: '💇‍♀️' },
      { id: 'tondeuse', name: 'Tondeuse', emoji: '✂️' },
      { id: 'fer_a_lisser', name: 'Fer à lisser', emoji: '🔥' },
      { id: 'epilateur', name: 'Épilateur', emoji: '🧴' },
    ],
  },
};

export default categoryElectromenager;

