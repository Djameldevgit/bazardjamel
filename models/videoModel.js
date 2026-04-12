// models/Video.js
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 2000 },
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
  likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  comments: [{
    user: { type: mongoose.Types.ObjectId, ref: 'user' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  duration: { type: Number, default: 0 },
  tags: [String],
  seoTitle: String,
  seoDescription: String
}, { timestamps: true });

// Índices
videoSchema.index({ title: 'text', description: 'text' });
videoSchema.index({ categorySlug: 1 });
videoSchema.index({ user: 1 });
videoSchema.index({ status: 1 });
videoSchema.index({ createdAt: -1 });
videoSchema.index({ views: -1 });

// ✅ Método para incrementar vistas
videoSchema.methods.incrementViews = async function() {
  this.views += 1;
  return await this.save();
};

// ✅ Método para dar/quitar like
videoSchema.methods.toggleLike = async function(userId) {
  const index = this.likes.indexOf(userId);
  if (index === -1) {
    this.likes.push(userId);
  } else {
    this.likes.splice(index, 1);
  }
  return await this.save();
};

module.exports = mongoose.model('Video', videoSchema);