const Categories = require('../models/Categories')

module.exports.getAllCategories = async(req,res) => {
    try{
        const getCategories = await Categories.findAll();
        const categories = []
        if(getCategories)
            for(let cat of getCategories){
                categories.push(cat.dataValues.name)
            }
        res.status(200).json({categories})
    }catch(e){
        const code = res.statusCode ? res.statusCode : 422;
        return res.status(code).json({
            errors: { body: ['Could not update article', e.message] },
        });
    }
}

module.exports.deleteCategory = async(req, res) => {
    try {
        const {categoryName} = req.params

        const category = await Categories.findByPk(categoryName)
        if (!category) {
            res.status(404);
            throw new Error('Категория не найдена')
        }

        await Categories.destroy({where: {name: categoryName}})

        const categories = await Categories.findAll()

        res.status(200).json({categories})
    } catch (e) {
        const code = res.statusCode ? res.statusCode : 422;
        return res.status(code).json({
            errors: { body: ['Could not update article', e.message] },
        });
    }
}

module.exports.addCategory = async(req, res) => {
    try {
        const data = req.body.category
        if (!data) throw new Error('Категория не найдена')

        await Categories.create({
            name: data.name
        })

        const categories = Categories.findAll()
        res.status(200).json({categories})
    } catch (e) {
        const code = res.statusCode ? res.statusCode : 422;
        return res.status(code).json({
            errors: { body: ['Could not update category', e.message] },
        });
    }
}

module.exports.updateCategory = async(req, res) => {
    try {
        const {categoryName} = req.params
        const data = req.body.category

        let category = await Categories.findByPk(categoryName)
        if (!category) throw new Error('Категория не найдена')

        const name = data.name ? data.name : category.name

        await Categories.update({name: name}, {where: {name: categoryName}})

        const categories = await Categories.findAll()

        res.status(200).json({categories})
    } catch (e) {
        const code = res.statusCode ? res.statusCode : 422;
        return res.status(code).json({
            errors: { body: ['Could not update category', e.message] },
        });
    }
}
