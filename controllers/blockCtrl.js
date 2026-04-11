// 📂 controllers/blockUserCtrl.js - VERSIÓN ACTUALIZADA

const Users = require('../models/userModel');
const BlockUser = require('../models/blockModel');

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

const blockCtrl = {
    // ============================================
    // BLOQUEAR USUARIO
    // ============================================
    // 📂 controllers/blockUserCtrl.js - Modificar blockUser y unblockUser

    blockUser: async (req, res) => {
        try {
            const { motivo, content, fechaLimite } = req.body;
            const adminId = req.user._id;
            const userId = req.params.id;
    
            const user = await Users.findById(userId);
            if (!user) {
                return res.status(404).json({ msg: "Utilisateur non trouvé" });
            }
    
            if (user.isBlocked) {
                return res.status(400).json({ msg: "L'utilisateur est déjà bloqué" });
            }
    
            // 🔥 ACTUALIZAR EL MODELO USER
            user.isBlocked = true;
            user.isActive = false;
            user.blockInfo = {
                motivo: motivo || "Sin especificar",
                content: content || "Sin especificar",
                fechaLimite: fechaLimite || null,
                bloqueadoPor: adminId,
                bloqueadoEn: new Date()
            };
            await user.save();
    
            // Guardar en BlockUser (historial)
            let existingBlock = await BlockUser.findOne({ user: userId });
            if (existingBlock) {
                existingBlock.motivo = motivo || "Sin especificar";
                existingBlock.content = content || "Sin especificar";
                existingBlock.fechaLimite = fechaLimite || null;
                existingBlock.userquibloquea = adminId;
                existingBlock.esBloqueado = true;
                await existingBlock.save();
            } else {
                const blockedUser = new BlockUser({
                    user: userId,
                    motivo: motivo || "Sin especificar",
                    content: content || "Sin especificar",
                    fechaLimite: fechaLimite || null,
                    esBloqueado: true,
                    userquibloquea: adminId
                });
                await blockedUser.save();
            }
    
            // Devolver usuario actualizado
            const updatedUser = await Users.findById(userId).select('-password');
            
            res.json({ 
                msg: "Utilisateur bloqué avec succès",
                user: updatedUser
            });
        } catch (err) {
            console.error("Error en blockUser:", err);
            return res.status(500).json({ msg: "Erreur interne du serveur" });
        }
    },
    
    unblockUser: async (req, res) => {
        try {
            const userId = req.params.id;
            
            const user = await Users.findById(userId);
            if (!user) {
                return res.status(404).json({ msg: "Utilisateur non trouvé" });
            }
    
            if (!user.isBlocked) {
                return res.status(400).json({ msg: "L'utilisateur n'est pas bloqué" });
            }
    
            // Actualizar usuario
            user.isBlocked = false;
            user.isActive = true;
            user.blockInfo = null;
            await user.save();
    
            // Eliminar de BlockUser
            await BlockUser.findOneAndDelete({ user: userId });
    
            const updatedUser = await Users.findById(userId).select('-password');
    
            res.json({ 
                msg: "Utilisateur débloqué avec succès",
                user: updatedUser
            });
        } catch (err) {
            console.error("Error en unblockUser:", err);
            return res.status(500).json({ msg: "Erreur interne du serveur" });
        }
    },

unblockUser: async (req, res) => {
    try {
        const userId = req.params.id;
        
        const user = await Users.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "Utilisateur non trouvé" });
        }

        if (!user.isBlocked) {
            return res.status(400).json({ msg: "L'utilisateur n'est pas bloqué" });
        }

        // Actualizar usuario
        user.isBlocked = false;
        user.isActive = true;
        user.blockInfo = null;
        await user.save();

        // Eliminar de BlockUser
        await BlockUser.findOneAndDelete({ user: userId });

        // 🔥 Devolver el usuario actualizado
        const updatedUser = await Users.findById(userId).select('-password');

        res.json({ 
            msg: "Utilisateur débloqué avec succès",
            user: updatedUser
        });
    } catch (err) {
        console.error("Error en unblockUser:", err);
        return res.status(500).json({ msg: "Erreur interne du serveur" });
    }
},

    // ============================================
    // DESBLOQUEAR USUARIO
    // ============================================
    unblockUser: async (req, res) => {
        try {
            const userId = req.params.id;
            
            const user = await Users.findById(userId);
            if (!user) {
                return res.status(404).json({ msg: "Utilisateur non trouvé" });
            }

            if (!user.isBlocked) {
                return res.status(400).json({ msg: "L'utilisateur n'est pas bloqué" });
            }

            // 🔥 ACTUALIZAR EL MODELO USER
            user.isBlocked = false;
            user.blockInfo = null;
            await user.save();

            // 🔥 ACTUALIZAR BLOCKUSER
            await BlockUser.findOneAndDelete({ user: userId });

            res.json({ msg: "Utilisateur débloqué avec succès" });
        } catch (err) {
            console.error("Error en unblockUser:", err);
            return res.status(500).json({ msg: "Erreur interne du serveur" });
        }
    },

    // ============================================
    // OBTENER USUARIOS BLOQUEADOS
    // ============================================
    getBlockedUsers: async (req, res) => {
        try {
            const { search } = req.query;
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;
    
            // 🔥 Buscar directamente en UserModel usando isBlocked
            let filter = { isBlocked: true };
            
            if (search && search.trim() !== '') {
                filter.username = { $regex: search, $options: "i" };
            }
    
            console.log('🔍 Buscando usuarios bloqueados con filtro:', JSON.stringify(filter));
    
            // Obtener usuarios bloqueados
            const blockedUsers = await Users.find(filter)
                .select('-password')
                .populate('blockInfo.bloqueadoPor', 'username email avatar')
                .skip(skip)
                .limit(limit)
                .sort({ 'blockInfo.bloqueadoEn': -1 })
                .lean();
    
            const total = await Users.countDocuments(filter);
    
            console.log(`✅ Encontrados ${blockedUsers.length} usuarios bloqueados de ${total} totales`);
    
            // 🔥 Formatear respuesta para el frontend
            const formattedUsers = blockedUsers.map(user => ({
                _id: user._id,
                username: user.username,
                email: user.email,
                avatar: user.avatar,
                isBlocked: user.isBlocked,
                isActive: user.isActive,
                isVerified: user.isVerified,
                role: user.role,
                createdAt: user.createdAt,
                blockInfo: user.blockInfo ? {
                    motivo: user.blockInfo.motivo,
                    fechaLimite: user.blockInfo.fechaLimite,
                    bloqueadoEn: user.blockInfo.bloqueadoEn,
                    bloqueadoPor: user.blockInfo.bloqueadoPor ? {
                        username: user.blockInfo.bloqueadoPor.username,
                        email: user.blockInfo.bloqueadoPor.email
                    } : null
                } : null
            }));
    
            return res.json({
                success: true,
                result: formattedUsers.length,
                total: total,
                page: page,
                limit: limit,
                blockedUsers: formattedUsers
            });
            
        } catch (err) {
            console.error("Error en getBlockedUsers:", err);
            return res.status(500).json({ 
                success: false, 
                msg: "Erreur interne du serveur",
                error: err.message 
            });
        }
    },
};

module.exports = blockCtrl;