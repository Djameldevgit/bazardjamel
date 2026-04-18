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
    replies: [{
      _id: { type: mongoose.Types.ObjectId, auto: true },
      user: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
      text: { type: String, required: true },
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
videoSchema.index({ categorySlug: 1, status: 1, isActive: 1 });
videoSchema.index({ user: 1, status: 1 });
videoSchema.index({ status: 1, createdAt: -1 });
videoSchema.index({ views: -1, createdAt: -1 });
videoSchema.index({ engagementScore: -1 });

// ========== MÉTODOS DE INSTANCIA (con toString) ==========
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

videoSchema.methods.addComment = async function(userId, text) {
  const comment = {
    _id: new mongoose.Types.ObjectId(),
    user: userId,
    text,
    likes: [],
    replies: [],
    createdAt: new Date()
  };
  this.comments.unshift(comment);
  this.updateEngagementScore();
  await this.save();
  return comment;
};

// ========== MÉTODOS ESTÁTICOS (con aggregate) ==========
videoSchema.statics.getFeaturedVideos = async function(limit = 10) {
  return this.aggregate([
    { $match: { isFeatured: true, status: 'approved', isActive: true } },
    { $sort: { createdAt: -1 } },
    { $limit: limit },
    { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { 'user.password': 0, 'user.email': 0 } }
  ]);
};

videoSchema.statics.getPopularVideos = async function(limit = 10) {
  return this.aggregate([
    { $match: { status: 'approved', isActive: true } },
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
    { $match: { status: 'approved', isActive: true, ...dateFilter } },
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
    { $limit: limit },
    { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { 'user.password': 0, 'user.email': 0 } }
  ]);
};

videoSchema.pre('save', function(next) {
  if (this.isModified('views') || this.isModified('likes') || this.isModified('comments') || this.isModified('shares')) {
    this.updateEngagementScore();
  }
  next();
});

module.exports = mongoose.model('Video', videoSchema);