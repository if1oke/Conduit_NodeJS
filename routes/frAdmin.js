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

module.exports = router
