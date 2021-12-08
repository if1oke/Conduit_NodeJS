const express = require('express')
const router = express.Router()

const {authByToken, authByTokenAdmin} = require('../middleware/auth')
const ProductsController = require('../controllers/products')

const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'static/upload/')
    },
    filename: function (req, file, cb) {
        cb(null, (Date.now() + '_' + file.originalname).replace(' ', ''))
    }
})
const upload = multer({storage: storage})

router.get('/', ProductsController.getAllProducts)
router.post('/', authByTokenAdmin, ProductsController.createProduct)
router.post('/upload', ProductsController.uploadImage)
router.post('/uploadMulti', upload.array('multi-files', 10), ProductsController.uploadM)
router.delete('/image', authByTokenAdmin, ProductsController.deleteImage)
router.get('/:id', ProductsController.getProduct)
router.delete('/:id', authByTokenAdmin, ProductsController.deleteProduct)
router.patch('/:id', authByTokenAdmin, ProductsController.updateProduct)

module.exports = router
