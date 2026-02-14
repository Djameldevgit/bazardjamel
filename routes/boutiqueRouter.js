// routes/boutiqueRoutes.js
const router = require('express').Router();
const boutiqueController = require('../controllers/boutiqueCtrl');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

// Rutas públicas
router.get('/boutique/filter', boutiqueController.filterBoutiques);
router.get('/:id', boutiqueController.getBoutique);

// Rutas protegidas
router.post('/boutique', auth, boutiqueController.createBoutique);
router.put('/:id', auth, boutiqueController.updateBoutique);
router.delete('/:id', auth, boutiqueController.deleteBoutique);
router.get('/user/me', auth, boutiqueController.getUserBoutiques);

// Rutas de administrador
router.put('/:id/verify', auth, authAdmin, boutiqueController.verifyBoutique);

module.exports = router;