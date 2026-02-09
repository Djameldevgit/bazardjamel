 
const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/postCtrl');
const auth = require('../middleware/auth');

 
router.get('/health', postCtrl.healthCheck);       
 
router.get('/posts/filter', postCtrl.filterPosts);               

 
router.get('/featured', postCtrl.getFeaturedPosts);       
router.get('/recent', postCtrl.getRecentPosts);           
  

router.get('/search/:query', postCtrl.searchPosts);       
router.get('/user_posts/:id', auth, postCtrl.getUserPosts);  
                      
router.route('/post/:id')
.patch(auth, postCtrl.updatePost)
.get(  postCtrl.getPost)
.delete(auth, postCtrl.deletePost)
 
router.get('/posts/:id',    postCtrl.getPostById);
 
 
router.post('/posts', auth, postCtrl.createPost);              
           
          
/*router.patch('/post/:id/like', auth, postCtrl.likePost);   
router.patch('/post/:id/unlike', auth, postCtrl.unLikePost);  
router.patch('/savePost/:id', auth, postCtrl.savePost);   
router.patch('/unSavePost/:id', auth, postCtrl.unSavePost);  
router.get('/getSavePosts', auth, postCtrl.getSavePosts);  
*/
      // ✅ /api/posts/debug-create
//router.get('/posts/similar', postCtrl.getSimilarPosts);
router.get('/user_posts/:id', auth, postCtrl.getUserPosts)
router.get('/', postCtrl.getPosts);
module.exports = router;