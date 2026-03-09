// header-images.js
// URLs de Cloudinary para el header
// GENERADO AUTOMÁTICAMENTE - 2026-3-5 2:27:54
// NO MODIFICAR MANUALMENTE

export const HEADER_IMAGES = {
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

// Función para obtener URL optimizada
export const getHeaderImage = (tipo, indice, opciones = {}) => {
  const { ancho, alto, calidad = 'auto' } = opciones;
  
  if (!HEADER_IMAGES[tipo] || !HEADER_IMAGES[tipo][indice]) {
    console.warn(`⚠️ Imagen no encontrada: ${tipo}[${indice}]`);
    return '';
  }
  
  let url = HEADER_IMAGES[tipo][indice];
  
  // Añadir transformaciones si se especifican
  const transformaciones = [];
  if (ancho) transformaciones.push(`w_${ancho}`);
  if (alto) transformaciones.push(`h_${alto}`);
  if (calidad) transformaciones.push(`q_${calidad}`);
  
  if (transformaciones.length > 0) {
    url = url.replace('/upload/', `/upload/${transformaciones.join(',')}/`);
  }
  
  return url;
};