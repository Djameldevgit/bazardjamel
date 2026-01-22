// 📂 components/CATEGORIES/categoryNivel/categoryMeubles.js

const categoryMeubles = {
    levels: 2,
    level1: 'categorie',
    level2: 'subCategory',
    requiresLevel2: false, // Mixto - la mayoría son directas
    
    categories: [
      // 🛋️ MEUBLES PRINCIPALES (DIRECTAS)
      { id: 'salon', name: 'Salon', emoji: '🛋️', hasSublevel: false },
      { id: 'chambres_coucher', name: 'Chambres à coucher', emoji: '🛏️', hasSublevel: false },
      { id: 'tables', name: 'Tables', emoji: '🪑', hasSublevel: false },
      { id: 'armoires_commodes', name: 'Armoires & Commodes', emoji: '🗄️', hasSublevel: false },
      { id: 'lits', name: 'Lits', emoji: '🛌', hasSublevel: false },
      { id: 'meubles_cuisine', name: 'Meubles de Cuisine', emoji: '🍳', hasSublevel: false },
      { id: 'bibliotheques_etageres', name: 'Bibliothèques & Etagères', emoji: '📚', hasSublevel: false },
      { id: 'chaises_fauteuils', name: 'Chaises & Fauteuils', emoji: '🪑', hasSublevel: false },
      { id: 'dressings', name: 'Dressings', emoji: '👔', hasSublevel: false },
      { id: 'meubles_salle_bain', name: 'Meubles salle de bain', emoji: '🚿', hasSublevel: false },
      { id: 'buffet', name: 'Buffet', emoji: '🍽️', hasSublevel: false },
      { id: 'tables_tv', name: 'Tables TV', emoji: '📺', hasSublevel: false },
      { id: 'table_pliante', name: 'Table pliante', emoji: '🪑', hasSublevel: false },
      { id: 'tables_manger', name: 'Tables à manger', emoji: '🍽️', hasSublevel: false },
      { id: 'tables_pc_bureaux', name: 'Tables PC & Bureaux', emoji: '💻', hasSublevel: false },
      { id: 'canape', name: 'Canapé', emoji: '🛋️', hasSublevel: false },
      { id: 'table_basse', name: 'Table basse', emoji: '🪑', hasSublevel: false },
      { id: 'rangement_organisation', name: 'Rangement et Organisation', emoji: '📦', hasSublevel: false },
      { id: 'accessoires_cuisine', name: 'Accessoires de cuisine', emoji: '🔪', hasSublevel: false },
      { id: 'meuble_entree', name: 'Meuble d\'entrée', emoji: '🚪', hasSublevel: false },
      
      // 🎨 CATEGORÍAS CON SUBNIVELES
      { id: 'decoration', name: 'Décoration', emoji: '🎨', hasSublevel: true },
      { id: 'vaisselle', name: 'Vaisselle', emoji: '🍽️', hasSublevel: true },
      { id: 'meubles_bureau', name: 'Meubles de bureau', emoji: '💼', hasSublevel: true },
      { id: 'puericulture', name: 'Puériculture', emoji: '👶', hasSublevel: true },
      { id: 'luminaire', name: 'Luminaire', emoji: '💡', hasSublevel: true },
      
      // 🏠 OTRAS CATEGORÍAS DIRECTAS
      { id: 'rideaux', name: 'Rideaux', emoji: '🪟', hasSublevel: false },
      { id: 'literie_linge', name: 'Literie & Linge', emoji: '🛌', hasSublevel: false },
      { id: 'tapis_moquettes', name: 'Tapis & Moquettes', emoji: '🧶', hasSublevel: false },
      { id: 'meubles_exterieur', name: 'Meubles d\'extérieur', emoji: '🌳', hasSublevel: false },
      { id: 'fournitures_scolaires', name: 'Fournitures et articles scolaires', emoji: '📚', hasSublevel: false },
      { id: 'autre_meubles', name: 'Autre', emoji: '🛋️', hasSublevel: false }
    ],
    
    subcategories: {
      // 🎨 DÉCORATION
      decoration: [
        { id: 'peinture_calligraphie', name: 'Peinture et calligraphie', emoji: '🖼️' },
        { id: 'decoration_cuisine', name: 'Décoration de cuisine', emoji: '🍳' },
        { id: 'coussins_housses', name: 'Coussins & Housses', emoji: '🛋️' },
        { id: 'deco_bain', name: 'Déco de Bain', emoji: '🚿' },
        { id: 'art_revetement_mural', name: 'Art et Revêtement Mural', emoji: '🎨' },
        { id: 'figurines_miniatures', name: 'Figurines et miniatures', emoji: '🗿' },
        { id: 'cadres', name: 'Cadres', emoji: '🖼️' },
        { id: 'horloges', name: 'Horloges', emoji: '⏰' },
        { id: 'autres_decoration', name: 'Autres décoration', emoji: '✨' }
      ],
      
      // 🍽️ VAISSELLE
      vaisselle: [
        { id: 'poeles_casseroles_marmites', name: 'Pôeles, Casseroles et Marmites', emoji: '🍳' },
        { id: 'cocottes', name: 'Cocottes', emoji: '🥘' },
        { id: 'plats_four_plateaux', name: 'Plats à four et Plateaux', emoji: '🍲' },
        { id: 'assiettes_bols', name: 'Assiettes et Bols', emoji: '🍽️' },
        { id: 'couverts_ustensiles', name: 'Couverts et ustensiles de cuisine', emoji: '🔪' },
        { id: 'services_boissons', name: 'Services à Boissons', emoji: '☕' },
        { id: 'boites_bocaux', name: 'Boites et bocaux', emoji: '🥫' },
        { id: 'accessoires_patisserie', name: 'Accessoires de pâtisserie', emoji: '🎂' },
        { id: 'vaisselles_artisanales', name: 'Vaisselles Artisanales', emoji: '🧱' },
        { id: 'gadget_cuisine', name: 'Gadget de cuisine', emoji: '⚙️' },
        { id: 'vaisselle_enfants', name: 'Vaisselle enfants', emoji: '👶' }
      ],
      
      // 💼 MEUBLES DE BUREAU
      meubles_bureau: [
        { id: 'bureaux_caissons', name: 'Bureaux & Caissons', emoji: '💼' },
        { id: 'chaises_bureau', name: 'Chaises', emoji: '🪑' },
        { id: 'armoires_rangements_bureau', name: 'Armoires & Rangements', emoji: '🗄️' },
        { id: 'accessoires_bureaux', name: 'Accessoires de bureaux', emoji: '📎' },
        { id: 'tables_reunion', name: 'Tables de réunion', emoji: '🤝' }
      ],
      
      // 👶 PUÉRICULTURE
      puericulture: [
        { id: 'poussette', name: 'Poussette', emoji: '👶' },
        { id: 'siege_auto', name: 'Siège Auto', emoji: '🚗' },
        { id: 'meubles_bebe', name: 'Meubles bébé', emoji: '🛏️' },
        { id: 'lit_bebe', name: 'Lit bébé', emoji: '🛌' },
        { id: 'chaise_bebe', name: 'Chaise bébé', emoji: '🪑' },
        { id: 'autres_puericulture', name: 'Autres', emoji: '👶' }
      ],
      
      // 💡 LUMINAIRE
      luminaire: [
        { id: 'lustre', name: 'Lustre', emoji: '💎' },
        { id: 'lampadaire', name: 'Lampadaire', emoji: '🛋️' },
        { id: 'eclairage_exterieur', name: 'Éclairage extérieur', emoji: '🌙' },
        { id: 'autres_luminaire', name: 'Autres', emoji: '💡' }
      ]
    }
  };
  
  export default categoryMeubles;