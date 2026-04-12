
const mongoose = require('mongoose');

 
const Users = require('../models/userModel');
const Posts = require('../models/postModel');
const Comments = require('../models/commentModel');
const BoutiqueProduct = require('../models/boutiqueProductModel'); // ← Así debe ser
const Notifications = require('../models/notifyModel')

const sendMail = require('./sendMail');

const Report = require('../models/reportModel'); // o el nombre correcto





class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 9;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
const userCtrl = {


 

assignCategoriesToModerator: async (req, res) => {
  try {
      const { id } = req.params;
      const { assignedCategories } = req.body;
      
      console.log('📝 Asignando categorías a:', id);
      
      if (!req.user || req.user.role !== 'admin') {
          return res.status(403).json({ success: false, message: "Non autorisé" });
      }
      
      const user = await Users.findById(id);
      if (!user) {
          return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
      }
      
      user.assignedCategories = assignedCategories || [];
      await user.save();
      
      res.json({ success: true, message: "Catégories assignées", user });
  } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ success: false, error: err.message });
  }
},
getModeratorCategories: async (req, res) => {
  try {
      const { id } = req.params;
      
      const user = await User.findById(id).select('assignedCategories role canApproveAllCategories');
      if (!user) {
          return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
      }
      
      if (user.role !== 'moderator') {
          return res.status(400).json({ 
              success: false, 
              message: "Cet utilisateur n'est pas un modérateur" 
          });
      }
      
      res.json({
          success: true,
          canApproveAll: user.canApproveAllCategories,
          categories: user.assignedCategories
      });
      
  } catch (err) {
      console.error('❌ Error getModeratorCategories:', err);
      res.status(500).json({ success: false, error: err.message });
  }
},

// ============================================
// VERIFICAR SI MODERADOR PUEDE APROBAR POST
// ============================================
checkModeratorPermission: async (req, res) => {
  try {
      const { userId, categorySlug, subCategorySlug } = req.params;
      
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ success: false, message: "Utilisateur non trouvé" });
      }
      
      const canModerate = user.canModerateCategory(categorySlug, subCategorySlug);
      
      res.json({
          success: true,
          canModerate,
          role: user.role,
          permissionLevel: user.permissionLevel
      });
      
  } catch (err) {
      console.error('❌ Error checkModeratorPermission:', err);
      res.status(500).json({ success: false, error: err.message });
  }
},



  contactForActivation: async (req, res) => {
    try {
      const { message, lang } = req.body;
      const user = req.user; // gracias al middleware auth

      if (!message || !message.trim()) {
        return res.status(400).json({ msg: 'El mensaje es obligatorio.' });
      }

      // Asunto personalizado y mensaje para admin
      const subject = `Solicitud de activación de cuenta - ${user.username}`;
      const customMessage = `
        El usuario ${user.username} ha solicitado la activación de su cuenta.

        ID: ${user._id}
        Correo: ${user.email}

        Mensaje del usuario:
        ${message}
      `;

      const adminEmail = "artealger2020argelia@gmail.com";

      // Enviamos el correo con plantilla genérica "informativo"
      await sendMail(adminEmail, '#', lang || 'es', 'informativo', subject, customMessage);

      return res.json({ msg: '✅ Mensaje enviado correctamente al administrador.' });

    } catch (err) {
      console.error('❌ Error al procesar solicitud de activación:', err);
      return res.status(500).json({ msg: 'Error interno del servidor.' });
    }
  },

  // ...otros controladores


  contactMailSupport: async (req, res) => {
    try {
      const { title, message, lang } = req.body;

      // Asegúrate de que el usuario esté autenticado
      const user = req.user;
      if (!user) {
        return res.status(401).json({ msg: 'Usuario no autenticado.' });
      }

      if (!title || !message) {
        return res.status(400).json({ msg: 'Faltan el título o el mensaje.' });
      }

      const subject = `[Contacto] ${title} - ${user.username}`;
      const fullMessage = `
  Mensaje del usuario:
  --------------------
  Nombre: ${user.username}
  Email: ${user.email}
  ID: ${user._id}
  
  Mensaje:
  --------
  ${message}
      `;

      // Enviar el email al administrador
      await sendMail('artealger2020argelia@gmail.com', '#', lang || 'es', 'informativo', subject, fullMessage);

      return res.json({ success: true, msg: 'Mensaje enviado correctamente.' });
    } catch (err) {
      console.error('❌ Error al enviar el mensaje de contacto:', err);
      return res.status(500).json({ msg: 'Error interno al enviar el mensaje.' });
    }
  },

  contactBlockedSupport: async (req, res) => {
    try {
      const { message, lang } = req.body;
      const user = req.user;

      if (!message) {
        return res.status(400).json({ msg: 'El mensaje es obligatorio.' });
      }

      const subject = `🛑 Solicitud de revisión de bloqueo - ${user.username}`;
      const fullMessage = `
  Usuario: ${user.username}
  ID: ${user._id}
  Email: ${user.email}
  Mensaje: ${message}
  Fecha de solicitud: ${new Date().toLocaleString(lang || 'es')}
      `;

      await sendMail('artealger2020argelia@gmail.com', '#', lang || 'es', 'informativo', subject, fullMessage);

      return res.json({ msg: '✅ Solicitud de desbloqueo enviada correctamente.' });
    } catch (err) {
      console.error('❌ Error en contactBlockedSupport:', err);
      return res.status(500).json({ msg: 'Error al enviar la solicitud.' });
    }
  },




  validateUserActivity: async (req, res, next) => {
    const user = await Users.findById(req.user._id);
    if (!user) return res.status(401).json({ msg: 'Usuario no encontrado.' });

    // Si no está verificado y tiene más de 3 días
    const accountAge = Date.now() - new Date(user.createdAt).getTime();
    const threeDays = 3 * 24 * 60 * 60 * 1000;

    if (!user.isVerified && accountAge > threeDays) {
      await Users.findByIdAndDelete(user._id);
      return res.status(403).json({
        msg: 'Tu cuenta ha sido eliminada por no verificarla a tiempo. Regístrate de nuevo si deseas acceder.',
      });
    }

    next(); // pasa a la siguiente acción si todo está bien
  },



  toggleActiveStatus: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id);
      if (!user) return res.status(404).json({ msg: "Usuario no encontrado." });

      user.isActive = !user.isActive;
      await user.save();

      res.json({ msg: "Estado actualizado", user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },


  // En tu controlador de búsqueda (backend)
  getAdmins: async (req, res) => {
    try {
      const admins = await Users.find({ role: 'admin' })
        .select('username avatar online _id');
      res.json({ users: admins });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },



  searchUser: async (req, res) => {
    try {
      const users = await Users.find({ username: { $regex: req.query.username } })
        .limit(10).select("username avatar")

      res.json({ users })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id).select('-password')
        .populate("followers following", "-password")
      if (!user) return res.status(400).json({ msg: "User does not exist." })

      res.json({ user })
    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },



  updateUser: async (req, res) => {
    try {
        const { avatar, fullname, mobile, address, story, website } = req.body
        if(!fullname) return res.status(400).json({msg: "Please add your full name."})

        await Users.findOneAndUpdate({_id: req.user._id}, {
            avatar, fullname, mobile, address, story, website 
        })

        res.json({msg: "Update Success!"})

    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
},
  follow: async (req, res) => {
    try {
      const user = await Users.find({ _id: req.params.id, followers: req.user._id })
      if (user.length > 0) return res.status(500).json({ msg: "You followed this user." })

      const newUser = await Users.findOneAndUpdate({ _id: req.params.id }, {
        $push: { followers: req.user._id }
      }, { new: true }).populate("followers following", "-password")

      await Users.findOneAndUpdate({ _id: req.user._id }, {
        $push: { following: req.params.id }
      }, { new: true })

      res.json({ newUser })

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  unfollow: async (req, res) => {
    try {

      const newUser = await Users.findOneAndUpdate({ _id: req.params.id }, {
        $pull: { followers: req.user._id }
      }, { new: true }).populate("followers following", "-password")

      await Users.findOneAndUpdate({ _id: req.user._id }, {
        $pull: { following: req.params.id }
      }, { new: true })

      res.json({ newUser })

    } catch (err) {
      return res.status(500).json({ msg: err.message })
    }
  },
  
  /*
  
    deleteUser: async (req, res) => {
      const session = await mongoose.startSession();
      session.startTransaction();
  
      try {
        // 1. Verificar permisos de administrador
        if (req.user.role !== 'admin') {
          await session.abortTransaction();
          return res.status(403).json({
            success: false,
            msg: 'Acceso denegado. Se requieren privilegios de administrador'
          });
        }
  
        // 2. Validar ID del usuario
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
          await session.abortTransaction();
          return res.status(400).json({
            success: false,
            msg: 'ID de usuario no válido'
          });
        }
  
        // 3. Obtener usuario a eliminar
        const userToDelete = await Users.findById(req.params.id).session(session);
        if (!userToDelete) {
          await session.abortTransaction();
          return res.status(404).json({
            success: false,
            msg: 'Usuario no encontrado'
          });
        }
  
        // 4. Prevenir auto-eliminación
        if (userToDelete._id.toString() === req.user._id.toString()) {
          await session.abortTransaction();
          return res.status(400).json({
            success: false,
            msg: 'No puedes eliminarte a ti mismo'
          });
        }
  
        // 5. Obtener todos los posts del usuario
        const userPosts = await Posts.find({ user: req.params.id }).session(session);
  
        // 6. Eliminación en cascada
        await Promise.all([
          // Eliminar posts y sus relaciones
          Posts.deleteMany({ user: req.params.id }).session(session)
            .then(async () => {
              // Eliminar comentarios de esos posts
              await Comments.deleteMany({
                post: { $in: userPosts.map(p => p._id) }
              }).session(session);
            }),
          // Eliminar denuncias en las que el usuario esté involucrado
          Report.deleteMany({
            $or: [
              { userId: req.params.id },
              { reportedBy: req.params.id }
            ]
          }).session(session),
  
          // Eliminar comentarios hechos por el usuario
          Comments.deleteMany({ user: req.params.id }).session(session),
  
          // Eliminar notificaciones
          Notifications.deleteMany({
            $or: [
              { sender: req.params.id },
              { recipient: req.params.id }
            ]
          }).session(session),
  
          // Actualizar relaciones de usuarios (followers, following, saved)
          Users.updateMany(
            {
              $or: [
                { followers: req.params.id },
                { following: req.params.id },
                { saved: req.params.id }
              ]
            },
            {
              $pull: {
                followers: req.params.id,
                following: req.params.id,
                saved: req.params.id
              }
            }
          ).session(session),
  
          // Limpiar likes del usuario en posts (array de referencias)
          Posts.updateMany(
            { likes: req.params.id },
            { $pull: { likes: req.params.id } }
          ).session(session),
  
          // Limpiar referencias en carritos de otros usuarios
          Users.updateMany(
            { "cart.items.postId": { $in: userPosts.map(p => p._id) } },
            { $pull: { "cart.items": { postId: { $in: userPosts.map(p => p._id) } } } }
          ).session(session).then(async () => {
            // Recalcular totales de carritos afectados
            const affectedUsers = await Users.find({
              "cart.items.postId": { $in: userPosts.map(p => p._id) }
            }).session(session);
  
            for (const user of affectedUsers) {
              const total = user.cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              await Users.updateOne(
                { _id: user._id },
                { $set: { "cart.totalPrice": total } }
              ).session(session);
            }
          })
        ]);
  
        // 7. Eliminar al usuario (esto activará el middleware pre('remove'))
        await userToDelete.remove({ session });
  
        // 8. Confirmar transacción
        await session.commitTransaction();
  
        res.json({
          success: true,
          msg: 'Usuario y todo su contenido relacionado eliminados permanentemente',
          deletedAt: new Date()
        });
  
      } catch (err) {
        await session.abortTransaction();
        console.error('Error en eliminación completa:', err);
        res.status(500).json({
          success: false,
          msg: 'Error al eliminar usuario',
          error: err.message
        });
      } finally {
        session.endSession();
      }
    },
  
  */
  deleteUser: async (req, res) => {
    try {
      // 1. Verificar permisos de administrador
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          msg: 'Acceso denegado. Se requieren privilegios de administrador'
        });
      }

      // 2. Validar ID del usuario
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          success: false,
          msg: 'ID de usuario no válido'
        });
      }

      // 3. Obtener usuario a eliminar
      const userToDelete = await Users.findById(req.params.id);
      if (!userToDelete) {
        return res.status(404).json({
          success: false,
          msg: 'Usuario no encontrado'
        });
      }

      // 4. Prevenir auto-eliminación
      if (userToDelete._id.toString() === req.user._id.toString()) {
        return res.status(400).json({
          success: false,
          msg: 'No puedes eliminarte a ti mismo'
        });
      }

      // 5. Obtener todos los posts del usuario
      const userPosts = await Posts.find({ user: req.params.id });

      // 6. Eliminación en cascada (secuencial, sin Promise.all para evitar conflictos)

      // Eliminar posts
      await Posts.deleteMany({ user: req.params.id });

      // Eliminar comentarios de esos posts
      await Comments.deleteMany({
        post: { $in: userPosts.map(p => p._id) }
      });

      // Eliminar denuncias en las que el usuario esté involucrado
      await Report.deleteMany({
        $or: [
          { userId: req.params.id },
          { reportedBy: req.params.id }
        ]
      });

      // Eliminar comentarios hechos por el usuario
      await Comments.deleteMany({ user: req.params.id });

      // Eliminar notificaciones
      await Notifications.deleteMany({
        $or: [
          { sender: req.params.id },
          { recipient: req.params.id }
        ]
      });

      // Actualizar relaciones de usuarios (followers, following, saved)
      await Users.updateMany(
        {
          $or: [
            { followers: req.params.id },
            { following: req.params.id },
            { saved: req.params.id }
          ]
        },
        {
          $pull: {
            followers: req.params.id,
            following: req.params.id,
            saved: req.params.id
          }
        }
      );

      // Limpiar likes del usuario en posts
      await Posts.updateMany(
        { likes: req.params.id },
        { $pull: { likes: req.params.id } }
      );

      // Limpiar referencias en carritos de otros usuarios
      await Users.updateMany(
        { "cart.items.postId": { $in: userPosts.map(p => p._id) } },
        { $pull: { "cart.items": { postId: { $in: userPosts.map(p => p._id) } } } }
      );

      // Recalcular totales de carritos afectados
      const affectedUsers = await Users.find({
        "cart.items.postId": { $in: userPosts.map(p => p._id) }
      });

      for (const user of affectedUsers) {
        const total = user.cart.items.reduce(
          (sum, item) => sum + (item.price * item.quantity),
          0
        );
        await Users.updateOne(
          { _id: user._id },
          { $set: { "cart.totalPrice": total } }
        );
      }

      // 7. Eliminar al usuario (esto activará cualquier middleware pre('remove'))
      await userToDelete.deleteOne();

      // 8. Respuesta final
      res.json({
        success: true,
        msg: 'Usuario y todo su contenido relacionado eliminados permanentemente',
        deletedAt: new Date()
      });

    } catch (err) {
      console.error('Error en eliminación completa:', err);
      res.status(500).json({
        success: false,
        msg: 'Error al eliminar usuario',
        error: err.message
      });
    }
  },
  // 📂 controllers/userCtrl.js - CORREGIR getUsersAction

getUsersAction: async (req, res) => {
  try {
    var filter = req.query.filter;

    console.log('🔍 Iniciando getUsersAction...');

    // 🎯 CORREGIDO: Agregar populate para followers y following
    var query = Users.find()
      .select('-password')
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar')
      .lean();

    var features = new APIfeatures(query, req.query).paginating();
    var users = await features.query.sort('-createdAt');

    if (!users || !Array.isArray(users)) {
        users = [];
    }

    var usersWithDetails = await Promise.all(
      users.map(async function(user) {
        try {
          console.log('🔍 Procesando usuario: ' + user.username);

          var posts = await Posts.find({ user: user._id });
          
          // Cálculos
          var totalLikesReceived = posts.reduce(function(acc, post) {
            return acc + (post.likes ? post.likes.length : 0);
          }, 0);
          
          var totalCommentsReceived = posts.reduce(function(acc, post) {
            return acc + (post.comments ? post.comments.length : 0);
          }, 0);
          
          var reportsReceived = await Report.countDocuments({ userId: user._id });
          var likesGiven = await Posts.countDocuments({ likes: user._id });
          var commentsMade = await Comments.countDocuments({ user: user._id });

          // 🔥 CORREGIDO: Usar isBlocked del modelo User en lugar de consultar BlockUser
          var blockInfoData = null;
          if (user.isBlocked && user.blockInfo) {
            blockInfoData = {
              motivo: user.blockInfo.motivo || 'Sin especificar',
              content: user.blockInfo.content,
              fechaLimite: user.blockInfo.fechaLimite,
              esBloqueado: user.isBlocked,
              bloqueadoEn: user.blockInfo.bloqueadoEn,
              bloqueadoPor: user.blockInfo.bloqueadoPor || null
            };
          }

          // Estructura del usuario
          var userObject = {
            ...user,
            // Campos adicionales
            bio: user.bio || '',
            story: user.story || '',
            website: user.website || '',
            mobile: user.mobile || '',
            address: user.address || '',
            // 🔥 IMPORTANTE: Asegurar que isBlocked está presente
            isBlocked: user.isBlocked || false,
            // Cálculos
            postCount: posts.length,
            totalLikesReceived: totalLikesReceived,
            totalCommentsReceived: totalCommentsReceived,
            totalFollowers: user.followers ? user.followers.length : 0,
            totalFollowing: user.following ? user.following.length : 0,
            totalReportsReceived: reportsReceived,
            likesGiven: likesGiven,
            commentsMade: commentsMade,
            blockInfo: blockInfoData,
            posts: posts || [],
            followers: user.followers || [],
            following: user.following || []
          };

          return userObject;
          
        } catch (userError) {
          console.error('❌ Error procesando usuario ' + user.username + ':', userError);
          
          // Usuario seguro en caso de error
          return {
            ...user,
            postCount: 0,
            totalLikesReceived: 0,
            totalCommentsReceived: 0,
            totalFollowers: 0,
            totalFollowing: 0,
            totalReportsReceived: 0,
            likesGiven: 0,
            commentsMade: 0,
            blockInfo: null,
            posts: [],
            followers: [],
            following: [],
            bio: user.bio || '',
            story: user.story || '',
            website: user.website || '',
            mobile: user.mobile || '',
            address: user.address || '',
            isBlocked: user.isBlocked || false
          };
        }
      })
    );

    // Aplicar filtros
    switch (filter) {
      case 'mostLikes':
        usersWithDetails.sort((a, b) => b.totalLikesReceived - a.totalLikesReceived);
        break;
      case 'mostComments':
        usersWithDetails.sort((a, b) => b.totalCommentsReceived - a.totalCommentsReceived);
        break;
      case 'mostFollowers':
        usersWithDetails.sort((a, b) => b.totalFollowers - a.totalFollowers);
        break;
      case 'mostPosts':
        usersWithDetails.sort((a, b) => b.postCount - a.postCount);
        break;
      case 'mostReports':
        usersWithDetails.sort((a, b) => b.totalReportsReceived - a.totalReportsReceived);
        break;
      case 'lastLogin':
        usersWithDetails.sort((a, b) => new Date(b.lastLogin || 0) - new Date(a.lastLogin || 0));
        break;
      case 'latestRegistered':
        usersWithDetails.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        break;
    }

    console.log('✅ getUsersAction completado: ' + usersWithDetails.length + ' usuarios');

    res.json({
      msg: 'Success!',
      result: usersWithDetails.length,
      users: usersWithDetails,
    });
  } catch (err) {
    console.error('❌ ERROR en getUsersAction:', err);
    return res.status(500).json({ 
      msg: err.message,
      users: []
    });
  }
},
  getInactiveUsers: async (req, res) => {
    try {
      const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const inactiveCandidates = await Users.find({
        isVerified: true,
        createdAt: { $lt: oneMonthAgo }
      }).select('_id username email createdAt');

      const trulyInactive = [];

      for (const user of inactiveCandidates) {
        const hasPosts = await Posts.exists({ user: user._id });
        const hasComments = await Comments.exists({ user: user._id });

        if (!hasPosts && !hasComments) {
          trulyInactive.push(user);
        }
      }

      res.json({ inactiveUsers: trulyInactive });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },












  eliminaRrestosDePosts: async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {


      if (!req.user || req.user.role !== 'admin') {
        await session.abortTransaction();
        return res.status(403).json({
          success: false,
          msg: 'Acceso denegado. Se requieren privilegios de administrador'
        });
      }

      const orphanedPosts = await Posts.aggregate([
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'author_data'
          }
        },
        {
          $match: {
            $or: [
              { user: { $exists: false } },
              { user: null },
              { author_data: { $size: 0 } }
            ]
          }
        },
        {
          $project: {
            _id: 1,
            comments: 1
          }
        }
      ]).session(session);


      const idsToDelete = orphanedPosts.map(post => post._id);
      const commentIdsToDelete = orphanedPosts.flatMap(post => post.comments || []);
      const idsToDeleteObjectId = idsToDelete.map(id => new mongoose.Types.ObjectId(id));

      await Promise.all([
        Posts.deleteMany({ _id: { $in: idsToDeleteObjectId } }).session(session),
        Comments.deleteMany({ _id: { $in: commentIdsToDelete } }).session(session),
        Posts.updateMany({}, { $pull: { likes: { $in: idsToDeleteObjectId } } }).session(session),
        Users.updateMany({}, { $pull: { saved: { $in: idsToDeleteObjectId } } }).session(session),
        Users.updateMany(
          {},
          { $pull: { "cart.items": { postId: { $in: idsToDeleteObjectId } } } }
        ).session(session)
      ]);

      await session.commitTransaction();

      res.json({
        success: true,
        deletedPosts: idsToDelete.length,
        deletedComments: commentIdsToDelete.length,
        message: `Limpieza completada: ${idsToDelete.length} posts y ${commentIdsToDelete.length} comentarios eliminados`
      });

    } catch (err) {

      console.error('Error en limpieza de posts huérfanos:');
      console.error(err);
      console.error('Stack Trace:');


      await session.abortTransaction();
      console.error('Error en limpieza de posts huérfanos:', err);
      res.status(500).json({
        success: false,
        error: err.message,
        details: process.env.NODE_ENV === 'development' ? {
          stack: err.stack,
          fullError: JSON.stringify(err, Object.getOwnPropertyNames(err))
        } : undefined
      });
    } finally {
      session.endSession();
    }
  },

// 📂 controllers/boutiqueProductCtrl.js - Agrega esta versión con logs extremos

getUserProducts: async (req, res) => {
  try {
    console.log('='.repeat(60));
    console.log('🔥🔥🔥 getUserProducts EJECUTÁNDOSE 🔥🔥🔥');
    console.log('📅 Timestamp:', new Date().toISOString());
    console.log('👤 User ID:', req.user._id);
    console.log('👤 User role:', req.user.role);
    console.log('👤 User username:', req.user.username);
    console.log('🔑 Token presente:', !!req.headers.authorization);
    console.log('📊 Query params:', req.query);
    
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
    
    // Verificar conexión a MongoDB
    const mongoose = require('mongoose');
    console.log('📊 Estado de MongoDB:', mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado');
    
    // 🔥 EJECUTAR QUERY PASO A PASO
    console.log('🔄 Ejecutando BoutiqueProduct.find({ user: userId })...');
    
    // Primero probar countDocuments
    console.log('📊 Contando documentos...');
    let total = 0;
    try {
      total = await BoutiqueProduct.countDocuments({ user: userId });
      console.log('✅ Total encontrado:', total);
    } catch (countErr) {
      console.error('❌ Error en countDocuments:', countErr);
      console.error('❌ Mensaje:', countErr.message);
      throw countErr;
    }
    
    // Luego obtener los productos
    console.log('📊 Obteniendo productos...');
    let products = [];
    try {
      products = await BoutiqueProduct.find({ user: userId })
        .populate('boutique', 'nom_boutique couleur_theme images domaine_boutique')
        .sort('-createdAt')
        .skip(skip)
        .limit(parseInt(limit))
        .lean();
      
      console.log('✅ Productos obtenidos:', products.length);
    } catch (findErr) {
      console.error('❌ Error en find:', findErr);
      console.error('❌ Mensaje:', findErr.message);
      throw findErr;
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
    console.log('='.repeat(60));
    
    res.json({
      success: true,
      products: products || [],
      total: total || 0,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: totalPages,
      hasMore: parseInt(page) < totalPages
    });
    
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
},
assignCategoriesToModerator: async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedCategories } = req.body;

    console.log('📝 Asignando categorías a:', id);

    // Verificar permisos
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: "Non autorisé. Seul un administrateur peut assigner des catégories." 
      });
    }

    const user = await Users.findById(id); // ← Usar Users, no User
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "Utilisateur non trouvé" 
      });
    }

    // Solo moderadores pueden tener categorías asignadas
    if (user.role !== 'moderator') {
      return res.status(400).json({
        success: false,
        message: "Seuls les modérateurs peuvent avoir des catégories assignées"
      });
    }

    // Actualizar categorías asignadas
    user.assignedCategories = assignedCategories || [];
    user.updatedAt = Date.now();
    await user.save();

    res.json({
      success: true,
      message: "Catégories assignées avec succès",
      user: {
        _id: user._id,
        username: user.username,
        role: user.role,
        assignedCategories: user.assignedCategories
      }
    });

  } catch (err) {
    console.error('❌ Error assignCategoriesToModerator:', err);
    res.status(500).json({ success: false, error: err.message });
  }
},

// ============================================
// VERIFICAR PERMISO DE MODERADOR (CORREGIDO)
// ============================================
checkModeratorPermission: async (req, res) => {
  try {
    const { userId, categorySlug, subCategorySlug } = req.params;

    const user = await Users.findById(userId); // ← Usar Users
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "Utilisateur non trouvé" 
      });
    }

    // Lógica directa en lugar de método inexistente
    let canModerate = false;
    
    if (user.role === 'admin') {
      canModerate = true;
    } else if (user.role === 'moderator') {
      if (user.canApproveAllCategories) {
        canModerate = true;
      } else if (user.assignedCategories && user.assignedCategories.length > 0) {
        // Verificar si tiene asignada la categoría específica
        canModerate = user.assignedCategories.some(cat => 
          cat.slug === categorySlug || 
          (subCategorySlug && cat.subCategories.includes(subCategorySlug))
        );
      }
    }

    res.json({
      success: true,
      canModerate,
      role: user.role,
      permissionLevel: user.permissionLevel
    });

  } catch (err) {
    console.error('❌ Error checkModeratorPermission:', err);
    res.status(500).json({ success: false, error: err.message });
  }
},

 

// ============================================
// BLOQUEAR USUARIO (CORREGIDO)
// ============================================
blockUser: async (req, res) => {
  try {
    const { id } = req.params; // userId
    const { reason, description, blockExpiryDate } = req.body;
    const adminId = req.user._id;

    if (!reason) {
      return res.status(400).json({ 
        message: 'Le motif du blocage est requis' 
      });
    }

    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ 
        message: 'Utilisateur non trouvé' 
      });
    }

    // Inicializar blockHistory si no existe
    if (!user.blockHistory) {
      user.blockHistory = [];
    }

    // Guardar en historial
    user.blockHistory.push({
      reason,
      description,
      blockDate: new Date(),
      blockExpiryDate: blockExpiryDate || null,
      blockedBy: adminId
    });

    // Actualizar estado de bloqueo
    user.isBlocked = true;
    user.isActive = false; // Un usuario bloqueado también está desactivado
    user.blockDetails = {
      reason,
      description,
      blockDate: new Date(),
      blockExpiryDate: blockExpiryDate || null,
      blockedBy: adminId
    };

    await user.save();

    res.json({
      success: true,
      message: 'Utilisateur bloqué avec succès',
      user: {
        _id: user._id,
        isBlocked: user.isBlocked,
        isActive: user.isActive,
        blockDetails: user.blockDetails
      }
    });

  } catch (error) {
    console.error('Error blockUser:', error);
    res.status(500).json({ 
      message: error.message || 'Erreur lors du blocage' 
    });
  }
},

// ============================================
// DESBLOQUEAR USUARIO
// ============================================
unblockUser: async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user._id;

    const user = await Users.findById(id);
    if (!user) {
      return res.status(404).json({ 
        message: 'Utilisateur non trouvé' 
      });
    }

    // Actualizar el último bloqueo en el historial
    if (user.blockHistory && user.blockHistory.length > 0) {
      const lastBlock = user.blockHistory[user.blockHistory.length - 1];
      if (!lastBlock.unblockDate) {
        lastBlock.unblockDate = new Date();
        lastBlock.unblockedBy = adminId;
      }
    }

    // Limpiar bloqueo actual
    user.isBlocked = false;
    user.isActive = true;
    user.blockDetails = {
      reason: null,
      description: null,
      blockDate: null,
      blockExpiryDate: null,
      blockedBy: null
    };

    await user.save();

    res.json({
      success: true,
      message: 'Utilisateur débloqué avec succès',
      user: {
        _id: user._id,
        isBlocked: user.isBlocked,
        isActive: user.isActive
      }
    });

  } catch (error) {
    console.error('Error unblockUser:', error);
    res.status(500).json({ 
      message: error.message || 'Erreur lors du déblocage' 
    });
  }
},

// ============================================
// ACTIVAR USUARIO
// ============================================
activateUser: async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Users.findByIdAndUpdate(
      id,
      { isActive: true },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        message: 'Utilisateur non trouvé' 
      });
    }

    res.json({
      success: true,
      message: 'Utilisateur activé avec succès',
      user: {
        _id: user._id,
        isActive: user.isActive,
        isBlocked: user.isBlocked
      }
    });

  } catch (error) {
    console.error('Error activateUser:', error);
    res.status(500).json({ 
      message: error.message || 'Erreur lors de l\'activation' 
    });
  }
},

// ============================================
// DESACTIVAR USUARIO
// ============================================
deactivateUser: async (req, res) => {
  try {
    const { id } = req.params;

    const user = await Users.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ 
        message: 'Utilisateur non trouvé' 
      });
    }

    res.json({
      success: true,
      message: 'Utilisateur désactivé avec succès',
      user: {
        _id: user._id,
        isActive: user.isActive,
        isBlocked: user.isBlocked
      }
    });

  } catch (error) {
    console.error('Error deactivateUser:', error);
    res.status(500).json({ 
      message: error.message || 'Erreur lors de la désactivation' 
    });
  }
},
getUsersAction: async (req, res) => {
  try {
    const filter = req.query.filter;

    const query = Users.find()
      .select('-password')
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar')
      .lean();

    const features = new APIfeatures(query, req.query).paginating();
    const users = await features.query.sort('-createdAt');

    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        try {
          const posts = await Posts.find({ user: user._id });

          const totalLikesReceived = posts.reduce((acc, post) => {
            return acc + (post.likes ? post.likes.length : 0);
          }, 0);

          const totalCommentsReceived = posts.reduce((acc, post) => {
            return acc + (post.comments ? post.comments.length : 0);
          }, 0);

          const reportsReceived = await Report.countDocuments({ userId: user._id });
          const likesGiven = await Posts.countDocuments({ likes: user._id });
          const commentsMade = await Comments.countDocuments({ user: user._id });

          // ✅ CORREGIDO: usar blockDetails en lugar de blockInfo
          let blockInfoData = null;
          if (user.isBlocked && user.blockDetails && user.blockDetails.reason) {
            blockInfoData = {
              motivo: user.blockDetails.reason || 'Sin especificar',
              content: user.blockDetails.description,
              fechaLimite: user.blockDetails.blockExpiryDate,
              esBloqueado: user.isBlocked,
              bloqueadoEn: user.blockDetails.blockDate,
              bloqueadoPor: user.blockDetails.blockedBy || null
            };
          }

          return {
            ...user,
            isBlocked: user.isBlocked || false,
            blockInfo: blockInfoData, // ← Para compatibilidad con frontend
            blockDetails: user.blockDetails, // ← También incluir el nuevo
            postCount: posts.length,
            totalLikesReceived,
            totalCommentsReceived,
            totalFollowers: user.followers.length || 0,
            totalFollowing: user.following.length || 0,
            totalReportsReceived: reportsReceived,
            likesGiven,
            commentsMade,
            posts: posts || []
          };
        } catch (userError) {
          console.error('Error procesando usuario:', userError);
          return {
            ...user,
            isBlocked: user.isBlocked || false,
            postCount: 0,
            totalLikesReceived: 0,
            totalCommentsReceived: 0,
            totalFollowers: 0,
            totalFollowing: 0,
            totalReportsReceived: 0,
            likesGiven: 0,
            commentsMade: 0,
            blockInfo: null,
            posts: []
          };
        }
      })
    );

    res.json({
      msg: 'Success!',
      result: usersWithDetails.length,
      users: usersWithDetails,
    });
  } catch (err) {
    console.error('ERROR en getUsersAction:', err);
    return res.status(500).json({
      msg: err.message,
      users: []
    });
  }
},

activatePro: async (req, res) => {
  try {
    const { userId } = req.params;
    const { proExpiryDate } = req.body;

    // Verificar permisos (solo admin)
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé. Seul un administrateur peut activer le compte Pro.'
      });
    }

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Activar usuario Pro
    user.isPro = true;
    user.proExpiryDate = proExpiryDate || null;

    await user.save();

    res.json({
      success: true,
      message: 'Compte Pro activé avec succès',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isPro: user.isPro,
        proExpiryDate: user.proExpiryDate
      }
    });

  } catch (error) {
    console.error('Error activatePro:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de l\'activation du compte Pro'
    });
  }
},

// ============================================
// DESACTIVAR USUARIO PRO
// ============================================
deactivatePro: async (req, res) => {
  try {
    const { userId } = req.params;

    // Verificar permisos (solo admin)
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Accès non autorisé. Seul un administrateur peut désactiver le compte Pro.'
      });
    }

    const user = await Users.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Desactivar usuario Pro
    user.isPro = false;
    user.proExpiryDate = null;

    await user.save();

    res.json({
      success: true,
      message: 'Compte Pro désactivé avec succès',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isPro: user.isPro,
        proExpiryDate: user.proExpiryDate
      }
    });

  } catch (error) {
    console.error('Error deactivatePro:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la désactivation du compte Pro'
    });
  }
}
 
 





};


module.exports = userCtrl