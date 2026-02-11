// 📂 controllers/boutiqueCtrl.js
const Boutique = require('../models/boutiqueModel');
const Post = require('../models/postModel');

 
const boutiqueCtrl = {
  // 📄 CREAR BOUTIQUE - VERSIÓN SIMPLIFICADA
  createBoutique: async (req, res) => {
    try {
      console.log('📦 Request body recibido:', req.body);
      console.log('👤 Usuario autenticado:', req.user._id);
      
      // Desestructurar todos los campos
      const {
        nom_boutique,
        domaine_boutique,
        slogan_boutique,
        description_boutique,
        categories_produits,
        proprietaire,
        reseaux_sociaux,
        couleur_theme,
        plan,
        duree_abonnement,
        logo, // URL de Cloudinary enviada desde el frontend
        user
      } = req.body;

      console.log('📊 Datos recibidos:', {
        nom_boutique,
        domaine_boutique,
        plan,
        hasLogo: !!logo,
        user,
        proprietaire: proprietaire ? 'Sí' : 'No'
      });

      // Validaciones básicas
      if (!nom_boutique || !domaine_boutique) {
        console.log('❌ Campos requeridos faltantes');
        return res.status(400).json({
          msg: "Le nom et le domaine de la boutique sont requis"
        });
      }

      // Verificar si el dominio ya existe
      const existingBoutique = await Boutique.findOne({ 
        domaine_boutique: domaine_boutique.toLowerCase().trim() 
      });
      
      if (existingBoutique) {
        console.log('❌ Dominio ya existe:', domaine_boutique);
        return res.status(400).json({
          msg: "Ce domaine de boutique est déjà utilisé"
        });
      }

      // Parsear campos JSON si vienen como string
      let parsedCategories = [];
      let parsedProprietaire = {};
      let parsedReseaux = {};
      
      try {
        if (categories_produits) {
          parsedCategories = typeof categories_produits === 'string' 
            ? JSON.parse(categories_produits) 
            : categories_produits;
        }
        
        if (proprietaire) {
          parsedProprietaire = typeof proprietaire === 'string'
            ? JSON.parse(proprietaire)
            : proprietaire;
        }
        
        if (reseaux_sociaux) {
          parsedReseaux = typeof reseaux_sociaux === 'string'
            ? JSON.parse(reseaux_sociaux)
            : reseaux_sociaux;
        }
      } catch (parseErr) {
        console.error('❌ Error parseando JSON:', parseErr);
        // Continuar con valores por defecto
      }

      // Preparar datos del logo
      let logoData = null;
      if (logo) {
        logoData = {
          url: logo.url || logo,
          public_id: logo.public_id || null
        };
      }

      // Crear objeto de boutique
      const boutiqueData = {
        nom_boutique: nom_boutique.trim(),
        domaine_boutique: domaine_boutique.toLowerCase().trim(),
        slogan_boutique: (slogan_boutique || '').trim(),
        description_boutique: (description_boutique || '').trim(),
        categories_produits: parsedCategories,
        proprietaire: {
          nom: parsedProprietaire.nom || req.user.fullname || req.user.username || '',
          email: parsedProprietaire.email || req.user.email || '',
          telephone: parsedProprietaire.telephone || req.user.phone || '',
          wilaya: parsedProprietaire.wilaya || '',
          adresse: parsedProprietaire.adresse || ''
        },
        reseaux_sociaux: parsedReseaux,
        couleur_theme: couleur_theme || '#2563eb',
        plan: plan || 'gratuit',
        duree_abonnement: duree_abonnement || '1mois',
        accepte_conditions: true,
        user: user || req.user._id,
        logo: logoData,
        status: 'pending' // Estado por defecto
      };

      console.log('✅ Datos finales para crear boutique:', {
        nom_boutique: boutiqueData.nom_boutique,
        domaine_boutique: boutiqueData.domaine_boutique,
        plan: boutiqueData.plan,
        proprietaire: boutiqueData.proprietaire
      });

      // Crear y guardar boutique
      const boutique = new Boutique(boutiqueData);
      await boutique.save();

      console.log('✅ Boutique creada exitosamente:', boutique._id);

      res.status(201).json({
        msg: 'Boutique créée avec succès! Elle sera évaluée par nos administrateurs.',
        boutique: boutique
      });

    } catch (err) {
      console.error('❌ Error en createBoutique:', err.message);
      console.error('Stack trace:', err.stack);
      
      // Manejar errores de validación de Mongoose
      if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
          msg: messages.join(', ')
        });
      }
      
      // Manejar errores de duplicado
      if (err.code === 11000) {
        return res.status(400).json({
          msg: "Ce domaine de boutique est déjà utilisé"
        });
      }
      
      return res.status(500).json({ 
        msg: err.message || 'Erreur interne du serveur' 
      });
    }
  },

  // ... resto de funciones se mantienen igual
 
  // 📄 OBTENER BOUTIQUES
  getBoutiques: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const status = req.query.status || 'active';
      const skip = (page - 1) * limit;

      const filter = {
        status: status,
        isActive: true
      };

      // Si el usuario NO es admin, filtrar solo sus boutiques
      if (req.user && req.user.role !== 'admin') {
        filter.user = req.user._id;
      }

      const boutiques = await Boutique.find(filter)
        .populate('user', 'username avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Boutique.countDocuments(filter);

      res.json({
        msg: 'Success!',
        result: boutiques.length,
        total: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        boutiques: boutiques
      });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // 📄 OBTENER BOUTIQUE POR DOMINIO
  getBoutiqueByDomain: async (req, res) => {
    try {
      const domaine = req.params.domaine;

      const boutique = await Boutique.findOne({
        domaine_boutique: domaine,
        status: 'active',
        isActive: true
      }).populate('user', 'username avatar fullname');

      if (!boutique) {
        return res.status(404).json({
          msg: 'Boutique non trouvée'
        });
      }

      // Obtener productos de la boutique
      const produits = await Post.find({
        boutique: boutique._id,
        isActive: true
      })
      .populate('user', 'avatar username')
      .sort({ createdAt: -1 })
      .limit(20);

      // Incrementar vistas
      boutique.vues += 1;
      await boutique.save();

      res.json({
        msg: 'Success!',
        boutique: boutique,
        produits: produits,
        produits_count: produits.length
      });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // 📄 OBTENER BOUTIQUE POR ID
  getBoutique: async (req, res) => {
    try {
      const boutique = await Boutique.findById(req.params.id)
        .populate('user', 'username avatar email phone');

      if (!boutique) {
        return res.status(404).json({
          msg: 'Boutique non trouvée'
        });
      }

      // Verificar permisos (solo dueño o admin)
      if (req.user) {
        const isOwner = boutique.user && boutique.user._id && 
                       boutique.user._id.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        
        if (!isOwner && !isAdmin) {
          return res.status(403).json({
            msg: 'Accès non autorisé'
          });
        }
      }

      res.json({
        msg: 'Success!',
        boutique: boutique
      });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // 📄 ACTUALIZAR BOUTIQUE
  updateBoutique: async (req, res) => {
    try {
      const boutique = await Boutique.findById(req.params.id);

      if (!boutique) {
        return res.status(404).json({
          msg: 'Boutique non trouvée'
        });
      }

      // Verificar permisos
      if (req.user) {
        const isOwner = boutique.user && boutique.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        
        if (!isOwner && !isAdmin) {
          return res.status(403).json({
            msg: 'Accès non autorisé'
          });
        }
      }

      // No permitir cambiar dominio si ya está en uso
      if (req.body.domaine_boutique && 
          req.body.domaine_boutique !== boutique.domaine_boutique) {
        const existing = await Boutique.findOne({ 
          domaine_boutique: req.body.domaine_boutique 
        });
        if (existing) {
          return res.status(400).json({
            msg: 'Ce domaine est déjà utilisé'
          });
        }
      }

      // Manejar logo (si viene de Cloudinary)
      if (req.body.logo) {
        if (typeof req.body.logo === 'string') {
          req.body.logo = {
            url: req.body.logo,
            public_id: null
          };
        }
      }

      // Actualizar
      const updatedBoutique = await Boutique.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      res.json({
        msg: 'Boutique mise à jour avec succès!',
        boutique: updatedBoutique
      });

    } catch (err) {
      console.error('Error en updateBoutique:', err);
      return res.status(500).json({ msg: err.message });
    }
  },

  // 📄 CAMBIAR ESTADO DE BOUTIQUE (Admin)
  updateBoutiqueStatus: async (req, res) => {
    try {
      // Solo admin
      if (req.user && req.user.role !== 'admin') {
        return res.status(403).json({
          msg: 'Accès réservé aux administrateurs'
        });
      }

      const status = req.body.status;

      const boutique = await Boutique.findByIdAndUpdate(
        req.params.id,
        { status: status },
        { new: true, runValidators: true }
      );

      if (!boutique) {
        return res.status(404).json({
          msg: 'Boutique non trouvée'
        });
      }

      res.json({
        msg: 'Boutique ' + status + ' avec succès!',
        boutique: boutique
      });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // 📄 ELIMINAR BOUTIQUE (soft delete)
  deleteBoutique: async (req, res) => {
    try {
      const boutique = await Boutique.findById(req.params.id);

      if (!boutique) {
        return res.status(404).json({
          msg: 'Boutique non trouvée'
        });
      }

      // Verificar permisos
      if (req.user) {
        const isOwner = boutique.user && boutique.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        
        if (!isOwner && !isAdmin) {
          return res.status(403).json({
            msg: 'Accès non autorisé'
          });
        }
      }

      // Soft delete
      boutique.isActive = false;
      await boutique.save();

      // También desactivar productos relacionados
      await Post.updateMany(
        { boutique: boutique._id },
        { isActive: false }
      );

      res.json({
        msg: 'Boutique supprimée avec succès!'
      });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // 📄 OBTENER PRODUCTOS DE BOUTIQUE
  getBoutiqueProducts: async (req, res) => {
    try {
      const id = req.params.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const skip = (page - 1) * limit;

      const boutique = await Boutique.findOne({
        _id: id,
        status: 'active',
        isActive: true
      });

      if (!boutique) {
        return res.status(404).json({
          msg: 'Boutique non trouvée'
        });
      }

      const produits = await Post.find({
        boutique: boutique._id,
        isActive: true
      })
      .populate('user', 'avatar username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

      const total = await Post.countDocuments({
        boutique: boutique._id,
        isActive: true
      });

      res.json({
        msg: 'Success!',
        boutique: {
          _id: boutique._id,
          nom_boutique: boutique.nom_boutique,
          domaine_boutique: boutique.domaine_boutique,
          logo: boutique.logo
        },
        produits: produits,
        total: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // 📄 OBTENER BOUTIQUES DE USUARIO
  getUserBoutiques: async (req, res) => {
    try {
      const userId = req.user ? req.user._id : req.params.userId;
      
      if (!userId) {
        return res.status(400).json({
          msg: 'ID utilisateur requis'
        });
      }

      const boutiques = await Boutique.find({
        user: userId,
        isActive: true
      })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });

      res.json({
        msg: 'Success!',
        boutiques: boutiques,
        count: boutiques.length
      });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // 📄 AGREGAR PRODUCTO A BOUTIQUE
  addBoutiqueProduct: async (req, res) => {
    try {
      const { boutiqueId } = req.params;
      const { productId } = req.body;

      const boutique = await Boutique.findById(boutiqueId);
      if (!boutique) {
        return res.status(404).json({ msg: 'Boutique non trouvée' });
      }

      // Verificar permisos
      if (req.user) {
        const isOwner = boutique.user && boutique.user.toString() === req.user._id.toString();
        if (!isOwner) {
          return res.status(403).json({ msg: 'Accès non autorisé' });
        }
      }

      const product = await Post.findById(productId);
      if (!product) {
        return res.status(404).json({ msg: 'Produit non trouvé' });
      }

      // Asignar producto a la boutique
      product.boutique = boutique._id;
      await product.save();

      res.json({
        msg: 'Produit ajouté à la boutique avec succès!',
        product: product
      });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // 📄 REMOVER PRODUCTO DE BOUTIQUE
  removeBoutiqueProduct: async (req, res) => {
    try {
      const { boutiqueId } = req.params;
      const { productId } = req.body;

      const boutique = await Boutique.findById(boutiqueId);
      if (!boutique) {
        return res.status(404).json({ msg: 'Boutique non trouvée' });
      }

      // Verificar permisos
      if (req.user) {
        const isOwner = boutique.user && boutique.user.toString() === req.user._id.toString();
        if (!isOwner) {
          return res.status(403).json({ msg: 'Accès non autorisé' });
        }
      }

      const product = await Post.findById(productId);
      if (!product) {
        return res.status(404).json({ msg: 'Produit non trouvé' });
      }

      // Remover referencia a la boutique
      product.boutique = null;
      await product.save();

      res.json({
        msg: 'Produit retiré de la boutique avec succès!',
        product: product
      });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // 📄 ESTADÍSTICAS DE BOUTIQUE
  getBoutiqueStats: async (req, res) => {
    try {
      const { id } = req.params;

      const boutique = await Boutique.findById(id);
      if (!boutique) {
        return res.status(404).json({ msg: 'Boutique non trouvée' });
      }

      // Verificar permisos
      if (req.user) {
        const isOwner = boutique.user && boutique.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) {
          return res.status(403).json({ msg: 'Accès non autorisé' });
        }
      }

      // Obtener estadísticas
      const totalProducts = await Post.countDocuments({ 
        boutique: boutique._id,
        isActive: true 
      });

      const recentProducts = await Post.find({ 
        boutique: boutique._id,
        isActive: true 
      })
      .sort({ createdAt: -1 })
      .limit(5);

      const stats = {
        vues: boutique.vues || 0,
        totalProducts: totalProducts,
        recentProducts: recentProducts,
        createdAt: boutique.createdAt,
        status: boutique.status,
        plan: boutique.plan
      };

      res.json({
        msg: 'Success!',
        stats: stats
      });

    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
};

module.exports = boutiqueCtrl;