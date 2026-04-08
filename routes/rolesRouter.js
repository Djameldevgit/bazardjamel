const router = require('express').Router()
 
const roleCtrl = require('../controllers/roleCtrl')
const auth = require("../middleware/auth")
router.patch('/ ', auth, roleCtrl.updateRole);
router.patch('/user/:id/roleusernoidantificado', auth, roleCtrl.assignModeratorRole);
router.patch('/role/assign-user/:id', auth,  roleCtrl.assignUserRole);
router.patch('/role/assign-superuser/:id', auth,  roleCtrl.assignSuperUserRole);
router.patch('/role/assign-moderator/:id', auth,  roleCtrl.assignModeratorRole);
router.patch('/role/assign-admin/:id', auth,  roleCtrl.assignAdminRole);
router.patch('/role/update/:id', auth,  roleCtrl.updateRole);
router.get('/users/search',  auth, roleCtrl.searchUser)






module.exports = router