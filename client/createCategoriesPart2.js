const fs = require('fs');
const path = require('path');

// ----------------- SEGUNDA PARTE DE CATEGORÍAS -----------------
const structurePart2 = {
  // ----------------- INFORMATIQUE -----------------
  "public/uploads/categories/informatique/level1": ["informatique.png"],
  "public/uploads/categories/informatique/level2": [
    "ordinateurs.png",
    "laptops.png",
    "composants.png",
    "peripheriques.png",
    "reseaux.png",
    "logiciels.png",
    "accessoires-informatique.png"
  ],
  "public/uploads/categories/informatique/level3": [
    "cpu.png",
    "gpu.png",
    "ram.png",
    "disque-dur.png",
    "ssd.png",
    "claviers.png",
    "souris.png",
    "moniteurs.png",
    "imprimantes.png",
    "cables.png",
    "routeurs.png",
    "switches.png",
    "logiciels-bureautique.png",
    "antivirus.png",
    "autres-informatique.png"
  ],

  // ----------------- MAISON-JARDIN -----------------
  "public/uploads/categories/maison-jardin/level1": ["maison-jardin.png"],
  "public/uploads/categories/maison-jardin/level2": [
    "meubles.png",
    "decoration.png",
    "jardin.png",
    "outils.png",
    "eclairage.png",
    "textile.png",
    "rangement.png"
  ],
  "public/uploads/categories/maison-jardin/level3": [
    "canapes.png",
    "tables.png",
    "chaises.png",
    "lampes.png",
    "plantes.png",
    "tondeuses.png",
    "barbecues.png",
    "coussins.png",
    "rideaux.png",
    "etagères.png",
    "boîtes-rangement.png",
    "autres-maison-jardin.png"
  ],

  // ----------------- MODE-ACCESSOIRES -----------------
  "public/uploads/categories/mode-accessoires/level1": ["mode.png"],
  "public/uploads/categories/mode-accessoires/level2": [
    "homme.png",
    "femme.png",
    "enfants.png",
    "chaussures.png",
    "sacs.png",
    "bijoux.png",
    "montres.png",
    "accessoires-mode.png"
  ],
  "public/uploads/categories/mode-accessoires/level3": [
    "t-shirts.png",
    "chemises.png",
    "pantalons.png",
    "robes.png",
    "jupes.png",
    "vestes.png",
    "chaussures-hommes.png",
    "chaussures-femmes.png",
    "sacs-a-main.png",
    "sacs-dos.png",
    "bracelets.png",
    "colliers.png",
    "montres-hommes.png",
    "montres-femmes.png",
    "autres-mode.png"
  ]
};

// ----------------- CREAR PLACEHOLDERS TRANSPARENTES -----------------
const placeholder = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NgYGD4DwABBAEAxFTGJwAAAABJRU5ErkJggg==",
  "base64"
); // 1x1 px PNG transparente

for (const dir in structurePart2) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  structurePart2[dir].forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, placeholder);
  });
}

console.log("✅ Segunda parte de categorías y placeholders creados.");
