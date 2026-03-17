const mongoose = require('mongoose')

const boutiqueSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
    index: true
  }, // ID del usuario propietario.

  categorie: {
    type: String,
    required: true,
    trim: true,
    index: true
  }, // Categoría principal de la boutique.

  subCategory: {
    type: String,
    required: true,
    trim: true,
    index: true
  }, // Subcategoría de la boutique.

  articleType: {
    type: String,
    trim: true,
    index: true
  }, // Tipo de artículos ofrecidos.

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
    index: true
  }, // Referencia al documento de categoría.

  nom_boutique: {
    type: String,
    required: true,
    trim: true
  }, // Nombre público de la boutique.

  domaine_boutique: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  }, // URL o dominio único de la boutique.

  slogan_boutique: {
    type: String,
    trim: true
  }, // Frase corta o lema comercial.

  description_boutique: {
    type: String,
    required: true
  }, // Descripción general del negocio.

  images: {
    type: Array,
    required: true
  }, // Lista de imágenes o logo de la boutique.
 

  plan: {
    type: String,
    enum: ['gratuit', 'basique', 'premium', 'entreprise'],
    default: 'gratuit'
  }, // Tipo de plan (gratuit, basique, premium, entreprise).

  duree_abonnement: {
    type: String,
    enum: ['1mois', '3mois', '6mois', '1an'],
    default: '1mois'
  }, // Duración del plan activo.

  date_debut: {
    type: Date,
    default: Date.now
  }, // Fecha de inicio del plan.

  date_fin: {
    type: Date
  }, // Fecha de finalización del plan.Valida si el plan sigue activo

  proprietaire: {
    nom: String, // Nombre del propietario.
    email: String, // Correo del propietario.
    telephone: String, // Teléfono de contacto.
    wilaya: String, // Región o provincia.
    adresse: String // Dirección completa.
  },

  reseaux_sociaux: {
    facebook: String, // Enlace de Facebook.
    instagram: String, // Enlace de Instagram.
    tiktok: String, // Enlace de TikTok.
    whatsapp: String, // Número o enlace de WhatsApp.
    website: String // Sitio web oficial.
  },

  couleur_theme: {
    type: String,
    default: '#2563eb'
  }, // Color principal del diseño.
  
  stats: {
    vues: { type: Number, default: 0 }, // Número de visitas recibidas.
    produits: { type: Number, default: 0 }, // Cantidad de productos publicados.
    notes: { type: Number, default: 0 }, // Promedio de calificación.
    avis: { type: Number, default: 0 } // Número de opiniones.
  },

  isActive: {
    type: Boolean,
    default: true
  }, // Estado activo o desactivado.Permite desactivar temporalmente una boutique sin eliminarla. Ideal si la empresa no renovó el plan o si fue suspendida

  isVerified: {
    type: Boolean,
    default: false
  }, // Verificado por el administrador.

  offre_choisie: {
    id: String, // ID de la oferta seleccionada.
    nom: String, // Nombre de la oferta.
    credits: Number, // Créditos incluidos en la oferta.
    storage: Number, // Espacio de almacenamiento asignado.
    prix_mois: Number // Precio mensual del plan.
  }, // Detalles de la oferta seleccionada.Confirma el tipo de plan contratado

  duree_choisie: {
    id: String, // ID de la duración elegida.
    nom: String // Nombre o tipo de duración.
  }, // Duración elegida del plan.

  montant_initial: Number, // Monto inicial del pago.
  mois_offerts: Number, // Meses adicionales gratuitos.
  montant_ttc: Number, // Total a pagar con impuestos.
  methode_paiement: String, // Método de pago utilizado.
  transaction_id: String, // ID de la transacción o pago.

  createdAt: {
    type: Date,
    default: Date.now
  }, // Fecha de creación del registro.

  updatedAt: {
    type: Date,
    default: Date.now
  } // Fecha de última actualización.
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