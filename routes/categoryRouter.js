// 📂 routes/categoryRoutes.js
const express = require('express');
const router = express.Router();

const {
  obtenerCategoriasParaSlider,
  obtenerCategoriasPrincipales,
  obtenerCategoriaPorId,
  obtenerArbolDeCategorias,
  buscarCategorias,
  obtenerEstadisticasDeCategorias,
  getCategoriesForAccordion,
  getPostsByCategory,
  getCategoryMetadata
} = require('../controllers/categoryCtrl');

// ============================================
// 1️⃣ RUTAS ESTÁTICAS (sin parámetros)
// ============================================
router.get('/slider', obtenerCategoriasParaSlider);
router.get('/accordion', getCategoriesForAccordion);
router.get('/main', obtenerCategoriasPrincipales);
router.get('/tree', obtenerArbolDeCategorias);
router.get('/stats', obtenerEstadisticasDeCategorias);

// ============================================
// 2️⃣ RUTAS CON QUERY PARAMS (búsqueda)
// ============================================
router.get('/search/:query', buscarCategorias);

// ============================================
// 3️⃣ RUTAS CON PARÁMETROS (específicas)
// ============================================
router.get('/metadata/:slug', getCategoryMetadata);
router.get('/posts/:slug', getPostsByCategory);

// ============================================
// 4️⃣ RUTA COMODÍN (debe ir al final)
// ============================================
router.get('/:identifier', obtenerCategoriaPorId);

module.exports = router;