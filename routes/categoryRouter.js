// 📂 routes/categoryRoutes.js - ORDEN CORRECTO
const express = require('express');
const router = express.Router();
const {
  obtenerCategoriasPrincipales,
  obtenerCategoriaPorId,
  obtenerArbolDeCategorias,
  obtenerMasPostsDeCategoria,
  obtenerSubcategorias,
  buscarCategorias,
  obtenerEstadisticasDeCategorias,
  obtenerPostsFiltradosPorCategoria
} = require('../controllers/categoryCtrl');

// ⭐⭐ RUTAS ESPECÍFICAS PRIMERO (antes de parámetros dinámicos)
router.get('/filter', obtenerPostsFiltradosPorCategoria);
// 1. Rutas fijas
router.get('/main', obtenerCategoriasPrincipales);
router.get('/tree', obtenerArbolDeCategorias);
router.get('/stats', obtenerEstadisticasDeCategorias);
router.get('/search/:query', buscarCategorias);

// ⭐⭐ IMPORTANTE: /filter DEBE IR ANTES que /:slug
 

// ⭐⭐ RUTAS CON PARÁMETROS AL FINAL
router.get('/:slug/posts', obtenerMasPostsDeCategoria);
router.get('/:slug/children', obtenerSubcategorias);
router.get('/:identifier', obtenerCategoriaPorId);  // ⭐ ÚLTIMA

module.exports = router;