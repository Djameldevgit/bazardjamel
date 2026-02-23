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
      ref: "Category",
      required: true,
      index: true
    },
    boutique: { type: mongoose.Schema.Types.ObjectId, ref: 'Boutique', index: true },
    likes: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    comments: [{ type: mongoose.Types.ObjectId, ref: 'comment' }],
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
      min: 0
    },

    etat: {
      type: String,
       
    },

    // 📍 LOCALIZACIÓN
    wilaya: {
      type: String,
      required: true,
      index: true
    },

    commune: {
      type: String,
      required: true
    },

    address: {
      type: String,
      trim: true
    },

    // 📞 CONTACTO
    phone: {
      type: String,
      trim: true
    },

    email: {
      type: String,
      trim: true,
      lowercase: true
    },

    // 🧩 CAMPOS DINÁMICOS POR CATEGORÍA
    categorySpecificData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    // 🖼️ IMÁGENES
    images: {
      type: Array,
      required: true
  },

    // 📊 ESTADÍSTICAS
    views: {
      type: Number,
      default: 0
    },

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

//
// 🔍 ÍNDICES IMPORTANTES (performance UI)
//
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ wilaya: 1, category: 1 });
postSchema.index({ categorie: 1, subCategory: 1 });

module.exports = mongoose.model("Post", postSchema);
