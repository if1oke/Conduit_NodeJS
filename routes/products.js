const express = require('express')
const router = express.Router()

const {authByToken, authByTokenAdmin} = require('../middleware/auth')
const ProductsController = require('../controllers/products')

router.get('/', ProductsController.getAllProducts)
router.post('/', authByTokenAdmin, ProductsController.createProduct)
router.post('/upload', ProductsController.uploadImage)
router.get('/:id', ProductsController.getProduct)
router.delete('/:id', authByTokenAdmin, ProductsController.deleteProduct)
router.patch('/:id', authByTokenAdmin, ProductsController.updateProduct)

module.exports = router
