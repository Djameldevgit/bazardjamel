// routes/postRouter.js
const router = require('express').Router()
const postCtrl = require('../controllers/postCtrl')
const postCategoryCtrl = require('../controllers/postCategoryCtrl')
const auth = require('../middleware/auth')

// ==================== RUTAS DE POSTS (OPERACIONES GENERALES) ====================
// 📌 CREAR Y OBTENER POSTS
router.route('/posts')
    .post(auth, postCtrl.createPost)
    .get(postCtrl.getPosts)

// 📌 OPERACIONES SOBRE UN POST ESPECÍFICO
router.route('/post/:id')
    .patch(auth, postCtrl.updatePost)
    .get(postCtrl.getPost)
    .delete(auth, postCtrl.deletePost)

// 📌 POSTS SIMILARES
router.get('/posts/similar', postCtrl.getSimilarPosts)

// 📌 POSTS DE USUARIO
router.get('/user_posts/:id', auth, postCtrl.getUserPosts)

// 📌 POSTS PARA DESCUBRIR
router.get('/post_discover', auth, postCtrl.getPostsDicover)

// 📌 GUARDAR/QUITAR POSTS
router.patch('/savePost/:id', auth, postCtrl.savePost)
router.patch('/unSavePost/:id', auth, postCtrl.unSavePost)
router.get('/getSavePosts', auth, postCtrl.getSavePosts)

// ==================== RUTAS DE CATEGORÍAS ====================
// 📌 CATEGORÍAS PAGINADAS
router.get('/categories/paginated', postCategoryCtrl.getAllCategoriesPaginated)

// 📌 CATEGORÍAS JERÁRQUICAS
router.get('/categories/hierarchy', postCategoryCtrl.getCategoriesHierarchy)

// 📌 POSTS POR CATEGORÍA
router.get('/posts/category/:category', postCategoryCtrl.getPostsByCategory)

// 📌 POSTS POR SUBCATEGORÍA
router.get('/posts/category/:category/subcategory/:subcategory', postCategoryCtrl.getPostsBySubcategory)

// 📌 SUBCATEGORÍAS DE UNA CATEGORÍA
router.get('/categories/:category/subcategories', postCategoryCtrl.getSubCategoriesByCategory)

// 📌 POSTS POR JERARQUÍA (compatible con 2 niveles)
router.get('/posts/hierarchy/:level1/:level2?', postCategoryCtrl.getPostsByCategoryHierarchy)

// 📌 POSTS POR OPERACIÓN DE INMOBILIARIA
router.get('/posts/immobilier/operation/:operationId', postCategoryCtrl.getPostsByImmobilierOperation)

// ========== RUTAS ALIAS PARA COMPATIBILIDAD ==========
router.get('/category/:category', (req, res, next) => {
    req.params.level1 = req.params.category
    postCategoryCtrl.getPostsByCategoryHierarchy(req, res, next)
})

router.get('/category/:category/:subcategory', (req, res, next) => {
    req.params.level1 = req.params.category
    req.params.level2 = req.params.subcategory
    postCategoryCtrl.getPostsByCategoryHierarchy(req, res, next)
})

// Ruta para sub-subcategorías (si necesitas compatibilidad)
router.get('/categories/:category/:subcategory/subsubcategories', postCategoryCtrl.getSubSubCategories)

module.exports = router