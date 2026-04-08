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



router.get('/boutiques/admin/pendientes', auth, boutiqueCtrl.getBoutiquesPendientes);
router.get('/boutiques/admin/pendientes/count', auth, boutiqueCtrl.getBoutiquesPendientesCount);
router.put('/boutiques/admin/aprobar/:id', auth, boutiqueCtrl.aprobarBoutique);
router.get('/boutiques/admin/pendientes/count', auth, boutiqueCtrl.getBoutiquesPendientesCount);


// Follow y Like
router.patch('/boutique/:boutiqueId/follow', auth, boutiqueCtrl.followBoutique);
router.post('/boutique/:boutiqueId/follow', auth, boutiqueCtrl.followBoutique);
router.get('/boutique/:boutiqueId/follow/check', auth, boutiqueCtrl.checkFollowBoutique);
router.get('/boutique/:boutiqueId/followers', boutiqueCtrl.getBoutiqueFollowers);

router.patch('/boutique/:boutiqueId/like', auth, boutiqueCtrl.likeBoutique);
router.post('/boutique/:boutiqueId/like', auth, boutiqueCtrl.likeBoutique);
router.get('/boutique/:boutiqueId/like/check', auth, boutiqueCtrl.checkLikeBoutique);
router.get('/boutique/:boutiqueId/likes', boutiqueCtrl.getBoutiqueLikes);
router.get('/boutique/:boutiqueId/viewers', boutiqueCtrl.getViewersList);
router.get('/boutique/:boutiqueId/followers/list', boutiqueCtrl.getFollowersList);
router.get('/boutique/:boutiqueId/likes/list', boutiqueCtrl.getLikesList);


//router.get('/boutiques/admin/pendientes/count', auth, boutiqueCtrl.getBoutiquesPendientesCount);
router.get('/boutiques/admin/pendientes', auth, boutiqueCtrl.getBoutiquesPendientes);
router.put('/boutiques/admin/aprobar/:id', auth, boutiqueCtrl.aprobarBoutique);
router.delete('/boutiques/admin/rechazar/:id', auth, boutiqueCtrl.rechazarBoutique);

module.exports = router;