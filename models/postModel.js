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

    // 🏬 Boutique (si el post pertenece a una)
    boutique: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Boutique",
      index: true
    },

    // 🔖 Identificador si viene de una boutique
    isFromBoutique: {
      type: Boolean,
      default: false
    },

    // 🗂️ CATEGORÍAS (texto plano del cliente)
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

    // 🔑 CATEGORÍA REAL (referencia en MongoDB)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true
    },

    // ❤️ Likes y comentarios
    likes: [{ type: mongoose.Types.ObjectId, ref: "user" }],
    comments: [{ type: mongoose.Types.ObjectId, ref: "comment" }],

    // 🧾 Información del post
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
      type: String
    },

    // 📍 LOCALIZACIÓN (opcional si es boutique)
    wilaya: {
      type: String,
      index: true
    },

    commune: {
      type: String
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

    // 🧩 Datos específicos según categoría
    categorySpecificData: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    // 🖼️ Imágenes
    images: {
      type: Array,
      required: true
    },

    // 📊 Estadísticas
    views: {
      type: Number,
      default: 0
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

//
// 🔍 ÍNDICES (rendimiento en UI y búsquedas)
//
postSchema.index({ category: 1, createdAt: -1 });
postSchema.index({ wilaya: 1, category: 1 });
postSchema.index({ categorie: 1, subCategory: 1 });
postSchema.index({ boutique: 1, isFromBoutique: 1 }); // ✅ Nuevo índice útil

module.exports = mongoose.model("Post", postSchema);