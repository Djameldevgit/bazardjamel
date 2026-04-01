// 📂 routes/categoryRoutes.js - AGREGAR NUEVA RUTA

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
  getCategoryMetadata  // ✅ NUEVO CONTROLADOR
} = require('../controllers/categoryCtrl');

// ============ RUTAS ============

// 🔥 NUEVA RUTA PARA METADATA (debe ir antes de :slug)
router.get('/metadata/:slug', getCategoryMetadata);  // ✅ OPCIÓN 1: /api/categories/metadata/:slug
// O también puedes usar:
// router.get('/:slug/metadata', getCategoryMetadata); // ✅ OPCIÓN 2: /api/categories/:slug/metadata

// Resto de rutas
router.get('/posts/:slug', getPostsByCategory);
router.get('/slider', obtenerCategoriasParaSlider);
router.get('/accordion', getCategoriesForAccordion);
router.get('/main', obtenerCategoriasPrincipales);
router.get('/tree', obtenerArbolDeCategorias);
router.get('/stats', obtenerEstadisticasDeCategorias);
router.get('/search/:query', buscarCategorias);
router.get('/:identifier', obtenerCategoriaPorId);

module.exports = router;