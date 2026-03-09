// node uploadIconsToCloudinary.js
// VERSIÓN CON ESTRUCTURA DE CARPETAS VISIBLE EN CLOUDINARY
// Sube imágenes manteniendo la jerarquía: icons/categoria/subcategoria/archivo.png

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

const dotenv = require('dotenv');

// =============================================
// CARGAR VARIABLES DEL ARCHIVO .env
// =============================================
dotenv.config();

// =============================================
// CONFIGURACIÓN
// =============================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dfjipgj2o',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Verificar credenciales
if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  console.error('\n❌ ERROR: No se encuentran las credenciales en el archivo .env');
  console.error('📌 Asegúrate de que tu archivo .env contiene:');
  console.error('   CLOUDINARY_API_KEY=726291387377194');
  console.error('   CLOUDINARY_API_SECRET=1QvpVpJ2Jk_RJ4bGKwrHh9Bzr8g');
  console.error('   CLOUDINARY_CLOUD_NAME=dfjipgj2o');
  process.exit(1);
}

// =============================================
//AQUI SE CAMBIAR LAS RUTAS DE CUALQUIER CARPETA 
// =============================================
const LOCAL_ICONS_PATH = path.join(__dirname, 'client', 'public', 'icons');
const OUTPUT_DIR = path.join(__dirname, 'uploads');

// Crear carpeta de salida si no existe
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// =============================================
// FUNCIÓN PARA ELIMINAR CARPETA EN CLOUDINARY
// =============================================
async function deleteCloudinaryFolder() {
  console.log('\n🗑️ Eliminando carpeta icons de Cloudinary...');
  
  try {
    // Eliminar todos los recursos en la carpeta icons
    const result = await cloudinary.api.delete_resources_by_prefix('icons/');
    console.log('✅ Carpeta icons eliminada correctamente');
    return true;
  } catch (error) {
    console.error('❌ Error al eliminar carpeta:', error.message);
    return false;
  }
}

// =============================================
// FUNCIÓN PARA SUBIR UNA IMAGEN CON ESTRUCTURA
// =============================================
async function uploadImage(filePath, categoryPath) {
  try {
    const fileName = path.basename(filePath);
    const fileNameWithoutExt = fileName.replace(/\.[^/.]+$/, '');
    
    // Construir public_id con la estructura completa de carpetas
    // Ejemplo: si categoryPath = "vehicules/voitures", public_id = "icons/vehicules/voitures/voitures"
    let publicId;
    
    if (categoryPath) {
      // Tiene subcarpetas: icons/vehicules/voitures/voitures
      publicId = `icons/${categoryPath}/${fileNameWithoutExt}`;
    } else {
      // Está en raíz de icons: icons/vehicules/vehicules
      publicId = `icons/${fileNameWithoutExt}`;
    }
    
    console.log(`⬆️ Subiendo: ${categoryPath ? categoryPath + '/' : ''}${fileName}`);
    
    const result = await cloudinary.uploader.upload(filePath, {
      public_id: publicId,
      overwrite: true,
      unique_filename: false,
      use_filename: true,
      // NO usar folder, porque ya incluimos la ruta completa en public_id
    });

    console.log(`   ✅ ${result.secure_url}`);
    
    return {
      success: true,
      public_id: result.public_id,
      url: result.secure_url,
      version: result.version,
      format: result.format,
      bytes: result.bytes,
      original_filename: fileName,
      categoryPath: categoryPath || 'root'
    };
    
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return {
      success: false,
      file: filePath,
      error: error.message
    };
  }
}

// =============================================
// FUNCIÓN PARA ESCANEAR Y SUBIR CON ESTRUCTURA
// =============================================
async function scanAndUpload(dir, currentPath = '') {
  let results = {
    successful: [],
    failed: [],
    mapping: {},
    byCategory: {}
  };

  const items = fs.readdirSync(dir);

  for (const item of items) {
    if (item.startsWith('.')) continue;

    const itemPath = path.join(dir, item);
    const stat = fs.statSync(itemPath);

    if (stat.isDirectory()) {
      // Es una carpeta - acumular la ruta
      const newPath = currentPath ? `${currentPath}/${item}` : item;
      console.log(`\n📂 Procesando carpeta: ${newPath}`);
      
      const subResults = await scanAndUpload(itemPath, newPath);
      
      results.successful.push(...subResults.successful);
      results.failed.push(...subResults.failed);
      results.mapping = { ...results.mapping, ...subResults.mapping };
      results.byCategory = { ...results.byCategory, ...subResults.byCategory };
      
    } else {
      const ext = path.extname(item).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext)) {
        
        // Subir imagen con la ruta acumulada
        const uploadResult = await uploadImage(itemPath, currentPath);
        
        if (uploadResult.success) {
          // Ruta local como aparece en el frontend
          const localPath = currentPath ? `/icons/${currentPath}/${item}` : `/icons/${item}`;
          
          // Guardar en mapping
          results.mapping[localPath] = uploadResult.url;
          
          // Guardar información completa
          const imageInfo = {
            fileName: item,
            extension: uploadResult.format,
            size: (stat.size / 1024).toFixed(2) + ' KB',
            localPath: localPath,
            cloudinaryUrl: uploadResult.url,
            public_id: uploadResult.public_id,
            version: uploadResult.version,
            categoryPath: currentPath,
            category: currentPath ? currentPath.split('/')[0] : 'root',
            fullPath: itemPath
          };
          
          results.successful.push(imageInfo);
          
          // Organizar por categoría
          const category = currentPath ? currentPath.split('/')[0] : 'root';
          if (!results.byCategory[category]) {
            results.byCategory[category] = [];
          }
          results.byCategory[category].push(imageInfo);
        } else {
          results.failed.push(uploadResult);
        }
      }
    }
  }

  return results;
}

// =============================================
// FUNCIÓN PARA GUARDAR RESULTADOS
// =============================================
function saveResults(results) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  // Guardar todos los datos completos
  fs.writeFileSync(
    path.join(OUTPUT_DIR, `cloudinary-complete-${timestamp}.json`),
    JSON.stringify(results, null, 2)
  );
  
  // Guardar mapping (para actualizar seed)
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'cloudinary-mapping.json'),
    JSON.stringify(results.mapping, null, 2)
  );
  
  // Guardar solo las exitosas
  fs.writeFileSync(
    path.join(OUTPUT_DIR, `cloudinary-successful-${timestamp}.json`),
    JSON.stringify(results.successful, null, 2)
  );
  
  // Guardar por categorías
  fs.writeFileSync(
    path.join(OUTPUT_DIR, `cloudinary-by-category-${timestamp}.json`),
    JSON.stringify(results.byCategory, null, 2)
  );
  
  console.log('\n📁 Archivos guardados en:', OUTPUT_DIR);
  console.log(`   - cloudinary-mapping.json (para actualizar el seed)`);
  console.log(`   - cloudinary-complete-${timestamp}.json`);
  console.log(`   - cloudinary-successful-${timestamp}.json`);
  console.log(`   - cloudinary-by-category-${timestamp}.json`);
}

// =============================================
// FUNCIÓN PRINCIPAL
// =============================================
async function main() {
  console.log('🚀 SUBIENDO IMÁGENES A CLOUDINARY');
  console.log('=================================\n');
  console.log('📁 VERSIÓN CON CARPETAS VISIBLES');
  console.log('📁 Estructura: icons/categoria/subcategoria/archivo.png\n');
  
  console.log('📁 Configuración:');
  console.log(`   • Cloud Name: ${process.env.CLOUDINARY_CLOUD_NAME || 'dfjipgj2o'}`);
  console.log(`   • Buscando imágenes en: ${LOCAL_ICONS_PATH}`);
  
  if (!fs.existsSync(LOCAL_ICONS_PATH)) {
    console.error(`\n❌ ERROR: No se encuentra la carpeta: ${LOCAL_ICONS_PATH}`);
    process.exit(1);
  }

  // PASO 1: Preguntar si eliminar carpeta existente
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const deleteFolder = await new Promise(resolve => {
    readline.question('\n🗑️ ¿Eliminar carpeta "icons" de Cloudinary antes de subir? (s/N): ', answer => {
      resolve(answer.toLowerCase() === 's');
      readline.close();
    });
  });

  if (deleteFolder) {
    const deleted = await deleteCloudinaryFolder();
    if (!deleted) {
      console.log('⚠️ Continuando con la subida de todas formas...');
    }
  }

  // PASO 2: Escanear y subir imágenes
  console.log('\n🔍 Escaneando carpetas locales...\n');
  const results = await scanAndUpload(LOCAL_ICONS_PATH);

  // PASO 3: Guardar resultados
  saveResults(results);

  // PASO 4: Mostrar resumen
  console.log('\n' + '='.repeat(60));
  console.log('📊 RESUMEN FINAL');
  console.log('='.repeat(60));
  console.log(`✅ Imágenes subidas exitosamente: ${results.successful.length}`);
  console.log(`❌ Fallos en la subida: ${results.failed.length}`);
  
  if (results.successful.length > 0) {
    console.log('\n🔍 ESTRUCTURA DE CARPETAS EN CLOUDINARY:');
    
    // Agrupar por categoría para mostrar
    const structure = {};
    results.successful.forEach(img => {
      const parts = img.categoryPath.split('/');
      const mainCat = parts[0] || 'root';
      if (!structure[mainCat]) structure[mainCat] = new Set();
      if (parts[1]) structure[mainCat].add(parts[1]);
    });
    
    Object.entries(structure).forEach(([cat, subs]) => {
      console.log(`   📂 ${cat}/`);
      Array.from(subs).forEach(sub => console.log(`      📂 ${sub}/`));
    });
    
    console.log('\n🔍 PRIMERAS 5 URLs (con estructura visible):');
    results.successful.slice(0, 5).forEach((img, i) => {
      console.log(`${i+1}. ${img.cloudinaryUrl}`);
    });
    
    console.log('\n🔍 EJEMPLO DE MAPPING (para actualizar seed):');
    const sampleEntries = Object.entries(results.mapping).slice(0, 3);
    sampleEntries.forEach(([local, cloud]) => {
      console.log(`   ${local}`);
      console.log(`   → ${cloud}\n`);
    });
  }

  console.log('\n✅ ESTRUCTURA LOGRADA:');
  console.log('   https://res.cloudinary.com/dfjipgj2o/image/upload/v1/icons/vehicules/voitures/voitures.png');
  console.log('   https://res.cloudinary.com/dfjipgj2o/image/upload/v1/icons/immobilier/vente/vente.png');
  console.log('\n🎉 PROCESO COMPLETADO!');
}

// =============================================
// EJECUTAR
// =============================================
main().catch(error => {
  console.error('❌ Error inesperado:', error);
});