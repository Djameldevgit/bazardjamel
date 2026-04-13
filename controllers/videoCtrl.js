// controllers/videoCtrl.js - Versión completa

const Video = require('../models/videoModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

// ============================================
// FUNCIONES PÚBLICAS
// ============================================

// ✅ Obtener video por ID (con auth opcional)
// controllers/videoCtrl.js - Corregir getVideoById

// ✅ Obtener video por ID (con auth opcional)
// controllers/videoCtrl.js - Versión con validación para Node.js antiguo

// controllers/videoCtrl.js - getVideoById mejorado

 

// ✅ Obtener videos del usuario (con paginación)
const getUserVideos = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 12, status = 'approved' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Construir filtro
    const filter = { user: userId };
    
    // Si es el mismo usuario o admin, puede ver todos los estados
    const isOwnerOrAdmin = req.user && (req.user._id.toString() === userId || req.user.role === 'admin');
    
    if (!isOwnerOrAdmin) {
      filter.status = 'approved';
      filter.isActive = true;
    } else if (status !== 'all') {
      filter.status = status;
    }
    
    const videos = await Video.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'username avatar email isPro')
      .populate('boutique', 'nom_boutique slug')
      .populate('product', 'title images price');
    
    const total = await Video.countDocuments(filter);
    
    // Agregar estadísticas adicionales para el owner
    let stats = null;
    if (isOwnerOrAdmin) {
      stats = {
        totalViews: videos.reduce((sum, v) => sum + v.views, 0),
        totalLikes: videos.reduce((sum, v) => sum + v.likes.length, 0),
        totalComments: videos.reduce((sum, v) => sum + v.comments.length, 0),
        totalShares: videos.reduce((sum, v) => sum + (v.shares.length || 0), 0)
      };
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

// ✅ Obtener videos por categoría
 
// ✅ Videos destacados
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

// ✅ Videos populares (más vistos)
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

// ✅ Videos relacionados
const getRelatedVideos = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 6 } = req.query;
    
    const currentVideo = await Video.findById(id);
    if (!currentVideo) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    
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

// ✅ Videos tendencia (por engagement)
const getTrendingVideos = async (req, res) => {
  try {
    const { limit = 10, timeRange = 'week' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch(timeRange) {
      case 'day':
        dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 1)) } };
        break;
      case 'week':
        dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 7)) } };
        break;
      case 'month':
        dateFilter = { createdAt: { $gte: new Date(now.setMonth(now.getMonth() - 1)) } };
        break;
    }
    
    const videos = await Video.find({
      status: 'approved',
      isActive: true,
      ...dateFilter
    })
    .sort({ engagementScore: -1, views: -1 })
    .limit(parseInt(limit))
    .populate('user', 'username avatar');
    
    res.json({ success: true, videos });
  } catch (error) {
    console.error('Error getTrendingVideos:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// FUNCIONES PROTEGIDAS (requieren auth)
// ============================================

// ✅ Crear video
const createVideo = async (req, res) => {
  try {
    const { title, description, shortDescription, videoUrl, videoType, videoId, thumbnail, category, categorySlug, boutiqueId, productId, tags } = req.body;
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
      shortDescription: shortDescription || description.substring(0, 300),
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

// ✅ Actualizar video
const updateVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, shortDescription, thumbnail, tags } = req.body;
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
    const userId = req.user._id;
    const userRole = req.user.role;

    console.log('🗑️ Eliminando video:', id);
    console.log('👤 Usuario:', userId, 'Rol:', userRole);

    // Buscar el video
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ 
        success: false, 
        message: 'Video no encontrado' 
      });
    }

    // Verificar propietario o admin
    const isOwner = video.user.toString() === userId.toString();
    const isAdmin = userRole === 'admin' || userRole === 'moderator';
    
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'No autorizado para eliminar este video' 
      });
    }

    // Array para almacenar errores de eliminación
    const deletionErrors = [];

    // ✅ Eliminar recursos de Cloudinary según el tipo de video
    if (video.videoType === 'local' && video.videoId) {
      try {
        console.log('☁️ Eliminando video de Cloudinary:', video.videoId);
        
        // Eliminar el video
        const videoResult = await cloudinary.uploader.destroy(video.videoId, {
          resource_type: 'video'
        });
        
        console.log('📹 Resultado eliminación video:', videoResult);
        
        if (videoResult.result !== 'ok' && videoResult.result !== 'not found') {
          deletionErrors.push(`Video: ${videoResult.result}`);
        }
        
      } catch (err) {
        console.error('❌ Error eliminando video de Cloudinary:', err.message);
        deletionErrors.push(`Video: ${err.message}`);
      }
    }

    // ✅ Eliminar miniatura si existe y es de Cloudinary
    if (video.thumbnail && video.thumbnail.includes('cloudinary.com')) {
      try {
        // Extraer public_id de la URL
        let thumbnailPublicId = video.thumbnail.split('/').pop().split('.')[0];
        // Si la URL tiene una carpeta, mantener la ruta completa
        const cloudinaryUrlPattern = /\/upload\/(?:v\d+\/)?(.+?)\.\w+$/;
        const match = video.thumbnail.match(cloudinaryUrlPattern);
        if (match) {
          thumbnailPublicId = match[1];
        }
        
        console.log('☁️ Eliminando miniatura de Cloudinary:', thumbnailPublicId);
        
        const thumbResult = await cloudinary.uploader.destroy(thumbnailPublicId, {
          resource_type: 'image'
        });
        
        console.log('🖼️ Resultado eliminación miniatura:', thumbResult);
        
        if (thumbResult.result !== 'ok' && thumbResult.result !== 'not found') {
          deletionErrors.push(`Miniatura: ${thumbResult.result}`);
        }
        
      } catch (err) {
        console.error('❌ Error eliminando miniatura de Cloudinary:', err.message);
        deletionErrors.push(`Miniatura: ${err.message}`);
      }
    }

    // ✅ Eliminar de la base de datos
    await video.deleteOne();
    console.log('✅ Video eliminado de la base de datos');

    // Respuesta con advertencias si hubo errores en Cloudinary
    const message = deletionErrors.length > 0 
      ? `Video eliminado de la base de datos, pero hubo problemas eliminando recursos de Cloudinary: ${deletionErrors.join(', ')}`
      : 'Video eliminado correctamente';

    res.json({ 
      success: true, 
      message: message,
      warnings: deletionErrors.length > 0 ? deletionErrors : undefined
    });
    
  } catch (error) {
    console.error('❌ Error deleteVideo:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ✅ Dar/quitar like a video
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

// ✅ Compartir video
const shareVideo = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    
    if (!video.shares) video.shares = [];
    
    if (!video.shares.includes(userId)) {
      video.shares.push(userId);
      await video.updateEngagementScore();
      await video.save();
    }
    
    res.json({ 
      success: true, 
      shares: video.shares.length,
      shared: true 
    });
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
    const userId = req.user._id;
    
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    
    await video.updateWatchTime(userId, watchTime);
    
    res.json({ success: true, averageWatchTime: video.averageWatchTime });
  } catch (error) {
    console.error('Error trackWatchTime:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Agregar comentario
 
// ✅ Estadísticas del usuario
const getUserVideoStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    const stats = await Video.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), status: 'approved' } },
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
    
    // Videos por categoría
    const videosByCategory = await Video.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), status: 'approved' } },
      { $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalViews: { $sum: '$views' }
      }},
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      stats: stats[0] || {
        totalVideos: 0,
        totalViews: 0,
        totalLikes: 0,
        totalComments: 0,
        totalShares: 0,
        avgEngagement: 0,
        totalWatchTime: 0
      },
      videosByCategory
    });
  } catch (error) {
    console.error('Error getUserVideoStats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ============================================
// FUNCIONES DE ADMIN
// ============================================

// ✅ Obtener videos pendientes
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

// ✅ Aprobar video
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

// ✅ Rechazar video
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
// controllers/videoCtrl.js - Añadir esta función

// ✅ Obtener comentarios paginados
 


const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user._id;
    
    console.log('Add comment - Video ID:', id);
    console.log('Add comment - User ID:', userId);
    console.log('Add comment - Text:', text);
    
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    
    const comment = {
      _id: new mongoose.Types.ObjectId(),
      user: userId,
      text: text,
      likes: [],
      replies: [],
      createdAt: new Date()
    };
    
    video.comments.unshift(comment); // Agregar al principio
    await video.save();
    await video.updateEngagementScore();
    
    // Obtener información del usuario
    const user = await User.findById(userId).select('username avatar isPro');
    
    const commentResponse = {
      _id: comment._id,
      text: comment.text,
      createdAt: comment.createdAt,
      likes: [],
      replies: [],
      user: { 
        _id: user._id, 
        username: user.username, 
        avatar: user.avatar,
        isPro: user.isPro 
      }
    };
    
    res.json({
      success: true,
      comment: commentResponse
    });
  } catch (error) {
    console.error('Error addComment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Like a comentario (CORREGIDO)
const likeComment = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const userId = req.user._id;
    
    console.log('Like comment - Video ID:', id);
    console.log('Like comment - Comment ID:', commentId);
    console.log('Like comment - User ID:', userId);
    
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    
    const comment = video.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comentario no encontrado' });
    }
    
    if (!comment.likes) comment.likes = [];
    
    const likeIndex = comment.likes.findIndex(id => id.toString() === userId.toString());
    let liked;
    
    if (likeIndex === -1) {
      comment.likes.push(userId);
      liked = true;
    } else {
      comment.likes.splice(likeIndex, 1);
      liked = false;
    }
    
    await video.save();
    
    res.json({ 
      success: true, 
      likes: comment.likes.length,
      liked: liked
    });
  } catch (error) {
    console.error('Error likeComment:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Responder comentario (CORREGIDO)
const addCommentReply = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const { text } = req.body;
    const userId = req.user._id;
    
    console.log('Add reply - Video ID:', id);
    console.log('Add reply - Comment ID:', commentId);
    console.log('Add reply - User ID:', userId);
    console.log('Add reply - Text:', text);
    
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    
    const comment = video.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comentario no encontrado' });
    }
    
    if (!comment.replies) comment.replies = [];
    
    const reply = {
      _id: new mongoose.Types.ObjectId(),
      user: userId,
      text: text,
      createdAt: new Date()
    };
    
    comment.replies.push(reply);
    await video.save();
    
    // Obtener información del usuario
    const user = await User.findById(userId).select('username avatar isPro');
    
    res.json({
      success: true,
      reply: {
        _id: reply._id,
        text: reply.text,
        createdAt: reply.createdAt,
        user: { 
          _id: user._id, 
          username: user.username, 
          avatar: user.avatar,
          isPro: user.isPro 
        }
      }
    });
  } catch (error) {
    console.error('Error addCommentReply:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Eliminar comentario (CORREGIDO)
const deleteCommentCtrl = async (req, res) => {
  try {
    const { id, commentId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;
    
    console.log('Delete comment - Video ID:', id);
    console.log('Delete comment - Comment ID:', commentId);
    console.log('Delete comment - User ID:', userId);
    
    const video = await Video.findById(id);
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    
    const comment = video.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comentario no encontrado' });
    }
    
    // Verificar permisos: owner del comentario, owner del video, admin o moderator
    const isCommentOwner = comment.user.toString() === userId.toString();
    const isVideoOwner = video.user.toString() === userId.toString();
    const isAdmin = userRole === 'admin' || userRole === 'moderator';
    
    if (!isCommentOwner && !isVideoOwner && !isAdmin) {
      return res.status(403).json({ success: false, message: 'No autorizado para eliminar este comentario' });
    }
    
    // Eliminar el comentario
    comment.remove();
    await video.save();
    
    res.json({ success: true, message: 'Comentario eliminado' });
  } catch (error) {
    console.error('Error deleteCommentCtrl:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Obtener comentarios paginados (CORREGIDO)
const getVideoComments = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    console.log('Get comments - Video ID:', id);
    console.log('Get comments - Page:', page);
    
    const video = await Video.findById(id)
      .select('comments')
      .populate('comments.user', 'username avatar isPro')
      .populate('comments.replies.user', 'username avatar isPro');
    
    if (!video) {
      return res.status(404).json({ success: false, message: 'Video no encontrado' });
    }
    
    // Ordenar comentarios por fecha descendente (más recientes primero)
    const sortedComments = [...video.comments].sort((a, b) => b.createdAt - a.createdAt);
    const total = sortedComments.length;
    const comments = sortedComments.slice(skip, skip + parseInt(limit));
    
    res.json({
      success: true,
      comments,
      total,
      hasMore: skip + parseInt(limit) < total,
      page: parseInt(page)
    });
  } catch (error) {
    console.error('Error getVideoComments:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


// controllers/videoCtrl.js - Versión para Node.js antiguo
const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('Video ID:', id);
    
    // Validación simple de ID
    if (!id) {
      return res.status(400).json({ 
        success: false, 
        message: 'ID de video no proporcionado' 
      });
    }
    
    // Buscar video con populate básico
    const video = await Video.findById(id)
      .populate('user', 'username avatar')
      .populate('comments.user', 'username avatar');
    
    if (!video) {
      return res.status(404).json({ 
        success: false, 
        message: 'Video no encontrado' 
      });
    }
    
    // Incrementar vistas - versión simple
    video.views = video.views + 1;
    await video.save();
    
    // Verificar like - versión simple
    let liked = false;
    if (req.user && req.user._id) {
      const userId = req.user._id.toString();
      for (let i = 0; i < video.likes.length; i++) {
        if (video.likes[i].toString() === userId) {
          liked = true;
          break;
        }
      }
    }
    
    // Preparar respuesta
    const videoData = {
      _id: video._id,
      title: video.title,
      description: video.description,
      shortDescription: video.shortDescription,
      videoUrl: video.videoUrl,
      videoType: video.videoType,
      videoId: video.videoId,
      thumbnail: video.thumbnail,
      user: video.user,
      boutique: video.boutique,
      product: video.product,
      category: video.category,
      categorySlug: video.categorySlug,
      views: video.views,
      likes: video.likes,
      comments: video.comments,
      status: video.status,
      isActive: video.isActive,
      isFeatured: video.isFeatured,
      duration: video.duration,
      tags: video.tags,
      createdAt: video.createdAt,
      updatedAt: video.updatedAt,
      liked: liked
    };
    
    res.json({ 
      success: true, 
      video: videoData
    });
    
  } catch (error) {
    console.error('Error getVideoById:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// controllers/videoCtrl.js - Añadir esta función

// ✅ Obtener videos por categoría (similar a boutiques)
const getVideosByCategory = async (req, res) => {
  try {
    const { categorySlug } = req.params;
    const { page = 1, limit = 12, sortBy = 'recent' } = req.query;
    
    console.log('=== getVideosByCategory ===');
    console.log('Category slug:', categorySlug);
    console.log('Page:', page);
    console.log('Limit:', limit);
    console.log('SortBy:', sortBy);
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Construir filtro
    let filter = { 
      status: 'approved', 
      isActive: true 
    };
    
    // Si categorySlug no es 'videos', filtrar por categoría específica
    if (categorySlug && categorySlug !== 'videos') {
      filter.categorySlug = categorySlug;
    }
    
    console.log('Filter:', filter);
    
    // Determinar ordenamiento
    let sortOptions = {};
    switch(sortBy) {
      case 'popular':
        sortOptions = { views: -1 };
        break;
      case 'liked':
        sortOptions = { likes: -1 };
        break;
      case 'recent':
      default:
        sortOptions = { createdAt: -1 };
        break;
    }
    
    // Buscar videos
    const videos = await Video.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'username avatar isPro');
    
    const total = await Video.countDocuments(filter);
    
    // Obtener subcategorías (categorías hijas) para el slider
    const subCategories = await Video.aggregate([
      { $match: filter },
      { $group: {
        _id: { slug: '$categorySlug', name: '$category' },
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 } },
      { $limit: 20 }
    ]);
    
    const children = subCategories.map(cat => ({
      slug: cat._id.slug,
      name: cat._id.name,
      count: cat.count,
      level: 2
    }));
    
    console.log(`✅ Encontrados ${videos.length} videos de ${total} totales`);
    
    res.json({
      success: true,
      videos,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit),
      hasMore: skip + parseInt(limit) < total,
      children: children,
      filterMetadata: {
        sortOptions: ['recent', 'popular', 'liked'],
        categories: children
      }
    });
    
  } catch (error) {
    console.error('Error getVideosByCategory:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};


// controllers/videoCtrl.js - Añadir esta función

// ============================================
// FILTER VIDEOS (similar a filterBoutiques)
// ============================================
// controllers/videoCtrl.js - Asegurar que existe esta función

// controllers/videoCtrl.js - Asegurar que existe esta función

// controllers/videoCtrl.js - filterVideos corregido

const filterVideos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    // ✅ Recibir todos los parámetros posibles
    const { category, subCategory, searchTerm, sortBy = 'recent' } = req.query;
    
    console.log('🎬 filterVideos llamado:');
    console.log('  - page:', page);
    console.log('  - limit:', limit);
    console.log('  - category:', category);
    console.log('  - subCategory:', subCategory);
    console.log('  - searchTerm:', searchTerm);
    console.log('  - sortBy:', sortBy);
    
    // 🔥 CONSTRUIR FILTRO
    let filter = { 
      status: 'approved', 
      isActive: true 
    };
    
    // ✅ Prioridad: subCategory tiene más peso que category
    if (subCategory && subCategory !== 'undefined' && subCategory !== 'videos') {
      // Si hay subCategory, filtrar por esa categoría específica
      filter.categorySlug = subCategory;
      console.log('🔍 Filtrando por subCategory:', subCategory);
    } 
    else if (category && category !== 'undefined' && category !== 'videos') {
      // Si solo hay category (y no es 'videos'), filtrar por esa categoría
      filter.categorySlug = category;
      console.log('🔍 Filtrando por category:', category);
    }
    else {
      // Si no hay filtro de categoría, mostrar TODOS los videos
      console.log('📹 Mostrando TODOS los videos (sin filtro de categoría)');
    }
    
    // ✅ Búsqueda por título o descripción
    if (searchTerm && searchTerm !== 'undefined' && searchTerm.trim() !== '') {
      filter.$or = [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ];
      console.log('🔍 Búsqueda por:', searchTerm);
    }
    
    // ✅ ORDENAMIENTO
    let sort = {};
    switch(sortBy) {
      case 'popular':
        sort = { views: -1 };
        break;
      case 'liked':
        sort = { 'likes.length': -1 };
        break;
      case 'recent':
      default:
        sort = { createdAt: -1 };
        break;
    }
    
    console.log('📊 Filtro final:', JSON.stringify(filter, null, 2));
    console.log('📊 Ordenamiento:', sort);
    
    // Ejecutar consulta
    const videos = await Video.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('user', 'username avatar isPro')
      .lean();
    
    const total = await Video.countDocuments(filter);
    const hasMore = skip + videos.length < total;
    const totalPages = Math.ceil(total / limit);
    
    console.log(`✅ Encontrados ${videos.length} videos de ${total} totales`);
    
    // Obtener todas las subcategorías disponibles para el slider
    const allSubCategories = await Video.aggregate([
      { $match: { status: 'approved', isActive: true } },
      { $group: {
        _id: { slug: '$categorySlug', name: '$category' },
        count: { $sum: 1 }
      }},
      { $sort: { count: -1 } }
    ]);
    
    // Obtener subcategorías específicas para el contexto actual
    let children = [];
    
    if (subCategory && subCategory !== 'videos') {
      // Si estamos en una subcategoría, mostrar solo esa (o sus hijas)
      const currentSub = allSubCategories.find(c => c._id.slug === subCategory);
      if (currentSub) {
        children = [{
          _id: currentSub._id.slug,
          slug: currentSub._id.slug,
          name: currentSub._id.name,
          count: currentSub.count,
          level: 2,
          active: true
        }];
      }
    } else {
      // En la página principal de videos, mostrar todas las subcategorías
      children = allSubCategories.map(cat => ({
        _id: cat._id.slug,
        slug: cat._id.slug,
        name: cat._id.name,
        count: cat.count,
        level: 2,
        icon: getIconForCategory(cat._id.slug)
      }));
    }
    
    res.json({
      success: true,
      videos,
      total,
      page,
      totalPages,
      limit,
      hasMore,
      children,
      appliedFilters: {
        category: category || null,
        subCategory: subCategory || null,
        searchTerm: searchTerm || null,
        sortBy
      }
    });
    
  } catch (error) {
    console.error('❌ Error en filterVideos:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Función auxiliar para iconos
function getIconForCategory(slug) {
  const icons = {
    'videos-vehicules': '🚗',
    'videos-immobilier': '🏠',
    'videos-telephones': '📱',
    'videos-informatique': '💻',
    'videos-electromenager': '🔌',
    'videos-mode-vetements': '👕',
    'videos-maison-jardin': '🏡',
    'videos-sport-loisirs': '⚽',
    'videos-alimentaires': '🍔',
    'videos-meubles': '🛋️',
    'videos-pieces-detachees': '🔧',
    'videos-sante-beaute': '💄',
    'videos-services': '🔨',
    'videos-emploi': '💼',
    'videos-voyages': '✈️',
    'videos-boutiques': '🏪',
    'videos-tutoriels': '📚',
    'videos-reviews': '⭐'
  };
  return icons[slug] || '🎬';
}
 

module.exports = {
  // Públicas
  getVideoById,
  getUserVideos,
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
  getUserVideoStats,
  
  // Admin
  getPendingVideos,
  approveVideo,
  rejectVideo,
  getVideoComments,
  deleteCommentCtrl,
  filterVideos 

};