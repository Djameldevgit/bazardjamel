// src/components/CATEGORIES/FieldConfig.js

export const DYNAMIC_FIELDS_CONFIG = {
  // ============ ALIMENTAIRES ============
  'alimentaires': {
    step2: ['title', 'description', 'reference', 'livraison'],
    step3: ['price', 'unite', 'typeOffre', 'echange', 'grossdtail'],
    step4: ['wilaya', 'telephone', 'email'],
    step5: ['images']
  },
  'boutiques': {
    // Campos comunes para todas las boutiques
    step2: [
      'nom_boutique', 
      'domaine_boutique', 
      'slogan_boutique', 
      'description_boutique',
      'categories_produits',
      'couleur_theme'
    ],
    step3: [
      'plan_boutique', 
      'duree_abonnement',
      'total_credits',
      'stockage_max',
      'inclusions_plan'
    ],
    step4: [
      'proprietaire_nom', 
      'proprietaire_email', 
      'proprietaire_telephone',
      'proprietaire_wilaya',
      'proprietaire_adresse',
      'reseaux_sociaux',
      'accepte_conditions'
    ],
    step5: ['images', 'logo_boutique']
  },
  // ============ VÉHICULES ============
  'vehicules': {
    step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'annee', 'kilometrage', 'carburant', 'boiteVitesse'],
    step3: ['price', 'unite', 'typeOffre', 'echange', 'puissance', 'couleur', 'options'],
    step4: ['wilaya', 'adresse', 'telephone', 'email'],
    step5: ['images'],
    subCategories: {
      'automobiles': {
        step2: [  'marque', 'modele', 'annee', , 'couleur','kilometrage', 'carburant', 'boiteVitesse' , 'optionduvoiture' ],
        step3: ['price','unite', 'typeOffre', 'echange'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'utilitaires': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'annee', 'kilometrage', 'carburant', 'chargeUtile'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'puissance', 'couleur', 'options'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'motos': {
        step2: [ 'marqueVehicules', 'modeleVehicules', 'annee', , 'couleur','kilometrage', 'carburant', 'description'],
        step3: ['price','unite', 'typeOffre', 'echange'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'quads': {
        step2: [  'marqueVehicules', 'modeleVehicules', 'annee', , 'couleur','kilometrage', 'carburant', 'description'],
        step3: ['price','unite', 'typeOffre', 'echange'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'fourgons':{
        step2: [  'marqueVehicules', 'modeleVehicules', 'annee', , 'couleur','kilometrage', 'carburant', 'description'],
        step3: ['price','unite', 'typeOffre', 'echange'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'camions': {
        step2: [  'marqueVehicules', 'modeleVehicules', 'annee', , 'couleur','kilometrage', 'carburant', 'description'],
        step3: ['price','unite', 'typeOffre', 'echange'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'bus':{
        step2: [  'marqueVehicules', 'modeleVehicules', 'annee', , 'couleur','kilometrage', 'carburant', 'description'],
        step3: ['price','unite', 'typeOffre', 'echange'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'engins': {
        step2: [  'marqueVehicules', 'modeleVehicules', 'annee', , 'couleur','kilometrage', 'carburant', 'description'],
        step3: ['price','unite', 'typeOffre', 'echange'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'tracteurs': {
        step2: [  'marqueVehicules', 'modeleVehicules', 'annee', , 'couleur','kilometrage', 'carburant', 'description'],
        step3: ['price','unite', 'typeOffre', 'echange'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'remorques':{
        step2: [  'marqueVehicules', 'modeleVehicules', 'annee', , 'couleur','kilometrage', 'carburant', 'description'],
        step3: ['price','unite', 'typeOffre', 'echange'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'bateaux': {
        step2: [  'marqueVehicules', 'modeleVehicules', 'annee', , 'couleur','kilometrage', 'carburant', 'description'],
        step3: ['price','unite', 'typeOffre', 'echange'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
    }
  },

  // ============ TÉLÉPHONES ============
  'telephones': {
    step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur', 'garantie', 'accessoires'],
    step3: ['price', 'unite', 'typeOffre', 'echange', 'capaciteStockage', 'ram', 'systemeExploitation', 'reseau', 'camera', 'batterie'],
    step4: ['wilaya', 'adresse', 'telephone', 'email'],
    step5: ['images'],
    subCategories: {
      'smartphones': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur', 'garantie', 'accessoires'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'capaciteStockage', 'ram', 'systemeExploitation', 'reseau', 'camera', 'batterie', 'ecran'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'telephones_cellulaires': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'reseau', 'batterie'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'tablettes': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur', 'tailleEcran'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'capaciteStockage', 'ram', 'systemeExploitation', 'batterie'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'fixes_fax': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeFix'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'smartwatchs': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'systemeExploitation', 'batterie', 'taille'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'protection_antichoc': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur', 'typeProtection'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'compatibilite', 'materiau'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'ecouteurs_son': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur', 'typeEcouteurs'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'connectivite', 'batterie'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'chargeurs_cables': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeAccessoire', 'quantite'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'supports_stabilisateurs': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeSupport', 'compatibilite'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'manettes': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'compatibilite', 'typeManette'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'vr': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'compatibilite', 'resolution'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'power_banks': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'capacite', 'nombrePorts'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'stylets': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'compatibilite', 'typeStylet'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'cartes_memoire': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'capacite', 'vitesse'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'accessoires': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeAccessoire', 'quantite'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'pieces_rechange': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typePiece'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'compatibilite', 'etat'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'offres_abonnements': {
        step2: ['title', 'description', 'reference', 'operateur'],
        step3: ['price', 'unite', 'typeOffre', 'duree', 'data', 'appels'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      }
    }
  },

  // ============ INFORMATIQUE ============
  'informatique': {
    step2: ['title', 'description', 'etat', 'reference', 'typeProduit', 'marque', 'modele', 'processeur', 'carteGraphique'],
    step3: ['price', 'unite', 'typeOffre', 'echange', 'ram', 'stockage', 'systemeExploitation', 'garantie'],
    step4: ['wilaya', 'adresse', 'telephone', 'email'],
    step5: ['images'],
    subCategories: {
      'ordinateurs_portables': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'processeur', 'carteGraphique', 'tailleEcran'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'ram', 'stockage', 'systemeExploitation', 'garantie', 'batterie'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'ordinateurs_bureau': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'processeur', 'carteGraphique'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'ram', 'stockage', 'systemeExploitation', 'garantie'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'serveurs': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'processeur', 'ram'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'stockage', 'typeServeur', 'garantie'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'ecrans': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'taille', 'resolution'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeEcran', 'refreshRate', 'garantie'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'composants_pc_fixe': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeComposant'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'specifications', 'garantie'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'composants_pc_portable': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeComposant'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'specifications', 'garantie'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'composants_serveur': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeComposant'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'specifications', 'garantie'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'imprimantes_cartouches': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeImprimante'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'fonctions', 'garantie'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'reseau_connexion': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeReseau'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'vitesse', 'ports'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'stockage_externe_racks': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeStockage'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'capacite', 'vitesse'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'onduleurs_stabilisateurs': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'puissance', 'typeProtection'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'compteuses_billets': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'vitesse', 'devises'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'claviers_souris': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeClavier'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'connectivite', 'ergonomie'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'casques_son': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeCasque', 'connectivite'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'webcam_videoconference': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'resolution', 'microphone'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'data_shows': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'luminosite', 'resolution'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'cables_adaptateurs': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeCable', 'longueur'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'stylets_tablettes': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'compatibilite', 'typeStylet'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'cartables_sacoches': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'capacite', 'materiau'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'manettes_simulateurs': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'compatibilite', 'typeManette'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'vr': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'compatibilite', 'resolution'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      }
    }
  },

  // ============ IMMOBILIER ============
  'immobilier': {
    step2: ['title', 'description', 'etat', 'reference', 'typeImmobilier', 'operationType', 'surface', 'chambres', 'sallesBain'],
    step3: ['price', 'unite', 'typeOffre', 'echange', 'loyer', 'charges', 'etage', 'meuble'],
    step4: ['wilaya', 'adresse', 'telephone', 'email', 'quartier', 'proximiteTransport', 'parking'],
    step5: ['images'],
    subCategories: {
      'appartement': {
        step2: ['title', 'description', 'etat', 'reference', 'operationType', 'surface', 'chambres', 'sallesBain', 'etage'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'loyer', 'charges', 'meuble', 'ascenseur'],
        step4: ['wilaya', 'adresse', 'telephone', 'email', 'quartier'],
        step5: ['images']
      },
      'villa': {
        step2: ['title', 'description', 'etat', 'reference', 'operationType', 'surface', 'chambres', 'sallesBain', 'etages'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'jardin', 'piscine', 'garage'],
        step4: ['wilaya', 'adresse', 'telephone', 'email', 'quartier'],
        step5: ['images']
      },
      'terrain': {
        step2: ['title', 'description', 'etat', 'reference', 'operationType', 'surface', 'typeTerrain'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'viabilise', 'pente'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'local': {
        step2: ['title', 'description', 'etat', 'reference', 'operationType', 'surface', 'typeLocal'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'loyer', 'charges'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'immeuble': {
        step2: ['title', 'description', 'etat', 'reference', 'operationType', 'surface', 'etages', 'appartements'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'ascenseur', 'garage'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'bungalow': {
        step2: ['title', 'description', 'etat', 'reference', 'operationType', 'surface', 'chambres'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'equipements', 'vue'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'terrain_agricole': {
        step2: ['title', 'description', 'etat', 'reference', 'operationType', 'surface', 'typeCulture'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'irrigation', 'accessibilite'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      }
    }
  },

  // ============ ÉLECTROMÉNAGER ============
  'electromenager': {
    step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeAppareil', 'classeEnergetique'],
    step3: ['price', 'unite', 'typeOffre', 'echange', 'anneeFabrication', 'garantie', 'consommation'],
    step4: ['wilaya', 'adresse', 'telephone', 'email'],
    step5: ['images'],
    subCategories: {
      'televiseurs': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'taille', 'resolution'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'smartTV', 'garantie'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'demodulateurs_box_tv': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'compatibilite', 'garantie'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'paraboles_switch_tv': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeParabole', 'canaux'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'abonnements_iptv': {
        step2: ['title', 'description', 'reference', 'operateur'],
        step3: ['price', 'unite', 'typeOffre', 'duree', 'canaux'],
        step4: ['wilaya', 'telephone', 'email'],
        step5: ['images']
      },
      'cameras_accessories': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'resolution', 'typeCamera'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'audio': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'puissance', 'typeAudio'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'refrigerateurs_congelateurs': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'capacite', 'classeEnergetique'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'machines_laver': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'capacite', 'programmes'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'lave_vaisselles': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'capacite', 'programmes'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'fours_cuisson': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeFour', 'capacite'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'chauffage_climatisation': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'puissance', 'typeClimatisation'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'appareils_cuisine': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeAppareil'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'puissance', 'capacite'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'aspirateurs_nettoyeurs': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'puissance', 'typeAspirateur'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'repassage': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeRepassage', 'puissance'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'beaute_hygiene': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeAppareil', 'fonctions'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'machines_coudre': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeMachine', 'programmes'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'telecommandes': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'compatibilite', 'fonctions'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'securite_gps': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeSecurite', 'fonctions'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'composants_electroniques': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeComposant', 'specifications'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'pieces_rechange': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typePiece'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'compatibilite', 'etat'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'autre': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeAppareil'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      }
    }
  },

  // ============ PIÈCES DÉTACHÉES ============
  'piecesDetachees': {
    step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typePiece'],
    step3: ['price', 'unite', 'typeOffre', 'echange', 'compatibilite', 'garantie'],
    step4: ['wilaya', 'adresse', 'telephone', 'email'],
    step5: ['images'],
    subCategories: {
      'pieces_automobiles': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typePiece'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'compatibilite', 'garantie'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'pieces_vehicules': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typePiece'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'compatibilite', 'garantie'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'pieces_moto': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typePiece'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'compatibilite', 'garantie'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'pieces_bateaux': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typePiece'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'compatibilite', 'garantie'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'alarme_securite': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeAlarme', 'fonctions'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'nettoyage_entretien': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeProduit'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'quantite', 'application'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'outils_diagnostics': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeOutil', 'fonctions'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'lubrifiants': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeLubrifiant'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'quantite', 'viscosite'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      }
    }
  },

  // ============ VÊTEMENTS ============
  'vetements': {
    step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur', 'taille'],
    step3: ['price', 'unite', 'typeOffre', 'echange', 'matiere', 'occasion'],
    step4: ['wilaya', 'adresse', 'telephone', 'email'],
    step5: ['images'],
    subCategories: {
      'vetements_homme': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur', 'taille', 'typeVetement'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'matiere', 'occasion'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'vetements_femme': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur', 'taille', 'typeVetement'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'matiere', 'occasion'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'chaussures_homme': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur', 'pointure', 'typeChaussure'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'matiere', 'occasion'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'chaussures_femme': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur', 'pointure', 'typeChaussure'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'matiere', 'occasion', 'hauteurTalon'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'garcons': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur', 'taille', 'ageRecommandé'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'matiere', 'occasion'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'filles': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur', 'taille', 'ageRecommandé'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'matiere', 'occasion'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'bebe': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur', 'taille', 'age'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'matiere', 'typeVetement'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'tenues_pro': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur', 'taille', 'profession'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'matiere', 'occasion'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'sacs': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur', 'typeSac'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'matiere', 'occasion', 'capacite'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'montres': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeMontre', 'materiauBracelet'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'lunettes': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur', 'typeLunettes'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'correction', 'protection'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'bijoux': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'couleur', 'typeBijou'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'materiau', 'pierres'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      }
    }
  },

  // ============ SANTÉ & BEAUTÉ ============
  'santebeaute': {
    step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeProduit'],
    step3: ['price', 'unite', 'typeOffre', 'echange', 'quantite', 'datePeremption'],
    step4: ['wilaya', 'adresse', 'telephone', 'email'],
    step5: ['images'],
    subCategories: {
      'cosmetiques_beaute': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeCosmetique'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'quantite', 'datePeremption', 'typePeau'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'parfums_deodorants_femme': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeParfum'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'quantite', 'datePeremption', 'familleOlfactive'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'parfums_deodorants_homme': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeParfum'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'quantite', 'datePeremption', 'familleOlfactive'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'parapharmacie_sante': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeProduit'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'quantite', 'datePeremption', 'usage'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      }
    }
  },

  // ============ MEUBLES ============
  'meubles': {
    step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeMeuble'],
    step3: ['price', 'unite', 'typeOffre', 'echange', 'matiere', 'dimensions'],
    step4: ['wilaya', 'adresse', 'telephone', 'email'],
    step5: ['images'],
    subCategories: {
      'meubles_maison': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeMeuble'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'matiere', 'dimensions', 'style'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'decoration': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeDecoration'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'matiere', 'dimensions'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'vaisselle': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeVaisselle'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'matiere', 'nombrePieces'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'meubles_bureau': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeMeubleBureau'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'matiere', 'dimensions', 'ergonomie'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'rideaux': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeRideau'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'matiere', 'dimensions', 'opacite'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'literie_linge': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeLiterie'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'matiere', 'dimensions', 'composition'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'puericulture': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeProduit'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'matiere', 'ageRecommandé', 'securite'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'tapis_moquettes': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeTapis'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'matiere', 'dimensions', 'epaisseur'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'meubles_exterieur': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeMeuble'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'matiere', 'dimensions', 'resistanceMeteo'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'fournitures_scolaires': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeFourniture'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'quantite', 'ageRecommandé'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'luminaire': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeLuminaire'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'puissance', 'typeAmpoule', 'design'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'autre': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeMeuble'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      }
    }
  },

  // ============ LOISIRS ============
  'loisirs': {
    step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
    step3: ['price', 'unite', 'typeOffre', 'echange', 'ageRecommandé'],
    step4: ['wilaya', 'adresse', 'telephone', 'email'],
    step5: ['images'],
    subCategories: {
      'animalerie': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeAnimal'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'age', 'race', 'vaccin'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'consoles_jeux_videos': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeConsole', 'jeuxInclus'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'livres_magazines': {
        step2: ['title', 'description', 'etat', 'reference', 'auteur', 'editeur'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'genre', 'nombrePages', 'langue'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'instruments_musique': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeInstrument', 'materiau'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'jeux_loisirs': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeJeu', 'nombreJoueurs', 'ageRecommandé'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'jouets': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeJouet', 'ageRecommandé', 'materiau'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'chasse_peche': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeEquipement', 'materiau'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'jardinage': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeOutils', 'materiau'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'antiquites_collections': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'age', 'origine', 'etatConservation'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'barbecue_grillades': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeBarbecue', 'materiau', 'dimensions'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'vapes_chichas': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeProduit', 'aromes'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'produits_accesoires_ete': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeProduit', 'materiau', 'protectionUV'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'autre': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeLoisir'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      }
    }
  },

  // ============ SPORT ============
  'sport': {
    step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
    step3: ['price', 'unite', 'typeOffre', 'echange', 'taille'],
    step4: ['wilaya', 'adresse', 'telephone', 'email'],
    step5: ['images'],
    subCategories: {
      'football': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeEquipement'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'taille', 'couleur'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'hand_voley_basket': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeEquipement'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'taille', 'couleur', 'typeSport'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'sport_combat': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeEquipement'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'taille', 'poids', 'typeSport'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'fitness_musculation': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeEquipement'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'poids', 'dimensions'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'natation': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeEquipement'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'taille', 'materiau'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'velos_trotinettes': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeVehicule'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'tailleRoue', 'vitesses', 'couleur'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'sports_raquette': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeSport'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'taille', 'poids', 'tension'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'sport_aquatiques': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeEquipement'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'taille', 'materiau', 'flottabilite'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      }
    }
  },

  // ============ SERVICES ============
  'services': {
    step2: ['title', 'description', 'reference', 'typeService'],
    step3: ['price', 'unite', 'typeOffre', 'duree', 'disponibilite'],
    step4: ['wilaya', 'adresse', 'telephone', 'email'],
    step5: ['images'],
    subCategories: {
      'construction_travaux': {
        step2: ['title', 'description', 'reference', 'typeTravaux'],
        step3: ['price', 'unite', 'typeOffre', 'duree', 'surface', 'materiaux'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'ecoles_formations': {
        step2: ['title', 'description', 'reference', 'typeFormation'],
        step3: ['price', 'unite', 'typeOffre', 'duree', 'niveau', 'certification'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'industrie_fabrication': {
        step2: ['title', 'description', 'reference', 'typeIndustrie'],
        step3: ['price', 'unite', 'typeOffre', 'capacite', 'delai'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'transport_demenagement': {
        step2: ['title', 'description', 'reference', 'typeTransport'],
        step3: ['price', 'unite', 'typeOffre', 'distance', 'volume', 'vehicule'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'decoration_amenagement': {
        step2: ['title', 'description', 'reference', 'typeDecoration'],
        step3: ['price', 'unite', 'typeOffre', 'surface', 'style', 'materiaux'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'publicite_communication': {
        step2: ['title', 'description', 'reference', 'typePublicite'],
        step3: ['price', 'unite', 'typeOffre', 'duree', 'support', 'portée'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'nettoyage_jardinage': {
        step2: ['title', 'description', 'reference', 'typeService'],
        step3: ['price', 'unite', 'typeOffre', 'surface', 'frequence', 'equipements'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'froid_climatisation': {
        step2: ['title', 'description', 'reference', 'typeService'],
        step3: ['price', 'unite', 'typeOffre', 'puissance', 'marque', 'garantie'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'traiteurs_gateaux': {
        step2: ['title', 'description', 'reference', 'typeTraiteur'],
        step3: ['price', 'unite', 'typeOffre', 'nombrePersonnes', 'menu', 'livraison'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'medecine_sante': {
        step2: ['title', 'description', 'reference', 'typeService'],
        step3: ['price', 'unite', 'typeOffre', 'specialite', 'disponibilite'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'reparation_auto_diagnostic': {
        step2: ['title', 'description', 'reference', 'typeReparation'],
        step3: ['price', 'unite', 'typeOffre', 'marque', 'probleme', 'delai'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'securite_alarme': {
        step2: ['title', 'description', 'reference', 'typeSecurite'],
        step3: ['price', 'unite', 'typeOffre', 'surface', 'typeSysteme', 'monitoring'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'projets_etudes': {
        step2: ['title', 'description', 'reference', 'typeProjet'],
        step3: ['price', 'unite', 'typeOffre', 'domaine', 'delai', 'complexite'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'bureautique_internet': {
        step2: ['title', 'description', 'reference', 'typeService'],
        step3: ['price', 'unite', 'typeOffre', 'debit', 'equipements', 'support'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'location_vehicules': {
        step2: ['title', 'description', 'reference', 'typeVehicule'],
        step3: ['price', 'unite', 'typeOffre', 'duree', 'kilometrage', 'assurance'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'menuiserie_meubles': {
        step2: ['title', 'description', 'reference', 'typeMenuiserie'],
        step3: ['price', 'unite', 'typeOffre', 'materiau', 'dimensions', 'design'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'impression_edition': {
        step2: ['title', 'description', 'reference', 'typeImpression'],
        step3: ['price', 'unite', 'typeOffre', 'quantite', 'format', 'couleur'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'hotellerie_restauration_salles': {
        step2: ['title', 'description', 'reference', 'typeService'],
        step3: ['price', 'unite', 'typeOffre', 'capacite', 'duree', 'services'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'esthetique_beaute': {
        step2: ['title', 'description', 'reference', 'typeService'],
        step3: ['price', 'unite', 'typeOffre', 'duree', 'produits', 'certification'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'image_son': {
        step2: ['title', 'description', 'reference', 'typeService'],
        step3: ['price', 'unite', 'typeOffre', 'duree', 'equipements', 'equipe'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'comptabilite_economie': {
        step2: ['title', 'description', 'reference', 'typeService'],
        step3: ['price', 'unite', 'typeOffre', 'typeComptabilite', 'frequence', 'logiciels'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'couture_confection': {
        step2: ['title', 'description', 'reference', 'typeCouture'],
        step3: ['price', 'unite', 'typeOffre', 'typeVetement', 'tissu', 'delai'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'maintenance_informatique': {
        step2: ['title', 'description', 'reference', 'typeMaintenance'],
        step3: ['price', 'unite', 'typeOffre', 'typeEquipement', 'probleme', 'urgence'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'reparation_electromenager': {
        step2: ['title', 'description', 'reference', 'typeAppareil'],
        step3: ['price', 'unite', 'typeOffre', 'marque', 'probleme', 'delai'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'evenements_divertissement': {
        step2: ['title', 'description', 'reference', 'typeEvenement'],
        step3: ['price', 'unite', 'typeOffre', 'duree', 'nombrePersonnes', 'animations'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'paraboles_demos': {
        step2: ['title', 'description', 'reference', 'typeInstallation'],
        step3: ['price', 'unite', 'typeOffre', 'typeParabole', 'canaux', 'garantie'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'reparation_electronique': {
        step2: ['title', 'description', 'reference', 'typeAppareil'],
        step3: ['price', 'unite', 'typeOffre', 'marque', 'probleme', 'delai'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'services_etranger': {
        step2: ['title', 'description', 'reference', 'typeService'],
        step3: ['price', 'unite', 'typeOffre', 'pays', 'duree', 'documents'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'flashage_reparation_telephones': {
        step2: ['title', 'description', 'reference', 'typeTelephone'],
        step3: ['price', 'unite', 'typeOffre', 'marque', 'probleme', 'delai'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'flashage_installation_jeux': {
        step2: ['title', 'description', 'reference', 'typeConsole'],
        step3: ['price', 'unite', 'typeOffre', 'marque', 'jeux', 'delai'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'juridique': {
        step2: ['title', 'description', 'reference', 'typeService'],
        step3: ['price', 'unite', 'typeOffre', 'domaine', 'complexite', 'delai'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      }
    }
  },

  // ============ MATÉRIAUX ============
  'materiaux': {
    step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele', 'typeMateriau'],
    step3: ['price', 'unite', 'typeOffre', 'echange', 'quantite', 'dimensions'],
    step4: ['wilaya', 'adresse', 'telephone', 'email'],
    step5: ['images'],
    subCategories: {
      'materiel_professionnel': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeEquipement', 'puissance'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'outillage_professionnel': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeOutil', 'materiau'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'materiaux_construction': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeMateriau', 'dimensions', 'resistance'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'matieres_premieres': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeMatiere', 'pureté', 'quantite'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'produits_hygiene': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeProduit', 'quantite', 'datePeremption'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'materiel_agricole': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeEquipement', 'puissance', 'largeur'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'autre': {
        step2: ['title', 'description', 'etat', 'reference', 'marque', 'modele'],
        step3: ['price', 'unite', 'typeOffre', 'echange', 'typeMateriau'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      }
    }
  },

  // ============ VOYAGES ============
  'voyages': {
    step2: ['title', 'description', 'reference', 'typeVoyage'],
    step3: ['price', 'unite', 'typeOffre', 'duree', 'inclusions'],
    step4: ['wilaya', 'adresse', 'telephone', 'email'],
    step5: ['images'],
    subCategories: {
      'voyage_organise': {
        step2: ['title', 'description', 'reference', 'destination'],
        step3: ['price', 'unite', 'typeOffre', 'duree', 'transport', 'hotel', 'repas'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'location_vacances': {
        step2: ['title', 'description', 'reference', 'destination', 'typeLogement'],
        step3: ['price', 'unite', 'typeOffre', 'duree', 'capacite', 'equipements'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'hajj_omra': {
        step2: ['title', 'description', 'reference', 'typePelerinage'],
        step3: ['price', 'unite', 'typeOffre', 'duree', 'transport', 'hotel', 'guide'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'reservations_visa': {
        step2: ['title', 'description', 'reference', 'destination'],
        step3: ['price', 'unite', 'typeOffre', 'typeVisa', 'delai', 'documents'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'sejour': {
        step2: ['title', 'description', 'reference', 'destination'],
        step3: ['price', 'unite', 'typeOffre', 'duree', 'typeSejour', 'activites'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'croisiere': {
        step2: ['title', 'description', 'reference', 'destination'],
        step3: ['price', 'unite', 'typeOffre', 'duree', 'navire', 'cabine'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      },
      'autre': {
        step2: ['title', 'description', 'reference', 'typeVoyage'],
        step3: ['price', 'unite', 'typeOffre', 'duree', 'services'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      }
    }
  },

  // ============ EMPLOI ============
  'emploi': {
    step2: ['title', 'description', 'reference', 'typeEmploi', 'secteur', 'experience'],
    step3: ['salaire', 'typeContrat', 'localisation', 'teletravail', 'avantages'],
    step4: ['wilaya', 'adresse', 'telephone', 'email', 'nomSociete'],
    step5: ['images'],
    subCategories: {
      'offres_emploi': {
        step2: ['title', 'description', 'reference', 'poste', 'secteur', 'experienceRequise'],
        step3: ['salaire', 'typeContrat', 'localisation', 'teletravail', 'avantages'],
        step4: ['wilaya', 'adresse', 'telephone', 'email', 'nomSociete'],
        step5: ['images']
      },
      'demandes_emploi': {
        step2: ['title', 'description', 'reference', 'posteRecherche', 'secteur', 'experience'],
        step3: ['salaireSouhaite', 'typeContrat', 'localisation', 'mobilite', 'competences'],
        step4: ['wilaya', 'adresse', 'telephone', 'email'],
        step5: ['images']
      }
    }
  }
};


// 🔥 FUNCIÓN SIMPLE PARA OBTENER CAMPOS
// ============ FUNCIONES ACTUALIZADAS ============

// 🔥 FUNCIÓN PRINCIPAL MEJORADA - ACEPTA SUBCATEGORÍA
export const getFieldsForCategory = (mainCategory, subCategory = null, step = null) => {
  console.log('🔍 FieldConfig - Buscando campos:', { mainCategory, subCategory, step });
  
  if (!mainCategory) {
    console.log('⚠️ No hay categoría seleccionada');
    return step ? [] : { step2: [], step3: [], step4: [], step5: [] };
  }
  
  if (!DYNAMIC_FIELDS_CONFIG[mainCategory]) {
    console.log(`❌ Categoría "${mainCategory}" no configurada en FieldConfig.js`);
    return step ? [] : { step2: [], step3: [], step4: [], step5: [] };
  }
  
  // 1. PRIMERO buscar en subcategoría específica
  if (subCategory && DYNAMIC_FIELDS_CONFIG[mainCategory].subCategories) {
    const subConfig = DYNAMIC_FIELDS_CONFIG[mainCategory].subCategories[subCategory];
    
    if (subConfig) {
      console.log(`✅ Usando configuración de subcategoría: ${subCategory}`);
      
      if (step) {
        const stepKey = `step${step}`;
        const fields = subConfig[stepKey] || DYNAMIC_FIELDS_CONFIG[mainCategory][stepKey] || [];
        console.log(`📋 Campos para ${mainCategory}/${subCategory} → ${stepKey}:`, fields);
        return fields;
      }
      
      // Devolver toda la configuración de la subcategoría
      return {
        step2: subConfig.step2 || DYNAMIC_FIELDS_CONFIG[mainCategory].step2 || [],
        step3: subConfig.step3 || DYNAMIC_FIELDS_CONFIG[mainCategory].step3 || [],
        step4: subConfig.step4 || DYNAMIC_FIELDS_CONFIG[mainCategory].step4 || [],
        step5: subConfig.step5 || DYNAMIC_FIELDS_CONFIG[mainCategory].step5 || []
      };
    }
  }
  
  // 2. Si no hay subcategoría o no está configurada, usar categoría principal
  console.log(`✅ Usando configuración de categoría principal: ${mainCategory}`);
  
  if (step) {
    const stepKey = `step${step}`;
    const fields = DYNAMIC_FIELDS_CONFIG[mainCategory][stepKey] || [];
    console.log(`📋 Campos para ${mainCategory} → ${stepKey}:`, fields);
    return fields;
  }
  
  // Devolver toda la configuración de la categoría
  return {
    step2: DYNAMIC_FIELDS_CONFIG[mainCategory].step2 || [],
    step3: DYNAMIC_FIELDS_CONFIG[mainCategory].step3 || [],
    step4: DYNAMIC_FIELDS_CONFIG[mainCategory].step4 || [],
    step5: DYNAMIC_FIELDS_CONFIG[mainCategory].step5 || []
  };
};

// 🔥 FUNCIÓN COMPATIBLE (backward compatibility)
export const getFieldsForStep = (mainCategory, stepNumber, subCategory = null) => {
  console.warn('⚠️ getFieldsForStep está deprecada, usa getFieldsForCategory');
  return getFieldsForCategory(mainCategory, subCategory, stepNumber);
};

// 🔥 FUNCIÓN PARA VERIFICAR SI UNA CATEGORÍA/SUBCATEGORÍA ESTÁ CONFIGURADA
export const isCategoryConfigured = (mainCategory, subCategory = null) => {
  if (!mainCategory || !DYNAMIC_FIELDS_CONFIG[mainCategory]) {
    return false;
  }
  
  if (subCategory && DYNAMIC_FIELDS_CONFIG[mainCategory].subCategories) {
    return !!DYNAMIC_FIELDS_CONFIG[mainCategory].subCategories[subCategory];
  }
  
  return true;
};

// 🔥 FUNCIÓN PARA OBTENER SUBCATEGORÍAS DE UNA CATEGORÍA
export const getSubCategories = (mainCategory) => {
  if (!mainCategory || !DYNAMIC_FIELDS_CONFIG[mainCategory]) {
    return [];
  }
  
  if (DYNAMIC_FIELDS_CONFIG[mainCategory].subCategories) {
    return Object.keys(DYNAMIC_FIELDS_CONFIG[mainCategory].subCategories);
  }
  
  return [];
};

// 🔥 FUNCIÓN PARA OBTENER TODAS LAS CATEGORÍAS CONFIGURADAS
export const getConfiguredCategories = () => {
  return Object.keys(DYNAMIC_FIELDS_CONFIG);
};

// 🔥 FUNCIÓN PARA OBTENER CONFIGURACIÓN COMPLETA
export const getFullConfig = () => {
  return DYNAMIC_FIELDS_CONFIG;
};

// 🔥 FUNCIÓN PARA VALIDAR SI UN CAMPO EXISTE EN UNA CATEGORÍA
export const isFieldInCategory = (mainCategory, subCategory, fieldName, step = null) => {
  const config = getFieldsForCategory(mainCategory, subCategory);
  
  if (step) {
    const stepKey = `step${step}`;
    return config[stepKey]?.includes(fieldName) || false;
  }
  
  // Buscar en todos los steps
  return ['step2', 'step3', 'step4', 'step5'].some(
    stepKey => config[stepKey]?.includes(fieldName)
  );
};

// 🔥 FUNCIÓN PARA OBTENER LOS STEPS DISPONIBLES
export const getAvailableSteps = (mainCategory, subCategory = null) => {
  const config = getFieldsForCategory(mainCategory, subCategory);
  const steps = [];
  
  if (config.step2 && config.step2.length > 0) steps.push(2);
  if (config.step3 && config.step3.length > 0) steps.push(3);
  if (config.step4 && config.step4.length > 0) steps.push(4);
  if (config.step5 && config.step5.length > 0) steps.push(5);
  
  return steps;
};

// 🔥 FUNCIÓN PARA OBTENER CAMPOS POR STEP (MÁS ESPECÍFICA)
export const getFieldsByStep = (mainCategory, subCategory, step) => {
  return getFieldsForCategory(mainCategory, subCategory, step);
};