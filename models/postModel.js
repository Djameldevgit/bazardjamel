const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  // ✅ CORRECTO: Usar solo "categorie"
  categorie: { 
    type: String, 
    required: [true, "La catégorie est requise"],
    index: true 
  },
  
  subCategory: { 
    type: String, 
    index: true 
  },
  
  articleType: { 
    type: String 
  },
  
  operationType: {
    type: String,
    default: ''
  },
  
  propertyType: {
    type: String,
    default: ''
  },
  
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'store',
    required: false
  },
  
  categorySpecificData: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  searchKeywords: [{ type: String, index: true }],
  
  images: [{ url: String, public_id: String }],
  user: { type: mongoose.Types.ObjectId, ref: 'user', index: true },
  likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  
  isActive: { type: Boolean, default: true, index: true },
  isPromoted: { type: Boolean, default: false },
  isUrgent: { type: Boolean, default: false },
  views: { type: Number, default: 0 }

}, { timestamps: true });

// ✅ Índices CORREGIDOS - usar "categorie"
postSchema.index({ categorie: 1, subCategory: 1, isActive: 1 });
postSchema.index({ categorie: 1, wilaya: 1, isActive: 1 });
postSchema.index({ categorie: 1, price: 1, isActive: 1 });
postSchema.index({ 'categorySpecificData.marque': 1 });
postSchema.index({ 'categorySpecificData.etat': 1 });
postSchema.index({ price: 1 });
postSchema.index({ wilaya: 1, commune: 1 });
postSchema.index({ categorie: 1, subCategory: 1, createdAt: -1 });
postSchema.index({ categorie: 1, subCategory: 1, isActive: 1 });

module.exports = mongoose.model('post', postSchema);