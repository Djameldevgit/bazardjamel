const mongoose = require('mongoose');
const generateTitle = require('../utils/titleGenerator');

const postSchema = new mongoose.Schema({
  categorie: { type: String, required: true, index: true },
  subCategory: { type: String, index: true },
  articleType: { type: String },
  operationType: { type: String, default: '' },
  propertyType: { type: String, default: '' },
  store: { type: mongoose.Schema.Types.ObjectId, ref: 'store' },
  categorySpecificData: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
  searchKeywords: [{ type: String, index: true }],
  images: [{ url: String, public_id: String }],
  user: { type: mongoose.Types.ObjectId, ref: 'user', index: true },
  likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  isActive: { type: Boolean, default: true, index: true },
  isPromoted: { type: Boolean, default: false },
  isUrgent: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  title: { type: String, index: true }
}, { timestamps: true });

// 🧠 Hook que genera automáticamente el título al guardar
postSchema.pre('save', function (next) {
  if (!this.title) {
    this.title = generateTitle(this);
  }
  next();
});

module.exports = mongoose.model('post', postSchema);
