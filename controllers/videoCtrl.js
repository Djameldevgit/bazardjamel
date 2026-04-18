// controllers/videoCtrl.js
const Video = require('../models/VideoModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
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
const getVideosByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const { page = 1, limit = 12, sortBy = 'recent' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // 🔥 CORREGIDO: usar 'pendiente' en lugar de 'status'
    let filter = { 
      pendiente: false,
      isActive: true 
    };
    
    if (categorySlug && categorySlug !== 'videos') {
      filter.categorySlug = categorySlug;
    }

    let sortOptions = {};
    switch(sortBy) {
      case 'popular': sortOptions = { views: -1 }; break;
      case 'liked': sortOptions = { likesCount: -1 }; break;
      default: sortOptions = { createdAt: -1 };
    }

    const pipeline = [
      { $match: filter },
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
      Video.countDocuments(filter)
    ]);

    const subCategories = await Video.aggregate([
      { $match: { pendiente: false, isActive: true } },
      { $group: { _id: { slug: '$categorySlug', name: '$category' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    const children = subCategories.map(cat => ({
      slug: cat._id.slug,
      name: cat._id.name,
      count: cat.count,
      level: 2
    }));

    res.json({
      success: true,
      videos,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
      hasMore: skip + videos.length < total,
      children
    });
  } catch (error) {
    console.error('Error getVideosByCategory:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Obtener video por ID
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

    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'moderator');
    if (video.pendiente === true && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Video en attente d\'approbation' });
    }

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

// ✅ Filtrar videos (HOME y búsquedas)
const filterVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    const { category, subCategory, searchTerm, sortBy = 'recent' } = req.query;

    let match = { pendiente: false, isActive: true };
    
    if (subCategory && subCategory !== 'undefined' && subCategory !== 'videos') {
      match.categorySlug = subCategory;
    } else if (category && category !== 'undefined' && category !== 'videos') {
      match.categorySlug = category;
    }
    
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

    const subCategories = await Video.aggregate([
      { $match: { pendiente: false, isActive: true } },
      { $group: { _id: { slug: '$categorySlug', name: '$category' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);

    const children = subCategories.map(cat => ({
      slug: cat._id.slug,
      name: cat._id.name,
      count: cat.count,
      level: 2
    }));

    res.json({
      success: true,
      videos,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      limit,
      hasMore: skip + videos.length < total,
      children,
      appliedFilters: { category, subCategory, searchTerm, sortBy }
    });
  } catch (error) {
    console.error('Error filterVideos:', error);
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
const getTrendingVideos = async (req, res) => {
  try {
    const { limit = 10, timeRange = 'week' } = req.query;
    let dateFilter = {};
    const now = new Date();
    if (timeRange === 'day') dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 1)) } };
    else if (timeRange === 'week') dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 7)) } };
    else if (timeRange === 'month') dateFilter = { createdAt: { $gte: new Date(now.setMonth(now.getMonth() - 1)) } };

    const videos = await Video.aggregate([
      { $match: { pendiente: false, isActive: true, ...dateFilter } },
      { $addFields: {
          likesCount: { $size: '$likes' },
          commentsCount: { $size: '$comments' },
          sharesCount: { $size: { $ifNull: ['$shares', []] } }
      } },
      { $addFields: {
          totalEngagement: { $add: [
            { $multiply: ['$likesCount', 2] },
            { $multiply: ['$commentsCount', 3] },
            { $multiply: ['$sharesCount', 4] }
          ] }
      } },
      { $addFields: { engagementScore: { $min: [ { $multiply: [ { $divide: ['$totalEngagement', { $ifNull: ['$views', 1] }] }, 100 ] }, 100 ] } } },
      { $sort: { engagementScore: -1, views: -1 } },
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

// ✅ Videos relacionados
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
          categorySlug: currentVideo.categorySlug,
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

// ✅ Crear video
const createVideo = async (req, res) => {
  try {
    const { title, description, shortDescription, videoUrl, videoType, videoId, thumbnail, category, categorySlug, boutiqueId, productId, tags, duration } = req.body;
    const userId = req.user._id;

    const user = await User.findById(userId);
    const isProValid = user.isPro && (!user.proExpiryDate || new Date(user.proExpiryDate) > new Date());
    const isAdmin = user.role === 'admin';
    
    if (!isProValid && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Se requiere cuenta Pro activa para crear videos' });
    }

    const MAX_DURATION_FREE = 15;
    const MAX_DURATION_PRO = 60;
    const maxAllowed = (isProValid || isAdmin) ? MAX_DURATION_PRO : MAX_DURATION_FREE;
    
    if (videoType === 'local' && duration && duration > maxAllowed) {
      return res.status(400).json({ success: false, message: `La duración máxima permitida es ${maxAllowed} segundos` });
    }

    const video = new Video({
      title, description, shortDescription: shortDescription || description.substring(0, 300),
      videoUrl, videoType, videoId, thumbnail,
      user: userId, boutique: boutiqueId || null, product: productId || null,
      category, categorySlug, tags: tags || [],
      duration: duration || 0,
      pendiente: isAdmin ? false : true
    });

    await video.save();
    res.status(201).json({ success: true, message: 'Video creado correctamente', video });
  } catch (error) {
    console.error('Error createVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Actualizar video
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, shortDescription, thumbnail, tags } = req.body;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ success: false, message: 'Video no encontrado' });
    
    if (video.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }

    video.title = title || video.title;
    video.description = description || video.description;
    video.shortDescription = shortDescription || description.substring(0, 300) || video.shortDescription;
    video.thumbnail = thumbnail || video.thumbnail;
    video.tags = tags || video.tags;
    await video.save();
    res.json({ success: true, message: 'Video actualizado', video });
  } catch (error) {
    console.error('Error updateVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Eliminar video
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

// ✅ Tracking tiempo de visualización
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

// ✅ Agregar comentario
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ success: false, message: 'Video no encontrado' });
    const comment = await video.addComment(req.user._id, text);
    const user = await User.findById(req.user._id).select('username avatar isPro');
    const commentResponse = {
      _id: comment._id,
      text: comment.text,
      createdAt: comment.createdAt,
      likes: [],
      replies: [],
      user: { _id: user._id, username: user.username, avatar: user.avatar, isPro: user.isPro }
    };
    res.json({ success: true, comment: commentResponse });
  } catch (error) {
    console.error('Error addComment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Like a comentario
const likeComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ success: false, message: 'Video no encontrado' });
    const result = await video.toggleCommentLike(commentId, req.user._id);
    if (!result) return res.status(404).json({ success: false, message: 'Comentario no encontrado' });
    res.json({ success: true, likes: result.likesCount, liked: result.liked });
  } catch (error) {
    console.error('Error likeComment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Responder comentario
const addCommentReply = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { text } = req.body;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ success: false, message: 'Video no encontrado' });
    const reply = await video.addCommentReply(commentId, req.user._id, text);
    if (!reply) return res.status(404).json({ success: false, message: 'Comentario no encontrado' });
    const user = await User.findById(req.user._id).select('username avatar isPro');
    const replyResponse = {
      _id: reply._id,
      text: reply.text,
      createdAt: reply.createdAt,
      user: { _id: user._id, username: user.username, avatar: user.avatar, isPro: user.isPro }
    };
    res.json({ success: true, reply: replyResponse });
  } catch (error) {
    console.error('Error addCommentReply:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Eliminar comentario
const deleteCommentCtrl = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const video = await Video.findById(id);
    if (!video) return res.status(404).json({ success: false, message: 'Video no encontrado' });
    const deleted = await video.deleteComment(commentId, req.user._id, req.user.role);
    if (!deleted) return res.status(403).json({ success: false, message: 'No autorizado o comentario no encontrado' });
    res.json({ success: true, message: 'Comentario eliminado' });
  } catch (error) {
    console.error('Error deleteCommentCtrl:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Obtener comentarios paginados
const getVideoComments = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const video = await Video.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id) } },
      { $project: { comments: 1, totalComments: { $size: '$comments' } } },
      { $unwind: '$comments' },
      { $sort: { 'comments.createdAt': -1 } },
      { $skip: skip },
      { $limit: parseInt(limit) },
      { $lookup: { from: 'users', localField: 'comments.user', foreignField: '_id', as: 'comments.user' } },
      { $unwind: '$comments.user' },
      { $project: { 'comments.user.password': 0, 'comments.user.email': 0 } }
    ]);
    
    const total = video.length ? video[0].totalComments || 0 : 0;
    const comments = video.map(v => v.comments);
    
    res.json({
      success: true,
      comments,
      total,
      hasMore: skip + comments.length < total,
      page: parseInt(page)
    });
  } catch (error) {
    console.error('Error getVideoComments:', error);
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
const aprobarVideoAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    
    video.pendiente = false;
    await video.save();
    
    res.json({ success: true, message: 'Video aprobado correctamente' });
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
  addComment,
  likeComment,
  addCommentReply,
  deleteCommentCtrl,
  getVideoComments,
  getUserVideoStats,
  // Música
  getMusicLibrary,
  // Admin
  getVideosPendientesAdmin,
  aprobarVideoAdmin,
  eliminarVideoAdmin
};