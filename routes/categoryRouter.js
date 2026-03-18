// 📂 routes/categoryRoutes.js - VERSIÓN CORREGIDA
const express = require('express');
const router = express.Router();

const {
  obtenerCategoriasPrincipales,
  obtenerCategoriaPorId,
  obtenerArbolDeCategorias,
  buscarCategorias,
  obtenerEstadisticasDeCategorias,
  getCategoriesForAccordion
} = require('../controllers/categoryCtrl');

// ============ RUTAS CORREGIDAS (SIN PREFIJO /categories) ============

// ✅ Ahora será: /api/categories/accordion
router.get('/accordion', getCategoriesForAccordion);

// ✅ Otras rutas específicas
router.get('/main', obtenerCategoriasPrincipales);
router.get('/tree', obtenerArbolDeCategorias);
router.get('/stats', obtenerEstadisticasDeCategorias);

// ✅ Ruta con parámetro (va después de las específicas)
router.get('/search/:query', buscarCategorias);

// ✅ Ruta genérica con parámetro (DEBE IR AL FINAL)
router.get('/:identifier', obtenerCategoriaPorId);

module.exports = router;
 
 
router.get('/:identifier', obtenerCategoriaPorId);  // ⭐ ÚLTIMA

module.exports = router;