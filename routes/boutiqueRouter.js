// routes/boutiqueRoutes.js
const router = require('express').Router();
const boutiqueCtrl = require('../controllers/boutiqueCtrl');
const auth = require('../middleware/auth');
const authAdmin = require('../middleware/authAdmin');

// Rutas públicas
router.get('/boutique/filter', boutiqueCtrl.filterBoutiques);
router.get('/boutique/:id', boutiqueCtrl.getBoutique);

// Rutas protegidas
router.post('/boutique', auth, boutiqueCtrl.createBoutique);
router.post('/boutique/:boutiqueId/posts', auth, boutiqueCtrl.createBoutiquePost);
router.get('/boutique/:boutiqueId/posts', boutiqueCtrl.getBoutiquePosts); 
router.put('/boutique/:boutiqueId/posts/:postId', auth, boutiqueCtrl.updateBoutiquePost);
router.delete('/boutique/:boutiqueId/posts/:postId', auth, boutiqueCtrl.deleteBoutiquePost);
router.patch('/boutique/:id', auth, boutiqueCtrl.updateBoutique);
// 🛍️ CRUD de posts de boutique
router.get('/:boutiqueId/posts', boutiqueCtrl.getBoutiquePosts);
router.patch('/:boutiqueId/posts/:postId', auth, boutiqueCtrl.updateBoutiquePost);
router.delete('/:boutiqueId/posts/:postId', auth, boutiqueCtrl.deleteBoutiquePost);

router.delete('/boutique/:id', auth, boutiqueCtrl.deleteBoutique);
router.get('/user/me', auth, boutiqueCtrl.getUserBoutiques);

// Rutas de administrador
router.put('/:id/verify', auth, authAdmin, boutiqueCtrl.verifyBoutique);

module.exports = router;