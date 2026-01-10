// 📂 routes/boutiqueRoutes.js
const express = require('express');
const router = express.Router();
const boutiqueCtrl = require('../controllers/boutiqueCtrl');
const auth = require('../middleware/auth');
 
// 🔥 RUTAS PÚBLICAS
router.get('/boutiques', boutiqueCtrl.getBoutiques);
router.get('/boutique/domaine/:domaine', boutiqueCtrl.getBoutiqueByDomain);
router.get('/boutique/:id/products', boutiqueCtrl.getBoutiqueProducts);
//router.get('/boutique/slug/:slug', boutiqueCtrl.getBoutiqueBySlug); // Nueva ruta para slugs

// 🔥 RUTAS PROTEGIDAS
router.post('/boutique',   boutiqueCtrl.createBoutique);
router.get('/boutique/:id',   boutiqueCtrl.getBoutique);
router.put('/boutique/:id', auth, boutiqueCtrl.updateBoutique);
router.delete('/boutique/:id', auth, boutiqueCtrl.deleteBoutique);

// 🔥 RUTAS ESPECÍFICAS DE USUARIO
router.get('/user/boutiques', auth, boutiqueCtrl.getUserBoutiques);
router.patch('/boutique/:boutiqueId/add-product', auth, boutiqueCtrl.addBoutiqueProduct);
router.patch('/boutique/:boutiqueId/remove-product', auth, boutiqueCtrl.removeBoutiqueProduct);
router.get('/boutique/:id/stats', auth, boutiqueCtrl.getBoutiqueStats);

// 🔥 RUTAS DE ADMIN
router.put('/boutique/:id/status', auth,   boutiqueCtrl.updateBoutiqueStatus);

module.exports = router;