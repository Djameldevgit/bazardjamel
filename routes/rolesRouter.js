// routes/roleRoutes.js - VERSIÓN CORREGIDA
const router = require('express').Router()
const roleCtrl = require('../controllers/roleCtrl')
const auth = require("../middleware/auth")

// ============================================
// 1️⃣ RUTAS DE BÚSQUEDA
// ============================================
router.get('/users/search', auth, roleCtrl.searchUser)

// ============================================
// 2️⃣ RUTAS DE ASIGNACIÓN DE ROLES (específicas)
// ============================================
router.patch('/user/:id/role/no-identificado', auth, roleCtrl.UserRoleNoIdentificado);
router.patch('/user/:id/role/user', auth, roleCtrl.assignUserRole);
router.patch('/user/:id/role/superuser', auth, roleCtrl.assignSuperUserRole);
router.patch('/user/:id/role/moderator', auth, roleCtrl.assignModeratorRole);
router.patch('/user/:id/role/admin', auth, roleCtrl.assignAdminRole);

// ============================================
// 3️⃣ RUTA GENÉRICA DE ACTUALIZACIÓN
// ============================================
router.patch('/user/:id/role', auth, roleCtrl.updateRole);

module.exports = router