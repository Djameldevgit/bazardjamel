// subir-imagenes-carousels.js
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const https = require('https');

dotenv.config();

// =============================================
// CONFIGURACIÓN CLOUDINARY
// =============================================
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || 'dfjipgj2o',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// =============================================
// RUTAS DESTINO EN CLOUDINARY
// =============================================
const CLOUDINARY_PATHS = {
    category: 'header/carouselCategoryPage',   // para imágenes de categorías
    headerMain: 'header/carouselHome',          // para main del header
    headerSide: 'header/carouselHome'           // para side del header
};

// =============================================
// URLs DE LAS IMÁGENES (extraídas de tus componentes)
// =============================================

// ---- CATEGORY CAROUSEL ----
const CATEGORY_IMAGES = {
    immobilier: {
        main: [
            "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1599423300746-b62533397364?auto=format&fit=crop&w=1200&q=80"
        ],
        side: [
            "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=600&q=80"
        ]
    },
    vehicules: {
        main: [
            "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1493238792000-8113da705763?auto=format&fit=crop&w=1200&q=80"
        ],
        side: [
            "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1504215680853-026ed2a45def?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=600&q=80"
        ]
    },
    vetements: {
        main: [
            "https://images.unsplash.com/photo-1520975928316-56c2d8e4d0d9?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1495121605193-b116b5b09a6d?auto=format&fit=crop&w=1200&q=80"
        ],
        side: [
            "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1475180098004-ca48cd668fe0?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80"
        ]
    },
    electroniques: {
        main: [
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=1200&q=80"
        ],
        side: [
            "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1593642634367-d91a135587b5?auto=format&fit=crop&w=600&q=80"
        ]
    }
};

// ---- HEADER CAROUSEL ----
const HEADER_IMAGES = {
    main: [
        "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772672998/header/carousel-main/agencia.png",
        "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772673001/header/carousel-main/banner0.jpg",
        "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772673003/header/carousel-main/banner1.jpg",
        "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772673005/header/carousel-main/banner2.png",
        "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772673007/header/carousel-main/banner3.png",
        "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772673009/header/carousel-main/banner4.png",
        "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772673012/header/carousel-main/banner5.png",
        "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772673014/header/carousel-main/banner7.webp"
    ],
    side: [
        "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772673016/header/carousel-side/shop4.png",
        "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772673017/header/carousel-side/side2.jpg",
        "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772673019/header/carousel-side/side3.png",
        "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772673021/header/carousel-side/side4.webp",
        "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772673022/header/carousel-side/side5.webp"
    ]
};

// =============================================
// FUNCIÓN PARA DESCARGAR UNA IMAGEN DESDE URL
// =============================================
function descargarImagen(url) {
    return new Promise((resolve, reject) => {
        const tempDir = path.join(__dirname, 'temp_images');
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        const urlParts = url.split('/');
        let filename = urlParts[urlParts.length - 1].split('?')[0];
        if (!filename.includes('.') || url.includes('unsplash')) {
            filename = `image-${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
        }

        const tempPath = path.join(tempDir, filename);
        const file = fs.createWriteStream(tempPath);

        https.get(url, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(tempPath);
            });
        }).on('error', (err) => {
            fs.unlink(tempPath, () => {});
            reject(err);
        });
    });
}

// =============================================
// FUNCIÓN PARA SUBIR IMAGEN A CLOUDINARY
// =============================================
async function subirImagen(url, folder, publicId) {
    console.log(`   ⬆️ Subiendo: ${path.basename(url)} → ${folder}/${publicId}`);
    let tempPath = null;
    try {
        tempPath = await descargarImagen(url);
        const result = await cloudinary.uploader.upload(tempPath, {
            folder: folder,
            public_id: publicId,
            overwrite: true,
            unique_filename: false
        });
        console.log(`      ✅ Cloudinary URL: ${result.secure_url}`);
        fs.unlinkSync(tempPath);
        return { originalUrl: url, cloudinaryUrl: result.secure_url, publicId: result.public_id };
    } catch (error) {
        console.log(`      ❌ Error: ${error.message}`);
        if (tempPath && fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
        return { originalUrl: url, cloudinaryUrl: null, error: error.message };
    }
}

// =============================================
// FUNCIÓN PARA GENERAR PUBLIC_ID
// =============================================
function generarPublicId(url, categoria = '', tipo = '') {
    const urlParts = url.split('/');
    let baseName = urlParts[urlParts.length - 1].split('?')[0];
    baseName = baseName.replace(/\.[^/.]+$/, '');
    baseName = baseName.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    if (categoria) return `${categoria}-${baseName}`;
    if (tipo === 'main') return `main-${baseName}`;
    if (tipo === 'side') return `side-${baseName}`;
    return baseName;
}

// =============================================
// FUNCIÓN PRINCIPAL
// =============================================
async function main() {
    console.log('\n' + '='.repeat(80));
    console.log('🚀 SUBIENDO IMÁGENES DE CAROUSELS A CLOUDINARY');
    console.log('='.repeat(80));

    // 1. Subir imágenes de categorías
    console.log('\n📸 PROCESANDO CATEGORY CAROUSEL...');
    for (const [categoria, urls] of Object.entries(CATEGORY_IMAGES)) {
        console.log(`\n📁 Categoría: ${categoria}`);
        const todasUrls = [...urls.main, ...urls.side];
        for (let i = 0; i < todasUrls.length; i++) {
            const url = todasUrls[i];
            const tipo = i < urls.main.length ? 'main' : 'side';
            const publicId = generarPublicId(url, categoria, tipo);
            await subirImagen(url, `${CLOUDINARY_PATHS.category}/${categoria}`, publicId);
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    // 2. Subir imágenes de header (main)
    console.log('\n📸 PROCESANDO HEADER CAROUSEL (MAIN)...');
    for (let i = 0; i < HEADER_IMAGES.main.length; i++) {
        const url = HEADER_IMAGES.main[i];
        const publicId = generarPublicId(url, '', 'main');
        await subirImagen(url, CLOUDINARY_PATHS.headerMain, publicId);
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 3. Subir imágenes de header (side)
    console.log('\n📸 PROCESANDO HEADER CAROUSEL (SIDE)...');
    for (let i = 0; i < HEADER_IMAGES.side.length; i++) {
        const url = HEADER_IMAGES.side[i];
        const publicId = generarPublicId(url, '', 'side');
        await subirImagen(url, CLOUDINARY_PATHS.headerSide, publicId);
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ PROCESO COMPLETADO');
    console.log('='.repeat(80));
    console.log('\n📌 Las imágenes se han subido a:');
    console.log(`   • ${CLOUDINARY_PATHS.category}/[categoria]/`);
    console.log(`   • ${CLOUDINARY_PATHS.headerMain}/ (main y side)`);
}

main().catch(console.error);