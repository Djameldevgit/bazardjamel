// controllers/boutiqueProductCtrl.js - VERSIÓN COMPLETAMENTE MIGRADA A BOUTIQUEPRODUCT

const Boutique = require('../models/boutiqueModel');
const BoutiqueProduct = require('../models/boutiqueProductModel'); // ← Así debe ser
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
        etat,
        categorie,
        subCategory,
        articleType,
        categorySpecificData,
        wilaya,
        commune,
        address,
        phone,
        email,
        stock = 1
      } = req.body;

      console.log('📝 Creando producto en boutique:', { boutiqueId, userId });

      // Verificar boutique
      const boutique = await Boutique.findById(boutiqueId);
      if (!boutique) {
        return res.status(404).json({ success: false, message: 'Boutique non trouvée' });
      }

      // Verificar propiedad
      if (boutique.user.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: 'Non autorisé' });
      }

      // Verificar límite de productos
      const productCount = await BoutiqueProduct.countDocuments({ boutique: boutiqueId });
      const maxProducts = boutique.plan === 'gratuit' ? 4 : 1000;

      if (productCount >= maxProducts) {
        return res.status(403).json({
          success: false,
          message: `Limite atteinte (${maxProducts} produits maximum)`
        });
      }

      // Obtener categoryId
      let categoryId = null;
      if (boutique.category) {
        categoryId = boutique.category;
      } else {
        const categoryDoc = await Category.findOne({ slug: 'boutiques' });
        if (categoryDoc) {
          categoryId = categoryDoc._id;
        }
      }

      // 🔥 CREAR PRODUCTO CON MODELO PROPIO
      const productData = {
        boutique: boutiqueId,
        user: userId,
        category: categoryId,
        categorie: categorie || boutique.categorie,
        subCategory: subCategory || boutique.subCategory,
        articleType: articleType || boutique.articleType || '',
        title: title || '',
        description: description || '',
        price: price || 0,
        images: images || [],
        etat: etat || 'neuf',
        stock: stock,
        wilaya: wilaya || (boutique.proprietaire ? boutique.proprietaire.wilaya : ''),
        commune: commune || (boutique.proprietaire ? boutique.proprietaire.commune : ''),
        address: address || (boutique.proprietaire ? boutique.proprietaire.adresse : ''),
        phone: phone || (boutique.proprietaire ? boutique.proprietaire.telephone : ''),
        email: email || (boutique.proprietaire ? boutique.proprietaire.email : ''),
        categorySpecificData: categorySpecificData || {},
        isActive: true,
        pendiente: true  // ✅ Pendiente por defecto
      };

      console.log('📦 Creando producto con modelo BoutiqueProduct:', {
        title: productData.title,
        boutique: productData.boutique,
        category: productData.category
      });

      const newProduct = new BoutiqueProduct(productData);
      await newProduct.save();

      // Actualizar estadísticas de la boutique
      await Boutique.findByIdAndUpdate(boutiqueId, {
        $inc: { 'stats.produits': 1 }
      });

      console.log('✅ Producto creado:', newProduct._id);

      res.status(201).json({
        success: true,
        product: newProduct,
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
  // GET PRODUCTS PENDIENTES (ADMIN)
  // ===========================================
  getProductsPendientes: async (req, res) => {
    try {
      console.log('='.repeat(50));
      console.log('🔥 getProductsPendientes INICIADO (BoutiqueProduct)');
      
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;
      const { boutiqueId, categorie } = req.query;
      
      // Verificar permisos
      if (!req.user) {
        return res.status(401).json({ success: false, message: "Non authentifié" });
      }
      
      if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
        return res.status(403).json({ success: false, message: "Non autorisé" });
      }
      
      // 🔥 CONSTRUIR QUERY PARA BOUTIQUEPRODUCT
      let query = { 
        pendiente: true, 
        isActive: true 
      };
      
      if (boutiqueId && boutiqueId !== 'undefined' && boutiqueId !== 'null' && boutiqueId !== '') {
        query.boutique = boutiqueId;
      }
      
      if (categorie && categorie !== 'undefined' && categorie !== 'null' && categorie !== '') {
        query.categorie = categorie;
      }
      
      console.log('🔥 Query BoutiqueProduct:', JSON.stringify(query));
      
      // 🔥 EJECUTAR CONSULTA EN BOUTIQUEPRODUCT
      const [products, total] = await Promise.all([
        BoutiqueProduct.find(query)
          .populate('user', 'username avatar')
          .populate('boutique', 'nom_boutique domaine_boutique images couleur_theme')
          .sort('-createdAt')
          .skip(skip)
          .limit(limit)
          .lean(),
        BoutiqueProduct.countDocuments(query)
      ]);
      
      console.log('🔥 Resultados:', { productsCount: products.length, total });
      
      const totalPages = Math.ceil(total / limit);
      const hasMore = page < totalPages;
      
      res.json({
        success: true,
        products: products || [],
        total: total || 0,
        page: page,
        limit: limit,
        totalPages: totalPages || 1,
        hasMore: hasMore || false
      });
      
    } catch (err) {
      console.error('❌ ERROR EN getProductsPendientes:', err);
      res.status(500).json({ 
        success: false, 
        error: err.message,
        message: 'Erreur lors de la récupération des produits pendients'
      });
    }
  },

  // ===========================================
  // GET COUNT DE PRODUCTOS PENDIENTES
  // ===========================================
  getProductsPendientesCount: async (req, res) => {
    try {
      console.log('📊 getProductsPendientesCount llamado (BoutiqueProduct)');
      
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'moderator')) {
        return res.status(403).json({ success: false, message: "Non autorisé" });
      }
      
      // 🔥 CONTAR EN BOUTIQUEPRODUCT
      const count = await BoutiqueProduct.countDocuments({ 
        pendiente: true, 
        isActive: true 
      });
      
      console.log(`📊 Count productos pendientes: ${count}`);
      
      res.json({ success: true, count });
      
    } catch (err) {
      console.error('❌ Error en getProductsPendientesCount:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // ===========================================
  // APROBAR PRODUCTO
  // ===========================================
  aprobarProducto: async (req, res) => {
    try {
      const { id } = req.params;
      
      console.log('✅ aprobarProducto llamado para ID:', id);
      
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'moderator')) {
        return res.status(403).json({ success: false, message: "Non autorisé" });
      }
      
      // 🔥 BUSCAR EN BOUTIQUEPRODUCT
      const product = await BoutiqueProduct.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: "Produit non trouvé" });
      }
      
      if (!product.pendiente) {
        return res.status(400).json({ success: false, message: "Déjà approuvé" });
      }
      
      product.pendiente = false;
      await product.save();
      
      // Actualizar estadísticas de la boutique
      await Boutique.findByIdAndUpdate(product.boutique, {
        $inc: { 'stats.produits': 1 }
      });
      
      res.json({ success: true, message: "Produit approuvé avec succès" });
      
    } catch (err) {
      console.error('❌ Error en aprobarProducto:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // ===========================================
  // RECHAZAR PRODUCTO
  // ===========================================
  rechazarProducto: async (req, res) => {
    try {
      const { id } = req.params;
      
      console.log('🗑️ rechazarProducto llamado para ID:', id);
      
      if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'moderator')) {
        return res.status(403).json({ success: false, message: "Non autorisé" });
      }
      
      // 🔥 ELIMINAR DE BOUTIQUEPRODUCT
      const product = await BoutiqueProduct.findById(id);
      if (!product) {
        return res.status(404).json({ success: false, message: "Produit non trouvé" });
      }
      
      await BoutiqueProduct.findByIdAndDelete(id);
      
      res.json({ success: true, message: "Produit rejeté avec succès" });
      
    } catch (err) {
      console.error('❌ Error en rechazarProducto:', err);
      res.status(500).json({ success: false, error: err.message });
    }
  },

  // ===========================================
  // GET BOUTIQUE PRODUCTS (PÚBLICO)
  // ===========================================
  getBoutiqueProducts: async (req, res) => {
    try {
      const { boutiqueId } = req.params;
      const user = req.user || null;
      
      const boutique = await Boutique.findById(boutiqueId);
      if (!boutique) {
        return res.status(404).json({ success: false, message: 'Boutique non trouvée' });
      }
      
      const isAdmin = user && (user.role === 'admin' || user.role === 'moderator');
      const isOwner = user && boutique.user.toString() === user._id.toString();
      
      // Verificar si la boutique está pendiente
      if (boutique.pendiente === true && !isAdmin && !isOwner) {
        return res.status(403).json({ 
          success: false, 
          message: 'Cette boutique est en attente de validation.' 
        });
      }
      
      const {
        page = 1,
        limit = 12,
        sort = 'recent',
        search,
        minPrice,
        maxPrice,
        etat,
        wilaya
      } = req.query;

      const skip = (parseInt(page) - 1) * parseInt(limit);

      // 🔥 CONSTRUIR QUERY PARA BOUTIQUEPRODUCT
      let query = {
        boutique: boutiqueId,
        isActive: true,
        pendiente: false
      };
      
      // Admin/owner pueden ver productos pendientes
      if (isAdmin || isOwner) {
        delete query.pendiente;
      }

      if (search && search.trim()) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice);
        if (maxPrice) query.price.$lte = parseFloat(maxPrice);
      }

      if (etat && etat !== 'all') {
        query.etat = etat;
      }

      if (wilaya) {
        query.wilaya = wilaya;
      }

      let sortOption = {};
      switch(sort) {
        case 'price_asc': sortOption = { price: 1 }; break;
        case 'price_desc': sortOption = { price: -1 }; break;
        case 'popular': sortOption = { views: -1 }; break;
        default: sortOption = { createdAt: -1 }; break;
      }

      // 🔥 EJECUTAR CONSULTA EN BOUTIQUEPRODUCT
      const [products, total] = await Promise.all([
        BoutiqueProduct.find(query)
          .sort(sortOption)
          .skip(skip)
          .limit(parseInt(limit))
          .populate('user', 'username avatar')
          .populate('boutique', 'nom_boutique couleur_theme images')
          .lean(),
        BoutiqueProduct.countDocuments(query)
      ]);

      const currentPage = parseInt(page);
      const totalPages = Math.ceil(total / parseInt(limit));
      const hasMore = currentPage < totalPages;

      res.json({
        success: true,
        products: products,
        total,
        page: currentPage,
        totalPages,
        hasMore,
        boutiqueInfo: {
          _id: boutique._id,
          nom_boutique: boutique.nom_boutique,
          pendiente: boutique.pendiente
        }
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
  // GET SINGLE PRODUCT BY ID
  // ===========================================
  getProductById: async (req, res) => {
    try {
      const { productId } = req.params;
      
      const product = await BoutiqueProduct.findById(productId)
        .populate('user', 'username avatar')
        .populate('boutique', 'nom_boutique couleur_theme images');
      
      if (!product) {
        return res.status(404).json({ success: false, message: 'Produit non trouvé' });
      }
      
      // Incrementar vistas
      product.views += 1;
      await product.save();
      
      res.json({ success: true, product });
      
    } catch (error) {
      console.error('❌ Error en getProductById:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ===========================================
  // UPDATE BOUTIQUE PRODUCT
  // ===========================================
  updateBoutiqueProduct: async (req, res) => {
    try {
      const { boutiqueId, productId } = req.params;
      const userId = req.user._id;
      const updateData = req.body;

      // Verificar boutique
      const boutique = await Boutique.findById(boutiqueId);
      if (!boutique) {
        return res.status(404).json({ success: false, message: 'Boutique non trouvée' });
      }

      if (boutique.user.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: 'Non autorisé' });
      }

      // 🔥 BUSCAR EN BOUTIQUEPRODUCT
      const product = await BoutiqueProduct.findOne({
        _id: productId,
        boutique: boutiqueId
      });

      if (!product) {
        return res.status(404).json({ success: false, message: 'Produit non trouvé' });
      }

      // Campos permitidos para actualización
      const allowedFields = [
        'title', 'description', 'price', 'images', 'etat', 'stock',
        'categorie', 'subCategory', 'articleType', 'categorySpecificData',
        'wilaya', 'commune', 'address', 'phone', 'email'
      ];

      allowedFields.forEach(field => {
        if (updateData[field] !== undefined) {
          product[field] = updateData[field];
        }
      });

      // Si se actualiza, vuelve a estar pendiente (a menos que sea admin)
      if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
        product.pendiente = true;
      }

      await product.save();

      res.json({
        success: true,
        product: product
      });

    } catch (error) {
      console.error('❌ Error en updateBoutiqueProduct:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ===========================================
  // DELETE BOUTIQUE PRODUCT
  // ===========================================
  deleteBoutiqueProduct: async (req, res) => {
    try {
      const { boutiqueId, productId } = req.params;
      const userId = req.user._id;

      // Verificar boutique
      const boutique = await Boutique.findById(boutiqueId);
      if (!boutique) {
        return res.status(404).json({ success: false, message: 'Boutique non trouvée' });
      }

      if (boutique.user.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, message: 'Non autorisé' });
      }

      // 🔥 ELIMINAR DE BOUTIQUEPRODUCT
      const product = await BoutiqueProduct.findOneAndDelete({
        _id: productId,
        boutique: boutiqueId
      });

      if (!product) {
        return res.status(404).json({ success: false, message: 'Produit non trouvé' });
      }

      // Actualizar estadísticas de la boutique
      await Boutique.findByIdAndUpdate(boutiqueId, {
        $inc: { 'stats.produits': -1 }
      });

      res.json({
        success: true,
        deletedProductId: productId
      });

    } catch (error) {
      console.error('❌ Error en deleteBoutiqueProduct:', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // ===========================================
  // GET USER PRODUCTS (para MesProductsBoutiques)
  // ===========================================
 // ===========================================
// GET USER PRODUCTS (para MesProductsBoutiques)
// ===========================================
// controllers/boutiqueProductCtrl.js
// Reemplaza la función getUserProducts con esta versión con logs extremos

getUserProducts: async (req, res) => {
  try {
    console.log('='.repeat(60));
    console.log('🔥🔥🔥 getUserProducts EJECUTÁNDOSE 🔥🔥🔥');
    console.log('📅 Timestamp:', new Date().toISOString());
    console.log('👤 User ID:', req.user._id);
    console.log('👤 User role:', req.user.role);
    console.log('👤 User username:', req.user.username);
    console.log('🔑 Token presente:', !!req.headers.authorization);
    
    const userId = req.user._id;
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    console.log('📊 Parámetros:', { userId, page, limit, skip });
    
    // Verificar que el modelo existe
    console.log('🔍 Verificando modelo BoutiqueProduct...');
    console.log('📦 Tipo de BoutiqueProduct:', typeof BoutiqueProduct);
    console.log('📦 BoutiqueProduct existe?', !!BoutiqueProduct);
    
    if (!BoutiqueProduct) {
      console.error('❌❌❌ CRÍTICO: BoutiqueProduct NO ESTÁ DEFINIDO');
      return res.status(500).json({ 
        success: false, 
        message: 'Erreur interne: modèle BoutiqueProduct non défini',
        error: 'MODEL_NOT_FOUND'
      });
    }
    
    // Verificar métodos del modelo
    console.log('📦 Métodos de BoutiqueProduct:', Object.keys(BoutiqueProduct));
    
    // Probar conexión a MongoDB
    console.log('🔄 Probando conexión a MongoDB...');
    try {
      const dbState = mongoose.connection.readyState;
      console.log('📊 Estado de MongoDB:', dbState === 1 ? 'Conectado' : dbState === 0 ? 'Desconectado' : 'Conectando');
    } catch (dbErr) {
      console.error('❌ Error verificando MongoDB:', dbErr.message);
    }
    
    // 🔥 EJECUTAR QUERY PASO A PASO
    console.log('🔄 Ejecutando BoutiqueProduct.find({ user: userId })...');
    
    let products = [];
    let total = 0;
    
    try {
      // Primero el count
      console.log('📊 Contando documentos...');
      total = await BoutiqueProduct.countDocuments({ user: userId });
      console.log('✅ Total encontrado:', total);
      
      // Luego los productos
      console.log('📊 Obteniendo productos...');
      products = await BoutiqueProduct.find({ user: userId })
        .populate('boutique', 'nom_boutique couleur_theme images domaine_boutique')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .lean();
      
      console.log('✅ Productos obtenidos:', products.length);
      
    } catch (queryErr) {
      console.error('❌ Error en la consulta:', queryErr);
      console.error('❌ Mensaje:', queryErr.message);
      console.error('❌ Stack:', queryErr.stack);
      throw queryErr;
    }
    
    // Mostrar primer producto como muestra
    if (products.length > 0) {
      console.log('📦 PRIMER PRODUCTO (muestra):');
      console.log('   - _id:', products[0]._id);
      console.log('   - title:', products[0].title);
      console.log('   - pendiente:', products[0].pendiente);
      console.log('   - boutique:', products[0].boutique.nom_boutique || 'Sin boutique');
    }
    
    const totalPages = Math.ceil(total / parseInt(limit));
    
    console.log('📊 Respuesta preparada:');
    console.log('   - products:', products.length);
    console.log('   - total:', total);
    console.log('   - page:', parseInt(page));
    console.log('   - totalPages:', totalPages);
    
    res.json({
      success: true,
      products: products || [],
      total: total || 0,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: totalPages,
      hasMore: parseInt(page) < totalPages
    });
    
    console.log('✅ Respuesta enviada correctamente');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('='.repeat(60));
    console.error('❌❌❌ ERROR EN getUserProducts ❌❌❌');
    console.error('📅 Timestamp:', new Date().toISOString());
    console.error('📝 Mensaje:', error.message);
    console.error('📚 Stack:', error.stack);
    console.error('🏷️ Nombre:', error.name);
    
    if (error.name === 'MongoError' || error.name === 'MongoServerError') {
      console.error('🗄️ Código MongoDB:', error.code);
      console.error('🗄️ Detalle MongoDB:', error.errmsg);
    }
    
    if (error.message.includes('populate')) {
      console.error('⚠️ Error de populate - verificar referencia "boutique"');
    }
    
    console.error('='.repeat(60));
    
    res.status(500).json({ 
      success: false, 
      message: error.message,
      errorType: error.name,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
};
module.exports = boutiqueProductCtrl;