// scripts/seedAllCategories.js
const ALL_CATEGORIES_DATA = {
    // GRUPO 1: Immobilier (2-3 niveles)
    immobilier: {
      name: "Immobilier",
      slug: "immobilier",
      level: 1,
      subcategories: {
        vente: {
          name: "Vente",
          level: 2,
          articles: ["Villa", "Appartement", "Studio", "Terrain", "Bureau"]
        },
        location: {
          name: "Location",
          level: 2,
          articles: ["Appartement", "Maison", "Villa", "Chambre"]
        },
        echange: {
          name: "Échange",
          level: 2,
          isLeaf: true  // ← No tiene artículos, es nivel final
        }
      }
    },
    
    // GRUPO 2: Téléphones & Tablettes (niveles mixtos)
    telephones: {
      name: "Téléphones & Tablettes",
      slug: "telephones-tablettes",
      level: 1,
      subcategories: {
        smartphones: {
          name: "Smartphones",
          level: 2,
          isLeaf: true  // ← Nivel final
        },
        tablettes: {
          name: "Tablettes",
          level: 2,
          isLeaf: true  // ← Nivel final
        },
        protection_antichoc: {
          name: "Protection & Antichoc",
          level: 2,
          articles: [
            "Protections d'écran",
            "Coques & Antichoc",
            "Films de protection"
          ]
        }
      }
    },
    
    // GRUPO 3: Véhicules (ejemplo)
    vehicules: {
      name: "Véhicules",
      slug: "vehicules",
      level: 1,
      subcategories: {
        voitures: {
          name: "Voitures",
          level: 2,
          articles: ["Berline", "SUV", "4x4", "Utilitaire"]
        },
        motos: {
          name: "Motos",
          level: 2,
          articles: ["Scooter", "Roadster", "Custom", "Sportive"]
        },
        camions: {
          name: "Camions",
          level: 2,
          isLeaf: true  // ← Nivel final
        }
      }
    },
    
    // GRUPO 4: Vêtements (ejemplo con 2 niveles)
    vetements: {
      name: "Vêtements",
      slug: "vetements",
      level: 1,
      subcategories: {
        homme: {
          name: "Homme",
          level: 2,
          isLeaf: true  // ← Todo en un nivel
        },
        femme: {
          name: "Femme",
          level: 2,
          isLeaf: true
        }
      }
    }
    // ... AGREGAR LAS OTRAS 11 CATEGORÍAS AQUÍ
  };