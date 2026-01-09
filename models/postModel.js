// 📂 models/postModel.js
const mongoose = require('mongoose');
const generateTitle = require('../utils/titleGenerator');

const postSchema = new mongoose.Schema({
  categorie: { type: String, required: true, index: true },
  subCategory: { type: String, index: true },
  articleType: { type: String },
  operationType: { type: String, default: '' },
  propertyType: { type: String, default: '' },
  
  // ✅ NUEVO: Campo para diferenciar tipo de post
  postType: { 
    type: String, 
    enum: ['product', 'boutique'], 
    default: 'product',
    index: true 
  },
  
  // ✅ NUEVO: Datos específicos de boutique (solo si postType === 'boutique')
  boutiqueData: {
    // Informations de la boutique
    nom_boutique: { type: String, index: true },
    domaine_boutique: { type: String, index: true },
    slogan_boutique: String,
    description_boutique: String,
    categories_produits: [{ type: String }],
    couleur_theme: { type: String, default: '#2563eb' },
    
    // Plan et tarification
    plan_boutique: String,
    duree_abonnement: String,
    total_credits: Number,
    stockage_max: String,
    inclusions_plan: [{ type: String }],
    
    // Informations propriétaire
    proprietaire_nom: String,
    proprietaire_email: String,
    proprietaire_telephone: String,
    proprietaire_wilaya: String,
    proprietaire_adresse: String,
    reseaux_sociaux: [{ type: String }],
    accepte_conditions: { type: Boolean, default: false },
    
    // Statut de la boutique
    boutique_status: { 
      type: String, 
      enum: ['pending', 'active', 'suspended', 'expired', 'cancelled'], 
      default: 'pending',
      index: true 
    },
    date_activation: Date,
    date_expiration: Date,
    
    // Logo
    logo_boutique: {
      url: String,
      public_id: String
    }
  },
  
  // ✅ Mantener compatibilidad con el sistema existente
  categorySpecificData: { type: Map, of: mongoose.Schema.Types.Mixed, default: {} },
  searchKeywords: [{ type: String, index: true }],
  images: [{ url: String, public_id: String }],
  user: { type: mongoose.Types.ObjectId, ref: 'user', index: true },
  likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
  isActive: { type: Boolean, default: true, index: true },
  isPromoted: { type: Boolean, default: false },
  isUrgent: { type: Boolean, default: false },
  views: { type: Number, default: 0 },
  title: { type: String, index: true },
  
  // Campos de precio y ubicación (mantener compatibilidad)
  price: { type: Number, default: 0 },
  description: String,
  condition: { type: String, default: 'occasion' },
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

// 🧠 Virtual para saber si es boutique
postSchema.virtual('isBoutique').get(function() {
  return this.postType === 'boutique';
});

// 🧠 Hook mejorado para generar título
postSchema.pre('save', function (next) {
  if (!this.title) {
    // Si es boutique, usar nombre de boutique
    if (this.postType === 'boutique' && this.boutiqueData.nom_boutique) {
      this.title = `🏪 ${this.boutiqueData.nom_boutique} - Boutique en ligne`;
    } 
    // Si es producto normal, usar generador existente
    else if (this.postType === 'product') {
      this.title = generateTitle(this);
    }
    // Fallback
    else {
      this.title = 'Nouvelle annonce';
    }
  }
  
  // Si es boutique, asegurar que categorySpecificData incluya los datos
  if (this.postType === 'boutique' && this.boutiqueData) {
    // Mover datos relevantes a categorySpecificData para compatibilidad
    Object.entries(this.boutiqueData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        this.categorySpecificData.set(key, value);
      }
    });
  }
  
  next();
});

// ✅ Índices para optimizar búsquedas de boutiques
postSchema.index({ 'postType': 1, 'boutiqueData.boutique_status': 1 });
postSchema.index({ 'boutiqueData.nom_boutique': 'text', 'boutiqueData.description_boutique': 'text' });
postSchema.index({ 'boutiqueData.domaine_boutique': 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('post', postSchema);