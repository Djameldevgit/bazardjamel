// routes/boutiqueRoutes.js
const router = require('express').Router();
const boutiqueCtrl = require('../controllers/boutiqueCtrl');
const auth = require('../middleware/auth');

// ============================================
// RUTAS PÚBLICAS (No requieren autenticación)
// ============================================
router.get('/boutique/filter', boutiqueCtrl.filterBoutiques);
router.get('/boutique/:id', boutiqueCtrl.getBoutique);
router.patch('/boutique/:boutiqueId/view', boutiqueCtrl.addView);
router.get('/boutique/:boutiqueId/followers', boutiqueCtrl.getBoutiqueFollowers);
router.get('/boutique/:boutiqueId/likes', boutiqueCtrl.getBoutiqueLikes);
router.get('/boutique/:boutiqueId/viewers', boutiqueCtrl.getViewersList);
router.get('/boutique/:boutiqueId/followers/list', boutiqueCtrl.getFollowersList);
router.get('/boutique/:boutiqueId/likes/list', boutiqueCtrl.getLikesList);

// ============================================
// RUTAS PROTEGIDAS (Requieren autenticación)
// ============================================

// CRUD BOUTIQUES
router.post('/boutique', auth, boutiqueCtrl.createBoutique);
router.get('/boutique/user/me', auth, boutiqueCtrl.getUserBoutiques);
router.patch('/boutique/:boutiqueId', auth, boutiqueCtrl.updateBoutique);
router.delete('/boutique/:boutiqueId', auth, boutiqueCtrl.deleteBoutique);

// HEADER IMAGES
router.patch('/boutique/:boutiqueId/headerimages', auth, boutiqueCtrl.updateBoutiqueHeaderImages);
router.delete('/boutique/:boutiqueId/headerimages/:imageId', auth, boutiqueCtrl.deleteBoutiqueHeaderImage);

// STATUS BOUTIQUE
 
// FOLLOW BOUTIQUE
router.patch('/boutique/:boutiqueId/follow', auth, boutiqueCtrl.followBoutique);
router.post('/boutique/:boutiqueId/follow', auth, boutiqueCtrl.followBoutique);
router.get('/boutique/:boutiqueId/follow/check', auth, boutiqueCtrl.checkFollowBoutique);

// LIKE BOUTIQUE
router.patch('/boutique/:boutiqueId/like', auth, boutiqueCtrl.likeBoutique);
router.post('/boutique/:boutiqueId/like', auth, boutiqueCtrl.likeBoutique);
router.get('/boutique/:boutiqueId/like/check', auth, boutiqueCtrl.checkLikeBoutique);

// ============================================
// RUTAS DE ADMINISTRACIÓN (Requieren auth + role admin/moderator)
// ============================================

// Boutiques PENDIENTES (para aprobar)
router.get('/admin/boutiques/pendientes', auth, boutiqueCtrl.getBoutiquesPendientes);
router.get('/admin/boutiques/pendientes/count', auth, boutiqueCtrl.getBoutiquesPendientesCount);
router.put('/admin/boutiques/aprobar/:id', auth, boutiqueCtrl.aprobarBoutique);
router.delete('/admin/boutiques/rechazar/:id', auth, boutiqueCtrl.rechazarBoutique);

// ✅ NUEVA RUTA: Boutiques APROBADAS (para el panel de administración principal)
router.get('/admin/boutiques/aprobadas', auth, boutiqueCtrl.getBoutiquesAprobadas);

// ✅ Cambiar estado de boutique (Admin)
router.patch('/admin/boutiques/status/:id', auth, boutiqueCtrl.updateAdminBoutiqueStatus);

module.exports = router;