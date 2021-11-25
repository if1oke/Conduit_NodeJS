const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Category = sequelize.define('Categories',{
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    }
},{
    timestamps: false
})

module.exports = Category
