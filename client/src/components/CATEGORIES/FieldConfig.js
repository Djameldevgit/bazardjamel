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
          step2: ['price', 'designation', 'descriptionBien', 'superficie', 'pieces', 'chambres', 'sallesBain', 'specs', 'adresse', 'quartier', 'budget', 'description'],
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
          step2: ['marque', 'modele', 'reference', 'copie', 'memoire', 'couleur', 'etat', 'os', 'appareil', 'cameraFrontal', 'tailleEcran', 'ram', 'connectivite', 'doublePuce', 'description']
        },
        'telephones-cellulaires': {
          step2: ['marque', 'modele', 'reference', 'copie', 'memoire', 'couleur', 'etat', 'os', 'ram', 'description']
        },
        'tablettes': {
          step2: ['marque', 'modele', 'reference', 'copie', 'memoire', 'couleur', 'etat', 'os', 'appareil', 'tailleEcran', 'ram', 'description']
        },
        'fixes-fax': {
          step2: ['marque', 'modele', 'etat', 'description']
        },
        'smartwatchs': {
          step2: ['marque', 'modele', 'couleur', 'etat', 'description']
        },
        'pieces-rechange-telephone': {
          step2: ['typeAccessoire', 'marque', 'modele', 'etat', 'description']
        },
        'offres-abonnements': {
          step2: ['marque', 'description']
        },
        'accessoires-telephone': {
          step2: ['typeAccessoire', 'marque', 'couleur', 'etat', 'description']
        },
        'protection-antichoc': {
          step2: ['typeAccessoire', 'marque', 'etat', 'description']
        },
        'ecouteurs-son': {
          step2: ['typeAccessoire', 'marque', 'etat', 'description']
        },
        'chargeurs-cables': {
          step2: ['typeAccessoire', 'marque', 'etat', 'description']
        },
        'supports-stabilisateurs': {
          step2: ['typeAccessoire', 'marque', 'etat', 'description']
        },
        'manettes-telephone': {
          step2: ['typeAccessoire', 'marque', 'etat', 'description']
        },
        'vr-telephone': {
          step2: ['typeAccessoire', 'marque', 'etat', 'description']
        },
        'power-banks': {
          step2: ['typeAccessoire', 'marque', 'etat', 'description']
        },
        'stylets': {
          step2: ['typeAccessoire', 'marque', 'etat', 'description']
        },
        'cartes-memoire': {
          step2: ['memoire', 'marque', 'etat', 'description']
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
          step2: [ 'typeChaussure', 'marque', 'pointure', 'couleur', 'matiere', 'etat', 'description'],
          step3: ['price', 'typeOffre'],
          step4: ['wilaya', 'commune', 'telephone', 'email'],
          step5: ['images']
        },
        'garcons': {
          step2: [ 'typeVetement', 'marque', 'taille', 'age', 'couleur', 'matiere', 'etat', 'description'],
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
          step2: ['marque', 'modele', 'processeur', 'ram', 'stockage', 'tailleEcran', 'carteGraphique', 'garantie', 'etat', 'description']
        },
        'ordinateurs-bureau': {
          step2: ['marque', 'modele', 'processeur', 'ram', 'stockage', 'carteGraphique', 'garantie', 'etat', 'description']
        },
        'composants-pc-fixe': {
          step2: ['typeComposant', 'marque', 'modele', 'garantie', 'etat', 'description']
        },
        'composants-pc-portable': {
          step2: ['typeComposant', 'marque', 'modele', 'garantie', 'etat', 'description']
        },
        'composants-serveur': {
          step2: ['typeComposant', 'marque', 'modele', 'garantie', 'etat', 'description']
        },
        'imprimantes-cartouches': {
          step2: ['marque', 'modele', 'garantie', 'etat', 'description']
        },
        'reseau-connexion': {
          step2: ['marque', 'modele', 'garantie', 'etat', 'description']
        },
        'stockage-externe-racks': {
          step2: ['marque', 'modele', 'garantie', 'etat', 'description']
        },
        'serveurs': {
          step2: ['marque', 'modele', 'processeur', 'ram', 'stockage', 'garantie', 'etat', 'description']
        },
        'ecrans': {
          step2: ['marque', 'modele', 'tailleEcran', 'garantie', 'etat', 'description']
        },
        'onduleurs-stabilisateurs': {
          step2: ['marque', 'modele', 'garantie', 'etat', 'description']
        },
        'claviers-souris': {
          step2: ['typePeripherique', 'marque', 'modele', 'garantie', 'etat', 'description']
        },
        'casques-son': {
          step2: ['typePeripherique', 'marque', 'modele', 'garantie', 'etat', 'description']
        },
        'webcam-videoconference': {
          step2: ['typePeripherique', 'marque', 'modele', 'garantie', 'etat', 'description']
        },
        'cables-adaptateurs': {
          step2: ['typePeripherique', 'marque', 'modele', 'etat', 'description']
        },
        'logiciels-abonnements': {
          step2: ['description']
        },
        'autre-informatique': {
          step2: ['marque', 'modele', 'etat', 'description']
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
          step2: ['marque', 'modele', 'annee', 'typePiece', 'position', 'etat', 'garantie', 'referenceOem', 'compatibilite', 'kilometrage', 'quantite', 'description']
        },
        'pieces-moto': {
          step2: ['marque', 'modele', 'annee', 'typePiece', 'etat', 'garantie', 'referenceOem', 'compatibilite', 'quantite', 'description']
        },
        'pieces-bateaux': {
          step2: ['marque', 'modele', 'annee', 'typePiece', 'etat', 'garantie', 'description']
        },
        'lubrifiants': {
          step2: ['marque', 'typeLubrifiant', 'viscosite', 'quantite', 'etat', 'description']
        },
        'outils-diagnostics': {
          step2: ['typeOutilDiagnostic', 'marque', 'modele', 'etat', 'garantie', 'description']
        },
        'alarme-securite': {
          step2: ['typeAlarme', 'marque', 'modele', 'etat', 'garantie', 'description']
        },
        'nettoyage-entretien': {
          step2: ['typeNettoyage', 'marque', 'quantite', 'etat', 'description']
        },
        'autres-pieces': {
          step2: ['marque', 'modele', 'typePiece', 'etat', 'description']
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
          step2: ['typeMeuble', 'marque', 'modele', 'matiere', 'couleur', 'dimensions', 'etat', 'description']
        },
        'chambres-coucher': {
          step2: ['typeMeuble', 'marque', 'modele', 'matiere', 'couleur', 'dimensions', 'etat', 'description']
        },
        'tables': {
          step2: ['typeMeuble', 'marque', 'modele', 'matiere', 'couleur', 'dimensions', 'etat', 'description']
        },
        'canape': {
          step2: ['typeMeuble', 'marque', 'modele', 'matiere', 'couleur', 'dimensions', 'etat', 'description']
        },
        'lits': {
          step2: ['typeMeuble', 'marque', 'modele', 'matiere', 'couleur', 'dimensions', 'etat', 'description']
        },
        'tables-pc-bureaux': {
          step2: ['typeMeubleBureau', 'marque', 'modele', 'matiere', 'couleur', 'dimensions', 'etat', 'description']
        },
        'decoration': {
          step2: ['typeDecoration', 'marque', 'matiere', 'couleur', 'dimensions', 'etat', 'description']
        },
        'vaisselle': {
          step2: ['typeVaisselle', 'matiereVaisselle', 'nbPieces', 'etat', 'description']
        },
        'literie-linge': {
          step2: ['typeLiterie', 'tailleLiterie', 'matiere', 'couleur', 'etat', 'description']
        },
        'tapis-moquettes': {
          step2: ['formeTapis', 'matiere', 'couleur', 'dimensions', 'etat', 'description']
        },
        'puericulture': {
          step2: ['typePuericulture', 'ageBebe', 'marque', 'modele', 'etat', 'description']
        },
        'rideaux': {
          step2: ['marque', 'matiere', 'couleur', 'dimensions', 'etat', 'description']
        },
        'fournitures-scolaires': {
          step2: ['typeFourniture', 'marque', 'etat', 'description']
        },
        'autre-meubles': {
          step2: ['typeMeuble', 'marque', 'modele', 'matiere', 'couleur', 'etat', 'description']
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
          step2: ['marque', 'modele', 'typeMateriel', 'puissance', 'tension', 'garantie', 'etat', 'description']
        },
        'outillage-professionnel': {
          step2: ['marque', 'modele', 'typeOutil', 'diametre', 'nbVitesses', 'garantie', 'etat', 'description']
        },
        'materiel-agricole': {
          step2: ['marque', 'modele', 'typeAgricole', 'annee', 'heures', 'garantie', 'etat', 'description']
        },
        'materiaux-construction': {
          step2: ['typeMateriauConstruction', 'quantite', 'uniteMesure', 'etat', 'description']
        },
        'matieres-premieres': {
          step2: ['typeMatierePremiere', 'quantite', 'purete', 'etat', 'description']
        },
        'produits-hygiene': {
          step2: ['typeHygiene', 'marque', 'volume', 'quantite', 'etat', 'description']
        },
        'autre-materiaux': {
          step2: ['marque', 'modele', 'etat', 'description']
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
          step2: ['destination', 'duree', 'dateDepart', 'dateRetour', 'nombrePersonnes', 'transport', 'hebergement', 'activitesIncluses', 'description']
        },
        'location-vacances-voyages': {
          step2: ['destination', 'typeHebergement', 'capacite', 'equipements', 'proximite', 'dateDepart', 'dateRetour', 'description']
        },
        'hajj-omra': {
          step2: ['typePelerinage', 'destination', 'groupe', 'duree', 'dateDepart', 'hotelMakkah', 'hotelMadinah', 'vols', 'nombrePersonnes', 'description']
        },
        'reservations-visa': {
          step2: ['compagnie', 'destination', 'typeVoyage', 'nombrePersonnes', 'description']
        },
        'sejour': {
          step2: ['destination', 'typeSejour', 'categorieHotel', 'duree', 'dateDepart', 'dateRetour', 'nombrePersonnes', 'description']
        },
        'croisiere': {
          step2: ['nomBateau', 'destination', 'cabine', 'duree', 'dateDepart', 'dateRetour', 'nombrePersonnes', 'description']
        },
        'autre-voyages': {
          step2: ['destination', 'duree', 'description']
        }
      }
    },
    'alimentaires': {
      step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description'],
      step3: ['price', 'typeOffre'],
      step4: ['wilaya', 'commune', 'telephone', 'email'],
      step5: ['images'],
      subCategories: {
        'produits-laitiers': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'fruits-secs': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'graines-riz-cereales': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'sucres-produits-sucres': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'boissons': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'viandes-poissons': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'cafe-the-infusion': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'complements-alimentaires': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'miel-derives': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'fruits-legumes': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'ble-farine': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'bonbons-chocolat': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'boulangerie-viennoiserie': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'ingredients-cuisine-patisserie': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'noix-graines': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'plats-cuisines': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'sauces-epices-condiments': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'oeufs': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'huiles': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'pates': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'gateaux': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'emballage': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'aliments-bebe': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'aliments-dietetiques': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
        },
        'autre-alimentaires': {
          step2: ['typeProduit', 'marque', 'datePeremption', 'conditionnement', 'poidsQuantite', 'composition', 'certifications', 'description']
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
          step2: ['poste', 'typeContrat', 'secteurActivite', 'experienceRequise', 'niveauEtudes', 'competences', 'salaire', 'avantages', 'lieuTravail', 'horaires', 'description']
        },
        'demandes-emploi': {
          step2: ['nomCandidat', 'poste', 'secteurActivite', 'experienceRequise', 'competences', 'disponibilite', 'mobilite', 'pretentionsSalariales', 'description']
        },
        'autres-services-emploi': {
          step2: ['typeService', 'description']
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
          step2: ['marque', 'modele', 'typeConsole', 'genreJeu', 'etat', 'description']
        },
        'instruments-musique': {
          step2: ['marque', 'modele', 'typeInstrument', 'etat', 'description']
        },
        'livres-magazines': {
          step2: ['auteur', 'genreLitteraire', 'etat', 'description']
        },
        'animalerie': {
          step2: ['typeAnimal', 'etat', 'description']
        },
        'jardinage': {
          step2: ['marque', 'modele', 'typeProduitLoisir', 'etat', 'description']
        },
        'barbecue-grillades': {
          step2: ['marque', 'modele', 'typeProduitLoisir', 'etat', 'description']
        },
        'jouets': {
          step2: ['marque', 'modele', 'etat', 'description']
        },
        'chasse-peche': {
          step2: ['marque', 'modele', 'etat', 'description']
        },
        'jeux-loisirs': {
          step2: ['marque', 'modele', 'etat', 'description']
        },
        'vapes-chichas': {
          step2: ['marque', 'modele', 'etat', 'description']
        },
        'produits-accessoires-ete': {
          step2: ['marque', 'modele', 'etat', 'description']
        },
        'antiquites-collections': {
          step2: ['etat', 'description']
        },
        'autre-loisirs': {
          step2: ['marque', 'modele', 'etat', 'description']
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
          step2: ['typeProduitFootball', 'marque', 'modele', 'tailleChaussure', 'tailleVetementSport', 'etat', 'description']
        },
        'hand-voley-basket': {
          step2: ['marque', 'modele', 'tailleChaussure', 'tailleVetementSport', 'etat', 'description']
        },
        'sport-combat': {
          step2: ['typeEquipementCombat', 'marque', 'modele', 'tailleVetementSport', 'etat', 'description']
        },
        'fitness-musculation': {
          step2: ['typeEquipementFitness', 'marque', 'modele', 'poids', 'etat', 'description']
        },
        'natation': {
          step2: ['typeEquipementNatation', 'marque', 'tailleVetementSport', 'etat', 'description']
        },
        'velos-trotinettes': {
          step2: ['typeVelo', 'marque', 'modele', 'tailleVelo', 'etat', 'description']
        },
        'sports-raquette': {
          step2: ['typeSportRaquette', 'marque', 'modele', 'etat', 'description']
        },
        'sport-aquatiques': {
          step2: ['marque', 'modele', 'etat', 'description']
        },
        'equitation': {
          step2: ['marque', 'modele', 'tailleVetementSport', 'etat', 'description']
        },
        'petanque': {
          step2: ['marque', 'modele', 'etat', 'description']
        },
        'autres-sports': {
          step2: ['marque', 'modele', 'etat', 'description']
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
          step2: ['typeService', 'zoneIntervention', 'experience', 'diplomes', 'materielUtilise', 'garantieService', 'references', 'dureeService', 'disponibiliteService', 'description']
        },
        'ecoles-formations': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'diplomes', 'langues', 'horaires', 'description']
        },
        'industrie-fabrication-services': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'materielUtilise', 'dureeService', 'description']
        },
        'transport-demenagement': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'materielUtilise', 'description']
        },
        'decoration-amenagement': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'references', 'dureeService', 'description']
        },
        'publicite-communication': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'references', 'description']
        },
        'nettoyage-jardinage': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'materielUtilise', 'dureeService', 'description']
        },
        'froid-climatisation': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'materielUtilise', 'garantieService', 'description']
        },
        'traiteurs-gateaux': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'references', 'description']
        },
        'medecine-sante': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'diplomes', 'langues', 'horaires', 'description']
        },
        'reparation-auto-diagnostic': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'materielUtilise', 'garantieService', 'description']
        },
        'securite-alarme': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'materielUtilise', 'garantieService', 'description']
        },
        'projets-etudes': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'diplomes', 'references', 'description']
        },
        'bureautique-internet': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'langues', 'horaires', 'description']
        },
        'location-vehicules': {
          step2: ['typeService', 'zoneIntervention', 'description']
        },
        'menuiserie-meubles': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'references', 'dureeService', 'description']
        },
        'impression-edition': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'description']
        },
        'hotellerie-restauration-salles': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'description']
        },
        'esthetique-beaute': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'diplomes', 'horaires', 'description']
        },
        'image-son': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'materielUtilise', 'description']
        },
        'comptabilite-economie': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'diplomes', 'description']
        },
        'couture-confection': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'references', 'dureeService', 'description']
        },
        'maintenance-informatique': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'materielUtilise', 'garantieService', 'description']
        },
        'reparation-electromenager': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'materielUtilise', 'garantieService', 'description']
        },
        'evenements-divertissement': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'references', 'description']
        },
        'paraboles-demos': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'materielUtilise', 'description']
        },
        'reparation-electronique': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'materielUtilise', 'garantieService', 'description']
        },
        'services-etranger': {
          step2: ['typeService', 'zoneIntervention', 'langues', 'description']
        },
        'flashage-reparation-telephones': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'materielUtilise', 'garantieService', 'description']
        },
        'flashage-installation-jeux': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'description']
        },
        'juridique': {
          step2: ['typeService', 'zoneIntervention', 'experience', 'diplomes', 'langues', 'description']
        },
        'autres-services': {
          step2: ['typeService', 'zoneIntervention', 'description']
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