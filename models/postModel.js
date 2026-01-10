// 📂 models/postModel.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  // ========== CAMPOS PRINCIPALES ==========
  categorie: { 
    type: String, 
    required: [true, 'La catégorie est requise'], 
    index: true 
  },
  subCategory: { 
    type: String, 
    required: [true, 'La sous-catégorie est requise'], 
    index: true 
  },
  articleType: { 
    type: String 
  },
  
  // ========== REFERENCIA A BOUTIQUE (OPCIONAL) ==========
  boutique: {
    type: mongoose.Types.ObjectId,
    ref: 'Boutique',
    default: null,
    index: true
  },
  
  // ========== DATOS ESPECÍFICOS DE CATEGORÍA ==========
  categorySpecificData: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map()
  },
  
  // ========== METADATOS ==========
  searchKeywords: [{ type: String, index: true }],
  images: [{ url: String, public_id: String }],
  user: { 
    type: mongoose.Types.ObjectId, 
    ref: 'user', 
    required: true,
    index: true 
  },
  likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  
  // ========== ESTADOS Y VISIBILIDAD ==========
  isActive: { type: Boolean, default: true, index: true },
  isPromoted: { type: Boolean, default: false },
  isUrgent: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  
  // ========== INFORMACIÓN BÁSICA ==========
  //title: { type: String, required: true, index: true },
  description: { type: String },
  price: { type: Number, default: 0 },
  etat: { type: String, default: 'occasion' },
  
  // ========== UBICACIÓN ==========
  location: {
    wilaya: String,
    commune: String,
    address: String
  }
  
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ========== ÍNDICES ==========
postSchema.index({ categorie: 1, subCategory: 1, isActive: 1 });
postSchema.index({ categorie: 1, price: 1, isActive: 1 });
//postSchema.index({ title: 'text', description: 'text' });
postSchema.index({ 'categorySpecificData.marque': 1 });
postSchema.index({ 'categorySpecificData.etat': 1 });
postSchema.index({ price: 1 });
postSchema.index({ 'location.wilaya': 1, 'location.commune': 1 });
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ boutique: 1, isActive: 1 });

// ========== VIRTUAL PARA SABER SI TIENE BOUTIQUE ==========
postSchema.virtual('hasBoutique').get(function() {
  return this.boutique !== null && this.boutique !== undefined;
});

module.exports = mongoose.model('post', postSchema);