// ctrls/boutiqueCtrl.js
 
const Boutique = require('../models/boutiqueModel');
const Post = require('../models/postModel');
const Category = require('../models/categoryModel');
const boutiqueCtrl = {
 
  createBoutiquePost: async (req, res) => {
    try {
      const userId = req.user._id;
      const { boutiqueId } = req.params;
      const { title, description, price, images, categorie, subCategory, articleType, categorySpecificData } = req.body;
  
      // 1️⃣ Verificar que la boutique existe y pertenece al usuario
      const boutique = await Boutique.findById(boutiqueId);
      if (!boutique) {
        return res.status(404).json({ success: false, message: 'Boutique non trouvée' });
      }
  
      if (boutique.user.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: 'Non autorisé à publier dans cette boutique' });
      }
  
      // 2️⃣ Verificar límite según plan
      const postCount = await Post.countDocuments({ boutique: boutiqueId });
      const maxPosts = boutique.plan === 'gratuit' ? 4 : 1000;
  
      if (postCount >= maxPosts) {
        return res.status(403).json({
          success: false,
          message: `Votre plan (${boutique.plan}) vous permet un maximum de ${maxPosts} publications.`
        });
      }
  
      // 3️⃣ Buscar categoría boutiques (o usar la categoría de la boutique)
      let categoryDoc;
      if (boutique.category) {
        // Usar la categoría de la boutique si existe
        categoryDoc = await Category.findById(boutique.category);
      } else {
        // Buscar por slug 'boutiques' como fallback
        categoryDoc = await Category.findOne({ slug: 'boutiques', level: 1 }).lean();
      }
      
      if (!categoryDoc) {
        return res.status(500).json({ success: false, message: 'Catégorie non trouvée' });
      }
  
      // 4️⃣ Crear el post
      const newPost = new Post({
        user: userId,
        boutique: boutiqueId,
        isFromBoutique: true,
        categorie: categorie || boutique.categorie,
        subCategory: subCategory || boutique.subCategory,
        articleType: articleType || '',
        category: categoryDoc._id,
        title,
        description,
        price: price || 0,
        images: images || [],
        wilaya: boutique.proprietaire.wilaya || '',
        commune: boutique.proprietaire.commune || '',
        address: boutique.proprietaire.adresse || '',
        phone: boutique.proprietaire.telephone || '',
        email: boutique.proprietaire.email || '',
        categorySpecificData: categorySpecificData || {},
        isActive: true
      });
  
      await newPost.save();
  
      // 5️⃣ Actualizar contador de productos en la boutique
      await Boutique.findByIdAndUpdate(boutiqueId, {
        $inc: { 'stats.produits': 1 }
      });
  
      console.log(`✅ Nouveau produit ajouté à la boutique ${boutique.nom_boutique}`);
  
      res.status(201).json({
        success: true,
        message: 'Produit ajouté avec succès à la boutique',
        post: newPost
      });
  
    } catch (error) {
      console.error('❌ Error en createBoutiquePost:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },


 
  getBoutiquePosts : async (req, res) => {
  try {
    const { boutiqueId } = req.params;
    const { page = 1, limit = 12 } = req.query;
    
    console.log('📦 Obteniendo posts para boutique:', boutiqueId);
    
    // Verificar que la boutique existe
    const boutique = await Boutique.findById(boutiqueId);
    if (!boutique) {
      return res.status(404).json({ 
        success: false, 
        message: 'Boutique non trouvée' 
      });
    }
    
    // Calcular skip para paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Obtener posts
    const posts = await Post.find({ 
      boutique: boutiqueId,
      isActive: true 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('user', 'username avatar');
    
    // Contar total de posts
    const total = await Post.countDocuments({ 
      boutique: boutiqueId,
      isActive: true 
    });
    
    console.log(`✅ Encontrados ${posts.length} posts para boutique ${boutiqueId}`);
    
    res.json({
      success: true,
      posts,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      hasMore: skip + posts.length < total
    });
    
  } catch (error) {
    console.error('❌ Error en getBoutiquePosts:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
},
// ===========================================
// UPDATE BOUTIQUE POST
// ===========================================
 updateBoutiquePost : async (req, res) => {
  try {
    const userId = req.user._id;
    const { boutiqueId, postId } = req.params;
    const updateData = req.body;

    console.log('📝 Actualizando producto de boutique:', { boutiqueId, postId });

    // 1️⃣ Verificar que la boutique existe
    const boutique = await Boutique.findById(boutiqueId);
    if (!boutique) {
      return res.status(404).json({ 
        success: false, 
        message: 'Boutique non trouvée' 
      });
    }

    // 2️⃣ Verificar permisos (dueño de boutique o admin)
    const isOwner = boutique.user.toString() === userId.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Non autorisé à modifier ce produit' 
      });
    }

    // 3️⃣ Verificar que el post existe y pertenece a la boutique
    const post = await Post.findOne({ 
      _id: postId, 
      boutique: boutiqueId,
      isFromBoutique: true 
    });

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Produit non trouvé dans cette boutique' 
      });
    }

    // 4️⃣ Actualizar el post
    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      { ...updateData },
      { new: true, runValidators: true }
    ).populate('boutique', 'nom_boutique couleur_theme');

    console.log(`✅ Produit mis à jour: ${postId}`);

    res.json({
      success: true,
      message: 'Produit mis à jour avec succès',
      post: updatedPost
    });

  } catch (error) {
    console.error('❌ Error en updateBoutiquePost:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
},

// ===========================================
// DELETE BOUTIQUE POST
// ===========================================
  deleteBoutiquePost : async (req, res) => {
  try {
    const userId = req.user._id;
    const { boutiqueId, postId } = req.params;

    console.log('🗑️ Eliminando producto de boutique:', { boutiqueId, postId });

    // 1️⃣ Verificar que la boutique existe
    const boutique = await Boutique.findById(boutiqueId);
    if (!boutique) {
      return res.status(404).json({ 
        success: false, 
        message: 'Boutique non trouvée' 
      });
    }

    // 2️⃣ Verificar permisos (dueño de boutique o admin)
    const isOwner = boutique.user.toString() === userId.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ 
        success: false, 
        message: 'Non autorisé à supprimer ce produit' 
      });
    }

    // 3️⃣ Verificar que el post existe y pertenece a la boutique
    const post = await Post.findOne({ 
      _id: postId, 
      boutique: boutiqueId,
      isFromBoutique: true 
    });

    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Produit non trouvé dans cette boutique' 
      });
    }

    // 4️⃣ Eliminar el post
    await Post.findByIdAndDelete(postId);

    // 5️⃣ Actualizar contador de productos en la boutique
    await Boutique.findByIdAndUpdate(boutiqueId, {
      $inc: { 'stats.produits': -1 }
    });

    console.log(`✅ Produit supprimé: ${postId}`);

    res.json({
      success: true,
      message: 'Produit supprimé avec succès'
    });

  } catch (error) {
    console.error('❌ Error en deleteBoutiquePost:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
},

 
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
    const id = req.params.id;
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
   
/* filterBoutiques: async (req, res) => {
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
},*/
updateBoutiquePost: async (req, res) => {
  try {
    const { boutiqueId, postId } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    console.log('🛠️ Actualizando producto de boutique:', { boutiqueId, postId });

    // 1️⃣ Verificar que la boutique existe y pertenece al usuario
    const boutique = await Boutique.findById(boutiqueId);
    if (!boutique) {
      return res.status(404).json({ success: false, message: 'Boutique non trouvée' });
    }
    if (boutique.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Non autorisé à modifier ce produit' });
    }

    // 2️⃣ Buscar el post dentro de la boutique
    const post = await Post.findOne({ _id: postId, boutique: boutiqueId, isFromBoutique: true });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé dans cette boutique' });
    }

    // 3️⃣ Actualizar solo campos permitidos
    const fieldsToUpdate = [
      'title', 'description', 'price', 'images', 'etat',
      'categorie', 'subCategory', 'articleType', 'categorySpecificData'
    ];

    fieldsToUpdate.forEach(f => {
      if (updateData[f] !== undefined) post[f] = updateData[f];
    });

    await post.save();

    console.log('✅ Produit mis à jour avec succès');

    res.json({
      success: true,
      message: 'Produit mis à jour avec succès',
      post
    });
  } catch (error) {
    console.error('❌ Error en updateBoutiquePost:', error);
    res.status(500).json({ success: false, message: error.message });
  }
},

/**
 * 🗑️ Eliminar un producto (post) de una boutique
 */
deleteBoutiquePost: async (req, res) => {
  try {
    const { boutiqueId, postId } = req.params;
    const userId = req.user._id;

    console.log('🗑️ Supprimant produit:', { boutiqueId, postId });

    // 1️⃣ Verificar boutique
    const boutique = await Boutique.findById(boutiqueId);
    if (!boutique) {
      return res.status(404).json({ success: false, message: 'Boutique non trouvée' });
    }
    if (boutique.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Non autorisé à supprimer ce produit' });
    }

    // 2️⃣ Buscar el post
    const post = await Post.findOne({ _id: postId, boutique: boutiqueId, isFromBoutique: true });
    if (!post) {
      return res.status(404).json({ success: false, message: 'Produit non trouvé' });
    }

    // 3️⃣ Eliminar imágenes de :contentReference[oaicite:1]{index=1} si existen
    if (post.images && post.images.length > 0) {
      for (const image of post.images) {
        if (image.public_id) {
          try {
            await cloudinary.uploader.destroy(image.public_id);
            console.log('🧹 Image supprimée de Cloudinary:', image.public_id);
          } catch (err) {
            console.warn('⚠️ Erreur suppression image:', image.public_id, err.message);
          }
        }
      }
    }

    // 4️⃣ Eliminar el post
    await Post.deleteOne({ _id: postId });

    console.log('✅ Produit supprimé avec succès');

    res.json({
      success: true,
      message: 'Produit supprimé avec succès',
      deletedPostId: postId
    });
  } catch (error) {
    console.error('❌ Error en deleteBoutiquePost:', error);
    res.status(500).json({ success: false, message: error.message });
  }
},

/**
 * 📦 Obtener todos los productos (posts) de una boutique
 */
getBoutiquePosts: async (req, res) => {
  try {
    const { boutiqueId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const boutique = await Boutique.findById(boutiqueId);
    if (!boutique) {
      return res.status(404).json({ success: false, message: 'Boutique non trouvée' });
    }

    const [posts, total] = await Promise.all([
      Post.find({ boutique: boutiqueId, isFromBoutique: true, isActive: true })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'name avatar username')
        .lean(),
      Post.countDocuments({ boutique: boutiqueId, isFromBoutique: true, isActive: true })
    ]);

    res.json({
      success: true,
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    });
  } catch (error) {
    console.error('❌ Error en getBoutiquePosts:', error);
    res.status(500).json({ success: false, message: error.message });
  }
}
 
  






};

module.exports = boutiqueCtrl;