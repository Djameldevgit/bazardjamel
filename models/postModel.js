// 📂 models/postModel.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  // ========== CAMPOS PRINCIPALES (NIVELES JERÁRQUICOS) ==========
  category: { 
    type: String, 
 
    index: true 
  },
  subCategory: { 
    type: String, 
    required: [true, 'La sous-catégorie est requise'], 
    index: true 
  },
  subSubCategory: { 
    type: String, 
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
  
  // ========== METADATOS PARA FILTRADO JERÁRQUICO ==========
  categoryLevels: {
    level1: { type: String, index: true }, // Ej: "vehicules"
    level2: { type: String, index: true }, // Ej: "motos"
    level3: { type: String, index: true }, // Ej: "125cc"
    fullPath: { type: String, index: true } // Ej: "vehicules/motos/125cc"
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
  title: { type: String,   index: true },
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

// ========== MIDDLEWARE PARA AUTOMATIZAR CATEGORY_LEVELS ==========
postSchema.pre('save', function(next) {
  // Auto-llenar categoryLevels basado en category/subCategory/subSubCategory
  this.categoryLevels = {
    level1: this.category,
    level2: this.subCategory,
    level3: this.subSubCategory || null,
    fullPath: this.subSubCategory 
      ? `${this.category}/${this.subCategory}/${this.subSubCategory}`
      : `${this.category}/${this.subCategory}`
  };
  
  // Asegurar que searchKeywords tenga al menos las categorías
  if (!this.searchKeywords) {
    this.searchKeywords = [];
  }
  
  // Añadir categorías como keywords
  const categoryKeywords = [
    this.category,
    this.subCategory,
    this.subSubCategory,
    this.title
  ].filter(Boolean);
  
  categoryKeywords.forEach(keyword => {
    if (!this.searchKeywords.includes(keyword)) {
      this.searchKeywords.push(keyword);
    }
  });
  
  next();
});

// ========== ÍNDICES ==========
postSchema.index({ categorie: 1, subCategory: 1, subSubCategory: 1, isActive: 1 });
postSchema.index({ 'categoryLevels.level1': 1, 'categoryLevels.level2': 1, 'categoryLevels.level3': 1 });
postSchema.index({ 'categoryLevels.fullPath': 1 });
postSchema.index({ categorie: 1, price: 1, isActive: 1 });
postSchema.index({ title: 'text', description: 'text', searchKeywords: 'text' });
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

// ========== MÉTODO PARA OBTENER JERARQUÍA ==========
postSchema.methods.getHierarchy = function() {
  return {
    level1: this.category,
    level2: this.subCategory,
    level3: this.subSubCategory,
    path: this.categoryLevels.fullPath
  };
};

module.exports = mongoose.model('post', postSchema);