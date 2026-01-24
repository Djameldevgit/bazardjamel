const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  // Identificación básica
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  slug: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  
  // Jerarquía
  level: { 
    type: Number, 
    required: true,
    enum: [1, 2, 3],
    index: true
  },
  parent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category',
    default: null,
    index: true
  },
  ancestors: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Category' 
  }],
  path: { 
    type: String, 
    index: true 
  },
  
  // Metadata de UI
  icon: String,
  iconType: String,   // 'image-png', 'emoji', 'svg', etc.
  iconColor: String,  // color del icono
  bgColor: String,    // color de fondo
  order: { 
    type: Number, 
    default: 0 
  },
  
  // Configuración
  hasChildren: { 
    type: Boolean, 
    default: false 
  },
  isLeaf: { 
    type: Boolean, 
    default: false 
  },
  
  // Stats
  postCount: { 
    type: Number, 
    default: 0 
  },
  
  // Control
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, {
  timestamps: true
});

// Índices
categorySchema.index({ slug: 1 });
categorySchema.index({ level: 1, parent: 1 });
categorySchema.index({ path: 1 });
categorySchema.index({ isActive: 1, level: 1 });

module.exports = mongoose.model('Category', categorySchema);