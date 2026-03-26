// backend/models/CarouselImage.js
const mongoose = require('mongoose');

const carouselImageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  link: {
    type: String,
    default: ''
  },
  linkType: {
    type: String,
    enum: ['external', 'internal', 'none'],
    default: 'none'
  },
  image: {
    url: {
      type: String,
      required: true
    },
    public_id: {
      type: String,
      required: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Índice para ordenamiento
carouselImageSchema.index({ order: 1, createdAt: 1 });

module.exports = mongoose.model('CarouselImage', carouselImageSchema);