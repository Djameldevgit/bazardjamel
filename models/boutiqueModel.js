// 📂 models/boutiqueModel.js
const mongoose = require('mongoose');

const boutiqueSchema = new mongoose.Schema({
  // ========== INFORMACIÓN BÁSICA ==========
  nom_boutique: {
    type: String,
   
    trim: true,
    maxlength: [100, 'Le nom ne peut pas dépasser 100 caractères'],
    index: true
  },
  
  domaine_boutique: {
    type: String,
 
    trim: true,
    unique: true,
    lowercase: true,
    match: [/^[a-z0-9-]+$/, 'Le domaine ne peut contenir que des lettres minuscules, chiffres et tirets'],
    index: true
  },
  
  slogan_boutique: {
    type: String,
    trim: true,
    maxlength: [200, 'Le slogan ne peut pas dépasser 200 caractères']
  },
  
  description_boutique: {
    type: String,
    trim: true,
    maxlength: [2000, 'La description ne peut pas dépasser 2000 caractères']
  },
  
  // ========== CATEGORÍAS DE PRODUCTOS ==========
  categories_produits: [{
    type: String,
    trim: true
  }],
  
  // ========== INFORMACIÓN DEL PROPIETARIO ==========
  proprietaire: {
    nom: {
      type: String,
     
      trim: true
    },
    email: {
      type: String,
 
      lowercase: true,
      trim: true
    },
    telephone: {
      type: String,
   
      trim: true
    },
    wilaya: String,
    adresse: String
  },
  
  // ========== REDES SOCIALES ==========
  reseaux_sociaux: {
    facebook: String,
    instagram: String,
    tiktok: String,
    whatsapp: String,
    website: String
  },
  
  // ========== APARIENCIA ==========
  couleur_theme: {
    type: String,
    default: '#2563eb',
    match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Format de couleur invalide']
  },
  
  // ========== LOGO ==========
  logo: {
    url: String,
    public_id: String
  },
  
  // ========== ESTADO Y PLAN ==========
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'expired', 'cancelled'],
    default: 'pending',
    index: true
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
  
  // ========== FECHAS ==========
  date_activation: {
    type: Date
  },
  
  date_expiration: {
    type: Date
  },
  
  // ========== REFERENCIA AL USUARIO ==========
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'user',
     
    index: true
  },
  
  // ========== METADATOS ==========
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  
  vues: {
    type: Number,
    default: 0
  },
  
  produits_count: {
    type: Number,
    default: 0
  },
  
  note_moyenne: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  
  // ========== CONFIGURACIONES ==========
  accepte_conditions: {
    type: Boolean,
   
    default: false
  }

}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ========== ÍNDICES ==========
boutiqueSchema.index({ nom_boutique: 'text', description_boutique: 'text' });
boutiqueSchema.index({ status: 1, isActive: 1 });
boutiqueSchema.index({ user: 1, status: 1 });
boutiqueSchema.index({ 'proprietaire.email': 1 });
boutiqueSchema.index({ 'proprietaire.telephone': 1 });
boutiqueSchema.index({ createdAt: -1 });

// ========== MIDDLEWARE PRE-SAVE ==========
boutiqueSchema.pre('save', function(next) {
  // Si se activa la boutique, establecer fecha de activación
  if (this.isModified('status') && this.status === 'active' && !this.date_activation) {
    this.date_activation = new Date();
    
    // Calcular fecha de expiración según duración
    const expirationDate = new Date();
    switch(this.duree_abonnement) {
      case '1mois':
        expirationDate.setMonth(expirationDate.getMonth() + 1);
        break;
      case '3mois':
        expirationDate.setMonth(expirationDate.getMonth() + 3);
        break;
      case '6mois':
        expirationDate.setMonth(expirationDate.getMonth() + 6);
        break;
      case '1an':
        expirationDate.setFullYear(expirationDate.getFullYear() + 1);
        break;
    }
    this.date_expiration = expirationDate;
  }
  
  next();
});

// ========== VIRTUAL PARA PRODUCTOS ==========
boutiqueSchema.virtual('produits', {
  ref: 'post',
  localField: '_id',
  foreignField: 'boutique'
});

// ========== MÉTODO PARA OBTENER BOUTIQUE ACTIVA ==========
boutiqueSchema.statics.findActiveByDomain = function(domaine) {
  return this.findOne({ 
    domaine_boutique: domaine,
    status: 'active',
    isActive: true 
  });
};

// ========== MÉTODO PARA OBTENER BOUTIQUES DEL USUARIO ==========
boutiqueSchema.statics.findByUser = function(userId) {
  return this.find({ 
    user: userId,
    isActive: true 
  }).sort({ createdAt: -1 });
};

module.exports = mongoose.model('Boutique', boutiqueSchema);