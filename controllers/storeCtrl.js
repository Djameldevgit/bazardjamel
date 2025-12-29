const Store = require('../models/storeModel')
const User = require('../models/userModel')
const Post = require('../models/postModel')

const storeCtrl = {
  // 🏪 Crear tienda
  // storeActions.js - Actualizado para Error 500
 
  createStore: async (req, res) => {
   
    try {
      // 1. Verificar autenticación
      if (!req.user || !req.user._id) {
        console.error('❌ ERROR: Usuario no autenticado')
        return res.status(401).json({ 
          success: false,
          msg: 'Non authentifié' 
        })
      }

      const { 
        name, 
        description, 
        category, 
        plan = 'Free',
        duration = 30,
        price = 0,
        credits = 0,
        storage = 100,
        originalPlan = null
      } = req.body

      console.log('📦 Body recibido:')
      console.log(JSON.stringify(req.body, null, 2))

      // 2. Validaciones básicas
      if (!name || !name.trim()) {
        return res.status(400).json({ 
          success: false,
          msg: 'Le nom de la boutique est obligatoire' 
        })
      }

      if (!category) {
        return res.status(400).json({ 
          success: false,
          msg: 'La catégorie est obligatoire' 
        })
      }

      // 3. Verificar si el usuario ya tiene tienda
      const existingStore = await Store.findOne({ owner: req.user._id })
      if (existingStore) {
        return res.status(400).json({ 
          success: false,
          msg: 'Vous avez déjà une boutique' 
        })
      }

      // 4. Crear objeto de tienda
      const storeData = {
        owner: req.user._id,
        name: name.trim(),
        description: (description || 'Nouvelle boutique').trim(),
        category: category.trim(),
        plan: plan,
        duration: parseInt(duration),
        price: parseFloat(price),
        credits: parseInt(credits),
        storage: parseInt(storage),
        originalPlan: originalPlan,
        isActive: true,
        verified: false,
        address: {
          country: 'Algeria'
        }
      }

   
      // Validación de longitud máxima
      if (storeData.name.length > 100) {
        console.error('⚠️ ADVERTENCIA: name excede 100 caracteres')
      }

      // Validar que los números sean válidos
      if (isNaN(storeData.duration)) storeData.duration = 30
      if (isNaN(storeData.price)) storeData.price = 0
      if (isNaN(storeData.credits)) storeData.credits = 0
      if (isNaN(storeData.storage)) storeData.storage = 100

      console.log('📋 Objeto storeData final:')
      console.log(JSON.stringify(storeData, null, 2))

      // 5. Crear y guardar la tienda
      console.log('💾 Intentando crear documento en MongoDB...')
      const newStore = new Store(storeData)
      
      // Intentar validar primero
      try {
        await newStore.validate()
        console.log('✅ Validación Mongoose exitosa')
      } catch (validationError) {
        console.error('❌ Validación Mongoose fallida:')
        console.error('Nombre del error:', validationError.name)
        console.error('Mensaje:', validationError.message)
        
        if (validationError.errors) {
          console.error('📋 ERRORES DE VALIDACIÓN DETALLADOS:')
          console.error('=== LISTA COMPLETA DE CAMPOS CON ERROR ===')
          
          for (const field in validationError.errors) {
            console.error(`\n❌ CAMPO: ${field}`)
            console.error(`   Mensaje: ${validationError.errors[field].message}`)
            console.error(`   Valor: ${validationError.errors[field].value}`)
            console.error(`   Tipo de error: ${validationError.errors[field].kind}`)
            console.error(`   Path: ${validationError.errors[field].path}`)
            
            if (validationError.errors[field].kind === 'enum') {
              console.error(`   Valores permitidos: ${validationError.errors[field].properties.enumValues || 'No disponible'}`)
            }
          }
          
          const errors = {}
          for (const field in validationError.errors) {
            errors[field] = validationError.errors[field].message
          }
          
          return res.status(400).json({
            success: false,
            msg: 'Erreur de validation Mongoose',
            errors
          })
        }
        
        throw validationError
      }
      
      const savedStore = await newStore.save()
      
      console.log('✅ Boutique créée avec succès:', savedStore._id)

      // 6. Actualizar usuario
      try {
        await User.findByIdAndUpdate(
          req.user._id,
          {
            $set: { hasStore: true },
            $push: { stores: savedStore._id }
          }
        )
        console.log('✅ Utilisateur mis à jour')
      } catch (userError) {
        console.warn('⚠️ Erreur lors de la mise à jour utilisateur:', userError.message)
      }

      // 7. Responder con éxito
      res.status(201).json({
        success: true,
        msg: 'Boutique créée avec succès! 🎉',
        store: {
          id: savedStore._id,
          name: savedStore.name,
          category: savedStore.category,
          plan: savedStore.plan
        }
      })

    } catch (err) {
      console.error('❌ ERREUR CRITIQUE dans createStore:')
      console.error('Nombre del error:', err.name)
      console.error('Mensaje:', err.message)
      console.error('Stack:', err.stack)
      
      // Manejo de errores específicos
      if (err.name === 'ValidationError') {
        const errors = {}
        for (const field in err.errors) {
          errors[field] = err.errors[field].message
        }
        return res.status(400).json({
          success: false,
          msg: 'Erreur de validation',
          errors
        })
      }
      
      if (err.code === 11000) {
        return res.status(400).json({
          success: false,
          msg: 'Une boutique avec ce nom existe déjà'
        })
      }
      
      // Error general
      res.status(500).json({
        success: false,
        msg: 'Erreur lors de la création de la boutique',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      })
    } finally {
      console.log('=== 🏁 FIN EJECUCIÓN createStore ===\n\n')
    }
  },
  // 📋 Obtener todas las tiendas (con paginación)
  getAllStores: async (req, res) => {
    try {
      const { page = 1, limit = 20, category, plan } = req.query

      const query = {}
      if (category) query.category = category
      if (plan) query.plan = plan

      const stores = await Store.find(query)
        .populate('owner', 'name email')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))

      const total = await Store.countDocuments(query)

      res.json({
        success: true,
        stores,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      })

    } catch (err) {
      console.error('❌ Error en getAllStores:', err)
      res.status(500).json({
        success: false,
        msg: 'Error al obtenir les boutiques.'
      })
    }
  },
  // 👤 Obtener tiendas por usuario
  getStoresByUser: async (req, res) => {
    try {
      const { id } = req.params
      const stores = await Store.find({ owner: id })
        .populate('owner', 'name email')
        .sort({ createdAt: -1 })

      res.json({
        stores,
        count: stores.length
      })

    } catch (err) {
      console.error(err)
      res.status(500).json({ msg: 'Error al obtener tiendas del usuario.' })
    }
  },

  // 🏪 Obtener una tienda específica
  getStoreById: async (req, res) => {
    try {
      const { id } = req.params
      const store = await Store.findById(id)
        .populate('owner', 'name email phone')
        .populate({
          path: 'products',
          model: 'Post',
          match: { isActive: true },
          options: { limit: 12, sort: { createdAt: -1 } }
        })

      if (!store) {
        return res.status(404).json({ msg: 'Tienda no encontrada.' })
      }

      // Incrementar vistas si no es el dueño
      if (req.user._id.toString() !== store.owner._id.toString()) {
        store.stats.totalViews += 1
        await store.save()
      }

      res.json(store)

    } catch (err) {
      console.error(err)
      res.status(500).json({ msg: 'Error al obtener la tienda.' })
    }
  },

  // ✏️ Actualizar tienda
  updateStore: async (req, res) => {
    try {
      const { id } = req.params
      const store = await Store.findById(id)

      if (!store) {
        return res.status(404).json({ msg: 'Tienda no encontrada.' })
      }

      // Verificar permisos
      if (store.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          msg: 'No tienes permiso para modificar esta tienda.'
        })
      }

      // No permitir cambiar el owner
      if (req.body.owner) {
        delete req.body.owner
      }

      const updated = await Store.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true
      }).populate('owner', 'name email')

      res.json({
        msg: 'Tienda actualizada con éxito.',
        store: updated
      })

    } catch (err) {
      console.error(err)
      res.status(500).json({ msg: 'Error al actualizar la tienda.' })
    }
  },

  // ⬆️ Cambiar plan
  changePlan: async (req, res) => {
    try {
      const { id } = req.params
      const { plan } = req.body

      if (!['Free', 'Pro', 'Premium'].includes(plan)) {
        return res.status(400).json({ msg: 'Plan no válido.' })
      }

      const store = await Store.findById(id)

      if (!store) {
        return res.status(404).json({ msg: 'Tienda no encontrada.' })
      }

      if (store.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          msg: 'No tienes permiso para cambiar el plan.'
        })
      }

      store.plan = plan
      await store.save()

      res.json({
        msg: `Plan actualizado a ${plan} exitosamente.`,
        store
      })

    } catch (err) {
      console.error(err)
      res.status(500).json({ msg: 'Error al cambiar el plan.' })
    }
  },

  // ❌ Eliminar tienda
  deleteStore: async (req, res) => {
    try {
      const { id } = req.params
      const store = await Store.findById(id)

      if (!store) {
        return res.status(404).json({ msg: 'Tienda no encontrada.' })
      }

      // Verificar permisos
      if (store.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          msg: 'No tienes permiso para eliminar esta tienda.'
        })
      }

      // Actualizar usuario
      await User.findByIdAndUpdate(store.owner, { hasStore: false })

      // Eliminar tienda
      await Store.findByIdAndDelete(id)

      res.json({
        msg: 'Tienda eliminada correctamente.'
      })

    } catch (err) {
      console.error(err)
      res.status(500).json({ msg: 'Error al eliminar la tienda.' })
    }
  },

  // 🔍 Buscar tiendas
  searchStores: async (req, res) => {
    try {
      const { q, category, city } = req.query

      const query = { isActive: true }

      if (q) {
        query.$or = [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } }
        ]
      }

      if (category) query.category = category
      if (city) query['address.city'] = city

      const stores = await Store.find(query)
        .populate('owner', 'name')
        .limit(50)
        .sort({ 'stats.totalViews': -1 })

      res.json({
        stores,
        count: stores.length
      })

    } catch (err) {
      console.error(err)
      res.status(500).json({ msg: 'Error buscando tiendas.' })
    }
  },





  getPublicStores: async (req, res) => {
    try {
      const {
        page = 1,
        limit = 12,
        category,
        city,
        plan,
        sort = 'newest'
      } = req.query

      // Construir query
      const query = { isActive: true }

      if (category && category !== 'all') {
        query.category = category
      }

      if (city && city !== 'all') {
        query['address.city'] = city
      }

      if (plan && plan !== 'all') {
        query.plan = plan
      }

      // Ordenamiento
      let sortOption = {}
      switch (sort) {
        case 'newest':
          sortOption = { createdAt: -1 }
          break
        case 'oldest':
          sortOption = { createdAt: 1 }
          break
        case 'views':
          sortOption = { 'stats.totalViews': -1 }
          break
        case 'favorites':
          sortOption = { 'stats.totalFavorites': -1 }
          break
        case 'name':
          sortOption = { name: 1 }
          break
        case 'products':
          sortOption = { 'stats.totalProducts': -1 }
          break
        default:
          sortOption = { createdAt: -1 }
      }

      // Ejecutar consulta
      const stores = await Store.find(query)
        .select('-socialLinks -planFeatures -verified -__v') // Excluir campos sensibles
        .populate('owner', 'name avatar username email')
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))

      const total = await Store.countDocuments(query)

      // Obtener estadísticas para filtros
      const categories = await Store.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])

      const cities = await Store.aggregate([
        { $match: { isActive: true, 'address.city': { $exists: true, $ne: '' } } },
        { $group: { _id: '$address.city', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ])

      res.json({
        success: true,
        stores,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        filters: {
          categories: categories.map(cat => ({ name: cat._id, count: cat.count })),
          cities: cities.map(city => ({ name: city._id, count: city.count })),
          plans: [
            { name: 'Free', count: await Store.countDocuments({ plan: 'Free', isActive: true }) },
            { name: 'Pro', count: await Store.countDocuments({ plan: 'Pro', isActive: true }) },
            { name: 'Premium', count: await Store.countDocuments({ plan: 'Premium', isActive: true }) }
          ]
        }
      })

    } catch (err) {
      console.error('❌ Error en getPublicStores:', err)
      res.status(500).json({
        success: false,
        msg: 'Error al obtener las boutiques'
      })
    }
  },

  // 🔍 Buscar stores públicas
  searchPublicStores: async (req, res) => {
    try {
      const {
        q,
        page = 1,
        limit = 12,
        sort = 'relevance'
      } = req.query

      if (!q || q.trim() === '') {
        return res.status(400).json({
          success: false,
          msg: 'Terme de recherche requis'
        })
      }

      const query = {
        isActive: true,
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { description: { $regex: q, $options: 'i' } },
          { category: { $regex: q, $options: 'i' } }
        ]
      }

      // Ordenamiento para búsqueda
      let sortOption = {}
      if (sort === 'relevance') {
        // Podrías implementar lógica de relevancia aquí
        sortOption = { createdAt: -1 }
      } else if (sort === 'newest') {
        sortOption = { createdAt: -1 }
      } else if (sort === 'views') {
        sortOption = { 'stats.totalViews': -1 }
      }

      const stores = await Store.find(query)
        .select('-socialLinks -planFeatures -verified -__v')
        .populate('owner', 'name avatar username')
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))

      const total = await Store.countDocuments(query)

      res.json({
        success: true,
        stores,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        searchTerm: q
      })

    } catch (err) {
      console.error('❌ Error en searchPublicStores:', err)
      res.status(500).json({
        success: false,
        msg: 'Error en la búsqueda'
      })
    }
  },

  // 🏪 Obtener stores por categoría (para mostrar en categorías)
  getStoresByCategory: async (req, res) => {
    try {
      const { category } = req.params
      const { page = 1, limit = 12, sort = 'newest' } = req.query

      // Validar categoría
      if (!category) {
        return res.status(400).json({
          success: false,
          msg: 'Catégorie requise'
        })
      }

      const query = {
        category,
        isActive: true
      }

      // Ordenamiento
      let sortOption = {}
      if (sort === 'newest') sortOption = { createdAt: -1 }
      else if (sort === 'oldest') sortOption = { createdAt: 1 }
      else if (sort === 'views') sortOption = { 'stats.totalViews': -1 }
      else if (sort === 'favorites') sortOption = { 'stats.totalFavorites': -1 }

      const stores = await Store.find(query)
        .select('-socialLinks -planFeatures -verified -__v')
        .populate('owner', 'name avatar username')
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(parseInt(limit))

      const total = await Store.countDocuments(query)

      // Obtener subcategorías si existen en tu modelo
      // (puedes adaptar esto según tu estructura)

      res.json({
        success: true,
        stores,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        category,
        hasSubcategories: false // Cambiar si implementas subcategorías
      })

    } catch (err) {
      console.error('❌ Error en getStoresByCategory:', err)
      res.status(500).json({
        success: false,
        msg: 'Error al obtener boutiques par catégorie'
      })
    }
  },

  // 📊 Obtener estadísticas de stores por categoría
  getStoreCategoriesStats: async (req, res) => {
    try {
      const categories = await Store.aggregate([
        { $match: { isActive: true } },
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
            totalViews: { $sum: '$stats.totalViews' },
            totalFavorites: { $sum: '$stats.totalFavorites' },
            totalProducts: { $sum: '$stats.totalProducts' }
          }
        },
        { $sort: { count: -1 } }
      ])

      // Agregar emojis para categorías
      const categoryEmojis = {
        'Alimentaire': '🍎',
        'Vêtements': '👕',
        'Électronique': '📱',
        'Immobilier': '🏠',
        'Automobiles': '🚗',
        'Services': '🔧',
        'Informatique': '💻',
        'Mobiliers': '🛋️',
        'Loisirs': '🎮',
        'Sport': '⚽',
        'Voyages': '✈️',
        'Emploi': '💼',
        'Matériaux': '🧱',
        'Électroménager': '🔌',
        'Pièces détachées': '⚙️',
        'Santé & Beauté': '💄'
      }

      const categoriesWithEmojis = categories.map(cat => ({
        name: cat._id,
        emoji: categoryEmojis[cat._id] || '🏪',
        count: cat.count,
        totalViews: cat.totalViews || 0,
        totalFavorites: cat.totalFavorites || 0,
        totalProducts: cat.totalProducts || 0
      }))

      // Contar total de stores
      const totalStores = await Store.countDocuments({ isActive: true })

      res.json({
        success: true,
        categories: categoriesWithEmojis,
        totalStores,
        stats: {
          totalViews: categories.reduce((sum, cat) => sum + (cat.totalViews || 0), 0),
          totalFavorites: categories.reduce((sum, cat) => sum + (cat.totalFavorites || 0), 0),
          totalProducts: categories.reduce((sum, cat) => sum + (cat.totalProducts || 0), 0)
        }
      })

    } catch (err) {
      console.error('❌ Error en getStoreCategoriesStats:', err)
      res.status(500).json({
        success: false,
        msg: 'Error al obtener estadísticas'
      })
    }
  },

  // 👤 Obtener stores por usuario (pública)
  getPublicStoresByUser: async (req, res) => {
    try {
      const { id } = req.params
      const { page = 1, limit = 12 } = req.query

      const stores = await Store.find({
        owner: id,
        isActive: true
      })
        .select('-socialLinks -planFeatures -verified -__v')
        .populate('owner', 'name avatar username')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))

      const total = await Store.countDocuments({ owner: id, isActive: true })

      // Obtener info del usuario
      const user = await User.findById(id).select('name avatar username email')

      res.json({
        success: true,
        stores,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        user
      })

    } catch (err) {
      console.error('❌ Error en getPublicStoresByUser:', err)
      res.status(500).json({
        success: false,
        msg: 'Error al obtener boutiques de l\'utilisateur'
      })
    }
  },

  // 🏪 Obtener una store específica (pública)
  getPublicStoreById: async (req, res) => {
    try {
      const { id } = req.params

      const store = await Store.findById(id)
        .select('-socialLinks -__v') // Excluir campos sensibles
        .populate('owner', 'name avatar username email phone')

      if (!store) {
        return res.status(404).json({
          success: false,
          msg: 'Boutique non trouvée'
        })
      }

      if (!store.isActive) {
        return res.status(403).json({
          success: false,
          msg: 'Cette boutique n\'est pas active'
        })
      }

      // Incrementar vistas
      store.stats.totalViews += 1
      await store.save()

      // Obtener stores similares (misma categoría)
      const similarStores = await Store.find({
        _id: { $ne: store._id },
        category: store.category,
        isActive: true
      })
        .select('name category plan stats logoUrl')
        .limit(4)
        .sort({ 'stats.totalViews': -1 })

      res.json({
        success: true,
        store,
        similarStores,
        ownerInfo: store.owner
      })

    } catch (err) {
      console.error('❌ Error en getPublicStoreById:', err)
      res.status(500).json({
        success: false,
        msg: 'Error al obtener la boutique'
      })
    }
  },

  getMyStore: async (req, res) => {
    console.log('=== 🛒 getMyStore ===')
    console.log('Usuario:', req.user._id)
    
    try {
      // Buscar la tienda del usuario autenticado
      const store = await Store.findOne({ owner: req.user._id })
        .populate('owner', 'username email avatar name')
      
      if (!store) {
        return res.status(404).json({
          success: false,
          msg: 'No tienes una tienda creada'
        })
      }
      
      console.log('✅ Tienda encontrada:', store._id)
      
      res.json({
        success: true,
        store
      })
      
    } catch (err) {
      console.error('❌ Error en getMyStore:', err)
      res.status(500).json({
        success: false,
        msg: 'Error del servidor'
      })
    }
  },
  
  // 🔄 ACTIVAR/DESACTIVAR TIENDA (toggle isActive)
  toggleStoreActive: async (req, res) => {
    console.log('=== 🔄 toggleStoreActive ===')
    console.log('Store ID:', req.params.id)
    console.log('Usuario:', req.user._id)
    
    try {
      // Buscar la tienda y verificar que pertenece al usuario
      const store = await Store.findOne({
        _id: req.params.id,
        owner: req.user._id
      })
      
      if (!store) {
        return res.status(404).json({
          success: false,
          msg: 'Tienda no encontrada o no autorizado'
        })
      }
      
      // Cambiar el estado
      store.isActive = !store.isActive
      await store.save()
      
      console.log('✅ Estado actualizado:', {
        id: store._id,
        name: store.name,
        isActive: store.isActive
      })
      
      res.json({
        success: true,
        msg: `Tienda ${store.isActive ? 'activada' : 'desactivada'} correctamente`,
        store
      })
      
    } catch (err) {
      console.error('❌ Error en toggleStoreActive:', err)
      res.status(500).json({
        success: false,
        msg: 'Error del servidor'
      })
    }
  },
  
  // 🔍 OBTENER TIENDAS POR CATEGORÍA (para la ruta /stores/category/:category)
  getStoresByStoreCategory: async (req, res) => {
    console.log('=== 🏪 getStoresByStoreCategory ===')
    console.log('Categoría:', req.params.category)
    
    try {
      const { category } = req.params
      const { page = 1, limit = 12, sort = 'newest' } = req.query
      
      // Si no hay categoría, obtener todas las tiendas
      const query = category && category !== 'stores' 
        ? { category, isActive: true }
        : { isActive: true }
      
      // Ordenamiento
      let sortOption = { createdAt: -1 }
      if (sort === 'views') sortOption = { 'stats.totalViews': -1 }
      if (sort === 'favorites') sortOption = { 'stats.totalFavorites': -1 }
      if (sort === 'products') sortOption = { 'stats.totalProducts': -1 }
      if (sort === 'name') sortOption = { name: 1 }
      
      // Paginación
      const skip = (parseInt(page) - 1) * parseInt(limit)
      
      const [stores, total] = await Promise.all([
        Store.find(query)
          .populate('owner', 'username name avatar')
          .sort(sortOption)
          .skip(skip)
          .limit(parseInt(limit)),
        Store.countDocuments(query)
      ])
      
      console.log(`✅ Encontradas ${stores.length} tiendas (total: ${total})`)
      
      res.json({
        success: true,
        stores,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        hasMore: skip + stores.length < total
      })
      
    } catch (err) {
      console.error('❌ Error en getStoresByStoreCategory:', err)
      res.status(500).json({
        success: false,
        msg: 'Error al obtener tiendas por categoría'
      })
    }
  },
  
  // 📊 OBTENER ESTADÍSTICAS DE MI TIENDA
  getMyStoreStats: async (req, res) => {
    console.log('=== 📊 getMyStoreStats ===')
    
    try {
      const store = await Store.findOne({ owner: req.user._id })
      
      if (!store) {
        return res.status(404).json({
          success: false,
          msg: 'No tienes una tienda creada'
        })
      }
      
      // Obtener productos de la tienda
      const products = await Post.countDocuments({
        user: req.user._id,
        isActive: true
      })
      
      // Obtener vistas de productos
      const productsViews = await Post.aggregate([
        { $match: { user: req.user._id, isActive: true } },
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
      ])
      
      res.json({
        success: true,
        stats: {
          store: store.stats,
          products: {
            total: products,
            totalViews: productsViews[0].totalViews || 0
          },
          plan: store.plan,
          credits: store.credits,
            storage: store.storage
        }
      })
      
    } catch (err) {
      console.error('❌ Error en getMyStoreStats:', err)
      res.status(500).json({
        success: false,
        msg: 'Error del servidor'
      })
    }
  }


}

module.exports = storeCtrl