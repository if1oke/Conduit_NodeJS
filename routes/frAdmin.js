const express = require('express')
const router = express.Router()
const Product = require('../models/Products')
const {authByTokenAdmin} = require('../middleware/auth')
const Tag = require("../models/Tag");

router.get('/login', (req, res) => {
    res.render('admin/login.hbs', {
        title: 'Авторизация'
    })
})

router.get('/', (req, res) => {
    res.render('admin/dashboard.hbs', {
        layout: 'layouts/layout_admin',
        title: 'Панель управления',
        breadcrumb: ['Главная страница']
    })
})

router.get('/users', (req, res) => {
    res.render('admin/users.hbs', {
        layout: 'layouts/layout_admin',
        title: 'Учетные записи',
        breadcrumb: ['Главная страница', 'Пользователи']
    })
})

router.get('/products', (req, res) => {
    res.render('admin/products.hbs', {
        layout: 'layouts/layout_admin',
        title: 'Список товаров',
        breadcrumb: ['Главная страница', 'Товары']
    })
})

router.get('/products/create', (req, res) => {
    res.render('admin/product.hbs', {
        layout: 'layouts/layout_admin',
        title: 'Создание товара',
        breadcrumb: ['Главная страница', 'Товары', 'Создание товара'],
        createProduct: true
    })
})

router.get('/products/:id', async (req, res) => {
    const { id } = req.params
    const product = await Product.findByPk(id, {include: Tag})
    if (product) {
        res.render('admin/product.hbs', {
            layout: 'layouts/layout_admin',
            title: product.name,
            itemName: product.name,
            productId: product.id,
            productImg: product.image,
            breadcrumb: ['Главная страница', 'Товары', 'Просмотр товара'],
            showProduct: true
        })
    } else {
        res.render('admin/404.hbs', {
            layout: 'layouts/layout_admin',
            title: '404',
            errorItem: `Продукт #${id}`
        })
    }
})

module.exports = router
