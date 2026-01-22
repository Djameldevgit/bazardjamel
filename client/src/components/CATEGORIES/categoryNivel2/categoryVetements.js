 const categoryVetements = {
    levels: 2,
    level1: 'categorie',
    level2: 'subCategory',
    requiresLevel2: true, // TODAS las categorías de nivel 1 tienen nivel 2
    
    categories: [
      // 🔹 CON NIVEL EXTRA (todas tienen subcategorías)
      { 
        id: 'vetements_homme', 
        name: 'Vêtements Homme', 
        emoji: '👨',
        hasSublevel: true 
      },
      { 
        id: 'vetements_femme', 
        name: 'Vêtements Femme', 
        emoji: '👩',
        hasSublevel: true 
      },
      { 
        id: 'chaussures_homme', 
        name: 'Chaussures Homme', 
        emoji: '👞',
        hasSublevel: true 
      },
      { 
        id: 'chaussures_femme', 
        name: 'Chaussures Femme', 
        emoji: '👠',
        hasSublevel: true 
      },
      { 
        id: 'garcons', 
        name: 'Garçons', 
        emoji: '👦',
        hasSublevel: true 
      },
      { 
        id: 'filles', 
        name: 'Filles', 
        emoji: '👧',
        hasSublevel: true 
      },
      { 
        id: 'bebe', 
        name: 'Bébé', 
        emoji: '👶',
        hasSublevel: true 
      },
      { 
        id: 'tenues_professionnelles', 
        name: 'Tenues professionnelles', 
        emoji: '👔',
        hasSublevel: false // Sin nivel extra (pasa directo)
      },
      { 
        id: 'sacs_valises', 
        name: 'Sacs & Valises', 
        emoji: '👜',
        hasSublevel: true 
      },
      { 
        id: 'montres', 
        name: 'Montres', 
        emoji: '⌚',
        hasSublevel: true 
      },
      { 
        id: 'lunettes', 
        name: 'Lunettes', 
        emoji: '👓',
        hasSublevel: true 
      },
      { 
        id: 'bijoux', 
        name: 'Bijoux', 
        emoji: '💍',
        hasSublevel: true 
      }
    ],
    
    subcategories: {
      // 🎯 VÊTEMENTS HOMME
      vetements_homme: [
        { id: 'hauts_chemises_homme', name: 'Hauts & Chemises', emoji: '👕' },
        { id: 'jeans_pantalons_homme', name: 'Jeans & Pantalons', emoji: '👖' },
        { id: 'shorts_pantacourts_homme', name: 'Shorts & Pantacourts', emoji: '🩳' },
        { id: 'vestes_gilets_homme', name: 'Vestes & Gilets', emoji: '🧥' },
        { id: 'costumes_blazers_homme', name: 'Costumes & Blazers', emoji: '🤵' },
        { id: 'survetements_homme', name: 'Survetements', emoji: '🏃‍♂️' },
        { id: 'kamiss_homme', name: 'Kamiss', emoji: '🕌' },
        { id: 'sous_vetements_homme', name: 'Sous vêtements', emoji: '🩲' },
        { id: 'pyjamas_homme', name: 'Pyjamas', emoji: '😴' },
        { id: 'maillots_bain_homme', name: 'Maillots de bain', emoji: '🏊‍♂️' },
        { id: 'casquettes_chapeaux_homme', name: 'Casquettes & Chapeaux', emoji: '🧢' },
        { id: 'chaussettes_homme', name: 'Chaussettes', emoji: '🧦' },
        { id: 'ceintures_homme', name: 'Ceintures', emoji: '⛓️' },
        { id: 'gants_homme', name: 'Gants', emoji: '🧤' },
        { id: 'cravates_homme', name: 'Cravates', emoji: '👔' },
        { id: 'autre_vetements_homme', name: 'Autre', emoji: '👚' }
      ],
      
      // 🎯 VÊTEMENTS FEMME
      vetements_femme: [
        { id: 'hauts_chemises_femme', name: 'Hauts & Chemises', emoji: '👚' },
        { id: 'jeans_pantalons_femme', name: 'Jeans & Pantalons', emoji: '👖' },
        { id: 'shorts_pantacourts_femme', name: 'Shorts & Pantacourts', emoji: '🩳' },
        { id: 'vestes_gilets_femme', name: 'Vestes & Gilets', emoji: '🧥' },
        { id: 'ensembles_femme', name: 'Ensembles', emoji: '👗' },
        { id: 'abayas_hijabs_femme', name: 'Abayas & Hijabs', emoji: '🧕' },
        { id: 'mariages_fetes_femme', name: 'Mariages & Fêtes', emoji: '💃' },
        { id: 'maternite_femme', name: 'Maternité', emoji: '🤰' },
        { id: 'robes_femme', name: 'Robes', emoji: '👗' },
        { id: 'jupes_femme', name: 'Jupes', emoji: '🩳' },
        { id: 'joggings_survetements_femme', name: 'Joggings & Survetements', emoji: '🏃‍♀️' },
        { id: 'leggings_femme', name: 'Leggings', emoji: '🦵' },
        { id: 'sous_vetements_lingerie_femme', name: 'Sous-vêtements & Lingerie', emoji: '👙' },
        { id: 'pyjamas_femme', name: 'Pyjamas', emoji: '😴' },
        { id: 'peignoirs_femme', name: 'Peignoirs', emoji: '🛀' },
        { id: 'maillots_bain_femme', name: 'Maillots de bain', emoji: '🏊‍♀️' },
        { id: 'casquettes_chapeaux_femme', name: 'Casquettes & Chapeaux', emoji: '🧢' },
        { id: 'chaussettes_collants_femme', name: 'Chaussettes & Collants', emoji: '🧦' },
        { id: 'foulards_echarpes_femme', name: 'Foulards & Echarpes', emoji: '🧣' },
        { id: 'ceintures_femme', name: 'Ceintures', emoji: '⛓️' },
        { id: 'gants_femme', name: 'Gants', emoji: '🧤' },
        { id: 'autre_vetements_femme', name: 'Autre', emoji: '👚' }
      ],
      
      // 🎯 CHAUSSURES HOMME
      chaussures_homme: [
        { id: 'basquettes_homme', name: 'Basquettes', emoji: '👟' },
        { id: 'bottes_homme', name: 'Bottes', emoji: '🥾' },
        { id: 'classiques_homme', name: 'Classiques', emoji: '👞' },
        { id: 'mocassins_homme', name: 'Mocassins', emoji: '👞' },
        { id: 'sandales_homme', name: 'Sandales', emoji: '🩴' },
        { id: 'tangues_pantoufles_homme', name: 'Tangues & Pantoufles', emoji: '🩴' },
        { id: 'autre_chaussures_homme', name: 'Autre', emoji: '👞' }
      ],
      
      // 🎯 CHAUSSURES FEMME
      chaussures_femme: [
        { id: 'basquettes_femme', name: 'Basquettes', emoji: '👟' },
        { id: 'sandales_femme', name: 'Sandales', emoji: '🩴' },
        { id: 'bottes_femme', name: 'Bottes', emoji: '🥾' },
        { id: 'escarpins_femme', name: 'Escarpins', emoji: '👠' },
        { id: 'ballerines_femme', name: 'Ballerines', emoji: '🩰' },
        { id: 'tangues_pantoufles_femme', name: 'Tangues & Pantoufles', emoji: '🩴' },
        { id: 'autre_chaussures_femme', name: 'Autre', emoji: '👠' }
      ],
      
      // 🎯 GARÇONS
      garcons: [
        { id: 'chaussures_garcons', name: 'Chaussures', emoji: '👟' },
        { id: 'hauts_chemises_garcons', name: 'Hauts & Chemises', emoji: '👕' },
        { id: 'pantalons_shorts_garcons', name: 'Pantalons & Shorts', emoji: '👖' },
        { id: 'vestes_gilets_garcons', name: 'Vestes & Gilets', emoji: '🧥' },
        { id: 'costumes_garcons', name: 'Costumes', emoji: '🤵' },
        { id: 'survetements_joggings_garcons', name: 'Survetements & Joggings', emoji: '🏃‍♂️' },
        { id: 'pyjamas_garcons', name: 'Pyjamas', emoji: '😴' },
        { id: 'sous_vetements_garcons', name: 'Sous-vêtements', emoji: '🩲' },
        { id: 'maillots_bain_garcons', name: 'Maillots de bain', emoji: '🏊‍♂️' },
        { id: 'kamiss_garcons', name: 'Kamiss', emoji: '🕌' },
        { id: 'casquettes_chapeaux_garcons', name: 'Casquettes & Chapeaux', emoji: '🧢' },
        { id: 'autre_garcons', name: 'Autre', emoji: '👦' }
      ],
      
      // 🎯 FILLES
      filles: [
        { id: 'chaussures_filles', name: 'Chaussures', emoji: '👟' },
        { id: 'hauts_chemises_filles', name: 'Hauts & Chemises', emoji: '👚' },
        { id: 'pantalons_shorts_filles', name: 'Pantalons & Shorts', emoji: '👖' },
        { id: 'vestes_gilets_filles', name: 'Vestes & Gilets', emoji: '🧥' },
        { id: 'robes_filles', name: 'Robes', emoji: '👗' },
        { id: 'jupes_filles', name: 'Jupes', emoji: '🩳' },
        { id: 'ensembles_filles', name: 'Ensembles', emoji: '👗' },
        { id: 'joggings_survetements_filles', name: 'Joggings & Survetements', emoji: '🏃‍♀️' },
        { id: 'pyjamas_filles', name: 'Pyjamas', emoji: '😴' },
        { id: 'sous_vetements_filles', name: 'Sous-vêtements', emoji: '👙' },
        { id: 'leggings_collants_filles', name: 'Leggings & Collants', emoji: '🦵' },
        { id: 'maillots_bain_filles', name: 'Maillots de bain', emoji: '🏊‍♀️' },
        { id: 'casquettes_chapeaux_filles', name: 'Casquettes & Chapeaux', emoji: '🧢' },
        { id: 'autre_filles', name: 'Autre', emoji: '👧' }
      ],
      
      // 🎯 BÉBÉ
      bebe: [
        { id: 'vetements_bebe', name: 'Vêtements', emoji: '👕' },
        { id: 'chaussures_bebe', name: 'Chaussures', emoji: '👟' },
        { id: 'accessoires_bebe', name: 'Accessoires', emoji: '🧸' }
      ],
      
      // 🎯 SACS & VALISES
      sacs_valises: [
        { id: 'pochettes_portefeuilles', name: 'Pochettes & Portefeuilles', emoji: '💼' },
        { id: 'sacs_main', name: 'Sacs à main', emoji: '👜' },
        { id: 'sacs_dos', name: 'Sacs à dos', emoji: '🎒' },
        { id: 'sacs_professionnels', name: 'Sacs professionnels', emoji: '💼' },
        { id: 'valises', name: 'Valises', emoji: '🧳' },
        { id: 'cabas_sport', name: 'Cabas de sport', emoji: '🏸' },
        { id: 'autre_sacs', name: 'Autre', emoji: '👜' }
      ],
      
      // 🎯 MONTRES
      montres: [
        { id: 'montres_hommes', name: 'Hommes', emoji: '⌚' },
        { id: 'montres_femmes', name: 'Femmes', emoji: '⌚' }
      ],
      
      // 🎯 LUNETTES
      lunettes: [
        { id: 'lunettes_vue_hommes', name: 'Lunettes de vue hommes', emoji: '👓' },
        { id: 'lunettes_vue_femmes', name: 'Lunettes de vue femmes', emoji: '👓' },
        { id: 'lunettes_soleil_hommes', name: 'Lunettes de soleil hommes', emoji: '🕶️' },
        { id: 'lunettes_soleil_femmes', name: 'Lunettes de soleil femmes', emoji: '🕶️' },
        { id: 'lunettes_vue_enfants', name: 'Lunettes de vue enfants', emoji: '👓' },
        { id: 'lunettes_soleil_enfants', name: 'Lunettes de soleil enfants', emoji: '🕶️' },
        { id: 'accessoires_lunettes', name: 'Accessoires', emoji: '🧰' }
      ],
      
      // 🎯 BIJOUX
      bijoux: [
        { id: 'parures', name: 'Parures', emoji: '👑' },
        { id: 'colliers_pendentifs', name: 'Colliers & Pendentifs', emoji: '📿' },
        { id: 'bracelets', name: 'Bracelets', emoji: '📿' },
        { id: 'bagues', name: 'Bagues', emoji: '💍' },
        { id: 'boucles', name: 'Boucles', emoji: '👂' },
        { id: 'chevilleres', name: 'Chevillières', emoji: '🦵' },
        { id: 'piercings', name: 'Piercings', emoji: '👃' },
        { id: 'accessoires_cheveux', name: 'Accessoires cheveux', emoji: '💇‍♀️' },
        { id: 'broches', name: 'Broches', emoji: '🧷' },
        { id: 'autre_bijoux', name: 'Autre', emoji: '💎' }
      ]
    }
  };
  export default categoryVetements