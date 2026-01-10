// 📂 components/CATEGORIES/categoryNivel/categoryPiecesDetachees.js

const categoryPiecesDetachees = {
    levels: 2,
    level1: 'categorie',
    level2: 'subCategory',
    requiresLevel2: false, // Mixto - algunas necesitan, otras no
    
    categories: [
      // 🚗 PIÈCES AUTOMOBILES (CON NIVEL 2)
      { 
        id: 'pieces_automobiles', 
        name: 'Pièces automobiles', 
        emoji: '🚗', 
        hasSublevel: true 
      },
      
      // 🏍️ PIÈCES MOTO (CON NIVEL 2)
      { 
        id: 'pieces_moto', 
        name: 'Pièces moto', 
        emoji: '🏍️', 
        hasSublevel: true 
      },
      
      // ⛵ PIÈCES BATEAUX (CON NIVEL 2)
      { 
        id: 'pieces_bateaux', 
        name: 'Pièces bateaux', 
        emoji: '⛵', 
        hasSublevel: true 
      },
      
      // 🔐 ALARME & SÉCURITÉ (DIRECTO)
      { 
        id: 'alarme_securite', 
        name: 'Alarme & Sécurité', 
        emoji: '🔐', 
        hasSublevel: false 
      },
      
      // 🧹 NETTOYAGE & ENTRETIEN (DIRECTO)
      { 
        id: 'nettoyage_entretien', 
        name: 'Nettoyage & Entretien', 
        emoji: '🧹', 
        hasSublevel: false 
      },
      
      // 🔧 OUTILS DE DIAGNOSTICS (DIRECTO)
      { 
        id: 'outils_diagnostics', 
        name: 'Outils de diagnostics', 
        emoji: '🔧', 
        hasSublevel: false 
      },
      
      // ⚗️ LUBRIFIANTS (DIRECTO)
      { 
        id: 'lubrifiants', 
        name: 'Lubrifiants', 
        emoji: '⚗️', 
        hasSublevel: false 
      },
      
      // 🔌 PIÈCES VÉHICULES (DIRECTO - CATEGORÍA GENERAL)
      { 
        id: 'pieces_vehicules', 
        name: 'Pièces véhicules', 
        emoji: '🔌', 
        hasSublevel: false 
      },
      
      // 🛠️ AUTRES PIÈCES (DIRECTO)
      { 
        id: 'autres_pieces', 
        name: 'Autres pièces', 
        emoji: '🛠️', 
        hasSublevel: false 
      }
    ],
    
    subcategories: {
      // 🚗 SUBCATÉGORIES POUR PIÈCES AUTOMOBILES
      pieces_automobiles: [
        { id: 'moteur_transmission', name: 'Moteur & Transmission', emoji: '⚙️' },
        { id: 'suspension_direction', name: 'Suspension & Direction', emoji: '🔄' },
        { id: 'pieces_interieur', name: 'Pièces intérieur', emoji: '🚘' },
        { id: 'carrosserie', name: 'Carrosserie', emoji: '🚙' },
        { id: 'optiques_eclairage', name: 'Optiques & Éclairage', emoji: '💡' },
        { id: 'vitres_pare_brise', name: 'Vitres & pare-brise', emoji: '🚪' },
        { id: 'pneus_jantes', name: 'Pneus & Jantes', emoji: '🛞' },
        { id: 'housses_tapis', name: 'Housses & Tapis', emoji: '🎭' },
        { id: 'batteries', name: 'Batteries', emoji: '🔋' },
        { id: 'sono_multimedia', name: 'Sono & Multimédia', emoji: '🎵' },
        { id: 'sieges_auto', name: 'Sièges auto', emoji: '💺' },
        { id: 'autre_pieces_auto', name: 'Autres pièces auto', emoji: '🔧' }
      ],
      
      // 🏍️ SUBCATÉGORIES POUR PIÈCES MOTO
      pieces_moto: [
        { id: 'casques_protections', name: 'Casques & Protections', emoji: '🪖' },
        { id: 'pneus_jantes_moto', name: 'Pneus & Jantes', emoji: '🛞' },
        { id: 'optiques_eclairage_moto', name: 'Optiques & Éclairage', emoji: '💡' },
        { id: 'accessoires_moto', name: 'Accessoires', emoji: '🔧' },
        { id: 'autre_pieces_moto', name: 'Autres pièces moto', emoji: '🏍️' }
      ],
      
      // ⛵ SUBCATÉGORIES POUR PIÈCES BATEAUX
      pieces_bateaux: [
        { id: 'moteurs_bateaux', name: 'Moteurs', emoji: '⚙️' },
        { id: 'pieces_bateaux', name: 'Pièces', emoji: '🔩' },
        { id: 'accessoires_bateaux', name: 'Accessoires', emoji: '⚓' },
        { id: 'autre_pieces_bateaux', name: 'Autres pièces bateaux', emoji: '⛵' }
      ]
    },
    
    // ⭐ CONEXIÓN DIRECTA CON COMPONENTE
    component: 'PiecesDetacheesFields'
  };
  
  export default categoryPiecesDetachees;