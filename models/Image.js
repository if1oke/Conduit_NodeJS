const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Image = sequelize.define('Image', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    }
})

module.exports = Image
