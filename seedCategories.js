// seedCategoriesToMongo.js
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { MongoClient } = require('mongodb');

dotenv.config();

// Configuración Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || 'dfjipgj2o',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configuración MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'marketplace';
const COLLECTION_NAME = 'categories';

// Ruta base de las carpetas seedCategories
const SEED_PATH = path.join(__dirname, 'seedCategories');

// Función para subir una imagen a Cloudinary
async function uploadImage(filePath, folder) {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            folder: folder,
            use_filename: true,
            unique_filename: false,
            overwrite: true
        });
        return result.secure_url;
    } catch (error) {
        console.error(`Error subiendo ${filePath}:`, error.message);
        return null;
    }
}

// Función para recorrer directorios y construir jerarquía
async function processCategory(dirPath, parentSlug = '') {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    const category = {
        slug: path.basename(dirPath),
        name: path.basename(dirPath).replace(/-/g, ' '),
        level: null,
        parent: parentSlug || null,
        imageUrl: null,
        children: []
    };

    // Procesar level1, level2, level3
    for (const entry of entries) {
        if (entry.isDirectory()) {
            if (entry.name.startsWith('level')) {
                const levelPath = path.join(dirPath, entry.name);
                const levelFiles = fs.readdirSync(levelPath).filter(f => f.match(/\.(png|jpg|jpeg|gif|webp)$/i));
                for (const file of levelFiles) {
                    const filePath = path.join(levelPath, file);
                    // Determinar el nivel a partir del nombre de la carpeta level1, level2, level3
                    const level = parseInt(entry.name.replace('level', ''));
                    // El nombre de la imagen sin extensión puede usarse como identificador
                    const baseName = path.basename(file, path.extname(file));
                    // Construir la carpeta en Cloudinary: categories/[categoria]/level[level]/
                    const cloudFolder = `categories/${category.slug}/${entry.name}`;
                    const imageUrl = await uploadImage(filePath, cloudFolder);
                    if (imageUrl) {
                        // Dependiendo del nivel, lo guardamos en el lugar adecuado
                        // Para level1, la imagen es de la categoría principal
                        if (level === 1) {
                            category.imageUrl = imageUrl;
                        } else {
                            // Para level2 y level3, creamos subcategorías
                            // Buscamos o creamos la subcategoría correspondiente
                            // Aquí necesitamos una estructura más detallada: podríamos crear un array de subcategorías
                            // Pero como es complejo, mejor creamos un mapa de nodos
                            // Simplificamos: almacenamos todas las imágenes en un mapa y luego al construir el árbol las asignamos
                            // Por ahora, guardamos en un array temporal
                            if (!category.levelImages) category.levelImages = {};
                            if (!category.levelImages[level]) category.levelImages[level] = [];
                            category.levelImages[level].push({
                                name: baseName,
                                url: imageUrl,
                                level
                            });
                        }
                    }
                }
            } else {
                // Si hay subcarpetas que no son level (ej. dentro de una categoría principal hay más categorías), las procesamos recursivamente
                const childSlug = `${parentSlug ? parentSlug + '/' : ''}${category.slug}`;
                const childCategory = await processCategory(path.join(dirPath, entry.name), childSlug);
                category.children.push(childCategory);
            }
        }
    }

    return category;
}

// Función para aplanar la jerarquía en documentos para MongoDB (cada categoría como documento con parent)
function flattenCategory(category, parentId = null, level = 1) {
    let docs = [];
    const doc = {
        slug: category.slug,
        name: category.name,
        level: level,
        parent: parentId,
        imageUrl: category.imageUrl || null,
        // Podemos guardar también imágenes de niveles inferiores como referencias
        // Por simplicidad, aquí solo guardamos la imagen del nivel actual
    };
    // Asignar _id temporal para referencias (podemos usar el slug)
    doc._id = category.slug; // o generar un ObjectId, pero usamos slug para simplificar
    docs.push(doc);

    // Procesar hijos (subcategorías de nivel 2,3)
    if (category.children && category.children.length > 0) {
        for (const child of category.children) {
            docs = docs.concat(flattenCategory(child, doc._id, level + 1));
        }
    }

    // También necesitamos manejar las imágenes de level2 y level3 que no están en children sino en levelImages
    // Podríamos crear subcategorías adicionales a partir de levelImages
    if (category.levelImages) {
        for (const [level, images] of Object.entries(category.levelImages)) {
            for (const img of images) {
                // Crear un documento para cada imagen de nivel inferior (como subcategoría hoja)
                const leafDoc = {
                    slug: `${category.slug}/${img.name}`,
                    name: img.name.replace(/-/g, ' '),
                    level: parseInt(level),
                    parent: category.slug,
                    imageUrl: img.url,
                };
                leafDoc._id = leafDoc.slug;
                docs.push(leafDoc);
            }
        }
    }

    return docs;
}

async function main() {
    console.log('Iniciando proceso de seed de categorías...');

    if (!fs.existsSync(SEED_PATH)) {
        console.error(`La carpeta ${SEED_PATH} no existe.`);
        return;
    }

    const rootDirs = fs.readdirSync(SEED_PATH, { withFileTypes: true })
        .filter(d => d.isDirectory() && !d.name.startsWith('.'))
        .map(d => d.name);

    const categories = [];

    for (const dir of rootDirs) {
        console.log(`Procesando: ${dir}`);
        const category = await processCategory(path.join(SEED_PATH, dir));
        categories.push(category);
    }

    // Aplanar para MongoDB
    let flatDocs = [];
    for (const cat of categories) {
        flatDocs = flatDocs.concat(flattenCategory(cat));
    }

    // Conectar a MongoDB e insertar
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        // Opcional: limpiar colección antes de insertar
        console.log('Eliminando documentos existentes...');
        await collection.deleteMany({});

        console.log(`Insertando ${flatDocs.length} documentos...`);
        const result = await collection.insertMany(flatDocs);
        console.log(`Insertados ${result.insertedCount} documentos.`);

        // También podemos generar un archivo JSON de respaldo
        const outputPath = path.join(__dirname, 'categories-backup.json');
        fs.writeFileSync(outputPath, JSON.stringify(flatDocs, null, 2));
        console.log(`Backup guardado en ${outputPath}`);

    } catch (error) {
        console.error('Error con MongoDB:', error);
    } finally {
        await client.close();
    }

    console.log('Proceso completado.');
}

main().catch(console.error);