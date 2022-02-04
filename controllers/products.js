const Tag = require('../models/Tag');
const Products = require('../models/Products');
const Image = require('../models/Image')
const crypto = require('crypto')
const mime = require('mime-types')
const Manufacturer = require('../models/Manufacturer')

module.exports.deleteImage = async (req, res) => {
    try {
        console.log(req.body.image)
        const image = await Image.findByPk(req.body.image)
        if (!image) {
            res.status(404);
            throw new Error('Product not found')
        }
        await Image.destroy({where: {name: req.body.image}})
        res.status(200).json({'status': 'success'})
    } catch (e) {
        return res.status(422).json({
            errors: { body: ['Could not delete image', e.message] },
        });
    }
}

module.exports.uploadM = async (req, res) => {
    try {
        let file = ''
        const re = new RegExp(/\d$/)
        const productId = req.get('Referrer').match(re)[0]

        const product = await Products.findByPk(productId)

        if (!product) {
            res.status(404);
            throw new Error('Product not found')
        }

        req.files.forEach(item => {
            filename = item.filename
        })

        if (req.files) {
            for (let item of req.files) {
                let imageExists = await Image.findByPk(item.filename);
                let newImage;
                if (!imageExists) {
                    newImage = await Image.create({ name: item.filename });
                    product.addImage(newImage);
                } else {
                    product.addImage(imageExists);
                }
            }
        }

        res.status(200).send(file)
    } catch (e) {
        return res.status(422).json({
            errors: { body: ['Could not upload image', e.message] },
        });
    }
}

module.exports.uploadImage = async (req, res) => {
    try {

        // if (!req.files || Object.keys(req.files).length === 0) {
        //     return res.status(400).send('No files were uploaded.');
        // }

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
        if (!data.weight) throw new Error('Weight is required');
        if (!data.manufacturer) throw new Error('Manufacturer is required');
        if (!data.composition) throw new Error('Composition is required')

        if (!data.image) data.image = null;

        let manExist = await Manufacturer.findByPk(data.manufacturer)
        if (!manExist) {
            manExist = await Manufacturer.create({name: data.manufacturer})
        }

        let product = await Products.create({
            CategoryName: data.category,
            ManufacturerName: manExist.name,
            name: data.name,
            description: data.description,
            price: data.price,
            weight: data.weight,
            available: data.available,
            composition: data.composition,
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

        product = await Products.findByPk(product.id, {include: [Tag, Image]})
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
        let product = await Products.findByPk(id, {include: [Tag, Image]});
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
        let product = await Products.findByPk(id, {include: [Tag, Image]})

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
        let product = await Products.findByPk(id, {include: [Tag, Image]})

        if (!product) {
            res.status(404)
            throw new Error('Product not found')
        }

        const CategoryName = data.category ? data.category : product.CategoryName
        const name = data.name ? data.name : product.name
        const description = data.description ? data.description : product.description
        const price = data.price ? data.price : product.price
        const available = data.available ? data.available : product.available
        const weight = data.weight ? data.weight : product.weight
        const composition = data.composition ? data.composition : product.composition
        const ManufacturerName = data.manufacturer ? data.manufacturer : product.ManufacturerName
        const image = data.image ? data.image : product.image

        const updatedProduct = await product.update({CategoryName, name, description, price, available, weight, composition, ManufacturerName, image})
        await product.save()

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
