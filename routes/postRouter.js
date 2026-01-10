// 📂 routes/postRoutes.js
const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/postCtrl');
const auth = require('../middleware/auth');


router.get('/categories/paginated', postCtrl.getAllCategoriesPaginated);

 
 router.get('/posts/category/:category/subcategory/:subcategory', postCtrl.getPostsBySubcategory);
 


// 🔥 RUTAS PÚBLICAS
router.get('/posts', postCtrl.getPosts);
router.get('/posts/categories', postCtrl.getAllCategoriesPaginated);
router.get('/posts/category/:category', postCtrl.getPostsByCategory);
router.get('/posts/category/:category/subcategories', postCtrl.getSubCategoriesByCategory);
router.get('/posts/category/:category/:subcategory', postCtrl.getPostsBySubcategory);
router.get('/posts/immobilier/operation/:operationId', postCtrl.getPostsByImmobilierOperation);
router.get('/posts/similar', postCtrl.getSimilarPosts);
router.get('/posts/boutique/:boutiqueId', postCtrl.getPostsByBoutique); // <-- NUEVA

// 🔥 RUTAS CON AUTH
router.post('/posts', auth, postCtrl.createPost);
 
router.route('/post/:id')
.patch(auth, postCtrl.updatePost)
.get( postCtrl.getPost)
.delete(auth, postCtrl.deletePost)
router.get('/user/posts/:id', postCtrl.getUserPosts);
router.get('/posts/dicover', auth, postCtrl.getPostsDicover);
router.patch('/posts/:id/save', auth, postCtrl.savePost);
router.patch('/posts/:id/unsave', auth, postCtrl.unSavePost);
router.get('/posts/save', auth, postCtrl.getSavePosts);
router.get('/user/boutiques', auth, postCtrl.getUserBoutiques); // <-- NUEVA

// 🔥 RUTAS GENERALES
 
module.exports = router;