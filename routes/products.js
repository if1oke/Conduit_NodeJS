const express = require('express')
const router = express.Router()

const {authByToken} = require('../middleware/auth')
const ProductsController = require('../controllers/products')

router.get('/', ProductsController.getAllProducts)
router.post('/', authByToken, ProductsController.createProduct)
router.post('/upload', ProductsController.uploadImage)
router.get('/:id', ProductsController.getProduct)
router.delete('/:id', authByToken, ProductsController.deleteProduct)
router.patch('/:id', authByToken, ProductsController.updateProduct)

module.exports = router