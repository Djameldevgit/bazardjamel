// models/Video.js - Versión completa y mejorada
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 2000 },
  shortDescription: { type: String, trim: true, maxlength: 300 },
  videoUrl: { type: String, required: true },
  videoType: { type: String, enum: ['youtube', 'vimeo', 'local'], default: 'youtube' },
  videoId: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  user: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
  boutique: { type: mongoose.Types.ObjectId, ref: 'Boutique', default: null },
  product: { type: mongoose.Types.ObjectId, ref: 'Post', default: null },
  category: { type: String, required: true },
  categorySlug: { type: String, required: true },
  
  // Estadísticas mejoradas
  views: { type: Number, default: 0 },
  uniqueViews: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  shares: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  watchTime: { type: Number, default: 0 },
  averageWatchTime: { type: Number, default: 0 },
  
  // Comentarios con estructura mejorada
  comments: [{
    _id: { type: mongoose.Types.ObjectId, auto: true },
    user: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
    text: { type: String, required: true },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    replies: [{
      _id: { type: mongoose.Types.ObjectId, auto: true },
      user: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
  }],
  
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  duration: { type: Number, default: 0 },
  tags: [String],
  seoTitle: String,
  seoDescription: String,
  
  // Métricas de engagement
  engagementScore: { type: Number, default: 0 },
  conversionRate: { type: Number, default: 0 }
  
}, { timestamps: true });

// Índices optimizados
videoSchema.index({ title: 'text', description: 'text', shortDescription: 'text' });
videoSchema.index({ categorySlug: 1, status: 1, isActive: 1 });
videoSchema.index({ user: 1, status: 1 });
videoSchema.index({ status: 1, createdAt: -1 });
videoSchema.index({ views: -1, createdAt: -1 });
videoSchema.index({ engagementScore: -1 });

// ============================================
// MÉTODOS DEL MODELO
// ============================================

// ✅ Incrementar vistas con usuario único
videoSchema.methods.incrementViews = async function(userId = null) {
  try {
    this.views = (this.views || 0) + 1;
    
    // Registrar vista única si se proporciona userId
    if (userId && this.uniqueViews) {
      const userIdStr = userId.toString();
      const exists = this.uniqueViews.some(id => id && id.toString() === userIdStr);
      if (!exists) {
        this.uniqueViews.push(userId);
      }
    }
    
    return await this.save();
  } catch (error) {
    console.error('Error incrementViews:', error);
    return this;
  }
};

// ✅ Actualizar tiempo de visualización
videoSchema.methods.updateWatchTime = async function(userId, watchTimeSeconds) {
  try {
    this.watchTime = (this.watchTime || 0) + watchTimeSeconds;
    this.averageWatchTime = this.watchTime / (this.uniqueViews.length || 1);
    
    this.updateEngagementScore();
    
    return await this.save();
  } catch (error) {
    console.error('Error updateWatchTime:', error);
    return this;
  }
};

// ✅ Dar/quitar like (CORREGIDO)
videoSchema.methods.toggleLike = async function(userId) {
  try {
    if (!this.likes) this.likes = [];
    
    const userIdStr = userId.toString();
    const index = this.likes.findIndex(id => id && id.toString() === userIdStr);
    
    if (index === -1) {
      this.likes.push(userId);
    } else {
      this.likes.splice(index, 1);
    }
    
    this.updateEngagementScore();
    return await this.save();
  } catch (error) {
    console.error('Error toggleLike:', error);
    return this;
  }
};

// ✅ Compartir video
videoSchema.methods.share = async function(userId) {
  try {
    if (!this.shares) this.shares = [];
    
    const userIdStr = userId.toString();
    const exists = this.shares.some(id => id && id.toString() === userIdStr);
    
    if (!exists) {
      this.shares.push(userId);
      this.updateEngagementScore();
    }
    
    return await this.save();
  } catch (error) {
    console.error('Error share:', error);
    return this;
  }
};

// ✅ Calcular engagement score
videoSchema.methods.updateEngagementScore = function() {
  try {
    const likesCount = this.likes.length || 0;
    const commentsCount = this.comments.length || 0;
    const sharesCount = this.shares.length || 0;
    const totalViews = this.views || 1;
    
    const totalEngagement = (likesCount * 2) + (commentsCount * 3) + (sharesCount * 4);
    this.engagementScore = (totalEngagement / totalViews) * 100;
    
    // Limitar a 100 máximo
    if (this.engagementScore > 100) this.engagementScore = 100;
  } catch (error) {
    console.error('Error updateEngagementScore:', error);
    this.engagementScore = 0;
  }
};

// ✅ Agregar comentario
videoSchema.methods.addComment = async function(userId, text) {
  try {
    const comment = {
      _id: new mongoose.Types.ObjectId(),
      user: userId,
      text: text,
      likes: [],
      replies: [],
      createdAt: new Date()
    };
    
    this.comments.unshift(comment);
    this.updateEngagementScore();
    
    await this.save();
    return comment;
  } catch (error) {
    console.error('Error addComment:', error);
    return null;
  }
};

// ✅ Dar like a comentario
videoSchema.methods.toggleCommentLike = async function(commentId, userId) {
  try {
    const comment = this.comments.id(commentId);
    if (!comment) return null;
    
    if (!comment.likes) comment.likes = [];
    
    const userIdStr = userId.toString();
    const index = comment.likes.findIndex(id => id && id.toString() === userIdStr);
    
    let liked;
    if (index === -1) {
      comment.likes.push(userId);
      liked = true;
    } else {
      comment.likes.splice(index, 1);
      liked = false;
    }
    
    await this.save();
    return { liked, likesCount: comment.likes.length };
  } catch (error) {
    console.error('Error toggleCommentLike:', error);
    return null;
  }
};

// ✅ Agregar respuesta a comentario
videoSchema.methods.addCommentReply = async function(commentId, userId, text) {
  try {
    const comment = this.comments.id(commentId);
    if (!comment) return null;
    
    if (!comment.replies) comment.replies = [];
    
    const reply = {
      _id: new mongoose.Types.ObjectId(),
      user: userId,
      text: text,
      createdAt: new Date()
    };
    
    comment.replies.push(reply);
    await this.save();
    
    return reply;
  } catch (error) {
    console.error('Error addCommentReply:', error);
    return null;
  }
};

// ✅ Eliminar comentario
videoSchema.methods.deleteComment = async function(commentId, userId, userRole) {
  try {
    const comment = this.comments.id(commentId);
    if (!comment) return false;
    
    // Verificar permisos
    const isCommentOwner = comment.user.toString() === userId.toString();
    const isVideoOwner = this.user.toString() === userId.toString();
    const isAdmin = userRole === 'admin' || userRole === 'moderator';
    
    if (!isCommentOwner && !isVideoOwner && !isAdmin) {
      return false;
    }
    
    comment.remove();
    this.updateEngagementScore();
    await this.save();
    
    return true;
  } catch (error) {
    console.error('Error deleteComment:', error);
    return false;
  }
};

// ✅ Obtener estadísticas del video
videoSchema.methods.getStats = function() {
  return {
    views: this.views || 0,
    uniqueViews: this.uniqueViews.length || 0,
    likes: this.likes.length || 0,
    shares: this.shares.length || 0,
    comments: this.comments.length || 0,
    watchTime: this.watchTime || 0,
    averageWatchTime: this.averageWatchTime || 0,
    engagementScore: this.engagementScore || 0
  };
};

// ============================================
// MIDDLEWARE PRE-SAVE
// ============================================

// Actualizar engagement score antes de guardar
videoSchema.pre('save', function(next) {
  if (this.isModified('views') || this.isModified('likes') || 
      this.isModified('comments') || this.isModified('shares')) {
    this.updateEngagementScore();
  }
  next();
});

// ============================================
// MÉTODOS ESTÁTICOS
// ============================================

// Obtener videos populares
videoSchema.statics.getPopularVideos = async function(limit = 10) {
  return await this.find({ status: 'approved', isActive: true })
    .sort({ views: -1 })
    .limit(limit)
    .populate('user', 'username avatar');
};

// Obtener videos destacados
videoSchema.statics.getFeaturedVideos = async function(limit = 10) {
  return await this.find({ isFeatured: true, status: 'approved', isActive: true })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'username avatar');
};

// Obtener videos tendencia
videoSchema.statics.getTrendingVideos = async function(limit = 10, timeRange = 'week') {
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
  
  return await this.find({
    status: 'approved',
    isActive: true,
    ...dateFilter
  })
  .sort({ engagementScore: -1, views: -1 })
  .limit(limit)
  .populate('user', 'username avatar');
};

module.exports = mongoose.model('Video', videoSchema);