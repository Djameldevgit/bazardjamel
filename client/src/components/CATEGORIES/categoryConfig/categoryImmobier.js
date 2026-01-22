// 📁 src/components/CATEGORIES/CategoryConfig/categoryImmobilier.js
const categoryImmobilier = {
    name: "Immobilier",
    slug: "immobilier",  // ← SLUG PRINCIPAL
    icon: "🏡",
    emoji: "🏡",
    id: "immobilier",
    
    // Nivel 1: Subcategorías (OPERATIONS)
    subcategories: [
      { 
        name: "Vente", 
        slug: "vente",  // ← SLUG NIVEL 1
        icon: "💰",
        emoji: "💰",
        id: "vente",
        hasSublevel: true 
      },
      { 
        name: "Location", 
        slug: "location", 
        icon: "🏠",
        emoji: "🏠",
        id: "location",
        hasSublevel: true 
      },
      { 
        name: "Échange", 
        slug: "echange", 
        icon: "🔄",
        emoji: "🔄",
        id: "echange",
        hasSublevel: false 
      },
      { 
        name: "Colocation", 
        slug: "colocation", 
        icon: "👥",
        emoji: "👥",
        id: "colocation",
        hasSublevel: false 
      }
    ],
    
    // Nivel 2: Tipos de Propiedad (PROPERTY TYPES) - ORGANIZADO POR SUBCATEGORÍA
    propertyTypes: {
      // Para VENTE
      vente: [
        { name: "Villa", slug: "villa", emoji: "🏡", id: "villa" },
        { name: "Appartement", slug: "appartement", emoji: "🏢", id: "appartement" },
        { name: "Studio", slug: "studio", emoji: "🛋️", id: "studio" },
        { name: "Terrain", slug: "terrain", emoji: "🌳", id: "terrain" },
        { name: "Bureau", slug: "bureau", emoji: "💼", id: "bureau" }
      ],
      // Para LOCATION
      location: [
        { name: "Appartement", slug: "appartement", emoji: "🏢", id: "appartement" },
        { name: "Maison", slug: "maison", emoji: "🏠", id: "maison" },
        { name: "Villa", slug: "villa", emoji: "🏡", id: "villa" },
        { name: "Chambre", slug: "chambre", emoji: "🛏️", id: "chambre" }
      ],
      // Para ÉCHANGE (si aplica)
      echange: [
        { name: "Maison", slug: "maison", emoji: "🏠", id: "maison" },
        { name: "Appartement", slug: "appartement", emoji: "🏢", id: "appartement" }
      ],
      // Para COLOCATION
      colocation: [
        { name: "Chambre", slug: "chambre", emoji: "🛏️", id: "chambre" },
        { name: "Studio", slug: "studio", emoji: "🛋️", id: "studio" }
      ]
    },
    
    // Campos dinámicos por nivel
    fields: {
      communs: ["surface", "nombrePieces", "etage"],
      vente: ["prix", "typeVente"],
      location: ["prixMensuel", "caution", "dureeMin"],
      
      // Campos específicos por tipo de propiedad
      propertySpecific: {
        villa: ["jardin", "piscine", "garage"],
        appartement: ["balcon", "ascenseur", "parking"],
        terrain: ["surfaceTotale", "viabilise"],
        bureau: ["nombreBureaux", "salleReunion"]
      }
    },
    
    // Metadata para el accordion
    levels: 2, // 2 niveles: subcategoría + tipo de propiedad
    requiresLevel2: true // Siempre requiere segundo nivel
    
  };
  
  export default categoryImmobilier;