// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  // Información básica
  title: {
    type: String,
    //required: [true, 'El título es requerido'],
    trim: true,
    maxlength: [200, 'El título no puede exceder 200 caracteres']
  },
  description: {
    type: String,
   // required: [true, 'La descripción es requerida'],
    trim: true,
    maxlength: [2000, 'La descripción no puede exceder 2000 caracteres']
  },
  price: {
    type: Number,
   // required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  
  // Relaciones
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'La categoría es requerida'],
    index: true
  },
  categoryPath: {
    level1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      index: true
    },
    level2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      index: true
    },
    level3: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      index: true
    }
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    index: true
  },
  
  // Multimedia
  images: [{
    type: String,
    required: [true, 'Al menos una imagen es requerida']
  }],
  
  // Ubicación
  location: {
    city: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  
  // Atributos dinámicos
  attributes: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  
  // Estado
  status: {
    type: String,
    enum: ['active', 'sold', 'reserved', 'inactive'],
    default: 'active',
    index: true
  },
  
  // Características especiales
  featured: {
    type: Boolean,
    default: false
  },
  urgent: {
    type: Boolean,
    default: false
  },
  
  // Estadísticas
  views: {
    type: Number,
    default: 0
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  
  // Metadatos
  expiresAt: {
    type: Date,
    default: () => new Date(+new Date() + 30*24*60*60*1000) // 30 días
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Índices compuestos para búsquedas rápidas
postSchema.index({ status: 1, createdAt: -1 });
postSchema.index({ 'categoryPath.level1': 1, createdAt: -1 });
postSchema.index({ 'categoryPath.level2': 1, createdAt: -1 });
postSchema.index({ price: 1 });
postSchema.index({ title: 'text', description: 'text' });

// Middleware para establecer categoryPath antes de guardar
postSchema.pre('save', async function(next) {
  if (this.isModified('category')) {
    try {
      const category = await mongoose.model('Category').findById(this.category);
      
      if (category) {
        this.categoryPath = {
          level1: category.ancestors[0] || category._id,
          level2: category.ancestors[1] || null,
          level3: category.level === 3 ? category._id : null
        };
      }
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Virtual para obtener URL del post
postSchema.virtual('url').get(function() {
  return `/post/${this._id}`;
});

// Virtual para obtener precio formateado
postSchema.virtual('priceFormatted').get(function() {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(this.price);
});

// Método para verificar si está expirado
postSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

module.exports = mongoose.model('post', postSchema);