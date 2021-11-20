const Product = require('../models/Products')
const User = require('../models/User')
const Comment = require('../models/Comments')

module.exports.postNewComment = async (req,res) => {
    try{
        const idProduct = req.params.id
        const data = req.body.comment
        //Throw error if no data
        if(!data){
            res.status(422)
            throw new Error('Comment is required')
        }
        
        if(!data.body){
            res.status(422)
            throw new Error('Comment body is required')
        }

        //Find for article
        const product = await Product.findByPk(idProduct)
        if(!product){
            res.status(404)
            throw new Error('Product not found')
        }
        
        //Checking whthter this user has aldready posted a comment
        const existingComment = await Comment.findAll({where:{UserEmail: req.user.email}})
        if(existingComment.length > 0){
            throw new Error('You aldready added a comment')
        }

        //Create new Comment
        const newComment = await Comment.create({body:data.body})

        //Find user
        const user = await User.findByPk(req.user.email)

        //assosiations
        user.addComments(newComment)
        product.addComments(newComment)

        //Send output
        newComment.dataValues.author = {
            username: user.dataValues.username,
            bio: user.dataValues.bio,
            image: user.dataValues.image,
        }

        res.status(201).json({newComment})

    }catch(e) {
        const code = res.statusCode ? res.statusCode : 422
        return res.status(code).json({
            errors: { body: [ 'Could not create comment', e.message ] }
        })
    }
}

module.exports.getAllComments = async (req,res) => {
    try{
        const idProduct = req.params.id

        //Find for article
        const product = await Product.findByPk(idProduct)
        if(!product){
            res.status(404)
            throw new Error('Product id not valid')
        }
        
        const comments = await Comment.findAll({
            where:{
                ProductId: idProduct
            },
            include:[
                {
                    model: User,
                    attributes: ['username','bio','image']
                }
            ]
        })

        res.status(201).json({comments})

    }catch(e) {
        const code = res.statusCode ? res.statusCode : 422
        return res.status(code).json({
            errors: { body: [ 'Could not find product', e.message ] }
        })
    }
}

module.exports.deleteComment = async (req,res) => {
    try{
        const productId = req.params.id
        const commentId = req.params.comment_id
        //Find for article
        const product = await Product.findByPk(productId)
        if(!product){
            res.status(404)
            throw new Error('Product not found')
        }
        
        //Find for comment
        const comment = await Comment.findByPk(commentId)
        if(!comment){
            res.status(404)
            throw new Error('Comment not found')
        }

        //Check whether logged in user is the author of that comment
        // if(req.user.email != comment.UserEmail){
        //     res.status(403)
        //     throw new Error("You must be the author to modify this comment")
        // }

        //Delete comment
        await Comment.destroy({where:{id:commentId}})
        res.status(200).json({"message":"Comment deleted successfully"})

    }catch(e) {
        const code = res.statusCode ? res.statusCode : 422
        return res.status(code).json({
            errors: { body: [ 'Could not delete comment', e.message ] }
        })
    }
}