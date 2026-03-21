const Boutique = require('../models/boutiqueModel');
const Post = require('../models/postModel');
const Category = require('../models/categoryModel');

const boutiquePostCtrl = {

  // ===========================================
  // CREATE
  // ===========================================
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
        categorySpecificData
      } = req.body;

      const boutique = await Boutique.findById(boutiqueId);
      if (!boutique) {
        return res.status(404).json({ success: false, message: 'Boutique non trouvée' });
      }

      if (boutique.user.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: 'Non autorisé' });
      }

      const postCount = await Post.countDocuments({ boutique: boutiqueId });
      const maxPosts = boutique.plan === 'gratuit' ? 4 : 1000;

      if (postCount >= maxPosts) {
        return res.status(403).json({
          success: false,
          message: `Limite atteinte (${maxPosts})`
        });
      }

      const categoryDoc = await Category.findById(boutique.category);

      const newPost = new Post({
        user: userId,
        boutique: boutiqueId,
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

      // 🔥 calcular score inicial
      newPost.score = newPost.calculateScore();

      await newPost.save();

      await Boutique.findByIdAndUpdate(boutiqueId, {
        $inc: { 'stats.produits': 1 }
      });

      res.status(201).json({
        success: true,
        post: newPost
      });

    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
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