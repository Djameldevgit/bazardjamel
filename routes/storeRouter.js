const router = require('express').Router()
const storeCtrl = require('../controllers/storeCtrl')
const auth = require('../middleware/auth')
// ==================== RUTAS PÚBLICAS ====================
router.get('/stores/my-store', auth, storeCtrl.getMyStore) // Obtener mi tienda
router.get('/my-store/stats', auth, storeCtrl.getMyStoreStats) // Estadísticas
router.put('/toggle-active/:id', auth, storeCtrl.toggleStoreActive) // Activar/desactivar

// 🏪 RUTA PARA COMPONENTE StoresCategoryPage (corregir)
router.get('/category/stores/:category?', storeCtrl.getStoresByStoreCategory)
// 📋 Obtener todas las stores públicas (para marketplace)
router.get('/public/all', storeCtrl.getPublicStores)
// En storeRoutes.js
//router.get('/category/stores/:category?', storeCtrl.getStoresByStoreCategory);
// 🔍 Buscar stores (pública)
router.get('/public/search', storeCtrl.searchPublicStores)

// 🏪 Obtener stores por categoría (para mostrar en categorías)
router.get('/public/category/:category', storeCtrl.getStoresByCategory)

// 📊 Obtener estadísticas de stores por categoría
router.get('/public/stats/categories', storeCtrl.getStoreCategoriesStats)

// 👤 Obtener stores por usuario (pública)
router.get('/public/user/:id', storeCtrl.getPublicStoresByUser)

// 🏪 Obtener una store específica (pública)
router.get('/public/:id', storeCtrl.getPublicStoreById)

// ==================== RUTAS PROTEGIDAS ====================

// 🆕 Crear store
router.post('/stores', auth, storeCtrl.createStore)

// 👤 Obtener mis stores
router.get('/my-stores', auth, (req, res) => {
  req.params.id = req.user._id
  storeCtrl.getStoresByUser(req, res)
})

// ✏️ Actualizar store (solo dueño)
router.patch('/update/:id', auth, storeCtrl.updateStore)

// 📈 Cambiar plan (solo dueño)
router.patch('/change-plan/:id', auth, storeCtrl.changePlan)

// ❌ Eliminar store (solo dueño)
router.delete('/delete/:id', auth, storeCtrl.deleteStore)

// ==================== RUTAS EXISTENTES (Mantener compatibilidad) ====================

// 📋 Obtener todas las stores (con paginación)
router.get('/all', storeCtrl.getAllStores)

// 🔍 Buscar stores
router.get('/search', storeCtrl.searchStores)

// 👤 Obtener stores por usuario
router.get('/user/:id', storeCtrl.getStoresByUser)

// 🏪 Obtener una store específica
router.get('/:id', storeCtrl.getStoreById)

module.exports = router