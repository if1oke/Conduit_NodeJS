const Product = require('../models/Products')
const User = require('../models/User')
const Cart = require('../models/Cart')
const sequelize = require('../dbConnection')

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
            const updatedCart = await cartItem[0].update({productCount})
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