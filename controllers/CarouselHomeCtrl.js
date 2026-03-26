// backend/controllers/carouselHomeCtrl.js
const CarouselImage = require('../models/CarouselImageModel');

// ============ OBTENER IMÁGENES ACTIVAS PARA EL HOME (PÚBLICO) ============
const getHomeCarousel = async (req, res) => {
  try {
    const images = await CarouselImage.find({ isActive: true })
      .sort({ createdAt: 1 })
      .lean();

    res.json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error('❌ Error getHomeCarousel:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ============ OBTENER TODAS LAS IMÁGENES (ADMIN) ============
const getAllCarouselImages = async (req, res) => {
  try {
    const images = await CarouselImage.find({})
      .sort({ createdAt: 1 })
      .lean();

    res.json({
      success: true,
      data: images
    });
  } catch (error) {
    console.error('❌ Error getAllCarouselImages:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// ============ CREAR NUEVA IMAGEN ============
const createCarouselImage = async (req, res) => {
  try {
    const { title, description, link, linkType, image } = req.body;

    // Validaciones
    if (!title || !image || !image.url || !image.public_id) {
      return res.status(400).json({
        success: false,
        message: 'Título e imagen son requeridos'
      });
    }

    const newImage = new CarouselImage({
      title: title.trim(),
      description: description.trim() || '',
      link: link.trim() || '',
      linkType: linkType || 'none',
      image: {
        url: image.url,
        public_id: image.public_id
      },
      isActive: true
    });

    await newImage.save();

    console.log('✅ Imagen creada:', newImage._id);

    res.status(201).json({
      success: true,
      message: 'Imagen creada exitosamente',
      data: newImage
    });

  } catch (error) {
    console.error('❌ Error createCarouselImage:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ ACTUALIZAR IMAGEN ============
const updateCarouselImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, link, linkType, isActive, image } = req.body;

    const carouselImage = await CarouselImage.findById(id);
    
    if (!carouselImage) {
      return res.status(404).json({
        success: false,
        message: 'Imagen no encontrada'
      });
    }

    // Actualizar campos
    if (title) carouselImage.title = title.trim();
    if (description !== undefined) carouselImage.description = description.trim() || '';
    if (link !== undefined) carouselImage.link = link.trim() || '';
    if (linkType) carouselImage.linkType = linkType;
    if (isActive !== undefined) carouselImage.isActive = isActive;
    
    // Actualizar imagen si viene nueva
    if (image && image.url && image.public_id) {
      carouselImage.image = {
        url: image.url,
        public_id: image.public_id
      };
    }

    await carouselImage.save();

    console.log('✅ Imagen actualizada:', id);

    res.json({
      success: true,
      message: 'Imagen actualizada exitosamente',
      data: carouselImage
    });

  } catch (error) {
    console.error('❌ Error updateCarouselImage:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ============ ELIMINAR IMAGEN ============
const deleteCarouselImage = async (req, res) => {
  try {
    const { id } = req.params;
    
    const carouselImage = await CarouselImage.findById(id);
    
    if (!carouselImage) {
      return res.status(404).json({
        success: false,
        message: 'Imagen no encontrada'
      });
    }
    
    // Eliminar de Cloudinary
    if (carouselImage.image && carouselImage.image.public_id) {
      try {
        const cloudinary = require('cloudinary').v2;
        await cloudinary.uploader.destroy(carouselImage.image.public_id);
        console.log('✅ Eliminado de Cloudinary:', carouselImage.image.public_id);
      } catch (cloudinaryErr) {
        console.warn('⚠️ No se pudo eliminar de Cloudinary:', cloudinaryErr.message);
      }
    }
    
    await carouselImage.deleteOne();

    console.log('✅ Imagen eliminada:', id);

    res.json({
      success: true,
      message: 'Imagen eliminada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error deleteCarouselImage:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getHomeCarousel,        // ✅ Para el home
  getAllCarouselImages,   // ✅ Para admin (todas)
  createCarouselImage,    // ✅ Crear
  updateCarouselImage,    // ✅ Actualizar
  deleteCarouselImage     // ✅ Eliminar
};