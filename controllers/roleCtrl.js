// 📂 controllers/roleCtrl.js - SIN TRADUCCIONES

const Users = require("../models/userModel");

const roleCtrl = {

    // 🔍 BUSCAR USUARIO
    searchUser: async (req, res) => {
        try {
            const users = await Users.find({
                username: { $regex: req.query.username, $options: 'i' }
            })
            .limit(10)
            .select("username avatar role permissionLevel assignedCategories");
            
            res.json({ users });
        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    // 👤 ASIGNAR ROL DE USUARIO NORMAL
    assignUserRole: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Verificar que el admin no se modifique a sí mismo
            if (req.user._id.toString() === id && req.user.role === 'admin') {
                return res.status(403).json({ msg: "No puedes cambiar tu propio rol de administrador" });
            }
            
            const user = await Users.findByIdAndUpdate(
                id, 
                { 
                    role: 'user',
                    permissionLevel: 1,
                    canApproveAllCategories: false,
                    assignedCategories: []
                }, 
                { new: true, runValidators: true }
            ).select('-password');
            
            if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
            
            res.json({ 
                msg: "Rol actualizado a usuario normal",
                user: {
                    _id: user._id,
                    username: user.username,
                    avatar: user.avatar,
                    role: user.role,
                    permissionLevel: user.permissionLevel
                }
            });
        } catch (error) {
            console.error('Error assignUserRole:', error);
            res.status(500).json({ msg: error.message });
        }
    },

    // ⭐ ASIGNAR ROL DE SUPER USUARIO
    assignSuperUserRole: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (req.user._id.toString() === id && req.user.role === 'admin') {
                return res.status(403).json({ msg: "No puedes cambiar tu propio rol de administrador" });
            }
            
            const user = await Users.findByIdAndUpdate(
                id, 
                { 
                    role: 'Super-utilisateur',
                    permissionLevel: 2,
                    canApproveAllCategories: false
                }, 
                { new: true, runValidators: true }
            ).select('-password');
            
            if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
            
            res.json({ 
                msg: "Rol actualizado a Super-utilisateur",
                user: {
                    _id: user._id,
                    username: user.username,
                    avatar: user.avatar,
                    role: user.role,
                    permissionLevel: user.permissionLevel
                }
            });
        } catch (error) {
            console.error('Error assignSuperUserRole:', error);
            res.status(500).json({ msg: error.message });
        }
    },

    // 🛡️ ASIGNAR ROL DE MODERADOR
    assignModeratorRole: async (req, res) => {
        try {
            const { id } = req.params;
            
            if (req.user._id.toString() === id && req.user.role === 'admin') {
                return res.status(403).json({ msg: "No puedes cambiar tu propio rol de administrador" });
            }
            
            const user = await Users.findByIdAndUpdate(
                id, 
                { 
                    role: 'moderator',
                    permissionLevel: 2,
                    canApproveAllCategories: false,
                    assignedCategories: []
                }, 
                { new: true, runValidators: true }
            ).select('-password');
            
            if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
            
            res.json({ 
                msg: "Rol actualizado a Moderador",
                user: {
                    _id: user._id,
                    username: user.username,
                    avatar: user.avatar,
                    role: user.role,
                    permissionLevel: user.permissionLevel,
                    assignedCategories: user.assignedCategories || []
                }
            });
        } catch (error) {
            console.error('Error assignModeratorRole:', error);
            res.status(500).json({ msg: error.message });
        }
    },

    // 👑 ASIGNAR ROL DE ADMIN
    assignAdminRole: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Verificar que no se esté desasignando el único admin
            if (req.user._id.toString() === id) {
                return res.status(403).json({ msg: "No puedes cambiar tu propio rol de administrador" });
            }
            
            const user = await Users.findByIdAndUpdate(
                id, 
                { 
                    role: 'admin',
                    permissionLevel: 5,
                    canApproveAllCategories: true
                }, 
                { new: true, runValidators: true }
            ).select('-password');
            
            if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
            
            res.json({ 
                msg: "Rol actualizado a Administrador",
                user: {
                    _id: user._id,
                    username: user.username,
                    avatar: user.avatar,
                    role: user.role,
                    permissionLevel: user.permissionLevel
                }
            });
        } catch (error) {
            console.error('Error assignAdminRole:', error);
            res.status(500).json({ msg: error.message });
        }
    },

    // 📝 ACTUALIZAR ROL (genérico)
    updateRole: async (req, res) => {
        try {
            const { id } = req.params;
            const { role } = req.body;
            
            // Validar que el rol sea válido
            const validRoles = ['user', 'Super-utilisateur', 'moderator', 'admin'];
            if (!validRoles.includes(role)) {
                return res.status(400).json({ msg: "Rol no válido" });
            }
            
            // Verificar que el admin no se modifique a sí mismo
            if (req.user._id.toString() === id && req.user.role === 'admin') {
                return res.status(403).json({ msg: "No puedes cambiar tu propio rol de administrador" });
            }
            
            // Determinar nivel de permiso según el rol
            let permissionLevel = 1;
            let canApproveAllCategories = false;
            
            switch (role) {
                case 'admin':
                    permissionLevel = 5;
                    canApproveAllCategories = true;
                    break;
                case 'Super-utilisateur':
                    permissionLevel = 3;
                    break;
                case 'moderator':
                    permissionLevel = 2;
                    break;
                default:
                    permissionLevel = 1;
                    break;
            }
            
            const user = await Users.findByIdAndUpdate(
                id,
                { 
                    role,
                    permissionLevel,
                    canApproveAllCategories
                },
                { new: true, runValidators: true }
            ).select('-password');
            
            if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
            
            res.json({
                msg: `Rol actualizado a ${role} correctamente`,
                user: {
                    _id: user._id,
                    username: user.username,
                    avatar: user.avatar,
                    role: user.role,
                    permissionLevel: user.permissionLevel,
                    assignedCategories: user.assignedCategories || []
                }
            });
        } catch (err) {
            console.error('Error updating role:', err);
            res.status(500).json({ msg: err.message });
        }
    },

    // 🗑️ ELIMINAR USUARIO (opcional)
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;
            
            // No permitir eliminar al propio admin
            if (req.user._id.toString() === id) {
                return res.status(403).json({ msg: "No puedes eliminar tu propia cuenta" });
            }
            
            const user = await Users.findByIdAndDelete(id);
            if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
            
            res.json({ msg: "Usuario eliminado correctamente" });
        } catch (err) {
            res.status(500).json({ msg: err.message });
        }
    }
};

module.exports = roleCtrl;