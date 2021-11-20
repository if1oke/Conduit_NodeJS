const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Cart = sequelize.define('Cart',{
    userEmail: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    productCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
})

module.exports = Cart