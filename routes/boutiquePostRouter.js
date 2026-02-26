// routes/boutiqueRoutes.js
const router = require('express').Router();
const boutiquePostCtrl = require('../controllers/boutiquePostCtrl');
const auth = require('../middleware/auth');
 
 
router.post('/boutique/:boutiqueId/posts', auth, boutiquePostCtrl.createBoutiquePost);
router.get('/boutique/:boutiqueId/posts', boutiquePostCtrl.getBoutiquePosts); 
router.patch('/boutique/:boutiqueId/posts/:postId', auth, boutiquePostCtrl.updateBoutiquePost);
router.delete('/boutique/:boutiqueId/posts/:postId', auth, boutiquePostCtrl.deleteBoutiquePost);
 
 
module.exports = router;