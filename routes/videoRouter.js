// routes/videoRoutes.js
const router = require('express').Router();
const videoCtrl = require('../controllers/videoCtrl');
const auth = require('../middleware/auth');

// ============================================
// RUTAS PÚBLICAS (sin autenticación)
// ============================================
router.get('/videos/featured', videoCtrl.getFeaturedVideos);
router.get('/videos/popular', videoCtrl.getPopularVideos);
router.get('/videos/category/:categorySlug', videoCtrl.getVideosByCategory);
router.get('/videos/:id', videoCtrl.getVideoById);

// ============================================
// RUTAS PROTEGIDAS (requieren autenticación)
// ============================================
router.post('/videos', auth, videoCtrl.createVideo);
router.patch('/videos/:id', auth, videoCtrl.updateVideo);
router.delete('/videos/:id', auth, videoCtrl.deleteVideo);
router.patch('/videos/:id/like', auth, videoCtrl.toggleLikeVideo);
router.get('/users/:userId/videos', auth, videoCtrl.getUserVideos);

// ============================================
// RUTAS DE ADMIN (requieren autenticación + rol admin)
// ============================================
router.get('/admin/videos/pending', auth, videoCtrl.getPendingVideos);
router.patch('/admin/videos/:id/approve', auth, videoCtrl.approveVideo);
router.delete('/admin/videos/:id/reject', auth, videoCtrl.rejectVideo);
// Obtener videos relacionados
router.get('/videos/:id/related', videoCtrl.getRelatedVideos);

// Agregar comentario
router.post('/videos/:id/comment', auth, videoCtrl.addComment);
module.exports = router;