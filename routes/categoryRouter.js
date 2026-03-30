// 📂 routes/categoryRoutes.js - CORREGIDO

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
  getPostsByCategory
} = require('../controllers/categoryCtrl');

// ============ RUTAS ============

// 🔥 CORREGIDO: Quitar "categories/" porque ya está en la base URL
router.get('/posts/:slug', getPostsByCategory);

// Resto de rutas
router.get('/slider', obtenerCategoriasParaSlider);
router.get('/accordion', getCategoriesForAccordion);
router.get('/main', obtenerCategoriasPrincipales);
router.get('/tree', obtenerArbolDeCategorias);
router.get('/stats', obtenerEstadisticasDeCategorias);
router.get('/search/:query', buscarCategorias);
router.get('/:identifier', obtenerCategoriaPorId);

module.exports = router;