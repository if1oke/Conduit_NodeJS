const express = require('express')
const router = express.Router()

const {authByToken, authByTokenAdmin} = require('../middleware/auth')

const CategoriesController = require('../controllers/categories')

router.get('/', CategoriesController.getAllCategories)
router.post('/', authByTokenAdmin, CategoriesController.addCategory)
router.patch('/:categoryName', authByTokenAdmin, CategoriesController.updateCategory)
router.delete('/:categoryName', authByTokenAdmin, CategoriesController.deleteCategory)

module.exports = router
