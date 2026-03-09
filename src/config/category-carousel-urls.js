// category-carousel-urls.js
// URLs para el carousel de CATEGORÍAS
// Generado automáticamente el 2026-3-5 3:45:15

export const CATEGORY_CAROUSEL = [
  "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772678699/header/carousel-category/electroniques.jpg",
  "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772678701/header/carousel-category/immobilier.jpg",
  "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772678703/header/carousel-category/loisirs.jpg",
  "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772678705/header/carousel-category/maison.jpg",
  "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772678707/header/carousel-category/sport.jpg",
  "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772678709/header/carousel-category/vehicules.jpg"
];

// Mapeo por slug de categoría
export const CATEGORY_IMAGES_BY_SLUG = {
  "electroniques": "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772678699/header/carousel-category/electroniques.jpg",
  "immobilier": "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772678701/header/carousel-category/immobilier.jpg",
  "loisirs": "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772678703/header/carousel-category/loisirs.jpg",
  "maison": "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772678705/header/carousel-category/maison.jpg",
  "sport": "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772678707/header/carousel-category/sport.jpg",
  "vehicules": "https://res.cloudinary.com/dfjipgj2o/image/upload/v1772678709/header/carousel-category/vehicules.jpg"
};

// Función helper para obtener imagen por slug
export const getCategoryImage = (slug) => {
  return CATEGORY_IMAGES_BY_SLUG[slug] || CATEGORY_CAROUSEL[0] || '';
};