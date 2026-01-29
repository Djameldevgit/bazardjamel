// 📂 routes/categoryRoutes.js - ORDEN CORRECTO
const express = require('express');
const router = express.Router();
const {
  obtenerCategoriasPrincipales,
  obtenerCategoriaPorId,
  obtenerArbolDeCategorias,
 
  buscarCategorias,
  obtenerEstadisticasDeCategorias,
 
} = require('../controllers/categoryCtrl');


 
// 1. Rutas fijas
router.get('/main', obtenerCategoriasPrincipales);
router.get('/tree', obtenerArbolDeCategorias);
router.get('/stats', obtenerEstadisticasDeCategorias);
router.get('/search/:query', buscarCategorias);

 
 
router.get('/:identifier', obtenerCategoriaPorId);  // ⭐ ÚLTIMA

module.exports = router;