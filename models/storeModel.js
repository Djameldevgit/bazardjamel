const mongoose = require('mongoose')

const storeSchema = new mongoose.Schema({
  // 👤 Dueño de la tienda
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },

  // 🏷️ Información principal
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

  // 📸 Imagen principal o galería
  images: {
    type: [String], // URLs de Cloudinary u otra plataforma
    default: []
  },

  // 🧭 Categoría (relación o lista)
  category: {
    type: String,
    required: true,
    enum: [
      'Boutiques',
      'Electrónica',
      'Restaurantes',
      'Supermercados',
      'Ropa',
      'Hogar',
      'Belleza',
      'Deportes',
      'Tecnología',
      'Otros'
    ],
    default: 'Otros'
  },

  // 🏬 Dirección y ubicación
  address: {
    street: { type: String },
    city: { type: String },
    country: { type: String, default: 'Argelia' },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number }
    }
  },

  // 📞 Contacto
  phone: { type: String },
  email: { type: String },
  website: { type: String },

  // 🌐 Redes sociales
  social: {
    instagram: String,
    facebook: String,
    whatsapp: String,
    telegram: String
  },

  // 🛒 Productos asociados
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post'
  }],

  // 🤝 Seguidores (usuarios que siguen la tienda)
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],

  // ⭐ Calificación y reseñas
  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 }
  },

  // 🕒 Estado de la tienda
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  }

}, { timestamps: true })

module.exports = mongoose.model('store', storeSchema)
