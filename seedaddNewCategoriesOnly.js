require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/categoryModel');

// 📦 NUEVAS CATEGORÍAS A AGREGAR (SOLO INSERTAR, NO ELIMINAR NADA)
const NEW_CATEGORIES = [
  {
    // 1. ALIMENTAIRES
    config: {
      name: "Alimentaires",
      slug: "alimentaires",
      emoji: "🍎",
      order: 6  // Después de Voyages (que es order: 5)
    },
    data: {
      levels: 2,
      level1: 'categorie',
      level2: 'subCategory',
      requiresLevel2: false,
      categories: [
        { id: 'produits_laitiers', name: 'Produits laitiers', emoji: '🥛', hasSublevel: false },
        { id: 'fruits_secs', name: 'Fruits secs', emoji: '🍇', hasSublevel: false },
        { id: 'graines_riz_cereales', name: 'Graines - Riz - Céréales', emoji: '🌾', hasSublevel: false },
        { id: 'sucres_produits_sucres', name: 'Sucres & Produits sucrés', emoji: '🍬', hasSublevel: false },
        { id: 'boissons', name: 'Boissons', emoji: '🥤', hasSublevel: false },
        { id: 'viandes_poissons', name: 'Viandes & Poissons', emoji: '🍖', hasSublevel: false },
        { id: 'cafe_the_infusion', name: 'Café - Thé - Infusion', emoji: '☕', hasSublevel: false },
        { id: 'complements_alimentaires', name: 'Compléments alimentaires', emoji: '💊', hasSublevel: false },
        { id: 'miel_derives', name: 'Miel & Dérivés', emoji: '🍯', hasSublevel: false },
        { id: 'fruits_legumes', name: 'Fruits & Légumes', emoji: '🥦', hasSublevel: false },
        { id: 'ble_farine', name: 'Blé & Farine', emoji: '🌾', hasSublevel: false },
        { id: 'bonbons_chocolat', name: 'Bonbons & Chocolat', emoji: '🍫', hasSublevel: false },
        { id: 'boulangerie_viennoiserie', name: 'Boulangerie & Viennoiserie', emoji: '🥐', hasSublevel: false },
        { id: 'ingredients_cuisine_patisserie', name: 'Ingrédients cuisine et pâtisserie', emoji: '🧂', hasSublevel: false },
        { id: 'noix_graines', name: 'Noix & Graines', emoji: '🥜', hasSublevel: false },
        { id: 'plats_cuisines', name: 'Plats cuisinés', emoji: '🍲', hasSublevel: false },
        { id: 'sauces_epices_condiments', name: 'Sauces - Epices - Condiments', emoji: '🌶️', hasSublevel: false },
        { id: 'oeufs', name: 'Œufs', emoji: '🥚', hasSublevel: false },
        { id: 'huiles', name: 'Huiles', emoji: '🫒', hasSublevel: false },
        { id: 'pates', name: 'Pâtes', emoji: '🍝', hasSublevel: false },
        { id: 'gateaux', name: 'Gateaux', emoji: '🎂', hasSublevel: false },
        { id: 'emballage', name: 'Emballage', emoji: '📦', hasSublevel: false },
        { id: 'aliments_bebe', name: 'Aliments pour bébé', emoji: '👶', hasSublevel: false },
        { id: 'aliments_dietetiques', name: 'Aliments diététiques', emoji: '🥗', hasSublevel: false },
        { id: 'autre_alimentaires', name: 'Autre Alimentaires', emoji: '🍎', hasSublevel: false }
      ],
      subcategories: {},
      properties: {}
    }
  },
  {
    // 2. INFORMATIQUE
    config: {
      name: "Informatique",
      slug: "informatique",
      emoji: "💻",
      order: 7  // Después de Alimentaires
    },
    data: {
      levels: 2,
      level1: 'categorie',
      level2: 'subCategory',
      requiresLevel2: false,
      categories: [
        // 📌 CON NIVEL 2
        { id: 'ordinateurs_portables', name: 'Ordinateurs portables', emoji: '💻', hasSublevel: true },
        { id: 'ordinateurs_bureau', name: 'Ordinateurs de bureau', emoji: '🖥️', hasSublevel: true },
        { id: 'composants_pc_fixe', name: 'Composants PC fixe', emoji: '⚙️', hasSublevel: true },
        { id: 'composants_pc_portable', name: 'Composants PC portable', emoji: '🔧', hasSublevel: true },
        { id: 'composants_serveur', name: 'Composants serveur', emoji: '🖧', hasSublevel: true },
        { id: 'imprimantes_cartouches', name: 'Imprimantes & Cartouches', emoji: '🖨️', hasSublevel: true },
        { id: 'reseau_connexion', name: 'Réseau & Connexion', emoji: '📶', hasSublevel: true },
        { id: 'stockage_externe', name: 'Stockage externe & Racks', emoji: '💾', hasSublevel: true },
        
        // 📌 SIN NIVEL 2 (DIRECTAS)
        { id: 'serveurs', name: 'Serveurs', emoji: '🖧', hasSublevel: false },
        { id: 'ecrans', name: 'Ecrans', emoji: '🖥️', hasSublevel: false },
        { id: 'onduleurs_stabilisateurs', name: 'Onduleurs & Stabilisateurs', emoji: '⚡', hasSublevel: false },
        { id: 'compteuses_billets', name: 'Compteuses de billets', emoji: '💰', hasSublevel: false },
        { id: 'claviers_souris', name: 'Claviers & Souris', emoji: '⌨️', hasSublevel: false },
        { id: 'casques_son', name: 'Casques & Son', emoji: '🎧', hasSublevel: false },
        { id: 'webcam_videoconference', name: 'Webcam & Vidéoconférence', emoji: '📹', hasSublevel: false },
        { id: 'data_shows', name: 'Data shows', emoji: '📊', hasSublevel: false },
        { id: 'cables_adaptateurs', name: 'Câbles & Adaptateurs', emoji: '🔌', hasSublevel: false },
        { id: 'stylers_tablettes', name: 'Stylets & Tablettes', emoji: '✏️', hasSublevel: false },
        { id: 'cartables_sacoches', name: 'Cartables & Sacoches', emoji: '🎒', hasSublevel: false },
        { id: 'manettes_simulateurs', name: 'Manettes & Simulateurs', emoji: '🎮', hasSublevel: false },
        { id: 'vr', name: 'VR', emoji: '🥽', hasSublevel: false },
        { id: 'logiciels_abonnements', name: 'Logiciels & Abonnements', emoji: '📀', hasSublevel: false },
        { id: 'bureautique', name: 'Bureautique', emoji: '📎', hasSublevel: false },
        { id: 'autre_informatique', name: 'Autre Informatique', emoji: '💡', hasSublevel: false }
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
    }
  },
  {
    // 3. PIÈCES DÉTACHÉES
    config: {
      name: "Pièces Détachées",
      slug: "pieces-detachees",
      emoji: "🔧",
      order: 8  // Después de Informatique
    },
    data: {
      levels: 2,
      level1: 'categorie',
      level2: 'subCategory',
      requiresLevel2: false,
      categories: [
        // 🚗 PIÈCES AUTOMOBILES (CON NIVEL 2)
        { id: 'pieces_automobiles', name: 'Pièces automobiles', emoji: '🚗', hasSublevel: true },
        
        // 🏍️ PIÈCES MOTO (CON NIVEL 2)
        { id: 'pieces_moto', name: 'Pièces moto', emoji: '🏍️', hasSublevel: true },
        
        // ⛵ PIÈCES BATEAUX (CON NIVEL 2)
        { id: 'pieces_bateaux', name: 'Pièces bateaux', emoji: '⛵', hasSublevel: true },
        
        // 🔐 ALARME & SÉCURITÉ (DIRECTO)
        { id: 'alarme_securite', name: 'Alarme & Sécurité', emoji: '🔐', hasSublevel: false },
        
        // 🧹 NETTOYAGE & ENTRETIEN (DIRECTO)
        { id: 'nettoyage_entretien', name: 'Nettoyage & Entretien', emoji: '🧹', hasSublevel: false },
        
        // 🔧 OUTILS DE DIAGNOSTICS (DIRECTO)
        { id: 'outils_diagnostics', name: 'Outils de diagnostics', emoji: '🔧', hasSublevel: false },
        
        // ⚗️ LUBRIFIANTS (DIRECTO)
        { id: 'lubrifiants', name: 'Lubrifiants', emoji: '⚗️', hasSublevel: false },
        
        // 🔌 PIÈCES VÉHICULES (DIRECTO - CATEGORÍA GENERAL)
        { id: 'pieces_vehicules', name: 'Pièces véhicules', emoji: '🔌', hasSublevel: false },
        
        // 🛠️ AUTRES PIÈCES (DIRECTO)
        { id: 'autres_pieces', name: 'Autres pièces', emoji: '🛠️', hasSublevel: false }
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
      }
    }
  },
  {
    // 4. LOISIRS
    config: {
      name: "Loisirs",
      slug: "loisirs",
      emoji: "🎮",
      order: 9  // Después de Pièces Détachées
    },
    data: {
      levels: 2,
      level1: 'categorie',
      level2: 'subCategory',
      requiresLevel2: false,
      categories: [
        // 🐾 CON NIVEL 2
        { id: 'animalerie', name: 'Animalerie', emoji: '🐾', hasSublevel: true },
        { id: 'consoles_jeux_videos', name: 'Consoles et Jeux Vidéos', emoji: '🎮', hasSublevel: true },
        { id: 'livres_magazines', name: 'Livres & Magazines', emoji: '📚', hasSublevel: true },
        { id: 'instruments_musique', name: 'Instruments de Musique', emoji: '🎵', hasSublevel: true },
        { id: 'jouets', name: 'Jouets', emoji: '🧸', hasSublevel: true },
        { id: 'chasse_peche', name: 'Chasse & Pêche', emoji: '🎣', hasSublevel: true },
        { id: 'jardinage', name: 'Jardinage', emoji: '🌱', hasSublevel: true },
        { id: 'jeux_loisirs', name: 'Les Jeux de loisirs', emoji: '♟️', hasSublevel: true },
        { id: 'barbecue_grillades', name: 'Barbecue & Grillades', emoji: '🍖', hasSublevel: true },
        { id: 'vapes_chichas', name: 'Vapes & Chichas', emoji: '💨', hasSublevel: true },
        { id: 'produits_accessoires_ete', name: 'Produits & Accessoires d\'été', emoji: '🏖️', hasSublevel: true },
        
        // 📜 SIN NIVEL 2 (DIRECTAS)
        { id: 'antiquites_collections', name: 'Antiquités & Collections', emoji: '🏺', hasSublevel: false },
        { id: 'autres_loisirs', name: 'Autre', emoji: '🎪', hasSublevel: false }
      ],
      subcategories: {
        // 🐾 ANIMALERIE
        animalerie: [
          { id: 'produits_soin_animal', name: 'Produits de soin animal', emoji: '💊' },
          { id: 'chien', name: 'Chien', emoji: '🐕' },
          { id: 'oiseau', name: 'Oiseau', emoji: '🐦' },
          { id: 'animaux_ferme', name: 'Animaux de ferme', emoji: '🐄' },
          { id: 'chat', name: 'Chat', emoji: '🐈' },
          { id: 'cheval', name: 'Cheval', emoji: '🐎' },
          { id: 'poisson', name: 'Poisson', emoji: '🐟' },
          { id: 'accessoire_animaux', name: 'Accessoire pour animaux', emoji: '🛁' },
          { id: 'nourriture_animaux', name: 'Nourriture pour animaux', emoji: '🍖' },
          { id: 'autres_animaux', name: 'Autres Animaux', emoji: '🐾' }
        ],
        
        // 🎮 CONSOLES ET JEUX VIDÉOS
        consoles_jeux_videos: [
          { id: 'consoles', name: 'Consoles', emoji: '🕹️' },
          { id: 'jeux_videos', name: 'Jeux videos', emoji: '🎮' },
          { id: 'accessoires_jeux', name: 'Accessoires', emoji: '🎧' }
        ],
        
        // 📚 LIVRES & MAGAZINES
        livres_magazines: [
          { id: 'litterature_philosophie', name: 'Littérature et philosophie', emoji: '📖' },
          { id: 'romans', name: 'Romans', emoji: '📚' },
          { id: 'scolaire_parascolaire', name: 'Scolaire & Parascolaire', emoji: '🎒' },
          { id: 'sciences_techniques_medecine', name: 'Sciences, techniques et medecine', emoji: '🔬' },
          { id: 'traduction', name: 'Traduction', emoji: '🌐' },
          { id: 'religion_spiritualites', name: 'Religion et Spiritualités', emoji: '🙏' },
          { id: 'historique', name: 'Historique', emoji: '🏛️' },
          { id: 'cuisine', name: 'Cuisine', emoji: '🍳' },
          { id: 'essais_documents', name: 'Essais et documents', emoji: '📄' },
          { id: 'fiction', name: 'Fiction', emoji: '📚' },
          { id: 'enfants', name: 'Enfants', emoji: '👶' },
          { id: 'mangas_bande_dessinee', name: 'Mangas et bande dessinée', emoji: '🇯🇵' }
        ],
        
        // 🎵 INSTRUMENTS DE MUSIQUE
        instruments_musique: [
          { id: 'instruments_electriques', name: 'Instruments électriques', emoji: '🎸' },
          { id: 'instruments_percussion', name: 'Instruments à percussion : les idiophones', emoji: '🥁' },
          { id: 'instruments_vent', name: 'Instruments a vent', emoji: '🎺' },
          { id: 'instruments_cordes', name: 'Instruments à cordes', emoji: '🎻' },
          { id: 'autre_instruments', name: 'Autre', emoji: '🎵' }
        ],
        
        // 🧸 JOUETS
        jouets: [
          { id: 'jeux_eveil', name: 'Jeux d\'éveil', emoji: '🧠' },
          { id: 'poupees_peluches', name: 'Poupées - Peluches', emoji: '🧸' },
          { id: 'personnages_deguisements', name: 'Personnages - Déguisements', emoji: '🦸' },
          { id: 'jeux_educatifs_puzzle', name: 'Jeux éducatifs - Puzzle', emoji: '🧩' },
          { id: 'vehicules_circuits', name: 'Véhicules et Circuits', emoji: '🚗' },
          { id: 'jeux_electroniques', name: 'Jeux électroniques', emoji: '🕹️' },
          { id: 'construction_outils', name: 'Construction et Outils', emoji: '🧱' },
          { id: 'jeux_plein_air', name: 'Jeux de plein air', emoji: '⚽' },
          { id: 'animaux_jouets', name: 'Animaux', emoji: '🐻' }
        ],
        
        // 🎣 CHASSE & PÊCHE
        chasse_peche: [
          { id: 'canne_peche', name: 'Canne à pêche', emoji: '🎣' },
          { id: 'moulinets', name: 'Moulinets', emoji: '🎣' },
          { id: 'sondeurs_gps', name: 'Sondeurs-GPS', emoji: '📡' },
          { id: 'vetements_chasse_peche', name: 'Vêtements', emoji: '🧥' },
          { id: 'accessoires_peche', name: 'Accessoires de pêche', emoji: '🎒' },
          { id: 'materiel_plongee', name: 'Matériel plongée', emoji: '🤿' },
          { id: 'equipements_chasse', name: 'Equipements de chasse', emoji: '🔫' }
        ],
        
        // 🌱 JARDINAGE
        jardinage: [
          { id: 'mobilier_jardin', name: 'Mobilier de jardin', emoji: '🪑' },
          { id: 'semence', name: 'Semence', emoji: '🌱' },
          { id: 'outillage_arrosage', name: 'Outillage-Arrosage du jardin', emoji: '🚿' },
          { id: 'plantes_fleurs', name: 'Plantes et fleurs', emoji: '🌺' },
          { id: 'equipements_materiels_jardin', name: 'Équipements Et Matériels', emoji: '🛠️' },
          { id: 'insecticide', name: 'Insecticide', emoji: '🐛' },
          { id: 'decoration_jardin', name: 'Décoration', emoji: '🎍' },
          { id: 'livres_agriculture_jardin', name: 'Livres D\'Agriculture Et De Jardinage', emoji: '📚' }
        ],
        
        // ♟️ LES JEUX DE LOISIRS
        jeux_loisirs: [
          { id: 'babyfoot', name: 'Babyfoot', emoji: '⚽' },
          { id: 'billiard', name: 'Billiard', emoji: '🎱' },
          { id: 'ping_pong', name: 'Ping pong', emoji: '🏓' },
          { id: 'echecs', name: 'Échecs', emoji: '♟️' },
          { id: 'jeux_societe', name: 'Jeux De Société', emoji: '🎲' },
          { id: 'autres_jeux_loisirs', name: 'Autres Jeux De Loisirs', emoji: '🎯' }
        ],
        
        // 🍖 BARBECUE & GRILLADES
        barbecue_grillades: [
          { id: 'barbecue', name: 'Barbecue', emoji: '🔥' },
          { id: 'charbon', name: 'Charbon', emoji: '⚫' },
          { id: 'accessoires_barbecue', name: 'Accessoires', emoji: '🍴' }
        ],
        
        // 💨 VAPES & CHICHAS
        vapes_chichas: [
          { id: 'vapes_cigarettes_electroniques', name: 'Vapes & Cigarettes électroniques', emoji: '🚬' },
          { id: 'chichas', name: 'Chichas', emoji: '💨' },
          { id: 'consommables', name: 'Consommables', emoji: '🫙' },
          { id: 'accessoires_vapes', name: 'Accessoires', emoji: '🔧' }
        ],
        
        // 🏖️ PRODUITS & ACCESSOIRES D'ÉTÉ
        produits_accessoires_ete: [
          { id: 'piscines', name: 'Piscines', emoji: '🏊' },
          { id: 'matelas_gonflables', name: 'Matelas gonflables', emoji: '🛏️' },
          { id: 'parasols', name: 'Parasols', emoji: '⛱️' },
          { id: 'transats_chaises_pliables', name: 'Transats & Chaises pliables', emoji: '🪑' },
          { id: 'tables_ete', name: 'Tables', emoji: '🪑' },
          { id: 'autres_accessoires_ete', name: 'Autres', emoji: '☀️' }
        ]
      }
    }
  }
];

async function addNewCategories() {
  try {
    // 1. Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace');
    console.log('✅ MongoDB conectado');
    
    // 2. Verificar categorías existentes para calcular order correcto
    console.log('\n🔍 Verificando categorías existentes...');
    const existingCategories = await Category.find({ level: 1 }).sort({ order: 1 });
    
    console.log(`📊 Categorías principales existentes: ${existingCategories.length}`);
    existingCategories.forEach(cat => {
      console.log(`   • ${cat.emoji} ${cat.name} (order: ${cat.order}, slug: ${cat.slug})`);
    });
    
    // 3. Calcular el próximo order disponible
    const maxOrder = existingCategories.length > 0 
      ? Math.max(...existingCategories.map(c => c.order)) 
      : 0;
    
    console.log(`\n📌 Último order encontrado: ${maxOrder}`);
    
    // 4. Procesar cada nueva categoría (SOLO INSERTAR)
    let totalAdded = 0;
    let skipped = 0;
    
    for (const newCategory of NEW_CATEGORIES) {
      const { config, data } = newCategory;
      
      console.log(`\n📦 Procesando: ${config.emoji} ${config.name}`);
      
      // Verificar si ya existe (para no duplicar)
      const exists = await Category.findOne({ slug: config.slug, level: 1 });
      if (exists) {
        console.log(`   ⚠️ Ya existe en MongoDB, omitiendo...`);
        skipped++;
        continue;
      }
      
      // Ajustar order automáticamente (por si hay conflictos)
      let finalOrder = config.order;
      const orderExists = existingCategories.some(cat => cat.order === finalOrder);
      if (orderExists) {
        finalOrder = maxOrder + 1;
        console.log(`   ⚠️ Order ${config.order} ya está ocupado, usando: ${finalOrder}`);
      }
      
      // Insertar categoría principal
      console.log(`   ➕ Insertando categoría principal (order: ${finalOrder})...`);
      
      const mainCat = new Category({
        name: config.name,
        slug: config.slug,
        emoji: config.emoji,
        level: 1,
        parent: null,
        ancestors: [],
        path: config.slug,
        order: finalOrder,
        hasChildren: data.categories.length > 0,
        isLeaf: false
      });
      
      const savedMain = await mainCat.save();
      totalAdded++;
      
      // 5. Insertar subcategorías (nivel 2)
      console.log(`   📂 Insertando ${data.categories.length} subcategorías...`);
      let subcatCount = 0;
      
      for (const subcat of data.categories) {
        const childSlug = `${config.slug}-${subcat.id}`;
        
        // Verificar si subcategoría ya existe
        const subcatExists = await Category.findOne({ slug: childSlug, level: 2 });
        if (subcatExists) {
          console.log(`   ⚠️ Subcategoría ${subcat.name} ya existe, omitiendo...`);
          continue;
        }
        
        const childCat = new Category({
          name: subcat.name,
          slug: childSlug,
          emoji: subcat.emoji,
          level: 2,
          parent: savedMain._id,
          ancestors: [savedMain._id],
          path: `${config.slug}/${subcat.id}`,
          order: subcat.order || subcatCount + 1,
          hasChildren: subcat.hasSublevel,
          isLeaf: !subcat.hasSublevel
        });
        
        const savedChild = await childCat.save();
        subcatCount++;
        
        // 6. Insertar artículos (nivel 3) si tiene subniveles
        if (subcat.hasSublevel && data.subcategories[subcat.id]) {
          const articles = data.subcategories[subcat.id];
          let articleCount = 0;
          
          for (const article of articles) {
            const articleSlug = `${childSlug}-${article.id}`;
            
            // Verificar si artículo ya existe
            const articleExists = await Category.findOne({ slug: articleSlug, level: 3 });
            if (articleExists) {
              console.log(`   ⚠️ Artículo ${article.name} ya existe, omitiendo...`);
              continue;
            }
            
            const articleCat = new Category({
              name: article.name,
              slug: articleSlug,
              emoji: article.emoji,
              level: 3,
              parent: savedChild._id,
              ancestors: [savedMain._id, savedChild._id],
              path: `${config.slug}/${subcat.id}/${article.id}`,
              order: articleCount + 1,
              hasChildren: false,
              isLeaf: true
            });
            
            await articleCat.save();
            articleCount++;
          }
          
          console.log(`     ├── ${subcat.name}: ${articles.length} artículos insertados`);
        } else {
          console.log(`     ├── ${subcat.name} (directa)`);
        }
      }
      
      console.log(`   ✅ ${config.name}: ${subcatCount} subcategorías insertadas`);
    }
    
    // 7. Mostrar resumen final
    console.log('\n' + '='.repeat(60));
    console.log('🎉 ¡INSERCIÓN COMPLETADA!');
    console.log('='.repeat(60));
    console.log(`✅ Nuevas categorías agregadas: ${totalAdded}`);
    console.log(`⏭️ Categorías omitidas (ya existían): ${skipped}`);
    
    // 8. Mostrar estructura completa actualizada
    console.log('\n📋 ESTRUCTURA COMPLETA DE CATEGORÍAS:');
    const finalCategories = await Category.find({ level: 1 }).sort({ order: 1 });
    
    for (const cat of finalCategories) {
      const children = await Category.countDocuments({ parent: cat._id });
      const grandchildren = await Category.countDocuments({ 
        ancestors: cat._id,
        level: 3 
      });
      
      console.log(`${cat.order}. ${cat.emoji} ${cat.name}: ${children} subcategorías, ${grandchildren} artículos`);
    }
    
    console.log(`\n📊 TOTAL EN BASE DE DATOS: ${await Category.countDocuments()} categorías`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error durante la inserción:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  addNewCategories();
}

module.exports = { addNewCategories, NEW_CATEGORIES };