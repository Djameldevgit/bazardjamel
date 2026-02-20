// node categoriesData2.js
// Script para crear todas las carpetas y archivos de imagen de la cuarta parte

const fs = require('fs');
const path = require('path');

// Ruta base - usando uploads/categories como especificaste
const basePath = path.join(__dirname, 'public', 'uploads', 'categories');

// Estructura completa de categorías - ACTUALIZADA PARA COINCIDIR CON EL SEED
const categories = {
  // ==================== 1. VEHICULES ====================
  "vehicules": {
    "level1": ["vehicules.png"],
    "level2": ["voitures.png", "utilitaire.png", "motos-scooters.png", "quads.png", "fourgon.png", "camion.png", "bus.png", "engin.png", "tracteurs.png", "remorques.png", "bateaux-barques.png"],
    "level3": [] // Las de nivel 3 mantienen emojis, no necesitan PNGs
  },

  // ==================== 2. VETEMENTS ====================
  "vetements": {
    "level1": ["vetements.png"],
    "level2": ["vetements-homme.png", "vetements-femme.png", "chaussures-homme.png", "chaussures-femme.png", "garcons.png", "filles.png", "bebe.png", "sacs-valises.png", "montres.png", "lunettes.png", "bijoux.png", "tenues-professionnelles.png"],
    "level3": [] // Las de nivel 3 mantienen emojis, no necesitan PNGs
  },

  // ==================== 3. ELECTROMENAGER ====================
  "electromenager": {
    "level1": ["electromenager.png"],
    "level2": ["televiseurs.png", "demodulateurs-box-tv.png", "paraboles-switch-tv.png", "abonnements-iptv.png", "cameras-accessories.png", "audio.png", "aspirateurs-nettoyeurs.png", "repassage.png", "beaute-hygiene.png", "machines-coudre.png", "telecommandes.png", "securite-gps.png", "composants-electroniques.png", "pieces-rechange.png", "autre-electromenager.png", "refrigerateurs-congelateurs.png", "machines-laver.png", "lave-vaisselles.png", "fours-cuisson.png", "chauffage-climatisation.png", "appareils-cuisine.png"],
    "level3": [] // Las de nivel 3 mantienen emojis
  },

  // ==================== 4. IMMOBILIER ====================
  "immobilier": {
    "level1": ["immobilier.png"],
    "level2": ["vente.png", "location.png", "location-vacances.png", "cherche-location.png", "cherche-achat.png"],
    "level3": [] // Las de nivel 3 mantienen emojis
  },

  // ==================== 5. ALIMENTAIRES ====================
  "alimentaires": {
    "level1": ["alimentaires.png"],
    "level2": ["produits-laitiers.png", "fruits-secs.png", "graines-riz-cereales.png", "sucres-produits-sucres.png", "boissons.png", "viandes-poissons.png", "cafe-the-infusion.png", "complements-alimentaires.png", "miel-derives.png", "fruits-legumes.png", "ble-farine.png", "bonbons-chocolat.png", "boulangerie-viennoiserie.png", "ingredients-cuisine-patisserie.png", "noix-graines.png", "plats-cuisines.png", "sauces-epices-condiments.png", "oeufs.png", "huiles.png", "pates.png", "gateaux.png", "emballage.png", "aliments-bebe.png", "aliments-dietetiques.png", "autre-alimentaires.png"],
    "level3": []
  },

  // ==================== 6. EMPLOI ====================
  "emploi": {
    "level1": ["emploi.png"],
    "level2": ["offres-emploi.png", "demandes-emploi.png", "autres-services-emploi.png"],
    "level3": []
  },

  // ==================== 7. INFORMATIQUE ====================
  "informatique": {
    "level1": ["informatique.png"],
    "level2": ["ordinateurs-portables.png", "ordinateurs-bureau.png", "composants-pc-fixe.png", "composants-pc-portable.png", "composants-serveur.png", "imprimantes-cartouches.png", "reseau-connexion.png", "stockage-externe-racks.png", "serveurs.png", "ecrans.png", "onduleurs-stabilisateurs.png", "compteuses-billets.png", "claviers-souris.png", "casques-son.png", "webcam-videoconference.png", "data-shows.png", "cables-adaptateurs.png", "stylers-tablettes.png", "cartables-sacoches.png", "manettes-simulateurs.png", "vr.png", "logiciels-abonnements.png", "bureautique.png", "autre-informatique.png"],
    "level3": [] // Las de nivel 3 mantienen emojis
  },

  // ==================== 8. LOISIRS ====================
  "loisirs": {
    "level1": ["loisirs.png"],
    "level2": ["animalerie.png", "consoles-jeux-videos.png", "livres-magazines.png", "instruments-musique.png", "jouets.png", "chasse-peche.png", "jardinage.png", "jeux-loisirs.png", "barbecue-grillades.png", "vapes-chichas.png", "produits-accessoires-ete.png", "antiquites-collections.png", "autre-loisirs.png"],
    "level3": []
  },

  // ==================== 9. MATERIAUX ====================
  "materiaux": {
    "level1": ["materiaux.png"],
    "level2": ["materiel-professionnel.png", "outillage-professionnel.png", "materiel-agricole.png", "materiaux-construction.png", "matieres-premieres.png", "produits-hygiene.png", "autre-materiaux.png"],
    "level3": []
  },

  // ==================== 10. MEUBLES ====================
  "meubles": {
    "level1": ["meubles.png"],
    "level2": ["salon.png", "chambres-coucher.png", "tables.png", "armoires-commodes.png", "lits.png", "meubles-cuisine.png", "bibliotheques-etageres.png", "chaises-fauteuils.png", "dressings.png", "meubles-salle-bain.png", "buffet.png", "tables-tv.png", "table-pliante.png", "tables-manger.png", "tables-pc-bureaux.png", "canape.png", "table-basse.png", "rangement-organisation.png", "accessoires-cuisine.png", "meuble-entree.png", "decoration.png", "vaisselle.png", "meubles-bureau.png", "puericulture.png", "luminaire.png", "rideaux.png", "literie-linge.png", "tapis-moquettes.png", "meubles-exterieur.png", "fournitures-scolaires.png", "autre-meubles.png"],
    "level3": []
  },

  // ==================== 11. PIECES DETACHEES ====================
  "pieces-detachees": {
    "level1": ["pieces-detachees.png"],
    "level2": ["pieces-automobiles.png", "pieces-moto.png", "pieces-bateaux.png", "alarme-securite.png", "nettoyage-entretien.png", "outils-diagnostics.png", "lubrifiants.png", "pieces-vehicules.png", "autres-pieces.png"],
    "level3": [] // Las de nivel 3 mantienen emojis
  },

  // ==================== 12. SANTE & BEAUTE ====================
  "sante-beaute": {
    "level1": ["sante-beaute.png"],
    "level2": ["cosmetiques-beaute.png", "parapharmacie-sante.png", "parfums-deodorants-femme.png", "parfums-deodorants-homme.png", "accessoires-beaute.png", "soins-cheveux.png", "autre-sante-beaute.png"],
    "level3": []
  },

  // ==================== 13. SERVICES ====================
  "services": {
    "level1": ["services.png"],
    "level2": ["construction-travaux.png", "ecoles-formations.png", "industrie-fabrication-services.png", "transport-demenagement.png", "decoration-amenagement.png", "publicite-communication.png", "nettoyage-jardinage.png", "froid-climatisation.png", "traiteurs-gateaux.png", "medecine-sante.png", "reparation-auto-diagnostic.png", "securite-alarme.png", "projets-etudes.png", "bureautique-internet.png", "location-vehicules.png", "menuiserie-meubles.png", "impression-edition.png", "hotellerie-restauration-salles.png", "esthetique-beaute.png", "image-son.png", "comptabilite-economie.png", "couture-confection.png", "maintenance-informatique.png", "reparation-electromenager.png", "evenements-divertissement.png", "paraboles-demos.png", "reparation-electronique.png", "services-etranger.png", "flashage-reparation-telephones.png", "flashage-installation-jeux.png", "juridique.png", "autres-services.png"],
    "level3": []
  },

  // ==================== 14. SPORT ====================
  "sport": {
    "level1": ["sport.png"],
    "level2": ["football.png", "hand-voley-basket.png", "sport-combat.png", "fitness-musculation.png", "natation.png", "velos-trotinettes.png", "sports-raquette.png", "sport-aquatiques.png", "equitation.png", "petanque.png", "autres-sports.png"],
    "level3": []
  },

  // ==================== 15. VOYAGES ====================
  "voyages": {
    "level1": ["voyages.png"],
    "level2": ["voyage-organise.png", "location-vacances-voyages.png", "hajj-omra.png", "reservations-visa.png", "sejour.png", "croisiere.png", "autre-voyages.png"],
    "level3": []
  },

  // ==================== 16. BOUTIQUES ====================
  "boutiques": {
    "level1": ["boutiques.png"],
    "level2": ["boutique-vehicules.png", "boutique-vetements.png", "boutique-electromenager.png", "boutique-immobilier.png", "boutique-alimentaire.png", "boutique-emploi.png", "boutique-informatique.png", "boutique-loisirs.png", "boutique-materiaux.png", "boutique-meubles.png", "boutique-pieces-detachees.png", "boutique-sante-beaute.png", "boutique-services.png", "boutique-sport.png", "boutique-voyages.png", "boutique-telephone.png"],
    "level3": []
  },

  // ==================== 17. TELEPHONE ====================
  "telephone": {
    "level1": ["telephone.png"],
    "level2": ["smartphones.png", "telephones-cellulaires.png", "tablettes.png", "fixes-fax.png", "smartwatchs.png", "accessoires-telephone.png", "pieces-rechange-telephone.png", "offres-abonnements.png", "protection-antichoc.png", "ecouteurs-son.png", "chargeurs-cables.png", "supports-stabilisateurs.png", "manettes-telephone.png", "vr-telephone.png", "power-banks.png", "stylets.png", "cartes-memoire.png"],
    "level3": [] // Las de nivel 3 mantienen emojis
  }
};

// Función para crear carpetas y archivos
function createFolders(base, obj) {
  console.log('📁 Creando estructura de carpetas en:', base);
  
  for (const key in obj) {
    const categoryPath = path.join(base, key);
    if (!fs.existsSync(categoryPath)) {
      fs.mkdirSync(categoryPath, { recursive: true });
      console.log(`  ✅ Creada carpeta: ${key}`);
    }

    const levels = obj[key];
    
    // Crear level1
    const level1Path = path.join(categoryPath, 'level1');
    if (!fs.existsSync(level1Path)) {
      fs.mkdirSync(level1Path, { recursive: true });
    }
    if (levels.level1) {
      levels.level1.forEach(file => {
        const filePath = path.join(level1Path, file);
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, ''); // placeholder vacío para PNG
          console.log(`    📄 Creado placeholder: ${key}/level1/${file}`);
        }
      });
    }

    // Crear level2
    const level2Path = path.join(categoryPath, 'level2');
    if (!fs.existsSync(level2Path)) {
      fs.mkdirSync(level2Path, { recursive: true });
    }
    if (levels.level2) {
      levels.level2.forEach(file => {
        const filePath = path.join(level2Path, file);
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, ''); // placeholder vacío para PNG
          console.log(`    📄 Creado placeholder: ${key}/level2/${file}`);
        }
      });
    }

    // Nota: level3 no se crea porque usan emojis
  }
}

// Ejecutar
console.log('🚀 Iniciando creación de estructura de imágenes para categorías...');
console.log('⚠️  NOTA: Las categorías nivel 3 usarán emojis, no se crean placeholders\n');

createFolders(basePath, categories);

console.log('\n✅ PARTE 4 COMPLETA:');
console.log(`   • ${Object.keys(categories).length} categorías principales procesadas`);
console.log('   • Carpetas level1 y level2 creadas para cada categoría');
console.log('   • Placeholders PNG creados para todos los iconos');
console.log('\n📂 Ruta base: /public/uploads/categories/');
console.log('\n🎯 Próximo paso: Reemplazar los placeholders vacíos con tus imágenes PNG reales');