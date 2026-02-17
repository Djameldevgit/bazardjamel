const mongoose = require('mongoose')
const boutiqueSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    index: true
  },

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

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  },

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

  // 🟢 Cambiar de avatar a images
  images: {
    type: Array,
    required: true
},
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

  proprietaire: {
    nom: String,
    email: String,
    telephone: String,
    wilaya: String,
    adresse: String
  },

  reseaux_sociaux: {
    facebook: String,
    instagram: String,
    tiktok: String,
    whatsapp: String,
    website: String
  },

  couleur_theme: {
    type: String,
    default: '#2563eb'
  },

  stats: {
    vues: { type: Number, default: 0 },
    produits: { type: Number, default: 0 },
    notes: { type: Number, default: 0 },
    avis: { type: Number, default: 0 }
  },

  isActive: {
    type: Boolean,
    default: true
  },

  isVerified: {
    type: Boolean,
    default: false
  },

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

// Índices
boutiqueSchema.index({ categorie: 1, isActive: 1 });
boutiqueSchema.index({ subCategory: 1, isActive: 1 });
boutiqueSchema.index({ articleType: 1, isActive: 1 });
boutiqueSchema.index({ category: 1, isActive: 1 });
boutiqueSchema.index({ user: 1, isActive: 1 });
boutiqueSchema.index({ 'stats.notes': -1 });
boutiqueSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Boutique', boutiqueSchema);