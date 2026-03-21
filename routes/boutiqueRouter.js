// routes/boutiqueRoutes.js
const router = require('express').Router();
const boutiqueCtrl = require('../controllers/boutiqueCtrl');
const auth = require('../middleware/auth');
 
// Rutas públicas
router.get('/boutique/filter', boutiqueCtrl.filterBoutiques);
router.get('/boutique/:id', boutiqueCtrl.getBoutique);
// Incrementar views de un producto
router.patch('/boutique/:boutiqueId/view', boutiqueCtrl.incrementBoutiqueView);
// Rutas protegidas
router.post('/boutique', auth, boutiqueCtrl.createBoutique);
router.patch('/boutique/:boutiqueId', auth, boutiqueCtrl.updateBoutique);
 
router.delete('/boutique/:boutiqueId', auth, boutiqueCtrl.deleteBoutique);

router.patch('/boutique/:boutiqueId/headerimages', auth, boutiqueCtrl.updateBoutiqueHeaderImages);
router.delete('/boutique/:boutiqueId/headerimages/:imageId', auth, boutiqueCtrl.deleteBoutiqueHeaderImage);
 


module.exports = router;