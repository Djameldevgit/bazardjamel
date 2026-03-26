const router = require('express').Router();
const boutiqueProductCtrl = require('../controllers/boutiqueProductCtrl');
const auth = require('../middleware/auth');

router.post('/boutique/:boutiqueId/products', auth, boutiqueProductCtrl.createBoutiqueProduct);
router.get('/boutique/:boutiqueId/products',  boutiqueProductCtrl.getBoutiqueProducts);
router.patch('/boutique/:boutiqueId/products/:productId', auth, boutiqueProductCtrl.updateBoutiqueProduct);
router.delete('/boutique/:boutiqueId/products/:productId', auth, boutiqueProductCtrl.deleteBoutiqueProduct);

module.exports = router;
 