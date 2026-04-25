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
  
  views: { type: Number, default: 0 },
  uniqueViews: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  shares: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  watchTime: { type: Number, default: 0 },
  averageWatchTime: { type: Number, default: 0 },
  
  comments: [{
    _id: { type: mongoose.Types.ObjectId, auto: true },
    user: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
    text: { type: String, required: true },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    edited: { type: Boolean, default: false },
    editedAt: { type: Date },
    replies: [{
      _id: { type: mongoose.Types.ObjectId, auto: true },
      user: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
      text: { type: String, required: true },
      edited: { type: Boolean, default: false },
      editedAt: { type: Date },
      createdAt: { type: Date, default: Date.now }
    }],
    createdAt: { type: Date, default: Date.now }
  }],
  
  pendiente: {
    type: Boolean,
    default: true,
    index: true
  },
  
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  duration: { type: Number, default: 0 },
  tags: [String],
  seoTitle: String,
  seoDescription: String,
  engagementScore: { type: Number, default: 0 },
  conversionRate: { type: Number, default: 0 }
}, { timestamps: true });

// Índices
videoSchema.index({ title: 'text', description: 'text', shortDescription: 'text' });
videoSchema.index({ categorySlug: 1, pendiente: 1, isActive: 1 });
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
  if (index === -1) this.likes.push(userId);
  else this.likes.splice(index, 1);
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

// ========== MÉTODOS DE COMENTARIOS ==========

// ✅ Agregar comentario
videoSchema.methods.addComment = async function(userId, text) {
  const comment = {
    _id: new mongoose.Types.ObjectId(),
    user: userId,
    text,
    likes: [],
    replies: [],
    edited: false,
    createdAt: new Date()
  };
  this.comments.unshift(comment);
  this.updateEngagementScore();
  await this.save();
  return comment;
};

// ✅ Like a comentario
videoSchema.methods.toggleCommentLike = async function(commentId, userId) {
  const comment = this.comments.id(commentId);
  if (!comment) return null;
  
  const userIdStr = userId.toString();
  const index = comment.likes.findIndex(id => id && id.toString() === userIdStr);
  
  if (index === -1) {
    comment.likes.push(userId);
  } else {
    comment.likes.splice(index, 1);
  }
  
  this.updateEngagementScore();
  await this.save();
  return { liked: index === -1, likesCount: comment.likes.length };
};

// ✅ Editar comentario
videoSchema.methods.editComment = async function(commentId, userId, userRole, newText) {
  const comment = this.comments.id(commentId);
  if (!comment) return null;
  
  const isOwner = comment.user.toString() === userId.toString();
  const isAdmin = userRole === 'admin' || userRole === 'moderator';
  
  if (!isOwner && !isAdmin) return null;
  
  comment.text = newText;
  comment.edited = true;
  comment.editedAt = new Date();
  
  await this.save();
  return comment;
};

// ✅ Eliminar comentario (CORREGIDO)
videoSchema.methods.deleteComment = async function(commentId, userId, userRole) {
  const comment = this.comments.id(commentId);
  if (!comment) return false;
  
  const isOwner = comment.user.toString() === userId.toString();
  const isAdmin = userRole === 'admin' || userRole === 'moderator';
  
  if (!isOwner && !isAdmin) return false;
  
  // ✅ CORRECCIÓN: Usar pull en lugar de deleteOne()
  this.comments.pull({ _id: commentId });
  this.updateEngagementScore();
  await this.save();
  return true;
};

// ✅ Agregar respuesta a comentario
videoSchema.methods.addCommentReply = async function(commentId, userId, text) {
  const comment = this.comments.id(commentId);
  if (!comment) return null;
  
  const reply = {
    _id: new mongoose.Types.ObjectId(),
    user: userId,
    text,
    edited: false,
    createdAt: new Date()
  };
  
  comment.replies.push(reply);
  this.updateEngagementScore();
  await this.save();
  return reply;
};

// ✅ Editar respuesta
videoSchema.methods.editReply = async function(commentId, replyId, userId, userRole, newText) {
  const comment = this.comments.id(commentId);
  if (!comment) return null;
  
  const reply = comment.replies.id(replyId);
  if (!reply) return null;
  
  const isOwner = reply.user.toString() === userId.toString();
  const isAdmin = userRole === 'admin' || userRole === 'moderator';
  
  if (!isOwner && !isAdmin) return null;
  
  reply.text = newText;
  reply.edited = true;
  reply.editedAt = new Date();
  
  await this.save();
  return reply;
};

// ✅ Eliminar respuesta
videoSchema.methods.deleteReply = async function(commentId, replyId, userId, userRole) {
  const comment = this.comments.id(commentId);
  if (!comment) return false;
  
  const reply = comment.replies.id(replyId);
  if (!reply) return false;
  
  const isOwner = reply.user.toString() === userId.toString();
  const isAdmin = userRole === 'admin' || userRole === 'moderator';
  
  if (!isOwner && !isAdmin) return false;
  
  comment.replies.pull({ _id: replyId });
  this.updateEngagementScore();
  await this.save();
  return true;
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
  if (timeRange === 'day') dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 1)) } };
  else if (timeRange === 'week') dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 7)) } };
  else if (timeRange === 'month') dateFilter = { createdAt: { $gte: new Date(now.setMonth(now.getMonth() - 1)) } };

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