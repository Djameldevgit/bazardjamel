const CarouselImage = require('../models/CarouselImageModel');
 
// ================= HELPERS =================

// Manejo de errores centralizado
const handleError = (res, error, context) => {
  console.error(`❌ Error en ${context}:`, error);
  return res.status(500).json({
    success: false,
    message: error.message
  });
};

// Buscar imagen por ID con validación
const findCarouselById = async (id, res) => {
  try {
    const image = await CarouselImage.findById(id);

    if (!image) {
      res.status(404).json({
        success: false,
        message: 'Imagen no encontrada'
      });
      return null;
    }

    return image;
  } catch (error) {
    handleError(res, error, 'findCarouselById');
    return null;
  }
};

// ================= CONTROLLER =================

const carouselHomeCtrl = {

  // ===== HOME =====
  getHomeCarousel: async (req, res) => {
    try {
      const images = await CarouselImage.find({ isActive: true })
        .sort({ createdAt: 1 })
        .lean();

      return res.json({
        success: true,
        data: images
      });

    } catch (error) {
      return handleError(res, error, 'getHomeCarousel');
    }
  },

  // ===== ADMIN LIST =====
  getAllCarouselImages: async (req, res) => {
    try {
      const images = await CarouselImage.find({})
        .sort({ createdAt: 1 })
        .lean();

      return res.json({
        success: true,
        data: images
      });

    } catch (error) {
      return handleError(res, error, 'getAllCarouselImages');
    }
  },

  // ===== CREATE =====
  createCarouselImage: async (req, res) => {
    try {
      const { title, description, link, linkType, image } = req.body;

      if (!title || !image || !image.url || !image.public_id) {
        return res.status(400).json({
          success: false,
          message: 'Título e imagen son requeridos'
        });
      }

      const newImage = new CarouselImage({
        title: title.trim(),
        description: description ? description.trim() : '',
        link: link ? link.trim() : '',
        linkType: linkType || 'none',
        image: {
          url: image.url,
          public_id: image.public_id
        },
        isActive: true
      });

      await newImage.save();

      console.log('✅ Imagen creada:', newImage._id);

      return res.status(201).json({
        success: true,
        message: 'Imagen creada exitosamente',
        data: newImage
      });

    } catch (error) {
      return handleError(res, error, 'createCarouselImage');
    }
  },

  // ===== UPDATE =====
  updateCarouselImage: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, link, linkType, isActive, image } = req.body;

      const carouselImage = await findCarouselById(id, res);
      if (!carouselImage) return;

      if (title) carouselImage.title = title.trim();
      if (description !== undefined) carouselImage.description = description.trim() || '';
      if (link !== undefined) carouselImage.link = link.trim() || '';
      if (linkType) carouselImage.linkType = linkType;
      if (isActive !== undefined) carouselImage.isActive = isActive;

      if (image && image.url && image.public_id) {
        carouselImage.image = {
          url: image.url,
          public_id: image.public_id
        };
      }

      await carouselImage.save();

      console.log('✅ Imagen actualizada:', id);

      return res.json({
        success: true,
        message: 'Imagen actualizada exitosamente',
        data: carouselImage
      });

    } catch (error) {
      return handleError(res, error, 'updateCarouselImage');
    }
  },

  // ===== DELETE =====
  deleteCarouselImage: async (req, res) => {
    try {
      const { id } = req.params;

      const carouselImage = await findCarouselById(id, res);
      if (!carouselImage) return;

      // Eliminar de Cloudinary
      if (carouselImage.image && carouselImage.image.public_id) {
        try {
          const cloudinary = require('cloudinary').v2;
          await cloudinary.uploader.destroy(carouselImage.image.public_id);
          console.log('✅ Eliminado de Cloudinary:', carouselImage.image.public_id);
        } catch (err) {
          console.warn('⚠️ Error Cloudinary:', err.message);
        }
      }

      await carouselImage.deleteOne();

      console.log('✅ Imagen eliminada:', id);

      return res.json({
        success: true,
        message: 'Imagen eliminada exitosamente'
      });

    } catch (error) {
      return handleError(res, error, 'deleteCarouselImage');
    }
  }

};

module.exports = carouselHomeCtrl;