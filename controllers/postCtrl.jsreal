const Posts = require('../models/postModel')
const Comments = require('../models/commentModel')
const Users = require('../models/userModel')
const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary
cloudinary.config({
    cloud_name: 'dfjipgj2o',
    api_key: '213981915435275',
    api_secret: 'wv_IiCM9zzhdiWDNXXo8HZi7wX4'
});
class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 9
        const skip = (page - 1) * limit
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

const postCtrl = {
 // 📄 controllers/postController.js - createPost
createPost: async (req, res) => {
    try {
      const { postData, images } = req.body;
      
      if (!images || images.length === 0) {
        return res.status(400).json({msg: "Veuillez ajouter au moins une photo."})
    }

    if (!postData.subCategory) {
        return res.status(400).json({msg: "La sous-catégorie est requise."})
    }
      
      const commonFields = [
        'categorie', 'subCategory', 'articleType',
       
      ];
      
      const commonData = {};
      const specificData = {};
      
      Object.keys(postData).forEach(key => {
        if (commonFields.includes(key)) {
          commonData[key] = postData[key];
        } else {
          specificData[key] = postData[key];
        }
      });
      
      // ✅ CREAR POST CON ESTRUCTURA CORRECTA
      const newPost = new Posts({
        ...commonData,
        categorySpecificData: specificData, // ← ¡Nombre consistente!
        images: images,
        user: req.user._id,
        likes: [],
      });
      
      await newPost.save();
      
      res.json({
        msg: 'Post créé avec succès!',
        newPost
      });
    } catch (err) {
        console.error('Error en creePost:', err);
        return res.status(500).json({msg: err.message});
    }
  },
   
   // 📄 controllers/postController.js - updatePost
updatePost: async (req, res) => {
    try {
      const { postData, images } = req.body;
      
      // 1. Obtener el post actual
      const oldPost = await Posts.findById(req.params.id);
      if (!oldPost) {
        return res.status(400).json({msg: "Ce post n'existe pas."});
      }
      
      // 2. Separar campos base de campos específicos
      const commonFields = [
        'categorie', 'subCategory', 'articleType',
        
      ];
      
      const updateData = {};
      const specificData = {};
      
      Object.keys(postData).forEach(key => {
        if (commonFields.includes(key)) {
          updateData[key] = postData[key];
        } else {
          specificData[key] = postData[key];
        }
      });
      
      // 3. Añadir categorySpecificData al updateData
      if (Object.keys(specificData).length > 0) {
        updateData.categorySpecificData = specificData;
      }
      
      // 4. Añadir imágenes
      updateData.images = images || postData.images;
      
      console.log('🔄 Datos para actualizar:', {
        updateData,
        specificDataKeys: Object.keys(specificData)
      });
      
      // 5. Actualizar en MongoDB
      const post = await Posts.findOneAndUpdate(
        { _id: req.params.id },
        { $set: updateData },
        { new: true, runValidators: true }
      );
      
      // 6. Populate
      await post.populate('user', 'avatar username');
      
      res.json({
        msg: 'Post modifié avec succès!',
        newPost: post
      });
      
    } catch (err) {
      console.error('Error en updatePost:', err);
      return res.status(500).json({msg: err.message});
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
    getPosts: async (req, res) => {
        try {
            const { 
                subCategory, 
                title,           // 🆕 Nombre del producto
                talla,           // 🆕 Talla
                genero,          // 🆕 Género
                color,           // 🆕 Color
                marca,           // 🆕 Marca
                estado,          // 🆕 Estado/condición
                minPrice,        // Precio mínimo
                maxPrice,        // Precio máximo
                sort
            } = req.query;
    
            // 🔹 INICIALIZAR QUERY
            const query = {};
    
            // 🔹 Filtros directos
            if (subCategory && subCategory.trim() !== "") {
                query.subCategory = { $regex: subCategory.trim(), $options: "i" };
            }
    
            // 🆕 BÚSQUEDA POR TÍTULO/NOMBRE DEL PRODUCTO
            if (title && title.trim() !== "") {
                const searchTitle = title.trim();
                query.$or = query.$or || [];
                query.$or.push(
                    { title: { $regex: searchTitle, $options: "i" } },
                    { description: { $regex: searchTitle, $options: "i" } },
                    { content: { $regex: searchTitle, $options: "i" } }
                );
            }
    
            // 🆕 FILTRO POR TALLA
            if (talla && talla.trim() !== "") {
                const searchTalla = talla.trim();
                query.$or = query.$or || [];
                query.$or.push(
                    { talla: { $regex: searchTalla, $options: "i" } },
                    { tallaSaco: { $regex: searchTalla, $options: "i" } }
                );
            }
    
            // 🆕 FILTRO POR GÉNERO
            if (genero && genero.trim() !== "") {
                query.genero = { $regex: genero.trim(), $options: "i" };
            }
    
            // 🆕 FILTRO POR COLOR
            if (color && color.trim() !== "") {
                const searchColor = color.trim();
                query.$or = query.$or || [];
                query.$or.push(
                    { color: { $regex: searchColor, $options: "i" } },
                    { tipocolor: { $regex: searchColor, $options: "i" } }
                );
            }
    
            // 🆕 FILTRO POR MARCA
            if (marca && marca.trim() !== "") {
                query.marca = { $regex: marca.trim(), $options: "i" };
            }
    
            // 🆕 FILTRO POR ESTADO/CONDICIÓN
            if (estado && estado.trim() !== "") {
                query.etat = { $regex: estado.trim(), $options: "i" };
            }
    
            // 🆕 FILTRO POR RANGO DE PRECIOS - MEJORADO PARA ROPA
            if (minPrice || maxPrice) {
                const priceFilter = {};
                
                if (minPrice) {
                    const min = parseFloat(minPrice);
                    if (!isNaN(min)) {
                        priceFilter.$gte = min;
                    }
                }
                
                if (maxPrice) {
                    const max = parseFloat(maxPrice);
                    if (!isNaN(max)) {
                        priceFilter.$lte = max;
                    }
                }
                
                // Solo aplicar filtro si hay precios válidos
                if (Object.keys(priceFilter).length > 0) {
                    // Buscar en múltiples campos de precio para ropa
                    query.$or = query.$or || [];
                    query.$or.push(
                        { price: priceFilter },
                        { precioBase: priceFilter }
                    );
                }
            }
    
            // 🔥 Optimizar consulta si hay múltiples condiciones OR
            if (query.$or && query.$or.length === 0) {
                delete query.$or;
            }
    
            // 🔥 Mantener paginación con APIfeatures
            const features = new APIfeatures(Posts.find(query), req.query).paginating();
    
            // ✅ MANEJO DEL SORT
            let sortOption = "-createdAt";
            if (sort && sort === "-createdAt") {
                sortOption = "-createdAt";
            }
    
            const posts = await features.query
                .sort(sortOption)
                .populate("user likes", "avatar username")
               
            res.json({
                msg: "Success!",
                result: posts.length,
                posts,
            });
        } catch (err) {
            console.error("Error en getPosts:", err);
            return res.status(500).json({ msg: err.message });
        }
    },

// controllers/postCtrl.js - VERSIÓN SIMPLIFICADA SIN findSimilarPosts
 // controllers/postCtrl.js - VERSIÓN CORRECTA

  getSimilarPosts : async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Encontrar el post actual
        const currentPost = await Posts.findById(id);
        if (!currentPost) {
            return res.status(404).json({ 
                msg: 'Post non trouvé',
                posts: []
            });
        }
        
        // 2. Usar la función auxiliar findSimilarPosts ✅
        const similarPosts = await findSimilarPosts(currentPost);  // ← AHORA SÍ FUNCIONA
        
        res.json({
            msg: 'Success!',
            result: similarPosts.length,
            posts: similarPosts
        });
        
    } catch (err) {
        console.error('Error en getSimilarPosts:', err);
        res.status(500).json({ 
            msg: 'Erreur serveur',
            posts: []
        });
    }
},

// 3. Función auxiliar (NO es controlador de ruta)
  findSimilarPosts : async (currentPost) => {
    const { 
        _id, 
        categorie, 
        subCategory, 
        wilaya, 
        price,
        categorySpecificData 
    } = currentPost;

    // Base de la consulta
    const baseQuery = {
        _id: { $ne: _id },
        isActive: true
    };

    // Verificar si categorySpecificData existe
    const marque = categorySpecificData.get('marque');
    const modele = categorySpecificData.get('modele');
    const etat = categorySpecificData.get('etat');

    const orConditions = [];

    if (categorie && subCategory) {
        orConditions.push({ categorie, subCategory });
    }
    if (categorie && wilaya) {
        orConditions.push({ categorie, wilaya });
    }
    if (categorie && etat) {
        orConditions.push({ 
            categorie, 
            'categorySpecificData.etat': etat 
        });
    }
    if (categorie && marque) {
        orConditions.push({ 
            categorie, 
            'categorySpecificData.marque': marque 
        });
    }
    if (categorie && price) {
        const minPrice = price * 0.7;
        const maxPrice = price * 1.3;
        orConditions.push({
            categorie,
            price: { $gte: minPrice, $lte: maxPrice }
        });
    }

    if (orConditions.length === 0 && categorie) {
        orConditions.push({ categorie });
    }

    if (orConditions.length > 0) {
        baseQuery.$or = orConditions;
    }

    return await Posts.find(baseQuery)
        .sort({
            isPromoted: -1,
            isUrgent: -1,
            createdAt: -1
        })
        .limit(6)
        .populate("user", "avatar username fullname telefono")
        .select("title description price wilaya commune categorie subCategory categorySpecificData images views createdAt isPromoted isUrgent");
},

// 4. Controlador para categoría (actualizado con skip para paginación)
  getPostsByCategory : async (req, res) => {
    try {
        const { categorie } = req.params;
        const { limit = 6, skip = 0, excludeId } = req.query;
        
        const query = {
            categorie: categorie,
            isActive: true
        };
        
        if (excludeId) {
            query._id = { $ne: excludeId };
        }
        
        const posts = await Posts.find(query)
            .sort({ createdAt: -1 })
            .skip(parseInt(skip))
            .limit(parseInt(limit))
            .populate("user", "avatar username")
            .select("title price wilaya images categorie subCategory categorySpecificData views createdAt");
        
        res.json({
            msg: 'Success!',
            result: posts.length,
            posts,
            hasMore: posts.length >= parseInt(limit)
        });
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
},

// 5. EXPORTAR (solo los controladores de ruta)
 
 




    likePost: async (req, res) => {
        try {
            const post = await Posts.find({_id: req.params.id, likes: req.user._id})
            if(post.length > 0) return res.status(400).json({msg: "You liked this post."})

            const like = await Posts.findOneAndUpdate({_id: req.params.id}, {
                $push: {likes: req.user._id}
            }, {new: true})

            if(!like) return res.status(400).json({msg: 'This post does not exist.'})

            res.json({msg: 'Liked Post!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    unLikePost: async (req, res) => {
        try {

            const like = await Posts.findOneAndUpdate({_id: req.params.id}, {
                $pull: {likes: req.user._id}
            }, {new: true})

            if(!like) return res.status(400).json({msg: 'This post does not exist.'})

            res.json({msg: 'UnLiked Post!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
        getUserPosts: async (req, res) => {
            try {
                const features = new APIfeatures(Posts.find({user: req.params.id}), req.query)
                .paginating()
                const posts = await features.query.sort("-createdAt")
    
                res.json({
                    posts,
                    result: posts.length
                })
    
            } catch (err) {
                return res.status(500).json({msg: err.message})
            }
        },
 
 /*getPost : async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
            .populate("user likes", "avatar username fullname followers telefono")
            .populate({
                path: "comments",
                populate: {
                    path: "user likes",
                    select: "-password"
                }
            });

        if (!post) return res.status(400).json({ msg: 'This post does not exist.' });

        // ✅ AHORA findSimilarPosts SÍ está definida
        const similarPosts = await findSimilarPosts(post);

        res.json({
            msg: 'Success!',
            post: {
                ...post._doc,
                similarPostsCount: similarPosts.length
            },
            // Opcional: incluir los posts similares
            similarPosts: similarPosts.slice(0, 3) // Solo primeros 3 para no sobrecargar
        });

    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
},*/
getPost: async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id)
        .populate("user likes", "avatar username fullname followers")
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

  getPostsByCategoryHome : async (req, res) => {
    try {
        const { limit = 6 } = req.query;
        
        // Lista de todas tus categorías
        const categories = [
            'immobilier', 'vehicules', 'telephones', 'informatique',
            'electromenager', 'piecesDetachees', 'vetements', 'alimentaires',
            'sante_beaute', 'meubles', 'services', 'materiaux',
            'loisirs', 'emploi', 'sport', 'voyages'
        ];
        
        const result = {};
        
        // Obtener posts para cada categoría
        for (const categorie of categories) {
            const posts = await Posts.find({
                categorie: categorie,
                isActive: true
            })
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .populate("user", "avatar username")
            .select("title description price wilaya images categorie subCategory categorySpecificData views createdAt");
            
            if (posts.length > 0) {
                result[categorie] = posts;
            }
        }
        
        res.json({
            msg: 'Success!',
            categories: result
        });
        
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
},
    
        viewPost: async (req, res) => {
            try {
                const { id } = req.params;
    
                if (!mongoose.Types.ObjectId.isValid(id)) {
                    return res.status(400).json({ msg: 'ID inválido' });
                }
    
                const postUpdated = await Posts.findByIdAndUpdate(
                    id,
                    { $inc: { views: 1 } },
                    { new: true }
                )
                    .populate("user likes", "avatar username followers")
                    .populate({
                        path: "comments",
                        populate: {
                            path: "user likes",
                            select: "-password"
                        }
                    });
    
                if (!postUpdated) return res.status(404).json({ msg: 'Post no encontrado' });
    
                res.json({ post: postUpdated }); // ✅ enviar post completo
            } catch (err) {
                return res.status(500).json({ msg: err.message });
            }
        },
    
        getPostsDicover: async (req, res) => {
            try {
    
                const newArr = [...req.user.following, req.user._id]
    
                const num  = req.query.num || 9
    
                const posts = await Posts.aggregate([
                    { $match: { user : { $nin: newArr } } },
                    { $sample: { size: Number(num) } },
                ])
    
                return res.json({
                    msg: 'Success!',
                    result: posts.length,
                    posts
                })
    
            } catch (err) {
                return res.status(500).json({msg: err.message})
            }
        },
    savePost: async (req, res) => {
        try {
            const user = await Users.find({_id: req.user._id, saved: req.params.id})
            if(user.length > 0) return res.status(400).json({msg: "You saved this post."})

            const save = await Users.findOneAndUpdate({_id: req.user._id}, {
                $push: {saved: req.params.id}
            }, {new: true})

            if(!save) return res.status(400).json({msg: 'This user does not exist.'})

            res.json({msg: 'Saved Post!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    unSavePost: async (req, res) => {
        try {
            const save = await Users.findOneAndUpdate({_id: req.user._id}, {
                $pull: {saved: req.params.id}
            }, {new: true})

            if(!save) return res.status(400).json({msg: 'This user does not exist.'})

            res.json({msg: 'unSaved Post!'})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    getSavePosts: async (req, res) => {
        try {
            const features = new APIfeatures(Posts.find({
                _id: {$in: req.user.saved}
            }), req.query).paginating()

            const savePosts = await features.query.sort("-createdAt")

            res.json({
                savePosts,
                result: savePosts.length
            })

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

module.exports = postCtrl