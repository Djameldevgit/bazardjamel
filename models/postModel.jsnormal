 
const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
  
  categorie: { type: String, required: true, index: true },
  subCategory: { type: String, index: true },
  articleType: { type: String }, // Para immobilier
  
 
  categorySpecificData: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {}
  },
  
  // Campos indexados para búsqueda rápida
  searchKeywords: [{ type: String, index: true }],
  
  // Metadatos
  images: [{ url: String, public_id: String }],
  user: { type: mongoose.Types.ObjectId, ref: 'user', index: true },
  likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  
  // Nuevos campos para similares
  isActive: { type: Boolean, default: true, index: true },
  isPromoted: { type: Boolean, default: false },
  isUrgent: { type: Boolean, default: false },
  views: { type: Number, default: 0 }
  
}, { timestamps: true });

// Índices compuestos para búsqueda eficiente de similares
postSchema.index({ categorie: 1, subCategory: 1, isActive: 1 });
postSchema.index({ categorie: 1, wilaya: 1, isActive: 1 });
postSchema.index({ categorie: 1, price: 1, isActive: 1 });
postSchema.index({ 'categorySpecificData.marque': 1 });
postSchema.index({ 'categorySpecificData.etat': 1 });
postSchema.index({ price: 1 });
postSchema.index({ wilaya: 1, commune: 1 });
postSchema.index({ category: 1, subCategory: 1, createdAt: -1 });
postSchema.index({ category: 1, subCategory: 1, isActive: 1 });
module.exports = mongoose.model('post', postSchema);