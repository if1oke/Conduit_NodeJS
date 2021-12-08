const {DataTypes} = require('sequelize')
const sequelize = require('../dbConnection')

const Products = sequelize.define('Products', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    composition: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL,
        decimals: 2,
        allowNull: false
    },
    weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
        default: 100
    },
    available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING
    }
})

module.exports = Products
