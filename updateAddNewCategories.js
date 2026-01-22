require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/categoryModel');

// 📦 NUEVAS CATEGORÍAS A AGREGAR
const NEW_CATEGORIES = [
  {
    // 1. MEUBLES
    config: {
      name: "Meubles",
      slug: "meubles",
      emoji: "🛋️",
      order: 9  // Después de Sport (que es order: 8)
    },
    data: {
      levels: 2,
      level1: 'categorie',
      level2: 'subCategory',
      requiresLevel2: false,
      categories: [
        // 🛋️ MEUBLES PRINCIPALES (DIRECTAS)
        { id: 'salon', name: 'Salon', emoji: '🛋️', hasSublevel: false },
        { id: 'chambres_coucher', name: 'Chambres à coucher', emoji: '🛏️', hasSublevel: false },
        { id: 'tables', name: 'Tables', emoji: '🪑', hasSublevel: false },
        { id: 'armoires_commodes', name: 'Armoires & Commodes', emoji: '🗄️', hasSublevel: false },
        { id: 'lits', name: 'Lits', emoji: '🛌', hasSublevel: false },
        { id: 'meubles_cuisine', name: 'Meubles de Cuisine', emoji: '🍳', hasSublevel: false },
        { id: 'bibliotheques_etageres', name: 'Bibliothèques & Etagères', emoji: '📚', hasSublevel: false },
        { id: 'chaises_fauteuils', name: 'Chaises & Fauteuils', emoji: '🪑', hasSublevel: false },
        { id: 'dressings', name: 'Dressings', emoji: '👔', hasSublevel: false },
        { id: 'meubles_salle_bain', name: 'Meubles salle de bain', emoji: '🚿', hasSublevel: false },
        { id: 'buffet', name: 'Buffet', emoji: '🍽️', hasSublevel: false },
        { id: 'tables_tv', name: 'Tables TV', emoji: '📺', hasSublevel: false },
        { id: 'table_pliante', name: 'Table pliante', emoji: '🪑', hasSublevel: false },
        { id: 'tables_manger', name: 'Tables à manger', emoji: '🍽️', hasSublevel: false },
        { id: 'tables_pc_bureaux', name: 'Tables PC & Bureaux', emoji: '💻', hasSublevel: false },
        { id: 'canape', name: 'Canapé', emoji: '🛋️', hasSublevel: false },
        { id: 'table_basse', name: 'Table basse', emoji: '🪑', hasSublevel: false },
        { id: 'rangement_organisation', name: 'Rangement et Organisation', emoji: '📦', hasSublevel: false },
        { id: 'accessoires_cuisine', name: 'Accessoires de cuisine', emoji: '🔪', hasSublevel: false },
        { id: 'meuble_entree', name: 'Meuble d\'entrée', emoji: '🚪', hasSublevel: false },
        
        // 🎨 CATEGORÍAS CON SUBNIVELES
        { id: 'decoration', name: 'Décoration', emoji: '🎨', hasSublevel: true },
        { id: 'vaisselle', name: 'Vaisselle', emoji: '🍽️', hasSublevel: true },
        { id: 'meubles_bureau', name: 'Meubles de bureau', emoji: '💼', hasSublevel: true },
        { id: 'puericulture', name: 'Puériculture', emoji: '👶', hasSublevel: true },
        { id: 'luminaire', name: 'Luminaire', emoji: '💡', hasSublevel: true },
        
        // 🏠 OTRAS CATEGORÍAS DIRECTAS
        { id: 'rideaux', name: 'Rideaux', emoji: '🪟', hasSublevel: false },
        { id: 'literie_linge', name: 'Literie & Linge', emoji: '🛌', hasSublevel: false },
        { id: 'tapis_moquettes', name: 'Tapis & Moquettes', emoji: '🧶', hasSublevel: false },
        { id: 'meubles_exterieur', name: 'Meubles d\'extérieur', emoji: '🌳', hasSublevel: false },
        { id: 'fournitures_scolaires', name: 'Fournitures et articles scolaires', emoji: '📚', hasSublevel: false },
        { id: 'autre_meubles', name: 'Autre', emoji: '🛋️', hasSublevel: false }
      ],
      subcategories: {
        // 🎨 DÉCORATION
        decoration: [
          { id: 'peinture_calligraphie', name: 'Peinture et calligraphie', emoji: '🖼️' },
          { id: 'decoration_cuisine', name: 'Décoration de cuisine', emoji: '🍳' },
          { id: 'coussins_housses', name: 'Coussins & Housses', emoji: '🛋️' },
          { id: 'deco_bain', name: 'Déco de Bain', emoji: '🚿' },
          { id: 'art_revetement_mural', name: 'Art et Revêtement Mural', emoji: '🎨' },
          { id: 'figurines_miniatures', name: 'Figurines et miniatures', emoji: '🗿' },
          { id: 'cadres', name: 'Cadres', emoji: '🖼️' },
          { id: 'horloges', name: 'Horloges', emoji: '⏰' },
          { id: 'autres_decoration', name: 'Autres décoration', emoji: '✨' }
        ],
        
        // 🍽️ VAISSELLE
        vaisselle: [
          { id: 'poeles_casseroles_marmites', name: 'Pôeles, Casseroles et Marmites', emoji: '🍳' },
          { id: 'cocottes', name: 'Cocottes', emoji: '🥘' },
          { id: 'plats_four_plateaux', name: 'Plats à four et Plateaux', emoji: '🍲' },
          { id: 'assiettes_bols', name: 'Assiettes et Bols', emoji: '🍽️' },
          { id: 'couverts_ustensiles', name: 'Couverts et ustensiles de cuisine', emoji: '🔪' },
          { id: 'services_boissons', name: 'Services à Boissons', emoji: '☕' },
          { id: 'boites_bocaux', name: 'Boites et bocaux', emoji: '🥫' },
          { id: 'accessoires_patisserie', name: 'Accessoires de pâtisserie', emoji: '🎂' },
          { id: 'vaisselles_artisanales', name: 'Vaisselles Artisanales', emoji: '🧱' },
          { id: 'gadget_cuisine', name: 'Gadget de cuisine', emoji: '⚙️' },
          { id: 'vaisselle_enfants', name: 'Vaisselle enfants', emoji: '👶' }
        ],
        
        // 💼 MEUBLES DE BUREAU
        meubles_bureau: [
          { id: 'bureaux_caissons', name: 'Bureaux & Caissons', emoji: '💼' },
          { id: 'chaises_bureau', name: 'Chaises', emoji: '🪑' },
          { id: 'armoires_rangements_bureau', name: 'Armoires & Rangements', emoji: '🗄️' },
          { id: 'accessoires_bureaux', name: 'Accessoires de bureaux', emoji: '📎' },
          { id: 'tables_reunion', name: 'Tables de réunion', emoji: '🤝' }
        ],
        
        // 👶 PUÉRICULTURE
        puericulture: [
          { id: 'poussette', name: 'Poussette', emoji: '👶' },
          { id: 'siege_auto', name: 'Siège Auto', emoji: '🚗' },
          { id: 'meubles_bebe', name: 'Meubles bébé', emoji: '🛏️' },
          { id: 'lit_bebe', name: 'Lit bébé', emoji: '🛌' },
          { id: 'chaise_bebe', name: 'Chaise bébé', emoji: '🪑' },
          { id: 'autres_puericulture', name: 'Autres', emoji: '👶' }
        ],
        
        // 💡 LUMINAIRE
        luminaire: [
          { id: 'lustre', name: 'Lustre', emoji: '💎' },
          { id: 'lampadaire', name: 'Lampadaire', emoji: '🛋️' },
          { id: 'eclairage_exterieur', name: 'Éclairage extérieur', emoji: '🌙' },
          { id: 'autres_luminaire', name: 'Autres', emoji: '💡' }
        ]
      },
      properties: {}
    }
  },
  {
    // 2. MATERIAUX
    config: {
      name: "Matériaux",
      slug: "materiaux",
      emoji: "🧱",
      order: 10  // Después de Meubles
    },
    data: {
      levels: 2,
      level1: 'categorie',
      level2: 'subCategory',
      requiresLevel2: false,
      categories: [
        // 🔧 CON NIVEL 2
        { id: 'materiel_professionnel', name: 'Matériel professionnel', emoji: '🏭', hasSublevel: true },
        { id: 'outillage_professionnel', name: 'Outillage professionnel', emoji: '🛠️', hasSublevel: true },
        { id: 'materiel_agricole', name: 'Matériel Agricole', emoji: '🚜', hasSublevel: true },
        
        // 🧱 SIN NIVEL 2 (DIRECTAS)
        { id: 'materiaux_construction', name: 'Materiaux de construction', emoji: '🧱', hasSublevel: false },
        { id: 'matieres_premieres', name: 'Matières premières', emoji: '⚗️', hasSublevel: false },
        { id: 'produits_hygiene', name: 'Produits d\'hygiène', emoji: '🧼', hasSublevel: false },
        { id: 'autre_materiaux', name: 'Autre', emoji: '📦', hasSublevel: false }
      ],
      subcategories: {
        // 🏭 MATÉRIEL PROFESSIONNEL
        materiel_professionnel: [
          { id: 'industrie_fabrication', name: 'Industrie & Fabrication', emoji: '🏭' },
          { id: 'alimentaire_restauration', name: 'Alimentaire et Restauration', emoji: '🍽️' },
          { id: 'medical', name: 'Medical', emoji: '🏥' },
          { id: 'batiment_construction', name: 'Batiment & Construction', emoji: '🏗️' },
          { id: 'materiel_electrique', name: 'Matériel électrique', emoji: '⚡' },
          { id: 'ateliers', name: 'Ateliers', emoji: '🔧' },
          { id: 'stockage_magasinage', name: 'Stockage et magasinage', emoji: '📦' },
          { id: 'equipement_protection', name: 'Équipement de protection', emoji: '🛡️' },
          { id: 'agriculture', name: 'Agriculture', emoji: '🌾' },
          { id: 'reparation_diagnostic', name: 'Réparation & Diagnostic', emoji: '🔍' },
          { id: 'commerce_detail', name: 'Commerce de détail', emoji: '🏪' },
          { id: 'coiffure_cosmetologie', name: 'Coiffure et cosmétologie', emoji: '💇' },
          { id: 'autres_materiel_pro', name: 'Autres matériels pro', emoji: '🛠️' }
        ],
        
        // 🛠️ OUTILLAGE PROFESSIONNEL
        outillage_professionnel: [
          { id: 'perceuse', name: 'Perceuse', emoji: '🔩' },
          { id: 'meuleuse', name: 'Meuleuse', emoji: '⚙️' },
          { id: 'outillage_main', name: 'Outillage à main', emoji: '🔨' },
          { id: 'scie', name: 'Scie', emoji: '🪚' },
          { id: 'autres_outillage', name: 'Autres', emoji: '🛠️' }
        ],
        
        // 🚜 MATÉRIEL AGRICOLE
        materiel_agricole: [
          { id: 'equipement_agricole', name: 'Equipement agricole', emoji: '🚜' },
          { id: 'arbres', name: 'Arbres', emoji: '🌳' },
          { id: 'terrain_agricole', name: 'Terrain Agricole', emoji: '🌾' },
          { id: 'autre_agricole', name: 'Autre', emoji: '🌱' }
        ]
      },
      properties: {}
    }
  }
];

async function updateAddNewCategories() {
  try {
    // 1. Conectar a MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace');
    console.log('✅ MongoDB conectado');
    
    // 2. Verificar categorías existentes
    console.log('\n🔍 Verificando categorías existentes...');
    const existingCategories = await Category.find({ level: 1 }).sort({ order: 1 });
    
    console.log(`📊 Categorías principales existentes: ${existingCategories.length}`);
    existingCategories.forEach(cat => {
      console.log(`   • ${cat.emoji} ${cat.name} (order: ${cat.order}, slug: ${cat.slug})`);
    });
    
    // 3. Calcular el próximo order disponible
    const maxOrder = existingCategories.length > 0 
      ? Math.max(...existingCategories.map(c => c.order)) 
      : 0;
    
    console.log(`\n📌 Último order encontrado: ${maxOrder}`);
    
    // 4. Procesar cada nueva categoría
    let totalAdded = 0;
    let skipped = 0;
    
    for (const newCategory of NEW_CATEGORIES) {
      const { config, data } = newCategory;
      
      console.log(`\n📦 Procesando: ${config.emoji} ${config.name}`);
      
      // Verificar si ya existe
      const exists = await Category.findOne({ slug: config.slug, level: 1 });
      if (exists) {
        console.log(`   ⚠️ Ya existe, omitiendo...`);
        skipped++;
        continue;
      }
      
      // Ajustar order si es necesario (en caso de que haya conflictos)
      let finalOrder = config.order;
      const orderExists = existingCategories.some(cat => cat.order === finalOrder);
      if (orderExists) {
        finalOrder = maxOrder + 1;
        console.log(`   ⚠️ Order ${config.order} ya está ocupado, usando: ${finalOrder}`);
      }
      
      // Insertar categoría principal
      console.log(`   ➕ Insertando categoría principal (order: ${finalOrder})...`);
      
      const mainCat = new Category({
        name: config.name,
        slug: config.slug,
        emoji: config.emoji,
        level: 1,
        parent: null,
        ancestors: [],
        path: config.slug,
        order: finalOrder,
        hasChildren: data.categories.length > 0,
        isLeaf: false
      });
      
      const savedMain = await mainCat.save();
      totalAdded++;
      
      // 5. Insertar subcategorías (nivel 2)
      console.log(`   📂 Insertando ${data.categories.length} subcategorías...`);
      let subcatCount = 0;
      
      for (const subcat of data.categories) {
        const childSlug = `${config.slug}-${subcat.id}`;
        
        const childCat = new Category({
          name: subcat.name,
          slug: childSlug,
          emoji: subcat.emoji,
          level: 2,
          parent: savedMain._id,
          ancestors: [savedMain._id],
          path: `${config.slug}/${subcat.id}`,
          order: subcat.order || subcatCount + 1,
          hasChildren: subcat.hasSublevel,
          isLeaf: !subcat.hasSublevel
        });
        
        const savedChild = await childCat.save();
        subcatCount++;
        
        // 6. Insertar artículos (nivel 3) si tiene subniveles
        if (subcat.hasSublevel && data.subcategories[subcat.id]) {
          const articles = data.subcategories[subcat.id];
          let articleCount = 0;
          
          for (const article of articles) {
            const articleSlug = `${childSlug}-${article.id}`;
            
            const articleCat = new Category({
              name: article.name,
              slug: articleSlug,
              emoji: article.emoji,
              level: 3,
              parent: savedChild._id,
              ancestors: [savedMain._id, savedChild._id],
              path: `${config.slug}/${subcat.id}/${article.id}`,
              order: articleCount + 1,
              hasChildren: false,
              isLeaf: true
            });
            
            await articleCat.save();
            articleCount++;
          }
          
          console.log(`     ├── ${subcat.name}: ${articles.length} artículos`);
        } else {
          console.log(`     ├── ${subcat.name} (directa)`);
        }
      }
      
      console.log(`   ✅ ${config.name}: ${subcatCount} subcategorías insertadas`);
    }
    
    // 7. Mostrar resumen final
    console.log('\n' + '='.repeat(60));
    console.log('🎉 ¡ACTUALIZACIÓN COMPLETADA!');
    console.log('='.repeat(60));
    console.log(`✅ Categorías nuevas agregadas: ${totalAdded}`);
    console.log(`⏭️ Categorías omitidas (ya existían): ${skipped}`);
    
    // 8. Mostrar estructura actualizada
    console.log('\n📋 ESTRUCTURA FINAL DE CATEGORÍAS:');
    const finalCategories = await Category.find({ level: 1 }).sort({ order: 1 });
    
    for (const cat of finalCategories) {
      const children = await Category.countDocuments({ parent: cat._id });
      const grandchildren = await Category.countDocuments({ 
        ancestors: cat._id,
        level: 3 
      });
      
      console.log(`${cat.order}. ${cat.emoji} ${cat.name}: ${children} subcategorías, ${grandchildren} artículos`);
    }
    
    console.log(`\n📊 TOTAL EN BASE DE DATOS: ${await Category.countDocuments()} categorías`);
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error durante la actualización:', error);
    process.exit(1);
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  updateAddNewCategories();
}

module.exports = { updateAddNewCategories, NEW_CATEGORIES };