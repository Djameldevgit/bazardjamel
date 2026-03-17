const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/postCtrl');
const auth = require('../middleware/auth');

// ============ 1. RUTAS PÚBLICAS (SIN PARÁMETROS) ============
router.get('/health', postCtrl.healthCheck);
router.get('/', postCtrl.getPosts);
router.get('/featured', postCtrl.getFeaturedPosts);
router.get('/recent', postCtrl.getRecentPosts);

// ============ 2. RUTAS CON QUERY PARAMS ============
 
router.get('/posts/filter', postCtrl.filterPosts);
router.get('/posts/similar', postCtrl.getSimilarPosts);
router.get('/filters/options', postCtrl.getFilterOptions);
// ============ 3. RUTAS CON PARÁMETROS ESPECÍFICOS ============
router.get('/search/:query', postCtrl.searchPosts);
router.get('/user_posts/:id', auth, postCtrl.getUserPosts);
router.get('/public/user_posts/:userId', postCtrl.getPublicUserPosts);
// ============ 4. RUTAS CON ID (DEBEN IR AL FINAL) ============
router.route('/post/:id')
  .patch(auth, postCtrl.updatePost)
  
  .delete(auth, postCtrl.deletePost);
  
  router.get('/post/:id', postCtrl.getPost);

router.get('/posts/:id/', postCtrl.getPostById);
router.patch('/post/:id/view', postCtrl.addView)
 
router.post('/posts', auth, postCtrl.createPost);

 
router.patch('/post/:id/like', auth, postCtrl.likePost);
router.patch('/post/:id/unlike', auth, postCtrl.unLikePost);
router.patch('/savePost/:id', auth, postCtrl.savePost);
router.patch('/unSavePost/:id', auth, postCtrl.unSavePost);
router.get('/getSavePosts', auth, postCtrl.getSavePosts);
 

module.exports = router;