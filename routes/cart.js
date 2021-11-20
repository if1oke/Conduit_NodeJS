const express = require('express')
const router = express.Router()
const CartController = require('../controllers/cart')
const {authByToken} = require('../middleware/auth')

router.post('/', authByToken, CartController.addToCart)

module.exports = router