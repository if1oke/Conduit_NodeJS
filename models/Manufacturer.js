const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Manufacturer = sequelize.define('Manufacturer',{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    }
},{
    timestamps: false
})

module.exports = Manufacturer