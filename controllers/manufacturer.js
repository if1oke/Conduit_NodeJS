const Manufacturer = require('../models/Manufacturer')

module.exports.getManufacturers = async (req, res) => {
    try {
        const manufacturers = await Manufacturer.findAll()
        return res.status(200).json({manufacturers})
    } catch (e) {
        res.status(422).json({errors: { body: [  e.message ] }})
    }
}