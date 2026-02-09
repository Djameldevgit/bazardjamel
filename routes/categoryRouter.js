// 📂 routes/categoryRoutes.js - ORDEN CORRECTO
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


router.get('/categories/accordion',  getCategoriesForAccordion);
// 1. Rutas fijas
router.get('/main', obtenerCategoriasPrincipales);
router.get('/tree', obtenerArbolDeCategorias);
router.get('/stats', obtenerEstadisticasDeCategorias);
router.get('/search/:query', buscarCategorias);

 
 
router.get('/:identifier', obtenerCategoriaPorId);  // ⭐ ÚLTIMA

module.exports = router;