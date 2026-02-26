// ctrls/boutiqueCtrl.js
 
const Boutique = require('../models/boutiqueModel');
const Post = require('../models/postModel');
const Category = require('../models/categoryModel');
const boutiquePostCtrl = {
 
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

module.exports = boutiquePostCtrl;