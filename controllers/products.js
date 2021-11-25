const Tag = require('../models/Tag');
const Products = require('../models/Products');
const crypto = require('crypto')
const mime = require('mime-types')

module.exports.uploadImage = async (req, res) => {
    try {

        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).send('No files were uploaded.');
        }

        const file = req.files.image
        const hashName = crypto.createHash('sha1').update(file.name + new Date().getMilliseconds()).digest('hex')
        const path = __dirname + '/../static/upload/' + hashName + '.' + mime.extension(file.mimetype)
        await file.mv(path, (err) => {
            if (err) {
                return res.status(500).send(err)
            } else {
                res.status(200).json({'fileName': `${hashName}.${mime.extension(file.mimetype)}`})
            }
        })
    } catch (e) {
        return res.status(422).json({
            errors: { body: ['Could not create product', e.message] },
        });
    }
}

module.exports.createProduct = async (req, res) => {
    try {
        const data = req.body.product;
        console.log(data)
        if (!data.category) throw new Error('No category selected');
        if (!data.name) throw new Error('Name is required');
        if (!data.description) throw new Error('Description is required');
        if (!data.price) throw new Error('Price is required');
        if (!data.weight) throw new Error('Weight is requred');

        if (!data.image) data.image = null;

        let product = await Products.create({
            category: data.category,
            name: data.name,
            description: data.description,
            price: data.price,
            weight: data.weight,
            available: data.available,
            image: data.image
        })

        if (data.tagList) {
            for (let t of data.tagList) {
                let tagExists = await Tag.findByPk(t);
                let newTag;
                if (!tagExists) {
                    newTag = await Tag.create({ name: t });
                    product.addTag(newTag);
                } else {
                    product.addTag(tagExists);
                }
            }
        }

        product = await Products.findByPk(product.id, {include: Tag})
        res.status(201).json({product})
    } catch (e) {
        return res.status(422).json({
            errors: { body: ['Could not create product', e.message] },
        });
    }
}

module.exports.getProduct = async (req, res) => {
    try {
        const { id } = req.params;
        let product = await Products.findByPk(id, {include: Tag});
        res.status(200).json({ product })
    } catch (e) {
        return res.status(422).json({
            errors: { body: ['Could not get product', e.message] },
        });
    }
}

module.exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        let product = await Products.findByPk(id, {include: Tag})

        if (!product) {
            res.status(404);
            throw new Error('Product not found')
        }

        await Products.destroy({where: {id: id}})
        res.status(200).json({message: 'Product deleted successfully'})
    } catch (e) {
        const code = res.statusCode ? res.statusCode : 422;
        return res.status(code).json({
            errors: { body: ['Could not delete product', e.message] },
        });
    }
}

module.exports.updateProduct = async (req, res) => {
    try {
        if (!req.body.product) throw new error('No product data');
        const data = req.body.product
        const id = req.params.id
        let product = await Products.findByPk(id, {include: Tag})

        if (!product) {
            res.status(404)
            throw new Error('Product not found')
        }

        const category = data.category ? data.category : product.category
        const name = data.name ? data.name : product.name
        const description = data.description ? data.description : product.description
        const price = data.price ? data.price : product.price
        const available = data.available ? data.available : product.available
        const weight = data.weight ? data.weight : product.weight

        const updatedProduct = await product.update({category, name, description, price, available, weight})
        await product.save()
        res.status(200).json({updatedProduct})
    } catch (e) {
        const code = res.statusCode ? res.statusCode : 422
        return res.statusCode(code).json({
            errors: {body: ['Could not update product', e.message]}
        })
    }
}

module.exports.getAllProducts = async (req, res) => {
    try {
        const { tag, limit = 20, offset = 0 } = req.query;
        let product;
        if (tag) {
            product = await Products.findAll({
                include: [
                    {
                        model: Tag,
                        attributes: ['name'],
                        where: {name: tag}
                    }
                ],
                limit: parseInt(limit),
                offset: parseInt(offset)
            })
        } else {
            product = await Products.findAll({
                include: [
                    {
                        model: Tag,
                        attributes: ['name'],
                    }
                ],
                limit: parseInt(limit),
                offset: parseInt(offset)
            })
        }
        let products = []
        for (let p in product) {
            let clean_product = product[p]
            delete clean_product.dataValues.createdAt
            delete clean_product.dataValues.updatedAt
            let newTagsList = []
            for (let t of clean_product.dataValues.Tags) {
                newTagsList.push(t.name)
            }
            delete clean_product.dataValues.Tags
            clean_product.dataValues.tagList = newTagsList
            products.push(clean_product)
        }

        res.json({products})
    } catch (e) {
        const code = res.statusCode ? res.statusCode : 422;
        return res.status(code).json({
            errors: { body: ['Error getting products', e.message] },
        });
    }
}
