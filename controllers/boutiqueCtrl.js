// ctrls/boutiqueCtrl.js
const Boutique = require('../models/boutiqueModel');
const Category = require('../models/categoryModel');

// Función para generar slug único (compatible con Node antiguo)
const generateUniqueSlug = function(text) {
  // Asegurar que text es string
  var textStr = text ? text.toString() : '';
  
  var baseSlug = textStr
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  // Si después de limpiar queda vacío, usar valor por defecto
  var finalBase = baseSlug || 'boutique';
  
  // Añadir timestamp para unicidad
  var timestamp = Date.now().toString().slice(-6);
  return finalBase + '-' + timestamp;
};

const boutiqueCtrl = {
  createBoutique: async function(req, res) {
    try {
      var boutiqueData = req.body;
      var user = req.user;
      
      // Calcular imagesCount de forma segura
      var imagesCount = 0;
      if (boutiqueData.images && boutiqueData.images.length) {
        imagesCount = boutiqueData.images.length;
      }

      console.log('📦 Creando boutique:', {
        nom_boutique: boutiqueData.nom_boutique,
        categorie: boutiqueData.categorie,
        domaine: boutiqueData.domaine_boutique,
        imagesCount: imagesCount
      });

      // Validaciones básicas
      var nom_boutique = boutiqueData.nom_boutique;
      var categorie = boutiqueData.categorie;
      var images = boutiqueData.images;

      if (!nom_boutique || !categorie || !images || images.length === 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Champs requis manquants' 
        });
      }

      // Verificar si el dominio ya existe
      if (boutiqueData.domaine_boutique) {
        var existing = await Boutique.findOne({ 
          domaine_boutique: boutiqueData.domaine_boutique 
        });

        if (existing) {
          return res.status(400).json({ 
            success: false, 
            message: 'Ce domaine est déjà utilisé. Veuillez en choisir un autre.' 
          });
        }
      }

      // Buscar categoría Boutiques
      var boutiquesCategory = await Category.findOne({ 
        slug: 'boutiques', 
        level: 1 
      });

      if (!boutiquesCategory) {
        return res.status(500).json({ 
          success: false, 
          message: 'Catégorie Boutiques non trouvée' 
        });
      }

      // Generar slug ÚNICO para la boutique
      var slugBase = boutiqueData.domaine_boutique || boutiqueData.nom_boutique;
      var slug = generateUniqueSlug(slugBase);

      // Asegurar que domaine_boutique tenga un valor válido
      var domaine_boutique = boutiqueData.domaine_boutique || slug;

      // Generar subCategory slug
      var subCategory = 'boutique-' + categorie
        .toLowerCase()
        .replace(/[&]/g, 'et')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      // Crear nueva boutique - AÑADIR header_images
      var newBoutique = new Boutique({
        user: user._id,
        categorie: categorie,
        subCategory: subCategory,
        articleType: boutiqueData.articleType || '',
        category: boutiquesCategory._id,
        nom_boutique: nom_boutique,
        domaine_boutique: domaine_boutique,
        slug: slug,
        slogan_boutique: boutiqueData.slogan_boutique || '',
        description_boutique: boutiqueData.description_boutique,
        images: images,
        // ============ NUEVO: header_images ============
        header_images: boutiqueData.header_images || [],
        plan: boutiqueData.plan || 'gratuit',
        duree_abonnement: boutiqueData.duree_abonnement || '1mois',
        date_debut: boutiqueData.date_debut || new Date(),
        proprietaire: boutiqueData.proprietaire || {},
        reseaux_sociaux: boutiqueData.reseaux_sociaux || {},
        couleur_theme: boutiqueData.couleur_theme || '#2563eb',
        offre_choisie: boutiqueData.offre_choisie,
        duree_choisie: boutiqueData.duree_choisie,
        montant_initial: boutiqueData.montant_initial || 0,
        mois_offerts: boutiqueData.mois_offerts || 0,
        montant_ttc: boutiqueData.montant_ttc || 0,
        methode_paiement: boutiqueData.methode_paiement || '',
        transaction_id: 'TR-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
      });

      console.log('💾 Boutique à sauvegarder:', {
        nom: newBoutique.nom_boutique,
        domaine: newBoutique.domaine_boutique,
        slug: newBoutique.slug,
        imagesCount: newBoutique.images.length,
        headerImagesCount: newBoutique.header_images.length
      });

      await newBoutique.save();

      console.log('✅ Boutique créée avec succès, ID:', newBoutique._id);

      res.status(201).json({
        success: true,
        message: 'Boutique créée avec succès!',
        boutique: {
          _id: newBoutique._id,
          nom_boutique: newBoutique.nom_boutique,
          domaine_boutique: newBoutique.domaine_boutique,
          slug: newBoutique.slug,
          images: newBoutique.images,
          header_images: newBoutique.header_images
        }
      });

    } catch (error) {
      console.error('❌ Error en createBoutique:', error);

      // Error de duplicado
      if (error.code === 11000) {
        // Verificar qué campo causó el duplicado de forma segura
        if (error.keyPattern && error.keyPattern.domaine_boutique) {
          return res.status(400).json({ 
            success: false, 
            message: 'Ce domaine est déjà utilisé. Veuillez en choisir un autre.' 
          });
        }
        if (error.keyPattern && error.keyPattern.slug) {
          return res.status(400).json({ 
            success: false, 
            message: 'Erreur de création. Veuillez réessayer.' 
          });
        }
      }

      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  },

  updateBoutique: async function(req, res) {
    try {
      var id = req.params.boutiqueId;
      var updateData = req.body;
      var user = req.user;

      console.log('📝 Actualizando boutique:', {
        id: id,
        nom_boutique: updateData.nom_boutique,
        user: user._id
      });

      // Buscar la boutique
      var boutique = await Boutique.findById(id);

      if (!boutique) {
        return res.status(404).json({ 
          success: false, 
          message: 'Boutique non trouvée' 
        });
      }

      // Verificar que el usuario sea el propietario
      if (boutique.user.toString() !== user._id.toString()) {
        return res.status(403).json({ 
          success: false, 
          message: 'Non autorisé à modifier cette boutique' 
        });
      }

      // Verificar si el dominio ya existe (si está cambiando)
      if (updateData.domaine_boutique && 
          updateData.domaine_boutique !== boutique.domaine_boutique) {
        var existing = await Boutique.findOne({ 
          domaine_boutique: updateData.domaine_boutique,
          _id: { $ne: id }
        });

        if (existing) {
          return res.status(400).json({ 
            success: false, 
            message: 'Ce domaine est déjà utilisé. Veuillez en choisir un autre.' 
          });
        }
      }

      // Actualizar subCategory si cambia la categoría
      var subCategory = boutique.subCategory;
      if (updateData.categorie && updateData.categorie !== boutique.categorie) {
        subCategory = 'boutique-' + updateData.categorie
          .toLowerCase()
          .replace(/[&]/g, 'et')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');
      }

      // Regenerar slug solo si cambia el nombre o dominio
      var slug = boutique.slug;
      if (updateData.nom_boutique && updateData.nom_boutique !== boutique.nom_boutique) {
        slug = generateUniqueSlug(updateData.nom_boutique);
      } else if (updateData.domaine_boutique && updateData.domaine_boutique !== boutique.domaine_boutique) {
        slug = generateUniqueSlug(updateData.domaine_boutique);
      }

      // Campos que se pueden actualizar (INCLUYENDO header_images)
      var updatableFields = {
        nom_boutique: updateData.nom_boutique,
        domaine_boutique: updateData.domaine_boutique,
        slug: slug,
        slogan_boutique: updateData.slogan_boutique,
        description_boutique: updateData.description_boutique,
        categorie: updateData.categorie,
        subCategory: subCategory,
        articleType: updateData.articleType,
        images: updateData.images,
        // ============ NUEVO: header_images ============
        header_images: updateData.header_images,
        plan: updateData.plan,
        duree_abonnement: updateData.duree_abonnement,
        date_debut: updateData.date_debut,
        proprietaire: updateData.proprietaire,
        reseaux_sociaux: updateData.reseaux_sociaux,
        couleur_theme: updateData.couleur_theme,
        offre_choisie: updateData.offre_choisie,
        duree_choisie: updateData.duree_choisie,
        montant_initial: updateData.montant_initial,
        mois_offerts: updateData.mois_offerts,
        montant_ttc: updateData.montant_ttc,
        methode_paiement: updateData.methode_paiement,
        updatedAt: Date.now()
      };

      // Eliminar undefined values de forma segura
      for (var key in updatableFields) {
        if (updatableFields.hasOwnProperty(key)) {
          if (updatableFields[key] === undefined) {
            delete updatableFields[key];
          }
        }
      }

      // Actualizar boutique
      var updatedBoutique = await Boutique.findByIdAndUpdate(
        id,
        updatableFields,
        { new: true, runValidators: true }
      ).populate('user', 'name username avatar email mobile');

      if (!updatedBoutique) {
        return res.status(404).json({
          success: false,
          message: 'Boutique non trouvée après mise à jour'
        });
      }

      console.log('✅ Boutique actualizada con éxito:', updatedBoutique._id);

      res.json({
        success: true,
        message: 'Boutique mise à jour avec succès!',
        boutique: updatedBoutique
      });

    } catch (error) {
      console.error('❌ Error en updateBoutique:', error);

      if (error.code === 11000) {
        if (error.keyPattern && error.keyPattern.domaine_boutique) {
          return res.status(400).json({ 
            success: false, 
            message: 'Ce domaine est déjà utilisé. Veuillez en choisir un autre.' 
          });
        }
        if (error.keyPattern && error.keyPattern.slug) {
          return res.status(400).json({ 
            success: false, 
            message: 'Erreur de création. Veuillez réessayer.' 
          });
        }
      }

      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  },

  getBoutique: async function(req, res) {
    try {
      var id = req.params.id;

      var boutique = await Boutique.findById(id)
        .populate('user', 'name username avatar email mobile')
        .lean();

      if (!boutique) {
        return res.status(404).json({ 
          success: false, 
          message: 'Boutique non trouvée' 
        });
      }

      res.json({
        success: true,
        boutique: boutique
      });

    } catch (error) {
      console.error('❌ Error en getBoutique:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la récupération de la boutique', 
        error: error.message 
      });
    }
  },

  getUserBoutiques: async function(req, res) {
    try {
      var user = req.user;

      var boutiques = await Boutique.find({ user: user._id })
        .sort({ createdAt: -1 })
        .lean();

      res.json({
        success: true,
        boutiques: boutiques
      });

    } catch (error) {
      console.error('❌ Error en getUserBoutiques:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la récupération des boutiques', 
        error: error.message 
      });
    }
  },

  deleteBoutique: async function(req, res) {
    try {
      var boutiqueId = req.params.boutiqueId;
      var user = req.user;

      var boutique = await Boutique.findById(boutiqueId);

      if (!boutique) {
        return res.status(404).json({
          success: false,
          message: 'Boutique non trouvée',
        });
      }

      if (boutique.user.toString() !== user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Non autorisé à supprimer cette boutique',
        });
      }

      await Boutique.findByIdAndDelete(boutiqueId);

      res.json({
        success: true,
        message: 'Boutique supprimée avec succès',
      });
    } catch (error) {
      console.error('❌ Error en deleteBoutique:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la suppression de la boutique',
        error: error.message,
      });
    }
  },

  verifyBoutique: async function(req, res) {
    try {
      var id = req.params.id;
      var verified = req.body.verified;

      var boutique = await Boutique.findByIdAndUpdate(
        id,
        { 
          isVerified: verified,
          updatedAt: Date.now()
        },
        { new: true }
      );

      if (!boutique) {
        return res.status(404).json({ 
          success: false, 
          message: 'Boutique non trouvée' 
        });
      }

      res.json({
        success: true,
        message: verified ? 'Boutique vérifiée avec succès' : 'Boutique non vérifiée',
        boutique: boutique
      });

    } catch (error) {
      console.error('❌ Error en verifyBoutique:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la vérification de la boutique', 
        error: error.message 
      });
    }
  },

  filterBoutiques: async function(req, res) {
    try {
      var page = parseInt(req.query.page) || 1;
      var limit = parseInt(req.query.limit) || 12;
      var skip = (page - 1) * limit;

      var categorySlug = req.query.category;
      var subSlug = req.query.sub;
      var wilaya = req.query.wilaya;
      var commune = req.query.commune;
      var minPrice = req.query.minPrice;
      var maxPrice = req.query.maxPrice;
      var sortBy = req.query.sortBy;

      // Validar categoría principal
      if (!categorySlug || categorySlug !== 'boutiques') {
        return res.status(400).json({ success: false, message: 'Categoría no válida' });
      }

      var categoryDoc = await Category.findOne({
        slug: 'boutiques',
        level: 1,
        isActive: true
      }).lean();

      if (!categoryDoc) {
        return res.status(404).json({ success: false, message: 'Categoría Boutiques no encontrada' });
      }

      // Construir filtro base
      var filter = { category: categoryDoc._id, isActive: true };

      // Filtrado por subcategoría
      if (subSlug && subSlug !== 'undefined' && subSlug !== 'null') {
        var subCategoryDoc = await Category.findOne({
          slug: subSlug,
          level: 2,
          parent: categoryDoc._id,
          isActive: true
        }).lean();

        if (subCategoryDoc) {
          var nombreOriginal = subCategoryDoc.name || '';
          var soloSlug = subCategoryDoc.slug || '';

          var variantes = [
            nombreOriginal,
            nombreOriginal.replace('Boutique ', '').replace("d'", '').trim(),
            nombreOriginal.toLowerCase(),
            soloSlug,
            soloSlug.replace(/-/g, ' ')
          ];
          
          // Filtrar variantes vacías
          variantes = variantes.filter(function(v) {
            return v && typeof v === 'string' && v.trim() !== '';
          });

          var orConditions = [];
          for (var i = 0; i < variantes.length; i++) {
            var v = variantes[i];
            var escaped = v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            orConditions.push({ categorie: { $regex: escaped, $options: 'i' } });
            orConditions.push({ subCategory: { $regex: escaped, $options: 'i' } });
          }

          // Eliminar duplicados
          var uniqueConditions = [];
          var seen = {};
          for (var j = 0; j < orConditions.length; j++) {
            var condStr = JSON.stringify(orConditions[j]);
            if (!seen[condStr]) {
              seen[condStr] = true;
              uniqueConditions.push(orConditions[j]);
            }
          }

          filter.$or = uniqueConditions;
        } else {
          var cleaned = subSlug.replace(/-/g, ' ');
          filter.$or = [
            { categorie: { $regex: cleaned, $options: 'i' } },
            { subCategory: { $regex: cleaned, $options: 'i' } }
          ];
        }
      }

      // Filtrado geográfico
      if (wilaya) {
        filter.wilaya = wilaya;
      }
      if (commune) {
        filter.commune = commune;
      }

      // Filtrado por precio
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) {
          filter.price.$gte = Number(minPrice);
        }
        if (maxPrice) {
          filter.price.$lte = Number(maxPrice);
        }
      }

      // Ordenamiento
      var sort = { createdAt: -1 };
      if (sortBy === 'priceAsc') {
        sort = { price: 1 };
      }
      if (sortBy === 'priceDesc') {
        sort = { price: -1 };
      }

      console.log('🎯 Filtro final:', JSON.stringify(filter, null, 2));
      console.log('📌 Ordenamiento:', sort);

      // Obtener boutiques
      var boutiques = await Boutique.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate('user', 'name username avatar email mobile')
        .lean();

      var total = await Boutique.countDocuments(filter);

      // Obtener subcategorías hijas para slider
      var children = await Category.find({
        parent: categoryDoc._id,
        level: 2,
        isActive: true
      })
        .select('_id name slug level emoji icon iconType iconColor bgColor')
        .sort({ order: 1 })
        .lean();

      // Añadir articles vacíos a cada child
      var childrenWithArticles = [];
      for (var k = 0; k < children.length; k++) {
        var child = children[k];
        child.articles = [];
        childrenWithArticles.push(child);
      }

      return res.json({
        success: true,
        boutiques: boutiques,
        total: total,
        page: page,
        limit: limit,
        hasMore: page * limit < total,
        totalPages: Math.ceil(total / limit),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalPosts: total,
          limit: limit,
          hasMore: page * limit < total
        },
        categoryInfo: {
          _id: categoryDoc._id,
          name: categoryDoc.name,
          slug: categoryDoc.slug,
          level: categoryDoc.level,
          emoji: categoryDoc.emoji || '',
          icon: categoryDoc.icon || '',
          iconType: categoryDoc.iconType || 'emoji',
          iconColor: categoryDoc.iconColor || '#8B5CF6',
          bgColor: categoryDoc.bgColor || '#EDE9FE'
        },
        children: childrenWithArticles
      });

    } catch (error) {
      console.error('❌ Error en filterBoutiques:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Error al filtrar boutiques', 
        error: error.message 
      });
    }
  },

  incrementBoutiqueView: async function(req, res) {
    try {
      var boutiqueId = req.params.boutiqueId;
      var boutique = await Boutique.findById(boutiqueId);

      if (!boutique) {
        return res.status(404).json({ 
          success: false, 
          message: 'Boutique non trouvée' 
        });
      }

      // Incrementar vistas de forma segura
      var currentVues = boutique.stats && boutique.stats.vues ? boutique.stats.vues : 0;
      
      if (!boutique.stats) {
        boutique.stats = {};
      }
      boutique.stats.vues = currentVues + 1;
      
      await boutique.save();

      res.json({
        success: true,
        stats: boutique.stats
      });
    } catch (err) {
      console.error('❌ Error en incrementBoutiqueView:', err);
      res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
  },

 // En boutiqueCtrl.js - updateBoutiqueHeaderImages
// ctrls/boutiqueCtrl.js - Versión mejorada con más logs

// controllers/boutiqueController.js

// controllers/boutiqueController.js

// controllers/boutiqueController.js

// ctrls/boutiqueCtrl.js - Versión corregida

updateBoutiqueHeaderImages: async function(req, res) {
  try {
    console.log('='.repeat(50));
    console.log('🖼️ INICIO updateBoutiqueHeaderImages');
    
    const boutiqueId = req.params.boutiqueId;
    // ✅ Aceptar tanto header_images como images (para compatibilidad)
    const headerImages = req.body.header_images || req.body.images || [];
    const user = req.user;

    console.log('📌 Datos recibidos:', {
      boutiqueId,
      headerImagesLength: headerImages.length,
      userId: user._id,
      source: req.body.header_images ? 'header_images' : (req.body.images ? 'images' : 'ninguno')
    });

    // Validaciones básicas
    if (!user) {
      console.error('❌ Usuario no autenticado');
      return res.status(401).json({ 
        success: false, 
        message: 'Utilisateur non authentifié' 
      });
    }

    if (!boutiqueId) {
      console.error('❌ ID de boutique no proporcionado');
      return res.status(400).json({ 
        success: false, 
        message: 'ID de boutique requis' 
      });
    }

    // Buscar boutique
    const boutique = await Boutique.findById(boutiqueId);
    if (!boutique) {
      console.error('❌ Boutique no encontrada:', boutiqueId);
      return res.status(404).json({ 
        success: false, 
        message: 'Boutique non trouvée' 
      });
    }

    // Verificar propiedad
    if (boutique.user.toString() !== user._id.toString()) {
      console.error('❌ Usuario no autorizado:', {
        boutiqueUser: boutique.user.toString(),
        currentUser: user._id.toString()
      });
      return res.status(403).json({ 
        success: false, 
        message: 'Non autorisé' 
      });
    }

    // Validar que sea array
    if (!Array.isArray(headerImages)) {
      console.error('❌ header_images no es un array:', typeof headerImages);
      return res.status(400).json({ 
        success: false, 
        message: 'header_images doit être un tableau' 
      });
    }

    // ✅ PROCESAR IMÁGENES: Si vienen con file (objetos con file), necesitamos extraer URLs
    // En este punto, las imágenes ya deberían estar subidas a Cloudinary por el frontend
    // Porque en la acción Redux ya se llamó a imageUpload antes de llegar aquí
    
    let finalHeaderImages = headerImages;
    
    // Si las imágenes vienen con file (no debería pasar porque ya se subieron en el frontend)
    // pero por si acaso, logueamos para debug
    const hasFiles = headerImages.some(img => img.file);
    if (hasFiles) {
      console.warn('⚠️ Las imágenes tienen objetos file - esto debería haberse subido antes');
      // Si tienen file, significa que el frontend no subió las imágenes
      // Deberíamos rechazar o subir aquí
      return res.status(400).json({
        success: false,
        message: 'Les images doivent être téléchargées avant d\'être envoyées au serveur'
      });
    }

    // ✅ Asegurar que cada imagen tenga el formato correcto
    finalHeaderImages = finalHeaderImages.map(img => {
      if (typeof img === 'string') {
        return { url: img, public_id: null };
      }
      return {
        url: img.url || img.secure_url,
        public_id: img.public_id || null,
        alt: img.alt || `Header image`
      };
    });

    console.log('📦 Guardando header_images:', finalHeaderImages.length);

    // ✅ ACTUALIZAR
    boutique.header_images = finalHeaderImages;
    boutique.updatedAt = Date.now();
    await boutique.save();

    console.log('✅ Guardado exitoso:', finalHeaderImages.length, 'imágenes');
    console.log('📋 URLs guardadas:', finalHeaderImages.map(img => img.url));

    res.json({
      success: true,
      message: 'Images mises à jour',
      header_images: boutique.header_images
    });

  } catch (error) {
    console.error('❌ Error en updateBoutiqueHeaderImages:', error);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Erreur serveur' 
    });
  }
},
  // ============ ELIMINAR IMAGEN DE HEADER (versión compatible con Node antiguo) ============
  deleteBoutiqueHeaderImage: async function(req, res) {
    try {
      var boutiqueId = req.params.boutiqueId;
      var imageId = req.params.imageId;
      var user = req.user;

      console.log('🗑️ Eliminando imagen de header:', { boutiqueId: boutiqueId, imageId: imageId });

      // Buscar la boutique
      var boutique = await Boutique.findById(boutiqueId);

      if (!boutique) {
        return res.status(404).json({ 
          success: false, 
          message: 'Boutique non trouvée' 
        });
      }

      // Verificar propiedad
      if (boutique.user.toString() !== user._id.toString()) {
        return res.status(403).json({ 
          success: false, 
          message: 'Non autorisé à modifier cette boutique' 
        });
      }

      // Buscar la imagen a eliminar
      var imageToDelete = null;
      for (var i = 0; i < boutique.header_images.length; i++) {
        var img = boutique.header_images[i];
        if (img._id.toString() === imageId || img.public_id === imageId) {
          imageToDelete = img;
          break;
        }
      }

      if (!imageToDelete) {
        return res.status(404).json({ 
          success: false, 
          message: 'Image non trouvée' 
        });
      }

      // Eliminar de Cloudinary si tiene public_id
      if (imageToDelete.public_id) {
        try {
          var cloudinary = require('cloudinary').v2;
          await cloudinary.uploader.destroy(imageToDelete.public_id);
        } catch (cloudinaryErr) {
          console.warn('⚠️ No se pudo eliminar de Cloudinary:', cloudinaryErr);
          // Continuamos aunque falle Cloudinary
        }
      }

      // Eliminar del array (filtrar manualmente)
      var newHeaderImages = [];
      for (var j = 0; j < boutique.header_images.length; j++) {
        var img = boutique.header_images[j];
        if (img._id.toString() !== imageId && img.public_id !== imageId) {
          newHeaderImages.push(img);
        }
      }
      
      boutique.header_images = newHeaderImages;
      boutique.updatedAt = Date.now();
      await boutique.save();

      console.log('✅ Imagen eliminada correctamente');

      res.json({
        success: true,
        message: 'Image supprimée avec succès',
        header_images: boutique.header_images
      });

    } catch (error) {
      console.error('❌ Error en deleteBoutiqueHeaderImage:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }
  }
};

module.exports = boutiqueCtrl;