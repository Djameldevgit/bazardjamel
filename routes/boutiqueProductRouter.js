// routes/boutiqueProductRoutes.js
const router = require('express').Router();
const boutiqueProductCtrl = require('../controllers/boutiqueProductCtrl');
const auth = require('../middleware/auth');
// 🔥 OBTENER PRODUCTO POR ID (para DetailProduct)
router.get('/product/:productId', boutiqueProductCtrl.getProductById);

// Obtener productos de una boutique (público)
router.get('/boutique/:boutiqueId/products', boutiqueProductCtrl.getBoutiqueProducts);
// CRUD productos
router.post('/boutique/:boutiqueId/products', auth, boutiqueProductCtrl.createBoutiqueProduct);
router.get('/boutique/:boutiqueId/products', boutiqueProductCtrl.getBoutiqueProducts);
router.get('/boutique/products/:productId', boutiqueProductCtrl.getProductById);
router.patch('/boutique/:boutiqueId/products/:productId', auth, boutiqueProductCtrl.updateBoutiqueProduct);
router.delete('/boutique/:boutiqueId/products/:productId', auth, boutiqueProductCtrl.deleteBoutiqueProduct);

// Admin - productos pendientes
router.get('/admin/boutique-products/pendientes', auth, boutiqueProductCtrl.getProductsPendientes);
router.get('/admin/boutique-products/pendientes/count', auth, boutiqueProductCtrl.getProductsPendientesCount);
router.put('/admin/boutique-products/aprobar/:id', auth, boutiqueProductCtrl.aprobarProducto);
router.delete('/admin/boutique-products/rechazar/:id', auth, boutiqueProductCtrl.rechazarProducto);

// 📂 routes/boutiqueProductRoutes.js - AGREGAR ESTAS RUTAS

// Productos de la misma boutique
router.get('/product/:productId/same-boutique', boutiqueProductCtrl.getProductsFromSameBoutique);

// Productos similares
router.get('/product/:productId/similar', boutiqueProductCtrl.getSimilarProducts);

module.exports = router;