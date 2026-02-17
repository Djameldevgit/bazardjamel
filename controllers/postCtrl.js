// 📂 controllers/postController.js
const Post = require('../models/postModel');
const Category = require('../models/categoryModel');
const User = require('../models/userModel');
const Boutique = require('../models/boutiqueModel');
const mongoose = require('mongoose');

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  paginating() {
    const page = parseInt(this.queryString.page) || 1;
    const limit = parseInt(this.queryString.limit) || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary
cloudinary.config({
    cloud_name: 'dfjipgj2o',
    api_key: '213981915435275',
    api_secret: 'wv_IiCM9zzhdiWDNXXo8HZi7wX4'
});
const postCtrl = {
 // 📂 controllers/postController.js
// 📂 controllers/postCtrl.js
 createPost : async (req, res) => {
  try {
    const userId = req.user._id;
    
    // 1. Validación mínima
    const { categorie, subCategory, title, wilaya, commune, images } = req.body;
    if (!categorie || !subCategory || !title || !wilaya || !commune || !images) {
      return res.status(400).json({ msg: "Champs requis manquants" });
    }

    // 2. Buscar categoría rápidamente
    const category = await Category.findOne({ 
      $or: [
        { slug: categorie },
        { slug: subCategory }
      ],
      isActive: true 
    }).select('_id').lean();

    if (!category) {
      return res.status(404).json({ msg: "Catégorie non trouvée" });
    }

    // 3. Crear post directamente
    const postData = {
      user: userId,
      categorie: categorie.trim(),
      subCategory: subCategory.trim(),
      articleType: (req.body.articleType || '').trim(),
      category: category._id,
      title: title.trim(),
      description: (req.body.description || '').trim(),
      price: parseFloat(req.body.price) || 0,
      etat: req.body.etat || 'occasion',
      wilaya: wilaya.toString().trim(),
      commune: commune.toString().trim(),
      phone: (req.body.phone || '').trim(),
      email: (req.body.email || '').trim().toLowerCase(),
      address: (req.body.address || '').trim(),
      images: images,
      categorySpecificData: req.body.categorySpecificData || {}
    };

    const newPost = new Post(postData);
    await newPost.save();

    // 4. Actualizar contador (en segundo plano)
    Category.findByIdAndUpdate(category._id, { 
      $inc: { postCount: 1 } 
    }).catch(() => {});

    // 5. Respuesta rápida
    res.status(201).json({
      success: true,
      newPost: {
        _id: newPost._id,
        title: newPost.title,
        images: newPost.images,
        user: {
          _id: req.user._id,
          username: req.user.username,
          avatar: req.user.avatar
        }
      }
    });

  } catch (err) {
    console.error('❌ createPost error:', err.message);
    res.status(500).json({ msg: "Erreur serveur" });
  }
},



   /*filterPosts: async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const { category: categorySlug, sub: subSlug, article: articleSlug } = req.query;

    console.log('🔍 filterPosts - Parámetros:', {
      category: categorySlug,
      sub: subSlug,
      article: articleSlug,
      page: page,
      limit: limit
    });

    if (!categorySlug) {
      return res.json({
        success: true,
        posts: [],
        total: 0,
        page: page,
        hasMore: false,
        message: 'Se requiere categoría'
      });
    }

    // 1. Buscar categoría nivel 1
    const categoryDoc = await Category.findOne({ 
      slug: categorySlug, 
      level: 1, 
      isActive: true 
    }).lean();

    if (!categoryDoc) {
      return res.json({
        success: true,
        posts: [],
        total: 0,
        page: page,
        hasMore: false,
        message: 'Categoría no encontrada'
      });
    }

    // 2. Construir filtro base
    const filter = { 
      category: categoryDoc._id, 
      isActive: true 
    };

    // 3. 🎯 LÓGICA MEJORADA PARA SUBCATEGORÍAS
    if (subSlug) {
      // Buscar la subcategoría en la colección Category
      const subCategoryDoc = await Category.findOne({
        slug: subSlug,
        level: 2,
        isActive: true
      }).lean();

      if (subCategoryDoc) {
        console.log('✅ Subcategoría encontrada:', {
          slug: subCategoryDoc.slug,
          name: subCategoryDoc.name
        });

        // 🎯 OPCIÓN 1: Buscar por subCategory = nombre de subcategoría
        // 🎯 OPCIÓN 2: Buscar por articleType que contenga el slug de subcategoría
        // 🎯 OPCIÓN 3: Buscar artículos (nivel 3) que pertenezcan a esta subcategoría
        const subName = subCategoryDoc.name;
        
        // Primero, obtener todos los artículos (nivel 3) de esta subcategoría
        const articlesOfSub = await Category.find({
          parent: subCategoryDoc._id,
          level: 3,
          isActive: true
        }).lean();

        console.log('📊 Artículos de esta subcategoría:', 
          articlesOfSub.map(a => ({ slug: a.slug, name: a.name }))
        );

        // Crear array de condiciones $or
        const orConditions = [];

        // Condición 1: subCategory exacto
        orConditions.push({ subCategory: subName });

        // Condición 2: articleType contiene el slug de subcategoría
        orConditions.push({ articleType: { $regex: subSlug, $options: 'i' } });

        // Condición 3: articleType igual al slug de algún artículo de esta subcategoría
        if (articlesOfSub.length > 0) {
          const articleSlugs = articlesOfSub.map(a => a.slug);
          orConditions.push({ articleType: { $in: articleSlugs } });
          
          // Condición 4: subCategory igual al nombre de algún artículo de esta subcategoría
          const articleNames = articlesOfSub.map(a => a.name);
          orConditions.push({ subCategory: { $in: articleNames } });
        }

        filter.$or = orConditions;

        console.log('🎯 Condiciones de búsqueda ($or):');
        orConditions.forEach((cond, i) => {
          console.log(`${i+1}. ${JSON.stringify(cond)}`);
        });

      } else {
        console.log('⚠️ Subcategoría no encontrada en DB');
        filter.subCategory = subSlug;
      }
    }

    // 4. 🎯 LÓGICA PARA ARTÍCULOS (NIVEL 3)
    if (articleSlug) {
      // Buscar el artículo en la colección Category
      const articleCategoryDoc = await Category.findOne({
        slug: articleSlug,
        level: 3,
        isActive: true
      }).lean();

      if (articleCategoryDoc) {
        console.log('✅ Artículo encontrado:', {
          slug: articleCategoryDoc.slug,
          name: articleCategoryDoc.name
        });

        // 🎯 Buscar por articleType (slug) O por subCategory (nombre)
        filter.$and = [
          { 
            $or: [
              { articleType: articleSlug },          // Por slug
              { subCategory: articleCategoryDoc.name }  // Por nombre (caso "Robes")
            ]
          }
        ];

        console.log('🎯 Buscando posts con:');
        console.log(`   articleType: "${articleSlug}"`);
        console.log(`   O subCategory: "${articleCategoryDoc.name}"`);

      } else {
        console.log('⚠️ Artículo no encontrado en DB');
        filter.articleType = articleSlug;
      }
    }

    // 🎯 LIMPIAR FILTRO: Si tenemos $and y $or, asegurarse de que se combinen correctamente
    if (filter.$or && filter.$and) {
      // Combinar $and con condiciones existentes
      const existingAnd = filter.$and || [];
      filter.$and = [...existingAnd, { $or: filter.$or }];
      delete filter.$or;
    }

    console.log('🎯 Filtro MongoDB final:', JSON.stringify(filter, null, 2));

    // 5. Obtener posts paginados
    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id title price images createdAt wilaya commune description etat views category subCategory articleType')
        .populate('user', 'username avatar')
        .lean(),
      Post.countDocuments(filter)
    ]);

    // 6. Calcular hasMore
    const hasMore = page * limit < total;
    const totalPages = Math.ceil(total / limit);

    console.log('📊 Resultados:', {
      page: page,
      postsEncontrados: posts.length,
      totalPosts: total,
      hasMore: hasMore
    });

    // 7. Obtener subcategorías (nivel 2) para el slider
    const children = await Category.find({ 
      parent: categoryDoc._id, 
      level: 2, 
      isActive: true 
    })
      .select('_id name slug level emoji icon iconType iconColor bgColor hasChildren isLeaf')
      .sort({ order: 1 })
      .lean();

    // 8. Obtener artículos (nivel 3) para el slider
    const articles = await Category.find({ 
      parent: { $in: children.map(c => c._id) }, 
      level: 3, 
      isActive: true 
    })
      .select('_id name slug level parent emoji icon iconType iconColor bgColor hasChildren isLeaf')
      .sort({ order: 1 })
      .lean();

    // 9. Formatear para el frontend
    const childrenFormatted = children.map(c => ({
      ...c,
      articles: articles.filter(a => String(a.parent) === String(c._id))
    }));

    // 10. Preparar respuesta
    const response = {
      success: true,
      posts: posts,
      total: total,
      page: page,
      limit: limit,
      hasMore: hasMore,
      totalPages: totalPages,
      categoryInfo: {
        _id: categoryDoc._id,
        name: categoryDoc.name,
        slug: categoryDoc.slug,
        level: categoryDoc.level,
        emoji: categoryDoc.emoji || '',
        icon: categoryDoc.icon || '',
        iconType: categoryDoc.iconType || 'image-png',
        iconColor: categoryDoc.iconColor || '#666666',
        bgColor: categoryDoc.bgColor || '#FFFFFF'
      },
      children: childrenFormatted
    };

    // 11. Debug detallado
    if (posts.length > 0) {
      console.log('✅ Posts encontrados:');
      posts.slice(0, 3).forEach((post, i) => {
        console.log(`${i+1}. ${post.title}`);
        console.log(`   subCategory: "${post.subCategory}"`);
        console.log(`   articleType: "${post.articleType}"`);
      });
    } else {
      console.log('⚠️ No se encontraron posts');
      console.log('💡 Filtro aplicado:', JSON.stringify(filter, null, 2));
      
      // Debug extra: ver posts sin filtro
      const allPosts = await Post.find({ 
        category: categoryDoc._id, 
        isActive: true 
      })
        .select('title subCategory articleType')
        .limit(5)
        .lean();
      
      console.log('🔍 Primeros 5 posts en esta categoría:');
      allPosts.forEach((post, i) => {
        console.log(`${i+1}. ${post.title}`);
        console.log(`   subCategory: "${post.subCategory}"`);
        console.log(`   articleType: "${post.articleType}"`);
      });
    }

    return res.json(response);

  } catch (error) {
    console.error('❌ Error en filterPosts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al filtrar posts', 
      error: error.message 
    });
  }
},
   */
// 📂 controllers/postCtrl.js - filterPosts VERSIÓN UNIFICADA (POSTS + BOUTIQUES)
filterPosts: async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const { category: categorySlug, sub: subSlug, article: articleSlug } = req.query;

    console.log('🔍 filterPosts - Parámetros:', {
      category: categorySlug,
      sub: subSlug,
      article: articleSlug,
      page, limit
    });

    if (!categorySlug) {
      return res.json({
        success: true,
        posts: [],
        total: 0,
        page,
        hasMore: false,
        message: 'Se requiere categoría'
      });
    }

    // 1. Buscar categoría nivel 1
    const categoryDoc = await Category.findOne({ 
      slug: categorySlug, 
      level: 1, 
      isActive: true 
    }).lean();

    if (!categoryDoc) {
      return res.json({
        success: true,
        posts: [],
        total: 0,
        page,
        hasMore: false,
        message: 'Categoría no encontrada'
      });
    }

    // 2. Obtener subcategorías y artículos
    const [allSubCategories, allArticles] = await Promise.all([
      Category.find({ parent: categoryDoc._id, level: 2, isActive: true }).lean(),
      Category.find({ level: 3, isActive: true }).lean()
    ]);

    // 3. FILTRO BASE - TODOS los posts de la categoría
    const filter = { 
      isActive: true,
      $or: [
        { category: categoryDoc._id },
        { categorie: { $regex: new RegExp(categoryDoc.name, 'i') } }
      ]
    };

    // 4. Si hay subcategoría
    if (subSlug) {
      const subCategoryDoc = allSubCategories.find(
        sub => sub.slug === subSlug || sub.name.toLowerCase() === subSlug.toLowerCase()
      );

      if (subCategoryDoc) {
        console.log('✅ Subcategoría:', subCategoryDoc.name);

        // Obtener TODOS los artículos de esta subcategoría
        const articlesOfSub = allArticles.filter(
          article => String(article.parent) === String(subCategoryDoc._id)
        );

        // Construir slugs a buscar
        const searchSlugs = [
          subCategoryDoc.slug,
          ...articlesOfSub.map(a => a.slug)
        ];

        console.log('🔍 Buscando posts con slugs:', searchSlugs);

        // Filtrar posts que tengan estos slugs en subCategory O articleType
        filter.$and = [{
          $or: [
            { subCategory: { $in: searchSlugs } },
            { articleType: { $in: searchSlugs } }
          ]
        }];
      }
    }

    // 5. Si hay artículo (sobreescribe subcategoría)
    if (articleSlug) {
      const articleDoc = allArticles.find(
        article => article.slug === articleSlug || article.name.toLowerCase() === articleSlug.toLowerCase()
      );

      if (articleDoc) {
        console.log('✅ Artículo:', articleDoc.name);
        
        filter.$and = [{
          $or: [
            { subCategory: articleDoc.slug },
            { articleType: articleDoc.slug }
          ]
        }];
      }
    }

    console.log('🎯 FILTRO FINAL:', JSON.stringify(filter, null, 2));

    // 6. Ejecutar consulta
    const [posts, total] = await Promise.all([
      Post.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('_id title price images createdAt wilaya commune description etat views categorie subCategory articleType category')
        .populate('user', 'username avatar')
        .lean(),
      Post.countDocuments(filter)
    ]);

    console.log(`📊 Encontrados: ${posts.length} de ${total}`);

    // 7. Preparar slider
    const childrenWithArticles = allSubCategories.map(child => ({
      ...child,
      articles: allArticles.filter(a => String(a.parent) === String(child._id)),
      isLeaf: false
    }));

    res.json({
      success: true,
      posts,
      total,
      page,
      limit,
      hasMore: page * limit < total,
      totalPages: Math.ceil(total / limit),
      categoryInfo: {
        _id: categoryDoc._id,
        name: categoryDoc.name,
        slug: categoryDoc.slug,
        level: categoryDoc.level,
        emoji: categoryDoc.emoji || ''
      },
      children: childrenWithArticles
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al filtrar posts', 
      error: error.message 
    });
  }
},





  getPosts: async (req, res) => {
    try {
      const { page = 1, limit = 9, category } = req.query;
      const skip = (page - 1) * limit;

      // Construir query
      let query = { isActive: true, status: 'active' };

      // Si hay categoría, filtrar
      if (category && category !== 'all') {
        query.categorie = category;
      }

      // Obtener posts
      const posts = await Post.find(query)
        .skip(skip)
        .limit(parseInt(limit))
        .sort('-createdAt')
        .populate("user", "username avatar")
        .populate("categoryRef", "name slug");

      // Contar total
      const total = await Post.countDocuments(query);

      res.json({
        success: true,
        result: posts.length,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / limit),
        posts
      });

    } catch (err) {
      console.error('❌ Error en getPosts:', err);
      return res.status(500).json({
        success: false,
        message: err.message
      });
    }
  },
 
 // controllers/postController.js - updatePost CORREGIDO
updatePost: async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const updateData = req.body;

    console.log('🔄 Actualizando post:', { id, userId: userId.toString() });

    // Buscar el post
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ msg: "Post non trouvé" });
    }

    // Verificar propiedad - ¡CORREGIDO!
    if (post.user.toString() !== userId.toString()) {
      console.log('❌ No autorizado:', {
        postUser: post.user.toString(),
        requestUser: userId.toString()
      });
      return res.status(403).json({ msg: "Non autorisé" });
    }

    // Actualizar campos (solo si existen en updateData)
    const fieldsToUpdate = [
      'categorie', 'subCategory', 'articleType', 'title', 'description',
      'price', 'etat', 'wilaya', 'commune', 'address', 'phone', 'email',
      'images', 'categorySpecificData'
    ];

    fieldsToUpdate.forEach(field => {
      if (updateData[field] !== undefined) {
        post[field] = updateData[field];
      }
    });

    // Guardar cambios
    await post.save();

    // Poblar el usuario para la respuesta
    const updatedPost = await Post.findById(id)
      .populate('user', 'username avatar')
      .lean();

    res.json({
      success: true,
      msg: "Post mis à jour",
      post: updatedPost
    });

  } catch (err) {
    console.error('❌ Error updatePost:', err);
    res.status(500).json({ msg: err.message });
  }
},
   
  getPostById : async (req, res) => {
    try {
      const post = await Post.findById(req.params.id)
        .populate('category', 'name slug level parent'); // 👈 aquí está la clave
  
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
  
      res.json({ success: true, post });
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ error: error.message });
    }
  },
  

  
  getPost: async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        .populate("user likes", "avatar username")
        .populate({
            path: "comments",
            populate: {
                path: "user likes",
                select: "-password"
            }
        })

        if(!post) return res.status(400).json({msg: 'This post does not exist.'})

        res.json({
            post
        })

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
},

  /**
   * 🔎 OBTENER POST POR ID (Alternativa)
   */
 

  /**
   * 👤 POSTS POR USUARIO
   */
  getUserPosts: async (req, res) => {
    try {
      const { id } = req.params; // El ID del usuario
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 6;
      const skip = (page - 1) * limit;

      console.log(`🔍 Buscando posts del usuario ID: ${id}`);
      console.log(`📄 Página: ${page}, Límite: ${limit}`);

      // Validar ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          success: false,
          message: 'ID de usuario inválido'
        });
      }

      // Verificar si el usuario existe
      const userExists = await User.findById(id).select('_id username');
      if (!userExists) {
        return res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      // Query para posts del usuario
      const query = {
        user: new mongoose.Types.ObjectId(id),
        isActive: true
      };

      // Ejecutar búsqueda y conteo en paralelo
      const [posts, total] = await Promise.all([
        Post.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .populate('user', 'username avatar')
          .populate('categoryRef', 'name slug emoji')
          .lean(),
        Post.countDocuments(query)
      ]);

      // Calcular paginación
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      console.log(`✅ Encontrados ${posts.length} posts de ${total} totales`);

      res.json({
        success: true,
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          totalPosts: total,
          hasNextPage,
          hasPrevPage,
          nextPage: hasNextPage ? page + 1 : null,
          prevPage: hasPrevPage ? page - 1 : null
        },
        user: {
          _id: userExists._id,
          username: userExists.username
        }
      });

    } catch (error) {
      console.error('❌ Error en getUserPosts:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener posts del usuario',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  },

  deletePost: async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.user._id;

        // 1. VERIFICAR SI EL USUARIO ES EL DUEÑO O ADMIN
        const post = await Posts.findById(postId);
        
        if (!post) {
            return res.status(404).json({msg: 'Post not found'});
        }

        if (post.user.toString() !== userId.toString() && req.user.role !== 'admin') {
            return res.status(403).json({msg: 'Not authorized to delete this post'});
        }

        console.log('🗑️ Eliminando post y sus imágenes:', post.images);

        // 2. BORRAR TODAS LAS IMÁGENES DEL POST DE CLOUDINARY
        if (post.images && post.images.length > 0) {
            for (const image of post.images) {
                if (image.public_id) {
                    try {
                        await cloudinary.uploader.destroy(image.public_id);
                        console.log('✅ Imagen borrada de Cloudinary:', image.public_id);
                    } catch (cloudinaryErr) {
                        console.error('❌ Error borrando imagen de Cloudinary:', image.public_id, cloudinaryErr);
                        // Continuar aunque falle una imagen
                    }
                }
            }
        }

        // 3. GUARDAR IDs DE COMMENTS Y LIKES ANTES DE ELIMINAR
        const commentsToDelete = post.comments || [];
        const likesToCleanup = post.likes || [];

        // 4. ELIMINAR EL POST DE MONGODB
        await Posts.findByIdAndDelete(postId);

        // 5. LIMPIAR DATOS RELACIONADOS
        if (commentsToDelete.length > 0) {
            await Comments.deleteMany({_id: {$in: commentsToDelete}});
        }

        // 6. OPCIONAL: Limpiar likes de usuarios
        if (likesToCleanup.length > 0) {
            await Users.updateMany(
                {_id: {$in: likesToCleanup}},
                {$pull: {likes: postId}}
            );
        }

        // 7. OPCIONAL: Eliminar de posts guardados
        await Users.updateMany(
            {saved: postId},
            {$pull: {saved: postId}}
        );

        res.json({
            msg: 'Post deleted successfully!',
            deletedPostId: postId,
            deletedImagesCount: post.images ? post.images.length : 0
        });

    } catch (err) {
        console.error('Error in deletePost:', err);
        return res.status(500).json({msg: err.message});
    }
},
  getFeaturedPosts: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 6;
      const posts = await Post.find({
        isActive: true,
        isPromoted: true
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .populate('user', 'username avatar')
        .populate('categoryRef', 'name slug emoji')
        .lean();

      res.json({
        success: true,
        featuredPosts: posts
      });
    } catch (error) {
      console.error('Error en getFeaturedPosts:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener destacados',
        error: error.message
      });
    }
  },

  /**
   * 📅 POSTS RECIENTES
   */
  getRecentPosts: async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 20;
      const posts = await Post.find({
        isActive: true
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .select('title images price etat createdAt wilaya commune')
        .populate('user', 'username avatar')
        .populate('categoryRef', 'name slug emoji')
        .lean();

      res.json({
        success: true,
        recentPosts: posts,
        total: posts.length
      });
    } catch (error) {
      console.error('Error en getRecentPosts:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener posts recientes',
        error: error.message
      });
    }
  },

  /**
   * 🔍 BUSCAR POSTS
   */
  searchPosts: async (req, res) => {
    try {
      const { query } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      const skip = (page - 1) * limit;

      const searchQuery = {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { categorie: { $regex: query, $options: 'i' } },
          { subCategory: { $regex: query, $options: 'i' } }
        ],
        isActive: true,
        status: 'active'
      };

      const [posts, total] = await Promise.all([
        Post.find(searchQuery)
          .skip(skip)
          .limit(limit)
          .sort({ createdAt: -1 })
          .populate('user', 'username avatar')
          .populate('categoryRef', 'name slug')
          .lean(),
        Post.countDocuments(searchQuery)
      ]);

      res.json({
        success: true,
        posts,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalPosts: total,
          hasMore: page * limit < total
        },
        query
      });
    } catch (error) {
      console.error('Error en searchPosts:', error);
      res.status(500).json({
        success: false,
        message: 'Error en búsqueda',
        error: error.message
      });
    }
  },

  /**
   * 🛒 MARCAR COMO VENDIDO
   */
  markAsSold: async (req, res) => {
    try {
      const { id } = req.params;

      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({
          success: false,
          message: 'Post no encontrado'
        });
      }

      // Verificar propiedad
      if (req.user && post.user && req.user._id && post.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'No autorizado'
        });
      }

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        {
          $set: {
            status: 'sold',
            soldAt: new Date()
          }
        },
        { new: true }
      );

      res.json({
        success: true,
        message: 'Post marcado como vendido',
        post: updatedPost
      });

    } catch (error) {
      console.error('Error en markAsSold:', error);
      res.status(500).json({
        success: false,
        message: 'Error al marcar como vendido',
        error: error.message
      });
    }
  },

  // controllers/postController.js - getSimilarPosts CORREGIDO
// controllers/postCtrl.js
getSimilarPosts: async (req, res) => {
  try {
    console.log('📥 getSimilarPosts - Query:', req.query);

    const {
      categorie,
      subCategory,
      excludeId,
      limit = 6,
      page = 1
    } = req.query;

    // Validación
    if (!categorie || !subCategory) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere categorie y subCategory'
      });
    }

    // Construir query
    let query = {
      categorie: categorie.trim(),
      subCategory: subCategory.trim(),
      isActive: true
    };

    // Excluir post actual
    if (excludeId && excludeId.match(/^[0-9a-fA-F]{24}$/)) {
      query._id = { $ne: excludeId };
    }

    console.log('🔍 Query:', query);

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Buscar posts
    const posts = await Post.find(query)
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      posts,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      hasMore: page * limit < total
    });

  } catch (error) {
    console.error('❌ getSimilarPosts error:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor',
      error: error.message
    });
  }
},
   
  healthCheck: async (req, res) => {
    try {
      // Verificar conexión a MongoDB
      const dbStatus = mongoose.connection.readyState;
      const dbStatusText =
        dbStatus === 0 ? 'disconnected' :
          dbStatus === 1 ? 'connected' :
            dbStatus === 2 ? 'connecting' :
              dbStatus === 3 ? 'disconnecting' : 'unknown';

      res.json({
        success: true,
        message: 'API de posts funcionando correctamente',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        database: {
          status: dbStatusText,
          connected: dbStatus === 1
        },
        environment: process.env.NODE_ENV || 'development'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error en health check',
        error: error.message
      });
    }
  }
};

module.exports = postCtrl;