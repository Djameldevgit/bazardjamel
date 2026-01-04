const router = require('express').Router()
const postCtrl = require('../controllers/postCtrl')
const auth = require('../middleware/auth')

// routes/postRouter.js - AGREGAR NUEVAS RUTAS
// routes/postRouter.js - VERIFICAR QUE ESTÉN ESTAS RUTAS
 

// 📌 RUTAS DE POSTS
router.route('/posts')
    .post(auth, postCtrl.createPost)      // POST /api/posts
    .get(  postCtrl.getPosts);        // GET /api/posts

    router.route('/post/:id')
    .patch(auth, postCtrl.updatePost)
    .get( postCtrl.getPost)
    .delete(auth, postCtrl.deletePost)
// 📌 RUTAS DE CATEGORÍAS (NUEVAS)
 router.get('/categories/paginated', postCtrl.getAllCategoriesPaginated);

 
// ✅ RUTA ALTERNATIVA (por si estás usando esta)
router.get('/posts/category/:category', postCtrl.getPostsByCategory);


router.get('/category/:category', postCtrl.getPostsByCategory);
router.get('/posts/similar', postCtrl.getSimilarPosts);
 ; // Nueva
 router.get('/posts/category/:category/subcategory/:subcategory', postCtrl.getPostsBySubcategory);
 router.get('/categories/:category/subcategories', postCtrl.getSubCategoriesByCategory);
 // backend/routes/postRouter.js
router.get('/posts/category/immobilier/operation/:operationId', postCtrl.getPostsByImmobilierOperation);
router.get('/user_posts/:id', auth, postCtrl.getUserPosts);
router.get('/post_discover', auth, postCtrl.getPostsDicover);
router.patch('/savePost/:id', auth, postCtrl.savePost);
router.patch('/unSavePost/:id', auth, postCtrl.unSavePost);
router.get('/getSavePosts', auth, postCtrl.getSavePosts);

module.exports = router;
 