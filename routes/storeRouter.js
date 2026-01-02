const router = require('express').Router()
const storeCtrl = require('../controllers/storeCtrl')
const auth = require('../middleware/auth')

// Crear o listar tiendas del usuario
router.route('/stores')
  .post(auth, storeCtrl.createStore)
  .get(  storeCtrl.getStores)

// Ver, editar o eliminar una tienda
router.route('/store/:id')
  .get(  storeCtrl.getStore)
  .patch(auth, storeCtrl.updateStore)
  .delete(auth, storeCtrl.deleteStore)

// Tiendas para descubrir (otras personas)
router.get('/store_discover', auth, storeCtrl.discoverStores)

module.exports = router
