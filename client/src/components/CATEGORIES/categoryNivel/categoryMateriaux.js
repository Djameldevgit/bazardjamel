// 📂 components/CATEGORIES/categoryNivel/categoryMateriaux.js

const categoryMateriaux = {
    levels: 2,
    level1: 'categorie',
    level2: 'subcategory',
    requiresLevel2: false, // Mixto
    
    categories: [
      // 🔧 CON NIVEL 2
      { id: 'materiel_professionnel', name: 'Matériel professionnel', emoji: '🏭', hasSublevel: true },
      { id: 'outillage_professionnel', name: 'Outillage professionnel', emoji: '🛠️', hasSublevel: true },
      { id: 'materiel_agricole', name: 'Matériel Agricole', emoji: '🚜', hasSublevel: true },
      
      // 🧱 SIN NIVEL 2 (DIRECTAS)
      { id: 'materiaux_construction', name: 'Materiaux de construction', emoji: '🧱', hasSublevel: false },
      { id: 'matieres_premieres', name: 'Matières premières', emoji: '⚗️', hasSublevel: false },
      { id: 'produits_hygiene', name: 'Produits d\'hygiène', emoji: '🧼', hasSublevel: false },
      { id: 'autre_materiaux', name: 'Autre', emoji: '📦', hasSublevel: false }
    ],
    
    subcategories: {
      // 🏭 MATÉRIEL PROFESSIONNEL
      materiel_professionnel: [
        { id: 'industrie_fabrication', name: 'Industrie & Fabrication', emoji: '🏭' },
        { id: 'alimentaire_restauration', name: 'Alimentaire et Restauration', emoji: '🍽️' },
        { id: 'medical', name: 'Medical', emoji: '🏥' },
        { id: 'batiment_construction', name: 'Batiment & Construction', emoji: '🏗️' },
        { id: 'materiel_electrique', name: 'Matériel électrique', emoji: '⚡' },
        { id: 'ateliers', name: 'Ateliers', emoji: '🔧' },
        { id: 'stockage_magasinage', name: 'Stockage et magasinage', emoji: '📦' },
        { id: 'equipement_protection', name: 'Équipement de protection', emoji: '🛡️' },
        { id: 'agriculture', name: 'Agriculture', emoji: '🌾' },
        { id: 'reparation_diagnostic', name: 'Réparation & Diagnostic', emoji: '🔍' },
        { id: 'commerce_detail', name: 'Commerce de détail', emoji: '🏪' },
        { id: 'coiffure_cosmetologie', name: 'Coiffure et cosmétologie', emoji: '💇' },
        { id: 'autres_materiel_pro', name: 'Autres matériels pro', emoji: '🛠️' }
      ],
      
      // 🛠️ OUTILLAGE PROFESSIONNEL
      outillage_professionnel: [
        { id: 'perceuse', name: 'Perceuse', emoji: '🔩' },
        { id: 'meuleuse', name: 'Meuleuse', emoji: '⚙️' },
        { id: 'outillage_main', name: 'Outillage à main', emoji: '🔨' },
        { id: 'scie', name: 'Scie', emoji: '🪚' },
        { id: 'autres_outillage', name: 'Autres', emoji: '🛠️' }
      ],
      
      // 🚜 MATÉRIEL AGRICOLE
      materiel_agricole: [
        { id: 'equipement_agricole', name: 'Equipement agricole', emoji: '🚜' },
        { id: 'arbres', name: 'Arbres', emoji: '🌳' },
        { id: 'terrain_agricole', name: 'Terrain Agricole', emoji: '🌾' },
        { id: 'autre_agricole', name: 'Autre', emoji: '🌱' }
      ]
    }
  };
  
  export default categoryMateriaux;