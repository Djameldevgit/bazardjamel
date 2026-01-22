// 📂 routes/postRoutes.js - CORRECCIÓN COMPLETA
const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/postCtrl');
const auth = require('../middleware/auth');

// ⭐⭐ CORRECCIÓN: Todas las rutas NO deben comenzar con /posts
// Porque ya estás en router.use('/api/posts', postRoutes) en server.js

// ========== RUTAS CORRECTAS ==========

// 1. RUTAS FIJAS (sin /posts delante)
router.get('/health', postCtrl.healthCheck);              // ✅ CORRECTO: /api/posts/health
// router.get('/posts/health', ...)                       // ❌ INCORRECTO (duplicaría /api/posts/posts/health)

// ⭐⭐ CRÍTICO: /filter correcto
router.get('/posts/filter', postCtrl.filterPosts);              // ✅ CORRECTO: /api/posts/filter

// 2. RUTAS RESTANTES (sin /posts delante)
router.get('/featured', postCtrl.getFeaturedPosts);       // ✅ /api/posts/featured
router.get('/recent', postCtrl.getRecentPosts);           // ✅ /api/posts/recent
router.get('/post_discover', auth, postCtrl.getPostsDicover); // ✅ /api/posts/post_discover
router.get('/getSavePosts', auth, postCtrl.getSavePosts); // ✅ /api/posts/getSavePosts
router.get('/search/:query', postCtrl.searchPosts);       // ✅ /api/posts/search/:query
router.get('/user_posts/:id', auth, postCtrl.getUserPosts); // ✅ /api/posts/user_posts/:id
router.get('/', postCtrl.getPosts);                       // ✅ /api/posts/
router.get('/:id', postCtrl.getPostById);                 // ✅ /api/posts/:id
router.get('/post/:id', postCtrl.getPost);                // ✅ /api/posts/post/:id

// Rutas protegidas
router.post('/posts', auth, postCtrl.createPost);              // ✅ /api/posts/
router.put('/:id', auth, postCtrl.updatePost);            // ✅ /api/posts/:id
router.delete('/:id', auth, postCtrl.deletePost);         // ✅ /api/posts/:id
router.put('/:id/sold', auth, postCtrl.markAsSold);       // ✅ /api/posts/:id/sold
router.patch('/post/:id/like', auth, postCtrl.likePost);  // ✅ /api/posts/post/:id/like
router.patch('/post/:id/unlike', auth, postCtrl.unLikePost); // ✅ /api/posts/post/:id/unlike
router.patch('/savePost/:id', auth, postCtrl.savePost);   // ✅ /api/posts/savePost/:id
router.patch('/unSavePost/:id', auth, postCtrl.unSavePost); // ✅ /api/posts/unSavePost/:id

// Debug
router.post('/debug-create', postCtrl.debugCreate);       // ✅ /api/posts/debug-create
router.get('/posts/similar', postCtrl.getSimilarPosts);
router.get('/user_posts/:id', auth, postCtrl.getUserPosts)

module.exports = router;