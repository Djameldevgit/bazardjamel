const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    // 👤 Autor
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true
    },

    // 🏬 Boutique (relación)
    boutique: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boutique",
      index: true
    },

    // 🗂️ Categorías
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

    // 🔑 Categoría real
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true
    },

    // ❤️ Interacciones
    likes: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    comments: [{ type: mongoose.Types.ObjectId, ref: "comment" }],

    // 🧾 Info
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 150
    },

    description: {
      type: String,
      trim: true,
      maxlength: 3000
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
      max: 1000000000
    },

    etat: String,

    // 📍 Localización
    wilaya: {
      type: String,
      index: true
    },
    commune: String,
    address: String,

    // 📞 Contacto
    phone: String,
    email: {
      type: String,
      lowercase: true
    },

    // 🧩 Datos dinámicos
    categorySpecificData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    // 🖼️ Imágenes (estructura PRO)
    images: [
      {
        url: String,
        public_id: String
      }
    ],

    // 📊 Stats
    views: {
      type: Number,
      default: 0
    },

    score: {
      type: Number,
      default: 0,
      index: true
    },

    lastInteractionAt: {
      type: Date,
      default: Date.now,
      index: true
    },

    // 🔗 SEO
    slug: {
      type: String,
      unique: true,
      index: true
      
    },
    pendiente: {
      type: Boolean,
      default: true,
      index: true
    },
    // 🔒 Estado
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// 🧠 MÉTODO SCORE
postSchema.methods.calculateScore = function () {
  const views = this.views || 0;
  const likes = this.likes.length || 0;
  const freshness = (Date.now() - this.createdAt) / (1000 * 60 * 60 * 24);

  return (likes * 3) + (views * 0.5) - freshness;
};

// 🔍 ÍNDICES PRO
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ wilaya: 1, category: 1 });
postSchema.index({ categorie: 1, subCategory: 1 });
postSchema.index({ boutique: 1, isActive: 1, createdAt: -1 });
postSchema.index({ score: -1, createdAt: -1 });

module.exports = mongoose.model("Post", postSchema);