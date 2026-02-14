// models/Boutique.js
const mongoose = require('mongoose');

const boutiqueSchema = new mongoose.Schema({
  // 👤 Usuario propietario
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    index: true
  },

  // 🗂️ CATEGORÍAS (strings del cliente)
  categorie: {
    type: String,
    required: true,
    trim: true,
    index: true
  },

  subCategory: {
    type: String,
    required: true,
    trim: true,
    index: true
  },

  articleType: {
    type: String,
    trim: true,
    index: true
  },

  // 🔑 CATEGORÍA REAL (MongoDB)
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  },

  // 🏪 Información de la boutique
  nom_boutique: {
    type: String,
    required: true,
    trim: true
  },

  domaine_boutique: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },

  slogan_boutique: {
    type: String,
    trim: true
  },

  description_boutique: {
    type: String,
    required: true
  },

  // 🖼️ AVATAR (un solo campo, como viene del cliente)
  avatar: {
    type: Object, // { url, public_id }
    default: null
  },

  // 📦 Plan y suscripción
  plan: {
    type: String,
    enum: ['gratuit', 'basique', 'premium', 'entreprise'],
    default: 'gratuit'
  },

  duree_abonnement: {
    type: String,
    enum: ['1mois', '3mois', '6mois', '1an'],
    default: '1mois'
  },

  date_debut: {
    type: Date,
    default: Date.now
  },

  date_fin: {
    type: Date
  },

  // 🏷️ Categorías de productos que vende
  categories_produits: [{
    type: String
  }],

  // 👤 Propietario
  proprietaire: {
    nom: String,
    email: String,
    telephone: String,
    wilaya: String,
    adresse: String
  },

  // 🌐 Redes sociales
  reseaux_sociaux: {
    facebook: String,
    instagram: String,
    tiktok: String,
    whatsapp: String,
    website: String
  },

  // 🎨 Personalización
  couleur_theme: {
    type: String,
    default: '#2563eb'
  },

  // 📊 Estadísticas
  stats: {
    vues: { type: Number, default: 0 },
    produits: { type: Number, default: 0 },
    notes: { type: Number, default: 0 },
    avis: { type: Number, default: 0 }
  },

  // ✅ Estado
  isActive: {
    type: Boolean,
    default: true
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  // 📝 Metadatos del wizard
  offre_choisie: {
    id: String,
    nom: String,
    credits: Number,
    storage: Number,
    prix_mois: Number
  },

  duree_choisie: {
    id: String,
    nom: String
  },

  montant_initial: Number,
  mois_offerts: Number,
  montant_ttc: Number,
  methode_paiement: String,
  transaction_id: String,

  // ⏱️ Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices compuestos para búsquedas
boutiqueSchema.index({ categorie: 1, isActive: 1 });
boutiqueSchema.index({ subCategory: 1, isActive: 1 });
boutiqueSchema.index({ articleType: 1, isActive: 1 });
boutiqueSchema.index({ category: 1, isActive: 1 });
boutiqueSchema.index({ user: 1, isActive: 1 });
boutiqueSchema.index({ 'stats.notes': -1 });
boutiqueSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Boutique', boutiqueSchema);