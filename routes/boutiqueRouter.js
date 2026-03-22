// routes/boutiqueRoutes.js
const router = require('express').Router();
const boutiqueCtrl = require('../controllers/boutiqueCtrl');
const auth = require('../middleware/auth');
 
// Rutas públicas
router.get('/boutique/filter', boutiqueCtrl.filterBoutiques);
router.get('/boutique/:id', boutiqueCtrl.getBoutique);
// Incrementar views de un producto
// Asegúrate que la ruta existe
router.patch('/boutique/:boutiqueId/view', boutiqueCtrl.addView);
// Rutas protegidas
router.post('/boutique', auth, boutiqueCtrl.createBoutique);
router.patch('/boutique/:boutiqueId', auth, boutiqueCtrl.updateBoutique);
 
router.delete('/boutique/:boutiqueId', auth, boutiqueCtrl.deleteBoutique);

router.patch('/boutique/:boutiqueId/headerimages', auth, boutiqueCtrl.updateBoutiqueHeaderImages);
router.delete('/boutique/:boutiqueId/headerimages/:imageId', auth, boutiqueCtrl.deleteBoutiqueHeaderImage);
 
// ============ FOLLOW ============
router.patch('/boutique/:boutiqueId/follow', auth, boutiqueCtrl.followBoutique);
router.post('/boutique/:boutiqueId/follow', auth, boutiqueCtrl.followBoutique);  // ← Agregar POST también
router.get('/boutique/:boutiqueId/follow/check', auth, boutiqueCtrl.checkFollowBoutique);
router.get('/boutique/:boutiqueId/followers', boutiqueCtrl.getBoutiqueFollowers);

// ============ LIKE ============
router.patch('/boutique/:boutiqueId/like', auth, boutiqueCtrl.likeBoutique);
router.post('/boutique/:boutiqueId/like', auth, boutiqueCtrl.likeBoutique);  // ← Agregar POST también
router.get('/boutique/:boutiqueId/like/check', auth, boutiqueCtrl.checkLikeBoutique);
router.get('/boutique/:boutiqueId/likes', boutiqueCtrl.getBoutiqueLikes);
module.exports = router;