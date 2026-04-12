// controllers/videoCtrl.js
const Video = require('../models/videoModel');
const User = require('../models/userModel');
 
const createVideo = async (req, res) => {
  try {
    const { title, description, videoUrl, videoType, videoId, thumbnail, category, categorySlug, boutiqueId, productId, tags } = req.body;
    const userId = req.user._id;

    // Verificar si el usuario es Pro
    const user = await User.findById(userId);
    if (!user.isPro && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Se requiere cuenta Pro para crear videos'
      });
    }

    const video = new Video({
      title,
      description,
      videoUrl,
      videoType,
      videoId,
      thumbnail,
      user: userId,
      boutique: boutiqueId || null,
      product: productId || null,
      category,
      categorySlug,
      tags: tags || [],
      status: user.role === 'admin' ? 'approved' : 'pending'
    });

    await video.save();

    res.status(201).json({
      success: true,
      message: 'Video creado correctamente',
      video
    });

  } catch (error) {
    console.error('Error createVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener video por ID
const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id)
      .populate('user', 'username avatar')
      .populate('boutique', 'nom_boutique slug')
      .populate('product', 'title images');

    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }

    // Incrementar vistas
    await video.incrementViews();

    res.json({ success: true, video });
  } catch (error) {
    console.error('Error getVideoById:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener videos del usuario
const getUserVideos = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const videos = await Video.find({ user: userId, status: 'approved' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'username avatar');

    const total = await Video.countDocuments({ user: userId, status: 'approved' });

    res.json({
      success: true,
      videos,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Error getUserVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener videos por categoría
const getVideosByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const videos = await Video.find({ categorySlug, status: 'approved', isActive: true })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'username avatar');

    const total = await Video.countDocuments({ categorySlug, status: 'approved', isActive: true });

    res.json({
      success: true,
      videos,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Error getVideosByCategory:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Actualizar video
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, thumbnail, tags } = req.body;
    const userId = req.user._id;

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }

    // Verificar propietario
    if (video.user.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }

    video.title = title || video.title;
    video.description = description || video.description;
    video.thumbnail = thumbnail || video.thumbnail;
    video.tags = tags || video.tags;

    await video.save();

    res.json({ success: true, message: 'Video actualizado', video });
  } catch (error) {
    console.error('Error updateVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Eliminar video
const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }

    // Verificar propietario o admin
    if (video.user.toString() !== userId.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'No autorizado' });
    }

    await video.deleteOne();

    res.json({ success: true, message: 'Video eliminado' });
  } catch (error) {
    console.error('Error deleteVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Dar/quitar like a video
const toggleLikeVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }

    await video.toggleLike(userId);

    res.json({ success: true, likes: video.likes.length, liked: video.likes.includes(userId) });
  } catch (error) {
    console.error('Error toggleLikeVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Videos destacados para el home
const getFeaturedVideos = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const videos = await Video.find({ isFeatured: true, status: 'approved', isActive: true })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('user', 'username avatar');

    res.json({ success: true, videos });
  } catch (error) {
    console.error('Error getFeaturedVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Videos populares (más vistos)
const getPopularVideos = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const videos = await Video.find({ status: 'approved', isActive: true })
      .sort({ views: -1 })
      .limit(parseInt(limit))
      .populate('user', 'username avatar');

    res.json({ success: true, videos });
  } catch (error) {
    console.error('Error getPopularVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// ADMIN - Gestión de videos pendientes
// ============================================

const getPendingVideos = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const videos = await Video.find({ status: 'pending' })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'username avatar email');

    const total = await Video.countDocuments({ status: 'pending' });

    res.json({
      success: true,
      videos,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    console.error('Error getPendingVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const approveVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }

    video.status = 'approved';
    await video.save();

    res.json({ success: true, message: 'Video aprobado' });
  } catch (error) {
    console.error('Error approveVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const rejectVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }

    video.status = 'rejected';
    await video.save();

    res.json({ success: true, message: 'Video rechazado' });
  } catch (error) {
    console.error('Error rejectVideo:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};
// controllers/videoCtrl.js - Agregar estos métodos

// Obtener videos relacionados
const getRelatedVideos = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 6 } = req.query;
    
    const currentVideo = await Video.findById(id);
    if (!currentVideo) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    
    // Buscar videos de la misma categoría
    const relatedVideos = await Video.find({
      _id: { $ne: id },
      categorySlug: currentVideo.categorySlug,
      status: 'approved',
      isActive: true
    })
      .sort({ views: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .populate('user', 'username avatar');
    
    res.json({ success: true, videos: relatedVideos });
  } catch (error) {
    console.error('Error getRelatedVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Agregar comentario
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user._id;
    
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    
    const comment = {
      user: userId,
      text,
      createdAt: new Date()
    };
    
    video.comments.push(comment);
    await video.save();
    
    // Obtener información del usuario
    const user = await User.findById(userId).select('username avatar');
    
    res.json({
      success: true,
      comment: {
        ...comment,
        user: { _id: user._id, username: user.username, avatar: user.avatar }
      }
    });
  } catch (error) {
    console.error('Error addComment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

 
module.exports = {
  createVideo,
  getVideoById,
  getUserVideos,
  getVideosByCategory,
  updateVideo,
  deleteVideo,
  toggleLikeVideo,
  getFeaturedVideos,
  getPopularVideos,
  getPendingVideos,
  approveVideo,
  rejectVideo,
  getRelatedVideos,
  addComment
};