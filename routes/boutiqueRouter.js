// routes/boutiqueRoutes.js - AGREGAR ESTA RUTA
const router = require('express').Router();
const boutiqueCtrl = require('../controllers/boutiqueCtrl');
const auth = require('../middleware/auth');

// Rutas públicas
router.get('/boutique/filter', boutiqueCtrl.filterBoutiques);
router.get('/boutique/:id', boutiqueCtrl.getBoutique);
router.patch('/boutique/:boutiqueId/view', boutiqueCtrl.addView);

// ✅ RUTA FALTANTE - Obtener boutiques del usuario autenticado
router.get('/boutique/user/me', auth, boutiqueCtrl.getUserBoutiques);  // <-- ¡AGREGAR ESTA!

// Rutas protegidas
router.post('/boutique', auth, boutiqueCtrl.createBoutique);
router.patch('/boutique/:boutiqueId', auth, boutiqueCtrl.updateBoutique);
router.delete('/boutique/:boutiqueId', auth, boutiqueCtrl.deleteBoutique);
router.patch('/boutique/:boutiqueId/headerimages', auth, boutiqueCtrl.updateBoutiqueHeaderImages);
router.delete('/boutique/:boutiqueId/headerimages/:imageId', auth, boutiqueCtrl.deleteBoutiqueHeaderImage);

// Follow y Like
router.patch('/boutique/:boutiqueId/follow', auth, boutiqueCtrl.followBoutique);
router.post('/boutique/:boutiqueId/follow', auth, boutiqueCtrl.followBoutique);
router.get('/boutique/:boutiqueId/follow/check', auth, boutiqueCtrl.checkFollowBoutique);
router.get('/boutique/:boutiqueId/followers', boutiqueCtrl.getBoutiqueFollowers);

router.patch('/boutique/:boutiqueId/like', auth, boutiqueCtrl.likeBoutique);
router.post('/boutique/:boutiqueId/like', auth, boutiqueCtrl.likeBoutique);
router.get('/boutique/:boutiqueId/like/check', auth, boutiqueCtrl.checkLikeBoutique);
router.get('/boutique/:boutiqueId/likes', boutiqueCtrl.getBoutiqueLikes);

module.exports = router;