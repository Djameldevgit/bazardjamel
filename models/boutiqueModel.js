// 📂 models/boutiqueModel.js - VERSIÓN CORREGIDA
const mongoose = require('mongoose');

// 🔥 CORREGIDO: Schema que coincide EXACTAMENTE con lo que envía el frontend
const CategorieProduitSchema = new mongoose.Schema({
  level1: { type: String, required: true },
  level1Name: { type: String, required: true },
  level1Emoji: { type: String, default: '📦' },
  level2: { type: String, default: null },
  level2Name: { type: String, default: null },
  level2Emoji: { type: String, default: null },
  level3: { type: String, default: null },
  level3Name: { type: String, default: null },
  level3Emoji: { type: String, default: null },
  fullPath: { type: String, required: true },
  displayPath: { type: String, required: true },
  level: { type: Number, required: true }
  // ❌ ELIMINADOS: cachedName y categoryId - NO existen en tu frontend
}, { _id: false });

const BoutiqueSchema = new mongoose.Schema({
  // ============ STEP 1: INFORMATIONS DU STORE ============
  nom_boutique: { type: String, required: true },
  domaine_boutique: { type: String, required: true, unique: true },
  slogan_boutique: { type: String, default: '' },
  description_boutique: { type: String, required: true },
  logo: {
    url: { type: String, default: '' },
    public_id: { type: String, default: '' }
  },
  date_debut: { type: Date, default: Date.now },
  
  // ============ STEP 2: CONFIGURATION ============
  // 🔥 CATEGORÍAS DE PRODUCTOS - ESTRUCTURA COMPLETA
  categories_produits: { 
    type: [CategorieProduitSchema], 
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Au moins une catégorie de produits est requise'
    }
  },
  categorySlugs: [{ type: String }],
  
  // Tipo de boutique (categorie_boutique del wizard)
  categorie_boutique: { type: String, default: '' },
  
  // Duración y oferta
  duree: { type: String, default: '1' },
  offre: { type: String, default: 'Store Basic 50' },
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
  
  // ============ STEP 3: PROPRIÉTAIRE & CONTACT ============
  proprietaire: {
    nom: { type: String, default: '' },
    email: { type: String, default: '' },
    telephone: { type: String, default: '' },
    wilaya: { type: String, default: '' },
    adresse: { type: String, default: '' }
  },
  
  reseaux_sociaux: {
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    tiktok: { type: String, default: '' },
    whatsapp: { type: String, default: '' },
    website: { type: String, default: '' }
  },
  
  couleur_theme: { type: String, default: '#2563eb' },
  
  // ============ STEP 4: PAIEMENT ============
  montant_initial: { type: Number, default: 0 },
  mois_offerts: { type: Number, default: 0 },
  montant_ttc: { type: Number, default: 0 },
  methode_paiement: { type: String, default: '' },
  client_nom: { type: String, default: '' },
  client_telephone: { type: String, default: '' },
  accepte_conditions: { type: Boolean, default: false },
  
  // ============ MÉTADONNÉES ============
  statut: {
    type: String,
    enum: ['en_attente', 'active', 'suspendue', 'rejetee'],
    default: 'en_attente'
  },
  
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  isActive: { type: Boolean, default: true },
  vues: { type: Number, default: 0 }
  
}, { timestamps: true });

// Índices para búsquedas rápidas
BoutiqueSchema.index({ domaine_boutique: 1 }, { unique: true });
BoutiqueSchema.index({ user: 1 });
BoutiqueSchema.index({ statut: 1 });
BoutiqueSchema.index({ 'categories_produits.fullPath': 1 });
BoutiqueSchema.index({ categorySlugs: 1 });

module.exports = mongoose.model('Boutique', BoutiqueSchema);