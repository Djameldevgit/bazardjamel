// ctrls/boutiqueCtrl.js
 
const Boutique = require('../models/boutiqueModel');
 
const Category = require('../models/categoryModel');
const boutiqueCtrl = {
  
createBoutique: async (req, res) => {
  try {
    const boutiqueData = req.body;
    const user = req.user;
    
    console.log('📦 Creando boutique:', {
      nom_boutique: boutiqueData.nom_boutique,
      categorie: boutiqueData.categorie,
      domaine: boutiqueData.domaine_boutique,
      imagesCount: boutiqueData.images.length || 0
    });

    // Validaciones básicas
    const { nom_boutique, categorie, images } = boutiqueData;
    if (!nom_boutique || !categorie || !images) {
      return res.status(400).json({ 
        success: false, 
        message: 'Champs requis manquants' 
      });
    }

    // Verificar si el dominio ya existe
    if (boutiqueData.domaine_boutique) {
      const existing = await Boutique.findOne({ 
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

    // Generar subCategory slug
    const subCategory = boutiqueData.categorie 
      ? 'boutique-' + boutiqueData.categorie
          .toLowerCase()
          .replace(/[&]/g, 'et')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      : '';

    const newBoutique = new Boutique({
      user: user._id,
      categorie: boutiqueData.categorie,
      subCategory: subCategory,
      articleType: boutiqueData.articleType || '',
      category: boutiquesCategory._id,
      nom_boutique: boutiqueData.nom_boutique,
      domaine_boutique: boutiqueData.domaine_boutique,
      slogan_boutique: boutiqueData.slogan_boutique || '',
      description_boutique: boutiqueData.description_boutique,
      images: boutiqueData.images,
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
      imagesCount: newBoutique.images.length
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
        images: newBoutique.images
      }
    });

  } catch (error) {
    console.error('❌ Error en createBoutique:', error);
    
    // Error de duplicado
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ce domaine est déjà utilisé. Veuillez en choisir un autre.' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
},
updateBoutique: async (req, res) => {
  try {
    const id = req.params.boutiqueId;
    const updateData = req.body;
    const user = req.user;
    
    console.log('📝 Actualizando boutique:', {
      id,
      nom_boutique: updateData.nom_boutique,
      user: user._id
    });

    // Buscar la boutique
    const boutique = await Boutique.findById(id);
    
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
      const existing = await Boutique.findOne({ 
        domaine_boutique: updateData.domaine_boutique,
        _id: { $ne: id } // Excluir la boutique actual
      });
      
      if (existing) {
        return res.status(400).json({ 
          success: false, 
          message: 'Ce domaine est déjà utilisé. Veuillez en choisir un autre.' 
        });
      }
    }

    // Actualizar subCategory si cambia la categoría
    let subCategory = boutique.subCategory;
    if (updateData.categorie && updateData.categorie !== boutique.categorie) {
      subCategory = 'boutique-' + updateData.categorie
        .toLowerCase()
        .replace(/[&]/g, 'et')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }

    // Campos que se pueden actualizar
    const updatableFields = {
      nom_boutique: updateData.nom_boutique,
      domaine_boutique: updateData.domaine_boutique,
      slogan_boutique: updateData.slogan_boutique,
      description_boutique: updateData.description_boutique,
      categorie: updateData.categorie,
      subCategory: subCategory,
      articleType: updateData.articleType,
      images: updateData.images,
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

    // Eliminar undefined values
    Object.keys(updatableFields).forEach(key => 
      updatableFields[key] === undefined && delete updatableFields[key]
    );

    // Actualizar boutique
    const updatedBoutique = await Boutique.findByIdAndUpdate(
      id,
      updatableFields,
      { new: true, runValidators: true }
    ).populate('user', 'name username avatar email mobile');

    console.log('✅ Boutique actualizada con éxito:', updatedBoutique._id);

    res.json({
      success: true,
      message: 'Boutique mise à jour avec succès!',
      boutique: updatedBoutique
    });

  } catch (error) {
    console.error('❌ Error en updateBoutique:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ce domaine est déjà utilisé. Veuillez en choisir un autre.' 
      });
    }
    
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
},
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
      const { boutiqueId } = req.params; // ✅ usar boutiqueId
      const user = req.user;
  
      const boutique = await Boutique.findById(boutiqueId);
  
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
  filterBoutiques: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const skip = (page - 1) * limit;
  
      const { category: categorySlug, sub: subSlug } = req.query;
  
      if (!categorySlug || categorySlug !== 'boutiques') {
        return res.status(400).json({ success: false, message: 'Categoría no válida' });
      }
  
      const categoryDoc = await Category.findOne({ 
        slug: 'boutiques', level: 1, isActive: true 
      }).lean();
  
      if (!categoryDoc) {
        return res.status(404).json({ success: false, message: 'Categoría Boutiques no encontrada' });
      }
  
      const filter = { category: categoryDoc._id, isActive: true };
  
      // Filtrado por subcategoría
      if (subSlug && subSlug !== 'undefined' && subSlug !== 'null') {
        const subCategoryDoc = await Category.findOne({
          slug: subSlug, level: 2, parent: categoryDoc._id, isActive: true
        }).lean();
  
        if (subCategoryDoc) {
          const nombreOriginal = subCategoryDoc.name || '';
          const soloSlug = subCategoryDoc.slug || '';
  
          const variantes = [
            nombreOriginal,
            nombreOriginal.replace('Boutique ', '').replace("d'", '').trim(),
            nombreOriginal.toLowerCase(),
            soloSlug,
            soloSlug.replace(/-/g, ' ')
          ]
          .filter(v => typeof v === 'string' && v.trim() !== ''); // ✅ solo strings válidos
  
          const orConditions = variantes.flatMap(v => {
            const escaped = v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return [
              { categorie: { $regex: escaped, $options: 'i' } },
              { subCategory: { $regex: escaped, $options: 'i' } }
            ];
          });
  
          filter.$or = Array.from(new Set(orConditions.map(JSON.stringify))).map(JSON.parse);
        } else {
          // Buscar por texto si subcategoría no existe en BD
          const cleaned = subSlug.replace(/-/g, ' ');
          filter.$or = [
            { categorie: { $regex: cleaned, $options: 'i' } },
            { subCategory: { $regex: cleaned, $options: 'i' } }
          ];
        }
      }
  
      console.log('🎯 Filtro final:', JSON.stringify(filter, null, 2));
  
      const [boutiques, total] = await Promise.all([
        Boutique.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('user', 'name username avatar email mobile')
          .lean(),
        Boutique.countDocuments(filter)
      ]);
  
      const children = await Category.find({
        parent: categoryDoc._id, level: 2, isActive: true
      })
      .select('_id name slug level emoji icon iconType iconColor bgColor')
      .sort({ order: 1 })
      .lean();
  
      return res.json({
        success: true,
        boutiques,
        total,
        page,
        limit,
        hasMore: page * limit < total,
        totalPages: Math.ceil(total / limit),
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalPosts: total,
          limit,
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
        children: children.map(c => ({ ...c, articles: [] }))
      });
  
    } catch (error) {
      console.error('❌ Error en filterBoutiques:', error);
      res.status(500).json({ success: false, message: 'Error al filtrar boutiques', error: error.message });
    }
  },
  
  // 📂 ctrls/boutiquePostCtrl.js

  // boutiqueCtrl.js
incrementBoutiqueView: async (req, res) => {
  try {
    const { boutiqueId } = req.params;
    const boutique = await Boutique.findById(boutiqueId);

    if (!boutique) return res.status(404).json({ success: false, message: 'Boutique non trouvée' });

    // Incrementar vistas
    boutique.stats.vues = (boutique.stats.vues || 0) + 1;
    await boutique.save();

    res.json({
      success: true,
      stats: boutique.stats
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
}
};

module.exports = boutiqueCtrl;