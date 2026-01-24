const mongoose = require('mongoose');
require('dotenv').config();
 
mongoose.connect(process.env.MONGODB_URI);

const Category = require('./models/categoryModel');

const fixSubcategoryIcons = async () => {
 
  // Iconos por categoría principal
  const iconosPorCategoria = {
    'Électroménager': {
      iconColor: '#FF6B6B',
      bgColor: '#FFE5E5',
      subcategorias: {
        'Téléviseurs': '/uploads/categories/electromenager/level2/televiseurs.png',
        'Démodulateurs & Box TV': '/uploads/categories/electromenager/level2/demodulateurs-box-tv.png',
        'Paraboles & Switch TV': '/uploads/categories/electromenager/level2/paraboles-switch-tv.png',
        'Audio': '/uploads/categories/electromenager/level2/audio.png',
        'Aspirateurs & Nettoyeurs': '/uploads/categories/electromenager/level2/aspirateurs-nettoyeurs.png',
        'Réfrigérateurs & Congélateurs': '/uploads/categories/electromenager/level2/refrigerateurs-congelateurs.png',
        'Machines à laver': '/uploads/categories/electromenager/level2/machines-a-laver.png'
      }
    },
    'Téléphones & Accessoires': {
      iconColor: '#4ECDC4',
      bgColor: '#E0F7F6',
      subcategorias: {
        'Smartphones': '/uploads/categories/telephones/level2/smartphones.png',
        'Tablettes': '/uploads/categories/telephones/level2/tablettes.png',
        'Accessoires Téléphones': '/uploads/categories/telephones/level2/accessoires-telephones.png',
        'Chargeurs & Câbles': '/uploads/categories/telephones/level2/chargeurs-cables.png'
      }
    }
    // Agrega las otras categorías...
  };

  // 1. Obtener todas las categorías nivel 1
  const categoriasNivel1 = await Category.find({ level: 1 });
  
  let totalReparadas = 0;
  
  for (const catNivel1 of categoriasNivel1) {
    const config = iconosPorCategoria[catNivel1.name];
    
    if (!config) {
      console.log(`⚠️  No hay configuración para: ${catNivel1.name}`);
      continue;
    }
    
    // 2. Obtener subcategorías de esta categoría
    const subcategorias = await Category.find({
      parent: catNivel1._id,
      level: 2
    });
    
    console.log(`\n📁 ${catNivel1.name}: ${subcategorias.length} subcategorías`);
    
    // 3. Actualizar cada subcategoría
    for (const subcat of subcategorias) {
      const icono = config.subcategorias[subcat.name];
      
      if (icono) {
        const update = {
          icon: icono,
          iconType: 'image-png',
          iconColor: config.iconColor,
          bgColor: config.bgColor,
          updatedAt: new Date()
        };
        
        await Category.updateOne({ _id: subcat._id }, { $set: update });
        console.log(`   ✅ ${subcat.name} → ${icono}`);
        totalReparadas++;
      } else {
        console.log(`   ⚠️  ${subcat.name}: Sin icono configurado`);
      }
    }
  }
  
  console.log(`\n🎉 ¡REPARACIÓN COMPLETADA! ${totalReparadas} subcategorías actualizadas`);
  process.exit(0);
};

fixSubcategoryIcons().catch(console.error);