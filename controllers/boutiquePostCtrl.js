const Boutique = require('../models/boutiqueModel');
const Post = require('../models/postModel');
const Category = require('../models/categoryModel');

const boutiquePostCtrl = {

 // controllers/boutiquePostCtrl.js
createBoutiquePost: async (req, res) => {
  try {
    const userId = req.user._id;
    const { boutiqueId } = req.params;
    const {
      title,
      description,
      price,
      images,
      categorie,
      subCategory,
      articleType,
      categorySpecificData,
      wilaya,
      commune,
      address,
      phone,
      email
    } = req.body;

    console.log('📝 Creando post en boutique:', { boutiqueId, userId });

    // 1. Buscar la boutique
    const boutique = await Boutique.findById(boutiqueId);
    if (!boutique) {
      return res.status(404).json({ success: false, message: 'Boutique non trouvée' });
    }

    // 2. Validar autorización
    if (boutique.user.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, message: 'Non autorisé' });
    }

    // 3. Validar límite de posts
    const postCount = await Post.countDocuments({ boutique: boutiqueId });
    const maxPosts = boutique.plan === 'gratuit' ? 4 : 1000;

    if (postCount >= maxPosts) {
      return res.status(403).json({
        success: false,
        message: 'Limite atteinte (' + maxPosts + ' produits)'
      });
    }

    // 4. Obtener la categoría de forma segura
    let categoryId = null;
    
    if (boutique.category) {
      categoryId = boutique.category;
    } else {
      const categoryDoc = await Category.findOne({ slug: 'boutiques' });
      if (categoryDoc) {
        categoryId = categoryDoc._id;
      }
    }

    // 5. Preparar datos del post
    const postData = {
      user: userId,
      boutique: boutiqueId,
      categorie: categorie || boutique.categorie,
      subCategory: subCategory || boutique.subCategory,
      articleType: articleType || boutique.articleType || '',
      category: categoryId,
      title: title || '',
      description: description || '',
      price: price || 0,
      images: images || [],
      wilaya: wilaya || (boutique.proprietaire ? boutique.proprietaire.wilaya : ''),
      commune: commune || (boutique.proprietaire ? boutique.proprietaire.commune : ''),
      address: address || (boutique.proprietaire ? boutique.proprietaire.adresse : ''),
      phone: phone || (boutique.proprietaire ? boutique.proprietaire.telephone : ''),
      email: email || (boutique.proprietaire ? boutique.proprietaire.email : ''),
      categorySpecificData: categorySpecificData || {},
      isActive: true
    };

    console.log('📦 Creando post:', {
      title: postData.title,
      boutique: postData.boutique,
      category: postData.category
    });

    // 6. Crear el post
    const newPost = new Post(postData);
    
    // 🔥 CALCULAR SCORE DE FORMA SEGURA
    let scoreValue = 0;
    
    // Verificar si el método calculateScore existe
    if (newPost.calculateScore && typeof newPost.calculateScore === 'function') {
      try {
        scoreValue = newPost.calculateScore();
        // Validar que no sea NaN
        if (isNaN(scoreValue)) {
          console.warn('⚠️ calculateScore devolvió NaN, usando 0');
          scoreValue = 0;
        }
      } catch (err) {
        console.error('❌ Error en calculateScore:', err);
        scoreValue = 0;
      }
    } else {
      // Si no existe el método, calcular un score básico
      scoreValue = 0;
      if (postData.price > 0) scoreValue += 10;
      if (postData.images && postData.images.length > 0) scoreValue += 5;
      if (postData.title && postData.title.length > 0) scoreValue += 5;
    }
    
    // Asignar score solo si es un número válido
    newPost.score = isNaN(scoreValue) ? 0 : Math.floor(scoreValue);
    
    console.log('📊 Score calculado:', newPost.score);

    await newPost.save();

    // 7. Actualizar contador de la boutique
    await Boutique.findByIdAndUpdate(boutiqueId, {
      $inc: { 'stats.produits': 1 }
    });

    console.log('✅ Post creado:', newPost._id);

    res.status(201).json({
      success: true,
      post: newPost,
      message: 'Produit ajouté avec succès'
    });

  } catch (error) {
    console.error('❌ Error en createBoutiquePost:', error);
    console.error('❌ Detalles:', error.message);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: error.message,
      details: error.message
    });
  }
},

  // ===========================================
  // GET POSTS (con ranking)
  // ===========================================
  getBoutiquePosts: async (req, res) => {
    try {
      const { boutiqueId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const sort = req.query.sort || 'recent'; // recent | popular

      const skip = (page - 1) * limit;

      const boutique = await Boutique.findById(boutiqueId);
      if (!boutique) {
        return res.status(404).json({ success: false });
      }

      // 🧠 tipo de orden
      let sortOption = { createdAt: -1 };

      if (sort === 'popular') {
        sortOption = { score: -1 };
      }

      const [posts, total] = await Promise.all([
        Post.find({ boutique: boutiqueId, isActive: true })
          .sort(sortOption)
          .skip(skip)
          .limit(limit)
          .populate('user', 'username avatar')
          .populate('boutique', 'nom_boutique couleur_theme images')
          .lean(),

        Post.countDocuments({ boutique: boutiqueId, isActive: true })
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
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ===========================================
  // UPDATE
  // ===========================================
  updateBoutiquePost: async (req, res) => {
    try {
      const { boutiqueId, postId } = req.params;
      const userId = req.user._id;
      const updateData = req.body;

      const boutique = await Boutique.findById(boutiqueId);
      if (!boutique) {
        return res.status(404).json({ success: false });
      }

      if (boutique.user.toString() !== userId.toString()) {
        return res.status(403).json({ success: false });
      }

      const post = await Post.findOne({
        _id: postId,
        boutique: boutiqueId
      });

      if (!post) {
        return res.status(404).json({ success: false });
      }

      const fields = [
        'title',
        'description',
        'price',
        'images',
        'etat',
        'categorie',
        'subCategory',
        'articleType',
        'categorySpecificData'
      ];

      fields.forEach(f => {
        if (updateData[f] !== undefined) post[f] = updateData[f];
      });

      // 🔥 recalcular score
      post.score = post.calculateScore();

      await post.save();

      res.json({
        success: true,
        post
      });

    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ===========================================
  // DELETE
  // ===========================================
  deleteBoutiquePost: async (req, res) => {
    try {
      const { boutiqueId, postId } = req.params;
      const userId = req.user._id;

      const boutique = await Boutique.findById(boutiqueId);
      if (!boutique) {
        return res.status(404).json({ success: false });
      }

      if (boutique.user.toString() !== userId.toString()) {
        return res.status(403).json({ success: false });
      }

      const post = await Post.findOne({
        _id: postId,
        boutique: boutiqueId
      });

      if (!post) {
        return res.status(404).json({ success: false });
      }

      await Post.deleteOne({ _id: postId });

      await Boutique.findByIdAndUpdate(boutiqueId, {
        $inc: { 'stats.produits': -1 }
      });

      res.json({
        success: true,
        deletedPostId: postId
      });

    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

   


};

module.exports = boutiquePostCtrl;