// 📂 components/CATEGORIES/categoryNivel/categorySanteBeaute.js

const categorySanteBeaute = {
    levels: 2,
    level1: 'categorie',
    level2: 'subcategory',
    requiresLevel2: false, // Mixto
    
    categories: [
      // 📌 CON NIVEL 2
      { 
        id: 'cosmetiques_beaute', 
        name: 'Cosmétiques & Beauté', 
        emoji: '💄', 
        hasSublevel: true 
      },
      { 
        id: 'parapharmacie_sante', 
        name: 'Parapharmacie & Santé', 
        emoji: '💊', 
        hasSublevel: true 
      },
      
      // 📌 SIN NIVEL 2 (DIRECTAS)
      { 
        id: 'parfums_deodorants_femme', 
        name: 'Parfums et déodorants femme', 
        emoji: '🌸', 
        hasSublevel: false 
      },
      { 
        id: 'parfums_deodorants_homme', 
        name: 'Parfums et déodorants homme', 
        emoji: '🌲', 
        hasSublevel: false 
      },
      
      // 📌 OTRAS CATEGORÍAS DIRECTAS (si existen)
      { 
        id: 'accessoires_beaute', 
        name: 'Accessoires beauté', 
        emoji: '🪞', 
        hasSublevel: false 
      },
      { 
        id: 'soins_cheveux', 
        name: 'Soins cheveux', 
        emoji: '💇', 
        hasSublevel: false 
      },
      { 
        id: 'autre_sante_beaute', 
        name: 'Autre Santé & Beauté', 
        emoji: '💡', 
        hasSublevel: false 
      }
    ],
    
    subcategories: {
      // 💄 COSMÉTIQUES & BEAUTÉ
      cosmetiques_beaute: [
        { id: 'soins_corps', name: 'Soins du corps', emoji: '🧴' },
        { id: 'savons_gels_douche', name: 'Savons & Gels douche', emoji: '🧼' },
        { id: 'soins_visage', name: 'Soins visage', emoji: '🧖‍♀️' },
        { id: 'maquillage', name: 'Maquillage', emoji: '💋' },
        { id: 'produits_solaires_bronzage', name: 'Produits Solaires & Bronzage', emoji: '☀️' },
        { id: 'instruments_outils_beaute', name: 'Instruments & Outils de beauté', emoji: '✂️' },
        { id: 'manucure_pedicure', name: 'Manucure et pedicure', emoji: '💅' },
        { id: 'rasage_epilation', name: 'Rasage et Épilation', emoji: '🪒' },
        { id: 'hygiene', name: 'Hygiène', emoji: '🚿' },
        { id: 'coiffure', name: 'Coiffure', emoji: '💇' },
        { id: 'soins_bebe', name: 'Soins bébé', emoji: '👶' },
        { id: 'autres_produits_cosmetiques', name: 'Autres produits', emoji: '💄' }
      ],
      
      // 💊 PARAPHARMACIE & SANTÉ
      parapharmacie_sante: [
        { id: 'dispositifs_medicaux', name: 'Dispositifs médicaux', emoji: '🩺' },
        { id: 'complement_alimentaire', name: 'Complément Alimentaire', emoji: '🥗' },
        { id: 'materiel_medical', name: 'Matériel Médical', emoji: '🏥' },
        { id: 'aliments_dietetiques', name: 'Aliments Diététiques', emoji: '🥦' }
      ]
    }
  };
  
  export default categorySanteBeaute;