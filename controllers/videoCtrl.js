// controllers/videoCtrl.js
const Video = require('../models/videoModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// Configuración de Pixabay
const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY;
const PIXABAY_VIDEO_API_URL = 'https://pixabay.com/api/videos/';

// Música de respaldo (fallback)
const MOCK_MUSIC = [
  { id: 1, title: 'Électro Algérien', user: 'DJ Mesta', duration: 210, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', tags: 'electro', genre: 'Électro' },
  { id: 2, title: 'Chaabi Moderne', user: 'Cheb Momo', duration: 252, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', tags: 'chaabi', genre: 'Chaabi' },
  { id: 3, title: 'Rap Oranais', user: 'MC Blida', duration: 210, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', tags: 'rap', genre: 'Rap' },
  { id: 4, title: 'Ambiance Café', user: 'Groupe Tizi', duration: 300, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', tags: 'acoustique', genre: 'Acoustique' },
  { id: 5, title: 'Sahara Sunset', user: 'Karim DZ', duration: 285, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', tags: 'ambient', genre: 'Ambient' },
  { id: 6, title: 'Raï Moderne', user: 'Cheb Bilal', duration: 235, audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', tags: 'raï', genre: 'Raï' },
];

const getMusicLibrary = async (req, res) => {
  const q = req.query.q || 'background';
  const limit = parseInt(req.query.limit) || 20;
  const perPage = Math.min(limit, 50);

  try {
    if (!PIXABAY_API_KEY) {
      console.warn('⚠️ Sin API key, usando música mock');
      const filtered = MOCK_MUSIC.filter(track => 
        track.title.toLowerCase().includes(q.toLowerCase()) || 
        track.tags.toLowerCase().includes(q.toLowerCase())
      ).slice(0, perPage);
      return res.json({ success: true, hits: filtered });
    }

    const response = await axios.get(PIXABAY_VIDEO_API_URL, {
      params: {
        key: PIXABAY_API_KEY,
        q: q,
        per_page: perPage,
        editors_choice: true,
        video_type: 'music',
      },
    });

    const hits = response.data.hits.map(video => ({
      id: video.id,
      title: video.tags ? video.tags.split(',')[0] : 'Son títre',
      tags: video.tags || '',
      user: video.user || 'Artiste Inconue',
      duration: video.duration || 0,
      audio: video.videos.tiny.url || video.videos.small.url || '',
      thumbnail: video.previewURL || '',
      genre: 'Pop',
    })).filter(item => item.audio);

    res.json({ success: true, hits });
  } catch (error) {
    console.error('Error en API música Pixabay:', error.message);
    const filtered = MOCK_MUSIC.filter(track =>
      track.title.toLowerCase().includes(q.toLowerCase())
    ).slice(0, perPage);
    res.json({ success: true, hits: filtered, warning: 'Usando música de respaldo' });
  }
};

// ========== FUNCIONES PÚBLICAS ==========

// ✅ Obtener videos por categoría (HOME - slider)
  

// ✅ Para PÚBLICO - Solo videos aprobados
// controllers/videoCtrl.js

// ✅ Para PÚBLICO - Solo videos aprobados
// controllers/videoCtrl.js

// ✅ Para PÚBLICO - Solo videos aprobados (con manejo de errores claro)
// controllers/videoCtrl.js - getVideoByIdPublic CORREGIDO

const getVideoByIdPublic = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🔍 getVideoByIdPublic llamado con ID:', id);
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID de vidéo invalide' 
      });
    }

    const video = await Video.findById(id)
      .populate('user', 'username avatar isPro role')
      .populate('comments.user', 'username avatar isPro')
      .populate('comments.replies.user', 'username avatar isPro')
      .lean();

    if (!video) {
      return res.status(404).json({ 
        success: false, 
        message: 'Vidéo non trouvée' 
      });
    }

    console.log('📹 Video encontrado:', { 
      id: video._id, 
      pendiente: video.pendiente, 
      title: video.title 
    });

    // ✅ Si está pendiente - devolver el video con su campo pendiente=true
    if (video.pendiente === true) {
      return res.status(200).json({ 
        success: false,
        video: video,  // Enviamos el video COMPLETO con su campo pendiente
        message: '📹 Votre vidéo a été envoyée aux administrateurs pour validation. Vous serez notifié dès qu\'elle sera publiée.'
      });
    }

    // ✅ Solo incrementar views si está aprobado
    await Video.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();

    const videoData = { ...video, liked: false };
    res.json({ success: true, video: videoData });
  } catch (error) {
    console.error('Error getVideoByIdPublic:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur lors du chargement de la vidéo' 
    });
  }
};
// ✅ Para ADMIN/DUEÑO - Puede ver videos pendientes
const getVideoByIdPrivate = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    const video = await Video.findById(id)
      .populate('user', 'username avatar isPro role')
      .populate('comments.user', 'username avatar isPro')
      .populate('comments.replies.user', 'username avatar isPro')
      .lean();

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }

    const isAdmin = req.user.role === 'admin' || req.user.role === 'moderator';
    const isOwner = video.user._id.toString() === req.user._id.toString();

    // ✅ Verificar permisos
    if (video.pendiente === true && !isAdmin && !isOwner) {
      return res.status(403).json({ 
        success: false, 
        message: 'Vous n\'avez pas la permission de voir cette vidéo' 
      });
    }

    // ✅ Mensaje especial para el dueño si está pendiente
    if (video.pendiente === true && isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: '📹 Votre vidéo est en attente d\'approbation par un administrateur. Vous serez notifié dès qu\'elle sera publiée.',
        pending: true
      });
    }

    // ✅ Incrementar views (solo si no es admin viendo pendiente)
    if (!video.pendiente || isAdmin) {
      Video.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();
      Video.findByIdAndUpdate(id, { $addToSet: { uniqueViews: req.user._id } }).exec();
    }

    let liked = false;
    if (req.user && req.user._id && video.likes) {
      const userIdStr = req.user._id.toString();
      liked = video.likes.some(likeId => likeId && likeId.toString() === userIdStr);
    }

    const videoData = { ...video, liked };
    res.json({ success: true, video: videoData });
  } catch (error) {
    console.error('Error getVideoByIdPrivate:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ✅ Obtener video por ID
// ✅ Versión corregida de getVideoById
const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }

    const video = await Video.findById(id)
      .populate('user', 'username avatar isPro role')
      .populate('comments.user', 'username avatar isPro')
      .populate('comments.replies.user', 'username avatar isPro')
      .lean();

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }

    // ✅ Verificar si es admin correctamente
    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'moderator');
    
    // ✅ LOG para depuración
    console.log('🔍 getVideoById - Video:', { 
      id: video._id, 
      pendiente: video.pendiente,
      userRole: req.user.role,
      isAdmin: isAdmin
    });
    
    // ✅ Permitir a admin ver videos pendientes
    if (video.pendiente === true && !isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Video en attente d\'approbation. Veuillez patienter.' 
      });
    }

    // ✅ Incrementar views solo si no es admin o el video está aprobado
    if (!video.pendiente || isAdmin) {
      Video.findByIdAndUpdate(id, { $inc: { views: 1 } }).exec();
      if (req.user && req.user._id) {
        Video.findByIdAndUpdate(id, { $addToSet: { uniqueViews: req.user._id } }).exec();
      }
    }

    let liked = false;
    if (req.user && req.user._id && video.likes) {
      const userIdStr = req.user._id.toString();
      liked = video.likes.some(likeId => likeId && likeId.toString() === userIdStr);
    }

    const videoData = { ...video, liked };
    res.json({ success: true, video: videoData });
  } catch (error) {
    console.error('Error getVideoById:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ✅ Obtener videos del usuario
const getUserVideos = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const match = { user: new mongoose.Types.ObjectId(userId) };
    const isOwnerOrAdmin = req.user && (req.user._id.toString() === userId || req.user.role === 'admin');
    
    if (!isOwnerOrAdmin) {
      match.pendiente = false;
      match.isActive = true;
    }

    const [videos, total] = await Promise.all([
      Video.aggregate([
        { $match: match },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: parseInt(limit) },
        { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
        { $unwind: '$user' },
        { $lookup: { from: 'boutiques', localField: 'boutique', foreignField: '_id', as: 'boutique' } },
        { $unwind: { path: '$boutique', preserveNullAndEmptyArrays: true } },
        { $lookup: { from: 'posts', localField: 'product', foreignField: '_id', as: 'product' } },
        { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
        { $project: { 'user.password': 0, 'user.email': 0 } }
      ]),
      Video.countDocuments(match)
    ]);

    let stats = null;
    if (isOwnerOrAdmin) {
      const statsAgg = await Video.aggregate([
        { $match: match },
        { $group: {
          _id: null,
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: { $size: '$likes' } },
          totalComments: { $sum: { $size: '$comments' } },
          totalShares: { $sum: { $size: { $ifNull: ['$shares', []] } } }
        }}
      ]);
      stats = statsAgg[0] || null;
    }

    res.json({
      success: true,
      videos,
      stats,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('Error getUserVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
 

// ✅ Videos destacados
const getFeaturedVideos = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const videos = await Video.find({ 
      isFeatured: true, 
      pendiente: false, 
      isActive: true 
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('user', 'username avatar isPro');
    res.json({ success: true, videos });
  } catch (error) {
    console.error('Error getFeaturedVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Videos populares
const getPopularVideos = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const videos = await Video.aggregate([
      { $match: { pendiente: false, isActive: true } },
      { $addFields: { likesCount: { $size: '$likes' } } },
      { $sort: { views: -1, likesCount: -1, createdAt: -1 } },
      { $limit: parseInt(limit) },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { 'user.password': 0, 'user.email': 0 } }
    ]);
    res.json({ success: true, videos });
  } catch (error) {
    console.error('Error getPopularVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Videos tendencia
// controllers/videoCtrl.js - getTrendingVideos CORREGIDO (sin isActive)

 
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ success: false, message: 'Video no encontrado' });

    const isOwner = video.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin' || req.user.role === 'moderator';
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }

    const deletionErrors = [];

    if (video.videoType === 'local' && video.videoId) {
      try {
        const result = await cloudinary.uploader.destroy(video.videoId, { resource_type: 'video' });
        if (result.result !== 'ok' && result.result !== 'not found') deletionErrors.push(`Video: ${result.result}`);
      } catch (err) {
        deletionErrors.push(`Video: ${err.message}`);
      }
    }

    if (video.thumbnail && video.thumbnail.includes('cloudinary.com')) {
      try {
        let publicId = video.thumbnail.split('/').pop().split('.')[0];
        const match = video.thumbnail.match(/\/upload\/(?:v\d+\/)?(.+?)\.\w+$/);
        if (match) publicId = match[1];
        const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
        if (result.result !== 'ok' && result.result !== 'not found') deletionErrors.push(`Miniatura: ${result.result}`);
      } catch (err) {
        deletionErrors.push(`Miniatura: ${err.message}`);
      }
    }

    await video.deleteOne();
    const message = deletionErrors.length ? `Video eliminado de BD, pero problemas en Cloudinary: ${deletionErrors.join(', ')}` : 'Video eliminado correctamente';
    res.json({ success: true, message, warnings: deletionErrors.length ? deletionErrors : undefined });
  } catch (error) {
    console.error('Error deleteVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Like a video
const toggleLikeVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ success: false, message: 'Video no encontrado' });
    const { liked, likesCount } = await video.toggleLike(req.user._id);
    res.json({ success: true, likes: likesCount, liked });
  } catch (error) {
    console.error('Error toggleLikeVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Compartir video
const shareVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ success: false, message: 'Video no encontrado' });
    const { shared, sharesCount } = await video.share(req.user._id);
    res.json({ success: true, shares: sharesCount, shared });
  } catch (error) {
    console.error('Error shareVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

 

// ✅ Estadísticas del usuario
const getUserVideoStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const stats = await Video.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), pendiente: false } },
      { $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: '$views' },
        totalLikes: { $sum: { $size: '$likes' } },
        totalComments: { $sum: { $size: '$comments' } },
        totalShares: { $sum: { $size: { $ifNull: ['$shares', []] } } },
        avgEngagement: { $avg: '$engagementScore' },
        totalWatchTime: { $sum: { $ifNull: ['$watchTime', 0] } }
      }}
    ]);
    
    const videosByCategory = await Video.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), pendiente: false } },
      { $group: { _id: '$category', count: { $sum: 1 }, totalViews: { $sum: '$views' } } },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      stats: stats[0] || { totalVideos: 0, totalViews: 0, totalLikes: 0, totalComments: 0, totalShares: 0, avgEngagement: 0, totalWatchTime: 0 },
      videosByCategory
    });
  } catch (error) {
    console.error('Error getUserVideoStats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ========== FUNCIONES DE ADMIN ==========

// ✅ Obtener videos pendientes (ADMIN)
const getVideosPendientesAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const videos = await Video.find({ pendiente: true, isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'username email avatar');
    
    const total = await Video.countDocuments({ pendiente: true, isActive: true });
    
    res.json({
      success: true,
      videos,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Error getVideosPendientesAdmin:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Aprobar video (ADMIN)
// En videoCtrl.js - aprobarVideoAdmin
const aprobarVideoAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id).populate('user', 'username email avatar');
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    
    video.pendiente = false;
    await video.save();
    
    // ✅ Devolver el video con el usuario poblado para las notificaciones
    res.json({ success: true, message: 'Video aprobado correctamente', video });
  } catch (error) {
    console.error('Error aprobarVideoAdmin:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Eliminar video (ADMIN)
const eliminarVideoAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    
    if (video.videoType === 'local' && video.videoId) {
      await cloudinary.uploader.destroy(video.videoId, { resource_type: 'video' });
    }
    if (video.thumbnail && video.thumbnail.includes('cloudinary.com')) {
      let publicId = video.thumbnail.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
    }
    
    await video.deleteOne();
    res.json({ success: true, message: 'Video eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminarVideoAdmin:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ✅ Ya existe en tu controlador
const trackWatchTime = async (req, res) => {
  try {
    const { id } = req.params;
    const { watchTime } = req.body;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ success: false, message: 'Video no encontrado' });
    await video.updateWatchTime(req.user._id, watchTime);
    res.json({ success: true, averageWatchTime: video.averageWatchTime });
  } catch (error) {
    console.error('Error trackWatchTime:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// ✅ CORREGIDO - deleteCommentCtrl
 
// ✅ NUEVO - Editar comentario
 

// controllers/videoCtrl.js - AGREGAR ESTAS FUNCIONES

// ✅ Obtener perfil completo de usuario con estadísticas (estilo TikTok)
const getUserProfileStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ success: false, message: 'ID inválido' });
    }
    
    // Obtener información del usuario
    const user = await User.findById(userId)
      .select('username avatar bio fullname isPro role followers following');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    
    // Contar seguidores y siguiendo
    const followersCount = user.followers.length || 0;
    const followingCount = user.following.length || 0;
    
    // Verificar si el usuario actual sigue a este usuario
    let isFollowing = false;
    if (currentUserId && currentUserId.toString() !== userId) {
      isFollowing = user.followers.some(
        follower => follower.toString() === currentUserId.toString()
      ) || false;
    }
    
    // Obtener estadísticas de videos del usuario
    const videoStats = await Video.aggregate([
      { 
        $match: { 
          user: new mongoose.Types.ObjectId(userId),
          pendiente: false,
          isActive: true 
        } 
      },
      {
        $group: {
          _id: null,
          totalVideos: { $sum: 1 },
          totalLikes: { $sum: { $size: '$likes' } },
          totalViews: { $sum: '$views' },
          totalComments: { $sum: { $size: '$comments' } },
          totalShares: { $sum: { $size: { $ifNull: ['$shares', []] } } }
        }
      }
    ]);
    
    // Para videos guardados (favoritos) - necesitas un modelo de favoritos
    // Por ahora simulamos con la colección de favoritos del usuario
    let savedVideosCount = 0;
    if (user.savedVideos) {
      savedVideosCount = user.savedVideos.length;
    }
    
    res.json({
      success: true,
      profile: {
        _id: user._id,
        username: user.username,
        avatar: user.avatar,
        bio: user.bio || '',
        fullname: user.fullname || user.username,
        isPro: user.isPro || false,
        role: user.role,
        followersCount,
        followingCount,
        isFollowing,
        videoStats: {
          totalVideos: videoStats[0].totalVideos || 0,
          totalLikes: videoStats[0].totalLikes || 0,
          totalViews: videoStats[0].totalViews || 0,
          totalComments: videoStats[0].totalComments || 0,
          totalShares: videoStats[0].totalShares || 0
        },
        savedVideosCount
      }
    });
  } catch (error) {
    console.error('Error getUserProfileStats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Obtener videos guardados/favoritos del usuario
const getUserSavedVideos = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const currentUserId = req.user._id;
    
    // Verificar permisos: solo el dueño puede ver videos guardados
    if (!currentUserId || currentUserId.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Vous ne pouvez pas voir les vidéos sauvegardées d\'un autre utilisateur' 
      });
    }
    
    const user = await User.findById(userId).select('savedVideos');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }
    
    const savedVideoIds = user.savedVideos || [];
    const total = savedVideoIds.length;
    
    // Obtener videos paginados
    const paginatedIds = savedVideoIds.slice(skip, skip + parseInt(limit));
    
    const videos = await Video.find({ 
      _id: { $in: paginatedIds },
      pendiente: false,
      isActive: true 
    })
      .sort({ createdAt: -1 })
      .populate('user', 'username avatar isPro')
      .lean();
    
    // Reordenar según el orden original
    const orderedVideos = paginatedIds.map(id => 
      videos.find(v => v._id.toString() === id.toString())
    ).filter(v => v);
    
    res.json({
      success: true,
      videos: orderedVideos,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      hasMore: skip + orderedVideos.length < total
    });
  } catch (error) {
    console.error('Error getUserSavedVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Obtener videos que le han dado like al usuario (videos liked por el usuario)
const getUserLikedVideos = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const currentUserId = req.user._id;
    
    // Verificar permisos
    if (!currentUserId || currentUserId.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Vous ne pouvez pas voir les vidéos aimées d\'un autre utilisateur' 
      });
    }
    
    // Buscar videos donde el usuario haya dado like
    const videos = await Video.find({
      likes: { $in: [new mongoose.Types.ObjectId(userId)] },
      pendiente: false,
      isActive: true
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'username avatar isPro')
      .lean();
    
    const total = await Video.countDocuments({
      likes: { $in: [new mongoose.Types.ObjectId(userId)] },
      pendiente: false,
      isActive: true
    });
    
    // Marcar que el usuario ya dio like a estos videos
    const videosWithLiked = videos.map(v => ({
      ...v,
      liked: true
    }));
    
    res.json({
      success: true,
      videos: videosWithLiked,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      hasMore: skip + videos.length < total
    });
  } catch (error) {
    console.error('Error getUserLikedVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Seguir/Dejar de seguir usuario
// controllers/videoCtrl.js - CORREGIR toggleFollowUser

// ✅ Seguir/Dejar de seguir usuario
const toggleFollowUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    if (userId === currentUserId.toString()) {
      return res.status(400).json({ success: false, message: 'No puedes seguirte a ti mismo' });
    }

    const userToFollow = await User.findById(userId);
    if (!userToFollow) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const currentUser = await User.findById(currentUserId);

    // ✅ CORREGIDO: Asegurar que followers y following existen
    const followersList = userToFollow.followers || [];
    const followingList = currentUser.following || [];

    const isFollowing = followersList.some(id => id && id.toString() === currentUserId.toString());

    if (isFollowing) {
      // Dejar de seguir
      await User.findByIdAndUpdate(userId, {
        $pull: { followers: currentUserId }
      });
      await User.findByIdAndUpdate(currentUserId, {
        $pull: { following: userId }
      });
    } else {
      // Seguir
      await User.findByIdAndUpdate(userId, {
        $addToSet: { followers: currentUserId }
      });
      await User.findByIdAndUpdate(currentUserId, {
        $addToSet: { following: userId }
      });
    }

    // Obtener el nuevo conteo
    const updatedUser = await User.findById(userId);
    const followersCount = (updatedUser.followers || []).length;

    res.json({
      success: true,
      isFollowing: !isFollowing,
      followersCount
    });
  } catch (error) {
    console.error('Error toggleFollowUser:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// ✅ Guardar/Quitar video de favoritos
const toggleSaveVideo = async (req, res) => {
  try {
    const { videoId } = req.params;
    const userId = req.user._id;
    
    const video = await Video.findById(videoId);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    
    const user = await User.findById(userId);
    const isSaved = user.savedVideos.includes(videoId);
    
    if (isSaved) {
      await User.findByIdAndUpdate(userId, {
        $pull: { savedVideos: videoId }
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { savedVideos: videoId }
      });
    }
    
    res.json({
      success: true,
      isSaved: !isSaved
    });
  } catch (error) {
    console.error('Error toggleSaveVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



















const createVideo = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      shortDescription, 
      videoUrl, 
      videoType, 
      videoId, 
      thumbnail, 
      duration,
      music
    } = req.body;
    
    const userId = req.user._id;

    const user = await User.findById(userId);
    const isProValid = user.isPro && (!user.proExpiryDate || new Date(user.proExpiryDate) > new Date());
    const isAdmin = user.role === 'admin';
    
    if (!isProValid && !isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Se requiere cuenta Pro activa para crear videos' 
      });
    }

    const MAX_DURATION_FREE = 30;
    const MAX_DURATION_PRO = 60;
    const maxAllowed = (isProValid || isAdmin) ? MAX_DURATION_PRO : MAX_DURATION_FREE;
    
    if (videoType === 'local' && duration && duration > maxAllowed) {
      return res.status(400).json({ 
        success: false, 
        message: `La duración máxima permitida es ${maxAllowed} segundos` 
      });
    }

    // ✅ Crear video sin categorías obligatorias
    const video = new Video({
      title,
      description: description || '',
      shortDescription: shortDescription || (description ? description.substring(0, 300) : ''),
      videoUrl,
      videoType: videoType || 'local',
      videoId: videoId || '',
      thumbnail: thumbnail || '',
      duration: duration || 0,
      user: userId,
      music: music || null,
      // ✅ Campos opcionales por compatibilidad
      category: '',
      categorySlug: '',
      tags: [],
      pendiente: isAdmin ? false : true
    });

    await video.save();
    
    // Poblar el usuario para la respuesta
    const populatedVideo = await Video.findById(video._id)
      .populate('user', 'username avatar isPro role');
    
    res.status(201).json({ 
      success: true, 
      message: isAdmin ? 'Video creado correctamente' : 'Video creado y pendiente de aprobación', 
      video: populatedVideo 
    });
  } catch (error) {
    console.error('Error createVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Actualizar video - SIN categorías obligatorias
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, shortDescription, thumbnail, music } = req.body;
    
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    
    const isOwner = video.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin' || req.user.role === 'moderator';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }

    // ✅ Actualizar solo campos permitidos
    if (title) video.title = title;
    if (description !== undefined) video.description = description;
    if (shortDescription) video.shortDescription = shortDescription;
    if (thumbnail) video.thumbnail = thumbnail;
    if (music !== undefined) video.music = music;
    
    await video.save();
    
    const updatedVideo = await Video.findById(video._id)
      .populate('user', 'username avatar isPro role');
    
    res.json({ success: true, message: 'Video actualizado', video: updatedVideo });
  } catch (error) {
    console.error('Error updateVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Filtrar videos - SIN categorías obligatorias
const filterVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const { searchTerm, sortBy = 'recent' } = req.query;

    let match = { pendiente: false, isActive: true };
    
    if (searchTerm && searchTerm.trim() !== '') {
      match.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ];
    }
    
    let sort = {};
    switch(sortBy) {
      case 'popular': sort = { views: -1 }; break;
      case 'liked': sort = { likesCount: -1 }; break;
      default: sort = { createdAt: -1 };
    }

    const pipeline = [
      { $match: match },
      { $addFields: { likesCount: { $size: '$likes' }, commentsCount: { $size: '$comments' } } },
      { $sort: sort },
      { $skip: skip },
      { $limit: limit },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { 'user.password': 0, 'user.email': 0 } }
    ];

    const [videos, total] = await Promise.all([
      Video.aggregate(pipeline),
      Video.countDocuments(match)
    ]);

    res.json({
      success: true,
      videos,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
      hasMore: skip + videos.length < total,
      children: [] // ✅ Vacío porque no hay categorías
    });
  } catch (error) {
    console.error('Error filterVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Obtener videos por categoría (simplificado - devuelve todos)
const getVideosByCategory = async (req, res) => {
  try {
    const { page = 1, limit = 12, sortBy = 'recent' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    let match = { pendiente: false, isActive: true };

    let sortOptions = {};
    switch(sortBy) {
      case 'popular': sortOptions = { views: -1 }; break;
      case 'liked': sortOptions = { likesCount: -1 }; break;
      default: sortOptions = { createdAt: -1 };
    }

    const pipeline = [
      { $match: match },
      { $addFields: { likesCount: { $size: '$likes' } } },
      { $sort: sortOptions },
      { $skip: skip },
      { $limit: parseInt(limit) },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { 'user.password': 0, 'user.email': 0 } }
    ];

    const [videos, total] = await Promise.all([
      Video.aggregate(pipeline),
      Video.countDocuments(match)
    ]);

    res.json({
      success: true,
      videos,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
      hasMore: skip + videos.length < total,
      children: []
    });
  } catch (error) {
    console.error('Error getVideosByCategory:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Obtener videos tendencia - CORREGIDO
const getTrendingVideos = async (req, res) => {
  try {
    const { limit = 10, timeRange = 'week' } = req.query;
    
    const matchCondition = { pendiente: false };
    
    if (timeRange === 'day') {
      matchCondition.createdAt = { $gte: new Date(Date.now() - 24*60*60*1000) };
    } else if (timeRange === 'week') {
      matchCondition.createdAt = { $gte: new Date(Date.now() - 7*24*60*60*1000) };
    }
    
    const videos = await Video.aggregate([
      { $match: matchCondition },
      { 
        $addFields: {
          likesCount: { $size: '$likes' },
          commentsCount: { $size: '$comments' },
          dynamicScore: {
            $min: [
              {
                $multiply: [
                  {
                    $divide: [
                      { $add: [
                        { $multiply: ['$likesCount', 2] },
                        { $multiply: ['$commentsCount', 3] }
                      ] },
                      { $ifNull: ['$views', 1] }
                    ]
                  },
                  100
                ]
              },
              100
            ]
          }
        }
      },
      { $sort: { dynamicScore: -1, views: -1, createdAt: -1 } },
      { $limit: parseInt(limit) },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { 'user.password': 0, 'user.email': 0 } }
    ]);
    
    res.json({ success: true, videos });
  } catch (error) {
    console.error('Error getTrendingVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Obtener videos relacionados (simplificado)
const getRelatedVideos = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 6 } = req.query;

    const currentVideo = await Video.findById(id);
    if (!currentVideo) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }

    const relatedVideos = await Video.aggregate([
      {
        $match: {
          _id: { $ne: currentVideo._id },
          pendiente: false,
          isActive: true
        }
      },
      { $addFields: { likesCount: { $size: '$likes' } } },
      { $sort: { views: -1, likesCount: -1, createdAt: -1 } },
      { $limit: parseInt(limit) },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { 'user.password': 0, 'user.email': 0 } }
    ]);

    res.json({ success: true, videos: relatedVideos });
  } catch (error) {
    console.error('Error getRelatedVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};











module.exports = {
  // Públicas
  getVideoById,
  getUserVideos,
  filterVideos,
  getVideosByCategory,
  getFeaturedVideos,
  getPopularVideos,
  getRelatedVideos,
  getTrendingVideos,
  // Protegidas
  createVideo,
  updateVideo,
  deleteVideo,
  toggleLikeVideo,
  shareVideo,
  trackWatchTime,
   
 
  getUserVideoStats,
  // Música
  getMusicLibrary,
  // Admin
  getVideosPendientesAdmin,
  aprobarVideoAdmin,
  eliminarVideoAdmin,
  getVideoByIdPrivate ,
  getVideoByIdPublic,
  getUserProfileStats,
  getUserProfileStats,
  getUserVideos,
  getUserSavedVideos,
  getUserLikedVideos,
  toggleFollowUser,
  toggleSaveVideo

};
