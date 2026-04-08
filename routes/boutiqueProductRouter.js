// routes/boutiqueProductRoutes.js
const router = require('express').Router();
const boutiqueProductCtrl = require('../controllers/boutiqueProductCtrl');
const auth = require('../middleware/auth');

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

// Usuario - sus productos
router.get('/user/products', auth, boutiqueProductCtrl.getUserProducts);

module.exports = router;