// models/storeModel.js - CORREGIDO
const mongoose = require('mongoose')

const storeSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },

  // 🏪 Información general
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 1000
  },
  category: {
    type: String,
    required: true
  },
  logoUrl: String,
  bannerUrl: String,

  // 📍 Contacto
  phone: String,
  whatsapp: String,
  email: String,
  address: {
    city: String,
    region: String,
    country: {
      type: String,
      default: 'Algeria'
    }
  },

  // 🌐 Redes sociales
  socialLinks: {
    facebook: String,
    instagram: String,
    tiktok: String,
    youtube: String
  },

  // 💼 Nivel de plan
  plan: {
    type: String,
    enum: ['Free', 'Pro', 'Premium', 'Gold', 'Silver', 'Bronze'],
    default: 'Free'
  },
  
  // 🆕 CORREGIR ESTE CAMPO - Quitar enum restrictivo
  originalPlan: {
    type: String,
    default: null
    // SIN enum - permite cualquier string
  },
  
  planFeatures: {
    maxProducts: { type: Number, default: 10 },
    canPromote: { type: Boolean, default: false },
    analytics: { type: Boolean, default: false }
  },

  // 📊 Estadísticas
  stats: {
    totalViews: { type: Number, default: 0 },
    totalFavorites: { type: Number, default: 0 },
    totalProducts: { type: Number, default: 0 }
  },

  // ✅ Estado
  isActive: {
    type: Boolean,
    default: true
  },
  verified: {
    type: Boolean,
    default: false
  },

  // 💰 Campos para planes de pago
  duration: {
    type: Number,
    default: 30
  },
  price: {
    type: Number,
    default: 0
  },
  credits: {
    type: Number,
    default: 0
  },
  storage: {
    type: Number,
    default: 100
  },

  // 📅 Fechas
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  // Agregar esta opción para manejar mejor los campos no definidos
  strict: true
})

// Configuración de planes
const storePlans = {
  Free: {
    maxProducts: 10,
    canPromote: false,
    analytics: false,
    storage: 100,
    credits: 0
  },
  Pro: {
    maxProducts: 50,
    canPromote: true,
    analytics: true,
    storage: 500,
    credits: 100
  },
  Premium: {
    maxProducts: 100,
    canPromote: true,
    analytics: true,
    storage: 1000,
    credits: 500
  },
  Gold: {
    maxProducts: 200,
    canPromote: true,
    analytics: true,
    storage: 2000,
    credits: 1000
  },
  Silver: {
    maxProducts: 100,
    canPromote: true,
    analytics: true,
    storage: 1000,
    credits: 500
  },
  Bronze: {
    maxProducts: 50,
    canPromote: true,
    analytics: false,
    storage: 500,
    credits: 200
  }
}

// Middleware para setear features del plan
storeSchema.pre('save', function(next) {
  if (this.isModified('plan') || !this.planFeatures.maxProducts) {
    const planConfig = storePlans[this.plan] || storePlans.Free
    this.planFeatures = {
      maxProducts: planConfig.maxProducts,
      canPromote: planConfig.canPromote,
      analytics: planConfig.analytics
    }
    
    // También actualizar storage y credits si no están definidos
    if (!this.storage) this.storage = planConfig.storage
    if (!this.credits) this.credits = planConfig.credits
  }
  
  if (this.isModified()) {
    this.updatedAt = Date.now()
  }
  next()
})

module.exports = mongoose.model('store', storeSchema)