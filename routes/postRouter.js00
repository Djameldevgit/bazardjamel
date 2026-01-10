const router = require('express').Router()
const postCtrl = require('../controllers/postCtrl')
const auth = require('../middleware/auth')

// ==================== RUTAS PÚBLICAS ====================

// 📌 POSTS
router.get('/posts', postCtrl.getPosts);
router.get('/post/:id', postCtrl.getPost);
router.get('/category/:category', postCtrl.getPostsByCategory);
router.get('/category/:category/subcategory/:subcategory', postCtrl.getPostsBySubcategory);
router.get('/posts/similar', postCtrl.getSimilarPosts);

// 📌 CATEGORÍAS
router.get('/categories/paginated', postCtrl.getAllCategoriesPaginated);
router.get('/categories/:category/subcategories', postCtrl.getSubCategoriesByCategory);
router.get('/posts/category/immobilier/operation/:operationId', postCtrl.getPostsByImmobilierOperation);

// 📌 BOUTIQUES - PÚBLICAS
router.get('/boutiques', postCtrl.getBoutiques);
router.get('/boutiques/featured', postCtrl.getActiveBoutiques);
router.get('/boutiques/search', postCtrl.searchBoutiques);
router.get('/boutiques/:boutiqueId', postCtrl.getBoutiqueById);

// ==================== RUTAS PROTEGIDAS ====================

// 📌 POSTS (CRUD)
router.post('/posts', auth, postCtrl.createPost);
router.patch('/post/:id', auth, postCtrl.updatePost);
router.delete('/post/:id', auth, postCtrl.deletePost);

// 📌 USUARIO
router.get('/user_posts/:id', auth, postCtrl.getUserPosts);
router.get('/post_discover', auth, postCtrl.getPostsDicover);
router.patch('/savePost/:id', auth, postCtrl.savePost);
router.patch('/unSavePost/:id', auth, postCtrl.unSavePost);
router.get('/getSavePosts', auth, postCtrl.getSavePosts);

// 📌 BOUTIQUES - PROTEGIDAS
router.patch('/boutiques/:boutiqueId/activate', auth, postCtrl.activateBoutique);
router.patch('/boutiques/:boutiqueId/suspend', auth, postCtrl.suspendBoutique);
router.patch('/boutiques/:boutiqueId/renew', auth, postCtrl.renewBoutique);
router.put('/boutiques/:boutiqueId', auth, postCtrl.updateBoutique);

// ==================== RUTAS ALTERNATIVAS ====================
router.get('/posts/category/:category', postCtrl.getPostsByCategory);

module.exports = router;