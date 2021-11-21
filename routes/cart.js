const express = require('express')
const router = express.Router()
const CartController = require('../controllers/cart')
const {authByToken} = require('../middleware/auth')

router.get('/', authByToken, CartController.getCart)
router.post('/', authByToken, CartController.addToCart)
router.delete('/', authByToken, CartController.removeFromCart)
router.patch('/', authByToken, CartController.updateCart)

module.exports = router