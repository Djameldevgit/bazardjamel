const router = require('express').Router()
const auth = require("../middleware/auth")

const blockCtrl = require('../controllers/blockCtrl');



router.patch('/user/:id/block', auth, blockCtrl.blockUser)//;authMiddleware,
router.get('/users/block', auth, blockCtrl.getBlockedUsers)
router.patch('/user/:id/unblock', auth, blockCtrl.unblockUser)
module.exports = router