const Product = require('../models/Products')
const User = require('../models/User')
const Cart = require('../models/Cart')

module.exports.getCart = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.email)
        if(!user){
            res.status(404)
            throw new Error('User not found')
        }

        let cart = await Cart.findAll({
            where: {
                userEmail: user.email
            }
        })
        res.json({cart})
    } catch (e) {
        const code = res.statusCode ? res.statusCode : 422;
        return res.status(code).json({
            errors: { body: ['Error getting cart', e.message] },
        });
    }
}

module.exports.removeFromCart = async (req, res) => {
    try {
        const idProduct = req.body.product
        if(!idProduct){
            res.status(422)
            throw new Error('Product is required')
        }

        const product = await Product.findByPk(idProduct)
        if(!product){
            res.status(404)
            throw new Error('Product not found')
        }

        const user = await User.findByPk(req.user.email)
        if(!user){
            res.status(404)
            throw new Error('User not found')
        }

        const cartItem = await Cart.findAll({
            where: {
                userEmail: user.email,
                productId: product.id
            }
        })

        if (cartItem.length !== 0) {
            await Cart.destroy({
                where: {
                    userEmail: user.email,
                    productId: product.id
                }
            })
            res.status(200).json({'message': 'product was removed from cart'})
        } else {
            res.status(404)
            throw new Error('product not found in cart')
        }
    } catch (e) {
        const code = res.statusCode ? res.statusCode : 422
        return res.status(code).json({
            errors: { body: [ 'Could not delete item from cart', e.message ] }
        })
    }
}

module.exports.updateCart = async (req, res) => {
    try {
        const idProduct = req.body.product
        if(!idProduct){
            res.status(422)
            throw new Error('Product is required')
        }

        const action = req.body.action
        if(!action){
            res.status(422)
            throw new Error('Action is required')
        }

        if (action !== 'increase' || action !== 'decrease') {
            res.status(422)
            throw new Error('Provide valid action')
        }

        const user = await User.findByPk(req.user.email)
        if(!user){
            res.status(404)
            throw new Error('User not found')
        }

        const cartItem = await Cart.findAll({
            where: {
                userEmail: user.email,
                productId: product.id
            }
        })

        if (cartItem.length !== 0) {
            if (action === 'increase') {
                const productCount = cartItem[0].productCount + 1
                await cartItem[0].update({productCount})
            } else if (cartItem[0].productCount > 1) {
                const productCount = cartItem[0].productCount - 1
                await cartItem[0].update({productCount})
            } else {
                await cartItem[0].destroy()
            }
            let userCart = await Cart.findAll({
                where: {
                    userEmail: user.email
                }
            })
            res.status(201).json({userCart})
        } else {
            res.status(404)
            throw new Error('product not found in cart')
        }
    } catch (e) {
        const code = res.statusCode ? res.statusCode : 422
        return res.status(code).json({
            errors: { body: [ 'Could not update item in cart', e.message ] }
        })
    }
}

module.exports.addToCart = async (req, res) => {
    try {

        const idProduct = req.body.product
        if(!idProduct){
            res.status(422)
            throw new Error('Product is required')
        }


        const product = await Product.findByPk(idProduct)
        if(!product){
            res.status(404)
            throw new Error('Product not found')
        }

        const user = await User.findByPk(req.user.email)
        if(!user){
            res.status(404)
            throw new Error('User not found')
        }

        // Check exist
        const cartItem = await Cart.findAll({
            where: {
                userEmail: user.email,
                productId: product.id
            }
        })

        if (cartItem.length === 0) {
            let item = await Cart.create({
                userEmail: user.email,
                productId: product.id,
                productCount: 1
            })

        } else {
            const productCount = cartItem[0].productCount + 1
            await cartItem[0].update({productCount})
        }


        let userCart = await Cart.findAll({
            where: {
                userEmail: user.email
            }
        })
        res.status(201).json({userCart})
    } catch (e) {
        const code = res.statusCode ? res.statusCode : 422;
        return res.status(code).json({
            errors: { body: ['Could not add to cart', e.message] },
        });
    }
}