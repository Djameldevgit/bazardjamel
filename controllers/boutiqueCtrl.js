// ctrls/boutiqueCtrl.js
 
const Boutique = require('../models/boutiqueModel');
 
const Category = require('../models/categoryModel');
const boutiqueCtrl = {
 
  // ==================== CREAR BOUTIQUE ====================
  // controllers/boutiqueController.js

createBoutique: async (req, res) => {
  try {
    // Los datos vienen directamente en req.body
    const boutiqueData = req.body;
    const user = req.user;
    
    console.log('📦 Creando boutique para usuario:', user._id);
    console.log('📦 Datos recibidos:', {
      nom_boutique: boutiqueData.nom_boutique,
      categorie: boutiqueData.categorie,
      hasAvatar: !!boutiqueData.avatar
    });

    // Validaciones básicas
    if (!boutiqueData.nom_boutique) {
      return res.status(400).json({ 
        success: false, 
        message: 'Le nom de la boutique est obligatoire' 
      });
    }

    if (!boutiqueData.categorie) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vous devez sélectionner une catégorie' 
      });
    }

    // Verificar dominio único
    if (boutiqueData.domaine_boutique) {
      const existing = await Boutique.findOne({ 
        domaine_boutique: boutiqueData.domaine_boutique 
      });
      if (existing) {
        return res.status(400).json({ 
          success: false, 
          message: 'Ce domaine est déjà utilisé' 
        });
      }
    }

    // Buscar categoría Boutiques
    const boutiquesCategory = await Category.findOne({ 
      slug: 'boutiques', 
      level: 1 
    });

    if (!boutiquesCategory) {
      return res.status(500).json({ 
        success: false, 
        message: 'Catégorie Boutiques non trouvée' 
      });
    }

    // Crear la boutique (avatar ya viene procesado)
    const newBoutique = new Boutique({
      user: user._id,
      categorie: boutiqueData.categorie,
      subCategory: boutiqueData.subCategory || boutiqueData.categorie,
      articleType: boutiqueData.articleType || '',
      category: boutiquesCategory._id,
      nom_boutique: boutiqueData.nom_boutique,
      domaine_boutique: boutiqueData.domaine_boutique,
      slogan_boutique: boutiqueData.slogan_boutique || '',
      description_boutique: boutiqueData.description_boutique,
      avatar: boutiqueData.avatar, // Tal como llega de la acción
      plan: boutiqueData.plan || 'gratuit',
      duree_abonnement: boutiqueData.duree_abonnement || '1mois',
      date_debut: boutiqueData.date_debut || new Date(),
      categories_produits: boutiqueData.categories_produits || [],
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

    await newBoutique.save();

    res.status(201).json({
      success: true,
      message: 'Boutique créée avec succès!',
      boutique: newBoutique
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
},
  // ==================== ACTUALIZAR BOUTIQUE ====================
  updateBoutique: async (req, res) => {
    try {
      const id = req.params.id;
      const { boutiqueData } = req.body;
      const user = req.user;
      
      const boutique = await Boutique.findById(id);
      
      if (!boutique) {
        return res.status(404).json({ 
          success: false, 
          message: 'Boutique non trouvée' 
        });
      }
      
      if (boutique.user.toString() !== user._id.toString()) {
        return res.status(403).json({ 
          success: false, 
          message: 'Non autorisé à modifier cette boutique' 
        });
      }
      
      // Actualizar campos
      if (boutiqueData.nom_boutique) boutique.nom_boutique = boutiqueData.nom_boutique;
      if (boutiqueData.domaine_boutique) boutique.domaine_boutique = boutiqueData.domaine_boutique;
      if (boutiqueData.slogan_boutique !== undefined) boutique.slogan_boutique = boutiqueData.slogan_boutique;
      if (boutiqueData.description_boutique) boutique.description_boutique = boutiqueData.description_boutique;
      
      // Actualizar avatar si viene nuevo
      if (boutiqueData.avatar !== undefined) {
        boutique.avatar = boutiqueData.avatar;
      }
      
      if (boutiqueData.categorie) {
        boutique.categorie = boutiqueData.categorie;
        
        let subCategorySlug = '';
        if (boutiqueData.categorie) {
          subCategorySlug = 'boutique-' + boutiqueData.categorie.toLowerCase()
            .replace(/[&]/g, 'et')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
        }
          
        const subCategory = await Category.findOne({ slug: subCategorySlug });
        if (subCategory) {
          boutique.subCategory = subCategory.name;
        } else {
          boutique.subCategory = boutiqueData.categorie;
        }
      }
      
      if (boutiqueData.plan) boutique.plan = boutiqueData.plan;
      if (boutiqueData.duree_abonnement) boutique.duree_abonnement = boutiqueData.duree_abonnement;
      if (boutiqueData.categories_produits) boutique.categories_produits = boutiqueData.categories_produits;
      
      if (boutiqueData.proprietaire) {
        boutique.proprietaire = {
          nom: boutiqueData.proprietaire.nom || boutique.proprietaire.nom || '',
          email: boutiqueData.proprietaire.email || boutique.proprietaire.email || '',
          telephone: boutiqueData.proprietaire.telephone || boutique.proprietaire.telephone || '',
          wilaya: boutiqueData.proprietaire.wilaya || boutique.proprietaire.wilaya || '',
          adresse: boutiqueData.proprietaire.adresse || boutique.proprietaire.adresse || ''
        };
      }
      
      if (boutiqueData.reseaux_sociaux) {
        boutique.reseaux_sociaux = {
          facebook: boutiqueData.reseaux_sociaux.facebook || boutique.reseaux_sociaux.facebook || '',
          instagram: boutiqueData.reseaux_sociaux.instagram || boutique.reseaux_sociaux.instagram || '',
          tiktok: boutiqueData.reseaux_sociaux.tiktok || boutique.reseaux_sociaux.tiktok || '',
          whatsapp: boutiqueData.reseaux_sociaux.whatsapp || boutique.reseaux_sociaux.whatsapp || '',
          website: boutiqueData.reseaux_sociaux.website || boutique.reseaux_sociaux.website || ''
        };
      }
      
      if (boutiqueData.couleur_theme) boutique.couleur_theme = boutiqueData.couleur_theme;
      
      await boutique.save();
      
      res.json({
        success: true,
        message: 'Boutique mise à jour avec succès',
        boutique: boutique
      });
      
    } catch (error) {
      console.error('❌ Error en updateBoutique:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la mise à jour de la boutique', 
        error: error.message 
      });
    }
  },

  // ==================== OTRAS FUNCIONES (sin cambios) ====================
  getBoutique: async (req, res) => {
    try {
      const id = req.params.id;
      
      const boutique = await Boutique.findById(id)
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

  getUserBoutiques: async (req, res) => {
    try {
      const user = req.user;
      
      const boutiques = await Boutique.find({ user: user._id })
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

  deleteBoutique: async (req, res) => {
    try {
      const id = req.params.id;
      const user = req.user;
      
      const boutique = await Boutique.findById(id);
      
      if (!boutique) {
        return res.status(404).json({ 
          success: false, 
          message: 'Boutique non trouvée' 
        });
      }
      
      if (boutique.user.toString() !== user._id.toString()) {
        return res.status(403).json({ 
          success: false, 
          message: 'Non autorisé à supprimer cette boutique' 
        });
      }
      
      await Boutique.findByIdAndDelete(id);
      
      res.json({
        success: true,
        message: 'Boutique supprimée avec succès'
      });
      
    } catch (error) {
      console.error('❌ Error en deleteBoutique:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Erreur lors de la suppression de la boutique', 
        error: error.message 
      });
    }
  },

  verifyBoutique: async (req, res) => {
    try {
      const id = req.params.id;
      const verified = req.body.verified;
      
      const boutique = await Boutique.findByIdAndUpdate(
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

  // controllers/boutiqueController.js

 // controllers/boutiqueController.js

// ==================== FILTER BOUTIQUES MEJORADO ====================
filterBoutiques: async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const { category: categorySlug, sub: subSlug } = req.query;

    console.log('🔍 filterBoutiques - Parámetros:', {
      category: categorySlug,
      sub: subSlug,
      page: page,
      limit: limit
    });

    // Verificar que sea la categoría boutiques
    if (!categorySlug || categorySlug !== 'boutiques') {
      return res.status(400).json({
        success: false,
        message: 'Categoría no válida'
      });
    }

    // Buscar categoría Boutiques
    const categoryDoc = await Category.findOne({ 
      slug: 'boutiques', 
      level: 1, 
      isActive: true 
    }).lean();

    if (!categoryDoc) {
      return res.status(404).json({
        success: false,
        message: 'Categoría Boutiques no encontrada'
      });
    }

    // Construir filtro base
    const filter = { 
      category: categoryDoc._id, 
      isActive: true 
    };

    // ============ BÚSQUEDA INTELIGENTE POR SUBCATEGORÍA ============
    if (subSlug && subSlug !== 'undefined' && subSlug !== 'null') {
      const subCategoryDoc = await Category.findOne({
        slug: subSlug,
        level: 2,
        parent: categoryDoc._id,
        isActive: true
      }).lean();

      if (subCategoryDoc) {
        console.log('🎯 Filtrando por subcategoría:', subCategoryDoc.name);
        
        // Generar todas las variantes posibles del nombre
        const nombreOriginal = subCategoryDoc.name;
        const sinPrefijo = nombreOriginal.replace('Boutique ', '');
        const sinApostrofe = nombreOriginal.replace("d'", '');
        const soloSlug = subCategoryDoc.slug.replace('boutique-', '');
        
        // Array con todas las variantes
        const variantes = [
          nombreOriginal,                    // "Boutique d'Informatique"
          sinPrefijo,                        // "Informatique"
          sinApostrofe,                       // "Boutique Informatique"
          soloSlug,                           // "informatique"
          nombreOriginal.toLowerCase(),       // "boutique d'informatique"
          sinPrefijo.toLowerCase(),           // "informatique"
          subCategoryDoc.slug,                // "boutique-informatique"
          subCategoryDoc.slug.replace(/-/g, ' ') // "boutique informatique"
        ];
        
        console.log('📋 Variantes de búsqueda:', variantes);
        
        // Construir condiciones OR para todas las variantes
        const orConditions = [];
        
        variantes.forEach(variant => {
          if (variant && variant.trim() !== '') {
            // Búsqueda exacta
            orConditions.push({ categorie: variant });
            orConditions.push({ subCategory: variant });
            
            // Búsqueda con regex (insensible a mayúsculas)
            orConditions.push({ 
              categorie: { $regex: new RegExp(variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') } 
            });
            orConditions.push({ 
              subCategory: { $regex: new RegExp(variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') } 
            });
          }
        });
        
        // Eliminar condiciones duplicadas
        const uniqueConditions = [];
        const seen = new Set();
        
        orConditions.forEach(cond => {
          const key = JSON.stringify(cond);
          if (!seen.has(key)) {
            seen.add(key);
            uniqueConditions.push(cond);
          }
        });
        
        filter.$or = uniqueConditions;
        
        console.log(`🎯 Total condiciones generadas: ${filter.$or.length}`);
      } else {
        // Si no se encuentra la subcategoría en la BD, buscar por texto
        console.log('⚠️ Subcategoría no encontrada en BD, buscando por texto');
        filter.$or = [
          { categorie: { $regex: subSlug.replace(/-/g, ' '), $options: 'i' } },
          { subCategory: { $regex: subSlug.replace(/-/g, ' '), $options: 'i' } },
          { categorie: { $regex: subSlug, $options: 'i' } },
          { subCategory: { $regex: subSlug, $options: 'i' } }
        ];
      }
    }

    console.log('🎯 Filtro MongoDB final:', JSON.stringify(filter, null, 2));

    // ============ OBTENER BOUTIQUES PAGINADAS ============
    const [boutiques, total] = await Promise.all([
      Boutique.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'name username avatar email mobile')
        .lean(),
      Boutique.countDocuments(filter)
    ]);

    // ============ OBTENER SUBCATEGORÍAS PARA EL SLIDER ============
    const children = await Category.find({ 
      parent: categoryDoc._id, 
      level: 2, 
      isActive: true 
    })
      .select('_id name slug level emoji icon iconType iconColor bgColor')
      .sort({ order: 1 })
      .lean();

    console.log('📊 Resultados:', {
      page,
      encontradas: boutiques.length,
      total,
      hasMore: page * limit < total
    });

    // ============ PREPARAR RESPUESTA ============
    const response = {
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
      children: children.map(c => ({
        ...c,
        articles: [] // Para mantener compatibilidad con posts
      }))
    };

    // ============ LOG DE BOUTIQUES ENCONTRADAS ============
    if (boutiques.length > 0) {
      console.log('✅ Boutiques encontradas:');
      boutiques.forEach((b, i) => {
        console.log(`${i+1}. ${b.nom_boutique}`);
        console.log(`   categorie: "${b.categorie}"`);
        console.log(`   subCategory: "${b.subCategory}"`);
      });
    } else {
      console.log('⚠️ No se encontraron boutiques');
      
      // Debug: ver todas las boutiques sin filtro
      const allBoutiques = await Boutique.find({ 
        category: categoryDoc._id, 
        isActive: true 
      })
        .select('nom_boutique categorie subCategory')
        .limit(10)
        .lean();
      
      if (allBoutiques.length > 0) {
        console.log('📋 Boutiques disponibles en esta categoría:');
        allBoutiques.forEach((b, i) => {
          console.log(`${i+1}. ${b.nom_boutique}`);
          console.log(`   categorie: "${b.categorie}"`);
          console.log(`   subCategory: "${b.subCategory}"`);
        });
      } else {
        console.log('📭 No hay boutiques en esta categoría');
      }
    }

    return res.json(response);

  } catch (error) {
    console.error('❌ Error en filterBoutiques:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al filtrar boutiques', 
      error: error.message 
    });
  }
},
};

module.exports = boutiqueCtrl;