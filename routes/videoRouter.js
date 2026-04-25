// routes/videoRoutes.js - ORDEN CORREGIDO

const router = require('express').Router();
const videoCtrl = require('../controllers/videoCtrl');
const auth = require('../middleware/auth');

// ============================================
// ✅ RUTAS ESPECÍFICAS (DEBEN IR ANTES QUE :id)
// ============================================

router.get('/music', videoCtrl.getMusicLibrary); 
router.get('/videos/filter', videoCtrl.filterVideos);
router.get('/videos/featured', videoCtrl.getFeaturedVideos);
router.get('/videos/popular', videoCtrl.getPopularVideos);
router.get('/videos/trending', videoCtrl.getTrendingVideos);
router.get('/videos/category/:categorySlug', videoCtrl.getVideosByCategory);

// ✅ RUTAS PÚBLICAS ESPECÍFICAS (ANTES DE :id)
router.get('/videos/public/:id', videoCtrl.getVideoByIdPublic);

// ✅ RUTAS PRIVADAS ESPECÍFICAS (ANTES DE :id)
router.get('/videos/private/:id', auth, videoCtrl.getVideoByIdPrivate);

// ✅ RUTAS CON :id (VAN DESPUÉS DE LAS ESPECÍFICAS)
router.get('/videos/:id/related', videoCtrl.getRelatedVideos);
router.get('/videos/:id/comments', videoCtrl.getVideoComments);

// ⚠️ ESTA RUTA CAPTURA CUALQUIER /videos/:id - DEBE IR AL FINAL
router.get('/videos/:id', videoCtrl.getVideoById);

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
 
router.patch('/videos/:id/comments/:commentId/replies/:replyId', auth, videoCtrl.editReply);
router.delete('/videos/:id/comments/:commentId/replies/:replyId', auth, videoCtrl.deleteReplyCtrl);
// ============================================
// RUTAS DE USUARIO
router.patch('/videos/:id/comments/:commentId', auth, videoCtrl.editComment);      // Editar comentario
router.delete('/videos/:id/comments/:commentId', auth, videoCtrl.deleteCommentCtrl); // Eliminar co

// ============================================
router.get('/videos/user/stats', auth, videoCtrl.getUserVideoStats);
router.get('/users/:userId/videos', auth, videoCtrl.getUserVideos);

// ============================================
// RUTAS DE ADMIN
// ============================================
router.get('/admin/videos/pendientes', auth, videoCtrl.getVideosPendientesAdmin);
router.patch('/admin/videos/:id/approve', auth, videoCtrl.aprobarVideoAdmin);
router.delete('/admin/videos/:id', auth, videoCtrl.eliminarVideoAdmin);



// routes/videoRoutes.js - AGREGAR ESTAS RUTAS

// ============================================
// RUTAS DE PERFIL DE USUARIO (ESTILO TIKTOK)
// ============================================

// Perfil de usuario con estadísticas
router.get('/user/:userId/profile', auth, videoCtrl.getUserProfileStats);
router.get('/user/:userId/profile/public/:userId', videoCtrl.getUserProfileStats); // Ruta pública si es necesario

// Videos del usuario (ya existe, pero verificamos)
router.get('/users/:userId/videos', auth, videoCtrl.getUserVideos);

// Videos guardados del usuario
router.get('/user/:userId/saved-videos', auth, videoCtrl.getUserSavedVideos);

// Videos que le gustaron al usuario
router.get('/user/:userId/liked-videos', auth, videoCtrl.getUserLikedVideos);

// Seguir/Dejar de seguir usuario
router.post('/user/:userId/follow', auth, videoCtrl.toggleFollowUser);

// Guardar/Quitar video de favoritos
router.post('/videos/:videoId/save', auth, videoCtrl.toggleSaveVideo);





module.exports = router;