// controllers/boutiqueProductCtrl.js

const Boutique = require('../models/boutiqueModel');
const Post = require('../models/postModel');
const Category = require('../models/categoryModel');

const boutiqueProductCtrl = {

  // ===========================================
  // CREATE BOUTIQUE PRODUCT
  // ===========================================
  createBoutiqueProduct: async (req, res) => {
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

      console.log('📝 Creando producto en boutique:', { boutiqueId, userId });

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

      console.log('📦 Creando producto:', {
        title: postData.title,
        boutique: postData.boutique,
        category: postData.category
      });

      // 6. Crear el post
      const newPost = new Post(postData);
      
      // Calcular score
      let scoreValue = 0;
      if (newPost.calculateScore && typeof newPost.calculateScore === 'function') {
        try {
          scoreValue = newPost.calculateScore();
          if (isNaN(scoreValue)) {
            scoreValue = 0;
          }
        } catch (err) {
          console.error('❌ Error en calculateScore:', err);
          scoreValue = 0;
        }
      } else {
        scoreValue = 0;
        if (postData.price > 0) scoreValue += 10;
        if (postData.images && postData.images.length > 0) scoreValue += 5;
        if (postData.title && postData.title.length > 0) scoreValue += 5;
      }
      
      newPost.score = isNaN(scoreValue) ? 0 : Math.floor(scoreValue);

      await newPost.save();

      // 7. Actualizar contador de la boutique
      await Boutique.findByIdAndUpdate(boutiqueId, {
        $inc: { 'stats.produits': 1 }
      });

      console.log('✅ Producto creado:', newPost._id);

      // 🔥 DEVOLVER LA ESTRUCTURA QUE ESPERA EL FRONTEND
      res.status(201).json({
        success: true,
        product: newPost,  // 👈 CAMBIADO: 'product' en lugar de 'post'
        message: 'Produit ajouté avec succès'
      });

    } catch (error) {
      console.error('❌ Error en createBoutiqueProduct:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message,
        details: error.message
      });
    }
  },

  // ===========================================
  // GET PRODUCTS
  // ===========================================
  getBoutiqueProducts: async (req, res) => {
    try {
      const { boutiqueId } = req.params;
      const {
        page = 1,
        limit = 12,
        sort = 'recent',
        search,
        categories,
        subCategories,
        articleType,
        minPrice,
        maxPrice,
        etat,
        wilaya,
        minScore,
        dynamicFilters
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const boutique = await Boutique.findById(boutiqueId);
      if (!boutique) {
        return res.status(404).json({ success: false, message: 'Boutique non trouvée' });
      }

      const query = {
        boutique: boutiqueId,
        isActive: true
      };

      if (search && search.trim()) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      if (categories && categories.length > 0) {
        const categoriesArray = categories.split(',');
        query.categorie = { $in: categoriesArray };
      }

      if (subCategories && subCategories.length > 0) {
        const subCategoriesArray = subCategories.split(',');
        query.subCategory = { $in: subCategoriesArray };
      }

      if (articleType && articleType !== 'all') {
        query.articleType = articleType;
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
      }

      if (etat && etat.length > 0) {
        const etatArray = etat.split(',');
        query.etat = { $in: etatArray };
      }

      if (wilaya && wilaya.trim()) {
        query.wilaya = wilaya;
      }

      if (minScore && !isNaN(minScore)) {
        query.score = { $gte: parseInt(minScore) };
      }

      if (dynamicFilters) {
        let parsedFilters;
        try {
          parsedFilters = typeof dynamicFilters === 'string' 
            ? JSON.parse(dynamicFilters) 
            : dynamicFilters;
        } catch (e) {
          parsedFilters = {};
        }
        
        Object.entries(parsedFilters).forEach(([fieldName, values]) => {
          if (values && Array.isArray(values) && values.length > 0) {
            query[`categorySpecificData.${fieldName}`] = { $in: values };
          }
        });
      }

      let sortOption = {};
      switch(sort) {
        case 'price_asc':
          sortOption = { price: 1 };
          break;
        case 'price_desc':
          sortOption = { price: -1 };
          break;
        case 'popular':
          sortOption = { views: -1 };
          break;
        case 'score':
          sortOption = { score: -1 };
          break;
        default:
          sortOption = { createdAt: -1 };
          break;
      }

      const [products, total] = await Promise.all([
        Post.find(query)
          .sort(sortOption)
          .skip(skip)
          .limit(parseInt(limit))
          .populate('user', 'username avatar')
          .populate('boutique', 'nom_boutique couleur_theme images')
          .lean(),
        Post.countDocuments(query)
      ]);

      const currentPage = parseInt(page);
      const totalPages = Math.ceil(total / parseInt(limit));
      const hasMore = currentPage < totalPages;

      // Extraer valores únicos para filtros dinámicos
      const extractFieldValues = (productsList) => {
        const fieldMap = {};
        productsList.forEach(product => {
          if (product.categorySpecificData && typeof product.categorySpecificData === 'object') {
            Object.entries(product.categorySpecificData).forEach(([key, value]) => {
              if (!fieldMap[key]) fieldMap[key] = new Set();
              if (value && typeof value === 'string' && value.trim()) {
                fieldMap[key].add(value.trim());
              } else if (value && typeof value === 'number') {
                fieldMap[key].add(value.toString());
              }
            });
          }
        });
        
        const result = {};
        Object.entries(fieldMap).forEach(([key, set]) => {
          result[key] = Array.from(set).sort();
        });
        return result;
      };

      const fieldValues = extractFieldValues(products);
      const availableFields = Object.keys(fieldValues);

      // 🔥 DEVOLVER LA ESTRUCTURA CORRECTA
      res.json({
        success: true,
        products: products,  // 👈 CAMBIADO: 'products' en lugar de 'posts'
        total,
        page: currentPage,
        totalPages,
        hasMore,
        availableFields,
        fieldValues
      });

    } catch (error) {
      console.error('❌ Error en getBoutiqueProducts:', error);
      res.status(500).json({ 
        success: false, 
        message: error.message
      });
    }
  },

  // ===========================================
  // UPDATE
  // ===========================================
  updateBoutiqueProduct: async (req, res) => {
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

      const product = await Post.findOne({
        _id: postId,
        boutique: boutiqueId
      });

      if (!product) {
        return res.status(404).json({ success: false });
      }

      const fields = [
        'title', 'description', 'price', 'images', 'etat',
        'categorie', 'subCategory', 'articleType', 'categorySpecificData'
      ];

      fields.forEach(f => {
        if (updateData[f] !== undefined) product[f] = updateData[f];
      });

      if (product.calculateScore && typeof product.calculateScore === 'function') {
        product.score = product.calculateScore();
      }

      await product.save();

      // 🔥 DEVOLVER LA ESTRUCTURA CORRECTA
      res.json({
        success: true,
        product: product  // 👈 CAMBIADO: 'product' en lugar de 'post'
      });

    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ===========================================
  // DELETE
  // ===========================================
  deleteBoutiqueProduct: async (req, res) => {
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

      const product = await Post.findOne({
        _id: postId,
        boutique: boutiqueId
      });

      if (!product) {
        return res.status(404).json({ success: false });
      }

      await Post.deleteOne({ _id: postId });

      await Boutique.findByIdAndUpdate(boutiqueId, {
        $inc: { 'stats.produits': -1 }
      });

      res.json({
        success: true,
        deletedProductId: postId  // 👈 CAMBIADO
      });

    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = boutiqueProductCtrl;