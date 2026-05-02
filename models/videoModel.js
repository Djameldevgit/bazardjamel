// models/videoModel.js - VERSIÓN SIMPLIFICADA (sin campos de categoría obligatorios)
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  // ✅ Campos básicos
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 2000, default: '' },
  shortDescription: { type: String, trim: true, maxlength: 300, default: '' },
  
  // ✅ Video URL
  videoUrl: { type: String, required: true },
  videoType: { type: String, enum: ['youtube', 'vimeo', 'local'], default: 'local' },
  videoId: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  duration: { type: Number, default: 0 },
  
  // ✅ Usuario
  user: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
  
  // ✅ Campos opcionales (boutique, product - se mantienen)
  boutique: { type: mongoose.Types.ObjectId, ref: 'Boutique', default: null },
  product: { type: mongoose.Types.ObjectId, ref: 'Post', default: null },
  
  // ❌ ELIMINADO: category, categorySlug (ya no son requeridos)
  // ✅ Se mantienen como opcionales por compatibilidad
  category: { type: String, default: '' },
  categorySlug: { type: String, default: '' },
  
  // ✅ Estadísticas
  views: { type: Number, default: 0 },
  uniqueViews: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  shares: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  watchTime: { type: Number, default: 0 },
  averageWatchTime: { type: Number, default: 0 },
  
  // ✅ Música
  music: {
    id: { type: String, default: null },
    title: { type: String, default: null },
    artist: { type: String, default: null },   // ← añadir
    audioUrl: { type: String, default: null }, // ← añadir
    volume: { type: Number, default: 70 }
  },
  
  // ✅ Comentarios (referencia al modelo comment)
  comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
  
  // ✅ Estado
  pendiente: { type: Boolean, default: true, index: true },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  
  // ✅ Tags (opcional)
  tags: { type: [String], default: [] },
  
  // ✅ SEO (opcional)
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' },
  
  // ✅ Engagement
  engagementScore: { type: Number, default: 0 },
  conversionRate: { type: Number, default: 0 }
  
}, { timestamps: true });

// Índices
videoSchema.index({ title: 'text', description: 'text' });
videoSchema.index({ user: 1, pendiente: 1 });
videoSchema.index({ pendiente: 1, createdAt: -1 });
videoSchema.index({ views: -1, createdAt: -1 });
videoSchema.index({ engagementScore: -1 });
videoSchema.index({ createdAt: -1 });

// ========== MÉTODOS DE INSTANCIA ==========

videoSchema.methods.incrementViews = async function(userId = null) {
  this.views = (this.views || 0) + 1;
  if (userId) {
    const userIdStr = userId.toString();
    const exists = this.uniqueViews.some(id => id && id.toString() === userIdStr);
    if (!exists) this.uniqueViews.push(userId);
  }
  await this.save();
  return this;
};

videoSchema.methods.updateWatchTime = async function(userId, watchTimeSeconds) {
  this.watchTime += watchTimeSeconds;
  this.averageWatchTime = this.watchTime / (this.uniqueViews.length || 1);
  this.updateEngagementScore();
  await this.save();
  return this;
};

videoSchema.methods.toggleLike = async function(userId) {
  const userIdStr = userId.toString();
  const index = this.likes.findIndex(id => id && id.toString() === userIdStr);
  if (index === -1) {
    this.likes.push(userId);
  } else {
    this.likes.splice(index, 1);
  }
  this.updateEngagementScore();
  await this.save();
  return { liked: index === -1, likesCount: this.likes.length };
};

videoSchema.methods.share = async function(userId) {
  const userIdStr = userId.toString();
  const exists = this.shares.some(id => id && id.toString() === userIdStr);
  if (!exists) {
    this.shares.push(userId);
    this.updateEngagementScore();
    await this.save();
  }
  return { shared: true, sharesCount: this.shares.length };
};

videoSchema.methods.updateEngagementScore = function() {
  const likesCount = this.likes.length || 0;
  const commentsCount = this.comments.length || 0;
  const sharesCount = this.shares.length || 0;
  const totalViews = this.views || 1;
  const totalEngagement = (likesCount * 2) + (commentsCount * 3) + (sharesCount * 4);
  this.engagementScore = Math.min((totalEngagement / totalViews) * 100, 100);
};

// ========== MÉTODOS ESTÁTICOS ==========

videoSchema.statics.getFeaturedVideos = async function(limit = 10) {
  return this.aggregate([
    { $match: { isFeatured: true, pendiente: false, isActive: true } },
    { $sort: { createdAt: -1 } },
    { $limit: limit },
    { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { 'user.password': 0, 'user.email': 0 } }
  ]);
};

videoSchema.statics.getPopularVideos = async function(limit = 10) {
  return this.aggregate([
    { $match: { pendiente: false, isActive: true } },
    { $addFields: { likesCount: { $size: '$likes' } } },
    { $sort: { views: -1, likesCount: -1, createdAt: -1 } },
    { $limit: limit },
    { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { 'user.password': 0, 'user.email': 0 } }
  ]);
};

videoSchema.statics.getTrendingVideos = async function(limit = 10, timeRange = 'week') {
  let dateFilter = {};
  const now = new Date();
  if (timeRange === 'day') {
    dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 1)) } };
  } else if (timeRange === 'week') {
    dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 7)) } };
  } else if (timeRange === 'month') {
    dateFilter = { createdAt: { $gte: new Date(now.setMonth(now.getMonth() - 1)) } };
  }

  return this.aggregate([
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
    { $addFields: { 
      engagementScore: { 
        $min: [ 
          { $multiply: [ 
            { $divide: ['$totalEngagement', { $ifNull: ['$views', 1] }] }, 
            100 
          ] }, 
          100 
        ] 
      } 
    } },
    { $sort: { engagementScore: -1, views: -1 } },
    { $limit: limit },
    { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { 'user.password': 0, 'user.email': 0 } }
  ]);
};

videoSchema.statics.getPendingVideos = async function(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  const [videos, total] = await Promise.all([
    this.aggregate([
      { $match: { pendiente: true, isActive: true } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { 'user.password': 0, 'user.email': 0 } }
    ]),
    this.countDocuments({ pendiente: true, isActive: true })
  ]);
  
  return { videos, total };
};

videoSchema.statics.getUserVideos = async function(userId, isOwner = false, page = 1, limit = 12) {
  const skip = (page - 1) * limit;
  const match = { user: new mongoose.Types.ObjectId(userId) };
  
  if (!isOwner) {
    match.pendiente = false;
    match.isActive = true;
  }
  
  const [videos, total] = await Promise.all([
    this.aggregate([
      { $match: match },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { 'user.password': 0, 'user.email': 0 } }
    ]),
    this.countDocuments(match)
  ]);
  
  return { videos, total };
};

// Pre-save hook
videoSchema.pre('save', function(next) {
  if (this.isModified('views') || this.isModified('likes') || this.isModified('comments') || this.isModified('shares')) {
    this.updateEngagementScore();
  }
  next();
});

module.exports = mongoose.model('Video', videoSchema);