export const DYNAMIC_FIELDS_CONFIG = {
    // ==================== VEHICULES ====================
    'vehicules': {
      step2: [],
      step3: [],
      step4: [],
      step5: [],
      subCategories: {
        'voitures': {
          step2: ['marque', 'modele', 'annee', 'finition', 'motorisation', 'moteur', 'energie', 'boite', 'specs', 'kilometrage', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'utilitaire': {
          step2: ['marque', 'modele', 'annee', 'energie', 'boite', 'kilometrage', 'chargeUtile', 'volume', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'motos-scooters': {
          step2: ['marque', 'modele', 'annee', 'energie', 'boite', 'kilometrage', 'cylindree', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'quads': {
          step2: ['marque', 'modele', 'annee', 'energie', 'kilometrage', 'typeQuad', 'cylindree', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'fourgon': {
          step2: ['marque', 'modele', 'annee', 'energie', 'boite', 'kilometrage', 'volume', 'chargeUtile', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'camion': {
          step2: ['marque', 'modele', 'annee', 'energie', 'boite', 'kilometrage', 'poids', 'chargeUtile', 'essieux', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'bus': {
          step2: ['marque', 'modele', 'annee', 'energie', 'boite', 'kilometrage', 'places', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'engin': {
          step2: ['marque', 'modele', 'annee', 'heures', 'typeEngin', 'puissance', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'tracteurs': {
          step2: ['marque', 'modele', 'annee', 'heures', 'puissance', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'remorques': {
          step2: ['marque', 'modele', 'annee', 'longueur', 'chargeUtile', 'essieux', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'bateaux-barques': {
          step2: ['marque', 'modele', 'annee', 'longueur', 'moteurBateau', 'places', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        }
      }
    },
  
    // ==================== IMMOBILIER ====================
    'immobilier': {
      step2: [],
      step3: [],
      step4: [],
      step5: [],
      subCategories: {
        // VENTE
        'vente': {
          step2: ['designation', 'descriptionBien', 'superficie', 'etage', 'pieces', 'chambres', 'sallesBain', 'jardin', 'piscine', 'specs', 'transaction', 'typeVente', 'papiers', 'conditionsPaiement', 'descriptionExtra', 'adresse', 'quartier', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images'],
          articleTypes: {
            'appartement': {
              step2: ['designation', 'descriptionBien', 'superficie', 'etage', 'pieces', 'chambres', 'sallesBain', 'specs', 'adresse', 'quartier', 'etat', 'description']
            },
            'local': {
              step2: ['designation', 'descriptionBien', 'superficie', 'vitrine', 'specs', 'adresse', 'quartier', 'etat', 'description']
            },
            'villa': {
              step2: ['designation', 'descriptionBien', 'superficie', 'jardin', 'piscine', 'pieces', 'chambres', 'sallesBain', 'specs', 'adresse', 'quartier', 'etat', 'description']
            },
            'terrain': {
              step2: ['designation', 'descriptionBien', 'superficie', 'typeTerrain', 'viabilise', 'adresse', 'quartier', 'etat', 'description']
            },
            'terrain-agricole': {
              step2: ['designation', 'descriptionBien', 'superficie', 'typeTerrain', 'adresse', 'quartier', 'etat', 'description']
            },
            'immeuble': {
              step2: ['designation', 'descriptionBien', 'superficie', 'nbAppartements', 'nbEtages', 'adresse', 'quartier', 'etat', 'description']
            },
            'bungalow': {
              step2: ['designation', 'descriptionBien', 'superficie', 'pieces', 'chambres', 'sallesBain', 'jardin', 'adresse', 'quartier', 'etat', 'description']
            },
            'hangar-usine': {
              step2: ['designation', 'descriptionBien', 'superficie', 'hauteur', 'specs', 'adresse', 'quartier', 'etat', 'description']
            },
            'autre-vente': {
              step2: ['designation', 'descriptionBien', 'superficie', 'adresse', 'quartier', 'etat', 'description']
            }
          }
        },
        // LOCATION
        'location': {
          step2: ['designation', 'descriptionBien', 'superficie', 'etage', 'pieces', 'chambres', 'sallesBain', 'jardin', 'piscine', 'specs', 'transaction', 'papiers', 'conditionsPaiement', 'descriptionExtra', 'adresse', 'quartier', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images'],
          articleTypes: {
            'appartement-location': {
              step2: ['designation', 'descriptionBien', 'superficie', 'etage', 'pieces', 'chambres', 'sallesBain', 'specs', 'adresse', 'quartier', 'etat', 'description']
            },
            'local-location': {
              step2: ['designation', 'descriptionBien', 'superficie', 'vitrine', 'specs', 'adresse', 'quartier', 'etat', 'description']
            },
            'villa-location': {
              step2: ['designation', 'descriptionBien', 'superficie', 'jardin', 'piscine', 'pieces', 'chambres', 'sallesBain', 'specs', 'adresse', 'quartier', 'etat', 'description']
            },
            'immeuble-location': {
              step2: ['designation', 'descriptionBien', 'superficie', 'nbAppartements', 'nbEtages', 'adresse', 'quartier', 'etat', 'description']
            },
            'bungalow-location': {
              step2: ['designation', 'descriptionBien', 'superficie', 'pieces', 'chambres', 'sallesBain', 'jardin', 'adresse', 'quartier', 'etat', 'description']
            },
            'autre-location': {
              step2: ['designation', 'descriptionBien', 'superficie', 'adresse', 'quartier', 'etat', 'description']
            }
          }
        },
        // LOCATION VACANCES
        'location-vacances': {
          step2: ['designation', 'descriptionBien', 'superficie', 'pieces', 'chambres', 'sallesBain', 'jardin', 'piscine', 'specs', 'transaction', 'descriptionExtra', 'adresse', 'quartier', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images'],
          articleTypes: {
            'appartement-vacances': {
              step2: ['designation', 'descriptionBien', 'superficie', 'pieces', 'chambres', 'sallesBain', 'specs', 'adresse', 'quartier', 'etat', 'description']
            },
            'villa-vacances': {
              step2: ['designation', 'descriptionBien', 'superficie', 'jardin', 'piscine', 'pieces', 'chambres', 'sallesBain', 'specs', 'adresse', 'quartier', 'etat', 'description']
            },
            'bungalow-vacances': {
              step2: ['designation', 'descriptionBien', 'superficie', 'pieces', 'chambres', 'sallesBain', 'jardin', 'adresse', 'quartier', 'etat', 'description']
            },
            'autre-vacances': {
              step2: ['designation', 'descriptionBien', 'superficie', 'adresse', 'quartier', 'etat', 'description']
            }
          }
        },
        // CHERCHE LOCATION
        'cherche-location': {
          step2: ['designation', 'descriptionBien', 'superficie', 'pieces', 'chambres', 'sallesBain', 'specs', 'adresse', 'quartier', 'budget', 'description'],
          step3: ['typeOffre','price'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images'],
          articleTypes: {
            'appartement-cherche-location': { step2: ['designation', 'descriptionBien', 'superficie', 'pieces', 'chambres', 'sallesBain', 'specs', 'adresse', 'quartier', 'budget', 'description'] },
            'local-cherche-location': { step2: ['designation', 'descriptionBien', 'superficie', 'specs', 'adresse', 'quartier', 'budget', 'description'] },
            'villa-cherche-location': { step2: ['designation', 'descriptionBien', 'superficie', 'pieces', 'chambres', 'sallesBain', 'jardin', 'piscine', 'specs', 'adresse', 'quartier', 'budget', 'description'] },
            'immeuble-cherche-location': { step2: ['designation', 'descriptionBien', 'superficie', 'adresse', 'quartier', 'budget', 'description'] },
            'bungalow-cherche-location': { step2: ['designation', 'descriptionBien', 'superficie', 'pieces', 'chambres', 'sallesBain', 'adresse', 'quartier', 'budget', 'description'] },
            'autre-cherche-location': { step2: ['designation', 'descriptionBien', 'superficie', 'adresse', 'quartier', 'budget', 'description'] }
          }
        },
        // CHERCHE ACHAT
        'cherche-achat': {
          step2: ['designation', 'descriptionBien', 'superficie', 'pieces', 'chambres', 'sallesBain', 'specs', 'adresse', 'quartier', 'budget', 'description'],
          step3: ['typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images'],
          articleTypes: {
            'appartement-cherche-achat': { step2: ['designation', 'descriptionBien', 'superficie', 'pieces', 'chambres', 'sallesBain', 'specs', 'adresse', 'quartier', 'budget', 'description'] },
            'local-cherche-achat': { step2: ['designation', 'descriptionBien', 'superficie', 'specs', 'adresse', 'quartier', 'budget', 'description'] },
            'villa-cherche-achat': { step2: ['designation', 'descriptionBien', 'superficie', 'pieces', 'chambres', 'sallesBain', 'jardin', 'piscine', 'specs', 'adresse', 'quartier', 'budget', 'description'] },
            'terrain-cherche-achat': { step2: ['designation', 'descriptionBien', 'superficie', 'typeTerrain', 'adresse', 'quartier', 'budget', 'description'] },
            'terrain-agricole-cherche-achat': { step2: ['designation', 'descriptionBien', 'superficie', 'adresse', 'quartier', 'budget', 'description'] },
            'immeuble-cherche-achat': { step2: ['designation', 'descriptionBien', 'superficie', 'adresse', 'quartier', 'budget', 'description'] },
            'bungalow-cherche-achat': { step2: ['designation', 'descriptionBien', 'superficie', 'pieces', 'chambres', 'sallesBain', 'adresse', 'quartier', 'budget', 'description'] },
            'hangar-usine-cherche-achat': { step2: ['designation', 'descriptionBien', 'superficie', 'adresse', 'quartier', 'budget', 'description'] },
            'autre-cherche-achat': { step2: ['designation', 'descriptionBien', 'superficie', 'adresse', 'quartier', 'budget', 'description'] }
          }
        }
      }
    },
  
    // ==================== TELEPHONE ====================
    'telephone': {
      step2: [],
      step3: [],
      step4: [],
      step5: [],
      subCategories: {
        'smartphones': {
          step2: ['marque', 'modele', 'copie', 'memoire', 'couleur', 'os', 'appareil', 'camerafrontal', 'tailleEcran', 'ram', 'gigas', 'doublePuce', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'telephones-cellulaires': {
          step2: ['marque', 'modele', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'tablettes': {
          step2: ['marque', 'modele', 'memoire', 'couleur', 'os', 'tailleEcran', 'ram', 'gigas', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'fixes-fax': {
          step2: ['marque', 'modele', 'type', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'smartwatchs': {
          step2: ['marque', 'modele', 'couleur', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'accessoires-telephone': {
          step2: ['typeAccessoire', 'marque', 'modele', 'couleur', 'compatibilite', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'pieces-rechange-telephone': {
          step2: ['typePiece', 'marque', 'modele', 'compatibilite', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'offres-abonnements': {
          step2: ['operateur', 'typeOffre', 'duree', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        }
      }
    },
  
    // ==================== VETEMENTS ====================
    'vetements': {
      step2: [],
      step3: [],
      step4: [],
      step5: [],
      subCategories: {
        'vetements-homme': {
          step2: ['typeVetement', 'marque', 'taille', 'couleur', 'matiere', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'vetements-femme': {
          step2: ['typeVetement', 'marque', 'taille', 'couleur', 'matiere', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'chaussures-homme': {
          step2: ['typeChaussure', 'marque', 'pointure', 'couleur', 'matiere', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'chaussures-femme': {
          step2: ['typeChaussure', 'marque', 'pointure', 'couleur', 'matiere', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'garcons': {
          step2: ['typeVetement', 'marque', 'taille', 'age', 'couleur', 'matiere', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'filles': {
          step2: ['typeVetement', 'marque', 'taille', 'age', 'couleur', 'matiere', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'bebe': {
          step2: ['typeVetement', 'marque', 'taille', 'age', 'couleur', 'matiere', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'sacs-valises': {
          step2: ['typeSac', 'marque', 'couleur', 'matiere', 'dimensions', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'montres': {
          step2: ['marque', 'materiau', 'couleur', 'mecanisme', 'etancheite', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'lunettes': {
          step2: ['typeLunette', 'marque', 'monture', 'couleur', 'protection', 'typeVerre', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'bijoux': {
          step2: ['typeBijou', 'marque', 'materiau', 'pierres', 'poids', 'carats', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'tenues-professionnelles': {
          step2: ['typeTenue', 'marque', 'taille', 'couleur', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        }
      }
    },
  
    // ==================== ELECTROMENAGER ====================
    'electromenager': {
      step2: [],
      step3: [],
      step4: [],
      step5: [],
      subCategories: {
        'televiseurs': {
          step2: ['marque', 'modele', 'tailleEcran', 'resolution', 'smartTv', 'typeTv', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'audio': {
          step2: ['marque', 'modele', 'typeAudio', 'puissance', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'refrigerateurs-congelateurs': {
          step2: ['marque', 'modele', 'typeRefrigerateur', 'capacite', 'classeEnergetique', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'machines-laver': {
          step2: ['marque', 'modele', 'typeMachine', 'capaciteKg', 'vitesseEssorage', 'classeEnergetique', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'lave-vaisselles': {
          step2: ['marque', 'modele', 'capacite', 'classeEnergetique', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'fours-cuisson': {
          step2: ['marque', 'modele', 'typeFour', 'puissance', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'chauffage-climatisation': {
          step2: ['marque', 'modele', 'puissance', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'appareils-cuisine': {
          step2: ['marque', 'modele', 'typeAppareil', 'puissance', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'aspirateurs-nettoyeurs': {
          step2: ['marque', 'modele', 'puissance', 'typeAspirateur', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'repassage': {
          step2: ['marque', 'modele', 'puissance', 'typeFer', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'beaute-hygiene': {
          step2: ['marque', 'modele', 'typeAppareil', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'machines-coudre': {
          step2: ['marque', 'modele', 'typeMachine', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'telecommandes': {
          step2: ['marque', 'modele', 'compatibilite', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'securite-gps': {
          step2: ['marque', 'modele', 'type', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'autre-electromenager': {
          step2: ['marque', 'modele', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        }
      }
    },
  
    // ==================== INFORMATIQUE ====================
    'informatique': {
      step2: [],
      step3: [],
      step4: [],
      step5: [],
      subCategories: {
        'ordinateurs-portables': {
          step2: ['marque', 'modele', 'processeur', 'ram', 'stockage', 'tailleEcran', 'carteGraphique', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'ordinateurs-bureau': {
          step2: ['marque', 'modele', 'processeur', 'ram', 'stockage', 'carteGraphique', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'composants-pc-fixe': {
          step2: ['typeComposant', 'marque', 'modele', 'specifications', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'ecrans': {
          step2: ['marque', 'modele', 'tailleEcran', 'resolution', 'tempsReponse', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'imprimantes-cartouches': {
          step2: ['typeImprimante', 'marque', 'modele', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'reseau-connexion': {
          step2: ['typeEquipement', 'marque', 'modele', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'claviers-souris': {
          step2: ['typePeripherique', 'marque', 'modele', 'connectique', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'serveurs': {
          step2: ['marque', 'modele', 'processeur', 'ram', 'stockage', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'autre-informatique': {
          step2: ['marque', 'modele', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        }
      }
    },
  
    // ==================== PIECES DETACHEES ====================
    'pieces-detachees': {
      step2: [],
      step3: [],
      step4: [],
      step5: [],
      subCategories: {
        'pieces-automobiles': {
          step2: ['typePiece', 'marque', 'modele', 'annee', 'referenceOem', 'compatibilite', 'kilometrage', 'position', 'typeMoteur', 'garantie', 'quantite', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'pieces-moto': {
          step2: ['typePiece', 'marque', 'modele', 'annee', 'compatibilite', 'kilometrage', 'garantie', 'quantite', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'alarme-securite': {
          step2: ['typeAlarme', 'marque', 'modele', 'garantie', 'quantite', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'nettoyage-entretien': {
          step2: ['typeProduit', 'marque', 'quantite', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'outils-diagnostics': {
          step2: ['typeOutil', 'marque', 'modele', 'garantie', 'quantite', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'lubrifiants': {
          step2: ['typeLubrifiant', 'marque', 'viscosite', 'quantite', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'autres-pieces': {
          step2: ['typePiece', 'marque', 'modele', 'quantite', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        }
      }
    },
  
    // ==================== MEUBLES ====================
    'meubles': {
      step2: [],
      step3: [],
      step4: [],
      step5: [],
      subCategories: {
        'salon': {
          step2: ['typeMeuble', 'marque', 'matiere', 'couleur', 'dimensions', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'chambres-coucher': {
          step2: ['typeMeuble', 'marque', 'matiere', 'couleur', 'dimensions', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'tables': {
          step2: ['typeTable', 'marque', 'matiere', 'couleur', 'dimensions', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'lits': {
          step2: ['typeLit', 'marque', 'matiere', 'dimensions', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'decoration': {
          step2: ['typeDecoration', 'marque', 'matiere', 'couleur', 'dimensions', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'vaisselle': {
          step2: ['typeVaisselle', 'marque', 'matiere', 'nbPieces', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'meubles-bureau': {
          step2: ['typeMeuble', 'marque', 'matiere', 'couleur', 'dimensions', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'rideaux': {
          step2: ['marque', 'matiere', 'couleur', 'dimensions', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'literie-linge': {
          step2: ['typeLiterie', 'marque', 'taille', 'matiere', 'couleur', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'tapis-moquettes': {
          step2: ['marque', 'matiere', 'couleur', 'dimensions', 'forme', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'puericulture': {
          step2: ['typeArticle', 'marque', 'modele', 'ageBebe', 'matiere', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'luminaire': {
          step2: ['typeLuminaire', 'marque', 'couleur', 'matiere', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'fournitures-scolaires': {
          step2: ['typeFourniture', 'marque', 'quantite', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'autre-meubles': {
          step2: ['typeMeuble', 'marque', 'matiere', 'couleur', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        }
      }
    },
  
    // ==================== MATERIAUX ====================
    'materiaux': {
      step2: [],
      step3: [],
      step4: [],
      step5: [],
      subCategories: {
        'materiel-professionnel': {
          step2: ['typeMateriel', 'marque', 'modele', 'puissance', 'tension', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'outillage-professionnel': {
          step2: ['typeOutil', 'marque', 'modele', 'puissance', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'materiel-agricole': {
          step2: ['typeMateriel', 'marque', 'modele', 'annee', 'puissance', 'heures', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'materiaux-construction': {
          step2: ['typeMateriau', 'marque', 'quantite', 'uniteMesure', 'etat', 'description'],
          step3: ['price', 'typeOffre', 'quantite'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'autre-materiaux': {
          step2: ['typeProduit', 'marque', 'quantite', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        }
      }
    },
  
    // ==================== VOYAGES ====================
    'voyages': {
      step2: [],
      step3: [],
      step4: [],
      step5: [],
      subCategories: {
        'voyage-organise': {
          step2: ['destination', 'duree', 'dateDepart', 'dateRetour', 'nombrePersonnes', 'transport', 'hebergement', 'activitesIncluses', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'location-vacances-voyages': {
          step2: ['destination', 'duree', 'typeHebergement', 'capacite', 'equipements', 'proximite', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'hajj-omra': {
          step2: ['dateDepart', 'dateRetour', 'typePelerinage', 'groupe', 'hotelMakkah', 'hotelMadinah', 'vols', 'transport', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'sejour': {
          step2: ['destination', 'duree', 'dateDepart', 'dateRetour', 'typeSejour', 'categorieHotel', 'nombrePersonnes', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'croisiere': {
          step2: ['destination', 'duree', 'dateDepart', 'dateRetour', 'nomBateau', 'cabine', 'nombrePersonnes', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'autre-voyages': {
          step2: ['destination', 'duree', 'dateDepart', 'dateRetour', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        }
      }
    },
  
    // ==================== ALIMENTAIRES ====================
    'alimentaires': {
      step2: [],
      step3: [],
      step4: [],
      step5: [],
      subCategories: {
        'fruits-legumes': {
          step2: ['typeProduit', 'origine', 'saison', 'conditionnement', 'description'],
          step3: ['price', 'typeOffre', 'quantite'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'produits-laitiers': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'description'],
          step3: ['price', 'typeOffre', 'quantite'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'viandes-poissons': {
          step2: ['typeViande', 'origine', 'poids', 'decoupe', 'description'],
          step3: ['price', 'typeOffre', 'quantite'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'boissons': {
          step2: ['typeBoisson', 'marque', 'contenance', 'description'],
          step3: ['price', 'typeOffre', 'quantite'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'autre-alimentaires': {
          step2: ['typeProduit', 'marque', 'conditionnement', 'description'],
          step3: ['price', 'typeOffre', 'quantite'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        }
      }
    },
  
    // ==================== EMPLOI ====================
    'emploi': {
      step2: [],
      step3: [],
      step4: [],
      step5: [],
      subCategories: {
        'offres-emploi': {
          step2: ['poste', 'secteur', 'experienceRequise', 'competences', 'avantages', 'teletravail', 'description'],
          step3: ['salaire', 'typeContrat'],
          step4: ['wilaya', 'commune', 'telephone', 'email', 'nomSociete'],
          step5: ['images']
        },
        'demandes-emploi': {
          step2: ['posteRecherche', 'secteur', 'experience', 'competences', 'mobilite', 'description'],
          step3: ['salaireSouhaite'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'autres-services-emploi': {
          step2: ['typeService', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        }
      }
    },
  
    // ==================== LOISIRS ====================
    'loisirs': {
      step2: [],
      step3: [],
      step4: [],
      step5: [],
      subCategories: {
        'consoles-jeux-videos': {
          step2: ['typeConsole', 'marque', 'modele', 'jeuxInclus', 'accessoires', 'garantie', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'instruments-musique': {
          step2: ['typeInstrument', 'marque', 'modele', 'materiau', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'livres-magazines': {
          step2: ['titre', 'auteur', 'editeur', 'genre', 'langue', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'jouets': {
          step2: ['typeJouet', 'marque', 'ageRecommande', 'materiau', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'animalerie': {
          step2: ['typeAnimal', 'typeProduit', 'marque', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'autre-loisirs': {
          step2: ['typeLoisir', 'marque', 'modele', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        }
      }
    },
  
    // ==================== SPORT ====================
    'sport': {
      step2: [],
      step3: [],
      step4: [],
      step5: [],
      subCategories: {
        'football': {
          step2: ['typeEquipement', 'marque', 'taille', 'couleur', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'fitness-musculation': {
          step2: ['typeEquipement', 'marque', 'poids', 'dimensions', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'velos-trotinettes': {
          step2: ['typeVehicule', 'marque', 'modele', 'tailleRoue', 'vitesses', 'couleur', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'autres-sports': {
          step2: ['typeSport', 'marque', 'modele', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        }
      }
    },
  
    // ==================== SERVICES ====================
    'services': {
      step2: [],
      step3: [],
      step4: [],
      step5: [],
      subCategories: {
        'construction-travaux': {
          step2: ['typeTravaux', 'surface', 'duree', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'reparation-auto-diagnostic': {
          step2: ['typeReparation', 'marque', 'probleme', 'delai', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'autres-services': {
          step2: ['typeService', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        }
      }
    },
  
    // ==================== SANTE & BEAUTE ====================
    'sante-beaute': {
      step2: [],
      step3: [],
      step4: [],
      step5: [],
      subCategories: {
        'cosmetiques-beaute': {
          step2: ['typeCosmetique', 'marque', 'typePeau', 'quantite', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'parfums-deodorants-femme': {
          step2: ['marque', 'typeParfum', 'familleOlfactive', 'quantite', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'parfums-deodorants-homme': {
          step2: ['marque', 'typeParfum', 'familleOlfactive', 'quantite', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'autre-sante-beaute': {
          step2: ['typeProduit', 'marque', 'quantite', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        }
      }
    }
  };
  
  // ============ FUNCIONES UTILITARIAS ============
  
  export const getFieldsForCategory = (mainCategory, subCategory = null, step = null, articleType = null) => {
    if (!mainCategory || !DYNAMIC_FIELDS_CONFIG[mainCategory]) {
      console.warn(`⚠️ Categoría no configurada: ${mainCategory}`);
      return step ? [] : { step2: [], step3: [], step4: [], step5: [] };
    }
  
    const config = DYNAMIC_FIELDS_CONFIG[mainCategory];
    let activeConfig = { ...config };
    
    if (subCategory && config.subCategories?.[subCategory]) {
      activeConfig = { ...activeConfig, ...config.subCategories[subCategory] };
      
      // Manejar articleType (nivel 3)
      if (articleType && activeConfig.articleTypes?.[articleType]) {
        activeConfig = { ...activeConfig, ...activeConfig.articleTypes[articleType] };
      }
    }
  
    if (step) {
      const stepKey = `step${step}`;
      const baseFields = config[stepKey] || [];
      const levelFields = activeConfig[stepKey] || [];
      const allFields = [...new Set([...baseFields, ...levelFields])];
      return allFields;
    }
  
    return {
      step2: [...(config.step2 || []), ...(activeConfig.step2 || [])],
      step3: [...(config.step3 || []), ...(activeConfig.step3 || [])],
      step4: [...(config.step4 || []), ...(activeConfig.step4 || [])],
      step5: config.step5 || []
    };
  };
  
  export const isCategoryConfigured = (mainCategory, subCategory = null) => {
    if (!DYNAMIC_FIELDS_CONFIG[mainCategory]) return false;
    if (subCategory) {
      return !!DYNAMIC_FIELDS_CONFIG[mainCategory].subCategories?.[subCategory];
    }
    return true;
  };
  
  export const getSubCategories = (mainCategory) => {
    return DYNAMIC_FIELDS_CONFIG[mainCategory]?.subCategories 
      ? Object.keys(DYNAMIC_FIELDS_CONFIG[mainCategory].subCategories)
      : [];
  };
  
  export const getArticleTypes = (mainCategory, subCategory) => {
    return DYNAMIC_FIELDS_CONFIG[mainCategory]?.subCategories?.[subCategory]?.articleTypes
      ? Object.keys(DYNAMIC_FIELDS_CONFIG[mainCategory].subCategories[subCategory].articleTypes)
      : [];
  };