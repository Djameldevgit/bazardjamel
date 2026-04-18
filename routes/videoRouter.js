// routes/videoRoutes.js - ORDEN CORREGIDO

const router = require('express').Router();
const videoCtrl = require('../controllers/videoCtrl');
const auth = require('../middleware/auth');
 
 router.get('/music', videoCtrl.getMusicLibrary); 
router.get('/videos/filter', videoCtrl.filterVideos);

// Videos destacados
router.get('/videos/featured', videoCtrl.getFeaturedVideos);

// Videos populares
router.get('/videos/popular', videoCtrl.getPopularVideos);

// Videos tendencia
router.get('/videos/trending', videoCtrl.getTrendingVideos);

// Videos por categoría (DEBE IR ANTES de /:id)
router.get('/videos/category/:categorySlug', videoCtrl.getVideosByCategory);

// ============================================
// ✅ RUTAS CON PARÁMETRO :id (VAN DESPUÉS DE LAS ESPECÍFICAS)
// ============================================

// Videos relacionados
router.get('/videos/:id/related', videoCtrl.getRelatedVideos);

// Comentarios paginados
router.get('/videos/:id/comments', videoCtrl.getVideoComments);

// Obtener video por ID (va al final porque captura cualquier cosa)
router.get('/videos/:id',   videoCtrl.getVideoById);

// ============================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ============================================
router.post('/videos', auth, videoCtrl.createVideo);
router.patch('/videos/:id', auth, videoCtrl.updateVideo);
router.delete('/videos/:id', auth, videoCtrl.deleteVideo);
router.patch('/videos/:id/like', auth, videoCtrl.toggleLikeVideo);
router.patch('/videos/:id/share', auth, videoCtrl.shareVideo);
router.post('/videos/:id/watch-time', auth, videoCtrl.trackWatchTime);

// ============================================
// RUTAS DE COMENTARIOS
// ============================================
router.post('/videos/:id/comments', auth, videoCtrl.addComment);
router.patch('/videos/:id/comments/:commentId/like', auth, videoCtrl.likeComment);
router.post('/videos/:id/comments/:commentId/reply', auth, videoCtrl.addCommentReply);
router.delete('/videos/:id/comments/:commentId', auth, videoCtrl.deleteCommentCtrl);

// ============================================
// RUTAS DE USUARIO
// ============================================
router.get('/videos/user/stats', auth, videoCtrl.getUserVideoStats);
router.get('/users/:userId/videos', auth, videoCtrl.getUserVideos);

// ============================================
// RUTAS DE ADMIN
// ============================================
 

router.get('/admin/videos/pendientes', auth, videoCtrl.getVideosPendientesAdmin);
router.patch('/admin/videos/:id/approve', auth, videoCtrl.aprobarVideoAdmin);
router.delete('/admin/videos/:id', auth, videoCtrl.eliminarVideoAdmin);



module.exports = router;