const express = require('express')
const router = express.Router()
const {authByTokenAdmin} = require('../middleware/auth')

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

module.exports = router
