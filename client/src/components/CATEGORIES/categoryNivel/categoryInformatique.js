// 📂 components/CATEGORIES/categoryNivel/categoryInformatique.js

const categoryInformatique = {
    levels: 2,
    level1: 'categorie',
    level2: 'subCategory',
    requiresLevel2: false, // Mixto - algunas necesitan, otras no
    
    categories: [
      // 📌 CON NIVEL 2
      { 
        id: 'ordinateurs_portables', 
        name: 'Ordinateurs portables', 
        emoji: '💻', 
        hasSublevel: true 
      },
      { 
        id: 'ordinateurs_bureau', 
        name: 'Ordinateurs de bureau', 
        emoji: '🖥️', 
        hasSublevel: true 
      },
      { 
        id: 'composants_pc_fixe', 
        name: 'Composants PC fixe', 
        emoji: '⚙️', 
        hasSublevel: true 
      },
      { 
        id: 'composants_pc_portable', 
        name: 'Composants PC portable', 
        emoji: '🔧', 
        hasSublevel: true 
      },
      { 
        id: 'composants_serveur', 
        name: 'Composants serveur', 
        emoji: '🖧', 
        hasSublevel: true 
      },
      { 
        id: 'imprimantes_cartouches', 
        name: 'Imprimantes & Cartouches', 
        emoji: '🖨️', 
        hasSublevel: true 
      },
      { 
        id: 'reseau_connexion', 
        name: 'Réseau & Connexion', 
        emoji: '📶', 
        hasSublevel: true 
      },
      { 
        id: 'stockage_externe', 
        name: 'Stockage externe & Racks', 
        emoji: '💾', 
        hasSublevel: true 
      },
      
      // 📌 SIN NIVEL 2 (DIRECTAS)
      { 
        id: 'serveurs', 
        name: 'Serveurs', 
        emoji: '🖧', 
        hasSublevel: false 
      },
      { 
        id: 'ecrans', 
        name: 'Ecrans', 
        emoji: '🖥️', 
        hasSublevel: false 
      },
      { 
        id: 'onduleurs_stabilisateurs', 
        name: 'Onduleurs & Stabilisateurs', 
        emoji: '⚡', 
        hasSublevel: false 
      },
      { 
        id: 'compteuses_billets', 
        name: 'Compteuses de billets', 
        emoji: '💰', 
        hasSublevel: false 
      },
      { 
        id: 'claviers_souris', 
        name: 'Claviers & Souris', 
        emoji: '⌨️', 
        hasSublevel: false 
      },
      { 
        id: 'casques_son', 
        name: 'Casques & Son', 
        emoji: '🎧', 
        hasSublevel: false 
      },
      { 
        id: 'webcam_videoconference', 
        name: 'Webcam & Vidéoconférence', 
        emoji: '📹', 
        hasSublevel: false 
      },
      { 
        id: 'data_shows', 
        name: 'Data shows', 
        emoji: '📊', 
        hasSublevel: false 
      },
      { 
        id: 'cables_adaptateurs', 
        name: 'Câbles & Adaptateurs', 
        emoji: '🔌', 
        hasSublevel: false 
      },
      { 
        id: 'stylers_tablettes', 
        name: 'Stylets & Tablettes', 
        emoji: '✏️', 
        hasSublevel: false 
      },
      { 
        id: 'cartables_sacoches', 
        name: 'Cartables & Sacoches', 
        emoji: '🎒', 
        hasSublevel: false 
      },
      { 
        id: 'manettes_simulateurs', 
        name: 'Manettes & Simulateurs', 
        emoji: '🎮', 
        hasSublevel: false 
      },
      { 
        id: 'vr', 
        name: 'VR', 
        emoji: '🥽', 
        hasSublevel: false 
      },
      { 
        id: 'logiciels_abonnements', 
        name: 'Logiciels & Abonnements', 
        emoji: '📀', 
        hasSublevel: false 
      },
      { 
        id: 'bureautique', 
        name: 'Bureautique', 
        emoji: '📎', 
        hasSublevel: false 
      },
      { 
        id: 'autre_informatique', 
        name: 'Autre Informatique', 
        emoji: '💡', 
        hasSublevel: false 
      }
    ],
    
    subcategories: {
      // 💻 ORDINATEURS PORTABLES
      ordinateurs_portables: [
        { id: 'pc_portable', name: 'Pc Portable', emoji: '💻' },
        { id: 'macbooks', name: 'Macbooks', emoji: '🍎' }
      ],
      
      // 🖥️ ORDINATEURS DE BUREAU
      ordinateurs_bureau: [
        { id: 'pc_bureau', name: 'Pc de bureau', emoji: '🖥️' },
        { id: 'unites_centrales', name: 'Unités centrales', emoji: '🖥️' },
        { id: 'all_in_one', name: 'All In One', emoji: '🖥️' }
      ],
      
      // ⚙️ COMPOSANTS PC FIXE
      composants_pc_fixe: [
        { id: 'cartes_mere', name: 'Cartes mère', emoji: '🔌' },
        { id: 'processeurs', name: 'Processeurs', emoji: '⚡' },
        { id: 'ram', name: 'RAM', emoji: '💾' },
        { id: 'disques_dur', name: 'Disques dur', emoji: '💿' },
        { id: 'cartes_graphique', name: 'Cartes graphique', emoji: '🎮' },
        { id: 'alimentations_boitiers', name: 'Alimentations & Boitiers', emoji: '🔋' },
        { id: 'refroidissement', name: 'Refroidissement', emoji: '❄️' },
        { id: 'lecteurs_graveurs_cd', name: 'Lecteurs & Graveurs CD', emoji: '📀' },
        { id: 'autres_composants_fixe', name: 'Autres', emoji: '🔧' }
      ],
      
      // 🔧 COMPOSANTS PC PORTABLE
      composants_pc_portable: [
        { id: 'chargeurs', name: 'Chargeurs', emoji: '🔌' },
        { id: 'batteries', name: 'Batteries', emoji: '🔋' },
        { id: 'ecrans_portable', name: 'Ecrans', emoji: '🖥️' },
        { id: 'claviers_touchpads', name: 'Claviers & Touchpads', emoji: '⌨️' },
        { id: 'disques_dur_portable', name: 'Disques Dur', emoji: '💿' },
        { id: 'ram_portable', name: 'RAM', emoji: '💾' },
        { id: 'refroidissement_portable', name: 'Refroidissement', emoji: '❄️' },
        { id: 'cartes_mere_portable', name: 'Cartes mère', emoji: '🔌' },
        { id: 'processeurs_portable', name: 'Processeurs', emoji: '⚡' },
        { id: 'cartes_graphique_portable', name: 'Cartes graphique', emoji: '🎮' },
        { id: 'lecteurs_graveurs_portable', name: 'Lecteurs & Graveurs', emoji: '📀' },
        { id: 'baffles_webcams', name: 'Baffles & Webcams', emoji: '🎤' },
        { id: 'autres_composants_portable', name: 'Autres', emoji: '🔧' }
      ],
      
      // 🖧 COMPOSANTS SERVEUR
      composants_serveur: [
        { id: 'cartes_mere_serveur', name: 'Cartes mère', emoji: '🔌' },
        { id: 'processeurs_serveur', name: 'Processeurs', emoji: '⚡' },
        { id: 'ram_serveur', name: 'RAM', emoji: '💾' },
        { id: 'disques_dur_serveur', name: 'Disques dur', emoji: '💿' },
        { id: 'cartes_reseau', name: 'Cartes réseau', emoji: '📶' },
        { id: 'alimentations_serveur', name: 'Alimentations', emoji: '🔋' },
        { id: 'refroidissement_serveur', name: 'Refroidissement', emoji: '❄️' },
        { id: 'cartes_graphique_serveur', name: 'Cartes graphique', emoji: '🎮' },
        { id: 'autres_composants_serveur', name: 'Autres', emoji: '🔧' }
      ],
      
      // 🖨️ IMPRIMANTES & CARTOUCHES
      imprimantes_cartouches: [
        { id: 'imprimantes_jet_encre', name: 'Imprimantes jet d\'encre', emoji: '🖨️' },
        { id: 'imprimantes_laser', name: 'Imprimantes Laser', emoji: '🖨️' },
        { id: 'imprimantes_matricielles', name: 'Imprimantes matricielles', emoji: '🖨️' },
        { id: 'codes_barre_etiqueteuses', name: 'Codes à barre & Etiqueteuses', emoji: '🏷️' },
        { id: 'imprimantes_photo_badges', name: 'Imprimantes photo & badges', emoji: '🖼️' },
        { id: 'photocopieuses_professionnelles', name: 'Photocopieuses professionnelles', emoji: '📠' },
        { id: 'imprimantes_3d', name: 'Imprimantes 3D', emoji: '🖨️' },
        { id: 'cartouches_toners', name: 'Cartouches & Toners', emoji: '🎨' },
        { id: 'autre_imprimantes', name: 'Autre', emoji: '🖨️' }
      ],
      
      // 📶 RÉSEAU & CONNEXION
      reseau_connexion: [
        { id: 'modems_routeurs', name: 'Modems & Routeurs', emoji: '📡' },
        { id: 'switchs', name: 'Switchs', emoji: '🔀' },
        { id: 'point_acces_wifi', name: 'Point d\'accès wifi', emoji: '📶' },
        { id: 'repeater_wifi', name: 'Répéteur Wi-Fi', emoji: '📶' },
        { id: 'cartes_reseau_connexion', name: 'Cartes réseau', emoji: '📡' },
        { id: 'autre_reseau', name: 'Autre', emoji: '📶' }
      ],
      
      // 💾 STOCKAGE EXTERNE & RACKS
      stockage_externe: [
        { id: 'disques_durs_externes', name: 'Disques durs', emoji: '💿' },
        { id: 'flash_disque', name: 'Flash disque', emoji: '💾' },
        { id: 'carte_memoire', name: 'Carte mémoire', emoji: '📋' },
        { id: 'rack', name: 'Rack', emoji: '🗄️' }
      ]
    }
  };
  
  export default categoryInformatique;