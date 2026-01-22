// 📂 components/CATEGORIES/categoryNivel/categoryServices.js

const categoryServices = {
    // ⭐ MISMA ESTRUCTURA QUE VEHICULES
    levels: 2,
    level1: 'categorie',
    level2: 'subCategory',
    requiresLevel2: false, // Todas son directas
    
    // 🛠️ CATEGORÍAS PRINCIPALES (Nivel 1) - TODAS DIRECTAS
    categories: [
      { id: 'construction_travaux', name: 'Construction & Travaux', emoji: '🏗️', hasSublevel: false },
      { id: 'ecoles_formations', name: 'Ecoles & Formations', emoji: '🎓', hasSublevel: false },
      { id: 'industrie_fabrication', name: 'Industrie & Fabrication', emoji: '🏭', hasSublevel: false },
      { id: 'transport_demenagement', name: 'Transport et déménagement', emoji: '🚚', hasSublevel: false },
      { id: 'decoration_amenagement', name: 'Décoration & Aménagement', emoji: '🎨', hasSublevel: false },
      { id: 'publicite_communication', name: 'Publicite & Communication', emoji: '📢', hasSublevel: false },
      { id: 'nettoyage_jardinage', name: 'Nettoyage & Jardinage', emoji: '🧹', hasSublevel: false },
      { id: 'froid_climatisation', name: 'Froid & Climatisation', emoji: '❄️', hasSublevel: false },
      { id: 'traiteurs_gateaux', name: 'Traiteurs & Gateaux', emoji: '🍰', hasSublevel: false },
      { id: 'medecine_sante', name: 'Médecine & Santé', emoji: '🏥', hasSublevel: false },
      { id: 'reparation_auto_diagnostic', name: 'Réparation auto & Diagnostic', emoji: '🔧', hasSublevel: false },
      { id: 'securite_alarme', name: 'Sécurité & Alarme', emoji: '🚨', hasSublevel: false },
      { id: 'projets_etudes', name: 'Projets & Études', emoji: '📊', hasSublevel: false },
      { id: 'bureautique_internet', name: 'Bureautique & Internet', emoji: '💻', hasSublevel: false },
      { id: 'location_vehicules', name: 'Location de véhicules', emoji: '🚗', hasSublevel: false },
      { id: 'menuiserie_meubles', name: 'Menuiserie & Meubles', emoji: '🪚', hasSublevel: false },
      { id: 'impression_edition', name: 'Impression & Edition', emoji: '🖨️', hasSublevel: false },
      { id: 'hotellerie_restauration_salles', name: 'Hôtellerie & Restauration & Salles', emoji: '🍽️', hasSublevel: false },
      { id: 'esthetique_beaute', name: 'Esthétique & Beauté', emoji: '💄', hasSublevel: false },
      { id: 'image_son', name: 'Image & Son', emoji: '🎬', hasSublevel: false },
      { id: 'comptabilite_economie', name: 'Comptabilité & Economie', emoji: '💰', hasSublevel: false },
      { id: 'couture_confection', name: 'Couture & Confection', emoji: '🧵', hasSublevel: false },
      { id: 'maintenance_informatique', name: 'Maintenance informatique', emoji: '💻', hasSublevel: false },
      { id: 'reparation_electromenager', name: 'Réparation Electromenager', emoji: '🔌', hasSublevel: false },
      { id: 'evenements_divertissement', name: 'Evènements & Divertissement', emoji: '🎪', hasSublevel: false },
      { id: 'paraboles_demos', name: 'Paraboles & Démos', emoji: '📡', hasSublevel: false },
      { id: 'reparation_electronique', name: 'Réparation Électronique', emoji: '🔌', hasSublevel: false },
      { id: 'services_etranger', name: 'Services à l\'étranger', emoji: '🌍', hasSublevel: false },
      { id: 'flashage_reparation_telephones', name: 'Flashage & Réparation des téléphones', emoji: '📱', hasSublevel: false },
      { id: 'flashage_installation_jeux', name: 'Flashage & Installation des jeux', emoji: '🎮', hasSublevel: false },
      { id: 'juridique', name: 'Juridique', emoji: '⚖️', hasSublevel: false },
      { id: 'autres_services', name: 'Autres Services', emoji: '🛠️', hasSublevel: false }
    ],
    
    // 🛠️ SUBCATEGORÍAS - Vacío (igual que vehicules)
    subcategories: {},
    
    // ⭐ Para compatibilidad
    properties: {}
  };
  
  export default categoryServices;