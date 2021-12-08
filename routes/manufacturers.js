const express = require('express')
const router = express.Router()
const ManufactureController = require('../controllers/manufacturer')

router.get('/', ManufactureController.getManufacturers)

module.exports = router