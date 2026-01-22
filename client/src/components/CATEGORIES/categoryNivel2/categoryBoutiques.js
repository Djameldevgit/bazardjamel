const categoryBoutiques = {
  levels: 2,
  level1: 'categorie',
  level2: 'subCategory',
  requiresLevel2: false,// Requiere seleccionar ambos niveles
  
  categories: [
    // 📦 PLANS COMPLETOS (durée + offre combinados)
    { 
      id: 'basic_50_1mois', 
      name: 'Basic 50 (1 mois)', 
      emoji: '⭐', 
      hasSublevel: false,
      plan: 'basic_50',
      duration: '1_mois',
      credits: 50,
      storage: '100 articles',
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing']
    },
    { 
      id: 'basic_50_6mois', 
      name: 'Basic 50 (6 mois)', 
      emoji: '⭐', 
      hasSublevel: false,
      plan: 'basic_50',
      duration: '6_mois',
      credits: 250, // 5 mois payés + 1 offert
      storage: '100 articles',
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing', '1 mois offert']
    },
    { 
      id: 'basic_50_12mois', 
      name: 'Basic 50 (12 mois)', 
      emoji: '⭐', 
      hasSublevel: false,
      plan: 'basic_50',
      duration: '12_mois',
      credits: 450, // 9 mois payés + 3 offerts
      storage: '100 articles',
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing', '3 mois offerts']
    },
    
    { 
      id: 'basic_100_1mois', 
      name: 'Basic 100 (1 mois)', 
      emoji: '⭐', 
      hasSublevel: false,
      plan: 'basic_100',
      duration: '1_mois',
      credits: 100,
      storage: '200 articles',
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing']
    },
    { 
      id: 'basic_100_6mois', 
      name: 'Basic 100 (6 mois)', 
      emoji: '⭐', 
      hasSublevel: false,
      plan: 'basic_100',
      duration: '6_mois',
      credits: 500, // 5 mois payés + 1 offert
      storage: '200 articles',
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing', '1 mois offert']
    },
    
    { 
      id: 'silver_200_1mois', 
      name: 'Silver 200 (1 mois)', 
      emoji: '🥈', 
      hasSublevel: false,
      plan: 'silver_200',
      duration: '1_mois',
      credits: 200,
      storage: '400 articles',
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing']
    },
    { 
      id: 'silver_200_6mois', 
      name: 'Silver 200 (6 mois)', 
      emoji: '🥈', 
      hasSublevel: false,
      plan: 'silver_200',
      duration: '6_mois',
      credits: 1000, // 5 mois payés + 1 offert
      storage: '400 articles',
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing', '1 mois offert']
    },
    
    { 
      id: 'silver_500_1mois', 
      name: 'Silver 500 (1 mois)', 
      emoji: '🥈', 
      hasSublevel: false,
      plan: 'silver_500',
      duration: '1_mois',
      credits: 500,
      storage: '1000 articles',
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing']
    },
    { 
      id: 'silver_500_12mois', 
      name: 'Silver 500 (12 mois)', 
      emoji: '🥈', 
      hasSublevel: false,
      plan: 'silver_500',
      duration: '12_mois',
      credits: 4500, // 9 mois payés + 3 offerts
      storage: '1000 articles',
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing', '3 mois offerts']
    },
    
    { 
      id: 'gold_1000_1mois', 
      name: 'Gold 1000 (1 mois)', 
      emoji: '🏆', 
      hasSublevel: false,
      plan: 'gold_1000',
      duration: '1_mois',
      credits: 1000,
      storage: '2000 articles',
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing']
    },
    { 
      id: 'gold_1000_6mois', 
      name: 'Gold 1000 (6 mois)', 
      emoji: '🏆', 
      hasSublevel: false,
      plan: 'gold_1000',
      duration: '6_mois',
      credits: 5000, // 5 mois payés + 1 offert
      storage: '2000 articles',
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing', '1 mois offert']
    },
    
    { 
      id: 'gold_6000_1mois', 
      name: 'Gold 6000 (1 mois)', 
      emoji: '👑', 
      hasSublevel: false,
      plan: 'gold_6000',
      duration: '1_mois',
      credits: 6000,
      storage: '12000 articles',
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing']
    },
    { 
      id: 'gold_6000_12mois', 
      name: 'Gold 6000 (12 mois)', 
      emoji: '👑', 
      hasSublevel: false,
      plan: 'gold_6000',
      duration: '12_mois',
      credits: 54000, // 9 mois payés + 3 offerts
      storage: '12000 articles',
      features: ['Site Builder', 'Nom de domaine', 'Store à la une Listing', '3 mois offerts']
    }
  ],
  
  // ⭐ Configuración especial para boutiques
  isBoutiqueCategory: true,
  isSubscription: true, // Es una suscripción, no un producto normal
  
  // No necesita subcategorías
  subcategories: {}
};

export default categoryBoutiques;