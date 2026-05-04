// models/videoModel.js - VERSIÓN CON CAMPOS COMERCIALES (+ música, geolocalización, ventas)

const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  // ==================== CAMPOS BÁSICOS EXISTENTES ====================
  title: { type: String, required: true, trim: true, maxlength: 200 },
  description: { type: String, trim: true, maxlength: 2000, default: '' },
  shortDescription: { type: String, trim: true, maxlength: 300, default: '' },
  
  // Video URL
  videoUrl: { type: String, required: true },
  videoType: { type: String, enum: ['youtube', 'vimeo', 'local'], default: 'local' },
  videoId: { type: String, default: '' },
  thumbnail: { type: String, default: '' },
  duration: { type: Number, default: 0 },
  
  // Usuario
  user: { type: mongoose.Types.ObjectId, ref: 'user', required: true },
  
  // Boutique y producto (opcional)
  boutique: { type: mongoose.Types.ObjectId, ref: 'Boutique', default: null },
  product: { type: mongoose.Types.ObjectId, ref: 'Post', default: null },
  
  // Categoría (se mantiene pero ahora es más específico)
  category: { type: String, default: '', index: true },
  categorySlug: { type: String, default: '' },
  
  // ==================== NUEVOS CAMPOS COMERCIALES ====================
  // Precio y ventas
  price: { 
    type: Number, 
    default: 0,
    min: 0,
    validate: {
      validator: function(v) {
        return v >= 0;
      },
      message: 'El precio no puede ser negativo'
    }
  },
  
  wholesale: { 
    type: Boolean, 
    default: false,
    index: true,
    description: 'Venta al mayor (true = sí, false = no)'
  },
  
  minQuantity: { 
    type: Number, 
    default: 1,
    min: 1,
    validate: {
      validator: function(v) {
        if (this.wholesale && v < 1) return false;
        return true;
      },
      message: 'Si es venta al mayor, la cantidad mínima debe ser al menos 1'
    }
  },
  
  // Información de contacto
  phone: { 
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return /^(\+?\d{1,4}[\s-]?)?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,9}$/.test(v);
      },
      message: 'Formato de teléfono inválido'
    }
  },
  
  phoneHidden: { 
    type: Boolean, 
    default: false,
    description: 'Ocultar teléfono hasta que el usuario interactúe'
  },
  
  email: { 
    type: String, 
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  
  website: { type: String, trim: true, default: '' },
  
  // Geolocalización
  wilaya: { 
    type: String, 
    required: function() {
      return this.isCommercialVideo(); // Solo requerido si es comercial
    },
    trim: true,
    index: true
  },
  
  commune: { 
    type: String, 
    required: function() {
      return this.isCommercialVideo();
    },
    trim: true,
    index: true
  },
  
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0],
      validate: {
        validator: function(v) {
          return v.length === 2 && 
                 v[0] >= -180 && v[0] <= 180 && 
                 v[1] >= -90 && v[1] <= 90;
        },
        message: 'Coordenadas inválidas'
      }
    },
    address: { type: String, default: '' },
    googleMapsUrl: { type: String, default: '' }
  },
  
  // Métodos de envío
  delivery: {
    available: { type: Boolean, default: false },
    cost: { type: Number, default: 0 },
    estimatedDays: { type: Number, default: 0 },
    zones: [{ type: String }] // Zonas de envío (ej: ['Alger', 'Oran'])
  },
  
  pickupOnly: { 
    type: Boolean, 
    default: false,
    description: 'Solo recogida en tienda'
  },
  
  // Horario de atención
  businessHours: {
    monday: { open: String, close: String },
    tuesday: { open: String, close: String },
    wednesday: { open: String, close: String },
    thursday: { open: String, close: String },
    friday: { open: String, close: String },
    saturday: { open: String, close: String },
    sunday: { open: String, close: String }
  },
  
  // ==================== CAMPOS DE MÚSICA (YA EXISTENTES) ====================
  music: {
    id: { type: String, default: null },
    title: { type: String, default: null },
    artist: { type: String, default: null },
    audioUrl: { type: String, default: null },
    volume: { type: Number, default: 70 }
  },
  
  // ==================== ESTADÍSTICAS Y ENGAGEMENT ====================
  views: { type: Number, default: 0 },
  uniqueViews: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  shares: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  watchTime: { type: Number, default: 0 },
  averageWatchTime: { type: Number, default: 0 },
  
  // Comentarios
  comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
  
  // Estado
  pendiente: { type: Boolean, default: true, index: true },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  isCommercial: { 
    type: Boolean, 
    default: false,
    index: true,
    description: 'Si es true, muestra campos comerciales en UI'
  },
  
  // Tags y SEO
  tags: { type: [String], default: [] },
  seoTitle: { type: String, default: '' },
  seoDescription: { type: String, default: '' },
  
  // Engagement
  engagementScore: { type: Number, default: 0 },
  conversionRate: { type: Number, default: 0 },
  
  // Productos relacionados
  relatedProducts: [{ type: mongoose.Types.ObjectId, ref: 'Post' }],
  
  // Stock
  stock: {
    total: { type: Number, default: 0 },
    available: { type: Number, default: 0 },
    reserved: { type: Number, default: 0 }
  }
  
}, { timestamps: true });

// ==================== ÍNDICES GEOESPACIALES ====================
videoSchema.index({ location: '2dsphere' });
videoSchema.index({ wilaya: 1, commune: 1 });
videoSchema.index({ category: 1, wholesale: 1 });
videoSchema.index({ price: 1, createdAt: -1 });
videoSchema.index({ isCommercial: 1, pendiente: 1 });

// ==================== MÉTODOS DE INSTANCIA ====================

// Verificar si es video comercial
videoSchema.methods.isCommercialVideo = function() {
  return this.isCommercial === true;
};

// Obtener ubicación formateada
videoSchema.methods.getFormattedLocation = function() {
  return `${this.wilaya}, ${this.commune}`;
};

// Verificar si el teléfono debe mostrarse
videoSchema.methods.canViewPhone = function(userId) {
  if (!this.phoneHidden) return true;
  // Aquí puedes añadir lógica: solo si el usuario ha interactuado
  return false;
};

// Incrementar conversión (compra real)
videoSchema.methods.incrementConversion = async function() {
  const totalEngagement = (this.likes.length * 2) + (this.comments.length * 3) + (this.shares.length * 4);
  const totalViews = this.views || 1;
  this.conversionRate = Math.min((totalEngagement / totalViews) * 100, 100);
  await this.save();
};

// Métodos existentes (incrementViews, updateWatchTime, toggleLike, share, updateEngagementScore)
videoSchema.methods.incrementViews = async function(userId = null) {
  this.views = (this.views || 0) + 1;
  if (userId) {
    const userIdStr = userId.toString();
    const exists = this.uniqueViews.some(id => id && id.toString() === userIdStr);
    if (!exists) this.uniqueViews.push(userId);
  }
  await this.save();
  return this;
};

videoSchema.methods.updateWatchTime = async function(userId, watchTimeSeconds) {
  this.watchTime += watchTimeSeconds;
  this.averageWatchTime = this.watchTime / (this.uniqueViews.length || 1);
  this.updateEngagementScore();
  await this.save();
  return this;
};

videoSchema.methods.toggleLike = async function(userId) {
  const userIdStr = userId.toString();
  const index = this.likes.findIndex(id => id && id.toString() === userIdStr);
  if (index === -1) {
    this.likes.push(userId);
  } else {
    this.likes.splice(index, 1);
  }
  this.updateEngagementScore();
  await this.save();
  return { liked: index === -1, likesCount: this.likes.length };
};

videoSchema.methods.share = async function(userId) {
  const userIdStr = userId.toString();
  const exists = this.shares.some(id => id && id.toString() === userIdStr);
  if (!exists) {
    this.shares.push(userId);
    this.updateEngagementScore();
    await this.save();
  }
  return { shared: true, sharesCount: this.shares.length };
};

videoSchema.methods.updateEngagementScore = function() {
  const likesCount = this.likes.length || 0;
  const commentsCount = this.comments.length || 0;
  const sharesCount = this.shares.length || 0;
  const totalViews = this.views || 1;
  const totalEngagement = (likesCount * 2) + (commentsCount * 3) + (sharesCount * 4);
  this.engagementScore = Math.min((totalEngagement / totalViews) * 100, 100);
};

// ==================== MÉTODOS ESTÁTICOS ====================

// Buscar por proximidad (vídeos cerca de una ubicación)
videoSchema.statics.findNearby = async function(longitude, latitude, maxDistance = 5000, limit = 20) {
  return this.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [longitude, latitude] },
        distanceField: 'distance',
        maxDistance: maxDistance,
        spherical: true,
        query: { isCommercial: true, pendiente: false, isActive: true }
      }
    },
    { $limit: limit },
    { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { 'user.password': 0, 'user.email': 0 } }
  ]);
};

// Filtrar vídeos comerciales por wilaya, categoría, etc.
videoSchema.statics.filterCommercial = async function(filters = {}, page = 1, limit = 20) {
  const query = { isCommercial: true, pendiente: false, isActive: true };
  
  if (filters.wilaya) query.wilaya = filters.wilaya;
  if (filters.commune) query.commune = filters.commune;
  if (filters.category) query.category = filters.category;
  if (filters.wholesale !== undefined) query.wholesale = filters.wholesale;
  if (filters.minPrice || filters.maxPrice) {
    query.price = {};
    if (filters.minPrice) query.price.$gte = filters.minPrice;
    if (filters.maxPrice) query.price.$lte = filters.maxPrice;
  }
  
  const skip = (page - 1) * limit;
  
  const [videos, total] = await Promise.all([
    this.aggregate([
      { $match: query },
      { $sort: filters.sortBy === 'price' ? { price: filters.sortOrder || 1 } : { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { 'user.password': 0, 'user.email': 0 } }
    ]),
    this.countDocuments(query)
  ]);
  
  return { videos, total, page, totalPages: Math.ceil(total / limit) };
};

// Métodos existentes (getFeaturedVideos, getPopularVideos, getTrendingVideos, getPendingVideos, getUserVideos)
videoSchema.statics.getFeaturedVideos = async function(limit = 10) {
  return this.aggregate([
    { $match: { isFeatured: true, pendiente: false, isActive: true } },
    { $sort: { createdAt: -1 } },
    { $limit: limit },
    { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { 'user.password': 0, 'user.email': 0 } }
  ]);
};

videoSchema.statics.getPopularVideos = async function(limit = 10) {
  return this.aggregate([
    { $match: { pendiente: false, isActive: true } },
    { $addFields: { likesCount: { $size: '$likes' } } },
    { $sort: { views: -1, likesCount: -1, createdAt: -1 } },
    { $limit: limit },
    { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { 'user.password': 0, 'user.email': 0 } }
  ]);
};

videoSchema.statics.getTrendingVideos = async function(limit = 10, timeRange = 'week') {
  let dateFilter = {};
  const now = new Date();
  if (timeRange === 'day') {
    dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 1)) } };
  } else if (timeRange === 'week') {
    dateFilter = { createdAt: { $gte: new Date(now.setDate(now.getDate() - 7)) } };
  } else if (timeRange === 'month') {
    dateFilter = { createdAt: { $gte: new Date(now.setMonth(now.getMonth() - 1)) } };
  }

  return this.aggregate([
    { $match: { pendiente: false, isActive: true, ...dateFilter } },
    { $addFields: {
        likesCount: { $size: '$likes' },
        commentsCount: { $size: '$comments' },
        sharesCount: { $size: { $ifNull: ['$shares', []] } }
    } },
    { $addFields: {
        totalEngagement: { $add: [
          { $multiply: ['$likesCount', 2] },
          { $multiply: ['$commentsCount', 3] },
          { $multiply: ['$sharesCount', 4] }
        ] }
    } },
    { $addFields: { 
      engagementScore: { 
        $min: [ 
          { $multiply: [ 
            { $divide: ['$totalEngagement', { $ifNull: ['$views', 1] }] }, 
            100 
          ] }, 
          100 
        ] 
      } 
    } },
    { $sort: { engagementScore: -1, views: -1 } },
    { $limit: limit },
    { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { 'user.password': 0, 'user.email': 0 } }
  ]);
};

videoSchema.statics.getPendingVideos = async function(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  const [videos, total] = await Promise.all([
    this.aggregate([
      { $match: { pendiente: true, isActive: true } },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { 'user.password': 0, 'user.email': 0 } }
    ]),
    this.countDocuments({ pendiente: true, isActive: true })
  ]);
  
  return { videos, total };
};

videoSchema.statics.getUserVideos = async function(userId, isOwner = false, page = 1, limit = 12) {
  const skip = (page - 1) * limit;
  const match = { user: new mongoose.Types.ObjectId(userId) };
  
  if (!isOwner) {
    match.pendiente = false;
    match.isActive = true;
  }
  
  const [videos, total] = await Promise.all([
    this.aggregate([
      { $match: match },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { 'user.password': 0, 'user.email': 0 } }
    ]),
    this.countDocuments(match)
  ]);
  
  return { videos, total };
};

// ==================== MIDDLEWARE ====================
videoSchema.pre('save', function(next) {
  if (this.isModified('views') || this.isModified('likes') || this.isModified('comments') || this.isModified('shares')) {
    this.updateEngagementScore();
  }
  
  // Si es comercial y no tiene ubicación, marcar como pendiente
  if (this.isCommercial && (!this.wilaya || !this.commune)) {
    this.pendiente = true;
  }
  
  next();
});

module.exports = mongoose.model('Video', videoSchema);