// routes/boutiqueRoutes.js
const router = require('express').Router();
const boutiqueCtrl = require('../controllers/boutiqueCtrl');
const auth = require('../middleware/auth');
 
// Rutas públicas
router.get('/boutique/filter', boutiqueCtrl.filterBoutiques);
router.get('/boutique/:id', boutiqueCtrl.getBoutique);

// Rutas protegidas
router.post('/boutique', auth, boutiqueCtrl.createBoutique);
router.patch('/boutique/:boutiqueId', auth, boutiqueCtrl.updateBoutique);
 
router.delete('/boutique/:boutiqueId', auth, boutiqueCtrl.deleteBoutique);
module.exports = router;