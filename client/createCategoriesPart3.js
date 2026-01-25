const fs = require('fs');
const path = require('path');

// ----------------- TERCERA PARTE DE CATEGORÍAS -----------------
const structurePart3 = {
  // ----------------- SPORTS-LOISIRS -----------------
  "public/uploads/categories/sports-loisirs/level1": ["sports-loisirs.png"],
  "public/uploads/categories/sports-loisirs/level2": [
    "fitness.png",
    "velo.png",
    "running.png",
    "natation.png",
    "sports-collectifs.png",
    "jeux.png",
    "outdoor.png"
  ],
  "public/uploads/categories/sports-loisirs/level3": [
    "haltères.png",
    "tapis-fitness.png",
    "velo-route.png",
    "velo-montagne.png",
    "chaussures-running.png",
    "maillots.png",
    "ballons.png",
    "jeux-de-societe.png",
    "tentes.png",
    "sacs-couchage.png",
    "autres-sports-loisirs.png"
  ],

  // ----------------- ENFANTS-JOUETS -----------------
  "public/uploads/categories/enfants-jouets/level1": ["enfants-jouets.png"],
  "public/uploads/categories/enfants-jouets/level2": [
    "poupees.png",
    "voitures-jouets.png",
    "jeux-educatifs.png",
    "puzzles.png",
    "figurines.png",
    "lego.png",
    "accessoires-bebe.png"
  ],
  "public/uploads/categories/enfants-jouets/level3": [
    "poupees-barbies.png",
    "poupees-poupées.png",
    "voitures-miniatures.png",
    "lego-technic.png",
    "lego-classique.png",
    "puzzles-3d.png",
    "figurines-marvel.png",
    "figurines-dc.png",
    "tapis-jeux.png",
    "biberons.png",
    "jouets-bebe.png",
    "autres-enfants-jouets.png"
  ],

  // ----------------- ANIMAUX-MATERIEL -----------------
  "public/uploads/categories/animaux-materiel/level1": ["animaux.png"],
  "public/uploads/categories/animaux-materiel/level2": [
    "chiens.png",
    "chats.png",
    "oiseaux.png",
    "rongeurs.png",
    "aquariophilie.png",
    "accessoires-animaux.png"
  ],
  "public/uploads/categories/animaux-materiel/level3": [
    "nourriture-chiens.png",
    "nourriture-chats.png",
    "cages-oiseaux.png",
    "aquariums.png",
    "jouets-chiens.png",
    "jouets-chats.png",
    "colliers-laisses.png",
    "litiere.png",
    "accessoires-bain.png",
    "autres-animaux.png"
  ]
};

// ----------------- CREAR PLACEHOLDERS TRANSPARENTES -----------------
const placeholder = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NgYGD4DwABBAEAxFTGJwAAAABJRU5ErkJggg==",
  "base64"
); // 1x1 px PNG transparente

for (const dir in structurePart3) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  structurePart3[dir].forEach(file => {
    const filePath = path.join(dir, file);
    if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, placeholder);
  });
}

console.log("✅ Tercera parte de categorías y placeholders creados.");
