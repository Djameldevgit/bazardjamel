// header-carousel-urls.js
// URLs para el carousel del HEADER
// Generado automáticamente el 2026-3-5 3:45:15

export const HEADER_CAROUSEL = {
  "main": [
    "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772678669/header/carousel-main/electronica.jpg",
    "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772678671/header/carousel-main/inmobiliaria.jpg",
    "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772678674/header/carousel-main/vehiculos.jpg"
  ],
  "side": [
    "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772678675/header/carousel-side/promo1.jpg",
    "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772678698/header/carousel-side/promo3.jpg"
  ]
};

// Función helper para obtener URL por índice
export const getHeaderImage = (tipo, indice) => {
  if (!HEADER_CAROUSEL[tipo] || !HEADER_CAROUSEL[tipo][indice]) {
    console.warn(`⚠️ Imagen no encontrada: ${tipo}[${indice}]`);
    return '';
  }
  return HEADER_CAROUSEL[tipo][indice];
};