// 📂 controllers/boutiqueCtrl.js
const Boutique = require('../models/boutiqueModel');
const Post = require('../models/postModel');
const Category = require('../models/categoryModel');

const boutiqueCtrl = {
  // 📄 CREAR BOUTIQUE - VERSIÓN CORREGIDA
 // 🔥 En tu controlador - asegurar que categories_produits tenga la estructura correcta
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
      categorySlugs,
      categorie_boutique,
      duree,
      offre,
      plan,
      duree_abonnement,
      proprietaire,
      reseaux_sociaux,
      couleur_theme,
      logo,
      montant_initial,
      mois_offerts,
      montant_ttc,
      methode_paiement,
      client_nom,
      client_telephone,
      accepte_conditions,
      user
    } = req.body;

    // Validaciones básicas
    if (!nom_boutique || !domaine_boutique) {
      return res.status(400).json({
        msg: "Le nom et le domaine de la boutique sont requis"
      });
    }

    // Verificar si el dominio ya existe
    const existingBoutique = await Boutique.findOne({ 
      domaine_boutique: domaine_boutique.toLowerCase().trim() 
    });
    
    if (existingBoutique) {
      return res.status(400).json({
        msg: "Ce domaine de boutique est déjà utilisé"
      });
    }

    // 🔥 CORREGIDO: Parsear categorías SIN CAMPOS EXTRA
    let parsedCategories = [];
    let parsedCategorySlugs = [];
    
    try {
      if (categories_produits) {
        parsedCategories = typeof categories_produits === 'string' 
          ? JSON.parse(categories_produits) 
          : categories_produits;
      }
      
      if (categorySlugs) {
        parsedCategorySlugs = typeof categorySlugs === 'string'
          ? JSON.parse(categorySlugs)
          : categorySlugs;
      }
    } catch (parseErr) {
      console.error('❌ Error parseando JSON:', parseErr);
    }

    // 🔥 Validar que haya al menos una categoría
    if (!parsedCategories || parsedCategories.length === 0) {
      return res.status(400).json({
        msg: "Vous devez sélectionner au moins une catégorie de produits"
      });
    }

    // 🔥 CORREGIDO: NO añadir campos que no existen
    const categoriesWithEmojis = parsedCategories.map(cat => ({
      level1: cat.level1,
      level1Name: cat.level1Name,
      level1Emoji: cat.level1Emoji || '📦',
      level2: cat.level2 || null,
      level2Name: cat.level2Name || null,
      level2Emoji: cat.level2Emoji || null,
      level3: cat.level3 || null,
      level3Name: cat.level3Name || null,
      level3Emoji: cat.level3Emoji || null,
      fullPath: cat.fullPath,
      displayPath: cat.displayPath,
      level: cat.level || 1
      // ❌ NO incluir cachedName, categoryId, etc.
    }));

    // Parsear otros campos
    let parsedProprietaire = {};
    let parsedReseaux = {};
    
    try {
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
    }

    // Crear objeto de boutique
    const boutiqueData = {
      // STEP 1
      nom_boutique: nom_boutique.trim(),
      domaine_boutique: domaine_boutique.toLowerCase().trim(),
      slogan_boutique: (slogan_boutique || '').trim(),
      description_boutique: (description_boutique || '').trim(),
      date_debut: req.body.date_debut || new Date(),
      
      // 🔥 STEP 2 - CATEGORÍAS (SOLO campos que existen)
      categories_produits: categoriesWithEmojis,
      categorySlugs: parsedCategorySlugs,
      categorie_boutique: categorie_boutique || '',
      duree: duree || '1',
      offre: offre || 'Store Basic 50',
      plan: plan || 'gratuit',
      duree_abonnement: duree_abonnement || '1mois',
      
      // STEP 3
      proprietaire: {
        nom: parsedProprietaire.nom || req.user.name || '',
        email: parsedProprietaire.email || req.user.email || '',
        telephone: parsedProprietaire.telephone || req.user.mobile || '',
        wilaya: parsedProprietaire.wilaya || '',
        adresse: parsedProprietaire.adresse || ''
      },
      reseaux_sociaux: {
        facebook: parsedReseaux.facebook || '',
        instagram: parsedReseaux.instagram || '',
        tiktok: parsedReseaux.tiktok || '',
        whatsapp: parsedReseaux.whatsapp || '',
        website: parsedReseaux.website || ''
      },
      couleur_theme: couleur_theme || '#2563eb',
      
      // STEP 4
      montant_initial: montant_initial || 0,
      mois_offerts: mois_offerts || 0,
      montant_ttc: montant_ttc || 0,
      methode_paiement: methode_paiement || '',
      client_nom: client_nom || parsedProprietaire.nom || req.user.name || '',
      client_telephone: client_telephone || parsedProprietaire.telephone || req.user.mobile || '',
      accepte_conditions: accepte_conditions === true,
      
      // Logo (opcional)
      ...(logo && {
        logo: {
          url: logo.url || logo,
          public_id: logo.public_id || null
        }
      }),
      
      // Metadatos
      user: user || req.user._id,
      statut: 'en_attente'
    };

    console.log('✅ Datos finales para crear boutique:', {
      nom_boutique: boutiqueData.nom_boutique,
      domaine_boutique: boutiqueData.domaine_boutique,
      plan: boutiqueData.plan,
      categories_count: boutiqueData.categories_produits.length,
      statut: boutiqueData.statut
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
    
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ msg: messages.join(', ') });
    }
    
    if (err.code === 11000) {
      return res.status(400).json({ msg: "Ce domaine de boutique est déjà utilisé" });
    }
    
    return res.status(500).json({ msg: err.message || 'Erreur interne du serveur' });
  }
},

  // 🔥 NUEVO: OBTENER BOUTIQUES POR CATEGORÍA DE PRODUCTOS
  getBoutiquesByCategory: async (req, res) => {
    try {
      const { category, sub, article, page = 1, limit = 12 } = req.query;
      
      console.log('🔍 Buscando boutiques por categoría:', { category, sub, article, page, limit });
      
      let query = { 
        statut: 'active', 
        isActive: true 
      };
      
      // Construir el path de búsqueda
      let searchPath = '';
      if (category) searchPath = category;
      if (sub) searchPath = `${category}/${sub}`;
      if (article) searchPath = `${category}/${sub}/${article}`;
      
      if (searchPath) {
        // Buscar en categories_produits.fullPath
        query['categories_produits.fullPath'] = { 
          $regex: searchPath, 
          $options: 'i' 
        };
        
        // También buscar en categorySlugs
        const slugs = searchPath.split('/');
        const $or = [
          { 'categories_produits.fullPath': { $regex: searchPath, $options: 'i' } },
          { categorySlugs: { $in: slugs } }
        ];
        
        query = { 
          $and: [
            { statut: 'active', isActive: true },
            { $or }
          ]
        };
      }
      
      const skip = (parseInt(page) - 1) * parseInt(limit);
      
      const boutiques = await Boutique.find(query)
        .populate('user', 'username avatar email')
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });
        
      const total = await Boutique.countDocuments(query);
      
      console.log(`✅ Encontradas ${boutiques.length} boutiques (total: ${total})`);
      
      res.json({
        success: true,
        boutiques,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        hasMore: skip + boutiques.length < total
      });
      
    } catch (error) {
      console.error('❌ Error en getBoutiquesByCategory:', error);
      res.status(500).json({ success: false, msg: error.message });
    }
  },

  // 🔥 NUEVO: OBTENER BOUTIQUE POR ID (PÚBLICO)
  getBoutiqueById: async (req, res) => {
    try {
      const boutique = await Boutique.findById(req.params.id)
        .populate('user', 'username avatar email phone');
      
      if (!boutique) {
        return res.status(404).json({ 
          success: false, 
          msg: 'Boutique non trouvée' 
        });
      }
      
      // Si está pendiente, solo el dueño o admin puede verla
      if (boutique.statut !== 'active') {
        if (req.user) {
          const isOwner = boutique.user && 
                         boutique.user._id.toString() === req.user._id.toString();
          const isAdmin = req.user.role === 'admin';
          
          if (!isOwner && !isAdmin) {
            return res.status(403).json({ 
              success: false, 
              msg: 'Cette boutique est en attente de validation' 
            });
          }
        } else {
          return res.status(403).json({ 
            success: false, 
            msg: 'Cette boutique est en attente de validation' 
          });
        }
      }
      
      // Incrementar vistas
      boutique.vues = (boutique.vues || 0) + 1;
      await boutique.save();
      
      res.json({ 
        success: true, 
        boutique 
      });
      
    } catch (error) {
      console.error('❌ Error en getBoutiqueById:', error);
      res.status(500).json({ success: false, msg: error.message });
    }
  },

  // 🔥 NUEVO: OBTENER BOUTIQUE POR DOMINIO (PÚBLICO)
  getBoutiqueByDomain: async (req, res) => {
    try {
      const domaine = req.params.domaine;
      
      const boutique = await Boutique.findOne({ 
        domaine_boutique: domaine,
        isActive: true 
      }).populate('user', 'username avatar email phone');
      
      if (!boutique) {
        return res.status(404).json({ 
          success: false, 
          msg: 'Boutique non trouvée' 
        });
      }
      
      // Si está pendiente, solo el dueño o admin puede verla
      if (boutique.statut !== 'active') {
        if (req.user) {
          const isOwner = boutique.user && 
                         boutique.user._id.toString() === req.user._id.toString();
          const isAdmin = req.user.role === 'admin';
          
          if (!isOwner && !isAdmin) {
            return res.status(403).json({ 
              success: false, 
              msg: 'Cette boutique est en attente de validation' 
            });
          }
        } else {
          return res.status(403).json({ 
            success: false, 
            msg: 'Cette boutique est en attente de validation' 
          });
        }
      }
      
      // Incrementar vistas
      boutique.vues = (boutique.vues || 0) + 1;
      await boutique.save();
      
      res.json({ 
        success: true, 
        boutique 
      });
      
    } catch (error) {
      console.error('❌ Error en getBoutiqueByDomain:', error);
      res.status(500).json({ success: false, msg: error.message });
    }
  },

  // 📄 OBTENER BOUTIQUES DE USUARIO
  getUserBoutiques: async (req, res) => {
    try {
      const userId = req.params.userId || req.user._id;
      
      if (!userId) {
        return res.status(400).json({ 
          success: false, 
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
        success: true, 
        boutiques,
        count: boutiques.length 
      });
      
    } catch (error) {
      console.error('❌ Error en getUserBoutiques:', error);
      res.status(500).json({ success: false, msg: error.message });
    }
  },

  // 📄 OBTENER PRODUCTOS DE BOUTIQUE
  getBoutiqueProducts: async (req, res) => {
    try {
      const { id } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const skip = (page - 1) * limit;
      
      const boutique = await Boutique.findOne({
        _id: id,
        statut: 'active',
        isActive: true
      });
      
      if (!boutique) {
        return res.status(404).json({ 
          success: false, 
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
        success: true,
        boutique: {
          _id: boutique._id,
          nom_boutique: boutique.nom_boutique,
          domaine_boutique: boutique.domaine_boutique,
          logo: boutique.logo
        },
        produits,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      });
      
    } catch (error) {
      console.error('❌ Error en getBoutiqueProducts:', error);
      res.status(500).json({ success: false, msg: error.message });
    }
  },

  // 📄 ACTUALIZAR BOUTIQUE
  updateBoutique: async (req, res) => {
    try {
      const boutique = await Boutique.findById(req.params.id);
      
      if (!boutique) {
        return res.status(404).json({ 
          success: false, 
          msg: 'Boutique non trouvée' 
        });
      }
      
      // Verificar permisos
      if (req.user) {
        const isOwner = boutique.user && 
                       boutique.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        
        if (!isOwner && !isAdmin) {
          return res.status(403).json({ 
            success: false, 
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
            success: false, 
            msg: 'Ce domaine est déjà utilisé' 
          });
        }
      }
      
      // Manejar logo
      if (req.body.logo) {
        req.body.logo = typeof req.body.logo === 'string'
          ? { url: req.body.logo, public_id: null }
          : req.body.logo;
      }
      
      // Si es admin cambiando el estado
      if (req.user.role === 'admin' && req.body.statut) {
        boutique.statut = req.body.statut;
      }
      
      // Actualizar campos
      const updatableFields = [
        'nom_boutique', 'slogan_boutique', 'description_boutique',
        'categories_produits', 'categorySlugs', 'categorie_boutique',
        'proprietaire', 'reseaux_sociaux', 'couleur_theme', 'logo'
      ];
      
      updatableFields.forEach(field => {
        if (req.body[field] !== undefined) {
          boutique[field] = req.body[field];
        }
      });
      
      await boutique.save();
      
      res.json({ 
        success: true, 
        msg: 'Boutique mise à jour avec succès!',
        boutique 
      });
      
    } catch (error) {
      console.error('❌ Error en updateBoutique:', error);
      res.status(500).json({ success: false, msg: error.message });
    }
  },

  // 📄 CAMBIAR ESTADO DE BOUTIQUE (SOLO ADMIN)
  updateBoutiqueStatus: async (req, res) => {
    try {
      // Solo admin
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ 
          success: false, 
          msg: 'Accès réservé aux administrateurs' 
        });
      }
      
      const { statut } = req.body;
      
      if (!['en_attente', 'active', 'suspendue', 'rejetee'].includes(statut)) {
        return res.status(400).json({ 
          success: false, 
          msg: 'Statut invalide' 
        });
      }
      
      const boutique = await Boutique.findByIdAndUpdate(
        req.params.id,
        { statut },
        { new: true, runValidators: true }
      );
      
      if (!boutique) {
        return res.status(404).json({ 
          success: false, 
          msg: 'Boutique non trouvée' 
        });
      }
      
      res.json({ 
        success: true, 
        msg: `Boutique ${statut === 'active' ? 'activée' : statut} avec succès!`,
        boutique 
      });
      
    } catch (error) {
      console.error('❌ Error en updateBoutiqueStatus:', error);
      res.status(500).json({ success: false, msg: error.message });
    }
  },

  // 📄 ELIMINAR BOUTIQUE (SOFT DELETE)
  deleteBoutique: async (req, res) => {
    try {
      const boutique = await Boutique.findById(req.params.id);
      
      if (!boutique) {
        return res.status(404).json({ 
          success: false, 
          msg: 'Boutique non trouvée' 
        });
      }
      
      // Verificar permisos
      if (req.user) {
        const isOwner = boutique.user && 
                       boutique.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        
        if (!isOwner && !isAdmin) {
          return res.status(403).json({ 
            success: false, 
            msg: 'Accès non autorisé' 
          });
        }
      }
      
      // Soft delete
      boutique.isActive = false;
      await boutique.save();
      
      // Desactivar productos relacionados
      await Post.updateMany(
        { boutique: boutique._id },
        { isActive: false }
      );
      
      res.json({ 
        success: true, 
        msg: 'Boutique supprimée avec succès!' 
      });
      
    } catch (error) {
      console.error('❌ Error en deleteBoutique:', error);
      res.status(500).json({ success: false, msg: error.message });
    }
  },

  // 📄 ESTADÍSTICAS DE BOUTIQUE
  getBoutiqueStats: async (req, res) => {
    try {
      const { id } = req.params;
      
      const boutique = await Boutique.findById(id);
      
      if (!boutique) {
        return res.status(404).json({ 
          success: false, 
          msg: 'Boutique non trouvée' 
        });
      }
      
      // Verificar permisos
      if (req.user) {
        const isOwner = boutique.user && 
                       boutique.user.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';
        
        if (!isOwner && !isAdmin) {
          return res.status(403).json({ 
            success: false, 
            msg: 'Accès non autorisé' 
          });
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
        totalProducts,
        recentProducts,
        createdAt: boutique.createdAt,
        statut: boutique.statut,
        plan: boutique.plan
      };
      
      res.json({ 
        success: true, 
        stats 
      });
      
    } catch (error) {
      console.error('❌ Error en getBoutiqueStats:', error);
      res.status(500).json({ success: false, msg: error.message });
    }
  },

  // 📄 AGREGAR PRODUCTO A BOUTIQUE
  addBoutiqueProduct: async (req, res) => {
    try {
      const { boutiqueId } = req.params;
      const { productId } = req.body;
      
      const boutique = await Boutique.findById(boutiqueId);
      if (!boutique) {
        return res.status(404).json({ 
          success: false, 
          msg: 'Boutique non trouvée' 
        });
      }
      
      // Verificar permisos
      if (req.user) {
        const isOwner = boutique.user && 
                       boutique.user.toString() === req.user._id.toString();
        if (!isOwner) {
          return res.status(403).json({ 
            success: false, 
            msg: 'Accès non autorisé' 
          });
        }
      }
      
      const product = await Post.findById(productId);
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          msg: 'Produit non trouvé' 
        });
      }
      
      // Asignar producto a la boutique
      product.boutique = boutique._id;
      await product.save();
      
      // Incrementar contador de productos
      boutique.productCount = (boutique.productCount || 0) + 1;
      await boutique.save();
      
      res.json({ 
        success: true, 
        msg: 'Produit ajouté à la boutique avec succès!',
        product 
      });
      
    } catch (error) {
      console.error('❌ Error en addBoutiqueProduct:', error);
      res.status(500).json({ success: false, msg: error.message });
    }
  },

  // 📄 REMOVER PRODUCTO DE BOUTIQUE
  removeBoutiqueProduct: async (req, res) => {
    try {
      const { boutiqueId } = req.params;
      const { productId } = req.body;
      
      const boutique = await Boutique.findById(boutiqueId);
      if (!boutique) {
        return res.status(404).json({ 
          success: false, 
          msg: 'Boutique non trouvée' 
        });
      }
      
      // Verificar permisos
      if (req.user) {
        const isOwner = boutique.user && 
                       boutique.user.toString() === req.user._id.toString();
        if (!isOwner) {
          return res.status(403).json({ 
            success: false, 
            msg: 'Accès non autorisé' 
          });
        }
      }
      
      const product = await Post.findById(productId);
      if (!product) {
        return res.status(404).json({ 
          success: false, 
          msg: 'Produit non trouvé' 
        });
      }
      
      // Remover referencia a la boutique
      product.boutique = null;
      await product.save();
      
      // Decrementar contador de productos
      boutique.productCount = Math.max(0, (boutique.productCount || 0) - 1);
      await boutique.save();
      
      res.json({ 
        success: true, 
        msg: 'Produit retiré de la boutique avec succès!',
        product 
      });
      
    } catch (error) {
      console.error('❌ Error en removeBoutiqueProduct:', error);
      res.status(500).json({ success: false, msg: error.message });
    }
  }
};

module.exports = boutiqueCtrl;