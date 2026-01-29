// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  // Campos básicos (REQUERIDOS)
  categorie: {
    type: String,
    required: [true, 'La catégorie est requise']
  },
  subCategory: {
    type: String,
    required: [true, 'La sous-catégorie est requise']
  },
  articleType: {
    type: String,
    default: ''
  },
  
  // Campos comunes obligatorios
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La description est requise'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  etat: {
    type: String,
    enum: ['neuf', 'occasion', 'reconditionné'],
    default: 'occasion'
  },
  
  // Campos de contacto
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  
  // Campos de ubicación
  wilaya: {
    type: String,
    required: [true, 'La wilaya est requise']
  },
  commune: {
    type: String,
    required: [true, 'La commune est requise']
  },
  address: {
    type: String,
    trim: true
  },
  
  // Campos específicos por categoría
  categorySpecificData: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    default: new Map()
  },
  
  // Imágenes
  images: [{
    url: String,
    public_id: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  
  // Información del usuario
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  
  // Metadatos
  views: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 30 * 24 * 60 * 60 * 1000) // 30 días
  }
}, {
  timestamps: true
});

// Índices para mejor rendimiento
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ user: 1, createdAt: -1 });
postSchema.index({ price: 1 });

module.exports = mongoose.model('Post', postSchema);